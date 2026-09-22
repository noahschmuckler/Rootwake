# The Village: continuation guide

## Latest status
Play: https://noahschmuckler.github.io/Rootwake/village/
Source branch: feat/village (from feat/karst-flow, so it carries the rigged Hulda and every study). Deployment: `.github/workflows/deploy-village.yml` on every push to the branch: every unit suite including the village's, the production build at `/Rootwake/village/`, the browser journey in GitHub's Chromium, publication of `village/` only on gh-pages, then the public revision.json and asset check. Tested and published code commit: bc4de43 (V0.1: her ways, thoughts always, facing; V0 was 32a038b). Successful verification and deployment run: https://github.com/noahschmuckler/Rootwake/actions/runs/35676193301 (V0: 35672720741) (all suites, the browser journey in GitHub's Chromium in about a minute, publication of `village/` only, public revision.json and asset check; screenshots in the run's `village-browser-results` artifact).

Read `VILLAGERS.md` first: the brief, the principles, the pass order and Noah's decisions. This file is V0 as built.

## V0: presence
The question: do figures going in and out of houses on a day's rhythm already read as people living there?
- **The place.** A meadow by a stream. Six round houses on a ring nine metres from the green, doors to the green, thatch cones, a window each. The fire at the green's centre, worn paths from it to every door and out through every gap between houses to the places they keep to: a berry thicket, the stream's bank, a copse, a field of tilled strips, a goat pen with three goats, a standing stone. A wood round the edge.
- **The eight.** Marlo and Tansy (one house), Pip, Wren, Bram and Hazel (one house), Odo, Nell. Each keeps to a place (Odo keeps the fire: the elder to be; Nell the stone: the spiritual leader to be; two to the thicket, one each to the copse, stream, field and pen), rises at their own minute after dawn, and walks at their own pace. Names over their heads while near; a thought bubble when the rhythm moves them ("picking berries", "to the fire", "home") and now and then at the fire ("the stream is low").
- **The rhythm.** A day is 1440 ticks, 20 real minutes; tick 0 is 06:00. Dawn to 07:30 (each leaves at their rising minute), morning at their place, noon 11:30 to 13:00 together at the fire facing it and talking, afternoon at their place, dusk from 18:00 (each goes home at half their rising minute after), night from 19:30 indoors. At a place they stand and now and then take a step to a new spot. Paths go by the green, never through the ring.
- **Only while watched.** Ticks come from real seconds while the page is open; hidden, nothing passes. The village saves every five seconds and on hide (`rootwake-village-v1`).
- **Bodies.** The hobbits are Hulda's skeleton at 0.46 m (`createHulda` takes `FigureOptions`: height, colours, no vine locks, no leaves, a cloth hem), so the same Mixamo clips drive all nine; a hobbit's stride is fed the speed it would be at Hulda's size. The shown figure eases after the model's tick so a tick's step reads as walking.
- **Light.** The sun by the clock; sky through dusk to a night blue; the fire and the windows lit at night.
- **Hulda** walks in the free-flow controls, third person, first person by the button. They do not see her. No sinking, no trunks here yet.

