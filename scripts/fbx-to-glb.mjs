// Convert an animated FBX (Quaternius's older packs ship FBX only) to a GLB with its skin and clips, under node, through three's own
// FBXLoader and GLTFExporter: `node scripts/fbx-to-glb.mjs in.fbx out.glb [--keep Idle,Flying] [--scale 0.01]`. Materials are kept as
// named standard materials (the figures replace them); no textures are carried (none of ours have any). `--simplify N` collapses each
// mesh toward N triangles in all (three's SimplifyModifier, which drops the skin attributes: they are put back from the nearest original
// vertex, since the collapse only ever moves a vertex onto another). Clips of one name are kept once (the FBX carries "Eagle|Idle" and
// "EagleArmature|Idle").
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// The exporter reads its own Blob back through a FileReader; node has Blob but no FileReader.
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(r => { this.result = r; this.onloadend?.(); }); } readAsDataURL() { throw new Error('data URLs unsupported'); } };
}
const [, , inPath, outPath, ...rest] = process.argv;
if (!inPath || !outPath) { console.error('usage: node scripts/fbx-to-glb.mjs in.fbx out.glb [--keep A,B] [--scale k]'); process.exit(2); }
const opt = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : d; };
const keep = opt('--keep', null)?.split(','), scale = parseFloat(opt('--scale', '1')), simplify = parseInt(opt('--simplify', '0'), 10);
const buf = readFileSync(inPath);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const scene = new FBXLoader().parse(ab, '');
scene.updateMatrixWorld(true);
let clips = scene.animations ?? [];
// Clip names come as "WolfArmature|Walking": keep the part after the bar.
for (const c of clips) c.name = c.name.replace(/^.*\|/, '');
if (keep) clips = clips.filter(c => keep.includes(c.name));
clips = clips.filter((c, i) => clips.findIndex(d => d.name === c.name) === i);
const meshes = [], bones = []; scene.traverse(o => { if (o.isMesh) meshes.push(o); if (o.isBone) bones.push(o); });
/** The skin attributes of `from` put onto `to`, each of its vertices taking the original vertex at (or nearest) its position. */
function reskin(from, to) {
  const fp = from.attributes.position, tp = to.attributes.position, fi = from.attributes.skinIndex, fw = from.attributes.skinWeight;
  if (!fi || !fw) return;
  const key = (x, y, z) => `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`, at = new Map();
  for (let i = 0; i < fp.count; i++) at.set(key(fp.getX(i), fp.getY(i), fp.getZ(i)), i);
  const ti = new THREE.BufferAttribute(new Uint16Array(tp.count * 4), 4), tw = new THREE.BufferAttribute(new Float32Array(tp.count * 4), 4);
  let misses = 0;
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i); let j = at.get(key(x, y, z));
    if (j === undefined) { misses++; let best = Infinity; for (let k = 0; k < fp.count; k++) { const d = (fp.getX(k) - x) ** 2 + (fp.getY(k) - y) ** 2 + (fp.getZ(k) - z) ** 2; if (d < best) { best = d; j = k; } } }
    for (let c = 0; c < 4; c++) { ti.setComponent(i, c, fi.getComponent(j, c)); tw.setComponent(i, c, fw.getComponent(j, c)); }
  }
  to.setAttribute('skinIndex', ti); to.setAttribute('skinWeight', tw);
  return misses;
}
/** A mesh's material groups as meshes of their own (a skinned mesh keeps its skeleton and bind), so each can be collapsed and keep its
 * material's name: the simplifier drops the groups, and the exporter writes no primitive for a grouped material without them. */
function splitGroups(m) {
  const g = m.geometry; if (!Array.isArray(m.material) || g.groups.length === 0) return [m];
  const src = g.index ? g.toNonIndexed() : g, out = [];
  const byMat = new Map(); for (const gr of src.groups) { const c = byMat.get(gr.materialIndex) ?? []; c.push(gr); byMat.set(gr.materialIndex, c); }
  for (const [mi, grs] of byMat) {
    const n = grs.reduce((t, gr) => t + gr.count, 0), part = new THREE.BufferGeometry();
    for (const [name, attr] of Object.entries(src.attributes)) { const arr = new attr.array.constructor(n * attr.itemSize); let k = 0; for (const gr of grs) { arr.set(attr.array.subarray(gr.start * attr.itemSize, (gr.start + gr.count) * attr.itemSize), k); k += gr.count * attr.itemSize; } part.setAttribute(name, new THREE.BufferAttribute(arr, attr.itemSize, attr.normalized)); }
    const mesh = m.isSkinnedMesh ? new THREE.SkinnedMesh(part, m.material[mi]) : new THREE.Mesh(part, m.material[mi]);
    mesh.name = `${m.name}_${m.material[mi].name || mi}`; if (m.isSkinnedMesh) { mesh.bindMode = m.bindMode; mesh.bindMatrix.copy(m.bindMatrix); mesh.bindMatrixInverse.copy(m.bindMatrixInverse); mesh.skeleton = m.skeleton; }
    mesh.position.copy(m.position); mesh.quaternion.copy(m.quaternion); mesh.scale.copy(m.scale); out.push(mesh);
  }
  m.parent.add(...out); m.removeFromParent(); return out;
}
if (simplify > 0) {
  const parts = meshes.flatMap(splitGroups); meshes.length = 0; meshes.push(...parts);
  const total = meshes.reduce((n, m) => n + (m.geometry.index ? m.geometry.index.count / 3 : m.geometry.attributes.position.count / 3), 0);
  const mod = new SimplifyModifier();
  for (const m of meshes) {
    const g = m.geometry, before = g.index ? g.index.count / 3 : g.attributes.position.count / 3, share = Math.max(1, Math.round(simplify * before / total));
    // The modifier takes a count of (merged) vertices to remove; the triangles left track the vertices left. Past what it can collapse it
    // gives nothing back, so the ask backs off by a tenth until it holds.
    const verts = mergeVertices(g).attributes.position.count; let removeN = Math.max(0, Math.round(verts * (1 - share / before))), out;
    for (;;) { out = mod.modify(g, removeN); if ((out.index ? out.index.count : out.attributes.position.count) > 0 || removeN === 0) break; removeN = Math.floor(removeN * 0.9); }
    const misses = reskin(g, out); out.computeVertexNormals(); m.geometry = out;
    console.log(`simplify ${m.name || 'mesh'}: ${before} → ${out.index ? out.index.count / 3 : out.attributes.position.count / 3} tris (${misses ?? 0} nearest)`);
  }
}
new GLTFExporter().parse(scene, result => {
  writeFileSync(outPath, Buffer.from(result));
  console.log(`out: ${outPath} ${(result.byteLength / 1024).toFixed(0)} KB, clips ${clips.map(c => c.name).join(', ')}`);
}, e => { console.error(e); process.exit(1); }, { binary: true, animations: clips, onlyVisible: false });
