// Her stag (STAGS.md): a red stag's size, a body of dark loam with grass sprouting along its back and neck,
// legs and antlers of branches, soft green eyes. Pass 2 (Noah: "a free asset for the stag's movement"): the body
// and the gait are Quaternius's CC0 Stag (public/models/stag.glb, STAG_CREDITS.md beside it), dressed as ours:
// every material loam, its horns hidden under our branch antlers, grass standees parented to its spine and neck
// bones, green eyes on its head bone; its Walk and Gallop blended by speed, Idle and Idle_Headlow (the graze)
// when it stands, Death under the collapse. The procedural figure of the first pass (ellipsoids, tapered tubes,
// standees, one mesh per moving part, a walk/gallop gait) stays as the fallback while the file loads or fails.
// Both draw the rise out of the ground (soil heaving, legs knitting, grass sprouting), the sink into it and the
// surfacing (a call from afar, a dismissal) and the collapse into a low mound that fades. Under both looks.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { taperedTube } from './flora';
import { standees, spriteMaterial, type Standee } from './sprites';
import { mulberry32 } from './colors';
import { RISE_S, COLLAPSE_S, FADE_S, SINK_S, SURFACE_S, SHOULDER, SADDLE, type MountPhase } from './mountModel';

// Tuning.
/** The procedural gait: metres per stride at a walk and at the gallop, and the speeds the walk gives way to the gallop between (m/s). */
const STRIDE_WALK = 1.2, STRIDE_GALLOP = 2.8, GALLOP_FROM = 2.6, GALLOP_TO = 4.8;
/** The legs' swing (rad) at a walk and at the gallop, and the fold of the lower leg through the swing. */
const SWING_WALK = 0.42, SWING_GALLOP = 0.85, FOLD_WALK = 0.7, FOLD_GALLOP = 1.15;
/** The eyes' colour, the loam's, the bark's and the grass's. */
const EYE = '#9cff6e', LOAM = '#3b2a1b', BARK = '#5c4631', GRASS = '#6f9c3c';
/** How long it stands before its head goes down to graze (s), and the graze's dip and its period (s). */
export const GRAZE_AFTER = 3, GRAZE_DIP = 0.95, GRAZE_S = 7;
/** The asset: the metres a second its Walk and Gallop clips were made for (their rate follows the speed from here, clamped), the speeds the walk gives way
 * to the gallop between, the height of its Torso2 bone in the file (its shoulder, fitted to SHOULDER), and the blend's seconds. */
const CLIP_WALK_MS = 1.1, CLIP_GALLOP_MS = 6.5, ASSET_GALLOP = [2.2, 4.6] as const, ASSET_SHOULDER = 2.38, BLEND_S = 0.18;

const smooth = (x: number): number => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };
const span = (x: number, a: number, b: number): number => smooth((x - a) / (b - a));

