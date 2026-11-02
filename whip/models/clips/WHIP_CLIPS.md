# Whip animation clip set - manifest

12 animation clips for Rootwake (whip fight set), exported from Mixamo on X Bot,
then normalized to strict in-place. Drop into `public/models/clips/`.

## Export settings (all clips)

- Format: FBX Binary (FBX 7.7)
- Skin: Without Skin (no mesh; 65-joint mixamorig skeleton only)
- Frame rate: 30 fps
- Character: X Bot

## In-place normalization (all 12 clips)

Mixamo's current export does not honor the In Place option, so every clip -
including leap.fbx - was normalized after export:

- Hips (root) X/Z translation pinned to each clip's first-frame value:
  horizontal root motion is stripped. Verified: hips X/Z is exactly constant
  across all frames in every file.
- Hips Y (vertical) is untouched: jumps, slides and landings keep their height.
- All rotations and every other joint curve are byte-identical to the original
  Mixamo export.
- Pre-normalization originals are kept separately (mixamo-whip-orig/) if a
  traveling version is ever needed.

## Clip mapping (file -> Mixamo source)

| File | Mixamo clip | Note |
|---|---|---|
| whip-ready.fbx | Fighting Idle | exact |
| whip-crack.fbx | Standing 1H Cast Spell 01 | catalogue name for "Standing 1H Cast Spell" |
| whip-pull.fbx | Pulling A Rope | |
| sidestep-r.fbx | Dodging Right | exact |
| sidestep-l.fbx | Dodging Right, Mirror ticked | no "Dodging Left" in catalogue; mirrored for a true L/R pair |
| slide.fbx | Running Slide | exact |
| cartwheel.fbx | Cartwheel | exact |
| flip.fbx | Front Flip | exact |
| spin.fbx | Armada | capoeira spin kick; best match for the spin figure |
| fling.fbx | Throw | exact |
| land.fbx | Hard Landing | non-"Game Blend" variant |
| leap.fbx | Standing Melee Run Jump Attack | not a new download: copied from the repo's existing `public/models/clips/jump-attack.fbx` (verified as this clip via FIGHT_HANDOFF.md F2), then normalized in place like the other 11 |
