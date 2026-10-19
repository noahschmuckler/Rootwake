# The Descent: the village atop the mountain (design record)

Noah, 2026-10-18.

## The idea

The vista and village land is a starter and tutorial area: walled in by mountains at its edges, and itself standing on top of a massive mountain structure, the karst of DiggyDwarves.

The deepening already lowers the crystal drop. Eventually it brings the drop low enough that she can walk out of it onto the top layer of the magitech mountain. That layer is an underworld of puzzles, platforming and inner civilisations: a metroidvania. As she gains skills in the outer world, including companions from the other corners of the globe with abilities of their own, she unlocks regions, lore and abilities inside.

**Noah's addition: the catwalks.**
- She can step out of the drop straight away, from the first visit.
- The first area is just a circular catwalk with magitech walls and alcoves.
- Each deepening is its own slightly larger space she can step out into.
- This lets us explore the look of the magitech underworld without building whole layers of dungeon.
- Each catwalk has at least one information station, where snerks, hollowed or greeblins help maintain or interact with the death-star-like mountain city.

## What DiggyDwarves' lore gives it

The lore is in DiggyDwarves `GAME_DESIGN.md` lines 187–1112, `DESIGN_ADDENDUM_2026-07-09.md`, `UNDERDELVE_MAP_SPEC.md`, and the cutaway painting `art-src/karst-cutaway-northstar.png`.

**The mountain is a karst.** It is "ancient magitech with circuitry built microscopically into the rock". It soaks up chaos and crystallises it out. The dwarves built it, and it powers the subway that cages the Chaos at the planet's core.

**Its layers, top to bottom**, as written and as painted:
1. **The summit:** a farm-top with a ringed pool and a light beam rising from it. This is Rootwake's karst summit, with its crystal pool and the stream falling into it.
2. **The Cap:** "dense, self-healing stone under constantly growing grass — impassable both ways (a seal between surface and delve)". **The crystal drop is how she passes it:** the deep roots are the only way through the seal.
3. **The seven placid layers.**
   - Ring and X-shaped walkways round a central shaft, studded with blue crystal.
   - Each layer's floor plan is a sigil. Going down they spell **R‑E‑V‑I‑L‑E‑D**; going up, **DELIVER**: "Deliver these people, or be reviled."
   - Each layer is one band of the rainbow, ROYGBIV.
   - The beam in the central shaft grows richer as it descends.
   - **These are our catwalks.**
4. **The Greeblins' furnace city**, orange-lit, with smokestacks.
5. **The core:** purple crystal, brass pipes and the Hollowed.
6. **The sealed vault and the subway emitter.**
7. **The Chaos,** a violet void beneath the roots.

**The peoples are the maintenance shift, "ten millennia after the last work order".**
- **Snerks** are "the knowers — surveyors and archivists". They were the mobile engineers, the jefferies-tube crews, and are now peacekeepers with "fragmented, corrupted millennia-old memories". Look: hunched, purple hooded cloak, long pink beak-nose, green face, a huge pack with a hanging lantern.
- **Hollowed** were the power workers. They grow chaos crystal and calcify. Look: tall, gaunt, hooded and robed, a beaked mask, glowing red-orange eyes, grey clawed hands. They tend the power nodes.
- **Greeblins** were the machinery workers. They run dwarf-made furnaces they could never build. Look: green goblins with big ears and tusks. Rootwake's underworld already has its own greblins.

**The visual canon:**
- brass and iron pipes;
- "limescale on pipes";
- blue crystal in the upper layers;
- techno-runes that light when power passes;
- an alphabet after the Standard Galactic Alphabet;
- power stations that hum, brown out, calcify or die.

## The plan (agreed 2026-10-18)

1. **D0, the look study:** the first catwalk on its own page (`/vista/descent/`).
   - the drop hanging in the beam shaft, with a gangway to a ring catwalk along the wall;
   - magitech walls, alcoves, pipes crusted with limescale, runes in the layer's colour;
   - one information station kept by a snerk;
   - the six deeper catwalks to preview, each a little larger and more built out.
2. **D1, stepping out:** at the node, a new "step out" choice puts her on the catwalk at the node's depth. The drop takes her back.
3. **D2, the summit edge:** the land's mountain rim gets gaps where the plateau falls away to a sea of cloud and the mountain's flanks far below.
4. **D3, the stations:** what the keepers say, and what she can do there, such as a browned-out node kept running with the board.

