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
// Still out of scope: combat, specials, the 6-face mirror, a real field, art.

import * as THREE from 'three';
import { CameraRig, type CameraMode } from './cameraLock';
import { Player } from './player';
import { Voxel, LOCK_REACH } from './voxel';
import { buildWorld, GROUND_Y } from './world';
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
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 300);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

buildWorld(scene);
const cameraRig = new CameraRig(camera);
// The board rides on the camera so "ahead and below, tilted" is a constant.
scene.add(camera);
const boardView = new BoardView(camera);
const projectiles = new Projectiles(scene);
const player = new Player(renderer.domElement, scene, camera);
player.position.set(0, GROUND_Y, 0);
// Face away from the way out, so the vista is something you find, not something you're shown.
player.yaw = Math.PI / 2;

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

// ---- Lock / unlock plumbing --------------------------------------------------
let lockedVoxel: Voxel | null = null;
/** After a locked voxel resolves, hold this long on the empty spot, then back out to reveal the gap. */
const RELEASE_HOLD_MS = 450;
let autoUnlockAt: number | null = null;

for (const v of voxels) {
  v.onResolved = (voxel) => {
    if (voxel === lockedVoxel && cameraRig.mode === 'locked') autoUnlockAt = animClock + RELEASE_HOLD_MS;
    updateHud();
  };
}

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
function obstructsLockedView(v: Voxel, locked: Voxel): boolean {
  const pose = locked.lockPose();
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
  free: 'Hold on the left to pick a spot, release to move. Drag to look. Tap the growth to lock in.',
  locking: '',
  locked: 'Tap a gem, then a neighbour, to swap. Matches feed the flower of their colour.',
  unlocking: '',
};
function applyMode(mode: CameraMode): void {
  hint.textContent = HINTS[mode];
  player.enabled = mode === 'free';
  if (mode === 'locked' && lockedVoxel) {
    boardView.bind(lockedVoxel.board);
    boardView.show(animClock);
  }
  if (mode === 'unlocking') boardView.hide();
  if (mode === 'free') {
    boardView.unbind();
    lockedVoxel = null;
  }
  updateHud();
}

// A run cleared on the board: shoot at the flower it targets; the hit feeds the pool.
boardView.onRun = (run, origin) => {
  const voxel = lockedVoxel;
  if (!voxel) return;
  const target = voxel.targetFor(run);
  if (target === null) return;
  const amount = run.cells.length;
  projectiles.fire(origin, voxel.flowerWorldPosition(target), PALETTE[run.type].hex, animClock, () => {
    voxel.feed(target, amount, animClock);
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
  const parts = [`seed ${seed}`, `cleared ${resolved}/${voxels.length}`];
  if (slowmo > 1) parts.push(`slowmo ×${slowmo}`);
  if (lockedVoxel && cameraRig.mode === 'locked' && lockedVoxel.status === 'growing') {
    parts.push(lockedVoxel.poolText());
  }
  parts.push('R: new arrangement');
  hud.textContent = parts.join(' · ');
  backButton.hidden = !(cameraRig.mode === 'locked' && lockedVoxel?.status === 'growing');
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
    const targets = voxels.filter((v) => v.status === 'growing').flatMap((v) => v.lockTargets);
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (!hit) return;
    const voxel = hit.object.userData.voxel as Voxel;
    if (voxel.distanceTo(player.position) > LOCK_REACH) {
      hint.textContent = 'Closer.';
      tooFarUntil = animClock + 900;
      return;
    }
    lockedVoxel = voxel;
    cameraRig.lock(animClock, voxel.lockPose());
  } else if (cameraRig.mode === 'locked' && lockedVoxel) {
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
(window as unknown as { __rootwake: unknown }).__rootwake = { scene, camera, renderer, player, voxels, cameraRig, boardView };
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  animClock += (dt * 1000) / slowmo;
  lastFrame = now;

  if (cameraRig.mode === 'free') {
    const colliders = voxels.flatMap((v) => v.collider() ?? []);
    player.update(now, colliders);
    player.applyCamera(camera);
  }
  cameraRig.update(animClock);

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
    const fade = lockedVoxel && v !== lockedVoxel && obstructsLockedView(v, lockedVoxel) ? 1 - lockedness : 1;
    v.setFade(fade);
  }
  for (const v of voxels) v.update(animClock);

  // The board's job is done once its voxel starts resolving: get out of the way of the beat.
  if (lockedVoxel && lockedVoxel.status !== 'growing') boardView.hide();
  boardView.update(animClock);
  projectiles.update(animClock);

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

// Debug handle for headless/console poking. Not part of the design surface.
(window as unknown as { __rootwake: unknown }).__rootwake = { scene, camera, renderer, player, voxels, cameraRig, boardView };
