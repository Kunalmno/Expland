export default class ItemPickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, itemData) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.itemData = itemData;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setInteractive();
  }

  onPickup(player, inventoryManager) {
    inventoryManager.addItem(this.itemData);
    this.destroy();
  }
}
