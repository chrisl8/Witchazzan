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
        // TODO: This is temporary code to help with debugging,
        //       Remove it when spells work.
        if (piece.hasOwnProperty('spell') && piece.spell !== null) {
          if (piece.spell === 'fireball') {
            console.log('fireball received');
          } else {
            console.log(piece.spell);
          }
        }
      }
    });
  }

  gamePieceList.pieces = inputData.pieces;
}

export default parseGamePieceListFromServer;
