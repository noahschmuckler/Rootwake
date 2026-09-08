// Underworld U0/U1: the place. A 5x5-cell chamber of bare rock — floor,
// roof, four walls — with a 3x3 block of ore-bearing boulders in the middle
// and the metallurgist in the centre cell. Bare rock is immune to him; the
// ore is not. Dark: black fog whose reach is his darksight, a cool light
// riding the camera, and the ore streaks shining on their own.
//
// U1: a long hallway leaves the chamber's +x wall and climbs to a second
// chamber — crude wooden tables and chairs, food on the tables. The floor
// rises along the hall (`groundHeight`), and the camera is kept out of the
// rock (`cameraClear`).

import * as THREE from 'three';
import { mulberry32 } from './colors';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OreBoulder, BOULDER_RADIUS } from './ore';
import type { CircleCollider } from './player';
export { BOULDER_RADIUS };

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
export const DARKSIGHT_INTENSITY = 15;
export const DARKSIGHT_AMBIENT = 1.1;
/** Its falloff: gentler than the inverse square, so a wall at arm's length doesn't flare white and the
 *  far side of a room still gets some of it. The helm's boost softens it further. */
export const DARKSIGHT_DECAY = 1.35;
export const DARKSIGHT_DECAY_HELM = 1.0;
/** U1: the hallway out of the +x wall — long enough to fade into the dark at full sight (16),
 *  rising HALL_RISE over its length; and the second chamber at its top. */
export const HALL_LENGTH = 26;
export const HALL_HALF = 1.1; // interior half-width
export const HALL_RISE = 5;
export const ROOM_B_HALF = 5;
/** U4: the dining chamber is tall, and high in its far (+x) wall is a tunnel mouth — big enough for
 *  him, too high for him (until he can climb or jump). Only the greblins can get to it. */
export const ROOM_B_ROOF = 7.2;
export const TUNNEL_Z = 0;
export const TUNNEL_HALF = 1.1;
export const TUNNEL_BOTTOM = 4.4; // above the chamber floor
export const TUNNEL_HEIGHT = 2.2;
export const TUNNEL_LENGTH = 7;
// -------------------------------------------------------------------------------

export const HALL_X0 = HALF;
export const HALL_X1 = HALF + HALL_LENGTH;
export const ROOM_B_CX = HALL_X1 + ROOM_B_HALF;
export const ROOM_B_FLOOR = GROUND_Y + HALL_RISE;
/** The tunnel mouth: the +x wall's inner face, and its floor height. */
export const TUNNEL_X = ROOM_B_CX + ROOM_B_HALF;
export const TUNNEL_FLOOR = ROOM_B_FLOOR + TUNNEL_BOTTOM;

const wood = new THREE.MeshStandardMaterial({ color: 0x6a4a30, roughness: 0.95, flatShading: true });
const woodDark = new THREE.MeshStandardMaterial({ color: 0x4a3320, roughness: 0.95, flatShading: true });

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

/** A table top's placement, for whatever is laid on it. */
export interface TableTop {
  x: number;
  z: number;
  y: number;
  yaw: number;
  halfLength: number;
  halfWidth: number;
}

export class Cave {
  readonly group = new THREE.Group();
  readonly boulders: OreBoulder[] = [];
  readonly fog: THREE.FogExp2;
  readonly darksight: THREE.PointLight;
  readonly hemi: THREE.HemisphereLight;
  readonly tables: TableTop[] = [];
  private readonly furniture: CircleCollider[] = [];

  constructor(scene: THREE.Scene, seed: number) {
    scene.background = new THREE.Color(0x000000);
    this.fog = new THREE.FogExp2(0x000000, 0.12);
    scene.fog = this.fog;
    this.hemi = new THREE.HemisphereLight(0x6c7c94, 0x1e1a16, DARKSIGHT_AMBIENT);
    scene.add(this.hemi);
    // The darksight: a cool light that goes where he looks, reaching as far as his energy lets him see.
    this.darksight = new THREE.PointLight(0xb8c8e8, DARKSIGHT_INTENSITY, SIGHT_DEFAULT, DARKSIGHT_DECAY);
    scene.add(this.darksight);

    // The first chamber, with the hallway's opening in its +x wall.
    this.room(0, 0, HALF, GROUND_Y, ROOF_HEIGHT, seed, { side: 1 });
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
    this.hallway(seed);
    // The second chamber, entered from its −x wall.
    this.room(ROOM_B_CX, 0, ROOM_B_HALF, ROOM_B_FLOOR, ROOM_B_ROOF, seed ^ 0x3c3, { side: -1 }, { side: 1 });
    this.tunnel(seed);
    this.furnish(seed);
    scene.add(this.group);
  }

