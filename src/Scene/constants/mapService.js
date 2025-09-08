// MapService.js
import MapManager from "../../Map/Map";

export default class MapService {
  constructor(scene) {
    this.scene = scene;
    this.mapManager = new MapManager(scene);
    this.map = null;
    this.closetLayer = null;
  }

  preload() {
    this.mapManager.preload();
  }

  create() {
    const { map, closetLayer } = this.mapManager.create();
    this.map = map;
    this.closetLayer = closetLayer;
  }

  getMap() {
    return this.map;
  }

  getClosetLayer() {
    return this.closetLayer;
  }
}
