// Parkour (Noah, 2026-10-19: "if the ground is rough and not built for smooth trail walking, she should
// need no additional input beyond pushing the stick in the direction to travel, and clamber over it like
// a parkour expert"). When the stick drives her into something the walk cannot take (a rise past
// STEP_HEIGHT, a drop, a gap), the motor asks this planner for a move along the drive's direction, and
// plays it as a traversal like any jump: the same swept body test (validateTraversal's canOccupy) runs
// over every sample, and the landing needs the full footprint (supportAt). Pure: no Three.js scene, no
// DOM; the presentation reads the move's kind and stages (huldaTraverse.ts) to pick her clips.
//
// The moves, by how far the ground ahead rises or falls (CANON holds the heights each is made for, the bands
// between them PARKOUR):
//   up:   step (a knee up, no hands) · clamber (the mount: hands and a knee on the top, then up) · climb (a jump
//         to a braced hang, where she pauses until the stick says on up or back down)
//   over: vault (a thin top no higher than a clamber's band, with ground beyond at about her height)
//   down: hop · hangDrop (a sheer drop: she turns, lowers to a braced hang off the lip and pauses there until the
//         stick says drop or climb back) · the old 'drop' arc where it is no sheer face
//   gap:  leap (running, across ground she can't stand on, to a landing within the profile's leapReach)
//
// Each stage of a move names the window of Noah's Mixamo clip it plays (parkourClips.ts holds the clips'
// own motion): the path through the stage follows the clip's lowest foot up and down and its hips forward,
// stretched to the real heights and distances, so the body goes where the clip's does. Where that shaped
// path would cut a corner the swept test refuses (a sharp wall's top), the same stages are keyed safe:
// up first, then over (or out first, then down).
import { Vector3, MathUtils } from 'three';
import { footAt, hipsZAt, CM } from './parkourClips';
import { BODY_RADIUS, BODY_HEIGHT, STEP_HEIGHT, GRAVITY, supportAt, planTraversal, validateTraversal, traversalPoint, type MobilityProfile, type Traversal, type TraversalKind, type TraversalWorld, type HangSpot } from './mobility';

/** The canonical obstacles (Noah, 2026-10-19: "each height she may meet matches an animation perfectly"), read off
 * his clips (parkourClips.ts) at her scale, so a built obstacle of one of these heights is played by its clip at its
 * own size. Built worlds (the practice course, anything authored) use these heights; natural ground (eroded, banks,
 * the bridge's foot) is met by the nearest move, stretched. Derived below, once the windows are set:
 *   step     the step-up clip's rise through its window (0.19 m)
 *   clamber  the mount's top: its hands and knee rest at about 85 cm of the X Bot (0.34 m)
 *   vault    a rail as high as the mount's top, no deeper than VAULT_DEPTH
 *   wall     the jump's rise less the catch's settle, plus the hang below the lip (about 0.78 m): she jumps to a braced
 *            hang, pauses, and climbs on or drops back
 *   ledge    the hang below the lip plus the hang drop's fall (about 1.13 m): she lowers to a braced hang, pauses, and
 *            drops on or climbs back
 *   gap      the running jump's travel less a footprint at each end (about 0.6 m) */