  /** A square room: floor, roof, four bare walls; one wall may be split by a doorway of the hall's width,
   *  and one by the high tunnel mouth (U4). */
  private room(cx: number, cz: number, half: number, floorY: number, roofHeight: number, seed: number, opening: { side: 1 | -1 }, high?: { side: 1 | -1 }): void {
    const span = half * 2 + WALL_THICK * 2;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(span, span), new THREE.MeshStandardMaterial({ color: ROCK_DARK, roughness: 1, flatShading: true }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, floorY, cz);
    floor.userData.bareRock = true;
    this.group.add(floor);
    const roof = rockSlab(span, 0.5, span, seed ^ 0x51, 0.35);
    roof.position.set(cx, floorY + roofHeight + 0.25, cz);
    roof.userData.bareRock = true;
    this.group.add(roof);
    // A wall piece: `len` along the wall, full height unless `y0..y1` (above the floor) is given.
    const place = (len: number, x: number, z: number, ry: number, s: number, y0 = -0.5, y1 = roofHeight + 0.0): void => {
      const wall = rockSlab(len, y1 - y0, WALL_THICK, s, 0.2);
      wall.position.set(x, floorY + (y0 + y1) / 2, z);
      wall.rotation.y = ry;
      wall.userData.bareRock = true;
      this.group.add(wall);
    };
    place(span, cx, cz + half + WALL_THICK / 2, 0, seed ^ 0x77);
    place(span, cx, cz - half - WALL_THICK / 2, 0, seed ^ 0x78);
    for (const side of [1, -1] as const) {
      const x = cx + side * (half + WALL_THICK / 2);
      if (high && side === high.side) {
        // The tunnel mouth: two full-height pieces either side, a piece below it and a piece above.
        const segLen = half + WALL_THICK - (TUNNEL_HALF + WALL_THICK);
        for (const sz of [1, -1]) place(segLen, x, cz + sz * (TUNNEL_HALF + WALL_THICK + segLen / 2), Math.PI / 2, seed ^ (0x8b + side + sz));
        const mouth = (TUNNEL_HALF + WALL_THICK) * 2;
        place(mouth, x, cz + TUNNEL_Z, Math.PI / 2, seed ^ 0x8e, -0.5, TUNNEL_BOTTOM);
        place(mouth, x, cz + TUNNEL_Z, Math.PI / 2, seed ^ 0x8f, TUNNEL_BOTTOM + TUNNEL_HEIGHT, roofHeight);
        continue;
      }
      if (side !== opening.side) {
        place(span, x, cz, Math.PI / 2, seed ^ (0x79 + side));
        continue;
      }
      // Split around the doorway: two segments from the corners to the hall's jambs.
      const segLen = half + WALL_THICK - (HALL_HALF + WALL_THICK);
      for (const sz of [1, -1]) {
        place(segLen, x, cz + sz * (HALL_HALF + WALL_THICK + segLen / 2), Math.PI / 2, seed ^ (0x7b + side + sz));
      }
    }
  }

  /** The sloping hall: floor, roof and two walls, pitched so the +x end is HALL_RISE higher. */
  private hallway(seed: number): void {
    const pitch = Math.atan2(HALL_RISE, HALL_LENGTH);
    const len = Math.hypot(HALL_LENGTH, HALL_RISE) + WALL_THICK * 2; // overlap into both rooms' walls
    const cx = (HALL_X0 + HALL_X1) / 2;
    const cy = GROUND_Y + HALL_RISE / 2;
    const width = HALL_HALF * 2 + WALL_THICK * 2;
    const slab = (w: number, h: number, d: number, x: number, y: number, z: number, s: number, amp: number): void => {
      const m = rockSlab(w, h, d, s, amp);
      m.position.set(x, y, z);
      m.rotation.z = pitch;
      m.userData.bareRock = true;
      this.group.add(m);
    };
    // Floor: top face on the ramp. Roof: underside ROOF_HEIGHT above it. Both offsets are measured
    // perpendicular to the slope, so along y they are /cos(pitch) — small, ignored.
    slab(len, 0.5, width, cx, cy - 0.25, 0, seed ^ 0x101, 0.1);
    slab(len, 0.5, width, cx, cy + ROOF_HEIGHT + 0.25, 0, seed ^ 0x102, 0.3);
    for (const sz of [1, -1]) slab(len, ROOF_HEIGHT + 0.5, WALL_THICK, cx, cy + ROOF_HEIGHT / 2, sz * (HALL_HALF + WALL_THICK / 2), seed ^ (0x110 + sz), 0.2);
  }

