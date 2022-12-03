import Phaser from 'phaser';

function calculateEventualDirectionTowardLocation({
  currentDirection,
  fromX,
  fromY,
  toX,
  toY,
  rotationSpeed,
}) {
  const newAngleRad = Phaser.Math.Angle.Between(fromX, fromY, toX, toY);
  // Deal with angles that are physically close to each other but cross boundaries,
  // making them numerically distant
  // This should work regardless of where that boundary is.
  // https://stackoverflow.com/a/28037434/4982408
  const newAngleDeg = newAngleRad * Phaser.Math.RAD_TO_DEG;
  let difference = ((newAngleDeg - currentDirection + 180) % 360) - 180;
  difference = difference < -180 ? difference + 360 : difference;

  const defaultRotationSpeed = 0.05;
  const t = rotationSpeed || defaultRotationSpeed;

  let newDirection = currentDirection + t * difference;

  // Let Achilles go ahead and catch the Tortoise
  if (Math.abs(difference) < 1) {
    newDirection = newAngleDeg;
  }

  return newDirection;
}

export default calculateEventualDirectionTowardLocation;
