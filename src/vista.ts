// The Vista: a graphics study. How far a phone's browser can take the look, after Breath of the
// Wild: an eroded valley two kilometres across with mountains to the horizon, a lake, wind-blown
// grass, a forest, one painted sky. Hulda walks it on the shared player and mobility. Four hours,
// three quality tiers, postcard viewpoints, a photo mode, and a readout of what it costs.
// ?seed= ?hour=0..3 ?q=low|medium|high ?card=0..3 ?dpr= (fixed render scale) ?photo=1 ?intro=0
import './vista.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { supportAt, type TraversalWorld } from './mobility';
import { generate, placeTrees, placeRocks, postcards, heightAt, WATER_Y, HALF, type Postcard } from './vistaTerrain';
import { buildVista, HOURS, QUALITIES, CASTER_LAYER, sunDirection, type Hour, type Quality } from './vistaWorld';

const query = new URLSearchParams(location.search);
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const frameYield = () => new Promise<void>(r => requestAnimationFrame(() => setTimeout(r, 0)));
async function step(text: string): Promise<void> { el('load-step').textContent = text; await frameYield(); }
/** Tuning: the grade after tone mapping — a little more saturation and a soft vignette. */
const GRADE = { saturation: 1.12, vignette: 0.55 };
/** Tuning: bloom on what is brighter than sunlit ground (the sun, its glow in the sky, glints on the lake), never on the ground itself. */
const BLOOM = { strength: 0.4, radius: 0.5, threshold: 2.4 };
/** Tuning: the render scale is nudged toward a frame under SLOW_MS and up while frames are under FAST_MS. */
const SLOW_MS = 1000 / 28, FAST_MS = 1000 / 50, ADAPT_S = 1.5;

