// -- Imports --

// External Game Library
import Phaser from "phaser";
import PauseMenuScene from "./Map/PauseMenuScene";
import UIMap from "./Map/UImap";
import BridgeTestScene from "./Scene/BridgeScene";
import GameScene from "./Scene/gamescene";
//-- Body --
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  roundPixels: true,
  render: {
    pixelArt: true,
    antialias: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    // default: "Matter",
    // Matter: {
    //   debug: true, // Optional: show physics bodies
    //   gravity: { x: 0, y: 1 },
    // },
    default: "arcade",
    arcade: {
      debug: false, // Optional: show physics bodies
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [GameScene, UIMap, PauseMenuScene],
  // scene: [BridgeTestScene],
};

// -- Config --
new Phaser.Game(config);
