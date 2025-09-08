// ===============================
// Imports (constants & utils)
// ===============================
import { EMOJI_SELECTOR_CONFIG } from "../config/UIObjectConfig.js";
import { PLAYER_ANIMATION_FRAMES } from "../constants/playerAnimation.js";
import {
  PLAYER_CONFIG,
  SPRITE_CONFIG,
  STATE,
} from "../constants/playerConfig.js";
import { getMovement as defaultGetMovement } from "./playerMovement.js";

// ===============================
// Player Class
// ===============================
export default class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene - The game scene
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {object} keyBinding - Input key bindings
   * @param {Function} [getMovementFn] - Optional override for getMovement (useful for testing)
   */
  constructor(scene, x, y, keyBinding, getMovementFn) {
    super(scene, x, y, PLAYER_CONFIG.PlayerKey);

    // Add to scene + physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.keyBinding = keyBinding;

    // Basic player setup
    this.setDepth(SPRITE_CONFIG.Depth);
    this.setCollideWorldBounds(true);

    // Physics body size + offset (hitbox tuning)
    this.body.setSize(7, 3);
    this.body.setOffset(20, 28.5);

    this.emojiSprite = scene.add
      .image(
        this.x,
        this.y - 40,
        EMOJI_SELECTOR_CONFIG.emojidata.key,
        EMOJI_SELECTOR_CONFIG.emojidata.frame
      )
      .setDepth(1000);

    // Core state
    this.direction = "down";
    this.state = STATE.IDLE;
    this.speed = SPRITE_CONFIG.Speed;

    // Movement logic (allow injection for tests)
    this.getMovement = getMovementFn ?? defaultGetMovement;

    // Setup animations
    this._createAnimations();
  }

  // ===============================
  // Emoji Logic
  // ===============================

  /** Keep emoji positioned above player */
  updateEmojiPosition() {
    if (this.emojiSprite) {
      this.emojiSprite.setPosition(this.x, this.y - 40);
    }
  }

  /** Assign a new emoji to show above player */
  setEmoji(emojiKey, emojiFrame) {
    this.emojiSprite.setTexture(emojiKey, emojiFrame);
    this.emojiSprite.setVisible(true);
  }

  // ===============================
  // Phaser Lifecycle
  // ===============================

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.updateEmojiPosition();
  }

  update() {
    if (this.state === STATE.INTERACTING) return;

    const movementData = this._handleInput();
    this._applyMovement(movementData);
    this._updateAnimation(movementData);
  }

  // ===============================
  // Input + Movement
  // ===============================

  _handleInput() {
    const { cursors, keys } = this.keyBinding;
    return this.getMovement(cursors, keys, this.speed);
  }

  _applyMovement({ velocityX, velocityY }) {
    this.setVelocity(velocityX, velocityY);

    this.state = velocityX !== 0 || velocityY !== 0 ? STATE.MOVING : STATE.IDLE;
  }

  // ===============================
  // Animations
  // ===============================

  _createAnimations() {
    const anims = this.scene.anims;
    const key = PLAYER_CONFIG.PlayerKey;

    const createAnim = (name, { start, end, frameRate }) => {
      if (!anims.exists(name)) {
        anims.create({
          key: name,
          frames: anims.generateFrameNumbers(key, { start, end }),
          frameRate,
          repeat: -1,
        });
      }
    };

    for (const type in PLAYER_ANIMATION_FRAMES) {
      for (const dir in PLAYER_ANIMATION_FRAMES[type]) {
        const animName = `${type}-${dir}`;
        createAnim(animName, PLAYER_ANIMATION_FRAMES[type][dir]);
      }
    }
  }

  _updateAnimation({ direction, animKey }) {
    this.direction = direction;
    const animToPlay =
      this.state === STATE.MOVING ? animKey : `idle-${this.direction}`;
    this.anims.play(animToPlay, true);
  }
}
