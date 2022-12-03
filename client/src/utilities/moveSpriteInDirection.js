import calculateVelocityFromDirection from './calculateVelocityFromDirection.js';
import makeRandomNumber from '../../../server/utilities/makeRandomNumber.js';

function moveSpriteInDirection({
  sprite,
  direction,
  velocity,
  randomizeVelocity,
}) {
  if (sprite) {
    const defaultNpcVelocity = 50;

    const desiredVelocityX = calculateVelocityFromDirection.x(
      velocity || defaultNpcVelocity,
      direction + (randomizeVelocity ? makeRandomNumber.between(-100, 100) : 0),
    );
    if (
      (sprite.sprite.body.blocked.left && desiredVelocityX < 0) ||
      (sprite.sprite.body.blocked.right && desiredVelocityX > 0)
    ) {
      sprite.sprite.body.setVelocityX(0);
    } else {
      sprite.sprite.body.setVelocityX(desiredVelocityX);
    }

    const desiredVelocityY = calculateVelocityFromDirection.y(
      velocity || defaultNpcVelocity,
      direction + (randomizeVelocity ? makeRandomNumber.between(-100, 100) : 0),
    );
    if (
      (sprite.sprite.body.blocked.up && desiredVelocityY < 0) ||
      (sprite.sprite.body.blocked.down && desiredVelocityY > 0)
    ) {
      sprite.sprite.body.setVelocityY(0);
    } else {
      sprite.sprite.body.setVelocityY(desiredVelocityY);
    }
    // console.log(
    //   sprite.sprite.body.blocked.none,
    //   desiredVelocityX,
    //   desiredVelocityY,
    // );
  }
}

export default moveSpriteInDirection;
