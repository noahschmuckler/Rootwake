// The village under the vista's look (Noah, 2026-10-13: "vista look, layout kept"). Nothing of the
// village's game changes: its places, its model, its figures and its rules are where they were. What
// changes is the land and the light: the village's gentle hills, with eroded mountains rising past the
// farthest den as the horizon, drawn by the vista's terrain, grass, trees, sky, haze, shadows and grade;
// a sun that crosses the sky with the village's clock and a moon by night. The chunks keep their trees
// (colliders, roots, climbing) and stop drawing them and the ground; the vista draws both.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import type { Terrain } from './worldTerrain';
import { rng, type Land, type Tree as VTree, type Rock } from './vistaTerrain';
import { buildVista, QUALITIES, CASTER_LAYER, sunDirection, UNDER_FOG_M, UNDER_COLOUR, type Hour, type Quality, type VistaWorld } from './vistaWorld';
import { places, dens, ruins, warrens, wallows, ownWarrens, moot, onLand, riverEdge, FOREST_RADIUS as DARK_RADIUS, KARST_AT } from './overworldModel';
import { convergences, beyond, noise, CHUNK, forestField, forestAt, RIPARIAN, floorSampler, oakShare } from './chunkModel';
import { createUnderstory, type Understory } from './understory';
import { FOREST_RADIUS as KARST_FOREST, NODES as KARST_NODES, nodeFrame } from './karstFlowModel';
import { TREES, type Tree } from './villageModel';
import { TAINT, depthAt, inTaint, type Ring } from './taintModel';
import type { HubRef } from './contagionModel';

// ── the land ─────────────────────────────────────────────────────────────
/** The squarish norm the mountains rise by: the dens lie on a square grid, so the range follows a rounded square. */
const norm4 = (x: number, z: number): number => Math.sqrt(Math.sqrt(x ** 4 + z ** 4));
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// The land itself is the plateau's (PLATEAU.md): plateauLand.ts.
export { villageLand, VILLAGE_LAND_N, VILLAGE_DROPLETS, type VillageLand } from './plateauLand';
import type { VillageLand } from './plateauLand';
import { PLATEAU_R, MOUNTAIN_RISE, CLOUD_Y, LOW_Y } from './plateauModel';
/** T6: how far the lowland and the cloud sea run out from the brink before the haze has them (m from the map's middle). Tuning. */
const FAR_REACH = 18000;
/** T6: how much of the lowland the cloud sea hides (0..1); the rest is the breaks. Tuning. */
const CLOUD_COVER = 0.5;
/** T6: the air below the plateau's level, as a share of the haze at its base: thin enough that the lowland shows through the breaks. Tuning. */
const HAZE_BELOW = 0.07;

// ── the taint (MOTHER.md, M1) ──────────────────────────────────────────────
/** C1 (CONTAGION.md): the taint as field reads of her growth (contagionModel's index): `at` the breach (the dead trees lean toward it, her arms stand there), `ring`/`depth`/`vein` at a point, `veins` the breach's root lines as M1 drew them (world polylines, as sampled points) and `hyphae` the growth's claimed lengths along the root hubs (read again at each refresh: the growth moves at dawn). */
export interface TaintLook { at: { x: number; z: number }; ring: (x: number, z: number) => Ring; depth: (x: number, z: number) => number; vein: (x: number, z: number) => number; veins: { x: number; z: number }[][]; hyphae: () => { from: HubRef; to: HubRef; a: { x: number; z: number }; b: { x: number; z: number }; tip: { x: number; z: number }; t: number }[];
  /** C1.1: everything the reads over a world rectangle (inclusive) can depend on (contagionModel.fieldStamp): the ground and the trees keep what they drew where it is unchanged. */
  stamp: (x0: number, z0: number, x1: number, z1: number) => string }
/** A hypha's whole edge sampled every 2 m (the vein's strength past the tip fades over TAINT.veins, read by taint.vein). */
const hyphaLines = (t: TaintLook): { x: number; z: number }[][] => t.hyphae().map(h => { const len = Math.hypot(h.b.x - h.a.x, h.b.z - h.a.z), n = Math.max(2, Math.ceil(len / 2)), line: { x: number; z: number }[] = []; for (let k = 0; k <= n; k++) line.push({ x: h.a.x + (h.b.x - h.a.x) * k / n, z: h.a.z + (h.b.z - h.a.z) * k / n }); return line; });
/** The mild ring's depth at its top (the grey's edge): the streaks and the grey trees thin from there to nothing at the edge; a hypha's mild band (MILD_DEPTH) sits inside it. */
const MILD_TOP = depthAt(TAINT.grey);
/** The vein points in a coarse hash, for asking how near a root line (the breach's, or a hypha's) a tree stands. C1.1: the breach's lines never move, so their hash is built once (veinGrids keeps it by the lines) and the hyphae's laid beside it each dawn. */
type VeinGrid = Map<string, { x: number; z: number }[]>;
const VEIN_C = 8, veinGrids = new WeakMap<{ x: number; z: number }[][], VeinGrid>();
function veinGrid(lines: { x: number; z: number }[][]): VeinGrid { const grid: VeinGrid = new Map(); for (const line of lines) for (const p of line) { const k = `${Math.floor(p.x / VEIN_C)},${Math.floor(p.z / VEIN_C)}`; (grid.get(k) ?? grid.set(k, []).get(k)!).push(p); } return grid; }
function veinIndex(fixed: { x: number; z: number }[][], moving: { x: number; z: number }[][]): (x: number, z: number) => number {
  let base = veinGrids.get(fixed); if (!base) { base = veinGrid(fixed); veinGrids.set(fixed, base); } const grids = [base, veinGrid(moving)];
  return (x, z) => { let best = Infinity; const cx = Math.floor(x / VEIN_C), cz = Math.floor(z / VEIN_C); for (let i = -1; i <= 1; i++) for (let k = -1; k <= 1; k++) { const key = `${cx + i},${cz + k}`; for (const g of grids) for (const p of g.get(key) ?? []) best = Math.min(best, Math.hypot(p.x - x, p.z - z)); } return best; };
}
const hash01 = (n: number): number => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
/** Tuning: linear colours of the taint's ground (heart, nursery, grey, a grey streak in the mild ring, a vein outside the edge, a vein inside it). */
const T_HEART = [0.02, 0.0, 0.028, 0.97], T_NURSERY = [0.03, 0.006, 0.035, 0.95], T_GREY = [0.105, 0.1, 0.095, 0.93], T_STREAK = [0.11, 0.105, 0.1, 0.8], T_VEIN = [0.2, 0.19, 0.18, 0.95], T_VEIN_IN = [0.015, 0.003, 0.02, 0.97];
/** A tree a vein reaches within this (m) greys. */
const VEIN_TREE_M = 8;

