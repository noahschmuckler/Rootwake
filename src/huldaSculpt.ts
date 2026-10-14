// Hulda's body, sculpted in code (design/hulda/HULDA_STYLE.md, body-v1.png): smooth primitives
// along the X Bot's bones in its T-pose bind (file units, centimetres, facing +Z, left at +X),
// blended into one surface, meshed by surface nets and skinned to the bones by which primitive
// each point belongs to. So the clips that drive the rig bend one continuous body, not jointed
// parts. Pure Three.js maths: no DOM, testable in node.
import * as THREE from 'three';

type V = THREE.Vector3;
const v = (x: number, y: number, z: number): V => new THREE.Vector3(x, y, z);
/** A primitive: a signed distance in cm, the bone it moves with, and the part it belongs to (parts blend with the torso, never with each other: the thighs keep their crease). */
interface Prim { d: (p: V) => number; bone: string; part: string }

// ── signed distances (after Inigo Quilez) ────────────────────────────────
function ellipsoid(c: V, r: V): (p: V) => number {
  return p => { const x = (p.x - c.x) / r.x, y = (p.y - c.y) / r.y, z = (p.z - c.z) / r.z, k0 = Math.hypot(x, y, z), k1 = Math.hypot(x / r.x, y / r.y, z / r.z); return k1 < 1e-9 ? -Math.min(r.x, r.y, r.z) : k0 * (k0 - 1) / k1; };
}
/** A capsule tapering from radius r1 at a to r2 at b. */
function roundCone(a: V, b: V, r1: number, r2: number): (p: V) => number {
  const ba = b.clone().sub(a), l2 = ba.lengthSq(), rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2, pa = new THREE.Vector3(), t = new THREE.Vector3();
  return p => {
    pa.copy(p).sub(a); const y = pa.dot(ba), z = y - l2;
    t.copy(pa).multiplyScalar(l2).addScaledVector(ba, -y); const x2 = t.lengthSq(), y2 = y * y * l2, z2 = z * z * l2, k = Math.sign(rr) * rr * rr * x2;
    if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
    if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
    return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
  };
}
const smin = (a: number, b: number, k: number): number => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };

/** Tuning: blend radii (cm): within the torso, within a limb, and where a limb meets the torso. */
export const BLEND = { torso: 4, limb: 2.6, join: 3.2 };

