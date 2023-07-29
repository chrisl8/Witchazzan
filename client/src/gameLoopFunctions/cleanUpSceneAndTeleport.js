import playerObject from '../objects/playerObject.js';
import closeChatInputBox from '../closeChatInputBox.js';
import cleanUpScene from './cleanUpScene.js';
import deletedHadronList from '../objects/deletedHadronList.js';
import currentSceneQuarks from '../objects/currentSceneQuarks.js';
import debugLog from '../utilities/debugLog.js';
import barricadeSprites from '../objects/barricadeSprites.js';
import paths from '../objects/paths.js';

function cleanUpSceneAndTeleport(
  destinationSceneName,
  destinationSceneEntrance,
  sceneName,
) {
  if (this.scene.getIndex(destinationSceneName) === -1) {
    console.error(
      `Switching to scene: ${destinationSceneName} does not exist.`,
    );
    // eslint-disable-next-line no-param-reassign
    destinationSceneName = playerObject.defaultOpeningScene;
  }

  // TODO: Allow local teleport by just setting X/Y
  /*
  i.e.
    const spawnPoint = getSpawnPointFromMap(map, destinationSceneEntrance);
    PlayerObject.player.setX(spawnPoint.x);
    PlayerObject.player.setY(spawnPoint.y);
   */
  if (!playerObject.teleportInProgress && destinationSceneName !== sceneName) {
    playerObject.teleportInProgress = true;
    closeChatInputBox();
    cleanUpScene();
    playerObject.destinationX = null;
    playerObject.destinationY = null;
    playerObject.destinationEntrance = destinationSceneEntrance;
    if (playerObject.destinationEntrance) {
      if (destinationSceneEntrance === 'PreviousPosition') {
        debugLog(
          `Switching to scene: ${destinationSceneName} position ${playerObject.previousScene.x},${playerObject.previousScene.y}.`,
        );
        playerObject.destinationX = playerObject.previousScene.x;
        playerObject.destinationY = playerObject.previousScene.y;
      } else {
        debugLog(
          `Switching to scene: ${destinationSceneName} entrance ${playerObject.destinationEntrance}.`,
        );
      }
    } else {
      debugLog(
        `Switching to scene: ${destinationSceneName} at default spawn point.`,
      );
    }

    // Prevent memory leak of an infinitely growing lists.
    deletedHadronList.length = 0;

    // Empty out the local Quark list, as we are no longer in charge of them.
    currentSceneQuarks.clear();

    // Empty out the local Path list for this scene.
    paths.clear();

    // Clean up raycasters
    // Note: The .destroy() methods cause Phaser to crash, so I'm not using them.
    // If we do not remove the old raycaster,
    // it will stick around and crash the game if you reenter the same scene again.
    // It has not been necessary to remove individual sprite raycasters, but if it becomes so,
    // it could be done here also.
    if (this.raycaster) {
      this.raycaster.debugOptions.enabled = false;
      this.raycaster = null;
    }

    // Clean up pathFinder
    if (this.pathFinder) {
      this.pathFinder = null;
    }

    // Clean up target objects
    if (playerObject.nearbyTargetObject.rectangle) {
      playerObject.nearbyTargetObject.rectangle.destroy();
    }
    playerObject.nearbyTargetObject.rectangle = null;
    playerObject.nearbyTargetObject.id = null;

    // Clean up barricade tracking
    barricadeSprites.clear();

    // Track previous location in case we want to come back to it.
    // Specifically this is used when returning from the Library, but you could use it for anything.
    playerObject.previousScene = {
      name: sceneName,
      x: playerObject.player.x,
      y: playerObject.player.y,
    };
    playerObject.ray = null;

    // Prevent auto-fire lockout from bugging ut on scene changes.
    playerObject.autoFireLockout = false;

    this.scene.start(destinationSceneName);
  }
}

export default cleanUpSceneAndTeleport;
