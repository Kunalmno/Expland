// PlayerService.js
import { PlayerInteractions } from "../../interactions/PlayerInteractions.js";
import Player from "../../movement/player.js";
import { PLAYER_INTERACTION_CONFIG } from "./gamescenedata.js";

const { key, Url } = PLAYER_INTERACTION_CONFIG;

export default class PlayerService {
  constructor(scene, keyBinding) {
    this.scene = scene;
    this.keyBinding = keyBinding;
    this.player = null;
    this.interactions = null;
    this.actionKeys = null;

    console.log(key);
    console.log(Url);
  }

  preload() {
    this.scene.load.spritesheet(playerConfig.key, playerConfig.path, {
      frameWidth: playerConfig.frameWidth,
      frameHeight: playerConfig.frameHeight,
    });

    // Interaction sprite (hoe, cut, water animations, etc.)
    this.scene.load.spritesheet(
      PLAYER_INTERACTION_CONFIG.PlayerKey,
      PLAYER_INTERACTION_CONFIG.PlayerURL,
      { frameWidth: 48, frameHeight: 48 }
    );
  }

  create() {
    this.player = new Player(this.scene, 100, 100, this.keyBinding);

    this.actionKeys = {
      cut: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      hoe: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
      water: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    };

    this.interactions = new PlayerInteractions(this.scene, this.player);
  }

  update() {
    this.player?.update();
    this.interactions?.update(
      this.scene.input.keyboard.createCursorKeys(),
      this.actionKeys
    );
  }

  getPlayer() {
    return this.player;
  }
}
