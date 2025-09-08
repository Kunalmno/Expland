// CameraService.js
export default class CameraService {
  constructor(scene, map, player) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.map = map;
    this.player = player;
  }

  setup() {
    this.camera.startFollow(this.player.sprite);
  }
}
