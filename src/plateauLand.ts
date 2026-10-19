// The plateau's land as the village walks and the vista draws it (PLATEAU.md, T2): the plateau's shape
// (plateauModel's bowl, hills, valleys and mountains) eroded by the vista's droplets everywhere but the
// villages' greens, the island and the lake's bed; then the terraces, the lake, the island and the river
// channels carved in exactly (plateauModel's `ground`), triangulated at the walking grid so the feet and
// the near mesh agree. The decks (the island's bridge, the footbridges) are walked on but not drawn as
// ground: the near mesh draws the land under them.
//
// The erosion is the load's main cost (seconds on a phone), and the world's seed is fixed, so the build
// bakes the eroded grid (vite.config's plateau plugin: `bakeLand` → `encodeLand`, gzipped) and the page
// loads it (`loadVillageLand`); a missing or stale bake (the dev server, a changed shape) erodes here.
import { TERRAIN_STEP, type Terrain } from './worldTerrain';
import { generate, heightAt, type Land } from './vistaTerrain';
import { plateau, PLATEAU_R, ISLAND_R, TERRACE_R, TERRACE_FADE, WATER_Y, MOUNTAIN_RISE, RIVER_HALF } from './plateauModel';
import { KARST_AT } from './overworldModel';
import { FOREST_RADIUS as KARST_FOREST } from './karstFlowModel';

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** Tuning: samples per side of the map; erosion droplets over the plateau and the mountains (the load's main cost on a phone). */
export const VILLAGE_LAND_N = 1025, VILLAGE_DROPLETS = 110000;
/** Tuning: how far past a river's water its gravel bank runs (m). */
const BANK_GRAVEL = 5;
const SNOW_Y = 340;

/** The eroded grid before the carving: heights, where water ran, where sediment lay, the cavity occlusion. */
export interface Eroded { n: number; half: number; h: Float32Array; flow: Float32Array; sediment: Float32Array; ao: Float32Array }
const halfOf = (seed: number): number => { const C = plateau(seed).centre; return Math.ceil((Math.hypot(C.x, C.z) + PLATEAU_R + MOUNTAIN_RISE + 450) / 64) * 64; };
/** The erosion itself (the costly part). */
export function bakeLand(seed: number): Eroded {
  const p = plateau(seed), C = p.centre, half = halfOf(seed);
  // Erosion works everywhere but where the land is authored: the villages' greens, the island and the lake's bed.
  const erodeMask = (x: number, z: number): number => {
    let m = smooth(ISLAND_R + 20, p.lakeR(Math.atan2(z - C.z, x - C.x)) + 60, Math.hypot(x - C.x, z - C.z));
    for (const t of p.terraces) m = Math.min(m, smooth(TERRACE_R, TERRACE_R + TERRACE_FADE + 40, Math.hypot(x - t.x, z - t.z)));
    return m;
  };
  const land = generate(seed, { droplets: VILLAGE_DROPLETS }, { size: half * 2, n: VILLAGE_LAND_N, shape: { base: p.base, seed }, waterY: WATER_Y, snowY: SNOW_Y, erodeMask, surface: undefined });
  return { n: land.n, half, h: land.h, flow: land.flow, sediment: land.sediment, ao: land.ao };
}
/** What a bake was made from: the shape at a few points, the grid and the erosion. A bake whose fingerprint differs from the code's is stale. */
export function fingerprint(seed: number): string {
  const p = plateau(seed), pts = [[0, 0], [400, -900], [-1300, 200], [900, 700], [-60, -330 - PLATEAU_R - 300]];
  return JSON.stringify({ v: 3, seed, n: VILLAGE_LAND_N, d: VILLAGE_DROPLETS, half: halfOf(seed), s: pts.map(([x, z]) => Math.round(p.base(x, z) * 100)), r: p.rivers.map(r => r.points.length) });
}
/** A bake as bytes: a JSON header (its fingerprint), then the heights in 1.6 cm steps as 16-bit differences along each row (smooth land compresses well so), and the three maps as bytes. */
export function encodeLand(seed: number, e: Eroded): Uint8Array {
  const head = new TextEncoder().encode(fingerprint(seed)), N = e.n * e.n, out = new Uint8Array(4 + head.length + N * 2 + N * 3), dv = new DataView(out.buffer);
  dv.setUint32(0, head.length, true); out.set(head, 4); let o = 4 + head.length;
  // Differences modulo 2^16: exact for any height in range, small where the land is smooth.
  for (let k = 0, prev = 0; k < N; k++, o += 2) { const q = Math.max(0, Math.min(65535, Math.round((e.h[k] + 50) * 64))); dv.setUint16(o, (q - prev) & 0xffff, true); prev = q; }
  for (const a of [e.flow, e.sediment, e.ao]) for (let k = 0; k < N; k++) out[o++] = Math.round(Math.max(0, Math.min(1, a[k])) * 255);
  return out;
}
/** Bytes back to a bake, or null when they are not this code's (stale, or not a bake at all). */
export function decodeLand(seed: number, bytes: Uint8Array): Eroded | null {
  try {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), hl = dv.getUint32(0, true); if (hl > 4096) return null;
    if (new TextDecoder().decode(bytes.subarray(4, 4 + hl)) !== fingerprint(seed)) return null;
    const n = VILLAGE_LAND_N, N = n * n; let o = 4 + hl; if (bytes.length !== o + N * 5) return null;
    const h = new Float32Array(N); for (let k = 0, q = 0; k < N; k++, o += 2) { q = (q + dv.getUint16(o, true)) & 0xffff; h[k] = q / 64 - 50; }
    const maps = [new Float32Array(N), new Float32Array(N), new Float32Array(N)]; for (const a of maps) for (let k = 0; k < N; k++) a[k] = bytes[o++] / 255;
    return { n, half: halfOf(seed), h, flow: maps[0], sediment: maps[1], ao: maps[2] };
  } catch { return null; }
}

