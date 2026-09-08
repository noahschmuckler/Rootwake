/** Shared, renderer-independent traversal. All coordinates here are absolute feet positions. */
import { Vector3, MathUtils } from 'three';

export const BODY_RADIUS = 0.25;
export const BODY_HEIGHT = 0.72;
export const STEP_HEIGHT = 0.24;
export const GRAVITY = 10;
export const HOVER_GRACE_S = 2.5;
export const LANDING_SPEED = 1.15;
export const STICK_DEADZONE = 0.14;
export interface MobilityProfile {
  runSpeed: number;
  reach: number;
  jumpRise: number;
  jumpApex: number;
  jumpSpeed: number;
  maxDrop: number;
  hoverSpeed: number;
}
export const NORMAL_MOBILITY: Readonly<MobilityProfile> = Object.freeze({ runSpeed: 2.8, reach: 4.2, jumpRise: 1.1, jumpApex: 1.55, jumpSpeed: 4.6, maxDrop: 4.6, hoverSpeed: 0 });
export const POWERED_MOBILITY: Readonly<MobilityProfile> = Object.freeze({ runSpeed: 5.8, reach: 8.5, jumpRise: 3.2, jumpApex: 4.1, jumpSpeed: 7.8, maxDrop: 10, hoverSpeed: 4.8 });
export interface TraversalWorld {
  /** Every solid, walkable top at x,z, in absolute world Y. Not just the highest top. */
  surfacesAt(x: number, z: number): readonly number[];
  /** Capsule-sized clearance, including walls, ceilings and non-walkable space. */
  canOccupy(feet: Vector3, radius: number, height: number): boolean;
  /** Optional authored landings supplement the continuous fan; never bypass validation. */
  anchors?(): readonly Vector3[];
}
export type TraversalKind = 'walk' | 'jump' | 'drop';
export interface Traversal {
  kind: TraversalKind;
  from: Vector3;
  to: Vector3;
  duration: number;
  velocityY: number;
  /** Walk routes follow every sampled height, rather than cutting through a ramp. */
  floorPath?: Vector3[];
}
export type MotionMode = 'grounded' | 'traverse' | 'hover' | 'descending' | 'falling';
export interface MotionInput { right: number; forward: number; lift: number; turn: number; held: boolean; }
const ZERO_INPUT: MotionInput = { right: 0, forward: 0, lift: 0, turn: 0, held: false };
const clamp = MathUtils.clamp;

/** Dead zone, circular clamping and a continuous precision-to-run response. */
export function stickResponse(x: number, y: number): { x: number; y: number; amount: number } {
  const r = Math.hypot(x, y);
  const amount = Math.pow(clamp((r - STICK_DEADZONE) / (1 - STICK_DEADZONE), 0, 1), 1.45);
  return r > 0 ? { x: x / r * amount, y: y / r * amount, amount } : { x: 0, y: 0, amount: 0 };
}

/** A landing needs the whole foot footprint, not a single ray touching a ledge. */
export function supportAt(world: TraversalWorld, x: number, z: number, ceiling = Infinity): number | null {
  const surfaces = [...world.surfacesAt(x, z)].filter(Number.isFinite).sort((a, b) => b - a);
  for (const centre of surfaces) {
    if (centre > ceiling + 0.001) continue;
    let top = centre;
    let supported = true;
    for (const [dx, dz] of [[BODY_RADIUS, 0], [-BODY_RADIUS, 0], [0, BODY_RADIUS], [0, -BODY_RADIUS]]) {
      const near = world.surfacesAt(x + dx, z + dz).filter(y => Math.abs(y - centre) <= STEP_HEIGHT);
      if (!near.length) { supported = false; break; }
      top = Math.max(top, Math.min(...near));
    }
    if (supported && top <= ceiling + STEP_HEIGHT && world.canOccupy(new Vector3(x, top, z), BODY_RADIUS, BODY_HEIGHT)) return top;
  }
  return null;
}
export function traversalPoint(plan: Traversal, time: number, out = new Vector3()): Vector3 {
  const t = clamp(time / plan.duration, 0, 1);
  if (plan.floorPath) {
    const n = t * (plan.floorPath.length - 1), i = Math.min(plan.floorPath.length - 2, Math.floor(n));
    return out.lerpVectors(plan.floorPath[i], plan.floorPath[i + 1], n - i);
  }
  out.lerpVectors(plan.from, plan.to, t);
  out.y = plan.from.y + plan.velocityY * time - GRAVITY * time * time / 2;
  if (t >= 1) out.copy(plan.to);
  return out;
}

