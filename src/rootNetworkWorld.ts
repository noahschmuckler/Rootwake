import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { taperedTube } from './flora';
import type { WorldRoot } from './worldRoots';
/** One mesh per owned chunk; recycle only changed chunks, not the whole network. */
export function rootNetworkWorld(scene: THREE.Scene) {
  const meshes = new Map<string, { mesh: THREE.Mesh; ids: string }>(); let visible = false;
  const material = new THREE.MeshStandardMaterial({ color: '#8a6f4e', emissive: '#c9a24a', emissiveIntensity: 0.1, roughness: 0.95 });
  /** The open roots of each loaded chunk as one mesh: a chunk's mesh is built again only when the roots it shows (by id) changed, so a blight's
   * closing a root (C1.1: her growth, at dawn) redraws the chunks it crossed and no other. Returns how many chunks were drawn again. */
  function update(roots: WorldRoot[], closed: (r: WorldRoot) => boolean = () => false): number {
    const chunks = new Map<string, WorldRoot[]>(); let n = 0;
    for (const r of roots) { if (closed(r)) continue; const key = r.id.split(':')[1]; const list = chunks.get(key) ?? []; list.push(r); chunks.set(key, list); }
    for (const [key, m] of meshes) if (!chunks.has(key)) { scene.remove(m.mesh); m.mesh.geometry.dispose(); meshes.delete(key); }
    for (const [key, rs] of chunks) {
      const ids = rs.map(r => r.id).join('|'), have = meshes.get(key); if (have && have.ids === ids) continue;
      if (have) { scene.remove(have.mesh); have.mesh.geometry.dispose(); meshes.delete(key); }
      const parts = rs.map(r => taperedTube(r.curve, Math.max(4, Math.ceil(r.length)), 5, t => 0.10 + 0.04 * Math.abs(2*t-1), 0.12));
      if (!parts.length) continue;
      const geometry = mergeGeometries(parts)!; for (const p of parts) p.dispose();
      const mesh = new THREE.Mesh(geometry, material); mesh.name = `root-chunk:${key}`; mesh.visible = visible; scene.add(mesh); meshes.set(key, { mesh, ids }); n++;
    }
    return n;
  }
  /** Everything drawn again on the next update. */
  function reset(): void { for (const m of meshes.values()) { scene.remove(m.mesh); m.mesh.geometry.dispose(); } meshes.clear(); }
  return { reset, update, vision(under:number) { visible = under > 0.01; for (const m of meshes.values()) m.mesh.visible = visible; material.emissiveIntensity=0.1+under*0.4; }, get count(){return meshes.size;} };
}
