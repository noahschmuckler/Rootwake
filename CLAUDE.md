# Rootwake — working notes

A prototype for a separate, 3D game exploring a "confinement → open vista"
cosmology — spun out of DiggyDwarves' overworld direction (a different repo,
different stack). **Read `DESIGN.md` first** — it has the full design brief,
reference games, and the current MVP spec (Pass 0). This file is just the
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

**Passes 0 through 0.4 judged satisfying on phone; Pass 0.4c (one pool per
tree, four faces) and Pass 0.5 (cliff-edge vista) built 2026-09-05 as two
commits, awaiting evaluation.** `src/` holds:

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
  feeds the pool.
- `interactable.ts` — what main.ts needs from anything it can lock onto
  and feed; implemented by `Voxel` and `Patch`.
- `rig.ts` — hand-placed trunk/branch curves/flowers, instanced per side
  face (1 or 4) around a seeded dark foliage core; invisible hit spheres,
  per-instance materials, merged geometry per part.
- `recede.ts` — the cheap flower recede; tuning constants at the top.
- `resolve.ts` — the whole-voxel release beat; tuning constants at the top.
- `voxel.ts` — one placed voxel: rig + board + one shared pool (flowers
  recede at 20% steps on every face) + collider + fade + resolve; locks
  from whichever side face is nearest.
- `patch.ts` — one tillable ground patch: board + one shared pool + four
  authored grass→clods stages. Never collides, never resolves.
- `cameraLock.ts` — pose-to-pose lock/unlock tween; `lockedPoseFor()` is
  the Pass 0 face framing, `lookDownPoseFor()` the patch framing.
- `player.ts` — first-person look plus waypoint-fan movement; candidates
  filtered by colliders and the world's isWalkable().
- `world.ts` — the rock plateau cut on a curving cliff line, the cliff
  face, the never-walked landscape 400 below (forest floor, canopies,
  river, three mountain layers), FogExp2, sky dome; isWalkable() and
  distanceToEdge().
- `main.ts` — hex-lattice thicket, patch placement, mode-aware input over
  all interactables, board bind/show/hide, shots → pools, locked-view fade
  rule, auto back-out, edge FOV/dip, HUD, `?seed=` / `?slowmo=`,
  `window.__rootwake`.

Do **not** start the buildable plateau, building/crafting/mining, payout,
regrowth, combat, specials, more species or art until the designer has
judged 0.4c and 0.5 separately — see DESIGN.md.

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
