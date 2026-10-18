# The Dark Young: an octopus folded into a goat

Branch `feat/dark-young` (from `feat/vista`). Noah, 2026-10-17: the Dark Young are huge octopuses passing as huge goats. Every part of the goat is a tentacle folded into place. They move like goats (one attack is a head-butt), and the horror is in how they unfold to attack or to handle the world.

## Anatomy (`src/darkYoung.ts`)

- **Body:** one bulbous mantle is the barrel. The sac swells toward the rump, and the octopus's head region sits at the shoulders. The **real eyes** are there, on the mantle, with horizontal bar pupils. The goat's face has no eyes. A siphon on the flank pulses with the breath.
- **Beak:** in the middle of the chest, inside a ring of pale lip. All eight arms leave from that ring.
- **Hind legs (L4, R4):** run back along the belly, rise onto the rump (bunched there into thighs), then fold down through stifle and hock to the ground.
- **Forelegs (L3, R3):** drop straight from the chest.
- **Hooves:** each leg ends in a tip curled under itself.
- **Head (L1, R1, L2, R2):** the four arms braid up into the neck. The horn arms run down the jaw to the muzzle, fold back over the nose and brow, and come out of the poll as horns sweeping back. The ear arms wrap the cheeks, fold back, and come out at the temples as drooping ears.
- **Suckers:** two staggered rows on each arm's inner side. Ichor drips glowing green from the arms and the beak and lies a moment as a stain.

## How it moves

- **Gait:** a lateral walk, and a trot above `TROT_FROM`. Each foot is planted by phase, and the legs are solved to the feet (two-bone IK).
- **Head-butt (`butt`):** its tell is a rear onto the hind legs with the forelegs tucked. The blow drops it nose-down into the butt.
- **Lash (`lash`):** in its tell the seams of the face start to come apart. At the blow the head opens into four arms that shoot at her. The beak gapes.
- **Grab (`grab`):** in its tell a hoof starts to uncurl. At the blow that foreleg unrolls into a long reach and drags back to the beak.
- **Feed:** while it eats at a store or devours a place, the face opens onto the ground. The arms draw to the beak in turn, and the beak chews.
- **Hit:** a blow shakes the disguise loose for a moment: two or three arms tear half open. A heavy blow or a kill makes it rear up as the octopus, standing on its arms.
- **Rooted:** it strains. Arms tear half loose and fold back one after another, and the breath quickens.
- **Fleeing** (retreating or leaving): it drops the goat altogether and rows away flat on its arms.
- **Dead:** it falls open into what it always was. Its arms lie slack round it with their tips coiled, and after a while it sinks.

Every pose is laid over the goat arm by arm. Each arm opens from its base outward (`UNROLL`), with a writhe while it is half way, so a change of shape reads as uncoiling rather than morphing. The arms are tubes rebuilt on the CPU from a few control points each frame. That is about 6k vertices a figure and about 0.25 ms of desktop CPU per update. Far off (`LOD_M`) the rebuild runs every 2nd or 4th frame, and off screen every 8th.

## Contract with the game

- `villageWorld.ts` builds one figure per raider id (`createDarkYoung`).
- `setRaider(…, flat, tell, feed)` drives it. The new `feed` argument comes from `village.ts`: `eating` or `devouring`.
- `lunge(id)` calls `attack()`, which strikes with the blow the tell wound up for (chosen at random by `ATTACK_ODDS` as the tell begins).
- `react(id, …, power, killed)` calls `flinch()`.
- The model, its reaches and its timings are untouched. The attacks are presentation only, like F1–F3.
- The lair's mother of goats still uses the old horn materials. She is the next candidate for the same anatomy at scale.

## Study page

`dark-young.html` (`src/darkYoungStudy.ts`), live at https://noahschmuckler.github.io/Rootwake/vista/dark-young/ (published with the vista study): the figure alone on a meadow.

- **Controls:** drag to turn, pinch to zoom. There are buttons for stand, walk and charge round a ring; head-butt, lash and grab (each with its tell); feed; hit and heavy hit; rooted; flee; die; Hulda beside it for scale; and day, dusk and night light.
- **Headless:** `window.__dy` has `step(dt)`, `render()` and setters for every state.

## Tuning (top of `darkYoung.ts`)

