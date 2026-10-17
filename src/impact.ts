// F1 (Noah, 2026-10-15: "more modern fighting, visually thrilling and satisfying"): the feel of a blow,
// apart from what the blow does. A hit freezes the world for a few hundredths of a second (hit-stop),
// shakes the camera by "trauma" that decays (squared, so small hits stay small), narrows the field of
// view for a moment (a punch in), and the last kill of a fight slows time for half a second. Pure timers
// and maths; the camera is touched only in `push`/`pop`, around the render, so no camera rig ever sees
// the shake. Node-testable.

export type Blow = 'light' | 'heavy' | 'kill' | 'finale' | 'hurt' | 'faint';
export interface BlowFeel {
  /** Seconds the world stands still. */ stop: number;
  /** Trauma added (0..1); the shake is trauma². */ trauma: number;
  /** Degrees the field of view narrows (negative widens). */ kick: number;
  /** Seconds of slow motion after the stop. */ slow: number;
  /** A vibration pattern (ms), where the browser has one (Android; not iOS Safari). */ buzz: number[];
}
/** Tuning: the hit-stops after the fighting games' 3–8 frames at 60 fps; a finale is the last foe of a fight falling. */
export const BLOWS: Record<Blow, BlowFeel> = {
  light: { stop: 0.055, trauma: 0.22, kick: 1.2, slow: 0, buzz: [14] },
  heavy: { stop: 0.09, trauma: 0.42, kick: 2.4, slow: 0, buzz: [26] },
  kill: { stop: 0.12, trauma: 0.55, kick: 3.2, slow: 0, buzz: [20, 30, 45] },
  finale: { stop: 0.16, trauma: 0.7, kick: 5, slow: 0.7, buzz: [30, 40, 70] },
  hurt: { stop: 0.05, trauma: 0.5, kick: -1.6, slow: 0, buzz: [45] },
  faint: { stop: 0.2, trauma: 0.9, kick: -3, slow: 0.9, buzz: [80, 60, 120] },
};
/** The time scale while frozen (not quite zero, so nothing divides by it) and at the bottom of the slow motion. Tuning. */
export const STOP_SCALE = 0.02, SLOW_SCALE = 0.25;
/** F3, root time: after a dodge timed to the bite, the world runs at ROOT_SCALE for ROOT_S real seconds (easing in and out over ROOT_EASE) while she keeps her own pace. Tuning. */
export const ROOT_SCALE = 0.22, ROOT_S = 2.2, ROOT_EASE = 0.25;
/** Trauma lost per second; the shake's largest turn (radians) and drift (m); its noise rate (Hz). Tuning. */
export const TRAUMA_DECAY = 1.7, SHAKE_TURN = 0.045, SHAKE_SHIFT = 0.07, SHAKE_HZ = 17;
/** The punch in eases back at this rate (1/s). Tuning. */
export const KICK_EASE = 9;

/** What `push` needs of a camera (a THREE.PerspectiveCamera has all of it). */
export interface ShakeCamera {
  fov: number;
  position: { x: number; y: number; z: number };
  rotateX(a: number): unknown; rotateY(a: number): unknown; rotateZ(a: number): unknown;
  quaternion: { x: number; y: number; z: number; w: number; set(x: number, y: number, z: number, w: number): unknown };
  updateProjectionMatrix(): void;
}

// Smooth noise in [-1, 1] from a few incommensurate sines: cheap, continuous, never periodic to the eye.
const wobble = (t: number, seed: number): number => (Math.sin(t * 1.0 + seed) * 0.5 + Math.sin(t * 2.31 + seed * 1.7) * 0.3 + Math.sin(t * 4.87 + seed * 3.1) * 0.2);

