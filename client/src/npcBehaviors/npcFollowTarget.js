/* eslint-disable no-param-reassign */
import Phaser from 'phaser';
import moveSpriteInDirection from '../utilities/moveSpriteInDirection.js';

function npcFollowTarget({ hadron, rayCastTargetPosition, clientSprite }) {
  if (
    clientSprite &&
    rayCastTargetPosition &&
    rayCastTargetPosition.hasOwnProperty('x') &&
    rayCastTargetPosition.hasOwnProperty('y')
  ) {
    const newAngleRad = Phaser.Math.Angle.Between(
      hadron.x,
      hadron.y,
      rayCastTargetPosition.x,
      rayCastTargetPosition.y,
    );
    const newAngleDeg = newAngleRad * Phaser.Math.RAD_TO_DEG;

    moveSpriteInDirection({
      sprite: clientSprite,
      direction: newAngleDeg,
      velocity: hadron.vel,
      randomizeVelocity: hadron.rvl,
    });
  }
}

export default npcFollowTarget;
