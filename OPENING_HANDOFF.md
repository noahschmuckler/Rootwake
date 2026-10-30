# Handoff: build the opening (slice O1/O2)

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