// ── the woods, the dark forest and the blight, as a tint on the land ───────
/** Tuning: linear colours laid over the vista's grass, and how much. */
const WOOD = [0.06, 0.13, 0.04, 0.35], DARK = [0.05, 0.035, 0.07, 0.9], BLIGHT = [0.035, 0.012, 0.045, 0.95], MEADOW = [0.1, 0.26, 0.05, 0.7];
/** FOREST (Noah, 2026-10-20): each cell's depth in a stand of forest (chunkModel.forestField), once per land. */
const forestCells = new WeakMap<Land, Float32Array>();
function forestOf(land: Land, seed: number): Float32Array {
  let f = forestCells.get(land); if (f) return f;
  // Sampled every STEP cells and read between: the stands are tens of metres across, and the full map took a quarter-second on a desktop.
  const { n, cell, half } = land, at = forestField(seed), STEP = 3, m = Math.ceil((n - 1) / STEP) + 1, g = new Float32Array(m * m); f = new Float32Array(n * n);
  for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) g[j * m + i] = at(Math.min(n - 1, i * STEP) * cell - half, Math.min(n - 1, j * STEP) * cell - half);
  for (let j = 0; j < n; j++) { const v = j / STEP, j0 = Math.min(m - 2, Math.floor(v)), tv = v - j0; for (let i = 0; i < n; i++) { const u = i / STEP, i0 = Math.min(m - 2, Math.floor(u)), tu = u - i0, k = j0 * m + i0; f[j * n + i] = (g[k] * (1 - tu) + g[k + 1] * tu) * (1 - tv) + (g[k + m] * (1 - tu) + g[k + m + 1] * tu) * tv; } }
  forestCells.set(land, f); return f;
}
/** PINE BARRENS (Noah, 2026-10-21): under a stand the floor is needle litter, and where the canopy opens, the barrens' pale sugar sand (MOSS is
 * the sand now: the noise that opened the mould to moss opens the needles to sand); how much it covers the wood's own green. Linear rgb. Tuning. */
const LITTER = [0.2, 0.11, 0.05], MOSS = [0.5, 0.42, 0.27], LITTER_A: [number, number] = [0.4, 0.92];
/** T4c (PINE BARRENS): where the oaks stand among the pines, 0..1 by a slow noise (groves of oak, and oak scattered through the pine): the look's tree kinds and the leaf mould both read it. */
export { oakShare } from './chunkModel';
/** T4c: what lies on the floor, a cell at a time (n×n×4: needles, leaf mould, moss and peat, bare sand; 0..255), from how deep in a stand it lies, how
 * many oaks are about, how near the water it is. Sand shows where the wood is open; needles thicken with the pines, leaf mould with the oaks, and by
 * the streams the floor is peat and sphagnum. Sampled every third cell (as forestOf) and read between. Tuning. */
export function floorMap(land: Land, seed: number): Uint8Array {
  const { n, cell, half } = land, STEP = 3, m = Math.ceil((n - 1) / STEP) + 1, g = new Float32Array(m * m * 4), out = new Uint8Array(n * n * 4), at = floorSampler(seed, KARST_FOREST);
  for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) {
    const x = Math.min(n - 1, i * STEP) * cell - half, z = Math.min(n - 1, j * STEP) * cell - half, k = (j * m + i) * 4, f = at(x, z);
    if (!f) continue; g[k] = f[0]; g[k + 1] = f[1]; g[k + 2] = f[2]; g[k + 3] = f[3];
  }
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const u = i / STEP, v = j / STEP, i0 = Math.min(m - 2, Math.floor(u)), j0 = Math.min(m - 2, Math.floor(v)), tu = Math.min(1, u - i0), tv = Math.min(1, v - j0), k = (j * n + i) * 4;
    for (let c = 0; c < 4; c++) { const a = g[(j0 * m + i0) * 4 + c], b = g[(j0 * m + i0 + 1) * 4 + c], d = g[((j0 + 1) * m + i0) * 4 + c], e = g[((j0 + 1) * m + i0 + 1) * 4 + c]; out[k + c] = Math.round(255 * Math.min(1, ((a * (1 - tu) + b * tu) * (1 - tv) + (d * (1 - tu) + e * tu) * tv))); }
  }
  return out;
}
/** The canopy (0..255 a cell) the grass thins under: a stand's depth, opened here and there by gaps of light. */
export function canopyMap(land: Land, seed: number): Uint8Array {
  const { n, cell, half } = land, f = forestOf(land, seed), out = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const k = j * n + i, v = f[k]; if (v <= 0) continue; const gap = noise(i * cell - half, j * cell - half, 22, seed + 73); out[k] = Math.round(255 * Math.min(1, Math.max(0, v * (0.7 + 0.5 * gap)))); }
  return out;
}
/** C1.1: what groundTint keeps between dawns: its bytes, the field's stamp per STAMP_TILE m tile of the land, and the land's own stamp (the blight) they were drawn under. `tiles` is how many tiles the last call drew. */
export interface GroundCache { bytes: Uint8Array | null; stamps: Map<string, string>; land: string; tiles: number }
export const groundCache = (): GroundCache => ({ bytes: null, stamps: new Map(), land: '', tiles: 0 });
/** The side (m) of the tiles the ground's tint is kept by; aligned to the land's corner, which lies on a multiple of 64 (plateauLand.halfOf), so a tile is one of the field index's cells. Tuning. */
const STAMP_TILE = 64;
/** The land's tint: the villages' meadows, the woods and their floors, the dark forest, the blight, and the taint's rings, streaks and veins (the breach's lines and the hyphae).
 * C1.1 (the dawn hitch): given a `cache` from the last call, only the tiles whose field stamp (`taint.stamp`) moved since are drawn again, each with a cell's margin, and the
 * vein pass replays, in its order, every line point whose splat reaches a redrawn cell; byte-equal to a full draw (the stamp names everything a cell's reads can depend
 * on). The whole map is drawn when there is no cache, when `landStamp` (what `blighted` reads) moved, or `full`. */
