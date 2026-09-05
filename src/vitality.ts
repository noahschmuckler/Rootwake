// Pass 0.7a: vitality (SYSTEMS.md §1). One value replaces energy, fatigue
// and strength. Effort and time drain it, food and rest restore it, and it
// drives strength, carrying, hop reach — and how the world is rendered (the
// halo, colour, exposure). There is no bar: the screen is the meter.
//
// Collapse is not death. At the floor you black out and wake still tired,
// and each collapse or rest without eating in between restores less, until
// all you can do is look, hop once, and drop. Eating resets that.

// ---- Tuning constants ---------------------------------------------------------
export const VITALITY_MAX = 1.0;
export const START_VITALITY = 0.9;
/** Drains. */
export const DRAIN_TREE_HIT = 0.012; // per shot landing on a tree
export const DRAIN_TILL_HIT = 0.015; // per shot landing on a patch
export const DRAIN_HOP = 0.008;
export const DRAIN_DRAG_HOP = 0.05;
export const DRAIN_PER_SECOND = 0.0015; // awake, idle: full → empty in ~11 min
/** Food. Seeds are poor food. */
export const SEED_VITALITY = 0.04;
export const EAT_INTERVAL_MS = 260; // one seed per this while the box is held
/** Rest (outdoors, no shelter yet): restores this much, to at most the outdoor ceiling. */
export const REST_RESTORE = 0.35;
export const REST_CEILING_OUTDOORS = 0.7;
/** Collapse: the floor, the wake level, and how each collapse/rest without food shrinks it. */
export const COLLAPSE_FLOOR = 0.05;
export const WAKE_LEVEL = 0.35;
export const DIMINISH = 0.6;
export const BLACKOUT_MS = 1400;
/** Bands, as fractions of VITALITY_MAX. */
export const WELL_FED = 0.85;
export const TIRED = 0.45;
export const EXHAUSTED = 0.2;
// -------------------------------------------------------------------------------

export type Band = 'wellfed' | 'normal' | 'tired' | 'exhausted' | 'floor';

/** What the rest of the game reads off vitality each frame. */
export interface VitalityEffects {
  band: Band;
  /** Multiplies mass thresholds in the weight rule. */
  strength: number;
  /** Multiplies stack caps. */
  capScale: number;
  /** Hands you can use: 2, 1 or 0. */
  handsAvailable: number;
  /** Multiplies the waypoint fan's reach. */
  fanScale: number;
  /** 0 = clear, 1 = the edge of the screen is black and vision is a tunnel. */
  haloDark: number;
  /** 0 = none, 1 = the warm well-fed glow at full. */
  haloLight: number;
  /** Colour saturation and exposure multipliers for the render. */
  saturation: number;
  exposure: number;
  /** 0..1 black overlay for collapse/rest fades. */
  blackout: number;
}

type Phase = { kind: 'awake' } | { kind: 'fading'; to: 'collapse' | 'rest'; startMs: number } | { kind: 'waking'; startMs: number };

export class Vitality {
  value = START_VITALITY;
  /** Collapses and rests since the last meal: each one restores less. */
  private sinceEating = 0;
  private phase: Phase = { kind: 'awake' };
  private lastMs = 0;
  /** Fired on the moment of collapse and on waking, for hints. */
  onEvent: (what: 'collapse' | 'wake' | 'rest' | 'ate') => void = () => {};

  get band(): Band {
    const v = this.value / VITALITY_MAX;
    if (v <= COLLAPSE_FLOOR) return 'floor';
    if (v < EXHAUSTED) return 'exhausted';
    if (v < TIRED) return 'tired';
    if (v >= WELL_FED) return 'wellfed';
    return 'normal';
  }

  /** True while blacked out or fading — input should be off. */
  get busy(): boolean {
    return this.phase.kind !== 'awake';
  }

  drain(amount: number): void {
    if (this.phase.kind !== 'awake') return;
    this.value = Math.max(0, this.value - amount);
  }

  /** Eat one unit of food worth `amount`. Resets the diminishing counter. */
  eat(amount: number): void {
    this.value = Math.min(VITALITY_MAX, this.value + amount);
    this.sinceEating = 0;
    this.onEvent('ate');
  }

  /** Lie down where you are. */
  rest(nowMs: number): void {
    if (this.phase.kind !== 'awake') return;
    this.phase = { kind: 'fading', to: 'rest', startMs: nowMs };
  }

  update(nowMs: number): void {
    const dt = this.lastMs ? Math.min(0.25, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    switch (this.phase.kind) {
      case 'awake':
        this.value = Math.max(0, this.value - DRAIN_PER_SECOND * dt);
        if (this.value <= COLLAPSE_FLOOR * VITALITY_MAX) {
          this.phase = { kind: 'fading', to: 'collapse', startMs: nowMs };
          this.onEvent('collapse');
        }
        break;
      case 'fading':
        if (nowMs - this.phase.startMs >= BLACKOUT_MS) {
          const factor = Math.pow(DIMINISH, this.sinceEating);
          this.sinceEating++;
          if (this.phase.to === 'collapse') {
            this.value = Math.max(this.value, WAKE_LEVEL * factor * VITALITY_MAX);
          } else {
            const ceiling = REST_CEILING_OUTDOORS * VITALITY_MAX;
            this.value = Math.min(Math.max(this.value, ceiling), this.value + REST_RESTORE * factor);
            this.value = Math.max(this.value, COLLAPSE_FLOOR * VITALITY_MAX + 0.02);
          }
          const was = this.phase.to;
          this.phase = { kind: 'waking', startMs: nowMs };
          this.onEvent(was === 'rest' ? 'rest' : 'wake');
        }
        break;
      case 'waking':
        if (nowMs - this.phase.startMs >= BLACKOUT_MS) this.phase = { kind: 'awake' };
        break;
    }
  }

  effects(nowMs: number): VitalityEffects {
    const v = this.value / VITALITY_MAX;
    const band = this.band;
    // Smooth curves between the bands so the halo creeps rather than steps.
    const tiredness = clamp01((TIRED - v) / TIRED); // 0 at TIRED, 1 at empty
    const haloDark = Math.pow(tiredness, 0.8);
    const haloLight = clamp01((v - WELL_FED) / (1 - WELL_FED));
    let blackout = 0;
    if (this.phase.kind === 'fading') blackout = clamp01((nowMs - this.phase.startMs) / BLACKOUT_MS);
    else if (this.phase.kind === 'waking') blackout = 1 - clamp01((nowMs - this.phase.startMs) / BLACKOUT_MS);
    const tiers: Record<Band, [number, number, number, number]> = {
      // strength, capScale, hands, fanScale
      wellfed: [1.25, 1, 2, 1.1],
      normal: [1, 1, 2, 1],
      tired: [0.75, 0.5, 2, 0.7],
      exhausted: [0.5, 0.25, 1, 0.45],
      floor: [0.25, 0, 0, 0.3],
    };
    const [strength, capScale, handsAvailable, fanScale] = tiers[band];
    return {
      band,
      strength,
      capScale,
      handsAvailable,
      fanScale,
      haloDark,
      haloLight,
      saturation: 1 - 0.75 * Math.pow(tiredness, 1.5) + 0.15 * haloLight,
      exposure: 1 - 0.35 * tiredness + 0.08 * haloLight,
      blackout,
    };
  }
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
