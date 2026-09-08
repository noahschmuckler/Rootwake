// Underworld U0 — the metallurgist. A second character in a second place,
// on the same engine: the board, the lock, the hands, the walk, the
// crafting. He wakes in the centre cell of a 3x3 block of ore-bearing
// boulders inside a 5x5 chamber of bare rock. Fully energized, he sees in
// the dark; the board superheats the ore in a boulder until the rock
// vaporizes and leaves molten metal that sets into an ingot; an ingot
// long-pressed offers the dagger blueprint, and a dagger melts back. Bare
// rock is immune. As his energy goes his sight narrows to a tunnel and his
// darksight shortens and he slows — but he is never blind and never falls.
//
// This file is the underworld's main.ts: wiring only.

import * as THREE from 'three';
import { CameraRig, type CameraMode, type CameraPose } from './cameraLock';
import { Player, THIRD_ZOOM_MIN, THIRD_ZOOM_MAX } from './player';
import type { Interactable } from './interactable';
import { ObjectWorld, OBJECT_TYPES, HANDS, handsToLift, buildLook, type WorldObject } from './objects';
import { ForgeSite, FORGE_PLANS, type ForgePlan } from './forge';
import { Hands } from './hands';
import { BoardView } from './board3d';
import { Projectiles } from './projectiles';
import { PALETTE } from './colors';
import { CraftSession } from './craft';
import { recipesFor, type Recipe } from './recipes';
import { GROUND_Y, CELL, BOULDER_RADIUS, type TableTop } from './cave';
import type { OreBoulder } from './ore';
import type { CircleCollider } from './player';
import { mulberry32 } from './colors';
import { Energy, DRAIN_HEAT, DRAIN_HOP, CHEST_CHARGE, HELM_CHARGE, HELM_SIGHT } from './energy';
import { EYE_HEIGHT } from './player';
import { Greblins } from './greblins';

/** What the underworld's wiring needs from a place: the cave (`Cave`) or, on the lab branch, an arena. */
export interface World {
  readonly group: THREE.Group;
  readonly boulders: OreBoulder[];
  readonly tables: TableTop[];
  readonly fog: THREE.FogExp2;
  isWalkable(p: THREE.Vector3): boolean;
  groundHeight(x: number, z: number): number;
  cameraClear(p: THREE.Vector3): boolean;
  colliders(): CircleCollider[];
  bareRock(): THREE.Object3D[];
  setSight(cameraPosition: THREE.Vector3, sight: number, boost?: number): void;
}

export interface BootOptions {
  /** Builds the place into the scene. */
  world: (scene: THREE.Scene, seed: number) => World;
  /** Start wearing the chestpiece and helm (the lab: skip the crafting). */
  suit?: boolean;
  /** The greblin miners live in the cave's upper chamber; other places have none. */
  greblins?: boolean;
  /** The free-view hint, if the place's isn't the cave's. */
  freeHint?: string;
  /** Where he starts (x, z on the ground; yaw), if not the cave's centre. */
  spawn?: { x: number; z: number; yaw: number };
  /** Things that live in the place and want a frame each frame (the lab's creature). */
  populate?: (ctx: PopulateContext) => Updatable[];
}
export interface Updatable {
  update(nowMs: number): void;
}
export interface PopulateContext {
  scene: THREE.Scene;
  world: World;
  seed: number;
  player: Player;
  camera: THREE.PerspectiveCamera;
}