export const CANON_CM = { clamber: 85, vaultDepth: 0.3 } as const;
/** How far ahead (m) the planner looks for a face or an edge; the sample spacing; the ground (m) a face gains most of its rise within to be sheer rather than a slope. Tuning. */
export const PROBE = 1.25, SAMPLE = 0.05, SHEER_W = 0.15;
/** A leap is only taken at a run (m/s), never from a standstill: the stick alone carries her, but only into a gap she is running at. Tuning. */
export const LEAP_SPEED = 1.6;
/** Seconds the stick must press into a face before she climbs it (a drop, a vault and a leap go at once). Tuning. */
export const CLIMB_INTENT_S = 0.12;
/** How long the kneel of the mount blends into the crouch on the top (s). Tuning. */
export const RISE_FADE = 0.28;
/** Each clip window (clip seconds) and its pace (× the clip's own): the moves' timing. Tuning, against the clips. */
export interface Window { clip: string; from: number; to: number; rate: number }
export const WINDOWS: Record<string, Window> = {
  step: { clip: 'step-up', from: 0.05, to: 1.25, rate: 2.1 },
  // The clamber: Noah's mount (hands and the left knee onto the top, the right foot left on the ground; its turn into the
  // obstacle undone), then the landing's crouch, on the top, risen out of to standing.
  mount: { clip: 'mount', from: 0.25, to: 2.05, rate: 1.6 },
  stand: { clip: 'landing', from: 1.5, to: 2.3, rate: 1.3 },
  reach: { clip: 'jump', from: 0.2, to: 0.85, rate: 1.5 },
  catch: { clip: 'jump-to-hang', from: 1.35, to: 1.6, rate: 1 },
  hang: { clip: 'hang', from: 0, to: 0.45, rate: 1 },
  pull: { clip: 'climb-up', from: 0, to: 1.1, rate: 1.25 },
  vault: { clip: 'vault', from: 0.1, to: 1.07, rate: 1.35 },
  hop: { clip: 'running-jump', from: 0.05, to: 0.72, rate: 1 },
  lower: { clip: 'climb-up', from: 1.1, to: 0, rate: 1.5 },
  // The braced hang she pauses in (climbing to it or lowering into it), looped until the stick says up or down.
  braced: { clip: 'hang', from: 0, to: 2.3, rate: 1 },
  fall: { clip: 'hang-drop', from: 0.3, to: 0.8, rate: 1 },
  rise: { clip: 'hang-drop', from: 0.8, to: 1.55, rate: 1.7 },
  land: { clip: 'landing', from: 0.6, to: 1.0, rate: 2 },
  landDeep: { clip: 'landing', from: 0.55, to: 1.65, rate: 2.2 },
};

/** The rise (m) of a clip window's lowest foot, at her scale. */
const riseOf = (w: Window): number => (footAt(w.clip, w.to) - footAt(w.clip, w.from)) * CM;
/** Where her feet hang below a lip (m): the climb up's lowest foot from the braced hang to standing on the top. */
export const HANG_BELOW = riseOf(WINDOWS.pull);
/** How high over her braced hang she jumps before she catches the lip (m): the catch's settle. */
const CATCH_OVER = -riseOf(WINDOWS.catch);
export const CANON = {
  step: riseOf(WINDOWS.step),
  clamber: CANON_CM.clamber * CM,
  vault: CANON_CM.clamber * CM, vaultDepth: CANON_CM.vaultDepth,
  wall: riseOf(WINDOWS.reach) - CATCH_OVER + HANG_BELOW,
  ledge: HANG_BELOW - riseOf(WINDOWS.fall),
  gap: Math.max(0.3, (hipsZAt(WINDOWS.hop.clip, WINDOWS.hop.to) - hipsZAt(WINDOWS.hop.clip, WINDOWS.hop.from)) * CM - 2 * 0.25) // (BODY_RADIUS: mobility.ts imports this module, so its constants may not be read at load),
} as const;
const mid = (a: number, b: number): number => (a + b) / 2;
/** The bands between the canonical heights: each move takes the heights nearer its own than its neighbour's. A rise
 * past STEP_HEIGHT and short of the step and clamber's midpoint is stepped; to the clamber and wall's, clambered (a
 * sloped foot is stepped to there too); higher, to the profile's climbRise, climbed by the braced hang. A thin top
 * to the clamber and wall's midpoint is vaulted; a sheer drop from that midpoint is lowered from by the braced hang.
 * VAULT_TOP is the thickest top she vaults rather than climbs onto; HOP_MAX the deepest drop she hops (deeper, the
 * fan's jump down); BIG_LANDING the drop past which she lands deep and rises slowly. */
