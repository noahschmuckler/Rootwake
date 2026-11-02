// F5a (WHIP.md, Noah 2026-11-02): the whip's figures as plans. A figure is a short piece of choreography with a
// precondition (how the crowd is arranged) and a result (how it is arranged after); this module reads the
// arrangement and returns a PLAN: her path, each foe's path (with its lift off the ground and its roll onto its
// side), the clips she plays and when, the rope's reach, and the timed beats where the rules run (damage, sound,
// hit-stop). The scene plays the plan; the model's raiders are driven by it while their `choreo` clock runs.
// Pure (no Three.js): node-tested in tests/whip.test.ts.
//
// F5a builds two figures, judged on the phone before the director (F5c) and grace (F5b):
//  - the MATADOR: a foe 3 to 9 m off is lashed, hauled in along the rope; she sidesteps and clotheslines it as it
//    passes, and it lands prone behind her;
//  - the SWAP: a foe in reach is lashed and hauled; she cartwheels past it on one side while it is whirled past on
//    the other, and they have traded places; it crashes into a neighbour standing near her old spot if there is one.
// Frames: positions in the village's local frame (x, z). Her yaw is the player's (facing (-sin yaw, -cos yaw));
// a foe's heading is the raider's (facing (cos h, sin h)).

export type FigureName = 'matador' | 'swap';
export type WhipMove = 'whip-crack' | 'whip-pull' | 'sidestep-l' | 'sidestep-r' | 'cartwheel';
export interface FoeView { id: number; x: number; z: number; heading: number }
export interface Arrangement { x: number; z: number; yaw: number; foes: FoeView[] }
/** A pose at a time: where, how high off the ground (m), rolled onto its side (rad), facing. */
export interface Key { t: number; x: number; z: number; y: number; roll: number; face: number }
export interface ClipCue { t: number; move: WhipMove; dur: number }
export type BeatKind = 'lash' | 'haul' | 'clothesline' | 'land' | 'cross' | 'crash' | 'skid';
/** A moment where the rules run: `dmg` is a multiple of her strike, on `foe` (and `other`, for a crash). */
export interface Beat { t: number; kind: BeatKind; foe: number; other?: number; dmg: number }
/** The rope: from t on, its tip reaches `out` of the way from her hand to the target's chest (0 coiled, 1 there). */
export interface RopeKey { t: number; out: number }
export interface Plan {
  figure: FigureName; side: 1 | -1; target: number;
  /** Seconds the figure holds her (her own part); each foe's track runs to its own last key (prone, staggered). */
  duration: number;
  her: Key[]; foes: Map<number, Key[]>; clips: ClipCue[]; beats: Beat[]; rope: RopeKey[];
}

/** Tuning: the whip's reach (m), the matador's band, the swap's band, how far a neighbour may stand to be crashed into, how wide she sidesteps, how long a foe lies prone or staggers once its part is played. */
export const WHIP_REACH = 9, MATADOR_MIN = 3, SWAP_MIN = 1.2, SWAP_MAX = 6, CRASH_R = 2.6, SIDESTEP_M = 0.95, PRONE_S = 1.9, STAGGER_S = 1.0;
/** Tuning: what each beat deals, as a multiple of her strike. The clothesline lands like the combo's finisher. */
export const CLOTHESLINE_MULT = 1.6, CRASH_MULT = 1.0, SKID_MULT = 0.6;
/** How the stick or her facing picks the target: a foe within this cosine of the aim is preferred. */
export const AIM_COS = 0.35;

const smooth = (k: number): number => k * k * (3 - 2 * k);
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
/** The pose along a track at time t (eased between keys; held past the ends). */
export function sampleKeys(keys: Key[], t: number): Key {
  if (t <= keys[0].t) return { ...keys[0], t };
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i]; if (t > b.t) continue; const a = keys[i - 1], k = smooth(b.t > a.t ? (t - a.t) / (b.t - a.t) : 1);
    return { t, x: a.x + (b.x - a.x) * k, z: a.z + (b.z - a.z) * k, y: a.y + (b.y - a.y) * k, roll: a.roll + (b.roll - a.roll) * k, face: a.face + wrap(b.face - a.face) * k };
  }
  return { ...keys[keys.length - 1], t };
}
/** How far out the rope is at time t (linear between keys). */
export function ropeAt(rope: RopeKey[], t: number): number {
  if (t <= rope[0].t) return rope[0].out;
  for (let i = 1; i < rope.length; i++) { const a = rope[i - 1], b = rope[i]; if (t <= b.t) return a.out + (b.out - a.out) * (b.t > a.t ? (t - a.t) / (b.t - a.t) : 1); }
  return rope[rope.length - 1].out;
}
/** Where a track ends (its last key's time). */
export const trackEnd = (keys: Key[]): number => keys[keys.length - 1].t;

