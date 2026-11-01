// Merge a glTF's skinned primitives by material: `node scripts/merge-glb.mjs in.glb out.glb`. The simplifier (fbx-to-glb.mjs --simplify) writes one
// primitive per material group of the source, which for the cat was 72 (each a skinned draw every frame, never culled); the same skin in three.
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(r => { this.result = r; this.onloadend?.(); }); } readAsDataURL() { throw new Error('data URLs unsupported'); } };
}
const [, , input, output] = process.argv; if (!input || !output) { console.error('usage: node scripts/merge-glb.mjs in.glb out.glb'); process.exit(1); }
const buf = readFileSync(input), ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const gltf = await new Promise((res, rej) => new GLTFLoader().parse(ab, '', res, rej));
const scene = gltf.scene, skinned = []; scene.traverse(o => { if (o.isSkinnedMesh) skinned.push(o); });
const byMat = new Map(); for (const m of skinned) { const c = byMat.get(m.material) ?? []; c.push(m); byMat.set(m.material, c); }
console.log('primitives', skinned.length, 'materials', byMat.size);
for (const [mat, list] of byMat) {
  // The loader shares one vertex buffer across a mesh's primitives (each its own index into it): join the indices over the shared vertices; merge the attributes only where they differ.
  const first = list[0], parent = first.parent, g0 = first.geometry, shared = list.every(m => m.geometry.attributes.position === g0.attributes.position && m.geometry.index);
  let geo; if (shared) { geo = new THREE.BufferGeometry(); for (const [name, attr] of Object.entries(g0.attributes)) geo.setAttribute(name, attr); const idx = []; for (const m of list) idx.push(...m.geometry.index.array); geo.setIndex(idx); }
  else { geo = mergeGeometries(list.map(m => m.geometry), false); if (!geo) throw new Error('attributes differ'); }
  const mesh = new THREE.SkinnedMesh(geo, mat); mesh.name = (first.name || 'mesh').replace(/_\d+$/, ''); mesh.bindMode = first.bindMode; mesh.bindMatrix.copy(first.bindMatrix); mesh.bindMatrixInverse.copy(first.bindMatrixInverse); mesh.skeleton = first.skeleton;
  mesh.position.copy(first.position); mesh.quaternion.copy(first.quaternion); mesh.scale.copy(first.scale);
  for (const m of list) m.removeFromParent(); parent.add(mesh);
}
let count = 0; scene.traverse(o => { if (o.isSkinnedMesh) count++; }); console.log('now', count);
new GLTFExporter().parse(scene, result => { writeFileSync(output, Buffer.from(result)); console.log('wrote', output, Buffer.from(result).length, 'bytes'); }, e => { console.error(e); process.exit(1); }, { binary: true, animations: gltf.animations, onlyVisible: false });
