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

    // Prevent memory leak of an infinitely growing list.
    deletedHadronList.length = 0;

    this.scene.start(destinationSceneName);
  }
}

export default cleanUpSceneAndTeleport;
