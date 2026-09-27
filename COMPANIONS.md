# The companions: everything written so far, and a reinterpretation

Noah's ask (2026-09-27), after G5 left the top cultivation tier waiting on "a companion standing
with her": companions are next. Before designing them from play, he wanted a consolidation of what
has already been discussed about the other six characters, across DiggyDwarves (where they were the
seven dwarves: the Cultivator and six recruits) and Rootwake (where the player characters are not
dwarves, and only two of the seven have been sketched or built). Part 1 is the record, with sources.
Part 2 reinterprets it for Hulda's world. Part 3 lists the calls that are his. Nothing here is built
and nothing in Part 2 is decided; it is offered to be argued with.

Sources read in full: DiggyDwarves `GAME_DESIGN.md`, `DESIGN_ADDENDUM_2026-07-02.md`,
`DESIGN_ADDENDUM_2026-07-09.md`, `CRAFTING_TREE.md`, `QUEST_MANUAL.md`, `ROADMAP.md`, `CODEX.md`,
`CLAUDE.md`, `LIVING_WORLD_SPEC.md`, `DIALOGUE_SYSTEM_PROPOSAL.md`, `DIALOGUE_SPRINT_1_PLAN.md`,
`ENCOUNTERS_PLAN.md`, `FLOUR_BREAD_SPEC.md`, `LIGHT_PUZZLE_SPEC.md`, `UNDERDELVE_MAP_SPEC.md`,
`scenes/ATLAS_DESIGN.md`, and the code (`src/dwarves.ts`, `src/world/worldGraph.ts`,
`src/state/PlayerState.ts`); Rootwake `DESIGN.md`, `SYSTEMS.md`, `ROADMAP.md`, `EXPANSION.md`,
`VILLAGERS.md`, `VILLAGE_HANDOFF.md`, `LAB.md`, `MOBILITY.md`, `CHARACTER_HANDOFF.md` and the earlier
study handoffs. Quotes are verbatim; "DD" is DiggyDwarves.

---

## Part 1. The record

### 1.1 Where the seven come from (DD's canon, in brief)

- **Avatars of Order.** "The dwarves are avatars of Order — legendary heroes, and (crucially)
  *programming*, not mortals." When a chaos-sphere's crust stabilizes, "the seven dwarves awaken —
  part of the sphere's programming — to put down any major Chaos manifestations that leak to the
  surface." (`GAME_DESIGN.md`, Grand Vision.)
- **Eight karsts, seven sleepers.** The karsts sit at the eight cube vertices of the globe; "7 hold
  dwarves (one is your home — the Cultivator); the 8th is special" (the Keystone). Each karst's crown
  holds "a sleeping dwarf"; the subway lines between karsts are the cage that seals the chaos core.
  `worldGraph.ts` is the roster:

  | Karst | Character | Domain | Cube-adjacent to |
  |---|---|---|---|
  | Greencrown (home) | Cultivator | agriculture | Dynamo, the Moot, Wallspire |
  | Dynamo | Artificer | electricity | Greencrown, Anviltooth, Emberflask |
  | Anviltooth | Smith | metallurgy | Dynamo, the Moot, the Keystone |
  | The Moot | Steward | government | Anviltooth, Greencrown, the Hush |
  | Wallspire | Mason | architecture | Emberflask, the Hush, Greencrown |
  | Emberflask | Alchemist | alchemy | Wallspire, the Keystone, Dynamo |
  | The Hush | Sage | spiritual | the Keystone, Wallspire, the Moot |
  | The Keystone | (none: the Eighth's tower) | | Emberflask, the Hush, Anviltooth |

  Note for Rootwake: under this graph the three karsts nearest home are the **Artificer's, the
  Steward's and the Mason's**. G5's "three closest karsts" gate would name those three first.
- **Each recruit grants three things.** "a **match-3 combat mechanic** (a new playable fighter —
  combat variety from your side), a **traversal ability** (the access key), and a **new craft/economy
  system** (their civ domain, seeded now, central in P2)." Peak access is "a Metroidvania web: each
  recruited dwarf grants a traversal ability that unlocks routes/incursion-bypasses to specific
  further karsts (designed dependency order, atop the danger-field gating)."
- **The seven, as proposed** (`GAME_DESIGN.md`, "Phase 1 — settled structure", verbatim):
  1. **Cultivator** (agriculture) — growth/regen, ensnaring vines / grow vine-ladders up faces & gaps / farming. *(starting dwarf)*
  2. **Mason** (architecture) — shields/fortify / raise scaffolds & bridges / settlements.
  3. **Alchemist** (alchemy) — reactions/bombs, gem transmutation / dissolve barriers, Chaos-antidote / medicine.
  4. **Smith** (steampunk/metallurgy) — metal gems/armor / tunnel through bedrock (root shortcuts) / industry & metal tool tiers.
  5. **Steward** (government) — rally/buff party, extra turns / parley past creatures / governance & disputes (P2 core).
  6. **Sage** (spiritual) — cleanse/ward Chaos / part the mist & read glyphs (literacy) / wisdom.
  7. **Artificer** (electricity/computers) — chain-lightning combos / light in magical darkness, power dead mechanisms / computing (blooms P3–4).
