import cleanUpSceneAndTeleport from './cleanUpSceneAndTeleport.js';
import PlayerObject from '../objects/playerObject.js';
import convertTileMapPropertyArrayToObject from '../utilities/convertTileMapPropertyArrayToObject.js';

function playerTeleportOverlapHandler(sprite, tile, sceneName, map) {
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

    // Specially named destination scene names have other functions.
    if (destinationSceneName === 'Previous') {
      destinationSceneName = PlayerObject.previousScene.name;
    } else if (destinationSceneName === 'Local') {
      destinationSceneName = null;
      // TODO: This code is duplicated in gameLoopAndSceneFactory.js
      let spawnPoint = map.findObject(
        'Objects',
        (obj) => obj.name === 'Default Spawn Point',
      );
      const entranceList = map.filterObjects(
        'Objects',
        (obj) => convertTileMapPropertyArrayToObject(obj).Type === 'Entrance',
      );
      if (entranceList && entranceList.length > 0) {
        const requestedEntranceIndex = entranceList.findIndex(
          (x) => x.name === destinationSceneEntrance,
        );
        if (requestedEntranceIndex > -1) {
          spawnPoint = entranceList[requestedEntranceIndex];
        }
      }
      PlayerObject.player.setX(spawnPoint.x);
      PlayerObject.player.setY(spawnPoint.y);
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
