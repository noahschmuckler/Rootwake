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
import { GROW_MS, PLANT_SEEDS, Sapling } from './growth';

// ---- Tuning constants ---------------------------------------------------------
/** Side of the square patch. Roughly one grid cell of the shipped game. */
export const PATCH_SIZE = 1.3;
/** Gems the shared pool absorbs before the patch is tilled. */
export const PATCH_CAPACITY = 12;
/** Player-to-centre distance within which a tap locks on. */
export const PATCH_LOCK_REACH = 2.8;
/** Grass clumps (crossed standees) and clods in each stage; clumps are subsets of one seeded layout. */
const CLUMPS_BY_STAGE = [16, 9, 4, 0];
const CLODS_BY_STAGE = [0, 3, 8, 15];
/** Tint multiplied over the blade texture per stage: fresh → yellowing → dry. */
const CLUMP_TINT_BY_STAGE = [0xffffff, 0xd8cf98, 0xb8a878, 0xffffff];
const CLUMP_SIZE = 0.42;
/** Remaining-HP fractions above which each stage shows. */
const STAGE_MIN_FRACTION = [0.66, 0.33, 0.0001];
const SOIL_BY_STAGE = [0x2f3d27, 0x3d3a28, 0x4a3b28, 0x52402c];
// -------------------------------------------------------------------------------

