// The Descent, D0 (DESCENT.md): a look study of the catwalks beneath the Cap. Hulda steps out of the
// crystal drop onto a catwalk of the placid layers and walks it on the shared player and mobility; the
// keepers at their stations talk to her. ▲ ▼ visit the seven layers (R-E-V-I-L-E-D, red to violet).
// ?depth=0..6 ?hud=1 ?intro=0
import './descent.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import type { TraversalWorld } from './mobility';
import { walkable, stepOut, stationSpot, KEEPER_LINES, LAYERS, type Catwalk, type Station } from './descentModel';
import { buildDescent, type DescentWorld } from './descentWorld';

const query = new URLSearchParams(location.search);
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
/** Tuning: bloom on the runes, the crystal, the beam and the lamps; the dark of the chamber. */
const BLOOM = { strength: 0.75, radius: 0.55, threshold: 0.85 }, FOG = { colour: '#0c0e16', density: 0.04 };
/** How near a station's spot (m) she can listen, and the drop's gangway foot she can step back in. Tuning. */
const LISTEN_M = 1.5, DROP_M = 1.0, BUBBLE_S = 7;

const scene = new THREE.Scene(); scene.background = new THREE.Color(FOG.colour); scene.fog = new THREE.FogExp2(FOG.colour, FOG.density);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 400); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; renderer.info.autoReset = false;
document.body.prepend(renderer.domElement);
let dpr = Math.min(devicePixelRatio, 1.75);
const target = new THREE.WebGLRenderTarget(innerWidth, innerHeight, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), BLOOM.strength, BLOOM.radius, BLOOM.threshold); composer.addPass(bloom);
composer.addPass(new OutputPass());
function resize(): void { renderer.setPixelRatio(dpr); renderer.setSize(innerWidth, innerHeight); composer.setPixelRatio(dpr); composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

let depth = Math.max(0, Math.min(LAYERS - 1, Number(query.get('depth') ?? 0) || 0));
let world: DescentWorld = buildDescent(scene, depth), cw: Catwalk = world.catwalk;
// She stands where the catwalk is; never over its edge (the four points round her feet must stand too).
const traversal: TraversalWorld = {
  surfacesAt: (x, z) => (walkable(cw, x, z) ? [0] : []),
  canOccupy: (p, radius) => { const k = radius * 0.6; return Math.abs(p.y) < 0.3 && walkable(cw, p.x, p.z) && walkable(cw, p.x + k, p.z) && walkable(cw, p.x - k, p.z) && walkable(cw, p.x, p.z + k) && walkable(cw, p.x, p.z - k); },
};
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third';
player.traversalWorld = traversal;
// The third-person camera stays inside the chamber.
player.cameraClear = p => { const r = Math.hypot(p.x, p.z); return r < cw.wallR - 0.25 && r > 0.95 && p.y < cw.height - 0.25 && p.y > -2 && p.distanceTo(world.drop) > 1.6; };
for (const child of [...player.avatar.children]) player.avatar.remove(child);
installMobilityControls(player);
const presentation = createHuldaPresentation(scene, new THREE.Group(), new THREE.Group());
const clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => presentation.setClips(clips), e => console.warn('Hulda clips', e));

const toast = el('toast'); let toastTimer = 0;
function say(text: string, s = 2.2): void { toast.textContent = text; toast.classList.add('on'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('on'), s * 1000); }
function setDepth(d: number): void {
  depth = Math.max(0, Math.min(LAYERS - 1, d)); world.dispose(); world = buildDescent(scene, depth); cw = world.catwalk;
  // She has just stepped out: at the gangway's ring end, turned back to look at the drop in the beam.
  const a = cw.gangway, r = cw.ringIn - 0.4; player.teleport(Math.cos(a) * r, Math.sin(a) * r, Math.atan2(Math.cos(a), Math.sin(a)), 0); player.pitch = 0.12;
  const layer = el('layer'); layer.textContent = cw.letter; layer.style.color = cw.band;
  el<HTMLButtonElement>('up').disabled = depth === 0; el<HTMLButtonElement>('down').disabled = depth === LAYERS - 1;
  bubble = null; el('bubble').hidden = true; say(`layer ${cw.letter} · the ${['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'][depth]} catwalk`);
}
el('up').onclick = () => setDepth(depth - 1); el('down').onclick = () => setDepth(depth + 1);
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro');
el('help').onclick = () => { player.cancelInput(); intro.showModal(); };
el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault());

