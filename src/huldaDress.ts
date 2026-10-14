// Hulda's dress on the sculpted body (design/hulda/HULDA_STYLE.md): the leaf skirt (skinned, so it
// follows the thighs), the leaf bodice, birch sleeves and greaves wrapped in vine, the violet sash,
// the copper hair with its long braid swaying behind her, pointed ears, a face. Everything but
// the skirt and the braid rides a bone rigidly. All in the rig's bind space (cm, facing +Z, left +X).
// No DOM: textures are generated as data, so the figure builds in node.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

type V = THREE.Vector3;
const v = (x: number, y: number, z: number): V => new THREE.Vector3(x, y, z);

/** The palette (sRGB, from the turnaround). */
export const HULDA_PALETTE = {
  skin: '#6e4426', hair: '#9d3911', hairDark: '#572015', hairLight: '#d4652a', leaf: '#717e49', leafDark: '#4a5b31', leafLight: '#b0a258',
  moss: '#88801d', bark: '#d2cea1', barkFleck: '#2d3523', sash: '#6f4888', sashLight: '#976da0', blossom: '#f4efe0', eye: '#1c1410', brow: '#3a1e10',
};

/** A three-step cel ramp for MeshToonMaterial: shade, half, lit. */
export function toonRamp(): THREE.DataTexture {
  const t = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]), 3, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
}
/** Birch bark as data: cream, with the dark horizontal lenticels and a grey streak or two. */
export function birchTexture(size = 64): THREE.DataTexture {
  const d = new Uint8Array(size * size * 4), cream = new THREE.Color(HULDA_PALETTE.bark), fleck = new THREE.Color(HULDA_PALETTE.barkFleck); let s = 7;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < size * size; i++) { const k = 0.92 + r() * 0.1; d[i * 4] = cream.r * 255 * k; d[i * 4 + 1] = cream.g * 255 * k; d[i * 4 + 2] = cream.b * 255 * k; d[i * 4 + 3] = 255; }
  for (let n = 0; n < 26; n++) { const y = Math.floor(r() * size), x0 = Math.floor(r() * size), len = 3 + Math.floor(r() * 9), h = r() < 0.3 ? 2 : 1;
    for (let x = 0; x < len; x++) for (let dy = 0; dy < h; dy++) { const i = ((y + dy) % size) * size + (x0 + x) % size; d[i * 4] = fleck.r * 255; d[i * 4 + 1] = fleck.g * 255; d[i * 4 + 2] = fleck.b * 255; } }
  const t = new THREE.DataTexture(d, size, size); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
}

/** One pointed leaf, folded along its vein, tip at +Y, in the XY plane facing +Z; w wide and h long. */
export function leafShape(w: number, h: number): THREE.BufferGeometry {
  const pts = [[0, 0, 0], [-0.5, 0.35, 0.06], [-0.32, 0.72, 0.03], [0, 1, 0], [0.32, 0.72, 0.03], [0.5, 0.35, 0.06], [0, 0.5, -0.05]];
  const p: number[] = []; for (const [a, b, c] of [[0, 1, 6], [1, 2, 6], [2, 3, 6], [3, 4, 6], [4, 5, 6], [5, 0, 6]]) for (const k of [a, b, c]) p.push(pts[k][0] * w, pts[k][1] * h, pts[k][2] * w);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.computeVertexNormals(); return g;
}
const colourize = (g: THREE.BufferGeometry, c: THREE.Color): THREE.BufferGeometry => { const n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) c.toArray(a, i * 3); g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
const lerpHex = (a: string, b: string, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), t);

