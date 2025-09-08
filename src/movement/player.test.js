import { beforeEach, describe, expect, it, vi } from "vitest";
import { STATE } from "../constants/playerConfig.js";
import Player from "./player.js";

describe("Player", () => {
  let mockScene, mockSprite, mockKeyBinding, getMovementMock;

  beforeEach(() => {
    mockSprite = {
      setDepth: vi.fn(),
      setCollideWorldBounds: vi.fn(),
      setVelocity: vi.fn(),
      body: {
        setSize: vi.fn(),
        setOffset: vi.fn(),
      },
      anims: {
        play: vi.fn(),
      },
    };

    mockScene = {
      physics: {
        add: {
          sprite: vi.fn(() => mockSprite),
        },
      },
      anims: {
        create: vi.fn(),
        exists: vi.fn(() => false),
        generateFrameNumbers: vi.fn(() => []),
      },
    };

    mockKeyBinding = {
      cursors: {},
      keys: {},
    };

    getMovementMock = vi.fn(() => ({
      velocityX: 100,
      velocityY: 0,
      direction: "right",
      animKey: "walk-right",
    }));
  });

  it("initializes with correct defaults", () => {
    const player = new Player(mockScene, 0, 0, mockKeyBinding, getMovementMock);
    expect(player.state).toBe(STATE.IDLE);
    expect(player.direction).toBe("down");
  });

  it("updates movement and state correctly", () => {
    const player = new Player(mockScene, 0, 0, mockKeyBinding, getMovementMock);
    player.update();

    expect(getMovementMock).toHaveBeenCalled();
    expect(mockSprite.setVelocity).toHaveBeenCalledWith(100, 0);
    expect(player.state).toBe(STATE.MOVING);
    expect(player.direction).toBe("right");
    expect(mockSprite.anims.play).toHaveBeenCalledWith("walk-right", true);
  });

  it("sets state to IDLE and plays idle animation when not moving", () => {
    getMovementMock = vi.fn(() => ({
      velocityX: 0,
      velocityY: 0,
      direction: "up",
      animKey: "walk-up",
    }));

    const player = new Player(mockScene, 0, 0, mockKeyBinding, getMovementMock);
    player.update();

    expect(player.state).toBe(STATE.IDLE);
    expect(player.direction).toBe("up");
    expect(mockSprite.anims.play).toHaveBeenCalledWith("idle-up", true);
  });
});