/** Her primitives from the joints of the bind pose. Proportions after body-v1.png: broad shoulders, strong arms, a narrow waist, wide hips, heavy thighs and calves. */
export function bodyPrims(J: (name: string) => V): Prim[] {
  const P: Prim[] = [];
  const add = (part: string, bone: string, d: (p: V) => number) => P.push({ part, bone, d });
  const at = (name: string, dx = 0, dy = 0, dz = 0) => J(name).clone().add(v(dx, dy, dz));
  // Torso (one part): pelvis, glutes, waist, ribcage, chest, trapezius, neck, head, jaw.
  add('torso', 'Hips', ellipsoid(at('Hips', 0, -3, -0.5), v(16.5, 11, 12)));
  for (const s of [-1, 1]) add('torso', 'Hips', ellipsoid(at('Hips', s * 7.5, -6, -6.5), v(8.6, 9.5, 8)));
  add('torso', 'Spine', ellipsoid(at('Spine', 0, 1, -0.5), v(12.2, 9.5, 9.5)));
  add('torso', 'Spine1', ellipsoid(at('Spine1', 0, 4, -0.5), v(15.2, 11, 11)));
  add('torso', 'Spine2', ellipsoid(at('Spine2', 0, 4.5, 0.5), v(17, 8.5, 10.5)));
  for (const s of [-1, 1]) add('torso', 'Spine2', ellipsoid(at('Spine2', s * 6.8, 1.6, 8.2), v(6.6, 6, 5.6)));
  add('torso', 'Spine2', ellipsoid(at('Spine2', 0, 11, -2.5), v(13.5, 5.2, 7)));
  add('torso', 'Neck', roundCone(at('Neck', 0, -4, 0), at('Head', 0, 1.5, 0.5), 6.4, 5.4));
  add('torso', 'Head', ellipsoid(at('Head', 0, 10.5, 2.5), v(9.2, 11, 10.2)));
  add('torso', 'Head', ellipsoid(at('Head', 0, 3.8, 5.6), v(6.6, 5.2, 6.4)));
  for (const s of [-1, 1]) {
    const L = s > 0 ? 'Left' : 'Right';
    // Shoulder and arm: deltoid, upper arm with biceps and triceps, forearm with its swell, a mitten hand and a thumb.
    add(L + 'arm', L + 'Shoulder', ellipsoid(at(L + 'Shoulder', s * 5, 1, -1.5), v(7, 5, 6.2)));
    add(L + 'arm', L + 'Arm', ellipsoid(at(L + 'Arm', s * 1.5, -0.5, 0), v(7, 6.3, 6.6)));
    add(L + 'arm', L + 'Arm', roundCone(J(L + 'Arm'), J(L + 'ForeArm'), 5.8, 4.4));
    add(L + 'arm', L + 'Arm', ellipsoid(at(L + 'Arm', s * 13, 1.2, 2.2), v(8, 4.4, 4.2)));
    add(L + 'arm', L + 'Arm', ellipsoid(at(L + 'Arm', s * 12, -0.8, -2.4), v(8.5, 4.2, 3.9)));
    add(L + 'arm', L + 'ForeArm', roundCone(J(L + 'ForeArm'), J(L + 'Hand'), 4.5, 2.9));
    add(L + 'arm', L + 'ForeArm', ellipsoid(at(L + 'ForeArm', s * 7, 0.4, 0.3), v(7.5, 4.2, 4.5)));
    add(L + 'arm', L + 'Hand', ellipsoid(at(L + 'Hand', s * 5.5, 0, -0.2), v(5.8, 2.1, 4.3)));
    add(L + 'arm', L + 'HandMiddle1', ellipsoid(at(L + 'HandMiddle1', s * 4.2, -0.4, -0.2), v(5.6, 1.7, 3.9)));
    add(L + 'arm', L + 'HandThumb1', roundCone(J(L + 'HandThumb1'), J(L + 'HandThumb4'), 1.9, 1.3));
    // Leg: thigh (kept narrow at the top so the two never web), quadriceps and the outer swell, calf, foot and toes.
    add(L + 'leg', L + 'UpLeg', roundCone(at(L + 'UpLeg', s * 0.8, 0, 0), J(L + 'Leg'), 7.2, 5.4));
    add(L + 'leg', L + 'UpLeg', ellipsoid(at(L + 'UpLeg', s * 1.4, -19, 3.4), v(6.9, 14, 6.4)));
    add(L + 'leg', L + 'UpLeg', ellipsoid(at(L + 'UpLeg', s * 4.2, -10, -0.5), v(5.2, 11.5, 6.6)));
    add(L + 'leg', L + 'Leg', roundCone(J(L + 'Leg'), at(L + 'Foot', 0, 1, 0), 5.0, 3.1));
    add(L + 'leg', L + 'Leg', ellipsoid(at(L + 'Leg', 0, -12, -3.2), v(4.9, 10.5, 5.1)));
    add(L + 'leg', L + 'Foot', roundCone(at(L + 'Foot', 0, -1, -1.5), at(L + 'ToeBase', 0, 2.2, -1), 3.6, 3.1));
    add(L + 'leg', L + 'ToeBase', ellipsoid(at(L + 'ToeBase', 0, 1.8, 3.4), v(4.3, 1.9, 5.6)));
  }
  return P;
}