- **Each karst is built to its dwarf.** "each of the seven karsts is BUILT to its dwarf's theme — its
  problems solvable by that domain. The first (Cultivator's) karst: problems of growing — plants,
  food, textiles." And: "The tower is a prompt … the dwarf and companions built the karst both to
  power the subway containment channels AND knowing they would reincarnate and need to relearn
  exactly the right things … the descent IS the boot sequence."
- **The Phase-1 loop.** "ride the subway toward the next karst → clear (or bypass) the Chaos
  incursions on the way … → ascend the karst → **recruit its dwarf** (fighter + traversal key + craft
  system) → the key opens further routes → ×7 → assemble".

### 1.2 Recruitment as a perspective switch (DD, designer vision 2026-07-03)

"by the time you've played the top-field → descent → dungeon → subway arc, you deeply identify with
ONE dwarf. New party members can't earn that attachment as flavored-attack add-ons, and a full-length
second intro isn't worth it — *unless it's truly unique*."

- **The awakening protocol.** (1) A **megapuzzle** themed to the activating dwarf (the Cultivator's:
  the seed library, then "a unique ancient gears-and-cogs positioning puzzle"). (2) **The channel**: a
  cutscene; "the pulse courses through the subway channel, strikes the base of the target karst, and
  a ripple climbs previously invisible techno-runes covering its face, converging at the peak…"
  (3) **The statue-wake**: "a dwarf-shaped boulder statue, which blinks, stands, stretches, and gets
  to work. Perspective switches here — the new dwarf's unique descent begins." (4) **The link-up**:
  "the subway doesn't work until the far dwarf solves their own megapuzzle and unlocks their terminus.
  When the new dwarf reaches the subway entrance and opens it, **the first dwarf steps out**."
- **Each dwarf sees the world differently**: "different opportunities are visible, and unique routes
  open that other dwarves can't take." Every descent "must also be clobberable the ordinary way — the
  unique route is the *rewarded* route, not the required one."
- **The formula**: shared infrastructure plus "a **twist layer**: (1) one signature system, (2) the
  interaction verbs re-flavored through it, (3) one authored setpiece."
- **Why the Cultivator wakes first**: "he is the dwarf most closely tied to the *substrate* of the
  living outer envelope that keeps the chaos at bay."
- **What the meeting means**: "When the dwarves meet, they see a unique expression of universal
  consciousness and understand another perspective."

### 1.3 Companions as world-keys (DD addendum 2026-07-09, the Karst Spine)

"**7 dwarves ↔ 7 colors ↔ 7 specialties.** Each dwarf natively resolves *their own band's* wiring
anywhere in the world. Solo, you can light your own color + brute-force a couple → a dim transport
beam. Full white — all seven bands at strength — needs each band's master present." So "recruiting a
dwarf isn't just +1 party member — it's a **world-key** that retro-unlocks that color's sealed
chambers in *every* karst you've already visited." A solo dwarf can light "enough for TRANSPORT";
"full containment needs all seven … which is why the finale is cooperative."

Two spines: "**Vertical spine (shared):** light → white beam → subway → containment. **Horizontal
spine (the dwarf's specialty):** the Cultivator's **seed library** …; the mechanical dwarf's **7
simple machines**; the political dwarf's **7 tomes**; etc. The specialty *awakening*."

The apparatus bridge names two of them: "`worldGraph` already assigns **Artificer = Dynamo =
electricity** and **Smith = Anviltooth = metallurgy** — the wiring dwarf and the apparatus dwarf are
already named." Recipes sketched: "Mirror = plank frame + polished crystal · Prism = refined crystal +
lens · Conduit = rope + fitting · Filter = colored crystal + dyed cloth."

### 1.4 Per-dwarf themed verbs (DD `QUEST_MANUAL.md` §7, the only per-character quest text)

Every situation "admits at least two of the four verbs: FIGHT / FIX / TRADE / GROW. On each karst,
the *themed verb* … always opens at least one valve." The appendix (verbatim):

| Dwarf | Themed verb | Archetype twists (seeds only) |
|---|---|---|
| Cultivator | GROW | as above |
| Smith | FORGE | the Iron-Man capture setpiece (no agri analog — his OCCUPIED is *being the occupied*); repairs by re-casting; STARVED wants alloys not crystal |
| Steward | PARLEY | advanced negotiation stack — HELD situations gain courts, treaties, elections; the 3A web becomes a peace conference you chair |
| Mason | BUILD | infrastructure is the puzzle — bridges over chasms, load-bearing repairs; SEALED is his native land |
| Alchemist | BREW | potions as applications; STARVED reactors want catalysts; ingredient farming replaces food farming |
| Artificer | WIRE | the FIX verb ascends to theme; the grid itself is the antagonist |
| Sage | REMEMBER | the dreamscape graduates to signature mode; LOST is his native land; literacy quests bloom |

Also: "on later karsts the inspection yields, instead of the tangram itself: the intuition to FORGE a
missing part (Smith), or word of a city holding the part — unreachable behind collapsed bridges
(Mason)." And "Engineering-bent dwarves (Artificer, Mason) get routing options on their own karsts."
The manual's laws that bear on companions: "Force takes objects, never knowledge" (a knowledge-holder
killed forces the deep path: the Sage's dreamscape); "Failure transforms; it never dead-ends."

### 1.5 Per-dwarf descents and setpieces (DD, designer vision 2026-07-03)

- **Cultivator** (played): "the agricultural baseline — farming for food."
- **Alchemist**: "farms too — but for **potion ingredients** granting temporary abilities; the
  descent is powered by brews, not crops."
- **Smith**: "an **'Iron Man' setpiece** — captured by the dungeon's critters, and having gained
  abilities, literally builds himself **mechanized magitech armor** to break out. Played with
  self-awareness; the Tony Stark dwarf."
- **Steward**: "can pass the **entire dungeon without killing anything** — even vein-mining hand-waved
  as a *negotiation* rather than a battle. (The T3 parley/pact/reputation layer is the seed of this
  kit.)"
- **Sage**: from the Tangram Matrix note: "the dementia-dreamscape is a full mode (shifting maze = the
  chunk generator wearing a memory theme + time-drifting mutations). Build it once here as a
  set-piece; it graduates into the SAGE's signature mechanic on his karst later (memory-delving as a
  domain)."
