# Fight study: the feel of a fight (F1–F4)

Branch `feat/vista`. Noah, 2026-10-15: after Hulda's new look, "more modern style fighting mechanics, visually thrilling and satisfying". The rules of the fight in `villageModel.ts` (damage, ranges, cooldowns, sap, the raiders' behaviour) are left as they are. This is a presentation and timing layer over them, so the balance of the raids and the dens does not move.

## The plan (agreed)
- **F1 · Impact** (built): every blow lands. Hit-stop, camera shake, a punch in, the foe driven back with a white flash, flecks and sparks, slow motion on the last kill of a wave, vibration, sound. Plus a practice clearing to judge it on the phone.
- **F2 · Staff and combo**: a thorn staff that grows from her birch sleeve when she fights. Tap, tap, tap for a three-hit combo with a finisher; hold for a heavy blow; motion trails. It needs Mixamo clips (the list below).
- **F3 · Dodge and root time**: swipe to dodge-roll. A dodge just as a bite lands slows the world and her taps become a flurry. Telegraphs come first: wolves crouch and their eyes glint before the lunge, and the Dark Young rear. A soft lock-on ring.
- **F4 · Spectacle**: the roots coil visibly round what they bind, a vine pull (a grapple to or from a foe), a poise meter and short cinematic finishers.

## F1 as built
- **`src/impact.ts`** (pure, tested in `tests/impact.test.ts`):
  - `Impact.hit(blow)` for `light | heavy | kill | finale | hurt | faint`, from `BLOWS` (tuning).
  - The stronger blow wins; blows never stack into a long freeze.
  - `step(real)` returns the world's time scale: `STOP_SCALE` during the stop, then a slow motion from `SLOW_SCALE` easing back to 1.
  - `push`/`pop` shake the camera (trauma², a few incommensurate sines) and punch the field of view for one render only, so no camera rig ever sees it.
  - Vibration through `navigator.vibrate` where there is one. Android has it; iOS Safari does not.
- **`src/hitFx.ts`**, all pooled:
  - **The slash:** a crescent whose bright head sweeps across her front, alternating side to side, with a copper tail (a small shader).
  - **The star:** a burst of light where a blow lands.
  - **Flecks:** instanced diamonds that tumble, bounce and settle. Her leaves always; a Dark Young's ichor (its eye-green flecks glow), a wolf's fur, a black wolf's red, soil.
  - **Rings:** a ring along the ground under heavy blows.
  - **The thorn burst:** 30 spikes tear up out of the ground in a wave from her feet, overshoot, stand and sink.
- **`src/fightSound.ts`**: Web Audio, synthesised, no files. A whoosh per swing, a thud on a hit, a crunch, falling note and ping on a kill, the thorns' crack, the roots' creak, her hurt. It wakes on the first touch.
- **`src/villageWorld.ts`**: `react(id, dx, dz, power, killed)` drives a figure back along the blow with a white flash and a squash. A killed wolf is thrown and stays thrown. `lunge(id, dx, dz)` is a biter's lunge at her. Presentation only: the model's positions are untouched.
- **`src/village.ts`**:
  - **`attack()`:** reads each blow's result off the raiders' hp before and after, and gives every one hurt its reaction, flecks and star. The strongest decides the feel. A kill when no foe of hers stands within 25 m is the **finale**, in slow motion.
  - **Bites:** a drop of `BITE_FELT` vigor in one step is felt as a bite. The biter lunges, her leaves fly, the screen's edge reddens (`#hurt`), the camera jolts.
  - **The frame:** the world's time is scaled by `impact.step` (hit-stop and slow motion). The render is wrapped in `push`/`pop`.
  - **Flags:** `?shake=0` keeps the camera still; `?mute=1` silences the fight. Debug handle: `__village.feel` (`impact`, `fx`, `sound`, `practice`, `spawn`).
