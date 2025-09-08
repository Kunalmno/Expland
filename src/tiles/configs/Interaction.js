import { TileLayerConfig } from "../types/TileLayerConfig.js";

const furniturePath = "/assets/Tilesets/Furniture/Basic_Furniture.png";
const Doorpath = "/assets/Tilesets/House/Doors.png";

export const INTERACTION_CONFIG = {
  Closet: new TileLayerConfig({
    key: "Closet",
    path: furniturePath,
    fileName: "Basic_Furniture",
    layerName: "Closet",
  }),
  Bed: new TileLayerConfig({
    key: "Bed",
    path: furniturePath,
    fileName: "Basic_Furniture",
    layerName: "Bed",
  }),
  Doors: new TileLayerConfig({
    key: "Doors",
    path: Doorpath,
    fileName: "Doors",
    layerName: "Doors",
  }),
};
