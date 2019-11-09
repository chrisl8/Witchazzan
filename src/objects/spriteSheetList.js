import partyWizardSpriteSheet from '../assets/spriteSheets/party-wizard-sprite-sheet.png';
import gloobScarymanSpriteSheet from '../assets/spriteSheets/gloob-scaryman.png';

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
];

export default spriteSheetList;
