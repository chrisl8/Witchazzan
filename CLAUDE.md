# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Witchazzan is a multiplayer browser game: a Phaser 3 client (`src/`, bundled by Vite) and a Node.js/Express/socket.io server (`server/`) in one repo. Both are required. Plain JavaScript ES modules, no TypeScript.

## Commands

- `npm run server` — dev server via pm2-dev (auto-restarts; listens on `PORT`, default 8080). First, run `./scripts/versionNumberUpdate.sh` to generate `server/utilities/version.js` (gitignored; the server imports it and won't start without it).
- `npm run client` — Vite dev server on http://localhost:3001 (`vite/config.dev.mjs`).
- `npm run build` — production build (`vite/config.prod.mjs`); memory hungry.
- `npx eslint .` / `npx prettier --check .` — lint/format (configs in repo; not enforced).
- Tests: Playwright e2e in `tests/runGame.spec.js`, run with `./scripts/runTests.sh` (`--headed`, `--reset` to wipe screenshot snapshots) or `npx playwright test -g "<name>"` for one test. Needs client and server running.
- Deploy: `./scripts/updateProduction.sh`. Docker image uses `node:26`; `.dockerignore` excludes `package-lock.json`/`node_modules` on purpose (a stale lockfile pinning `jwa` 1.4.1 crashes on Node 26 via `buffer-equal-constant-time`/`SlowBuffer`).

## Architecture

- **Hadrons** are the game objects (players, NPCs, items, spells), continuously exchanged between clients and server over socket.io (msgpack parser, compressed). Keys are abbreviated to ≤3 chars. Every valid key must be registered in `server/utilities/validateHadron.js` (with description) or it is rejected. Server persists state to `persistentData/hadrons.json5`.
- **Quarks** are hadron templates defined as Tiled map objects (e.g. Type "NPC"); `src/gameLoopFunctions/addQuarksFromMap.js` maps Tiled custom properties to hadron keys. Adding a new NPC property means updating both that file and `validateHadron.js`. (`addLeptonsFromMap.js` handles other map-defined objects.)
- **Client entry**: `src/gameLoopAndSceneFactory.js` sets up scenes and runs the per-frame update loop, which calls the small modules in `src/gameLoopFunctions/` (input, movement, sprites, collisions, NPC behavior, hadron sync). NPC AI pieces live in `src/npcBehaviors/`. Network glue: `src/receiveDataFromServer.js`, `src/sendDataToServer.js`, `src/parseHadronsFromServer.js`.
- **Client state** lives in singleton objects/Maps in `src/objects/` (`playerObject.js` holds settings/defaults; see `src/objects/readme.md`). Sprite sheet metadata: `src/objects/spriteSheetList.js`; scene/tilemap metadata: `src/sceneList.js`.
- **Server** is essentially one large file, `server/server.js` (auth with bcrypt/JWT, sqlite accounts, socket handlers, hadron ownership/transfer between clients, chat `/` commands), plus `server/persistentData.js` and `server/utilities/`. Control of NPCs is delegated to a client in the scene (hence the `tcw`/`pod`/`dod` flags). The server also reads Tiled maps (`mapUtils.js`).
- Persistent data (sqlite DB, `serverConfig.json5`, `hadrons.json5`) lives in `persistentData/`, auto-created and safe to wipe.
- Maps are authored in Tiled: JSON export, CSV layer format, embedded tilesets, 16x16 or 32x32 tiles.

## Notes

- README.md contains detailed how-tos (adding sprites, NPCs and their full property list, tilemap layers) but some paths there say `client/src/...` or `assets/`; the code is now at `src/`.
- After changing NPC properties in maps, existing NPC hadrons are stale; the `/del flv NPC` chat command clears them (restarts the server).
- Title-screen "Enable Phaser Debugging" shows colliders and velocities.
