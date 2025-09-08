// Camera.js
export default class CameraController {
  constructor(scene, map) {
    this.scene = scene;
    this.map = map; // must always be a Phaser.Tilemaps.Tilemap
  }

  setup(playerSprite) {
    if (
      !playerSprite ||
      !(playerSprite instanceof Phaser.Physics.Arcade.Sprite)
    ) {
      console.warn("❌ Invalid player sprite passed to camera controller.");
      return;
    }

    const cam = this.scene.cameras.main;
    cam.setZoom(5);
    cam.setRoundPixels(true);

    // Use map for bounds
    if (this.map && this.map.widthInPixels && this.map.heightInPixels) {
      cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.scene.physics.world.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );
    }

    // Follow player
    cam.startFollow(playerSprite, true, 0.1, 0.1);
  }
}
