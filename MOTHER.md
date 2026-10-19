# The Mother of Goats: a breach, not a boss

Noah, 2026-10-19. These are his musings, recorded as given and then organised, with what can be built now at the end. The Dark Young and the black wolves are in DARK_YOUNG.md. The containment lore this touches is in COMPANIONS.md §1.3 (the white beam, "full containment needs all seven") and DESCENT.md (the beam shaft).

## What she is

- **The cosmology.** The centre of this planet is furious, roiling chaos-stuff. The crust contains it, and where it leaks through, chaos creatures result. In densely wooded land, a leak can manifest as a **mother of goats**. Shub is not one local monster. She is what a breach becomes in a forest.
- **How planets like this one are made.** They are made by synchronising massive magitech constructions called **aetherforges**, which connect with beams of pure order and section off a portion of chaos-stuff. This is the same order whose white beam and containment channels the karsts and the dwarves already serve (COMPANIONS.md: "light → white beam → subway → containment").
- **Her centre.** At the heart of the forest she reaches up into the clouds, and is very dangerous. She has likely grown up through an **ancient magitech construction** built to contain this breach, now hopelessly clogged with chaos entities. Exploring it may reveal the lore needed to build rudimentary aetherforges, and late-game work can reactivate the containment.

## She is not defeated with punches

- **Phase one.** In the first phase she cannot be defeated, and certainly not solo: she is forest-sized. In this phase she also **does not grow**. What must be evident is how massive she is.
- **How she falls.** She is defeated by strengthening the natural world and augmenting it. That could be powerful druids, magitech, the combined prayer of several cities of monks, or "something amazing we haven't defined yet".
- **The likely handle.** She is controlled by constructing **miniature aetherforges** geographically around the tainted forest, and probably below ground as well, in the extended underworld still to be made.
- **Open:** what the aetherforges are made of, who builds them, whether each one is a karst-like site, a village construction or a companion's work, and how the final reactivation of the old containment plays.

## The land: a gradient into insanity

A significant radius of tainted land, graded from mild at the edge to an inner area of pure insanity. The radii are tuning, to be set against the village distances.

1. **Mildly tainted (the outer ring).** The colour first shows here, faintly. A few natural trees stand grey and brittle and twitch. The grass thins in streaks.
2. **The grey (the dying ring).** The natural trees are grey and brittle, and they **twitch and reach**, as in *The Colour Out of Space*. The ground is stained grey and the soil poisoned. The grass is dead.
3. **The alveolar ring (the nursery).** The trees are gone, replaced by black alien structures: branching like tentacles, like blood vessels, like alveoli. Here hang the **birth sacs**: cystic tumours hanging from the structures, each with a stolen infant inside. The snatchers bring infants here, not to the centre.
4. **The heart (pure insanity).** She reaches up into the clouds through the ruin of the ancient containment.

## The roots: she infests the travel lines

- **Inside the taint, neither the grass nor root travel works.** This was intended from the start and has not been built yet.
- **Her infection runs along the root lines.** Where it reaches a natural tree, the tree stiffens, greys and becomes brittle. Above a root line the ground stains grey: the grass dies and the soil is poisoned. So the taint's own pattern on the land traces the root network, with grey veins running out of the forest along the roots.

## The Colour

- **The palette.** Purple and black dominate. Over them is the colour itself: something like magenta, but with its red and blue channels shifting so that it is hard to pinpoint. It phases into clashing contrasts of yellow, orange and green.
- **The breath.** The colour has a rhythm, like breathing:
  - **Breathing in:** a tolerable magenta.
  - **Breathing out:** the colour fractures into offensively separate red and blue images laid over each other, with the clashing colours flashing through.
- **Her awareness.** When she is settled the effect is subtle. The more aware she is of Hulda (noticing her, then actively fighting her), the more intense the clashing and flashing.
- **The drain goes.** The forest's passive vigor drain is removed (Noah, 2026-10-19). Her awareness is a meter, **attention**, that rises with depth, time and violence and falls when Hulda leaves. In phase one it drives the colour. Later it drives what the forest does to her, always with a warning before it acts (the earlier proposal: mouths opening in the ground, roots bursting up, the way closing behind her, the brood born).

