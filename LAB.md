# The lab — designing the rust monster

The `lab` branch's design log. Each version of the creature is recorded
here with the brief it answered and the decisions it took, so the next
version starts from a statement, not a chat transcript. Live at
https://noahschmuckler.github.io/Rootwake/lab/ ; he starts in the suit.

## The brief (designer, 2026-09-08)

The stage's main enemy, a rust monster after D&D's. Large — two or three
greblins stacked. The body is insect: cockroach and cave (camel)
cricket. The distinctive feature is the functional antennae, reading as
feathery tentacles — very thin and fuzzy, moving like a slow-motion
bullwhip. Evolved in these caves to dig rock and dirt: strong anterior
appendages with scraping claws like a praying mantis, strong hind legs
for leaping, strong grasping feet. They seek veins of ferromagnetic ore
and caress them with the feelers; the frilly, feather-like appendages
induce rust on the surface — fuzzy rust — which they then scrape off.
Two motions: a feathery, tickling, lashing motion that induces the rust,
and a more aggressive scraping that removes it, exposing the metal. The
rust shows on the feelers like pollen on a bee, and mouthparts clean it
off — a feeler drawn through the mouthparts. Not any exact anatomy, but
clearly insect, and clearly made largely of metallic particles. The room
has several areas of silvery ore on the walls that the creature
approaches, tickles brown, scrapes back to silver. Walking in, you see
it skittering from or to. As unsettling as it can be made.

## v1 (2026-09-08)

**The room.** The arena (18 across, 6 high) carries five clusters of
silvery ore on its walls at working height (`orevein.ts`): crooked lines
of bright metal plates flush on the rock, and a fuzz of fine lines that
grows out of them as the rust level rises — silver to brown, the metal
going matte, the fuzz standing up. Scraped, it goes back.

**The creature** (`rustmonster.ts`), procedural, animated per frame:

- *Body.* A low plated abdomen of six overlapping segments tapering to
  the tail, a wide pronotum hood over the thorax, the head tucked under
  and low. The core is near-black; the skin is about three thousand
  small metal plates lying tangent on the surfaces like scales, each
  turned on its own and *drifting* — the glints never settle, so it never
  reads as one solid thing. That is the "made of particles".
- *Feelers.* Two chains of 22 thin segments, 2.6 long, each segment
  carrying a brush of fine silver lines (barbs). The motion is a
  travelling wave along the chain with amplitude growing toward the tip
  — the slow whip — plus a fast quiver in the outer third. The base is
  a joint (turn, then raise) aimed by what it is doing. Rust on the
  barbs is a colour per segment, silver to rust-orange.
- *Legs.* Two raptorial arms at the front, folded like a mantis, with a
  row of scraping teeth; mid legs; big hind legs (thick femur raised,
  long tibia down) with three grasping claws. Joints are turn-then-raise
  so limbs lift rather than roll. Gait: a tripod when moving.
- *Head.* Two small compound eyes that glow a dull red and pulse
  unevenly; two hooked mandibles that chatter; palps.

**Behaviour** (a state machine):

- *Skitter* — toward the next vein in bursts (0.35–0.9 s at 3.4/s) and
  freezes (0.25–1.4 s), snapping to heading; one time in four it feints
  sideways first. Roach rhythm.
- *Tickle* — standing 1.05 off the wall, feelers reaching up over the
  vein, lashing slowly; the vein rusts over 7 s.
- *Scrape* — fast short dragging strokes of the feelers and the arms
  raked down the wall, alternating; the vein clears over 4 s and the
  rust transfers to the feelers, most on the outer half.
- *Groom* — one feeler at a time swings down under the head and is drawn
  through the chattering mandibles base to tip; the segments behind the
  front come clean and rust dust falls from the mouth. 3.2 s each.
