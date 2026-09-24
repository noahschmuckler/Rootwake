// The Karst range as a scene: the pillar she wakes on with its cavern, two climbable sisters with
// helices of ledges, four more in the mist, a dense forest at the foot joined by a root network in
// glassy-able soil, every tree built from the model's nodes, the long roots with motes, her trail
// and her other shapes (the leaf figure at a crown; the bulge and the knot come from the character).
import * as THREE from 'three';
import { mergeVertices, mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CAVERN, ZONES, NODES, PILLARS, FLOW_ROOTS, LONG_ROOTS, HELIX, LEDGE_RADIUS, LEDGE_OUT, FOREST_RADIUS, relief, vec, groundAt, cellCentre, nodeFrame, onPillar, pillarById, TRAIL_MAX, type Progress, type Root, type Node, type Pillar } from './karstFlowModel';
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
export function buildKarstFlow(scene: THREE.Scene, options: { sharedGround?: boolean } = {}) {
  const rand = mulberry32(310926);
  // Two-sided: while she rides through the rock the camera is inside it, and glassy walls should still be there.
  const limestone = new THREE.MeshStandardMaterial({ color: '#b9b3a2', roughness: 0.95, flatShading: true, transparent: true, opacity: 1, side: THREE.DoubleSide });
  const mist = new THREE.MeshStandardMaterial({ color: '#9aa4a0', roughness: 1, flatShading: true });
  const leaf = spriteMaterial('leaf', '#5f8657'), maple = spriteMaterial('leaf', '#c5763f'), oak = spriteMaterial('leaf', '#7d9a4c'), needle = spriteMaterial('needle', '#3f6b4a'), fern = spriteMaterial('frond', '#8fd3b0', { emissive: '#2a6b52', emissiveIntensity: 0.5 });
  const grassMat = spriteMaterial('grass', '#9fc06a'), mossMat = new THREE.MeshStandardMaterial({ color: '#6f9450', roughness: 1, flatShading: true });
  const o = new THREE.Object3D();
  for (const p of PILLARS) {
    const g = new THREE.Group(); g.position.set(p.x, 0, p.z); scene.add(g);
    const body = new THREE.Mesh(lathe(p.radius, p.height, p.climbable ? 64 : 30, p.climbable ? 40 : 22, rand, p.id === 'main' ? 0.06 : 0.08), p.climbable ? limestone : mist); g.add(body);
    if (!p.climbable) continue;
    const cap = new THREE.Mesh(new THREE.CircleGeometry(p.radius(p.height) + 0.2, 40), limestone); cap.rotation.x = -Math.PI / 2; cap.position.y = p.height; g.add(cap);
    // Plants that adhere to the rock: leafy tufts out of the faces, moss, and blade tufts on the top.
    const tufts: Standee[] = [], top: Standee[] = [], n = Math.round(p.height * 2.6);
    for (let i = 0; i < n; i++) { const y = 2 + rand() * (p.height - 4), a = rand() * 6.28, k = 0.55 + rand() * 0.7; tufts.push({ position: onPillar(p, y, a, 0.02), yaw: rand() * Math.PI, width: k, height: k * (0.7 + rand() * 0.5), up: new THREE.Vector3(Math.cos(a), 0.35, Math.sin(a)), flat: i % 2 === 0 }); }
    for (let i = 0; i < 110; i++) { const a = rand() * 6.28, r = rand() * (p.radius(p.height) - 0.4), k = 0.18 + rand() * 0.2; top.push({ position: vec(p.x + Math.cos(a) * r, p.height + 0.02, p.z + Math.sin(a) * r), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
    scene.add(new THREE.Mesh(standees(tufts), leaf), new THREE.Mesh(standees(top), grassMat));
    const moss = new THREE.InstancedMesh(new THREE.SphereGeometry(0.5, 6, 4), mossMat, 120);
    for (let i = 0; i < 120; i++) { let y = 4 + rand() * (p.height - 8); if (p.id === 'main' && Math.abs(y - CAVERN.centre.y) < CAVERN.radius + 1.5) y = y < CAVERN.centre.y ? CAVERN.centre.y - CAVERN.radius - 1.5 - rand() * 6 : CAVERN.centre.y + CAVERN.radius + 1.5 + rand() * 6; const a = rand() * 6.28; o.position.copy(onPillar(p, y, a, 0.05)); o.scale.set(0.8 + rand() * 1.2, 0.3, 0.8 + rand() * 1.2); o.rotation.set(0, 0, 0); o.updateMatrix(); moss.setMatrixAt(i, o.matrix); } scene.add(moss);
  }
  // The cavern inside the main pillar: seen only from within, its pool, and its luminescent mushrooms.
  const cavernStone = new THREE.MeshStandardMaterial({ color: '#5c6663', roughness: 1, flatShading: true, side: THREE.BackSide, transparent: true, opacity: 1 });
  let cavernGeo: THREE.BufferGeometry = mergeVertices(new THREE.SphereGeometry(CAVERN.radius, 28, 18));
  { const pos = cavernGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) { const k = 1 + (rand() - 0.5) * 0.12; pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k, pos.getZ(i) * k); } cavernGeo.computeVertexNormals(); }
  const cavern = new THREE.Mesh(cavernGeo, cavernStone); cavern.position.copy(CAVERN.centre); scene.add(cavern);
  const cavernFloor = new THREE.Mesh(new THREE.CircleGeometry(ZONES.cavern.radius + 0.6, 36), new THREE.MeshStandardMaterial({ color: '#4d5a56', roughness: 1 })); cavernFloor.rotation.x = -Math.PI / 2; cavernFloor.position.y = CAVERN.floorY; scene.add(cavernFloor);
  const water = new THREE.MeshStandardMaterial({ color: '#4fa3b4', emissive: '#1f6b78', emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(CAVERN.poolRadius, 32), water); pool.rotation.x = -Math.PI / 2; pool.position.y = CAVERN.floorY + 0.03; scene.add(pool);
  const glow = new THREE.MeshStandardMaterial({ color: '#9ff2e0', emissive: '#4ef0c8', emissiveIntensity: 1.6, roughness: 0.6 }), stem = new THREE.MeshStandardMaterial({ color: '#d8e6dd', roughness: 0.9 });
  const mushrooms = new THREE.Group(); scene.add(mushrooms);
  for (const c of [vec(-3.2, CAVERN.floorY, 2.4), vec(2.6, CAVERN.floorY, -3.4), vec(-2.2, CAVERN.floorY, -3.1), vec(4.2, CAVERN.floorY, -0.8), vec(-4.6, CAVERN.floorY + 1.8, -0.6), vec(0.8, CAVERN.floorY + 3.2, 4.9), vec(-1.5, CAVERN.floorY + 4.6, -4.2)]) {
    for (let i = 0; i < 6; i++) { const a = rand() * 6.28, r = rand() * 0.7, h = 0.15 + rand() * 0.35; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, h, 5), stem); st.position.set(c.x + Math.cos(a) * r, c.y + h / 2, c.z + Math.sin(a) * r); mushrooms.add(st); const capm = new THREE.Mesh(new THREE.SphereGeometry(0.09 + rand() * 0.1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), glow); capm.position.set(st.position.x, c.y + h, st.position.z); mushrooms.add(capm); }
    const light = new THREE.PointLight('#5ef0cf', 32, 14, 1.5); light.position.copy(c).add(vec(0, 0.6, 0)); mushrooms.add(light);
  }
  // Ledges: shelves of the same limestone, on the main pillar's faces and up the sisters' helices.
  for (const z of Object.values(ZONES)) { if (!/^(east|west|south|ledge)/.test(z.id)) continue; const shelf = new THREE.Mesh(new THREE.CylinderGeometry(z.radius + 0.6, z.radius + 1.1, 0.9, 14), limestone); shelf.position.set(z.x, z.y - 0.45, z.z); const p = pillarById(z.pillar), toward = Math.atan2(z.z - p.z, z.x - p.x); shelf.rotation.y = -toward; shelf.scale.z = 0.85; scene.add(shelf); }
  // The forest floor out to the mist, which thins to glass while she is in the roots beneath it.
  const earth = new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const floorGeo = new THREE.CircleGeometry(FOREST_RADIUS + 30, 64); floorGeo.rotateX(-Math.PI / 2);
  { const pos = floorGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i))); floorGeo.computeVertexNormals(); }
  if (!options.sharedGround) scene.add(new THREE.Mesh(floorGeo, earth)); else floorGeo.dispose();
  const bedrock = new THREE.Mesh(new THREE.CircleGeometry(FOREST_RADIUS + 30, 48), new THREE.MeshBasicMaterial({ color: '#0d1513', side: THREE.DoubleSide })); bedrock.rotation.x = -Math.PI / 2; bedrock.position.y = -4; if (!options.sharedGround) scene.add(bedrock); else { bedrock.geometry.dispose(); (bedrock.material as THREE.Material).dispose(); }
  // Every tree from the model's nodes: wood merged into one mesh, crowns merged per leaf material.
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 });
  const wood: THREE.BufferGeometry[] = [], cards: Record<Node['leaf'], Standee[]> = { leaf: [], maple: [], oak: [], needle: [], frond: [] };
  const colliders: Collider[] = [];
  function tree(n: Node): void {
    const frame = nodeFrame(n), size = n.size;
    const trunk = new THREE.CylinderGeometry(0.15 * size, 0.42 * size, 3.2 * size, 8); trunk.translate(0, 1.6 * size, 0); wood.push(trunk.applyMatrix4(frame));
    for (let j = 0; j < 3; j++) { const yaw = j / 3 * Math.PI * 2 + rand(), branch = new THREE.CylinderGeometry(0.05 * size, 0.11 * size, 1.7 * size, 6); branch.translate(0, 0.85 * size, 0).rotateX(0.75).rotateY(yaw).translate(0, (2.4 + rand() * 0.5) * size, 0); wood.push(branch.applyMatrix4(frame)); }
    const crown = crownStandees(rand, new THREE.Vector3(0, 3.5 * size, 0), 1.7 * size, 1.2 * size, 1.7 * size, 9, 1.4 * size); for (const c of crown) c.position.applyMatrix4(frame); cards[n.leaf].push(...crown);
  }
  function pine(n: Node): void {
    const size = n.size, trunk = new THREE.CylinderGeometry(0.1 * size, 0.3 * size, 5 * size, 7); trunk.translate(n.at.x, n.at.y + 2.5 * size, n.at.z); wood.push(trunk);
    for (const [h, ring, count, w] of [[2.1, 1.35, 9, 1.35], [2.9, 1.05, 7, 1.15], [3.7, 0.7, 6, 0.95], [4.4, 0.35, 4, 0.75]]) for (let i = 0; i < count; i++) { const a = i / count * Math.PI * 2 + h; cards.needle.push({ position: vec(n.at.x + Math.cos(a) * ring * size * (0.6 + rand() * 0.5), n.at.y + h * size + (rand() - 0.5) * 0.3 * size, n.at.z + Math.sin(a) * ring * size * (0.6 + rand() * 0.5)), yaw: a + Math.PI / 2, width: w * size * (0.85 + rand() * 0.3), height: 1.05 * size, flat: i % 3 === 0 }); }
  }
  for (const n of Object.values(NODES)) {
    if (n.kind === 'pine') pine(n);
    else if (n.kind === 'fern') { for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; cards.frond.push({ position: n.at.clone().add(vec(Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25)), yaw: a, width: 0.9 + rand() * 0.3, height: 1.0 + rand() * 0.3 }); } }
    else tree(n);
    colliders.push({ x: n.at.x, z: n.at.z, radius: n.trunk, minY: n.at.y - 0.2, maxY: n.at.y + (n.kind === 'fern' ? 1.2 : n.crownH) });
  }
  scene.add(new THREE.Mesh(mergeGeometries(wood)!, bark));
  for (const [kind, mat] of [['leaf', leaf], ['maple', maple], ['oak', oak], ['needle', needle], ['frond', fern]] as const) if (cards[kind].length) scene.add(new THREE.Mesh(standees(cards[kind]), mat));
  // Grass on the forest floor.
  const floorGrass: Standee[] = [];
  for (let i = 0; i < 900; i++) { const a = rand() * 6.28, r = Math.sqrt(rand()) * FOREST_RADIUS; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (PILLARS.some(p => Math.hypot(x - p.x, z - p.z) < p.radius(0) + 0.5)) continue; const k = 0.35 + rand() * 0.35; floorGrass.push({ position: vec(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(floorGrass), grassMat));
  // The roots: opaque bark with a grain, thick where they leave a tree, gnarled: the karst's, the sisters' and the
  // forest's network, all in one mesh, with a colour per vertex so the one the stick points at can brighten.
  const barkGrain = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const streak = 0.78 + 0.22 * Math.sin(y * 0.9 + Math.sin(x * 0.35) * 2.2), n = 0.82 + rand() * 0.18, v = Math.floor(255 * Math.min(1, streak * n)); barkGrain.set([v, Math.floor(v * 0.9), Math.floor(v * 0.78), 255], (y * 64 + x) * 4); }
  const barkTex = new THREE.DataTexture(barkGrain, 64, 64); barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping; barkTex.needsUpdate = true;
  const rootMat = new THREE.MeshStandardMaterial({ color: '#8a6f4e', map: barkTex, emissive: '#c9a24a', emissiveIntensity: 0.06, roughness: 0.95, vertexColors: true });
  const rootGeos: THREE.BufferGeometry[] = [], ranges = new Map<string, [number, number]>(); let vertexCount = 0;
  for (const r of FLOW_ROOTS) {
    const long = LONG_ROOTS.includes(r), segments = Math.ceil(r.length * (long ? 3 : 2)), base = r.interior ? 0.17 : long ? 0.2 : 0.14;
    const geo = taperedTube(r.curve, segments, long ? 8 : 6, t => base * (0.5 + 0.5 * Math.pow(Math.abs(2 * t - 1), 1.3)), 0.22);
    const uv = geo.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * r.length / 1.6);
    const count = geo.attributes.position.count; geo.setAttribute('color', new THREE.Float32BufferAttribute(new Array(count * 3).fill(1), 3));
    ranges.set(r.id, [vertexCount, vertexCount + count]); vertexCount += count; rootGeos.push(geo);
  }
  const rootMesh = new THREE.Mesh(mergeGeometries(rootGeos)!, rootMat); rootMesh.frustumCulled = false; scene.add(rootMesh);
  const rootColour = rootMesh.geometry.attributes.color as THREE.BufferAttribute; let hot: string | null = null;
  function paint(id: string, r: number, g: number, b: number): void { const range = ranges.get(id); if (!range) return; for (let i = range[0]; i < range[1]; i++) rootColour.setXYZ(i, r, g, b); rootColour.needsUpdate = true; }
  // Root collars: at every tree, buttress rootlets leave the trunk's foot into the ground, one of them the mouth.
  const collars: THREE.BufferGeometry[] = [];
  for (const n of Object.values(NODES)) {
    const foot = n.at.clone().add(vec(0, 0.32 * Math.min(1, n.size), 0)), toMouth = n.mouth.clone().sub(n.at); toMouth.y = 0;
    const mouthAngle = Math.atan2(toMouth.z, toMouth.x), count = n.zone === 'floor' && n.id.startsWith('t') ? 4 : 7;
    for (let i = 0; i < count; i++) {
      const a = i === 0 ? mouthAngle : mouthAngle + (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.4, reach = i === 0 ? toMouth.length() : 0.45 + rand() * 0.55;
      const end = i === 0 ? n.mouth.clone() : n.at.clone().add(vec(Math.cos(a) * reach, -0.05, Math.sin(a) * reach));
      const mid = n.at.clone().add(vec(Math.cos(a) * reach * 0.45, 0.12, Math.sin(a) * reach * 0.45));
      collars.push(taperedTube(new THREE.CatmullRomCurve3([foot, mid, end]), 6, 5, t => (i === 0 ? 0.16 : 0.11) * Math.min(1.3, n.size) * (1 - 0.55 * t), 0.15));
    }
  }
  const collarMat = new THREE.MeshStandardMaterial({ color: '#8a6f4e', map: barkTex, emissive: '#c9a24a', emissiveIntensity: 0.06, roughness: 0.95 });
  scene.add(new THREE.Mesh(mergeGeometries(collars)!, collarMat));
  // Motes drift along the long roots while she is in the network: the flow she is riding, seen through the stone.
  const motes: { root: Root; offset: number }[] = [];
  for (const r of LONG_ROOTS) for (let i = 0; i < 10; i++) motes.push({ root: r, offset: i / 10 });
  const moteMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 5, 4), new THREE.MeshBasicMaterial({ color: '#f5ffd0' }), motes.length); moteMesh.frustumCulled = false; scene.add(moteMesh);
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
  // Her shape at a crown: a figure of leaves (the bulge and the knot are the character's wooden forms).
  const figureMat = spriteMaterial('leaf', '#b9e58a', { emissive: '#4a7a2a', emissiveIntensity: 0.35 });
  const figure = new THREE.Group(); figure.visible = false; scene.add(figure);
  { const fr = mulberry32(77); const body = crownStandees(fr, new THREE.Vector3(0, 0.95, 0), 0.42, 0.55, 0.3, 9, 0.5); body.push({ position: new THREE.Vector3(0, 1.35, 0), yaw: 0.4, width: 0.42, height: 0.42, flat: true }); figure.add(new THREE.Mesh(standees(body), figureMat)); }
  const mass = new THREE.Group(); mass.visible = false; scene.add(mass);
  /** vision 0..1 makes the limestone and the soil glassy and the roots glow; `chosen` is the root the stick points at; `riding` the one she is in. */
  function update(vision: number, t: number, riding: Root | null, chosen: Root | null): void {
    limestone.opacity = 1 - vision * 0.72; limestone.depthWrite = vision < 0.5; cavernStone.opacity = 1 - vision * 0.6; cavernStone.depthWrite = vision < 0.5;
    earth.opacity = 1 - vision * 0.8; earth.depthWrite = vision < 0.5;
    rootMat.emissiveIntensity = collarMat.emissiveIntensity = 0.06 + vision * 0.4;
    const want = chosen?.id ?? riding?.id ?? null;
    if (want !== hot) { if (hot) paint(hot, 1, 1, 1); if (want) paint(want, 2.2, 1.9, 1.1); hot = want; }
    moteMesh.visible = vision > 0.3;
    if (moteMesh.visible) { for (let i = 0; i < motes.length; i++) { const m = motes[i]; o.position.copy(m.root.curve.getPointAt((t * 0.00005 + m.offset) % 1)); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); moteMesh.setMatrixAt(i, o.matrix); } moteMesh.instanceMatrix.needsUpdate = true; }
  }
  return { colliders, update, setTrail, figure, mass };
}
export type KarstFlowWorld = ReturnType<typeof buildKarstFlow>;
export { HELIX, LEDGE_RADIUS, LEDGE_OUT };
export type { Pillar };
