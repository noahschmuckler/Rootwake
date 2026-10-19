// Her parkour on the gait's mixer (parkour.ts plans the moves; this poses them). Each stage of a move names a
// window of one of Noah's Mixamo clips (MOBILITY.md, "Parkour clips"), played over the stage's own seconds.
// The planner shaped the stage's path on the clip's own motion (parkourClips.ts), so the clip's travel is
// taken out of it here: the hips keep no drift forward or aside, and their height is kept about the clip's
// lowest foot, which the motor's path carries. Her feet then stay where the path puts them. The fan's own
// jumps and drops, which carry no stages, play the running jump. Like the fight's move layer (huldaMoves.ts),
// whole body, and the gait gives way. A stage whose clip isn't loaded leaves her to the gait.
import * as THREE from 'three';
import type { Gait } from './huldaRig';
import type { Traversal } from './mobility';
import { stageAt } from './parkour';
import { footAt, yawAt, FOOT_REST } from './parkourClips';

/** The clips the layer plays, by file name. */
export const TRAVERSE_CLIPS = ['step-up', 'mount', 'jump', 'jump-to-hang', 'hang', 'climb-up', 'vault', 'hang-drop', 'running-jump', 'landing'] as const;
/** The fan's jumps and drops (no stages): the running jump's air through their length. Tuning. */
const FAN_JUMP = { clip: 'running-jump', from: 0.05, to: 0.72 };
/** Seconds to blend a move in, out, and from one stage's clip to the next. Tuning. */
export const FADE_IN = 0.08, FADE_OUT = 0.2, CROSS = 0.12;

/** Which clip a move plays at time t and where in it (seconds). */
export function poseFor(plan: Traversal, t: number): { clip: string; time: number; stage: string; fade?: number } | null {
  const st = stageAt(plan, t);
  if (!st) {
    if (plan.kind !== 'jump' && plan.kind !== 'drop') return null;
    const k = Math.min(1, t / Math.max(1e-3, plan.duration));
    return { clip: FAN_JUMP.clip, time: FAN_JUMP.from + (FAN_JUMP.to - FAN_JUMP.from) * k, stage: plan.kind };
  }
  const s = plan.stages!.find(x => x.at === st.at && x.name === st.name);
  if (!s?.clip || s.from === undefined || s.to === undefined) return null;
  return { clip: s.clip, time: s.from + (s.to - s.from) * st.k, stage: s.name, fade: s.fade };
}

/** Clips whose travel stays in them: the mount's figure goes over the top while her body (the path) waits at its foot. */
const KEEPS_TRAVEL = new Set(['mount']);
/** Take a clip's travel out (above): the hips pinned across, and their height kept about its lowest foot. A clip whose
 * obstacle doesn't lie ahead (parkourClips' yaw: the mount's) is turned until it does. */
export function inPlace(clip: THREE.AnimationClip, name: string): void {
  const q = new THREE.Quaternion(), turn = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), keep = KEEPS_TRAVEL.has(name);
  for (const t of clip.tracks) {
    if (t instanceof THREE.QuaternionKeyframeTrack && /Hips\.quaternion$/.test(t.name)) {
      const v = t.values;
      for (let i = 0; i < t.times.length; i++) { const a = yawAt(name, t.times[i]); if (!a) continue; turn.setFromAxisAngle(up, a); q.fromArray(v, i * 4).premultiply(turn).toArray(v, i * 4); }
    }
    if (!(t instanceof THREE.VectorKeyframeTrack) || !/Hips\.position$/.test(t.name)) continue;
    const v = t.values, x0 = v[0], z0 = v[2];
    for (let i = 0; i < t.times.length; i++) {
      const a = yawAt(name, t.times[i]), dx = v[i * 3] - x0, dz = v[i * 3 + 2] - z0, c = Math.cos(a), s = Math.sin(a);
      v[i * 3] = keep ? x0 + dx * c + dz * s : x0; v[i * 3 + 2] = keep ? z0 - dx * s + dz * c : z0;
      v[i * 3 + 1] -= footAt(name, t.times[i]) - FOOT_REST;
    }
  }
}

export interface TraverseLayer { update(dt: number, plan: Traversal | null, t: number): void; readonly stage: string | null; readonly clips: string[]; dispose(): void }
export function createTraverseLayer(gait: Gait, root: THREE.Object3D, clips: THREE.AnimationClip[]): TraverseLayer {
  const actions = new Map<string, THREE.AnimationAction>();
  for (const name of TRAVERSE_CLIPS) {
    const src = clips.find(c => c.name === name); if (!src) continue;
    const clip = src.clone(); clip.name = `parkour-${name}`; inPlace(clip, name);
    const a = gait.mixer.clipAction(clip, root); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.paused = true; a.setEffectiveWeight(0); a.play(); actions.set(name, a);
  }
  let weight = 0, last = 0, cross = CROSS, current: { clip: string; time: number } | null = null, previous: { clip: string; time: number; w: number } | null = null, stage: string | null = null;
  function update(dt: number, plan: Traversal | null, t: number): void {
    const p = plan ? poseFor(plan, t) : null;
    if (p && actions.has(p.clip)) {
      if (current && current.clip !== p.clip) { previous = { ...current, w: 1 }; cross = p.fade ?? CROSS; }
      current = { clip: p.clip, time: p.time }; stage = p.stage; weight = Math.min(1, weight + dt / FADE_IN);
    } else { stage = p?.stage ?? null; weight = Math.max(0, weight - dt / FADE_OUT); if (weight === 0) current = null; }
    if (previous) { previous.w = Math.max(0, previous.w - dt / cross); if (previous.w === 0 || previous.clip === current?.clip) previous = null; }
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