- **The practice clearing**, `fight.html` → `/vista/fight/`:
  - The village under the vista with `window.__ROOTWAKE_PRACTICE`. The page lends the game an in-memory `localStorage`, so a practice never touches the village's own save.
  - Her on the meadow by the green at 10:00. The fight buttons open, the village panel collapsed.
  - Waves from `PRACTICE_WAVES` (one wolf, two, a Dark Young, three wolves, mixed, two Dark Young) are set down 8 m round her front, hunting her (`spawnFoe` in the model), and never lose interest.
  - Her vigor and sap are made whole between waves. Past 16:00 the clock goes on to the next morning.
- **Checks:** `node scripts/browser-fight.mjs` (CI, low tier) checks:
  - the storage is the page's own;
  - a wave comes;
  - a strike lands, stops the world and shakes the camera;
  - flecks fly and the thorns rise;
  - a bite reddens the edge;
  - the wave's last foe falls in slow motion and the next wave comes.

  Screenshots go to `artifacts/fight/`.

## F2 as built (2026-10-17)
Noah supplied all ten clips; they are in `public/models/clips/`. The build lists the seven it plays as `__FIGHT_CLIPS__` (`vite.config.ts`) and loads them after the gait's. `dodge.fbx` waits for F3; `jump-attack.fbx` and `combo.fbx` are kept for reference.
- **`src/huldaMoves.ts`:**
  - `MOVES`: each move is a window of its clip. `from`, `contact`, `chain` and `to` were read off the clips' hand speed, and each plays sped up by `scale`, so the blow lands 0.2–0.35 s after the press.
  - `MoveQueue` (pure, tested):
    - A tap chains attack-1 → attack-2 → attack-3 (the finisher).
    - A press during a move is held and starts the next one at the current move's `chain` time. The latest press wins, so mashing doesn't run on after the hands stop.
    - The combo resets when the taps stop. A bite makes her flinch only when she isn't mid-move.
  - `createMoveLayer` plays the clips on the gait's mixer at manually set times. Standing, the whole body plays the move and the gait gives way (`Gait.suppress`, new in `huldaRig.ts`). Moving, only the spine, arms and hands play it, weighted to win over the gait there, so her legs keep running.
- **The rules at contact.** The fight's rules now run when the blow lands, not at the press.
  - The finisher and the held **heavy** blow hit harder: `FINISHER_MULT` 1.6 and `HEAVY_MULT` 2.2 in `villageModel.ts`. This is an open tuning question for the phone. Their longer wind-ups keep her damage over time near the old strike's.
  - The thorn burst and root bind ride the casts. Their cooldowns start at the press; the sap is spent when they land.
  - **The strike button:** a press is a light blow at once; held past `HOLD_MS` (260 ms), it is also the heavy blow.
  - **The soft lock:** a press turns her most of the way toward the nearest foe ahead (`FACE_*`).
- **`src/huldaStaff.ts`:**
  - **The staff** rides her `RightHand` bone. In that bone's frame +X runs through the thumb, so the shaft lies along X through the curled fingers.
  - It has a birch shaft wound with a copper vine, thorns along the head, a knot of leaves and a glowing seed.
  - It grows out of her fist on her first blow and withdraws `STAFF_KEEP_S` after the last one, once nothing hunts her within `STAFF_NEAR_M`.
  - **The trail:** an additive ribbon between the staff's head and a point down the shaft, sampled each frame through a swing and faded by age.
- **Fallback:** without the clips (`?fightclips=0`), F1's instant blows and the swept slash remain.

## F3 as built (2026-10-17): the guard, the dodge, the tells, root time
Noah's design: a **guard** button beside the fight column, under the left thumb (`#guard`).
- **Holding guard:**
  - She stands in her fighting stance (`MoveLayer.guard`, a held frame of attack-2), facing the foe she is locked on.
  - A bite takes `GUARD_TAKE` (0.35) of itself. This is an open question for the phone.
  - The stick no longer walks (`player.moveSlowdown`). Pushed past `DODGE_PUSH`, it rolls her that way, relative to the camera, once per push.
