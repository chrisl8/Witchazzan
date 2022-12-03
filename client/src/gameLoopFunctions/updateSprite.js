import clientSprites from '../objects/clientSprites.js';
import playerObject from '../objects/playerObject.js';
import hadrons from '../objects/hadrons.js';
import sendDataToServer from '../sendDataToServer.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';

function updateSprite(hadron, key, gameSizeData) {
  if (clientSprites.has(key)) {
    // Now we know that we have a sprite.
    const clientSprite = clientSprites.get(key);

    // Sometimes they go inactive.
    clientSprite.sprite.active = true;

    // SET SPRITE ROTATION BASED ON HADRON DATA
    // Use Hadron direction to set sprite rotation or flip it
    if (hadron.hasOwnProperty('dir')) {
      if (clientSprite.spriteData.rotatable) {
        // Rotate hadron to face requested direction.
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(hadron.dir)) {
          clientSprite.sprite.setAngle(Number(hadron.dir));
        }
      } else if (hadron.dir === 180) {
        // For non rotatable sprites, only flip them for left/right
        clientSprite.sprite.setFlipX(clientSprite.spriteData.faces === 'right');
      } else if (hadron.dir === 0) {
        clientSprite.sprite.setFlipX(clientSprite.spriteData.faces === 'left');
      }
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
    if (
      clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
        `${clientSprite.spriteData.name}-move-left`,
      ) &&
      Number(hadron.dir) === 180 &&
      (clientSprite.sprite.anims.currentAnim?.key !==
        `${clientSprite.spriteData.name}-move-left` ||
        objectInMotion)
    ) {
      clientSprite.sprite.anims.play(
        `${clientSprite.spriteData.name}-move-left`,
        true,
      );
    } else if (
      clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
        `${clientSprite.spriteData.name}-move-right`,
      ) &&
      Number(hadron.dir) === 0 &&
      (clientSprite.sprite.anims.currentAnim?.key !==
        `${clientSprite.spriteData.name}-move-right` ||
        objectInMotion)
    ) {
      clientSprite.sprite.anims.play(
        `${clientSprite.spriteData.name}-move-right`,
        true,
      );
    } else if (
      clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
        `${clientSprite.spriteData.name}-move-back`,
      ) &&
      Number(hadron.dir) === 270 &&
      (clientSprite.sprite.anims.currentAnim?.key !==
        `${clientSprite.spriteData.name}-move-back` ||
        objectInMotion)
    ) {
      clientSprite.sprite.anims.play(
        `${clientSprite.spriteData.name}-move-back`,
        true,
      );
    } else if (
      clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
        `${clientSprite.spriteData.name}-move-front`,
      ) &&
      Number(hadron.dir) === 90 &&
      (clientSprite.sprite.anims.currentAnim?.key !==
        `${clientSprite.spriteData.name}-move-front` ||
        objectInMotion)
    ) {
      clientSprite.sprite.anims.play(
        `${clientSprite.spriteData.name}-move-front`,
        true,
      );
    } else if (
      objectInMotion &&
      hadron.hasOwnProperty('anim') &&
      hadron.ani &&
      clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
        `${clientSprite.spriteData.name}-move-${hadron.anim}`,
      )
    ) {
      clientSprite.sprite.anims.play(
        `${clientSprite.spriteData.name}-move-${hadron.anim}`,
        true,
      );
    } else if (
      objectInMotion &&
      clientSprite.sprite.anims.animationManager.anims.entries.hasOwnProperty(
        `${clientSprite.spriteData.name}-move-stationary`,
      )
    ) {
      clientSprite.sprite.anims.play(
        `${clientSprite.spriteData.name}-move-stationary`,
        true,
      );
    } else {
      clientSprite.sprite.anims.stop();
    }

    // UPDATE SPRITE LOCATION FOR HADRONS BEING CONTROLLED BY OTHER PLAYERS
    // , and my own shadow.
    // If the hadron is ours, we set velocities, and that does this for us,
    if (hadron.ctr !== playerObject.playerId || key === playerObject.playerId) {
      if (
        (hadron.flv === 'Item' || hadron.flv === 'NPC') &&
        (hadron.vlx || hadron.vly)
      ) {
        // Items transfer velocity in order to have collisions with other things in the world.
        // Set the position first, because otherwise they drift badly

        if (
          clientSprite.sprite.x !== hadron.x ||
          clientSprite.sprite.y !== hadron.y
        ) {
          // TODO: Test this with chasing tanks and with furniture items.
          const minimumCorrectionPixels = 3; // TODO: Tweak this.
          if (
            Math.abs(clientSprite.sprite.x - hadron.x) > minimumCorrectionPixels
          ) {
            if (
              (hadron.vlx > 0 && hadron.x > clientSprite.sprite.x) ||
              (hadron.vlx < 0 && hadron.x < clientSprite.sprite.x) ||
              // TODO: Does this actually work or accomplish anything?
              hadron.vlx < Math.abs(clientSprite.sprite.x - hadron.x)
            ) {
              clientSprite.sprite.setX(hadron.x);
            } else {
              // console.log(
              //   'X',
              //   hadron.vlx,
              //   Math.abs(clientSprite.sprite.x - hadron.x),
              // );
            }
          }
          if (
            Math.abs(clientSprite.sprite.y - hadron.y) > minimumCorrectionPixels
          ) {
            if (
              (hadron.vly > 0 && hadron.y > clientSprite.sprite.y) ||
              (hadron.vly < 0 && hadron.y < clientSprite.sprite.y) ||
              // TODO: Does this actually work or accomplish anything?
              hadron.vly < Math.abs(clientSprite.sprite.y - hadron.y)
            ) {
              clientSprite.sprite.setY(hadron.y);
            } else {
              // console.log(
              //   'Y',
              //   hadron.vly,
              //   Math.abs(clientSprite.sprite.y - hadron.y),
              // );
            }
          }

          // console.log(
          //   Phaser.Math.Angle.Between(
          //     clientSprite.sprite.x,
          //     clientSprite.sprite.y,
          //     hadron.x,
          //     hadron.y,
          //   ),
          // );
        }
        // Then add the velocity to essentially "predict" the movement and allow for collisions
        clientSprite.sprite.body.setVelocityX(hadron.vlx);
        clientSprite.sprite.body.setVelocityY(hadron.vly);
        // This model could be used for other things, but be careful as the results can be weird.
      } else {
        // console.log(this.tweens.isTweening(clientSprite.sprite));
        // Everything else just teleports to the new position if it has changed
        if (
          clientSprite.sprite.x !== hadron.x ||
          clientSprite.sprite.y !== hadron.y
        ) {
          // Use this if you want to paint a "dot" on the "real" position to compare with tweening results.
          // if (playerObject.dot) {
          //   playerObject.dot.destroy();
          // }
          // playerObject.dot = this.add
          //   .rectangle(hadron.x, hadron.y, 5, 5, 0xffa500)
          //   .setDepth(objectDepthSettings.dotTrails);
          // This would be a direct update without any tweening:
          // clientSprite.sprite.setPosition(hadron.x, hadron.y);
          // Easing demonstrations:
          // https://labs.phaser.io/edit.html?src=src\tweens\ease%20equations.js
          this.tweens.add({
            targets: clientSprite.sprite,
            x: hadron.x,
            y: hadron.y,
            duration: 20, // Adjust this to be smooth without being too slow.
            ease: 'Linear',
          });
        }
      }
    }

    // ADD BRIEF RED TINT TO PLAYERS AND NPCs THAT HAVE TAKEN DAMAGE
    if (
      hadron.id !== playerObject.playerId && // Do not tint or worse, clear tint from shadow
      hadron.hlt &&
      hadron.hlt < hadron.mxh &&
      clientSprite.previousHealth !== undefined &&
      hadron.hlt < clientSprite.previousHealth
    ) {
      // Make player red briefly to indicate damage was taken.
      // https://www.phaser.io/examples/v3/view/display/tint/tint-and-alpha
      clientSprite.sprite.setTintFill(0xff0000);
      setTimeout(() => {
        clientSprite.sprite.clearTint();
      }, 100);
    }
    clientSprite.previousHealth = hadron.hlt;
    if (
      hadron.id === playerObject.playerId &&
      playerObject.infiniteHealth &&
      playerObject.isAdmin
    ) {
      // Do this here so that we still get the red tint hit.
      playerObject.health = playerObject.maxHealth;
    }

    // Update sprite position of items we are holding
    if (
      hadron.flv === 'Item' &&
      hadron.hld === playerObject.playerId &&
      hadron.ctr === playerObject.playerId
    ) {
      // Zero out any residual velocity when we grab it.
      clientSprite.sprite.body.setVelocityX(0);
      clientSprite.sprite.body.setVelocityY(0);
      // Just tag it to our position
      clientSprite.sprite.setPosition(
        playerObject.player.x,
        playerObject.player.y,
      );
      clientSprite.sprite.setDepth(objectDepthSettings.heldObject);
    } else if (hadron.flv === 'Item' && hadron.hld) {
      // Update depth for held items that other players are holding
      clientSprite.sprite.setDepth(objectDepthSettings.heldObject);
    }

    if (
      // New hadrons that we create have no ctrl yet, only the server assigns that.
      (hadron.ctr === undefined || hadron.ctr === playerObject.playerId) &&
      key !== playerObject.playerId
    ) {
      // OPERATIONS SPECIFIC TO HADRONS THAT WE ARE CONTROLLING
      // We skip our own player, because it has special requirements.
      // UPDATE HADRON X/Y POSITION DATA FOR HADRONS WE ARE CONTROLLING
      const newHadronData = { ...hadron };
      newHadronData.x = clientSprites.get(key).sprite.x;
      newHadronData.y = clientSprites.get(key).sprite.y;
      // Warning, this can overwrite velocity on our own objects if we aren't careful, such as spells.
      if (hadron.flv === 'Item' || hadron.flv === 'NPC') {
        newHadronData.vlx = clientSprites.get(key).sprite.body.velocity.x;
        newHadronData.vly = clientSprites.get(key).sprite.body.velocity.y;
      }
      hadrons.set(key, newHadronData);

      // SET UP RAY CASTER FOR SPRITE IF NPC SHOULD HAVE ONE
      if (hadron.rac) {
        if (!clientSprite.ray) {
          clientSprite.ray = this.raycaster.createRay();
        }
      }

      // IF SPRITE IS OFF OF THE MAP, DESTROY IT
      // This is usually caused by putting delays in before removing sprites,
      // and then the owner closing their browser (or putting it in the background)
      // during high intensity operations, like spells being cast at a wall quickly.
      // Might as well ensure it never stays that way.
      // As long as it doesn't happen to a player! :-D
      if (
        newHadronData.x > gameSizeData.fullWidth + gameSizeData.widthPadding ||
        newHadronData.x < -gameSizeData.widthPadding ||
        newHadronData.y >
          gameSizeData.fullHeight + gameSizeData.heightPadding ||
        newHadronData.y < -gameSizeData.widthPadding
      ) {
        console.error(`Destroying off-map sprite`);
        console.error(newHadronData);
        sendDataToServer.destroyHadron(key);
      }
    }
  }
}

export default updateSprite;
