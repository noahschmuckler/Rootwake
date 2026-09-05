// Rootwake prototype entry (see DESIGN.md).
// Pass 0:   one voxel face — five hand-authored branches with flowers,
//           tap-to-select, 3-same-colour match, staggered recede.
// Pass 0.1a: lock/unlock camera transition into that face and back.
// Pass 0.2: the confinement→vista test. A tight thicket of 8 voxels around a
//           dark start pocket, first-person touch movement, whole-voxel
//           resolve once a voxel is cleared, one bright way out.
// Pass 0.3a: the match-3 pivot. A real board of 3D gems in the locked view;
//           runs fire shots at the flower of their colour, fill its pool,
//           recede it; five receded flowers resolve the voxel.
// Pass 0.3b: waypoint movement — hold, pick a marker ahead, release to hop.
// Pass 0.4:  the trees do the confining (no hedge/canopy), rock ground, and
//           tillable grass patches — a second interactable with one shared
//           pool, worked from a look-down lock.
// Pass 0.5:  the plateau ends at a cliff. The edge refuses steps; below and
//           beyond, a landscape you can only look at.
// Pass 0.6a: objects have weight. A cleared tree topples and leaves a log,
//           sticks and seeds where it stood; the footprint is blocked ground
//           until they're moved.
// Pass 0.6b: hands. Two boxes; drag a hand to a thing to take or place it;
//           two hands drag a log on a luminescent leash.
// Pass 0.6c: planting. Seeds onto tilled ground grow a sapling into a new
//           tree — the first regrowth, and the player's to choose.
// Still out of scope: combat, specials, the 6-face mirror, a real field, art.

import * as THREE from 'three';
import { CameraRig, lockedPoseFor, type CameraMode } from './cameraLock';
import { Player } from './player';
import { Voxel } from './voxel';
import { Patch } from './patch';
import type { Interactable } from './interactable';
import { buildWorld, EDGE_MARGIN, GROUND_Y } from './world';
import { ObjectWorld } from './objects';
import { Hands, DRAG_FAN_SCALE, DRAG_MOVE_SLOWDOWN } from './hands';
import { PLANT_SEEDS } from './growth';
import { BoardView } from './board3d';
import { Projectiles } from './projectiles';
import { PALETTE } from './colors';

// ---- URL params -------------------------------------------------------------
// `?seed=N` for a repeatable set of boards (R reloads with a fresh one).
// `?slowmo=N` runs the recede, resolve and camera tweens at 1/N speed.
const params = new URLSearchParams(window.location.search);
const seed = Number.parseInt(params.get('seed') ?? '', 10) || 1;
const slowmo = Math.max(1, Number.parseFloat(params.get('slowmo') ?? '') || 1);

// ---- Scene / camera / renderer ---------------------------------------------
const scene = new THREE.Scene();
const BASE_FOV = 40;
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.05, 4000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const world = buildWorld(scene);
const cameraRig = new CameraRig(camera);
// The board rides on the camera so "ahead and below, tilted" is a constant.
scene.add(camera);
const boardView = new BoardView(camera);
const projectiles = new Projectiles(scene);
const objects = new ObjectWorld(scene);
const player = new Player(renderer.domElement, scene, camera);
player.position.set(0, GROUND_Y, 0);
// Face away from the way out, so the vista is something you find, not something you're shown.
player.yaw = Math.PI / 2;

const hands = new Hands(
  camera,
  player,
  objects,
  scene,
  [...document.querySelectorAll<HTMLElement>('#hands .hand')],
  document.getElementById('links') as unknown as SVGSVGElement,
  GROUND_Y,
  (p) => world.isWalkable(p)
);
// Seeds released over a tilled patch plant it (Pass 0.6c).
hands.placeOnTarget = (x, y, type, count) => {
  if (type.id !== 'seed') return null;
  castFrom(x, y);
  const hit = raycaster.intersectObjects(patches.flatMap((p) => p.lockTargets), false)[0];
  if (!hit) return null;
  const patch = hit.object.userData.interactable as Patch;
  if (patch.distanceTo(player.position) > patch.lockReach) {
    hands.notice = 'Out of reach.';
    return 0;
  }
  if (!patch.acceptsSeeds) {
    hands.notice = patch.status === 'planted' ? 'Already planted.' : 'Till it first.';
    return 0;
  }
  if (count < PLANT_SEEDS) {
    hands.notice = `Needs ${PLANT_SEEDS} seeds.`;
    return 0;
  }
  const used = patch.plant(count, animClock);
  updateHud();
  return used;
};