/** The blended field: each part's own blend, then every limb blended into the torso, but limbs only met by a hard minimum. */
export function bodyField(prims: Prim[]): (p: V) => number {
  const parts = new Map<string, Prim[]>(); for (const pr of prims) { if (!parts.has(pr.part)) parts.set(pr.part, []); parts.get(pr.part)!.push(pr); }
  const torso = parts.get('torso')!, limbs = [...parts.entries()].filter(([k]) => k !== 'torso').map(([, v]) => v);
  const union = (ps: Prim[], p: V, k: number) => { let d = Infinity; for (const pr of ps) d = d === Infinity ? pr.d(p) : smin(d, pr.d(p), k); return d; };
  return p => { const t = union(torso, p, BLEND.torso); let d = t; for (const l of limbs) d = Math.min(d, smin(t, union(l, p, BLEND.limb), BLEND.join)); return d; };
}

/** Surface nets over the field: one vertex per surface cell (where its edges cross zero), quads between them. Normals from the field's gradient. */
export function surfaceNets(f: (p: V) => number, min: V, max: V, cell: number): { positions: Float32Array; normals: Float32Array; index: number[] } {
  const nx = Math.ceil((max.x - min.x) / cell) + 1, ny = Math.ceil((max.y - min.y) / cell) + 1, nz = Math.ceil((max.z - min.z) / cell) + 1;
  const val = new Float32Array(nx * ny * nz), p = new THREE.Vector3(), I = (i: number, j: number, k: number) => (k * ny + j) * nx + i;
  // A coarse pass first: far from the surface only the sign matters, so fine points there take their coarse node's value.
  const S = 4, cx = Math.ceil(nx / S) + 1, cy = Math.ceil(ny / S) + 1, cz = Math.ceil(nz / S) + 1, coarse = new Float32Array(cx * cy * cz), far = cell * S * 1.2;
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) coarse[(k * cy + j) * cx + i] = f(p.set(min.x + i * S * cell, min.y + j * S * cell, min.z + k * S * cell));
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const c = coarse[(Math.round(k / S) * cy + Math.round(j / S)) * cx + Math.round(i / S)];
    val[I(i, j, k)] = Math.abs(c) > far ? c : f(p.set(min.x + i * cell, min.y + j * cell, min.z + k * cell));
  }
  const vid = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1), C = (i: number, j: number, k: number) => (k * (ny - 1) + j) * (nx - 1) + i;
  const pos: number[] = [], index: number[] = [];
  const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const cv = corners.map(([a, b, c]) => val[I(i + a, j + b, k + c)]);
    let inside = 0; for (const x of cv) if (x < 0) inside++; if (inside === 0 || inside === 8) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of edges) { const va = cv[a], vb = cv[b]; if ((va < 0) === (vb < 0)) continue; const t = va / (va - vb), ca = corners[a], cb = corners[b]; sx += ca[0] + (cb[0] - ca[0]) * t; sy += ca[1] + (cb[1] - ca[1]) * t; sz += ca[2] + (cb[2] - ca[2]) * t; n++; }
    vid[C(i, j, k)] = pos.length / 3; pos.push(min.x + (i + sx / n) * cell, min.y + (j + sy / n) * cell, min.z + (k + sz / n) * cell);
  }
  // A quad for every grid edge the surface crosses, joining the four cells round it, wound by the sign.
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const a = val[I(i, j, k)];
    const quad = (b: number, c0: number, c1: number, c2: number, c3: number) => { if ((a < 0) === (b < 0)) return; const q = [vid[c0], vid[c1], vid[c2], vid[c3]]; if (q.some(x => x < 0)) return; if (a < 0) index.push(q[0], q[1], q[2], q[0], q[2], q[3]); else index.push(q[0], q[2], q[1], q[0], q[3], q[2]); };
    if (i < nx - 1) quad(val[I(i + 1, j, k)], C(i, j - 1, k - 1), C(i, j, k - 1), C(i, j, k), C(i, j - 1, k));
    if (j < ny - 1) quad(val[I(i, j + 1, k)], C(i - 1, j, k - 1), C(i - 1, j, k), C(i, j, k), C(i, j, k - 1));
    if (k < nz - 1) quad(val[I(i, j, k + 1)], C(i - 1, j - 1, k), C(i, j - 1, k), C(i, j, k), C(i - 1, j, k));
  }
  const positions = new Float32Array(pos), normals = new Float32Array(pos.length), e = cell * 0.5, q = new THREE.Vector3();
  for (let t = 0; t < pos.length; t += 3) {
    q.set(pos[t], pos[t + 1], pos[t + 2]);
    const gx = f(p.set(q.x + e, q.y, q.z)) - f(p.set(q.x - e, q.y, q.z)), gy = f(p.set(q.x, q.y + e, q.z)) - f(p.set(q.x, q.y - e, q.z)), gz = f(p.set(q.x, q.y, q.z + e)) - f(p.set(q.x, q.y, q.z - e)), l = Math.hypot(gx, gy, gz) || 1;
    normals[t] = gx / l; normals[t + 1] = gy / l; normals[t + 2] = gz / l;
  }
  // Wind every face to agree with the field's outward normal (the quad rule's sign convention is easy to get backwards).
  let agree = 0; const A = new THREE.Vector3(), B = new THREE.Vector3(), Cc = new THREE.Vector3();
  for (let t = 0; t < index.length; t += 3) { A.fromArray(positions, index[t] * 3); B.fromArray(positions, index[t + 1] * 3).sub(A); Cc.fromArray(positions, index[t + 2] * 3).sub(A); B.cross(Cc); agree += Math.sign(B.x * normals[index[t] * 3] + B.y * normals[index[t] * 3 + 1] + B.z * normals[index[t] * 3 + 2]); }
  if (agree < 0) for (let t = 0; t < index.length; t += 3) { const x = index[t + 1]; index[t + 1] = index[t + 2]; index[t + 2] = x; }
  return { positions, normals, index };
}

