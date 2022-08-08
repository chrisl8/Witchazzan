import playerObject from '../objects/playerObject.js';
import closeChatInputBox from '../closeChatInputBox.js';
import cleanUpScene from './cleanUpScene.js';
import deletedHadronList from '../objects/deletedHadronList.js';
import seenItemCollisions from '../objects/seenItemCollisions.js';
import currentSceneNPCs from '../objects/currentSceneNPCs.js';

function cleanUpSceneAndTeleport(
  destinationSceneName,
  destinationSceneEntrance,
  sceneName,
) {
  if (!playerObject.teleportInProgress && destinationSceneName !== sceneName) {
    playerObject.teleportInProgress = true;
    closeChatInputBox();
    cleanUpScene();
    playerObject.destinationX = null;
    playerObject.destinationY = null;
    if (this.scene.getIndex(destinationSceneName) === -1) {
      console.error(
        `Switching to scene: ${destinationSceneName} does not exist.`,
      );
      // eslint-disable-next-line no-param-reassign
      destinationSceneName = playerObject.defaultOpeningScene;
    }
    playerObject.destinationEntrance = destinationSceneEntrance;
    if (playerObject.destinationEntrance) {
      if (destinationSceneEntrance === 'PreviousPosition') {
        console.log(
          `Switching to scene: ${destinationSceneName} position ${playerObject.previousScene.x},${playerObject.previousScene.y}.`,
        );
        playerObject.destinationX = playerObject.previousScene.x;
        playerObject.destinationY = playerObject.previousScene.y;
      } else {
        console.log(
          `Switching to scene: ${destinationSceneName} entrance ${playerObject.destinationEntrance}.`,
        );
      }
    } else {
      console.log(
        `Switching to scene: ${destinationSceneName} at default spawn point.`,
      );
    }

    // Prevent memory leak of an infinitely growing lists.
    deletedHadronList.length = 0;

    // Prevent memory leak of an infinitely growing lists.
    seenItemCollisions.length = 0;

    // Empty out the local NPC list, as we are no longer in charge of them.
    currentSceneNPCs.clear();

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

    // Clean up target objects
    if (playerObject.nearbyTargetObject.rectangle) {
      playerObject.nearbyTargetObject.rectangle.destroy();
    }
    playerObject.nearbyTargetObject.rectangle = null;
    playerObject.nearbyTargetObject.id = null;

    // Track previous location in case we want to come back to it.
    // Specifically this is used when returning from the Library, but you could use it for anything.
    playerObject.previousScene = {
      name: sceneName,
      x: playerObject.player.x,
      y: playerObject.player.y,
    };
    playerObject.ray = null;

    this.scene.start(destinationSceneName);
  }
}

export default cleanUpSceneAndTeleport;
