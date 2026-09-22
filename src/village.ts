// The village, V0: presence. Hulda walks a meadow among eight hobbits who live by a day's rhythm:
// out of their doors at dawn to the places they keep to, together at the fire at noon, home at
// dusk, asleep at night. They do not see her yet. Twenty real minutes to their day, which passes
// only while the page is open. The question: do figures going in and out of houses on a rhythm
// already read as people living there?
import './village.css';
import * as THREE from 'three';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { buildVillage, relief, HOBBIT_HEIGHT } from './villageWorld';
import { HOBBITS, HOUSES, HOUSE_RADIUS, MEADOW_RADIUS, TICKS_PER_SECOND, DAY_TICKS, freshVillage, parseVillage, serializeVillage, advance, clockOf, phaseAt, daylightAt, everyone, hobbitById, type Village } from './villageModel';
import { MODEL_HEIGHT } from './huldaRig';
import type { TraversalWorld } from './mobility';
const KEY = 'rootwake-village-v1';
let village: Village = freshVillage(1); try { village = parseVillage(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, serializeVillage(village)); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 220); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#eef4e2', '#4d5f48', 2.3); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.3); sun.position.set(-20, 40, 15); scene.add(sun);
const world = buildVillage(scene);
const groundWorld: TraversalWorld = {
  surfacesAt: (x, z) => (Math.hypot(x, z) <= MEADOW_RADIUS ? [relief(x, z)] : []),
  canOccupy: (p, radius) => Math.hypot(p.x, p.z) <= MEADOW_RADIUS && p.y >= relief(p.x, p.z) - 0.03 && !HOUSES.some(h => Math.hypot(p.x - h.x, p.z - h.z) < HOUSE_RADIUS + radius),
};
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third'; player.traversalWorld = groundWorld;
const presentation = createHuldaPresentation(scene, world.figure, world.mass);
const hulda = presentation.hulda;
// Hulda and the hobbits share the skeleton, so the Mixamo clips drive all nine (public/models/README.md).
const query = new URLSearchParams(location.search), clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
let clipStatus: 'none' | 'loading' | 'ready' | 'failed' = clipUrls.length ? 'loading' : 'none', clipError = '';
if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => { presentation.setClips(clips); for (const f of world.figures) f.setClips(clips); clipStatus = 'ready'; }, e => { clipStatus = 'failed'; clipError = String(e); console.warn('clips', e); });
for (const child of [...player.avatar.children]) player.avatar.remove(child);
player.teleport(0, -16, Math.PI); player.pitch = 0.08; installMobilityControls(player);
let time = 0, last = performance.now(), tickBank = 0, saveClock = 0;
// Each hobbit's shown position eases after the model's tick, so a tick's step reads as walking, not a jump.
const shown = HOBBITS.map((h, i) => { const s = village.hobbits[i]; return { x: s.x, z: s.z, heading: s.heading, speed: 0, label: document.createElement('div'), bubble: document.createElement('div'), name: h.name }; });
const labels = el('labels'); for (const s of shown) { s.label.className = 'name'; s.label.textContent = s.name; s.bubble.className = 'bubble'; labels.append(s.label, s.bubble); }
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro'); el('help').onclick = () => { player.cancelInput(); intro.showModal(); }; el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); if (document.hidden) save(); });
window.addEventListener('pagehide', save); window.addEventListener('beforeunload', save);
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
const daySky = new THREE.Color('#a9bcae'), duskSky = new THREE.Color('#c9946a'), nightSky = new THREE.Color('#1d2836'), colour = new THREE.Color();
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
function presentHulda(dt: number): void {
  visualPosition.copy(player.feet()); visualPosition.y += HUMAN_CENTRE;
  let heading = player.yaw; if (player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  visualRotation.setFromAxisAngle(up, heading);
  presentation.update(dt, 'human', visualPosition, visualRotation, player.motor.speed, heading, true, player.view === 'third', 'human');
  player.avatar.visible = false;
}
function presentHobbits(dt: number): void {
  camera.updateMatrixWorld();
  for (let i = 0; i < HOBBITS.length; i++) {
    const s = village.hobbits[i], v = shown[i], f = world.figures[i], h = HOBBITS[i];
    // Ease toward the model's place a little faster than they walk, so the eased figure keeps up with the ticks.
    const dx = s.x - v.x, dz = s.z - v.z, d = Math.hypot(dx, dz), step = Math.min(d, (h.pace * 1.35 + 0.2) * dt);
    if (d > 1e-4) { v.x += dx / d * step; v.z += dz / d * step; }
    const moving = step / Math.max(1e-6, dt); v.speed += (moving - v.speed) * Math.min(1, dt * 10);
    const targetHeading = d > 0.05 ? Math.atan2(dz, dx) : s.heading; v.heading += wrap(targetHeading - v.heading) * Math.min(1, dt * 8);
    f.group.visible = !s.inside; f.group.position.set(v.x, relief(v.x, v.z), v.z);
    // The rig's heading is a yaw of the game's forward (-Z); the model's heading is an angle in the x,z plane.
    f.group.rotation.y = Math.PI / 2 - v.heading;
    // A hobbit is shorter: its stride is scaled, so the gait is fed the speed it would be at Hulda's size.
    f.update(dt, v.speed * (MODEL_HEIGHT / HOBBIT_HEIGHT), f.group.rotation.y, true, 0);
    // Name and thought bubble over the head, while near and in front of the camera.
    tmp.set(v.x, relief(v.x, v.z) + HOBBIT_HEIGHT + 0.12, v.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera);
    const show = !s.inside && tmp.z < 1 && dist < 16 && Math.abs(tmp.x) < 1.1;
    v.label.hidden = !show; v.bubble.hidden = !show || !(s.bubble && village.tick < s.bubbleUntil);
    if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; v.label.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; v.label.style.opacity = String(Math.min(1, (16 - dist) / 5)); v.bubble.style.transform = `translate(${x}px,${y - 20}px) translate(-50%,-100%)`; v.bubble.textContent = s.bubble; }
  }
}
function frame(now: number) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; if (document.hidden || intro.open) return; time += dt * 1000;
  // The village lives only while watched: whole ticks from the real seconds that passed, none while hidden.
  tickBank += dt * TICKS_PER_SECOND; const ticks = Math.floor(tickBank); if (ticks > 0) { advance(village, ticks); tickBank -= ticks; }
  player.update(now, world.colliders, undefined); player.applyCamera(camera);
  presentHulda(dt); presentHobbits(dt);
  const light = daylightAt(village.tick), dusk = Math.max(0, 1 - Math.abs(light - 0.12) / 0.12);
  colour.copy(nightSky).lerp(daySky, Math.min(1, light * 1.6)).lerp(duskSky, dusk * 0.6); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.011);
  hemi.intensity = 0.5 + 1.9 * light; sun.intensity = 2.3 * light; world.update(light, time);
  const c = clockOf(village.tick); el('clock').textContent = `Day ${c.day} · ${String(c.hour).padStart(2, '0')}:${String(c.minute).padStart(2, '0')}`;
  saveClock += dt; if (saveClock > 5) { saveClock = 0; save(); }
  renderer.render(scene, camera);
}
player.applyCamera(camera); presentHulda(0); presentHobbits(0); world.update(daylightAt(village.tick), 0); scene.background = daySky; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __village: { hulda, presentation, scene, camera, renderer, player, figures: world.figures, hobbits: HOBBITS, houses: HOUSES, get village() { return JSON.parse(serializeVillage(village)); }, get tick() { return village.tick; }, get phase() { return phaseAt(village.tick); }, get clock() { return clockOf(village.tick); }, dayTicks: DAY_TICKS, count: (where: 'inside' | 'green' | 'out') => everyone(village, where), advance: (n: number) => { advance(village, n); for (let i = 0; i < HOBBITS.length; i++) { const s = village.hobbits[i]; shown[i].x = s.x; shown[i].z = s.z; shown[i].heading = s.heading; } save(); }, hobbit: (id: string) => ({ ...village.hobbits.find(s => s.id === id)!, keeps: hobbitById(id).keeps }), get shown() { return shown.map(s => ({ x: s.x, z: s.z, speed: s.speed, label: !s.label.hidden, bubble: !s.bubble.hidden })); }, get character() { const g = hulda.gait; return { status: clipStatus, error: clipError, clips: clipUrls, bones: hulda.bones.size, body: 'hulda', roles: g?.roles ?? null, weights: g ? Object.fromEntries(Object.entries(g.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null, hobbitWeights: world.figures.map(f => f.gait ? Object.fromEntries(Object.entries(f.gait.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null) }; } } });