/** The same swept body test is used by previews and by the committed move. */
export function validateTraversal(world: TraversalWorld, plan: Traversal): boolean {
  const samples = Math.max(12, Math.ceil(plan.duration * 90), Math.ceil(plan.from.distanceTo(plan.to) / 0.06));
  const p = new Vector3();
  for (let i = 0; i <= samples; i++) {
    traversalPoint(plan, i / samples * plan.duration, p);
    if (!world.canOccupy(p, BODY_RADIUS, BODY_HEIGHT)) return false;
  }
  const support = supportAt(world, plan.to.x, plan.to.z, plan.to.y + 0.03);
  return support !== null && Math.abs(support - plan.to.y) <= STEP_HEIGHT;
}
export function planTraversal(world: TraversalWorld, from: Vector3, to: Vector3, profile: Readonly<MobilityProfile>, reachScale = 1): Traversal | null {
  const distance = Math.hypot(to.x - from.x, to.z - from.z), rise = to.y - from.y;
  if (distance < 0.35 || distance > profile.reach * clamp(reachScale, 0.25, 1.1) || rise > profile.jumpRise || rise < -profile.maxDrop) return null;
  const landing = supportAt(world, to.x, to.z, to.y + 0.03);
  if (landing === null || Math.abs(landing - to.y) > 0.1) return null;
  const steps = Math.max(2, Math.ceil(distance / 0.08));
  const path = [from.clone()];
  let previous = from.y;
  for (let i = 1; i <= steps; i++) {
    const p = new Vector3().lerpVectors(from, to, i / steps);
    const height = supportAt(world, p.x, p.z, previous + STEP_HEIGHT);
    if (height === null || Math.abs(height - previous) > STEP_HEIGHT) break;
    p.y = height;
    path.push(p);
    previous = height;
  }
  if (path.length === steps + 1 && Math.abs(previous - to.y) < 0.1) {
    const walk: Traversal = { kind: 'walk', from: from.clone(), to: to.clone(), duration: Math.max(0.18, distance / profile.runSpeed), velocityY: 0, floorPath: path };
    if (validateTraversal(world, walk)) return walk;
  }
  // Try the lowest clear arc first. Higher arcs can clear a hurdle, never a ceiling.
  const minimum = Math.max(rise + 0.20, rise < -0.3 ? 0.08 : 0.45);
  for (const apex of [...new Set([minimum, Math.max(minimum, profile.jumpApex * 0.65), profile.jumpApex])]) {
    if (apex > profile.jumpApex + 1e-6 || apex < rise) continue;
    const velocityY = Math.sqrt(2 * GRAVITY * apex);
    const duration = (velocityY + Math.sqrt(velocityY * velocityY - 2 * GRAVITY * rise)) / GRAVITY;
    if (distance / duration > profile.jumpSpeed) continue;
    const plan: Traversal = { kind: rise < -0.3 ? 'drop' : 'jump', from: from.clone(), to: to.clone(), duration, velocityY };
    if (validateTraversal(world, plan)) return plan;
  }
  return null;
}

