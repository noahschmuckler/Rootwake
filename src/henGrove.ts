// The hen's grove (Noah, 2026-11-01): a pair of trees near the Eden's cave, apart from the forest, where one hen-of-the-woods
// (henFigure.ts) lives its cycle on a loop, for the eye: it sits against one tree, strains and tears free (threads stretching and
// snapping, no bark torn), leaving a bare mycelial patch whose nub slowly inflates into a pillowy cushion; it walks to the other
// tree, where the cushion has grown, hoists the back of its gown, turns, backs on and sits; the cushion is absorbed and it grows a
// stage (thicker legs and bottom, more and fuller tiers). Three crossings from skinny to plump, then it tears free and stops midway.
// A hobbit comes from the hearth and kicks it onto its head (the dress falls, the bare legs kick), steps on the dress and pulls the
// meat piece out with a pop (a king oyster mushroom with a butt and legs), carries it home and cooks it at the fire and eats it.
// The flat dress lies still; two eyestalks pop up from its middle; a lanky stage-one hen in a miniskirt springs out, the old gown
// withers into the soil, and it runs to a budded tree to sit, and the cycle repeats. ECOLOGY.md "The hen's life"; HEN_LAB_BRIEF.md.
// Everything is driven by real seconds (not the Eden's ticks), so the whole cycle plays out in about three minutes.
import * as THREE from 'three';
import { createHen, createDress, createMeat, henFrame, type HenPose } from './henFigure';
import { createHobbit, hobbitLook, type HobbitPose } from './hobbitFigure';

export interface Vec2 { x: number; z: number }
// ---- Tuning ---------------------------------------------------------------------------------------------------------------------
/** The trunks' radius at the base (the vista's pines are about this), where the cushion sits out from it, where a hen stops to hoist. */
export const TRUNK_R = 0.32, SEAT_OUT = TRUNK_R + 0.16, APPROACH_OUT = TRUNK_R + 0.8;
/** The trees' spacing (m), and the grove's distance from the hearth (m). */
export const GROVE_GAP = 6.5, GROVE_FROM_HEARTH: [number, number] = [11, 19];
/** Seconds for a bare patch to inflate a full cushion; the cushion's height (m). */
export const CUSHION_S = 16, CUSHION_H = 0.09;
/** The hen's pace (m/s) lean and fat; the fresh runner's; the hobbit's. */
export const HEN_LEAN = 0.5, HEN_FAT = 0.24, HEN_RUN = 1.1, HOBBIT_PACE = 0.9;
/** Stages from the miniskirt (0) to plump (STAGES): each cushion absorbed is one. */
export const STAGES = 4;
/** Each beat's seconds. */
const BEAT = { hoist: 0.9, turn: 0.9, back: 1.1, sit: 0.7, absorb: 4.5, rest: 3, strain: 3.4, free: 0.6, flip: 0.9, flat: 2.4, eyes: 1.4, legs: 2.2, spring: 0.7, wilt: 7,
  kick: 0.7, step: 0.9, pull: 2.6, cook: 8, eat: 3.5 } as const;
// ----------------------------------------------------------------------------------------------------------------------------------
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const smooth = (t: number): number => { const k = clamp01(t); return k * k * (3 - 2 * k); };
const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
/** Figures face -z at heading 0: the heading that faces from `a` toward `b`. */
const toward = (a: Vec2, b: Vec2): number => Math.atan2(-(b.x - a.x), -(b.z - a.z));
const angleTo = (from: number, to: number, k: number): number => from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * k;

