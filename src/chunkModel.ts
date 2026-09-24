// The land beyond the meadow (M1a.2): chunks of procedural ground round the village's authored island.
// Pure: no Three.js. Height and biome by value noise from the world seed; each chunk's trees from the
// chunk's own seed, so a chunk is the same whenever it is loaded. The meadow (the village's wood
// included) is an island the chunks defer to: no hills and no chunk trees within MEADOW_ISLAND of the
// village, and the karst stands on an island of its own (KARST_ISLAND), its clearing kept free of chunk trees.
import { mulberry32 } from './colors';
import { places, FOREST_RADIUS, KARST_AT } from './overworldModel';
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
/** How much the land beyond the meadow shows here: 0 inside the island, 1 beyond its fade. */
export const beyond = (x: number, z: number): number => { const r = Math.hypot(x, z), rk = Math.hypot(x - KARST_AT.x, z - KARST_AT.z); const t = Math.min(1, Math.max(0, (r - MEADOW_ISLAND) / ISLAND_FADE), Math.max(0, (rk - KARST_ISLAND) / KARST_FADE)); return t * t * t * (t * (t * 6 - 15) + 10); };
/** The hills: two octaves, up to HILL_M high, fading in past the meadow. Tuning. */
export const HILL_M = 7;
export function hills(x: number, z: number, seed = 1): number { const k = beyond(x, z); if (k <= 0) return 0; return k * HILL_M * (noise(x, z, 140, seed) * 0.7 + noise(x, z, 46, seed + 7) * 0.3 - 0.45); }
/** The biome: the dark forest about the lair, else meadow or wood by a slow noise (wood the more common). */
export function biomeAt(x: number, z: number, seed = 1): Biome {
  const lair = places(seed)[2]; if (Math.hypot(x - lair.x, z - lair.z) <= FOREST_RADIUS) return 'dark';
  return noise(x, z, 110, seed + 3) > 0.58 ? 'meadow' : 'wood';
}
export const chunkKey = (cx: number, cz: number): string => `${cx},${cz}`;
export const chunkOf = (x: number, z: number): { cx: number; cz: number } => ({ cx: Math.floor(x / CHUNK), cz: Math.floor(z / CHUNK) });
/** A chunk's trees, from its own seed: by biome's density, none on the island or in the karst's clearing, spaced. Ids are unique per chunk so a chunk tree is never confused with the village's. */
export function chunkTrees(cx: number, cz: number, seed = 1): Tree[] {
  const rand = mulberry32((seed * 92821 + cx * 7919 + cz * 104729 + 1) >>> 0), out: Tree[] = [], a = cx >= 0 ? cx * 2 : -cx * 2 - 1, b = cz >= 0 ? cz * 2 : -cz * 2 - 1, base = 100000 + ((a + b) * (a + b + 1) / 2 + b) * 64;
  for (let i = 0; i < 40 && out.length < 16; i++) {
    const x = (cx + rand()) * CHUNK, z = (cz + rand()) * CHUNK; if (beyond(x, z) < 0.35 || Math.hypot(x - KARST_AT.x, z - KARST_AT.z) < KARST_CLEARING) continue;
    const b = biomeAt(x, z, seed), keep = b === 'meadow' ? 0.12 : b === 'wood' ? 0.8 : 0.9; if (rand() > keep) continue;
    if (out.some(t => Math.hypot(t.x - x, t.z - z) < 4.5)) continue;
    out.push({ id: base + out.length, x, z, size: b === 'dark' ? 1.1 + rand() * 0.7 : 0.8 + rand() * 0.7 });
  }
  return out;
}
/** The chunks in the ring round a point. */
export function chunksAround(x: number, z: number, ring = LOAD_RING): { cx: number; cz: number }[] { const c = chunkOf(x, z), out: { cx: number; cz: number }[] = []; for (let i = -ring; i <= ring; i++) for (let k = -ring; k <= ring; k++) out.push({ cx: c.cx + i, cz: c.cz + k }); return out; }
