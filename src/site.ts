// Pass 1.0c: the build site. Choose a blueprint (blueprints.ts) and a place —
// a loose material on the ground, or a structure to add to — and a luminous
// ring marks the site with a ghost of what will stand there. Haul the
// ingredients inside the ring; the ring turns green. Tap inside to lock in:
// the board plays the site, and every match flies one ingredient from the
// pile into its place in the ghost, costing vitality like any work. Back out
// and the site keeps its progress. Taking apart is the same session run
// backwards: each match lifts the last piece off onto a pile beside it.

import * as THREE from 'three';
import type { Interactable, InteractableStatus, Viewer } from './interactable';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { single } from './targeting';
import { lookDownPoseFor, type CameraPose } from './cameraLock';
import { OBJECT_TYPES, type ObjectTypeId, type ObjectWorld, type WorldObject } from './objects';
import { RING_PADDING, type Blueprint, type PiecePlan } from './blueprints';
import { Structure, type Structures } from './structures';

// ---- Tuning constants ---------------------------------------------------------
/** A piece flies from the pile into place over this long. */
export const FLY_MS = 520;
/** Vitality per piece placed / taken off (SYSTEMS §1.1: building is effort). */
export const DRAIN_BUILD = 0.014;
export const DRAIN_UNBUILD = 0.008;
/** Ring look. */
export const RING_WIDTH = 0.12;
export const RING_COLOR_WAITING = 0xd9a441;
export const RING_COLOR_READY = 0x7fe07a;
export const GHOST_COLOR = 0x9fd8ff;
export const GHOST_OPACITY = 0.28;
/** The camera looks this far above the ground at the site's centre. */
export const SITE_LOOK_UP = 0.2;
/** The board's lowest corner stays this far above the highest piece the site will place. */
export const BOARD_ABOVE_PIECES = 0.25;
// -------------------------------------------------------------------------------

interface Flight {
  obj: WorldObject;
  from: THREE.Vector3;
  to: THREE.Vector3;
  fromYaw: number;
  toYaw: number;
  startMs: number;
  onLand: () => void;
}

