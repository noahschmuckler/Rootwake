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

## Decided (Noah, 2026-09-22)
- Names and thought bubbles as text are fine.
- Sim time: 20 real minutes to a village day. The world pauses while the page is closed; no catch-up.
- Hobbits do not see Hulda in V0.
- Her setback is not live until there are threats worth facing. When it comes it is like the plateau's
  fatigue (`vitality.ts`: drains, food, rest), but complete exhaustion never kills: she fades out into
  the greenery and wakes in a safe grove. The top of the karst is her first safe place and where she
  returns if she collapses.
- Eight hobbits first.
- (2026-09-22, V1 brief) Clear graphical indicators of needs, stores and gathering. Berries replenish daily at a rate; crops grow more slowly; goat milk is available daily; branches drop and are gathered daily. Stores are outdoors and visible as they fill and are depleted for meals and crafting. Without interference the village holds a steady state: no births or deaths yet, only the daily rhythm.
- (2026-09-23, E1 brief) The first enemy is the Dark Young of the mother of goats: oversized goats with writhing tentacle horns and six legs, shambling into the village at night while the villagers sleep to gobble the excess supplies. The player may outpace them (gather more than they eat) or fight. Combat returns, Diablo-shaped: a cheap regular attack and rechargeable specials; match-3 reserved for building her sap. A working skeleton first, in small pieces, then balancing passes.
- (2026-09-23, W1 decisions) One drop-off ring per store. Gathering is paced per villager: three meals a day from the stores, and a gatherer's session yields about the next meal's share. If the stores hold enough for the next mealtime, the gatherers worship instead. Excess for long enough will spawn baby villagers whose needs rise before they can gather (recorded, not built in this phase). Collecting costs her no sap, only time: a meal's worth in a few seconds at a place's ring, a quick drop-off. No match-3 for now.
- (2026-09-22, second notes) The same screen drag turns the camera the same way in every form she takes. The double tap that enters and leaves grass and roots is on the thumbstick only, never on the screen. Once a hobbit has a destination it walks there at one continuous pace, not run, stop, run.

## The worship loop (Noah's idea, 2026-09-23; plan and input recorded, implementation to be decided)

**The idea.** The station mechanic of the mobile ad genre: a third-person figure walked to a place
does the place's work by being there, and walked to the drop-off delivers. When the player judges a
village worth supporting, Hulda helps it gather by that mechanism. Villagers whose stores are
supplied are freed, and go to the shrine to pray to her. Prayer accumulates as points she spends on
miracles: first, permanent forest spirits that do a gathering job, freeing the villagers further;
then a tree of them, with her capacity for prayer rising and the cost of each next miracle rising;
gifts of knowledge among them (more nourishing food, kinds of building, roads, defences). It implies
a rival: agents of chaos who compete for a village's prayer by granting like boons and asking
horrible things (sacrifice, raids on the unaligned), whom she beats by the same means, a better
service or the same without the price.

### Input (the builder's, for Noah to weigh)
- **It closes the loop V1 opened.** V1 made the take bounded by the stores' caps, so a supplied
  village stands idle at its places. The worship loop gives that idleness a use: freed time is
  prayer. It also makes her help legible in the land's own terms: what she picks comes off the
  same bushes, counted in the same take, and the thicket thins the same way if she over-picks.
  Her help is not free to the land, only to the villagers.
- **The rates must move first.** With today's tuning the stores fill in the first two hours
  without her, so prayer would come almost free and her stations would be decoration. The
  gathering rate should drop until a villager's day just meets the village's eating (the steady
  state sits at the edge), so that her armfuls are what make the surplus. Tune with the sim probe
  before building the stations. Proposal: `GATHER_TICKS` about 24 to 30, worship when a store is
  at or above three quarters of its cap.
- **Weight, still.** Her stack should be visible and bounded (about eight of one kind), slow her a
  little, and refuse her other forms: no bulge under the grass with a basket on her back. The
  double tap with a load does nothing but a wobble. Weight is the rule that keeps this from being
  the ad game it borrows from.
