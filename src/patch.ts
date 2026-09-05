// Pass 0.4b: a tillable ground patch — the second interactable (DESIGN.md).
// A square of fuzzy grass among the rock. Tap it, the camera locks looking
// down, the board sits over it, and every match feeds ONE shared pool. The
// look steps down through four authored stages — DiggyDwarves' grass phases
// in reverse: full grass → patchy → sparse → brown clods — swapped at HP
// thresholds, not lerped. A tilled patch stays as clods and stops taking
// taps; it never blocks movement, before or after. No payout yet.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from './colors';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { single, type TargetingStrategy } from './targeting';
import { lookDownPoseFor, type CameraPose } from './cameraLock';
import type { Interactable, InteractableStatus, Viewer } from './interactable';

// ---- Tuning constants ---------------------------------------------------------
/** Side of the square patch. Roughly one grid cell of the shipped game. */
export const PATCH_SIZE = 1.3;
/** Gems the shared pool absorbs before the patch is tilled. */
export const PATCH_CAPACITY = 12;
/** Player-to-centre distance within which a tap locks on. */
export const PATCH_LOCK_REACH = 2.8;
/** Blades and clods in the fullest / barest stages; middle stages are subsets. */
const BLADES_BY_STAGE = [170, 100, 40, 0];
const CLODS_BY_STAGE = [0, 3, 8, 15];
/** Remaining-HP fractions above which each stage shows. */
const STAGE_MIN_FRACTION = [0.66, 0.33, 0.0001];
const SOIL_BY_STAGE = [0x2f3d27, 0x3d3a28, 0x4a3b28, 0x52402c];
// -------------------------------------------------------------------------------

export class Patch implements Interactable {
  readonly kind = 'patch' as const;
  readonly group = new THREE.Group();
  readonly board: Board;
  readonly lockReach = PATCH_LOCK_REACH;
  readonly hintLocked = 'Tap a gem, then a neighbour, to swap. Every match tills the ground.';
  status: InteractableStatus = 'growing';
  pool = 0;
  targeting: TargetingStrategy = single;
  onDone: (it: Interactable) => void = () => {};
  readonly lockTargets: THREE.Object3D[];

  private readonly stages: THREE.Group[] = [];
  private stage = -1;
  private blockedLook!: THREE.Group;
  /** Status to return to when unblocked (a partly tilled patch stays partly tilled). */
  private unblockedStatus: InteractableStatus = 'growing';

  constructor(readonly index: number, position: THREE.Vector3, seed: number, blocked = false) {
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x7a11);
    this.group.position.copy(position);
    this.buildStages(seed);
    this.setStage(0);
    if (blocked) this.setBlocked(true);

