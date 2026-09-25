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
- Published code commit: 2c27dfa (R1, roots as a way). Successful verification and publishing run: https://github.com/noahschmuckler/Rootwake/actions/runs/36074906956 (the first preview, 829620e: 36066130989; verification only, on b095e33: 36059181155).
- `.github/workflows/verify-world.yml` now publishes after verification, the way `deploy-village.yml` does: `dist/village.html` to `gh-pages/world/index.html`, `dist/planet.html` to `world/planet.html`, assets and models beside them, `world/revision.json`, then the Pages source check and `scripts/verify-flow-pages.mjs` against `/Rootwake/world/`. Direct pushes to `gh-pages` are refused; publish only through the workflow.
- Not judged yet, for the phone: the smooth local-radius vision; root travel on the karst floor now goes through the village's grass and root modes (a double tap on the floor enters the grass, an aligned karst root takes her, a deep conduit's exit carries her to the nearer mouth) rather than the karst's own sink; the generated roots between chunk hubs and trees; the sphere proof's pace buttons and settings.

## R1 (2026-09-24): roots as a way, not a trap
Noah's notes after playing /world/: A, an invisible wall in grass form at the edge of the village; B, roots frustrating (rarely aligned with where she wants to go, and they capture her from the grass), better as an interruptible long-distance way: pick a place on the map, a course is plotted through the root network, a tree nearby is highlighted as the entry, enter it and be carried, a stick tap interrupts; in the grass a tap enters or leaves a nearby root; plot a place while already in the roots and she moves at once; C, the generated roots at the karst's foot made the upward roots impossible to pick, so the foot trees should be portals: entering opens a menu of the karst's root routes, pick one and go. All three built:
- **A.** The wall was the stream: the grass refused water while on foot she wades it, and from under the ground the water is invisible. `grassCan` (villageModel) no longer refuses water; the roots may run under the stream bed too (the generated joins use the same rule); `standable` in the entry still keeps her feet out of it when she rises.
- **B.** `worldRoots.ts`: a node registry (village trees, chunk trees, karst floor plants, hubs; ids as before), chunk roots generated once and memoised (`chunkRoots`, let go past 600 chunks except the loaded ring), `rootsTouching(id)` for any node loaded or not, hubs joined eight ways (the two southern diagonals added, so a course runs near straight rather than Manhattan-long), `attached(id)` (a node with a short way onto the hub backbone: a copse cluster that never reaches a hub is no way in or out), `plan(from, to)` (A* by root length over surface roots from the nearest attached tree to the nearest attached node within GOAL_REACH of the place, PLAN_BUDGET nodes at most), `planFrom(nodeId, to)`, `nearest(p, within)`. Tuning: ENTRY_REACH 70, GOAL_REACH 90, PLAN_BUDGET 6000, ATTACH_BUDGET 160. A first plan across unloaded land costs a few hundred ms (chunk generation), later ones tens.
  `village.ts`: no root takes her from the grass any more (the capture loop is gone). A stick tap has one meaning once the double tap's window has passed (330 ms, `pendingTap`): in the grass, the nearest surface root within ROOT_REACH (2.6 m) takes her, forward the way she faces; in a root, off it into the grass (a deep conduit carries her to a mouth first, as before); at the entry tree of a course, in; on a portal ride, off at the next mouth. A tap on the map plots a course to that point (a tap on its mark forgets it); the route, the entry ring and the mark are drawn on the map, the mark rides the compass in gold, and the entry tree carries a gold ring and a shaft of light with a label and distance (`presentCourse`). Pressing into the entry tree, or a tap beside it, sinks her into the course's first root; carried, she runs at CARRY_SPEED (9 m/s) root to root and rises out where the course ends. Plotting while in a root plans from the nearer end that has a way and she moves at once (`resumeCourse`); a tap off the roots keeps the course, and the next root she takes resumes it. The old auto-capture constants are gone.
- **C.** `karstFlowModel.ts`: `shortestPath` and `reachFrom` (Dijkstra over every karst root), `nodeName`, `destinationsFrom(node)` (one place per zone above the floor, the nearest of its nodes; a sister's helix by its halfway ledge only; nearest first). `karstFeature.ts`: pressing into a floor tree goes to the entry's `portal` hook instead of the mouth; `travel(from, to)` sinks her to the mouth and rides the shortest path root after root (`queue`), rising out at the end; `stop()` on a tap. `village.ts`: the `#portal` panel lists the places with their distance; the entry of a plotted course takes precedence at that tree. Above the floor the mouths choose by stick as before.
- Tests: `tests/world.test.ts` 10 (courses village→karst, karst→village, village→lair: joined, surface only, a tree as the way in, near the place, repeatable, not the long way round; the karst's shortest paths and portal destinations); the village suite's water assertion turned round. Journeys: `browser-village` proves running along a copse root no longer takes her, a tap does, a tap leaves, the foot oak's portal offers the cavern, the summit and the south ledge, and the ride to the south ledge ends on her feet there; `browser-world` enters and leaves a generated root by taps, then taps the map to plot a course, sees the entry glow, is carried and rises out near the place.
- Found by the journey: after a ride ended on a ledge, the karst went on owning her ground everywhere (its zone stayed the ledge), so a teleport to the meadow stood her 18 m up. `owns` is bounded to the karst's region now, and standing anywhere outside it (`standOn`) returns its zone to the floor (`leave`).
- For the phone: the feel of the tap window (330 ms before a single tap acts), CARRY_SPEED, the entry tree's glow, the portal menu's places, and whether courses should persist across a reload (they do not).

## Next action
Play the preview at /world/ on the phone against /village/ and judge the R1 root travel (courses from the map, taps, the karst portals) and: the shared ground at the meadow's and the karst's edges, the vision through the ground, root travel on the karst floor, the generated roots, the sphere proof. Then either merge `feat/seeded-world` into `feat/village` (publishes to /village/) or record what to change. Continue stage 4 only after that judgement. Update this file at each checkpoint.
