import './karst.css';
import * as THREE from 'three';
import { Player } from './player';
import { installMobilityControls } from './mobilityControls';
import { buildKarst, plantsOf } from './karstWorld';
import { PLANTS, ROOTS, ZONES, CAVERN, PILLAR_HEIGHT, inZone, relief, rootsAt, otherEnd, stepRide, ridePoint, vec, parseProgress, freshProgress, arrive, type Root, type Plant } from './karstModel';
const KEY = 'rootwake-karst-v1';
let progress = freshProgress(); try { progress = parseProgress(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const btn = (id: string) => el<HTMLButtonElement>(id);
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(67, innerWidth / innerHeight, 0.04, 260); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#f2f6ea', '#5a6a60', 2.4); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.4); sun.position.set(-30, 60, 20); scene.add(sun);
const lantern = new THREE.PointLight('#e8d9a8', 0, 6, 1.5); camera.add(lantern);
const world = buildKarst(scene);
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); installMobilityControls(player);
type Mode = 'surface' | 'choose' | 'shrink' | 'ride' | 'arrive' | 'emerge';
let mode: Mode = 'surface', time = 0, last = performance.now(), noticeUntil = 0, uiClock = 0, lastZone = '', vision = 0;
let zone = ZONES[PLANTS[progress.at].zone];
let at: Plant = PLANTS[progress.at];
let ride: { root: Root; from: string; s: number; speed: number } | null = null;
let tween: { from: THREE.Vector3; to: THREE.Vector3; fromQ: THREE.Quaternion; toQ: THREE.Quaternion; t: number; seconds: number; then: () => void } | null = null;
let lookTarget: { yaw: number; pitch: number; t: number } | null = null;
const intro = el<HTMLDialogElement>('intro');
const rideBase = new THREE.Quaternion(), rideLook = new THREE.Quaternion(), rideMatrix = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0);
function standAt(p: Plant): void {
  zone = ZONES[p.zone]; at = p; player.position.y = zone.y; player.standHeightAt = relief;
  player.teleport(p.stand.x, p.stand.z, p.stand.yaw); player.pitch = p.zone === 'summit' ? -0.05 : 0.05;
}
function nearestPlant(): { plant: Plant; distance: number } {
  const feet = player.feet(); let best = { plant: at, distance: Infinity };
  for (const p of plantsOf(zone.id)) { const d = Math.hypot(feet.x - p.at.x, feet.z - p.at.z); if (d < best.distance) best = { plant: p, distance: d }; }
  return best;
}
const COMMUNE_RANGE = 3.2;
const canCommune = () => mode === 'surface' && nearestPlant().distance < COMMUNE_RANGE;
function message(text: string, seconds = 8) { el('story').textContent = text; noticeUntil = time + seconds * 1000; }
function placeName(p: Plant): string { return p.zone === 'summit' ? 'the summit' : p.zone === 'cavern' ? 'the water cavern' : p.zone === 'floor' ? 'the forest floor' : `the ${p.zone} ledge`; }
function defaultMessage() {
  if (time < noticeUntil) return;
  const near = nearestPlant();
  if (mode === 'surface') {
    if (zone.id === 'summit') el('story').textContent = progress.returned ? 'Back on the top, by another way. The whole pillar is one plant now, as far as your roots know.' : progress.reachedFloor ? 'The summit again. You know the way down; the pillar has more than one way up.' : 'The top of the karst: a few paces of stone and one pine. Below, the forest. Commune with the pine to follow its roots down.';
    else if (zone.id === 'cavern') el('story').textContent = 'A cavern inside the mountain. Water pools in the dark; the mushrooms give the only light. A fern here knows the way on.';
    else if (zone.id === 'floor') el('story').textContent = progress.reachedFloor ? 'The forest at the foot of the pillar. Look up: the top is where you woke. The oak and the maple each know a way back.' : 'The forest floor.';
    else el('story').textContent = `A ledge on the ${zone.id} face. The ${near.plant.kind} clings here with no soil at all; its roots go on across the stone.`;
  } else if (mode === 'choose' || mode === 'arrive') el('story').textContent = `${at.name[0].toUpperCase()}${at.name.slice(1)} is joined to ${rootsAt(at.id).length === 1 ? 'one other plant' : `${rootsAt(at.id).length} others`}. Choose a root to ride, or ${mode === 'arrive' ? 'emerge here' : 'stay'}.`;
}
function refresh() {
  document.body.dataset.mode = mode;
  const near = nearestPlant();
  el('mode-name').textContent = mode === 'ride' ? `Riding ${ride ? PLANTS[otherEnd(ride.root, ride.from)].name : ''}` : mode === 'shrink' ? 'Shrinking' : mode === 'emerge' ? 'Emerging' : mode === 'choose' || mode === 'arrive' ? `Within ${at.name}` : placeName(at)[0].toUpperCase() + placeName(at).slice(1);
  const met = progress.visited.length, total = Object.keys(PLANTS).length; el('progress').textContent = `${met} of ${total} plants`; el('progress-fill').style.width = `${met / total * 100}%`;
  btn('walk').hidden = mode !== 'surface';
  btn('vision').classList.toggle('on', progress.vision); btn('vision').innerHTML = progress.vision ? 'Stone sight<small>See the limestone as stone again</small>' : 'Root vision<small>See the roots through the stone</small>';
  btn('vision').hidden = mode !== 'surface'; btn('orient').hidden = mode !== 'surface';
  btn('commune').hidden = !canCommune(); btn('commune').innerHTML = `Commune with ${near.plant.name.replace(/^the /, 'the ')}<small>Shrink into its roots</small>`;
  const choosing = mode === 'choose' || mode === 'arrive';
  el('rides').hidden = !choosing; btn('emerge').hidden = !choosing; btn('emerge').innerHTML = mode === 'arrive' ? 'Emerge here<small>Grow back to your size</small>' : 'Stay<small>Step back out of the root</small>';
  if (choosing) el('rides').innerHTML = rootsAt(at.id).map(r => { const to = PLANTS[otherEnd(r, at.id)]; const climb = to.at.y > at.at.y + 1; return `<button data-root="${r.id}" class="${climb ? 'up' : 'down'}"><b>${climb ? 'CLIMB' : r.interior ? 'INTO THE STONE' : 'SLIDE'} · ${Math.round(r.length)} m</b>Ride to ${to.name}<small>${placeName(to)}${progress.visited.includes(to.id) ? '' : ' · unmet'}</small></button>`; }).join('');
  for (const b of el('rides').querySelectorAll<HTMLButtonElement>('button')) b.onclick = () => startRide(ROOTS.find(r => r.id === b.dataset.root)!);
  el('instruction').textContent = mode === 'ride' ? 'Drag to look around the root as it carries you.' : choosing ? 'Pick a root, or emerge.' : 'Drag to look. Stick to move; hold its centre for targets.';
  defaultMessage();
}
function beginTween(from: THREE.Vector3, to: THREE.Vector3, toQ: THREE.Quaternion, seconds: number, then: () => void): void {
  tween = { from: from.clone(), to: to.clone(), fromQ: camera.quaternion.clone(), toQ: toQ.clone(), t: 0, seconds, then };
}
function lookQuaternion(from: THREE.Vector3, to: THREE.Vector3): THREE.Quaternion { rideMatrix.lookAt(from, to, up); return new THREE.Quaternion().setFromRotationMatrix(rideMatrix); }
function commune(): void {
  if (!canCommune()) return; at = nearestPlant().plant; player.cancelInput(); player.canMove = false; lookTarget = null;
  if (!progress.visited.includes(at.id)) { progress.visited.push(at.id); save(); }
  // Shrinking: the eye sinks to the root's mouth at the plant's foot, where everything is suddenly large.
  mode = 'shrink';
  beginTween(camera.position, at.mouth.clone().add(vec(0, 0.12, 0)), lookQuaternion(at.mouth.clone().add(vec(0, 0.12, 0)), at.at.clone().add(vec(0, 0.4, 0))), 1.6, () => { mode = 'choose'; refresh(); });
  message(`You listen to ${at.name}. The ground rises around you as you shrink toward the mouth of its root.`, 6); refresh();
}
function startRide(root: Root): void {
  if (mode !== 'choose' && mode !== 'arrive') return;
  ride = { root, from: at.id, s: 0, speed: 0 }; mode = 'ride'; player.yaw = 0; player.pitch = 0; player.cancelInput(); tween = null;
  const to = PLANTS[otherEnd(root, at.id)];
  message(to.at.y < at.at.y - 1 ? `The root takes you. Downhill it runs like water${root.interior ? ', into the stone' : ', over the face'}.` : 'Upward the root draws you slowly, the way water climbs a stem.', 5); refresh();
}
function finishRide(): void {
  if (!ride) return; const to = PLANTS[otherEnd(ride.root, ride.from)]; const outcome = arrive(progress, to.id); at = to; zone = ZONES[to.zone]; ride = null; mode = 'arrive'; save();
  if (outcome === 'floor') message('The forest floor, at the foot of the pillar you woke on. Emerge and look up; then find a way back to the top.', 12);
  else if (outcome === 'returned') message('The summit, reached from below by the roots. Every plant on this pillar is one body that you have now travelled.', 12);
  else if (to.zone === 'cavern') message('The root opens into a cavern inside the mountain: water, and the cold light of mushrooms. Emerge here, or ride on.', 10);
  else message(`You arrive in ${to.name}. Emerge onto ${placeName(to)}, or choose another root.`, 7);
  refresh();
}
function emerge(): void {
  if (mode !== 'arrive' && mode !== 'choose') return;
  const p = at; mode = 'emerge'; player.position.y = ZONES[p.zone].y; player.standHeightAt = relief; zone = ZONES[p.zone];
  player.teleport(p.stand.x, p.stand.z, p.stand.yaw); player.pitch = p.zone === 'summit' ? -0.05 : 0.05; player.canMove = false;
  const eye = player.eye(); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
  beginTween(camera.position, eye, q, 1.4, () => { mode = 'surface'; player.canMove = true; player.cancelInput(); progress.at = p.id; save(); refresh(); });
  refresh();
}
function orient(): void {
  if (mode !== 'surface') return; const p = nearestPlant().plant; const d = p.at.clone().add(vec(0, 0.8, 0)).sub(player.eye());
  lookTarget = { yaw: Math.atan2(-d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)), t: 0 };
}
btn('vision').onclick = () => { progress.vision = !progress.vision; save(); refresh(); message(progress.vision ? 'The limestone goes glassy. Roots drape over its faces and thread its body; one leads into a hollow at its heart.' : 'The stone is stone again.', 6); };
btn('commune').onclick = commune; btn('emerge').onclick = emerge; btn('orient').onclick = orient;
btn('help').onclick = () => { player.cancelInput(); intro.showModal(); }; btn('begin').onclick = () => { intro.close(); last = performance.now(); };
btn('reset').onclick = () => { if (mode !== 'surface') return; if (!confirm('Restart the karst? Earlier studies are unaffected.')) return; progress = freshProgress(); save(); location.reload(); };
renderer.domElement.addEventListener('pointerdown', () => { lookTarget = null; });
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); });
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
const skyColour = new THREE.Color('#aab8b3'), cavernColour = new THREE.Color('#061312'), rootColour = new THREE.Color('#2a1d0c'), colour = new THREE.Color();
function frame(now: number) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; if (document.hidden || intro.open) return; time += dt * 1000;
  player.update(now, mode === 'surface' ? world.colliders : [], p => inZone(zone, p.x, p.z));
  if (lookTarget) { lookTarget.t += dt; const dy = Math.atan2(Math.sin(lookTarget.yaw - player.yaw), Math.cos(lookTarget.yaw - player.yaw)); player.yaw += dy * Math.min(1, dt * 9); player.pitch += (lookTarget.pitch - player.pitch) * Math.min(1, dt * 9); if (lookTarget.t > 1) lookTarget = null; }
  if (mode === 'surface') player.applyCamera(camera);
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
  camera.updateMatrixWorld();
  // Sight through the stone: chosen on the surface, always while shrunk into a root.
  const wantVision = progress.vision || mode !== 'surface' ? 1 : 0; vision += (wantVision - vision) * Math.min(1, dt * 3);
  world.update(vision, time, mode === 'ride' && ride ? ride.root : null, camera.position);
  const inCavern = camera.position.distanceTo(CAVERN.centre) < CAVERN.radius + 0.5, inRoot = mode === 'ride' || mode === 'choose' || mode === 'arrive' || mode === 'shrink';
  colour.copy(inCavern ? cavernColour : skyColour); if (inRoot && !inCavern) colour.lerp(rootColour, 0.75);
  scene.background = colour; scene.fog = new THREE.FogExp2(colour, inCavern ? 0.05 : inRoot ? 0.06 : 0.011);
  lantern.intensity = inRoot ? 3 : inCavern ? 1.2 : 0; hemi.intensity = inCavern ? 0.6 : 2.4; sun.intensity = inCavern ? 0.2 : 2.4;
  const near = nearestPlant(); const key = `${mode}:${near.distance < COMMUNE_RANGE ? near.plant.id : ''}`; uiClock += dt; if (key !== lastZone || uiClock > 0.4) { refresh(); uiClock = 0; lastZone = key; }
  el('bearing').hidden = mode === 'ride'; el('bearing').textContent = mode === 'surface' ? `${placeName(at)[0].toUpperCase()}${placeName(at).slice(1)} · ${Math.round(zone.y)} m up · ${near.plant.name} ${near.distance.toFixed(0)} m` : `${at.name} · ${Math.round(at.at.y)} m up`;
  const target = mode === 'surface' ? near.plant : null; if (target) { const screen = target.at.clone().add(vec(0, 1.2, 0)).project(camera); el('label').hidden = screen.z > 1 || Math.abs(screen.x) > 0.85 || Math.abs(screen.y) > 0.7 || near.distance < COMMUNE_RANGE; el('label').style.left = `${(screen.x + 1) * innerWidth / 2}px`; el('label').style.top = `${(1 - screen.y) * innerHeight / 2}px`; el('label').textContent = target.name.replace(/^the /, '').toUpperCase(); } else el('label').hidden = true;
  renderer.render(scene, camera);
}
standAt(at); refresh(); player.applyCamera(camera); world.update(0, 0, null, camera.position); scene.background = skyColour; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __karst: { scene, camera, renderer, player, plants: PLANTS, roots: ROOTS, zones: ZONES, pillarHeight: PILLAR_HEIGHT, commune, emerge, startRide, get state() { return JSON.parse(JSON.stringify(progress)); }, get mode() { return mode; }, get at() { return at.id; }, get zone() { return zone.id; }, get vision() { return vision; }, get ride() { return ride ? { root: ride.root.id, s: ride.s, speed: ride.speed } : null; }, get transitioning() { return !!tween || mode === 'ride' || mode === 'shrink' || mode === 'emerge'; } } });
