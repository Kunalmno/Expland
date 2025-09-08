export default class TileUpdater {
  constructor(
    scene,
    waterLayer,
    stoneLayer,
    LilyLayer,
    pathLayer,
    updateInterval = 1000,
    maxTileIndex = 16
  ) {
    this.scene = scene;
    this.waterLayer = waterLayer;
    this.stoneLayer = stoneLayer;
    this.LilyLayer = LilyLayer;
    this.pathLayer = pathLayer;
    this.updateInterval = updateInterval;
    this.maxTileIndex = maxTileIndex;
  }

  start() {
    if (!this.waterLayer) return;
    this._randomizeStoneTiles();
    this._animateLilyTiles();
    // this._animatePathTiles();
    this.scene.time.addEvent({
      delay: this.updateInterval,
      loop: true,
      callback: () => {
        this._randomizeWaterTiles();
      },
    });
  }

  _randomizeWaterTiles() {
    const { width, height, data } = this.waterLayer.layer;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = data[y][x];
        tile.index = Phaser.Math.Between(1, this.maxTileIndex);
      }
    }
  }

  _randomizeStoneTiles() {
    const InitialX = this.stoneLayer.x;
    const InitialY = this.stoneLayer.y;
    this.scene.tweens.add({
      targets: this.stoneLayer,
      x: InitialX + 2,
      y: InitialY + 1,
      duration: 2500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        this.stoneLayer.x = Math.round(this.stoneLayer.x);
        this.stoneLayer.y = Math.round(this.stoneLayer.y);
      },
    });
  }
  _animateLilyTiles() {
    const InitialX = this.LilyLayer.x;
    const InitialY = this.LilyLayer.y;

    this.scene.tweens.add({
      targets: this.LilyLayer,
      x: InitialX + 2,
      // y: InitialY + 2,
      yoyo: true,
      duration: 3000,
      ease: "Sine.easeInOut",
      repeat: -1,
      onUpdate: () => {
        this.LilyLayer.x = Math.round(this.LilyLayer.x);
        this.LilyLayer.y = Math.round(this.LilyLayer.y);
      },
    });
  }

  _animatePathTiles() {
    const InitialX = this.pathLayer.x;
    const InitialY = this.pathLayer.y;

    this.scene.tweens.add({
      targets: this.pathLayer,
      x: InitialX + 1,
      y: InitialY - 1,
      yoyo: true,
      duration: 3000,
      ease: "Sine.easeInOut",
      repeat: -1,
      onUpdate: () => {
        this.pathLayer.x = Math.round(this.pathLayer.x);
        this.pathLayer.y = Math.round(this.pathLayer.y);
      },
    });
  }
}