## Passes (proposed)

- **M1, the taint (buildable now).**
  - Drain removed, attention added, the colour's breath.
  - The gradient of land and trees, the grey veins along the roots, travel refused inside the taint.
  - The birth sacs moved out to the alveolar ring.
  - The taint fixed in size.
- **M2, the heart.**
  - Her form reaching into the clouds, and the ruined containment she has grown through.
  - The attention's attacks, each with its warning, and the brood.
  - Lore to be found in the ruin.
  - Freeing infants from the sacs.
- **M3, the aetherforges.**
  - Their lore, the first miniature forge, and what holding the land around her does.
  - Waits for Noah to define what builds them.
- **Later.** The forges below ground in the extended underworld; reactivating the old containment; the finale.

## Consequences to decide in M1 (current rules this changes)

These rules exist today and conflict with "she cannot be defeated and does not grow".

- **The lair.** The lair can be slain (`LAIR_HP` 300). Slaying it pauses the raids for `LAIR_PEACE_DAYS`, frees the brood and gives `XP_LAIR`.
  - **Proposed:** the manifestation can't be slain in phase one. A blow at the heart only turns her attention.
- **The blight.** It grows with every Dark Young bred (`BLIGHT_PER_DY`), up to `BLIGHT_MAX`.
  - **Proposed:** the taint replaces the blight at a fixed size.
  - The village's "the blight near" need then reads off a fixed distance.
- **The brood.** It sits 3.2 m from the centre (`BROOD_RING`).
  - **Proposed:** the brood moves to the alveolar ring.
  - With the mother unkillable, how infants come free (sacs cut open by Hulda, at a risk) becomes M2's question. Until then they can still come home only as melted Dark Young, as now.

## M1, as built (2026-10-19)

- **Model.**
  - `taintModel.ts` (pure) holds the rings (`TAINT`: heart 40 m, nursery 85, grey 135, edge 190, veins 70 m past the edge), `depthAt`, `inTaint`, `veinAt`, attention (`stepAttention`, `provoke`, `ATTENTION`) and the breath (`stepBreath`, `exhaleAt`, `BREATH_S` 7 s settled, 3 s roused; `colourAt`).
  - In `villageModel.ts`:
    - The forest drain is gone. `lair.attention` rises with depth while Hulda is in the taint, and falls when she leaves.
    - Her blows inside the taint provoke it; a blow on the mother provokes it most.
    - The mother cannot be slain (`UNKILLABLE`). The old death is kept behind it for tests and for when she can be bound.
    - The blight is fixed at the grey ring's edge from the first, unannounced.
    - The brood hangs in the sac grove: `BROOD_RING`, the nursery's rim toward the first village. The snatchers bring infants there (`groveAt`), and Hulda can still take one back by walking to it.
- **Travel.**
  - Inside the edge the grass will not take her: "the soil here is poisoned". Grass travel stops at the edge.
  - Inside the edge the roots are closed: `network.setBlocked` with the blight or the taint, "the roots here are hers".
- **The land.** Vista look only (`villageVista.ts`, `vistaWorld.ts`, `vistaShaders.ts`).
  - Tree kind 9 is the grey dead tree: bare limbs and crooked twigs that twitch (`TWITCH`: still, a sudden jerk that relaxes slowly, a slow lean).
  - Kind 10 is the nursery's growth: a black bronchial tree of vessels ending in alveoli, breathing (`PULSE`).
  - Which tree is which:
    - in the heart and the nursery, all kind 10;
    - in the grey ring, all kind 9;
    - in the mild ring, more kind 9 the deeper in;
    - past the edge, kind 9 wherever a vein passes within 8 m.
  - The ground: black at the heart and in the nursery, the dead grey of poisoned soil, grey streaks through the mild ring.
  - The veins:
    - drawn along the chunks' main root lines, hub to hub, not a tree's own short root;
    - black inside the taint, ashen outside it, fading 70 m past the edge.