  /** U4: the high tunnel out of the dining chamber's +x wall — floor, roof, two walls, dead straight into the dark. */
  private tunnel(seed: number): void {
    const len = TUNNEL_LENGTH + WALL_THICK * 2;
    const cx = TUNNEL_X + TUNNEL_LENGTH / 2;
    const width = TUNNEL_HALF * 2 + WALL_THICK * 2;
    const slab = (w: number, h: number, d: number, x: number, y: number, z: number, s: number, amp: number): void => {
      const m = rockSlab(w, h, d, s, amp);
      m.position.set(x, y, z);
      m.userData.bareRock = true;
      this.group.add(m);
    };
    slab(len, 0.5, width, cx, TUNNEL_FLOOR - 0.25, TUNNEL_Z, seed ^ 0x201, 0.1);
    slab(len, 0.5, width, cx, TUNNEL_FLOOR + TUNNEL_HEIGHT + 0.25, TUNNEL_Z, seed ^ 0x202, 0.3);
    for (const sz of [1, -1]) slab(len, TUNNEL_HEIGHT + 0.5, WALL_THICK, cx, TUNNEL_FLOOR + TUNNEL_HEIGHT / 2, TUNNEL_Z + sz * (TUNNEL_HALF + WALL_THICK / 2), seed ^ (0x210 + sz), 0.2);
    // Its far end is sealed for now: they run out of sight, not out of the world.
    slab(WALL_THICK, TUNNEL_HEIGHT + 0.5, width, TUNNEL_X + TUNNEL_LENGTH + WALL_THICK / 2, TUNNEL_FLOOR + TUNNEL_HEIGHT / 2, TUNNEL_Z, seed ^ 0x220, 0.2);
  }

