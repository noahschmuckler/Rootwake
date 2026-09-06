// Pass 1.0b: structures — Lincoln Logs (SYSTEMS.md §5.4, DESIGN.md).
//
// One convention makes the system: the notch grid. Notches sit on a square
// lattice of NOTCH_PITCH; a log lies between grid points; courses alternate
// direction by 90°, each log dropping into the notches of the two below it;
// walls rise half a log per course; ends overhang the crossing. Nothing ever
// stacks parallel. A structure exposes its open *slots* (where the next piece
// fits, and what taking it means) and a released piece takes the nearest
// slot within SNAP_REACH — courses, roof slats, floorboards, the bed.
//
// The first (and so far only) structure is the cabin: two bays long, one
// wide, COURSES high, a doorway in one short wall, a flat slat roof, a
// timber floor, and a bed of sticks laid on the floor. The bed is furniture
// inside; you build the roof first (designer, after 1.0: "no sane survivalist
// builds a bed before they have a roof").
//
// Pieces in a structure stop being collectible: the hands ignore them, tilling
// stays blocked under them, wall logs block the player (colliders). Open
// question (flagged): taking a structure apart again is not built.

import * as THREE from 'three';
import { LOG_OVERHANG, LOG_RADIUS, NOTCH_PITCH, OBJECT_TYPES, type ObjectTypeId, type ObjectWorld, type WorldObject } from './objects';
import type { SegmentCollider } from './player';

// ---- Tuning constants ---------------------------------------------------------
/** A released piece within this distance of a slot snaps into it. */
export const SNAP_REACH = 0.9;
/** The bay: notch pitch (objects.ts). Log thickness: a course rises this much per direction. */
export const PITCH = NOTCH_PITCH;
export const LOG_T = LOG_RADIUS * 2;
/**
 * Courses per direction. Three puts the roof at ~1.07 m over a 0.55 eye.
 * Designer, after 1.0: "an interior, walkable floor — a cabin." Tuning against
 * the build cost (each course is two long logs and two short).
 */
export const COURSES = 3;
/** Slats across the roof and boards across the floor; spaced their own width, so a full set is solid. */
export const ROOF_TIMBERS = 6;
export const FLOOR_TIMBERS = 6;
export const TIMBER_SPACING = 0.24;
export const TIMBER_HALF_ACROSS = 0.6;
export const TIMBER_HALF_ALONG = 0.12;
/** Sticks laid on the floor for a bed. One hand of sticks (small: 5) — deliberate. */
export const BED_STICKS = 5;
/** Roof height: the top of the long walls (COURSES logs) plus a slat's half thickness. */
export const ROOF_Y = LOG_T * COURSES + 0.05;
// -------------------------------------------------------------------------------

/** A patch of ground a roof keeps dry: an oriented rectangle at height y (rain stops there). */
export interface DryStrip {
  x: number;
  z: number;
  yaw: number;
  halfAlong: number;
  halfAcross: number;
  y: number;
}

/** A place a structure offers a piece: where it will rest, and what taking it means. */
export interface Slot {
  type: ObjectTypeId;
  x: number;
  z: number;
  /** Ground level the piece rests on (its own restHeight is added). */
  groundY: number;
  yaw: number;
  take: (piece: WorldObject) => void;
  /** Hint after it snaps. */
  says: string;
}

/** A fitting: `piece`, let go near a loose `onto`, snaps parallel to it `gap` away, and the pair founds a structure. */
export interface Fitting {
  piece: ObjectTypeId;
  onto: ObjectTypeId;
  gap: number;
}
/** Two long notched logs a bay apart: the sills of a cabin. */
export const FITTINGS: Fitting[] = [{ piece: 'log_long_notched', onto: 'log_long_notched', gap: PITCH }];

type End = 0 | 1;

export class Cabin {
  readonly center: THREE.Vector3;
  /** The long axis. Long logs lie along it; short logs across it. */
  readonly yaw: number;
  /** Long-wall courses per side (index 0 at across −PITCH/2); course 0 is the sill. */
  readonly longs: WorldObject[][];
  /** Short-wall courses per end (index 0 at along −PITCH); the door end only ever gets the lintel. */
  readonly shorts: WorldObject[][] = [[], []];
  /** The end whose first cross log went down; the other end is the doorway. */
  backEnd: End | null = null;
  readonly roof: WorldObject[] = [];
  readonly floor: WorldObject[] = [];
  bedSticks = 0;
  /** The bed's visible sticks. */
  readonly group = new THREE.Group();

