// Pass 0.9: structures (SYSTEMS.md §5.4, ROADMAP 0.9). Shaped logs are
// objects with weight and *fittings*: a notched log let go beside another
// notched log snaps into place, and the pair is a structure. Structures then
// take fills — sticks laid across a bed frame make a bed. Everything here is
// data (which piece fits which, at what offset, what it yields, what fills
// it) plus the small amount of geometry to snap and to lay the fill. This is
// DiggyDwarves' structure model reduced to its rows; none of its UI.
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
// -------------------------------------------------------------------------------

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
}

export class Structures {
  readonly list: Structure[] = [];
  readonly group = new THREE.Group();

  constructor(scene: THREE.Scene, private readonly groundY: number) {
    scene.add(this.group);
  }

  /**
   * A piece was let go: if a fitting says it belongs beside a matching piece
   * within SNAP_REACH of a slot, move it into the slot and make the structure.
   */
  trySnap(piece: WorldObject, objects: ObjectWorld): Structure | null {
    if (!piece.collectible) return null;
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
      out.push(s.group);
    }
    return out;
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
