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
        if (piece.hasOwnProperty('spell')) {
          console.log(piece.spell);
          playerObject.spell = null;
        }
        playerObject.lastReceivedPlayerLocationObject = piece; // TODO: This isn't used anywhere, so why grab it?
      }
    });
  }

  gamePieceList.pieces = inputData.pieces;
}

export default parseGamePieceListFromServer;
