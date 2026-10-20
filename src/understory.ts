// FOREST (Noah, 2026-10-20): what grows under the trees, so a forest reads as a forest and not as wooded plains, and
// looks hard to see into without being hard to walk through. Saplings and young trees in the canopy's gaps, shrubs at
// her chest and over her head, thickest at a stand's edge, and ferns in its shade; a few shrubs out on the plains. None
// of it stops her (she pushes through): it is drawn, not stood on. Each 24 m tile grows the same whenever it comes near
// (its own seed), clear of the trunks, the water and the places; the vista draws the tiles about the camera, instanced, in
// its own light (vistaShaders' solid, swaying), and only near (the haze and the trees have it past that).
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from './colors';
import { solidVert, solidFrag } from './vistaShaders';

export type UnderKind = 'sapling' | 'shrub' | 'fern';
export interface UnderItem { kind: UnderKind; x: number; z: number; s: number; rot: number; v: number }
/** What a tile needs to know of the land: how deep in forest a point is, whether it is wood at all (not meadow, not her taint, not a village's green), whether it is on land, and the trunks and places to keep clear of. */
export interface UnderLand {
  forest(x: number, z: number): number;
  wooded(x: number, z: number): boolean;
  onLand(x: number, z: number): boolean;
  trunks(x0: number, z0: number, x1: number, z1: number): { x: number; z: number; r: number }[];
  clear(x: number, z: number): boolean;
}
/** The tile's side (m); each kind's density (per m²) on the plains and in a stand's heart, and at a stand's edge (shrubs, saplings: an edge is brushy). Tuning. */
export const UNDER_TILE = 24;
export const DENSITY: Record<UnderKind, { plains: number; heart: number; edge: number }> = {
  sapling: { plains: 0.002, heart: 0.04, edge: 0.05 },
  shrub: { plains: 0.008, heart: 0.13, edge: 0.2 },
  fern: { plains: 0.002, heart: 0.14, edge: 0.04 },
};
/** Each kind's size range (its scale on the drawn shape: a sapling ~1.6 m tall at 1, a shrub ~0.6 m, a fern ~0.45 m; she is 0.72 m). Tuning. */
export const SIZES: Record<UnderKind, [number, number]> = { sapling: [0.7, 1.7], shrub: [0.7, 2.7], fern: [0.7, 1.5] };

/** A tile's growth: deterministic in its coordinates and the seed. */
export function underTile(tx: number, tz: number, seed: number, land: UnderLand, scale = 1): UnderItem[] {
  const rand = mulberry32((seed * 2654435761 + tx * 73856093 + tz * 19349663 + 17) >>> 0), x0 = tx * UNDER_TILE, z0 = tz * UNDER_TILE, out: UnderItem[] = [];
  const mid = land.forest(x0 + UNDER_TILE / 2, z0 + UNDER_TILE / 2);
  if (!land.wooded(x0 + UNDER_TILE / 2, z0 + UNDER_TILE / 2) && mid <= 0) {
    // A tile at a meadow's edge may still be partly wood: sample its corners before giving up.
    let any = false; for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) if (land.wooded(x0 + a * UNDER_TILE, z0 + b * UNDER_TILE)) any = true; if (!any) return out;
  }
  const trunks = land.trunks(x0 - 3, z0 - 3, x0 + UNDER_TILE + 3, z0 + UNDER_TILE + 3), area = UNDER_TILE * UNDER_TILE;
  for (const kind of ['sapling', 'shrub', 'fern'] as UnderKind[]) {
    const d = DENSITY[kind], most = Math.max(d.plains, d.heart, d.edge), n = Math.round(area * most * scale);
    for (let i = 0; i < n; i++) {
      const x = x0 + rand() * UNDER_TILE, z = z0 + rand() * UNDER_TILE, roll = rand(), sz = rand(), rot = rand() * Math.PI * 2, v = rand();
      if (!land.wooded(x, z)) continue;
      const f = land.forest(x, z), edge = 4 * f * (1 - f), want = d.plains + (d.heart - d.plains) * f + d.edge * edge;
      if (roll * most > want) continue;
      if (!land.onLand(x, z) || !land.clear(x, z)) continue;
      // Clear of the trunks: a fern may stand at a root's foot, a shrub a little off, a sapling where the canopy opens.
      const keep = kind === 'fern' ? 0.25 : kind === 'shrub' ? 0.45 : 1.4;
      if (trunks.some(t => Math.hypot(t.x - x, t.z - z) < t.r + keep)) continue;
      const [a, b] = SIZES[kind];
      out.push({ kind, x, z, s: a + (b - a) * (kind === 'shrub' ? sz * sz * (0.55 + 0.45 * Math.max(f, edge)) : sz), rot, v });
    }
  }
  return out;
}

