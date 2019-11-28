import partyWizardSpriteSheet from '../assets/spriteSheets/party-wizard-sprite-sheet.png';
import gloobScarymanSpriteSheet from '../assets/spriteSheets/gloob-scaryman.png';
import flamingGoose from '../assets/spriteSheets/flamingGoose.png';
import fireball from '../assets/spriteSheets/fireball.png';

const spriteSheetList = [
  {
    type: 'player',
    name: 'partyWizard',
    file: partyWizardSpriteSheet,
    faces: 'left',
    frameWidth: 101,
    frameHeight: 128,
    endFrame: 5,
    animationFrameRate: 5,
    animations: [
      { keyName: 'walk-left', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'walk-right', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'walk-back', start: 0, end: 3, zeroPad: 3, repeat: -1 },
      { keyName: 'walk-front', start: 0, end: 3, zeroPad: 3, repeat: -1 },
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
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 3,
  },
];

export default spriteSheetList;
