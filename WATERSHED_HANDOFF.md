# The Breathing Watershed: continuation guide

## Latest status: complete and live
Play: https://noahschmuckler.github.io/Rootwake/watershed/
Source branch: feat/living-watershed (based on the ravine study, 27e681f). Tested and published code commit: 2cf3590 (handoff 5a1cf54).
Successful verification and deployment run: https://github.com/noahschmuckler/Rootwake/actions/runs/35479113998 (all suites, the browser journey in GitHub's Chromium, publication of `watershed/` only, and the public revision.json and asset check). Screenshots and results are in the run's `watershed-browser-results` artifact.
Deployment: `.github/workflows/deploy-watershed.yml` runs on every push to the branch: mobility, lab and watershed unit tests, the production build at `/Rootwake/watershed/`, the browser journey in GitHub's Chromium, then publishes only `watershed/` on gh-pages and verifies the public revision.json and every referenced JS/CSS asset. See the bottom of this file for the recorded run.

Next step is Noah's phone feedback (questions below). Do not widen the ecology before it.

## Authorization and checkpoints
Noah judged both earlier phone studies successful and asked for the next component to be planned, built and left easy to continue. The scope below was written by the previous agent at checkpoint 1; the implementation, tests, workflow and this status are the continuation. Shared Player / mobility / Board / BoardView are unchanged from b6235aa. Existing routes (`/`, `/under.html`, `/lab/`, `/root-study/`, `/ravine/`, `/hulda/`, `/conduit/`) are untouched by the workflow.

## What it is
Two groves share one spring in a small valley. Rain comes in seasons (10 wet days, 16 dry); the spring stores it and feeds both groves by an allocation Hulda can lean; moisture drives each canopy with a lag; litter from a thinning canopy decomposes where it is damp (mushrooms). A fine root joins the groves straight across; under sustained stress (the drier grove below 0.3 moisture for 1.5 days) it withdraws over 1.5 days and closes; after sustained recovery (both above 0.55 for 2 days) it regrows over 2 days. The deep route down through the spring is always passable.

Never trap an awareness: while Hulda is inside the fine root, a closure in progress holds (the root stays occupiable and visibly withdrawing) and completes only once she leaves. A saved `closing` state loads as `closed`, so a save cannot hold it open.

Sap comes from the original 3D match board. Spend 8 sap to lean the spring west or east or to even it (the favoured grove gets three quarters of the draw; the other gets a quarter and suffers the dry days first). Spend 24 sap once for a moss basin: it catches half again as much of each rain and seeps half as fast, so the spring lasts the dry and the fine root never closes. Nothing conjures water; nothing rewards a tap with instant health.

Observer: pause / 1x / 6x (one game-day is 12 real seconds at 1x); per-grove condition word, moisture and canopy bars and decomposition dots; spring fill and flow; the last three causal events. The seasons run while watching (moving or still) and pause on the board, in help, and when the tab is hidden. No offline catch-up. Save key `rootwake-watershed-v1`; reload resumes the watershed and returns awareness to the west grove.

## Files
- `src/watershedModel.ts`: the pure ledger (`advance`, `redirect`, `cultivateBasin`, `parseWatershed`), the root graph, `makeSoil` (corridor around passable roots), `insideFine`, `guide`. All tuning constants at the top.
- `src/watershedWorld.ts`: the valley: per-grove soil tint and canopy colour/height, mushrooms by decomposition, spring pool and cistern fill, rain streaks, the moss basin once bought, the fine root fading and thinning as it withdraws.
- `src/watershed.ts`, `watershed.html`, `src/watershed.css`: orchestration (sink at a grove's ring, rise at either grove), ecology clock, observer panel, purchases, board.
- `tests/watershed.test.ts` (`node scripts/test-watershed.mjs`): bounded long run with repeatable seasonal recovery, exact water balance, lean tradeoff, basin, closure hysteresis with the held passage, save validation.
- `scripts/browser-watershed.mjs`: real multi-frame touch journey: live 6x clock and pause, board pauses the seasons and earns sap, enter, look, the fine root withdrawing around the awareness and holding, closing once empty, the deep route both ways, lean and basin purchases, regrowth, rise, help pause, reload persistence and anchor, four viewports. `?debug=1` exposes `__watershed.advance(days)` for the seasons only in this test; it is not a play path.

## Tuning to judge on the phone
- One game-day is 12 s at 1x; a season is 5.2 min at 1x, 52 s at 6x. Is watching at 1x worth it, or should 6x be the default while walking?
- Dry evaporation (0.11/day) is set so that an even share cannot hold a grove through the dry: the balanced watershed always stresses late in the dry and the fine root closes for roughly 4 to 7 days a cycle. Is that too punishing, or too tame, to read as "a breathing watershed"?
- The lean's favoured grove barely gains in the wet (it is already full); its gain shows in the dry. Is 8 sap the right price, and does the other grove's loss read?
- The basin removes closure entirely; is a permanent fix too strong, or the point of the 24 sap?
- Does the withdrawing root (fading, thinning, held while you are inside) read as biology rather than a door?
- Are the observer panel and the story line legible in portrait without hiding the valley?

## Honest limits
Authored ecology, not a hydrology or biology model; the numbers are stylized. No predation, settlements, procedural history or combat. Browser emulation is not an iPhone; the phone playtest is still required.

## Deployment notes
GitHub Pages serves gh-pages (restored by the first study's workflow; every study workflow checks it). Local browser runs use the preinstalled Chromium with `CHROMIUM_PATH=/opt/pw-browsers/chromium`; the ravine's notes about @sparticuz/chromium apply only to hosts without one. Build with `npm run build -- --base=/Rootwake/watershed/`, then `node scripts/browser-watershed.mjs`.

## Recorded verification
Local (this host): `node scripts/test-watershed.mjs` 6 passed; `npm run test:mobility` 35 passed; `npm run test:lab` 10 passed; `npm run build -- --base=/Rootwake/watershed/` clean; `node scripts/browser-watershed.mjs` passed the whole journey at 390x844 plus 375x667, 844x390 and 1280x900 (screenshots in `artifacts/watershed`, ignored by git). The GitHub workflow run linked at the top passed end to end on 2026-09-20.