export const PARKOUR = {
  stepUp: mid(CANON.step, CANON.clamber), clamber: mid(CANON.clamber, CANON.wall), vault: mid(CANON.vault, CANON.wall),
  vaultTop: 0.9, hopMax: 0.95, hangDrop: mid(CANON.clamber, CANON.wall), bigLanding: 1.6,
} as const;
/** In the braced hang her body (BODY_RADIUS and the planner's margins) keeps about 0.29 m from the face, where the clips
 * have her feet 0.11 m before her root: her figure is drawn this much nearer the face through the catch, the hang and
 * the pull, so her hands are on the lip and her feet on the face. Measured in the course's hang. */
export const HANG_LEAN = 0.17;
/** How far toward the face her figure is drawn at time t of a move (along `face`). */
export function leanAt(plan: Traversal, t: number): number {
  const st = stageAt(plan, t); if (!st) return 0; const s = plan.stages!.find(x => x.at === st.at && x.name === st.name);
  return s?.lean ? s.lean[0] + (s.lean[1] - s.lean[0]) * st.k : 0;
}
/** A rise this far over her feet starts the step even where the walk would take it (the step-up's clip at its own size). */
export const STEP_FROM = 0.12;

export type ParkourKind = Extract<TraversalKind, 'step' | 'clamber' | 'climb' | 'vault' | 'hop' | 'hangDrop' | 'leap' | 'hang'>;
const clamp = MathUtils.clamp;
const smooth = (a: number, b: number, x: number): number => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
type Stage = { name: string; at: number; clip?: string; from?: number; to?: number; fade?: number; lean?: [number, number] };
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
  clip(name: string, w: Window, E: Vector3, bump = 0, lip = E.y, fade?: number): this {
    const S = this.at.clone(), f0 = footAt(w.clip, w.from), f1 = footAt(w.clip, w.to), z0 = hipsZAt(w.clip, w.from), z1 = hipsZAt(w.clip, w.to);
    const n = Math.max(2, Math.ceil(Math.abs(w.to - w.from) / 0.05)), dt = Math.abs(w.to - w.from) / w.rate / n, fit = Math.abs(f1 - f0) > 6;
    let peak = 0; if (!fit) for (let i = 0; i <= n; i++) { const u = i / n, tau = w.from + (w.to - w.from) * u; peak = Math.max(peak, footAt(w.clip, tau) - (f0 + (f1 - f0) * u)); }
    this.stages.push({ name, at: this.t, clip: w.clip, from: w.from, to: w.to, fade });
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
  /** Her figure drawn this far toward the face she climbs through the last stage (from, to; m): see HANG_LEAN. */
  lean(from: number, to: number): this { this.stages[this.stages.length - 1].lean = [from, to]; return this; }
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
/** `walkable`: the walk could take the ground ahead, and only a sheer step at its clip's size (STEP_FROM) is wanted. */
export function planParkour(world: TraversalWorld, feet: Vector3, dx: number, dz: number, profile: Readonly<MobilityProfile>, speed = 0, walkable = false): Traversal | null {
  const len = Math.hypot(dx, dz); if (len < 1e-6) return null; dx /= len; dz /= len;
  const face = Math.atan2(-dx, -dz), at = (d: number, y: number): Vector3 => new Vector3(feet.x + dx * d, y, feet.z + dz * d);
  const ceiling = feet.y + profile.climbRise + 0.05;
  // The ground ahead: its height at each sample, and whether her body fits standing on it.
  let rise: { d: number } | null = null, edge: { d: number } | null = null;
  for (let d = SAMPLE; d <= PROBE + 1e-6; d += SAMPLE) {
    const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling);
    if (y !== null && y - feet.y > (walkable ? STEP_FROM : STEP_HEIGHT * 0.6)) { rise = { d }; break; }
    if (y === null || y < feet.y - STEP_HEIGHT) { edge = { d }; break; }
    if (!world.canOccupy(at(d, y), BODY_RADIUS * 0.5, BODY_HEIGHT * 0.5)) {
      // Something in the way at her height: the face of a rise just ahead (a wall's foot), or else an obstacle or water to clear.
      for (let e = d + SAMPLE; e <= d + 0.4 + 1e-6; e += SAMPLE) { const z = topAt(world, feet.x + dx * e, feet.z + dz * e, ceiling); if (z !== null && z - feet.y > STEP_HEIGHT * 0.6) { rise = { d: e }; break; } }
      if (!rise) edge = { d }; break;
    }
  }
  if (rise) return planUp(world, feet, dx, dz, rise.d, face, speed, profile, at, walkable);
  if (walkable) return null;
  if (edge) return planDown(world, feet, edge.d, face, speed, profile, at);
  return null;
}