/** The leaf skirt: three rows of hanging leaves round the hips, longer behind. Skinned: the top rides the hips, lower down a leaf leans to the thigh on its side. */
export function leafSkirt(hipsY: number, boneIndex: (name: string) => number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []; let seed = 3; const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const rows = [{ y: hipsY - 1, rx: 17.5, rz: 13.8, n: 16, len: 20, w: 10 }, { y: hipsY - 13, rx: 19.5, rz: 16, n: 18, len: 22, w: 10.5 }, { y: hipsY - 27, rx: 21, rz: 17.5, n: 18, len: 22, w: 10 }];
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const a = (i + (ri % 2) * 0.5) / row.n * Math.PI * 2, back = Math.max(0, -Math.cos(a)), front = Math.max(0, Math.cos(a));
      if (ri === 2 && front > 0.92) continue; // the slit at the front
      const len = row.len * (0.9 + r() * 0.25) * (1 + back * 0.35), g = leafShape(row.w * (0.85 + r() * 0.3), len);
      g.rotateZ(Math.PI); g.rotateX(-0.22 - ri * 0.05); g.rotateY(a); // hanging tip down, leaning out, facing out
      g.translate(Math.sin(a) * row.rx, row.y + 2, Math.cos(a) * row.rz);
      parts.push(colourize(g, lerpHex(HULDA_PALETTE.leafDark, r() < 0.3 ? HULDA_PALETTE.leafLight : HULDA_PALETTE.leaf, 0.35 + r() * 0.65)));
    }
  });
  const g = mergeGeometries(parts)!, pos = g.attributes.position, n = pos.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
  const hips = boneIndex('Hips'), left = boneIndex('LeftUpLeg'), right = boneIndex('RightUpLeg');
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), s = Math.pow(THREE.MathUtils.clamp((hipsY - 6 - y) / 42, 0, 1), 1.2) * 0.72, l = THREE.MathUtils.clamp(x / 14 + 0.5, 0, 1);
    si.set([hips, left, right, 0], i * 4); sw.set([1 - s, s * l, s * (1 - l), 0], i * 4);
  }
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  return g;
}

