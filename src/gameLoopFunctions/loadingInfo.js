import playerObject from '../objects/playerObject.js';

function loadingInfo() {
  // Loading Progress Bar code copied from https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/
  const width = this.cameras.main.width;
  const height = this.cameras.main.height;

  const progressBar = this.add.graphics();
  const progressBox = this.add.graphics();
  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(width / 2 - 320 / 2, height / 2 - 50 / 2, 320, 50);

  if (playerObject.disconnectReason) {
    const disconnectReasonText = this.make.text({
      x: width / 2,
      y: height / 4,
      text: playerObject.disconnectReason,
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    disconnectReasonText.setOrigin(0.5, 0.5);
  }
  const loadingText = this.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: 'Loading...',
    style: {
      font: '20px monospace',
      fill: '#ffffff',
    },
  });
  loadingText.setOrigin(0.5, 0.5);

  const percentText = this.make.text({
    x: width / 2,
    y: height / 2,
    text: '0%',
    style: {
      font: '18px monospace',
      fill: '#ffffff',
    },
  });
  percentText.setOrigin(0.5, 0.5);

  const assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 50,
    text: '',
    style: {
      font: '18px monospace',
      fill: '#ffffff',
    },
  });
  assetText.setOrigin(0.5, 0.5);

  this.load.on('progress', (value) => {
    percentText.setText(`${parseInt(`${value * 100}`, 10)}%`);
    progressBar.clear();
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(
      width / 2 - 300 / 2,
      height / 2 - 30 / 2,
      300 * value,
      30,
    );
  });

  this.load.on('fileprogress', (file) => {
    assetText.setText(`Loading asset: ${file.key}`);
  });

  // We do not need to destroy anything here because we always jump to another scene when done,
  // but the code is left here as an example
  // this.load.on('complete', function () {
  //   progressBar.destroy();
  //   progressBox.destroy();
  //   loadingText.destroy();
  //   percentText.destroy();
  //   assetText.destroy();
  // });

  // Just left here as an example
  // this.load.image('logo', 'zenvalogo.png');
  // for (var i = 0; i < 5000; i++) {
  //   this.load.image('logo' + i, 'zenvalogo.png');
  // }
}

export default loadingInfo;
