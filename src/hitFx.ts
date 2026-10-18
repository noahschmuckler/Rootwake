// F1: what a blow looks like in the world. A swept slash (a crescent whose bright head runs across her
// front and leaves a fading tail, alternating side to side), a star of light where a blow lands, a burst
// of flecks (her leaves, a Dark Young's ichor, a wolf's fur, soil) that tumble, fall and settle, a ring
// along the ground under a heavy blow, and the thorn burst as spikes that tear up out of the ground in a
// wave from her feet. All pooled: nothing is made after the first frame. Tuning constants at the top.
import * as THREE from 'three';

export type Flecks = 'leaf' | 'ichor' | 'fur' | 'dire' | 'soil';
const PALETTES: Record<Flecks, string[]> = {
  leaf: ['#717e49', '#b0a258', '#88801d', '#d4652a', '#4a5b31'],
  ichor: ['#2b1838', '#5a2a6a', '#9a4ab0', '#d8ff60'],
  fur: ['#6a655c', '#8d877c', '#4a4640', '#b8b0a0'],
  // A black wolf bleeds two bloods: its own red, and the green of what it carries.
  dire: ['#17141a', '#7a1010', '#b01818', '#9cff3a'],
  soil: ['#5c3d22', '#7a5a35', '#3a2716', '#717e49'],
};
/** Pool sizes. */
export const MAX_FLECKS = 320, MAX_SPARKS = 8, MAX_RINGS = 4, THORN_SPIKES = 30;
/** Flecks: gravity (m/s²), air drag (1/s), life (s), size (m). Tuning. */
export const FLECK_GRAVITY = 9, FLECK_DRAG = 1.6, FLECK_LIFE: [number, number] = [0.7, 1.4], FLECK_SIZE: [number, number] = [0.05, 0.13];
/** The slash: its reach (m, inner and outer), half its spread (radians), how long the head takes to cross (s) and the tail lingers (s), its tilt (radians). Tuning. */
export const SLASH_IN = 0.45, SLASH_OUT = 1.95, SLASH_SPREAD = 1.25, SLASH_SWEEP = 0.11, SLASH_FADE = 0.16, SLASH_TILT = 0.32;
/** The thorns: how fast the wave runs out (s to the edge), how long they stand (s), how long to sink (s). Tuning. */
export const THORN_WAVE = 0.16, THORN_HOLD = 0.35, THORN_SINK = 0.3;

interface Fleck { live: boolean; age: number; life: number; size: number; p: THREE.Vector3; v: THREE.Vector3; axis: THREE.Vector3; spin: number; angle: number; grounded: boolean }
interface Spark { s: THREE.Sprite; age: number; life: number; size: number }
interface Ring { m: THREE.Mesh; mat: THREE.MeshBasicMaterial; age: number; life: number; size: number }

function starTexture(): THREE.Texture {
  const n = 64, c = document.createElement('canvas'); c.width = c.height = n; const g = c.getContext('2d')!;
  const glow = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); glow.addColorStop(0, 'rgba(255,255,255,1)'); glow.addColorStop(0.18, 'rgba(255,255,255,0.7)'); glow.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = glow; g.fillRect(0, 0, n, n);
  g.fillStyle = 'white'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 4 : n / 2; g.lineTo(n / 2 + Math.cos(a) * r, n / 2 + Math.sin(a) * r); } g.closePath(); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** The slash's crescent: `aArc` runs 0→1 across it, `aRim` 0 inside → 1 at the edge. Lies in the xz plane, centred on -Z (her front). */
