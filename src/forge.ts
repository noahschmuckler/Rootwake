// Underworld U2: the forge — a blueprint that yields equipment, not a
// structure. Long-press an ingot, pick a piece; a luminous ring lies on the
// floor around that ingot and turns green once enough ingots lie inside it.
// Tap inside to play the board: heat gathers at the centre and every few
// matches one ingot flies in and is absorbed, until the piece sets where the
// ring was. The plateau's BuildSite, without a structure to assemble.

import * as THREE from 'three';
import type { Interactable, InteractableStatus, Viewer } from './interactable';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { single } from './targeting';
import { lookDownPoseFor, type CameraPose } from './cameraLock';
import type { ObjectTypeId, ObjectWorld, WorldObject } from './objects';

// ---- Tuning constants ---------------------------------------------------------
export const FORGE_RING_RADIUS = 1.4;
export const FORGE_RING_WIDTH = 0.12;
export const FORGE_LOCK_REACH = 3.4;
/** Gems of heat per ingot absorbed; the piece sets when every ingot is in. */
export const HEAT_PER_INGOT = 3;
export const FLIGHT_MS = 550;
/** From the last ingot absorbed to the piece lying there. */
export const SET_MS = 1400;
export const RING_COLOR_WAITING = 0xd9a441;
export const RING_COLOR_READY = 0x7fe07a;
// -------------------------------------------------------------------------------

export interface ForgePlan {
  id: string;
  label: string;
  ingots: number;
  result: ObjectTypeId;
  /** What wearing it sustains — shown in the menu. */
  blurb: string;
}

/** The pieces of the suit, in the order they can be made: the chest is the attachment point for the rest. */
export const FORGE_PLANS: ForgePlan[] = [
  { id: 'chestpiece', label: 'Blueprint: chestpiece', ingots: 6, result: 'chestpiece', blurb: 'six ingots · the core that powers the rest' },
  { id: 'leg_armor', label: 'Blueprint: powered leg armor', ingots: 4, result: 'leg_armor', blurb: 'four ingots / faster running, higher jumps and hover thrusters' },
  { id: 'helm', label: 'Blueprint: helm', ingots: 2, result: 'helm', blurb: 'two ingots · sustained darksight' },
];

const coreMaterial = () => new THREE.MeshStandardMaterial({ color: 0xff8a2a, emissive: 0xff6a12, emissiveIntensity: 2.4, roughness: 0.4, metalness: 0.4 });

export class ForgeSite implements Interactable {
  readonly kind = 'site' as const;
  readonly board: Board;
  readonly lockReach = FORGE_LOCK_REACH;
  readonly hintLocked: string;
  readonly lockTargets: THREE.Object3D[] = [];
  readonly group = new THREE.Group();
  readonly floorY: number;
  status: InteractableStatus = 'blocked';
  pool = 0;
  absorbed = 0;
  onDone: (it: Interactable) => void = () => {};
  /** Fired with the finished piece. */
  onResult: (obj: WorldObject) => void = () => {};

  private readonly ring: THREE.Mesh;
  private readonly core: THREE.Mesh;
  private readonly flights: { obj: WorldObject; from: THREE.Vector3; startMs: number }[] = [];
  private setAt = -1;
  private inside = 0;

  constructor(
    readonly index: number,
    readonly center: THREE.Vector3,
    readonly plan: ForgePlan,
    private readonly objects: ObjectWorld,
    groundY: number,
    seed: number
  ) {
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0xf043);
    this.floorY = groundY;
    this.hintLocked = `${plan.label}: tap a gem, then a neighbour. The heat draws the ingots in.`;
    this.ring = new THREE.Mesh(new THREE.RingGeometry(FORGE_RING_RADIUS - FORGE_RING_WIDTH, FORGE_RING_RADIUS, 48), new THREE.MeshBasicMaterial({ color: RING_COLOR_WAITING, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.set(center.x, groundY + 0.02, center.z);
    this.ring.userData.interactable = this;
    this.group.add(this.ring);
    // A disc to tap inside of (invisible), so a tap anywhere in the ring locks in.
    const disc = new THREE.Mesh(new THREE.CircleGeometry(FORGE_RING_RADIUS, 32), new THREE.MeshBasicMaterial({ visible: false }));
    disc.rotation.x = -Math.PI / 2;
    disc.position.copy(this.ring.position);
    disc.userData.interactable = this;
    this.group.add(disc);
    this.lockTargets.push(this.ring, disc);
    // The heat at the centre: a lump that grows with every ingot absorbed.
    this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), coreMaterial());
    this.core.position.set(center.x, groundY + 0.1, center.z);
    this.core.visible = false;
    this.group.add(this.core);
  }

