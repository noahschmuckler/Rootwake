# The contagion: her growth as mycelium, and the land as a front

Noah, 2026-10-21, after the brink pass. His brief is recorded first as given, then the ideas already
waiting in both repos' design documents, then the proposal: what to build next and in what order.
Nothing below is built. MOTHER.md holds her nature and M1 as built; RUINS.md the wards; SETTLEMENTS.md
the building tree; COMPANIONS.md the seven; DESCENT.md the mountain.

## Noah's brief, in full (2026-10-21)

Given after the brink pass, as a design pass; recorded as given, organised below.

- **The land begs to be populated.** The vastness of the land, both on the plateau and the outside world, begs to be populated with adventure.
- **Remove the restriction on her.** With the mother of goats a visible force from the wellspire, remove the restriction: the dark patch should act like **mycelium seeking nourishment, avoiding irritants**. Its primary nourishment is villages. The mechanics are either already present or clearly hinted at: she farms the villagers for Dark Young, who spread the contagion. It could spread outward circumferentially, and/or villages or other places of power, once captured, could be new germination points. Even if she takes over the entire plateau, the mechanics are there to reverse it: defeat Dark Young, return the infants to the village, protect the village and make it thrive with plentiful food, advance their tech for defense and entertainment and organisation, become a bulwark against the darkness.
- **The ruins of former industry.** The wilderness is vast, and one of the great things about the Pine Barrens is the ruined remains of former industry. There are already a few ruins; add many more: some with clear lessons to teach, goals, quests, enemies to kill, power to unlock; some inscrutable and lost to time, present to be clambered over and wondered about.
- **The hook outward.** The villages are the hook for reaching the far corners, the other towers of the world, to recruit the other heroes and bring them here for their abilities, knowledge and synergies. Those lessons then apply to the wider world, the surface, even more vast and full of potential: cities, devices, economics, politics. Greater and subtler enemies: Nyarlathotep infesting the realpolitik; Cthulhu disturbing the dreams of the citizenry; Dagon's cult, corrupted citizens and deep ones preventing overseas commerce; elder things and their shoggoth servants with inscrutable motives; the King in Yellow inspiring the criminals and thieves gnawing at the roots of civilisation; and **Delvira**, Hulda's counterpart and daughter, growing in strength just as Hulda and her companions do, the final boss to be pacified by the might of a united world population.
- **The mountain's depth** remains to be plumbed: its connections to the surface plateau, its metroidvania styling requiring her to seek out abilities and companions, its weird inhabitants and their strange economy, the mother of goats infesting its corners and preventing access to whole regions.
- **Repeated passes** for optimisation, graphics and behaviour, depth of mechanics and gameplay loops, will benefit everything.
- **The far future**: the space-faring race this world is destined to birth, to set out and claim another mote of roiling chaos in the name of life and order.
- The environment now has full network access (the CC0 texture sites are reachable).

## What this supersedes

Two standing rules change by this brief, and are not silently dropped:

- **MOTHER.md, phase one: "she cannot be defeated, and does not grow."** The heart keeps both halves:
  the breach is fixed, the worm cannot be slain. What grows and shrinks now is her *growth*: the
  mycelium out of the breach, which M1 built as fixed rings. "She is held, not caged … not a realised
  risk on the game's timescale" (MOTHER.md, her form revised) becomes a risk the player can lose to and
  win back.
- **EXPANSION.md: "the dark loop is not the core loop; not every village should have a Shub nearby."**
  Kept in spirit: a village's peace is its distance from the front, and the front can be driven back
  to nothing. The first village is 300 m from the edge today; the other two are on the karst's safe
  side and stay quiet for weeks of play unless the front is let go.

Kept unchanged, because it is what makes the spread reversible: **no Dark Young without an infant
inside it** (VILLAGE_HANDOFF.md). Her growth is fed by what the snatchers bring. Starve the sacs and
the front starves.

## What is already waiting in the documents

### Rootwake

- **The mother.** M2: her arms into the clouds, the attention's attacks with warnings, lore in the
  ruined containment, freeing infants from the sacs. M3: waking the wards one by one and "what holding
  the land around her does". Later: the forges below ground, the containment reactivated, the finale.
  Open: what the aetherforges are; whether a miracle cleanses the blight (VILLAGERS.md, open since D4).
- **The wards and ruins.** R1 (five wards on the ring) and R2 (the first interior: the snerk, the
  greblin crew, the knot of her growth, the mirrors, the waking) are built. R3 (turned hollowed on the
  tops, traps with tells) and R4 (her worm in its shaft from the wards' deep galleries) are specced.
  The toolkit on record is DiggyDwarves' QUEST_MANUAL grammar: five situations (OCCUPIED, SEALED,
  HELD, LOST, STARVED) by four valves (FIGHT, FIX, TRADE, GROW); "force takes objects, never knowledge".
  A woken ward calms the Colour within 170 m (`WARD_CALM_R`) but the grey land is unchanged.
