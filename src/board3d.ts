// Pass 0.3a: the match-3 board as real 3D geometry in the locked view.
//
// A grid of small gem meshes under one Object3D that is a child of the
// camera: positioned a couple of units ahead, dropped below centre, tilted so
// the top edge leans away. Perspective gives the trapezoid for free; no
// backing panel, so the voxel stays visible through the gaps. Input is the
// same raycast-onto-positioned-meshes the flower tips used.
//
// The view owns no rules: it asks the Board model to swap and then animates
// the steps the model returns, one phase at a time.

import * as THREE from 'three';
import { PALETTE } from './colors';
import { Board, GEM_TYPES, type CascadeStep, type Cell, type Run } from './match3';

// ---- Tuning constants ---------------------------------------------------------
/** Distance ahead of the camera. Inside the 4.6-unit lock distance so it sits in front of the face. */
export const BOARD_DISTANCE = 2.2;
/** Radians the top edge leans away from the viewer. */
export const BOARD_TILT = 0.62;
/** Fraction of the visible width at BOARD_DISTANCE the board may span — sizes gems to the screen, so portrait phones get finger-sized gems. */
export const BOARD_FIT_WIDTH = 0.88;
/** Fraction of the visible height it may span — keeps landscape screens from letting the board eat the flowers. */
export const BOARD_FIT_HEIGHT = 0.5;
/** Gems are see-through enough that the voxel reads through them, not just between them. */
export const GEM_OPACITY = 0.82;
/** Board centre, as a fraction of the visible height at BOARD_DISTANCE (negative = below centre), so the flowers stay in view above it. */
export const BOARD_Y_FRACTION = -0.17;
export const GEM_RADIUS = 0.36; // in cell units (cells are 1 apart before scaling)
export const SWAP_MS = 170;
export const INVALID_SWAP_MS = 150;
export const CLEAR_MS = 200;
export const FALL_MS_PER_ROW = 70;
export const FALL_MIN_MS = 160;
export const SHOW_MS = 220;
export const SELECTED_SCALE = 1.3;
// -------------------------------------------------------------------------------

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeInQuad(x: number): number {
  return x * x;
}
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

interface Move {
  mesh: THREE.Mesh;
  from: THREE.Vector3;
  to: THREE.Vector3;
}

type Phase =
  | { kind: 'swap'; a: number; b: number; durationMs: number }
  | { kind: 'clear'; step: CascadeStep }
  | { kind: 'fall'; step: CascadeStep }
  | { kind: 'rebuild' };

interface ActivePhase {
  phase: Phase;
  startMs: number;
  durationMs: number;
  moves: Move[];
  shrinking: THREE.Mesh[];
}

/** One shape per gem type so colour isn't the only cue. */
function gemGeometry(type: number): THREE.BufferGeometry {
  switch (type % GEM_TYPES) {
    case 0:
      return new THREE.OctahedronGeometry(GEM_RADIUS, 0);
    case 1:
      return new THREE.BoxGeometry(GEM_RADIUS * 1.35, GEM_RADIUS * 1.35, GEM_RADIUS * 1.35);
    case 2:
      return new THREE.IcosahedronGeometry(GEM_RADIUS, 0);
    case 3:
      return new THREE.DodecahedronGeometry(GEM_RADIUS, 0);
    default:
      return new THREE.TetrahedronGeometry(GEM_RADIUS * 1.25, 0);
  }
}

export class BoardView {
  readonly group = new THREE.Group();
  /** A run just cleared: its type/cells and the world position it cleared at. */
  onRun: (run: Run, worldOrigin: THREE.Vector3) => void = () => {};

  private model: Board | null = null;
  private readonly meshes = new Map<number, THREE.Mesh>();
  private readonly geometries = Array.from({ length: GEM_TYPES }, (_, t) => gemGeometry(t));
  private readonly materials = PALETTE.map(
    (c) =>
      new THREE.MeshStandardMaterial({
        color: c.hex,
        emissive: c.hex,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: GEM_OPACITY,
      })
  );
  private selectedId: number | null = null;
  private queue: Phase[] = [];
  private active: ActivePhase | null = null;
  private shown = false;
  private showStartMs = 0;
  private fitScale = 1;

