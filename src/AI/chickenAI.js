import { CHICKEN_ANIMATION_FRAMES } from "../constants/characterAnimation.js";
import {
  CHARACTER_CONFIG,
  DIRECTION_RANGE,
  SPRITE_CONFIG,
  STATE,
} from "../constants/characterConfig.js";

/**
 * @typedef {import('phaser').Scene} Phaser.Scene
 * @typedef {import('phaser').Types.Physics.Arcade.SpriteWithDynamicBody} Phaser.Physics.Arcade.Sprite
 */
export default class Chicken {
  /** @type {Phaser.Scene} */ scene;
  /** @type {Phaser.Physics.Arcade.Sprite} */ sprite;
  /** @type {number} */ direction;
  /** @type {string} */ state;
  /** @type {number} */ speed;

  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, CHARACTER_CONFIG.AnimalKey);
    this.sprite.setDepth(SPRITE_CONFIG.Depth);
    this.sprite.setCollideWorldBounds(true);

    this.speed = SPRITE_CONFIG.Speed;
    this.direction = Phaser.Math.Between(
      DIRECTION_RANGE.from,
      DIRECTION_RANGE.to
    );
    this.state = STATE.IDLE;

    this._createAnimations();
    this._playIdleAnim();
    this._startBehaviorCycle();
  }

  /**
   * Internal: Creates walk and idle animations from config
   */
  _createAnimations() {
    const anims = this.scene.anims;
    const key = CHARACTER_CONFIG.AnimalKey;

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

    for (const type in CHICKEN_ANIMATION_FRAMES) {
      for (const dir in CHICKEN_ANIMATION_FRAMES[type]) {
        const animName = `${key}-${type}-${dir}`;
        createAnim(animName, CHICKEN_ANIMATION_FRAMES[type][dir]);
      }
    }
  }

  /**
   * Internal: Starts the idle/moving behavior cycle
   */
  _startBehaviorCycle() {
    this._setState(STATE.IDLE);

    this.scene.time.addEvent({
      delay: SPRITE_CONFIG.Delay,
      callback: () => {
        this._setState(STATE.MOVING);
        this.direction = Phaser.Math.Between(
          DIRECTION_RANGE.from,
          DIRECTION_RANGE.to
        );
        this._playDirectionAnim();

        this.scene.time.addEvent({
          delay: SPRITE_CONFIG.Delay,
          callback: () => this._startBehaviorCycle(),
          callbackScope: this,
        });
      },
      callbackScope: this,
    });
  }

  /**
   * Internal: Sets state and plays matching animation
   * @param {string} state
   */
  _setState(state) {
    this.state = state;
    if (state === STATE.IDLE) {
      this.sprite.setVelocity(0, 0);
      this._playIdleAnim();
    }
  }

  /**
   * Internal: Plays idle animation based on current direction
   */
  _playIdleAnim() {
    const directionName = this._getDirectionName();
    if (!directionName) return;

    const animKey = `${CHARACTER_CONFIG.AnimalKey}-idle-${directionName}`;
    this.sprite.anims.play(animKey);
  }

  /**
   * Internal: Plays walk animation based on current direction
   */
  _playDirectionAnim() {
    const directionName = this._getDirectionName();
    if (!directionName) return;

    const animKey = `${CHARACTER_CONFIG.AnimalKey}-walk-${directionName}`;
    this.sprite.anims.play(animKey, true);
  }

  /**
   * Internal: Gets string name for current direction
   * @returns {string | null}
   */
  _getDirectionName() {
    const map = {
      [SPRITE_CONFIG.Direction.up]: "up",
      [SPRITE_CONFIG.Direction.down]: "down",
      [SPRITE_CONFIG.Direction.left]: "left",
      [SPRITE_CONFIG.Direction.right]: "right",
    };
    return map[this.direction] ?? null;
  }

  /**
   * Updates the chicken each frame. Handles movement and direction change.
   */
  update() {
    if (this.state !== STATE.MOVING) return;
    if (!this.sprite.body) return;

    const velocity = this.speed;

    switch (this.direction) {
      case SPRITE_CONFIG.Direction.up:
        this.sprite.setVelocity(0, -velocity);
        break;
      case SPRITE_CONFIG.Direction.down:
        this.sprite.setVelocity(0, velocity);
        break;
      case SPRITE_CONFIG.Direction.left:
        this.sprite.setVelocity(-velocity, 0);
        break;
      case SPRITE_CONFIG.Direction.right:
        this.sprite.setVelocity(velocity, 0);
        break;
    }

    this._handleBounds();
  }

  /**
   * Internal: Handles collision with world bounds and reverses direction
   */
  _handleBounds() {
    const bounds = this.scene.physics.world.bounds;
    const { x, y, width, height } = this.sprite.body;

    if (x <= bounds.x) {
      this.direction = SPRITE_CONFIG.Direction.right;
      this._playDirectionAnim();
    } else if (x + width >= bounds.width) {
      this.direction = SPRITE_CONFIG.Direction.left;
      this._playDirectionAnim();
    }

    if (y <= bounds.y) {
      this.direction = SPRITE_CONFIG.Direction.down;
      this._playDirectionAnim();
    } else if (y + height >= bounds.height) {
      this.direction = SPRITE_CONFIG.Direction.up;
      this._playDirectionAnim();
    }
  }
}
