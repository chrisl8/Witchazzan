import playerObject from '../objects/playerObject.js';

function debugLog(text) {
  if (playerObject.enableDebug) {
    console.log(text);
  }
}

export default debugLog;
