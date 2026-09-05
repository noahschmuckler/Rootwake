// Pass 0.6b: hands (DESIGN.md "weight"). Two boxes at the top of the screen.
// One gesture does everything: drag from a box to a thing. From an empty hand
// it takes — stackables fly up into the box, shrunk and counted; a large
// object is lifted if strength allows, or *linked* for dragging if it only
// allows that. From a full hand it places (onto the ground) or drops. Tap a
// full box to drop at your feet; tap a linked box to let go. A drag-2 object
// with one hand linked is strain: it refuses to move until the other hand
// joins. Objects never block movement — they block tilling.

import * as THREE from 'three';
import { HANDS, STACK_CAP, handsToDrag, handsToLift, type ObjectType, type ObjectTypeId, type WorldObject, ObjectWorld } from './objects';
import type { Player } from './player';

// ---- Tuning constants ---------------------------------------------------------
/** Player-to-object distance within which hands can reach. */
export const REACH = 2.6;
/** A handful is every same-type object within this of the one you pointed at. */
export const GATHER_RADIUS = 0.9;
/** Pointer snaps to the nearest object within this many screen px. */
export const SNAP_RADIUS_PX = 70;
export const FLY_MS = 380;
/** A dragged object trails this far behind the player. */
export const DRAG_ROPE = 1.0;
/** Hop reach and speed while dragging. */
export const DRAG_FAN_SCALE = 0.55;
export const DRAG_MOVE_SLOWDOWN = 1.7;
export const TAP_SLOP_PX = 8;
// -------------------------------------------------------------------------------

export type HandState =
  | { kind: 'empty' }
  | { kind: 'stack'; type: ObjectType; count: number }
  | { kind: 'held'; type: ObjectType }
  | { kind: 'linked'; obj: WorldObject };

interface Fly {
  mesh: THREE.Object3D;
  from: THREE.Vector3;
  hand: number;
  startMs: number;
  scale: number;
}

interface Gesture {
  pointerId: number;
  hand: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
  /** Snapped object under the pointer, if any. */
  target: WorldObject | null;
}

export class Hands {
  readonly state: HandState[] = Array.from({ length: HANDS }, () => ({ kind: 'empty' }));
  /** A short message for the HUD hint (too heavy, out of reach), cleared by the caller. */
  notice: string | null = null;
  onChange: () => void = () => {};

