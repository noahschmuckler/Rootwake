// Pass 0.8: a crafting session (SYSTEMS.md §5.3). Long-press a rock while
// holding a rock: the target lifts off the ground and hovers in front of
// you, the board appears under it, and every match sends the rock in your
// hand out to strike it. As its HP dwindles its look steps down through the
// recipe's stages; at zero it becomes the result, which lands in a free hand.
// Backing out mid-way sets the target back down with its progress kept.

import * as THREE from 'three';
import type { Interactable, InteractableStatus, Viewer } from './interactable';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { single } from './targeting';
import { craftPoseFor, type CameraPose } from './cameraLock';
import type { ObjectWorld, WorldObject } from './objects';
import type { Recipe } from './recipes';

// ---- Tuning constants ---------------------------------------------------------
/** Where the target hovers: ahead of the eye and a little below it. */
export const HOVER_AHEAD = 1.25;
export const HOVER_DROP = 0.2;
/** Idle bob of the hovering target. */
export const HOVER_BOB = 0.02;
// -------------------------------------------------------------------------------

export class CraftSession implements Interactable {
  readonly kind = 'craft' as const;
  readonly index: number;
  readonly board: Board;
  readonly lockReach = 3;
  readonly hintLocked: string;
  readonly lockTargets: THREE.Object3D[] = [];
  status: InteractableStatus = 'growing';
  onDone: (it: Interactable) => void = () => {};
  /** The finished result type, once done. */
  result: string | null = null;

  private readonly hover = new THREE.Vector3();
  private readonly restPosition = new THREE.Vector3();
  private readonly restRotation = new THREE.Euler();
  private hp: number;
  private stage: number;

  constructor(
    readonly target: WorldObject,
    readonly recipe: Recipe,
    private readonly objects: ObjectWorld,
    viewer: Viewer,
    seed: number
  ) {
    this.index = target.id;
    this.hintLocked = `${recipe.label}: tap a gem, then a neighbour. Each match strikes the stone.`;
    // Progress lives on the target so leaving and returning keeps it.
    if (!target.craft || target.craft.recipeId !== recipe.id) {
      target.craft = { recipeId: recipe.id, hp: recipe.hp, stage: 0, board: new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0xc4a7) };
    }
    this.board = target.craft.board as Board;
    this.hp = target.craft.hp;
    this.stage = target.craft.stage;

    this.restPosition.copy(target.position);
    this.restRotation.copy(target.group.rotation);
    const fwd = viewer.forward;
    this.hover.set(viewer.position.x + fwd.x * HOVER_AHEAD, viewer.position.y + 0.55 - HOVER_DROP, viewer.position.z + fwd.z * HOVER_AHEAD);
    target.group.position.copy(this.hover);
    target.group.rotation.set(0, Math.atan2(fwd.x, fwd.z) + Math.PI / 2, 0.15);
    target.collectible = false; // hands can't grab it while it hovers
  }

  get center(): THREE.Vector3 {
    return this.hover.clone();
  }

  lockPose(viewer: Viewer): CameraPose {
    const eye = viewer.position.clone();
    eye.y += 0.55;
    return craftPoseFor(this.hover, eye, viewer.forward);
  }

  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.hover.x, p.z - this.hover.z);
  }

  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return single.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }

  targetWorldPosition(): THREE.Vector3 {
    return this.hover.clone();
  }

  /** A strike landed. */
  feed(_target: number, amount: number): void {
    if (this.status !== 'growing') return;
    this.hp = Math.max(0, this.hp - amount);
    const remaining = this.hp / this.recipe.hp;
    // Stage k shows once remaining drops below (stages+1-k)/(stages+1).
    const n = this.recipe.stages.length;
    let stage = 0;
    for (let k = 1; k <= n; k++) if (remaining <= (n + 1 - k) / (n + 1)) stage = k;
    if (stage !== this.stage) {
      this.stage = stage;
      this.target.setLook(this.recipe.stages[stage - 1]);
    }
    this.target.craft = { ...this.target.craft!, hp: this.hp, stage: this.stage };
    if (this.hp <= 0) {
      this.status = 'resolved';
      this.result = this.recipe.result;
      this.objects.remove(this.target);
      this.onDone(this);
    }
  }

  /** Backed out before finishing: set the target down where it was, progress kept. */
  cancel(): void {
    if (this.status !== 'growing') return;
    this.target.group.position.copy(this.restPosition);
    this.target.group.rotation.copy(this.restRotation);
    this.target.collectible = true;
    this.status = 'resolved'; // this session is over; a new long-press makes a new one
  }

  poolText(): string {
    return `${this.recipe.label.toLowerCase()} ${this.recipe.hp - this.hp}/${this.recipe.hp}`;
  }

  update(nowMs: number): void {
    if (this.status !== 'growing') return;
    this.target.group.position.y = this.hover.y + Math.sin(nowMs / 400) * HOVER_BOB;
  }
}
