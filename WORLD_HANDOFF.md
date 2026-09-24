# START HERE — continuous seeded world

Owner request (2026-09-24): implement the terrain/traversal audit, preserve progress for any coding agent, and support eight authored karsts distributed around a finite seeded sphere. Single player, phone first. Prefer room for meaningful faster travel. Starting radius 800 m (about 30 minutes at 2.8 m/s); configurable 1,600 m and beyond.

## Current checkpoint
- Branch: `feat/seeded-world`, based on published village `23ffbfb` from `feat/village`.
- Status: terrain/root integration and sphere proof implemented, verified in GitHub Chromium (run 36059181155 on b095e33) and locally with the pre-installed Chromium; published as a preview beside the village, never over it: https://noahschmuckler.github.io/Rootwake/world/ (the village on the shared terrain and root network) and https://noahschmuckler.github.io/Rootwake/world/planet.html (the sphere streaming proof). The live village at /village/ is untouched.
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

## Implementation checkpoint (2026-09-24)
- `worldTerrain.ts`: one seeded sampler, 2 m triangles shared with collision, authored karst relief and smooth patch falloff, globally sampled normals.
- `groundVision.ts`: bounded view through soil using alpha hashing/depth writing, avoiding transparent tile sorting. Village and integrated karst no longer draw duplicate floor discs. Standalone karst keeps its floor.
- `worldRoots.ts`, `rootNetworkWorld.ts`: chunk-owned procedural roots, coordinate-stable hubs, authored sockets, unified shallow/deep traversal data, bounded root geometry. Village entry/steering uses this graph. Grass excludes rock; double-tap in shallow soil behaves alike everywhere; deep exits return through a mouth.
- `planetModel.ts`, `planetWorld.ts`, `planet.ts`, `planet.html`: separate spherical scale proof, seed/radius controls, eight fixed symmetric placeholder sites, shared thumbstick, transported tangent frame, full circuit, budgeted quadtree LOD with atomic coverage swap and skirts.
- `tests/world.test.ts`: 8 tests (seed/mesh, boundaries, rock, graph identity/sockets, IDs, sphere faces/poles, anchors, circuit, bounded LOD); all pass. Village 19, karst-flow 7, mobility and character tests also pass; production build passes.
- `scripts/browser-world.mjs`: new continuous grass boundary crossings, generated-root capture/emergence, sphere circuit and resident geometry checks. Existing browser-village updated for consistent karst grass entry.
- Local Playwright browser downloads returned empty/corrupt archives for both runtime and pinned 1.58.2. Do not report local browser pass. `.github/workflows/verify-world.yml` runs both browser suites in GitHub Chromium and saves screenshots/results.

## Remaining work / limitations
- Browser/GPU verification and visual QA are the immediate gate; resolve failures before publishing or merging.
- Sphere is an explicit separate proof. Complete village life, authored multi-level karst routes, root graph and saves have NOT yet migrated onto sphere-local frames. Stage 4 remains.
- Far village simulation tiers, worker generation, feature unloading/reloading and fully namespaced world saves remain. The flat village still builds the authored karst upfront; the sphere uses lightweight placeholders.
- Deep-root steering/exit, alpha-hash appearance, and cross-chunk runtime behavior require phone judgement after browser verification.
- World descriptor version is implemented for sphere generation; existing village seeds now agree but full save migration/deltas are pending.

## Checkpoint (2026-09-24, later): verified and published as a preview
- The Actions run on b095e33 passed every test and both browser suites. Locally (Chromium at `/opt/pw-browsers/chromium`, `CHROMIUM_PATH`) both suites pass too: `browser-village` all journeys, `browser-world` village and karst boundary crossings of 102–105 frames with a largest step of 0.19–0.22 m, a generated root (`world:1,1:east`) entered and left, the sphere circuit with a peak of about 305 resident tiles.
- Two visual defects found in the screenshots and fixed:
  - The ground's vision material was alpha hashed. At full depth that is a screen-door stipple (78% of pixels discarded), nothing like the glassy meadow judged good in M1.1, and after any sink the eased `under` never returned to exactly zero, so every ground tile kept a faint stipple for the rest of the session (the karst floor visibly speckled). `groundVision.ts` now uses plain transparency (the chunk tiles never overlap, so there are no sorting seams to avoid), stops depth writes while she is beneath the ground as before, and keeps the new local radius (full within 14 m of her, gone by 28 m; tuning); `village.ts` snaps the `under` ease to its target within 0.01.
  - Two mid-line comments in `scripts/browser-village.mjs` had swallowed the statements after them (the karst-roots screenshot and its assert; the 600 ms wait before the forest-drain measurement). They are on their own lines now and the statements run.
- Published code commit: 829620e. Successful verification and publishing run: https://github.com/noahschmuckler/Rootwake/actions/runs/36066130989 (verification only, on b095e33: 36059181155).
- `.github/workflows/verify-world.yml` now publishes after verification, the way `deploy-village.yml` does: `dist/village.html` to `gh-pages/world/index.html`, `dist/planet.html` to `world/planet.html`, assets and models beside them, `world/revision.json`, then the Pages source check and `scripts/verify-flow-pages.mjs` against `/Rootwake/world/`. Direct pushes to `gh-pages` are refused; publish only through the workflow.
- Not judged yet, for the phone: the smooth local-radius vision; root travel on the karst floor now goes through the village's grass and root modes (a double tap on the floor enters the grass, an aligned karst root takes her, a deep conduit's exit carries her to the nearer mouth) rather than the karst's own sink; the generated roots between chunk hubs and trees; the sphere proof's pace buttons and settings.

## Next action
Play the preview at /world/ on the phone against /village/ and judge: the shared ground at the meadow's and the karst's edges, the vision through the ground, root travel on the karst floor, the generated roots, the sphere proof. Then either merge `feat/seeded-world` into `feat/village` (publishes to /village/) or record what to change. Continue stage 4 only after that judgement. Update this file at each checkpoint.
