# The Karst: continuation guide

## Latest status
Play: https://noahschmuckler.github.io/Rootwake/karst/
Source branch: feat/karst-slide (from the watershed branch, 378f550). Deployment: `.github/workflows/deploy-karst.yml` on every push to the branch: mobility, lab and karst unit tests, the production build at `/Rootwake/karst/`, the browser journey in GitHub's Chromium, publication of `karst/` only on gh-pages, then the public revision.json and asset check. The recorded run is at the bottom of this file.

Next step is Noah's phone feedback (questions below).

## The brief, as built
Noah asked for a traversal study: wake on the narrow top of a karst pillar like Zhangjiajie's, limestone with shallow or no soil and plants clinging to the rock; a new viewpoint. No sinking into soil. Root vision makes the limestone glassy so the root network shows draped over and threaded through it, but the stone is not traversable. Communing with a plant joined to another shrinks Hulda into its root, which she rides like a water slide to the next plant, where she can emerge or choose another root. One root arrives inside the pillar in a water cavern lit by luminescent mushrooms. The demo takes her to the forest at the foot and back to the top by more than one way.

- **Zones.** Each plant stands on its own small world: the summit disc, three face ledges (east 48 m, west 34 m, south 18 m), the cavern floor around its pool (25 m), and the forest floor. Walking uses the shared Player on the current zone only; the narrow top holds you.
- **Seven plants, eight roots.** Summit pine; east shrub and west fig on ledges; south shrub; the cavern fern; the foot oak and the west maple below. Surface roots drape just outside the rock (over the summit's rim first); interior roots pass through it into the cavern and down to the oak. Routes up from the floor: oak, south shrub, east shrub, pine; oak, cavern, east, pine; oak, cavern, west fig, pine; maple, west fig, pine. Tested as at least three distinct routes.
- **Commune, shrink, ride, arrive, emerge.** Within 3.2 m of a plant, Commune shrinks the eye to the root mouth at its foot (1.6 s), then lists that plant's roots as SLIDE, INTO THE STONE or CLIMB with their length. A ride follows the curve: a downhill tangent pulls (up to 13 m/s), uphill is a slow capillary climb (3 m/s), and it brakes over the last 9 m. The inside of the root is shown (a back-faced tube with motes), the stone goes glassy for the ride, and dragging looks around as an offset on the root's heading. Arriving offers the next roots or Emerge, which grows back to the eye on that plant's zone.
- **Progress.** Visited plants, the first arrival on the floor, and the return to the summit from below (a message marks each). Save key `rootwake-karst-v1`; reload resumes at the last plant's zone. No sap and no board in this study: the focus is traversal, and communion is free here (a cost can be layered later if the series wants it).

## Files
- `src/karstModel.ts`: pillar radius profile, `onFace`, zones and `inZone`, plants with stands and root mouths, root curves, `routes`, ride kinematics (`stepRide`, `ridePoint`, `rideTarget`), progress parse and `arrive`. Tuning constants at the top and beside the ride.
- `src/karstWorld.ts`: the lathe pillar (merged then jittered), the cavern room seen from within with pool and mushroom lights, ledge shelves, the forest floor and trees, tufts and moss adhering to the faces, sister pillars in mist, root tubes and their ride interiors, halos and motes, `update(vision, t, riding, eye)`.
- `src/karst.ts`, `karst.html`, `src/karst.css`: modes surface / shrink / choose / ride / arrive / emerge, the atmosphere by place (sky, root, cavern), the HUD.
- `tests/karst.test.ts` (`node scripts/test-karst.mjs`): silhouette and zones, roots outside or inside the rock as declared, routes down and the three ways up, ride pull, climb and braking, save validation.
- `scripts/browser-karst.mjs`: real touch journey: held on the summit by the stick, root vision, drag look, commune and choose, slide east, into the stone, emerge in the cavern, look while riding, floor, climb by the maple and west fig back to the pine, return recorded, reload, four viewports.

## Tuning to judge on the phone
- Ride speeds (3 to 13 m/s, brake over 9 m) and the 1.6 s shrink. Does the slide feel like water, and the climb like sap rather than a slow slide?
- The narrow top (3.2 m radius) as a first view: does it read as height and confinement before the roots offer a way?
- Root vision opacity (limestone to 22%) and whether the interior roots read as inside the stone rather than floating.
- The cavern's darkness and mushroom light; whether emerging there feels like being inside the mountain.
- Whether free communion is right, or the series' sap should gate first-time rides.

## Honest limits
An authored pillar and graph, not procedural karst. The ride camera has no collision with the rock: the tube interior hides it. No fall from ledges (the zone holds you). Browser emulation is not a phone.
