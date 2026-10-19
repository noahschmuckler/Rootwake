# Mobility lab v3

## Play

The same Player and thumbstick binding are used by the plateau (trees,
tilling, cabin building), the underworld, and the laboratory. The new lab
course is physically connected through the **east end of the study hall**;
the original live rust monster and six motion studies are unchanged.
Use the LAB selector to visit Speed track, Slalom, Jumps / drops, Normal
parkour, Powered parkour, or Flight rings. `lab.html?course=track` starts
at the track; `?course=flight` starts at the flight equipment station.

### One-thumb ground controls

Drag MOVE immediately to walk; small displacement creeps, full displacement
runs. Movement is camera-relative, with wall sliding and no diagonal boost.
Keep the thumb still for 430 ms to show landing circles, then deflect in the
desired direction and distance. Release to commit. Return to neutral or
cancel the touch to cancel. Walking never turns into target mode mid-drag.

Green circles walk, gold circles jump, and blue circles drop. The selected
circle is white and shows its trajectory and height difference in the HUD.
Targets use real support and body-clearance checks and are drawn as unfogged
overlays, so irregular rock cannot hide or slice through them. A visible
circle does not waive collision: the swept route and landing must both be
safe. Equipment, reach, and route validity are checked again on release.

### Powered legs and hover

Long-press an ingot and select the four-ingot powered-leg forge blueprint;
complete the existing forge interaction, then long-press the finished legs
to equip. Like the helm, the legs attach to the chestpiece. Removing the
chest also removes attached equipment. The lab's two armor racks offer the
same equipment through the Trial legs button, without having to forge it;
that button works only near a rack and is not available in other worlds.

The legs increase base run speed from 2.8 to 5.8 m/s, horizontal target reach
from 4.2 to 8.5 m, and maximum upward landing difference from 1.1 to 3.2 m.
Energy and encumbrance modifiers still apply. These are prototype tuning
values, not promises about later progression or balance.

Tap MOVE, then tap again and hold at least 140 ms to ignite. The second tap
must start within 290 ms of releasing the first. The right stick controls
forward/backward and strafing. The appearing left stick controls altitude
(up/down) and yaw (left/right). Each stick owns an independent touch.
Release both to hold altitude for 2.5 seconds, then descend at approximately
1.15 m/s and land. Re-grip either stick to resume hover. A double tap while
flying cuts thrust immediately and restores gravity; removing the legs
also cuts thrust. Ascent is bounded by ceilings and a 14 m launch-relative
safety limit. This is upright hover flight, not pitch/roll aircraft flight.

Desktop: WASD movement; F toggles powered hover; while hovering R/V raise
and lower altitude and Q/E turn. The pointer joystick remains usable with
a mouse. World dragging still looks around.

### Free volume (a world without ground)

A world can put the same body in a medium instead of on a surface: set
`player.free = true` and give it a `traversalWorld` whose `surfacesAt` is
empty and whose `canOccupy` is the whole rule (roof, floor, anything solid).
The first such world is the root study's soil (`ROOT_STUDY.md`). Nothing
changes for grounded worlds; the motor's mode is `'free'` only there.

Drive is camera-relative in three dimensions: forward follows the pitch, so
looking down and pushing sinks; strafing stays level; the keyboard's R/V add
a vertical axis. The sweep slides along whatever stops it, axis by axis, as
the ground drive slides along walls. There is no gravity, jumping or
falling, and thrusters cannot ignite. Speed is the ability's run speed.

Hold-centre targeting lays the same rows and bearings, in view space,
EYE_HEIGHT below the line of sight, so the fan reads on screen exactly as
it does on the ground at any pitch; a `'drift'` target (lilac) is a straight
line whose every sample must be occupiable and whose length is bound by the
same reach (`planDrift`). Leaving the medium (`player.free = false`) drops
the body to the nearest support; the study teleports it onto the surface
it rose to.

## Parkour (the stick alone)

