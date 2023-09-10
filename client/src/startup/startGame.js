/* globals window:true */
/* globals document:true */
/* globals localStorage:true */
import Phaser from 'phaser';
import phaserConfigObject from '../objects/phaserConfigObject.js';
import receiveDataFromServer from '../receiveDataFromServer.js';
import handleTouchInput from '../handleTouchInput.js';
import playerObject from '../objects/playerObject.js';
import wait from '../../../server/utilities/wait.js';
import ScrollingTextBox from '../ScrollingTextBox.js';
import isMobileBrowser from '../utilities/isMobileBrowser.js';
import returnToIntroScreen from '../gameLoopFunctions/returnToIntroScreen.js';
import spellAssignments from '../objects/spellAssignments.js';
import textObject from '../objects/textObject.js';
import populateSpellSettings from '../utilities/populateSpellSettings.js';

async function waitForBrowserWindowToBeVisible() {
  // Don't start if the browser window is not visible.

  let backgrounded = false;
  while (document.visibilityState === 'hidden') {
    backgrounded = true;
    // eslint-disable-next-line no-await-in-loop
    await wait(100);
  }
  if (backgrounded) {
    // Reload site in case client code has changed while we were waiting.
    if (playerObject.enableDebug) {
      console.log('Reloading after being backgrounded.');
    }
    window.location.reload();
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
  // The helpTextVersion is a way to force all users
  // back to the intro screen on the next connection.
  // It is also the method that the 'p' key uses to get users here.
  // NOTE: This code is duplicated from introScreenAndPreGameSetup.js because
  // in Firefox redirecting to /sign-in.html fails, so this catches that.
  // For some reason it works fine in Chrome but not Firefox.
  const existingHelpTextVersion = Number(
    localStorage.getItem('helpTextVersion'),
  );
  const token = localStorage.getItem('authToken');
  if (
    !token ||
    !existingHelpTextVersion ||
    existingHelpTextVersion < playerObject.helpTextVersion
  ) {
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
  playerObject.logLatency = localStorage.getItem('logLatency') === 'true';
  playerObject.disableSound = localStorage.getItem('disableSound') === 'true';
  playerObject.enableDebug = localStorage.getItem('enableDebug') === 'true';
  playerObject.loadTesting = localStorage.getItem('loadTesting') === 'true';
  playerObject.infiniteHealth =
    localStorage.getItem('infiniteHealth') === 'true';

  populateSpellSettings();

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
    playerObject.isMobileBrowser = true;
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
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      // Joysticks can cover entire screen!
      document.getElementById('joystick_container').style.height = '100%';
      document.getElementById('second_stick_container').style.height = '100%';
      // The chat window falls into the rounded corner of the iPhone.
      document.getElementById('command_input_div').style['margin-left'] =
        '30px';
      document.getElementById('upper_left_text_overlay_div').style.top = '8%';
    } else {
      const warnedAboutAppMode = localStorage.getItem('warnedAboutAppMode');
      if (warnedAboutAppMode !== 'done') {
        if (window.navigator.standalone === false) {
          // eslint-disable-next-line no-alert
          window.alert(
            'This game works better in App Mode. Tap Share, then Add to Home Screen. Then it will run Fullscreen and be easier to control.',
          );
          localStorage.setItem('warnedAboutAppMode', 'done');
        } else if (window.matchMedia('(display-mode: browser)').matches) {
          // eslint-disable-next-line no-alert
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
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
  }

  playerObject.scrollingTextBox = new ScrollingTextBox();

  // Start Phaser
  phaserConfigObject.physics.arcade.debug = playerObject.enableDebug;
  phaserConfigObject.game = new Phaser.Game(phaserConfigObject);

  // Create a handle to the canvas element
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
