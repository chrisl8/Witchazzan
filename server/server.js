import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
// https://stackoverflow.com/a/64383997/4982408
import { fileURLToPath } from "url";
import { dirname } from "path";
import { randomUUID } from "crypto";
import ipAddress from "./ipAddress.js";

// https://stackoverflow.com/a/64383997/4982408
const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

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
app.use(express.static(`${dirName}/../client/dist`));

// parse application/json
app.use(bodyParser.json());

async function server() {
  const webServer = app.listen(webserverPort);
  const io = new Server(webServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // TODO: Implement this idea for login, which seems good and simple to me:
  // https://stackoverflow.com/a/21165297/4982408

  // TODO: Use bcrypt fo generate and store password hashes
  // https://www.npmjs.com/package/bcrypt

  // TODO: Implement a sqlite database for storing user data
  //       Use a GUID for the player ID instead of just a incrementing int,
  //       and use that when sending/receiving playerdata and spritedata on the wire.

  // TODO: Implement a JSON5 blob dump for storing game state,
  //       only to be read on a server restart.

  const gameState = {
    players: [],
    sprites: [],
  };

  app.post("/api/sign-up", (req, res) => {
    req.json().then((data) => {
      console.log(data);
    });
  });

  app.post("/api/auth", (req, res) => {
    req.json().then((data) => {
      console.log(data);
    });
  });

  app.get("/api/me", (req, res) => {
    res.json({ username: "try finger", admin: true });
  });

  app.get("/api/log-out", (req, res) => {
    console.log(req);
  });

  // Socket listeners
  io.on("connection", (socket) => {
    // TODO: Generate this when a client sets up an account and then use/store it in the DB
    const playerUUID = randomUUID();
    const address = socket.request.connection.remoteAddress;
    console.log(`Connection from ${address}`);

    // TODO: Better init message, and check that they are logged in and give them the data they need
    socket.emit("welcome");

    socket.on("disconnect", () => {
      // TODO: Can I provide more information than this?
      console.log("user disconnected");
    });

    socket.on("login", (data) => {
      // TODO: Actually check to ensure teh client is logged in.
      console.log(data);
      // TODO: I'm not sure if this is required, and it certainly has to be a legit unique ID!
      socket.emit("identity", {
        id: playerUUID,
      });
      // The local client won't start the game until this is received and parsed.
      // TODO: This should be a function that is called, because it will happen a lot!
      socket.emit("gamePieceList", {
        pieces: [
          {
            id: playerUUID, // This ignores everyone else. LOL TODO: Fix.
            x: 0,
            y: 0,
            scene: "LoruleH8",
            sprite: "bloomby",
          },
        ],
      });
    });

    socket.on("chat", (data) => {
      // TODO: Implement this.
      console.log("chat");
      console.log(data);
    });

    socket.on("playerData", (data) => {
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

      // TODO: Ensure that players can only update their OWN data (player and sprites) based on their JWT.
      // TODO: Update not only personal player data, but any sprite they care to spawn, update, or destroy.
      console.log("playerData");
      console.log(data);
      // TODO: Owner ID and Sprite ID should not be the same.
      const playerSpriteIndex = gameState.sprites.findIndex((sprite) => {
        return sprite.id === playerUUID;
      });
      console.log(playerSpriteIndex);
      const newSpriteData = { ...data };
      newSpriteData.id = playerUUID;
      if (playerSpriteIndex !== -1) {
        for (const key in gameState.sprites[playerSpriteIndex]) {
          if (!newSpriteData.hasOwnProperty(key)) {
            newSpriteData[key] = gameState.sprites[playerSpriteIndex][key];
          }
        }
      }
      // TODO: Make a list of required fields to always check before adding.
      // Do not add bogus data to the game state.
      if (
        newSpriteData.x &&
        newSpriteData.y &&
        newSpriteData.scene &&
        newSpriteData.sprite
      ) {
        if (playerSpriteIndex === -1) {
          gameState.sprites.push(newSpriteData);
        } else {
          gameState.sprites[playerSpriteIndex] = newSpriteData;
        }
      }

      // TODO: Iterate over incoming object and add anything else in it to the gameState, because the clients are allowed to add essentially arbitrary data to the gameState for a given sprite.
      console.log(gameState.sprites);
      // TODO: Should this be a debounced function? And should it ignore the player's own data?
      // TODO: Note that socket has the idea of "rooms" too which could be leveraged to deal with scenes.
      // https://socket.io/docs/v3/emit-cheatsheet/
      socket.broadcast.emit("gamePieceList", {
        pieces: gameState.sprites,
      });
      // broadcast skips the sender, so we need to add them, because they need to update their shadow.
      socket.emit("gamePieceList", {
        pieces: gameState.sprites,
      });
    });

    socket.on("command", (data) => {
      // TODO: Implement this.
      console.log("command");
      console.log(data);
    });

    socket.on("disconnect", () => {
      // TODO: Save their data for later reuse. to locate them where they left off, etc.
      const playerSpriteIndex = gameState.sprites.findIndex((sprite) => {
        return sprite.id === playerUUID;
      });
      if (playerSpriteIndex !== -1) {
        gameState.sprites.splice(playerSpriteIndex, 1);
      }
      socket.broadcast.emit("gamePieceList", {
        pieces: gameState.sprites,
      });
      console.log(`Player ${playerUUID} disconnected.`);
    });
  });

  console.log(
    `Web server is running at: http://${ipAddress()}:${webserverPort}/`
  );
}

/*
TODO: When a player disconnects:
0. Mark all of their data as "dead" or "disconnected" or something, so we can keep it long enough to save it, but also know that it is ready to purge.
1. Send a "destroy" for all sprites to everyone so they know to remove them.
2. Save their data to the database, so we can recall it later.

If we are afraid of the server juts crashing without doing a DB save, we could set up a periodic save to DB.
Perhaps have the disconnect just call that same sort of "debounced" save and purge of the irrelevant data.
 */

export default server;

try {
  await server();
} catch (e) {
  console.error("Server failed with error:");
  console.error(e);
}
