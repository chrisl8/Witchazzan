import clientSprites from '../objects/clientSprites.js';
import playerObject from '../objects/playerObject.js';

function addSpriteVelocity(hadron, key) {
  if (
    // It should exist now, even if it didn't before.
    clientSprites.has(key) &&
    // We control it.
    hadron.ctr === playerObject.playerId &&
    // But it isn't our shadow.
    key !== playerObject.playerId
  ) {
    /* SET VELOCITY ON SPRITES WE CONTROL */
    if (!clientSprites.get(key).velocitySet) {
      clientSprites.get(key).velocitySet = true;
      if (hadron.vlx !== undefined) {
        clientSprites.get(key).sprite.body.setVelocityX(hadron.vlx);
      }
      if (hadron.vly !== undefined) {
        clientSprites.get(key).sprite.body.setVelocityY(hadron.vly);
      }
    }
  }
}

export default addSpriteVelocity;
