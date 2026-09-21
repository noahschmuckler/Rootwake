# The villagers: the next big move

Noah's brief (2026-09-21): Hulda cannot die; she can only be weakened and set back. So the stakes are
other people. Hobbit-sized villagers who visibly interact with each other and with the world, with
their own loops (gathering, hunting, farming, keeping animals, each other), living in equilibrium with
nature at the start. The world's threats are threats to them. The trick is giving the player grounds
for value judgements about individual hobbits and whole tribes. Deployment starts very simple: a few
houses in one village, figures going in and out. It grows toward a tunable personality and culture
system, roles the hobbits choose, and then two expansionist cultures, one by territory and one by
technology, brutes and brains, which Hulda nudges, protects, keeps from each other's throats and keeps
from wrecking the balance she lives in.

This file is the design record for that work, in the spirit of `DESIGN.md` and `LAB.md`: the shape,
the principles, the pass order, and the questions deliberately left open. Each pass gets its own
branch, route and handoff as every study has.

## What Hulda is to them
Hulda is not a villager and not their chief. She is the wood: she moves through trunks and roots,
leaves a trail of flowers, grows ivy that stays. The villagers should see her as the forest seeing
them. That settles the control question for the first passes: she never gives orders; she changes the
world they live in, and they respond to the world. A berry thicket grown by their path is an
invitation. A thorn hedge grown across the wolves' run is a shield. A root she rides to their shrine
at night is a visitation. Direct influence (whispering to one of them, and later possession) comes
after the world-shaping is proven, and only through her own idiom: communion, the same gesture she
uses on a plant.

