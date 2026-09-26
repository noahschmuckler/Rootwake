# Expansion and ascent: filling the world with activity

Noah's brief (2026-09-26), following the phone playtest that surfaced two things at once: a
motion-sickness bug in root travel and heavy fog hiding the karst's summit view (tracked as fixes,
not design — see "Bugs on record" below), and a design gap underneath both: the village has nothing
for a successful player to do once the first stores fill, and the wider world (the karst, the lairs,
the other six karsts implied by "the three closest") has no structure connecting them yet. This file
is the plan agreed before any of it is built, in the spirit of `VILLAGERS.md` and `DESIGN.md`: the
brief, the principles, the systems, and the pass order. Read `VILLAGERS.md` first — this extends it,
it doesn't replace it. Nothing below is built yet; each pass gets its own branch, route and handoff
exactly as every study before it has.

## Noah's brief, in full

**The dark loop stays as it is.** Shub and the D-passes are not the core loop; they're a mystery for
the player to find and solve, and a hint at a larger chaos-vs-order story. They don't need a forced
balance pass to justify them — that pressure is optional texture, not the thing the village is *for*.
Not every village should have a Shub nearby; some should have no threat at all, some should be beset
by several.

**The real gap is growth with nowhere to go.** A village that succeeds — supplied, worshipping, having
babies — has no mechanism to turn that success into more capacity. Population grows; nothing about the
village does. Two miracles are the natural fix: **quickening** (spend prayer or sap to bring forth
berries or grain — an acceleration of the land's own yield, not a new resource) and **expansion**
(sticks and water raise a new mud hut, so a crowded village can actually grow instead of just
producing babies with nowhere to put them).

**The village should be a hub, not a terminus.** A great deal to do there, or at least a great deal of
reason to look elsewhere from there — quest hints, rumor, a sense that the meadow is the calm centre of
something larger.

**The deep root that led to ruins.** An earlier study (`ROOT_STUDY.md`, the very first one) had a deep
root leading to a buried structure — water infrastructure to reconnect, not a monster. Noah wants that
idea generalized: deep/hidden roots as entrances to instanced places, some of them ruins with a reward
or a story and no ongoing threat, some of them the dens of raiding creatures — not Shub, other things
entirely. This takes the tone toward Witcher (a world of settlements with varying trouble in them) but
keeps Hulda's role as it already is: helpful builder and defender, never a conqueror, because she
cannot die and the stakes are always someone else's.

**Danger has a shape.** It should increase with distance from the karst: the karst (or the nearest
karst) is a place of relative safety, and the frontier gets more dangerous outward. This is placement
logic laid over the existing world, not a new stat.

**The karst becomes a launching station.** Instead of only spiralling up the outside on roots and
leaves (which stays as the way *up* — the effortful ascent), she can descend through the pillar's
centre by a magical spring, and from it see the world in a fisheye/overhead view — checking on the
villages she has found, their state, their trouble. Villages with a shrine to her yield information and
become teleport destinations; everywhere else — other villages not yet shrined, lairs, ruins — stays
reachable only by the root network's course travel, exactly as it works today.

**Leveling happens at the karst, and it is gated by the world, not just by play.** Match-3 cultivation
at the karst (the plateau's board, already reserved in `VILLAGERS.md`'s W1 notes "for the sap that
later gates her own forms and fatigue," and already precedented at small scale in `KARST_HANDOFF.md`'s
cultivation reservoir and sap-bought upgrades) raises her through tiers of power and widens her view and
reach from that karst. But match-3 alone cannot carry her all the way: as her reach nears the three
karsts closest to her first one, she is capped until she has **awakened the guardian** at each of those
karsts and **purified the villages near it**. Grinding the board stops being enough; she has to go do
the deed in the world. This whole structure — Hulda's own growth, entirely — needs a full plan before
any of the other six characters get built.

## Principles for this arc

- **Match-3 and world-state are two different currencies, and both must be spent.** Everything the
  board earns should cap out short of full advancement; only doing the thing in the world (awakening a
  guardian, holding a village steady) lifts the cap. Neither substitutes for the other — this is the
  balance Noah named explicitly, and it is the one genuinely new mechanical rule this arc introduces.
- **Danger is placement, not a difficulty slider.** Where a lair or a guardian sits relative to the
  nearest karst is what makes a region feel safe or dangerous; the player reads risk by walking, the
  same way `M1b`'s dark forest already reads as worse the closer to its centre.
- **She is a builder and defender, never a conqueror.** Consistent with `VILLAGERS.md`'s original
  frame (she cannot die; the stakes are the villages) — guardians are awakened and appeased or beaten
  back, not looted; ruins are restored or understood, not stripped.
- **Everything the player judges by, they must see** (carried from `VILLAGERS.md`): a village's state
  (thriving, pressured, besieged, cut off) needs to be legible on sight and on the map, not a hidden
  number — this is what makes the village a "hub of quest hints" without a quest log.
- **Needs before solutions, still.** Build the growth mechanism (quickening, huts) before the hub
  dressing (rumor, state tags); build the hub before the wider danger gradient; build a second karst's
  worth of content before the leveling gate that depends on three of them.
- **Reuse the pattern already proven**, don't invent a second one beside it: construction is a
  blueprint/board session like the plateau's (`site.ts`, `BuildSite`); a guardian is the lair template
  from `M1b` reskinned, not a new enemy architecture; a ruin is `ROOT_STUDY.md`'s buried-structure beat,
  not a new dungeon system; the cultivation board is the plateau's board again, as W1 already promised.

## The systems

### 1. Quickening and construction — the village grows

Two miracles, both spending prayer (or sap — Noah left this open; see Open questions) at a place's
ring, in the pattern W1 already built for spirits:

- **Quickening**: a timed boost to a site's regrowth rate or an immediate bonus yield, at a cost that
  rises with use like `SPIRIT_COST`/`SPIRIT_COST_RISE` already do. The direct answer to "no mechanism to
  increase resources" — it makes surplus itself a lever, not just a cap to hit.
- **Construction**: a new house. The trigger is already half-built: D1's `houseWithRoom` refuses a birth
  when every house is full at `ROOM_PER_HOUSE`; a crowded village (no house with room, more children
  than beds) is precisely when a new hut should become buildable. It costs stores (sticks and water; see
  Open questions on whether a new "mud"/clay resource earns its place or this stays wood+water) and
  plays out as a build site on the green's edge — reusing the plateau's `site.ts` `BuildSite` pattern
  (a blueprint, a ring, ingredients flying in) ported to the village's model and figures, not a new
  system. Left alone, does the village self-build slowly over days once it can afford to (a first
  `builder` role, pulled forward from V2's role system because construction needs someone to do it), or
  does it need her personal action to complete, the way spirits need the shrine rite? Recommend
  self-build slowly by default — a crowded village visibly working on its own next hut — with her
  quickening or a direct delivery of materials speeding it, so the pattern stays "left alone it holds a
  steady state; she can accelerate it," which every system so far has kept.

### 2. The village as a hub — state and rumor

A per-village state tag — thriving, pressured, besieged, cut off — computed from signals the model
already tracks (`balance`, raid activity, hunger, the blight's reach): no new simulation, just a
read-off. It drives two things: the map's marks (so a glance at the overworld map shows which villages
need her) and the thought-bubble system V0 already built, extended into rumor — a villager mentioning
another place's trouble, or a shrine's condition, the way the fire already says "the stream is low."
This is the cheap version of "hub of quest hints": no quest log, just the existing bubble and map
systems fed one more input.

### 3. Other lairs, ruins, and the danger gradient

Generalizes `M1b`'s single lair-by-distance placement (`overworldModel.places`, `LAIR_DISTANCE`,
`FOREST_RADIUS`) to many delve sites of two kinds, both reached the way `ROOT_STUDY.md`'s deep root
reached its buried structure — a hidden or deep root, found by exploration or by a village's rumor
(system 2), taken into an authored or lightly-generated chamber:

- **A den**: a raiding creature's lair, built on the lair template (`LAIR_HP`, a local manifestation, a
  brood, a peace timer after it falls) but not Shub — a different creature, a different flavor of
  trouble for that region.
