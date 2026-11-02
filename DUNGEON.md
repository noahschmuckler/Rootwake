# The Waterworks: the first dungeon, and the shells

Design discussion with Noah (2026-11-01 and 2026-11-02), a draft spec, not a pass. Nothing here is built. It sits on `HOLD.md` (the Hearth-Hold and its sealed waterworks door), `PROGRESSION.md` (the layers, the four fronts and the failsafes), `COMPANIONS.md` (a traversal key per ally), `FIGHT_HANDOFF.md` (the fight layer, F4's vine pull) and `MOBILITY.md` (keyed traversals, parkour). Lines marked **Noah** are his decisions; **Claude** lines are readings or proposals; **Open** lines wait on him.

## What the hold already offers

- The `waterworks` door on the facade (`DOORS`, u 22.5 to 26, kind `sealed`) is gear-locked. Behind it, HOLD.md's "later" is the irrigation quest.
- Six terraces of dry stone beds, each with a runnel along its back and a seized bronze sluice (`BEDS`). The beds are terraced farmland the hobbits don't know is farmland.
- Six lantern pylons at three landings (`PYLONS`), and the Ever-Hearth's gas line with its seized valve (`PIPE`, `VALVE_Z`).
- The Story Wall in the Long Hall: **six blank panels** in bronze frames, "waiting for what will be carved and painted there".

## The dungeon's job (Noah)

Beneath the ruin, a dungeon that unlocks it. Three objectives:
1. Reveal information on the great hall's panels.
2. Open a cistern, which reactivates irrigation on the terraced farmland.
3. Activate the natural gas or magitech lanterns.

## The panels (Noah, Claude)

- **Noah:** the four central panels face the player straight on from the great door. The two end panels are hidden from the doorway by the entry columns and are plainly visible by walking to the side.
- **Claude:** the four central panels are the gates, and the two end panels are a find. They keep the later lore (the bear's upgrade, the way deeper), which a player discovers by looking around.
- **Noah, the metroidvania rule:** the first panel gives the clue to the dungeon (perhaps how to enter). Completing a task in the dungeon changes the ruin and reveals the next panel, which clues the ability the next stretch of the dungeon needs.

| Gate | Panel clue | Task, and what it changes in the ruin | Ability it needs |
|---|---|---|---|
| 1 | The way in (**Claude:** follow the dry runnels to the waterworks door) | Open the door and the cistern: irrigation returns and the terrace beds go green | none (walking, parkour) |
| 2 | The vine | The far valve and gears, reached and turned at a distance | the vine whip |
| 3 | Light | Rotate the mirrors and condensers by whip; the pylons and gas lanterns light | the whip, used on the light puzzles |
| 4 | Strength | The great wheel, the heavy door, the sealed way deeper | the bear shell |

(**Claude:** the order water, then growth, then light, then strength lets each reward feed the next, and the first task's reward is visible from the hold's own terraces.)

## Abilities

### The vine whip (Noah)

- All of her attacks are melee and close. The whip lengthens her reach, pulls enemies in, and works for traversal, from the simple Indiana Jones swing to a Spider-Man style swing through the woods.
- It can rotate mirrors and light condensers or refractors from a distance for the beam puzzles.
- **Already in the repo:** COMPANIONS lists the Cultivator's key as "ensnaring vines / vine-ladders", and FIGHT_HANDOFF F4 plans "a vine pull (a grapple to or from a foe)". One build serves combat, traversal and the light puzzles.
- **Claude, the swing:** author it as keyed arcs between anchors, not free pendulum physics. The movement is built on keyed traversals checked by `validateTraversal`, the thumb UI already shows landing circles, and the phone has run at 20 to 30 fps. A vine anchor is one more circle type.
- **Noah, the anchors:** giant trees and leaning obelisks across the map, if the trees are tall enough. **Claude:** the hold supplies its own, the 27 m facade, the pylons and the tower stumps.
- **Open:** whether the plateau's trees are tall enough to swing from. Not measured.

### The tower dive (Noah)

- An Assassin's Creed or Shadow of Mordor style dive from a height. It suits her parkour and could open a vine-swing launch arc.
- His daughter (4) dislikes being stuck at the top of a tower. It was the wellspring she felt trapped on, and she didn't love diving into the pool.
- **Claude:** the facade's top is the hold's natural place to dive from, with the whip catching the fall.

### Shells (Noah)

Her forms are shells: dirt and soil gather up around her as armor or a power suit.
- **Standard bear first**, for heavy work: pushing open doors, turning great wheels, moving huge stone blocks, and bear combat. Dealing with the bear later grants enhanced bear-form abilities.
- Later shells: the spider's wall climbing, a mole or other digger for digging situations.
- **Claude:** the shell takes the damage first, so she isn't hurt until it crumbles. It is a forgiving rule for a small child, and "armor up, then fight" becomes play.
- **Claude:** the shell needs soil. The hold's beds are dry cracked soil, so opening the cistern (gate 1) is also what lets her build a shell by the terraces. **Open:** where shells draw soil in other places, and what they cost (sap, vigor, a cooldown).
- **Claude, the precedent:** the metallurgist's suit (`forge.ts`, `energy.ts`: energy imparted on and returned off) is the pattern for wearing and sustaining a piece.

### Familiars (Noah)

Small forms, such as a mouse or snake that enters rooms and solves puzzles otherwise closed to her, come by summoning the creature and taking its point of view, like a familiar in D&D.
- **Claude:** this is the spirit deer's take-control and let-go pattern (O2: `deerModel.ts`, `scopeFigure.ts`). The control swap already exists.
- **Claude, the tension:** her body stays behind, exposed. Early on, keep the dungeon safe for it so a short familiar trip never frustrates a four-year-old. Later forms could let mooks notice the body.
- **Claude:** the familiar can be made of soil too, so the art stays one family and needs no new animal rigs. The repo's animal assets are the Quaternius wolf and cat, and the eagle fell apart under decimation (`public/models/WOLF_CREDITS.md`).

### The wider set (Noah)

She becomes something like a D&D druid, and **each animal form could be a metroidvania hook**:
- bear: heavy moving;
- mouse or snake: small spaces;
- eagle: flight and enhanced vision, with a piercing cry as a ranged attack or debuff;
- stag: she becomes the stag instead of mounting it;
- mole: digging;
- spider: wall climbing.

The giant eagle mount he first suggested (after the thunderbird) is replaced by the eagle form.
- **Claude:** this lines up with PROGRESSION's four fronts: eagle for air, a swimmer for water, a digger for underground, bear and stag for land.
- **Claude, scope:** one new form per dungeon, not a menu. This dungeon grants the whip and the standard bear shell. The mouse familiar enters on the first puzzle room that needs it. Everything else waits for its own place.
- **Claude, the bear and the Eden:** killing the bear is late (REVILED), and the Eden's rule that nobody kills is still open (OPENING_ARC). The standard bear shell therefore comes from the dungeon, not from the bear. The upgrade is the later bear event, which could be earned by befriending the bear or by dealing with it in winter, when it sleeps. PROGRESSION already proposes the bear's winter den as the way down to the ruins.

## Combat (Noah)

His daughter looks for bad guys as soon as she learns she can attack, so the first dungeon has **plenty of combat**. She wouldn't be able to fight a boss in a Souls-like arena, so there are **mooks**: groups of low-level enemies on patrol in the dungeon, and random encounters in the open world.

Three kinds of enemy, from his list:
- **Moved-in creatures,** the subterranean ruin's new tenants.
- **Guards:** a clay golem that tears itself free of the roots that hold it against the wall.
- **Corrupted creatures:** touched by chaos, with extra tentacles or creepy abilities.

**Claude, proposals:**
- **Mooks** die in one or two hits and walk in packs of three to five. The fight layer already has wolves, black wolves, Dark Young and a practice-wave harness (`fight.html`, `PRACTICE_WAVES`), so the first mooks can be reskins and judged in that practice clearing.
- **The whip as a combat tool:** it pulls casters and fliers into melee range and drags a mook off a ledge. Her all-melee kit stops being a limit.
- **The golem is the whip's tutorial guard.** She cuts or pulls the roots, then fights it. No arena: the terrain does the work.
- **The corrupted** belong near the sealed depths and tie to the Mother's lore (MOTHER.md) and the Dark Young variants (DARK_YOUNG.md).
- **No hard failure:** if her vigor runs out she faints and wakes at the Ever-Hearth, with no loss.
- **Open:** whether the dungeon ends in a boss at all. A mook swarm at the last gate, and the golem as the one guard set piece, may be enough.

## Passes (proposed)

Each answers one question, is built as one or two small commits, and is judged on the phone before the next.

- **W1, the whip in the practice clearing.** *Does a pull, a swing and a mook patrol feel good?* The whip with F4's vine pull, the anchor circle type, and a patrol of mooks in `fight.html`.
- **W2, the dungeon in grey-box.** *Does the pattern of arrival, patrol, puzzle room, guard and gate hold?* Three wings, one per objective, laid out beneath `holdModel`, with the waterworks door opening onto it.
- **W3, the cistern.** The first task, with the beds going green and the panel changing.
- **W4, the bear shell.** Heavy puzzles: the great wheel, doors and blocks, and bear combat.
- **W5, the light.** Mirrors, condensers and the lanterns.
- **W6, the first familiar.** The mouse, in the first room that needs it.
- **Later:** the engravings and paintings on the panels (HOLD.md), the corrupted, the bear's upgrade, the other forms.

## Open

- Whether the hold's trees are tall enough to swing from, and where anchors are added.
- Which tower is meant by the tower dive, and what the dive launches into.
- What a shell costs and where it draws soil away from the terraces.
- Whether her body is ever vulnerable while a familiar scouts.
- Whether the dungeon has a boss, and what the end panels hold.
- Whether the dungeon is the bear's den's own way down (PROGRESSION), or a separate waterworks beneath the hold with the den as a second way in.
