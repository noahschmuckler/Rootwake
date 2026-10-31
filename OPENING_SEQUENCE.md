# The first minutes: from the dark to the deer

Design discussion with Noah (2026-10-30), a draft spec, not a pass. Nothing here is built. Noah: further planning needs play of the
earlier stages, and the opening matters most. It refines the opening beats in `OPENING_ARC.md`. Lines marked **Noah** are his
decisions; **Claude** lines are readings or notes on what exists; **Open** lines wait on him.

## 1. The dark and the solids (Noah)

- A **dark screen.** The **platonic solids of the match-3** drift past, **ever faster and more chaotic,** then **land in a standard
  match-3 grid.**
- (Claude: this is `VISION.md`'s baseline made playable. The roiling chaos comes first, and order is the first thing the player does.
  The gems already are platonic solids: `board3d.ts` builds octahedra, icosahedra, dodecahedra and tetrahedra.)

## 2. The match-3 (Noah)

- **It must be smooth.** Today you **tap a gem, then tap another.** That stays valid, but it must **also respond smoothly to a finger
  swipe.**
- **It no longer needs to be angled or placed in the world.** On entering, **the world fades quickly** and a **background field fills
  the screen** for **strong contrast against the gems,** which are **cel shaded for visibility.**
- A **numbered meter fills with each match,** up to **full clarity points** (Noah: the matches fill the meter to its maximum).
- **The background is her mind (Noah, 2026-10-30).** At first it is **roiling purple chaos:** a **water shader with highly disturbed,
  chaotic waves,** lit by **erratically moving, pulsing, multicoloured lights.** As points accumulate, **the water settles, the lights
  slow to a gentle steady rotation, and the colour settles to a gentle blue.**
- **At maximum clarity** the board **fades rapidly** and **a single drop of water lands in the middle of the water field.** As the
  **ripples spread outward, the backdrop fades to show the game world.**
- **This is every meditation, not only the first (Noah):** whenever Hulda meditates for clarity, **the background shows how chaotic her
  thoughts are and how they settle,** ending with the still water and the drop.
- (Claude: this changes the current board, which is "scaled and lifted onto the phone's screen" over the world for meditation, cultivating
  and channelling (`VILLAGE_HANDOFF.md`, G4a). The same screen could serve all of those sessions, but Noah described the opening only.)

## 3. Waking atop the karst (Noah)

- **When clarity is full, she opens her eyes for the first time** atop the karst, **standing in the streaming heavenly water.**
  **Distant living things are faintly haloed.**
- **Dragging on the screen moves the view. No UI is present.** **Petal tells her to look around by dragging her finger across the screen.**
- Then, one at a time: **the compass appears; then the movement stick; then the dive options.**
- **Absent at first:** prayer, fighting, guard, stag summoning.
- (Claude: the pool's sight starts as halos and outlines, as `PLATEAU.md`'s water-droplet telescopes would show, without the
  understanding the instruments give later. Everything the village entry now shows on screen needs a "not yet" state.)

## 4. Petal (Noah)

- **Hulda's thoughts are the player's thoughts, unspoken.** She does not speak.
- **The infant Delvira (Petal) appears in 2D,** smiling and speaking in **short sentences.**
- She is **pleased that Hulda is awake.** She advises her to **look around and take in the world's beauty,** and **encourages her to
  dive to the first level.**
- (Claude: `ADVERSARIES.md` has Petal growing from a baby flower fairy toward Gozer with every deal. The infant is where that starts.
  Her kindness here is the trickster's first move.)

## 5. The first level (Noah)

- **In the water bubble** (the waterdrop deep node), **the only options are to return to the top of the karst or exit to the
  catwalk.**
- **Exiting is as designed for level D** (`DESCENT.md`): a **snerk stands at a work station and greets her.** He **invites her to look
  into the work station.**
- **Her dive brings her to the top layer, D,** which keeps its current design, except that **the area behind the snerk, his station, is
  like Spock's desktop scope in Star Trek:** a hooded viewer she looks into.
- **A button press shows a view through a dim tunnel, through the eyes of a deer that has risen from the soil and wanders about.**
- The snerk **encourages her to look deeper, and she enters and embodies the deer.** (Then the observation stage in `PROGRESSION.md`.)

## What exists, what changes (Claude)

| Beat | Today | New |
|---|---|---|
| Opening | the village entry opens on the world | a dark screen and drifting solids |
| Match-3 | an angled 3D board over the world; tap-tap only | full-screen field, swipe too, numbered meter |
| Summit | all buttons and the pray panel available | no UI, then compass, stick, dive, with the rest locked |
| Deep node | dive options for shrines and convergences | only the summit and the D catwalk |
| Catwalk | built (D1, `descentVisit.ts`) with keepers' first words | a snerk at a work station, a viewing button, the deer |
| Deer | the stag is her mount, summoned | a spirit deer she inhabits and cannot act through |

## Decided (Noah, 2026-10-30)

- **The background reflects her current clarity:** the level of chaos in the water and the light follows where her clarity is, not a
  fixed starting state.
- **The world fades in from the middle outward** under the ripples, **the same on every later meditation.**
- **At the scope she sees only the deer, for now.**
- **Sound design comes later,** in earnest.
- **Max clarity is 60** (`CLARITY_CAP` in `src/deepModel.ts` already is 60). **The first board deals in.** **D is the only dive option at
  first.** **The water follows only her current clarity.**

## Decided (Noah, 2026-10-30, at the build)

- **Branch and deploy:** `feat/opening` from `docs/vision` (the vista line), its own workflow, live at `/Rootwake/opening/`. **The vista
  look.** **O1 only** before play. **A first visit starts the phone fresh** (the shared origin's saves go once).
- **O2 (2026-10-31):** the snerk's three lines, the scope beside the lectern, the deer seen through its own eyes down the tunnel, "look
  deeper" to embody it, "let go" or its sink to come back; the deer rises by the first village's green and lives 90 s.
- **Taking the deer (Noah, 2026-10-31, after play):** embodied, after a few seconds of watching a "take control" button appears; taken,
  the stick comes in and drives the deer, and it does not sink until she lets go. The look drag works as her own on foot: the camera
  behind the deer by her yaw, the drag turning it, the stick relative to the view. The taken view is high, over the deer's back (not at
  her own height, where the deer blocked it), with a first/third person toggle beside "let go" (Noah, same day).
- **A restart plays the opening again (Noah, 2026-10-31):** a restarted page (the webapp) after the opening is complete begins again,
  the phone fresh; a reload mid-opening resumes it. (So the world does not persist past a restart yet; `?opening=0` still skips.)
- **Claude's readings in the build:** Petal's lines are short and tapped through; the one that asks for the drag holds until she drags.
  The look is a drag of about 50° in all; the walk, a metre and a half. The dive costs its 20 of her 60, as before. The later
  meditation ends the same way at the cap, and an early "done" fades the field back. The halos on distant living things are not drawn yet.

## Open

- Nothing is open for the first slice. Build scope and conventions are in `OPENING_HANDOFF.md`; what was built, under "O1 as built".
