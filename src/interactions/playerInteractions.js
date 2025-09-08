export default class PlayerInteractions {
  constructor(scene, player, axeManager) {
    this.scene = scene;
    this.player = player;
    this.axeManager = axeManager; // 🔑 inject axe logic
    this.currentTask = "idle";
    this.direction = "down";

    this.setupAnimations();
  }
  static animationsCreated = false;

  setupAnimations() {
    if (PlayerInteractions.animationsCreated) return;

    const anims = this.scene.anims;
    // Cutting animations
    anims.create({
      key: "cutting_down",
      frames: anims.generateFrameNumbers("player", { start: 8, end: 9 }),
      frameRate: 2,
      repeat: -1,
    });

    anims.create({
      key: "cutting_up",
      frames: anims.generateFrameNumbers("player", { start: 10, end: 11 }),
      frameRate: 2,
      repeat: -1,
    });

    anims.create({
      key: "cutting_left",
      frames: anims.generateFrameNumbers("player", { start: 12, end: 13 }),
      frameRate: 2,
      repeat: -1,
    });

    anims.create({
      key: "cutting_right",
      frames: anims.generateFrameNumbers("player", { start: 14, end: 15 }),
      frameRate: 2,
      repeat: -1,
    });

    // Hoeing animations
    anims.create({
      key: "hoe_down",
      frames: anims.generateFrameNumbers("player", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "hoe_up",
      frames: anims.generateFrameNumbers("player", { start: 2, end: 3 }),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "hoe_left",
      frames: anims.generateFrameNumbers("player", { start: 4, end: 5 }),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "hoe_right",
      frames: anims.generateFrameNumbers("player", { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1,
    });

    // Watering animations (TEMP: reuse hoeing frames until real watering sprites)
    anims.create({
      key: "water_down",
      frames: anims.generateFrameNumbers("player", { start: 16, end: 17 }),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "water_up",
      frames: anims.generateFrameNumbers("player", { start: 18, end: 19 }),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "water_left",
      frames: anims.generateFrameNumbers("player", { start: 20, end: 21 }),
      frameRate: 2,
      repeat: -1,
    });
    anims.create({
      key: "water_right",
      frames: anims.generateFrameNumbers("player", { start: 22, end: 23 }),
      frameRate: 2,
      repeat: -1,
    });

    PlayerInteractions.animationsCreated = true;
  }

  handleCut() {
    const player = this.player;
    const animKey = this.getCuttingAnim();

    // play swing animation
    player.anims.play(animKey, true);

    // delay the hitbox creation until halfway through animation (~300ms)
    this.scene.time.delayedCall(300, () => {
      this.spawnHitbox();
    });
  }

  setDirection(dir) {
    this.direction = dir;
  }

  stopTask() {
    this.player.sprite.setTexture("kitty");
    this.player.sprite.play(`idle-${this.direction}`, true);
  }

  startInteraction(action) {
    this.player.state = "interacting";
    this.player.sprite.setTexture("player");
    this.player.sprite.play(`${action}_${this.direction}`);

    // 🔑 if it's a cutting action, spawn axe hitbox
    if (action === "cutting" && this.axeManager) {
      this.scene.time.delayedCall(500, () =>
        this.axeManager.swingAxe(this.direction)
      );
    }

    this.scene.time.delayedCall(800, () => {
      this.player.state = "idle";
      this.player.sprite.setTexture("kitty");
      this.player.sprite.play(`idle-${this.direction}`);
    });
  }

  update(cursors, actionKeys) {
    if (this.currentTask !== "idle") return;

    if (cursors.left.isDown) {
      this.setDirection("left");
    } else if (cursors.right.isDown) {
      this.setDirection("right");
    } else if (cursors.up.isDown) {
      this.setDirection("up");
    } else if (cursors.down.isDown) {
      this.setDirection("down");
    }

    // 🔑 Actions
    if (Phaser.Input.Keyboard.JustDown(actionKeys.cut)) {
      this.startInteraction("cutting", this.direction);
    }
    if (Phaser.Input.Keyboard.JustDown(actionKeys.hoe)) {
      this.startInteraction("hoe", this.direction);
    }
    if (Phaser.Input.Keyboard.JustDown(actionKeys.water)) {
      this.startInteraction("water", this.direction);
    }
  }
}
