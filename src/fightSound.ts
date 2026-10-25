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
  /** F3: a foe's tell: a low snarl rising. */
  growl(): void { this.tone('sawtooth', 62, 90, 0.42, 0.16, 0, 0.08); this.tone('sawtooth', 93, 128, 0.4, 0.08, 0.02, 0.08); this.hiss(0.6, 0.42, 0.22, 'bandpass', [300, 700, 400], 2.5); }
  /** F3: a bite taken on her guard: a hard wooden knock. */
  block(): void { this.tone('triangle', 420, 260, 0.08, 0.5); this.tone('sine', 140, 80, 0.16, 0.6); this.hiss(0.05, 0.08, 0.5, 'bandpass', [2400, 1600, 900], 2); }
  /** F3: the roll. */
  roll(): void { this.hiss(0.4, 0.32, 0.4, 'lowpass', [400, 1400, 300], 0.8); }
  /** A splash (STAGS.md pass 4, the stag wading): a plunge's thump under a bright wet hiss; `heavy` is the step into the river, else a stride's slap. */
  splash(heavy = false): void { if (heavy) this.tone('sine', 150, 70, 0.14, 0.35); this.hiss(0.08, heavy ? 0.34 : 0.18, heavy ? 0.5 : 0.28, 'bandpass', [1800, 4200, 900], 0.9); this.hiss(0.3, heavy ? 0.5 : 0.26, heavy ? 0.26 : 0.14, 'highpass', [2600, 5200, 3000], 1.4, 0.04); }
  /** F3: root time beginning: the world drops away under a low drone and a bright bell. */
  rootTime(): void { this.tone('sine', 55, 42, 2.2, 0.35, 0, 0.25); this.tone('sine', 1318, 1310, 1.6, 0.14, 0.02, 0.003); this.tone('sine', 1975, 1970, 1.2, 0.07, 0.05, 0.003); this.hiss(0.15, 0.6, 0.35, 'lowpass', [3000, 900, 150], 0.7); }
  /** She is bitten. */
  /** A voice: a tone with a quaver, gliding through `f` (Hz at 0, peak, end), panned (-1 left .. 1 right). */
  private voice(type: OscillatorType, f: [number, number, number], dur: number, gain: number, vib: number, pan: number, delay = 0): void {
    const c = this.ready(); if (!c) return; const t0 = c.currentTime + delay;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f[0], t0); o.frequency.linearRampToValueAtTime(f[1], t0 + dur * 0.35); o.frequency.exponentialRampToValueAtTime(f[2], t0 + dur);
    const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = vib; lg.gain.value = f[1] * 0.04; l.connect(lg); lg.connect(o.frequency);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f[1] * 2.2; bp.Q.value = 0.9;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(gain, t0 + 0.04); g.gain.setValueAtTime(gain, t0 + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const p = c.createStereoPanner ? c.createStereoPanner() : null; o.connect(bp); bp.connect(g); if (p) { p.pan.value = pan; g.connect(p); p.connect(this.out!); } else g.connect(this.out!);
    o.start(t0); l.start(t0); o.stop(t0 + dur + 0.02); l.stop(t0 + dur + 0.02);
  }
  /** Noah (2026-10-22): a snatcher running: a lost kid's bleat, quavering; `near` 0..1 its loudness by distance. */
  bleat(near: number, pan = 0): void { if (near <= 0.01) return; const p = 0.9 + Math.random() * 0.25; this.voice('sawtooth', [520 * p, 640 * p, 470 * p], 0.55, 0.18 * near, 13, pan); this.voice('sawtooth', [520 * p, 600 * p, 430 * p], 0.3, 0.12 * near, 13, pan, 0.62); }
  /** A snatcher at a door: an infant's cry, its mimicry, rising and breaking. */
  cry(near: number, pan = 0): void { if (near <= 0.01) return; const p = 0.95 + Math.random() * 0.15; this.voice('triangle', [430 * p, 720 * p, 380 * p], 0.9, 0.22 * near, 6, pan); this.voice('sawtooth', [860 * p, 1440 * p, 760 * p], 0.9, 0.04 * near, 6, pan); }
  hurt(): void { this.tone('sine', 95, 45, 0.28, 0.9); this.hiss(0.15, 0.25, 0.5, 'bandpass', [700, 400, 160], 1.4); }
}