    // Thin invisible slab so a tap on the grass finds the patch. Not a collider.
    const hit = new THREE.Mesh(new THREE.BoxGeometry(PATCH_SIZE, 0.4, PATCH_SIZE));
    hit.position.y = 0.2;
    hit.visible = false;
    hit.userData.interactable = this;
    this.group.add(hit);
    this.lockTargets = [hit];
  }

  get center(): THREE.Vector3 {
    return this.group.position.clone();
  }

  /** Half-size of the ground square objects must be clear of. */
  get footprintHalf(): number {
    return PATCH_SIZE / 2;
  }

  /** Something lying on the patch blocks it; clearing it restores whatever state it was in. */
  setBlocked(blocked: boolean): void {
    if (this.status === 'resolved') return;
    if (blocked && this.status !== 'blocked') {
      this.unblockedStatus = this.status;
      this.status = 'blocked';
    } else if (!blocked && this.status === 'blocked') {
      this.status = this.unblockedStatus;
    } else {
      return;
    }
    this.blockedLook.visible = blocked;
    this.stages.forEach((g, i) => (g.visible = !blocked && i === this.stage));
  }

  lockPose(viewer: Viewer): CameraPose {
    return lookDownPoseFor(this.center, viewer.position, viewer.forward);
  }

  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.group.position.x, p.z - this.group.position.z);
  }

  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return this.targeting.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }

  targetWorldPosition(): THREE.Vector3 {
    return this.center.add(new THREE.Vector3(0, 0.15, 0));
  }

  feed(_target: number, amount: number): void {
    if (this.status !== 'growing') return;
    this.pool = Math.min(PATCH_CAPACITY, this.pool + amount);
    this.setStage(this.stageFor(1 - this.pool / PATCH_CAPACITY));
    if (this.pool >= PATCH_CAPACITY) {
      this.status = 'resolved';
      this.onDone(this);
    }
  }

  poolText(): string {
    if (this.status === 'resolved') return 'tilled';
    if (this.status === 'blocked') return 'blocked — clear the ground';
    return `soil ${this.pool}/${PATCH_CAPACITY}`;
  }

  update(): void {
    // Nothing animates on a patch: stages are discrete swaps.
  }

  // ---- looks ----------------------------------------------------------------------

  private stageFor(remaining: number): number {
    for (let i = 0; i < STAGE_MIN_FRACTION.length; i++) if (remaining > STAGE_MIN_FRACTION[i]) return i;
    return STAGE_MIN_FRACTION.length;
  }

  private setStage(stage: number): void {
    if (stage === this.stage) return;
    this.stage = stage;
    this.stages.forEach((g, i) => (g.visible = i === stage));
  }

  /** Four authored looks, built once. Blades and clods are seeded so a patch always tills the same way. */
  private buildStages(seed: number): void {
    const rand = mulberry32(seed);
    const half = PATCH_SIZE / 2;

    // Shared transform lists: stage k shows the first N of each.
    const bladeBase = new THREE.ConeGeometry(0.035, 0.24, 5);
    bladeBase.translate(0, 0.12, 0);
    const blades: THREE.BufferGeometry[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    for (let i = 0; i < BLADES_BY_STAGE[0]; i++) {
      const pos = new THREE.Vector3((rand() * 2 - 1) * (half - 0.05), 0, (rand() * 2 - 1) * (half - 0.05));
      q.setFromEuler(e.set((rand() - 0.5) * 0.7, rand() * Math.PI * 2, (rand() - 0.5) * 0.7));
      const h = 0.7 + rand() * 0.7;
      blades.push(bladeBase.clone().applyMatrix4(m.compose(pos, q, new THREE.Vector3(1, h, 1))));
    }
    const clodBase = new THREE.IcosahedronGeometry(1, 0);
    const clods: THREE.BufferGeometry[] = [];
    for (let i = 0; i < CLODS_BY_STAGE[CLODS_BY_STAGE.length - 1]; i++) {
      const r = 0.11 + rand() * 0.1;
      const pos = new THREE.Vector3((rand() * 2 - 1) * (half - r), r * 0.45, (rand() * 2 - 1) * (half - r));
      q.setFromEuler(e.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI));
      clods.push(clodBase.clone().applyMatrix4(m.compose(pos, q, new THREE.Vector3(r, r * 0.65, r))));
    }

    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x5fae3c, roughness: 0.9, flatShading: true });
    const dryBladeMaterial = new THREE.MeshStandardMaterial({ color: 0x8aa04a, roughness: 0.9, flatShading: true });
    const clodMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 1, flatShading: true });
    const soil = new THREE.PlaneGeometry(PATCH_SIZE, PATCH_SIZE);
    soil.rotateX(-Math.PI / 2);

    // Blocked look: bare dark soil with a faint outline — the ground is there, not yet yours.
    this.blockedLook = new THREE.Group();
    const bare = new THREE.Mesh(soil, new THREE.MeshStandardMaterial({ color: 0x3a3128, roughness: 1 }));
    bare.position.y = 0.012;
    this.blockedLook.add(bare);
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(soil),
      new THREE.LineBasicMaterial({ color: 0x9aa89a, transparent: true, opacity: 0.35 })
    );
    outline.position.y = 0.02;
    this.blockedLook.add(outline);
    this.blockedLook.visible = false;
    this.group.add(this.blockedLook);

    for (let k = 0; k < BLADES_BY_STAGE.length; k++) {
      const g = new THREE.Group();
      const base = new THREE.Mesh(soil, new THREE.MeshStandardMaterial({ color: SOIL_BY_STAGE[k], roughness: 1 }));
      base.position.y = 0.012;
      g.add(base);
      if (BLADES_BY_STAGE[k] > 0) {
        g.add(new THREE.Mesh(mergeGeometries(blades.slice(0, BLADES_BY_STAGE[k])), k === 0 ? bladeMaterial : dryBladeMaterial));
      }
      if (CLODS_BY_STAGE[k] > 0) {
        g.add(new THREE.Mesh(mergeGeometries(clods.slice(0, CLODS_BY_STAGE[k])), clodMaterial));
      }
      g.visible = false;
      this.group.add(g);
      this.stages.push(g);
    }
  }
}
