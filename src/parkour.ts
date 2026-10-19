// Parkour (Noah, 2026-10-19: "if the ground is rough and not built for smooth trail walking, she should
// need no additional input beyond pushing the stick in the direction to travel, and clamber over it like
// a parkour expert"). When the stick drives her into something the walk cannot take (a rise past
// STEP_HEIGHT, a drop, a gap), the motor asks this planner for a move along the drive's direction, and
// plays it as a traversal like any jump: the same swept body test (validateTraversal's canOccupy) runs
// over every sample, and the landing needs the full footprint (supportAt). Pure: no Three.js scene, no
// DOM; the presentation reads the move's kind and stages (huldaTraverse.ts) to pick her clips.
//
// The moves, by how far the ground ahead rises or falls (body heights are BODY_HEIGHT, 0.72):
//   up:   step (to STEP_UP: a knee up, no hands) · clamber (to CLAMBER: hands on the top, a knee over)
//         · mantle (to MANTLE: a little jump, hands on the lip, pressed up) · climb (to the profile's
//         climbRise: a jump to a hang, a pause, the pull up and over)
//   over: vault (a top no thicker than VAULT_TOP, no higher than CLAMBER, with ground beyond at about her height)
//   down: hop (to HOP_MAX) · hangDrop (a sheer drop: she turns, lowers to a hang off the lip, lets go)
//         · the old 'drop' arc where it is no sheer face
//   gap:  leap (running, across ground she can't stand on, to a landing within the profile's leapReach)
//
// Each stage of a move names the window of Noah's Mixamo clip it plays (parkourClips.ts holds the clips'
// own motion): the path through the stage follows the clip's lowest foot up and down and its hips forward,
// stretched to the real heights and distances, so the body goes where the clip's does. Where that shaped
// path would cut a corner the swept test refuses (a sharp wall's top), the same stages are keyed safe:
// up first, then over (or out first, then down).
import { Vector3, MathUtils } from 'three';
import { footAt, hipsZAt } from './parkourClips';
import { BODY_RADIUS, BODY_HEIGHT, STEP_HEIGHT, GRAVITY, supportAt, planTraversal, validateTraversal, traversalPoint, type MobilityProfile, type Traversal, type TraversalKind, type TraversalWorld } from './mobility';

/** Rise limits (m) of each move up; VAULT_TOP is the thickest top she vaults rather than climbs onto; HOP_MAX the deepest drop she hops; HANG_DROP the least drop she lowers into a hang for; BIG_LANDING the drop past which she lands deep and rises slowly. Tuning: judge on the phone. */
export const PARKOUR = { stepUp: 0.42, clamber: 0.8, mantle: 1.25, vaultTop: 0.9, hopMax: 0.95, hangDrop: 1.15, bigLanding: 1.6 } as const;
/** How far ahead (m) the planner looks for a face or an edge; the sample spacing. Tuning. */
export const PROBE = 1.25, SAMPLE = 0.05;
/** A leap is only taken at a run (m/s), never from a standstill: the stick alone carries her, but only into a gap she is running at. Tuning. */
export const LEAP_SPEED = 1.6;
/** Seconds the stick must press into a face before she climbs it (a drop, a vault and a leap go at once). Tuning. */
export const CLIMB_INTENT_S = 0.12;
/** Where her feet hang below a lip (m): the hang clip's hands to its lowest foot (117 cm of the X Bot), her hands on the lip. */
export const HANG_BELOW = 0.47;
/** How high over her landing she jumps before she catches the lip (m). Tuning. */
const CATCH_OVER = 0.12;
/** Each clip window (clip seconds) and its pace (× the clip's own): the moves' timing. Tuning, against the clips. */
export interface Window { clip: string; from: number; to: number; rate: number }
export const WINDOWS: Record<string, Window> = {
  step: { clip: 'step-up', from: 0.05, to: 1.25, rate: 2.1 },
  clamber: { clip: 'clamber', from: 0, to: 1.85, rate: 1.45 },
  reach: { clip: 'jump', from: 0.2, to: 0.85, rate: 1.5 },
  catch: { clip: 'jump-to-hang', from: 0.55, to: 1.5, rate: 1.6 },
  hang: { clip: 'hang', from: 0, to: 0.45, rate: 1 },
  pull: { clip: 'climb-up', from: 0, to: 1.1, rate: 1.25 },
  vault: { clip: 'vault', from: 0.1, to: 1.07, rate: 1.35 },
  hop: { clip: 'running-jump', from: 0.05, to: 0.72, rate: 1 },
  lower: { clip: 'climb-up', from: 1.1, to: 0, rate: 1.5 },
  hangDrop: { clip: 'hang', from: 0.45, to: 0.75, rate: 1 },
  fall: { clip: 'hang-drop', from: 0.3, to: 0.8, rate: 1 },
  rise: { clip: 'hang-drop', from: 0.8, to: 1.55, rate: 1.7 },
  land: { clip: 'landing', from: 0.6, to: 1.0, rate: 2 },
  landDeep: { clip: 'landing', from: 0.55, to: 1.65, rate: 2.2 },
};

