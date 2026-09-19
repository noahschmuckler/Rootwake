# The Remembering Spring

A small phone-first 3D discovery study, isolated from the existing games.

## Play

Published route: https://noahschmuckler.github.io/Rootwake/root-study/
Local: `npm ci`, `npm run dev`, open `/root-discovery.html`.

1. Walk and look around the old tree.
2. Enter root vision. Tap the glowing tip where a root enters clay.
3. Cultivate using the tilted 3D match3 board. Tap adjacent gems. Cascades collect sap; visible projectiles carry the matches toward the tree.
4. Spend 24 sap on wider shallow perception, or save 48 sap to commune with the deep-seeking root. The wider option is optional.
5. Follow the now-visible root to a buried water structure. Spend 24 sap to reconnect it to the thirsty grove. Observe water motes and changed foliage.

Progress saves locally after each reward and purchase. The reservoir caps at 120. No offline clock or passive drain. Restart confirms before clearing this study's save. Help reopens instructions.

## Control provenance and constraint

Based on main bdc0665a51f133e2dba299e92572d4f3702d67fe: the merged, verified mobility/ironman obstacle course.
Uses `Player`, `installMobilityControls`, `Board`, and `BoardView` directly, without modifying those shared components. Original analog stick, hold-centre targeting, landing markers, drag look, tap-to-swap, invalid-swap reversal, and animated cascades remain intact. Root orbit uses the player's existing disabled/locked-view orbit callback. Powered flight is not equipped in this study.

Future work must preserve these reference mechanics unless Noah explicitly requests a change. Later Hulda prototypes are not the control or match3 reference.

## Scope and open design questions

This is an authored perception/economy experiment, not an ecology simulator. Root positions, the clay boundary, and the chamber are one persistent authored scene. Perception reveals existing geometry. Restoration is a one-time causal demonstration, not a hydrology claim. Energy is rewarded per cleared run, matching the shared board's callback, including overlapping runs.

Questions for phone testing:
- Does rootview feel like being beneath and within the soil?
- Can you understand the glowing tip, the clay boundary, and what communion changed?
- Is the choice between width and depth meaningful or just a delay?
- Does the original board still feel good here, with matches acting on the tree?
- Are orbiting, target selection, and reading the scene comfortable in portrait?

## Verification and deployment

`npm run test:mobility` checks the unchanged controls.
`npm run build -- --base=/Rootwake/root-study/` builds the dedicated entry and shared assets.
`node scripts/browser-root-study.mjs` serves that exact production build and tests real touch swaps to earn sap, movement/cancellation, inspection, purchases, restoration, reload persistence, and four viewport layouts. Requires Playwright/Chromium; optionally set CHROMIUM_PATH.

Workflow `.github/workflows/deploy-root-study.yml` runs tests before publication. It writes only `root-study/` and `.nojekyll` on gh-pages. Existing root, lab, hulda, and conduit routes remain untouched. It then makes sure the site's Pages source is the gh-pages branch (it had drifted to `feat/broken-conduit` on 2026-09-11, which hid every route published since), requests the Pages build and checks the public revision and assets. Screenshots and test results are retained as a workflow artifact.

An emulated touch browser is not an actual iPhone/Safari performance or comfort test. User testing remains necessary.
