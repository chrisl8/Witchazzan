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

    // Player and NPC tags
    hadrons.forEach((hadron, key) => {
      if (clientSprites.has(key)) {
        let clientSprite = clientSprites.get(key);
        if (hadron.typ === 'player' || hadron.typ === 'npc') {
          if (key === playerObject.playerId) {
            // Act on the local player, not the shadow.
            clientSprite = { sprite: playerObject.player };
          }
          if (!playerObject.domElements.otherPlayerTags[key]) {
            playerObject.domElements.otherPlayerTags[key] =
              document.createElement('div');
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
            // Chat bubble takes precedence over health bar.
            newInnerHTML = '&#x1F4AD;';
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
          } else if (hadron.hlth < 100) {
            const healthBarWidth =
              clientSprite.sprite.displayWidth *
              playerObject.cameraScaleFactor *
              1.75;
            const healthBarHeight =
              clientSprite.sprite.displayHeight *
              playerObject.cameraScaleFactor *
              0.1;
            let healthBarColor = '#27d727';
            if (hadron.hlth < 70) {
              healthBarColor = 'orange';
            }
            if (hadron.hlth < 20) {
              healthBarColor = 'red';
            }
            newInnerHTML = `<div class="w3-light-grey w3-round" style="width:${healthBarWidth}px; height:${healthBarHeight}px"><div class="w3-container w3-blue w3-round" style="width:${hadron.hlth}%; height:${healthBarHeight}px; background-color: ${healthBarColor};">&nbsp</div></div>`;
            // Location
            playerObject.domElements.otherPlayerTags[key].style.left = `${
              canvasLeftMargin +
              (clientSprite.sprite.x -
                clientSprite.sprite.displayWidth -
                playerObject.cameraOffset.x) *
                playerObject.cameraScaleFactor +
              4
            }px`;
            playerObject.domElements.otherPlayerTags[key].style.top = `${
              (clientSprite.sprite.y -
                clientSprite.sprite.displayHeight * 0.6 -
                playerObject.cameraOffset.y) *
              playerObject.cameraScaleFactor
            }px`;
          }

          // Only update it if it has changed, because repeatedly updating the DOM will slow down the browser.
          if (
            !playerObject.domElementHistory.otherPlayerTags.hasOwnProperty(key)
          ) {
            playerObject.domElementHistory.otherPlayerTags[key] = {};
          }
          if (
            newInnerHTML !==
            playerObject.domElementHistory.otherPlayerTags[key].innerHTML
          ) {
            playerObject.domElementHistory.otherPlayerTags[key].innerHTML =
              newInnerHTML;
            playerObject.domElements.otherPlayerTags[key].innerHTML =
              newInnerHTML;
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
