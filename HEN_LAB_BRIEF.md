# Prompt for the modelling agent: the hen-of-the-woods (model, rig, behaviours, lab)

You are building a new model and behaviour set for one creature, in an isolated lab page like `LAB.md`'s rust monster. Read **`ECOLOGY.md`**
("The hen's life") for the design and **`design/reference/hen-of-the-woods/`** (its README has Noah's verdicts) for pictures. Nothing here is
built. Written 2026-11-01 on branch `docs/vision`. The current in-game model (stacked cone tiers, two black dots; `game-model-current-*.jpg`)
is not on this docs branch in a form I could find: find it on the branch Noah is playing, and replace it.

## What it is

**A small pale creature wearing a huge gown of orange-and-cream bracket-fungus tiers and tresses** (chicken-of-the-woods, hen-of-the-woods,
some turkey-tail banding). It is a slow, comic, dodo-like walker and a deathless meat: wolves and hobbits harvest it by a flip-and-pull, it
survives, regrows, and fattens again. It is funny and gentle, never gory.

**The look (every image agrees):** two glossy black eyes on thin curved stalks from the top; **no arms, no face, no beak, no feathers, no shell**
on the creature itself; a pale bare body with a cartoon bottom; legs that are **short and fat when fat, long and thin when lean**; tiers as
overlapping half-moon shelves with a ruffled, banded front edge; cel-shaded with a dark outline, in the vista look (`vistaShaders.ts`).

## Body: two pieces

1. **The core:** the eyestalks and the upper torso, inside the dress.
2. **The meat piece:** the **legs, the bottom and part of the torso, topped with a soft mushroom cap socketed into the chest.** It is detachable.
   It looks like **a king oyster mushroom with a butt and legs** (pale stem, small round colourful cap, fat floppy legs). **No reference
   image exists yet** for it alone; make it plump and cartoonish. The soft cap is part of the edible portion.

**Fatness 0 to 1** reads from the silhouette: lean (a few brackets, long thin legs; stage 1 of `life-stages-four.jpg`), middle, fat (a full
round gown, short fat legs), heaviest (a ballgown too heavy to walk). Speed falls as fatness rises. Colourways (sulphur-orange, grey-brown
ruffled, turkey-tail bands) are a tint parameter, not new models.

## States, each with its reference

| State | What happens | Reference |
|---|---|---|
| **Wander / waddle** | walks fluffed up, side-to-side sway, eyestalks lagging | `dress-walk-hoist-sit.jpg` panel 1 (ignore the smile), `rosette-walking.jpg` (legs and waddle), `life-stages-four.jpg` (round body) |
| **Graze** | head-down, eating a grass tuft | (none; derive) |
| **Approach and hoist** | goes to a tree base with a **cushion**, **lifts the front of the gown** to show a bare white bottom | `dress-walk-hoist-sit.jpg` panel 2 |
| **Back up** | turns and backs toward the trunk | panel 3 |
| **Sit and rest** | sits against the trunk, **legs tucked in (never stretched forward),** the dress bunched up behind it around its neck, tiers spilling down in front | panel 4, `backing-onto-tree-best.jpg` |
| **Sit on the cushion, absorb it, thicken** | threads join it to the bud; **new tresses grow and the body thickens;** fatness steps up | `life-cycle-five-panels.jpg` (the bud is no longer the pale lumps in panel 1: it is the **pillowy cushion**), `dress-regrowth-five.jpg` (growth, but legs must be tucked and the figure has no arms or face) |
| **Leave the tree** | **strains comically to rip free** (some tearing, threads stretching) but **tears no bark slab** (too brutal); leaves a **mycelial patch with a small central nub** that **slowly inflates into a pillowy cushion** | `pulling-free.jpg` for the straining and threads **only** (ignore its bark slab and its yellow bracket bud). The patch and cushion: `cushion-growth-stages.jpg` (photorealistic; redraw cel-shaded). No image exists for the strain itself: derive it. |
| **Flip (hunt)** | a wolf or hobbit knocks it **upside down;** the dress falls over it and the **bare bottom and legs kick in the air** | none yet (prompt in the README's notes) |
| **Pull** | the hunter **steps on the dress and pulls the legs** until the meat piece **tears free with a pop;** the **eyestalks retract into the body.** No blood. | none yet |
| **Flat dress** | the dress lies flat and splayed, no occupant visible | `dress-harvest-flat-dress.jpg` panel 2 |
| **Regrow legs** | flat on the ground, the core grows **lanky folded legs,** **drawing energy from the largest lower brackets (they shrink and wrinkle),** keeping only the top few young ones; the eyestalks resprout | `dress-harvest-flat-dress.jpg` panel 3 (eyestalks popping up) |
| **Spring out** | the new legs **spring;** it bursts out **scrambling on long thin legs, in a miniskirt of a few brackets,** eyestalks above | `dress-escape-miniskirt.jpg` (**drop the arms and the face**) |
| **Dissolve** | the withered lower brackets **dissolve into the soil** shortly after it flees | none |
| **Run, flip skirt, sit** | runs to the nearest **budded** tree, **flips its skirt up briefly** (a tiny white bottom), sits against the tree, **eyestalks bobbing in relief** | `dress-relief-sit.jpg` has the beat but not the action; **legs must be tucked, no arms, no face** |

## Rules for the sim (from `ECOLOGY.md`)

- A hen has a fatness value. Meat available is its fatness; a harvest sets it to lean and sends it through the flat-dress, regrow and spring-out states.
- Each attachment to a **budded** tree base absorbs the bud and raises fatness a step; the patch left behind seals and slowly regrows a bud.
- The count of hens equals the count of bud sites, so nothing runs away. Population is static or scripted.
- Open (see `ECOLOGY.md`): are buds food for anything; attachments from lean to full; what fire does to buds; the stun's cost.

## Rig hint

Tiers are stacked rings of lobes on a spine or pelvis chain. The hoist and the bunching are lifting and rotating rings up and back; the flat dress
is every ring dropped and splayed on the ground. The meat piece is a separate mesh socketed into the core's chest. Keep the cartoon humour.

## The lab and conventions

A lab page with one hen on plain ground and a trunk beside it, a fatness slider, a colourway picker, and a button for each state. Judge it at
portrait phone size. Follow `CLAUDE.md`: small commits, `npm run build` green, record decisions in the docs as you go.
