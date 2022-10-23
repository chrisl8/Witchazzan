/* globals localStorage:true */
/* globals document:true */
/* globals window:true */
import playerObject from '../objects/playerObject.js';
import spellAssignments from '../objects/spellAssignments.js';
import isAppleDevice from '../utilities/isAppleDevice.js';
import isMobileBrowser from '../utilities/isMobileBrowser.js';

let apiURL = `${window.location.origin}/api`;
if (window.location.port === '3001') {
  apiURL = `http://${window.location.hostname}:8080/api`;
}

let playerName = '';
let isAdmin = false;
let loginFailure = false;
let loginErrorText = null;
let loggedIn = false;
let loginInProgress = false;
let creatingNewAccount = false;
let sendingAccountCreation = false;
const token = localStorage.getItem('authToken');

const domElements = {
  startGameButton: document.getElementById('start_game_button'),
  loginSubmitButton: document.getElementById('login_button'),
  logOutButton: document.getElementById('logout_button'),
  playerNameInputBox: document.getElementById('player_name_input_box'),
  passwordInputBox: document.getElementById('password_input_box'),
  repeatPasswordInputBox: document.getElementById('repeat_password_input'),
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

  for (const el of document.querySelectorAll('.admin_only_visible'))
    el.style.display = isAdmin ? 'block' : 'none';

  if (playerName) {
    document.getElementById('password_input_box').focus();
  } else {
    domElements.playerNameInputBox.focus();
  }

  if (loggedIn) {
    document.getElementById('start_game_button').focus();
  }

  if (isMobileBrowser) {
    document.getElementById('mobile_controls').hidden = false;

    if (isAppleDevice && window.navigator.standalone !== true) {
      // https://stackoverflow.com/a/34516083/4982408
      document.getElementById('ios_please_use_safari').hidden = false;
    }

    if (
      !isAppleDevice &&
      // standalone
      !window.matchMedia('(display-mode: standalone)').matches
      // https://stackoverflow.com/a/34516083/4982408
    ) {
      document.getElementById('android_add_to_home_screen').hidden = false;
    }
  }

  if (localStorage.getItem('multiple_logins')) {
    localStorage.removeItem('multiple_logins');
    document.getElementById('multiple_logins').hidden = false;
  }
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
        isAdmin = JSON.parse(window.atob(token.split('.')[1])).admin === 1;
      } else if (res.status === 401) {
        localStorage.removeItem('authToken');
        loggedIn = false;
      } else {
        loggedIn = false;
        console.error('Unexpected response from server.');
        console.error(res);
        console.error(res.status);
        console.error(await res.text());
        console.error(await res.json());
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
      isAdmin =
        JSON.parse(window.atob(resultObject.token.split('.')[1])).admin === 1;
    } else if (res.status === 401) {
      loggedIn = false;
      loginFailure = true;
    } else {
      loggedIn = false;
      loginFailure = true;
      console.error('Unexpected response from server.');
      console.error(res);
      console.error(res.status);
      console.error(await res.text());
      console.error(await res.json());
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
  isAdmin = false;
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
  // Immediately make it clear that the button was pushed
  // TODO: Does this have any visible affect?
  // $('body').css('background-color', 'black');
  // document.getElementById('pre_game_div').hidden = true;

  // Save the player name to local storage for use next time
  // in the login box in case the token was wiped.
  // In theory the browser could do this for me?
  localStorage.setItem('playerName', playerName);

  // Update the help text version so it does not force us here next time.
  localStorage.setItem(
    'helpTextVersion',
    playerObject.helpTextVersion.toString(),
  );

  // Settle up logLatency and set local storage if need be
  const logLatency = document.getElementById('log_latency').checked;
  if (logLatency) {
    localStorage.setItem('logLatency', 'true');
  } else {
    localStorage.removeItem('logLatency');
  }

  // Settle up disableSound and set local storage if need be
  const disableSound = document.getElementById('disable_sound').checked;
  if (disableSound) {
    localStorage.setItem('disableSound', 'true');
  } else {
    localStorage.removeItem('disableSound');
  }

  // Settle up enableDebug and set local storage if need be
  const enableDebug = document.getElementById('phaser_debug').checked;
  if (enableDebug) {
    localStorage.setItem('enableDebug', 'true');
  } else {
    localStorage.removeItem('enableDebug');
  }

  // Settle up loadTesting and set local storage if need be
  const loadTesting = document.getElementById('load_testing').checked;
  if (loadTesting) {
    localStorage.setItem('loadTesting', 'true');
  } else {
    localStorage.removeItem('loadTesting');
  }

  // Add all spell selections to local storage for later retrieval
  for (const [, value] of Object.entries(playerObject.spellKeys)) {
    const spellSettingFromDOM = document.getElementById(
      `spell_${value}_selector`,
    ).value;
    localStorage.setItem(`key${value}SpellAssignment`, spellSettingFromDOM);
  }

  window.location.href = '/';
};

/*
 * This grabs data from local storage,
 * displays the initial load/help screen if needed,
 * and deals with input from that screen,
 * including putting it into local storage.
 *
 * The TEXT ITSELF for the Intro Screen is in ../sign-in.html
 *
 */

(async () => {
  // Check local storage for logLatency
  const logLatency = localStorage.getItem('logLatency');
  if (logLatency === 'true') {
    document.getElementById('log_latency').checked = true;
  }

  // Check local storage for disableSound
  const disableSound = localStorage.getItem('disableSound');
  if (disableSound === 'true') {
    document.getElementById('disable_sound').checked = true;
  }

  // Check local storage for enableDebug
  const enableDebug = localStorage.getItem('enableDebug');
  if (enableDebug === 'true') {
    document.getElementById('phaser_debug').checked = true;
  }

  // Check local storage for loadTesting
  const loadTesting = localStorage.getItem('loadTesting');
  if (loadTesting === 'true') {
    document.getElementById('load_testing').checked = true;
  }

  // HANDLE SPELL SETTINGS
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
  // Push new spell settings HTML code into DOM
  document.getElementById('spell-assignment').innerHTML =
    spellAssignmentInnerHTML;

  // The helpTextVersion is a way to force all users
  // back to the intro screen on next connection.
  // It is also the method that the 'p' key uses to get users here.
  const existingHelpTextVersion = Number(
    localStorage.getItem('helpTextVersion'),
  );

  if (
    !token ||
    !existingHelpTextVersion ||
    existingHelpTextVersion < playerObject.helpTextVersion
  ) {
    // Find out if we are logged in already
    await checkLoggedInStatus();

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

    // Text box event listeners (on Enter key)
    domElements.passwordInputBox.addEventListener('keyup', (event) => {
      // Number 13 is the "Enter" key on the keyboard
      if (event.key === 'Enter') {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        domElements.loginSubmitButton.click();
      }
    });
    domElements.repeatPasswordInputBox.addEventListener('keyup', (event) => {
      // Number 13 is the "Enter" key on the keyboard
      if (event.key === 'Enter') {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        domElements.createAccountButton.click();
      }
    });

    if (playerName) {
      domElements.playerNameInputBox.value = playerName;
    }
    updateDOMElements();
  } else {
    startGameNow();
  }
})();
