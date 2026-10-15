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

## For F2: clips to download from Mixamo
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
