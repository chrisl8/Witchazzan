/* eslint-disable no-param-reassign */
import calculateEventualDirectionTowardLocation from '../utilities/calculateEventualDirectionTowardLocation.js';

function npcRotateToFaceTarget({
  newHadronData,
  hadronUpdated,
  rayCastTargetPosition,
  isRotating,
  closeEnough = 0.09, // degrees
}) {
  if (
    rayCastTargetPosition &&
    rayCastTargetPosition.hasOwnProperty('x') &&
    rayCastTargetPosition.hasOwnProperty('y')
  ) {
    const newHadronDirection = calculateEventualDirectionTowardLocation({
      currentDirection: newHadronData.dir,
      fromX: newHadronData.x,
      fromY: newHadronData.y,
      toX: rayCastTargetPosition.x,
      toY: rayCastTargetPosition.y,
      rotationSpeed: newHadronData.rsp,
    });

    if (Math.abs(newHadronData.dir - newHadronDirection) > closeEnough) {
      isRotating = true;
      hadronUpdated = true;
      newHadronData.dir = newHadronDirection;
    }
  }
  return [newHadronData, hadronUpdated, isRotating];
}

export default npcRotateToFaceTarget;