export function groundTint(land: Land, seed: number, blighted: (x: number, z: number) => boolean, taint?: TaintLook, cache?: GroundCache, landStamp = '', full = false): Uint8Array {
  const { n, cell, half } = land, lair = places(seed).find(p => p.id === 'lair')!, forest = forestOf(land, seed);
  const whole = !cache || !cache.bytes || !taint || full || cache.land !== landStamp, out = cache?.bytes && cache.bytes.length === n * n * 4 ? cache.bytes : new Uint8Array(n * n * 4);
  // Which cells are drawn: all, or those of the tiles whose stamp moved (plus a cell round each: a line point's splat reaches a neighbour).
  let mask: Uint8Array | null = null, tiles = 0; const TILES = Math.ceil(2 * half / STAMP_TILE);
  if (taint && cache) {
    const next = new Map<string, string>();
    for (let tj = 0; tj < TILES; tj++) for (let ti = 0; ti < TILES; ti++) {
      const x0 = ti * STAMP_TILE - half, z0 = tj * STAMP_TILE - half, st = taint.stamp(x0, z0, x0 + STAMP_TILE - 1e-3, z0 + STAMP_TILE - 1e-3), key = `${ti},${tj}`; if (st) next.set(key, st);
      if (whole || st !== (cache.stamps.get(key) ?? '')) { tiles++; if (!whole) { mask ??= new Uint8Array(n * n); const i0 = Math.max(0, Math.floor((x0 + half) / cell) - 1), i1 = Math.min(n - 1, Math.ceil((x0 + STAMP_TILE + half) / cell) + 1), j0 = Math.max(0, Math.floor((z0 + half) / cell) - 1), j1 = Math.min(n - 1, Math.ceil((z0 + STAMP_TILE + half) / cell) + 1); for (let j = j0; j <= j1; j++) mask.fill(1, j * n + i0, j * n + i1 + 1); } }
    }
    cache.stamps = next;
    if (!whole && !mask) { cache.tiles = 0; return out; }
  }
  if (cache) { cache.land = landStamp; cache.bytes = out; cache.tiles = whole ? TILES * TILES : tiles; }
  const drawn = (i: number, j: number): boolean => !mask || mask[j * n + i] === 1;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    if (!drawn(i, j)) continue;
    const x = i * cell - half, z = j * cell - half, b = Math.min(1, beyond(x, z, seed) * 1.6), k = (j * n + i) * 4; out[k] = out[k + 1] = out[k + 2] = out[k + 3] = 0;
    // The villages' meadows are kept: a lush green, whatever pale patch of the vista's grass they fall in.
    if (b < 1) { out[k] = MEADOW[0] * 255; out[k + 1] = MEADOW[1] * 255; out[k + 2] = MEADOW[2] * 255; out[k + 3] = MEADOW[3] * (1 - b) * 255; }
    if (b <= 0) continue;
    const dark = 1 - smooth(DARK_RADIUS - 10, DARK_RADIUS + 10, Math.hypot(x - lair.x, z - lair.z));
    let c = blighted(x, z) ? BLIGHT : dark > 0.5 ? DARK : noise(x, z, 110, seed + 3) > 0.58 ? null : WOOD;
    // The taint: black at the heart and in the nursery, the dead grey of poisoned soil, grey streaks thinning through the mild ring (C1: read from her growth, so a hypha's claimed length is a grey band with a mild one past it).
    if (taint) { const ring = taint.ring(x, z); if (ring === 'heart') c = T_HEART; else if (ring === 'nursery') c = T_NURSERY; else if (ring === 'grey') c = T_GREY; else if (ring === 'mild' && noise(x, z, 14, seed + 61) > 0.3 + 0.55 * (1 - Math.min(1, taint.depth(x, z) / MILD_TOP))) c = T_STREAK; }
    if (!c) continue;
    // FOREST: under a stand the wood's green gives way to leaf mould, mossy where the canopy opens.
    if (c === WOOD) { const fv = forest[j * n + i]; if (fv > 0.02) { const lit = Math.min(1, fv * (0.8 + 0.4 * noise(x, z, 7, seed + 71))), moss = smooth(0.55, 0.75, noise(x, z, 13, seed + 72)) * 0.7, a = LITTER_A[0] + (LITTER_A[1] - LITTER_A[0]) * lit; out[k] = (WOOD[0] + ((LITTER[0] + (MOSS[0] - LITTER[0]) * moss) - WOOD[0]) * lit) * 255; out[k + 1] = (WOOD[1] + ((LITTER[1] + (MOSS[1] - LITTER[1]) * moss) - WOOD[1]) * lit) * 255; out[k + 2] = (WOOD[2] + ((LITTER[2] + (MOSS[2] - LITTER[2]) * moss) - WOOD[2]) * lit) * 255; out[k + 3] = a * b * 255; continue; } }
    out[k] = c[0] * 255; out[k + 1] = c[1] * 255; out[k + 2] = c[2] * 255; out[k + 3] = c[3] * b * 255;
  }
  // The veins: her infection along the root lines, black through the grey, grey out into the living wood, fading TAINT.veins past the edge; C1: and the hyphae's claimed lengths, ashen outside the breach's edge as the veins are, fading past each tip. The last line to reach a cell colours it (the order matters: a partial draw replays it).
  if (taint) for (const line of [...taint.veins, ...hyphaLines(taint)]) for (const p of line) {
    const i = Math.round((p.x + half) / cell), j = Math.round((p.z + half) / cell); if (i < 0 || j < 0 || i >= n || j >= n) continue;
    if (mask) { let any = false; for (let dj = -1; dj <= 1 && !any; dj++) for (let di = -1; di <= 1; di++) { const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < n && jj < n && mask[jj * n + ii] === 1) { any = true; break; } } if (!any) continue; }
    const s = taint.vein(p.x, p.z), ring = taint.ring(p.x, p.z); if (s <= 0 || ring === 'heart' || ring === 'nursery') continue;
    const c = inTaint(taint.at, p.x, p.z) ? T_VEIN_IN : T_VEIN;
    const b = Math.min(1, beyond(p.x, p.z, seed) * 1.6); if (b <= 0) continue;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= n || jj >= n || !drawn(ii, jj)) continue; const k = (jj * n + ii) * 4, a = c[3] * s * b * 255 * (di || dj ? 0.7 : 1); out[k] = c[0] * 255; out[k + 1] = c[1] * 255; out[k + 2] = c[2] * 255; out[k + 3] = Math.max(a, out[k + 3]); }
  }
  return out;
}

