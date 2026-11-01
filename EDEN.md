# The Eden: the world as it is before the fall (the chapter after the opening)

Noah (2026-10-31), after playing O1 and O2 on the phone ("all good; the deer is satisfying"): **"next we need to build the world as it
is earlier."** The mother not awakened. The hobbits as 3D hairy creatures after DiggyDwarves' dwarf. The hobbits living in caves at
the mountain bases, venturing out to hunt and gather; the villages not yet existing. The wolves and the hobbits balanced against each
other on the chicken-of-the-woods. The bear, the thunderbird, the bobcat, the fish, the birds. The snerk's quests are observation
quests, so **the world to be observed must be built first.** The design is in `BEGINNING.md` (the hobbits, the apex animals, the
rhythms) and `ECOLOGY.md` (the fungal creatures, the spirit deer, the flesh, the two failsafes, the fall in order); this file is the
build record. It lives on `feat/opening`, in the opening entry (`opening.html`), and is published with it.

## Decisions (Noah, 2026-10-31)

- **Every later meditation keeps the full ending** (the drop, the ripples, the reveal), as built.
- **Depth first.** E1 builds the Eden's state, the hairy hobbits in a cave with a daily round, the chicken-of-the-woods life cycle and
  the one pack eating it, so the deer can watch a real balance. The other creatures follow one sprint at a time.
- **One cave, one band:** a single band of eight in one cave at the nearest mountain base.
- **The reference art** is DiggyDwarves' dwarf, fetched from that repo into `design/hobbit/` (`dwarf-forward.png`, `dwarf-side.png`,
  `dwarf-back.png`, `dwarf-diagonal.png`): a near-spherical mass of shaggy brown hair with a darker outline, no neck, a big pink nose,
  thick dark brows over wide round eyes, pale tan ears, mitten hands and wide bare feet with the toes showing.

## Claude's readings for E1 (for Noah to accept or reject)

- **Where the Eden lives.** The opening entry gains an era: in the Eden the three villages are not built (their huts, stores, folk,
  raids, prayer and the keeper are off), the mother sleeps (no raids, no snatchers, no growth, no taint), and a new layer
  (`edenModel.ts`, `edenWorld.ts`) holds the band, the fungus and the pack. The land, the karst, the catwalk, the deer and the map
  are unchanged. The village entries elsewhere are untouched.
- **The cave** is at the foot of the mountain belt on the bearing of the first village site from the karst, about 1.5 km from that
  site: a mouth in the rock with a dark hollow behind it, a hearth before it. The band sleeps inside by night and eats at the hearth.
- **The daily round** on the village clock (a day is twenty real minutes): out at dawn by each one's hour, each to the nearest free
  or resting chicken-of-the-woods (two of the eight go for berries), a struggle to take it, carried home to the hearth, out again
  while the morning and afternoon last and the hearth needs more, idle at the mouth after, the meal at dusk, sleep by night.
- **The chicken-of-the-woods** grows at a host tree's base over `GROW_DAYS`, breaks free (a new one starts growing where it broke
  off), waddles about for a day eating grass, attaches to another tree to rest for two, and waddles again, until something eats it.
  So the fungus multiplies without end and only the eaters hold it; the balance is a tuning of hosts within reach, growth days, the
  band's and the pack's daily meals, checked by a thirty-day test.
- **The pack** is one pack of five with a resting place a few hundred metres from the cave: it roams at dawn and dusk, the leader
  takes the nearest free chicken and the rest follow, they eat, and rest through noon and night. Wolves and hobbits are coequal
  tribes: a wolf leaves a chicken a hobbit is near, and neither harms the other.
- **The hobbit body** is procedural in code (`hobbitFigure.ts`): a fur ball of layered shells on a sphere, the face a tan patch with
  the nose, brows and eyes, mitten hands on short arms, bare feet, cel shaded with an outline hull, and a waddle made in code (the
  body rocks, the arms swing wide, the feet alternate) rather than the Mixamo clips: the no-neck, spherical body does not retarget
  cleanly, and the comedy is in the waddle (BEGINNING.md). Variety by hair colour and tint, nose size and height.
- **The chicken** is stacked fan shelves, orange to yellow, on stubby legs when free; the wolves use the village's wolf body.
- **The deer** rises by the cave's foraging ground in the Eden, so what she watches is the band and the pack.

## E1 as built (2026-10-31)

- **The era.** The opening entry is the Eden (`ERA`/`EDEN` in `village.ts`; `?era=village` shows the village world instead). In it the
  villages are never near or drawn and never advance (their tick keeps the day for the light), the growth never steps, and so the mother
  sleeps. The dens of the old wolves still stand on the land with their sleeping packs (E2 or later takes them away).