/** Where the grove goes: two trunks GROVE_GAP apart whose midpoint is GROVE_FROM_HEARTH from the hearth on the side away from the cave, the pair across the hobbit's line of approach, on level dry ground (`ok`) with no tree of the forest within `clear` m (`treeNear`). Null when nothing fits. */
export function chooseGrove(hearth: Vec2, caveDir: number, ok: (x: number, z: number) => boolean, height: (x: number, z: number) => number, treeNear: (x: number, z: number, r: number) => boolean, clear = 5): { a: Vec2; b: Vec2 } | null {
  const out = caveDir + Math.PI;
  for (const d of [13, 11, 15, 17, 19]) for (const da of [0.5, -0.5, 0.9, -0.9, 0.2, -0.2, 1.3, -1.3, 1.7, -1.7]) {
    const h = out + da, m = { x: hearth.x - Math.sin(h) * d, z: hearth.z - Math.cos(h) * d }, px = Math.cos(h), pz = -Math.sin(h);
    const a = { x: m.x + px * GROVE_GAP / 2, z: m.z + pz * GROVE_GAP / 2 }, b = { x: m.x - px * GROVE_GAP / 2, z: m.z - pz * GROVE_GAP / 2 };
    let good = true; const ya = height(a.x, a.z), yb = height(b.x, b.z);
    if (Math.abs(ya - yb) > 0.8) continue;
    for (let i = 0; i <= 10 && good; i++) { const t = i / 10, x = lerp(a.x, b.x, t), z = lerp(a.z, b.z, t); if (!ok(x, z) || Math.abs(height(x, z) - lerp(ya, yb, t)) > 0.35 || treeNear(x, z, clear)) good = false; }
    for (let i = 1; i < 6 && good; i++) { const t = i / 6, x = lerp(hearth.x, m.x, t), z = lerp(hearth.z, m.z, t); if (!ok(x, z)) good = false; }
    if (good) return { a, b };
  }
  return null;
}

