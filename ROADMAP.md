# Rootwake — roadmap

The implementation plan for `SYSTEMS.md`, in the discipline every pass so
far has used: each pass answers one question, is built as one or two
small commits, is judged on a phone before the next begins, and `npm run
build` stays green throughout. Numbers continue from Pass 0.6.

Guiding order: **needs before solutions.** The player must feel tired
before there is food that matters, must feel the rain before there is a
roof, must want a roof before there are shaped logs.

---

## Where we are

Built and judged: Passes 0 → 1.1 (through the doorway cut, the campfire,
wheat by the rune, harvest, nourishment, popcorn; judged 2026-09-07).
Built, awaiting judgement: **U0**, the underworld's first pass (below).

## Open directions after 1.1

Not a sequence — the designer picks the next one. Each is one question,
one or two commits, judged on the phone before the next.

- **The character.** A rigged, animated avatar for third person (KayKit or
  Quaternius CC0 glTF, Mixamo for missing clips), the loader pipeline
  (glTF Transform, GLTFLoader, AnimationMixer), clips keyed off hop, drag,
  rest, work. Parked by the designer; art, not mechanics.
- **Combat's shape.** The rune is the sketch: charge a reserve by the board,
  release it through an act. What is the first thing to release it at, and
  what does `byColumn` targeting become?
- **A second rune.** What else do seeds (or stones, or chips) become, and
  how is a rune learned rather than started with?
- **Cooking beyond popcorn.** The fire as a place: what else goes on it,
  and does the sourdough loop (DESIGN) start here — wheat → flour → dough
  → bread?
- **More of the cabin.** Windows and a door frame (the half-length log),
  half-round levelling, a gable roof and ridge, a chimney and hearth of
  rocks where the campfire's heat comes indoors; taking blueprints apart
  selectively.
- **The bag chain (SYSTEMS §5.3b).** Plant fibres → twisting → string →
  weaving → cloth → a bag; each link a board session at a place.
- **The vista.** The plateau's edge is still a wall. What the first way
  down is, and what the underworld pivot (DESIGN) looks like as a pass.
- **Weather's second act.** Wind, snow or cold that make the cabin and the
  fire answer more than rain.

## Pass 0.6c — planting and the first tension

*Question: does "eat it or plant it" register with twelve seeds?*

- Seeds onto a tilled patch → a sapling that grows into a tree voxel over
  time (the first regrowth, player-made).
- Depends on: 0.6b judged. Touches: `hands.ts` (place onto a patch),
  `patch.ts` (planted state), a small `growth.ts`.

## Pass 0.7 — vitality

**0.7a — the stat and the halo.** *Question: does a halo, colour and hop
reach communicate fatigue without a bar?*

- `vitality.ts`: one value, drains from tree work, tilling, dragging hops
  and time; restore via food and rest; collapse → wake tired, diminishing
  returns without eating; never dead; floor state = look, one hop,
  collapse.
- Strength becomes a function of vitality (the constant in `objects.ts`
  goes through it). Stack caps and hand availability follow vitality
  (`hands.ts`). Fan reach follows vitality (`player.ts` already has
  `fanScale`).
- Rendering: a DOM radial-gradient vignette for the halo (cheap, works on
  phones), `renderer.toneMappingExposure` and a fog/light colour shift for
  the greying, a narrowing of the vignette for tunnel vision. Post-process
  desaturation later if the cheap version reads flat.
- Eating: seeds as poor food; the gesture decided here (see SYSTEMS §6).
- Rest: a long-press on the ground where you stand → sleep (time skips,
  vitality restores by shelter quality, which is "none" until 0.9).

**0.7b — day/night and the two vision regimes.** *Question: do
well-fed-night and tired-night read as different modes worth being in?*

- A sun cycle in `world.ts` (light direction/colour, sky dome grade, fog
  colour). Night is dark by default.
- Vision keyed to vitality: high → exposure and fog distance up at night;
  low → dim, with a glow layer. First "dark secret": **lichen** on rock,
  emissive keyed to fatigue, collectible only when visible (a `tiny`
  stackable).
- Touches: `world.ts`, `vitality.ts`, `objects.ts` (lichen), `hands.ts`.

## Pass 0.8 — rocks and the stone hand axe

*Question: does the crafting interface (held rock strikes hovering rock,
wedge emerges) feel like making a tool?*

- Rocks spawn from tilling (each till threshold drops one; already-tilled
  patches still yield). Rock is `large`, mass 1: lifts one-handed.
- **Long-press** on a world object opens its recipe menu (a new pointer
  role in `hands.ts`/`main.ts`: a hold on an object in view within reach;
  distinct from tap-to-lock and from the movement hold, which is on empty
  screen). Recipes filter by what is in hand (`recipes.ts`, a table).