- **The model** (`edenModel.ts`, pure, tested in `tests/eden.test.ts`): `freshEden` seats the cave, the hearth 3.2 m before its mouth,
  the nearest `HOSTS_MAX` (48) tree bases within `FORAGE_R` the band can walk to, berry spots and the pack's rest; `stepEden` a tick at a
  time: the fungus grows in `GROW_DAYS` (5), frees, waddles its day, rests two at another tree; the band wakes by each one's hour, each
  to the nearest free or resting fungus (two to berries), takes it in `TAKE_TICKS`, carries it to the hearth, out again while the hearth
  needs more (`NEED_PER_DAY` 6) and the day lasts, idles by the hearth, eats at dusk, sleeps inside by night; the pack hunts outside noon
  and night until `PACK_MEALS` (8), the leader to the nearest fungus no hobbit is after, the rest in file, and turns the whole pack away
  from any hobbit within `KEEP_OFF_M`. Walking goes round what it cannot stand on and gives a target up after `GIVE_UP` ticks. The
  thirty-day test holds the free fungus between a few and the hosts' count with both eaters fed. Events (`EdenEvent`) are kept for E5.
- **The figures.** `hobbitFigure.ts`: the dwarf in code, a shaggy icosphere with a tan face patch, brows, eyes, the pink nose, ears,
  mitten arms and bare toed feet, a black hull outline, the waddle in code; `hobbitLook` varies hair, skin, nose and height by seed.
  `chickenFigure.ts`: the bracket fungus, shelves on legs, `SIZE` 2.3 so a free one is about half a metre across. The pack is the
  village's wolf body (`wolfFigure.makeWolf`) with legs swung in code and a lying pose at rest. `edenWorld.ts` builds the cave (shaggy
  rocks round a dark mouth and a short hollow), the hearth (a ring of stones, flames and a light at dusk and night), and eases every figure
  toward the model at its pace (`snap` for checks).
- **The entry.** `caveSpot` walks the first village's bearing from the karst out to where the belt's rise passes `CAVE_INTO` (10 m past
  the rim); the hosts come from `chunkTrees` round the hearth; the model is stepped on the day's ticks in place of the villages and saved
  under `rootwake-eden-v1`; the deer rises by the hearth. Dev: `__village.opening.eden` (`summary`, `model`, `counts`, `step(ticks)`,
  `toCave()`, `reset()`).
- **Checked:** `browser-opening.mjs` steps a day, asserts the takes, the dusk meal and the pack's eating, and shoots the hearth at dusk,
  a hobbit, the fungus and the pack (15–18).
- **Not yet:** the hobbits' names and talk; the fire as theirs to light; berries as a drawn bush (the pickers walk to a spot and bring a
  bundle back); the old dens; sound.

## E1b as built (2026-10-31): the band's antics

