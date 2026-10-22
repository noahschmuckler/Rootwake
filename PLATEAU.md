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
- **T4, the forests (the creature session), first pass done 2026-10-20.** Noah: denser forests of different ages, saplings, leaf mould under dense canopy, shrubs and undergrowth, so a forest reads apart from the wooded plains and feels impenetrable without being harder to walk.
  - **Stands** (`chunkModel.forestField` / `forestAt`, 0..1): a slow noise (`FOREST_WAVE` 170 m) broken by a quicker one runs stands of true forest through the wood. It is 0 on the meadows, on the karst's island and in her taint (her wood keeps its own rule). About two fifths of the wood is forest; the rest is wooded plains.
  - **The trees** (`chunkTrees`): the plains' trees stand where they always stood (the old draw is untouched). A second draw adds a stand's trees, up to `FOREST_CAP` 60 a chunk, closer the deeper in (`SPACING` 4.5 → 2.1 m, scaled by size).
    - They come in `AGES`: old giants 1.7–2.4 (14%), mature 1.0–1.6 (50%), young 0.55–0.95 (36%).
    - They are real trees: climbed, rooted, colliding. Trunks never crowd her way shut (tested).
  - **The understory** (`understory.ts`): saplings (1–2.7 m), shrubs (0.4–1.6 m, at her chest and over her head) and ferns, drawn and not stood on, so she pushes through.
    - Each 24 m tile grows the same whenever it comes near, clear of the trunks, the water and the places. It is thickest at a stand's edge (shrubs, saplings) and in its shade (ferns), with a few shrubs out on the plains.
    - They are drawn instanced, in the vista's own light and sway, within `UNDER_REACH` (Low 32 m, Medium 44 m, High 62 m).
    - Tiles grow a few milliseconds a frame, nearest first, never all at once. The forest map is sampled every third land cell. Ferns carry both faces so all the understory shares one shader.
  - **The floor:** leaf mould (`LITTER`, mossy where the canopy opens) over the wood's green in the ground tint.
    - The canopy (`canopyMap`, in the map texture's spare red) thins the grass beneath it and takes `CANOPY_SHADE` 0.62 of the sun from the ground, the grass, the understory and the trunks. The stand is dim inside; the plains stay bright and grassy.
- **T4b, the Pine Barrens (Noah, 2026-10-21; the land session).** Noah: the stands' lumpy blob crowns read cartoonish, and the village went visibly slower, on desktop too; the look to go for is the New Jersey Pine Barrens, and the aim is nearer that look *and* faster than before the stands.
  - **What cost (measured headless, the stand at (100, −500), Medium):** at near-equal triangle counts a stand's edge went 284 → 428 ms a frame under SwiftShader, so the cost was fill, not geometry: `fbm3` noise per foliage pixel over the crowns' overdraw (7–9 lumps a crown), and the understory's 140–160 triangles an item through the same shader. Besides: the understory re-uploaded its whole 9000-instance buffers on every rebuild (`bufferSubData` was 6% of a walk), `chunkWorld.treesFor` recomputed `chunkTrees` on every call (the understory asks 4–9 times a tile), every chunk built its own hidden tree meshes under the look, and the villages' own trees' root collars (72k triangles a village) were drawn under the vista's trunks.
  - **The pitch pine** (`vistaWorld.pitchPine`, kind 11): the land's tree outside the villages' woods and her taint (`villageTrees` routes a chunk's living tree to 11; the villages' own broadleaves stay 5, the dark wood and the taint theirs). At size 1 it is `PINE_H` 6.4 m: a crooked trunk bare to the crown's foot at 3.4 m (villageModel.crownHeight, so her climb meets the lowest limbs there, 1.1 m out, as before), five twisted limbs out and up ending in needle tufts, a ragged top. Giants 15 m, the young scrubby 3.5 m. Trunk and limbs are geometry (~160 triangles); the crown is crossed cards of the `pine` sprite (sprites.ts: a bottle-brush tuft, dark at the heart), so sky shows between the tufts, through the new card shader.
  - **The card shader** (`vistaShaders.cardVert/cardFrag`): textured, alpha-tested, both faces, the vista's toon light on crown-volume normals (not the card's face), per-instance tint by hash instead of per-pixel noise, canopy shade (`UNDER`), the low sun through needles (`USE_SWAY`), haze. A card within arm's reach of the camera dissolves (dithered) rather than filling the view.
  - **The far pine** is two crossed cards of an impostor: the near pine drawn once by the renderer into a texture (`pineImpostor`, lit as its albedo; `PINE_FRAME` 5 × 7.2 m) so the far tree matches the near one at the 60 m switch. Four triangles a tree. Without a renderer (the plain vista study) the far card wears the needle sprite.
  - **Shadows:** the pine crown's caster cuts its shadow from the texture's alpha (`MeshDepthMaterial` with the map), so the floor is dappled under a pine.
  - **The understory as cards** (`understory.ts`, the drawn half; `underTile` unchanged, tests unchanged): lowbush blueberry and huckleberry (the small shrubs, below `BERRY_BELOW` 1.5 of SIZES.shrub: the barrens' knee-high carpet, the `berry` sprite), scrub oak (the big ones, 1.3–2.3 m, `leaf`), bracken (`frond`), young pitch pines (a solid stem and `pine` tufts). Four to six triangles an item; `UNDER_REACH` raised (Low 36, Medium 50, High 70 m).
  - **The floor:** needle litter (`LITTER`) under a stand, the barrens' pale sugar sand (`MOSS` is the sand now) where the canopy opens; the grass thins harder under the canopy. `SPACING` 5.0 → 2.8 m and `FOREST_CAP` 48: pines stand apart, the stand is tall and open, not a wall.
  - **CPU:** `chunkWorld.treesFor` is cached per chunk; a chunk builds no tree meshes when another look draws them (colliders still); the villages' tree collars are hidden under the look; the trees', rocks' and understory's instance buffers upload only the instances in use (`addUpdateRange`).
  - **Measured (same spots, Medium, triangles over every pass):** stand 1071k → 865k, stand's edge 1203k → 866k, plains 1309k → 927k, the green 1067k → 868k; the pre-stands build was 992k–1053k at those spots. The far crowns in those counts are mostly the taint's (kinds 6, 9, 10: thousands of trees), not pines.
  - **Still on the table:** the chunk root network is ~210k triangles of tubes near a stand (root travel's, not the forest's); the taint's trees keep the solid lump shader; the pine tuft sprite and the scrub oak's roundness want tuning by eye on the phone; the villages' broadleaves could take the card treatment too.
- **T4c, more of the barrens (Noah, 2026-10-21; the land session).** Noah: oaks; dense flora where the rivers cut through forest; ground cover that scales with the forest's density, and not tan sand alone but leaf mould, needles and detritus; texture maps from the internet for the floor, the bark and the leaves, performance kept.
  - **Textures (`groundTextures.ts`):** this session's network reaches only the repository (ambientcg.com, polyhaven.com, wikimedia and the rest are denied by the environment's policy), so every map is drawn, tileable, in colour, on a 512 canvas: `sand` (not clean: darker grains, lichen crusts, needles, leaf scraps, twigs), `needles` (the mat, russet to grey over dark humus, cones), `leaves` (oak leaf mould, rotting beneath, ochre on top), `moss` (sphagnum cushions over black peat, sedge), `bark-pine` (plates in reddish furrows), `bark-oak` (vertical ridges), `bark-cedar` (shredding strips). **A photo replaces any of them without a code change:** drop a CC0 JPEG at `public/textures/barrens/<name>.jpg` and list the name in that folder's `index.json` (its README says how); the page swaps the pixels in when it loads.
    - The photos are in (2026-10-21, the network open): all seven from ambientCG (Ground 084 sand, Ground 037 moss, Bark 014 pine, Bark 001 oak) and Poly Haven (Forest Leaves 04 needles, Dry Decay Leaves leaf mould, Japanese Cedar Bark cedar), CC0, 1.2 MB in all, listed in `public/textures/barrens/index.json` and credited in its README; the drawn ones remain the fallback. `barkScale` unchanged.
  - **The floor map (`villageVista.floorMap`, `uFloor`):** per land cell, how much needles, leaf mould, moss and peat, and bare sand lie on it, from the stand's depth (`forestAt`), the oaks about (`oakShare`, a slow noise: groves of oak, oak scattered through the pine) and the water's nearness (`riverEdge`): the wooded plains carry a scatter of needles over sand under the grass; a stand's floor is needles under pines and leaf mould under oaks with sand in its gaps; by the water it is peat and moss. The terrain shader (`floorDetail`) tiles the four maps at two scales and weighs them by the map, over the land's own colour and the old tint; the grass keeps its flat colour (no texture fetch in a vertex shader).
  - **Bark:** `solidFrag`'s `BARK` define samples a bark map by the trunk's uv, in metres along and round the limb (`limb(…, bark)` keeps uv; `CARDS[kind].barkScale` sets the repeats), tinted by the kind's bark colour; the per-pixel noise the plain solids pay is skipped there.
  - **Oaks (`vistaWorld.blackjackOak`, kind 12):** the blackjack and post oak, OAK_H 6 m at size 1, a stout crooked trunk, five thick limbs that fork, a broad ragged crown of big lobed-leaf cards (`oak` sprite), bare to 3.4 m like the pine so her climb still meets the crown. A chunk's tree is an oak by `oakShare` (16 % everywhere, up to 71 % in an oak grove).
  - **Cedars (`vistaWorld.whiteCedar`, kind 13):** the Atlantic white cedar of the barrens' streams, CEDAR_H 9 m at size 1 (grown 1.2–2.1: 11–19 m), a thin straight trunk and a narrow column of flat sprays (`cedar` sprite), two crossed pairs a level, dark blue-green; cheap, as they stand close. `chunkModel.cedars` is a third draw: within `RIPARIAN` 16 m of a river's edge through wooded land, thick at the water, `CEDAR_GAP` 2.8 m, clear of the crossings' approaches (`crossingNear`), the chunk still capped at `FOREST_CAP` 44. The look reads the same river distance to make any chunk tree there a cedar.
  - **The streamside thicket (`understory.ts`):** within `RIP_REACH` (4–24 m) of the water the tile grows `RIPARIAN_ADD` more shrubs and ferns, and its shrubs are the tall ones: highbush blueberry, sweet pepperbush and leatherleaf over her head (the `highbush` sprite), cinnamon ferns beneath. `UnderLand.river` is optional, so the tests' land is unchanged.
  - **Cost:** the same triangle counts as T4b at the four spots (866k, 833k, 934k, 866k); the terrain fragment pays eight more texture reads, the barked trunks one. Verified: 71 village tests, the vista village browser check.
  - **Still on the table:** photo maps once the network (or Noah) brings them; the oak-leaf and cedar sprites, the thicket's reediness and the floor mix all want the phone's eye; the far rivers' cedars show as dark spikes against the sky (their impostor could carry a fuller crown); the villages' own broadleaves keep the old blobs.
