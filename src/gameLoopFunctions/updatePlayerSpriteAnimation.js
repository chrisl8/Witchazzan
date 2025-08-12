import playerObject from '../objects/playerObject.js';

function updatePlayerSpriteAnimation() {
  // Update the animation last and give left/right animations precedence over up/down animations
  if (
    playerObject.keyState.ArrowLeft === 'keydown' ||
    playerObject.keyState.a === 'keydown' ||
    playerObject.joystickDirection.left ||
    (playerObject.playerDirection !== playerObject.newPlayerDirection &&
      playerObject.newPlayerDirection === 180)
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
    playerObject.joystickDirection.right ||
    (playerObject.playerDirection !== playerObject.newPlayerDirection &&
      playerObject.newPlayerDirection === 0)
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
    playerObject.joystickDirection.up ||
    (playerObject.playerDirection !== playerObject.newPlayerDirection &&
      playerObject.newPlayerDirection === 270)
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
    playerObject.joystickDirection.down ||
    (playerObject.playerDirection !== playerObject.newPlayerDirection &&
      playerObject.newPlayerDirection === 90)
  ) {
    playerObject.player.anims.play(
      `${playerObject.spriteData.name}-move-front`,
      true,
    );
    playerObject.playerDirection = 90;
    playerObject.playerStopped = false;
  } else {
    if (playerObject?.player?.anims) {
      playerObject.player.anims.stop();
    }
    playerObject.playerStopped = true;
  }
  // Always reset after reading this.
  playerObject.newPlayerDirection = playerObject.playerDirection;
}

export default updatePlayerSpriteAnimation;
