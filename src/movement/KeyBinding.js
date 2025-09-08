export default class KeyBinding {
  constructor(scene) {
    this.scene = scene;

    // Arrow keys (up/down/left/right)
    this.cursors = scene.input.keyboard.createCursorKeys();

    // WASD keys
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Action keys (cut, hoe, water)
    this.actionKeys = {
      cut: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      hoe: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
      water: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    };
  }

  getUp() {
    return this.cursors.up.isDown || this.keys.up.isDown;
  }

  getDown() {
    return this.cursors.down.isDown || this.keys.down.isDown;
  }

  getLeft() {
    return this.cursors.left.isDown || this.keys.left.isDown;
  }

  getRight() {
    return this.cursors.right.isDown || this.keys.right.isDown;
  }

  getActionKey(action) {
    return this.actionKeys[action].isDown;
  }
}
