import { TREE_CONFIG } from "../../Scene/constants/gamescenedata";
const { key } = TREE_CONFIG;

export default class TreeManager {
  constructor(scene, player, actionKeys) {
    this.scene = scene;
    this.player = player; // Player instance (must expose axeHitbox or similar)
    this.actionKeys = actionKeys; // { cut, hoe, water }
    this.spawnPoints = [];
    this.activeTrees = new Map(); // Map<pointId, { sprite, hp }>
    this.maxTrees = 10;
  }

  loadSpawnPoints(objectLayerName = "TreeSpawnPoints") {
    const map = this.scene.map;
    const objectLayer = map.getObjectLayer(objectLayerName);

    if (!objectLayer) {
      console.warn(`Object layer ${objectLayerName} not found in map`);
      return;
    }

    this.spawnPoints = objectLayer.objects.map((obj) => ({
      id: obj.id,
      x: obj.x,
      y: obj.y,
    }));

    // Visualize spawn points
    // this.spawnPoints.forEach((p) => {
    //   const debugCircle = this.scene.add.circle(p.x, p.y, 3, 0xff0000);
    //   debugCircle.setDepth(1); // always on top
    // });
  }

  spawnInitialTrees() {
    const shuffled = Phaser.Utils.Array.Shuffle([...this.spawnPoints]);
    const selected = shuffled.slice(0, this.maxTrees);

    selected.forEach((point) => this.spawnTree(point));
  }

  spawnTree(point) {
    // Tree sprite with physics
    const treeSprite = this.scene.physics.add.sprite(
      point.x + 3.5,
      point.y + 20,
      key,
      1
    );
    treeSprite.setOrigin(0.5, 1); // bottom aligned
    treeSprite.setImmovable(true);

    const leafSprite = this.scene.add.sprite(
      point.x - 4.5,
      point.y + 7,
      key,
      0
    );
    leafSprite.setOrigin(0.5, 1);
    leafSprite.setDepth(100);
    // Collision box (only around trunk)
    treeSprite.body.setSize(10, 10); // width, height of trunk
    treeSprite.body.setOffset(
      treeSprite.width / 2 - 9, // center it (sprite width/2 - half trunk width)
      treeSprite.height / 2 - 9 // stick it to bottom of sprite
    );

    // Bounce spawn animation 🌱
    treeSprite.setScale(0);
    leafSprite.setScale(0);
    this.scene.tweens.add({
      targets: treeSprite,
      scaleX: 1,
      scaleY: 1,
      ease: "Back.Out",
      duration: 1000,
    });

    this.scene.tweens.add({
      targets: leafSprite,
      scaleX: 1,
      scaleY: 1,
      ease: "Back.Out",
      duration: 950,
      // delay: 800, // wait for trunk first
    });

    // Register tree
    this.activeTrees.set(point.id, {
      sprite: treeSprite,
      leaves: leafSprite,
      hp: 3,
    });

    // ✅ Ensure player collides with tree
    this.scene.physics.add.collider(this.scene.player.sprite, treeSprite);
  }

  cutTree(pointId) {
    const treeData = this.activeTrees.get(pointId);
    if (!treeData || treeData.hp <= 0) return;

    if (treeData.recentlyHit) return;

    treeData.hp -= 1;
    treeData.recentlyHit = true;
    console.log(`🌲 Tree ${pointId} hit! Remaining HP: ${treeData.hp}`);

    // Reset hit protection after swing window
    this.scene.time.delayedCall(300, () => {
      treeData.recentlyHit = false;
    });

    // Shake effect
    this.scene.tweens.add({
      targets: [treeData.sprite],
      x: treeData.sprite.x + 1,
      yoyo: true,
      repeat: 1,
      duration: 150,
    });

    this.scene.tweens.add({
      targets: [treeData.leaves],
      x: treeData.leaves.x + 1,
      yoyo: true,
      repeat: 1,
      duration: 100,
    });

    // Destroy if HP reaches 0
    if (treeData.hp <= 0) {
      console.log(`✅ Tree ${pointId} destroyed!`);

      treeData.sprite.destroy(); // remove sprite + physics body
      treeData.leaves.destroy();
      this.activeTrees.delete(pointId); // cleanup

      this.spawnReplacementTree(); // respawn new tree
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.actionKeys.cut)) {
      this.checkTreeHit();
    }
  }

  checkTreeHit() {
    if (!this.player.axeHitbox) {
      console.warn("Player has no axeHitbox defined!");
      return;
    }

    for (let [pointId, treeData] of this.activeTrees.entries()) {
      // ✅ Check axeHitbox overlap instead of player sprite
      if (this.scene.physics.overlap(this.player.axeHitbox, treeData.sprite)) {
        this.cutTree(pointId);
        break;
      }
    }
  }

  spawnReplacementTree() {
    const usedIds = new Set(this.activeTrees.keys());
    const available = this.spawnPoints.filter((p) => !usedIds.has(p.id));

    if (available.length === 0) return;

    const randomPoint = Phaser.Utils.Array.GetRandom(available);
    this.spawnTree(randomPoint);
  }
}
