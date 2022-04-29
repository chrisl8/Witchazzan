import playerObject from '../objects/playerObject.js';

function handlePlayerMovement(maxSpeed, useAcceleration) {
  // Stop any previous movement from the last frame
  const previousVelocityX = playerObject.player.body.velocity.x;
  const previousVelocityY = playerObject.player.body.velocity.y;
  playerObject.player.body.setVelocity(0);
  let fullSpeed = true;

  // Horizontal movement
  if (
    playerObject.keyState.ArrowLeft === 'keydown' ||
    playerObject.keyState.a === 'keydown' ||
    playerObject.joystickDirection.left
  ) {
    let newSpeed = -maxSpeed;
    if (useAcceleration) {
      if (previousVelocityX === 0) {
        newSpeed = -1;
        fullSpeed = false;
      } else if (previousVelocityX > -maxSpeed) {
        newSpeed = previousVelocityX - playerObject.acceleration;
        fullSpeed = false;
      }
    }
    playerObject.player.body.setVelocityX(newSpeed);
  } else if (
    playerObject.keyState.ArrowRight === 'keydown' ||
    playerObject.keyState.d === 'keydown' ||
    playerObject.joystickDirection.right
  ) {
    let newSpeed = maxSpeed;
    if (useAcceleration) {
      if (previousVelocityX === 0) {
        newSpeed = 1;
        fullSpeed = false;
      } else if (previousVelocityX < maxSpeed) {
        newSpeed = previousVelocityX + playerObject.acceleration;
        fullSpeed = false;
      }
    }
    playerObject.player.body.setVelocityX(newSpeed);
  }

  // Vertical movement
  if (
    playerObject.keyState.ArrowUp === 'keydown' ||
    playerObject.keyState.w === 'keydown' ||
    playerObject.joystickDirection.up
  ) {
    let newSpeed = -maxSpeed;
    if (useAcceleration) {
      if (previousVelocityY === 0) {
        newSpeed = -1;
        fullSpeed = false;
      } else if (previousVelocityY > -maxSpeed) {
        newSpeed = previousVelocityY - playerObject.acceleration;
        fullSpeed = false;
      }
    }
    playerObject.player.body.setVelocityY(newSpeed);
  } else if (
    playerObject.keyState.ArrowDown === 'keydown' ||
    playerObject.keyState.s === 'keydown' ||
    playerObject.joystickDirection.down
  ) {
    let newSpeed = maxSpeed;
    if (useAcceleration) {
      if (previousVelocityY === 0) {
        newSpeed = 1;
        fullSpeed = false;
      } else if (previousVelocityY < maxSpeed) {
        newSpeed = previousVelocityY + playerObject.acceleration;
        fullSpeed = false;
      }
    }
    playerObject.player.body.setVelocityY(newSpeed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  if (fullSpeed) {
    playerObject.player.body.velocity.normalize().scale(maxSpeed);
  }
}

export default handlePlayerMovement;