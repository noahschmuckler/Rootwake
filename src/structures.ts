// Pass 1.0c: structures. A structure is the pieces built into it by
// blueprints (blueprints.ts) — every piece a real world object, placed in
// the structure's frame, no longer collectible — plus what the rest of the
// game reads off them: which logs block the player, where the roof keeps
// rain off, whether there is a bed to sleep in. Building and taking apart
// are board sessions at the site (site.ts); this file holds no rules about
// what goes where — the blueprints do.

import * as THREE from 'three';
import { DOOR_GAP, HALF_LOG_LENGTH, type ObjectWorld, type WorldObject } from './objects';
import type { SegmentCollider } from './player';
import { P, ROOF_SLATS, T, type Blueprint, type PiecePlan, type StructureLike } from './blueprints';

// ---- Tuning constants ---------------------------------------------------------
/** A log below this height blocks you; above it you walk under (eye is 0.55). */
export const HEAD_HEIGHT = 0.9;
/** Roof slats keep this much of each side dry (a long timber over 2-bay walls). */
export const SLAT_HALF_ACROSS = 1.15;
export const SLAT_HALF_ALONG = 0.12;
/** Logs rest with their centre LOG_RADIUS above the ground they are given: what spawn adds. */
const OBJECT_REST = 0.17;
// -------------------------------------------------------------------------------

export interface Placed {
  obj: WorldObject;
  plan: PiecePlan;
  /** World height of the piece's centre. */
  y: number;
}

/** A patch of ground a roof keeps dry: an oriented rectangle at height y (rain stops there). */
export interface DryStrip {
  x: number;
  z: number;
  yaw: number;
  halfAlong: number;
  halfAcross: number;
  y: number;
}

export class Structure implements StructureLike {
  readonly pieces: Placed[] = [];

  constructor(
    readonly center: THREE.Vector3,
    /** The frame's long axis: `along` runs this way; the open front of a U is +along. */
    readonly yaw: number
  ) {}

  // ---- what has been built, read off the pieces ----
  get courses(): number {
    return Math.floor(this.pieces.filter((p) => p.plan.tag === 'course').length / 3);
  }
  get doorCourses(): number {
    return Math.floor(this.pieces.filter((p) => p.plan.tag === 'door').length / 2);
  }
  get roofSlats(): number {
    return this.pieces.filter((p) => p.plan.tag === 'roof').length;
  }
  get floorBoards(): number {
    return this.pieces.filter((p) => p.plan.tag === 'floor').length;
  }
  get bedPieces(): number {
    return this.pieces.filter((p) => p.plan.tag === 'bed').length;
  }
  get bed(): boolean {
    return this.bedPieces >= 7; // two rails and five sticks
  }
  /** Top of the side walls above ground: where the next course or the roof sits. */
  get wallTop(): number {
    return T * this.courses;
  }
  /** Roof over it, 0..1. */
  get shelter(): number {
    return Math.min(1, this.roofSlats / ROOF_SLATS);
  }

  /** Where a blueprint's pieces sit: its own rule, else by its siting. */
  baseFor(bp: Blueprint): number {
    if (bp.baseOf) return bp.baseOf(this);
    if (bp.siting === 'top') return this.wallTop;
    if (bp.siting === 'inside') return this.floorBoards > 0 ? 0.1 : 0;
    return 0;
  }

  // ---- frame ----
  local(x: number, z: number): { along: number; across: number } {
    const dx = x - this.center.x;
    const dz = z - this.center.z;
    return { along: dx * Math.cos(this.yaw) - dz * Math.sin(this.yaw), across: dx * Math.sin(this.yaw) + dz * Math.cos(this.yaw) };
  }
  world(along: number, across: number): THREE.Vector3 {
    return new THREE.Vector3(this.center.x + along * Math.cos(this.yaw) + across * Math.sin(this.yaw), 0, this.center.z - along * Math.sin(this.yaw) + across * Math.cos(this.yaw));
  }

  /** Inside the walls. */
  inside(x: number, z: number): boolean {
    if (this.courses === 0) return false;
    const l = this.local(x, z);
    return Math.abs(l.along) <= P - T / 2 && Math.abs(l.across) <= P - T / 2;
  }

  /** Under the roof: the footprint, when any slat is up. */
  covers(x: number, z: number): boolean {
    if (this.roofSlats === 0) return false;
    const l = this.local(x, z);
    return Math.abs(l.along) <= P + 0.15 && Math.abs(l.across) <= P + 0.15;
  }

  /** What the roof keeps dry: one strip per slat until the roof is whole, then the whole footprint. */
  dryStrips(groundY: number): DryStrip[] {
    const slats = this.pieces.filter((p) => p.plan.tag === 'roof');
    if (slats.length === 0) return [];
    if (slats.length >= ROOF_SLATS) {
      return [{ x: this.center.x, z: this.center.z, yaw: this.yaw, halfAlong: P + 0.15, halfAcross: SLAT_HALF_ACROSS, y: groundY + slats[0].y }];
    }
    return slats.map((s) => ({ x: s.obj.position.x, z: s.obj.position.z, yaw: this.yaw, halfAlong: SLAT_HALF_ALONG, halfAcross: SLAT_HALF_ACROSS, y: groundY + s.y }));
  }

