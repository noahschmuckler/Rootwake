// Underworld U0: the chamber. A 5x5-cell room of bare rock — floor, roof,
// four walls — with a 3x3 block of ore-bearing boulders in the middle and
// the metallurgist in the centre cell. Bare rock is immune to him; the ore
// is not. Dark: black fog whose reach is his darksight, a cool light riding
// the camera, and the ore streaks shining on their own.

import * as THREE from 'three';
import { mulberry32 } from './colors';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OreBoulder, BOULDER_RADIUS } from './ore';
export { BOULDER_RADIUS };
import type { CircleCollider } from './player';

// ---- Tuning constants ---------------------------------------------------------
export const GROUND_Y = -1;
/** Cell pitch and boulder size are tied: the gap between neighbouring boulders (CELL − 2·R = 0.4)
 *  must stay under the player's width (2 · PLAYER_RADIUS = 0.5) so the ring confines him. */
export const CELL = 3.0;
/** Half-width of the room's interior (2.5 cells). */
export const HALF = CELL * 2.5;
export const ROOF_HEIGHT = 3.2;
export const WALL_THICK = 0.6;
export const ROCK_COLOR = 0x5a534c;
export const ROCK_DARK = 0x453f39;
/** The darksight: a cool light on the camera (physical units — three r155+), and the ambient
 *  that makes the room read as grey-blue rather than black. Its reach is the fog. */
export const DARKSIGHT_INTENSITY = 34;
export const DARKSIGHT_AMBIENT = 1.1;
// -------------------------------------------------------------------------------

/** A flat-shaded rock slab with its vertices jittered so it reads as rock, not a box. */
function rockSlab(w: number, h: number, d: number, seed: number, amp = 0.12): THREE.Mesh {
  // Box faces don't share edge vertices: merge them first, or the jitter cracks the slab along its edges.
  const geo = mergeVertices(new THREE.BoxGeometry(w, h, d, Math.max(2, Math.round(w / 0.8)), Math.max(2, Math.round(h / 0.8)), Math.max(2, Math.round(d / 0.8))));
  const rand = mulberry32(seed);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    // keep the outer corners honest; jitter everything else
    const ex = Math.abs(Math.abs(pos.getX(i)) - w / 2) < 1e-4;
    const ey = Math.abs(Math.abs(pos.getY(i)) - h / 2) < 1e-4;
    const ez = Math.abs(Math.abs(pos.getZ(i)) - d / 2) < 1e-4;
    if ((ex ? 1 : 0) + (ey ? 1 : 0) + (ez ? 1 : 0) >= 2) continue;
    pos.setXYZ(i, pos.getX(i) + (rand() - 0.5) * amp, pos.getY(i) + (rand() - 0.5) * amp, pos.getZ(i) + (rand() - 0.5) * amp);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: ROCK_COLOR, roughness: 1, flatShading: true }));
}

export class Cave {
  readonly group = new THREE.Group();
  readonly boulders: OreBoulder[] = [];
  readonly fog: THREE.FogExp2;
  readonly darksight: THREE.PointLight;
  readonly hemi: THREE.HemisphereLight;

  constructor(scene: THREE.Scene, seed: number) {
    scene.background = new THREE.Color(0x000000);
    this.fog = new THREE.FogExp2(0x000000, 0.12);
    scene.fog = this.fog;
    this.hemi = new THREE.HemisphereLight(0x6c7c94, 0x1e1a16, DARKSIGHT_AMBIENT);
    scene.add(this.hemi);
    // The darksight: a cool light that goes where he looks, reaching as far as his energy lets him see.
    this.darksight = new THREE.PointLight(0xb8c8e8, DARKSIGHT_INTENSITY, SIGHT_DEFAULT, 2);
    scene.add(this.darksight);

    // Floor and roof.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2 + WALL_THICK * 2, HALF * 2 + WALL_THICK * 2), new THREE.MeshStandardMaterial({ color: ROCK_DARK, roughness: 1, flatShading: true }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = GROUND_Y;
    this.group.add(floor);
    const roof = rockSlab(HALF * 2 + WALL_THICK * 2, 0.5, HALF * 2 + WALL_THICK * 2, seed ^ 0x51, 0.35);
    roof.position.y = GROUND_Y + ROOF_HEIGHT + 0.25;
    this.group.add(roof);
    // Four walls of bare rock, immune.
    const wallLen = HALF * 2 + WALL_THICK * 2;
    for (const [i, [x, z, ry]] of [
      [0, 0, HALF + WALL_THICK / 2, 0],
      [1, 0, -HALF - WALL_THICK / 2, 0],
      [2, HALF + WALL_THICK / 2, 0, Math.PI / 2],
      [3, -HALF - WALL_THICK / 2, 0, Math.PI / 2],
    ].map((w) => [w[0], [w[1], w[2], w[3]]] as [number, [number, number, number]])) {
      const wall = rockSlab(wallLen, ROOF_HEIGHT + 0.5, WALL_THICK, seed ^ (0x77 + i), 0.2);
      wall.position.set(x, GROUND_Y + ROOF_HEIGHT / 2, z);
      wall.rotation.y = ry;
      wall.userData.bareRock = true;
      this.group.add(wall);
    }
    // The 3x3 block of ore-bearing boulders around the centre cell.
    let k = 0;
    for (let ix = -1; ix <= 1; ix++) {
      for (let iz = -1; iz <= 1; iz++) {
        if (ix === 0 && iz === 0) continue;
        const b = new OreBoulder(k, new THREE.Vector3(ix * CELL, GROUND_Y, iz * CELL), seed * 131 + k * 17);
        this.boulders.push(b);
        this.group.add(b.group);
        k++;
      }
    }
    scene.add(this.group);
  }

  /** Inside the room, off the walls. Boulders block by collider. */
  isWalkable = (p: THREE.Vector3): boolean => Math.abs(p.x) < HALF - 0.45 && Math.abs(p.z) < HALF - 0.45;

  colliders(): CircleCollider[] {
    return this.boulders.flatMap((b) => b.collider() ?? []);
  }

  /** Bare rock meshes, for the "immune" tap. */
  bareRock(): THREE.Object3D[] {
    return this.group.children.filter((m) => m.userData.bareRock);
  }

  /** Per frame: the darksight's reach. */
  setSight(cameraPosition: THREE.Vector3, sight: number): void {
    this.fog.density = 1.5 / sight;
    this.darksight.position.copy(cameraPosition);
    this.darksight.distance = sight * 1.3;
    const k = Math.min(1, sight / SIGHT_AT_FULL_REF);
    this.darksight.intensity = DARKSIGHT_INTENSITY * (0.55 + 0.45 * k);
    this.hemi.intensity = DARKSIGHT_AMBIENT * (0.5 + 0.5 * k);
  }
}
const SIGHT_DEFAULT = 16;
const SIGHT_AT_FULL_REF = 16;
