// The hen-of-the-woods, refined (Noah, 2026-11-01; HEN_LAB_BRIEF.md and design/reference/hen-of-the-woods on docs/vision): a small pale
// creature wearing a gown of bracket-fungus tiers. Three parts, each posed by numbers so a choreographer (henGrove.ts) can drive it:
//  - the dress: stacked scalloped shelves banded cream to orange, few and small when lean (a miniskirt), many and round when fat (a
//    ballgown); hoisted at the back to show a bare bottom, bunched behind the neck when sitting, fallen flat and splayed on the ground
//    when the hen is flipped and harvested;
//  - the core: the upper torso and two eyestalks with glossy black eyes, which retract and resprout;
//  - the meat piece: the legs, the bottom and a stem topped with a soft cap socketed into the chest (a king oyster mushroom with a butt
//    and legs), long and thin when lean, short and fat when fat; it pulls out whole and is made separately for the hunter to carry.
// No arms, no face, no beak. Cel look as the Eden's figures: flat shading and a black back-face hull. Faces -z at heading 0.
import * as THREE from 'three';
import { mulberry32 } from './colors';

/** Tiers in the fullest gown. */
export const MAX_TIERS = 9;
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const SKIN = '#f1e8d2', HULL = '#22140a';

/** The heights that follow from fatness (m): the hip (the legs' length), the torso, the neck. Lean: long thin legs; fat: short fat ones. */
export function henFrame(f: number): { hip: number; torso: number; neck: number } {
  const hip = lerp(0.3, 0.11, f), torso = lerp(0.11, 0.24, f);
  return { hip, torso, neck: hip + torso };
}

