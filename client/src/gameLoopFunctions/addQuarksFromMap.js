import convertTileMapPropertyArrayToObject from '../utilities/convertTileMapPropertyArrayToObject.js';
import getSpriteData from '../utilities/getSpriteData.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';
import currentSceneNPCs from '../objects/currentSceneNPCs.js';
import sendDataToServer from '../sendDataToServer.js';

function addQuarksFromMap(map, sceneName) {
  // This section finds the Objects in the Tilemap that trigger features
  // Useful info on how this works:
  // https://www.html5gamedevs.com/topic/37978-overlapping-on-a-tilemap-object-layer/?do=findComment&comment=216742
  // https://github.com/B3L7/phaser3-tilemap-pack/blob/master/src/scenes/Level.js
  const objects = map.getObjectLayer('Objects');
  objects.objects.forEach((object) => {
    const objectProperties = convertTileMapPropertyArrayToObject(object);
    if (objectProperties.Type === 'AnimationOnly') {
      // "AnimationOnly" is for plopping non-physics sprites into a tilemap for aesthetic reasons.
      // They won't have colliders, but they will animate.
      // Importantly, the do NOT create Hadrons.
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

      const newThing = this.add
        .sprite(object.x, object.y, spriteData.name)
        .setSize(spriteData.physicsSize.x, spriteData.physicsSize.y)
        .setDepth(depth);

      // Animation
      if (
        this.anims.anims.entries.hasOwnProperty(
          `${spriteData.name}-move-stationary`,
        )
      ) {
        newThing.anims.play(`${spriteData.name}-move-stationary`, true);
      }
    } else if (objectProperties.Type === 'NPC') {
      // Type "NPC" will be used for actual NPCs.
      if (objectProperties.id && !currentSceneNPCs.has(objectProperties.id)) {
        console.log(objectProperties);
        const newHadron = {
          id: objectProperties.id,
          own: objectProperties.id, // NPC's own themselves just as players do.
          x: object.x,
          y: object.y,
          spr: objectProperties.sprite,
          typ: 'npc',
          flv: objectProperties.Flavor,
          cat: objectProperties.category,
          sub: objectProperties.subType,
          scn: sceneName,
          dod: objectProperties.dod,
          pod: objectProperties.pod,
          tcw: objectProperties.tcw,
          hlt: 100,
          mxh: 100,
          dps: 1,
          ris: objectProperties.respawnInSeconds,
          ani: 'stationary',
        };
        if (objectProperties.hasOwnProperty('initialSpriteDirection')) {
          newHadron.dir = objectProperties.initialSpriteDirection;
        }
        if (objectProperties.hasOwnProperty('initialAnimationState')) {
          newHadron.ani = objectProperties.initialAnimationState;
        }
        if (
          objectProperties.hasOwnProperty('health') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.health)
        ) {
          newHadron.hlt = Number(objectProperties.health);
          newHadron.mxh = Number(objectProperties.health);
        }
        if (
          objectProperties.hasOwnProperty('dps') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.dps)
        ) {
          newHadron.dps = Number(objectProperties.dps);
        }
        if (
          objectProperties.hasOwnProperty('spriteLayerDepth') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.spriteLayerDepth)
        ) {
          newHadron.dph = Number(objectProperties.spriteLayerDepth);
        }
        if (
          objectProperties.hasOwnProperty('rateOfFire') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.rateOfFire)
        ) {
          newHadron.rof = Number(objectProperties.rateOfFire);
        }
        if (
          objectProperties.hasOwnProperty('rayCast') &&
          objectProperties.rayCast
        ) {
          newHadron.rac = true;
        }
        if (
          objectProperties.hasOwnProperty('rayCastType') &&
          objectProperties.rayCastType
        ) {
          newHadron.rtp = objectProperties.rayCastType;
        }
        if (
          objectProperties.hasOwnProperty('rayCastDegrees') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.rayCastDegrees)
        ) {
          newHadron.rcd = objectProperties.rayCastDegrees;
        }
        if (
          objectProperties.hasOwnProperty('rayCastDistance') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.rayCastDistance)
        ) {
          newHadron.rdt = objectProperties.rayCastDistance;
        }
        // spells
        if (objectProperties.hasOwnProperty('spell')) {
          newHadron.spl = objectProperties.spell;
        }
        // Items
        if (objectProperties.hasOwnProperty('HideAfterTaken')) {
          newHadron.hid = objectProperties.HideAfterTaken;
        }
        if (objectProperties.hasOwnProperty('Perpetual')) {
          newHadron.pep = objectProperties.Perpetual;
        }
        if (objectProperties.hasOwnProperty('canDrop')) {
          newHadron.cdp = objectProperties.canDrop;
        }
        if (objectProperties.hasOwnProperty('canDelete')) {
          newHadron.cdl = objectProperties.canDelete;
        }
        currentSceneNPCs.set(objectProperties.id, newHadron);
        // All we do here is tell the server that the scene we entered has NPC hadrons in it.
        // The server will decide if they already exist or not,
        // and add them, and assign a controller if needed.
        sendDataToServer.createHadron(newHadron);
      }
    }
  });
}

export default addQuarksFromMap;