Noah (2026-10-19), after the old bridge's first step stopped her: rather than smooth the bridge, the
movement takes any ground that ought to be climbable, with no input beyond pushing the stick the way
she should go. `parkour.ts` plans the move; the motor (`MobilityMotor.parkour`, opt in per world: the
village and its studies turn it on, the lab's measured courses keep it off) asks for one when the drive
presses into ground the walk cannot take, a lookahead 0.14 m along the drive: a rise past STEP_HEIGHT,
a drop, something in the way. A drop, a vault or a leap goes at once; a face to climb needs
CLIMB_INTENT_S (0.12 s) of pressing, so sliding along a wall never climbs it. Every move is a keyed
traversal through the same swept body test as a jump (`validateTraversal`) and lands only on a full
footprint, so it can take her nowhere the walk and the fan could not stand her.

| Move | When (normal legs; tuning in `PARKOUR`) | What she does |
|---|---|---|
| step | a rise to 0.3 m | a knee up, no hands (the bridge's foot) |
| step, on a slope | a sloped foot to 0.48 m (a ramp, the old bridge's deck and its curb, a bank: one that gains most of its rise over SHEER_W, 0.15 m, or more) | the step, not the clamber |
| clamber | a sheer face to 0.48 m, about her waist | the mount: hands and her left knee on the top, then up into a crouch on it and standing |
| mantle | to 1.25 m | a crouch, a hop that puts her hands on the lip, the press up |
| climb | to `climbRise` (1.75 m; 3.2 with the powered legs) | a jump to a hang, a breath, the pull up and over |
| vault | a top to 0.6 m high and no thicker than 0.9 m, ground beyond at about her height | over it without stopping |
| hop | a drop to 0.95 m | a short arc down |
| hangDrop | a sheer drop of 1.15 m or more (to `maxDrop`) | she turns to the wall, lowers to a hang off the lip, lets go |
| leap | a gap she runs at (1.6 m/s or more), ground across it within `leapReach` (2.6 m; 4.5 powered) | a running jump |

A rise past `climbRise`, a drop past `maxDrop` and a gap past `leapReach` stop her as before. Water is
never leapt (the plateau's `canOccupy` refuses the air over it), so the rivers stay barriers but at
their crossings. The motor exposes the move (`motor.traversal`, `traversalTime`); each carries its
stages (crouch, reach, hang, pull, over, land; turn, lower, fall) and the way she faces (`face`).

### Parkour clips

Noah's Mixamo clips (2026-10-19) are in `public/models/clips` (FBX Binary, Without Skin, 30 fps):

| File | Plays |
|---|---|
| `step-up.fbx` | the step |
| `mount.fbx` | the clamber: hands and the left knee onto a waist-high top (its obstacle lies to her left; the layer turns it ahead), then the landing's crouch risen out of to standing |
| `jump.fbx` | the crouch and spring of a mantle's or climb's reach |
| `jump-to-hang.fbx` | the catch: hands on the lip, the feet finding the face |
| `hang.fbx` | the hang, held (a climb's breath; before a hang drop lets go) |
| `climb-up.fbx` | the pull up and over; played backwards, lowering into a hang |
| `vault.fbx` | the vault |
| `hang-drop.fbx` | letting go from the hang, the fall and rising from the landing |
| `running-jump.fbx` | the hop, the leap and the fan's own jumps and drops |
| `landing.fbx` | landing a hop or a leap (deep and slow past BIG_LANDING, 1.6 m); the clamber's crouch on the top and standing |

`clamber.fbx` (a short wall climb) is kept but not played: on a waist-high top it had her climbing air (Noah, 2026-10-19).

Each stage of a move names its clip window (`WINDOWS` in `parkour.ts`: clip seconds and pace). The
planner shapes the stage's path on the clip's own motion (`parkourClips.ts`: the lowest foot's height
and the hips' travel forward, every 0.05 s): up and down with the foot, forward with the hips,
stretched to the real heights and distances. The layer (`huldaTraverse.ts`) takes that travel back out
of the clip: the hips are pinned across and kept at their height over the lowest foot, so her feet stand
on the path. On sheer blocks, where the shaped path would cut a face's top, the same stages are keyed
safe (up, then over; or out, then down). `node scripts/parkour-clips.mjs` rewrites `parkourClips.ts`
after a clip is replaced. `?parkourclips=0` turns the layer off in the village.

### The practice course

`/parkour.html` (`parkourStudy.ts`, `parkourCourse.ts`; live at `/vista/parkour/`): Hulda in the
village's third-person framing on one lane of each move. The left lane is a stair of rises (step 0.25,
clamber 0.45, mantle 1.1, climb 1.6) ending in a sheer 3.4 m drop. The middle lane has three rails to
vault, a block to clamber onto and hop off, and a pit to leap. The right lane has a wall too high and
a pit too wide. On the far right is the old bridge's foot, shaped as the plateau shapes its deck. `?hud=1` shows the move and its stage;
↺ goes back to the start. `scripts/browser-parkour.mjs` runs it in CI, and `npm run test:mobility`
walks every lane with the motor alone.

## Courses and measurements

The 16 m track exposes instantaneous speed and elapsed time. The slalom has
five ordered gates around blocking columns. A separate hurdle lane tests
same-height hops. Normal parkour includes short/long jumps, progressively
raised pads, and a deliberate drop; powered parkour uses larger gaps and
higher pads that reject normal movement. The recovery floor and ramp let
a player return without being stranded. Seven numbered flight rings test
altitude and direction changes; a ring counts only when crossing its plane
forward through the opening, in sequence. Teleporting or hovering nearby
does not award it. Reset course returns to the selected start.

## Architecture

- `mobility.ts`: DOM-independent motor, supported landing footprints,
  sampled ballistic trajectories, substepped collision, hover state machine,
  the opt-in free-volume medium (`free`, `planDrift`).
- `movementGesture.ts`: testable pointer-ID, hold, and double-tap arbitration.
- `player.ts`: one shared player, overlay targets, camera/avatar adaptation,
  collision adapter for existing trees and built wall segments.
- `mobilityControls.ts`: one shared two-stick UI and cancellation handling.
- `mobilityCourseLayout.ts`: shared rendered/collision dimensions and gates.
- `mobilityCourse.ts`: course geometry, trial armor, selector and progress.

`player.position.y` retains the legacy world datum used by crafting callers;
`player.feet()` is the actual 3-D position. New worlds may implement
`TraversalWorld.surfacesAt` to expose stacked walkable surfaces and
`canOccupy` for body clearance. Legacy worlds retain their safe edge
boundaries and existing object interactions. The motor does not make the
plateau's distant decorative landscape walkable. Climbing and ledge-grabbing are parkour's (above).

## Verification

`npm run test:mobility` covers gesture timing/cancellation, analog speed,
frame-rate agreement, thin obstacles, route and landing validity, normal
and powered course reachability, equipment changes, hovering/descent,
flight ring crossing, forge integration, and the free volume (pitch-led
drive against a roof and floor, drift reach and impediments). `npm run test:lab` retains the
existing creature regression suite; its annex boundary assertion now
expects the authored course doorway to be open. `npm run build` type-checks
all three entries. `node scripts/browser-mobility.mjs` tests production
bundles in desktop, portrait phone, and landscape phone viewports, including
simultaneous pointer IDs and existing domains, and saves screenshots to
`artifacts/mobility-v3`. The original `scripts/browser-lab.mjs` still checks
the living specimen, studies, and playback controls.

Phone feel, camera framing, jump reach, and hover acceleration still need
the designer's physical-device judgement; automated checks do not replace
that playtest.