export function bootUnder(opts: BootOptions): void {

// ---- URL params -------------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const seed = Number.parseInt(params.get('seed') ?? '', 10) || 1;
const slowmo = Math.max(1, Number.parseFloat(params.get('slowmo') ?? '') || 1);
const debug = params.has('debug');

// ---- Scene / camera / renderer ---------------------------------------------
const scene = new THREE.Scene();
const BASE_FOV = 40;
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.05, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Filmic roll-off: the darksight rides the camera, and physical falloff blows out anything at arm's length otherwise.
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const cave = opts.world(scene, seed);
const cameraRig = new CameraRig(camera);
scene.add(camera);
const boardView = new BoardView(camera);
const projectiles = new Projectiles(scene);
const objects = new ObjectWorld(scene);
const player = new Player(renderer.domElement, scene, camera);
player.position.set(opts.spawn?.x ?? 0, GROUND_Y, opts.spawn?.z ?? 0);
player.yaw = opts.spawn?.yaw ?? 0.6;
scene.add(player.avatar);
// He is a metallurgist: darker cloth, a broader frame.
player.avatar.scale.set(1.15, 1, 1.15);

const hands = new Hands(camera, player, objects, scene, [...document.querySelectorAll<HTMLElement>('#hands .hand')], document.getElementById('links') as unknown as SVGSVGElement, GROUND_Y, cave.isWalkable, (x, z) => GROUND_Y + cave.groundHeight(x, z));

const energy = new Energy();
// U3: the miners who left the food, cowering at the top of the stairs.
const greblins = opts.greblins ? new Greblins(scene, seed) : null;
const extras: Updatable[] = opts.populate ? opts.populate({ scene, world: cave, seed, player, camera }) : [];
let greblinsSeen = false;
const interactables: Interactable[] = [...cave.boulders];

// ---- DOM ---------------------------------------------------------------------
const hint = document.getElementById('hint')!;
const hud = document.getElementById('hud')!;
const backButton = document.getElementById('back') as HTMLButtonElement;
const menu = document.getElementById('menu')!;
const halo = document.getElementById('halo')!;
const blackout = document.getElementById('blackout')!;
const tools = document.getElementById('tools')!;
const zoomInButton = document.getElementById('zoom-in') as HTMLButtonElement;
const zoomOutButton = document.getElementById('zoom-out') as HTMLButtonElement;
const viewButton = document.getElementById('view') as HTMLButtonElement;
const walkButton = document.getElementById('walk') as HTMLButtonElement;
const gearButton = document.getElementById('gear') as HTMLButtonElement;
// The plateau-only panels stay hidden here.
for (const id of ['rain', 'blueprints']) document.getElementById(id)?.setAttribute('hidden', '');

// ---- Clock ------------------------------------------------------------------
let animClock = 0;
let lastFrame = -1;

// ---- Locking ------------------------------------------------------------------
let locked: Interactable | null = null;
let lockedPose: CameraPose | null = null;
let craft: CraftSession | null = null;
/** U2: the one forge ring, if a piece is being made. */
let forge: ForgeSite | null = null;
let autoUnlockAt: number | null = null;
const RELEASE_HOLD_MS = 900;
const BOARD_GROUND_CLEARANCE = 0.12;

function viewerNow() {
  return { position: player.position.clone(), forward: player.forward() };
}
function lockOnto(it: Interactable): void {
  const pose = it.lockPose(viewerNow());
  // Inside a boulder, or through a wall: step toward the target.
  for (let guard = 0; guard < 6; guard++) {
    const inside = cave.boulders.some((b) => b !== it && b.collider() && Math.hypot(b.center.x - pose.position.x, b.center.z - pose.position.z) < BOULDER_RADIUS + 0.25);
    if (!inside && cave.isWalkable(pose.position)) break;
    pose.position.lerp(pose.target, 0.25);
  }
  const lowest = boardView.lowestWorldY(pose.position, pose.target, it.board.cols, it.board.rows);
  const lift = (it.floorY ?? GROUND_Y) + BOARD_GROUND_CLEARANCE - lowest;
  if (lift > 0) {
    pose.position.y += lift;
    pose.target.y += lift;
    it.onPoseLifted?.(lift);
  }
  locked = it;
  lockedPose = pose;
  cameraRig.lock(animClock, pose);
}
function playerPose(): CameraPose {
  const eye = player.eye();
  return { position: eye, target: eye.clone().add(player.forward()) };
}

// Orbit and zoom while locked; zoom in third person.
const ORBIT_PITCH_MIN = 0.12;
const ORBIT_PITCH_MAX = 1.5;
function reframeLocked(fn: (offset: THREE.Spherical) => void): void {
  if (cameraRig.mode !== 'locked' || !locked || !lockedPose) return;
  const offset = new THREE.Spherical().setFromVector3(lockedPose.position.clone().sub(lockedPose.target));
  fn(offset);
  offset.phi = THREE.MathUtils.clamp(offset.phi, ORBIT_PITCH_MIN, ORBIT_PITCH_MAX);
  offset.radius = THREE.MathUtils.clamp(offset.radius, 1.1, 6);
  const position = lockedPose.target.clone().add(new THREE.Vector3().setFromSpherical(offset));
  const target = lockedPose.target.clone();
  const lowest = boardView.lowestWorldY(position, target, locked.board.cols, locked.board.rows);
  const lift = (locked.floorY ?? GROUND_Y) + BOARD_GROUND_CLEARANCE - lowest;
  if (lift > 0) {
    position.y += lift;
    target.y += lift;
  }
  lockedPose = { position, target };
  camera.position.copy(position);
  camera.lookAt(target);
}
player.onOrbit = (dx, dy) =>
  reframeLocked((o) => {
    o.theta -= dx;
    o.phi -= dy;
  });
for (const [el, k] of [
  [zoomInButton, 0.8],
  [zoomOutButton, 1.25],
] as const) {
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  el.addEventListener('click', () => {
    if (cameraRig.mode === 'free') player.thirdZoom = THREE.MathUtils.clamp(player.thirdZoom * k, THIRD_ZOOM_MIN, THIRD_ZOOM_MAX);
    else reframeLocked((o) => (o.radius *= k));
  });
}
viewButton.addEventListener('pointerdown', (e) => e.stopPropagation());
viewButton.addEventListener('click', () => {
  player.view = player.view === 'first' ? 'third' : 'first';
  viewButton.innerHTML = player.view === 'third' ? '<b>◉</b>1st' : '<b>◎</b>3rd';
  viewButton.classList.toggle('active', player.view === 'third');
  updateHud();
});
walkButton.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  e.preventDefault();
  walkButton.setPointerCapture(e.pointerId);
  walkButton.classList.add('active');
  player.startMove(e);
});
walkButton.addEventListener('pointermove', (e) => player.pointerMove(e));
for (const ev of ['pointerup', 'pointercancel'] as const) {
  walkButton.addEventListener(ev, (e) => {
    walkButton.classList.remove('active');
    player.pointerUp(e);
  });
}

