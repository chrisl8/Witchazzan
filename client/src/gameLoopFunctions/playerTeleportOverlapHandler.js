import cleanUpSceneAndTeleport from './cleanUpSceneAndTeleport.js';
import PlayerObject from '../objects/playerObject.js';
import getDestinationFromTile from '../utilities/getDestinationFromTile.js';
import getSpawnPointFromMap from '../utilities/getSpawnPointFromMap.js';

function playerTeleportOverlapHandler(sprite, tile, sceneName, map) {
  // eslint-disable-next-line prefer-const
  let { destinationSceneName, destinationSceneEntrance } =
    getDestinationFromTile(tile);
  // Specially named destination scene names have other functions.
  if (destinationSceneName === 'Local') {
    // Disable teleport
    destinationSceneName = null;
    // Perform the in-scene x/y location update now.
    const spawnPoint = getSpawnPointFromMap(map, destinationSceneEntrance);
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

export default playerTeleportOverlapHandler;
