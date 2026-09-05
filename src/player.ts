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
export const MOVE_ZONE = 0.42;
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
// -------------------------------------------------------------------------------

export interface CircleCollider {
  x: number;
  z: number;
  radius: number;
}

interface TrackedPointer {
  role: 'move' | 'look';
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

  private readonly pointers = new Map<number, TrackedPointer>();
  private colliders: readonly CircleCollider[] = [];
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

  /**
   * Per frame. `colliders` and `isWalkable` are remembered so the waypoint
   * fan is filtered by the same rules the move itself obeys. Pass 0.5:
   * `isWalkable` is how the cliff edge refuses a step — no fall state.
   */
  update(nowMs: number, colliders: readonly CircleCollider[], isWalkable?: (p: THREE.Vector3) => boolean): void {
    this.colliders = colliders;
    this.isWalkable = isWalkable;

    if (this.move) {
      const m = this.move;
      const p = Math.min(1, (nowMs - m.startMs) / m.durationMs);
      this.position.lerpVectors(m.from, m.to, easeInOutCubic(p));
      if (p >= 1) this.move = null;
    }

    if (this.fanOpen && this.enabled && this.canMove && !this.move) this.layoutFan();
    else this.closeFan();
  }

  // ---- walkability -----------------------------------------------------------------

  private isFree(p: THREE.Vector3): boolean {
    for (const c of this.colliders) {
      if (Math.hypot(p.x - c.x, p.z - c.z) < c.radius + PLAYER_RADIUS) return false;
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
        cand.marker.position.set(cand.point.x, this.position.y + 0.02, cand.point.z);
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
  }

  // ---- pointer events ---------------------------------------------------------------

  private readonly onDown = (e: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const roles = [...this.pointers.values()].map((p) => p.role);
    const wantsMove = e.clientX - rect.left < rect.width * MOVE_ZONE && !roles.includes('move');
    const role: TrackedPointer['role'] = wantsMove ? 'move' : 'look';
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
  };

  private readonly onMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > TAP_SLOP_PX) p.moved = true;
    if (p.role === 'look' && this.enabled) {
      this.yaw -= (e.clientX - p.lastX) * LOOK_SENSITIVITY;
      this.pitch = THREE.MathUtils.clamp(this.pitch - (e.clientY - p.lastY) * LOOK_SENSITIVITY, -PITCH_LIMIT, PITCH_LIMIT);
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
