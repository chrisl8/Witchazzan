import fs from 'fs';
import cors from 'cors';
import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import msgPackParser from 'socket.io-msgpack-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { randomUUID, randomBytes } from 'crypto';
import _ from 'lodash';
import persistentData from './persistentData.js';
import validateJWT from './validateJWT.js';
import wait from './utilities/wait.js';
import makeRandomNumber from './utilities/makeRandomNumber.js';
import validateHadron from './utilities/validateHadron.js';
import serverVersion from './utilities/version.js';
import mapUtils from './utilities/mapUtils.js';
import generateRandomGuestUsername from './utilities/generateRandomGuestUsername.js';
import initDatabase from './utilities/initDatabase.js';

const hadronBroadcastThrottleTime = 50;

const commandListArray = [
  {
    name: 'tp [scene name]',
    description: 'Teleport to a scene.',
    adminOnly: true,
  },
  {
    name: 'who',
    description: 'List currently online players.',
  },
  { name: 'exit', description: 'Exit to intro screen.' },
  { name: 'help', description: 'Displays this message.' },
  {
    name: 'dumpPlayerObject',
    description: 'Log player object to console for debugging.',
    adminOnly: true,
  },
  {
    name: 'dumpClientSprites',
    description: 'Log clientSprites Map() to console for debugging.',
    adminOnly: true,
  },
  {
    name: 'dumpHadrons',
    description: 'Log hadrons Map() to console for debugging.',
    adminOnly: true,
  },
  {
    name: 'dumpDeletedHadronList',
    description: 'Log deletedHadronList Array to console for debugging.',
    adminOnly: true,
  },
  {
    name: 'del [key] [value]',
    description: 'Delete hadrons where [key] is equal to [value].',
    adminOnly: true,
  },
  {
    name: 'op [player name]',
    description: 'Upgrade [player name] to admin.',
    adminOnly: true,
  },
];

console.log('------------------------------');
console.log('Witchazzan server is starting...');

// https://stackoverflow.com/a/64383997/4982408
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);
const persistentDataFolder = `${__dirname}/../persistentData`;

// Create persistent data folder if it doesn't exist
// Sync operations on server startup are fine.
if (!fs.existsSync(persistentDataFolder)) {
  fs.mkdirSync(persistentDataFolder);
}

// Persistent server configuration data.
// If the file doesn't exist, create it, and add any missing attributes.
let serverConfiguration;
try {
  serverConfiguration = await persistentData.readObject(
    `${persistentDataFolder}/serverConfiguration.json5`,
  );
} catch (error) {
  // File not existing will just return an empty object.
  // So an actual error is something worse, like the file being corrupted.
  process.exit(1);
}
// Set defaults for missing values.
if (!serverConfiguration.saltRounds) {
  serverConfiguration.saltRounds = 10;
}
if (!serverConfiguration.jwtSecret) {
  serverConfiguration.jwtSecret = randomBytes(64).toString('hex');
}
if (!serverConfiguration.jwtExpiresInSeconds) {
  serverConfiguration.jwtExpiresInSeconds = 60 * 60 * 24 * 30; // 30 days
}
if (!serverConfiguration.gameStateSaveInterval) {
  serverConfiguration.gameStateSaveInterval = 60 * 1000; // 1 minute
}
if (!serverConfiguration.defaultOpeningScene) {
  serverConfiguration.defaultOpeningScene = 'CamelopardalisH8';
}
// The file is always rewritten, so the formatting will get fixed if it is bad.
await persistentData.writeObject(
  `${persistentDataFolder}/serverConfiguration.json5`,
  serverConfiguration,
);

// Persistent user data in SQLite database.
// If the database doesn't exist, it will be created.
const dbName = `${persistentDataFolder}/database.sqlite`;
const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// eslint-disable-next-line func-names
db.query = function (sql, params) {
  const that = this;
  return new Promise((resolve, reject) => {
    that.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve({ rows });
    });
  });
};

await initDatabase(db);

// Create an empty hadrons Map for game state.
const hadrons = new Map();
// Create an empty connectedPlayerData Map for player information.
const connectedPlayerData = new Map();
// Load saved game state into inactiveHadrons. They are all inactive until players join.
let inactiveHadrons;
try {
  inactiveHadrons = await persistentData.readMap(
    `${persistentDataFolder}/hadrons.json5`,
  );
} catch (error) {
  // File not existing will just return an empty Map to start using.
  // So an actual error is something worse, like the file being corrupted.
  process.exit(1);
}

// Validate all saved hadrons before starting server
inactiveHadrons.forEach((hadron) => {
  if (!validateHadron.server(hadron)) {
    console.error(
      `Aborting server start due to invalid data in ${persistentDataFolder}/hadrons.json5`,
    );
    process.exit(1);
  }
});

// Get deleted user list
let deletedPlayers = await db.query(`SELECT id FROM Users WHERE deleted = 1`);
deletedPlayers = deletedPlayers.rows;
deletedPlayers = deletedPlayers.map((entry) => entry.id);
console.log(`Deleted user count: ${deletedPlayers.length}`);

// Resurrect any "Persist On Disconnect (pod)" hadrons immediately.
// Except for Library hadrons.
inactiveHadrons.forEach((hadron, key) => {
  // Check for hadrons owned by deleted players
  if (hadron.hasOwnProperty('own')) {
    if (deletedPlayers.indexOf(hadron.own) > -1) {
      console.log('Deleting hadron for deleted user:');
      console.log(hadron);
      inactiveHadrons.delete(key);
    }
  } else if (hadron.pod && hadron.scn !== 'Library') {
    hadrons.set(key, hadron);
    inactiveHadrons.delete(key);
  }
});

