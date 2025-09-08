// interactions/outline.js
import ClosetMinigame from "../minigame/ClosetMinigame.js";
import ClosetObjectManager from "./ClosetObject.js";

export default class OutlineManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.eKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );
    this.closetManager = new ClosetObjectManager(scene);
    this.closetZones = [];
    this.isInMinigame = false;
    this.debugGraphics = this.scene.add.graphics().setDepth(1000);
    this.setupClosetOutline();
  }

  setupClosetOutline() {
    if (!this.closetManager || !this.closetManager.createClosetZonesFromMap) {
      console.error(
        "[OutlineManager] closetManager or createClosetZonesFromMap is undefined."
      );
      return;
    }
    try {
      const closetZones = this.closetManager.createClosetZonesFromMap();

      if (!closetZones || closetZones.length === 0) {
        console.warn("[OutlineManager] No closet zones initialized.");
        return;
      }
      this.closetZones = closetZones.map((zoneData) => ({
        ...zoneData,
        closetMinigame: new ClosetMinigame(this.scene, zoneData.position),
        playerInZone: false,
      }));
    } catch (error) {
      console.error(
        "[OutlineManager] Error in createClosetZonesFromMap:",
        error
      );
    }
  }

  update() {
    if (
      this.isInMinigame ||
      !this.player ||
      !this.player.body ||
      !this.closetZones.length
    )
      return;

    const playerPos = this.player.getCenter();
    const zoom = this.scene.cameras.main.zoom;
    this.debugGraphics.clear();

    for (const closet of this.closetZones) {
      if (!closet.zone) continue;

      const zoneCenter = closet.zone.getCenter();
      const range = closet.zone.width || 48; // Align with ClosetObjectManager
      const adjustedRange = range / zoom;

      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        zoneCenter.x,
        zoneCenter.y
      );
      const inRange = distance <= adjustedRange;

      if (inRange) {
        if (!closet.playerInZone) {
          this.playerEnterZone(closet);
        }
        if (Phaser.Input.Keyboard.JustDown(this.eKey) && !this.isInMinigame) {
          this.startMinigame(closet);
        }
      } else if (closet.playerInZone) {
        this.playerExitZone(closet);
      }

      // Debug graphics (uncomment to visualize)
      /*
      this.debugGraphics.lineStyle(1, 0xff69b4, 1); // pink
      this.debugGraphics.strokeRect(
        zoneCenter.x - closet.zone.width / 2,
        zoneCenter.y - closet.zone.height / 2,
        closet.zone.width,
        closet.zone.height
      );
      this.debugGraphics.lineStyle(2, 0x00ff00, 1); // green
      this.debugGraphics.strokeRect(
        zoneCenter.x - adjustedRange / 2,
        zoneCenter.y - adjustedRange / 2,
        adjustedRange,
        adjustedRange
      );
      */
    }
  }

  playerEnterZone(closet) {
    closet.outline.setVisible(true);
    closet.interactionText.setVisible(true);
    closet.playerInZone = true;
  }

  playerExitZone(closet) {
    closet.outline.setVisible(false);
    closet.interactionText.setVisible(false);
    closet.playerInZone = false;
  }

  startMinigame(closet) {
    this.isInMinigame = true;
    closet.outline.setVisible(false);
    closet.interactionText.setVisible(false);
    closet.closetMinigame.show(() => {
      this.isInMinigame = false;
    });
  }
}
