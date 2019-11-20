import partyWizardSpriteSheet from '../assets/spriteSheets/party-wizard-sprite-sheet.png';
import gloobScarymanSpriteSheet from '../assets/spriteSheets/gloob-scaryman.png';
import flamingGoose from '../assets/spriteSheets/flamingGoose.png';

const spriteSheetList = [
  {
    type: 'player',
    name: 'partyWizard',
    file: partyWizardSpriteSheet,
    frameWidth: 101,
    frameHeight: 128,
    endFrame: 5,
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
];

export default spriteSheetList;
