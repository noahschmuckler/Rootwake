# Rootwake — design notes (prototype phase)

## Origin

This project spun out of a design conversation about DiggyDwarves' overworld
(the match-3 gather/craft/build metagame — see that repo's `CLAUDE.md` and
`GAME_DESIGN.md`). The designer wants to explore something the current
2D/Phaser overworld can't easily deliver: a real sense of **claustrophobic
confinement releasing into vast, open vistas**, in 3D, as both a mechanical
and cosmological throughline. Rather than trying to wire that into the
existing engine, this is a **separate game, separate repo, separate stack**
(Three.js instead of Phaser) — deliberately decoupled so it can be prototyped
and judged on its own merits before any commitment to build the whole thing.

**This repo is a feel-test first, a game second.** The immediate goal is
narrow: build the smallest possible slice that answers one question (see
"MVP scope" below) before investing in anything larger.

## The cosmology / structural throughline

- Confinement → vista is not just a level-design beat, it's meant to be
  *the* recurring emotional shape of the game, mechanically reinforced at
  every scale: a tight tunnel opening into a lit cavern; a confined starting
  enclosure opening onto a visible landscape; a single karst/world giving way
  to the wider cosmos.
- **Zoom is discrete phases, not a continuous camera zoom** (Spore's model,
  not No Man's Sky's). Each phase transition IS a confinement→vista beat,
  not just a scale change — the structure and the theme are the same thing.