// ── the trees ────────────────────────────────────────────────────────────
/** C1.1: what villageTrees keeps between dawns: each chunk's trees as drawn, keyed by the field's stamp over the chunk, under one stamp of the land (the blight). `chunks` is how many chunks the last call drew again. */
export interface TreeCache { land: string; byChunk: Map<string, { stamp: string; trees: VTree[] }>; chunks: number }
export const treeCache = (): TreeCache => ({ land: '', byChunk: new Map(), chunks: 0 });
/** Every tree the village knows, as the vista draws it: the chunks' (all of them, built or not) and each village's own wood. Kind 5 the village tree, 6 in the dark forest, 7 blighted.
 * C1.1 (the dawn hitch): given a `cache`, a chunk's trees are kept while the field's stamp over its square (`taint.stamp`) and the land's (`landStamp`, what `blighted` reads) are what they
 * were drawn under: a tree's kind depends on nothing else that moves (the breach's lines and the hyphae within VEIN_TREE_M are in the stamp: a hypha is listed over its whole edge). */
export function villageTrees(land: Land, edge: number, terrain: Terrain, treesOf: (cx: number, cz: number) => Tree[], origins: { x: number; z: number }[], dark: (x: number, z: number) => boolean, blighted: (x: number, z: number) => boolean, taint?: TaintLook, seed = 1, cache?: TreeCache, landStamp = '', full = false): VTree[] {
  const out: VTree[] = [], reach = Math.ceil(edge / CHUNK), vein = taint ? veinIndex(taint.veins, hyphaLines(taint)) : null;
  // MOTHER.md: in the taint, kind 10 (the nursery's growths, the heart's) where the trees are gone, 9 (grey, dead, twitching) through the grey and more and more of the mild ring, and along the veins a little way past the edge. C1: the rings and the veins' strength are her growth's (a hypha's claimed length is grey within VEIN_W, so its trees grey with it; past its tip the vein fades).
  const kindAt = (x: number, z: number, id: number): VTree["kind"] => {
    const base = blighted(x, z) ? 7 : dark(x, z) ? 6 : 5; if (!taint || !vein) return base;
    const ring = taint.ring(x, z), h = hash01(id);
    if (ring === 'heart' || ring === 'nursery') return 10;
    if (ring === 'grey') return 9;
    if (ring === 'mild') return h < 0.15 + 0.8 * Math.min(1, taint.depth(x, z) / MILD_TOP) || vein(x, z) < VEIN_TREE_M ? 9 : 6;
    const s = taint.vein(x, z); return s > 0 && vein(x, z) < VEIN_TREE_M && h < s * 1.2 ? 9 : base;
  };
  // PINE BARRENS: the chunks' living trees are pitch pines (11), blackjack oaks among them by oakShare (12), and white cedars along the rivers (13, where chunkModel.cedars drew them); the villages' own woods keep their broadleaves (5), as do the dark wood and the taint.
  const barrens = (x: number, z: number, id: number): VTree["kind"] => riverEdge(seed, x, z, RIPARIAN + 4) <= RIPARIAN ? 13 : hash01(id * 0.37 + 11) < oakShare(x, z, seed) ? 12 : 11;
  const treeOf = (x: number, z: number, size: number, id: number, pine = false): VTree => { const k = kindAt(x, z, id); return { x, z, y: terrain.height(x, z), kind: pine && k === 5 ? barrens(x, z, id) : k, scale: size, rot: (id * 2.399963) % (Math.PI * 2) }; };
  if (cache && (full || cache.land !== landStamp)) { cache.byChunk.clear(); cache.land = landStamp; } let drawn = 0;
  for (let cz = -reach; cz <= reach; cz++) for (let cx = -reach; cx <= reach; cx++) {
    // A chunk's trees stand within its square (chunkModel.chunkTrees), so the stamp is read just short of its far edges.
    const key = `${cx},${cz}`, stamp = taint ? taint.stamp(cx * CHUNK, cz * CHUNK, (cx + 1) * CHUNK - 1e-3, (cz + 1) * CHUNK - 1e-3) : '', have = cache?.byChunk.get(key);
    if (have && have.stamp === stamp) { for (const t of have.trees) out.push(t); continue; }
    const list: VTree[] = []; for (const t of treesOf(cx, cz)) if (norm4(t.x, t.z) < edge - 40) list.push(treeOf(t.x, t.z, t.size, t.id, true));
    cache?.byChunk.set(key, { stamp, trees: list }); drawn++; for (const t of list) out.push(t);
  }
  if (cache) cache.chunks = drawn;
  for (const o of origins) for (const t of TREES) out.push(treeOf(t.x + o.x, t.z + o.z, t.size, t.id + o.x * 7 + o.z * 13));
  // The karst's own trees (its forest floor, its ledges, the helix on its faces): framed as the free flow frames them, so a trunk climb meets its crown; pines as the vista's conifer (a tenth of its height per size: the karst's pine is 5 m at size 1); ferns stay the karst's.
  const at = new THREE.Matrix4().makeTranslation(KARST_AT.x, 0, KARST_AT.z), m = new THREE.Matrix4();
  for (const n of Object.values(KARST_NODES)) {
    if (n.kind === 'fern' || n.id === 'pine') continue; // no tree on the Wellspire's top (Noah, 2026-10-24: it will be her progress indicator)
    const pine = n.kind === 'pine', s = pine ? n.size * 0.38 : n.size;
    m.copy(at).multiply(nodeFrame(n)).multiply(new THREE.Matrix4().makeScale(s, s, s));
    out.push({ x: n.at.x + KARST_AT.x, z: n.at.z + KARST_AT.z, y: n.at.y, kind: pine ? 3 : n.leaf === 'maple' ? 8 : 5, scale: s, rot: 0, frame: m.toArray() });
  }
  void land; return out;
}

// ── rocks ────────────────────────────────────────────────────────────────
/** Tuning: boulders, few and small where she walks (no collider: none is taller than her knee), many and big on the foothills. */
const ROCKS_LAND = 900, ROCKS_HILLS = 900, ROCK_CLEAR = 16;
export function villageRocks(vl: VillageLand, seed: number): Rock[] {
  const r = rng(seed * 577 + 3), out: Rock[] = [], half = vl.edge + 650;
  const keep = [...places(seed), ...dens(seed), ...ruins(seed), ...warrens(seed), ...wallows(seed), ...ownWarrens(seed), moot(seed), ...convergences(seed)];
  const clear = (x: number, z: number) => beyond(x, z, seed) > 0.8 && Math.hypot(x - KARST_AT.x, z - KARST_AT.z) > KARST_FOREST + 40 && !keep.some(p => Math.hypot(x - p.x, z - p.z) < ROCK_CLEAR + ((p as { radius?: number }).radius ?? 0));
  for (let k = 0, land = 0, hills = 0; k < 60000 && (land < ROCKS_LAND || hills < ROCKS_HILLS); k++) {
    const x = (r() - 0.5) * 2 * half, z = (r() - 0.5) * 2 * half, d = norm4(x, z) - vl.edge;
    if (d < -40) { if (land >= ROCKS_LAND || !clear(x, z)) continue; out.push({ x, z, y: vl.terrain.height(x, z), scale: 0.25 + r() ** 2 * 0.65, rot: r() * 6.28, tilt: (r() - 0.5) * 0.4 }); land++; }
    else if (d < 600) { if (hills >= ROCKS_HILLS) continue; out.push({ x, z, y: vl.terrain.height(x, z), scale: 0.8 + r() ** 3 * 5, rot: r() * 6.28, tilt: (r() - 0.5) * 0.6 }); hills++; }
  }
  return out;
}

