// The mother's brood as the scene draws it (MOTHER.md; Noah, 2026-10-22): the snatcher and the sac.
//
// The snatcher is a Dark Young kid: the same octopus folded into a goat, small enough to carry an
// infant, its mantle a kid's body and its eight arms folded into legs, ears and horn buds. It runs as a
// kid gallops. At a door the head comes apart into arms that reach in. And it hides: at a tree it
// stands up into a crude sapling (the mantle a knot on a trunk of braided arms, the head's arms
// branches with needle tufts sprouting on them), in the open it squats into a shrub (the arms splayed
// up and out, leafed), and its skin takes the bark's grain and colour. The arms open from the base
// outward, so the change reads as unfolding, not morphing. Hidden, its eyes close, and now and then
// they open: the one tell.
//
// The sac hangs from a black vessel; it darkens from pink to bruise to black as the gestation runs,
// the bundle inside lengthening and budding horns. Her cut opens a slit and makes it shudder, and the
// other sacs tighten. At due it splits and hangs torn. Tuning constants at the top.
import * as THREE from 'three';
import { mantleGeometry } from './darkYoung';
import { floorTexture } from './groundTextures';
import { taperedTube } from './flora';
import { mulberry32 } from './colors';

/** The kid's size against a Dark Young's mantle. Tuning. */
const KID = 0.38;
/** How fast the disguise comes on and goes (per second, eased), the gallop's pace (rad per second) and stride (m). Tuning. */
const HIDE_RATE = 2.6, BOLT_RATE = 7, GALLOP = 22, STRIDE = 0.16;
/** The sapling's height (m) and the shrub's spread and height (m). Tuning. */
const TREE_H = 2.7, BUSH_R = 0.85, BUSH_H = 1.05;
/** The eyes' tell while hidden: one opening every EYE_EVERY s (spread), for EYE_OPEN s. Tuning. */
const EYE_EVERY = 4.5, EYE_OPEN = 0.35;
/** Rings and sides of an arm's tube; tufts on each arm. Tuning (cost). */
const RINGS = 12, SIDES = 6, TUFTS = 4;

const SKIN = new THREE.Color('#2a1d30'), PALE = new THREE.Color('#ffffff'), GLOW = new THREE.Color('#2a0a30');
const NEEDLE = new THREE.Color('#58803c'), LEAF = new THREE.Color('#6e9a44');
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number): number => { const k = clamp01(x); return k * k * (3 - 2 * k); };
const ease = (cur: number, to: number, rate: number, dt: number): number => cur + (to - cur) * (1 - Math.exp(-rate * dt));

/** An arm's tube rebuilt in place from its control points each frame. */
class ArmTube {
  readonly mesh: THREE.Mesh; private readonly geo: THREE.BufferGeometry; private readonly curve = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
  private readonly p = new THREE.Vector3(); private readonly t = new THREE.Vector3(); private readonly n = new THREE.Vector3(); private readonly b = new THREE.Vector3(); private readonly up = new THREE.Vector3(0, 1, 0);
  constructor(mat: THREE.Material, private readonly r0: number) {
    this.geo = new THREE.BufferGeometry(); const pos = new Float32Array((RINGS + 1) * SIDES * 3), uv = new Float32Array((RINGS + 1) * SIDES * 2), idx: number[] = [];
    for (let i = 0; i <= RINGS; i++) for (let j = 0; j < SIDES; j++) { uv[(i * SIDES + j) * 2] = j / SIDES; uv[(i * SIDES + j) * 2 + 1] = i / RINGS * 3; }
    for (let i = 0; i < RINGS; i++) for (let j = 0; j < SIDES; j++) { const a = i * SIDES + j, b = i * SIDES + (j + 1) % SIDES, c = a + SIDES, d = b + SIDES; idx.push(a, c, b, b, c, d); }
    this.geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); this.geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); this.geo.setIndex(idx);
    this.mesh = new THREE.Mesh(this.geo, mat); this.mesh.frustumCulled = false; this.mesh.castShadow = true;
  }
  /** Lay the tube along these four points (local), thinning toward the tip. */
  set(pts: THREE.Vector3[]): void {
    this.curve.points.forEach((q, i) => q.copy(pts[i])); const pos = this.geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i <= RINGS; i++) {
      const u = i / RINGS; this.curve.getPoint(u, this.p); this.curve.getTangent(u, this.t);
      this.n.crossVectors(this.t, Math.abs(this.t.y) > 0.9 ? this.b.set(1, 0, 0) : this.up).normalize(); this.b.crossVectors(this.t, this.n);
      const r = this.r0 * (1 - u * 0.8);
      for (let j = 0; j < SIDES; j++) { const a = j / SIDES * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r; pos.setXYZ(i * SIDES + j, this.p.x + this.n.x * c + this.b.x * s, this.p.y + this.n.y * c + this.b.y * s, this.p.z + this.n.z * c + this.b.z * s); }
    }
    pos.needsUpdate = true; this.geo.computeVertexNormals(); this.geo.computeBoundingSphere();
  }
  /** A point along it (0 base, 1 tip). */
  at(u: number, out: THREE.Vector3): THREE.Vector3 { return this.curve.getPoint(u, out); }
}

