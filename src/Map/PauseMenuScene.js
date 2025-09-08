import Phaser from "phaser";

export default class PauseMenuScene extends Phaser.Scene {
  constructor() {
    super("PauseMenuScene");
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Background overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    // Title
    this.add
      .text(width / 2, height / 4, "Game Paused", {
        fontFamily: "Arial",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Resume Button
    const resumeBtn = this.add
      .text(width / 2, height / 2 - 40, "Resume", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#00ff00",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    resumeBtn.on("pointerdown", () => {
      this.scene.stop(); // stop pause menu
      this.scene.resume("GameScene"); // resume game
    });

    // Save Button
    const saveBtn = this.add
      .text(width / 2, height / 2, "Save", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ffff00",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    saveBtn.on("pointerdown", () => {
      console.log("Game saved (stub)"); // Hook your save logic here
    });

    // Home Button
    const homeBtn = this.add
      .text(width / 2, height / 2 + 40, "Home", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    homeBtn.on("pointerdown", () => {
      this.scene.stop("GameScene");
      this.scene.start("MainMenuScene"); // assumes you have a main menu scene
    });

    // Settings Button
    const settingsBtn = this.add
      .text(width / 2, height / 2 + 80, "Settings", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#00ffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    settingsBtn.on("pointerdown", () => {
      console.log("Settings menu (stub)");
    });
  }
}
