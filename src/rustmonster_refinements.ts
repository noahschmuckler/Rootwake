// Designer refinements shared by the live lab creature and deterministic study bays.
// Kept outside rustmonster.ts so the experimental changes stay easy to tune/revert.

import type * as THREE from 'three';
import { RustMonster } from './rustmonster';

interface LegHack {
  hip: THREE.Group;
  side: 1 | -1;
  phase: number;
  kind: 'arm' | 'mid' | 'hind';
}

interface MonsterHack {
  legs: LegHack[];
  pivots: THREE.Group[];
  head: THREE.Group;
  body: THREE.Group;
  yawRate: number;
  surface: 'floor' | 'wall' | 'corner';
}

/**
 * One-time rig corrections from the designer's v2.3 review:
 * - mid + hind gait cycles were reading backwards, so reverse their phase;
 * - hind hips were visually landing on the abdomen; move them forward into the thoracic mass.
 */
export function refineRustMonsterRig(monster: RustMonster): void {
  const h = monster as unknown as MonsterHack;
  for (const leg of h.legs) {
    if (leg.kind === 'mid' || leg.kind === 'hind') leg.phase = -leg.phase;
    if (leg.kind === 'hind') {
      // The thorax is centred forward of the abdomen. Keep the big cricket femur,
      // but move the articulation point forward so it visibly originates under the pronotum.
      leg.hip.position.z = -0.08;
      leg.hip.position.x = leg.side * 0.33;
    }
  }
}

/**
 * Stronger elastic turn flex. The stock animation already measures yawRate; this pass amplifies
 * the head lead and sends a diminishing bend down the abdomen. When yawRate returns to zero the
 * offsets return to zero, so repeated left/right steering reads as a smooth sinusoidal body wave.
 */
export function refineRustMonsterTurnPose(monster: RustMonster): void {
  const h = monster as unknown as MonsterHack;
  if (h.surface === 'corner') return; // cornerPose owns the pitch articulation there.

  const r = Math.max(-3, Math.min(3, h.yawRate));
  // Thorax participates, but less than head/abdomen; this keeps the animal from reading as a rigid yaw.
  h.body.rotation.y = r * 0.075;
  h.head.rotation.y += r * 0.18;

  // Each joint bends in the same direction with a soft falloff. Because each pivot is nested inside
  // the previous one, these small rotations accumulate into a visible C-curve through the abdomen.
  const gains = [0.095, 0.085, 0.073, 0.060, 0.046, 0.032];
  for (let i = 0; i < h.pivots.length; i++) h.pivots[i].rotation.y += r * gains[i];
}
