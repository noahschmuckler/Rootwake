// Pass 0.3a: the small shot a match fires from its gems to its flower.
// Visual only — the hit callback is where the pool actually gets fed, so the
// effect lands when the shot does, not when the gems vanish.

import * as THREE from 'three';

// ---- Tuning constants ---------------------------------------------------------
export const PROJECTILE_MS = 420;
export const PROJECTILE_ARC = 0.35; // world units of lift at mid-flight
export const PROJECTILE_RADIUS = 0.055;
// -------------------------------------------------------------------------------

interface Shot {
  mesh: THREE.Object3D;
  from: THREE.Vector3;
  to: THREE.Vector3;
  startMs: number;
  onHit: () => void;
  /** Pass 0.8: a strike flies out, hits, and comes back (the held rock returning to the hand). */
  returns: boolean;
  hit: boolean;
  durationMs: number;
}
export const STRIKE_OUT_MS = 240;
export const STRIKE_BACK_MS = 220;

function easeInQuad(x: number): number {
  return x * x;
}

export class Projectiles {
  readonly group = new THREE.Group();
  private shots: Shot[] = [];
  private readonly geometry = new THREE.SphereGeometry(PROJECTILE_RADIUS, 10, 8);

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  fire(from: THREE.Vector3, to: THREE.Vector3, colorHex: number, nowMs: number, onHit: () => void): void {
    const material = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.position.copy(from);
    this.group.add(mesh);
    this.shots.push({ mesh, from: from.clone(), to: to.clone(), startMs: nowMs, onHit, returns: false, hit: false, durationMs: PROJECTILE_MS });
  }

  /** Pass 0.8: a held object strikes a target and returns — `mesh` is a fresh copy of what's in the hand. */
  strike(mesh: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3, nowMs: number, onHit: () => void): void {
    mesh.position.copy(from);
    this.group.add(mesh);
    this.shots.push({ mesh, from: from.clone(), to: to.clone(), startMs: nowMs, onHit, returns: true, hit: false, durationMs: STRIKE_OUT_MS });
  }

  update(nowMs: number): void {
    const keep: Shot[] = [];
    const done: Shot[] = [];
    for (const s of this.shots) {
      const p = Math.min(1, (nowMs - s.startMs) / s.durationMs);
      if (s.returns) {
        if (!s.hit) {
          s.mesh.position.lerpVectors(s.from, s.to, easeInQuad(p));
          s.mesh.rotation.x += 0.25;
          if (p >= 1) {
            s.hit = true;
            s.onHit();
            s.startMs = nowMs;
            s.durationMs = STRIKE_BACK_MS;
          }
          keep.push(s);
        } else {
          s.mesh.position.lerpVectors(s.to, s.from, 1 - Math.pow(1 - p, 2));
          if (p >= 1) done.push(s);
          else keep.push(s);
        }
        continue;
      }
      const k = easeInQuad(p);
      s.mesh.position.lerpVectors(s.from, s.to, k);
      s.mesh.position.y += Math.sin(p * Math.PI) * PROJECTILE_ARC;
      s.mesh.scale.setScalar(1 + 0.6 * Math.sin(p * Math.PI));
      if (p >= 1) done.push(s);
      else keep.push(s);
    }
    this.shots = keep;
    for (const s of done) {
      this.group.remove(s.mesh);
      if (!s.returns) {
        ((s.mesh as THREE.Mesh).material as THREE.Material).dispose();
        s.onHit();
      }
    }
  }
}
