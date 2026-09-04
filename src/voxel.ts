// Pass 0.2: one placed voxel instance — Pass 0's rig + recede, plus
// placement, a collider, whole-voxel fade and the resolve beat.
// Pass 0.3a: the tap-a-flower puzzle is retired; a match-3 Board drives it.
// Pass 0.4c: one shared pool instead of five per-colour pools (the `single`
// strategy ground patches use), all four side faces carry the same live
// flowers and any of them can be locked onto. Flowers recede in stages as
// the pool crosses 20% thresholds (recede.ts unchanged); a full pool
// resolves the tree (resolve.ts unchanged) from whichever side you're on.

import * as THREE from 'three';
import { assignDistinctColors } from './colors';
import { buildRig, HALF, TIP_COUNT, type Rig } from './rig';
import { RecedeAnimator } from './recede';
import { ResolveBeat } from './resolve';
import { lockedPoseFor, type CameraPose } from './cameraLock';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { single, type TargetingStrategy } from './targeting';
import type { CircleCollider } from './player';
import type { Interactable, InteractableStatus, Viewer } from './interactable';

// ---- Tuning constants ---------------------------------------------------------
/** Movement collider. Inscribed radius is 1, corners reach 1.41; this lets you brush corners. */
export const VOXEL_COLLIDER_RADIUS = 1.2;
/** Player-to-centre distance within which a tap locks on. Start pocket is ~2.45 from every ring voxel. */
export const LOCK_REACH = 3.3;
/**
 * Gems the tree's one shared pool absorbs before it resolves. Each flower
 * is 20% of it and recedes as the pool crosses its threshold. 40 ≈ the
 * 5 × 9 the per-colour pools added up to, minus a little: with one pool
 * every run counts, so it fills steadier and a touch faster.
 */
export const TREE_CAPACITY = 40;
/** How many side faces carry flowers. Top and bottom stay bare. */
export const SIDE_FACES = 4;
/** Flower glow at an empty / full pool, and the extra flash on a hit. */
const GLOW_EMPTY = 0.05;
const GLOW_FULL = 0.7;
const HIT_FLASH = 0.9;
const FLASH_DECAY_PER_S = 3.5;
// -------------------------------------------------------------------------------

export type VoxelStatus = InteractableStatus;

/** Local +Z turned about Y by 90° steps: face k's outward normal. */
function faceNormalLocal(face: number): THREE.Vector3 {
  return new THREE.Vector3(Math.sin((face * Math.PI) / 2), 0, Math.cos((face * Math.PI) / 2));
}

export class Voxel implements Interactable {
  readonly kind = 'voxel' as const;
  readonly lockReach = LOCK_REACH;
  readonly hintLocked = 'Tap a gem, then a neighbour, to swap. Every match feeds the tree.';
  readonly group = new THREE.Group();
  readonly rig: Rig;
  /** Palette index (= gem type) per flower tip. */
  readonly colors: number[];
  readonly board: Board;
  /** Gems absorbed by the one shared pool. */
  pool = 0;
  /** Swappable: one shared pool now; per-colour or per-column are a one-line change. */
  targeting: TargetingStrategy = single;
  /** Invisible box over the whole cube: the tap-to-lock target in the free view. */
  readonly hitBox: THREE.Mesh;
  status: VoxelStatus = 'growing';
  /** Fired once the resolve beat has finished and the voxel is gone. */
  onDone: (it: Interactable) => void = () => {};

  /** Which side face the current/last lock framed. */
  private lockedFace = 0;
  private readonly receded: boolean[];
  private flash = 0;
  private readonly animator = new RecedeAnimator();
  private beat: ResolveBeat | null = null;
  private lastNow = 0;
  private readonly baseOpacity: number[];

  /**
   * @param position   cube centre (y = 0 puts the base on the y = -1 ground)
   * @param faceToward point face 0 (+Z of the rig) turns to look at
   */
  constructor(readonly index: number, position: THREE.Vector3, faceToward: THREE.Vector3, seed: number) {
    this.colors = assignDistinctColors(TIP_COUNT, seed);
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x51ed);
    this.receded = this.colors.map(() => false);
    this.rig = buildRig(this.colors, seed ^ 0x9e37, SIDE_FACES);
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

  /** World-space outward normal of the face the lock framed (or will frame). */
  get normal(): THREE.Vector3 {
    return faceNormalLocal(this.lockedFace).applyQuaternion(this.group.quaternion);
  }

  /**
   * The Pass 0 framing, on whichever side face the viewer is nearest to —
   * a tree can be worked from any side, and every side shows the same state.
   */
  lockPose(viewer: Viewer): CameraPose {
    const toViewer = viewer.position.clone().sub(this.group.position);
    toViewer.y = 0;
    let best = 0;
    let bestDot = -Infinity;
    for (let f = 0; f < SIDE_FACES; f++) {
      const d = faceNormalLocal(f).applyQuaternion(this.group.quaternion).dot(toViewer);
      if (d > bestDot) {
        bestDot = d;
        best = f;
      }
    }
    this.lockedFace = best;
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

  poolText(): string {
    return `tree ${this.pool}/${TREE_CAPACITY} · flowers ${this.flowersLeft}`;
  }

  /** The one shared target, via the strategy (so per-colour can come back with one line). */
  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return this.targeting.target(run, {
      targetCount: 1,
      boardCols: this.board.cols,
      colorOfTarget: () => -1,
    });
  }

  /** Shots aim at the next flower to go on the locked face, or the trunk once none are left. */
  targetWorldPosition(): THREE.Vector3 {
    const next = this.receded.indexOf(false);
    if (next === -1) return this.center;
    const branch = this.rig.branches.find((b) => b.face === this.lockedFace && b.tip === next);
    return branch ? branch.flower.getWorldPosition(new THREE.Vector3()) : this.center;
  }

  /** A shot landed: feed the pool; recede each flower as its 20% threshold is crossed; resolve on full. */
  feed(_target: number, amount: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    this.pool = Math.min(TREE_CAPACITY, this.pool + amount);
    this.flash = HIT_FLASH;
    const stage = TREE_CAPACITY / TIP_COUNT;
    for (let tip = 0; tip < TIP_COUNT; tip++) {
      if (!this.receded[tip] && this.pool >= (tip + 1) * stage - 1e-6) this.recedeTip(tip, nowMs);
    }
  }

  /** Recede one tip on every face at once (four copies of one state, not four states). */
  private recedeTip(tip: number, nowMs: number): void {
    this.receded[tip] = true;
    for (const b of this.rig.branches) {
      if (b.tip !== tip) continue;
      this.animator.start([b], nowMs, () => {
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
    // Every flower glows brighter as the shared pool fills, and flashes on each hit.
    this.flash = Math.max(0, this.flash - FLASH_DECAY_PER_S * dt);
    const glow = THREE.MathUtils.lerp(GLOW_EMPTY, GLOW_FULL, this.pool / TREE_CAPACITY) + this.flash;
    for (const b of this.rig.branches) {
      if (!this.receded[b.tip]) b.petalMaterial.emissiveIntensity = glow;
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
