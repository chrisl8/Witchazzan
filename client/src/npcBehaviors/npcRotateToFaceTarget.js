/* eslint-disable no-param-reassign */
import calculateEventualDirectionTowardLocation from '../utilities/calculateEventualDirectionTowardLocation.js';

function npcRotateToFaceTarget({
  hadron,
  newHadronData,
  hadronUpdated,
  rayCastTargetPosition,
  isRotating,
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

    if (newHadronData.dir !== newHadronDirection) {
      isRotating = true;
      hadronUpdated = true;
      newHadronData.dir = newHadronDirection;
    }
  }
  return [newHadronData, hadronUpdated, isRotating];
}

export default npcRotateToFaceTarget;
