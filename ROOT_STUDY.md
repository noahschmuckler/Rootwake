# The Remembering Spring

A small phone-first 3D discovery study, isolated from the existing games.

## Play

Published route: https://noahschmuckler.github.io/Rootwake/root-study/
Local: `npm ci`, `npm run dev`, open `/root-discovery.html`.

1. Walk and look around the old tree.
2. Enter root vision: you sink straight down through the forest floor and come to rest in the soil. Drag to look, as on the surface. The thumbstick drifts you where you look (forward while looking down sinks you); hold its centre for drift targets and release on one. The ground above is your roof; the darkness below is the limit of your listening. Tap the glowing tip where a root enters clay.
3. Cultivate using the tilted 3D match3 board. Tap adjacent gems. Cascades collect sap; visible projectiles carry the matches toward the tree.
4. Spend 24 sap on wider shallow perception, or save 48 sap to commune with the deep-seeking root. The wider option is optional.
5. Follow the now-visible root to a buried water structure. Spend 24 sap to reconnect it to the thirsty grove. Observe water motes and changed foliage.

Progress saves locally after each reward and purchase. The reservoir caps at 120. No offline clock or passive drain. Restart confirms before clearing this study's save. Help reopens instructions.

## Control provenance and constraint

Based on main bdc0665a51f133e2dba299e92572d4f3702d67fe: the merged, verified mobility/ironman obstacle course.
Uses `Player`, `installMobilityControls`, `Board`, and `BoardView` directly. Original analog stick, hold-centre targeting, landing markers, drag look, tap-to-swap, invalid-swap reversal, and animated cascades remain intact. Powered flight is not equipped in this study.

Root vision (the second pass, at the designer's request) is no longer an orbit. It is the same body and the same controls in a **free volume**: an opt-in medium added to the shared motor (`MobilityMotor.free`, `planDrift`, the `'drift'` traversal kind; see `MOBILITY.md`, "Free volume"). Grounded worlds are untouched: nothing changes unless a world sets `player.free`. In the study:

- Entering root vision sinks the body straight down at its feet over `SINK_S` (2.6 s) to `SINK_DEPTH` (1.7 m); rising takes `RISE_S`. The ground fades to a translucent roof as the eye crosses it and the atmosphere darkens with it; looking stays free the whole way.
- The stick's forward follows the gaze (look down and push to sink), strafing stays level. Hold-centre lays the same four rows and seven bearings of targets, in view space, so the fan reads on screen as it does on the ground; a target is a straight drift there.
- The soil is one `TraversalWorld` with no surfaces: `canOccupy` is the roof (the ground surface less `ROOF_MARGIN`), the floor (`LISTEN_FLOOR` for close and wide listening, `BEDROCK` once communed), the clay disc (a soil the awareness cannot enter until it has communed with the root that does) and the buried structure's stone. Trunks still block near the surface.
- The ability sets the reach of one drift through `player.fanScale` (`REACH_SCALE`: close 0.8, wide 1.0, deep 1.1 of the shared 4.2 m).

Tuning to judge on the phone: the sink and rise timings and depth, the drift speed (the shared run speed today), the reach per ability, the floor depths, the roof margin, and whether the dark limit plane reads as "as far as you can listen".

Future work must preserve these reference mechanics unless Noah explicitly requests a change. Later Hulda prototypes are not the control or match3 reference.

## Scope and open design questions

This is an authored perception/economy experiment, not an ecology simulator. Root positions, the clay boundary, and the chamber are one persistent authored scene. Perception reveals existing geometry. Restoration is a one-time causal demonstration, not a hydrology claim. Energy is rewarded per cleared run, matching the shared board's callback, including overlapping runs.

Questions for phone testing:
- Does sinking read as going under, and the ground overhead as a roof?
- Is drifting where you look comfortable with one thumb, and do the drift targets read like the landing circles?
- Does the floor of listening read as a limit of ability rather than a wall, and the clay as a different soil?
- Does rootview feel like being beneath and within the soil?
- Can you understand the glowing tip, the clay boundary, and what communion changed?
- Is the choice between width and depth meaningful or just a delay?
- Does the original board still feel good here, with matches acting on the tree?
- Are orbiting, target selection, and reading the scene comfortable in portrait?

## Verification and deployment

`npm run test:mobility` checks the unchanged controls.
`npm run build -- --base=/Rootwake/root-study/` builds the dedicated entry and shared assets.
`node scripts/browser-root-study.mjs` serves that exact production build and tests real touch swaps to earn sap, movement/cancellation, the sink (the eye ends under the ground), drag-to-look and stick drift under the soil, a drift target's straight travel, inspection, purchases, restoration, reload persistence, the rise back to standing, and four viewport layouts. Requires Playwright/Chromium; optionally set CHROMIUM_PATH.

Workflow `.github/workflows/deploy-root-study.yml` runs tests before publication. It writes only `root-study/` and `.nojekyll` on gh-pages. Existing root, lab, hulda, and conduit routes remain untouched. It then makes sure the site's Pages source is the gh-pages branch (it had drifted to `feat/broken-conduit` on 2026-09-11, which hid every route published since), requests the Pages build and checks the public revision and assets. Screenshots and test results are retained as a workflow artifact.

An emulated touch browser is not an actual iPhone/Safari performance or comfort test. User testing remains necessary.
