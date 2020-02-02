/* globals localStorage:true */
// https://what-problem-does-it-solve.com/webpack/css.html
import './css/styles.css';

/* globals document:true */
import playerObject from './objects/playerObject';
import startGame from './startGame';
import wait from './utilities/wait';

// Increment this to force players to see the Instructions again.
const helpTextVersion = 7;
let existingHelpTextVersion;

// eslint-disable-next-line func-names
(async function() {
  const checkForEnterKey = (event) => {
    event.preventDefault();
    if (event.key === 'Enter') {
      // eslint-disable-next-line no-use-before-define
      addPlayerNameToPlayerObject();
    }
  };
  const addPlayerNameToPlayerObject = () => {
    document.getElementById('loading_text').hidden = false;
    const playerNameInputValue =
      playerObject.domElements.playerNameInputBox.value;
    if (playerNameInputValue) {
      document.getElementById('pre_game_div').hidden = true;
      playerObject.domElements.playerNameSubmitButton.removeEventListener(
        'click',
        addPlayerNameToPlayerObject,
      );
      playerObject.domElements.playerNameInputBox.removeEventListener(
        'keyup',
        checkForEnterKey,
      );
      localStorage.setItem('playerName', playerNameInputValue);
      playerObject.playerName = playerNameInputValue;
      localStorage.setItem('helpTextVersion', helpTextVersion.toString());
      existingHelpTextVersion = helpTextVersion;
    }
  };
  if (!playerObject.playerName) {
    // Check local storage to see if we already have a name.
    const existingPlayerName = localStorage.getItem('playerName');
    existingHelpTextVersion = Number(localStorage.getItem('helpTextVersion'));
    if (
      !existingPlayerName ||
      !existingHelpTextVersion ||
      existingHelpTextVersion < helpTextVersion
    ) {
      playerObject.domElements.playerNameSubmitButton.addEventListener(
        'click',
        addPlayerNameToPlayerObject,
      );
      playerObject.domElements.playerNameInputBox.addEventListener(
        'keyup',
        checkForEnterKey,
      );
      document.getElementById('loading_text').hidden = true;
      document.getElementById('pre_game_div').hidden = false;
      if (existingPlayerName) {
        playerObject.domElements.playerNameInputBox.value = existingPlayerName;
      }
      playerObject.domElements.playerNameInputBox.focus();
    } else {
      playerObject.playerName = existingPlayerName;
    }

    while (
      !playerObject.playerName ||
      !existingHelpTextVersion ||
      existingHelpTextVersion < helpTextVersion
    ) {
      // eslint-disable-next-line no-await-in-loop
      await wait(1);
    }
  }

  // Set viewport requirements for game, such as no scrolling
  const metaTag = document.createElement('meta');
  metaTag.name = 'viewport';
  metaTag.content =
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(metaTag);
  document.getElementsByTagName('body')[0].style.overflow = 'hidden';

  playerObject.disableCameraZoom = document.getElementById(
    'camera_zoom_off',
  ).checked;

  await startGame({
    phaserDebug: document.getElementById('phaser_debug').checked,
  });
})();
