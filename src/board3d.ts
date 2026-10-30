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
import { Board, GEM_TYPES, swipeTarget, type CascadeStep, type Cell, type Run } from './match3';

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
/** O1 (OPENING_SEQUENCE.md): a swipe needs this much travel (px) before it moves a gem. Tuning. */
export const SWIPE_PX = 18;
/** O1: the flat board's outline, as a scale of the gem (a black back-face shell), and its toon steps. Tuning. */
export const OUTLINE_SCALE = 1.14, TOON_STEPS = [0.35, 0.7, 1.0];
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

/** O1: a flat board (the opening's full-screen screen): the group goes under `parent` in an orthographic view 2 units tall and
 * 2 × aspect wide, fills `fitWidth` / `fitHeight` of that, sits `yFraction` of the height from the middle; and, `toon`, the gems
 * are cel shaded (a stepped toon material, opaque, with a black outline shell) for contrast against the water. */
export interface BoardStyle { flat?: { parent: THREE.Object3D; fitWidth: number; fitHeight: number; yFraction: number; aspect: () => number }; toon?: boolean }

/** O1: one gem's path in the dark opening: it circles a centre at a radius, ever faster, tumbling, then lands in its cell. */
interface Drift { cx: number; cy: number; r: number; w: number; phase: number; spin: THREE.Vector3; tilt: THREE.Euler }

