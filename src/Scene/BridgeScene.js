import KeyBinding from "../movement/KeyBinding";
import Player from "../movement/player";

export default class BridgeTestScene extends Phaser.Scene {
  constructor() {
    super({ key: "BridgeTestScene" });
  }

  preload() {
    this.load.spritesheet("Bridge", "assets/Tilesets/Bridge/Wood_Bridge.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // // Load player sprite here if not loaded elsewhere
    this.load.spritesheet(
      "kitty",
      "assets/Characters/Basic Charakter Spritesheet.png",
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );
  }

  create() {
    this.keyBinding = new KeyBinding(this);
    this.player = new Player(this, 100, 100, this.keyBinding); // uses Arcade

    this.cameras.main.setBackgroundColor("#1e1e1e");

    const tileSize = 40;

    this.path = [
      { x: 100, y: 300 },
      { x: 140, y: 300 },
      { x: 180, y: 300 },
      { x: 220, y: 300 },
      { x: 260, y: 300 },
      { x: 300, y: 300 },
      { x: 340, y: 300 },
      { x: 380, y: 300 },
      { x: 420, y: 300 },
    ];

    this.tiles = this.path.map((pos) => {
      const tile = this.add.sprite(pos.x, pos.y, "Bridge", 3);
      tile.setDisplaySize(tileSize, tileSize);
      tile.setOrigin(0.5);
      tile.originalY = pos.y;
      tile.sagging = false;
      tile.jitterEvent = null;
      return tile;
    });

    this.threadGraphics = this.add.graphics();
    this.threadGraphics.lineStyle(4, 0x996633, 1);
  }

  update() {
    this.player.update();

    // Update bridge effects using player position
    const px = this.player.sprite.x;
    const py = this.player.sprite.y + this.player.sprite.height / 2;

    this.updateBridgeEffects(px, py);
    this.drawThreads();
  }

  updateBridgeEffects(playerX, playerY) {
    const sagAmount = 12;
    const maxEffectDistance = 30;

    let closestIndex = -1;
    let minDist = Number.MAX_VALUE;

    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const dist = Phaser.Math.Distance.Between(
        playerX,
        playerY,
        tile.x,
        tile.originalY
      );

      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    const affectedIndexes = new Set([
      closestIndex,
      closestIndex - 1,
      closestIndex + 1,
    ]);

    this.tiles.forEach((tile, index) => {
      const isCurrent = index === closestIndex;
      const isAffected = affectedIndexes.has(index);

      const dist = Phaser.Math.Distance.Between(
        playerX,
        playerY,
        tile.x,
        tile.originalY
      );

      if (isAffected && dist <= maxEffectDistance && !tile.sagging) {
        tile.sagging = true;

        this.tweens.add({
          targets: tile,
          y: tile.originalY + sagAmount,
          duration: isCurrent ? 250 : 150,
          ease: "Quad.easeOut",
        });

        tile.jitterEvent = this.time.addEvent({
          delay: 100,
          loop: true,
          callback: () => {
            const offset = Phaser.Math.Between(-1, 1);
            this.tweens.add({
              targets: tile,
              y: tile.y + offset,
              duration: 60,
              yoyo: true,
              ease: "Sine.easeInOut",
            });
          },
        });
      } else if (!isAffected && tile.sagging) {
        tile.sagging = false;

        this.tweens.add({
          targets: tile,
          y: tile.originalY,
          duration:
            index === closestIndex - 1 || index === closestIndex + 1
              ? 100
              : 250,
          ease: "Back.easeOut",
        });

        if (tile.jitterEvent) {
          tile.jitterEvent.remove();
          tile.jitterEvent = null;
        }
      }
    });
  }

  drawThreads() {
    const g = this.threadGraphics;
    g.clear();
    g.lineStyle(4, 0x996633, 1);

    for (let i = 1; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const prevTile = this.tiles[i - 1];

      g.lineBetween(prevTile.x, prevTile.y, tile.x, tile.y);
      if (i < this.tiles.length - 1) {
        const nextTile = this.tiles[i + 1];
        g.lineBetween(tile.x, tile.y, nextTile.x, nextTile.y);
      }
    }
  }
}
