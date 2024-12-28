/* globals localStorage:true */
import playerObject from '../objects/playerObject.js';
import spellAssignments from '../objects/spellAssignments.js';

function populateSpellSettings() {
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
      // Otherwise, fill them in with the default value,
      // but only assign defaults if they exist.
      spellAssignments.set(value, playerObject.spellOptions[key]);
    }
  }
}

export default populateSpellSettings;
