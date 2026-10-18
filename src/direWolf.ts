// The dire wolf (Noah, 2026-10-18): not an octopus folded into a wolf, as the Dark Young are into a goat,
// but a real wolf the mother has got into. It is carrying one of her young: starved to the bone because
// it no longer feeds itself, its belly swollen with what it carries and moving out of time with its
// breath. The rule (DARK_YOUNG.md's companion): the octopus shows only where the wolf is breached:
// at the mouth, the eyes, the hackles, the wounds. Everywhere else it is fur, bone and teeth.
//
// From afar the sign is its movement: the black pack moves as one will, heads snapping round together,
// the trot stalling and lurching on the same beat; now and then a leg bends where there is no joint or
// the head turns farther than a neck can. Up close the horror deepens: the ribs and the hips, the
// hackles that are not fur but filaments drifting as if under water, the mother's lime eyes with a
// goat's bar pupil, black gums and too many teeth, and when it bites the jaw opens too far and a beak
// and a knot of small arms push out of its throat. Dead it falls as a wolf; then the belly sags, and
// the thing it carried drags itself out of the mouth, crawls a little way, and dissolves.
//
// Built of rigid parts (torso, legs, head, jaw) placed each frame, and thin tubes rebuilt on the CPU
// (the hackles, the tail, the arms in the throat, the crawler's arms). Tuning constants at the top.
import * as THREE from 'three';

/** The figure's size against the grey wolves (wolfFigure.ts). Tuning. */
export const DIRE_SCALE = 0.85;
/** How far the trunk sits below the first cut (m): the legs a little too long for a wolf, not a horse's. Tuning. */
const DROP = 0.13;
/** The trot's stride (m) and how long the hive's stall lasts in each stutter period (s). Tuning. */
const STRIDE = 0.78, STALL_S = 0.16, STUTTER_PERIOD = 1.3;
/** The hive's head snaps: every HIVE_PERIOD s all dire wolves look the same way at once; one period in OWL_EVERY the look is a turn past what a neck can do. Tuning. */
const HIVE_PERIOD = 3.6, OWL_EVERY = 5;
/** A wolf's own glitches (a leg bending where there is no joint, the neck stretching, the head wrenching round): one every GLITCH_S[0]..GLITCH_S[1] s, lasting GLITCH_LEN s. Tuning. */
const GLITCH_S = [2.5, 6], GLITCH_LEN = 0.4;
/** The bite's length (s) and how far the arms in the throat reach out of the mouth at its height (m). Tuning. */
const BITE_S = 0.5, THROAT_REACH = 0.32;
/** The death: the fall, the belly sagging, the young crawling out, crawling away, dissolving (s since death). Tuning. */
const DEATH = { fall: 0.45, sag: [0.8, 1.8], out: [1.5, 2.3], crawl: [2.3, 4.6], melt: [4.2, 6.0], sink: 7 };

export interface DireState { moving: boolean; tell: number; rooted: number; dead: number; asleep?: boolean }
export interface DireWolf {
  group: THREE.Group;
  /** The fur's material (its emissive is the hurt flash's to set). */
  hide: THREE.MeshStandardMaterial;
  /** Step it: where it stands (for the trot's pace), its state, the step (s) and the shared clock (s) that keeps the pack in time. */
  update(x: number, z: number, s: DireState, dt: number, now: number): void;
  /** It bites now (the model's lunge). */
  bite(): void;
  /** A blow lands: it jerks, and its hackles bristle. */
  flinch(power: number): void;
}