Noah, after the first play of E1: "the hobbit models are good, but they should be amusing to watch, interacting with each other and the
world; cute and funny, with slapstick pratfalls, little fights with each other ending in a hug. Think of the Minions, or the pill bugs
in A Bug's Life." And DiggyDwarves' dwarf for the idle manner: there (`MetagameScene.wanderDwarf`, the addendum's §5.5) he wanders a
tile at a time when nothing is asked of him and, bumping something, pauses with a character bubble: flowers "sniff sniff", a tree
drifting Zs, a rock "la la la", the pond a wondering sparkle.

- **The model** (`edenModel.ts`, E1b block): an idle hobbit at the hearth with the day's need met starts an antic at `ANTIC_CHANCE` a
  tick: a **wander** within `ANTIC_R` to a flower (then **smell**), a rock (then **sit**, humming), a tree within `NAP_M` (then **nap**)
  or nowhere; a **scuffle** with an idle neighbour within `SCUFFLE_M` (it hops in to a step away, both face off for `SCUFFLE_TICKS`),
  ending always in a **hug** (`HUG_TICKS`); or a **tumble** (rolling as a ball `TUMBLE_M` at `TUMBLE_PACE`, then **dizzy**). Any walk
  (out, home, a wander) has a **trip** at `TRIP_CHANCE` a tick: flat on its face for `TRIP_TICKS`, then up and on with the load. Dusk
  and night drop the quiet antics for the meal and the cave. Flowers (`FLOWER_SPOTS`, 3–9 m from the hearth) and rocks (`ROCK_SPOTS`,
  2.5–6 m) are seated at the Eden's making on the band's own ground. Events: hobbit-smells / sits / naps / scuffles / hugs / trips /
  tumbles. The thirty-day balance holds with them (the suite).
- **The figure** (`hobbitFigure.ts`): sniffing bent to the flower with little bobs; sitting down on the rock, toes up, swaying to its
  hum; napping on its side, eyes shut; scuffling leaning in, hopping, arms flailing; hugging leaning in with its arms round; the trip a
  face-plant blended in, feet kicking; the tumble the ball rolling at its true rate; dizzy reeling. A glyph sprite over the head, the
  dwarf's own: "sniff", a note, Zs, and the slapstick's stars and a heart.
- **The world** (`edenWorld.ts`): the flowers as three pastel heads on stems, the sitting rocks flat-topped (`SIT_ROCK_H`, the sitter
  lifted onto it). The check asserts the events over the stepped days and catches one in the act (15b-eden-antic).
- **Claude's readings:** the scuffle has no loser and no harm (a tussle, then the hug, as asked); the trip keeps the load; nothing is
  said aloud yet (names and talk are still "not yet"); the chances and lengths are first guesses to tune by watching.

## E2a as built (2026-10-31): the night

Noah, after play: "the game is currently nighttime, and nothing happens at night. It may be time to add the bobcat, and adapt the
bird idea: the fungal bird creatures are luminescent, both as eggs in their burl nests and when flying. The chicken of the woods
should also be luminescent, so nighttime is alive and not just dark." Built from ECOLOGY.md's birds (puffball growths on nest-burls
high in trees; a popped one releases bird-like fungi that soar like enormous spores and settle where they land as another burl) and
its bobcat (related to the Hollowed: tall, gaunt, hooded and robed, a beaked mask, glowing red-orange eyes, grey clawed hands; it
climbs trees and catches birds, sometimes in flight). The fish and the bobcat's fishing are left for E2b.

- **The model** (`edenModel.ts`, E2a block): a third of the hosts start with a **burl** `BURL_H` m up (at most `BURLS_PER_TREE` a
  tree), its three eggs ripening over `BURL_DAYS`; ripe, it pops at dusk or night into `BIRDS_PER_BURL` **birds** that soar on
  drifting headings at `BIRD_SPEED`, easing to the trees' middle height, for `FLIGHT_TICKS`, then settle on a host within `LAND_R`
  as a new burl (`LAND_CHANCE`; the rest soar off and are lost). The **bobcat**, one, sleeps at a den `CAT_DEN_M` from the hearth by
  day; from dusk, short of `CAT_MEALS`, it prowls: a bird passing within `CAT_LEAP_M` and under `CAT_LEAP_H` it leaps for; else it
  walks to the nearest burl with eggs within `CAT_HUNT_R`, climbs (`CAT_CLIMB_TICKS`), eats the eggs (`CAT_EAT_TICKS`; the burl is
  spent) and climbs down; fed or at dawn it lies up at its den. Events: burl-pops, bird-lands, bird-lost, bobcat-prowls,
  bobcat-eats-eggs, bobcat-takes-bird, bobcat-sleeps. Thirty days keep the burls between a few and the trees' holding (the suite);
  the fungus, the band and the pack are untouched.
- **The figures** (`nightFigures.ts`): the burl a lumpy growth out from the trunk (`BURL_OUT`) with three luminescent eggs in its
  top, their glow by the night (`EGG_GLOW_NIGHT`); the bird a glowing puffball with two membrane wings, flapping slow, rolling
  gently (`BIRD_GLOW_NIGHT`); the bobcat a gaunt pale-grey cat high on its legs with a hood-like ruff, a dark beaked muzzle, ember
  eyes that glow by night, ear tufts and grey claws, standing vertical against the trunk when it climbs. The chicken-of-the-woods'
  shelves glow by night too (`chickenFigure.GLOW_NIGHT`). The entry passes the night (dusk 0.6, night 1, dawn 0.35) to the world;
  bloom (Medium and High) halos the glows.
- **The night's light (Noah, after play: "the bloom looks great, the forest looks magical, but it's too dark altogether; just increase
  ambient light at nighttime"):** the shared hour table's two night keys (`villageVista.KEYS` at 20.4 and 4.6) were raised: the moon's
  light doubled (0.35 → 0.75), the ambient near a day's (0.55 → 1.05, the sky and ground ambient lightened). It is the look every
  entry under the vista shares, so the village study's night is lighter too.
