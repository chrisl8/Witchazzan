import clientSprites from '../objects/clientSprites.js';
import playerObject from '../objects/playerObject.js';
import spriteCollisionHandler from './spriteCollisionHandler.js';

function addSpriteColliders(
  hadron,
  key,
  collisionLayer,
  teleportLayersColliders,
  sceneName,
) {
  if (
    clientSprites.has(key) && // If it actually has a sprite,
    hadron.ctr === playerObject.playerId && // We control it.
    key !== playerObject.playerId // But it isn't our shadow.
  ) {
    // If we had a sprite before, but we didn't own it,
    // and it was transferred to us, the sprite exists,
    // but it doesn't have a collider or velocity yet.
    // I think the only way to track that is manually.

    /* TRACK COLLISIONS FOR SPRITES WE CONTROL. */

    if (!clientSprites.get(key).staticCollisionsSet) {
      clientSprites.get(key).staticCollisionsSet = true;

      // Collisions with tilemap collisionLayer layer
      this.physics.add.collider(
        clientSprites.get(key).sprite,
        collisionLayer,
        (sprite, obstacle) => {
          spriteCollisionHandler({
            spriteKey: key,
            sprite,
            obstacleLayerName: 'collisionLayer',
            obstacleLayer: obstacle,
          });
        },
      );

      // Collisions with tilemap teleport layers
      teleportLayersColliders.forEach((layer) => {
        this.physics.add.collider(
          clientSprites.get(key).sprite,
          layer,
          (sprite, obstacle) => {
            spriteCollisionHandler({
              spriteKey: key,
              sprite,
              teleportLayerName: layer.name,
              teleportLayer: obstacle,
            });
          },
        );
      });

      // For Items in Library, add a collider with player
      if (sceneName === 'Library' && hadron.flv === 'Item') {
        this.physics.add.collider(
          playerObject.player,
          clientSprites.get(key).sprite,
          () => {
            spriteCollisionHandler.call(this, {
              spriteKey: playerObject.playerId,
              sprite: playerObject.player,
              obstacleSpriteKey: key,
              obstacleSprite: clientSprites.get(key).sprite,
            });
          },
        );
      }
    }

    // COLLISIONS WITH OTHER SPRITES
    // Other sprites come and go, so we need to check and update colliders with them on every update, or at least when we get new hadrons.
    // Note that we use overlap, not collide here. This does a couple of things:
    // 1. A collide will have a physics affect that we don't actually want (the player object, for instance, is controlled directly so bumping it around just causes visual glitches).
    // 2. By waiting for a full overlap before registering, it looks better to other players.
    // In the future we could perhaps have a key on the hadron that determines whether we use overlap or collide
    // for a given object.
    clientSprites.forEach((otherSprite, otherSpriteKey) => {
      // Don't add a collider with ourself.
      if (otherSpriteKey !== key) {
        if (!otherSprite.colliders) {
          // eslint-disable-next-line no-param-reassign
          otherSprite.colliders = {};
        }
        // Add new ones
        if (otherSprite.sprite && !otherSprite.colliders[key]) {
          if (sceneName === 'Library' && hadron.flv === 'Item') {
            // Items in the Library are able to be pushed around by the local player.
            // eslint-disable-next-line no-param-reassign
            otherSprite.colliders[key] = this.physics.add.collider(
              clientSprites.get(key).sprite,
              otherSprite.sprite,
              (sprite, obstacle) => {
                spriteCollisionHandler.call(this, {
                  spriteKey: key,
                  sprite,
                  obstacleSpriteKey: otherSpriteKey,
                  obstacleSprite: obstacle,
                });
              },
            );
            clientSprites.get(key).sprite.setDamping(true);
            clientSprites.get(key).sprite.setDrag(0.5);
          } else {
            // eslint-disable-next-line no-param-reassign
            otherSprite.colliders[key] = this.physics.add.overlap(
              clientSprites.get(key).sprite,
              otherSprite.sprite,
              (sprite, obstacle) => {
                spriteCollisionHandler.call(this, {
                  spriteKey: key,
                  sprite,
                  obstacleSpriteKey: otherSpriteKey,
                  obstacleSprite: obstacle,
                });
              },
            );
          }
        }
      }
    });
  }
}

export default addSpriteColliders;
