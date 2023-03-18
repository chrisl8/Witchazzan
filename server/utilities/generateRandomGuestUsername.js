import guestUsernameAdjectives from './guestUsernameAdjectives.js';
import guestUsernameNouns from './guestUsernameNouns.js';
import makeRandomNumber from './makeRandomNumber.js';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';

function generateRandomGuestUsername() {
  return `${capitalizeFirstLetter(
    guestUsernameAdjectives[
      makeRandomNumber.between(0, guestUsernameAdjectives.length - 1)
    ],
  )} ${capitalizeFirstLetter(
    guestUsernameNouns[
      makeRandomNumber.between(0, guestUsernameNouns.length - 1)
    ],
  )}`;
}

export default generateRandomGuestUsername;
