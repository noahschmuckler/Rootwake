# The beginning state: Eden, its creatures, and the hobbits who live in it

Design discussion with Noah (2026-10-27), a draft spec, not a pass. Nothing here is built. It follows `VISION.md`
(why the game exists, Eden as a fragile pocket, Petal as trickster and midwife) and `PLATEAU.md` (the land). Lines
marked **Noah** are decisions he stated; lines marked **Proposal** are Claude's, for Noah to accept or reject;
**Open** lines are questions waiting on him.

## What the game opens on

A rich, beautiful, homeostatic ecology on the 1.8 km plateau (about 10 km², less its lake and mountain belt). The
player (Hulda, avatar of agriculture) wakes into a world already in balance. Petal's tutorial then tempts her to
disturb it, and the mechanics arrive as she tries to restore it (`VISION.md`).

## The apex animals (Noah)

> **Superseded in part (Noah, 2026-10-29): see `ECOLOGY.md`.** The wolves now eat only chicken-of-the-woods to start, deer and boar rise from
> the soil and are not hunted at first, birds and fish are fungal, and the bear and thunderbird are singular failsafes that cull. The table
> below is the first sketch.

Each of these is **one individual or one pack**, an archetype of its kind, not a population of mobs.

| Animal | Role | Does |
|---|---|---|
| **Thunderbird**, a giant eagle | sky apex | roams the sky, sends lightning that starts the occasional forest fire, plunge-hunts fish in the big lake |
| **Kodiak bear**, massive | land apex | usually asleep; wakes **once a season** to feast |
| **One wolf pack**, archetypal | pack apex | hunts deer, boar and turkey |
| **Foxes, bobcats, the other mid-tier predators** | mesopredators | hunt rabbits, muskrat, waterfowl, fish |

- **Prey and the base of the web:** deer, boar, turkey; rabbit, muskrat, waterfowl, fish; below them mast (blackjack
  oak acorns), berries and the bog's cranberries. The wood is the Pine Barrens (`PLATEAU.md`, T4b/T4c).
- **Proposal, why one of each works:** at about 10 km² a closed plateau cannot feed several packs the way the game's
  many dens now imply. One pack, one bear and one great bird are what a sky-island could plausibly hold, and each is
  legible at a glance.
