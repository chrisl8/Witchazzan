import hadrons from '../objects/hadrons.js';
import sendDataToServer from '../sendDataToServer.js';
import spells from '../objects/spells.js';
import debugLog from '../utilities/debugLog.js';

/*
  REMEMBER!
  You have to act on collisions of your sprites, even if they are with sprites other players control,
  because you are the only one who will see it,
  so you may have to send out messages saying, "do this" with your sprite!
  Otherwise we get into a problem of who is in 'control' when two sprites collide that are controlled
  by different clients.
 */

function spriteCollisionHandler({
  spriteKey,
  sprite,
  obstacleLayerName,
  obstacleLayer,
  obstacleSpriteKey,
  obstacleSprite,
  teleportLayerName,
  teleportLayer,
}) {
  // Uncomment this if you think something is getting "eaten up" to find it.
  // console.log(
  //   '--------------',
  //   '\nspriteKey',
  //   spriteKey,
  //   '\nsprite',
  //   sprite,
  //   '\ntype',
  //   hadrons.get(spriteKey)?.typ,
  //   '\nobstacleLayerName',
  //   obstacleLayerName,
  //   '\nobstacleLayer',
  //   obstacleLayer,
  //   '\nobstacleSpriteKey',
  //   obstacleSpriteKey,
  //   '\nobstacleSprite',
  //   obstacleSprite,
  //   '\ntype',
  //   hadrons.get(obstacleSpriteKey)?.typ,
  //   '\nteleportLayerName',
  //   teleportLayerName,
  //   '\nteleportLayer',
  //   teleportLayer,
  // );
  if (hadrons.get(spriteKey)) {
    // Sprites can linger, and collide, after there hadron is destroyed, but we do not need to act on them anymore.
    if (teleportLayer) {
      // Teleport Layer interactions.
      // for now de-spawning silently if we hit a "teleport layer"
      // as only Players teleport,
      // but this is intended to be expanded in the future.
      if (hadrons.get(spriteKey)?.flv !== 'NPC') {
        sendDataToServer.destroyHadron(spriteKey);
      }
    } else if (obstacleLayer) {
      // Obstacle Layers interactions.
      // for now de-spawning silently if we hit any Obstacle Layer
      if (
        hadrons.get(spriteKey)?.flv !== 'Item' &&
        hadrons.get(spriteKey)?.flv !== 'NPC'
      ) {
        // Except items and NPCs do not de-spawn when hitting walls.
        sendDataToServer.destroyHadron(spriteKey);
      }
    } else if (obstacleSprite) {
      // Obstacle can linger, and collide, after there hadron is destroyed, but we do not need to act on them anymore.
      if (hadrons.get(obstacleSpriteKey)) {
        // Sprite to Sprite interactions
        if (
          hadrons.get(spriteKey)?.typ === 'message' &&
          hadrons.get(spriteKey)?.txt !== undefined
        ) {
          // Messages - A message sprite that we are tracking has collided with something.
          if (hadrons.get(obstacleSpriteKey)?.typ === 'player') {
            // If it is a player, display the message on the screen.
            sendDataToServer.txt({
              typ: 'fad',
              text: hadrons.get(spriteKey).txt,
              targetPlayerId: hadrons.get(obstacleSpriteKey)?.id,
            });
          }
        } else if (hadrons.get(obstacleSpriteKey)?.typ === 'message') {
          // Message was hit by something that I control.
          if (
            hadrons.get(spriteKey)?.typ !== 'player' &&
            hadrons.get(spriteKey)?.own === hadrons.get(obstacleSpriteKey)?.own
          ) {
            // Anything that is NOT a player, and is owned by the same owner as the message
            // will de-spawn
            // and destroy the message.
            sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
            sendDataToServer.destroyHadron(obstacleSpriteKey);
          }
        } else if (
          hadrons.get(spriteKey)?.typ === 'spell' &&
          spells[hadrons.get(spriteKey)?.sub].type === 'damage' &&
          hadrons.get(obstacleSpriteKey)?.typ === 'spell' &&
          spells[hadrons.get(obstacleSpriteKey)?.sub].type === 'damage'
        ) {
          if (
            hadrons.get(spriteKey)?.own !== hadrons.get(obstacleSpriteKey)?.own
          ) {
            // If two damage spells, owned by different players, collide, they destroy each other.
            sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
            sendDataToServer.destroyHadron(obstacleSpriteKey);
          }
          // A player's own spells hitting each other is entirely ignored.
        } else if (
          hadrons.get(spriteKey)?.typ === 'spell' &&
          spells[hadrons.get(spriteKey)?.sub].type === 'damage' &&
          hadrons.get(obstacleSpriteKey)?.typ === 'player'
        ) {
          if (
            hadrons.get(spriteKey)?.own !== hadrons.get(obstacleSpriteKey)?.own
          ) {
            // If a damage spell hits a player that is not the owner:
            const dps = hadrons.get(spriteKey)?.dps;
            // 1. De-spawn the spell.
            sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
            // 2. Apply damage to the player.
            let amount = 1;
            if (
              dps &&
              // eslint-disable-next-line no-restricted-globals
              !isNaN(dps)
            ) {
              amount *= dps;
            }
            sendDataToServer.damageHadron({ id: obstacleSpriteKey, amount });
          }
          // A player's spells hitting themselves is entirely ignored.
        } else if (
          hadrons.get(spriteKey)?.typ === 'spell' &&
          hadrons.get(obstacleSpriteKey)?.typ === 'quark'
        ) {
          if (
            hadrons.get(spriteKey)?.own !== hadrons.get(obstacleSpriteKey)?.own
          ) {
            if (hadrons.get(obstacleSpriteKey)?.flv === 'NPC') {
              // If a spell hits an NPC...
              // Destroy the spell hadron
              sendDataToServer.destroyHadron(
                spriteKey,
                obstacleSpriteKey,
                this,
              );
              // Render damage to the NPC
              // TODO: Amount should probably be stored in the sprite data and gotten from the spell?
              sendDataToServer.damageHadron({
                id: obstacleSpriteKey,
                amount: 1,
              });
            } else if (hadrons.get(obstacleSpriteKey)?.flv === 'Item') {
              // Shooting someone else's items currently has no affect either,
              // but eventually we may make them have health.
              // but the spells go away.
              // Destroy the spell hadron
              sendDataToServer.destroyHadron(
                spriteKey,
                obstacleSpriteKey,
                this,
              );
            }
            // Spells hitting Non-NPC Quarks are ignored
          } else if (hadrons.get(obstacleSpriteKey)?.flv === 'Item') {
            // Shooting your own items has no affect,
            // but the spells go away.
            // Destroy the spell hadron
            sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
          }
          // An NPC's spell hitting itself is ignored.
        } else if (
          hadrons.get(spriteKey)?.typ === 'quark' &&
          hadrons.get(obstacleSpriteKey)?.typ === 'spell'
        ) {
          // NPC hitting a spell is ignored.
          // Spells hit NPCs, but if an NPC hits a spell, we don't actually care, as the Spell->NPC already covered the action.
        } else {
          // Anything else just passes through
          // console.log(
          //   hadrons.get(spriteKey)?.typ,
          //   hadrons.get(obstacleSpriteKey)?.typ,
          //   hadrons.get(obstacleSpriteKey)?.flv,
          //   spriteKey,
          //   sprite,
          //   obstacleLayerName,
          //   obstacleLayer,
          //   obstacleSpriteKey,
          //   obstacleSprite,
          //   teleportLayerName,
          //   teleportLayer,
          // );
        }
      }
    } else {
      // You should never get here unless you are testing out new things.
      // NOTE: IF in doubt, copy this to BEFORE the if/else chain to see what is happening.
      debugLog(
        spriteKey,
        sprite,
        obstacleLayerName,
        obstacleLayer,
        obstacleSpriteKey,
        obstacleSprite,
        teleportLayerName,
        teleportLayer,
      );
    }
  }
}

export default spriteCollisionHandler;
