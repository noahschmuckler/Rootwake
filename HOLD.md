# The Hearth-Hold

Noah, 2026-11-02. The band's cave becomes the foot of an old masonwork. The land has seen civilisations rise and fall more than once, so the hobbits live in the ruins of a Dwemer-like work built into the mountain's side. Six dry terraces of stone beds climb a processional stair to a facade cut into a raised bluff, with halls behind it, large enough for Hulda to enter. The fire before the door is magitech: a gas flame that has burned since the builders left. The beds are terraced farm plots, though the hobbits don't know it. A later quest opens the waterworks behind a sealed door and teaches the band to farm them. There is no comfortable furniture: stone seats, stone beds, stone benches, stone desks.

The approved schematic, a plan over the real contours, a section, the halls and the hearth, is at https://claude.ai/artifact/Hb9Jm1whFxTYzG4p1Hmm6M. Noah took its four recommendations:
- the band eats at the Ever-Hearth up top;
- the hold keeps its full scale;
- one collapsed wing;
- the cave becomes the Lower Gate.

## The frame

`holdModel.ts` is pure and node-tested in `tests/hold.test.ts`.
- **Origin:** the cave's mouth. That is the first village's bearing from the karst, where the belt has risen `CAVE_INTO` (10 m). `plateauModel.hold.cave`, which `village.ts`'s `caveSpot` now reads.
- **Axes:** `v` runs into the mountain and `u` across it, + to the right when facing the mountain.
- **Heights:** given over the **datum**, the natural ground at the mouth before erosion (`plateau.hold.datum`).
- **Helpers:** `toLocal`, `toWorld` and `headingOf` convert between the frame and the world.

## The layout (`holdModel.ts`)

- **Apron:** u ±10, v -8..8, at ±0. The Lower Gate's two plinths stand on it, and its lintel lies fallen.
- **Terraces:**

  | Terrace | v | Height | Half-width | Beds a side |
  |---|---|---|---|---|
  | T1 | 8–30 | +1.2 | 46 | 3 |
  | T2 | 30–48 | +3.2 | 44 | 3 |
  | T3 | 48–64 | +5.6 | 40 | 2 |
  | T4 | 64–80 | +8.6 | 36 | 2 |
  | T5 | 80–94 | +12.2 | 30 | 1 |
  | H (hearth terrace) | 94–110 | +15.8 | 30 | none |

  H was 26 wide in the schematic and is widened so the facade's side doors open onto it.
- **Flights:** the processional stair is 4.8 m wide, a flight up each terrace's front wall cut into the terrace above. Risers are 0.18 m and treads 0.32 m. Side stairs run along the walls at the wings' ends, alternating sides (`FLIGHTS`).
- **Beds:** curbed, with dry soil, a runnel along each terrace's back and a seized bronze sluice per bed (`BEDS`).
- **Collapse:** the right wing of T4 and T5 has slid into scree, with a fallen pylon (`COLLAPSE`).
- **Pylons and towers:** six lantern pylons at three landings; two watchtower stumps at T1's corners.
- **The facade** at v 110:
  - 72 m wide and 2.6 m thick, its top at +27;
  - the bluff raised behind it, climbing 0.12 m per metre and fading at its sides and back;
  - doors: the Great Door 4.4 × 4.5 m with its leaves jammed half open, two side arches, the watch-stair arch, and the gear-locked sealed waterworks door.
- **Rooms:** `ROOMS` are the halls, drawn in H4: the passage, the Long Hall, the sleeping gallery, the store and the scriptorium.

## The ground

- **The carving:** `plateauModel.ground` carves the hold into the land (`holdModel.carve`):
  - the built ground is level;
  - it eases back to the natural over `GROUND_FADE` outside;
  - the bluff is raised behind the facade's thickness.
- **Drawn vs walked:** on the hold, the drawn ground is the lowest level within one 2 m mesh cell (`drawnLevel`). Otherwise the land's triangles would ramp up out of the lower terrace in front of each wall; the masonry covers the difference. Her feet read `levelAt` itself: `plateauLand`'s `height` returns the hold's exact level on it, and `village.ts`'s ground world asks `holdSurfaces` first.
- **Walking:**
  - `walkable` lets her onto the built ground however far into the belt it climbs, and nowhere else past the old line.
  - `holdModel.occupy` makes a wall wherever the ground under a body's edge rises more than `STEP_TOL` over its feet. The facade and the `SOLIDS` (plinths, pylons, the hearth's plinth, the towers) are solid.
  - `cameraClear` keeps the third-person camera out of the walls and the bluff.
