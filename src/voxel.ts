// Pass 0.2: one placed voxel instance — Pass 0's rig + recede, plus
// placement, a collider, whole-voxel fade and the resolve beat.
// Pass 0.3a: the tap-a-flower puzzle is retired. Each voxel now carries a
// match-3 Board and five per-flower HP pools; a run feeds the flower its
// colour targets, a full pool recedes that flower (recede.ts unchanged), and
// five receded flowers resolve the voxel (resolve.ts unchanged).

import * as THREE from 'three';
import { assignDistinctColors, PALETTE } from './colors';
import { buildRig, HALF, TIP_COUNT, type Rig } from './rig';
import { RecedeAnimator } from './recede';
import { ResolveBeat } from './resolve';
import { lockedPoseFor, type CameraPose } from './cameraLock';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { byColor, type TargetingStrategy } from './targeting';
import type { CircleCollider } from './player';
import type { Interactable, InteractableStatus } from './interactable';

// ---- Tuning constants ---------------------------------------------------------
/** Movement collider. Inscribed radius is 1, corners reach 1.41; this lets you brush corners. */
export const VOXEL_COLLIDER_RADIUS = 1.2;
/** Player-to-centre distance within which a tap locks on. Start pocket is ~2.45 from every ring voxel. */
export const LOCK_REACH = 3.3;
/**
 * Gems a flower's pool must absorb before it recedes. Each flower is 20% of
 * the voxel with its own independent pool (designer-confirmed). 9 = three
 * plain matches; cascades and 4/5-runs get there faster.
 */
export const POOL_CAPACITY = 9;
/** Flower glow at an empty / full pool, and the extra flash on a hit. */
const GLOW_EMPTY = 0.05;
const GLOW_FULL = 0.7;
const HIT_FLASH = 0.9;
const FLASH_DECAY_PER_S = 3.5;
// -------------------------------------------------------------------------------

export type VoxelStatus = InteractableStatus;

export class Voxel implements Interactable {
  readonly kind = 'voxel' as const;
  readonly lockReach = LOCK_REACH;
  readonly hintLocked = 'Tap a gem, then a neighbour, to swap. Matches feed the flower of their colour.';
  readonly group = new THREE.Group();
  readonly rig: Rig;
  /** Palette index (= gem type) per flower tip. */
  readonly colors: number[];
  readonly board: Board;
  /** Gems absorbed per flower. */
  readonly pools: number[];
  /** Swappable: colour → flower now; column buckets for combat later. */
  targeting: TargetingStrategy = byColor;
  /** Invisible box over the whole cube: the tap-to-lock target in the free view. */
  readonly hitBox: THREE.Mesh;
  status: VoxelStatus = 'growing';
  /** Fired once the resolve beat has finished and the voxel is gone. */
  onDone: (it: Interactable) => void = () => {};

  private readonly receded: boolean[];
  private readonly flash: number[];
  private readonly animator = new RecedeAnimator();
  private beat: ResolveBeat | null = null;
  private lastNow = 0;
  private readonly baseOpacity: number[];

  /**
   * @param position   cube centre (y = 0 puts the base on the y = -1 ground)
   * @param faceToward point the flower face (+Z of the rig) turns to look at
   */
  constructor(readonly index: number, position: THREE.Vector3, faceToward: THREE.Vector3, seed: number) {
    this.colors = assignDistinctColors(TIP_COUNT, seed);
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x51ed);
    this.pools = this.colors.map(() => 0);
    this.receded = this.colors.map(() => false);
    this.flash = this.colors.map(() => 0);
    this.rig = buildRig(this.colors, seed ^ 0x9e37);
    this.baseOpacity = this.rig.materials.map((m) => m.opacity);
    for (const b of this.rig.branches) b.petalMaterial.emissiveIntensity = GLOW_EMPTY;

    this.group.position.copy(position);
    this.group.lookAt(faceToward.x, position.y, faceToward.z);
    this.group.add(this.rig.root);