const ringMaterial = () => new THREE.MeshBasicMaterial({ color: RING_COLOR_WAITING, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
const ghostMaterial = new THREE.MeshBasicMaterial({ color: GHOST_COLOR, transparent: true, opacity: GHOST_OPACITY, depthWrite: false, toneMapped: false });

export class BuildSite implements Interactable {
  readonly kind = 'site' as const;
  readonly index: number;
  readonly board: Board;
  readonly lockReach = 4.5;
  readonly hintLocked: string;
  readonly lockTargets: THREE.Object3D[] = [];
  status: InteractableStatus = 'growing';
  onDone: (it: Interactable) => void = () => {};
  /** Fired when a match lands but the pile lacks the piece it needs. */
  onMissing: (type: ObjectTypeId) => void = () => {};
  /** Fired as each piece lands (for hints and the HUD). */
  onPlaced: (placed: number, total: number) => void = () => {};

  readonly group = new THREE.Group();
  readonly center: THREE.Vector3;
  readonly ringRadius: number;
  /** The board clears what stands here: the walls being raised, or the floor and furniture (designer, after 1.0c). */
  readonly floorY: number;
  private readonly ring: THREE.Mesh;
  private readonly ghosts: THREE.Object3D[] = [];
  private readonly base: number;
  private placed = 0;
  private readonly flights: Flight[] = [];
  private lastCheckMs = -1;
  private ready = false;

  constructor(
    readonly blueprint: Blueprint,
    /** The structure the blueprint adds to (a new, empty one for a ground siting). */
    readonly structure: Structure,
    private readonly objects: ObjectWorld,
    private readonly groundY: number,
    seed: number
  ) {
    this.index = 9000 + Math.floor(Math.random() * 100000);
    this.center = structure.center.clone();
    this.center.y = groundY;
    this.base = structure.baseFor(blueprint);
    this.floorY = groundY + this.base + Math.max(...blueprint.pieces.map((p) => p.y)) + BOARD_ABOVE_PIECES;
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x51e7);
    this.hintLocked = `${blueprint.label}: tap a gem, then a neighbour. Each match sets a piece in place.`;
    this.ringRadius = Math.hypot(blueprint.half[0], blueprint.half[1]) + RING_PADDING;

    // The ring: flat on the ground, luminous, unlit.
    this.ring = new THREE.Mesh(new THREE.RingGeometry(this.ringRadius - RING_WIDTH, this.ringRadius, 48), ringMaterial());
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.set(this.center.x, groundY + 0.02, this.center.z);
    this.ring.userData.interactable = this;
    this.group.add(this.ring);
    // A disc to tap inside of (invisible), so a tap anywhere in the ring locks in.
    const disc = new THREE.Mesh(new THREE.CircleGeometry(this.ringRadius, 32), new THREE.MeshBasicMaterial({ visible: false }));
    disc.rotation.x = -Math.PI / 2;
    disc.position.copy(this.ring.position);
    disc.userData.interactable = this;
    this.group.add(disc);
    this.lockTargets.push(this.ring, disc);

    // The ghost: every piece, translucent, where it will stand.
    for (const plan of blueprint.pieces) {
      const mesh = OBJECT_TYPES[plan.type].build();
      mesh.traverse((m) => {
        if ((m as THREE.Mesh).isMesh) (m as THREE.Mesh).material = ghostMaterial;
      });
      const holder = new THREE.Group();
      holder.add(mesh);
      const at = this.placeOf(plan);
      holder.position.copy(at.position);
      holder.rotation.y = at.yaw;
      this.group.add(holder);
      this.ghosts.push(holder);
    }
  }

  /** World position and yaw for a piece of this blueprint. */
  private placeOf(plan: PiecePlan): { position: THREE.Vector3; yaw: number } {
    const p = this.structure.world(plan.along, plan.across);
    p.y = this.groundY + this.base + plan.y;
    return { position: p, yaw: this.structure.yaw + plan.yaw };
  }

  get total(): number {
    return this.blueprint.pieces.length;
  }
  get done(): number {
    return this.placed;
  }

  /** Ingredients still needed, against what lies loose inside the ring. */
  missing(): { type: ObjectTypeId; count: number }[] {
    const need = new Map<ObjectTypeId, number>();
    for (const plan of this.blueprint.pieces.slice(this.placed)) need.set(plan.type, (need.get(plan.type) ?? 0) + 1);
    for (const o of this.inRing()) if (need.has(o.type.id)) need.set(o.type.id, need.get(o.type.id)! - 1);
    return [...need].filter(([, n]) => n > 0).map(([type, count]) => ({ type, count }));
  }

  private inRing(): WorldObject[] {
    return this.objects.objects.filter((o) => o.collectible && Math.hypot(o.position.x - this.center.x, o.position.z - this.center.z) <= this.ringRadius);
  }

  get isReady(): boolean {
    return this.ready;
  }

  lockPose(viewer: Viewer): CameraPose {
    const pose = lookDownPoseFor(this.center, viewer.position, viewer.forward);
    pose.target.y += SITE_LOOK_UP;
    return pose;
  }

  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.center.x, p.z - this.center.z);
  }

  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return single.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }

  targetWorldPosition(): THREE.Vector3 {
    const next = this.blueprint.pieces[this.placed];
    return next ? this.placeOf(next).position : this.center.clone();
  }

  /** A match landed: one ingredient flies from the pile into its place. */
  feed(_target: number, _amount: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    const plan = this.blueprint.pieces[this.placed];
    if (!plan) return;
    const to = this.placeOf(plan);
    // The nearest loose piece of the right type inside the ring.
    const pile = this.inRing().filter((o) => o.type.id === plan.type);
    if (pile.length === 0) {
      this.onMissing(plan.type);
      return;
    }
    pile.sort((a, b) => a.position.distanceToSquared(to.position) - b.position.distanceToSquared(to.position));
    const obj = pile[0];
    obj.collectible = false; // spoken for while it flies
    this.placed++;
    this.ghosts[this.placed - 1].visible = false;
    this.flights.push({
      obj,
      from: obj.group.position.clone(),
      to: to.position,
      fromYaw: obj.group.rotation.y,
      toYaw: to.yaw,
      startMs: nowMs,
      onLand: () => {
        this.structure.place(obj, plan, this.base + plan.y);
        this.onPlaced(this.placed, this.total);
        if (this.placed >= this.total && this.flights.length === 0) {
          this.status = 'resolved';
          this.onDone(this);
        }
      },
    });
  }

  /** Backed out: the site stays, with its progress. */
  cancel(): void {}

  /** Remove the ring and ghost (the site is done or abandoned). */
  dispose(): void {
    this.group.removeFromParent();
  }

  poolText(): string {
    return `${this.blueprint.label.toLowerCase()} ${this.placed}/${this.total}`;
  }

  update(nowMs: number): void {
    // Flights.
    for (let i = this.flights.length - 1; i >= 0; i--) {
      const f = this.flights[i];
      const t = Math.min(1, (nowMs - f.startMs) / FLY_MS);
      const e = t * t * (3 - 2 * t);
      f.obj.group.position.lerpVectors(f.from, f.to, e);
      f.obj.group.position.y += Math.sin(t * Math.PI) * 0.6; // an arc up and over
      f.obj.group.rotation.y = f.fromYaw + (f.toYaw - f.fromYaw) * e;
      f.obj.group.rotation.z = 0;
      if (t >= 1) {
        f.obj.group.position.copy(f.to);
        f.obj.group.rotation.y = f.toYaw;
        this.flights.splice(i, 1);
        f.onLand();
      }
    }
    if (this.status !== 'growing') return;
    // The ring: green when everything needed lies inside it; a slow pulse either way.
    if (nowMs - this.lastCheckMs > 300) {
      this.lastCheckMs = nowMs;
      this.ready = this.missing().length === 0;
      (this.ring.material as THREE.MeshBasicMaterial).color.setHex(this.ready ? RING_COLOR_READY : RING_COLOR_WAITING);
    }
    (this.ring.material as THREE.MeshBasicMaterial).opacity = 0.7 + 0.25 * Math.sin(nowMs / 500);
  }
}

