// The Karst as a scene: a limestone pillar that can go glassy to show its roots, a mushroom-lit
// cavern inside it, ledges with plants clinging to the faces, a forest at its foot, sister pillars in mist.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PILLAR_HEIGHT, pillarRadius, onFace, CAVERN, FLOOR_RADIUS, BEDROCK, ZONES, PLANTS, ROOTS, relief, vec, type Plant, type Root } from './karstModel';
import { decomposition, storageCap, CLOSING_DAYS, REGROWING_DAYS, type Watershed } from './watershedModel';
/** The spring at the foot (the cavern's water finding its way out) and the moss basin above it. */
export const SPRING = { x: 0, z: -15.5 }, BASIN = { x: 0, z: -20 };
export const GROVE_CENTRES = { east: { x: 15.5, z: 3.5 }, west: { x: -16, z: -2.5 } } as const;
import { mulberry32 } from './colors';
import type { Collider } from './player';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { spriteMaterial, standees, crownStandees, type Standee } from './sprites';

function lathe(radiusAt: (y: number) => number, height: number, rings: number, segments: number, rand: () => number, jitter: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= rings; i++) { const y = i / rings * height; points.push(new THREE.Vector2(radiusAt(y), y)); }
  let geo: THREE.BufferGeometry = new THREE.LatheGeometry(points, segments);
  geo = mergeVertices(geo);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); if (y < 0.2 || y > height - 0.2) continue; const r = Math.hypot(pos.getX(i), pos.getZ(i)); if (r < 0.01) continue; const k = 1 + (rand() - 0.5) * jitter; pos.setXYZ(i, pos.getX(i) * k, y + (rand() - 0.5) * 0.3, pos.getZ(i) * k); }
  geo.computeVertexNormals(); return geo;
}
/** A tube whose radius follows the curve, with a little gnarl in the walls: a root, not a pipe. */
function taperedTube(curve: THREE.Curve<THREE.Vector3>, segments: number, radial: number, radiusAt: (t: number) => number, gnarl: number): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, false), positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, P = curve.getPointAt(t), N = frames.normals[i], B = frames.binormals[i], r = radiusAt(t) * (1 + gnarl * 0.5 * Math.sin(t * 41 + i * 0.7));
    for (let j = 0; j <= radial; j++) {
      const th = j / radial * Math.PI * 2, c = Math.cos(th), s = Math.sin(th), rr = r * (1 + gnarl * 0.35 * Math.sin(th * 3 + t * 23));
      positions.push(P.x + rr * (c * N.x + s * B.x), P.y + rr * (c * N.y + s * B.y), P.z + rr * (c * N.z + s * B.z)); uvs.push(t, j / radial);
    }
  }
  for (let i = 0; i < segments; i++) for (let j = 0; j < radial; j++) { const a = i * (radial + 1) + j, b = a + radial + 1; indices.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setIndex(indices); geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.computeVertexNormals(); return geo;
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
  const earth = new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const floorGeo = new THREE.CircleGeometry(FLOOR_RADIUS + 30, 48, 0, Math.PI * 2); floorGeo.rotateX(-Math.PI / 2);
  { const pos = floorGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i))); floorGeo.computeVertexNormals(); }
  scene.add(new THREE.Mesh(floorGeo, earth));
  // Each grove's soil darkens with its own moisture: a tinted disc laid on the ground around it.
  const groveSoil = { east: new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 1, transparent: true, opacity: 0.85, depthWrite: false }), west: new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 1, transparent: true, opacity: 0.85, depthWrite: false }) };
  for (const side of ['east', 'west'] as const) { const disc = new THREE.Mesh(new THREE.CircleGeometry(10, 36), groveSoil[side]); disc.rotation.x = -Math.PI / 2; disc.position.set(GROVE_CENTRES[side].x, 0.03, GROVE_CENTRES[side].z); scene.add(disc); }
  // Below the ground: bedrock, and the pillar's foot going on down as solid rock, with the groves' roots in the soil.
  const bedrock = new THREE.Mesh(new THREE.CircleGeometry(FLOOR_RADIUS + 4, 40), new THREE.MeshBasicMaterial({ color: '#0d1513', side: THREE.DoubleSide })); bedrock.rotation.x = -Math.PI / 2; bedrock.position.y = BEDROCK - 0.2; scene.add(bedrock);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(pillarRadius(0) + 0.3, pillarRadius(0) + 0.6, -BEDROCK + 0.3, 40, 1, true), limestone); foot.position.y = (BEDROCK + 0.1) / 2; scene.add(foot);
  const spring = new THREE.Mesh(new THREE.CircleGeometry(2.4, 36), water); spring.rotation.x = -Math.PI / 2; spring.position.set(SPRING.x, 0.06, SPRING.z); scene.add(spring);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 2.6 + rand() * 0.4; const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25 + rand() * 0.25, 0), limestone); rock.position.set(SPRING.x + Math.cos(a) * r, 0.15, SPRING.z + Math.sin(a) * r); scene.add(rock); }
  const basinMoss = new THREE.MeshStandardMaterial({ color: '#7fa55e', emissive: '#22391c', emissiveIntensity: 0.35, roughness: 1 });
  const basin = new THREE.Group(); basin.position.set(BASIN.x, relief(BASIN.x, BASIN.z), BASIN.z); scene.add(basin);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 1.5, 0.3, 18, 1, true), basinMoss); dish.position.y = 0.12; basin.add(dish);
  const basinWater = new THREE.Mesh(new THREE.CircleGeometry(1.8, 24), water); basinWater.rotation.x = -Math.PI / 2; basinWater.position.y = 0.2; basin.add(basinWater);
  for (let i = 0; i < 22; i++) { const tuftm = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5), basinMoss); const a = rand() * 6.28; tuftm.position.set(Math.cos(a) * 2.05, 0.2 + rand() * 0.1, Math.sin(a) * 2.05); tuftm.scale.y = 0.6; basin.add(tuftm); }
  // Wood, leaves and roots. Leaves are crossed standees (sprites.ts), as the plateau's grass has always
  // been; roots are opaque, tapered, gnarled tubes that grow out of each plant's collar.
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 });
  const leaf = spriteMaterial('leaf', '#5f8657'), maple = spriteMaterial('leaf', '#c5763f'), needle = spriteMaterial('needle', '#3f6b4a'), fern = spriteMaterial('frond', '#8fd3b0', { emissive: '#2a6b52', emissiveIntensity: 0.5 });
  const colliders: Collider[] = [];
  // The two groves at the foot: their leaves and canopies follow the ledger.
  const groveLeaf = { east: spriteMaterial('leaf', '#7d9a4c'), west: spriteMaterial('leaf', '#c5763f') };
  const groveCrowns: Record<'east' | 'west', { mesh: THREE.Mesh; base: number }[]> = { east: [], west: [] };
  /** A tree in world space: a trunk with a few branches into a crown of leaf cards. `tilt` leans it out of the rock. */
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
  function tree(x: number, y: number, z: number, size: number, mat: THREE.Material, tilt = 0, tiltDir = 0, grove?: 'east' | 'west'): THREE.Group {
    const g = new THREE.Group(); scene.add(g); const t = buildTree(x, y, z, size, tilt, tiltDir);
    g.add(new THREE.Mesh(mergeGeometries(t.wood)!, bark)); const crown = new THREE.Mesh(standees(t.cards), mat); g.add(crown);
    if (grove) groveCrowns[grove].push({ mesh: crown, base: 1 });
    return g;
  }
  function pine(x: number, y: number, z: number, size: number): void {
    const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * size, 0.3 * size, 5 * size, 7), bark); trunk.position.y = 2.5 * size; g.add(trunk);
    const cards: Standee[] = [];
    for (const [h, ring, n, w] of [[2.1, 1.35, 9, 1.35], [2.9, 1.05, 7, 1.15], [3.7, 0.7, 6, 0.95], [4.4, 0.35, 4, 0.75]]) for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + h; cards.push({ position: new THREE.Vector3(Math.cos(a) * ring * size * (0.6 + rand() * 0.5), h * size + (rand() - 0.5) * 0.3 * size, Math.sin(a) * ring * size * (0.6 + rand() * 0.5)), yaw: a + Math.PI / 2, width: w * size * (0.85 + rand() * 0.3), height: 1.05 * size, flat: i % 3 === 0 }); }
    g.add(new THREE.Mesh(standees(cards), needle));
    colliders.push({ x, z, radius: 0.35 * size, minY: y - 0.2, maxY: y + 4 * size });
  }
  const plantMeshes = new Map<string, THREE.Group>();
  for (const p of Object.values(PLANTS)) {
    let g: THREE.Group;
    if (p.kind === 'pine') { pine(p.at.x, p.at.y, p.at.z, 1.1); g = new THREE.Group(); g.position.copy(p.at); scene.add(g); }
    else if (p.kind === 'fern') { g = new THREE.Group(); scene.add(g); const fronds: Standee[] = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; fronds.push({ position: p.at.clone().add(vec(Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25)), yaw: a, width: 0.9 + rand() * 0.3, height: 1.0 + rand() * 0.3 }); } g.add(new THREE.Mesh(standees(fronds), fern)); }
    else if (p.kind === 'shrub' || p.kind === 'fig') {
      // Clinging to the face: a short trunk leaning out from the rock, crown hanging over the ledge.
      const away = Math.atan2(p.at.z, p.at.x); g = tree(p.at.x, p.at.y, p.at.z, p.kind === 'fig' ? 0.75 : 0.55, p.kind === 'fig' ? maple : leaf, 0.55, away + Math.PI / 2);
      colliders.push({ x: p.at.x, z: p.at.z, radius: 0.3, minY: p.at.y - 0.2, maxY: p.at.y + 2.5 });
    } else { const side = p.kind === 'oak' ? 'east' : 'west'; g = tree(p.at.x, p.at.y, p.at.z, p.kind === 'oak' ? 1.5 : 1.3, groveLeaf[side], 0, 0, side); colliders.push({ x: p.at.x, z: p.at.z, radius: 0.55, minY: -0.2, maxY: 6 }); }
    plantMeshes.set(p.id, g);
  }
  // The wild forest: trunks and crowns merged by material, one mesh each.
  const wildWood: THREE.BufferGeometry[] = [], wildCards: Record<'leaf' | 'maple', Standee[]> = { leaf: [], maple: [] };
  for (let i = 0; i < 90; i++) {
    const a = rand() * 6.28, r = pillarRadius(0) + 4 + rand() * (FLOOR_RADIUS + 20); const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.hypot(x - 15.5, z - 3.5) < 4 || Math.hypot(x + 16, z + 2.5) < 4 || Math.hypot(x - SPRING.x, z - SPRING.z) < 4.5 || Math.hypot(x - BASIN.x, z - BASIN.z) < 3.5) continue;
    const grove = Math.hypot(x - GROVE_CENTRES.east.x, z - GROVE_CENTRES.east.z) < 9 ? 'east' : Math.hypot(x - GROVE_CENTRES.west.x, z - GROVE_CENTRES.west.z) < 9 ? 'west' : undefined;
    const size = 0.7 + rand() * 0.7;
    if (grove) tree(x, relief(x, z), z, size, groveLeaf[grove], 0, 0, grove);
    else { const t = buildTree(x, relief(x, z), z, size); wildWood.push(...t.wood); wildCards[rand() < 0.2 ? 'maple' : 'leaf'].push(...t.cards); }
    if (r < FLOOR_RADIUS) colliders.push({ x, z, radius: 0.45, minY: -0.2, maxY: 6 });
  }
  scene.add(new THREE.Mesh(mergeGeometries(wildWood)!, bark), new THREE.Mesh(standees(wildCards.leaf), leaf), new THREE.Mesh(standees(wildCards.maple), maple));
  // Grass on the forest floor and the summit: the plateau's crossed blade tufts.
  const grassMat = spriteMaterial('grass', '#9fc06a');
  const floorGrass: Standee[] = [], summitTufts: Standee[] = [];
  for (let i = 0; i < 380; i++) { const a = rand() * 6.28, r = pillarRadius(0) + 1 + rand() * (FLOOR_RADIUS - pillarRadius(0)); const x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x - SPRING.x, z - SPRING.z) < 3 || Math.hypot(x - BASIN.x, z - BASIN.z) < 2.6) continue; const k = 0.35 + rand() * 0.35; floorGrass.push({ position: vec(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  for (let i = 0; i < 110; i++) { const a = rand() * 6.28, r = rand() * 3.5, k = 0.18 + rand() * 0.2; summitTufts.push({ position: vec(Math.cos(a) * r, PILLAR_HEIGHT + 0.02, Math.sin(a) * r), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(floorGrass), grassMat), new THREE.Mesh(standees(summitTufts), grassMat));
  // Under the groves: their own roots in the soil, seen when sunk; and litter mushrooms when damp.
  const soilRootMat = new THREE.MeshStandardMaterial({ color: '#7d6848', emissive: '#c9a24a', emissiveIntensity: 0.22, roughness: 0.95 });
  for (const side of ['east', 'west'] as const) for (let i = 0; i < 8; i++) {
    const c = GROVE_CENTRES[side], a = i / 8 * Math.PI * 2, len = 3 + rand() * 4;
    const curve = new THREE.CatmullRomCurve3([vec(c.x, 0.05, c.z), vec(c.x + Math.cos(a) * 0.8, -0.5, c.z + Math.sin(a) * 0.8), vec(c.x + Math.cos(a + 0.1) * len * 0.5, -1.4 - rand() * 0.6, c.z + Math.sin(a + 0.1) * len * 0.5), vec(c.x + Math.cos(a) * len, -2.6 - rand() * 1.2, c.z + Math.sin(a) * len)]);
    scene.add(new THREE.Mesh(taperedTube(curve, 24, 6, t => 0.13 * (1 - 0.75 * t), 0.25), soilRootMat));
  }
  const litterCap = new THREE.MeshStandardMaterial({ color: '#d9c39a', emissive: '#4a3b22', emissiveIntensity: 0.3, roughness: 0.8 });
  const litter: Record<'east' | 'west', THREE.InstancedMesh> = { east: new THREE.InstancedMesh(new THREE.ConeGeometry(0.14, 0.17, 6), litterCap, 16), west: new THREE.InstancedMesh(new THREE.ConeGeometry(0.14, 0.17, 6), litterCap, 16) };
  const litterSpots: Record<'east' | 'west', THREE.Vector3[]> = { east: [], west: [] };
  const o = new THREE.Object3D();
  for (const side of ['east', 'west'] as const) { for (let i = 0; i < 16; i++) { const a = rand() * 6.28, r = 1.5 + rand() * 5, x = GROVE_CENTRES[side].x + Math.cos(a) * r, z = GROVE_CENTRES[side].z + Math.sin(a) * r; litterSpots[side].push(vec(x, relief(x, z) + 0.1, z)); } litter[side].count = 0; scene.add(litter[side]); }
  const drops = 300, rainGeo = new THREE.BufferGeometry(), rainPos = new Float32Array(drops * 6);
  for (let i = 0; i < drops; i++) { const x = (rand() - 0.5) * 18, y = rand() * 10, z = (rand() - 0.5) * 18; rainPos.set([x, y, z, x, y - 0.4, z], i * 6); }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#dbe9ec', transparent: true, opacity: 0.5 })); rain.visible = false; scene.add(rain);
  // Plants that adhere to the rock: leafy tufts growing straight out of the faces, moss where it is damp.
  const tufts: Standee[] = [];
  for (let i = 0; i < 170; i++) { const y = 2 + rand() * (PILLAR_HEIGHT - 4), a = rand() * 6.28, k = 0.55 + rand() * 0.7; tufts.push({ position: onFace(y, a, 0.02), yaw: rand() * Math.PI, width: k, height: k * (0.7 + rand() * 0.5), up: new THREE.Vector3(Math.cos(a), 0.35, Math.sin(a)), flat: i % 2 === 0 }); }
  scene.add(new THREE.Mesh(standees(tufts), leaf));
  const mossMat = new THREE.MeshStandardMaterial({ color: '#6f9450', roughness: 1, flatShading: true });
  const moss = new THREE.InstancedMesh(new THREE.SphereGeometry(0.5, 6, 4), mossMat, 120);
  // Moss keeps clear of the cavern's band so no blob pokes through its wall from outside.
  for (let i = 0; i < 120; i++) { let y = 4 + rand() * (PILLAR_HEIGHT - 8); if (Math.abs(y - CAVERN.centre.y) < CAVERN.radius + 1.5) y = y < CAVERN.centre.y ? CAVERN.centre.y - CAVERN.radius - 1.5 - rand() * 6 : CAVERN.centre.y + CAVERN.radius + 1.5 + rand() * 6; const a = rand() * 6.28; const p = onFace(y, a, 0.05); o.position.copy(p); o.scale.set(0.8 + rand() * 1.2, 0.3, 0.8 + rand() * 1.2); o.rotation.set(0, 0, 0); o.updateMatrix(); moss.setMatrixAt(i, o.matrix); } scene.add(moss);
  // Sister pillars in the mist, never walked.
  const mist = new THREE.MeshStandardMaterial({ color: '#9aa4a0', roughness: 1, flatShading: true });
  for (const [x, z, h, r] of [[60, -30, 78, 9], [-55, 40, 58, 12], [20, 75, 66, 8], [-70, -50, 84, 10], [85, 45, 52, 11], [-30, -85, 70, 9]]) { const m = new THREE.Mesh(lathe(y => r * (1.1 - 0.6 * Math.pow(y / h, 1.2)) + 1.5 * Math.sin(y * 0.2), h, 30, 22, rand, 0.08), mist); m.position.set(x, 0, z); scene.add(m); }
  // The roots: opaque bark, thick where they leave a plant and thinner between, gnarled, draped over
  // the faces and threaded through the rock. In root vision they glow gold from within rather than
  // going glassy; the stone does that. Each has a ride tube seen only from inside.
  const barkGrain = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const streak = 0.78 + 0.22 * Math.sin(y * 0.9 + Math.sin(x * 0.35) * 2.2), n = 0.82 + rand() * 0.18, v = Math.floor(255 * Math.min(1, streak * n)); barkGrain.set([v, Math.floor(v * 0.9), Math.floor(v * 0.78), 255], (y * 64 + x) * 4); }
  const barkTex = new THREE.DataTexture(barkGrain, 64, 64); barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping; barkTex.needsUpdate = true;
  const rootMat = new THREE.MeshStandardMaterial({ color: '#8a6f4e', map: barkTex, emissive: '#c9a24a', emissiveIntensity: 0.06, roughness: 0.95 });
  // The inside of a root: rings of lighter fibre along its length, so the ride's speed can be read on the walls.
  const fibre = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const band = 0.55 + 0.45 * Math.max(0, Math.sin(x / 64 * Math.PI * 2 * 3)) ** 3, n = 0.85 + rand() * 0.15, v = Math.floor(255 * Math.min(1, band * n)); fibre.set([v, Math.floor(v * 0.86), Math.floor(v * 0.55), 255], (y * 64 + x) * 4); }
  const fibreTex = new THREE.DataTexture(fibre, 64, 64); fibreTex.wrapS = fibreTex.wrapT = THREE.RepeatWrapping; fibreTex.needsUpdate = true;
  const insideMat = new THREE.MeshStandardMaterial({ color: '#b08a4a', emissive: '#a67a28', emissiveIntensity: 0.28, roughness: 0.85, side: THREE.BackSide, transparent: true, opacity: 0.94, map: fibreTex, emissiveMap: fibreTex });
  const rootMeshes = new Map<string, THREE.Mesh>(), rideTubes = new Map<string, THREE.Mesh>(), fineMats = new Map<string, THREE.MeshStandardMaterial>();
  for (const r of ROOTS) {
    const segments = Math.ceil(r.length * 3);
    const mat = r.fine ? new THREE.MeshStandardMaterial({ color: '#7f8a5a', map: barkTex, emissive: '#b8c96a', emissiveIntensity: 0.06, roughness: 0.95 }) : rootMat; if (r.fine) fineMats.set(r.id, mat);
    const base = r.interior ? 0.17 : r.fine ? 0.11 : 0.2;
    const geo = taperedTube(r.curve, segments, 8, t => base * (0.5 + 0.5 * Math.pow(Math.abs(2 * t - 1), 1.3)), 0.22);
    const uv = geo.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * r.length / 1.6);
    const mesh = new THREE.Mesh(geo, mat); scene.add(mesh); rootMeshes.set(r.id, mesh);
    const tubeGeo = new THREE.TubeGeometry(r.curve, segments * 2, 0.42, 16, false); const tuv = tubeGeo.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < tuv.count; i++) tuv.setX(i, tuv.getX(i) * r.length / 1.4);
    const tube = new THREE.Mesh(tubeGeo, insideMat); tube.visible = false; scene.add(tube); rideTubes.set(r.id, tube);
  }
  // Root collars: at every plant, buttress roots leave the trunk's foot into the ground, and one of them
  // is the mouth the main roots grow from, so a root is part of its plant and not a pipe laid beside it.
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
  const haloMat = new THREE.MeshBasicMaterial({ color: '#f1dc9e', transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
  const halos = new Map<string, THREE.Mesh>();
  for (const p of Object.values(PLANTS)) { const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.55, 30), haloMat); ring.rotation.x = -Math.PI / 2; ring.position.copy(p.mouth).add(vec(0, 0.03, 0)); scene.add(ring); halos.set(p.id, ring); }
  const motes: { mesh: THREE.Mesh; root: Root; offset: number }[] = [];
  const moteMat = new THREE.MeshBasicMaterial({ color: '#f5ffd0' });
  for (const r of ROOTS) for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 4), moteMat); scene.add(m); motes.push({ mesh: m, root: r, offset: i / 10 }); }
  const wetSoil = new THREE.Color('#42603b'), drySoil = new THREE.Color('#8f865a'), greenOak = new THREE.Color('#7d9a4c'), greenMaple = new THREE.Color('#c5763f'), dryLeaf = new THREE.Color('#a17f47'), tmp = new THREE.Color();
  const finePresence = (w: Watershed): number => w.shortcut === 'open' ? 1 : w.shortcut === 'closed' ? 0.12 : w.shortcut === 'closing' ? Math.max(0.12, 1 - w.phaseDays / CLOSING_DAYS * 0.88) : Math.min(1, 0.12 + w.phaseDays / REGROWING_DAYS * 0.88);
  /** vision 0..1 makes the limestone glassy; under 0..1 thins the forest floor for the soil beneath;
   * riding names the root whose inside is shown; the ledger drives the groves, the spring and the fine roots. */
  function update(vision: number, t: number, riding: Root | null, eye: THREE.Vector3, w: Watershed, under: number, raining: boolean, tended: boolean, dt: number): void {
    limestone.opacity = 1 - vision * 0.7; limestone.depthWrite = vision < 0.5; cavernStone.opacity = 1 - vision * 0.6; cavernStone.depthWrite = vision < 0.5;
    earth.opacity = 1 - under * 0.84; earth.depthWrite = under < 0.5; for (const m of Object.values(groveSoil)) m.opacity = 0.85 * (1 - under);
    rootMat.emissiveIntensity = 0.06 + vision * 0.45; soilRootMat.emissiveIntensity = 0.22 + vision * 0.4;
    for (const side of ['east', 'west'] as const) {
      const g = w[side]; groveSoil[side].color.copy(tmp.copy(drySoil).lerp(wetSoil, g.moisture));
      groveLeaf[side].color.copy(tmp.copy(dryLeaf).lerp(side === 'east' ? greenOak : greenMaple, g.canopy));
      for (const c of groveCrowns[side]) c.mesh.scale.y = c.base * (0.45 + 0.55 * g.canopy);
      const count = Math.round(decomposition(g) * 16); litter[side].count = count;
      for (let i = 0; i < count; i++) { o.position.copy(litterSpots[side][i]); o.scale.setScalar(0.8 + (i % 3) * 0.2); o.rotation.set(0, 0, 0); o.updateMatrix(); litter[side].setMatrixAt(i, o.matrix); } litter[side].instanceMatrix.needsUpdate = true;
    }
    const fill = w.storage / storageCap(w); spring.scale.setScalar(0.45 + 0.55 * fill); basin.visible = w.basin; basinWater.visible = fill > 0.05; basinWater.scale.setScalar(0.6 + 0.4 * fill);
    rain.visible = raining && under < 0.5 && !riding;
    if (rain.visible) { rain.position.set(eye.x, eye.y - 2, eye.z); const p = rainGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < drops; i++) { let y = p.getY(i * 2) - 10 * dt; if (y < 0) y += 10; p.setY(i * 2, y); p.setY(i * 2 + 1, y - 0.4); } p.needsUpdate = true; }
    const presence = finePresence(w);
    for (const [id, m] of fineMats) { const r = ROOTS.find(r => r.id === id)!; const dormant = r.dormant && !tended; m.color.set(dormant ? '#4e4a42' : presence < 0.5 ? '#5e5648' : '#7f8a5a'); m.emissiveIntensity = dormant || presence < 0.5 ? 0.0 : 0.06 + vision * 0.5 * presence; }
    for (const [id, tube] of rideTubes) tube.visible = riding?.id === id;
    for (const m of motes) { const r = m.root; const on = !(r.dormant && !tended) && !(r.fine && presence < 0.5); m.mesh.visible = on && (vision > 0.3 || riding === r); m.mesh.position.copy(r.curve.getPointAt((t * 0.00005 + m.offset) % 1)); }
    for (const [, ring] of halos) { ring.visible = eye.distanceTo(ring.position) > 1.2; ring.scale.setScalar(1 + Math.sin(t * 0.002) * 0.1); }
  }
  return { colliders, update, plantMeshes, rootMeshes };
}
export type KarstWorld = ReturnType<typeof buildKarst>;
export const plantsOf = (zone: string): Plant[] => Object.values(PLANTS).filter(p => p.zone === zone);
