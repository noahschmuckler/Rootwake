// The chunks as scene: a ground tile per chunk displaced by the land's height and coloured by biome, its
// trees merged (the same standee trees as the village's), trunks as colliders. Loaded in a ring round her,
// disposed behind her; the loaded chunks' trees are offered to the model's tree lookups (treeProvider).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CHUNK, chunkKey, chunksAround, chunkTrees, biomeAt } from './chunkModel';
import { createTerrain, TERRAIN_STEP, type Terrain } from './worldTerrain';
import { groundVision } from './groundVision';
import { mulberry32 } from './colors';
import { spriteMaterial, standees, type Standee } from './sprites';
import { treeParts } from './flora';
import { crownHeight, trunkRadius, type Tree } from './villageModel';
import type { Collider } from './player';

interface Chunk { key: string; group: THREE.Group; trees: Tree[]; colliders: Collider[]; geometries: THREE.BufferGeometry[] }
export function createChunks(scene: THREE.Scene, seed: number, terrain: Terrain = createTerrain(seed)) {
  const relief = terrain.height;
  const loaded = new Map<string, Chunk>();
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 }), leaf = spriteMaterial('leaf', '#5f8657'), darkBark = new THREE.MeshStandardMaterial({ color: '#2a2230', roughness: 1 }), darkLeaf = spriteMaterial('leaf', '#2e2a3a', { emissive: '#1a0a20', emissiveIntensity: 0.25 }), collar = new THREE.MeshStandardMaterial({ color: '#8a6f4e', roughness: 0.95 });
  const vision = groundVision(), ground = vision.material;
  const setUnder = (under: number, x = 0, z = 0) => vision.update(under, x, z);
  const colourOf = terrain.colour;
  function build(cx: number, cz: number): Chunk {
    const group = new THREE.Group(), geometries: THREE.BufferGeometry[] = [], n = CHUNK / TERRAIN_STEP;
    const geo = new THREE.PlaneGeometry(CHUNK, CHUNK, n, n); geo.rotateX(-Math.PI / 2); geo.translate((cx + 0.5) * CHUNK, 0, (cz + 0.5) * CHUNK);
    { const pos = geo.attributes.position as THREE.BufferAttribute, col: number[] = []; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); pos.setY(i, terrain.vertex(x, z)); col.push(...colourOf(x, z)); } geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); const normals = geo.attributes.normal as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) normals.setXYZ(i, ...terrain.normal(pos.getX(i), pos.getZ(i))); }
    const surface = new THREE.Mesh(geo, ground); surface.name = "world-ground"; group.add(surface); geometries.push(geo);
    const trees = chunkTrees(cx, cz, seed), rand = mulberry32((cx * 31 + cz * 17 + seed) >>> 0), colliders: Collider[] = [];
    const wood: THREE.BufferGeometry[] = [], cards: Standee[] = [], collars: THREE.BufferGeometry[] = [], dwood: THREE.BufferGeometry[] = [], dcards: Standee[] = [];
    for (const t of trees) { const dark = biomeAt(t.x, t.z, seed) === 'dark', parts = treeParts(rand, t.x, relief(t.x, t.z), t.z, t.size); (dark ? dwood : wood).push(...parts.wood); (dark ? dcards : cards).push(...parts.cards); collars.push(...parts.roots); colliders.push({ x: t.x, z: t.z, radius: trunkRadius(t), minY: relief(t.x, t.z) - 0.2, maxY: relief(t.x, t.z) + crownHeight(t) }); }
    const add = (gs: THREE.BufferGeometry[], st: Standee[], b: THREE.Material, l: THREE.Material): void => { if (gs.length) { const g = mergeGeometries(gs)!; group.add(new THREE.Mesh(g, b)); geometries.push(g); } if (st.length) { const g = standees(st); group.add(new THREE.Mesh(g, l)); geometries.push(g); } };
    add(wood, cards, bark, leaf); add(dwood, dcards, darkBark, darkLeaf); if (collars.length) { const g = mergeGeometries(collars)!; group.add(new THREE.Mesh(g, collar)); geometries.push(g); }
    scene.add(group); return { key: chunkKey(cx, cz), group, trees, colliders, geometries };
  }
  /** Keep the ring round (x, z) loaded and nothing else. Returns how many chunks were built. */
  function update(x: number, z: number): number {
    const want = new Set<string>(); let built = 0;
    for (const c of chunksAround(x, z)) { const key = chunkKey(c.cx, c.cz); want.add(key); if (!loaded.has(key)) { loaded.set(key, build(c.cx, c.cz)); built++; } }
    for (const [key, ch] of loaded) if (!want.has(key)) { scene.remove(ch.group); for (const g of ch.geometries) g.dispose(); loaded.delete(key); }
    return built;
  }
  const treesNear = (x: number, z: number, r: number): Tree[] => { const out: Tree[] = []; for (const ch of loaded.values()) for (const t of ch.trees) if (Math.hypot(t.x - x, t.z - z) <= r) out.push(t); return out; };
  const colliders = (): Collider[] => { const out: Collider[] = []; for (const ch of loaded.values()) out.push(...ch.colliders); return out; };
  return { update, treesNear, colliders, setUnder, get count() { return loaded.size; }, get trees() { let n = 0; for (const ch of loaded.values()) n += ch.trees.length; return n; } };
}