function slashGeometry(): THREE.BufferGeometry {
  const seg = 28, pos: number[] = [], arc: number[] = [], rim: number[] = [], idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const a = i / seg, th = -SLASH_SPREAD + a * SLASH_SPREAD * 2, sx = Math.sin(th), cz = -Math.cos(th);
    // The crescent is fullest in its middle and thins to points at its ends.
    const thick = Math.sin(a * Math.PI) ** 0.6, inner = SLASH_OUT - (SLASH_OUT - SLASH_IN) * thick;
    pos.push(sx * inner, 0, cz * inner, sx * SLASH_OUT, 0, cz * SLASH_OUT); arc.push(a, a); rim.push(0, 1);
    if (i < seg) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aArc', new THREE.Float32BufferAttribute(arc, 1)); g.setAttribute('aRim', new THREE.Float32BufferAttribute(rim, 1)); g.setIndex(idx); return g;
}
const SLASH_VERT = /* glsl */`
attribute float aArc; attribute float aRim; varying float vArc; varying float vRim;
void main() { vArc = aArc; vRim = aRim; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SLASH_FRAG = /* glsl */`
uniform float uHead; uniform float uFade; uniform float uDir; uniform vec3 uCore; uniform vec3 uEdge; uniform vec3 uTail;
varying float vArc; varying float vRim;
void main() {
  float a = uDir > 0.0 ? vArc : 1.0 - vArc;
  float behind = uHead - a;                    // how far behind the head this point is (0 at the head)
  if (behind < 0.0) discard;
  float tail = exp(-behind * 3.2);             // bright at the head, fading back along the arc
  float edge = smoothstep(0.0, 1.0, vRim);     // brightest at the outer rim
  float alpha = tail * (0.25 + 0.75 * edge) * uFade;
  if (alpha < 0.01) discard;
  vec3 col = mix(uTail, mix(uEdge, uCore, smoothstep(0.55, 1.0, edge)), tail);
  gl_FragColor = vec4(col * (0.8 + 0.9 * tail * edge), alpha * 0.85);
  #include <colorspace_fragment>
}`;

export interface HitFx {
  /** A swing: the crescent from her feet `at` (the arc's centre at `lift` m up), facing `yaw`, sweeping from side `side` (±1). */
  slash(at: THREE.Vector3, yaw: number, side: number, lift?: number): void;
  /** A blow lands at `at`, driven along `dir` (horizontal): a star, flecks of `kind`, a ground ring when heavy. */
  blow(at: THREE.Vector3, dir: THREE.Vector3, kind: Flecks, heavy: boolean, count?: number): void;
  /** F3: a star of light alone, in a colour (a foe's eyes flaring in its tell). */
  glint(at: THREE.Vector3, color: string, size?: number): void;
  /** A spray of flecks without the star (soil from the roots, leaves from her when bitten). */
  spray(at: THREE.Vector3, dir: THREE.Vector3, kind: Flecks, count: number, speed?: number): void;
  /** The thorn burst round her feet out to `range`. */
  thorns(at: THREE.Vector3, range: number): void;
  /** A ring along the ground from `at`. */
  ring(at: THREE.Vector3, size: number, color?: string): void;
  update(dt: number, camera: THREE.Camera): void;
  readonly live: number;
  dispose(): void;
}

export function createHitFx(scene: THREE.Scene, ground: (x: number, z: number) => number): HitFx {
  const root = new THREE.Group(); root.name = 'hit-fx'; scene.add(root);
  const rand = (a: number, b: number): number => a + Math.random() * (b - a);
  // The flecks: one instanced diamond, coloured per instance.
  const diamond = new THREE.BufferGeometry(); diamond.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.5, 0.22, 0, 0, 0, 0, -0.5, -0.22, 0, 0], 3)); diamond.setIndex([0, 1, 2, 0, 2, 3]); diamond.computeVertexNormals();
  const fleckMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const flecks = new THREE.InstancedMesh(diamond, fleckMat, MAX_FLECKS); flecks.frustumCulled = false; flecks.count = 0; flecks.name = 'hit-flecks'; root.add(flecks);
  flecks.setColorAt(0, new THREE.Color()); flecks.instanceColor!.setUsage(THREE.DynamicDrawUsage); flecks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const pool: Fleck[] = Array.from({ length: MAX_FLECKS }, () => ({ live: false, age: 0, life: 1, size: 0.1, p: new THREE.Vector3(), v: new THREE.Vector3(), axis: new THREE.Vector3(0, 1, 0), spin: 0, angle: 0, grounded: false }));
  const colours = new Array<THREE.Color>(MAX_FLECKS).fill(null as unknown as THREE.Color).map(() => new THREE.Color());
  let next = 0;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), tmp = new THREE.Vector3();
  function spray(at: THREE.Vector3, dir: THREE.Vector3, kind: Flecks, count: number, speed = 3.2): void {
    const pal = PALETTES[kind];
    for (let i = 0; i < count; i++) {
      const k = next; next = (next + 1) % MAX_FLECKS; const f = pool[k];
      f.live = true; f.age = 0; f.life = rand(FLECK_LIFE[0], FLECK_LIFE[1]); f.size = rand(FLECK_SIZE[0], FLECK_SIZE[1]) * (kind === 'soil' ? 1.2 : 1); f.grounded = false;
      f.p.copy(at).add(tmp.set(rand(-0.08, 0.08), rand(-0.08, 0.08), rand(-0.08, 0.08)));
      // Mostly along the blow, fanned, and upward.
      const s = speed * rand(0.4, 1.15); f.v.set(dir.x * s + rand(-1, 1) * speed * 0.55, rand(0.6, 1.4) * speed * 0.7, dir.z * s + rand(-1, 1) * speed * 0.55);
      f.axis.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(); f.spin = rand(8, 22) * (Math.random() < 0.5 ? -1 : 1); f.angle = rand(0, 6.28);
      colours[k].set(pal[Math.floor(Math.random() * pal.length)]);
      // A Dark Young's eye-coloured flecks glow (the vista's bloom catches them).
      if (kind === 'ichor' && colours[k].g > 0.9) colours[k].multiplyScalar(2.2);
      if (kind === 'dire' && colours[k].g > 0.9) colours[k].multiplyScalar(2.2);
    }
  }
  // The stars of light.
  const star = starTexture();
  const sparks: Spark[] = Array.from({ length: MAX_SPARKS }, () => { const mat = new THREE.SpriteMaterial({ map: star, color: new THREE.Color(1.5, 1.45, 1.1), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }); const s = new THREE.Sprite(mat); s.visible = false; s.renderOrder = 5; root.add(s); return { s, age: 1, life: 0, size: 1 }; });
  let nextSpark = 0;
  // The ground rings.
  const ringGeo = new THREE.RingGeometry(0.82, 1, 48); ringGeo.rotateX(-Math.PI / 2);
  const rings: Ring[] = Array.from({ length: MAX_RINGS }, () => { const mat = new THREE.MeshBasicMaterial({ color: '#f4f0c8', transparent: true, depthWrite: false, side: THREE.DoubleSide }); const m = new THREE.Mesh(ringGeo, mat); m.visible = false; m.renderOrder = 4; root.add(m); return { m, mat, age: 1, life: 0, size: 1 }; });
  let nextRing = 0;
  function ring(at: THREE.Vector3, size: number, color = '#f4f0c8'): void { const r = rings[nextRing]; nextRing = (nextRing + 1) % MAX_RINGS; r.age = 0; r.life = 0.38; r.size = size; r.mat.color.set(color); r.m.position.set(at.x, ground(at.x, at.z) + 0.06, at.z); r.m.visible = true; }
  const sparkWhite = new THREE.Color(1.5, 1.45, 1.1);
  function glint(at: THREE.Vector3, color: string, size = 0.7): void { const s = sparks[nextSpark]; nextSpark = (nextSpark + 1) % MAX_SPARKS; s.age = 0; s.life = 0.22; s.size = size; s.s.position.copy(at); s.s.material.color.set(color).multiplyScalar(2.2); s.s.material.rotation = Math.random() * Math.PI; s.s.visible = true; }
  function blow(at: THREE.Vector3, dir: THREE.Vector3, kind: Flecks, heavy: boolean, count = heavy ? 26 : 14): void {
    const s = sparks[nextSpark]; nextSpark = (nextSpark + 1) % MAX_SPARKS; s.s.material.color.copy(sparkWhite); s.age = 0; s.life = heavy ? 0.16 : 0.11; s.size = heavy ? 0.85 : 0.55; s.s.position.copy(at); s.s.material.rotation = Math.random() * Math.PI; s.s.visible = true;
    spray(at, dir, kind, count, heavy ? 4.2 : 3.2); spray(at, dir, 'leaf', Math.round(count * 0.35), heavy ? 3.4 : 2.6);
    if (heavy) ring(at, 1.6);
  }
  // The slash.
  const slashU = { uHead: { value: 0 }, uFade: { value: 0 }, uDir: { value: 1 }, uCore: { value: new THREE.Color('#ecffb8') }, uEdge: { value: new THREE.Color('#9fd650') }, uTail: { value: new THREE.Color('#d4652a') } };
  const slashMat = new THREE.ShaderMaterial({ uniforms: slashU, vertexShader: SLASH_VERT, fragmentShader: SLASH_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const slashPivot = new THREE.Group(), slashMesh = new THREE.Mesh(slashGeometry(), slashMat); slashMesh.renderOrder = 6; slashMesh.frustumCulled = false; slashPivot.add(slashMesh); slashPivot.visible = false; root.add(slashPivot);
  let slashAge = 1;
  function slash(at: THREE.Vector3, yaw: number, side: number, lift = 0.5): void {
    slashPivot.position.set(at.x, at.y + lift, at.z); slashPivot.rotation.set(0, yaw, 0); slashMesh.rotation.set(0, 0, side * SLASH_TILT);
    slashU.uDir.value = side; slashAge = 0; slashPivot.visible = true;
  }
  // The thorns: cones with brown bases and green tips, instanced, in two rings.
  const cone = new THREE.ConeGeometry(1, 1, 5, 1); cone.translate(0, 0.5, 0);
  { const p = cone.attributes.position, col: number[] = [], base = new THREE.Color('#4a2c18'), tip = new THREE.Color('#b6d26a'), c = new THREE.Color(); for (let i = 0; i < p.count; i++) { c.copy(base).lerp(tip, Math.max(0, p.getY(i)) ** 1.5); col.push(c.r, c.g, c.b); } cone.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  const thornMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const thornMesh = new THREE.InstancedMesh(cone, thornMat, THORN_SPIKES); thornMesh.frustumCulled = false; thornMesh.count = 0; thornMesh.name = 'hit-thorns'; thornMesh.castShadow = true; root.add(thornMesh);
  const spikes = Array.from({ length: THORN_SPIKES }, (_, i) => { const inner = i < THORN_SPIKES * 0.45; return { a: (i / (inner ? THORN_SPIKES * 0.45 : THORN_SPIKES * 0.55)) * Math.PI * 2 + (inner ? 0 : 0.2) + rand(-0.12, 0.12), r: inner ? rand(0.45, 0.6) : rand(0.85, 1), h: rand(0.6, 1.1) * (inner ? 0.75 : 1), w: rand(0.08, 0.13), lean: rand(0.25, 0.55) }; });
  const thorn = { at: new THREE.Vector3(), range: 3, age: 99 };
  function thorns(at: THREE.Vector3, range: number): void {
    thorn.at.copy(at); thorn.range = range; thorn.age = 0;
    for (const s of spikes) { s.a += rand(-0.3, 0.3); }
    // Soil thrown up round the ring.
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; tmp.set(at.x + Math.cos(a) * range * 0.7, 0, at.z + Math.sin(a) * range * 0.7); tmp.y = ground(tmp.x, tmp.z) + 0.1; spray(tmp, new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), 'soil', 3, 2.6); }
    ring(at, range * 1.05, '#d9e8a0');
  }
  let live = 0;
  function update(dt: number, camera: THREE.Camera): void {
    // Flecks.
    let n = 0;
    for (let k = 0; k < MAX_FLECKS; k++) {
      const f = pool[k]; if (!f.live) continue; f.age += dt; if (f.age >= f.life) { f.live = false; continue; }
      if (!f.grounded) {
        f.v.y -= FLECK_GRAVITY * dt; const drag = Math.exp(-FLECK_DRAG * dt); f.v.multiplyScalar(drag); f.p.addScaledVector(f.v, dt); f.angle += f.spin * dt;
        const gy = ground(f.p.x, f.p.z) + 0.01; if (f.p.y < gy) { f.p.y = gy; if (f.v.y < -1.5) { f.v.y *= -0.25; f.v.x *= 0.5; f.v.z *= 0.5; f.spin *= 0.4; } else { f.grounded = true; f.axis.set(1, 0, 0); f.angle = Math.PI / 2 * 0.0; } }
      }
      const shrink = f.age > f.life * 0.7 ? 1 - (f.age - f.life * 0.7) / (f.life * 0.3) : 1;
      if (f.grounded) q.setFromAxisAngle(tmp.set(0, 1, 0), f.spin); else q.setFromAxisAngle(f.axis, f.angle);
      sc.setScalar(f.size * shrink); m4.compose(f.p, q, sc); flecks.setMatrixAt(n, m4); flecks.setColorAt(n, colours[k]); n++;
    }
    flecks.count = n; if (n) { flecks.instanceMatrix.needsUpdate = true; flecks.instanceColor!.needsUpdate = true; }
    // Stars.
    for (const s of sparks) { if (!s.s.visible) continue; s.age += dt; const k = s.age / s.life; if (k >= 1) { s.s.visible = false; continue; } const grow = Math.min(1, k * 4), fade = 1 - Math.max(0, (k - 0.3) / 0.7); s.s.scale.setScalar(s.size * (0.4 + grow * 0.8) * (0.6 + fade * 0.4)); s.s.material.opacity = fade; }
    // Rings.
    for (const r of rings) { if (!r.m.visible) continue; r.age += dt; const k = r.age / r.life; if (k >= 1) { r.m.visible = false; continue; } const e = 1 - (1 - k) ** 3; r.m.scale.setScalar(0.25 + e * r.size); r.mat.opacity = 0.75 * (1 - k); }
    // The slash.
    if (slashPivot.visible) { slashAge += dt; slashU.uHead.value = Math.min(1.6, slashAge / SLASH_SWEEP); slashU.uFade.value = slashAge < SLASH_SWEEP ? 1 : Math.max(0, 1 - (slashAge - SLASH_SWEEP) / SLASH_FADE); if (slashU.uFade.value <= 0) slashPivot.visible = false; }
    // The thorns.
    if (thorn.age < THORN_WAVE + THORN_HOLD + THORN_SINK + 0.2) {
      thorn.age += dt; let m = 0;
      for (const s of spikes) {
        const start = s.r * THORN_WAVE, t = thorn.age - start; if (t <= 0) continue;
        const rise = Math.min(1, t / 0.07), over = rise < 1 ? rise : 1 + Math.sin(Math.min(1, (t - 0.07) / 0.12) * Math.PI) * 0.12;
        const sink = Math.max(0, (thorn.age - THORN_WAVE - THORN_HOLD) / THORN_SINK); if (sink >= 1) continue;
        const hgt = s.h * over * (1 - sink * sink), x = thorn.at.x + Math.cos(s.a) * s.r * thorn.range, z = thorn.at.z + Math.sin(s.a) * s.r * thorn.range;
        tmp.set(x, ground(x, z) - 0.05, z); q.setFromEuler(new THREE.Euler(0, -s.a, -s.lean, 'YXZ')); sc.set(s.w, Math.max(0.001, hgt), s.w); m4.compose(tmp, q, sc); thornMesh.setMatrixAt(m++, m4);
      }
      thornMesh.count = m; thornMesh.instanceMatrix.needsUpdate = true;
    } else thornMesh.count = 0;
    live = n + sparks.filter(s => s.s.visible).length + (slashPivot.visible ? 1 : 0) + thornMesh.count;
    void camera;
  }
  function dispose(): void { root.removeFromParent(); diamond.dispose(); fleckMat.dispose(); star.dispose(); for (const s of sparks) s.s.material.dispose(); ringGeo.dispose(); for (const r of rings) r.mat.dispose(); slashMesh.geometry.dispose(); slashMat.dispose(); cone.dispose(); thornMat.dispose(); flecks.dispose(); thornMesh.dispose(); }
  return { slash, blow, glint, spray, thorns, ring, update, get live() { return live; }, dispose };
}
