/* globals localStorage:true */
/* globals fetch:true */
/* globals document:true */
/* globals window:true */
import playerObject from '../objects/playerObject.js';
import spellAssignments from '../objects/spellAssignments.js';
import wait from '../../../shared/wait.mjs';

// TODO: Can we just use / instead of adding the actual href path?
let apiURL = `${window.location.href}api`;
if (window.location.hostname === 'localhost') {
  apiURL = `http://localhost:8080/api`;
}

// TODO: Implement all of the apiURL paths used here.

let playerName = '';
let loginFailure = false;
let loginErrorText = null;
let loggedIn = false;
let loginInProgress = false;
let pleaseStartGameNow = false;
let existingHelpTextVersion = null;
let creatingNewAccount = false;
let sendingAccountCreation = false;
const token = localStorage.getItem('authToken');

const domElements = {
  startGameButton: document.getElementById('start_game_button'),
  loginSubmitButton: document.getElementById('login_button'),
  logOutButton: document.getElementById('logout_button'),
  playerNameInputBox: document.getElementById('player_name_input_box'),
  passwordInputBox: document.getElementById('password_input_box'),
  createNewAccountButton: document.getElementById('create_new_account_button'),
  createAccountButton: document.getElementById('create_account_button'),
};

function updateDOMElements() {
  document.getElementById('start-game-section').hidden = !loggedIn;
  document.getElementById('login-section').hidden = loggedIn;
  document.getElementById('login_failure').hidden = !loginFailure;
  document.getElementById('login_in_progress').hidden = !loginInProgress;
  document.getElementById('player_name_text').innerText = playerName;

  document.getElementById('login_buttons').hidden =
    creatingNewAccount || loginInProgress;
  document.getElementById('repeat_password_input').hidden = !creatingNewAccount;
  document.getElementById('create_account_button').hidden = !creatingNewAccount;
  document.getElementById('account_creation_in_progress').hidden =
    !sendingAccountCreation;

  document.getElementById('login_error_text_box').hidden = !loginErrorText;
  document.getElementById('login_error_text').innerText = loginErrorText;
}

async function checkLoggedInStatus() {
  if (token) {
    try {
      const res = await fetch(`${apiURL}/auth`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      });
      if (res.status === 200) {
        loggedIn = true;
        // NOTE: atob is deprecated in NODE, but NOT in browsers.
        playerName = JSON.parse(window.atob(token.split('.')[1])).name;
      } else if (res.status === 401) {
        localStorage.removeItem('authToken');
        loggedIn = false;
      } else {
        loggedIn = false;
        console.error('Unexpected response from server.');
        console.log(res);
        console.log(res.status);
        console.log(await res.text());
        console.log(await res.json());
      }
    } catch (error) {
      loggedIn = false;
      console.error('Error contacting server:');
      console.error(error);
    }
  } else {
    loggedIn = false;
  }
  updateDOMElements();
}

