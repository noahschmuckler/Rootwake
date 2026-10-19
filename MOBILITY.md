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
| step | a rise to 0.42 m | a knee up, no hands (the bridge's foot) |
| clamber | to 0.8 m | hands on the top, the body over them, a knee on |
| mantle | to 1.25 m | a crouch, a hop that puts her hands on the lip, the press up |
| climb | to `climbRise` (1.75 m; 3.2 with the powered legs) | a jump to a hang, a breath, the pull up and over |
| vault | a top to 0.8 m high and no thicker than 0.9 m, ground beyond at about her height | over it without stopping |
| hop | a drop to 0.95 m | a short arc down |
| hangDrop | a sheer drop of 1.15 m or more (to `maxDrop`) | she turns to the wall, lowers to a hang off the lip, lets go |
| leap | a gap she runs at (1.6 m/s or more), ground across it within `leapReach` (2.6 m; 4.5 powered) | a running jump |

A rise past `climbRise`, a drop past `maxDrop` and a gap past `leapReach` stop her as before. Water is
never leapt (the plateau's `canOccupy` refuses the air over it), so the rivers stay barriers but at
their crossings. The motor exposes the move (`motor.traversal`, `traversalTime`); each carries its
stages (crouch, reach, hang, pull, over, land; turn, lower, fall) and the way she faces (`face`).

### Parkour clips

`huldaTraverse.ts` plays each stage as a window of a Mixamo clip stretched over the stage's seconds,
whole body (the gait gives way, as it does to the fight's moves); the fan's own jumps and drops now
play the jump too. Until a clip is downloaded its stages stand in with windows of `jump.fbx`, and a
step keeps the stride. Download each with the settings of the clips already in `public/models/clips`
(FBX Binary, Without Skin, 30 fps, In Place where offered; the X Bot is fine) and drop it in with the
file name below; the build finds it. Mixamo's search terms are in quotes; any clip with the same action
works. `?parkourclips=0` turns the layer off.

| File | Search Mixamo for | Plays |
|---|---|---|
| `step-up.fbx` | "Step Up" (or "Climbing Stairs") | the step |
| `clamber.fbx` | "Climbing Up Wall" (a short, standing one) | the clamber |
| `jump-to-hang.fbx` | "Jump To Hang" | the mantle's and climb's reach |
| `hang.fbx` | "Hanging Idle" (or "Braced Hang") | the hang, held |
| `climb-up.fbx` | "Braced Hang To Crouch" (or "Freehang Climb") | the pull up and over; backwards, lowering into a hang |
| `vault.fbx` | "Jump Over" (or "Vault", "Over Obstacle Jumping") | the vault |
| `hang-drop.fbx` | "Braced Hang Drop" (or "Freehang Drop") | letting go |
| `running-jump.fbx` | "Running Jump" | the hop, the leap, the fan's jumps |
| `landing.fbx` | "Falling To Landing" (or "Hard Landing") | landing a drop or a leap |

Each clip's travel (its hips' rise and drift) is taken out: the motor moves her, the clip poses her.
Once they are in, the windows in `SEGS` want tuning against the clips' own frames.

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