export interface StagState { phase: MountPhase; /** Seconds into the phase. */ t: number; speed: number; /** Seconds it has stood still. */ still: number; health: number }
export interface StagFigure {
  group: THREE.Group;
  /** Step the figure: the ground it stands on, its heading, its state and the frame's seconds. */
  update(x: number, y: number, z: number, heading: number, s: StagState, dt: number): void;
  /** The saddle, where she sits: its world position and rotation (after an update). */
  saddle(out: THREE.Vector3, rotation?: THREE.Quaternion): THREE.Vector3;
  /** The figure's triangles and its meshes (its cost), and whether it is the asset or the procedural fallback. */
  readonly triangles: number; readonly meshes: number; readonly kind: 'asset' | 'procedural';
  dispose(): void;
}
/** The loaded file: its scene (a template the figures clone) and its clips. */
export interface StagAsset { scene: THREE.Group; clips: THREE.AnimationClip[] }
/** Load the stag file (glTF/GLB) once; the figure clones it per stag. */
export async function loadStagAsset(url: string): Promise<StagAsset> {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(url); return { scene: gltf.scene, clips: gltf.animations };
}
/** A branch: a tapered, gnarled tube through the points, `r0` thick at its root and `r1` at its tip. */
function branch(points: THREE.Vector3[], r0: number, r1: number, segments = 6, radial = 5): THREE.BufferGeometry {
  return taperedTube(new THREE.CatmullRomCurve3(points), segments, radial, t => r0 + (r1 - r0) * t, 0.35);
}
const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(), P = new THREE.Vector3();
/** A part placed in its group: the geometry at a position, scale and turn (Euler), as a copy to merge. */
function placed(g: THREE.BufferGeometry, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx, rx = 0, ry = 0, rz = 0): THREE.BufferGeometry {
  return g.clone().applyMatrix4(M.compose(P.set(x, y, z), Q.setFromEuler(E.set(rx, ry, rz)), S.set(sx, sy, sz)));
}
/** The antlers: a beam up and back from each side of the poll, a brow tine forward, two tines along it, of branches; one geometry about the origin. */
function antlerGeometry(rand: () => number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const sx of [-1, 1]) {
    const j = (k: number): number => (rand() - 0.5) * k;
    const beam = [new THREE.Vector3(sx * 0.06, 0, 0), new THREE.Vector3(sx * 0.14, 0.22, 0.08 + j(0.04)), new THREE.Vector3(sx * 0.2, 0.46, 0.1 + j(0.06)), new THREE.Vector3(sx * 0.22, 0.7, 0.0 + j(0.06))];
    parts.push(branch(beam, 0.034, 0.012, 7, 5));
    const tines: [number, THREE.Vector3][] = [[0.25, new THREE.Vector3(sx * 0.1, 0.1, -0.2)], [0.55, new THREE.Vector3(sx * 0.14, 0.16, -0.12)], [0.8, new THREE.Vector3(sx * 0.06, 0.2, 0.06)]];
    const curve = new THREE.CatmullRomCurve3(beam);
    for (const [at, d] of tines) { const p = curve.getPointAt(at); parts.push(branch([p, p.clone().add(d.clone().multiplyScalar(0.5)).add(new THREE.Vector3(j(0.03), j(0.03), j(0.03))), p.clone().add(d)], 0.02, 0.008, 4, 4)); }
  }
  const g = mergeGeometries(parts)!; for (const p of parts) p.dispose(); return g;
}
/** The phases' shaping, shared: how far risen (0 in the ground, 1 up), how far collapsed, the mound's fade, and whether it is in the world at all. */
function shaping(s: StagState): { rising: number; collapse: number; fade: number; shown: boolean } {
  const rising = s.phase === 'rising' ? smooth(s.t / RISE_S) : s.phase === 'surfacing' ? smooth(s.t / SURFACE_S) : s.phase === 'sinking' ? 1 - smooth(s.t / SINK_S) : 1;
  const collapse = s.phase === 'collapsing' ? smooth(s.t / COLLAPSE_S) : 0, fade = s.phase === 'collapsing' ? Math.max(0, Math.min(1, (s.t - COLLAPSE_S) / FADE_S)) : 0;
  return { rising, collapse, fade, shown: s.phase !== 'gone' && s.phase !== 'travelling' };
}
function countCost(group: THREE.Object3D): { triangles: number; meshes: number } { let triangles = 0, meshes = 0; group.traverse(o => { if (o instanceof THREE.Mesh && o.visible) { const g = o.geometry; triangles += g.index ? g.index.count / 3 : g.attributes.position.count / 3; meshes++; } }); return { triangles, meshes }; }

/** The stag: the asset dressed as ours when the file is loaded, else the procedural figure. */
export function createStag(seed = 1, asset: StagAsset | null = null): StagFigure { return asset ? createAssetStag(seed, asset) : createProceduralStag(seed); }

/** Quaternius's stag as ours: cloned with its skeleton, fitted to SHOULDER, turned to face −z, every material loam, its horns hidden under our branch antlers on
 * its head bone, grass standees on its spine and neck bones, green eyes; its clips on a mixer, blended by speed. */
