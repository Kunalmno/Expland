// final import style extract frame via const variable in data file for modularity
import {
  EMOJI_SELECTOR_CONFIG,
  HEALTH_DISPLAY_CONFIG,
  HOTBAR_SLOTS_CONFIG,
  SETTINGS_BUTTON_CONFIG,
  UI_MAP_CONFIG,
  WEATHER_UI_CONFIG,
} from "../config/UIObjectConfig";
import { PLAYER_ANIMATION_CONFIG } from "../constants/playerConfig";

import {
  createEmojiSelector,
  createHealthUI,
  createHotBarSlot,
  createSettingButton,
  createWeatherUI,
} from "../utils/UIObjectUtils";

/**
 * ### UIMap Scene
 * Handles all UI overlays:
 * - Emoji selector + slot
 * - Weather display
 * - Settings button
 * - Health hearts
 * - Hotbar slots
 */
export default class UIMap extends Phaser.Scene {
  constructor() {
    super("UIMap");

    /** @type {import('../entities/Player').default | null} */
    this.player = null;

    this.emojiSelector = null;
    this.emojiSlot = null;
    this.emojiVisible = false;

    this.hotbarSlots = [];
    this.inventoryManager = null;
  }

  // ---------------------------
  // Preload
  // ---------------------------
  preload() {
    this._loadMap();
    this._loadSettings();
    this._loadEmoji();
    this._loadWeather();
    this._loadHearts();
    this._loadHotbar();
    this._loadPlayerSprites();
  }

  _loadMap() {
    this.load.tilemapTiledJSON(UI_MAP_CONFIG.key, UI_MAP_CONFIG.url);
  }

  _loadSettings() {
    this.load.spritesheet(
      SETTINGS_BUTTON_CONFIG.settingConfig.key,
      SETTINGS_BUTTON_CONFIG.settingConfig.path,
      {
        frameWidth: SETTINGS_BUTTON_CONFIG.settingConfig.frameWidth,
        frameHeight: SETTINGS_BUTTON_CONFIG.settingConfig.frameHeight,
      }
    );
  }

  _loadEmoji() {
    this.load.spritesheet(
      EMOJI_SELECTOR_CONFIG.emojiframe.key,
      EMOJI_SELECTOR_CONFIG.emojiframe.path,
      {
        frameWidth: EMOJI_SELECTOR_CONFIG.emojiframe.frameWidth,
        frameHeight: EMOJI_SELECTOR_CONFIG.emojiframe.frameHeight,
      }
    );
  }

  _loadWeather() {
    this.load.spritesheet(
      WEATHER_UI_CONFIG.WeatherConfig.key,
      WEATHER_UI_CONFIG.WeatherConfig.path,
      {
        frameWidth: WEATHER_UI_CONFIG.WeatherConfig.frameWidth,
        frameHeight: WEATHER_UI_CONFIG.WeatherConfig.frameHeight,
      }
    );
  }

  _loadHearts() {
    this.load.spritesheet(
      HEALTH_DISPLAY_CONFIG.HeartFrameConfig.key,
      HEALTH_DISPLAY_CONFIG.HeartFrameConfig.path,
      {
        frameWidth: HEALTH_DISPLAY_CONFIG.HeartFrameConfig.frameWidth,
        frameHeight: HEALTH_DISPLAY_CONFIG.HeartFrameConfig.frameHeight,
      }
    );
    this.load.spritesheet(
      HEALTH_DISPLAY_CONFIG.HeartUIConfig.key,
      HEALTH_DISPLAY_CONFIG.HeartUIConfig.path,
      {
        frameWidth: HEALTH_DISPLAY_CONFIG.HeartUIConfig.frameWidth,
        frameHeight: HEALTH_DISPLAY_CONFIG.HeartUIConfig.frameHeight,
      }
    );
  }

