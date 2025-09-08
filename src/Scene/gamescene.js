// gamescene.js
import Phaser from "phaser";
import Chicken from "../AI/chickenAI.js";
import CameraController from "../camera/camera.js";
import Collision from "../collision/collision.js";
import {
  chickenConfig,
  fontConfig,
  outlineConfig,
  playerConfig,
} from "../config/gamesceneData.js";
import ClosetObjectManager from "../interactions/ClosetObject.js";
import OutlineManager from "../interactions/outline.js";
import PlayerInteractions from "../interactions/PlayerInteractions.js";
import AxeManager from "../interactions/randomtrees/axe.js";
import TreeManager from "../interactions/randomtrees/trees.js";
import InventoryManager from "../inventory/InventoryManager";
import MapManager from "../Map/Map.js";
import KeyBinding from "../movement/KeyBinding.js";
import Player from "../movement/player.js";
import {
  CURSOR_CONFIG,
  PLAYER_INTERACTION_CONFIG,
  TREE_CONFIG,
} from "./constants/gamescenedata.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.outlineManager = null;
    this.map = null;
    this.player = null;
    this.collisionManager = null;
    this.closetLayer = null;
    this.mapManager = new MapManager(this);
  }

  preload() {
    this.load.on("filecomplete", (key) => {
      console.log(`[GameScene] Loaded asset: ${key}`);
    });
    this.load.on("loaderror", (file) => {
      console.error(
        `[GameScene] Failed to load asset: ${file.key}, src: ${file.src}`
      );
    });
    this.mapManager.preload();
    this._preloadSprite(playerConfig);
    this._preloadSprite(chickenConfig);
    this.load.spritesheet(
      PLAYER_INTERACTION_CONFIG.PlayerKey,
      PLAYER_INTERACTION_CONFIG.PlayerURL,
      { frameWidth: 48, frameHeight: 48 }
    );
    this.load.bitmapFont(
      fontConfig.key,
      fontConfig.pngName,
      fontConfig.fntName
    );
    this._preloadOutline(outlineConfig);
    this.load.spritesheet(TREE_CONFIG.key, TREE_CONFIG.url, {
      frameWidth: TREE_CONFIG.width,
      frameHeight: TREE_CONFIG.height,
    });
    this.load.spritesheet(
      "teemo_emotes",
      "/assets/character/Teemo Basic emote animations sprite sheet.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.image("emoji_frame", "/assets/ui/emojiFrameUI.png");
    this.load.spritesheet("closet", "/assets/Outline/closetOutline.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    console.log(`[FPS] ${this.game.loop.actualFps}`);
    this.input.setDefaultCursor(CURSOR_CONFIG);

    if (!this.mapManager) {
      console.error("[GameScene] mapManager is undefined.");
      return;
    }

    this._setupMap();
    if (!this.map) return;

    this._setupPlayer();
    if (!this.player || !this.player.body) return;

    this._setupInventory();
    this._setupClosets();
    this._setupCamera();
    this._setupCollisions();
    this._setupInteractions();
    this._setupTrees();
    this._setupEmojiListener();

    this.scene.launch("UIMap");
    this._linkUIMap();
  }

  _setupMap() {
    if (!this.mapManager || !this.mapManager.create) {
      console.error(
        "[GameScene] mapManager or its create method is undefined."
      );
      return;
    }
    const mapData = this.mapManager.create();
    console.log("[GameScene] MapManager.create() returned:", mapData);
    const { map, closetLayer } = mapData;
    if (!map) {
      console.error("[GameScene] Map is undefined.");
      return;
    }
    this.map = map;
    this.closetLayer = closetLayer;
    if (!closetLayer) {
      console.warn(
        "[GameScene] closetLayer is undefined. Closet-related features may be disabled."
      );
    }
  }

  // GameScene.js
  _setupPlayer() {
    this.keyBinding = new KeyBinding(this);
    try {
      this.player = new Player(this, 100, 100, this.keyBinding);
      if (!this.player || !this.player.body || !this.player.active) {
        throw new Error("Player initialization failed or lacks physics body.");
      }
      console.log("[GameScene] Player initialized:", this.player);
      this.events.emit("playerInit", this.player);
    } catch (error) {
      console.error("[GameScene] Error in _setupPlayer:", error);
      this.player = null;
    }
  }

  _setupInventory() {
    this.inventoryManager = new InventoryManager();
    this.inventoryManager.onInventoryChange = (items) =>
      this.events.emit("inventoryUpdate", items);
    this.events.emit("inventoryInit", this.inventoryManager);
  }

  _setupClosets() {
    if (!this.player || !this.player.body) {
      console.error("[GameScene] Cannot setup closets: player is invalid.");
      return;
    }
    try {
      this.closetObjectManager = new ClosetObjectManager(this);
      this.outlineManager = new OutlineManager(this, this.player);
    } catch (error) {
      console.error("[GameScene] Error in _setupClosets:", error);
    }
  }

  _setupCamera() {
    if (!this.map || !this.player || !this.player.body) {
      console.error(
        "[GameScene] Cannot setup camera: map or player is undefined."
      );
      return;
    }
    this.cameraController = new CameraController(this, this.map);
    this.cameraController.setup(this.player);
  }

  _setupCollisions() {
    if (!this.map || !this.player || !this.player.body) {
      console.error(
        "[GameScene] Cannot setup collisions: map or player is undefined or lacks physics body."
      );
      return;
    }
    try {
      this.mapManager.enableCollisionsFor(this.player, { debug: false });
    } catch (error) {
      console.error("[GameScene] Error in _setupCollisions:", error);
    }
  }

  _setupInteractions() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.actionKeys = {
      cut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      hoe: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
      water: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    };
  }

  _setupTrees() {
    if (!this.player || !this.player.body || !this.actionKeys) {
      console.error(
        "[GameScene] Cannot setup trees: player or actionKeys is undefined."
      );
      return;
    }
    this.treeManager = new TreeManager(this, this.player, this.actionKeys);
    this.treeManager.loadSpawnPoints("TreeSpawnPoints");
    this.treeManager.spawnInitialTrees();
    this.axeManager = new AxeManager(this, this.player, this.treeManager);
    this.playerInteractions = new PlayerInteractions(
      this,
      this.player,
      this.axeManager
    );
  }

  _setupEmojiListener() {
    this.events.on("emojiSelected", (emojiKey, emojiFrame) => {
      if (this.player && this.player.setEmoji) {
        this.player.setEmoji(emojiKey, emojiFrame);
      } else {
        console.warn("[GameScene] Player not ready for emoji update.");
      }
    });
  }

  _linkUIMap() {
    this.time.delayedCall(100, () => {
      const uiScene = this.scene.get("UIMap");
      if (uiScene) {
        this.cameras.main.ignore(uiScene.children.list);
        if (this.player) {
          uiScene.player = this.player;
        }
      } else {
        console.warn("[UIMap] Scene not found.");
      }
    });
  }

  _preloadSprite(config) {
    if (!config || !config.key || !config.path) {
      console.error("[GameScene] Invalid sprite config:", config);
      return;
    }
    this.load.spritesheet(config.key, config.path, {
      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,
    });
  }

  _preloadOutline(config) {
    if (!config || !config.key || !config.path) {
      console.error("[GameScene] Invalid outline config:", config);
      return;
    }
    this.load.spritesheet(config.key, config.path, {
      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,
    });
  }

  update() {
    if (this.player && this.player.body) {
      this.player.update();
    }
    if (this.outlineManager) {
      this.outlineManager.update();
    }
    if (this.closetObjectManager) {
      this.closetObjectManager.update();
    }
    if (this.playerInteractions && this.cursors && this.actionKeys) {
      this.playerInteractions.update(this.cursors, this.actionKeys);
    }
    if (this.treeManager) {
      this.treeManager.update();
    }
  }
}