  constructor(sillA: WorldObject, sillB: WorldObject, yaw: number) {
    this.yaw = yaw;
    this.center = sillA.position.clone().add(sillB.position).multiplyScalar(0.5);
    // Order the sills by their across coordinate so side 0 is at −PITCH/2.
    const a = this.local(sillA.position.x, sillA.position.z).across;
    this.longs = a < 0 ? [[sillA], [sillB]] : [[sillB], [sillA]];
    for (const p of [sillA, sillB]) this.own(p);
  }

  /** Cabin-local coordinates: along the long axis, across it. */
  local(x: number, z: number): { along: number; across: number } {
    const dx = x - this.center.x;
    const dz = z - this.center.z;
    return { along: dx * Math.cos(this.yaw) - dz * Math.sin(this.yaw), across: dx * Math.sin(this.yaw) + dz * Math.cos(this.yaw) };
  }

  /** World point from cabin-local coordinates. */
  world(along: number, across: number): THREE.Vector3 {
    return new THREE.Vector3(this.center.x + along * Math.cos(this.yaw) + across * Math.sin(this.yaw), 0, this.center.z - along * Math.sin(this.yaw) + across * Math.cos(this.yaw));
  }

  private own(piece: WorldObject): void {
    piece.collectible = false;
    piece.mesh.traverse((m) => (m.userData.structure = this));
  }

  get doorEnd(): End | null {
    return this.backEnd === null ? null : ((1 - this.backEnd) as End);
  }

  get longWallsUp(): boolean {
    return this.longs.every((w) => w.length >= COURSES);
  }

  /** Walls complete: long walls, the back wall, and the lintel over the door. */
  get wallsUp(): boolean {
    return this.longWallsUp && this.backEnd !== null && this.shorts[this.backEnd].length >= COURSES && this.shorts[this.doorEnd!].length >= 1;
  }

  /** Roof over it, 0..1. */
  get shelter(): number {
    return this.roof.length / ROOF_TIMBERS;
  }

  get floored(): boolean {
    return this.floor.length >= FLOOR_TIMBERS;
  }

  get bed(): boolean {
    return this.bedSticks >= BED_STICKS;
  }

  /** Inside the walls (the walkable floor). */
  inside(x: number, z: number): boolean {
    const l = this.local(x, z);
    return Math.abs(l.along) <= PITCH - LOG_RADIUS && Math.abs(l.across) <= PITCH / 2 - LOG_RADIUS;
  }

  /** Under the roof: the footprint, when any slat is up. */
  covers(x: number, z: number): boolean {
    if (this.shelter <= 0) return false;
    const l = this.local(x, z);
    return Math.abs(l.along) <= PITCH + LOG_OVERHANG && Math.abs(l.across) <= PITCH / 2 + LOG_RADIUS;
  }

  /** What the roof keeps dry: one strip per slat until the roof is whole, then the whole footprint. */
  dryStrips(groundY: number): DryStrip[] {
    if (this.roof.length === 0) return [];
    const y = groundY + ROOF_Y;
    if (this.roof.length >= ROOF_TIMBERS) return [{ x: this.center.x, z: this.center.z, yaw: this.yaw, halfAlong: PITCH + LOG_OVERHANG, halfAcross: TIMBER_HALF_ACROSS, y }];
    return this.roof.map((_, k) => {
      const at = this.world(Cabin.timberAlong(k), 0);
      return { x: at.x, z: at.z, yaw: this.yaw, halfAlong: TIMBER_HALF_ALONG, halfAcross: TIMBER_HALF_ACROSS, y };
    });
  }

  /** Wall logs low enough to block you: the long walls, and any short wall below head height. */
  colliders(): SegmentCollider[] {
    const out: SegmentCollider[] = [];
    const half = PITCH + LOG_OVERHANG;
    for (const side of [0, 1] as const) {
      const across = (side === 0 ? -1 : 1) * (PITCH / 2);
      const a = this.world(-half, across);
      const b = this.world(half, across);
      out.push({ x1: a.x, z1: a.z, x2: b.x, z2: b.z, radius: LOG_RADIUS });
    }
    for (const end of [0, 1] as const) {
      // Course 0 or 1 across an end is a wall; the lintel alone (course COURSES-1 over the door) is above your head.
      const low = this.shorts[end].some((_, k) => Cabin.shortCourseOf(this, end, k) < COURSES - 1);
      if (!low) continue;
      const along = (end === 0 ? -1 : 1) * PITCH;
      const a = this.world(along, -PITCH / 2 - LOG_OVERHANG);
      const b = this.world(along, PITCH / 2 + LOG_OVERHANG);
      out.push({ x1: a.x, z1: a.z, x2: b.x, z2: b.z, radius: LOG_RADIUS });
    }
    return out;
  }

  /** Which course the k-th log across an end is: the door end's only log is the lintel. */
  private static shortCourseOf(c: Cabin, end: End, k: number): number {
    return end === c.doorEnd ? COURSES - 1 : k;
  }

