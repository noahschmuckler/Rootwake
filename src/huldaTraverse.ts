// Her parkour on the gait's mixer (parkour.ts plans the moves; this poses them). Each move's stages (crouch,
// reach, hang, pull, over, land; vault; hop; turn, lower, fall; leap) play a window of a Mixamo clip stretched
// over the stage's own seconds, so a clip's frames land where the motor puts her body. The clips she climbs
// with are Noah's to choose and download (MOBILITY.md, "Parkour clips"); until a clip is in
// public/models/clips its stages fall back to windows of the jump she already has (`jump.fbx`), and a step
// keeps the gait's stride. Like the fight's move layer (huldaMoves.ts), whole body, and the gait gives way.
import * as THREE from 'three';
import type { Gait } from './huldaRig';
import type { Traversal } from './mobility';
import { stageAt } from './parkour';

/** The clips the layer looks for, by file name (MOBILITY.md lists Mixamo's search terms for each). */
export const TRAVERSE_CLIPS = ['step-up', 'clamber', 'jump-to-hang', 'hang', 'climb-up', 'vault', 'hang-drop', 'running-jump', 'landing', 'jump'] as const;
export type TraverseClip = typeof TRAVERSE_CLIPS[number];
/** A window of a clip: fractions of its length (from > to plays it backwards), or seconds when `secs`. */
interface Seg { clip: TraverseClip; from: number; to: number; secs?: boolean }
const J = (from: number, to: number): Seg => ({ clip: 'jump', from, to, secs: true });
const C = (clip: TraverseClip, from = 0, to = 1): Seg => ({ clip, from, to });
/** The Mixamo jump (jump.fbx, 1.67 s): a crouch to 0.4, the take-off to 0.7, the air about 0.8, the landing's crouch at 1.2, standing by 1.5. */
const JUMP = { crouch: J(0.15, 0.42), reach: J(0.42, 0.78), hang: J(0.8, 0.8), pull: J(0.8, 1.1), over: J(1.1, 1.25), land: J(1.25, 1.5), air: J(0.5, 1.12) };
/** For each move and stage: the clip it wants, then what stands in until that clip is downloaded (null: the gait's own stride). Tuning. */
const SEGS: Record<string, Record<string, [Seg, Seg | null]>> = {
  step: { step: [C('step-up'), null], land: [C('step-up', 0.85, 1), null] },
  clamber: { clamber: [C('clamber', 0, 0.9), J(0.3, 1.2)], land: [C('clamber', 0.9, 1), JUMP.land] },
  mantle: { crouch: [C('jump-to-hang', 0, 0.3), JUMP.crouch], reach: [C('jump-to-hang', 0.3, 1), JUMP.reach], pull: [C('climb-up', 0, 0.6), JUMP.pull], over: [C('climb-up', 0.6, 0.95), JUMP.over], land: [C('climb-up', 0.95, 1), JUMP.land] },
  climb: { crouch: [C('jump-to-hang', 0, 0.3), JUMP.crouch], reach: [C('jump-to-hang', 0.3, 1), JUMP.reach], hang: [C('hang', 0, 0.5), JUMP.hang], pull: [C('climb-up', 0, 0.6), JUMP.pull], over: [C('climb-up', 0.6, 0.95), JUMP.over], land: [C('climb-up', 0.95, 1), JUMP.land] },
  vault: { vault: [C('vault', 0, 0.85), J(0.45, 1.2)], land: [C('vault', 0.85, 1), JUMP.land] },
  hop: { hop: [C('running-jump', 0.25, 0.85), J(0.55, 1.2)], land: [C('landing', 0.6, 1), JUMP.land] },
  jump: { jump: [C('running-jump', 0.15, 0.85), JUMP.air], land: [C('landing', 0.4, 1), JUMP.land] },
  leap: { leap: [C('running-jump', 0.15, 0.85), JUMP.air], land: [C('landing', 0.4, 1), JUMP.land] },
  drop: { jump: [C('running-jump', 0.3, 0.85), JUMP.air], land: [C('landing', 0.3, 1), JUMP.land] },
  // Lowering into a hang is the climb up played backwards.
  hangDrop: { turn: [C('climb-up', 1, 0.6), J(1.25, 1.05)], lower: [C('climb-up', 0.6, 0), J(1.05, 0.82)], hang: [C('hang', 0, 0.5), JUMP.hang], fall: [C('hang-drop', 0, 0.7), J(0.8, 1.05)], land: [C('landing', 0.3, 1), JUMP.land] },
};
/** Seconds to blend a move in, out, and from one stage's clip to the next. Tuning. */
export const FADE_IN = 0.08, FADE_OUT = 0.2, CROSS = 0.1;

