# Hulda character: start here

## Resume immediately
- Working branch: `feat/hulda-character`, based on `feat/free-flow` at `cbcbc741b735e6d6ee35e04f8853fa6db3c756b4`. Main does NOT contain /flow.
- Read this file, `FLOW_HANDOFF.md`, then `src/flow.ts`. Keep this file current before ending a session or changing scope. Commit small checkpoints; record failing checks and next exact action here.
- User: Noah wants a female-readable nature character, inspired by Batman TAS Poison Ivy, with a simple rig, smoothly blended walking/running, transformations into trunk burl, rootknot, leafmass and climbing ivy, and climbing animation at handholds. Continue across Codex and Claude Fable sessions.
- Preserve the existing one-stick controls, motor, match-3, traversal timings, persistence and other demos. This is visual work on /flow, not a movement redesign.

## Session-sized sprints
Each sprint should stop at a tested, reviewable commit. Do not promise exact usage capacity. If interrupted, finish the current small checkpoint and update Resume status.

1. **Figure and locomotion**: procedural rigid-joint figure, recognizable female silhouette, leaf bodice/skirt and copper vine hair; continuous idle/walk/run blend from measured motor speed; phase continuity and facing smoothing; flow-only integration. Verify build, rig tests, existing touch journey and portrait/landscape rendering. No external model pipeline required.
2. **Bark and root transitions**: one presentation controller, separating traversal mode from visual form. Capture outgoing world pose on mode changes; blend interrupted transitions from current weights, never restart from a discrete endpoint. Fold limbs and wrap vine/bark over 0.35-0.6 s; rootknot has its own intertwined root silhouette. Handle ground/trunk/root/sink/rise in both directions. Verify no duplicate character, invisible frame or teleport at tree entry, emergence and root junctions.
3. **Canopy and ivy transitions**: continuous figure-to-leaf scatter/reassembly; canopy upper-body silhouette and hop stretch; flatten/spread along wall into climbing ivy; retain grown world ivy and save format. Cover trunk/crown/hop, ground/ivy/ground and reversals during transitions. Use the same material palette and leaf shapes as the figure.
4. **Handholds and polish**: expose the actual hold coordinates from flowWorld as shared data; two-bone arm/leg IK or explicit planted-contact poses, alternate reach/pull, lateral and descending travel, stationary grip, top-out and bottom-out. Smooth entry/exit. Inspect all modes on phones; profile render cost; publish only after full journey passes.

## Architecture and scale
- `Player.avatar` is the existing transform/visibility parent. Forward is local -Z; feet are y=0. Existing collision height is 0.72 and eye height 0.55: do not silently resize collision, world or camera to fit a model.
- New figure is a rigid hierarchy, not a skinned GLTF. Named hip/spine/neck/shoulder/elbow/hip/knee/ankle pivots permit future contact animation. Meshes follow joints. A later skin can replace geometry without replacing traversal.
- Animation owns local pivots only. Motor owns root translation. No root motion and no changes to input response.
- `flow.ts` currently switches visibility immediately and positions `world.bulge`, `world.figure`, `world.mass`. Those are intentionally retained until sprints 2/3. Do not claim transforms are complete because walking is done.
- `climb` currently translates the avatar up the wall with no contact solver. Sprint 1 must avoid running the ground gait there.

## Validation / commands
`npm ci`; `npm run build -- --base=/Rootwake/flow/`; `npm run test:mobility`; `npm run test:lab`; `node scripts/test-flow.mjs`; `npm run test:character`; `node scripts/browser-flow.mjs`.
Browser script accepts `CHROMIUM_PATH` and falls back to runtime Playwright when not locally installed. Output is `artifacts/flow/` (ignored). Build base must match browser script.
The existing `.github/workflows/deploy-flow.yml` publishes /flow only from feat/free-flow. A character branch push must not overwrite the accepted demo. PR targets feat/free-flow. Merging there triggers its verification/publication workflow.

## Resume status
Sprint 1 implementation committed as `815907c` on `feat/hulda-character`.
Draft PR: https://github.com/noahschmuckler/Rootwake/pull/4 (base `feat/free-flow`).
Verification run: https://github.com/noahschmuckler/Rootwake/actions/runs/35530310400

- Implemented: `src/huldaCharacter.ts` (named rigid pivots, leaf bodice/skirt, copper vine locks, idle and gait posing); `src/huldaMotion.ts` (speed filtering, common walk/run phase, shortest-angle heading); `src/flow.ts` (flow-only avatar child replacement and per-frame presentation update, debug handle `window.__clearing.hulda`).
- Added: `tests/character.test.ts`, `scripts/test-character.mjs`, npm `test:character`; `.github/workflows/verify-character.yml` verifies without deploying. Existing browser journey now also captures `character-front/back/walk/run.png`.
- Passed locally and in GitHub: build, character 4/4, mobility 35/35, lab 10/10, flow 4/4 (53 total). Local Chromium download timed out; GitHub installed Chromium successfully and is running the browser journey.
- NEXT EXACT ACTION: inspect the verification run, download `hulda-character-browser-results`, inspect character and in-world portraits. Fix any browser failure before marking sprint 1 accepted. Then implement sprint 2 using the contracts above.
- Remaining: foot locking/terrain-aware IK, animation quality/phone review, all transformation blending, distinct rootknot geometry, climbing contact animation. Existing climbing currently carries a relaxed humanoid pose up the wall. No skinned mesh, GLTF asset, or authored animation clips yet; procedural rigid pivots are intentional for this sprint.
- No changes to live /flow; no automatic publish from this branch. Sprints 2-4 not started. User review should judge silhouette and gait before replacing accepted traversal visuals.
- If shell git push lacks credentials, the GitHub connector can create a tree/commit and update this branch. Never force-push; preserve parent SHA. Local checkout can fetch/reconcile that remote commit after verifying identical content.