`DY_SCALE`, `HEAD_PITCH`, `BODY_LIFT`, `STRIDE_*`, `TROT_FROM`, `UNROLL`, `RINGS`, `SIDES`, `SUCKERS`, `ATTACK_S`, `REACH_M`, `ATTACK_ODDS`, `LOD_M`. The arm table (`KS`, `R0`, `TAPER`, `BUNCH`, `RING_ANGLE`) sets each arm's thickness, taper, bunching and place on the ring.

Open questions for Noah:

- Should the lash and grab reach farther than the model's bite (`LUNGE_REACH` 2.3 m)? Today they are only shown.
- Should the snatchers and the mother of goats take the same anatomy?

# The black wolves (the dire pack): wolves the mother has got into

Noah, 2026-10-18. The Dark Young are octopuses folded into goats. The black wolves are not that. They are real wolves that the same entity has corrupted, and each one carries one of her young. They should be thematically close to the Dark Young without reading as small ones. Noah's choices before building:

- Their eyes are the mother's lime with a goat's bar pupil.
- Dead, the thing a wolf carried crawls out of its mouth and dissolves.
- From far off, the sign is strange movement. Up close, the horror deepens.

## The rule

The octopus shows only where the wolf is breached: the mouth, the eyes, the hackles, the wounds. Everywhere else it is fur, bone and teeth, and it never has a tentacle for a leg.

## The figure (`src/direWolf.ts`)

- **Body:** starved. The ribs stand out of the flank, the flank hollows under them, the waist is pinched, and the hips and spine are knobbed. Wet fur hangs in clumps.
- **Belly:** a bare, veined swelling. It breathes out of time with the chest, and something moves under its skin.
- **Hackles:** filaments, not fur. They drift slowly as if under water, whatever the wolf does, bristle when it is struck, and go slack when it dies.
- **Head:** the mother's eyes under a heavy brow, and black gums with two crowded rows of teeth. In its throat sit a beak and a knot of small arms.
- **The tell:** it crouches, and the arms show behind the teeth.
- **The bite:** the jaw opens far past a wolf's, and the arms push out of the mouth, writhing.
- **Hit:** it jerks, and it bleeds two bloods (`hitFx` `dire`): its own red and the green of what it carries.

## The movement

- **One will:** every black wolf reads the same clock (`now`).
  - **The trot stutters:** it stalls and lurches on the same beat for the whole pack.
  - **The breath:** the pack breathes together.
  - **The look:** every `HIVE_PERIOD` seconds all their heads snap the same way at once. One period in `OWL_EVERY`, they turn past what a neck can.
- **Glitches:** each wolf also has its own, one every few seconds: a leg bending where there is no joint, the neck stretching, or the head wrenching round.

## Asleep in the dire den (`denWorld.ts`)

The pack lies on its flanks, breathing as one, with the bellies keeping their own time. Slain asleep, a wolf plays its whole death before it is taken away.

## Death

1. It falls as a wolf.
2. The belly sags, the hackles go slack, and the jaw falls open.
3. The young drags itself out of the mouth: a fist of wet dark body with two lime eyes and six arms.
4. It crawls about a metre and dissolves into a green stain. The carcass sinks after `DEATH.sink`.

## Wiring

- **The field:** `villageWorld.setWolf(…, dire)` draws a black wolf with this figure (`DIRE_SCALE`); the grey wolves keep `wolfFigure.ts`. `lunge` calls `bite()` and `react` calls `flinch()`.
- **The tell:** its glint is lime (`village.ts`).
- **Practice clearing:** the third wave is a black pack of three (after the grey wolves the fight checks are written for), and a later wave mixes two with a Dark Young. Their den is `PRACTICE_DIRE`, made the dire den while practising.
- **Rules:** unchanged. These are `DIRE_HP` and the dire bite rules of S4c.

## Study page

`dire-wolf.html` (`src/direWolfStudy.ts`), live at https://noahschmuckler.github.io/Rootwake/vista/dire-wolf/ .

- **What it shows:** a pack of three, or one alone, beside a grey wolf and Hulda.
- **Buttons:** stand, walk, trot, bite, hit, asleep, die, and light.
- **Headless:** `window.__dw`.

## Tuning (top of `direWolf.ts`)

`DIRE_SCALE`, `DROP`, `STRIDE`, `STALL_S`, `STUTTER_PERIOD`, `HIVE_PERIOD`, `OWL_EVERY`, `GLITCH_S`, `GLITCH_LEN`, `BITE_S`, `THROAT_REACH`, `DEATH`.
