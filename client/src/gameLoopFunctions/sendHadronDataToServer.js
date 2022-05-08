import playerObject from '../objects/playerObject.js';
import sendDataToServer from '../sendDataToServer.js';

function sendHadronDataToServer(hadron, key) {
  // SEND HADRON DATA TO THE SERVER
  // Send all data on hadrons that we currently control.
  // We skip our own player, because it has special requirements.
  if (
    // New hadrons that we create have no ctrl yet, only the server assigns that.
    (hadron.ctrl === undefined || hadron.ctrl === playerObject.playerId) &&
    key !== playerObject.playerId
  ) {
    sendDataToServer.hadronData(key);
  }
}

export default sendHadronDataToServer;
