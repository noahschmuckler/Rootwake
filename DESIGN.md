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

## Status

Repo scaffolded 2026-09-03. **Pass 0 built and judged satisfying** (same
day). **Pass 0.1a built** (same day): the app now boots into a free-orbit
view of the voxel (drag to orbit), tapping the voxel tweens the camera into
the unchanged Pass 0 locked framing, and a plain "Back out" button tweens
back to the free view. Rig, colours, matching and recede are untouched.

Controls for evaluating it: drag to orbit; tap the voxel to lock in; tap
flowers; "Back out" button to leave; `R` reloads with a new seed;
`?seed=N` repeats a board; `?slowmo=N` runs the recede and camera tweens at
1/N speed. Camera-tween tuning (durations, easing, orbit start/clamp) sits
at the top of `src/cameraLock.ts`; recede tuning at the top of
`src/recede.ts`.

**Next step is evaluation, not code:** does snapping from the free view
into the flat locked framing feel good or jarring? Only after that call do
the walkable field, real movement, multiple voxels, or the 6-face mirror
become worth building.