  constructor(private readonly camera: THREE.PerspectiveCamera) {
    camera.add(this.group);
    this.group.visible = false;
    this.layout();
  }

  /** Size and place the board for the current viewport. Call on resize. */
  layout(): void {
    const halfH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * BOARD_DISTANCE;
    const halfW = halfH * this.camera.aspect;
    const cols = this.model?.cols ?? 6;
    const rows = this.model?.rows ?? 6;
    const byWidth = (halfW * 2 * BOARD_FIT_WIDTH) / cols;
    const byHeight = (halfH * 2 * BOARD_FIT_HEIGHT) / (rows * Math.cos(BOARD_TILT));
    this.fitScale = Math.min(byWidth, byHeight);
    this.group.position.set(0, halfH * 2 * BOARD_Y_FRACTION, -BOARD_DISTANCE);
    this.group.rotation.set(-BOARD_TILT, 0, 0);
    if (this.shown && !this.active) this.group.scale.setScalar(this.fitScale);
  }

  get isBusy(): boolean {
    return this.active !== null || this.queue.length > 0;
  }

  bind(board: Board): void {
    this.model = board;
    this.selectedId = null;
    this.queue = [];
    this.active = null;
    this.rebuildMeshes();
    this.layout();
  }

  unbind(): void {
    this.model = null;
    this.clearMeshes();
    this.group.visible = false;
    this.shown = false;
  }

  show(nowMs: number): void {
    if (!this.model) return;
    this.shown = true;
    this.showStartMs = nowMs;
    this.group.visible = true;
    this.group.scale.setScalar(0.001);
  }

  hide(): void {
    this.shown = false;
    this.group.visible = false;
    this.selectedId = null;
  }

  /** Handle a tap. Returns true if the board consumed it. */
  tap(raycaster: THREE.Raycaster): boolean {
    if (!this.model || !this.shown || this.isBusy) return false;
    const hit = raycaster.intersectObjects([...this.meshes.values()], false)[0];
    if (!hit) return false;
    const id = hit.object.userData.gemId as number;
    const cell = this.model.locate(id);
    if (!cell) return false;

    if (this.selectedId === null) {
      this.select(id);
      return true;
    }
    if (this.selectedId === id) {
      this.select(null);
      return true;
    }
    const selectedCell = this.model.locate(this.selectedId);
    if (!selectedCell || !Board.adjacent(selectedCell, cell)) {
      this.select(id);
      return true;
    }

    const a = this.selectedId;
    const result = this.model.swap(selectedCell, cell);
    this.select(null);
    if (!result.valid) {
      // Swap out and straight back: the "no" of match-3.
      this.queue.push({ kind: 'swap', a, b: id, durationMs: INVALID_SWAP_MS });
      this.queue.push({ kind: 'swap', a, b: id, durationMs: INVALID_SWAP_MS });
      return true;
    }
    this.queue.push({ kind: 'swap', a, b: id, durationMs: SWAP_MS });
    for (const step of result.steps) {
      this.queue.push({ kind: 'clear', step });
      this.queue.push({ kind: 'fall', step });
    }
    if (result.reshuffled) this.queue.push({ kind: 'rebuild' });
    return true;
  }

  update(nowMs: number): void {
    if (!this.shown || !this.model) return;

    if (!this.active && this.queue.length) this.begin(this.queue.shift()!, nowMs);

    // Scale-in on show; held at fit scale otherwise.
    const showP = Math.min(1, (nowMs - this.showStartMs) / SHOW_MS);
    this.group.scale.setScalar(this.fitScale * easeOutBack(showP));

    if (!this.active) return;
    const a = this.active;
    const p = Math.min(1, (nowMs - a.startMs) / a.durationMs);
    switch (a.phase.kind) {
      case 'swap': {
        const k = easeInOutCubic(p);
        for (const m of a.moves) m.mesh.position.lerpVectors(m.from, m.to, k);
        break;
      }
      case 'clear': {
        const k = 1 - easeInQuad(p);
        for (const m of a.shrinking) m.scale.setScalar(Math.max(0.001, k * (1 + 0.35 * Math.sin(p * Math.PI))));
        break;
      }
      case 'fall': {
        const k = easeInQuad(p);
        for (const m of a.moves) m.mesh.position.lerpVectors(m.from, m.to, k);
        break;
      }
      case 'rebuild':
        break;
    }
    if (p >= 1) this.finish(a);
  }

