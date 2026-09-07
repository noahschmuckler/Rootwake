// Underworld U0: the metallurgist's one stat — energy. Not the plateau's
// vitality: he never collapses and is never blinded. What energy scales is
// how fast he moves, how wide he sees and how far his darksight reaches.
// Effort (heating ore, forging, hopping) and time spend it; a still hold
// rests it back. It never falls below ENERGY_MIN, so the tunnel never closes.

// ---- Tuning constants ---------------------------------------------------------
export const ENERGY_START = 1.0;
export const ENERGY_MIN = 0.12;
export const DRAIN_HEAT = 0.01; // per match landing on ore or a forging
export const DRAIN_HOP = 0.004;
export const DRAIN_PER_SECOND = 0.0007; // awake, idle: full → floor in ~20 min
export const REST_RESTORE = 0.35;
export const REST_MS = 1200; // black in, black out
/** Movement: hop time multiplier from full energy to the floor. */
export const SLOW_AT_FLOOR = 2.1;
/** Fan reach multiplier from floor to full. */
export const FAN_AT_FLOOR = 0.5;
export const FAN_AT_FULL = 1.1;
/** Darksight: how far he sees, in metres, from the floor to full energy. */
export const SIGHT_AT_FLOOR = 3.5;
export const SIGHT_AT_FULL = 16;
/** The tunnel: fraction of the screen radius left clear at the floor (never closes). */
export const TUNNEL_CLEAR_AT_FLOOR = 0.3;
// -------------------------------------------------------------------------------

export interface EnergyEffects {
  /** 0..1 of the way from the floor to full. */
  level: number;
  slowdown: number;
  fanScale: number;
  sight: number;
  /** 0 = whole screen clear, 1 = the tunnel at its narrowest. */
  tunnel: number;
  /** 0..1 black overlay while resting. */
  blackout: number;
}

type Phase = { kind: 'awake' } | { kind: 'resting'; startMs: number };

export class Energy {
  value = ENERGY_START;
  private phase: Phase = { kind: 'awake' };
  private lastMs = 0;
  onEvent: (what: 'rested') => void = () => {};

  get busy(): boolean {
    return this.phase.kind !== 'awake';
  }

  drain(amount: number): void {
    if (this.busy) return;
    this.value = Math.max(ENERGY_MIN, this.value - amount);
  }

  rest(nowMs: number): void {
    if (this.busy) return;
    this.phase = { kind: 'resting', startMs: nowMs };
  }

  update(nowMs: number): void {
    const dt = this.lastMs ? Math.min(0.25, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    if (this.phase.kind === 'awake') {
      this.value = Math.max(ENERGY_MIN, this.value - DRAIN_PER_SECOND * dt);
    } else if (nowMs - this.phase.startMs >= REST_MS) {
      this.value = Math.min(1, this.value + REST_RESTORE);
      this.phase = { kind: 'awake' };
      this.onEvent('rested');
    }
  }

  effects(nowMs: number): EnergyEffects {
    const level = (this.value - ENERGY_MIN) / (1 - ENERGY_MIN);
    let blackout = 0;
    if (this.phase.kind === 'resting') {
      const t = (nowMs - this.phase.startMs) / REST_MS;
      blackout = t < 0.5 ? t * 2 : 2 - t * 2;
    }
    return {
      level,
      slowdown: SLOW_AT_FLOOR + (1 - SLOW_AT_FLOOR) * level,
      fanScale: FAN_AT_FLOOR + (FAN_AT_FULL - FAN_AT_FLOOR) * level,
      sight: SIGHT_AT_FLOOR + (SIGHT_AT_FULL - SIGHT_AT_FLOOR) * level,
      tunnel: 1 - level,
      blackout: Math.max(0, Math.min(1, blackout)),
    };
  }
}