// ── the village's day as the vista's hours ──────────────────────────────
type Key = Omit<Hour, 'name' | 'elevation' | 'azimuth'> & { at: number };
/** Tuning: the sky at clock hours through the village's day (dawn 05:30, dusk 19:30); between them every value blends. */
const KEYS: Key[] = [
  { at: 4.6, sun: '#9fb4e0', sunI: 0.35, zenith: '#0a1228', horizon: '#26324e', ambSky: '#3a4a78', ambGround: '#141822', ambI: 0.55, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.35, exposure: 1.4, stars: 1 },
  { at: 5.8, sun: '#ff9a6a', sunI: 1.3, zenith: '#3a5a9a', horizon: '#e8a888', ambSky: '#8a9cc8', ambGround: '#4a4440', ambI: 0.65, haze: 0.0012, hazeFall: 1 / 80, cloud: 0.4, exposure: 1.15, stars: 0.2 },
  { at: 7.5, sun: '#ffd9a8', sunI: 2.1, zenith: '#5d8fd0', horizon: '#d8dde0', ambSky: '#b4cbea', ambGround: '#7a7658', ambI: 0.85, haze: 0.0011, hazeFall: 1 / 90, cloud: 0.4, exposure: 1.0, stars: 0 },
  { at: 12.5, sun: '#fff4e0', sunI: 2.0, zenith: '#3f7fd8', horizon: '#c8def0', ambSky: '#b0cdf2', ambGround: '#7c8656', ambI: 0.9, haze: 0.00042, hazeFall: 1 / 260, cloud: 0.55, exposure: 0.95, stars: 0 },
  { at: 17.6, sun: '#ffc590', sunI: 2.0, zenith: '#5a7bbf', horizon: '#f2c9a0', ambSky: '#aab8de', ambGround: '#6e5c48', ambI: 0.88, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.5, exposure: 1.05, stars: 0 },
  { at: 19.3, sun: '#ff7a4a', sunI: 1.5, zenith: '#2c3a6e', horizon: '#e79a7c', ambSky: '#7680b0', ambGround: '#443a44', ambI: 0.8, haze: 0.0007, hazeFall: 1 / 200, cloud: 0.45, exposure: 1.2, stars: 0.15 },
  { at: 20.4, sun: '#9fb4e0', sunI: 0.35, zenith: '#0a1228', horizon: '#26324e', ambSky: '#3a4a78', ambGround: '#141822', ambI: 0.55, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.35, exposure: 1.4, stars: 1 },
];
const mixHex = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();
/** The hour at a clock time (0..24): the sun from the east at 05:30 through the south to the west at 19:30, then the moon. */
export function hourAtClock(h: number): Hour {
  const hh = ((h % 24) + 24) % 24, ks = [...KEYS, { ...KEYS[0], at: KEYS[0].at + 24 }], x = hh < KEYS[0].at ? hh + 24 : hh;
  let i = 0; while (i < ks.length - 2 && x >= ks[i + 1].at) i++;
  const a = ks[i], b = ks[i + 1], t = Math.min(1, Math.max(0, (x - a.at) / (b.at - a.at)));
  const num = (k: keyof Key) => (a[k] as number) * (1 - t) + (b[k] as number) * t, col = (k: keyof Key) => mixHex(a[k] as string, b[k] as string, t);
  const day = hh >= 5.5 && hh <= 19.5, f = day ? (hh - 5.5) / 14 : (((hh - 19.5) % 24) + 24) % 24 / 10;
  const elevation = Math.max(3, (day ? 60 : 38) * Math.sin(Math.PI * Math.min(1, f))), azimuth = 90 + 180 * Math.min(1, f);
  return { name: day ? 'Day' : 'Night', elevation, azimuth, sun: col('sun'), sunI: num('sunI'), zenith: col('zenith'), horizon: col('horizon'), ambSky: col('ambSky'), ambGround: col('ambGround'), ambI: num('ambI'), haze: num('haze'), hazeFall: num('hazeFall'), cloud: num('cloud'), exposure: num('exposure'), stars: num('stars') };
}

