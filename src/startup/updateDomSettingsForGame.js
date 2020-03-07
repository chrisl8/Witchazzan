/* globals document:true */

import playerObject from '../objects/playerObject';

/*
 * These are DOM settings that we need in game,
 * but that would break the help screen at start.
 * So they are not set until we start the game.
 */

function updateDomSettingsForGame() {
  // Set viewport requirements for game, such as no scrolling
  const metaTag = document.createElement('meta');
  metaTag.name = 'viewport';
  metaTag.content =
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(metaTag);
  document.getElementsByTagName('body')[0].style.overflow = 'hidden';

  // Set up some initial values.
  document.getElementById('canvas_overlay_elements').style.display = 'flex';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.chatInputDiv.style.display = 'none';
  playerObject.domElements.Scrolling.hidden = true;
  playerObject.domElements.chatInputCaret.innerHTML = '&#x1F4AC;';
}

export default updateDomSettingsForGame;
