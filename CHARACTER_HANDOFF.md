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
- `Player.avatar` is now an empty controller/camera proxy in /flow. `HuldaPresentation.root` is the sole visible-character parent. Forward is local -Z; feet are y=0. On a hanging limb (and the spine's top) a positive `rotation.x` swings it forward, so knee and elbow flexion are negative and positive respectively, the run lean is positive; the first preview had these signs backwards (arms swung back, knees bent in stance) and Noah caught it on the phone. Existing collision height is 0.72 and eye height 0.55: do not silently resize collision, world or camera to fit a model.
- New figure is a rigid hierarchy, not a skinned GLTF. Named hip/spine/neck/shoulder/elbow/hip/knee/ankle pivots permit future contact animation. Meshes follow joints. A later skin can replace geometry without replacing traversal.
- Animation owns local pivots only. Motor owns root translation. No root motion and no changes to input response.
- `flow.ts:present()` resolves the current traversal into a form and world-space centre AFTER movement updates. `huldaPresentation.ts` owns blending, visibility and local form transforms. `flowWorld.ts` still builds the leaf/ivy placeholder geometry, transferred to presentation at startup. The old bulge sphere is removed.
- `climb` currently translates the avatar up the wall with no contact solver. Sprint 1 must avoid running the ground gait there.

## Preview route
`.github/workflows/deploy-character-preview.yml` publishes this branch, after the same suites and the browser journey, to **https://noahschmuckler.github.io/Rootwake/flow-character/** (folder `flow-character/` on gh-pages), so Noah can play each sprint without replacing the accepted `/flow/`. The browser and page-verify scripts take the route from `STUDY_BASE` / `STUDY_URL` (defaults are the accepted `/flow/`). Merging PR #4 into `feat/free-flow` remains the way to publish to `/flow/` itself. First preview published from fec7367 by run https://github.com/noahschmuckler/Rootwake/actions/runs/35534020550 (sprint 2: burl and rootknot blends).

## Rigged files with prefab animations (FBX / glTF)
The procedural rig can be replaced by a skinned character file with its own clips, a Mixamo-style FBX or a glTF/GLB, without touching the forms, the blend or the traversal. Drop `hulda.glb` / `hulda.gltf` / `hulda.fbx` into `public/models/` (found at build time, `__HULDA_MODEL__` in `vite.config.ts`) or try one with `?model=models/file.fbx`; `?facing=-z` for a file that already faces the game's forward; `?clips=a.fbx,b.fbx` for Mixamo clips exported without skin. `public/models/README.md` is the contract.
- `src/huldaRig.ts` (pure, tested): `fitModel` scales to the 0.72 m capsule, feet at y=0, centred, turned from +Z to −Z; `clipRoles` names the idle / walk / run clips (Mixamo's "Idle", "Walking", "Running" as they are); `pinRoot` strips x/z root motion and keeps the bob; `installRiggedModel` plays every role's action at once, weighted by the same walk/run blend as the procedural gait (`HuldaMotion`), paced by measured speed against `NOMINAL_SPEED`, roles the file lacks folding into the nearest, and settling to the idle while she folds into wood.
- `src/huldaModel.ts`: the loader, chosen by extension, imported on demand (FBXLoader and GLTFLoader are separate chunks).
- `huldaPresentation.setModel(model)`: the model goes into the `human` form in place of the procedural figure; its materials are cloned like every form's; `presentation.model` reads it back.
- `scripts/make-sample-rig.mjs` writes `public/models/samples/sample-rig.gltf`, a two-bone skinned figure with Idle / Walking / Running clips facing +Z, which the browser journey loads by `?model=` to prove the path in a real browser (roles found, run clip at speed, idle at rest; `10-rigged-sample.png`).
Not done: retargeting a foreign skeleton to the crouch-and-tuck fold (a skinned model only shrinks and settles to idle before the bark wraps it), and any real character asset; none is in the repository.

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
- Passed locally and in GitHub: build, character 4/4, mobility 35/35, lab 10/10, flow 4/4 (53 total). Local Chromium download timed out. GitHub Chromium completed the full touch journey successfully, including all traversal modes, save/reload and four viewports. Artifact ID `10610274960`: `hulda-character-browser-results`.
- NEXT EXACT ACTION: download `hulda-character-browser-results` from the successful run and inspect `character-front/back/walk/run.png` plus in-world portraits. The connector exported the ZIP, but this workspace received HTTP 403 (error 1010) fetching its download URL, so visual inspection remains pending. Keep PR draft until this review; do not confuse automated success with visual approval. Then implement sprint 2 using the contracts above.
- Remaining: foot locking/terrain-aware IK, animation quality/phone review, all transformation blending, distinct rootknot geometry, climbing contact animation. Existing climbing currently carries a relaxed humanoid pose up the wall. No skinned mesh, GLTF asset, or authored animation clips yet; procedural rigid pivots are intentional for this sprint.
- No changes to live /flow; no automatic publish from this branch. Sprints 2-4 not started. User review should judge silhouette and gait before replacing accepted traversal visuals.
- If shell git push lacks credentials, the GitHub connector can create a tree/commit and update this branch. Never force-push; preserve parent SHA. Local checkout can fetch/reconcile that remote commit after verifying identical content.


## Sprint 2 checkpoint
User reports Fable reviewed sprint 1 and explicitly requested sprint 2. No additional remote commits or PR comments were present when fetched.

Implemented, awaiting verification in GitHub Chromium:
- `src/huldaForms.ts`: flattened bark burl with growth rings, intertwined rootknot with trailing roots; green bud carries identity across both. Six draw calls total for both wood forms, shared merged geometry per material.
- `src/huldaPresentation.ts`: sole presentation owner and exported `FormBlend`; 0.48-second finite blends, snapshots current world pose and weights on interruption, shared origin for all forms, smooth root heading reversal, private material clones so fading cannot affect scenery. Centre is 0.32 above human feet.
- `src/huldaCharacter.ts`: optional fold amount layers crouch/arm-wrap/knee tuck over locomotion, unwinds as human weight returns.
- `src/flow.ts`: `present()` samples the authoritative mode after movement, new form ownership; all previous placeholder visibility mutations removed. Emergence from a trunk now starts at actual height instead of teleporting to its base. Controls, speeds, saving and camera rules retained.
- `tests/character.test.ts`: interruption, same-form landing, frame rates, root reversal, wood geometry budget, visibility/material isolation and fold recovery. `scripts/browser-flow.mjs`: per-frame continuity audit across real touch traversal, first-person visibility, additional burl/rootknot review images.

Next exact action: run build and all suites, commit this checkpoint and run verification workflow. Inspect `character-continuity.json`, browser results and new wood images. Fix failures before closing sprint 2. Then update this section with commit/run IDs and exact remaining limitations.

Sprint 3 remains leaf scatter/reassembly and wall ivy spreading. The existing leaf/ivy geometry now participates in a generic crossfade, but is still placeholder geometry, not the requested authored transformation. Sprint 4 remains handhold contact/climbing. Root motion remains in the existing motor; visual transition interpolation does not drive collision.
