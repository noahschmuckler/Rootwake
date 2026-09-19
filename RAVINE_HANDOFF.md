# Root Across the Ravine: continuation point

## Latest status: complete and live
Play: https://noahschmuckler.github.io/Rootwake/ravine/
Source branch: feat/root-ravine. Tested/published code commit: c843414ab48fd61d8a97cd15eb751a902dae2e65.
Successful verification/deployment run: https://github.com/noahschmuckler/Rootwake/actions/runs/35472000279
Public revision.json matches that commit; GitHub verified the HTML and every referenced JS/CSS asset. Existing root-study and other routes were preserved.

All 49 math/mobility/lab tests passed (4 new network tests, 35 mobility, 10 lab). The complete multi-frame touch journey passed in GitHub Chromium, with screenshots for 390x844, 375x667, 844x390 and 1280x900. Runtime screenshots and results are downloadable from the workflow artifact ravine-browser-results. This is browser emulation, not physical iPhone/Safari verification.

No unfinished deployment work. Next step is Noah's phone feedback: branch readability, sense of embodiment within roots, the species gate, and whether emerging makes the crossing tangible. Avoid expanding ecology or world scope before that feedback. The chronological checkpoints below explain decisions; this latest status supersedes their pending-work notes.


## User authorization and reference
Noah approved scope, implementation, and GitHub Pages publication of a second phone study. He explicitly requested durable clues for Claude if Codex runs out of context or usage. Work autonomously through build, test, publication. No additional deployment approval needed.

Reference: feat/root-discovery-demo at b6235aa, including Claude's satisfying sink/free-volume controls and fixed multi-frame board taps. DO NOT replace those controls or match3. Import shared Player, mobilityControls, Board, BoardView unchanged. The prior scratch rootwake checkout has stale local edits from before Claude; this work uses a separate root-ravine worktree. Do not reapply those stale deployment edits.

## Scope
Dedicated /Rootwake/ravine/ route and ravine.html entry, preserving /root-study/.
Authored 3D valley with recognizable golden home oak, ravine, white/pink far grove.
Root travel uses existing free-volume motor and hold-to-drift targets, constrained to generous corridors surrounding persistent root paths. Drag still looks, no orbital camera or replacement stick.
Fork: longer living route via a spring, or cultivate and spend 12 sap to restore a short dormant root permanently. Both reach a fern. Inspect it and spend 24 sap on communion to inhabit fine roots beneath the ravine. Reach the far tree, manifest a temporary dryad, look back. Manifestation lasts 90 active seconds, pauses in menus/hidden tabs, and returns to roots without erasing progress.
Reuse original tilted 3D match3, animated runs and projectiles, 120-sap reservoir; cultivation accessible while in the network. Persistent saved learning and shortcut, separate save key from first study.
No procedural world, broad ecology, combat, other masters, or new inventory.

## Acceptance
- Surface cannot walk/jump across the ravine; underground cannot bypass the species gate or leave the network.
- Real multi-frame touch input moves, looks, selects targets, and plays board.
- Both fork routes valid, optional shortcut spends once and persists.
- Communion requires reaching/listening to fern and enough earned sap.
- Root journey reaches the same visible far grove; manifestation and return work safely.
- Save/reload retains discoveries and costs; reset affects this study only.
- Portrait, small portrait, landscape layouts remain usable.
- Production build and shared mobility/lab tests pass; browser journey tests run before publication.
- Verify public revision and all JS/CSS assets, not just successful git push.

## Files planned
src/ravineModel.ts: network, progression and collision queries.
src/ravineWorld.ts: authored geometry and landmarks.
src/ravine.ts + src/ravine.css + ravine.html: study orchestration and phone UI.
scripts/browser-ravine.mjs: actual-touch journey and screenshots.
.github/workflows/deploy-ravine.yml: gated publication limited to ravine/.

