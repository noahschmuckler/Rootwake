// The vista's land as numbers, no Three.js (node-testable): a 2 km valley between ridged
// mountains, carved by droplet erosion, with the maps the renderer reads off it (sun visibility
// baked for the hour, cavity AO, where water ran, where sediment came to rest), and where its
// trees, rocks and postcard viewpoints stand. Units are metres; the map spans [-HALF, HALF].

/** Map side in metres, samples per side, metres per sample. Tuning: SIZE/N set the near facet size (CELL). */
export const SIZE = 2048, N = 513, CELL = SIZE / (N - 1), HALF = SIZE / 2;
/** The lake's surface and the snow line. Tuning. */
export const WATER_Y = 40, SNOW_Y = 300;
/** Erosion leaves the outer band alone, so the map's edge equals `baseHeight` and the far ring meets it. */
export const EROSION_EDGE = 200;

// ── noise ────────────────────────────────────────────────────────────────
export function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export interface Noise { (x: number, z: number): number }
/** 2D gradient noise in about [-1, 1]. */
export function gradientNoise(seed: number): Noise {
  const r = rng(seed), perm = new Uint8Array(512), p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const gx = new Float32Array(256), gz = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const a = r() * Math.PI * 2; gx[i] = Math.cos(a); gz[i] = Math.sin(a); }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, z) => {
    const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi, X = xi & 255, Z = zi & 255;
    const g = (ix: number, iz: number, dx: number, dz: number) => { const h = perm[ix + perm[iz]]; return gx[h] * dx + gz[h] * dz; };
    const a = g(X, Z, xf, zf), b = g(X + 1, Z, xf - 1, zf), c = g(X, Z + 1, xf, zf - 1), d = g(X + 1, Z + 1, xf - 1, zf - 1);
    const u = fade(xf), v = fade(zf);
    return 1.41 * ((a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v);
  };
}
export function fbm(n: Noise, x: number, z: number, octaves: number, lacunarity = 2, gain = 0.5): number {
  let sum = 0, amp = 1, f = 1, norm = 0;
  for (let i = 0; i < octaves; i++) { sum += n(x * f + i * 17.3, z * f - i * 9.1) * amp; norm += amp; amp *= gain; f *= lacunarity; }
  return sum / norm;
}
/** Ridged fbm in [0, 1]: sharp crests where the noise crosses zero, each octave weighted by the last. */
export function ridged(n: Noise, x: number, z: number, octaves: number): number {
  let sum = 0, amp = 0.5, f = 1, w = 1, norm = 0;
  for (let i = 0; i < octaves; i++) { let r = 1 - Math.abs(n(x * f + i * 31.7, z * f + i * 11.3)); r *= r; r *= w; w = Math.min(1, r * 1.6); sum += r * amp; norm += amp; amp *= 0.5; f *= 2.05; }
  return sum / norm;
}
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ── the land's shape ────────────────────────────────────────────────────
/** The valley runs north–south, winding; the lake lies in its floor south of the centre. Tuning. */
export const LAKE = { x: 0, z: 260, rx: 230, rz: 380 };
export function valleyAxis(z: number): number { return 170 * Math.sin(z * 0.0019 + 0.6) + 60 * Math.sin(z * 0.0051); }
export interface Shape { base(x: number, z: number): number; seed: number }
/** The unaroded land, defined everywhere (the far ring samples it past the map). */
export function shape(seed: number): Shape {
  const n1 = gradientNoise(seed * 7 + 1), n2 = gradientNoise(seed * 7 + 2), n3 = gradientNoise(seed * 7 + 3);
  const base = (x: number, z: number): number => {
    const wx = x + 140 * fbm(n2, x * 0.0011, z * 0.0011, 3), wz = z + 140 * fbm(n2, x * 0.0011 + 40, z * 0.0011 - 30, 3);
    const d = Math.abs(wx - valleyAxis(wz));
    const mountain = smooth(110, 760, d + 90 * fbm(n3, x * 0.002, z * 0.002, 2));
    const ridge = ridged(n1, wx * 0.0016, wz * 0.0016, 6);
    const hills = fbm(n3, x * 0.004, z * 0.004, 4) * 16 + fbm(n3, x * 0.012, z * 0.012, 3) * 4;
    const lakeK = Math.exp(-(((x - valleyAxis(z) * 0.4 - LAKE.x) / LAKE.rx) ** 2 + ((z - LAKE.z) / LAKE.rz) ** 2));
    const floor = WATER_Y + 7 + Math.max(0, (Math.abs(z) - 500) * 0.02) + hills * (1 - mountain);
    return floor + mountain ** 1.25 * (80 + 520 * ridge) + mountain * hills * 3 - lakeK * 26;
  };
  return { base, seed };
}