// What she can do where she stands: listen to a keeper, or step back into the drop.
const act = el<HTMLButtonElement>('act'), bubbleEl = el('bubble');
let near: { kind: 'listen'; station: Station } | { kind: 'drop' } | null = null, bubble: { station: Station; until: number } | null = null;
const said = new Map<string, number>();
const keeperName = (s: Station): string => (s.keeper === 'snerk' ? 'the snerk' : s.keeper === 'hollowed' ? 'the hollowed' : 'the greeblin');
act.addEventListener('click', () => {
  if (!near) return;
  if (near.kind === 'drop') { say('the drop would carry her back up the beam (D1: from the village\'s node)', 3); return; }
  const s = near.station, key = `${depth}:${s.keeper}`, lines = KEEPER_LINES[s.keeper], i = said.get(key) ?? 0; said.set(key, i + 1);
  bubbleEl.textContent = lines[i % lines.length].replace('{L}', cw.letter); bubbleEl.hidden = false; bubble = { station: s, until: clock + BUBBLE_S };
});
function whatIsNear(): void {
  const f = player.feet(); let next: typeof near = null;
  for (const s of cw.stations) { const p = stationSpot(cw, s); if (Math.hypot(f.x - p.x, f.z - p.z) < LISTEN_M) next = { kind: 'listen', station: s }; }
  const o = stepOut(cw); if (!next && Math.hypot(f.x - o.x, f.z - o.z) < DROP_M) next = { kind: 'drop' };
  near = next; act.hidden = !near; if (near) act.textContent = near.kind === 'drop' ? 'into the drop' : `listen to ${keeperName(near.station)}`;
  if (bubble && (clock > bubble.until || !near || near.kind !== 'listen' || near.station !== bubble.station)) { bubble = null; bubbleEl.hidden = true; }
}
const headY: Record<Station['keeper'], number> = { snerk: 1.25, hollowed: 1.5, greeblin: 0.9 }, tmp = new THREE.Vector3();
function placeBubble(): void {
  if (!bubble) return; const k = world.keepers.find(k => k.station === bubble!.station); if (!k) return;
  tmp.copy(k.group.position); tmp.y += headY[k.kind]; tmp.project(camera); if (tmp.z > 1) { bubbleEl.hidden = true; return; }
  bubbleEl.hidden = false; bubbleEl.style.left = `${(tmp.x + 1) * innerWidth / 2}px`; bubbleEl.style.top = `${(1 - tmp.y) * innerHeight / 2 - 10}px`;
}

const hud = el('hud'); hud.hidden = query.get('hud') !== '1';
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
let last = performance.now(), clock = 0, frames = 0, frameMs = 0, statClock = 0;
function frame(now: number): void {
  requestAnimationFrame(frame); const raw = now - last, dt = Math.min(0.05, Math.max(0, raw / 1000)); last = now; if (document.hidden || intro.open) return;
  clock += dt; renderer.info.reset();
  player.update(now, [], undefined); player.applyCamera(camera);
  const feet = player.feet(); visualPosition.copy(feet); visualPosition.y += HUMAN_CENTRE;
  let heading = player.yaw; if (player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  visualRotation.setFromAxisAngle(up, heading);
  presentation.update(dt, 'human', visualPosition, visualRotation, player.motor.speed, heading, player.motor.mode === 'grounded', player.view === 'third');
  player.avatar.visible = false;
  world.update(clock, feet); whatIsNear(); placeBubble();
  composer.render();
  frames++; frameMs += raw; statClock += dt;
  if (statClock > 0.5 && !hud.hidden) { const i = renderer.info.render, ms = frameMs / frames; hud.textContent = `${(1000 / ms).toFixed(0)} fps  ${ms.toFixed(1)} ms\n${(i.triangles / 1000).toFixed(0)}k tris · ${i.calls} calls\nlayer ${cw.letter} (${depth})`; frames = 0; frameMs = 0; statClock = 0; }
}
setDepth(depth);
if (query.get('intro') !== '0') intro.showModal();
(window as unknown as { __descent: unknown }).__descent = { THREE, scene, camera, renderer, player, get world() { return world; }, get catwalk() { return cw; }, setDepth, get depth() { return depth; }, act: () => act.click(), get near() { return near; }, stationSpot: (i: number) => stationSpot(cw, cw.stations[i]), presentation };
requestAnimationFrame(frame);
