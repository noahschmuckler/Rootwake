// The overworld map's base layer (T9, PLATEAU.md; Noah, 2026-10-25: "a closer to true depiction of the land's topography, terrain,
// coloration, and also smoothly loading, with zoom out and zoom in and smooth laggless panning"). Canvas 2D, no Three.js; the
// pure parts (the tiles a view needs, the zoom's bounds, the fog's cells, the colour ramp) are node-tested (tests/overworldMap.test.ts).
//
// The land is drawn once into an atlas of tiles at BASE_PX_PER_M from the baked eroded grid (vistaTerrain.Land): a hillshade under a
// north-west sun with the cavity occlusion darkening the creases, a colour from the height, the slope, the wood's floor (chunkModel's
// floorSampler: needles, leaf mould, moss, sand), the stands of forest, the villages' meadows, the taint about the breach, the lake and
// the belt rising to rock and snow, the lowland under its cloud sea, and contour lines every CONTOUR_M. Built time-sliced (`pump`:
// requestAnimationFrame slices while the map is open, idle slices from boot), nearest the view first; a tile not yet built shows as
// the old flat wood colour. A draw blits the visible part of the atlas (a quarter-size overview when zoomed far out), strokes the lake
// and the rivers as vectors at the live scale (crisp when zoomed in), and keeps only what she has explored by the fog mask
// (overworld.revealed at CELL resolution, its edges softened), rebuilt only when the revealed cells change. village.ts draws its marks
// over it. Without a Land (village.html) the base is the old flat biome fill, as cells, drawn the same way.
import { plateau, PLATEAU_R, MOUNTAIN_RISE, CLOUD_Y } from './plateauModel';
import type { Land } from './vistaTerrain';
import { CELL, lairPlace, riverEdge } from './overworldModel';
import { islands, MEADOW_ISLAND, ISLAND_FADE, biomeAt, forestField, floorSampler, noise } from './chunkModel';
import { TAINT } from './taintModel';

/** Tuning: the atlas's resolution (px/m; the land's grid is 6.4 m a sample, so finer shows nothing more, and the atlas is ~19 MB at this),
 * a tile's side (px), the map's reach from the plateau's centre (m: the belt's crest lies PLATEAU_R + MOUNTAIN_RISE out; past the reach
 * is the fall and the cloud, nowhere she walks), the overview's division, the coarse sampling's step for the floor, forest, meadow,
 * taint, shore and belt reads (m: the features are tens of metres across), the contour interval (m; 10 m made a wall of lines on the
 * belt, 20 m reads the plateau's rise at about 75 px apart at the opening scale, and the belt's are faded where they would crowd) and
 * the bold contour's interval. */
export const BASE_PX_PER_M = 0.4, TILE_PX = 128, TILE_M = TILE_PX / BASE_PX_PER_M, MAP_REACH = PLATEAU_R + MOUNTAIN_RISE + 250, OVERVIEW_DIV = 4, COARSE_M = 16, CONTOUR_M = 20, CONTOUR_BOLD = 100;
/** Tuning: the zoom's ceiling (px/m); its floor fits WORLD_SPAN m (the plateau and its belt) into the viewport's shorter side. The overview is drawn below OVERVIEW_BELOW of the atlas's scale. */
export const MAP_MAX = 3, WORLD_SPAN = 2 * (PLATEAU_R + MOUNTAIN_RISE), OVERVIEW_BELOW = 0.5;
/** Tuning: the fog mask's pixels per explored cell (its edges soften over about a cell). */
const MASK_PX = 2;
/** Tuning: the build's slices: the coarse grid's rows and a tile's rows per step (each step about a millisecond on a phone). */
const COARSE_ROWS = 1, TILE_ROWS = 16;
/** The karst's island wood (karstFlowModel.FOREST_RADIUS, which pulls Three.js in; the floor is bare under it). */
const KARST_FOREST = 92;
/** The flat colours the map had before (chunkModel's biomes): a tile not yet built shows the wood's. */
export const FLAT = { meadow: '#5b7a48', wood: '#3e5a3a', dark: '#3a2a44' };
/** The coarse grid's byte channels. */
const CH = 10, C_NEEDLES = 0, C_LEAVES = 1, C_MOSS = 2, C_SAND = 3, C_FOREST = 4, C_MEADOW = 5, C_WOOD = 6, C_DARK = 7, C_SHORE = 8, C_RIVER = 9;
/** Tuning: the shade, the slope, the occlusion and the contours are flattened within a river's banks (m from the water's edge: full to RIVER_FLAT[0], none past RIVER_FLAT[1]; read exactly per pixel where the coarse grid says a river is near): the channel is a land cell wide and its carved banks and levee interpolated into dark dashes when magnified, and the river is drawn as a vector over it. */
const RIVER_FLAT: [number, number] = [2, 18];