  _loadHotbar() {
    this.load.spritesheet(
      HOTBAR_SLOTS_CONFIG.HotBarSlotsConfig.key,
      HOTBAR_SLOTS_CONFIG.HotBarSlotsConfig.path,
      {
        frameWidth: HOTBAR_SLOTS_CONFIG.HotBarSlotsConfig.frameWidth,
        frameHeight: HOTBAR_SLOTS_CONFIG.HotBarSlotsConfig.frameHeight,
      }
    );
  }

  _loadPlayerSprites() {
    this.load.spritesheet(
      PLAYER_ANIMATION_CONFIG.key,
      PLAYER_ANIMATION_CONFIG.path,
      {
        frameWidth: PLAYER_ANIMATION_CONFIG.frameWidth,
        frameHeight: PLAYER_ANIMATION_CONFIG.frameHeight,
      }
    );
    this.load.spritesheet("WetDirt", "/assets/Tilesets/Test/WetDirt.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  // ---------------------------
  // Create
  // ---------------------------
  create() {
    this._createMapObjects();
    this._setupInventoryLink();
    this._setupUICamera();
    this._setupHotkeys();

    this.scene.bringToTop();
  }

  _createMapObjects() {
    this.map = this.make.tilemap({ key: UI_MAP_CONFIG.key });
    const uiLayer = this.map.getObjectLayer("UILayouts");

    if (!uiLayer) {
      console.warn('[UIMap] No object layer named "UILayouts" found.');
      return;
    }

    for (const obj of uiLayer.objects) {
      if (obj.type === SETTINGS_BUTTON_CONFIG.objType) {
        this._createSettingsButton(obj);
      }

      if (obj.type === EMOJI_SELECTOR_CONFIG.objType) {
        this._createEmojiSelector(obj);
      }

      if (obj.name === WEATHER_UI_CONFIG.objName) {
        createWeatherUI(this, obj);
      }

      if (obj.type === HEALTH_DISPLAY_CONFIG.objType) {
        createHealthUI(this, obj);
      }

      if (obj.type === HOTBAR_SLOTS_CONFIG.objType) {
        this._createHotbarSlot(obj);
      }
    }
  }

  _createSettingsButton(obj) {
    const settingButton = createSettingButton(this, obj);
    settingButton
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.pause("GameScene");
        this.scene.launch("PauseMenuScene");
      });
  }