- **Mason, Artificer**: no descent written beyond the verbs above and "the grid itself is the
  antagonist" (Artificer), "bridges over chasms, load-bearing repairs" (Mason).

### 1.6 Crafting trees per character (DD `CRAFTING_TREE.md`, `CLAUDE.md`, addenda)

- **Only the Cultivator has content.** "`PlayerState` fully supports 7 dwarves (`DwarfId`), each with
  its own `crafts`/`skills`/`points`/`equipped`, and combat already fields the recruited party. But
  **only the Cultivator has any crafts**, and `CRAFT_DEFS` holds just two generic charms (Trowel, Head
  Start). The other six dwarves' themed trees are unbuilt."
- **Suggested, not started**: "Teas / tonics / potions — the Alchemist's line, gated behind 'more
  plant forms discovered.'" "Second-dwarf crafting trees — e.g. a **herbalist** using flowers for
  potions, the **Alchemist's** ingredient farm, the **Smith's** 'Iron Man' setpiece." "Iron / material
  tiers for tougher tools … No ore → ingot → better-tool progression." The 07-09 addendum makes the
  deep "the reason to smith" and calls the apparatus tier "the machine tier / '7 simple machines'
  pinned for the mechanical dwarf."
- **The oldest note** (`CLAUDE.md`): "longer-term — second dwarf with its own crafting tree (herbalist
  using flowers for potions), iron/material tiers for tougher tools."
- **The 07-02 addendum**: housing as "possible prerequisite for alchemy, clockwork, or indoor
  workstations"; construction material tiers "wood … stone … refined stone … metal: later dwarf
  requirement … mithril/magitech: late-game"; dungeon building makes the player "effectively a small
  faction."

### 1.7 Skills, points and the party in code (DD)

- **`DwarfProgress`**: "One dwarf's personal progression: its craft tree, its (uncapped) skills, its
  unspent skill points, any Misfortune diminishment, and which of the SHARED [loot] it has equipped"
  (`crafts`, `skills`, `points`, `diminished`, `equipped`, `energy`, `wellFedUntil`). Skills are
  shared names (Vigor, Striking, Keen Eye, Harvest, Foresight; Resolve proposed), "uncapped;
  diminishing where the stat would otherwise run away"; points come from delving. Crafts are leveled
  charms bought with stone and crystal. Gear is one shared stash, three slots per dwarf.
- **Actives** "stay per-dwarf and land with their dwarf (only the Cultivator's 🌱 Bloom ships so
  far)." Board-manipulation powers are "themed per dwarf (**Cultivator = growth / vines /
  poison-spores / harvest** — sowing order into chaos-corrupted ground)."
- **The party** (`dwarves.ts`): each recruited dwarf "takes its authored SEAT in the mirrored 3×3
  combat grid (front row 0 sits nearest the board and shields the rows behind …), carries its OWN
  stats … and strikes in rotation." Seats "sketch a tactical shape: sturdy trades up front (they eat
  the volley), casters and counsel behind, the Sage deepest": Smith and Mason front flanks, Cultivator
  front centre, Alchemist / Artificer / Steward middle, Sage rear centre. Muster order: cultivator,
  smith, mason, artificer, alchemist, steward, sage. Identity tints: Smith peach, Mason steel grey,
  Artificer sky cyan, Alchemist violet, Steward gold, Sage mint.
