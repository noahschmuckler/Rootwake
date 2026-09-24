# START HERE — continuous seeded world

Owner request (2026-09-24): implement the terrain/traversal audit, preserve progress for any coding agent, and support eight authored karsts distributed around a finite seeded sphere. Single player, phone first. Prefer room for meaningful faster travel. Starting radius 800 m (about 30 minutes at 2.8 m/s); configurable 1,600 m and beyond.

## Current checkpoint
- Branch: `feat/seeded-world`, based on published village `23ffbfb` from `feat/village`.
- Status: implementation started; no new gameplay published yet.
- Existing live study: https://noahschmuckler.github.io/Rootwake/village/
- Do not mistake `main` for the village source. Publication is `.github/workflows/deploy-village.yml` from `feat/village` to `gh-pages/village/`.
- Baseline: 19 village model tests pass. Browser suite teleports between areas and misses continuous grass crossings.

## Stages and acceptance gates
1. **Shared terrain and vision** — one seeded height sampler and one ground mesh per tile; authored patch falloffs and matching normals/colors; remove duplicate village/karst floors in the integrated study only; one visibility input across forms. Verify actual seed propagation, boundary samples, production build and continuous grass crossing.
2. **Connected traversal** — deterministic procedural root edges with neighboring-chunk context and authored connections; shared surface root controls; safe entry/emergence and rock exclusions. Preserve deep authored routes and climbing. Verify unload/reload identity, graph joins, reversal/exit, no coordinate jumps.
3. **Sphere foundation and playable streaming proof** — cube-sphere addressing, seam-free planet-space noise, eight fixed symmetric feature anchors, local tangent movement, bounded chunk lifecycle, adjustable radius/seed. Verify face edges/corners, repeatable generation and circumnavigation; expose proof as a separate entry until full village mechanics are migrated.
4. **Integration and performance** — migrate complete authored feature simulation/geometry to sphere-local frames, per-feature saves, distance-tiered simulation, detailed/silhouette feature lifecycle, generation budgeting. Do not claim the full village runs on the sphere until this is implemented and tested.
5. **Delivery** — commit tested checkpoints, push branch, open a PR against `feat/village`, update this file with exact commands/results/remaining work. Preserve existing public studies.

## Architecture decisions
- Shared player/joystick remains intact. No new control scheme for existing studies.
- Terrain is a model query; renderers and movement consume the same data.
- Authored ground is a patch in that terrain, never another translucent ground disc.
- Surface roots permit steering/reversal/exit; deep conduits may require a safe opening but must allow reversal.
- Generation depends on seed + generator version + canonical coordinates, never load order.
- Saved state is world descriptor + feature/chunk deltas. Generated baseline is reproducible.
- Sphere proof is explicitly a migration checkpoint, not a claim that eight complete villages are implemented.

## Source map / known defects at baseline
- `src/village.ts`: orchestration, forms, separate `under`; grass ignores karst ownership.
- `src/villageWorld.ts`: radius-84 ground fan overlaps chunk mesh; relief drops world seed.
- `src/chunkModel.ts`, `src/chunkWorld.ts`: 64 m tiles, 5×5 ring, synchronous building; no travel roots; ground lowered to hide overlaps.
- `src/karstFeature.ts`: separate movement/vision, whole feature built upfront, global progress key.
- `src/karstFlowWorld.ts`: duplicate radius-122 floor and opaque bedrock disc.
- `src/villageModel.ts`: static village root graph; tree provider has no root equivalent.
- `src/overworldModel.ts`: flat coordinates and independently saved seed.

## Commands
`npm ci`; `node scripts/test-village.mjs`; `node scripts/test-karst-flow.mjs`; `npm run test:mobility`; `npm run build -- --base=/Rootwake/village/`.
Browser: `node scripts/browser-village.mjs` (requires Playwright Chromium).

## Next action
Implement stage 1. Update this section at every committed checkpoint; list incomplete work honestly.