// ---- Input -----------------------------------------------------------------------
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
    // The forge ring wins over what lies inside it.
    if (forge && forge.status !== 'resolved') {
      const ringHit = raycaster.intersectObjects(forge.lockTargets, false)[0];
      if (ringHit) {
        if (forge.distanceTo(player.position) > forge.lockReach) {
          hint.textContent = 'Closer.';
          tooFarUntil = animClock + 900;
        } else if (!forge.isReady) {
          hint.textContent = forge.readyText();
          tooFarUntil = animClock + 1600;
        } else lockOnto(forge);
        return;
      }
    }
    const targets = interactables.filter((it) => it.status === 'growing').flatMap((it) => it.lockTargets);
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (!hit) {
      // Bare rock: nothing in it to heat.
      const rock = raycaster.intersectObjects(cave.bareRock(), false)[0];
      if (rock && rock.distance < 6) {
        hint.textContent = 'Bare rock. Nothing in it to heat.';
        tooFarUntil = animClock + 1400;
      }
      return;
    }
    const it = hit.object.userData.interactable as Interactable;
    if (it.distanceTo(player.position) > it.lockReach) {
      hint.textContent = 'Closer.';
      tooFarUntil = animClock + 900;
      return;
    }
    lockOnto(it);
  } else if (cameraRig.mode === 'locked' && locked) {
    if (boardView.tap(raycaster)) updateHud();
  }
};

