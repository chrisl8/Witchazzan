/* eslint-disable no-param-reassign */
import paths from '../objects/paths.js';
import npcRotateToFaceTarget from './npcRotateToFaceTarget.js';
import npcFollowTarget from './npcFollowTarget.js';
import npcCheckIfStuck from './npcCheckIfStuck.js';

function npcFollowPath({ hadron, clientSprite, newHadronData, hadronUpdated }) {
  const path = paths.get(newHadronData.fph);
  if (newHadronData.cpd === undefined) {
    hadronUpdated = true;
    newHadronData.cpd = 0;
  }

  const nextWaypoint = path.get(newHadronData.cpd);
  if (nextWaypoint) {
    const isStuck = npcCheckIfStuck(clientSprite);
    const closeEnoughProximity = 10;
    if (
      isStuck ||
      (Math.abs(Math.trunc(newHadronData.x) - Math.trunc(nextWaypoint.x)) <
        closeEnoughProximity &&
        Math.abs(Math.trunc(newHadronData.y) - Math.trunc(nextWaypoint.y)) <
          closeEnoughProximity)
    ) {
      // If we are at the destination stop and set next destination in path
      hadronUpdated = true;
      newHadronData.cpd++;
      if (!path.has(newHadronData.cpd)) {
        // Reset to 0 if we are at the end of the path.
        newHadronData.cpd = 0;
      }
      // and stop
      newHadronData.vlx = 0;
      newHadronData.vly = 0;
      if (clientSprite) {
        clientSprite.sprite.body.setVelocityX(0);
        clientSprite.sprite.body.setVelocityY(0);
      }
    } else {
      // NOTE: If your velocity causes the sprites to overshoot the destination, they
      // can get caught in a loop of passing it, turning around, and passing it again.
      // The fix is to slow them down or increase the closeEnoughProximity
      let isRotating = false;
      [newHadronData, hadronUpdated, isRotating] = npcRotateToFaceTarget({
        newHadronData,
        hadronUpdated,
        rayCastTargetPosition: { x: nextWaypoint.x, y: nextWaypoint.y },
        isRotating,
      });
      if (isRotating) {
        // Stop if we are trying to rotate, otherwise we fly off into the void while trying to realign ourselves.
        /*
        NOTE: If they seem to "jerk" across the screen to their destination, it is because they are continually
        getting slightly off course and stopping to adjust their rotation.
         */
        newHadronData.vlx = 0;
        newHadronData.vly = 0;
        if (clientSprite) {
          clientSprite.sprite.body.setVelocityX(0);
          clientSprite.sprite.body.setVelocityY(0);
        }
      } else if (clientSprite) {
        npcFollowTarget({
          hadron,
          rayCastTargetPosition: { x: nextWaypoint.x, y: nextWaypoint.y },
          clientSprite,
        });
      }
    }
  }
  return [newHadronData, hadronUpdated];
}

export default npcFollowPath;
