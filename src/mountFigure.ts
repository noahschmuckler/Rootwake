// Her stag (STAGS.md): a red stag's size, a body of dark loam with grass sprouting along its back and neck,
// legs and antlers of branches, soft green eyes. Cheap procedural geometry, no asset: ellipsoids for the
// loam, tapered tubes (flora.ts, as the roots are drawn) for the branches, crossed standees (sprites.ts)
// for the grass, merged into one mesh per moving part (seventeen draw calls). A four-legged gait by speed
// (a walk's diagonal pairs, a gallop's bounding), the rise out of the ground (soil heaving, legs knitting,
// grass sprouting) and the collapse into a low mound that fades. Under both looks: standard materials the
// vista's light and grade take as they take the trees.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { taperedTube } from './flora';
import { standees, spriteMaterial, type Standee } from './sprites';
import { mulberry32 } from './colors';
import { RISE_S, COLLAPSE_S, FADE_S, SHOULDER, SADDLE, type MountPhase } from './mountModel';

// Tuning.
/** The gait: metres per stride at a walk and at the gallop, and the speeds the walk gives way to the gallop between (m/s). */
const STRIDE_WALK = 1.2, STRIDE_GALLOP = 2.8, GALLOP_FROM = 2.6, GALLOP_TO = 4.8;
/** The legs' swing (rad) at a walk and at the gallop, and the fold of the lower leg through the swing. */
const SWING_WALK = 0.42, SWING_GALLOP = 0.85, FOLD_WALK = 0.7, FOLD_GALLOP = 1.15;
/** The eyes' colour, the loam's, the bark's and the grass's. */
const EYE = '#9cff6e', LOAM = '#3b2a1b', BARK = '#5c4631', GRASS = '#6f9c3c';
/** How long it stands before its head goes down to graze (s), and the graze's dip and its period (s). */
export const GRAZE_AFTER = 3, GRAZE_DIP = 0.95, GRAZE_S = 7;

const smooth = (x: number): number => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };
const span = (x: number, a: number, b: number): number => smooth((x - a) / (b - a));

