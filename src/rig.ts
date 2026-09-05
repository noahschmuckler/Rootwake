// The plant voxel rig for ONE face: a trunk rising to the cube's centre, five
// hand-authored branch curves twisting out from there to five flower tips on
// the front face plane, and a primitive flower mesh at each tip.
//
// Everything here is deliberately hand-placed (DESIGN.md: no procedural
// branches until the interaction has proven itself). The camera in main.ts is
// locked straight-on to the +Z face, so the tips are laid out on the z = HALF
// plane in a 2D-legible spread while the branches wander in depth behind them.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32, PALETTE } from './colors';

/** Half-extent of the voxel cube (cube is 2×2×2, centred at the origin, resting on y = -1). */
export const HALF = 1;
export const TIP_COUNT = 5;

// Tip positions on the front face. Roughly a pentagon so no two tips share a
// row/column — keeps the "which three?" read from being trivially linear.
const TIP_POSITIONS: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 0.72, HALF),
  new THREE.Vector3(-0.72, 0.22, HALF),
  new THREE.Vector3(0.72, 0.22, HALF),
  new THREE.Vector3(-0.46, -0.58, HALF),
  new THREE.Vector3(0.46, -0.58, HALF),
];

// Interior waypoints per branch, between the trunk top (origin) and the tip.
// z ranges over the cube's depth so each branch visibly dips away from and
// swings back toward the camera — that depth is what makes them read as a
// tangle rather than five flat spokes.
const BRANCH_WAYPOINTS: THREE.Vector3[][] = [
  [new THREE.Vector3(0.18, 0.2, -0.45), new THREE.Vector3(-0.15, 0.55, 0.3)],
  [new THREE.Vector3(-0.3, -0.15, 0.5), new THREE.Vector3(-0.62, 0.1, -0.2)],
  [new THREE.Vector3(0.25, 0.35, 0.55), new THREE.Vector3(0.65, 0.4, -0.1)],
  [new THREE.Vector3(-0.1, -0.35, -0.55), new THREE.Vector3(-0.5, -0.25, 0.35)],
  [new THREE.Vector3(0.35, -0.1, 0.25), new THREE.Vector3(0.55, -0.55, -0.35)],
];

const TRUNK_TOP = new THREE.Vector3(0, 0, 0);
const TRUNK_BASE = new THREE.Vector3(0, -HALF, 0);

export interface Branch {
  /** Position in rig.branches. */
  index: number;
  /** Which of the five tips this is (0–4); the same on every face. */
  tip: number;
  /** Which side face it grows out of (0 = +Z, then each 90° about Y). */
  face: number;
  curve: THREE.CatmullRomCurve3;
  /** All five branch tubes are one merged mesh (draw-call budget); every Branch points at it. */
  tube: THREE.Mesh;
  flower: THREE.Group;
  /** Palette index this flower was dealt. */
  colorIndex: number;
  /** Petal material — the thing selection highlighting mutates. */
  petalMaterial: THREE.MeshStandardMaterial;
}

export interface Rig {
  root: THREE.Group;
  branches: Branch[];
  /** Hit-test targets for raycasting; each carries userData.tipIndex. */
  hitTargets: THREE.Object3D[];
  /** Every material this rig owns — so a whole voxel can be faded as one. */
  materials: THREE.Material[];
  /** Pass 0.6a: the parts the felling beat animates separately. */
  trunkPivot: THREE.Group;
  foliage: THREE.Mesh;
  faceGroups: THREE.Group[];
  edges: THREE.LineSegments;
}

/** Pass 0.2: how many foliage blobs pack the cube's core behind the flowers. */
const FOLIAGE_BLOBS = 30;

/** The trunk hangs off a pivot at its base so it can topple (Pass 0.6a). */
function buildTrunk(material: THREE.Material): THREE.Group {
  const height = TRUNK_TOP.y - TRUNK_BASE.y;
  const geo = new THREE.CylinderGeometry(0.15, 0.21, height, 12);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(0, height / 2, 0);
  const pivot = new THREE.Group();
  pivot.position.copy(TRUNK_BASE);
  pivot.add(mesh);
  return pivot;
}

/**
 * Pass 0.2: dense dark foliage filling the back and sides of the cube, so an
 * unresolved voxel actually blocks sightlines instead of being five stems in
 * a void. Kept out of the front slab (z > ~0.6) so the branches and flowers
 * still read in the locked view; there it becomes the dark backdrop they sit
 * against. Seeded so a given voxel always packs the same way.
 */
function buildFoliage(seed: number, material: THREE.Material): THREE.Mesh {
  const rand = mulberry32(seed);
  const base = new THREE.IcosahedronGeometry(1, 1);
  const parts: THREE.BufferGeometry[] = [];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < FOLIAGE_BLOBS; i++) {
    const r = 0.28 + rand() * 0.24;
    // Pass 0.4c: the core is symmetric now that every side face carries
    // flowers — blobs stay inside |x|,|z| < ~0.6 so each face's front slab is clear.
    const position = new THREE.Vector3(
      (rand() * 2 - 1) * 0.6,
      (rand() * 2 - 1) * (HALF - r * 0.6),
      (rand() * 2 - 1) * 0.6
    );
    const scale = new THREE.Vector3(r * (0.8 + rand() * 0.5), r * (0.7 + rand() * 0.5), r * (0.8 + rand() * 0.5));
    q.setFromEuler(e.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI));
    parts.push(base.clone().applyMatrix4(m.compose(position, q, scale)));
  }
  // One mesh, not 26: with 30+ voxels the draw-call count matters on a phone.
  return new THREE.Mesh(mergeGeometries(parts), material);
}