async function saveGameStateToDisk() {
  // Combine active and inactive hadrons into one list Map for saving.
  const hadronsToSave = new Map();
  inactiveHadrons.forEach((hadron, key) => {
    hadronsToSave.set(key, hadron);
  });
  hadrons.forEach((hadron, key) => {
    hadronsToSave.set(key, hadron);
  });
  await persistentData.writeMap(
    `${persistentDataFolder}/hadrons.json5`,
    hadronsToSave,
  );
  console.log('Game state saved to disk.');
}
const throttledSaveGameStateToDisk = _.throttle(
  saveGameStateToDisk,
  serverConfiguration.gameStateSaveInterval,
);

// Invoke immediately to ensure data is saved and formatted correctly,
// in case it was edited by hand while the server was not running.
await saveGameStateToDisk();

const app = express();

// In production everything is same origin, so there is no need for this.
const environment = process.env.NODE_ENV;
// Assume production if you don't recognise the value
const isDevelopment = environment === 'dev';
if (isDevelopment) {
  const options = {
    origin: true,
    credentials: true,
  };
  app.use(cors(options));
  app.options('*', cors()); // include before other routes
}

const webserverPort = process.env.PORT || 8080;

// All web content is housed in the website folder
// On MY server these files are actually served directly by NGINX,
// so that when the server.js is restarted the user doesn't fall into a 302 error,
// and instead can geta a nice "please wait" message.
// In theory it is also faster for NGINX to just serve the files.
// So this could be removed, but it seems nice for the server to "just work" if
// you want it to.
app.use(express.static(`${__dirname}/../web-dist`));

// parse application/json
app.use(express.json());

const webServer = app.listen(webserverPort);
// NOTE: As best I can tell, CORS has no affect either way on websocket, so just not messing with it.
const io = new Server(webServer, {
  parser: msgPackParser,
  transports: ['websocket'],
});

async function isNameInvalid(name) {
  let error;
  if (!name || name.length < 2) {
    error = 'Names must be at least 2 characters long';
  } else if (name.length > 72) {
    error = 'Names must be a maximum of 72 characters long';
  } else {
    try {
      // LIKE allows for case insensitive name comparison.
      // User names shouldn't be case sensitive.
      const sql = 'SELECT * FROM Users WHERE name LIKE ?';
      const result = await db.query(sql, [name]);
      if (result.rows.length > 0) {
        error = 'Name already exists';
      }
    } catch (e) {
      console.error('Error creating user:');
      console.error(e.message);
      error = 'Unknown server error.';
    }
  }
  return error;
}

function isPasswordInvalid(password, name) {
  let error;
  if (name === password) {
    error = 'Name and password cannot be the same.';
  } else if (!password || password.length < 8) {
    error = 'Password must be at least 8 characters long';
  } else if (password.length > 72) {
    error = 'Password must be a maximum of 72 characters long';
  }
  return error;
}

app.post('/api/sign-up', async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  let error;
  const passwordValidationError = isPasswordInvalid(password, name);
  if (passwordValidationError) {
    error = passwordValidationError;
  }
  const nameValidationError = await isNameInvalid(name);
  if (nameValidationError) {
    error = nameValidationError;
  }
  if (error) {
    res.status(400).send(error);
    return;
  }

  const userId = randomUUID();

  try {
    bcrypt.hash(password, serverConfiguration.saltRounds, async (err, hash) => {
      const sqlInsert =
        'INSERT INTO Users (id, name, password) VALUES ($1, $2, $3);';
      await db.query(sqlInsert, [userId, name, hash]);
    });
    res.sendStatus(200);
  } catch (e) {
    console.error('Error creating user:');
    console.error(e.message);
    res.status(500).send('Unknown error creating user.');
  }
});

app.post('/api/guest-play', async (req, res) => {
  // Generate names until we find a valid one.
  let name;
  let tryCount = 0;
  const maximumTries = 2000; // Prevent infinite loop if we are out of ideas.
  while (!name && tryCount < maximumTries) {
    tryCount++;
    const newGuestUsername = generateRandomGuestUsername();
    // eslint-disable-next-line no-await-in-loop
    if (!(await isNameInvalid(newGuestUsername))) {
      name = newGuestUsername;
    }
  }
  if (!name) {
    res
      .status(500)
      .send(
        'Unable to generate a valid guest username, please report this issue.',
      );
    return;
  }

  const userId = randomUUID();
  // Guests are full blown users, but their password is entirely unknown to anybody.
  const password = randomBytes(64).toString('hex');

  try {
    bcrypt.hash(password, serverConfiguration.saltRounds, async (err, hash) => {
      const sqlInsert =
        'INSERT INTO Users (id, name, password, guest) VALUES ($1, $2, $3, 1);';
      await db.query(sqlInsert, [userId, name, hash]);
    });
    // Guests are immediately signed in
    jwt.sign(
      {
        id: userId,
        name,
        admin: 0,
        guest: 1,
      },
      serverConfiguration.jwtSecret,
      {
        expiresIn: serverConfiguration.jwtExpiresInSeconds,
      },
      (innerErr, token) => {
        console.log(`${name} successfully playing as guest`);
        res.json({ token });
      },
    );
  } catch (e) {
    console.error('Error creating user:');
    console.error(e.message);
    res.status(500).send('Unknown error creating user.');
  }
});

