export default class AxeManager {
  constructor(scene, player, treeManager) {
    this.scene = scene;
    this.player = player;
    this.treeManager = treeManager;
  }

  swingAxe(direction) {
    const { x, y } = this.player.sprite;
    let offsetX = 0,
      offsetY = 0;

    if (direction === "up") {
      offsetY = -12;
      offsetX = 0.5;
    }
    if (direction === "down") {
      offsetY = 10;
      offsetX = -1;
    }
    if (direction === "left") {
      offsetX = -10;
      offsetY = 6;
    }
    if (direction === "right") {
      offsetX = 10;
      offsetY = 6;
    }

    // Create hitbox
    const hitbox = this.scene.add.rectangle(
      x + offsetX,
      y + offsetY,
      10,
      10,
      0xff0000,
      0
    );
    this.scene.physics.add.existing(hitbox);
    hitbox.body.setAllowGravity(false);

    // Check overlap with trees, but let TreeManager handle HP
    for (let [pointId, treeData] of this.treeManager.activeTrees.entries()) {
      this.scene.physics.add.overlap(hitbox, treeData.sprite, () => {
        this.treeManager.cutTree(pointId); // ✅ delegate damage
      });
    }

    // Destroy hitbox after short time
    this.scene.time.delayedCall(200, () => hitbox.destroy());
  }
}