- **Points and fights**: skill points come from delving ("every couple of veins yields a skill
  point"; a guardian pack pays one more, a faction leader two). Fights scale with the muster
  sublinearly (`PARTY_MEMBER_WEIGHT` 0.6: "a 3-dwarf party isn't 3× a solo, but the fights do grow").
  Nothing in the code ever switches `activeDwarf`; the Cultivator is always the one played.
- **The world map's words**: a sleeper's karst reads "sleeps — reach [karst] by subway"; a recruit's
  reads "**stands with you**." G5's "a companion stands with her" is the same phrase.
- **Misfortune**: "`diminishSkill` is fully wired through `effectiveSkill` but nothing ever calls it."
- **The schema warning** (`REPO_REVIEW_2026-07.md`): "seven dwarves with separate craft trees collide
  in one namespace. Decide the keying … now … This is the most expensive-later decision in the
  repo." (It was decided: the v2 envelope keys progression per dwarf.)
- **Dialogue reservations** (`LIVING_WORLD_SPEC.md`, the dialogue proposal): `recruited` as a
  condition and `recruit` as an effect; "Recruit or dismiss a character"; participants and
  "companion-interjection structures" reserved in the schema; a "Companion / escort verb — 'follow
  me'"; "no authored skill checks, random checks, party interjections, or companion reactions" yet.

### 1.8 Beyond Phase 1: what the domains are for (DD)

- **Phase 2**: assembled, the dwarves "find struggling primitive human settlements. They run quests,
  resolve disputes, teach agriculture and science, and defeat the balrogs."
- **The overland stub** (do not build yet): "A seven-person magical-medieval tactical combat sim (the
  full dwarf party) where match-3 is used selectively — in place of dice-roll mechanics à la D&D …
  each dwarf's special abilities as the flavor layer (their actives = their 'spell list')."
- **The liberation campaign**: "as a band of seven heroes, you arrive at towns beset and cities
  corrupted by chaos and liberate, influence, or annihilate them."
- **The endgame**: "an agricultural planet exports the plant-based materials that foster young worlds;
  an alchemy planet produces warp fuel …; a dynamo planet transmits energy beams …; a mason planet
  exports megastructure materials." The seven "end as statues by choice"; the compression ending turns
  each karst into "a UNIVERSITY."

### 1.9 The Eighth (DD)

The Keystone is the Eighth's tower. "the dark lord should be a dwarf: Chaos-corrupted and extremely
powerful, wielding all seven dwarves' skills imbued with chaos magic." His motive: "he took all their
chaos unto himself … and with that power flung the seven away from himself equally — the cube-vertex
geometry of the Teeth is the blast pattern of that act — into stone-sleep." "His theft of the seven's
power is *why the seven start diminished*." "THE EIGHTH DWARF MAY ACT AS NYARLATHOTEP — or
Nyarlathotep is simply the intelligent expression of the roiling chaos." In the same passage:
"Shub-Niggurath's corrupted woods and thousand young" (Rootwake's Shub and the Dark Young are this).

### 1.10 What Rootwake has written about the seven

- **The rule that replaces "dwarves" (`DESIGN.md`).** "Seven playable characters (mirroring
  DiggyDwarves' seven dwarves), each aligned to a domain, each **awakens confined by their own
  domain's material** and must free themselves using a domain-specific version of the same underlying
  verb (clear/untangle a mass of your element into open space + resources)." Sketched: the
  plant-aligned Earth Mother (Hulda, built); "**Book/knowledge-aligned** — awakens buried in a
  disorganized library; the untangle verb is matching/organizing symbols into folios" (Book of Hours
  the analog); "**Ore/metallurgy-aligned** — awakens underground surrounded by ore/crystal; the
  untangle verb is matching ore to weaken and collapse rock into resources." "The remaining four are
  unsketched."
