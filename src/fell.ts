// Pass 0.6a: the felled-tree ending (DESIGN.md "weight"). The greenery
// releases — flowers have already receded, the foliage and branches dissolve
// in a puff of leaves — then the trunk topples toward the side you worked it
// from and lands with a thud: camera shake (the caller's job, via onThud) and
// a dust ring. What it leaves behind (log, sticks, seeds) is spawned by the
// caller once this is done. The 0.2 sink beat lives on in resolve.ts for A/B.

import * as THREE from 'three';
import type { Rig } from './rig';

// ---- Tuning constants ---------------------------------------------------------
export const FELL_HOLD_MS = 200;
export const RELEASE_MS = 600;
export const TOPPLE_MS = 850;
export const SETTLE_MS = 260;
export const SETTLE_BOUNCE_RAD = 0.07;
export const LEAF_COUNT = 70;
export const DUST_MS = 700;
export const DUST_END_RADIUS = 2.2;
// -------------------------------------------------------------------------------

function easeInCubic(x: number): number {
  return x * x * x;
}
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export class FellBeat {
  private readonly fx = new THREE.Group();
  private leaves: THREE.Points | null = null;
  private leafVel!: Float32Array;
  private leafMaterial!: THREE.PointsMaterial;
  private dust: THREE.Mesh | null = null;
  private dustMaterial!: THREE.MeshBasicMaterial;
  private readonly axis: THREE.Vector3;
  private thudded = false;
  private finished = false;
  private lastMs: number;

  /**
   * @param fallDir horizontal unit vector in the rig's local space — the trunk falls this way
   */
  constructor(
    private readonly rig: Rig,
    private readonly parent: THREE.Object3D,
    private readonly startMs: number,
    private readonly fallDir: THREE.Vector3,
    private readonly onThud: () => void
  ) {
    // Rotating `up` about (up × d) tips it toward d.
    this.axis = new THREE.Vector3(0, 1, 0).cross(fallDir).normalize();
    this.lastMs = startMs;
    parent.add(this.fx);
  }

  get isDone(): boolean {
    return this.finished;
  }

  update(nowMs: number): void {
    if (this.finished) return;
    const dt = (nowMs - this.lastMs) / 1000;
    this.lastMs = nowMs;
    const t = nowMs - this.startMs - FELL_HOLD_MS;
    if (t < 0) return;

    // Release: greenery shrinks away, leaves puff out.
    const r = Math.min(1, t / RELEASE_MS);
    if (!this.leaves) this.buildLeaves();
    const shrink = Math.max(0.001, 1 - easeInCubic(r));
    this.rig.foliage.scale.setScalar(shrink);
    for (const g of this.rig.faceGroups) g.scale.setScalar(shrink);
    (this.rig.edges.material as THREE.LineBasicMaterial).opacity = 0.35 * (1 - r);
    this.updateLeaves(dt, Math.min(1, t / (RELEASE_MS + 400)));

    // Topple: accelerating fall, then the thud and a small settle.
    const tt = t - RELEASE_MS;
    if (tt < 0) return;
    const q = Math.min(1, tt / TOPPLE_MS);
    let angle = (Math.PI / 2) * easeInCubic(q);
    if (q >= 1) {
      if (!this.thudded) {
        this.thudded = true;
        this.buildDust();
        this.onThud();
      }
      const s = Math.min(1, (tt - TOPPLE_MS) / SETTLE_MS);
      angle = Math.PI / 2 - SETTLE_BOUNCE_RAD * Math.sin(Math.PI * s);
      this.updateDust(Math.min(1, (tt - TOPPLE_MS) / DUST_MS));
      if (s >= 1 && tt - TOPPLE_MS >= DUST_MS) {
        this.parent.remove(this.fx);
        this.finished = true;
      }
    }
    this.rig.trunkPivot.setRotationFromAxisAngle(this.axis, angle);
  }

  private buildLeaves(): void {
    const positions = new Float32Array(LEAF_COUNT * 3);
    this.leafVel = new Float32Array(LEAF_COUNT * 3);
    for (let i = 0; i < LEAF_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.7;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = -0.6 + Math.random() * 1.4;
      positions[i * 3 + 2] = Math.sin(a) * r;
      this.leafVel[i * 3] = Math.cos(a) * (0.6 + Math.random() * 1.4);
      this.leafVel[i * 3 + 1] = 0.6 + Math.random() * 1.6;
      this.leafVel[i * 3 + 2] = Math.sin(a) * (0.6 + Math.random() * 1.4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.leafMaterial = new THREE.PointsMaterial({ color: 0x8fd06a, size: 0.11, transparent: true, opacity: 0.95, depthWrite: false });
    this.leaves = new THREE.Points(geo, this.leafMaterial);
    this.fx.add(this.leaves);
  }

  private updateLeaves(dt: number, p: number): void {
    if (!this.leaves) return;
    const pos = this.leaves.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < LEAF_COUNT; i++) {
      arr[i * 3] += this.leafVel[i * 3] * dt;
      arr[i * 3 + 1] += this.leafVel[i * 3 + 1] * dt;
      arr[i * 3 + 2] += this.leafVel[i * 3 + 2] * dt;
      this.leafVel[i * 3 + 1] -= 2.2 * dt; // leaves fall, they don't fly
    }
    pos.needsUpdate = true;
    this.leafMaterial.opacity = 0.95 * (1 - p * p);
    if (p >= 1) this.leaves.visible = false;
  }

  private buildDust(): void {
    this.dustMaterial = new THREE.MeshBasicMaterial({ color: 0xb9b3a4, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    this.dust = new THREE.Mesh(new THREE.RingGeometry(0.6, 1, 40), this.dustMaterial);
    this.dust.rotation.x = -Math.PI / 2;
    // Centred under where the trunk lands (its length is 1).
    this.dust.position.set(this.fallDir.x * 0.5, -0.97, this.fallDir.z * 0.5);
    this.fx.add(this.dust);
  }

  private updateDust(p: number): void {
    if (!this.dust) return;
    this.dust.scale.setScalar(THREE.MathUtils.lerp(0.3, DUST_END_RADIUS, easeOutCubic(p)));
    this.dustMaterial.opacity = 0.55 * (1 - p);
  }
}
