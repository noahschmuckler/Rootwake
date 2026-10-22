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
