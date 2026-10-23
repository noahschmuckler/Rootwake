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
