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
/** U1: while nourished, every drain (idle, hop, heat) is multiplied by the food's factor (this if it has none). */
export const NOURISHED_DRAIN = 0.6;
/** U2: the suit. Putting a piece on imparts this much of his energy into it (and it comes back when it is
 *  taken off); the piece then sustains its effect no matter how low he runs. The helm holds darksight
 *  at HELM_SIGHT and the tunnel open. Balancing to come. */
export const CHEST_CHARGE = 0.3;
export const HELM_CHARGE = 0.1;
export const HELM_SIGHT = 30;
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
  private nourishedUntil = -1;
  private nourishFactor = NOURISHED_DRAIN;
  /** U2: sustained by worn pieces — darksight never below this, and the tunnel held open. */
  sightFloor = 0;
  holdVision = false;

  /** Impart energy into a piece being put on. False (and nothing spent) if it would leave him at the floor. */
  impart(amount: number): boolean {
    if (this.busy || this.value - amount < ENERGY_MIN + 0.05) return false;
    this.value -= amount;
    return true;
  }
  /** The energy in a piece taken off flows back. */
  giveBack(amount: number): void {
    this.value = Math.min(1, this.value + amount);
  }
  onEvent: (what: 'rested' | 'ate') => void = () => {};

  nourished(nowMs: number): boolean {
    return nowMs < this.nourishedUntil;
  }
  private drainScale(): number {
    return this.lastMs < this.nourishedUntil ? this.nourishFactor : 1;
  }

  /** U1: eat one unit of food worth `amount`; nourishing food slows every drain by `factor` for `nourishMs`. */
  eat(amount: number, nourishMs = 0, factor = NOURISHED_DRAIN): void {
    if (this.busy) return;
    this.value = Math.min(1, this.value + amount);
    if (nourishMs > 0) {
      // A stronger food takes over; a weaker one only extends what is already there.
      const until = Math.max(this.nourishedUntil, this.lastMs) + nourishMs;
      if (!this.nourished(this.lastMs) || factor <= this.nourishFactor) this.nourishFactor = factor;
      this.nourishedUntil = until;
    }
    this.onEvent('ate');
  }

  get busy(): boolean {
    return this.phase.kind !== 'awake';
  }

  drain(amount: number): void {
    if (this.busy) return;
    this.value = Math.max(ENERGY_MIN, this.value - amount * this.drainScale());
  }

  rest(nowMs: number): void {
    if (this.busy) return;
    this.phase = { kind: 'resting', startMs: nowMs };
  }

  update(nowMs: number): void {
    const dt = this.lastMs ? Math.min(0.25, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    if (this.phase.kind === 'awake') {
      this.value = Math.max(ENERGY_MIN, this.value - DRAIN_PER_SECOND * dt * this.drainScale());
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
      sight: Math.max(this.sightFloor, SIGHT_AT_FLOOR + (SIGHT_AT_FULL - SIGHT_AT_FLOOR) * level),
      tunnel: this.holdVision ? 0 : 1 - level,
      blackout: Math.max(0, Math.min(1, blackout)),
    };
  }
}
