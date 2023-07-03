import clientSprites from '../objects/clientSprites.js';
import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';

function cleanUpClientSprites() {
  clientSprites.forEach((clientSprite, key) => {
    // Clean up colliders
    if (clientSprite.spriteColliders) {
      // Remove any colliders with non-existent hadrons that are gone now.
      for (const [colliderKey] of Object.entries(
        clientSprite.spriteColliders,
      )) {
        if (!hadrons.has(colliderKey)) {
          clientSprite.spriteColliders[colliderKey].destroy();
          // eslint-disable-next-line no-param-reassign
          delete clientSprite.spriteColliders[colliderKey];
        }
      }
    }

    // Delete orphaned sprites with no hadron.
    if (!hadrons.has(key) || hadrons.get(key)?.off) {
      if (clientSprite.emitter) {
        clientSprite.emitter.stop();
      }
      if (clientSprite.sprite) {
        clientSprite.sprite.destroy();
      }
      // Remove all static colliders,
      if (clientSprite.staticColliders) {
        for (const [colliderKey] of Object.entries(
          clientSprite.staticColliders,
        )) {
          clientSprite.staticColliders[colliderKey].destroy();
          // eslint-disable-next-line no-param-reassign
          delete clientSprite.staticColliders[colliderKey];
        }
      }
      // and remove all sprite colliders first
      if (clientSprite.spriteColliders) {
        for (const [colliderKey] of Object.entries(
          clientSprite.spriteColliders,
        )) {
          clientSprite.spriteColliders[colliderKey].destroy();
          // eslint-disable-next-line no-param-reassign
          delete clientSprite.spriteColliders[colliderKey];
        }
      }
      clientSprites.delete(key);
      // Clean up dom elements attached to removed sprites
      if (playerObject.domElements.otherPlayerTags.hasOwnProperty(key)) {
        playerObject.domElements.otherPlayerTags[key].remove();
        playerObject.domElements.otherPlayerTags[key] = null;
      }
      // Erase other player tag history so that it updates when they return.
      if (playerObject.domElementHistory.otherPlayerTags.hasOwnProperty(key)) {
        delete playerObject.domElementHistory.otherPlayerTags[key];
      }
    }
  });
}

export default cleanUpClientSprites;
