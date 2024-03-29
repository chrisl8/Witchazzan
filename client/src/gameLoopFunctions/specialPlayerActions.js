// This function handles stuff like
//  - updating player health bar
//  - automatic teleports when dead,
//  - healing when in a certain room,
//  - etc.
// Feel free to add anything here that acts on the player based on current in game conditions.
// If the action is on the NPC's though, put it in npcBehavior() instead.

import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';
import getUUID from '../utilities/getUUID.js';

function specialPlayerActions(sceneName) {
  if (sceneName === 'EmptyCave') {
    if (playerObject.health < playerObject.maxHealth) {
      playerObject.health += 1;
    }
  } else if (playerObject.health <= 0 && !playerObject.isDead) {
    playerObject.isDead = true;
    // Leave death marker - Death marker is essentially a special message with a different sprite.
    const today = new Date();
    const deathMarker = {
      id: getUUID(),
      own: playerObject.playerId,
      typ: 'message',
      spr: 'corpse',
      x: playerObject.player.x,
      y: playerObject.player.y,
      dir: 'up',
      scn: sceneName,
      vlx: 0,
      vly: 0,
      txt: `${playerObject.name} passed here on ${today.toLocaleString()}`,
      tcw: true,
      pod: false,
      dph: -1,
    };
    hadrons.set(deathMarker.id, deathMarker);
    // playerObject.health = 100; // For testing uncomment this and comment the teleport.
    // If we don't wait a hot moment before teleporting, the death marker will not work.
    setTimeout(() => {
      playerObject.teleportToSceneNow = 'EmptyCave';
      playerObject.teleportToSceneNowEntrance = 'HealingSpawnPoint';
      playerObject.isDead = false;
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
