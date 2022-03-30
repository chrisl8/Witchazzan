import playerObject from './objects/playerObject';
import gamePieceList from './objects/gamePieceList';

function parseGamePieceListFromServer(inputData) {
  if (inputData.pieces && inputData.pieces.length > 0) {
    inputData.pieces.forEach((piece) => {
      if (piece.id === playerObject.playerId) {
        if (!playerObject.initialPositionReceived) {
          // Grab initial position for player from server.
          playerObject.initialPositionReceived = true;
          playerObject.initialPosition = {
            x: piece.x,
            y: piece.y,
          };
          playerObject.initialScene = piece.scene;
        }
      }
    });
  }

  gamePieceList.pieces = inputData.pieces;
}

export default parseGamePieceListFromServer;