export interface StagState { phase: MountPhase; /** Seconds into the phase. */ t: number; speed: number; /** Seconds it has stood still. */ still: number; health: number }
export interface StagFigure {
  group: THREE.Group;
  /** Step the figure: the ground it stands on, its heading, its state and the frame's seconds. */
  update(x: number, y: number, z: number, heading: number, s: StagState, dt: number): void;
  /** The saddle, where she sits: its world position and rotation (after an update). */
  saddle(out: THREE.Vector3, rotation?: THREE.Quaternion): THREE.Vector3;
  /** The figure's triangles and its meshes (its cost). */
  readonly triangles: number; readonly meshes: number;
  dispose(): void;
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
export function createStag(seed = 1): StagFigure {
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
  // The antlers: a beam up and back from each side of the poll, a brow tine forward, two tines along it, of branches; one mesh.
  const antlers = new THREE.Group(); antlers.position.set(0, 0.12, 0.02); head.add(antlers);
  const antlerParts: THREE.BufferGeometry[] = [];
  for (const sx of [-1, 1]) {
    const j = (k: number): number => (rand() - 0.5) * k;
    const beam = [new THREE.Vector3(sx * 0.06, 0, 0), new THREE.Vector3(sx * 0.14, 0.22, 0.08 + j(0.04)), new THREE.Vector3(sx * 0.2, 0.46, 0.1 + j(0.06)), new THREE.Vector3(sx * 0.22, 0.7, 0.0 + j(0.06))];
    antlerParts.push(branch(beam, 0.034, 0.012, 7, 5));
    const tines: [number, THREE.Vector3][] = [[0.25, new THREE.Vector3(sx * 0.1, 0.1, -0.2)], [0.55, new THREE.Vector3(sx * 0.14, 0.16, -0.12)], [0.8, new THREE.Vector3(sx * 0.06, 0.2, 0.06)]];
    const curve = new THREE.CatmullRomCurve3(beam);
    for (const [at, d] of tines) { const p = curve.getPointAt(at); antlerParts.push(branch([p, p.clone().add(d.clone().multiplyScalar(0.5)).add(new THREE.Vector3(j(0.03), j(0.03), j(0.03))), p.clone().add(d)], 0.02, 0.008, 4, 4)); }
  }
  mesh(antlerParts, bark, antlers);
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
  let phase = 0, run = 0, graze = 0, fadeOn = false, triangles = 0, meshes = 0;
  group.traverse(o => { if (o instanceof THREE.Mesh) { const g = o.geometry; triangles += g.index ? g.index.count / 3 : g.attributes.position.count / 3; meshes++; } });
  const tmpQ = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  function update(x: number, y: number, z: number, heading: number, s: StagState, dt: number): void {
    group.position.set(x, y, z); group.quaternion.setFromAxisAngle(up, heading);
    const rising = s.phase === 'rising' ? smooth(s.t / RISE_S) : 1, collapse = s.phase === 'collapsing' ? smooth(s.t / COLLAPSE_S) : 0, gone = s.phase === 'gone';
    group.visible = !gone;
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
      // The rise: the legs knit from the loam; the collapse: they give and splay.
      const knit = span(rising, 0.25, 0.75); l.hip.scale.set(1, Math.max(0.001, knit * (1 - 0.8 * collapse)), 1); l.hip.rotation.z = l.side * 0.75 * collapse;
    }
    // The body bobs with the stride, rocks at the gallop; it heaves out of the ground as it rises, sags as it collapses.
    const bob = moving * Math.sin(phase * 2) * (0.015 + 0.05 * run), rock = Math.sin(phase) * 0.07 * run * moving;
    body.position.y = (SHOULDER - 0.34) * (0.55 + 0.45 * rising) - (1 - rising) * 0.9 + bob - collapse * 0.75;
    body.scale.set(1 + 0.2 * (1 - rising) + 0.25 * collapse, (0.5 + 0.5 * rising) * (1 - 0.72 * collapse), 1 + 0.15 * collapse);
    body.rotation.x = rock + collapse * 0.35; body.rotation.z = collapse * 0.5;
    // The grass and the antlers grow in late in the rise.
    for (const g of grown) { const k = span(rising, g === antlers ? 0.45 : 0.6, 1); g.scale.setScalar(Math.max(0.001, k)); }
    // Standing a while, the head goes down to graze; the neck droops as it collapses; at a gallop the neck reaches out.
    const wantGraze = s.phase === 'up' && s.still > GRAZE_AFTER ? 0.5 - 0.5 * Math.cos(((s.still - GRAZE_AFTER) / GRAZE_S) * Math.PI * 2) : 0;
    graze += (wantGraze - graze) * Math.min(1, dt * 2.5);
    neck.rotation.x = graze * GRAZE_DIP + run * moving * 0.35 + collapse * 1.3 - (1 - rising) * 0.6;
    head.rotation.x = -graze * 0.3 - run * moving * 0.3 + collapse * 0.6;
    // The eyes light as it wakes and go out as it dies.
    const lit = s.phase === 'up' ? 1 : s.phase === 'rising' ? span(rising, 0.7, 1) : 0;
    eye.color.set(EYE).multiplyScalar(0.3 + 0.7 * lit); glow.opacity = 0.35 * lit;
    // After the collapse the mound fades.
    const fade = s.phase === 'collapsing' ? Math.max(0, Math.min(1, (s.t - COLLAPSE_S) / FADE_S)) : 0;
    if (fade > 0 && !fadeOn) { fadeOn = true; for (const m of materials) { m.transparent = true; m.depthWrite = false; } }
    if (fadeOn) for (const m of materials) m.opacity = (m === glow ? 0.35 * lit : 1) * (1 - fade);
  }
  function saddle(out: THREE.Vector3, rotation?: THREE.Quaternion): THREE.Vector3 { group.updateMatrixWorld(true); saddlePoint.getWorldPosition(out); if (rotation) { saddlePoint.getWorldQuaternion(tmpQ); rotation.copy(tmpQ); } return out; }
  function dispose(): void { group.removeFromParent(); for (const g of geometries) g.dispose(); for (const m of materials) m.dispose(); }
  return { group, update, saddle, get triangles() { return triangles; }, get meshes() { return meshes; }, dispose };
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