/** One shelf at unit radius: a thick drooping ring, its outer edge scalloped and ruffled, its top banded from a cream inner to an orange rim with a cream lip (the chicken-of-the-woods' and turkey-tail's bands), its underside pale pores. Closed, so the hull reads. */
function shelfGeometry(seed: number): THREE.BufferGeometry {
  const r = mulberry32(seed), S = 30, R = 5, lobes = 5 + Math.floor(r() * 3), ph = r() * 6.28, droop = 0.34, thick = 0.09, inner = 0.22;
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const bands = ['#f4e2aa', '#f2c060', '#ec9a38', '#e27424', '#f3cf7a'].map(c => new THREE.Color(c)), under = new THREE.Color('#f6ebc8');
  const band = (t: number): THREE.Color => { const x = t * (bands.length - 1), i = Math.min(bands.length - 2, Math.floor(x)); return bands[i].clone().lerp(bands[i + 1], x - i); };
  const outer = (a: number): number => 1 + 0.13 * Math.sin(lobes * a + ph) + 0.04 * Math.sin(lobes * 3 * a + ph * 2);
  // top grid then bottom grid, (R+1)*(S+1) each
  for (const side of [0, 1]) for (let j = 0; j <= R; j++) for (let i = 0; i <= S; i++) {
    const a = i / S * Math.PI * 2, t = j / R, rad = lerp(inner, outer(a), t), y = -droop * Math.pow(t, 1.6) - (side ? thick * (1 - 0.7 * t) : 0) + 0.015 * Math.sin(lobes * 3 * a) * t;
    pos.push(Math.cos(a) * rad, y, Math.sin(a) * rad); const c = side ? under : band(t); col.push(c.r, c.g, c.b);
  }
  const at = (side: number, j: number, i: number): number => side * (R + 1) * (S + 1) + j * (S + 1) + i;
  for (let j = 0; j < R; j++) for (let i = 0; i < S; i++) {
    const a = at(0, j, i), b = at(0, j + 1, i), c = at(0, j + 1, i + 1), d = at(0, j, i + 1); idx.push(a, c, b, a, d, c);
    const e = at(1, j, i), f = at(1, j + 1, i), g = at(1, j + 1, i + 1), h = at(1, j, i + 1); idx.push(e, f, g, e, g, h);
  }
  // the outer rim and the inner rim, joining top and bottom
  for (let i = 0; i < S; i++) { const a = at(0, R, i), b = at(0, R, i + 1), c = at(1, R, i + 1), d = at(1, R, i); idx.push(a, b, c, a, c, d); const e = at(0, 0, i), f = at(0, 0, i + 1), g = at(1, 0, i + 1), h = at(1, 0, i); idx.push(e, g, f, e, h, g); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}

export interface DressPose { /** Fatness 0..1: how many tiers and how round. */ f: number; /** 0..1: the back lifted (the hoist), as it backs onto a cushion; 0.45 bunched behind the neck sitting. */ hoist: number; /** 0..1: fallen flat and splayed on the ground. */ fall: number; /** 0..1: the shed dress withering (darkening, shrinking, sinking into the soil). */ wilt: number; /** The walk's sway (radians) and phase, the tiers bouncing. */ sway: number; bounce: number; night: number }
export interface Dress { group: THREE.Group; /** The tiers' frame (the hip, the neck) in the dress's own space: attached it hangs from the neck at the origin; flat it lies on the ground at the origin. */ set(p: DressPose): void; dispose(): void }

/** The gown: MAX_TIERS shelves laid out each frame by fatness, hoist and fall. Attached, its origin is the neck; fallen, the ground at the hen's centre. */
export function createDress(seed = 1, tint = '#ffffff'): Dress {
  const group = new THREE.Group(), r = mulberry32(seed * 977 + 3);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, color: tint, roughness: 0.9, flatShading: true, emissive: '#f08020', emissiveIntensity: 0, transparent: false });
  const hull = new THREE.MeshBasicMaterial({ color: HULL, side: THREE.BackSide });
  const geoms: THREE.BufferGeometry[] = [];
  const tiers = Array.from({ length: MAX_TIERS }, (_, i) => {
    const g = shelfGeometry(seed * 31 + i * 7); geoms.push(g);
    const m = new THREE.Mesh(g, mat), h = new THREE.Mesh(g, hull); h.scale.setScalar(1.07); h.position.y = 0.004; h.renderOrder = -1; m.add(h); group.add(m);
    return { m, yaw: r() * 6.28, jitter: 0.92 + r() * 0.16, tilt: (r() - 0.5) * 0.12 };
  });
  const wiltTo = new THREE.Color('#5a4030'), base = new THREE.Color(tint);
  function set(p: DressPose): void {
    const f = clamp01(p.f), fr = henFrame(f), nF = 2.6 + 6.4 * f, n = Math.ceil(nF);
    // Attached: from a little under the hip up to the neck (the origin), widest low down when fat.
    const lower = (fr.hip - 0.02 - 0.05 * f) - fr.neck, upper = 0.022;
    mat.color.copy(base).lerp(wiltTo, p.wilt); mat.emissiveIntensity = 0.55 * p.night * (1 - p.wilt);
    for (let i = 0; i < MAX_TIERS; i++) {
      const t = tiers[i], grow = clamp01(nF - i); if (i >= n || grow <= 0.01) { t.m.visible = false; continue; } t.m.visible = true;
      // u: 0 the lowest tier, 1 the top one, over the tiers present.
      const u = n <= 1 ? 1 : i / (n - 1), y = lerp(lower, upper, u);
      const rLean = 0.065 + 0.035 * (1 - u), rFat = 0.31 * Math.sqrt(Math.max(0.12, 1 - Math.pow((u - 0.3) / 0.85, 2)));
      let rad = lerp(rLean, rFat, f) * t.jitter * grow;
      // Fallen: every tier on the ground, the largest underneath, splayed wider, flattened; withering, the lower ones shrink and sink.
      const fy = 0.006 + i * 0.011, fRad = (0.12 + 0.3 * (1 - u)) * lerp(0.6, 1, f) * t.jitter * grow, wilt = p.wilt * (1 - 0.6 * u);
      rad = lerp(rad, fRad, p.fall) * (1 - 0.45 * wilt);
      const sx = rad, sy = rad * lerp(1, 0.28, p.fall);
      t.m.scale.set(sx, sy, sx);
      t.m.position.set(Math.sin(p.sway + i) * 0.004 * (1 - p.fall), lerp(y + Math.sin(p.bounce + i * 0.7) * 0.006, fy - 0.04 * wilt, p.fall), lerp(0.012 * u, 0, p.fall));
      t.m.rotation.set(lerp(t.tilt - 0.12 * u, 0, p.fall), t.yaw, lerp(Math.sin(p.sway) * 0.15 * (1 - u), 0, p.fall));
    }
  }
  function dispose(): void { for (const g of geoms) g.dispose(); mat.dispose(); hull.dispose(); }
  return { group, set, dispose };
}

export interface MeatPose { f: number; /** Walk phase and how much it walks. */ phase: number; walk: number; /** 0..1 legs tucked (sitting). */ tuck: number; /** 0..1 legs kicking in the air (flipped); its own clock. */ kick: number; /** 0..1 floppy, dangling (carried). */ flop: number; /** 0..1 a braced, straining stance. */ brace: number; clock: number; /** 0..1 the legs grown (regrowing, new). */ grow: number; /** 0..1 how cooked (browning). */ cooked: number }
export interface Meat { group: THREE.Group; set(p: MeatPose): void; dispose(): void }

