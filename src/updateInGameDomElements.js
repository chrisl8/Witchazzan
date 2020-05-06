/* globals window:true */
/* globals document:true */
import playerObject from './objects/playerObject';
import textObject from './objects/textObject';

const updateInGameDomElements = (htmlElementParameters) => {
  const consolidatedTextObject = {
    Center: {
      text: '',
      hidden: true,
    },
    UpperLeft: {
      text: '',
      hidden: true,
    },
    Scrolling: {
      text: '',
      hidden: true,
    },
  };

  // Set up text for various text fields
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(textObject)) {
    if (value.shouldBeActiveNow) {
      consolidatedTextObject[value.location].hidden = false;
      consolidatedTextObject[value.location].text = `${
        consolidatedTextObject[value.location].text
      }${value.text}`;
    }
  }

  // Update element styles and insert text if needed.

  // Set HTML element options based on the new canvas properties
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  ['Center', 'UpperLeft', 'Scrolling'].forEach((textLocation) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style

    // Create temp object to store new settings to compare with current
    const newValueObject = {
      style: {},
    };

    // Size and color
    if (htmlElementParameters[textLocation]) {
      newValueObject.style.color =
        htmlElementParameters[textLocation].color || 'red';
      newValueObject.style.fontSize = htmlElementParameters[textLocation]
        .fontSize
        ? `${canvasHeight * htmlElementParameters[textLocation].fontSize}px`
        : '1em';
      newValueObject.style.background = htmlElementParameters[textLocation]
        .background
        ? `rgba(${htmlElementParameters[textLocation].background})`
        : 'none';
    }

    // Text and visibility from scene text list
    newValueObject.hidden = consolidatedTextObject[textLocation].hidden;
    newValueObject.innerHTML = consolidatedTextObject[textLocation].text;

    // Location for Center Text
    if (textLocation === 'Center') {
      newValueObject.style.left = `${
        canvasWidth / 2 - playerObject.domElements[textLocation].offsetWidth / 2
      }px`;
      newValueObject.style.top = `${
        canvasHeight / 2 -
        playerObject.domElements[textLocation].offsetHeight / 2
      }px`;
    }

    // Check settings and update if they are different
    for (const [key, value] of Object.entries(newValueObject.style)) {
      if (playerObject.domElementHistory[textLocation].style[key] !== value) {
        playerObject.domElements[textLocation].style[key] = value;
      }
    }
    for (const [key, value] of Object.entries(newValueObject)) {
      if (
        key !== 'style' &&
        playerObject.domElementHistory[textLocation][key] !== value
      ) {
        // Track scroll location for Scrolling text
        const isScrolledToBottom =
          textLocation === 'Scrolling' &&
          key === 'innerHTML' &&
          playerObject.domElements[textLocation].scrollHeight -
            playerObject.domElements[textLocation].clientHeight <=
            playerObject.domElements[textLocation].scrollTop + 1;

        playerObject.domElements[textLocation][key] = value;

        // scroll to bottom if isScrolledToBottom is true
        if (isScrolledToBottom) {
          playerObject.domElements[textLocation].scrollTop =
            playerObject.domElements[textLocation].scrollHeight;
        }
      }
    }

    // Player Tag
    if (
      playerObject.spawnedObjectList.hasOwnProperty(playerObject.playerId) &&
      playerObject.spawnedObjectList[playerObject.playerId]
    ) {
      const health =
        playerObject.spawnedObjectList[playerObject.playerId].gamePiece.health;
      if (health > 99) {
        playerObject.domElements.playerTag.innerHTML =
          '&#x2764;&#x2764;&#x2764;&#x2764;';
      } else if (health > 74) {
        playerObject.domElements.playerTag.innerHTML =
          '&#x2764;&#x2764;&#x2764;';
      } else if (health > 49) {
        playerObject.domElements.playerTag.innerHTML = '&#x2764;&#x2764;';
      } else if (health > 24) {
        playerObject.domElements.playerTag.innerHTML = '&#x2764;';
      } else {
        playerObject.domElements.playerTag.innerHTML = '';
      }
      playerObject.domElements.playerTag.style.left = `${
        (playerObject.player.x - playerObject.player.displayWidth - 8) *
        playerObject.cameraScaleFactor
      }px`;
      playerObject.domElements.playerTag.style.top = `${
        (playerObject.player.y - playerObject.player.displayHeight - 10) *
        playerObject.cameraScaleFactor
      }px`;
    }

    // Other player tags
    for (const [key, value] of Object.entries(playerObject.spawnedObjectList)) {
      if (value) {
        if (
          Number(key) !== playerObject.playerId &&
          value.spriteData.type === 'player'
        ) {
          if (!playerObject.domElements.otherPlayerTags[Number(key)]) {
            playerObject.domElements.otherPlayerTags[
              Number(key)
            ] = document.createElement('span');
            playerObject.domElements.otherPlayerTags[Number(key)].classList.add(
              'other_player_tag',
            );
            playerObject.domElements.otherPlayerTagsDiv.appendChild(
              playerObject.domElements.otherPlayerTags[Number(key)],
            );
          }
          if (value.gamePiece.chatOpen) {
            playerObject.domElements.otherPlayerTags[Number(key)].innerHTML =
              '&#x1F4AD;';
          } else {
            playerObject.domElements.otherPlayerTags[Number(key)].innerHTML =
              '';
          }
          playerObject.domElements.otherPlayerTags[Number(key)].style.left = `${
            (value.sprite.x - value.sprite.displayWidth) *
            playerObject.cameraScaleFactor
          }px`;
          playerObject.domElements.otherPlayerTags[Number(key)].style.top = `${
            (value.sprite.y - value.sprite.displayHeight - 10) *
            playerObject.cameraScaleFactor
          }px`;
        }
        // console.log(`${key}: ${value}`);
      } else if (playerObject.domElements.otherPlayerTags[Number(key)]) {
        playerObject.domElements.otherPlayerTags[Number(key)].remove();
        playerObject.domElements.otherPlayerTags[Number(key)] = null;
      }
    }

    // Store current settings so we do not update unless required.
    playerObject.domElementHistory[textLocation] = newValueObject;
  });
};

export default updateInGameDomElements;
