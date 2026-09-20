// A rigged, skinned character with prefab animation clips (a Mixamo-style FBX or a glTF) standing
// in for the procedural Hulda: fitting it to her capsule, telling its clips apart by name, and
// driving them by measured speed with the same walk/run blend the procedural gait uses. Pure
// Three.js objects and maths; no loaders and no DOM here, so it is testable in node.
import * as THREE from 'three';
import { HuldaMotion } from './huldaMotion';

/** The capsule the shared player keeps: the model is scaled to this height with its feet at y=0. */
export const MODEL_HEIGHT = 0.72;
/** Which way the file faces. glTF's convention and Mixamo's exports face +Z; the game's forward is -Z. */
export type Facing = '+z' | '-z';
export const DEFAULT_FACING: Facing = '+z';
export type ClipRole = 'idle' | 'walk' | 'run';
export const ROLES: ClipRole[] = ['idle', 'walk', 'run'];
/** Metres per second each prefab cycle was authored for; its playback rate follows measured speed from here. Tuning. */
export const NOMINAL_SPEED: Record<ClipRole, number> = { idle: 0, walk: 1.4, run: 2.8 };
export const TIME_SCALE_MIN = 0.5, TIME_SCALE_MAX = 1.6;
/** Which clip plays which role, by its name: Mixamo names ("Idle", "Walking", "Running"), or anything containing the words. */
export function clipRoles(names: string[]): Partial<Record<ClipRole, string>> {
  const out: Partial<Record<ClipRole, string>> = {};
  const rules: [ClipRole, RegExp][] = [['run', /run|jog|sprint/i], ['walk', /walk|stride/i], ['idle', /idle|stand|breath|rest/i]];
  for (const [role, re] of rules) { const hit = names.find(n => re.test(n)); if (hit) out[role] = hit; }
  // One unnamed clip is a walk; a lone "mixamo.com" export is usually the one animation it was made with.
  if (!out.idle && !out.walk && !out.run && names.length) out.walk = names[0];
  return out;
}
/** Blend weights from the gait: idle at rest, walk, run; roles the file lacks give their weight to the nearest it has. */
export function gaitWeights(moving: number, run: number, has: Partial<Record<ClipRole, unknown>>): Record<ClipRole, number> {
  const w: Record<ClipRole, number> = { idle: 1 - moving, walk: moving * (1 - run), run: moving * run };
  if (!has.run) { w.walk += w.run; w.run = 0; }
  if (!has.walk) { if (has.run) w.run += w.walk; else w.idle += w.walk; w.walk = 0; }
  if (!has.idle) { if (has.walk) w.walk += w.idle; else if (has.run) w.run += w.idle; w.idle = 0; }
  return w;
}
/** Playback rate so the cycle's stride keeps pace with the measured speed. */
export const timeScaleFor = (role: ClipRole, speed: number): number => role === 'idle' || NOMINAL_SPEED[role] === 0 ? 1 : THREE.MathUtils.clamp(speed / NOMINAL_SPEED[role], TIME_SCALE_MIN, TIME_SCALE_MAX);
/** Keep a clip in place: the root bone's position track loses its x and z travel, keeping the bob. A clip with root motion would otherwise walk the model away from the player. */
export function pinRoot(clip: THREE.AnimationClip, rootBone: string): THREE.AnimationClip {
  for (const t of clip.tracks) {
    if (!(t instanceof THREE.VectorKeyframeTrack) || t.name !== `${rootBone}.position`) continue;
    const v = t.values; for (let i = 0; i < v.length; i += 3) { v[i] = v[0]; v[i + 2] = v[2]; }
  }
  return clip;
}
/** The topmost bone: where root motion would live. */
export function rootBoneOf(root: THREE.Object3D): THREE.Bone | null {
  let found: THREE.Bone | null = null;
  root.traverse(o => { if (!found && o instanceof THREE.Bone) found = o; });
  return found;
}
/** Scale the model to the capsule, put its feet at y=0 and its centre on the axis, and turn it to face -Z. */
export function fitModel(root: THREE.Object3D, facing: Facing = DEFAULT_FACING, height = MODEL_HEIGHT): { scale: number; sourceHeight: number } {
  const holder = new THREE.Group(); holder.name = 'HuldaModelFit';
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3());
  const sourceHeight = size.y > 1e-6 ? size.y : 1, scale = height / sourceHeight;
  root.scale.multiplyScalar(scale); root.updateMatrixWorld(true);
  const fitted = new THREE.Box3().setFromObject(root), centre = fitted.getCenter(new THREE.Vector3());
  root.position.x -= centre.x; root.position.z -= centre.z; root.position.y -= fitted.min.y;
  if (facing === '+z') root.rotation.y += Math.PI;
  root.updateMatrixWorld(true);
  return { scale, sourceHeight };
}
/** Clips under the gait: every role's action plays at once, weighted by the blend, paced by speed. Shared by a loaded body and by Hulda's own skeleton. */
export interface Gait { mixer: THREE.AnimationMixer; roles: Partial<Record<ClipRole, string>>; actions: Partial<Record<ClipRole, THREE.AnimationAction>>; motion: HuldaMotion; update(dt: number, speed: number, heading: number, grounded: boolean, fold?: number): void; dispose(): void }
export function installGait(root: THREE.Object3D, clips: THREE.AnimationClip[], motion = new HuldaMotion()): Gait {
  const rootBone = rootBoneOf(root); if (rootBone) for (const c of clips) pinRoot(c, rootBone.name);
  const mixer = new THREE.AnimationMixer(root), roles = clipRoles(clips.map(c => c.name)), actions: Partial<Record<ClipRole, THREE.AnimationAction>> = {};
  for (const role of ROLES) { const name = roles[role]; if (!name) continue; const clip = clips.find(c => c.name === name)!; const a = mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(role === 'idle' ? 1 : 0); a.play(); actions[role] = a; }
  function update(dt: number, speed: number, heading: number, grounded: boolean, fold = 0): void {
    const seconds = Number.isFinite(dt) ? Math.max(0, Math.min(0.05, dt)) : 0;
    motion.update(seconds, speed, heading, grounded);
    // Folding into a wooden form settles her to the idle before the bark takes over.
    const k = THREE.MathUtils.clamp(fold, 0, 1), w = gaitWeights(motion.moving * (1 - k), motion.run, actions);
    for (const role of ROLES) { const a = actions[role]; if (!a) continue; a.setEffectiveWeight(w[role]); a.setEffectiveTimeScale(timeScaleFor(role, motion.speed)); }
    mixer.update(seconds);
  }
  function dispose(): void { mixer.stopAllAction(); for (const c of clips) mixer.uncacheClip(c); }
  return { mixer, roles, actions, motion, update, dispose };
}
export interface RiggedModel extends Gait { root: THREE.Object3D }
/** Fit a loaded body and put its clips under the gait. */
export function installRiggedModel(root: THREE.Object3D, clips: THREE.AnimationClip[], facing: Facing = DEFAULT_FACING): RiggedModel {
  fitModel(root, facing);
  root.traverse(o => { if (o instanceof THREE.Mesh) o.frustumCulled = false; });
  const gait = installGait(root, clips);
  function dispose(): void { gait.dispose(); root.removeFromParent(); root.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose(); } }); }
  return { ...gait, root, dispose };
}
