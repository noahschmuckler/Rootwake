// The wolf's body, shared by the village world (the packs that come down at dusk) and the dens (the pack
// asleep below by day): low and grey, four legs, a tail and ears, eyes that catch the light.
import * as THREE from 'three';
export interface WolfBody { group: THREE.Group; legs: THREE.Mesh[]; tail: THREE.Mesh; hide: THREE.MeshStandardMaterial; eyes: THREE.Mesh[] }
export const wolfHide = (): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial({ color: '#6a655c', emissive: '#000000', roughness: 0.95, flatShading: true });
const wolfEye = new THREE.MeshBasicMaterial({ color: '#ffe070' }), direEye = new THREE.MeshBasicMaterial({ color: '#ff2a1a' });
/** S4c (SETTLEMENTS.md §6): a dire wolf is black and red-eyed. */
export const DIRE_HIDE = '#17141a', WOLF_GREY = '#6a655c';
export function makeWolf(hide: THREE.MeshStandardMaterial = wolfHide()): WolfBody {
  const group = new THREE.Group(), legs: THREE.Mesh[] = [], eyes: THREE.Mesh[] = [];
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 9, 7), hide); body.scale.set(1.9, 0.8, 0.7); body.position.y = 0.58; group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 6), hide); head.scale.set(1.3, 0.9, 0.85); head.position.set(0.72, 0.72, 0); group.add(head);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.13, 0.15), hide); snout.position.set(0.98, 0.66, 0); group.add(snout);
  for (const zz of [-0.09, 0.09]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 5), hide); ear.position.set(0.62, 0.92, zz); group.add(ear); const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 5, 4), wolfEye); eye.position.set(0.88, 0.76, zz); group.add(eye); eyes.push(eye); }
  for (let i = 0; i < 4; i++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.5, 5), hide); leg.position.set(-0.4 + Math.floor(i / 2) * 0.8, 0.26, (i % 2 ? 1 : -1) * 0.17); group.add(leg); legs.push(leg); }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.5, 5), hide); tail.position.set(-0.75, 0.62, 0); tail.rotation.z = 1.2; group.add(tail);
  return { group, legs, tail, hide, eyes };
}
/** Make a wolf dire (black, red-eyed) or ordinary again. */
export function setDireLook(w: { hide: THREE.MeshStandardMaterial; eyes: THREE.Mesh[] }, dire: boolean): void { w.hide.color.set(dire ? DIRE_HIDE : WOLF_GREY); for (const e of w.eyes) { e.material = dire ? direEye : wolfEye; e.scale.setScalar(dire ? 1.5 : 1); } }

// ── The file wolf (Noah, 2026-11-01: public assets for the wolves) ──
// Quaternius's Wolf from his Animal Pack Vol.2 (CC0; public/models/wolf.glb, WOLF_CREDITS.md beside it: the FBX converted by
// scripts/fbx-to-glb.mjs), cloned with its skeleton per wolf, fitted to WOLF_LENGTH, every material the hide, two of our eyes on its
// head bone; its Idle and Walking clips on a mixer, blended by speed and the walk paced to the speed it was made for. The file faces +x
// like `makeWolf`'s body, so a world places it the same way. The Ultimate Animated Animal Pack's wolf (the stag's pack: gallop, attacks,
// death) is the intended replacement when its download is reachable; this loader takes it unchanged.
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
export interface WolfAsset { scene: THREE.Group; clips: THREE.AnimationClip[] }
export async function loadWolfAsset(url: string): Promise<WolfAsset> {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(url); return { scene: gltf.scene, clips: gltf.animations };
}
/** The wolf's length nose to rump (m), the file's own length in its units, and the walk clip's pace (m/s at its own rate: a guess at
 * its stride, by eye). Tuning. */
export const WOLF_LENGTH = 1.55, ASSET_WOLF_LENGTH = 1000, WOLF_CLIP_WALK_MS = 0.85, WOLF_BLEND_S = 0.18;
/** The jaws from the head bone's root at rest (m, forward and up), and how far the body drops lying down (m). Tuning, by eye. */
export const MOUTH_FWD = 0.21, MOUTH_UP = -0.06, LIE_DROP = 0.3;
/** A pose laid over the clips (henGrove.ts' harvesting wolf; the file has only Idle and Walking): the neck and head pitched (+ up) and
 * turned (+ to its left), lying down 0..1 (the body lowered, forelegs reaching forward, hind legs folded under), a forepaw raised 0..1. */