/** Which clip window a move plays at time t, and where in the clip (seconds); the fan's own jumps and drops, which carry no stages, play as a leap through their length. */
export function poseFor(plan: Traversal, t: number, has: (c: TraverseClip) => boolean, duration: (c: TraverseClip) => number): { clip: TraverseClip; time: number; stage: string } | null {
  const stage = stageAt(plan, t) ?? { name: plan.kind === 'walk' || plan.kind === 'drift' ? '' : plan.kind === 'drop' ? 'jump' : plan.kind === 'jump' ? 'jump' : 'leap', k: t / Math.max(1e-3, plan.duration) };
  const pair = SEGS[plan.kind]?.[stage.name]; if (!pair) return null;
  const seg = has(pair[0].clip) ? pair[0] : pair[1]; if (!seg || !has(seg.clip)) return null;
  const u = seg.from + (seg.to - seg.from) * stage.k;
  return { clip: seg.clip, time: seg.secs ? u : u * duration(seg.clip), stage: stage.name };
}

/** Make a traversal clip pose in place: the hips keep none of the clip's travel (the motor carries her), only its crouch and lean. */
function inPlace(clip: THREE.AnimationClip): void {
  for (const t of clip.tracks) {
    if (!(t instanceof THREE.VectorKeyframeTrack) || !/Hips\.position$/.test(t.name)) continue;
    const v = t.values, n = v.length / 3, y0 = v[1], y1 = v[(n - 1) * 3 + 1];
    for (let i = 0; i < n; i++) {
      v[i * 3] = v[0]; v[i * 3 + 2] = v[2];
      // The rise (or fall) a clip carries from its first frame to its last is the motor's to make; what's left is the pose's dip.
      const u = n > 1 ? i / (n - 1) : 0; v[i * 3 + 1] -= (y1 - y0) * u;
      if (clip.name === 'jump') v[i * 3 + 1] = Math.min(v[i * 3 + 1], y0); // the jump's own rise is the arc's
    }
  }
}

export interface TraverseLayer { update(dt: number, plan: Traversal | null, t: number): void; readonly stage: string | null; readonly clips: TraverseClip[]; dispose(): void }
export function createTraverseLayer(gait: Gait, root: THREE.Object3D, clips: THREE.AnimationClip[]): TraverseLayer {
  const actions = new Map<TraverseClip, THREE.AnimationAction>();
  for (const name of TRAVERSE_CLIPS) {
    const src = clips.find(c => c.name === name); if (!src) continue;
    const clip = src.clone(); clip.name = name; inPlace(clip);
    const a = gait.mixer.clipAction(clip, root); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.paused = true; a.setEffectiveWeight(0); a.play(); actions.set(name, a);
  }
  let weight = 0, last = 0, current: { clip: TraverseClip; time: number } | null = null, previous: { clip: TraverseClip; time: number; w: number } | null = null, stage: string | null = null;
  const has = (c: TraverseClip) => actions.has(c), duration = (c: TraverseClip) => actions.get(c)!.getClip().duration;
  function update(dt: number, plan: Traversal | null, t: number): void {
    const p = plan ? poseFor(plan, t, has, duration) : null;
    if (p) {
      if (current && current.clip !== p.clip) previous = { ...current, w: 1 };
      current = { clip: p.clip, time: p.time }; stage = p.stage; weight = Math.min(1, weight + dt / FADE_IN);
    } else { stage = null; weight = Math.max(0, weight - dt / FADE_OUT); if (weight === 0) current = null; }
    if (previous) { previous.w = Math.max(0, previous.w - dt / CROSS); if (previous.w === 0 || previous.clip === current?.clip) previous = null; }
    for (const a of actions.values()) a.setEffectiveWeight(0);
    const k = previous ? 1 - previous.w : 1;
    if (previous) { const a = actions.get(previous.clip)!; a.time = previous.time; a.setEffectiveWeight(weight * previous.w); }
    if (current) { const a = actions.get(current.clip)!; a.time = Math.max(0, Math.min(current.time, a.getClip().duration)); a.setEffectiveWeight(weight * k); }
    // The fight's move layer sets the gait's suppress each frame it runs; where nothing else has, it is still ours from the last frame.
    const other = gait.suppress === last ? 0 : gait.suppress; gait.suppress = last = Math.max(other, weight);
  }
  function dispose(): void { for (const a of actions.values()) { a.stop(); gait.mixer.uncacheAction(a.getClip(), root); } }
  return { update, get stage() { return stage; }, get clips() { return [...actions.keys()]; }, dispose };
}
