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

**Pass 0 built and judged satisfying; Pass 0.1a (camera lock/unlock) built
2026-09-03, awaiting feel evaluation.** `src/` holds:

- `colors.ts` — seeded palette assignment that constructs a guaranteed
  same-colour triple.
- `rig.ts` — hand-placed trunk/branch curves/flowers for the +Z face, plus
  invisible hit spheres for tapping.
- `puzzle.ts` — renderer-agnostic selection/match state (one model; the
  later 6-face mirror should be views onto this, not copies).
- `recede.ts` — the cheap recede (flower slides back along its curve and
  scales out; tube untouched) with the tuning constants at the top.
- `cameraLock.ts` — free-orbit view, tween into the Pass 0 locked framing,
  tween back out; tuning constants at the top.
- `main.ts` — mode-aware input (tap-to-lock in free view, tap-to-select in
  locked view), HUD + "Back out" button, `?seed=` / `?slowmo=` params.

Do **not** start the walkable field, player movement, multiple voxels, or
the 6-face mirror until the designer has judged whether the lock/unlock
transition feels right — see DESIGN.md.

## Conventions carried over from DiggyDwarves (the sibling project)

- Prefer small, focused commits over big multi-feature passes.
- Keep `tsc --noEmit` (or `npm run build`) green before committing.
- Flag tuning constants and open design questions explicitly in code
  comments/commit messages rather than silently picking an answer — this
  project has several open questions on record (see DESIGN.md) that are
  deliberately left for whoever builds the feature to decide in context.