type Phase =
  | { kind: 'swap'; a: number; b: number; durationMs: number }
  | { kind: 'drift'; driftMs: number; landMs: number }
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
  private readonly materials: THREE.Material[];
  private readonly outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x08060e, side: THREE.BackSide, transparent: true, opacity: 1 });
  private readonly drifts = new Map<number, Drift>();
  private opacityNow = 1;
  private selectedId: number | null = null;
  private queue: Phase[] = [];
  private active: ActivePhase | null = null;
  private shown = false;
  private showStartMs = 0;
  private fitScale = 1;

  constructor(private readonly camera: THREE.Camera, private readonly style: BoardStyle = {}) {
    if (style.toon) {
      // A stepped gradient: three bands of light, nearest-filtered so the steps stay hard.
      const steps = new Uint8Array(TOON_STEPS.map(v => Math.round(v * 255)));
      const gradient = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat); gradient.minFilter = gradient.magFilter = THREE.NearestFilter; gradient.needsUpdate = true;
      this.materials = PALETTE.map(c => new THREE.MeshToonMaterial({ color: c.hex, emissive: c.hex, emissiveIntensity: 0.12, gradientMap: gradient, transparent: true, opacity: 1 }));
    } else {
      this.materials = PALETTE.map(c => new THREE.MeshStandardMaterial({ color: c.hex, emissive: c.hex, emissiveIntensity: 0.35, roughness: 0.35, metalness: 0.1, transparent: true, opacity: GEM_OPACITY }));
    }
    (style.flat?.parent ?? camera).add(this.group);
    this.group.visible = false;
    this.layout();
  }

  /** O1: the gems' opacity (the board fades before the drop falls): a scale of each material's own. */
  setOpacity(k: number): void {
    if (k === this.opacityNow) return; this.opacityNow = k;
    for (const m of this.materials) m.opacity = (this.style.toon ? 1 : GEM_OPACITY) * k;
    this.outlineMaterial.opacity = k;
  }

  /** O1: the dark opening: every gem of the bound board starts somewhere in the view and circles, ever faster and more
   * chaotically, for `driftS` seconds, then lands in its cell over `landS`. The board must be bound and shown. */
  driftIn(nowMs: number, driftS: number, landS: number, seed = 1): void {
    if (!this.model) return;
    let x = seed >>> 0; const rand = (): number => { x = (x + 0x6d2b79f5) >>> 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const halfW = this.viewHalfWidth() / this.fitScale, halfH = this.viewHalfHeight() / this.fitScale;
    this.drifts.clear();
    for (const [id, mesh] of this.meshes) {
      const d: Drift = { cx: (rand() * 2 - 1) * halfW * 0.8, cy: (rand() * 2 - 1) * halfH * 0.8, r: 0.6 + rand() * Math.min(halfW, halfH) * 0.9, w: (0.25 + rand() * 0.6) * (rand() < 0.5 ? -1 : 1), phase: rand() * Math.PI * 2, spin: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(4), tilt: mesh.rotation.clone() };
      this.drifts.set(id, d); mesh.position.set(d.cx + Math.cos(d.phase) * d.r, d.cy + Math.sin(d.phase) * d.r, 0);
    }
    this.showStartMs = nowMs - SHOW_MS; this.queue = []; this.active = null; this.select(null);
    this.begin({ kind: 'drift', driftMs: driftS * 1000, landMs: landS * 1000 }, nowMs);
  }

  /** Half the view's width at the board's distance, in the group's parent's units. */
  private viewHalfWidth(): number { return this.style.flat ? this.style.flat.aspect() : Math.tan(THREE.MathUtils.degToRad((this.camera as THREE.PerspectiveCamera).fov) / 2) * BOARD_DISTANCE * (this.camera as THREE.PerspectiveCamera).aspect; }
  private viewHalfHeight(): number { return this.style.flat ? 1 : Math.tan(THREE.MathUtils.degToRad((this.camera as THREE.PerspectiveCamera).fov) / 2) * BOARD_DISTANCE; }

  /** Size and place the board for the current viewport. Call on resize. */
  layout(): void {
    const cols = this.model?.cols ?? 6;
    const rows = this.model?.rows ?? 6;
    const halfH = this.viewHalfHeight(), halfW = this.viewHalfWidth();
    if (this.style.flat) {
      // Flat and square to the view: no tilt, no distance; the gems sized to the screen's width on a portrait phone.
      const f = this.style.flat;
      this.fitScale = Math.min((halfW * 2 * f.fitWidth) / cols, (halfH * 2 * f.fitHeight) / rows);
      this.group.position.set(0, halfH * 2 * f.yFraction, 0);
      this.group.rotation.set(0, 0, 0);
    } else {
      const byWidth = (halfW * 2 * BOARD_FIT_WIDTH) / cols;
      const byHeight = (halfH * 2 * BOARD_FIT_HEIGHT) / (rows * Math.cos(BOARD_TILT));
      this.fitScale = Math.min(byWidth, byHeight);
      this.group.position.set(0, halfH * 2 * BOARD_Y_FRACTION, -BOARD_DISTANCE);
      this.group.rotation.set(-BOARD_TILT, 0, 0);
    }
    if (this.shown && !this.active) this.group.scale.setScalar(this.fitScale);
  }

  /** The bound model (dev: a check reads the grid to find a move). */
  get model_(): Board | null { return this.model; }

  get isBusy(): boolean {
    return this.active !== null || this.queue.length > 0;
  }

  /**
   * World-space y of the board's lowest corner if the camera had this pose
   * (position + look target). Locks use it to keep the board out of the
   * ground: the board lives in camera space, so a camera pitched down puts
   * its lower rows below the floor unless the whole framing is lifted.
   */
  lowestWorldY(position: THREE.Vector3, target: THREE.Vector3, cols = this.model?.cols ?? 6, rows = this.model?.rows ?? 6): number {
    const pc = this.camera as THREE.PerspectiveCamera, cam = new THREE.PerspectiveCamera(pc.fov, pc.aspect, 0.05, 10);
    cam.position.copy(position);
    cam.lookAt(target);
    cam.updateMatrixWorld();
    const halfH = Math.tan(THREE.MathUtils.degToRad(pc.fov) / 2) * BOARD_DISTANCE;
    const halfW = halfH * pc.aspect;
    const scale = Math.min((halfW * 2 * BOARD_FIT_WIDTH) / cols, (halfH * 2 * BOARD_FIT_HEIGHT) / (rows * Math.cos(BOARD_TILT)));
    const groupY = halfH * 2 * BOARD_Y_FRACTION;
    let lowest = Infinity;
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        // corner in board-local, then tilted about X, then into camera space, then world
        const lx = (sx * (cols - 1)) / 2 + sx * 0.5;
        const ly = (sy * (rows - 1)) / 2 + sy * 0.5;
        const p = new THREE.Vector3(lx * scale, ly * scale * Math.cos(-BOARD_TILT), ly * scale * Math.sin(-BOARD_TILT));
        p.y += groupY;
        p.z -= BOARD_DISTANCE;
        p.applyMatrix4(cam.matrixWorld);
        lowest = Math.min(lowest, p.y);
      }
    }
    return lowest;
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

  /** The gem under a ray, and its cell. */
  gemAt(raycaster: THREE.Raycaster): { id: number; cell: Cell } | null {
    if (!this.model || !this.shown) return null;
    const hit = raycaster.intersectObjects([...this.meshes.values()], false)[0];
    if (!hit) return null;
    const id = hit.object.userData.gemId as number;
    const cell = this.model.locate(id);
    return cell ? { id, cell } : null;
  }

  /** O1: a finger swipe from the gem under `raycaster` by (dx, dy) screen pixels: the gem swaps with its neighbour that way
   * (a wrong move swaps out and back, as a tap pair does). Returns true if a swap was made or refused, false if nothing was there. */
  swipe(raycaster: THREE.Raycaster, dx: number, dy: number): boolean {
    if (!this.model || !this.shown || this.isBusy) return false;
    const from = this.gemAt(raycaster); if (!from) return false;
    const to = swipeTarget(from.cell, dx, dy, this.model.rows, this.model.cols, SWIPE_PX); if (!to) return false;
    this.select(null);
    this.swapCells(from.id, from.cell, this.model.gemAt(to).id, to);
    return true;
  }

  /** Handle a tap. Returns true if the board consumed it. */
  tap(raycaster: THREE.Raycaster): boolean {
    if (!this.model || !this.shown || this.isBusy) return false;
    const at = this.gemAt(raycaster);
    if (!at) return false;
    const { id, cell } = at;

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
    this.select(null);
    this.swapCells(a, selectedCell, id, cell);
    return true;
  }

  /** Ask the model to swap two adjacent gems and queue what it answers. */
  private swapCells(a: number, cellA: Cell, b: number, cellB: Cell): void {
    const result = this.model!.swap(cellA, cellB);
    if (!result.valid) {
      // Swap out and straight back: the "no" of match-3.
      this.queue.push({ kind: 'swap', a, b, durationMs: INVALID_SWAP_MS });
      this.queue.push({ kind: 'swap', a, b, durationMs: INVALID_SWAP_MS });
      return;
    }
    this.queue.push({ kind: 'swap', a, b, durationMs: SWAP_MS });
    for (const step of result.steps) {
      this.queue.push({ kind: 'clear', step });
      this.queue.push({ kind: 'fall', step });
    }
    if (result.reshuffled) this.queue.push({ kind: 'rebuild' });
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
      case 'drift': {
        // The circling quickens: the angle grows with the cube of the time as well as the time; the last stretch eases each gem into its cell and its tilt.
        const t = (nowMs - a.startMs) / 1000, driftS = a.phase.driftMs / 1000, land = Math.max(0, Math.min(1, (nowMs - a.startMs - a.phase.driftMs) / a.phase.landMs)), k = easeInOutCubic(land);
        for (const [id, d] of this.drifts) {
          const mesh = this.meshes.get(id); if (!mesh) continue;
          const ang = d.phase + d.w * (t + 1.6 * t * t * t / (driftS * driftS)), wob = Math.min(1, t / driftS);
          const x = d.cx + Math.cos(ang) * d.r + Math.sin(t * 2.3 + d.phase) * 0.35 * wob, y = d.cy + Math.sin(ang) * d.r * 0.85 + Math.cos(t * 1.7 + d.phase * 2) * 0.35 * wob;
          const cell = this.model!.locate(id); const home = cell ? this.cellPosition(cell) : new THREE.Vector3();
          mesh.position.set(x + (home.x - x) * k, y + (home.y - y) * k, 0);
          const rate = (0.3 + wob * 1.2) * (1 - k);
          mesh.rotation.set(d.tilt.x + d.spin.x * t * rate, d.tilt.y + d.spin.y * t * rate, d.tilt.z + d.spin.z * t * rate);
        }
        break;
      }
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
    if (this.style.toon) { const shell = new THREE.Mesh(this.geometries[type], this.outlineMaterial); shell.scale.setScalar(OUTLINE_SCALE); shell.renderOrder = -1; mesh.add(shell); }
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
      case 'drift':
        durationMs = phase.driftMs + phase.landMs;
        break;
    }
    this.active = { phase, startMs: nowMs, durationMs, moves, shrinking };
  }

  private finish(a: ActivePhase): void {
    for (const m of a.moves) m.mesh.position.copy(m.to);
    if (a.phase.kind === 'drift') { for (const [id, d] of this.drifts) { const mesh = this.meshes.get(id), cell = this.model!.locate(id); if (mesh && cell) { mesh.position.copy(this.cellPosition(cell)); mesh.rotation.copy(d.tilt); } } this.drifts.clear(); }
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
