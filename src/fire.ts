// 1.1b: the campfire (SYSTEMS.md §6, ROADMAP 1.1). A structure built from a
// blueprint — two knuckles crossed, four sticks stood against each other,
// wood shavings in the middle — that a board session lights ("match-3
// magic"). Lit, it is a light: a flickering point light and a few flame
// cones, that dwindles as its fuel burns down and can be fed shavings,
// sticks and knuckles from the hands. Out, it is embers; light it again.
// Later: cooking (1.1c pops wheat on it).

import * as THREE from 'three';
import type { ObjectTypeId } from './objects';

// ---- Tuning constants ---------------------------------------------------------
/** Fuel a fresh lighting gives, and what each feed adds (ms of burn). */
export const FIRE_START_MS = 150_000;
export const FUEL_MS: Partial<Record<ObjectTypeId, number>> = { chip: 8_000, stick: 35_000, log_stub: 110_000 };
export const FIRE_MAX_MS = 480_000;
/** Light at full fuel, and the radius it reaches. */
export const FIRE_LIGHT = 2.6;
export const FIRE_LIGHT_DISTANCE = 9;
/** Below this fraction of a fresh fire the flames are low and the light dim. */
export const FIRE_LOW = 0.25;
// -------------------------------------------------------------------------------

const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xffa030, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
const emberMaterial = new THREE.MeshStandardMaterial({ color: 0x3a1a0a, emissive: 0xff5010, emissiveIntensity: 0, roughness: 1, flatShading: true });

export class Fire {
  readonly group = new THREE.Group();
  readonly light: THREE.PointLight;
  private readonly flames: THREE.Mesh[] = [];
  private readonly core: THREE.Mesh;
  private readonly embers: THREE.Mesh;
  /** Burn time left, ms. */
  fuelMs = 0;
  lit = false;
  private lastMs = -1;
  private phase = Math.random() * 100;

  constructor(position: THREE.Vector3, groundY: number) {
    this.group.position.set(position.x, groundY, position.z);
    this.light = new THREE.PointLight(0xffa040, 0, FIRE_LIGHT_DISTANCE, 2);
    this.light.position.y = 0.6;
    this.group.add(this.light);
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.16 - i * 0.03, 0.55 - i * 0.1, 6), flameMaterial);
      m.position.set(Math.cos(i * 2.1) * 0.08, 0.45, Math.sin(i * 2.1) * 0.08);
      this.flames.push(m);
      this.group.add(m);
    }
    this.core = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 5), coreMaterial);
    this.core.position.y = 0.4;
    this.group.add(this.core);
    this.embers = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), emberMaterial.clone());
    this.embers.scale.set(1.2, 0.35, 1.2);
    this.embers.position.y = 0.36;
    this.group.add(this.embers);
    this.show(0);
  }

  /** Fuel fraction against a fresh fire, 0..1+. */
  get level(): number {
    return this.fuelMs / FIRE_START_MS;
  }

  ignite(): void {
    this.lit = true;
    if (this.fuelMs < FIRE_START_MS) this.fuelMs = FIRE_START_MS;
  }

  /** Feed it something that burns. Returns true if it took it. */
  feed(type: ObjectTypeId): boolean {
    const ms = FUEL_MS[type];
    if (!ms) return false;
    this.fuelMs = Math.min(FIRE_MAX_MS, this.fuelMs + ms);
    return true;
  }

  private show(k: number): void {
    const flicker = 0.85 + 0.15 * Math.sin(this.phase * 7.3) * Math.sin(this.phase * 3.1);
    const f = Math.min(1, k) * flicker;
    this.flames.forEach((m, i) => {
      m.visible = f > 0.02;
      m.scale.set(1, 0.4 + f * (1 + 0.15 * Math.sin(this.phase * 9 + i)), 1);
      m.position.y = 0.36 + 0.22 * m.scale.y;
    });
    this.core.visible = f > 0.05;
    this.core.scale.setScalar(0.6 + f * 0.6);
    this.light.intensity = FIRE_LIGHT * f;
    (this.embers.material as THREE.MeshStandardMaterial).emissiveIntensity = this.lit ? 0.6 + 0.6 * f : Math.max(0, 0.35 - k * 0.3);
  }

  update(nowMs: number): void {
    const dt = this.lastMs < 0 ? 0 : Math.min(0.25, Math.max(0, (nowMs - this.lastMs) / 1000));
    this.lastMs = nowMs;
    this.phase += dt;
    if (this.lit) {
      this.fuelMs = Math.max(0, this.fuelMs - dt * 1000);
      if (this.fuelMs <= 0) this.lit = false;
    }
    this.show(this.lit ? Math.max(FIRE_LOW * 0.6, this.level) : 0);
  }
}