const smooth = (a: number, b: number, x: number): number => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const now = (): number => (typeof performance !== 'undefined' ? performance.now() : Date.now());

// ── the pure parts ────────────────────────────────────────────────────────
export interface MapExtent { x0: number; z0: number; size: number; tiles: number }
/** The square the atlas covers: MAP_REACH each way from the plateau's centre, rounded up to whole tiles. */
export function mapExtent(seed: number): MapExtent { const C = plateau(seed).centre, tiles = Math.ceil((2 * MAP_REACH) / TILE_M); return { x0: C.x - MAP_REACH, z0: C.z - MAP_REACH, size: tiles * TILE_M, tiles }; }
/** The tiles (column i, row j) a world rectangle touches, within the extent. */
export function tilesInView(ext: MapExtent, x0: number, z0: number, x1: number, z1: number): { i: number; j: number }[] {
  const out: { i: number; j: number }[] = [];
  const i0 = Math.max(0, Math.floor((x0 - ext.x0) / TILE_M)), i1 = Math.min(ext.tiles - 1, Math.floor((x1 - ext.x0) / TILE_M)), j0 = Math.max(0, Math.floor((z0 - ext.z0) / TILE_M)), j1 = Math.min(ext.tiles - 1, Math.floor((z1 - ext.z0) / TILE_M));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) out.push({ i, j });
  return out;
}
/** The zoom's bounds for a viewport (css px): the whole plateau and belt fit its shorter side at the floor; MAP_MAX at the ceiling. */
export const zoomBounds = (w: number, h: number): { min: number; max: number } => ({ min: Math.min(MAP_MAX, Math.min(w, h) / WORLD_SPAN), max: MAP_MAX });
export const clampZoom = (s: number, b: { min: number; max: number }): number => Math.min(b.max, Math.max(b.min, s));
/** The fog's grid: one byte a cell (255 explored), over the extent's cells and a cell's border; its origin lies on a cell's corner. */
export interface FogGrid { x0: number; z0: number; cells: number; data: Uint8Array }
export function fogGrid(ext: MapExtent, revealed: Iterable<string>): FogGrid {
  const cx0 = Math.floor(ext.x0 / CELL), cz0 = Math.floor(ext.z0 / CELL), cells = Math.ceil(ext.size / CELL) + 2, data = new Uint8Array(cells * cells);
  for (const key of revealed) { const c = key.indexOf(','), cx = +key.slice(0, c) - cx0, cz = +key.slice(c + 1) - cz0; if (cx >= 0 && cz >= 0 && cx < cells && cz < cells) data[cz * cells + cx] = 255; }
  return { x0: cx0 * CELL, z0: cz0 * CELL, cells, data };
}
/** A contour line's strength at a height: 1 on a line CONTOUR_M apart, drawn about a pixel wide (the slope in m per pixel is how much height a pixel spans), fading out where the lines would crowd closer than a few pixels. */
export function contourAt(h: number, slopePerPx: number): number {
  const d = ((h % CONTOUR_M) + CONTOUR_M) % CONTOUR_M, dist = Math.min(d, CONTOUR_M - d), thr = Math.max(1e-3, 0.55 * slopePerPx), spacing = CONTOUR_M / Math.max(1e-6, slopePerPx);
  // Flat ground draws none (the island lies at exactly 0 m, a bold line's height, and a level green wobbles across one); crowded lines fade out.
  return Math.min(1, Math.max(0, (thr * 1.5 - dist) / thr)) * smooth(3, 9, spacing) * smooth(0.004, 0.02, slopePerPx);
}
/** Whether the contour nearest a height is a bold one (every CONTOUR_BOLD). */
export const contourBold = (h: number): boolean => Math.abs((Math.round(h / CONTOUR_M) * CONTOUR_M) % CONTOUR_BOLD) < 0.5;
/** One point's reads for the colour ramp. */
export interface LandSample {
  /** Height (m), the slope's tangent, the hillshade (0..1), the cavity occlusion (1 open). */
  h: number; slope: number; shade: number; ao: number;
  /** The floor's layers (0..1 each), the stand's depth, the meadow (1 on a village's green), the wood biome (1), the taint (0 outside, 0.6 at its edge to 1 at the breach), the lake's shore (1 at the water, 0 inland), how far into the belt (m past the rim). */
  needles: number; leaves: number; moss: number; sand: number; forest: number; meadow: number; wood: number; dark: number; shore: number; into: number;
  /** The contour's strength and whether it is a bold one. */
  contour: number; bold: boolean;
}
/** Tuning: the map's palette (sRGB). */
export const PALETTE = {
  water: [74, 120, 150], deep: [50, 88, 120], shore: [200, 187, 149], heath: [118, 142, 78], meadow: [146, 178, 92], wood: [94, 124, 66], stand: [56, 90, 50],
  needles: [124, 106, 62], leaves: [104, 80, 52], moss: [60, 92, 58], sand: [196, 183, 144], dark: [58, 42, 68], heart: [34, 24, 44], rock: [136, 130, 118], high: [164, 158, 148], snow: [234, 238, 242], cloud: [204, 208, 216],
};
const P = PALETTE;
/** The colour of a point of the land from its reads, into `out` (r, g, b in 0..255; no allocation, the tiles call it a pixel at a time): water under the lake's surface (by the lake alone: the lowland lies far below it); else the heath, the wood and the stands, the floor laid over them, the meadow, the taint; the shore's sand by the lake; the belt's rock by how far into it and how steep, snow above the snow line, the cloud sea over the lowland; shaded, the creases darkened, the contours drawn in. */
export function landRgb(s: LandSample, waterY: number, snowY: number, out: Float64Array | number[]): Float64Array | number[] {
  let r: number, g: number, b: number;
  if (s.h < waterY && s.shore > 0) { const t = smooth(0, 8, waterY - s.h), l = 0.9 + 0.1 * s.shade; out[0] = (P.water[0] + (P.deep[0] - P.water[0]) * t) * l; out[1] = (P.water[1] + (P.deep[1] - P.water[1]) * t) * l; out[2] = (P.water[2] + (P.deep[2] - P.water[2]) * t) * l; return out; }
  let t = s.wood * 0.85; r = P.heath[0] + (P.wood[0] - P.heath[0]) * t; g = P.heath[1] + (P.wood[1] - P.heath[1]) * t; b = P.heath[2] + (P.wood[2] - P.heath[2]) * t;
  t = s.forest * 0.85; r += (P.stand[0] - r) * t; g += (P.stand[1] - g) * t; b += (P.stand[2] - b) * t;
  const f = s.needles + s.leaves + s.moss + s.sand;
  if (f > 0.01) { const fr = (s.needles * P.needles[0] + s.leaves * P.leaves[0] + s.moss * P.moss[0] + s.sand * P.sand[0]) / f, fg = (s.needles * P.needles[1] + s.leaves * P.leaves[1] + s.moss * P.moss[1] + s.sand * P.sand[1]) / f, fb = (s.needles * P.needles[2] + s.leaves * P.leaves[2] + s.moss * P.moss[2] + s.sand * P.sand[2]) / f; t = Math.min(1, f) * 0.7; r += (fr - r) * t; g += (fg - g) * t; b += (fb - b) * t; }
  t = s.meadow; r += (P.meadow[0] - r) * t; g += (P.meadow[1] - g) * t; b += (P.meadow[2] - b) * t;
  if (s.dark > 0) { const k = Math.min(1, Math.max(0, (s.dark - 0.6) / 0.4)), dr = P.dark[0] + (P.heart[0] - P.dark[0]) * k, dg = P.dark[1] + (P.heart[1] - P.dark[1]) * k, db = P.dark[2] + (P.heart[2] - P.dark[2]) * k; t = Math.min(1, s.dark / 0.6); r += (dr - r) * t; g += (dg - g) * t; b += (db - b) * t; }
  t = (1 - smooth(0.3, 2.4, s.h - waterY)) * s.shore; r += (P.shore[0] - r) * t; g += (P.shore[1] - g) * t; b += (P.shore[2] - b) * t;
  const rock = Math.max(smooth(40, 260, s.into), smooth(0.6, 1.1, s.slope)); if (rock > 0) { const k = smooth(100, 500, s.h), rr = P.rock[0] + (P.high[0] - P.rock[0]) * k, rg = P.rock[1] + (P.high[1] - P.rock[1]) * k, rb = P.rock[2] + (P.high[2] - P.rock[2]) * k; r += (rr - r) * rock; g += (rg - g) * rock; b += (rb - b) * rock; }
  t = smooth(snowY - 40, snowY + 20, s.h); r += (P.snow[0] - r) * t; g += (P.snow[1] - g) * t; b += (P.snow[2] - b) * t;
  const cloud = smooth(CLOUD_Y + 80, CLOUD_Y - 20, s.h); r += (P.cloud[0] - r) * cloud; g += (P.cloud[1] - g) * cloud; b += (P.cloud[2] - b) * cloud;
  // The light: the hillshade over an ambient floor, the creases darkened, the plateau's rise a little lighter toward the rim; the cloud flat.
  let l = (0.52 + 0.62 * s.shade) * (0.66 + 0.34 * s.ao) * (1 + 0.1 * smooth(0, 120, s.h)); l += (1 - l) * cloud;
  if (s.contour > 0 && cloud < 0.5) l *= 1 - (s.bold ? 0.34 : 0.2) * s.contour * (1 - cloud * 2);
  out[0] = r * l; out[1] = g * l; out[2] = b * l; return out;
}