// ── the eroded map ──────────────────────────────────────────────────────
export interface Land {
  seed: number; shape: Shape;
  /** Heights, N×N, row z then column x. */
  h: Float32Array;
  /** Water that ran through each sample (normalised 0..1, log scale) and sediment laid there (0..1). */
  flow: Float32Array; sediment: Float32Array;
  /** Cavity occlusion, 0 (deep crease) .. 1 (open). */
  ao: Float32Array;
  ms: { shape: number; erosion: number; ao: number };
}
export interface ErosionParams { droplets: number; steps: number; radius: number; inertia: number; capacity: number; minSlope: number; erode: number; deposit: number; evaporate: number; gravity: number; scale: number }
/** Tuning: droplets is the main cost (≈ linear). `scale` divides metres into erosion units (a 4 m cell rising 20 m is unit slope: below that, droplets pit the slopes instead of cutting gullies). */
export const EROSION: ErosionParams = { droplets: 70000, steps: 64, radius: 2, inertia: 0.06, capacity: 6, minSlope: 0.01, erode: 0.35, deposit: 0.25, evaporate: 0.018, gravity: 6, scale: 20 };

export function generate(seed = 1, erosion: Partial<ErosionParams> = {}): Land {
  const t0 = now(), sh = shape(seed), h = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) h[j * N + i] = sh.base(i * CELL - HALF, j * CELL - HALF);
  const t1 = now(), flow = new Float32Array(N * N), sediment = new Float32Array(N * N);
  erode(h, flow, sediment, seed, { ...EROSION, ...erosion });
  // Water runs to sample counts in the thousands down the gullies and one or two on open slopes: log scale, then a light blur.
  let max = 0; for (let k = 0; k < flow.length; k++) { flow[k] = Math.log1p(flow[k]); if (flow[k] > max) max = flow[k]; }
  for (let k = 0; k < flow.length; k++) flow[k] /= max || 1;
  blur(flow, 1); blur(sediment, 1); let smax = 0; for (const s of sediment) smax = Math.max(smax, s); for (let k = 0; k < sediment.length; k++) sediment[k] = Math.min(1, sediment[k] / (smax * 0.25 || 1));
  const t2 = now(), ao = cavity(h);
  return { seed, shape: sh, h, flow, sediment, ao, ms: { shape: t1 - t0, erosion: t2 - t1, ao: now() - t2 } };
}
function now(): number { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }

