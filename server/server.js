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
import wait from "./wait.js";
import persistentData from "./persistentData.js";
import jsonMapStringify from "../shared/jsonMapStringify.mjs";
import validateJWT from "./validateJWT.js";
import makeRandomNumber from "../shared/makeRandomNumber.mjs";

console.log("------------------------------");
console.log("Witchazzan server is starting...");

// https://stackoverflow.com/a/64383997/4982408
const __filename = fileURLToPath(import.meta.url);
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

db.query = function (sql, params) {
  const that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error) reject(error);
      else resolve({ rows: rows });
    });
  });
};

// Create an empty sprites Map for game state.
const sprites = new Map();
// Create an empty connectedPlayerData Map for player information.
const connectedPlayerData = new Map();
// Load saved game state into inactiveSprites. They are all inactive until players join.
let inactiveSprites;
try {
  inactiveSprites = await persistentData.readMap(
    `${persistentDataFolder}/sprites.json5`
  );
} catch (error) {
  // File not existing will just return an empty Map to start using.
  // So an actual error is something worse, like the file being corrupted.
  process.exit(1);
}
// TODO: On load wipe any sprites that are owned by users no longer in the database so that deleting a user doesn't leave orphaned sprites.

async function saveGameStateToDisk() {
  // Combine active and inactive sprites into one list Map for saving.
  const spritesToSave = new Map();
  inactiveSprites.forEach((sprite, key) => {
    spritesToSave.set(key, sprite);
  });
  sprites.forEach((sprite, key) => {
    spritesToSave.set(key, sprite);
  });
  // TODO: Call a debounced function to update the game state files.
  await persistentData.writeMap(
    `${persistentDataFolder}/sprites.json5`,
    spritesToSave
  );
}

await saveGameStateToDisk();

// Database functions start here, because they must be inside of an async function to work.
try {
  // Creating the users table if it does not exist.
  const sql_create = `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    );`;
  await db.query(sql_create, []);
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
      const sql_insert =
        "INSERT INTO Users (id, name, password) VALUES ($1, $2, $3);";
      await db.query(sql_insert, [userId, name, hash]);
    });
    res.sendStatus(200);
  } catch (e) {
    console.error("Error creating user:");
    console.error(e.message);
    res.status(500).send("Unknown error creating user.");
  }
});

