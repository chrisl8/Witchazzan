import partyWizardSpriteSheet from '../assets/spriteSheets/party-wizard-sprite-sheet.png';
import gloobScarymanSpriteSheet from '../assets/spriteSheets/gloob-scaryman.png';
import flamingGoose from '../assets/spriteSheets/flamingGoose.png';
import fireball from '../assets/spriteSheets/fireball.png';
import teleball from '../assets/spriteSheets/Teleport.png';
import bloomby from '../assets/spriteSheets/bloomby16.png';
import joosh from '../assets/spriteSheets/joosh.png';
import carrot from '../assets/spriteSheets/carrot.png';
import carrot01 from '../assets/spriteSheets/carrot01.png';
import carrot02 from '../assets/spriteSheets/carrot02.png';
import carrot03 from '../assets/spriteSheets/carrot03.png';
import carrot04 from '../assets/spriteSheets/carrot04.png';
import carrot05 from '../assets/spriteSheets/carrot05.png';
import carrot06 from '../assets/spriteSheets/carrot06.png';
import carrot07 from '../assets/spriteSheets/carrot07.png';
import carrot08 from '../assets/spriteSheets/carrot08.png';
import carrot09 from '../assets/spriteSheets/carrot09.png';
import carrot10 from '../assets/spriteSheets/carrot10.png';
import carrot11 from '../assets/spriteSheets/carrot11.png';
import carrot12 from '../assets/spriteSheets/carrot12.png';
import carrot13 from '../assets/spriteSheets/carrot13.png';
import carrot14 from '../assets/spriteSheets/carrot14.png';
import carrot15 from '../assets/spriteSheets/carrot15.png';
import carrot16 from '../assets/spriteSheets/carrot16.png';
import carrot17 from '../assets/spriteSheets/carrot17.png';
import carrot18 from '../assets/spriteSheets/carrot18.png';
import carrot19 from '../assets/spriteSheets/carrot19.png';
import carrot20 from '../assets/spriteSheets/carrot20.png';
import carrot21 from '../assets/spriteSheets/carrot21.png';
import carrot22 from '../assets/spriteSheets/carrot22.png';
import carrot23 from '../assets/spriteSheets/carrot23.png';
import carrot24 from '../assets/spriteSheets/carrot24.png';
import carrot25 from '../assets/spriteSheets/carrot25.png';
import carrot26 from '../assets/spriteSheets/carrot26.png';
import carrot27 from '../assets/spriteSheets/carrot27.png';
import carrot28 from '../assets/spriteSheets/carrot28.png';
import christmasTree from '../assets/spriteSheets/ChristmasTree.png';
import pinkTree from '../assets/spriteSheets/pinkTree.png';
import greenTree from '../assets/spriteSheets/greenTree.png';
import deadTree from '../assets/spriteSheets/deadTree.png';
import chest from '../assets/spriteSheets/chest.png';
import bones from '../assets/spriteSheets/bones.png';
import lilolyon from '../assets/spriteSheets/Lilolyon.png';
import RainbowTileOne from '../assets/spriteSheets/RainbowTileOne.png';
import BlackWater from '../assets/spriteSheets/BlackWater.png';
import BlueWater from '../assets/spriteSheets/BlueWater.png';
import BlueWaterNorthShore from '../assets/spriteSheets/BlueWaterNorthShore.png';
import BlueWaterNorthWestShore from '../assets/spriteSheets/BlueWaterNorthWestShore.png';
import BlueWaterWestShore from '../assets/spriteSheets/BlueWaterWestShore.png';
import MountainWallSparkleOne from '../assets/spriteSheets/MountainWallSparkleOne.png';
import MountainWallSparkleTwo from '../assets/spriteSheets/MountainWallSparkleTwo.png';
import GroundSparkleOne from '../assets/spriteSheets/GroundSparkleOne.png';
import writtenPaper from '../assets/spriteSheets/written_paper_no_background.png';
import redTankSingleFrame from '../assets/spriteSheets/redTankSingle.png';
import SkullWink from '../assets/spriteSheets/SkullWink.png';

// Player bloomby has the comments in it, see it for help and examples.
// Note that you if you have a -move-stationary animation on a sprite,
// you do NOT need the other four. The goose has all five because it is a
// fallback default.
// You'd only want all 5 if your sprite really has 4 directions AND a separate stationary animation.

