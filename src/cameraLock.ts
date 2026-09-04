// Pass 0.1a: the free ↔ locked-face camera transition (DESIGN.md).
// Pass 0.2 generalised it: the free view is now the player's eye and there
// are several voxels, so the tween runs between two arbitrary poses instead
// of orbiting a fixed target. Timings and easing are unchanged from the
// version that landed well on phone playtests.

import * as THREE from 'three';

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

// ---- The locked framing — unchanged from Pass 0 ----------------------------
// Straight-on view of the flower face at this distance from the cube centre.
export const LOCK_DISTANCE = 4.6;

/** The Pass 0 framing for a voxel at `center` whose flower face points along `normal`. */
export function lockedPoseFor(center: THREE.Vector3, normal: THREE.Vector3): CameraPose {
  return {
    position: center.clone().addScaledVector(normal, LOCK_DISTANCE),
    target: center.clone(),
  };
}

// ---- Tuning constants (open to feel iteration) ------------------------------
export const LOCK_MS = 650;
export const UNLOCK_MS = 550;
// ---------------------------------------------------------------------------

export type CameraMode = 'free' | 'locking' | 'locked' | 'unlocking';

/** Ease in-out cubic: settles into the locked frame rather than hitting it. */
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

interface Tween {
  from: CameraPose;
  to: CameraPose;
  startMs: number;
  durationMs: number;
  endMode: 'locked' | 'free';
}

export class CameraRig {
  mode: CameraMode = 'free';
  /** Called whenever mode changes — main.ts uses it to swap HUD/input. */
  onModeChange: (mode: CameraMode) => void = () => {};

  private tween: Tween | null = null;
  private readonly scratchPos = new THREE.Vector3();
  private readonly scratchTarget = new THREE.Vector3();

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  /** Current camera pose, with the look target a unit ahead. */
  currentPose(): CameraPose {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    return { position: this.camera.position.clone(), target: this.camera.position.clone().add(dir) };
  }

  /**
   * 0 in the free view, 1 when locked, and the eased tween progress in
   * between. main.ts fades the other voxels by this so the locked view is
   * only ever the voxel being worked.
   */
  lockedness(): number {
    switch (this.mode) {
      case 'free':
        return 0;
      case 'locked':
        return 1;
      default: {
        const p = this.tween ? this.tweenProgress() : 1;
        return this.mode === 'locking' ? p : 1 - p;
      }
    }
  }

  /** Tap on a voxel in the free view: tween from wherever the camera is into `to`. */
  lock(nowMs: number, to: CameraPose): void {
    if (this.mode !== 'free') return;
    this.startTween(this.currentPose(), to, nowMs, LOCK_MS, 'locked');
  }

  /** Back out: tween from the locked framing to `to` (normally the player's eye). */
  unlock(nowMs: number, to: CameraPose): void {
    if (this.mode !== 'locked') return;
    this.startTween(this.currentPose(), to, nowMs, UNLOCK_MS, 'free');
  }

  private startTween(from: CameraPose, to: CameraPose, nowMs: number, durationMs: number, endMode: 'locked' | 'free'): void {
    this.tween = { from, to, startMs: nowMs, durationMs, endMode };
    this.setMode(endMode === 'locked' ? 'locking' : 'unlocking');
  }

  private setMode(mode: CameraMode): void {
    if (this.mode === mode) return;
    this.mode = mode;
    this.onModeChange(mode);
  }

  private nowMs = 0;
  private tweenProgress(): number {
    const t = this.tween!;
    return easeInOutCubic(Math.min(1, (this.nowMs - t.startMs) / t.durationMs));
  }

  /** Drives the tween. In the free mode the camera belongs to whoever owns the player. */
  update(nowMs: number): void {
    this.nowMs = nowMs;
    if (!this.tween) return;
    const t = this.tween;
    const k = this.tweenProgress();
    this.camera.position.copy(this.scratchPos.lerpVectors(t.from.position, t.to.position, k));
    this.camera.lookAt(this.scratchTarget.lerpVectors(t.from.target, t.to.target, k));

    if (k >= 1) {
      // Land exactly on the destination, not a float-lerped neighbour of it.
      this.camera.position.copy(t.to.position);
      this.camera.lookAt(t.to.target);
      this.tween = null;
      this.setMode(t.endMode);
    }
  }
}
