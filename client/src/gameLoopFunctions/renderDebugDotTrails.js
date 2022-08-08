import playerObject from '../objects/playerObject.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';

function renderDebugDotTrails(hadron, key) {
  if (playerObject.dotTrailsOn) {
    // Use this to track the server location of objects on the screen across time.
    // It is activated with 'o'

    let fillColor = 0x00ff00;
    const width = 5;
    const height = 5;
    if (['laserArrow'].indexOf(hadron.sub) > -1) {
      fillColor = 0xffa500;
    } else if (['quasar'].indexOf(hadron.sub) > -1) {
      fillColor = 0xffa500;
    } else if (['teleball'].indexOf(hadron.sub) > -1) {
      fillColor = 0xffa500;
    } else if (['push'].indexOf(hadron.sub) > -1) {
      fillColor = 0xffa500;
    } else if (key === playerObject.playerId) {
      // it me
      fillColor = 0xffff00;
    } else if (['player'].indexOf(hadron.typ) > -1) {
      // it !me
      fillColor = 0x6a0dad;
    }

    if (!playerObject.dotTrails) {
      playerObject.dotTrails = [];
    }
    const dot = this.add
      .rectangle(hadron.x, hadron.y, width, height, fillColor)
      .setDepth(objectDepthSettings.dotTrails);
    playerObject.dotTrails.push(dot);
  } else if (playerObject.dotTrails && playerObject.dotTrails.length > 0) {
    playerObject.dotTrails.forEach((dot) => {
      dot.destroy();
    });
    playerObject.dotTrails = null;
  }
}

export default renderDebugDotTrails;
