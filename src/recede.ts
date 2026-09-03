// The recede animation — the thing Pass 0 exists to feel-test (DESIGN.md).
//
// Cheap version, by design: the branch tube is left untouched; only the
// flower slides back along its own curve (t: 1 → 0) while scaling to zero,
// selling "pulled home into the trunk" without deforming geometry. If this
// feels flat once it's running, the fallback is truncating the TubeGeometry
// per frame — deliberately NOT built here.

import * as THREE from 'three';
import type { Branch } from './rig';

// ---- Tuning constants (all open to feel iteration) -------------------------
/** Time for one flower to travel tip → trunk. */
export const RECEDE_DURATION_MS = 700;
/** Gap between consecutive flowers in a matched triple starting their recede. */
export const STAGGER_MS = 90;
/** Brief "tug" before the recede: the flower swells outward before snapping back. */
export const ANTICIPATION_MS = 90;
export const ANTICIPATION_SCALE = 1.3;
/** How many full turns the flower spins about its own facing axis on the way home. */
export const SPIN_TURNS = 0.75;
// ---------------------------------------------------------------------------

/**
 * Ease-in: starts slow, accelerates into the trunk — reads as being pulled
 * rather than gliding. Quadratic, not cubic: cubic left the flower visibly
 * parked for the first ~40% of the travel time, which read as a hitch. The
 * opposite feel (a snap that decelerates home, ease-out) is the obvious
 * alternative to try if this still reads slow.
 */
function easeInQuad(x: number): number {
  return x * x;
}
function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

interface Active {
  branch: Branch;
  startMs: number;
  /** Scale the flower had when its recede began (selected flowers are already swollen). */
  fromScale: number;
  onDone: () => void;
}

export class RecedeAnimator {
  private active: Active[] = [];

  /**
   * Start a staggered recede for a matched group. Order given = order they
   * leave. Stagger is sequential (0, 1×, 2× STAGGER_MS) rather than "one
   * leads, two follow together" — the other reading of DESIGN.md's note;
   * swap if the third flower feels late.
   */
  start(branches: Branch[], nowMs: number, onDone: (branch: Branch) => void): void {
    branches.forEach((branch, i) => {
      this.active.push({
        branch,
        startMs: nowMs + i * STAGGER_MS,
        fromScale: branch.flower.scale.x,
        onDone: () => onDone(branch),
      });
    });
  }

  get isBusy(): boolean {
    return this.active.length > 0;
  }

  update(nowMs: number): void {
    const still: Active[] = [];
    const finished: Active[] = [];
    for (const a of this.active) {
      const elapsed = nowMs - a.startMs;
      if (elapsed < 0) {
        still.push(a);
        continue;
      }
      const { flower, curve } = a.branch;

      if (elapsed < ANTICIPATION_MS) {
        // Tug outward: swell in place, no travel yet.
        const k = easeOutQuad(elapsed / ANTICIPATION_MS);
        const s = THREE.MathUtils.lerp(a.fromScale, ANTICIPATION_SCALE, k);
        flower.scale.setScalar(s);
        still.push(a);
        continue;
      }

      const p = Math.min(1, (elapsed - ANTICIPATION_MS) / RECEDE_DURATION_MS);
      const travel = easeInQuad(p);
      flower.position.copy(curve.getPointAt(1 - travel));
      flower.scale.setScalar(ANTICIPATION_SCALE * (1 - travel));
      flower.rotation.z = travel * SPIN_TURNS * Math.PI * 2;

      if (p >= 1) {
        flower.visible = false;
        finished.push(a);
      } else {
        still.push(a);
      }
    }
    // Swap the list before firing callbacks so `isBusy` is already accurate
    // for anyone reacting to the last flower going home.
    this.active = still;
    for (const a of finished) a.onDone();
  }
}