/** Droplet hydraulic erosion (after Hans Beyer / Sebastian Lague), on heights in metres / p.scale. */
function erode(h: Float32Array, flow: Float32Array, sed: Float32Array, seed: number, p: ErosionParams): void {
  const r = rng(seed * 131 + 7), s = p.scale, rad = p.radius;
  const offs: number[] = [], wts: number[] = []; let wsum = 0;
  for (let dz = -rad; dz <= rad; dz++) for (let dx = -rad; dx <= rad; dx++) { const d = Math.hypot(dx, dz); if (d <= rad) { offs.push(dx, dz); const w = 1 - d / rad; wts.push(w); wsum += w; } }
  for (let k = 0; k < wts.length; k++) wts[k] /= wsum;
  const edge = EROSION_EDGE / CELL, mask = (i: number, j: number) => smooth(0, edge, Math.min(i, j, N - 1 - i, N - 1 - j) - rad);
  const hs = (k: number) => h[k] / s;
  for (let d = 0; d < p.droplets; d++) {
    let x = r() * (N - 3) + 1, z = r() * (N - 3) + 1, dx = 0, dz = 0, speed = 1, water = 1, load = 0;
    for (let step = 0; step < p.steps; step++) {
      const i = Math.floor(x), j = Math.floor(z), u = x - i, v = z - j, k = j * N + i;
      const a = hs(k), b = hs(k + 1), c = hs(k + N), e = hs(k + N + 1);
      const gx = (b - a) * (1 - v) + (e - c) * v, gz = (c - a) * (1 - u) + (e - b) * u, here = a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + e * u * v;
      dx = dx * p.inertia - gx * (1 - p.inertia); dz = dz * p.inertia - gz * (1 - p.inertia);
      const len = Math.hypot(dx, dz); if (len < 1e-9) break; dx /= len; dz /= len;
      x += dx; z += dz;
      if (x < 1 || z < 1 || x >= N - 2 || z >= N - 2) break;
      const i2 = Math.floor(x), j2 = Math.floor(z), u2 = x - i2, v2 = z - j2, k2 = j2 * N + i2;
      const there = hs(k2) * (1 - u2) * (1 - v2) + hs(k2 + 1) * u2 * (1 - v2) + hs(k2 + N) * (1 - u2) * v2 + hs(k2 + N + 1) * u2 * v2;
      const dh = there - here, m = mask(i, j);
      flow[k] += water;
      const cap = Math.max(-dh, p.minSlope) * speed * water * p.capacity;
      if (load > cap || dh > 0) {
        // Uphill: fill the pit it came from (no more than the rise); else drop a share of the excess.
        const put = dh > 0 ? Math.min(dh, load) : (load - cap) * p.deposit; load -= put;
        const pm = put * s * m;
        h[k] += pm * (1 - u) * (1 - v); h[k + 1] += pm * u * (1 - v); h[k + N] += pm * (1 - u) * v; h[k + N + 1] += pm * u * v;
        sed[k] += put * m;
      } else {
        const take = Math.min((cap - load) * p.erode, -dh);
        for (let w = 0; w < wts.length; w++) {
          const ii = i + offs[w * 2], jj = j + offs[w * 2 + 1]; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue;
          const kk = jj * N + ii, dig = Math.min(take * wts[w], h[kk] / s) * m;
          h[kk] -= dig * s;
        }
        load += take * m;
      }
      speed = Math.sqrt(Math.max(0, speed * speed - dh * p.gravity)); water *= 1 - p.evaporate;
    }
  }
}
function blur(a: Float32Array, passes: number): void {
  const t = new Float32Array(a.length);
  for (let p = 0; p < passes; p++) {
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const k = j * N + i; t[k] = (a[k] * 2 + a[j * N + Math.max(0, i - 1)] + a[j * N + Math.min(N - 1, i + 1)]) / 4; }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const k = j * N + i; a[k] = (t[k] * 2 + t[Math.max(0, j - 1) * N + i] + t[Math.min(N - 1, j + 1) * N + i]) / 4; }
  }
}
/** Cavity AO: how far a sample sits below the mean of rings of its neighbours (8 m, 24 m, 64 m). */
function cavity(h: Float32Array): Float32Array {
  const ao = new Float32Array(N * N), rings = [2, 6, 16], dirs = 8;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; let occ = 0;
    for (const r of rings) {
      let s = 0;
      for (let d = 0; d < dirs; d++) { const a = d / dirs * Math.PI * 2, ii = Math.min(N - 1, Math.max(0, Math.round(i + Math.cos(a) * r))), jj = Math.min(N - 1, Math.max(0, Math.round(j + Math.sin(a) * r))); s += Math.max(0, h[jj * N + ii] - h[k]) / (r * CELL); }
      occ += s / dirs;
    }
    ao[k] = Math.max(0, 1 - occ * 0.9);
  }
  return ao;
}

// ── sampling ────────────────────────────────────────────────────────────
/** Height anywhere: bilinear on the map (what the near mesh draws), the unaroded shape past it. */
export function heightAt(land: Land, x: number, z: number): number {
  const fx = (x + HALF) / CELL, fz = (z + HALF) / CELL;
  if (fx < 0 || fz < 0 || fx >= N - 1 || fz >= N - 1) return land.shape.base(x, z);
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, k = j * N + i, h = land.h;
  return h[k] * (1 - u) * (1 - v) + h[k + 1] * u * (1 - v) + h[k + N] * (1 - u) * v + h[k + N + 1] * u * v;
}
export function sampleAt(_land: Land, a: Float32Array, x: number, z: number): number {
  const i = Math.min(N - 1, Math.max(0, Math.round((x + HALF) / CELL))), j = Math.min(N - 1, Math.max(0, Math.round((z + HALF) / CELL)));
  return a[j * N + i];
}
/** Unit normal (x, y, z) by central differences over `d` metres. */
export function normalAt(land: Land, x: number, z: number, d = CELL): [number, number, number] {
  const hx = heightAt(land, x + d, z) - heightAt(land, x - d, z), hz = heightAt(land, x, z + d) - heightAt(land, x, z - d);
  const nx = -hx, ny = 2 * d, nz = -hz, l = Math.hypot(nx, ny, nz); return [nx / l, ny / l, nz / l];
}
/** 1 − normal.y: 0 flat, ~0.3 at 45°. */
export function slopeAt(land: Land, x: number, z: number): number { return 1 - normalAt(land, x, z)[1]; }

