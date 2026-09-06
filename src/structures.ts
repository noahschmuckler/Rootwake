// Pass 0.9: structures (SYSTEMS.md §5.4, ROADMAP 0.9). Shaped logs are
// objects with weight and *fittings*: a notched log let go beside another
// notched log snaps into place, and the pair is a structure. Structures then
// take fills — sticks laid across a bed frame make a bed. Everything here is
// data (which piece fits which, at what offset, what it yields, what fills
// it) plus the small amount of geometry to snap and to lay the fill. This is
// DiggyDwarves' structure model reduced to its rows; none of its UI.
//
// Pass 1.0: the bed frame is also the first shelter's foundation. A notched
// log let go by the frame stacks onto its side log (a wall, one per side);
// with both walls up, timber let go by it lays across the top — a roof over
// the bed, ROOF_TIMBERS wide. Shelter quality is how much of the roof is
// there. So every fitting is a *slot* a structure offers for a piece type,
// and a released piece takes the nearest slot within SNAP_REACH.
//
// Pieces in a structure stop being collectible: the hands ignore them, tilling
// stays blocked under them. Open question (flagged): taking a structure apart
// again is not built — a bed is permanent for now.

import * as THREE from 'three';
import { OBJECT_TYPES, type ObjectTypeId, type ObjectWorld, type WorldObject } from './objects';

// ---- Tuning constants ---------------------------------------------------------
/** A released piece within this distance of a fitting slot snaps into it. */
export const SNAP_REACH = 0.9;
/** Sticks a bed frame takes before it is a bed. One hand of sticks (small: 5) is exactly a bed — deliberate. */
export const BED_STICKS = 5;
/** Standing within this of a bed's centre, the rest gesture is a night in bed. */
export const BED_REST_REACH = 1.3;
/** Pass 1.0: timbers a roof takes to be whole; how high a stacked wall log sits; the roof's height above ground. */
export const ROOF_TIMBERS = 4;
export const WALL_COURSE_HEIGHT = 0.34; // a log's diameter: the next log rests on the one below
export const ROOF_HEIGHT = 0.18 + WALL_COURSE_HEIGHT + 0.17; // ground → top of the wall log, where timber rests
/** "Under the roof" is the frame's footprint plus this margin (SYSTEMS §4 working definition, simplified from an up-ray). */
export const SHELTER_MARGIN = 0.35;
// -------------------------------------------------------------------------------

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

export type StructureKind = 'bed_frame' | 'bed';

/** A fitting: `piece`, let go near `onto`, snaps parallel to it `gap` away, and the pair is a `yields`. */
export interface Fitting {
  piece: ObjectTypeId;
  onto: ObjectTypeId;
  gap: number;
  yields: StructureKind;
}

/** A fill: a `structure` takes `count` of `takes` laid onto it, and becomes `yields`. */
export interface Fill {
  structure: StructureKind;
  takes: ObjectTypeId;
  count: number;
  yields: StructureKind;
}

/** Two notched logs side by side, a stick's length apart (sticks are 0.55): a bed frame. */
export const FITTINGS: Fitting[] = [{ piece: 'log_notched', onto: 'log_notched', gap: 0.45, yields: 'bed_frame' }];
export const FILLS: Fill[] = [{ structure: 'bed_frame', takes: 'stick', count: BED_STICKS, yields: 'bed' }];

export class Structure {
  kind: StructureKind;
  /** The world objects that make it up (still in the world, no longer collectible). */
  readonly pieces: WorldObject[];
  /** Fill laid onto it so far, by type. */
  readonly filled = new Map<ObjectTypeId, number>();
  /** Visible fill (the stick lattice). */
  readonly group = new THREE.Group();
  readonly center: THREE.Vector3;
  readonly yaw: number;
  /** Pass 1.0: a wall log stacked on each side log, and the timbers laid across them. */
  readonly walls: (WorldObject | null)[] = [null, null];
  readonly roof: WorldObject[] = [];