/** One shared blade texture: a tuft fanning from the bottom centre, transparent elsewhere. */
let grassTexture: THREE.CanvasTexture | null = null;
function getGrassTexture(): THREE.CanvasTexture {
  if (grassTexture) return grassTexture;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  const rand = mulberry32(42);
  const blades = 13;
  for (let i = 0; i < blades; i++) {
    const t = (i + 0.5) / blades;
    const lean = (t - 0.5) * 1.7; // fan left to right
    const height = 0.55 + rand() * 0.45;
    const baseX = size * (0.42 + rand() * 0.16);
    const tipX = baseX + lean * size * 0.32;
    const tipY = size * (1 - height);
    const width = 5 + rand() * 4;
    const g = 120 + Math.floor(rand() * 70);
    ctx.fillStyle = `rgb(${40 + Math.floor(rand() * 40)}, ${g}, ${40 + Math.floor(rand() * 30)})`;
    ctx.beginPath();
    ctx.moveTo(baseX - width / 2, size);
    ctx.quadraticCurveTo(baseX + lean * size * 0.1, size * 0.6, tipX, tipY);
    ctx.quadraticCurveTo(baseX + lean * size * 0.12 + width * 0.3, size * 0.62, baseX + width / 2, size);
    ctx.closePath();
    ctx.fill();
  }
  grassTexture = new THREE.CanvasTexture(canvas);
  grassTexture.colorSpace = THREE.SRGBColorSpace;
  return grassTexture;
}

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
  /** Fired when a planted sapling has grown: replace me with a tree. */
  onGrown: (patch: Patch) => void = () => {};
  readonly lockTargets: THREE.Object3D[];
  private sapling: Sapling | null = null;
  private plantedAt = 0;

  private readonly stages: THREE.Group[] = [];
  private stage = -1;
  /** Planted: bare worked soil under the sapling, no clods to hide it. */
  private plantedLook!: THREE.Mesh;
  /** Status to return to when unblocked (a partly tilled patch stays partly tilled). */
  private unblockedStatus: InteractableStatus = 'growing';

  /**
   * @param blocked      start with something lying on it (a felled tree's footprint)
   * @param initialStage start partly tilled — the ground under a felled tree is disturbed, not lawn
   */
  constructor(readonly index: number, position: THREE.Vector3, seed: number, blocked = false, initialStage = 0) {
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x7a11);
    this.group.position.copy(position);
    this.buildStages(seed);
    if (initialStage > 0) {
      // Pool value whose remaining fraction sits inside that stage.
      const remaining = initialStage === 1 ? 0.5 : initialStage === 2 ? 0.2 : 0;
      this.pool = Math.min(PATCH_CAPACITY, Math.round(PATCH_CAPACITY * (1 - remaining)));
      if (initialStage >= 3) this.status = 'resolved';
    }
    this.setStage(this.stageFor(1 - this.pool / PATCH_CAPACITY));
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
    }
    // The look does not change: grass under a log is still grass. Only the lock is refused.
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
    if (this.status === 'planted') return 'planted';
    if (this.status === 'resolved') return 'tilled';
    if (this.status === 'blocked') return 'blocked — clear the ground';
    return `soil ${this.pool}/${PATCH_CAPACITY}`;
  }

  /** Can seeds go in? Only tilled ground, and only once. */
  get acceptsSeeds(): boolean {
    return this.status === 'resolved';
  }

  /** Plant from a hand. Returns the seeds consumed (0 if it can't take them). */
  plant(seedsAvailable: number, nowMs: number): number {
    if (!this.acceptsSeeds || seedsAvailable < PLANT_SEEDS) return 0;
    this.status = 'planted';
    this.plantedAt = nowMs;
    this.stages.forEach((g) => (g.visible = false));
    this.plantedLook.visible = true;
    this.sapling = new Sapling();
    this.sapling.group.position.y = 0.01;
    this.group.add(this.sapling.group);
    return PLANT_SEEDS;
  }

  /** Grow progress 0..1 (debug/tests read this). */
  get growth(): number {
    return this.status === 'planted' ? Math.min(1, (this.lastNow - this.plantedAt) / GROW_MS) : 0;
  }
  private lastNow = 0;

  update(nowMs: number): void {
    this.lastNow = nowMs;
    if (this.status !== 'planted' || !this.sapling) return;
    const p = this.growth;
    this.sapling.setProgress(p);
    if (p >= 1) {
      this.group.remove(this.sapling.group);
      this.sapling = null;
      this.onGrown(this);
    }
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

    // Shared layouts: stage k shows the first N clumps and the first M clods.
    // A clump is two crossed quads (an X from above) carrying the blade texture,
    // its bottom edge on the ground; a standee reads as a tuft from any side.
    const quad = new THREE.PlaneGeometry(CLUMP_SIZE, CLUMP_SIZE);
    quad.translate(0, CLUMP_SIZE / 2, 0);
    const clumps: THREE.BufferGeometry[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    for (let i = 0; i < CLUMPS_BY_STAGE[0]; i++) {
      const pos = new THREE.Vector3((rand() * 2 - 1) * (half - 0.12), 0, (rand() * 2 - 1) * (half - 0.12));
      const yaw = rand() * Math.PI;
      const sc = 0.75 + rand() * 0.5;
      const scale = new THREE.Vector3(sc, sc * (0.8 + rand() * 0.4), sc);
      q.setFromEuler(e.set(0, yaw, 0));
      clumps.push(quad.clone().applyMatrix4(m.compose(pos, q, scale)));
      q.setFromEuler(e.set(0, yaw + Math.PI / 2, 0));
      clumps.push(quad.clone().applyMatrix4(m.compose(pos, q, scale)));
    }
    const clodBase = new THREE.IcosahedronGeometry(1, 0);
    const clods: THREE.BufferGeometry[] = [];
    for (let i = 0; i < CLODS_BY_STAGE[CLODS_BY_STAGE.length - 1]; i++) {
      const r = 0.11 + rand() * 0.1;
      const pos = new THREE.Vector3((rand() * 2 - 1) * (half - r), r * 0.45, (rand() * 2 - 1) * (half - r));
      q.setFromEuler(e.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI));
      clods.push(clodBase.clone().applyMatrix4(m.compose(pos, q, new THREE.Vector3(r, r * 0.65, r))));
    }

    const texture = getGrassTexture();
    const clodMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 1, flatShading: true });
    const soil = new THREE.PlaneGeometry(PATCH_SIZE, PATCH_SIZE);
    soil.rotateX(-Math.PI / 2);

    this.plantedLook = new THREE.Mesh(soil, new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: 1 }));
    this.plantedLook.position.y = 0.012;
    this.plantedLook.visible = false;
    this.group.add(this.plantedLook);

    for (let k = 0; k < CLUMPS_BY_STAGE.length; k++) {
      const g = new THREE.Group();
      const base = new THREE.Mesh(soil, new THREE.MeshStandardMaterial({ color: SOIL_BY_STAGE[k], roughness: 1 }));
      base.position.y = 0.012;
      g.add(base);
      if (CLUMPS_BY_STAGE[k] > 0) {
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          color: CLUMP_TINT_BY_STAGE[k],
          alphaTest: 0.5,
          side: THREE.DoubleSide,
          roughness: 1,
        });
        g.add(new THREE.Mesh(mergeGeometries(clumps.slice(0, CLUMPS_BY_STAGE[k] * 2)), material));
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