- **T6, the brink (Noah, 2026-10-21; the land session).** Noah: the mountains mark the edge of a massive plateau; reaching the edge reveals a landscape of clouds, and peering over shows the whole terrain rising above lower cloud cover, smaller peaks through it here and there, and where the cover breaks a much larger world very far below. His calls: just a few reachable passes; a cloud sea clearly unreachable but high enough that the breaks are dramatic and dizzying; the edge viewpoints as deep-root destinations reachable by default.
  - **The belt (`plateauModel`):** the mountains still rise over `MOUNTAIN_RISE` 650 m past the rim, but past the crest the ridge collapses within `RIDGE_FALL` 180 m and the land falls as an escarpment, `ESCARP` 950 m of run and steepest at the top (`e = smooth^0.72`), to a lowland at `LOW_Y` −2300: 2.6 km below the rim's foot. The lowland (`lowland`) is a great plain with slow hills and `PEAK_N` 6 outer peaks (`peaks`: 3.5–5.4 km out, 950–1450 m across, tops `CLOUD_Y` + 260–680) that stand through the cloud. Erosion (`plateauLand.erodeMask`) stops short of the crest (`MOUNTAIN_RISE` − 150) so the saddles and the lip keep their shape: the droplets had dug the passes' ends into gullies and heaped the brinks.
  - **The passes:** `PASS_N` 3 bearings spread round the plateau (`passAngles`, nudged off the rivers' sources), each a corridor `PASS_HALF` 11 m wide (`passAt`, fading over 30 m more) where the ridge is notched to a saddle `PASS_RISE` 190 m over the rim (a 15° climb) and the notch runs on through the crest and down the fall, so nothing stands over the brink. `walkable` refuses the belt past `PASS_FOOT` 40 m but inside a pass, and refuses everything past `MOUNTAIN_RISE + BRINK_PAST + 8`: the pass ends at the brink, and past it is the fall.
  - **The brinks (`Plateau.brinks`):** where each pass line crosses `BRINK_PAST` 6 m past the crest, named by their bearing (the north brink…). A fairy ring stands at each (chunkWorld's, as at the convergences). Tested (`plateau.test.ts`): walkable all the way up each pass and never a step down, the ridge beside each saddle 30 m over it, no step past the brink, the fall under the cloud within 400 m and 1.5 km below it within 1.4 km, the belt closed off the passes, peaks through the cloud.
  - **Deep roots (`deepModel`, `village.ts`):** a `'brink'` is a `DeepKind` the node's roots always reach (`reachable`: as the pool), so the three brinks are hers from the first dive; `deepPlaces` lists them, their lights at the node's horizon a pale gold; standing in a brink's ring (`BRINK_R` 7 m) offers the deep root back down (`stillPlace`), paid as a shrine's return. A launch to a brink takes ~40 s (`DEEP_SPEED`). The minimap marks them.
  - **The cloud sea (`vistaShaders.cloudFrag`, `vistaWorld` `cloudSea`):** two sheets at `CLOUD_Y` −260 and 90 m under it, from under the belt's foot out to `FAR_REACH` 18 km: slow fbm swells (both sheets share them, so a break is a break) with each sheet's own billows, tops lit toward the sun and hollows in the sea's shade, breaks where the swell sinks (`CLOUD_COVER` 0.5 opens about a third; the noise's own middle is 0.61, `c0 = 0.70 − cover × 0.25`), hazed, never written to depth. From the brink the sea lies 540 m below; the lowland another 2 km under the breaks.
  - **The world below:** the far ring runs on to `FAR_REACH` at 320 m spacing (`ringMesh`), the sky dome and the camera's far plane grown to match; below `uLowY` the terrain is coloured as country from a great height (`lowlandColour`: dark woods, paler plains, earth, water in the lowest ground); the shore tint stays at the lake's level. The haze is thinner below the plateau's base (`uHazeBelow`, `HAZE_BELOW` 0.07, `applyHaze` split at the base) so the lowland shows through the breaks instead of washing to sky.
  - **Also:** the water plane is a disc of the plateau (`waterDisc`), so no lake lies over the lowland; the bake's heights are 32-bit differences (the 16-bit range ended at −50 m and flattened the fall); the snow line `SNOW_Y` 470 so the passes are not glaciers; the sky's painted cumulus thins to nothing at the horizon (it smeared into bands seen from the brink).
  - **Cost:** at the brink 551k triangles, 34 calls (less than the village: no near trees); the two cloud sheets are two draws of a ring each.
  - **Tuning by eye:** the sea's cover and its lighting, `HAZE_BELOW`, the lowland's colours, `CLOUD_Y`; the outer peaks could carry snow and forest; the passes could carry a cairn or two; the belt's ridges keep the old unaroded noise above the erosion's reach.

  - **Cost** at Medium (`?hud=1`, the same spots), against about 810k triangles before: deep forest about 1.14M, a stand's edge 1.15M, wooded plains 0.93M. Far off, a crown smaller than `YOUNG_FAR` 1.25 is not drawn past `YOUNG_REACH` 260 m. At Low, deep forest is about 790k.
  - **Not yet:**
    - fallen and mouldering logs, as low canonical step and vault obstacles (PLATEAU's ask, the parkour's ground);
    - irregular ground under the litter;
    - the plain (non-vista) look's understory;
    - a phone judgement of the cost.
- **T5, done:** the portals (`src/portalFigure.ts`; the portal alcove and `portalSpot` in `descentModel.ts`; the wiring in `village.ts`).
  - **The catwalk portal:** every catwalk has a portal in an alcove of its own, a stone arch with a swirling film.
    - "Open the portal" sits her down to the board.
    - `PORTAL_GEMS` (12) gems of clarity channelled into it open it, as a quickening is opened. The film brightens with the channelling.
    - A 3.2 s passage on the deep roots' bore runs through the rock, out to the island's portal at the karst's foot, 26 m out toward the bridge.
  - **The island portal:** opened the same way, it takes her back to the catwalk at the node's depth.
  - **Dev:** `__village.deep.openPortal`, `islandPortal()`, `cult.grow`.
- **T8, the stratum (Noah, 2026-10-22).** Noah: "Underground grass/root view shouldn't allow me to see the entire world, there should be a layer of impenetrable rock blocking my view running roughly parallel to the surface soil." The probe (a Playwright ride under the vista look) found the grass ride's camera 1.3 m *above* the surface on flat ground with the soil about her at 22 % and the whole world past it (the trees, the lake, the mountain ring, the sky), the root ride's camera at the surface give or take half a metre, and from the old bridge's deck the camera 12 m up over the river seeing everything; the roots lie 0.5–1.5 m under the surface (median 1.0 m). Only the shallow rides change (the grass, a surface root, the sink and the rise); the deep's view of the world from beneath, the dens, the catwalk and the karst's conduits are as they were.
  - **The rock:** `stratum` in `vistaWorld.ts`, one sheet of `STRATUM_CELLS`² (56²) cells of `STRATUM_CELL` (1.5 m) about the camera, snapped to its cells so it never swims, each vertex set `SOIL_DEPTH` (2.6 m) under the walked surface in the vertex shader (`stratumVert`: the fine window where it reaches, as the grass stands, the height map beyond), so the ride runs between the soil above and the rock below with the roots between. Dark wet rock from the shared noise (`stratumFrag`: strata seams, mottling, a glint), no texture, both faces, lit by a glow about her that is gone a few metres out, then the under fog. 6.3k triangles, one call, drawn only while she is under.
  - **The soil:** `terrainFrag` draws the land as dark earth (`soilEarth`: a grain of root threads and stones, the same glow about her) wherever its normal turns away from the eye (its underside, seen from a ride; never a skirt seen from above), and its top turns to the same earth by the under amount: she is beneath the grass, so no sunlit meadow. The glass about her (`uSoil`) thins it as before, so the rock and the roots show through it.
  - **The dark:** `uUnder` (the soil's colour `UNDER_COLOUR` and the amount) and `uUnderD` in `applyHaze`, so every vista surface ends in the soil's dark within `UNDER_FOG_M` (24 m, to 5 %); the sky mixes to it; the water plane (which lies under the land at −1.2 m and would show through the glass as a bright sheet) fades by it; the scene's own fog (the roots, the houses, the figures) closes to the same reach, its colour and the background lerped to the soil's; the vista's sun and sky-light dim to a tenth and a quarter. All of it follows the village's `under` ease, so it closes with the sink and clears with the rise.
  - **What is not drawn past halfway:** the sky dome, the lake, the cloud sea, both far rings, the far crowns, and every terrain tile farther than `UNDER_TILE_REACH` (70 m) from its near edge: 3–4 of 256. So the ride costs less than the ground, measured at Medium at matched spots (`?hud=1`, SwiftShader): on the ground 786k triangles and 129 calls before and after; under the grass on flat ground 470–511k and 95–113 before, 306–351k and 44–65 after; carried along a surface root 492–516k and 110–116 before, 330–354k and 63–67 after; on the bridge's deck 587–627k and 268–431 before, 385–421k and 215–341 after.
  - **The camera:** on a shallow ride it is held no deeper than `CAM_SOIL` (1.4 m) under the surface at its own spot (`orbitCamera`), so behind her up a hillside it stays in the soil band over the rock instead of sinking into the hill. A guard: the probe's hillsides (slopes to 0.47 where the grass takes her) never put it under; its 1.3 m lift clears a slope of 0.4 at 3.2 m back.
  - **The seam:** `LookFrame.stratum` (0..1), set by `village.ts` from its `under` ease except in the karst's rides; `villageVista.frame` drives `world.setUnder`, the fog and the lights; `__look.stratum()` reports the amount, the rock, the tiles drawn, what is hidden and the fog's reach.
  - **Not yet:** the plain look (`/village/`) is untouched; the ride's camera still rides above the surface on flat ground (lowering it into the soil band is a design call); the earth and rock colours and glows are first guesses for the phone.
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
    - the island portal, back in;
    - the stratum on under the grass (the rock, a fog under 40 m, no sky) and gone on surfacing.

## Notes for the phone

- **Load time:** the land now loads from the bake. The old in-page erosion would have cost a phone about 15–20 s.
- **Cost:** the vista draws about 700–950k triangles around the villages, and 35k of that is the finer near mesh.

## The dark forest's place (agreed with the creature session, 2026-10-19)

- **Where the breach stands:** `LAIR_FROM_KARST` 1050 m from the karst, about 100° off the karst→village line, on the side the seed picks. That is about 1157 m from the first village.
- **The taint's extent:** `TAINT.edge` stays 650 m, so the taint ends 1700 m from the karst, inside the rim, about 300 m from the first village.
- **What it keeps out:** rivers stay out of the taint and its veins (edge plus 120 m); the other villages stay a further 60 m clear (`SITE_LAIR`).
- **`LAIR_DISTANCE`** (1160) is the village's distance to the breach, rounded up. It sets how far the home village's presentation reaches.
