import { randomInt } from 'crypto';
import guestUsernameAdjectives from './guestUsernameAdjectives.js';
import guestUsernameNouns from './guestUsernameNouns.js';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';

function generateRandomGuestUsername() {
  return `${capitalizeFirstLetter(
    guestUsernameAdjectives[randomInt(guestUsernameAdjectives.length)],
  )} ${capitalizeFirstLetter(
    guestUsernameNouns[randomInt(guestUsernameNouns.length)],
  )}`;
}

export default generateRandomGuestUsername;
