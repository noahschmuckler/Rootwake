# Rootwake — working notes

A prototype for a separate, 3D game exploring a "confinement → open vista"
cosmology — spun out of DiggyDwarves' overworld direction (a different repo,
different stack). **Read `DESIGN.md` first** — the design brief, reference
games and the pass-by-pass record. `SYSTEMS.md` holds the systems as they
are meant to work (vitality, vision, shelter, crafting, building);
`ROADMAP.md` holds the pass order to build them. This file is the
practical/dev-workflow half.

## Stack

Three.js + TypeScript + Vite. No framework, no ECS, no state-management
library yet — keep it minimal until Pass 0's feel is actually validated;
don't add structure the prototype doesn't need yet.

## Run / dev

- `npm install` once, then `npm run dev` (Vite dev server, prints a local +
  network URL).
- `npm run build` — type-checks (`tsc --noEmit`) then builds via Vite.
- `npm run preview` — serve the production build locally.

## Status

**Passes 0 through 0.9 judged satisfying on phone; Pass 1.0 (rain that
drains you outdoors, lightning, blueprints and the cabin built at a site,
rest by shelter) built 2026-09-06, awaiting evaluation. Standing rules:
confinement→vista,
objects have weight, nothing "just because" (DESIGN.md, SYSTEMS.md).**
`src/` holds:

- `colors.ts` — five colours = five gem types = five flowers; seeded
  permutation per voxel; the shared PRNG.
- `match3.ts` — pure match-3 core (deal, swap, runs, gravity, cascade,
  re-deal). No Three.js; testable in node.
- `targeting.ts` — swappable run→target strategy: `single` (trees and
  patches), `byColor` (the former per-flower pools), `byColumn` (sketched
  for combat).
- `board3d.ts` — the board as 3D gem meshes on the camera; animates the
  steps the core returns. Tuning constants at the top.
- `projectiles.ts` — the shot from a cleared run to its target; the hit
  feeds the pool. `strike()` sends a held object out and back.
- `interactable.ts` — what main.ts needs from anything it can lock onto
  and feed; implemented by `Voxel`, `Patch`, `CraftSession`, `BuildSite`
  and `Deconstruct`. Status includes 'blocked' and 'planted'; `floorY` is
  what the board must clear when it isn't the ground.
- `recipes.ts` — the recipe table (target, required held object, result
  and count, chips, HP, staged looks, drain) and the filter by what's in
  hand: knapping, and the log recipes behind the hand axe (notch, cut in
  half, cut into long/short timber, cut a notched short log into stubs).
- `craft.ts` — a crafting session: a liftable target hovers ahead, a heavy
  one (a log) is worked where it lies under the patch look-down framing;
  the board plays it, strikes step its look and scatter chips, results land
  in a hand or where the target lay; progress lives on the target across
  back-outs.
- `blueprints.ts` — known structures and their modules as data: pieces
  with a place in the site frame and a tag (course / door / roof / floor /
  bed), a siting (ground / on top / inside), a fits() rule against a
  structure; `blueprintsFor`, `ingredientsText`, `drawPlan` (the menu's plan
  drawing), BUILD_MATERIALS.
- `site.ts` — `BuildSite`: an Interactable at a blueprint's site — the
  luminous ring (green when every ingredient lies inside it), the ghost,
  the board, and each match flying one ingredient from the pile into its
  place; `Deconstruct`: the same backwards, pieces onto a pile out front.
- `structures.ts` — a structure is its placed pieces (real objects, no
  longer collectible) and what the game reads off them: courses / door
  courses / slats / boards / bed counts, `wallTop`, `colliders()` (low wall
  logs block), `dryStrips()` (where rain stops), `shelterAt()`,
  `bedNear()`, `removeLast()`.
- `weather.ts` — dry spells and showers on a clock (`?rain=1` forces the
  first), rain streaks around the camera, `overcast` for the day cycle and
  sky, lightning (flash, delayed crack, near strikes that sap outdoors).
  Tuning constants at the top.
- `growth.ts` — the sapling: three authored stages over GROW_MS;
  PLANT_SEEDS.
- `daylight.ts` — the day cycle: sun/moon/hemisphere/sky/fog by time of
  day; night vision (fed = moonlit and washed, tired = dark with glow);
  overcast and lightning flash from the weather; `sunDirection`.
- `sky.ts` — the visible sky: sun disc + glow, moon opposite, a turning
  star field that fades in at dusk, drifting cloud sprites; rides on the
  camera at dome distance. Generated textures, unlit, unfogged.
- `vitality.ts` — the one stat: drains, food, rest by quality ({bed,
  shelter}: ground ceiling 0.7, bed 0.9, +0.1 for a whole roof), `sap()`
  for lightning (with a 'struck' blackout), collapse with diminishing
  wake-ups (never below WAKE_MIN); bands →
  strength / caps / hands / fan reach; halo, saturation, exposure, blackout
  curves. Tuning constants at the top.
