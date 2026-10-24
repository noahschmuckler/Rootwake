// Her basket (Noah, 2026-10-24): what she carries from a place to a store rides in a woven basket on her back, holding
// small things of its kind, not the coloured slabs it was. Berries as clusters, water in stoppered gourds, wood as
// short sticks, grain as tied sheaves, milk in little pails; it fills from the bottom up, a thing a unit. The basket
// hangs on her chest bone (the papoose's, which she never wears with it: her hands take one or the other), so it
// leans and sways with her own clips and rides with her on the stag. Sizes in metres at her height; tuning.
import * as THREE from 'three';
import type { Store } from './villageModel';

/** The basket: radius at the mouth and the foot, height, and where it sits on the bone (behind and a little down). Tuning. */
/** The things in it are drawn CHUNK times life size, so a berry reads at the camera's distance. */
const CHUNK = 1.7;
const MOUTH_R = 0.075, FOOT_R = 0.058, HEIGHT = 0.15, AT = { y: -0.035, z: -0.115 }, TILT = 0.16;

export interface Basket { group: THREE.Group; set(kind: Store | null, n: number): void }

/** A basket for a figure whose bone frame is `k` units to the metre (the rig's scale undone), holding up to `cap` things. */
export function createBasket(k: number, cap: number): Basket {
  const m = (v: number): number => v * k, g = new THREE.Group(); g.name = 'basket';
  const weave = new THREE.MeshStandardMaterial({ color: '#9a7a48', roughness: 1, flatShading: true }), rim = new THREE.MeshStandardMaterial({ color: '#7a5c34', roughness: 1 }), strap = new THREE.MeshStandardMaterial({ color: '#5a4426', roughness: 0.9 });
  const body = new THREE.Group(); body.position.set(0, m(AT.y), m(AT.z)); body.rotation.x = -TILT; g.add(body);
  // The wall: an open tapered cylinder whose rows of verts are pushed in and out alternately, so it reads as woven.
  { const geo = new THREE.CylinderGeometry(m(MOUTH_R), m(FOOT_R), m(HEIGHT), 18, 6, true), p = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x), row = Math.round((y / m(HEIGHT) + 0.5) * 6), w = 1 + 0.06 * Math.sin(a * 9 + row * Math.PI); p.setXYZ(i, x * w, y, z * w); }
    geo.computeVertexNormals(); const wall = new THREE.Mesh(geo, weave); wall.material.side = THREE.DoubleSide; body.add(wall); }
  { const foot = new THREE.Mesh(new THREE.CircleGeometry(m(FOOT_R), 14), weave); foot.rotation.x = Math.PI / 2; foot.position.y = -m(HEIGHT / 2); body.add(foot); }
  for (const y of [0.5, -0.5]) { const t = new THREE.Mesh(new THREE.TorusGeometry(m(y > 0 ? MOUTH_R : FOOT_R), m(0.006), 5, 20), rim); t.rotation.x = Math.PI / 2; t.position.y = m(HEIGHT * y); body.add(t); }
  // Two straps over her shoulders, from the rim to the basket's foot round the front of her chest.
  for (const s of [-1, 1]) { const band = new THREE.Mesh(new THREE.TorusGeometry(m(0.085), m(0.007), 5, 16, Math.PI * 1.1), strap); band.rotation.set(0, Math.PI / 2, Math.PI * 0.45); band.position.set(m(0.05 * s), m(0.03), m(-0.04)); g.add(band); }
  // Its contents: one small thing a unit, laid in rings from the foot up; each kind its own look.
  const things = new THREE.Group(); body.add(things);
  const mat = (c: string, r = 0.8): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial({ color: c, roughness: r });
  const berry = mat('#a8284e', 0.4), leaf = mat('#4f7a3a'), gourd = mat('#b89a5a', 0.6), plug = mat('#5a4426'), stick = mat('#6b5238', 1), bark = mat('#4e3c28', 1), straw = mat('#d8bf7a', 1), tie = mat('#8a6a3a'), pail = mat('#c8c4b8', 0.5), milk = mat('#f4f0e6', 0.4);
  const ball = new THREE.SphereGeometry(1, 8, 6), tube = new THREE.CylinderGeometry(1, 1, 1, 7);
  const mesh = (geo: THREE.BufferGeometry, mt: THREE.Material, sx: number, sy: number, sz: number, x = 0, y = 0, z = 0): THREE.Mesh => { const o = new THREE.Mesh(geo, mt); o.scale.set(m(sx * CHUNK), m(sy * CHUNK), m(sz * CHUNK)); o.position.set(m(x * CHUNK), m(y * CHUNK), m(z * CHUNK)); return o; };
  const make: Record<string, () => THREE.Object3D> = {
    berries: () => { const c = new THREE.Group(); for (const [x, y, z] of [[0, 0, 0], [0.012, 0.004, 0.006], [-0.01, 0.006, 0.008], [0.004, 0.012, -0.008], [-0.006, -0.002, -0.01]]) c.add(mesh(ball, berry, 0.011, 0.011, 0.011, x, y, z)); c.add(mesh(ball, leaf, 0.016, 0.004, 0.012, 0.004, 0.016, 0)); return c; },
    water: () => { const c = new THREE.Group(); c.add(mesh(ball, gourd, 0.02, 0.024, 0.02)); c.add(mesh(ball, gourd, 0.012, 0.012, 0.012, 0, 0.026, 0)); c.add(mesh(tube, plug, 0.005, 0.01, 0.005, 0, 0.04, 0)); return c; },
    wood: () => { const c = new THREE.Group(); for (const [x, a] of [[-0.008, 0.2], [0.008, -0.15]]) { const s = mesh(tube, a > 0 ? stick : bark, 0.007, 0.075, 0.007, x, 0.02, 0); s.rotation.z = a; c.add(s); } return c; },
    grain: () => { const c = new THREE.Group(); c.add(mesh(tube, straw, 0.013, 0.06, 0.013, 0, 0.02, 0)); c.add(mesh(ball, straw, 0.02, 0.016, 0.02, 0, 0.055, 0)); c.add(mesh(tube, tie, 0.015, 0.006, 0.015, 0, 0.018, 0)); return c; },
    milk: () => { const c = new THREE.Group(); c.add(mesh(tube, pail, 0.017, 0.028, 0.017)); c.add(mesh(new THREE.CircleGeometry(1, 10), milk, 0.015, 0.015, 1, 0, 0.0142, 0).rotateX(-Math.PI / 2)); return c; },
    meat: () => mesh(ball, mat('#8a3a2a', 0.7), 0.024, 0.016, 0.018),
    dark: () => mesh(ball, mat('#2a1430', 0.6), 0.02, 0.02, 0.02),
  };
  // Where the i-th thing sits: rings of six round the wall and one in the middle, from half way up (the basket is full below), a layer a ring, the top heaped over the mouth so it shows.
  const slot = (i: number): [number, number, number, number] => { const layer = Math.floor(i / 7), j = i % 7, r = j === 6 ? 0 : 0.034, a = (j / 6) * Math.PI * 2 + layer * 0.5; return [Math.cos(a) * r, 0.025 + layer * 0.03, Math.sin(a) * r, a]; };
  let shown: Store | null = null, count = -1;
  function set(kind: Store | null, n: number): void {
    g.visible = !!kind && n > 0; if (!kind || n <= 0) return; if (kind === shown && n === count) return;
    if (kind !== shown) { things.clear(); for (let i = 0; i < cap; i++) { const o = make[kind](), [x, y, z, a] = slot(i); o.position.set(m(x), m(y), m(z)); o.rotation.y = a + i * 1.7; things.add(o); } shown = kind; }
    count = n; things.children.forEach((o, i) => { o.visible = i < n; });
  }
  g.visible = false; return { group: g, set };
}
