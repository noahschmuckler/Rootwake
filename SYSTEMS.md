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
  goes, depends on shelter (§4).
- **Collapse.** When vitality hits the floor you collapse and wake still
  tired. **Each collapse without eating in between restores less.** You are
  never dead. At the extreme you can only look around, move once, and
  collapse again — the game keeps you alive and makes the need for food
  unmistakable.

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

### 5.4 Shaping logs: log-cabin construction

With a stone hand axe in one hand, **long-press a log** for a menu of
modified logs:

- a fitting **notch at one end, one side**;
- notches at **both ends, both sides**;
- an **offset cut** to stabilise two logs set end to end for longer walls;
- **cut into timber**, for building pieces and for fire.

Working a log this way **spawns wood chips**, suitable for kindling. Every
operation leaves something physical behind that answers another need
(chips → kindling → fire → cooking and light).

Fitted logs stack into walls log-cabin style; timber makes roof pieces
(§4). The pieces are objects with weight: a wall segment is placed by
dragging the shaped log to where it goes, and it stays heavy.

---

## 6. Open questions (deliberately unresolved)

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
