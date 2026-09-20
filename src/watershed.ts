import './watershed.css';
import * as THREE from 'three';
import { Player } from './player';
import { installMobilityControls } from './mobilityControls';
import { Board, type Cell } from './match3';
import { BoardView } from './board3d';
import { PALETTE } from './colors';
import { buildWatershed, GROVES } from './watershedWorld';
import { NODES, EDGES, SAP_CAP, SPEEDS, DAYS_PER_SECOND, REDIRECT_COST, BASIN_COST, CYCLE_DAYS, WET_DAYS, vec, parseWatershed, freshWatershed, makeSoil, onValley, groundHeight, advance, redirect, cultivateBasin, guide, insideFine, isWet, conditionOf, decomposition, storageCap, type Allocation, type NodeId } from './watershedModel';
const KEY = 'rootwake-watershed-v1';
let w = freshWatershed(); try { w = parseWatershed(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(w)); } catch { /* Play remains available. */ } }
const debug = new URLSearchParams(location.search).has('debug');
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const btn = (id: string) => el<HTMLButtonElement>(id);
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(67, innerWidth / innerHeight, .04, 140); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#eff5d9', '#435657', 2.6); scene.add(hemi); const sun = new THREE.DirectionalLight('#ffdfa2', 2.7); sun.position.set(-12, 18, 6); scene.add(sun);
const lantern = new THREE.PointLight('#d5eed1', 0, 10, 1.4); camera.add(lantern);
const world = buildWatershed(scene);
const player = new Player(renderer.domElement, scene, camera); player.position.y = 0; player.standHeightAt = groundHeight; player.teleport(GROVES.west.x, GROVES.west.z, -Math.PI / 2); player.pitch = .08; installMobilityControls(player); scene.add(player.avatar);
type Side = 'west' | 'east';
type Mode = 'surface' | 'roots' | 'cultivate'; let mode: Mode = 'surface', returnMode: Mode = 'surface';
/** Is the awareness inside the fine root right now: the ledger holds its closure while true.
 * Reads the motor's raw feet: this runs inside the motor's own sweep (from canOccupy), where the
 * pose-syncing feet() accessor would see a half-stepped position and cancel the stick. */
