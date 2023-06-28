// Escaping behavior for stuck sprites.
// Note that we are storing the data in the local Phaser sprite data store,
// because there is no reason to transmit this across the network.
// If control changes while a sprite is stuck, the new controller will discover this on its own.
// TODO: Make this delta time based, not frame based.
// TODO: Set this per NPC, or as input variables.
const stuckDurationThreshold = 20;
const stuckMovementThreshold = 3;

function npcCheckIfStuck(clientSprite) {
  let isStuck = false;
  if (clientSprite?.sprite?.data) {
    let stuckX = clientSprite.sprite.getData('stuckX') || 1;
    let stuckY = clientSprite.sprite.getData('stuckY') || 1;
    if (
      !clientSprite.sprite.getData('previousX') ||
      Math.abs(
        clientSprite.sprite.getData('previousX') - clientSprite.sprite.body.x,
      ) > stuckMovementThreshold
    ) {
      clientSprite.sprite.setData('previousX', clientSprite.sprite.body.x);
      clientSprite.sprite.setData('stuckX', 0);
    } else {
      if (stuckX) {
        stuckX += 1;
      }
      clientSprite.sprite.setData('stuckX', stuckX);
    }

    if (
      !clientSprite.sprite.getData('previousY') ||
      Math.abs(
        clientSprite.sprite.getData('previousY') - clientSprite.sprite.body.y,
      ) > stuckMovementThreshold
    ) {
      clientSprite.sprite.setData('previousY', clientSprite.sprite.body.y);
      clientSprite.sprite.setData('stuckY', 0);
    } else {
      if (stuckY) {
        stuckY += 1;
      }
      clientSprite.sprite.setData('stuckY', stuckY);
    }
    isStuck =
      stuckX > stuckDurationThreshold && stuckY > stuckDurationThreshold;
  }
  if (isStuck) {
    // Resets so we don't get into rapid loops
    // In other words, take action on a stuck item, but then wait for it to be "stuck again"
    // before taking action again, as some actions are a series.
    clientSprite.sprite.setData('stuckX', 0);
    clientSprite.sprite.setData('stuckY', 0);
  }
  return isStuck;
}
export default npcCheckIfStuck;
