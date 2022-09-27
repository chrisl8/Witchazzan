import PlayerObject from '../objects/playerObject.js';

function getDestinationFromTile(tile) {
  let destinationSceneName;
  let destinationSceneEntrance = null;
  if (Array.isArray(tile.layer.properties)) {
    // Get Destination Scene
    const destinationSceneNameIndex = tile.layer.properties.findIndex(
      (x) => x.name === 'DestinationScene',
    );
    if (destinationSceneNameIndex > -1) {
      destinationSceneName =
        tile.layer.properties[destinationSceneNameIndex].value;
    }
    // Get Destination Entrance
    const entrancePropertyIndex = tile.layer.properties.findIndex(
      (x) => x.name === 'Entrance',
    );
    if (entrancePropertyIndex > -1) {
      destinationSceneEntrance =
        tile.layer.properties[entrancePropertyIndex].value;
    }
  }
  // Specially named destination scene names have other functions.
  if (destinationSceneName === 'Previous') {
    destinationSceneName = PlayerObject.previousScene.name;
  }
  return { destinationSceneName, destinationSceneEntrance };
}

export default getDestinationFromTile;
