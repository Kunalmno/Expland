// playerMovement.js
export function getMovement(cursors, keys, speed) {
  let velocityX = 0;
  let velocityY = 0;
  let direction = "down";
  let animKey = null;

  if (cursors.left.isDown || keys.left.isDown) {
    velocityX = -speed;
    direction = "left";
    animKey = "walk-left";
  } else if (cursors.right.isDown || keys.right.isDown) {
    velocityX = speed;
    direction = "right";
    animKey = "walk-right";
  } else if (cursors.up.isDown || keys.up.isDown) {
    velocityY = -speed;
    direction = "up";
    animKey = "walk-up";
  } else if (cursors.down.isDown || keys.down.isDown) {
    velocityY = speed;
    direction = "down";
    animKey = "walk-down";
  }

  return { velocityX, velocityY, direction, animKey };
}