- *Regard* — within 3.2 of him it freezes, cocks its head to him, and
  both feelers reach for him and tremble, 1.8 s; then it goes back to
  work (and won't do it again for 9 s).
- Standing still, now and then, the whole body jerks and settles.

**Open, to judge on the phone:** overall scale (body 1.5 long, back at
0.7); plate size and count; feeler thickness, barb density, whip speed;
whether the legs read as legs or boards; eye size; how much it should
care about him; whether it should ever leave the veins for him.

## v2 (2026-09-08)

Designer's notes on v1: the feelers clipped through the wall while it
worked a vein, and the way it stood made it hard to read what it was
doing. Two asks: a viewing platform — he stands raised, comes to the edge,
and sees the creature in a lowered area along the far wall, with ore at
several heights on a moderately tall wall, all in view; and wall climbing
— on reaching a wall it angles its body up it, silverfish-like, the body
flexing to hug the corner as it goes from floor to wall, and it circles
an ore a little before feeding.

**The room.** A platform 2.2 above a pit, from z 4.5 to the near wall,
with a low lip; he walks only the platform. The far wall is 7.5 tall
and carries five veins between 1.0 and 5.0 up. Two cool lamps under the
roof over the pit light the wall — lab fixtures, not game lighting.

**Climbing.** The creature has a surface frame: on the floor its up is
the world's; on a wall its up is the wall's inward normal and it moves in
the wall's plane in along-wall / up-wall coordinates with an in-plane
heading. Its pose is a blend between the floor pose and the wall pose:
the *mount* runs the blend 0→1 over 1.1 s while the abdomen — now a chain
of pivots — bends tail-down by up to 0.62 rad spread over the joints,
peaking mid-way, so the tail lies into the corner while the head is
already up the wall; the *dismount* runs it back. On the wall it moves in
bursts and freezes like the floor, at 2.2/s, legs splayed a little
flatter.

**Feeding on the wall.** Up on the wall it walks a 1.6-turn loop of
radius 1.05 around the vein, then stops 0.95 below it facing up. The
feelers now sweep in the wall's plane, and their lifts are only away
from the rock (a half-wave), so nothing goes through it. Tickle, scrape
and groom as before; the rust dust falls in the world's down whichever
way the body is turned. Done, it walks down to just above the floor and
dismounts.

**Open:** the mount flex amount and whether the tail should trail
longer; wall speed; how far the feelers overshoot the vein (they are 2.6
long and the vein is 0.95 above the head, so the tips flail above it);
whether it should feed from the side rather than below; the lamps.

## v2.1 (2026-09-08)

Designer's notes on v2: the legs angled inward and clipped through the
thorax, so they hardly showed; and the feelers, good as they are, need a
rest position curved back up over the body, unfurling to interact with
the ore or explore the player.

- *Legs.* A sign error: a leg's local forward turned about its hip's Y
  by a positive angle points to the body's −x, so the right side's legs
  swung inward. Yaw is now −side × angle; all six come out from the
  body, on the floor and on the wall.
- *Feelers.* Each has a `furl` 0..1. At rest (0) the base is raised
  (REST_PITCH 0.8) and every segment curls back (REST_CURL 0.115), so the
  chain rises from the brow, arcs over the back and ends near the tail,
  breathing slowly. It unfurls (UNFURL_S 1.1) for tickle, scrape, regard,
  and for the feeler being groomed; it furls back (FURL_S 2.4) for
  everything else — skittering, climbing, freezing. The pose is a smooth
  mix of the rest angles and the working angles by the furl.

**Open:** the rest arc's height and whether the tips should cross over
the tail; whether it should unfurl a little while skittering, feeling
ahead.

## v2.2 (2026-09-08)

Designer's notes on v2.1: the rust should purge from the feeler that
folds back, not the one held out; and the climb should go head first —
the head angling up close to 90°, then the thorax as it walks in, then
the abdomen following smoothly up the wall — and the reverse coming
down, which at the moment left it wedged in the wall, walking in place.

- *Grooming is the fold.* The feeler being cleaned furls back over the
  body — that curl is the draw through the mouthparts — and is purged
  base to tip as far as it has folded, dust falling from the mouth. The
  other stays out while it still carries rust, then furls in its turn.
- *The corner is a track.* Between floor and wall the thorax runs along
  a path: flat floor toward the wall, a quarter arc of radius 0.34
  (CORNER_RADIUS) at the junction, flat wall upward, at CORNER_SPEED 1.5.
  Every part of the body sits at its own distance along that path — the
  head 0.62 ahead, the six abdomen joints 0.12 to 0.97 behind — and takes
  the path's tangent there, so the head pitches up first while the
  thorax still walks in flat, the thorax turns the corner next, and the
  abdomen bends joint by joint after it, straightening as it comes up the
  wall. The dismount runs the same track backwards: it backs down the
  wall tail-first, the abdomen levels onto the floor, then the thorax,
  then the head, and it ends standing on the floor facing the wall where
  the track leaves it. Nothing is interpolated between two poses any
  more, so nothing can end up inside the rock.

**Open:** the corner radius (tighter is more silverfish, looser is more
cricket); whether it should come down head-first instead of backing;
corner speed against wall speed.

## v2.3 (2026-09-08)

Designer's notes on v2.2: come down head-first, in the same head →
thorax → abdomen order as going up; curve the body through turns rather
than rotating it whole; and it got stuck circling, almost spinning, at
the bottom-right vein.

- *Down head-first.* At the bottom of the wall it faces down and runs
  the same corner track the other way, head first over the corner and
  off along the floor, ending on the floor facing away from the wall.
  The abdomen bends toward the back through the corner exactly as on
  the way up.
- *The curve.* The rate of turn is measured every frame and smoothed;
  the head leads into the turn (CURVE_HEAD 0.22 rad per rad/s) and each
  abdomen joint follows (CURVE_JOINT 0.045), so a turn bends the whole
  body into an arc the way it is turning. Turns are slower now
  (TURN_RATE 4.5 on the floor, 4 on the wall) so the curve is seen.
- *The spin.* Two causes. The loop around a vein only 1.0 up was clamped
  to the lowest height the body can stand on the wall, so its points
  piled onto one spot and it turned in place on them; now points that
  land on top of each other are dropped, and a vein too low to stand
  under is fed from above, facing down. And the spot at the wall's base
  was re-randomised at every freeze, so it arrived, the target moved,
  and it feinted after a new one — that spot is now fixed per vein.

**Open:** feeding from above (facing down) for the low veins — right,
or should low ore be worked from the floor?; the amount of curve.


## v2.5 (2026-09-08) - shared animation and a real annex

This pass corrects the unsuccessful v2.4 gallery changes. Negating 0/pi
phase offsets did not reverse gait, the gallery still occupied the
original platform, and its surface study rotated around the wrong axis.
The post-update head-angle addition also fed back into the next frame.

- **Layout:** six 6.8-wide, 7.5-deep open-front studies in an east annex
  (x 14.2 to 56.8), joined to the original platform by a lit doorway and
  corridor. The viewing aisle is outside the displays, 0.8 above them.
  Navigation and camera clearance share `labLayout.ts` measurements.
  No study occupies the live pit or its platform. Raised viewing lips
  removed; rear partitions stop short of the fronts for oblique views.
- **Rig and gait:** unscaled thorax joint owns the shell, head, all six
  hips and abdominal chain. Hind anchors move from body z +0.3 to -0.08.
  The advancing middle/hind stride phase is reversed, not its offset.
- **Corners:** `creatureMotion.ts` supplies forward/normal contact frames
  and a shared route-based spine solver. The live mount/dismount and the
  square circuit use that same solver. Head, thorax and abdominal links
  occupy successive points on the route with fixed chord lengths; no
  gallery-only Euler rotation, paused corner or timed bend pulse.
  The circuit has real floor/wall/ceiling surfaces and constant travel
  speed, with gait distance advancing at the same rate.
- **Turns:** stronger bounded head lead and independent thorax steering;
  abdominal joints follow travelled heading history, or time-delayed
  follow-through during stationary turns. Targets are assigned once per
  frame with delta-time damping. No additive feedback or stale corner
  yaw. The swerve study actually travels an S-shaped route; the sixth
  study isolates turn, straighten and idle.
- **Study driver:** `updateStudy()` selects action, contact, route and
  time; the real creature owns all poses, including wall feeding and
  regard. The private `MonsterHack` casts and refinements module are gone.
- **Inspection:** LAB selector offers live pit, annex entrance and each
  bay. The physical route also remains walkable. Pause, single-frame
  step, restart, 0.5x and 0.25x studies; the live specimen keeps running.
  Portrait inspection views use a wider field of view to fit a whole bay.
- **Verification:** `npm run test:lab` checks reversed stance direction,
  thoracic hip parenting, surface-frame continuity, head-first ordering,
  rigid link lengths, bounded/frame-rate-independent turn relaxation,
  heading history, annex reachability, live AI completion and feeding.
  `scripts/browser-lab.mjs` checks desktop/phone views, pause/step/view
  switching, finite scene transforms and saves corner screenshots.
  Deployment now type-checks and runs both test suites before publishing.

Open for visual judgement: bend strength and follow-through timing, bay
viewing distance/lighting, and the legacy procedural foot lift/placement
(the gait reversal is not a new foot-contact IK system).
