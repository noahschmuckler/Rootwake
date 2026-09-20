// Shared plant geometry: tapered gnarled tubes for roots and vines, and a tree as wood plus leaf cards.
import * as THREE from 'three';
import { crownStandees, type Standee } from './sprites';

/** A tube whose radius follows the curve, with a little gnarl in the walls: a root, not a pipe. */
export function taperedTube(curve: THREE.Curve<THREE.Vector3>, segments: number, radial: number, radiusAt: (t: number) => number, gnarl: number): THREE.BufferGeometry {
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
/** A tree in world space: a trunk with a few branches into a crown of leaf cards, and a collar of roots at its foot. */
export function treeParts(rand: () => number, x: number, y: number, z: number, size: number): { wood: THREE.BufferGeometry[]; cards: Standee[]; roots: THREE.BufferGeometry[] } {
  const wood: THREE.BufferGeometry[] = [], roots: THREE.BufferGeometry[] = [];
  const trunk = new THREE.CylinderGeometry(0.15 * size, 0.42 * size, 3.2 * size, 8); trunk.translate(x, y + 1.6 * size, z); wood.push(trunk);
  for (let j = 0; j < 3; j++) {
    const yaw = j / 3 * Math.PI * 2 + rand(), branch = new THREE.CylinderGeometry(0.05 * size, 0.11 * size, 1.7 * size, 6);
    branch.translate(0, 0.85 * size, 0).rotateX(0.75).rotateY(yaw).translate(x, y + (2.4 + rand() * 0.5) * size, z); wood.push(branch);
  }
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + rand() * 0.5, reach = (0.6 + rand() * 0.6) * size;
    const foot = new THREE.Vector3(x, y + 0.3 * size, z), mid = new THREE.Vector3(x + Math.cos(a) * reach * 0.45, y + 0.1, z + Math.sin(a) * reach * 0.45), end = new THREE.Vector3(x + Math.cos(a) * reach, y - 0.05, z + Math.sin(a) * reach);
    roots.push(taperedTube(new THREE.CatmullRomCurve3([foot, mid, end]), 8, 6, t => 0.15 * size * (1 - 0.55 * t), 0.15));
  }
  const cards = crownStandees(rand, new THREE.Vector3(x, y + 3.5 * size, z), 1.7 * size, 1.2 * size, 1.7 * size, 9, 1.4 * size);
  return { wood, cards, roots };
}