- `objects.ts` — the weight rule: size class (20/5/1 per hand), mass,
  strength, hands-to-lift / hands-to-drag; object types (seed, stick, log,
  lichen, rock, hand_axe, long and short logs raw and notched, the stub,
  long and short timber, chip;
  seeds are food; the notch grid constants; a felled tree gives a long log
  and a short);
  authored crafting looks and `setLook` (multi-part looks: raycast
  recursively); `collectible` flag; the in-the-way waggle; WorldObject/
  ObjectWorld and the felled-tree scatter.
- `hands.ts` — the two hand boxes and the one gesture (drag a box to a
  thing: take / gather / lift / link / place), leashes, fly-to-box, the
  two-hand log drag on a rope, strain; a placeOnTarget hook for things
  that take a stack (tilled patches take seeds); an onRelease hook for a
  whole object let go (unused since 1.0c); a
  HandCondition from vitality (strength, caps, usable hands); hold a food
  box to eat.
- `fell.ts` — the felled-tree ending: release, topple, thud, dust.
- `rig.ts` — hand-placed trunk/branch curves/flowers, instanced per side
  face (1 or 4) around a seeded dark foliage core; invisible hit spheres,
  per-instance materials, merged geometry per part.
- `recede.ts` — the cheap flower recede; tuning constants at the top.
- `resolve.ts` — the 0.2 sink beat, kept behind `TREE_ENDING` for A/B.
- `voxel.ts` — one placed voxel: rig + board + one shared pool (flowers
  recede at 20% steps on every face) + collider + fade + the ending
  (`fell` or `sink`); locks from whichever side face is nearest.
- `patch.ts` — one tillable ground patch: board + one shared pool + four
  authored stages (X-standee grass tufts → dry tufts + clods → clods), a
  blocked state while objects lie on it (look unchanged, lock refused), and
  a planted state that grows a sapling into a tree. Never collides.
- `cameraLock.ts` — pose-to-pose lock/unlock tween; `lockedPoseFor()` is
  the Pass 0 face framing, `lookDownPoseFor()` the patch framing,
  `craftPoseFor()` the hovering-target framing.
- `player.ts` — first- or third-person view (the avatar, a tree pulls the
  camera in) plus waypoint-fan movement; candidates filtered by colliders
  (circles for trees, segments for wall logs) and the world's
  isWalkable(); encumbrance hooks; per-frame push-out from colliders;
  onHop, a still-hold rest gesture, a 'press' role on world objects that
  becomes a long-press, `startMove()` for the walk button (the whole screen
  is look/tap/press: MOVE_ZONE 0), `standHeightAt` (a timber floor lifts
  the eye and the fan), `knock()` for a strike, third-person zoom, and
  `onOrbit` for drags while the camera is locked.
- `world.ts` — the rock plateau cut on a curving cliff line, the cliff
  face, the never-walked landscape 400 below (forest floor, canopies,
  river, three mountain layers), FogExp2, sky dome; isWalkable() and
  distanceToEdge(); exposes sun/moon/hemi/sky/fog for the day cycle.
- `main.ts` — hex-lattice thicket, patch placement, mode-aware input over
  all interactables, board bind/show/hide, shots → pools, locked-view fade
  rule, auto back-out, edge FOV/dip, felling aftermath (shake, scatter,
  footprint), blocked evaluation, hands wiring, vitality wiring (drains,
  halo/filter/exposure/blackout, hints), day cycle + night vision + lichen
  scatter, rock spawning, the long-press menus (recipes, Blueprints…, Take
  apart), the blueprint menu, sites, craft sessions, structures and weather
  wiring (rain drain, lightning, rest quality), the bottom-right tools
  (walk, 1st/3rd, zoom in/out while locked), orbit and zoom of the locked
  framing with the board's clearance kept, HUD,
  `?seed=` / `?slowmo=` / `?debug=` / `?time=` / `?rain=`,
  `window.__rootwake`. UI
  layers have explicit z-indexes above the canvas.

The next pass is whatever `ROADMAP.md` lists next (1.1 once 1.0 is
judged); do not skip ahead in that order without the designer — each pass
exists to answer a question the previous one raised.

## Headless checking

The app can be driven under Playwright with the pre-installed Chromium
(`--use-angle=swiftshader`). `npm run build && npx vite preview --port 4173`
then screenshot; `?slowmo=N` slows animations for frame capture, and
`window.__rootwake` exposes scene/camera/player/voxels for poking.

## Conventions carried over from DiggyDwarves (the sibling project)

- Prefer small, focused commits over big multi-feature passes.
- Keep `tsc --noEmit` (or `npm run build`) green before committing.
- Flag tuning constants and open design questions explicitly in code
  comments/commit messages rather than silently picking an answer — this
  project has several open questions on record (see DESIGN.md) that are
  deliberately left for whoever builds the feature to decide in context.
