# Rigged character files

Drop a rigged, skinned character here as `hulda.glb`, `hulda.gltf` or `hulda.fbx` and the clearing
(`/flow/` and the character preview) uses it in place of the procedural Hulda: fitted to her 0.72 m
capsule with its feet on the ground, turned to face the game's forward, and its clips driven by her
measured speed. Nothing else changes: the wooden forms, the transformations and the traversal are
the same.

- **Clips by name.** A clip whose name contains *idle*, *walk* or *run* (also *jog*, *sprint*, *stand*,
  *breath*) takes that role. Mixamo's "Idle", "Walking" and "Running" work as they are. Roles the file
  lacks give their weight to the nearest one it has; a lone unnamed clip is treated as the walk.
- **In place.** Export animations *in place*; the root bone's x and z travel is pinned anyway, keeping
  only its bob.
- **Facing.** glTF and Mixamo files face +Z and are turned to −Z. A file that already faces −Z can be
  loaded with `?facing=-z`.
- **Extra clips.** Mixamo lets a clip be exported without skin; load them with `?clips=models/a.fbx,models/b.fbx`.
- **Trying a file without committing it.** `?model=models/yourfile.fbx` loads any file under this folder.
- **The sample.** `samples/sample-rig.gltf` (from `node scripts/make-sample-rig.mjs`) is a two-bone
  skinned figure with Idle, Walking and Running clips that the browser journey loads to prove the path.

FBX loading pulls in Three.js's FBXLoader on demand; textures referenced by an FBX must sit beside it.