async function main(): Promise<void> {
  const seed = Number(query.get('seed') ?? 1) || 1;
  await step('Raising the land and letting the rain run over it…');
  const land = generate(seed);
  await step('Seeding the forest…');
  const trees = placeTrees(land), rocks = placeRocks(land), cards = postcards(land);
  await step('Lighting the valley…');

  const coarse = matchMedia('(pointer: coarse)').matches;
  const qName = (query.get('q') ?? '').toLowerCase();
  let quality: Quality = QUALITIES.find(q => q.name.toLowerCase() === qName) ?? QUALITIES[coarse ? 1 : 2];
  let hourIndex = Math.min(HOURS.length - 1, Math.max(0, Number(query.get('hour') ?? 2) || 0)), hour: Hour = HOURS[hourIndex];

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.15, 9000); scene.add(camera);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  document.body.prepend(renderer.domElement);
  const fixedDpr = query.has('dpr') ? Number(query.get('dpr')) : null;
  let dpr = fixedDpr ?? Math.min(devicePixelRatio, (quality.dprMin + quality.dprMax) / 2);

  // Hulda's own light: the hour's sun (with the near shadow map) and sky. The land lights itself in its shaders.
  const hemi = new THREE.HemisphereLight('#bcd4f0', '#6a6a4a', 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffffff', 2); scene.add(sun, sun.target);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.05; sun.shadow.camera.near = 1; sun.shadow.camera.far = 900; sun.shadow.camera.layers.enable(CASTER_LAYER);

  const world = buildVista(scene, land, trees, rocks, quality);

  // ── post: bloom, then tone mapping and sRGB, then the grade ──
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
  function resize(): void {
    renderer.setPixelRatio(dpr); renderer.setSize(innerWidth, innerHeight);
    composer.setPixelRatio(dpr); composer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);

  // ── the player ──
  let colliders = world.colliders();
  const groundWorld: TraversalWorld = {
    surfacesAt: (x, z) => [heightAt(land, x, z)],
    canOccupy: (p, radius) => {
      const h = heightAt(land, p.x, p.z);
      return p.y >= h - 0.05 && h > WATER_Y - 0.3 && Math.abs(p.x) < HALF - 40 && Math.abs(p.z) < HALF - 40 && !colliders.some(c => 'x' in c && Math.hypot(p.x - c.x, p.z - c.z) < c.radius + radius);
    },
  };
  const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third';
  player.traversalWorld = groundWorld; player.poweredLegs = true;
  for (const child of [...player.avatar.children]) player.avatar.remove(child);
  installMobilityControls(player);
  const presentation = createHuldaPresentation(scene, new THREE.Group(), new THREE.Group());
  const clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
  if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => presentation.setClips(clips), e => console.warn('Hulda clips', e));

  // ── controls ──
  const toast = el('toast'); let toastTimer = 0;
  function say(text: string): void { toast.textContent = text; toast.classList.add('on'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('on'), 1800); }
  function setHour(i: number): void {
    hourIndex = (i + HOURS.length) % HOURS.length; hour = HOURS[hourIndex];
    world.setHour(hour); renderer.toneMappingExposure = hour.exposure;
    hemi.color.set(hour.ambSky); hemi.groundColor.set(hour.ambGround); hemi.intensity = hour.ambI * 2.2;
    sun.color.set(hour.sun);
  }
  function setQuality(q: Quality): void {
    quality = q; world.setQuality(q); colliders = world.colliders();
    const shadows = q.shadow > 0;
    if (renderer.shadowMap.enabled !== shadows) { renderer.shadowMap.enabled = shadows; scene.traverse(o => { const m = (o as THREE.Mesh).material; if (m) (Array.isArray(m) ? m : [m]).forEach(x => (x.needsUpdate = true)); }); }
    sun.castShadow = shadows;
    if (shadows) { sun.shadow.mapSize.set(q.shadow, q.shadow); sun.shadow.map?.dispose(); sun.shadow.map = null; const c = sun.shadow.camera; c.left = c.bottom = -q.shadowBox; c.right = c.top = q.shadowBox; c.updateProjectionMatrix(); }
    bloom.enabled = q.bloom;
    if (fixedDpr === null) dpr = Math.min(devicePixelRatio, Math.max(q.dprMin, Math.min(q.dprMax, dpr)));
    resize();
  }
  function goCard(i: number): void {
    const c: Postcard = cards[(i + cards.length) % cards.length]; cardIndex = (i + cards.length) % cards.length;
    // The nearest spot the shared motor will stand on, spiralling out from the card's.
    let x = c.x, z = c.z;
    for (let k = 0; k < 400; k++) { const a = k * 2.4, r = Math.sqrt(k) * 0.8; x = c.x + Math.cos(a) * r; z = c.z + Math.sin(a) * r; if (supportAt(groundWorld, x, z) !== null) break; }
    player.teleport(x, z, c.yaw); player.pitch = c.pitch;
    world.update(camera, clock); colliders = world.colliders();
  }
  let cardIndex = Math.max(0, Math.min(cards.length - 1, Number(query.get('card') ?? 0) || 0)), clock = 0;
  el('hour').onclick = () => { setHour(hourIndex + 1); say(hour.name); };
  el('card').onclick = () => { goCard(cardIndex + 1); say(cards[cardIndex].name); };
  el('quality').onclick = () => { setQuality(QUALITIES[(QUALITIES.indexOf(quality) + 1) % QUALITIES.length]); say(`${quality.name} quality`); };
  el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
  el('photo').onclick = () => { document.body.classList.add('photo'); player.cancelInput(); };
  let downAt = { x: 0, y: 0, t: 0 };
  renderer.domElement.addEventListener('pointerdown', e => { downAt = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  renderer.domElement.addEventListener('pointerup', e => { if (document.body.classList.contains('photo') && performance.now() - downAt.t < 300 && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 10) document.body.classList.remove('photo'); });
  if (query.get('photo') === '1') document.body.classList.add('photo');
  const intro = el<HTMLDialogElement>('intro');
  el('help').onclick = () => { player.cancelInput(); intro.showModal(); };
  el('begin').onclick = () => { intro.close(); last = performance.now(); };
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); });

  setHour(hourIndex); setQuality(quality); goCard(cardIndex);
  el('loading').remove();
  if (query.get('intro') !== '0') intro.showModal();

  // ── the frame ──
  const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), hud = el('hud');
  let last = performance.now(), frames = 0, frameMs = 0, statClock = 0, adaptClock = 0, adaptMs = 0, adaptN = 0, sunSeen = 1, castClock = 0;
  const frame = (now: number): void => {
    requestAnimationFrame(frame);
    const raw = now - last, dt = Math.min(0.05, Math.max(0, raw / 1000)); last = now;
    if (document.hidden) return;
    clock += dt; renderer.info.reset();
    player.update(now, colliders, undefined);
    player.applyCamera(camera);
    world.update(camera, clock);
    if (castClock <= 0) { colliders = world.colliders(); castClock = 0.5; scene.getObjectByName('HuldaPresentation')?.traverse(o => { o.castShadow = true; }); } castClock -= dt;
    // Hulda.
    const feet = player.feet(); visualPosition.copy(feet); visualPosition.y += HUMAN_CENTRE;
    let heading = player.yaw; if (player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
    visualRotation.setFromAxisAngle(up, heading);
    presentation.update(dt, 'human', visualPosition, visualRotation, player.motor.speed, heading, player.motor.mode === 'grounded', player.view === 'third');
    player.avatar.visible = false;
    // Her sun: the near shadow map follows her; in a mountain's baked shadow her light dims to the sky's.
    const dir = sunDirection(hour); sunSeen += (world.sunAt(feet.x, feet.z) - sunSeen) * Math.min(1, dt * 3);
    sun.intensity = hour.sunI * 0.9 * sunSeen; sun.target.position.copy(feet); sun.position.copy(feet).addScaledVector(dir, 400);
    composer.render();
    // The readout, and the render scale nudged toward the frame budget.
    frames++; frameMs += raw; statClock += dt; adaptMs += raw; adaptN++; adaptClock += dt;
    if (statClock > 0.5) {
      const i = renderer.info.render, ms = frameMs / frames;
      hud.textContent = `${(1000 / ms).toFixed(0)} fps  ${ms.toFixed(1)} ms\n${quality.name} · scale ${dpr.toFixed(2)}${fixedDpr !== null ? ' (fixed)' : ''}\n${(i.triangles / 1000).toFixed(0)}k tris · ${i.calls} calls\n${hour.name} · ${cards[cardIndex].name}`;
      frames = 0; frameMs = 0; statClock = 0;
    }
    if (adaptClock > ADAPT_S && fixedDpr === null) {
      const ms = adaptMs / adaptN, top = Math.min(devicePixelRatio, quality.dprMax);
      const next = ms > SLOW_MS ? Math.max(quality.dprMin, dpr - 0.1) : ms < FAST_MS ? Math.min(top, dpr + 0.05) : dpr;
      if (Math.abs(next - dpr) > 1e-3) { dpr = next; resize(); }
      adaptClock = 0; adaptMs = 0; adaptN = 0;
    }
  };
  (window as unknown as { __rootwake: unknown }).__rootwake = { THREE, scene, camera, renderer, player, land, world, cards, trees, rocks, setHour, setQuality: (i: number) => setQuality(QUALITIES[i]), goCard, get hour() { return hour; }, get quality() { return quality; }, get dpr() { return dpr; } };
  requestAnimationFrame(frame);
}
main().catch(e => { console.error(e); const s = document.getElementById('load-step'); if (s) s.textContent = `Could not build the vista: ${e}`; });