- **A ruin**: no ongoing threat, a reward, lore, or a miracle unlock — the `ROOT_STUDY.md` beat itself,
  generalized: follow the root, find the structure, do the one restorative thing, take what it gives.

Placement is a density/severity field keyed to distance from the nearest karst: close in, few or no
dens; further out, more and stronger. Some village regions get none at all — genuinely peaceful, which
only reads as a relief if other regions are genuinely not.

### 4. The karst re-framed — the spring, the fisheye, shrines and teleport

- **The spring** is a new mode alongside the existing climb/root/leaf routes (`karstFeature.ts`), a way
  *down* through the pillar's centre — the climbing stays the effortful ascent, the spring becomes the
  reward for having gone up, which keeps the confinement→vista rhythm (struggle up, release down) rather
  than replacing one traversal with another for no reason.
- **The fisheye view** is what riding the spring opens: an overhead look at the known villages' state
  (system 2's tags), not a second copy of the plain terrain map M1a already built — it's a status
  dashboard specific to the karst, diegetic, not cartography.
- **Shrines**: a village whose worship (W1) reaches a threshold is marked shrined — known, and a
  teleport destination from the karst. Every other place (an un-shrined village, a den, a ruin) stays a
  root-network course, exactly as R1 already works. Fast travel becomes something a village earns by
  thriving under her care, not a default convenience.

### 5. Cultivation and the gated tiers — Hulda's ascension

The plateau's board, played at the karst as a cultivation session (precedented already: `KARST_HANDOFF.md`'s
cultivation reservoir, sap spent to lean the spring, wake the taproot, buy the basin), raises a tier of
power and widens her reach and view from that karst — up to a cap. The cap: as her reach nears the
three karsts closest to her first, further tiers are refused until she has awakened each one's guardian
(system 3's den template, one per karst instead of one per village-region) and held its nearby villages
steady (system 2's state tags at "thriving," not just "not besieged"). This is the one new mechanical
rule (see Principles): match-3 tier and world-state tier both exist, and her actual power is the lesser
of the two. It also gives the danger gradient (system 3) a reason to exist beyond flavor — the
guardians blocking her growth are why the frontier is dangerous, and why she has reason to go there.

## The pass plan

Each pass answers one question, is judged on the phone, and is not skipped ahead of — the discipline
every study here has used.

- **G1. Quickening and construction.** *Question: does turning a crowded village into a build project
  make its growth feel earned, not automatic?* The two miracles above; the build-site port from
  `site.ts`; the first `builder` role. (Built 2026-09-26; see VILLAGE_HANDOFF.md. Decided in the
  building: prayer for both miracles; a hut is sticks and water, no clay; the village self-builds when
  there are more people than beds, two to a house, and she can ask one at any time; the builders are the
  freed gatherers rather than a named role, since W1's rule already frees them; the stakes are a
  model-side site with the same shape as the plateau's rather than a port of `site.ts`, because the
  village's figures do the carrying that the plateau's board did.)
- **G2. The village as a hub.** *Question: do villagers talking about the wider world make the meadow
  feel like a hub rather than a terminus?* State tags, map marks, rumor bubbles. (Built 2026-09-26; see
  VILLAGE_HANDOFF.md. Decided in the building: directions in words; hints stay until the place is found;
  the state's colour on both the map's mark and the compass tick; the elder tells the condition and the
  stone's keeper the omens, the rest draw from all of it.)
- **G3. Other lairs and the danger gradient.** *Question: does danger-by-distance teach itself through
  exploration, and do peaceful villages feel like relief rather than emptiness?* Generalized lair
  placement, the den and ruin templates, the deep-root entrance. (G3a built 2026-09-26; see
  VILLAGE_HANDOFF.md: the field, the dens, the wolves. Decided in the building: Shub's lair keeps its
  place regardless of the field for now, dens obey it; wolves hurt villagers but never kill them; wolves
  first, boars later; the first village's ground is calm, and the keeper names the nearest den beyond
  reach so there is a direction to walk. G3b, the ruins and the thorn hedge, follows.)
- **G4. The karst re-framed.** *Question: does the spring's fisheye view feel like the launching-station
  beat, and is root travel still worth using for the places that aren't shrined?* The spring mode,
  the fisheye dashboard, shrine-teleport.
- **G5. Cultivation and the gated tiers.** *Question: does hitting the world-gated cap send the player
  outward with clear purpose, rather than reading as a wall?* The cultivation board at the karst, the
  tier cap, the three-nearest-karsts gate, guardians and purification wired to G3/G2.

G1 is recommended first: it's the cheapest (plugs into `houseWithRoom` and `site.ts`, both already
built), and it's the direct answer to "berries and sticks, then nothing to do." G4 and G5 depend on
more than one karst existing with real content around it, so they're last on purpose — building the
gate before there's anything on the other side of it would read as a wall with nothing behind it.

## Open questions (Noah's to decide, flagged rather than picked silently)

- **Quickening and construction's cost: prayer or sap?** Prayer is the village's own economy (W1);
  sap is hers. Recommend prayer for both, since they're miracles spent *for* a village the way spirits
  already are, keeping sap reserved for her own combat/cultivation/forms as `VILLAGERS.md` already
  intends.
- **Is "mud" a new resource, or is a hut just sticks + water?** Recommend starting with what already
  exists (sticks, water) and adding clay only if the loop asks for it — consistent with "nothing just
  because."
- **Does construction need her, or can a village self-build slowly alone?** Recommend self-build slowly,
  her help (quickening, delivering materials) as acceleration — keeps the standing pattern that every
  system holds a steady state without her and she is always the accelerant, never the requirement.
- **Are guardians per karst unique creatures, or the same lair template reskinned?** Recommend the same
  template first, cheap to place three or more of, differentiated later once the gated-tier pattern is
  proven on the phone.
- **Is the danger field radial from the single nearest karst, or do karsts' fields overlap/leave safe
  pockets between hostile ones?** Recommend radial-from-nearest-karst first — it's the simplest field to
  seed, and it's what Noah's own "three closest karsts" language already assumes.
- **Does the spring replace the vine-climb as the way up, or only add the way down?** Recommend adding
  only the way down (see Principles/system 4) — the climb is the confinement, the spring is the vista.

## Not this arc

The dark loop (D1–D4) is left exactly as built — a mystery layer, not something this plan re-tunes.
W2 (the tree of miracles) and W3 (the rival) are still real next chapters for the worship loop but are
not required to unblock this arc; quickening and construction (G1) can ship as their own miracles ahead
of W2's fuller tree. V2 (roles/personality/hunting/farming) and V3 (relationships) are unaffected except
that G1 pulls a first `builder` role forward — the rest of V2/V3 waits its own turn. The two mechanical
bugs raised in the same conversation (root-travel camera nausea from fast involuntary yaw around the
karst's curves; the karst summit using the meadow's ground-level fog instead of a vista-scaled one) were
fixed the same day (VILLAGE_HANDOFF.md, "Fixes after Noah's playtest"), not as part of this content plan.
