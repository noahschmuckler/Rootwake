// Pass 0.1a: the free-orbit ↔ locked-face camera transition (DESIGN.md).
//
// The thing under test is whether snapping from a free 3D view of the voxel
// into the flat, locked puzzle framing feels good or jarring. So this module
// owns exactly that: an orbit view, a tween into the Pass 0 framing, and a
// tween back out. No movement, no field, no face-picking beyond "the voxel".

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HALF } from './rig';

export const HALF_VOXEL = HALF;

// ---- The locked framing — unchanged from Pass 0 ----------------------------
// Straight-on view of the +Z face; the 2D-legible puzzle plane is z = +1.
export const LOCKED_POSITION = new THREE.Vector3(0, 0, 4.6);
export const ORBIT_TARGET = new THREE.Vector3(0, 0, 0);

// ---- Tuning constants (open to feel iteration) ------------------------------
/** Where the free view starts: up and off to the side, so the lock has somewhere to travel from. */
export const FREE_START_POSITION = new THREE.Vector3(3.6, 2.4, 4.2);
export const LOCK_MS = 650;
export const UNLOCK_MS = 550;
/** Orbit distance clamp. Locked framing sits at 4.6, inside this range on purpose. */
export const ORBIT_MIN_DISTANCE = 3;
export const ORBIT_MAX_DISTANCE = 9;
// ---------------------------------------------------------------------------

export type CameraMode = 'free' | 'locking' | 'locked' | 'unlocking';

/** Ease in-out cubic: settles into the locked frame rather than hitting it. */
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

interface Tween {
  from: THREE.Spherical;
  to: THREE.Spherical;
  startMs: number;
  durationMs: number;
  endMode: 'locked' | 'free';
}

export class CameraRig {
  mode: CameraMode = 'free';
  /** Called whenever mode changes — main.ts uses it to swap HUD/input. */
  onModeChange: (mode: CameraMode) => void = () => {};

  private readonly controls: OrbitControls;
  private tween: Tween | null = null;
  /**
   * Where the free view was when the player locked in. Backing out returns
   * here rather than to FREE_START_POSITION — feels like "resume" rather than
   * "reset". Flagged: the alternative (always return to a canonical spot) is
   * a one-line swap in unlock().
   */
  private readonly freeReturn = new THREE.Spherical();
  private readonly scratch = new THREE.Vector3();

  constructor(private readonly camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    camera.position.copy(FREE_START_POSITION);
    camera.lookAt(ORBIT_TARGET);

    this.controls = new OrbitControls(camera, domElement);
    this.controls.target.copy(ORBIT_TARGET);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    // Panning is off so the orbit target is always the voxel — the lock tween
    // then only has to interpolate a spherical position, never a target.
    this.controls.enablePan = false;
    this.controls.minDistance = ORBIT_MIN_DISTANCE;
    this.controls.maxDistance = ORBIT_MAX_DISTANCE;
    this.controls.update();
  }

  /** Tap on the voxel in the free view: tween into the locked framing. */
  lock(nowMs: number): void {
    if (this.mode !== 'free') return;
    this.freeReturn.setFromVector3(this.scratch.copy(this.camera.position).sub(ORBIT_TARGET));
    this.startTween(
      this.freeReturn.clone(),
      new THREE.Spherical().setFromVector3(this.scratch.copy(LOCKED_POSITION).sub(ORBIT_TARGET)),
      nowMs,
      LOCK_MS,
      'locked'
    );
  }

  /** The "back out" button: tween back to where the free view was. */
  unlock(nowMs: number): void {
    if (this.mode !== 'locked') return;
    this.startTween(
      new THREE.Spherical().setFromVector3(this.scratch.copy(this.camera.position).sub(ORBIT_TARGET)),
      this.freeReturn.clone(),
      nowMs,
      UNLOCK_MS,
      'free'
    );
  }

  private startTween(from: THREE.Spherical, to: THREE.Spherical, nowMs: number, durationMs: number, endMode: 'locked' | 'free'): void {
    // Take the short way round in azimuth so an orbit to the back of the
    // voxel doesn't swing the long way (or through it) on the way to the face.
    let dTheta = to.theta - from.theta;
    dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
    to.theta = from.theta + dTheta;

    this.controls.enabled = false;
    this.tween = { from, to, startMs: nowMs, durationMs, endMode };
    this.setMode(endMode === 'locked' ? 'locking' : 'unlocking');
  }

  private setMode(mode: CameraMode): void {
    if (this.mode === mode) return;
    this.mode = mode;
    this.onModeChange(mode);
  }

  update(nowMs: number): void {
    if (this.tween) {
      const t = this.tween;
      const p = Math.min(1, (nowMs - t.startMs) / t.durationMs);
      const k = easeInOutCubic(p);
      const s = new THREE.Spherical(
        THREE.MathUtils.lerp(t.from.radius, t.to.radius, k),
        THREE.MathUtils.lerp(t.from.phi, t.to.phi, k),
        THREE.MathUtils.lerp(t.from.theta, t.to.theta, k)
      );
      this.camera.position.setFromSpherical(s).add(ORBIT_TARGET);
      this.camera.lookAt(ORBIT_TARGET);

      if (p >= 1) {
        this.tween = null;
        if (t.endMode === 'locked') {
          // Land exactly on the Pass 0 framing, not a float-lerped neighbour of it.
          this.camera.position.copy(LOCKED_POSITION);
          this.camera.lookAt(ORBIT_TARGET);
        } else {
          this.controls.enabled = true;
          this.controls.update();
        }
        this.setMode(t.endMode);
      }
      return;
    }
    if (this.mode === 'free') this.controls.update();
  }
}
