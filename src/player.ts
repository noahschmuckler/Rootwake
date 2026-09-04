// Pass 0.2: minimal first-person movement, touch-first. Scaffolding for the
// confinement→vista test, not a feature: a dynamic virtual joystick on the
// left part of the screen, drag-to-look elsewhere, WASD for desktop. First
// person (not the 0.1a orbit) because voxels are packed tightly enough that a
// third-person camera would spend most of its time inside one.

import * as THREE from 'three';

// ---- Tuning constants ---------------------------------------------------------
export const EYE_HEIGHT = 0.55;
export const PLAYER_RADIUS = 0.25;
export const WALK_SPEED = 1.9; // units/s
/** Fraction of the screen width (from the left) where a touch becomes the joystick. */
export const JOYSTICK_ZONE = 0.42;
export const JOYSTICK_RADIUS_PX = 52;
export const LOOK_SENSITIVITY = 0.0042; // radians per px
export const PITCH_LIMIT = Math.PI * 0.42;
/** A press that moves less than this and lifts within TAP_MS counts as a tap. */
export const TAP_SLOP_PX = 8;
export const TAP_MS = 450;
// -------------------------------------------------------------------------------

export interface CircleCollider {
  x: number;
  z: number;
  radius: number;
}

interface TrackedPointer {
  role: 'joystick' | 'look';
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  downMs: number;
  moved: boolean;
}

export class Player {
  /** Feet position. y is the ground height. */
  readonly position = new THREE.Vector3(0, -1, 0);
  yaw = 0;
  pitch = 0;
  /** While false (camera locked / tweening) input still tracks taps but nothing moves. */
  enabled = true;
  /** Taps that were not drags, in client pixels. */
  onTap: (clientX: number, clientY: number) => void = () => {};

  private readonly pointers = new Map<number, TrackedPointer>();
  private readonly joy = new THREE.Vector2();
  private readonly keys = new Set<string>();
  private readonly joyBase: HTMLElement;
  private readonly joyKnob: HTMLElement;

  constructor(private readonly canvas: HTMLCanvasElement, joyBase: HTMLElement, joyKnob: HTMLElement) {
    this.joyBase = joyBase;
    this.joyKnob = joyKnob;
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onUp);
    window.addEventListener('keydown', (e) => this.keys.add(e.key.toLowerCase()));
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => this.keys.clear());
  }

  eye(): THREE.Vector3 {
    return new THREE.Vector3(this.position.x, this.position.y + EYE_HEIGHT, this.position.z);
  }

  forward(): THREE.Vector3 {
    return new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    );
  }

  /** Where the camera should be in the free view. */
  applyCamera(camera: THREE.Camera): void {
    camera.position.copy(this.eye());
    camera.lookAt(this.eye().add(this.forward()));
  }

  update(dtSeconds: number, colliders: readonly CircleCollider[], extraCollide?: (p: THREE.Vector3) => void): void {
    if (!this.enabled) return;
    // Move in the camera's yaw frame: joystick up = forward.
    let mx = this.joy.x;
    let mz = -this.joy.y;
    if (this.keys.has('w') || this.keys.has('arrowup')) mz += 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) mz -= 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) mx -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) mx += 1;
    const len = Math.hypot(mx, mz);
    if (len < 1e-3) return;
    if (len > 1) {
      mx /= len;
      mz /= len;
    }
    const step = WALK_SPEED * dtSeconds;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    // forward is (-sin, -cos); right is (cos, -sin)
    this.position.x += (-sin * mz + cos * mx) * step;
    this.position.z += (-cos * mz - sin * mx) * step;

    for (const c of colliders) {
      const dx = this.position.x - c.x;
      const dz = this.position.z - c.z;
      const minDist = c.radius + PLAYER_RADIUS;
      const d = Math.hypot(dx, dz);
      if (d < minDist && d > 1e-6) {
        this.position.x = c.x + (dx / d) * minDist;
        this.position.z = c.z + (dz / d) * minDist;
      }
    }
    extraCollide?.(this.position);
  }

  private readonly onDown = (e: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const isTouch = e.pointerType === 'touch';
    const wantsJoystick =
      isTouch && this.enabled && e.clientX - rect.left < rect.width * JOYSTICK_ZONE && ![...this.pointers.values()].some((p) => p.role === 'joystick');
    const role: TrackedPointer['role'] = wantsJoystick ? 'joystick' : 'look';
    if (role === 'look' && [...this.pointers.values()].some((p) => p.role === 'look')) return;
    this.pointers.set(e.pointerId, {
      role,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      downMs: performance.now(),
      moved: false,
    });
    this.canvas.setPointerCapture(e.pointerId);
    if (role === 'joystick') this.showJoystick(e.clientX, e.clientY);
  };

  private readonly onMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > TAP_SLOP_PX) p.moved = true;
    if (p.role === 'joystick') {
      const dx = e.clientX - p.startX;
      const dy = e.clientY - p.startY;
      const len = Math.hypot(dx, dy);
      const clamp = Math.min(1, len / JOYSTICK_RADIUS_PX);
      const nx = len > 0 ? dx / len : 0;
      const ny = len > 0 ? dy / len : 0;
      this.joy.set(nx * clamp, ny * clamp);
      this.joyKnob.style.transform = `translate(${nx * clamp * JOYSTICK_RADIUS_PX}px, ${ny * clamp * JOYSTICK_RADIUS_PX}px)`;
    } else if (this.enabled) {
      this.yaw -= (e.clientX - p.lastX) * LOOK_SENSITIVITY;
      this.pitch = THREE.MathUtils.clamp(this.pitch - (e.clientY - p.lastY) * LOOK_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);
    }
    p.lastX = e.clientX;
    p.lastY = e.clientY;
  };

  private readonly onUp = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (p.role === 'joystick') {
      this.joy.set(0, 0);
      this.hideJoystick();
    }
    if (!p.moved && performance.now() - p.downMs < TAP_MS) this.onTap(e.clientX, e.clientY);
  };

  private showJoystick(x: number, y: number): void {
    this.joyBase.hidden = false;
    this.joyBase.style.left = `${x}px`;
    this.joyBase.style.top = `${y}px`;
    this.joyKnob.style.transform = 'translate(0px, 0px)';
  }

  private hideJoystick(): void {
    this.joyBase.hidden = true;
  }
}
