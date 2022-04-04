const validateHadronData = (hadron, key) => {
  const result =
    typeof hadron.owner === 'string' &&
    typeof hadron.x === 'number' &&
    typeof hadron.y === 'number' &&
    typeof hadron.sprite === 'string' &&
    typeof hadron.scene === 'string';
  if (!result) {
    console.error(
      `Bad Game Piece received - Key: ${key} Owner: ${hadron.owner} Type: ${hadron.type} Name: ${hadron.name} Scene: ${hadron.scene} Sprite: ${hadron.sprite} X: ${hadron.x} Y: ${hadron.y}`,
    );
  }
  return result;
};

export default validateHadronData;
