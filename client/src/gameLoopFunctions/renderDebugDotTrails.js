import Phaser from 'phaser';
import playerObject from '../objects/playerObject.js';
import objectDepthSettings from '../objects/objectDepthSettings.js';

function renderDebugDotTrails(hadron, key, scene) {
  if (playerObject.dotTrailsOn) {
    // Use this to track the server location of objects on the screen across time.
    // It is activated with 'o'
    // Render Texture
    // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.RenderTexture.html
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/rendertexture/
    // Rectangles:
    // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Rectangle.html

    // NOTE: If you are getting the error:
    //        Uncaught TypeError: Cannot set properties of null (setting '4')
    // when you try to teleport with dot trails on, this will fix it, BUT
    // the cause is that you are running this after a scene was closed,
    // so try to sort out why you have your teleports out of order before
    // engaging this code.
    // if (
    //   playerObject.dotTrailRenderTexture &&
    //   !playerObject.dotTrailRenderTexture.scene
    // ) {
    //   playerObject.dotTrailRenderTexture.destroy();
    //   playerObject.dotTrailRenderTexture = null;
    // }

    if (!playerObject.dotTrailRenderTexture) {
      playerObject.dotTrailRenderTexture = scene.add.renderTexture(
        0,
        0,
        640,
        480,
      );
    }
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
    playerObject.dotTrailRenderTexture.draw(
      new Phaser.GameObjects.Rectangle(
        scene,
        hadron.x,
        hadron.y,
        width,
        height,
        fillColor,
        1,
      )
        .setOrigin(0.5, 0.5)
        .setDepth(objectDepthSettings.dotTrails),
    );
    // this.add
    //   .rectangle(hadron.x, hadron.y, 1, 1, 0xff0000, 1)
    //   .setOrigin(0, 0);
  } else if (playerObject.dotTrailRenderTexture) {
    playerObject.dotTrailRenderTexture.destroy();
    playerObject.dotTrailRenderTexture = null;
  }
}

export default renderDebugDotTrails;
