import clientSprites from '../objects/clientSprites.js';
import getSpriteData from '../utilities/getSpriteData.js';
import playerObject from '../objects/playerObject.js';

function addSprites(hadron, key) {
  // Add new Sprites for new hadrons.
  if (!clientSprites.has(key) && !hadron.off) {
    // Add new sprites to the scene
    const newClientSprite = {};

    newClientSprite.spriteData = getSpriteData(hadron.sprt);

    // Use different carrot colors for different genetic code
    // TODO: Delete this or make some use of it.
    //       Maybe make a scene where carrots grow,
    //       and boost health when they are "eaten" (walked over or hit with a certain spell?)
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
