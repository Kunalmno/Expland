export const UI_MAP_CONFIG = {
  key: "uiMap",
  url: "/assets/Map/UI_layout.tmj",
};

export const SETTINGS_BUTTON_CONFIG = {
  objType: "settings_button",
  defaultWidth: 22,
  defaultHeight: 24,
  scale: 2,
  positionMultiplierX: 2.55,
  positionMultiplierY: 3,
  settingConfig: {
    key: "SettingsButton",
    path: "/assets/ui/UIButtons.png",
    frameWidth: 32,
    frameHeight: 32,
    frame: 35,
    clickedFrame: 36,
  },
};

export const WEATHER_UI_CONFIG = {
  objName: "WeatherUI",
  defaultWidth: 34,
  defaultHeight: 34,
  scale: 1.65,
  positionMultiplierX: 2.2,
  positionMultiplierY: 3,
  WeatherConfig: {
    key: "weather",
    path: "assets/ui/weatherUI.png",
    frameWidth: 80,
    frameHeight: 80,
    frame: 0,
  },
};

export const HEALTH_DISPLAY_CONFIG = {
  objType: "health_display",
  defaultWidth: 34,
  defaultHeight: 34,
  positionMultiplierX: 3,
  positionMultiplierY: 1.7,
  HeartUIConfig: {
    key: "HeartUI",
    path: "assets/ui/HeartUI.png",
    frameWidth: 30,
    frameHeight: 30,
    frame: 0,
    scale: 2,
  },
  HeartFrameConfig: {
    key: "HeartFrame",
    path: "assets/ui/Heartframe.png",
    frameWidth: 80,
    frameHeight: 40,
    frame: 0,
    sizeMultiplierX: 1.93,
    sizeMultiplierY: 1.03,
    scale: 2.25,
  },
};

export const HOTBAR_SLOTS_CONFIG = {
  objType: "hotbar_slot",
  defaultWidth: 34,
  defaultHeight: 34,
  scale: 2,
  positionMultiplierX: 2.55,
  positionMultiplierY: 1.9,
  HotBarSlotsConfig: {
    key: "Blocks",
    path: "assets/ui/Inventory_Blocks_Spritesheet.png",
    frameWidth: 48,
    frameHeight: 48,
    frame: 0,
  },
};
// config/UIObjectConfig.js
export const EMOJI_SELECTOR_CONFIG = {
  emojidata: {
    key: "teemo_emotes",
    path: "/assets/character/Teemo Basic emote animations sprite sheet.png",
    frameWidth: 32,
    frameHeight: 32,
    frame: 0, // Default emoji frame
  },
  emojiframe: {
    key: "emoji_frame",
    path: "/assets/ui/emojiFrameUI.png",
    frameWidth: 64,
    frameHeight: 64,
    frame: 0, // Static frame
  },
  objType: "emoji_selector",
  defaultWidth: 34,
  defaultHeight: 34,
  scale: 1.5,
  positionMultiplier: 3,
};

export const EMOJI_WHEEL_CONFIG = {
  key: "teemo_emotes",
  path: "/assets/character/Teemo Basic emote animations sprite sheet.png",
  frameWidth: 32,
  frameHeight: 32,
  objType: "EmojiWheel",
  emojis: [
    { key: "smile", frame: 0 },
    { key: "heart", frame: 1 },
    { key: "star", frame: 2 },
    { key: "thumb", frame: 3 },
  ],
};
