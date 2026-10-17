// The Dark Young (Noah, 2026-10-17): an octopus masquerading as a goat. There is no goat in it: the
// body is one bulbous mantle, the beak sits in the middle of the chest, and every part of the goat is
// a tentacle folded into place. The two ventral arms hug the belly back to the rump and fold down into
// the hindquarters and hind legs; the two lateral arms drop as the forelegs; the four dorsal arms
// braid up into the neck, run down the face to the muzzle, fold back over it, and come out of the
// poll as the horns and the ears. Every leg ends in a tip curled under itself for a hoof. The real
// eyes are the octopus's own, on the mantle at the shoulders; the goat's face has none.
//
// It moves as a goat (a walk, a trot when it charges, a rear and a head-butt) and the horror is in
// the unfolding: the head comes apart into four arms that lash out, a foreleg uncurls into a reach,
// it feeds by opening its face onto the ground and drawing what it finds to the beak, a hard blow
// shakes the disguise loose for a moment, beaten it drops the goat altogether and rows away flat on
// its arms, and dead it falls open into what it always was.
//
// The arms are tubes rebuilt on the CPU each frame from a few control points per pose: the goat's
// pose is solved from the gait, every other pose is laid over it arm by arm, and each arm opens from
// its base outward (UNROLL) so a change of shape reads as uncoiling, not morphing. Suckers ride the
// arms in two rows on the side the arm curls toward. Tuning constants at the top.
import * as THREE from 'three';

/** The figure's size: 1 is a goat whose back stands ~1.45 m and whose horn tips stand ~2.3 m. Tuning (the fight's reach, DY_REACH, is tuned to about this). */
export const DY_SCALE = 1;
/** The walk's stride (m) and the speed above which it trots (m/s). Tuning. */
const STRIDE_WALK = 0.62, STRIDE_TROT = 1.0, TROT_FROM = 1.25;
/** How far an opening runs ahead along an arm: 0 opens every point at once, more opens the base well before the tip. Tuning. */
const UNROLL = 0.75;
/** Rings and sides of each arm's tube, suckers per row per arm. Tuning (cost: ~6k vertices a figure, rebuilt each frame). */
const RINGS = 40, SIDES = 9, SUCKERS = 15;
/** How long an attack lasts (s) and how far a reach goes (m, ahead of the figure's centre). Tuning. */
const ATTACK_S = { butt: 0.75, lash: 1.1, grab: 1.25 } as const, REACH_M = 2.3;
/** The odds of each attack when it winds up: the goat's own head-butt most, the unfoldings less. Tuning. */
/** The head's carriage: its face's angle below the horizontal at rest (rad). Tuning. */
const HEAD_PITCH = -0.95;
/** How much higher than the first cut the goat's trunk stands (m): longer legs, a goat and not a crab. Tuning. */
const BODY_LIFT = 0.14;
/** Beyond these distances (m) the arms are rebuilt every 2nd and every 4th frame; off screen, every 8th. Tuning. */
const LOD_M = [22, 45];
const ATTACK_ODDS: [DyAttack, number][] = [['butt', 0.5], ['lash', 0.3], ['grab', 0.2]];

export type DyAttack = 'butt' | 'lash' | 'grab';
/** What the game tells the figure each frame. `tell` 0..1 is the wind-up before a blow (the model's tellOf); `rooted` > 0 while the roots hold it; `dead` the seconds since it died (0 alive); `flat` while it flees as an octopus; `feed` while it eats at a store or devours a place. */
export interface DyState { moving: boolean; tell: number; rooted: number; dead: number; flat: boolean; feed: boolean }

// The arms: 0, 1 the horns (L1, R1); 2, 3 the ears (L2, R2); 4, 5 the forelegs (L3, R3); 6, 7 the hind legs (L4, R4). Odd arms are on the +z side.
const ARMS = 8;
const side = (a: number): number => (a % 2 ? 1 : -1);
const isHead = (a: number): boolean => a < 4, isFore = (a: number): boolean => a === 4 || a === 5, isHind = (a: number): boolean => a >= 6;
/** Control points per arm (the goat's fold needs more on the head arms). */
const KS = [14, 14, 12, 12, 9, 9, 11, 11];
/** Each arm's thickness at its base, and where along it the arm bunches (a thigh, a forearm, a neck) and by how much. */
const R0 = [0.115, 0.115, 0.1, 0.1, 0.115, 0.115, 0.13, 0.13];
/** How fast each arm tapers (lower keeps it thick further out: the head's arms must still be horns at their tips). */
const TAPER = [0.55, 0.55, 0.6, 0.6, 0.75, 0.75, 0.7, 0.7];
const BUNCH: [number, number, number][] = [[0.2, 0.12, 0.4], [0.2, 0.12, 0.4], [0.2, 0.12, 0.4], [0.2, 0.12, 0.4], [0.3, 0.12, 0.45], [0.3, 0.12, 0.45], [0.6, 0.09, 1.1], [0.6, 0.09, 1.1]];
/** Where each arm leaves the ring round the beak (angle from the ring's dorsal axis toward the arm's side). */
const RING_ANGLE = [0.32, 0.32, 0.85, 0.85, 1.65, 1.65, 2.45, 2.45];

const v3 = (x = 0, y = 0, z = 0): THREE.Vector3 => new THREE.Vector3(x, y, z);
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number): number => { const k = clamp01(x); return k * k * (3 - 2 * k); };
const ease = (cur: number, to: number, rate: number, dt: number): number => cur + (to - cur) * (1 - Math.exp(-rate * dt));
/** A cheap smooth noise in 3D (sums of sines), for the mantle's wrinkles and mottling. */
const wob = (x: number, y: number, z: number): number => Math.sin(x * 7.1 + Math.sin(y * 5.3)) * Math.sin(z * 6.7 + x * 2.1) * 0.5 + Math.sin(y * 11.3 + z * 9.1 + x * 3.7) * 0.25 + Math.sin(x * 17 + y * 13 + z * 19) * 0.12;

// Colours: a wet black with a bruise of violet above, a dead grey-lilac below, the suckers paler and fleshier.
const DORSAL = new THREE.Color('#1d1621'), DORSAL2 = new THREE.Color('#3b2742'), VENTRAL = new THREE.Color('#57434f'), SUCKER = new THREE.Color('#8a6c78'), SUCKER_IN = new THREE.Color('#3a2430');