export interface WolfPose { neckPitch: number; neckYaw: number; headPitch: number; headYaw: number; headRoll: number; lie: number; paw: number }
export interface WolfFigure { group: THREE.Group; hide: THREE.MeshStandardMaterial; eyes: THREE.Mesh[]; /** A point in its jaws, on the head bone (a thing carried in its mouth). */ mouth: THREE.Object3D; /** `speed` (m/s) blends the walk in and paces it; 0 idles; `pose` is laid over the clip. */ update(speed: number, dt: number, pose?: WolfPose): void; readonly triangles: number; dispose(): void }
export function createAssetWolf(asset: WolfAsset, hide: THREE.MeshStandardMaterial = wolfHide()): WolfFigure {
  const group = new THREE.Group(); group.name = 'wolf';
  const model = cloneSkeleton(asset.scene) as THREE.Group; const fit = WOLF_LENGTH / ASSET_WOLF_LENGTH; model.scale.setScalar(fit); group.add(model);
  let triangles = 0;
  model.traverse(o => { if (o instanceof THREE.Mesh) { o.castShadow = true; o.frustumCulled = false; o.material = hide; const g = o.geometry; triangles += g.index ? g.index.count / 3 : g.attributes.position.count / 3; } });
  group.updateMatrixWorld(true);
  // Its eyes: on the bone furthest forward (the head's tip), a little back and down from the nose, either side.
  const eyes: THREE.Mesh[] = []; let tip: THREE.Object3D | null = null, tipX = -Infinity; const p = new THREE.Vector3();
  model.traverse(o => { if ((o as THREE.Bone).isBone) { o.getWorldPosition(p); if (p.x > tipX) { tipX = p.x; tip = o; } } });
  // (The file's bones carry a scale of their own, so an eye's size is undone from the bone's world scale, not the fit.)
  const head: THREE.Object3D = tip ?? model, eyeGeo = new THREE.SphereGeometry(0.03, 6, 5), headScale = head.getWorldScale(new THREE.Vector3()).x || 1;
  for (const zz of [-0.075, 0.075]) { const e = new THREE.Mesh(eyeGeo, wolfEye); const w = new THREE.Vector3(tipX - 0.16, 0.6, zz); e.position.copy(head.worldToLocal(w)); e.scale.setScalar(1 / headScale); head.add(e); eyes.push(e); }
  // The jaws: forward of the head bone's root, low (found by eye on the file: the head bone's origin is at the head's base).
  const mouth = new THREE.Object3D(); { const hp = head.getWorldPosition(new THREE.Vector3()); mouth.position.copy(head.worldToLocal(new THREE.Vector3(hp.x + MOUTH_FWD, hp.y + MOUTH_UP, 0))); head.add(mouth); }
  const bones: Record<string, THREE.Object3D> = {}; model.traverse(o => { if ((o as THREE.Bone).isBone) bones[o.name] = o; });
  // The posed bones' rest, put back before each frame's clip (the Idle clip does not drive the legs, so a turn laid on them would pile up).
  const POSED = ['Bone002', 'Bone003', 'Bone008', 'Bone011', 'Bone014', 'Bone017'], rest = new Map(POSED.filter(n => bones[n]).map(n => [n, bones[n].quaternion.clone()]));
  const q = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
  const turn = (b: THREE.Object3D | undefined, axis: THREE.Vector3, a: number): void => { if (b && a) b.quaternion.multiply(q.setFromAxisAngle(axis, a)); };
  function applyPose(p: WolfPose): void {
    // (Found on the file: a neck or head bone's x pitches it, + up; its z turns it; its y rolls it. A foreleg's z swings it, - toward the head; a hind leg's x, - toward the head (its z splays it sideways).)
    turn(bones.Bone002, X, p.neckPitch); turn(bones.Bone002, Z, p.neckYaw); turn(bones.Bone003, X, p.headPitch); turn(bones.Bone003, Z, p.headYaw); turn(bones.Bone003, Y, p.headRoll);
    for (const n of ['Bone014', 'Bone017']) turn(bones[n], Z, -1.35 * p.lie); for (const n of ['Bone008', 'Bone011']) turn(bones[n], X, -1.4 * p.lie);
    turn(bones.Bone014, Z, -0.9 * p.paw * (1 - p.lie));
    model.position.y = -LIE_DROP * p.lie;
  }
  const mixer = new THREE.AnimationMixer(model), action = (name: string): THREE.AnimationAction | null => { const c = asset.clips.find(x => x.name === name); if (!c) return null; const a = mixer.clipAction(c); a.setEffectiveWeight(0); a.play(); return a; };
  const idle = action('Idle'), walk = action('Walking'); let moving = 0, posed = false;
  function update(speed: number, dt: number, pose?: WolfPose): void {
    moving += ((speed > 0.05 ? 1 : 0) - moving) * Math.min(1, dt / WOLF_BLEND_S);
    idle?.setEffectiveWeight(1 - moving); walk?.setEffectiveWeight(moving); walk?.setEffectiveTimeScale(THREE.MathUtils.clamp(Math.max(0.3, speed) / WOLF_CLIP_WALK_MS, 0.6, 2.4));
    if (pose || posed) for (const [n, r] of rest) bones[n].quaternion.copy(r);
    mixer.update(dt); posed = !!pose; if (pose) applyPose(pose); else model.position.y = 0;
  }
  function dispose(): void { mixer.stopAllAction(); group.removeFromParent(); eyeGeo.dispose(); }
  return { group, hide, eyes, mouth, update, get triangles() { return triangles; }, dispose };
}