/** What the scene tells the snatcher each frame. */
export interface SnatcherLook { x: number; y: number; z: number; heading: number; moving: boolean; taking: boolean; carrying: boolean; cover: 'tree' | 'bush' | null; hidden: boolean; size: number; /** Held by her roots. */ rooted?: boolean }
export interface SnatcherFigure { group: THREE.Group; update(s: SnatcherLook, t: number, dt: number): void; readonly disguise: number }

const bark = { tree: 'bark-pine', bush: 'bark-oak' } as const;
const v3 = (x: number, y: number, z: number): THREE.Vector3 => new THREE.Vector3(x, y, z);

export function createSnatcher(seed: number): SnatcherFigure {
  const rand = mulberry32(9001 + seed * 31), group = new THREE.Group(); group.name = 'snatcher';
  const skin = new THREE.MeshStandardMaterial({ color: SKIN.clone(), map: floorTexture(bark.tree), roughness: 0.42, emissive: GLOW.clone(), emissiveIntensity: 1 });
  const tuftMat = new THREE.MeshStandardMaterial({ color: NEEDLE.clone(), roughness: 0.95, flatShading: true });
  const body = new THREE.Mesh(mantleGeometry(), skin); body.castShadow = true; group.add(body);
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#d8ff60' }), eyes = [-1, 1].map(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), eyeMat); e.position.set(0.5, 0.1, s * 0.22); body.add(e); return e; });
  const arms = Array.from({ length: 8 }, (_, a) => { const t = new ArmTube(skin, a < 4 ? 0.045 : 0.05); group.add(t.mesh); return t; });
  const tuftGeo = new THREE.IcosahedronGeometry(0.22, 0), tufts = new THREE.InstancedMesh(tuftGeo, tuftMat, 8 * TUFTS); tufts.frustumCulled = false; tufts.castShadow = true; group.add(tufts);
  const bundle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshStandardMaterial({ color: '#efe6cc', emissive: '#3a3020', emissiveIntensity: 0.25, roughness: 0.9 })); bundle.scale.set(1.5, 0.8, 0.9); group.add(bundle);
  const phase = Array.from({ length: 8 }, () => rand() * 6.28), lean = Array.from({ length: 8 }, () => 0.8 + rand() * 0.4);
  let d = 0, reach = 0, gait = 0, kind: 'tree' | 'bush' = 'bush', eyeAt = EYE_EVERY * rand(), eyeOpen = 0;
  const kid: THREE.Vector3[][] = arms.map(() => [v3(0, 0, 0), v3(0, 0, 0), v3(0, 0, 0), v3(0, 0, 0)]), hide = kid.map(a => a.map(p => p.clone())), out = kid.map(a => a.map(p => p.clone()));
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), tp = new THREE.Vector3(), bodyHide = { y: 0, tilt: 0, sx: 1, sy: 1 };
  /** The kid's arms (folded as a goat: horn buds, ears, legs that gallop) and, unfolding at a door, the head's arms reaching in. */
  function kidPose(t: number, moving: boolean): void {
    const g = moving ? gait : 0, by = 0.36;
    for (let a = 0; a < 8; a++) {
      const s = a % 2 ? 1 : -1, P = kid[a];
      if (a < 2) { const r = reach; P[0].set(0.2, by + 0.08, s * 0.05); P[1].set(0.28 + r * 0.35, by + 0.2 - r * 0.1, s * (0.06 + r * 0.12)); P[2].set(0.22 + r * 0.7, by + 0.3 - r * 0.15, s * (0.09 + r * 0.2)); P[3].set(0.1 + r * 1.0 + Math.sin(t * 9 + a) * r * 0.1, by + 0.32 - r * 0.2, s * (0.12 + r * 0.25)); }
      else if (a < 4) { const r = reach; P[0].set(0.2, by + 0.05, s * 0.07); P[1].set(0.24 + r * 0.3, by + 0.1, s * (0.16 + r * 0.1)); P[2].set(0.2 + r * 0.6, by + 0.08, s * (0.24 + r * 0.2)); P[3].set(0.16 + r * 0.85 + Math.sin(t * 8 + a) * r * 0.12, by + 0.05, s * (0.27 + r * 0.3)); }
      else { const fore = a < 6, sw = Math.sin(g + (fore ? 0 : Math.PI) + (s > 0 ? 0.4 : 0)) * STRIDE, lift = Math.max(0, Math.cos(g + (fore ? 0 : Math.PI) + (s > 0 ? 0.4 : 0))) * 0.07, x0 = fore ? 0.14 : -0.2; P[0].set(x0, by - 0.02, s * 0.08); P[1].set(x0 + 0.02 + sw * 0.4, by - 0.16, s * 0.09); P[2].set(x0 + sw * 0.8, 0.12 + lift, s * 0.09); P[3].set(x0 + sw + 0.05, 0.02 + lift, s * 0.09); }
    }
  }
  /** The disguise's arms: a sapling (the hind arms braided down as its trunk, the rest its branches) or a shrub (all splayed up and out). */
  function hidePose(t: number, size: number): void {
    const wind = (a: number, k: number): number => Math.sin(t * 1.3 + phase[a] + k) * 0.05 * k;
    if (kind === 'tree') {
      const H = TREE_H * (0.85 + 0.15 * Math.min(2, size)); bodyHide.y = H * 0.55; bodyHide.tilt = Math.PI / 2; bodyHide.sx = 1.25; bodyHide.sy = 0.8;
      for (let a = 0; a < 8; a++) {
        const P = hide[a], ang = phase[a];
        if (a >= 4) { const c = Math.cos(ang), s = Math.sin(ang); P[0].set(c * 0.05, H * 0.5, s * 0.05); P[1].set(c * 0.04, H * 0.3, s * 0.04); P[2].set(c * 0.08, H * 0.1, s * 0.08); P[3].set(c * 0.28, 0.0, s * 0.28); }
        else { const c = Math.cos(ang + a * 1.57), s = Math.sin(ang + a * 1.57), r = 0.55 * lean[a]; P[0].set(0, H * 0.72, 0); P[1].set(c * r * 0.4, H * 0.85, s * r * 0.4); P[2].set(c * r * 0.8 + wind(a, 1), H * (0.92 + 0.06 * lean[a]), s * r * 0.8); P[3].set(c * r + wind(a, 2), H * (1.0 + 0.05 * lean[a]) - 0.08, s * r + wind(a, 1.5)); }
      }
    } else {
      bodyHide.y = 0.32; bodyHide.tilt = 0.15; bodyHide.sx = 0.75; bodyHide.sy = 1.35;
      for (let a = 0; a < 8; a++) { const P = hide[a], ang = a / 8 * Math.PI * 2 + phase[a] * 0.2, c = Math.cos(ang), s = Math.sin(ang), r = BUSH_R * lean[a]; P[0].set(c * 0.08, 0.3, s * 0.08); P[1].set(c * r * 0.45, BUSH_H * 0.55, s * r * 0.45); P[2].set(c * r * 0.8 + wind(a, 1), BUSH_H * (0.85 + 0.1 * lean[a]), s * r * 0.8); P[3].set(c * r + wind(a, 2), BUSH_H * (0.8 + 0.15 * lean[a]), s * r + wind(a, 1.5)); }
    }
  }
  // Her roots, when they hold it: three brown coils up out of the ground round its body, tightening as they rise.
  const rootMat = new THREE.MeshStandardMaterial({ color: '#6a4a2a', roughness: 0.9 }), coils = new THREE.Group(); coils.visible = false; group.add(coils);
  for (let i = 0; i < 3; i++) { const a0 = i / 3 * Math.PI * 2, pts: THREE.Vector3[] = []; for (let k = 0; k <= 8; k++) { const u = k / 8, a = a0 + u * Math.PI * 1.6, r = 0.32 - u * 0.12; pts.push(new THREE.Vector3(Math.cos(a) * r, u * 0.5, Math.sin(a) * r)); } const m = new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3(pts), 16, 5, t => 0.035 * (1 - t * 0.7), 0.01), rootMat); m.castShadow = true; coils.add(m); }
  let held = 0;
  const fig: SnatcherFigure = {
    group,
    get disguise() { return d; },
    update(s, t, dt) {
      if (s.cover && d < 0.02) { kind = s.cover; skin.map = floorTexture(bark[kind]); tuftMat.color.copy(kind === 'tree' ? NEEDLE : LEAF); skin.needsUpdate = true; }
      d = ease(d, s.hidden ? 1 : 0, s.hidden ? HIDE_RATE : BOLT_RATE, dt); reach = ease(reach, s.taking ? 1 : 0, 6, dt); if (s.moving) gait += GALLOP * dt;
      group.position.set(s.x, s.y, s.z); group.rotation.y = -s.heading;
      held = ease(held, s.rooted ? 1 : 0, s.rooted ? 10 : 4, dt); coils.visible = held > 0.02; coils.scale.set(1, held, 1); coils.rotation.y = t * 0.3;
      kidPose(t, s.moving && !s.rooted); hidePose(t, s.size);
      // Held, its arms thrash against the roots.
      if (held > 0.02) for (let a = 0; a < 8; a++) for (let k = 1; k < 4; k++) { const P = kid[a][k]; P.y += Math.sin(t * 23 + a * 1.7 + k) * 0.08 * k * held; P.x += Math.cos(t * 19 + a) * 0.05 * k * held; }
      // The arms open from the base outward: each control point takes the disguise a little after the one before it.
      for (let a = 0; a < 8; a++) for (let k = 0; k < 4; k++) { const w = smooth(d * 1.6 - k * 0.2); out[a][k].lerpVectors(kid[a][k], hide[a][k], w); }
      arms.forEach((arm, a) => arm.set(out[a]));
      // The mantle: a kid's body, lifted into the sapling's knot or squatted into the shrub's heart.
      const w = smooth(d), bob = s.moving && w < 0.5 ? Math.abs(Math.sin(gait)) * 0.05 : 0;
      body.position.set(0.02 * (1 - w), 0.36 + bob + (bodyHide.y - 0.36) * w, 0); body.rotation.set(0, 0, -0.05 + (bodyHide.tilt + 0.05) * w);
      body.scale.set(KID * (1 + (bodyHide.sx - 1) * w), KID * (1 + (bodyHide.sy - 1) * w), KID * (1 + (bodyHide.sx - 1) * 0.7 * w));
      // The skin takes the bark's colour and grain; the glow under it goes out.
      skin.color.copy(SKIN).lerp(PALE, w * 0.92); skin.emissive.copy(GLOW).multiplyScalar(1 - w);
      // The tufts sprout along the branches' outer halves.
      let i = 0; for (let a = 0; a < 8; a++) { const branch = kind === 'bush' || a < 4; for (let k = 0; k < TUFTS; k++, i++) { const g = branch ? smooth(d * 1.4 - 0.35 - k * 0.05) : 0; arms[a].at(Math.min(1, 0.42 + k * 0.19), tp); sc.setScalar(g * (kind === 'tree' ? 1.6 - k * 0.12 : 1.9 - k * 0.2) * (0.85 + 0.3 * lean[a])); q.setFromEuler(new THREE.Euler(phase[a] + k, phase[a] * 2, k)); m.compose(tp, q, sc); tufts.setMatrixAt(i, m); } }
      tufts.instanceMatrix.needsUpdate = true;
      // Hidden, the eyes close; now and then one opens.
      if (s.hidden && d > 0.8) { eyeAt -= dt; if (eyeAt <= 0) { eyeOpen = EYE_OPEN; eyeAt = EYE_EVERY * (0.6 + rand() * 0.8); } } eyeOpen = Math.max(0, eyeOpen - dt);
      const open = 1 - w + (eyeOpen > 0 ? 1 : 0); for (const e of eyes) e.scale.setScalar(Math.min(1, open));
      // The infant: under its belly as it runs, tucked into its heart when it hides.
      bundle.visible = s.carrying; bundle.position.set(-0.05 * (1 - w), 0.26 + (bodyHide.y - 0.26) * w * (kind === 'tree' ? 0.9 : 0.7), 0);
    },
  };
  group.userData.figure = fig; return fig;
}

