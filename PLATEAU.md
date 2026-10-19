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
- **T2:** the land drawn.
  - The plateau eroded with the vista's droplets.
  - Channels and banks carved after, water surfaces for the lake and the rivers.
  - The ford's stones and gravel, the footbridges and stepping stones, the old bridge's arches.
- **T3:** into the village.
  - Rivers block walking except at crossings.
  - She starts on the summit. The first dive is gated on meditation and cultivation.
  - Saves reset (every place moved).
- **T5:** the portals.
  - On the first catwalk, a portal opened by clarity and a match-3 session.
  - A short passage out to a ground-level portal at the island's foot, and the same back in.

## Open

- **The dark forest must fit inside the rim.** The creature session's lair at `LAIR_DISTANCE` 950 m from the first village, with `TAINT.edge` 650, reaches past the plateau's edge. I've asked them to keep the lair plus the edge within about 1700 m of the karst.
