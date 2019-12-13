import partyWizardSpriteSheet from '../assets/spriteSheets/party-wizard-sprite-sheet.png';
import gloobScarymanSpriteSheet from '../assets/spriteSheets/gloob-scaryman.png';
import flamingGoose from '../assets/spriteSheets/flamingGoose.png';
import fireball from '../assets/spriteSheets/fireball.png';
import bloomby from '../assets/spriteSheets/bloomby.png';

const spriteSheetList = [
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
  },
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
  },
  {
    type: 'other',
    name: 'gloobScaryman',
    file: gloobScarymanSpriteSheet,
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 2,
  },
  {
    type: 'other',
    name: 'flamingGoose',
    file: flamingGoose,
    frameWidth: 90,
    frameHeight: 90,
    endFrame: 4,
  },
  {
    type: 'other',
    name: 'fireball',
    file: fireball,
    faces: 'right',
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 3,
  },
];

export default spriteSheetList;
