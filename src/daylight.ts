// Pass 0.7b: the day/night cycle (SYSTEMS.md §2). Time of day is a number
// 0..1: 0 dawn, 0.25 noon, 0.5 dusk, 0.75 midnight. It drives the sun, the
// sky hemisphere, the sky dome, the fog colour — and, with vitality, what
// you can see at night: well fed sees far but washed out; tired sees dark,
// and the lichen glows.

import * as THREE from 'three';

// ---- Tuning constants ---------------------------------------------------------
/** Real ms per full day. Short enough that a phone session sees both. */
export const DAY_LENGTH_MS = 240_000;
export const START_TIME = 0.15; // morning
/** Colours the world lerps toward at night. */
export const NIGHT_HAZE = 0x0e131c;
export const NIGHT_SKY_TINT = 0x1a2233; // multiplies the sky dome's vertex colours
export const NIGHT_HEMI_SKY = 0x223048;
/**
 * Night vision. Well-fed eyes get light, not exposure: a moonlit hemisphere
 * (NIGHT_VISION_HEMI) and a faint cool overhead light (NIGHT_VISION_MOON)
 * scaled by vision, with colours washed (NIGHT_SATURATION_FED). Tired eyes
 * get neither and a lower exposure on top.
 */
export const NIGHT_VISION_HEMI = 0.75;
export const NIGHT_VISION_MOON = 0.5;
export const NIGHT_VISION_HEMI_COLOR = 0x8fa4c2;
export const NIGHT_EXPOSURE_TIRED = 0.3;
export const NIGHT_SATURATION_FED = 0.45;
/** Glow (tired-night vision) above this makes hidden things collectible. */
export const GLOW_VISIBLE = 0.5;
// -------------------------------------------------------------------------------

export interface DaylightRig {
  sun: THREE.DirectionalLight;
  /** The night-vision light: overhead, cool, only for well-fed eyes at night. */
  moon: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  skyMaterial: THREE.MeshBasicMaterial;
  fog: THREE.FogExp2;
  background: THREE.Color;
  dayHaze: number;
  dayHemiSky: number;
}

export class DayCycle {
  time = START_TIME;
  private readonly dayHaze = new THREE.Color();
  private readonly nightHaze = new THREE.Color(NIGHT_HAZE);
  private readonly scratch = new THREE.Color();
  private readonly hemiDay = new THREE.Color();
  private readonly hemiNight = new THREE.Color(NIGHT_HEMI_SKY);
  private readonly skyNight = new THREE.Color(NIGHT_SKY_TINT);
  private readonly hemiVision = new THREE.Color(NIGHT_VISION_HEMI_COLOR);

  constructor(private readonly rig: DaylightRig, startTime = START_TIME) {
    this.time = startTime;
    this.dayHaze.setHex(rig.dayHaze);
    this.hemiDay.setHex(rig.dayHemiSky);
  }

  /** Sun height, -1 (midnight) .. 1 (noon). */
  get sunHeight(): number {
    return Math.sin(this.time * Math.PI * 2);
  }

  /** Unit vector toward the sun. Rises over -Z, arcs toward +X (the cliff), sets over +Z. */
  get sunDirection(): THREE.Vector3 {
    const a = this.time * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 0.6 + 0.3, this.sunHeight, -Math.sin(a) * 0.9).normalize();
  }

  /** 1 in full day, 0 in full night, smooth through dawn and dusk. */
  get day(): number {
    return THREE.MathUtils.smoothstep(this.sunHeight, -0.25, 0.35);
  }

  advance(dtMs: number): void {
    this.time = (this.time + dtMs / DAY_LENGTH_MS) % 1;
  }

  /** Paint the sky, sun and fog for the current time, lit for eyes with this much night vision (0..1). */
  apply(nightVision = 0): void {
    const day = this.day;
    const night = 1 - day;
    const r = this.rig;
    r.sun.position.copy(this.sunDirection).multiplyScalar(40);
    r.sun.intensity = 1.6 * day;
    r.moon.intensity = NIGHT_VISION_MOON * night * nightVision;
    r.hemi.intensity = THREE.MathUtils.lerp(0.18, 1.1, day) + NIGHT_VISION_HEMI * night * nightVision;
    r.hemi.color.copy(this.scratch.copy(this.hemiNight).lerp(this.hemiVision, night * nightVision).lerp(this.hemiDay, day));
    this.scratch.copy(this.nightHaze).lerp(this.dayHaze, day);
    r.fog.color.copy(this.scratch);
    r.background.copy(this.scratch);
    r.skyMaterial.color.copy(this.scratch.copy(this.skyNight).lerp(new THREE.Color(0xffffff), day));
  }

  /**
   * How the render should shift for a given night-vision (0 tired .. 1 fed):
   * exposure and saturation multipliers, and the glow strength that lights
   * hidden things for tired eyes.
   */
  vision(nightVision: number): { exposure: number; saturation: number; glow: number } {
    const night = 1 - this.day;
    return {
      exposure: THREE.MathUtils.lerp(1, THREE.MathUtils.lerp(NIGHT_EXPOSURE_TIRED, 1, nightVision), night),
      saturation: THREE.MathUtils.lerp(1, THREE.MathUtils.lerp(0.95, NIGHT_SATURATION_FED, nightVision), night),
      glow: night * (1 - nightVision),
    };
  }
}