- Crafting lock: a third `cameraLock` framing — the target hovers ahead at
  hand height, board below (`lookDownPoseFor` variant). The held rock is
  the projectile (`projectiles.ts` gets an "object as shot" that returns to
  the hand). Target HP with staged looks (the `patch.ts` staging pattern):
  rock → chipped → wedge → hand axe. Result replaces the target object.
- No bag here: bags are gated behind cloth ← thread ← fibres ← processing
  (SYSTEMS.md §5.3b), which needs the axe and the fibre plants first.
- Touches: `patch.ts` (rock spawn), `objects.ts` (rock, axe), `recipes.ts`,
  `hands.ts`, `cameraLock.ts`, `board3d.ts` unchanged.

## Pass 0.9 — shaping logs and the first bed

*Question: does a bed you fitted yourself, raising how well you sleep,
feel like the answer to the fatigue you have been living with?*

- With an axe in hand, long-press a log → the four shaping recipes
  (SYSTEMS §5.4). Each is a board session on the log; each spawns wood
  chips (`tiny`, kindling).
- Shaped logs are objects with weight and **fittings**: a notched log placed
  onto a notched log snaps into a course. **The first assembly is a bed**
  (two notched logs and a stick lattice): rest on it raises the rest
  ceiling from 0.7 toward 0.9 (`vitality.ts`). Walls and a roof follow in
  1.0, and then a roof has a bed to protect.
- Port DiggyDwarves' structure model as data (piece types, fittings), not
  its UI. End product = the pieces.
- Touches: `recipes.ts`, `objects.ts` (shaped logs, timber, chips, bed),
  `hands.ts` (snap-to-fitting on place), a small `structures.ts`,
  `vitality.ts` (rest ceiling by bed).

## Pass 1.0 — weather: the reason for the roof

*Question: does the first rain make you want the wall you built to have a
roof?*

- Rain: a particle layer, sky/fog darken, vitality drains while outdoors
  (not under a roof). Lightning: rare, a flash and a crack, a strike near
  the player saps vitality to the danger band.
- Walls from fitted logs and a roof from timber; roof detection (up-ray
  from the player). Recovery faster under a roof; sleep ceiling by shelter
  quality on top of the bed's.
- Touches: `world.ts` (weather), `vitality.ts`, `structures.ts` (quality).

## Pass 1.1 — fire, kindling, cooking

*Question: does light at night and better food close the day-one loop?*

- Wood chips + sticks + timber → a fire (a long-press recipe on chips).
  Fire is light at night (vision without vitality), warmth (slower drain),
  and cooking (seeds → better food; later crops).
- Touches: `recipes.ts`, `objects.ts`, `world.ts` (point light), `vitality.ts`.

## The underworld — U passes (a second entry, `/under.html`)

A second character in a second place, on the same engine and the same
board. Numbered apart from the plateau's passes because they answer a
different question: what confinement → vista means when the confinement
is rock and the release is heat.

**U0 — the metallurgist wakes (built 2026-09-07).** *Question: does
vaporizing a boulder with the board, and watching the metal set into an
ingot you can then make something from, feel like the right first act
down here?* He wakes in the centre cell of a 3×3 ring of ore-bearing
boulders inside a 5×5 chamber of bare rock; fully energized, seeing in
the dark. Tap a boulder's shining veins to lock; each match superheats
the ore; at full heat the rock vaporizes into a molten pool that cools
into an ingot. The chamber walls bear no ore and refuse him. Long-press an
ingot → Blueprint: dagger (one ingot); long-press a dagger → melt it back.
Energy scales movement speed, the fan's reach, the darksight's distance
and the width of the tunnel — but he is never blinded and never collapses.
Open, flagged in code: ORE_HP, the energy floor and drains, the sight and
tunnel curves, cell pitch vs boulder radius (the gap must stay narrower
than the player), the ingot's metal colour.

**U1 (designer's call).** What the dagger is for; more blueprints from
more ingots; whether ore types (the five colours?) differ; what lies past
the chamber.

## Later, in no order yet

- Underworld / the ore character beyond U0 (the second scale phase). The
  vision regimes are built for it.
- Combat: energy meters filled by matches, spent on abilities and
  in-combat movement; `byColumn` targeting; held objects as weapons via the
  weight rule (a strong character swings a log).
- Party roles (weak scout with aura vision, strong ranged, balanced).
- Alchemy: potions and poisons that move the vision dial. The first potion
  is made from lichen and keeps the glow without the weakness — the thing
  gathered while suffering ends the suffering.
- Fibres → thread → cloth → bag (SYSTEMS §5.3b), each a processing activity.
- The buildable plateau at acreage scale (instancing/LOD engineering pass).
- Real forests for the plateau's middle.

---

## Conventions that hold for every pass

- One question per pass; stop and report when it is answerable.
- Two commits when two signals could confound each other.
- Tuning constants at the top of the module, flagged in the commit.
- Nothing "just because": a pass that adds a solution names the need it
  answers and the pass that made the player feel it.