// ---- The thicket ------------------------------------------------------------
// Pass 0.4a: the trees do the confining. Voxels sit on a hex lattice around
// the start, three rings deep, faces turned toward the start, so every
// direction is roughly three voxels thick before open rock. The one way out
// is kept as before: a sector toward +X is cleared in rings 2–3, and the two
// staggered voxels behind the +X ring voxel stand in it — clear the ring
// voxel to see them, clear one of them to get out. Tuning: LATTICE_SPACING
// sets how cramped everything is; at 2.45 cube corners nearly touch.
const LATTICE_SPACING = 2.45;
const LATTICE_RINGS = 3;
/** Half-angle of the cleared sector toward +X (rings 2–3 only). */
const OPENING_HALF_ANGLE = (35 * Math.PI) / 180;
const START = new THREE.Vector3(0, 0, 0);
const voxels: Voxel[] = [];
const addVoxel = (pos: THREE.Vector3, faceToward: THREE.Vector3) =>
  voxels.push(new Voxel(voxels.length, pos, faceToward, seed * 131 + voxels.length * 17));

for (let i = -LATTICE_RINGS; i <= LATTICE_RINGS; i++) {
  for (let j = -LATTICE_RINGS; j <= LATTICE_RINGS; j++) {
    const ring = Math.max(Math.abs(i), Math.abs(j), Math.abs(i + j)); // axial hex distance
    if (ring === 0 || ring > LATTICE_RINGS) continue;
    const x = LATTICE_SPACING * (i + j / 2);
    const z = LATTICE_SPACING * j * (Math.sqrt(3) / 2);
    if (ring >= 2 && Math.abs(Math.atan2(z, x)) < OPENING_HALF_ANGLE) continue;
    addVoxel(new THREE.Vector3(x, 0, z), START);
  }
}
// The staggered pair in the corridor. ±1.4 leaves a 0.8 slit between them
// (a glimpse, not a way through) and closes the gap to the ring-3 voxels
// beside them, so the only way past is to clear one.
const slot = new THREE.Vector3(LATTICE_SPACING, 0, 0); // where the player stands once the +X ring voxel is gone
for (const z of [-1.4, 1.4]) addVoxel(new THREE.Vector3(LATTICE_SPACING * 2, 0, z), slot);
for (const v of voxels) scene.add(v.group);

// ---- Tillable ground ---------------------------------------------------------
// Pass 0.4b. Authored positions that read as a grid (2.5 apart, a couple of
// cells left as rock) without the world being a grid: one under your feet in
// the pocket, one in the corridor, the rest out on the open rock past the
// opening. Patches never collide.
const patches: Patch[] = [];
const PATCH_POSITIONS: [number, number][] = [
  [0, 0],
  [LATTICE_SPACING * 3, 0],
  [10.5, -2.5], [10.5, 0], [10.5, 2.5],
  [13, -2.5], [13, 2.5],
  [15.5, 0], [15.5, 2.5],
];
for (const [x, z] of PATCH_POSITIONS) {
  patches.push(new Patch(patches.length, new THREE.Vector3(x, GROUND_Y, z), seed * 977 + patches.length * 23));
}
for (const p of patches) scene.add(p.group);

const interactables: Interactable[] = [...voxels, ...patches];