// ── the look ─────────────────────────────────────────────────────────────
export interface LookFrame { clockHour: number; feet: THREE.Vector3; under: number; /** T8 (PLATEAU.md, the stratum): how far under the soil she is on a shallow ride (the grass, a surface root; 0..1): the rock under the roots, the soil's underside, the fog that closes in the dark. Not the deep, nor the karst's conduits. */ stratum?: number; interior: boolean; gloom: number; hidden?: boolean; /** MOTHER.md: the Colour's strength (0..1) and how far into her out-breath (0..1); a tree's flare on screen (uv x, y, radius, strength; hue 0..1); the grey fog thinning (0..1). */ colour?: number; exhale?: number; spot?: [number, number, number, number]; spotHue?: number; clear?: number }
export interface VillageLook {
  world: VistaWorld; quality: Quality;
  /** FOREST: what grows under the trees (understory.ts). */
  understory: Understory;
  frame(f: LookFrame): void;
  render(): void;
  /** T8 (dev): the stratum's state and the look's fog reach (m, to 5%). */
  stratum(): { amount: number; rock: boolean; rockTris: number; tiles: number; hidden: string[]; fogReach: number };
  /** Where grass gives way to the village (its paths, floors and fields), drawn from above; again when huts are built. */
  refreshClearing(): void;
  /** The trees' kinds and the ground's tint again under the taint and the blight (at dawn): only what moved since the last, `full` everything (C1.1). Return how many chunks / tiles were drawn again. */
  refreshTrees(full?: boolean): number;
  refreshGround(full?: boolean): number;
  /** Dev: the trees as last given to the vista. */
  trees(): VTree[];
  setQuality(q: Quality): void;
}
export interface LookInputs {
  renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight;
  vl: VillageLand; seed: number;
  treesOf: (cx: number, cz: number) => Tree[]; villages: () => { root: THREE.Object3D; x: number; z: number }[];
  dark: (x: number, z: number) => boolean; blighted: (x: number, z: number) => boolean;
  /** RUINS.md: squares (centre, half-side) the understory keeps clear of: the industrial ruins' yards. */
  clearings?: { x: number; z: number; r: number }[];
  /** MOTHER.md: the breach and its veins (none: no taint drawn). */
  taint?: TaintLook;
  /** C1.1: a stamp of whatever else the trees' kinds and the ground's tint read that can move (the blight's reach); when it moves, everything is drawn again. */
  landStamp?: () => string;
  quality?: Quality;
}
/** Tuning: the grade after tone mapping, and bloom only on what is brighter than sunlit ground. */
const GRADE = { saturation: 1.1, vignette: 0.5 }, BLOOM = { strength: 0.35, radius: 0.5, threshold: 2.4 };
/** MOTHER.md, the Colour: the grade's last pass. uC how strongly it shows (depth and her attention), uEx how far into her out-breath (0 the in-breath's tolerable magenta, 1 fractured), uT time. In: a magenta whose red and blue will not hold still. Out: red and blue torn apart into separate images. And here and there, at random, about a tree (uSpot: its place on screen, radius, strength; uSpotHue orange or green), the split goes far past the rest and the clashing colour floods it. Tuning: COLOUR. */
const COLOUR = { split: [0.0005, 0.02], magenta: [0.42, 0.26], spotSplit: 0.045, spotTint: 0.55, anaglyph: 70 };
const COLOUR_GRADE = `uniform sampler2D tDiffuse; uniform float uSat; uniform float uVig; uniform float uC; uniform float uEx; uniform float uT; uniform vec4 uSpot; uniform float uSpotHue; uniform float uAspect; varying vec2 vUv;
void main(){
  vec2 d = vUv - 0.5;
  vec4 c = texture2D(tDiffuse, vUv);
  if (uC > 0.001 || uSpot.w > 0.001) {
    vec2 sd = (vUv - uSpot.xy) * vec2(uAspect, 1.0); float spot = uSpot.w * (1.0 - smoothstep(uSpot.z * 0.25, uSpot.z, length(sd)));
    float split = uC * (${COLOUR.split[0]} + ${COLOUR.split[1]} * uEx * uEx) * (0.35 + length(d) * 1.8) + spot * ${COLOUR.spotSplit};
    vec2 dir = vec2(cos(uT * 0.9 + sin(uT * 2.7) * uEx), sin(uT * 1.37));
    // Noah: a red/green split reads familiar (over the grass, shifting red and blue left the green where it was); red/blue reads alien. So the torn images carry brightness, not channels: the one to one side shows red, the other blue, and the green drops where it tears, whatever lies under.
    vec3 ca = texture2D(tDiffuse, vUv + dir * split).rgb, cb = texture2D(tDiffuse, vUv - dir * split * 1.3).rgb;
    float w = clamp(split * ${COLOUR.anaglyph.toFixed(1)}, 0.0, 0.92), la = dot(ca, vec3(0.299, 0.587, 0.114)), lb = dot(cb, vec3(0.299, 0.587, 0.114));
    c.r = mix(ca.r, la * 1.15, w); c.b = mix(cb.b, lb * 1.25, w); c.g = mix(c.g, min(c.g, (la + lb) * 0.25), w);
    float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mag = vec3(0.95 + 0.3 * sin(uT * 2.3), 0.12 + 0.06 * sin(uT * 3.1), 0.9 + 0.3 * sin(uT * 1.7 + 2.0)) * (l * 1.05 + 0.01);
    c.rgb = mix(c.rgb, mag + c.rgb * 0.35, uC * (${COLOUR.magenta[0]} - ${COLOUR.magenta[1]} * uEx));
    vec3 clash = uSpotHue > 0.66 ? vec3(1.0, 0.86, 0.06) : uSpotHue > 0.33 ? vec3(1.0, 0.42, 0.04) : vec3(0.3, 1.0, 0.16);
    c.rgb = mix(c.rgb, clash * (0.35 + l * 1.8), spot * ${COLOUR.spotTint});
  }
  float l2 = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = mix(vec3(l2), c.rgb, uSat); c.rgb *= 1.0 - dot(d, d) * uVig; gl_FragColor = c;
}`;
/** Tuning: the side of the square drawn from above at each village to clear its grass (m), and its texels. */
const CLEAR_SIDE = 220, CLEAR_T = 512;
/** Tuning: grass height (m): lower than the vista's, so a hobbit (about half a metre) stands above it. */
const BLADE_H = 0.22;
/** Tuning: the village's woods are dense: full trees within this share of the tier's radius, none drawn past TREE_REACH m (the haze has them). */
const NEAR_TREES = 0.35, TREE_REACH = 850;
export function createVillageLook(inp: LookInputs): VillageLook {
  const { renderer, scene, camera, sun, hemi, vl, seed } = inp;
  const coarse = matchMedia('(pointer: coarse)').matches, qName = new URLSearchParams(location.search).get('q')?.toLowerCase();
  let quality = inp.quality ?? QUALITIES.find(q => q.name.toLowerCase() === qName) ?? QUALITIES[coarse ? 1 : 2];
  const kinds = treeCache(), tint = groundCache(), landStamp = () => inp.landStamp?.() ?? ''; let lastTrees: VTree[] = [];
  let decalsHidden = false;
  const trees = (full = false) => (lastTrees = villageTrees(vl.land, vl.edge, vl.terrain, inp.treesOf, inp.villages().map(v => ({ x: v.x, z: v.z })), inp.dark, inp.blighted, inp.taint, seed, kinds, landStamp(), full));
  const world = buildVista(scene, vl.land, trees(), villageRocks(vl, seed), quality, { hazeBase: 0, hazeBelow: HAZE_BELOW, ground: groundTint(vl.land, seed, inp.blighted, inp.taint, tint, landStamp()), fine: vl.terrain.height, fineLod: true, renderer, waterDisc: { x: KARST_AT.x, z: KARST_AT.z, r: PLATEAU_R + 40 }, cloudSea: { x: KARST_AT.x, z: KARST_AT.z, y: CLOUD_Y, inner: PLATEAU_R + MOUNTAIN_RISE + 120, outer: FAR_REACH, cover: CLOUD_COVER }, farReach: FAR_REACH, lowY: LOW_Y, bladeH: BLADE_H, nearTreesScale: NEAR_TREES, treeReach: TREE_REACH });
  world.setCanopy(canopyMap(vl.land, seed)); world.setFloor(floorMap(vl.land, seed)); tint.bytes = world.groundBytes;
  // FOREST: the understory, kept from the places (as the rocks are) and the trunks.
  const lairAt = places(seed).find(p => p.id === 'lair')!, keep = [...places(seed), ...dens(seed), ...ruins(seed), ...warrens(seed), ...wallows(seed), ...ownWarrens(seed), moot(seed), ...convergences(seed)];
  const understory = createUnderstory(world.root, world.uniforms, {
    forest: (x, z) => forestAt(x, z, seed),
    wooded: (x, z) => beyond(x, z, seed) > 0.6 && noise(x, z, 110, seed + 3) <= 0.58 && Math.hypot(x - lairAt.x, z - lairAt.z) > Math.max(DARK_RADIUS, TAINT.edge) && Math.hypot(x - KARST_AT.x, z - KARST_AT.z) > KARST_FOREST + 30,
    onLand: (x, z) => onLand(seed, x, z, 1.5),
    trunks: (x0, z0, x1, z1) => { const out: { x: number; z: number; r: number }[] = []; for (let cz = Math.floor(z0 / CHUNK); cz <= Math.floor(z1 / CHUNK); cz++) for (let cx = Math.floor(x0 / CHUNK); cx <= Math.floor(x1 / CHUNK); cx++) for (const t of inp.treesOf(cx, cz)) if (t.x > x0 && t.x < x1 && t.z > z0 && t.z < z1) out.push({ x: t.x, z: t.z, r: 0.32 * t.size }); return out; },
    clear: (x, z) => !keep.some(p => Math.hypot(x - p.x, z - p.z) < 10 + ((p as { radius?: number }).radius ?? 0)) && !(inp.clearings ?? []).some(c => Math.max(Math.abs(x - c.x), Math.abs(z - c.z)) < c.r),
    river: (x, z) => riverEdge(seed, x, z, RIPARIAN + 14),
  }, vl.terrain.height, seed, quality.name);
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.05; sun.shadow.camera.near = 1; sun.shadow.camera.far = 900; sun.shadow.camera.layers.enable(CASTER_LAYER); scene.add(sun.target);

  // ── post ──
  const target = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), BLOOM.strength, BLOOM.radius, BLOOM.threshold); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uSat: { value: GRADE.saturation }, uVig: { value: GRADE.vignette }, uC: { value: 0 }, uEx: { value: 0 }, uT: { value: 0 }, uSpot: { value: new THREE.Vector4() }, uSpotHue: { value: 0 }, uAspect: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: COLOUR_GRADE,
  }); composer.addPass(grade);
  // ?hud=1: what it costs, top centre (frame rate, triangles and draw calls over every pass).
  const hud = new URLSearchParams(location.search).get('hud') === '1' ? document.body.appendChild(Object.assign(document.createElement('div'), { id: 'look-hud' })) : null;
  if (hud) { hud.style.cssText = 'position:fixed;z-index:40;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);left:50%;transform:translateX(-50%);padding:4px 8px;border-radius:6px;background:#0b1918aa;color:#eef6f0;font:11px/1.3 ui-monospace,Menlo,monospace;white-space:pre;pointer-events:none'; renderer.info.autoReset = false; }
  let hudFrames = 0, hudMs = 0, hudLast = performance.now(), hudClock = 0;
  const resize = () => { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(innerWidth, innerHeight); };
  addEventListener('resize', resize); resize();

  // ── the clearing masks ──
  const clearRTs: THREE.WebGLRenderTarget[] = [], red = new THREE.MeshBasicMaterial({ color: '#ff0000', side: THREE.DoubleSide }), green = new THREE.MeshBasicMaterial({ color: '#00ff00', side: THREE.DoubleSide });
  function refreshClearing(): void {
    const vs = inp.villages().slice(0, 3), saved = scene.children.map(o => o.visible), bg = scene.background, fog = scene.fog, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha(), ac = renderer.autoClear;
    const cam = new THREE.OrthographicCamera(-CLEAR_SIDE / 2, CLEAR_SIDE / 2, CLEAR_SIDE / 2, -CLEAR_SIDE / 2, 1, 600); cam.up.set(0, 0, -1);
    scene.background = null; scene.fog = null; renderer.setClearColor('#000000', 1); renderer.autoClear = false;
    vs.forEach((v, i) => {
      const rt = clearRTs[i] ??= new THREE.WebGLRenderTarget(CLEAR_T, CLEAR_T);
      scene.children.forEach(o => { o.visible = o === v.root; });
      cam.position.set(v.x, 300, v.z); cam.lookAt(v.x, 0, v.z); cam.updateMatrixWorld();
      // R: everything the village has built; then G over it: only its worn paths and green, which the land paints as a trail.
      const worn: THREE.Object3D[] = [], others: THREE.Object3D[] = [];
      v.root.traverse(o => { if (!(o as THREE.Mesh).isMesh) return; if (o.name.startsWith('worn-')) { worn.push(o); o.visible = true; } else if (o.visible) others.push(o); });
      renderer.setRenderTarget(rt); renderer.clear();
      scene.overrideMaterial = red; renderer.render(scene, cam);
      for (const o of others) o.visible = false;
      scene.overrideMaterial = green; renderer.render(scene, cam);
      for (const o of others) o.visible = true;
      for (const o of worn) o.visible = false;
      world.setClear(i, rt.texture, v.x - CLEAR_SIDE / 2, v.z - CLEAR_SIDE / 2, CLEAR_SIDE);
    });
    renderer.setRenderTarget(null); renderer.autoClear = ac; scene.overrideMaterial = null; scene.children.forEach((o, i) => { o.visible = saved[i]; }); scene.background = bg; scene.fog = fog; renderer.setClearColor(cc, ca);
  }

  // ── each frame ──
  const UNDER = new THREE.Color(UNDER_COLOUR), GREY_FOG = new THREE.Color('#77746f'), GLOOM = new THREE.Color('#1a1020'), GLOOM_IN = new THREE.Color('#4a0c40'), gloomColour = new THREE.Color('#1a1020'), fogColour = new THREE.Color(), dir = new THREE.Vector3();
  let lastClock = -1;
  function setQuality(q: Quality): void {
    quality = q; world.setQuality(q); understory?.setQuality(q.name);
    const shadows = q.shadow > 0;
    if (renderer.shadowMap.enabled !== shadows) { renderer.shadowMap.enabled = shadows; scene.traverse(o => { const m = (o as THREE.Mesh).material; if (m) (Array.isArray(m) ? m : [m]).forEach(x => (x.needsUpdate = true)); }); }
    sun.castShadow = shadows;
    if (shadows) { sun.shadow.mapSize.set(q.shadow, q.shadow); sun.shadow.map?.dispose(); sun.shadow.map = null; const c = sun.shadow.camera; c.left = c.bottom = -q.shadowBox; c.right = c.top = q.shadowBox; c.updateProjectionMatrix(); }
    bloom.enabled = q.bloom;
  }
  setQuality(quality);
  return {
    world, understory, get quality() { return quality; }, setQuality, refreshClearing,
    refreshTrees(full = false) { world.setTrees(trees(full)); return kinds.chunks; },
    refreshGround(full = false) { const bytes = groundTint(vl.land, seed, inp.blighted, inp.taint, tint, landStamp(), full); if (tint.tiles > 0) world.setGround(bytes); return tint.tiles; },
    trees: () => lastTrees,
    frame(f) {
      // Inside (the deep, a den, the karst's cavern) the land is not drawn: the village's own dark fog holds.
      const show = !f.interior && !f.hidden; world.root.visible = show;
      const col = show ? f.colour ?? 0 : 0, ex = f.exhale ?? 0, clear = f.clear ?? 0; grade.uniforms.uC.value = col; grade.uniforms.uEx.value = ex; grade.uniforms.uT.value = performance.now() / 1000; grade.uniforms.uAspect.value = innerWidth / innerHeight;
      if (f.spot && show) grade.uniforms.uSpot.value.set(...f.spot); else grade.uniforms.uSpot.value.set(0, 0, 0, 0); grade.uniforms.uSpotHue.value = f.spotHue ?? 0;
      if (!show) return;
      // The gloom: a grey fog through the outer biome, deepening to the purple-black of her wood; it breathes with her, a tolerable magenta drawn in on the in-breath, deeper in.
      gloomColour.set(GREY_FOG).lerp(GLOOM, smooth(0.45, 0.9, f.gloom)).lerp(GLOOM_IN, col * (1 - ex) * 0.8 * smooth(0.3, 0.8, f.gloom));
      const h = hourAtClock(f.clockHour);
      // A moving sun rebakes the mountains' shadows over the next frames; a jump (a skipped hour) at once.
      world.setHour(h, lastClock < 0 || Math.abs(f.clockHour - lastClock) > 0.5); lastClock = f.clockHour;
      renderer.toneMappingExposure = h.exposure;
      world.setSoil(f.under, f.feet.x, f.feet.z);
      // T8: the stratum. Under the soil the rock is drawn, the sky and the far things are not, and the fog closes to UNDER_FOG_M in the soil's dark (the village's own things, the roots among them, by the scene's fog; the look's by its haze).
      const st = Math.max(0, Math.min(1, f.stratum ?? 0)); world.setUnder(st);
      // Under the earth the villages' worn decals (the green, the paths) would show through it as bright strips: hidden past half, shown again on the rise.
      if ((st > 0.5) !== decalsHidden) { decalsHidden = st > 0.5; for (const v of inp.villages()) v.root.traverse(o => { if (o.name === 'worn-green' || o.name === 'worn-path') o.visible = !decalsHidden; }); }
      // Under it the vista's sun and sky-light go too (the trees and the understory about her stand in the dark; the earth and the rock have their own glow about her).
      if (st > 0) { const u = world.uniforms; (u.uSunCol.value as THREE.Color).multiplyScalar(1 - 0.9 * st); (u.uAmbSky.value as THREE.Color).multiplyScalar(1 - 0.75 * st); (u.uAmbGround.value as THREE.Color).multiplyScalar(1 - 0.75 * st); }
      world.setGloom(gloomColour, Math.min(1, (0.25 + f.gloom * 0.9) * Math.min(1, f.gloom * 8)) * (1 - 0.8 * clear), (0.012 + f.gloom * 0.03) * (1 - 0.85 * clear));
      world.update(camera, performance.now() / 1000); understory.update(camera);
      // The village's figures and houses: the same sun (dimmed in a mountain's baked shadow), shadows near her, fog of the hour's horizon.
      dir.copy(sunDirection(h)); const lit = world.sunAt(f.feet.x, f.feet.z);
      sun.color.set(h.sun); sun.intensity = h.sunI * 0.9 * (0.25 + 0.75 * lit) * (1 - f.gloom * 0.6) * (1 - 0.85 * st); sun.target.position.copy(f.feet); sun.position.copy(f.feet).addScaledVector(dir, 400);
      hemi.color.set(h.ambSky); hemi.groundColor.set(h.ambGround); hemi.intensity = h.ambI * 2.2 * (1 - f.gloom * 0.5) * (1 - 0.5 * st);
      fogColour.set(h.horizon).lerp(gloomColour, Math.min(1, f.gloom > 0 ? 0.3 + f.gloom * 0.6 + f.gloom * f.gloom * 0.1 : 0) * (1 - 0.6 * clear)).lerp(UNDER, st); scene.background = fogColour.clone();
      // Three's exponential fog is squared in the distance: 5% is left at √3 / density.
      scene.fog = new THREE.FogExp2(fogColour.getHex(), THREE.MathUtils.lerp(h.haze * 1.3 + (f.gloom > 0 ? 0.008 + f.gloom * 0.03 : 0) * (1 - 0.92 * clear), Math.sqrt(3) / UNDER_FOG_M, st));
      if (camera.far !== FAR_REACH * 1.3) { camera.far = FAR_REACH * 1.3; camera.updateProjectionMatrix(); }
    },
    stratum: () => ({ ...world.stratum(), fogReach: Math.sqrt(3) / (scene.fog as THREE.FogExp2).density }),
    render() {
      composer.render();
      if (hud) {
        const now = performance.now(), dt = now - hudLast; hudLast = now; hudFrames++; hudMs += dt; hudClock += dt;
        if (hudClock > 500) { const i = renderer.info.render, ms = hudMs / hudFrames; hud.textContent = `${(1000 / ms).toFixed(0)} fps ${ms.toFixed(1)} ms · ${quality.name}\n${(i.triangles / 1000).toFixed(0)}k tris · ${i.calls} calls`; hudFrames = 0; hudMs = 0; hudClock = 0; }
        renderer.info.reset();
      }
    },
  };
}
