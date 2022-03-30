function gamePieceToPhaser(gamePieceCoordinate, tilewidth) {
  return gamePieceCoordinate * tilewidth;
}

function phaserToGamePiece(phaserCoordinate, tilewidth) {
  // Tile coordinates are limited to two decimal places.
  return (
    // https://stackoverflow.com/a/11832950/4982408
    Math.round((phaserCoordinate / tilewidth + Number.EPSILON) * 100) / 100
  );
}

const convertCoordinates = {
  gamePieceToPhaser,
  phaserToGamePiece,
};

export default convertCoordinates;
