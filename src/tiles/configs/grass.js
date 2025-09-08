// tile/configs/grass.js
import { TileLayerConfig } from "../types/TileLayerConfig.js";

const grassPath = "/assets/Tilesets/grass/Grass.png";
const grassExtras = "/assets/Tilesets/grass/Basic_Grass_Biom_things.png";

export const GRASS_CONFIG = {
  grass: new TileLayerConfig({
    key: "grass",
    path: grassPath,
    fileName: "Grass",
    layerName: "grass",
  }),

  grass_decoration: new TileLayerConfig({
    key: "grass_decoration",
    path: grassPath,
    fileName: "Grass",
    layerName: "grass_decoration",
  }),

  grassdecoration: new TileLayerConfig({
    key: "grassdecoration",
    path: grassExtras,
    fileName: "Basic_Grass_Biom_things",
    layerName: "grassdecoration",
  }),
};