/** The meat piece: legs, a bare cartoon bottom, a pale stem up into the chest and a soft colourful cap at its top. Its origin is the hip. */
export function createMeat(_seed = 1): Meat {
  const group = new THREE.Group(), geoms: THREE.BufferGeometry[] = [];
  const skin = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.8, flatShading: true }), capMat = new THREE.MeshStandardMaterial({ color: '#d0743a', roughness: 0.7, flatShading: true });
  const hull = new THREE.MeshBasicMaterial({ color: HULL, side: THREE.BackSide });
  const keep = <T extends THREE.BufferGeometry>(g: T): T => { geoms.push(g); return g; };
  const withHull = (m: THREE.Mesh, k = 1.12): THREE.Mesh => { const h = new THREE.Mesh(m.geometry, hull); h.scale.setScalar(k); h.renderOrder = -1; m.add(h); return m; };
  const cap = keep(new THREE.CapsuleGeometry(0.5, 1, 4, 10)), ball = keep(new THREE.SphereGeometry(1, 12, 10));
  // The stem and its cap (a dome with a rolled rim).
  const stem = withHull(new THREE.Mesh(cap, skin), 1.1); group.add(stem);
  const capTop = withHull(new THREE.Mesh(keep(new THREE.SphereGeometry(1, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.6)), capMat), 1.08); group.add(capTop);
  // The bottom: two cheeks behind.
  const cheeks = [-1, 1].map(s => { const c = withHull(new THREE.Mesh(ball, skin), 1.08); group.add(c); return { c, s }; });
  // The legs: a thigh from the hip, a shin from the knee, a foot.
  const legs = [-1, 1].map(s => {
    const hip = new THREE.Group(), thigh = withHull(new THREE.Mesh(cap, skin)), knee = new THREE.Group(), shin = withHull(new THREE.Mesh(cap, skin)), foot = withHull(new THREE.Mesh(ball, skin), 1.1);
    hip.add(thigh, knee); knee.add(shin, foot); group.add(hip); return { s, hip, thigh, knee, shin, foot };
  });
  const raw = new THREE.Color(SKIN), done = new THREE.Color('#a8682e'), capRaw = new THREE.Color('#d0743a'), capDone = new THREE.Color('#6e3a18');
  function set(p: MeatPose): void {
    const f = clamp01(p.f), fr = henFrame(f), g = clamp01(p.grow);
    skin.color.copy(raw).lerp(done, p.cooked); capMat.color.copy(capRaw).lerp(capDone, p.cooked);
    const stemR = lerp(0.026, 0.065, f), stemL = fr.torso * 0.62;
    stem.scale.set(stemR * 2, stemL / 2, stemR * 2); stem.position.set(0, stemL / 2 + 0.01, 0);
    const capR = lerp(0.034, 0.08, f); capTop.scale.set(capR, capR * 0.75, capR); capTop.position.set(0, stemL + 0.005, 0);
    const cr = lerp(0.03, 0.075, f);
    for (const { c, s } of cheeks) { c.scale.setScalar(cr * g); c.position.set(s * cr * 0.62, -cr * 0.25, cr * 0.55); }
    const L = fr.hip * g, half = L / 2, legR = lerp(0.013, 0.05, f) * Math.max(0.3, g), spread = lerp(0.028, 0.06, f);
    for (const l of legs) {
      l.hip.position.set(l.s * spread, -cr * 0.2, 0);
      l.thigh.scale.set(legR * 2, Math.max(0.001, half) / 2, legR * 2); l.thigh.position.y = -half / 2;
      l.knee.position.y = -half;
      l.shin.scale.set(legR * 1.8, Math.max(0.001, half) / 2, legR * 1.8); l.shin.position.y = -half / 2;
      const fl = lerp(0.03, 0.065, f) * Math.max(0.4, g); l.foot.scale.set(fl * 0.75, fl * 0.38, fl * 1.25); l.foot.position.set(0, -half, -fl * 0.45);
      // The walk, the tuck, the kick, the flop, the brace, blended.
      const ph = p.phase + (l.s > 0 ? Math.PI : 0), sw = Math.sin(ph);
      let th = sw * 0.55 * p.walk, sh = -Math.max(0, Math.cos(ph)) * 0.8 * p.walk;
      th = lerp(th, 1.25, p.tuck); sh = lerp(sh, -2.3, p.tuck);
      const kk = Math.sin(p.clock * 14 + (l.s > 0 ? 0 : 1.7)); th = lerp(th, 0.5 * kk, p.kick); sh = lerp(sh, -0.9 - 0.7 * Math.sin(p.clock * 14 + (l.s > 0 ? 1 : 2.6)), p.kick);
      const fp = Math.sin(p.clock * 6 + l.s); th = lerp(th, 0.25 * fp, p.flop); sh = lerp(sh, -0.3 - 0.25 * fp, p.flop);
      th = lerp(th, l.s > 0 ? -0.5 : 0.35, p.brace); sh = lerp(sh, l.s > 0 ? -0.2 : -0.6, p.brace);
      l.hip.rotation.set(th, 0, l.s * 0.05 * (1 - p.tuck)); l.knee.rotation.x = sh;
    }
  }
  function dispose(): void { for (const g of geoms) g.dispose(); skin.dispose(); capMat.dispose(); hull.dispose(); }
  return { group, set, dispose };
}

