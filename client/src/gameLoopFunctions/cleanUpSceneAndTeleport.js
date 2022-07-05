import playerObject from '../objects/playerObject.js';
import closeChatInputBox from '../closeChatInputBox.js';
import cleanUpScene from './cleanUpScene.js';
import deletedHadronList from '../objects/deletedHadronList.js';
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
    if (this.scene.getIndex(destinationSceneName) === -1) {
      console.error(
        `Switching to scene: ${destinationSceneName} does not exist.`,
      );
      // eslint-disable-next-line no-param-reassign
      destinationSceneName = playerObject.defaultOpeningScene;
    }
    playerObject.destinationEntrance = destinationSceneEntrance;
    if (playerObject.destinationEntrance) {
      console.log(
        `Switching to scene: ${destinationSceneName} entrance ${playerObject.destinationEntrance}.`,
      );
    } else {
      console.log(
        `Switching to scene: ${destinationSceneName} at default spawn point.`,
      );
    }
    if (playerObject.dotTrailRenderTexture) {
      playerObject.dotTrailRenderTexture.destroy();
      playerObject.dotTrailRenderTexture = null;
    }

    if (playerObject.pixelHighlightTexture) {
      playerObject.pixelHighlightTexture.destroy();
      playerObject.pixelHighlightTexture = null;
    }

    // Prevent memory leak of an infinitely growing lists.
    deletedHadronList.length = 0;

    // Empty out the local NPC list, as we are no longer in charge of them.
    currentSceneNPCs.clear();

    // Clean up raycasters
    // Note: The .destroy() methods cause Phaser to crash, so I'm not using them.
    // If we do not remove the old raycaster,
    // it will stick around and crash the game if you reenter the same scene again.
    if (this.raycaster) {
      this.raycaster.debugOptions.enabled = false;
      this.raycaster = null;
    }

    this.scene.start(destinationSceneName);
  }
}

export default cleanUpSceneAndTeleport;
