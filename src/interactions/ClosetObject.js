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
    console.log("[ClosetObjectManager] closetLayer:", closetLayer);

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

        const zone = this.scene.add.zone(x, y, width, height);
        try {
          this.scene.physics.add.existing(zone, true); // Static physics body
        } catch (error) {
          console.error(
            `[ClosetObjectManager] Failed to add physics to zone at (${x}, ${y}):`,
            error
          );
          return null;
        }

        let outline;
        try {
          outline = this.scene.add
            .image(x, y, ClosetImage)
            .setOrigin(OutlineOrigin)
            .setScale(OutlineScale)
            .setDisplaySize(width + 2.5, height + 2.5)
            .setVisible(OutlineVisibility);
        } catch (error) {
          console.error(
            `[ClosetObjectManager] Failed to create outline for closet at (${x}, ${y}):`,
            error
          );
          return null;
        }

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
      .filter((zone) => zone !== null && zone.zone && zone.zone.body);

    if (this.closetZones.length === 0) {
      console.warn(ClosetUnlockWarning);
      return;
    }

    if (this.scene.player && this.scene.player.body) {
      try {
        this.scene.physics.add.overlap(
          this.scene.player,
          this.closetZones
            .map((z) => z.zone)
            .filter((zone) => zone && zone.body),
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
        console.log(
          "[ClosetObjectManager] closetGroup children:",
          this.closetGroup.getChildren()
        );
      } catch (error) {
        console.error("[ClosetObjectManager] Failed to setup overlap:", error);
      }
    } else {
      console.warn("[ClosetObjectManager] Player not ready for overlap setup.");
    }
  }

  createClosetZonesFromMap() {
    console.log(
      "[ClosetObjectManager] Returning closetZones:",
      this.closetZones
    );
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
      console.log(
        `[ClosetObjectManager] Distance to closet at (${zone.position.x}, ${zone.position.y}): ${distance}, in range: ${zone.playerInZone}`
      );
    });
  }
}