/** Which figures fit a foe at distance d. */
export function figuresFor(d: number): FigureName[] { const f: FigureName[] = []; if (d >= MATADOR_MIN && d <= WHIP_REACH) f.push('matador'); if (d >= SWAP_MIN && d <= SWAP_MAX) f.push('swap'); return f; }

/** The foe she means: the stick's way (or her facing) within reach, nearest to the aim's line; any within reach when none is ahead. */
export function pickTarget(arr: Arrangement, aim?: { x: number; z: number } | null): FoeView | null {
  const fx = aim ? aim.x : -Math.sin(arr.yaw), fz = aim ? aim.z : -Math.cos(arr.yaw), fl = Math.hypot(fx, fz) || 1;
  let best: FoeView | null = null, bs = -Infinity;
  for (const f of arr.foes) {
    const dx = f.x - arr.x, dz = f.z - arr.z, d = Math.hypot(dx, dz); if (d > WHIP_REACH || d < SWAP_MIN * 0.5) continue;
    const c = (dx * fx + dz * fz) / (d * fl), s = (c > AIM_COS ? 2 : 0) + c - d / WHIP_REACH * 0.6;
    if (s > bs) { bs = s; best = f; }
  }
  return best;
}

/**
 * Plan the next figure: the target picked by `aim` (the stick, or her facing), the figure by what fits its
 * distance, the one she did not do last preferred where both fit; its side the free one (`canStand` is asked along
 * her path and where the foe ends). Null when no foe is in reach or no side is clear.
 */
export function planFigure(arr: Arrangement, opts: { aim?: { x: number; z: number } | null; last?: FigureName | null; canStand?: (x: number, z: number) => boolean; side?: 1 | -1; figure?: FigureName } = {}): Plan | null {
  const target = pickTarget(arr, opts.aim); if (!target) return null;
  const d = Math.hypot(target.x - arr.x, target.z - arr.z), fits = figuresFor(d); if (!fits.length) return null;
  const order = opts.figure ? [opts.figure] : fits.length > 1 && opts.last ? [...fits.filter(f => f !== opts.last), ...fits.filter(f => f === opts.last)] : fits;
  const can = opts.canStand ?? (() => true);
  for (const figure of order) {
    if (!fits.includes(figure)) continue;
    const first: 1 | -1 = opts.side ?? sideAway(arr, target);
    for (const side of [first, -first as 1 | -1]) {
      const plan = figure === 'matador' ? matador(arr, target, side) : swap(arr, target, side);
      if (clear(plan, can)) return plan;
    }
  }
  return null;
}
/** The side with fewer foes on it (her right is +1): she flows away from the crowd. */
function sideAway(arr: Arrangement, target: FoeView): 1 | -1 {
  const ux = target.x - arr.x, uz = target.z - arr.z, rx = -uz, rz = ux; let w = 0;
  for (const f of arr.foes) if (f.id !== target.id) w += Math.sign((f.x - arr.x) * rx + (f.z - arr.z) * rz);
  return w > 0 ? -1 : 1;
}
/** Her path and each foe's end stand on walkable ground. */
function clear(plan: Plan, can: (x: number, z: number) => boolean): boolean {
  for (let t = 0; t <= plan.duration + 1e-6; t += 0.1) { const p = sampleKeys(plan.her, t); if (!can(p.x, p.z)) return false; }
  for (const keys of plan.foes.values()) { const e = keys[keys.length - 1]; if (!can(e.x, e.z)) return false; }
  return true;
}

/** Her yaw facing along (dx, dz); a foe's heading along (dx, dz). */
const yawTo = (dx: number, dz: number): number => Math.atan2(-dx, -dz);
const headTo = (dx: number, dz: number): number => Math.atan2(dz, dx);