export function createAssetStag(seed: number, asset: StagAsset): StagFigure {
  const rand = mulberry32(seed * 977 + 13);
  const loam = new THREE.MeshStandardMaterial({ color: LOAM, roughness: 1, flatShading: true }), bark = new THREE.MeshStandardMaterial({ color: BARK, roughness: 0.95, flatShading: true }), grass = spriteMaterial('grass', GRASS);
  const eye = new THREE.MeshBasicMaterial({ color: EYE }), glow = new THREE.MeshBasicMaterial({ color: EYE, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  const materials = [loam, bark, grass, eye, glow], geometries: THREE.BufferGeometry[] = [];
  const group = new THREE.Group(); group.name = 'stag';
  const body = new THREE.Group(); group.add(body);
  const model = cloneSkeleton(asset.scene) as THREE.Group; const fit = SHOULDER / ASSET_SHOULDER; model.scale.setScalar(fit); model.rotation.y = Math.PI; body.add(model);
  const bone = (name: string): THREE.Object3D | null => model.getObjectByName(name) ?? null;
  // Its horns are hidden (ours grow in their place); every mesh is loam, its eyes' mesh ours.
  model.traverse(o => { if (!(o instanceof THREE.Mesh)) return; o.castShadow = true; o.frustumCulled = false; const names = (Array.isArray(o.material) ? o.material : [o.material]).map(m => m.name); o.material = names.some(n => n === 'Material.011') ? eye : loam; });
  const horns = bone('Stag_Horns'); if (horns) horns.visible = false;
  group.updateMatrixWorld(true);
  /** A world point (in metres, the fitted model at the origin facing −z) as a child of a bone: its local place and up. */
  const onBone = (b: THREE.Object3D, world: THREE.Vector3): { position: THREE.Vector3; up: THREE.Vector3; quaternion: THREE.Quaternion } => {
    const q = b.getWorldQuaternion(new THREE.Quaternion()).invert(); return { position: b.worldToLocal(world.clone()), up: new THREE.Vector3(0, 1, 0).applyQuaternion(q), quaternion: q };
  };
  const head = bone('Head'), antlers = new THREE.Group(), eyes = new THREE.Group();
  if (head) {
    // The poll (the file's horns' root) and the eyes, in the fitted frame: the file's Head bone stands at (0, 3.79, 2.15) facing +z, so facing −z its poll is at −z.
    const poll = new THREE.Vector3(0, 3.98 * fit, -2.3 * fit), at = onBone(head, poll); antlers.position.copy(at.position); antlers.quaternion.copy(at.quaternion); head.add(antlers);
    const ag = antlerGeometry(rand); geometries.push(ag); const am = new THREE.Mesh(ag, bark); am.castShadow = true; am.scale.setScalar(1 / fit); antlers.add(am);
    const sphere = new THREE.SphereGeometry(1, 10, 7); geometries.push(sphere);
    for (const sx of [-1, 1]) { const e = onBone(head, new THREE.Vector3(sx * 0.3 * fit, 3.87 * fit, -2.5 * fit)); const h = new THREE.Mesh(sphere, glow); h.position.copy(e.position); h.scale.setScalar(0.07 / fit); eyes.add(h); }
    head.add(eyes);
  }
  // Grass along the spine and up the neck: a few tufts on each bone, bottom edge in the loam, built in the bone's own frame (its up turned with it).
  const tuftMeshes: THREE.Mesh[] = [];
  const spine: [string, number, number][] = [['Back', 2.75, -1.3], ['Torso', 2.47, -0.57], ['Torso2', 2.38, 0.07], ['Torso3', 2.37, 0.82], ['Neck1', 2.53, 1.42], ['Neck2', 2.95, 1.7], ['Neck3', 3.34, 1.95]];
  for (const [name, by, bz] of spine) {
    const b = bone(name); if (!b) continue; const items: Standee[] = [], neck = name.startsWith('Neck');
    for (let i = 0; i < (neck ? 2 : 3); i++) {
      const top = new THREE.Vector3(((rand() - 0.5) * (neck ? 0.08 : 0.3)) * fit, (by + (neck ? 0.3 : 0.46)) * fit, -(bz + (rand() - 0.5) * 0.5) * fit), at = onBone(b, top);
      items.push({ position: at.position, up: at.up, yaw: rand() * Math.PI, width: (neck ? 0.14 : 0.2 + rand() * 0.1) / fit, height: (neck ? 0.18 : 0.22 + rand() * 0.14) / fit });
    }
    const g = standees(items); geometries.push(g); const mesh = new THREE.Mesh(g, grass); mesh.frustumCulled = false; b.add(mesh); tuftMeshes.push(mesh);
  }
  // The saddle rides its second torso bone, so her seat bobs with its back.
  const torso = bone('Torso2') ?? body, saddlePoint = new THREE.Object3D(); { const at = onBone(torso, new THREE.Vector3(0, SADDLE.y, -SADDLE.z)); saddlePoint.position.copy(at.position); saddlePoint.quaternion.copy(at.quaternion).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)); torso.add(saddlePoint); }
  // The clips: idle, the graze, walk, gallop looping; death once and held.
  const mixer = new THREE.AnimationMixer(model), action = (name: string, once = false): THREE.AnimationAction | null => { const c = asset.clips.find(x => x.name === name); if (!c) return null; const a = mixer.clipAction(c); if (once) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; } a.setEffectiveWeight(0); a.play(); return a; };
  const idle = action('Idle'), graze = action('Idle_Headlow'), walk = action('Walk'), gallop = action('Gallop'), death = action('Death', true);
  const grown = [antlers, ...tuftMeshes];
  const w = { moving: 0, run: 0, graze: 0, death: 0 }; let fadeOn = false, cost = countCost(group);
  const up = new THREE.Vector3(0, 1, 0), tmpQ = new THREE.Quaternion();
  function update(x: number, y: number, z: number, heading: number, s: StagState, dt: number): void {
    group.position.set(x, y, z); group.quaternion.setFromAxisAngle(up, heading);
    const { rising, collapse, fade, shown } = shaping(s); group.visible = shown;
    // The gait: the walk gives way to the gallop by speed, each clip paced to the speed it was made for; standing a while, the head goes down to graze.
    const ease = Math.min(1, dt / BLEND_S);
    w.moving += (span(s.speed, 0.05, 0.5) - w.moving) * ease; w.run += (span(s.speed, ASSET_GALLOP[0], ASSET_GALLOP[1]) - w.run) * ease;
    const wantGraze = s.phase === 'up' && s.still > GRAZE_AFTER ? 0.5 - 0.5 * Math.cos(((s.still - GRAZE_AFTER) / GRAZE_S) * Math.PI * 2) : 0; w.graze += (wantGraze - w.graze) * Math.min(1, dt * 2);
    w.death += ((s.phase === 'collapsing' ? 1 : 0) - w.death) * Math.min(1, dt / 0.2);
    const live = 1 - w.death;
    idle?.setEffectiveWeight(live * (1 - w.moving) * (1 - w.graze)); graze?.setEffectiveWeight(live * (1 - w.moving) * w.graze);
    walk?.setEffectiveWeight(live * w.moving * (1 - w.run)); gallop?.setEffectiveWeight(live * w.moving * w.run); death?.setEffectiveWeight(w.death);
    walk?.setEffectiveTimeScale(THREE.MathUtils.clamp(Math.max(0.3, s.speed) / CLIP_WALK_MS, 0.6, 2.2)); gallop?.setEffectiveTimeScale(THREE.MathUtils.clamp(Math.max(1, s.speed) / CLIP_GALLOP_MS, 0.6, 2));
    mixer.update(dt);
    // The rise and the surfacing: the body heaves out of the ground wide and low and fills out; the sink is the reverse; the collapse sags it into the loam under the death clip.
    body.position.y = -(1 - rising) * 1.1 - collapse * 0.45;
    body.scale.set(1 + 0.2 * (1 - rising) + 0.15 * collapse, 0.5 + 0.5 * rising - 0.35 * collapse, 1);
    for (const g of grown) { const k = span(rising, g === antlers ? 0.45 : 0.6, 1); g.scale.setScalar(Math.max(0.001, k)); }
    const lit = s.phase === 'up' ? 1 : s.phase === 'rising' || s.phase === 'surfacing' || s.phase === 'sinking' ? span(rising, 0.7, 1) : 0;
    eye.color.set(EYE).multiplyScalar(0.3 + 0.7 * lit); glow.opacity = 0.35 * lit;
    if (fade > 0 && !fadeOn) { fadeOn = true; for (const m of materials) { m.transparent = true; m.depthWrite = false; } }
    if (fadeOn) for (const m of materials) m.opacity = (m === glow ? 0.35 * lit : 1) * (1 - fade);
  }
  function saddle(out: THREE.Vector3, rotation?: THREE.Quaternion): THREE.Vector3 { group.updateMatrixWorld(true); saddlePoint.getWorldPosition(out); if (rotation) { saddlePoint.getWorldQuaternion(tmpQ); rotation.copy(tmpQ); } return out; }
  function dispose(): void { mixer.stopAllAction(); group.removeFromParent(); for (const g of geometries) g.dispose(); for (const m of materials) m.dispose(); }
  cost = countCost(group);
  return { group, update, saddle, get triangles() { return cost.triangles; }, get meshes() { return cost.meshes; }, kind: 'asset', dispose };
}

