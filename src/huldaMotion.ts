/** Presentation only: metres/second in, continuous gait out. No root motion. */
const TAU = Math.PI * 2;
export const WALK_RUN_START = 0.9, WALK_RUN_END = 2.1;
const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export class HuldaMotion {
  phase = 0;
  speed = 0;
  time = 0;
  heading = 0;
  private initialized = false;
  update(seconds: number, measuredSpeed: number, heading: number, grounded = true): void {
    const dt = Number.isFinite(seconds) ? Math.max(0, Math.min(seconds, 0.05)) : 0;
    const target = grounded && Number.isFinite(measuredSpeed) ? Math.max(0, Math.min(measuredSpeed, 2.8)) : 0;
    this.speed += (target - this.speed) * (1 - Math.exp(-dt * 14));
    if (this.speed < 0.001) this.speed = 0;
    this.time += dt;
    // One shared cycle for walk and run; blending never restarts a footfall.
    this.phase = (this.phase + dt * this.speed / (0.52 + 0.5 * this.run) * TAU) % TAU;
    if (Number.isFinite(heading)) {
      if (!this.initialized) { this.heading = heading; this.initialized = true; }
      const delta = Math.atan2(Math.sin(heading - this.heading), Math.cos(heading - this.heading));
      this.heading += delta * (1 - Math.exp(-dt * 16));
    }
  }
  get moving(): number { return smooth(0.015, 0.35, this.speed); }
  get run(): number { return smooth(WALK_RUN_START, WALK_RUN_END, this.speed); }
}
