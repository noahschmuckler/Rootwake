import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { taperedTube } from './flora';
import type { WorldRoot } from './worldRoots';
/** One mesh per owned chunk; recycle only changed chunks, not the whole network. */
export function rootNetworkWorld(scene: THREE.Scene) {
  const meshes = new Map<string, THREE.Mesh>(); let visible = false;
  const material = new THREE.MeshStandardMaterial({ color: '#8a6f4e', emissive: '#c9a24a', emissiveIntensity: 0.1, roughness: 0.95 });
  function update(roots: WorldRoot[], closed: (r: WorldRoot) => boolean = () => false) {
    const chunks = new Map<string, WorldRoot[]>();
    for (const r of roots) { if (closed(r)) continue; const key = r.id.split(':')[1]; const list = chunks.get(key) ?? []; list.push(r); chunks.set(key, list); }
    for (const [key, mesh] of meshes) if (!chunks.has(key)) { scene.remove(mesh); mesh.geometry.dispose(); meshes.delete(key); }
    for (const [key, rs] of chunks) if (!meshes.has(key)) {
      const parts = rs.map(r => taperedTube(r.curve, Math.max(4, Math.ceil(r.length)), 5, t => 0.10 + 0.04 * Math.abs(2*t-1), 0.12));
      if (!parts.length) continue;
      const geometry = mergeGeometries(parts)!; for (const p of parts) p.dispose();
      const mesh = new THREE.Mesh(geometry, material); mesh.name = `root-chunk:${key}`; mesh.visible = visible; scene.add(mesh); meshes.set(key, mesh);
    }
  }
  /** Everything drawn again (the blight moved). */
  function reset(): void { for (const mesh of meshes.values()) { scene.remove(mesh); mesh.geometry.dispose(); } meshes.clear(); }
  return { reset, update, vision(under:number) { visible = under > 0.01; for (const mesh of meshes.values()) mesh.visible = visible; material.emissiveIntensity=0.1+under*0.4; }, get count(){return meshes.size;} };
}