// ---- Felling aftermath (Pass 0.6a) ---------------------------------------------
// Thud → camera shake. Done → the log lies along the fall, sticks and seeds
// around it, and a blocked footprint patch under all of it.
const SHAKE_MS = 320;
const SHAKE_AMP = 0.045;
let shakeUntil = -1;
const shakeOffset = new THREE.Vector3();
for (const v of voxels) {
  v.onThud = () => {
    shakeUntil = animClock + SHAKE_MS;
  };
}
/** Pass 0.6c: a grown sapling becomes a tree where its patch was. */
function onSaplingGrown(patch: Patch): void {
  const v = new Voxel(voxels.length, new THREE.Vector3(patch.center.x, 0, patch.center.z), player.position.clone(), seed * 131 + 4000 + voxels.length * 17);
  v.onDone = onInteractableDone;
  v.onThud = () => {
    shakeUntil = animClock + SHAKE_MS;
  };
  voxels.push(v);
  interactables.push(v);
  scene.add(v.group);
  scene.remove(patch.group);
  patches.splice(patches.indexOf(patch), 1);
  interactables.splice(interactables.indexOf(patch), 1);
  updateHud();
}
for (const p of patches) p.onGrown = onSaplingGrown;

function onTreeFelled(v: Voxel): void {
  const dir = v.normal; // the face the lock chose = the side it fell toward
  objects.scatterFelledTree(v.center, dir, GROUND_Y, seed * 53 + v.index);
  const footprint = new Patch(patches.length, new THREE.Vector3(v.center.x, GROUND_Y, v.center.z), seed * 977 + 500 + v.index, true);
  footprint.onDone = onInteractableDone;
  footprint.onGrown = onSaplingGrown;
  patches.push(footprint);
  interactables.push(footprint);
  scene.add(footprint.group);
}

// ---- Lock / unlock plumbing --------------------------------------------------
let locked: Interactable | null = null;
/** After a locked voxel resolves, hold this long on the empty spot, then back out to reveal the gap. */
const RELEASE_HOLD_MS = 450;
let autoUnlockAt: number | null = null;

function onInteractableDone(done: Interactable): void {
  if (done === locked && cameraRig.mode === 'locked') autoUnlockAt = animClock + RELEASE_HOLD_MS;
  if (done.kind === 'voxel' && (done as Voxel).ending === 'fell') onTreeFelled(done as Voxel);
  updateHud();
}
for (const it of interactables) it.onDone = onInteractableDone;

/** Radius around the locked camera position inside which a neighbour is faded. */
const FADE_NEAR_CAMERA = 2.4;
/** Neighbours on the camera's side of the target, within this lateral distance of the view axis, are faded. */
const FADE_CORRIDOR = 2.6;
/**
 * Which neighbours to drop out of the locked view: the one the camera is
 * inside, and the ones between or beside the camera and the face — they
 * clutter the puzzle read. Anything *behind* the face plane stays, so what
 * is beyond the voxel you're clearing keeps blocking the light until you
 * clear it too.
 */
/** For a look-down lock on a patch, voxels this close to the patch would loom into the frame. */
const FADE_NEAR_PATCH = 2.3;
function obstructsLockedView(v: Voxel, target: Interactable): boolean {
  if (target.kind === 'patch') return v.distanceTo(target.center) < FADE_NEAR_PATCH;
  const locked = target as Voxel;
  const pose = lockedPoseFor(locked.center, locked.normal); // the face the lock chose
  const c = v.center;
  if (c.distanceTo(pose.position) < FADE_NEAR_CAMERA) return true;
  const toCamera = locked.normal; // face normal points from the face toward the locked camera
  const cameraSide = c.clone().sub(locked.center).dot(toCamera) > 0.5;
  if (!cameraSide) return false;
  const axis = pose.target.clone().sub(pose.position).normalize();
  const rel = c.clone().sub(pose.position);
  const lateral = rel.clone().sub(axis.multiplyScalar(rel.dot(axis))).length();
  return lateral < FADE_CORRIDOR;
}

// ---- HUD --------------------------------------------------------------------
const hud = document.getElementById('hud')!;
const hint = document.getElementById('hint')!;
const backButton = document.getElementById('back') as HTMLButtonElement;

