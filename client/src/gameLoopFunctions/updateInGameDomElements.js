/* globals window:true */
/* globals document:true */
import playerObject from '../objects/playerObject.js';
import textObject from '../objects/textObject.js';
import hadrons from '../objects/hadrons.js';
import clientSprites from '../objects/clientSprites.js';

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
    Fading: {
      text: '',
      hidden: true,
    },
  };

  // Set up text for various text fields
  // eslint-disable-next-line no-unused-vars
  for (const [, value] of Object.entries(textObject)) {
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

  ['Center', 'UpperLeft', 'Scrolling', 'Fading'].forEach((textLocation) => {
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

    // Location for Fading Text
    if (textLocation === 'Fading') {
      newValueObject.style.left = `${
        canvasWidth / 2 - playerObject.domElements[textLocation].offsetWidth / 2
      }px`;
      newValueObject.style.top = `${
        canvasHeight * 0.8 -
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

    // Get canvas offset for use when setting items relative to in game objects
    const canvasStyle = window.getComputedStyle(
      playerObject.domElements.canvas,
    );
    const canvasLeftMargin = Number(
      canvasStyle['margin-left'].replace('px', ''),
    );

    // Player Tag
    // Technically this is acting on the player's "shadow"
    if (hadrons.has(playerObject.playerId)) {
      const playerHadron = hadrons.get(playerObject.playerId);
      // Hearts
      const health = playerHadron.hlth;
      let newPlayerTagInnerHTML = '';
      if (health > 99) {
        newPlayerTagInnerHTML = '&#x2764;&#x2764;&#x2764;&#x2764;';
      } else if (health > 74) {
        newPlayerTagInnerHTML = '&#x2764;&#x2764;&#x2764;';
      } else if (health > 49) {
        newPlayerTagInnerHTML = '&#x2764;&#x2764;';
      } else if (health > 24) {
        newPlayerTagInnerHTML = '&#x2764;';
      }
      if (
        playerObject.domElementHistory.playerTag.innerHTML !==
        newPlayerTagInnerHTML
      ) {
        playerObject.domElements.playerTag.innerHTML = newPlayerTagInnerHTML;
        playerObject.domElementHistory.playerTag.innerHTML =
          newPlayerTagInnerHTML;
      }

      // Font size
      const newFontSize =
        (playerObject.player.displayWidth * playerObject.cameraScaleFactor) / 2;
      if (playerObject.domElementHistory.playerTag.fontSize !== newFontSize) {
        playerObject.domElements.playerTag.style.fontSize = `${newFontSize}px`;
        playerObject.domElementHistory.playerTag.fontSize = newFontSize;
      }

      // Location
      const constantOffsetForPretty = 4;
      const newLeft = `${
        canvasLeftMargin +
        (playerObject.player.x -
          playerObject.player.displayWidth -
          playerObject.cameraOffset.x) *
          playerObject.cameraScaleFactor +
        constantOffsetForPretty
      }px`;
      const newTop = `${
        (playerObject.player.y -
          playerObject.player.displayHeight -
          playerObject.cameraOffset.y) *
          playerObject.cameraScaleFactor +
        constantOffsetForPretty
      }px`;
      if (playerObject.domElementHistory.playerTag.left !== newLeft) {
        playerObject.domElements.playerTag.style.left = newLeft;
        playerObject.domElementHistory.playerTag.left = newLeft;
      }
      if (playerObject.domElementHistory.playerTag.top !== newTop) {
        playerObject.domElements.playerTag.style.top = newTop;
        playerObject.domElementHistory.playerTag.top = newTop;
      }
    }

    // Other player tags
    hadrons.forEach((hadron, key) => {
      if (key !== playerObject.playerId && clientSprites.has(key)) {
        const clientSprite = clientSprites.get(key);
        if (clientSprite.spriteData.type === 'player') {
          if (!playerObject.domElements.otherPlayerTags[key]) {
            playerObject.domElements.otherPlayerTags[key] =
              document.createElement('span');
            playerObject.domElements.otherPlayerTags[key].classList.add(
              'other_player_tag',
            );
            playerObject.domElements.otherPlayerTagsDiv.appendChild(
              playerObject.domElements.otherPlayerTags[key],
            );
          }

          // Text
          let newInnerHTML = '';
          if (hadron.chtO) {
            newInnerHTML = '&#x1F4AD;';
          }
          playerObject.domElements.otherPlayerTags[key].innerHTML =
            newInnerHTML;

          if (newInnerHTML !== '') {
            // Font size
            const newFontSize =
              (playerObject.player.displayWidth *
                playerObject.cameraScaleFactor) /
              2;
            playerObject.domElements.otherPlayerTags[
              key
            ].style.fontSize = `${newFontSize}px`;

            // Location
            // This is tweaked for the "thought bubble",
            // to make it up and to the right of the player.
            playerObject.domElements.otherPlayerTags[key].style.left = `${
              canvasLeftMargin +
              (clientSprite.sprite.x - playerObject.cameraOffset.x) *
                playerObject.cameraScaleFactor +
              4
            }px`;
            playerObject.domElements.otherPlayerTags[key].style.top = `${
              (clientSprite.sprite.y -
                clientSprite.sprite.displayHeight -
                playerObject.cameraOffset.y) *
                playerObject.cameraScaleFactor +
              4
            }px`;
          }
        }
      } else if (playerObject.domElements.otherPlayerTags[key]) {
        playerObject.domElements.otherPlayerTags[key].remove();
        playerObject.domElements.otherPlayerTags[key] = null;
      }
    });

    // Store current settings so we do not update unless required.
    playerObject.domElementHistory[textLocation] = newValueObject;
  });
};

export default updateInGameDomElements;
