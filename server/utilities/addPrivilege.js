/* eslint-disable no-param-reassign,consistent-return */
import wait from './wait.js';

const validPrivileges = ['op', 'canChat', 'canMessage'];

/**
 * Add a new privilege to user in the database.
 * @param {String} privilege
 * @param {string} playerNameToOp
 * @param {Object} db
 * @param {Object} connectedPlayerData
 * @param {Object} socket
 * @returns {Promise<string>}
 */

async function addPrivilege({
  privilege,
  playerNameToOp,
  db,
  connectedPlayerData,
  socket,
}) {
  // Normalize case and text
  if (privilege === 'op') {
    privilege = 'admin';
  } else if (privilege.toLowerCase() === 'canchat') {
    privilege = 'canChat';
  } else if (privilege.toLowerCase() === 'canmessage') {
    privilege = 'canMessage';
  }

  if (validPrivileges.indexOf(privilege) === -1) {
    return `${privilege} is not a valid privilege`;
  }
  let playerIdToPrivilege;
  let playerAlreadyHasPrivilege;
  try {
    // LIKE allows for case-insensitive name comparison.
    // Usernames shouldn't be case-sensitive.
    const sql = `SELECT id, ${privilege} FROM Users WHERE name LIKE ?`;
    const result = await db.query(sql, [playerNameToOp]);
    if (result.rows.length > 0) {
      playerIdToPrivilege = result.rows[0].id;
      playerAlreadyHasPrivilege = result.rows[0][privilege] === 1;
    }
  } catch (e) {
    console.error('Error retrieving user on socket command:');
    console.error(e.message);
    return `Error retrieving ${playerNameToOp} from the database`;
  }
  if (!playerIdToPrivilege) {
    return `Player '${playerNameToOp}' does not exist.`;
  }
  if (playerAlreadyHasPrivilege) {
    return `Player '${playerNameToOp}' already has ${privilege} privilege.`;
  }
  try {
    await db.query(`UPDATE Users SET ${privilege} = 1 WHERE id = ?`, [
      playerIdToPrivilege,
    ]);
  } catch (e) {
    console.error('Error updating user:');
    console.error(e.message);
    return `Error updating '${playerNameToOp}' database entry.`;
  }
  if (connectedPlayerData.get(playerIdToPrivilege)?.socketId) {
    // NOTE: This will never be sent to the sending player,
    // so if you privilege yourself, remember to log out and back in again.
    socket
      .to(connectedPlayerData.get(playerIdToPrivilege)?.socketId)
      .emit('txt', {
        typ: 'chat',
        content: `You have been given ${privilege} privilege! You must sign in again to apply the update. Your game will now restart to apply it...`,
      });
    await wait(3000);
    socket
      .to(connectedPlayerData.get(playerIdToPrivilege)?.socketId)
      .emit('unauthorized', {
        content: `You have been given ${privilege} privilege! You must sign in again to apply the update. Your game will now restart to apply it...`,
      });
  }
  return `Player '${playerNameToOp}' has been given ${privilege} privilege.`;
}

export default addPrivilege;