const held = () => mode === 'roots' && insideFine(player.motor.feet);
const soil = makeSoil(() => w, held);
const board = new Board(6, 6, 300926), boardView = new BoardView(camera), ray = new THREE.Raycaster();
let time = 0, last = performance.now(), noticeUntil = 0, lastZone = '', speed = 1, saveClock = 0, uiClock = 0, origin: Side = 'west';
let descent: { from: THREE.Vector3; to: THREE.Vector3; t: number; duration: number; end: Mode } | null = null;
let boardTween = 0; const oldPos = new THREE.Vector3(), oldQuat = new THREE.Quaternion();
let lookTarget: { yaw: number; pitch: number; t: number } | null = null;
const intro = el<HTMLDialogElement>('intro');
const shots: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; born: number }[] = [];
const shotGeometry = new THREE.SphereGeometry(.06, 7, 5), shotMaterials = PALETTE.map(p => new THREE.MeshBasicMaterial({ color: p.hex, depthTest: false }));
const hintRing = new THREE.Mesh(new THREE.TorusGeometry(.46, .04, 6, 24), new THREE.MeshBasicMaterial({ color: '#fff6bc', depthTest: false })); boardView.group.add(hintRing); hintRing.visible = false; let hints: Cell[] = [], hintUntil = 0;
const nearNode = (id: NodeId, r = 2.5) => player.feet().distanceTo(NODES[id]) < r;
function ringAt(): Side | null { for (const side of ['west', 'east'] as const) if (Math.hypot(player.position.x - GROVES[side].x, player.position.z - GROVES[side].z) < 1.15) return side; return null; }
function groveNear(): Side | null { for (const side of ['west', 'east'] as const) if (nearNode(side)) return side; return null; }
function objective(): Side { if (mode === 'roots') return origin === 'west' ? 'east' : 'west'; return Math.hypot(player.position.x - GROVES.west.x, player.position.z - GROVES.west.z) < Math.hypot(player.position.x - GROVES.east.x, player.position.z - GROVES.east.z) ? 'west' : 'east'; }
function message(text: string, seconds = 7) { el('story').textContent = text; noticeUntil = time + seconds * 1000; }
function defaultMessage() {
  if (time < noticeUntil) return;
  const wet = isWet(w.day);
  if (mode === 'cultivate') el('story').textContent = 'Tap neighbouring gems. Cultivation gathers sap into one reservoir; cascades feed the roots.';
  else if (mode === 'surface') el('story').textContent = w.shortcut === 'closed' ? 'The fine root between the groves has closed. Below, only the deep route through the spring joins them until both drink again.' : wet ? 'Rain fills the spring and both groves drink. Stand in a grove’s ring to enter the roots, or watch the seasons turn.' : 'The dry days draw down the spring. Watch which grove wilts first, and where the litter gathers.';
  else if (held() && w.shortcut === 'closing') el('story').textContent = 'The fine root is withdrawing around you. It holds while you are inside it; leave, and it closes.';
  else if (held()) el('story').textContent = 'You are in the fine root: the short passage between the groves. Under stress it withdraws.';
  else if (nearNode('spring', 3)) el('story').textContent = `The spring holds ${Math.round(w.storage / storageCap(w) * 100)}% of what it can. From here its water goes ${w.allocation === 'balanced' ? 'evenly to both groves' : `mostly to the ${w.allocation} grove`}.`;
  else el('story').textContent = w.shortcut === 'open' ? 'Two roots leave each grove: a fine one straight across to the other, and a deep one down to the spring.' : 'The fine root is closed. Follow the deep root down to the spring and up to the other grove.';
}
function refreshObserver() {
  const phaseDay = Math.floor(w.day % CYCLE_DAYS), wet = isWet(w.day);
  el('day').textContent = `Day ${Math.floor(w.day)} · ${wet ? `rain, ${WET_DAYS - phaseDay} day${WET_DAYS - phaseDay === 1 ? '' : 's'} left` : `dry, ${CYCLE_DAYS - phaseDay} day${CYCLE_DAYS - phaseDay === 1 ? '' : 's'} to rain`}`;
  btn('pause').classList.toggle('on', speed === 0); btn('play').classList.toggle('on', speed === 1); btn('fast').classList.toggle('on', speed === 2);
  for (const side of ['west', 'east'] as const) {
    const g = w[side], row = el(`grove-${side}`), cond = conditionOf(g); row.className = `grove ${cond}`;
    row.querySelector<HTMLElement>('.cond')!.textContent = cond; row.querySelector<HTMLElement>('.moist em')!.style.width = `${g.moisture * 100}%`; row.querySelector<HTMLElement>('.leaf em')!.style.width = `${g.canopy * 100}%`;
    const rot = Math.round(decomposition(g) * 4); row.querySelector<HTMLElement>('.rot')!.textContent = rot ? '●'.repeat(rot) : '·'; row.querySelector<HTMLElement>('.rot')!.title = 'decomposition';
  }
  el('spring-fill').style.width = `${w.storage / storageCap(w) * 100}%`; el('flow').textContent = w.allocation === 'balanced' ? 'even flow' : `leans ${w.allocation}` + (w.basin ? ' · basin' : '');
  el('log').innerHTML = [...w.log].reverse().slice(0, 3).map(e => `<li>Day ${e.day}: ${e.text}</li>`).join('');
}
function refresh() {
  document.body.dataset.mode = mode;
  const grove = groveNear();
  el('mode-name').textContent = mode === 'cultivate' ? 'Cultivation' : mode === 'roots' ? (held() ? 'The fine root' : nearNode('spring', 3) ? 'At the spring' : 'Inside the roots') : ringAt() ? `The ${ringAt()} grove’s ring` : 'The valley';
  el('energy').textContent = `${w.sap} / ${SAP_CAP} sap`; el('energy-fill').style.width = `${w.sap / SAP_CAP * 100}%`;
  el('actions').hidden = mode === 'cultivate'; el('board-tools').hidden = mode !== 'cultivate'; btn('walk').hidden = mode === 'cultivate';
  btn('enter').disabled = !!descent || (mode === 'surface' ? !ringAt() : !grove); btn('enter').innerHTML = mode === 'roots' ? `Rise into the ${grove ?? 'nearest'} grove<small>${grove ? 'Come up through its ring' : 'Reach a grove first'}</small>` : 'Enter the roots<small>Stand in a grove’s ring</small>';
  btn('cultivate').disabled = !!descent;
  btn('west').hidden = w.allocation === 'west'; btn('east').hidden = w.allocation === 'east'; btn('balance').hidden = w.allocation === 'balanced';
  for (const id of ['west', 'east', 'balance']) btn(id).disabled = w.sap < REDIRECT_COST;
  btn('basin').hidden = w.basin; btn('basin').disabled = w.sap < BASIN_COST;
  btn('orient').innerHTML = mode === 'roots' ? `Face the ${objective()} grove<small>Turn your gaze; use the stick to travel</small>` : `Face the ${objective()} grove<small>Turn toward its ring</small>`;
  el('instruction').textContent = mode === 'cultivate' ? 'Tap two neighbouring gems to swap.' : 'Drag to look. Stick to move; hold its centre for targets.';
  refreshObserver(); defaultMessage();
}
function transitionTo(end: Mode, to: THREE.Vector3, duration = 2.3) {
  player.cancelInput(); lookTarget = null; player.enabled = true; player.canMove = false;
  if (end === 'roots') { player.free = true; player.traversalWorld = soil; }
  descent = { from: player.feet(), to, t: 0, duration, end }; refresh();
}
function enterOrRise() {
  if (descent || boardView.isBusy) return;
  if (mode === 'surface') { const side = ringAt(); if (side) { origin = side; transitionTo('roots', NODES[side].clone()); } }
  else if (mode === 'roots') { const side = groveNear(); if (side) transitionTo('surface', vec(GROVES[side].x, groundHeight(GROVES[side].x, GROVES[side].z), GROVES[side].z), 1.8); }
}
function cultivate() { if (descent || boardView.isBusy || mode === 'cultivate') return; returnMode = mode; oldPos.copy(camera.position); oldQuat.copy(camera.quaternion); boardTween = 1; player.cancelInput(); player.enabled = false; mode = 'cultivate'; boardView.bind(board); boardView.show(time); noticeUntil = 0; refresh(); }
function leaveBoard() { if (boardView.isBusy) return; oldPos.copy(camera.position); oldQuat.copy(camera.quaternion); boardTween = 1; boardView.hide(); boardView.unbind(); hints = []; hintRing.visible = false; mode = returnMode; player.enabled = true; player.cancelInput(); noticeUntil = 0; refresh(); }
function orient() {
  if (descent || mode === 'cultivate') return; const feet = player.feet(); const target = objective();
  // On the surface, standing in the target's own ring, look across to the other grove instead of at your feet.
  const across: Side = ringAt() === target ? (target === 'west' ? 'east' : 'west') : target;
  const point = mode === 'roots' ? guide(feet, target, w, held()).add(vec(0, .25, 0)) : vec(GROVES[across].x, .3, GROVES[across].z);
  const d = point.sub(player.eye()); lookTarget = { yaw: Math.atan2(-d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)), t: 0 };
}
function lean(to: Allocation) { if (redirect(w, to)) { save(); refresh(); message(to === 'balanced' ? 'The spring flows evenly again.' : `The spring leans ${to}. Watch the other grove through the next dry days.`); } }
player.onTap = (x, y) => { if (descent || boardTween > 0) return; ray.setFromCamera(new THREE.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), camera); if (mode === 'cultivate') { hints = []; hintRing.visible = false; boardView.tap(ray); } };
renderer.domElement.addEventListener('pointerdown', () => { lookTarget = null; });
boardView.onRun = (run, o) => { w.sap = Math.min(SAP_CAP, w.sap + run.cells.length); save(); const mesh = new THREE.Mesh(shotGeometry, shotMaterials[run.type]); mesh.renderOrder = 100; scene.add(mesh); shots.push({ mesh, from: o.clone(), to: player.feet().clone().add(vec(0, .1, -1)), born: time }); message(w.sap === SAP_CAP ? 'Your reservoir is full. Return and spend it on the watershed.' : `+${run.cells.length} sap. The roots take up your cultivation.`, 3); refresh(); };
function possibleMove(): Cell[] { for (let row = 0; row < 6; row++) for (let col = 0; col < 6; col++) for (const [dr, dc] of [[1, 0], [0, 1]]) { const r = row + dr, c = col + dc; if (r >= 6 || c >= 6) continue; const a = board.grid[row][col], b = board.grid[r][c]; board.grid[row][col] = b; board.grid[r][c] = a; const ok = board.findRuns().length > 0; board.grid[row][col] = a; board.grid[r][c] = b; if (ok) return [{ row, col }, { row: r, col: c }]; } return []; }
btn('enter').onclick = enterOrRise; btn('cultivate').onclick = cultivate; btn('done').onclick = leaveBoard; btn('orient').onclick = orient;
btn('west').onclick = () => lean('west'); btn('east').onclick = () => lean('east'); btn('balance').onclick = () => lean('balanced');
btn('basin').onclick = () => { if (cultivateBasin(w)) { save(); refresh(); message('Moss gathers above the spring into a basin. It catches more of each rain and holds it through the dry.', 9); } };
btn('pause').onclick = () => { speed = 0; refreshObserver(); }; btn('play').onclick = () => { speed = 1; refreshObserver(); }; btn('fast').onclick = () => { speed = 2; refreshObserver(); };
btn('hint').onclick = () => { if (boardView.isBusy) return; hints = possibleMove(); hintUntil = time + 5500; message('The ring alternates between two neighbours. Tap one, then the other.', 5); };
btn('help').onclick = () => { player.cancelInput(); intro.showModal(); }; btn('begin').onclick = () => { intro.close(); last = performance.now(); };
btn('reset').onclick = () => { if (boardView.isBusy || descent) return; if (!confirm('Restart this watershed study? Earlier studies are unaffected.')) return; w = freshWatershed(); save(); location.reload(); };
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); });
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); boardView.layout(); });
const clearSky = new THREE.Color('#a0b8ae'), rainSky = new THREE.Color('#7f9490'), soilColour = new THREE.Color('#102726'), colour = new THREE.Color();
function frame(now: number) {
  requestAnimationFrame(frame); const real = Math.max(0, (now - last) / 1000), dt = Math.min(.05, real); last = now; if (document.hidden || intro.open) return; time += dt * 1000;
  // The seasons keep real time even when frames are slow, but never catch up a hidden or paused stretch.
  if (mode !== 'cultivate') { const days = Math.min(.5, real) * DAYS_PER_SECOND * SPEEDS[speed]; if (days > 0) { const before = w.log.length, lastText = w.log[w.log.length - 1]?.text; advance(w, days, held()); const latest = w.log[w.log.length - 1]; if (latest && (w.log.length !== before || latest.text !== lastText)) message(latest.text, 6); saveClock += real; if (saveClock > 3) { saveClock = 0; save(); } } }
  if (descent) { const d = descent; d.t = Math.min(1, d.t + dt / d.duration); const k = d.t * d.t * (3 - 2 * d.t); const p = d.from.clone().lerp(d.to, k); player.teleport(p.x, p.z, player.yaw, p.y); if (d.t === 1) { mode = d.end; descent = null; player.canMove = true; player.free = mode === 'roots'; player.traversalWorld = mode === 'roots' ? soil : null; player.teleport(p.x, p.z, player.yaw, p.y); noticeUntil = 0; refresh(); } }
  player.update(now, mode === 'roots' || descent ? [] : world.colliders, p => onValley(p.x, p.z));
  if (lookTarget) { lookTarget.t += dt; const dy = Math.atan2(Math.sin(lookTarget.yaw - player.yaw), Math.cos(lookTarget.yaw - player.yaw)); player.yaw += dy * Math.min(1, dt * 9); player.pitch += (lookTarget.pitch - player.pitch) * Math.min(1, dt * 9); if (lookTarget.t > 1) lookTarget = null; }
  player.applyCamera(camera);
  if (mode === 'cultivate') { const p = player.feet(); camera.position.copy(p).add(vec(0, 2.1, 3.9)); camera.lookAt(p.clone().add(vec(0, .6, 0))); }
  if (boardTween > 0) { boardTween = Math.max(0, boardTween - dt * 1.8); const k = boardTween * boardTween * (3 - 2 * boardTween); camera.position.lerp(oldPos, k); camera.quaternion.slerp(oldQuat, k); }
  camera.updateMatrixWorld();
  const under = mode === 'cultivate' ? (returnMode === 'roots' ? 1 : 0) : THREE.MathUtils.clamp((groundHeight(player.position.x, player.position.z) - player.eye().y) / .8, 0, 1);
  const raining = isWet(w.day) && speed > 0;
  world.update(w, under, time, dt, held(), camera.position, raining);
  colour.copy(raining ? rainSky : clearSky).lerp(soilColour, under); scene.background = colour; scene.fog = new THREE.FogExp2(colour, .018 + under * .024 + (raining ? .006 : 0)); lantern.intensity = under * 10; hemi.intensity = raining ? 2.1 : 2.6; sun.intensity = raining ? 1.6 : 2.7;
  boardView.update(time); if (mode === 'cultivate') { boardView.group.scale.multiplyScalar(innerHeight < 520 ? .78 : innerHeight < 740 ? .82 : .95); boardView.group.position.y = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * 2.2 * 2 * (innerHeight < 520 ? -.08 : innerHeight < 740 ? -.12 : -.15); }
  btn('done').disabled = boardView.isBusy || boardTween > 0; btn('hint').disabled = boardView.isBusy;
  if (hints.length && time < hintUntil && !boardView.isBusy) { const c = hints[Math.floor(time / 700) % 2]; hintRing.position.set(c.col - 2.5, 2.5 - c.row, .15); hintRing.visible = true; } else hintRing.visible = false;
  for (let i = shots.length - 1; i >= 0; i--) { const s = shots[i], k = Math.min(1, (time - s.born) / 650); s.mesh.position.lerpVectors(s.from, s.to, k); s.mesh.position.y += Math.sin(k * Math.PI) * .4; if (k === 1) { scene.remove(s.mesh); shots.splice(i, 1); } }
  const zone = mode === 'roots' ? (held() ? 'fine' : nearNode('spring', 3) ? 'spring' : groveNear() ?? 'travel') : mode === 'surface' ? ringAt() ?? 'valley' : mode; uiClock += dt; if (zone !== lastZone || uiClock > .3) { refresh(); uiClock = 0; lastZone = zone; }
  const target = objective(), point = mode === 'roots' ? NODES[target].clone().add(vec(0, .4, 0)) : vec(GROVES[target].x, groundHeight(GROVES[target].x, GROVES[target].z) + .4, GROVES[target].z), screen = point.clone().project(camera), distance = player.feet().distanceTo(point);
  el('bearing').hidden = mode === 'cultivate'; el('bearing').textContent = mode === 'roots' ? `${target === 'west' ? 'West grove' : 'East grove'} · ${distance.toFixed(0)} m · ${w.shortcut === 'open' ? 'fine root open' : w.shortcut === 'closing' ? 'fine root withdrawing' : w.shortcut === 'closed' ? 'deep route only' : 'fine root regrowing'}` : `Fine root between the groves: ${w.shortcut}`;
  el('label').hidden = mode !== 'roots' || screen.z > 1 || Math.abs(screen.x) > .85 || Math.abs(screen.y) > .65; el('label').style.left = `${(screen.x + 1) * innerWidth / 2}px`; el('label').style.top = `${(1 - screen.y) * innerHeight / 2}px`; el('label').textContent = target === 'west' ? 'WEST GROVE' : 'EAST GROVE';
  renderer.render(scene, camera);
}
refresh(); player.applyCamera(camera); world.update(w, 0, 0, 0, false, camera.position, false); scene.background = clearSky; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __watershed: { scene, camera, renderer, player, board, boardView, soil, nodes: NODES, edges: EDGES, groves: GROVES, possibleMove, insideFine: () => held(), get state() { return JSON.parse(JSON.stringify(w)); }, get mode() { return mode; }, get speed() { return SPEEDS[speed]; }, get transitioning() { return !!descent || boardTween > 0; },
  // Verification only, behind ?debug: jump the seasons without waiting them out. Not a play path.
  advance: debug ? (days: number) => { advance(w, days, held()); save(); refresh(); } : undefined } });