    this.hitBox = new THREE.Mesh(new THREE.BoxGeometry(HALF * 2, HALF * 2, HALF * 2));
    this.hitBox.visible = false;
    this.hitBox.userData.interactable = this;
    this.group.add(this.hitBox);
    for (const h of this.rig.hitTargets) h.userData.interactable = this;
  }

  get center(): THREE.Vector3 {
    return this.group.position.clone();
  }

  /** World-space normal of the flower face. */
  get normal(): THREE.Vector3 {
    return new THREE.Vector3(0, 0, 1).applyQuaternion(this.group.quaternion);
  }

  /** The Pass 0 framing for this voxel (the viewer's position doesn't matter: the face decides). */
  lockPose(): CameraPose {
    return lockedPoseFor(this.center, this.normal);
  }

  /** Everything a free-view tap can hit to lock onto this voxel. */
  get lockTargets(): THREE.Object3D[] {
    return [this.hitBox, ...this.rig.hitTargets];
  }

  collider(): CircleCollider | null {
    if (this.status === 'resolved') return null;
    return { x: this.group.position.x, z: this.group.position.z, radius: VOXEL_COLLIDER_RADIUS };
  }

  /** Horizontal distance from a point to the cube centre. */
  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.group.position.x, p.z - this.group.position.z);
  }

  get flowersLeft(): number {
    return this.receded.filter((r) => !r).length;
  }

  /** HUD line: one entry per flower, in tip order. */
  poolText(): string {
    return this.colors
      .map((c, i) => `${PALETTE[c].name} ${this.receded[i] ? '✓' : `${this.pools[i]}/${POOL_CAPACITY}`}`)
      .join('  ');
  }

  /** Which flower a run feeds, via the current strategy. Null if none (already receded, or unmapped). */
  targetFor(run: Run): number | null {
    const t = this.targeting.target(run, {
      targetCount: this.colors.length,
      boardCols: this.board.cols,
      colorOfTarget: (i) => this.colors[i],
    });
    if (t === null || this.receded[t] || this.status !== 'growing') return null;
    return t;
  }

  targetWorldPosition(flower: number): THREE.Vector3 {
    return this.rig.branches[flower].flower.getWorldPosition(new THREE.Vector3());
  }

  /** A shot landed: feed the flower's pool; recede it when full; resolve the voxel when all five are gone. */
  feed(flower: number, amount: number, nowMs: number): void {
    if (this.status !== 'growing' || this.receded[flower]) return;
    this.pools[flower] = Math.min(POOL_CAPACITY, this.pools[flower] + amount);
    this.flash[flower] = HIT_FLASH;
    if (this.pools[flower] >= POOL_CAPACITY) {
      this.receded[flower] = true;
      this.animator.start([this.rig.branches[flower]], nowMs, () => {
        if (this.flowersLeft === 0 && !this.animator.isBusy) this.beginResolve(this.lastNow);
      });
    }
  }

  private beginResolve(nowMs: number): void {
    if (this.status !== 'growing') return;
    this.status = 'resolving';
    this.beat = new ResolveBeat(this.rig, this.group, nowMs);
  }

  /** 1 = fully drawn, 0 = invisible. Used to drop the neighbours out of the locked view. */
  setFade(alpha: number): void {
    const a = THREE.MathUtils.clamp(alpha, 0, 1);
    this.rig.root.visible = a > 0 && this.status !== 'resolved';
    this.rig.materials.forEach((m, i) => {
      m.opacity = this.baseOpacity[i] * a;
      m.transparent = a < 1 || this.baseOpacity[i] < 1;
    });
  }

  update(nowMs: number): void {
    const dt = Math.max(0, (nowMs - this.lastNow) / 1000);
    this.lastNow = nowMs;
    // Flowers glow brighter as their pool fills, and flash on each hit.
    for (let i = 0; i < this.colors.length; i++) {
      this.flash[i] = Math.max(0, this.flash[i] - FLASH_DECAY_PER_S * dt);
      if (!this.receded[i]) {
        const fill = this.pools[i] / POOL_CAPACITY;
        this.rig.branches[i].petalMaterial.emissiveIntensity = THREE.MathUtils.lerp(GLOW_EMPTY, GLOW_FULL, fill) + this.flash[i];
      }
    }
    this.animator.update(nowMs);
    if (this.beat) {
      this.beat.update(nowMs);
      if (this.beat.isDone) {
        this.beat = null;
        this.status = 'resolved';
        this.onDone(this);
      }
    }
  }
}