/** Long-press: an object's recipes (the ingot's blueprint, the dagger's melting). */
player.objectAt = (x, y) => {
  if (cameraRig.mode !== 'free') return false;
  castFrom(x, y);
  const hit = raycaster.intersectObjects(objects.raycastTargets(), true)[0];
  if (!hit) return false;
  const obj = hit.object.userData.object as WorldObject;
  return Math.hypot(obj.position.x - player.position.x, obj.position.z - player.position.z) <= 3.5;
};
function showMenu(x: number, y: number, rows: { label: string; small?: string; disabled?: boolean; onPick: () => void }[]): void {
  menu.innerHTML = rows
    .map((r, i) => `<button type="button" data-i="${i}" ${r.disabled ? 'disabled' : ''}>${r.label}${r.small ? `<small>${r.small}</small>` : ''}</button>`)
    .join('');
  menu.style.left = `${Math.min(window.innerWidth - 230, Math.max(10, x - 100))}px`;
  menu.style.top = `${Math.min(window.innerHeight - 40 - rows.length * 52, Math.max(90, y - 30))}px`;
  menu.hidden = false;
  menu.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
    b.addEventListener('click', () => {
      menu.hidden = true;
      rows[Number(b.dataset.i)].onPick();
    });
  });
}
player.onLongPress = (x, y) => {
  castFrom(x, y);
  const hit = raycaster.intersectObjects(objects.raycastTargets(), true)[0];
  if (!hit) return;
  const obj = hit.object.userData.object as WorldObject;
  const rows: { label: string; small?: string; disabled?: boolean; onPick: () => void }[] = recipesFor(obj.type.id, hands.heldTypes()).map((r) => ({
    label: r.recipe.label,
    small: r.available ? (r.recipe.id === 'forge-dagger' ? 'one ingot' : undefined) : r.reason,
    disabled: !r.available,
    onPick: () => startCraft(obj, r.recipe),
  }));
  // U2: the suit's blueprints on any ingot; a piece lying there can be put on.
  if (obj.type.id === 'ingot') {
    for (const plan of FORGE_PLANS) rows.push({ label: plan.label, small: plan.blurb, onPick: () => startForge(obj, plan) });
  }
  if (obj.type.wear) {
    const why = equipBlocker(obj);
    rows.push({ label: `Equip ${obj.type.label}`, small: why ?? (obj.type.wear === 'chest' ? `takes ${CHEST_CHARGE} of your energy into its core` : `takes ${HELM_CHARGE} of your energy · darksight held`), disabled: !!why, onPick: () => equip(obj) });
  }
  if (rows.length === 0) {
    hint.textContent = `Nothing to make from ${obj.type.label} yet.`;
    tooFarUntil = animClock + 1400;
    return;
  }
  showMenu(x, y, rows);
};
renderer.domElement.addEventListener('pointerdown', () => (menu.hidden = true));

function startCraft(target: WorldObject, recipe: Recipe): void {
  const lifts = handsToLift(target.type.mass, 1) <= HANDS;
  craft = new CraftSession(target, recipe, objects, viewerNow(), seed * 17 + target.id, lifts, GROUND_Y + cave.groundHeight(target.position.x, target.position.z), 'heats');
  craft.onDone = (it) => {
    const session = it as CraftSession;
    const type = OBJECT_TYPES[session.result as keyof typeof OBJECT_TYPES];
    const count = session.recipe.resultCount ?? 1;
    for (let i = 0; i < count; i++) {
      const free = hands.freeHand();
      if (free >= 0 && handsToLift(type.mass, 1) === 1) hands.give(free, type);
      else objects.spawn(type.id, session.restPosition.x + i * 0.3, GROUND_Y + cave.groundHeight(session.restPosition.x, session.restPosition.z), session.restPosition.z, session.restYaw);
    }
    hint.textContent = type.id === 'dagger' ? 'A dagger, still warm.' : `An ${type.label}.`;
    tooFarUntil = animClock + 2000;
    onInteractableDone(it);
  };
  lockOnto(craft);
}

/** U2: a forge ring around an ingot for a piece of the suit. One ring at a time. */
function startForge(anchor: WorldObject, plan: ForgePlan): void {
  if (forge) forge.cancel();
  const groundY = GROUND_Y + cave.groundHeight(anchor.position.x, anchor.position.z);
  forge = new ForgeSite(1000 + anchor.id, new THREE.Vector3(anchor.position.x, groundY, anchor.position.z), plan, objects, groundY, seed * 29 + anchor.id);
  scene.add(forge.group);
  forge.evaluate();
  forge.onResult = (obj) => {
    hint.textContent = `The ${obj.type.label} sets. Long-press it to put it on.`;
    tooFarUntil = animClock + 3200;
  };
  forge.onDone = (it) => {
    onInteractableDone(it);
    forge?.cancel();
    forge = null;
  };
  hint.textContent = forge.isReady ? `${plan.label}: tap inside the ring.` : `${plan.label}: ${forge.readyText()} Bring the rest inside it.`;
  tooFarUntil = animClock + 3600;
}