export type ParkourKind = Extract<TraversalKind, 'step' | 'clamber' | 'mantle' | 'climb' | 'vault' | 'hop' | 'hangDrop' | 'leap'>;
const clamp = MathUtils.clamp;
const smooth = (a: number, b: number, x: number): number => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
type Stage = { name: string; at: number; clip?: string; from?: number; to?: number };
/** 'shaped' follows the clip; 'up' keys it safe for a climb (up first, then over); 'out' for a lowering (out first, then down). */
type Keying = 'shaped' | 'up' | 'out';

/** A move as keyframes and stages, built stage by stage. */
class Moves {
  readonly path: Vector3[] = []; readonly times: number[] = []; readonly stages: Stage[] = []; t = 0;
  constructor(private readonly world: TraversalWorld, start: Vector3, readonly keying: Keying = 'shaped') { this.path.push(start.clone()); this.times.push(0); }
  get at(): Vector3 { return this.path[this.path.length - 1]; }
  private key(p: Vector3, dt: number): void { this.t += Math.max(1e-4, dt); this.path.push(p); this.times.push(this.t); }
  /** A straight move (the approach to a face or an edge); no clip: the gait's stride. */
  move(to: Vector3, dt: number): this { if (dt > 1e-3 && to.distanceTo(this.at) > 1e-4) { this.stages.push({ name: 'approach', at: this.t }); this.key(to.clone(), dt); } return this; }
  /** Hold still through a clip window (a hang, a landing's crouch). */
  hold(name: string, w: Window): this { this.stages.push({ name, at: this.t, clip: w.clip, from: w.from, to: w.to }); this.key(this.at.clone(), Math.abs(w.to - w.from) / w.rate); return this; }
  /** A clip window carrying her from here to E: up and down along the clip's lowest foot, forward along its hips. A
   * window whose foot ends about where it began (a jump, a vault) is a bump over the straight line, `bump` m at its height. */
  clip(name: string, w: Window, E: Vector3, bump = 0, lip = E.y): this {
    const S = this.at.clone(), f0 = footAt(w.clip, w.from), f1 = footAt(w.clip, w.to), z0 = hipsZAt(w.clip, w.from), z1 = hipsZAt(w.clip, w.to);
    const n = Math.max(2, Math.ceil(Math.abs(w.to - w.from) / 0.05)), dt = Math.abs(w.to - w.from) / w.rate / n, fit = Math.abs(f1 - f0) > 6;
    let peak = 0; if (!fit) for (let i = 0; i <= n; i++) { const u = i / n, tau = w.from + (w.to - w.from) * u; peak = Math.max(peak, footAt(w.clip, tau) - (f0 + (f1 - f0) * u)); }
    this.stages.push({ name, at: this.t, clip: w.clip, from: w.from, to: w.to });
    const run = Math.hypot(E.x - S.x, E.z - S.z) || 1, ux = (E.x - S.x) / run, uz = (E.z - S.z) / run;
    for (let i = 1; i <= n; i++) {
      const u = i / n, tau = w.from + (w.to - w.from) * u, f = footAt(w.clip, tau);
      let v = fit ? (f - f0) / (f1 - f0) : u; const z = Math.abs(z1 - z0) > 5 ? (hipsZAt(w.clip, tau) - z0) / (z1 - z0) : u;
      let h = clamp(z, -0.1, 1.1);
      if (this.keying === 'up') {
        // Straight up the face to clear the lip, then over it: the last fifth of the window.
        const k = clamp(u / 0.8, 0, 1), top = Math.max(lip, E.y) + 0.04;
        const p = u <= 0.8 ? new Vector3(S.x, S.y + (top - S.y) * smooth(0, 1, k), S.z)
          : new Vector3(S.x + (E.x - S.x) * (u - 0.8) / 0.2, top + (E.y - top) * smooth(0.6, 1, (u - 0.8) / 0.2), S.z + (E.z - S.z) * (u - 0.8) / 0.2);
        if (i === n) p.copy(E);
        this.key(p, dt); continue;
      }
      if (this.keying === 'out') { h = smooth(0, 0.35, u); v = smooth(0.3, 1, u); }
      const p = new Vector3(S.x + (E.x - S.x) * h, S.y + (E.y - S.y) * (fit ? v : u), S.z + (E.z - S.z) * h);
      if (!fit && peak > 1) p.y += Math.max(0, f - (f0 + (f1 - f0) * u)) / peak * bump;
      // The clip's lowest foot trails her body up a slope: never below the ground she is over.
      // (And a body's width ahead and behind, so neither her side nor the line between keys cuts a step's corner.)
      let g = -Infinity; for (const o of [-0.3, -0.15, 0, 0.15, 0.3]) { const y = topAt(this.world, p.x + ux * o, p.z + uz * o, Math.max(S.y, E.y, p.y, lip) + 0.05); if (y !== null) g = Math.max(g, y); }
      if (p.y < g) p.y = g;
      if (i === n) p.copy(E);
      this.key(p, dt);
    }
    return this;
  }
  /** A body's fall from here to E (the parabola), through a clip window stretched over it. */
  fall(name: string, w: Window, E: Vector3): this {
    const S = this.at.clone(), h = Math.max(0.01, S.y - E.y), T = Math.sqrt(2 * h / GRAVITY), n = 8;
    this.stages.push({ name, at: this.t, clip: w.clip, from: w.from, to: w.to });
    for (let i = 1; i <= n; i++) { const s = i / n, p = new Vector3().lerpVectors(S, E, s); p.y = i === n ? E.y : S.y - 0.5 * GRAVITY * (s * T) ** 2; this.key(p, T / n); }
    return this;
  }
  /** A ballistic arc (planTraversal's) as keyframes, through a clip window. */
  arc(name: string, w: Window, plan: Traversal): this {
    const n = Math.max(6, Math.ceil(plan.duration / 0.04)), p = new Vector3();
    this.stages.push({ name, at: this.t, clip: w.clip, from: w.from, to: w.to });
    for (let i = 1; i <= n; i++) { traversalPoint(plan, plan.duration * i / n, p); this.key(i === n ? plan.to.clone() : p.clone(), plan.duration / n); }
    return this;
  }
  done(kind: TraversalKind, face: number): Traversal {
    return { kind, from: this.path[0].clone(), to: this.at.clone(), duration: this.t, velocityY: 0, floorPath: this.path, times: this.times, stages: this.stages, face };
  }
}
/** Build a move shaped by its clips; where the swept test refuses that, the same stages keyed safe. */
function shaped(world: TraversalWorld, safe: Keying, build: (k: Keying) => Traversal | null): Traversal | null {
  for (const k of ['shaped', safe] as const) { const plan = build(k); if (plan && validateTraversal(world, plan)) return plan; }
  return null;
}
/** The landing after a fall or a leap: a quick crouch, or deep and slow after a big drop. */
const landing = (drop: number): Window => (drop >= PARKOUR.bigLanding ? WINDOWS.landDeep : WINDOWS.land);