- **Future "down" modifier:** the same button is meant for a crouch (double tap; slow and stealthy), diving when swimming, going down in flight, and going under the soil. None of those is built yet.
- **The roll:** `dodge.fbx` from just before the dive (`MOVES.dodge`).
  - She is carried `DODGE_DIST` (2.8 m) along the clip's own travel (`dodgeProgress`) by `Player.slide`, which keeps to walkable support and stops at colliders.
  - She is untouchable from the dive to `EVADE_TO`, about 0.4 s.
  - A roll cuts any move short.
- **Tells** (`villageModel.ts`):
  - A foe hunting her winds up for `TELL_S` (0.55 s) before a bite: `tellOf`.
  - Wolves crouch and their eyes flare. Dark Young rear and their horns go still and stand forward. A coloured glint and a snarl mark the start of each tell.
  - A bite once begun lunges as far as `LUNGE_REACH` (2.3 m). Beyond that, the wind-up is wasted.
- **Root time:**
  - A bite that lands while she rolls misses (`defense.dodged`), and so does a wind-up she rolls out of reach of.
  - Either way, root time begins (`Impact.rootTime`): the world runs at `ROOT_SCALE` (0.22) for 2.2 s while she keeps her own pace (`Impact.herScale`), and her moves run `ROOT_FLURRY` (×1.4) faster.
  - The screen's edge greens over, with roots curling in from it (`#rootTime`). A low drone and a bell sound.
- **The lock:** the nearest foe hunting her within `LOCK_M` (9 m) has a ring on the ground, which turns orange in its tell. Her blows turn to it first. Tapping to switch is not built yet.
- **Model contract:** the entry sets `defense.evading` and `defense.guarding` each frame. The raiders' step adds `lunges`, `dodged` and `blocked`, and `defended()` in `village.ts` reads and clears them.
- **Checks:**
  - `tests/impact.test.ts`: root time, the roll's window, and the tell, guard and roll against a bite.
  - `scripts/browser-fight.mjs`: a bite on her guard takes a share; a roll as the bite lands misses and starts root time; the roll carries her.
  - Screenshots go to `artifacts/fight/`.

## For F2: clips to download from Mixamo (done)
Download each with the same settings as the clips already in `public/models/clips`:
- Format **FBX Binary**, **Without Skin**, 30 fps.
- **In Place** ticked where offered.
- The character can stay the X Bot. They retarget to her by bone name.

Drop them into `public/models/clips/` with the file names below. The names in quotes are Mixamo's search terms. Where Mixamo has several takes, pick the one that reads best two-handed; a staff is held like a great sword or a spear.

| File | Search Mixamo for | Use |
|---|---|---|
| `attack-1.fbx` | "Standing Melee Attack Horizontal" | combo, first swing |
| `attack-2.fbx` | "Standing Melee Attack Backhand" | combo, second swing |
| `attack-3.fbx` | "Standing Melee Attack 360 High" (or "Great Sword High Spin Attack") | combo finisher |
| `heavy.fbx` | "Standing Melee Attack Downward" (or "Great Sword Slash") | held heavy blow |
| `cast-burst.fbx` | "Standing 2H Magic Area Attack" | the thorn burst |
| `cast-bind.fbx` | "Standing 1H Magic Attack" (or "Standing 2H Cast Spell") | the root bind |
| `dodge.fbx` | "Stand To Roll" (or "Sprinting Forward Roll") | F3's dodge |
| `hit.fbx` | "Standing React Large Gut" (or any "Hit Reaction") | when she is bitten |
| `jump-attack.fbx` (optional) | "Standing Melee Run Jump Attack" | a leaping opener |
| `combo.fbx` (optional) | "Standing Melee Combo Attack Ver. 1" | a reference for timing |

If a search term finds nothing, any clip with the same action works. The names in the table are what F2 will look for.