  /** Along-position of the k-th slat or board: spread from the centre, their own width apart. */
  static timberAlong(k: number): number {
    return (k - (ROOF_TIMBERS - 1) / 2) * TIMBER_SPACING;
  }

  /** The slots this structure offers right now. */
  slots(groundY: number): Slot[] {
    const out: Slot[] = [];
    const logsLaid = this.longs[0].length + this.longs[1].length + this.shorts[0].length + this.shorts[1].length;
    const logsTotal = COURSES * 2 + COURSES + 1;

    // Long courses: course k on a side needs the back wall's course k-1 to rest on (except the sills).
    for (const side of [0, 1] as const) {
      const k = this.longs[side].length;
      if (k >= COURSES) continue;
      if (k >= 1 && (this.backEnd === null || this.shorts[this.backEnd].length < k)) continue;
      const at = this.world(0, (side === 0 ? -1 : 1) * (PITCH / 2));
      out.push({
        type: 'log_long_notched',
        x: at.x,
        z: at.z,
        groundY: groundY + LOG_T * k,
        yaw: this.yaw,
        take: (piece) => {
          this.longs[side].push(piece);
          this.own(piece);
        },
        says: `A long log on the wall: ${logsLaid + 1} of ${logsTotal} logs.`,
      });
    }

    // Short courses across the ends: the first cross log names the back wall; the other end stays open for the door.
    for (const end of [0, 1] as const) {
      const k = this.shorts[end].length;
      const along = (end === 0 ? -1 : 1) * PITCH;
      const at = this.world(along, 0);
      const yaw = this.yaw + Math.PI / 2;
      if (this.backEnd === null) {
        if (this.longs.every((w) => w.length >= 1)) {
          out.push({
            type: 'log_notched',
            x: at.x,
            z: at.z,
            groundY: groundY + LOG_T / 2,
            yaw,
            take: (piece) => {
              this.backEnd = end;
              this.shorts[end].push(piece);
              this.own(piece);
            },
            says: 'The first cross log: that is the back wall. The other end stays open for the door. Now a long log on each side.',
          });
        }
      } else if (end === this.backEnd) {
        // Course k across the back rests in the long walls' course k.
        if (k < COURSES && this.longs.every((w) => w.length >= k + 1)) {
          out.push({
            type: 'log_notched',
            x: at.x,
            z: at.z,
            groundY: groundY + LOG_T / 2 + LOG_T * k,
            yaw,
            take: (piece) => {
              this.shorts[end].push(piece);
              this.own(piece);
            },
            says: logsLaid + 1 >= logsTotal - 1 ? 'The back wall is up. One more: the lintel over the door.' : `A cross log on the back wall: ${logsLaid + 1} of ${logsTotal} logs.`,
          });
        }
      } else if (k === 0 && this.longWallsUp) {
        // The lintel: the one log across the doorway, up top.
        out.push({
          type: 'log_notched',
          x: at.x,
          z: at.z,
          groundY: groundY + LOG_T / 2 + LOG_T * (COURSES - 1),
          yaw,
          take: (piece) => {
            this.shorts[end].push(piece);
            this.own(piece);
          },
          says: 'The lintel over the door. The walls are up: timber across the top for a roof.',
        });
      }
    }

    // Roof slats across the long walls, once they are up; then floorboards, once the roof is whole (roof first).
    const roofOpen = this.longWallsUp && this.roof.length < ROOF_TIMBERS;
    if (roofOpen) {
      const k = this.roof.length;
      const at = this.world(Cabin.timberAlong(k), 0);
      out.push({
        type: 'timber',
        x: at.x,
        z: at.z,
        groundY: groundY + ROOF_Y - 0.05,
        yaw: this.yaw + Math.PI / 2,
        take: (piece) => {
          this.roof.push(piece);
          this.own(piece);
        },
        says: k + 1 >= ROOF_TIMBERS ? 'The roof is whole. Timber inside for a floor.' : `A slat across the roof: ${k + 1} of ${ROOF_TIMBERS}.`,
      });
    } else if (this.floor.length < FLOOR_TIMBERS) {
      const k = this.floor.length;
      const at = this.world(Cabin.timberAlong(k), 0);
      out.push({
        type: 'timber',
        x: at.x,
        z: at.z,
        groundY,
        yaw: this.yaw + Math.PI / 2,
        take: (piece) => {
          this.floor.push(piece);
          this.own(piece);
        },
        says: k + 1 >= FLOOR_TIMBERS ? 'A floor. Lay a hand of sticks on it for a bed.' : `A floorboard: ${k + 1} of ${FLOOR_TIMBERS}.`,
      });
    }
    return out;
  }