app.post('/api/login', async (req, res) => {
  async function rejectUnauthorized(innerRes, name) {
    console.log(`Failed login attempt from ${name}.`);
    // A somewhat random wait stalls brute force attacks and somewhat mitigates timing attacks used to guess names.
    // It also prevents client side bugs from crippling the server with inadvertent DOS attacks.
    await wait(makeRandomNumber.between(3, 5) * 1000);
    innerRes.sendStatus(401);
  }
  const name = req.body.name;
  let id;
  let hash;
  let admin = 0;
  let guest = 0;
  const password = req.body.password;
  try {
    // LIKE allows for case insensitive name comparison.
    // User names shouldn't be case sensitive.
    const sql =
      'SELECT id, name, password, admin, guest FROM Users WHERE name LIKE ?';
    const result = await db.query(sql, [name]);
    if (result.rows.length > 0) {
      // We do not confirm or deny that the user exists.
      hash = result.rows[0].password;
      id = result.rows[0].id;
      admin = result.rows[0].admin;
      guest = result.rows[0].guest;
    }
  } catch (e) {
    console.error('Error retrieving user during login:');
    console.error(e.message);
    res.status(500).send('Unknown error.');
    return;
  }
  if (hash) {
    bcrypt.compare(password, hash, (err, result) => {
      if (result) {
        jwt.sign(
          {
            id,
            name,
            admin,
            guest,
          },
          serverConfiguration.jwtSecret,
          {
            expiresIn: serverConfiguration.jwtExpiresInSeconds,
          },
          (innerErr, token) => {
            console.log(`${name} successfully logged in`);
            res.json({ token });
          },
        );
      } else {
        rejectUnauthorized(res, name);
      }
    });
  } else {
    await rejectUnauthorized(res, name);
  }
});

// This allows the client to check if it has a valid token BEFORE
// starting the socket connection, in order to show a "logged in" status on
// the startup page.
app.post('/api/auth', async (req, res) => {
  try {
    const remoteIp = req.headers['x-real-ip'] || req.socket.remoteAddress;
    await validateJWT({
      token: req.body.token,
      secret: serverConfiguration.jwtSecret,
      db,
      remoteIp,
    });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(401);
  }
});

