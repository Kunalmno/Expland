export const CHARACTER_CONFIG = {
  AnimalKey: "chicken",
};

export const STATE = Object.freeze({
  IDLE: "IDLE",
  MOVING: "MOVING",
});

export const SPRITE_CONFIG = {
  Depth: 10,
  Speed: 15,
  Delay: 3000,
  Direction: Object.freeze({
    up: 1,
    down: 2,
    left: 3,
    right: 4,
  }),
};

export const DIRECTION_RANGE = {
  from: SPRITE_CONFIG.Direction.up,
  to: SPRITE_CONFIG.Direction.right,
};

export const ANIMATIONS = {
  Walk: {
    up: "chicken-walk-up",
    down: "chicken-walk-down",
    left: "chicken-walk-left",
    right: "chicken-walk-right",
  },
  Idle: {
    up: "chicken-idle-up",
    down: "chicken-idle-down",
    left: "chicken-idle-left",
    right: "chicken-idle-right",
  },
};
