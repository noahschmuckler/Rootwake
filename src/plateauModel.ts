// The plateau (Noah, 2026-10-19; PLATEAU.md): the land on top of the karst-mountain, as rules. A
// circular plateau PLATEAU_R in radius round the one karst, ringed by mountains; a lake at its centre
// with the karst on a small island, joined to the shore by an old stone bridge; rivers that rise in
// the mountains and run down to the lake, each through a village (following a river brings her to
// one), and are barriers but at their crossings: the village at the ford's ford, footbridges, stepping
// stones. The heights here are the land's shape before erosion and the carving after it; the eroded
// grid itself is the renderer's (plateauLand.ts). Pure: no Three.js, node-tested.
import { gradientNoise, fbm, ridged, rng, type Noise } from './vistaTerrain';
import { KARST_AT, villageSites, lairPlace } from './overworldModel';
import { STREAM_Z, STREAM_REACH } from './villageModel';

const smooth = (a: number, b: number, x: number): number => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

/** The plateau's radius about the karst; the lake's mean radius and its shore's wobble; the island's; the water's surface (the karst's floor and the island are at 0). Tuning. */
export const PLATEAU_R = 1800, LAKE_R = 215, LAKE_WOBBLE = 12, ISLAND_R = 104, WATER_Y = -1.2, LAKE_DEPTH = 9;
/** The plateau's rise from the lake's shore to its rim (m), the hills over it (m), the mountains past the rim: their climb (m) and how much of a ring they take to rise. Tuning. */
export const RIM_RISE = 62, HILL_M = 11, MOUNTAIN_RISE = 650;
/** A village's ground: flat within TERRACE_R of its green (the layouts' meadow), blending out over TERRACE_FADE; it stands BANK_H above its river. Tuning. */
export const TERRACE_R = 90, TERRACE_FADE = 70, BANK_H = 1.6;
/** Rivers: half width at the source and at the mouth (m), the channel's depth below the surface, the valley's half width from source to mouth, how far upstream of the rim a river rises. Tuning. */
export const RIVER_HALF: [number, number] = [2.0, 4.6], RIVER_DEPTH = 1.6, VALLEY: [number, number] = [14, 46], SOURCE_PAST = 140;
/** Crossings: a river is crossed every CROSS_EVERY m of its course (stepping stones and footbridges by turns), never within CROSS_CLEAR of the lake or of another crossing; a ford's water is FORD_DEPTH deep, walkable (below WADE_DEPTH). Tuning. */
export const CROSS_EVERY = 420, CROSS_CLEAR = 90, FORD_DEPTH = 0.22, WADE_DEPTH = 0.35, FORD_HALF_LEN = 7;
/** The island's bridge: its width and the height of its deck's crown over the water. Tuning. */
export const BRIDGE_HALF_W = 1.6, BRIDGE_CROWN = 4.2;

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
export interface Plateau {
  seed: number; centre: P; radius: number;
  lakeR(angle: number): number; islandR: number; waterY: number;
  rivers: River[]; crossings: Crossing[]; bridge: Bridge;
  /** Each village's green and the height of its ground. */
  terraces: { id: string; x: number; z: number; y: number }[];
  /** The land's shape before erosion (what the grid starts from): the bowl, the hills, the mountains, the valleys roughed in. */
  base(x: number, z: number): number;
  /** The final ground: `grid` (the eroded shape, or `base` when there is none) with the terraces, the lake, the island and the channels carved in. */
  ground(x: number, z: number, grid?: (x: number, z: number) => number): number;
  /** Water at a point: in the lake or a river, the surface and how deep; null when dry. */
  water(x: number, z: number): { kind: 'lake' | 'river'; surface: number; depth: number; river?: string } | null;
  /** The nearest river point: which river, which point, how far, and its half width there. */
  nearRiver(x: number, z: number, reach?: number): { river: River; i: number; d: number; half: number } | null;
  /** The bridge's deck where (x, z) is on it, else null. */
  deckAt(x: number, z: number): number | null;
  /** How far into the mountains (m past the rim; negative inside). */
  into(x: number, z: number): number;
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
  const hills = (x: number, z: number): number => HILL_M * (fbm(nHill, x * 0.0035, z * 0.0035, 4) + 0.35 * fbm(nDetail, x * 0.012, z * 0.012, 3));
  /** The bowl: the lake's shore at the water, rising to the rim, hills over it (calmer near the lake), the mountains beyond. */
  const bowl = (x: number, z: number): number => {
    const { r } = polar(x, z), k = smooth(LAKE_R, PLATEAU_R, r), d = into(x, z);
    let h = WATER_Y + 1.4 + RIM_RISE * Math.pow(k, 1.35) + hills(x, z) * smooth(LAKE_R, LAKE_R + 420, r);
    if (d > 0) { const m = smooth(0, MOUNTAIN_RISE, d), rr = ridged(nRidge, x * 0.0016, z * 0.0016, 6); h += m ** 1.25 * (50 + 520 * rr) + m * fbm(nDetail, x * 0.004, z * 0.004, 4) * 18; }
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
    for (const p of course) {
      for (const v of villages) if (v.id !== own && Math.hypot(p.x - v.x, p.z - v.z) < TERRACE_R + 50) return false;
      if (Math.hypot(p.x - lair.x, p.z - lair.z) < 160) return false;
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
    // Into the lake, the last stretch eases down to the water's surface.
    for (let i = Math.max(0, n - 12); i < n; i++) surface[i] = lerp(surface[Math.max(0, n - 13)], WATER_Y, (i - (n - 13)) / 12);
    return { id, name, village, points, half, surface, length };
  }

  // ── where rivers are near: a hash of their points ──
  const HASH = 32, hash = new Map<string, { r: River; i: number }[]>();
  for (const r of rivers) for (let i = 0; i < r.points.length; i++) { const p = r.points[i], k = `${Math.floor(p.x / HASH)},${Math.floor(p.z / HASH)}`; (hash.get(k) ?? hash.set(k, []).get(k)!).push({ r, i }); }
  function nearRiver(x: number, z: number, reach = VALLEY[1] + 8): { river: River; i: number; d: number; half: number } | null {
    const cx = Math.floor(x / HASH), cz = Math.floor(z / HASH), span = Math.ceil(reach / HASH); let best: { river: River; i: number; d: number; half: number } | null = null;
    for (let a = -span; a <= span; a++) for (let b = -span; b <= span; b++) for (const e of hash.get(`${cx + a},${cz + b}`) ?? []) {
      // The distance to the segment on either side of the point, so the channel's edge is smooth between samples.
      const p = e.r.points[e.i];
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
    const dx = bridge.to.x - bridge.from.x, dz = bridge.to.z - bridge.from.z, len = Math.hypot(dx, dz), t = ((x - bridge.from.x) * dx + (z - bridge.from.z) * dz) / (len * len); if (t < 0 || t > 1) return null;
    const off = Math.abs(-(x - bridge.from.x) * dz + (z - bridge.from.z) * dx) / len; if (off > bridge.halfW) return null;
    // The deck rises from the island (0) to its crown and down to the shore, a long shallow hump over the arches.
    const y0 = 0.05, y1 = shoreY ??= ground(bridge.to.x, bridge.to.z); return lerp(y0, y1, t) + bridge.crown * Math.sin(Math.PI * t) ** 0.6;
  };

  // ── the ground ──
  const base = (x: number, z: number): number => {
    let h = bowl(x, z); const nr = nearRiver(x, z);
    // The valleys roughed in before erosion: the land falls toward each river.
    if (nr) { const s = nr.river.surface[nr.i] + 0.8, k = nr.i / nr.river.points.length, w = lerp(VALLEY[0], VALLEY[1], k); if (h > s) h = lerp(s, h, smooth(nr.half, nr.half + w, nr.d)); }
    return h;
  };
  function ground(x: number, z: number, grid: (x: number, z: number) => number = base): number {
    let h = grid(x, z); const { r, a } = polar(x, z);
    // The terraces: each village's ground level, its green flat.
    for (const t of terraces) { const d = Math.hypot(x - t.x, z - t.z); if (d < TERRACE_R + TERRACE_FADE) h = lerp(t.y + 0.05 * Math.sin(x * 0.07) * Math.cos(z * 0.06), h, smooth(TERRACE_R, TERRACE_R + TERRACE_FADE, d)); }
    // The lake: its shore falls to a bowl under the water; the island stands out of it, flat where the karst's floor is.
    const lr = lakeR(a);
    if (r < lr + 40) { const bed = WATER_Y - LAKE_DEPTH * smooth(lr, lr - 70, r); h = lerp(bed, Math.max(h, WATER_Y + 0.4), smooth(lr - 6, lr + 40, r)); }
    if (r < ISLAND_R + 26) h = lerp(0, h, smooth(ISLAND_R - 6, ISLAND_R + 26, r));
    // The channels: the bank a little over the water, the bed under it; a ford's bed just under.
    const nr = nearRiver(x, z, RIVER_HALF[1] + 12);
    if (nr && r > ISLAND_R + 20) {
      const s = nr.river.surface[nr.i], ford = crossingNear(nr.river.id, x, z, 'ford'), depth = ford ? FORD_DEPTH : RIVER_DEPTH, half = ford ? nr.half * 1.6 : nr.half;
      if (nr.d < half) h = Math.min(h, s - depth * (1 - (nr.d / half) ** 2) - (ford ? 0 : 0.15));
      else { const bank = s + 0.45 + (nr.d - half) * 0.12; if (h > bank) h = lerp(bank, h, smooth(half, half + 10, nr.d)); else h = Math.max(h, Math.min(bank, s + 0.3)); }
    }
    return h;
  }
  function crossingNear(river: string, x: number, z: number, kind: CrossingKind): Crossing | null {
    for (const c of crossings) if (c.river === river && c.kind === kind) { const ux = Math.cos(c.along), uz = Math.sin(c.along), along = (x - c.x) * ux + (z - c.z) * uz; if (Math.abs(along) < FORD_HALF_LEN && Math.hypot(x - c.x, z - c.z) < c.half * 2 + FORD_HALF_LEN) return c; }
    return null;
  }
  function water(x: number, z: number): ReturnType<Plateau['water']> {
    const { r, a } = polar(x, z);
    if (r < lakeR(a) + 2 && r > ISLAND_R - 2) { const g = ground(x, z); if (g < WATER_Y) return { kind: 'lake', surface: WATER_Y, depth: WATER_Y - g }; }
    const nr = nearRiver(x, z, RIVER_HALF[1] * 1.7); if (!nr) return null;
    const s = nr.river.surface[nr.i], g = ground(x, z); if (g >= s) return null;
    return { kind: 'river', surface: s, depth: s - g, river: nr.river.id };
  }
  return { seed, centre: C, radius: PLATEAU_R, lakeR, islandR: ISLAND_R, waterY: WATER_Y, rivers, crossings, bridge, terraces, base, ground, water, nearRiver, deckAt, into };
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
/** Can she stand here without wading deeper than WADE_DEPTH (a ford, the shallows), and is it on the plateau? The bridge's deck counts. */
export function walkable(p: Plateau, x: number, z: number): boolean {
  if (p.deckAt(x, z) !== null) return true;
  const w = p.water(x, z); return !w || w.depth < WADE_DEPTH;
}
export type { Noise };
export const _internal = { wrap };
