# Rootwake — systems design

The rules of the game beyond the first feel-tests. `DESIGN.md` holds the
origin, the cosmology and the pass-by-pass history; this file holds the
systems as they are meant to work once built, so a pass can be planned
against a stable statement instead of a chat transcript. `ROADMAP.md` turns
this into an implementation order. Designer's notes, 2026-09-05, organised.

Everything here is a target, not a description of the current build. Where
a number appears it is a first guess and is flagged as tuning.

---

## 0. The philosophy: nothing "just because"

**A need should be satisfied. The more pressing the need, the more
satisfying the payoff.** The Minecraft first night is the reference: you die
because you have no light, no shelter, no bed, no weapon, no armour, no food
— and every one of those becomes a goal you *feel*. Every system below is
introduced as a need first and a solution second, and no feature ships that
does not answer a need the player has already felt.

Two ebbs and flows run through the whole game:

- **Constriction ↔ vastness.** The cosmology (DESIGN.md): confinement
  releasing into vista, at every scale.
- **Stored potential.** A pile of logs promises structures, a pile of sticks
  promises tools, a pile of seeds promises trees. In combat, matches fill
  energy meters that are spent on abilities, in-combat movement, blocks,
  attacks. In crafting it is the cycle of **stockpile → organise → produce**
  something that unlocks new play. Weight (DESIGN.md, Pass 0.6) is what
  makes potential *visible*: it sits in piles in the world, not in a list.

---

## 1. Vitality

One stat replaces "energy" and "fatigue" and "strength" as separate bars.
**Vitality** is how alive you are right now. It is drained by effort and
weather, restored by food and rest, and it drives strength, carrying,
movement, and *what you can see*.

### 1.1 What drains it

- Working a tree board (each swap, or each shot that lands — tuning).
- Dragging heavy objects (per hop while dragging).
- Tilling (each shot that lands).
- Being out in the rain; a lightning strike (see §4).
- Time, slowly, when awake.

### 1.2 What restores it

- **Food.** Seeds are a poor food: eating them restores a little and is
  what you have on day one. Better food later (crops from planted seeds,
  foraged things, cooked things) restores more and raises the ceiling.
- **Rest.** Sleeping restores vitality. How much, and how high the ceiling
  goes, depends on shelter (§4). As built (0.9): on the ground the ceiling
  is 0.7; in a bed you made it is 0.9, and the restore is larger.
- **Collapse.** When vitality hits the floor you collapse and wake still
  tired. **Each collapse without eating in between restores less.** You are
  never dead. At the extreme you can only look around, move once, and
  collapse again — the game keeps you alive and makes the need for food
  unmistakable. As built (1.0 fix): "move once" is guaranteed — waking never
  leaves you below WAKE_MIN (0.14), about eleven hops above the floor,
  whatever the diminishing factor says.

### 1.3 What it does

Vitality maps onto the weight rule's **strength** (DESIGN.md §0.6):
strength is a function of vitality, so a tired character drags what she
used to lift and a well-fed one lifts what she used to drag. Beyond that:

- **Carrying.** As vitality falls, stack caps shrink. Fatigue never takes a
  hand away: losing hands is too devastating for this axis (it arrived
  before any visual cue and blocked the cure, eating). Hand loss is a
  combat or poisoning effect, later.
- **Movement.** The waypoint fan's reach shrinks with fatigue; at the floor
  it is one short hop.
- **Vision.** See §2 — this is the payoff that makes vitality more than a
  hunger meter.

### 1.4 How it is shown: no bar

**A halo on the screen borders, and ambient light in the extremes.**

- Well fed: richer colours, a light, faint halo.
- Normal: nothing to notice.
- Tired: a steadily darkening halo, then greying colours, then tunnel
  vision, then collapse. The halo begins well before any mechanical
  effect — what you see is always the first sign.

No numeric readout in the main view. The halo is the meter, the colour of
the world is the meter, the reach of the movement fan is the meter.

---

## 2. Vision: two regimes, one dial

Vitality is also a **vision dial**, and the two ends see different things.

- **High vitality** (well fed, rested, vitality potions, gear): see in the
  dark, see further. Some **secrets** — inscriptions, hidden doors, traps —
  are only visible at very high vitality.