export interface VillageLand { terrain: Terrain; land: Land; edge: number; ms: number; baked: boolean }
/** The village's land, from the baked grid when there is one: fetched, gunzipped and checked; else eroded here. */
export async function loadVillageLand(seed: number, base: Terrain, url: string): Promise<VillageLand> {
  const t0 = performance.now();
  try {
    if (typeof DecompressionStream !== 'undefined') {
      const res = await fetch(url);
      if (res.ok && res.body) { const bytes = new Uint8Array(await new Response(res.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()), e = decodeLand(seed, bytes); if (e) { const vl = villageLandFrom(seed, base, e, true); vl.ms = performance.now() - t0; return vl; } console.warn('plateau: the baked land is stale; eroding here'); }
    }
  } catch (err) { console.warn('plateau: no baked land', err); }
  return villageLand(seed, base);
}
/** The village's land eroded here, now. */
export function villageLand(seed: number, base: Terrain): VillageLand { const t0 = performance.now(), vl = villageLandFrom(seed, base, bakeLand(seed), false); vl.ms = performance.now() - t0; return vl; }

/** The village's land from an eroded grid: as the village's Terrain (every height the game reads) and the vista's Land (what is drawn). */
export function villageLandFrom(seed: number, base: Terrain, e: Eroded, baked: boolean): VillageLand {
  const p = plateau(seed), C = p.centre, { n, half } = e, cell = (half * 2) / (n - 1);
  const shape = { base: p.base, seed };
  // The eroded shape before the carving: what the fine ground carves into (carving the grid's own copy again would blend twice).
  const raw: Land = { seed, shape, size: half * 2, n, cell, half, waterY: WATER_Y, snowY: SNOW_Y, ceiling: 0, h: e.h, flow: e.flow, sediment: e.sediment, ao: e.ao, ms: { shape: 0, erosion: 0, ao: 0 } };
  const grid = (x: number, z: number): number => heightAt(raw, x, z);
  const vtx = (x: number, z: number): number => p.ground(x, z, grid);
  const tri = (x: number, z: number): number => {
    const ax = Math.floor(x / TERRAIN_STEP) * TERRAIN_STEP, az = Math.floor(z / TERRAIN_STEP) * TERRAIN_STEP, u = (x - ax) / TERRAIN_STEP, v = (z - az) / TERRAIN_STEP;
    const b = vtx(ax, az + TERRAIN_STEP), d = vtx(ax + TERRAIN_STEP, az);
    return u + v <= 1 ? vtx(ax, az) * (1 - u - v) + d * u + b * v : vtx(ax + TERRAIN_STEP, az + TERRAIN_STEP) * (u + v - 1) + b * (1 - u) + d * (1 - v);
  };
  // The drawn grid carries the carving too (the far meshes, the water's depth and the maps read it): the terraces, the lake's bed, the island, the channels.
  const h = new Float32Array(n * n), flow = e.flow.slice(); let top = -Infinity;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = i * cell - half, z = j * cell - half, k = j * n + i; h[k] = p.ground(x, z, () => e.h[k]); if (h[k] > top) top = h[k];
    // The rivers' beds and banks read as the vista reads a gully's: gravel, and no grass (its `flow` is how much water ran there).
    const nr = p.nearRiver(x, z, RIVER_HALF[1] + BANK_GRAVEL); if (nr) flow[k] = Math.max(flow[k], smooth(nr.half + BANK_GRAVEL, nr.half + 1, nr.d));
  }
  const land: Land = { ...raw, h, flow, ceiling: top + 30 };
  // The ground she walks: the deck where she is on one (the island's bridge, a footbridge), else the land.
  const height = (x: number, z: number): number => { const g = tri(x, z), d = p.deckAt(x, z); return d !== null && d > g ? d : g; };
  // The near mesh draws the land itself (never the decks), a hair lower on the karst's island, whose own forest floor lies over it.
  land.surface = (x, z) => tri(x, z) - 0.22 * (1 - smooth(KARST_FOREST + 20, KARST_FOREST + 34, Math.hypot(x - KARST_AT.x, z - KARST_AT.z)));
  const normal = (x: number, z: number): [number, number, number] => { const dx = tri(x - 1, z) - tri(x + 1, z), dz = tri(x, z - 1) - tri(x, z + 1), l = Math.hypot(dx, 2, dz); return [dx / l, 2 / l, dz / l]; };
  const terrain: Terrain = { seed, vertex: vtx, height, colour: base.colour, normal };
  return { terrain, land, edge: Math.hypot(C.x, C.z) + PLATEAU_R, ms: 0, baked };
}
