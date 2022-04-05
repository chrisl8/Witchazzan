import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import deletedHadronList from './objects/deletedHadronList.js';

function parseHadronsFromServer(serverHadrons) {
  // First wipe out all hadrons (game pieces) that we don't own,
  // from our own list,
  // so that old ones disappear
  hadrons.forEach((hadron, key) => {
    if (hadron.owner !== playerObject.playerId) {
      hadrons.delete(key);
    }
  });

  // Then add all hadrons that we do not own
  serverHadrons.forEach((hadron, key) => {
    if (hadron.owner !== playerObject.playerId) {
      hadrons.set(key, hadron);
    }
    // Ignore hadrons that we own,
    // because our local copy is authoritative for owned hadrons,
    // unless we don't know about the hadron (we forgot about it).
    if (
      hadron.owner === playerObject.playerId &&
      !hadrons.has(key) &&
      deletedHadronList.indexOf(key) === -1
    ) {
      hadrons.set(key, hadron);
    }
  });

  // Player's own hadron is a unique instance of a hadron with the same id as the owner,
  // and we want to track it as our shadow.
  const playerHadron = serverHadrons.get(playerObject.playerId);
  if (playerHadron) {
    hadrons.set(playerObject.playerId, playerHadron);
    if (!playerObject.initialPositionReceived) {
      // Grab initial position for player from server.
      playerObject.initialPositionReceived = true;
      playerObject.initialPosition = {
        x: playerHadron.x,
        y: playerHadron.y,
      };
      playerObject.initialScene = playerHadron.scene;
    }
  }
}

export default parseHadronsFromServer;
