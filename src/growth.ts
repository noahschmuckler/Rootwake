// Pass 0.6c: a sapling — what seeds on tilled ground become, and what
// becomes a tree. Three authored stages swapped at thirds of the grow time
// (the staging convention from patches and the axe), with a little
// continuous swell inside each so it reads as growing rather than ticking.
// When it is done the caller replaces it with a real tree voxel.

import * as THREE from 'three';

// ---- Tuning constants ---------------------------------------------------------
/** Real-speed ms from planting to a full tree. Long enough to walk away and come back. */
export const GROW_MS = 90_000;
/** Seeds one planting consumes. */
export const PLANT_SEEDS = 4;
// -------------------------------------------------------------------------------

const wood = new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 0.95 });
const leaf = new THREE.MeshStandardMaterial({ color: 0x2f5a30, roughness: 1, flatShading: true });

function stage(stemHeight: number, stemRadius: number, blobs: [number, number, number, number][]): THREE.Group {
  const g = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(stemRadius * 0.7, stemRadius, stemHeight, 7), wood);
  stem.position.y = stemHeight / 2;
  g.add(stem);
  const ico = new THREE.IcosahedronGeometry(1, 0);
  for (const [x, y, z, r] of blobs) {
    const b = new THREE.Mesh(ico, leaf);
    b.position.set(x, y, z);
    b.scale.setScalar(r);
    g.add(b);
  }
  return g;
}

export class Sapling {
  readonly group = new THREE.Group();
  private readonly stages: THREE.Group[];
  private current = -1;

  constructor() {
    this.stages = [
      stage(0.35, 0.03, [[0.06, 0.34, 0, 0.08], [-0.05, 0.28, 0.04, 0.07]]),
      stage(0.7, 0.05, [[0, 0.72, 0, 0.24], [0.14, 0.5, -0.08, 0.12]]),
      stage(1.0, 0.07, [[0, 1.05, 0, 0.42], [0.3, 0.75, 0.1, 0.22], [-0.28, 0.85, -0.12, 0.2]]),
    ];
    for (const s of this.stages) {
      s.visible = false;
      this.group.add(s);
    }
    this.setProgress(0);
  }

  /** 0 → 1 over the grow time. */
  setProgress(p: number): void {
    const k = Math.min(this.stages.length - 1, Math.floor(p * this.stages.length));
    if (k !== this.current) {
      this.current = k;
      this.stages.forEach((s, i) => (s.visible = i === k));
    }
    const within = p * this.stages.length - k;
    this.stages[k].scale.setScalar(0.85 + 0.15 * Math.min(1, within));
  }
}


// ---- 1.1c: wheat ------------------------------------------------------------------
/** Wheat grows from four wheat seeds to four ripe stalks over this long, then waits to be harvested. */
export const WHEAT_GROW_MS = 60_000;
/** Seeds a harvest gives. */
export const WHEAT_YIELD = 10;
/** Board pool a harvest fills. */
export const WHEAT_CAPACITY = 18;

const stalkMaterial = new THREE.MeshStandardMaterial({ color: 0x8fb04a, roughness: 0.9, flatShading: true });
const ripeMaterial = new THREE.MeshStandardMaterial({ color: 0xd9b23a, roughness: 0.8, flatShading: true });
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xe0b437, roughness: 0.7, flatShading: true });

/** Four stalks at the patch's quarters: thin stems that lengthen, heads that fill out and turn gold. */
export class WheatStalks {
  readonly group = new THREE.Group();
  private readonly stems: THREE.Mesh[] = [];
  private readonly heads: THREE.Mesh[] = [];

  constructor() {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      const x = Math.cos(a) * 0.28;
      const z = Math.sin(a) * 0.28;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 1, 5), stalkMaterial);
      stem.position.set(x, 0.5, z);
      stem.rotation.z = 0.08 * Math.sin(i * 2.3);
      const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 2, 6), headMaterial);
      head.position.set(x, 1.05, z);
      head.rotation.z = 0.25 * Math.sin(i * 1.7);
      this.stems.push(stem);
      this.heads.push(head);
      this.group.add(stem, head);
    }
    this.setProgress(0);
  }

  /** 0 → 1 over WHEAT_GROW_MS. */
  setProgress(p: number): void {
    const h = 0.15 + 0.85 * Math.min(1, p / 0.8); // stems reach full height by 80%
    const ripe = Math.max(0, (p - 0.6) / 0.4); // heads swell and turn gold in the last 40%
    this.stems.forEach((s, i) => {
      s.scale.set(1, h, 1);
      s.position.y = h / 2;
      s.material = p >= 1 ? ripeMaterial : stalkMaterial;
      const head = this.heads[i];
      head.visible = p > 0.5;
      head.scale.setScalar(0.3 + 0.7 * ripe);
      head.position.y = h + 0.08;
    });
  }
}