/** The matador (one foe 3–9 m off): lashed at 0.22 s, hauled in face first along the rope while she sidesteps out of its line, clotheslined as it passes her shoulder, its legs thrown up, and down prone behind her. */
function matador(arr: Arrangement, f: FoeView, side: 1 | -1): Plan {
  const d = Math.hypot(f.x - arr.x, f.z - arr.z), ux = (f.x - arr.x) / d, uz = (f.z - arr.z) / d, rx = -uz * side, rz = ux * side;
  const H = { x: arr.x, z: arr.z }, face = yawTo(ux, uz), at = (k: number, s: number) => ({ x: H.x + ux * k + rx * s, z: H.z + uz * k + rz * s });
  // Timing: the lash, the haul (longer for a farther foe), the pass at her shoulder, the landing.
  const LASH = 0.22, PASS = LASH + 0.3 + d * 0.035, LAND = PASS + 0.34, END = PASS + 0.62;
  const s = at(0, SIDESTEP_M), her: Key[] = [
    { t: 0, ...H, y: 0, roll: 0, face },
    { t: LASH + 0.05, ...H, y: 0, roll: 0, face },
    { t: PASS - 0.06, ...s, y: 0, roll: 0, face },
    // The matador's turn: she pivots to watch it go down behind her.
    { t: END, ...s, y: 0, roll: 0, face: yawTo(-ux, -uz) },
  ];
  const towardHer = headTo(-ux, -uz), pass = at(0, 0.05), down = at(-2.4, -0.15);
  const foe: Key[] = [
    { t: 0, x: f.x, z: f.z, y: 0, roll: 0, face: f.heading },
    { t: LASH, x: f.x, z: f.z, y: 0, roll: 0, face: towardHer },
    // Yanked off its feet toward her, low and fast.
    { t: LASH + 0.1, ...at(d - 0.4, 0), y: 0.18, roll: 0, face: towardHer },
    { t: PASS, ...pass, y: 0.32, roll: 0, face: towardHer },
    // The clothesline: its legs fly up over its head, it turns over in the air and lands on its side.
    { t: PASS + 0.17, ...at(-1.3, -0.08), y: 0.75, roll: side * 0.9, face: towardHer + side * 0.6 },
    { t: LAND, ...down, y: 0, roll: side * 1.45, face: towardHer + side * 1.1 },
    { t: LAND + PRONE_S, ...down, y: 0, roll: side * 1.45, face: towardHer + side * 1.1 },
    // Up again, groggy.
    { t: LAND + PRONE_S + 0.45, ...down, y: 0, roll: 0, face: towardHer + side * 1.1 },
  ];
  return {
    figure: 'matador', side, target: f.id, duration: END, her, foes: new Map([[f.id, foe]]),
    clips: [{ t: 0, move: 'whip-crack', dur: 0.36 }, { t: 0.3, move: 'whip-pull', dur: Math.max(0.3, PASS - 0.45) }, { t: PASS - 0.2, move: side > 0 ? 'sidestep-r' : 'sidestep-l', dur: 0.75 }],
    beats: [{ t: LASH, kind: 'lash', foe: f.id, dmg: 0 }, { t: LASH + 0.1, kind: 'haul', foe: f.id, dmg: 0 }, { t: PASS, kind: 'clothesline', foe: f.id, dmg: CLOTHESLINE_MULT }, { t: LAND, kind: 'land', foe: f.id, dmg: 0 }],
    rope: [{ t: 0, out: 0 }, { t: 0.08, out: 0 }, { t: LASH, out: 1 }, { t: PASS, out: 1 }, { t: PASS + 0.22, out: 0 }],
  };
}