/** Two-bone IK in the plane of the leg: from `a` to `b` with segment lengths l1, l2; the joint bends toward `bend` (unit). Writes the joint into `out`. */
function knee(a: THREE.Vector3, b: THREE.Vector3, l1: number, l2: number, bend: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
  const d = out.subVectors(b, a), L = Math.max(1e-4, d.length()), reach = Math.min(L, (l1 + l2) * 0.999);
  const along = (l1 * l1 - l2 * l2 + reach * reach) / (2 * reach), h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  d.multiplyScalar(1 / L); const bx = bend.x - d.x * bend.dot(d), by = bend.y - d.y * bend.dot(d), bz = bend.z - d.z * bend.dot(d), bl = Math.hypot(bx, by, bz) || 1;
  return out.set(a.x + d.x * along + (bx / bl) * h, a.y + d.y * along + (by / bl) * h, a.z + d.z * along + (bz / bl) * h);
}

/** The mantle: an egg, the sac bulging behind and the head with its eyes in front, wrinkled, mottled dark above and pale beneath. Its front (+x) is where the arms meet. */
function mantleGeometry(): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, 40, 28), p = g.attributes.position as THREE.BufferAttribute, col: number[] = [], c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const back = x < 0 ? -x : 0, fore = x > 0 ? x : 0;
    // The sac swells toward the rump and droops a little; the head narrows to a neck before the arms and swells again at the eyes.
    const swell = 1 + 0.2 * Math.exp(-((x + 0.45) ** 2) / 0.12) - 0.16 * Math.exp(-((x - 0.55) ** 2) / 0.02) + 0.08 * Math.exp(-((x - 0.78) ** 2) / 0.01);
    const sx = x < 0 ? 0.92 : 0.6, sy = 0.32 * swell * (1 + 0.08 * back) * (y > 0 ? 0.85 : 1), sz = 0.3 * swell;
    const n = wob(x * 1.3, y * 1.3, z * 1.3) + wob(x * 3.1 + 1, y * 3.3, z * 2.9) * 0.4;
    const r = 1 + n * 0.04 + (Math.sin(x * 40) * Math.sin(z * 30) > 0.92 ? 0.03 : 0); // wrinkles and papillae
    x *= sx * r; y = y * sy * r - 0.08 * back * back + 0.05 * fore; z *= sz * r;
    p.setXYZ(i, x, y, z);
    const up = clamp01(p.getY(i) / 0.4 * 0.5 + 0.5), m = clamp01(0.5 + wob(x * 2.2 + 3, y * 2.2, z * 2.2) * 0.9);
    c.copy(VENTRAL).lerp(DORSAL, smooth(up * 1.4 - 0.2)); c.lerp(DORSAL2, m * 0.7 * up); col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
}

/** One arm's working buffers. */
interface Arm { k: number; pts: THREE.Vector3[]; work: THREE.Vector3[]; dense: THREE.Vector3[]; cum: Float32Array; ring: THREE.Vector3[]; tan: THREE.Vector3[]; nrm: THREE.Vector3[]; bin: THREE.Vector3[]; rad: Float32Array; length: number; rest: number }

export interface DarkYoung {
  group: THREE.Group;
  /** The skin's material (its emissive is the hurt flash's to set). */
  hide: THREE.MeshStandardMaterial;
  /** Step the figure: where it stands this frame (any frame; for the gait's pace), its state, and the time step (s). */
  update(x: number, z: number, s: DyState, dt: number): void;
  /** The blow its tell winds up for (chosen at random as the tell begins unless set here). */
  prepare(kind: DyAttack): void;
  /** It strikes now (the model's lunge): the blow it wound up for in its tell, or one at random. */
  attack(kind?: DyAttack): void;
  /** A blow lands: the disguise shakes loose for a moment, more for a harder blow; `power` 1 a strike. */
  flinch(power: number): void;
  /** The blow under way, if any. */
  readonly attacking: DyAttack | null;
}