Her setbacks are the price of protection. Growing for them costs her; a wolf's bite, a lightning
strike, a winter night out weakens her (vitality already exists in `vitality.ts` from the plateau
study; the underworld's energy is the other model). Weakened, she is slower, her reach is shorter,
she cannot grow. She never dies. If the village dies, that is the loss.

## Principles (standing rules, plus the villagers')
- Confinement to vista, objects have weight, nothing just because.
- **Everything the player judges by, they must be able to see.** No stat sheets. A greedy gatherer is
  seen stripping a bush bare; a generous one leaves half and hands a share to the elder; a brute is
  seen shoving; a coward runs first. Text stays minimal: names, and pictographic thought bubbles at
  most. Their behaviour is the readout.
- **The simulation is a pure model** (`village/*.ts`, no Three.js), deterministic from a seed, stepped
  in fixed ticks, testable in node, saved as state. The scene renders it. This is the pattern of
  `match3.ts`, `watershedModel.ts` and `karstFlowModel.ts`, and it is what makes tuning safe.
- **Equilibrium is a number** the model tracks: what the village takes against what the land regrows.
  It is the balance Hulda protects, and later the thing the brutes break by land and the brains by
  tools.
- **Individuals first.** Culture is what individuals do on average. Do not build a culture system
  before individuals are legible and different.

## The model
- **Time.** A sim day of N ticks (proposal: 1 tick = 1 sim minute, a day = 20 real minutes at 1x,
  with a dawn / day / dusk / night rhythm taken from `daylight.ts`; seasons from `weather.ts`'s
  clock). Villagers sleep at night; the loops are daily.
- **The land.** A map of resource sites: berry thickets (yield, regrowth per day), game (animals that
  wander and breed), fish, fields (till, sow, tend, harvest over days), wood, water. Each site has a
  carrying rate; the village's take per day against the sum of regrowth is the balance.
- **A hobbit.** Name, age, sex, home, role, needs (hunger, rest, warmth, safety, company), a personality
  vector (bold / timid, greedy / generous, curious / traditional, fierce / gentle, pious / sceptic,
  industrious / idle), a relationship map to every other hobbit (warmth, respect, grudge), a memory
  (the last few things that happened to them, which is what their thought bubble shows), a carried
  thing.
- **Behaviour.** Utility choice each time an activity ends: needs × role × personality × time of day
  score the activities; the best runs as a small state machine with visible stages (walk to the
  site, work there, carry home, hand over, eat, talk, sleep). Interactions between two hobbits are
  activities too (greet, share, tease, argue, court, teach), chosen by relationship and traits, and
  they move the relationship. The elder mediates arguments; the spiritual leader holds a dusk ritual
  that raises company and courage.
- **The village.** Members, houses, stores (food by kind, wood, tools), a shrine, pens, fields, a
  territory (cells it uses), a culture vector (the members' mean traits plus norms that drift with
  events), an expansion drive (territory or technology, a dial per village, dormant until the
  second-village pass).
- **Roles.** Hunter, gatherer, farmer, herder, spiritual leader, wise elder at first; builder, toolmaker,
  scout, warrior later. A role is chosen by trait fit against what the village lacks; the elder can
  reassign; Hulda can, later, whisper a suggestion.
- **Threats.** Wolves (hunt game, then livestock, then the timid), storms and lightning, cold nights,
  sickness from a fouled spring, and later the forces of chaos. Threats have visible approach and
  visible harm, so protection is an act the player can time.
- **Judgement material.** Every hobbit has a short story generated by what they did: who they helped,
  what they took, whom they fought. Communion with a hobbit shows it as pictures. Tribes get the same
  in aggregate: what they took from the land, whom they raided, what they built.

## Bodies and animation
Hobbits wear the same skeleton as Hulda (`huldaSkeleton.json`, the X Bot's 65 bones) at half her
height, dressed as she is, in rigid parts sized from the bones. So the Mixamo pack drives them for
nothing: idle, walking, running now; the turns and strafes for milling about; more clips from Mixamo
(gather, chop, sit, carry, sleep, talk) drop in by file name. A hobbit is a `Character` instance,
not a copy of Hulda's code: factor `createHulda` into `createFigure(dressing, height)`.

Budget: a village of 8 to 12 at first, 30 per village later, 2 villages in view at most. Rigid-part
figures on a shared skeleton are cheap; the cost is the animation mixers (one per figure) and the
pathing. Phones are the target; measure at each pass.

## The passes
Each pass answers one question, is judged on the phone, and is not skipped ahead of.

- **V0. Presence.** One village on a flat meadow by water: six houses, eight named hobbits who leave
  at dawn, wander to a few sites, stand together at noon, return at dusk, sleep. Hulda walks among
  them in the free-flow controls; they turn to look at her. No needs, no stores. Question: do figures
  going in and out of houses on a day rhythm already read as people living there?
- **V1. Hunger and the land.** Needs, stores, gathering and eating; berry thickets that deplete and
  regrow; the balance number, shown only as the land's look (thickets thin, then bare). Hobbits carry
  visibly and hand over at the store. Question: is the village legible as a system, and does
  over-picking read as their fault?
- **V2. The living.** Hunting (game that wanders and flees; hunters stalk in pairs), farming (a field
  through its stages over days), a pen of goats; roles chosen by trait and need; the first
  personality dials (greedy, bold, industrious) visible in how each works. Question: can the player
  tell the hobbits apart by what they do, without being told?
- **V3. Each other.** Relationships, talk, sharing, arguing, courting; the elder and the spiritual
  leader; the dusk ritual; the memory and the thought bubble; communion with a hobbit shows their
  story. Question: does the player start to have favourites and grudges?
- **V4. Threats and protection.** Wolves, storms, cold, sickness; visible approach and harm; Hulda's
  tools: grown thickets, thorn hedges, guiding roots, a healing bloom; her setbacks (weakened, not
  dead); the village that can be lost. Question: do the stakes land, and does protecting cost enough?
- **V5. Two villages.** A second village with different dials: one that expands by territory (clears,
  hunts out, raids), one by tools (fences, plows, then swords). Contact, trade, friction, raids; the
  balance under pressure; Hulda nudging by the world. Question: does brutes against brains produce
  judgements, and can the player keep both alive?
- **V6 and on.** Whispering (communion suggests a role, a target, a truce; trust decides), then
  possession; a tool line (plow, sword); the forces of chaos as the thing brutes are for; the
  wide world.

## Where it lives
V0 through V2 as their own study, `/village/`, on a flat meadow with a stream: the karst floor is
dense forest and the pillar's traversal would distract from the question each pass asks. From V3 the
village can be seeded into the karst floor's clearing (the forest generator already keeps stands
clear; a village clearing is one more exclusion) so that Hulda's traversal and the village meet.

## Open questions (Noah's to decide, flagged here rather than picked silently)
- Names and thought bubbles are text. Is that the right amount, or should names be pictograms too?
- Sim time: 20 real minutes to a village day, or slower? Do they live while the page is closed
  (catch-up on reopen, as the watershed's seasons do), or only while watched?
- Do the hobbits see Hulda at all in V0, or is she invisible to them until the whispering pass?
- What a setback is: the plateau's vitality (drains, food, rest, collapse and wake-up) or the
  underworld's energy (a floor it never falls below)? The brief says weakened, never dead: energy's
  floor is the closer fit, vitality's rest-and-food loop the richer one.
- One village of 8 first, or 12? Eight is enough for roles to be distinct; twelve for two families.
