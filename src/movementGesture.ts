/** Pointer gesture recognizer, independent of DOM clocks and rendering for regression tests. */
export const THUMBSTICK_RADIUS = 48;
export const TARGET_HOLD_MS = 430;
export const DOUBLE_TAP_MS = 290;
export const IGNITION_HOLD_MS = 140;
export type GestureMode = 'idle' | 'pending' | 'drive' | 'target' | 'ignition' | 'consumed';
export class MovementGesture {
  pointerId: number | null = null;
  mode: GestureMode = 'idle';
  x = 0;
  y = 0;
  private originX = 0;
  private originY = 0;
  private downAt = 0;
  private lastTap = -Infinity;
  private moved = false;
  private double = false;
  private cut = false;
  get held(): boolean { return this.pointerId !== null; }
  begin(id: number, x: number, y: number, now: number, powered: boolean, flying: boolean): boolean {
    if (this.held) return false;
    this.pointerId = id; this.originX = x; this.originY = y; this.downAt = now;
    this.x = 0; this.y = 0; this.moved = false;
    this.double = powered && now - this.lastTap <= DOUBLE_TAP_MS;
    this.lastTap = -Infinity;
    this.cut = this.double && flying;
    this.mode = this.cut ? 'consumed' : this.double ? 'ignition' : 'pending';
    return true;
  }
  move(id: number, x: number, y: number): void {
    if (id !== this.pointerId) return;
    const dx = x - this.originX, dy = y - this.originY, r = Math.hypot(dx, dy);
    const scale = Math.max(THUMBSTICK_RADIUS, r);
    this.x = dx / scale; this.y = dy / scale;
    if (r > 8) {
      this.moved = true;
      if (this.mode === 'pending') this.mode = 'drive';
    }
  }
  tick(now: number, flying = false): 'ignite' | 'cut' | null {
    if (this.cut) { this.cut = false; return 'cut'; }
    if (this.mode === 'ignition' && now - this.downAt >= IGNITION_HOLD_MS) { this.mode = 'drive'; return 'ignite'; }
    if (this.mode === 'pending' && !this.moved && !flying && now - this.downAt >= TARGET_HOLD_MS) this.mode = 'target';
    return null;
  }
  end(id: number, now: number, cancelled = false): 'commit' | 'cancel' | null {
    if (id !== this.pointerId) return null;
    const result = !cancelled && this.mode === 'target' && Math.hypot(this.x, this.y) > 0.18 ? 'commit' : 'cancel';
    if (!cancelled && !this.double && !this.moved && now - this.downAt < 230 && this.mode === 'pending') this.lastTap = now;
    this.pointerId = null; this.mode = 'idle'; this.x = 0; this.y = 0; this.cut = false;
    return result;
  }
  cancel(): void {
    if (this.pointerId !== null) this.end(this.pointerId, 0, true);
    this.lastTap = -Infinity;
  }
}
