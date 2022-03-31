import playerObject from './objects/playerObject';
import gamePieceList from './objects/gamePieceList';

function parseGamePieceListFromServer(inputData) {
  // Player's own sprite is a unique instance of a sprite with the same id as the owner.
  const playerSprite = inputData.get(playerObject.playerId);
  if (playerSprite) {
    if (!playerObject.initialPositionReceived) {
      // Grab initial position for player from server.
      playerObject.initialPositionReceived = true;
      playerObject.initialPosition = {
        x: playerSprite.x,
        y: playerSprite.y,
      };
      playerObject.initialScene = playerSprite.scene;
    }
  }

  gamePieceList.pieces = inputData;
}

export default parseGamePieceListFromServer;