- **Low vitality**: the world is dim and you feel weak, but as ordinary
  vision recedes something like an infrared or ultraviolet glow reveals
  features that are otherwise invisible: **dark secrets**, and resources
  that only show themselves to the exhausted.

This makes fatigue a *state you might choose*, not only a failure. It hints
at The Witcher: potions and poisons that sap strength but grant vision. Only
high-level alchemists make potions that grant the bloom while preserving
strength. In a party it becomes roles: one runs weak and scouts for
auras, one runs strong for ranged work, others stay balanced.

**The overworld test bed: a day/night cycle.**

- Well fed at night: washed-out colours, but strong vision — you see the
  plateau.
- Fatigued at night: dark, but a special resource is visible and
  collectible only in that state — a **lichen** on the rock, glowing to
  tired eyes. It is the first "dark secret", and the first reason to *be*
  tired on purpose.

---

## 3. Food

- **Seeds** are the day-one food: poor, but you have them, because felling
  a tree scatters them. Eating is a hand gesture (drag a seed stack to the
  halo / your face — TBD; must be one motion like everything else).
- **Planting** seeds on tilled ground is the other use of seeds, and the
  first tension: eat the future or plant it. (0.6c in DESIGN.md.)
- Better food and cooking come with fire (§5: timber, kindling, wood chips)
  and later with crops. Food quality raises the vitality ceiling, not just
  the fill.

---

**As built (1.1c).** The first better food is **wheat**, and it comes from
the seeds you already have by **transmutation**: the character starts
knowing one rune, the wheat rune. Long-press seeds on the ground →
*Transmute…* → a tangram-style constellation of a wheat stalk floats over
them; each match charges one of its angles, and when the last lights every
plain seed within reach turns gold. Wheat seeds are food that **nourishes**:
eating one restores a little more than a tree seed and slows every drain —
idle, effort, rain — to 60% for a minute and a half. Four wheat seeds on
tilled ground grow four stalks in a minute; when ripe the patch locks like
any other and a board session harvests ten wheat seeds. Wheat seeds on a
lit campfire pop, a moment later, into giant **popcorn** kernels: twice the
food and a longer nourishment. (The rune is the shape combat will reuse:
charge a reserve by the board, release it through an act.)

## 4. Shelter: why you need a roof

Aesthetics aside, shelter answers environmental hazards.

- **Rain.** Being outside in the rain drains vitality.
- **Lightning.** A strike near you saps vitality to a dangerously low
  level instantly. Rare, loud, and the reason a roof feels like safety.
- **Recovery** is faster under a constructed roof.
- **Sleep quality.** The maximum vitality reachable through rest and food
  is higher in a high-quality shelter (or: vitality drains more slowly when
  you sleep in one — pick one, tuning).

**When is a roof a roof?** A working definition for the first build: a roof
piece is a shaped-timber assembly placed on top of at least two wall
segments; "under a roof" is a ray cast straight up from the player hitting a
roof piece. Quality is a property of what the pieces are made of and how
many gaps there are. Refine once the log-cabin pieces exist (§5).

As built (1.0c): the roof is the cabin's slat roof (§5.4): eight long
timbers across the side walls; quality = slats laid / 8. Rain stops at the slats and comes
through the gaps until the roof is whole; the rain sheet on the screen is
off while you are under it. "Under the roof" is the cabin's footprint (the
up-ray, simplified). Rain drains you only outdoors; a close strike is held
off under any roof; the sleep ceiling gains 0.1 × quality and the restore
40% × quality on top of the bed's.

---

## 5. Crafting and building

Port DiggyDwarves' structure building, with two twists born of weight:

1. **You must be within reach of the requisite materials.** Crafting
   happens where the stuff is; there is no inventory to craft *from*.
2. **The end product should match as closely as possible the 3D objects
   that comprise it.** A wall of fitted logs looks like the logs you
   fitted.

### 5.1 The interface: long-press a material in the world

No menu buttons cluttering the view. **Long-press a crafting material in
the world** and a menu of *known* recipes for it appears (Terraria's
proximity crafting, made physical). What is in your hands decides which
recipes are available: a rock alone shows one thing, a rock while holding
a rock shows another.

