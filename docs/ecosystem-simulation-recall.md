# Recall: the "evolutionary ecosystem" simulation (carrots + herbivores)

Status: **dead concept, recovered from old code for a future planning session.**
This document records what the old code *did*, what it was *clearly trying to do*, and where the two differ.
It is not a design for the current game.

Method: static reading of the code and git history. **Nothing here was run.** Claims are tagged:

- **[code]** — directly stated by the source.
- **[inferred]** — my deduction from the code (arithmetic, ordering effects). Worth verifying if it matters.
- **[history]** — from commit messages/diffs, i.e. design intent or discarded ideas.

## 1. Where the code lives

| What | Where | Notes |
|---|---|---|
| The simulation (Clojure server) | https://github.com/doby162/witchazzan-server @ `12b16af` (2020-07-19, last commit) | 372 commits, 2019-09 → 2020-07. The server was Clojure/http-kit then, not today's Node server. |
| Core logic | `src/witchazzan/behavior.clj` (452 lines) | Carrot, herbivore, spell, player behaviors; `reproduce`, `die`, genes. |
| Game loop, clock, spawning | `src/witchazzan/world.clj` | `game-loop`, `keep-time!`, `coordinate-spawns`, `seed-nature`. |
| State helpers | `src/witchazzan/common.clj` | `find-empty-tile`, `active-pieces`, settings, tilemap processing. |
| Pathfinding | `src/witchazzan/astar.clj` | Used by herbivores. |
| Tuning constants | `config/default-config.edn` | See section 4. |
| Observability | `src/witchazzan/api.clj` | `/api/plants`, `/api/graph` (see section 9). |
| Contributor guide | `doc/intro.md`, `README.md` | Describes the *earlier* mail-queue architecture; partly stale. |
| Rendering (client) | https://github.com/doby162/witchazzan-client (a fork of this repo's old client) | `src/scenes/sceneFactory.js` (~lines 455–665). Branch `carrot-tinting` has the color work. |
| Same client history | **this repo's** early git history, 2019-12 → 2020-07 | Commits `49a3fad`, `827b73c`, `234a210`, `4e15c08`, `2e1801b`, `3f3d727`, `a4843d4`, `26b371c`. Sprites/maps only; server logic is not in this repo. |

**Local backup (use this one if GitHub ever disappears):** `https://forgejo.jamnapari-goblin.ts.net/Chris10/witchazzan-server` (private, tailnet only). A plain copy of `doby162/witchazzan-server` made on 2026-11-12, `master` at `12b16af`, 372 commits, identical to GitHub at the time. It is *not* a live mirror. The matching client history is already in this repo's own git history (and its Forgejo copy, `Chris10/Witchazzan`), since `witchazzan-client` was the same codebase; `doby162/witchazzan-client` itself was not copied. The Forgejo token comes from `k9-secret forgejo`.

Possibly-related, **not yet read**: `doby162/eco-game` (Common Lisp, 2017, "not done yet, not fully planned out yet"), `doby162/tempo` (2017), `doby162/Geomyidae` (2025, "a game").

The server's own tagline (GitHub description): *"Witchazzan is an agent based simulation, providing an environment in which simple genetic creatures interact and compete."*

## 2. The core idea

A closed-ish energy economy with two species and heritable traits:

```
sun ──photosynthesis──▶ CARROT ──eaten (÷5)──▶ HERBIVORE
                          │  ▲                     │  ▲
                 hunger ◀─┘  │ reproduce      hunger ◀─┘  │ reproduce
                          (energy ÷3, mutated genes)
```

- **Energy** is the single currency. Everything gains it, spends it (hunger), and reproduces by splitting it.
- **Genes** are integers 0–255 that mutate by ±1 per generation. The only evolving, fitness-relevant trait in the final code is `:repro-threshold` (how much energy a creature must hoard before it reproduces).
- **Population self-regulation** is intended to emerge, not be scripted: carrots crowd each other out; herbivores starve when carrots are scarce; carrots recover when herbivores die off. The code's only *scripted* intervention is an extinction-recovery respawn (section 7).

## 3. The entities

