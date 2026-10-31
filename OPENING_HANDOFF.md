# Handoff: build the opening (slice O1/O2)

> Both slices are built on `feat/opening` and live at https://noahschmuckler.github.io/Rootwake/opening/ : see "O1 as built" and "O2 as built" at the end.

For a fresh Claude Code session. The design is settled and is in **`OPENING_SEQUENCE.md`** (read it first, it is short), with the
wider story in `OPENING_ARC.md`, `ECOLOGY.md` and `PROGRESSION.md`. Nothing in them is built. This file says what to build, where it
lands in the code, and how to check it. Written 2026-10-30 on branch `docs/vision`.

## Where the code is

- The entry is the village: `village.html` / `src/village.ts` (1,840 lines), with the rules in `src/villageModel.ts` and
  `src/deepModel.ts`. `VILLAGE_HANDOFF.md` describes it.
- **The match-3** is `src/match3.ts` (pure core) and `src/board3d.ts` (the gems as platonic solids, drawn in the world on the camera).
  In `village.ts` it is driven by `startSession(kind, …)` (line ~1034), with `boardView`, `session`, `endSession`, `onRun`, and
  `player.onTap` for the tap input. Session kinds: meditate, deepen, channel, sanctify, cultivate, wake, portal.
- **Clarity:** `CLARITY_CAP` = 60 and `CLARITY_PER_GEM` = 1 (`deepModel.ts`); `gather(deep, n)` adds a run's gems. `deep.clarity` is the
  value; the readout is `#clarity`.
- **The mode** `Mode` type (`village.ts` ~348) includes `'meditate'`, `'dive'`, `'deep'`, `'catwalk'`. The catwalk is
  `src/descentVisit.ts` (`DESCENT.md`, D1); `catwalk(depth)` is in `descentModel.ts`.
- **Petal** is only a design so far (`ADVERSARIES.md`, her look); no code.

## Scope

**O1: from the dark to the dive.**
1. **First launch only.** A dark screen; the platonic solids drift past, faster and more chaotic, then land in a dealt-in grid.
   Existing saves skip it; add `?opening=1` to force it (and a reset).
2. **A flat, full-screen board mode** for meditation: on entry the world fades quickly, a background field fills the screen, the gems
   are cel shaded for contrast. Not angled, not in the world. Keep tap-tap and **add smooth finger swipe** for moves. Both must work.
3. **The mind-water background:** a water shader with highly disturbed waves, lit by erratic, pulsing, multicoloured lights. Its
   chaos is a function of **current clarity / 60** only: roiling purple at 0, settling to a gentle blue with slow steady light
   rotation at 60. It shows on **every** meditation.
4. **A numbered meter** fills with each match, to 60.
5. **The ending:** at 60 the board fades fast, a single drop lands in the middle of the water, the ripples expand, and **the world
   fades in from the middle outward** (the same on every later meditation).
6. **The staged UI.** After the first fill she is on the summit in the streaming water with no UI; dragging moves the view. Then
   **Petal appears** (2D, an infant, smiling, short sentences), tells her to look around by dragging, and later to dive. Then the
   **compass**, then the **movement stick**, then the **dive** option. **Prayer, the fight and guard buttons, and stag summoning are
   hidden** until later. Hulda never speaks. Distant living things show faint halos or outlines only.
7. **Dive:** the water bubble offers only the way back to the summit and out to the **catwalk of D** (as built).

**O2: the scope and the deer** (can follow O1 once it is played).
8. At D, a snerk at a work station greets her and invites her to look in. The station is a hooded viewer like Spock's scope.
9. A button shows a dim tunnel view through a spirit deer (soil, grass and branches; it rises from the ground, wanders, sinks).
   She sees only the deer, and she can then embody it (observe only, no interaction). Reuse the stag figure (`mountFigure.ts`).

Sound is out of scope (later). The letter flip (`LETTERS` to D E L I V E R E V I L E D, thirteen) is **not** part of this slice.

## Conventions and traps

- **Do not break the other studies.** The village is one entry among many; CLAUDE.md says each study only adds its own entry. Keep
  existing sessions (cultivate, channel, sanctify, wake, portal) working: if the flat board replaces the in-world board, it must serve
  them too, or sit behind a flag until it does.
- **Existing saves and the journey.** The browser journey (`scripts`, `deploy-village.yml`) drives the village by buttons; the staged
  UI must not hide them from it. Provide a dev override (e.g. `?opening=0`) the journey uses.
- **Progress needs a save key** for the opening stage (new player, compass shown, stick shown, dive shown), like
  `rootwake-cultivation-v1`; migrate old saves to "all shown".
- **Mobile first.** Judge on a portrait phone viewport; a headless Chromium with `--use-angle=swiftshader` works (CLAUDE.md,
  "Headless checking"). Drive swipes with touch events, not clicks.
- **Cost.** The water shader runs under a phone's browser: keep it to a cheap full-screen quad with a few octaves, and read the vista's
  quality tiers (`vista.ts`).
