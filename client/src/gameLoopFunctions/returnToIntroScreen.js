/* globals localStorage:true */
/* globals window:true */

async function returnToIntroScreen() {
  console.log('Display intro screen.');
  let existingHelpTextVersion = Number(localStorage.getItem('helpTextVersion'));
  existingHelpTextVersion--;
  localStorage.setItem('helpTextVersion', existingHelpTextVersion.toString());

  window.location.href = '/sign-in.html';
}

export default returnToIntroScreen;
