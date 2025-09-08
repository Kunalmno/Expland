import { TileLayerConfig } from "../types/TileLayerConfig.js";

const Pathspath = "/assets/Tilesets/Bridge/Paths.png";
const Bridgepath = "/assets/Tilesets/Bridge/Wood_Bridge.png";

export const TRANSPORTAION_CONFIG = {
  Path: new TileLayerConfig({
    key: "Path",
    path: Pathspath,
    fileName: "Paths",
    layerName: "Path",
  }),
  Bridge: new TileLayerConfig({
    key: "Bridge",
    path: Bridgepath,
    fileName: "Wood_Bridge",
    layerName: "Bridge",
  }),
};
