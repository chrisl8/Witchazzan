import playerObject from '../objects/playerObject.js';

function handleHeldItems(hadron, key) {
  if (
    hadron.ctr === playerObject.playerId &&
    hadron.hld === playerObject.playerId
  ) {
    if (playerObject.heldItemList.indexOf(key) === -1) {
      // TODO: some method to preserve order?
      playerObject.heldItemList.push(key);
    }
  }
}

export default handleHeldItems;