All entities are Clojure `agent`s holding a map, stored in a global set. Each tick, every active piece is sent its type's `behavior` function, which returns the next state (`defmulti behavior :type`).

### 3.1 Carrot (`:type :carrot`) — the vegetation
Spawn state [code, `spawn-carrot`]:
`energy 20`, `health 1`, `parent-id -1`, `sprite "carrot"`, genes `{:repro-threshold r, :color r}` where each `r` is uniform random 0–255.

Per-tick behavior order [code, `defmethod behavior :carrot`]:
1. `photosynthesis` — gain energy if sunny **and** not crowded.
2. `carrot-repro-decide` — if `energy > genes.repro-threshold`, `reproduce`.
3. `teleport` — scene-exit tiles (carriers of the map "Teleport" layer) move it between scenes, like any piece.
4. `hunger` — lose energy; if energy < 0, `die` (deletes the piece).
5. `hit-points` — if `health < 1`, `die`.

Never moves. Reproduces into a *random empty tile in the same scene* (not adjacent — see 5.4).

### 3.2 Herbivore (`:type :herbivore`) — the animal
Spawn state [code, `spawn-herbivore`]:
`energy 50`, `health 1`, genes `{:repro-threshold r}`, `sprite "herbivore"` (the "lilolyon" sheet), plus `:vector` (a future used to throttle walking).

Per-tick behavior order [code, `defmethod behavior :herbivore`]:
1. If it has no destination or its path is empty → `herbivore-choose-dest`.
2. `walk-step` — advance one tile along the path.
3. `munch #{:carrot}` — eat any carrot on its current tile.
4. `carrot-repro-decide` — same rule as carrots (the name is reused; it is generic).
5. `teleport`, `hunger`, `hit-points` (as above).

