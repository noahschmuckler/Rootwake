// Pass 0.2: first-person movement scaffolding, touch-first.
// Pass 0.3b: the free joystick is replaced by waypoint movement (DESIGN.md).
// Press-hold on the movement side of the screen fans out candidate points
// ahead of the player — continuous positions at fixed distances and angles,
// filtered by the same collision the joystick used, not a formal grid — and
// releasing over one tweens a smooth move there, with the ease cameraLock.ts
// already uses. Drag elsewhere still free-looks. One input = one move.

import * as THREE from 'three';

// ---- Tuning constants ---------------------------------------------------------
export const EYE_HEIGHT = 0.55;
export const PLAYER_RADIUS = 0.25;
/** Fraction of the screen width (from the left) where a press becomes a move, not a look. */
/**
 * Fraction of the screen (from the left) where a hold is a move. 0 since 1.0e:
 * the walk button moves you, so the whole screen is look / tap / press
 * (designer, after the buttons playtest). The constant stays as the knob.
 */
export const MOVE_ZONE = 0;
export const LOOK_SENSITIVITY = 0.0042; // radians per px
export const PITCH_LIMIT = Math.PI * 0.42;
/** A press that moves less than this and lifts within TAP_MS counts as a tap. */
export const TAP_SLOP_PX = 8;
export const TAP_MS = 450;
/** Holding this long on the movement side opens the waypoint fan. */
export const HOLD_MS = 160;
/**
 * Candidate points: these distances ahead, at angles that are fractions of
 * the camera's half horizontal field of view — so the fan always fits the
 * screen, wide in landscape, narrow in portrait (turn first, then hop). The
 * nearest row sits just below the view at level pitch: look down for it.
 */
export const WAYPOINT_DISTANCES = [1.0, 2.2, 3.4];
export const WAYPOINT_ANGLE_FRACTIONS = [-0.85, -0.45, 0, 0.45, 0.85];
/** How close (screen px) the thumb must be to a marker to pick it. */
export const PICK_RADIUS_PX = 110;
/** Move tween: a base plus a per-unit term so long hops take longer but not proportionally. */
export const MOVE_BASE_MS = 320;
export const MOVE_MS_PER_UNIT = 170;
/** A still hold on the look side this long is "lie down here" (Pass 0.7a rest). */
export const REST_HOLD_MS = 900;
/**
 * Pass 1.0d: the third-person view (designer: first person gets disorienting;
 * a moderate zoom-out reads the surroundings at a glance, like turning your
 * head). The camera sits this far behind and above the eye and looks this
 * far ahead; a tree in the way pulls it in.
 */
export const THIRD_BACK = 2.6;
export const THIRD_UP = 1.2;
export const THIRD_AHEAD = 2.0;
export const THIRD_TREE_CLEARANCE = 0.45; // from a tree's centre: the trunk and its core
/** Drag-to-orbit sensitivity while the camera is locked (radians per pixel). */
export const ORBIT_SENSITIVITY = 0.006;
/** How far a close strike throws you. */
export const KNOCK_DISTANCE = 0.7;
/** Third-person zoom range (the zoom buttons). */
export const THIRD_ZOOM_MIN = 0.55;
export const THIRD_ZOOM_MAX = 2.2;
/** A still hold on a world object this long opens its recipes (Pass 0.8). */
export const LONG_PRESS_MS = 450;
// -------------------------------------------------------------------------------

export interface CircleCollider {
  x: number;
  z: number;
  radius: number;
}
/** Pass 1.0b: a wall log — a thick segment on the ground plane. */
export interface SegmentCollider {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  radius: number;
}
export type Collider = CircleCollider | SegmentCollider;

/** Nearest point on a collider's core (centre, or segment) to p, and the collider's radius. */
function nearestOnCollider(c: Collider, px: number, pz: number): { x: number; z: number } {
  if (!('x1' in c)) return { x: c.x, z: c.z };
  const dx = c.x2 - c.x1;
  const dz = c.z2 - c.z1;
  const len2 = dx * dx + dz * dz;
  const t = len2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((px - c.x1) * dx + (pz - c.z1) * dz) / len2));
  return { x: c.x1 + dx * t, z: c.z1 + dz * t };
}

interface TrackedPointer {
  /** 'press' (Pass 0.8): went down on a world object; a still hold is a long-press, a drag becomes a look. */
  role: 'move' | 'look' | 'press';
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  downMs: number;
  moved: boolean;
}