export interface DressMaterials { leaf: THREE.Material; bark: THREE.Material; vine: THREE.Material; sash: THREE.Material; hair: THREE.Material; skin: THREE.Material; blossom: THREE.Material; eye: THREE.Material }
/** Rigid dress pieces, each built in bind space and handed to `attach` with the bone it rides. */
export function dressRigid(J: (name: string) => V, m: DressMaterials, attach: (mesh: THREE.Object3D, bone: string) => void): void {
  const mesh = (g: THREE.BufferGeometry, mat: THREE.Material, bone: string, name: string) => { const o = new THREE.Mesh(g, mat); o.name = name; attach(o, bone); return o; };
  let seed = 11; const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  // Bodice: leaves round the ribs and over the bust, points up, one band of vine under it.
  { const c = J('Spine2'), parts: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, front = Math.cos(a); const g = leafShape(8.5, 14 + r() * 3); g.rotateX(0.18); g.rotateY(a); g.translate(Math.sin(a) * 15.6, c.y - 6, Math.cos(a) * (11.4 + Math.max(0, front) * 1.6) + 0.6); parts.push(colourize(g, lerpHex(HULDA_PALETTE.leafDark, HULDA_PALETTE.leaf, r()))); }
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const g = leafShape(7.5, 11); g.rotateZ(s * (0.5 - k * 0.35)); g.rotateX(-0.35); g.translate(c.x + s * (4 + k * 3.2), c.y - 2.5 + k * 1.6, c.z + 13.5 - k * 0.6); parts.push(colourize(g, lerpHex(HULDA_PALETTE.leaf, HULDA_PALETTE.leafLight, r() * 0.6))); }
    mesh(mergeGeometries(parts)!, m.leaf, 'Spine2', 'bodice'); }
  // Sash: a violet band at the waist, its tails hanging at her left hip.
  { const h = J('Hips'), band = new THREE.TorusGeometry(1, 0.15, 6, 28); band.rotateX(Math.PI / 2); band.scale(17.6, 22, 14.2); band.translate(0, h.y + 1.5, h.z + 0.2);
    const tails: THREE.BufferGeometry[] = [band]; for (const [dx, dz, len] of [[0, 0, 30], [3, -2, 24]] as const) { const t = new THREE.PlaneGeometry(4.2, len, 1, 6); const p = t.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin((p.getY(i) / len + 0.5) * 3) * 1.2); t.translate(0, -len / 2, 0); t.rotateY(1.2); t.translate(16 + dx, h.y + 1, 5 + dz); tails.push(t); }
    mesh(mergeGeometries(tails.map(g => { g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; }))!, m.sash, 'Hips', 'sash');
    const sprigs: THREE.BufferGeometry[] = []; for (let i = 0; i < 5; i++) { const c = new THREE.ConeGeometry(0.7, 5, 5); c.translate(17.5 + (i % 2) * 1.5, h.y - 10 - i * 3, 6.5 + (i % 3)); sprigs.push(c); }
    mesh(mergeGeometries(sprigs)!, m.sash, 'Hips', 'lavender'); }
  // Birch sleeves (elbow to wrist) and greaves (knee to ankle), each wrapped crosswise in vine.
  for (const side of [-1, 1]) {
    const L = side > 0 ? 'Left' : 'Right';
    const sleeve = (from: V, to: V, r0: number, r1: number, bone: string, name: string) => {
      const dir = to.clone().sub(from), len = dir.length(), g = new THREE.CylinderGeometry(r1, r0, len, 12, 1, true); g.translate(0, len / 2, 0);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), dir.clone().normalize())); g.translate(from.x, from.y, from.z);
      const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2, uv.getY(i) * len / 14);
      mesh(g, m.bark, bone, name);
      const wrap: THREE.BufferGeometry[] = [];
      for (const turn of [1, -1]) { const pts: V[] = []; for (let i = 0; i <= 40; i++) { const t = i / 40, a = turn * t * Math.PI * 2 * 2.2, rr = THREE.MathUtils.lerp(r0, r1, t) + 0.35; const q = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), dir.clone().normalize()); pts.push(v(Math.cos(a) * rr, t * len, Math.sin(a) * rr).applyQuaternion(q).add(from)); } wrap.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.45, 4, false)); }
      mesh(mergeGeometries(wrap)!, m.vine, bone, name + 'Vine');
    };
    const elbow = J(L + 'ForeArm'), wrist = J(L + 'Hand');
    sleeve(elbow.clone().lerp(wrist, 0.18), wrist.clone().lerp(elbow, 0.04), 4.9, 3.6, L + 'ForeArm', L + 'Sleeve');
    const knee = J(L + 'Leg'), ankle = J(L + 'Foot');
    sleeve(ankle.clone().add(v(0, 3, 0.6)), knee.clone().add(v(0, -3, 0.5)), 4.4, 5.6, L + 'Leg', L + 'Greave');
    // A vine armlet on the upper arm.
    const arm = J(L + 'Arm'), fore = J(L + 'ForeArm'), ring = new THREE.TorusGeometry(5.6, 0.6, 5, 16); ring.rotateY(Math.PI / 2); const at = arm.clone().lerp(fore, 0.55); ring.translate(at.x, at.y, at.z); mesh(ring, m.vine, L + 'Arm', L + 'Armlet');
  }
  // Head: hair cap over the skull, a bun of braid behind it, pointed ears, eyes, brows and a nose, tendrils, blossoms.
  const head = J('Head'), hc = head.clone().add(v(0, 10.5, 2.5));
  { const cap = new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.58); const p = cap.attributes.position;
    for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const front = z > 0.35 && y < 0.55; if (front) { y = Math.max(y, 0.55 - (z - 0.35) * 0.4); } const lock = 1 + 0.045 * Math.sin(Math.atan2(x, z) * 9 + y * 8); p.setXYZ(i, x * 10.4 * lock, y * 12.2 * lock, z * 11.2 * lock); }
    cap.computeVertexNormals(); cap.translate(hc.x, hc.y - 0.6, hc.z - 0.8); mesh(cap, m.hair, 'Head', 'hairCap'); }
  for (const side of [-1, 1]) { const ear = new THREE.ConeGeometry(1.7, 8.5, 6); ear.scale(0.55, 1, 1); ear.rotateX(-0.9); ear.rotateZ(-side * 0.95); ear.translate(hc.x + side * 10.6, hc.y - 0.5, hc.z - 1.5); mesh(ear, m.skin, 'Head', 'ear'); }
  for (const side of [-1, 1]) {
    const eye = new THREE.SphereGeometry(1, 8, 6); eye.scale(1.7, 0.9, 0.6); eye.translate(hc.x + side * 3.6, hc.y - 1.2, hc.z + 9.4); mesh(eye, m.eye, 'Head', 'eye');
    const brow = new THREE.BoxGeometry(3.6, 0.55, 0.6); brow.rotateZ(-side * 0.12); brow.translate(hc.x + side * 3.7, hc.y + 1.4, hc.z + 9.6); mesh(brow, m.eye, 'Head', 'brow');
  }
  // Tendrils of vine hanging by the temples, a few leaves on them, and blossoms in the hair.
  { const tend: THREE.BufferGeometry[] = [], leaves: THREE.BufferGeometry[] = [];
    for (const [sx, sz, len] of [[-1, 4, 22], [1, 4, 18], [-1, -2, 26], [1, -2, 24]] as const) {
      const top = hc.clone().add(v(sx * 9.5, 2, sz)), pts = [top, top.clone().add(v(sx * 2.2, -len * 0.4, 1.2)), top.clone().add(v(sx * 1.6, -len * 0.75, -0.5)), top.clone().add(v(sx * 2.4, -len, 0.8))];
      tend.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.8, 4, false));
      for (let k = 1; k <= 2; k++) { const l = leafShape(3.2, 4.8); l.rotateZ(sx * 1.2); l.translate(pts[k].x + sx * 1.2, pts[k].y, pts[k].z + 0.8); leaves.push(colourize(l, new THREE.Color(HULDA_PALETTE.leaf))); }
    }
    // Loose locks round the back and sides, falling to the shoulder blades: the hair's volume in the concept.
    for (let i = 0; i < 11; i++) {
      const a = Math.PI * (0.35 + 1.3 * i / 10), len = 16 + (i % 3) * 5 + r() * 4, top = hc.clone().add(v(Math.sin(a) * 9.6, 3 + r() * 3, Math.cos(a) * 9.8 - 0.5)), out = v(Math.sin(a), 0, Math.cos(a));
      const pts = [top, top.clone().addScaledVector(out, 3).add(v(0, -len * 0.35, 0)), top.clone().addScaledVector(out, 3.5).add(v(0, -len * 0.7, -1)), top.clone().addScaledVector(out, 2.8).add(v(0, -len, -1.5))];
      tend.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 14, 1.5 - (i % 2) * 0.4, 5, false));
    }
    mesh(mergeGeometries(tend)!, m.hair, 'Head', 'tendrils'); mesh(mergeGeometries(leaves)!, m.leaf, 'Head', 'hairLeaves');
    const fl: THREE.BufferGeometry[] = []; for (const [x, y, z] of [[-6.5, 8.5, 6], [7, 6, 4.5], [2, 11.5, -4]] as const) for (let k = 0; k < 5; k++) { const pe = new THREE.SphereGeometry(1, 5, 4); pe.scale(1.3, 0.35, 0.7); const a = k / 5 * Math.PI * 2; pe.translate(Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2); pe.rotateX(-0.9); pe.translate(hc.x + x, hc.y + y, hc.z + z); fl.push(pe); }
    mesh(mergeGeometries(fl)!, m.blossom, 'Head', 'blossoms'); }
}