type At = (d: number, y: number) => Vector3;

function planUp(world: TraversalWorld, feet: Vector3, dx: number, dz: number, d0: number, face: number, speed: number, profile: Readonly<MobilityProfile>, at: At, walkable: boolean): Traversal | null {
  const ceiling = feet.y + profile.climbRise + 0.05;
  // A vault first: a thin top no higher than VAULT, with ground beyond at about her height.
  let crest = -Infinity; for (let d = d0; d <= d0 + PARKOUR.vaultTop + 1e-6; d += SAMPLE) { const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling); if (y === null || y < crest - STEP_HEIGHT) break; crest = Math.max(crest, y); }
  if (!walkable && crest - feet.y <= PARKOUR.vault && crest - feet.y > STEP_HEIGHT * 0.6) { const v = planVault(world, feet, dx, dz, d0, crest, face, speed, at); if (v) return v; }
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
  const a = Math.max(0, d0 - SAMPLE - BODY_RADIUS - 0.02), A = at(a, Math.max(feet.y, topAt(world, feet.x + dx * a, feet.z + dz * a, feet.y + STEP_HEIGHT) ?? feet.y)), L = at(land.d, land.y), approach = a / Math.max(1.2, speed);
  // A sloped foot (a ramp, the old bridge's deck and the curb at its end, a bank) is stepped up however high the
  // landing, to a clamber's height: only a sheer face, which gains most of its rise (10% to 90%) within SHEER_W m
  // of ground, is clambered.
  let d10 = -1, d90 = -1;
  for (let d = SAMPLE; d <= land.d + BODY_RADIUS + 1e-6 && d90 < 0; d += SAMPLE) { // (the landing's height is its footprint's: the front of it)
    const y = topAt(world, feet.x + dx * d, feet.z + dz * d, ceiling); if (y === null) continue;
    if (d10 < 0 && y >= feet.y + r * 0.1) d10 = d; if (y >= feet.y + r * 0.9) d90 = d;
  }
  const sheer = d10 < 0 || d90 < 0 || d90 - d10 < SHEER_W;
  const kind: ParkourKind = r <= PARKOUR.stepUp || (!sheer && r <= PARKOUR.clamber) ? 'step' : r <= PARKOUR.clamber ? 'clamber' : 'climb';
  if (walkable && (kind !== 'step' || !sheer)) return null; // a step the walk could take: only a sheer one, at its clip's size
  if (kind === 'climb') {
    // A climb: a crouch and a jump that puts her hands on the lip, the catch, and the braced hang, where she pauses.
    const hang = Math.max(feet.y + 0.05, lip - HANG_BELOW), H = at(a, hang);
    const spot: HangSpot = { at: H, face, lip, top: L, below: A.clone() };
    return shaped(world, 'up', k => withHang(new Moves(world, feet, k).move(A, approach).clip('reach', WINDOWS.reach, at(a, hang + CATCH_OVER)).lean(0, HANG_LEAN * 0.6).clip('catch', WINDOWS.catch, H).lean(HANG_LEAN * 0.6, HANG_LEAN).done('climb', face), spot));
  }
  return shaped(world, 'up', k => {
    const m = new Moves(world, feet, k).move(A, approach);
    // A step: a knee up and the weight over, in one stride.
    if (kind === 'step') m.clip('step', WINDOWS.step, L, 0, lip);
    // A clamber: the mount where she stands (its own travel carries her figure toward the top), then up onto the top
    // as she rises from the kneel (the hang drop's rise out of its crouch), and standing.
    else m.hold('mount', WINDOWS.mount).clip('rise', WINDOWS.rise, L, 0, lip, RISE_FADE).hold('stand', WINDOWS.stand);
    return m.done(kind, face);
  });
}