  // ---- internals ---------------------------------------------------------------

  private cellPosition(cell: Cell, rows = this.model!.rows, cols = this.model!.cols): THREE.Vector3 {
    return new THREE.Vector3(cell.col - (cols - 1) / 2, (rows - 1) / 2 - cell.row, 0);
  }

  private select(id: number | null): void {
    if (this.selectedId !== null) this.meshes.get(this.selectedId)?.scale.setScalar(1);
    this.selectedId = id;
    if (id !== null) this.meshes.get(id)?.scale.setScalar(SELECTED_SCALE);
  }

  private makeMesh(id: number, type: number): THREE.Mesh {
    const mesh = new THREE.Mesh(this.geometries[type], this.materials[type]);
    mesh.userData.gemId = id;
    // A little per-gem tilt so a grid of identical shapes doesn't read as tiles.
    mesh.rotation.set(0.35, (id % 7) * 0.9, 0.2);
    this.group.add(mesh);
    this.meshes.set(id, mesh);
    return mesh;
  }

  private rebuildMeshes(): void {
    this.clearMeshes();
    const m = this.model!;
    for (let r = 0; r < m.rows; r++) {
      for (let c = 0; c < m.cols; c++) {
        const gem = m.grid[r][c];
        this.makeMesh(gem.id, gem.type).position.copy(this.cellPosition({ row: r, col: c }));
      }
    }
  }

  private clearMeshes(): void {
    for (const mesh of this.meshes.values()) this.group.remove(mesh);
    this.meshes.clear();
    this.selectedId = null;
  }

  private begin(phase: Phase, nowMs: number): void {
    const moves: Move[] = [];
    const shrinking: THREE.Mesh[] = [];
    let durationMs = 1;
    switch (phase.kind) {
      case 'swap': {
        const ma = this.meshes.get(phase.a)!;
        const mb = this.meshes.get(phase.b)!;
        moves.push({ mesh: ma, from: ma.position.clone(), to: mb.position.clone() });
        moves.push({ mesh: mb, from: mb.position.clone(), to: ma.position.clone() });
        durationMs = phase.durationMs;
        break;
      }
      case 'clear': {
        for (const g of phase.step.cleared) {
          const mesh = this.meshes.get(g.id);
          if (mesh) shrinking.push(mesh);
        }
        for (const run of phase.step.runs) {
          const centroid = new THREE.Vector3();
          for (const c of run.cells) centroid.add(this.cellPosition(c));
          centroid.divideScalar(run.cells.length);
          this.onRun(run, this.group.localToWorld(centroid));
        }
        durationMs = CLEAR_MS;
        break;
      }
      case 'fall': {
        let maxDrop = 1;
        for (const f of phase.step.falls) {
          const mesh = this.meshes.get(f.id)!;
          moves.push({ mesh, from: mesh.position.clone(), to: this.cellPosition({ row: f.toRow, col: f.col }) });
          maxDrop = Math.max(maxDrop, f.toRow - f.fromRow);
        }
        for (const s of phase.step.spawns) {
          const mesh = this.makeMesh(s.id, s.type);
          const from = this.cellPosition({ row: s.fromRow, col: s.col });
          mesh.position.copy(from);
          moves.push({ mesh, from, to: this.cellPosition({ row: s.toRow, col: s.col }) });
          maxDrop = Math.max(maxDrop, s.toRow - s.fromRow);
        }
        durationMs = FALL_MIN_MS + maxDrop * FALL_MS_PER_ROW;
        break;
      }
      case 'rebuild':
        this.rebuildMeshes();
        durationMs = SHOW_MS;
        this.showStartMs = nowMs;
        break;
    }
    this.active = { phase, startMs: nowMs, durationMs, moves, shrinking };
  }

  private finish(a: ActivePhase): void {
    for (const m of a.moves) m.mesh.position.copy(m.to);
    if (a.phase.kind === 'clear') {
      for (const g of a.phase.step.cleared) {
        const mesh = this.meshes.get(g.id);
        if (mesh) {
          this.group.remove(mesh);
          this.meshes.delete(g.id);
        }
      }
    }
    this.active = null;
  }
}