/** The highest surface at x,z no higher than `ceiling`, or null. */
function topAt(world: TraversalWorld, x: number, z: number, ceiling: number): number | null {
  let best: number | null = null;
  for (const y of world.surfacesAt(x, z)) if (Number.isFinite(y) && y <= ceiling && (best === null || y > best)) best = y;
  return best;
}

/** The move the stick asks for: from `feet`, along the unit drive (dx, dz), at the measured speed. Null when nothing fits. */
export function planParkour(world: TraversalWorld, feet: Vector3, dx: number, dz: number, profile: Readonly<MobilityProfile>, speed = 0): Traversal | null {
  const len = Math.hypot(dx, dz); if (len < 1e-6) return null; dx /= len; dz /= len;
  const face = Math.atan2(-dx, -dz), at = (d: number, y: number): Vector3 => new Vector3(feet.x + dx * d, y, feet.z + dz * d);
  const ceiling = feet.y + profile.climbRise + 0.05;
  // The ground ahead: its height at each sample, and whether her body fits standing on it.
  let rise: { d: number } | null = null, edge: { d: number } | null = null;
  for (let d = SAMPLE; d <= PROBE + 1e-6; d += SAMPLE) {
    const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling);
    if (y !== null && y - feet.y > STEP_HEIGHT * 0.6) { rise = { d }; break; }
    if (y === null || y < feet.y - STEP_HEIGHT) { edge = { d }; break; }
    if (!world.canOccupy(at(d, y), BODY_RADIUS * 0.5, BODY_HEIGHT * 0.5)) {
      // Something in the way at her height: the face of a rise just ahead (a wall's foot), or else an obstacle or water to clear.
      for (let e = d + SAMPLE; e <= d + 0.4 + 1e-6; e += SAMPLE) { const z = topAt(world, feet.x + dx * e, feet.z + dz * e, ceiling); if (z !== null && z - feet.y > STEP_HEIGHT * 0.6) { rise = { d: e }; break; } }
      if (!rise) edge = { d }; break;
    }
  }
  if (rise) return planUp(world, feet, dx, dz, rise.d, face, speed, profile, at);
  if (edge) return planDown(world, feet, edge.d, face, speed, profile, at);
  return null;
}

