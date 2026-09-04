// Pass 0.2: one placed voxel instance — Pass 0's rig + puzzle state + recede,
// plus placement, a collider, whole-voxel fade, the resolve beat, and the
// tap handling that used to live in main.ts. One-shot puzzle state each.

import * as THREE from 'three';
import { assignColors, PALETTE } from './colors';
import { buildRig, HALF, TIP_COUNT, type Branch, type Rig } from './rig';
import { PuzzleState } from './puzzle';
import { RecedeAnimator } from './recede';
import { ResolveBeat } from './resolve';
import { lockedPoseFor, type CameraPose } from './cameraLock';
import type { CircleCollider } from './player';

// ---- Tuning constants ---------------------------------------------------------
/** Movement collider. Inscribed radius is 1, corners reach 1.41; this lets you brush corners. */
export const VOXEL_COLLIDER_RADIUS = 1.2;
/** Player-to-centre distance within which a tap locks on. Start pocket is ~2.45 from every ring voxel. */
export const LOCK_REACH = 3.3;
// Selection look, unchanged from Pass 0.
const SELECTED_SCALE = 1.18;
const SELECTED_EMISSIVE = 0.55;
// -------------------------------------------------------------------------------

export type VoxelStatus = 'growing' | 'resolving' | 'resolved';

export class Voxel {
  readonly group = new THREE.Group();
  readonly rig: Rig;
  readonly puzzle: PuzzleState;
  readonly colors: number[];
  /** Invisible box over the whole cube: the tap-to-lock target in the free view. */
  readonly hitBox: THREE.Mesh;
  status: VoxelStatus = 'growing';
  onResolved: (voxel: Voxel) => void = () => {};

  private readonly animator = new RecedeAnimator();
  private beat: ResolveBeat | null = null;
  private lastNow = 0;
  private readonly baseOpacity: number[];

  /**
   * @param position   cube centre (y = 0 puts the base on the y = -1 ground)
   * @param faceToward point the flower face (+Z of the rig) turns to look at
   */
  constructor(readonly index: number, position: THREE.Vector3, faceToward: THREE.Vector3, seed: number) {
    this.colors = assignColors(TIP_COUNT, seed);
    this.puzzle = new PuzzleState(this.colors);
    this.rig = buildRig(this.colors, seed ^ 0x9e37);
    this.baseOpacity = this.rig.materials.map((m) => m.opacity);

    this.group.position.copy(position);
    this.group.lookAt(faceToward.x, position.y, faceToward.z);
    this.group.add(this.rig.root);

    this.hitBox = new THREE.Mesh(new THREE.BoxGeometry(HALF * 2, HALF * 2, HALF * 2));
    this.hitBox.visible = false;
    this.hitBox.userData.voxel = this;
    this.group.add(this.hitBox);
    for (const h of this.rig.hitTargets) h.userData.voxel = this;
  }

  get center(): THREE.Vector3 {
    return this.group.position.clone();
  }

  /** World-space normal of the flower face. */
  get normal(): THREE.Vector3 {
    return new THREE.Vector3(0, 0, 1).applyQuaternion(this.group.quaternion);
  }

  /** The Pass 0 framing for this voxel. */
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

  /** Current selection for the HUD. */
  selection(): { count: number; colorName: string } | null {
    const sel = this.puzzle.selected();
    return sel.length ? { count: sel.length, colorName: PALETTE[this.colors[sel[0]]].name } : null;
  }

  /** Tip index under a world-space ray, or null. Only live flowers count. */
  pickTip(raycaster: THREE.Raycaster): number | null {
    for (const h of raycaster.intersectObjects(this.rig.hitTargets, false)) {
      const tip = h.object.userData.tipIndex;
      if (typeof tip === 'number' && h.object.parent?.visible) return tip;
    }
    return null;
  }

  /** Toggle-select a flower (locked view). Pass 0 behaviour, unchanged. */
  tap(tip: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    const result = this.puzzle.toggle(tip);
    switch (result.kind) {
      case 'noop':
        break;
      case 'selected':
        for (const t of result.deselected) this.setSelectedLook(this.rig.branches[t], false);
        this.setSelectedLook(this.rig.branches[tip], true);
        break;
      case 'deselected':
        this.setSelectedLook(this.rig.branches[tip], false);
        break;
      case 'match': {
        this.setSelectedLook(this.rig.branches[tip], true);
        const group = result.tips.map((t) => this.rig.branches[t]);
        this.animator.start(group, nowMs, (b) => {
          this.puzzle.markCleared(b.index);
          // Pass 0.2: once nothing clearable remains, the whole voxel goes.
          if (!this.animator.isBusy && this.puzzle.isDead()) this.beginResolve(this.lastNow);
        });
        break;
      }
    }
  }

  private setSelectedLook(branch: Branch, on: boolean): void {
    branch.petalMaterial.emissiveIntensity = on ? SELECTED_EMISSIVE : 0;
    branch.flower.scale.setScalar(on ? SELECTED_SCALE : 1);
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
    this.lastNow = nowMs;
    this.animator.update(nowMs);
    if (this.beat) {
      this.beat.update(nowMs);
      if (this.beat.isDone) {
        this.beat = null;
        this.status = 'resolved';
        this.onResolved(this);
      }
    }
  }
}
