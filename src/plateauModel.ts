// The plateau (Noah, 2026-10-19; PLATEAU.md): the land on top of the karst-mountain, as rules. A
// circular plateau PLATEAU_R in radius round the one karst, ringed by mountains; a lake at its centre
// with the karst on a small island, joined to the shore by an old stone bridge; rivers that rise in
// the mountains and run down to the lake, each through a village (following a river brings her to
// one), and are barriers but at their crossings: the village at the ford's ford, footbridges, stepping
// stones. The heights here are the land's shape before erosion and the carving after it; the eroded
// grid itself is the renderer's (plateauLand.ts). Pure: no Three.js, node-tested.
import { gradientNoise, fbm, ridged, rng, type Noise } from './vistaTerrain';
import { KARST_AT, villageSites, lairPlace, places, FOOT } from './overworldModel';
import { convergences, RING_FOOT } from './chunkModel';
import { STREAM_Z, STREAM_REACH, MEADOW_RADIUS } from './villageModel';
import { TAINT } from './taintModel';

const smooth = (a: number, b: number, x: number): number => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

/** The plateau's radius about the karst; the lake's mean radius and its shore's wobble; the island's; the water's surface (the karst's floor and the island are at 0). Tuning. */
export const PLATEAU_R = 1800, LAKE_R = 215, LAKE_WOBBLE = 12, ISLAND_R = 104, WATER_Y = -1.2, LAKE_DEPTH = 9;
/** The shore: the ground falls to the water over LAKE_SHORE m inland of the lake's edge; a river's bank carving reaches BANK_REACH m from its centreline. */
export const LAKE_SHORE = 40, BANK_REACH = 8 + 12;
/** The plateau's rise from the lake's shore to its rim (m), the hills over it (m) and their ridged crests (m), the mountains past the rim: their climb (m) and how much of a ring they take to rise. Tuning. */
export const RIM_RISE = 85, HILL_M = 24, RIDGE_M = 22, MOUNTAIN_RISE = 650;
/** T6, the brink (Noah, 2026-10-21): the mountains are a belt, not a wall. They rise over MOUNTAIN_RISE to their crest and past it the land falls away
 * as an escarpment, ESCARP m of run to a lowland LOW_Y below, into a sea of cloud at CLOUD_Y: far below the rim's foot (RIM_RISE over the lake), far
 * above the lowland, so a break in it is a long way down. PASS_N passes cross the belt, each a saddle PASS_RISE above the rim, PASS_HALF m wide
 * (walkable only there past PASS_FOOT into the belt), ending at a brink BRINK_PAST past the crest where she may stand and look down; the rest is
 * too steep. PEAK_N outer peaks stand through the cloud beyond. Tuning. */
export const ESCARP = 950, RIDGE_FALL = 180, LOW_Y = -2300, CLOUD_Y = -260, PASS_N = 3, PASS_RISE = 190, PASS_HALF = 11, PASS_FOOT = 40, BRINK_PAST = 6, PEAK_N = 6, BRINK_LEVEL_R = 3.5;
/** A village's ground: flat within TERRACE_R of its green (the layouts' meadow), blending out over TERRACE_FADE; it stands BANK_H above its river. Tuning. */
export const TERRACE_R = 90, TERRACE_FADE = 70, BANK_H = 1.6;
/** Rivers: half width at the source and at the mouth (m), the channel's depth below the surface, the valley's half width from source to mouth, how far upstream of the rim a river rises. Tuning. */
export const RIVER_HALF: [number, number] = [3.6, 8], RIVER_DEPTH = 1.6, VALLEY: [number, number] = [45, 150], SOURCE_PAST = 140;
/** T7 (PLATEAU.md, every place stands clear): through a village the river is its stream: VILLAGE_HALF m across (the layout's stream site stands at its edge, its trees on the bank) and level across the whole terrace at the green's own level, falling before and after over the terrace's fade. Tuning. */
export const VILLAGE_HALF = 2.4;
/** T7: a footprint is level when the ground rises no more than LEVEL_SLOPE of its width across it (every den, ring, ruin, wallow and moot is seated as one piece at its centre's height); the land then makes a level pad of every place's footprint, at its centre's height, blending out over PAD_FADE (the erosion's gullies and the hills' own grade ran through them). Tuning. */
export const LEVEL_SLOPE = 0.1, PAD_FADE = 8;
/** Crossings: a river is crossed every CROSS_EVERY m of its course (stepping stones and footbridges by turns), never within CROSS_CLEAR of the lake or of another crossing; a ford's water is FORD_DEPTH deep, walkable (below WADE_DEPTH). Tuning. */
export const CROSS_EVERY = 420, CROSS_CLEAR = 90, FORD_DEPTH = 0.22, WADE_DEPTH = 0.35, FORD_HALF_LEN = 7;
/** The island's bridge: its width and the height of its deck's crown over the water. Tuning. */
export const BRIDGE_HALF_W = 1.6, BRIDGE_CROWN = 4.2;
/** A footbridge: how far past each bank it reaches, its half width, its arch's rise. Tuning. */
export const FOOTBRIDGE_OVER = 2.2, FOOTBRIDGE_HALF_W = 0.7, FOOTBRIDGE_RISE = 0.55;