interface Candidate {
  point: THREE.Vector3;
  marker: THREE.Mesh;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
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
  /** Pass 0.6b encumbrance: scales the fan's reach and the hop's duration (1 = unburdened). */
  fanScale = 1;
  moveSlowdown = 1;
  /** False while straining against something too heavy: the fan shows nothing. */
  canMove = true;
  /** A hop was committed (distance in world units) — vitality drains on it. */
  onHop: (distance: number) => void = () => {};
  /** A still hold on the look side: rest here. */
  onRestHold: () => void = () => {};
  /** Pass 1.0d: a drag while the player is disabled (the camera is locked) — main orbits the locked framing. */
  onOrbit: (dx: number, dy: number) => void = () => {};
  /** First or third person (Pass 1.0d). */
  view: 'first' | 'third' = 'first';
  /** Main shrinks the third-person distance inside a structure. */
  thirdBackScale = 1;
  /** The zoom buttons scale the third-person distance (Pass 1.0e). */
  thirdZoom = 1;
  /** Height of what you stand on above the ground plane (a timber floor): main provides it. Eye and fan follow. */
  standHeightAt: (x: number, z: number) => number = () => 0;
  /** The figure you see in third person: a stocky body and a head, facing your yaw. */
  readonly avatar = new THREE.Group();
  /** Pass 0.8: is there a pressable world object under this screen point? main.ts answers. */
  objectAt: (clientX: number, clientY: number) => boolean = () => false;
  /** A still hold on a world object. */
  onLongPress: (clientX: number, clientY: number) => void = () => {};

  private readonly pointers = new Map<number, TrackedPointer>();
  private colliders: readonly Collider[] = [];
  private isWalkable: ((p: THREE.Vector3) => boolean) | undefined;

  // Waypoint fan.
  private readonly markers = new THREE.Group();
  private readonly candidates: Candidate[] = [];
  private fanOpen = false;
  private picked: Candidate | null = null;
  private readonly markerMaterial = new THREE.MeshBasicMaterial({
    color: 0xcfe6cf,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  private readonly pickedMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });

