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

**Passes 0 through 0.3 judged satisfying on phone; Pass 0.4 (tree-density
enclosure + ground tilling) built 2026-09-04 as two commits, awaiting
evaluation.** `src/` holds:

- `colors.ts` — five colours = five gem types = five flowers; seeded
  permutation per voxel; the shared PRNG.
- `match3.ts` — pure match-3 core (deal, swap, runs, gravity, cascade,
  re-deal). No Three.js; testable in node.
- `targeting.ts` — swappable run→target strategy: `byColor` (voxels),
  `single` (patches), `byColumn` (sketched for combat).
- `board3d.ts` — the board as 3D gem meshes on the camera; animates the
  steps the core returns. Tuning constants at the top.
- `projectiles.ts` — the shot from a cleared run to its target; the hit
  feeds the pool.
- `interactable.ts` — what main.ts needs from anything it can lock onto
  and feed; implemented by `Voxel` and `Patch`.
- `rig.ts` — hand-placed trunk/branch curves/flowers for the +Z face, a
  seeded dark foliage mass, invisible hit spheres, per-instance materials,
  merged geometry per part.
- `recede.ts` — the cheap flower recede; tuning constants at the top.
- `resolve.ts` — the whole-voxel release beat; tuning constants at the top.
- `voxel.ts` — one placed voxel: rig + board + five HP pools + recede +
  collider + fade + resolve.
- `patch.ts` — one tillable ground patch: board + one shared pool + four
  authored grass→clods stages. Never collides, never resolves.
- `cameraLock.ts` — pose-to-pose lock/unlock tween; `lockedPoseFor()` is
  the Pass 0 face framing, `lookDownPoseFor()` the patch framing.
- `player.ts` — first-person look plus waypoint-fan movement.
- `world.ts` — rock ground (near displaced field + far plain), haze, sun,
  pale hills. No enclosure geometry: the trees do that now.
- `main.ts` — hex-lattice thicket, patch placement, mode-aware input over
  all interactables, board bind/show/hide, shots → pools, locked-view fade
  rule, auto back-out, HUD, `?seed=` / `?slowmo=`, `window.__rootwake`.

Do **not** start payout/economy, regrowth, combat, specials, the 6-face
mirror, more species or art until the designer has judged 0.4a and 0.4b
separately — see DESIGN.md.

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