- Seven playable characters (mirroring DiggyDwarves' seven dwarves), each
  aligned to a domain, each **awakens confined by their own domain's
  material** and must free themselves using a domain-specific version of the
  same underlying verb (clear/untangle a mass of your element into open
  space + resources). Domains sketched so far:
  - **Plant/nature-aligned (Earth Mother)** — awakens enclosed in dense,
    Eden-like plant growth. **This is the character being prototyped.**
  - **Book/knowledge-aligned** — awakens buried in a disorganized library;
    the untangle verb is matching/organizing symbols into folios.
  - **Ore/metallurgy-aligned** — awakens underground surrounded by ore/
    crystal; the untangle verb is matching ore to weaken and collapse rock
    into resources.
  - (The remaining four are unsketched.)

## Reference games (what to borrow, not clone)

- **Subnautica** — the closest overall emotional reference: a tiny confined
  starting point, vertical dread (dark, tight, pressing-in depths) played
  against relief (open ocean surface, sky), and a map/scanner you unlock
  piece by piece rather than getting up front.
- **Deep Rock Galactic** — the specific "dank tunnel opens into a huge
  glowing cavern" beat, plus it's literally dwarves mining.
- **Descent (1995) / Metroid Prime** — the unlockable **3D map of explored
  territory** you build as you go, rather than a given map.
- **Spore** — the structural model for zoom-as-discrete-phases: each phase
  is a genuinely different game (different camera, different verbs) unified
  by one persisted identity and one direction of travel (small → large).
- **Fez / Tetris Effect** — how to keep a matching mechanic legible once
  it's embedded in a 3D world: keep the *puzzle logic* on a flat, readable
  plane; let the *camera and world* carry the sense of dimensionality. This
  is the direct precedent for "lock the camera to one cube face to play the
  match."
- **Kula World / Marble Blast** — walking-on-the-surface-of-a-cube
  precedent, for movement feel only (not matching logic).
- **Book of Hours** (Weather Factory) — closest existing analog for the
  library character's "organize a chaotic collection" verb.

## The core mechanical decision

The match-3 DNA is preserved by keeping the **interaction plane fixed**:
movement through the world is free 3D (walk, orbit, jump around voxels),
but selecting a voxel's face locks the camera to a fixed, flat framing of
that face for the actual matching interaction. The game never tries to
solve true 3D match logic — matching is always 2D-legible on whichever
plane is currently faced, exactly like Fez keeps its puzzle logic flat while
rotating which flat plane you're looking at.

## The plant voxel (first character, first mechanic)

- A cube. A **trunk** rises from the ground to the cube's middle. From the
  trunk, **5 branches** twist through 3D space, one to each of the 5
  exposed faces (the 6th face rests on the ground), each terminating in a
  **flower**.
- All 6 faces render identically — **this is a render symmetry, not
  independent state.** There is exactly ONE abstract flower-set (5 tip
  positions × assigned colors) driving every visible copy. Selecting/
  clearing operates on that one abstract model; all 6 renders just mirror
  it. Don't build 6 independent puzzle instances that happen to start equal
  — build one state model and 6 views onto it.
- Approach a voxel (free 3D movement/orbit/jump), select an exposed face →
  camera tweens to a locked, fixed framing of that face.
- In the locked view: tap flowers to toggle-select; on the 3rd same-color
  selection, those three flowers close and their vines recede into the
  trunk — mirrored simultaneously across every face's copy, which is free
  once the state model above is right (all 6 copies were already showing
  the same state; they just all animate the same transition at once).

### Open design questions (deliberately unresolved — decide during build, not before)

1. **Regrowth.** Does a cleared branch regrow a new flower over time
   (a renewable resource node), or is each voxel a one-shot (5 flowers,
   clear what matches, done)? **Build one-shot first** — regrowth is a
   separate system layered on top later, not needed to test the core feel.
2. **Color distribution.** 5 tips, match requires exactly 3 same-color: a
   naive random assignment can produce a dead cube with zero valid matches
   (e.g. a 2/2/1 split across 3 colors). Needs a **deterministic assignment
   that guarantees at least one clearable triple** — the same guarantee the
   original DiggyDwarves match-3 board makes for valid moves. Don't ship
   pure `Math.random()` per tip.

### The recede animation — the actual thing this prototype is testing

Nobody can pre-visualize this accurately; it's the one piece worth building
before anything else, and worth spending real iteration time on once it's
running.

- **Build this first (cheap version):** leave the branch's tube geometry
  untouched. Animate the flower mesh itself sliding backward along its
  curve (`curve.getPointAt(t)`, t: 1 → 0) while scaling to zero — the
  illusion of being pulled home into the trunk, without needing to deform
  any geometry.
- **Only build this if the cheap version feels flat:** actually shrink the
  *rendered length* of the branch from tip to root — rebuild
  `TubeGeometry` off a progressively truncated curve each frame, or drive a
  shader with an arc-length cutoff uniform. More expensive to build and to
  render; don't reach for it first.
- **Choreography:** a slight stagger between the three flowers (one leads,
  the other two follow ~80–100ms behind) reads more alive than all three
  popping in unison — same intuition as the staggered-token-flight timing
  DiggyDwarves already tunes for its own match-3 clears.

## MVP scope — Pass 0 (build this, and only this, first)

**In scope:**
- One hardcoded voxel face. Boot **straight into the already-locked
  single-face puzzle view** — no walkable field, no approach/lock-camera
  transition yet. That loop is a separate, cheaper-to-validate risk (see
  Pass 0.1) and shouldn't gate the actual unknown.
- 5 **hand-authored** (not procedural) branch curves ending in flowers.
  Simple primitive meshes are fine for flowers/trunk for now — no need for
  real models yet. Procedural organic branch generation that still reads
  clearly at a fixed camera angle is a much harder problem; don't attempt
  it until the hand-authored version has proven the interaction is worth
  the investment.
- Deterministic color assignment guaranteeing ≥1 valid triple exists.
- Click/tap-to-select, 3-same-color match, staggered recede (the cheap
  animation approach above).
- One-shot only (no regrowth).

**Explicitly out of scope for Pass 0** (deferred to Pass 0.1 or later):
- Walkable field, first/third-person movement, the approach-and-lock camera
  transition.
- The 6-face mirror — validate the single-face feel first; the mirror is
  cheap to add once the state model is right, but adds nothing to the
  feel-test itself.
- Procedural branch generation.
- Resource payout / economy hookup.
- Any of the other six characters/domains.
- Regrowth.

**Stop and evaluate after Pass 0** before touching anything else. If the
selection/recede doesn't feel satisfying in isolation, no amount of
wrapping (movement, camera transitions, mirrored faces) will save it — and
that's worth finding out as cheaply as possible.

## Pass 0.1 (only after Pass 0's feel is validated)

Wrap Pass 0 with: a walkable field, approaching a voxel in free 3D, clicking
an exposed face to lock the camera onto it (and a way back out), and the
6-face simultaneous mirror. This confirms the "object in space → locked
puzzle" transition doesn't feel jarring — a real but separate risk from the
clearing mechanic itself.

## The pivot: the real match-3 board returns, rendered in 3D (2026-09-04)

Pass 0/0.1a/0.2 all validated (see Status) — the tap-a-flower interaction
works, the camera lock/unlock transition works, and the confinement→vista
payoff itself reads as intended. With the core feel-tests answered, the
designer's first big build-out direction: bring back DiggyDwarves' actual
match-3 board (swap-to-match, falling/cascading gems) as the way you
interact with a voxel, rendered as a physical object inside the 3D scene
rather than a 2D overlay — so a match can visibly fire a projectile that
flies through the 3D world and strikes its target. Direct tap-a-flower
interaction is retired in favor of this for the plant voxel; the recede/
resolve animations built for it stay exactly as-is as the *payoff* rendering,
just now triggered by the board instead of by taps.

### The board is real 3D geometry, not a texture

Build the board from actual small 3D gem meshes arranged in a grid, parented
to one `Object3D` positioned and tilted in world space in front of the
player — **not** a 2D canvas/CSS texture painted onto a flat plane. Three
reasons, all load-bearing:

- The "trapezoid" look the designer wants from viewing an angled board is
  what perspective projection does to a flat grid of objects for free — no
  skew/warp code needed.
- Transparency to see the target through the board is also free: don't put
  an opaque backing panel behind the gems, and gaps between/around them show
  the 3D scene naturally, correctly depth-sorted against everything else (a
  textured overlay plane can't depth-composite against individual 3D objects
  the same way).
- **This reuses the exact interaction pattern already built and proven**:
  raycasting taps against positioned 3D meshes within a locked camera
  framing is precisely what `rig.ts`/`puzzle.ts` already do for the 5 flower
  tips. Swapping the board in is "raycast against a grid of gems instead of
  5 tips, add gravity/cascade," not new input plumbing.

Port a **minimal** match-3 core (grid, swap, run-detection, cascade/gravity,
score) as pure, Phaser-free TypeScript modeled on DiggyDwarves' proven
algorithm — not the whole `Match3Scene`. No specials, no combos, no tool
durability, no craft economy in this pass. Same "smallest slice" discipline
as every prior pass.

### Targeting: gem color ↔ flower identity, per-flower HP pools

**Confirmed by the designer:** each flower has its own HP pool (20% of the
voxel's total each); matches feed a *specific* flower's pool, not one shared
counter that recedes flowers in a fixed order. Whichever pool fills first
recedes first — order is emergent, not scripted. Defeating all 5 flowers
triggers the existing whole-voxel `resolve.ts` beat completely unchanged.

For this pass, the mapping is **gem color = flower identity, 1:1** — there
are exactly 5 gem types in DiggyDwarves' board and exactly 5 flowers, so a
match of color N feeds flower N's pool directly. No column-position logic
needed here. (Combat, later, will need **column-bucket** targeting instead,
since an enemy arc won't reliably have exactly 5 members — implement
targeting as a small swappable strategy — `byColor` now, `byColumn` later —
rather than hardcoding the color mapping somewhere it'll have to be ripped
out.) Each match also fires a small projectile from its gem toward its
target flower — visual only for now, no new gameplay rule beyond feeding the
pool.

### Movement: replace the joystick with a waypoint arc

The designer's second half of this pivot: the free joystick (Pass 0.2)
fights a game that's fundamentally about precise positioning to interact
with puzzles, and doesn't suit turn-based play. Replace it with **VR-style
teleport-arc movement**: press-hold on the movement side of the screen shows
a fan of candidate tile markers arcing out ahead of the player; release
tweens a smooth move to the chosen point. Right-side drag still free-looks,
unchanged.

Implement the candidate points as **continuous positions at fixed distances/
angles ahead of the player, filtered by the existing collision/walkability
check** — not a retrofit onto a formal square grid. The thicket's layout is
organic (a hex ring at varying distances), so a rigid grid would fight the
world rather than fit it. This is the same tween machinery `cameraLock.ts`
already uses for the lock-in/back-out transitions, applied to player
position instead of camera framing.

This also resolves a movement fork DiggyDwarves' own design notes left open
(`GAME_DESIGN.md`, "the wide top field — overland conventions": "(b)
Baldur's-Gate convention — select move, choose a path... energy/fatigue
bounds travel distance per turn") — same idea, now actually built, in 3D.
It also echoes a pattern already proven once in the 2D game (the Underdelve's
🎯 path-mode: tap a tile, auto-walk there, one input = one turn).

**Turn structure, as currently understood:** movement (waypoint select →
commit) is the turn-consuming action; matching plays out in real time as its
own self-contained interaction once locked onto a board. Nothing currently
acts *between* your matches (no enemies yet), so this doesn't need to be
fully resolved this pass — revisit when combat/enemies exist.

### Pass 0.3 scope

**Pass 0.3a — the 3D match-3 board, retrofit onto the existing plant
voxel.** Minimal match-3 core (no specials/combos/tools) rendered as tilted,
semi-transparent 3D gem meshes in the already-locked voxel view (the lock/
back-out toggle itself is unchanged — puzzle state already survives backing
out). Color→flower targeting as above; matches fire a projectile toward
their target flower; a flower recedes when its pool fills (reusing the
existing recede animation from `recede.ts` unchanged); all 5 defeated
triggers the existing `resolve.ts` beat unchanged.

**Pass 0.3b — waypoint movement**, replacing the joystick in `player.ts`:
press-hold shows a fan of candidate tile markers (filtered by existing
collision), release commits a tweened move; right-side look-drag unchanged.

Build and evaluate these as **two separate commits** even though they're
going in together — if the combined result feels off, that keeps the two
signals (does the 3D board feel good vs. does waypoint movement feel good)
separable instead of confounded.

**Explicitly not this pass:** combat/enemy-arc lane mapping, abilities/
charge mechanics, mid-combat repositioning or AoE effects (design the
targeting-strategy abstraction to be ready for these later, don't build them
now), match-3 specials/combos, and the other six characters.

## Pass 0.4 — ground, not just trees (2026-09-04)

Both halves of Pass 0.3 landed. Direction for this pass, per the designer:
move the thicket closer to what the shipped game's confinement actually
looks like, and add a second interactable — tillable ground — alongside the
plant voxels.

### The enclosure: density, not a wall

Pass 0.2's hedge-wall-and-canopy (`world.ts`: `ENCLOSURE_RADIUS`,
`WALL_HEIGHT`, `CANOPY_HEIGHT`, the dark ring geometry) was scaffolding to
get *a* confined pocket built fast — a stand-in, not the real thing. Retire
it. The confinement should come from **the trees themselves being dense
enough to block sightlines**, not from separate non-interactive boundary
geometry: the starting area should read as roughly **three voxels thick**
in every blocked direction before open ground appears, with the one
existing opening (toward the vista) kept clear as before. This almost
certainly means more voxel instances than the current 8, arranged so their
own foliage does the enclosing work the hedge/canopy used to fake. Ground
material also changes: mostly **grey coarse rock** (untillable), which the
tillable grass patches (below) interrupt.

### Ground tilling — the second interactable

DiggyDwarves' own dig-the-soil verb, brought over: patches of ground are
**tillable** (rendered as fuzzy green grass) among **untillable** ground
(grey coarse rock). Patches sit at roughly grid-like world positions —
authored placement that *reads* as a grid, not a retrofit of the world onto
a real tile-grid data structure (the world stays the continuous-position
model the waypoint movement already relies on).

- **Tap a patch** → the camera tweens into a locked, **looking-down**
  framing of it (a new orientation for the existing `cameraLock.ts`
  machinery, not new tweening code — today's lock only frames a vertical
  cube face), positioned so the match-3 board sits over the patch while
  most of the grass remains visible around/behind it, same transparency
  principle as the voxel board.
- **One shared HP pool per patch** — every match feeds it regardless of
  gem color, unlike the flowers' five independent per-color pools. This is
  a new `targeting.ts` strategy (a third alongside `byColor`/`byColumn`):
  every run feeds the single target, no color/column logic needed.
  `board3d.ts`/`match3.ts`/`projectiles.ts` are otherwise reused as-is —
  matches still fire a projectile at the patch.
- **Visual staging, discrete steps at HP thresholds** — mirror
  DiggyDwarves' own 4-phase grass system directly (bare → sparse → patchy
  → full grass), just run in reverse: full fuzzy/spiky green grass at full
  HP, stepping down through a couple of intermediate stages, ending at
  fluffy brown clods at zero. Swap between a small set of authored
  materials/meshes at thresholds — not a continuous shader LERP; the
  discrete-phase approach is proven and cheap to build.
- **A depleted patch doesn't vanish or resolve** — it's ground, not an
  obstacle; once tilled it settles into its final clods look and simply
  stops accepting more taps (one-shot, no regrowth — same convention as
  voxels). No `resolve.ts`-style beat needed; there's nothing to remove.
- **Patches never block movement**, before or after tilling — they're
  floor. Tilling is an optional action you walk up to, not a path gate
  (the opposite of voxels, which DO block until resolved).

### Scope, split into two builds (same reason as 0.3a/0.3b — isolate the signals)

**0.4a — the enclosure rework.** Remove the hedge/canopy geometry; redesign
voxel placement so density (roughly three-thick) does the confining in
every blocked direction, opening kept clear; reskin the ground to grey rock
as the base material. Layout/art only — no new interaction.

**0.4b — ground tilling.** The tappable grass patches: the look-down camera
lock variant, the shared-pool targeting strategy, the board wired to it,
and the discrete grass→clods staging. Depends on 0.4a's ground reskin
existing to place patches against, but is otherwise a separate system from
the enclosure layout.

**Explicitly not this pass:** patch tilling paying out any resource (no
economy hookup exists yet — same deferral as the whole prototype so far),
regrowth, more than one tree-voxel-equivalent species, art fidelity beyond
"reads as grass vs. rock."

## Pass 0.4c — tree targeting simplification (2026-09-04)

A small, independent tweak to the trees built in 0.4a, queued alongside
0.5 below but separable from it (its own commit). Collapse a tree from its
current **five independent per-color pools down to one shared pool** —
reusing the `single` targeting strategy already built for ground patches
(`targeting.ts`) instead of `byColor`. All **four side faces** become
lockable and show the same live state (the `Interactable.lockTargets`
array + `lockedPoseFor`'s per-normal framing already support locking from
whichever face was approached — this is mostly about populating
`lockTargets` with all four side hit-regions instead of one, and swapping
the targeting strategy). The 5 flowers keep their existing rig and
`recede.ts` animation, but recede in **stages as the one shared pool
crosses thresholds** (20% per flower) rather than each needing its own gem
color. Once the shared pool fills, the tree resolves via the unchanged
`resolve.ts`, from whichever side the player happened to be locked into —
"clearing any one side clears the tree" falls out naturally once there's
only one pool to clear. Top and bottom faces stay as they are (not part of
this — "four sides" was specific).

## Pass 0.5 — the first vista: a cliff edge, not open ground (2026-09-05)

Redirected from a broader "vastness = big walkable acreage" framing after
designer pushback: the acres-scale buildable home-base ground (farm
fields, crafting machinery, a walkable multi-floor building system) is
real and coming, but it's its own future phase, not this one — building it
now would mean guessing at scale before the actual emotional beat (a vista
moment, not walkable square footage) is validated. **This pass tests one
specific moment:** reaching the edge of the mountain peak and seeing a
vast, inaccessible landscape — distant hills and forests reaching to the
horizon, thousands of feet below — gated by a dropoff steep enough that
falling isn't possible, but standing at it should feel dizzying.

**Why this is cheaper than it sounds:** the distant landscape is
explicitly *not yet accessible* — the player never walks there, so none of
it needs to be real, walkable, textured terrain. This is the classic
distant-vista technique (correct from one vantage, not built to withstand
scrutiny up close), and the codebase already has the seed of it: the
existing pale-hill-spheres-plus-fog vista beyond the thicket's one opening
(`world.ts`) is this exact pattern, just small and at eye level. This pass
scales that idea up and moves it to a cliff edge instead of a gap in a
hedge.

**Four pieces:**

1. **A modest plateau, not full acreage.** Extend the walkable ground just
   enough to get from the tree cluster to a cliff edge — the same cheap
   rock-pattern ground `0.4a` already uses. The full acres-scale buildable
   plateau is a later phase; this doesn't need to be it.
2. **The edge is a hard movement boundary, not a physics hazard.** Extend
   whatever collision/walkability check the waypoint movement (0.3b)
   already filters candidate points through, so it refuses any step across
   the edge. No fall state, no new movement system.
3. **The vista, viewed from height and looking both out and down**, not
   through a narrow gap at eye level: layered distant hill/mountain
   silhouettes at varying distances (more of them, bigger, further apart
   than the existing thicket vista, for parallax as the player walks the
   edge), a broad color band suggesting forest without tree geometry that
   far out, and fog/aerial-perspective doing the desaturate-with-distance
   work `THREE.Fog` already does. Looking straight down over the edge
   should show cliff-face detail near the top fading through haze into a
   long apparent drop before the distant landscape resumes far below — the
   drop needs to read as height, not just "the ground stops and there's
   fog."
4. **Vertigo is a rendering/calibration problem, not a new mechanic.**
   Look-drag already lets the camera pitch down; the work is entirely in
   making what's rendered when it does convincing at real scale. A subtle
   FOV widen or camera dip right at the edge is a cheap nice-to-have if
   it's easy — not required for this pass to answer its question.

**Explicitly not this pass:** the acres-scale buildable plateau, the
building system (walls/windows/roofs/floors/furniture, walkable multi-story
interiors), crafting machinery, mining, extending the interactive tilling
system from 0.4b to any new ground. None of those are needed to find out
whether this one moment — reaching an edge and seeing an inaccessible world
spread out below — lands.

## Pass 0.6 — weight: hands, felled trees, and land you have to clear (2026-09-05)

Passes 0 through 0.5 validated moments. 0.6 is the first loop test, and it
lands a second standing rule alongside confinement→vista: **objects have
weight.** No bag of holding. Clearing the fiftieth tree does not put fifty
"wood" in a list; it drops one log where the tree stood, and the log is in
the way until someone moves it. This is the major pivot from DiggyDwarves,
whose bag/cloth crafting was designed and never mattered because carrying
was infinite. The sourdough loop there — a real process, in a place, over
time — is the model for how everything should feel.

### The rule: mass, strength, hands

Every object type has a **size class** (how it fills a hand: `tiny` 20 per
hand, `small` 5 per hand, `large` 1 per hand) and a **mass**. The character
has a **strength**. Two numbers and one stat decide every physical
interaction:

- hands to **lift** = ceil(mass / strength); hands to **drag** = half that.
- stackables (tiny/small) have negligible mass.
- with strength 1 and two hands: a morningstar (mass 2) lifts two-handed and
  drags one-handed; a log (mass 4) cannot be lifted but drags with two
  hands; a boulder (mass 8) cannot be moved. At strength 4 the same table
  says the log swings one-handed like a bat, the boulder lifts and throws,
  morningstars dual-wield. Nothing is authored per object.
- **strength is where fatigue and food land later** (DiggyDwarves' fatigue
  finally means something: a tired character gets physically weak, one fed
  on good food gets stronger than average). Not built this pass; strength
  is a constant 1 that already goes through the formula.

### Hands: the UI and the one gesture

Two boxes at the top of the screen are the hands. **One gesture does
everything: drag from a hand box to a thing.** From an empty hand it takes
(sticks fly up into the box, shrunk and numbered; a handful of seeds is the
cluster within arm's reach). From a full hand it places or uses (onto the
ground: drop there; onto something: interact). Tap a full box to drop at
your feet. Dragging a hand to a log forms a **constant luminescent linkage**
from the nearest point on the log to the box; a drag-2 object needs both
hands linked — one hand shows strain and refuses to move. While dragging,
hops are shorter and slower. Objects never block movement; they block
*tilling*.

### The tree ending

Foliage releases (the flowers recede as before, the greenery dissolves),
then the **trunk topples toward the side you worked it from and lands with
a weighty thud** — camera shake, dust. Branches and seeds break off around
it. Where the tree stood a **footprint patch** appears, blocked until the
log is dragged off and the sticks carried away; then it is tillable. The
0.2 sink-into-ground beat stays in the code behind a constant for A/B.

### Scope

- **0.6a** — the felled-tree ending, spawned objects (log, sticks, seeds)
  with the size/mass table, the blocked footprint patch. Layout of the
  loop, no hands yet.
- **0.6b** — hands: the two boxes, hand-to-thing, stacks, the two-hand log
  drag with linkage, drop/place, footprint clearing → tillable.
- **0.6c** (scoped, not yet built) — the first recipe weight motivates:
  sticks → cord → a bag (a third hand) or a sledge for logs; seeds onto a
  tilled patch to plant. Then fatigue/food onto strength.

**Explicitly not this pass:** planting and growth, any recipe, payout
counters, fatigue/food, combat use of held objects, physics.

## Status

Repo scaffolded 2026-09-03. Passes 0 through 0.5 built and confirmed on phone
playtests (0.4c and 0.5 judged good). **Pass 0.6a (the felled tree, objects,
blocked footprints) and 0.6b (hands) built 2026-09-05 as two separate
commits, awaiting evaluation. 0.6c (first recipe, planting) is scoped, not
built.**

What 0.6 adds: see "Pass 0.6 — weight" above. In play: a cleared tree
topples toward you with a thud and leaves a log, three sticks and twelve
seeds on a blocked footprint. Drag a hand box to seeds or sticks to gather
them; drag both hands to the log to drag it off (hops shorten and slow);
once the log and sticks are off the footprint the grass appears and it
tills like any patch. Tap a box to drop at your feet; drag a full box to the
ground to place there.

**Next step is evaluation, not code — the first loop test:** does clearing
a tree, hauling what it leaves, and getting tillable ground for it feel
like accomplishment or chore? Watch especially the log drag (rope, hop
length) and whether three sticks + twelve seeds is the right amount of
stuff per tree.

What 0.4c adds: a tree has one shared pool (`single` strategy, capacity
40); its five flowers recede in stages at 20% thresholds on all four side
faces at once; the tree resolves from whichever side is locked. The rig
instances its hand-authored branches per side face around a shared trunk
and foliage core.

What 0.5 adds: the plateau ends at a curving cliff line ~24 units past the
start. A faceted, ledged cliff face drops 400 units into haze; far below, a
forest carpet, a river and three layers of mountain silhouettes fade with
exponential fog into a gradient sky. The waypoint fan refuses any point
past the lip (no fall state). Near the lip the FOV widens a little and the
eye dips. The old pale hills are gone.

**Next step is evaluation, not code — two separable questions:** does one
shared pool with staged recedes still feel like clearing a tree (0.4c), and
does reaching the lip and looking out and down land as vertigo and vastness
(0.5)? Still out of scope: the buildable plateau, building/crafting/mining,
tilling on new ground, payout, regrowth, combat, specials, other characters,
art fidelity.

What 0.4 adds:
- **0.4a, the enclosure.** Hedge wall and canopy are gone. 32 voxels on a
  hex lattice (spacing 2.45) three rings deep around the start, faces toward
  the start, so every direction is about three voxels thick before open
  ground; a 70° sector toward +X is cleared in rings 2–3 with the staggered
  pair standing in it as before. Ground is grey coarse rock (displaced,
  flat-shaded). Rig geometry is merged per part so the count stays cheap on
  a phone.
- **0.4b, tilling.** Nine grass patches at grid-like positions (one under
  your feet, one in the corridor, seven on the open rock). Tap one within
  reach: the camera locks looking down (`lookDownPoseFor`), the board sits
  over it, every match feeds one shared pool (`single` strategy, capacity
  12). The look steps through four authored stages at thresholds — full
  grass, patchy, sparse with clods, brown clods. Tilled patches keep their
  clods, refuse taps, never collide, never resolve. No payout.

What 0.3 adds:
- **0.3a, the board.** A minimal match-3 core (`match3.ts`: seeded deal,
  adjacent swap that reverts without a run, run detection, gravity,
  cascade, re-deal when stuck; no specials/combos/tools) rendered as 3D gem
  meshes (`board3d.ts`) parented to the camera — ahead, below centre,
  tilted, fit to the viewport by width and height, semi-transparent, no
  backing panel. Tap a gem then a neighbour to swap. Each run fires a shot
  (`projectiles.ts`) at the flower of its colour; the hit feeds that
  flower's own pool (`POOL_CAPACITY` 9 gems, five independent pools). A
  full pool recedes its flower with the unchanged `recede.ts`; five receded
  flowers start the unchanged `resolve.ts` beat. Colour→flower is a
  swappable strategy (`targeting.ts`: `byColor` now, `byColumn` sketched
  for combat). Tap-a-flower and `puzzle.ts` are retired.
- **0.3b, waypoint movement.** Hold on the left of the screen: a fan of
  ground-ring markers appears ahead (three distances, five angles scaled
  to the camera's horizontal FOV), filtered by the existing collision plus
  a straight-path check; slide to one, release, and the player tweens
  there. Look-drag unchanged. The joystick is gone.

Controls: hold-left to pick a spot and release to hop, drag to look, tap a
voxel within reach to lock, tap gem + neighbour to swap, "Back out" button,
`R` new seed, `?seed=N`, `?slowmo=N` (recede, resolve, shots, camera
tweens). Tuning constants sit at the top of each module.

**Next step is evaluation, not code, and there are two separable
questions:** does the 3D board feel good to play in the locked view (0.3a),
and does hopping between waypoints feel good in the thicket (0.3b)? Judge
them one at a time. Still out of scope: combat and enemy targeting,
abilities, specials/combos, the 6-face mirror, other characters, art.

What 0.2 adds:
- **Whole-voxel resolve.** A 5-flower one-shot voxel could never fully
  clear (two flowers always stranded, trunk stays an obstacle). Now, once
  the one triple has receded, the whole voxel resolves: a short hold, the
  stragglers recede, then the entire growth twists and sinks into the
  ground behind a ground ring, rising sparks and a light flash. Resolved
  voxels stop blocking sight and movement.
- **First-person touch movement** (left-thumb joystick, drag to look, WASD
  on desktop). First person rather than the 0.1a orbit because the thicket
  is tight enough that a third-person camera would live inside neighbours.
- **The thicket.** Eight voxels: a hex ring of six around a dark start
  pocket, faces turned inward, plus two staggered behind the +X ring voxel
  with a 0.4-unit slit between them. Dense dark foliage inside each cube so
  it actually blocks sightlines. A dark hedge wall and canopy enclose the
  pocket except for a ~45° opening at +X onto a bright hazy plain with pale
  hills. Clearing the +X ring voxel shows the outer pair and a slit of
  light; clearing one of those opens the way out.
- Locking on requires being within reach. In the locked view the
  neighbours the camera is inside or looking past fade out; what is behind
  the face stays, so the vista is not given away by the puzzle view. After
  a locked voxel resolves the camera holds ~450ms on the empty spot, then
  backs out on its own.

Controls: left thumb / WASD to walk, drag to look, tap a voxel within reach
to lock, tap flowers, "Back out" button, `R` new seed, `?seed=N`,
`?slowmo=N` (recede, resolve and camera tweens). Tuning constants sit at the
top of `resolve.ts`, `player.ts`, `world.ts`, `cameraLock.ts`, `recede.ts`
and the layout block in `main.ts`.

**Next step is evaluation, not code — and the question is emotional:** does
resolving voxels and walking into the opened gap feel like escaping
confinement into a vista, not merely "clearing opened a path"? Still out of
scope until that call: the 6-face mirror, a real field, other characters,
environment art.
