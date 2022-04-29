import hadrons from '../objects/hadrons.js';
import renderDebugDotTrails from './renderDebugDotTrails.js';
import addAndUpdateSprites from './addAndUpdateSprites.js';
import clientSprites from '../objects/clientSprites.js';
import playerObject from '../objects/playerObject.js';
import sendDataToServer from '../sendDataToServer.js';

function updateHadrons(
  sceneName,
  scene,
  collisionLayer,
  teleportLayersColliders,
) {
  // Deal with game pieces from server.

  hadrons.forEach((hadron, key) => {
    // Only render hadrons for THIS scene
    if (hadron.scn === sceneName) {
      // This is used for debugging
      renderDebugDotTrails(hadron, key, scene);

      // This will add the sprite if it doesn't exist,
      // and do nothing if it does.
      addAndUpdateSprites.call(
        this,
        hadron,
        key,
        collisionLayer,
        teleportLayersColliders,
      );
      // Now we know that we have a sprite.
      const clientSprite = clientSprites.get(key);

      // Sometimes they go inactive.
      clientSprite.sprite.active = true;

      // SET SPRITE ROTATION BASED ON HADRON DATA
      // Use Hadron direction to set sprite rotation or flip it
      if (clientSprite.spriteData.rotatable) {
        // Rotate hadron to face requested direction.
        if (hadron.dir === 'left' || hadron.dir === 'west') {
          clientSprite.sprite.setAngle(180);
        } else if (hadron.dir === 'right' || hadron.dir === 'east') {
          clientSprite.sprite.setAngle(0);
        } else if (hadron.dir === 'up' || hadron.dir === 'north') {
          clientSprite.sprite.setAngle(-90);
        } else if (hadron.dir === 'down' || hadron.dir === 'south') {
          clientSprite.sprite.setAngle(90);
        }
      } else if (hadron.dir === 'left' || hadron.dir === 'west') {
        // For non rotatable sprites, only flip them for left/right
        clientSprite.sprite.setFlipX(clientSprite.spriteData.faces === 'right');
      } else if (hadron.dir === 'right' || hadron.dir === 'east') {
        clientSprite.sprite.setFlipX(clientSprite.spriteData.faces === 'left');
      }

      // SET SPRITE ANIMATION BASED ON HADRON DATA
      // The only way to know if the remote item is in motion is for them to tell us
      //       We cannot divine it, because the local tick is always faster than the server update.
      // This only matters in that we like to animate the sprite when it is "in motion", but not when it is still,
      // i.e. when a user is "walking", even into a wall, it is nice to see it animated, to indicate it is actively walking into the wall.
      let objectInMotion = true; // Default to animate if server does not tell us otherwise.
      if (hadron.mov === false) {
        objectInMotion = false;
      }
      if (!objectInMotion) {
        clientSprite.sprite.anims.stop();
      } else if (
        clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
          `${clientSprite.spriteData.name}-move-left`,
        ) &&
        (hadron.dir === 'left' || hadron.dir === 'west')
      ) {
        clientSprite.sprite.anims.play(
          `${clientSprite.spriteData.name}-move-left`,
          true,
        );
      } else if (
        clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
          `${clientSprite.spriteData.name}-move-right`,
        ) &&
        (hadron.dir === 'right' || hadron.dir === 'east')
      ) {
        clientSprite.sprite.anims.play(
          `${clientSprite.spriteData.name}-move-right`,
          true,
        );
      } else if (
        clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
          `${clientSprite.spriteData.name}-move-back`,
        ) &&
        (hadron.dir === 'up' || hadron.dir === 'north')
      ) {
        clientSprite.sprite.anims.play(
          `${clientSprite.spriteData.name}-move-back`,
          true,
        );
      } else if (
        clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
          `${clientSprite.spriteData.name}-move-front`,
        ) &&
        (hadron.dir === 'down' || hadron.dir === 'south')
      ) {
        clientSprite.sprite.anims.play(
          `${clientSprite.spriteData.name}-move-front`,
          true,
        );
      } else if (
        clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
          `${clientSprite.spriteData.name}-move-stationary`,
        )
      ) {
        clientSprite.sprite.anims.play(
          `${clientSprite.spriteData.name}-move-stationary`,
          true,
        );
      }

      // PERFORM EASING ON HADRONS BEING CONTROLLED BY OTHER PLAYERS
      // , and my own shadow.
      // If the hadron is ours, we set velocities, and that does this for us,
      // but if we are just updating x/y positions, we need this to make it smooth.
      // Easing demonstrations:
      // https://labs.phaser.io/edit.html?src=src\tweens\ease%20equations.js
      if (
        hadron.ctrl !== playerObject.playerId ||
        key === playerObject.playerId
      ) {
        this.tweens.add({
          targets: clientSprite.sprite,
          x: hadron.x,
          y: hadron.y,
          duration: 1, // Adjust this to be smooth without being too slow.
          ease: 'Linear', // Anything else is wonky when tracking server updates.
        });
      }

      // SEND HADRON DATA TO THE SERVER
      // We skip our own player, because it has special requirements.
      if (
        // New hadrons that we create have no ctrl yet, only the server assigns that.
        (hadron.ctrl === undefined || hadron.ctrl === playerObject.playerId) &&
        key !== playerObject.playerId
      ) {
        // Update all data on owned hadrons.
        const newHadronData = { ...hadron };

        newHadronData.x = clientSprites.get(key).sprite.x;
        newHadronData.y = clientSprites.get(key).sprite.y;

        // Update hadron data
        hadrons.set(key, newHadronData);

        // Send owned hadron data to server.
        sendDataToServer.hadronData(key);
      }
    } else {
      // We need to wipe our local copy of hadrons that are not in our scene.
      hadrons.delete(key);
      // cleanUpClientSprites() will erase the sprites from these if they existed.
    }
  });
}

export default updateHadrons;
