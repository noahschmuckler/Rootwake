// The land beyond the meadow (M1a.2): chunks of procedural ground round the village's authored island.
// Pure: no Three.js. Height and biome by value noise from the world seed; each chunk's trees from the
// chunk's own seed, so a chunk is the same whenever it is loaded. The meadow (the village's wood
// included) is an island the chunks defer to: no hills and no chunk trees within MEADOW_ISLAND of the
// village, and the karst stands on an island of its own (KARST_ISLAND), its clearing kept free of chunk trees.
import { mulberry32 } from './colors';
import { places, villageSites, onLand, FOREST_RADIUS, KARST_AT } from './overworldModel';
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
/** A forest tree's size by its age: the old giants a few, the mature most, the young filling the gaps. Tuning. */
export const AGES: { share: number; size: [number, number] }[] = [{ share: 0.14, size: [1.7, 2.4] }, { share: 0.5, size: [1.0, 1.6] }, { share: 0.36, size: [0.55, 0.95] }];
/** How many trees a chunk may hold, how hard the forest pass tries, and the spacing between trunks (m) on the plains and in a stand's heart (scaled by the trees' sizes). Tuning. */
// PINE BARRENS (Noah, 2026-10-21): pitch pines stand farther apart than the broadleaf stands did (their crowns are narrow and the floor is lit), so a stand is tall and open, not a wall.
export const FOREST_CAP = 48, FOREST_TRIES = 220, SPACING: [number, number] = [5.0, 2.8];
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
  return out;
}
/** The root network's hub of a chunk (worldRoots joins the chunk's roots there): near its middle, nudged by the seed. The same rule serves the deep roots' convergences. */
export const hubAt = (cx: number, cz: number, seed = 1): { x: number; z: number } => ({ x: (cx + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, seed + 31) - 0.5) * 16, z: (cz + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, seed + 67) - 0.5) * 16 });
/** G4 (Noah): a root convergence for every place on the land but the karst: the hub of the place's chunk, marked above ground by a fairy ring with a pool of crystal water in it. One per chunk; `about` is the place it serves. */
export interface Convergence { id: string; about: string; name: string; cx: number; cz: number; x: number; z: number }
const convCache = new Map<number, Convergence[]>();
export function convergences(seed = 1): Convergence[] {
  const cached = convCache.get(seed); if (cached) return cached; const out: Convergence[] = [], seen = new Set<string>();
  for (const p of places(seed)) { if (p.kind === 'karst') continue; const c = chunkOf(p.x, p.z), key = chunkKey(c.cx, c.cz); if (seen.has(key)) continue; seen.add(key); const h = hubAt(c.cx, c.cz, seed); out.push({ id: `conv:${p.id}`, about: p.id, name: `the fairy ring by ${p.name}`, cx: c.cx, cz: c.cz, x: h.x, z: h.z }); }
  convCache.set(seed, out); return out;
}
/** The chunks in the ring round a point. */
export function chunksAround(x: number, z: number, ring = LOAD_RING): { cx: number; cz: number }[] { const c = chunkOf(x, z), out: { cx: number; cz: number }[] = []; for (let i = -ring; i <= ring; i++) for (let k = -ring; k <= ring; k++) out.push({ cx: c.cx + i, cz: c.cz + k }); return out; }
