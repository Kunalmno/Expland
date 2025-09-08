// emojiSelectorUtils.js
import {
  EMOJI_SELECTOR_CONFIG,
  HEALTH_DISPLAY_CONFIG,
  HOTBAR_SLOTS_CONFIG,
  SETTINGS_BUTTON_CONFIG,
  WEATHER_UI_CONFIG,
} from "../config/UIObjectConfig";
import EmojiSelector from "../Map/EmojiSelector";

export function createEmojiSelector(scene, obj) {
  const { defaultWidth, defaultHeight, scale, positionMultiplier, emojiframe } =
    EMOJI_SELECTOR_CONFIG;

  const x = obj.x * positionMultiplier;
  const y = obj.y * positionMultiplier;
  const width = obj.width || defaultWidth;
  const height = obj.height || defaultHeight;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone, true);

  const emojiSelector = scene.add.image(x, y, emojiframe.key, emojiframe.frame);
  emojiSelector.setScale(scale);
  return emojiSelector;
}

export function createSettingButton(scene, obj) {
  const {
    defaultWidth,
    defaultHeight,
    scale,
    positionMultiplierX,
    positionMultiplierY,
    settingConfig,
  } = SETTINGS_BUTTON_CONFIG;

  const x = obj.x * positionMultiplierX;
  const y = obj.y * positionMultiplierY;
  const width = obj.width || defaultWidth;
  const height = obj.height || defaultHeight;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone, true);

  const settingButton = scene.add.image(
    x,
    y,
    settingConfig.key,
    settingConfig.frame
  );
  settingButton.setScale(scale);
  return settingButton;
}

export function createWeatherUI(scene, obj) {
  const {
    defaultWidth,
    defaultHeight,
    scale,
    positionMultiplierX,
    positionMultiplierY,
    WeatherConfig,
  } = WEATHER_UI_CONFIG;

  const x = obj.x * positionMultiplierX;
  const y = obj.y * positionMultiplierY;
  const width = obj.width || defaultWidth;
  const height = obj.height || defaultHeight;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone, true);

  const settingButton = scene.add.image(
    x,
    y,
    WeatherConfig.key,
    WeatherConfig.frame
  );
  settingButton.setScale(scale);
}

export function createHealthUI(scene, obj) {
  const {
    defaultWidth,
    defaultHeight,
    scale,
    positionMultiplierX,
    positionMultiplierY,
    HeartUIConfig,
    HeartFrameConfig,
  } = HEALTH_DISPLAY_CONFIG;

  const x = obj.x * positionMultiplierX;
  const y = obj.y * positionMultiplierY;
  const width = obj.width || defaultWidth;
  const height = obj.height || defaultHeight;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone, true);

  const heartframe = scene.add.image(
    x * HeartFrameConfig.sizeMultiplierX,
    y * HeartFrameConfig.sizeMultiplierY,
    HeartFrameConfig.key,
    HeartFrameConfig.frame
  );
  heartframe.setScale(HeartFrameConfig.scale);

  const heartUI = scene.add.image(x, y, HeartUIConfig.key, HeartUIConfig.frame);
  heartUI.setScale(HeartUIConfig.scale);
}

export function createHotBarSlot(scene, obj) {
  const {
    defaultWidth,
    defaultHeight,
    scale,
    positionMultiplierX,
    positionMultiplierY,
    HotBarSlotsConfig,
  } = HOTBAR_SLOTS_CONFIG;

  const x = obj.x * positionMultiplierX;
  const y = obj.y * positionMultiplierY;
  const width = obj.width || defaultWidth;
  const height = obj.height || defaultHeight;

  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone, true);

  const hotbarslots = scene.add.image(
    x,
    y,
    HotBarSlotsConfig.key,
    HotBarSlotsConfig.frame
  );
  hotbarslots.setScale(scale);

  return hotbarslots;
}
