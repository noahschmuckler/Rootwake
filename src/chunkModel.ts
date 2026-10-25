// The land beyond the meadow (M1a.2): chunks of procedural ground round the village's authored island.
// Pure: no Three.js. Height and biome by value noise from the world seed; each chunk's trees from the
// chunk's own seed, so a chunk is the same whenever it is loaded. The meadow (the village's wood
// included) is an island the chunks defer to: no hills and no chunk trees within MEADOW_ISLAND of the
// village, and the karst stands on an island of its own (KARST_ISLAND), its clearing kept free of chunk trees.
import { mulberry32 } from './colors';
import { places, villageSites, onLand, riverEdge, crossingNear, settle, FOREST_RADIUS, KARST_AT, FOOT } from './overworldModel';
import { PAD_FADE } from './plateauModel';
import { TAINT } from './taintModel';
import type { Tree } from './villageModel';

export const CHUNK = 64, LOAD_RING = 2, MEADOW_ISLAND = 90, ISLAND_FADE = 60, KARST_CLEARING = 100, KARST_ISLAND = 96, KARST_FADE = 50;
export type Biome = 'meadow' | 'wood' | 'dark';
const hash2 = (x: number, z: number, seed: number): number => { let h = (x * 374761393 + z * 668265263 + seed * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const smooth = (t: number): number => t * t * (3 - 2 * t);
/** Value noise in [0, 1] at a wavelength, seeded. */
export function noise(x: number, z: number, wavelength: number, seed: number): number {
  const gx = x / wavelength, gz = z / wavelength, x0 = Math.floor(gx), z0 = Math.floor(gz), tx = smooth(gx - x0), tz = smooth(gz - z0);
  const a = hash2(x0, z0, seed), b = hash2(x0 + 1, z0, seed), c = hash2(x0, z0 + 1, seed), d = hash2(x0 + 1, z0 + 1, seed);
  return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
}
/** The meadow islands: the first village's at the origin and (G4) the other villages' by the seed. */
export const islands = (seed = 1): { x: number; z: number }[] => [{ x: 0, z: 0 }, ...villageSites(seed)];
/** How much the land beyond the meadow shows here: 0 inside an island, 1 beyond its fade. */
export const beyond = (x: number, z: number, seed = 1): number => { let t = Math.max(0, (Math.hypot(x - KARST_AT.x, z - KARST_AT.z) - KARST_ISLAND) / KARST_FADE); for (const o of islands(seed)) t = Math.min(t, Math.max(0, (Math.hypot(x - o.x, z - o.z) - MEADOW_ISLAND) / ISLAND_FADE)); t = Math.min(1, t); return t * t * t * (t * (t * 6 - 15) + 10); };
/** The hills: two octaves, up to HILL_M high, fading in past the meadow. Tuning. */
export const HILL_M = 7;
export function hills(x: number, z: number, seed = 1): number { const k = beyond(x, z, seed); if (k <= 0) return 0; return k * HILL_M * (noise(x, z, 140, seed) * 0.7 + noise(x, z, 46, seed + 7) * 0.3 - 0.45); }
/** The biome: the dark forest about the lair, else meadow or wood by a slow noise (wood the more common). */
export function biomeAt(x: number, z: number, seed = 1): Biome {
  // MOTHER.md: her taint is a whole biome of dense wood, all of it dead or worse (the look decides which); FOREST_RADIUS is its old dark heart.
  const lair = places(seed).find(p => p.id === 'lair')!; if (Math.hypot(x - lair.x, z - lair.z) <= Math.max(FOREST_RADIUS, TAINT.edge)) return 'dark';
  return noise(x, z, 110, seed + 3) > 0.58 ? 'meadow' : 'wood';
}
/** FOREST (Noah, 2026-10-20): the wood is not one wood. Through it run stands of true forest, dense, old and young
 * together, dark underfoot with leaf mould; between them the wooded plains keep their scattered trees and grass. How deep in
 * a stand a point lies: 0 on the plains, the meadow and her taint (her wood has its own rule), 1 at a stand's heart. The
 * stands are a slow noise (FOREST_WAVE m) broken by a quicker one, and thin out toward the meadow. Tuning. */
export const FOREST_WAVE = 170, FOREST_EDGE: [number, number] = [0.42, 0.6];
const smooth01 = (t: number): number => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
/** The forest field for a seed, the lair looked up once (for the land's every cell). */
export function forestField(seed = 1): (x: number, z: number) => number {
  const lair = places(seed).find(p => p.id === 'lair')!, dark = Math.max(FOREST_RADIUS, TAINT.edge);
  return (x, z) => {
    if (Math.hypot(x - lair.x, z - lair.z) <= dark) return 0;
    const m = noise(x, z, 110, seed + 3); if (m > 0.58) return 0;
    const f = noise(x, z, FOREST_WAVE, seed + 11) * 0.7 + noise(x, z, 48, seed + 12) * 0.3;
    // Never on the villages' meadows nor the karst's island: the stands thin out as the meadow comes.
    return smooth01((f - FOREST_EDGE[0]) / (FOREST_EDGE[1] - FOREST_EDGE[0])) * smooth01((0.58 - m) / 0.1) * Math.min(1, beyond(x, z, seed) * 1.6);
  };
}
const fields = new Map<number, (x: number, z: number) => number>();
export const forestAt = (x: number, z: number, seed = 1): number => { let f = fields.get(seed); if (!f) { f = forestField(seed); fields.set(seed, f); } return f(x, z); };
/** T4c (PINE BARRENS): where the oaks stand among the pines, 0..1 by a slow noise (groves of oak, and oak scattered through the pine): the look's tree kinds and the leaf mould both read it. */
export const oakShare = (x: number, z: number, seed: number): number => 0.16 + 0.55 * smooth01((noise(x, z, 75, seed + 81) - 0.42) / 0.26);
/** T4c: what lies on the wood's floor at a point (needles, leaf mould, moss and peat, bare sand; each 0..1), from how deep in a stand it lies, how many
 * oaks are about, how near the water it is; null on the meadows, the taint and the karst's island (`karstForest` the island's wood), where the grass is bare
 * of it. Sand shows where the wood is open; needles thicken with the pines, leaf mould with the oaks, and by the streams the floor is peat and sphagnum.
 * The look's floor map (villageVista.floorMap) and the overworld map (overworldMap.ts, T9) both read it. Tuning. */
export function floorSampler(seed: number, karstForest: number): (x: number, z: number) => [number, number, number, number] | null {
  const lair = places(seed).find(p => p.id === 'lair')!, dark = Math.max(FOREST_RADIUS, TAINT.edge), at = forestField(seed);
  return (x, z) => {
    if (beyond(x, z, seed) < 0.62 || noise(x, z, 110, seed + 3) > 0.58 || Math.hypot(x - lair.x, z - lair.z) < dark || Math.hypot(x - KARST_AT.x, z - KARST_AT.z) < karstForest + 30) return null;
    const f = at(x, z), oak = oakShare(x, z, seed), rip = 1 - smooth01((riverEdge(seed, x, z, RIPARIAN + 14) - 4) / (RIPARIAN + 6)), gap = noise(x, z, 9, seed + 83);
    // The wooded plains: thin sand and a scatter of needles under the grass; a stand: needles (pine) and leaf mould (oak), sand in its gaps; the streamside: peat.
    let needles = 0.3 + 0.65 * f * (1 - 0.6 * oak), leaves = (0.1 + 0.75 * f) * oak, sand = 0.3 * (1 - f) + 0.3 * f * smooth01((gap - 0.5) / 0.3), moss = rip * (0.7 + 0.3 * f);
    const sum = needles + leaves + sand + moss, over = Math.max(1, sum / (0.62 + 0.38 * f + 0.45 * rip)); needles /= over; leaves /= over; sand /= over; moss /= over;
    return [needles, leaves, moss, sand];
  };
}
/** A forest tree's size by its age: the old giants a few, the mature most, the young filling the gaps. Tuning. */
export const AGES: { share: number; size: [number, number] }[] = [{ share: 0.14, size: [1.7, 2.4] }, { share: 0.5, size: [1.0, 1.6] }, { share: 0.36, size: [0.55, 0.95] }];
/** How many trees a chunk may hold, how hard the forest pass tries, and the spacing between trunks (m) on the plains and in a stand's heart (scaled by the trees' sizes). Tuning. */
// PINE BARRENS (Noah, 2026-10-21): pitch pines stand farther apart than the broadleaf stands did (their crowns are narrow and the floor is lit), so a stand is tall and open, not a wall.
export const FOREST_CAP = 44, FOREST_TRIES = 220, SPACING: [number, number] = [5.0, 2.8];
/** T4c: the streamside: within RIPARIAN m of a river's edge through wooded land the white cedars stand close (CEDAR_GAP m, scaled by size), CEDAR_CAP a chunk, their sizes CEDAR_SIZE; a chunk holds at most CHUNK_IDS trees (its id stride). Tuning. */
export const RIPARIAN = 16, CEDAR_CAP = 20, CEDAR_GAP = 2.8, CEDAR_SIZE: [number, number] = [1.2, 2.1], CHUNK_IDS = 64;
export const chunkKey = (cx: number, cz: number): string => `${cx},${cz}`;
export const chunkOf = (x: number, z: number): { cx: number; cz: number } => ({ cx: Math.floor(x / CHUNK), cz: Math.floor(z / CHUNK) });
/** A chunk's trees, from its own seed: by biome's density, none on the island or in the karst's clearing, spaced. Ids are unique per chunk so a chunk tree is never confused with the village's. */
export function chunkTrees(cx: number, cz: number, seed = 1): Tree[] {
  const rand = mulberry32((seed * 92821 + cx * 7919 + cz * 104729 + 1) >>> 0), out: Tree[] = [], a = cx >= 0 ? cx * 2 : -cx * 2 - 1, b = cz >= 0 ? cz * 2 : -cz * 2 - 1, base = 100000 + ((a + b) * (a + b + 1) / 2 + b) * 64;
  for (let i = 0; i < 40 && out.length < 16; i++) {
    const x = (cx + rand()) * CHUNK, z = (cz + rand()) * CHUNK; if (beyond(x, z, seed) < 0.35 || Math.hypot(x - KARST_AT.x, z - KARST_AT.z) < KARST_CLEARING || !onLand(seed, x, z, 2.5)) continue; // PLATEAU.md: none in the rivers or the lake, nor past the plateau's rim
    const b = biomeAt(x, z, seed), keep = b === 'meadow' ? 0.12 : b === 'wood' ? 0.8 : 0.9; if (rand() > keep) continue;
    if (out.some(t => Math.hypot(t.x - x, t.z - z) < 4.5)) continue;
    out.push({ id: base + out.length, x, z, size: b === 'dark' ? 1.1 + rand() * 0.7 : 0.8 + rand() * 0.7 });
  }
  // FOREST: the stands, on a second draw so the plains' trees stand where they always stood. Trees of every age, closer the
  // deeper in, a giant's crown wider apart from its neighbours than a sapling's.
  // The field sampled on the chunk's 8 m grid and read between (most chunks have no stand at all and are passed over).
  const G = 8, gs = CHUNK / G, grid = new Float32Array((G + 1) * (G + 1)); let most = 0;
  for (let j = 0; j <= G; j++) for (let i = 0; i <= G; i++) { const v = forestAt((cx * G + i) * gs, (cz * G + j) * gs, seed); grid[j * (G + 1) + i] = v; most = Math.max(most, v); }
  if (most < 0.12) return out;
  const fieldAt = (x: number, z: number): number => { const u = x / gs - cx * G, v = z / gs - cz * G, i = Math.min(G - 1, Math.floor(u)), j = Math.min(G - 1, Math.floor(v)), tu = u - i, tv = v - j, k = j * (G + 1) + i; return (grid[k] * (1 - tu) + grid[k + 1] * tu) * (1 - tv) + (grid[k + G + 1] * (1 - tu) + grid[k + G + 2] * tu) * tv; };
  const r2 = mulberry32((seed * 48271 + cx * 15485863 + cz * 32452843 + 5) >>> 0);
  for (let i = 0; i < FOREST_TRIES && out.length < FOREST_CAP; i++) {
    const x = (cx + r2()) * CHUNK, z = (cz + r2()) * CHUNK, f = fieldAt(x, z), roll = r2(), age = r2(), grow = r2();
    if (f < 0.12 || roll > f) continue;
    if (beyond(x, z, seed) < 0.6 || Math.hypot(x - KARST_AT.x, z - KARST_AT.z) < KARST_CLEARING || !onLand(seed, x, z, 2.5)) continue;
    const a = age < AGES[0].share ? AGES[0] : age < AGES[0].share + AGES[1].share ? AGES[1] : AGES[2], size = a.size[0] + grow * (a.size[1] - a.size[0]);
    const gap = (SPACING[0] + (SPACING[1] - SPACING[0]) * f) * (0.55 + 0.45 * size);
    if (out.some(t => Math.hypot(t.x - x, t.z - z) < gap * 0.5 + (SPACING[0] + (SPACING[1] - SPACING[0]) * f) * (0.55 + 0.45 * t.size) * 0.5)) continue;
    out.push({ id: base + out.length, x, z, size });
  }
  return cedars(cx, cz, seed, out);
}
/** T4c: a third draw, the streamside's cedars (drawn as the white cedar by the look: villageVista.villageTrees reads the same river distance): where a river runs
 * through wooded land, within RIPARIAN of its edge, thick at the water and thinning out, clear of the crossings' approaches and of the trees already standing. */
function cedars(cx: number, cz: number, seed: number, out: Tree[]): Tree[] {
  // Most chunks are nowhere near a river: a coarse look first.
  let near = false; for (const [u, v] of [[0.5, 0.5], [0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]]) if (riverEdge(seed, (cx + u) * CHUNK, (cz + v) * CHUNK, RIPARIAN + CHUNK * 0.45) < RIPARIAN + CHUNK * 0.45) { near = true; break; }
  if (!near) return out;
  const r3 = mulberry32((seed * 69621 + cx * 2654435 + cz * 40503 + 9) >>> 0), cap = Math.min(FOREST_CAP, out.length + CEDAR_CAP); // a chunk holds FOREST_CAP trees at most, cedars included (its id stride CHUNK_IDS is wider)
  for (let i = 0; i < 160 && out.length < cap; i++) {
    const x = (cx + r3()) * CHUNK, z = (cz + r3()) * CHUNK, roll = r3(), grow = r3(), d = riverEdge(seed, x, z, RIPARIAN + 4);
    if (d > RIPARIAN || roll > 0.95 * (1 - d / RIPARIAN) ** 0.5) continue;
    if (biomeAt(x, z, seed) !== 'wood' || beyond(x, z, seed) < 0.6 || !onLand(seed, x, z, 1.8) || crossingNear(seed, x, z, 14) || Math.hypot(x - KARST_AT.x, z - KARST_AT.z) < KARST_CLEARING) continue;
    const size = CEDAR_SIZE[0] + grow * (CEDAR_SIZE[1] - CEDAR_SIZE[0]);
    if (out.some(t => Math.hypot(t.x - x, t.z - z) < CEDAR_GAP * (0.6 + 0.4 * (size + t.size) * 0.5))) continue;
    out.push({ id: (cx >= 0 ? cx * 2 : -cx * 2 - 1) * 0 + 100000 + ((((cx >= 0 ? cx * 2 : -cx * 2 - 1) + (cz >= 0 ? cz * 2 : -cz * 2 - 1)) * ((cx >= 0 ? cx * 2 : -cx * 2 - 1) + (cz >= 0 ? cz * 2 : -cz * 2 - 1) + 1) / 2 + (cz >= 0 ? cz * 2 : -cz * 2 - 1)) * CHUNK_IDS) + out.length, x, z, size });
  }
  return out;
}
/** The root network's hub of a chunk (worldRoots joins the chunk's roots there): near its middle, nudged by the seed. The same rule serves the deep roots' convergences. */
export const hubAt = (cx: number, cz: number, seed = 1): { x: number; z: number } => ({ x: (cx + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, seed + 31) - 0.5) * 16, z: (cz + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, seed + 67) - 0.5) * 16 });
/** G4 (Noah): a root convergence for every place on the land but the karst: the hub of the place's chunk, marked above ground by a fairy ring with a pool of crystal water in it. One per chunk; `about` is the place it serves.
 * T7: the ring stands on dry level ground (RING_FOOT about it): at the hub when the hub's ground is such, else at the nearest such spot within RING_REACH of it, or on gentler-than-RING_SLOPE ground within RING_FAR (the chunk's roots run a spur from the hub to the ring: worldRoots). A hub in a village's river had its ring under the water. */
