// Pass 0.4b: what main.ts needs from anything the player can lock onto and
// work with the board — plant voxels and ground patches so far. Keeps the
// lock/board/shot plumbing indifferent to what it is feeding.

import type * as THREE from 'three';
import type { Board, Run } from './match3';
import type { CameraPose } from './cameraLock';

export type InteractableStatus = 'growing' | 'resolving' | 'resolved';

export interface Viewer {
  position: THREE.Vector3;
  forward: THREE.Vector3;
}

export interface Interactable {
  readonly kind: 'voxel' | 'patch';
  readonly index: number;
  readonly board: Board;
  readonly center: THREE.Vector3;
  /** 'growing' accepts play; 'resolving' is mid-beat; 'resolved' is done for good. */
  status: InteractableStatus;
  /** Objects a free-view tap can hit to lock on; each carries userData.interactable. */
  readonly lockTargets: THREE.Object3D[];
  /** Player-to-centre distance within which a tap locks on. */
  readonly lockReach: number;
  /** Hint shown in the locked view. */
  readonly hintLocked: string;
  lockPose(viewer: Viewer): CameraPose;
  distanceTo(p: THREE.Vector3): number;
  /** Which target a run feeds (via its targeting strategy), or null. */
  targetFor(run: Run): number | null;
  targetWorldPosition(target: number): THREE.Vector3;
  /** A shot landed. */
  feed(target: number, amount: number, nowMs: number): void;
  /** HUD line describing the pools. */
  poolText(): string;
  /** Fired once when the interactable is finished (voxel resolved, patch tilled). */
  onDone: (it: Interactable) => void;
  update(nowMs: number): void;
}
