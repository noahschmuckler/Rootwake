// The village under the vista's look (Noah, 2026-10-13: "vista look, layout kept"). Nothing of the
// village's game changes: its places, its model, its figures and its rules are where they were. What
// changes is the land and the light: the village's gentle hills, with eroded mountains rising past the
// farthest den as the horizon, drawn by the vista's terrain, grass, trees, sky, haze, shadows and grade;
// a sun that crosses the sky with the village's clock and a moon by night. The chunks keep their trees
// (colliders, roots, climbing) and stop drawing them and the ground; the vista draws both.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { TERRAIN_STEP, type Terrain } from './worldTerrain';
import { generate, heightAt, gradientNoise, ridged, fbm, type Land, type Tree as VTree } from './vistaTerrain';
import { buildVista, QUALITIES, CASTER_LAYER, sunDirection, type Hour, type Quality, type VistaWorld } from './vistaWorld';
import { places, dens, ruins, warrens, wallows, ownWarrens, moot, FOREST_RADIUS as DARK_RADIUS, KARST_AT } from './overworldModel';
import { convergences, beyond, noise, CHUNK } from './chunkModel';
import { FOREST_RADIUS as KARST_FOREST } from './karstFlowModel';
import { TREES, type Tree } from './villageModel';

// ── the land ─────────────────────────────────────────────────────────────
/** The squarish norm the mountains rise by: the dens lie on a square grid, so the range follows a rounded square. */
const norm4 = (x: number, z: number): number => Math.sqrt(Math.sqrt(x ** 4 + z ** 4));
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** Tuning: clear ground past the farthest place before the foothills start (m), the climb to full height (m), the samples per side of the map. */
export const MOUNTAIN_CLEAR = 260, MOUNTAIN_RISE = 650, VILLAGE_LAND_N = 1025;
/** Tuning: erosion droplets over the mountain belt (the load's main cost on a phone). */
export const VILLAGE_DROPLETS = 45000;

export interface VillageLand { terrain: Terrain; land: Land; edge: number; ms: number }
/** The village's land with mountains round it, as the village's Terrain (every height the game reads) and the vista's Land (what is drawn). */
export function villageLand(seed: number, base: Terrain): VillageLand {
  const t0 = performance.now();
  const spots = [...places(seed), ...dens(seed), ...ruins(seed), ...warrens(seed), ...wallows(seed), ...ownWarrens(seed), moot(seed), ...convergences(seed), KARST_AT];
  const edge = Math.max(...spots.map(p => norm4(p.x, p.z))) + MOUNTAIN_CLEAR;
  const n1 = gradientNoise(seed * 11 + 1), n2 = gradientNoise(seed * 11 + 2), n3 = gradientNoise(seed * 11 + 3);
  const warp = (x: number, z: number) => 100 * fbm(n2, x * 0.0012, z * 0.0012, 3);
  /** How far into the mountains (m past the edge), warped so the range is not a ruled square. */
  const into = (x: number, z: number) => norm4(x, z) + warp(x, z) - edge;
  const rise = (x: number, z: number): number => {
    const d = into(x, z); if (d <= 0) return 0;
    const m = smooth(0, MOUNTAIN_RISE, d), r = ridged(n1, x * 0.0016, z * 0.0016, 6);
    return m ** 1.25 * (50 + 520 * r) + m * fbm(n3, x * 0.004, z * 0.004, 4) * 18;
  };
  const vtx = (x: number, z: number) => base.vertex(x, z) + rise(x, z);
  /** Where the eroded grid is the ground (the mountains); inside it the village's own triangulated relief is. */
  const gridOwns = (x: number, z: number) => smooth(-40, 160, into(x, z));
  const half = Math.ceil((edge + MOUNTAIN_RISE + 450) / 64) * 64;
  const tri = (x: number, z: number): number => {
    const ax = Math.floor(x / TERRAIN_STEP) * TERRAIN_STEP, az = Math.floor(z / TERRAIN_STEP) * TERRAIN_STEP, u = (x - ax) / TERRAIN_STEP, v = (z - az) / TERRAIN_STEP;
    const b = vtx(ax, az + TERRAIN_STEP), d = vtx(ax + TERRAIN_STEP, az);
    return u + v <= 1 ? vtx(ax, az) * (1 - u - v) + d * u + b * v : vtx(ax + TERRAIN_STEP, az + TERRAIN_STEP) * (u + v - 1) + b * (1 - u) + d * (1 - v);
  };
  let land: Land | null = null;
  const height = (x: number, z: number): number => { const m = land ? gridOwns(x, z) : 0; if (m <= 0) return tri(x, z); const g = heightAt(land!, x, z); return m >= 1 ? g : tri(x, z) * (1 - m) + g * m; };
  land = generate(seed, { droplets: VILLAGE_DROPLETS }, { size: half * 2, n: VILLAGE_LAND_N, shape: { base: vtx, seed }, waterY: -Infinity, snowY: 340, erodeMask: gridOwns, surface: undefined });
  // The near mesh draws the walked surface, a hair lower on the karst's island, whose own forest floor lies over it.
  land.surface = (x, z) => height(x, z) - 0.22 * (1 - smooth(KARST_FOREST + 20, KARST_FOREST + 34, Math.hypot(x - KARST_AT.x, z - KARST_AT.z)));
  const normal = (x: number, z: number): [number, number, number] => { const dx = height(x - 1, z) - height(x + 1, z), dz = height(x, z - 1) - height(x, z + 1), l = Math.hypot(dx, 2, dz); return [dx / l, 2 / l, dz / l]; };
  const terrain: Terrain = { seed, vertex: (x, z) => (gridOwns(x, z) > 0 ? height(x, z) : vtx(x, z)), height, colour: base.colour, normal };
  return { terrain, land, edge, ms: performance.now() - t0 };
}

