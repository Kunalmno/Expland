// TreeService.js
import AxeManager from "../../interactions/randomtrees/axe";
import TreeManager from "../../interactions/randomtrees/trees";

export default class TreeService {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.treeManager = null;
    this.axeManager = null;
  }

  create(actionKeys) {
    this.treeManager = new TreeManager(this.scene, this.player, actionKeys);
    this.treeManager.loadSpawnPoints("TreeSpawnPoints");
    this.treeManager.spawnInitialTrees();

    this.axeManager = new AxeManager(this.scene, this.player, this.treeManager);
  }

  update() {
    if (this.treeManager) {
      this.treeManager.update();
    }
  }

  getTreeManager() {
    return this.treeManager;
  }

  getAxeManager() {
    return this.axeManager;
  }
}
