import PlayerObject from '../objects/playerObject.js';

function getDestinationFromTileLayerProperties(teleportLayerProperties) {
  let destinationSceneName;
  let destinationSceneEntrance = null;
  if (Array.isArray(teleportLayerProperties)) {
    // Get Destination Scene
    const destinationSceneNameIndex = teleportLayerProperties.findIndex(
      (x) => x.name === 'DestinationScene',
    );
    if (destinationSceneNameIndex > -1) {
      destinationSceneName =
        teleportLayerProperties[destinationSceneNameIndex].value;
    }
    // Get Destination Entrance
    const entrancePropertyIndex = teleportLayerProperties.findIndex(
      (x) => x.name === 'Entrance',
    );
    if (entrancePropertyIndex > -1) {
      destinationSceneEntrance =
        teleportLayerProperties[entrancePropertyIndex].value;
    }
  }
  // Specially named destination scene names have other functions.
  if (destinationSceneName === 'Previous') {
    destinationSceneName = PlayerObject.previousScene.name;
  }
  if (destinationSceneName === 'CaveExit') {
    destinationSceneName = PlayerObject.caveExitScene;
  }
  return { destinationSceneName, destinationSceneEntrance };
}

export default getDestinationFromTileLayerProperties;
