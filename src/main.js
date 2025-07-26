// -- Imports --

// External Game Library
import Phaser from "phaser";

// Local Files
import GameScene from "./gamescene.js";
import Minigame from "./Minigame.js";

//-- Body --
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [GameScene, Minigame],
};

// -- Config --
new Phaser.Game(config);