- **Where she drops off.** Two readings of "the stockpile": one ring on the green where everything
  flies to its store, or a ring at each store. Recommend a ring at each store: the stores are
  objects with places (V1's whole point), and one drop-off would teach that they are a menu.
- **Prayer should saturate per village.** If every villager prays all day forever, points are a
  faucet and the tree is a shop. Make a village's prayer rate rise with the number praying but
  saturate (a shrine has so much attention), so growth means more villages (V5) and deeper
  service, not longer idling. And freed villagers should not only pray: freed time is also what
  V3's relationships and later crafts and building are made of. Worship competes with those wants.
- **Spirits are a trade, not an upgrade.** A spirit does a job tirelessly, which is why it costs
  prayer that the village's own labour would otherwise not have produced. But a village with
  every job done by spirits has nothing to lose, and nothing to give but prayer. The rival is what
  restores the stakes: they can be taken, and so can their prayer. Build the rival soon after the
  first miracle, not last.
- **Match-3.** Recommend keeping match-3 for her own sap (the plateau's cultivating board is her
  body's work; its energy is hers) and not for miracles. Prayer is a social economy; spending it
  should be a rite at the shrine, a visible beat (stand in the shrine's ring, hold, choose), not
  a puzzle. Keep the board in reserve for shaping a spirit's nature later if a miracle wants a
  tactile beat, and for the sap that later gates her own forms and fatigue.
- **Sacrifice and the rival are a value system**, not just a cost. The player's judgement (the
  brief's core) becomes: whom do the villagers serve, and what were they asked for. That is the
  first place the "judgement material" of the brief becomes play. Worth designing the rival's
  offers as readable acts (a fire on the stone, a hobbit led away, a raid party leaving) before
  their numbers.

### The passes (W for worship; W1 comes before V2, which it reshapes)
- **W1. Her hands, their prayer.** Every resource place has a ring; standing in it in her own form
  gathers into her stack (one kind, capacity, weight); the ring at the store takes it. A villager
  whose store is supplied goes to the stone instead and prays ("praying"; Nell there doubles the
  rate); prayer points accrue and show at the shrine and in a small count. One miracle: at the
  shrine's ring, a rite summons a forest spirit for a named job (a small figure of leaves that
  does the villager's gather-and-carry loop, day only, permanent). Question: does her helping
  read as a relationship, and does the village's turning to the stone read as thanks?
- **W2. The tree.** Capacity that rises with worship (the stone grows), costs that rise per
  miracle, knowledge gifts (bread from grain and water, a well, a road, a palisade, a smokehouse)
  each a visible change to the village and a visible change in what the villagers do. Question:
  does the player plan, and do the gifts change the village's look enough to be read?
- **W3. The rival.** An agent of chaos courts the village: boons of the same kinds, demands that
  are acts (a sacrifice at the stone, a raid). Allegiance per patron; the villagers pray to whom
  they owe. She wins them back by out-giving or by lifting the demand. Question: does the choice
  between patrons produce the judgements the brief wants?

### For W1, the implementation as proposed (to decide before building)
- Model: `stations` (a ring per place and per store, radius about 1.2 m); her `stack` (kind, n,
  cap 8); collecting one unit every `COLLECT_S` while she stands in a place's ring with room in
  the store (same `landStock`, same take); delivering all at once in the store's ring. `prayer`
  and `PRAYER_CAP`; a villager's `worship` want when their store is at or above the threshold;
  `PRAYER_PER_TICK` per worshipper, Nell's factor; `spirits` as workers in the model with the
  gather loop and no needs; `SPIRIT_COST` rising per spirit. All deterministic, all saved.
- Scene: rings on the ground that brighten while she is in them; the stack on her back; the
  stone glowing with prayer; the spirits as small figures of leaves in the ivy material.
- Entry: the rite at the shrine (stand in its ring, a long hold on the stick opens the miracle
  choice); the count by the clock; her forms refused while loaded.
- Tests: the edge tuning (a day's work meets a day's eating without her), prayer only when
  supplied, a spirit doing a job, costs rising. Journey: collect, deliver, a villager at the
  stone, a spirit summoned.

## The wider world (Noah's brief, 2026-09-23; assessment recorded, build to be decided)

**The brief.** An overworld map and a larger connected world, with chunk loading and some procedural
generation. In play and in a fight, pinch to zoom out to an overhead view; at the end of that zoom,
pinch again to open the explored overworld. No fast travel; markers for significant places. Three of
them now: the karst, the village, and the lair of the mother of goats: a forest, dark and abhorrent,
whose presence alone drains her. One of the first goals of levelling up is to be strong enough to
delve to its centre and defeat her: not the entity, a local manifestation, which (like pillager
outposts) spawns within a certain distance of villages.

**Noted for later, not built:** what the Dark Young are to the village beyond the stores. Killing
them might yield a resource; they might move the village's happiness, or its alignment between her
and chaos, where appeasing them is a protection racket; the mother of goats is fertility, so a
village that appeases them might bear more children at the cost of more infant deaths. These belong
to W3 (the rival) and the balancing passes on E1.

### What is reasonably buildable now (the builder's assessment)
The studies are each an authored world in its own entry; a connected world is a different shape,
so this is the pass where the shape changes. Buildable at this stage, in two halves so each is
judged on the phone:

- **M1a. The map and the land.**
  - *Pinch.* Two fingers on the screen: the third-person camera pulls up and back through a few
    steps to an overhead tactical view (the fight readable at a glance); past the last step the
    overworld opens. Spread to come back. Cheap, and worth most to the fights.
  - *The overworld.* A drawn map (a 2D canvas over the game) in the world's own coordinates: the
    land she has explored (a coarse grid of cells revealed within a radius of her, saved), the
    village, the karst and the lair as markers (the lair once seen or once its drain has been felt),
    her own mark. No fast travel: the map only shows.
  - *The land beyond the meadow.* Chunks of procedural ground (about 64 m, loaded in a ring round
    her, unloaded behind): height by noise, biome by noise (meadow, wood, and the dark forest that
    deepens toward the lair), trees per chunk from the chunk's seed as the standee trees the
    village already draws, trunks as colliders. The village meadow stays as authored, an island
    the chunks defer to. Walking is unbounded; the grass form works everywhere; trunk, crown and
    leap work on chunk trees. Tree roots stay the village's for now (a root network per chunk
    is its own pass). The world is not edited outside the village yet, so chunks need no save.
  - *The karst.* A marker, and a crossing: the karst study is its own heavy authored world, so
    at this stage reaching its region on foot saves and opens the karst entry, and a trail at the
    karst floor's edge comes back. Connected by a load, honestly, until the karst is a feature the
    chunks can hold (a later pass, with the two entries' modes merged).
- **M1b. The dark forest, the lair, the first climb.**
  - *The dark forest.* A biome round the lair site (placed by the seed 350 to 500 m from the
    village, as an outpost is placed from a village): black trees, a violet fog that thickens
    inward, a drain on her vigor (and later her sap) by depth while she is inside, so the centre
    costs something to reach and to stay in.
  - *The manifestation.* At the centre a local mother of goats: a great dark mass with many horns
    that does not walk, with its own hp, tentacle sweeps within reach, and Dark Young born from it
    while she is near. Defeated, it dissipates and the raids stop for some days; then a new one
    grows elsewhere within reach of the village (later, one per village).
  - *Levelling, first cut.* A level from what she has slain: each level a little more vigor and a
    little more to the strike, shown on the bars. Enough to make "strong enough to delve" a real
    threshold, before any real progression design.
- **Deferred, on purpose:** chunk roots; more than one village and its own manifestation; chunk
  edits and their save; the alignment and appeasement above; any balance.

## Open questions (Noah's to decide, flagged here rather than picked silently)
- When the thought bubble should speak: on every change of activity, or only on the ones that matter (noon, home, a meeting)?
- The wider world (M1): the pinch steps and whether the overhead view is enough for a fight; the karst as a crossing for now; the lair's distance; what a level should give.
- Worship loop (W1): one drop-off ring or a ring per store; the gathering rate that puts the village at the edge; whether her collecting costs sap; whether match-3 has any place in miracles (recommended: no, for now).
