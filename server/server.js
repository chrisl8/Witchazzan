import fs from "fs";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import msgpackParser from "socket.io-msgpack-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { randomUUID, randomBytes } from "crypto";
import _ from "lodash";
import persistentData from "./persistentData.js";
import validateJWT from "./validateJWT.js";
// eslint-disable-next-line
import wait from "../shared/wait.mjs";
// eslint-disable-next-line
import jsonMapStringify from "../shared/jsonMapStringify.mjs";
// eslint-disable-next-line
import makeRandomNumber from "../shared/makeRandomNumber.mjs";

const commandListArray = [
  {
    name: "teleportToScene <scene name>",
    description: "Teleport to a scene.",
  },
  { name: "exit", description: "Exit to intro screen." },
  { name: "help", description: "Displays this message." },
  {
    name: "dumpPlayerObject",
    description: "Log player object to console for debugging.",
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
  serverConfiguration.defaultOpeningScene = "LoruleH8";
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

async function saveGameStateToDisk() {
  // Combine active and inactive hadrons into one list Map for saving.
  const hadronsToSave = new Map();
  inactiveHadrons.forEach((hadron, key) => {
    hadronsToSave.set(key, hadron);
  });
  hadrons.forEach((hadron, key) => {
    hadronsToSave.set(key, hadron);
  });
  // TODO: Call a debounced function to update the game state files.
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

// Database functions start here, because they must be inside of an async function to work.
try {
  // Creating the users table if it does not exist.
  const sqlCreate = `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    );`;
  await db.query(sqlCreate, []);
  // Displaying the user table count for fun and debugging.
  const result = await db.query("SELECT COUNT(*) AS count FROM Users", []);
  const count = result.rows[0].count;
  console.log("Registered user count from database:", count);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const app = express();

// TODO: Perhaps lock cors down for production, but open it up for local dev somehow.
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
  parser: msgpackParser, // TODO: I'm not sure if this is faster/better or not. Test?
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
    const sql = "SELECT * FROM Users WHERE name = ?";
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
  const password = req.body.password;
  try {
    const sql = "SELECT id, name, password FROM Users WHERE name = ?";
    const result = await db.query(sql, [name]);
    if (result.rows.length > 0) {
      // We do not confirm or deny that the user exists.
      hash = result.rows[0].password;
      id = result.rows[0].id;
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

function sendHadrons() {
  // TODO: Should we attempt to filter and only send a player the data for the scene they are in and/or ignore their own data?
  // TODO: Note that socket has the idea of "rooms" too which could be leveraged to deal with scenes.
  io.sockets.emit(
    "hadrons",
    JSON.stringify(hadrons, jsonMapStringify.replacer)
  );
}

const throttledSendHadrons = _.throttle(sendHadrons, 50);

// Socket listeners
io.on("connection", (socket) => {
  // User cannot do anything until we have their token and have validated it.
  // The socket connection is entirely unrelated to any get/post requests, so we
  // have to validate the token again even if they used the /auth POST endpoint before.
  // TODO: In theory, if they do not send their token, they remain connected,
  //       and hence will receive broadcast messages, even though nothing they send will
  //       be processed. How do we prevent this?
  socket.emit("sendToken");

  // Nothing else is available until they have authenticated.
  socket.on("token", async (playerData) => {
    try {
      const decoded = await validateJWT(
        playerData.token,
        serverConfiguration.jwtSecret,
        db
      );
      // We now know that we have a valid authenticated user!
      const PlayerName = decoded.name;
      const PlayerId = decoded.id;
      console.log(`${PlayerName} connected`);

      // Send player their ID, because there is no other easy way for them to know it.
      // This also servers as the "game is read" "init" message to the client.
      socket.emit("init", {
        id: PlayerId,
        name: PlayerName,
        defaultOpeningScene: serverConfiguration.defaultOpeningScene,
      });

      // The local client won't start the game until they receive
      // their first set of hadrons that includes one to track themselves.
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

      // Add user to list of connected players
      connectedPlayerData.set(PlayerId, {
        id: PlayerId,
        name: PlayerName,
      });

      // Resurrect all inactive hadrons owned by this user.
      inactiveHadrons.forEach((hadron, key) => {
        if (hadron.owner === PlayerId) {
          hadrons.set(key, hadron);
          inactiveHadrons.delete(key);
        }
      });

      // Create or update the player's hadron
      let newPlayerHadron;
      if (hadrons.has(PlayerId)) {
        newPlayerHadron = { ...hadrons.get(PlayerId) };
      } else {
        newPlayerHadron = {
          id: PlayerId, // The player's own hadron is a unique instance of a hadron with the same ID as the owner.
          owner: PlayerId,
          x: 0,
          y: 0,
          scene: serverConfiguration.defaultOpeningScene,
        };
      }

      // Always update their name and sprite.
      newPlayerHadron.name = PlayerName; // Names can be changed, with the UUID staying the same, so we update the client.
      newPlayerHadron.sprite = playerData.sprite; // Client should always be sending the requested sprite.

      hadrons.set(PlayerId, newPlayerHadron);

      throttledSendHadrons();

      // Announce new players.
      socket.broadcast.emit("chat", {
        content: `${PlayerName} has joined the game!`,
      });

      socket.on("chat", (data) => {
        // TODO: Implement chat targeting a specific user.
        // TODO: Implement per room/scene chat.
        socket.broadcast.emit("chat", {
          name: PlayerName,
          content: data.text,
        });
        // Send back to user also.
        // TODO: Create a more elegant solution to seeing your own chats,
        //       including colorizing them.
        // It is nice to use the server to echo them back, to help you know that it is working,
        // and in theory give you a better sense of what order the messages actually show up in
        // for everybody else.
        socket.emit("chat", {
          name: PlayerName,
          content: data.text,
        });
      });

      socket.on("makePlayerSayOff", (key) => {
        if (hadrons.has(key) && hadrons.get(key).name) {
          socket.broadcast.emit("chat", {
            name: hadrons.get(key).name,
            content: "Oof!",
          });
          socket.emit("chat", {
            name: hadrons.get(key).name,
            content: "Oof!",
          });
        }
      });

      socket.on("hadronData", (data) => {
        // Look for an existing hadron already in our data that matches the incoming hadron ID,
        // and has the owner's id on it.
        const existingHadron = hadrons.get(data.id);

        // You cannot update other people's hadrons.
        if (!existingHadron || existingHadron.owner === PlayerId) {
          const newHadronData = { ...data };

          // The user's authenticated GUID is ALWAYS the owner of hadrons they send. You cannot set an alternate owner on a hadron that you created. You also don't need to include the owner id, as it will be added automatically.
          newHadronData.owner = PlayerId;

          // Discard hadrons that are missing required data.
          // TODO: Make an array of required fields to always check before adding.
          // TODO: Honestly, do they need an x, y, sprite? Maybe some don't. Clients might just need to learn to deal.
          if (
            newHadronData.x &&
            newHadronData.y &&
            newHadronData.scene &&
            newHadronData.sprite
          ) {
            hadrons.set(data.id, newHadronData);
          }

          throttledSendHadrons();
          throttledSaveGameStateToDisk();
        }
      });

      socket.on("destroyHadron", (key) => {
        // You cannot update other people's hadrons.
        if (hadrons.has(key) && hadrons.get(key).owner === PlayerId) {
          hadrons.delete(key);
          throttledSendHadrons();
          throttledSaveGameStateToDisk();
        }
      });

      socket.on("command", (data) => {
        if (data.command === "help") {
          socket.emit("chat", {
            content: commandHelpOutput,
          });
        } else {
          console.log("command");
          console.log(data);
        }
      });

      socket.on("disconnect", () => {
        connectedPlayerData.delete(PlayerId);

        // Announce player's leaving.
        socket.broadcast.emit("chat", {
          content: `${PlayerName} has left the game. :'(`,
        });

        // Archive all hadrons owned by this user.
        // TODO: Some hadrons may need to stay, so we should have a flag for that.
        hadrons.forEach((hadron, key) => {
          if (hadron.owner === PlayerId) {
            inactiveHadrons.set(key, hadron);
            hadrons.delete(key);
          }
        });
        throttledSendHadrons();
        throttledSaveGameStateToDisk();

        console.log(`${PlayerName} disconnected`);
      });
    } catch (e) {
      console.log("Failed to authenticate token.");
      console.log(e);
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
  console.log("Shutdown requested:");
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