export interface P { x: number; z: number }
export type CrossingKind = 'ford' | 'stones' | 'footbridge';
export interface Crossing { id: string; kind: CrossingKind; river: string; x: number; z: number; /** The river's direction there (radians, atan2(dz, dx)). */ along: number; /** The index on the river's course. */ i: number; half: number }
export interface River {
  id: string; name: string; village: string | null;
  /** The course, source to mouth, every RIVER_STEP m; at each point its half width and its water's surface height. */
  points: P[]; half: number[]; surface: number[];
  length: number;
}
export interface Bridge { from: P; to: P; halfW: number; crown: number }
/** T6: a pass through the belt (its bearing from the centre) and the brink at its end, where she can stand at the lip. */
export interface Brink { id: string; name: string; x: number; z: number; angle: number }
export interface Plateau {
  seed: number; centre: P; radius: number;
  lakeR(angle: number): number; islandR: number; waterY: number;
  rivers: River[]; crossings: Crossing[]; bridge: Bridge;
  /** Each village's green and the height of its ground. */
  terraces: { id: string; x: number; z: number; y: number }[];
  /** The land's shape before erosion (what the grid starts from): the bowl, the hills, the mountains, the valleys roughed in. */
  base(x: number, z: number): number;
  /** The final ground: `grid` (the eroded shape, or `base` when there is none) with the terraces, the places' pads (T7; `padded` false leaves them out: the natural ground the places are judged on), the lake, the island and the channels carved in. */
  ground(x: number, z: number, grid?: (x: number, z: number) => number, padded?: boolean): number;
  /** Water at a point: in the lake or a river, the surface and how deep; null when dry. T7: `padded` false reads the natural ground (the places are judged on it, so their judging never depends on the pads they make). */
  water(x: number, z: number, padded?: boolean): { kind: 'lake' | 'river'; surface: number; depth: number; river?: string } | null;
  /** The nearest river point: which river, which point, how far, and its half width there. */
  nearRiver(x: number, z: number, reach?: number): { river: River; i: number; d: number; half: number } | null;
  /** The bridge's deck where (x, z) is on it, else null. */
  deckAt(x: number, z: number): number | null;
  /** How far into the mountains (m past the rim; negative inside). */
  into(x: number, z: number): number;
  /** T6: the passes' brinks, and how far inside a pass a point lies (0 off it, 1 on its line). */
  brinks: Brink[]; passAt(x: number, z: number): number;
}

const RIVER_STEP = 4;
const cache = new Map<number, Plateau>();
export function plateau(seed: number): Plateau { let p = cache.get(seed); if (!p) { p = build(seed); cache.set(seed, p); } return p; }

