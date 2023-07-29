import hadrons from '../objects/hadrons.js';
import sendDataToServer from '../sendDataToServer.js';
import spells from '../objects/spells.js';
import playerObject from '../objects/playerObject.js';
import getDestinationFromTileLayerProperties from '../utilities/getDestinationFromTileLayerProperties.js';

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
  obstacleLayerName,
  obstacleSpriteKey,
  teleportLayerProperties,
}) {
  // Uncomment this section to log collider data:
  // --------------------------------------------
  // console.log(
  //   '--------------',
  //   `\n${hadrons.get(spriteKey)?.typ} sprite ${spriteKey}`,
  //   `${obstacleLayerName ? `\nobstacleLayerName ${obstacleLayerName}` : ''}`,
  //   `${
  //     obstacleSpriteKey
  //       ? `\n${
  //           hadrons.get(obstacleSpriteKey)?.typ
  //         } obstacle sprite ${obstacleSpriteKey}`
  //       : ''
  //   }`,
  //   `${teleportLayerProperties ? `\nteleportLayerProperties:` : ''}`,
  // );
  // if (teleportLayerProperties) {
  //   console.log(teleportLayerProperties);
  // }
  // --------------------------------------------
  if (hadrons.has(spriteKey)) {
    // Sprites can linger, and collide, after there hadron is destroyed, but we do not need to act on them anymore.
    if (teleportLayerProperties) {
      if (
        hadrons.get(spriteKey)?.flv === 'Item' ||
        hadrons.get(spriteKey)?.flv === 'NPC'
      ) {
        if (hadrons.get(spriteKey)?.tvl) {
          // Currently only Items and NPCs can teleport,
          // other hadrons, like spells, just de-spawn.
          const { destinationSceneName, destinationSceneEntrance } =
            getDestinationFromTileLayerProperties(teleportLayerProperties);
          if (destinationSceneEntrance === 'PreviousPosition') {
            // In the rare case that this is just supposed to go to our last known position in the previous scene,
            // which currently ONLY happens in the Library, this is easy.
            const newHadronData = { ...hadrons.get(spriteKey) };
            newHadronData.scn = destinationSceneName;
            newHadronData.x = playerObject.previousScene.x;
            newHadronData.y = playerObject.previousScene.y;
            hadrons.set(spriteKey, newHadronData);
            // We must manually send hadron data when we set a scene other than the current one on it.
            sendDataToServer.hadronData(newHadronData, spriteKey);
          } else {
            const newHadronData = { ...hadrons.get(spriteKey) };
            if (destinationSceneName !== 'Local') {
              newHadronData.scn = destinationSceneName;
            }
            newHadronData.px = newHadronData.x;
            newHadronData.py = newHadronData.y;
            newHadronData.de = destinationSceneEntrance;
            hadrons.set(spriteKey, newHadronData);
            if (destinationSceneName !== 'Local') {
              // We must manually send hadron data when we set a scene other than the current one on it.
              sendDataToServer.hadronData(newHadronData, spriteKey);
            }
          }
        }
      } else {
        sendDataToServer.destroyHadron(spriteKey);
      }
    } else if (obstacleLayerName) {
      // Obstacle Layers interactions.
      // for now de-spawning silently if we hit any Obstacle Layer
      if (
        hadrons.get(spriteKey)?.flv !== 'Item' &&
        hadrons.get(spriteKey)?.flv !== 'NPC'
      ) {
        // Except items and NPCs do not de-spawn when hitting walls.
        sendDataToServer.destroyHadron(spriteKey);
      }
    } else if (obstacleSpriteKey) {
      if (hadrons.has(obstacleSpriteKey)) {
        // Obstacle can linger, and collide, after there hadron is destroyed, but we do not need to act on them anymore.
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
            sendDataToServer.destroyHadron(spriteKey);
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
            sendDataToServer.destroyHadron(spriteKey);
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
            sendDataToServer.destroyHadron(spriteKey);
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
              sendDataToServer.destroyHadron(spriteKey);
              // Render damage to the NPC
              sendDataToServer.damageHadron({
                id: obstacleSpriteKey,
                // TODO: Amount should probably be stored in the sprite data and gotten from the spell?
                amount: 1,
              });
            } else if (hadrons.get(obstacleSpriteKey)?.flv === 'Item') {
              // Destroy the spell hadron
              sendDataToServer.destroyHadron(spriteKey);
              // Render damage to the Item if it has health (not all do)
              if (hadrons.get(obstacleSpriteKey)?.hlt) {
                sendDataToServer.damageHadron({
                  id: obstacleSpriteKey,
                  // TODO: Amount should probably be stored in the sprite data and gotten from the spell?
                  amount: 1,
                });
              }
            }
            // Spells hitting Non-NPC Quarks are ignored
          } else if (hadrons.get(obstacleSpriteKey)?.flv === 'Item') {
            // Shooting your own items has no affect,
            // but the spells go away.
            // Destroy the spell hadron
            sendDataToServer.destroyHadron(spriteKey);
          }
          // An NPC's spell hitting itself is ignored.
        } else if (
          hadrons.get(spriteKey)?.typ === 'quark' &&
          hadrons.get(obstacleSpriteKey)?.typ === 'spell'
        ) {
          // NPC hitting a spell is ignored.
          // Spells hit NPCs, but if an NPC hits a spell, we don't actually care, as the Spell->NPC already covered the action.
        } else if (
          hadrons.get(obstacleSpriteKey)?.typ === 'player' &&
          hadrons.get(spriteKey)?.flv === 'NPC' &&
          hadrons.get(spriteKey)?.dpc
        ) {
          // If an NPC or Item is set to damage players on contact, do so.
          const amount = hadrons.get(spriteKey)?.dpc;
          // console.log(amount / 100);
          sendDataToServer.damageHadron({ id: obstacleSpriteKey, amount });
        } else {
          // Anything else just passes through
          // console.log(
          //   hadrons.get(spriteKey)?.typ,
          // hadrons.get(obstacleSpriteKey)?.typ,
          // hadrons.get(obstacleSpriteKey)?.flv,
          // spriteKey,
          // sprite,
          // obstacleLayerName,
          // obstacleSpriteKey,
          // obstacleSprite,
          // teleportLayerProperties,
          // );
        }
      }
    } else if (playerObject.enableDebug) {
      // You should never get here unless you are testing out new things.
      // IF in doubt, copy this to BEFORE the if/else chain to see what is happening.
      console.error(
        '--------------',
        `\n${hadrons.get(spriteKey)?.typ} sprite ${spriteKey}`,
        `${
          obstacleLayerName ? `\nobstacleLayerName ${obstacleLayerName}` : ''
        }`,
        `${
          obstacleSpriteKey
            ? `\n${
                hadrons.get(obstacleSpriteKey)?.typ
              } obstacle sprite ${obstacleSpriteKey}`
            : ''
        }`,
        `${teleportLayerProperties ? `\nteleportLayerProperties:` : ''}`,
      );
      if (teleportLayerProperties) {
        console.error(teleportLayerProperties);
      }
    }
  }
}

export default spriteCollisionHandler;
