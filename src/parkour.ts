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
import { Vector3, MathUtils } from 'three';
import { BODY_RADIUS, BODY_HEIGHT, STEP_HEIGHT, GRAVITY, supportAt, planTraversal, validateTraversal, type MobilityProfile, type Traversal, type TraversalKind, type TraversalWorld } from './mobility';

/** Rise limits (m) of each move up; VAULT_TOP is the thickest top she vaults rather than climbs onto; HOP_MAX the deepest drop she hops; HANG_DROP the least drop she lowers into a hang for. Tuning: judge on the phone. */
export const PARKOUR = { stepUp: 0.42, clamber: 0.8, mantle: 1.25, vaultTop: 0.9, hopMax: 0.95, hangDrop: 1.15 } as const;
/** How far ahead (m) the planner looks for a face or an edge; the sample spacing. Tuning. */
export const PROBE = 1.25, SAMPLE = 0.05;
/** A leap is only taken at a run (m/s), never from a standstill: the stick alone carries her, but only into a gap she is running at. Tuning. */
export const LEAP_SPEED = 1.6;
/** Seconds the stick must press into a face before she climbs it (a drop, a vault and a leap go at once). Tuning. */
export const CLIMB_INTENT_S = 0.12;
/** Where her feet hang below a lip (m): her hands on it, her arms over her head. Tuning. */
export const HANG_BELOW = 0.66; // about BODY_HEIGHT × 0.92, written out: mobility.ts imports this module, so its constants may not be read at load

export type ParkourKind = Extract<TraversalKind, 'step' | 'clamber' | 'mantle' | 'climb' | 'vault' | 'hop' | 'hangDrop' | 'leap'>;
const clamp = MathUtils.clamp;

