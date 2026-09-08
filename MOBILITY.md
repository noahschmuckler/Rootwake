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
  sampled ballistic trajectories, substepped collision, hover state machine.
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
plateau's distant decorative landscape walkable. Climbing/ledge-grabbing
is a future traversal type, not implemented or faked by this pass.

## Verification

`npm run test:mobility` covers gesture timing/cancellation, analog speed,
frame-rate agreement, thin obstacles, route and landing validity, normal
and powered course reachability, equipment changes, hovering/descent,
flight ring crossing, and forge integration. `npm run test:lab` retains the
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