// ---- U2: the suit — worn, not carried; the chest is the attachment point and powers the rest ----
const worn: { chest: boolean; helm: boolean } = { chest: false, helm: false };
const gearMeshes: { chest: THREE.Object3D | null; helm: THREE.Object3D | null } = { chest: null, helm: null };
function equipBlocker(obj: WorldObject): string | null {
  const which = obj.type.wear!;
  if (worn[which]) return `already wearing a ${obj.type.label}`;
  if (which !== 'chest' && !worn.chest) return 'needs a chestpiece to attach to';
  const charge = which === 'chest' ? CHEST_CHARGE : HELM_CHARGE;
  if (energy.value - charge < 0.17) return 'not enough energy in you to power it';
  return null;
}
function equip(obj: WorldObject): void {
  const why = equipBlocker(obj);
  if (why) {
    hint.textContent = why[0].toUpperCase() + why.slice(1) + '.';
    tooFarUntil = animClock + 1600;
    return;
  }
  const which = obj.type.wear!;
  if (!energy.impart(which === 'chest' ? CHEST_CHARGE : HELM_CHARGE)) return;
  objects.remove(obj);
  worn[which] = true;
  dress();
  hint.textContent = which === 'chest' ? 'The core takes your energy and holds it. The rest of the suit can hang from this.' : 'The helm wakes. The dark opens out — and stays open.';
  tooFarUntil = animClock + 3200;
  updateHud();
}
function takeOff(which: 'chest' | 'helm'): void {
  if (!worn[which]) return;
  if (which === 'chest' && worn.helm) takeOff('helm'); // nothing hangs from nothing
  worn[which] = false;
  energy.giveBack(which === 'chest' ? CHEST_CHARGE : HELM_CHARGE);
  const fwd = player.forward();
  const x = player.position.x + fwd.x * 0.6 + (which === 'helm' ? 0.25 : 0);
  const z = player.position.z + fwd.z * 0.6;
  objects.spawn(which === 'chest' ? 'chestpiece' : 'helm', x, GROUND_Y + cave.groundHeight(x, z), z, player.yaw);
  dress();
  hint.textContent = which === 'chest' ? 'The core goes dark; its energy flows back into you.' : 'The dark closes back in to what your own eyes can do.';
  tooFarUntil = animClock + 2600;
  updateHud();
}
/** The avatar wears what he wears; energy sustains what the pieces sustain. */
function dress(): void {
  for (const which of ['chest', 'helm'] as const) {
    const has = worn[which];
    if (has && !gearMeshes[which]) {
      const look = buildLook(which === 'chest' ? 'chestpiece' : 'helm');
      look.position.y = which === 'chest' ? 0.3 : EYE_HEIGHT + 0.005;
      player.avatar.add(look);
      gearMeshes[which] = look;
    } else if (!has && gearMeshes[which]) {
      gearMeshes[which]!.removeFromParent();
      gearMeshes[which] = null;
    }
  }
  energy.sightFloor = worn.helm ? HELM_SIGHT : 0;
  energy.holdVision = worn.helm;
}
gearButton.addEventListener('click', () => {
  if (cameraRig.mode !== 'free') return;
  const r = gearButton.getBoundingClientRect();
  const rows: { label: string; small?: string; onPick: () => void }[] = [];
  if (worn.helm) rows.push({ label: 'Take off the helm', small: 'darksight back to your own', onPick: () => takeOff('helm') });
  if (worn.chest) rows.push({ label: 'Take off the chestpiece', small: worn.helm ? 'and the helm with it' : 'its energy flows back', onPick: () => takeOff('chest') });
  showMenu(r.left - 120, r.top - 20, rows);
});

if (opts.suit) {
  // The lab: he wakes already in the suit, its energy his to keep.
  worn.chest = true;
  worn.helm = true;
  dress();
}

function onInteractableDone(done: Interactable): void {
  if (done === locked && cameraRig.mode === 'locked') autoUnlockAt = animClock + RELEASE_HOLD_MS;
  updateHud();
}
for (const b of cave.boulders) {
  b.onDone = onInteractableDone;
  b.onIngot = (at) => {
    objects.spawn('ingot', at.x, GROUND_Y, at.z, Math.random() * Math.PI);
    hint.textContent = 'The metal sets: an ingot. Long-press it for what it can become.';
    tooFarUntil = animClock + 3200;
    updateHud();
  };
}

// A run cleared on the board: heat flies to the ore (or the forging).
boardView.onRun = (run, origin) => {
  const it = locked;
  if (!it) return;
  const target = it.targetFor(run);
  if (target === null) return;
  const amount = run.cells.length;
  const color = it.kind === 'craft' || it.kind === 'site' ? 0xffa030 : PALETTE[run.type].hex;
  projectiles.fire(origin, it.targetWorldPosition(target), color, animClock, () => {
    it.feed(target, amount, animClock);
    energy.drain(it.kind === 'craft' ? (it as CraftSession).recipe.drain : DRAIN_HEAT);
    updateHud();
  });
};