/**
 * Cutting a doorway (1.1): with the hand axe in hand, long-press a wall. Each
 * match cuts one course of that wall — the middle comes out as a knuckle, two
 * half logs stay either side — lowest first, until the wall is open.
 */
export class CutDoorway implements Interactable {
  readonly kind = 'site' as const;
  readonly index: number;
  readonly board: Board;
  readonly lockReach = 4.5;
  readonly hintLocked = 'Cutting a doorway: tap a gem, then a neighbour. Each match cuts a log through.';
  readonly lockTargets: THREE.Object3D[] = [];
  status: InteractableStatus = 'growing';
  onDone: (it: Interactable) => void = () => {};
  onCut: (left: number) => void = () => {};
  readonly center: THREE.Vector3;
  readonly floorY: number;
  private readonly flights: Flight[] = [];

  constructor(
    readonly structure: Structure,
    readonly wall: 'A' | 'B' | 'back',
    private readonly objects: ObjectWorld,
    private readonly groundY: number,
    seed: number
  ) {
    this.index = 9700 + Math.floor(Math.random() * 100000);
    const first = structure.uncutLogs(wall)[0];
    this.center = first ? first.obj.position.clone() : structure.center.clone();
    this.center.y = groundY;
    this.floorY = groundY + structure.wallTop + BOARD_ABOVE_PIECES;
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x6d0f);
    if (!first) this.status = 'resolved';
  }

  lockPose(viewer: Viewer): CameraPose {
    const pose = lookDownPoseFor(this.center, viewer.position, viewer.forward);
    pose.target.y += SITE_LOOK_UP;
    return pose;
  }
  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.center.x, p.z - this.center.z);
  }
  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return single.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }
  targetWorldPosition(): THREE.Vector3 {
    const next = this.structure.uncutLogs(this.wall)[0];
    return next ? next.obj.group.position.clone() : this.center.clone();
  }
  feed(_target: number, _amount: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    const knuckle = this.structure.cutCourse(this.wall, this.objects, this.groundY);
    if (!knuckle) return;
    // The knuckle drops out through the gap onto the ground outside.
    const to = knuckle.group.position.clone();
    knuckle.collectible = false;
    this.flights.push({
      obj: knuckle,
      from: this.targetWorldPosition().clone().add(new THREE.Vector3(0, 0.2, 0)),
      to,
      fromYaw: knuckle.group.rotation.y,
      toYaw: knuckle.group.rotation.y,
      startMs: nowMs,
      onLand: () => {
        knuckle.collectible = true;
      },
    });
    const left = this.structure.uncutLogs(this.wall).length;
    this.onCut(left);
    if (left === 0) {
      this.status = 'resolved';
      this.onDone(this);
    }
  }
  cancel(): void {}
  poolText(): string {
    return `doorway, ${this.structure.uncutLogs(this.wall).length} logs to cut`;
  }
  update(nowMs: number): void {
    flyAll(this.flights, nowMs);
  }
}