// ── the woods, the dark forest and the blight, as a tint on the land ───────
/** Tuning: linear colours laid over the vista's grass, and how much. */
const WOOD = [0.06, 0.13, 0.04, 0.35], DARK = [0.05, 0.035, 0.07, 0.9], BLIGHT = [0.035, 0.012, 0.045, 0.95], MEADOW = [0.1, 0.26, 0.05, 0.7];
export function groundTint(land: Land, seed: number, blighted: (x: number, z: number) => boolean): Uint8Array {
  const { n, cell, half } = land, out = new Uint8Array(n * n * 4), lair = places(seed).find(p => p.id === 'lair')!;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = i * cell - half, z = j * cell - half, b = Math.min(1, beyond(x, z, seed) * 1.6), k = (j * n + i) * 4;
    // The villages' meadows are kept: a lush green, whatever pale patch of the vista's grass they fall in.
    if (b < 1) { out[k] = MEADOW[0] * 255; out[k + 1] = MEADOW[1] * 255; out[k + 2] = MEADOW[2] * 255; out[k + 3] = MEADOW[3] * (1 - b) * 255; }
    if (b <= 0) continue;
    const dark = 1 - smooth(DARK_RADIUS - 10, DARK_RADIUS + 10, Math.hypot(x - lair.x, z - lair.z));
    const c = blighted(x, z) ? BLIGHT : dark > 0.5 ? DARK : noise(x, z, 110, seed + 3) > 0.58 ? null : WOOD; if (!c) continue;
    out[k] = c[0] * 255; out[k + 1] = c[1] * 255; out[k + 2] = c[2] * 255; out[k + 3] = c[3] * b * 255;
  }
  return out;
}

// ── the trees ────────────────────────────────────────────────────────────
/** Every tree the village knows, as the vista draws it: the chunks' (all of them, built or not) and each village's own wood. Kind 5 the village tree, 6 in the dark forest, 7 blighted. */
export function villageTrees(land: Land, edge: number, terrain: Terrain, treesOf: (cx: number, cz: number) => Tree[], origins: { x: number; z: number }[], dark: (x: number, z: number) => boolean, blighted: (x: number, z: number) => boolean): VTree[] {
  const out: VTree[] = [], reach = Math.ceil(edge / CHUNK);
  const add = (x: number, z: number, size: number, id: number) => out.push({ x, z, y: terrain.height(x, z), kind: blighted(x, z) ? 7 : dark(x, z) ? 6 : 5, scale: size, rot: (id * 2.399963) % (Math.PI * 2) });
  for (let cz = -reach; cz <= reach; cz++) for (let cx = -reach; cx <= reach; cx++) for (const t of treesOf(cx, cz)) if (norm4(t.x, t.z) < edge - 40) add(t.x, t.z, t.size, t.id);
  for (const o of origins) for (const t of TREES) add(t.x + o.x, t.z + o.z, t.size, t.id + o.x * 7 + o.z * 13);
  void land; return out;
}

