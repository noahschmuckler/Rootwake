// Writes public/models/samples/sample-rig.gltf: the smallest rigged character that exercises the
// whole path (a skinned figure, two bones, Idle / Walking / Running clips, facing +Z like Mixamo),
// so the browser journey proves a prefab-animated file loads and moves without a real asset in git.
import { writeFileSync, mkdirSync } from 'node:fs';
const H = 1.8, W = 0.3, D = 0.2, hipY = 0.9;
// A box: bottom ring, hip ring, top ring; the hip ring shares bones half and half.
const rings = [[0, 0, 1], [hipY, 0.5, 0.5], [H, 1, 0]];
const pos = [], joints = [], weights = [], nrm = [];
for (const [y, w1, w0] of rings) for (const [x, z] of [[-W, -D], [W, -D], [W, D], [-W, D]]) { pos.push(x, y, z); nrm.push(x, 0, z); joints.push(0, 1, 0, 0); weights.push(w0, w1, 0, 0); }
const idx = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) { const a = r * 4 + i, b = r * 4 + (i + 1) % 4, c = a + 4, d = b + 4; idx.push(a, b, d, a, d, c); }
idx.push(8, 9, 10, 8, 10, 11, 0, 2, 1, 0, 3, 2);
const ibm = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -hipY, 0, 1];
// Clips: the upper bone (index 1) rotates about x; a quaternion track. Idle sways a little, the walk swings, the run swings harder and faster.
const quatX = a => [Math.sin(a / 2), 0, 0, Math.cos(a / 2)];
function clip(seconds, amp, cycles) { const times = [], vals = []; for (let i = 0; i <= 16; i++) { const t = i / 16 * seconds; times.push(t); vals.push(...quatX(amp * Math.sin(t / seconds * Math.PI * 2 * cycles))); } return { times, vals }; }
const idle = clip(2, 0.08, 1), walk = clip(1, 0.35, 1), run = clip(0.6, 0.6, 1);
const chunks = []; let offset = 0; const views = [];
function push(arr, Type, target) { const bytes = new Uint8Array(new Type(arr).buffer); const pad = (4 - bytes.length % 4) % 4; chunks.push(bytes, new Uint8Array(pad)); const view = { buffer: 0, byteOffset: offset, byteLength: bytes.length, ...(target ? { target } : {}) }; offset += bytes.length + pad; views.push(view); return views.length - 1; }
const accessors = [];
function acc(view, type, count, componentType, extra = {}) { accessors.push({ bufferView: view, componentType, count, type, ...extra }); return accessors.length - 1; }
const minMax = a => { const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < a.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], a[i + k]); mx[k] = Math.max(mx[k], a[i + k]); } return { min: mn, max: mx }; };
const aPos = acc(push(pos, Float32Array, 34962), 'VEC3', pos.length / 3, 5126, minMax(pos)), aNrm = acc(push(nrm, Float32Array, 34962), 'VEC3', nrm.length / 3, 5126);
const aJoint = acc(push(joints, Uint8Array, 34962), 'VEC4', joints.length / 4, 5121), aWeight = acc(push(weights, Float32Array, 34962), 'VEC4', weights.length / 4, 5126);
const aIdx = acc(push(idx, Uint16Array, 34963), 'SCALAR', idx.length, 5123), aIbm = acc(push(ibm, Float32Array), 'MAT4', 2, 5126);
const animations = [];
for (const [name, c] of [['Idle', idle], ['Walking', walk], ['Running', run]]) { const t = acc(push(c.times, Float32Array), 'SCALAR', c.times.length, 5126, { min: [0], max: [c.times[c.times.length - 1]] }), v = acc(push(c.vals, Float32Array), 'VEC4', c.vals.length / 4, 5126); animations.push({ name, samplers: [{ input: t, output: v, interpolation: 'LINEAR' }], channels: [{ sampler: 0, target: { node: 2, path: 'rotation' } }] }); }
const buffer = Buffer.concat(chunks.map(c => Buffer.from(c)));
const gltf = { asset: { version: '2.0', generator: 'rootwake make-sample-rig' }, scene: 0, scenes: [{ nodes: [0, 1] }],
  nodes: [{ name: 'Figure', mesh: 0, skin: 0 }, { name: 'Hips', children: [2], translation: [0, 0, 0] }, { name: 'Spine', translation: [0, hipY, 0] }],
  skins: [{ inverseBindMatrices: aIbm, joints: [1, 2], skeleton: 1 }],
  meshes: [{ primitives: [{ attributes: { POSITION: aPos, NORMAL: aNrm, JOINTS_0: aJoint, WEIGHTS_0: aWeight }, indices: aIdx, material: 0 }] }],
  materials: [{ pbrMetallicRoughness: { baseColorFactor: [0.55, 0.7, 0.45, 1], metallicFactor: 0, roughnessFactor: 0.9 } }],
  animations, buffers: [{ byteLength: buffer.length, uri: 'data:application/octet-stream;base64,' + buffer.toString('base64') }], bufferViews: views, accessors };
mkdirSync('public/models/samples', { recursive: true }); writeFileSync('public/models/samples/sample-rig.gltf', JSON.stringify(gltf));
console.log('wrote public/models/samples/sample-rig.gltf', buffer.length, 'bytes of buffer');
