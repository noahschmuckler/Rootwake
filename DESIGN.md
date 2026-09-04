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

## Status

Repo scaffolded 2026-09-03. Pass 0 (matching + recede) and Pass 0.1a (orbit
→ locked puzzle → back out) both built the same day and landed well on phone
playtests. **Pass 0.2 — the confinement→vista thicket test — built and
confirmed 2026-09-04**: played great on a real phone playtest, the
confinement-to-release arc read as satisfying even with the deliberately
trivial 1-of-5-flowers puzzle. All three original feel-test questions (does
matching+recede feel good, does the lock/unlock transition feel good, does
the confinement→vista payoff land) are now answered yes — see "The pivot"
above for what's queued next (Pass 0.3).

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
