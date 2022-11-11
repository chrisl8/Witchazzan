import calculateVelocityFromDirection from './calculateVelocityFromDirection.js';
import makeRandomNumber from '../../../server/utilities/makeRandomNumber.js';

function moveSpriteTowardLocation({
  sprite,
  currentDirection,
  velocity,
  randomizeVelocity,
}) {
  if (sprite) {
    const defaultNpcVelocity = 50;
    sprite.sprite.body.setVelocityX(
      calculateVelocityFromDirection.x(
        velocity || defaultNpcVelocity,
        currentDirection +
          (randomizeVelocity ? makeRandomNumber.between(-100, 100) : 0),
      ),
    );
    sprite.sprite.body.setVelocityY(
      calculateVelocityFromDirection.y(
        velocity || defaultNpcVelocity,
        currentDirection +
          (randomizeVelocity ? makeRandomNumber.between(-100, 100) : 0),
      ),
    );
  }
}

export default moveSpriteTowardLocation;
