// The sky as something more than a colour (designer, after 0.7b: a blank
// dome is disorienting and makes nightfall look like fatigue). A sun disc
// with a glow, a moon opposite it, a slowly turning star field that fades in
// at dusk, and a few drifting clouds. Everything rides on a group that
// follows the camera's position, so it all sits at "infinity" inside the sky
// dome. Cheap: generated textures, unlit materials, no fog on any of it.

import * as THREE from 'three';
import { mulberry32 } from './colors';

// ---- Tuning constants ---------------------------------------------------------
export const SKY_RADIUS = 2500; // inside the 2800 dome
export const SUN_SIZE = 180;
export const SUN_GLOW_SIZE = 720;
export const MOON_SIZE = 120;
export const STAR_COUNT = 900;
export const CLOUD_COUNT = 16;
export const CLOUD_HEIGHT = 700;
export const CLOUD_DRIFT = 6; // world units per second
// -------------------------------------------------------------------------------

function radialTexture(inner: number, softness: number): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(inner, 'rgba(255,255,255,1)');
  g.addColorStop(Math.min(1, inner + softness), 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/** Puffy cloud: several overlapping soft blobs, flat-bottomed. */
function cloudTexture(seed: number): THREE.CanvasTexture {
  const w = 256;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(seed);
  for (let i = 0; i < 9; i++) {
    const cx = w * (0.2 + rand() * 0.6);
    const cy = h * (0.45 + rand() * 0.25);
    const r = h * (0.22 + rand() * 0.22);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.75)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  // Flatten the underside a little.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0, h * 0.86, w, h * 0.14);
  return new THREE.CanvasTexture(canvas);
}

export class Sky {
  readonly group = new THREE.Group();
  private readonly sun: THREE.Sprite;
  private readonly sunGlow: THREE.Sprite;
  private readonly moon: THREE.Sprite;
  private readonly stars: THREE.Points;
  private readonly starMaterial: THREE.PointsMaterial;
  private readonly clouds: THREE.Mesh[] = [];
  private readonly cloudMaterials: THREE.MeshBasicMaterial[] = [];
  private readonly sunColor = new THREE.Color();

  constructor(scene: THREE.Scene) {
    const disc = radialTexture(0.82, 0.12);
    const glow = radialTexture(0.0, 1.0);

    this.sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: disc, color: 0xfff3d0, fog: false, depthWrite: false, transparent: true }));
    this.sun.scale.setScalar(SUN_SIZE);
    this.sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glow, color: 0xffe2a8, fog: false, depthWrite: false, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    );
    this.sunGlow.scale.setScalar(SUN_GLOW_SIZE);
    this.moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: disc, color: 0xdfe6f2, fog: false, depthWrite: false, transparent: true }));
    this.moon.scale.setScalar(MOON_SIZE);
    this.group.add(this.sunGlow, this.sun, this.moon);

    // Stars on a sphere, brighter ones rarer.
    const rand = mulberry32(77);
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      positions[i * 3] = r * Math.cos(phi) * SKY_RADIUS * 0.98;
      positions[i * 3 + 1] = u * SKY_RADIUS * 0.98;
      positions[i * 3 + 2] = r * Math.sin(phi) * SKY_RADIUS * 0.98;
      const b = 0.5 + Math.pow(rand(), 3) * 0.5;
      const warm = rand() < 0.2;
      colors[i * 3] = b;
      colors[i * 3 + 1] = b * (warm ? 0.92 : 0.97);
      colors[i * 3 + 2] = b * (warm ? 0.8 : 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.starMaterial = new THREE.PointsMaterial({ size: 3.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0, fog: false, depthWrite: false });
    this.stars = new THREE.Points(geo, this.starMaterial);
    this.group.add(this.stars);

    // Clouds: flat quads high up, each its own texture, drifting along +Z.
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const tex = cloudTexture(100 + i);
      const material = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9, fog: false, depthWrite: false, side: THREE.DoubleSide });
      const w = 260 + rand() * 340;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.5), material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set((rand() * 2 - 1) * 1600, CLOUD_HEIGHT + rand() * 250, (rand() * 2 - 1) * 1600);
      this.clouds.push(mesh);
      this.cloudMaterials.push(material);
      this.group.add(mesh);
    }

    scene.add(this.group);
  }

  /**
   * @param sunDir unit vector toward the sun (may be below the horizon)
   * @param day    1 full day .. 0 full night
   * @param dtSec  frame time for cloud drift
   */
  update(cameraPosition: THREE.Vector3, sunDir: THREE.Vector3, day: number, timeOfDay: number, dtSec: number): void {
    this.group.position.copy(cameraPosition);

    this.sun.position.copy(sunDir).multiplyScalar(SKY_RADIUS * 0.96);
    this.sunGlow.position.copy(this.sun.position);
    // Low sun goes orange; the glow swells at the horizon and fades below it.
    const height = THREE.MathUtils.clamp(sunDir.y, -0.2, 1);
    this.sunColor.setHex(0xfff3d0).lerp(new THREE.Color(0xff7a2a), 1 - THREE.MathUtils.smoothstep(height, 0, 0.5));
    (this.sun.material as THREE.SpriteMaterial).color.copy(this.sunColor);
    (this.sunGlow.material as THREE.SpriteMaterial).color.copy(this.sunColor);
    const above = THREE.MathUtils.smoothstep(sunDir.y, -0.08, 0.02);
    (this.sun.material as THREE.SpriteMaterial).opacity = above;
    (this.sunGlow.material as THREE.SpriteMaterial).opacity = above * (0.3 + 0.5 * (1 - THREE.MathUtils.smoothstep(height, 0, 0.5)));

    this.moon.position.copy(sunDir).multiplyScalar(-SKY_RADIUS * 0.96);
    (this.moon.material as THREE.SpriteMaterial).opacity = THREE.MathUtils.smoothstep(-sunDir.y, -0.08, 0.05) * (1 - 0.6 * day);

    // Stars: in at dusk, turning with the sky about the sun's axis.
    this.starMaterial.opacity = (1 - day) * 0.95;
    this.stars.rotation.z = timeOfDay * Math.PI * 2;

    // Clouds: white by day, a dim grey by night; drift and wrap.
    const cloudColor = 0.25 + 0.75 * day;
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      c.position.z += CLOUD_DRIFT * dtSec;
      if (c.position.z > 1700) c.position.z = -1700;
      this.cloudMaterials[i].color.setRGB(cloudColor, cloudColor, cloudColor * 1.02);
      this.cloudMaterials[i].opacity = 0.55 + 0.35 * day;
    }
  }
}