// ── the map ───────────────────────────────────────────────────────────────
export interface OverworldMapOptions { land: Land | null; seed: number; /** Called when a tile (or the flat base) is built: the open map redraws. */ onProgress?: () => void }
export interface MapStats { /** The build's cost so far (ms of slices), the last draw (set by the caller: the base and its marks), the last fog mask. */ tileMs: number; drawMs: number; fogMs: number; /** Tiles built of the whole. */ built: number; total: number }
export interface OverworldMap {
  extent: MapExtent; stats: MapStats;
  /** The fraction of the base built (0..1). */
  ready(): number;
  /** Build for up to `budgetMs`: true when a tile was finished. */
  pump(budgetMs: number): boolean;
  /** Build in idle slices from now until done (requestIdleCallback where there is one, else timers). */
  startIdle(): void;
  /** Build nearest this point first. */
  focus(x: number, z: number): void;
  /** The base under the marks: the land, the water, the fog. `s` px/m (device px), `pan` the world point at the middle, `fog` the colour where she has not been, `minStroke` the thinnest river (px). */
  drawBase(c: CanvasRenderingContext2D, w: number, h: number, s: number, pan: { x: number; z: number }, fog: string, minStroke: number, revealed: Set<string>): void;
}
export function createOverworldMap(o: OverworldMapOptions): OverworldMap {
  const { land, seed } = o, ext = mapExtent(seed), pl = plateau(seed), stats: MapStats = { tileMs: 0, drawMs: 0, fogMs: 0, built: 0, total: land ? ext.tiles * ext.tiles : 1 };
  const base = land ? BASE_PX_PER_M : 1 / CELL, atlasPx = land ? ext.tiles * TILE_PX : Math.ceil(ext.size / CELL);
  const atlas = document.createElement('canvas'); atlas.width = atlas.height = atlasPx; const actx = atlas.getContext('2d')!; actx.fillStyle = FLAT.wood; actx.fillRect(0, 0, atlasPx, atlasPx);
  const overview = land ? document.createElement('canvas') : null, octx = overview ? overview.getContext('2d')! : null; if (overview && octx) { overview.width = overview.height = atlasPx / OVERVIEW_DIV; octx.fillStyle = FLAT.wood; octx.fillRect(0, 0, overview.width, overview.height); }
  // ── the build ──
  let stage = 0, row = 0, done = false, focusAt = { x: 0, z: 0 }, order: number[] = [], next = 0;
  const n = land?.n ?? 0, cell = land?.cell ?? 1, half = land?.half ?? 0;
  const cc = Math.ceil(ext.size / COARSE_M) + 1, coarseB = land ? new Uint8Array(cc * cc * CH) : null, coarseInto = land ? new Float32Array(cc * cc) : null;
  const lair = lairPlace(seed), isl = islands(seed), floorAt = land ? floorSampler(seed, KARST_FOREST) : null, forestAt = land ? forestField(seed) : null;
  // The sun: from the north-west, 42° up (the classic relief light; the hillshade reads ridges and gullies at a glance). Tuning.
  const L = [-0.53, 0.67, -0.53], ll = Math.hypot(L[0], L[1], L[2]); L[0] /= ll; L[1] /= ll; L[2] /= ll;
  /** The height at grid coordinates, bilinear (what the vista draws; vistaTerrain.heightAt without the shape past the map, which the extent never reaches). */
  const hAt = (fx: number, fz: number): number => { const h = land!.h, i = Math.min(n - 2, Math.max(0, Math.floor(fx))), j = Math.min(n - 2, Math.max(0, Math.floor(fz))), u = Math.min(1, Math.max(0, fx - i)), v = Math.min(1, Math.max(0, fz - j)), k = j * n + i; return h[k] * (1 - u) * (1 - v) + h[k + 1] * u * (1 - v) + h[k + n] * (1 - u) * v + h[k + n + 1] * u * v; };
  const coarseRows = (j0: number, j1: number): void => {
    const B = coarseB!, I = coarseInto!; for (let j = j0; j < j1; j++) for (let i = 0; i < cc; i++) {
      const x = ext.x0 + i * COARSE_M, z = ext.z0 + j * COARSE_M, k = j * cc + i, oc = k * CH, fl = floorAt!(x, z);
      if (fl) { B[oc + C_NEEDLES] = fl[0] * 255; B[oc + C_LEAVES] = fl[1] * 255; B[oc + C_MOSS] = fl[2] * 255; B[oc + C_SAND] = fl[3] * 255; }
      B[oc + C_FOREST] = forestAt!(x, z) * 255;
      let meadow = 0; for (const q of isl) meadow = Math.max(meadow, 1 - smooth(MEADOW_ISLAND, MEADOW_ISLAND + ISLAND_FADE, Math.hypot(x - q.x, z - q.z))); B[oc + C_MEADOW] = meadow * 255;
      B[oc + C_WOOD] = noise(x, z, 110, seed + 3) > 0.58 ? 0 : 255;
      const dl = Math.hypot(x - lair.x, z - lair.z); B[oc + C_DARK] = dl < TAINT.edge ? (0.6 + 0.4 * (1 - dl / TAINT.edge)) * 255 : 0;
      const rl = Math.hypot(x - pl.centre.x, z - pl.centre.z), lr = pl.lakeR(Math.atan2(z - pl.centre.z, x - pl.centre.x)); B[oc + C_SHORE] = (1 - smooth(lr + 10, lr + 70, rl)) * 255;
      B[oc + C_RIVER] = riverEdge(seed, x, z, RIVER_FLAT[1] + 20) <= RIVER_FLAT[1] + 16 ? 255 : 0; // a river near: the exact band is read per pixel there
      I[k] = pl.into(x, z);
    }
  };
  const tileImg = land ? actx.createImageData(TILE_PX, TILE_PX) : null, S: LandSample = { h: 0, slope: 0, shade: 0, ao: 1, needles: 0, leaves: 0, moss: 0, sand: 0, forest: 0, meadow: 0, wood: 0, dark: 0, shore: 0, into: 0, contour: 0, bold: false }, rgb = new Float64Array(3);
  const tileRows = (ti: number, tj: number, r0: number, r1: number): void => {
    const d = tileImg!.data, h = land!.h, ao = land!.ao, B = coarseB!, I = coarseInto!, waterY = land!.waterY, snowY = land!.snowY, perPx = 1 / BASE_PX_PER_M, NORMAL_D = 1; // the normal by central differences NORMAL_D cells either side: a cell reads the erosion's gullies, more smooths them. Tuning.
    for (let py = r0; py < r1; py++) {
      const z = ext.z0 + (tj * TILE_PX + py + 0.5) * perPx, fz = (z + half) / cell, jz = Math.min(n - 2, Math.max(0, Math.floor(fz))), v = Math.min(1, Math.max(0, fz - jz)), gz = (z - ext.z0) / COARSE_M, cj = Math.min(cc - 2, Math.max(0, Math.floor(gz))), cv = Math.min(1, Math.max(0, gz - cj));
      for (let px = 0; px < TILE_PX; px++) {
        const x = ext.x0 + (ti * TILE_PX + px + 0.5) * perPx, fx = (x + half) / cell, ix = Math.min(n - 2, Math.max(0, Math.floor(fx))), u = Math.min(1, Math.max(0, fx - ix)), k = jz * n + ix, w00 = (1 - u) * (1 - v), w10 = u * (1 - v), w01 = (1 - u) * v, w11 = u * v;
        S.h = h[k] * w00 + h[k + 1] * w10 + h[k + n] * w01 + h[k + n + 1] * w11; S.ao = ao[k] * w00 + ao[k + 1] * w10 + ao[k + n] * w01 + ao[k + n + 1] * w11;
        const gx = (x - ext.x0) / COARSE_M, ci = Math.min(cc - 2, Math.max(0, Math.floor(gx))), cu = Math.min(1, Math.max(0, gx - ci)), q = cj * cc + ci, q00 = (1 - cu) * (1 - cv) / 255, q10 = cu * (1 - cv) / 255, q01 = (1 - cu) * cv / 255, q11 = cu * cv / 255, a = q * CH, b = a + CH, c2 = a + cc * CH, e = c2 + CH;
        S.needles = B[a + C_NEEDLES] * q00 + B[b + C_NEEDLES] * q10 + B[c2 + C_NEEDLES] * q01 + B[e + C_NEEDLES] * q11; S.leaves = B[a + C_LEAVES] * q00 + B[b + C_LEAVES] * q10 + B[c2 + C_LEAVES] * q01 + B[e + C_LEAVES] * q11; S.moss = B[a + C_MOSS] * q00 + B[b + C_MOSS] * q10 + B[c2 + C_MOSS] * q01 + B[e + C_MOSS] * q11; S.sand = B[a + C_SAND] * q00 + B[b + C_SAND] * q10 + B[c2 + C_SAND] * q01 + B[e + C_SAND] * q11;
        S.forest = B[a + C_FOREST] * q00 + B[b + C_FOREST] * q10 + B[c2 + C_FOREST] * q01 + B[e + C_FOREST] * q11; S.meadow = B[a + C_MEADOW] * q00 + B[b + C_MEADOW] * q10 + B[c2 + C_MEADOW] * q01 + B[e + C_MEADOW] * q11; S.wood = B[a + C_WOOD] * q00 + B[b + C_WOOD] * q10 + B[c2 + C_WOOD] * q01 + B[e + C_WOOD] * q11; S.dark = B[a + C_DARK] * q00 + B[b + C_DARK] * q10 + B[c2 + C_DARK] * q01 + B[e + C_DARK] * q11; S.shore = B[a + C_SHORE] * q00 + B[b + C_SHORE] * q10 + B[c2 + C_SHORE] * q01 + B[e + C_SHORE] * q11;
        S.into = (I[q] * (1 - cu) + I[q + 1] * cu) * (1 - cv) + (I[q + cc] * (1 - cu) + I[q + cc + 1] * cu) * cv;
        // The normal from the bilinear surface about the pixel (smooth under magnification, where a grid of normals showed the cells as steps): the hillshade and the slope, flattened within a river's banks.
        const hx = (hAt(fx + NORMAL_D, fz) - hAt(fx - NORMAL_D, fz)) / (2 * NORMAL_D * cell), hz = (hAt(fx, fz + NORMAL_D) - hAt(fx, fz - NORMAL_D)) / (2 * NORMAL_D * cell), inv = 1 / Math.hypot(hx, 1, hz);
        const river = B[a + C_RIVER] + B[b + C_RIVER] + B[c2 + C_RIVER] + B[e + C_RIVER] > 0 ? 1 - smooth(RIVER_FLAT[0], RIVER_FLAT[1], riverEdge(seed, x, z, RIVER_FLAT[1] + 4)) : 0, shade = Math.max(0, (-hx * L[0] + L[1] - hz * L[2]) * inv);
        S.shade = shade + (L[1] - shade) * river; S.slope = Math.hypot(hx, hz) * (1 - river); S.ao += (1 - S.ao) * river; // the baked cavity occlusion is the channel's crease too
        // The contours from the land's own slope, none in the river's band (the channel's bank crosses the 0 m line in dashes).
        S.contour = contourAt(S.h, Math.hypot(hx, hz) * perPx) * (1 - river); S.bold = S.contour > 0 && contourBold(S.h);
        landRgb(S, waterY, snowY, rgb); const oi = (py * TILE_PX + px) * 4; d[oi] = rgb[0]; d[oi + 1] = rgb[1]; d[oi + 2] = rgb[2]; d[oi + 3] = 255;
      }
    }
  };
  /** A finished tile into the atlas and, box-filtered OVERVIEW_DIV², into the overview. */
  const finishTile = (ti: number, tj: number): void => {
    actx.putImageData(tileImg!, ti * TILE_PX, tj * TILE_PX);
    const D = OVERVIEW_DIV, m = TILE_PX / D, img = octx!.createImageData(m, m), src = tileImg!.data, dst = img.data;
    for (let y = 0; y < m; y++) for (let x = 0; x < m; x++) { let r = 0, g = 0, b = 0; for (let dy = 0; dy < D; dy++) for (let dx = 0; dx < D; dx++) { const si = ((y * D + dy) * TILE_PX + x * D + dx) * 4; r += src[si]; g += src[si + 1]; b += src[si + 2]; } const di = (y * m + x) * 4; dst[di] = r / (D * D); dst[di + 1] = g / (D * D); dst[di + 2] = b / (D * D); dst[di + 3] = 255; }
    octx!.putImageData(img, ti * m, tj * m);
  };
  const sortOrder = (): void => { const tc = (k: number): [number, number] => [ext.x0 + ((k % ext.tiles) + 0.5) * TILE_M, ext.z0 + (Math.floor(k / ext.tiles) + 0.5) * TILE_M]; const rest = order.slice(next).sort((p, q) => { const a = tc(p), b = tc(q); return Math.hypot(a[0] - focusAt.x, a[1] - focusAt.z) - Math.hypot(b[0] - focusAt.x, b[1] - focusAt.z); }); order = [...order.slice(0, next), ...rest]; };
  if (land) { order = Array.from({ length: ext.tiles * ext.tiles }, (_, k) => k); sortOrder(); }
  /** The flat base (no Land): the old map's cells, each its biome's colour (a village's meadow within 46 m of its green, as before). */
  const flatBase = (): void => {
    const cells = atlasPx, img = actx.createImageData(cells, cells), d = img.data, col = (s: string): number[] => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)], cm = col(FLAT.meadow), cw = col(FLAT.wood), cd = col(FLAT.dark);
    for (let j = 0; j < cells; j++) for (let i = 0; i < cells; i++) { const mx = ext.x0 + (i + 0.5) * CELL, mz = ext.z0 + (j + 0.5) * CELL, bm = isl.some(q => Math.hypot(mx - q.x, mz - q.z) < 46) ? 'meadow' : biomeAt(mx, mz, seed), c = bm === 'meadow' ? cm : bm === 'wood' ? cw : cd, k = (j * cells + i) * 4; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255; }
    actx.putImageData(img, 0, 0);
  };
  let cur: { ti: number; tj: number; row: number } | null = null;
  /** One step of the build: a band of rows of the stage's grid or of the current tile. True when a tile was finished. */
  const step = (): boolean => {
    if (!land) { flatBase(); stats.built = 1; done = true; return true; }
    if (stage === 0) { coarseRows(row, Math.min(cc, row + COARSE_ROWS)); row += COARSE_ROWS; if (row >= cc) { stage = 1; row = 0; } return false; }
    if (!cur) { if (next >= order.length) { done = true; return false; } const k = order[next++]; cur = { ti: k % ext.tiles, tj: Math.floor(k / ext.tiles), row: 0 }; }
    tileRows(cur.ti, cur.tj, cur.row, Math.min(TILE_PX, cur.row + TILE_ROWS)); cur.row += TILE_ROWS;
    if (cur.row >= TILE_PX) { finishTile(cur.ti, cur.tj); cur = null; stats.built++; if (next >= order.length) done = true; return true; }
    return false;
  };
  const pump = (budgetMs: number): boolean => { if (done) return false; const t0 = now(); let fin = false; do { if (step()) fin = true; } while (!done && now() - t0 < budgetMs); stats.tileMs += now() - t0; if (fin) o.onProgress?.(); return fin; };
  let idling = false;
  const startIdle = (): void => {
    if (idling || done) return; idling = true;
    const ric = (globalThis as { requestIdleCallback?: (cb: (d: { timeRemaining(): number; didTimeout: boolean }) => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const again = (): void => { if (done) { idling = false; return; } if (ric) ric(d => { pump(d.didTimeout ? 2 : Math.min(5, d.timeRemaining())); again(); }, { timeout: 250 }); else setTimeout(() => { pump(4); again(); }, 30); };
    again();
  };
  // ── the fog ──
  const mask = document.createElement('canvas'), mctx = mask.getContext('2d')!, cellsCanvas = document.createElement('canvas'), cctx = cellsCanvas.getContext('2d')!; let fog: FogGrid | null = null, fogFor = -1;
  const ensureFog = (revealed: Set<string>): void => {
    if (fog && fogFor === revealed.size) return; const t0 = now();
    fog = fogGrid(ext, revealed); fogFor = revealed.size; const { cells, data } = fog;
    if (cellsCanvas.width !== cells) { cellsCanvas.width = cellsCanvas.height = cells; mask.width = mask.height = cells * MASK_PX; }
    const img = cctx.createImageData(cells, cells), d = img.data; for (let k = 0; k < data.length; k++) { d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = 255; d[k * 4 + 3] = data[k]; } cctx.putImageData(img, 0, 0);
    mctx.clearRect(0, 0, mask.width, mask.height); mctx.imageSmoothingEnabled = true; mctx.drawImage(cellsCanvas, 0, 0, mask.width, mask.height);
    stats.fogMs = now() - t0;
  };
  // ── the draw ──
  const drawBase: OverworldMap['drawBase'] = (c, w, h, s, pan, fogColour, minStroke, revealed) => {
    const sx = (x: number): number => w / 2 + (x - pan.x) * s, sz = (z: number): number => h / 2 + (z - pan.z) * s;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, w, h);
    // The land: the visible part of the atlas (the overview when far out), its corner snapped to a whole device pixel (a whole base pixel at the base scale).
    const useOv = !!overview && s < OVERVIEW_BELOW * base, img = useOv ? overview! : atlas, ppm = useOv ? base / OVERVIEW_DIV : base;
    const vx0 = Math.max(ext.x0, pan.x - w / 2 / s), vx1 = Math.min(ext.x0 + ext.size, pan.x + w / 2 / s), vz0 = Math.max(ext.z0, pan.z - h / 2 / s), vz1 = Math.min(ext.z0 + ext.size, pan.z + h / 2 / s);
    if (vx1 > vx0 && vz1 > vz0) { const px0 = (vx0 - ext.x0) * ppm, pz0 = (vz0 - ext.z0) * ppm, pw = (vx1 - vx0) * ppm, ph = (vz1 - vz0) * ppm; c.imageSmoothingEnabled = !!land; c.drawImage(img, px0, pz0, pw, ph, Math.round(sx(vx0)), Math.round(sz(vz0)), pw * s / ppm, ph * s / ppm); }
    // The water as vectors at the live scale: the lake with the island's hole, the rivers at their width, batched by stroke width (a river is one path while its width rounds to the same half pixel).
    c.fillStyle = '#4a7896'; c.beginPath(); for (let i = 0; i <= 72; i++) { const a = (i / 72) * Math.PI * 2, r = pl.lakeR(a), x = sx(pl.centre.x + Math.cos(a) * r), y = sz(pl.centre.z + Math.sin(a) * r); if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.closePath(); c.moveTo(sx(pl.centre.x) + pl.islandR * s, sz(pl.centre.z)); c.arc(sx(pl.centre.x), sz(pl.centre.z), pl.islandR * s, 0, Math.PI * 2, true); c.fill('evenodd');
    c.strokeStyle = '#4a7896'; c.lineCap = 'round'; c.lineJoin = 'round'; const m = 40;
    for (const r of pl.rivers) { let open = false, curW = -1; for (let i = 1; i < r.points.length; i++) { const a = r.points[i - 1], b = r.points[i], ax = sx(a.x), ay = sz(a.z), bx = sx(b.x), by = sz(b.z); if ((ax < -m || ax > w + m || ay < -m || ay > h + m) && (bx < -m || bx > w + m || by < -m || by > h + m)) { if (open) { c.stroke(); open = false; } continue; } const wq = Math.round(Math.max(minStroke, (r.half[i - 1] + r.half[i]) * s) * 2) / 2; if (!open || wq !== curW) { if (open) c.stroke(); c.lineWidth = curW = wq; c.beginPath(); c.moveTo(ax, ay); open = true; } c.lineTo(bx, by); } if (open) c.stroke(); }
    c.lineCap = 'butt'; c.lineJoin = 'miter';
    // The fog: keep what she has explored, the fog's colour under the rest.
    ensureFog(revealed); c.globalCompositeOperation = 'destination-in'; c.imageSmoothingEnabled = true; c.drawImage(mask, sx(fog!.x0), sz(fog!.z0), fog!.cells * CELL * s, fog!.cells * CELL * s);
    c.globalCompositeOperation = 'destination-over'; c.fillStyle = fogColour; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'source-over'; c.restore();
  };
  return { extent: ext, stats, ready: () => (done ? 1 : stats.built / stats.total), pump, startIdle, focus: (x, z) => { focusAt = { x, z }; if (land && !done) sortOrder(); }, drawBase };
}
