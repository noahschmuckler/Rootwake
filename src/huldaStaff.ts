// F2: her thorn staff and the trail its head leaves. The staff grows out of her right hand when she fights
// (a birch shaft wrapped in vine, thorns along its head, a knot of leaves and a glowing seed at the tip) and
// withdraws into it when the fight is over. It rides the RightHand bone: in that bone's frame (Mixamo's,
// centimetres) +X runs through the thumb, +Y along the fingers, +Z out of the palm, so the shaft lies along
// X through the curled fingers. The trail is a ribbon between the head and a point down the shaft, sampled
// each frame and faded by age, drawn additively. Tuning constants at the top.
import * as THREE from 'three';

/** The shaft (cm, in the hand's frame): its length, how much of it lies past the thumb, its radius, the grip's place in the fist. Tuning. */
export const STAFF_LENGTH = 150, STAFF_AHEAD = 0.62, STAFF_R = 3.3, GRIP = new THREE.Vector3(0, 7.2, 2.6);
/** Seconds to grow and to withdraw. Tuning. */
export const STAFF_GROW_S = 0.28, STAFF_WITHDRAW_S = 0.45;
/** The trail: samples kept, seconds a sample lives, how far down the shaft its inner edge runs (0 the head, 1 the hand). Tuning. */
export const TRAIL_SAMPLES = 18, TRAIL_LIFE = 0.2, TRAIL_INNER = 0.6;

export interface Staff {
  readonly group: THREE.Group;
  /** Show (grow) or hide (withdraw) the staff. */ show(on: boolean): void;
  readonly shown: boolean;
  /** 0..1, how grown it is. */ readonly grown: number;
  /** World positions of the head and of the trail's inner point. */ head(out: THREE.Vector3): THREE.Vector3; inner(out: THREE.Vector3): THREE.Vector3;
  update(dt: number): void;
  dispose(): void;
}

export function createStaff(hand: THREE.Bone, palette: { bark: string; vine: string; leaf: string; thorn: string; seed: string }): Staff {
  const group = new THREE.Group(); group.name = 'hulda-staff'; hand.add(group);
  group.position.copy(GRIP); group.visible = false;
  const ahead = STAFF_LENGTH * STAFF_AHEAD, behind = STAFF_LENGTH - ahead;
  const toon = (c: string, emissive = '#000000', ei = 0) => new THREE.MeshToonMaterial({ color: c, emissive, emissiveIntensity: ei });
  const mats = { bark: toon(palette.bark), vine: toon(palette.vine), leaf: toon(palette.leaf), thorn: toon(palette.thorn), seed: new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.seed).multiplyScalar(2.2) }) };
  const geos: THREE.BufferGeometry[] = [];
  const add = (g: THREE.BufferGeometry, m: THREE.Material): THREE.Mesh => { geos.push(g); const mesh = new THREE.Mesh(g, m); grow.add(mesh); return mesh; };
  // Everything hangs from `grow`, scaled along the shaft as it grows out of the fist.
  const grow = new THREE.Group(); group.add(grow);
  // The shaft along +X, a little thicker at the head, gently crooked.
  const shaft = new THREE.CylinderGeometry(STAFF_R * 1.1, STAFF_R * 0.85, STAFF_LENGTH, 7, 6); shaft.rotateZ(-Math.PI / 2); shaft.translate((ahead - behind) / 2, 0, 0);
  { const p = shaft.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), k = (x + behind) / STAFF_LENGTH; p.setY(i, p.getY(i) + Math.sin(k * 5.1) * 1.2); p.setZ(i, p.getZ(i) + Math.sin(k * 3.3 + 1) * 1.0); } shaft.computeVertexNormals(); }
  add(shaft, mats.bark);
  // A vine wound round it.
  { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 60; i++) { const k = i / 60, x = -behind * 0.7 + k * (ahead * 0.85 + behind * 0.7), a = k * Math.PI * 9; pts.push(new THREE.Vector3(x, Math.cos(a) * STAFF_R * 1.25, Math.sin(a) * STAFF_R * 1.25)); } add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.8, 4), mats.vine); }
  // Thorns along the head, pointing out and back a little.
  { const cone = new THREE.ConeGeometry(1.2, 7, 4); cone.translate(0, 3, 0); const n = 14, inst = new THREE.InstancedMesh(cone, mats.thorn, n); geos.push(cone); const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < n; i++) { const x = ahead * (0.45 + 0.5 * i / n), a = i * 2.4; e.set(a, 0, -0.5); q.setFromEuler(e); m.compose(new THREE.Vector3(x, Math.cos(a) * STAFF_R, Math.sin(a) * STAFF_R), q, new THREE.Vector3(1, 0.7 + (i % 3) * 0.25, 1)); inst.setMatrixAt(i, m); }
    grow.add(inst); }
  // The head: a knot, leaves round it, a glowing seed.
  { const knot = new THREE.IcosahedronGeometry(STAFF_R * 2.3, 0); knot.translate(ahead + 1, 0, 0); add(knot, mats.bark);
    const leaf = new THREE.BufferGeometry(); leaf.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 3, 1.2, 0, 11, 0, 0, 3, -1.2, 0], 3)); leaf.setIndex([0, 1, 2, 0, 2, 3, 2, 1, 0, 3, 2, 0]); leaf.computeVertexNormals(); geos.push(leaf);
    const n = 7, inst = new THREE.InstancedMesh(leaf, mats.leaf, n), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; e.set(a, 0.55, 0.2, 'XYZ'); q.setFromEuler(e); m.compose(new THREE.Vector3(ahead - 2, 0, 0), q, new THREE.Vector3(1, 1, 1).multiplyScalar(0.9 + (i % 2) * 0.3)); inst.setMatrixAt(i, m); }
    grow.add(inst);
    const seed = new THREE.SphereGeometry(STAFF_R * 1.2, 8, 6); seed.translate(ahead + STAFF_R * 2.8, 0, 0); add(seed, mats.seed); }
  // The trail's two points.
  const headPt = new THREE.Object3D(), innerPt = new THREE.Object3D(); headPt.position.set(ahead + STAFF_R * 3, 0, 0); innerPt.position.set(ahead - (ahead + behind * 0.2) * TRAIL_INNER, 0, 0); grow.add(headPt, innerPt);
  let shown = false, grown = 0;
  function update(dt: number): void {
    grown = THREE.MathUtils.clamp(grown + (shown ? dt / STAFF_GROW_S : -dt / STAFF_WITHDRAW_S), 0, 1);
    group.visible = grown > 0.001;
    // Out of the fist along the shaft, with a little overshoot as it sets.
    const k = shown ? 1 - Math.pow(1 - grown, 3) * Math.cos(grown * 4) : grown * grown;
    grow.scale.set(Math.max(0.001, k), Math.max(0.001, Math.min(1, grown * 2)), Math.max(0.001, Math.min(1, grown * 2)));
  }
  return { group, show(on) { shown = on; }, get shown() { return shown; }, get grown() { return grown; }, head: o => headPt.getWorldPosition(o), inner: o => innerPt.getWorldPosition(o), update,
    dispose() { group.removeFromParent(); for (const g of geos) g.dispose(); for (const m of Object.values(mats)) m.dispose(); } };
}

