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

**Passes 0 through 0.7b judged satisfying on phone; Pass 0.8 (rocks, the
long-press recipe menu, the knapped hand axe) built 2026-09-05, awaiting
evaluation. Standing rules: confinement→vista,
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
  and feed; implemented by `Voxel`, `Patch` and `CraftSession`. Status
  includes 'blocked' and 'planted'.
- `recipes.ts` — the recipe table (target, required held object, result,
  HP, staged looks, drain) and the filter by what's in hand.
- `craft.ts` — a crafting session: the target hovers ahead, the board plays
  it, strikes step its look, the result lands in a hand; progress lives on
  the target across back-outs.
- `growth.ts` — the sapling: three authored stages over GROW_MS;
  PLANT_SEEDS.
- `daylight.ts` — the day cycle: sun/moon/hemisphere/sky/fog by time of
  day; night vision (fed = moonlit and washed, tired = dark with glow);
  `sunDirection`.
- `sky.ts` — the visible sky: sun disc + glow, moon opposite, a turning
  star field that fades in at dusk, drifting cloud sprites; rides on the
  camera at dome distance. Generated textures, unlit, unfogged.
- `vitality.ts` — the one stat: drains, food, rest, collapse with
  diminishing wake-ups; bands → strength / caps / hands / fan reach; halo,
  saturation, exposure, blackout curves. Tuning constants at the top.
- `objects.ts` — the weight rule: size class (20/5/1 per hand), mass,
  strength, hands-to-lift / hands-to-drag; object types (seed, stick, log,
  lichen, rock, hand_axe; seeds are food); authored crafting looks and
  `setLook`; `collectible` flag; the in-the-way waggle; WorldObject/
  ObjectWorld and the felled-tree scatter.
- `hands.ts` — the two hand boxes and the one gesture (drag a box to a
  thing: take / gather / lift / link / place), leashes, fly-to-box, the
  two-hand log drag on a rope, strain; a placeOnTarget hook for things
  that take a stack (tilled patches take seeds); a HandCondition from
  vitality (strength, caps, usable hands); hold a food box to eat.
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
- `player.ts` — first-person look plus waypoint-fan movement; candidates
  filtered by colliders and the world's isWalkable(); encumbrance hooks;
  per-frame push-out from colliders; onHop, a still-hold rest gesture, and
  a 'press' role on world objects that becomes a long-press.
- `world.ts` — the rock plateau cut on a curving cliff line, the cliff
  face, the never-walked landscape 400 below (forest floor, canopies,
  river, three mountain layers), FogExp2, sky dome; isWalkable() and
  distanceToEdge(); exposes sun/moon/hemi/sky/fog for the day cycle.
- `main.ts` — hex-lattice thicket, patch placement, mode-aware input over
  all interactables, board bind/show/hide, shots → pools, locked-view fade
  rule, auto back-out, edge FOV/dip, felling aftermath (shake, scatter,
  footprint), blocked evaluation, hands wiring, vitality wiring (drains,
  halo/filter/exposure/blackout, hints), day cycle + night vision + lichen
  scatter, rock spawning, the recipe menu and craft sessions, HUD,
  `?seed=` / `?slowmo=` / `?debug=` / `?time=`, `window.__rootwake`. UI
  layers have explicit z-indexes above the canvas.

The next pass is whatever `ROADMAP.md` lists next (0.9 once 0.8 is
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