async function login() {
  loginFailure = false;
  loginInProgress = true;
  updateDOMElements();
  try {
    const res = await fetch(`${apiURL}/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: domElements.playerNameInputBox.value,
        password: domElements.passwordInputBox.value,
      }),
    });
    if (res.status === 200) {
      loggedIn = true;
      const resultObject = await res.json();
      localStorage.setItem('authToken', resultObject.token);
      // NOTE: atob is deprecated in NODE, but NOT in browsers.
      playerName = JSON.parse(
        window.atob(resultObject.token.split('.')[1]),
      ).name;
    } else if (res.status === 401) {
      loggedIn = false;
      loginFailure = true;
    } else {
      loggedIn = false;
      loginFailure = true;
      console.error('Unexpected response from server.');
      console.log(res);
      console.log(res.status);
      console.log(await res.text());
      console.log(await res.json());
    }
  } catch (error) {
    loggedIn = false;
    loginFailure = true;
    console.error('Error contacting server:');
    console.error(error);
  }
  loginInProgress = false;
  updateDOMElements();
}

async function logOut() {
  localStorage.removeItem('authToken');
  loggedIn = false;
  updateDOMElements();
}

function createNewAccount() {
  loginFailure = false;
  loginErrorText = null;
  creatingNewAccount = true;
  updateDOMElements();
}

async function createAccount() {
  loginErrorText = null;
  sendingAccountCreation = false;
  const password = document.getElementById('password_input_box').value;
  const repeatPasword = document.getElementById(
    'repeat_password_input_box',
  ).value;
  if (password !== repeatPasword) {
    loginErrorText = 'Passwords do not match.';
  } else {
    sendingAccountCreation = true;
    updateDOMElements();
    try {
      const res = await fetch(`${apiURL}/sign-up`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: domElements.playerNameInputBox.value,
          password: domElements.passwordInputBox.value,
        }),
      });
      let resultText = await res.text();
      if (resultText.Error) {
        resultText = resultText.Error;
      }
      if (res.status === 200) {
        creatingNewAccount = false;
      } else {
        loginErrorText = resultText || 'Unknown error.';
      }
    } catch (error) {
      loginErrorText = 'Error contacting server.';
    }
    sendingAccountCreation = false;
  }
  updateDOMElements();
}

const startGameNow = () => {
  // Show the loading text right away, so user knows it is happening,
  // even though there is up to a 1 second delay due to the loop.
  document.getElementById('loading_text').hidden = false;
  document.getElementById('pre_game_div').hidden = true;

  pleaseStartGameNow = true;
};

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

  // Check local storage for enableSound
  let enableSound = localStorage.getItem('enableSound');
  if (enableSound === 'true') {
    document.getElementById('enable_sound').checked = true;
  }

  // Handle spell settings:
  for (const [key, value] of Object.entries(playerObject.spellKeys)) {
    // Check local storage to see if there is a stored value
    const spellSettingFromLocalStorage = localStorage.getItem(
      `key${value}SpellAssignment`,
    );
    if (
      spellSettingFromLocalStorage !== null &&
      playerObject.spellOptions.indexOf(spellSettingFromLocalStorage) !== -1
    ) {
      spellAssignments.set(value, spellSettingFromLocalStorage);
    } else if (playerObject.spellOptions[key]) {
      // Otherwise fill them in with the default value,
      // but only assign defaults as if they exist.
      spellAssignments.set(value, playerObject.spellOptions[key]);
    }
  }
  // Populate Intro Page with Spell selection HTML and fill with defaults
  let spellAssignmentInnerHTML = '';
  for (const [, spellKeyValue] of Object.entries(playerObject.spellKeys)) {
    // Create Inner HTML for Spell selection
    spellAssignmentInnerHTML += `<label for="spell_${spellKeyValue}_selector">${spellKeyValue}</label> - <select id="spell_${spellKeyValue}_selector" class="spell-selector">`;
    // eslint-disable-next-line no-loop-func
    for (const [, spellOptionValue] of Object.entries(
      playerObject.spellOptions,
    )) {
      if (spellAssignments.get(spellKeyValue) === spellOptionValue) {
        spellAssignmentInnerHTML += `<option value="${spellOptionValue}" selected>${spellOptionValue}</option>`;
      } else {
        spellAssignmentInnerHTML += `<option value="${spellOptionValue}">${spellOptionValue}</option>`;
      }
    }
    spellAssignmentInnerHTML += `</select><br />`;
  }
  // Push new HTML code into DOM
  document.getElementById('spell-assignment').innerHTML =
    spellAssignmentInnerHTML;

  // The helpTextVersion is a way to force all users
  // back to the intro screen on next connection.
  // It is also the method that the 'p' key uses to get users here.
  existingHelpTextVersion = Number(localStorage.getItem('helpTextVersion'));

  if (
    !token ||
    !existingHelpTextVersion ||
    existingHelpTextVersion < playerObject.helpTextVersion
  ) {
    // Find out if we are logged in already
    await checkLoggedInStatus();

    document.getElementById('loading_text').hidden = true;
    document.getElementById('pre_game_div').hidden = false;

    // Check local storage to see if we already have a name.
    playerName = localStorage.getItem('playerName');

    // Button event listeners
    domElements.startGameButton.addEventListener('click', startGameNow);
    domElements.loginSubmitButton.addEventListener('click', login);
    domElements.logOutButton.addEventListener('click', logOut);
    domElements.createNewAccountButton.addEventListener(
      'click',
      createNewAccount,
    );
    domElements.createAccountButton.addEventListener('click', createAccount);

    if (playerName) {
      domElements.playerNameInputBox.value = playerName;
    }

    domElements.playerNameInputBox.focus();

    while (!pleaseStartGameNow) {
      // eslint-disable-next-line no-await-in-loop
      await wait(250);
    }

    // Clean up event listeners
    domElements.startGameButton.removeEventListener('click', startGameNow);
    domElements.loginSubmitButton.removeEventListener('click', login);
    domElements.logOutButton.removeEventListener('click', logOut);
    domElements.createNewAccountButton.removeEventListener(
      'click',
      createNewAccount,
    );
    domElements.createAccountButton.removeEventListener('click', createAccount);
  }

  // Save the player name to local storage for use next time
  // in the login box in case the token was wiped.
  // In theory the browser could do this for me?
  localStorage.setItem('playerName', playerName);

  // Update the help text version so it does not force us here next time.
  localStorage.setItem(
    'helpTextVersion',
    playerObject.helpTextVersion.toString(),
  );

  // Settle up disableCameraZoom and set local storage if need be
  disableCameraZoom = document.getElementById('camera_zoom_off').checked;
  if (disableCameraZoom) {
    localStorage.setItem('disableCameraZoom', 'true');
  } else {
    localStorage.removeItem('disableCameraZoom');
  }

  // Settle up enableSound and set local storage if need be
  enableSound = document.getElementById('enable_sound').checked;
  if (enableSound) {
    localStorage.setItem('enableSound', 'true');
  } else {
    localStorage.removeItem('enableSound');
  }

  playerObject.enableSound = enableSound;

  const spriteName = document.querySelector(
    'input[name="sprite"]:checked',
  ).value;
  if (spriteName) {
    localStorage.setItem('playerSprite', spriteName);
    playerObject.spriteName = spriteName;
  }

  // Add all spell selections to local storage for later retrieval
  for (const [, value] of Object.entries(playerObject.spellKeys)) {
    const spellSettingFromDOM = document.getElementById(
      `spell_${value}_selector`,
    ).value;
    spellAssignments.set(value, spellSettingFromDOM);
    localStorage.setItem(`key${value}SpellAssignment`, spellSettingFromDOM);
  }
  // Set active spell to first spell key's assignment.
  playerObject.activeSpell = spellAssignments.get(playerObject.spellKeys[0]);

  // Un-hide joystick input box
  document.getElementById('joystick_container').hidden = false;
}

export default introScreenAndPreGameSetup;
