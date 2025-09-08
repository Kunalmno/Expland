// interactions/ClosetObject.js
import { outlineConfig } from "../config/gamesceneData";
import {
  CLOSET_CONFIG,
  INTERACTION_TEXT_CONFIG,
  OUTLINE_SETUP_CONFIG,
  WARNING_CONFIG,
} from "./constants/closetobjectConfig";

const { ClosetObjectWarning, ClosetUnlockWarning } = WARNING_CONFIG;
const { ClosetObjLayer, ClosetObjName, ClosetImage } = CLOSET_CONFIG;
const { OutlineOrigin, OutlineScale, OutlineVisibility } = OUTLINE_SETUP_CONFIG;
const {
  TextName,
  TextDisplay,
  TextSize,
  TextOrigin,
  TextDepth,
  TextTint,
  TextVisibility,
} = INTERACTION_TEXT_CONFIG;

export default class ClosetObjectManager {
  constructor(scene) {
    this.scene = scene;
    this.closetGroup = this.scene.physics.add.group();
    this.closetZones = [];
    this.debugGraphics = this.scene.add.graphics().setDepth(9999);
    this.setupClosets();
  }

  setupClosets() {
    const closetLayer =
      this.scene.closetLayer || this.scene.map?.getObjectLayer(ClosetObjLayer);

    if (!closetLayer || !closetLayer.objects) {
      console.warn(ClosetObjectWarning);
      return;
    }

    this.closetZones = closetLayer.objects
      .filter((obj) => obj.name === ClosetObjName)
      .map((obj, index) => {
        if (!obj || !obj.x || !obj.y) {
          console.warn(
            `[ClosetObjectManager] Invalid closet object at index ${index}.`
          );
          return null;
        }

        const width = obj.width || 32;
        const height = obj.height || 32;
        const OUTLINE_CONFIG = {
          Xposition: width / 2.05,
          yposition: height / 2.3,
        };

        const x = obj.x + OUTLINE_CONFIG.Xposition;
        const y = obj.y + OUTLINE_CONFIG.yposition;

        // 🔹 Create a StaticImage for the zone
        const zone = this.scene.physics.add
          .staticImage(x, y, ClosetImage)
          .setOrigin(OutlineOrigin)
          .setScale(OutlineScale)
          .setDisplaySize(width + 2.5, height + 2.5)
          .setVisible(OutlineVisibility);

        // 🔹 Create the outline
        const outline = this.scene.add
          .image(x, y, ClosetImage)
          .setOrigin(OutlineOrigin)
          .setScale(OutlineScale)
          .setDisplaySize(width + 2.5, height + 2.5)
          .setVisible(OutlineVisibility);

        // 🔹 Create interaction text
        const interactionText = this.scene.add
          .bitmapText(x, y - 12, TextName, TextDisplay, TextSize)
          .setOrigin(TextOrigin)
          .setDepth(TextDepth)
          .setTint(TextTint)
          .setVisible(TextVisibility);

        return {
          zone,
          outline,
          interactionText,
          position: { x: obj.x, y: obj.y },
          playerInZone: false,
        };
      })
      .filter((z) => z !== null && z.zone && z.zone.body);

    if (this.closetZones.length === 0) {
      console.warn(ClosetUnlockWarning);
      return;
    }

    // ✅ FIX: Register overlap using individual zones
    if (this.scene.player && this.scene.player.body) {
      this.closetZones.forEach((z) => {
        this.scene.physics.add.overlap(
          this.scene.player,
          z.zone,
          (player, zone) => {
            const closetZone = this.closetZones.find((z) => z.zone === zone);
            if (closetZone) {
              closetZone.playerInZone = true;
              closetZone.outline.setVisible(true);
              closetZone.interactionText.setVisible(true);
            }
          },
          null,
          this
        );
      });
    } else {
      console.warn("[ClosetObjectManager] Player not ready for overlap setup.");
    }
  }

  createClosetZonesFromMap() {
    return this.closetZones;
  }

  update() {
    if (
      !this.scene.player ||
      !this.scene.player.body ||
      !this.closetZones.length
    )
      return;

    this.closetZones.forEach((zone) => {
      if (!zone.zone || !zone.zone.body) return;
      const distance = Phaser.Math.Distance.Between(
        this.scene.player.x,
        this.scene.player.y,
        zone.position.x,
        zone.position.y
      );
      const range = zone.zone.width || 48;
      zone.playerInZone = distance <= range;
      zone.outline.setVisible(zone.playerInZone);
      zone.interactionText.setVisible(zone.playerInZone);
    });
  }
}
