import { TileLayerConfig } from "../types/TileLayerConfig.js";

const furniturePath = "/assets/Tilesets/Furniture/Basic_Furniture.png";
const grassExtras = "/assets/Tilesets/grass/Basic_Grass_Biom_things.png";

export const DECORATION_CONFIG = {
  lilyonwater: new TileLayerConfig({
    key: "lilyonwater",
    path: grassExtras,
    fileName: "Basic_Grass_Biom_things",
    layerName: "lilyonwater",
  }),
  stoneonwater: new TileLayerConfig({
    key: "stoneonwater",
    path: grassExtras,
    fileName: "Basic_Grass_Biom_things",
    layerName: "stoneonwater",
  }),
  stoneonground: new TileLayerConfig({
    key: "stoneonground",
    path: grassExtras,
    fileName: "Basic_Grass_Biom_things",
    layerName: "stoneonground",
  }),
  furntituredecoration: new TileLayerConfig({
    key: "furntituredecoration",
    path: furniturePath,
    fileName: "Basic_Furniture",
    layerName: "furntituredecoration",
  }),
  Furntiture: new TileLayerConfig({
    key: "Furntiture",
    path: furniturePath,
    fileName: "Basic_Furniture",
    layerName: "Furntiture",
  }),
  HouseDecoration: new TileLayerConfig({
    key: "HouseDecoration",
    path: furniturePath,
    fileName: "Basic_Furniture",
    layerName: "HouseDecoration",
  }),
};
