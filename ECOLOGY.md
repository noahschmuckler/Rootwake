# The Eden's ecology: fungus that walks, earth that walks, and the two failsafes

Design discussion with Noah (2026-10-29), a draft spec, not a pass. Nothing here is built. It replaces the creature table in
`BEGINNING.md` for the beginning state and builds on `OPENING_ARC.md`. Lines marked **Noah** are his decisions; **Claude** lines are
readings or proposals; **Open** lines wait on him.

## Three kinds of creature

- **Fungal creatures** (chicken-of-the-woods, birds, fish) reproduce, and are the Eden's meat.
- **Spirit animals** (deer) are the earth itself walking. They eat nothing, are not hunted, and cannot bleed.
- **Flesh** (hobbits, wolves, boar, bobcats) can bleed. In the initial state none of them reproduce, except where noted.

### The fungal creatures (Noah)

| Creature | Life cycle |
|---|---|
| **Chicken / hen of the woods** (the meat-fruit; replaces the rabbit) | Grows at tree bases, in many colourings, some like turkey tail. Breaks free when mature, waddles about eating grass and whatever is in its path, then attaches to another tree to rest. A new one grows where it broke off. |
| **Birds** | Puffball-like growths on **nest-shaped burls** high in trees. A popped one releases flying bird-like fungi that soar like enormous spores; where they land they settle and start another nest-burl. |
| **Fish** | Waterborne fungus. Bubbles in river eddies settle into opaque spheres on the river's edge. When mature the fish-fungi swim to the lake, bind with fish from other rivers into larger salmon-like fish, swim upstream to eddies, and dissolve in the froth, which restarts the cycle. |

### Spirit animals: the deer (Noah)

- Deer **rise from the soil like Hulda's stag**, wander at random, then **sink back into the soil.** They are the earth "stretching its
  legs and walking around."
- **They eat nothing, nothing hunts them, and they are not culled** in the initial state.
- They are **related to the snerks**; their designs should align.
- **Later, some deer become flesh,** more like natural deer, to counterbalance the wolves' hunger once the hobbits overharvest the
  chicken-of-the-woods. (Claude: these would be the first deer that can be hunted, and the first that bleed.)

### Flesh

- **Boar** are related to the greeblins; designs align. **Only boar crave acorns,** and settle for chicken-of-the-woods and
  blueberries. **They do not reproduce in the initial state.**
- **Wolves** eat only chicken-of-the-woods, to start. **Wolves and hobbits are related** and may see each other as members of
  different, coequal tribes.
- **Bobcats** are related to the Hollowed and share their design language. They catch **fish in the rivers** (the smaller fish
  swimming downstream), climb trees, and catch birds, sometimes leaping tree to tree to take one in flight.
- All four **bleed.**

### Design alignment with the mountain's peoples (Noah)

- **Snerks** (deer): hunched; hooded purple cloak; long pink beak-nose; green face; a huge pack with a hanging lantern.
- **Greeblins** (boar): green goblins with big ears and tusks.
- **Hollowed** (bobcats): tall, gaunt, hooded and robed; a beaked mask; glowing red-orange eyes; grey clawed hands.
- **Claude's reading of "related":** the plateau's animals share a source with the mountain's keepers, so a player who meets a snerk
  on D can recognize the deer on the surface.

## The two failsafes (Noah)

Both are singular. They cull whatever the predators fail to hunt, and to the player they will seem like boss enemies.

### The bear: one food per season

| Season | The bear feasts on | Taken from |
|---|---|---|
| Spring | blueberries | hobbits, wolves, boar |
| Summer | fish | hobbits, bobcats |
| Autumn | acorns | hobbits, boar |
| Winter | sleeps | (nothing) |

- Each feast **removes a food source seasonally** from those who share it.
- **As the hobbits expand and claim more of each food source, they risk conflict with the bear.** That is the pressure that sets up
  the boss fight, before anyone has attacked it.
- (Claude: this replaces the proposal in `BEGINNING.md` that the spring feast was the fish run at the fords.)

### The thunderbird: the burn

- The **more burls accumulate on a tree, the more likely the thunderbird takes flight.** It soars to the tree and **climbs vertically,
  gathering thicker and thicker cloud until a thunderstorm forms** and lightning strikes the tree.
- The forest fire **clears the burl-infested, chicken-of-the-woods-infested trees** and makes room for **acorn and pinecone saplings,**
  which **mature by the next year** to host more chicken-of-the-woods and burl nests.
- So the fire is a rotation, not a hazard: the fungus builds up, the bird burns it, the saplings restart it.
- (Claude: it gives the player something legible to read, because a tree's burl count tells you where lightning will land. It also means
  hobbits who harvest or plant near heavily burled trees are in the path of a storm.)

### Culling elders (Noah)

- **When birth exists, the bear and the thunderbird carry off the eldest members of a population** to keep it low, and that includes
  **hobbit elders.**
- This should happen **only once the emotional stakes are set,** so the player has to have come to care about particular hobbits first.
- (Claude: this explains why no hobbit remembers anything before the present generation.)
- Defeating them lets the hobbit population grow, but **moves toward awakening the mother** as the symbol of unrestrained fecundity
  (`MOTHER.md`).

## The fall, in order (Noah's sequence, Claude's arrangement)

1. **Overharvest.** The hobbits take more chicken-of-the-woods than the web can replace, and the wolves go hungry. (Existing mechanics
   this touches: warren and larder in `villageModel.ts`, `SETTLEMENTS.md`.)
2. **First real blood.** A hungry wolf is killed. It is the first death of flesh in the Eden. Wolves and hobbits had been coequal
   tribes, so it is a killing between kin.
3. **The counterweight.** Some deer become flesh to feed the wolves' hunger.
4. **The decision.** The hobbits "decide they deserve to have children at the expense of the wolves," which is the taker act in
   `OPENING_ARC.md` (surplus, and war on a competitor).
5. **Birth, and the culling.** Children exist; the bear and thunderbird begin to carry off elders once the player cares about them; the
   hobbits' growth presses on the bear's foods.
6. **The boss fights** are the way out of that, and their price is the mother.

## The first quest changes (Noah)

The snerk on D gives Hulda her first quest: **inhabit a deer.** She rises from the soil as a deer and explores the world **unable to
interact with it,** observing up close. (Claude: this is the pool's-sight HUD from `OPENING_ARC.md` made physical, and it needs no new
mechanic beyond the stag's rise from soil, a camera with no interaction, and the deer's random wander and sinking. It also lets the
player see the fungal cycles before disturbing them, so the later damage can be read. The earlier "task to activate instruments"
sketch is replaced by this.)

## Open

- **Which deer become flesh, and how does the player see the change?** (Does a spirit deer keep its look of soil and branches while a
  flesh deer looks natural?)
- **Does the hobbits' first overharvest come from the player's hand or the hobbits'?** Is the "enough" line visible?
- **What do wolves do while hungry and not yet attacked?** Do they go for the hobbits' stores, the boar, or each other?
- **What does the bear do to the village's claims?** Does a claimed berry patch draw it, or only the total harvest?
- **Does a hobbit elder's carrying-off happen on screen,** and how many hobbits must the player have known by name first?
- **Winter.** The bear sleeps and the thunderbird? Does it still burn in winter?