  private gesture: Gesture | null = null;
  private flies: Fly[] = [];
  private readonly flyGroup = new THREE.Group();
  private readonly raycaster = new THREE.Raycaster();
  private readonly groundPlane: THREE.Plane;
  private lastMs = 0;

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly player: Player,
    private readonly objects: ObjectWorld,
    scene: THREE.Scene,
    private readonly boxes: HTMLElement[],
    private readonly overlay: SVGSVGElement,
    private readonly groundY: number,
    private readonly isWalkable: (p: THREE.Vector3) => boolean
  ) {
    scene.add(this.flyGroup);
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -groundY);
    boxes.forEach((box, i) => {
      box.addEventListener('pointerdown', (e) => this.onDown(e, i));
      box.addEventListener('pointermove', (e) => this.onMove(e));
      box.addEventListener('pointerup', (e) => this.onUp(e));
      box.addEventListener('pointercancel', (e) => this.onUp(e));
    });
    this.render();
  }

  // ---- what movement needs to know -----------------------------------------------

  /** The object both/enough hands are linked to and can move, or null. */
  get dragging(): WorldObject | null {
    const linked = this.linkedObject();
    if (!linked) return null;
    return this.linkedHands(linked) >= handsToDrag(linked.type.mass) ? linked : null;
  }

  /** Linked to something too heavy for the hands on it. */
  get straining(): boolean {
    const linked = this.linkedObject();
    return linked !== null && this.linkedHands(linked) < handsToDrag(linked.type.mass);
  }

  private linkedObject(): WorldObject | null {
    for (const s of this.state) if (s.kind === 'linked') return s.obj;
    return null;
  }

  private linkedHands(obj: WorldObject): number {
    return this.state.filter((s) => s.kind === 'linked' && s.obj === obj).length;
  }

  private freeHands(): number {
    return this.state.filter((s) => s.kind === 'empty').length;
  }

  // ---- per frame -------------------------------------------------------------------

  update(nowMs: number): void {
    const dt = Math.min(0.1, Math.max(0, (nowMs - this.lastMs) / 1000));
    this.lastMs = nowMs;

    // Flying pickups: world → a point just in front of the camera under the box.
    const keep: Fly[] = [];
    for (const f of this.flies) {
      const p = Math.min(1, (nowMs - f.startMs) / FLY_MS);
      const to = this.pointUnderBox(f.hand);
      f.mesh.position.lerpVectors(f.from, to, p * p);
      f.mesh.scale.setScalar(f.scale * (1 - 0.85 * p));
      if (p >= 1) this.flyGroup.remove(f.mesh);
      else keep.push(f);
    }
    this.flies = keep;

    // A dragged object trails the player on a rope and turns to face the pull.
    const drag = this.dragging;
    if (drag) {
      const dx = this.player.position.x - drag.position.x;
      const dz = this.player.position.z - drag.position.z;
      const d = Math.hypot(dx, dz);
      if (d > DRAG_ROPE) {
        const k = (d - DRAG_ROPE) / d;
        drag.position.x += dx * k * Math.min(1, dt * 12);
        drag.position.z += dz * k * Math.min(1, dt * 12);
        drag.group.rotation.y = Math.atan2(dx, dz) + Math.PI / 2;
      }
    }
    this.drawLines();
  }

  // ---- the gesture ------------------------------------------------------------------

  private onDown(e: PointerEvent, hand: number): void {
    if (this.gesture) return;
    e.preventDefault();
    this.gesture = { pointerId: e.pointerId, hand, startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, moved: false, target: null };
    this.boxes[hand].setPointerCapture(e.pointerId);
    this.boxes[hand].classList.add('active');
  }

  private onMove(e: PointerEvent): void {
    const g = this.gesture;
    if (!g || g.pointerId !== e.pointerId) return;
    g.x = e.clientX;
    g.y = e.clientY;
    if (Math.hypot(g.x - g.startX, g.y - g.startY) > TAP_SLOP_PX) g.moved = true;
    g.target = g.moved ? this.pickObject(g.x, g.y) : null;
  }

  private onUp(e: PointerEvent): void {
    const g = this.gesture;
    if (!g || g.pointerId !== e.pointerId) return;
    this.gesture = null;
    this.boxes[g.hand].classList.remove('active');
    if (!g.moved) this.tapBox(g.hand);
    else this.release(g);
    this.render();
    this.onChange();
  }

  /** Tap a box: drop what's in it at your feet, or let go of a link. */
  private tapBox(hand: number): void {
    const s = this.state[hand];
    if (s.kind === 'empty') return;
    if (s.kind === 'linked') {
      this.unlink(s.obj);
      return;
    }
    const fwd = this.player.forward();
    const at = new THREE.Vector3(this.player.position.x + fwd.x * 0.6, this.groundY, this.player.position.z + fwd.z * 0.6);
    this.placeHand(hand, at);
  }

  /** Released after a drag: take from, or place onto, whatever is under the pointer. */
  private release(g: Gesture): void {
    const s = this.state[g.hand];
    const target = g.target;
    if (s.kind === 'empty') {
      if (!target) return;
      if (!this.inReach(target.position)) return this.say('Out of reach.');
      this.take(g.hand, target);
      return;
    }
    if (s.kind === 'linked') return; // a linked hand only lets go by tapping
    if (s.kind === 'stack' && target && target.type === s.type) {
      if (!this.inReach(target.position)) return this.say('Out of reach.');
      this.gather(g.hand, target);
      return;
    }
    // Place onto the ground where the pointer points.
    const ground = this.pickGround(g.x, g.y);
    if (!ground) return;
    if (!this.inReach(ground)) return this.say('Out of reach.');
    if (!this.isWalkable(ground)) return this.say('Not there.');
    this.placeHand(g.hand, ground);
  }

  private take(hand: number, target: WorldObject): void {
    const t = target.type;
    if (t.size !== 'large') {
      this.state[hand] = { kind: 'stack', type: t, count: 0 };
      this.gather(hand, target);
      return;
    }
    const lift = handsToLift(t.mass);
    if (lift <= this.freeHands()) {
      // Lift: the object leaves the world and lives in this hand (and any others it needs).
      this.fly(target, hand);
      this.objects.remove(target);
      let needed = lift;
      for (let i = 0; i < HANDS && needed > 0; i++) {
        if (i === hand || this.state[i].kind === 'empty') {
          this.state[i] = { kind: 'held', type: t };
          needed--;
        }
      }
      return;
    }
    if (handsToDrag(t.mass) <= HANDS) {
      // Too heavy to lift: link this hand; it drags once enough hands are on it.
      this.state[hand] = { kind: 'linked', obj: target };
      if (this.linkedHands(target) < handsToDrag(t.mass)) this.say('Too heavy for one hand.');
      return;
    }
    this.say('Too heavy.');
  }

  /** Scoop every same-type object within GATHER_RADIUS of the target into the stack, up to the cap. */
  private gather(hand: number, target: WorldObject): void {
    const s = this.state[hand];
    if (s.kind !== 'stack') return;
    const cap = STACK_CAP[s.type.size];
    const cluster = this.objects.nearby(target.position.x, target.position.z, GATHER_RADIUS, s.type.id as ObjectTypeId);
    for (const obj of cluster) {
      if (s.count >= cap) break;
      if (!this.inReach(obj.position)) continue;
      this.fly(obj, hand);
      this.objects.remove(obj);
      s.count++;
    }
    if (s.count === 0) this.state[hand] = { kind: 'empty' };
  }

  /** Put down what a hand holds at a ground point: a stack scatters in a small cluster, a held object lands whole. */
  private placeHand(hand: number, at: THREE.Vector3): void {
    const s = this.state[hand];
    if (s.kind === 'stack') {
      for (let i = 0; i < s.count; i++) {
        const a = (i / s.count) * Math.PI * 2 + 0.7;
        const r = s.count === 1 ? 0 : 0.12 + 0.18 * Math.sqrt(i / s.count);
        this.objects.spawn(s.type.id, at.x + Math.cos(a) * r, this.groundY, at.z + Math.sin(a) * r, a);
      }
      this.state[hand] = { kind: 'empty' };
    } else if (s.kind === 'held') {
      this.objects.spawn(s.type.id, at.x, this.groundY, at.z, this.player.yaw);
      for (let i = 0; i < HANDS; i++) {
        const o = this.state[i];
        if (o.kind === 'held' && o.type === s.type) this.state[i] = { kind: 'empty' };
      }
    }
  }

  private unlink(obj: WorldObject): void {
    for (let i = 0; i < HANDS; i++) {
      const s = this.state[i];
      if (s.kind === 'linked' && s.obj === obj) this.state[i] = { kind: 'empty' };
    }
  }

  private fly(obj: WorldObject, hand: number): void {
    // A fresh mesh, not a clone: cloning would serialise userData.object and chase its cycle.
    const mesh = obj.type.build();
    const from = obj.group.getWorldPosition(new THREE.Vector3());
    mesh.position.copy(from);
    mesh.rotation.copy(obj.mesh.rotation);
    mesh.rotateY(obj.group.rotation.y);
    this.flyGroup.add(mesh);
    this.flies.push({ mesh, from, hand, startMs: this.lastMs, scale: 1 });
  }

  private say(text: string): void {
    this.notice = text;
  }

  // ---- picking ---------------------------------------------------------------------

  private inReach(p: THREE.Vector3): boolean {
    return Math.hypot(p.x - this.player.position.x, p.z - this.player.position.z) <= REACH;
  }

  private ndc(clientX: number, clientY: number): THREE.Vector2 {
    return new THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  }

  /** The object under the pointer, else the nearest on screen within SNAP_RADIUS_PX (in front of the camera). */
  private pickObject(clientX: number, clientY: number): WorldObject | null {
    this.raycaster.setFromCamera(this.ndc(clientX, clientY), this.camera);
    const hit = this.raycaster.intersectObjects(this.objects.raycastTargets(), false)[0];
    if (hit) return hit.object.userData.object as WorldObject;
    let best: WorldObject | null = null;
    let bestD = SNAP_RADIUS_PX;
    const v = new THREE.Vector3();
    for (const o of this.objects.objects) {
      v.copy(o.position).project(this.camera);
      if (v.z > 1 || Math.abs(v.x) > 1.2 || Math.abs(v.y) > 1.2) continue;
      const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
      const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
      const d = Math.hypot(sx - clientX, sy - clientY);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best;
  }

  private pickGround(clientX: number, clientY: number): THREE.Vector3 | null {
    this.raycaster.setFromCamera(this.ndc(clientX, clientY), this.camera);
    const p = new THREE.Vector3();
    return this.raycaster.ray.intersectPlane(this.groundPlane, p) ? p : null;
  }

  /** World point a little ahead of the camera, under a box's screen position. */
  private pointUnderBox(hand: number): THREE.Vector3 {
    const r = this.boxes[hand].getBoundingClientRect();
    const ndc = this.ndc(r.left + r.width / 2, r.top + r.height);
    const p = new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(this.camera);
    const dir = p.sub(this.camera.position).normalize();
    return this.camera.position.clone().addScaledVector(dir, 1.2);
  }

  // ---- drawing ------------------------------------------------------------------------

  private boxCenter(hand: number): [number, number] {
    const r = this.boxes[hand].getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height];
  }

  private screenOf(p: THREE.Vector3): [number, number] | null {
    const v = p.clone().project(this.camera);
    if (v.z > 1) return null;
    return [(v.x * 0.5 + 0.5) * window.innerWidth, (-v.y * 0.5 + 0.5) * window.innerHeight];
  }

  /** Luminescent lines: the live gesture, and every linked hand to its object. */
  private drawLines(): void {
    const lines: string[] = [];
    const draw = (a: [number, number], b: [number, number], cls: string) =>
      lines.push(`<line class="${cls}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`);
    const g = this.gesture;
    if (g && g.moved) {
      const end: [number, number] = g.target ? (this.screenOf(g.target.position) ?? [g.x, g.y]) : [g.x, g.y];
      draw(this.boxCenter(g.hand), end, g.target ? 'link glow snap' : 'link glow');
      draw(this.boxCenter(g.hand), end, g.target ? 'link core snap' : 'link core');
    }
    const straining = this.straining;
    for (let i = 0; i < HANDS; i++) {
      const s = this.state[i];
      if (s.kind !== 'linked') continue;
      const end = this.screenOf(this.nearestPointOn(s.obj));
      if (!end) continue;
      draw(this.boxCenter(i), end, straining ? 'link glow strain' : 'link glow');
      draw(this.boxCenter(i), end, straining ? 'link core strain' : 'link core');
    }
    this.overlay.innerHTML = lines.join('');
  }

  /** For a long object, the end nearer the player; otherwise its centre. */
  private nearestPointOn(obj: WorldObject): THREE.Vector3 {
    if (obj.type.id !== 'log') return obj.position.clone();
    const half = 0.55;
    const yaw = obj.group.rotation.y;
    const along = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(half);
    const a = obj.position.clone().add(along);
    const b = obj.position.clone().sub(along);
    const pp = this.player.position;
    return a.distanceToSquared(pp) < b.distanceToSquared(pp) ? a : b;
  }

  /** Box contents. */
  render(): void {
    const straining = this.straining;
    this.state.forEach((s, i) => {
      const box = this.boxes[i];
      box.classList.toggle('full', s.kind !== 'empty');
      box.classList.toggle('linked', s.kind === 'linked');
      box.classList.toggle('strain', s.kind === 'linked' && straining);
      switch (s.kind) {
        case 'empty':
          box.innerHTML = '';
          break;
        case 'stack':
          box.innerHTML = `<i style="background:#${s.type.color.toString(16).padStart(6, '0')}"></i><b>${s.count}</b><small>${s.type.label}</small>`;
          break;
        case 'held':
          box.innerHTML = `<i style="background:#${s.type.color.toString(16).padStart(6, '0')}"></i><small>${s.type.label}</small>`;
          break;
        case 'linked':
          box.innerHTML = `<i style="background:#${s.obj.type.color.toString(16).padStart(6, '0')}"></i><small>${straining ? 'strain' : 'dragging'}</small>`;
          break;
      }
    });
  }
}