function buildCurve(index: number): THREE.CatmullRomCurve3 {
  const pts = [TRUNK_TOP.clone(), ...BRANCH_WAYPOINTS[index].map((p) => p.clone()), TIP_POSITIONS[index].clone()];
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
}

/**
 * Primitive flower: a ring of flattened-sphere petals around a pistil, lying
 * in the XY plane so it faces the locked +Z camera. Colour lives on the petal
 * material, which is per-flower so selection highlighting is independent.
 */
function buildFlower(
  colorIndex: number,
  pistilMaterial: THREE.Material
): { group: THREE.Group; petalMaterial: THREE.MeshStandardMaterial } {
  const group = new THREE.Group();
  const petalMaterial = new THREE.MeshStandardMaterial({
    color: PALETTE[colorIndex].hex,
    roughness: 0.55,
    emissive: PALETTE[colorIndex].hex,
    emissiveIntensity: 0,
  });
  const petalGeo = new THREE.SphereGeometry(1, 14, 10);
  const PETALS = 6;
  const PETAL_RADIUS = 0.12;
  const parts: THREE.BufferGeometry[] = [];
  const m = new THREE.Matrix4();
  for (let i = 0; i < PETALS; i++) {
    const angle = (i / PETALS) * Math.PI * 2;
    m.compose(
      new THREE.Vector3(Math.cos(angle) * PETAL_RADIUS, Math.sin(angle) * PETAL_RADIUS, 0),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, angle)),
      new THREE.Vector3(0.12, 0.065, 0.04)
    );
    parts.push(petalGeo.clone().applyMatrix4(m));
  }
  group.add(new THREE.Mesh(mergeGeometries(parts), petalMaterial));
  const pistil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), pistilMaterial);
  pistil.position.z = 0.02;
  group.add(pistil);
  return { group, petalMaterial };
}

/**
 * @param colors    palette index per tip (see colors.ts)
 * @param seed      drives the foliage packing; defaults to a fixed layout
 * @param sideFaces how many side faces carry the branches and flowers: 1 (the
 *                  Pass 0 single +Z face) or 4 (Pass 0.4c — every side shows
 *                  the same live state, so a tree can be worked from any side)
 */
export function buildRig(colors: number[], seed = 7, sideFaces: 1 | 4 = 1): Rig {
  if (colors.length !== TIP_COUNT) {
    throw new Error(`buildRig: expected ${TIP_COUNT} colours, got ${colors.length}`);
  }
  // Materials are per-rig (not module-level) so one voxel can fade or glow
  // without dragging its neighbours along.
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 0.9 });
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4f7a3a, roughness: 0.8 });
  const pistilMaterial = new THREE.MeshStandardMaterial({ color: 0xfff1a8, roughness: 0.6 });
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x1f3a22, roughness: 1, flatShading: true });
  const materials: THREE.Material[] = [woodMaterial, stemMaterial, pistilMaterial, foliageMaterial];

  const root = new THREE.Group();
  const trunkPivot = buildTrunk(woodMaterial);
  root.add(trunkPivot);
  const foliage = buildFoliage(seed, foliageMaterial);
  root.add(foliage);
  const faceGroups: THREE.Group[] = [];

  const branches: Branch[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const hitGeo = new THREE.SphereGeometry(0.24, 8, 6);

  const curves = Array.from({ length: TIP_COUNT }, (_, i) => buildCurve(i));
  const tubeGeometry = mergeGeometries(curves.map((c) => new THREE.TubeGeometry(c, 48, 0.045, 8, false)));

  for (let face = 0; face < sideFaces; face++) {
    // Each face is the same hand-authored layout, turned about Y. Curves are
    // expressed in face-local space; world positions come from the group.
    const faceGroup = new THREE.Group();
    faceGroup.rotation.y = (face * Math.PI) / 2;
    root.add(faceGroup);
    faceGroups.push(faceGroup);

    const tube = new THREE.Mesh(tubeGeometry, stemMaterial);
    faceGroup.add(tube);

    for (let i = 0; i < TIP_COUNT; i++) {
      const curve = curves[i];
      const { group: flower, petalMaterial } = buildFlower(colors[i], pistilMaterial);
      materials.push(petalMaterial);
      flower.position.copy(curve.getPointAt(1));
      faceGroup.add(flower);

      // Generous invisible hit sphere so a tap doesn't have to land on a petal.
      // (Raycaster ignores `visible`, so this still catches clicks.)
      const hit = new THREE.Mesh(hitGeo);
      hit.visible = false;
      hit.userData.tipIndex = i;
      flower.add(hit);
      hitTargets.push(hit);

      branches.push({ index: branches.length, tip: i, face, curve, tube, flower, colorIndex: colors[i], petalMaterial });
    }
  }

  // Faint cube outline so the "voxel" reads as an object, not just a bush.
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x3a4a3a, transparent: true, opacity: 0.35 });
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(HALF * 2, HALF * 2, HALF * 2)),
    edgeMaterial
  );
  root.add(edges);
  materials.push(edgeMaterial);

  return { root, branches, hitTargets, materials, trunkPivot, foliage, faceGroups, edges };
}