  /** Crude tables and chairs in the second chamber, and where their tops are for the food.
   *  Sized to him: his eye is 0.55 above the floor (player.ts EYE_HEIGHT), so a table top at 0.42. */
  private furnish(seed: number): void {
    const rand = mulberry32(seed ^ 0x7ab1e);
    const TABLE_H = 0.42;
    const table = (x: number, z: number, yaw: number): void => {
      const g = new THREE.Group();
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.6), wood);
      top.position.y = TABLE_H - 0.03;
      g.add(top);
      for (const sx of [1, -1]) {
        for (const sz of [1, -1]) {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, TABLE_H - 0.06, 0.08), woodDark);
          leg.position.set(sx * 0.55, (TABLE_H - 0.06) / 2, sz * 0.21);
          g.add(leg);
        }
      }
      g.position.set(x, ROOM_B_FLOOR, z);
      g.rotation.y = yaw;
      this.group.add(g);
      this.tables.push({ x, z, y: ROOM_B_FLOOR + TABLE_H, yaw, halfLength: 0.6, halfWidth: 0.26 });
      for (const s of [1, -1]) this.furniture.push({ x: x + Math.cos(yaw) * s * 0.3, z: z - Math.sin(yaw) * s * 0.3, radius: 0.42 });
    };
    const chair = (x: number, z: number, yaw: number): void => {
      const g = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.3), wood);
      seat.position.y = 0.24;
      g.add(seat);
      for (const sx of [1, -1]) {
        for (const sz of [1, -1]) {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 0.045), woodDark);
          leg.position.set(sx * 0.12, 0.12, sz * 0.12);
          g.add(leg);
        }
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.3, 0.045), woodDark);
        post.position.set(sx * 0.12, 0.39, -0.13);
        g.add(post);
      }
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.035), wood);
      rail.position.set(0, 0.5, -0.13);
      g.add(rail);
      g.position.set(x, ROOM_B_FLOOR, z);
      g.rotation.y = yaw + (rand() - 0.5) * 0.3;
      this.group.add(g);
      this.furniture.push({ x, z, radius: 0.2 });
    };
    // Two tables, chairs pulled up to their long sides, all a little off square.
    const t1 = { x: ROOM_B_CX - 1.2, z: 0.8, yaw: 0.18 };
    const t2 = { x: ROOM_B_CX + 1.3, z: -1.2, yaw: -0.35 };
    for (const t of [t1, t2]) {
      table(t.x, t.z, t.yaw);
      const nx = -Math.sin(t.yaw), nz = -Math.cos(t.yaw); // the table's across axis
      for (const [along, side] of [[-0.36, 1], [0.34, 1], [-0.05, -1]] as const) {
        const ax = Math.cos(t.yaw) * along, az = -Math.sin(t.yaw) * along;
        chair(t.x + ax + nx * side * 0.58, t.z + az + nz * side * 0.58, t.yaw + (side > 0 ? Math.PI : 0));
      }
    }
  }

  /** Floor height above GROUND_Y: the hall climbs, the second chamber sits at its top. */
  groundHeight = (x: number, _z: number): number => HALL_RISE * Math.min(1, Math.max(0, (x - HALL_X0) / HALL_LENGTH));

  /** Inside a room or the hall, off the walls. Boulders and furniture block by collider. */
  isWalkable = (p: THREE.Vector3): boolean => {
    if (Math.abs(p.x) < HALF - 0.45 && Math.abs(p.z) < HALF - 0.45) return true;
    if (p.x > HALL_X0 - 0.5 && p.x < HALL_X1 + 0.5 && Math.abs(p.z) < HALL_HALF - 0.3) return true;
    return Math.abs(p.x - ROOM_B_CX) < ROOM_B_HALF - 0.45 && Math.abs(p.z) < ROOM_B_HALF - 0.45;
  };

  /** Where the third-person camera may be: inside the rooms' or the hall's air, not in the rock. */
  cameraClear = (p: THREE.Vector3): boolean => {
    const m = 0.25;
    const inBox = (cx: number, half: number, floorY: number, roof: number): boolean => Math.abs(p.x - cx) < half - m && Math.abs(p.z) < half - m && p.y > floorY + 0.1 && p.y < floorY + roof - m;
    if (inBox(0, HALF, GROUND_Y, ROOF_HEIGHT) || inBox(ROOM_B_CX, ROOM_B_HALF, ROOM_B_FLOOR, ROOM_B_ROOF)) return true;
    if (p.x < HALL_X0 - 0.3 || p.x > HALL_X1 + 0.3 || Math.abs(p.z) > HALL_HALF - m) return false;
    const floorY = GROUND_Y + this.groundHeight(p.x, p.z);
    return p.y > floorY + 0.1 && p.y < floorY + ROOF_HEIGHT - m;
  };

  colliders(): CircleCollider[] {
    return [...this.boulders.flatMap((b) => b.collider() ?? []), ...this.furniture];
  }

  /** Bare rock meshes, for the "immune" tap. */
  bareRock(): THREE.Object3D[] {
    return this.group.children.filter((m) => m.userData.bareRock);
  }

  /** Per frame: the darksight's reach. `boost` (U2, the helm) brightens the light and the ambient beyond full. */
  setSight(cameraPosition: THREE.Vector3, sight: number, boost = 1): void {
    this.fog.density = 1.5 / sight;
    this.darksight.position.copy(cameraPosition);
    this.darksight.distance = sight * 1.3;
    const k = Math.min(1, sight / SIGHT_AT_FULL_REF);
    this.darksight.intensity = DARKSIGHT_INTENSITY * (0.55 + 0.45 * k) * boost;
    // Boosted, the light also falls off more gently, so the far walls of a room are lit, not just reached.
    this.darksight.decay = boost > 1 ? DARKSIGHT_DECAY_HELM : DARKSIGHT_DECAY;
    this.hemi.intensity = DARKSIGHT_AMBIENT * (0.5 + 0.5 * k) * boost;
  }
}
const SIGHT_DEFAULT = 16;
const SIGHT_AT_FULL_REF = 16;
