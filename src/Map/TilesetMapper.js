import { tileLayerConfigs } from "../tiles/tilelayerConfig";

export default class TilesetMapper {
  constructor(scene, map) {
    this.scene = scene;
    this.map = map;
  }

  buildTilesetMap() {
    const tilesetMap = {};

    tileLayerConfigs.forEach((entry) => {
      const config = entry.config;
      const tileset = this.map.addTilesetImage(config.fileName, config.key);
      tilesetMap[config.key] = tileset;

      if (tileset?.name) {
        this.scene.textures
          .get(tileset.name)
          .setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    });

    return tilesetMap;
  }
}
