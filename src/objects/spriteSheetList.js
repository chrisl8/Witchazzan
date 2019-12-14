import partyWizardSpriteSheet from '../assets/spriteSheets/party-wizard-sprite-sheet.png';
import gloobScarymanSpriteSheet from '../assets/spriteSheets/gloob-scaryman.png';
import flamingGoose from '../assets/spriteSheets/flamingGoose.png';
import fireball from '../assets/spriteSheets/fireball.png';
import bloomby from '../assets/spriteSheets/bloomby.png';
import carrot from '../assets/spriteSheets/carrot.png';
import christmasTree from '../assets/spriteSheets/ChristmasTree.png';

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
    frameWidth: 53,
    frameHeight: 63,
    endFrame: -1, // How many frames to extract from the sheet. -1 means all
    animationFrameRate: 5,
    animations: [
      { keyName: 'move-left', start: 12, end: 15, zeroPad: 3, repeat: -1 },
      { keyName: 'move-right', start: 12, end: 15, zeroPad: 3, repeat: -1 },
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
      // If you are having trouble, turn on the debugging on the rootGameObject.js file
      // This is RELATIVE TO SPRITE SIZE and then gets scaled, so the same numbers on two different
      // sized sprites will not produce the same results!
      // Using a multiplier can help keep it consistent between different sprites,
      // but remember different size sprites will still end up with different end results after multiplication.
      x: 53 * 0.8, // "Width" direction
      y: 63 * 0.8, // "Height" direction
    },
    // DELETE or COMMENT OUT the entire physicsOffset to ignore it and default to object center.
    // physicsOffset: {
    //   x: 25, // left/right aka in relation to width
    //   y: 25,
    // },
    displayWidth: 53 / 4,
    displayHeight: 63 / 4,
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
      { keyName: 'move-stationary', start: 0, end: 3, zeroPad: 3, repeat: -1 },
    ],
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
    frameWidth: 10,
    frameHeight: 21,
    endFrame: 6,
    faces: 'left',
    animationFrameRate: 2,
    animations: [
      { keyName: 'move-stationary', start: 1, end: 5, zeroPad: 3, repeat: -1 },
    ],
    physicsSize: {
      x: 10 * 0.8,
      y: 21 * 0.8,
    },
    displayWidth: 10 * 0.8,
    displayHeight: 21 * 0.8,
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