### 5.2 Rocks come back

As in DiggyDwarves, **tilling land spawns rocks** — even land that is
already tilled. A rock is `large`, 1 in hand, light enough to lift.

### 5.3 The first tool: a stone hand axe

- Hold a rock in one hand. Long-press a rock in the world → the crafting
  interface opens: the **target rock hovers in front of you** and the
  match-3 board appears (the same board, the same lock).
- **Matches make the rock in your hand visibly strike the hovering rock.**
  The shot-hits-target pattern from trees and patches, now with a held
  object as the projectile.
- As the target's HP dwindles it **steadily shapes into a wedge**: the
  staged-looks pattern from the grass patches (authored stages at
  thresholds, no lerp).
- At zero it is a **stone hand axe**: for cutting and shaping logs.

### 5.3b Bags come late, and behind a chain

A bag is the answer to the first want the weight rule produces (crawling
back to a seed pile), and it must stay earned: **bag ← cloth ← thread or
string ← plant fibres ← a processing activity** (retting, twisting,
weaving — each its own board session at a place). No shortcut from sticks.
The chain is the point: every link is stored potential you can see in a
pile, and the bag arrives when the loop has taught you to want it badly.

### 5.4 Shaping logs: Lincoln Logs

The building system is Lincoln Logs (designer's call, after 1.0). One
convention makes it: **the notch grid.** Notches sit on a square lattice of
one bay; a log lies between grid points; courses alternate direction by 90°,
each log dropping into the notches of the two below it; walls rise half a
log per course; ends overhang the crossing. Nothing ever stacks parallel.

**Pieces.** A felled tree gives a **long log** (two bays) and a **short log**
(one bay). With a stone hand axe in one hand, **long-press a log** for:

- **Notch it** — three notches on a long log, two on a short: the blocks.
- **Cut in half** — a long log into two short.
- **Cut into timber** — squared quarter-logs, in the two log lengths: long
  timber for roofs and floors, short for furniture.
- **Cut into stubs** — a short notched log into two stubs: a portable notch
  to end a wall on without a wall sticking out at 90°.

Working a log **spawns wood chips**, kindling for the fire (§6, 1.1). Every
operation leaves something physical behind that answers another need.

Later pieces from the box: the half-length (one-notch) log that frames
doors and windows; the half-round that levels a wall's top; gable ends and
a ridge; door and window frames of timber; a chimney — of rocks, where the
hearth goes; fences and rails.

**Blueprints (as built, 1.0c).** Building is by blueprint, not by fitting
notches by hand (designer, after 1.0b: freeform notch-fitting on a phone is
fiddling; modules a thumb can site are a building system). A blueprint is a
known structure or a module of one, as data: its pieces and where each sits
in the site's frame. Long-press any building material (a log of any kind,
timber, a stick) → **Blueprints…** → a menu with a plan drawing, arrows to
cycle, what it needs, a checkbox to keep the needs in the HUD, and *Build
here*. The pressed material becomes the site: a luminous ring on the
ground, sized to hold the ingredients loosely piled, and a translucent ghost
of what will stand there, open front toward you. Haul the ingredients
inside the ring and it turns green. Tap inside to lock in: the board plays
the site, and each match flies one ingredient from the pile into its place
in the ghost, costing vitality like any work. Back out and the site keeps
its progress.

Long-press a *built* structure for the blueprints that add to it (they take
its frame: on top of its walls, or inside on its floor) and for **Take
apart** — the same session backwards: each match lifts the last piece off
onto a pile out the front. Nothing is permanent.

The first blueprint set, the cabin: a **cabin course** (three long notched
logs in a U, two bays each way, open toward you), **another course** on top,
a **door wall course** (a stub as a portable notch and a short notched log
on it, leaving the doorway), a **slat roof** (eight long timbers across the
side walls), a **timber floor** (seven long timbers inside), and a **bed**
(two short timbers and a hand of sticks, inside). Wall logs block you; rain
stops at the slats and comes through the gaps until the roof is whole; the
rain sheet is off under it; sleep in the bed reaches full vitality. Cost, at
one long and one short log per tree: about thirteen trees — a third of the
thicket, which is also how the vista opens.