/** Advance a set of flights; landed ones call back. */
function flyAll(flights: Flight[], nowMs: number): void {
  for (let i = flights.length - 1; i >= 0; i--) {
    const f = flights[i];
    const t = Math.min(1, (nowMs - f.startMs) / FLY_MS);
    const e = t * t * (3 - 2 * t);
    f.obj.group.position.lerpVectors(f.from, f.to, e);
    f.obj.group.position.y += Math.sin(t * Math.PI) * 0.6;
    f.obj.group.rotation.y = f.fromYaw + (f.toYaw - f.fromYaw) * e;
    if (t >= 1) {
      f.obj.group.position.copy(f.to);
      f.obj.group.rotation.y = f.toYaw;
      flights.splice(i, 1);
      f.onLand();
    }
  }
}

/** Taking a structure apart: each match lifts the last piece off onto a pile at the open front. */
export class Deconstruct implements Interactable {
  readonly kind = 'site' as const;
  readonly index: number;
  readonly board: Board;
  readonly lockReach = 4.5;
  readonly hintLocked = 'Taking it apart: tap a gem, then a neighbour. Each match lifts a piece off.';
  readonly lockTargets: THREE.Object3D[] = [];
  status: InteractableStatus = 'growing';
  onDone: (it: Interactable) => void = () => {};
  onRemoved: (left: number) => void = () => {};
  readonly center: THREE.Vector3;
  readonly floorY: number;
  private readonly flights: Flight[] = [];
  private taken = 0;

  constructor(
    readonly structure: Structure,
    private readonly structures: Structures,
    private readonly groundY: number,
    seed: number
  ) {
    this.index = 9500 + Math.floor(Math.random() * 100000);
    this.center = structure.center.clone();
    this.center.y = groundY;
    this.floorY = groundY + Math.max(0, ...structure.pieces.map((p) => p.y)) + BOARD_ABOVE_PIECES;
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x2b7d);
  }

  lockPose(viewer: Viewer): CameraPose {
    const pose = lookDownPoseFor(this.center, viewer.position, viewer.forward);
    pose.target.y += SITE_LOOK_UP;
    return pose;
  }
  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.center.x, p.z - this.center.z);
  }
  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return single.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }
  targetWorldPosition(): THREE.Vector3 {
    const last = this.structure.pieces[this.structure.pieces.length - 1];
    return last ? last.obj.group.position.clone() : this.center.clone();
  }

  feed(_target: number, _amount: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    const placed = this.structure.removeLast();
    if (!placed) return;
    this.taken++;
    // Onto a pile out the open front, spread a little.
    const k = this.taken;
    const to = this.structure.world(2.4 + 0.35 * (k % 3), -0.8 + 0.4 * ((k * 7) % 5));
    to.y = this.groundY + placed.obj.type.restHeight;
    placed.obj.collectible = false;
    this.flights.push({
      obj: placed.obj,
      from: placed.obj.group.position.clone(),
      to,
      fromYaw: placed.obj.group.rotation.y,
      toYaw: this.structure.yaw + 0.3 * ((k % 4) - 1.5),
      startMs: nowMs,
      onLand: () => {
        placed.obj.collectible = true;
        this.onRemoved(this.structure.pieces.length);
        if (this.structure.pieces.length === 0 && this.flights.length === 0) {
          this.structures.remove(this.structure);
          this.status = 'resolved';
          this.onDone(this);
        }
      },
    });
  }

  cancel(): void {}
  poolText(): string {
    return `taking apart, ${this.structure.pieces.length} left`;
  }
  update(nowMs: number): void {
    for (let i = this.flights.length - 1; i >= 0; i--) {
      const f = this.flights[i];
      const t = Math.min(1, (nowMs - f.startMs) / FLY_MS);
      const e = t * t * (3 - 2 * t);
      f.obj.group.position.lerpVectors(f.from, f.to, e);
      f.obj.group.position.y += Math.sin(t * Math.PI) * 0.6;
      f.obj.group.rotation.y = f.fromYaw + (f.toYaw - f.fromYaw) * e;
      if (t >= 1) {
        f.obj.group.position.copy(f.to);
        f.obj.group.rotation.y = f.toYaw;
        this.flights.splice(i, 1);
        f.onLand();
      }
    }
  }
}
