// The abstract puzzle state for one voxel: which tips exist, what colour each
// is, which are selected, which are gone. Pure data, no Three.js — DESIGN.md
// wants exactly one state model that every rendered face copy mirrors, so this
// must stay renderer-agnostic even though Pass 0 only draws one face.

import { MATCH_SIZE } from './colors';

export type TipStatus = 'live' | 'selected' | 'clearing' | 'cleared';

export type ToggleResult =
  | { kind: 'noop' }
  | { kind: 'selected'; tip: number; deselected: number[] }
  | { kind: 'deselected'; tip: number }
  | { kind: 'match'; tips: number[] };

export class PuzzleState {
  readonly colors: readonly number[];
  private status: TipStatus[];
  /** Selected tips in the order they were tapped — drives recede order. */
  private order: number[] = [];

  constructor(colors: readonly number[]) {
    this.colors = colors;
    this.status = colors.map(() => 'live');
  }

  statusOf(tip: number): TipStatus {
    return this.status[tip];
  }

  /** Selected tips, in tap order. */
  selected(): number[] {
    return [...this.order];
  }

  /**
   * Toggle-select a tip. UX choice flagged, not settled: picking a flower of
   * a *different* colour than the current selection drops the old selection
   * and starts over, rather than refusing or stacking. Mixed-colour selection
   * can never complete a match, so holding it would only be confusing.
   */
  toggle(tip: number): ToggleResult {
    const s = this.status[tip];
    if (s === 'clearing' || s === 'cleared') return { kind: 'noop' };

    if (s === 'selected') {
      this.status[tip] = 'live';
      this.order = this.order.filter((t) => t !== tip);
      return { kind: 'deselected', tip };
    }

    const color = this.colors[tip];
    const deselected: number[] = [];
    for (const other of this.order) {
      if (this.colors[other] !== color) {
        this.status[other] = 'live';
        deselected.push(other);
      }
    }
    this.order = this.order.filter((t) => this.colors[t] === color);

    this.status[tip] = 'selected';
    this.order.push(tip);
    if (this.order.length >= MATCH_SIZE) {
      const group = this.order;
      this.order = [];
      for (const t of group) this.status[t] = 'clearing';
      return { kind: 'match', tips: group };
    }
    return { kind: 'selected', tip, deselected };
  }

  markCleared(tip: number): void {
    this.status[tip] = 'cleared';
  }

  /** True when no colour still has MATCH_SIZE live tips — nothing left to clear. */
  isDead(): boolean {
    const counts = new Map<number, number>();
    this.status.forEach((s, i) => {
      if (s === 'live' || s === 'selected') {
        counts.set(this.colors[i], (counts.get(this.colors[i]) ?? 0) + 1);
      }
    });
    return ![...counts.values()].some((n) => n >= MATCH_SIZE);
  }
}