- **Clearing:** trees are cleared over the footprint (`holdClear`, passed to the chunks and to the look's understory). The hold's root is the first of the look's clearings, so no grass grows through its paving; `noTrees` keeps the village meadow woods from being planted there.

## The drawing

- **`holdWorld.ts`:** the masonry.
  - Walls are courses of blocks, each with its own tint, dark joints behind, moss low down, and copings with a bronze band under them, a few missing.
  - Flagstone paving is a canvas texture with moss and litter in the vertex colours.
  - The beds have curbs over dry cracked soil, with runnels and sluices.
  - Steps are solid blocks; the cheeks are coped, and the side stairs have parapets.
  - Pylons have a dark lamp housing and a bronze pyramid cap. Towers are broken rings, and the gate has its plinths and fallen lintel.
  - The facade has pilasters, a frieze band, a stepped cornice, stepped lintels and dark doorways.
  - Everything is merged per material: 5 draws.
- **`holdFurniture.ts`:**
  - the Ever-Hearth: a stepped plinth, a gear-rimmed bronze bowl, instanced gas-blue, orange and pale flame layers, sparks, two point lights, the gas line and its seized valve, and seven stone seats open toward the door;
  - the stone kit: bench, table, desk, block seat, bed shelf, bin, slab shelves, all chamfered blocks with vertex colours, merged into one mesh.
- **`hold.html` / `holdLab.ts`:** a lab page that judges both.

## Passes

- **H0** ✓ The wolves' eyes set into their faces.
- **H1** ✓ The ground: the carving, the walk, the walls, the camera, the clearing.
- **H2** ✓, first cut: the masonwork.
- **H3** ✓, first cut: the Ever-Hearth on the hearth terrace, its gas line running in at the Great Door.
- **H4** ✓, first cut: the halls opened.
  - **Rooms she walks into:** the passage through the Great Door, the Long Hall (24 × 16 m under a 7 m ceiling), the sleeping gallery with its way into the hall, and the store with its doorway. Also the scriptorium with its way, and the watch-stair room, whose three steps end in a rubble choke because the stair fell long ago.
  - **Walls and ceilings:** each room has walls of dressed courses facing in, open where another room joins it, a ceiling slab and a darker flagstone floor.
  - **The hall:** two rows of square pillars with bronze bands, ribs across the vault, and the Story Wall's six blank panels in bronze frames. The gas line runs in a floor channel from the Breath at its back wall out through the Great Door.
  - **Furniture:** a long stone table with benches, wall benches, nine bed niches with stone bed shelves, bins and slab shelves in the store, and four desks with block seats in the scriptorium.
  - **Walking:** `ROOMS`, `NICHES` and `roomAt` are in `holdModel.ts`. Inside a room `levelAt` is its floor. `occupy` keeps a body in the rooms and under their ceilings, and the facade and the rock elsewhere are solid. `cameraClear` lets the camera in only inside a room.
  - **The rock cap:** a heightfield cannot be both the halls' floor and the bluff's top. So the land is drawn under the floors across the facade's whole width (`HALLS_RECT`), and `holdWorld` draws the bluff's top over it as a rough rock cap at `capTop`, reaching `CAP_SKIRT` past it where the land climbs back. The cap also shades the halls.
- **H5:** the band moves in.
  - They walk the stair by waypoints, sleep in the niches, store the day's take in the bins and eat round the Ever-Hearth.
  - The cave's rock mouth gives way to the Lower Gate, and the old stone hearth is retired.
  - The hen grove's harvester cooks at the Ever-Hearth.
- **Later:** the irrigation quest; the engravings and paintings.

## Notes and open

- The band's figures are about half a metre tall (`HOBBIT_HEIGHT`). The stone furniture is sized for the builders, with seats at 0.45 m, so the hobbits clamber onto it. This is deliberate: the ruin was never theirs.
- Both groves were chosen again after the carving changed the ground by the cave. The hen's pair now stands in front of the apron, and the wolf's pair, with its spot, stands just right of it.