- **The metallurgist is built** (U0–U4 and the lab, `/under.html`, `/lab/`): wakes in a ring of ore
  boulders; heat by the board vaporizes ore into ingots; energy with a floor and no collapse,
  darksight, the tunnel; the dagger and its melt; the suit ("Iron Man in the cave": chest six ingots
  as the core, helm two for darksight, powered legs four for running, reach and jumps, arms and
  pauldrons for carrying still to come; energy imparted into each piece and sustained there); the
  greblin miners who fear him and the high tunnel only they can climb ("Climbing is theirs until it is
  his"); and the stage's enemy in the lab, the rust monster, which "seek[s] veins of ferromagnetic ore
  … induce[s] rust … which they then scrape off." Open (U5): "Climbing or jumping and what is down
  that tunnel; where more ingots come from; the legs and arms; whether the dagger belongs to the
  suit"; "whether ore comes in the five colours (five metals) … and how the darksight and the
  plateau's two vision regimes relate when the characters meet."
- **Party roles from vision (`SYSTEMS.md` §2).** "potions and poisons that sap strength but grant
  vision. Only high-level alchemists make potions that grant the bloom while preserving strength. In a
  party it becomes roles: one runs weak and scouts for auras, one runs strong for ranged work, others
  stay balanced." `ROADMAP.md`: "Alchemy: potions and poisons that move the vision dial. The first
  potion is made from lichen and keeps the glow without the weakness"; "held objects as weapons via
  the weight rule (a strong character swings a log)."
- **Noah's correction (`EXPANSION.md`, 2026-09-26).** "The 'guardians' I referenced are the 6 other
  characters that the player can recruit. Each will have their own tech tree, and may or may not be
  directly playable vs directed by Hulda as heroic units." They gate her tiers together with villages
  held steady; G5 built the gate with `companions: 0` so "the top tier waits on it." Future sprint:
  "recruitment, each one's tech tree, whether each is played directly or directed by Hulda as a heroic
  unit."
- **What the villages already want from a domain.** W2's miracle tree was to hold "gifts of knowledge
  … (bread from grain and water, a well, a road, a palisade, a smokehouse)"; the villagers' later roles
  are "builder, toolmaker, scout, warrior"; V6 adds "a tool line (plow, sword)"; the two expansionist
  cultures are "brutes and brains"; the listed threats include "sickness from a fouled spring"; the
  rival (W3) is "agents of chaos who compete for a village's prayer." The ruins carry `RUIN_LORE`
  lines nobody can yet read, and communing with villagers is built (G2's rumor, the "!" marks).

---

## Part 2. A reinterpretation for Rootwake

The translation rules, drawn from what both repos already hold:

1. **Not dwarves, and not a party first.** In DD a recruit was a fighter in a grid. In Rootwake the
   six are people of Hulda's kind: each sleeps at a karst, each "awakens confined by their own
   domain's material," and each is a playable confinement→vista study before anything else, exactly
   as the metallurgist already is. That is DD's "perspective switch" made literal, and it is the one
   thing DD said a companion must be to earn attachment.
2. **Domains stay, trades go.** DD's seven domains (growing, metal, stone, brew, counsel, memory,
   light/power) survive; the trade names (Smith, Mason…) are working labels only, since the
   characters are not craftsmen in a guild but forces of the world, as Hulda is the wood. Each has
   their own stat in place of vitality (energy for the metallurgist already), their own verb on the
   board (heat in place of cultivate) and their own material that answers it.
3. **DD's "three things" become three things Hulda's world already has slots for.** The traversal
   key becomes **a way through the world that Hulda lacks** (rock, chasms, darkness, sickness, people,
   the unread). The craft/civ domain becomes **gifts of knowledge to the villages** (W2's tree, which
   was always going to need a source for bread, wells, roads, palisades). The combat mechanic becomes
   **a heroic unit** in Noah's words, played or directed. All three are what "a companion stands
   with her" should mean in the tier gate.
4. **Recruitment is DD's awakening protocol on the deep roots.** Her reach along the deep roots
   (G4b/G5) grows toward another karst; at its foot or through its node she channels clarity into
   it (the pulse that "climbs previously invisible techno-runes"); the sleeper wakes and the game
   switches to them for their opening (their U0); their opening ends when they reach the deep node
   under their own karst, and the deep roots join the two karsts (the link-up: "the first dwarf steps
   out"). From then on that karst is a launching station too.
5. **Chaos already has its face.** DD's Lovecraft fits are already here: Shub and the Dark Young are
   Shub-Niggurath's thousand young. The Eighth stays a question, but the rival of W3 (agents of chaos
   bidding for prayer) is the natural first sign of him.

### 2.1 The six, each in Hulda's terms

| | Domain (DD) | Awakens confined by | Their verb and stat | A way through the world | Gifts to the villages | As a heroic unit | Their enemy |
|---|---|---|---|---|---|---|---|
| **The metallurgist** (Smith) | metallurgy | a ring of ore boulders (built) | heat; energy in a floor | passage through rock and up walls: opens the sealed high tunnel, the dens' collapsed halls, "tunnel through bedrock"; the suit's legs already jump 3.2 m | tools and metal: a toolmaker role, the plow and sword tool line, a palisade with iron, a smokehouse hearth | the strong front: melee, "a strong character swings a log"; the suit takes the volley (DD's front seat) | the rust monster (built in the lab): eats his suit |
| **The librarian** (Sage) | spiritual, memory, literacy | a collapsed library; the verb "organizing symbols into folios" (sketched) | order; a stat of attention or memory | reads what nobody else can: the ruins' `RUIN_LORE`, glyphs, the elder's memory (DD's dreamscape as a delve into a villager's mind); wards and cleanses chaos (a stronger purify) | lore and rites: the spiritual leader's rituals, calendar, a shrine's reach; names for things (clarity's true name could be hers to give) | the rear: wards, calm, a ward against the dark forest's drain | the forgotten: LOST places, the dementia dreamscape, a mind chaos has eaten |
| **The mason** | architecture | walled into fallen stone: a ruin, the ring of old stones round a dry basin is already his kind of place | fit; a stat of load or stance | bridges chasms, raises scaffolds, opens SEALED places by rebuilding, holds ground (a stone hedge where the thorn hedge is a living one) | building tiers: mud hut → stone house, the well, the road, a wall; a builder role | the shield: fortify, a wall thrown up in a fight | collapse: what falls, what is buried; the STARVED and SEALED archetypes |
| **The alchemist** | alchemy, medicine | a still-room of vessels, or a bog of ingredients; the verb reactions | brew; a stat of the vision dial itself (the plateau's two regimes are already the alchemist's axis) | dissolves barriers, the chaos-antidote: purifies the Dark Young's leavings and a fouled spring, potions that move the vision dial (the lichen potion first: "the thing gathered while suffering ends the suffering") | medicine against sickness, better food (bread's cousin), ingredient farming on the field strips | bombs and reactions; the "weak scout who sees auras" of the party roles | sickness, spoilage, the blight |
| **The steward** | government, counsel | a moot hall of quarrelling voices; the verb is settling disputes | parley; a stat of standing or trust | passes where force fails: the rival's cultists, a village turned against her, the wolves' packs bargained rather than slain (DD: "parley past creatures"); the pacifist route through anything | governance: roles chosen and reassigned, treaties between villages, the brutes and brains kept from each other's throats, the peace conference chaired | rally and buff, extra turns; commands the others when directed | the rival (W3), a chief gone wrong, a war between villages |
| **The artificer** (light, power) | electricity, mechanism | dead machinery: a dark engine room; the verb wiring | wire; a stat of charge | light in magical darkness (the dark forest, the dens), powers dead mechanisms (ROOT_STUDY's buried water infrastructure, the ruins' dry basins, a spring restarted), draws lightning (the weather's strikes already exist) | irrigation, a mill, a waterwheel, lamps against the night raids | chain-lightning; the "strong ranged" of the party roles | the grid: a broken machine as antagonist, the dark itself |

Reading the table's columns against what exists: every "gift" is already a named W2 miracle or a
villager role; every "way through the world" is a wall the current build already has (the high
tunnel, the ruins' unread lore, the dark forest's drain, the spoiled land, the rival, the dry basins).
The companions are the answers to obstacles the world already poses, which is the "nothing just
because" test.

### 2.2 Recruitment, step by step (a proposal)

1. **Reach.** Her deep roots reach a karst only at a tier (G5's TIER_REACH); until then the villagers'
   rumors say a sleeper lies that way (G2's commune already carries bearings to unknown places).
2. **The pulse.** At that karst's node she channels clarity (a MIRACLE_GEMS-style board session,
   the pattern of purify and sanctify) into the karst; the runes climb; the sleeper wakes. DD's
   megapuzzle themed to the activating character is, for Hulda, the cultivation and channelling she
   already does; the far karst's puzzle belongs to the sleeper.
3. **Their opening.** The game switches to them for their own confinement→vista study, built and
   judged on the phone like every study: their material, their verb, their stat, their first
   material loop (the metallurgist's is done: ore → ingot → dagger → suit). It ends when they reach
   their karst's deep node from below.
4. **The link-up.** The two nodes join; Hulda can launch to their karst and they to hers; "a
   companion stands with her" becomes true when they are stationed in her territory.
5. **After.** They are directed (see 2.4) unless Noah wants them played; their tech tree grows at
   their own pool by their own verb, as hers does at the Wellspire.

### 2.3 Tech trees (a proposal, from DD's schema and Rootwake's precedents)

DD gave every dwarf the same three ledgers (crafts bought with stone, uncapped skills bought with
delving points, actives that ride with the dwarf) plus one specialty "horizontal spine" (seed library,
seven machines, seven tomes). Rootwake has three precedents: Hulda's perks (vigor, strike, sap, regen,
a choice per level), her cultivation tiers (gated by the land), and the metallurgist's suit (chest →
helm / legs / arms, each piece a blueprint learned and paid in ingots). The proposal:

- **A tree is blueprints and runes, learned from places.** The suit already is one. Each companion's
  tree is a small set of forms (the metallurgist's pieces; the mason's structures; the alchemist's
  brews; the librarian's folios and wards; the steward's compacts; the artificer's engines) learned
  by finding them (ruins, a village's elder, a machine read by inspection, as DD's "machine-reading"
  and "tangram fragments" and Rootwake's open "miracles learned from places") and paid for in their
  own material.
- **Growth is their verb at their own pool**, mirrored from G5: their own tiers, gated by the same
  land (villages thriving near their karst), so the world-state gate is one rule for seven characters.
- **Perks stay Hulda-shaped**: a choice per level among a few named bumps, one of them theirs alone
  (the metallurgist's darksight, the alchemist's vision dial).
- **The gifts of knowledge go into the village's tree, not theirs.** W2's miracles gain a source: a
  companion stationed at a village unlocks its gifts (bread needs the alchemist or the artificer's
  mill; a stone house needs the mason). The village stays the thing that grows; the companion is the
  reason it can.

### 2.4 Played or directed (Noah's open call, with the options on record)

- **Played** (DD's per-dwarf descents; Rootwake's U passes): the opening is played, always. Beyond
  it, DD's later frame was a full party in formation combat and, far later, a tactical sim "in place
  of dice-roll mechanics."
- **Directed** (Noah: "directed by Hulda as heroic units"): Rootwake already has the pattern twice:
  forest spirits stationed at a job (W1) and villagers' roles (V2). A companion stationed at a
  village or a place does their domain's work there (the mason builds, the alchemist tends the sick,
  the artificer keeps the lamps); Hulda summons them by root or by shrine and points them, the way she
  asks a villager to build.
- **Both, by place**: played in their own domain's places (the metallurgist underground, the librarian
  in a mind), directed everywhere else. Recommend this: it keeps each companion's playable study
  alive as a place to return to, and keeps Hulda the viewpoint on the surface, which every village
  system assumes.

### 2.5 What "a companion stands with her" should count

G5 counts `companions` toward tier 5 only. With Part 1's cube adjacency in mind, the count could be
read three ways: any companion recruited; a companion stationed in her territory; the three nearest
karsts' companions specifically (DD's own graph: artificer, steward, mason). Recommend the second for
the gate and the third for the story's order, so the first three companions built are the ones her
first karst's neighbours hold.

---

## Part 3. Calls that are Noah's

- Which of the six is built first. The metallurgist is furthest along; the librarian is sketched; DD's
  graph and G5's "three nearest" name the artificer, the steward and the mason.
- Whether the awakening is a pulse from her node (the proposal) or a journey on foot, and whether
  the switch to the new character is forced or offered.
- Played, directed, or both by place (2.4).
- Whether each companion's growth is their own verb at their own karst (the proposal) or Hulda's
  cultivation spent on them.
- Whether the gifts of knowledge belong to the companions (the proposal) or stay miracles bought with
  prayer regardless.
- Where the Eighth is in this world, and whether the rival (W3) is his hand.
- Names: DD's karst names (Anviltooth, Wallspire, Dynamo, Emberflask, the Moot, the Hush) against the
  Wellspire's working names (the Heron, the Anvil, the Needle, the Elder, the Stump, the Hood), and
  whether the seven karsts and the seven pillars are the same seven.
- The artificer's domain in a world without electricity: light and water and mechanism (the
  proposal), or lightning, or something Noah has seen in play.

---

## Part 4. Noah's brief from play (2026-09-27), and what it settles

Recorded from the conversation, in his words where they matter. These are the things he wanted while
playing and realized belonged to other heroes:

- **Better houses** — the mason.
- **Organizing the villagers** — "assigning guards, search parties, hunting parties, specific jobs
  to specific people a la Dwarf Fortress + DFHack + Dwarf Therapist" — the steward.
- **Hunting** — "needs quarry to hunt, which might interact with wolves e.g., but requires at least
  minimal tools (sharp sticks, hand axes); steward for organizing parties, mason/smith/artificer for
  weapons and traps."
- **A deeper village building and crafting tree** — "granary (mason), grain mill (mason, artificer),
  oven for breadmaking (mason). I could see contributions from other heroes for more advanced
  versions, but it feels like mason and steward are first needed."
- **Order**: "Steward may be first — the mason can use some sort of magic to do a fair amount of
  construction, but organizing the villagers is a bigger contributor and a better system to develop.
  The sage may make sense for the third — I could see where she may find ancient ruins with useful
  info, but she can't read or understand what's written. The sage could help her deepen and improve
  her own skills, help interpret the events of the world. They'd each be useful on their own, and
  quickly synergize as more are unlocked."
- **Two trios**: "The smith, artificer and alchemist bring in metallurgy, steam power/machinery,
  chemistry, which leans more into the industrial revolution, whereas the mason, steward and sage can
  fit more smoothly into a medieval-feeling situation with incremental improvements."
- **Travel**: "Only Hulda can travel by grass and root and karst node. She directs the heroes to
  locations and they travel by foot until we develop better transportation tech."

### What it settles (against Parts 2 and 3)

- **Order**: steward, mason, sage; then the industrial trio. Under DD's cube the steward's and the
  mason's karsts are two of home's three neighbours; the sage's is one ring out (adjacent to both of
  theirs, not to home). The medieval trio is a contiguous corner of that graph, which is a fair
  reason to keep it if the karsts are ever laid out.
