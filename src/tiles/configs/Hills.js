// tile/configs/grass.js
import { TileLayerConfig } from "../types/TileLayerConfig.js";

const hillsPath = "/assets/Tilesets/Hills/Hills.png";

export const HILLS_CONFIG = {
  Hills: new TileLayerConfig({
    key: "Hills",
    path: hillsPath,
    fileName: "Hills",
    layerName: "Hills",
  }),

  Hillsdecoration: new TileLayerConfig({
    key: "HillsDecoration",
    path: hillsPath,
    fileName: "Hills",
    layerName: "HillsDecoration",
  }),

  hillpath: new TileLayerConfig({
    key: "hillpath",
    path: hillsPath,
    fileName: "Hills",
    layerName: "hillpath",
  }),

  SecondHill: new TileLayerConfig({
    key: "SecondHill",
    path: hillsPath,
    fileName: "Hills",
    layerName: "SecondHill",
  }),
};
