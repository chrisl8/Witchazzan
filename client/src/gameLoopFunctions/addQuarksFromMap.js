import convertTileMapPropertyArrayToObject from '../utilities/convertTileMapPropertyArrayToObject.js';
import currentSceneQuarks from '../objects/currentSceneQuarks.js';
import sendDataToServer from '../sendDataToServer.js';

// Quarks are the fundamental constituents of hadrons and interact via the Small Hadron Cooperator (Server).
// Each Quark will generate a Hadron under the right circumstances.
// This section finds the Objects in the Tilemap that trigger features
function addQuarksFromMap(map, sceneName) {
  // Useful info on how this works:
  // https://www.html5gamedevs.com/topic/37978-overlapping-on-a-tilemap-object-layer/?do=findComment&comment=216742
  // https://github.com/B3L7/phaser3-tilemap-pack/blob/master/src/scenes/Level.js
  const objects = map.getObjectLayer('Objects');
  objects.objects.forEach((object) => {
    const objectProperties = convertTileMapPropertyArrayToObject(object);
    if (objectProperties.Type === 'Quark') {
      // "Quarks" are objects in the tilemap that generate hadrons.
      if (objectProperties.id && !currentSceneQuarks.has(objectProperties.id)) {
        const newHadron = {
          id: objectProperties.id,
          own: objectProperties.id, // NPCs own themselves just as players do.
          x: object.x,
          y: object.y,
          spr: objectProperties.sprite,
          typ: 'quark',
          flv: objectProperties.Flavor,
          sub: objectProperties.subType,
          scn: sceneName,
          dod: objectProperties.dod,
          pod: objectProperties.pod,
          tcw: true,
          hlt: 100,
          mxh: 100,
          dps: 1,
          ris: objectProperties.respawnInSeconds,
          ani: 'stationary',
        };
        if (objectProperties.Flavor === 'NPC') {
          newHadron.stc = sceneName;
          newHadron.stx = object.x;
          newHadron.sty = object.y;
        }
        if (objectProperties.hasOwnProperty('initialSpriteDirection')) {
          newHadron.dir = objectProperties.initialSpriteDirection;
          if (objectProperties.Flavor === 'NPC') {
            newHadron.sdi = objectProperties.initialSpriteDirection;
          }
        }
        if (objectProperties.hasOwnProperty('initialAnimationState')) {
          newHadron.ani = objectProperties.initialAnimationState;
        }
        if (objectProperties.hasOwnProperty('particle')) {
          newHadron.pcl = objectProperties.particle;
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
          objectProperties.hasOwnProperty('damageOnContact') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.damageOnContact)
        ) {
          newHadron.dpc = Number(objectProperties.damageOnContact);
        }
        if (
          objectProperties.hasOwnProperty('randomizeVelocity') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.randomizeVelocity)
        ) {
          newHadron.rvl = Number(objectProperties.randomizeVelocity);
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
        if (
          objectProperties.hasOwnProperty('nearbyObjectDetection') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.nearbyObjectDetection)
        ) {
          newHadron.nbc = objectProperties.nearbyObjectDetection;
        }
        if (objectProperties.hasOwnProperty('faceTarget')) {
          newHadron.fac = objectProperties.faceTarget;
        }
        if (objectProperties.hasOwnProperty('followTarget')) {
          newHadron.fol = objectProperties.followTarget;
        }
        if (objectProperties.hasOwnProperty('Text')) {
          newHadron.txt = objectProperties.Text;
        }
        if (
          objectProperties.hasOwnProperty('velocity') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.velocity)
        ) {
          newHadron.vel = objectProperties.velocity;
        }
        if (
          objectProperties.hasOwnProperty('rotationSpeed') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.rotationSpeed)
        ) {
          newHadron.rsp = objectProperties.rotationSpeed;
        }
        // spells
        if (objectProperties.hasOwnProperty('spell')) {
          newHadron.spl = objectProperties.spell;
        }
        // Items
        if (objectProperties.hasOwnProperty('Function')) {
          newHadron.fnc = objectProperties.Function;
        }
        if (
          objectProperties.hasOwnProperty('Flavor') &&
          objectProperties.Flavor === 'Item'
        ) {
          // Item quarks creat invisible "spawner" hadrons that spawn items based on functions.
          newHadron.off = true;
        }
        if (objectProperties.hasOwnProperty('iin')) {
          newHadron.iin = objectProperties.iin;
        }
        if (
          objectProperties.hasOwnProperty('travel') &&
          objectProperties.travel
        ) {
          newHadron.tvl = true;
        }
        if (
          objectProperties.hasOwnProperty('uniqueId') &&
          objectProperties.uniqueId
        ) {
          newHadron.uid = objectProperties.uniqueId;
        }
        if (objectProperties.hasOwnProperty('followPath')) {
          newHadron.fph = objectProperties.followPath;
        }
        if (objectProperties.hasOwnProperty('navigatePath')) {
          newHadron.nph = objectProperties.navigatePath;
        }
        if (
          objectProperties.hasOwnProperty('initialPathWaypoint') &&
          // eslint-disable-next-line no-restricted-globals
          !isNaN(objectProperties.initialPathWaypoint)
        ) {
          newHadron.cpd = objectProperties.initialPathWaypoint;
          newHadron.ipd = objectProperties.initialPathWaypoint;
        }
        currentSceneQuarks.set(objectProperties.id, newHadron);
        // All we do here is tell the server that the scene we entered has NPC hadrons in it.
        // The server will decide if they already exist or not,
        // and add them, and assign a controller if needed.
        sendDataToServer.createHadron(newHadron);
      }
    }
  });
}

export default addQuarksFromMap;