/** What the scene tells a sac each frame: its gestation 0..1, her cut 0..1, whether another is being cut (it tightens), whether it has split (torn, the seconds since). */
export interface SacLook { stage: number; cut: number; tighten: boolean; torn: number }
export interface SacFigure { group: THREE.Group; update(s: SacLook, t: number): void }
const PINK = new THREE.Color('#c0507e'), BRUISE = new THREE.Color('#5c1f52'), BLACK = new THREE.Color('#1a0c1c'), CREAM = new THREE.Color('#efe6cc'), GREY = new THREE.Color('#3a3036');
const stalkMat = new THREE.MeshStandardMaterial({ color: '#0c060e', roughness: 0.35 });

export function createSac(i: number): SacFigure {
  const group = new THREE.Group(), r = mulberry32(4401 + i * 17), a = r() * Math.PI * 2, seed = r() * 6.28; group.name = 'sac';
  const foot = new THREE.Vector3(Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6), top = new THREE.Vector3(Math.cos(a) * 0.6, 4.2 + r() * 0.6, Math.sin(a) * 0.6), hang = new THREE.Vector3(0, 3.0, 0);
  group.add(new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3([foot, foot.clone().lerp(top, 0.5).add(new THREE.Vector3(0, 0.3, 0)), top, hang.clone().add(new THREE.Vector3(0, 0.6, 0)), hang]), 18, 6, t => 0.2 * (1 - t * 0.7), 0.04), stalkMat));
  const cyst = new THREE.Group(); cyst.position.copy(hang); group.add(cyst);
  const mat = new THREE.MeshStandardMaterial({ color: PINK.clone(), emissive: '#a01a6a', emissiveIntensity: 0.9, roughness: 0.25, transparent: true, opacity: 0.72, depthWrite: false, side: THREE.DoubleSide });
  // The skin as two halves, so a split can hang open.
  const halves = [0, Math.PI].map(phi => { const pivot = new THREE.Group(), h = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10, phi, Math.PI), mat); h.scale.set(1, 1.35, 1); h.position.y = -0.74; pivot.position.y = 0.04; pivot.add(h); cyst.add(pivot); return pivot; });
  const babeMat = new THREE.MeshStandardMaterial({ color: CREAM.clone(), emissive: '#3a3020', emissiveIntensity: 0.25, roughness: 0.9 });
  const babe = new THREE.Group(); babe.position.y = -0.75; babe.rotation.z = 1.2; cyst.add(babe);
  const bundle = new THREE.Mesh(new THREE.SphereGeometry(0.144, 10, 8), babeMat); bundle.scale.set(1.5, 0.8, 0.9); babe.add(bundle);
  const horns = [-1, 1].map(s => { const h = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.14, 6), babeMat); h.position.set(0.2, 0.08, s * 0.05); h.rotation.z = -0.7; babe.add(h); return h; });
  const slitMat = new THREE.MeshBasicMaterial({ color: '#0a0208', side: THREE.DoubleSide }), slit = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.8), slitMat); slit.position.set(0, -0.7, 0.56); cyst.add(slit);
  return {
    group,
    update(s, t) {
      const g = s.torn > 0 ? 1 : s.stage;
      mat.color.copy(PINK).lerp(BRUISE, smooth(g * 1.8)).lerp(BLACK, smooth(g * 2 - 1)); mat.emissiveIntensity = 0.9 * (1 - g * 0.7) + (s.cut > 0 ? 0.6 * Math.abs(Math.sin(t * 0.02)) : 0); mat.opacity = 0.72 + 0.2 * g;
      // The bundle lengthens and darkens and buds horns.
      bundle.scale.set(1.5 + g * 0.9, 0.8 + g * 0.15, 0.9); babeMat.color.copy(CREAM).lerp(GREY, smooth(g * 1.4)); for (const h of horns) { h.visible = g > 0.4; h.scale.setScalar(smooth((g - 0.4) / 0.6) + 0.01); }
      const grow = 1 + 0.35 * g, breathe = 1 + Math.sin(t * 0.0021 + seed) * 0.06 * (1 + g), tight = s.tighten ? 0.88 + 0.04 * Math.sin(t * 0.03 + seed) : 1;
      cyst.scale.set(grow * breathe * tight, grow * (2 - breathe) * tight, grow * breathe * tight);
      const shudder = s.cut > 0 ? Math.sin(t * 0.05 + seed) * 0.08 * (0.3 + s.cut) : 0;
      cyst.rotation.z = Math.sin(t * 0.0011 + seed) * 0.12 + shudder; cyst.rotation.x = Math.cos(t * 0.0009 + seed) * 0.1;
      slit.visible = s.cut > 0 && s.torn <= 0; slit.scale.set(1 + s.cut * 2.5, 0.2 + s.cut * 0.9, 1);
      // Torn: the halves hang open and empty, sagging.
      const open = s.torn > 0 ? smooth(s.torn / 1.5) : 0; halves[0].rotation.x = -open * 0.9; halves[1].rotation.x = open * 0.9; halves.forEach(h => (h.scale.y = 1 - open * 0.3));
      babe.visible = s.torn <= 0;
    },
  };
}