export class Impact {
  stop = 0; slow = 0; slowTotal = 0; trauma = 0; kick = 0; clock = 0;
  /** F3: root time left (real seconds), and her own time scale this frame (the world's is what `step` returns). */
  root = 0; herScale = 1;
  /** Begin root time. */
  rootTime(seconds = ROOT_S): void { this.root = Math.max(this.root, seconds); }
  /** 0..1, how deep into root time the world is (for the screen's tint). */
  get rooted(): number { if (this.root <= 0) return 0; const age = ROOT_S - this.root; return Math.min(1, age / ROOT_EASE, this.root / ROOT_EASE); }
  /** Off by `?shake=0`, for those it unsettles; the hit-stop and slow motion stay. */
  shake = true;
  private saved = { fov: 0, x: 0, y: 0, z: 0, qx: 0, qy: 0, qz: 0, qw: 1 };
  private pushed = false;
  /** The latest blows felt (dev and checks), newest last. */
  log: Blow[] = [];
  /** A blow lands: the stronger of what is running and what it asks for, never stacked into a long freeze. */
  hit(kind: Blow, scale = 1): void {
    const f = BLOWS[kind]; this.log.push(kind); if (this.log.length > 24) this.log.shift();
    this.stop = Math.max(this.stop, f.stop * scale);
    this.trauma = Math.min(1, this.trauma + f.trauma * scale);
    this.kick = Math.abs(f.kick) > Math.abs(this.kick) ? f.kick * scale : this.kick;
    if (f.slow > 0 && f.slow >= this.slow) { this.slow = f.slow; this.slowTotal = f.slow; }
    const nav = typeof navigator !== 'undefined' ? navigator as Navigator & { vibrate?: (p: number[]) => boolean } : null;
    try { nav?.vibrate?.(f.buzz); } catch { /* Not every browser lets a page buzz. */ }
  }
  /** Advance by real seconds; returns the scale for the world's time this frame (the stop first, then the slow motion easing back to 1). */
  step(real: number): number {
    const world = this.stepWorld(real), r = this.rooted;
    // In root time the world slows and she does not: her scale is the world's without the root.
    this.herScale = r > 0 ? Math.min(1, world / (1 - r * (1 - ROOT_SCALE))) : world;
    if (this.root > 0) this.root = Math.max(0, this.root - (Number.isFinite(real) ? Math.max(0, Math.min(0.25, real)) : 0));
    return world;
  }
  private stepWorld(real: number): number {
    const dt = Number.isFinite(real) ? Math.max(0, Math.min(0.25, real)) : 0;
    this.clock += dt;
    this.trauma = Math.max(0, this.trauma - TRAUMA_DECAY * dt);
    this.kick *= Math.exp(-KICK_EASE * dt); if (Math.abs(this.kick) < 0.01) this.kick = 0;
    const root = 1 - this.rooted * (1 - ROOT_SCALE);
    if (this.stop > 0) { this.stop = Math.max(0, this.stop - dt); return STOP_SCALE; }
    if (this.slow > 0) { this.slow = Math.max(0, this.slow - dt); const k = this.slowTotal > 0 ? this.slow / this.slowTotal : 0; return Math.min(root, SLOW_SCALE + (1 - SLOW_SCALE) * (1 - k * k)); }
    return root;
  }
  /** True while the world is frozen or slowed. */
  get held(): boolean { return this.stop > 0 || this.slow > 0 || this.root > 0; }
  /** Shake and punch the camera for this render only; `pop` puts it back. */
  push(camera: ShakeCamera): void {
    if (this.pushed) this.pop(camera);
    const s = this.saved, q = camera.quaternion; s.fov = camera.fov; s.x = camera.position.x; s.y = camera.position.y; s.z = camera.position.z; s.qx = q.x; s.qy = q.y; s.qz = q.z; s.qw = q.w;
    this.pushed = true;
    const amount = this.shake ? this.trauma * this.trauma : 0, t = this.clock * SHAKE_HZ;
    if (amount > 0) {
      camera.rotateX(SHAKE_TURN * amount * wobble(t, 1)); camera.rotateY(SHAKE_TURN * amount * wobble(t, 7)); camera.rotateZ(SHAKE_TURN * 1.4 * amount * wobble(t, 13));
      camera.position.x += SHAKE_SHIFT * amount * wobble(t, 19); camera.position.y += SHAKE_SHIFT * amount * wobble(t, 23); camera.position.z += SHAKE_SHIFT * amount * wobble(t, 29);
    }
    if (this.kick !== 0) { camera.fov = Math.max(10, s.fov - this.kick); camera.updateProjectionMatrix(); }
  }
  pop(camera: ShakeCamera): void {
    if (!this.pushed) return; this.pushed = false; const s = this.saved;
    camera.position.x = s.x; camera.position.y = s.y; camera.position.z = s.z; camera.quaternion.set(s.qx, s.qy, s.qz, s.qw);
    if (camera.fov !== s.fov) { camera.fov = s.fov; camera.updateProjectionMatrix(); }
  }
}
