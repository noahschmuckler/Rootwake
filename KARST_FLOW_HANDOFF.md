# The Karst, free flow: continuation guide

## Latest status
Play: https://noahschmuckler.github.io/Rootwake/karst-flow/
Source branch: feat/karst-flow (from feat/hulda-character, which carries the clearing and the Hulda character over the karst branch). Deployment: `.github/workflows/deploy-karst-flow.yml` on every push to the branch: mobility, lab, character, karst, clearing and karst-flow unit tests, the production build at `/Rootwake/karst-flow/`, the browser journey in GitHub's Chromium, publication of `karst-flow/` only on gh-pages, then the public revision.json and asset check (screenshots in the run's `karst-flow-browser-results` artifact). The publish record is at the end of this file.

Next step is Noah's phone feedback (questions below).

## The brief
After the clearing's free flow and the character's gait fix, Noah asked for the same movement methodology applied to the karst: exclude the springs, keep the bespoke karst and its unique root and vine connections, all in third person, no tooltips on the screen, so as to see whether the natural movement works without buttons to choose destinations.

## What is built
- **The karst, as it was.** The pillar, its silhouette, the cavern with its pool and mushroom light, the three ledges, the summit pine, the shrubs and the fig clinging to the faces, the fern, the oak and the maple at the foot, the wild forest, the tufts and moss on the faces, the sister pillars in mist, the opaque bark roots with their collars: all from `karstModel.ts` and the karst world, rebuilt in `karstFlowWorld.ts` without the spring, the basin, the groves' ledger, the rain, the soil volume or the board. Nine of the ten roots are ridden: the dormant taproot belonged to the sap economy and is left out; the foot root (oak to maple round the south of the foot) is always open.
- **Third person, Hulda, one stick.** The shared player in its third view with the rigged character; the same drag orbits the camera in every form. The camera pulls in to her eye rather than enter the limestone (`insideRock`). One small button switches to first person and back; the other is help. No hint line, no labels, no bearing, no story text; the intro dialog is three sentences.
- **Zones.** Each plant's ground is its own small world for the shared player (`makeZoneWorld`): the summit disc, the ledges (with the pillar's face as a wall), the cavern floor round its pool, the forest floor round the pillar's foot. Edges hold her; there is no falling.
- **Into a plant.** Walking into a plant pauses her; pressing on (the stick held toward it for 0.35 s) takes her into its roots: she sinks as a knot of wood to the root mouth at its foot (0.7 s), and the limestone goes glassy while she is in the network. A double tap on the ground within 3.2 m of a plant does the same.
- **The stick chooses the root.** At a mouth, after a short beat, pushing the stick the way a root visibly sets off (its departure three metres in, projected to the screen from where the camera is) picks it; the chosen root brightens gold while the stick points at it, and held for 0.3 s it is taken. Roots behind the camera cannot be chosen; the root she just arrived by is not offered until she lets go of the stick once, so a held stick does not bounce her back.
- **The ride is the karst's.** Water-slide kinematics unchanged (`stepRide`: downhill pulls to 13 m/s, uphill is a 3 m/s capillary climb, braking over the last 9 m). She rides as the knot along the root's centreline; the camera follows the root's own heading gently and a drag still offsets it. At the far plant she is at its mouth again: the stick chooses on, or a double tap of the stick grows her back onto that plant's ground (0.8 s).
- **Her trail.** Every cell she walks deepens with every pass and flowering tufts grow there, per zone (the summit and the cavern share x,z). Trail, plant met, the first arrival on the floor and the return to the summit save locally (`rootwake-karst-flow-v1`) and on page hide; reload wakes her on the plant she was last in.

## Files
- `src/karstFlowModel.ts`: the roots ridden here, routes, zone worlds, trunk footprints, `nearestPlant`, the press and choose constants, `departure` and `chooseRoot` (screen-space choice, testable with any projection), `screenDirections`, the per-zone trail, progress parse and `arrive`, `insideRock`. Tuning constants at the top and beside the choice.
- `src/karstFlowWorld.ts`: the scene (the karst world without its springs), one material per root so the chosen one can brighten, motes along the roots while she is in them, the trail as an instanced mesh.
- `src/karstFlow.ts`, `karst-flow.html`, `src/karstFlow.css`: modes ground / sink / mouth / ride / rise, press-into, double taps, the orbit camera, the atmosphere by place.
- `tests/karstFlow.test.ts` (`node scripts/test-karst-flow.mjs`): the roots and routes, zone worlds, the screen-space choice, the trail and saves, the camera's rock test.
- `scripts/browser-karst-flow.mjs`: real touch journey: held on the summit, a trail, press into the pine, slide east by the stick, into the stone, out in the cavern, a walk and a ground double tap back in, down to the oak, out on the floor, then up by another way (oak, south shrub, east shrub, pine), the return recorded, view toggle, reload, four viewports, a character continuity audit.

## Tuning to judge on the phone
- Does the stick's choice of root read without text: is the brightening enough, and is the 0.3 s hold right? Where two roots set off the same way on screen (at the east shrub, the cavern root and the south root both go down), does orbiting the camera make the choice clear, or does the mouth need to turn her to face the chosen root?
- The 0.45 s beat after arriving: long enough that a held stick does not skip a plant, short enough not to feel like a stop?
- Whether a double tap for coming out is discoverable with only the intro to say so, or whether pushing the stick where no root goes should grow her out.
- The camera pulling in on ledges when she faces away from the pillar; the ride camera through the glassy stone.
- The knot as her in the roots; whether the slide wants the knot smaller or the camera closer.
- Whether the taproot should return as an always-open fast way up, and whether the trail belongs on a pillar with no soil.

## Honest limits
An authored pillar and graph, not procedural karst. The ride camera has no collision with the rock: the stone is glassy while she rides. No falling from ledges. Browser emulation is not a phone.