/** The snatchers' trail (Noah, 2026-10-23): at every hide a pool of its slime, wet and dark with a violet sheen, and a
 * skid smeared from it the way it went next, laid on the ground; the older, the smaller and fainter, gone in a day.
 * Sizes are for reading at walking distance on a phone. Tuning. */
const SLICK_R = 0.65, SKID_L = 2.4, SKID_W = 0.42;
export interface TrailLook { x: number; z: number; a: number; age: number; key: string }
export function createTrail(parent: THREE.Object3D, relief: (x: number, z: number) => number): { set(marks: TrailLook[]): void } {
  const group = new THREE.Group(); group.name = 'snatch-trail'; parent.add(group);
  const made = new Map<string, { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial }>();
  function build(m: TrailLook) {
    const r = mulberry32(Math.floor(m.x * 131 + m.z * 71) >>> 0), pos: number[] = [], idx: number[] = [], lift = 0.035;
    // The pool: a ragged disc, laid on the ground point by point.
    const N = 14; pos.push(m.x, relief(m.x, m.z) + lift, m.z);
    for (let i = 0; i < N; i++) { const t = i / N * Math.PI * 2, rr = SLICK_R * (0.7 + r() * 0.5), x = m.x + Math.cos(t) * rr, z = m.z + Math.sin(t) * rr; pos.push(x, relief(x, z) + lift, z); idx.push(0, 1 + i, 1 + (i + 1) % N); }
    // The skid: a strip smeared out from the pool's edge the way it went, tapering, wobbling a little.
    const base = pos.length / 3, S = 8, ca = Math.cos(m.a), sa = Math.sin(m.a);
    for (let k = 0; k <= S; k++) { const u = k / S, along = SLICK_R * 0.6 + u * SKID_L, w = SKID_W * (1 - u * 0.85) * 0.5, wob = Math.sin(u * 5 + r() * 2) * 0.06, cx = m.x + ca * along - sa * wob, cz = m.z + sa * along + ca * wob; for (const s of [-1, 1]) { const x = cx - sa * w * s, z = cz + ca * w * s; pos.push(x, relief(x, z) + lift, z); } if (k) { const a = base + (k - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: '#150b18', emissive: '#3a0f48', emissiveIntensity: 0.35, roughness: 0.08, metalness: 0.55, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 });
    const mesh = new THREE.Mesh(g, mat); mesh.renderOrder = 2; group.add(mesh); return { mesh, mat };
  }
  return {
    set(marks) {
      const seen = new Set<string>();
      for (const m of marks) { seen.add(m.key); let e = made.get(m.key); if (!e) { e = build(m); made.set(m.key, e); } const fresh = 1 - Math.min(1, m.age); e.mat.opacity = 0.25 + 0.65 * fresh; e.mat.emissiveIntensity = 0.1 + 0.35 * fresh; }
      for (const [k, e] of made) if (!seen.has(k)) { e.mesh.removeFromParent(); e.mesh.geometry.dispose(); e.mat.dispose(); made.delete(k); }
    },
  };
}