  // Move tween.
  private move: { from: THREE.Vector3; to: THREE.Vector3; startMs: number; durationMs: number } | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    scene: THREE.Scene,
    private readonly camera: THREE.Camera
  ) {
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointercancel', this.onUp);

    // The avatar: a stocky figure the height of the eye, seen only in third person.
    const skin = new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.9, flatShading: true });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x4a5a3a, roughness: 0.95, flatShading: true });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.42, 8), cloth);
    body.position.y = 0.26;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), skin);
    head.position.y = EYE_HEIGHT;
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 5), skin);
    nose.rotation.x = -Math.PI / 2;
    nose.position.set(0, EYE_HEIGHT - 0.01, -0.12); // the face looks along -Z: forward at yaw 0
    this.avatar.add(body, head, nose);
    this.avatar.visible = false;

    const ring = new THREE.RingGeometry(0.15, 0.22, 24);
    for (let i = 0; i < WAYPOINT_DISTANCES.length * WAYPOINT_ANGLE_FRACTIONS.length; i++) {
      const marker = new THREE.Mesh(ring, this.markerMaterial);
      marker.rotation.x = -Math.PI / 2;
      marker.visible = false;
      this.markers.add(marker);
      this.candidates.push({ point: new THREE.Vector3(), marker });
    }
    scene.add(this.markers);
  }

  get isMoving(): boolean {
    return this.move !== null;
  }

  eye(): THREE.Vector3 {
    return new THREE.Vector3(this.position.x, this.position.y + this.standHeightAt(this.position.x, this.position.z) + EYE_HEIGHT, this.position.z);
  }

  /** Pass 1.0e: a close lightning strike throws you a step. Colliders and the edge still apply next frame. */
  knock(): void {
    const a = Math.random() * Math.PI * 2;
    const to = new THREE.Vector3(this.position.x + Math.cos(a) * KNOCK_DISTANCE, this.position.y, this.position.z + Math.sin(a) * KNOCK_DISTANCE);
    if (this.isWalkable && !this.isWalkable(to)) return;
    this.move = null;
    this.position.copy(to);
  }

  forward(): THREE.Vector3 {
    return new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    );
  }

  /** Where the camera should be in the free view: at the eye, or behind and above it in third person. */
  applyCamera(camera: THREE.Camera): void {
    const eye = this.eye();
    this.avatar.position.set(this.position.x, this.position.y, this.position.z);
    this.avatar.rotation.y = this.yaw;
    this.avatar.visible = this.view === 'third';
    if (this.view === 'first') {
      camera.position.copy(eye);
      camera.lookAt(eye.add(this.forward()));
      return;
    }
    const fx = -Math.sin(this.yaw);
    const fz = -Math.cos(this.yaw);
    const back = THIRD_BACK * this.thirdBackScale * this.thirdZoom;
    const up = THIRD_UP * this.thirdBackScale * this.thirdZoom;
    const want = new THREE.Vector3(eye.x - fx * back, eye.y + up, eye.z - fz * back);
    // The camera inside a trunk: pull it in along the line until it clears. Trees merely in the
    // way are faded by main.ts (the locked-view rule), so the view stays a moderate zoom-out.
    let t = 1;
    for (let guard = 0; guard < 8; guard++) {
      const px = eye.x + (want.x - eye.x) * t;
      const pz = eye.z + (want.z - eye.z) * t;
      const inside = this.colliders.some((c) => !('x1' in c) && Math.hypot(px - c.x, pz - c.z) < THIRD_TREE_CLEARANCE);
      if (!inside || t <= 0.35) break;
      t -= 0.1;
    }
    camera.position.set(eye.x + (want.x - eye.x) * t, eye.y + (want.y - eye.y) * t, eye.z + (want.z - eye.z) * t);
    camera.lookAt(eye.add(this.forward().multiplyScalar(THIRD_AHEAD)));
  }

  /** The walk button (Pass 1.0d): a hold that opens the fan wherever it lands — no object under it can turn it into a press. */
  startMove(e: PointerEvent): void {
    if (this.pointers.has(e.pointerId)) return;
    this.pointers.set(e.pointerId, { role: 'move', startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, downMs: performance.now(), moved: false });
    if (this.enabled && !this.move) {
      window.setTimeout(() => {
        if (this.pointers.get(e.pointerId)?.role === 'move') this.fanOpen = true;
      }, HOLD_MS);
    }
  }
  /** Forwarded pointer events from the walk button. */
  pointerMove(e: PointerEvent): void {
    this.onMove(e);
  }
  pointerUp(e: PointerEvent): void {
    this.onUp(e);
  }

  /**
   * Per frame. `colliders` and `isWalkable` are remembered so the waypoint
   * fan is filtered by the same rules the move itself obeys. Pass 0.5:
   * `isWalkable` is how the cliff edge refuses a step — no fall state.
   */
  update(nowMs: number, colliders: readonly Collider[], isWalkable?: (p: THREE.Vector3) => boolean): void {
    this.colliders = colliders;
    this.isWalkable = isWalkable;

    if (this.move) {
      const m = this.move;
      const p = Math.min(1, (nowMs - m.startMs) / m.durationMs);
      this.position.lerpVectors(m.from, m.to, easeInOutCubic(p));
      if (p >= 1) this.move = null;
    } else {
      // Something may have grown around us (Pass 0.6c: a sapling becoming a
      // tree). Step out to the collider's edge rather than being stuck inside.
      for (const c of colliders) {
        const n = nearestOnCollider(c, this.position.x, this.position.z);
        const dx = this.position.x - n.x;
        const dz = this.position.z - n.z;
        const d = Math.hypot(dx, dz);
        const min = c.radius + PLAYER_RADIUS;
        if (d < min) {
          const nx = d > 1e-4 ? dx / d : 1;
          const nz = d > 1e-4 ? dz / d : 0;
          this.position.x = n.x + nx * min;
          this.position.z = n.z + nz * min;
        }
      }
    }

    if (this.fanOpen && this.enabled && this.canMove && !this.move) this.layoutFan();
    else this.closeFan();
  }

  // ---- walkability -----------------------------------------------------------------

  private isFree(p: THREE.Vector3): boolean {
    for (const c of this.colliders) {
      const n = nearestOnCollider(c, p.x, p.z);
      if (Math.hypot(p.x - n.x, p.z - n.z) < c.radius + PLAYER_RADIUS) return false;
    }
    if (this.isWalkable && !this.isWalkable(p)) return false;
    return true;
  }

  private pathClear(from: THREE.Vector3, to: THREE.Vector3): boolean {
    const steps = 8;
    const probe = new THREE.Vector3();
    for (let i = 1; i <= steps; i++) {
      probe.lerpVectors(from, to, i / steps);
      if (!this.isFree(probe)) return false;
    }
    return true;
  }

  // ---- waypoint fan ----------------------------------------------------------------

  private halfHorizontalFov(): number {
    const cam = this.camera as THREE.PerspectiveCamera;
    return Math.atan(Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * cam.aspect);
  }

  private layoutFan(): void {
    this.markers.visible = true;
    const fx = -Math.sin(this.yaw);
    const fz = -Math.cos(this.yaw);
    const halfFov = this.halfHorizontalFov();
    let i = 0;
    for (const d of WAYPOINT_DISTANCES) {
      for (const f of WAYPOINT_ANGLE_FRACTIONS) {
        const a = f * halfFov;
        const cand = this.candidates[i++];
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        // rotate the forward vector by `a` about +Y
        const dist = d * this.fanScale;
        cand.point.set(this.position.x + (fx * cos + fz * sin) * dist, this.position.y, this.position.z + (-fx * sin + fz * cos) * dist);
        const ok = this.isFree(cand.point) && this.pathClear(this.position, cand.point);
        cand.marker.visible = ok;
        cand.marker.position.set(cand.point.x, this.position.y + this.standHeightAt(cand.point.x, cand.point.z) + 0.02, cand.point.z);
      }
    }
    this.refreshPick();
  }

  private closeFan(): void {
    if (!this.markers.visible) return;
    this.markers.visible = false;
    this.picked = null;
  }

  /** Highlight the visible marker nearest the move pointer on screen, if it's close enough. */
  private refreshPick(): void {
    const mp = [...this.pointers.values()].find((p) => p.role === 'move');
    if (!mp) return;
    const rect = this.canvas.getBoundingClientRect();
    const v = new THREE.Vector3();
    let best: Candidate | null = null;
    let bestD = PICK_RADIUS_PX;
    for (const cand of this.candidates) {
      if (!cand.marker.visible) continue;
      v.copy(cand.marker.position).project(this.camera);
      const sx = rect.left + (v.x * 0.5 + 0.5) * rect.width;
      const sy = rect.top + (-v.y * 0.5 + 0.5) * rect.height;
      const d = Math.hypot(sx - mp.lastX, sy - mp.lastY);
      if (d < bestD) {
        bestD = d;
        best = cand;
      }
    }
    if (best !== this.picked) {
      if (this.picked) {
        this.picked.marker.material = this.markerMaterial;
        this.picked.marker.scale.setScalar(1);
      }
      this.picked = best;
      if (best) {
        best.marker.material = this.pickedMaterial;
        best.marker.scale.setScalar(1.45);
      }
    }
  }

  private commitMove(to: THREE.Vector3): void {
    const from = this.position.clone();
    const dist = from.distanceTo(to);
    this.move = { from, to: to.clone(), startMs: performance.now(), durationMs: (MOVE_BASE_MS + dist * MOVE_MS_PER_UNIT) * this.moveSlowdown };
    this.onHop(dist);
  }

  // ---- pointer events ---------------------------------------------------------------

  private readonly onDown = (e: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const roles = [...this.pointers.values()].map((p) => p.role);
    // A press that lands on a world object is neither a move nor a look until it moves.
    const onObject = this.enabled && roles.length === 0 && this.objectAt(e.clientX, e.clientY);
    const wantsMove = !onObject && e.clientX - rect.left < rect.width * MOVE_ZONE && !roles.includes('move');
    const role: TrackedPointer['role'] = onObject ? 'press' : wantsMove ? 'move' : 'look';
    if (role === 'look' && roles.includes('look')) return;
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
    if (role === 'move' && this.enabled && !this.move) {
      window.setTimeout(() => {
        if (this.pointers.get(e.pointerId)?.role === 'move') this.fanOpen = true;
      }, HOLD_MS);
    }
    if (role === 'look' && this.enabled) {
      window.setTimeout(() => {
        const p = this.pointers.get(e.pointerId);
        if (p && p.role === 'look' && !p.moved && this.enabled) {
          this.pointers.delete(e.pointerId);
          this.onRestHold();
        }
      }, REST_HOLD_MS);
    }
    if (role === 'press') {
      window.setTimeout(() => {
        const p = this.pointers.get(e.pointerId);
        if (p && p.role === 'press' && !p.moved && this.enabled) {
          this.pointers.delete(e.pointerId);
          this.onLongPress(e.clientX, e.clientY);
        }
      }, LONG_PRESS_MS);
    }
  };

  private readonly onMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > TAP_SLOP_PX) {
      p.moved = true;
      if (p.role === 'press') p.role = 'look'; // dragged off the object: it was a look after all
    }
    if (p.role === 'look' && this.enabled) {
      this.yaw -= (e.clientX - p.lastX) * LOOK_SENSITIVITY;
      this.pitch = THREE.MathUtils.clamp(this.pitch - (e.clientY - p.lastY) * LOOK_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);
    } else if (!this.enabled && p.moved) {
      this.onOrbit((e.clientX - p.lastX) * ORBIT_SENSITIVITY, (e.clientY - p.lastY) * ORBIT_SENSITIVITY);
    }
    p.lastX = e.clientX;
    p.lastY = e.clientY;
    if (p.role === 'move' && this.fanOpen) this.refreshPick();
  };

  private readonly onUp = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (p.role === 'move') {
      const wasOpen = this.fanOpen;
      this.fanOpen = false;
      if (wasOpen && this.markers.visible) {
        if (this.picked && this.enabled) this.commitMove(this.picked.point);
        this.closeFan();
        return; // a hold is never also a tap
      }
    }
    if (!p.moved && performance.now() - p.downMs < TAP_MS) this.onTap(e.clientX, e.clientY);
  };
}
