# The stags: her mount, the tree stag, and the papoose

Noah, 2026-10-22, after judging C2 ("This is very good"). His brief, recorded as given, then the split and what is
built. The mother's creatures are in DARK_YOUNG.md and MOTHER.md; the contagion in CONTAGION.md.

## Noah's brief, in full

1. **She needs a mount.** Summonable from healthy soil: a stag made of soil, grass and branches. Its health fades
   and it collapses in the mother's miasma.
2. **There needs to be more combat. A new creature, the tree stag**, which emerges from the twitching trees: an
   oily, leathery, gaunt black humanoid figure with a deer stag's skull for a head, also stained oily black, with
   eyes that pulse with the colour and the rhythm of the mother's heartbeat. On her approach, a tree stag steps out
   from a twitching tree far ahead, walks to another and vanishes into it. On her escape, they emerge to fight her,
   knocking her down so the snatchers can scramble over and grab the baby she rescued.
3. **The baby** needs to be smaller and wrapped in a papoose against her back, cradled there, so her current
   animations are kept.

## The split

- **The mount** is the land session's (a new system: `mountModel.ts`, `mountFigure.ts`, riding in `village.ts`; the
  `mount.fbx` clip is in `public/models/clips`).
- **The tree stag** and **the papoose** are offered to the creature session, whose files they live in (the Dark
  Young, the brood, the fight, her figure); if it is busy, the land session's agents take them.

## Decisions for the mount (the land session; flagged, Noah's to change)

