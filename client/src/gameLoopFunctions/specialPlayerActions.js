/* globals crypto:true */
// This function handles stuff like
//  - updating player health bar
//  - automatic teleports when dead,
//  - healing when in a certain room,
//  - etc.
// Feel free to add anything here that acts on the player based on current in game conditions.
// If the action is on the NPC's though, put it in npcBehavior() instead.

import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';

function specialPlayerActions(sceneName) {
  if (sceneName === 'EmptyCave') {
    if (playerObject.health < playerObject.maxHealth) {
      playerObject.health += 1;
    }
  } else if (playerObject.health <= 0) {
    // Leave death marker - Death marker is essentially a special message with a different sprite.
    const today = new Date();
    const deathMaker = {
      id: crypto.randomUUID(),
      own: playerObject.playerId,
      typ: 'message',
      sprt: 'corpse',
      x: playerObject.player.x,
      y: playerObject.player.y,
      dir: 'up',
      scn: sceneName,
      velX: 0,
      velY: 0,
      txt: `${playerObject.name} passed here on ${today.toLocaleString()}`,
      tcwls: true,
      pod: false,
      dph: -1,
    };
    hadrons.set(deathMaker.id, deathMaker);
    // playerObject.health = 100; // For testing uncomment this and comment the teleport.
    // If we don't wait a hot moment before teleporting, the death marker will not work.
    setTimeout(() => {
      playerObject.teleportToSceneNow = 'EmptyCave';
      playerObject.teleportToSceneNowEntrance = 'HealingSpawnPoint';
    }, 100);
  } else if (
    playerObject.health < playerObject.maxHealth &&
    playerObject.previousHealth !== null &&
    playerObject.health < playerObject.previousHealth
  ) {
    // Make player red briefly to indicate damage was taken.
    // https://www.phaser.io/examples/v3/view/display/tint/tint-and-alpha
    playerObject.player.setTintFill(0xff0000);
    setTimeout(() => {
      playerObject.player.clearTint();
    }, 100);
  }
  playerObject.previousHealth = playerObject.health;
}

export default specialPlayerActions;
