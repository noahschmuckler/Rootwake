// The den as a delve (Noah, 2026-09-27: "a small dirt dungeon, with dirt halls slipping down to one
// or more chambers; no separate loading, a smooth transition, simply walking into it; each one unique").
// Pure: no Three.js. A den's layout is generated from the world's seed and the den's id: from the
// mound's mouth a hall of a few straight runs slips down, bending as it goes, into a chamber; from the
// chamber, as the dice fall, a second hall to a deeper chamber, and a dead-end run. The layout is also the
// ground: `floorAt` gives the floor she stands on wherever a hall or chamber lies under (x, z), and the
// roof over it, so the shared player's traversal world can offer the den's floor beside the land's.
import { mulberry32 } from './colors';
export interface Vec3 { x: number; y: number; z: number }
export interface DenHall { a: Vec3; b: Vec3; r: number }
export interface DenChamber { c: Vec3; r: number; h: number; deepest: boolean }
export interface DenLayout { id: string; x: number; z: number; y: number; dir: number; mouth: Vec3; halls: DenHall[]; chambers: DenChamber[]; reach: number; depth: number }
/** The mouth stands MOUTH_OUT from the mound's centre on `dir`; a hall is HALL_RUNS straight runs of HALL_LEN m, each turning up to HALL_TURN, slipping down by HALL_SLOPE (rise over run), of radius HALL_R; a chamber CHAMBER_R across and CHAMBER_H high. The floor lies FLOOR_DROP of the radius below a hall's line (a chord, flat enough to stand on) and the roof ROOF_RISE above it; walkable out to FLOOR_WIDTH of the radius. Tuning. */
export const MOUTH_OUT = 2.6, HALL_RUNS: [number, number] = [2, 4], HALL_LEN: [number, number] = [5, 9], HALL_TURN = 0.75, HALL_SLOPE: [number, number] = [0.22, 0.34], HALL_R: [number, number] = [1.3, 1.65], CHAMBER_R: [number, number] = [3, 4.6], CHAMBER_H: [number, number] = [2.5, 3.3], FLOOR_DROP = 0.55, ROOF_RISE = 0.8, FLOOR_WIDTH = 0.8, CHAMBER_FLOOR = 0.45, CHAMBER_ROOF = 0.55;
const between = (rand: () => number, [lo, hi]: [number, number]): number => lo + rand() * (hi - lo);
/** The den's layout, by the seed and the den's id, with the surface's height at its mouth. */
export function denLayout(den: { id: string; x: number; z: number; tier?: number }, seed: number, surfaceY: (x: number, z: number) => number): DenLayout {
  let h = 2166136261; for (const ch of den.id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = mulberry32((seed * 40503 + (h >>> 0)) >>> 0), dir = rand() * Math.PI * 2, y0 = surfaceY(den.x + Math.cos(dir) * MOUTH_OUT, den.z + Math.sin(dir) * MOUTH_OUT), r1 = between(rand, HALL_R);
  // The hall's line starts FLOOR_DROP of its radius above the surface, so its floor meets the land exactly at the mouth (a step down the hall is a step, never a drop) and its roof stands over the mouth as a low arch of earth.
  const mouth: Vec3 = { x: den.x + Math.cos(dir) * MOUTH_OUT, y: y0 + r1 * FLOOR_DROP, z: den.z + Math.sin(dir) * MOUTH_OUT }, halls: DenHall[] = [], chambers: DenChamber[] = [];
  let depth = 0, reach = MOUTH_OUT;
  const note = (p: Vec3): void => { depth = Math.max(depth, y0 - p.y); reach = Math.max(reach, Math.hypot(p.x - den.x, p.z - den.z) + 5); };
  // A hall: runs from `from` on `heading`, each run bending a little and slipping down; the first run keeps its heading (the mouth points along it).
  const hall = (from: Vec3, heading: number, runs: number, r: number, slope: number, keepFirst: boolean): { end: Vec3; heading: number } => {
    let p = from, hd = heading;
    for (let i = 0; i < runs; i++) {
      if (i > 0 || !keepFirst) hd += (rand() - 0.5) * 2 * HALL_TURN;
      const len = between(rand, HALL_LEN), q: Vec3 = { x: p.x + Math.cos(hd) * len, y: p.y - len * slope, z: p.z + Math.sin(hd) * len };
      halls.push({ a: p, b: q, r }); note(q); p = q;
    }
    return { end: p, heading: hd };
  };
  const chamber = (at: Vec3, heading: number, deepest: boolean): DenChamber => { const r = between(rand, CHAMBER_R), ch: DenChamber = { c: { x: at.x + Math.cos(heading) * r * 0.6, y: at.y - 0.4, z: at.z + Math.sin(heading) * r * 0.6 }, r, h: between(rand, CHAMBER_H), deepest }; chambers.push(ch); note({ x: ch.c.x + r, y: ch.c.y - ch.h * CHAMBER_FLOOR, z: ch.c.z + r }); return ch; };
  const first = hall(mouth, dir, Math.round(between(rand, HALL_RUNS)), r1, between(rand, HALL_SLOPE), true);
  const more = (den.tier ?? 1) >= 2 || rand() < 0.6, c1 = chamber(first.end, first.heading, !more);
  if (more) {
    // On from the first chamber's far side, deeper, to a second.
    const out = first.heading + (rand() - 0.5) * 1.2, start: Vec3 = { x: c1.c.x + Math.cos(out) * c1.r * 0.8, y: c1.c.y - c1.h * CHAMBER_FLOOR + r1 * FLOOR_DROP, z: c1.c.z + Math.sin(out) * c1.r * 0.8 };
    const second = hall(start, out, Math.round(between(rand, [1, 3])), between(rand, HALL_R), between(rand, HALL_SLOPE), false); chamber(second.end, second.heading, true);
  }
  if (rand() < 0.45) {
    // A dead-end run off the first chamber, the other way.
    const side = first.heading + (rand() < 0.5 ? 1 : -1) * (1.3 + rand() * 0.8), start: Vec3 = { x: c1.c.x + Math.cos(side) * c1.r * 0.8, y: c1.c.y - c1.h * CHAMBER_FLOOR + r1 * FLOOR_DROP, z: c1.c.z + Math.sin(side) * c1.r * 0.8 };
    hall(start, side, 1 + Math.round(rand()), between(rand, [1.1, 1.4]), between(rand, [0.05, 0.2]), false);
  }
  return { id: den.id, x: den.x, z: den.z, y: y0, dir, mouth, halls, chambers, reach, depth };
}
/** The floor and the roof under (x, z), if a hall or a chamber lies there: the highest floor of those that do (a hall meeting a chamber). */
export function floorAt(d: DenLayout, x: number, z: number): { floor: number; roof: number } | null {
  let best: { floor: number; roof: number } | null = null;
  const take = (floor: number, roof: number): void => { if (!best || floor > best.floor) best = { floor, roof }; };
  for (const h of d.halls) {
    const dx = h.b.x - h.a.x, dz = h.b.z - h.a.z, len2 = dx * dx + dz * dz, t = Math.max(0, Math.min(1, ((x - h.a.x) * dx + (z - h.a.z) * dz) / len2)), px = h.a.x + dx * t, pz = h.a.z + dz * t;
    if (Math.hypot(x - px, z - pz) > h.r * FLOOR_WIDTH) continue;
    const y = h.a.y + (h.b.y - h.a.y) * t; take(y - h.r * FLOOR_DROP, y + h.r * ROOF_RISE);
  }
  for (const c of d.chambers) if (Math.hypot(x - c.c.x, z - c.c.z) <= c.r * 0.92) take(c.c.y - c.h * CHAMBER_FLOOR, c.c.y + c.h * CHAMBER_ROOF);
  return best;
}
/** Whether a point lies inside the den's hollow (for the camera): within a hall's bore or a chamber's hollow. */
export function insideDen(d: DenLayout, x: number, y: number, z: number): boolean {
  for (const h of d.halls) {
    const dx = h.b.x - h.a.x, dy = h.b.y - h.a.y, dz = h.b.z - h.a.z, len2 = dx * dx + dy * dy + dz * dz, t = Math.max(0, Math.min(1, ((x - h.a.x) * dx + (y - h.a.y) * dy + (z - h.a.z) * dz) / len2));
    if (Math.hypot(x - (h.a.x + dx * t), y - (h.a.y + dy * t), z - (h.a.z + dz * t)) <= h.r * 0.95) return true;
  }
  for (const c of d.chambers) { const ex = (x - c.c.x) / c.r, ey = (y - c.c.y) / (c.h * 0.6), ez = (z - c.c.z) / c.r; if (ex * ex + ey * ey + ez * ez <= 0.92) return true; }
  return false;
}
/** The hall's line as points for drawing: the mouth's run and the bends, one polyline per connected hall. */
export function hallLines(d: DenLayout): Vec3[][] {
  const lines: Vec3[][] = [];
  for (const h of d.halls) { const last = lines[lines.length - 1]; if (last && last[last.length - 1] === h.a) last.push(h.b); else lines.push([h.a, h.b]); }
  return lines;
}
