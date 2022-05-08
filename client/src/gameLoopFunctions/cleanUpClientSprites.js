import clientSprites from '../objects/clientSprites.js';
import hadrons from '../objects/hadrons.js';
import playerObject from '../objects/playerObject.js';

function cleanUpClientSprites() {
  clientSprites.forEach((clientSprite, key) => {
    // Delete orphaned sprites with no hadron.
    if (!hadrons.has(key)) {
      if (clientSprite.sprite) {
        clientSprite.sprite.destroy();
      }
      clientSprites.delete(key);
      // Clean up dom elements attached to removed sprites
      if (playerObject.domElements.otherPlayerTags[key]) {
        playerObject.domElements.otherPlayerTags[key].remove();
        playerObject.domElements.otherPlayerTags[key] = null;
      }
      // Erase other player tag history so that it updates when they return.
      if (playerObject.domElementHistory.otherPlayerTags.hasOwnProperty(key)) {
        delete playerObject.domElementHistory.otherPlayerTags[key];
      }
    } else if (clientSprite.colliders) {
      // Remove any colliders with non-existent hadrons that are gone now.
      for (const [colliderKey] of Object.entries(clientSprite.colliders)) {
        if (!hadrons.has(colliderKey)) {
          // I'm not entirely sure if this works.
          this.physics.world.removeCollider(
            clientSprite.colliders[colliderKey],
          );
          // eslint-disable-next-line no-param-reassign
          delete clientSprite.colliders[colliderKey];
        }
      }
    }
  });
}

export default cleanUpClientSprites;
