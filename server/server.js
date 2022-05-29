import fs from "fs";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { randomUUID, randomBytes } from "crypto";
import _ from "lodash";
import persistentData from "./persistentData.js";
import validateJWT from "./validateJWT.js";
// eslint-disable-next-line
import wait from "../shared/wait.mjs";
// eslint-disable-next-line
import makeRandomNumber from "../shared/makeRandomNumber.mjs";
// eslint-disable-next-line
import validateHadron from "../shared/validateHadron.mjs";

// Every time the server starts it creates a unique GUID,
// this forces the clients to reload if the server reloaded,
// which avoids all kinds of weird problems,
// as well as ensuring client code updates when an update is pushed to the server.
const serverVersion = randomUUID();

const hadronBroadcastThrottleTime = 50;

const commandListArray = [
  {
    name: "teleportToScene <scene name>",
    description: "Teleport to a scene.",
  },
  {
    name: "who",
    description: "List currently online players.",
  },
  { name: "exit", description: "Exit to intro screen." },
  { name: "help", description: "Displays this message." },
  {
    name: "dumpPlayerObject",
    description: "Log player object to console for debugging.",
  },
  {
    name: "dumpClientSprites",
    description: "Log clientSprites Map() to console for debugging.",
  },
  {
    name: "deleteAllNPC",
    description:
      "Delete all NPC data from the server so that they must respawn from Tilemap data.",
  },
];
let commandHelpOutput = "The following commands are available:";
commandListArray.forEach((command) => {
  commandHelpOutput += `<br/>${command.name} - ${command.description}`;
});

console.log("------------------------------");
console.log("Witchazzan server is starting...");

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
    `${persistentDataFolder}/serverConfiguration.json5`
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
  serverConfiguration.jwtSecret = randomBytes(64).toString("hex");
}
if (!serverConfiguration.jwtExpiresInSeconds) {
  serverConfiguration.jwtExpiresInSeconds = 60 * 60 * 24 * 7; // 1 week
}
if (!serverConfiguration.gameStateSaveInterval) {
  serverConfiguration.gameStateSaveInterval = 60 * 1000; // 1 minute
}
if (!serverConfiguration.defaultOpeningScene) {
  serverConfiguration.defaultOpeningScene = "CamelopardalisH8";
}
// The file is always rewritten, so the formatting will get fixed if it is bad.
await persistentData.writeObject(
  `${persistentDataFolder}/serverConfiguration.json5`,
  serverConfiguration
);

// Persistent user data in SQLite database.
// If the database doesn't exist, it will be created.
const dbName = `${persistentDataFolder}/database.sqlite`;
const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
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

// Create an empty hadrons Map for game state.
const hadrons = new Map();
// Create an empty connectedPlayerData Map for player information.
const connectedPlayerData = new Map();
// Load saved game state into inactiveHadrons. They are all inactive until players join.
let inactiveHadrons;
try {
  inactiveHadrons = await persistentData.readMap(
    `${persistentDataFolder}/hadrons.json5`
  );
} catch (error) {
  // File not existing will just return an empty Map to start using.
  // So an actual error is something worse, like the file being corrupted.
  process.exit(1);
}
// TODO: On load wipe any hadrons that are owned by users no longer in the database so that deleting a user doesn't leave orphaned hadrons.