/** Keyframes to a traversal: positions at times; stages name what the body is doing from when. */
function keyed(kind: TraversalKind, frames: [Vector3, number][], stages: { name: string; at: number }[], face: number): Traversal {
  const path: Vector3[] = [], times: number[] = []; let t = 0;
  for (const [p, dt] of frames) { t += dt; path.push(p.clone()); times.push(t); }
  times[0] = 0;
  return { kind, from: path[0].clone(), to: path[path.length - 1].clone(), duration: times[times.length - 1], velocityY: 0, floorPath: path, times, stages, face };
}
/** A fall from a hang to a landing: several keyframes on the parabola, so the keyed path falls like a body. */
function fall(from: Vector3, to: Vector3, out: [Vector3, number][]): void {
  const h = Math.max(0.01, from.y - to.y), T = Math.sqrt(2 * h / GRAVITY), n = 6;
  for (let i = 1; i <= n; i++) { const s = i / n, p = new Vector3().lerpVectors(from, to, s); p.y = from.y - 0.5 * GRAVITY * (s * T) ** 2; if (i === n) p.y = to.y; out.push([p, T / n]); }
}

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
  const a = Math.max(0, d0 - SAMPLE - BODY_RADIUS - 0.02), A = at(a, feet.y), top = lip + 0.04, L = at(land.d, land.y), approach = Math.max(0.0, a / Math.max(1.2, speed));
  const frames: [Vector3, number][] = [[feet.clone(), 0]];
  const stages: { name: string; at: number }[] = [];
  if (approach > 0.001) frames.push([A, approach]);
  const t0 = approach, edgeIn = at(Math.min(land.d, d0 + 0.06), top);
  let kind: ParkourKind;
  if (r <= PARKOUR.stepUp) {
    // A step: the knee up and the weight over, all in one stride.
    kind = 'step'; frames.push([at(a, top), 0.16], [L, 0.16]);
    stages.push({ name: 'step', at: t0 });
  } else if (r <= PARKOUR.clamber) {
    // A clamber: hands on the top, the body lifted over them, a knee on, and up.
    kind = 'clamber'; frames.push([at(a, feet.y + r * 0.55), 0.22], [at(a, top), 0.2], [edgeIn, 0.1], [L, 0.2]);
    stages.push({ name: 'clamber', at: t0 });
  } else if (r <= PARKOUR.mantle) {
    // A mantle: a crouch, a hop that puts the hands on the lip, the press up, the knee over.
    kind = 'mantle'; const hang = Math.max(feet.y, lip - HANG_BELOW * 0.7);
    frames.push([A, 0.1], [at(a, hang), 0.22], [at(a, top), 0.34], [edgeIn, 0.1], [L, 0.22]);
    stages.push({ name: 'crouch', at: t0 }, { name: 'reach', at: t0 + 0.1 }, { name: 'pull', at: t0 + 0.32 }, { name: 'over', at: t0 + 0.66 });
  } else {
    // A climb: a jump to a hang, a breath there, the pull up, the knee over, and up.
    kind = 'climb'; const hang = Math.max(feet.y, lip - HANG_BELOW), jump = hang - feet.y, up = jump > 0.02 ? Math.sqrt(2 * jump / GRAVITY) : 0;
    frames.push([A, 0.16], [at(a, hang), Math.max(0.2, up * 1.15)], [at(a, hang), 0.28], [at(a, lip - HANG_BELOW * 0.35), 0.34], [at(a, top), 0.3], [edgeIn, 0.1], [L, 0.26]);
    const reach = t0 + 0.16, hold = reach + Math.max(0.2, up * 1.15);
    stages.push({ name: 'crouch', at: t0 }, { name: 'reach', at: reach }, { name: 'hang', at: hold }, { name: 'pull', at: hold + 0.28 }, { name: 'over', at: hold + 0.62 });
  }
  stages.push({ name: 'land', at: frames.reduce((s, f) => s + f[1], 0) - 0.16 });
  const plan = keyed(kind, frames, stages, face);
  return validateTraversal(world, plan) ? plan : null;
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
  const pace = Math.max(1.8, speed), a = Math.max(0, d0 - SAMPLE - BODY_RADIUS - 0.02), r = lip - feet.y, top = lip + 0.06 + r * 0.1, mid = (d0 + back) / 2;
  const frames: [Vector3, number][] = [[feet.clone(), 0]];
  if (a > 0.001) frames.push([at(a, feet.y), a / pace]);
  const t0 = frames.reduce((s, f) => s + f[1], 0);
  frames.push([at(a, lip + 0.02), 0.16 + r * 0.12], [at(mid, top), 0.14], [at(back + BODY_RADIUS + 0.03, lip + 0.01), 0.12], [at(land.d, land.y), 0.12 + Math.max(0, lip - land.y) * 0.12]);
  const plan = keyed('vault', frames, [{ name: 'vault', at: t0 }, { name: 'land', at: frames.reduce((s, f) => s + f[1], 0) - 0.12 }], face);
  return validateTraversal(world, plan) ? plan : null;
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
    // A sheer drop: the landing lies at the foot of the edge, so she lowers herself into a hang off the lip and lets go.
    if (drop >= PARKOUR.hangDrop && land.d - de <= 0.75) {
      const e = Math.max(0, de - BODY_RADIUS * 0.6), E = at(e, feet.y), hangD = de + BODY_RADIUS + 0.03, H = at(hangD, feet.y - HANG_BELOW), L = at(Math.max(hangD, land.d), land.y);
      if (feet.y - HANG_BELOW > land.y) {
        const frames: [Vector3, number][] = [[feet.clone(), 0]]; if (e > 0.001) frames.push([E, e / Math.max(1, speed)]);
        const t0 = frames.reduce((s, f) => s + f[1], 0);
        // She turns at the edge, swings her legs out over it and lowers herself on her hands.
        frames.push([at(hangD, feet.y), 0.26], [at(hangD, feet.y - HANG_BELOW * 0.6), 0.24], [H, 0.18], [H.clone(), 0.22]);
        const drop0 = frames.reduce((s, f) => s + f[1], 0); fall(H, L, frames);
        const plan = keyed('hangDrop', frames, [{ name: 'turn', at: t0 }, { name: 'lower', at: t0 + 0.26 }, { name: 'hang', at: t0 + 0.68 }, { name: 'fall', at: drop0 }, { name: 'land', at: frames.reduce((s, f) => s + f[1], 0) - 0.04 }], face + Math.PI);
        if (validateTraversal(world, plan)) return plan;
      }
    }
    // A hop down (or, deeper, the jump down the fan already makes): a short arc onto the landing.
    const arc = planTraversal(world, feet, at(Math.max(land.d, de + 0.35), land.y), profile, 1);
    if (arc && arc.kind !== 'walk') return { ...arc, kind: drop <= PARKOUR.hopMax ? 'hop' : arc.kind, face, stages: [{ name: drop <= PARKOUR.hopMax ? 'hop' : 'jump', at: 0 }, { name: 'land', at: arc.duration - 0.1 }] };
  }
  // A gap: at a run, a leap to the nearest ground across it she can land on.
  if (speed < LEAP_SPEED) return null;
  for (let d = de + 0.4; d <= profile.leapReach + 1e-6; d += SAMPLE * 2) {
    const p = at(d, 0), s = supportAt(world, p.x, p.z, feet.y + profile.jumpRise * 0.6);
    if (s === null || s - feet.y > profile.jumpRise * 0.6 || feet.y - s > profile.maxDrop) continue;
    const arc = planTraversal(world, feet, at(d, s), profile, 1);
    if (arc && arc.kind !== 'walk') return { ...arc, kind: 'leap', face, stages: [{ name: 'leap', at: 0 }, { name: 'land', at: arc.duration - 0.1 }] };
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
