// FOREST (Noah, 2026-10-20): what grows under the trees, so a forest reads as a forest and not as wooded plains, and
// looks hard to see into without being hard to walk through. Saplings and young trees in the canopy's gaps, shrubs at
// her chest and over her head, thickest at a stand's edge, and ferns in its shade; a few shrubs out on the plains. None
// of it stops her (she pushes through): it is drawn, not stood on. Each 24 m tile grows the same whenever it comes near
// (its own seed), clear of the trunks, the water and the places; the vista draws the tiles about the camera, instanced, in
// its own light (vistaShaders' solid, swaying), and only near (the haze and the trees have it past that).
import * as THREE from 'three';
import { mulberry32 } from './colors';
import { solidVert, solidFrag, cardVert, cardFrag } from './vistaShaders';
import { spriteTexture, standees, type Standee, type SpriteKind } from './sprites';

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
// PINE BARRENS (Noah, 2026-10-21): the understory as crossed cards (sprites.ts), as the plain look always drew its foliage: a shrub is three
// textured cards, not a hundred and forty triangles of leaf mass, and its leaves and needles are drawn, not implied. What grows: the
// barrens' knee-high carpet of lowbush blueberry and huckleberry (most of the shrubs, the small ones), scrub oak at her chest and over
// her head (the big ones), bracken in the shade, and young pitch pines in the gaps. All through the card shader's light (cardFrag).
function shadeCards(g: THREE.BufferGeometry, f: (p: THREE.Vector3) => number): THREE.BufferGeometry {
  const pos = g.getAttribute('position'), a = new Float32Array(pos.count), v = new THREE.Vector3(), nor = g.getAttribute('normal'), up = new THREE.Vector3(0, 1, 0);
  // The cards' normals lean up and out from the plant's foot, so a clump shades as a mound whichever way its cards face.
  for (let i = 0; i < pos.count; i++) { a[i] = f(v.fromBufferAttribute(pos, i)); v.y = 0; v.normalize().multiplyScalar(0.5).add(up).normalize(); nor.setXYZ(i, v.x, v.y, v.z); }
  g.setAttribute('aShade', new THREE.BufferAttribute(a, 1)); return g;
}
/** A clump of cards about a foot: `n` crossed pairs scattered within `spread`, each `w` wide and `h` tall (a flat card over every other). */
function clump(rr: () => number, n: number, spread: number, w: number, h: number, lift = 0): THREE.BufferGeometry {
  const cards: Standee[] = [];
  for (let i = 0; i < n; i++) { const a = rr() * Math.PI * 2, d = rr() * spread, k = 0.8 + rr() * 0.4; cards.push({ position: new THREE.Vector3(Math.cos(a) * d, lift + (rr() - 0.5) * 0.1 * h, Math.sin(a) * d), yaw: rr() * Math.PI, width: w * k, height: h * k, flat: i % 2 === 0 }); }
  return shadeCards(standees(cards), p => 0.45 + 0.55 * Math.min(1, Math.max(0, p.y / (lift + h))));
}
/** Scrub oak ~0.85 m at scale 1 (drawn at 1.5–2.7, SIZES.shrub): a few leafy cards, taller than wide. */
const scrubOak = (seed: number) => clump(mulberry32(seed), 3, 0.18, 0.62, 0.85);
/** Blueberry ~0.45 m: a low wide clump of twiggy small-leaved cards. */
const blueberry = (seed: number) => clump(mulberry32(seed), 3, 0.3, 0.6, 0.45);
/** Bracken ~0.5 m: two crossed fronds. */
const bracken = (seed: number) => clump(mulberry32(seed), 1, 0, 0.75, 0.55);
/** A young pitch pine ~1.6 m: a thin stem (drawn solid) and a few needle tufts up it. */
function pineSapling(seed: number): { stem: THREE.BufferGeometry; crown: THREE.BufferGeometry } {
  const rr = mulberry32(seed), stem = new THREE.CylinderGeometry(0.012, 0.035, 1.3, 5, 1, true); stem.translate(0, 0.65, 0);
  for (const name of Object.keys(stem.attributes)) if (name !== 'position' && name !== 'normal') stem.deleteAttribute(name);
  { const pos = stem.getAttribute('position'), a = new Float32Array(pos.count); for (let i = 0; i < pos.count; i++) a[i] = 0.55 + 0.45 * pos.getY(i) / 1.3; stem.setAttribute('aShade', new THREE.BufferAttribute(a, 1)); }
  const cards: Standee[] = [];
  for (let i = 0; i < 3; i++) { const a = i * 2.1 + rr(), k = 0.5 + rr() * 0.25; cards.push({ position: new THREE.Vector3(Math.cos(a) * 0.12, 0.75 + i * 0.3 - k * 0.45, Math.sin(a) * 0.12), yaw: rr() * Math.PI, width: k, height: k, flat: i === 2 }); }
  return { stem, crown: shadeCards(standees(cards), p => 0.5 + 0.5 * Math.min(1, Math.max(0, (p.y - 0.5) / 1.1))) };
}