const v3 = (x = 0, y = 0, z = 0): THREE.Vector3 => new THREE.Vector3(x, y, z);
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number): number => { const k = clamp01(x); return k * k * (3 - 2 * k); };
const span = (t: number, a: number, b: number): number => clamp01((t - a) / (b - a));
const ease = (cur: number, to: number, rate: number, dt: number): number => cur + (to - cur) * (1 - Math.exp(-rate * dt));
/** A hash of an integer into 0..1, the same for every wolf: what makes the pack one will. */
const hash = (n: number): number => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/** Thin tubes rebuilt each frame: `set` a tube from a centre line and a radius along it; hidden tubes collapse to a point. */
class Tubes {
  readonly mesh: THREE.Mesh; private pos: Float32Array; private nor: Float32Array; private c: THREE.Vector3[]; private t: THREE.Vector3[];
  private n = v3(); private b = v3();
  constructor(readonly count: number, readonly rings: number, readonly sides: number, mat: THREE.Material) {
    const per = rings * (sides + 1), pos = new Float32Array(count * per * 3), nor = new Float32Array(count * per * 3), idx: number[] = [];
    for (let i = 0; i < count; i++) for (let r = 0; r < rings - 1; r++) for (let j = 0; j < sides; j++) { const a = i * per + r * (sides + 1) + j, b = a + sides + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage)); g.setIndex(idx);
    g.boundingSphere = new THREE.Sphere(v3(0, 0.6, 0), 2.5);
    this.mesh = new THREE.Mesh(g, mat); this.pos = pos; this.nor = nor; this.c = Array.from({ length: rings }, () => v3()); this.t = Array.from({ length: rings }, () => v3());
  }
  set(i: number, centre: (u: number, out: THREE.Vector3) => void, radius: (u: number) => number): void {
    const R = this.rings, S = this.sides, per = R * (S + 1), c = this.c, t = this.t;
    for (let r = 0; r < R; r++) centre(r / (R - 1), c[r]);
    for (let r = 0; r < R; r++) { t[r].subVectors(c[Math.min(R - 1, r + 1)], c[Math.max(0, r - 1)]); if (t[r].lengthSq() < 1e-10) t[r].set(0, 1, 0); t[r].normalize(); }
    const n = this.n; n.set(0, 1, 0); if (Math.abs(t[0].y) > 0.9) n.set(1, 0, 0); n.addScaledVector(t[0], -n.dot(t[0])).normalize();
    for (let r = 0; r < R; r++) {
      if (r > 0) { n.addScaledVector(t[r], -n.dot(t[r])); const l = n.length(); if (l > 1e-5) n.multiplyScalar(1 / l); }
      this.b.crossVectors(t[r], n); const rad = radius(r / (R - 1));
      for (let j = 0; j <= S; j++) {
        const th = (j / S) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th), v = (i * per + r * (S + 1) + j) * 3;
        const nx = n.x * cs + this.b.x * sn, ny = n.y * cs + this.b.y * sn, nz = n.z * cs + this.b.z * sn;
        this.pos[v] = c[r].x + nx * rad; this.pos[v + 1] = c[r].y + ny * rad; this.pos[v + 2] = c[r].z + nz * rad; this.nor[v] = nx; this.nor[v + 1] = ny; this.nor[v + 2] = nz;
      }
    }
  }
  hide(i: number): void { const per = this.rings * (this.sides + 1); this.pos.fill(0, i * per * 3, (i + 1) * per * 3); }
  commit(): void { this.mesh.geometry.attributes.position.needsUpdate = true; this.mesh.geometry.attributes.normal.needsUpdate = true; }
}

