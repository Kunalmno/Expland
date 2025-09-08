/**
 * @typedef {Object} TileLayerConfig
 * @property {string} key
 * @property {string} path
 * @property {string} fileName
 * @property {string} layerName
 */

/**
 * @typedef {Object} TileLayerEntry
 * @property {TileLayerConfig} config
 * @property {string} tileset
 * @property {boolean} animated
 */

// tile/tileLayerConfigs.js

import { TileLayerEntry } from "./types/TileLayerEntry.js";

// Import all your individual config objects
import { DECORATION_CONFIG } from "../tiles/configs/furniture.js";
import { GRASS_CONFIG } from "../tiles/configs/grass.js";
import { HILLS_CONFIG } from "../tiles/configs/hills.js"; // Assuming you have this file too
import { HOUSE_CONFIG } from "../tiles/configs/House.js";
import { INTERACTION_CONFIG } from "../tiles/configs/interaction.js";
import { SAND_CONFIG } from "../tiles/configs/sand.js";
import { TRANSPORTAION_CONFIG } from "../tiles/configs/transportation.js";
import { WATER_CONFIG } from "../tiles/configs/water.js";

export const tileLayerConfigs = [
  new TileLayerEntry(WATER_CONFIG.water, "water", true),
  new TileLayerEntry(SAND_CONFIG.sand, "sand", false),

  new TileLayerEntry(GRASS_CONFIG.grass, "grass", false),
  new TileLayerEntry(GRASS_CONFIG.grass_decoration, "grass_decoration", false),

  new TileLayerEntry(HILLS_CONFIG.hillpath, "hillpath", false),
  new TileLayerEntry(HILLS_CONFIG.Hillsdecoration, "HillsDecoration", false),
  new TileLayerEntry(HILLS_CONFIG.SecondHill, "SecondHill", false),
  new TileLayerEntry(GRASS_CONFIG.grassdecoration, "grassdecoration", false),
  new TileLayerEntry(HOUSE_CONFIG.Housefloor, "Housefloor", false),
  new TileLayerEntry(HOUSE_CONFIG.Houselayer, "Houselayer", false),
  new TileLayerEntry(HOUSE_CONFIG.House, "House", false),
  new TileLayerEntry(
    DECORATION_CONFIG.HouseDecoration,
    "HouseDecoration",
    false
  ),
  new TileLayerEntry(DECORATION_CONFIG.Furntiture, "Furntiture", false),
  new TileLayerEntry(
    DECORATION_CONFIG.furntituredecoration,
    "furntituredecoration",
    false
  ),
  new TileLayerEntry(DECORATION_CONFIG.stoneonground, "stoneonground", false),
  new TileLayerEntry(DECORATION_CONFIG.stoneonwater, "stoneonwater", false),
  new TileLayerEntry(DECORATION_CONFIG.lilyonwater, "lilyonwater", false),

  new TileLayerEntry(INTERACTION_CONFIG.Closet, "Closet", false),
  new TileLayerEntry(INTERACTION_CONFIG.Bed, "Bed", false),
  new TileLayerEntry(INTERACTION_CONFIG.Doors, "Doors", false),

  new TileLayerEntry(TRANSPORTAION_CONFIG.Path, "Path", false),
  new TileLayerEntry(TRANSPORTAION_CONFIG.Bridge, "Bridge", false),
];