- **Proposal, the numbers do not close realistically.** A pack of six eats on the order of two hundred deer a year;
  8 km² of poor sand holds a few dozen. Either the pack is smaller (three or four), the turkey, hare and fish carry
  more of its diet, or the balance is mythic: Hulda is the homeostat, which is her whole domain ("the balance of
  creatures in an ecosystem", `ADVERSARIES.md`). The last turns an ecological weakness into the premise: the Eden
  holds because she holds it, and a player who plays carelessly sees it start to slip.
- **Open:** is the pack's range the whole plateau, and may it follow prey across the rivers' fords?

## No reproduction in the Eden (Noah, 2026-10-29; details in `OPENING_ARC.md` and `ECOLOGY.md`)

The table above is the *creatures*; this is their rule. In the beginning state the mammals (hobbits, wolves and, by Noah, the
rest to be decided) **do not have children**, and have not for untold eons. The prey base is a **fruiting creature that grows like a
plant** and multiplies without end, held in check by every predator eating it (it replaces the rabbit; the look is open: a
fungus-like, plainly non-mammal creature). So in the beginning state the pack's staple is this fruit, not the deer, boar and
turkey listed above, which would be a fixed number until Petal's first quest unlocks reproduction.

## The rhythms that keep it alive (all new)

None of these exists in the village entry yet: there is no weather or lightning there (only `weather.ts` in the
original study) and no seasons.

- **Fire.** The Barrens are fire-adapted (pitch pine cones open in flame). The thunderbird's lightning is the
  ignition. Fire clears undergrowth, flushes browse and berries, and renews the wood. It is a *good* disturbance, the
  Eden's own. **Proposal:** the first thing Petal tempts the player to do is suppress or misuse fire, so the
  ecology's own keystone becomes the first cost of advancement.
- **Seasons (Noah, 2026-10-29): winter is the bear's rest.** The bear feasts once in each of the other three
  seasons and sleeps through winter. **Proposal for the feasts:** spring fish run at the fords, summer berries and
  the bog, autumn mast and the spawning fish. Winter is the quiet season for everyone: the bear denned, the
  hobbits indoors on their stores, the pack leaner. A season is also the natural clock for the bear's waking, so it
  needs the village entry's day count to grow a calendar.
- **Mast years.** Acorn crops swing boar, deer and turkey, which swings the wolves, which gives you predator-prey
  cycles without scripting them.
- **Scale (Noah, 2026-10-29): the fauna are sized to the world**, not to the hobbits. The world is human-scale
  (`STAG_HEIGHT` is 1.9 m) and the hobbits are 0.46 m, so a wolf's shoulder stands above a hobbit's head and the
  bear and thunderbird are vast beside them. Consequences to design for:
  - Every predator is a real threat to a hobbit, not only to the goats, which is why the hobbits keep a respectful
    distance from the apex animals and read their signs. The existing rule that wolves "weaken and do not kill"
    (`villageModel.ts`) will need a second look once they are archetypal rather than raiders.
  - **Thunderbird size (Noah, 2026-10-29): it can carry a deer.** **Proposal:** a wingspan of about 6–8 m, the scale
    of the extinct *Argentavis* (roughly 70 kg), the largest flying bird known. A real eagle spans about 2 m and
    Haast's eagle about 3 m, so this is a mythic animal, but one with a real-world anchor. At that size it can
    plunge-hunt lake fish, lift a deer, and throw a shadow across a village. A hobbit (0.46 m) is small prey beside
    it, so it is a danger to them in the open.
  - **Hobbit height stays 0.46 m (Noah, 2026-10-29).**

## The hobbits at the start (Noah)

- They are **climbing up from foraging.** There were multiple collapses and this is the recovery stage. Generations
  separate them from their ancestors, so nobody remembers anything beyond legend.
- The ruins (the wards, the old bridge, the industrial remains in `RUINS.md`) are therefore **the ancestors' work, not
  theirs.** The hobbits find them as the Barrens' people find a rail bed in the pines.
- Apex animals are **neighbours, not enemies.** The hobbits know the wolf pack's range, give the bear's den a wide
  berth, and read the thunderbird's lightning as weather and omen.
- **Proposal:** their culture before the villages is a seasonal round with fire management, baskets, weirs at the
  fords, acorn leaching, and tended wild plants. The shrine at the stone and the legends are what is left of the old
  world.

## Mapping onto what is built

- **Wolves.** Today they are raiders: dens, warrens, a pack that comes at dusk, bites. **Proposal:** the baseline
  wolf is the archetypal pack above, hunting deer, boar and turkey; the existing hostile behaviour becomes what the
  mother of goats does to them (`DARK_YOUNG.md`: "wolves the mother has got into", and S4c's dire pack). Hostile
  wolves are then *corrupted* wolves, which keeps your premise and your existing combat. The warren-first,
  then-goat, then-bite ladder in `SETTLEMENTS.md` already reads as "a starved pack turns to the village", and can
  stay as the starvation case.
- **Boar and rabbits** already exist (wallow, warrens) and stay. The **stag** (her mount) is the deer of the same
  family.
- **To build:** the thunderbird (flight, hunting, lightning), the bear (sleep and wake), mesopredators, deer, turkey,
  waterfowl, the fish economy, lightning and fire in the village entry, and seasons.

## The hobbit redesign (Noah)

Base model: **the protagonist of DiggyDwarves, translated to 3D.** Short, stocky, hairy, comical. Genetic realism is
waved away.

**The reference** (`DiggyDwarves/art-src/dwarf-forward.png`, `dwarf-side.png`):
- A near-spherical body, about as wide as it is tall, with **no neck**; the head merges into the torso.
- One mass of **brown hair and beard** from the crown to the chest, shaggy, with a darker outline.
- A big rounded **pink nose**, thick dark brows, and wide round eyes (white, dark pupil) with a stern, comical look.
- Skin only on the face, ears, hands and feet: a pale tan, with round stubby arms ending in mitten hands.
- Short wide bare feet with the toes showing, set well apart.

**Proposal, how:**
- Keep the **X Bot skeleton** (`huldaSkeleton.json`) so the Mixamo clips keep working, as hobbits do today
  (`createHulda` at `HOBBIT_HEIGHT` 0.46). Only the body changes: new primitive proportions, shorter limbs, a bigger
  head-and-body mass. The clips need retargeting checks, because short limbs and a no-neck body will clip through the
  hair.
- Build the body with the **same method as Hulda's**: smooth primitives along the bones, surface-net meshed, cel
  shaded with the outline hull (`design/hulda/HULDA_STYLE.md`). Today hobbits and the steward use the old jointed
  figure, so this also retires that figure.
- The hair and beard are the new part: **layered shell cards or clumps** over a skinned core, in the vista's cel
  look, with a little spring physics like Hulda's braid, so the beard sways when they walk.
- **Variety:** hair colour, beard length, nose size and tint carry identity, so eight to twenty-four folk read apart
  at a distance. Infants and children are the same body at smaller scale.
- **Comedy** lives in the walk (waddle, short stride, arms swinging wide), the idle, and the face.

**Decided (Noah, 2026-10-29): everyone is hairy and nobody wears clothes**, as the dwarf does. So the hair mass is
on every hobbit, women and children included, and the clothed figures (the leaf-and-cloth `createHulda` colours the
hobbits use today) are retired. Consequences:
- Fur carries the identity: hair colour, length and cut, and the nose and skin tint, are all that tell eight to
  twenty-four folk apart at a distance, so the variety has to be generous.
- Winter warmth comes from fur and from the fire, so the fire and the wood store matter to the village in the cold
  season.
- Carried things (the basket, torch, spear, pail) become the only "costume", which makes them read at a glance.

The 0.46 m height is kept (Noah, 2026-10-29).

## How the Eden breaks (sketch, for later)

Petal's first temptations should each be a real good that costs the balance (suppress the fire to protect the
village; plant a field; thin the pack to keep the goats). Each unlocks a mechanic and advances Delvira's counterpart
(`VISION.md`). **Open:** which comes first, and does the first disturbance come from Hulda's own hand or the
hobbits'?
