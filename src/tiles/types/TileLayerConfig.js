// tile/types/TileLayerConfig.js

export class TileLayerConfig {
  /**
   * @param {Object} options
   * @param {string} options.key
   * @param {string} options.path
   * @param {string} options.fileName
   * @param {string} options.layerName
   */
  constructor({ key, path, fileName, layerName }) {
    this.key = key;
    this.path = path;
    this.fileName = fileName;
    this.layerName = layerName;
  }
}
