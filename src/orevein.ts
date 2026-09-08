// The lab: silvery ore on the arena walls for the rust monster to work.
// A vein is a cluster of bright metal plates flush on a wall face, with a
// rust level 0..1: at 0 it is silver; as it rises the plates go brown and
// a fuzz of fine rust grows out of them; scraped, it goes back to silver.

import * as THREE from 'three';
import { mulberry32 } from './colors';

// ---- Tuning constants ---------------------------------------------------------
export const VEIN_PLATES = 14;
export const VEIN_SPREAD = 0.55; // half-extent of a cluster along the wall
export const FUZZ_PER_PLATE = 6;
export const FUZZ_LENGTH = 0.09;
// -------------------------------------------------------------------------------

const SILVER = new THREE.Color(0xd8dee6);
const RUST = new THREE.Color(0x7a3a14);
const RUST_FUZZ = new THREE.Color(0x9a4a1c);

export class OreVein {
  readonly group = new THREE.Group();
  /** 0 silver … 1 fully rusted. */
  rust = 0;
  private readonly plateMaterial: THREE.MeshStandardMaterial;
  private readonly fuzzMaterial: THREE.LineBasicMaterial;
  private readonly fuzz: THREE.LineSegments;

  /**
   * @param anchor a point on the wall's inner face
   * @param normal the wall's inward normal (into the room)
   */
  constructor(readonly anchor: THREE.Vector3, readonly normal: THREE.Vector3, seed: number) {
    const rand = mulberry32(seed);
    this.plateMaterial = new THREE.MeshStandardMaterial({ color: SILVER.clone(), metalness: 1, roughness: 0.22, flatShading: true });
    this.fuzzMaterial = new THREE.LineBasicMaterial({ color: RUST_FUZZ.clone(), transparent: true, opacity: 0 });
    this.group.position.copy(anchor);
    this.group.lookAt(anchor.clone().add(normal)); // local +Z = into the room
    // Plates: two crooked vein lines across the cluster, a little proud of the wall.
    const fuzzPts: number[] = [];
    for (let i = 0; i < VEIN_PLATES; i++) {
      const line = i % 2;
      const t = (i / VEIN_PLATES) * 2 - 1;
      const u = t * VEIN_SPREAD + (rand() - 0.5) * 0.08;
      const v = (line ? 0.16 : -0.14) + Math.sin(t * 2.6 + line) * 0.12 + (rand() - 0.5) * 0.06;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.16 + rand() * 0.12, 0.05 + rand() * 0.04, 0.03), this.plateMaterial);
      plate.position.set(u, v, 0.012);
      plate.rotation.z = Math.atan2(Math.cos(t * 2.6 + line) * 0.12 * 2.6, VEIN_SPREAD) + (rand() - 0.5) * 0.3;
      this.group.add(plate);
      for (let k = 0; k < FUZZ_PER_PLATE; k++) {
        const x = u + (rand() - 0.5) * 0.14, y = v + (rand() - 0.5) * 0.05;
        const dx = (rand() - 0.5) * 0.5, dy = (rand() - 0.5) * 0.5;
        fuzzPts.push(x, y, 0.03, x + dx * FUZZ_LENGTH, y + dy * FUZZ_LENGTH, 0.03 + FUZZ_LENGTH * (0.6 + rand() * 0.6));
      }
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fuzzPts, 3));
    this.fuzz = new THREE.LineSegments(fg, this.fuzzMaterial);
    this.group.add(this.fuzz);
    this.apply();
  }

  /** Where a feeler should reach to: the cluster's centre, in the room. */
  get target(): THREE.Vector3 {
    return this.anchor.clone();
  }

  /** A point on the floor in front of it, `back` out from the wall. */
  standPoint(back: number, groundY: number): THREE.Vector3 {
    return new THREE.Vector3(this.anchor.x + this.normal.x * back, groundY, this.anchor.z + this.normal.z * back);
  }

  setRust(r: number): void {
    this.rust = Math.max(0, Math.min(1, r));
    this.apply();
  }

  private apply(): void {
    const r = this.rust;
    this.plateMaterial.color.copy(SILVER).lerp(RUST, r);
    this.plateMaterial.metalness = 1 - 0.8 * r;
    this.plateMaterial.roughness = 0.22 + 0.75 * r;
    this.fuzzMaterial.opacity = Math.max(0, r - 0.15) / 0.85;
    // the fuzz stands up as it grows
    this.fuzz.scale.z = 0.2 + 0.8 * r;
  }
}