function build(seed: number): Plateau {
  const C: P = { x: KARST_AT.x, z: KARST_AT.z };
  const nLake = gradientNoise(seed * 13 + 1), nHill = gradientNoise(seed * 13 + 2), nWarp = gradientNoise(seed * 13 + 3), nRidge = gradientNoise(seed * 13 + 4), nDetail = gradientNoise(seed * 13 + 5);
  const polar = (x: number, z: number) => ({ r: Math.hypot(x - C.x, z - C.z), a: Math.atan2(z - C.z, x - C.x) });
  const lakeR = (a: number): number => LAKE_R + LAKE_WOBBLE * (nLake(Math.cos(a) * 1.7, Math.sin(a) * 1.7) * 0.7 + nLake(Math.cos(a) * 4 + 9, Math.sin(a) * 4) * 0.3);
  const into = (x: number, z: number): number => polar(x, z).r + 90 * fbm(nWarp, x * 0.0012, z * 0.0012, 3) - PLATEAU_R;
  const hills = (x: number, z: number): number => HILL_M * (fbm(nHill, x * 0.0032, z * 0.0032, 4) + 0.3 * fbm(nDetail, x * 0.011, z * 0.011, 3)) + RIDGE_M * (ridged(nWarp, x * 0.0021 + 3.1, z * 0.0021 - 7.7, 4) - 0.35);
  // T6: the passes, each a bearing; set after the rivers (they keep clear of the rivers' sources), read by the bowl.
  const passAngles: number[] = [];
  const wrapA = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
  /** How far inside a pass (0..1): within PASS_HALF of its line (measured across, at the point's radius) it is 1, fading out over 30 m more; only through the belt, from a little inside the rim to the brink. */
  const passAt = (x: number, z: number): number => {
    const { r, a } = polar(x, z), d = into(x, z); if (d < -140 || d > MOUNTAIN_RISE + 400) return 0;
    let best = 0; for (const pa of passAngles) { const across = Math.abs(wrapA(a - pa)) * r; best = Math.max(best, 1 - smooth(PASS_HALF, PASS_HALF + 30, across)); }
    // The notch runs on through the crest and down the fall (nothing stands over the brink); walkable() ends the pass at the brink itself.
    return best * smooth(-140, -60, d) * (1 - smooth(MOUNTAIN_RISE + 200, MOUNTAIN_RISE + 400, d));
  };
  /** The lowland far below the belt: a great plain with its own slow hills, and the outer peaks that stand through the cloud. */
  const peaks = Array.from({ length: PEAK_N }, (_, i) => { const rand = rng(seed * 331 + i * 17 + 5); const a = (i / PEAK_N) * Math.PI * 2 + rand() * 0.8, dist = 3500 + rand() * 1900; return { x: C.x + Math.cos(a) * dist, z: C.z + Math.sin(a) * dist, r: 950 + rand() * 500, top: CLOUD_Y + 260 + rand() * 420 }; });
  const lowland = (x: number, z: number): number => {
    let h = LOW_Y + 220 * fbm(nHill, x * 0.0005 + 3, z * 0.0005 - 2, 4) + 70 * (ridged(nRidge, x * 0.0012 + 1, z * 0.0012 + 1, 4) - 0.4);
    for (const pk of peaks) { const dd = Math.hypot(x - pk.x, z - pk.z); if (dd < pk.r) { const t = 1 - smooth(0, 1, dd / pk.r); const ph = LOW_Y + (pk.top - LOW_Y) * Math.pow(t, 0.8) + 110 * ridged(nRidge, x * 0.003, z * 0.003, 4) * t; h = Math.max(h, ph); } }
    return h;
  };
  /** The bowl: the lake's shore at the water, rising to the rim, hills over it (calmer near the lake), the belt of mountains beyond, and past the crest the fall to the lowland (T6). */
  const bowl = (x: number, z: number): number => {
    const { r } = polar(x, z), k = smooth(LAKE_R, PLATEAU_R, r), d = into(x, z);
    let h = WATER_Y + 1.4 + RIM_RISE * Math.pow(k, 1.35) + hills(x, z) * smooth(LAKE_R, LAKE_R + 420, r);
    if (d > 0) {
      const dm = Math.min(d, MOUNTAIN_RISE), m = smooth(0, MOUNTAIN_RISE, dm), rr = ridged(nRidge, x * 0.0016, z * 0.0016, 6);
      let mt = m ** 1.25 * (50 + 520 * rr) + m * fbm(nDetail, x * 0.004, z * 0.004, 4) * 18;
      // A pass: the ridge notched to a saddle, a steady climb from the rim.
      const pw = passAt(x, z); if (pw > 0) mt = mt * (1 - pw) + (PASS_RISE * smooth(0, MOUNTAIN_RISE, dm) + m * fbm(nDetail, x * 0.004, z * 0.004, 4) * 6) * pw;
      // Past the crest the ridge collapses within RIDGE_FALL m (the brink looks out, not at a wall) and the escarpment takes the land down to the lowland, steepest at the top.
      if (d > MOUNTAIN_RISE) { h += mt * (1 - smooth(0, RIDGE_FALL, d - MOUNTAIN_RISE)); const e = Math.pow(smooth(0, ESCARP, d - MOUNTAIN_RISE), 0.72); h = h + (lowland(x, z) - h) * e; }
      else h += mt;
    }
    return h;
  };

  // ── the rivers ──
  const sites = villageSites(seed), lair = lairPlace(seed);
  const villages = [{ id: 'village', x: 0, z: 0 }, ...sites.map(s => ({ id: s.id, x: s.x, z: s.z }))];
  const r0 = rng(seed * 7121 + 13);
  /** A village's stream (its layout's), as world points from one end to the other along +x. */
  const streamOf = (v: P): P[] => { const out: P[] = []; for (let x = -STREAM_REACH; x <= STREAM_REACH; x += RIVER_STEP) out.push({ x: v.x + x, z: v.z + STREAM_Z(x) }); return out; };
  /** A meandering course from a to b: the straight line bent by midpoint displacement, then sampled every RIVER_STEP. */
  const meander = (a: P, b: P, rand: () => number, wiggle = 0.16): P[] => {
    let pts: P[] = [a, b];
    for (let level = 0; level < 5; level++) {
      const next: P[] = [pts[0]];
      for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i], len = Math.hypot(q.x - p.x, q.z - p.z), nx = -(q.z - p.z) / (len || 1), nz = (q.x - p.x) / (len || 1), off = (rand() - 0.5) * 2 * wiggle * len; next.push({ x: (p.x + q.x) / 2 + nx * off, z: (p.z + q.z) / 2 + nz * off }, q); }
      pts = next;
    }
    return resample(pts, RIVER_STEP);
  };
  const angleOf = (p: P): number => Math.atan2(p.z - C.z, p.x - C.x);
  const onCircle = (a: number, r: number): P => ({ x: C.x + Math.cos(a) * r, z: C.z + Math.sin(a) * r });
  const rivers: River[] = [];
  const NAMES = ['the Mill-water', 'the Fordwater', 'the Pinebrook', 'the Greyrun', 'the Coldwell', 'the Long Burn'];
  // A village's river: down from the mountains to the upper end of its stream, through it, and on down to the lake on the stream's lower side.
  for (const v of villages) {
    const st = streamOf(v), first = st[0], last = st[st.length - 1], upFirst = Math.hypot(first.x - C.x, first.z - C.z) >= Math.hypot(last.x - C.x, last.z - C.z);
    const through = upFirst ? st : st.slice().reverse(), top = through[0], bottom = through[through.length - 1];
    let best: P[] | null = null;
    for (let tries = 0; tries < 24 && !best; tries++) {
      const rand = rng(seed * 917 + tries * 31 + Math.round(v.x) * 3 + Math.round(v.z));
      const srcA = angleOf(top) + (rand() - 0.5) * 0.5, src = onCircle(srcA, PLATEAU_R + SOURCE_PAST);
      // To the lake from the stream's lower end: the shore toward which it already points, bent a little.
      const mouthA = angleOf(bottom) + (rand() - 0.5) * 0.35, mouth = onCircle(mouthA, lakeR(mouthA) - 14);
      const course = [...meander(src, top, rand), ...through.slice(1), ...meander(bottom, mouth, rand, 0.12).slice(1)];
      if (ok(course, v.id)) best = course;
    }
    if (best) rivers.push(finish(`river:${v.id}`, v.id === 'village' ? NAMES[0] : NAMES[1 + sites.findIndex(s => s.id === v.id)] ?? NAMES[3], v.id, best));
  }
  // Two wild rivers, into the widest gaps between the others (and away from the dark forest), with no village on them.
  for (let w = 0; w < 2; w++) {
    const taken = [...rivers.map(r => angleOf(r.points[0])), angleOf(lair)].sort((a, b) => a - b);
    let gap = 0, at = 0; for (let i = 0; i < taken.length; i++) { const a = taken[i], b = i + 1 < taken.length ? taken[i + 1] : taken[0] + Math.PI * 2; if (b - a > gap) { gap = b - a; at = a + (b - a) / 2; } }
    let best: P[] | null = null;
    for (let tries = 0; tries < 24 && !best; tries++) { const rand = rng(seed * 401 + w * 97 + tries * 13); const a = at + (rand() - 0.5) * gap * 0.3, src = onCircle(a, PLATEAU_R + SOURCE_PAST), ma = a + (rand() - 0.5) * 0.6, mouth = onCircle(ma, lakeR(ma) - 14); const course = meander(src, mouth, rand, 0.2); if (ok(course, null)) best = course; }
    if (best) rivers.push(finish(`river:wild-${w}`, NAMES[3 + w], null, best));
  }
  void r0;
  /** A course is good when it keeps off the other villages' greens, the island, the dark forest's heart and the other rivers. */
  function ok(course: P[], own: string | null): boolean {
    const mine = villages.find(v => v.id === own);
    for (const p of course) {
      for (const v of villages) if (v.id !== own && Math.hypot(p.x - v.x, p.z - v.z) < TERRACE_R + 50) return false;
      // T7: its own village's meadow and the wood round it (the layout's trees stand out to MEADOW_RADIUS + 36) only along the stream itself, never on the way in or out.
      if (mine && Math.hypot(p.x - mine.x, p.z - mine.z) < MEADOW_RADIUS + 40 && !(Math.abs(p.x - mine.x) <= STREAM_REACH && Math.abs(p.z - mine.z - STREAM_Z(p.x - mine.x)) < 1)) return false;
      // Out of the taint and its veins (the creature session: no river through her biome).
      if (Math.hypot(p.x - lair.x, p.z - lair.z) < TAINT.edge + TAINT.veins) return false;
      if (Math.hypot(p.x - C.x, p.z - C.z) < ISLAND_R + 40) return false;
      for (const r of rivers) for (let i = 0; i < r.points.length; i += 3) { const q = r.points[i]; if (Math.hypot(p.x - q.x, p.z - q.z) < 60 && Math.hypot(q.x - C.x, q.z - C.z) > LAKE_R + 30) return false; }
    }
    return true;
  }
  function finish(id: string, name: string, village: string | null, points: P[]): River {
    const n = points.length, half: number[] = [], surface: number[] = []; let length = 0;
    for (let i = 0; i < n; i++) { if (i) length += Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z); }
    let run = 0, s = Infinity;
    for (let i = 0; i < n; i++) {
      if (i) run += Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z);
      const k = run / (length || 1); half.push(lerp(RIVER_HALF[0], RIVER_HALF[1], k));
      // The water never climbs: the bowl a little under the bank, never above where it has been, never below the lake's.
      s = Math.min(s, bowl(points[i].x, points[i].z) - 1.2 - 0.4 * k); surface.push(Math.max(WATER_Y, s));
    }
    // T7: through its village the river is the stream: level across the terrace at the level the green stands BANK_H over (it fell at the land's own
    // grade before, up to several metres above the green on the upstream side and in a gorge below it), and VILLAGE_HALF across. Both blend out over the
    // terrace's fade; the running minimum keeps it falling where the course wanders back.
    const v = village ? villages.find(q => q.id === village) : undefined;
    if (v) {
      let bi = 0, bd = Infinity; for (let i = 0; i < n; i++) { const d = Math.hypot(points[i].x - v.x, points[i].z - v.z - STREAM_Z(0)); if (d < bd) { bd = d; bi = i; } }
      const sv = surface[bi];
      for (let i = 0; i < n; i++) { const d = Math.hypot(points[i].x - v.x, points[i].z - v.z); surface[i] = sv + (surface[i] - sv) * smooth(TERRACE_R, TERRACE_R + TERRACE_FADE, d); half[i] = lerp(VILLAGE_HALF, half[i], smooth(TERRACE_R, TERRACE_R + 60, d)); }
      for (let i = 1; i < n; i++) surface[i] = Math.min(surface[i], surface[i - 1]);
    }
    // Into the lake, the last stretch eases down to the water's surface.
    for (let i = Math.max(0, n - 12); i < n; i++) surface[i] = lerp(surface[Math.max(0, n - 13)], WATER_Y, (i - (n - 13)) / 12);
    return { id, name, village, points, half, surface, length };
  }

  // ── where rivers are near: a field of the nearest river point, FIELD_CELL m a cell, out to the widest valley (a multi-source flood from every point) ──
  const FIELD_CELL = 6, REACH = VALLEY[1] + 12, fx0 = C.x - PLATEAU_R - SOURCE_PAST - REACH - 20, fz0 = C.z - PLATEAU_R - SOURCE_PAST - REACH - 20, FN = Math.ceil((2 * (PLATEAU_R + SOURCE_PAST + REACH + 20)) / FIELD_CELL);
  const pts: { r: River; i: number }[] = []; for (const r of rivers) for (let i = 0; i < r.points.length; i++) pts.push({ r, i });
  const field = new Int32Array(FN * FN).fill(-1), fd = new Float32Array(FN * FN).fill(Infinity);
  // Every point stamps the cells within reach that it is nearest to (5 rivers of some 500 points, a disc of about 2300 cells each).
  { const rc = Math.ceil(REACH / FIELD_CELL);
    pts.forEach((e, k) => { const p = e.r.points[e.i], ci = Math.floor((p.x - fx0) / FIELD_CELL), cj = Math.floor((p.z - fz0) / FIELD_CELL);
      for (let jj = Math.max(0, cj - rc); jj <= Math.min(FN - 1, cj + rc); jj++) for (let ii = Math.max(0, ci - rc); ii <= Math.min(FN - 1, ci + rc); ii++) { const c = jj * FN + ii, d = Math.hypot((ii + 0.5) * FIELD_CELL + fx0 - p.x, (jj + 0.5) * FIELD_CELL + fz0 - p.z); if (d <= REACH + FIELD_CELL && d < fd[c]) { fd[c] = d; field[c] = k; } } }); }
  function nearRiver(x: number, z: number, reach = REACH): { river: River; i: number; d: number; half: number } | null {
    const ci = Math.floor((x - fx0) / FIELD_CELL), cj = Math.floor((z - fz0) / FIELD_CELL); if (ci < 1 || cj < 1 || ci >= FN - 1 || cj >= FN - 1) return null;
    let best: { river: River; i: number; d: number; half: number } | null = null, seen = -2;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const k = field[(cj + dj) * FN + ci + di]; if (k < 0 || k === seen) continue; seen = k; const e = pts[k], p = e.r.points[e.i];
      // The distance to the segment on either side of the point, so the channel's edge is smooth between samples.
      for (const j of [e.i - 1, e.i + 1]) { if (j < 0 || j >= e.r.points.length) continue; const q = e.r.points[j], dx = q.x - p.x, dz = q.z - p.z, t = Math.min(1, Math.max(0, ((x - p.x) * dx + (z - p.z) * dz) / (dx * dx + dz * dz || 1))), d = Math.hypot(x - p.x - dx * t, z - p.z - dz * t);
        if (d <= reach && (!best || d < best.d)) best = { river: e.r, i: t < 0.5 ? e.i : j, d, half: lerp(e.r.half[e.i], e.r.half[j], t) }; }
    }
    return best;
  }

  // ── the villages' terraces ──
  const terraces = villages.map(v => {
    const r = rivers.find(q => q.village === v.id); let y = bowl(v.x, v.z);
    if (r) { let bi = 0, bd = Infinity; for (let i = 0; i < r.points.length; i++) { const d = Math.hypot(r.points[i].x - v.x, r.points[i].z - v.z - STREAM_Z(0)); if (d < bd) { bd = d; bi = i; } } y = r.surface[bi] + BANK_H; }
    return { id: v.id, x: v.x, z: v.z, y };
  });

  // ── crossings ──
  const crossings: Crossing[] = [];
  for (const r of rivers) {
    const at = (i: number, kind: CrossingKind, tag: string): void => { const p = r.points[i], q = r.points[Math.min(r.points.length - 1, i + 1)], o = r.points[Math.max(0, i - 1)]; crossings.push({ id: `${r.id}:${tag}`, kind, river: r.id, x: p.x, z: p.z, along: Math.atan2(q.z - o.z, q.x - o.x), i, half: r.half[i] }); };
    const clear = (i: number): boolean => { const p = r.points[i]; return Math.hypot(p.x - C.x, p.z - C.z) > lakeR(angleOf(p)) + CROSS_CLEAR && polar(p.x, p.z).r < PLATEAU_R - 30 && !crossings.some(c => c.river === r.id && Math.hypot(c.x - p.x, c.z - p.z) < CROSS_CLEAR); };
    // In its village: the village at the ford fords it; the others have a footbridge on the green's side.
    if (r.village) { const v = villages.find(q => q.id === r.village)!; let bi = 0, bd = Infinity; for (let i = 0; i < r.points.length; i++) { const d = Math.hypot(r.points[i].x - v.x - 6, r.points[i].z - v.z - STREAM_Z(6)); if (d < bd) { bd = d; bi = i; } } at(bi, sites.find(s => s.id === r.village)?.short === 'the ford' ? 'ford' : 'footbridge', 'village'); }
    // Along its course, by turns.
    let n = 0; for (let run = CROSS_EVERY * 0.6, i = 0, acc = 0; i < r.points.length; i++) { if (i) acc += RIVER_STEP; if (acc >= run && clear(i)) { at(i, n % 2 === 0 ? 'stones' : 'footbridge', `x${n}`); n++; run = acc + CROSS_EVERY; } }
  }

  // ── the bridge: from the island's shore toward the first village, over the water to the far shore ──
  const ba = angleOf({ x: 0, z: 0 }), bridge: Bridge = { from: onCircle(ba, ISLAND_R - 4), to: onCircle(ba, lakeR(ba) + 8), halfW: BRIDGE_HALF_W, crown: BRIDGE_CROWN };
  let shoreY: number | undefined;
  const deckAt = (x: number, z: number): number | null => {
    for (const c of crossings) if (c.kind === 'footbridge' && Math.abs(x - c.x) < 14 && Math.abs(z - c.z) < 14) { const y = footDeck(c, x, z); if (y !== null) return y; }
    const dx = bridge.to.x - bridge.from.x, dz = bridge.to.z - bridge.from.z, len = Math.hypot(dx, dz), t = ((x - bridge.from.x) * dx + (z - bridge.from.z) * dz) / (len * len); if (t < 0 || t > 1) return null;
    const off = Math.abs(-(x - bridge.from.x) * dz + (z - bridge.from.z) * dx) / len; if (off > bridge.halfW) return null;
    // The deck rises from the island (0) to its crown and down to the shore, a long shallow hump over the arches.
    const y0 = 0.05, y1 = shoreY ??= ground(bridge.to.x, bridge.to.z); return lerp(y0, y1, t) + bridge.crown * Math.sin(Math.PI * t) ** 0.6;
  };

  // ── the ground ──
  const base = (x: number, z: number): number => {
    let h = bowl(x, z); const nr = nearRiver(x, z);
    // The valleys roughed in before erosion: the land falls toward each river.
    if (nr) { const s = nr.river.surface[nr.i] + 0.8, k = nr.i / nr.river.points.length, w = lerp(VALLEY[0], VALLEY[1], k); if (h > s) h = lerp(s, h, Math.pow(smooth(nr.half, nr.half + w, nr.d), 0.8)); }
    return h;
  };
  // T7: the pads, one per place and fairy ring and brink (their footprints, FOOT / RING_FOOT), indexed by PAD_CELL so `ground` looks up only the pads about it. Built on the first
  // padded call: the places are placed on the natural ground (overworldModel.standsAt reads `ground` and `water` unpadded), and they read this plateau, so the pads wait for them;
  // a padded call made while a place is being placed (the first ever may be) reads the natural ground too, and the places it placed come out the same whichever call came first.
  const PAD_CELL = 64, padKey = (i: number, j: number): string => `${i},${j}`;
  let pads: Map<string, { x: number; z: number; r: number }[]> | null = null, padsBusy = false;
  const padsNear = (x: number, z: number): { x: number; z: number; r: number }[] | undefined => {
    if (!pads) {
      if (padsBusy) return undefined; padsBusy = true;
      const list: { x: number; z: number; r: number }[] = [...places(seed).filter(q => q.kind === 'den' || q.kind === 'warren' || q.kind === 'wallow' || q.kind === 'ruin' || q.kind === 'moot').map(q => ({ x: q.x, z: q.z, r: FOOT[q.kind as keyof typeof FOOT] })), ...convergences(seed).map(c => ({ x: c.x, z: c.z, r: RING_FOOT })), ...brinks.map(b => ({ x: b.x, z: b.z, r: RING_FOOT }))];
      const m = new Map<string, { x: number; z: number; r: number }[]>();
      for (const q of list) { const R = q.r + PAD_FADE; for (let j = Math.floor((q.z - R) / PAD_CELL); j <= Math.floor((q.z + R) / PAD_CELL); j++) for (let i = Math.floor((q.x - R) / PAD_CELL); i <= Math.floor((q.x + R) / PAD_CELL); i++) { const k = padKey(i, j); (m.get(k) ?? m.set(k, []).get(k)!).push(q); } }
      pads = m; padsBusy = false;
    }
    return pads.get(padKey(Math.floor(x / PAD_CELL), Math.floor(z / PAD_CELL)));
  };
  function ground(x: number, z: number, grid: (x: number, z: number) => number = base, padded = true): number {
    let h = grid(x, z); const { r, a } = polar(x, z);
    // The terraces: each village's ground level, its green flat.
    for (const t of terraces) { const d = Math.hypot(x - t.x, z - t.z); if (d < TERRACE_R + TERRACE_FADE) h = lerp(t.y + 0.05 * Math.sin(x * 0.07) * Math.cos(z * 0.06), h, smooth(TERRACE_R, TERRACE_R + TERRACE_FADE, d)); }
    // T7: the pads: a place's footprint level at its centre's own height.
    if (padded) { const near = padsNear(x, z); if (near) for (const q of near) { const d = Math.hypot(x - q.x, z - q.z); if (d < q.r + PAD_FADE) h = lerp(ground(q.x, q.z, grid, false), h, smooth(q.r, q.r + PAD_FADE, d)); } }
    // The lake: its shore falls to a bowl under the water; the island stands out of it, flat where the karst's floor is.
    const lr = lakeR(a);
    if (r < lr + LAKE_SHORE) { const bed = WATER_Y - LAKE_DEPTH * smooth(lr, lr - 70, r); h = lerp(bed, Math.max(h, WATER_Y + 0.4), smooth(lr - 6, lr + LAKE_SHORE, r)); }
    if (r < ISLAND_R + 26) h = lerp(0, h, smooth(ISLAND_R - 6, ISLAND_R + 26, r));
    // The channels: the bank a little over the water, the bed under it; a ford's bed just under.
    const nr = nearRiver(x, z, BANK_REACH);
    if (nr && r > ISLAND_R + 20) {
      const s = nr.river.surface[nr.i], ford = crossingNear(nr.river.id, x, z, 'ford') ?? crossingNear(nr.river.id, x, z, 'stones'), depth = ford ? FORD_DEPTH : RIVER_DEPTH, half = ford ? nr.half * 1.6 : nr.half;
      if (nr.d < half) h = Math.min(h, s - depth * (1 - (nr.d / half) ** 2) - (ford ? 0 : 0.15));
      else { const bank = s + 0.45 + (nr.d - half) * 0.12; if (h > bank) h = lerp(bank, h, smooth(half, half + 10, nr.d)); else h = Math.max(h, Math.min(bank, s + 0.3)); }
    }
    return h;
  }
  /** A footbridge's deck: across the river (perpendicular to it), FOOTBRIDGE_OVER past each bank, ends at the ground and a low arch between. */
  const decks = new Map<string, { y0: number; y1: number }>();
  function footDeck(c: Crossing, x: number, z: number): number | null {
    const ux = -Math.sin(c.along), uz = Math.cos(c.along), len = c.half + FOOTBRIDGE_OVER, t = (x - c.x) * ux + (z - c.z) * uz, off = Math.abs((x - c.x) * Math.cos(c.along) + (z - c.z) * Math.sin(c.along));
    if (Math.abs(t) > len || off > FOOTBRIDGE_HALF_W) return null;
    let e = decks.get(c.id); if (!e) { e = { y0: ground(c.x - ux * len, c.z - uz * len), y1: ground(c.x + ux * len, c.z + uz * len) }; decks.set(c.id, e); }
    const k = (t + len) / (2 * len); return lerp(e.y0, e.y1, k) + FOOTBRIDGE_RISE * Math.sin(Math.PI * k);
  }
  function crossingNear(river: string, x: number, z: number, kind: CrossingKind): Crossing | null {
    for (const c of crossings) if (c.river === river && c.kind === kind) { const ux = Math.cos(c.along), uz = Math.sin(c.along), along = (x - c.x) * ux + (z - c.z) * uz; if (Math.abs(along) < FORD_HALF_LEN && Math.hypot(x - c.x, z - c.z) < c.half * 2 + FORD_HALF_LEN) return c; }
    return null;
  }
  function water(x: number, z: number, padded = true): ReturnType<Plateau['water']> {
    const { r, a } = polar(x, z);
    if (r < lakeR(a) + 2 && r > ISLAND_R - 2) { const g = ground(x, z, base, padded); if (g < WATER_Y) return { kind: 'lake', surface: WATER_Y, depth: WATER_Y - g }; }
    const nr = nearRiver(x, z, RIVER_HALF[1] * 1.7); if (!nr) return null;
    const s = nr.river.surface[nr.i], g = ground(x, z, base, padded); if (g >= s) return null;
    return { kind: 'river', surface: s, depth: s - g, river: nr.river.id };
  }
  // ── T6: the passes and their brinks ──
  // PASS_N bearings spread round the plateau, each nudged off any river's source (a pass is a dry saddle, a river's source a wet valley); the brink is where the pass line crosses BRINK_PAST past the crest.
  // T7: and off the outer peaks' bearings (a pass looks out over the fall, not into a peak that stands through the cloud).
  { const rand = rng(seed * 577 + 31), start = rand() * Math.PI * 2, sources = rivers.map(r => angleOf(r.points[0])), peakAngles = peaks.map(pk => angleOf(pk));
    for (let i = 0; i < PASS_N; i++) { let a = wrapA(start + (i / PASS_N) * Math.PI * 2 + (rand() - 0.5) * 0.5); for (let k = 0; k < 8; k++) { const near = sources.find(sa => Math.abs(wrapA(a - sa)) < 0.26) ?? peakAngles.find(pa => Math.abs(wrapA(a - pa)) < 0.32); if (near === undefined) break; a = wrapA(near + (wrapA(a - near) >= 0 ? 0.36 : -0.36)); } passAngles.push(a); } }
  const brinks: Brink[] = passAngles.map((a, i) => {
    let rr = PLATEAU_R; for (; rr < PLATEAU_R + MOUNTAIN_RISE + ESCARP; rr += 2) { const q = onCircle(a, rr); if (into(q.x, q.z) >= MOUNTAIN_RISE + BRINK_PAST) break; }
    // T7: the lip is where the fall begins; her ring stands on the last ground level along the pass before it (BRINK_LEVEL_R about, LEVEL_SLOPE; its pad levels it across), a few strides back.
    for (let back = 0; back < 40; back += 1) { let lo = Infinity, hi = -Infinity; for (const du of [0, 0.5, 1, -0.5, -1]) { const q = onCircle(a, rr - back + du * BRINK_LEVEL_R), h = bowl(q.x, q.z); lo = Math.min(lo, h); hi = Math.max(hi, h); } if (hi - lo <= LEVEL_SLOPE * 2 * BRINK_LEVEL_R) { rr -= back; break; } }
    const q = onCircle(a, rr), bearing = ((Math.atan2(Math.cos(a), -Math.sin(a)) * 180 / Math.PI) + 360) % 360, oct = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round(bearing / 45) % 8];
    return { id: `brink:${i}`, name: `the ${oct} brink`, x: q.x, z: q.z, angle: a };
  });
  return { seed, centre: C, radius: PLATEAU_R, lakeR, islandR: ISLAND_R, waterY: WATER_Y, rivers, crossings, bridge, terraces, base, ground, water, nearRiver, deckAt, into, brinks, passAt };
}