---

### 5.5 Openings and the fire (as built, 1.1)

**Cutting a doorway.** A second U beside the first makes an enclosed room,
so walls open: with the hand axe in hand, long-press a wall log → *Cut a
doorway here*. Each match cuts one course through: the middle of the log
comes out as a **knuckle** (the short single-notched piece; also what "Cut
into knuckles" makes from a notched short log) and two **half logs** stay
either side, each keeping its outer notch. Nothing else is spent.

**The campfire.** A blueprint like any other: two knuckles crossed, four
sticks stood against each other over them, five wood shavings in the
middle. Long-press it → *Light it*: a board session with no ingredients —
five sparks and it catches. Lit, it is a light (a flickering point light
and flames) that dwindles as its fuel burns down: a fresh lighting is two
and a half minutes; drag shavings, sticks or a knuckle onto it to feed it.
Out, it is embers; light it again. Light only for now — cooking is wheat
popping on it (§3).

## 6. The underworld: the metallurgist (as built, U0)

A second character with his own stat, in a place where the plateau's
rules invert: no weather, no day, no food yet — heat instead of harvest.

- **Energy, not vitality.** One stat, but it never collapses him and never
  blinds him: it has a floor (ENERGY_MIN). Every heat match and every hop
  drains it; a still hold restores a step. What it scales: movement speed
  (slower at the floor), the movement fan's reach (shorter), the
  darksight's distance (fog closes in) and the width of his vision (a
  tunnel — the centre stays clear). Non-magical darkness and fatigue are
  never blindness for him.
- **Ore, not trees.** Rock that bears ore shows it as shining veins. Only
  ore-bearing rock answers the board: each match superheats the veins,
  gold to white; at the boulder's HP the rock vaporizes, molten metal pools
  where it stood, cools, and sets into an ingot. Bare rock is immune — the
  chamber's walls are the first confinement he cannot burn through.
- **Ingots are the material.** Long-press an ingot for its blueprints; the
  first is a dagger (one ingot). Long-press a dagger to melt it back into
  an ingot by the board. Nothing is lost in the loop; heat is the cost.
- **The weight rule holds.** An ingot lifts with one hand; a dagger too.
  Piles of ingots are the stored potential, as logs are above.
- **Food down here is found, not grown (U1).** Haunches of meat and baked
  potatoes on the tables in the second chamber, eaten as popcorn is. They
  are more potent than anything on the plateau: a bigger boost and a
  stronger, longer slowing of every drain. Each food carries its own factor
  (`nourishDrain`); a stronger food takes over a weaker one's nourishment,
  a weaker one only extends it. Who laid the table is an open question.
- **The suit (U2).** His constructions are magical: he imparts energy into
  a piece as he puts it on, and the piece sustains its effect no matter how
  low he runs; the energy flows back when it comes off. The chestpiece is
  the attachment point and powers the rest — nothing else can be worn
  without it, and taking it off takes everything off. The helm sustains
  darksight (reach, light and the tunnel held open). To come: legs sustain
  walk distance; gauntlet / arm / pauldrons sustain carrying. Pieces are
  made at a forge ring from ingots and are worn, not carried.
- **The greblins (U3).** The miners whose vein he woke in. They fear him:
  still in the dark, they bolt from his light along the walls to a corner
  it doesn't reach, and again when it finds them. They never block him
  and never come at him. What else they are for is the next part.

## 7. Open questions (deliberately unresolved)

- Exact vitality drain per action and per hop; how fast time drains it.
- Whether collapse restoring less is a curve or steps; how eating resets it.
- Whether sleep raises the ceiling or slows the drain (§4).
- The eating gesture.
- Whether tired-vision glow should be a post-process (correct, costlier) or
  material emissives keyed to vitality (cheap, good enough for the lichen).
- Whether long-press conflicts with the existing tap-to-lock on trees and
  patches (probably not: those are taps; long-press is a hold in place on
  an object — the same distinction the movement fan already uses).
- How many recipe menus a phone screen can carry before it is a menu game.
- Underworld: whether ore comes in the five colours (five metals), what
  the dagger's first use is, and how the darksight and the plateau's two
  vision regimes relate when the characters meet.