const HINTS: Record<CameraMode, string> = {
  free: 'Hold on the left to move, drag to look, tap growth or grass to lock in. Drag a hand box to a thing to take or place it.',
  locking: '',
  locked: '',
  unlocking: '',
};
function applyMode(mode: CameraMode): void {
  hint.textContent = mode === 'locked' && locked ? locked.hintLocked : HINTS[mode];
  player.enabled = mode === 'free';
  if (mode !== 'free') setFov(BASE_FOV); // the edge widen is a free-view thing; the board lays out at base
  if (mode === 'locked' && locked) {
    boardView.bind(locked.board);
    boardView.show(animClock);
  }
  if (mode === 'unlocking') boardView.hide();
  if (mode === 'free') {
    boardView.unbind();
    locked = null;
  }
  updateHud();
}

// A run cleared on the board: shoot at the flower it targets; the hit feeds the pool.
boardView.onRun = (run, origin) => {
  const it = locked;
  if (!it) return;
  const target = it.targetFor(run);
  if (target === null) return;
  const amount = run.cells.length;
  projectiles.fire(origin, it.targetWorldPosition(target), PALETTE[run.type].hex, animClock, () => {
    it.feed(target, amount, animClock);
    updateHud();
  });
};
cameraRig.onModeChange = applyMode;
backButton.addEventListener('click', () => {
  if (cameraRig.mode === 'locked') cameraRig.unlock(animClock, playerPose());
});

function playerPose() {
  const eye = player.eye();
  return { position: eye, target: eye.clone().add(player.forward()) };
}

function updateHud(): void {
  const resolved = voxels.filter((v) => v.status === 'resolved').length;
  const tilled = patches.filter((p) => p.status === 'resolved').length;
  const planted = patches.filter((p) => p.status === 'planted').length;
  const parts = [`seed ${seed}`, `cleared ${resolved}/${voxels.length}`, `tilled ${tilled}/${patches.length}`];
  if (planted) parts.push(`planted ${planted}`);
  if (slowmo > 1) parts.push(`slowmo ×${slowmo}`);
  if (locked && cameraRig.mode === 'locked' && locked.status === 'growing') {
    parts.push(locked.poolText());
  }
  parts.push('R: new arrangement');
  hud.textContent = parts.join(' · ');
  backButton.hidden = !(cameraRig.mode === 'locked' && locked?.status === 'growing');
}

// ---- Vertigo at the lip (Pass 0.5, nice-to-have) ----------------------------
// Within EDGE_VERTIGO_RANGE of the cliff line the FOV widens a little and the
// eye dips, ramping to full at EDGE_MARGIN. Calibration, not mechanic.
const EDGE_VERTIGO_RANGE = 1.6;
const EDGE_FOV_WIDEN = 9;
const EDGE_EYE_DIP = 0.08;
function setFov(fov: number): void {
  if (Math.abs(camera.fov - fov) < 1e-3) return;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  boardView.layout();
}
function edgeCloseness(): number {
  const d = world.distanceToEdge(player.position) - EDGE_MARGIN;
  return THREE.MathUtils.clamp(1 - d / EDGE_VERTIGO_RANGE, 0, 1);
}

// ---- Input ------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function castFrom(clientX: number, clientY: number): void {
  pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
}

let tooFarUntil = 0;
player.onTap = (x, y) => {
  castFrom(x, y);
  if (cameraRig.mode === 'free') {
    const targets = interactables.filter((it) => it.status === 'growing').flatMap((it) => it.lockTargets);
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (!hit) return;
    const it = hit.object.userData.interactable as Interactable;
    if (it.distanceTo(player.position) > it.lockReach) {
      hint.textContent = 'Closer.';
      tooFarUntil = animClock + 900;
      return;
    }
    locked = it;
    cameraRig.lock(animClock, it.lockPose({ position: player.position, forward: player.forward() }));
  } else if (cameraRig.mode === 'locked' && locked) {
    if (boardView.tap(raycaster)) updateHud();
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    const next = new URL(window.location.href);
    next.searchParams.set('seed', String(Math.floor(Math.random() * 1_000_000)));
    window.location.href = next.toString();
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  boardView.layout();
});

