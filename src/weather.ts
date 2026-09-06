// Pass 1.0: weather (SYSTEMS.md §4, ROADMAP 1.0). Rain is the reason for a
// roof. Dry spells and showers alternate on a clock; a shower ramps in and
// out, darkens the day (the day cycle and sky read `overcast`), drains
// vitality while you are out in it, and now and then throws lightning: a
// flash, a delayed crack (the thud shake), and, rarely, a strike close
// enough to sap you to the danger band — unless you are under a roof.
//
// The rain itself is a field of short streaks kept around the camera in
// world space, falling and wrapping. No audio in the prototype yet.

import * as THREE from 'three';
import { mulberry32 } from './colors';

// ---- Tuning constants ---------------------------------------------------------
/** Dry spell before a shower, and shower length (ms of animation time). */
export const DRY_MIN_MS = 70_000;
export const DRY_MAX_MS = 150_000;
export const RAIN_MIN_MS = 35_000;
export const RAIN_MAX_MS = 70_000;
/** The first shower comes sooner than a dry spell: the phone session should meet rain. */
export const FIRST_DRY_MS = 55_000;
/** Ramp in/out of a shower. */
export const RAIN_RAMP_MS = 8_000;
/** Vitality per second out in full rain (SYSTEMS §1.1). A full shower costs ~0.15–0.3. */
export const DRAIN_RAIN_PER_SECOND = 0.004;
/** Lightning: mean interval at full rain, how often a strike is close, what it saps you to. */
export const LIGHTNING_MEAN_MS = 16_000;
export const LIGHTNING_NEAR_CHANCE = 0.3;
export const LIGHTNING_SAP_TO = 0.16; // just under the exhausted band (0.2): dangerously low, not the floor
export const FLASH_MS = 160;
export const THUNDER_DELAY_MS = 600;
/** Overcast: how much a full shower dims the sun / hemisphere and thickens the fog. */
export const OVERCAST_SUN = 0.35;
export const OVERCAST_HEMI = 0.75;
export const OVERCAST_FOG = 1.8;
/** Rain field: streak count, box around the camera, fall speed, streak length. */
export const RAIN_STREAKS = 900;
export const RAIN_BOX = 14;
export const RAIN_HEIGHT = 9;
export const RAIN_SPEED = 9;
export const RAIN_STREAK = 0.32;
export const RAIN_WIND = 0.12;
// -------------------------------------------------------------------------------

type Phase = { kind: 'dry'; until: number } | { kind: 'rain'; until: number };

export class Weather {
  /** Shower intensity 0..1 (ramped). */
  rain = 0;
  /** Lightning flash 0..1, decaying. */
  flash = 0;
  /** Fired when a shower begins/ends (for hints). */
  onRain: (raining: boolean) => void = () => {};
  /** Fired on a strike; `near` means close enough to hurt. */
  onLightning: (near: boolean) => void = () => {};

  private phase: Phase;
  private rainStart = -1;
  private readonly rand: () => number;
  private readonly lines: THREE.LineSegments;
  private readonly positions: Float32Array;
  private readonly material: THREE.LineBasicMaterial;
  private lastMs = -1;
  private thunderAt = -1;
  private thunderNear = false;

  /** How overcast the day is: follows the rain. */
  get overcast(): number {
    return this.rain;
  }

  constructor(scene: THREE.Scene, seed: number, nowMs: number, forceRain = false) {
    this.rand = mulberry32(seed ^ 0x7a1e);
    this.phase = { kind: 'dry', until: nowMs + (forceRain ? 0 : FIRST_DRY_MS) };
    this.positions = new Float32Array(RAIN_STREAKS * 2 * 3);
    for (let i = 0; i < RAIN_STREAKS; i++) {
      this.positions[i * 6] = (this.rand() - 0.5) * RAIN_BOX;
      this.positions[i * 6 + 1] = this.rand() * RAIN_HEIGHT - 3;
      this.positions[i * 6 + 2] = (this.rand() - 0.5) * RAIN_BOX;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.material = new THREE.LineBasicMaterial({ color: 0xc4cedb, transparent: true, opacity: 0, depthWrite: false });
    this.lines = new THREE.LineSegments(geo, this.material);
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    this.lines.renderOrder = 5;
    scene.add(this.lines);
  }

  /** Is it raining at all (for drains and hints)? */
  get raining(): boolean {
    return this.phase.kind === 'rain';
  }

  update(nowMs: number, cameraPosition: THREE.Vector3): void {
    const dt = this.lastMs < 0 ? 0 : Math.min(0.1, Math.max(0, (nowMs - this.lastMs) / 1000));
    this.lastMs = nowMs;

    // Phase clock.
    if (nowMs >= this.phase.until) {
      if (this.phase.kind === 'dry') {
        this.phase = { kind: 'rain', until: nowMs + RAIN_MIN_MS + this.rand() * (RAIN_MAX_MS - RAIN_MIN_MS) };
        this.rainStart = nowMs;
        this.onRain(true);
      } else {
        this.phase = { kind: 'dry', until: nowMs + DRY_MIN_MS + this.rand() * (DRY_MAX_MS - DRY_MIN_MS) };
        this.onRain(false);
      }
    }
    // Intensity ramps in over RAIN_RAMP_MS and out over the last RAIN_RAMP_MS of the shower.
    if (this.phase.kind === 'rain') {
      const sinceStart = nowMs - this.rainStart;
      const untilEnd = this.phase.until - nowMs;
      this.rain = THREE.MathUtils.clamp(Math.min(sinceStart, untilEnd) / RAIN_RAMP_MS, 0, 1);
    } else {
      this.rain = Math.max(0, this.rain - dt / (RAIN_RAMP_MS / 1000));
    }

    // Lightning, in the thick of a shower.
    this.flash = Math.max(0, this.flash - (dt * 1000) / FLASH_MS);
    if (this.rain > 0.6 && this.rand() < (dt * 1000) / LIGHTNING_MEAN_MS) {
      this.flash = 1;
      this.thunderAt = nowMs + THUNDER_DELAY_MS;
      this.thunderNear = this.rand() < LIGHTNING_NEAR_CHANCE;
    }
    if (this.thunderAt >= 0 && nowMs >= this.thunderAt) {
      this.thunderAt = -1;
      this.onLightning(this.thunderNear);
    }

    // The rain field: fall, wrap around the camera, fade with intensity.
    this.lines.visible = this.rain > 0.005;
    this.material.opacity = 0.42 * this.rain;
    if (this.lines.visible) {
      const p = this.positions;
      const fall = RAIN_SPEED * dt;
      const half = RAIN_BOX / 2;
      for (let i = 0; i < RAIN_STREAKS; i++) {
        let x = p[i * 6] - RAIN_WIND * fall;
        let y = p[i * 6 + 1] - fall;
        let z = p[i * 6 + 2];
        if (y < cameraPosition.y - 3) y += RAIN_HEIGHT;
        if (x < cameraPosition.x - half) x += RAIN_BOX;
        else if (x > cameraPosition.x + half) x -= RAIN_BOX;
        if (z < cameraPosition.z - half) z += RAIN_BOX;
        else if (z > cameraPosition.z + half) z -= RAIN_BOX;
        p[i * 6] = x;
        p[i * 6 + 1] = y;
        p[i * 6 + 2] = z;
        p[i * 6 + 3] = x + RAIN_WIND * RAIN_STREAK;
        p[i * 6 + 4] = y + RAIN_STREAK;
        p[i * 6 + 5] = z;
      }
      (this.lines.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  }
}
