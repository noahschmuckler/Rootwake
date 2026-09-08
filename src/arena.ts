// The lab (lab branch): a place to look at a creature. v2: a viewing
// platform, raised at the near end of a wide chamber, over a pit; the far
// wall is tall and carries silvery ore at several heights, all in view from
// the platform's edge. He can only walk the platform. The same World
// surface as the cave, so the underworld's wiring boots it.

import * as THREE from 'three';
import { MobilityCourse } from './mobilityCourse';
import { COURSE_PASSAGE } from './mobilityCourseLayout';
import type { TraversalWorld } from './mobility';
import { mulberry32 } from './colors';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { GROUND_Y, WALL_THICK, ROCK_COLOR, ROCK_DARK, DARKSIGHT_INTENSITY, DARKSIGHT_AMBIENT, DARKSIGHT_DECAY, DARKSIGHT_DECAY_HELM, type TableTop } from './cave';
import type { OreBoulder } from './ore';
import type { CircleCollider } from './player';
import { OreVein } from './orevein';
import { ANNEX, CONNECTOR, STUDY_FRONT, STUDY_RISE, AISLE_RISE, annexWalkable, inside, inStudyPartition } from './labLayout';

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
  readonly mobility: MobilityCourse;
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
    this.mobility = new MobilityCourse(scene);
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
    // Flush boundary marker only. No raised lip obscures the pit floor.
    rock(new THREE.Mesh(new THREE.BoxGeometry(span, 0.008, 0.09), new THREE.MeshBasicMaterial({ color: 0x76868c })), 0, PLATFORM_FLOOR + 0.006, PLATFORM_Z0 + 0.08);
    // Four walls; the far one is the feeding wall.
    rock(rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ 0x77, 0.2), 0, PIT_FLOOR + ARENA_ROOF / 2, ARENA_HALF + WALL_THICK / 2);
    rock(rockSlab(span, ARENA_ROOF + 0.5, WALL_THICK, seed ^ 0x78, 0.2), 0, PIT_FLOOR + ARENA_ROOF / 2, -ARENA_HALF - WALL_THICK / 2);
    // The east wall has a real opening from the observation platform into the annex.
    const eastX = ARENA_HALF + WALL_THICK / 2;
    const sideWall = (z0: number, z1: number, code: number): void => {
      rock(rockSlab(z1 - z0, ARENA_ROOF + 0.5, WALL_THICK, seed ^ code, 0.12), eastX, PIT_FLOOR + ARENA_ROOF / 2, (z0 + z1) / 2, Math.PI / 2);
    };
    sideWall(-ARENA_HALF, CONNECTOR.z0, 0x79);
    sideWall(CONNECTOR.z1, ARENA_HALF, 0x7b);
    const doorWidth = CONNECTOR.z1 - CONNECTOR.z0;
    const doorZ = (CONNECTOR.z0 + CONNECTOR.z1) / 2;
    const lintelBottom = PLATFORM_FLOOR + CONNECTOR.height;
    const lintelH = PIT_FLOOR + ARENA_ROOF - lintelBottom;
    rock(rockSlab(doorWidth, lintelH, WALL_THICK, seed ^ 0x7c, 0.08), eastX, lintelBottom + lintelH / 2, doorZ, Math.PI / 2);
    rock(rockSlab(doorWidth, PLATFORM_RISE, WALL_THICK, seed ^ 0x7d, 0.08), eastX, PIT_FLOOR + PLATFORM_RISE / 2, doorZ, Math.PI / 2);
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
    // The connector and annex are actual room geometry; the original chamber remains intact.
    const slabMat = new THREE.MeshStandardMaterial({ color: 0x252b31, roughness: 0.85 });
    const slab = (w: number, h: number, d: number, x: number, y: number, z: number): void => {
      rock(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), slabMat), x, y, z);
    };
    const cx = (9 + ANNEX.x0) / 2, cw = ANNEX.x0 - 9;
    slab(cw + 0.5, 0.25, doorWidth, cx, PLATFORM_FLOOR - 0.125, doorZ);
    slab(cw + 0.5, 0.25, doorWidth, cx, lintelBottom + 0.125, doorZ);
    for (const z of [CONNECTOR.z0 - 0.12, CONNECTOR.z1 + 0.12]) slab(cw + 0.5, CONNECTOR.height, 0.24, cx, PLATFORM_FLOOR + CONNECTOR.height / 2, z);
    const ax = (ANNEX.x0 + ANNEX.x1) / 2, aw = ANNEX.x1 - ANNEX.x0;
    const az = (ANNEX.z0 + ANNEX.z1) / 2, ad = ANNEX.z1 - ANNEX.z0;
    slab(aw, 0.3, ad, ax, PIT_FLOOR + STUDY_RISE - 0.15, az);
    slab(aw, AISLE_RISE - STUDY_RISE, ANNEX.z1 - STUDY_FRONT, ax, PIT_FLOOR + (AISLE_RISE + STUDY_RISE) / 2, (STUDY_FRONT + ANNEX.z1) / 2);
    slab(aw, 0.25, ad, ax, PIT_FLOOR + ANNEX.roof + 0.125, az);
    const wallH = ANNEX.roof - STUDY_RISE;
    for (const z of [ANNEX.z0 - 0.12, ANNEX.z1 + 0.12]) slab(aw, wallH, 0.24, ax, PIT_FLOOR + STUDY_RISE + wallH / 2, z);
    // A second real doorway links the study aisle to the movement hangar.
    for (const [z0, z1] of [[ANNEX.z0, COURSE_PASSAGE.z0], [COURSE_PASSAGE.z1, ANNEX.z1]]) {
      slab(0.24, wallH, z1 - z0, ANNEX.x1 + 0.12, PIT_FLOOR + STUDY_RISE + wallH / 2, (z0 + z1) / 2);
    }
    slab(0.24, PIT_FLOOR + ANNEX.roof - COURSE_PASSAGE.roof, COURSE_PASSAGE.z1 - COURSE_PASSAGE.z0, ANNEX.x1 + 0.12, (PIT_FLOOR + ANNEX.roof + COURSE_PASSAGE.roof) / 2, (COURSE_PASSAGE.z0 + COURSE_PASSAGE.z1) / 2);
    // West wall of the annex, split at the connector instead of sealing its entrance.
    for (const [z0, z1] of [[ANNEX.z0, CONNECTOR.z0], [CONNECTOR.z1, ANNEX.z1]]) {
      slab(0.24, wallH, z1 - z0, ANNEX.x0 - 0.12, PIT_FLOOR + STUDY_RISE + wallH / 2, (z0 + z1) / 2);
    }
    slab(0.24, ANNEX.roof - (PLATFORM_RISE + CONNECTOR.height), doorWidth, ANNEX.x0 - 0.12, (PIT_FLOOR + ANNEX.roof + lintelBottom) / 2, doorZ);
    for (const x of [25, 45]) {
      const lamp = new THREE.PointLight(0xc6d6e4, 85, 23, 1.35);
      lamp.position.set(x, PIT_FLOOR + 6.7, 1.5);
      scene.add(lamp);
    }
    const passageLight = new THREE.PointLight(0x9db5bb, 12, 8, 1.2);
    passageLight.position.set(cx, PLATFORM_FLOOR + 2.8, doorZ);
    scene.add(passageLight);
    scene.add(this.group);
  }

  /** The original viewing platform, connector and annex aisle; display enclosures are not walkable. */
  private legacyWalkable = (p: THREE.Vector3): boolean => (Math.abs(p.x) < ARENA_HALF - 0.45 && p.z > PLATFORM_Z0 + 0.35 && p.z < ARENA_HALF - 0.45) || annexWalkable(p.x, p.z);
  isWalkable = (p: THREE.Vector3): boolean => this.legacyWalkable(p) || this.mobility.geometry.surfacesAt(p.x, p.z).length > 0;
  readonly traversal: TraversalWorld = {
    surfacesAt: (x, z) => {
      const course = this.mobility.geometry.surfacesAt(x, z);
      if (course.length) return course;
      return this.legacyWalkable(new THREE.Vector3(x, GROUND_Y, z)) ? [GROUND_Y + this.groundHeight(x, z)] : [];
    },
    canOccupy: (p, radius, height) => {
      if (this.mobility.geometry.canOccupy(p, radius, height)) return true;
      return this.legacyWalkable(p) && p.y >= GROUND_Y + this.groundHeight(p.x, p.z) - 0.025 && this.cameraClear(new THREE.Vector3(p.x, p.y + height, p.z));
    },
    anchors: () => this.mobility.geometry.anchors(),
  };
  /** The creature's ground: the pit floor. */
  pitWalkable = (p: THREE.Vector3): boolean => Math.abs(p.x) < ARENA_HALF - 0.6 && p.z > -ARENA_HALF + 0.6 && p.z < PLATFORM_Z0 - 0.6;
  groundHeight = (x: number, z: number): number => this.mobility.geometry.contains(x, z) ? this.mobility.geometry.groundHeight(x, z) - GROUND_Y : x >= ANNEX.x0 && z < STUDY_FRONT ? STUDY_RISE : z > PLATFORM_Z0 ? PLATFORM_RISE : 0;
  cameraClear = (p: THREE.Vector3): boolean => {
    if (this.mobility.geometry.canOccupy(p, 0.08, 0.1)) return true;
    const original = Math.abs(p.x) < ARENA_HALF - 0.25 && Math.abs(p.z) < ARENA_HALF - 0.25;
    const passage = inside(p.x, p.z, CONNECTOR, 0.1);
    const annex = inside(p.x, p.z, ANNEX, 0.15);
    if (!original && !passage && !annex) return false;
    if (annex && inStudyPartition(p.x, p.z)) return false;
    const floorY = PIT_FLOOR + this.groundHeight(p.x, p.z);
    const roofY = passage && !original && !annex ? PLATFORM_FLOOR + CONNECTOR.height : PIT_FLOOR + (annex ? ANNEX.roof : ARENA_ROOF);
    return p.y > floorY + 0.12 && p.y < roofY - 0.25;
  };

  colliders(): CircleCollider[] {
    return this.dynamic;
  }

  bareRock(): THREE.Object3D[] {
    return this.group.children.filter((m) => m.userData.bareRock);
  }

  setSight(cameraPosition: THREE.Vector3, sight: number, boost = 1): void {
    const inCourse = cameraPosition.x > 57;
    this.fog.density = inCourse ? 0.015 : 1.5 / sight;
    this.darksight.position.copy(cameraPosition);
    this.darksight.distance = sight * 1.3;
    const k = Math.min(1, sight / 16);
    this.darksight.intensity = DARKSIGHT_INTENSITY * (0.55 + 0.45 * k) * boost;
    this.darksight.decay = boost > 1 ? DARKSIGHT_DECAY_HELM : DARKSIGHT_DECAY;
    this.hemi.intensity = inCourse ? 1.6 : DARKSIGHT_AMBIENT * (0.5 + 0.5 * k) * boost;
  }
}