- **Directed, not played, on the surface**: heroes are units Hulda points at places; they walk. DD's
  "traversal key" is dropped for the medieval trio: they open nothing by moving, her reach does. Their
  contribution is what they do where they stand. (Whether each still gets a played opening study when
  woken, as the metallurgist has, is untouched by this brief; see the open questions.)
- **Presence is the constraint that makes them units.** A hero on foot is in one village at a time,
  and the villages are hundreds of metres apart. The steward's jobs board only works where he stands;
  the mason only builds where he is. Sending them is a decision with a cost in sim days, and that is
  what keeps "directed" from being a menu.
- **The steward keeps Hulda's idiom.** `VILLAGERS.md` rules that "she never gives orders; she changes
  the world they live in." V2 planned roles "chosen by trait fit against what the village lacks; the
  elder can reassign; Hulda can, later, whisper a suggestion." The steward is the one who gives the
  orders. Hulda directs him; he assigns them. The Dwarf-Therapist screen is his, and it exists only in
  villages he has reached.
- **Gifts of knowledge get their sources.** Granary, mill and oven are W2's "bread from grain and
  water" and the stores' caps made buildable; the mason is their source, the artificer improves the
  mill. This answers Part 3's question about whether gifts belong to companions: they do, and the
  village stays the thing that grows.