- **Checks:** `npm run build` (tsc + vite), the unit suites in `tests/` that `deploy-village.yml` runs, a unit test for the swipe
  resolution (pure, in `match3.ts` terms) and for the opening-stage save, and screenshots of: the dark opening, the chaotic water at
  clarity 0, the settled water at 60, the drop's ripple, and the staged UI.
- **Branch and deploy.** `deploy-village.yml` fires on push to `feat/village` only. Make a branch from `docs/vision`
  (e.g. `feat/opening`); decide with Noah whether to merge into `feat/village` or add a workflow so he can play it on his phone.
- Standing rule from Noah: record every decision in the docs as you go, and keep commits small.

## O1 as built (2026-10-30, branch `feat/opening`)

**Decisions with Noah (2026-10-30):** the opening is built on `feat/opening`, branched from `docs/vision` (the vista line: `docs/vision` is
`feat/vista` plus the design record; `feat/village` had diverged by 345 commits and lacks the catwalk), with **its own workflow**
(`deploy-opening.yml`, on push to `feat/opening`) publishing to **https://noahschmuckler.github.io/Rootwake/opening/** and leaving every
other demo alone. The entry is **`opening.html`** → `village.ts` under the **vista look** with `__ROOTWAKE_OPENING` set. **O1 only** this
sprint; O2 (the scope and the deer) follows once O1 is played. **A first visit starts the phone fresh:** the studies on GitHub Pages share
one origin, so a phone that has played `/vista/village/` holds its saves; when the opening's save key is missing (or `?opening=1`), every
`rootwake-*` key is removed before the models load. (This wipes the other studies' saves on that phone, once.)

**Where it is.**
- `src/openingModel.ts` (pure): the stage save (`rootwake-opening-v1`: `opened`, `woke`, `looked`, `compass`, `stick`, `dive`, each a
  step done, read in order), `chaosOf` (1 - clarity / cap), Petal's lines, the drift's and the ending's timings (`DRIFT_S`, `LAND_S`,
  `ENDING`, `endingAt`). `match3.swipeTarget` resolves a swipe to the neighbour. Tests: `tests/opening.test.ts` (`node scripts/test-opening.mjs`).
