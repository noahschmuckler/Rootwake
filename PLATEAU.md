# The plateau: the land on top of the mountain (design record)

Noah, 2026-10-19: a realism pass for the top layer.

The overworld is a large plateau bounded by mountains, the summit of DiggyDwarves' karst-mountain. Its problems before this pass:

- The ground read as plains, flat with more or fewer trees.
- Rivers ended hard: each was a 140 m strip copied at every village.
- "The ford" and "the pines" were only names.
- Seven karsts stood in a cluster. They came of reading the eight karsts at a cubic world's corners as eight karsts together.
- Their helix trees hung as colourful spirals far off.

## What Noah decided

- **One karst** (the Wellspire) at the centre of a circular plateau 1.8 km in radius, ringed by mountains.
  - The karst rises from a small forested island in a central lake.
  - An ancient but serviceable stone bridge joins the island to the shore.
- **Rivers** rise in the mountains and flow to the central lake. The water source on the summit is not their source.
  - Following a river brings her to a village.
  - **Rivers are barriers.** She crosses only at their crossings:
    - the village at the ford's ford;
    - footbridges;
    - stepping stones.
- **The terrain** has a sensible erosion pattern, worked out as in the vista study, unnatural as the plateau is.
- **Root travel stays**, except the roots that ascend or descend the karst.
- **She starts on the summit.** She must meditate and cultivate before the first dive. Stepping out of the drop takes her to the ground-level portal on the island. The portal needs clarity and a match-3 session, as quickening does, and so does the way back in.
- **Forests** (the creature session's half of the work):
  - trees that tower over her, in irregular stands of various ages and heights;
  - bushy undergrowth;
  - leaf litter over irregular ground, with old and recent fallen trees moldering into soil;
  - dense enough to be disorienting to look into.

## The split with the creature session

- **This session:** the land, the water, where places sit, the karst, and the portals.
  - The land: height, erosion, lake, island, rivers, ford, bridge.
  - Files: `plateauModel.ts`, and the land half of `villageVista.ts` (to move to `plateauLand.ts`).
- **The creature session:** what grows on it, and the dark forest.
  - That is trees, undergrowth, litter and fallen logs.
  - It reads `plateau(seed)` for water, slope and height.

## Stages

- **T0, done:** one karst.
  - `PILLARS` is the Wellspire alone; the helices and `SISTER_ROOTS` are gone; no root climbs the karst's faces.
  - The pillar's rock is drawn from any distance.
- **T1, done:** the land as rules (`src/plateauModel.ts`, `tests/plateau.test.ts`).
  - The plateau is centred on `KARST_AT`. The world's origin stays at the first village, 337 m from the karst.
  - **The lake:** `LAKE_R` 215 m with a wobbling shore, water at `WATER_Y` −1.2.
  - **The island:** `ISLAND_R` 104 m, flat at 0, the karst's floor.
  - **The bridge:** from the island toward the first village, deck crown 4.2 m over the water.
  - **The bowl:** rising `RIM_RISE` 62 m from the shore to the rim, hills over it, the vista's ridged mountains past the rim.
  - **Rivers:**
    - one per village, routed from the foothills through the village's own stream (the layout's `STREAM_Z`) and on to the lake;
    - two wild rivers in the widest gaps;
    - each river's surface is monotone downhill.
  - **Village terraces:** a village's green is flat at `BANK_H` over its river.
  - **Crossings:**
    - the ford village's ford (`FORD_DEPTH` 0.22 m, waded);
    - a footbridge in each other village;
    - stepping stones and footbridges by turns every `CROSS_EVERY` m along every river.
  - **Places:** dens, ruins, warrens, wallows and the moot all stand on dry plateau ground (`onLand`).
