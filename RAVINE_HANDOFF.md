# Root Across the Ravine: continuation point

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
