import Phaser from "phaser";

export default class Minigame extends Phaser.Scene {
  constructor() {
    super("Minigame");

    this.GameState = {
      IDLE: "IDLE",
      ACTIVE: "ACTIVE",
      WIN: "WIN",
      FAIL: "FAIL",
    };

    this.currentStep = 0;
    this.gameState = this.GameState.ACTIVE;
  }

  preload() {
    this.load.image("MiniGameBar", "/assets/img/MiniGameBar.png");
    this.load.image(
      "MiniGameBarBackground",
      "/assets/img/MiniGameBarBackground.png"
    );
    this.load.image("PointerDot", "/assets/img/PointerDot.png");
    this.load.image("HitZone", "/assets/img/HitZone.png");
    this.load.image("InventorySlotBar", "/assets/img/InventorySlotBar.png");
    this.load.image(
      "InventorySlotBarBackground",
      "/assets/img/InventorySlotBarBackground.png"
    );
    this.load.image("Lock", "/assets/img/Lock.png");
  }

  create() {
    const canvasHeight = this.cameras.main.height;
    const vh = canvasHeight / 100;
    const barWidth = 40 * vh;
    const barHeight = 40 * vh;
    const pointerSize = 6 * vh;
    const hitZoneWidth = 60;
    const hitZoneHeight = 55 * vh;
    const screenWidth = 10 + barWidth - 10 * vh - pointerSize;
    const slotSize = 15 * vh;
    const slotSpacing = 10 * vh;
    const slotCount = 5;
    const lockSize = 25 * vh;
    const slotBarOffset = -18 * vh;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // LockBar (flex row with locks and bar)
    // Left Lock
    this.add
      .image(centerX - barWidth / 2 - lockSize / 3, centerY, "Lock")
      .setDisplaySize(lockSize, lockSize)
      .setOrigin(0.5);

    // Right Lock
    this.add
      .image(centerX + barWidth / 2 + lockSize / 3, centerY, "Lock")
      .setDisplaySize(lockSize, lockSize)
      .setOrigin(0.5);

    // Main_Frame (contains MiniGameBarFrame and MiniGameBar)

    // MiniGameBar
    this.MiniGameBar = this.physics.add
      .image(centerX, centerY, "MiniGameBarBackground")
      .setDisplaySize(barWidth, barHeight)
      .setOrigin(0.5);

    // HitZone
    this.HitZone = this.physics.add
      .image(centerX, centerY, "HitZone")
      .setDisplaySize(hitZoneWidth, hitZoneHeight)
      .setOrigin(0.5);

    // PointerDot
    this.PointerDot = this.physics.add
      .image(centerX - barWidth / 2 + pointerSize, centerY, "PointerDot")
      .setDisplaySize(pointerSize, pointerSize)
      .setOrigin(0.5);

    this.add
      .image(centerX, centerY, "MiniGameBar")
      .setDisplaySize(40 * vh, 40 * vh)
      .setOrigin(0.5);

    // InventorySlotBar
    this.InventorySlotBar = [];
    const startX = centerX - ((slotCount - 1) * slotSpacing) / 2;
    for (let i = 0; i < slotCount; i++) {
      // ScoreFrame
      const frame = this.add
        .image(
          startX + i * slotSpacing,
          centerY + slotBarOffset + slotSize / 2,
          "InventorySlotBar"
        )
        .setDisplaySize(slotSize, slotSize)
        .setOrigin(0.5);

      // Score (background)
      const slot = this.add
        .image(
          startX + i * slotSpacing,
          centerY + slotBarOffset + slotSize / 2,
          "InventorySlotBarBackground"
        )
        .setDisplaySize(slotSize, slotSize)
        .setOrigin(0.5);

      this.InventorySlotBar.push(slot);
    }

    // Input setup for 'B' key
    this.interactKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.B
    );

    // Optional ESC key to exit
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on("down", () => {
        this.scene.stop("MinigameScene");
        this.scene.resume("GameScene");
      });

    // Animate PointerDot
    this.animateBox(screenWidth);

    // Debug
    console.log("MinigameScene created");
  }

  update() {
    // Check for 'B' key press
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      const correct = this.isOverlapping(this.PointerDot, this.HitZone);
      this.updateGame(correct);
    }
  }

  animateBox(screenWidth) {
    this.tweens.add({
      targets: this.PointerDot,
      x: this.cameras.main.centerX + screenWidth / 2, // Move to right edge
      duration: 1000, // 1 second
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });
  }

  isOverlapping(el1, el2) {
    const rect1 = el1.getBounds();
    const rect2 = el2.getBounds();
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  resetGame() {
    this.InventorySlotBar.forEach((slot) => {
      slot.setTint(0xffffff); // Reset to no tint
    });
    this.currentStep = 0;
    this.gameState = this.GameState.ACTIVE;
  }

  updateGame(correct) {
    if (this.gameState !== this.GameState.ACTIVE) return;

    const currentSlot = this.InventorySlotBar[this.currentStep];

    if (correct) {
      // Success: Green tint
      currentSlot.setTint(0x00ff00); // Approximate sepia(1) saturate(4) hue-rotate(90deg)
      this.currentStep++;

      if (this.currentStep === this.InventorySlotBar.length) {
        this.gameState = this.GameState.WIN;
        console.log("🎉 You win!");
        this.time.delayedCall(800, () => {
          this.resetGame();
          this.scene.stop("MinigameScene");
          this.scene.resume("GameScene");
        });
      }
    } else {
      // Failure: Red tint
      currentSlot.setTint(0xff0000); // Approximate sepia(1) saturate(6) hue-rotate(-20deg)
      this.gameState = this.GameState.FAIL;
      console.log("❌ You failed!");
      this.time.delayedCall(500, () => {
        this.resetGame();
        this.scene.stop("MinigameScene");
        this.scene.resume("GameScene");
      });
    }
  }
}
