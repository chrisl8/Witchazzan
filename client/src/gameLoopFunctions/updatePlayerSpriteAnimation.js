import playerObject from '../objects/playerObject.js';

function updatePlayerSpriteAnimation() {
  // Update the animation last and give left/right animations precedence over up/down animations
  if (
    playerObject.keyState.ArrowLeft === 'keydown' ||
    playerObject.keyState.a === 'keydown' ||
    playerObject.joystickDirection.left
  ) {
    playerObject.player.setFlipX(playerObject.spriteData.faces === 'right');
    playerObject.player.anims.play(
      `${playerObject.spriteData.name}-move-left`,
      true,
    );
    playerObject.playerDirection = 180;
    playerObject.playerStopped = false;
  } else if (
    playerObject.keyState.ArrowRight === 'keydown' ||
    playerObject.keyState.d === 'keydown' ||
    playerObject.joystickDirection.right
  ) {
    playerObject.player.setFlipX(playerObject.spriteData.faces === 'left');
    playerObject.player.anims.play(
      `${playerObject.spriteData.name}-move-right`,
      true,
    );
    playerObject.playerDirection = 0;
    playerObject.playerStopped = false;
  } else if (
    playerObject.keyState.ArrowUp === 'keydown' ||
    playerObject.keyState.w === 'keydown' ||
    playerObject.joystickDirection.up
  ) {
    playerObject.player.anims.play(
      `${playerObject.spriteData.name}-move-back`,
      true,
    );
    playerObject.playerDirection = 270;
    playerObject.playerStopped = false;
  } else if (
    playerObject.keyState.ArrowDown === 'keydown' ||
    playerObject.keyState.s === 'keydown' ||
    playerObject.joystickDirection.down
  ) {
    playerObject.player.anims.play(
      `${playerObject.spriteData.name}-move-front`,
      true,
    );
    playerObject.playerDirection = 90;
    playerObject.playerStopped = false;
  } else {
    playerObject.player.anims.stop();
    playerObject.playerStopped = true;
  }
}

export default updatePlayerSpriteAnimation;
