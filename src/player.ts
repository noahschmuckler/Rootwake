// One touch-first player controller for the plateau, underworld and laboratory.
import * as THREE from 'three';
import { BODY_RADIUS, BODY_HEIGHT, MobilityMotor, planTraversal, supportAt, traversalPoint, type Traversal, type TraversalWorld } from './mobility';
import { MovementGesture } from './movementGesture';

export const EYE_HEIGHT = 0.55;
export const PLAYER_RADIUS = BODY_RADIUS;
export const LOOK_SENSITIVITY = 0.0042;
export const PITCH_LIMIT = Math.PI * 0.42;
export const TAP_SLOP_PX = 8;
export const TAP_MS = 450;
export const REST_HOLD_MS = 900;
export const LONG_PRESS_MS = 450;
export const ORBIT_SENSITIVITY = 0.006;
export const THIRD_BACK = 2.6;
export const THIRD_UP = 1.2;
export const THIRD_AHEAD = 2;
export const THIRD_TREE_CLEARANCE = 0.45;
export const THIRD_ZOOM_MIN = 0.55;
export const THIRD_ZOOM_MAX = 2.2;
export const KNOCK_DISTANCE = 0.7;
export interface CircleCollider {
  x: number; z: number; radius: number; cameraClearance?: number;
  /** Omitted bounds preserve legacy full-height obstacles. */
  minY?: number; maxY?: number;
}
export interface SegmentCollider { x1: number; z1: number; x2: number; z2: number; radius: number; minY?: number; maxY?: number; }
export type Collider = CircleCollider | SegmentCollider;
function nearestOnCollider(c: Collider, px: number, pz: number): { x: number; z: number } {
  if (!('x1' in c)) return { x: c.x, z: c.z };
  const dx = c.x2 - c.x1, dz = c.z2 - c.z1, len2 = dx * dx + dz * dz;
  const t = len2 < 1e-9 ? 0 : THREE.MathUtils.clamp(((px - c.x1) * dx + (pz - c.z1) * dz) / len2, 0, 1);
  return { x: c.x1 + dx * t, z: c.z1 + dz * t };
}
interface LookPointer { role: 'look' | 'press'; startX: number; startY: number; lastX: number; lastY: number; downMs: number; moved: boolean; }
export interface MovementTarget { plan: Traversal; marker: THREE.Mesh; }

