# The whip: fluid fight choreography and grace

Design discussion with Noah (2026-11-02), a draft spec, not a pass. Nothing here is built. It continues `FIGHT_HANDOFF.md` (F1 to F3 as built, F4 planned: a vine pull) and sits under `DUNGEON.md` (the whip is that dungeon's key ability). Lines marked **Noah** are his decisions; **Claude** lines are proposals; **Open** lines wait on him.

## The brief (Noah)

- The staff is planted, hard, pounding. The whip is **fluid, fast, flowing**. The wow is Batman: Arkham City's first dodge through a crowd of mooks, weaving over and under them as punches fly, unharmed and acrobatic.
- The baseline whip dodge moves Hulda and the combatants around: swapping positions, sliding under legs, twirling them past each other, building momentum as it spins and disorients them, and leaving her owning the battlefield.
- **The staff is her only weapon.** It converts to the whip and back.
- The showpiece: she starts left, the mooks cluster right. She whip-grabs one, pulls it to her and clotheslines it like a matador, knocking it prone behind her. She grapples another, launches into the air, whips in an impossible arc that drags foes along the ground beneath her, up behind her and overhead, and smashes them down in the midst of the crowd. They scatter, then re-form in a circle round her. With accumulated **grace** she casts an empowered root that grasps each of them, then thorn to finish them all.
- He wants procedural choreography with built-in variety, entertaining to watch, and a system for accumulating grace and spending it on more powerful and spectacular moves.

## The idea (Claude)

Each flourish is a **figure** with a precondition (how the crowd is arranged) and a postcondition (how it is arranged after). A **director** chains figures so each starts where the last ended. Variety comes from the arrangement and from a rule that rewards novelty. The player gives one button and a stick; the system chooses the figure.

### Figures

| Figure | Precondition | Postcondition |
|---|---|---|
| **Matador** | a foe 3 to 9 m ahead | the foe prone behind her |
| **Slide-under** | a foe in its lunge tell, a perfect dodge | she is behind it, it is staggered facing away |
| **Swap** | a foe in reach of a grab | she and the foe have traded places; the foe crashes into a neighbour |
| **Weave** | two foes with a gap between | both fallen inward, she is through the gap |
| **Spin** | foes within whip reach on several sides | foes dizzied and flung outward; each beat adds speed and a disorient stack |
| **Aerial drag** | two to four foes clustered | foes slammed into the crowd's middle, scattered, then re-forming in a ring |
| **Anchor slingshot** | an anchor (a pylon, tree or obelisk) within reach | she lands among the foes; the same anchor type as the dungeon's swings |
| **Hook and pull** | a caster or flier out of reach | the foe pulled into melee range |

### The director

- It lists every figure whose precondition fits the arrangement now, and scores each by **fit** (geometry, clear paths), **novelty** (not among her last three) and **pacing** (a flowing figure alternates with a hard-hitting one).
- Each play of a figure takes parameters: mirror side, arc height, spin turns, speed, and which foes. A 10 to 20% chance picks an off-score figure.
- It is **seeded** (like `?seed=`), so a fight can be replayed in tests.

### Controls

- **Dodge is the whip button.** Pressed in combat it turns the staff into the whip and starts the flow.
- The stick picks the side to flow toward. A tap in a foe's tell is a perfect dodge, which earns root time (F3) as now.
- Holding grabs. A strike press ends the flow and returns the staff, for a planted blow.
- **Claude, for a four-year-old:** soft lock, auto-chaining, no way to fail (she faints and wakes at the Ever-Hearth).

### Grace

- **Claude:** a meter in pips (five). A figure earns the most when it differs from the recent ones, so repeating yourself pays little and variety is the strategy.
- Extra grace comes from passing through foes unharmed, perfect dodges, and foes hitting each other.
- Being hit drops it. It decays after about three seconds out of combat.
- **Spend it in tiers:**
  - one pip: a grab finisher;
  - three pips: **Empowered Root**, every foe in the ring bound (the existing `cast-bind`, widened);
  - the full meter: **Thorn finale** after the root, the existing thorn burst, in slow motion using `Impact`'s finale.
- Grace is on top of sap: the normal casts still cost sap.
- **Open:** whether grace replaces sap for the empowered casts, and the tier costs.

## How it fits the code (Claude, from the docs; not yet checked against the combat loop)

- A pure module, say `flowModel.ts`, takes the arrangement (her position and heading; each foe's position, heading and tell state) and returns a **plan**: her path, each foe's path, and timed beat events for damage, FX and sound. It can be tested in node like `impact.ts` and `huldaMoves.ts`'s `MoveQueue`.
- Each plan is checked against walkability before it plays, the way `validateTraversal` checks a jump.
- **Foes' positions:** F1 made displacement presentation-only (`react()` in `villageWorld.ts`; "the model's positions are untouched"). Swapping and dragging foes needs real positions. `Raider` already has `rooted` and `held`; a similar `choreo` flag would pause a foe's AI and let the plan drive its x and z, with damage through the model's own `hurt`. On the plan's end the AI resumes with a stagger.
- **The ring:** foes need slot assignment so they re-form round her at about 3 m. That also sets up the finale.
- **The whip** is a short rope simulation, like the staff's additive trail ribbon in `huldaStaff.ts`, plus procedural arm-aim at the target. The staff rides her `RightHand` bone.
- **Feel:** new `Impact` blows (crack, sweep, slam) for hit-stop and shake, a synthesised whip crack in `fightSound.ts`, and a slow-motion finale. The camera keeps `Impact`'s push and pop and gets only small nudges, because the phone's field of view is narrow.
- **Budget:** keep to the phone's 20 to 30 fps. The rope stays short, and plans are computed once per figure, not per frame.

## Mixamo clips to fetch (Claude: search terms, not verified names)

Same settings as the clips in `public/models/clips`: **FBX Binary, Without Skin, 30 fps, In Place ticked**, X Bot as the character. Her travel comes from the plan, not the clip, so In Place throughout. Save each with the file name below. Mixamo's catalogue changes, so any clip with the same action will do.

| File | Search Mixamo for | Use |
|---|---|---|
| `whip-ready.fbx` | "Fighting Idle" (or "Boxing Idle") | the loose, bouncing flow stance |
| `whip-crack.fbx` | "Standing 1H Cast Spell" (or any one-arm overhead throw) | the lash |
| `whip-pull.fbx` | "Pulling" or "Rope Pull" (or "Tug") | the grab and haul |
| `sidestep-l.fbx`, `sidestep-r.fbx` | "Dodging Left" and "Dodging Right" | the matador's sidestep, the weave |
| `slide.fbx` | "Running Slide" (or "Slide") | slide-under |
| `cartwheel.fbx` | "Cartwheel" | weaving through the crowd |
| `flip.fbx` | "Front Flip" (or "Standing Jump Flip") | the aerial drag, the slingshot |
| `leap.fbx` | "Standing Melee Run Jump Attack" | the leap (already listed as `jump-attack.fbx` in FIGHT_HANDOFF, optional) |
| `spin.fbx` | "Standing Melee Attack 360 High" is `attack-3`; add "Capoeira" or "Spinning" if one reads well | the spin figure |
| `fling.fbx` | "Throw" (or "Hurricane Kick") | the release of a spin, the slam |
| `land.fbx` | "Hard Landing" (or "Jump Landing") | the end of a leap |

Foes need no clips: their reactions (flung, prone, dizzied, getting up) are procedural through `react()` and the plan.

## Passes (proposed)

Each answers one question, judged on the phone before the next.

- **F5a, the whip and two figures.** *Does a pull and a swap feel good in the practice clearing?* F4's vine pull, the rope, the matador and the swap, with the `choreo` flag.
- **F5b, grace and the ring.** The meter, the novelty rule, foe slots, Empowered Root and the thorn finale.
- **F5c, the director.** The remaining figures and the scoring, with seeded replays in tests.
- **F5d, the aerial drag and the slingshot.** The showpiece and the anchors.

## Open

- Whether grace replaces sap for the empowered casts, and the tier costs.
- Whether the staff-to-whip change is a button, or happens automatically on a combat dodge.
- Which figures a four-year-old can trigger on her own, and how much she can be left to the auto-chain.
- How the camera frames a spin or an aerial drag on a narrow phone screen.