Later: the metroidvania gating (her surface progress opens regions below), the industrial city and the core.

Open questions:
- the band colours against the cel look;
- the snerk's size beside her;
- whether the stair (the painting's spiral) is hers to climb.

## D0 as built (2026-10-18): the look study, `/vista/descent/`

- **`src/descentModel.ts`** (pure, tested in `tests/descent.test.ts`):
  - `catwalk(depth)` gives each layer's letter and band, the wall's radius (growing `WALL_GROW` per layer), the ring walkway along the wall, the alcoves (8 + 2 per layer), the gangway from the drop, spokes in an X and an inner ring from the second layer on, and the stations.
  - Stations: a snerk's archive across from the gangway on every layer; a hollowed's power node from the second; a greeblin's machine from the fourth.
  - `walkable` defines where she can stand. `stepOut` and `stationSpot` place her. `KEEPER_LINES` holds the keepers' first words.
- **`src/descentWorld.ts`** builds a catwalk as a scene, cel-shaded with Hulda's toon ramp:
  - plated walls ribbed in iron and brass;
  - brass pipes crusted with limescale;
  - a band of SGA-like runes in the layer's colour;
  - alcoves with blue crystal sconces;
  - the layer's letter as a sigil over the archive;
  - the beam with rising motes, and the crystal drop in it (a rim-lit sphere with slow caustics);
  - the shaft above and below, with the next layer's glow far down;
  - the keepers, built from primitives after DiggyDwarves' sprites:
    - the snerk: purple hooded cloak, pink beak-nose, green face, a pack with a swinging lantern;
    - the hollowed: tall, robed, a bone beak mask, ember eyes;
    - the greeblin: green, ears, tusks, mohawk, a wrench.
  - Each keeper turns its head to her when she is near.
  - The stations: an archive lectern with scrolling glyphs and scroll racks; a caged chaos-crystal node that pulses; a turning gear and a furnace mouth.
  - Static meshes are merged one per material, about 80 draw calls.
- **`src/descent.ts`** is the page:
  - Hulda on the shared player and mobility, walking the catwalk (`walkable` is the traversal world). The camera is kept inside the chamber and out of the beam and the drop.
  - "listen to the snerk" (and the others) opens a speech bubble. "into the drop" stands for D1.
  - ▲ ▼ visit the seven layers. Options: `?depth=0..6`, `?hud=1`, `?intro=0`.
- **Checks:** `scripts/browser-descent.mjs` (CI) checks that she stands on the catwalk, that it stays within the draw-call budget, that the snerk speaks, and that every layer builds with its keepers. Screenshots go to `artifacts/descent/`.

## D1 as built (2026-10-19): stepping out from the village's node

- At the deep node, a **"step out onto the catwalk"** button sits above the root button.
  - It builds the catwalk of the node's depth (`deep.depth`, clamped to the seven layers) where the node is, so the drop she was inside hangs in the beam at the centre.
  - She stands at the gangway's ring end, turned back to the drop.
- **`src/descentVisit.ts`** holds the visit:
  - the traversal world (`walkable` in the chamber's frame, the floor 0.95 m under the drop's centre);
  - the camera kept inside the chamber;
  - the act button and the keepers' bubble, the same lines as the study page.
- **`village.ts`** gives it a mode, `catwalk`:
  - she walks on the shared player, while the land above (chunks, the root network, the overhead camera) rests;
  - the chamber is dark (`CATWALK_FOG`), the sun out, and the vista look is told it is an interior;
  - the fight, the stations and the miracles stay off, since they ask for `ground`.
- **"into the drop"** at the gangway's foot takes her back into the node: the catwalk is disposed and the lights on the drop return.
- Dev: `__village.deep.stepOut()`, `.backIn()`, `.visit`.
- **Checks:** `scripts/browser-village-vista.mjs` dives to the node, steps out, checks that she stands on layer R's floor under the drop, hears the snerk, and goes back into the drop and up to the pool. The screenshots are `catwalk-out.png` and `catwalk-snerk.png`.
- **Open:** deepening is the only way deeper; there is no stair between catwalks yet. The summit rim is D2, and what the keepers ask of her is D3.