app.post("/api/login", async (req, res) => {
  async function rejectUnauthorized(res, name) {
    console.log(`Failed login attempt from ${name}.`);
    // A somewhat random wait stalls brute force attacks and somewhat mitigates timing attacks used to guess names.
    // It also prevents client side bugs from crippling the server with inadvertent DOS attacks.
    await wait(makeRandomNumber.between(3, 5) * 1000);
    res.sendStatus(401);
  }
  let name = req.body.name;
  let id;
  let hash;
  let password = req.body.password;
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
    bcrypt.compare(password, hash, function (err, result) {
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
          function (err, token) {
            console.log(`${name} successfully logged in`);
            res.json({ token });
            return;
          }
        );
      } else {
        rejectUnauthorized();
      }
    });
  } else {
    await rejectUnauthorized();
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

// Socket listeners
io.on("connection", (socket) => {
  // User cannot do anything until we have their token and have validated it.
  // The socket connection is entirely unrelated any get/post requests, so we
  // have to do it again even if they used the /auth POST endpoint.
  socket.emit("sendToken");

  // Nothin gelse is available until they have authenticated.
  socket.on("token", async (token) => {
    try {
      const decoded = await validateJWT(
        token,
        serverConfiguration.jwtSecret,
        db
      );
      // We now know that we have a valid authenticated user!
      const name = decoded.name;
      const id = decoded.id;
      console.log(`${name} connected`);
      // TODO: Nesting all of this in here is annoying!

      // TODO: Probably don't need 3 "init" packets. One would do.
      socket.emit("welcome");
      // TODO: I'm not sure if this is required, and it certainly has to be a legit unique ID!
      socket.emit("identity", {
        id,
      });
      // The local client won't start the game until this is received and parsed.
      let connectedPlayerList = [];
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
            connectedPlayerData.set(id, {
              id,
              name,
            });

            // Resurrect all inactive sprites owned by this user.
            inactiveSprites.forEach((sprite, key) => {
              if (sprite.owner === id) {
                sprites.set(key, sprite);
                inactiveSprites.delete(key);
              }
            });

            // If no sprite for the user exists, create one.
            if (!sprites.get(id)) {
              sprites.set(id, {
                id, // The player's own sprite is a unique instance of a sprite with the same ID as the owner.
                owner: id,
                x: 0,
                y: 0,
                scene: "LoruleH8",
                sprite: "bloomby",
              });
            }
            // TODO: Should this be a shared function?
            socket.emit(
              "sprites",
              JSON.stringify(sprites, jsonMapStringify.replacer)
            );

            // Announce new players.
            socket.broadcast.emit("chat", {
              content: `${name} has joined the game!`,
            });

            socket.on("chat", (data) => {
              // TODO: Implement chat targeting a specific user.
              // TODO: Implement per room/scene chat.
              socket.broadcast.emit("chat", {
                name,
                content: data.text,
              });
            });

            socket.on("spriteData", (data) => {
              // TODO: Implement this.
              /*
                  TODO:
                  Instead of "playerData" think this should be spriteData, and it will be anything.
                  The clients all have the ability to spawn, update, and destroy sprites anywhere they please.
                  The server will take this data and consolidate it into a game status object.
                  When any of 1. A player joins, 2. A player leaves, 3. A player sends us a spriteData then:
                   - The server will use a debounce to send this data bundle to all clients. So the debounce rate will be the effective "frame rate" of the server, but it also will be quiet if nothing is happening.

                   The server MAY or MAY NOT, haven't decided yet, cull the data bundle that is sent to each client, i.e. only send a client data for the scene that they are in? Or maybe a broadcast of the entire bundle is fine too?

                   NOTE: There should still be "playerData" that includes at least the scene they are in, because we don't actually know which sprite is "them" from the incoming spriteData, but we want to know that,
                   we also want to be able to act on things like send chat messages only to players who are "in" a given scene, without specifically knowing what sprite is "them".
                   */

              // TODO: Update not only personal player data, but any sprite they care to spawn, update, or destroy.
              // TODO: When we load the game state, wipe any data in it for owner UUID's that do not exist in the database, such that deleting your account also wipes all your data.
              // TODO: Owner ID and Sprite ID should not be the same.
              // Look for an existing sprite already in our data that matches the incoming sprite ID,
              // and has the owner's id on it.
              const existingSprite = sprites.get(data.id);

              // You cannot update other people's sprites.
              if (!existingSprite || existingSprite.owner === id) {
                const newSpriteData = { ...data };

                // If we found an existing sprite, use it to fill in data from the incoming sprite data.
                if (existingSprite) {
                  for (const key in existingSprite) {
                    if (!newSpriteData.hasOwnProperty(key)) {
                      newSpriteData[key] = existingSprite[key];
                    }
                  }
                }

                // The user's authenticated GUID is ALWAYS the owner of sprites they send. You cannot set an alternate owner on a sprite that you created. You also don't need to include the owner id, as it will be added automatically.
                newSpriteData.owner = id;

                // Discard sprites that are missing required data.
                // TODO: Make an array of required fields to always check before adding.
                if (
                  newSpriteData.x &&
                  newSpriteData.y &&
                  newSpriteData.scene &&
                  newSpriteData.sprite
                ) {
                  sprites.set(data.id, newSpriteData);
                }

                // TODO: Should this be a debounced function? And should it ignore the player's own data?
                // TODO: Note that socket has the idea of "rooms" too which could be leveraged to deal with scenes.
                // https://socket.io/docs/v3/emit-cheatsheet/
                socket.broadcast.emit(
                  "sprites",
                  JSON.stringify(sprites, jsonMapStringify.replacer)
                );
                // broadcast skips the sender, so we need to add them, because they need to update their shadow, although in theory they don't need the entire sprite data!
                socket.emit(
                  "sprites",
                  JSON.stringify(sprites, jsonMapStringify.replacer)
                );
              }
            });

            socket.on("command", (data) => {
              // TODO: Implement this.
              console.log("command");
              console.log(data);
            });

            socket.on("disconnect", () => {
              connectedPlayerData.delete(id);

              // Announce new players.
              socket.broadcast.emit("chat", {
                content: `${name} has left the game. :'(`,
              });

              // Archive all sprites owned by this user.
              sprites.forEach((sprite, key) => {
                if (sprite.owner === id) {
                  inactiveSprites.set(key, sprite);
                  sprites.delete(key);
                }
              });
              socket.broadcast.emit(
                "sprites",
                JSON.stringify(sprites, jsonMapStringify.replacer)
              );

              // TODO: Instead of just doing this, use a debounce,
              //       and save it every time it is updated,
              //       both on sprite and disconnect events,
              //       but use debounce to make it actually only like once a minute.
              saveGameStateToDisk();

        console.log(`${name} disconnected`);
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

console.log(`Witchazzan server is running`);

async function closeServer() {
  console.log("Witchazzan shutdown requested:");
  console.log("Disconnecting users and giving them a mo...");
  io.close();
  await wait(1000);
  console.log("Saving game data to disk...");
  await saveGameStateToDisk();
  console.log("Closing Database...");
  await db.close();
  console.log("Witchazzan is going poof! Bye.\n\n");
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