type At = (d: number, y: number) => Vector3;

function planUp(world: TraversalWorld, feet: Vector3, dx: number, dz: number, d0: number, face: number, speed: number, profile: Readonly<MobilityProfile>, at: At): Traversal | null {
  const ceiling = feet.y + profile.climbRise + 0.05;
  // A vault first: a thin top no higher than a clamber, with ground beyond at about her height.
  let crest = -Infinity; for (let d = d0; d <= d0 + PARKOUR.vaultTop + 1e-6; d += SAMPLE) { const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling); if (y === null || y < crest - STEP_HEIGHT) break; crest = Math.max(crest, y); }
  if (crest - feet.y <= PARKOUR.clamber && crest - feet.y > STEP_HEIGHT * 0.6) { const v = planVault(world, feet, dx, dz, d0, crest, face, speed, at); if (v) return v; }
  // The landing: the nearest place past the face where the whole footprint stands, higher than she is.
  let land: { d: number; y: number } | null = null;
  for (let d = d0 + BODY_RADIUS * 0.6; d <= d0 + PROBE * 0.8; d += SAMPLE) {
    const p = at(d, 0), s = supportAt(world, p.x, p.z, ceiling);
    if (s !== null && s - feet.y > 0.1 && s - feet.y <= profile.climbRise) { land = { d, y: s }; break; }
  }
  if (!land) return null;
  // The lip: the highest ground crossed between the face and the landing (a rough face can crest past its top).
  let lip = land.y;
  for (let d = d0; d <= land.d + 1e-6; d += SAMPLE) { const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling); if (y !== null) lip = Math.max(lip, y); }
  const r = lip - feet.y;
  if (r > profile.climbRise) return null;
  const a = Math.max(0, d0 - SAMPLE - BODY_RADIUS - 0.02), A = at(a, feet.y), L = at(land.d, land.y), approach = a / Math.max(1.2, speed);
  const kind: ParkourKind = r <= PARKOUR.stepUp ? 'step' : r <= PARKOUR.clamber ? 'clamber' : r <= PARKOUR.mantle ? 'mantle' : 'climb';
  return shaped(world, 'up', k => {
    const m = new Moves(world, feet, k).move(A, approach);
    // A step: a knee up and the weight over, in one stride.
    if (kind === 'step') m.clip('step', WINDOWS.step, L, 0, lip);
    // A clamber: hands on the top, a foot on the face, the body pressed up and a knee over.
    else if (kind === 'clamber') m.clip('clamber', WINDOWS.clamber, L, 0, lip);
    else {
      // A mantle or a climb: a crouch and a jump that puts her hands on the lip, the catch (her feet find the face), for a
      // climb a breath in the hang, and the pull up and over.
      const hang = Math.max(feet.y + 0.1, lip - HANG_BELOW);
      m.clip('reach', WINDOWS.reach, at(a, hang + CATCH_OVER)).clip('catch', WINDOWS.catch, at(a, hang));
      if (kind === 'climb') m.hold('hang', WINDOWS.hang);
      m.clip('pull', kind === 'climb' ? WINDOWS.pull : { ...WINDOWS.pull, rate: 1.5 }, L, 0, lip);
    }
    return m.done(kind, face);
  });
}

