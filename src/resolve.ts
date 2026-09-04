// Pass 0.2: the whole-voxel resolve beat.
//
// Design decision (see DESIGN.md): with 5 flowers, 3-of-a-kind, one-shot, a
// voxel could never fully clear — two flowers were always stranded and the
// trunk stayed as an obstacle. So once the one triple has receded, the whole
// voxel resolves: stragglers recede, then the entire growth twists and sinks
// into the ground behind a ground-ring, rising sparks and a light burst. It
// has to read as a grander *release* than the flower recede, not more of the
// same, and once it's done the voxel is gone as both sight and body.

import * as THREE from 'three';
import type { Branch, Rig } from './rig';
import { RecedeAnimator } from './recede';

// ---- Tuning constants (all open to feel iteration) -------------------------
/** Beat after the last matched flower goes home before anything else moves. */
export const HOLD_MS = 220;
/** Stragglers (the unmatched flowers) recede with this stagger. Faster than the match: they're being taken, not chosen. */
export const STRAGGLER_STAGGER_MS = 70;
/** The sink starts this long after the stragglers begin — they finish on the way down. */
export const SINK_DELAY_MS = 450;
export const SINK_MS = 1150;
/** How far the rig drops (cube is 2 tall, so this fully buries it). */
export const SINK_DEPTH = 2.6;
/** Horizontal pinch as it goes: the growth is drawn into a point at the base. */
export const SINK_PINCH = 0.3;
/** Turns about the trunk while sinking — reads as being screwed back into the earth. */
export const SINK_TURNS = 0.4;
/** Ground ring + sparks + light, starting with the sink. */
export const BURST_MS = 1000;
export const RING_END_RADIUS = 4.5;
export const SPARK_COUNT = 80;
export const LIGHT_PEAK = 60;
// ---------------------------------------------------------------------------

function easeInCubic(x: number): number {
  return x * x * x;
}
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export class ResolveBeat {
  private readonly stragglers: Branch[];
  private readonly animator = new RecedeAnimator();
  private stragglersStarted = false;
  private burstStarted = false;
  private finished = false;

  // Effects live under the voxel's placement group so local (0, -1, 0) is the
  // base of the trunk wherever the voxel stands.
  private readonly fx = new THREE.Group();
  private ring!: THREE.Mesh;
  private ringMaterial!: THREE.MeshBasicMaterial;
  private sparks!: THREE.Points;
  private sparkMaterial!: THREE.PointsMaterial;
  private sparkVelocities!: Float32Array;
  private light!: THREE.PointLight;
  private lastBurstMs = 0;

  constructor(
    private readonly rig: Rig,
    private readonly parent: THREE.Object3D,
    private readonly startMs: number
  ) {
    this.stragglers = rig.branches.filter((b) => b.flower.visible);
  }

  get isDone(): boolean {
    return this.finished;
  }

  update(nowMs: number): void {
    if (this.finished) return;
    const t = nowMs - this.startMs;

    if (t >= HOLD_MS && !this.stragglersStarted) {
      this.stragglersStarted = true;
      this.animator.start(this.stragglers, nowMs, () => {});
    }
    this.animator.update(nowMs);

    const sinkT = t - HOLD_MS - SINK_DELAY_MS;
    if (sinkT >= 0) {
      if (!this.burstStarted) {
        this.burstStarted = true;
        this.buildBurst();
        this.lastBurstMs = nowMs;
      }
      const p = Math.min(1, sinkT / SINK_MS);
      const k = easeInCubic(p);
      const root = this.rig.root;
      root.position.y = -SINK_DEPTH * k;
      const pinch = THREE.MathUtils.lerp(1, SINK_PINCH, k);
      root.scale.set(pinch, 1, pinch);
      root.rotation.y = SINK_TURNS * Math.PI * 2 * k;

      this.updateBurst(nowMs, Math.min(1, sinkT / BURST_MS));

      if (p >= 1 && sinkT >= BURST_MS) {
        root.visible = false;
        this.parent.remove(this.fx);
        this.finished = true;
      }
    }
  }

  private buildBurst(): void {
    this.ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff1c0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 1, 64), this.ringMaterial);
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = -0.97;
    this.fx.add(this.ring);

    const positions = new Float32Array(SPARK_COUNT * 3);
    this.sparkVelocities = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.8;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = -1 + Math.random() * 0.4;
      positions[i * 3 + 2] = Math.sin(a) * r;
      this.sparkVelocities[i * 3] = Math.cos(a) * (0.4 + Math.random() * 1.2);
      this.sparkVelocities[i * 3 + 1] = 1.5 + Math.random() * 2.5;
      this.sparkVelocities[i * 3 + 2] = Math.sin(a) * (0.4 + Math.random() * 1.2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.sparkMaterial = new THREE.PointsMaterial({
      color: 0xfff4c8,
      size: 0.09,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sparks = new THREE.Points(geo, this.sparkMaterial);
    this.fx.add(this.sparks);

    this.light = new THREE.PointLight(0xffe9b0, LIGHT_PEAK, 14, 2);
    this.light.position.set(0, 0.2, 0);
    this.fx.add(this.light);

    this.parent.add(this.fx);
  }

  private updateBurst(nowMs: number, p: number): void {
    const dt = (nowMs - this.lastBurstMs) / 1000;
    this.lastBurstMs = nowMs;

    const grow = easeOutCubic(p);
    this.ring.scale.setScalar(THREE.MathUtils.lerp(0.3, RING_END_RADIUS, grow));
    this.ringMaterial.opacity = 0.9 * (1 - p);

    const pos = this.sparks.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < SPARK_COUNT; i++) {
      arr[i * 3] += this.sparkVelocities[i * 3] * dt;
      arr[i * 3 + 1] += this.sparkVelocities[i * 3 + 1] * dt;
      arr[i * 3 + 2] += this.sparkVelocities[i * 3 + 2] * dt;
      this.sparkVelocities[i * 3 + 1] -= 1.2 * dt; // gentle gravity so they arc, not just rise
    }
    pos.needsUpdate = true;
    this.sparkMaterial.opacity = 1 - p * p;

    // Light spikes fast and decays: the flash is the release, the tail is the afterglow.
    this.light.intensity = LIGHT_PEAK * (p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85);
  }
}