const TRAIL_VERT = /* glsl */`attribute float aAge; attribute float aEdge; varying float vAge; varying float vEdge; void main() { vAge = aAge; vEdge = aEdge; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const TRAIL_FRAG = /* glsl */`uniform vec3 uHead; uniform vec3 uTail; uniform float uLife; varying float vAge; varying float vEdge;
void main() { float k = clamp(vAge / uLife, 0.0, 1.0); float a = (1.0 - k) * (1.0 - k) * mix(0.25, 1.0, vEdge); if (a < 0.01) discard; gl_FragColor = vec4(mix(uTail, uHead, (1.0 - k) * vEdge) * 1.6, min(1.0, a * 1.3));
  #include <colorspace_fragment>
}`;
export interface Trail { sample(head: THREE.Vector3, inner: THREE.Vector3, on: boolean): void; update(dt: number): void; readonly mesh: THREE.Mesh; dispose(): void }
/** The ribbon behind the staff's head: `sample` once a frame while it swings (`on`), `update` ages it. */
export function createTrail(scene: THREE.Scene, head = '#f2ffc0', tail = '#d4652a'): Trail {
  const n = TRAIL_SAMPLES, pos = new Float32Array(n * 2 * 3), age = new Float32Array(n * 2).fill(99), edge = new Float32Array(n * 2), idx: number[] = [];
  for (let i = 0; i < n; i++) { edge[i * 2] = 1; edge[i * 2 + 1] = 0; }
  for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('aAge', new THREE.BufferAttribute(age, 1).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('aEdge', new THREE.BufferAttribute(edge, 1)); g.setIndex(idx);
  const mat = new THREE.ShaderMaterial({ uniforms: { uHead: { value: new THREE.Color(head) }, uTail: { value: new THREE.Color(tail) }, uLife: { value: TRAIL_LIFE } }, vertexShader: TRAIL_VERT, fragmentShader: TRAIL_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; mesh.renderOrder = 6; mesh.name = 'staff-trail'; scene.add(mesh);
  // Samples are kept newest first: index 0 is the staff now.
  let count = 0;
  function sample(h: THREE.Vector3, inner: THREE.Vector3, on: boolean): void {
    if (!on && count === 0) return;
    pos.copyWithin(6, 0, (n - 1) * 6); age.copyWithin(2, 0, (n - 1) * 2);
    pos[0] = h.x; pos[1] = h.y; pos[2] = h.z; pos[3] = inner.x; pos[4] = inner.y; pos[5] = inner.z; age[0] = age[1] = on ? 0 : 99;
    count = Math.min(n, count + 1);
    g.attributes.position.needsUpdate = true; g.attributes.aAge.needsUpdate = true;
  }
  function update(dt: number): void {
    let live = 0; for (let i = 0; i < n * 2; i++) { age[i] += dt; if (age[i] < TRAIL_LIFE) live++; }
    if (!live) count = 0; mesh.visible = live > 0; g.attributes.aAge.needsUpdate = true;
  }
  return { sample, update, mesh, dispose() { mesh.removeFromParent(); g.dispose(); mat.dispose(); } };
}