/** A polyline resampled every `step` m. */
export function resample(pts: P[], step: number): P[] {
  const out: P[] = [pts[0]]; let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], len = Math.hypot(b.x - a.x, b.z - a.z); let t = step - carry;
    while (t <= len) { out.push({ x: a.x + (b.x - a.x) * t / len, z: a.z + (b.z - a.z) * t / len }); t += step; }
    carry = len - (t - step);
  }
  const last = pts[pts.length - 1]; if (Math.hypot(last.x - out[out.length - 1].x, last.z - out[out.length - 1].z) > step * 0.3) out.push(last);
  return out;
}
/** Can she stand here without wading deeper than WADE_DEPTH (a ford, the shallows), and is it on the plateau? The bridge's deck counts.
 * `wade` is the depth that refuses (hers by default; her stag's STAG_WADE_DEPTH, STAGS.md pass 4, lets it through the rivers and not the lake). */
export function walkable(p: Plateau, x: number, z: number, wade = WADE_DEPTH): boolean {
  if (p.deckAt(x, z) !== null) return true;
  // T6: the belt is too steep but at its passes, and a pass ends at the brink: past it is the fall.
  const d = p.into(x, z); if (d > PASS_FOOT && (d > MOUNTAIN_RISE + BRINK_PAST + 8 || p.passAt(x, z) < 0.5)) return false;
  const w = p.water(x, z); return !w || w.depth < wade;
}
/** T7: the points a footprint is judged at: the centre, a ring at `r` and one at half of it. */
export function footprint(x: number, z: number, r: number, n = 12): P[] { const out: P[] = [{ x, z }]; for (const k of [0.5, 1]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push({ x: x + Math.cos(a) * r * k, z: z + Math.sin(a) * r * k }); } return out; }
/** T7: whether a footprint of radius `r` about (x, z) is dry (no water under any of it) and level (the natural ground, before any pad, rises at most LEVEL_SLOPE of its width across it: the pad the land then makes of it stands no higher than that over the land about). The ground judged is the plateau's own before erosion; the erosion's gullies are what the pad levels. */
export function standsLevel(p: Plateau, x: number, z: number, r: number, slope = LEVEL_SLOPE): boolean {
  let lo = Infinity, hi = -Infinity;
  for (const q of footprint(x, z, r)) { if (p.water(q.x, q.z, false)) return false; const g = p.ground(q.x, q.z, undefined, false); lo = Math.min(lo, g); hi = Math.max(hi, g); if (hi - lo > slope * 2 * r) return false; }
  return true;
}
export type { Noise };
export const _internal = { wrap };
