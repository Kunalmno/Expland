export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setCollideWorldBounds(true);
    this.speed = 70;

    this.createAnimations();
  }

  createAnimations() {
    const anims = this.scene.anims;

    anims.create({
      key: "walk-down",
      frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    anims.create({
      key: "walk-up",
      frames: anims.generateFrameNumbers("player", { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    anims.create({
      key: "walk-left",
      frames: anims.generateFrameNumbers("player", { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    anims.create({
      key: "walk-right",
      frames: anims.generateFrameNumbers("player", { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  update(cursors, keys) {
    const sprite = this.sprite;
    const speed = this.speed;

    let velocityX = 0;
    let velocityY = 0;
    let animKey = null;

    if (cursors.left.isDown || keys.A.isDown) {
      velocityX = -speed;
      animKey = "walk-left";
    } else if (cursors.right.isDown || keys.D.isDown) {
      velocityX = speed;
      animKey = "walk-right";
    }

    if (cursors.up.isDown || keys.W.isDown) {
      velocityY = -speed;
      animKey = "walk-up";
    } else if (cursors.down.isDown || keys.S.isDown) {
      velocityY = speed;
      animKey = "walk-down";
    }

    sprite.setVelocity(velocityX, velocityY);

    if (velocityX !== 0 || velocityY !== 0) {
      // if (!sprite.anims.isPlaying || sprite.anims.currentAnim.key !== animKey)
      sprite.anims.play(animKey, true);
    } else {
      sprite.anims.stop();
    }
  }
}
