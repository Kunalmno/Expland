export default class ClosetMinigame {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
    this.uiContainer = null;
    this.active = false;
    this.onComplete = null;
    this.scoreIndicators = [];
    this.scoreIndex = 0;
    this.pinSpeed = 1000;
    this.pinTween = null;
    this.canpressKey = true;
  }

  show(onComplete) {
    if (this.active) return;
    this.active = true;
    this.onComplete = onComplete;

    const { x, y } = this.position;
    this.uiContainer = this.scene.add.container(x, y - 15);

    this.bg = this.scene.add.rectangle(0, 0, 50, 10, 0x333333);
    this.pin = this.scene.add.rectangle(
      this.bg.x - this.bg.width / 2 + 5,
      this.bg.y,
      5,
      5,
      0xffffff
    );
    const hitZone = this.scene.add.rectangle(
      this.bg.x,
      this.bg.y,
      10,
      5,
      0xb1300f
    );
    this.uiContainer.add([this.bg, hitZone, this.pin]);

    // Score indicators (5 boxes in a row)
    this.scoreIndicators = [];
    this.scoreIndex = 0;
    const scoreStartX = -24;
    const scoreStartY = -10;
    for (let i = 0; i < 5; i++) {
      const box = this.scene.add.rectangle(
        scoreStartX + i * 12,
        scoreStartY,
        6,
        6,
        0xffffff
      );
      this.uiContainer.add(box);
      this.scoreIndicators.push(box);
    }

    // Tween pin horizlly
    this.PinSpeed();
    // Handle B press
    this.scene.input.keyboard.on(
      "keydown-B",
      () => {
        if (this.canpressKey) {
          const isHit = this.isOverlappingX(this.pin, hitZone);

          if (isHit) {
            this.scoreIndicators[this.scoreIndex].setFillStyle(0x00ff00);
            this.scoreIndex++;
            this.onSuccessfulHit();

            // Game complete
            if (this.scoreIndex >= this.scoreIndicators.length) {
              console.log("Success!");
              this.BlinkOnSuccess();
            }
          } else {
            console.log("❌ You failed!");
            this.BlinkOnFail();
          }
        } else {
          console.log("can't press the button during animation");
        }
      },

      this.scene.input.keyboard.once("keydown-SPACE", () => this.complete())
    );
  }

  isOverlappingX(el1, el2) {
    const pin = el1.getBounds();
    const rew = el2.getBounds();

    const before = pin.right < rew.left;
    const after = pin.left > rew.right;
    const overlapping = !(before || after);

    return overlapping;
  }

  resetPinSpeed() {
    if (this.pinTween) {
      this.pinTween.timeScale = 1; // increase speed by 20%
    }
  }

  PinSpeed() {
    const fromX = this.bg.x - this.bg.width / 2 + 5;
    const toX = this.bg.x + this.bg.width / 2 - 5;

    this.pinTween = this.scene.tweens.add({
      targets: this.pin,
      x: { from: fromX, to: toX },
      duration: this.pinSpeed, // initial speed
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  onSuccessfulHit() {
    if (this.pinTween) {
      this.pinTween.timeScale *= 1.2; // increase speed by 20%
      // this.pinTween.timeScale = 1;
    }
  }

  BlinkOnSuccess() {
    const Indicator = this.scoreIndicators.slice(0, this.scoreIndex);

    this.scene.tweens.add({
      targets: Indicator,
      alpha: KEYSCONFIG.BlinkOnSuccess.alpha,
      duration: KEYSCONFIG.BlinkOnSuccess.duration,
      yoyo: KEYSCONFIG.BlinkOnSuccess.yoyo,
      repeat: KEYSCONFIG.BlinkOnSuccess.repeat,
      onYoyo: () => {
        Indicator.forEach((Indicator) => {
          Indicator.setFillStyle(KEYSCONFIG.BlinkOnSuccess.IndicatorColor);
        }); // optional highlight
      },
      onComplete: () => {
        this.scene.time.delayedCall(
          KEYSCONFIG.BlinkOnSuccess.DelayedTime,
          () => {
            this.resetPinSpeed();
            this.complete();
            this.canpressKey = true; // restart minigame logic
          }
        );
      },
    });
  }

  BlinkOnFail() {
    /* Need to stop any further game after failure */
    const indicator = this.scoreIndicators.slice(
      KEYSCONFIG.BlinkOnFail.start,
      this.scoreIndex
    );

    this.scene.tweens.add({
      targets: indicator,
      alpha: KEYSCONFIG.BlinkOnFail.alpha,
      duration: KEYSCONFIG.BlinkOnFail.duration,
      yoyo: KEYSCONFIG.BlinkOnFail.yoyo,
      repeat: KEYSCONFIG.BlinkOnFail.repeat,
      onYoyo: () => {
        this.canpressKey = false;
        indicator.forEach((indicator) => {
          indicator.setFillStyle(KEYSCONFIG.BlinkOnFail.IndicatorColor);
        }); // optional highlight
      },
      onComplete: () => {
        this.scene.time.delayedCall(KEYSCONFIG.BlinkOnFail.DelayedTime, () => {
          this.canpressKey = true;
          this.resetPinSpeed();
          this.resetGame(); // restart minigame logic
        });
      },
    });
  }
  resetGame() {
    this.scoreIndicators.forEach((scoreIndex) => {
      scoreIndex.setFillStyle(KEYSCONFIG.BlinkOnFail.IndicatorColor); // Reset to no tint
    });
    this.scoreIndex = 0;
  }
  complete() {
    if (this.uiContainer) {
      this.uiContainer.destroy();
    }

    this.active = false;

    // if (this.updateHandler) {
    //   this.scene.events.off("update", this.updateHandler);
    //   this.updateHandler = null;
    // }

    // Remove key listener (optional: once is safer)
    this.scene.input.keyboard.removeAllListeners(KEYSCONFIG.MiniGameKey);

    if (this.onComplete) {
      this.onComplete(); // callback after finish
    }

    console.log(KEYSCONFIG.MiniGameMessage);
  }
}

export const KEYSCONFIG = {
  MiniGameKey: "keydown-B",
  MiniGameMessage: "Minigame complete!",
  BlinkOnFail: {
    start: 0,
    alpha: { from: 1, to: 0 },
    duration: 150,
    yoyo: true,
    repeat: 5,
    IndicatorColor: 0xff0000,
    DelayedTime: 200,
  },
  BlinkOnSuccess: {
    start: 0,
    alpha: { from: 1, to: 0 },
    duration: 150,
    yoyo: true,
    repeat: 5,
    IndicatorColor: 0x00ff00,
    DelayedTime: 500,
  },
};