- **T2, done:** the land drawn (`src/plateauLand.ts`, `src/plateauWorld.ts`).
  - **Erosion over the whole plateau:** the vista's droplets (110k on a 1025-sample grid, 6.4 m cells) erode the plateau's shape everywhere but the villages' greens, the island and the lake's bed. The shape is the bowl, ridged hills (`HILL_M` 24, `RIDGE_M` 22), and valleys roughed in toward every river.
  - **The carving:** terraces, lake, island and channels are carved after erosion. The vista's finer near mesh (`fineLod`) is on, so a channel survives on screen.
  - **Rivers:** `RIVER_HALF` is 3.6–8 m.
  - **Grass:** the rivers' banks are marked in the land's flow map, so they read as gravel and grow no grass.
  - **The bake:**
    - The seed is fixed, so `vite build` bakes the eroded grid (the `plateau-bake` plugin) to `land/plateau-1.bin.gz`, 3.6 MB.
    - Heights are delta-coded 16-bit; the flow, sediment and occlusion maps are bytes.
    - `loadVillageLand` fetches it, gunzips it and checks its fingerprint, which is the shape sampled, the grid and the erosion. A missing or stale bake erodes in place, about 7 s on a desktop.
    - The village awaits it at the top of its module, so the build targets es2022.
  - **What is drawn:**
    - each river's water: a five-across ribbon at its surface, the vista's water shader with its depth from the channel, flowing downstream, white where shallow;
    - stepping stones;
    - the ford's gravel and stones;
    - plank footbridges on logs with rails;
    - the island's old bridge: an arcade of stone piers with cutwaters, arched spans and parapets.
  - **The old stream:** the village layout's own stream ribbon and banks are gone; the river is the stream now.
  - **Terrain everywhere:** `worldTerrain.createTerrain` is the plateau's unaroded ground, so the plain look and the villages' houses stand on the same terraces.
  - **Trees:** chunk trees keep out of the water and off the rim (`onLand`).
- **T3, done:**
  - **She wakes on the summit,** by the pool, facing the first village. The fight's practice clearing places her itself.
  - **The first dive** waits on her cultivation: `FIRST_DIVE_GROWTH` 20 gems, or any tier past the first.
    - Meditation already pays the dive's clarity.
    - At the pool the dive button reads "cultivate first" until then.
  - **Rivers are barriers:** walking and grass travel refuse water deeper than `WADE_DEPTH` 0.35 m (`walkable`). The decks are walked on.
  - **Roots pass under the rivers:** root travel is unchanged.
  - **Not yet:** hobbits, wolves and the Dark Young still walk through rivers.
- **T5, done:** the portals (`src/portalFigure.ts`; the portal alcove and `portalSpot` in `descentModel.ts`; the wiring in `village.ts`).
  - **The catwalk portal:** every catwalk has a portal in an alcove of its own, a stone arch with a swirling film.
    - "Open the portal" sits her down to the board.
    - `PORTAL_GEMS` (12) gems of clarity channelled into it open it, as a quickening is opened. The film brightens with the channelling.
    - A 3.2 s passage on the deep roots' bore runs through the rock, out to the island's portal at the karst's foot, 26 m out toward the bridge.
  - **The island portal:** opened the same way, it takes her back to the catwalk at the node's depth.
  - **Dev:** `__village.deep.openPortal`, `islandPortal()`, `cult.grow`.
- **Checks:**
  - `tests/plateau.test.ts` covers:
    - the island and lake;
    - the bridge;
    - rivers that never climb and pass through every village;
    - fords and barriers;
    - places on dry land;
    - the bake's round trip.
  - `scripts/browser-village-vista.mjs` checks:
    - she wakes on the summit;
    - the land was baked;
    - no first dive before cultivating;
    - the catwalk portal, out to the island;
    - the island portal, back in.

## Notes for the phone

- **Load time:** the land now loads from the bake. The old in-page erosion would have cost a phone about 15–20 s.
- **Cost:** the vista draws about 700–950k triangles around the villages, and 35k of that is the finer near mesh.

## The dark forest's place (agreed with the creature session, 2026-10-19)

- **Where the breach stands:** `LAIR_FROM_KARST` 1050 m from the karst, about 100° off the karst→village line, on the side the seed picks. That is about 1157 m from the first village.
- **The taint's extent:** `TAINT.edge` stays 650 m, so the taint ends 1700 m from the karst, inside the rim, about 300 m from the first village.
- **What it keeps out:** rivers stay out of the taint and its veins (edge plus 120 m); the other villages stay a further 60 m clear (`SITE_LAIR`).
- **`LAIR_DISTANCE`** (1160) is the village's distance to the breach, rounded up. It sets how far the home village's presentation reaches.