export class Player {
  /** Legacy world datum: x/z are the player position, y remains the domain's base plane.
   * Use feet() for the actual 3-D feet position; existing crafting callers keep their contract. */
  readonly position = new THREE.Vector3(0, -1, 0);
  yaw = 0;
  pitch = 0;
  enabled = true;
  fanScale = 1;
  moveSlowdown = 1;
  canMove = true;
  view: 'first' | 'third' = 'first';
  thirdBackScale = 1;
  thirdZoom = 1;
  standHeightAt: (x: number, z: number) => number = () => 0;
  cameraClear: ((p: THREE.Vector3) => boolean) | null = null;
  traversalWorld: TraversalWorld | null = null;
  readonly avatar = new THREE.Group();
  readonly motor = new MobilityMotor();
  readonly gesture = new MovementGesture();
  readonly flightStick = { x: 0, y: 0, held: false };
  onTap: (x: number, y: number) => void = () => {};
  onHop: (distance: number) => void = () => {};
  onRestHold: () => void = () => {};
  onOrbit: (dx: number, dy: number) => void = () => {};
  objectAt: (x: number, y: number) => boolean = () => false;
  onLongPress: (x: number, y: number) => void = () => {};
  /** UI refresh is owned by the shared thumbstick binding. */
  onMobilityFrame: () => void = () => {};
  private readonly pointers = new Map<number, LookPointer>();
  private colliders: readonly Collider[] = [];
  private isWalkable: ((p: THREE.Vector3) => boolean) | undefined;
  private initialized = false;
  private lastMs = -1;
  private lastFanMs = -Infinity;
  private lastAim = 0;
  private travelled = 0;
  private readonly markers = new THREE.Group();
  private readonly jets = new THREE.Group();
  private candidates: MovementTarget[] = [];
  private picked: MovementTarget | null = null;
  private readonly ring = new THREE.RingGeometry(0.15, 0.22, 24);
  private readonly materials = {
    walk: new THREE.MeshBasicMaterial({ color: 0xa9f5bd, opacity: 0.85, transparent: true, depthTest: false, depthWrite: false, fog: false, side: THREE.DoubleSide }),
    jump: new THREE.MeshBasicMaterial({ color: 0xffcf72, opacity: 0.9, transparent: true, depthTest: false, depthWrite: false, fog: false, side: THREE.DoubleSide }),
    drop: new THREE.MeshBasicMaterial({ color: 0x80dfff, opacity: 0.9, transparent: true, depthTest: false, depthWrite: false, fog: false, side: THREE.DoubleSide }),
    picked: new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, depthWrite: false, fog: false, side: THREE.DoubleSide }),
  };
  private readonly arc = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, depthTest: false, depthWrite: false, fog: false }));
  readonly keys = new Set<string>();
  get poweredLegs(): boolean { return this.motor.powered; }
  set poweredLegs(value: boolean) { this.motor.powered = value; if (!value) { this.motor.cutThrusters(); this.flightStick.held = false; } }
  get isMoving(): boolean { return this.motor.airborne || this.motor.speed > 0.02; }
  get isFlying(): boolean { return this.motor.flying; }
  get targets(): readonly MovementTarget[] { return this.candidates; }
  get selectedTarget(): MovementTarget | null { return this.picked; }
  get targeting(): boolean { return this.gesture.mode === 'target'; }

  /** Adapter for older single-surface worlds; new worlds can supply multi-height geometry. */
  readonly movementWorld: TraversalWorld = {
    surfacesAt: (x, z) => {
      if (this.traversalWorld) return this.traversalWorld.surfacesAt(x, z);
      if (this.isWalkable && !this.isWalkable(new THREE.Vector3(x, this.position.y, z))) return [];
      return [this.position.y + this.standHeightAt(x, z)];
    },
    canOccupy: (p, radius, height) => {
      if (this.traversalWorld) {
        if (!this.traversalWorld.canOccupy(p, radius, height)) return false;
      } else {
        if (this.isWalkable && !this.isWalkable(p)) return false;
        const ground = this.position.y + this.standHeightAt(p.x, p.z);
        if (p.y < ground - 0.025) return false;
        if (this.cameraClear && !this.cameraClear(new THREE.Vector3(p.x, p.y + height, p.z))) return false;
      }
      for (const c of this.colliders) {
        if (p.y >= (c.maxY ?? Infinity) - 0.001 || p.y + height <= (c.minY ?? -Infinity) + 0.001) continue;
        const near = nearestOnCollider(c, p.x, p.z);
        if (Math.hypot(p.x - near.x, p.z - near.z) < c.radius + radius - 1e-5) return false;
      }
      return true;
    },
    anchors: () => this.traversalWorld?.anchors?.() ?? [],
  };

  constructor(private readonly canvas: HTMLCanvasElement, scene: THREE.Scene, _camera: THREE.Camera) {
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onCancel);
    canvas.addEventListener('lostpointercapture', this.onCancel);
    window.addEventListener('blur', () => this.cancelInput());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.cancelInput(); });
    const skin = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.9, flatShading: true });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x4a5a3a, roughness: 0.95, flatShading: true });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.42, 8), cloth); body.position.y = 0.26;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), skin); head.position.y = EYE_HEIGHT;
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 5), skin);
    nose.rotation.x = -Math.PI / 2; nose.position.set(0, EYE_HEIGHT - 0.01, -0.12);
    this.avatar.add(body, head, nose);
    const jetMaterial = new THREE.MeshBasicMaterial({ color: 0x8ee8ff, transparent: true, opacity: 0.8 });
    for (const x of [-0.12, 0.12]) {
      const jet = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.4, 8), jetMaterial);
      jet.rotation.z = Math.PI; jet.position.set(x, -0.21, 0); this.jets.add(jet);
    }
    this.jets.visible = false; this.avatar.add(this.jets); this.avatar.visible = false;
    this.arc.renderOrder = 1002; this.arc.visible = false;
    scene.add(this.markers, this.arc);
    this.motor.onCommit = plan => this.onHop(Math.hypot(plan.to.x - plan.from.x, plan.to.z - plan.from.z));
    this.motor.onTravel = distance => {
      this.travelled += distance;
      while (this.travelled >= 2.2) { this.travelled -= 2.2; this.onHop(2.2); }
    };
  }
  private syncPose(): void {
    if (!this.initialized || Math.hypot(this.motor.feet.x - this.position.x, this.motor.feet.z - this.position.z) > 0.001) {
      this.initialized = true;
      const y = supportAt(this.movementWorld, this.position.x, this.position.z) ?? this.position.y + this.standHeightAt(this.position.x, this.position.z);
      this.motor.reset(new THREE.Vector3(this.position.x, y, this.position.z));
      this.cancelInput();
    }
  }
  feet(): THREE.Vector3 { this.syncPose(); return this.motor.feet.clone(); }
  eye(): THREE.Vector3 { return this.feet().add(new THREE.Vector3(0, EYE_HEIGHT, 0)); }
  teleport(x: number, z: number, yaw = this.yaw, y?: number): void {
    this.cancelInput(); this.position.x = x; this.position.z = z; this.yaw = yaw;
    const height = y ?? supportAt(this.movementWorld, x, z) ?? this.position.y + this.standHeightAt(x, z);
    this.motor.reset(new THREE.Vector3(x, height, z)); this.initialized = true;
  }
  cancelInput(): void {
    this.gesture.cancel(); this.pointers.clear(); this.flightStick.x = 0; this.flightStick.y = 0; this.flightStick.held = false;
    this.keys.clear(); this.closeFan(); this.onMobilityFrame();
  }
  forward(): THREE.Vector3 { return new THREE.Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch)); }
  knock(): void {
    if (this.motor.airborne) return;
    const angle = Math.random() * Math.PI * 2, from = this.feet();
    for (let i = 1; i <= 12; i++) {
      const p = from.clone().add(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(KNOCK_DISTANCE * i / 12));
      const support = supportAt(this.movementWorld, p.x, p.z, from.y + 0.24);
      if (support === null) break;
      p.y = support; if (!this.movementWorld.canOccupy(p, BODY_RADIUS, BODY_HEIGHT)) break;
      this.motor.reset(p); this.position.x = p.x; this.position.z = p.z;
    }
  }
  applyCamera(camera: THREE.Camera): void {
    const eye = this.eye();
    this.avatar.position.copy(this.motor.feet);
    this.avatar.rotation.y = this.motor.speed > 0.08 && !this.isFlying ? Math.atan2(-this.motor.velocity.x, -this.motor.velocity.z) : this.yaw;
    this.avatar.visible = this.view === 'third';
    this.jets.visible = this.isFlying && this.poweredLegs;
    this.jets.scale.y = 0.85 + Math.sin(performance.now() * 0.035) * 0.15;
    if (this.view === 'first') { camera.position.copy(eye); camera.lookAt(eye.add(this.forward())); return; }
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    const back = THIRD_BACK * this.thirdBackScale * this.thirdZoom, up = THIRD_UP * this.thirdBackScale * this.thirdZoom;
    const want = new THREE.Vector3(eye.x - fx * back, eye.y + up, eye.z - fz * back);
    let t = 1; const probe = new THREE.Vector3();
    for (let guard = 0; guard < 20; guard++) {
      probe.lerpVectors(eye, want, t);
      const inside = this.colliders.some(c => !('x1' in c) && probe.y < (c.maxY ?? Infinity) && probe.y > (c.minY ?? -Infinity) && Math.hypot(probe.x - c.x, probe.z - c.z) < (c.cameraClearance ?? THIRD_TREE_CLEARANCE)) || (this.cameraClear !== null && !this.cameraClear(probe));
      if (!inside || t <= 0.05) break; t -= 0.05;
    }
    if (t < 0.3) this.avatar.visible = false;
    camera.position.lerpVectors(eye, want, t); camera.lookAt(eye.add(this.forward().multiplyScalar(THIRD_AHEAD)));
  }
  startMove(e: PointerEvent): void {
    if (!this.enabled || !this.canMove) return;
    this.syncPose();
    this.gesture.begin(e.pointerId, e.clientX, e.clientY, performance.now(), this.poweredLegs, this.isFlying);
    if (this.gesture.tick(performance.now(), this.isFlying) === 'cut') this.motor.cutThrusters();
    this.onMobilityFrame();
  }
  pointerMove(e: PointerEvent): void { this.gesture.move(e.pointerId, e.clientX, e.clientY); this.refreshPick(); this.onMobilityFrame(); }
  pointerUp(e: PointerEvent): void {
    if (e.pointerId !== this.gesture.pointerId) return;
    const target = this.picked;
    const result = this.gesture.end(e.pointerId, performance.now(), e.type !== 'pointerup');
    if (result === 'commit' && target && this.enabled) this.motor.commit(target.plan, this.movementWorld);
    this.closeFan(); this.onMobilityFrame();
  }
  update(nowMs: number, colliders: readonly Collider[], isWalkable?: (p: THREE.Vector3) => boolean): void {
    this.colliders = colliders; this.isWalkable = isWalkable; this.syncPose();
    this.resolveGrowingColliders();
    const dt = this.lastMs < 0 ? 0 : Math.min(0.1, Math.max(0, (nowMs - this.lastMs) / 1000)); this.lastMs = nowMs;
    if (!this.enabled || !this.canMove) this.cancelInput();
    const gestureEvent = this.gesture.tick(nowMs, this.isFlying);
    this.motor.enabled = this.enabled; this.motor.canMove = this.canMove; this.motor.slowdown = this.moveSlowdown; this.motor.reachScale = this.fanScale;
    if (gestureEvent === 'ignite') this.motor.ignite();
    if (gestureEvent === 'cut') this.motor.cutThrusters();
    this.motor.yaw = this.yaw;
    const drive = !this.targeting && this.gesture.mode !== 'consumed';
    const right = (drive ? this.gesture.x : 0) + (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
    const forward = (drive ? -this.gesture.y : 0) + (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0);
    const keyboard = this.keys.size > 0;
    this.motor.update(dt, this.movementWorld, {
      right, forward, lift: -this.flightStick.y + (this.keys.has('KeyR') ? 1 : 0) - (this.keys.has('KeyV') ? 1 : 0),
      turn: this.flightStick.x + (this.keys.has('KeyE') ? 1 : 0) - (this.keys.has('KeyQ') ? 1 : 0), held: this.gesture.held || this.flightStick.held || keyboard,
    });
    this.position.x = this.motor.feet.x; this.position.z = this.motor.feet.z; this.yaw = this.motor.yaw;
    if (this.targeting && this.enabled && !this.motor.airborne) {
      const aim = Math.hypot(this.gesture.x, this.gesture.y) > 0.18 ? Math.atan2(this.gesture.x, -this.gesture.y) : 0;
      if (nowMs - this.lastFanMs > 120 || Math.abs(aim - this.lastAim) > 0.15) { this.layoutFan(aim); this.lastFanMs = nowMs; this.lastAim = aim; }
      this.refreshPick();
    } else this.closeFan();
    this.onMobilityFrame();
  }
  /** A sapling or a moving actor may overlap a stationary player between frames. */
  private resolveGrowingColliders(): void {
    if (this.motor.mode !== 'grounded') return;
    for (const c of this.colliders) {
      const feet = this.motor.feet;
      if (feet.y >= (c.maxY ?? Infinity) || feet.y + BODY_HEIGHT <= (c.minY ?? -Infinity)) continue;
      const n = nearestOnCollider(c, feet.x, feet.z);
      const dx = feet.x - n.x, dz = feet.z - n.z, d = Math.hypot(dx, dz), min = c.radius + BODY_RADIUS;
      if (d >= min) continue;
      // Prefer the nearest way out, then try the perimeter without escaping the world's boundary.
      const angle = d > 1e-5 ? Math.atan2(dz, dx) : 0;
      for (const offset of [0, .4, -.4, .8, -.8, 1.6, -1.6, Math.PI]) {
        const x = n.x + Math.cos(angle + offset) * (min + .002), z = n.z + Math.sin(angle + offset) * (min + .002);
        const y = supportAt(this.movementWorld, x, z, feet.y + .24);
        if (y === null || Math.abs(y - feet.y) > .24) continue;
        feet.set(x, y, z); this.position.x = x; this.position.z = z; break;
      }
    }
  }
  private layoutFan(aim: number): void {
    this.closeFan();
    const from = this.feet(), reach = this.motor.profile.reach * THREE.MathUtils.clamp(this.fanScale, 0.25, 1.1);
    const points: THREE.Vector3[] = [];
    for (const fraction of [0.22, 0.43, 0.68, 0.98]) for (const angle of [-1.15, -0.75, -0.38, 0, 0.38, 0.75, 1.15]) {
      const bearing = aim + angle - this.yaw;
      const x = from.x + Math.sin(bearing) * reach * fraction, z = from.z - Math.cos(bearing) * reach * fraction;
      for (const y of this.movementWorld.surfacesAt(x, z)) points.push(new THREE.Vector3(x, y, z));
    }
    for (const p of this.movementWorld.anchors?.() ?? []) {
      const angle = Math.atan2(p.x - from.x, -(p.z - from.z)) + this.yaw - aim;
      if (Math.cos(angle) > 0.32 && Math.hypot(p.x - from.x, p.z - from.z) <= reach) points.push(p.clone());
    }
    for (const to of points) {
      if (this.candidates.some(c => c.plan.to.distanceTo(to) < 0.3)) continue;
      const plan = planTraversal(this.movementWorld, from, to, this.motor.profile, this.fanScale);
      if (!plan) continue;
      const marker = new THREE.Mesh(this.ring, this.materials[plan.kind]);
      marker.rotation.x = -Math.PI / 2; marker.position.copy(to); marker.position.y += 0.045;
      // An explicit overlay: never cut in half by jittered rock, fog or depth occlusion.
      marker.renderOrder = 1001; this.markers.add(marker); this.candidates.push({ plan, marker });
    }
    this.markers.visible = true;
  }
  private closeFan(): void {
    this.markers.clear(); this.candidates = []; this.picked = null; this.markers.visible = false; this.arc.visible = false;
  }
  private refreshPick(): void {
    if (!this.targeting) return;
    const magnitude = Math.hypot(this.gesture.x, this.gesture.y);
    const aim = Math.atan2(this.gesture.x, -this.gesture.y) - this.yaw;
    const reach = this.motor.profile.reach * THREE.MathUtils.clamp(this.fanScale, 0.25, 1.1);
    let best: MovementTarget | null = null, score = Infinity;
    for (const candidate of this.candidates) {
      const dx = candidate.plan.to.x - this.motor.feet.x, dz = candidate.plan.to.z - this.motor.feet.z;
      const bearing = Math.atan2(dx, -dz), angle = Math.abs(Math.atan2(Math.sin(bearing - aim), Math.cos(bearing - aim)));
      const error = Math.abs(Math.hypot(dx, dz) / reach - magnitude);
      const s = angle * 1.5 + error * 2;
      if (magnitude > 0.18 && angle < 0.5 && error < 0.3 && s < score) { score = s; best = candidate; }
      candidate.marker.material = this.materials[candidate.plan.kind]; candidate.marker.scale.setScalar(1);
    }
    const previous = this.picked;
    this.picked = best;
    this.arc.visible = best !== null;
    if (best) {
      best.marker.material = this.materials.picked; best.marker.scale.setScalar(1.35);
      if (previous === best) return;
      const points = Array.from({ length: 33 }, (_, i) => traversalPoint(best.plan, i / 32 * best.plan.duration).add(new THREE.Vector3(0, 0.07, 0)));
      this.arc.geometry.dispose(); this.arc.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }
  }
  private readonly onDown = (e: PointerEvent): void => {
    if ([...this.pointers.values()].some(p => p.role === 'look')) return;
    const onObject = this.enabled && !this.motor.airborne && !this.pointers.size && this.objectAt(e.clientX, e.clientY);
    const p: LookPointer = { role: onObject ? 'press' : 'look', startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, downMs: performance.now(), moved: false };
    this.pointers.set(e.pointerId, p);
    try { this.canvas.setPointerCapture(e.pointerId); } catch { /* Synthetic tests do not own OS pointers. */ }
    window.setTimeout(() => {
      if (this.pointers.get(e.pointerId) !== p || p.moved || !this.enabled || this.motor.airborne || this.gesture.held) return;
      this.pointers.delete(e.pointerId);
      if (p.role === 'press') this.onLongPress(e.clientX, e.clientY); else this.onRestHold();
    }, onObject ? LONG_PRESS_MS : REST_HOLD_MS);
  };
  private readonly onMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId); if (!p) return;
    if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > TAP_SLOP_PX) { p.moved = true; p.role = 'look'; }
    if (p.role === 'look' && this.enabled) {
      this.yaw -= (e.clientX - p.lastX) * LOOK_SENSITIVITY;
      this.pitch = THREE.MathUtils.clamp(this.pitch - (e.clientY - p.lastY) * LOOK_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);
    } else if (!this.enabled && p.moved) this.onOrbit((e.clientX - p.lastX) * ORBIT_SENSITIVITY, (e.clientY - p.lastY) * ORBIT_SENSITIVITY);
    p.lastX = e.clientX; p.lastY = e.clientY;
  };
  private readonly onUp = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId); if (!p) return; this.pointers.delete(e.pointerId);
    if (!p.moved && !this.motor.airborne && performance.now() - p.downMs < TAP_MS) this.onTap(e.clientX, e.clientY);
  };
  private readonly onCancel = (e: PointerEvent): void => { this.pointers.delete(e.pointerId); };
}
