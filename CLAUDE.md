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

**Pass 0 and 0.1a judged satisfying on phone; Pass 0.2 (the confinement→
vista thicket) built 2026-09-04, awaiting evaluation.** `src/` holds:

- `colors.ts` — seeded palette assignment that constructs a guaranteed
  same-colour triple.
- `rig.ts` — hand-placed trunk/branch curves/flowers for the +Z face, a
  seeded dark foliage mass so the cube blocks sightlines, invisible hit
  spheres, per-instance materials.
- `puzzle.ts` — renderer-agnostic selection/match state (one model; the
  later 6-face mirror should be views onto this, not copies).
- `recede.ts` — the cheap flower recede; tuning constants at the top.
- `resolve.ts` — the whole-voxel release beat (stragglers, twist-and-sink,
  ring, sparks, flash); tuning constants at the top.
- `voxel.ts` — one placed voxel instance: rig + puzzle + recede + collider
  + fade + resolve, and the tap handling.
- `cameraLock.ts` — pose-to-pose lock/unlock tween; `lockedPoseFor()` is
  the Pass 0 framing for any voxel.
- `player.ts` — first-person touch/keyboard movement scaffolding.
- `world.ts` — dark pocket, hedge wall, canopy, one bright opening, plain,
  hills, fog.
- `main.ts` — thicket layout, mode-aware input, locked-view fade rule,
  auto back-out, HUD, `?seed=` / `?slowmo=` params, `window.__rootwake`
  debug handle.

Do **not** start the 6-face mirror, a real field, other characters or art
until the designer has judged whether the thicket delivers the
confinement→vista feeling — see DESIGN.md.

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
