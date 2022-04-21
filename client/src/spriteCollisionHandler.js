import _ from 'lodash';
import playerObject from './objects/playerObject.js';
import hadrons from './objects/hadrons.js';
import sendDataToServer from './sendDataToServer.js';

let broadCastMessage;
const chatForThrottle = () => {
  sendDataToServer.chat(broadCastMessage);
};
const throttleSendMessageRead = _.debounce(chatForThrottle, 1000, {
  leading: true,
  trailing: false,
});

function spriteCollisionHandler({
  isLocalPlayer,
  spriteKey,
  sprite,
  obstacleLayerName,
  obstacleLayer,
  obstacleSpriteKey,
  obstacleSprite,
  teleportLayerName,
  teleportLayer,
}) {
  console.log(
    isLocalPlayer,
    spriteKey,
    sprite,
    obstacleLayerName,
    obstacleLayer,
    obstacleSpriteKey,
    obstacleSprite,
    teleportLayerName,
    teleportLayer,
  );
  if (teleportLayer) {
    // Something hit a Teleport Layer
    // for now de-spawning silently if we hit a "teleport layer"
    sendDataToServer.destroyHadron(spriteKey);
    hadrons.delete(spriteKey);
  } else if (obstacleLayer) {
    // Something hit any one of our defined Obstacle Layers
    // for now de-spawning silently if we hit any Obstacle Layer
    sendDataToServer.destroyHadron(spriteKey);
    hadrons.delete(spriteKey);
  } else if (obstacleSprite) {
    // Sprite to Sprite interactions
    if (
      obstacleSpriteKey === playerObject.playerId &&
      (!hadrons.get(spriteKey)?.originalOwner ||
        hadrons.get(spriteKey)?.originalOwner === playerObject.playerId)
    ) {
      // Ignore things that I own that hit myself. For now.
      // Because of how things spawn, they all hit me when launched,
      // so if we want to do otherwise we have more work to do.
      if (hadrons.get(spriteKey)?.message) {
        broadCastMessage = {
          text: hadrons.get(spriteKey).message,
          fromPlayerId: hadrons.get(spriteKey).originalOwner,
        };
        throttleSendMessageRead();
      }
      // TODO: At some point these will matter, such as if I make a boss that shoots at me.
    } else if (
      obstacleSpriteKey &&
      hadrons.has(obstacleSpriteKey) &&
      hadrons.get(obstacleSpriteKey).name
    ) {
      // If the obstacle is a hadron, and it has a name, it is a player,
      // so make them say "Oof!"
      // TODO: Player hadrons should have a better "tag" and we should tag other "things" too to help with this.
      if (hadrons.get(spriteKey)?.message) {
        broadCastMessage = {
          text: hadrons.get(spriteKey).message,
          fromPlayerId: hadrons.get(spriteKey).originalOwner,
        };
        throttleSendMessageRead();
      } else {
        sendDataToServer.destroyHadron(spriteKey);
        hadrons.delete(spriteKey);
        sendDataToServer.makePlayerSayOof(obstacleSpriteKey);
      }
    } else if (obstacleSpriteKey) {
      // Any sprite collision that wasn't a player
      // TODO: Obviously this needs to be more sophisticated.
      sendDataToServer.destroyHadron(spriteKey);
      hadrons.delete(spriteKey);
    }
  } else {
    // You should never get here unless you are testing out new things.
    // NOTE: IF in doubt, copy this to to BEFORE the if/else chain to see what is happening.
    console.log(
      isLocalPlayer,
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
