// The Karst as a scene: a limestone pillar that can go glassy to show its roots, a mushroom-lit
// cavern inside it, ledges with plants clinging to the faces, a forest at its foot, sister pillars in mist.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PILLAR_HEIGHT, pillarRadius, onFace, CAVERN, FLOOR_RADIUS, ZONES, PLANTS, ROOTS, relief, vec, type Plant, type Root } from './karstModel';
import { mulberry32 } from './colors';
import type { Collider } from './player';

function lathe(radiusAt: (y: number) => number, height: number, rings: number, segments: number, rand: () => number, jitter: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= rings; i++) { const y = i / rings * height; points.push(new THREE.Vector2(radiusAt(y), y)); }
  let geo: THREE.BufferGeometry = new THREE.LatheGeometry(points, segments);
  geo = mergeVertices(geo);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); if (y < 0.2 || y > height - 0.2) continue; const r = Math.hypot(pos.getX(i), pos.getZ(i)); if (r < 0.01) continue; const k = 1 + (rand() - 0.5) * jitter; pos.setXYZ(i, pos.getX(i) * k, y + (rand() - 0.5) * 0.3, pos.getZ(i) * k); }
  geo.computeVertexNormals(); return geo;
}
export function buildKarst(scene: THREE.Scene) {
  const rand = mulberry32(310926);
  const limestone = new THREE.MeshStandardMaterial({ color: '#b9b3a2', roughness: 0.95, flatShading: true, transparent: true, opacity: 1 });
  const pillar = new THREE.Mesh(lathe(pillarRadius, PILLAR_HEIGHT, 64, 40, rand, 0.06), limestone); scene.add(pillar);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(pillarRadius(PILLAR_HEIGHT) + 0.2, 40), limestone); cap.rotation.x = -Math.PI / 2; cap.position.y = PILLAR_HEIGHT; scene.add(cap);
  // The cavern: a room inside the pillar seen only from within (back faces), its own dark stone.
  const cavernStone = new THREE.MeshStandardMaterial({ color: '#5c6663', roughness: 1, flatShading: true, side: THREE.BackSide, transparent: true, opacity: 1 });
  let cavernGeo: THREE.BufferGeometry = mergeVertices(new THREE.SphereGeometry(CAVERN.radius, 28, 18));
  { const pos = cavernGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) { const k = 1 + (rand() - 0.5) * 0.12; pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k, pos.getZ(i) * k); } cavernGeo.computeVertexNormals(); }
  const cavern = new THREE.Mesh(cavernGeo, cavernStone); cavern.position.copy(CAVERN.centre); scene.add(cavern);
  const cavernFloor = new THREE.Mesh(new THREE.CircleGeometry(ZONES.cavern.radius + 0.6, 36), new THREE.MeshStandardMaterial({ color: '#4d5a56', roughness: 1 })); cavernFloor.rotation.x = -Math.PI / 2; cavernFloor.position.y = CAVERN.floorY; scene.add(cavernFloor);
  const water = new THREE.MeshStandardMaterial({ color: '#4fa3b4', emissive: '#1f6b78', emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(CAVERN.poolRadius, 32), water); pool.rotation.x = -Math.PI / 2; pool.position.y = CAVERN.floorY + 0.03; scene.add(pool);
  // Luminescent mushrooms: the cavern's only light, in clusters on the floor and up the walls.
  const glow = new THREE.MeshStandardMaterial({ color: '#9ff2e0', emissive: '#4ef0c8', emissiveIntensity: 1.6, roughness: 0.6 });
  const stem = new THREE.MeshStandardMaterial({ color: '#d8e6dd', roughness: 0.9 });
  const mushrooms = new THREE.Group(); scene.add(mushrooms);
  const clusters = [vec(-3.2, CAVERN.floorY, 2.4), vec(2.6, CAVERN.floorY, -3.4), vec(-2.2, CAVERN.floorY, -3.1), vec(4.2, CAVERN.floorY, -0.8), vec(-4.6, CAVERN.floorY + 1.8, -0.6), vec(0.8, CAVERN.floorY + 3.2, 4.9), vec(-1.5, CAVERN.floorY + 4.6, -4.2)];
  for (const c of clusters) {
    for (let i = 0; i < 6; i++) { const a = rand() * 6.28, r = rand() * 0.7, h = 0.15 + rand() * 0.35; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, h, 5), stem); st.position.set(c.x + Math.cos(a) * r, c.y + h / 2, c.z + Math.sin(a) * r); mushrooms.add(st); const capm = new THREE.Mesh(new THREE.SphereGeometry(0.09 + rand() * 0.1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), glow); capm.position.set(st.position.x, c.y + h, st.position.z); mushrooms.add(capm); }
    const light = new THREE.PointLight('#5ef0cf', 32, 14, 1.5); light.position.copy(c).add(vec(0, 0.6, 0)); mushrooms.add(light);
  }
  // Ledges: small shelves of the same limestone where the face plants stand.
  for (const id of ['east', 'west', 'south']) { const z = ZONES[id]; const shelf = new THREE.Mesh(new THREE.CylinderGeometry(z.radius + 0.6, z.radius + 1.1, 0.9, 14), limestone); shelf.position.set(z.x, z.y - 0.45, z.z); shelf.scale.z = 0.85; scene.add(shelf); }
  // The forest floor around the foot, with trees that keep clear of the pillar and the plants' stands.
  const earth = new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 1 });
  const floorGeo = new THREE.CircleGeometry(FLOOR_RADIUS + 30, 48, 0, Math.PI * 2); floorGeo.rotateX(-Math.PI / 2);
  { const pos = floorGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i))); floorGeo.computeVertexNormals(); }
  scene.add(new THREE.Mesh(floorGeo, earth));
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 }), leaf = new THREE.MeshStandardMaterial({ color: '#5f8657', flatShading: true }), maple = new THREE.MeshStandardMaterial({ color: '#c5763f', flatShading: true }), oakLeaf = new THREE.MeshStandardMaterial({ color: '#7d9a4c', flatShading: true }), needle = new THREE.MeshStandardMaterial({ color: '#3f6b4a', flatShading: true }), fern = new THREE.MeshStandardMaterial({ color: '#8fd3b0', emissive: '#2a6b52', emissiveIntensity: 0.5, flatShading: true });
  const crown = new THREE.IcosahedronGeometry(1, 1), colliders: Collider[] = [];
  function tree(x: number, y: number, z: number, size: number, mat: THREE.Material, tilt = 0, tiltDir = 0): THREE.Group {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.set(Math.sin(tiltDir) * tilt, 0, -Math.cos(tiltDir) * tilt); scene.add(g);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * size, 0.4 * size, 3.6 * size, 7), bark); trunk.position.y = 1.8 * size; g.add(trunk);
    for (let j = 0; j < 4; j++) { const c = new THREE.Mesh(crown, mat); c.position.set((rand() - 0.5) * 1.4 * size, (3.1 + rand()) * size, (rand() - 0.5) * 1.4 * size); c.scale.set(1.5 * size, 1.05 * size, 1.4 * size); g.add(c); }
    return g;
  }
  function pine(x: number, y: number, z: number, size: number): void {
    const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * size, 0.28 * size, 5 * size, 7), bark); trunk.position.y = 2.5 * size; g.add(trunk);
    for (let j = 0; j < 4; j++) { const tier = new THREE.Mesh(new THREE.ConeGeometry((1.5 - j * 0.3) * size, 1.2 * size, 7), needle); tier.position.y = (2.5 + j * 0.8) * size; g.add(tier); }
    colliders.push({ x, z, radius: 0.35 * size, minY: y - 0.2, maxY: y + 4 * size });
  }
  const plantMeshes = new Map<string, THREE.Group>();
  for (const p of Object.values(PLANTS)) {
    let g: THREE.Group;
    if (p.kind === 'pine') { pine(p.at.x, p.at.y, p.at.z, 1.1); g = new THREE.Group(); g.position.copy(p.at); scene.add(g); }
    else if (p.kind === 'fern') { g = new THREE.Group(); g.position.copy(p.at); scene.add(g); for (let i = 0; i < 9; i++) { const frond = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.1, 4), fern); frond.position.set(Math.sin(i * 0.7) * 0.35, 0.4, Math.cos(i * 0.7) * 0.35); frond.rotation.z = Math.sin(i) * 0.7; frond.rotation.x = Math.cos(i) * 0.5; g.add(frond); } }
    else if (p.kind === 'shrub' || p.kind === 'fig') {
      // Clinging to the face: a short trunk leaning out from the rock, crown hanging over the ledge.
      const away = Math.atan2(p.at.z, p.at.x); g = tree(p.at.x, p.at.y, p.at.z, p.kind === 'fig' ? 0.75 : 0.55, p.kind === 'fig' ? oakLeaf : leaf, 0.55, away + Math.PI / 2);
      colliders.push({ x: p.at.x, z: p.at.z, radius: 0.3, minY: p.at.y - 0.2, maxY: p.at.y + 2.5 });
    } else { g = tree(p.at.x, p.at.y, p.at.z, p.kind === 'oak' ? 1.5 : 1.3, p.kind === 'oak' ? oakLeaf : maple); colliders.push({ x: p.at.x, z: p.at.z, radius: 0.55, minY: -0.2, maxY: 6 }); }
    plantMeshes.set(p.id, g);
  }
  for (let i = 0; i < 90; i++) { const a = rand() * 6.28, r = pillarRadius(0) + 4 + rand() * (FLOOR_RADIUS + 20); const x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x - 15.5, z - 3.5) < 4 || Math.hypot(x + 16, z + 2.5) < 4) continue; tree(x, relief(x, z), z, 0.7 + rand() * 0.7, rand() < 0.2 ? maple : leaf); if (r < FLOOR_RADIUS) colliders.push({ x, z, radius: 0.45, minY: -0.2, maxY: 6 }); }
  // Plants that adhere to the rock: tufts and small shrubs on the faces, moss where it is damp.
  const tuft = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.45, 0), leaf, 160), o = new THREE.Object3D();
  for (let i = 0; i < 160; i++) { const y = 2 + rand() * (PILLAR_HEIGHT - 4), a = rand() * 6.28; const p = onFace(y, a, 0.1); o.position.copy(p); o.scale.set(0.6 + rand() * 0.8, 0.5 + rand() * 0.6, 0.6 + rand() * 0.8); o.rotation.set(rand(), rand() * 6, rand()); o.updateMatrix(); tuft.setMatrixAt(i, o.matrix); } scene.add(tuft);
  const mossMat = new THREE.MeshStandardMaterial({ color: '#6f9450', roughness: 1, flatShading: true });
  const moss = new THREE.InstancedMesh(new THREE.SphereGeometry(0.5, 6, 4), mossMat, 120);
  for (let i = 0; i < 120; i++) { const y = 4 + rand() * (PILLAR_HEIGHT - 8), a = rand() * 6.28; const p = onFace(y, a, -0.15); o.position.copy(p); o.scale.set(0.8 + rand() * 1.4, 0.35, 0.8 + rand() * 1.4); o.rotation.set(0, 0, 0); o.updateMatrix(); moss.setMatrixAt(i, o.matrix); } scene.add(moss);
  const summitGrass = new THREE.InstancedMesh(new THREE.ConeGeometry(0.06, 0.3, 3), leaf, 120);
  for (let i = 0; i < 120; i++) { const a = rand() * 6.28, r = rand() * 3.4; o.position.set(Math.cos(a) * r, PILLAR_HEIGHT + 0.12, Math.sin(a) * r); o.scale.setScalar(0.6 + rand()); o.rotation.set(0, rand() * 6, 0); o.updateMatrix(); summitGrass.setMatrixAt(i, o.matrix); } scene.add(summitGrass);
  // Sister pillars in the mist, never walked.
  const mist = new THREE.MeshStandardMaterial({ color: '#9aa4a0', roughness: 1, flatShading: true });
  for (const [x, z, h, r] of [[60, -30, 78, 9], [-55, 40, 58, 12], [20, 75, 66, 8], [-70, -50, 84, 10], [85, 45, 52, 11], [-30, -85, 70, 9]]) { const m = new THREE.Mesh(lathe(y => r * (1.1 - 0.6 * Math.pow(y / h, 1.2)) + 1.5 * Math.sin(y * 0.2), h, 30, 22, rand, 0.08), mist); m.position.set(x, 0, z); scene.add(m); }
  // The roots: draped over the faces and threaded through the rock. Each has a ride tube seen from inside.
  const rootMat = new THREE.MeshStandardMaterial({ color: '#cdb47c', emissive: '#7a6230', emissiveIntensity: 0.45, roughness: 0.7, transparent: true });
  // The inside of a root: rings of lighter fibre along its length, so the ride's speed can be read on the walls.
  const fibre = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const band = 0.55 + 0.45 * Math.max(0, Math.sin(x / 64 * Math.PI * 2 * 3)) ** 3, n = 0.85 + rand() * 0.15, v = Math.floor(255 * Math.min(1, band * n)); fibre.set([v, Math.floor(v * 0.86), Math.floor(v * 0.55), 255], (y * 64 + x) * 4); }
  const fibreTex = new THREE.DataTexture(fibre, 64, 64); fibreTex.wrapS = fibreTex.wrapT = THREE.RepeatWrapping; fibreTex.needsUpdate = true;
  const insideMat = new THREE.MeshStandardMaterial({ color: '#b08a4a', emissive: '#a67a28', emissiveIntensity: 0.28, roughness: 0.85, side: THREE.BackSide, transparent: true, opacity: 0.94, map: fibreTex, emissiveMap: fibreTex });
  const rootMeshes = new Map<string, THREE.Mesh>(), rideTubes = new Map<string, THREE.Mesh>();
  for (const r of ROOTS) {
    const segments = Math.ceil(r.length * 3);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(r.curve, segments, r.interior ? 0.14 : 0.17, 7, false), rootMat); scene.add(mesh); rootMeshes.set(r.id, mesh);
    const tubeGeo = new THREE.TubeGeometry(r.curve, segments * 2, 0.42, 16, false); const uv = tubeGeo.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * r.length / 1.4);
    const tube = new THREE.Mesh(tubeGeo, insideMat); tube.visible = false; scene.add(tube); rideTubes.set(r.id, tube);
  }
  const haloMat = new THREE.MeshBasicMaterial({ color: '#f1dc9e', transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
  const halos = new Map<string, THREE.Mesh>();
  for (const p of Object.values(PLANTS)) { const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.55, 30), haloMat); ring.rotation.x = -Math.PI / 2; ring.position.copy(p.mouth).add(vec(0, 0.03, 0)); scene.add(ring); halos.set(p.id, ring); }
  const motes: { mesh: THREE.Mesh; root: Root; offset: number }[] = [];
  const moteMat = new THREE.MeshBasicMaterial({ color: '#f5ffd0' });
  for (const r of ROOTS) for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 4), moteMat); scene.add(m); motes.push({ mesh: m, root: r, offset: i / 10 }); }
  /** vision 0..1 makes the limestone glassy; riding names the root whose inside is shown. */
  function update(vision: number, t: number, riding: Root | null, eye: THREE.Vector3): void {
    limestone.opacity = 1 - vision * 0.78; limestone.depthWrite = vision < 0.5; cavernStone.opacity = 1 - vision * 0.6; cavernStone.depthWrite = vision < 0.5;
    rootMat.emissiveIntensity = 0.45 + vision * 0.9; rootMat.opacity = 0.55 + vision * 0.45;
    for (const [id, tube] of rideTubes) tube.visible = riding?.id === id;
    for (const m of motes) { m.mesh.visible = vision > 0.3 || riding === m.root; m.mesh.position.copy(m.root.curve.getPointAt((t * 0.00005 + m.offset) % 1)); }
    for (const [, ring] of halos) { ring.visible = eye.distanceTo(ring.position) > 1.2; ring.scale.setScalar(1 + Math.sin(t * 0.002) * 0.1); }
  }
  return { colliders, update, plantMeshes, rootMeshes };
}
export type KarstWorld = ReturnType<typeof buildKarst>;
export const plantsOf = (zone: string): Plant[] => Object.values(PLANTS).filter(p => p.zone === zone);
