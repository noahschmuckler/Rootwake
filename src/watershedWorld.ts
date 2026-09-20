// The authored valley of The Breathing Watershed: what the ledger looks like from inside.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDGES, NODES, groundHeight, onValley, isPassable, decomposition, storageCap, CLOSING_DAYS, REGROWING_DAYS, vec, type Watershed, type NodeId } from './watershedModel';
import { mulberry32 } from './colors';
export const GROVES = { west: { x: -9, z: 4 }, east: { x: 9, z: 4 } } as const;
export function buildWatershed(scene: THREE.Scene) {
  const rand = mulberry32(300926), surface = new THREE.Group(), roots = new THREE.Group(); scene.add(surface, roots);
  const grain = new Uint8Array(64 * 64 * 4); for (let i = 0; i < 4096; i++) { const n = 130 + Math.floor(rand() * 125); grain.set([n, n, n, 255], i * 4); }
  const texture = new THREE.DataTexture(grain, 64, 64); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(12, 12); texture.needsUpdate = true;
  // One ground per grove so each side's soil can darken with its own moisture.
  const soils = { west: new THREE.MeshStandardMaterial({ color: '#5c7350', roughness: 1, side: THREE.DoubleSide, transparent: true, map: texture }), east: new THREE.MeshStandardMaterial({ color: '#5c7350', roughness: 1, side: THREE.DoubleSide, transparent: true, map: texture }) };
  for (const side of ['west', 'east'] as const) { const geo = new THREE.PlaneGeometry(20, 30, 22, 32); geo.rotateX(-Math.PI / 2); const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) { pos.setX(i, pos.getX(i) + (side === 'west' ? -10 : 10)); pos.setY(i, groundHeight(pos.getX(i), pos.getZ(i))); } geo.computeVertexNormals(); scene.add(new THREE.Mesh(geo, soils[side])); }
  const waterMat = new THREE.MeshStandardMaterial({ color: '#6faebb', emissive: '#274c60', emissiveIntensity: .5, roughness: .22, metalness: .35, transparent: true, opacity: .9, side: THREE.DoubleSide });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(2.3, 40), waterMat); pool.rotation.x = -Math.PI / 2; pool.position.set(0, groundHeight(0, -6) + .05, -6); surface.add(pool);
  const stone = new THREE.MeshStandardMaterial({ color: '#7d8a83', roughness: 1, flatShading: true });
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 2.5 + rand() * .3; const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.22 + rand() * .2, 0), stone); rock.position.set(Math.cos(a) * r, groundHeight(Math.cos(a) * r, -6 + Math.sin(a) * r) + .1, -6 + Math.sin(a) * r); surface.add(rock); }
  // The moss basin: a shallow mossy dish uphill of the spring, only once cultivated.
  const moss = new THREE.MeshStandardMaterial({ color: '#7fa55e', emissive: '#22391c', emissiveIntensity: .35, roughness: 1 });
  const basin = new THREE.Group(); basin.position.set(NODES.basin.x, groundHeight(NODES.basin.x, NODES.basin.z), NODES.basin.z); surface.add(basin);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.4, .3, 18, 1, true), moss); dish.position.y = .12; basin.add(dish);
  const basinWater = new THREE.Mesh(new THREE.CircleGeometry(1.6, 24), waterMat); basinWater.rotation.x = -Math.PI / 2; basinWater.position.y = .2; basin.add(basinWater);
  for (let i = 0; i < 20; i++) { const tuft = new THREE.Mesh(new THREE.SphereGeometry(.18, 6, 5), moss); const a = rand() * 6.28; tuft.position.set(Math.cos(a) * 1.85, .2 + rand() * .1, Math.sin(a) * 1.85); tuft.scale.y = .6; basin.add(tuft); }
  const bark = new THREE.MeshStandardMaterial({ color: '#756752', roughness: 1 });
  const crowns = new THREE.IcosahedronGeometry(1, 1);
  const colliders: { x: number; z: number; radius: number; minY: number; maxY: number }[] = [];
  const groveCrowns: Record<'west' | 'east', { mesh: THREE.Mesh; base: number }[]> = { west: [], east: [] };
  const groveLeaf = { west: new THREE.MeshStandardMaterial({ color: '#6b8f62', flatShading: true }), east: new THREE.MeshStandardMaterial({ color: '#6b8f62', flatShading: true }) };
  const wildLeaf = new THREE.MeshStandardMaterial({ color: '#5f7d58', flatShading: true }), gold = new THREE.MeshStandardMaterial({ color: '#d8b96c', flatShading: true });
  function tree(x: number, z: number, size: number, mat: THREE.Material, grove?: 'west' | 'east') {
    const g = new THREE.Group(); g.position.set(x, groundHeight(x, z), z); surface.add(g);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.2 * size, .45 * size, 4 * size, 7), bark); trunk.position.y = 2 * size; g.add(trunk);
    for (let j = 0; j < 4; j++) { const crown = new THREE.Mesh(crowns, mat); crown.position.set((rand() - .5) * 1.5, (3.4 + rand()) * size, (rand() - .5) * 1.5); const base = 1.1 * size; crown.scale.set(1.6 * size, base, 1.5 * size); g.add(crown); if (grove) groveCrowns[grove].push({ mesh: crown, base }); }
    colliders.push({ x, z, radius: .45 * size, minY: -.2, maxY: 5 * size });
  }
  // The anchor trees stand just behind each grove's ring so the ring itself is standable.
  tree(GROVES.west.x, GROVES.west.z - 1.5, 1.45, gold); tree(-11.5, 1.5, 1, groveLeaf.west, 'west'); tree(-6.5, 1.8, .95, groveLeaf.west, 'west'); tree(-10.2, 7.2, 1.05, groveLeaf.west, 'west'); tree(-6.8, 6.6, .9, groveLeaf.west, 'west');
  tree(GROVES.east.x, GROVES.east.z - 1.5, 1.3, groveLeaf.east, 'east'); tree(11.5, 1.5, 1, groveLeaf.east, 'east'); tree(6.5, 1.8, .95, groveLeaf.east, 'east'); tree(10.2, 7.2, 1.05, groveLeaf.east, 'east'); tree(6.8, 6.6, .9, groveLeaf.east, 'east');
  for (let i = 0; i < 26; i++) { const x = rand() * 36 - 18, z = rand() * 27 - 13; if (!onValley(x, z) || Math.hypot(x + 9, z - 4) < 5 || Math.hypot(x - 9, z - 4) < 5 || Math.hypot(x, z + 6) < 4.5 || Math.hypot(x, z + 2.5) < 3 || (Math.abs(x) < 10 && z > 2)) continue; tree(x, z, .6 + rand() * .5, wildLeaf); }
  const grass = new THREE.InstancedMesh(new THREE.ConeGeometry(.07, .35, 3), wildLeaf, 500), o = new THREE.Object3D();
  for (let i = 0; i < 500; i++) { let x, z; do { x = rand() * 36 - 18; z = rand() * 27 - 13; } while (Math.hypot(x, z + 6) < 2.8); o.position.set(x, groundHeight(x, z) + .12, z); o.rotation.y = rand() * 6.28; o.scale.setScalar(.6 + rand()); o.updateMatrix(); grass.setMatrixAt(i, o.matrix); } surface.add(grass);
  // Decomposers: mushrooms rise from damp litter under each grove.
  const capMat = new THREE.MeshStandardMaterial({ color: '#d9c39a', emissive: '#4a3b22', emissiveIntensity: .3, roughness: .8 });
  const mushrooms: Record<'west' | 'east', THREE.InstancedMesh> = { west: new THREE.InstancedMesh(new THREE.ConeGeometry(.13, .16, 6), capMat, 16), east: new THREE.InstancedMesh(new THREE.ConeGeometry(.13, .16, 6), capMat, 16) };
  const spots: Record<'west' | 'east', THREE.Vector3[]> = { west: [], east: [] };
  for (const side of ['west', 'east'] as const) { for (let i = 0; i < 16; i++) { const a = rand() * 6.28, r = 1.2 + rand() * 3.2, x = GROVES[side].x + Math.cos(a) * r, z = GROVES[side].z + Math.sin(a) * r; spots[side].push(vec(x, groundHeight(x, z) + .1, z)); } mushrooms[side].count = 0; surface.add(mushrooms[side]); }
  // Rain: falling streaks kept around the eye; only when the season is wet.
  const drops = 260, rainGeo = new THREE.BufferGeometry(), rainPos = new Float32Array(drops * 6);
  for (let i = 0; i < drops; i++) { const x = (rand() - .5) * 16, y = rand() * 9, z = (rand() - .5) * 16; rainPos.set([x, y, z, x, y - .35, z], i * 6); }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#cfe6ea', transparent: true, opacity: .55 })); rain.visible = false; scene.add(rain);
  // Roots: deep ones steady; the fine one withdraws and regrows with the ledger.
  const rootMats = new Map<string, THREE.MeshStandardMaterial>(), fineMeshes: THREE.Mesh[] = [];
  for (const e of EDGES) {
    const mat = new THREE.MeshStandardMaterial({ color: e.fine ? '#b7d9a6' : '#c6ac75', emissive: e.fine ? '#3f6b46' : '#547352', emissiveIntensity: .5, roughness: .65, transparent: true }); rootMats.set(e.id, mat);
    const root = new THREE.Mesh(new THREE.TubeGeometry(e.curve, 100, e.fine ? .08 : .15, 7, false), mat); root.position.y = -.32; roots.add(root); if (e.fine) fineMeshes.push(root);
    const fibres: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 35; i++) { const p = e.curve.getPointAt(i / 35); p.y -= .32; const q = p.clone().add(vec((rand() - .5) * 1.4, -rand() * .7, (rand() - .5) * 1.4)); fibres.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p, p.clone().lerp(q, .6).add(vec(.1, -.1, 0)), q]), 5, .018, 3, false)); }
    const merged = mergeGeometries(fibres); if (merged) { const m = new THREE.Mesh(merged, mat); roots.add(m); if (e.fine) fineMeshes.push(m); } fibres.forEach(g => g.dispose());
  }
  const markers = new Map<NodeId, THREE.Mesh>();
  for (const [id, p] of Object.entries(NODES)) { if (id === 'basin') continue; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.14, 1), new THREE.MeshBasicMaterial({ color: id === 'spring' ? '#a9e6ef' : '#f3d99e' })); m.position.copy(p).add(vec(0, .4, 0)); roots.add(m); markers.set(id as NodeId, m); }
  const cistern = new THREE.Mesh(new THREE.SphereGeometry(1.6, 18, 12), waterMat); cistern.position.copy(NODES.spring).add(vec(0, -.6, 0)); roots.add(cistern);
  const haloMat = new THREE.MeshBasicMaterial({ color: '#e5d7a2', transparent: true, opacity: .55, side: THREE.DoubleSide });
  for (const side of ['west', 'east'] as const) { const ring = new THREE.Mesh(new THREE.RingGeometry(.55, .7, 36), haloMat); ring.rotation.x = -Math.PI / 2; ring.position.set(GROVES[side].x, groundHeight(GROVES[side].x, GROVES[side].z) + .04, GROVES[side].z); surface.add(ring); }
  const motes: { mesh: THREE.Mesh; edge: typeof EDGES[number]; offset: number }[] = [];
  for (const e of EDGES) for (let i = 0; i < 8; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 5, 4), new THREE.MeshBasicMaterial({ color: '#d8ffb7' })); roots.add(m); motes.push({ mesh: m, edge: e, offset: i / 8 }); }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshBasicMaterial({ color: '#0b2022', side: THREE.DoubleSide })); floor.rotation.x = -Math.PI / 2; floor.position.y = -9; roots.add(floor);
  const wetSoil = new THREE.Color('#4a6842'), drySoil = new THREE.Color('#8f865a'), greenLeaf = new THREE.Color('#6b8f62'), dryLeaf = new THREE.Color('#a17f47'), tmp = new THREE.Color();
  /** How present the fine root is, 0..1, from the ledger's phase. */
  function finePresence(w: Watershed): number { return w.shortcut === 'open' ? 1 : w.shortcut === 'closed' ? .12 : w.shortcut === 'closing' ? Math.max(.12, 1 - w.phaseDays / CLOSING_DAYS * .88) : Math.min(1, .12 + w.phaseDays / REGROWING_DAYS * .88); }
  function update(w: Watershed, under: number, t: number, dt: number, inside: boolean, eye: THREE.Vector3, raining: boolean) {
    roots.visible = under > .02; for (const m of Object.values(soils)) { m.opacity = 1 - under * .88; m.depthWrite = under < .5; }
    for (const side of ['west', 'east'] as const) {
      const g = w[side]; soils[side].color.copy(tmp.copy(drySoil).lerp(wetSoil, g.moisture));
      groveLeaf[side].color.copy(tmp.copy(dryLeaf).lerp(greenLeaf, g.canopy));
      for (const c of groveCrowns[side]) c.mesh.scale.y = c.base * (.45 + .55 * g.canopy);
      const count = Math.round(decomposition(g) * 16); mushrooms[side].count = count;
      for (let i = 0; i < count; i++) { o.position.copy(spots[side][i]); o.scale.setScalar(.8 + (i % 3) * .2); o.rotation.set(0, 0, 0); o.updateMatrix(); mushrooms[side].setMatrixAt(i, o.matrix); } mushrooms[side].instanceMatrix.needsUpdate = true;
    }
    const fill = w.storage / storageCap(w); pool.scale.setScalar(.45 + .55 * fill); cistern.scale.setScalar(.35 + .65 * fill);
    basin.visible = w.basin; basinWater.visible = fill > .05; basinWater.scale.setScalar(.6 + .4 * fill);
    rain.visible = raining && under < .5;
    if (rain.visible) { rain.position.set(eye.x, eye.y - 2, eye.z); const p = rainGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < drops; i++) { let y = p.getY(i * 2) - 9 * dt; if (y < 0) y += 9; p.setY(i * 2, y); p.setY(i * 2 + 1, y - .35); } p.needsUpdate = true; }
    const presence = finePresence(w);
    for (const e of EDGES) { const m = rootMats.get(e.id)!; const on = isPassable(e, w, inside); m.opacity = e.fine ? Math.max(.12, presence) : 1; m.emissiveIntensity = on ? .7 : .05; }
    for (const m of fineMeshes) m.scale.set(1, .35 + .65 * presence, 1);
    for (const m of motes) { m.mesh.visible = isPassable(m.edge, w, inside); m.mesh.position.copy(m.edge.curve.getPointAt((t * .00007 + m.offset) % 1)).add(vec(0, -.18, 0)); }
    for (const [, m] of markers) { m.visible = eye.distanceTo(m.position) > 1.5; m.scale.setScalar(1 + Math.sin(t * .002) * .12); }
  }
  return { surface, roots, colliders, update };
}
