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

### The canonical obstacles

Noah (2026-10-19): "each height she may meet matches an animation perfectly, instead of grey area".
`CANON` in `parkour.ts` holds one height per obstacle, read off his clips (`parkourClips.ts`) at her
scale, so an obstacle built to it plays its clip at its own size, hands and feet where the clip puts
them. **Build only these** (the practice course does; anything authored should). Natural ground
(eroded land, banks, the old bridge's foot) is met by the nearest move, stretched.

| Obstacle | Height (m) | Read off | She |
|---|---|---|---|
| step | 0.19 | the step-up's rise | steps up, no hands (even though the walk could take it: a sheer rise of `STEP_FROM` 0.12 m or more) |
| mount | 0.34 | the mount's hands and knee, 85 cm of the X Bot | the clamber: hands and her left knee on the top, then up and standing |
| rail | 0.34 high, 0.3 deep | the mount's top; the vault's hand plant | vaults it at a run |
| wall | 0.83 | the jump's rise, less the catch's settle, plus the hang below the lip (`HANG_BELOW`, 0.62) | jumps to the braced hang and **pauses** |
| ledge | 1.13 | `HANG_BELOW` plus the hang drop's fall | lowers to the braced hang and **pauses** |
| gap | 0.65 | the running jump's travel, less a footprint each end | leaps it at a run (1.6 m/s or more) |

Between them, each move takes the heights nearer its own than its neighbour's (`PARKOUR`, the
midpoints):
- **Step:** a rise to 0.27 m. A sloped foot (one that gains most of its rise over `SHEER_W`, 0.15 m, or
  more) is stepped up to 0.58 m.
- **Clamber:** a sheer face to 0.58 m.
- **Climb:** higher, to `climbRise` (1.75 m; 3.2 m with the powered legs).
- **Vault:** a thin top to 0.58 m.
- **Hang drop:** a sheer drop of 0.58 m or more, to `maxDrop`.
- **Hop:** a lower drop.

### The braced hang

Jumping up to a wall and lowering off a ledge both stop in the braced hang (`motor.mode` `'hang'`,
`motor.hanging`; the hang clip loops). A stick still held from the move that brought her there doesn't
carry her on: it has to come back first. Then she takes the stick relative to the wall:
- **Toward the wall:** she climbs on up, or back onto the ledge she lowered from.
- **Away from it:** she drops to the ground below, where there is ground she can drop to.

The lean must reach `HANG_LEAVE` (0.45 of the stick, along the wall's normal). Her body (radius and
margins) keeps 0.29 m from the face. The clips have her feet 0.11 m in front of her root, so her figure
is drawn `HANG_LEAN` (0.17 m) nearer the face through the catch, the hang and the pull (`leanAt`). That
puts her hands on the face 0.12 m under the lip, the clip's own grip, and her feet on the face.

A rise past `climbRise`, a drop past `maxDrop` and a gap past `leapReach` stop her as before. Water is
never leapt (the plateau's `canOccupy` refuses the air over it), so the rivers stay barriers but at
their crossings. The motor exposes the move (`motor.traversal`, `traversalTime`); each carries its
stages (reach, catch, hang, pull; mount, rise, stand; lower, fall, land) and the way she faces (`face`).

### Parkour clips

Noah's Mixamo clips (2026-10-19) are in `public/models/clips` (FBX Binary, Without Skin, 30 fps):

| File | Plays |
|---|---|
| `step-up.fbx` | the step |
| `mount.fbx` | the clamber: hands and the left knee onto a waist-high top (its obstacle lies to her left; the layer turns it ahead), then the landing's crouch risen out of to standing |
| `jump.fbx` | the crouch and spring of a climb's reach |
| `jump-to-hang.fbx` | the catch (its last quarter second): hands on the lip, the feet finding the face |
| `hang.fbx` | the braced hang, looped while she waits for the stick |
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
village's third-person framing on one lane of each move. Every obstacle is canonical. The left lane is a step, a mount and a wall, with a ledge at its far end.
The middle lane has two rails to vault, a mount's block to clamber onto and hop off, a wall to climb and
drop from, and a gap to leap. The right lane has a wall too high and
a pit too wide. On the far right is the old bridge's foot, shaped as the plateau shapes its deck. East of the lanes stands a ward
(RUINS.md): one of the old containment's ruins, as the dark forest's are built, all of canonical faces. `?hud=1` shows the move and its stage;
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