const spriteSheetList = [
  {
    type: 'player',
    name: 'bloomby',
    file: bloomby,
    faces: 'right',
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 10,
    animations: [
      { keyName: 'move-left', start: 12, end: 14, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 12, end: 14, zeroPad: 3, repeat: -1 },
      { keyName: 'move-back', start: 6, end: 11, zeroPad: 3, repeat: -1 },
      { keyName: 'move-front', start: 0, end: 5, zeroPad: 3, repeat: -1 },
    ],
    // physicsSize maps to sprite.setSize
    // physicsOffset maps to sprite.setOffset
    // If your Sprite has whitespace or just bits that can overlap, use
    // setSize (physicsSize) to make the physics object smaller than the sprite.
    // You can use the setSize (physicsSize) and setOffset to allow the character to overlap the
    // collision blocks slightly. This often makes the most sense for the head to overlap a bit so that "background" blocks (above player) seem more "background"
    // Also use the setSize (physicsSize) to allow the character to fit in the spaces it should, even if the sprite is too big for them.
    // Set physicsSize to 0 to have size === the sprite size.
    physicsSize: {
      // Remember where this starts if you muck with the offset below.
      // If you are having trouble, turn on the debugging on the intro/help screen.
      // This is RELATIVE TO SPRITE SIZE and then gets scaled, so the same numbers on two different
      // sized sprites will not produce the same results!
      // Using a multiplier can help keep it consistent between different sprites,
      // but remember different size sprites will still end up with different end results after multiplication.
      x: 12, // "Width" direction
      y: 14, // "Height" direction
    },
    // DELETE or COMMENT OUT the entire physicsOffset to ignore it and default to object center.
    // physicsOffset: {
    //   x: 25, // left/right aka in relation to width
    //   y: 25,
    // },
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'player',
    name: 'joosh',
    file: joosh,
    faces: 'right',
    frameWidth: 46,
    frameHeight: 54,
    endFrame: -1,
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-left', start: 0, end: 1, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 0, end: 1, zeroPad: 3, repeat: -1 },
      { keyName: 'move-front', start: 2, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-back', start: 4, end: 5, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 44,
      y: 52,
    },
    displayWidth: (53 / 4) * 0.8,
    displayHeight: (63 / 4) * 0.8,
  },
  {
    type: 'player',
    name: 'partyWizard',
    file: partyWizardSpriteSheet,
    faces: 'left',
    frameWidth: 101,
    frameHeight: 128,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-left', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-back', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-front', start: 0, end: 3, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 101 * 0.8,
      y: 128 * 0.8,
    },
    physicsOffset: {
      x: 12,
      y: 12,
    },
    displayWidth: 12,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'herbivore',
    file: lilolyon,
    faces: 'left',
    frameWidth: 15,
    frameHeight: 15,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 7,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 1, zeroPad: 3, repeat: -1 },
      { keyName: 'move-left', start: 10, end: 13, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 10, end: 13, zeroPad: 3, repeat: -1 },
      { keyName: 'move-back', start: 8, end: 9, zeroPad: 3, repeat: -1 },
      { keyName: 'move-front', start: 6, end: 7, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 53 * 0.8, // "Width" direction
      y: 63 * 0.8, // "Height" direction
    },
    displayWidth: 53 / 4,
    displayHeight: 63 / 4,
  },
  {
    type: 'other',
    name: 'gloobScaryman',
    file: gloobScarymanSpriteSheet,
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 2,
    faces: 'right',
    animationFrameRate: 2,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 1, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 64 * 0.8,
      y: 64 * 0.8,
    },
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'fireball',
    file: fireball,
    faces: 'right',
    frameWidth: 64,
    frameHeight: 64,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 2, zeroPad: 2, repeat: -1 },
    ],
    physicsCircle: {
      radius: 12,
    },
    physicsSize: {
      x: 16,
      y: 16,
    },
    displayWidth: 16,
    displayHeight: 16,
    rotatable: true, // For sprites that should rotate to any direction, instead of just the 4
  },
  {
    type: 'other',
    name: 'teleball',
    file: teleball,
    faces: 'right',
    frameWidth: 64,
    frameHeight: 64,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 2, zeroPad: 2, repeat: -1 },
    ],
    physicsCircle: {
      radius: 12,
    },
    physicsSize: {
      x: 16,
      y: 16,
    },
    displayWidth: 16,
    displayHeight: 16,
    rotatable: true, // For sprites that should rotate to any direction, instead of just the 4
  },
  {
    type: 'other',
    name: 'carrot',
    file: carrot,
    frameWidth: 37,
    frameHeight: 56,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 2,
    animations: [
      { keyName: 'move-stationary', start: 0, end: -1, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 16,
      y: 16,
    },
    displayWidth: 37 * 0.45,
    displayHeight: 56 * 0.45,
  },
  {
    type: 'other',
    name: 'chestFront',
    file: chest,
    frameWidth: 46,
    frameHeight: 43,
    endFrame: 3,
    faces: 'left',
    animationFrameRate: 2,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 2, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 46 * 0.8,
      y: 43 * 0.8,
    },
    displayWidth: 46 * 0.8,
    displayHeight: 43 * 0.8,
  },
  {
    type: 'other',
    name: 'christmasTree',
    file: christmasTree,
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 1,
    physicsSize: {
      x: 64,
      y: 64,
    },
    displayWidth: 32,
    displayHeight: 32,
  },
  {
    type: 'other',
    name: 'pinkTree',
    file: pinkTree,
    frameWidth: 39,
    frameHeight: 49,
    endFrame: 1,
    physicsSize: {
      x: 39,
      y: 49,
    },
    displayWidth: 20,
    displayHeight: 25,
  },
  {
    type: 'other',
    name: 'greenTree',
    file: greenTree,
    frameWidth: 43,
    frameHeight: 38,
    endFrame: 1,
    physicsSize: {
      x: 43,
      y: 38,
    },
    displayWidth: 21,
    displayHeight: 17,
  },
  {
    type: 'other',
    name: 'deadTree',
    file: deadTree,
    frameWidth: 27,
    frameHeight: 30,
    endFrame: 1,
    physicsSize: {
      x: 27,
      y: 30,
    },
    displayWidth: 13,
    displayHeight: 15,
  },
  {
    type: 'other',
    name: 'corpse',
    file: bones,
    frameWidth: 53,
    frameHeight: 33,
    endFrame: 1,
    physicsSize: {
      x: 53,
      y: 33,
    },
    displayWidth: 53 * 0.3,
    displayHeight: 33 * 0.3,
  },
  {
    type: 'other',
    name: 'RainbowTileOne',
    file: RainbowTileOne,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 1,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 7, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 50,
      y: 50,
    },
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'writtenPaper',
    file: writtenPaper,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 2,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 10, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 16,
      y: 16,
    },
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'redTankSingleFrame',
    file: redTankSingleFrame,
    frameWidth: 38,
    frameHeight: 46,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 0,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 0, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 24,
      y: 24,
    },
    displayWidth: 16,
    displayHeight: 16,
    rotatable: true,
  },
  {
    type: 'other',
    name: 'BlackWater',
    file: BlackWater,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 10,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 7, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 50,
      y: 50,
    },
    physicsOffset: {
      x: 22,
      y: 35,
    },
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'SkullWink',
    file: SkullWink,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 8,
    animations: [
      {
        keyName: 'move-stationary',
        start: 0,
        end: 3,
        zeroPad: 3,
        repeat: -1,
        repeatDelay: 10000,
      },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'BlueWater',
    file: BlueWater,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 7,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 7, zeroPad: 3, repeat: -1 },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'BlueWaterNorthShore',
    file: BlueWaterNorthShore,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 7,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 15, zeroPad: 3, repeat: -1 },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'BlueWaterNorthWestShore',
    file: BlueWaterNorthWestShore,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 7,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 15, zeroPad: 3, repeat: -1 },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'BlueWaterWestShore',
    file: BlueWaterWestShore,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 7,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 15, zeroPad: 3, repeat: -1 },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'MountainWallSparkleOne',
    file: MountainWallSparkleOne,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 1,
    animations: [
      {
        keyName: 'move-stationary',
        start: 0,
        end: 4,
        zeroPad: 3,
        repeat: -1,
        repeatDelay: 500,
      },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'MountainWallSparkleTwo',
    file: MountainWallSparkleTwo,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 8,
    animations: [
      {
        keyName: 'move-stationary',
        start: 0,
        end: 8,
        zeroPad: 3,
        repeat: -1,
        repeatDelay: 10000,
      },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'GroundSparkleOne',
    file: GroundSparkleOne,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 1,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 5, zeroPad: 3, repeat: -1 },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    // Flaming Goose is the default sprite used whenever a requested sprite cannot be found,
    // so it is set up to fill a lot of roles, but also expected to never look great.
    type: 'other',
    name: 'flamingGoose',
    file: flamingGoose,
    frameWidth: 90,
    frameHeight: 90,
    endFrame: 4,
    faces: 'left',
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-left', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-back', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'move-front', start: 0, end: 3, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 50,
      y: 50,
    },
    physicsOffset: {
      x: 22,
      y: 35,
    },
    displayWidth: 16,
    displayHeight: 16,
  },
];

const carrotList = [
  carrot01,
  carrot02,
  carrot03,
  carrot04,
  carrot05,
  carrot06,
  carrot07,
  carrot08,
  carrot09,
  carrot10,
  carrot11,
  carrot12,
  carrot13,
  carrot14,
  carrot15,
  carrot16,
  carrot17,
  carrot18,
  carrot19,
  carrot20,
  carrot21,
  carrot22,
  carrot23,
  carrot24,
  carrot25,
  carrot26,
  carrot27,
  carrot28,
];
let carrotEntry = 0;

carrotList.forEach((thisCarrot) => {
  carrotEntry++;
  const carrotName = `carrot${carrotEntry < 10 ? 0 : ''}${carrotEntry}`;
  // console.log(
  //   `import ${carrotName} from '../assets/spriteSheets/${carrotName}.png';`,
  // );
  spriteSheetList.push({
    type: 'other',
    name: `${carrotName}`,
    file: thisCarrot,
    frameWidth: 37,
    frameHeight: 56,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 2,
    animations: [
      { keyName: 'move-stationary', start: 0, end: -1, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 16,
      y: 16,
    },
    displayWidth: 37 * 0.45,
    displayHeight: 56 * 0.45,
  });
});

export default spriteSheetList;
