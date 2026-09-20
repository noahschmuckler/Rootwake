// The Clearing as a scene: sprite trees over a root network in soil that can go glassy, a stone wall
// with a strip of handholds, the ivy Hulda grows on it, and the flowers she leaves wherever she walks.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TREES, ROOTS, WALL_Z, WALL_H, WALL_HALF, LEDGE_DEPTH, HANDHOLDS, CLEARING_RADIUS, relief, groundAt, crownHeight, trunkRadius, cellCentre, ivySiteX, TRAIL_MAX, type Tree, type Growth } from './flowModel';
import { mulberry32 } from './colors';
import { spriteMaterial, standees, crownStandees, type Standee } from './sprites';
import { taperedTube, treeParts } from './flora';

export function buildClearing(scene: THREE.Scene) {
  const rand = mulberry32(320926);
  // Ground and ledge: one material, so both thin together when she is in the roots.
  const earth = new THREE.MeshStandardMaterial({ color: '#4c6644', roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const groundGeo = new THREE.CircleGeometry(CLEARING_RADIUS + 12, 64); groundGeo.rotateX(-Math.PI / 2);
  { const pos = groundGeo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i))); groundGeo.computeVertexNormals(); }
  scene.add(new THREE.Mesh(groundGeo, earth));
  const ledge = new THREE.Mesh(new THREE.PlaneGeometry(WALL_HALF * 2 + 20, LEDGE_DEPTH + 6), earth); ledge.rotation.x = -Math.PI / 2; ledge.position.set(0, WALL_H, WALL_Z - LEDGE_DEPTH / 2 - 1); scene.add(ledge);
  const stone = new THREE.MeshStandardMaterial({ color: '#8d8a7c', roughness: 1, flatShading: true });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(WALL_HALF * 2 + 20, WALL_H + 0.2, 0.9, 40, 6, 1), stone); wall.position.set(0, WALL_H / 2, WALL_Z - 0.45); scene.add(wall);
  { const pos = wall.geometry.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) { if (pos.getZ(i) > 0.4) pos.setZ(i, pos.getZ(i) + (rand() - 0.5) * 0.18); } wall.geometry.computeVertexNormals(); }
  const back = new THREE.Mesh(new THREE.BoxGeometry(WALL_HALF * 2 + 20, 9, 1.2), stone); back.position.set(0, WALL_H + 4.5, WALL_Z - LEDGE_DEPTH - 1.5); scene.add(back);
  // Handholds: knobs of the same stone in the climbable strip.
  const knobs: THREE.BufferGeometry[] = [];
  for (let y = 0.6; y < WALL_H; y += 0.65) for (let x = HANDHOLDS.x0 + 0.3; x < HANDHOLDS.x1; x += 0.9) { const k = new THREE.DodecahedronGeometry(0.14 + rand() * 0.06, 0); k.translate(x + (rand() - 0.5) * 0.3, y + (rand() - 0.5) * 0.2, WALL_Z + 0.1); knobs.push(k); }
  scene.add(new THREE.Mesh(mergeGeometries(knobs)!, new THREE.MeshStandardMaterial({ color: '#6f6b60', roughness: 1, flatShading: true })));
  // Trees: wood, crowns and collars merged; the collars and the network share one bark.
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 });
  const rootBark = new THREE.MeshStandardMaterial({ color: '#8a6f4e', emissive: '#c9a24a', emissiveIntensity: 0.05, roughness: 0.95 });
  const leaf = spriteMaterial('leaf', '#5f8657');
  const wood: THREE.BufferGeometry[] = [], cards: Standee[] = [], collars: THREE.BufferGeometry[] = [];
  for (const t of TREES) { const parts = treeParts(rand, t.x, t.y, t.z, t.size); wood.push(...parts.wood); cards.push(...parts.cards); collars.push(...parts.roots); }
  scene.add(new THREE.Mesh(mergeGeometries(wood)!, bark), new THREE.Mesh(standees(cards), leaf), new THREE.Mesh(mergeGeometries(collars)!, rootBark));
  const wild: Standee[] = [], wildWood: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 40; i++) { const a = rand() * 6.28, r = CLEARING_RADIUS + 2 + rand() * 9, x = Math.cos(a) * r, z = Math.sin(a) * r; if (z < WALL_Z + 2) continue; const parts = treeParts(rand, x, relief(x, z), z, 0.8 + rand() * 0.6); wildWood.push(...parts.wood); wild.push(...parts.cards); }
  for (let i = 0; i < 10; i++) { const x = (rand() - 0.5) * WALL_HALF * 2, z = WALL_Z - 3 - rand() * (LEDGE_DEPTH - 5); const parts = treeParts(rand, x, WALL_H + relief(x, z), z, 0.7 + rand() * 0.5); wildWood.push(...parts.wood); wild.push(...parts.cards); }
  scene.add(new THREE.Mesh(mergeGeometries(wildWood)!, bark), new THREE.Mesh(standees(wild), leaf));
  // The root network under the soil: opaque bark, tapering to nothing where it ends.
  const roots: THREE.BufferGeometry[] = [];
  for (const r of ROOTS) roots.push(taperedTube(r.curve, Math.ceil(r.length * 3), 7, t => r.taper ? 0.16 * (1 - t) * (1 - t) + 0.005 : 0.16 * (0.55 + 0.45 * Math.abs(2 * t - 1)), 0.22));
  scene.add(new THREE.Mesh(mergeGeometries(roots)!, rootBark));
  const bedrock = new THREE.Mesh(new THREE.CircleGeometry(CLEARING_RADIUS + 14, 48), new THREE.MeshBasicMaterial({ color: '#0d1513', side: THREE.DoubleSide })); bedrock.rotation.x = -Math.PI / 2; bedrock.position.y = -4; scene.add(bedrock);
  // Grass: blade tufts everywhere she can walk.
  const grassMat = spriteMaterial('grass', '#9fc06a'); const grass: Standee[] = [];
  for (let i = 0; i < 700; i++) { const a = rand() * 6.28, r = rand() * (CLEARING_RADIUS + 4), x = Math.cos(a) * r, z = Math.sin(a) * r; if (z < WALL_Z + 0.8) continue; const k = 0.22 + rand() * 0.3; grass.push({ position: new THREE.Vector3(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  for (let i = 0; i < 160; i++) { const x = (rand() - 0.5) * WALL_HALF * 2, z = WALL_Z - 0.8 - rand() * (LEDGE_DEPTH - 1.5), k = 0.22 + rand() * 0.3; grass.push({ position: new THREE.Vector3(x, WALL_H + relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(grass), grassMat));
  // Her trail: flowering tufts on every cell she has walked, bigger the more she has walked it.
  const crossQuad = (() => { const a = new THREE.PlaneGeometry(1, 1); a.translate(0, 0.5, 0); const b = a.clone().rotateY(Math.PI / 2); return mergeGeometries([a, b])!; })();
  const TRAIL_MAX_INSTANCES = 2400;
  const trail = new THREE.InstancedMesh(crossQuad, spriteMaterial('bloom', '#ffffff'), TRAIL_MAX_INSTANCES); trail.count = 0; trail.frustumCulled = false; scene.add(trail);
  const o = new THREE.Object3D();
  function setTrail(g: Growth): void {
    let n = 0;
    for (const [key, level] of Object.entries(g.trail)) {
      if (level < 0.15 || n >= TRAIL_MAX_INSTANCES) continue;
      const c = cellCentre(key), h = mulberry32(key.length * 131 + key.charCodeAt(0) * 7 + key.charCodeAt(key.length - 1)), k = 0.22 + 0.34 * Math.min(1, level / TRAIL_MAX);
      o.position.set(c.x + (h() - 0.5) * 0.5, groundAt(c.x, c.z), c.z + (h() - 0.5) * 0.5); o.rotation.set(0, h() * Math.PI, 0); o.scale.set(k, k * (0.9 + 0.5 * Math.min(1, level / TRAIL_MAX)), k); o.updateMatrix(); trail.setMatrixAt(n++, o.matrix);
    }
    trail.count = n; trail.instanceMatrix.needsUpdate = true;
  }
  // Ivy: per site, tendrils that grow up the wall and stay. drawRange lets a tendril lengthen as it climbs.
  const vine = new THREE.MeshStandardMaterial({ color: '#4f7a3e', roughness: 0.9 }), ivyLeaf = spriteMaterial('leaf', '#5e9a4a');
  const ivy = new Map<number, { tubes: THREE.Mesh[]; leaves: THREE.Mesh; k: number }>();
  function ivyAt(site: number): { tubes: THREE.Mesh[]; leaves: THREE.Mesh; k: number } {
    const have = ivy.get(site); if (have) return have;
    const x0 = ivySiteX(site), tubes: THREE.Mesh[] = [], leafCards: Standee[] = [], vr = mulberry32(1000 + site);
    for (let i = 0; i < 5; i++) {
      const sx = x0 + (i - 2) * 0.35, pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 6; k++) { const u = k / 6; pts.push(new THREE.Vector3(sx + Math.sin(u * 7 + i) * 0.35 * u + (vr() - 0.5) * 0.2, u * (WALL_H + 0.6), WALL_Z + 0.16 + Math.sin(u * 9) * 0.05)); }
      const geo = taperedTube(new THREE.CatmullRomCurve3(pts), 36, 6, t => 0.055 * (1 - 0.6 * t), 0.2); const m = new THREE.Mesh(geo, vine); m.geometry.setDrawRange(0, 0); scene.add(m); tubes.push(m);
      for (let k = 1; k <= 6; k++) { const u = k / 6; leafCards.push({ position: new THREE.Vector3(sx + Math.sin(u * 7 + i) * 0.35 * u, u * (WALL_H + 0.6) - 0.2, WALL_Z + 0.2), yaw: vr() * Math.PI, width: 0.35 + vr() * 0.25, height: 0.35 + vr() * 0.25, up: new THREE.Vector3(0, 0, 1) }); }
    }
    const leaves = new THREE.Mesh(standees(leafCards), ivyLeaf); leaves.visible = false; scene.add(leaves);
    const entry = { tubes, leaves, k: 0 }; ivy.set(site, entry); return entry;
  }
  /** Set a site's growth 0..1: tendrils lengthen from the base; leaves show once it is full. */
  function growIvy(site: number, k: number): void {
    const e = ivyAt(site); e.k = k;
    for (const m of e.tubes) { const total = m.geometry.index!.count, segs = 36; m.geometry.setDrawRange(0, Math.min(total, Math.floor(segs * k) * (total / segs))); }
    e.leaves.visible = k >= 0.999;
  }
  // Her other shapes: the bulge that climbs a trunk, the figure of leaves at a crown, the ivy mass on a wall.
  const figureMat = spriteMaterial('leaf', '#b9e58a', { emissive: '#4a7a2a', emissiveIntensity: 0.35 });
  const figure = new THREE.Group(); figure.visible = false; scene.add(figure);
  { const fr = mulberry32(77); const body = crownStandees(fr, new THREE.Vector3(0, 0.95, 0), 0.42, 0.55, 0.3, 9, 0.5); body.push({ position: new THREE.Vector3(0, 1.35, 0), yaw: 0.4, width: 0.42, height: 0.42, flat: true }); figure.add(new THREE.Mesh(standees(body), figureMat)); }
  const mass = new THREE.Group(); mass.visible = false; scene.add(mass);
  { const mr = mulberry32(78); mass.add(new THREE.Mesh(standees(crownStandees(mr, new THREE.Vector3(0, 0.5, 0), 0.8, 0.55, 0.35, 12, 0.55)), ivyLeaf)); }
  /** Where a crown's edge is at azimuth az: where the leaf figure stands when she is in the canopy. */
  const crownPoint = (t: Tree, az: number): THREE.Vector3 => new THREE.Vector3(t.x + Math.cos(az) * 1.1 * t.size, t.y + crownHeight(t) + 0.15, t.z + Math.sin(az) * 1.1 * t.size);
  const trunkPoint = (t: Tree, h: number, az: number): THREE.Vector3 => new THREE.Vector3(t.x + Math.cos(az) * (trunkRadius(t) + 0.12), t.y + h, t.z + Math.sin(az) * (trunkRadius(t) + 0.12));
  function update(under: number): void { earth.opacity = 1 - under * 0.82; earth.depthWrite = under < 0.5; rootBark.emissiveIntensity = 0.05 + under * 0.45; }
  return { update, setTrail, growIvy, ivyAt, figure, mass, crownPoint, trunkPoint };
}
export type Clearing = ReturnType<typeof buildClearing>;
