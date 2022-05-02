import clientSprites from '../objects/clientSprites.js';
import getSpriteData from '../utilities/getSpriteData.js';
import playerObject from '../objects/playerObject.js';
import spriteCollisionHandler from './spriteCollisionHandler.js';

function addAndUpdateSprites(
  hadron,
  key,
  collisionLayer,
  teleportLayersColliders,
) {
  // If a remote player changes their sprite, we won't know about it,
  //       although currently they have to disconnect to do this, so
  //       the hadron is removed and resent anyway.

  // Add new Sprites for new hadrons.
  if (!clientSprites.has(key)) {
    // Add new sprites to the scene
    const newClientSprite = {};

    newClientSprite.spriteData = getSpriteData(hadron.sprt);

    // Use different carrot colors for different genetic code
    // TODO: Delete this or make some use of it.
    if (hadron.typ === 'carrot') {
      // hadron.genes.color range 0 to 255
      // Currently carrot options are 01 to 28
      const carrotSpriteId = Math.floor(28 * (hadron.genes.color / 255));
      const alternateCarrotSpriteName = `carrot${
        carrotSpriteId < 10 ? 0 : ''
      }${carrotSpriteId}`;
      // console.log(
      //   hadron.genes.color,
      //   hadron.genes.color / 255,
      //   carrotSpriteId,
      //   alternateCarrotSpriteName,
      //   hadron.energy,
      // );
      const newSprite = getSpriteData(alternateCarrotSpriteName);
      if (newSprite.name !== playerObject.defaultSpriteName) {
        newClientSprite.spriteData = newSprite;
      }
    }

    newClientSprite.sprite = this.physics.add
      .sprite(hadron.x, hadron.y, newClientSprite.spriteData.name)
      .setSize(
        newClientSprite.spriteData.physicsSize.x,
        newClientSprite.spriteData.physicsSize.y,
      )
      .setDisplaySize(
        newClientSprite.spriteData.displayWidth,
        newClientSprite.spriteData.displayHeight,
      );

    // Set the "shadow" of my own player to black.
    if (key === playerObject.playerId) {
      newClientSprite.sprite.tint = 0x000000;
    }

    // Some sprites don't line up well with their physics object,
    // so this allows for offsetting that in the config.
    if (newClientSprite.spriteData.physicsOffset) {
      newClientSprite.sprite.body.setOffset(
        newClientSprite.spriteData.physicsOffset.x,
        newClientSprite.spriteData.physicsOffset.y,
      );
    }

    clientSprites.set(key, newClientSprite);
  }

  // Additional features for owned sprites,
  // which can be transferred to us,
  // even if the sprite already existed as a non-owned sprite before.
  if (
    // It should exist now, even if it didn't before.
    clientSprites.has(key) &&
    // We control it.
    hadron.ctrl === playerObject.playerId &&
    // But it isn't our shadow.
    key !== playerObject.playerId
  ) {
    // If we had a sprite before, but we didn't own it,
    // and it was transferred to us, the sprite exists,
    // but it doesn't have a collider or velocity yet.
    // I think the only way to track that is manually.

    /* TRACK COLLISIONS FOR OWNED SPRITES. */

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
    }

    // COLLISIONS WITH OTHER SPRITES
    // Other sprites come and go, so we need to check and update colliders with them on every update, or at least when we get new hadrons.
    // Note that we use overlap, not collide here. This does a couple of things:
    // 1. A collide will have a physics affect that we don't actually want (the player object, for instance, is controlled directly so bumping it around just causes visual glitches).
    // 2. By waiting for a full overlap before registering, it looks better to other players, who tend to see
    //    the sprite deleted before they see it overlap the obstacle (We could add some sort of "animate one more frame" logic, but for now ths is it.)
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
    });

    /* SET VELOCITY ON OWNED SPRITES */
    if (!clientSprites.get(key).velocitySet) {
      clientSprites.get(key).velocitySet = true;
      clientSprites.get(key).sprite.body.setVelocityX(hadron.velX);
      clientSprites.get(key).sprite.body.setVelocityY(hadron.velY);
    }
  }
}

export default addAndUpdateSprites;