  /** Sticks laid on the floor: the bed, at the back end. Returns how many it took. */
  addSticks(count: number, groundY: number): number {
    if (!this.floored) return 0;
    const take = Math.min(count, BED_STICKS - this.bedSticks);
    for (let i = 0; i < take; i++) {
      const k = this.bedSticks + i;
      const mesh = OBJECT_TYPES.stick.build();
      const holder = new THREE.Group();
      holder.add(mesh);
      const along = (this.backEnd === 0 ? -1 : 1) * (0.62 - k * 0.14);
      holder.position.copy(this.world(along, 0));
      holder.position.y = groundY + 0.1 + 0.03; // on the floorboards
      holder.rotation.y = this.yaw + Math.PI / 2;
      holder.traverse((m) => (m.userData.structure = this));
      this.group.add(holder);
    }
    this.bedSticks += take;
    return take;
  }
}

export class Structures {
  readonly list: Cabin[] = [];
  readonly group = new THREE.Group();
  /** What the last snap said (a hint for main). */
  lastSays = '';

  constructor(scene: THREE.Scene, private readonly groundY: number) {
    scene.add(this.group);
  }

  /**
   * A piece was let go: the nearest slot within SNAP_REACH takes it — a slot
   * on a standing structure, or a fitting beside a loose piece that founds a
   * new one. Returns the structure it joined, or null.
   */
  trySnap(piece: WorldObject, objects: ObjectWorld): Cabin | null {
    if (!piece.collectible) return null;
    let best: { slot: Slot; s: Cabin; d: number } | null = null;
    for (const s of this.list) {
      for (const slot of s.slots(this.groundY)) {
        if (slot.type !== piece.type.id) continue;
        const d = Math.hypot(piece.position.x - slot.x, piece.position.z - slot.z);
        if (d <= SNAP_REACH && (!best || d < best.d)) best = { slot, s, d };
      }
    }
    if (best) {
      piece.rest(best.slot.x, best.slot.groundY, best.slot.z, best.slot.yaw);
      best.slot.take(piece);
      this.lastSays = best.slot.says;
      return best.s;
    }
    for (const fit of FITTINGS) {
      if (piece.type.id !== fit.piece) continue;
      const candidates = objects.objects.filter((o) => o !== piece && o.collectible && o.type.id === fit.onto);
      for (const onto of candidates) {
        const yaw = onto.group.rotation.y;
        const perp = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)); // across the log
        for (const side of [1, -1]) {
          const slot = onto.position.clone().addScaledVector(perp, fit.gap * side);
          if (Math.hypot(piece.position.x - slot.x, piece.position.z - slot.z) > SNAP_REACH) continue;
          piece.rest(slot.x, this.groundY, slot.z, yaw);
          const s = new Cabin(onto, piece, yaw);
          this.group.add(s.group);
          this.list.push(s);
          this.lastSays = 'Two sills, a bay apart. A cross log on one end next — the first one is the back wall; the other end stays open for the door.';
          return s;
        }
      }
    }
    return null;
  }

  /** Meshes for raycasting (cast recursively); each part carries userData.structure. */
  raycastTargets(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    for (const s of this.list) {
      for (const side of s.longs) for (const w of side) out.push(w.mesh);
      for (const end of s.shorts) for (const w of end) out.push(w.mesh);
      for (const r of s.roof) out.push(r.mesh);
      for (const f of s.floor) out.push(f.mesh);
      out.push(s.group);
    }
    return out;
  }

  /** Everything the roofs keep dry, for the rain. */
  dryStrips(): DryStrip[] {
    return this.list.flatMap((s) => s.dryStrips(this.groundY));
  }

  /** Wall logs, for the player. */
  colliders(): SegmentCollider[] {
    return this.list.flatMap((s) => s.colliders());
  }

  /** Roof over a ground point, 0 (open sky) .. 1 (a whole roof). */
  shelterAt(x: number, z: number): number {
    let best = 0;
    for (const s of this.list) if (s.covers(x, z)) best = Math.max(best, s.shelter);
    return best;
  }

  /** A cabin with a bed that you are standing inside, or null. */
  bedNear(x: number, z: number): Cabin | null {
    return this.list.find((s) => s.bed && s.inside(x, z)) ?? null;
  }

  /** Lay sticks on a cabin's floor for a bed. Returns how many it took. */
  addSticks(s: Cabin, count: number): number {
    const took = s.addSticks(count, this.groundY);
    if (took > 0) this.lastSays = s.bed ? 'A bed, inside, under a roof.' : `Sticks on the floor: ${s.bedSticks} of ${BED_STICKS}.`;
    return took;
  }
}