- **The Colour.** The grade's last pass (`COLOUR_GRADE`, `COLOUR`). Its strength is `colourAt(depth, attention)`, and its phase is how far into the out-breath she is.
  - **In-breath:** a magenta whose red and blue sway.
  - **Out-breath:** red and blue torn apart, and small tiles flicking to clashing yellow, orange and green.
  - The gloom, the fog and the sky breathe with it (magenta drawn in on the in-breath), and darken more toward the heart.
- **The sacs** (`villageWorld.setSacs`): a cyst hangs from a black vessel arching over, translucent pink with the infant inside, swaying and swelling. Each is labelled "<name>, in a sac".
- **The heart, until M2:** her arms rise from a low mound: fourteen black tentacles 20–50 m tall, writhing slowly into the fog, with her eyes in the mound. Her label carries no bar, since she cannot be hurt.
- **Cost:** inside the taint the land draws about 500k triangles at low quality, against about 600k at the village.
- **Dev handle:** `__village.taint`, with `breach`, `now` (depth, colour, exhale, flare, attention, breath, the lift), `attention =`, `keep(n)` (hang n newcomers in the sacs), `veins()`, `lift()` and `flareNext()`.
- **Open, for Noah's playtest:**
  - the radii;
  - how fast attention rises and falls;
  - the breath's period;
  - the Colour's strengths (`COLOUR`);
  - whether the mild ring's grey trees should be fewer;
  - whether the plain (non-vista) look needs the taint too (it keeps only the fixed blight).

## M1.1, after Noah's first look (2026-10-19)

Noah: "lose the tiles". Her clashing colours now come two ways, and "the randomness is what sells it":

- **Around a tree** (`stepTaintFx` in `village.ts`; the grade's `uSpot`): now and then, at random, one tree in view flares. The red/blue split goes far past the rest about it, flooded with yellow, orange or green for about a second.
  - Rate: `SPOT_RATE` × `flareAt(depth, attention, exhale)`.
  - Nothing in the outer grey (`FLARE_FROM`).
- **The split is red and blue everywhere** (Noah: red/green reads familiar, red/blue alien): the torn images carry brightness, one side shown red and the other blue, the green pulled down where it tears (`COLOUR.anaglyph`), so the grass tears like the alveoli.
- **In the mist** (`taintMist.ts`): grey translucent puffs drift over the ground about the camera. Without warning one flushes yellow-green, green or orange, a share of them neon bright past the bloom's threshold, and fades back.
  - Only closer in, by `flareAt`.

The scale (Noah: "an entire biome of grey twitching trees, the alveoli trees only two thirds of the way in, the creature deeper and more obscured"):

- **The breach** stands 950 m from the first village (`LAIR_DISTANCE`, was 400). On the plateau (PLATEAU.md, agreed with the plateau session): it stands `LAIR_FROM_KARST` 1050 m from the karst, `LAIR_TURN` about 100° off the karst→village line, so the edge (650) ends inside the plateau's 1800 m rim, about 300 m from the first village (`LAIR_DISTANCE` 1160).
- **The rings** (`TAINT`):
  - heart: 110 m;
  - nursery: 215 m, a third of the way out;
  - grey: 520 m;
  - edge: 650 m;
  - veins: 120 m past the edge.
- **Clearance:** the dens, ruins and warrens are kept out of it, and the lair's place has the taint's radius.
- **The trees:** the taint is dense wood throughout (`chunkModel.biomeAt`: 'dark' to the edge).
- **The fog:** grey through the outer biome, deepening to her purple-black.
- **The veins:** laid from the chunks' hubs; generating every chunk's roots took seconds.
- **The far figures:** the home village's Dark Young, wolves, snatchers, sacs and infants live in a `foes` group that is not hidden with the village's root past `SHOW_M`. The home village is "near" out to `LAIR_DISTANCE + 250`.
- **Her arms:** 110–280 m tall, rising from a 30 m mound. Within 150–250 m of the breach they show fully.
  - Farther out, only when the grey fog thins: every `LIFT_EVERY` 45–110 s, for `LIFT_S` 6 s.
  - They are dark shapes then, out of the scene's fog (it painted them pale).