## Deployment facts
Claude fixed Pages back to gh-pages. Copy the current deploy-root-study.yml as reference, adapting entry, route, branch, browser test and verification. Preserve all other folders. Source branch feat/root-ravine. Git CLI reads work; writes here previously lacked credentials, so use GitHub connector create_tree/create_commit/update_ref (non-force), or normal authenticated git on Claude's host. Tool results may have structuredContent or text; inspect errors before extracting SHAs.

## Current checkpoint
Implementation written and production build passes. Four new model tests, all 35 mobility tests and all 10 lab tests pass. Browser journey and screenshot checks are next. Nothing published yet at this checkpoint. Authored graph and geometry in ravineModel.ts / ravineWorld.ts, UI in ravine.ts. Tests preserve multi-frame touch presses from Claude's corrected study harness. Deployment workflow runs these gates and publishes ravine/ only. Append real verification and publication results before ending.


## Checkpoint after local browser pass
The full production journey passed with multi-frame touch match3, traversal of BOTH short-root directions and the longer spring route, locked fine-root gate, communion, crossing, manifestation, help-menu pause, manual return to roots, reload persistence, and four viewports. Screenshots in artifacts/ravine (ignored by git). Browser: Playwright from CODEX_PRIMARY_RUNTIME_NODE_MODULES; CHROMIUM_PATH=/tmp/chromium. Installed @sparticuz/chromium under /tmp/ravine-browser because no browser was preinstalled; Brotli-decompressed chromium.br and swiftshader.tar.br, extracted shader libraries beside executable without chown. Normal Playwright install works in GitHub Actions.

Local visual polish after that pass: suppress close-up node markers so the awareness never flies into a screen-filling glowing sphere; remove background trees along the landmark sightline; use the shared controller's existing third-person view during dryad embodiment, adding a small leafy mantle. Underground remains first-person. CI will rerun the full journey before deployment.

Current source checkpoint before polish: a0d1bcd on feat/root-ravine. Deployment workflow now ready to publish /Rootwake/ravine/; it is independent of root-study. Do not report live until public revision is verified. The dryad uses 90 ACTIVE seconds; menus and hidden tabs pause. Reload keeps learning/sap/shortcut, returns to the oak intentionally.


## Tuning and honest limits for the next pass
- Authored scene, not procedural generation or a background ecology simulator.
- Corridor radius 1.5 m (body clearance subtracts 0.25 m) in ravineModel.ts. This is deliberately generous. It may feel like an invisible wall at branch edges; judge on phone before changing shared movement.
- The direction cue calls guide() and rotates the gaze smoothly; it never moves the body. Manual pointer look cancels the cue.
- Shortcut costs 12, communion 24, spring grants 12 once, sap cap 120. All constants are in ravineModel.ts. Match3 reward keeps the original per-run callback behavior, including overlapping runs.
- Dryad uses the existing third-person camera and a leaf mantle, 90 active seconds, a six-metre local grove radius. Root travel stays first-person. Manual release and pause were browser-tested. Automatic expiry is implemented but the current browser test does not wait out all 90 seconds.
- Reload preserves learning, tended shortcut, visited spring, arrival, and sap; position intentionally returns to the oak. There is no offline progression. Save key rootwake-ravine-v1 is independent of the first study.
- The current root entry is at the oak and emergence at the far grove. There is not yet a contextual rise-at-oak action after travelling back; add that if the phone session calls for freer return trips.
- Shared Player/mobility/match3/BoardView files are unchanged from Claude's b6235aa baseline. Only a new Vite entry, study-specific files, tests, deployment and this handoff were added.
- Build with npm run build -- --base=/Rootwake/ravine/. Test with node scripts/test-ravine.mjs, npm run test:mobility, npm run test:lab, then node scripts/browser-ravine.mjs. Browser override: CHROMIUM_PATH. Do not replace multi-frame press() with instantaneous touchscreen.tap(), which previously concealed a genuine interaction bug.
