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