Notes:
- **No photosynthesis.** Its only income is eating.
- **Destination choice** [code]: pick a **uniformly random carrot in the same scene**; if none exist, pick a random empty tile (so it wanders). Not nearest, not biggest, not color-based. Path via A\* (`astar.clj`) over the scene's collision layer ("Stuff You Run Into"): walkable tile cost 1, blocked tile cost 100; the path is accepted only if total cost < 99 (i.e. it never has to cross a wall). Otherwise it keeps its old (possibly nil) destination and retries next tick.
- **It eats whatever carrot it steps on**, not just its target [code: `munch` checks the current tile each tick].
- **Speed is fixed**, not a gene: one tile per `idle-millis-per-frame` = 500 ms (the setting's name is a misnomer here — it is reused as the walk-step duration). [code/inferred]
- After eating, `munch` sets `:path` to two copies of the current tile, so it idles briefly before choosing a new target. [code]
- **Herbivores are not seeded at boot** — only by map spawn points (section 7).

### 3.3 Other pieces that interact with the ecosystem
- **Spells** [code]: `fireball` does `health -1` to every piece it touches (except its caster/itself) → kills carrots and herbivores (health 1) and hurts players. `teleball` teleports touched pieces to a random empty tile. `push` shoves them 1–3 tiles. So players are an **external disturbance**: they can cull, scatter, or relocate organisms. [inferred that this was a feature, not an accident; the 2020-05-30 commit `b16464a` says "spells with the spell type fireball lower health and destroy plants".]
- **Players** [code]: have `energy 100` and the same `hunger` step, but `die :player` is a stub: it logs "would die if we implemented death" and resets health/energy. Players cannot eat carrots in the final code.
- **Slimes** [history]: an *earlier* predator (Dec 2019 → Mar 2020). Chased players, "can now kill players and eat carrots" (`daac702`), had a **speed gene** whose value was also their hourly energy cost (`gene-speed`; faster = hungrier: a speed/energy trade-off). Disabled by the Apr 2020 rewrite; `coordinate-spawns` still has the slime spawn commented out. Not in the final ecosystem.

## 4. The numbers (from `config/default-config.edn`)

| Setting | Value | Meaning |
|---|---|---|
| `millis-per-hour` | 60000 | One in-game hour = 60 s real time → **a day (24 h) = 24 min**. |
| `hours-per-day` / `dawn` / `sunset` | 24 / 6 / 20 | `sunny?` is true for hours strictly between 6 and 20 → hours 7–19 (**13 daylight hours**), and never in scenes whose name matches `Cave`. |
| `hunger` | 1 | Energy lost per in-game hour (applied every tick as `delta × hunger/millis-per-hour`). |
| `photosynthesis` | 3 | Energy gained per sunny in-game hour, if uncrowded. |
| `crowding-factor` | 2 | A carrot is crowded if **any other carrot** in its scene is within ±2 tiles on both x and y (a 5×5 box). |
| `herbivore-efficiency` | 5 | Herbivore gains `eaten.energy / 5` (20% transfer — a deliberate trophic-level loss). |
| `gene-max` | 255 | Gene range 0–255. |
| `starting-carrots` | 2 | See `seed-nature`: this produces **3** passes (the loop is `n=0,1,2`), one carrot per scene per pass. [inferred from code] |
| `min-millis-per-frame` / `idle-millis-per-frame` | 15 / 500 | Tick pacing for active / player-less scenes. |

Derived [inferred — arithmetic only]:
- A sunny, uncrowded carrot nets **+3×13 − 24 = +15 energy/day**; shaded/crowded/cave carrots net **−24/day** (they starve).
- A starting carrot (20 energy) in the dark dies in about 20 in-game hours.
- A herbivore (50 energy) with no food starves after ~50 in-game hours (~2 days ≈ 50 real minutes).
- A carrot is worth `20/5 = 4` energy (at spawn) to a herbivore = 4 hours of hunger. A fully grown carrot (say 100 energy) is worth 20 hours.
- Reproducing from threshold `T` takes a carrot roughly `(T − 20)/15` days of uncrowded sun. `T=100` ≈ 5 days (~2 real hours).

Everything is scaled by elapsed wall-clock `delta`, so behavior is tick-rate independent; empty scenes just tick slower (500 ms).

## 5. Genetics and reproduction in detail

### 5.1 Reproduction rule [code]
`if energy > genes.repro-threshold → reproduce`:
- Child = a copy of the parent (`merge this {...}`) with: **mutated genes**, **a new random empty tile in the same scene**, **energy = parent.energy / 3**, `parent-id = parent.id`, new `id`.
- Parent's energy also becomes `energy / 3`. So reproduction costs 2/3 of the parent's energy and creates a child holding 1/3: **energy is not conserved** — 1/3 is destroyed each reproduction. (Plausibly intentional: reproduction has a cost.)
- Same logic for herbivores (separate `defmethod`, identical body).
- Reproduction is asexual, single parent.

### 5.2 Mutation [code: `mutate-genes`, `normalize-genes`]
Each gene independently: `+1`, `0`, or `−1` with equal probability. `normalize-genes` then **wraps** out-of-range values: `>255 → value − 255`, `<0 → value + 255` (so 256→1, −1→254). Wrapping means a gene at 0 can jump to 254, which for `repro-threshold` flips "reproduces instantly" to "practically never" in a single generation. [inferred side effect — probably unintended]

Mutation is *tiny* relative to the 0–255 range, and initial genes are uniformly random. So evolution here is mostly **selection on standing variation** from the founding population, with slow drift — not rapid adaptation. [inferred]

### 5.3 What each gene is for
- `:repro-threshold` (carrot & herbivore) — the one real fitness trait. Expected selection dynamics [inferred, unverified]:
  - **Too low:** offspring are born with `energy/3`, and hunger pushes small-energy pieces below 0 quickly, so they die. Very low thresholds (≲ the 20 starting energy) can reproduce *every tick*; each reproduction divides energy by 3 again, and each child inherits the same low threshold → a burst of tiny-energy offspring that then starve. See 5.4 for the risk this creates.
  - **Too high:** never reaches the threshold (a carrot nets ~+15/day, capped only by crowding), or reaches it too late and loses the race for space.
  - **Middle:** wins. That was presumably the experiment: watch the population mean of `:repro-threshold` converge. `/api/graph` exists to do exactly this (section 9).
- `:color` (carrot) — **neutral marker, no fitness effect in the code**. Because mutation is ±1, color is a visible lineage tag: neighbors descended from one parent look alike, and clusters/color drift make descent and selection visible to the player. The client maps it to a sprite (section 8). [inferred intent]
- `:leech-seed` (carrot) — a **stub** that was added and then dropped. In `cd22428` (2020-06-05) carrots got a `:leech-seed` gene and an `init-piece` hook that set `:leech-seed true` if the gene > 200. Nothing ever read the flag. The name suggests parasitism/stealing energy from neighbors, but there is no code for it. [history]
- `:repro-chance` — existed in the very early version (Dec 2019, `3cf07bd`): reproduction required both `energy ≥ threshold` **and** `repro-chance ≥ rand(255)`. Later removed; final rule is threshold only. [history]
- `:speed` — slime-only (Jan 2020), minimum 1, cost = hourly energy. Gone. [history]

### 5.4 Known gaps/bugs in the final code (relevant if this is ever revived)
- **Dispersal is global within a scene.** The child lands on any random empty walkable tile, not next to the parent. There is no local seed dispersal, so spatial structure (patches, waves of growth and grazing) will not form on its own; crowding is the only spatial effect. [code]
- **`find-empty-tile` can return `nil`** (full scene). `reproduce` does not check, so the child would get `x = y = nil`. The older `plant-reproduce` (Feb 2020) did check and fall back. [code/inferred]
- **Child inherits stale parent fields** because it is `(merge this ...)`: for herbivores this includes `:path`, `:destination`, and the shared `:vector` future. [code/inferred]
- **`hunger`'s `die` is a side effect whose return value is discarded** in the `->` chain; death works because `die` deletes the piece from the global set, but the agent keeps running its remaining steps for that tick. (The final commit `12b16af`, "error on destroyed carrots after death", moved `hunger`/`hit-points` to the end of the chain to reduce errors from this.) [code/history]
- **Caves have no photosynthesis** by *name match* (`#"Cave"`), added as a stand-in "in lieu of a biome system" (`3145d71`). Herbivores spawn in the cave `CaveF8` — a place with no carrots growing unless the herbivore leaves — see 7. [code/history]
- The final commit was a bug fix; I haven't checked whether the live population actually reached a stable equilibrium. The 2019-12-14 commit `b63b614` says it ran the carrot-only sim "for a couple hundred days to make sure it won't crash."

## 6. The clock and the day/night cycle
`keep-time!` runs on its own thread (once per `idle-millis-per-frame`): computes `hour` and `day` from `start-time`, broadcasts chat messages at dawn ("Dawn of day N") and sunset ("Night Falls"), and on each hour change calls `coordinate-spawns`. Day/night matters because **photosynthesis only happens in daylight and never in caves** while hunger is constant: so carrots are net-negative at night and net-positive by day.

Admin helpers existed to change speed (`ten-x`, `tenth-x`, `short-day` = 600 ms/hour) so evolution could be observed in minutes rather than hours.

## 7. Spawning and extinction recovery
- **At server boot** (`seed-nature`): spawn a carrot on a random empty tile in **every scene**, 3 passes (see `starting-carrots`). This includes caves and towns, where carrots just starve (no light). [code/inferred]
- **Map spawn points** (Tiled objects named `spawn-carrot` / `spawn-herbivore`, read from each scene's "Objects" layer): at each in-game hour change, `coordinate-spawns` checks the **whole world**: if there are **zero** herbivores, it spawns one at *every* `spawn-herbivore` point; if there are **zero** carrots, one at every `spawn-carrot` point. So: no ecosystem permanently dies out, and these points are the "genesis" locations. [code]
- Known spawn points in the old client's maps (`witchazzan-client` master): `spawn-herbivore` in `CaveF8` at tile (11,4); `spawn-carrot` in `LoruleI8` at tile (5,3). (The original carrot spawn commit `827b73c` put it in `LoruleH8`.) The herbivore was added to the "yonder cave" by Michael Dorian (doby162), `234a210`, 2020-07-03.
- After a total herbivore extinction the recovery stock is **fresh random genes**, so evolutionary progress is lost on every extinction. [inferred]

## 8. Player-facing presentation (client)
From `witchazzan-client/src/scenes/sceneFactory.js`:
- **Carrot color = genetics:** `spriteId = floor(28 × genes.color / 255)` → one of **28 carrot sprites** (`carrot01..carrot28`; the commit "28 carrot flavors"). Earlier versions used 3 color genes (r, g, b) and a Phaser tint ("more correctly simulate rgb color space"), then collapsed to a single color gene (`46c6c49`, 2020-07-12) once sprite variants existed. [code/history]
- **Carrot size = energy:** display size scaled by `energy / 100` (commit "Veggie sprites change size based on energy"). So a player can *see* which carrots are thriving/starving, and fruitful ones can exceed 1× (energy > 100). [code]
- Herbivore is the "lilolyon" sprite sheet (15×15 frames, 7 fps animation, faces left).
- Each tick the server broadcast a `game-piece-list` per scene containing every active piece's full map (minus `:socket` and `:vector`), so `:genes` and `:energy` reached the client as-is; the client had no ecosystem logic of its own. [code]

## 9. How the author watched evolution
- `GET /api/plants` — JSON dump of every active carrot (genes, energy, parent-id, position).
- `GET /api/graph` — plain-text/ASCII histogram, count, mean, median, mode of the carrots' `:repro-threshold` (`analyze-gene`, `ascii-graph`). This is *the* instrument: it shows the population's threshold distribution drifting over time.
- `parent-id` was added (`7066ca8`, 2020-06-13) specifically so lineage could be traced.
- The REPL workflow in `doc/intro.md`: pause, inspect/modify pieces, single-step with `(game-loop)`.

## 10. Design evolution (so the "why" is not lost)
1. **Dec 2019** — carrots as simple clonal plants (`basic carrot`, `nature seeder`, `f76a25b`); genes introduced (`f300016`, `3cf07bd`); mutation (`b63b614`); crowding (`a7228ff`).
2. **Dec 2019–Mar 2020** — mail-queue architecture (pieces send each other "mail"; hourly ticks). Slimes as predators of players/carrots with a speed gene. Eating mechanics (`daac702`).
3. **Mar–Apr 2020** — "Big silly refactor" (`1ab3d7d`); carrots re-implemented as agents; photosynthesis/hunger as continuous, delta-scaled constants (`8d43504`, 2020-04-19); crowding setting (`189f8ab`); no-photosynthesis-in-caves (`3145d71`).
4. **May–Jun 2020** — fireballs kill plants; carrot color genes (`3990650`, `ab3466a`); gene analysis + ASCII graph (`4f1a45e`); `parent-id`; seed-nature renovated (`446edfd`); `leech-seed` stub.
5. **Jun–Jul 2020** — the **herbivore**: groundwork (`1931b3d`), first version (`8f31fa0`, 2020-07-03), A\* pathfinding (`fd77f6f`, `d530c7f`), herbivore sprite and size/color rendering. Slimes mothballed. Last commit 2020-07-19.

### Earlier rule sets (superseded, but they show the intent)
The final constants were not the first attempt. Verified in the commit diffs:

| Date / commit | Rule |
|---|---|
| 2019-12-08 `5504a75` | Photosynthesis: +2 energy per hourly tick in daylight, −1 at night. |
| 2019-12-11 `f76a25b` | Reproduce when energy > **10000** (hard-coded); child gets energy ÷ **4**. "No genetics yet, nor any particular AI to speak of." |
| 2019-12-13 `3cf07bd` | Genetics arrive: reproduce only when `energy ≥ repro-threshold` **and** `repro-chance ≥ rand(255)`; child energy ÷ **3**; photosynthesis ±1. |
| 2019-12-14 `a7228ff` | **Gradient crowding:** daylight gain = `0.1 × (11 − neighbors in the 3×3 tiles)`, so each neighbor cost 10% of growth, and it hit zero at 11 neighbors. Replaced in Apr 2020 by the **binary** 5×5 `crowded?` test (`189f8ab`). |
| Feb 2020 `cf645e2` | Same gradient (`1 × (11 − neighbors)`), flat −1 hunger per hour, delete when energy ≤ 0. |
| 2020-04-19 `8d43504` | Continuous, wall-clock-scaled constants (`hunger`, `photosynthesis` in config). **Reproduction and mutation were temporarily switched off** in that commit while tuning, and later restored. |

So the crowding mechanic went gradient → binary, and the reproduce-chance gene was dropped. Whether that was a considered tuning choice or just simplification isn't recorded.

The arc: *plants alone → plants + player-chasing predator → plants + a true herbivore that eats them, with genetics all the way.* The herbivore only existed for **about two weeks** of development before the project moved on, so the predator-prey half is far less mature than the plant half.

## 10b. Coverage: what was and wasn't checked
Checked:
- Full read of final `behavior.clj`, `world.clj`, `common.clj`, `default-config.edn`, `doc/intro.md`; relevant parts of `api.clj`, `comms.clj`, README; the diffs of the key design commits (the ones cited above).
- Every server-repo commit message (372) was scanned by keyword. The server has only one branch (`master`), no deleted source files other than config, and no open or closed issues about the ecosystem (its 33 PRs are all infra/scenes/CORS).
- Client repo: all 7 non-master branches are 0 commits ahead of master, so nothing is hidden there. Commits mentioning carrots/herbivores/energy are all listed in section 1.
- This repo's history: the client-side ecosystem rendering (`genes.color` sprite choice, energy sizing) existed from 2020-07-12 and was removed during the 2022 refactors (`c690318`, `321bfed`, `e3426e7`, `d66f2c2`). It is not in the current tree, and there are no `genes`/`energy`/`herbivore` references under `src/` or `server/` today.
- The GitHub wikis for the server and client repos are enabled but do not exist (404), and there are no forks. A GitHub repo search for "witchazzan" returns only `chrisl8/Witchazzan`, `doby162/witchazzan-server`, and `chrisl8/witchazzan-watchdog`.

Not checked / limits:
- I did **not** read every intermediate commit diff for Jan–Jun 2020, only the ones above plus keyword hits. Small tuning decisions made there may be missing.
- `astar.clj` is third-party code ("thank you planjure", github.com/elben/planjure: Manhattan-distance A\*). I read only how `behavior.clj` calls it.
- `gh` is not authenticated on this machine, so I could only see **public** GitHub data. Private repos, or anything on doby162's side that isn't public, would not appear.
- Nothing outside GitHub and this machine: no chat logs, Discord, issue trackers, notes, or screenshots of the sim running. The most valuable missing piece is probably doby162's own recollection of how it behaved in practice and what he was going for with `leech-seed`.
- I never ran the Clojure server, so every dynamic claim is unverified.

## 11. Questions to settle in planning (not answered by the code)
These are the points where the old code is silent or accidental. Left for the planning session — no recommendations here.
1. Is `:repro-threshold` the only evolving trait, or should herbivores get movement/speed/efficiency genes (the slimes' speed-for-energy trade-off is a ready-made precedent)?
2. Should seed dispersal be local (adjacent tiles) to get spatial dynamics, or keep teleport-anywhere-in-scene?
3. What was `:leech-seed` meant to be?
4. Herbivores pick random carrots: should they prefer nearby/large/specific-color ones, which would give `:color` real selection pressure?
5. How do players interact: only as fire/cull disturbance, or as eaters/farmers/hunters (slimes hunted players)?
6. Biomes: caves were hard-coded as "no sun". Is there a per-map/per-layer growth property intended?
7. Persistence/extinction: respawn with fresh genes (old behavior) vs. save lineages.
8. Where does this live in today's architecture? (Today: hadrons exchanged over socket.io, NPC control delegated to a client in the scene, state saved to `persistentData/hadrons.json5`. The old design ran **entirely server-side** with one agent per organism. Authority for hundreds of reproducing carrots across ~100 scenes is a fundamentally different problem under client-delegated NPC control.)
9. Scale: the old config seeded ~3 carrots in every one of ~100 scenes at boot and simulated all scenes continuously, even with no players.
