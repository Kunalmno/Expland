import { TileLayerConfig } from "../types/TileLayerConfig.js";
const housePath = "/assets/Tilesets/House/Wooden_House_Walls_Tilset.png";

export const HOUSE_CONFIG = {
  House: new TileLayerConfig({
    key: "House",
    path: housePath,
    fileName: "Wooden_House_Walls_Tilset",
    layerName: "House",
  }),

  Houselayer: new TileLayerConfig({
    key: "Houselayer",
    path: housePath,
    fileName: "Wooden_House_Walls_Tilset",
    layerName: "Houselayer",
  }),

  Housefloor: new TileLayerConfig({
    key: "Housefloor",
    path: housePath,
    fileName: "Wooden_House_Walls_Tilset",
    layerName: "Housefloor",
  }),
};
