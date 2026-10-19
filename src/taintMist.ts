// The taint's mist (MOTHER.md; Noah, 2026-10-19: "grey translucent fog clouds drifting around that phase
// into the greens and oranges, at times obscenely bright or even neon; the randomness is what sells it").
// A pool of soft billboards that drift over the ground about the camera while Hulda is in the taint:
// grey and translucent in the outer biome; closer in (flareAt), now one, now another flushes, without
// warning, to a clashing yellow-green, green or orange, sometimes bright past the bloom's threshold,
// and fades back to grey. Tuning constants at the top.
import * as THREE from 'three';

/** Puffs in the pool; how far from the camera they live (m); their width (m); drift speed (m/s). Tuning. */
const PUFFS = 18, NEAR = 10, FAR = 75, WIDTH = [9, 26], DRIFT = [0.25, 1.1];
/** How long a puff lives (s), fading in and out over FADE_S; the base grey and its opacity at the edge and the heart. Tuning. */
const LIFE = [12, 28], FADE_S = 3, GREY = new THREE.Color('#9a968f'), OPACITY = [0.22, 0.5];
/** A flush: its odds a second per puff at full flare, how long it lasts (s), the colours, the share that go neon and how bright. Tuning. */
const FLUSH_RATE = 0.07, FLUSH_S = [0.7, 2.6], NEON_SHARE = 0.3, NEON = 4.5;
const FLUSH = ['#d8ff1e', '#ff7a10', '#3cff4a', '#ffb000', '#7dff20'].map(c => new THREE.Color(c));

export interface MistState { depth: number; flare: number; on: boolean }
export interface TaintMist { group: THREE.Group; update(camera: THREE.Camera, ground: (x: number, z: number) => number, s: MistState, dt: number): void }

function puffTexture(): THREE.Texture {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!;
  // A soft, uneven cloud: a few overlapping radial blobs.
  for (const [x, y, r, a] of [[64, 70, 58, 0.55], [42, 72, 36, 0.35], [88, 66, 40, 0.35], [62, 52, 34, 0.3]] as const) {
    const grad = g.createRadialGradient(x, y, 0, x, y, r); grad.addColorStop(0, `rgba(255,255,255,${a})`); grad.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function createTaintMist(scene: THREE.Scene): TaintMist {
  const group = new THREE.Group(); group.name = 'taint-mist'; scene.add(group);
  const tex = puffTexture(), rand = Math.random;
  const puffs = Array.from({ length: PUFFS }, () => {
    const mat = new THREE.SpriteMaterial({ map: tex, color: GREY.clone(), transparent: true, opacity: 0, depthWrite: false, fog: false }); // the scene's fog would grey the flushes out: each puff fades by its own distance instead
    const sprite = new THREE.Sprite(mat); sprite.visible = false; group.add(sprite);
    return { sprite, mat, age: 0, life: 0, w: 10, vx: 0, vz: 0, flush: -1, flushS: 1, colour: GREY.clone(), neon: false };
  });
  const fwd = new THREE.Vector3(), tmp = new THREE.Color();
  function spawn(p: typeof puffs[number], cam: THREE.Camera, ground: (x: number, z: number) => number, anywhere: boolean): void {
    cam.getWorldDirection(fwd); const yaw = Math.atan2(fwd.z, fwd.x), a = yaw + (rand() - 0.5) * (anywhere ? Math.PI * 2 : 2.4), d = NEAR + rand() * (FAR - NEAR);
    const x = cam.position.x + Math.cos(a) * d, z = cam.position.z + Math.sin(a) * d; p.w = WIDTH[0] + rand() * (WIDTH[1] - WIDTH[0]);
    p.sprite.position.set(x, ground(x, z) + p.w * 0.22, z); p.sprite.scale.set(p.w, p.w * 0.55, 1);
    const wind = 0.6 + (rand() - 0.5) * 0.9, sp = DRIFT[0] + rand() * (DRIFT[1] - DRIFT[0]); p.vx = Math.cos(wind) * sp; p.vz = Math.sin(wind) * sp;
    p.age = 0; p.life = LIFE[0] + rand() * (LIFE[1] - LIFE[0]); p.flush = -1; p.sprite.visible = true;
  }
  let was = false;
  function update(cam: THREE.Camera, ground: (x: number, z: number) => number, s: MistState, dt: number): void {
    const on = s.on && s.depth > 0; group.visible = on; if (!on) { was = false; return; }
    const base = OPACITY[0] + (OPACITY[1] - OPACITY[0]) * s.depth;
    for (const p of puffs) {
      if (!was || p.age >= p.life || p.sprite.position.distanceTo(cam.position) > FAR * 1.4) { spawn(p, cam, ground, !was); if (!was) p.age = rand() * p.life * 0.6; }
      p.age += dt; p.sprite.position.x += p.vx * dt; p.sprite.position.z += p.vz * dt; p.sprite.position.y = ground(p.sprite.position.x, p.sprite.position.z) + p.w * 0.22 + Math.sin(p.age * 0.4) * 0.6;
      const dist = p.sprite.position.distanceTo(cam.position), fade = Math.min(1, p.age / FADE_S, (p.life - p.age) / FADE_S) * (1 - Math.min(1, Math.max(0, (dist - FAR * 0.55) / (FAR * 0.45))));
      // A flush comes without warning, more often deeper in and the more she attends; it rises fast and falls back to grey.
      if (p.flush < 0 && rand() < s.flare * FLUSH_RATE * dt) { p.flush = 0; p.flushS = FLUSH_S[0] + rand() * (FLUSH_S[1] - FLUSH_S[0]); p.colour.copy(FLUSH[Math.floor(rand() * FLUSH.length)]); p.neon = rand() < NEON_SHARE; }
      let k = 0; if (p.flush >= 0) { p.flush += dt; const u = p.flush / p.flushS; k = u < 0.2 ? u / 0.2 : Math.max(0, 1 - (u - 0.2) / 0.8); if (u >= 1) p.flush = -1; }
      tmp.copy(GREY).lerp(p.colour, k); if (p.neon) tmp.multiplyScalar(1 + (NEON - 1) * k);
      p.mat.color.copy(tmp); p.mat.opacity = fade * (base + k * (p.neon ? 0.45 : 0.25));
    }
    was = true;
  }
  return { group, update };
}