export class MobilityMotor {
  readonly feet = new Vector3();
  readonly velocity = new Vector3();
  mode: MotionMode = 'grounded';
  yaw = 0;
  powered = false;
  slowdown = 1;
  reachScale = 1;
  enabled = true;
  canMove = true;
  distance = 0;
  speed = 0;
  private plan: Traversal | null = null;
  private planTime = 0;
  private idleTime = 0;
  private flightCeiling = Infinity;
  onTravel: (distance: number) => void = () => {};
  onCommit: (plan: Traversal) => void = () => {};
  onLand: () => void = () => {};
  get profile(): Readonly<MobilityProfile> { return this.powered ? POWERED_MOBILITY : NORMAL_MOBILITY; }
  get flying(): boolean { return this.mode === 'hover' || this.mode === 'descending'; }
  get airborne(): boolean { return this.mode !== 'grounded'; }
  reset(at: Vector3): void {
    this.feet.copy(at); this.velocity.set(0, 0, 0); this.plan = null;
    this.mode = 'grounded'; this.speed = 0; this.idleTime = 0; this.flightCeiling = Infinity;
  }
  commit(plan: Traversal, world: TraversalWorld): boolean {
    if (!this.enabled || !this.canMove || this.mode !== 'grounded' || this.feet.distanceTo(plan.from) > 0.08) return false;
    const fresh = planTraversal(world, this.feet, plan.to, this.profile, this.reachScale);
    if (!fresh) return false; // Equipment, energy or an obstacle may have changed since preview.
    plan = fresh;
    this.plan = plan; this.planTime = 0; this.mode = 'traverse'; this.velocity.set(0, 0, 0);
    this.onCommit(plan); return true;
  }
  ignite(): boolean {
    if (!this.powered || !this.enabled || !this.canMove || this.mode === 'traverse') return false;
    this.plan = null; this.mode = 'hover'; this.idleTime = 0; this.velocity.set(0, 1.8, 0);
    this.flightCeiling = this.feet.y + 14;
    return true;
  }
  cutThrusters(): void {
    if (!this.flying) return;
    this.mode = 'falling'; this.velocity.y = Math.min(0, this.velocity.y); this.idleTime = 0;
  }
  private land(y: number): void {
    this.feet.y = y; this.velocity.set(0, 0, 0); this.plan = null;
    this.mode = 'grounded'; this.idleTime = 0; this.flightCeiling = Infinity; this.onLand();
  }
  update(dt: number, world: TraversalWorld, input: MotionInput = ZERO_INPUT): void {
    if (!Number.isFinite(dt) || dt <= 0) return;
    dt = Math.min(dt, 0.1); // Never teleport across walls after returning from a suspended tab.
    if (!this.powered && this.flying) this.cutThrusters();
    if (!this.enabled || !this.canMove) { this.velocity.x = 0; this.velocity.z = 0; }
    const start = this.feet.clone();
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    for (let i = 0; i < n; i++) this.step(dt / n, world, this.enabled && this.canMove ? input : ZERO_INPUT);
    const travelled = Math.hypot(this.feet.x - start.x, this.feet.z - start.z);
    this.speed = travelled / dt;
    this.distance += travelled;
    if (travelled > 0 && this.mode !== 'traverse') this.onTravel(travelled);
  }
  private step(dt: number, world: TraversalWorld, input: MotionInput): void {
    if (this.plan && this.mode === 'traverse') {
      if (!this.enabled || !this.canMove) { this.plan = null; this.mode = 'falling'; return; }
      const time = Math.min(this.plan.duration, this.planTime + dt / Math.max(1, this.slowdown));
      const next = traversalPoint(this.plan, time);
      if (!world.canOccupy(next, BODY_RADIUS, BODY_HEIGHT)) {
        this.velocity.y = Math.min(0, this.plan.velocityY - GRAVITY * time);
        this.plan = null; this.mode = 'falling'; return;
      }
      this.feet.copy(next); this.planTime = time;
      if (time >= this.plan.duration) {
        const support = supportAt(world, next.x, next.z, next.y + 0.05);
        if (support !== null && Math.abs(support - next.y) < STEP_HEIGHT) this.land(support);
        else { this.plan = null; this.mode = 'falling'; }
      }
      return;
    }
    if (this.flying) {
      if (input.held) { this.idleTime = 0; this.mode = 'hover'; }
      else { this.idleTime += dt; if (this.idleTime > HOVER_GRACE_S) this.mode = 'descending'; }
      this.yaw -= input.turn * 1.65 * dt;
    }
    const speed = (this.flying ? this.profile.hoverSpeed : this.profile.runSpeed) / Math.max(1, this.slowdown);
    const r = stickResponse(input.right, -input.forward);
    const right = r.x, forward = -r.y;
    const wantedX = (Math.cos(this.yaw) * right - Math.sin(this.yaw) * forward) * speed;
    const wantedZ = (-Math.sin(this.yaw) * right - Math.cos(this.yaw) * forward) * speed;
    const damping = 1 - Math.exp(-dt * (r.amount > 0 ? 18 : 32));
    this.velocity.x += (wantedX - this.velocity.x) * damping;
    this.velocity.z += (wantedZ - this.velocity.z) * damping;
    if (Math.abs(this.velocity.x) + Math.abs(this.velocity.z) < 0.001) { this.velocity.x = 0; this.velocity.z = 0; }
    // Axis separation provides wall sliding; substeps prevent high-speed tunnelling.
    for (const axis of ['x', 'z'] as const) {
      const delta = this.velocity[axis] * dt;
      if (!delta) continue;
      const next = this.feet.clone(); next[axis] += delta;
      if (this.mode === 'grounded') {
        const support = supportAt(world, next.x, next.z, this.feet.y + STEP_HEIGHT);
        if (support === null) { this.velocity[axis] = 0; continue; } // No falling off the unmodelled plateau.
        if (this.feet.y - support > this.profile.maxDrop) { this.velocity[axis] = 0; continue; }
        if (support < this.feet.y - STEP_HEIGHT) {
          if (world.canOccupy(next, BODY_RADIUS, BODY_HEIGHT)) { this.feet.copy(next); this.mode = 'falling'; }
        } else {
          next.y = support;
          if (world.canOccupy(next, BODY_RADIUS, BODY_HEIGHT)) this.feet.copy(next);
          else this.velocity[axis] = 0;
        }
      } else if (world.canOccupy(next, BODY_RADIUS, BODY_HEIGHT)) this.feet.copy(next);
      else this.velocity[axis] = 0;
    }
    if (this.mode === 'grounded') {
      const support = supportAt(world, this.feet.x, this.feet.z, this.feet.y + STEP_HEIGHT);
      if (support !== null && Math.abs(support - this.feet.y) < STEP_HEIGHT) this.feet.y = support;
      else if (support !== null) this.mode = 'falling';
      return;
    }
    if (this.flying) {
      // Launch raises the feet automatically. Thereafter hold a stable altitude, not a terrain-relative teleport.
      const ground = supportAt(world, this.feet.x, this.feet.z, this.feet.y + 0.01);
      const lift = stickResponse(0, input.lift).y;
      let targetV = this.mode === 'descending' ? -LANDING_SPEED : lift * 2.6;
      if (this.mode === 'hover' && lift === 0 && ground !== null && this.feet.y < ground + 1.05) targetV = 1.6;
      this.velocity.y += (targetV - this.velocity.y) * (1 - Math.exp(-dt * 10));
    } else this.velocity.y -= GRAVITY * dt;
    const next = this.feet.clone();
    next.y = Math.min(this.flightCeiling, next.y + this.velocity.y * dt);
    if (this.velocity.y <= 0) {
      const ground = supportAt(world, next.x, next.z, this.feet.y + 0.01);
      if (ground !== null && next.y <= ground + 0.01 && this.feet.y >= ground - 0.01) { this.land(ground); return; }
    }
    if (world.canOccupy(next, BODY_RADIUS, BODY_HEIGHT)) this.feet.copy(next);
    else this.velocity.y = 0; // A ceiling or a platform underside stops ascent.
  }
}
