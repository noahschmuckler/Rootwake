# The Karst: continuation guide

## Latest status: complete and live
Play: https://noahschmuckler.github.io/Rootwake/karst/
Source branch: feat/karst-slide (from the watershed branch, 378f550). Tested and published code commit: 884fc49 (the second pass; the first pass was b2d8882).
Successful verification and deployment run: https://github.com/noahschmuckler/Rootwake/actions/runs/35483753415 (the first pass's run was 35482188010) (karst, mobility and lab suites, the browser journey in GitHub's Chromium, publication of `karst/` only, public revision.json and asset check; screenshots in the run's `karst-browser-results` artifact). Deployment: `.github/workflows/deploy-karst.yml` on every push to the branch: mobility, lab and karst unit tests, the production build at `/Rootwake/karst/`, the browser journey in GitHub's Chromium, publication of `karst/` only on gh-pages, then the public revision.json and asset check.

Next step is Noah's phone feedback (questions below).

## The second pass: the earlier studies folded into the forest floor
Noah asked for the prior demos' functionality on the forest floor. Built, tested and published (see the status above):
- **Soil to sink into** (the first study): on the floor, Sink into the soil drops the body 1.7 m under over 2.6 s into the shared free volume, roofed by the forest floor, floored by bedrock at 6.5 m, with the pillar's foot going on down as solid rock. Drift where you look; hold centre for drift targets; Rise returns. The groves' own roots hang in the soil. Commune works from the soil near a floor plant (it rises into the root mouth).
- **Cultivation** (the first study): the original tilted 3D board on the floor's surface gathers sap into one reservoir (cap 120), shown in the header with the plants met.
- **The watershed** (the third study): the cavern's water emerges as a spring at the foot and feeds the oak grove (east) and the maple grove (west) through the seasons; the observer panel runs them at pause / 1x / 6x, with per-grove condition, moisture, canopy and litter mushrooms, the spring's fill, and the last events. Sap leans the spring (8) or evens it, or buys the moss basin (24). Seasons run in every zone and pause on the board, in help and when hidden; rain falls on the summit too.
- **A tended root** (the ravine's shortcut): the pine's dormant taproot runs down the north face to the maple; 12 sap wakes it, making maple to summit one climb, the fastest way up.
- **Ecology gates traversal**: the foot root (oak to maple round the south of the foot) and the taproot are fine roots. When the drier grove's moisture falls below 0.3 for 1.5 days they withdraw and cannot be entered (the ride list shows why: withdrawing, withdrawn, regrowing, dormant); the deep roots always serve. A ride already begun always completes, and the ledger holds a closure while you are riding a fine root. Recovery regrows them. So a wilting maple grove costs you the quick way up, and leaning the spring to the oak has a traversal price.
- Save key `rootwake-karst-v2` carries the ledger, sap, the tended root and the plants met.

## The brief, as built
Noah asked for a traversal study: wake on the narrow top of a karst pillar like Zhangjiajie's, limestone with shallow or no soil and plants clinging to the rock; a new viewpoint. No sinking into soil. Root vision makes the limestone glassy so the root network shows draped over and threaded through it, but the stone is not traversable. Communing with a plant joined to another shrinks Hulda into its root, which she rides like a water slide to the next plant, where she can emerge or choose another root. One root arrives inside the pillar in a water cavern lit by luminescent mushrooms. The demo takes her to the forest at the foot and back to the top by more than one way.

- **Zones.** Each plant stands on its own small world: the summit disc, three face ledges (east 48 m, west 34 m, south 18 m), the cavern floor around its pool (25 m), and the forest floor. Walking uses the shared Player on the current zone only; the narrow top holds you.
- **Seven plants, eight roots.** Summit pine; east shrub and west fig on ledges; south shrub; the cavern fern; the foot oak and the west maple below. Surface roots drape just outside the rock (over the summit's rim first); interior roots pass through it into the cavern and down to the oak. Routes up from the floor: oak, south shrub, east shrub, pine; oak, cavern, east, pine; oak, cavern, west fig, pine; maple, west fig, pine. Tested as at least three distinct routes.
- **Commune, shrink, ride, arrive, emerge.** Within 3.2 m of a plant, Commune shrinks the eye to the root mouth at its foot (1.6 s), then lists that plant's roots as SLIDE, INTO THE STONE or CLIMB with their length. A ride follows the curve: a downhill tangent pulls (up to 13 m/s), uphill is a slow capillary climb (3 m/s), and it brakes over the last 9 m. The inside of the root is shown (a back-faced tube with motes), the stone goes glassy for the ride, and dragging looks around as an offset on the root's heading. Arriving offers the next roots or Emerge, which grows back to the eye on that plant's zone.
- **Progress.** Visited plants, the first arrival on the floor, and the return to the summit from below (a message marks each). Save key `rootwake-karst-v1`; reload resumes at the last plant's zone. No sap and no board in this study: the focus is traversal, and communion is free here (a cost can be layered later if the series wants it).

## The third pass: roots as roots, foliage as sprites
Noah's first phone impression: translucent roots read as cellophane tubes, and icosahedron crowns on cylinders read as toy trees; the plateau's crossed grass sprites were the better grass. So:
- **Roots** are opaque bark now: tapered, gnarled tubes (thick where they leave a plant, thinner between; `taperedTube` in `karstWorld.ts`) with a bark grain, and at every plant a collar of buttress rootlets from the trunk's foot into the ground, one of which is the mouth the main root grows from. Root vision makes them glow gold from within (emissive) while the stone goes glassy; they never go transparent. Fine roots go grey and dull when withdrawn or dormant. The ride interior is unchanged.
- **Foliage** is crossed standees (`src/sprites.ts`, the plateau's method from `patch.ts` with leaf, needle and frond textures beside the blade one): trees are a trunk with three branches into a crown of leaf cards (a flat card on every other one so crowns read from the summit above), the pine is tiers of needle cards, the fern is frond cards, the cliff tufts are leaf cards growing out of the faces, and the summit and forest floor have blade tufts. The wild forest is merged into one mesh per material. Grove crowns still follow the ledger by tint and by height.
- The software-rendered browser journey is slower with alpha-tested cards (about 8 minutes locally), so the workflow's job timeout is 25 minutes and the journey's waits are longer. A phone GPU is not a software rasterizer; judge speed there.

## Files
- `src/karstModel.ts`: pillar radius profile, `onFace`, zones and `inZone`, plants with stands and root mouths, root curves, `routes`, ride kinematics (`stepRide`, `ridePoint`, `rideTarget`), progress parse and `arrive`. Tuning constants at the top and beside the ride.
- `src/karstWorld.ts`: the lathe pillar (merged then jittered), the cavern room seen from within with pool and mushroom lights, ledge shelves, the forest floor and its groves, sprite trees, tufts and moss on the faces, sister pillars in mist, tapered bark roots with collars and their ride interiors, halos and motes, `update(...)`.
- `src/sprites.ts`: the shared standee foliage: canvas textures (grass, leaf, needle, frond), `spriteMaterial`, `standees` (crossed quads merged), `crownStandees`.
- `src/karst.ts`, `karst.html`, `src/karst.css`: modes surface / shrink / choose / ride / arrive / emerge, the atmosphere by place (sky, root, cavern), the HUD.
- `tests/karst.test.ts` (`node scripts/test-karst.mjs`): silhouette and zones, roots outside or inside the rock as declared, routes down and the three ways up, ride pull, climb and braking, save validation.
- `scripts/browser-karst.mjs`: real touch journey: held on the summit by the stick, root vision, drag look, commune and choose (the taproot listed dormant), slide east, into the stone, emerge in the cavern, look while riding, floor; then sink, drift and rise in the soil, cultivate on the board, tend, lean and basin, the fine roots withdrawn under scripted stress (`?debug=1` exposes `advance(days)` for the seasons only in this test) and regrown, the taproot climb back to the pine, return recorded, reload with the ledger, four viewports.
- `src/watershedObserver.css`: the observer panel's styles, shared with the watershed study.

## Tuning to judge on the phone
- Ride speeds (3 to 13 m/s, brake over 9 m) and the 1.6 s shrink. Does the slide feel like water, and the climb like sap rather than a slow slide?
- The narrow top (3.2 m radius) as a first view: does it read as height and confinement before the roots offer a way?
- Root vision opacity (limestone to 22%) and whether the interior roots read as inside the stone rather than floating.
- The cavern's darkness and mushroom light; whether emerging there feels like being inside the mountain.
- Whether free communion is right, or sap should gate first-time rides now that sap exists here.
- Whether the fine roots withdrawing (and the taproot with them) reads as the groves' health, and whether 12 sap for the taproot and 8 for a lean are the right prices against 24 for the basin.
- The soil at the foot: is drifting under the forest with the pillar's foot as a wall worth the extra mode, or is it noise beside the rides?

## Honest limits
An authored pillar and graph, not procedural karst. The ride camera has no collision with the rock: the tube interior hides it. No fall from ledges (the zone holds you). Browser emulation is not a phone.
