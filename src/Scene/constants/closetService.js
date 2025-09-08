// ClosetService.js
import ClosetObjectManager from "../../interactions/ClosetObject.js";
import OutlineManager from "../../interactions/outline.js";

export default class ClosetService {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.closetObjectManager = new ClosetObjectManager(scene);
    this.outlineManager = null;
    this.closets = [];
  }

  create() {
    this.closets = this.closetObjectManager.createClosetZonesFromMap();
    this.outlineManager = new OutlineManager(
      this.scene,
      this.player,
      this.closets
    );
  }

  update() {
    if (this.outlineManager) {
      this.outlineManager.update();
    }
  }

  getClosets() {
    return this.closets;
  }
}
