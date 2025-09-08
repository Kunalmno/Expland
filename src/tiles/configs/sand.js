import { TileLayerConfig } from "../types/TileLayerConfig.js";

const sandpath = "/assets/Tilesets/sand/Tilled_Dirt_v2.png";

export const SAND_CONFIG = {
  sand: new TileLayerConfig({
    key: "sand",
    path: sandpath,
    fileName: "Tilled_Dirt_v2",
    layerName: "sand",
  }),
};
