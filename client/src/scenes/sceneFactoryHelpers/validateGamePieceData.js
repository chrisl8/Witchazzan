const validateGamePieceData = (gamePiece) => {
  const result =
    typeof gamePiece.id === 'string' &&
    typeof gamePiece.x === 'number' &&
    typeof gamePiece.y === 'number' &&
    gamePiece.sprite;
  if (!result) {
    console.error(
      `Bad Game Piece received - ID: ${gamePiece.id} Type: ${gamePiece.type} Name: ${gamePiece.name} Sprite: ${gamePiece.sprite} X: ${gamePiece.x} Y: ${gamePiece.y}`,
    );
  }
  return result;
};

export default validateGamePieceData;