// ---- Modes / HUD ------------------------------------------------------------------
const HINTS: Record<CameraMode, string> = {
  free: opts.freeHint ?? 'Hold walk to move, drag to look. Tap the shining ore in a boulder to heat it. Long-press an ingot for what it can become.',
  locking: '',
  locked: '',
  unlocking: '',
};
function applyMode(mode: CameraMode): void {
  hint.textContent = mode === 'locked' && locked ? locked.hintLocked : HINTS[mode];
  player.enabled = mode === 'free';
  if (mode === 'locked' && locked) {
    boardView.bind(locked.board);
    boardView.show(animClock);
    if (locked.status !== 'growing' && autoUnlockAt === null) autoUnlockAt = animClock + RELEASE_HOLD_MS;
  }
  if (mode === 'unlocking') {
    boardView.hide();
    if (craft && craft.status === 'growing') craft.cancel();
  }
  if (mode === 'free') {
    boardView.unbind();
    locked = null;
    craft = null;
  }
  updateHud();
}
cameraRig.onModeChange = applyMode;
backButton.addEventListener('click', () => {
  if (cameraRig.mode === 'locked') cameraRig.unlock(animClock, playerPose());
});
function updateHud(): void {
  const ore = cave.boulders.filter((b) => b.status === 'growing').length;
  const parts = [`seed ${seed}`, `ore ${ore}/${cave.boulders.length}`, `ingots ${objects.objects.filter((o) => o.type.id === 'ingot').length}`];
  if (slowmo > 1) parts.push(`slowmo ×${slowmo}`);
  if (debug) parts.push(`energy ${energy.value.toFixed(2)}`);
  if (energy.nourished(animClock)) parts.push('nourished');
  const wearing = [worn.chest ? 'chestpiece' : '', worn.helm ? 'helm' : ''].filter(Boolean);
  if (wearing.length) parts.push(`wearing ${wearing.join(' + ')}`);
  if (locked && cameraRig.mode === 'locked' && locked.status === 'growing') parts.push(locked.poolText());
  hud.textContent = parts.join(' · ');
  const lockedNow = cameraRig.mode === 'locked' && locked?.status === 'growing';
  backButton.hidden = !lockedNow;
  const zoomable = lockedNow || (cameraRig.mode === 'free' && player.view === 'third');
  zoomInButton.hidden = !zoomable;
  zoomOutButton.hidden = !zoomable;
  walkButton.hidden = cameraRig.mode !== 'free';
  viewButton.hidden = cameraRig.mode !== 'free';
  gearButton.hidden = cameraRig.mode !== 'free' || !(worn.chest || worn.helm);
  tools.classList.toggle('locked', lockedNow);
}

// ---- Energy wiring ------------------------------------------------------------------
player.onHop = () => energy.drain(DRAIN_HOP);
player.onRestHold = () => {
  if (cameraRig.mode === 'free' && !energy.busy) energy.rest(animClock);
};
energy.onEvent = (what) => {
  if (what === 'ate') {
    hint.textContent = 'Warm food. Your strength comes back, and stays.';
    tooFarUntil = animClock + 2200;
    updateHud();
    return;
  }
  hint.textContent = 'You gather yourself. The dark opens out again.';
  tooFarUntil = animClock + 2200;
};
// U1: the food on the tables. Eating boosts energy and slows every drain for a while.
hands.onEat = (type) => {
  if (!type.food || energy.busy) return false;
  energy.eat(type.food, type.nourishMs ?? 0, type.nourishDrain);
  return true;
};
player.standHeightAt = cave.groundHeight;
player.cameraClear = cave.cameraClear;
// Laid out on the tables in the second chamber: haunches of meat and baked potatoes.
{
  const rand = mulberry32(seed ^ 0xf00d);
  const spread: ('haunch' | 'potato')[][] = [['haunch', 'potato', 'potato', 'haunch'], ['potato', 'haunch', 'potato']];
  cave.tables.forEach((t, i) => {
    const items = spread[i % spread.length];
    items.forEach((id, k) => {
      const along = ((k + 0.5) / items.length - 0.5) * 2 * (t.halfLength - 0.12);
      const across = (rand() - 0.5) * 2 * (t.halfWidth - 0.12);
      const x = t.x + Math.cos(t.yaw) * along + Math.sin(t.yaw) * across;
      const z = t.z - Math.sin(t.yaw) * along + Math.cos(t.yaw) * across;
      objects.spawn(id, x, t.y, z, rand() * Math.PI * 2);
    });
  });
}