// Resurrect any "Persist On Disconnect (pod)" hadrons immediately.
inactiveHadrons.forEach((hadron, key) => {
  if (hadron.pod) {
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
    hadronsToSave
  );
  console.log("Game state saved to disk.");
}
const throttledSaveGameStateToDisk = _.throttle(
  saveGameStateToDisk,
  serverConfiguration.gameStateSaveInterval
);

// Invoke immediately to ensure data is saved and formatted correctly,
// in case it was edited by hand while the server was not running.
await saveGameStateToDisk();

// Database initialization.
try {
  // Creating the users table if it does not exist.
  const sqlCreateUserTable = `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      admin INTEGER DEFAULT 0
    );`;
  await db.query(sqlCreateUserTable, []);
  // Displaying the user table count for fun and debugging.
  const result = await db.query("SELECT COUNT(*) AS count FROM Users", []);
  const count = result.rows[0].count;
  console.log("Registered user count from database:", count);

  // Creating the users table if it does not exist.
  const sqlCreateConnectionsTable = `CREATE TABLE IF NOT EXISTS Connections (
      id TEXT,
      timestamp INTEGER
    );`;
  await db.query(sqlCreateConnectionsTable, []);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const app = express();

// TODO: Perhaps lock cors down for production, but open it up for local dev somehow?
const options = {
  origin: true,
  credentials: true,
};
app.use(cors(options));
app.options("*", cors()); // include before other routes

const webserverPort = process.env.PORT || 8080;

// All web content is housed in the website folder
app.use(express.static(`${__dirname}/../client/dist`));

// parse application/json
app.use(bodyParser.json());

const webServer = app.listen(webserverPort);
const io = new Server(webServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.post("/api/sign-up", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  let error;
  if (name === password) {
    error = "Name and password cannot be the same.";
  }
  if (!name || name.length < 2) {
    error = "Names must be at least 2 characters long";
  } else if (name.length > 72) {
    error = "Names must be a maximum of 72 characters long";
  }
  if (!password || password.length < 8) {
    error = "Password must be at least 8 characters long";
  } else if (password.length > 72) {
    error = "Password must be a maximum of 72 characters long";
  }
  if (error) {
    res.status(400).send(error);
    return;
  }

  try {
    // LIKE allows for case insensitive name comparison.
    // User names shouldn't be case sensitive.
    const sql = "SELECT * FROM Users WHERE name LIKE ?";
    const result = await db.query(sql, [name]);
    if (result.rows.length > 0) {
      res.status(400).send("Name already exists");
      return;
    }
  } catch (e) {
    console.error("Error creating user:");
    console.error(e.message);
    res.status(500).send("Unknown error creating user.");
    return;
  }

  const userId = randomUUID();

  try {
    bcrypt.hash(password, serverConfiguration.saltRounds, async (err, hash) => {
      const sqlInsert =
        "INSERT INTO Users (id, name, password) VALUES ($1, $2, $3);";
      await db.query(sqlInsert, [userId, name, hash]);
    });
    res.sendStatus(200);
  } catch (e) {
    console.error("Error creating user:");
    console.error(e.message);
    res.status(500).send("Unknown error creating user.");
  }
});

app.post("/api/login", async (req, res) => {
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
  const password = req.body.password;
  try {
    // LIKE allows for case insensitive name comparison.
    // User names shouldn't be case sensitive.
    const sql = "SELECT id, name, password, admin FROM Users WHERE name LIKE ?";
    const result = await db.query(sql, [name]);
    if (result.rows.length > 0) {
      // We do not confirm or deny that the user exists.
      hash = result.rows[0].password;
      id = result.rows[0].id;
      admin = result.rows[0].admin;
    }
  } catch (e) {
    console.error("Error retrieving user:");
    console.error(e.message);
    res.status(500).send("Unknown error.");
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
          },
          serverConfiguration.jwtSecret,
          {
            expiresIn: serverConfiguration.jwtExpiresInSeconds,
          },
          (innerErr, token) => {
            console.log(`${name} successfully logged in`);
            res.json({ token });
          }
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
app.post("/api/auth", async (req, res) => {
  try {
    await validateJWT(req.body.token, serverConfiguration.jwtSecret, db);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(401);
  }
});

app.get("/api/connections", async (req, res) => {
  try {
    const sql =
      "SELECT name, timestamp FROM Connections LEFT JOIN Users ON Connections.id = Users.id ORDER BY timestamp DESC";
    const result = await db.query(sql);
    let prettyOutput = `<html lang="en-US"><head><title>Connections</title></head><body><table><thead><tr><th>User</th><th>Login Time</th></thead></tbody>`;
    let previousEntry = {};
    result.rows.forEach((entry) => {
      console.log();
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
    prettyOutput += "</tbody></table></body></html>";
    res.send(prettyOutput);
  } catch (e) {
    console.error("Error retrieving connections:");
    console.error(e.message);
    res.status(500).send("Unknown error.");
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
      if (connectedPlayerData.get(hadron.ctrl)?.scene !== hadron.scn) {
        if (hadron.tcwls) {
          // Find a new controller for the hadron.
          let newControllerFound = false;
          connectedPlayerData.forEach((player, playerKey) => {
            if (!newControllerFound && player.scene === hadron.scn) {
              newControllerFound = true;
              // eslint-disable-next-line no-param-reassign
              hadron.ctrl = playerKey;
            }
          });
        }
      }

      // Add hadron to this scene's Map
      perSceneHadronList[hadron.scn].set(key, hadron);
    }
  });

  // Loop through each scene's hadrons
  for (const [key, value] of Object.entries(perSceneHadronList)) {
    // Send all of these hadrons to every player who is in the room with the same name as the scene
    io.sockets.to(key).emit("hadrons", Array.from(value.entries()));
  }
}

const throttledSendHadrons = _.throttle(
  sendHadrons,
  hadronBroadcastThrottleTime
);

function flagSceneHasUpdated(sceneName) {
  if (updatedSceneList.indexOf(sceneName) === -1) {
    updatedSceneList.push(sceneName);
  }
}

// Socket listeners
io.on("connection", (socket) => {
  // User cannot do anything until we have their token and have validated it.
  // The socket connection is entirely unrelated to any get/post requests, so we
  // have to validate the token again even if they used the /auth POST endpoint before.
  // TODO: In theory, if they do not send their token, they remain connected,
  //       and hence will receive broadcast messages, even though nothing they send will
  //       be processed. How do we prevent this?
  //       Although the only think that is broadcast is chat messages, it still seems incorrect to leave
  //       this hole open if it really exists.
  socket.emit("sendToken");

  // Nothing else is available until they have authenticated.
  socket.on("token", async (playerData) => {
    // This code runs every time a player joins.
    // Look down below for the list of "events" that the client can send us and will be responded to.
    try {
      const decoded = await validateJWT(
        playerData.token,
        serverConfiguration.jwtSecret,
        db
      );
      // We now know that we have a valid authenticated user!
      const PlayerName = decoded.name;
      const PlayerId = decoded.id;
      const isAdmin = decoded.admin;
      console.log(`${PlayerName} connected`);

      // Send player their ID, because there is no other easy way for them to know it.
      // This also servers as the "game is ready" "init" message to the client.
      socket.emit("init", {
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
          socket.emit("chat", {
            content: `${connectedPlayerList.join(", ")} ${
              connectedPlayerList.length === 1 ? "is" : "are"
            } currently online.`,
          });
        }, 1000);
      }

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
          typ: "player",
          x: 0,
          y: 0,
          scn: serverConfiguration.defaultOpeningScene,
        };
      }

      // Always update their name and sprite.
      newPlayerHadron.name = PlayerName; // Names can be changed, with the UUID staying the same, so we update the client.
      newPlayerHadron.sprt = playerData.sprite; // Client should always be sending the requested sprite.
      newPlayerHadron.own = PlayerId; // Player always belongs to and is controlled by player themselves.
      newPlayerHadron.ctrl = PlayerId; // Player always belongs to and is controlled by player themselves.

      validateHadron.server(newPlayerHadron);

      hadrons.set(PlayerId, newPlayerHadron);

      // Add user to list of connected players
      connectedPlayerData.set(PlayerId, {
        id: PlayerId,
        name: PlayerName,
        scene: newPlayerHadron.scn,
        socketId: socket.id,
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
      socket.broadcast.emit("chat", {
        content: `${PlayerName} has joined the game in ${newPlayerHadron.scn}!`,
      });

      // End of "on join" code.
      // -------------------------------------------------
      // Start list of "when client sends this to us" code.

      socket.on("chat", async (data) => {
        let name = PlayerName;
        if (data.fromPlayerId) {
          try {
            // User could be offline, so get from database
            const sql = "SELECT name FROM Users WHERE id = ?";
            const result = await db.query(sql, [data.fromPlayerId]);
            if (result.rows.length > 0) {
              name = result.rows[0].name;
            }
          } catch (e) {
            console.error("Error retrieving user:", data.fromPlayerId);
            console.error(e.message);
          }
        }
        socket.broadcast.emit("chat", {
          name,
          content: data.text,
        });
        // Send back to user also so their chat windows makes sense.
        socket.emit("chat", {
          name,
          content: data.text,
        });
      });

      socket.on("damageHadron", (data) => {
        if (
          hadrons.has(data.id) &&
          connectedPlayerData.has(hadrons.get(data.id).ctrl)
        ) {
          if (hadrons.get(data.id).ctrl === PlayerId) {
            socket.emit("damageHadron", data);
          } else {
            socket
              .to(connectedPlayerData.get(hadrons.get(data.id).ctrl).socketId)
              .emit("damageHadron", data);
          }
        }
      });

      socket.on("hadronData", (data) => {
        // Look for an existing hadron already in our data that matches the incoming hadron ID,
        // and has the owner's id on it.
        const existingHadron = hadrons.get(data.id);

        // If a hadron moves from one scene to another, both scenes must be flagged as updated
        let previousScene;
        if (existingHadron && existingHadron.scn !== data.scn) {
          previousScene = existingHadron.scn;
        }

        // You cannot update hadrons that you are not in control of.
        if (!existingHadron || existingHadron.ctrl === PlayerId) {
          const newHadronData = { ...data };

          if (!existingHadron) {
            // If you introduce a new hadron, then you control it.
            // Ownership never changes on existing hadrons.
            // A client CAN set an owner on the hadron other than themselves, such as for NPCs and their spells
            if (!data.own) {
              newHadronData.own = PlayerId;
            }
            newHadronData.ctrl = PlayerId;
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
      });

      socket.on("enterScene", (sceneName) => {
        // Leave the old room
        socket.leave(connectedPlayerData.get(PlayerId).scene);
        // Update our information about what room the player is in.
        connectedPlayerData.get(PlayerId).scene = sceneName;
        // Join the new room.
        socket.join(sceneName);
        // Make sure they get an update and that it includes this room's data
        flagSceneHasUpdated(sceneName);
        throttledSendHadrons();
        throttledSaveGameStateToDisk();
      });

      socket.on("destroyHadron", (key) => {
        if (hadrons.has(key)) {
          // If the hadron was transferred,
          // the controller won't delete the hadron from their own list,
          // so we have to force it to delete the hadron.
          if (
            hadrons.get(key).ctrl !== PlayerId &&
            connectedPlayerData.has(hadrons.get(key).ctrl)
          ) {
            socket
              .to(connectedPlayerData.get(hadrons.get(key).ctrl).socketId)
              .emit("deleteHadron", key);
          }
          flagSceneHasUpdated(hadrons.get(key).scn);
          hadrons.delete(key);
          throttledSendHadrons();
          throttledSaveGameStateToDisk();
        }
      });

      socket.on("createHadron", (data) => {
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
            console.log(data.own, PlayerId);
            newHadronData.ctrl = PlayerId;
            if (validateHadron.server(newHadronData)) {
              hadrons.set(data.id, newHadronData);
              flagSceneHasUpdated(newHadronData.scn);
              throttledSendHadrons();
              throttledSaveGameStateToDisk();
            }
          }
        }
      });

      socket.on("command", (data) => {
        if (data.command === "help") {
          socket.emit("chat", {
            content: commandHelpOutput,
          });
        } else if (data.command === "who") {
          let whoResponse = "";
          connectedPlayerData.forEach((entry) => {
            whoResponse += `${entry.name} is in ${entry.scene}<br/>`;
          });
          socket.emit("chat", {
            content: whoResponse,
          });
        } else if (
          data.command === "deleteallnpc" ||
          data.command === "deleteallnpcs"
        ) {
          hadrons.forEach((hadron, key) => {
            if (hadron.typ === "npc") {
              hadrons.delete(key);
            }
          });
          inactiveHadrons.forEach((hadron, key) => {
            if (hadron.typ === "npc") {
              inactiveHadrons.delete(key);
            }
          });
        } else {
          console.log("command");
          console.log(data);
        }
      });

      socket.on("disconnect", () => {
        if (connectedPlayerData.has(PlayerId)) {
          flagSceneHasUpdated(connectedPlayerData.get(PlayerId).scene);
        }
        connectedPlayerData.delete(PlayerId);

        // Announce player's leaving.
        socket.broadcast.emit("chat", {
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
            if (hadron.pod) {
              archiveHadron = false;
              deleteHadron = false;
            }

            if (archiveHadron) {
              inactiveHadrons.set(key, { ...hadron });
              // Set the owner back to being the controller.
              inactiveHadrons.get(key).ctrl = PlayerId;
            }

            // Hadron Delete code.
            if (deleteHadron) {
              // If the hadron was transferred,
              // the controller won't delete the hadron from their own list,
              // so we have to force it to delete the hadron.
              if (
                hadron.ctrl !== PlayerId &&
                connectedPlayerData.has(hadron.ctrl)
              ) {
                socket
                  .to(connectedPlayerData.get(hadron.ctrl).socketId)
                  .emit("deleteHadron", key);
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
      console.log("Failed to authenticate token.");
      if (e) {
        console.log(e);
      }
      // A somewhat random wait stalls brute force attacks and somewhat mitigates timing attacks used to guess names.
      // It also prevents client side bugs from crippling the server with inadvertent DOS attacks.
      await wait(makeRandomNumber.between(3, 5) * 1000);
      socket.emit("unauthorized");
      await wait(500); // I think the client needs a moment to receive the message and deal with it.
      socket.disconnect();
    }
  });
});

setTimeout(() => {
  // A welcome message for clients already waiting to connect when the server starts.
  io.sockets.emit("chat", {
    content: "Welcome. The Small Hadron Cooperator has recently started.",
  });
}, 2000); // Hopefully enough delay for the clients to all be ready.

console.log(`Small Hadron Cooperator is running`);

async function closeServer() {
  console.log("Shutdown requested. PLEASE BE PATIENT! Working on it...");
  io.sockets.emit("chat", {
    content: "The Small Hadron Cooperator is shutting down.",
  });
  console.log("Disconnecting users and giving them a mo...");
  io.close();
  await wait(1000);
  console.log("Saving game state (hadrons) to disk...");
  // Flush would only run it if it was requested, so we cancel and force it,
  // although in theory if flush didn't call it, no changes were made.
  await throttledSaveGameStateToDisk.cancel();
  await saveGameStateToDisk();
  console.log("Closing Database...");
  await db.close();
  console.log("Small Hadron Cooperator is going poof! Bye.\n\n");
  process.exit();
}

process.on("SIGINT", () => {
  closeServer();
});

if (process.env.CI === "true") {
  console.log("===========================================");
  console.log("CI Test environment detected,");
  console.log("Server will self-terminate in 45 seconds...");
  setTimeout(() => {
    console.log("===========================================");
    closeServer();
  }, 45000);
}
