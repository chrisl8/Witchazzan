import hadrons from '../objects/hadrons.js';
import renderDebugDotTrails from './renderDebugDotTrails.js';
import addSprites from './addSprites.js';
import addSpriteColliders from './addSpriteColliders.js';
import addSpriteVelocity from './addSpriteVelocity.js';
import updateSprite from './updateSprite.js';
import sendHadronDataToServer from './sendHadronDataToServer.js';

function updateHadrons(
  sceneName,
  scene,
  collisionLayer,
  teleportLayersColliders,
  gameSizeData,
) {
  // Deal with game pieces from server.
  hadrons.forEach((hadron, key) => {
    // Only render hadrons for THIS scene
    // The server will ony send us such hadrons, but we double check anyway.
    if (hadron.scn === sceneName) {
      // This is used for debugging
      renderDebugDotTrails.call(this, hadron, key, scene, gameSizeData);

      // This will add the sprite if it doesn't exist
      addSprites.call(this, hadron, key);

      addSpriteColliders.call(
        this,
        hadron,
        key,
        collisionLayer,
        teleportLayersColliders,
        sceneName,
      );

      addSpriteVelocity.call(this, hadron, key);

      updateSprite.call(this, hadron, key, gameSizeData);

      sendHadronDataToServer(hadron, key);
    } else {
      // We need to wipe our local copy of hadrons that are not in our scene.
      hadrons.delete(key);
      // cleanUpClientSprites() in gameLoopAndSceneFactory() will erase the sprites from these if they existed.
    }
  });
}

export default updateHadrons;