/** How far (m) each quality draws the understory, and the share of it it draws. Tuning. */
export const UNDER_REACH: Record<string, { reach: number; share: number }> = { Low: { reach: 36, share: 0.6 }, Medium: { reach: 50, share: 0.85 }, High: { reach: 70, share: 1 } };
/** The shrubs' split: a shrub smaller than this (its scale, SIZES.shrub) is blueberry, knee-high; bigger, scrub oak at her chest and over her head. Tuning. */
const BERRY_BELOW = 1.5;
export interface Understory { update(camera: THREE.Camera): void; setQuality(name: string): void; stats(): { tiles: number; items: number }; group: THREE.Group }
export function createUnderstory(parent: THREE.Object3D, shared: Record<string, THREE.IUniform>, land: UnderLand, height: (x: number, z: number) => number, seed: number, quality = 'Medium'): Understory {
  const group = new THREE.Group(); group.name = 'understory'; parent.add(group);
  const uniforms = (own: Record<string, THREE.IUniform>) => ({ ...THREE.UniformsUtils.merge([THREE.UniformsLib.lights]), ...shared, ...own });
  const cardMat = (hex: string, kind: SpriteKind) => new THREE.ShaderMaterial({ uniforms: uniforms({ uColor: { value: new THREE.Color(hex) }, uMap: { value: spriteTexture(kind) } }), vertexShader: cardVert, fragmentShader: cardFrag, lights: true, defines: { USE_SWAY: '', UNDER: '' }, side: THREE.DoubleSide });
  const solidMat = (hex: string) => new THREE.ShaderMaterial({ uniforms: uniforms({ uColor: { value: new THREE.Color(hex) } }), vertexShader: solidVert, fragmentShader: solidFrag, lights: true, defines: { UNDER: '' } });
  /** Each drawn bucket: a shape, a material, and the items it draws (rebuilt as she moves). */
  interface Bucket { mesh: THREE.InstancedMesh; kind: UnderKind; pick: (v: number, s: number) => boolean; part?: 'stem' | 'crown' }
  /** The most instances a bucket draws (a High tile ring at the heart's density holds a few thousand items over every bucket). Tuning. */
  const buckets: Bucket[] = [], CAP = 2400;
  const mk = (geo: THREE.BufferGeometry, mat: THREE.Material): THREE.InstancedMesh => { const m = new THREE.InstancedMesh(geo, mat, CAP); m.count = 0; m.frustumCulled = false; m.receiveShadow = true; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); group.add(m); return m; };
  // Shrubs: the small ones (most: underTile skews them small) are blueberry, the big ones scrub oak, two shapes each.
  for (let s = 0; s < 2; s++) buckets.push({ mesh: mk(blueberry(seed * 13 + s), cardMat(s ? '#3f6b33' : '#45703a', 'berry')), kind: 'shrub', pick: (v, sz) => sz < BERRY_BELOW && Math.floor(v * 2) === s });
  for (let s = 0; s < 2; s++) buckets.push({ mesh: mk(scrubOak(seed * 17 + s), cardMat(s ? '#3d6628' : '#476f2c', 'leaf')), kind: 'shrub', pick: (v, sz) => sz >= BERRY_BELOW && Math.floor(v * 2) === s });
  for (let s = 0; s < 2; s++) buckets.push({ mesh: mk(bracken(seed * 19 + s), cardMat(s ? '#5a8a30' : '#52822e', 'frond')), kind: 'fern', pick: v => Math.floor(v * 2) === s });
  for (let s = 0; s < 2; s++) {
    const sh = pineSapling(seed * 23 + s);
    buckets.push({ mesh: mk(sh.stem, solidMat('#5a4636')), kind: 'sapling', pick: v => Math.floor(v * 2) === s, part: 'stem' });
    buckets.push({ mesh: mk(sh.crown, cardMat(s ? '#557f30' : '#5c8a34', 'pine')), kind: 'sapling', pick: v => Math.floor(v * 2) === s, part: 'crown' });
  }
  let q = UNDER_REACH[quality] ?? UNDER_REACH.Medium;
  /** A grown tile: its items and their ground heights (looked up once). */
  const tiles = new Map<string, { items: UnderItem[]; ys: Float32Array }>(), at = new THREE.Vector3(1e9, 0, 0), m = new THREE.Matrix4(), pos = new THREE.Vector3(), rot = new THREE.Quaternion(), scl = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let items = 0;
  /** A tile's growth if it has grown; the tiles still to grow are grown a few milliseconds a frame (BUDGET_MS), never all at once. */
  const BUDGET_MS = 4, pending: string[] = [];
  function tile(tx: number, tz: number): { items: UnderItem[]; ys: Float32Array } | null {
    const key = `${tx},${tz}`, t = tiles.get(key); if (t) return t;
    if (!pending.includes(key)) pending.push(key); return null;
  }
  let sinceShown = 0;
  function grow(): boolean {
    if (!pending.length) return false; const t0 = performance.now();
    while (pending.length && performance.now() - t0 < BUDGET_MS) {
      const key = pending.shift()!, [tx, tz] = key.split(',').map(Number), its = underTile(tx, tz, seed, land), ys = new Float32Array(its.length);
      its.forEach((it, i) => { ys[i] = height(it.x, it.z) - (it.kind === 'shrub' ? 0.05 : 0.02); });
      tiles.set(key, { items: its, ys }); sinceShown++;
    }
    if (tiles.size > 400) for (const k of [...tiles.keys()].slice(0, 100)) tiles.delete(k);
    return true;
  }
  function rebuild(c: THREE.Vector3): void {
    for (const b of buckets) b.mesh.count = 0;
    const R = q.reach, t0x = Math.floor((c.x - R) / UNDER_TILE), t1x = Math.floor((c.x + R) / UNDER_TILE), t0z = Math.floor((c.z - R) / UNDER_TILE), t1z = Math.floor((c.z + R) / UNDER_TILE);
    items = 0;
    for (let tz = t0z; tz <= t1z; tz++) for (let tx = t0x; tx <= t1x; tx++) {
      const t = tile(tx, tz); if (!t) continue;
      t.items.forEach((it, i) => {
        const d2 = (it.x - c.x) ** 2 + (it.z - c.z) ** 2, lim = it.kind === 'fern' ? R * 0.65 : R;
        if (it.v > q.share || d2 > lim * lim) return;
        pos.set(it.x, t.ys[i], it.z); rot.setFromAxisAngle(up, it.rot); scl.setScalar(it.s); m.compose(pos, rot, scl);
        const pv = Math.min(0.999, it.v / q.share);
        for (const b of buckets) if (b.kind === it.kind && b.pick(pv, it.s) && b.mesh.count < CAP) b.mesh.setMatrixAt(b.mesh.count++, m);
        items++;
      });
    }
    // Only the instances in use go to the GPU.
    for (const b of buckets) { const a = b.mesh.instanceMatrix; a.clearUpdateRanges(); if (b.mesh.count > 0) a.addUpdateRange(0, b.mesh.count * 16); a.needsUpdate = true; }
    // The nearest tiles grow first.
    const key = (k: string) => { const [tx, tz] = k.split(',').map(Number); return ((tx + 0.5) * UNDER_TILE - c.x) ** 2 + ((tz + 0.5) * UNDER_TILE - c.z) ** 2; };
    pending.sort((a, b) => key(a) - key(b)); sinceShown = 0;
    at.copy(c);
  }
  return {
    group,
    // Shown as it grows: once a few tiles have grown, and when the last has.
    update(camera) { const c = camera.position; if (grow() && (!pending.length || sinceShown >= 4)) at.set(1e9, 0, 0); if ((c.x - at.x) ** 2 + (c.z - at.z) ** 2 > 36) rebuild(c); },
    setQuality(name) { q = UNDER_REACH[name] ?? UNDER_REACH.Medium; at.set(1e9, 0, 0); },
    stats: () => ({ tiles: tiles.size, items }),
  };
}
