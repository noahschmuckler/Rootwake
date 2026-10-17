// F2: her moves, the Mixamo clips Noah chose (FIGHT_HANDOFF.md) played over the gait. Each move is a window
// of its clip (its wind up cut short, its recovery cut short) played faster than authored, with a contact
// time where the blow lands: the fight's rules run at the contact, not at the press. A tap is a light
// blow; taps in a row chain attack-1 → attack-2 → attack-3 (the finisher), a tap during a move is held
// (buffered) and starts the next one at the current move's chain time. Held, the strike is the heavy blow.
// The casts carry the thorn burst and the root bind; a bite while she is not mid-move is a flinch.
// `MoveQueue` is the pure timing (node-tested); `createMoveLayer` puts it on the gait's mixer, whole body
// when she stands and arms only when she is moving, so her legs keep running.
import * as THREE from 'three';
import type { Gait } from './huldaRig';

export type MoveName = 'attack-1' | 'attack-2' | 'attack-3' | 'heavy' | 'cast-burst' | 'cast-bind' | 'hit' | 'dodge';
export type Press = 'light' | 'heavy' | 'burst' | 'bind' | 'dodge';
export interface MoveSpec {
  /** Clip seconds: where it starts, where the blow lands, from when the next move may start, where it ends. */
  from: number; contact: number; chain: number; to: number;
  /** Playback rate over the clip's own. */ scale: number;
}
/** Tuning: windows read off the clips' hand speed (contact = the fastest frame), sped up so contact comes ~0.2–0.35 s after the press and a three-hit combo keeps about the old strike's pace (STRIKE_CD 0.45 s). */
export const MOVES: Record<MoveName, MoveSpec> = {
  'attack-1': { from: 0.62, contact: 0.97, chain: 1.12, to: 1.5, scale: 1.6 },
  'attack-2': { from: 0.74, contact: 1.03, chain: 1.18, to: 1.6, scale: 1.6 },
  'attack-3': { from: 0.72, contact: 1.07, chain: 1.55, to: 1.85, scale: 1.45 },
  heavy: { from: 0.36, contact: 0.83, chain: 1.1, to: 1.4, scale: 1.25 },
  'cast-burst': { from: 0.82, contact: 1.27, chain: 1.5, to: 1.95, scale: 1.4 },
  'cast-bind': { from: 0.4, contact: 0.8, chain: 1.0, to: 1.35, scale: 1.3 },
  hit: { from: 0.0, contact: 0.15, chain: 0.4, to: 0.7, scale: 1.2 },
  // F3: the dive roll from just before the dive; its contact is where she becomes untouchable (EVADE_TO ends it), its chain where the next move may start.
  dodge: { from: 0.55, contact: 0.6, chain: 1.75, to: 2.0, scale: 2.2 },
};
/** F3: the dodge's untouchable window ends at this clip time (the roll's middle). Tuning. */
export const EVADE_TO = 1.45;
/** The dive roll's travel along its clip (clip seconds, hips z in cm): she is moved along it, the clip itself kept in place. */
const DODGE_TRAVEL: [number, number][] = [[0.5, 56], [0.6, 82], [0.7, 127], [0.8, 169], [0.9, 216], [1.0, 260], [1.1, 304], [1.2, 338], [1.3, 361], [1.4, 379], [1.5, 400], [1.6, 421], [1.7, 436], [1.8, 446], [1.9, 450], [2.0, 452]];
/** How far through the roll's travel she is at clip time t, 0..1 from the move's start to its end. */
export function dodgeProgress(t: number): number {
  const z = (x: number): number => { const k = DODGE_TRAVEL; if (x <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (x <= k[i][0]) { const [t0, z0] = k[i - 1], [t1, z1] = k[i]; return z0 + (z1 - z0) * (x - t0) / (t1 - t0); } return k[k.length - 1][1]; };
  const a = z(MOVES.dodge.from), b = z(MOVES.dodge.to); return Math.max(0, Math.min(1, (z(t) - a) / (b - a)));
}
export const FIGHT_CLIPS: MoveName[] = ['attack-1', 'attack-2', 'attack-3', 'heavy', 'cast-burst', 'cast-bind', 'hit', 'dodge'];
/** Seconds to blend a move in and out. Tuning. */
export const FADE_IN = 0.07, FADE_OUT = 0.16;
const COMBO: MoveName[] = ['attack-1', 'attack-2', 'attack-3'];

export type MoveEvent = { kind: 'start' | 'contact' | 'end'; move: MoveName; step: number };
/** The timing of her moves, apart from any mixer. */
export class MoveQueue {
  current: { move: MoveName; t: number; contacted: boolean; step: number } | null = null;
  queued: { move: MoveName; step: number } | null = null;
  /** The blend weight of the move playing (0 when none), and what is fading out after one ended. */
  weight = 0;
  private ending: { move: MoveName; t: number; w: number } | null = null;
  get ended(): { move: MoveName; t: number; w: number } | null { return this.ending; }
  /** F3: in the dodge's untouchable window. */
  get evading(): boolean { const c = this.current; return !!c && c.move === 'dodge' && c.t >= MOVES.dodge.contact && c.t <= EVADE_TO; }
  /** Whether a move is playing (or one is waiting to). */
  get busy(): boolean { return !!this.current || !!this.queued; }
  /** A press: true if it started a move or was held for the next one. */
  press(p: Press): boolean {
    const c = this.current;
    if (p === 'light') {
      const step = c && COMBO.includes(c.move) ? (c.step + 1) % COMBO.length : 0;
      return this.offer({ move: COMBO[step], step });
    }
    // A dodge cuts any move short at once (not another dodge: one roll at a time).
    if (p === 'dodge') { if (c?.move === 'dodge') return false; this.begin({ move: 'dodge', step: 0 }); return true; }
    const move: MoveName = p === 'heavy' ? 'heavy' : p === 'burst' ? 'cast-burst' : 'cast-bind';
    return this.offer({ move, step: 0 });
  }
  /** A flinch: only when nothing else is playing (her blows are not broken by a bite). */
  flinch(): boolean { if (this.busy) return false; this.begin({ move: 'hit', step: 0 }); return true; }
  private offer(next: { move: MoveName; step: number }): boolean {
    const c = this.current;
    if (!c) { this.begin(next); return true; }
    if (c.move === 'hit') { this.begin(next); return true; }
    // One held at a time; the latest press wins, so a mash does not run on after the hands stop.
    this.queued = next; return true;
  }
  private begin(next: { move: MoveName; step: number }): MoveEvent[] {
    if (this.current) this.ending = { move: this.current.move, t: this.current.t, w: this.weight };
    this.current = { move: next.move, t: MOVES[next.move].from, contacted: false, step: next.step }; this.queued = null;
    this.pending.push({ kind: 'start', move: next.move, step: next.step });
    return this.pending;
  }
  private pending: MoveEvent[] = [];
  /** Advance by (scaled) seconds; returns what happened: starts, contacts, ends, in order. */
  step(dt: number): MoveEvent[] {
    const out = this.pending; this.pending = [];
    if (this.ending) { this.ending.w = Math.max(0, this.ending.w - dt / FADE_OUT); if (this.ending.w === 0) this.ending = null; }
    const c = this.current;
    if (!c) { this.weight = Math.max(0, this.weight - dt / FADE_OUT); return out; }
    const spec = MOVES[c.move];
    c.t += dt * spec.scale; this.weight = Math.min(1, this.weight + dt / FADE_IN);
    if (!c.contacted && c.t >= spec.contact) { c.contacted = true; out.push({ kind: 'contact', move: c.move, step: c.step }); }
    if (this.queued && c.t >= spec.chain) { const q = this.queued; this.begin(q); out.push(...this.pending); this.pending = []; return out; }
    if (c.t >= spec.to) { out.push({ kind: 'end', move: c.move, step: c.step }); this.ending = { move: c.move, t: Math.min(c.t, spec.to), w: this.weight }; this.current = null; this.weight = 0; }
    return out;
  }
}

/** The bones a move keeps while she runs: spine up, arms and hands. */
const UPPER = /Spine|Neck|Head|Shoulder|Arm|Hand/;
export interface MoveLayer { queue: MoveQueue; press(p: Press): boolean; flinch(): boolean; /** F3: hold the guard stance while no move plays. */ guard: boolean; update(dt: number, moving: number): MoveEvent[]; readonly playing: MoveName | null; dispose(): void }
/** Put the moves' clips (named after their files) on the gait's mixer. */
export function createMoveLayer(gait: Gait, root: THREE.Object3D, clips: THREE.AnimationClip[]): MoveLayer {
  const queue = new MoveQueue(), full = new Map<MoveName, THREE.AnimationAction>(), upper = new Map<MoveName, THREE.AnimationAction>();
  for (const name of FIGHT_CLIPS) {
    const clip = clips.find(c => c.name === name); if (!clip) continue;
    // In place: the hips keep their height (the stance), not their travel.
    for (const t of clip.tracks) if (t instanceof THREE.VectorKeyframeTrack && /Hips\.position$/.test(t.name)) { const v = t.values; for (let i = 0; i < v.length; i += 3) { v[i] = v[0]; v[i + 2] = v[2]; } }
    const top = new THREE.AnimationClip(`${name}-upper`, clip.duration, clip.tracks.filter(t => UPPER.test(t.name.split('.')[0])));
    for (const [map, c] of [[full, clip], [upper, top]] as const) { const a = gait.mixer.clipAction(c, root); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.paused = true; a.setEffectiveWeight(0); a.play(); map.set(name, a); }
  }
  let moving = 0, guardW = 0;
  /** F3: the guard stance: the fighting stance the combo's first clip starts from, held. Tuning: the clip time. */
  const GUARD_POSE: { move: MoveName; t: number } = { move: 'attack-2', t: 0.3 };
  function pose(move: MoveName, t: number, w: number): void {
    const f = full.get(move), u = upper.get(move); if (!f || !u) return;
    f.time = t; u.time = t;
    // The whole body when she stands; the arms (weighted to win over the gait's) when she runs.
    f.setEffectiveWeight(w * (1 - moving)); u.setEffectiveWeight(w * moving * 12);
  }
  function update(dt: number, mv: number): MoveEvent[] {
    moving += (THREE.MathUtils.clamp(mv, 0, 1) - moving) * Math.min(1, dt * 10);
    const events = queue.step(dt);
    for (const a of full.values()) a.setEffectiveWeight(0); for (const a of upper.values()) a.setEffectiveWeight(0);
    const e = queue.ended; if (e) pose(e.move, e.t, e.w);
    const c = queue.current; if (c) pose(c.move, c.t, queue.weight);
    guardW = THREE.MathUtils.clamp(guardW + (layer.guard && !c ? dt : -dt) / 0.12, 0, 1);
    const g = guardW * (1 - (c ? queue.weight : 0)); if (g > 0 && !(c && c.move === GUARD_POSE.move) && !(e && e.move === GUARD_POSE.move)) pose(GUARD_POSE.move, GUARD_POSE.t, g);
    gait.suppress = Math.max(c ? queue.weight : 0, e ? e.w : 0, g) * (1 - moving);
    return events;
  }
  function dispose(): void { for (const a of [...full.values(), ...upper.values()]) { a.stop(); gait.mixer.uncacheAction(a.getClip(), root); } gait.suppress = 0; }
  const layer: MoveLayer = { queue, guard: false, press: p => full.has(p === 'dodge' ? 'dodge' : 'attack-1') && queue.press(p), flinch: () => full.has('hit') && queue.flinch(), update, get playing() { return queue.current?.move ?? null; }, dispose };
  return layer;
}