/** The first pass's figure, kept as the fallback: cheap procedural geometry, no asset, one mesh per moving part, a walk/gallop gait of its own. */
export function createProceduralStag(seed = 1): StagFigure {
  const rand = mulberry32(seed * 977 + 13);
  const loam = new THREE.MeshStandardMaterial({ color: LOAM, roughness: 1, flatShading: true });
  const bark = new THREE.MeshStandardMaterial({ color: BARK, roughness: 0.95, flatShading: true }), grass = spriteMaterial('grass', GRASS);
  const eye = new THREE.MeshBasicMaterial({ color: EYE }), glow = new THREE.MeshBasicMaterial({ color: EYE, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
  const materials = [loam, bark, grass, eye, glow], geometries: THREE.BufferGeometry[] = [];
  const sphere = new THREE.SphereGeometry(1, 12, 9), cone = new THREE.ConeGeometry(0.045, 0.17, 5), hoofGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.07, 6);
  const group = new THREE.Group(); group.name = 'stag';
  const mesh = (parts: THREE.BufferGeometry[], m: THREE.Material, parent: THREE.Object3D, shadow = true): THREE.Mesh => { const g = mergeGeometries(parts)!; for (const p of parts) p.dispose(); geometries.push(g); const o = new THREE.Mesh(g, m); o.castShadow = shadow; parent.add(o); return o; };
  // The body (one mesh: the torso, the rump, the chest, the tail), its centre a little under the shoulder's height.
  const body = new THREE.Group(); body.position.y = SHOULDER - 0.34; group.add(body);
  mesh([placed(sphere, 0, 0, 0, 0.29, 0.31, 0.76), placed(sphere, 0, 0.03, 0.42, 0.28, 0.3, 0.36), placed(sphere, 0, -0.03, -0.5, 0.27, 0.33, 0.34),
    branch([new THREE.Vector3(0, 0.12, 0.72), new THREE.Vector3(0, 0.02, 0.88), new THREE.Vector3(0, -0.1, 0.94)], 0.04, 0.015, 4, 4)], loam, body);
  // The neck pivots at the chest's top; it carries the head, and the head the antlers, the ears and the eyes.
  const neck = new THREE.Group(); neck.position.set(0, 0.16, -0.62); body.add(neck);
  mesh([branch([new THREE.Vector3(0, -0.08, 0.08), new THREE.Vector3(0, 0.3, -0.22), new THREE.Vector3(0, 0.62, -0.42)], 0.19, 0.11, 6, 7)], loam, neck);
  const head = new THREE.Group(); head.position.set(0, 0.64, -0.44); neck.add(head);
  mesh([placed(sphere, 0, 0.02, -0.08, 0.12, 0.14, 0.22), placed(sphere, 0, -0.04, -0.3, 0.08, 0.08, 0.14), placed(cone, -0.11, 0.1, 0, 1, 1, 1, -0.3, 0, 0.9), placed(cone, 0.11, 0.1, 0, 1, 1, 1, -0.3, 0, -0.9)], loam, head);
  mesh([placed(sphere, -0.095, 0.05, -0.2, 0.028), placed(sphere, 0.095, 0.05, -0.2, 0.028)], eye, head, false);
  mesh([placed(sphere, -0.095, 0.05, -0.2, 0.06), placed(sphere, 0.095, 0.05, -0.2, 0.06)], glow, head, false);
  const antlers = new THREE.Group(); antlers.position.set(0, 0.12, 0.02); head.add(antlers);
  mesh([antlerGeometry(rand)], bark, antlers);
  // The legs: a thigh from the body's hip, a shin and a hoof from the knee, of branches; the hocks fold the hoof back.
  interface Leg { hip: THREE.Group; knee: THREE.Group; fore: boolean; side: number }
  const legs: Leg[] = [];
  for (const fore of [true, false]) for (const side of [-1, 1]) {
    const hip = new THREE.Group(); hip.position.set(side * 0.17, -0.08, fore ? -0.48 : 0.5); body.add(hip);
    const thighL = 0.46, shinL = SHOULDER - 0.34 - 0.08 - thighL;
    mesh([branch([new THREE.Vector3(0, 0.04, 0), new THREE.Vector3(side * 0.02, -thighL * 0.55, fore ? 0.02 : -0.04), new THREE.Vector3(0, -thighL, 0)], 0.085, 0.05, 5, 5)], bark, hip);
    const knee = new THREE.Group(); knee.position.y = -thighL; hip.add(knee);
    mesh([branch([new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(0, -shinL * 0.5, fore ? -0.02 : 0.03), new THREE.Vector3(0, -shinL + 0.04, 0)], 0.045, 0.03, 5, 5), placed(hoofGeo, 0, -shinL + 0.035, 0)], bark, knee);
    legs.push({ hip, knee, fore, side });
  }
  // The grass: tufts along the spine and up the neck, bottom edge in the loam.
  const tufts: Standee[] = [];
  for (let i = 0; i < 16; i++) { const t = i / 15, z = -0.5 + t * 1.15, side = (rand() - 0.5) * 0.2, y = 0.27 + (1 - Math.abs(t - 0.5) * 2) * 0.04 - Math.abs(side) * 0.5; tufts.push({ position: new THREE.Vector3(side, y, z), yaw: rand() * Math.PI, width: 0.2 + rand() * 0.1, height: 0.22 + rand() * 0.14 }); }
  const back = mesh([standees(tufts)], grass, body, false);
  const neckTufts: Standee[] = [];
  for (let i = 0; i < 7; i++) { const t = (i + 0.5) / 7; neckTufts.push({ position: new THREE.Vector3((rand() - 0.5) * 0.08, 0.04 + t * 0.62, 0.0 - t * 0.5 + 0.06), yaw: rand() * Math.PI, width: 0.14 + rand() * 0.06, height: 0.16 + rand() * 0.1 }); }
  const mane = mesh([standees(neckTufts)], grass, neck, false);
  for (const g of [sphere, cone, hoofGeo]) g.dispose();
  const saddlePoint = new THREE.Object3D(); saddlePoint.position.set(0, SADDLE.y - body.position.y, SADDLE.z); body.add(saddlePoint);
  const grown = [antlers, back, mane];
  let phase = 0, run = 0, graze = 0, fadeOn = false; const cost = countCost(group);
  const tmpQ = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  function update(x: number, y: number, z: number, heading: number, s: StagState, dt: number): void {
    group.position.set(x, y, z); group.quaternion.setFromAxisAngle(up, heading);
    const { rising, collapse, fade, shown } = shaping(s); group.visible = shown;
    // The gait: one phase for the walk and the gallop, paced by the stride; the gallop's bounding comes in by speed.
    run += (span(s.speed, GALLOP_FROM, GALLOP_TO) - run) * Math.min(1, dt * 6);
    const stride = STRIDE_WALK + (STRIDE_GALLOP - STRIDE_WALK) * run, moving = span(s.speed, 0.05, 0.6);
    phase = (phase + dt * s.speed / stride * Math.PI * 2) % (Math.PI * 2);
    const swing = (SWING_WALK + (SWING_GALLOP - SWING_WALK) * run) * moving, fold = (FOLD_WALK + (FOLD_GALLOP - FOLD_WALK) * run) * moving;
    for (const l of legs) {
      // A walk: diagonal pairs together (the fore left with the hind right). A gallop: the fore pair close, the hind pair close, half a cycle apart.
      const walkP = phase + (l.fore !== l.side < 0 ? 0 : Math.PI), gallopP = phase + (l.fore ? 0 : Math.PI) + (l.side < 0 ? 0 : 0.5);
      const p = walkP + (gallopP - walkP) * run, sw = Math.sin(p);
      l.hip.rotation.x = sw * swing * (l.fore ? 1 : 0.9);
      l.knee.rotation.x = -Math.max(0, Math.cos(p - Math.PI * 0.35)) * fold;
      const knit = span(rising, 0.25, 0.75); l.hip.scale.set(1, Math.max(0.001, knit * (1 - 0.8 * collapse)), 1); l.hip.rotation.z = l.side * 0.75 * collapse;
    }
    const bob = moving * Math.sin(phase * 2) * (0.015 + 0.05 * run), rock = Math.sin(phase) * 0.07 * run * moving;
    body.position.y = (SHOULDER - 0.34) * (0.55 + 0.45 * rising) - (1 - rising) * 0.9 + bob - collapse * 0.75;
    body.scale.set(1 + 0.2 * (1 - rising) + 0.25 * collapse, (0.5 + 0.5 * rising) * (1 - 0.72 * collapse), 1 + 0.15 * collapse);
    body.rotation.x = rock + collapse * 0.35; body.rotation.z = collapse * 0.5;
    for (const g of grown) { const k = span(rising, g === antlers ? 0.45 : 0.6, 1); g.scale.setScalar(Math.max(0.001, k)); }
    const wantGraze = s.phase === 'up' && s.still > GRAZE_AFTER ? 0.5 - 0.5 * Math.cos(((s.still - GRAZE_AFTER) / GRAZE_S) * Math.PI * 2) : 0;
    graze += (wantGraze - graze) * Math.min(1, dt * 2.5);
    neck.rotation.x = graze * GRAZE_DIP + run * moving * 0.35 + collapse * 1.3 - (1 - rising) * 0.6;
    head.rotation.x = -graze * 0.3 - run * moving * 0.3 + collapse * 0.6;
    const lit = s.phase === 'up' ? 1 : s.phase === 'rising' || s.phase === 'surfacing' || s.phase === 'sinking' ? span(rising, 0.7, 1) : 0;
    eye.color.set(EYE).multiplyScalar(0.3 + 0.7 * lit); glow.opacity = 0.35 * lit;
    if (fade > 0 && !fadeOn) { fadeOn = true; for (const m of materials) { m.transparent = true; m.depthWrite = false; } }
    if (fadeOn) for (const m of materials) m.opacity = (m === glow ? 0.35 * lit : 1) * (1 - fade);
  }
  function saddle(out: THREE.Vector3, rotation?: THREE.Quaternion): THREE.Vector3 { group.updateMatrixWorld(true); saddlePoint.getWorldPosition(out); if (rotation) { saddlePoint.getWorldQuaternion(tmpQ); rotation.copy(tmpQ); } return out; }
  function dispose(): void { group.removeFromParent(); for (const g of geometries) g.dispose(); for (const m of materials) m.dispose(); }
  return { group, update, saddle, get triangles() { return cost.triangles; }, get meshes() { return cost.meshes; }, kind: 'procedural', dispose };
}

/** Her seat on its back: a pose for her skeleton (huldaCharacter's bones, named with Mixamo's prefix) as a clip of one still frame, played on the
 * gait's mixer over the gait. Posing is as huldaCharacter's: a rotation in the rig's frame (x right, y up, z forward) on the bind, with the arms'
 * rest hang as the gait has it (the upper arm's bind rolled to hang, its forearm and hand carried with it), so the knees and the arms read as
 * sitting astride and holding the neck. `swing` positive takes a hanging limb forward; `roll` positive lifts its left side. Tuning: the angles. */
export function seatClip(bones: Map<string, THREE.Bone>, bindLocal: Map<string, THREE.Quaternion>, prefix = 'mixamorig'): THREE.AnimationClip {
  const world = new Map<string, THREE.Quaternion>();
  const worldOf = (b: THREE.Bone): THREE.Quaternion => { let q = world.get(b.name); if (q) return q; const p = b.parent; q = (p instanceof THREE.Bone ? worldOf(p).clone() : new THREE.Quaternion()).multiply(bindLocal.get(b.name)!); world.set(b.name, q); return q; };
  const X = new THREE.Vector3(-1, 0, 0), Z = new THREE.Vector3(0, 0, 1);
  const swing = (angle: number, roll = 0): THREE.Quaternion => new THREE.Quaternion().setFromAxisAngle(X, angle).multiply(new THREE.Quaternion().setFromAxisAngle(Z, roll));
  const tracks: THREE.KeyframeTrack[] = [];
  /** `restRoll`: the hang the arm's chain rests in (its world frames rolled); `rolledLocal`: the bone whose own local rest carries that roll (the upper arm). */
  const pose = (short: string, R: THREE.Quaternion, restRoll = 0, rolledLocal = false): void => {
    const b = bones.get(prefix + short); if (!b) return;
    const wb = worldOf(b).clone(), roll = new THREE.Quaternion().setFromAxisAngle(Z, restRoll), rw = roll.clone().multiply(wb);
    const restLocal = rolledLocal ? bindLocal.get(b.name)!.clone().multiply(wb.clone().invert()).multiply(roll).multiply(wb) : bindLocal.get(b.name)!.clone();
    const q = restLocal.multiply(rw.clone().invert()).multiply(R).multiply(rw);
    tracks.push(new THREE.QuaternionKeyframeTrack(`${b.name}.quaternion`, [0, 1], [...q.toArray(), ...q.toArray()]));
  };
  const armHang = (short: string): number => { const b = bones.get(prefix + short); if (!b) return 0; const d = new THREE.Vector3(0, 1, 0).applyQuaternion(worldOf(b)); return -Math.sign(d.x) * (Math.PI / 2 - Math.atan2(Math.abs(d.y), Math.abs(d.x)) - 0.08); };
  pose('Spine', swing(-0.12)); pose('Spine1', swing(-0.1)); pose('Neck', swing(0.12));
  for (const Pf of ['Left', 'Right']) {
    const side = Pf === 'Left' ? -1 : 1;
    pose(Pf + 'UpLeg', swing(1.2, side * -0.42)); pose(Pf + 'Leg', swing(-1.35)); pose(Pf + 'Foot', swing(0.25));
    const hang = armHang(Pf + 'Arm'); pose(Pf + 'Arm', swing(-0.75, side * 0.18), hang, true); pose(Pf + 'ForeArm', swing(0.55), hang); pose(Pf + 'Hand', swing(0.3), hang);
  }
  return new THREE.AnimationClip('seat', 1, tracks);
}