function planVault(world: TraversalWorld, feet: Vector3, dx: number, dz: number, d0: number, lip: number, face: number, speed: number, at: At): Traversal | null {
  const ceiling = lip + 0.05;
  // The far side of the top: where the ground falls back toward her height, within VAULT_TOP of the face.
  let back = -1;
  for (let d = d0 + SAMPLE; d <= d0 + PARKOUR.vaultTop + 1e-6; d += SAMPLE) { const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling); if (y === null || y < lip - STEP_HEIGHT) { back = d; break; } }
  if (back < 0) return null;
  let land: { d: number; y: number } | null = null;
  for (let d = back + BODY_RADIUS + 0.05; d <= back + 1.2; d += SAMPLE) {
    const p = at(d, 0), s = supportAt(world, p.x, p.z, lip - STEP_HEIGHT);
    if (s !== null && Math.abs(s - feet.y) <= PARKOUR.stepUp && feet.y - s <= PARKOUR.hopMax) { land = { d, y: s }; break; }
  }
  if (!land) return null;
  // She plants her hands on the top and swings her legs over it: the clip's bump, as high as clears the top.
  const a = Math.max(0, d0 - SAMPLE - BODY_RADIUS - 0.02), A = at(a, feet.y), L = at(land.d, land.y), over = lip + 0.08 - Math.max(feet.y, land.y);
  return shaped(world, 'up', k => {
    const m = new Moves(world, feet, k).move(A, a / Math.max(1.8, speed));
    if (k === 'shaped') m.clip('vault', WINDOWS.vault, L, over, lip);
    else m.clip('vault', { ...WINDOWS.vault, to: 0.5 }, at((d0 + back) / 2, lip + 0.04), 0, lip).clip('over', { ...WINDOWS.vault, from: 0.5, to: 0.9 }, at(back + BODY_RADIUS + 0.03, lip + 0.04)).clip('over', { ...WINDOWS.vault, from: 0.9 }, L);
    return m.done('vault', face);
  });
}

