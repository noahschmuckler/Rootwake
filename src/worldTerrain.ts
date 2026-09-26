// One surface for mesh vertices, feet, grass and vegetation. Authored patches are
// constraints in the field, not overlapping meshes. Heights use the world seed.
import { biomeAt, hills, islands, MEADOW_ISLAND, ISLAND_FADE, KARST_ISLAND, KARST_FADE } from './chunkModel';
import { KARST_AT } from './overworldModel';
export const TERRAIN_STEP = 2;
export const smoothBand = (inner: number, outer: number, distance: number): number => {
  const t = Math.max(0, Math.min(1, (distance - inner) / (outer - inner)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
export interface Terrain {
  seed: number;
  vertex(x: number, z: number): number;
  height(x: number, z: number): number;
  colour(x: number, z: number): [number, number, number];
  normal(x: number, z: number): [number, number, number];
}
export function createTerrain(seed: number): Terrain {
  const meadow = (x: number, z: number) => 0.05 * Math.sin(x * 0.5) * Math.cos(z * 0.45);
  const vertex = (x: number, z: number): number => {
    const kx = x - KARST_AT.x, kz = z - KARST_AT.z;
    const k = 1 - smoothBand(KARST_ISLAND, KARST_ISLAND + KARST_FADE, Math.hypot(kx, kz));
    return (meadow(x, z) + hills(x, z, seed)) * (1 - k) + 0.05 * Math.sin(kx * 0.9) * Math.cos(kz * 0.8) * k;
  };
  // Same diagonal as PlaneGeometry; the collision surface is the rendered surface.
  const height = (x: number, z: number): number => {
    const ax = Math.floor(x / TERRAIN_STEP) * TERRAIN_STEP, az = Math.floor(z / TERRAIN_STEP) * TERRAIN_STEP;
    const u = (x - ax) / TERRAIN_STEP, v = (z - az) / TERRAIN_STEP;
    const b = vertex(ax, az + TERRAIN_STEP), d = vertex(ax + TERRAIN_STEP, az);
    return u + v <= 1 ? vertex(ax, az) * (1 - u - v) + d * u + b * v : vertex(ax + TERRAIN_STEP, az + TERRAIN_STEP) * (u + v - 1) + b * (1 - u) + d * (1 - v);
  };
  const colour = (x: number, z: number): [number, number, number] => {
    const b = biomeAt(x, z, seed);
    let c: [number, number, number] = b === 'meadow' ? [0.36, 0.47, 0.29] : b === 'wood' ? [0.30, 0.42, 0.26] : [0.16, 0.13, 0.19];
    const mix = (to: number[], k: number) => { c = c.map((v, i) => v * (1 - k) + to[i] * k) as typeof c; };
    // Colors are linear, matching Three.Color(hex) for the authored materials.
    for (const o of islands(seed)) mix([0.0953, 0.1714, 0.0685], 1 - smoothBand(MEADOW_ISLAND - 15, MEADOW_ISLAND + ISLAND_FADE, Math.hypot(x - o.x, z - o.z)));
    mix([0.0782, 0.1441, 0.0595], 1 - smoothBand(KARST_ISLAND - 10, KARST_ISLAND + KARST_FADE, Math.hypot(x - KARST_AT.x, z - KARST_AT.z)));
    return c;
  };
  const normal = (x: number, z: number): [number, number, number] => {
    const dx = vertex(x - 1, z) - vertex(x + 1, z), dz = vertex(x, z - 1) - vertex(x, z + 1), l = Math.hypot(dx, 2, dz);
    return [dx / l, 2 / l, dz / l];
  };
  return { seed, vertex, height, colour, normal };
}