/** The long braid: a chain of points hanging from the back of her head, swung by her motion and kept off her back. World-space verlet; drawn as a lobed tube with leaves, rebuilt each frame. */
export class Braid {
  readonly mesh: THREE.Mesh; readonly leaves: THREE.InstancedMesh;
  pts: V[] = []; private prev: V[] = []; private ready = false;
  private readonly tmp = new THREE.Vector3(); private readonly inv = new THREE.Matrix4();
  /** Tuning: segments, length (cm in bind units), radius at the head and the tip, lobes along it, gravity and damping. */
  static readonly N = 16; static readonly LENGTH = 112; static readonly R0 = 4.6; static readonly R1 = 1.8; static readonly LOBES = 13; static readonly DAMP = 0.9; static readonly STIFF = 0.35;
  private readonly radial = 7; private readonly samples = 46;
  constructor(private readonly head: THREE.Object3D, private readonly anchor: V, private readonly back: { top: THREE.Object3D; bottom: THREE.Object3D; radius: number; hips: number }, hair: THREE.Material, leaf: THREE.Material, leafGeo: THREE.BufferGeometry) {
    const n = this.samples * this.radial, g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const col = new Float32Array(n * 3), a = new THREE.Color(HULDA_PALETTE.hair), b = new THREE.Color(HULDA_PALETTE.hairDark), c = new THREE.Color(HULDA_PALETTE.hairLight);
    for (let s = 0; s < this.samples; s++) for (let k = 0; k < this.radial; k++) { const strand = Math.sin((s / this.samples) * Braid.LOBES * Math.PI * 2 + k / this.radial * Math.PI * 2); (strand > 0.55 ? c : strand < -0.4 ? b : a).toArray(col, (s * this.radial + k) * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const idx: number[] = []; for (let s = 0; s < this.samples - 1; s++) for (let k = 0; k < this.radial; k++) { const a0 = s * this.radial + k, a1 = s * this.radial + (k + 1) % this.radial, b0 = a0 + this.radial, b1 = a1 + this.radial; idx.push(a0, b0, a1, a1, b0, b1); }
    g.setIndex(idx); this.mesh = new THREE.Mesh(g, hair); this.mesh.name = 'braid'; this.mesh.frustumCulled = false;
    this.leaves = new THREE.InstancedMesh(leafGeo, leaf, 9); this.leaves.name = 'braidLeaves'; this.leaves.frustumCulled = false;
  }
  /** Step the chain. `scale` is metres per bind unit (the rig's scale), so gravity and lengths are in world terms. */
  update(dt: number, scale: number): void {
    const N = Braid.N, seg = Braid.LENGTH / (N - 1) * scale, root = this.tmp.copy(this.anchor).applyMatrix4(this.head.matrixWorld);
    if (!this.ready || this.pts[0].distanceTo(root) > 1.5) { this.pts = []; this.prev = []; for (let i = 0; i < N; i++) { const p = root.clone().add(v(0, -i * seg, 0)); this.pts.push(p); this.prev.push(p.clone()); } this.ready = true; }
    const h = Math.min(dt, 1 / 30), g = 9.8 * h * h;
    const top = new THREE.Vector3().setFromMatrixPosition(this.back.top.matrixWorld), bottom = new THREE.Vector3().setFromMatrixPosition(this.back.bottom.matrixWorld), axis = top.clone().sub(bottom), al = axis.lengthSq(), R = this.back.radius * scale, Hips = this.back.hips * scale;
    // Her back, in the world: the hips' −Z (she faces +Z in the rig's bind frame).
    const backDir = new THREE.Vector3(0, 0, -1).transformDirection(this.back.bottom.matrixWorld); backDir.y = 0; if (backDir.lengthSq() < 1e-6) backDir.set(0, 0, 1); backDir.normalize(); // level: a run's forward lean must not tip the push upward and lift the braid
    for (let i = 1; i < N; i++) { const p = this.pts[i], q = this.prev[i], vx = (p.x - q.x) * Braid.DAMP, vy = (p.y - q.y) * Braid.DAMP, vz = (p.z - q.z) * Braid.DAMP; q.copy(p); p.x += vx; p.y += vy - g; p.z += vz; }
    this.pts[0].copy(root); this.prev[0].copy(root);
    for (let it = 0; it < 4; it++) {
      // A little stiffness: each point leans toward the line of the two before it, so the braid hangs as a braid, not a rope. This and the push off her back move a point without giving it speed (its last position moves too), or the braid would gain energy every frame and fly.
      for (let i = 2; i < N; i++) { const a = this.pts[i - 2], b = this.pts[i - 1], p = this.pts[i], d = b.clone().multiplyScalar(2).sub(a).sub(p).multiplyScalar(Braid.STIFF * 0.25); p.add(d); this.prev[i].add(d); }
      for (let i = 1; i < N; i++) { const a = this.pts[i - 1], b = this.pts[i], d = b.clone().sub(a), l = d.length() || 1e-6; b.copy(a).addScaledVector(d, seg / l); }
      // Keep off her back and over her skirt: never in front of a plane behind her spine (and further out at the hips); pushed only backwards, never sideways.
      for (let i = 2; i < N; i++) { const p = this.pts[i], t = THREE.MathUtils.clamp(p.clone().sub(bottom).dot(axis) / al, -0.9, 1), c = bottom.clone().addScaledVector(axis, t), along = p.clone().sub(c).dot(backDir), r = THREE.MathUtils.lerp(R, Hips, THREE.MathUtils.clamp((0.35 - t) / 0.45, 0, 1)); if (along < r) { p.addScaledVector(backDir, r - along); this.prev[i].addScaledVector(backDir, r - along); } }
    }
    this.draw(scale);
  }
  private draw(scale: number): void {
    const parent = this.mesh.parent; if (!parent) return; this.inv.copy(parent.matrixWorld).invert();
    const local = this.pts.map(p => p.clone().applyMatrix4(this.inv)), curve = new THREE.CatmullRomCurve3(local), unit = parent.matrixWorld.getMaxScaleOnAxis() || 1;
    const pos = this.mesh.geometry.attributes.position as THREE.BufferAttribute, nor = this.mesh.geometry.attributes.normal as THREE.BufferAttribute, frames = curve.computeFrenetFrames(this.samples - 1, false);
    for (let s = 0; s < this.samples; s++) {
      const t = s / (this.samples - 1), c = curve.getPointAt(t), lobe = 1 + 0.22 * Math.abs(Math.sin(t * Braid.LOBES * Math.PI)), r = THREE.MathUtils.lerp(Braid.R0, Braid.R1, t) * lobe * scale / unit;
      for (let k = 0; k < this.radial; k++) { const a = k / this.radial * Math.PI * 2, n = frames.normals[s].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[s], Math.sin(a)); pos.setXYZ(s * this.radial + k, c.x + n.x * r, c.y + n.y * r, c.z + n.z * r); nor.setXYZ(s * this.radial + k, n.x, n.y, n.z); }
    }
    pos.needsUpdate = true; nor.needsUpdate = true; this.mesh.geometry.computeBoundingBox(); this.mesh.geometry.computeBoundingSphere();
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = v(1, 1, 1).multiplyScalar(scale / unit);
    for (let i = 0; i < this.leaves.count; i++) { const t = 0.12 + i / this.leaves.count * 0.8, c = curve.getPointAt(t), tan = curve.getTangentAt(t); q.setFromAxisAngle(tan, i * 2.4).multiply(new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), tan.clone().negate())); const off = frames.normals[Math.round(t * (this.samples - 1))].clone().multiplyScalar(Braid.R0 * 0.9 * scale / unit).applyAxisAngle(tan, i * 2.4); m.compose(c.add(off), q, sc); this.leaves.setMatrixAt(i, m); }
    this.leaves.instanceMatrix.needsUpdate = true;
  }
}