function planDown(world: TraversalWorld, feet: Vector3, de: number, face: number, speed: number, profile: Readonly<MobilityProfile>, at: At): Traversal | null {
  // The landing below: the nearest full footprint past the edge, within her drop.
  let land: { d: number; y: number } | null = null;
  for (let d = de + 0.1; d <= de + 1.4; d += SAMPLE) {
    const p = at(d, 0), s = supportAt(world, p.x, p.z, feet.y - STEP_HEIGHT * 0.5);
    if (s !== null && feet.y - s <= profile.maxDrop && feet.y - s > STEP_HEIGHT * 0.5) { land = { d, y: s }; break; }
  }
  if (land) {
    const drop = feet.y - land.y;
    // A sheer drop: the landing lies at the foot of the edge, so she turns to the wall, lowers herself into a hang off the lip and lets go.
    if (drop >= PARKOUR.hangDrop && land.d - de <= 0.75) {
      const e = Math.max(0, de - BODY_RADIUS * 0.6), E = at(e, feet.y), hangD = de + BODY_RADIUS + 0.03, H = at(hangD, feet.y - HANG_BELOW), L = at(Math.max(hangD, land.d), land.y), fallH = H.y - land.y;
      if (fallH > 0.02) {
        const plan = shaped(world, 'out', k => new Moves(world, feet, k).move(E, e / Math.max(1, speed)).clip('lower', WINDOWS.lower, H).hold('hang', WINDOWS.hangDrop)
          .fall('fall', WINDOWS.fall, L).hold('land', fallH >= PARKOUR.bigLanding ? WINDOWS.landDeep : WINDOWS.rise).done('hangDrop', face + Math.PI));
        if (plan) return plan;
      }
    }
    // A hop down (or, deeper, the jump down the fan already makes): a short arc onto the landing, and the landing.
    // The lowest arc that clears the edge: a little farther out rather than higher.
    let arc: Traversal | null = null;
    for (let d = Math.max(land.d, de + 0.35); d <= land.d + 0.9 + 1e-6; d += 0.1) {
      const s = supportAt(world, at(d, 0).x, at(d, 0).z, feet.y - STEP_HEIGHT * 0.5); if (s === null || Math.abs(s - land.y) > STEP_HEIGHT) continue;
      const a = planTraversal(world, feet, at(d, s), profile, 1); if (!a || a.kind === 'walk') continue;
      if (!arc || a.velocityY < arc.velocityY) arc = a;
      if (a.velocityY * a.velocityY / (2 * GRAVITY) <= 0.3) break;
    }
    if (arc) {
      const plan = new Moves(world, feet).arc(drop <= PARKOUR.hopMax ? 'hop' : 'jump', WINDOWS.hop, arc).hold('land', landing(drop)).done(drop <= PARKOUR.hopMax ? 'hop' : arc.kind, face);
      if (validateTraversal(world, plan)) return plan;
    }
  }
  // A gap: at a run, a leap to the nearest ground across it she can land on.
  if (speed < LEAP_SPEED) return null;
  for (let d = de + 0.4; d <= profile.leapReach + 1e-6; d += SAMPLE * 2) {
    const p = at(d, 0), s = supportAt(world, p.x, p.z, feet.y + profile.jumpRise * 0.6);
    if (s === null || s - feet.y > profile.jumpRise * 0.6 || feet.y - s > profile.maxDrop) continue;
    const arc = planTraversal(world, feet, at(d, s), profile, 1);
    if (!arc || arc.kind === 'walk') continue;
    const plan = new Moves(world, feet).arc('leap', WINDOWS.hop, arc).hold('land', landing(feet.y - s)).done('leap', face);
    if (validateTraversal(world, plan)) return plan;
  }
  return null;
}

/** The stage of a move at time t (the last one begun), and how far through it (0..1). */
export function stageAt(plan: Traversal, t: number): { name: string; k: number; at: number; until: number } | null {
  const s = plan.stages; if (!s || !s.length) return null;
  let i = 0; while (i + 1 < s.length && s[i + 1].at <= t) i++;
  const until = i + 1 < s.length ? s[i + 1].at : plan.duration, at = s[i].at;
  return { name: s[i].name, at, until, k: clamp((t - at) / Math.max(1e-3, until - at), 0, 1) };
}
