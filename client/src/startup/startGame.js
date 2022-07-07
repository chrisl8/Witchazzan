/* globals window:true */
/* globals document:true */
/* globals localStorage:true */
import Phaser from 'phaser';
import phaserConfigObject from '../objects/phaserConfigObject.js';
import receiveDataFromServer from '../receiveDataFromServer.js';
import handleTouchInput from '../handleTouchInput.js';
import playerObject from '../objects/playerObject.js';
import wait from '../../../shared/wait.mjs';
import ScrollingTextBox from '../ScrollingTextBox.js';
import isMobileBrowser from '../utilities/isMobileBrowser.js';
import returnToIntroScreen from '../gameLoopFunctions/returnToIntroScreen.js';
import spellAssignments from '../objects/spellAssignments.js';

async function waitForBrowserWindowToBeVisible() {
  // Don't start if the browser window is not visible.

  while (document.visibilityState === 'hidden') {
    // eslint-disable-next-line no-await-in-loop
    await wait(100);
  }
}

async function waitForConnectionAndInitialPlayerPosition() {
  // Don't start until we have the initial connection
  // with the player's initial position.

  while (!playerObject.initialPositionReceived) {
    // eslint-disable-next-line no-await-in-loop
    await wait(100);
  }
}

/*
 * This actually starts up the game,
 * after the local variables are loaded,
 * and the help screen, if shown, is dismissed.
 */

(async () => {
  // First make sure that we have a token, because otherwise this is pointless
  const token = localStorage.getItem('authToken');
  if (!token) {
    returnToIntroScreen();
  }

  // Show/hide correct loading text
  const lostConnection = localStorage.getItem('lostConnection');
  localStorage.removeItem('lostConnection');
  const paused = localStorage.getItem('paused');
  localStorage.removeItem('paused');
  document.getElementById('loading_text').hidden =
    Boolean(lostConnection) || Boolean(paused);
  document.getElementById('reconnect_text').hidden = !lostConnection;
  document.getElementById('paused_text').hidden = !paused;

  // Set viewport requirements for game, such as no scrolling
  // const metaTag = document.createElement('meta');
  // metaTag.name = 'viewport';
  // metaTag.content =
  //   'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  // document.getElementsByTagName('head')[0].appendChild(metaTag);
  // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  //
  // // Reset zoom?
  // // $('meta[name=viewport]').remove();
  // // $('head').append(
  // //   '<meta name="viewport" content="width=device-width, maximum-scale=10.0, user-scalable=yes">',
  // // );
  // setTimeout(() => {
  //   $('meta[name=viewport]').remove();
  //   $('head').append(
  //     '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
  //   );
  // }, 100);
  // // document.body.style.zoom = window.innerWidth / window.outerWidth;
  // // document.body.style.zoom = 1.0;
  // // const scale = 'scale(1)';
  // // document.body.style.webkitTransform = scale; // Chrome, Opera, Safari
  // // document.body.style.msTransform = scale; // IE 9
  // // document.body.style.transform = scale; // General

  // Set up some initial DOM element settings.
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.chatInputCaret.innerHTML = '&#x1F4AC;';
  playerObject.domElements.Scrolling.hidden = true;

  // Retrieve data from local storage
  playerObject.disableCameraZoom =
    localStorage.getItem('disableCameraZoom') === 'true';
  playerObject.disableSound = localStorage.getItem('disableSound') === 'true';
  playerObject.enableDebug = localStorage.getItem('enableDebug') === 'true';
  // Spell Assignments
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
  // Active Spell
  if (localStorage.getItem('activeSpell')) {
    playerObject.activeSpell = localStorage.getItem('activeSpell');
  } else {
    // Set active spell to first spell key's assignment.
    playerObject.activeSpell = spellAssignments.get(playerObject.spellKeys[0]);
  }

  await waitForBrowserWindowToBeVisible();

  receiveDataFromServer();

  await waitForConnectionAndInitialPlayerPosition();

  // Hide the loading text before starting the game.
  document.getElementById('pre_load_info').hidden = true;

  // Set the background to black so that parts of the browser window that are not the game are obvious
  document.getElementsByTagName('body')[0].style.background = 'black';

  // Un-hide joystick input boxes and enable touch input on mobile
  if (isMobileBrowser) {
    document.getElementById('joystick_container').hidden = false;
    document.getElementById('second_stick_container').hidden = false;
    handleTouchInput();
  }

  playerObject.scrollingTextBox = new ScrollingTextBox();

  // Start Phaser
  phaserConfigObject.physics.arcade.debug = playerObject.enableDebug;
  phaserConfigObject.game = new Phaser.Game(phaserConfigObject);

  // grab handle to canvas element
  playerObject.domElements.canvas = document.getElementsByTagName('canvas')[0];

  // Watch for browser window visibility changes.
  // https://doc.photonengine.com/en-us/pun/current/demos-and-tutorials/webgl-tabsinbackground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // If the user's browser window becomes hidden, we need to kick them out,
      // because their Phaser instance will NOT be running, causing their hadrons to appear frozen and not operate.
      // Because this is a "game",users should stay focused on it when playing, and be OK with it having to reload
      // when they leave and come back.
      // This keeps the game snappy for everyone else in the game.
      setTimeout(() => {
        // Giving it a second to make sure it stayed that way.
        // This also prevents page refreshes from setting this.
        if (document.visibilityState === 'hidden') {
          localStorage.setItem('paused', '1');
          window.location.reload();
        }
      }, 1000);
    }
  });
})();
