// F1: the sound of a fight, synthesised (no files): a whoosh for every swing, a thud for a blow that
// lands, a crunch and a bright ping for a kill, the crack of the thorns, the creak of the roots, a
// low thump when she is bitten. Web Audio wakes only on a touch (browsers keep it asleep till then), so
// `wake()` is called from the first pointerdown. Tuning: the master level and each sound's lines.

type Ctx = AudioContext;
export const MASTER = 0.55;

export class FightSound {
  private ctx: Ctx | null = null;
  private out: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  muted = false;
  /** Make (or resume) the audio context: call from a user gesture. */
  wake(): void {
    if (this.muted) return;
    try {
      if (!this.ctx) {
        const C = (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext); if (!C) return;
        this.ctx = new C(); this.out = this.ctx.createGain(); this.out.gain.value = MASTER;
        const comp = this.ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; this.out.connect(comp); comp.connect(this.ctx.destination);
        const n = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate), d = n.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = n;
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch { this.ctx = null; }
  }
  private ready(): Ctx | null { return !this.muted && this.ctx && this.ctx.state === 'running' && this.out ? this.ctx : null; }
  /** Filtered noise with an envelope; the filter's frequency sweeps along `sweep` (Hz at 0, peak, end). */
  private hiss(at: number, dur: number, gain: number, type: BiquadFilterType, sweep: [number, number, number], q = 1.2, delay = 0): void {
    const c = this.ready(); if (!c || !this.noise) return; const t0 = c.currentTime + delay;
    const src = c.createBufferSource(); src.buffer = this.noise; src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(sweep[0], t0); f.frequency.exponentialRampToValueAtTime(sweep[1], t0 + dur * at); f.frequency.exponentialRampToValueAtTime(sweep[2], t0 + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + dur * at); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.out!); src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.02);
  }
  /** A tone sliding from `f0` to `f1`. */
  private tone(type: OscillatorType, f0: number, f1: number, dur: number, gain: number, delay = 0, attack = 0.004): void {
    const c = this.ready(); if (!c) return; const t0 = c.currentTime + delay;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.out!); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  /** A swing through the air; `side` alternates the pitch a little so a run of strikes is not one sound. */
  whoosh(side = 1): void { const p = side > 0 ? 1 : 0.86; this.hiss(0.35, 0.2, 0.5, 'bandpass', [500 * p, 2600 * p, 700 * p], 1.6); }
  /** A blow that lands: a low body and a wooden click. */
  thud(heavy = false): void { this.tone('sine', heavy ? 130 : 170, heavy ? 42 : 60, heavy ? 0.22 : 0.15, heavy ? 0.9 : 0.7); this.hiss(0.08, 0.06, heavy ? 0.6 : 0.45, 'lowpass', [3200, 1800, 400], 0.7); this.tone('triangle', 900, 520, 0.05, 0.18); }
  /** A kill: the thud, a crunch, a falling note and a bright ping that rings on. */
  kill(): void { this.thud(true); this.hiss(0.1, 0.24, 0.55, 'bandpass', [1800, 900, 300], 0.9, 0.02); this.tone('sawtooth', 320, 70, 0.32, 0.12, 0.03); this.tone('sine', 1760, 1700, 0.5, 0.16, 0.07, 0.002); this.tone('sine', 2637, 2600, 0.42, 0.08, 0.1, 0.002); }
  /** The thorns tearing out of the ground. */
  thorns(): void { this.tone('sine', 85, 38, 0.45, 0.9); for (let i = 0; i < 5; i++) this.hiss(0.2, 0.09, 0.4, 'highpass', [2400, 3800, 1600], 1.5, i * 0.035); this.hiss(0.25, 0.5, 0.35, 'lowpass', [1400, 900, 200], 0.6); }
  /** The roots heaving up and winding tight. */
  roots(): void { this.tone('sawtooth', 70, 48, 0.55, 0.22, 0, 0.04); this.tone('sawtooth', 104, 66, 0.5, 0.12, 0.05, 0.05); this.hiss(0.4, 0.5, 0.4, 'lowpass', [500, 1200, 300], 0.8); }
  /** She is bitten. */
  hurt(): void { this.tone('sine', 95, 45, 0.28, 0.9); this.hiss(0.15, 0.25, 0.5, 'bandpass', [700, 400, 160], 1.4); }
}