// ── drawn ──
function shadeBy(g: THREE.BufferGeometry, f: (p: THREE.Vector3) => number): THREE.BufferGeometry {
  for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
  const pos = g.getAttribute('position'), a = new Float32Array(pos.count), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) a[i] = f(v.fromBufferAttribute(pos, i));
  g.setAttribute('aShade', new THREE.BufferAttribute(a, 1)); return g;
}
const mergeAll = (gs: THREE.BufferGeometry[]): THREE.BufferGeometry => {
  const ng = gs.map(g => (g.index ? g.toNonIndexed() : g)), out = new THREE.BufferGeometry();
  for (const k of ['position', 'normal']) { const size = ng[0].attributes[k].itemSize, arr = new Float32Array(ng.reduce((n, g) => n + g.attributes[k].count, 0) * size); let o = 0; for (const g of ng) { arr.set(g.attributes[k].array as Float32Array, o); o += g.attributes[k].count * size; } out.setAttribute(k, new THREE.BufferAttribute(arr, size)); }
  return out;
};
/** A lumpy leaf mass whose normals lean out from `centre` (as the vista's crowns), low-poly. */
function lump(r: number, at: THREE.Vector3, centre: THREE.Vector3, seed: number, squash = 1, detail = 0): THREE.BufferGeometry {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(r, detail); g.deleteAttribute('uv'); g = mergeVertices(g);
  const pos = g.getAttribute('position'), nor = g.getAttribute('normal'), v = new THREE.Vector3(), rr = mulberry32(seed);
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i); const d = v.clone().normalize(), k = 0.82 + rr() * 0.36;
    v.copy(d).multiplyScalar(r * k); v.y *= squash; v.add(at); pos.setXYZ(i, v.x, v.y, v.z);
    const n = v.clone().sub(centre).normalize().multiplyScalar(0.7).add(d.multiplyScalar(0.3)).normalize(); nor.setXYZ(i, n.x, n.y, n.z);
  }
  return g;
}
/** A shrub ~0.6 m tall and as wide: a few leaf masses about a low centre. */
function shrubShape(seed: number): THREE.BufferGeometry {
  const rr = mulberry32(seed), c = new THREE.Vector3(0, 0.22, 0), parts: THREE.BufferGeometry[] = [];
  const n = 3 + Math.floor(rr() * 2);
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rr(), out = 0.12 + rr() * 0.12; parts.push(lump(0.2 + rr() * 0.1, new THREE.Vector3(Math.cos(a) * out, 0.2 + rr() * 0.16, Math.sin(a) * out), c, seed * 7 + i, 0.85)); }
  parts.push(lump(0.24, new THREE.Vector3(0, 0.38, 0), c, seed * 7 + 9, 0.9, 1));
  return shadeBy(mergeAll(parts), p => 0.45 + 0.55 * Math.min(1, Math.max(0, p.y / 0.6)));
}
/** A fern ~0.45 m: fronds arching out and down from the crown, each a tapering strip. */
function fernShape(seed: number): THREE.BufferGeometry {
  const rr = mulberry32(seed), p: number[] = [], nrm: number[] = [], fronds = 7;
  for (let f = 0; f < fronds; f++) {
    const a = (f / fronds) * Math.PI * 2 + rr() * 0.5, ca = Math.cos(a), sa = Math.sin(a), len = 0.38 + rr() * 0.16, lift = 0.32 + rr() * 0.12, segs = 5;
    const pt = (t: number, side: number): number[] => { const r = t * len, y = Math.sin(t * Math.PI * 0.8) * lift * (1 - t * 0.35), w = 0.06 * Math.sin(Math.min(1, t * 1.6) * Math.PI) * (1 - t * 0.6); return [ca * r - sa * w * side, y, sa * r + ca * w * side]; };
    for (let s = 0; s < segs; s++) {
      const t0 = s / segs, t1 = (s + 1) / segs, a0 = pt(t0, -1), b0 = pt(t0, 1), a1 = pt(t1, -1), b1 = pt(t1, 1);
      p.push(...a0, ...b0, ...a1, ...b0, ...b1, ...a1);
      for (let k = 0; k < 6; k++) nrm.push(ca * 0.25, 0.95, sa * 0.25);
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  return shadeBy(g, q => 0.5 + 0.5 * Math.min(1, q.y / 0.35));
}
/** A sapling ~1.6 m: a thin stem and a small crown, its leaves and its bark drawn apart. */
function saplingShape(seed: number): { stem: THREE.BufferGeometry; crown: THREE.BufferGeometry } {
  const rr = mulberry32(seed), stem = new THREE.CylinderGeometry(0.012, 0.03, 1.25, 5, 1, true); stem.translate(0, 0.62, 0);
  const c = new THREE.Vector3(0, 1.3, 0), parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 3; i++) { const a = i * 2.1 + rr(); parts.push(lump(0.28 + rr() * 0.1, new THREE.Vector3(Math.cos(a) * 0.2, 1.15 + rr() * 0.3, Math.sin(a) * 0.2), c, seed * 11 + i, 0.85)); }
  return { stem: shadeBy(stem, q => 0.55 + 0.45 * q.y / 1.25), crown: shadeBy(mergeAll(parts), q => 0.5 + 0.5 * Math.min(1, (q.y - 0.95) / 0.6)) };
}

/** How far (m) each quality draws the understory, and the share of it it draws. Tuning. */
export const UNDER_REACH: Record<string, { reach: number; share: number }> = { Low: { reach: 32, share: 0.55 }, Medium: { reach: 44, share: 0.8 }, High: { reach: 62, share: 1 } };
const KINDS_DRAWN = [
  { kind: 'shrub' as const, colours: ['#2c5022', '#38592a', '#26461f'], shapes: 3 },
  { kind: 'fern' as const, colours: ['#46743a', '#3a662f'], shapes: 2 },
];
export interface Understory { update(camera: THREE.Camera): void; setQuality(name: string): void; stats(): { tiles: number; items: number }; group: THREE.Group }
export function createUnderstory(parent: THREE.Object3D, shared: Record<string, THREE.IUniform>, land: UnderLand, height: (x: number, z: number) => number, seed: number, quality = 'Medium'): Understory {
  const group = new THREE.Group(); group.name = 'understory'; parent.add(group);
  const lit = (hex: string, defines: Record<string, string>, side: THREE.Side = THREE.FrontSide) => new THREE.ShaderMaterial({ uniforms: { ...THREE.UniformsUtils.merge([THREE.UniformsLib.lights]), ...shared, uColor: { value: new THREE.Color(hex) } }, vertexShader: solidVert, fragmentShader: solidFrag, lights: true, defines, side });
  /** Each drawn bucket: a shape, a material, and the items it draws (rebuilt as she moves). */
  interface Bucket { mesh: THREE.InstancedMesh; kind: UnderKind; pick: (v: number) => boolean; part?: 'stem' | 'crown' }
  const buckets: Bucket[] = [], CAP = 9000;
  const mk = (geo: THREE.BufferGeometry, mat: THREE.Material): THREE.InstancedMesh => { const m = new THREE.InstancedMesh(geo, mat, CAP); m.count = 0; m.frustumCulled = false; m.receiveShadow = true; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); group.add(m); return m; };
  for (const d of KINDS_DRAWN) for (let s = 0; s < d.shapes; s++) {
    const geo = d.kind === 'shrub' ? shrubShape(seed * 13 + s) : fernShape(seed * 17 + s), mat = lit(d.colours[s % d.colours.length], { USE_SWAY: '', VARIED: '', UNDER: '' }, d.kind === 'fern' ? THREE.DoubleSide : THREE.FrontSide);
    buckets.push({ mesh: mk(geo, mat), kind: d.kind, pick: v => Math.floor(v * d.shapes) === s });
  }
  for (let s = 0; s < 2; s++) {
    const sh = saplingShape(seed * 19 + s);
    buckets.push({ mesh: mk(sh.stem, lit('#6a5644', { UNDER: '' })), kind: 'sapling', pick: v => Math.floor(v * 2) === s, part: 'stem' });
    buckets.push({ mesh: mk(sh.crown, lit(s ? '#3f7430' : '#4a8034', { USE_SWAY: '', VARIED: '', UNDER: '' })), kind: 'sapling', pick: v => Math.floor(v * 2) === s, part: 'crown' });
  }
  let q = UNDER_REACH[quality] ?? UNDER_REACH.Medium;
  const tiles = new Map<string, UnderItem[]>(), at = new THREE.Vector3(1e9, 0, 0), m = new THREE.Matrix4(), pos = new THREE.Vector3(), rot = new THREE.Quaternion(), scl = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let items = 0;
  function tile(tx: number, tz: number): UnderItem[] {
    const key = `${tx},${tz}`; let t = tiles.get(key);
    if (!t) { t = underTile(tx, tz, seed, land); tiles.set(key, t); if (tiles.size > 400) for (const k of [...tiles.keys()].slice(0, 100)) tiles.delete(k); }
    return t;
  }
  function rebuild(c: THREE.Vector3): void {
    for (const b of buckets) b.mesh.count = 0;
    const R = q.reach, t0x = Math.floor((c.x - R) / UNDER_TILE), t1x = Math.floor((c.x + R) / UNDER_TILE), t0z = Math.floor((c.z - R) / UNDER_TILE), t1z = Math.floor((c.z + R) / UNDER_TILE);
    items = 0;
    for (let tz = t0z; tz <= t1z; tz++) for (let tx = t0x; tx <= t1x; tx++) {
      for (const it of tile(tx, tz)) {
        const d2 = (it.x - c.x) ** 2 + (it.z - c.z) ** 2, lim = it.kind === 'fern' ? R * 0.65 : R;
        if (it.v > q.share || d2 > lim * lim) continue;
        const y = height(it.x, it.z) - (it.kind === 'shrub' ? 0.06 : 0.02);
        pos.set(it.x, y, it.z); rot.setFromAxisAngle(up, it.rot); scl.setScalar(it.s); m.compose(pos, rot, scl);
        const pv = Math.min(0.999, it.v / q.share);
        for (const b of buckets) if (b.kind === it.kind && b.pick(pv) && b.mesh.count < CAP) b.mesh.setMatrixAt(b.mesh.count++, m);
        items++;
      }
    }
    for (const b of buckets) b.mesh.instanceMatrix.needsUpdate = true;
    at.copy(c);
  }
  return {
    group,
    update(camera) { const c = camera.position; if ((c.x - at.x) ** 2 + (c.z - at.z) ** 2 > 36) rebuild(c); },
    setQuality(name) { q = UNDER_REACH[name] ?? UNDER_REACH.Medium; at.set(1e9, 0, 0); },
    stats: () => ({ tiles: tiles.size, items }),
  };
}