/** A canvas of white mycelial threads radiating from a centre, alpha outside them: the patch's web. */
function webTexture(): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!; g.translate(64, 64); g.strokeStyle = 'rgba(246,242,230,0.85)'; g.lineCap = 'round';
  let s = 7; const r = (): number => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, len = 22 + r() * 40; g.lineWidth = 0.6 + r() * 1.2; g.beginPath(); g.moveTo(0, 0); let x = 0, y = 0, b = a; for (let k = 0; k < 6; k++) { b += (r() - 0.5) * 0.6; x += Math.cos(b) * len / 6; y += Math.sin(b) * len / 6; g.lineTo(x, y); } g.stroke(); }
  const grad = g.createRadialGradient(0, 0, 2, 0, 0, 30); grad.addColorStop(0, 'rgba(250,246,236,0.7)'); grad.addColorStop(1, 'rgba(250,246,236,0)'); g.fillStyle = grad; g.beginPath(); g.arc(0, 0, 30, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

type HenPhase = 'go' | 'hoist' | 'turn' | 'back' | 'sit' | 'absorb' | 'rest' | 'strain' | 'free' | 'mid' | 'wait' | 'flip' | 'kicking' | 'pulled' | 'flat' | 'eyes' | 'legs' | 'spring';
type HobbitPhase = 'idle' | 'go' | 'ready' | 'kick' | 'step' | 'pull' | 'carry' | 'cook' | 'eat';
export interface HenGroveState { hen: { phase: HenPhase; t: number; stage: number; f: number; tree: number; x: number; z: number }; hobbit: { phase: HobbitPhase; t: number; x: number; z: number }; cushions: number[]; loops: number }
export interface HenGrove { root: THREE.Group; trees: Vec2[]; update(dt: number, night: number): void; /** Dev: run the cycle forward `seconds` in small steps. */ skip(seconds: number): void; readonly state: HenGroveState; dispose(): void }

export function createHenGrove(scene: THREE.Scene, relief: (x: number, z: number) => number, hearth: Vec2, trees: [Vec2, Vec2], seed = 1): HenGrove {
  const root = new THREE.Group(); root.name = 'hen-grove'; scene.add(root);
  const geoms: THREE.BufferGeometry[] = [], mats: THREE.Material[] = [];
  const keep = <T extends THREE.BufferGeometry>(g: T): T => { geoms.push(g); return g; }, mat = <T extends THREE.Material>(m: T): T => { mats.push(m); return m; };
  const mid: Vec2 = { x: (trees[0].x + trees[1].x) / 2, z: (trees[0].z + trees[1].z) / 2 };
  /** Each tree's patch: on the ground at the trunk's foot on the side facing the other tree; the cushion's growth 0..1 and whether it grows. */
  const out = (i: number): Vec2 => { const o = trees[1 - i], t = trees[i], d = dist(o, t) || 1; return { x: (o.x - t.x) / d, z: (o.z - t.z) / d }; };
  const seatOf = (i: number): Vec2 => { const u = out(i); return { x: trees[i].x + u.x * SEAT_OUT, z: trees[i].z + u.z * SEAT_OUT }; };
  const approachOf = (i: number): Vec2 => { const u = out(i); return { x: trees[i].x + u.x * APPROACH_OUT, z: trees[i].z + u.z * APPROACH_OUT }; };
  // ── the patches: a web on the ground and up the bark, a nub that swells, a cushion with a dent ──
  const web = webTexture(); if (web) geoms.push(new THREE.BufferGeometry());
  const webMat = mat(new THREE.MeshBasicMaterial({ map: web, transparent: true, depthWrite: false, opacity: 0.75, side: THREE.DoubleSide, color: '#ffffff' }));
  const barkWebMat = mat(new THREE.MeshBasicMaterial({ map: web, transparent: true, depthWrite: false, opacity: 0.4, side: THREE.DoubleSide }));
  const creamMat = mat(new THREE.MeshStandardMaterial({ color: '#efe2c0', roughness: 0.85, flatShading: true, emissive: '#d8c49a', emissiveIntensity: 0 })), hullMat = mat(new THREE.MeshBasicMaterial({ color: '#22140a', side: THREE.BackSide }));
  // The cushion: a lathed pillow, rounded at the rim and dented in the middle (cushion-growth-stages.jpg's last panel).
  const pillow = keep(new THREE.LatheGeometry([[0.0, 0.62], [0.25, 0.66], [0.5, 0.8], [0.75, 0.94], [0.92, 0.86], [1.0, 0.55], [0.95, 0.22], [0.75, 0.04], [0.0, 0.0]].map(([x, y]) => new THREE.Vector2(x, y)), 18));
  const nubGeo = keep(new THREE.SphereGeometry(1, 12, 10));
  const patches = trees.map((_t, i) => {
    const u = out(i), s = seatOf(i), y = relief(s.x, s.z), g = new THREE.Group(); g.position.set(s.x, y, s.z); g.rotation.y = Math.atan2(u.x, u.z); root.add(g);
    const ground = new THREE.Mesh(keep(new THREE.CircleGeometry(0.42, 20)), webMat); ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0.012, -0.08); g.add(ground);
    // The web up the bark: a curved strip hugging the trunk behind the seat.
    const bark = new THREE.Mesh(keep(new THREE.CylinderGeometry(TRUNK_R + 0.012, TRUNK_R + 0.02, 0.3, 14, 1, true, -0.6, 1.2)), barkWebMat); bark.position.set(0, 0.15, -SEAT_OUT); bark.rotation.y = 0; g.add(bark);
    const nub = new THREE.Mesh(nubGeo, creamMat), nubHull = new THREE.Mesh(nubGeo, hullMat); nubHull.scale.setScalar(1.12); nubHull.renderOrder = -1; nub.add(nubHull); g.add(nub);
    const cushion = new THREE.Mesh(pillow, creamMat), cushHull = new THREE.Mesh(pillow, hullMat); cushHull.scale.set(1.06, 1.1, 1.06); cushHull.position.y = -0.02; cushHull.renderOrder = -1; cushion.add(cushHull); g.add(cushion);
    return { g, nub, cushion, ground, bark, grow: i === 1 ? 1 : 0, growing: i === 1 };
  });
  /** The patch's look by growth: a tiny nub on the web, swelling to a ball, then spreading and flattening into the dented cushion. */
  function drawPatch(i: number): void {
    const p = patches[i], g = p.grow;
    if (g < 0.45) { const r = g < 0.15 ? lerp(0.006, 0.016, g / 0.15) : lerp(0.016, 0.05, (g - 0.15) / 0.3); p.nub.visible = true; p.nub.scale.setScalar(r); p.nub.position.set(0, r * 0.85, 0); p.cushion.visible = false; }
    else { const k = (g - 0.45) / 0.55; p.nub.visible = false; p.cushion.visible = true; p.cushion.scale.set(lerp(0.06, 0.17, k), lerp(0.055, CUSHION_H, k), lerp(0.06, 0.15, k)); }
  }
  // ── the threads between the hen's back and the trunk: drawn while it sits (faint) and strains (taut), retracting when they snap ──
  const THREADS = 8, threadPos = new Float32Array(THREADS * 6), threadGeo = keep(new THREE.BufferGeometry()); threadGeo.setAttribute('position', new THREE.BufferAttribute(threadPos, 3));
  const threadMat = mat(new THREE.LineBasicMaterial({ color: '#f8f2e0', transparent: true, opacity: 0 })), threadLines = new THREE.LineSegments(threadGeo, threadMat); threadLines.frustumCulled = false; root.add(threadLines);
  // ── the hen, the hobbit, the piece it takes, the shed gown, the cooking fire ──
  const hen = createHen(seed); root.add(hen.group);
  const hob = createHobbit(hobbitLook(seed + 77, 3), seed * 7 + 5); root.add(hob.group);
  const piece = createMeat(seed + 1); piece.group.visible = false; root.add(piece.group);
  const stick = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.006, 0.008, 1, 5).translate(0, 0.5, 0)), mat(new THREE.MeshStandardMaterial({ color: '#6a4a2a', roughness: 1 }))); stick.visible = false; root.add(stick);
  const shed = createDress(seed + 2); shed.group.visible = false; root.add(shed.group); let shedT = -1; const shedAt: Vec2 = { x: 0, z: 0 };
  const fire = new THREE.Group(); fire.position.set(hearth.x, relief(hearth.x, hearth.z), hearth.z); fire.visible = false; root.add(fire);
  const flameMat = mat(new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff9a30').multiplyScalar(1.5), transparent: true, opacity: 0.85 })), flames: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(keep(new THREE.ConeGeometry(0.09 - i * 0.02, 0.28 + i * 0.08, 6)), flameMat); f.position.set((i - 1) * 0.06, 0.16, (i % 2) * 0.05); fire.add(f); flames.push(f); }
  const fireLight = new THREE.PointLight('#ffa040', 0, 6, 1.8); fireLight.position.y = 0.6; fire.add(fireLight);
  // ── the state ──
  const st: HenGroveState = { hen: { phase: 'rest', t: 0, stage: 1, f: 1 / STAGES, tree: 0, x: seatOf(0).x, z: seatOf(0).z }, hobbit: { phase: 'idle', t: 0, x: 0, z: 0 }, cushions: [0, 1], loops: 0 };
  const toGrove = ((): Vec2 => { const d = dist(hearth, mid) || 1; return { x: (mid.x - hearth.x) / d, z: (mid.z - hearth.z) / d }; })();
  const idleSpot: Vec2 = { x: hearth.x + toGrove.x * 1.7, z: hearth.z + toGrove.z * 1.7 }, cookSpot: Vec2 = { x: hearth.x + toGrove.x * 0.85, z: hearth.z + toGrove.z * 0.85 };
  const kickSpot: Vec2 = { x: mid.x - toGrove.x * 0.42, z: mid.z - toGrove.z * 0.42 }, stepSpot: Vec2 = { x: mid.x - toGrove.x * 0.3, z: mid.z - toGrove.z * 0.3 };
  st.hobbit.x = idleSpot.x; st.hobbit.z = idleSpot.z;
  let henHeading = toward(seatOf(0), trees[1]), hobHeading = toward(idleSpot, mid), henSpeed = 0, hobSpeed = 0, clock = 0, popFrom: THREE.Vector3 | null = null, popT = 0, bites = 1;
  const pose: HenPose = { f: st.hen.f, speed: 0, hoist: 0.45, sit: 1, seat: CUSHION_H, strain: 0, invert: 0, fall: 0, pull: 0, meat: true, legs: 1, eyes: 1, sunk: 0, lift: 0, night: 0 };
  const henPace = (): number => st.hen.stage === 0 ? HEN_RUN : lerp(HEN_LEAN, HEN_FAT, st.hen.f);
  /** A step toward `to` at `pace`; true on arrival. */
  const walk = (p: { x: number; z: number }, to: Vec2, pace: number, dt: number): boolean => { const d = dist(p, to); if (d < 0.02) return true; const m = Math.min(d, pace * dt); p.x += (to.x - p.x) / d * m; p.z += (to.z - p.z) / d * m; return d - m < 0.02; };
  const hset = (phase: HenPhase): void => { st.hen.phase = phase; st.hen.t = 0; };
  const bset = (phase: HobbitPhase): void => { st.hobbit.phase = phase; st.hobbit.t = 0; };

  function stepHen(dt: number): void {
    const h = st.hen; h.t += dt; const t = h.t, i = h.tree, seat = seatOf(i), app = approachOf(i);
    const facingTree = toward(app, trees[i]), facingOut = toward(seat, trees[1 - i]);
    pose.speed = 0; pose.strain = 0; pose.lift = 0; henSpeed = 0;
    switch (h.phase) {
      case 'go': { const from = { x: h.x, z: h.z }; if (walk(h, app, henPace(), dt)) hset('hoist'); henSpeed = henPace(); henHeading = angleTo(henHeading, toward(from, app), Math.min(1, dt * 8)); pose.speed = henSpeed; pose.hoist = 0; pose.sit = 0; break; }
      // The fresh runner flips its little skirt up briefly; the gowned one hoists the back of its gown, turns and backs on.
      case 'hoist': henHeading = angleTo(henHeading, facingTree, Math.min(1, dt * 6)); pose.hoist = smooth(t / BEAT.hoist); if (t >= BEAT.hoist) hset('turn'); break;
      case 'turn': henHeading = angleTo(facingTree, facingOut, smooth(t / BEAT.turn)); pose.hoist = 1; pose.speed = 0.1; if (t >= BEAT.turn) hset('back'); break;
      case 'back': { const k = smooth(t / BEAT.back); h.x = lerp(app.x, seat.x, k); h.z = lerp(app.z, seat.z, k); henHeading = facingOut; pose.hoist = lerp(1, st.hen.stage === 0 ? 0.2 : 0.6, k); pose.speed = 0.12; if (t >= BEAT.back) hset('sit'); break; }
      case 'sit': pose.sit = smooth(t / BEAT.sit); pose.hoist = lerp(st.hen.stage === 0 ? 0.2 : 0.6, 0.45, t / BEAT.sit); if (t >= BEAT.sit) { patches[i].growing = false; hset('absorb'); } break;
      // Absorbing: the cushion shrinks into it and it fills out a stage.
      case 'absorb': { const k = smooth(t / BEAT.absorb); patches[i].grow = Math.min(patches[i].grow, 1 - k); h.f = (h.stage + k) / STAGES; pose.sit = 1; pose.hoist = 0.45; if (t >= BEAT.absorb) { h.stage = Math.min(STAGES, h.stage + 1); h.f = h.stage / STAGES; patches[i].grow = 0; hset('rest'); } break; }
      case 'rest': pose.sit = 1; pose.hoist = 0.45; if (t >= BEAT.rest) hset('strain'); break;
      // Straining to tear free: up off the seat, leaning out, braced, the threads stretching; then they snap and it lurches free.
      case 'strain': { const k = t / BEAT.strain; pose.sit = 1 - smooth(k * 4); pose.hoist = lerp(0.45, 0.15, smooth(k * 3)); pose.strain = smooth(k * 3); const fw = 0.22 * smooth(k) + Math.sin(t * 16) * 0.012 * smooth(k * 3); h.x = seat.x + out(i).x * fw; h.z = seat.z + out(i).z * fw; henHeading = facingOut; if (t >= BEAT.strain) { patches[i].growing = true; patches[i].grow = 0; hset('free'); } break; }
      case 'free': { const k = t / BEAT.free, fw = 0.22 + 0.35 * smooth(k); h.x = seat.x + out(i).x * fw; h.z = seat.z + out(i).z * fw; pose.lift = Math.sin(Math.PI * clamp01(k)) * 0.07; pose.strain = 1 - k; pose.hoist = 0; if (t >= BEAT.free) { if (h.stage >= STAGES) hset('mid'); else { h.tree = 1 - i; hset('go'); } } break; }
      // Plump: it tears free a last time and wanders out to the middle, and stops.
      case 'mid': { const from = { x: h.x, z: h.z }; if (walk(h, mid, henPace(), dt)) hset('wait'); henSpeed = henPace(); henHeading = angleTo(henHeading, toward(from, mid), Math.min(1, dt * 8)); pose.speed = henSpeed; pose.hoist = 0; pose.sit = 0; break; }
      case 'wait': henHeading = angleTo(henHeading, toward(h, { x: st.hobbit.x, z: st.hobbit.z }), Math.min(1, dt * 1.5)); pose.hoist = 0; pose.sit = 0; break;
      // Kicked onto its head: the gown falls flat round it, the bare bottom and legs up and kicking.
      case 'flip': { const k = t / BEAT.flip; pose.invert = smooth(k); pose.fall = smooth((k - 0.45) / 0.55); if (t >= BEAT.flip) hset('kicking'); break; }
      case 'kicking': pose.invert = 1; pose.fall = 1; break;
      case 'pulled': pose.invert = 1; pose.fall = 1; pose.pull = 0.85 * smooth(st.hobbit.t / BEAT.pull) + Math.sin(clock * 9) * 0.03; break;
      // The flat dress, nothing in it; then the eyestalks pop up from its middle; then the legs grow folded, drawing on the lower tiers.
      case 'flat': pose.invert = 0; pose.fall = 1; pose.meat = false; pose.pull = 0; pose.sunk = 1; pose.eyes = 0; if (t >= BEAT.flat) hset('eyes'); break;
      case 'eyes': { const k = t / BEAT.eyes; pose.eyes = Math.min(1.15, smooth(k * 1.6) * 1.15) - Math.max(0, k * 1.6 - 1) * 0.15 * 1.5; if (t >= BEAT.eyes) { pose.eyes = 1; hset('legs'); } break; }
      case 'legs': pose.eyes = 1; pose.sunk = 1; if (t >= BEAT.legs) {
        // The old gown stays on the ground to wither; the hen is lean again in a miniskirt of a few young tiers, and springs out.
        shed.group.visible = true; shedT = 0; shedAt.x = h.x; shedAt.z = h.z; shed.group.position.set(h.x, relief(h.x, h.z), h.z); shed.group.rotation.y = henHeading;
        h.stage = 0; h.f = 0; pose.fall = 0; pose.meat = true; pose.legs = 0; hset('spring'); }
        break;
      case 'spring': { const k = t / BEAT.spring; pose.sunk = 1 - smooth(k * 1.4); pose.legs = smooth(k * 1.5); pose.lift = Math.sin(Math.PI * clamp01(k)) * 0.32; pose.speed = 0.6; if (t >= BEAT.spring) { pose.sunk = 0; pose.legs = 1; pose.lift = 0;
        // To the nearer tree with a cushion grown (both have one by now; the nearer otherwise).
        const ready = [0, 1].filter(j => patches[j].grow > 0.9), pick = (ready.length ? ready : [0, 1]).sort((a, b) => dist(h, approachOf(a)) - dist(h, approachOf(b)))[0]; h.tree = pick; st.loops++; hset('go'); } break; }
    }
    // The flipped and flat poses hold their numbers between frames; elsewhere they are off.
    if (!['flip', 'kicking', 'pulled', 'flat', 'eyes', 'legs', 'spring'].includes(h.phase)) { pose.invert = 0; pose.fall = 0; pose.pull = 0; pose.meat = true; pose.sunk = 0; pose.eyes = 1; pose.legs = 1; }
    if (['go', 'mid', 'wait', 'hoist', 'turn', 'back', 'free'].includes(h.phase)) pose.sit = 0;
    pose.f = h.f; pose.seat = CUSHION_H * 0.9;
  }
  function stepHobbit(dt: number): void {
    const b = st.hobbit; b.t += dt; const t = b.t; hobSpeed = 0;
    switch (b.phase) {
      case 'idle': hobHeading = angleTo(hobHeading, toward(b, { x: st.hen.x, z: st.hen.z }), Math.min(1, dt * 2)); if (st.hen.phase === 'mid' || st.hen.phase === 'wait') bset('go'); break;
      case 'go': { const from = { x: b.x, z: b.z }; if (walk(b, kickSpot, HOBBIT_PACE, dt)) bset('ready'); hobSpeed = HOBBIT_PACE; hobHeading = angleTo(hobHeading, toward(from, kickSpot), Math.min(1, dt * 8)); break; }
      case 'ready': hobHeading = angleTo(hobHeading, toward(b, mid), Math.min(1, dt * 6)); if (st.hen.phase === 'wait' && st.hen.t > 0.8 && t > 0.6) bset('kick'); break;
      case 'kick': if (t >= BEAT.kick * 0.45 && st.hen.phase === 'wait') hset('flip'); if (t >= BEAT.kick) bset('step'); break;
      case 'step': { const k = smooth(t / BEAT.step); b.x = lerp(kickSpot.x, stepSpot.x, k); b.z = lerp(kickSpot.z, stepSpot.z, k); hobSpeed = 0.3; if (t >= BEAT.step && st.hen.phase === 'kicking') { bset('pull'); hset('pulled'); } break; }
      case 'pull': if (t >= BEAT.pull) {
        // Pop: the piece comes out whole into its hands.
        hen.group.updateMatrixWorld(true); popFrom = new THREE.Vector3().setFromMatrixPosition(hen.meat.group.matrixWorld); popT = 0; bites = 1;
        hset('flat'); bset('carry'); }
        break;
      case 'carry': { const from = { x: b.x, z: b.z }; if (t > 0.6) { if (walk(b, cookSpot, HOBBIT_PACE * 0.85, dt)) bset('cook'); hobSpeed = HOBBIT_PACE * 0.85; hobHeading = angleTo(hobHeading, toward(from, cookSpot), Math.min(1, dt * 8)); } break; }
      case 'cook': hobHeading = angleTo(hobHeading, toward(b, hearth), Math.min(1, dt * 6)); if (t >= BEAT.cook) bset('eat'); break;
      case 'eat': bites = 1 - Math.floor(t / BEAT.eat * 4) / 4; if (t >= BEAT.eat) { bites = 0; bset('idle'); } break;
    }
    if (b.phase === 'idle' && t > 0.5 && t < 4 && dist(b, idleSpot) > 0.05) { const from = { x: b.x, z: b.z }; walk(b, idleSpot, HOBBIT_PACE, dt); hobSpeed = HOBBIT_PACE; hobHeading = toward(from, idleSpot); }
  }
  const hobPose = (): HobbitPose | null => {
    const b = st.hobbit;
    if (b.phase === 'kick') return { kind: 'kick', k: b.t / BEAT.kick };
    if (b.phase === 'step') return { kind: 'pull', k: 0 };
    if (b.phase === 'pull') return { kind: 'pull', k: b.t / BEAT.pull };
    if (b.phase === 'carry' || b.phase === 'eat') return { kind: 'hold', k: 0 };
    if (b.phase === 'cook') return { kind: 'cook', k: b.t / BEAT.cook };
    return null;
  };
  const tmp = new THREE.Vector3();
  function draw(dt: number, night: number): void {
    const h = st.hen, b = st.hobbit;
    for (let i = 0; i < 2; i++) { const p = patches[i]; if (p.growing) p.grow = Math.min(1, p.grow + dt / CUSHION_S); drawPatch(i); st.cushions[i] = p.grow; }
    creamMat.emissiveIntensity = 0.35 * night;
    pose.night = night;
    hen.update(h.x, relief(h.x, h.z), h.z, henHeading, pose, dt);
    // The threads: from points on its back to the bark behind the seat; faint while it sits, taut and trembling while it strains, snapping back to the bark as it lurches free.
    const i = h.tree, u = out(i), tr = trees[i], ty = relief(tr.x, tr.z), fr = henFrame(h.f);
    const sitting = ['sit', 'absorb', 'rest'].includes(h.phase), straining = h.phase === 'strain', freeing = h.phase === 'free';
    threadMat.opacity = sitting ? 0.35 : straining ? 0.9 : freeing ? 0.9 * (1 - h.t / BEAT.free) : 0;
    if (threadMat.opacity > 0) {
      const px = -u.z, pz = u.x, back = Math.max(0.05, lerp(0.06, 0.2, h.f)), hy = relief(h.x, h.z);
      for (let k = 0; k < THREADS; k++) {
        const s = (k / (THREADS - 1) - 0.5) * 2, up = 0.06 + ((k * 37) % 10) / 10 * (fr.neck - 0.05) * (sitting ? 0.7 : 1);
        const bx = tr.x + u.x * (TRUNK_R + 0.01) + px * s * TRUNK_R * 0.7, bz = tr.z + u.z * (TRUNK_R + 0.01) + pz * s * TRUNK_R * 0.7, by = ty + up * 0.9 + 0.05;
        let hx = h.x - u.x * back + px * s * back * 0.8, hz = h.z - u.z * back + pz * s * back * 0.8, hyy = hy + up + (straining ? Math.sin(clock * 30 + k) * 0.006 : 0);
        if (freeing) { const k2 = smooth(h.t / BEAT.free); hx = lerp(hx, bx, k2); hz = lerp(hz, bz, k2); hyy = lerp(hyy, by, k2); }
        threadPos.set([bx, by, bz, hx, hyy, hz], k * 6);
      }
      threadGeo.attributes.position.needsUpdate = true;
    }
    // The shed gown withers: its lower tiers shrink and darken and it sinks into the soil, then it is gone.
    if (shedT >= 0) { shedT += dt; const w = clamp01(shedT / BEAT.wilt); shed.set({ f: 1, hoist: 0, fall: 1, wilt: w, sway: 0, bounce: 0, night: night * (1 - w) }); shed.group.position.y = relief(shedAt.x, shedAt.z) - 0.06 * smooth((shedT - BEAT.wilt * 0.6) / (BEAT.wilt * 0.4)); if (shedT > BEAT.wilt) { shed.group.visible = false; shedT = -1; } }
    // The hobbit, posed, and the piece in its hands, on its stick over the fire, or in its mouth.
    const po = hobPose(); hob.update(b.x, relief(b.x, b.z), b.z, hobHeading, { pose: po, speed: hobSpeed, carry: null, eating: false, taking: false, inside: false }, dt);
    const carrying = b.phase === 'carry' || b.phase === 'cook' || b.phase === 'eat';
    piece.group.visible = carrying && bites > 0; stick.visible = b.phase === 'cook' || b.phase === 'eat';
    const fx = -Math.sin(hobHeading), fz = -Math.cos(hobHeading), by = relief(b.x, b.z);
    if (piece.group.visible) {
      let cooked = 0; piece.group.rotation.set(0, hobHeading, 0); piece.group.scale.setScalar(1);
      if (b.phase === 'carry') { tmp.set(b.x + fx * 0.17, by + 0.36, b.z + fz * 0.17); if (popFrom && popT < 0.4) { popT += dt; const k = smooth(popT / 0.4); tmp.lerpVectors(popFrom, tmp, k); tmp.y += Math.sin(Math.PI * k) * 0.25; } }
      else { const hy = relief(hearth.x, hearth.z); cooked = b.phase === 'cook' ? clamp01(b.t / BEAT.cook) : 1;
        if (b.phase === 'cook') { tmp.set(hearth.x, hy + 0.42, hearth.z); piece.group.rotation.set(0, hobHeading, Math.PI / 2 + Math.sin(clock * 0.8) * 0.3); }
        else { tmp.set(b.x + fx * 0.14, by + 0.3, b.z + fz * 0.14); piece.group.scale.setScalar(Math.max(0.05, bites)); } }
      piece.group.position.copy(tmp); piece.set({ f: 1, phase: 0, walk: 0, tuck: 0, kick: 0, flop: 1, brace: 0, clock, grow: 1, cooked });
      if (stick.visible) { const hx = b.x + fx * 0.12, hz = b.z + fz * 0.12, hy2 = by + 0.2, to = b.phase === 'cook' ? tmp.clone() : new THREE.Vector3(hx + fx * 0.05, hy2 + 0.1, hz + fz * 0.05); const from = new THREE.Vector3(hx, hy2, hz), d = to.clone().sub(from); stick.position.copy(from); stick.scale.set(1, Math.max(0.05, d.length() + 0.05), 1); stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); }
    }
    // The cooking fire at the hearth.
    fire.visible = b.phase === 'cook' || (b.phase === 'eat' && b.t < 1.5);
    for (let k = 0; k < flames.length; k++) flames[k].scale.set(1, fire.visible ? 0.85 + Math.sin(clock * 13 + k * 2.1) * 0.2 : 0.001, 1);
    fireLight.intensity = fire.visible ? 3 + Math.sin(clock * 11) * 0.6 : 0;
  }
  function step(dt: number): void { clock += dt; stepHen(dt); stepHobbit(dt); }
  function update(dt: number, night: number): void { const d = Math.min(0.1, dt); step(d); draw(d, night); }
  function skip(seconds: number): void { for (let s = 0; s < seconds; s += 0.05) { step(0.05); for (const p of patches) if (p.growing) p.grow = Math.min(1, p.grow + 0.05 / CUSHION_S); } draw(0.001, 0); }
  // Start seated at the first tree, skinny, the other tree's cushion grown.
  drawPatch(0); drawPatch(1);
  function dispose(): void { scene.remove(root); hen.dispose(); hob.dispose(); piece.dispose(); shed.dispose(); web?.dispose(); for (const g of geoms) g.dispose(); for (const m of mats) m.dispose(); }
  return { root, trees, update, skip, get state() { return st; }, dispose };
}