- **Hunting is an ecology lever, not a menu.** `VILLAGERS.md` already lists "game (animals that
  wander and breed)" in the land and "Wolves (hunt game, then livestock, then the timid)" among the
  threats. Quarry shared between hunters and wolves means over-hunting is what sends the wolves to the
  pens: the equilibrium number gets a second term. Tools gate it in the plateau's own terms (a
  sharpened stick from a stick; the knapped hand axe recipe already exists).
- **The sage is the reader and the tutor.** `RUIN_LORE` lines already sit at every ruin and nobody
  can read them; the sage turns them into knowledge (a miracle or rune learned from a place, the
  open question in `VILLAGE_HANDOFF.md`). She also works on Hulda herself (G5's open "what else a
  tier should give" and the perks) and on the reading of the world (G2's state tags and omens, the
  fisheye's readouts, told through her).

### A pass order to argue with (not planned in detail)

- **C1. The steward.** *Question: does putting a hero in a village, and assigning its people through
  him, make the village feel organized rather than managed?* Where he sleeps and how he is woken
  (see questions); his walk to her village; the jobs board in the village panel where he stands:
  every villager, their trait fit, an assignable job (gatherer, builder, guard, searcher, hunter once
  C2 exists); guards who stand watch at night and meet wolves and Dark Young at the edge; search
  parties who walk out and find the places the rumors name and mark them on her map.
- **C2. Hunting.** *Question: does quarry shared with the wolves make hunting a judgement rather than
  a faucet?* Game animals that wander and breed on the land; the hunter job needing a tool (a
  sharpened stick, the hand axe); parties of two or three organized by the steward; meat as a store,
  and a smokehouse later; wolves that take game first, and the pens when the game is thin.
- **C3. The mason.** *Question: does a hero whose work is visible stone make a village read as
  settled rather than camped?* Stone houses (more room, warmth), the granary (store caps and
  spoilage), the mill and the oven (bread, the first knowledge gift with a building behind it), a wall.
  His construction is magic in the miracle pattern: a site the village raises is finished by his verb
  on the board when he stands at it.
- **C4. The sage.** *Question: does reading the ruins turn exploration into learning?* The lore read
  and kept; a form or miracle learned at a grove; her counsel on Hulda's tiers and perks; the events
  of the world interpreted in her words at the fisheye and the hub.
- **Then the industrial trio**, each raising the versions above (the artificer's mill, the smith's
  weapons and traps, the alchemist's medicine), by which time transport tech is a real question.

### Questions this brief opens

- **Where the three sleep and how they are woken.** DD: a statue on each karst's crown, woken by a
  pulse. Rootwake has the deep roots and the Wellspire's sister pillars (the Heron and the Anvil can be
  climbed). Options: a karst each, reached by root at a tier (DD's shape; three more karsts in the
  world); or nearer, within the walk of the villages (a ruin for the sage, a moot-stone between the
  villages for the steward, a quarry for the mason), woken by a channelling of clarity as a ruin is
  sanctified. The second keeps the medieval chapter inside the world that exists.
- **Whether each gets a played opening.** The metallurgist's U passes are one; the brief speaks only
  of directing. A short played awakening per hero (their confinement, their verb, once) is the
  record's answer to attachment; skipping it is cheaper.
- **Can a hero be hurt.** Hulda cannot die; villagers can. A hero walking between villages through
  wolf country either can be bitten (a real cost to sending him) or cannot (a unit with no stakes).
- **What grows a hero.** Their own stat and verb at their own place (Part 2.3), or Hulda's clarity
  spent on them, or the villages' prayer.
- **The board on a phone.** A jobs list per village fits the collapsible village panel; guards,
  searchers and hunting parties need a target as well as a job, which is a map tap.
