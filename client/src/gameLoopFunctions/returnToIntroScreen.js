/* globals localStorage:true */
/* globals window:true */

import cleanUpScene from './cleanUpScene.js';

async function returnToIntroScreen() {
  console.log('Display intro screen.');
  let existingHelpTextVersion = Number(localStorage.getItem('helpTextVersion'));
  existingHelpTextVersion--;
  localStorage.setItem('helpTextVersion', existingHelpTextVersion.toString());

  cleanUpScene();

  window.location.reload();
}

export default returnToIntroScreen;