  constructor(kind: StructureKind, pieces: WorldObject[], yaw: number) {
    this.kind = kind;
    this.pieces = pieces;
    this.yaw = yaw;
    this.center = new THREE.Vector3();
    for (const p of pieces) this.center.add(p.position);
    this.center.multiplyScalar(1 / pieces.length);
    for (const p of pieces) {
      p.collectible = false;
      p.mesh.traverse((m) => (m.userData.structure = this));
    }
  }

  /** The fill this structure takes right now, or null if it is complete. */
  get fill(): Fill | null {
    return FILLS.find((f) => f.structure === this.kind) ?? null;
  }

  /** Roof over it, 0..1. */
  get shelter(): number {
    return this.walls.every(Boolean) ? this.roof.length / ROOF_TIMBERS : 0;
  }

  /** Is a ground point under this structure's roof (footprint plus margin)? */
  covers(x: number, z: number): boolean {
    if (this.shelter <= 0) return false;
    const dx = x - this.center.x;
    const dz = z - this.center.z;
    const along = dx * Math.cos(this.yaw) - dz * Math.sin(this.yaw);
    const across = dx * Math.sin(this.yaw) + dz * Math.cos(this.yaw);
    return Math.abs(along) <= 0.62 + SHELTER_MARGIN && Math.abs(across) <= 0.45 + SHELTER_MARGIN;
  }

  /** The slots this structure offers right now. */
  slots(groundY: number): Slot[] {
    const out: Slot[] = [];
    const along = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    // Walls: a notched log on top of each side log.
    this.walls.forEach((w, i) => {
      if (w) return;
      const base = this.pieces[i];
      out.push({
        type: 'log_notched',
        x: base.position.x,
        z: base.position.z,
        groundY: groundY + WALL_COURSE_HEIGHT,
        yaw: this.yaw,
        take: (piece) => {
          this.walls[i] = piece;
        },
        says: this.walls.some(Boolean) ? 'The second wall log. Now timber across the top.' : 'A wall log, stacked on the frame. Another on the other side.',
      });
    });
    // Roof: with both walls up, timber lies across them, spread along the frame.
    if (this.walls.every(Boolean) && this.roof.length < ROOF_TIMBERS) {
      const k = this.roof.length;
      const t = -0.45 + (0.9 * k) / (ROOF_TIMBERS - 1);
      const at = this.center.clone().addScaledVector(along, t);
      out.push({
        type: 'timber',
        x: at.x,
        z: at.z,
        groundY: groundY + ROOF_HEIGHT,
        yaw: this.yaw + Math.PI / 2,
        take: (piece) => {
          this.roof.push(piece);
        },
        says: k + 1 >= ROOF_TIMBERS ? 'The roof is whole.' : `Timber across the walls: a roof, ${k + 1} of ${ROOF_TIMBERS}.`,
      });
    }
    return out;
  }
}

export class Structures {
  readonly list: Structure[] = [];
  readonly group = new THREE.Group();

  constructor(scene: THREE.Scene, private readonly groundY: number) {
    scene.add(this.group);
  }

  /** What the last snap said (a hint for main). */
  lastSays = '';