  _createEmojiSelector(obj) {
    // Create a container for the frame and emoji
    this.emojiSelector = this.add
      .container(obj.x, obj.y)
      .setScrollFactor(0)
      .setDepth(100);

    // Add static frame
    this.emojiFrame = this.add
      .image(
        0,
        0,
        EMOJI_SELECTOR_CONFIG.emojiframe.key,
        EMOJI_SELECTOR_CONFIG.emojiframe.frame
      )
      .setOrigin(0.5)
      .setScale(EMOJI_SELECTOR_CONFIG.scale);

    // Add emoji inside frame
    this.emojiSlot = this.add
      .image(
        0,
        0,
        EMOJI_SELECTOR_CONFIG.emojidata.key,
        EMOJI_SELECTOR_CONFIG.emojidata.frame
      )
      .setOrigin(0.5)
      .setScale(EMOJI_SELECTOR_CONFIG.scale * 0.7) // Slightly smaller to fit inside frame
      .setDepth(101);

    this.emojiSelector.add([this.emojiFrame, this.emojiSlot]);

    // Make container interactive to toggle wheel
    this.emojiSelector
      .setSize(
        EMOJI_SELECTOR_CONFIG.defaultWidth,
        EMOJI_SELECTOR_CONFIG.defaultHeight
      )
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.emojiVisible = !this.emojiVisible;
        if (this.emojiWheel) {
          this.emojiWheel.setVisible(this.emojiVisible);
        }
      });
  }

  _createEmojiWheel(obj) {
    const centerX = obj.x;
    const centerY = obj.y;
    const radius = 60;
    const emojis = EMOJI_WHEEL_CONFIG.emojis;
    const angleStep = (2 * Math.PI) / emojis.length;

    this.emojiWheel = this.add
      .container(centerX, centerY)
      .setScrollFactor(0)
      .setDepth(101);
    this.emojiWheel.setVisible(false);

    emojis.forEach((emoji, index) => {
      const angle = index * angleStep;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const emojiSprite = this.add
        .image(x, y, EMOJI_WHEEL_CONFIG.key, emoji.frame)
        .setOrigin(0.5)
        .setScale(1.5)
        .setInteractive({ useHandCursor: true });

      emojiSprite.on("pointerdown", () => {
        this.updateEmoji(emoji.key, emoji.frame);
        this.emojiVisible = false;
        this.emojiWheel.setVisible(false);
        this.scene
          .get("GameScene")
          .events.emit("emojiSelected", emoji.key, emoji.frame);
      });

      this.emojiWheel.add(emojiSprite);
    });
  }

  _setupHotkeys() {
    this.input.keyboard.on("keydown-O", () => {
      if (!this.emojiWheel) return;
      this.emojiVisible = !this.emojiVisible;
      this.emojiWheel.setVisible(this.emojiVisible);
    });
  }

  updateEmoji(emojiKey, emojiFrame) {
    if (!this.emojiSlot) {
      this.emojiSlot = this.add
        .image(0, 0, emojiKey, emojiFrame)
        .setOrigin(0.5)
        .setScale(EMOJI_SELECTOR_CONFIG.scale * 0.7)
        .setDepth(101);
      this.emojiSelector.add(this.emojiSlot);
    } else {
      this.emojiSlot.setTexture(emojiKey, emojiFrame);
    }
  }

  _createHotbarSlot(obj) {
    const slotSprite = createHotBarSlot(this, obj);

    const itemImg = this.add
      .image(slotSprite.x, slotSprite.y, "")
      .setOrigin(
        slotSprite.originX !== undefined ? slotSprite.originX : 0.5,
        slotSprite.originY !== undefined ? slotSprite.originY : 0.5
      )
      .setDepth((slotSprite.depth || 0) + 1)
      .setVisible(false);

    this.hotbarSlots.push({ slotSprite, itemImg });

    slotSprite.setInteractive().on("pointerdown", () => {
      if (this.inventoryManager) {
        this.inventoryManager.selectHotbarIndex(
          this.hotbarSlots.indexOf({ slotSprite, itemImg })
        );
      }
    });
  }

  _setupInventoryLink() {
    const gameScene = this.scene.get("GameScene");

    if (!gameScene) {
      console.warn("[UIMap] GameScene not found while linking inventory.");
      return;
    }

    gameScene.events.on("playerInit", (player) => {
      this.player = player;
    });

    if (gameScene.inventoryManager) {
      this._bindInventory(gameScene.inventoryManager);
    }

    gameScene.events.on("inventoryInit", (inventoryManager) => {
      this._bindInventory(inventoryManager);
    });
  }

  _bindInventory(inventoryManager) {
    if (!inventoryManager) return;
    this.inventoryManager = inventoryManager;

    const refreshHotbar = (items) => {
      const limit = Math.min(
        this.hotbarSlots.length,
        HOTBAR_SLOTS_CONFIG.slotCount || this.hotbarSlots.length
      );

      for (let i = 0; i < limit; i++) {
        const { itemImg } = this.hotbarSlots[i];
        const item = items && items[i];

        if (item && item.key) {
          itemImg.setTexture(
            item.key,
            item.frame !== undefined ? item.frame : 0
          );
          itemImg.setVisible(true);
          itemImg.setScale(3);
        } else {
          itemImg.setVisible(false);
        }
      }
    };

    inventoryManager.onInventoryChange = refreshHotbar;
    if (inventoryManager.items) refreshHotbar(inventoryManager.items);
  }

  _setupUICamera() {
    const cam = this.cameras.add(0, 0, window.innerWidth, window.innerHeight);
    cam.setScroll(0, 0);
    cam.setBackgroundColor("rgba(0,0,0,0)");
  }

  // ---------------------------
  // Public Helpers
  // ---------------------------
}
