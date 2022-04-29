/* globals window:true */
import playerObject from '../objects/playerObject.js';

function setCameraZoom(gameSize, sceneTileSet) {
  if (!playerObject.disableCameraZoom) {
    const widthScaleFactor = window.innerWidth / gameSize.width;
    const heightScaleFactor = window.innerHeight / gameSize.height;
    const cameraScaleFactor =
      widthScaleFactor < heightScaleFactor // > - Zoomed < - fit screen
        ? widthScaleFactor
        : heightScaleFactor;
    playerObject.cameraScaleFactor = cameraScaleFactor;
    // Use camera zoom to fill screen.
    this.cameras.main.setZoom(cameraScaleFactor);
    const gameWidth = Math.trunc(gameSize.width * cameraScaleFactor);
    const gameHeight = Math.trunc(gameSize.height * cameraScaleFactor);

    // Make sure the canvas is big enough to show the camera.
    this.scale.setGameSize(gameWidth, gameHeight);

    this.cameras.main
      .setBounds(
        sceneTileSet.tileWidth,
        sceneTileSet.tileHeight,
        gameSize.width,
        gameSize.height,
      )
      .setOrigin(0.5, 0.5);
  }
  playerObject.cameraOffset = {
    x: this.cameras.main.worldView.x,
    y: this.cameras.main.worldView.y,
  };
}

export default setCameraZoom;