export interface HenPose {
  f: number; /** Walking speed (m/s); 0 still. */ speed: number; hoist: number; /** 0..1 sat down on a seat `seat` m high, legs tucked. */ sit: number; seat: number;
  /** 0..1 leaning forward and braced, straining to pull free. */ strain: number; /** 0..1 flipped onto its head. */ invert: number; /** 0..1 the dress fallen flat. */ fall: number;
  /** 0..1 the meat piece drawn out of the chest (toward its feet). */ pull: number; meat: boolean; /** 0..1 the meat's legs grown (the regrowth). */ legs: number;
  /** 0..1 the eyestalks out. */ eyes: number; /** 0..1 sunk so its neck is at the ground (hidden under a flat dress). */ sunk: number; /** Extra lift (m): a spring, a hop. */ lift: number; night: number;
}
export interface HenFigure { group: THREE.Group; dress: Dress; meat: Meat; /** The meat's world matrix (for a hunter taking it). */ meatAnchor: THREE.Object3D; update(x: number, y: number, z: number, heading: number, p: HenPose, dt: number): void; dispose(): void }

export function createHen(seed = 1, tint = '#ffffff'): HenFigure {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
  const geoms: THREE.BufferGeometry[] = [];
  const skin = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.8, flatShading: true }), stalkMat = new THREE.MeshStandardMaterial({ color: '#e6d9a8', roughness: 0.8, flatShading: true });
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#0c0806', roughness: 0.15, metalness: 0.1 }), shine = new THREE.MeshBasicMaterial({ color: '#ffffff' }), hull = new THREE.MeshBasicMaterial({ color: HULL, side: THREE.BackSide });
  const keep = <T extends THREE.BufferGeometry>(g: T): T => { geoms.push(g); return g; };
  // The core: the upper torso, pale, mostly inside the gown.
  const torso = new THREE.Mesh(keep(new THREE.SphereGeometry(1, 14, 10)), skin); body.add(torso);
  const neck = new THREE.Group(); body.add(neck);
  // The eyestalks: thin curves up and forward from the top, a glossy black eye with a glint at each tip.
  const stalkCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.07, -0.005), new THREE.Vector3(0, 0.13, -0.035), new THREE.Vector3(0, 0.15, -0.075)]);
  const stalkGeo = keep(new THREE.TubeGeometry(stalkCurve, 10, 0.009, 6)), eyeGeo = keep(new THREE.SphereGeometry(0.024, 12, 10)), glintGeo = keep(new THREE.SphereGeometry(0.006, 6, 5));
  const stalks = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * 0.022, -0.01, 0); g.rotation.z = -s * 0.32; neck.add(g);
    const st = new THREE.Mesh(stalkGeo, stalkMat), sh = new THREE.Mesh(stalkGeo, hull); sh.scale.setScalar(1.25); sh.renderOrder = -1; g.add(st, sh);
    const eye = new THREE.Mesh(eyeGeo, eyeMat); eye.position.copy(stalkCurve.getPoint(1)).add(new THREE.Vector3(0, 0.004, -0.012)); const eh = new THREE.Mesh(eyeGeo, hull); eh.scale.setScalar(1.18); eh.renderOrder = -1; eye.add(eh);
    const gl = new THREE.Mesh(glintGeo, shine); gl.position.set(s * 0.008, 0.01, -0.019); eye.add(gl); g.add(eye); return { g, s };
  });
  // The dress: attached it hangs from the neck; the holder carries it so it can fall to the ground when the hen is flipped.
  const dress = createDress(seed, tint), holder = new THREE.Group(); group.add(holder); holder.add(dress.group);
  const meat = createMeat(seed), meatHolder = new THREE.Group(); body.add(meatHolder); meatHolder.add(meat.group);
  const meatAnchor = new THREE.Object3D(); meat.group.add(meatAnchor);
  let phase = 0, clock = 0, swayLag = 0;
  const attach = new THREE.Matrix4(), pA = new THREE.Vector3(), qA = new THREE.Quaternion(), sA = new THREE.Vector3(), qFlat = new THREE.Quaternion(), hoistM = new THREE.Matrix4();
  function update(x: number, y: number, z: number, heading: number, p: HenPose, dt: number): void {
    clock += dt; group.position.set(x, y, z); group.rotation.y = heading;
    const f = clamp01(p.f), fr = henFrame(f), walk = Math.min(1, p.speed / 0.25);
    if (walk > 0) phase += dt * lerp(10, 7, f) * Math.max(0.6, walk); else phase += dt * 1.2;
    // The waddle: fatter, slower and rocking wider.
    const waddle = lerp(0.07, 0.17, f) * walk, sway = Math.sin(phase) * waddle;
    swayLag += (sway - swayLag) * Math.min(1, dt * 5);
    const seatDrop = Math.max(0, fr.hip - p.seat - 0.02) * p.sit;
    const flipY = fr.neck * p.invert + Math.sin(Math.PI * p.invert) * 0.22, sinkY = -(fr.neck - 0.01) * p.sunk;
    body.position.set(0, lerp(-seatDrop + Math.abs(Math.sin(phase)) * 0.018 * walk + p.lift, flipY, p.invert) + sinkY, Math.sin(Math.PI * p.invert) * 0.06);
    body.rotation.set(-0.38 * p.strain + Math.sin(clock * 18) * 0.03 * p.strain + Math.PI * p.invert, 0, sway * (1 - p.invert));
    // The core.
    const tr = lerp(0.04, 0.11, f); torso.scale.set(tr, fr.torso * 0.5, tr * 0.92); torso.position.set(0, fr.hip + fr.torso * 0.48, 0);
    neck.position.set(0, fr.neck - 0.005, -tr * 0.15);
    const e = clamp01(p.eyes);
    for (const s of stalks) { s.g.visible = e > 0.02; s.g.scale.setScalar(Math.max(0.02, e)); s.g.rotation.x = (sway - swayLag) * 2.2 + Math.sin(clock * 2.1 + s.s) * 0.06 + 0.4 * p.strain - 0.25 * p.sit + Math.sin(clock * 3) * 0.12 * p.sit; s.g.rotation.z = -s.s * (0.32 + 0.1 * Math.sin(clock * 1.3 + s.s)) - (sway - swayLag) * 1.5; }
    // The meat: socketed at the hip, drawn out toward its feet (up, when flipped).
    meatHolder.visible = p.meat; meatHolder.position.set(0, fr.hip - p.pull * (fr.torso * 0.95 + 0.05), 0); meatHolder.scale.set(1, 1 + 0.25 * Math.sin(Math.PI * clamp01(p.pull * 1.1)), 1);
    meat.set({ f, phase, walk, tuck: p.sit, kick: p.invert > 0.7 && p.pull < 0.95 ? 1 : 0, flop: 0, brace: p.strain, clock, grow: p.legs, cooked: 0 });
    // The dress: attached at the neck (hoisted at the back by turning about the neck), or fallen flat on the ground at the centre.
    body.updateMatrix(); attach.copy(body.matrix).multiply(new THREE.Matrix4().makeTranslation(0, fr.neck, 0)).multiply(hoistM.makeRotationX(-0.8 * p.hoist));
    attach.decompose(pA, qA, sA);
    holder.position.set(lerp(pA.x, 0, p.fall), lerp(pA.y, 0, p.fall), lerp(pA.z, 0, p.fall)); holder.quaternion.copy(qA).slerp(qFlat, p.fall);
    // Flat, the dress's tiers are laid out from the ground; attached, from the neck: the dress sets them in its own frame, so the holder is at the ground when fallen.
    dress.set({ f, hoist: p.hoist, fall: p.fall, wilt: 0, sway, bounce: phase * 2, night: p.night });
  }
  function dispose(): void { dress.dispose(); meat.dispose(); for (const g of geoms) g.dispose(); skin.dispose(); stalkMat.dispose(); eyeMat.dispose(); shine.dispose(); hull.dispose(); }
  return { group, dress, meat, meatAnchor, update, dispose };
}
