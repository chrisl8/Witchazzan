import _ from 'lodash';
import hadrons from '../objects/hadrons.js';
import sendDataToServer from '../sendDataToServer.js';
import spells from '../objects/spells.js';

let broadCastMessage;
const chatForThrottle = () => {
  sendDataToServer.chat(broadCastMessage);
};
const throttleSendMessageRead = _.debounce(chatForThrottle, 1000, {
  leading: true,
  trailing: false,
});

/*
  REMEMBER!
  You have to act on collisions of your sprites, even if they are with sprites other players control,
  because often you are the only one who will see it,
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
  // console.log(
  //   '--------------',
  //   '\nspriteKey',
  //   spriteKey,
  //   '\nsprite',
  //   sprite,
  //   '\nobstacleLayerName',
  //   obstacleLayerName,
  //   '\nobstacleLayer',
  //   obstacleLayer,
  //   '\nobstacleSpriteKey',
  //   obstacleSpriteKey,
  //   '\nobstacleSprite',
  //   obstacleSprite,
  //   '\nteleportLayerName',
  //   teleportLayerName,
  //   '\nteleportLayer',
  //   teleportLayer,
  // );
  if (teleportLayer) {
    // Teleport Layer interactions.
    // for now de-spawning silently if we hit a "teleport layer"
    sendDataToServer.destroyHadron(spriteKey);
  } else if (obstacleLayer) {
    // Obstacle Layers interactions.
    // for now de-spawning silently if we hit any Obstacle Layer
    sendDataToServer.destroyHadron(spriteKey);
  } else if (obstacleSprite) {
    // Sprite to Sprite interactions
    if (
      hadrons.get(spriteKey)?.typ === 'message' &&
      hadrons.get(spriteKey)?.txt !== undefined
    ) {
      // Messages - A message sprite that we are tracking has collided with something.
      if (hadrons.get(obstacleSpriteKey)?.typ === 'player') {
        // If it is a player, broadcast the message within to everyone, "from" the owner.
        broadCastMessage = {
          text: hadrons.get(spriteKey).txt,
          fromPlayerId: hadrons.get(spriteKey).own,
        };
        throttleSendMessageRead();
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
      spells[hadrons.get(obstacleSpriteKey)?.sub].type === 'damage' &&
      hadrons.get(spriteKey)?.own !== hadrons.get(obstacleSpriteKey)?.own
    ) {
      // If two damage spells, owned by different players, collide, they destroy each other.
      sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
      sendDataToServer.destroyHadron(obstacleSpriteKey);
    } else if (
      hadrons.get(spriteKey)?.typ === 'spell' &&
      spells[hadrons.get(spriteKey)?.sub].type === 'damage' &&
      hadrons.get(obstacleSpriteKey)?.typ === 'player' &&
      hadrons.get(spriteKey)?.own !== hadrons.get(obstacleSpriteKey)?.own
    ) {
      // If a damage spell hits a player that is not the owner:
      // 1. De-spawn the spell.
      sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
      // 2. Apply damage to the player.
      let amount = 1;
      const spriteOwnerHadron = { ...hadrons.get(hadrons.get(spriteKey)?.own) };
      if (
        spriteOwnerHadron.hasOwnProperty('dps') &&
        // eslint-disable-next-line no-restricted-globals
        !isNaN(spriteOwnerHadron.dps)
      ) {
        amount *= spriteOwnerHadron.dps;
      }
      sendDataToServer.damageHadron({ id: obstacleSpriteKey, amount });
    } else if (
      hadrons.get(spriteKey)?.typ === 'spell' &&
      hadrons.get(obstacleSpriteKey)?.typ === 'npc' &&
      hadrons.get(spriteKey)?.own !== hadrons.get(obstacleSpriteKey)?.own
    ) {
      // If a spell hits an NPC...
      // Destroy the spell hadron
      sendDataToServer.destroyHadron(spriteKey, obstacleSpriteKey, this);
      // Render damage to the NPC
      // TODO: Amount should probably be stored in the sprite data and gotten from the spell?
      sendDataToServer.damageHadron({ id: obstacleSpriteKey, amount: 1 });
    } else {
      // // Anything else just passes through
      // if (!hadrons.get(spriteKey)?.typ) {
      //   console.log(hadrons.get(spriteKey));
      // } else {
      //   console.log(
      //     hadrons.get(spriteKey)?.typ,
      //     hadrons.get(obstacleSpriteKey)?.typ,
      //   );
      // }
    }
  } else {
    // You should never get here unless you are testing out new things.
    // NOTE: IF in doubt, copy this to to BEFORE the if/else chain to see what is happening.
    console.log(
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

export default spriteCollisionHandler;
