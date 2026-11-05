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

## F5a as built (2026-11-02)

The question: *does a pull and a swap feel good in the practice clearing?* Live at https://noahschmuckler.github.io/Rootwake/whip/ (the practice clearing, `fight.html`, published from `feat/whip` by `deploy-whip.yml`).

- **The button.** An amber **whip** button above strike in the fight column, in the practice clearing only (or any village page with `?whip=1`). A press plays a figure on the foe the stick points to; with the stick at rest, the foe she faces. A press during a figure waits and plays the next as soon as it ends (the first, simplest auto-chain). A strike press takes the staff back. **Open**, still for Noah: whether this stays its own button or becomes the dodge (the guard's stick roll), as the brief proposes.
- **The figures** (`src/whipModel.ts`, pure, `tests/whip.test.ts`). `planFigure` reads the arrangement and returns a plan: her path, each foe's path (with its lift off the ground and its roll onto its side), the clips and their cues, the rope's reach, and the beats.
  - **Matador**, a foe 3 to 9 m off: lashed at 0.22 s, hauled in face first along the rope while she sidesteps `SIDESTEP_M` out of its line, clotheslined as it passes her shoulder (`CLOTHESLINE_MULT` 1.6× her strike), its legs thrown up, and down prone 2.4 m behind her for `PRONE_S` before it gets up. She pivots to watch it land.
  - **Swap**, a foe 1.2 to 6 m off: lashed and hauled a step, then she cartwheels past it on one side while it is whirled past her on the other; she ends where it stood, turned back. It crashes into a neighbour within `CRASH_R` of her old spot (both take `CRASH_MULT`, both knocked down for `STAGGER_S`), or skids down there (`SKID_MULT`).
  - **Choosing:** the target is the foe nearest the aim's line within `WHIP_REACH`; the figure is whichever fits its distance, and where both fit (3 to 6 m), the one she did not do last. The side is the one with fewer foes on it, and each plan is checked against `standable` along her path and at each foe's end; the other side is tried, else no figure (a crack at the air).
- **The model contract, as read from the raider step.** WHIP.md's proposal held up, with these corrections:
  - `Raider.choreo` (seconds, not saved) pauses the raider's own step entirely, before the root hold, the hedges and the bite. Its `biteClock` is zeroed each step, so it comes out of a figure needing a whole wind up: that is the stagger. The scene writes its x, z and heading from the plan each frame and keeps `choreo` at the plan's time left. No separate stagger state was needed.
  - Damage goes through a new `lash(v, id, mult)`, which is the model's private `hurt` at a multiple of `strikeDamage`. A foe killed or beaten mid-figure (dead, or a Dark Young retreating) is let go at once.
  - `defense.flowing` (set by the entry while her part plays): a bite in that window misses, **without** root time. `evading` would have started root time on every bite through a flow.
  - Foe slots for the ring are not needed by F5a's two figures and are left for F5b.
- **Her moves** (`huldaMoves.ts`): `whip-crack`, `whip-pull`, `sidestep-l`, `sidestep-r` and `cartwheel` join `MOVES`. Their windows were read off the clips' hand speed with three's FBXLoader under node. `whip-pull` is Mixamo's 14.7 s rope pull; its first haul, 1.95 to 2.95 s, is the window. `MoveQueue.play(move, dur)` starts a move at once, its window stretched to the plan's cue. The figure moves her with `player.slide`, so walls stop her.
  - The other seven clips are not loaded yet (`whip-ready`, `slide`, `flip`, `leap`, `spin`, `fling`, `land`); they belong to later figures.
- **The lash** (`huldaWhip.ts`): a 26-point tapered tube drawn along a curve each frame from her right fist, vine to leaf green. At rest it hangs and swings behind her fist; it reaches to the target's chest as the plan's rope goes out, a loop runs down it as it flies (the crack), it sags slack and pulls taut. It grows out of her fist as the staff withdraws, and back.
- **The foes' bodies** (`villageWorld.pose`): lifted and rolled about their own length while a figure holds them. The figures' setters now reset all three rotations each frame.
- **Feel:** the lash cracks (`fightSound.crack`: a rising swish, a snap, a ring) and sparks at the foe's chest; the haul creaks (`fightSound.haul`); the clothesline, crash and skid land as her blows do (`landBlows`: hit-stop, shake, flecks, the finale on the wave's last). A figure's time is her own, so hit-stop and root time hold it too.
- **Fixed on the way:** the practice clearing had stopped loading since free mode. `village.ts` required the opening's `#free` button, the module threw, and nothing after it ran. The button is now optional.
- **Checks:** `tests/whip.test.ts` (in `scripts/test-vista.mjs`), and `scripts/browser-whip.mjs`, which plays a matador and a swap with a neighbour in headless Chromium and screenshots them to `artifacts/whip/`.

### After Noah's play (2026-11-02 to 11-05)

- **The judder.** Her walking gait flickered in and out every other frame under any fight pose held at full weight. The parkour layer had guessed whether the fight's move layer had already set `gait.suppress` that frame, and on alternate frames it guessed wrong. It was found by recording her bones at a true 60 fps, with the game's frames stepped by hand. Now the gait clears `suppress` each time it reads it, and each layer re-asserts its own value every frame. `huldaRig.ts`, `huldaTraverse.ts`.
- **A figure flows.** Its beats no longer hit-stop. The lash, haul and landing are sound and sparks. The clothesline, crash and skid stop the world for at most `FLOW_STOP` with `FLOW_TRAUMA` of camera shake. A foe a figure carries is not pushed off its path. The figure's clips blend in over `PLAY_FADE_IN`.
- **The lock, the guard and the soft lock** no longer snap:
  - The lock keeps its foe unless another is `LOCK_SWITCH_M` nearer.
  - In her guard she turns to it at `GUARD_TURN`.
  - The soft lock's camera turn eases in (`FACE_EASE`).
- **Combat mode (the narrow focus).** Noah: "dial down draw distance so only enough renders to make combat cohesive".
  - **Trigger:** a foe within `FOCUS_M`, or a figure playing.
  - **Haze:** the look's gloom fog turns to the horizon's colour and is opaque by `FOCUS_FAR`. The village's own fog closes with it, and the camera draws no farther.
  - **Grass:** thinned to `FOCUS_GRASS`.
  - **Pixels:** past `COMBAT_ON` the pixel ratio drops to `COMBAT_DPR` and the bloom goes off, once each way.
  - **Noah's verdict:** smoother on the phone, and he prefers the look.
  - **Switches:** `?focus=0` gives the whole view; `?dpr=N` and `?bloom=0` were left in for judging cost; `?hud=1` gives the worst frame too.
- **Noah's decisions (2026-11-05):**
  - **The camera** turning with her through a figure works; kept.
  - **The whip becomes the dodge (on trial).**
    - Its first `WHIP_EVADE_S` is the roll's untouchable window, so a bite met by a timed press is rolled clear of and root time begins. Later in a figure bites only miss.
    - When no figure fits (foes pressed against her, or every foe already down), she rolls out of their reach, away from their middle, and turns with the camera to the nearest attacker after.
    - The guard's stick roll is unchanged.
  - **The danger mark.** A disc over her head while a foe within `LUNGE_REACH + DANGER_NEAR` of her winds up to bite. It grows and reddens toward the bite, so the eye can stay on her to time the dodge.
  - **The strike seeks.**
    - A press picks the nearest foe within `STRIKE_SEEK_M` in any direction, even one over her shoulder.
    - Out of reach, she darts in at `DASH_SPEED` to `DASH_STOP` from it, faces it through the swing, and the blow lands on it.
    - A foe whipped down just out of reach is struck.