- **The villages.** Of the building tree only the hut, the warren and the drying rack are built. S5 the
  mason (stone house, granary, well, oven, mill, palisade then wall) and S6 the sage's karst and the
  worked research quest are sketched. "Chaos keeps pace" has only the dire pack built: the poisoned
  warren, the granary's counter, climbing raiders, the smokehouse's smell and road ambushes wait.
  W2 (the tree of miracles), W3 (the rival), V2/V3 (roles, relationships), V5/V6 (brutes, whispering
  and possession) are on paper.
- **The companions.** Order settled: steward, mason, sage, then the industrial trio. Recruitment as
  proposed: reach the karst by tier, pulse it with clarity, play their opening, link the nodes. The
  steward should wake on his own far mountain; the plateau has one karst now, so the other towers are
  beyond the brink. G5's top tier waits on companions.
- **The mountain.** D0/D1 built. D3 (the keepers' stations and what they ask), the metroidvania
  gating, the greeblin furnace city and the core are not. Her growth seals the deeper layers.
- **The land.** T6 built. Snow and forest on the outer peaks, cairns on the passes, fallen logs as
  parkour obstacles, creatures that still walk through rivers.

### DiggyDwarves (the sibling repo; nothing of it is Rootwake code)

- **Cosmology.** Chaos at the core; space-elves triangulate chaos into planets with aetherforges; seven
  dwarves wake once life crusts over; the eight Teeth at a cube's corners with the twelve edges as the
  subway; the Keystone the lock. Each recruit brings a combat mechanic, a traversal key and a civ domain
  (the Cultivator's vine ladders, the Mason's scaffolds, the Alchemist dissolving barriers, the Smith
  tunnelling, the Steward parleying past creatures, the Sage reading glyphs, the Artificer lighting
  magical dark). The Eighth, the Dark Dwarf, took everyone's chaos into himself; Nyarlathotep may
  incarnate as warlords, captains of industry, dragons or dwarves. The pantheon named there:
  Shub-Niggurath's corrupted woods, Cthulhu dreaming under the ocean, Elder Things in the polar ice.
  Dagon, the King in Yellow and Delvira are new with this brief.
- **The Underdelve.** The territory influence sim (per-region tallies, spread, decay, a garrison pull,
  kill pressure) is a proven pure model of exactly the push and pull this brief asks for on the
  plateau. Leaders and parley, pacts and tribute, cull/oust/reach quests, the gate-road. The factions:
  the Hollowed cultivating chaos crystal, the Greeblins' furnace cities, the Snerks as knowers and
  peacekeepers whose artifact trade is grid maintenance. The strange economy: artifacts degrade in the
  heat of cultivation, so demand never ends; slag curated into memberberries.
- **The Karst Spine.** Seven coloured layers feeding a white beam; one dwarf lights enough for
  transport, the full seal needs all seven; surface-crafted mirrors, prisms and filters bind the two
  economies. Optics phase 2: prism, combiner, dimmer, filter.
- **Phases.** Phase 2 humans (disputes, agriculture, science, balrogs); Phase 3 a 4X with the seven
  statues; Phase 4 an FTL-style space 4X; the liberation campaign at planet scale; karsts turned
  universities; the Nemesis stub ("do not build yet"); the Chronicle and the Diminishing.
- **Living world.** Schedules, typed dialogue with a flag store, encounters by a player-relative
  budget, situations generalised, relationship tracks and incident memory.

## The proposal: the front

The piece that makes the vastness mean something is the one Noah leads with. Nearly every mechanic it
needs exists; what is missing is the field that joins them. Build **the contagion** next.

### The model (pure, `contagionModel.ts`)

- **Germination points.** Her growth is a set of points, each with a reach: the breach (reach as M1's
  rings, so day one looks exactly as now), and later every captured place. The taint's depth at any
  point of the land is the deepest of them; `taintModel`'s rings become the shape of one point, scaled
  by its reach.
- **The veins are the hyphae.** The front advances along the root lines (the veins M1 already draws
  from hub to hub), not as a circle: each day every vein at the edge grows or withers by a step
  (`BLIGHT_STEP` was 30 m/day). Growth seeks nourishment and avoids irritants:
  - **Nourishment**, pulling a vein toward it: villages, weighted by folk and infants; a warren; a
    wallow; the stores eaten in a raid (`darkMealsToday`); and above all a Dark Young bred of an infant
    (`BLIGHT_PER_DY` returns, as the front's food).
  - **Irritants**, pushing it back within a radius: a woken ward (`WARD_CALM_R` becomes a true push, not
    only a calming of the Colour); a sanctified grove; a thriving village with a shrine; the karst's
    foot; later, a palisade, a road, fire.
  - **Starvation.** With no infant taken for `STARVE_DAYS`, the whole growth withers a step a day. Return
    every infant and slay every Dark Young, and it falls back to the breach's own rings.
- **Capture.** The front reaching a place changes what the place is:
  - a **village** is besieged (the state exists); its snatchers now come from the nearest point, not the
    lair alone (today only the first village is raided, `isHome`); overrun (folk below a threshold, or
    every infant gone and the stores fouled), its green becomes a nursery with sacs and it is a new
    germination point;
  - a **ward** is overgrown: the knot of her growth R2 built regrows and the ward sleeps; clearing it
    and waking the ward is the reversal, so R2's interior is already the capture and the uncapture;
  - a **grove** (a sanctified ruin) is fouled and its deep-root end closes; channelling clarity into the
    basin again re-sanctifies it;
  - a **warren** is poisoned (SETTLEMENTS.md's counter): its rabbits bite.
- **Reversal is the village loop as built**: defeat Dark Young, carry the infants home, feed the village
  to thriving, pray at the stone, hedge the run, wake the ward, sanctify the grove. The new tech
  (S5's palisade, watch post, granary) raises the threshold a village can hold at.

### The land (vista look)

- A **taint map** over the plateau, like the floor map (`uFloor`): one small texture of depth, rewritten
  at each dawn's step; the terrain, fog, sky and breath read it instead of a single centre. The trees:
  a chunk's kinds 9 and 10 are assigned from the map; chunks the front crossed since they were built
  are rebuilt (they are cached by seed today; key them by the front's day). Cost to measure: the front
  only moves at dawn, and only chunks it crossed rebuild.
- **The map and the compass** show the front and every point, and the keeper's rumor names its
  bearing ("the trees to the west have gone black" exists for the blight).
- From the summit the whole front is read at a glance: the "visible force from the wellspire".

### Passes

Each answers one question on the phone, in the order every study here has used.

- **C1, the front.** *Does a front that creeps along the roots toward the village, read from the summit
  and the map, make the land feel contested rather than decorated?* The model, the taint map, the daily
  step, nourishment and irritants with the breach as the only point, starvation. Starts as M1 looks.
- **C2, capture and germination.** *Does losing a village to her, and seeing the sacs on its green,
  make the other villages matter?* Raids and snatchers from any point; the village overrun; the ward
  overgrown and the grove fouled; the warren poisoned.
- **C3, the bulwark.** *Can the whole plateau be lost and won back with the mechanics as built, and does
  the winning read as the village's strength rather than hers?* The irritants made true pushes; the
  thriving village's radius; S5's first stone (palisade, watch post, granary) as thresholds; the
  reversal timed and tuned so a lost plateau is a long campaign, not a reload.
- **Alongside, in the creature session's hands (it owns ruins, wards and creatures): the industrial
  ruins.** The Pine Barrens' own: bog-iron furnaces and their slag heaps, a glassworks, charcoal pits,
  cranberry bog dikes and sluices, a paper mill's race, sand pits, a railbed, a drowned town, a cedar
  swamp's corduroy road. Each a place by the seed, a landmark on the map, clambered over by the parkour;
  some a situation from the QUEST_MANUAL grammar (a sealed furnace, a held mill, a lost town), some
  inscrutable; a few, as places of power, irritants or germination points for the front. The Leeds
  Devil is the Barrens' own creature, if a new one is wanted.
- **Quick win, any time:** the CC0 photo textures (ambientCG, Poly Haven) now that the network allows
  them; the drop-in path is `public/textures/barrens` (PLATEAU.md T4c).

### Later, in the order the docs already give

- **M2 and R3/R4** (the heart, the attacks, the worm): the front's deep end.
- **S5 and S6** (the mason, the sage): the bulwark's tech, and the first companion's worked quest.
- **The far towers**: the brink's passes lead down; the lowland under the cloud is where the other
  heroes' mountains stand (DD's eight Teeth, reinterpreted: one plateau is one tooth). A companion's
  recruitment is a journey off the plateau and back with him.
- **D3 and the metroidvania**: the mountain gated by abilities and companions; her growth sealing
  regions is the front's underground half.
- **Phase 2 and after**: the surface, cities, politics, the pantheon, Delvira; then space. Not planned
  in detail; held as the direction.

## Noah's calls for C2 (2026-10-22)

- C1 judged on the phone: "I love all of this." T7 (every place stands clear) and T8 (the stratum) judged with it.
- **Turned villagers are kept, not killed.**
- **A captured village** keeps its rounds: the hobbits walk their day and eat dark meals; the sacs hang on its green.
- **Wards and groves hold by definition**: they are irritants the hyphae avoid, so the front never reaches a
  woken ward or a sanctified grove; nothing of theirs is captured in C2. Whether an irritant can be overwhelmed
  (surrounded for days) is an open call, not built.
- **Un-turning** (clean meals, thriving, the irritants' pushes) is C3's.

## Noah's calls (2026-10-21)

- **Pace:** about twelve days from the breach's edge to the first village if she does nothing. Agreed.
- **What captures a village:** the front reaching it fouls its stores; their only meals are then the dark
  foodstuff; **three days eating only dark food turns the village.**
- **A turned village:** its villagers eat dark food, are unnaturally fertile (a raised birthrate), and do
  not resist their infants being taken. The Dark Young keep a ratio of themselves to villagers and let
  some infants grow up, so the population rises and the birthrate with it. They build no more houses;
  turned villagers sleep three to a bed without complaint.
- **The ward's calm:** read as the simpler of the two: from C1 a woken ward is an irritant the hyphae
  avoid and wither inside, not only a calming of the Colour.
- **The breach always keeps M1's rings.** New germination points can be starved out of existence; the
  original mother cannot, in this development phase.
- **The work:** the land session orchestrates agents for the contagion, pass by pass, each judged on the
  phone before the next. The industrial ruins catalogue stays offered to the creature session.

## C1, as built (2026-10-21)

The front, integrated: her growth creeps along the roots toward the villages, read everywhere the taint's rings
were. Starts as M1 looks; the model session's `contagionModel.ts` (its header holds the rules, the constants and the
API; `tests/contagion.test.ts`, 81 tests under `node scripts/test-village.mjs`) is now what the village plays.

- **State** (`village.ts`). A `Growth` under its own key, `rootwake-growth-v1`, loaded with `parseGrowth(raw, seed)`
  (junk is the breach alone) and saved with `serializeGrowth` inside `save()`, carrying beside the growth a `seen`
  record (`day`, `taken`, `bred`, `eaten`) of the home village's counters the dawn step's inputs are deltas of, so
  the deltas survive a reload. A fresh record begins on the day it arrives (`seen.day` today), not with every day
  the village has lived. The `GrowthIndex` (`indexGrowth`) is rebuilt only when the growth changes (`setGrowth`),
  never per frame.
- **The dawn step.** Once for every home-village day that passes (`dayOf(v.tick)` rising; several at once after a
  jump, the first carrying the deltas and the rest none), `stepGrowth(growth, seed, inputs)` with:
  - `nourish`: every village `{ x, z, w: folk × WEIGHTS.folk + infants × WEIGHTS.infant }` (1 and 3), each warren
    (the dens' and the villages' own) and each wallow at 1;
  - `irritants`: the woken ward (`wardQuest.stage === 'woken'` at `firstWard`, r `IRRITANT_R.ward` 170), every
    sanctified ruin (`overworld.sanctified`, r 120), the karst's foot (`KARST_AT`, r 140);
  - `infantsTaken` the rise in `v.taken`, `darkYoungBred` the rise in `v.bred.length`, `meals` the rise in `v.eaten`
    (the raids' cumulative count), all of the home village, since the last step.
- **Travel.** `grassOpen` and the root refusal ("the roots here are hers") read `inGrowth(idx, x, z)`; the chunks'
  blight (`chunks.setBlight`, the plain look's blackened trees) and the root network's closure read the blight or
  `inGrowth`, set in one `refreshLand()` that runs on the frame whenever the blight or the growth's serialized
  stamp changed (the `blightDrawn` pattern): `look.refreshTrees()`, `look.refreshGround()`, the chunks, the roots,
  the map if open.
- **The look** (`villageVista.ts`). `TaintLook` is field reads: `at` (the breach: the dead trees still lean toward
  it, her arms stand there), `ring`, `depth`, `vein` (`ringOf`/`depthOf`/`veinOf` of the live index), `veins` (the
  breach's root lines as M1 laid them, `taintVeins()`) and `hyphae()` (`hyphaSegments`). `groundTint` reads
  `ring`/`depth` (the mild streaks thin by depth over `MILD_TOP`, the grey's depth, so a hypha's mild band reads as
  the ring's outer third), keeps the breach's lines masked by `vein`, and draws every hypha's whole edge the same
  way: `vein` is 1 along the claimed length and fades past the tip, black inside the breach's edge and ashen
  outside it (`T_VEIN_IN`/`T_VEIN`). `villageTrees` greys (kind 9) by the same hash rules wherever `ring` is grey
  or mild, and within `VEIN_TREE_M` 8 m of a hypha's edge where `vein` is nonzero, by `vein`'s strength; kind 10
  only in the breach's heart and nursery; the barrens elsewhere unchanged. The understory still clears by distance
  from the breach (it grows along a hypha for now).
- **The depth she stands in.** `taintNow.depth = depthOf(idx, f.x, f.z) × (1 − wardCalm(f.x, f.z))`: the ward's
  calm stays a multiplier on the Colour, and the ward is an irritant in the model too (Noah's call).
- **The map and the rumor.** `drawMap` draws each germ's edge as a ring and each hypha's claimed length as a line in
  `FRONT_COLOUR` (`#9a6a98`, a dim grey-magenta), where the land is revealed or the lair known; the breach's blight
  circle is kept. The keeper's "the trees to the X have gone black" reads the front: `villageModel.setFront(f)` is
  the seam (a reader the entry sets to `nearestFront(idx, x, z)`; the model stays pure), and `rumors` speaks it for
  any village whose green has a claimed hub within `FRONT_TELL_M` 700 m, falling back to the home village's fixed
  blight when no front is set (the old tests hold).
- **Dev handle.** `__village.growth`: `state`, `idx`, `seen`, `inputs()`, `inGrowth(x, z)`, `depth(x, z)`,
  `nearest(x, z)`, `step(days = 1)` (the dawn step with the live nourishment and irritants and what the raids
  brought since the last, as the dawns do; C1.1: a fresh world's front seeks on nothing, the pace Noah set),
  `starve(days)` (a fed growth with nothing brought: it withers), `reset()` (the breach alone), `refresh(full)`
  (C1.1: everything when `full`), `parts` (the last refresh's milliseconds by part); each returns the refresh's
  milliseconds, also `refreshMs`.
- **CI** (`scripts/browser-village-vista.mjs`): `growth.step(12)`, then the front's nearest claimed hub is within
  60 m of the first village's green, ground open on day 0 is hers, the ground texture's bytes changed, no console
  errors.
- **The dawn hitch**, measured at Medium under SwiftShader (phone aspect, JS time on the build machine's CPU; a
  phone's would be longer): `growth.step(1)` 1.1–1.2 s a step, of which `refreshTrees` 405 ms, `refreshGround`
  333 ms, and the rest (~450 ms) `chunks.setBlight` rebuilding every loaded chunk (colliders and roots; the vista
  draws neither its ground nor its trees) and the root network's closure. At Low in CI, 1.3 s. That is past the
  ~300 ms a dawn should cost, as one hitch a village day; not optimised here. The path when it matters: rebuild
  only the chunks the front crossed since the last step (key a chunk's build by the growth stamp of the cells it
  touches), cache each tree's kind per chunk the same way so `refreshTrees` re-partitions only the changed ones,
  and build the ground tint on the cells a hypha's band covers instead of the whole 513² map.
- **Open, for Noah's playtest:**
  - the pace: `STEP` 45 m/day and `TIPS` 3 (twelve days to the first village fed every night);
  - starvation as the raids actually feed it: the step counts only infants the snatchers took that day (`v.taken`
    rising); C1.1 below settles when it begins (only once it has fed) and how it ends (withered to the breach alone,
    it seeks again);
  - `MAT` 24 and `VEIN_W` 8 (the grey round a claimed hub and along a hypha), `MILD_W` 20;
  - the colours: the hyphae's ashen grey on the ground (`T_VEIN`) and `FRONT_COLOUR` on the map;
  - whether the map should show the front only where revealed (as now) or wherever the keeper has spoken of it;
  - the understory along a hypha, and the plain look (only the fixed blight, now `inGrowth` for the chunk trees).

**C1.1 (2026-10-22): the cycle, and the dawn hitch.** Two follow-ups to C1.

- **Seek, feed, starve** (`contagionModel.ts`, its header). As built, `starved` counted every day with no infant
  taken, so a fresh world's front withered on day 3 before the village had an infant to snatch, and Noah's "about
  twelve days to the first village if she does nothing" held only if an infant was taken nightly. Noah's rules,
  reconciled: the breach can never be starved; lesser germs can; twelve days if she does nothing. So the growth
  **seeks until it has fed**: `Growth.fed` (serialized; parsed tolerant, default false, and a save from before it
  loads unfed with its `starved` dropped) turns true when an infant is taken or a Dark Young bred; while it is false
  the front never withers for starvation and `starved` stays 0 (withering into an irritant is unchanged); once fed,
  `STARVE_DAYS` 3 without an infant withers the tips as before; and when the growth has withered back to the breach
  alone (no hypha left, every lesser germ gone) `fed` resets and it seeks again. So the mycelium always comes back
  seeking; a permanent hold needs irritants (C3's bulwark). The one call made here: a lesser germ caught mid-shrink
  keeps the starvation going until it is gone (it starves out of existence, as Noah asked, and the growth seeks
  again only then); a germ's death never resets `fed` by itself. The pace test now runs with no infant taken on any
  day (reached on day 12 at seed 1, and fed nightly the same day: feeding does not hurry it, food does); a fed front
  starved withers, withered to nothing it seeks again on the next dawn unstarvable, `fed` round-trips. `__village.
  growth.step(days)` passes the real deltas (so CI's `step(12)` is a fresh world seeking: the front within 60 m of
  the first village's green), `starve(days)` forces `fed` and zero intake.
- **The dawn hitch** (`village.ts` `refreshLand`, `villageVista.ts`, `chunkWorld.ts`, `rootNetworkWorld.ts`,
  `vistaWorld.ts`), measured as before at Medium under SwiftShader on the build machine's CPU, she standing in the
  home village: **before**, `growth.step(1)` from day 0 took 1.34 s, twelve days at once 1.16 s, a later single dawn
  1.28–1.34 s (C1's breakdown: trees 405 ms, ground 333 ms, the chunks' rebuild and the roots the rest). **After**,
  day 0 → 1 98 ms (trees 18, ground 79), twelve days at once 69 ms (84 tiles and 84 tree chunks drawn again, 15
  chunks recoloured, 3 root chunks), a later single dawn 29–36 ms (25 tiles, 25 tree chunks, 0–4 chunks); a full
  draw (`refresh(true)`) 610 ms; the tree partition that follows on the next frame 9–33 ms (the same work as every
  12 m she walks). The principle: every read of the field at a point depends only on the germs whose influence
  reaches it and on the index cell it falls in, so `fieldStamp(idx, x0, z0, x1, z1)` names everything the reads over
  a rectangle can depend on (the germs within reach + `TAINT.veins`, each cell's mats and its hyphae with their t, in
  the index's order), and a test pins that where a rectangle's stamp is unchanged by a step, every read in it is
  unchanged. On that:
  - the look's trees (`villageTrees`) keep each chunk's trees as drawn under the stamp over its square (`TreeCache`)
    and recompute only the chunks whose stamp moved; the breach's fixed vein lines keep their hash across dawns;
    `vistaWorld.setTrees` keeps a kind's five instance buffers while its trees fit them (allotted with 25 % + 64
    headroom), so a day's greying moves no buffer and only the partition re-uploads the instances in use;
  - the ground tint (`groundTint` with a `GroundCache`) draws again only the 64 m tiles whose stamp moved, each with a
    cell's margin, replaying in order every vein-line point whose splat reaches a redrawn cell (the last line to
    reach a cell colours it, so the order is part of the stamp), straight into the texture's own bytes
    (`world.groundBytes`; one `needsUpdate` for the whole texture, which is cheap);
  - the chunks (`chunks.setBlight(f, stamp, full)`) keep every chunk whose stamp (the blight's reach and the field
    over its square, inclusive of its far edges where its ground vertices lie) is what it was built under; a chunk
    that moved is recoloured in place under the vista look (the tile's biome colours are kept beside its geometry,
    and nothing else it builds reads the blight), or rebuilt with its tile kept under the chunks' own look;
  - the roots (`rootNetworkWorld.update`) redraw a chunk's mesh only when the ids of the roots it shows changed
    (`network.setBlocked` was never the cost: the closure is read per root; the reset-and-rebuild of every tube was).
  `refreshLand(full)` with `full` clears every cache and draws everything (dev: `__village.growth.refresh(true)`);
  CI (`scripts/browser-village-vista.mjs`) steps twelve days incrementally, digests the ground bytes, the tree list,
  the chunks' ground colours and the root meshes, draws everything again, and requires the two digests equal (and
  the incremental draw to have drawn less). The first refresh at boot and a dawn after a long jump still draw what
  moved, no more.

## C2, as built (2026-10-22)

Capture and germination, under Noah's calls above: the front reaching a village fouls its stores, three days on her leavings
turns it, a turned village is kept and keeps its rounds, its green a new germination point that can be starved out; wards and
groves are irritants the front never reaches, so nothing of theirs is built. The model is `villageModel.ts` (its C2 comment
block holds the rules and the constants), read by the entry (`village.ts`) at each dawn's step; `tests/village.test.ts` and
`tests/contagion.test.ts` (89 tests under `node scripts/test-village.mjs`, 7 new).

- **Held.** After each dawn's step (`holdStep`, after `dawnStep`) a village is `held` while the front's nearest claimed hub
  (`nearestFront`) stands within `HELD_M` 60 m of its green (the green's own hub stands 46 m off at seed 1, and a mat's mild
  band reaches 44 m, so `inGrowth` at the green itself was too brittle a test; 60 is the CI's "within 60 m" of C1).
  `setHeld(v, true)` fouls the village at once and tells it the first time ("Her growth holds the village: the stores are
  fouled, only her leavings are left"); the model's own dawn fouls it again while held. The fouling (`foul`): every yielding
  place spoiled through the day with its stock gone, the food stores emptied (Noah: "fouls its stores"; else the bin's grain
  fed them clean meals for days), the heap of her leavings at its cap and heaped again from the roots whenever it runs out
  (the cap is 12 and eight villagers eat 24 meals a day: a heap filled only at dawn would have starved them by supper). So
  nothing but dark is on the table and nobody starves; the heap cannot be banished while held (`purifiable('dark')`), but
  Hulda's purify still lifts a spoiled place for the day (the C3 lever), and a clean meal from anywhere (her stack, the
  hunters' meat from a warren the growth has not reached) keeps the count from running (below). Let go, the fouling lapses at
  the dawn after (the model's dawn had already fouled it) and the heap is not heaped again.
- **Turned.** `eat` counts the day's meals by kind (`darkMealsToday`, `cleanMealsToday`). At dawn, `darkDays` rises by one
  when the village was held and every meal it ate that day was dark, else goes to 0; at `TURN_DAYS` 3, `turned` (the banner
  "The village is hers", the state kind `turned`, its text the same), and the entry adds the germ. The count starts over on
  any clean meal and never runs unheld: an unheld village never turns. A village held at noon counts from the next full day,
  so the CI's four village days from the twelfth dawn turn it.
- **The turned village** (kept, not killed; its rounds unchanged: the gatherers walk to their spoiled places and gather
  nothing, as before a spoiled place): births at `TURNED_BIRTH_DAYS` 1.5 (D2's leavings already count a dark day as three
  well-fed days, so a turned village on her leavings bears every dawn there is room, and the halving only shows on clean
  meals); room `ROOM_PER_HOUSE × TURNED_ROOM` 12 a house (`roomPerHouse`), never crowded, no stakes set and none asked of the
  stone, nobody moves out; its own snatchers come from its green ("is given to her in the night"; no bleating, the door
  opened at once, no mourning, the parents told "<name> is hers"), and only while its Dark Young (`darkYoungOf`: bred and
  gestating) are fewer than floor(folk / `DY_RATIO` 3), else its infants grow up; it is not raided by its own. The keeper's
  "we eat her leavings, and want for nothing"; communed with, "We are hers now, and want for nothing".
- **The germ.** `germ:<village id>`, kind `village`, at the green, reach `GERM_REACH.village` 110 (`contagionModel`), its hubs
  claimed at once (`addGerm`); added once (`v.germ` remembers it): a germ starved out of existence by the model's rule
  (`STARVE_DAYS` without an infant taken, its reach shrinking `STEP` a day) is not added again, and the village stays turned
  (C3 un-turns); its fouling lapses once the front no longer holds it. A village begun again (the dev reset) loses its germ
  (`removeGerms`, new: a lesser germ taken away with the closure rebuilt; the breach never).
- **The source.** Every village's raid and snatchers come from its germ source (`germSource`, `sourcePoint`): the nearest
  village germ within `RAID_REACH` 600 m, or the breach, which the first village keeps at any distance (as before: the
  breach lies 950 m off); a village with no germ in reach has no raids and no snatchers (the other two, until a germ stands
  within 600 m of them). The Dark Young stay bred of each village's own infants (a raider is its village's); beaten, they
  run for the source. The entry tells the model the growth's germs at each `setGrowth` (`setGerms`), and sums `infantsTaken`,
  `darkYoungBred` and `meals` over every village for the dawn step.
- **The grove.** A village's kept infants hang at its source's grove (`broodSpotOf`): on the breach's rim as M1 placed them
  (`broodSpotAt`, the first village unchanged), or at a turned village's grove: the green's edge in the stone's gap,
  `GROVE_R` 6.8 m from the fire, rows of three out along the gap (`groveSpot`), slots interleaved by folk so two villages'
  sacs at one grove never overlap; `carryInfant` takes one back there as at the breach. The sacs are `villageWorld.setSacs`
  in each village's own scene (its `foes` group is never hidden by distance), so a neighbour's infants hang in the turned
  village's green. By day the Dark Young bred of a village whose source is a turned village stand in that gap past the
  grove (`keeperSpot`, "dark young · keeping"): shown, not fought (they are not raiders of the village: C3 makes them
  something to fight); by night they are not shown.
- **The warren.** At each dawn's step a warren the growth reaches (`inGrowth` of the growth with its warren germs taken out,
  so a warren's own germ does not hold it) gets a germ `germ:<warren id>` of reach `GERM_REACH.warren` 40 (poisoned:
  `setPoisonedWarrens`, `isPoisoned`), removed when the growth withdraws (healed) or starved out by the model's rule.
  Hunting it yields no meat and the first hunter at it each day comes home bitten by its rabbits (meals off their strength as
  a wolf's bite, never to death; an incident at the burrows and a banner); the others, while that bite is still told, are
  sent home with nothing.
- **Rumor and map.** The keeper of an unturned village within `FRONT_TELL_M` of a turned one: "<the ford> is hers now" /
  "the first village is hers now", with its bearing (`setTurned`, the entry's reader). The map and the compass mark a turned
  village in `FRONT_COLOUR`.
- **Saves.** `held`, `darkDays`, `turned`, `cleanMealsToday`, `germ` in the village's save, parsed tolerantly (an old save
  loads unheld and unturned); the growth's record already carries the germs.
- **Dev.** `__village.c2`: `hold(id)` / `release(id)` (fouled at once; the next dawn sets it from the front again),
  `turn(id)` (turned now, its germ added), `days(n)` (the villages lived n days with the growth stepping at each dawn),
  `state(id)` (held, darkDays, turned, germ, folk, infants, brood, bred, the day's meals by kind, the source, the sacs).
  `villages()` carries `held` and `turned`.
- **CI** (`scripts/browser-village-vista.mjs`), after the C1 block: held at the twelfth dawn and not turned; `c2.days(4)` and
  the first village is turned with a germ at its green and the others not; that night its own snatcher takes an infant to
  the grove (the brood rises within a minute of real time) and the sac is drawn in the scene (`sac` groups, visible), on the
  green; a screenshot `turned-green.png`; no console errors.
- **Decisions beyond the rules, flagged:**
  - the food stores are fouled too, not only the land (else days of clean meals from the bin);
  - the heap refills whenever it runs out while held, and cannot be banished while held;
  - a clean meal of any kind (the hunters' meat from an unpoisoned warren, what she brings) starts the three days over: the
    steward's hunters are a real defence against turning, and a reason the warrens are poisoned;
  - the ratio counts the gestating with the bred;
  - cross-village raiding (a turned village's Dark Young going out to raid a neighbour) is not built: the neighbour's raids
    are its own bred Dark Young from the turned village's germ, as the first village's are from the breach; the turned
    village's own bred are keepers, shown and not fought;
  - the newcomer pool (16 a village) bounds a turned village at 24: a birthrate that rises with the folk waits on a larger
    pool;
  - the first bite only is told each day at a poisoned warren.
- **Seams left for C3:** `turned` can be cleared and `held` lapses with the front; `foul` and `setHeld` are plain functions;
  the keepers are a display and have no model of their own; `removeGerms` takes any lesser germ away.
- **Open, for Noah's playtest:** `DY_RATIO` 3 (one Dark Young to three villagers), `GERM_REACH.village` 110 (its nursery ring
  then covers the green to 36 m: the copse's trees become her growths, the houses stand, the wood beyond greys to 88 m) and
  `.warren` 40, `RAID_REACH` 600 (the other villages stand 650–1400 m from the first, so a turned first village reaches a
  neighbour only when it stands within 600 m: at seed 1 the pines stand 741 m and the ford 933 m from the first village,
  606 m from each other, so as set a turned village's snatchers reach no neighbour and the front itself must creep to it:
  800 would put the pines in the first village's reach), `TURN_DAYS` 3, `HELD_M` 60, `GROVE_R` 6.8 and the grove in the
  stone's gap, `TURNED_BIRTH_DAYS`; that a turned village's own warren (60 m off) lies in its germ's reach and is poisoned
  with it (its hunters bitten: as the rule says, and a fair price); the Colour at the captured green: the germ's depth at
  the green is 0.95 (`germDepth`, 1 at the germ), so she stands there under the Colour as at the breach's nursery, the grade
  torn red and blue on the out-breath, the ground pale yellow under it and the fog closing to about 60 m (the T8 check in
  CI now allows it); the captured green on the phone (390×844, SwiftShader, `/tmp/.../scratchpad/shots-c2/`): from above
  (`over-after.png`) the whole green and its paths under the magenta haze, the ground black-violet, the six houses and the
  stores standing as they were, the hobbits on their rounds, "Dill, in a sac" at the stone's gap; at eye level
  (`green-after.png`, `sacs.png`) a black vessel arching over the pink sac at the green's edge with the villagers talking by
  the fire beyond, the Colour's wash over everything; a day on (`keepers.png`) "dark young · keeping" standing in the
  stone's gap as Nell walks past it to the fire; the map (`map-after.png`) the germ's 110 m ring round the village and the
  warren's small one, the hyphae into it from the south-east. Whether that is too much Colour for a village she must walk
  into to take infants back (the breach's nursery was a delve; this is a home) is the first thing to judge.