  /**
   * A piece was let go: the nearest slot within SNAP_REACH takes it — a slot
   * on an existing structure (wall, roof), or a fitting beside a loose piece
   * that makes a new one. Returns the structure it joined, or null.
   */
  trySnap(piece: WorldObject, objects: ObjectWorld): Structure | null {
    if (!piece.collectible) return null;
    // Slots on standing structures first: nearest wins.
    let best: { slot: Slot; s: Structure; d: number } | null = null;
    for (const s of this.list) {
      for (const slot of s.slots(this.groundY)) {
        if (slot.type !== piece.type.id) continue;
        const d = Math.hypot(piece.position.x - slot.x, piece.position.z - slot.z);
        if (d <= SNAP_REACH && (!best || d < best.d)) best = { slot, s, d };
      }
    }
    if (best) {
      piece.rest(best.slot.x, best.slot.groundY, best.slot.z, best.slot.yaw);
      piece.collectible = false;
      piece.mesh.traverse((m) => (m.userData.structure = best!.s));
      best.slot.take(piece);
      this.lastSays = best.slot.says;
      return best.s;
    }
    for (const fit of FITTINGS) {
      if (piece.type.id !== fit.piece) continue;
      const candidates = objects.objects.filter((o) => o !== piece && o.collectible && o.type.id === fit.onto);
      for (const onto of candidates) {
        const yaw = onto.group.rotation.y;
        // The log lies along its local X; the slots are `gap` off to either side.
        const perp = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
        for (const side of [1, -1]) {
          const slot = onto.position.clone().addScaledVector(perp, fit.gap * side);
          if (Math.hypot(piece.position.x - slot.x, piece.position.z - slot.z) > SNAP_REACH) continue;
          piece.rest(slot.x, this.groundY, slot.z, yaw);
          const s = new Structure(fit.yields, [onto, piece], yaw);
          this.group.add(s.group);
          this.list.push(s);
          this.lastSays = 'The notched logs fit together: a bed frame. Lay sticks across it.';
          return s;
        }
      }
    }
    return null;
  }

  /**
   * Lay `count` of a type onto a structure. Returns how many it took (0 if it
   * takes none of that), and upgrades the structure when the fill is complete.
   */
  addFill(s: Structure, type: ObjectTypeId, count: number): number {
    const fill = s.fill;
    if (!fill || fill.takes !== type) return 0;
    const have = s.filled.get(type) ?? 0;
    const take = Math.min(count, fill.count - have);
    for (let i = 0; i < take; i++) this.layStick(s, have + i, fill.count);
    s.filled.set(type, have + take);
    if (have + take >= fill.count) s.kind = fill.yields;
    return take;
  }

  /** The k-th of n sticks laid across the frame, spread along the logs. */
  private layStick(s: Structure, k: number, n: number): void {
    const mesh = OBJECT_TYPES.stick.build();
    const holder = new THREE.Group();
    holder.add(mesh);
    const along = new THREE.Vector3(Math.cos(s.yaw), 0, -Math.sin(s.yaw));
    const t = -0.48 + (0.96 * k) / Math.max(1, n - 1);
    holder.position.copy(s.center).addScaledVector(along, t);
    // Resting across the two logs: log centre 0.18 up, radius 0.17, stick radius 0.03, sunk a little into the notches.
    holder.position.y = this.groundY + 0.18 + 0.17 + 0.03 - 0.05;
    holder.rotation.y = s.yaw + Math.PI / 2;
    holder.traverse((m) => (m.userData.structure = s));
    s.group.add(holder);
  }

  /** Meshes for raycasting (cast recursively); each part carries userData.structure. */
  raycastTargets(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    for (const s of this.list) {
      for (const p of s.pieces) out.push(p.mesh);
      for (const w of s.walls) if (w) out.push(w.mesh);
      for (const r of s.roof) out.push(r.mesh);
      out.push(s.group);
    }
    return out;
  }

  /** Roof over a ground point, 0 (open sky) .. 1 (a whole roof). */
  shelterAt(x: number, z: number): number {
    let best = 0;
    for (const s of this.list) if (s.covers(x, z)) best = Math.max(best, s.shelter);
    return best;
  }

  /** A finished bed within BED_REST_REACH of a ground point, or null. */
  bedNear(x: number, z: number): Structure | null {
    let best: Structure | null = null;
    let bestD = BED_REST_REACH;
    for (const s of this.list) {
      if (s.kind !== 'bed') continue;
      const d = Math.hypot(s.center.x - x, s.center.z - z);
      if (d <= bestD) {
        best = s;
        bestD = d;
      }
    }
    return best;
  }
}