  /** Wall logs low enough to block you: a thick segment along each. */
  colliders(): SegmentCollider[] {
    const out: SegmentCollider[] = [];
    for (const p of this.pieces) {
      if (p.plan.tag !== 'course' && p.plan.tag !== 'door' && p.plan.tag !== 'cut') continue;
      if (p.y > HEAD_HEIGHT) continue;
      const half = (p.obj.type.halfLength ?? 0.3) - 0.05;
      const yaw = p.obj.group.rotation.y;
      const ax = Math.cos(yaw) * half;
      const az = -Math.sin(yaw) * half;
      out.push({ x1: p.obj.position.x - ax, z1: p.obj.position.z - az, x2: p.obj.position.x + ax, z2: p.obj.position.z + az, radius: T / 2 });
    }
    return out;
  }

  // ---- walls and the doorway cut (1.1) ----
  /** Which wall a course log belongs to, by where it lies in the frame. */
  wallOf(p: Placed): 'A' | 'B' | 'back' | null {
    if (p.plan.tag !== 'course') return null;
    if (p.plan.yaw !== 0) return 'back';
    return p.plan.across < 0 ? 'A' : 'B';
  }

  /** The course logs of a wall still whole (not cut), lowest first. */
  uncutLogs(wall: 'A' | 'B' | 'back'): Placed[] {
    return this.pieces.filter((p) => this.wallOf(p) === wall && p.obj.type.id === 'log_long_notched').sort((a, b) => a.y - b.y);
  }

  /**
   * Cut a doorway through one course log of a wall: the log's middle comes out
   * as a knuckle (its notch and all) and two half logs stay either side, each
   * keeping its outer notch. Returns the knuckle, lying on the ground outside.
   */
  cutCourse(wall: 'A' | 'B' | 'back', objects: ObjectWorld, groundY: number): WorldObject | null {
    const target = this.uncutLogs(wall)[0];
    if (!target) return null;
    const yaw = target.obj.group.rotation.y;
    const ax = Math.cos(yaw);
    const az = -Math.sin(yaw);
    const off = DOOR_GAP / 2 + HALF_LOG_LENGTH / 2;
    const c = target.obj.position;
    const y = groundY + target.y;
    objects.remove(target.obj);
    // The half at -axis keeps the log's yaw (its outer end is local -X); the other turns about.
    const left = objects.spawn('log_half', c.x - ax * off, y - OBJECT_REST, c.z - az * off, yaw);
    const right = objects.spawn('log_half', c.x + ax * off, y - OBJECT_REST, c.z + az * off, yaw + Math.PI);
    const i = this.pieces.indexOf(target);
    this.pieces.splice(i, 1, { obj: left, plan: target.plan, y: target.y }, { obj: right, plan: { ...target.plan, tag: 'cut' }, y: target.y });
    for (const h of [left, right]) {
      h.collectible = false;
      h.mesh.traverse((m) => (m.userData.structure = this));
    }
    // The knuckle: out through the new gap, a step outside the wall.
    const outward = this.wallOf(target) === 'back' ? this.world(-1, 0).sub(this.center).normalize() : this.world(0, target.plan.across).sub(this.center).normalize();
    return objects.spawn('log_stub', c.x + outward.x * 0.7, groundY, c.z + outward.z * 0.7, yaw + Math.PI / 2);
  }

  /** A blueprint piece is in place. */
  place(obj: WorldObject, plan: PiecePlan, y: number): void {
    obj.collectible = false;
    obj.mesh.traverse((m) => (m.userData.structure = this));
    this.pieces.push({ obj, plan, y });
  }

  /** Take the last piece off (taking apart runs in reverse). */
  removeLast(): Placed | undefined {
    const p = this.pieces.pop();
    if (p) {
      p.obj.collectible = true;
      p.obj.mesh.traverse((m) => delete m.userData.structure);
    }
    return p;
  }
}

export class Structures {
  readonly list: Structure[] = [];

  constructor(readonly groundY: number) {}

  add(s: Structure): void {
    if (!this.list.includes(s)) this.list.push(s);
  }
  remove(s: Structure): void {
    const i = this.list.indexOf(s);
    if (i >= 0) this.list.splice(i, 1);
  }

  /** Meshes for raycasting (cast recursively); each part carries userData.structure. */
  raycastTargets(): THREE.Object3D[] {
    return this.list.flatMap((s) => s.pieces.map((p) => p.obj.mesh));
  }
  dryStrips(): DryStrip[] {
    return this.list.flatMap((s) => s.dryStrips(this.groundY));
  }
  colliders(): SegmentCollider[] {
    return this.list.flatMap((s) => s.colliders());
  }
  /** Roof over a ground point, 0 (open sky) .. 1 (a whole roof). */
  shelterAt(x: number, z: number): number {
    let best = 0;
    for (const s of this.list) if (s.covers(x, z)) best = Math.max(best, s.shelter);
    return best;
  }
  /** A structure with a bed that you are standing inside, or null. */
  bedNear(x: number, z: number): Structure | null {
    return this.list.find((s) => s.bed && s.inside(x, z)) ?? null;
  }
}