  /** Loose ingots lying inside the ring. */
  ingotsInside(): WorldObject[] {
    return this.objects.objects.filter((o) => o.type.id === 'ingot' && o.collectible && Math.hypot(o.position.x - this.center.x, o.position.z - this.center.z) <= FORGE_RING_RADIUS);
  }

  get isReady(): boolean {
    return this.inside >= this.plan.ingots;
  }

  readyText(): string {
    return `${this.inside} of ${this.plan.ingots} ingots inside the ring.`;
  }

  /** Per frame until play starts: the ring reads what lies in it. */
  evaluate(): void {
    if (this.status !== 'blocked' && this.status !== 'growing') return;
    if (this.absorbed > 0) return; // once the heat has taken hold the count is fixed
    this.inside = this.ingotsInside().length;
    this.status = this.isReady ? 'growing' : 'blocked';
    (this.ring.material as THREE.MeshBasicMaterial).color.setHex(this.isReady ? RING_COLOR_READY : RING_COLOR_WAITING);
  }

  lockPose(viewer: Viewer): CameraPose {
    return lookDownPoseFor(this.center, viewer.position, viewer.forward);
  }

  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.center.x, p.z - this.center.z);
  }

  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return single.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }

  targetWorldPosition(): THREE.Vector3 {
    return this.core.position.clone().add(new THREE.Vector3(0, 0.2, 0));
  }

  feed(_target: number, amount: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    this.pool += amount;
    this.core.visible = true;
    while (this.absorbed < this.plan.ingots && this.pool >= (this.absorbed + 1) * HEAT_PER_INGOT) {
      const candidates = this.ingotsInside().sort((a, b) => this.distanceTo(a.position) - this.distanceTo(b.position));
      const obj = candidates[0];
      if (!obj) break;
      obj.collectible = false;
      this.flights.push({ obj, from: obj.position.clone(), startMs: nowMs });
      this.absorbed++;
    }
    if (this.absorbed >= this.plan.ingots) {
      this.status = 'resolving';
      this.setAt = nowMs + FLIGHT_MS + SET_MS;
    }
  }

  poolText(): string {
    return `${this.plan.result} ${this.absorbed}/${this.plan.ingots}`;
  }

  update(nowMs: number): void {
    // Ingots fly to the heat and are absorbed; the lump grows and brightens.
    for (let i = this.flights.length - 1; i >= 0; i--) {
      const f = this.flights[i];
      const t = Math.min(1, (nowMs - f.startMs) / FLIGHT_MS);
      const k = t * t;
      f.obj.group.position.lerpVectors(f.from, this.core.position, k);
      f.obj.group.position.y += Math.sin(t * Math.PI) * 0.5;
      f.obj.group.rotation.y += 0.15;
      if (t >= 1) {
        this.objects.remove(f.obj);
        this.flights.splice(i, 1);
      }
    }
    const taken = this.absorbed - this.flights.length;
    const scale = 1 + taken * 0.28;
    this.core.scale.setScalar(scale);
    const m = this.core.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 1.6 + 1.2 * Math.sin(nowMs / 160) + 0.4 * taken;
    if (this.status === 'resolving' && nowMs >= this.setAt) {
      // The heat goes out of it and the piece lies there.
      this.core.visible = false;
      this.ring.visible = false;
      const obj = this.objects.spawn(this.plan.result, this.center.x, this.floorY, this.center.z, 0.4);
      this.status = 'resolved';
      this.onResult(obj);
      this.onDone(this);
    }
  }

  cancel(): void {
    for (const f of this.flights) this.objects.remove(f.obj);
    this.flights.length = 0;
    this.group.removeFromParent();
  }
}
