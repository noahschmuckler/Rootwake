# bobcat.glb

The Eden's bobcat (EDEN.md, E2a): the **Cat** from Quaternius's *Animal Pack Vol.2* ("Animated Wolf, Eagle, Dog, Cat and Piranha",
2017, https://opengameart.org/content/animated-animales-low-poly), **CC0** (public domain) by its listing. Consider supporting the
author: https://www.patreon.com/quaternius

Converted from the pack's `FBX/Cat.fbx` by `scripts/fbx-to-glb.mjs` to a 267 KB GLB: the mesh (807 triangles), its skin (34 bones)
and two clips, `Idle` and `Walking` (1.67 s each). In the game (`nightFigures.createAssetBobcat`) it is made the bobcat in the
Hollowed's design language: stretched tall and narrow, its tail bobbed (the tail bones past the first shrunk each frame), a hood-like
ruff on its neck bone, a dark beaked muzzle, ember eyes and ear tufts on its head bone, every material the grey hide; Idle and
Walking blended by speed, the walk slowed for the climb and quickened for the leap.

The simplifier had written the mesh as 72 primitives (one per material group of the source), each a skinned draw every frame;
`scripts/merge-glb.mjs` joined them by material into 3 (2026-11-01, the judder; 261 KB).
