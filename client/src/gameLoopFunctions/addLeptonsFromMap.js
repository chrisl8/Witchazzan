import convertTileMapPropertyArrayToObject from '../utilities/convertTileMapPropertyArrayToObject.js';
import getSpriteData from '../utilities/getSpriteData.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';
import playerObject from '../objects/playerObject.js';

// Leptons do not generate hadrons and do not interact via the Small Hadron Cooperator (Server).
// Every client generates and sees their own instance of a Lepton.
function addQuarksFromMap(map) {
  // This section finds the Objects in the Tilemap that trigger features
  // Useful info on how this works:
  // https://www.html5gamedevs.com/topic/37978-overlapping-on-a-tilemap-object-layer/?do=findComment&comment=216742
  // https://github.com/B3L7/phaser3-tilemap-pack/blob/master/src/scenes/Level.js
  const objects = map.getObjectLayer('Objects');
  objects.objects.forEach((object) => {
    const objectProperties = convertTileMapPropertyArrayToObject(object);
    if (objectProperties.Type === 'Lepton') {
      if (objectProperties.Flavor === 'NonPhysicsSprite') {
        // "NonPhysicsSprite" is for plopping non-physics sprites into a tilemap for aesthetic reasons.
        // They won't have colliders, but they will animate.
        // Importantly, the do NOT create Hadrons.
        // Note that they do not actually need to "animate".
        const spriteData = getSpriteData(object.name);

        // Depth
        let depth = objectDepthSettings.animatedObjects;
        if (
          objectProperties.hasOwnProperty('spriteLayerDepth') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.spriteLayerDepth)
        ) {
          depth = Number(objectProperties.spriteLayerDepth);
        }

        let newThing;
        if (this.textures.exists(spriteData.name)) {
          newThing = this.add
            .sprite(object.x, object.y, spriteData.name)
            .setSize(spriteData.physicsSize.x, spriteData.physicsSize.y)
            .setDisplaySize(spriteData.displayWidth, spriteData.displayHeight)
            .setDepth(depth);
        } else {
          newThing = this.add
            .sprite(object.x, object.y, 'atlasOne', spriteData.name)
            .setSize(spriteData.physicsSize.x, spriteData.physicsSize.y)
            .setDisplaySize(spriteData.displayWidth, spriteData.displayHeight)
            .setDepth(depth);
        }

        // Animation
        if (
          this.anims.anims.entries.hasOwnProperty(
            `${spriteData.name}-move-stationary`,
          )
        ) {
          newThing.anims.play(`${spriteData.name}-move-stationary`, true);
        }

        // Flip
        if (objectProperties.flipX) {
          newThing.setFlipX(true);
        }
      } else if (
        objectProperties.Flavor === 'Text' &&
        objectProperties.hasOwnProperty('Text')
      ) {
        let font = playerObject.defaultTextOptions.font;
        if (
          objectProperties.hasOwnProperty('Font') &&
          this.cache.bitmapFont.has(objectProperties.Font)
        ) {
          font = objectProperties.Font;
        }
        const text = this.add
          .bitmapText(
            object.x,
            object.y,
            font,
            objectProperties.Text.split('\n'),
          )
          .setFontSize(
            objectProperties.Size || playerObject.defaultTextOptions.fontSize,
          )
          .setOrigin(
            objectProperties.Origin || playerObject.defaultTextOptions.origin,
          )
          .setDepth(objectProperties.Depth || objectDepthSettings.sceneText);
        if (
          objectProperties.hasOwnProperty('Center') &&
          objectProperties.Center
        ) {
          text.setCenterAlign();
        }
      }
    }
  });
}

export default addQuarksFromMap;
