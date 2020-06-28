/* globals localStorage:true */
/* globals fetch:true */
/* globals document:true */
import playerObject from '../objects/playerObject';
import wait from '../utilities/wait';
import communicationsObject from '../objects/communicationsObject';

let playerName = '';
let loginFailure = false;
let loginErrorText = null;
let loggedIn = false;
let loginInProgress = false;
let pleaseStartGameNow = false;
let existingHelpTextVersion = null;
let creatingNewAccount = false;
let sendingAccountCreation = false;

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

  document.getElementById('login_buttons').hidden = creatingNewAccount;
  document.getElementById('repeat_password_input').hidden = !creatingNewAccount;
  document.getElementById('create_account_button').hidden = !creatingNewAccount;
  document.getElementById(
    'account_creation_in_progress',
  ).hidden = !sendingAccountCreation;

  document.getElementById('login_error_text_box').hidden = !loginErrorText;
  document.getElementById('login_error_text').innerText = loginErrorText;
}

async function checkLoggedInStatus(userRequest) {
  try {
    const res = await fetch(`${communicationsObject.apiURL}/me`, {
      credentials: 'include', // Otherwise, no cookies!
    });
    if (res.status === 200) {
      loggedIn = true;
      const resultObject = await res.json();
      playerName = resultObject.username;
    } else if (res.status === 401) {
      if (userRequest) {
        loginFailure = true;
      }
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
  updateDOMElements();
}

async function login() {
  loginFailure = false;
  loginInProgress = true;
  updateDOMElements();
  try {
    // Build formData object.
    // The API expects a form input, not JSON.
    const formData = new URLSearchParams();
    formData.append('name', domElements.playerNameInputBox.value);
    formData.append('password', domElements.passwordInputBox.value);

    const res = await fetch(`${communicationsObject.apiURL}/auth`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // Otherwise, no cookies!
      body: formData,
    });
    if (res.status === 200) {
      // NOTE: Currently a 200 is returned whether it succeeds or not.
      await checkLoggedInStatus(true);
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
  try {
    const res = await fetch(`${communicationsObject.apiURL}/log-out`, {
      credentials: 'include', // Otherwise, no cookies!
    });
    if (res.status === 200 || res.status === 401) {
      loggedIn = false;
    } else {
      console.error('Unexpected response from server.');
      console.log(res);
      console.log(res.status);
      console.log(await res.text());
      console.log(await res.json());
    }
  } catch (error) {
    console.error('Error contacting server:');
    console.error(error);
  }
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
  const userName = document.getElementById('player_name_input_box').value;
  const password = document.getElementById('password_input_box').value;
  const repeatPasword = document.getElementById('repeat_password_input_box')
    .value;
  if (password !== repeatPasword) {
    loginErrorText = 'Passwords do not match.';
  } else if (password === userName) {
    loginErrorText = 'Passwords and username must be different.';
  } else if (password.length < 8) {
    loginErrorText = 'Passwords must be at least 8 characters long.';
  } else if (password.length > 4096) {
    loginErrorText = 'Password is too long';
  } else {
    sendingAccountCreation = true;
    updateDOMElements();
    // Build formData object.
    // The API expects a form input, not JSON.
    const formData = new URLSearchParams();
    formData.append('name', domElements.playerNameInputBox.value);
    formData.append('password', domElements.passwordInputBox.value);

    try {
      const res = await fetch(`${communicationsObject.apiURL}/sign-up`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', // Otherwise, no cookies!
        body: formData,
      });
      if (res.status === 200) {
        // NOTE: Currently a 200 is returned whether it succeeds or not.
        const resultText = await res.text();
        if (resultText !== 'Success') {
          loginErrorText = resultText;
        } else {
          creatingNewAccount = false;
        }
      } else {
        loginErrorText = 'Unknown error creating account.';
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
  // Find out if we are logged in already
  await checkLoggedInStatus();

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

  // The helpTextVersion is a way to force all users
  // back to the intro screen on next connection.
  // It is also the method that the 'p' key uses to get users here.
  existingHelpTextVersion = Number(localStorage.getItem('helpTextVersion'));

  if (
    !loggedIn ||
    !existingHelpTextVersion ||
    existingHelpTextVersion < playerObject.helpTextVersion
  ) {
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
      await wait(1);
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

    // Save the player name to local storage for use next time
    // in the login box.
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