/** Skin weights: each bone weighs by how near the point lies to that bone's primitives (exp of the distance over TAU), the four heaviest kept. */
export const WEIGHT_TAU = 1.6;
export function skinWeights(prims: Prim[], positions: Float32Array, boneIndex: (name: string) => number): { skinIndex: Uint16Array; skinWeight: Float32Array } {
  const n = positions.length / 3, skinIndex = new Uint16Array(n * 4), skinWeight = new Float32Array(n * 4), p = new THREE.Vector3(), w = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    p.fromArray(positions, i * 3); w.clear();
    for (const pr of prims) { const d = Math.max(0, pr.d(p)); w.set(pr.bone, (w.get(pr.bone) ?? 0) + Math.exp(-d / WEIGHT_TAU)); }
    const top = [...w.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4), sum = top.reduce((s, [, x]) => s + x, 0) || 1;
    top.forEach(([bone, x], k) => { skinIndex[i * 4 + k] = boneIndex(bone); skinWeight[i * 4 + k] = x / sum; });
  }
  return { skinIndex, skinWeight };
}

/** Tuning: the grid step (cm). 1.9 gives about 10k triangles: hands as mittens, which is what reads at 70 px. */
export const SCULPT_CELL = 1.9;
/** The body as one skinned geometry in the rig's bind space, and a hull pushed out along the normals for the outline. */
export function sculptBody(J: (name: string) => V, boneIndex: (name: string) => number, outline = 1.1): { body: THREE.BufferGeometry; hull: THREE.BufferGeometry; prims: Prim[] } {
  const prims = bodyPrims(name => J(name)), f = bodyField(prims);
  const head = J('HeadTop_End'), hand = J('LeftHandMiddle4');
  const { positions, normals, index } = surfaceNets(f, v(-hand.x - 4, -1.5, -24), v(hand.x + 4, head.y + 2, 24), SCULPT_CELL);
  const { skinIndex, skinWeight } = skinWeights(prims, positions, name => boneIndex(name));
  const make = (pos: Float32Array): THREE.BufferGeometry => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(normals, 3)); g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndex, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeight, 4)); g.setIndex(index); g.computeBoundingSphere(); return g; };
  const hullPos = new Float32Array(positions.length); for (let i = 0; i < positions.length; i++) hullPos[i] = positions[i] + normals[i] * outline;
  return { body: make(positions), hull: make(hullPos), prims };
}
