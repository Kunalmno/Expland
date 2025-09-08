// tile/types/TileLayerEntry.js
import { TileLayerConfig } from "./TileLayerConfig.js";

export class TileLayerEntry {
  /**
   * @param {TileLayerConfig} config
   * @param {string} tileset
   * @param {boolean} [animated=false]
   */
  constructor(config, tileset, animated = false) {
    if (!(config instanceof TileLayerConfig)) {
      throw new TypeError(
        "TileLayerEntry: config must be a TileLayerConfig instance."
      );
    }
    if (typeof tileset !== "string") {
      throw new TypeError("TileLayerEntry: tileset must be a string.");
    }

    this.config = config;
    this.tileset = tileset;
    this.animated = animated;
  }
}
