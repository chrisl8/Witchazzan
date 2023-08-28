/* eslint-disable no-param-reassign */
import calculateVelocityFromDirection from './calculateVelocityFromDirection.js';
import makeRandomNumber from '../../../server/utilities/makeRandomNumber.js';

function moveSpriteInDirection({
  sprite,
  direction,
  velocity,
  randomizeVelocity,
  hadronUpdated,
}) {
  if (sprite) {
    const defaultNpcVelocity = 50;

    let desiredVelocityX = calculateVelocityFromDirection.x(
      velocity || defaultNpcVelocity,
      direction + (randomizeVelocity ? makeRandomNumber.between(-100, 100) : 0),
    );
    if (
      (sprite.sprite.body.blocked.left && desiredVelocityX < 0) ||
      (sprite.sprite.body.blocked.right && desiredVelocityX > 0)
    ) {
      desiredVelocityX = 0;
    }

    let desiredVelocityY = calculateVelocityFromDirection.y(
      velocity || defaultNpcVelocity,
      direction + (randomizeVelocity ? makeRandomNumber.between(-100, 100) : 0),
    );
    if (
      (sprite.sprite.body.blocked.up && desiredVelocityY < 0) ||
      (sprite.sprite.body.blocked.down && desiredVelocityY > 0)
    ) {
      desiredVelocityY = 0;
    }

    if (Math.abs(sprite.sprite.body.velocity.x - desiredVelocityX) > 0.001) {
      hadronUpdated = true;
      sprite.sprite.body.setVelocityX(desiredVelocityX || 0);
    }

    if (Math.abs(sprite.sprite.body.velocity.y - desiredVelocityY) > 0.001) {
      hadronUpdated = true;
      sprite.sprite.body.setVelocityY(desiredVelocityY || 0);
    }
  }
  return hadronUpdated;
}

export default moveSpriteInDirection;
