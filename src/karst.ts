import './karst.css';
import * as THREE from 'three';
import { Player } from './player';
import { installMobilityControls } from './mobilityControls';
import { Board, type Cell } from './match3';
import { BoardView } from './board3d';
import { PALETTE } from './colors';
import { buildKarst, plantsOf, SPRING } from './karstWorld';
import { PLANTS, ROOTS, ZONES, CAVERN, PILLAR_HEIGHT, inZone, relief, rootsAt, otherEnd, stepRide, ridePoint, vec, parseProgress, freshProgress, arrive, isRideable, tend, TEND_COST, makeFloorSoil, type Root, type Plant } from './karstModel';
import { SAP_CAP, SPEEDS, DAYS_PER_SECOND, REDIRECT_COST, BASIN_COST, CYCLE_DAYS, WET_DAYS, advance, redirect, cultivateBasin, isWet, conditionOf, decomposition, storageCap } from './watershedModel';
const KEY = 'rootwake-karst-v2';
let progress = freshProgress(); try { progress = parseProgress(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* Play remains available. */ } }
const debug = new URLSearchParams(location.search).has('debug');
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const btn = (id: string) => el<HTMLButtonElement>(id);
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(67, innerWidth / innerHeight, 0.04, 260); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#f2f6ea', '#5a6a60', 2.4); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.4); sun.position.set(-30, 60, 20); scene.add(sun);
const lantern = new THREE.PointLight('#e8d9a8', 0, 6, 1.5); camera.add(lantern);
const world = buildKarst(scene);
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); installMobilityControls(player);
const floorSoil = makeFloorSoil();
const board = new Board(6, 6, 310926), boardView = new BoardView(camera), ray = new THREE.Raycaster();
type Mode = 'surface' | 'soil' | 'cultivate' | 'choose' | 'shrink' | 'ride' | 'arrive' | 'emerge';
let mode: Mode = 'surface', returnMode: Mode = 'surface', time = 0, last = performance.now(), noticeUntil = 0, uiClock = 0, lastZone = '', vision = 0, speed = 1, saveClock = 0;
let zone = ZONES[PLANTS[progress.at].zone];
let at: Plant = PLANTS[progress.at];
let ride: { root: Root; from: string; s: number; speed: number } | null = null;
let tween: { from: THREE.Vector3; to: THREE.Vector3; fromQ: THREE.Quaternion; toQ: THREE.Quaternion; t: number; seconds: number; then: () => void } | null = null;
/** Sinking into the soil at the foot, or rising out of it: the feet move straight down or up. */
let descent: { from: number; to: number; t: number; up: boolean } | null = null;
let boardTween = 0; const oldPos = new THREE.Vector3(), oldQuat = new THREE.Quaternion();
let lookTarget: { yaw: number; pitch: number; t: number } | null = null;
const intro = el<HTMLDialogElement>('intro');
const rideBase = new THREE.Quaternion(), rideLook = new THREE.Quaternion(), rideMatrix = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0);
const shots: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; born: number }[] = [];
const shotGeometry = new THREE.SphereGeometry(0.06, 7, 5), shotMaterials = PALETTE.map(p => new THREE.MeshBasicMaterial({ color: p.hex, depthTest: false }));
const hintRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 6, 24), new THREE.MeshBasicMaterial({ color: '#fff6bc', depthTest: false })); boardView.group.add(hintRing); hintRing.visible = false; let hints: Cell[] = [], hintUntil = 0;
const SINK_S = 2.6, RISE_S = 1.6, SINK_DEPTH = 1.7, COMMUNE_RANGE = 3.2;
function standAt(p: Plant): void {
  zone = ZONES[p.zone]; at = p; player.position.y = zone.y; player.standHeightAt = relief; player.free = false; player.traversalWorld = null;
  player.teleport(p.stand.x, p.stand.z, p.stand.yaw); player.pitch = p.zone === 'summit' ? -0.05 : 0.05;
}
function nearestPlant(): { plant: Plant; distance: number } {
  const feet = player.feet(); let best = { plant: at, distance: Infinity };
  for (const p of plantsOf(zone.id)) { const d = Math.hypot(feet.x - p.at.x, feet.z - p.at.z); if (d < best.distance) best = { plant: p, distance: d }; }
  return best;
}
const onFloor = () => zone.id === 'floor';
const canCommune = () => (mode === 'surface' || (mode === 'soil' && player.feet().y > -3)) && !descent && nearestPlant().distance < COMMUNE_RANGE;
const ridingFine = () => mode === 'ride' && !!ride?.root.fine;
function message(text: string, seconds = 8) { el('story').textContent = text; noticeUntil = time + seconds * 1000; }
function placeName(p: Plant): string { return p.zone === 'summit' ? 'the summit' : p.zone === 'cavern' ? 'the water cavern' : p.zone === 'floor' ? 'the forest floor' : `the ${p.zone} ledge`; }
function defaultMessage() {
  if (time < noticeUntil) return;
  const near = nearestPlant(), w = progress.w;
  if (mode === 'cultivate') el('story').textContent = 'Tap neighbouring gems. Cultivation gathers sap into one reservoir; cascades feed the roots.';
  else if (mode === 'soil') el('story').textContent = near.distance < COMMUNE_RANGE ? `${near.plant.name[0].toUpperCase()}${near.plant.name.slice(1)}'s roots are here in the soil. Commune to enter them, or rise.` : 'The soil at the foot. The forest floor is your roof; the pillar goes on down beside you as solid rock.';
  else if (mode === 'surface') {
    if (zone.id === 'summit') el('story').textContent = progress.returned ? 'Back on the top, by another way. The whole pillar is one plant now, as far as your roots know.' : progress.reachedFloor ? 'The summit again. You know the way down; the pillar has more than one way up.' : 'The top of the karst: a few paces of stone and one pine. Below, the forest. Commune with the pine to follow its roots down.';
    else if (zone.id === 'cavern') el('story').textContent = 'A cavern inside the mountain. Water pools in the dark; the mushrooms give the only light. A fern here knows the way on.';
    else if (zone.id === 'floor') el('story').textContent = w.shortcut !== 'open' ? 'The groves are stressed: the fine roots have withdrawn, and with them the quick ways. Only the deep roots serve until both groves drink.' : progress.tended ? 'The taproot is awake: the pine’s old root runs straight down the north face to the maple, the fastest way up while the maple grove stays well.' : isWet(w.day) ? 'The forest at the foot. Rain fills the spring; the oak and the maple groves drink. Sink into the soil, cultivate, or find a way back up.' : 'The forest at the foot in the dry days. The spring draws down; watch which grove wilts first, and what that closes.';
    else el('story').textContent = `A ledge on the ${zone.id} face. The ${near.plant.kind} clings here with no soil at all; its roots go on across the stone.`;
  } else if (mode === 'choose' || mode === 'arrive') el('story').textContent = `${at.name[0].toUpperCase()}${at.name.slice(1)} is joined to ${rootsAt(at.id).length === 1 ? 'one other plant' : `${rootsAt(at.id).length} others`}. Choose a root to ride, or ${mode === 'arrive' ? 'emerge here' : 'stay'}.`;
}
function refreshObserver() {
  const w = progress.w, phaseDay = Math.floor(w.day % CYCLE_DAYS), wet = isWet(w.day);
  el('day').textContent = `Day ${Math.floor(w.day)} · ${wet ? `rain, ${WET_DAYS - phaseDay} day${WET_DAYS - phaseDay === 1 ? '' : 's'} left` : `dry, ${CYCLE_DAYS - phaseDay} day${CYCLE_DAYS - phaseDay === 1 ? '' : 's'} to rain`}`;
  btn('pause').classList.toggle('on', speed === 0); btn('play').classList.toggle('on', speed === 1); btn('fast').classList.toggle('on', speed === 2);
  for (const side of ['east', 'west'] as const) {
    const g = w[side], row = el(`grove-${side}`), cond = conditionOf(g); row.className = `grove ${cond}`;
    row.querySelector<HTMLElement>('.cond')!.textContent = cond; row.querySelector<HTMLElement>('.moist em')!.style.width = `${g.moisture * 100}%`; row.querySelector<HTMLElement>('.leaf em')!.style.width = `${g.canopy * 100}%`;
    const rot = Math.round(decomposition(g) * 4); row.querySelector<HTMLElement>('.rot')!.textContent = rot ? '●'.repeat(rot) : '·';
  }
  el('spring-fill').style.width = `${w.storage / storageCap(w) * 100}%`; el('flow').textContent = (w.allocation === 'balanced' ? 'even flow' : w.allocation === 'east' ? 'leans oak' : 'leans maple') + (w.basin ? ' · basin' : '');
  el('log').innerHTML = [...w.log].reverse().slice(0, 3).map(e => `<li>Day ${e.day}: ${e.text}</li>`).join('');
}
function refresh() {
  document.body.dataset.mode = mode;
  const near = nearestPlant(), w = progress.w;
  el('mode-name').textContent = mode === 'ride' ? `Riding ${ride ? PLANTS[otherEnd(ride.root, ride.from)].name : ''}` : mode === 'shrink' ? 'Shrinking' : mode === 'emerge' ? 'Emerging' : mode === 'cultivate' ? 'Cultivation' : mode === 'soil' ? 'In the soil at the foot' : mode === 'choose' || mode === 'arrive' ? `Within ${at.name}` : placeName(at)[0].toUpperCase() + placeName(at).slice(1);
  const met = progress.visited.length, total = Object.keys(PLANTS).length; el('energy').textContent = `${progress.sap} / ${SAP_CAP} sap · ${met} of ${total} plants`; el('energy-fill').style.width = `${progress.sap / SAP_CAP * 100}%`;
  const walking = mode === 'surface' || mode === 'soil';
  btn('walk').hidden = !walking; el('actions').hidden = mode === 'cultivate'; el('board-tools').hidden = mode !== 'cultivate';
  btn('vision').classList.toggle('on', progress.vision); btn('vision').innerHTML = progress.vision ? 'Stone sight<small>See the limestone as stone again</small>' : 'Root vision<small>See the roots through the stone</small>';
  btn('vision').hidden = mode !== 'surface'; btn('orient').hidden = !walking;
  btn('sink').hidden = !(walking && onFloor()); btn('sink').disabled = !!descent; btn('sink').innerHTML = mode === 'soil' ? 'Rise to the surface<small>Back into the forest</small>' : 'Sink into the soil<small>Drift beneath the forest</small>';
  btn('cultivate').hidden = !(mode === 'surface' && onFloor()); btn('cultivate').disabled = !!descent;
  btn('commune').hidden = !canCommune(); btn('commune').innerHTML = `Commune with ${near.plant.name}<small>Shrink into its roots</small>`;
  const choosing = mode === 'choose' || mode === 'arrive';
  el('rides').hidden = !choosing; btn('emerge').hidden = !choosing; btn('emerge').innerHTML = mode === 'arrive' ? 'Emerge here<small>Grow back to your size</small>' : 'Stay<small>Step back out of the root</small>';
  if (choosing) el('rides').innerHTML = rootsAt(at.id).map(r => {
    const to = PLANTS[otherEnd(r, at.id)], climb = to.at.y > at.at.y + 1, ok = isRideable(r, progress);
    const why = ok ? '' : r.dormant && !progress.tended ? ' · dormant: tend it for 12 sap' : w.shortcut === 'closing' ? ' · withdrawing' : w.shortcut === 'regrowing' ? ' · regrowing' : ' · withdrawn: the groves are stressed';
    return `<button data-root="${r.id}" class="${climb ? 'up' : 'down'}" ${ok ? '' : 'disabled'}><b>${climb ? 'CLIMB' : r.interior ? 'INTO THE STONE' : 'SLIDE'} · ${Math.round(r.length)} m</b>Ride to ${to.name}<small>${placeName(to)}${progress.visited.includes(to.id) ? '' : ' · unmet'}${why}</small></button>`;
  }).join('');
  for (const b of el('rides').querySelectorAll<HTMLButtonElement>('button')) b.onclick = () => startRide(ROOTS.find(r => r.id === b.dataset.root)!);
  const spending = walking && onFloor();
  btn('tend').hidden = !spending || progress.tended; btn('tend').disabled = progress.sap < TEND_COST;
  btn('west').hidden = !spending || w.allocation === 'west'; btn('east').hidden = !spending || w.allocation === 'east'; btn('balance').hidden = !spending || w.allocation === 'balanced';
  for (const id of ['west', 'east', 'balance']) btn(id).disabled = progress.sap < REDIRECT_COST;
  btn('basin').hidden = !spending || w.basin; btn('basin').disabled = progress.sap < BASIN_COST;
  el('instruction').textContent = mode === 'ride' ? 'Drag to look around the root as it carries you.' : choosing ? 'Pick a root, or emerge.' : mode === 'cultivate' ? 'Tap two neighbouring gems to swap.' : mode === 'soil' ? 'Drag to look. Stick to drift where you look; hold its centre for targets.' : 'Drag to look. Stick to move; hold its centre for targets.';
  refreshObserver(); defaultMessage();
}
function beginTween(from: THREE.Vector3, to: THREE.Vector3, toQ: THREE.Quaternion, seconds: number, then: () => void): void {
  tween = { from: from.clone(), to: to.clone(), fromQ: camera.quaternion.clone(), toQ: toQ.clone(), t: 0, seconds, then };
}
function lookQuaternion(from: THREE.Vector3, to: THREE.Vector3): THREE.Quaternion { rideMatrix.lookAt(from, to, up); return new THREE.Quaternion().setFromRotationMatrix(rideMatrix); }
function commune(): void {
  if (!canCommune()) return; at = nearestPlant().plant; player.cancelInput(); player.canMove = false; lookTarget = null;
  if (mode === 'soil') { player.free = false; player.traversalWorld = null; }
  if (!progress.visited.includes(at.id)) { progress.visited.push(at.id); save(); }
  // Shrinking: the eye sinks to the root's mouth at the plant's foot, where everything is suddenly large.
  mode = 'shrink';
  beginTween(camera.position, at.mouth.clone().add(vec(0, 0.12, 0)), lookQuaternion(at.mouth.clone().add(vec(0, 0.12, 0)), at.at.clone().add(vec(0, 0.4, 0))), 1.6, () => { mode = 'choose'; refresh(); });
  message(`You listen to ${at.name}. The ground rises around you as you shrink toward the mouth of its root.`, 6); refresh();
}
function startRide(root: Root): void {
  if ((mode !== 'choose' && mode !== 'arrive') || !isRideable(root, progress)) return;
  ride = { root, from: at.id, s: 0, speed: 0 }; mode = 'ride'; player.yaw = 0; player.pitch = 0; player.cancelInput(); tween = null;
  const to = PLANTS[otherEnd(root, at.id)];
  message(to.at.y < at.at.y - 1 ? `The root takes you. Downhill it runs like water${root.interior ? ', into the stone' : ', over the face'}.` : 'Upward the root draws you slowly, the way water climbs a stem.', 5); refresh();
}
function finishRide(): void {
  if (!ride) return; const to = PLANTS[otherEnd(ride.root, ride.from)]; const outcome = arrive(progress, to.id); at = to; zone = ZONES[to.zone]; ride = null; mode = 'arrive'; save();
  if (outcome === 'floor') message('The forest floor, at the foot of the pillar you woke on. Emerge and look up; the soil here is yours to sink into, and the spring feeds two groves.', 12);
  else if (outcome === 'returned') message('The summit, reached from below by the roots. Every plant on this pillar is one body that you have now travelled.', 12);
  else if (to.zone === 'cavern') message('The root opens into a cavern inside the mountain: water, and the cold light of mushrooms. Emerge here, or ride on.', 10);
  else message(`You arrive in ${to.name}. Emerge onto ${placeName(to)}, or choose another root.`, 7);
  refresh();
}
function emerge(): void {
  if (mode !== 'arrive' && mode !== 'choose') return;
  const p = at; mode = 'emerge'; player.position.y = ZONES[p.zone].y; player.standHeightAt = relief; zone = ZONES[p.zone]; player.free = false; player.traversalWorld = null;
  player.teleport(p.stand.x, p.stand.z, p.stand.yaw); player.pitch = p.zone === 'summit' ? -0.05 : 0.05; player.canMove = false;
  const eye = player.eye(); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
  beginTween(camera.position, eye, q, 1.4, () => { mode = 'surface'; player.canMove = true; player.cancelInput(); progress.at = p.id; save(); refresh(); });
  refresh();
}
function sinkOrRise(): void {
  if (descent || !onFloor()) return;
  const feet = player.feet(), surfaceY = relief(feet.x, feet.z);
  if (mode === 'surface') { player.free = true; player.traversalWorld = floorSoil; mode = 'soil'; descent = { from: feet.y, to: surfaceY - SINK_DEPTH, t: 0, up: false }; message('You sink through the forest floor. The ground above is your roof; the pillar’s foot stands beside you as solid rock, and the groves’ roots hang in the soil around you.', 8); }
  else if (mode === 'soil') descent = { from: feet.y, to: surfaceY, t: 0, up: true };
  player.cancelInput(); player.canMove = false; refresh();
}
function cultivate() { if (descent || boardView.isBusy || mode !== 'surface' || !onFloor()) return; returnMode = mode; oldPos.copy(camera.position); oldQuat.copy(camera.quaternion); boardTween = 1; player.cancelInput(); player.enabled = false; mode = 'cultivate'; boardView.bind(board); boardView.show(time); noticeUntil = 0; refresh(); }
function leaveBoard() { if (boardView.isBusy) return; oldPos.copy(camera.position); oldQuat.copy(camera.quaternion); boardTween = 1; boardView.hide(); boardView.unbind(); hints = []; hintRing.visible = false; mode = returnMode; player.enabled = true; player.cancelInput(); noticeUntil = 0; refresh(); }
/** The ledger keeps its own purse; the karst's single reservoir is the truth, so lend it and take it back. */
function spendVia(fn: () => boolean): boolean { progress.w.sap = progress.sap; const ok = fn(); progress.sap = progress.w.sap; progress.w.sap = 0; if (ok) { save(); refresh(); } return ok; }
function orient(): void {
  if (mode !== 'surface' && mode !== 'soil') return; const p = nearestPlant().plant; const d = p.at.clone().add(vec(0, 0.8, 0)).sub(player.eye());
  lookTarget = { yaw: Math.atan2(-d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)), t: 0 };
}
function possibleMove(): Cell[] { for (let row = 0; row < 6; row++) for (let col = 0; col < 6; col++) for (const [dr, dc] of [[1, 0], [0, 1]]) { const r = row + dr, c = col + dc; if (r >= 6 || c >= 6) continue; const a = board.grid[row][col], b = board.grid[r][c]; board.grid[row][col] = b; board.grid[r][c] = a; const ok = board.findRuns().length > 0; board.grid[row][col] = a; board.grid[r][c] = b; if (ok) return [{ row, col }, { row: r, col: c }]; } return []; }
player.onTap = (x, y) => { if (descent || boardTween > 0) return; ray.setFromCamera(new THREE.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), camera); if (mode === 'cultivate') { hints = []; hintRing.visible = false; boardView.tap(ray); } };
boardView.onRun = (run, o) => { progress.sap = Math.min(SAP_CAP, progress.sap + run.cells.length); save(); const mesh = new THREE.Mesh(shotGeometry, shotMaterials[run.type]); mesh.renderOrder = 100; scene.add(mesh); shots.push({ mesh, from: o.clone(), to: player.feet().clone().add(vec(0, 0.1, -1)), born: time }); message(progress.sap === SAP_CAP ? 'Your reservoir is full. Return and spend it on the foot’s roots and spring.' : `+${run.cells.length} sap. The roots take up your cultivation.`, 3); refresh(); };
btn('vision').onclick = () => { progress.vision = !progress.vision; save(); refresh(); message(progress.vision ? 'The limestone goes glassy. Roots drape over its faces and thread its body; one leads into a hollow at its heart.' : 'The stone is stone again.', 6); };
btn('commune').onclick = commune; btn('emerge').onclick = emerge; btn('orient').onclick = orient; btn('sink').onclick = sinkOrRise; btn('cultivate').onclick = cultivate; btn('done').onclick = leaveBoard;
btn('tend').onclick = () => { if (tend(progress)) { save(); refresh(); message('The pine’s old taproot wakes down the north face: from the maple, the fastest way up. Being fine, it withdraws when the maple grove wilts.', 10); } };
btn('west').onclick = () => { if (spendVia(() => redirect(progress.w, 'west'))) message('The spring leans to the maple grove. The oak grove will have less through the dry.', 7); };
btn('east').onclick = () => { if (spendVia(() => redirect(progress.w, 'east'))) message('The spring leans to the oak grove. The maple grove will have less through the dry.', 7); };
btn('balance').onclick = () => { if (spendVia(() => redirect(progress.w, 'balanced'))) message('The spring flows evenly to both groves again.', 6); };
btn('basin').onclick = () => { if (spendVia(() => cultivateBasin(progress.w))) message('Moss gathers above the spring into a basin. It catches more of each rain and holds it through the dry.', 9); };
btn('pause').onclick = () => { speed = 0; refreshObserver(); }; btn('play').onclick = () => { speed = 1; refreshObserver(); }; btn('fast').onclick = () => { speed = 2; refreshObserver(); };
btn('hint').onclick = () => { if (boardView.isBusy) return; hints = possibleMove(); hintUntil = time + 5500; message('The ring alternates between two neighbours. Tap one, then the other.', 5); };
btn('help').onclick = () => { player.cancelInput(); intro.showModal(); }; btn('begin').onclick = () => { intro.close(); last = performance.now(); };
btn('reset').onclick = () => { if (mode !== 'surface' || descent) return; if (!confirm('Restart the karst? Earlier studies are unaffected.')) return; progress = freshProgress(); save(); location.reload(); };
renderer.domElement.addEventListener('pointerdown', () => { lookTarget = null; });
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); });
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); boardView.layout(); });
const skyColour = new THREE.Color('#aab8b3'), rainSky = new THREE.Color('#8b9a98'), cavernColour = new THREE.Color('#061312'), rootColour = new THREE.Color('#2a1d0c'), soilColour = new THREE.Color('#102726'), colour = new THREE.Color();
function frame(now: number) {
  requestAnimationFrame(frame); const real = Math.max(0, (now - last) / 1000), dt = Math.min(0.05, real); last = now; if (document.hidden || intro.open) return; time += dt * 1000;
  // The seasons keep real time whatever the frame rate; they pause on the board, in help and when hidden.
  if (mode !== 'cultivate') { const days = Math.min(0.5, real) * DAYS_PER_SECOND * SPEEDS[speed]; if (days > 0) { const w = progress.w, before = w.log.length, lastText = w.log[w.log.length - 1]?.text; advance(w, days, ridingFine()); const latest = w.log[w.log.length - 1]; if (latest && (w.log.length !== before || latest.text !== lastText) && (mode === 'surface' || mode === 'soil')) message(latest.text, 6); saveClock += real; if (saveClock > 3) { saveClock = 0; save(); } } }
  if (descent) {
    descent.t = Math.min(1, descent.t + dt / (descent.up ? RISE_S : SINK_S)); const k = descent.t * descent.t * (3 - 2 * descent.t);
    player.motor.feet.y = THREE.MathUtils.lerp(descent.from, descent.to, k);
    if (descent.t >= 1) { const feet = player.motor.feet; if (descent.up) { mode = 'surface'; player.free = false; player.traversalWorld = null; player.teleport(feet.x, feet.z, player.yaw); } player.canMove = true; descent = null; refresh(); }
  }
  player.update(now, mode === 'surface' ? world.colliders : [], p => inZone(zone, p.x, p.z));
  if (lookTarget) { lookTarget.t += dt; const dy = Math.atan2(Math.sin(lookTarget.yaw - player.yaw), Math.cos(lookTarget.yaw - player.yaw)); player.yaw += dy * Math.min(1, dt * 9); player.pitch += (lookTarget.pitch - player.pitch) * Math.min(1, dt * 9); if (lookTarget.t > 1) lookTarget = null; }
  if (mode === 'surface' || mode === 'soil') player.applyCamera(camera);
  else if (mode === 'cultivate') { const p = player.feet(); camera.position.copy(p).add(vec(0, 2.1, 3.9)); camera.lookAt(p.clone().add(vec(0, 0.6, 0))); }
  else if (mode === 'ride' && ride) {
    const step = stepRide(ride.root, ride.from, ride.s, ride.speed, dt); ride.s = step.s; ride.speed = step.speed;
    const { point, tangent } = ridePoint(ride.root, ride.from, ride.s);
    camera.position.copy(point);
    rideMatrix.lookAt(point, point.clone().add(tangent), up); rideBase.setFromRotationMatrix(rideMatrix);
    // Looking around is an offset on the root's own heading, so a drag reads the same as on the ground.
    rideLook.setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ')); camera.quaternion.copy(rideBase).multiply(rideLook);
    if (step.done) finishRide();
  }
  if (tween) { const tw = tween; tw.t = Math.min(1, tw.t + dt / tw.seconds); const k = tw.t * tw.t * (3 - 2 * tw.t); camera.position.lerpVectors(tw.from, tw.to, k); camera.quaternion.slerpQuaternions(tw.fromQ, tw.toQ, k); if (tw.t === 1) { tween = null; tw.then(); } }
  else if (mode === 'choose' || mode === 'arrive') { rideLook.setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ')); camera.quaternion.copy(rideLook); camera.position.copy(at.mouth).add(vec(0, 0.12, 0)); }
  if (boardTween > 0) { boardTween = Math.max(0, boardTween - dt * 1.8); const k = boardTween * boardTween * (3 - 2 * boardTween); camera.position.lerp(oldPos, k); camera.quaternion.slerp(oldQuat, k); }
  camera.updateMatrixWorld();
  // Sight through the stone: chosen on the surface, always while shrunk into a root.
  const wantVision = progress.vision || !(mode === 'surface' || mode === 'soil' || mode === 'cultivate') ? 1 : 0; vision += (wantVision - vision) * Math.min(1, dt * 3);
  const under = onFloor() && (mode === 'soil' || (mode === 'cultivate' && returnMode === 'soil')) ? THREE.MathUtils.smoothstep(relief(camera.position.x, camera.position.z) - camera.position.y, -0.25, 0.25) : 0;
  const inCavern = camera.position.distanceTo(CAVERN.centre) < CAVERN.radius + 0.5, inRoot = mode === 'ride' || mode === 'choose' || mode === 'arrive' || mode === 'shrink';
  const raining = isWet(progress.w.day) && speed > 0;
  world.update(vision, time, mode === 'ride' && ride ? ride.root : null, camera.position, progress.w, under, raining && !inCavern, progress.tended, dt);
  colour.copy(inCavern ? cavernColour : raining ? rainSky : skyColour); if (inRoot && !inCavern) colour.lerp(rootColour, 0.75); colour.lerp(soilColour, under);
  scene.background = colour; scene.fog = new THREE.FogExp2(colour, inCavern ? 0.05 : inRoot ? 0.06 : 0.011 + under * 0.03 + (raining ? 0.004 : 0));
  lantern.intensity = inRoot ? 3 : inCavern ? 1.2 : under * 6; hemi.intensity = inCavern ? 0.6 : raining ? 2.0 : 2.4; sun.intensity = inCavern ? 0.2 : raining ? 1.5 : 2.4;
  boardView.update(time); if (mode === 'cultivate') { boardView.group.scale.multiplyScalar(innerHeight < 520 ? 0.78 : innerHeight < 740 ? 0.82 : 0.95); boardView.group.position.y = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * 2.2 * 2 * (innerHeight < 520 ? -0.08 : innerHeight < 740 ? -0.12 : -0.15); }
  btn('done').disabled = boardView.isBusy || boardTween > 0; btn('hint').disabled = boardView.isBusy;
  if (hints.length && time < hintUntil && !boardView.isBusy) { const c = hints[Math.floor(time / 700) % 2]; hintRing.position.set(c.col - 2.5, 2.5 - c.row, 0.15); hintRing.visible = true; } else hintRing.visible = false;
  for (let i = shots.length - 1; i >= 0; i--) { const s = shots[i], k = Math.min(1, (time - s.born) / 650); s.mesh.position.lerpVectors(s.from, s.to, k); s.mesh.position.y += Math.sin(k * Math.PI) * 0.4; if (k === 1) { scene.remove(s.mesh); shots.splice(i, 1); } }
  const near = nearestPlant(); const key = `${mode}:${near.distance < COMMUNE_RANGE ? near.plant.id : ''}:${progress.w.shortcut}`; uiClock += dt; if (key !== lastZone || uiClock > 0.4) { refresh(); uiClock = 0; lastZone = key; }
  el('bearing').hidden = mode === 'ride' || mode === 'cultivate'; el('bearing').textContent = mode === 'surface' || mode === 'soil' ? `${placeName(at)[0].toUpperCase()}${placeName(at).slice(1)} · ${Math.round(zone.y)} m up · ${near.plant.name} ${near.distance.toFixed(0)} m${onFloor() ? ` · spring ${Math.hypot(player.position.x - SPRING.x, player.position.z - SPRING.z).toFixed(0)} m` : ''}` : `${at.name} · ${Math.round(at.at.y)} m up`;
  const target = mode === 'surface' ? near.plant : null; if (target) { const screen = target.at.clone().add(vec(0, 1.2, 0)).project(camera); el('label').hidden = screen.z > 1 || Math.abs(screen.x) > 0.85 || Math.abs(screen.y) > 0.7 || near.distance < COMMUNE_RANGE; el('label').style.left = `${(screen.x + 1) * innerWidth / 2}px`; el('label').style.top = `${(1 - screen.y) * innerHeight / 2}px`; el('label').textContent = target.name.replace(/^the /, '').toUpperCase(); } else el('label').hidden = true;
  renderer.render(scene, camera);
}
standAt(at); refresh(); player.applyCamera(camera); world.update(0, 0, null, camera.position, progress.w, 0, false, progress.tended, 0); scene.background = skyColour; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __karst: { scene, camera, renderer, player, board, boardView, plants: PLANTS, roots: ROOTS, zones: ZONES, soil: floorSoil, pillarHeight: PILLAR_HEIGHT, commune, emerge, startRide, possibleMove, get state() { return JSON.parse(JSON.stringify(progress)); }, get mode() { return mode; }, get at() { return at.id; }, get zone() { return zone.id; }, get vision() { return vision; }, get speed() { return SPEEDS[speed]; }, get ride() { return ride ? { root: ride.root.id, s: ride.s, speed: ride.speed } : null; }, get transitioning() { return !!tween || !!descent || boardTween > 0 || boardView.isBusy || mode === 'ride' || mode === 'shrink' || mode === 'emerge'; },
  // Verification only, behind ?debug: jump the seasons without waiting them out. Not a play path.
  advance: debug ? (days: number) => { advance(progress.w, days, ridingFine()); save(); refresh(); } : undefined } });
