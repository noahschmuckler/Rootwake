// The lab (lab branch): a place to look at a creature. v2: a viewing
// platform, raised at the near end of a wide chamber, over a pit; the far
// wall is tall and carries silvery ore at several heights, all in view from
// the platform's edge. He can only walk the platform. The same World
// surface as the cave, so the underworld's wiring boots it.

import * as THREE from 'three';
import { mulberry32 } from './colors';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GROUND_Y, WALL_THICK, ROCK_COLOR, ROCK_DARK, DARKSIGHT_INTENSITY, DARKSIGHT_AMBIENT, DARKSIGHT_DECAY, DARKSIGHT_DECAY_HELM, type TableTop } from './cave';
import type { OreBoulder } from './ore';
import type { CircleCollider } from './player';
import { OreVein } from './orevein';

// ---- Tuning constants ---------------------------------------------------------
/** Half-width of the chamber, its roof height above the pit floor, and the platform: where it starts
 *  (z from PLATFORM_Z0 to the near wall) and how far above the pit floor it stands. */
export const ARENA_HALF = 9;
export const ARENA_ROOF = 7.5;
export const PLATFORM_Z0 = 4.5;
export const PLATFORM_RISE = 2.2;
/** Lab fixtures: two cool lamps under the roof over the pit, so the feeding wall can be judged from the
 *  platform. Not part of the game's lighting — the lab is lit because it is a lab. */
export const LAMP_INTENSITY = 40;
/** The feeding wall is the far (−z) wall; veins at these x positions and heights above the pit floor. */
export const FAR_WALL_VEINS: [number, number][] = [
  [-6.2, 1.0],
  [-2.6, 3.1],
  [0.8, 5.0],
  [4.2, 2.2],
  [7.0, 3.9],
];
// -------------------------------------------------------------------------------

export const PIT_FLOOR = GROUND_Y;
export const PLATFORM_FLOOR = GROUND_Y + PLATFORM_RISE;

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
  /** Silvery ore on the far wall, for the creature. */
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
    const rock = (m: THREE.Mesh, x: number, y: number, z: number, ry = 0): void => {
      m.position.set(x, y, z);
      m.rotation.y = ry;
      m.userData.bareRock = true;
      this.group.add(m);
    };
    // The pit floor, and the roof over everything.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(span, span), new THREE.MeshStandardMaterial({ color: ROCK_DARK, roughness: 1, flatShading: true }));
    floor.rotation.x = -Math.PI / 2;
    rock(floor, 0, PIT_FLOOR, 0);
    rock(rockSlab(span, 0.5, span, seed ^ 0x51, 0.35), 0, PIT_FLOOR + ARENA_ROOF + 0.25, 0);
    // The platform: a block from PLATFORM_Z0 to the near wall, its top the floor he walks, its front a cliff.
    const depth = ARENA_HALF - PLATFORM_Z0;
    rock(rockSlab(span, PLATFORM_RISE + 0.5, depth + WALL_THICK, seed ^ 0x60, 0.15), 0, PIT_FLOOR + PLATFORM_RISE / 2 - 0.25, PLATFORM_Z0 + (depth + WALL_THICK) / 2);
    // A low lip along its edge, so the edge reads.
    rock(rockSlab(span, 0.16, 0.3, seed ^ 0x61, 0.05), 0, PLATFORM_FLOOR + 0.08, PLATFORM_Z0 + 0.15);
    // Four walls; the far one is the feeding wall.
    rock(rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ 0x77, 0.2), 0, PIT_FLOOR + ARENA_ROOF / 2, ARENA_HALF + WALL_THICK / 2);
    rock(rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ 0x78, 0.2), 0, PIT_FLOOR + ARENA_ROOF / 2, -ARENA_HALF - WALL_THICK / 2);
    rock(rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ 0x79, 0.2), ARENA_HALF + WALL_THICK / 2, PIT_FLOOR + ARENA_ROOF / 2, 0, Math.PI / 2);
    rock(rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ 0x7a, 0.2), -ARENA_HALF - WALL_THICK / 2, PIT_FLOOR + ARENA_ROOF / 2, 0, Math.PI / 2);
    // The lamps over the pit.
    for (const x of [-4.5, 4.5]) {
      const lamp = new THREE.PointLight(0x9fb4d0, LAMP_INTENSITY, 26, 1.2);
      lamp.position.set(x, PIT_FLOOR + ARENA_ROOF - 0.6, -3);
      scene.add(lamp);
    }
    // Ore on the far wall at several heights.
    FAR_WALL_VEINS.forEach(([x, h], i) => {
      const v = new OreVein(new THREE.Vector3(x, PIT_FLOOR + h, -ARENA_HALF), new THREE.Vector3(0, 0, 1), seed ^ (0x5e1 + i * 7));
      this.veins.push(v);
      this.group.add(v.group);
    });
    scene.add(this.group);
  }

  /** He walks the platform only. */
  isWalkable = (p: THREE.Vector3): boolean => Math.abs(p.x) < ARENA_HALF - 0.45 && p.z > PLATFORM_Z0 + 0.35 && p.z < ARENA_HALF - 0.45;
  /** The creature's ground: the pit floor. */
  pitWalkable = (p: THREE.Vector3): boolean => Math.abs(p.x) < ARENA_HALF - 0.6 && p.z > -ARENA_HALF + 0.6 && p.z < PLATFORM_Z0 - 0.6;
  groundHeight = (_x: number, z: number): number => (z > PLATFORM_Z0 ? PLATFORM_RISE : 0);
  cameraClear = (p: THREE.Vector3): boolean => {
    if (Math.abs(p.x) > ARENA_HALF - 0.25 || Math.abs(p.z) > ARENA_HALF - 0.25) return false;
    const floorY = PIT_FLOOR + this.groundHeight(p.x, p.z);
    return p.y > floorY + 0.1 && p.y < PIT_FLOOR + ARENA_ROOF - 0.25;
  };

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
