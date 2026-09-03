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

**Scaffold only.** `src/main.ts` is a bare running Three.js scene (camera,
renderer, one light rig, a placeholder cube standing in for a voxel) —
nothing about the actual game is built. `DESIGN.md`'s "MVP scope — Pass 0"
section is the next thing to build: the trunk/branch/flower rig for one
voxel face, click-to-select-3-same-color matching, and the vine-recede
animation. That's the whole deliverable of this first pass — resist scope
creep into movement, the 6-face mirror, or the other characters until Pass
0's feel is validated (see DESIGN.md for why).

## Conventions carried over from DiggyDwarves (the sibling project)

- Prefer small, focused commits over big multi-feature passes.
- Keep `tsc --noEmit` (or `npm run build`) green before committing.
- Flag tuning constants and open design questions explicitly in code
  comments/commit messages rather than silently picking an answer — this
  project has several open questions on record (see DESIGN.md) that are
  deliberately left for whoever builds the feature to decide in context.