// ---- Loop -------------------------------------------------------------------
// Animation clock in ms, scaled by slowmo so every tuning constant stays in
// real-speed milliseconds. Movement uses real time — slowmo is for watching
// animations, not for hopping.
let animClock = 0;
let lastFrame = performance.now();
applyMode(cameraRig.mode);
player.applyCamera(camera);

function animate(now: number): void {
  requestAnimationFrame(animate);

// Debug handle for headless/console poking. Not part of the design surface.
(window as unknown as { __rootwake: unknown }).__rootwake = { scene, camera, renderer, player, voxels, patches, objects, hands, world, cameraRig, boardView };
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  animClock += (dt * 1000) / slowmo;
  lastFrame = now;

  if (cameraRig.mode === 'free') {
    const colliders = voxels.flatMap((v) => v.collider() ?? []);
    player.update(now, colliders, world.isWalkable);
    player.applyCamera(camera);
    const k = edgeCloseness();
    setFov(BASE_FOV + EDGE_FOV_WIDEN * k);
    camera.position.y -= EDGE_EYE_DIP * k;
  }
  // Encumbrance: dragging shortens and slows hops; straining stops them.
  player.fanScale = hands.dragging ? DRAG_FAN_SCALE : 1;
  player.moveSlowdown = hands.dragging ? DRAG_MOVE_SLOWDOWN : 1;
  player.canMove = !hands.straining;
  hands.update(animClock);
  if (hands.notice) {
    hint.textContent = hands.notice;
    hands.notice = null;
    tooFarUntil = animClock + 1200;
  }
  cameraRig.update(animClock);

  // Thud shake: applied on top of whoever owns the camera this frame, removed before they run again.
  camera.position.sub(shakeOffset);
  shakeOffset.set(0, 0, 0);
  if (animClock < shakeUntil) {
    const k = (shakeUntil - animClock) / SHAKE_MS;
    shakeOffset.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0).multiplyScalar(SHAKE_AMP * k * k);
    camera.position.add(shakeOffset);
  }

  // A patch with anything lying on it is blocked ground.
  for (const p of patches) {
    if (p.status === 'resolved' || p.status === 'resolving' || p.status === 'planted') continue;
    p.setBlocked(objects.overlapsSquare(p.center.x, p.center.z, p.footprintHalf).length > 0);
  }

  if (autoUnlockAt !== null && animClock >= autoUnlockAt) {
    autoUnlockAt = null;
    cameraRig.unlock(animClock, playerPose());
  }
  if (tooFarUntil && animClock >= tooFarUntil) {
    tooFarUntil = 0;
    hint.textContent = HINTS[cameraRig.mode];
  }

  // The locked framing sits 4.6 back from the face, which in a tight
  // thicket means inside or right beside a neighbour. Those neighbours — the
  // ones the camera is in, or looking through — fade out on the way in and
  // back on the way out. Everything else stays: what's behind the voxel you
  // are clearing must keep blocking the light until you clear it too, or
  // the locked view gives the vista away.
  const lockedness = cameraRig.lockedness();
  for (const v of voxels) {
    const fade = locked && v !== locked && obstructsLockedView(v, locked) ? 1 - lockedness : 1;
    v.setFade(fade);
  }
  for (const it of interactables) it.update(animClock);

  // The board's job is done once its target starts resolving (or is tilled): get out of the way.
  if (locked && locked.status !== 'growing') boardView.hide();
  boardView.update(animClock);
  projectiles.update(animClock);

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

// Debug handle for headless/console poking. Not part of the design surface.
(window as unknown as { __rootwake: unknown }).__rootwake = { scene, camera, renderer, player, voxels, patches, objects, hands, world, cameraRig, boardView };
