// ChickenService.js
import Chicken from "../AI/chickenAI.js";
import { chickenConfig } from "../config/gamesceneData.js";

export default class ChickenService {
  constructor(scene) {
    this.scene = scene;
    this.chickens = [];
  }

  preload() {
    this.scene.load.spritesheet(chickenConfig.key, chickenConfig.path, {
      frameWidth: chickenConfig.frameWidth,
      frameHeight: chickenConfig.frameHeight,
    });
  }

  create(spawnPoints = [{ x: 100, y: 100 }]) {
    this.chickens = spawnPoints.map((p) => new Chicken(this.scene, p.x, p.y));
  }

  update() {
    this.chickens.forEach((ch) => ch.update());
  }

  getChickens() {
    return this.chickens;
  }
}
