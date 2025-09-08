import { mapConfig } from "../config/mapData";
import { tileLayerConfigs } from "../tiles/tilelayerConfig";

export default class TileLoader {
  constructor(scene) {
    this.scene = scene;
  }

  loadAll() {
    // Load tilemap JSON
    this.scene.load.tilemapTiledJSON(mapConfig.key, mapConfig.url);

    tileLayerConfigs.forEach((entry) => {
      const config = entry.config;
      this.scene.load.image(config.key, config.path);
    });
  }
}