/** The swap (one foe 1.2–6 m off): lashed and hauled a step, then she cartwheels past it on one side while it is whirled past her on the other; they trade places, and it crashes into a neighbour by her old spot (or skids there). */
function swap(arr: Arrangement, f: FoeView, side: 1 | -1): Plan {
  const d = Math.hypot(f.x - arr.x, f.z - arr.z), ux = (f.x - arr.x) / d, uz = (f.z - arr.z) / d, rx = -uz * side, rz = ux * side;
  const H = { x: arr.x, z: arr.z }, face = yawTo(ux, uz), at = (k: number, s: number) => ({ x: H.x + ux * k + rx * s, z: H.z + uz * k + rz * s });
  const LASH = 0.2, HAUL = 0.5, CROSS = 0.92, END = 1.36, ARRIVE = 1.12;
  // The foe is hauled a little nearer first; they cross at the middle.
  const near = Math.max(1.1, d - 0.7), mid = near / 2;
  const her: Key[] = [
    { t: 0, ...H, y: 0, roll: 0, face },
    { t: HAUL, ...at(-0.15, 0), y: 0, roll: 0, face },
    { t: CROSS, ...at(mid, 0.75), y: 0, roll: 0, face },
    { t: END - 0.12, ...at(near + 0.25, 0.1), y: 0, roll: 0, face },
    // She ends where it stood, turned back to face it.
    { t: END, ...at(near + 0.25, 0.1), y: 0, roll: 0, face: yawTo(-ux, -uz) },
  ];
  // A neighbour by her old spot takes the crash.
  let crash: FoeView | null = null, cd = CRASH_R; for (const o of arr.foes) { if (o.id === f.id) continue; const dd = Math.hypot(o.x - H.x, o.z - H.z); if (dd < cd) { cd = dd; crash = o; } }
  const away = headTo(-ux, -uz), foe: Key[] = [
    { t: 0, x: f.x, z: f.z, y: 0, roll: 0, face: f.heading },
    { t: LASH, x: f.x, z: f.z, y: 0, roll: 0, face: headTo(-ux, -uz) },
    { t: HAUL, ...at(near, 0), y: 0.05, roll: 0, face: headTo(-ux, -uz) },
    // Whirled past her on the other side, off its feet.
    { t: CROSS, ...at(mid, -0.75), y: 0.55, roll: -side * 0.5, face: away + Math.PI * 0.5 * side },
  ];
  const foes = new Map<number, Key[]>(), beats: Beat[] = [{ t: LASH, kind: 'lash', foe: f.id, dmg: 0 }, { t: HAUL, kind: 'haul', foe: f.id, dmg: 0 }, { t: CROSS, kind: 'cross', foe: f.id, dmg: 0 }];
  if (crash) {
    const cx = crash.x - H.x, cz = crash.z - H.z, cl = Math.hypot(cx, cz) || 1, hit = { x: crash.x - cx / cl * 0.75, z: crash.z - cz / cl * 0.75 };
    // Into the neighbour, both knocked down a moment.
    const dir = Math.hypot(hit.x - at(mid, -0.75).x, hit.z - at(mid, -0.75).z) > 0.01 ? headTo(crash.x - at(mid, -0.75).x, crash.z - at(mid, -0.75).z) : away;
    foe.push({ t: ARRIVE, ...hit, y: 0.1, roll: side * 0.8, face: dir }, { t: ARRIVE + 0.2, ...hit, y: 0, roll: side * 1.3, face: dir }, { t: ARRIVE + 0.2 + STAGGER_S, ...hit, y: 0, roll: side * 1.3, face: dir }, { t: ARRIVE + 0.65 + STAGGER_S, ...hit, y: 0, roll: 0, face: dir });
    const kx = cx / cl, kz = cz / cl, knocked = { x: crash.x + kx * 0.9, z: crash.z + kz * 0.9 };
    foes.set(crash.id, [
      { t: 0, x: crash.x, z: crash.z, y: 0, roll: 0, face: crash.heading },
      { t: ARRIVE, x: crash.x, z: crash.z, y: 0, roll: 0, face: crash.heading },
      { t: ARRIVE + 0.25, ...knocked, y: 0.2, roll: -side * 0.7, face: headTo(-kx, -kz) },
      { t: ARRIVE + 0.45, ...knocked, y: 0, roll: -side * 1.3, face: headTo(-kx, -kz) },
      { t: ARRIVE + 0.45 + STAGGER_S, ...knocked, y: 0, roll: -side * 1.3, face: headTo(-kx, -kz) },
      { t: ARRIVE + 0.9 + STAGGER_S, ...knocked, y: 0, roll: 0, face: headTo(-kx, -kz) },
    ]);
    beats.push({ t: ARRIVE, kind: 'crash', foe: f.id, other: crash.id, dmg: CRASH_MULT });
  } else {
    // No one to crash into: it skids down by her old spot, staggered, facing away from her.
    const skid = at(-0.6, -0.3);
    foe.push({ t: ARRIVE, ...skid, y: 0, roll: side * 0.5, face: away }, { t: ARRIVE + STAGGER_S, ...skid, y: 0, roll: side * 0.5, face: away }, { t: ARRIVE + STAGGER_S + 0.35, ...skid, y: 0, roll: 0, face: away });
    beats.push({ t: ARRIVE, kind: 'skid', foe: f.id, dmg: SKID_MULT });
  }
  foes.set(f.id, foe);
  return {
    figure: 'swap', side, target: f.id, duration: END, her, foes,
    clips: [{ t: 0, move: 'whip-crack', dur: 0.32 }, { t: 0.26, move: 'whip-pull', dur: 0.32 }, { t: HAUL + 0.02, move: 'cartwheel', dur: END - HAUL - 0.02 }],
    beats: beats.sort((a, b) => a.t - b.t),
    rope: [{ t: 0, out: 0 }, { t: 0.06, out: 0 }, { t: LASH, out: 1 }, { t: CROSS, out: 1 }, { t: CROSS + 0.25, out: 0 }],
  };
}

/** The plan as it plays: advance by seconds, get the beats that fell due (each once). */
export class Flow {
  t = 0; private next = 0;
  constructor(readonly plan: Plan) {}
  get done(): boolean { return this.t >= this.plan.duration; }
  /** The foes' tracks run past her part (lying prone, staggered): the longest. */
  get end(): number { let e = this.plan.duration; for (const k of this.plan.foes.values()) e = Math.max(e, trackEnd(k)); return e; }
  step(dt: number): Beat[] { this.t += dt; const out: Beat[] = []; const b = this.plan.beats; while (this.next < b.length && b[this.next].t <= this.t) out.push(b[this.next++]); return out; }
}
