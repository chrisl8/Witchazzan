/* globals localStorage:true */
/* globals document:true */
import playerObject from '../objects/playerObject';
import wait from '../utilities/wait';

/*
 * This grabs data from local storage,
 * displays the initial load/help screen if needed,
 * and deals with input from that screen,
 * including putting it into local storage.
 *
 * The TEXT ITSELF for the Intro Screen is in ../index.html
 *
 * NOTE: That this function has a wait loop at the end,
 * to stall the user at the help screen if they
 * need to input information.
 */

// eslint-disable-next-line func-names
async function introScreenAndPreGameSetup() {
  let existingHelpTextVersion;
  const checkForEnterKeyOnNameInputBox = (event) => {
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
        checkForEnterKeyOnNameInputBox,
      );
      localStorage.setItem('playerName', playerNameInputValue);
      playerObject.playerName = playerNameInputValue;
      localStorage.setItem(
        'helpTextVersion',
        playerObject.helpTextVersion.toString(),
      );
      existingHelpTextVersion = playerObject.helpTextVersion;
    }
  };

  // Check local storage for Player Sprite
  const existingPlayerSprite = localStorage.getItem('playerSprite');
  if (existingPlayerSprite) {
    document.getElementById(existingPlayerSprite).checked = true;
  }

  // Check local storage for disableCameraZoom
  let disableCameraZoom = localStorage.getItem('disableCameraZoom');
  if (disableCameraZoom === 'true') {
    document.getElementById('camera_zoom_off').checked = true;
  }

  // Handle spell settings:
  // Populate Intro Page with Spell selection HTML and fill with defaults
  let spellAssignmentInnerHTML = '';
  for (const [key] of Object.entries(playerObject.spellAssignments)) {
    // Check local storage to see if there is a stored value
    const spellSettingFromLocalStorage = localStorage.getItem(
      `key${key}SpellAssignment`,
    );
    if (spellSettingFromLocalStorage !== null) {
      playerObject.spellAssignments[key] = Number(spellSettingFromLocalStorage);
    }

    // Create Inner HTML for Spell selection
    spellAssignmentInnerHTML += `<label for="spell_${key}_selector">${key}</label> - <select id="spell_${key}_selector" class="spell-selector">`;
    // eslint-disable-next-line no-loop-func
    for (let i = 0; i < playerObject.spellOptions.length; i++) {
      if (playerObject.spellAssignments[key] === i) {
        spellAssignmentInnerHTML += `<option value="${i}" selected>${playerObject.spellOptions[i]}</option>`;
      } else {
        spellAssignmentInnerHTML += `<option value="${i}">${playerObject.spellOptions[i]}</option>`;
      }
    }
    spellAssignmentInnerHTML += `</select><br />`;
  }
  // Push new HTML code into DOM
  document.getElementById(
    'spell-assignment',
  ).innerHTML = spellAssignmentInnerHTML;

  // Check if player died on last exit
  const playerDroppedFromGamePieceList = localStorage.getItem(
    'playerDroppedFromGamePieceList',
  );
  if (playerDroppedFromGamePieceList === 'true') {
    document.getElementById('you_died').hidden = false;
    localStorage.removeItem('playerDroppedFromGamePieceList');
  }

  if (!playerObject.playerName) {
    // Check local storage to see if we already have a name.
    const existingPlayerName = localStorage.getItem('playerName');
    existingHelpTextVersion = Number(localStorage.getItem('helpTextVersion'));
    if (
      !existingPlayerName ||
      !existingHelpTextVersion ||
      existingHelpTextVersion < playerObject.helpTextVersion
    ) {
      playerObject.domElements.playerNameSubmitButton.addEventListener(
        'click',
        addPlayerNameToPlayerObject,
      );
      playerObject.domElements.playerNameInputBox.addEventListener(
        'keyup',
        checkForEnterKeyOnNameInputBox,
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
      existingHelpTextVersion < playerObject.helpTextVersion
    ) {
      // eslint-disable-next-line no-await-in-loop
      await wait(1);
    }

    // Settle up disableCameraZoom and set local storage if need be
    disableCameraZoom = document.getElementById('camera_zoom_off').checked;
    if (disableCameraZoom) {
      localStorage.setItem('disableCameraZoom', 'true');
    } else {
      localStorage.removeItem('disableCameraZoom');
    }

    playerObject.disableCameraZoom = disableCameraZoom;

    const spriteName = document.querySelector('input[name="sprite"]:checked')
      .value;
    if (spriteName) {
      localStorage.setItem('playerSprite', spriteName);
      playerObject.spriteName = spriteName;
    }

    // Add all spell selections to local storage,
    // and inject them into the playerObject
    for (const [key] of Object.entries(playerObject.spellAssignments)) {
      const spellSettingFromDOM = document.getElementById(
        `spell_${key}_selector`,
      ).value;
      localStorage.setItem(`key${key}SpellAssignment`, spellSettingFromDOM);
      playerObject.spellAssignments[key] = Number(spellSettingFromDOM);
    }
    // Set the currently active spell to whatever was listed for key 1
    // This also sets the spell for mobile
    playerObject.activeSpellKey = playerObject.spellAssignments['1'];
  }
}

export default introScreenAndPreGameSetup;
