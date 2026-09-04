// Pass 0.3a: a minimal match-3 core. Pure TypeScript, no Three.js, no
// Phaser — the model the 3D board renders and the flowers listen to.
//
// Modelled on the shape of DiggyDwarves' board (swap two adjacent gems; a
// swap must make a run of 3+ or it reverts; runs clear; gems fall; new gems
// drop in from the top; repeat until stable). Deliberately WITHOUT specials,
// combos, tool durability or economy — the smallest slice that plays.
//
// The core resolves a swap synchronously and returns the whole cascade as a
// list of steps; the renderer animates the steps in order. That keeps this
// file testable in plain node and the animation code free of game rules.

import { mulberry32 } from './colors';

// ---- Tuning constants ---------------------------------------------------------
export const GEM_TYPES = 5; // == PALETTE.length; one gem type per flower
export const BOARD_ROWS = 6;
export const BOARD_COLS = 6;
// -------------------------------------------------------------------------------

export interface Gem {
  id: number;
  type: number;
}

export interface Cell {
  row: number;
  col: number;
}

/** A straight line of 3+ same-type gems. Reported per line, so an L clears as two runs. */
export interface Run {
  type: number;
  cells: Cell[];
}

export interface ClearedGem extends Cell {
  id: number;
  type: number;
}

export interface Fall {
  id: number;
  col: number;
  fromRow: number;
  toRow: number;
}

/** A new gem entering from above. fromRow is negative: how far above the top it starts. */
export interface Spawn extends Fall {
  type: number;
}

export interface CascadeStep {
  runs: Run[];
  cleared: ClearedGem[];
  falls: Fall[];
  spawns: Spawn[];
}

export type SwapResult =
  | { valid: false }
  | {
      valid: true;
      steps: CascadeStep[];
      /** The board had no move left afterwards and was re-dealt; the view must rebuild. */
      reshuffled: boolean;
    };

export class Board {
  /** grid[row][col], row 0 at the top. */
  grid: Gem[][] = [];
  private nextId = 1;
  private readonly rand: () => number;

  constructor(
    readonly rows: number,
    readonly cols: number,
    seed: number
  ) {
    this.rand = mulberry32(seed);
    this.deal();
  }

  gemAt(cell: Cell): Gem {
    return this.grid[cell.row][cell.col];
  }

  /** Where a gem currently sits, by id. */
  locate(id: number): Cell | null {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].id === id) return { row: r, col: c };
      }
    }
    return null;
  }

  static adjacent(a: Cell, b: Cell): boolean {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  /**
   * Attempt a swap. Adjacent cells only. If it makes no run the grid is left
   * untouched and { valid: false } comes back (the view plays the swap-and-
   * return itself). Otherwise the full cascade is applied and described.
   */
  swap(a: Cell, b: Cell): SwapResult {
    if (!Board.adjacent(a, b)) return { valid: false };
    this.exchange(a, b);
    if (this.findRuns().length === 0) {
      this.exchange(a, b);
      return { valid: false };
    }
    const steps: CascadeStep[] = [];
    for (;;) {
      const runs = this.findRuns();
      if (runs.length === 0) break;
      steps.push(this.clearAndFall(runs));
    }
    let reshuffled = false;
    if (!this.hasValidMove()) {
      this.deal();
      reshuffled = true;
    }
    return { valid: true, steps, reshuffled };
  }

  /** All horizontal and vertical runs of 3+ on the current grid. */
  findRuns(): Run[] {
    const runs: Run[] = [];
    for (let r = 0; r < this.rows; r++) {
      let start = 0;
      for (let c = 1; c <= this.cols; c++) {
        if (c === this.cols || this.grid[r][c].type !== this.grid[r][start].type) {
          if (c - start >= 3) {
            runs.push({ type: this.grid[r][start].type, cells: range(start, c).map((col) => ({ row: r, col })) });
          }
          start = c;
        }
      }
    }
    for (let c = 0; c < this.cols; c++) {
      let start = 0;
      for (let r = 1; r <= this.rows; r++) {
        if (r === this.rows || this.grid[r][c].type !== this.grid[start][c].type) {
          if (r - start >= 3) {
            runs.push({ type: this.grid[start][c].type, cells: range(start, r).map((row) => ({ row, col: c })) });
          }
          start = r;
        }
      }
    }
    return runs;
  }

  /** Is there any adjacent swap that would make a run? */
  hasValidMove(): boolean {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        for (const [dr, dc] of [[0, 1], [1, 0]] as const) {
          const b = { row: r + dr, col: c + dc };
          if (b.row >= this.rows || b.col >= this.cols) continue;
          const a = { row: r, col: c };
          this.exchange(a, b);
          const ok = this.findRuns().length > 0;
          this.exchange(a, b);
          if (ok) return true;
        }
      }
    }
    return false;
  }

  private exchange(a: Cell, b: Cell): void {
    const t = this.grid[a.row][a.col];
    this.grid[a.row][a.col] = this.grid[b.row][b.col];
    this.grid[b.row][b.col] = t;
  }

  private newGem(type: number): Gem {
    return { id: this.nextId++, type };
  }

  /** Fresh grid with no runs on it and at least one valid move. */
  private deal(): void {
    for (let attempt = 0; attempt < 100; attempt++) {
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
        const row: Gem[] = [];
        for (let c = 0; c < this.cols; c++) {
          // Avoid completing a run to the left or above, so the deal is stable.
          let type: number;
          do {
            type = Math.floor(this.rand() * GEM_TYPES);
          } while (
            (c >= 2 && row[c - 1].type === type && row[c - 2].type === type) ||
            (r >= 2 && this.grid[r - 1][c].type === type && this.grid[r - 2][c].type === type)
          );
          row.push(this.newGem(type));
        }
        this.grid.push(row);
      }
      if (this.hasValidMove()) return;
    }
    throw new Error('Board.deal: could not find a dealable grid');
  }

  private clearAndFall(runs: Run[]): CascadeStep {
    const clearedSet = new Set<string>();
    const cleared: ClearedGem[] = [];
    for (const run of runs) {
      for (const cell of run.cells) {
        const key = `${cell.row},${cell.col}`;
        if (clearedSet.has(key)) continue;
        clearedSet.add(key);
        const gem = this.grid[cell.row][cell.col];
        cleared.push({ ...cell, id: gem.id, type: gem.type });
      }
    }

    const falls: Fall[] = [];
    const spawns: Spawn[] = [];
    for (let c = 0; c < this.cols; c++) {
      // Walk the column bottom-up, compacting survivors downward.
      let write = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        if (clearedSet.has(`${r},${c}`)) continue;
        if (write !== r) {
          falls.push({ id: this.grid[r][c].id, col: c, fromRow: r, toRow: write });
          this.grid[write][c] = this.grid[r][c];
        }
        write--;
      }
      // Whatever is left above `write` is empty: fill from the top, dropping in.
      const empty = write + 1;
      for (let r = write; r >= 0; r--) {
        const gem = this.newGem(Math.floor(this.rand() * GEM_TYPES));
        this.grid[r][c] = gem;
        spawns.push({ id: gem.id, type: gem.type, col: c, fromRow: r - empty, toRow: r });
      }
    }
    return { runs, cleared, falls, spawns };
  }
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from }, (_, i) => from + i);
}
