import cleanUpSceneAndTeleport from './cleanUpSceneAndTeleport.js';

function playerTeleportOverlapHandler(sprite, tile, sceneName) {
  if (Array.isArray(tile.layer.properties)) {
    let destinationSceneName;
    let destinationSceneEntrance = null;
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
    if (destinationSceneName) {
      cleanUpSceneAndTeleport.call(
        this,
        destinationSceneName,
        destinationSceneEntrance,
        sceneName,
      );
    }
  }
}

export default playerTeleportOverlapHandler;
