import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import deletedHadronList from './objects/deletedHadronList.js';
import validateHadron from '../server/utilities/validateHadron.js';
import textObject from './objects/textObject.js';
import sendDataToServer from './sendDataToServer.js';

function parseHadronsFromServer(serverHadrons) {
  // First clean out all hadrons (game pieces) that we are not in control of,
  // from our own list, so that old ones disappear,
  // and new data for these hadrons takes precedence over our data.
  hadrons.forEach((clientHadron, key) => {
    if (clientHadron.ctr !== playerObject.playerId) {
      hadrons.delete(key);
    }
  });

  // Then add all hadrons that we do not control from the server list to our list.
  serverHadrons.forEach((serverHadron, key) => {
    if (validateHadron.server(serverHadron)) {
      if (serverHadron.ctr !== playerObject.playerId) {
        hadrons.set(key, serverHadron);
      }

      // Ignore hadrons that we control,
      // because our local copy is authoritative for controlled hadrons,
      // UNLESS we don't know about the hadron (we forgot about it).
      if (
        serverHadron.ctr === playerObject.playerId &&
        !hadrons.has(key) &&
        // The deletedHadronList is to prevent the race condition of us deleting a hadron,
        // but then immediately adding it again because we get an incoming packet that includes it,
        // before the server has a chance to delete it.
        deletedHadronList.indexOf(key) === -1
      ) {
        hadrons.set(key, serverHadron);
      }
      if (deletedHadronList.indexOf(key) > -1) {
        // Send stragglers through the loop again until they go away.
        sendDataToServer.destroyHadron(key);
      }
    } else {
      textObject.enterSceneText.text = "Bad data received from server. :'(";
      textObject.enterSceneText.display();
    }
  });

  // Player's own hadron is a unique instance of a hadron with the same id as the owner,
  // and we want to track it as our shadow.
  const playerHadron = serverHadrons.get(playerObject.playerId);
  if (playerHadron) {
    hadrons.set(playerObject.playerId, playerHadron);
    if (!playerObject.initialPositionReceived) {
      // Grab initial position for player from server,
      // along with other data we might not know yet.
      playerObject.initialPositionReceived = true;
      playerObject.initialPosition = {
        x: playerHadron.x,
        y: playerHadron.y,
      };
      playerObject.initialScene = playerHadron.scn;
      playerObject.previousScene.name = playerHadron.psc;
      playerObject.previousScene.x = playerHadron.px;
      playerObject.previousScene.y = playerHadron.py;
      playerObject.playerDirection = null;
      playerObject.newPlayerDirection = playerHadron.dir;
      if (playerHadron.ces) {
        playerObject.caveExitScene = playerHadron.ces;
      }

      // On connect, get health from server, because disconnecting doesn't automatically heal you!
      if (playerHadron.hasOwnProperty('hlt')) {
        playerObject.health = playerHadron.hlt;
      }
    }
  }
}

export default parseHadronsFromServer;