- **Healthy soil** is ground outside her growth, not a spoiled place, with grass or wood on it (not rock, not water,
  not a yard's floor). The summon is a button that shows when she stands on it and has no stag up; it costs a
  little sap, so it is not free and not rare.
- **The stag** rises out of the ground in a breath and a half: soil heaving, branches knitting into legs and
  antlers, grass sprouting along the back and neck. A red stag's size.
- **Riding:** the mount clip, then she sits; the stick drives the stag at about two and a half times her walk; no
  parkour while mounted (a step up at most); rivers refuse it as they refuse her; a hit knocks her off.
- **Its health** is full on healthy soil, drains in the growth by depth (the nursery in a score of seconds, the mild
  ring in a minute or two), heals slowly outside, and at nothing the stag collapses into soil, branches and grass
  and she lands on her feet. No summoning inside the taint. Not saved: a reload finds her on foot.

## The mount, as built

Built 2026-10-23 (the land session), to the decisions above. `src/mountModel.ts` (pure, `tests/mount.test.ts` in `scripts/test-village.mjs`),
`src/mountFigure.ts` (the stag and her seat), the riding in `src/village.ts` (one block, "The mount", before the boot line; mode `'ride'`),
the `stag` button in `village.html` / `village-vista.html` and `src/village.css`, the checks in `scripts/browser-village-vista.mjs`. Nothing
of it is saved: a reload finds her on foot.

**The verbs.** On healthy soil the `stag` button stands beside the guard: healthy is ground outside her growth (`inGrowth`), not within a
spoiled place's radius, grass or wood by the land's own reading (`biomeAt` meadow or wood; the water of the rivers, the lake and the stream,
the karst's bare rock, a yard's floor and her dark wood refuse: `mountModel.refuseSummon`, each with its word), with `SUMMON_SAP` sap and no
stag up. Pressed, the summon spends the sap and the stag rises `RISE_AHEAD` m ahead of her, facing her, on the nearest spot its body can
stand (`stagSpot`: the land's refusals at its own footprint, the live colliders), with a spray of soil and a green ring. Up, within
`MOUNT_REACH` m, the button reads `mount`: she goes onto its back over `MOUNT_S` (the parkour's mount clip, `mount.fbx`, through the
traverse layer with its travel kept, her root carried from the ground to the saddle on an arc; her seat, a one-frame clip built from the
rig (`seatClip`: the knees astride, the arms forward to the neck), fades in over the beat's last third and holds), then mode `'ride'`: the
stick drives the stag (`drive`: its heading turns to the stick at `TURN_RATE`, its speed eases to the stick's share of `MOUNT_SPEED`), her
feet on the saddle (`place`, so everything that reads her feet, the chunks, the villages, the fight, reads her there), facing its way, the
camera `RIDE_CAM` back and up from the saddle on her yaw (a drag orbits as it does afoot; the stick is camera-relative as afoot). The stag
follows the land (`stagGround`: the surface nearest its height, so a deck is a deck), steps up `RIDE_STEP` at most and down `RIDE_DROP`,
no parkour; the rivers and the lake refuse it as they refuse her (`groundWorld.canOccupy` with its `STAG_R` footprint: `walkable`, the
houses, the trunks, a yard's walls, and the colliders); refused ahead it slides along x or z as her motor does, else stops. No collecting,
no sinking, no fight verbs from its back (`attack` is afoot only); the raiders hunt her on it (`fight`'s `her` includes `'ride'`), and a
bite's drop in her vigor (`BITE_FELT`) or a faint knocks her off (`knockOffMount(reason)`, also hung on `__village.mount` for the tree
stag's knockdown: true if she was mounted and is now on foot beside it). The `dismount` button (the same button, lit) sets her down beside
it (its left flank, else round it, `standable`), and it stands waiting, grazing after `GRAZE_AFTER` s; walked `FOLLOW_M` m off it follows
her at `FOLLOW_SPEED` and stops `FOLLOW_STOP_M` m from her, so it is never lost. Its health is a bar and a readout over it (`stag · 100`,
and in the growth `· fading, N s`), green on healthy soil, violet in the growth.

**Its health.** `HEALTH` 100 up; standing or ridden in her growth it drains `DRAIN` × the growth's depth where it stands a second
(`depthOf`, less the woken ward's calm): the nursery (depth 1) kills it in 20 s, a mat 44 s, the mild ring (0.2) in 100 s (`lastsFor`);
on healthy soil outside the growth it heals `HEAL` a second; on water, rock or a yard neither. At nothing it collapses (`COLLAPSE_S`:
it sags, the legs give and splay, the neck droops, the body into a low mound) and the mound fades (`FADE_S`) and is gone; ridden, she
lands on her feet where it fell (the landing clip, `LANDING_S`, no damage). A stag left standing in the growth drains and collapses too.

**The figure** (`mountFigure.createStag`): a red stag's size (`SHOULDER` 1.3 m), loam ellipsoids for the body, the chest, the rump, the
head and the muzzle, branches (`flora.taperedTube`, gnarled, bark) for the four legs (a thigh and a shin with a hoof), the antlers (a beam
and three tines a side) and the tail, grass standees (`sprites.standees`) along the spine and up the neck, green eyes with an additive
glow; merged into one mesh per moving part: 17 meshes, 2,784 triangles. The gait: one phase paced by the stride (`STRIDE_WALK` →
`STRIDE_GALLOP`), a walk's diagonal pairs giving way to a gallop's bounding pairs between `GALLOP_FROM` and `GALLOP_TO` m/s, the lower leg
folding back through the swing, the body bobbing and rocking, the neck reaching out at the gallop. The rise (`RISE_S`): the body heaves
up out of the ground wide and low and fills out, the legs knit from the loam, then the antlers, then the grass sprouts, the eyes light.
Under both looks (standard materials, shadows cast).

**Cost** (the vista look, medium, the green at noon, from the look's HUD under SwiftShader): the figure is 2,784 triangles in 17 meshes
(34 draw calls with the shadow pass; her own figure and the land are hundreds of thousands). The HUD's totals swing frame to frame with
what the look has in view (the same spot read 863k tris / 821 calls and 791k / 157 calls a few frames apart), so the stag is lost in the
noise: on foot beside it 791k tris / 157 calls, mounted 910k / 787, at the gallop 915k / 768. What the ride adds is the camera: 4.4 m
back and 1.9 m up it holds 50–120k more triangles of land and trees in view than her walk's camera does, and more of the look's calls.

**Constants** (`mountModel.ts`, "Tuning", all first guesses): `SUMMON_SAP` 20 (the thorn burst is 25, the root bind 15), `MOUNT_SPEED`
7 m/s (2.5 × her 2.8), `TURN_RATE` 3.2 rad/s, `ACCEL` 4, `FOLLOW_SPEED` 2.2, `FOLLOW_M` 12, `FOLLOW_STOP_M` 4, `RIDE_STEP` 0.45 m,
`RIDE_DROP` 0.9 m (village.ts), `HEALTH` 100, `DRAIN` 5/s at depth 1, `HEAL` 4/s, `RISE_S` 1.5, `COLLAPSE_S` 0.8, `FADE_S` 1.6,
`RISE_AHEAD` 2, `MOUNT_REACH` 2.6, `MOUNT_S` 1.1, `SHOULDER` 1.3, `STAG_R` 0.55, the saddle 1.32 m up; the camera 4.4 back, 1.9 up.

**Dev** (`__village.mount`): `summon()`, `mount()`, `dismount()`, `knockOffMount(reason)`, `canSummon()` (the refusal or null), `ctx()`,
`soil(x, z)`, `state` (the stag's model, its ground, triangles and the seconds it has at its depth; the ride; her seat's weight; `riding`,
`driving`), `ride(dx, dz, seconds)` (drives the stag as the stick would, on the ride's clock), `set({ health, phase, t })`, `frozen`
(the stag's clock stopped, for a still), `constants`. CI (`browser-village-vista.mjs`): on the green she can summon, a stag rises at the
sap's cost, she mounts, 8 s of the ride's clock carry her farther than 1.3 × her walk's 22.4 m; after the twelve dawns, ridden into the
growth its health drains at `DRAIN` × depth (the rate measured over the stag's own clock, the readout's seconds checked), set low it
collapses and she is on her feet, mode `ground`; no console errors.

**Open for Noah.** The speed (7 m/s reads fast on the meadow; the stride and the bounding are first guesses); the drain rates (20 s in
the nursery, 100 s in the mild ring: is the ring too kind, the nursery too quick?); the stag's look (the loam body reads; the antlers
are thin branches, the grass tufts few; a leaner neck or a longer head may be wanted; the eyes' glow); the sap cost (20 of 100: with
the thorn burst 25, is a summon worth a cast?); whether it should be allowed on the island's bridge (today it is: the deck is a surface
the land gives, and `walkable` allows it; refusing it would be a `soilAt` rule of the deck); whether she should be able to strike or
cast from its back (today not: the fight verbs are afoot); whether the raiders should target the stag rather than her; whether it
should be summonable with an infant in her arms (today yes, the papoose rides with her figure; a stack of stores refuses); the
mount beat (the parkour's mount clip is a clamber onto a knee-high top, so she climbs on rather than swings up; a true mount clip
would replace it in `ridePlan`); that she does not walk to it (it rises within her reach; she mounts from where she stands); and
whether the camera should ease round behind the stag when it turns (today it holds her yaw, as her walk's does).

## The mount, pass 2

Noah, 2026-10-23, after judging the mount ("Liking it"). His asks, verbatim:

1. "Is there a free asset for the stag's movement to make it more natural?"
2. "She should be able to dismiss the stag from anywhere, and if it is summoned already, call it to her from anywhere."
3. "Stag travel should be as fast as root travel."
4. "I didn't test its health inside the mother's territory; it should live long enough to run in from outside, for her to mount it,
   and ride out directly, though it might not survive the entire way out."

What was built (the land session):

**1. The asset.** Quaternius's *Ultimate Animated Animal Pack* (quaternius.com, CC0 1.0 Universal by its License.txt) has a rigged, animated
**Stag** in glTF: 38 joints, 3,670 triangles, 13 clips (Walk 1.17 s, Gallop 0.53 s, Idle, Idle_Headlow, Eating, Death, two hit reacts, two
attacks, a jump). Its glTF (3.2 MB, the buffer embedded) was trimmed to the mesh, the skin and five clips, `Idle`, `Idle_Headlow`, `Walk`,
`Gallop`, `Death`, repacked as **`public/models/stag.glb`, 849 KB**, with the credits in `public/models/STAG_CREDITS.md`. In the game
(`mountFigure.createAssetStag`) it is loaded once through three's GLTFLoader (`loadStagAsset`, at the village's boot; `?stagasset=0`
keeps the procedural stag), cloned with its skeleton per stag (SkeletonUtils), fitted so its Torso2 bone stands at `SHOULDER` (1.3 m),
turned to face −z, and dressed as ours: every material dark loam (its eyes' mesh green), its own horns hidden under our branch antlers
on its Head bone, grass standees parented to its spine bones (Back, Torso, Torso2, Torso3) and its neck bones (Neck1–3), each in the bone's
own frame so they ride the gait, soft green eye glows on the head; her saddle rides its Torso2 bone, so she bobs with its back. Its clips on
a mixer: Idle and Idle_Headlow (the graze, by the stillness as before) when it stands, Walk giving way to Gallop between 2.2 and 4.6 m/s,
each clip's rate paced to the speed it was made for (`CLIP_WALK_MS` 1.1, `CLIP_GALLOP_MS` 6.5, clamped), Death crossfaded under the
collapse. The rise, the sink, the surfacing and the collapse are ours (the whole body heaving out of or into the loam, the antlers and the
grass growing in late, the eyes lighting) over the clips. The first pass's procedural figure stays as the fallback (`createProceduralStag`)
while the file loads or if it fails; it gained the sink and the surfacing and nothing else, since the asset fits.

**2. Call and dismiss.** The button's states (`stagFrame`): no stag → `stag` (the summon, healthy soil only, as before); a stag up beyond
`MOUNT_REACH` → `call`; within it → `mount`; riding → `dismount`; on its way (rising, sinking, travelling, surfacing) → `coming`. Held
`LONG_PRESS_MS` (450 ms, the player's long press) → **dismiss** from anywhere: it sinks into the soil where it stands (`SINK_S` 0.8 s, a
soil spray) and is gone, no sap back; riding, she is set down first. **Call** (`callStag` → `mountModel.callMount`): near, within
`CALL_RUN_M` (60 m), with ground it can cross (`runnableBetween`: the line sampled every 1.5 m, each sample ground it can stand on, not water,
no drop past `RIDE_DROP`), it runs to her at `MOUNT_SPEED` and stops `CALL_STOP_M` (2 m) off; farther, or with water between, it sinks into
the soil where it stands, travels as a root ride does at `CALL_SPEED` (root travel's 9 m/s; the figure unseen) for the seconds the distance
takes (`travelPoint` carries it along the line toward where she is *now*, so it surfaces beside her however she has moved), and surfaces
(`SURFACE_S` 0.9 s) on the nearest spot it can stand ahead of her, facing her, with a spray of soil. A called run that makes no way for
`CALL_STALL_S` (1 s) sinks and travels instead, so a call never leaves it stuck behind anything. Its health drains only where the growth is
(`drains`: up, sinking, travelling, surfacing; not rising, collapsing or gone), read at its position under the soil too, so a stag called from
outside crosses the growth only from the edge to her; spent on the way, it collapses where it surfaces.

**3. The pace.** `MOUNT_SPEED` = `SNATCH_PACE` = 9 m/s, root travel's pace (`CARRY_SPEED` in village.ts is 9 too), 3.2 × her walk (2.8);
`CALL_SPEED` the same. The gait's rate follows the speed (the Gallop clip at 9/6.5 ≈ 1.4 × its own rate); the ride's substeps (0.25 m) and
the step/drop rules hold at 9 m/s (at the CI's quarter-speed frames 2.25 m a frame, nine substeps); the camera's ease was raised to 0.5 a
frame so it keeps up. The CI's distance check (eight seconds of the ride's clock against 1.3 × her walk's 22.4 m) runs on the new figure.

**4. The drain against the real rings** (`tests/mount.test.ts`, `mountModel.rideOut`, pure, on `taintModel.depthAt`: 0 at the edge, 650 m
from the breach, 1 at the heart's rim, 110 m): a stag called from the edge to the nursery's rim (215 m) through the growth at `CALL_SPEED`,
surfaced there, the mount beat (`MOUNT_S`), then ridden straight out at `MOUNT_SPEED`. With **`DRAIN` 2.49 a second at depth 1**
(`HEALTH` 100): in **50.0 s**, health **95.7 at the grey ring** (520 m) and **51.5 at the nursery's rim**; **47.5 mounted**; out: **3.4 at the
grey ring**, **collapsed at 86% of the way out** (41.6 s ridden; the edge is at 100%). From the grey ring's rim: in 16.2 s, mounted at 94.5,
out in 14.5 s, it makes it; from the middle of the grey ring too. The test holds the collapse between 80% and 100% of the way out and the
grey-ring departures to a clean escape. A standing stag in the nursery (depth ≈ 0.8–1) now lasts 40–50 s, the mild ring (0.2) 200 s; the CI's
collapse check sets the health low, so it is unaffected; the drain-rate check reads `constants.DRAIN`.

**Cost** (pass 2, the asset): the dressed file's stag is **2,698 triangles in 15 meshes** (its horns hidden: the body 2,230, our antlers 480,
the grass; the procedural fallback was 2,784 in 17), plus a skinned mesh's bone matrices a frame. The look's HUD under SwiftShader swings with
what is in view as before (on foot at the green 789k tris / 308 calls, the stag up beside her 917k / 798, mounted 793k / 161, at the gallop
717k / 144): the stag is within the noise; the ride's camera is still what changes the totals.

**Open for Noah.** The asset's Walk/Gallop pacing (`CLIP_WALK_MS`, `CLIP_GALLOP_MS`, the 2.2–4.6 m/s handover) is by eye; whether the stag
should keep its own horns (hidden now) or a lighter loam; the call's `CALL_RUN_M` 60 and the stall's second; whether a call from inside the
growth should cost the stag more; the eye glow's size on the file's head; and the first pass's open items (the sap cost, the bridge, the
fight verbs from its back, the camera holding her yaw).

## The mount, pass 3: the basket, the heading, the vault (2026-10-24)

Noah, after playing C3 and using the other villages as a source of food: "I like other villages as a source, it creates the beginnings
of an economy. Needs some adjustments for viability. Map needs to show rivers and bridges/fords. Stag must be mountable while carrying
resources. Resources graphically should not be colored bricks on her head, instead should be a basket on her back that holds smaller
resource objects. When stag is summoned, must be oriented in same heading as Hulda. Add a rapid dismount - if stag running and user taps
guard, stag puts head down and hulda dodge rolls over stag neck and head to the ground into fighting stance."

Built by the creature session (the land session handed it the whole batch):

- **The basket** (`basketFigure.ts`). Her stack rides in a woven basket on her chest bone, behind her (`Spine2`, where the papoose
  hangs; she never wears both, since her hands take one or the other). It holds one small thing per unit: berry clusters, stoppered gourds of
  water, sticks, tied sheaves of grain, little pails of milk. They fill from halfway up and heap over the rim, drawn `CHUNK` 1.7 times life size so they read at
  the camera's distance. It shows on foot, mounted and on the catwalk. The village's old coloured slabs are hidden (`setStack(null)`).
  A double tap with a full basket still wobbles it.
- **Mounting with a load.** The summon and the mount no longer refuse a stack. The button's `stag` and `mount` labels no longer
  hide for one. Crossing to another village carries the basket over as it always did (`pickActive`).
- **The heading.** A summoned stag rises `RISE_AHEAD` m off her right side (else her left, else ahead, else on the spot) facing the way she
  last faced on screen (`herYaw`, her figure's heading), so she mounts and rides on. A called stag surfacing beside her does the same.
- **The rapid dismount (the vault).** Riding at `VAULT_SPEED` 3 m/s or more, a tap of guard plants the stag (it brakes three times as hard)
  and puts its head down (`StagState.bow`: the asset blends to `Idle_Headlow`, the procedural one drops its neck). She leaves the saddle
  on an arc `VAULT_LIFT` 0.7 m high over `VAULT_S` 0.42 s. Her seated pose eases out, and her dodge clip's dive starts for the arc's
  last `DIVE_S` (the clip's dive, about 0.21 s at its playback rate). She lands `VAULT_AHEAD` 2.3 m (plus 0.12 s of the stag's speed) ahead
  of its centre, on the first standable spot in line. She rolls on along the dodge's own travel and holds her fighting stance for `STANCE_S`
  1.4 s unless the stick moves her. The stag waits. Below `VAULT_SPEED`, or with nowhere ahead to land, the tap is an ordinary dismount.
  Dev: `__village.mount.guardTap()`, `state.vaulting`, `state.her`, `state.basket`, `stance`.
- **The cross-village economy** (`villageModel`): her basket holds `STACK_CAP` 12 (it was 8, one meal for eight; now a meal and a half).
  `collect` no longer refuses when the village she stands in has no room in its own store: she gathers for another village, and the
  store she delivers to takes what it has room for (`deliver`, cap plus `OVERFILL`), the rest staying in the basket.
- **The map's water** (`renderMap`, one block after the land's cells, clipped to the revealed cells as the land is): the lake round the island,
  the rivers at their width but never thinner than a visible stroke. The crossings are marked: a ford as two pale bars, stepping stones as three dots, a footbridge as a plank, the old
  bridge as a stone band, each named on the full map.
- **CI** (`browser-village-vista.mjs`, after the collapse): at the second village a stag rises facing her way. With nine grain in her basket she
  mounts it and the basket shows. At a gallop a guard tap lands her on her feet more than 1.5 m ahead of the stag, the basket kept.

**Open for Noah:** `VAULT_SPEED`; whether the vault should cost anything (sap, or the stag's health); the camera after the vault (it stays behind
her, so for a moment it can sit inside the stag's body); `STACK_CAP` 12 and whether the basket should hold mixed kinds; whether taking from
another village should cost it something (a trade, its goodwill), the next step for the economy.

## The mount, pass 4 (2026-10-25): rivers

Noah: "I want the stag to be able to cross rivers."

Until now the rivers refused the stag as they refuse her (`walkable`: water only under her `WADE_DEPTH` 0.35, a ford's shallows), so a ride
met a river at its fords, stones and bridges, and a call with a river between sank and travelled. Built (the land session):

- **It wades every river, anywhere along it.** Water up to **`STAG_WADE_DEPTH` 2.2 m** over its feet is its to cross: the rivers' beds are
  `RIVER_DEPTH` 1.6 under the surface at the channel's middle (and the channel carves 0.15 more), so no river refuses it; the lake
  (`LAKE_DEPTH` 9) still does: it does not swim. Its body goes down the bed (its feet follow the ground under the water as they follow
  any ground, `stagGround`; so in the shallows it is hoof-deep and at a river's middle in to the belly), **no deeper than its belly** (a decision
  beyond the brief: a river's middle, 1.75 m, is deeper than the saddle is high, 1.32, and the first shots had it under to the antlers and her
  seat 0.2 m under the water; so in water past **`STAG_BELLY` 1.0** the body rides lifted to that depth, its feet on the bed below as if wading
  hard, `mountModel.bodyLift`, and her seat stays over the water at any depth it wades), and it is **slowed by the
  depth**: its pace is `MOUNT_SPEED` × `wadeFactor(depth)` (`mountModel.ts`, pure), 1 on dry ground falling in a line to **`STAG_WADE_SLOW`
  0.45** at `STAG_WADE_DEPTH` (belly-deep in a river's middle, about 1.6 m, it keeps 0.6 of its gallop, 5.4 m/s, still twice her walk; a
  ford hardly slows it). The water takes its speed at once as it goes in (`moveStag` reads the water over its feet at each 0.25 m substep and
  clamps its speed to the pace there, the step left in the frame shrinking with it, so a slow renderer's long frame does not carry it through
  a narrow river at the gallop; `driveWading` sets the drive's target to the pace where it stands) and it gathers its gallop again as it
  comes out (the drive's `ACCEL` ease). The land's rule is the one she uses with the stag's depth in place of hers (`plateauModel.walkable(p, x, z, wade)`;
  `village.ts`'s ground world reads a `wadeLimit` that `stagCanStand` sets for its own call), so the houses, the trunks, a yard's walls and the
  belt refuse it as before. The meadow's stream (`villageModel.inWater`), whose depth the land does not model, counts `STREAM_DEEP` 0.25.
  Her seat is unchanged: she sits the saddle 1.32 m over its feet, over the water at any depth it wades.
- **A wake and splashes.** In water over `WAKE_FROM` 0.18 going faster than `WAKE_SPEED` 1.2 m/s, a few flecks of spray (`hitFx` kind
  `'water'`, new: pale, a little of the river's blue-green) fly up and out at each flank at the surface every `WAKE_EVERY` 0.75 m of its way,
  and a stride's splash sounds every `SPLASH_EVERY` 0.55 s (`FightSound.splash()`, new: a wet bandpass hiss, with a plunge's thump when
  `heavy`); the step into a river (from shallower than `WAKE_FROM`) is a bigger spray ahead of its chest and the heavy splash.
- **The call** (`runnableBetween`): river water (depth ≤ `STAG_WADE_DEPTH`) no longer refuses the line, and the line is sampled every
  `RUN_SAMPLE_M` 0.5 m (it was 1.5: the baked channel's banks fall about a metre a metre, and a sample straddling one read as a ledge over
  `RIDE_DROP` that the ride's own 0.25 m substeps take in stride), so a call from across a river within
  `CALL_RUN_M` (60 m) **runs**, wading over, at the wade's pace where it is deep; deeper water (the lake) still refuses, and beyond
  `CALL_RUN_M` it sinks and travels as before (a called run's step is also clamped so it never carries the stag past `CALL_STOP_M` of her: on
  SwiftShader's long frames it used to land on her). Following her at a walk it wades too (`FOLLOW_SPEED` × the factor).
- **She is not set down in the water.** Where the stag stands in water deeper than her own `WADE_DEPTH` the button's dismount and the vault
  are refused ("not into the water"); a knock-off (a bite, a faint, the tree stag) or a collapse there sets her on the **nearest bank**: the
  nearest spot she can stand on, searched outward along the stag's heading and across it (`nearestBank`, `BANK_SEARCH_M` 40 m at most, after
  the usual spots beside it fail). In the shallows she comes off as before.
- **Summoning** is unchanged: not from water; it rises and surfaces on dry spots (`stagSpot`).
- **Its health** in water neither drains nor heals, as on rock or a yard (pass 1's rule): a soil stag in a river is not worn by it.

**Constants** (tuning, Noah's to change): `STAG_WADE_DEPTH` 2.2, `STAG_WADE_SLOW` 0.45, `STAG_BELLY` 1.0 (`mountModel.ts`); `WAKE_FROM` 0.18, `WAKE_SPEED`
1.2, `WAKE_EVERY` 0.75, `SPLASH_EVERY` 0.55, `STREAM_DEEP` 0.25, `BANK_SEARCH_M` 40, `RUN_SAMPLE_M` 0.5 (`village.ts`, the mount block).

**Tests** (`tests/mount.test.ts`): the depths against the land's (`STAG_WADE_DEPTH` over the deepest bed, under the lake, over her
`WADE_DEPTH`), `canWade`, `wadeFactor`'s line (1 dry, `STAG_WADE_SLOW` at the deepest and held there, half way between at half, a ford
hardly slowing it, belly-deep still faster than her walk), the land's rule letting the stag through a real river's middle that refuses her
and refusing both the lake, the drive easing to the wade's pace. **CI** (`browser-village-vista.mjs`, the mount block): the call across
the river is two checks now, on the line x = 12 (x = 6, the old check's line, is the village's footbridge, whose deck the land's height reads,
so a stag there never wades): set `CALL_RUN_M` + 20 m off it answers `travel` and surfaces beside her as before; set on the north bank, she
on the south, a call answers `run` and the stag arrives beside her, having waded deeper than her `WADE_DEPTH` on the way (`state.stag.wade`,
the water over its feet, read each frame while it runs) and never sunk to travel. Then, set in the river at its deepest and mounted, the
dismount and a guard tap are refused and she rides on; knocked off, she is on the nearest bank, dry. The rides and the pass 3 vault are
unchanged. Dev: `__village.mount.wade` (the water over its feet),
`.deepWater` (whether she may be set down), `.water(x, z)` (the plateau's water), `state.stag.wade`, the constants.

**Open for Noah.** Whether a soil stag should lose health in water, or dissolve a little at each crossing (not built: today a river neither
drains nor heals it; a drain by depth, like the growth's, would make the lake's edge and the deep middle a cost); whether the body should go all the way down to the bed instead (`STAG_BELLY` raised past 1.75: the brief's words, but she would sit under the
water at a river's middle); whether it should swim
the lake (today the lake refuses it: `STAG_WADE_DEPTH` under `LAKE_DEPTH`; raising it past 9 would let it wade the lake's bed too, which
is not swimming); the slow (`STAG_WADE_SLOW` 0.45 and the line to it, by feel: a current pushing it downstream is not built); the wake (a
few flecks and a sound, no ripples on the water's surface: the water is the look's, and a ripple ring is the next thing to try); whether
her feet, hanging at its flanks, should read as wet; that the plateau's `water(x, z)` reads the model's ground, a little under the baked bank's
(the erosion), so by the banks it can name water, and a depth, where the drawn ground stands just over the water line (the stag's own `wade`
reads the baked ground, so it is dry there; her `walkable` reads the model's depth, so a bank's last half metre can refuse her where it
would not): a land thing, noted here because the knock-off's bank check met it; whether the dismount should instead set her on the bank from mid-river (today it
refuses, she rides on); and the bank search's reach (40 m, more than any river is wide).
