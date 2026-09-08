// Shared kinematics for the live animal and its laboratory studies.
// A route describes motion/contact, never a gallery-specific pose.
import * as THREE from 'three';

export interface SurfaceFrame {
  position: THREE.Vector3;
  forward: THREE.Vector3;
  up: THREE.Vector3;
}
export interface SurfaceRoute {
  sample(distance: number): SurfaceFrame;
}
export interface SpineRig {
  root: THREE.Group;
  thorax: THREE.Group;
  head: THREE.Group;
  abdomen: readonly THREE.Group[];
}

/** Map the animal's local -Z forward and +Y dorsal axis into a contact frame. */
export function frameQuaternion(frame: SurfaceFrame): THREE.Quaternion {
  const z = frame.forward.clone().normalize().negate();
  const x = new THREE.Vector3().crossVectors(frame.up, z).normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

/** Find a point along the route one rigid link away, not one arc-length away.
 * This distinction prevents the neck/abdomen links shrinking at a sharp corner.
 * The lab and live corner tracks have radii large enough for each link to fit. */
export function linkAlong(route: SurfaceRoute, from: number, length: number, direction: 1 | -1): number {
  const start = route.sample(from).position;
  let lo = 0, hi = length;
  while (route.sample(from + direction * hi).position.distanceTo(start) < length && hi < length * 4) hi *= 1.25;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (route.sample(from + direction * mid).position.distanceTo(start) < length) lo = mid;
    else hi = mid;
  }
  return from + direction * (lo + hi) / 2;
}

function localFrame(node: THREE.Group, frame: SurfaceFrame, parent: SurfaceFrame): void {
  const inv = frameQuaternion(parent).invert();
  node.position.copy(frame.position).sub(parent.position).applyQuaternion(inv);
  node.quaternion.copy(inv).multiply(frameQuaternion(frame));
}

/** Head reaches the corner first, then thorax, then each abdominal link.
 * Both positions AND orientations follow the same continuous route; no timed bend pulses.
 * Coordinates belong to root.parent, so translated/rotated enclosures remain valid. */
export function poseSpineOnRoute(rig: SpineRig, route: SurfaceRoute, distance: number): void {
  const base = route.sample(distance);
  rig.root.position.copy(base.position);
  rig.root.quaternion.copy(frameQuaternion(base));
  const thoraxS = linkAlong(route, distance, 0.22, 1);
  const thoraxFrame = route.sample(thoraxS);
  localFrame(rig.thorax, thoraxFrame, base);
  localFrame(rig.head, route.sample(linkAlong(route, thoraxS, 0.4, 1)), thoraxFrame);
  let s = thoraxS;
  let parent = thoraxFrame;
  rig.abdomen.forEach((joint, i) => {
    s = linkAlong(route, s, i === 0 ? 0.34 : 0.17, -1);
    const frame = route.sample(s);
    localFrame(joint, frame, parent);
    parent = frame;
  });
}

/** A closed, inward-facing floor -> right wall -> ceiling -> left wall route.
 * width/height are the physical enclosure's inner surfaces, not the body-centre extents. */
export class SquareSurfaceRoute implements SurfaceRoute {
  readonly length: number;
  private readonly horizontal: number;
  private readonly vertical: number;
  private readonly arc: number;
  constructor(readonly width = 5.8, readonly height = 5.0, readonly clearance = 0.46, readonly radius = 0.34, readonly z = 0) {
    this.horizontal = width - 2 * (clearance + radius);
    this.vertical = height - 2 * (clearance + radius);
    if (Math.min(this.horizontal, this.vertical) <= 0) throw new Error('Surface loop is too small for the animal');
    this.arc = radius * Math.PI / 2;
    this.length = 2 * this.horizontal + 2 * this.vertical + 4 * this.arc;
  }
  sample(distance: number): SurfaceFrame {
    let d = ((distance % this.length) + this.length) % this.length;
    const left = -this.width / 2 + this.clearance;
    const right = this.width / 2 - this.clearance;
    const bottom = this.clearance, top = this.height - this.clearance;
    let x = left + this.radius, y = bottom, theta = 0;
    const lengths = [this.horizontal, this.arc, this.vertical, this.arc, this.horizontal, this.arc, this.vertical, this.arc];
    let segment = 0;
    while (segment < 7 && d > lengths[segment]) d -= lengths[segment++];
    switch (segment) {
      case 0: x += d; break;
      case 1: theta = d / this.radius; x = right - this.radius + this.radius * Math.sin(theta); y = bottom + this.radius - this.radius * Math.cos(theta); break;
      case 2: theta = Math.PI / 2; x = right; y = bottom + this.radius + d; break;
      case 3: theta = Math.PI / 2 + d / this.radius; x = right - this.radius + this.radius * Math.sin(theta); y = top - this.radius - this.radius * Math.cos(theta); break;
      case 4: theta = Math.PI; x = right - this.radius - d; y = top; break;
      case 5: theta = Math.PI + d / this.radius; x = left + this.radius + this.radius * Math.sin(theta); y = top - this.radius - this.radius * Math.cos(theta); break;
      case 6: theta = Math.PI * 1.5; x = left; y = top - this.radius - d; break;
      case 7: theta = Math.PI * 1.5 + d / this.radius; x = left + this.radius + this.radius * Math.sin(theta); y = bottom + this.radius - this.radius * Math.cos(theta); break;
    }
    return { position: new THREE.Vector3(x, y, this.z), forward: new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0), up: new THREE.Vector3(-Math.sin(theta), Math.cos(theta), 0) };
  }
}

export function angleDelta(to: number, from: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
export function damp(from: number, to: number, dt: number, seconds: number): number {
  return from + (to - from) * (1 - Math.exp(-Math.max(0, dt) / seconds));
}

/** Unwrapped headings, recorded with both time and travelled distance.
 * Moving segments follow the path history; a stationary turn uses time-lagged follow-through.
 * Repeated stationary samples are retained so the tail can settle instead of keeping an old bend. */
export class HeadingTrail {
  private samples: { t: number; d: number; a: number }[] = [];
  clear(): void { this.samples = []; }
  record(t: number, distance: number, heading: number): void {
    const previous = this.samples[this.samples.length - 1];
    const a = previous ? previous.a + angleDelta(heading, previous.a) : heading;
    if (previous && t <= previous.t) return;
    this.samples.push({ t, d: distance, a });
    while (this.samples.length > 2 && this.samples[1].t < t - 3) this.samples.shift();
  }
  behind(distance: number, seconds: number, moving: boolean): number {
    const last = this.samples[this.samples.length - 1];
    if (!last) return 0;
    const key = moving ? 'd' : 't';
    const want = last[key] - (moving ? distance : seconds);
    for (let i = this.samples.length - 2; i >= 0; i--) {
      const a = this.samples[i], b = this.samples[i + 1];
      if (a[key] <= want) {
        const k = THREE.MathUtils.clamp((want - a[key]) / Math.max(1e-9, b[key] - a[key]), 0, 1);
        return a.a + (b.a - a.a) * k;
      }
    }
    return this.samples[0].a;
  }
}