export function createDarkYoung(seed = 1): DarkYoung {
  const group = new THREE.Group(); group.name = 'dark-young';
  let rs = (seed * 9301 + 49297) % 233280; const rand = (): number => (rs = (rs * 9301 + 49297) % 233280) / 233280;
  const hide = new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.45, metalness: 0, emissive: '#000000' });
  // The body: the mantle, the eyes, the beak in its ring of pale lip, a siphon on its flank. All in `body`, which the poses move.
  const body = new THREE.Group(); group.add(body);
  const mantle = new THREE.Mesh(mantleGeometry(), hide); mantle.castShadow = true; body.add(mantle);
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#d8ff60' }), pupilMat = new THREE.MeshBasicMaterial({ color: '#050208' }), lidMat = hide;
  const eyes: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(0.5, 0.1, s * 0.24); e.rotation.y = -s * 0.9; body.add(e);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 10), eyeMat); e.add(ball);
    // The pupil is a horizontal bar, as a goat's is (and an octopus's), laid across the ball's front.
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.014, 0.075), pupilMat); pupil.position.set(0.046, 0, 0); e.add(pupil);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.3), lidMat); lid.rotation.z = 0.5; e.add(lid);
    eyes.push(e);
  }
  // The ring the arms leave from, in the mantle's frame: under the front of the head, facing forward and down.
  const crown = v3(0.6, -0.27, 0), crownN = v3(0.75, -0.66, 0).normalize(), crownD = v3(0.66, 0.75, 0).normalize(), crownZ = v3(0, 0, 1), CROWN_R = 0.19;
  const lipMat = new THREE.MeshStandardMaterial({ color: '#6e4a58', roughness: 0.5 }), beakMat = new THREE.MeshStandardMaterial({ color: '#0d0a08', roughness: 0.18, metalness: 0.2 });
  const mouth = new THREE.Group(); mouth.position.copy(crown); mouth.quaternion.setFromUnitVectors(v3(0, 1, 0), crownN); body.add(mouth);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.045, 8, 18), lipMat); lip.rotation.x = Math.PI / 2; mouth.add(lip);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(CROWN_R + 0.06, 20), lipMat); disc.rotation.x = -Math.PI / 2; disc.position.y = -0.01; mouth.add(disc);
  const mandibles: THREE.Mesh[] = [];
  for (const s of [1, -1]) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.2, 10, 1, false, 0, Math.PI), beakMat); m.rotation.y = s > 0 ? 0 : Math.PI; m.position.y = 0.06;
    const hinge = new THREE.Group(); hinge.add(m); mouth.add(hinge); mandibles.push(m); (m as THREE.Mesh & { hinge?: THREE.Group }).hinge = hinge;
  }
  const siphon = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 0.18, 8, 1, true), hide); siphon.position.set(0.25, -0.1, 0.33); siphon.rotation.set(0.3, 0, 1.75); body.add(siphon);

  // The arms: one mesh for all eight, rebuilt each frame.
  const arms: Arm[] = KS.map(k => ({ k, pts: Array.from({ length: k }, () => v3()), work: Array.from({ length: k }, () => v3()), dense: Array.from({ length: (k - 1) * 6 + 1 }, () => v3()), cum: new Float32Array((k - 1) * 6 + 1), ring: Array.from({ length: RINGS }, () => v3()), tan: Array.from({ length: RINGS }, () => v3()), nrm: Array.from({ length: RINGS }, () => v3()), bin: Array.from({ length: RINGS }, () => v3()), rad: new Float32Array(RINGS), length: 0, rest: 2 }));
  const tubeVerts = RINGS * (SIDES + 1), suckerVerts = 13, perArm = tubeVerts + SUCKERS * 2 * suckerVerts + 1;
  const vCount = perArm * ARMS, pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3), colr = new Float32Array(vCount * 3), idx: number[] = [];
  for (let a = 0; a < ARMS; a++) {
    const o = a * perArm, c = new THREE.Color();
    for (let i = 0; i < RINGS; i++) for (let j = 0; j <= SIDES; j++) {
      // j = 0 is the sucker side; the colour runs from pale there to black on the back of the arm; the tips go paler.
      const th = (j / SIDES) * Math.PI * 2, under = (Math.cos(th) + 1) / 2, u = i / (RINGS - 1);
      c.copy(DORSAL).lerp(DORSAL2, 0.3 + 0.3 * Math.sin(i * 0.7 + a)).lerp(VENTRAL, smooth(under * 1.3 - 0.35)).lerp(VENTRAL, u * u * 0.3);
      const v = o + i * (SIDES + 1) + j; colr.set([c.r, c.g, c.b], v * 3);
      if (i < RINGS - 1 && j < SIDES) { const p0 = o + i * (SIDES + 1) + j, p1 = p0 + SIDES + 1; idx.push(p0, p1, p0 + 1, p0 + 1, p1, p1 + 1); }
    }
    for (let s = 0; s < SUCKERS * 2; s++) {
      const b = o + tubeVerts + s * suckerVerts;
      for (let j = 0; j < 6; j++) { colr.set([SUCKER.r, SUCKER.g, SUCKER.b], (b + j) * 3); colr.set([SUCKER.r * 0.8, SUCKER.g * 0.8, SUCKER.b * 0.8], (b + 6 + j) * 3); }
      colr.set([SUCKER_IN.r, SUCKER_IN.g, SUCKER_IN.b], (b + 12) * 3);
      for (let j = 0; j < 6; j++) { const n = (j + 1) % 6; idx.push(b + j, b + n, b + 6 + j, b + n, b + 6 + n, b + 6 + j, b + 6 + j, b + 6 + n, b + 12); }
    }
    // The tip's cap: one vertex past the last ring.
    const tip = o + perArm - 1, last = o + (RINGS - 1) * (SIDES + 1); colr.set([VENTRAL.r, VENTRAL.g, VENTRAL.b], tip * 3); for (let j = 0; j < SIDES; j++) idx.push(last + j, last + j + 1, tip);
  }
  const armGeo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage), norAttr = new THREE.BufferAttribute(nor, 3).setUsage(THREE.DynamicDrawUsage);
  armGeo.setAttribute('position', posAttr); armGeo.setAttribute('normal', norAttr); armGeo.setAttribute('color', new THREE.BufferAttribute(colr, 3)); armGeo.setIndex(idx);
  armGeo.boundingSphere = new THREE.Sphere(v3(0, 1, 0), 4.5);
  const armMesh = new THREE.Mesh(armGeo, hide); armMesh.castShadow = true; group.add(armMesh);
  // Detail by distance: the arms are rebuilt every frame up close, less often far off (LOD_M), and seldom while it is off screen (the render tells us where the camera was).
  let camDist = 0, seen = true, frame = 0; const camAt = v3();
  armMesh.onBeforeRender = (_r, _s, cam) => { seen = true; camDist = cam.getWorldPosition(camAt).distanceTo(tmpW.setFromMatrixPosition(armMesh.matrixWorld)); };
  const tmpW = v3();

  // Ichor: drops of glowing green that fall from the arms and the beak and lie a moment as a stain.
  const ichorMat = new THREE.MeshBasicMaterial({ color: '#9cff3a', transparent: true, opacity: 0.9, depthWrite: false }), dropGeo = new THREE.SphereGeometry(0.022, 6, 4);
  const drops = Array.from({ length: 12 }, () => { const m = new THREE.Mesh(dropGeo, ichorMat.clone()); m.visible = false; group.add(m); return { m, vy: 0, life: 0, landed: false }; });
  let dropClock = 0;

  // State the poses ease toward and the clocks they run on.
  const w = { open: 0, flat: 0, sprawl: 0, feed: 0, rear: 0, glitch: 0 };
  const spasm = new Float32Array(ARMS); let phase = 0, speed = 0, lastX = NaN, lastZ = NaN, clock = 0, deadFor = 0, crawl = 0;
  let windup: DyAttack | null = null, act: { kind: DyAttack; t: number } | null = null;
  const sprawlDir = Array.from({ length: ARMS }, (_, a) => (a / ARMS) * Math.PI * 2 + (rand() - 0.5) * 0.5);
  const idle = { arm: -1, t: 0, next: 2 + rand() * 3 };

  // Scratch.
  const M = new THREE.Matrix4(), Mb = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), tmp = v3(), tmp2 = v3(), tmp3 = v3(), bend = v3(), up = v3(0, 1, 0);
  const crownW = v3(), crownNW = v3(), baseW = Array.from({ length: ARMS }, () => v3()), exitW = Array.from({ length: ARMS }, () => v3()), radialW = Array.from({ length: ARMS }, () => v3());
  const head = new THREE.Matrix4(), trunk = new THREE.Matrix4(), feet = Array.from({ length: 4 }, () => v3());

  /** The body's pose: the goat's trunk (rearing about the hips, pitching into the butt, bowed to feed, bobbing), the mantle on it, and the open, flat and dead poses blended over it by weight. */
  function placeBody(bob: number): void {
    const butt = act?.kind === 'butt' ? act.t / ATTACK_S.butt : -1, slam = butt >= 0 ? Math.sin(Math.min(1, butt / 0.35) * Math.PI * 0.5) * (1 - smooth((butt - 0.4) / 0.6)) : 0;
    const pitchG = w.rear * 0.42 - slam * 0.2 - w.feed * 0.22;
    trunk.makeTranslation(-0.86, 0.84 + BODY_LIFT + bob - w.feed * 0.08, 0).multiply(M.makeRotationZ(pitchG)).multiply(M.makeTranslation(0.86, -0.84 - BODY_LIFT, 0));
    tmp.set(-0.12, 1.08 + BODY_LIFT, 0).applyMatrix4(trunk);
    let px = tmp.x, py = tmp.y, pitchT = pitchG, roll = 0, sy = 1; const pz = 0;
    const o = w.open, f = w.flat, d = w.sprawl;
    // Open: the mantle lifts and tips back so the beak faces her: the octopus standing on its arms.
    px = THREE.MathUtils.lerp(px, -0.35, o); py = THREE.MathUtils.lerp(py, 1.35, o); pitchT = THREE.MathUtils.lerp(pitchT, 0.75, o);
    // Flat: pressed to the ground, the sac behind, nose down a touch, rocking as it rows.
    px = THREE.MathUtils.lerp(px, -0.45, f); py = THREE.MathUtils.lerp(py, 0.36 + Math.sin(crawl * Math.PI * 2) * 0.03, f); pitchT = THREE.MathUtils.lerp(pitchT, -0.08, f); roll += Math.sin(crawl * Math.PI) * 0.06 * f;
    // Dead: slumped and slack, rolled a little.
    px = THREE.MathUtils.lerp(px, -0.3, d); py = THREE.MathUtils.lerp(py, 0.26, d); pitchT = THREE.MathUtils.lerp(pitchT, -0.12, d); roll = THREE.MathUtils.lerp(roll, 0.35, d); sy = 1 - 0.3 * d;
    // It breathes: the mantle swells and the siphon pulses.
    const breath = 1 + Math.sin(clock * (1.6 + w.glitch * 3)) * 0.025 * (1 - d * 0.8);
    body.position.set(px, py, pz); body.rotation.set(roll, 0, pitchT); body.scale.set(breath, breath * sy, breath);
    siphon.scale.setScalar(1 + Math.max(0, Math.sin(clock * 1.6)) * 0.25);
    body.updateMatrix(); Mb.copy(body.matrix);
    // The ring, and where each arm leaves it, in the figure's frame.
    crownW.copy(crown).applyMatrix4(Mb); crownNW.copy(crownN).transformDirection(Mb);
    for (let a = 0; a < ARMS; a++) {
      const ang = RING_ANGLE[a], s = side(a);
      radialW[a].copy(crownD).multiplyScalar(Math.cos(ang)).addScaledVector(crownZ, Math.sin(ang) * s).transformDirection(Mb);
      baseW[a].copy(crownW).addScaledVector(radialW[a], CROWN_R);
      exitW[a].copy(crownNW).multiplyScalar(0.55).addScaledVector(radialW[a], 0.85).normalize();
    }
  }

  /** The goat: the gait's feet, the legs solved to them, the head folded on its neck. Writes every arm's `pts`. */
  function goat(): void {
    const trot = speed > TROT_FROM, stride = trot ? STRIDE_TROT : STRIDE_WALK, duty = trot ? 0.5 : 0.65, lift = trot ? 0.17 : 0.11;
    // Lateral walk: LH, LF, RH, RF a quarter apart. Trot: diagonals together.
    const offs = trot ? [0.5, 0, 0, 0.5] : [0.25, 0.75, 0, 0.5]; // fore L, fore R, hind L, hind R
    const gaitOn = Math.min(1, speed / 0.3) * (1 - w.feed * 0.7);
    const NEUTRAL = [[0.6, -0.2], [0.6, 0.2], [-0.92, -0.23], [-0.92, 0.23]];
    for (let l = 0; l < 4; l++) {
      const ph = (((phase + offs[l]) % 1) + 1) % 1, h = stride * 0.5 * gaitOn;
      let fx: number, fy: number;
      if (ph < duty) { fx = h - (ph / duty) * 2 * h; fy = 0; } else { const k = (ph - duty) / (1 - duty); fx = -h + smooth(k) * 2 * h; fy = Math.sin(k * Math.PI) * lift * gaitOn; }
      feet[l].set(NEUTRAL[l][0] + fx, fy, NEUTRAL[l][1]);
    }
    // Feeding it splays its forelegs to lower its chest; rearing lifts and tucks them.
    const rear = w.rear;
    const T = (x: number, y: number, z: number, out: THREE.Vector3): THREE.Vector3 => out.set(x, y + BODY_LIFT, z).applyMatrix4(trunk);
    for (let l = 0; l < 2; l++) { feet[l].z *= 1 + w.feed * 0.8; feet[l].x += w.feed * 0.12; if (rear > 0.001) feet[l].lerp(T(0.74, 0.3, feet[l].z, tmp), rear); }
    for (let a = 0; a < ARMS; a++) {
      const P = arms[a].pts, s = side(a), B = baseW[a];
      P[0].copy(B); P[1].copy(B).addScaledVector(exitW[a], 0.09);
      if (isFore(a)) {
        const F = feet[a - 4];
        T(0.68, 0.74, s * 0.2, P[2]); T(0.6, 0.5, s * 0.22, P[3]);
        P[5].set(F.x - 0.01, F.y + 0.13, F.z); bend.set(1, 0.15, 0).normalize();
        if (rear > 0.01) bend.set(1, -0.4 * rear, 0).normalize();
        knee(P[3], P[5], 0.2, 0.2, bend, P[4]);
        P[6].copy(F); P[7].set(F.x + 0.08, F.y + 0.02, F.z); P[8].set(F.x + 0.05, F.y + 0.07, F.z);
      } else if (isHind(a)) {
        const F = feet[a - 4];
        T(0.25, 0.72, s * 0.14, P[2]); T(-0.35, 0.7, s * 0.15, P[3]); T(-0.98, 0.86, s * 0.25, P[4]);
        P[6].set(F.x - 0.15, F.y + 0.38, F.z); bend.set(1, 0, 0);
        knee(P[4], P[6], 0.33, 0.34, bend, P[5]);
        P[7].set(F.x - 0.02, F.y + 0.12, F.z); P[8].copy(F); P[9].set(F.x + 0.08, F.y + 0.02, F.z); P[10].set(F.x + 0.05, F.y + 0.07, F.z);
      } else {
        // The neck runs from the top of the ring to the poll; the head's points are in the head's own frame (x along the face, y up), set on the poll.
        const lane = a < 2 ? 0.06 : 0.12, nk0 = T(0.6, 1.24, 0, tmp2), poll = tmp3.set(0, 0, 0).applyMatrix4(head);
        P[2].copy(nk0).lerp(poll, 0.3).add(tmp.set(0.03, 0, s * lane));
        P[3].copy(nk0).lerp(poll, 0.72).add(tmp.set(-0.02, 0, s * lane * 0.9));
        // The face's points are in the head's frame (x down the face to the muzzle, y off the brow); the horns' and ears' in the world's, turned into it (Hw) so they stand back over the neck whatever the head does.
        const H = (i: number, x: number, y: number, z: number): void => { P[i].set(x, y, z).applyMatrix4(head); };
        const Hw = (i: number, x: number, y: number, z: number): void => { const c = Math.cos(-HEAD_PITCH), sn = Math.sin(-HEAD_PITCH); H(i, x * c - y * sn, x * sn + y * c, z); };
        if (a < 2) {
          // Down the throat, along the jaw to the muzzle, folded back over the nose and brow, out of the poll as a horn sweeping back and down.
          H(4, 0.04, -0.17, s * 0.06); H(5, 0.36, -0.13, s * 0.05); H(6, 0.55, -0.04, s * 0.04); H(7, 0.42, 0.06, s * 0.065); H(8, 0.16, 0.09, s * 0.08); H(9, 0.0, 0.1, s * 0.1);
          const writhe = clock * 0.9 + a * 2.1, cw = Math.sin(writhe) * 0.04 * (1 - w.rear);
          Hw(10, -0.06, 0.2, s * 0.12); Hw(11, -0.24, 0.34, s * 0.17); Hw(12, -0.46, 0.33 + cw, s * (0.22 + cw)); Hw(13, -0.6, 0.15 + cw * 1.5, s * (0.25 + Math.cos(writhe) * 0.03));
        } else {
          // Round the jaw and along the cheek, folded at its front, back along it, out at the temple as a drooping ear.
          H(4, 0.02, -0.12, s * 0.12); H(5, 0.28, -0.12, s * 0.1); H(6, 0.4, -0.06, s * 0.09); H(7, 0.28, 0.0, s * 0.115); H(8, 0.1, 0.04, s * 0.125); H(9, 0.02, 0.06, s * 0.16);
          const twitch = idle.arm === a ? Math.sin(idle.t * 18) * 0.12 * Math.sin(Math.min(1, idle.t) * Math.PI) : 0;
          Hw(10, -0.04, 0.02 + twitch, s * 0.3); Hw(11, 0.0, -0.08 + twitch * 1.5, s * 0.4);
        }
      }
    }
  }

  /** The head's frame (on the poll; x along the face): set on the neck, nodding as it walks, turned down into a butt, lowered to feed. */
  function placeHead(): void {
    const butt = act?.kind === 'butt' ? act.t / ATTACK_S.butt : -1, duck = butt >= 0 ? Math.sin(clamp01(butt / 0.3) * Math.PI * 0.5) * (1 - smooth((butt - 0.45) / 0.55)) : 0;
    const nod = Math.sin(phase * Math.PI * 4) * 0.05 * Math.min(1, speed), look = Math.sin(clock * 0.37) * 0.25 * (1 - w.rear) * (1 - Math.min(1, speed));
    const pitch = HEAD_PITCH + nod + w.rear * 0.45 - duck * 0.85 - w.feed * 0.7;
    tmp.set(1.04 + duck * 0.18 + w.feed * 0.15, 1.74 + BODY_LIFT - duck * 0.22 - w.feed * 0.6, 0).applyMatrix4(trunk);
    e3.set(0, look, pitch, 'YXZ'); q.setFromEuler(e3); head.compose(tmp, q, tmp2.set(1, 1, 1));
  }

  /** An arm laid toward a point: out of the ring, arcing up and over to `T`, the last of it curling by `curl`. Writes `out` (k points). */
  function reach(a: number, T: THREE.Vector3, lift: number, curl: number, out: THREE.Vector3[]): void {
    const k = arms[a].k, B = baseW[a], c1 = tmp.copy(B).addScaledVector(exitW[a], 0.5).addScaledVector(up, lift * 0.5), c2 = tmp2.copy(T).addScaledVector(up, lift);
    for (let i = 0; i < k; i++) {
      const u = i / (k - 1), m = 1 - u;
      out[i].set(0, 0, 0).addScaledVector(B, m * m * m).addScaledVector(c1, 3 * m * m * u).addScaledVector(c2, 3 * m * u * u).addScaledVector(T, u * u * u);
      if (u > 0.7) { const cu = (u - 0.7) / 0.3; out[i].y -= Math.sin(cu * Math.PI) * curl * 0.2; out[i].x -= cu * cu * curl * 0.25; }
    }
  }

  /** The octopus open: the support arms splayed out to the ground and along it, the head's arms raised and fanned toward her, every tip curling. */
  function open(a: number, out: THREE.Vector3[]): void {
    const k = arms[a].k, L = arms[a].rest * 0.92, s = side(a), B = baseW[a];
    for (let i = 0; i < k; i++) {
      const u = i / (k - 1), hd = L * u * 0.8, wv = Math.sin(clock * 3 + u * 6 + a) * 0.15 * u, tip = Math.max(0, (u - 0.78) / 0.22);
      if (isHead(a)) {
        const fan = (a < 2 ? 0.3 : 0.85) * s, lift = a < 2 ? 0.75 : 0.35;
        out[i].set(B.x + Math.cos(fan) * hd - tip * tip * 0.3, B.y + L * lift * Math.sin(u * Math.PI * 0.55) + tip * 0.3 + wv, B.z + Math.sin(fan) * hd + wv * s);
      } else {
        const ang = (isFore(a) ? 0.8 : 2.25) * s;
        out[i].set(B.x + Math.cos(ang) * (hd - tip * tip * 0.25), 0.05 + (B.y - 0.05) * (1 - smooth(u / 0.4)) + tip * 0.35 + Math.abs(wv) * 0.4, B.z + Math.sin(ang) * (hd - tip * tip * 0.25));
      }
    }
  }

  /** Flat on the ground, rowing: every arm splayed forward and out, reaching and hauling in turn. */
  function flat(a: number, out: THREE.Vector3[]): void {
    const k = arms[a].k, L = arms[a].rest * 0.95, ang0 = (a < 2 ? 0.25 : a < 4 ? 0.7 : a < 6 ? 1.25 : 1.9) * side(a);
    const pull = Math.sin((crawl + (a % 2) * 0.5 + (a >> 1) * 0.25) * Math.PI * 2), ang = ang0 + pull * 0.35 * side(a);
    for (let i = 0; i < k; i++) {
      const u = i / (k - 1), d = L * u * (0.85 + pull * 0.1);
      const sw = Math.sin(u * 7 - crawl * 8 + a) * 0.14 * u, c = Math.cos(ang), sn = Math.sin(ang);
      out[i].set(crownW.x + c * d * 0.95 - sn * sw, 0.05 + (1 - smooth(u * 3)) * (crownW.y - 0.05) + Math.max(0, Math.sin(u * Math.PI * 2 - crawl * 9)) * 0.04, crownW.z + sn * d + c * sw);
      // The tips curl back as they haul.
      if (u > 0.75) { const cu = (u - 0.75) / 0.25; out[i].x -= cu * cu * 0.25 * (1 - pull); out[i].y += cu * 0.06; }
    }
  }

  /** Dead: the arms fall open round it on the ground, slack, a last writhing running out, each tip coiled on itself. Walked out from the ring a step at a time, turning as it goes. */
  function sprawl(a: number, out: THREE.Vector3[]): void {
    const k = arms[a].k, L = arms[a].rest * 0.75, life = Math.exp(-deadFor * 0.8), sg = a % 2 ? 1 : -1;
    let x = crownW.x, z = crownW.z, h = sprawlDir[a];
    for (let i = 0; i < k; i++) {
      const u = i / (k - 1), coil = Math.max(0, u - 0.6) / 0.4;
      if (i > 0) { const step = (L / (k - 1)) * (1 - coil * 0.45); h += (Math.sin(u * 4 + a) * 0.25 + coil * 0.9 * sg + Math.sin(clock * 4 + u * 7 + a) * 0.2 * life * u); x += Math.cos(h) * step; z += Math.sin(h) * step; }
      out[i].set(x, 0.04 + (1 - smooth(u * 4)) * (crownW.y - 0.04), z);
    }
  }

  /** Lay `src` over arm a's points by weight `W`, opening from the base out, with a writhe while it is half way. */
  function layer(a: number, src: THREE.Vector3[], W: number): void {
    if (W <= 0.001) return;
    const P = arms[a].pts, k = arms[a].k, mid = 4 * W * (1 - W);
    for (let i = 0; i < k; i++) {
      const u = i / (k - 1), wi = smooth(W * (1 + UNROLL) - UNROLL * u);
      if (wi <= 0) continue;
      P[i].lerp(src[i], wi);
      if (mid > 0.01 && i > 1) { const wv = Math.sin(u * 9 - clock * 11 + a) * 0.1 * mid * u; P[i].y += wv; P[i].z += wv * side(a); }
    }
  }

  /** Sample the control points into rings: a Catmull-Rom through them, resampled evenly by length; frames carried along it so the suckers keep their side. */
  function rings(a: number): void {
    const A = arms[a], P = A.pts, k = A.k, D = A.dense, sub = 6;
    let n = 0;
    for (let s = 0; s < k - 1; s++) {
      const p0 = P[Math.max(0, s - 1)], p1 = P[s], p2 = P[s + 1], p3 = P[Math.min(k - 1, s + 2)];
      for (let j = 0; j < sub; j++) {
        const t = j / sub, t2 = t * t, t3 = t2 * t;
        D[n++].set(0, 0, 0).addScaledVector(p0, -0.5 * t3 + t2 - 0.5 * t).addScaledVector(p1, 1.5 * t3 - 2.5 * t2 + 1).addScaledVector(p2, -1.5 * t3 + 2 * t2 + 0.5 * t).addScaledVector(p3, 0.5 * t3 - 0.5 * t2);
      }
    }
    D[n++].copy(P[k - 1]);
    A.cum[0] = 0; for (let i = 1; i < n; i++) A.cum[i] = A.cum[i - 1] + D[i].distanceTo(D[i - 1]);
    const L = A.cum[n - 1]; A.length = L; let seg = 1;
    for (let r = 0; r < RINGS; r++) {
      const target = (r / (RINGS - 1)) * L; while (seg < n - 1 && A.cum[seg] < target) seg++;
      const l0 = A.cum[seg - 1], l1 = A.cum[seg], f = l1 > l0 ? (target - l0) / (l1 - l0) : 0; A.ring[r].lerpVectors(D[seg - 1], D[seg], f);
    }
    // Tangents, then a frame carried by parallel transport from the base, the sucker side (nrm) starting toward the arm's inner side.
    for (let r = 0; r < RINGS; r++) { const p = A.ring[Math.max(0, r - 1)], nx = A.ring[Math.min(RINGS - 1, r + 1)]; A.tan[r].subVectors(nx, p).normalize(); }
    const n0 = A.nrm[0]; if (isHead(a)) n0.set(0, -1, 0); else { n0.copy(crownW).sub(A.ring[0]); n0.y -= 0.6; } n0.addScaledVector(A.tan[0], -n0.dot(A.tan[0])).normalize();
    if (n0.lengthSq() < 0.5) n0.set(0, 0, 1).addScaledVector(A.tan[0], -A.tan[0].z).normalize();
    for (let r = 1; r < RINGS; r++) { const nr = A.nrm[r].copy(A.nrm[r - 1]); nr.addScaledVector(A.tan[r], -nr.dot(A.tan[r])); const l = nr.length(); if (l < 1e-4) nr.copy(A.nrm[r - 1]); else nr.multiplyScalar(1 / l); }
    for (let r = 0; r < RINGS; r++) A.bin[r].crossVectors(A.tan[r], A.nrm[r]);
    // Radius: tapering to a fine tip, bunched where the goat's limbs are thick (less as the arm opens), thinner as it stretches.
    const goatness = 1 - Math.max(w.open, w.flat, w.sprawl, spasm[a]), stretch = Math.min(1.3, Math.max(0.75, Math.sqrt(A.rest / Math.max(0.3, L))));
    const [bu, bw, ba] = BUNCH[a];
    for (let r = 0; r < RINGS; r++) { const u = r / (RINGS - 1); A.rad[r] = R0[a] * (0.12 + 0.88 * Math.pow(1 - u, TAPER[a])) * (1 + ba * goatness * Math.exp(-((u - bu) ** 2) / (bw * bw))) * stretch; }
  }

  /** Write arm a's tube, suckers and cap into the buffers. */
  function writeArm(a: number): void {
    const A = arms[a], o = a * perArm;
    for (let r = 0; r < RINGS; r++) {
      const p = A.ring[r], N = A.nrm[r], Bn = A.bin[r], rad = A.rad[r];
      for (let j = 0; j <= SIDES; j++) {
        const th = (j / SIDES) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th), v = (o + r * (SIDES + 1) + j) * 3;
        const nx = N.x * c + Bn.x * s, ny = N.y * c + Bn.y * s, nz = N.z * c + Bn.z * s;
        pos[v] = p.x + nx * rad; pos[v + 1] = p.y + ny * rad; pos[v + 2] = p.z + nz * rad; nor[v] = nx; nor[v + 1] = ny; nor[v + 2] = nz;
      }
    }
    // Suckers in two rows, staggered, from near the base to the tip, cupped and facing out of the arm's sucker side.
    for (let s = 0; s < SUCKERS * 2; s++) {
      const row = s % 2, u = 0.07 + ((Math.floor(s / 2) + row * 0.5) / SUCKERS) * 0.9, fr = u * (RINGS - 1), r0 = Math.floor(fr), r1 = Math.min(RINGS - 1, r0 + 1), f = fr - r0;
      const ang = (row ? 1 : -1) * 0.55, ca = Math.cos(ang), sa = Math.sin(ang);
      const N = tmp.copy(arms[a].nrm[r0]).lerp(arms[a].nrm[r1], f), Bn = tmp2.copy(arms[a].bin[r0]).lerp(arms[a].bin[r1], f), T = tmp3.copy(arms[a].tan[r0]).lerp(arms[a].tan[r1], f).normalize();
      const dx = N.x * ca + Bn.x * sa, dy = N.y * ca + Bn.y * sa, dz = N.z * ca + Bn.z * sa, rad = A.rad[r0] * (1 - f) + A.rad[r1] * f, rho = rad * 0.46;
      const cx = A.ring[r0].x * (1 - f) + A.ring[r1].x * f + dx * rad * 0.9, cy = A.ring[r0].y * (1 - f) + A.ring[r1].y * f + dy * rad * 0.9, cz = A.ring[r0].z * (1 - f) + A.ring[r1].z * f + dz * rad * 0.9;
      // e2 = d × T, the sucker's other axis.
      const ex = dy * T.z - dz * T.y, ey = dz * T.x - dx * T.z, ez = dx * T.y - dy * T.x, b = o + tubeVerts + s * suckerVerts;
      for (let j = 0; j < 6; j++) {
        const ph = (j / 6) * Math.PI * 2, cc = Math.cos(ph), ss = Math.sin(ph), rx = T.x * cc + ex * ss, ry = T.y * cc + ey * ss, rz = T.z * cc + ez * ss;
        let v = (b + j) * 3; pos[v] = cx + rx * rho + dx * rho * 0.3; pos[v + 1] = cy + ry * rho + dy * rho * 0.3; pos[v + 2] = cz + rz * rho + dz * rho * 0.3; nor[v] = rx * 0.6 + dx; nor[v + 1] = ry * 0.6 + dy; nor[v + 2] = rz * 0.6 + dz;
        v = (b + 6 + j) * 3; pos[v] = cx + rx * rho * 0.6 + dx * rho * 0.42; pos[v + 1] = cy + ry * rho * 0.6 + dy * rho * 0.42; pos[v + 2] = cz + rz * rho * 0.6 + dz * rho * 0.42; nor[v] = -rx * 0.5 + dx; nor[v + 1] = -ry * 0.5 + dy; nor[v + 2] = -rz * 0.5 + dz;
      }
      const v = (b + 12) * 3; pos[v] = cx - dx * rho * 0.15; pos[v + 1] = cy - dy * rho * 0.15; pos[v + 2] = cz - dz * rho * 0.15; nor[v] = dx; nor[v + 1] = dy; nor[v + 2] = dz;
    }
    const tip = (o + perArm - 1) * 3, last = A.ring[RINGS - 1], T = A.tan[RINGS - 1], rad = A.rad[RINGS - 1];
    pos[tip] = last.x + T.x * rad; pos[tip + 1] = last.y + T.y * rad; pos[tip + 2] = last.z + T.z * rad; nor[tip] = T.x; nor[tip + 1] = T.y; nor[tip + 2] = T.z;
  }

  const scratch = Array.from({ length: 16 }, () => v3()), aim = v3();
  // The arms' rest lengths, read off the goat's own pose once.
  { placeBody(0); placeHead(); goat(); for (let a = 0; a < ARMS; a++) { rings(a); arms[a].rest = arms[a].length; } }

  function pickAttack(): DyAttack { let r = rand(); for (const [k, p] of ATTACK_ODDS) { if ((r -= p) <= 0) return k; } return 'butt'; }

  function update(x: number, z: number, s: DyState, dtIn: number): void {
    const dt = Math.min(0.1, Math.max(0, dtIn)); clock += dt;
    // The gait's pace from how far it moved (the model moves it; the figure only reads it).
    if (!Number.isNaN(lastX) && dt > 0) { const d = Math.hypot(x - lastX, z - lastZ); speed = ease(speed, d > 0.5 ? speed : d / dt, 8, dt); }
    lastX = x; lastZ = z; if (!s.moving) speed = ease(speed, 0, 6, dt);
    const alive = s.dead <= 0; deadFor = alive ? 0 : s.dead;
    phase += (speed * dt) / (speed > TROT_FROM ? STRIDE_TROT : STRIDE_WALK) * (s.flat ? 0 : 1); crawl += s.flat ? dt * (0.6 + speed * 0.5) : 0;
    // The wind-up: chosen as the tell begins, shown as it rises.
    if (s.tell > 0 && !windup && !act) windup = pickAttack();
    if (s.tell <= 0 && !act) windup = null;
    if (act) { act.t += dt; if (act.t > ATTACK_S[act.kind]) act = null; }
    const tellButt = windup === 'butt' || (!windup && s.tell > 0) ? s.tell : 0;
    w.rear = ease(w.rear, alive && !s.flat ? Math.max(tellButt, act?.kind === 'butt' ? Math.max(0, 1 - act.t / 0.15) : 0) : 0, 14, dt);
    w.feed = ease(w.feed, alive && s.feed && !act ? 1 : 0, 2.5, dt);
    w.flat = ease(w.flat, alive && s.flat ? 1 : 0, 3, dt);
    w.sprawl = ease(w.sprawl, alive ? 0 : 1, 2.2, dt);
    w.glitch = ease(w.glitch, s.rooted > 0 && alive ? 1 : 0, 4, dt);
    w.open = ease(w.open, 0, 3, dt);
    for (let a = 0; a < ARMS; a++) spasm[a] = Math.max(0, spasm[a] - dt * 2.2);
    // Held by the roots it strains: arms tear half loose and fold back, one after another.
    if (s.rooted > 0 && alive && rand() < dt * 2.5) spasm[Math.floor(rand() * ARMS)] = 0.55 + rand() * 0.3;
    // Idle, now and then an ear or a hoof's tip uncurls and tastes the air.
    idle.next -= dt; if (idle.arm >= 0) { idle.t += dt; if (idle.t > 1.4) idle.arm = -1; } else if (idle.next <= 0 && speed < 0.2 && alive) { idle.arm = [2, 3, 4, 5][Math.floor(rand() * 4)]; idle.t = 0; idle.next = 3 + rand() * 5; }

    const bob = -Math.abs(Math.sin(phase * Math.PI * 2)) * 0.03 * Math.min(1, speed);
    placeBody(bob);
    placeHead(); goat();

    // The attacks: reaches laid over the goat.
    if (act && act.kind !== 'butt') {
      const k = act.t / ATTACK_S[act.kind], out = smooth(k / 0.22) * (1 - smooth((k - 0.55) / 0.45));
      if (act.kind === 'lash') for (let a = 0; a < 4; a++) { const s2 = side(a), wr = Math.sin(clock * 9 + a * 1.7) * 0.15, T = aim.set(a < 2 ? REACH_M : REACH_M - 0.5, (a < 2 ? 1.9 : 0.85) + wr, s2 * (a < 2 ? 0.45 : 1.15) + wr); reach(a, T, a < 2 ? 0.7 : 0.3, out, scratch); layer(a, scratch, out); }
      else { const a = 5, T = aim.set(REACH_M + 0.2, 0.75 + Math.sin(k * Math.PI) * 0.2, 0.15); if (k > 0.5) T.lerp(crownW, smooth((k - 0.5) / 0.5) * 0.7); reach(a, T, 0.35, smooth((k - 0.3) / 0.3), scratch); layer(a, scratch, out); }
    } else if (windup && windup !== 'butt' && s.tell > 0 && alive) {
      // Its tell for an unfolding: the seams of the face (or the hoof) begin to come apart.
      const arm = windup === 'lash' ? [0, 1, 2, 3] : [5];
      for (const a of arm) spasm[a] = Math.max(spasm[a], s.tell * 0.28 + Math.sin(clock * 30 + a) * 0.04);
    }
    // Feeding: the face comes apart onto the ground before it, the arms drawing in turn to the beak.
    if (w.feed > 0.01) for (let a = 0; a < 4; a++) {
      const ph = (Math.sin(clock * 1.7 + a * 1.6) + 1) / 2, s2 = side(a), T = aim.set(1.6 + (a < 2 ? 0.25 : 0), 0.04, s2 * (a < 2 ? 0.3 : 0.75)).lerp(crownW, ph * 0.75);
      reach(a, T, 0.25 * (1 - ph), 0.6, scratch); layer(a, scratch, w.feed);
    }
    // The disguise shaken loose: an arm's weight toward the open pose.
    for (let a = 0; a < ARMS; a++) { const W = Math.max(w.open, spasm[a]); if (W > 0.001) { open(a, scratch); layer(a, scratch, W); } }
    if (w.flat > 0.001) for (let a = 0; a < ARMS; a++) { flat(a, scratch); layer(a, scratch, w.flat); }
    if (w.sprawl > 0.001) for (let a = 0; a < ARMS; a++) { sprawl(a, scratch); layer(a, scratch, w.sprawl); }
    const every = !seen ? 8 : camDist > LOD_M[1] ? 4 : camDist > LOD_M[0] ? 2 : 1; seen = false;
    if (++frame % every === 0) { for (let a = 0; a < ARMS; a++) { rings(a); writeArm(a); } posAttr.needsUpdate = true; norAttr.needsUpdate = true; }

    // The beak opens when the face does, and chews as it feeds.
    const gape = Math.min(1, Math.max(w.open, w.feed * (0.4 + 0.4 * Math.sin(clock * 6)), act && act.kind !== 'butt' ? 0.9 : 0, w.sprawl * 0.5, Math.max(...spasm) * 0.8));
    mandibles.forEach((m, i) => { const h = (m as THREE.Mesh & { hinge?: THREE.Group }).hinge!; h.rotation.x = (i ? -1 : 1) * gape * 0.5; });
    // The eyes flare in its tell and roll with its pain; dead they go dim.
    const flare = 1 + s.tell * 0.6 + w.glitch * 0.2 * Math.sin(clock * 20);
    for (const e of eyes) e.scale.setScalar(alive ? flare : Math.max(0.6, 1 - deadFor * 0.1));
    eyeMat.color.setRGB(alive ? 0.7 : 0.25, alive ? 0.8 : 0.3, alive ? 0.12 : 0.1);

    // Ichor: drips from a sucker side or the beak, more when it bleeds or gapes.
    dropClock -= dt * (1 + gape * 4 + w.glitch * 3);
    if (dropClock <= 0 && deadFor < 6) {
      dropClock = 0.35 + rand() * 0.5; const d = drops.find(x => x.life <= 0);
      if (d) { const a = Math.floor(rand() * ARMS), r = Math.floor(rand() * RINGS * 0.8) + 2, A = arms[a], at = rand() < 0.3 ? crownW : A.ring[Math.min(RINGS - 1, r)]; d.m.position.copy(at).addScaledVector(rand() < 0.3 ? crownNW : A.nrm[Math.min(RINGS - 1, r)], 0.05); d.vy = 0; d.life = 2.6; d.landed = false; d.m.visible = true; d.m.scale.set(1, 1.6, 1); }
    }
    for (const d of drops) {
      if (d.life <= 0) continue; d.life -= dt; const mat = d.m.material as THREE.MeshBasicMaterial;
      if (!d.landed) { d.vy -= 9.8 * dt; d.m.position.y += d.vy * dt; if (d.m.position.y <= 0.01) { d.landed = true; d.m.position.y = 0.01; d.m.scale.set(2.6, 0.15, 2.6); } }
      mat.opacity = Math.min(0.9, d.life * 0.7); if (d.life <= 0) d.m.visible = false;
    }
    // Dead long enough, it sinks into the ground.
    group.position.y -= Math.max(0, s.dead - 5) * 0.12;
  }

  return {
    group, hide, update,
    prepare(kind: DyAttack): void { if (!act) windup = kind; },
    attack(kind?: DyAttack): void { act = { kind: kind ?? windup ?? pickAttack(), t: 0 }; windup = null; },
    flinch(power: number): void {
      const n = power >= 1.5 ? ARMS : 2 + Math.floor(rand() * 2);
      for (let i = 0; i < n; i++) { const a = Math.floor(rand() * ARMS); spasm[a] = Math.max(spasm[a], Math.min(0.9, 0.35 + power * 0.25)); }
      if (power >= 1.5) w.open = Math.max(w.open, Math.min(1, 0.5 + power * 0.15));
    },
    get attacking() { return act?.kind ?? null; },
  };
}