app.post('/api/rename-player', async (req, res) => {
  const remoteIp = req.headers['x-real-ip'] || req.socket.remoteAddress;
  let decoded;
  try {
    decoded = await validateJWT({
      token: req.body.token,
      secret: serverConfiguration.jwtSecret,
      db,
      remoteIp,
    });
  } catch (e) {
    res.sendStatus(401);
    return;
  }
  if (decoded.guest === 1) {
    res.status(400).send('Guest accounts cannot be renamed.');
    return;
  }
  const newName = req.body.name;
  const invalidNameError = await isNameInvalid(newName);
  if (invalidNameError) {
    res.status(400).send(invalidNameError);
    return;
  }
  try {
    await db.query('UPDATE Users SET name = $1 WHERE id = $2', [
      newName,
      decoded.id,
    ]);
  } catch (e) {
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
});

app.post('/api/change-password', async (req, res) => {
  const remoteIp = req.headers['x-real-ip'] || req.socket.remoteAddress;
  let decoded;
  try {
    decoded = await validateJWT({
      token: req.body.token,
      secret: serverConfiguration.jwtSecret,
      db,
      remoteIp,
    });
  } catch (e) {
    res.sendStatus(401);
    return;
  }
  const password = req.body.password;
  const passwordValidationError = await isPasswordInvalid(
    password,
    decoded.name,
  );
  if (passwordValidationError) {
    res.status(400).send(passwordValidationError);
    return;
  }
  try {
    // Updating password makes it NOT a guest account anymore, if it was.
  } catch (e) {
    res.sendStatus(500);
    return;
  }

  try {
    bcrypt.hash(password, serverConfiguration.saltRounds, async (err, hash) => {
      await db.query(
        'UPDATE Users SET password = $1, guest = 0 WHERE id = $2',
        [hash, decoded.id],
      );
    });
    res.sendStatus(200);
  } catch (e) {
    console.error('Error updating password:');
    console.error(e.message);
    res.status(500).send('Unknown error updating password.');
  }
});

app.post('/api/delete-account', async (req, res) => {
  const remoteIp = req.headers['x-real-ip'] || req.socket.remoteAddress;
  let decoded;
  try {
    decoded = await validateJWT({
      token: req.body.token,
      secret: serverConfiguration.jwtSecret,
      db,
      remoteIp,
    });
  } catch (e) {
    res.sendStatus(401);
    return;
  }
  const password = req.body.password;
  let hash;
  try {
    const result = await db.query(
      'SELECT id, password FROM Users WHERE id = ?',
      [decoded.id],
    );
    if (result.rows.length > 0) {
      hash = result.rows[0].password;
    }
  } catch (e) {
    console.error('Error retrieving user during password change:');
    console.error(e.message);
    res.status(500).send('Unknown error.');
    return;
  }
  if (hash) {
    bcrypt.compare(password, hash, async (err, result) => {
      if (result) {
        // DELETE USER
        // Deleted IDs are not wiped, but "invalidated" by:
        // 1. Set the username to [DELETED]
        // 2. Set their password to an unknown hashed entry.
        try {
          bcrypt.hash(
            password,
            serverConfiguration.saltRounds,
            async (newError, newHash) => {
              await db.query(
                `UPDATE Users SET name = '[DELETED]', password = $1, deleted = 1 WHERE id = $2`,
                [newHash, decoded.id],
              );
            },
          );
        } catch (e) {
          console.error('Error deleting user:');
          console.error(e.message);
          res.status(500).send('Unknown error deleting user.');
        }
        console.log(`Successfully deleted user ${decoded.name}`);
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/connections', async (req, res) => {
  try {
    const sql =
      'SELECT name, timestamp FROM Connections LEFT JOIN Users ON Connections.id = Users.id ORDER BY timestamp DESC';
    const result = await db.query(sql);
    let prettyOutput = `<html lang="en-US"><head><title>Connections</title></head><body><table><thead><tr><th>User</th><th>Login Time</th></thead></tbody>`;
    let previousEntry = {};
    result.rows.forEach((entry) => {
      if (
        entry.name !== previousEntry.name ||
        previousEntry.timestamp - entry.timestamp > 600
      ) {
        const connectionTime = new Date();
        connectionTime.setTime(entry.timestamp * 1000);
        prettyOutput += `<tr><td>${entry.name}</td><td>${connectionTime}</td></tr>`;
        previousEntry = entry;
      }
    });
    prettyOutput += '</tbody></table></body></html>';
    res.send(prettyOutput);
  } catch (e) {
    console.error('Error retrieving connections:');
    console.error(e.message);
    res.status(500).send('Unknown error.');
  }
});

// Track which scenes have been updated, and only send hadrons to them on update.
// NOTE: We could also flag EACH hadron as "updated" or not and then only update scenes where at least one has an update.
// This works for now though, and doesn't require updating hadrons in the sendHadrons() function.
const updatedSceneList = [];

function sendHadrons() {
  // Hadrons are filtered by scene and only sent to players in the same scene as they are in.
  const perSceneHadronList = {};

  // Only worry about rooms that contain players and where scenes have been updated
  connectedPlayerData.forEach((player) => {
    const updatedSceneListIndex = updatedSceneList.indexOf(player.scene);
    if (updatedSceneListIndex > -1 && !perSceneHadronList[player.scene]) {
      updatedSceneList.splice(updatedSceneListIndex, 1);
      perSceneHadronList[player.scene] = new Map();
    }
  });

  // Sift through hadrons and sort them into per-room maps
  hadrons.forEach((hadron, key) => {
    if (perSceneHadronList[hadron.scn]) {
      // Check to see if the controller of this hadron is in this scene
      // Except in the Library, where we don't transfer control.
      if (
        connectedPlayerData.get(hadron.ctr)?.scene !== hadron.scn &&
        hadron.scn !== 'Library'
      ) {
        if (hadron.tcw) {
          // Find a new controller for the hadron.
          let newControllerFound = false;
          connectedPlayerData.forEach((player, playerKey) => {
            if (!newControllerFound && player.scene === hadron.scn) {
              newControllerFound = true;
              // eslint-disable-next-line no-param-reassign
              hadron.ctr = playerKey;
            }
          });
        }
      }

      // Add hadron to this scene's Map
      perSceneHadronList[hadron.scn].set(key, hadron);
    }
  });

  // Loop through each scene's hadrons
  for (const [scene, sceneHadrons] of Object.entries(perSceneHadronList)) {
    if (scene !== 'Library') {
      // Send all of these hadrons to every player who is in the room with the same name as the scene
      io.sockets.to(scene).emit('hadrons', mapUtils.compress(sceneHadrons));
      // io.sockets.to(scene).emit("hadrons", Array.from(sceneHadrons.entries()));
    } else {
      // The Library is not a shared room, but instead each player sees their own instance.
      // Create a map of maps to hold each player's hadrons
      const libraryPlayerHadrons = new Map();
      sceneHadrons.forEach((hadron, key) => {
        if (!libraryPlayerHadrons.has(hadron.ctr)) {
          // If this is the first hadron for this player, make an empty map to hold them.
          libraryPlayerHadrons.set(hadron.ctr, new Map());
        }
        // Add this hadron to the player's personal map of library hadrons.
        libraryPlayerHadrons.get(hadron.ctr).set(key, hadron);
      });
      // Now send each player their own hadrons separately.
      libraryPlayerHadrons.forEach((playerHadronMap, playerId) => {
        if (connectedPlayerData.get(playerId)?.socketId) {
          io.sockets
            .to(connectedPlayerData.get(playerId)?.socketId)
            .emit('hadrons', mapUtils.compress(playerHadronMap));
        } else {
          console.error('Unclaimed Library Hadrons:');
          console.error(playerId, playerHadronMap);
        }
      });
    }
  }
}

const throttledSendHadrons = _.throttle(
  sendHadrons,
  hadronBroadcastThrottleTime,
);

function flagSceneHasUpdated(sceneName) {
  if (updatedSceneList.indexOf(sceneName) === -1) {
    updatedSceneList.push(sceneName);
  }
}

function validatePlayer(id, socket, PlayerName) {
  // If the network goes down and back up, clients
  // sometimes think they are connected and start sending data
  // when the server has lost track of them.
  // Forcing them to disconnect will fix the issue and prevent crashes.
  // This also checks for multiple connections from the same client.
  if (
    !id ||
    !connectedPlayerData.get(id) ||
    connectedPlayerData.get(id)?.socketId !== socket.id
  ) {
    console.log(`${PlayerName} validation failed`);
    socket.disconnect();
    return false;
  }
  return true;
}

async function closeServer(callback) {
  console.log('Shutdown requested. PLEASE BE PATIENT! Working on it...');
  io.sockets.emit('txt', {
    typ: 'chat',
    content: 'The Small Hadron Cooperator is shutting down.',
  });
  await wait(1000);
  console.log('Disconnecting users and giving them a mo...');
  io.sockets.emit('shutdown');
  io.close();
  await wait(500);
  if (callback) {
    // This allows us to run something against the hadrons while the
    // server is quiet, before saving and shutting down,
    // and presumably restarting.
    console.log('Running requested callback function before shutdown...');
    callback();
  }
  console.log('Saving game state (hadrons) to disk...');
  // Flush would only run it if it was requested, so we cancel and force it,
  // although in theory if flush didn't call it, no changes were made.
  await throttledSaveGameStateToDisk.cancel();
  await saveGameStateToDisk();
  console.log('Closing Database...');
  await db.close();
  console.log('Small Hadron Cooperator is going poof! Bye.\n\n');
  process.exit();
}

function socketEmitToId({ emitToId, socketEvent, data }) {
  // emit.to doesn't work to send back to the sender, so we need this special function
  // using io instead of just the socket.
  // per https://socket.io/docs/v3/emit-cheatsheet/
  // WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
  // named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
  io.sockets.to(emitToId).emit(socketEvent, data);
}

function socketEmitToAll({ socketEvent, data }) {
  // A socket.broadcast all sends to "everyone else", not the originating player, hence this function
  io.sockets.emit(socketEvent, data);
}

function updatePlayerImportantItemList({
  PlayerId,
  socketId,
  previousImportantItemList,
}) {
  // Generate a list of important items held in player's library, and send it to them.
  const importantItemList = [];
  inactiveHadrons.forEach((hadron) => {
    if (
      hadron.own === PlayerId &&
      hadron.scn === 'Library' &&
      hadron.iin &&
      importantItemList.indexOf(hadron.iin) === -1
    ) {
      importantItemList.push(hadron.iin);
    }
  });
  hadrons.forEach((hadron) => {
    if (
      hadron.own === PlayerId &&
      hadron.scn === 'Library' &&
      hadron.iin &&
      importantItemList.indexOf(hadron.iin) === -1
    ) {
      importantItemList.push(hadron.iin);
    }
  });
  if (!_.isEqual(importantItemList, previousImportantItemList)) {
    socketEmitToId({
      emitToId: socketId,
      socketEvent: 'importantItems',
      data: importantItemList,
    });
  }
  return importantItemList;
}

// Socket listeners
io.on('connection', (socket) => {
  // User cannot do anything until we have their token and have validated it.
  // The socket connection is entirely unrelated to any get/post requests, so we
  // have to validate the token again even if they used the /auth POST endpoint before.
  socket.emit('sendToken');

  // Nothing else is available until they have authenticated.
  socket.on('token', async (playerData) => {
    // This code runs every time a player joins.
    // Look down below for the list of "events" that the client can send us and will be responded to.
    try {
      const remoteIp =
        socket.handshake.headers['x-real-ip'] || socket.conn.remoteAddress;
      const decoded = await validateJWT({
        token: playerData.token,
        secret: serverConfiguration.jwtSecret,
        db,
        remoteIp,
      });
      // We now know that we have a valid authenticated user!
      const PlayerName = decoded.name;
      const PlayerId = decoded.id;
      const isAdmin = decoded.admin;
      console.log(`${PlayerName} connected from ${remoteIp}`);

      if (connectedPlayerData.get(PlayerId)) {
        console.log(`${PlayerName} is already connected!`);
        socket
          .to(connectedPlayerData.get(PlayerId).socketId)
          .emit('multiple_logins');
        await wait(100);
        connectedPlayerData.delete(PlayerId);
      }

      // Send player their ID, because there is no other easy way for them to know it.
      // This also servers as the "game is ready" "init" message to the client.
      socket.emit('init', {
        id: PlayerId,
        name: PlayerName,
        admin: isAdmin,
        defaultOpeningScene: serverConfiguration.defaultOpeningScene,
        serverVersion,
      });

      // Announce to the player who else is currently online.
      const connectedPlayerList = [];
      connectedPlayerData.forEach((player) => {
        connectedPlayerList.push(player.name);
      });
      if (connectedPlayerList.length > 0) {
        // The client scroll text box takes a moment to initialize.
        setTimeout(() => {
          socket.emit('txt', {
            typ: 'chat',
            content: `${connectedPlayerList.join(', ')} ${
              connectedPlayerList.length === 1 ? 'is' : 'are'
            } currently online.`,
          });
        }, 1000);
      }

      let importantItemList = [];
      importantItemList = updatePlayerImportantItemList({
        PlayerId,
        socketId: socket.id,
        previousImportantItemList: importantItemList,
      });

      // Resurrect all inactive hadrons owned by this user.
      inactiveHadrons.forEach((hadron, key) => {
        if (hadron.own === PlayerId) {
          hadrons.set(key, hadron);
          inactiveHadrons.delete(key);
          flagSceneHasUpdated(hadron.scn);
        }
      });

      // Create or update the player's hadron
      let newPlayerHadron;
      if (hadrons.has(PlayerId)) {
        newPlayerHadron = { ...hadrons.get(PlayerId) };
      } else {
        newPlayerHadron = {
          id: PlayerId, // The player's own hadron is a unique instance of a hadron with the same ID as the owner.
          typ: 'player',
          x: 0,
          y: 0,
          scn: serverConfiguration.defaultOpeningScene,
        };
      }

      // Always update their name and sprite.
      newPlayerHadron.nam = PlayerName; // Names can be changed, with the UUID staying the same, so we update the client.
      newPlayerHadron.spr = playerData.sprite; // Client should always be sending the requested sprite.
      newPlayerHadron.own = PlayerId; // Player always belongs to and is controlled by player themselves.
      newPlayerHadron.ctr = PlayerId; // Player always belongs to and is controlled by player themselves.

      validateHadron.server(newPlayerHadron);

      hadrons.set(PlayerId, newPlayerHadron);

      // Add user to list of connected players
      connectedPlayerData.set(PlayerId, {
        id: PlayerId,
        name: PlayerName,
        scene: newPlayerHadron.scn,
        socketId: socket.id,
        isAdmin,
      });

      // Join player to the room for the scene that they are in.
      socket.join(newPlayerHadron.scn);

      // Flag their scene as having been updated and queue a hadron broadcast.
      flagSceneHasUpdated(newPlayerHadron.scn);
      throttledSendHadrons();

      // NOTE:
      // The local client won't start the game until they receive
      // their first set of hadrons that includes one to track themselves.

      // Announce new players.
      socket.broadcast.emit('txt', {
        typ: 'chat',
        content: `${PlayerName} has joined the game in ${newPlayerHadron.scn}!`,
      });

      // End of "on join" code.
      // -------------------------------------------------
      // Start list of "when client sends this to us" code.

      socket.on('txt', async (data) => {
        if (validatePlayer(PlayerId, socket, PlayerName)) {
          let name = PlayerName;
          if (data.fromPlayerId) {
            try {
              // User could be offline, so get from database
              const sql = 'SELECT name FROM Users WHERE id = ?';
              const result = await db.query(sql, [data.fromPlayerId]);
              if (result.rows.length > 0) {
                name = result.rows[0].name;
              }
            } catch (e) {
              console.error(
                'Error retrieving user on socket txt:',
                data.fromPlayerId,
              );
              console.error(e.message);
            }
          }
          const dataToSend = {
            name,
            typ: data.typ ? data.typ : 'chat',
            content: data.text,
          };
          if (data.targetPlayerId) {
            if (connectedPlayerData.has(data.targetPlayerId)) {
              socketEmitToId({
                emitToId: connectedPlayerData.get(data.targetPlayerId).socketId,
                socketEvent: 'txt',
                data: dataToSend,
              });
            }
          } else {
            socketEmitToAll({
              socketEvent: 'txt',
              data: dataToSend,
            });
          }
        }
      });

      socket.on('damageHadron', (data) => {
        if (
          hadrons.has(data.id) &&
          connectedPlayerData.has(hadrons.get(data.id).ctr)
        ) {
          if (hadrons.get(data.id).ctr === PlayerId) {
            socket.emit('damageHadron', data);
          } else {
            socket
              .to(connectedPlayerData.get(hadrons.get(data.id).ctr).socketId)
              .emit('damageHadron', data);
          }
        }
      });

      socket.on('hadronData', (data) => {
        if (validatePlayer(PlayerId, socket, PlayerName)) {
          // Look for an existing hadron already in our data that matches the incoming hadron ID,
          // and has the owner's id on it.
          const existingHadron = hadrons.get(data.id);

          // If a hadron moves from one scene to another, both scenes must be flagged as updated
          let previousScene;
          if (existingHadron && existingHadron.scn !== data.scn) {
            previousScene = existingHadron.scn;
          }

          // You cannot update hadrons that you are not in control of.
          if (!existingHadron || existingHadron.ctr === PlayerId) {
            const newHadronData = { ...data };

            if (!existingHadron) {
              // If you introduce a new hadron, then you control it.
              // Ownership never changes on existing hadrons.
              // A client CAN set an owner on the hadron other than themselves, such as for NPCs and their spells
              if (!data.own) {
                newHadronData.own = PlayerId;
              }
              newHadronData.ctr = PlayerId;
            }

            validateHadron.server(newPlayerHadron);

            hadrons.set(data.id, newHadronData);

            if (previousScene) {
              flagSceneHasUpdated(previousScene);
            }
            flagSceneHasUpdated(newHadronData.scn);
            throttledSendHadrons();
            throttledSaveGameStateToDisk();
          }
        }
      });

      socket.on('enterScene', (sceneName) => {
        if (validatePlayer(PlayerId, socket, PlayerName)) {
          // Leave the old room
          socket.leave(connectedPlayerData.get(PlayerId).scene);
          // Update our information about what room the player is in.
          connectedPlayerData.get(PlayerId).scene = sceneName;
          // Join the new room.
          socket.join(sceneName);
          // Move any held items to the new scene with player
          hadrons.forEach((hadron, key) => {
            if (hadron.hld === PlayerId) {
              const newHadronData = hadrons.get(key);
              newHadronData.scn = sceneName;
              hadrons.set(key, newHadronData);
            }
          });

          // Update the Important Item List every time they change scenes.
          importantItemList = updatePlayerImportantItemList({
            PlayerId,
            socketId: socket.id,
            previousImportantItemList: importantItemList,
          });

          // Make sure they get an update and that it includes this room's data
          flagSceneHasUpdated(sceneName);
          throttledSendHadrons();
          throttledSaveGameStateToDisk();
        }
      });

      socket.on('destroyHadron', async (key) => {
        if (validatePlayer(PlayerId, socket, PlayerName) && hadrons.has(key)) {
          // If the hadron was transferred,
          // the controller won't delete the hadron from their own list,
          // so we have to force it to delete the hadron.
          if (
            hadrons.get(key).ctr !== PlayerId &&
            connectedPlayerData.has(hadrons.get(key).ctr)
          ) {
            socketEmitToId({
              emitToId: connectedPlayerData.get(hadrons.get(key).ctr).socketId,
              socketEvent: 'deleteHadron',
              data: key,
            });
          }
          // Give other clients a moment to animate the last moments of the sprite
          // so that it doesn't appear to disappear before hitting the location where it should disappear on their screen
          // Otherwise things seem to de-spawn before hitting walls, for instance.
          await wait(10);
          flagSceneHasUpdated(hadrons.get(key)?.scn);
          hadrons.delete(key);
          throttledSendHadrons();
          throttledSaveGameStateToDisk();
        }
      });

      socket.on('createHadron', (data) => {
        if (validatePlayer(PlayerId, socket, PlayerName)) {
          // Typically this is used to create NPCs from data in the tilemap,
          // although a client could also spawn one of these using internal logic.

          // These come with their own permanent ID, and are not created if they already exist.
          if (!hadrons.has(data.id)) {
            // The hadron could exist in the inactive Map()
            if (inactiveHadrons.has(data.id)) {
              hadrons.set(data.id, { ...inactiveHadrons.get(data.id) });
              inactiveHadrons.delete(data.id);
            } else {
              const newHadronData = { ...data };
              if (!data.own) {
                newHadronData.own = PlayerId;
              }
              newHadronData.ctr = PlayerId;
              if (validateHadron.server(newHadronData)) {
                hadrons.set(data.id, newHadronData);
              }
            }
          }

          // Resurrect all inactive hadrons owned by this hadron.
          inactiveHadrons.forEach((hadron, key) => {
            if (hadron.own === data.id) {
              hadrons.set(key, hadron);
              inactiveHadrons.delete(key);
            }
          });

          flagSceneHasUpdated(data.scn);
          throttledSendHadrons();
          throttledSaveGameStateToDisk();
        }
      });

      socket.on('command', async (data) => {
        if (validatePlayer(PlayerId, socket, PlayerName)) {
          const command = data.command.split(' ');
          if (command.length > 0) {
            if (command[0].toLowerCase() === 'help') {
              let commandHelpOutput = 'The following commands are available:';
              commandListArray.forEach((entry) => {
                if (
                  connectedPlayerData.get(PlayerId)?.isAdmin ||
                  !entry.adminOnly
                ) {
                  commandHelpOutput += `<br/>${entry.name} - ${entry.description}`;
                }
              });
              socket.emit('txt', {
                typ: 'chat',
                content: commandHelpOutput,
              });
            } else if (command[0].toLowerCase() === 'who') {
              let whoResponse = '';
              connectedPlayerData.forEach((entry) => {
                whoResponse += `${entry.name} is in ${entry.scene}<br/>`;
              });
              socket.emit('txt', {
                typ: 'chat',
                content: whoResponse,
              });
            } else if (connectedPlayerData.get(PlayerId)?.isAdmin) {
              console.log(`Admin command from ${PlayerName}:`, command);
              // Admin only commands.
              if (
                (command.length > 2 && command[0].toLowerCase() === 'delete') ||
                command[0].toLowerCase() === 'del'
              ) {
                // Deleting things while the clients are talking to the server
                // often does not work, so we run the delete as part of a
                // server restart.
                const delRequestedHadrons = () => {
                  hadrons.forEach((hadron, key) => {
                    if (
                      hadron.scn !== 'Library' &&
                      hadron[command[1]] === command[2]
                    ) {
                      hadrons.delete(key);
                    }
                  });
                  inactiveHadrons.forEach((hadron, key) => {
                    if (
                      hadron.scn !== 'Library' &&
                      hadron[command[1]] === command[2]
                    ) {
                      inactiveHadrons.delete(key);
                    }
                  });
                };
                closeServer(delRequestedHadrons);
              } else if (
                command[0].toLowerCase() === 'op' &&
                command.length === 2
              ) {
                const playerNameToOp = command[1];
                let playerIdToOp;
                let playerIsAlreadyAdmin;
                let error;
                try {
                  // LIKE allows for case insensitive name comparison.
                  // User names shouldn't be case sensitive.
                  const sql = 'SELECT id, admin FROM Users WHERE name LIKE ?';
                  const result = await db.query(sql, [playerNameToOp]);
                  if (result.rows.length > 0) {
                    playerIdToOp = result.rows[0].id;
                    playerIsAlreadyAdmin = result.rows[0].admin === 1;
                  }
                } catch (e) {
                  error = true;
                  console.error('Error retrieving user on socket command:');
                  console.error(e.message);
                  socket.emit('txt', {
                    typ: 'chat',
                    content: `Error retrieving ${playerNameToOp} from the database`,
                  });
                }
                if (!playerIdToOp) {
                  socket.emit('txt', {
                    typ: 'chat',
                    content: `Player '${playerNameToOp}' does not exist.`,
                  });
                }
                if (playerIsAlreadyAdmin) {
                  socket.emit('txt', {
                    typ: 'chat',
                    content: `Player '${playerNameToOp}' is already an Admin.`,
                  });
                }
                if (
                  !error &&
                  playerIdToOp &&
                  playerIdToOp &&
                  !playerIsAlreadyAdmin
                ) {
                  try {
                    await db.query('UPDATE Users SET admin = 1 WHERE id = ?', [
                      playerIdToOp,
                    ]);
                  } catch (e) {
                    error = true;
                    console.error('Error updating user:');
                    console.error(e.message);
                    socket.emit('txt', {
                      typ: 'chat',
                      content: `Error updating '${playerNameToOp}' database entry.`,
                    });
                  }
                  if (!error) {
                    socket.emit('txt', {
                      typ: 'chat',
                      content: `Player '${playerNameToOp}' has been made Admin.`,
                    });
                    if (connectedPlayerData.get(playerIdToOp)?.socketId) {
                      socket
                        .to(connectedPlayerData.get(playerIdToOp)?.socketId)
                        .emit('txt', {
                          typ: 'chat',
                          content: `You have been made an admin! You must sign in again to apply the update. Your game will now restart to apply it...`,
                        });
                      await wait(3000);
                      socket
                        .to(connectedPlayerData.get(playerIdToOp)?.socketId)
                        .emit('unauthorized', {
                          content: `You have been made an admin! You must sign in again to apply the update. Your game will now restart to apply it...`,
                        });
                    }
                  }
                }
              } else {
                console.error('Unable to parse this command.');
                socket.emit('txt', {
                  typ: 'chat',
                  content: `Unable to parse admin command.`,
                });
              }
            } else {
              socket.emit('txt', {
                typ: 'chat',
                content: `Unknown command.`,
              });
            }
          }
        }
      });

      socket.on('grab', (id) => {
        if (validatePlayer(PlayerId, socket, PlayerName) && hadrons.get(id)) {
          const newHadronData = { ...hadrons.get(id) };
          if (!newHadronData.hld) {
            // Ask controlling client to update hadron.
            socketEmitToId({
              emitToId: connectedPlayerData.get(hadrons.get(id).ctr)?.socketId,
              socketEvent: 'updateHadron',
              data: {
                id,
                updates: [
                  { key: 'own', value: PlayerId }, // Once you grab it, you own it.
                  { key: 'ctr', value: PlayerId }, // You must control it to hold it.
                  { key: 'hld', value: PlayerId }, // You are holding it.
                  { key: 'pod', value: false }, // Held items should NOT persist in the world if you leave.
                  { key: 'tcw', value: false }, // Held items should NOT transfer ownership on scene changes.
                ],
              },
            });
          }
        }
      });

      // Acknowledge pings for latency checking
      socket.on('ping', (callback) => {
        callback();
      });

      socket.on('disconnect', () => {
        if (connectedPlayerData.has(PlayerId)) {
          flagSceneHasUpdated(connectedPlayerData.get(PlayerId).scene);
        }
        connectedPlayerData.delete(PlayerId);

        // Announce player's leaving.
        socket.broadcast.emit('txt', {
          typ: 'chat',
          content: `${PlayerName} has left the game. :'(`,
        });

        // Handle all hadrons owned by this user.
        hadrons.forEach((hadron, key) => {
          if (hadron.own === PlayerId) {
            // Default Behavior
            let deleteHadron = true;
            let archiveHadron = true;

            // "Delete On Disconnect (dod)
            if (hadron.dod) {
              archiveHadron = false;
              deleteHadron = true;
            }

            // "Persist On Disconnect (pod)
            // Unless in the library, don't persist anyone's hadrons there
            if (hadron.pod && hadron.scn !== 'Library') {
              archiveHadron = false;
              deleteHadron = false;
            }

            if (archiveHadron) {
              inactiveHadrons.set(key, { ...hadron });
              // Set the owner back to being the controller.
              inactiveHadrons.get(key).ctr = PlayerId;
            }

            // Hadron Delete code.
            if (deleteHadron) {
              // If the hadron was transferred,
              // the controller won't delete the hadron from their own list,
              // so we have to force it to delete the hadron.
              if (
                hadron.ctr !== PlayerId &&
                connectedPlayerData.has(hadron.ctr)
              ) {
                socket
                  .to(connectedPlayerData.get(hadron.ctr).socketId)
                  .emit('deleteHadron', key);
              }

              // Delete it.
              hadrons.delete(key);
            }
          }
        });
        throttledSendHadrons();
        throttledSaveGameStateToDisk();

        console.log(`${PlayerName} disconnected`);
      });
    } catch (e) {
      if (e) {
        console.error(e.message);
      } else {
        console.error('Failed to handle token receipt.');
      }
      socket.emit('unauthorized');
      await wait(500); // I think the client needs a moment to receive the message and deal with it.
      socket.disconnect();
    }
  });
});

setTimeout(() => {
  // A welcome message for clients already waiting to connect when the server starts.
  io.sockets.emit('txt', {
    typ: 'chat',
    content: 'The Small Hadron Cooperator has recently restarted.',
  });
}, 30000); // Hopefully enough delay for the clients to all be ready.

console.log(`Small Hadron Cooperator is running`);

process.on('SIGINT', () => {
  closeServer();
});

if (process.env.CI_TEST_RUN === 'true') {
  console.log('===========================================');
  console.log('CI Test environment detected,');
  console.log('Server will self-terminate in 45 seconds...');
  setTimeout(() => {
    console.log('===========================================');
    closeServer();
  }, 45000);
}
