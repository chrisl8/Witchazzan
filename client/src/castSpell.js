/* globals crypto:true */
/* globals prompt:true */

import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';

function castSpell(sceneName) {
  if (playerObject.activeSpell === 'writeMessage') {
    const newHadronId = crypto.randomUUID();
    const message = prompt('Please leave a message for other players');
    if (message) {
      hadrons.set(newHadronId, {
        id: newHadronId,
        owner: playerObject.playerId,
        sprite: playerObject.activeSpell,
        x: playerObject.player.x,
        y: playerObject.player.y,
        direction: 'up',
        scene: sceneName,
        velocityX: 0,
        velocityY: 0,
        message,
        transferOwnerWhenLeavingScene: true,
      });
    }
  } else {
    const direction = playerObject.playerDirection;
    const velocity = 150; // TODO: Should be set "per spell"
    // TODO: Should the velocity be ADDED to the player's current velocity?
    let velocityX = 0;
    let velocityY = 0;
    if (direction === 'left') {
      velocityX = -velocity;
    } else if (direction === 'right') {
      velocityX = velocity;
    } else if (direction === 'up') {
      velocityY = -velocity;
    } else if (direction === 'down') {
      velocityY = velocity;
    }

    // TODO: Using a different spell is more than just a matter of changing the sprite,
    //       but that is what we have here for now.
    // TODO: Each spell should have an entire description in some sort of spells file.
    const newHadronId = crypto.randomUUID();
    hadrons.set(newHadronId, {
      id: newHadronId, // TODO: Make a hadron creator, used by client and server, that ensures this is added.
      owner: playerObject.playerId,
      sprite: playerObject.activeSpell, // TODO: Use the spell's sprite setting, not just the spell name as the sprite.
      x: playerObject.player.x,
      y: playerObject.player.y,
      direction,
      scene: sceneName,
      velocityX,
      velocityY,
      // hideWhenLeavingScene: true, // TODO: Implement this.
      // destroyWhenLeavingScene: true, // TODO: Implement this.
      // destroyOnDisconnect: true, // TODO: Test
      transferOwnerWhenLeavingScene: true,
    });
  }
}

export default castSpell;