/** With the helm on, the light and the ambient go up as well as the reach: the whole room reads. Tuning. */
const HELM_LIGHT_BOOST = 1.8;
function applyEnergy(): void {
  const fx = energy.effects(animClock);
  // The tunnel: a dark ring closing in — but the centre is always clear (he is never blind).
  const clear = 100 - 70 * fx.tunnel; // % radius where the dark is full; never below 30%
  halo.style.background = fx.tunnel > 0.02 ? `radial-gradient(ellipse at center, rgba(0,0,0,0) ${Math.max(16, clear - 30)}%, rgba(0,0,0,0.96) ${clear}%)` : 'none';
  blackout.style.opacity = fx.blackout.toFixed(3);
  player.moveSlowdown = fx.slowdown;
  player.fanScale = fx.fanScale;
  cave.setSight(camera.position, fx.sight, worn.helm ? HELM_LIGHT_BOOST : 1);
  // The greblins read his light: where it is and which way it looks.
  if (greblins) greblinsFrame(fx.sight);
}
function greblinsFrame(sight: number): void {
  if (!greblins) return;
  const before = greblins.flights;
  const climbsBefore = greblins.climbs;
  greblins.update(animClock, camera.position, camera.getWorldDirection(new THREE.Vector3()), sight, player.position);
  if (!greblinsSeen && greblins.flights > before) {
    greblinsSeen = true;
    hint.textContent = 'Small shapes scatter from your light. Miners — and they want none of you.';
    tooFarUntil = animClock + 3600;
  }
  if (climbsBefore === 0 && greblins.climbs > 0) {
    hint.textContent = 'One goes straight up the wall and into a hole high in the rock. You could fit. You cannot climb.';
    tooFarUntil = animClock + 4200;
  }
}

// ---- Loop -------------------------------------------------------------------------
function animate(now: number): void {
  requestAnimationFrame(animate);
  const dt = lastFrame < 0 ? 0 : Math.min(0.1, Math.max(0, (now - lastFrame) / 1000));
  lastFrame = now;
  animClock += (dt * 1000) / slowmo;

  if (autoUnlockAt !== null && animClock >= autoUnlockAt) {
    autoUnlockAt = null;
    if (cameraRig.mode === 'locked') cameraRig.unlock(animClock, playerPose());
  }
  if (cameraRig.mode === 'free') {
    player.update(now, cave.colliders(), cave.isWalkable);
    player.applyCamera(camera);
  }
  cameraRig.update(animClock);
  energy.update(animClock);
  player.enabled = cameraRig.mode === 'free' && !energy.busy;
  applyEnergy();
  hands.update(animClock);
  for (const it of interactables) it.update(animClock);
  if (craft) craft.update(animClock);
  for (const x of extras) x.update(animClock);
  if (forge) {
    forge.evaluate();
    forge.update(animClock);
  }
  objects.update(animClock);
  if (locked && locked.status !== 'growing') boardView.hide();
  boardView.update(animClock);
  projectiles.update(animClock);
  if (animClock > tooFarUntil && cameraRig.mode === 'free' && !hint.textContent?.startsWith('Hold walk')) hint.textContent = hands.notice ?? HINTS.free;
  if (hands.notice && animClock > tooFarUntil) {
    hint.textContent = hands.notice;
    hands.notice = null;
    tooFarUntil = animClock + 1400;
  }
  renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  boardView.layout();
});
applyMode('free');
requestAnimationFrame(animate);

// Debug handle. Not part of the design surface.
(window as unknown as { __rootwake: unknown }).__rootwake = { THREE, scene, camera, renderer, player, cave, boulders: cave.boulders, objects, hands, energy, cameraRig, boardView, get craft() { return craft; }, startCraft, get forge() { return forge; }, startForge, FORGE_PLANS, worn, equip, takeOff, greblins, extras, get shake() { return { animClock }; }, CELL };
}