// ── the hour ────────────────────────────────────────────────────────────
/** Sun visibility per sample for a sun direction (unit, y up): a soft-shadow march along the heightfield. 0..255. */
export function bakeSun(land: Land, sun: [number, number, number], out = new Uint8Array(N * N)): Uint8Array {
  const [sx, sy, sz] = sun, horiz = Math.hypot(sx, sz) || 1e-6, rise = sy / horiz, ux = sx / horiz, uz = sz / horiz, h = land.h;
  if (sy <= 0) { out.fill(0); return out; }
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const h0 = h[j * N + i] + 0.5; let vis = 1, t = CELL * 0.75;
    for (let s = 0; s < 120 && vis > 0; s++) {
      const x = i + ux * t / CELL, z = j + uz * t / CELL;
      if (x < 0 || z < 0 || x >= N - 1 || z >= N - 1) break;
      const ii = x | 0, jj = z | 0, u = x - ii, v = z - jj, k = jj * N + ii;
      const ht = h[k] * (1 - u) * (1 - v) + h[k + 1] * u * (1 - v) + h[k + N] * (1 - u) * v + h[k + N + 1] * u * v;
      const ray = h0 + t * rise;
      // Penumbra widening with distance: within 1.5 m + 2% of t above the ground is half shade.
      vis = Math.min(vis, (ray - ht) / (1.5 + t * 0.02) * 0.5 + 0.5);
      if (ray > 700) break;
      t += Math.max(CELL * 0.75, t * 0.06);
    }
    out[j * N + i] = Math.round(Math.min(1, Math.max(0, vis)) * 255);
  }
  return out;
}

// ── what stands on it ───────────────────────────────────────────────────
export type TreeKind = 0 | 1 | 2 | 3 | 4; // 0–2 broadleaf, 3–4 conifer
export interface Tree { x: number; z: number; y: number; kind: TreeKind; scale: number; rot: number }
export interface Rock { x: number; z: number; y: number; scale: number; rot: number; tilt: number }
export const TREE_SPACING = 7;
/** Groves where the forest noise is high and the ground suits a tree: not steep, not wet, not snowy; conifers above CONIFER_Y. Tuning. */
export const CONIFER_Y = 150;
export function placeTrees(land: Land, max = 9000): Tree[] {
  const r = rng(land.seed * 977 + 3), forest = gradientNoise(land.seed * 13 + 5), out: Tree[] = [];
  for (let z = -HALF + 20; z < HALF - 20; z += TREE_SPACING) for (let x = -HALF + 20; x < HALF - 20; x += TREE_SPACING) {
    const px = x + (r() - 0.5) * TREE_SPACING * 0.9, pz = z + (r() - 0.5) * TREE_SPACING * 0.9, y = heightAt(land, px, pz);
    if (y < WATER_Y + 2.5 || y > SNOW_Y - 30) continue;
    const slope = slopeAt(land, px, pz); if (slope > 0.22) continue;
    const f = fbm(forest, px * 0.0045, pz * 0.0045, 4) + 0.2 * sampleAt(land, land.flow, px, pz) - (y > CONIFER_Y ? 0 : 0.06);
    const p = smooth(0.02, 0.32, f) * (1 - smooth(0.12, 0.22, slope));
    if (r() > p * 0.95 + (r() < 0.004 ? 1 : 0)) continue;
    const conifer = y > CONIFER_Y + (r() - 0.5) * 60 || (f > 0.3 && r() < 0.25);
    out.push({ x: px, z: pz, y, kind: (conifer ? 3 + Math.floor(r() * 2) : Math.floor(r() * 3)) as TreeKind, scale: 0.75 + r() * 0.55, rot: r() * Math.PI * 2 });
    if (out.length >= max) return out;
  }
  return out;
}
export function placeRocks(land: Land, max = 900): Rock[] {
  const r = rng(land.seed * 389 + 11), out: Rock[] = [];
  for (let k = 0; k < max * 30 && out.length < max; k++) {
    const x = (r() - 0.5) * (SIZE - 60), z = (r() - 0.5) * (SIZE - 60), y = heightAt(land, x, z), slope = slopeAt(land, x, z);
    if (y < WATER_Y - 1.5) continue;
    const sed = sampleAt(land, land.sediment, x, z), p = 0.02 + 0.5 * smooth(0.1, 0.35, slope) * (1 - smooth(0.5, 0.7, slope)) + 0.4 * sed;
    if (r() > p) continue;
    out.push({ x, z, y, scale: 0.4 + r() ** 3 * 4.5, rot: r() * Math.PI * 2, tilt: (r() - 0.5) * 0.5 });
  }
  return out;
}