## V0.1: her ways, thoughts always, facing and fidgeting (Noah's first phone notes)
- **Her ways through the meadow** (the clearing's moves, ported): press into any tree to enter its trunk, rise to the crown, slide round it and leap to a crown within reach; double tap the stick and she is a bulge under the grass (`GRASS_SPEED` 3.8 m/s, faster than her run, free in any direction, not under the houses or the water); run along one of the tree roots that join the copse and the wood and it takes her (`ROOT_SPEED` 6.5 m/s, held to its path, the aligned root at a tree, back to reverse, sideways for a quarter second to drop into the grass); pushing down at a trunk's foot sinks her into the grass; a double tap of the stick brings her out of any form. The meadow goes glassy while she is under it, so the fast lanes show.
- **Thoughts always.** A hobbit out of doors always has one: what they are doing ("gathering berries", "milking the goats", "keeping the fire"), where they are going ("walking to the thicket", "walking to the fire", "going home"), talk by the fire, and the chatter for a few ticks when it comes.
- **Facing.** They walked backwards because the rig faces −Z at yaw 0 and the model's heading is an angle in x,z: yaw = −π/2 − heading. Fixed and checked in the journey (the share of walking frames that face forward).
- **At a place** they turn to face one thing and then another every few ticks and step to a new spot twice as often as before, instead of standing still.

## V0.2: one camera rule, the double tap on the stick, a paced walk (Noah's second phone notes)
- **One camera rule for every form.** Every form's camera (grass, root, trunk, crown, leap) is now the shared third person's rule (`orbitCamera`: behind her by yaw, a fixed lift, the look tilted by pitch), so the same drag turns the view the same way whether she is the walker, the bulge or the knot. Before, the still forms lifted the camera by pitch and looked at her, so a drag read inverted between forms. The same rule is in the karst free flow and the clearing.
- **The double tap lives on the stick only.** On the ground a double tap of the stick takes her under the grass where she stands (the clearing: into the roots; the karst: into the nearest plant's roots within reach); in any other form it brings her out. The screen's double tap is gone; screen taps only walk and look. Pressing into a tree or plant still enters it.
- **A root catches her along the whole step.** Under the grass the root check runs along the distance she moved this frame (`ROOT_CATCH_STEP`), for any root within `ROOT_CATCH` whose run agrees with hers (`alignedRoot` in the model, the best aligned first, not only the nearest), so a slow frame cannot carry her over a root and a neighbouring root cannot hide the one she is running along. The browser journey aims her along a copse root rather than spiralling.
- **Hobbits walk at their pace.** The shown figure used to ease toward the model's tick position at 1.35 × pace + 0.2 m/s, so each tick was a dash and a wait. Now it walks at 1.08 × the hobbit's own pace (only a jump of more than 2.5 m, a hitch, closes at 2.5 ×), so a destination once set is one continuous walk; the small extra keeps the lag from growing over a route.
- Only the village workflow runs on this branch; the karst free flow and the clearing carry the same camera and stick changes in source (`src/karstFlow.ts`, `src/flow.ts`, their intros and journeys) but their sites republish only from their own branches.

## Files
- `src/villageModel.ts`: the day (ticks, phases, clock, daylight), the layout (houses, sites, the green), the eight hobbits, `wants`, `route` by the green, `advance` (deterministic from the seed), `thought`, `everyone`, `inHouse`, parse and serialise; her ways: `TREES`, `TREE_ROOTS`, `nearestRoot`, `alignedRoot`, `nextRoot`, `hopTargets`, `grassCan`, the stream's course. Tuning constants beside each thing.
- `src/villageWorld.ts`: the scene, the figures (`HOBBIT_HEIGHT`), `update(daylight)`.
- `src/village.ts`, `village.html`, `src/village.css`: the tick bank, the eased figures, name labels and bubbles, the clock, light by the hour, the `__village` handle (`advance(n)` jumps the day for checking).
- `tests/village.test.ts` (`node scripts/test-village.mjs`): the layout, the day, the rhythm over two days with nobody through a house and nobody teleporting, routes by the green, determinism, pause and saves.
- `scripts/browser-village.mjs`: the journey: clips on all nine, dawn indoors, a walk, ticks only while watched, morning out with the walk clip playing and names in view, noon at the fire with talk and a bubble, night home with nobody shown, day two, reload keeps the day, four viewports.

## To judge on the phone
- Does it read as people living there? Is 20 minutes a day right, or should the first days run faster?
- The hobbits' size (0.46 m against Hulda's 0.72) and their cloth; whether the goats and the stone earn their place.
- Names always on when near, or only when she looks at someone?
- The bubble's moments: on every change, or only at the fire and the door?

## Honest limits
No needs, no stores, no picking: V1's. They walk straight lines between waypoints and ignore each other on the way. The stream is a ribbon she can wade on foot but not pass under the grass. Browser emulation is not a phone.