// ── the village's day as the vista's hours ──────────────────────────────
type Key = Omit<Hour, 'name' | 'elevation' | 'azimuth'> & { at: number };
/** Tuning: the sky at clock hours through the village's day (dawn 05:30, dusk 19:30); between them every value blends. */
const KEYS: Key[] = [
  { at: 4.6, sun: '#9fb4e0', sunI: 0.35, zenith: '#0a1228', horizon: '#26324e', ambSky: '#3a4a78', ambGround: '#141822', ambI: 0.55, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.35, exposure: 1.4, stars: 1 },
  { at: 5.8, sun: '#ff9a6a', sunI: 1.3, zenith: '#3a5a9a', horizon: '#e8a888', ambSky: '#8a9cc8', ambGround: '#4a4440', ambI: 0.65, haze: 0.0012, hazeFall: 1 / 80, cloud: 0.4, exposure: 1.15, stars: 0.2 },
  { at: 7.5, sun: '#ffd9a8', sunI: 2.1, zenith: '#5d8fd0', horizon: '#d8dde0', ambSky: '#b4cbea', ambGround: '#7a7658', ambI: 0.85, haze: 0.0011, hazeFall: 1 / 90, cloud: 0.4, exposure: 1.0, stars: 0 },
  { at: 12.5, sun: '#fff4e0', sunI: 2.0, zenith: '#3f7fd8', horizon: '#c8def0', ambSky: '#b0cdf2', ambGround: '#7c8656', ambI: 0.9, haze: 0.00042, hazeFall: 1 / 260, cloud: 0.55, exposure: 0.95, stars: 0 },
  { at: 17.6, sun: '#ffc590', sunI: 2.0, zenith: '#5a7bbf', horizon: '#f2c9a0', ambSky: '#aab8de', ambGround: '#6e5c48', ambI: 0.88, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.5, exposure: 1.05, stars: 0 },
  { at: 19.3, sun: '#ff7a4a', sunI: 1.5, zenith: '#2c3a6e', horizon: '#e79a7c', ambSky: '#7680b0', ambGround: '#443a44', ambI: 0.8, haze: 0.0007, hazeFall: 1 / 200, cloud: 0.45, exposure: 1.2, stars: 0.15 },
  { at: 20.4, sun: '#9fb4e0', sunI: 0.35, zenith: '#0a1228', horizon: '#26324e', ambSky: '#3a4a78', ambGround: '#141822', ambI: 0.55, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.35, exposure: 1.4, stars: 1 },
];
const mixHex = (a: string, b: string, t: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();
/** The hour at a clock time (0..24): the sun from the east at 05:30 through the south to the west at 19:30, then the moon. */
export function hourAtClock(h: number): Hour {
  const hh = ((h % 24) + 24) % 24, ks = [...KEYS, { ...KEYS[0], at: KEYS[0].at + 24 }], x = hh < KEYS[0].at ? hh + 24 : hh;
  let i = 0; while (i < ks.length - 2 && x >= ks[i + 1].at) i++;
  const a = ks[i], b = ks[i + 1], t = Math.min(1, Math.max(0, (x - a.at) / (b.at - a.at)));
  const num = (k: keyof Key) => (a[k] as number) * (1 - t) + (b[k] as number) * t, col = (k: keyof Key) => mixHex(a[k] as string, b[k] as string, t);
  const day = hh >= 5.5 && hh <= 19.5, f = day ? (hh - 5.5) / 14 : (((hh - 19.5) % 24) + 24) % 24 / 10;
  const elevation = Math.max(3, (day ? 60 : 38) * Math.sin(Math.PI * Math.min(1, f))), azimuth = 90 + 180 * Math.min(1, f);
  return { name: day ? 'Day' : 'Night', elevation, azimuth, sun: col('sun'), sunI: num('sunI'), zenith: col('zenith'), horizon: col('horizon'), ambSky: col('ambSky'), ambGround: col('ambGround'), ambI: num('ambI'), haze: num('haze'), hazeFall: num('hazeFall'), cloud: num('cloud'), exposure: num('exposure'), stars: num('stars') };
}

// ── the look ─────────────────────────────────────────────────────────────
export interface LookFrame { clockHour: number; feet: THREE.Vector3; under: number; interior: boolean; gloom: number; hidden?: boolean }
export interface VillageLook {
  world: VistaWorld; quality: Quality;
  frame(f: LookFrame): void;
  render(): void;
  /** Where grass gives way to the village (its paths, floors and fields), drawn from above; again when huts are built. */
  refreshClearing(): void;
  refreshTrees(): void;
  refreshGround(): void;
  setQuality(q: Quality): void;
}
export interface LookInputs {
  renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight;
  vl: VillageLand; seed: number;
  treesOf: (cx: number, cz: number) => Tree[]; villages: () => { root: THREE.Object3D; x: number; z: number }[];
  dark: (x: number, z: number) => boolean; blighted: (x: number, z: number) => boolean;
  quality?: Quality;
}
/** Tuning: the grade after tone mapping, and bloom only on what is brighter than sunlit ground. */
const GRADE = { saturation: 1.1, vignette: 0.5 }, BLOOM = { strength: 0.35, radius: 0.5, threshold: 2.4 };
/** Tuning: the side of the square drawn from above at each village to clear its grass (m), and its texels. */
const CLEAR_SIDE = 220, CLEAR_T = 512;
/** Tuning: grass height (m): lower than the vista's, so a hobbit (about half a metre) stands above it. */
const BLADE_H = 0.22;
/** Tuning: the village's woods are dense: full trees within this share of the tier's radius, none drawn past TREE_REACH m (the haze has them). */
const NEAR_TREES = 0.5, TREE_REACH = 850;
export function createVillageLook(inp: LookInputs): VillageLook {
  const { renderer, scene, camera, sun, hemi, vl, seed } = inp;
  const coarse = matchMedia('(pointer: coarse)').matches, qName = new URLSearchParams(location.search).get('q')?.toLowerCase();
  let quality = inp.quality ?? QUALITIES.find(q => q.name.toLowerCase() === qName) ?? QUALITIES[coarse ? 1 : 2];
  const trees = () => villageTrees(vl.land, vl.edge, vl.terrain, inp.treesOf, inp.villages().map(v => ({ x: v.x, z: v.z })), inp.dark, inp.blighted);
  const world = buildVista(scene, vl.land, trees(), [], quality, { hazeBase: 0, ground: groundTint(vl.land, seed, inp.blighted), fine: vl.terrain.height, bladeH: BLADE_H, nearTreesScale: NEAR_TREES, treeReach: TREE_REACH });
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.05; sun.shadow.camera.near = 1; sun.shadow.camera.far = 900; sun.shadow.camera.layers.enable(CASTER_LAYER); scene.add(sun.target);

  // ── post ──
  const target = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), BLOOM.strength, BLOOM.radius, BLOOM.threshold); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uSat: { value: GRADE.saturation }, uVig: { value: GRADE.vignette } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float uSat; uniform float uVig; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float l = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = mix(vec3(l), c.rgb, uSat); vec2 d = vUv - 0.5; c.rgb *= 1.0 - dot(d, d) * uVig; gl_FragColor = c; }',
  }));
  // ?hud=1: what it costs, top centre (frame rate, triangles and draw calls over every pass).
  const hud = new URLSearchParams(location.search).get('hud') === '1' ? document.body.appendChild(Object.assign(document.createElement('div'), { id: 'look-hud' })) : null;
  if (hud) { hud.style.cssText = 'position:fixed;z-index:40;top:calc(env(safe-area-inset-top,0px) + 44px);left:50%;transform:translateX(-50%);padding:4px 8px;border-radius:6px;background:#0b1918aa;color:#eef6f0;font:11px/1.3 ui-monospace,Menlo,monospace;white-space:pre;pointer-events:none'; renderer.info.autoReset = false; }
  let hudFrames = 0, hudMs = 0, hudLast = performance.now(), hudClock = 0;
  const resize = () => { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(innerWidth, innerHeight); };
  addEventListener('resize', resize); resize();

  // ── the clearing masks ──
  const clearRTs: THREE.WebGLRenderTarget[] = [], white = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  function refreshClearing(): void {
    const vs = inp.villages().slice(0, 3), saved = scene.children.map(o => o.visible), bg = scene.background, fog = scene.fog, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha();
    const cam = new THREE.OrthographicCamera(-CLEAR_SIDE / 2, CLEAR_SIDE / 2, CLEAR_SIDE / 2, -CLEAR_SIDE / 2, 1, 600); cam.up.set(0, 0, -1);
    scene.background = null; scene.fog = null; scene.overrideMaterial = white; renderer.setClearColor('#000000', 1);
    vs.forEach((v, i) => {
      const rt = clearRTs[i] ??= new THREE.WebGLRenderTarget(CLEAR_T, CLEAR_T);
      scene.children.forEach(o => { o.visible = o === v.root; });
      cam.position.set(v.x, 300, v.z); cam.lookAt(v.x, 0, v.z); cam.updateMatrixWorld();
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, cam);
      world.setClear(i, rt.texture, v.x - CLEAR_SIDE / 2, v.z - CLEAR_SIDE / 2, CLEAR_SIDE);
    });
    renderer.setRenderTarget(null); scene.overrideMaterial = null; scene.children.forEach((o, i) => { o.visible = saved[i]; }); scene.background = bg; scene.fog = fog; renderer.setClearColor(cc, ca);
  }

  // ── each frame ──
  const gloomColour = new THREE.Color('#1a1020'), fogColour = new THREE.Color(), dir = new THREE.Vector3();
  let lastClock = -1;
  function setQuality(q: Quality): void {
    quality = q; world.setQuality(q);
    const shadows = q.shadow > 0;
    if (renderer.shadowMap.enabled !== shadows) { renderer.shadowMap.enabled = shadows; scene.traverse(o => { const m = (o as THREE.Mesh).material; if (m) (Array.isArray(m) ? m : [m]).forEach(x => (x.needsUpdate = true)); }); }
    sun.castShadow = shadows;
    if (shadows) { sun.shadow.mapSize.set(q.shadow, q.shadow); sun.shadow.map?.dispose(); sun.shadow.map = null; const c = sun.shadow.camera; c.left = c.bottom = -q.shadowBox; c.right = c.top = q.shadowBox; c.updateProjectionMatrix(); }
    bloom.enabled = q.bloom;
  }
  setQuality(quality);
  return {
    world, get quality() { return quality; }, setQuality, refreshClearing,
    refreshTrees() { world.setTrees(trees()); },
    refreshGround() { world.setGround(groundTint(vl.land, seed, inp.blighted)); },
    frame(f) {
      // Inside (the deep, a den, the karst's cavern) the land is not drawn: the village's own dark fog holds.
      const show = !f.interior && !f.hidden; world.root.visible = show;
      if (!show) return;
      const h = hourAtClock(f.clockHour);
      // A moving sun rebakes the mountains' shadows over the next frames; a jump (a skipped hour) at once.
      world.setHour(h, lastClock < 0 || Math.abs(f.clockHour - lastClock) > 0.5); lastClock = f.clockHour;
      renderer.toneMappingExposure = h.exposure;
      world.setSoil(f.under, f.feet.x, f.feet.z);
      world.setGloom(gloomColour, Math.min(1, f.gloom * 0.9), 0.02 + f.gloom * 0.03);
      world.update(camera, performance.now() / 1000);
      // The village's figures and houses: the same sun (dimmed in a mountain's baked shadow), shadows near her, fog of the hour's horizon.
      dir.copy(sunDirection(h)); const lit = world.sunAt(f.feet.x, f.feet.z);
      sun.color.set(h.sun); sun.intensity = h.sunI * 0.9 * (0.25 + 0.75 * lit) * (1 - f.gloom * 0.6); sun.target.position.copy(f.feet); sun.position.copy(f.feet).addScaledVector(dir, 400);
      hemi.color.set(h.ambSky); hemi.groundColor.set(h.ambGround); hemi.intensity = h.ambI * 2.2 * (1 - f.gloom * 0.5);
      fogColour.set(h.horizon).lerp(gloomColour, f.gloom * 0.8); scene.background = fogColour.clone();
      scene.fog = new THREE.FogExp2(fogColour.getHex(), h.haze * 1.3 + f.gloom * 0.03);
      if (camera.far !== 9000) { camera.far = 9000; camera.updateProjectionMatrix(); }
    },
    render() {
      composer.render();
      if (hud) {
        const now = performance.now(), dt = now - hudLast; hudLast = now; hudFrames++; hudMs += dt; hudClock += dt;
        if (hudClock > 500) { const i = renderer.info.render, ms = hudMs / hudFrames; hud.textContent = `${(1000 / ms).toFixed(0)} fps ${ms.toFixed(1)} ms · ${quality.name}\n${(i.triangles / 1000).toFixed(0)}k tris · ${i.calls} calls`; hudFrames = 0; hudMs = 0; hudClock = 0; }
        renderer.info.reset();
      }
    },
  };
}
