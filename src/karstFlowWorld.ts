// The Karst as a scene for the free-flow study: the limestone pillar that goes glassy while she is
// in its roots, the mushroom-lit cavern, ledges with clinging plants, the forest at the foot, sister
// pillars in mist, opaque bark roots with collars, and her trail. No spring, no groves, no soil.
import * as THREE from 'three';
import { mergeVertices, mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PILLAR_HEIGHT, pillarRadius, onFace, CAVERN, FLOOR_RADIUS, ZONES, PLANTS, relief, vec, type Root } from './karstModel';
import { FLOW_ROOTS, groundAt, trunkRadius, cellCentre, TRAIL_MAX, type Progress } from './karstFlowModel';
import { mulberry32 } from './colors';
import type { Collider } from './player';
import { spriteMaterial, standees, crownStandees, type Standee } from './sprites';
import { taperedTube } from './flora';

function lathe(radiusAt: (y: number) => number, height: number, rings: number, segments: number, rand: () => number, jitter: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= rings; i++) { const y = i / rings * height; points.push(new THREE.Vector2(radiusAt(y), y)); }
  let geo: THREE.BufferGeometry = new THREE.LatheGeometry(points, segments);
  geo = mergeVertices(geo);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); if (y < 0.2 || y > height - 0.2) continue; const r = Math.hypot(pos.getX(i), pos.getZ(i)); if (r < 0.01) continue; const k = 1 + (rand() - 0.5) * jitter; pos.setXYZ(i, pos.getX(i) * k, y + (rand() - 0.5) * 0.3, pos.getZ(i) * k); }
  geo.computeVertexNormals(); return geo;
}
export function buildKarstFlow(scene: THREE.Scene) {
  const rand = mulberry32(310926);
  // Two-sided: while she rides through the rock the camera is inside it, and glassy walls should still be there.
  const limestone = new THREE.MeshStandardMaterial({ color: '#b9b3a2', roughness: 0.95, flatShading: true, transparent: true, opacity: 1, side: THREE.DoubleSide });
  const pillar = new THREE.Mesh(lathe(pillarRadius, PILLAR_HEIGHT, 64, 40, rand, 0.06), limestone); scene.add(pillar);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(pillarRadius(PILLAR_HEIGHT) + 0.2, 40), limestone); cap.rotation.x = -Math.PI / 2; cap.position.y = PILLAR_HEIGHT; scene.add(cap);
  const cavernStone = new THREE.MeshStandardMaterial({ color: '#5c6663', roughness: 1, flatShading: true, side: THREE.BackSide, transparent: true, opacity: 1 });
  let cavernGeo: THREE.BufferGeometry = mergeVertices(new THREE.SphereGeometry(CAVERN.radius, 28, 18));
  { const pos = cavernGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) { const k = 1 + (rand() - 0.5) * 0.12; pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k, pos.getZ(i) * k); } cavernGeo.computeVertexNormals(); }
  const cavern = new THREE.Mesh(cavernGeo, cavernStone); cavern.position.copy(CAVERN.centre); scene.add(cavern);
  const cavernFloor = new THREE.Mesh(new THREE.CircleGeometry(ZONES.cavern.radius + 0.6, 36), new THREE.MeshStandardMaterial({ color: '#4d5a56', roughness: 1 })); cavernFloor.rotation.x = -Math.PI / 2; cavernFloor.position.y = CAVERN.floorY; scene.add(cavernFloor);
  const water = new THREE.MeshStandardMaterial({ color: '#4fa3b4', emissive: '#1f6b78', emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(CAVERN.poolRadius, 32), water); pool.rotation.x = -Math.PI / 2; pool.position.y = CAVERN.floorY + 0.03; scene.add(pool);
  // Luminescent mushrooms: the cavern's only light.
  const glow = new THREE.MeshStandardMaterial({ color: '#9ff2e0', emissive: '#4ef0c8', emissiveIntensity: 1.6, roughness: 0.6 });
  const stem = new THREE.MeshStandardMaterial({ color: '#d8e6dd', roughness: 0.9 });
  const mushrooms = new THREE.Group(); scene.add(mushrooms);
  const clusters = [vec(-3.2, CAVERN.floorY, 2.4), vec(2.6, CAVERN.floorY, -3.4), vec(-2.2, CAVERN.floorY, -3.1), vec(4.2, CAVERN.floorY, -0.8), vec(-4.6, CAVERN.floorY + 1.8, -0.6), vec(0.8, CAVERN.floorY + 3.2, 4.9), vec(-1.5, CAVERN.floorY + 4.6, -4.2)];
  for (const c of clusters) {
    for (let i = 0; i < 6; i++) { const a = rand() * 6.28, r = rand() * 0.7, h = 0.15 + rand() * 0.35; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, h, 5), stem); st.position.set(c.x + Math.cos(a) * r, c.y + h / 2, c.z + Math.sin(a) * r); mushrooms.add(st); const capm = new THREE.Mesh(new THREE.SphereGeometry(0.09 + rand() * 0.1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), glow); capm.position.set(st.position.x, c.y + h, st.position.z); mushrooms.add(capm); }
    const light = new THREE.PointLight('#5ef0cf', 32, 14, 1.5); light.position.copy(c).add(vec(0, 0.6, 0)); mushrooms.add(light);
  }
  for (const id of ['east', 'west', 'south']) { const z = ZONES[id]; const shelf = new THREE.Mesh(new THREE.CylinderGeometry(z.radius + 0.6, z.radius + 1.1, 0.9, 14), limestone); shelf.position.set(z.x, z.y - 0.45, z.z); shelf.scale.z = 0.85; scene.add(shelf); }
  const earth = new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 1, side: THREE.DoubleSide });
  const floorGeo = new THREE.CircleGeometry(FLOOR_RADIUS + 30, 48); floorGeo.rotateX(-Math.PI / 2);
  { const pos = floorGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i))); floorGeo.computeVertexNormals(); }
  scene.add(new THREE.Mesh(floorGeo, earth));
  // Wood, leaves and roots: crossed standees for foliage, opaque tapered tubes for roots.
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 });
  const leaf = spriteMaterial('leaf', '#5f8657'), maple = spriteMaterial('leaf', '#c5763f'), oak = spriteMaterial('leaf', '#7d9a4c'), needle = spriteMaterial('needle', '#3f6b4a'), fern = spriteMaterial('frond', '#8fd3b0', { emissive: '#2a6b52', emissiveIntensity: 0.5 });
  const colliders: Collider[] = [];
  function buildTree(x: number, y: number, z: number, size: number, tilt = 0, tiltDir = 0): { wood: THREE.BufferGeometry[]; cards: Standee[] } {
    const frame = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.sin(tiltDir) * tilt, 0, -Math.cos(tiltDir) * tilt)).setPosition(x, y, z);
    const wood: THREE.BufferGeometry[] = [];
    const trunk = new THREE.CylinderGeometry(0.15 * size, 0.42 * size, 3.2 * size, 8); trunk.translate(0, 1.6 * size, 0); wood.push(trunk.applyMatrix4(frame));
    for (let j = 0; j < 3; j++) {
      const yaw = j / 3 * Math.PI * 2 + rand(), branch = new THREE.CylinderGeometry(0.05 * size, 0.11 * size, 1.7 * size, 6);
      branch.translate(0, 0.85 * size, 0).rotateX(0.75).rotateY(yaw).translate(0, (2.4 + rand() * 0.5) * size, 0); wood.push(branch.applyMatrix4(frame));
    }
    const cards = crownStandees(rand, new THREE.Vector3(0, 3.5 * size, 0), 1.7 * size, 1.2 * size, 1.7 * size, 9, 1.4 * size);
    for (const c of cards) c.position.applyMatrix4(frame);
    return { wood, cards };
  }
  function tree(x: number, y: number, z: number, size: number, mat: THREE.Material, tilt = 0, tiltDir = 0): void {
    const g = new THREE.Group(); scene.add(g); const t = buildTree(x, y, z, size, tilt, tiltDir);
    g.add(new THREE.Mesh(mergeGeometries(t.wood)!, bark), new THREE.Mesh(standees(t.cards), mat));
  }
  function pine(x: number, y: number, z: number, size: number): void {
    const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * size, 0.3 * size, 5 * size, 7), bark); trunk.position.y = 2.5 * size; g.add(trunk);
    const cards: Standee[] = [];
    for (const [h, ring, n, w] of [[2.1, 1.35, 9, 1.35], [2.9, 1.05, 7, 1.15], [3.7, 0.7, 6, 0.95], [4.4, 0.35, 4, 0.75]]) for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + h; cards.push({ position: new THREE.Vector3(Math.cos(a) * ring * size * (0.6 + rand() * 0.5), h * size + (rand() - 0.5) * 0.3 * size, Math.sin(a) * ring * size * (0.6 + rand() * 0.5)), yaw: a + Math.PI / 2, width: w * size * (0.85 + rand() * 0.3), height: 1.05 * size, flat: i % 3 === 0 }); }
    g.add(new THREE.Mesh(standees(cards), needle));
  }
  for (const p of Object.values(PLANTS)) {
    if (p.kind === 'pine') pine(p.at.x, p.at.y, p.at.z, 1.1);
    else if (p.kind === 'fern') { const fronds: Standee[] = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; fronds.push({ position: p.at.clone().add(vec(Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25)), yaw: a, width: 0.9 + rand() * 0.3, height: 1.0 + rand() * 0.3 }); } scene.add(new THREE.Mesh(standees(fronds), fern)); }
    else if (p.kind === 'shrub' || p.kind === 'fig') { const away = Math.atan2(p.at.z, p.at.x); tree(p.at.x, p.at.y, p.at.z, p.kind === 'fig' ? 0.75 : 0.55, p.kind === 'fig' ? maple : leaf, 0.55, away + Math.PI / 2); }
    else tree(p.at.x, p.at.y, p.at.z, p.kind === 'oak' ? 1.5 : 1.3, p.kind === 'oak' ? oak : maple);
    colliders.push({ x: p.at.x, z: p.at.z, radius: trunkRadius(p), minY: p.at.y - 0.2, maxY: p.at.y + (p.kind === 'fern' ? 1.2 : 5) });
  }
  const wildWood: THREE.BufferGeometry[] = [], wildCards: Record<'leaf' | 'maple', Standee[]> = { leaf: [], maple: [] };
  for (let i = 0; i < 90; i++) {
    const a = rand() * 6.28, r = pillarRadius(0) + 4 + rand() * (FLOOR_RADIUS + 20); const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.hypot(x - 15.5, z - 3.5) < 4 || Math.hypot(x + 16, z + 2.5) < 4) continue;
    const size = 0.7 + rand() * 0.7, t = buildTree(x, relief(x, z), z, size); wildWood.push(...t.wood); wildCards[rand() < 0.2 ? 'maple' : 'leaf'].push(...t.cards);
    if (r < FLOOR_RADIUS) colliders.push({ x, z, radius: 0.45, minY: -0.2, maxY: 6 });
  }
  scene.add(new THREE.Mesh(mergeGeometries(wildWood)!, bark), new THREE.Mesh(standees(wildCards.leaf), leaf), new THREE.Mesh(standees(wildCards.maple), maple));
  const grassMat = spriteMaterial('grass', '#9fc06a');
  const floorGrass: Standee[] = [], summitTufts: Standee[] = [];
  for (let i = 0; i < 380; i++) { const a = rand() * 6.28, r = pillarRadius(0) + 1 + rand() * (FLOOR_RADIUS - pillarRadius(0)); const x = Math.cos(a) * r, z = Math.sin(a) * r; const k = 0.35 + rand() * 0.35; floorGrass.push({ position: vec(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  for (let i = 0; i < 110; i++) { const a = rand() * 6.28, r = rand() * 3.5, k = 0.18 + rand() * 0.2; summitTufts.push({ position: vec(Math.cos(a) * r, PILLAR_HEIGHT + 0.02, Math.sin(a) * r), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(floorGrass), grassMat), new THREE.Mesh(standees(summitTufts), grassMat));
  const tufts: Standee[] = [];
  for (let i = 0; i < 170; i++) { const y = 2 + rand() * (PILLAR_HEIGHT - 4), a = rand() * 6.28, k = 0.55 + rand() * 0.7; tufts.push({ position: onFace(y, a, 0.02), yaw: rand() * Math.PI, width: k, height: k * (0.7 + rand() * 0.5), up: new THREE.Vector3(Math.cos(a), 0.35, Math.sin(a)), flat: i % 2 === 0 }); }
  scene.add(new THREE.Mesh(standees(tufts), leaf));
  const mossMat = new THREE.MeshStandardMaterial({ color: '#6f9450', roughness: 1, flatShading: true });
  const moss = new THREE.InstancedMesh(new THREE.SphereGeometry(0.5, 6, 4), mossMat, 120); const o = new THREE.Object3D();
  for (let i = 0; i < 120; i++) { let y = 4 + rand() * (PILLAR_HEIGHT - 8); if (Math.abs(y - CAVERN.centre.y) < CAVERN.radius + 1.5) y = y < CAVERN.centre.y ? CAVERN.centre.y - CAVERN.radius - 1.5 - rand() * 6 : CAVERN.centre.y + CAVERN.radius + 1.5 + rand() * 6; const a = rand() * 6.28; o.position.copy(onFace(y, a, 0.05)); o.scale.set(0.8 + rand() * 1.2, 0.3, 0.8 + rand() * 1.2); o.rotation.set(0, 0, 0); o.updateMatrix(); moss.setMatrixAt(i, o.matrix); } scene.add(moss);
  const mist = new THREE.MeshStandardMaterial({ color: '#9aa4a0', roughness: 1, flatShading: true });
  for (const [x, z, h, r] of [[60, -30, 78, 9], [-55, 40, 58, 12], [20, 75, 66, 8], [-70, -50, 84, 10], [85, 45, 52, 11], [-30, -85, 70, 9]]) { const m = new THREE.Mesh(lathe(y => r * (1.1 - 0.6 * Math.pow(y / h, 1.2)) + 1.5 * Math.sin(y * 0.2), h, 30, 22, rand, 0.08), mist); m.position.set(x, 0, z); scene.add(m); }
  // The roots: opaque bark with a grain, thick where they leave a plant, gnarled, draped over the
  // faces and threaded through the rock. Each has its own material so the one the stick points at can brighten.
  const barkGrain = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const streak = 0.78 + 0.22 * Math.sin(y * 0.9 + Math.sin(x * 0.35) * 2.2), n = 0.82 + rand() * 0.18, v = Math.floor(255 * Math.min(1, streak * n)); barkGrain.set([v, Math.floor(v * 0.9), Math.floor(v * 0.78), 255], (y * 64 + x) * 4); }
  const barkTex = new THREE.DataTexture(barkGrain, 64, 64); barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping; barkTex.needsUpdate = true;
  const rootMat = new THREE.MeshStandardMaterial({ color: '#8a6f4e', map: barkTex, emissive: '#c9a24a', emissiveIntensity: 0.06, roughness: 0.95 });
  const rootMats = new Map<string, THREE.MeshStandardMaterial>();
  for (const r of FLOW_ROOTS) {
    const segments = Math.ceil(r.length * 3), base = r.interior ? 0.17 : r.fine ? 0.12 : 0.2, mat = rootMat.clone(); rootMats.set(r.id, mat);
    const geo = taperedTube(r.curve, segments, 8, t => base * (0.5 + 0.5 * Math.pow(Math.abs(2 * t - 1), 1.3)), 0.22);
    const uv = geo.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * r.length / 1.6);
    scene.add(new THREE.Mesh(geo, mat));
  }
  const collars: THREE.BufferGeometry[] = [];
  for (const p of Object.values(PLANTS)) {
    const foot = p.at.clone().add(vec(0, 0.32, 0)), toMouth = p.mouth.clone().sub(p.at); toMouth.y = 0;
    const mouthAngle = Math.atan2(toMouth.z, toMouth.x);
    for (let i = 0; i < 7; i++) {
      const a = i === 0 ? mouthAngle : mouthAngle + (i / 7) * Math.PI * 2 + (rand() - 0.5) * 0.4, reach = i === 0 ? toMouth.length() : 0.55 + rand() * 0.65;
      const end = i === 0 ? p.mouth.clone() : p.at.clone().add(vec(Math.cos(a) * reach, -0.05, Math.sin(a) * reach));
      const mid = p.at.clone().add(vec(Math.cos(a) * reach * 0.45, 0.12, Math.sin(a) * reach * 0.45));
      collars.push(taperedTube(new THREE.CatmullRomCurve3([foot, mid, end]), 10, 6, t => (i === 0 ? 0.2 : 0.14) * (1 - 0.55 * t), 0.15));
    }
  }
  scene.add(new THREE.Mesh(mergeGeometries(collars)!, rootMat));
  // Motes drift along the roots while she is in the network: the flow she is riding, seen through the stone.
  const motes: { mesh: THREE.Mesh; root: Root; offset: number }[] = [];
  const moteMat = new THREE.MeshBasicMaterial({ color: '#f5ffd0' });
  for (const r of FLOW_ROOTS) for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 4), moteMat); scene.add(m); motes.push({ mesh: m, root: r, offset: i / 10 }); }
  // Her trail: flowering tufts on every cell she has walked, on whichever zone's ground it lies.
  const crossQuad = (() => { const a = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0); const b = a.clone().rotateY(Math.PI / 2); return mergeGeometries([a, b])!; })();
  const TRAIL_MAX_INSTANCES = 2400;
  const trail = new THREE.InstancedMesh(crossQuad, spriteMaterial('bloom', '#ffffff'), TRAIL_MAX_INSTANCES); trail.count = 0; trail.frustumCulled = false; scene.add(trail);
  function setTrail(p: Progress): void {
    let n = 0;
    for (const [key, level] of Object.entries(p.trail)) {
      if (level < 0.15 || n >= TRAIL_MAX_INSTANCES) continue;
      const c = cellCentre(key), zone = ZONES[c.zone]; if (!zone) continue;
      const h = mulberry32(key.length * 131 + key.charCodeAt(0) * 7 + key.charCodeAt(key.length - 1)), k = 0.22 + 0.34 * Math.min(1, level / TRAIL_MAX);
      o.position.set(c.x + (h() - 0.5) * 0.5, groundAt(zone, c.x, c.z), c.z + (h() - 0.5) * 0.5); o.rotation.set(0, h() * Math.PI, 0); o.scale.set(k, k * (0.9 + 0.5 * Math.min(1, level / TRAIL_MAX)), k); o.updateMatrix(); trail.setMatrixAt(n++, o.matrix);
    }
    trail.count = n; trail.instanceMatrix.needsUpdate = true;
  }
  /** vision 0..1 makes the limestone glassy and the roots glow; `chosen` is the root the stick points at. */
  function update(vision: number, t: number, riding: Root | null, chosen: Root | null): void {
    limestone.opacity = 1 - vision * 0.72; limestone.depthWrite = vision < 0.5; cavernStone.opacity = 1 - vision * 0.6; cavernStone.depthWrite = vision < 0.5;
    rootMat.emissiveIntensity = 0.06 + vision * 0.4;
    for (const [id, m] of rootMats) { const hot = chosen?.id === id || riding?.id === id; m.emissiveIntensity = hot ? 0.9 : 0.06 + vision * 0.4; m.emissive.set(hot ? '#ffd76a' : '#c9a24a'); }
    for (const m of motes) { m.mesh.visible = vision > 0.3; m.mesh.position.copy(m.root.curve.getPointAt((t * 0.00005 + m.offset) % 1)); }
  }
  return { colliders, update, setTrail };
}
export type KarstFlowWorld = ReturnType<typeof buildKarstFlow>;
