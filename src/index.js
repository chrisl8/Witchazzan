/* globals localStorage:true */
// https://what-problem-does-it-solve.com/webpack/css.html
import './css/styles.css';

/* globals document:true */
import playerObject from './objects/playerObject';
import startGame from './startGame';
import wait from './utilities/wait';

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
    const playerNameInputValue =
      playerObject.domElements.playerNameInputBox.value;
    if (playerNameInputValue) {
      document.getElementById('player_name_entry_div').hidden = true;
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
    }
  };
  if (!playerObject.playerName) {
    // Check local storage to see if we already have a name.
    const existingPlayerName = localStorage.getItem('playerName');
    if (!existingPlayerName) {
      playerObject.domElements.playerNameSubmitButton.addEventListener(
        'click',
        addPlayerNameToPlayerObject,
      );
      playerObject.domElements.playerNameInputBox.addEventListener(
        'keyup',
        checkForEnterKey,
      );
      document.getElementById('loading_text').hidden = true;
      document.getElementById('player_name_entry_div').hidden = false;
      playerObject.domElements.playerNameInputBox.focus();
    } else {
      playerObject.playerName = existingPlayerName;
    }

    while (!playerObject.playerName) {
      // eslint-disable-next-line no-await-in-loop
      await wait(1);
    }
  }
  await startGame();
})();