/** A move that ends in the braced hang: it carries the spot, and the motor holds her there (holdPlan) until the stick
 * asks for the climb on up or the drop back down (planFromHang). */
const withHang = (plan: Traversal, spot: HangSpot): Traversal => ({ ...plan, hang: spot });
/** The braced hang held: the hang clip, looped while she waits. */
export function holdPlan(spot: HangSpot): Traversal {
  const w = WINDOWS.braced, duration = (w.to - w.from) / w.rate;
  return { kind: 'hang', from: spot.at.clone(), to: spot.at.clone(), duration, velocityY: 0, floorPath: [spot.at.clone(), spot.at.clone()], times: [0, duration], stages: [{ name: 'hang', at: 0, clip: w.clip, from: w.from, to: w.to, lean: [HANG_LEAN, HANG_LEAN] }], face: spot.face, hang: spot };
}
/** From the braced hang: 'up' pulls her onto the top, 'down' lets her go to the ground below (when there is ground she can drop to). */
export function planFromHang(world: TraversalWorld, spot: HangSpot, way: 'up' | 'down'): Traversal | null {
  if (way === 'up') return shaped(world, 'up', k => new Moves(world, spot.at, k).clip('pull', WINDOWS.pull, spot.top, 0, spot.lip).lean(HANG_LEAN, 0).done('climb', spot.face));
  const G = spot.below; if (!G || G.y > spot.at.y - 0.02) return null;
  const fallH = spot.at.y - G.y;
  const plan = new Moves(world, spot.at).fall('fall', WINDOWS.fall, G).lean(HANG_LEAN, 0).hold('land', fallH >= PARKOUR.bigLanding ? WINDOWS.landDeep : WINDOWS.rise).done('hangDrop', spot.face);
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
    // A sheer drop: the landing lies at the foot of the edge, so she turns to the wall and lowers herself into the
    // braced hang off the lip, where she pauses (the stick then says drop on, or climb back).
    if (drop >= PARKOUR.hangDrop && land.d - de <= 0.75) {
      const e = Math.max(0, de - BODY_RADIUS * 0.6), E = at(e, feet.y), hangD = de + BODY_RADIUS + 0.03, H = at(hangD, feet.y - HANG_BELOW), L = at(Math.max(hangD, land.d), land.y);
      if (H.y - land.y > 0.02) {
        // Climbing back stands her where her whole footprint is on the top again, a body's width back from the edge.
        const back = at(Math.max(0, de - BODY_RADIUS - SAMPLE - 0.02), feet.y), standsBack = supportAt(world, back.x, back.z, feet.y + 0.03) !== null;
        const spot: HangSpot = { at: H, face: face + Math.PI, lip: feet.y, top: standsBack ? back : feet.clone(), below: L };
        const plan = shaped(world, 'out', k => withHang(new Moves(world, feet, k).move(E, e / Math.max(1, speed)).clip('lower', WINDOWS.lower, H).lean(0, HANG_LEAN).done('hangDrop', face + Math.PI), spot));
        if (plan && planFromHang(world, spot, 'down')) return plan;
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
