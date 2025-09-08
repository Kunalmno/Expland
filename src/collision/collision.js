// collision/collision.js
export default class Collision {
  constructor(scene, map, debug = false) {
    // Default debug to false
    this.scene = scene;
    this.map = map;
    this.debug = debug;
    this.collisionGroup = null;

    if (!this.scene || !this.scene.physics) {
      console.error("[Collision] Scene or physics system is undefined.");
      return;
    }
    if (!this.map) {
      console.error("[Collision] Map is undefined.");
      return;
    }

    this.collisionGroup = this.scene.physics.add.staticGroup();
    this._createCollision();
  }

  _createCollision() {
    const collisionLayer = this.map.getObjectLayer("Collision");
    if (!collisionLayer || !collisionLayer.objects) {
      console.warn(
        "[Collision] No 'Collision' object layer or objects found in map."
      );
      return;
    }

    collisionLayer.objects.forEach((obj, index) => {
      if (!obj || !obj.x || !obj.y || !obj.width || !obj.height) {
        console.warn(
          `[Collision] Invalid object at index ${index} in Collision layer.`
        );
        return;
      }

      const { x, y, width, height } = obj;

      const collider = this.scene.add.rectangle(
        x + width / 2,
        y + height / 2,
        width,
        height,
        0x0000ff,
        this.debug ? 0.3 : 0
      );

      if (!collider) {
        console.warn(
          `[Collision] Failed to create rectangle for object at (${x}, ${y}).`
        );
        return;
      }

      try {
        this.scene.physics.add.existing(collider, true); // Static physics body
        this.collisionGroup.add(collider);
      } catch (error) {
        console.error(
          `[Collision] Failed to add physics to collider at (${x}, ${y}):`,
          error
        );
      }
    });

    if (this.collisionGroup.getLength() === 0) {
      console.warn("[Collision] No colliders added to collisionGroup.");
    }
  }

  addCollider(target, callback = null) {
    if (!this.collisionGroup) {
      console.error("[Collision] collisionGroup is not initialized.");
      return;
    }
    if (!target || !target.body) {
      console.error("[Collision] Invalid target for collider:", target);
      return;
    }
    if (this.collisionGroup.getLength() === 0) {
      console.warn("[Collision] collisionGroup is empty; no colliders to add.");
      return;
    }

    try {
      const collider = this.scene.physics.add.collider(
        target,
        this.collisionGroup,
        callback
      );
      if (!collider) {
        console.warn("[Collision] Failed to create collider for target.");
      }
      return collider;
    } catch (error) {
      console.error("[Collision] Error in addCollider:", error);
      return null;
    }
  }
}
