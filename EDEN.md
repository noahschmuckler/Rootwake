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

## Passes

- **E1 (this sprint):** the Eden's state; the hobbit band in the cave with its daily round; the chicken-of-the-woods cycle; the pack;
  the deer by the cave. Checked headless; published.
- **E2:** the birds (nest-burls, the puffball flights) and the fish (eddies, spheres, the lake, upstream); the bobcat that takes both.
- **E3:** the seasons and the bear (its den, its sleep, one feast a season).
- **E4:** the thunderbird (the burl count, the storm, the strike, the fire, the saplings); boar and acorns.
- **E5:** the snerk's observation quests: what the instruments reveal per behaviour (PROGRESSION.md's open questions).

## Open

- The band's number (eight) and the pack's (five); the cave's exact spot (a pass's foot, or the plain rock face).
- Whether the hobbits also eat berries and acorns in the Eden, or chicken alone (E1 gives them berries as a second gather).
- Whether the hearth's fire is theirs already (BEGINNING.md: fire management is part of their culture). E1 lights it at dusk.
