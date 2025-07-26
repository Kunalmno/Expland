// Map.js
export default class MapManager {
  constructor(scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.tilemapTiledJSON("map", "/assets/TestInteraction.tmj");
    this.scene.load.image("water", "/assets/Water.png");
    this.scene.load.image("sand", "/assets/Tilled_Dirt_v2.png");
    this.scene.load.image("gras", "/assets/Grass.png");
    this.scene.load.image("closet", "/assets/Basic_Furniture.png");
  }

  create() {
    const map = this.scene.make.tilemap({ key: "map" });

    const water = map.addTilesetImage("Water", "water");
    const sand = map.addTilesetImage("Tilled_Dirt_v2", "sand");
    const grass = map.addTilesetImage("Grass", "gras");
    const closetTS = map.addTilesetImage("Basic_Furniture", "closet");

    map.createLayer("water", water, 0, 0);
    map.createLayer("sand", sand, 0, 0);
    map.createLayer("gras", grass, 0, 0);
    const closetLayer = map.createLayer("closet", closetTS, 0, 0);

    return { map, closetLayer };
  }

  getClosetZone(map) {
    const interactZones = map.getObjectLayer("close").objects;
    const closetZone = interactZones.find(
      (obj) => obj.name === "closet_interact"
    );
    const range = closetZone.properties.find((p) => p.name === "range").value;
    return { closetZone, range };
  }
}