- `src/mindScreen.ts`: the field. Its own orthographic scene drawn over the world (or instead of it while it covers everything): a
  full-screen water quad (`WATER_FRAG`: six directional sines, five lights that are the gems' colours, erratic and pulsing in chaos and one
  blue-white in a slow turn when calm; the drop's ripples; the reveal from the middle), the flat cel-shaded board, a finger pad for the
  swipe and the tap pair, the meter on the meditation panel, the drop. Phases `dark` (the first launch: the solids drift in) → `play` →
  `ending` (board fade, drop, ripples, reveal) or `leaving` (an early done). Chaos eases toward `chaosOf(deep.clarity)` at `CHAOS_EASE`.
- `src/board3d.ts`: `BoardStyle` (`flat` under a parent in an ortho view; `toon` with a black outline shell), `gemAt`, `swipe`, `driftIn`,
  `setOpacity`; the in-world board is unchanged for the other entries.
- `src/petal.ts`: Petal in 2D (a canvas: a corolla of petals round a round face, a leaf of a dress), a bubble of short lines, a tap for the next.
- `src/village.ts`: the `OPENING` flag block at the top (the wipe, the save); `mind` / `petal` beside `boardView`; `startFirstFill` at boot
  instead of the intro; `endSession` → `mind.end` at the cap or `mind.leave` early, then `finishSession`; `deepPlaces` returns the pool
  alone; `firstDiveOpen` true; the staged UI (`openingFrame`, `presentOpening`, the body's `opening` / `ui-compass` / `ui-stick` /
  `ui-dive` classes, `village.css`); the dev handle `__village.opening` (`state`, `step`, `mind`, `petal`, `fill(end)`, `done`, `skip`,
  `reset`, `dive`, `catwalk`, `drop`, `toPool`, `places`, `cellScreen` on `mind`).
- The staged UI: after the first fill she stands on the summit with nothing shown; Petal after `WAKE_PAUSE_S`, her last line held until a
  drag of `LOOK_RAD`; then her pleasure, then the compass with its line, then the stick with its line and a walk of `WALK_M`, then the
  dive option with her encouragement. Prayer, cultivate, help, the view toggle, the fight, the guard, the stag, the bars, the clock, the
  village panel, the clarity readout, tips and banners stay hidden in the opening entry (later chapters). `?opening=0` shows everything
  and skips the opening (the browser journeys' override); the village and vista entries are untouched.
- `scripts/browser-opening.mjs`: the headless check (SwiftShader, 390×844, touch): the dark first launch, the water at 0, a real swipe
  and a tap pair each a run, the settled water at 60, the drop and the reveal, the summit with no UI, Petal, the compass, the stick, the
  dive, the node's places (`['pool']`), the catwalk of D and back, a later meditation, a reload (skipped) and `?opening=0`. Screenshots in
  `artifacts/opening` (01-dark-opening … 12-catwalk-D). **Passes** locally (2026-10-31) with `test-mobility`, `test-opening`, `test-vista`
  and `test-village`; the workflow runs the same and publishes.

**O2 as built (2026-10-31, same branch).** In the opening entry the snerk at D's work station has three lines of its own
(`SNERK_SCOPE_LINES` in `openingModel.ts`, tapped through with the act button, `descentVisit.stationAct` taking over the station's act);
then the act reads "look into the scope". The scope is a hooded viewer beside the lectern (`scopeFigure.ts`, placed by `placeScope` as she
steps out onto D). Looking in (`startScope`, mode `deer`): a spirit deer (`deerModel.ts`, pure: rises in `RISE_S`, wanders in legs with
grazes, turns from ground it cannot walk, sinks after `LIFE_S`; the stag's figure dressed by `deerFigureState`) rises from healthy ground
8–26 m from the first village's green (`deerSpot`), and her eyes are at its head down a dim tunnel (`#scope .tunnel`, a radial vignette),
with the snerk's word "Deeper. Let it carry you." as a caption and two buttons, "look deeper" and "look away". Deeper (`lookDeeper`) the
tunnel opens and she is embodied, riding its wander with nothing to do but watch (the stick, the fight and every act are off; her feet
follow the deer, so the land loads and the map explores about it); "let go" or the deer's sink (`endDeer`) stands her at the station
again. Dev handle: `__village.opening.toSnerk / scope / deeper / letGo / deer / scopeStage`. The check walks all of it (13-scope-tunnel,
14-deer). Claude's readings: the deer is seen through its own eyes from the first look (the scope is "tuned to a deer"); the scope offers
nothing else; nothing of O2 is saved, so it can be looked into again.

**O2, taking the deer (2026-10-31, Noah's note after play).** Embodied, `CONTROL_AFTER_S` (4 s) after "look deeper" a "take control"
button joins "let go" (`controlBtn`, shown by `deerFrame`). Taken (`takeControl` → `deerModel.takeDeer`): the deer stops and waits on the
stick, the stick comes in (`body.deer-taken` shows `#tools`; the player is enabled on the locked world, as on the stag), and the push,
read by `want()` relative to her view, drives it (`stepDeer`'s `drive`): it turns toward the push at `DRIVE_TURN` rad/s and goes
at `TROT` × the push (2.6 m/s at full, above its own 1.1 m/s walk), stops short of ground it may not walk without turning away by itself,
stands unpushed (and grazes after a while), and its life does not run, so it stays until "let go". Her view while taken is her own on
foot (Noah's second note): `orbitCamera` behind the deer by her yaw, `DEER_CAM_BACK` back and `DEER_CAM_UP` up, the look drag turning
it, her yaw no longer written from the deer's heading; watching (not taken) her eyes stay at its head. Dev: `__village.opening.control()`,
`drive(dx, dz, seconds)`, `controlOffered`, `deer.driven`. The check takes it, drives it east, confirms the camera behind and a turned
yaw holding (14b-deer-taken). Claude's reading: the offer waits on the wander (she watches first).

**A restart begins again (2026-10-31, Noah's note: "restarting the page as a webapp skips the opening").** The load block treats a
saved opening that is complete like a first visit: every `rootwake-*` key is wiped and the opening plays again (a reload mid-opening still
resumes). The world does not persist past a restart for now; `?opening=0` still skips it with everything shown. The check's step 7 now
expects the board again after a reload.

**The board's finger on the phone (2026-10-31, Noah's note: "minimally responsive").** Three guards in `mindScreen.ts`'s pad, since the
cause could not be reproduced headless (the pad is on top of every gem there): a new touch always takes over `down` (the pad hidden
mid-touch at a session's end lost the lift, leaving `down` stale so every later touch was ignored); a flick whose moves never arrived is
read as a swipe at the lift; and a swipe made while the board is busy is kept `PENDING_MS` (0.7 s) and made when it is free instead of
dropped. If it is still poor on the phone, the next suspects are the frame rate under the Eden's figures and the render scale.

**Not in this slice:** the faint halos on distant living things (nothing new is drawn for them); sound; the letter flip; the observation
stage proper (what the instruments reveal per behaviour, the seasons: PROGRESSION.md).

**Traps found.** The water's alpha is a smoothstep in the reveal's radius: inside the radius the world, outside the field (the first
draft had it inverted and the field was invisible). The field's pad sits over the canvas (z 4) so the shared player gets no pointer
while the board is up. **The wall clock:** the village's `time` is capped at 50 ms a frame (a hitch must not throw her); under
SwiftShader the revealed summit draws at a frame or two a second, so anything timed on `time` stretches forty-fold (the ending's six
seconds took four minutes). The mind's water, the board's animations on it and Petal's pauses run on the wall clock (`now`, `real`)
instead; the check waits on the page's state with `waitForFunction`, never reads a flag right after causing it (the next frame may be
two seconds away). A real touch drag of the view cannot be checked there either: Chromium aligns pointer moves to frames, and the first
move lands after the player's 900 ms rest-hold timer has dropped the pointer, so the check turns the view by the handle when the drag
does not register. Petal is an image (a canvas drawn once and shown as `<img>`), not a live canvas. `ubuntu-latest` is 26.04 now, which
Playwright 1.58.2 cannot install Chromium on: the workflow pins `ubuntu-24.04`.
