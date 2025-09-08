import Phaser from "phaser";
import { EMOJI_SELECTOR_CONFIG } from "../config/UIObjectConfig";

export default class EmojiSelector {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    this.container = this.scene.add.container(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY
    );
    this.container.setDepth(1000); // Always on top
    this.container.setVisible(false);

    this.emojis = [];

    // Create wheel background
    const bg = scene.add.circle(0, 0, 120, 0x000000, 0.5);
    this.container.add(bg);

    // Create emoji icons in a circle
    const radius = 90;
    const icons = EMOJI_SELECTOR_CONFIG.emojis; // Array of keys for emoji sprites
    const step = (2 * Math.PI) / icons.length;

    icons.forEach((emojiKey, i) => {
      const angle = i * step - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const emoji = scene.add
        .image(x, y, emojiKey)
        .setInteractive({ useHandCursor: true });

      emoji.setScale(0.5);
      emoji.on("pointerdown", () => this.selectEmoji(emojiKey));

      this.container.add(emoji);
      this.emojis.push(emoji);
    });

    // Key to toggle
    this.keyO = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    this.keyO.on("down", () => this.toggle());
  }

  toggle() {
    const visible = !this.container.visible;
    this.container.setVisible(visible);

    if (visible) {
      // Open selector → pause game
      this.scene.scene.pause("GameScene");
      this.scene.input.setDefaultCursor("pointer");
    } else {
      // Close selector → resume game
      this.scene.input.setDefaultCursor("default");
      this.scene.scene.resume("GameScene");
    }
  }

  selectEmoji(emojiKey) {
    // Update player emoji
    if (this.player.setEmoji) {
      this.player.setEmoji(emojiKey);
    } else {
      console.warn("Player has no setEmoji() method");
    }

    // Hide wheel
    this.toggle();

    // Sync with UIMap
    if (this.scene.scene.isActive("UIMap")) {
      const ui = this.scene.scene.get("UIMap");
      if (ui.updateEmoji) ui.updateEmoji(emojiKey);
    }
  }
}