// ── postcards ───────────────────────────────────────────────────────────
export interface Postcard { name: string; x: number; z: number; yaw: number; pitch: number }
/** Whether a straight line from a to b clears the ground (ends excepted). */
export function lineOfSight(land: Land, ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
  const d = Math.hypot(bx - ax, bz - az), steps = Math.ceil(d / (CELL * 2));
  for (let s = 2; s < steps - 2; s++) { const t = s / steps; if (heightAt(land, ax + (bx - ax) * t, az + (bz - az) * t) > ay + (by - ay) * t) return false; }
  return true;
}
/** The yaw (the player's: 0 looks toward −z) from a to b. */
export const yawToward = (ax: number, az: number, bx: number, bz: number): number => Math.atan2(-(bx - ax), -(bz - az));
/** Viewpoints chosen from the land itself: a lakeshore, a valley meadow, a ridge over the lake, and the highest walkable summit. */
export function postcards(land: Land): Postcard[] {
  const lake = { x: LAKE.x + valleyAxis(LAKE.z) * 0.4, z: LAKE.z }, cards: Postcard[] = [];
  let peak = { x: 0, z: 0, y: -Infinity };
  for (let z = -HALF + 120; z < HALF - 120; z += 16) for (let x = -HALF + 120; x < HALF - 120; x += 16) { const y = heightAt(land, x, z); if (y > peak.y) peak = { x, z, y }; }
  const best = (score: (x: number, z: number, y: number) => number): { x: number; z: number } => {
    let b = { x: 0, z: 0 }, bs = -Infinity;
    for (let z = -HALF + 140; z < HALF - 140; z += 12) for (let x = -HALF + 140; x < HALF - 140; x += 12) { const s = score(x, z, heightAt(land, x, z)); if (s > bs) { bs = s; b = { x, z }; } }
    return b;
  };
  // Gentle over 4 m and over her own stride (the shared motor wants every foot within a step of the centre).
  const walkable = (x: number, z: number) => { if (slopeAt(land, x, z) > 0.12) return false; const y = heightAt(land, x, z); return [[0.3, 0], [-0.3, 0], [0, 0.3], [0, -0.3]].every(([dx, dz]) => Math.abs(heightAt(land, x + dx, z + dz) - y) < 0.15); };
  // A lakeshore: dry, flat, close to the water, looking across it toward the highest peak.
  const shore = best((x, z, y) => (y < WATER_Y + 0.6 || y > WATER_Y + 3 || !walkable(x, z)) ? -Infinity : -Math.abs(Math.hypot(x - lake.x, z - lake.z) - 260) + (Math.hypot(x - peak.x, z - peak.z) > Math.hypot(lake.x - peak.x, lake.z - peak.z) ? 120 : 0));
  cards.push({ name: 'Lakeshore', ...shore, yaw: yawToward(shore.x, shore.z, lake.x, lake.z), pitch: 0.02 });
  // A meadow up the valley, looking down it toward the lake.
  const meadow = best((x, z, y) => (!walkable(x, z) || y < WATER_Y + 3 || Math.abs(x - valleyAxis(z)) > 120) ? -Infinity : -Math.abs(z - (LAKE.z - 900)) - slopeAt(land, x, z) * 400);
  cards.push({ name: 'Valley meadow', ...meadow, yaw: yawToward(meadow.x, meadow.z, lake.x, lake.z), pitch: 0.04 });
  // A shoulder 140–260 m up with the lake in plain sight.
  const ridge = best((x, z, y) => { if (y < WATER_Y + 140 || y > WATER_Y + 280 || !walkable(x, z)) return -Infinity; const d = Math.hypot(x - lake.x, z - lake.z); if (d < 450 || d > 900) return -Infinity; return lineOfSight(land, x, y + 2, z, lake.x, WATER_Y, lake.z) ? 1000 - d : -Infinity; });
  cards.push({ name: 'Ridge over the lake', ...ridge, yaw: yawToward(ridge.x, ridge.z, lake.x, lake.z), pitch: -0.12 });
  // The highest walkable ground, looking across the valley.
  const summit = best((x, z, y) => (walkable(x, z) ? y : -Infinity));
  cards.push({ name: 'Summit', ...summit, yaw: yawToward(summit.x, summit.z, lake.x, lake.z), pitch: -0.1 });
  return cards;
}
