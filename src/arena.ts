// The lab (lab branch): a place to look at a creature. One wide, high
// chamber of bare rock and nothing else — no ore, no hall, no tables — so
// whatever is put in it can be watched from anywhere, in the suit's light.
// The same World surface as the cave, so the underworld's wiring boots it.

import * as THREE from 'three';
import { mulberry32 } from './colors';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GROUND_Y, WALL_THICK, ROCK_COLOR, ROCK_DARK, DARKSIGHT_INTENSITY, DARKSIGHT_AMBIENT, DARKSIGHT_DECAY, DARKSIGHT_DECAY_HELM, type TableTop } from './cave';
import type { OreBoulder } from './ore';
import type { CircleCollider } from './player';
import { OreVein } from './orevein';

// ---- Tuning constants ---------------------------------------------------------
/** Half-width of the arena's interior, and its roof height. Room for something big to move. */
export const ARENA_HALF = 9;
export const ARENA_ROOF = 6;
// -------------------------------------------------------------------------------

function rockSlab(w: number, h: number, d: number, seed: number, amp = 0.12): THREE.Mesh {
  const geo = mergeVertices(new THREE.BoxGeometry(w, h, d, Math.max(2, Math.round(w / 0.8)), Math.max(2, Math.round(h / 0.8)), Math.max(2, Math.round(d / 0.8))));
  const rand = mulberry32(seed);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const ex = Math.abs(Math.abs(pos.getX(i)) - w / 2) < 1e-4;
    const ey = Math.abs(Math.abs(pos.getY(i)) - h / 2) < 1e-4;
    const ez = Math.abs(Math.abs(pos.getZ(i)) - d / 2) < 1e-4;
    if ((ex ? 1 : 0) + (ey ? 1 : 0) + (ez ? 1 : 0) >= 2) continue;
    pos.setXYZ(i, pos.getX(i) + (rand() - 0.5) * amp, pos.getY(i) + (rand() - 0.5) * amp, pos.getZ(i) + (rand() - 0.5) * amp);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: ROCK_COLOR, roughness: 1, flatShading: true }));
}

export class Arena {
  readonly group = new THREE.Group();
  readonly boulders: OreBoulder[] = [];
  readonly tables: TableTop[] = [];
  readonly fog: THREE.FogExp2;
  readonly darksight: THREE.PointLight;
  readonly hemi: THREE.HemisphereLight;
  /** Silvery ore on the walls, for the creature. */
  readonly veins: OreVein[] = [];
  /** Colliders that move (the creature's); it keeps its own entry up to date. */
  readonly dynamic: CircleCollider[] = [];

  constructor(scene: THREE.Scene, seed: number) {
    scene.background = new THREE.Color(0x000000);
    this.fog = new THREE.FogExp2(0x000000, 0.12);
    scene.fog = this.fog;
    this.hemi = new THREE.HemisphereLight(0x6c7c94, 0x1e1a16, DARKSIGHT_AMBIENT);
    scene.add(this.hemi);
    this.darksight = new THREE.PointLight(0xb8c8e8, DARKSIGHT_INTENSITY, 16, DARKSIGHT_DECAY);
    scene.add(this.darksight);

    const span = ARENA_HALF * 2 + WALL_THICK * 2;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(span, span), new THREE.MeshStandardMaterial({ color: ROCK_DARK, roughness: 1, flatShading: true }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = GROUND_Y;
    floor.userData.bareRock = true;
    this.group.add(floor);
    const roof = rockSlab(span, 0.5, span, seed ^ 0x51, 0.35);
    roof.position.y = GROUND_Y + ARENA_ROOF + 0.25;
    roof.userData.bareRock = true;
    this.group.add(roof);
    for (const [i, [x, z, ry]] of [
      [0, 0, ARENA_HALF + WALL_THICK / 2, 0],
      [1, 0, -ARENA_HALF - WALL_THICK / 2, 0],
      [2, ARENA_HALF + WALL_THICK / 2, 0, Math.PI / 2],
      [3, -ARENA_HALF - WALL_THICK / 2, 0, Math.PI / 2],
    ].map((w) => [w[0], [w[1], w[2], w[3]]] as [number, [number, number, number]])) {
      const wall = rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ (0x77 + i), 0.2);
      wall.position.set(x, GROUND_Y + ARENA_ROOF / 2, z);
      wall.rotation.y = ry;
      wall.userData.bareRock = true;
      this.group.add(wall);
    }
    // Ore on the walls: five clusters at working height, one or two per wall, never in a corner.
    const H = ARENA_HALF;
    const spots: [number, number, number, number, number][] = [
      // x, z, normal x, normal z, height above the floor
      [-2.5, -H, 0, 1, 0.9],
      [3.5, -H, 0, 1, 1.3],
      [H, 1.5, -1, 0, 0.7],
      [-1.0, H, 0, -1, 1.1],
      [-H, -3.0, 1, 0, 0.8],
    ];
    spots.forEach(([x, z, nx, nz, h], i) => {
      const v = new OreVein(new THREE.Vector3(x, GROUND_Y + h, z), new THREE.Vector3(nx, 0, nz), seed ^ (0x5e1 + i * 7));
      this.veins.push(v);
      this.group.add(v.group);
    });
    scene.add(this.group);
  }

  isWalkable = (p: THREE.Vector3): boolean => Math.abs(p.x) < ARENA_HALF - 0.45 && Math.abs(p.z) < ARENA_HALF - 0.45;
  groundHeight = (_x: number, _z: number): number => 0;
  cameraClear = (p: THREE.Vector3): boolean => Math.abs(p.x) < ARENA_HALF - 0.25 && Math.abs(p.z) < ARENA_HALF - 0.25 && p.y > GROUND_Y + 0.1 && p.y < GROUND_Y + ARENA_ROOF - 0.25;

  colliders(): CircleCollider[] {
    return this.dynamic;
  }

  bareRock(): THREE.Object3D[] {
    return this.group.children.filter((m) => m.userData.bareRock);
  }

  setSight(cameraPosition: THREE.Vector3, sight: number, boost = 1): void {
    this.fog.density = 1.5 / sight;
    this.darksight.position.copy(cameraPosition);
    this.darksight.distance = sight * 1.3;
    const k = Math.min(1, sight / 16);
    this.darksight.intensity = DARKSIGHT_INTENSITY * (0.55 + 0.45 * k) * boost;
    this.darksight.decay = boost > 1 ? DARKSIGHT_DECAY_HELM : DARKSIGHT_DECAY;
    this.hemi.intensity = DARKSIGHT_AMBIENT * (0.5 + 0.5 * k) * boost;
  }
}