export interface Convergence { id: string; about: string; name: string; cx: number; cz: number; x: number; z: number }
export const RING_FOOT = 3.5, RING_REACH = 40, RING_FAR = 80, RING_SLOPE = 0.18; // RING_SLOPE: LEVEL_SLOPE × 1.8 (a literal: chunkModel and plateauModel import each other, and a constant read at the top of a module in that cycle is not yet set in the page's bundle)
const convCache = new Map<number, Convergence[]>();
export function convergences(seed = 1): Convergence[] {
  const cached = convCache.get(seed); if (cached) return cached; const out: Convergence[] = [], seen = new Set<string>();
  // The ring's pad (plateauModel) keeps clear of the places' own pads, so each is level.
  const padded = places(seed).filter(q => q.kind in FOOT);
  for (const p of places(seed)) { if (p.kind === 'karst') continue; const c = chunkOf(p.x, p.z), key = chunkKey(c.cx, c.cz); if (seen.has(key)) continue; seen.add(key); const h = hubAt(c.cx, c.cz, seed), clear = (x: number, z: number): boolean => padded.every(q => Math.hypot(q.x - x, q.z - z) >= FOOT[q.kind as keyof typeof FOOT] + RING_FOOT + PAD_FADE + 1);
    // Within RING_REACH on level ground; else on ground up to RING_SLOPE (the pad's edge a little steeper); else within RING_FAR; else the hub itself.
    const at = settle(seed, h.x, h.z, RING_FOOT, RING_REACH, clear, 4, 3) ?? settle(seed, h.x, h.z, RING_FOOT, RING_REACH, clear, 4, 3, RING_SLOPE) ?? settle(seed, h.x, h.z, RING_FOOT, RING_FAR, clear, 4, 4, RING_SLOPE) ?? h; out.push({ id: `conv:${p.id}`, about: p.id, name: `the fairy ring by ${p.name}`, cx: c.cx, cz: c.cz, x: at.x, z: at.z }); }
  convCache.set(seed, out); return out;
}
/** The chunks in the ring round a point. */
export function chunksAround(x: number, z: number, ring = LOAD_RING): { cx: number; cz: number }[] { const c = chunkOf(x, z), out: { cx: number; cz: number }[] = []; for (let i = -ring; i <= ring; i++) for (let k = -ring; k <= ring; k++) out.push({ cx: c.cx + i, cz: c.cz + k }); return out; }
