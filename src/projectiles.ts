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
  mesh: THREE.Mesh;
  from: THREE.Vector3;
  to: THREE.Vector3;
  startMs: number;
  onHit: () => void;
}

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
    this.shots.push({ mesh, from: from.clone(), to: to.clone(), startMs: nowMs, onHit });
  }

  update(nowMs: number): void {
    const keep: Shot[] = [];
    const done: Shot[] = [];
    for (const s of this.shots) {
      const p = Math.min(1, (nowMs - s.startMs) / PROJECTILE_MS);
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
      (s.mesh.material as THREE.Material).dispose();
      s.onHit();
    }
  }
}
