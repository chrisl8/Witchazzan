import flamingGoose from '../assets/spriteSheets/flamingGoose.png';
import laserArrow from '../assets/spriteSheets/LaserArrow2.png';
import quasar from '../assets/spriteSheets/Quasar.png';
import bloomby from '../assets/spriteSheets/bloomby16.png';
import chest from '../assets/spriteSheets/chest.png';
import bones from '../assets/spriteSheets/bones.png';
import RainbowTileOne from '../assets/spriteSheets/RainbowTileOne.png';
import BlackWater from '../assets/spriteSheets/BlackWater.png';
import BlueWater from '../assets/spriteSheets/BlueWater.png';
import BlueWaterFlowingDown from '../assets/spriteSheets/BlueWaterFlowingDown.png';
import BlueWaterNorthShore from '../assets/spriteSheets/BlueWaterNorthShore.png';
import BlueWaterNorthWestShore from '../assets/spriteSheets/BlueWaterNorthWestShore.png';
import BlueWaterWestShore from '../assets/spriteSheets/BlueWaterWestShore.png';
import MountainWallSparkleOne from '../assets/spriteSheets/MountainWallSparkleOne.png';
import MountainWallSparkleTwo from '../assets/spriteSheets/MountainWallSparkleTwo.png';
import GroundSparkleOne from '../assets/spriteSheets/GroundSparkleOne.png';
import writtenPaper from '../assets/spriteSheets/written_paper_no_background.png';
import redTankSingle from '../assets/spriteSheets/redTankSingle.png';
import SkullWink from '../assets/spriteSheets/SkullWink.png';
import Fountain from '../assets/spriteSheets/Fountain.png';
import PurpleRunningRunes from '../assets/spriteSheets/purpleRunningRunes.png';
import ChairTwo from '../assets/spriteSheets/chair2.png';
import TableOne from '../assets/spriteSheets/table1.png';

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
    type: 'other',
    name: 'ChairTwo',
    file: ChairTwo,
    faces: 'right',
    frameWidth: 10,
    frameHeight: 12,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 0,
    animations: [
      { keyName: 'move-left', start: 2, end: 2, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 2, end: 2, zeroPad: 3, repeat: -1 },
      { keyName: 'move-back', start: 1, end: 1, zeroPad: 3, repeat: -1 },
      { keyName: 'move-front', start: 0, end: 0, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 10,
      y: 12,
    },
    displayWidth: 10,
    displayHeight: 12,
  },
  {
    type: 'other',
    name: 'TableOne',
    file: TableOne,
    faces: 'right',
    frameWidth: 16,
    frameHeight: 10,
    physicsSize: {
      x: 16,
      y: 10,
    },
    displayWidth: 16,
    displayHeight: 10,
  },
  {
    type: 'other',
    name: 'quasar',
    file: quasar,
    faces: 'right',
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 20,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 17, zeroPad: 2, repeat: -1 },
    ],
    physicsCircle: {
      radius: 4,
    },
    physicsOffset: {
      x: 5,
      y: 5,
    },
    physicsSize: {
      x: 0,
      y: 0,
    },
    displayWidth: 16,
    displayHeight: 16,
    rotatable: true, // For sprites that should rotate to any direction, instead of just the 4
  },
  // laserArrow
  {
    type: 'other',
    name: 'laserArrow',
    file: laserArrow,
    faces: 'right',
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 20,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 9, zeroPad: 2, repeat: -1 },
    ],
    physicsCircle: {
      radius: 4,
    },
    physicsOffset: {
      x: 5,
      y: 5,
    },
    physicsSize: {
      x: 0,
      y: 0,
    },
    displayWidth: 16,
    displayHeight: 16,
    rotatable: true, // For sprites that should rotate to any direction, instead of just the 4
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
    name: 'Fountain',
    file: Fountain,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 5,
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
    name: 'PurpleRunningRunes',
    file: PurpleRunningRunes,
    frameWidth: 16,
    frameHeight: 16,
    endFrame: -1,
    faces: 'left',
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-stationary', start: 0, end: 15, zeroPad: 3, repeat: -1 },
    ],
    displayWidth: 16,
    displayHeight: 16,
  },
  {
    type: 'other',
    name: 'redTankSingle',
    file: redTankSingle,
    frameWidth: 46,
    frameHeight: 38,
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
    name: 'BlueWaterFlowingDown',
    file: BlueWaterFlowingDown,
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

export default spriteSheetList;
