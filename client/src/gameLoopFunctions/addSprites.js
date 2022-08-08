import clientSprites from '../objects/clientSprites.js';
import getSpriteData from '../utilities/getSpriteData.js';
import playerObject from '../objects/playerObject.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';

function addSprites(hadron, key) {
  // Add new Sprites for new hadrons.
  if (!clientSprites.has(key) && !hadron.off) {
    // Add new sprites to the scene
    const newClientSprite = {};

    newClientSprite.spriteData = getSpriteData(hadron.spr);

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

    // https://newdocs.phaser.io/docs/3.55.1/Phaser.Data.DataManager
    newClientSprite.sprite.setData('hadronId', key);

    // Phaser arcade physics supports rectangles and circles.
    if (newClientSprite.spriteData.physicsCircle) {
      newClientSprite.sprite.setCircle(
        newClientSprite.spriteData.physicsCircle.radius,
      );
    }

    // Some sprites don't line up well with their physics object,
    // so this allows for offsetting that in the config.
    if (newClientSprite.spriteData.physicsOffset) {
      newClientSprite.sprite.body.setOffset(
        newClientSprite.spriteData.physicsOffset.x,
        newClientSprite.spriteData.physicsOffset.y,
      );
    }

    // Set the depth for the sprite.
    if (hadron.typ === 'npc' && hadron.hasOwnProperty('dph')) {
      newClientSprite.sprite.setDepth(hadron.dph);
    } else if (hadron.typ === 'npc') {
      newClientSprite.sprite.setDepth(objectDepthSettings.npc);
    } else if (key === playerObject.playerId) {
      newClientSprite.sprite.setDepth(objectDepthSettings.playerShadow);
    } else if (hadron.typ === 'player') {
      newClientSprite.sprite.setDepth(objectDepthSettings.otherPlayer);
    } else if (hadron.typ === 'spell') {
      newClientSprite.sprite.setDepth(objectDepthSettings.spells);
    } else if (hadron.typ === 'message') {
      newClientSprite.sprite.setDepth(objectDepthSettings.message);
    }

    // Set the "shadow" of my own player to black.
    if (key === playerObject.playerId) {
      // https://www.phaser.io/examples/v3/view/display/tint/tint-and-alpha
      newClientSprite.sprite.setTintFill(0x000000);
    }

    clientSprites.set(key, newClientSprite);
  }
  // NOTE: If a remote player changes their sprite, we won't know about it,
  //       although currently they have to disconnect to do this, so
  //       the hadron is removed and resent anyway.
}

export default addSprites;
