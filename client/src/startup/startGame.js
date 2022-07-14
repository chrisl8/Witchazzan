/* globals window:true */
/* globals document:true */
/* globals localStorage:true */
/* globals $:true */
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
import textObject from '../objects/textObject.js';

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
  const disconnectReason = localStorage.getItem('disconnectReason');
  if (disconnectReason) {
    document.getElementById('loading_text').innerHTML = disconnectReason;
    playerObject.disconnectReason = disconnectReason;
  }
  document.getElementById('loading_text').hidden = false;

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
  playerObject.loadTesting = localStorage.getItem('loadTesting') === 'true';
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

  // Hide the loading text and its container before starting the game.
  document.getElementById('pre_load_info').hidden = true;

  // Un-hide joystick input boxes and enable touch input on mobile
  if (isMobileBrowser) {
    textObject.escapeToLeaveChat.text = `Tap either joystick to return to game, use / to send commands.`;
    document.getElementById('joystick_container').hidden = false;
    document.getElementById('second_stick_container').hidden = false;
    if (
      // https://stackoverflow.com/a/34516083/4982408
      // window.navigator.standalone is for iPhone/iPad running the app from a home screen shortcut
      // display-mode: standalone is for Android doing the same.
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches
    ) {
      // Improve experience in iOS standalone mode.
      // No need for scroll bars.
      $('body').css('overflow', 'hidden');
      // Joysticks can cover entire screen!
      $('#joystick_container').css('height', '100%');
      $('#second_stick_container').css('height', '100%');
      // The chat window falls into the rounded corner of the iPhone.
      $('#command_input_div').css('margin-left', '30px');
      $('#upper_left_text_overlay_div').css('top', '8%');
    } else {
      const warnedAboutAppMode = localStorage.getItem('warnedAboutAppMode');
      if (warnedAboutAppMode !== 'done') {
        if (window.navigator.standalone === false) {
          window.alert(
            'This game works better in App Mode. Tap Share, then Add to Home Screen. Then it will run Fullscreen and be easier to control.',
          );
          localStorage.setItem('warnedAboutAppMode', 'done');
        } else if (window.matchMedia('(display-mode: browser)').matches) {
          window.alert(
            'This game works better in App Mode. Open menu, then Add to Home screen. Then it will run Fullscreen and be easier to control.',
          );
          localStorage.setItem('warnedAboutAppMode', 'done');
        }
      }
    }
    handleTouchInput();
  } else {
    // We never need scroll bars on desktop
    $('body').css('overflow', 'hidden');
  }

  playerObject.scrollingTextBox = new ScrollingTextBox();

  // Start Phaser
  phaserConfigObject.physics.arcade.debug = playerObject.enableDebug;
  phaserConfigObject.game = new Phaser.Game(phaserConfigObject);

  // grab handle to canvas element
  playerObject.domElements.canvas = document.getElementsByTagName('canvas')[0];

  // If they aren't in fullscreen, tell them to try it.
  if (!isMobileBrowser) {
    setTimeout(() => {
      if (!window.matchMedia('(display-mode: fullscreen)').matches) {
        textObject.enterSceneText.text = 'Use F11 to play in full screen!';
        textObject.enterSceneText.display();
      }
    }, 10000);
  }

  // Watch for browser window visibility changes.
  // https://doc.photonengine.com/en-us/pun/current/demos-and-tutorials/webgl-tabsinbackground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // If the user's browser window becomes hidden, we need to kick them out,
      // because their Phaser instance will NOT be running, causing their hadrons to appear frozen and not operate.
      // Because this is a "game",users should stay focused on it when playing, and be OK with it having to reload
      // when they leave and come back. AFK only exists if your screen is focused on the window and hasn't gone to sleep.
      // This keeps the game snappy for everyone else in the game.
      setTimeout(() => {
        // Giving it a second to make sure it stayed that way.
        // This also prevents page refreshes from setting this,
        // because visibilityState is 'hidden' for a brief moment
        // when a page starts rendering.
        if (document.visibilityState === 'hidden') {
          localStorage.setItem(
            'disconnectReason',
            'Your game was paused due to being in the background, reconnecting...',
          );
          window.location.reload();
        }
      }, 1000);
    }
  });
})();
