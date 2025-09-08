// Map/Map.js
import Collision from "../collision/collision"; // Keep provided import
import { mapConfig } from "../config/mapData";
import { tileLayerConfigs } from "../tiles/tilelayerConfig";
import TileLoader from "./TileLoader";
import TilesetMapper from "./TilesetMapper";
import TileUpdater from "./TileUpdater";

const LAYERS = {
  WATER: "water",
  INTERACTION: "close",
  ZONE: "closetUnlock",
  TARGET_NAME: "range",
  STONE: "stoneonwater",
  LILY: "lilyonwater",
  PATH: "Path",
};

export default class MapManager {
  constructor(scene) {
    this.scene = scene;
    this._collisionManager = null;
    this._tileUpdater = null;
    this.map = null;
    this.waterLayer = null;
    this.stoneLayer = null;
    this.LilyLayer = null;
    this.pathLayer = null;
  }

  preload() {
    const loader = new TileLoader(this.scene);
    loader.loadAll();
  }

  create() {
    if (!this.scene || !this.scene.make) {
      console.error("[MapManager] Scene is invalid.");
      return { map: null, closetLayer: null };
    }

    this.map = this.scene.make.tilemap({ key: mapConfig.key });
    if (!this.map) {
      console.error(
        "[MapManager] Failed to load tilemap 'map'. Check if key is loaded."
      );
      return { map: null, closetLayer: null };
    }

    const tilesetMapper = new TilesetMapper(this.scene, this.map);
    const tilesetMap = tilesetMapper.buildTilesetMap();

    this._initLayers(tilesetMap);

    this._tileUpdater = new TileUpdater(
      this.scene,
      this.waterLayer,
      this.stoneLayer,
      this.LilyLayer,
      this.pathLayer
    );
    this._tileUpdater.start();

    const closetLayer = this.map.getObjectLayer(LAYERS.INTERACTION);
    console.log("[MapManager] closetLayer data:", closetLayer);
    if (!closetLayer) {
      console.warn(
        "[MapManager] Object layer 'close' not found in map. Ensure the Tiled map has an object layer named 'close'."
      );
    }

    return { map: this.map, closetLayer };
  }

  _initLayers(tilesetMap) {
    tileLayerConfigs.forEach(({ config, tileset }) => {
      const layer = this.map.createLayer(
        config.layerName,
        tilesetMap[tileset],
        0,
        0
      );
      if (layer) {
        layer.setOrigin(0, 0);
        if (config.layerName === LAYERS.WATER) {
          this.waterLayer = layer;
        }
        if (config.layerName === LAYERS.STONE) {
          this.stoneLayer = layer;
        }
        if (config.layerName === LAYERS.LILY) {
          this.LilyLayer = layer;
        }
        if (config.layerName === LAYERS.PATH) {
          this.pathLayer = layer;
        }
      } else {
        console.warn(
          `[MapManager] Failed to create layer: ${config.layerName}`
        );
      }
    });
  }

  getClosetZone() {
    const objects = this.map.getObjectLayer(LAYERS.INTERACTION)?.objects ?? [];
    console.log("[MapManager] getClosetZone objects:", objects);
    return objects
      .filter((obj) => obj.name === LAYERS.ZONE)
      .map((zone) => {
        const range =
          zone.properties?.find((p) => p.name === LAYERS.TARGET_NAME)?.value ??
          null;
        return { closetZone: zone, range };
      });
  }

  enableCollisionsFor(player, opts = {}) {
    if (!player) {
      console.error(
        "[MapManager] Player must be provided for collision attachment."
      );
      return;
    }
    if (!this._collisionManager) {
      this._collisionManager = new Collision(this.scene, this.map, opts.debug);
    }
    if (typeof this._collisionManager.addCollider !== "function") {
      console.error("[MapManager] addCollider is not a function on Collision.");
      return;
    }
    try {
      return this._collisionManager.addCollider(player);
    } catch (error) {
      console.error("[MapManager] Error in addCollider:", error);
    }
  }
}