- **The check:** steps to night, waits for a bird in the air and the bobcat out, shoots the hearth at night and a burl (19, 19b).
- **Claude's readings:** the burls do not yet count toward the thunderbird (E4 reads them); a bird lost beyond the hosts is simply
  gone (no burl starts outside the band's wood); the chances and glows are first guesses; the bobcat does not fish yet.

## Assets for the animals (2026-11-01): the wolf from a file

Noah: "Are there public assets available for the wolves, birds, and bobcats, for their model and animations?" Then "Ok to proceed."
What was found, and what was done:

- **Wolf: yes, twice over.** Quaternius's *Ultimate Animated Animal Pack* (CC0, the pack `public/models/stag.glb` came from) holds a
  Wolf glTF with the stag's clip family (idle, walk, gallop, jump, eating, two attacks, two hit reacts, death); its public Drive
  folder refused the download all day ("quota exceeded", a per-file daily cap), so the **Wolf of his *Animal Pack Vol.2*** (CC0,
  OpenGameArt, 2017: Idle and Walking only, FBX) was converted and used: **`public/models/wolf.glb`** (218 KB, 622 triangles, 34
  bones; `WOLF_CREDITS.md` beside it). `wolfFigure.createAssetWolf` clones it with its skeleton per wolf, fits it to `WOLF_LENGTH`,
  gives it the hide material and our eyes on its head bone (the bone furthest forward), and blends Idle and Walking by speed, the
  walk paced to `WOLF_CLIP_WALK_MS`; it faces +x like `makeWolf`'s body, so `edenWorld` places both the same way. The Eden's pack
  is the procedural body until the file has loaded (at boot, `village.ts`, `?wolfasset=0` keeps the body), then swaps
  (`EdenWorld.useWolfAsset`); the village's own wolves and the dens still draw the body. When the Ultimate pack's wolf can be
  fetched, the same loader takes it (its clip names differ: `Walk`, `Gallop`; `createAssetWolf` reads `Walking`).
- **Birds: tried and left out.** The Vol.2 pack's Eagle (CC0, Flying and Idle clips) is 24,800 triangles of scalloped feather
  shells; it only holds together at full detail (three's SimplifyModifier tears the shells apart at a tenth), and a flock of them is
  too heavy for the phone, nor is a feathered eagle the fungal spore-bird. The other free animated birds are CC-BY on Sketchfab
  (a credit line, and a login to download) or `.blend` only. The birds stay procedural (`nightFigures.createBird`).
- **Bobcat: nothing free and animated.** Every rigged bobcat or lynx is a paid marketplace model; the one free "rigged lynx" is a
  Fortnite rip. The nearest CC0 base would be the Ultimate pack's Fox (same rig, a leap and attacks), retextured; since ours is in the
  Hollowed's language (hooded, robed, climbing) the procedural figure stays.
- **Tooling:** `scripts/fbx-to-glb.mjs` (an FBX through three's FBXLoader and GLTFExporter under node: clips renamed past the
  armature bar and kept once by name, `--keep`, `--scale`, `--simplify N` per material group with the skin put back from the
  nearest original vertex) and `scripts/view-glb.mjs` (a file rendered headless with its axes, a clip advanced, its bounds printed:
  how a file's facing and size are judged before a figure is written round it).
- **The check:** waits for the file wolf before the pack shot (18) and asserts it.
- **Claude's readings:** `WOLF_LENGTH` 1.55 m and the walk's pace are by eye; the Vol.2 wolf has no lying clip (resting, it is
  lowered and tilted as the body was, legs standing); the eyes sit at a guessed offset from the head bone's tip.

## Passes

- **E1 (this sprint):** the Eden's state; the hobbit band in the cave with its daily round; the chicken-of-the-woods cycle; the pack;
  the deer by the cave. Checked headless; published.
- **E2:** the birds (nest-burls, the puffball flights) and the bobcat: built as E2a, the night (above); **E2b:** the fish (eddies, spheres, the lake, upstream) and the bobcat's fishing.
- **E3:** the seasons and the bear (its den, its sleep, one feast a season).
- **E4:** the thunderbird (the burl count, the storm, the strike, the fire, the saplings); boar and acorns.
- **E5:** the snerk's observation quests: what the instruments reveal per behaviour (PROGRESSION.md's open questions).

## Open

- The band's number (eight) and the pack's (five); the cave's exact spot (a pass's foot, or the plain rock face).
- Whether the hobbits also eat berries and acorns in the Eden, or chicken alone (E1 gives them berries as a second gather).
- Whether the hearth's fire is theirs already (BEGINNING.md: fire management is part of their culture). E1 lights it at dusk.