/** The torso: lofted along the spine, a deep chest of ribs that stand out of the flank, a waist pinched to nothing, the hips and spine knobbed. Its own frame: x forward, y up, the ground at 0. */
// Stations along the spine: x, centre height, half height, half width.
const ST = [[-0.62, 0.77, 0.05, 0.05], [-0.55, 0.78, 0.12, 0.1], [-0.44, 0.79, 0.14, 0.12], [-0.28, 0.8, 0.1, 0.08], [-0.12, 0.81, 0.1, 0.08], [0.05, 0.8, 0.19, 0.12], [0.24, 0.79, 0.23, 0.13], [0.4, 0.82, 0.19, 0.12], [0.52, 0.88, 0.12, 0.09], [0.58, 0.92, 0.06, 0.06]];
const station = (u: number): number[] => { const f = clamp01(u) * (ST.length - 1), i = Math.min(ST.length - 2, Math.floor(f)), k = smooth(f - i); return ST[i].map((v, j) => v + (ST[i + 1][j] - v) * k); };
/** The top of the back at x (body frame), for the hackles' roots. */
const spineTop = (x: number): number => { let lo = 0, hi = 1; for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (station(m)[0] < x) lo = m; else hi = m; } const [, cy, hh] = station(lo); return cy + hh; };
function torsoGeometry(): THREE.BufferGeometry {
  const RINGS = 46, SIDES = 16, pos: number[] = [], idx: number[] = [];
  const at = station;
  for (let r = 0; r < RINGS; r++) {
    const [x, cy, hh, hw] = at(r / (RINGS - 1));
    for (let j = 0; j <= SIDES; j++) {
      const th = (j / SIDES) * Math.PI * 2, s = Math.sin(th), c = Math.cos(th); // c: up, s: side
      let rr = 1;
      // Ribs: ridges on the flank between the waist and the shoulder; the spine's knobs along the top; the hip bones.
      if (x > -0.08 && x < 0.38 && Math.abs(s) > 0.45 && c > -0.6) rr += 0.24 * Math.pow(Math.max(0, Math.sin((x + 0.08) * 48)), 4) * Math.abs(s);
      if (c > 0.85) rr += 0.12 * Math.pow(Math.max(0, Math.sin(x * 70)), 8);
      if (x > -0.56 && x < -0.38 && c > 0.3 && Math.abs(s) > 0.5) rr += 0.22 * Math.exp(-((x + 0.47) ** 2) / 0.002);
      // The flank falls in under the ribs: a starved animal's hollow.
      if (x > -0.36 && x < -0.02 && Math.abs(s) > 0.6) rr -= 0.12;
      pos.push(x, cy + c * hh * rr, s * hw * rr);
      if (r < RINGS - 1 && j < SIDES) { const a = r * (SIDES + 1) + j, b = a + SIDES + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}

/** Clumps of wet fur hanging in points from the chest, the throat and the belly's edge. */
function clumpsGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []; let s = 7; const rand = (): number => (s = (s * 16807) % 2147483647) / 2147483647;
  const add = (x: number, y: number, z: number, len: number, tilt: number): void => { const g = new THREE.ConeGeometry(0.018 + rand() * 0.012, len, 4); g.rotateZ(Math.PI + tilt); g.translate(x, y - len / 2, z); parts.push(g); };
  for (let i = 0; i < 14; i++) add(0.05 + rand() * 0.35, 0.6 + rand() * 0.04, (rand() - 0.5) * 0.18, 0.06 + rand() * 0.07, (rand() - 0.5) * 0.4);
  for (let i = 0; i < 6; i++) add(-0.5 + rand() * 0.12, 0.7, (rand() - 0.5) * 0.16, 0.05 + rand() * 0.05, 0.3);
  const flat = parts.map(g => g.toNonIndexed()), n = flat.reduce((m, g) => m + g.attributes.position.count, 0), pos = new Float32Array(n * 3), idx: number[] = []; let o = 0;
  for (const ng of flat) { pos.set(ng.attributes.position.array as Float32Array, o * 3); for (let k = 0; k < ng.attributes.position.count; k++) idx.push(o + k); o += ng.attributes.position.count; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}

export function createDireWolf(seed = 1): DireWolf {
  let rs = ((seed * 9301 + 49297) % 233280 + 233280) % 233280; const rand = (): number => (rs = (rs * 9301 + 49297) % 233280) / 233280;
  const group = new THREE.Group(); group.name = 'dire-wolf';
  const hide = new THREE.MeshStandardMaterial({ color: '#38323a', roughness: 0.5, metalness: 0.05, emissive: '#000000', flatShading: false });
  const skin = new THREE.MeshStandardMaterial({ color: '#5a4652', roughness: 0.42, emissive: '#000000' });
  const gum = new THREE.MeshStandardMaterial({ color: '#0b0507', roughness: 0.3 }), maw = new THREE.MeshStandardMaterial({ color: '#3a0910', roughness: 0.4, emissive: '#1a0206' });
  const tooth = new THREE.MeshStandardMaterial({ color: '#d6caa4', roughness: 0.4 }), beakMat = new THREE.MeshStandardMaterial({ color: '#0a0806', roughness: 0.15, metalness: 0.2 });
  const armMat = new THREE.MeshStandardMaterial({ color: '#3b2838', roughness: 0.3, emissive: '#000000' });
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#b6d42a' }), pupilMat = new THREE.MeshBasicMaterial({ color: '#030203' });
  const ichor = new THREE.MeshBasicMaterial({ color: '#4f8a1e', transparent: true, opacity: 0.7, depthWrite: false });

  // The rig: `body` carries the torso, the legs' roots, the neck and the head; it crouches, lurches and falls. `ground` holds what lies on the earth (the crawler, the stain).
  const body = new THREE.Group(); group.add(body);
  const torso = new THREE.Mesh(torsoGeometry(), hide); torso.castShadow = true; torso.position.y = -DROP; body.add(torso);
  { const cl = new THREE.Mesh(clumpsGeometry(), hide); cl.position.y = -DROP; body.add(cl); }
  // The belly: a bare, tight swelling under the pinched waist, veined, where something shifts.
  const bellyGeo = new THREE.SphereGeometry(1, 18, 12), bellyRest = Float32Array.from(bellyGeo.attributes.position.array as Float32Array);
  { const p = bellyGeo.attributes.position, col: number[] = [], base = new THREE.Color('#ffffff'), vein = new THREE.Color('#2a1530'), green = new THREE.Color('#6a8a40');
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), v = Math.abs(Math.sin(x * 9 + Math.sin(z * 7) * 2 + y * 3)), c = base.clone().lerp(vein, v < 0.12 ? 0.85 : 0).lerp(green, Math.max(0, -y) * 0.25); col.push(c.r, c.g, c.b); }
    bellyGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); skin.vertexColors = true; }
  const belly = new THREE.Mesh(bellyGeo, skin); belly.position.set(-0.17, 0.67 - DROP, 0); belly.scale.set(0.16, 0.11, 0.1); belly.castShadow = true; body.add(belly);
  // Legs: each a thigh, a shank, a cannon and a paw, placed between their joints each frame.
  const seg = (rt: number, rb: number): THREE.Mesh => { const g = new THREE.CylinderGeometry(rt, rb, 1, 7); g.translate(0, 0.5, 0); const m = new THREE.Mesh(g, hide); m.castShadow = true; body.add(m); return m; };
  const legs = [0, 1, 2, 3].map(l => ({ fore: l < 2, side: l % 2 ? 1 : -1, parts: [seg(0.03, 0.05), seg(0.02, 0.026), seg(0.016, 0.019)], knobs: [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.028, 7, 5), hide); body.add(m); return m; }), paw: (() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.04, 7, 5), hide); m.scale.set(1.5, 0.6, 1); body.add(m); return m; })() }));
  const neck = seg(0.06, 0.09);
  // The head: skull, a long muzzle, ears (one torn), the eyes, the jaw hinged under, black gums and too many teeth; inside, a beak and the arms.
  const head = new THREE.Group(); body.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 9), hide); skull.scale.set(1.3, 0.78, 0.85); head.add(skull);
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.07, 0.24, 7), hide); snout.rotation.z = -Math.PI / 2; snout.position.set(0.17, -0.015, 0); snout.scale.set(1, 1, 0.8); head.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 7, 5), gum); nose.position.set(0.29, -0.005, 0); head.add(nose);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 4), hide); ear.position.set(-0.04, 0.1, s * 0.055); ear.rotation.set(s * -0.3, 0, 0.25); if (s > 0) { ear.scale.set(1, 0.65, 1); ear.rotation.z = 0.9; } head.add(ear);
    const eye = new THREE.Group(); eye.position.set(0.07, 0.035, s * 0.06); eye.rotation.y = -s * 0.5; head.add(eye);
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(0.016, 9, 7), eyeMat));
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.005, 0.024), pupilMat); pupil.position.x = 0.0145; eye.add(pupil);
    // A heavy brow over each eye, slanting down to the nose: the look of something that is not tired of watching.
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.03), hide); brow.position.set(0.075, 0.05, s * 0.058); brow.rotation.set(s * 0.25, s * -0.4, -0.35); head.add(brow);
  }
  // The gums and the teeth of the upper jaw, crowded and uneven: two rows where there should be one.
  const teeth = (n: number, len: number, down: boolean, parent: THREE.Object3D, y: number): void => {
    for (let row = 0; row < 2; row++) for (let i = 0; i < n; i++) { const u = i / (n - 1), x = 0.08 + u * 0.19 - row * 0.012, side = (i % 2 ? 1 : -1), z = side * (0.045 - u * 0.022 - row * 0.012); const t = new THREE.Mesh(new THREE.ConeGeometry(0.006 + rand() * 0.004, len * (0.6 + rand() * 0.7), 4), tooth); t.position.set(x, y + (down ? -1 : 1) * len * 0.35, z); t.rotation.set((rand() - 0.5) * 0.5, 0, down ? Math.PI : 0); parent.add(t); }
  };
  const gumUp = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.018, 0.09), gum); gumUp.position.set(0.18, -0.055, 0); head.add(gumUp); teeth(9, 0.04, true, head, -0.06);
  const jaw = new THREE.Group(); jaw.position.set(0.0, -0.06, 0); head.add(jaw);
  const jawBone = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.045, 0.25, 6), hide); jawBone.rotation.z = -Math.PI / 2; jawBone.position.set(0.15, -0.03, 0); jawBone.scale.set(1, 1, 1.1); jaw.add(jawBone);
  const gumDown = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.016, 0.08), gum); gumDown.position.set(0.16, -0.01, 0); jaw.add(gumDown); teeth(8, 0.035, false, jaw, -0.004);
  const throat = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), maw); throat.position.set(0.05, -0.06, 0); throat.scale.set(1.6, 0.6, 0.9); head.add(throat);
  // What it carries, showing in its throat: a beak and a knot of small arms (head frame).
  const beak = new THREE.Group(); head.add(beak);
  for (const s of [1, -1]) { const m = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.06, 6, 1, false, 0, Math.PI), beakMat); m.rotation.set(0, s > 0 ? 0 : Math.PI, -Math.PI / 2 + s * 0.25); beak.add(m); }
  const ARMS = 6, ROWS = 12, threads = new Tubes(ARMS, ROWS, 5, armMat); head.add(threads.mesh); threads.mesh.castShadow = false;
  // The hackles: filaments along the spine that drift as if under water; the tail, clumped and thin. Body frame.
  const HACKLES = 28, hackles = new Tubes(HACKLES + 1, 7, 3, hide); body.add(hackles.mesh);
  const hackleRoot = Array.from({ length: HACKLES }, (_, i) => { const u = i / (HACKLES - 1), x = 0.56 - u * 0.95; return { x, z: (rand() - 0.5) * 0.06, len: 0.1 + rand() * 0.14 + (x > 0.3 ? 0.06 : 0), ph: rand() * 6.28, lean: -0.3 - rand() * 0.4 }; });
  // The young, when it comes out: a wet dark body the size of a fist, two lime eyes, six arms; and the stain it leaves. Ground frame (the group's).
  const crawler = new THREE.Group(); crawler.visible = false; group.add(crawler);
  const cBody = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 7), armMat); cBody.scale.set(1.3, 0.8, 1); cBody.position.y = 0.06; crawler.add(cBody);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.011, 6, 4), eyeMat); e.position.set(0.075, 0.1, s * 0.035); crawler.add(e); }
  const cArms = new Tubes(6, 8, 4, armMat); crawler.add(cArms.mesh);
  const stain = new THREE.Mesh(new THREE.CircleGeometry(0.25, 16), ichor); stain.rotation.x = -Math.PI / 2; stain.position.y = 0.012; stain.visible = false; group.add(stain);

  // State.
  let lastX = NaN, lastZ = NaN, speed = 0, phase = 0, clock = 0, biteT = -1, jerk = 0, bristle = 0, sleepW = 0, deadW = 0, crouch = 0;
  const glitch = { next: GLITCH_S[0] + rand() * (GLITCH_S[1] - GLITCH_S[0]), t: -1, kind: 0, leg: 0 };
  const look = { yaw: 0, pitch: 0 }; const crawlDir = rand() * Math.PI * 2;
  const ankleV = v3(), kneeV = v3(), inv = new THREE.Matrix4(), q = new THREE.Quaternion(), Y = v3(0, 1, 0), a = v3(), b = v3(), c = v3(), d = v3(), tmp = v3(), tmp2 = v3();

  /** Place a leg part between two points (body frame). */
  function between(m: THREE.Mesh, p: THREE.Vector3, r: THREE.Vector3): void { tmp.subVectors(r, p); const L = tmp.length() || 1e-4; m.position.copy(p); q.setFromUnitVectors(Y, tmp.multiplyScalar(1 / L)); m.quaternion.copy(q); m.scale.set(1, L, 1); }
  /** Two-bone IK in the leg's plane; the joint bends toward `bend`. */
  function joint(p: THREE.Vector3, r: THREE.Vector3, l1: number, l2: number, bend: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    const dd = tmp2.subVectors(r, p), L = Math.max(1e-4, dd.length()), reach = Math.min(L, (l1 + l2) * 0.999), along = (l1 * l1 - l2 * l2 + reach * reach) / (2 * reach), h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
    dd.multiplyScalar(1 / L); const bx = bend.x - dd.x * bend.dot(dd), by = bend.y - dd.y * bend.dot(dd), bz = bend.z - dd.z * bend.dot(dd), bl = Math.hypot(bx, by, bz) || 1;
    return out.set(p.x + dd.x * along + (bx / bl) * h, p.y + dd.y * along + (by / bl) * h, p.z + dd.z * along + (bz / bl) * h);
  }

  function update(x: number, z: number, s: DireState, dtIn: number, now: number): void {
    const dt = Math.min(0.1, Math.max(0, dtIn)); clock += dt;
    const alive = s.dead <= 0, asleep = !!s.asleep && alive;
    if (!Number.isNaN(lastX) && dt > 0) { const dd = Math.hypot(x - lastX, z - lastZ); speed = ease(speed, dd > 1 ? speed : dd / dt, 8, dt); }
    lastX = x; lastZ = z; if (!s.moving) speed = ease(speed, 0, 6, dt);
    // The hive: the stutter (the trot stalls and lurches on the same beat for every dire wolf), the breath, the look.
    const sp = now / STUTTER_PERIOD, inStall = sp - Math.floor(sp) < STALL_S / STUTTER_PERIOD && hash(Math.floor(sp)) > 0.35;
    const rate = inStall ? 0 : (sp - Math.floor(sp) < (STALL_S * 2.2) / STUTTER_PERIOD ? 1.9 : 1);
    phase += (speed * dt * rate) / STRIDE;
    const hp = Math.floor(now / HIVE_PERIOD), hf = now / HIVE_PERIOD - hp, owl = hp % OWL_EVERY === 3;
    const snapOn = hf > 0.45 && hf < 0.8, k = snapOn ? Math.min(1, (hf - 0.45) * HIVE_PERIOD / 0.07) : Math.max(0, 1 - (hf - 0.8) * HIVE_PERIOD / 0.12);
    const tYaw = (owl ? 2.5 : (hash(hp) - 0.5) * 1.6) * (hash(hp + 99) > 0.5 ? 1 : -1), tPitch = (hash(hp + 7) - 0.5) * 0.4;
    look.yaw = tYaw * clamp01(k) * (1 - s.tell) * (alive ? 1 : 0) * (asleep ? 0.15 : 1); look.pitch = tPitch * clamp01(k);
    const breath = Math.sin(now * 2.1);
    // Its own glitches.
    glitch.next -= dt; if (glitch.t >= 0) { glitch.t += dt; if (glitch.t > GLITCH_LEN) glitch.t = -1; } else if (glitch.next <= 0 && alive && !asleep) { glitch.t = 0; glitch.kind = Math.floor(rand() * 3); glitch.leg = Math.floor(rand() * 4); glitch.next = GLITCH_S[0] + rand() * (GLITCH_S[1] - GLITCH_S[0]); }
    const gk = glitch.t >= 0 ? Math.sin((glitch.t / GLITCH_LEN) * Math.PI) : 0;
    if (biteT >= 0) { biteT += dt; if (biteT > BITE_S) biteT = -1; }
    jerk = Math.max(0, jerk - dt * 4); bristle = Math.max(0, bristle - dt * 1.5);
    crouch = ease(crouch, alive && !asleep ? s.tell : 0, 14, dt); sleepW = ease(sleepW, asleep ? 1 : 0, 3, dt); deadW = alive ? 0 : smooth(s.dead / DEATH.fall);
    if (asleep) sleepW = 1;

    // The body: the trot's bob, the lurch of the stall, the crouch, a jerk when struck; asleep or dead it lies on its side.
    const bob = Math.abs(Math.sin(phase * Math.PI * 2)) * 0.035 * Math.min(1, speed / 1.5), lurch = inStall && speed > 0.3 ? 0.04 : 0;
    const lie = Math.max(sleepW, deadW);
    // Lying, it rolls onto its flank about the middle of its trunk, which comes down to rest on the ground.
    body.rotation.set(lie * 1.42, 0, -crouch * 0.14 + lurch * 1.5 + jerk * 0.15); q.setFromEuler(body.rotation);
    const pv = tmp.set(0, 0.8 - DROP, 0), rp = tmp2.copy(pv).applyQuaternion(q);
    body.position.set(-lurch + pv.x - rp.x, pv.y - rp.y + bob - crouch * 0.13 + jerk * 0.05 - lie * (0.64 - DROP), pv.z - rp.z);
    body.updateMatrix(); inv.copy(body.matrix).invert();
    // Belly: breathing out of time with the chest, something moving under the skin; dead it sags and empties.
    const sag = alive ? 0 : smooth(span(s.dead, DEATH.sag[0], DEATH.sag[1]));
    torso.scale.set(1, 1 + breath * 0.03 * (1 - deadW), 1 + breath * 0.04 * (1 - deadW));
    belly.scale.set(0.16 * (1 + sag * 0.15), 0.11 * (1 + Math.sin(now * 1.37 + 1) * 0.07) * (1 - sag * 0.6), 0.1 * (1 - sag * 0.25)); belly.position.y = 0.67 - DROP - sag * 0.04;
    { const p = belly.geometry.attributes.position as THREE.BufferAttribute, arr = p.array as Float32Array, live = alive ? 1 : Math.max(0, 1 - s.dead / DEATH.sag[1]);
      const bx = Math.cos(clock * 0.9) * 0.8, by = -0.4 + Math.sin(clock * 1.3) * 0.3, bz = Math.sin(clock * 0.7) * 0.8, bl = Math.hypot(bx, by, bz);
      for (let i = 0; i < p.count; i++) { const rx = bellyRest[i * 3], ry = bellyRest[i * 3 + 1], rz = bellyRest[i * 3 + 2], dot = (rx * bx + ry * by + rz * bz) / bl, push = 1 + 0.18 * live * Math.max(0, dot - 0.7) / 0.3 * Math.max(0, dot - 0.7) / 0.3; arr[i * 3] = rx * push; arr[i * 3 + 1] = ry * push; arr[i * 3 + 2] = rz * push; }
      p.needsUpdate = true; belly.geometry.computeVertexNormals(); }
    skin.emissive.copy(hide.emissive); armMat.emissive.copy(hide.emissive);

    // The legs: a trot (the diagonals together), solved to feet on the ground; a glitch bends one where there is no joint; asleep folded, dead stretched out stiff.
    const ROOT = [[0.36, 0.76 - DROP, 0.085], [0.36, 0.76 - DROP, 0.085], [-0.5, 0.74 - DROP, 0.09], [-0.5, 0.74 - DROP, 0.09]], NEUTRAL = [0.4, 0.4, -0.52, -0.52], OFF = [0, 0.5, 0.5, 0];
    for (let l = 0; l < 4; l++) {
      const L = legs[l], sd = L.side, root = a.set(ROOT[l][0], ROOT[l][1], ROOT[l][2] * sd);
      const ph = ((phase + OFF[l]) % 1 + 1) % 1, h = STRIDE * 0.5 * Math.min(1, speed / 0.6);
      let fx: number, fy: number; if (ph < 0.5) { fx = h - (ph / 0.5) * 2 * h; fy = 0; } else { const kk = (ph - 0.5) / 0.5; fx = -h + smooth(kk) * 2 * h; fy = Math.sin(kk * Math.PI) * 0.1 * Math.min(1, speed / 0.6); }
      // Feet on the ground (group frame) into the body's frame; asleep and dead, feet in the body's own frame, folded or splayed.
      const foot = b.set(NEUTRAL[l] + fx, fy, ROOT[l][2] * sd * 1.05).applyMatrix4(inv);
      if (lie > 0.01) { const fold = c.set(ROOT[l][0] + (L.fore ? 0.16 : -0.04) + (asleep ? 0.06 : 0), ROOT[l][1] - (asleep ? 0.4 : 0.52), ROOT[l][2] * sd * 0.35 + (sd < 0 ? 0.05 : 0)); /* lying on its flank: the legs out along the ground, the upper pair laid over the lower */ foot.lerp(fold, lie); }
      const bend = d.set(L.fore ? -1 : 1, 0, 0); if (glitch.t >= 0 && glitch.kind === 0 && glitch.leg === l) bend.multiplyScalar(-1).y -= 0.5 * gk;
      const l1 = L.fore ? 0.25 : 0.26, l2 = L.fore ? 0.25 : 0.27, cannon = L.fore ? 0.11 : 0.17;
      const ankle = ankleV.copy(foot); ankle.y += cannon; if (!L.fore) ankle.x -= 0.06;
      const kn = joint(root, ankle, l1, l2, bend, kneeV);
      between(L.parts[0], root, kn); between(L.parts[1], kn, ankle); between(L.parts[2], ankle, foot); L.knobs[0].position.copy(kn); L.knobs[1].position.copy(ankle); L.knobs[1].scale.setScalar(0.75); L.paw.position.copy(foot).add(tmp.set(0.03, 0.01, 0));
    }
    // The neck and head: the hive's look, the trot's nod, a glitch wrenching or stretching it; low in the crouch; asleep laid on the paws; open-mouthed when it bites.
    const stretch = glitch.t >= 0 && glitch.kind === 1 ? gk * 0.12 : 0, wrench = glitch.t >= 0 && glitch.kind === 2 ? gk * 1.4 : 0;
    const nb = a.set(0.55, 0.9 - DROP, 0), nlen = 0.24 + stretch, npitch = 0.75 - crouch * 0.7 - sleepW * 0.9 + Math.sin(phase * Math.PI * 4) * 0.04;
    const hp3 = b.set(nb.x + Math.cos(npitch) * nlen, nb.y + Math.sin(npitch) * nlen, 0);
    between(neck, nb, hp3); head.position.copy(hp3);
    const bitePh = biteT >= 0 ? biteT / BITE_S : -1, open = bitePh >= 0 ? Math.sin(Math.min(1, bitePh / 0.3) * Math.PI * 0.5) * (1 - smooth((bitePh - 0.55) / 0.45)) : 0;
    head.rotation.set(0, look.yaw + wrench, -0.15 + look.pitch - crouch * 0.25 - sleepW * 0.2 + open * 0.2, 'YZX');
    const gape = Math.max(open * 1.05, crouch * 0.28, alive ? 0 : 0.5 * smooth(span(s.dead, DEATH.sag[0], DEATH.out[0])), asleep ? 0.04 : 0);
    jaw.rotation.z = -gape;
    // The arms in the throat: curled inside at rest; in the tell they show behind the teeth; at the bite they push out past the jaw, writhing.
    const ext = Math.max(open, crouch * 0.35, alive ? 0 : smooth(span(s.dead, DEATH.sag[1], DEATH.out[0])) * 0.4 * (1 - span(s.dead, DEATH.out[0], DEATH.out[1])));
    beak.position.set(0.05 + ext * 0.12, -0.065 - gape * 0.04, 0); beak.scale.setScalar(0.4 + ext * 0.8); beak.children.forEach((m, i) => { m.rotation.z = -Math.PI / 2 + (i ? -1 : 1) * (0.25 + ext * 0.5 * (0.5 + 0.5 * Math.sin(clock * 20))); });
    for (let i = 0; i < ARMS; i++) {
      if (ext < 0.03) { threads.hide(i); continue; }
      const ang = (i / ARMS) * Math.PI * 2, oy = Math.cos(ang) * 0.02 - 0.065 - gape * 0.03, oz = Math.sin(ang) * 0.025, L = (0.08 + ext * THROAT_REACH) * (0.75 + 0.35 * hash(i + seed)), wr = clock * 9 + i * 1.7;
      threads.set(i, (u, out) => out.set(0.03 + u * L, oy + Math.sin(wr + u * 6) * 0.025 * u - u * u * gape * 0.06, oz + Math.cos(ang) * 0.0 + Math.sin(ang) * u * 0.08 + Math.cos(wr * 0.8 + u * 5) * 0.03 * u), u => 0.012 * (1 - u * 0.8));
    }
    threads.commit();
    // Hackles: rooted along the spine, drifting slowly as if under water whatever the wolf does; bristling when struck; slack when it is dead.
    const limp = alive ? 0 : smooth(span(s.dead, DEATH.sag[0], DEATH.sag[1]));
    for (let i = 0; i < HACKLES; i++) {
      const hr = hackleRoot[i], yb = spineTop(hr.x) - 0.01 - DROP, L = hr.len * (1 + bristle * 0.4), t = now * 0.7 + hr.ph;
      hackles.set(i, (u, out) => { const up = (1 - limp) * (0.75 + bristle * 0.25); out.set(hr.x + u * L * (hr.lean * up - (1 - up) * 0.9) + Math.sin(t + u * 2.5) * 0.05 * u * (1 - limp * 0.8), yb + u * L * up - limp * u * L * 0.1 + Math.sin(t * 1.3 + u * 3) * 0.02 * u, hr.z + Math.cos(t * 0.8 + u * 2) * 0.06 * u * (1 - limp * 0.7)); }, u => 0.008 * (1 - u * 0.85));
    }
    // The tail: thin and clumped, hanging, drifting slow like the hackles.
    hackles.set(HACKLES, (u, out) => out.set(-0.6 - u * 0.38, 0.77 - DROP - u * 0.3 - u * u * 0.06 + Math.sin(now * 0.6 + u * 2) * 0.04 * u, Math.sin(now * 0.5 + u * 2.5) * 0.08 * u), u => 0.032 * (1 - u * 0.6) * (u > 0.75 ? 1.3 : 1));
    hackles.commit();
    // The eyes: the mother's lime, flaring in the tell; dead, dim; asleep, still faintly lit.
    eyeMat.color.setRGB(alive ? 0.68 + crouch * 0.3 : 0.2, alive ? 0.82 + crouch * 0.18 : 0.25, alive ? 0.1 : 0.06).multiplyScalar(asleep ? 0.55 : 1);

    // Death: the young comes out of the mouth, crawls off and dissolves into a stain.
    if (!alive && s.dead >= DEATH.out[0]) {
      crawler.visible = s.dead < DEATH.melt[1]; head.updateMatrix();
      const mouth = tmp.set(0.25, -0.07, 0).applyMatrix4(head.matrix).applyMatrix4(body.matrix);
      const out = smooth(span(s.dead, DEATH.out[0], DEATH.out[1])), cr = span(s.dead, DEATH.crawl[0], DEATH.crawl[1]), dist = (1 - Math.pow(1 - cr, 2)) * 1.1, melt = smooth(span(s.dead, DEATH.melt[0], DEATH.melt[1]));
      const gx = mouth.x + Math.cos(crawlDir) * (0.15 * out + dist), gz = mouth.z + Math.sin(crawlDir) * (0.15 * out + dist);
      crawler.position.set(gx, Math.max(0, mouth.y * (1 - out)), gz); crawler.rotation.y = -crawlDir; crawler.scale.set(0.5 + out * 0.5 - melt * 0.4, (0.5 + out * 0.5) * (1 - melt * 0.85), 0.5 + out * 0.5 - melt * 0.4);
      const row = s.dead * 7;
      for (let i = 0; i < 6; i++) { const ang = (i / 6) * Math.PI * 2 + 0.3, pull = Math.sin(row + i * 2.1) * 0.35 * (1 - melt); cArms.set(i, (u, o) => o.set(Math.cos(ang + pull * u) * (0.07 + u * 0.18), 0.05 - u * 0.045, Math.sin(ang + pull * u) * (0.07 + u * 0.18)), u => 0.016 * (1 - u * 0.8)); }
      cArms.commit();
      stain.visible = s.dead > DEATH.melt[0]; stain.position.set(gx, 0.012, gz); stain.scale.setScalar(0.2 + melt * 0.7); ichor.opacity = 0.7 * (1 - span(s.dead, DEATH.melt[1], DEATH.sink + 2));
    } else { crawler.visible = false; stain.visible = false; }
    // Long dead, the carcass sinks.
    group.position.y -= Math.max(0, s.dead - DEATH.sink) * 0.15;
  }

  return {
    group, hide, update,
    bite(): void { biteT = 0; },
    flinch(power: number): void { jerk = Math.min(1, 0.6 + power * 0.3); bristle = 1; },
  };
}
