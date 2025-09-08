import { TileLayerConfig } from "../types/TileLayerConfig.js";

const waterpath = "/assets/Tilesets/water/Water.png";

export const WATER_CONFIG = {
  water: new TileLayerConfig({
    key: "water",
    path: waterpath,
    fileName: "Water",
    layerName: "water",
  }),
};
