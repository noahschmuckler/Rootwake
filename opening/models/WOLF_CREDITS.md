# wolf.glb

The Eden's pack (EDEN.md): the **Wolf** from Quaternius's *Animal Pack Vol.2* ("Animated Wolf, Eagle, Dog, Cat and Piranha", 2017,
https://opengameart.org/content/animated-animales-low-poly), **CC0** (public domain) by its listing. Consider supporting the author:
https://www.patreon.com/quaternius

Converted from the pack's `FBX/Wolf.fbx` by `scripts/fbx-to-glb.mjs` (three's FBXLoader → GLTFExporter, no textures: the file is one
flat material the figure replaces) to a 218 KB GLB: the mesh (622 triangles), its skin (34 bones) and two clips, `Idle` and `Walking`
(1.67 s each). In the game (`wolfFigure.createAssetWolf`) it is fitted to `WOLF_LENGTH`, given the hide material and our eyes on its head
bone, its walk paced by speed.

The pack's Eagle (24,800 triangles, scalloped feather shells that fall apart under decimation) was tried for the fungal birds and left
out; the birds stay procedural (`nightFigures.createBird`).
