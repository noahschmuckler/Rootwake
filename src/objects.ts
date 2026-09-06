// Pass 0.6: objects have weight (DESIGN.md). Every object type is a size
// class (how it fills a hand) and a mass; the character has a strength; the
// formula below decides what can be lifted, dragged or moved at all. No
// per-object special cases — new objects are rows in the table.

import * as THREE from 'three';
import { mulberry32 } from './colors';

// ---- The rule -------------------------------------------------------------------
export type SizeClass = 'tiny' | 'small' | 'large';
/** How many of a size class one hand holds. */
export const STACK_CAP: Record<SizeClass, number> = { tiny: 20, small: 5, large: 1 };
/** Character strength. A constant for now; fatigue and food will move it (DESIGN.md). */
export const STRENGTH = 1;
export const HANDS = 2;
/** The in-the-way waggle: duration and amplitude. */
export const WAGGLE_MS = 650;
export const WAGGLE_RAD = 0.09;

/** Hands needed to lift an object of this mass at this strength (stackables are weightless). */
export function handsToLift(mass: number, strength = STRENGTH): number {
  return mass <= 0 ? 1 : Math.ceil(mass / strength);
}
/** Hands needed to drag it: half of lifting, rounded up. */
export function handsToDrag(mass: number, strength = STRENGTH): number {
  return mass <= 0 ? 1 : Math.ceil(mass / (2 * strength));
}
// -------------------------------------------------------------------------------

export type ObjectTypeId = 'seed' | 'stick' | 'log' | 'log_short' | 'lichen' | 'rock' | 'hand_axe' | 'log_long_notched' | 'log_notched' | 'log_stub' | 'timber' | 'timber_short' | 'chip';

export interface ObjectType {
  id: ObjectTypeId;
  label: string;
  size: SizeClass;
  mass: number;
  color: number;
  /** Ground-plane radius used for "is it lying on this patch" checks. */
  radius: number;
  /** Does it block ground from being tilled? Seeds don't; sticks and logs do. */
  blocks: boolean;
  /** Height of the mesh's centre above the ground when resting. */
  restHeight: number;
  /** Vitality restored by eating one (Pass 0.7a). Absent = not food. */
  food?: number;
  /** For long things: half their length along local X, so hands and ropes aim at the nearer end. */
  halfLength?: number;
  build: () => THREE.Mesh;
}

const wood = new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 0.95, flatShading: true });
const stone = new THREE.MeshStandardMaterial({ color: 0x7c7a74, roughness: 1, flatShading: true });
/** Lichen: rock-coloured and unlit by day; the day cycle raises its emissive for tired eyes at night. */
export const lichenMaterial = new THREE.MeshStandardMaterial({ color: 0x6f6e68, emissive: 0x7ff0c8, emissiveIntensity: 0, roughness: 1, flatShading: true });
const stickMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.95 });
/** Freshly cut wood (notches, split faces, chips): paler than bark. */
const cutWood = new THREE.MeshStandardMaterial({ color: 0xb8925a, roughness: 0.9, flatShading: true });
const seedMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d38f, roughness: 0.6 });

/**
 * The notch grid (structures.ts): notches a bay apart, log ends overhanging the
 * outer notch. A long log spans two bays (three notches), a short one one bay.
 */
export const NOTCH_PITCH = 1.0;
export const LOG_OVERHANG = 0.15;
export const LOG_RADIUS = 0.17;
export const LONG_LOG_LENGTH = NOTCH_PITCH * 2 + LOG_OVERHANG * 2;
export const SHORT_LOG_LENGTH = NOTCH_PITCH + LOG_OVERHANG * 2;
/** The stub: half a short log with one notch in the middle — a portable notch to end a wall on. */
export const STUB_LENGTH = 0.55;
export const TIMBER_THICK = 0.1;
export const TIMBER_WIDE = 0.24;

export const OBJECT_TYPES: Record<ObjectTypeId, ObjectType> = {
  seed: {
    id: 'seed',
    label: 'seeds',
    size: 'tiny',
    mass: 0,
    color: 0xe6d38f,
    radius: 0.06,
    blocks: false,
    restHeight: 0.05,
    food: 0.04, // seeds are poor food (SYSTEMS.md §3)
    build: () => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), seedMaterial);
      m.scale.set(1, 0.7, 1.3);
      return m;
    },
  },
  stick: {
    id: 'stick',
    label: 'sticks',
    size: 'small',
    mass: 0,
    color: 0x6b4a2e,
    radius: 0.28,
    blocks: true,
    restHeight: 0.04,
    build: () => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.55, 6), stickMaterial);
      m.rotation.z = Math.PI / 2;
      return m;
    },
  },
  lichen: {
    id: 'lichen',
    label: 'lichen',
    size: 'tiny',
    mass: 0,
    color: 0x7ff0c8,
    radius: 0.25,
    blocks: false,
    restHeight: 0.02,
    build: () => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), lichenMaterial);
      m.scale.set(0.32, 0.04, 0.24);
      return m;
    },
  },
  rock: {
    id: 'rock',
    label: 'rock',
    size: 'large',
    mass: 1, // strength 1: lifts one-handed
    color: 0x7c7a74,
    radius: 0.2,
    blocks: true,
    restHeight: 0.13,
    build: () => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), stone);
      m.scale.set(1.15, 0.8, 1);
      return m;
    },
  },
  hand_axe: {
    id: 'hand_axe',
    label: 'hand axe',
    size: 'large',
    mass: 1,
    color: 0x8a8880,
    radius: 0.18,
    blocks: true,
    restHeight: 0.08,
    build: () => buildLook('hand_axe'),
  },
  // ---- Logs (Pass 1.0b: Lincoln Logs). A felled tree gives a long log (two bays) and a short one (one bay).
  // Mass is game mass: long drags with two hands, short with one, timber lifts. ----
  log: {
    id: 'log',
    halfLength: LONG_LOG_LENGTH / 2,
    label: 'long log',
    size: 'large',
    mass: 4, // strength 1: cannot lift (4 hands), drags with 2
    color: 0x5a3f2a,
    radius: 1.15,
    blocks: true,
    restHeight: 0.17,
    build: () => logMesh(LONG_LOG_LENGTH),
  },
  log_short: {
    id: 'log_short',
    halfLength: SHORT_LOG_LENGTH / 2,
    label: 'short log',
    size: 'large',
    mass: 2, // drags with one hand
    color: 0x5a3f2a,
    radius: 0.65,
    blocks: true,
    restHeight: 0.17,
    build: () => logMesh(SHORT_LOG_LENGTH),
  },
  log_long_notched: {
    id: 'log_long_notched',
    halfLength: LONG_LOG_LENGTH / 2,
    label: 'long notched log',
    size: 'large',
    mass: 4,
    color: 0x5a3f2a,
    radius: 1.15,
    blocks: true,
    restHeight: 0.17,
    build: () => buildLook('log_long_notched'),
  },
  log_notched: {
    id: 'log_notched',
    halfLength: SHORT_LOG_LENGTH / 2,
    label: 'notched log',
    size: 'large',
    mass: 2,
    color: 0x5a3f2a,
    radius: 0.65,
    blocks: true,
    restHeight: 0.17,
    build: () => buildLook('log_notched'),
  },
  log_stub: {
    id: 'log_stub',
    halfLength: STUB_LENGTH / 2,
    label: 'stub',
    size: 'large',
    mass: 1, // half a short log: a portable notch. Lifts one-handed.
    color: 0x5a3f2a,
    radius: 0.3,
    blocks: true,
    restHeight: 0.17,
    build: () => buildLook('log_stub'),
  },
  // Timber comes in the two log lengths: long slats span the cabin, short ones are furniture.
  timber: {
    id: 'timber',
    halfLength: LONG_LOG_LENGTH / 2,
    label: 'long timber',
    size: 'large',
    mass: 2, // a squared quarter of a long log: two hands to lift
    color: 0xb8925a,
    radius: 1.15,
    blocks: true,
    restHeight: 0.05,
    build: () => buildLook('timber'),
  },
  timber_short: {
    id: 'timber_short',
    halfLength: SHORT_LOG_LENGTH / 2,
    label: 'short timber',
    size: 'large',
    mass: 1,
    color: 0xb8925a,
    radius: 0.65,
    blocks: true,
    restHeight: 0.05,
    build: () => buildLook('timber_short'),
  },
  chip: {
    id: 'chip',
    label: 'wood chips',
    size: 'tiny',
    mass: 0,
    color: 0xb8925a,
    radius: 0.05,
    blocks: false, // like seeds: chips don't stop the ground being tilled
    restHeight: 0.02,
    build: () => {
      const m = new THREE.Mesh(new THREE.TetrahedronGeometry(0.06, 0), cutWood);
      m.scale.set(1.3, 0.4, 1);
      return m;
    },
  },
};

/** The plain log body every log look starts from: lies along local X. */
function logMesh(length: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(LOG_RADIUS, LOG_RADIUS + 0.015, length, 10), wood);
  m.rotation.z = Math.PI / 2;
  return m;
}

/** A notch cut into a log: a pale saddle set into the bark at x, on top (up) or underneath — where a cross log sits. */
function notch(x: number, up: boolean): THREE.Mesh {
  const n = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.42), cutWood);
  n.position.set(x, up ? 0.14 : -0.14, 0);
  return n;
}

/** Notches top and bottom at each grid point along a log. */
function notched(length: number, points: number[]): THREE.Mesh {
  const parts: THREE.Object3D[] = [logMesh(length)];
  for (const x of points) parts.push(notch(x, true), notch(x, false));
  return holder(wood, ...parts);
}

/** Axe marks: thin pale slashes lying on the top of the bark. */
function scoreMarks(count: number, parent: THREE.Object3D, length: number): void {
  for (let i = 0; i < count; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.24), cutWood);
    const t = (i / Math.max(1, count - 1) - 0.5) * (length - 0.4);
    s.position.set(t, 0.165, 0);
    s.rotation.y = 0.35 * Math.sin(i * 1.7);
    parent.add(s);
  }
}

/** A holder mesh so a multi-part look is still one Mesh for raycasting/userData. */
function holder(material: THREE.Material, ...parts: THREE.Object3D[]): THREE.Mesh {
  const h = new THREE.Mesh(new THREE.BufferGeometry(), material);
  h.add(...parts);
  return h;
}

/**
 * Authored intermediate looks a crafting target steps through (Pass 0.8).
 * Knapping: rock → chipped → wedge → hand axe. Swapped at HP thresholds,
 * never lerped — the same staging convention as grass and saplings.
 */
export function buildLook(look: string): THREE.Mesh {
  switch (look) {
    case 'rock_chipped': {
      // One face struck flat.
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), stone);
      m.scale.set(1.1, 0.7, 0.85);
      return m;
    }
    case 'rock_wedge': {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.16, 0.3, 5), stone);
      m.rotation.z = Math.PI / 2;
      return m;
    }
    // ---- Pass 0.9: log shaping (all lie along local X like the log) ----
    case 'log_scored': {
      const h = holder(wood, logMesh(LONG_LOG_LENGTH));
      scoreMarks(8, h, LONG_LOG_LENGTH);
      return h;
    }
    case 'log_scored_short': {
      const h = holder(wood, logMesh(SHORT_LOG_LENGTH));
      scoreMarks(5, h, SHORT_LOG_LENGTH);
      return h;
    }
    case 'log_split':
    case 'log_split_short': {
      // Cut most of the way through: a pale split runs the length of the top.
      const length = look === 'log_split' ? LONG_LOG_LENGTH : SHORT_LOG_LENGTH;
      const split = new THREE.Mesh(new THREE.BoxGeometry(length - 0.1, 0.08, 0.06), cutWood);
      split.position.y = 0.15;
      const h = holder(wood, logMesh(length), split);
      scoreMarks(3, h, length);
      return h;
    }
    case 'log_halved': {
      // A long log cut through the middle: two short logs' worth, still lying end to end.
      const a = logMesh(SHORT_LOG_LENGTH);
      a.position.x = -SHORT_LOG_LENGTH / 2 - 0.03;
      const b = logMesh(SHORT_LOG_LENGTH);
      b.position.x = SHORT_LOG_LENGTH / 2 + 0.03;
      const cutA = new THREE.Mesh(new THREE.CircleGeometry(LOG_RADIUS, 10), cutWood);
      cutA.rotation.y = Math.PI / 2;
      cutA.position.x = -0.02;
      const cutB = cutA.clone();
      cutB.rotation.y = -Math.PI / 2;
      cutB.position.x = 0.02;
      return holder(wood, a, b, cutA, cutB);
    }
    case 'log_long_notched':
      return notched(LONG_LOG_LENGTH, [-NOTCH_PITCH, 0, NOTCH_PITCH]);
    case 'log_notched':
      return notched(SHORT_LOG_LENGTH, [-NOTCH_PITCH / 2, NOTCH_PITCH / 2]);
    case 'timber': {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(LONG_LOG_LENGTH, TIMBER_THICK, TIMBER_WIDE), cutWood);
      return holder(cutWood, plank);
    }
    case 'timber_short': {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(SHORT_LOG_LENGTH, TIMBER_THICK, TIMBER_WIDE), cutWood);
      return holder(cutWood, plank);
    }
    case 'log_stub':
      return notched(STUB_LENGTH, [0]);
    case 'log_stubbed': {
      // A short log cut through the middle: two stubs' worth, still lying end to end.
      const a = logMesh(STUB_LENGTH);
      a.position.x = -STUB_LENGTH / 2 - 0.03;
      const b = logMesh(STUB_LENGTH);
      b.position.x = STUB_LENGTH / 2 + 0.03;
      return holder(wood, a, b);
    }
    case 'hand_axe':
    default: {
      // A finished wedge with a bright worked edge.
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.15, 0.32, 6), stone);
      body.rotation.z = Math.PI / 2;
      const edge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.045, 0.07, 6),
        new THREE.MeshStandardMaterial({ color: 0xb8b6ae, roughness: 0.5, flatShading: true })
      );
      edge.rotation.z = Math.PI / 2;
      edge.position.x = 0.19;
      const holder = new THREE.Mesh(new THREE.BufferGeometry(), stone);
      holder.add(body, edge);
      return holder;
    }
  }
}

let nextObjectId = 1;

/** One physical thing lying in the world. */
export class WorldObject {
  readonly id = nextObjectId++;
  /** A parent group carries position/heading; the mesh keeps its resting rotation. */
  readonly group = new THREE.Group();
  mesh: THREE.Mesh;
  /** Pass 0.7b: false while the thing can't be seen (lichen by day) — hands ignore it. */
  collectible = true;
  /** Pass 0.8: crafting progress lives on the target, so leaving and coming back keeps it. */
  craft: { recipeId: string; hp: number; stage: number; board: unknown } | null = null;
  /** A small wobble (the "this is in the way" hint); ends at this animation-clock time. */
  private waggleUntil = 0;
  private waggleStart = 0;

  /** Wobble for a moment (WAGGLE_MS). */
  waggle(nowMs: number): void {
    this.waggleStart = nowMs;
    this.waggleUntil = nowMs + WAGGLE_MS;
  }

  updateWaggle(nowMs: number): void {
    if (nowMs >= this.waggleUntil) {
      if (this.waggleUntil !== 0) {
        this.group.rotation.x = 0;
        this.group.rotation.z = 0;
        this.waggleUntil = 0;
      }
      return;
    }
    const p = (nowMs - this.waggleStart) / WAGGLE_MS;
    const a = Math.sin(p * Math.PI * 6) * WAGGLE_RAD * (1 - p);
    this.group.rotation.z = a;
    this.group.rotation.x = a * 0.5;
  }

  constructor(readonly type: ObjectType) {
    this.mesh = type.build();
    this.own(this.mesh);
    this.group.add(this.mesh);
  }

  /** Tag a look (and every part of a multi-part look) as this object, for recursive raycasts. */
  private own(mesh: THREE.Object3D): void {
    mesh.traverse((m) => (m.userData.object = this));
  }

  get position(): THREE.Vector3 {
    return this.group.position;
  }

  /** Swap the visible mesh for an authored look (crafting stages). */
  setLook(look: string): void {
    this.group.remove(this.mesh);
    this.mesh = buildLook(look);
    this.own(this.mesh);
    this.group.add(this.mesh);
  }

  /** Put it on the ground at (x, z), heading `yaw` about Y. */
  rest(x: number, groundY: number, z: number, yaw = 0): void {
    this.group.position.set(x, groundY + this.type.restHeight, z);
    this.group.rotation.y = yaw;
  }
}

/** All loose objects in the scene, and the queries hands and patches need. */
export class ObjectWorld {
  readonly group = new THREE.Group();
  readonly objects: WorldObject[] = [];

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  spawn(typeId: ObjectTypeId, x: number, groundY: number, z: number, yaw = 0): WorldObject {
    const obj = new WorldObject(OBJECT_TYPES[typeId]);
    obj.rest(x, groundY, z, yaw);
    this.group.add(obj.group);
    this.objects.push(obj);
    return obj;
  }

  remove(obj: WorldObject): void {
    const i = this.objects.indexOf(obj);
    if (i >= 0) this.objects.splice(i, 1);
    this.group.remove(obj.group);
  }

  update(nowMs: number): void {
    for (const o of this.objects) o.updateWaggle(nowMs);
  }

  /** Meshes for raycasting (cast recursively: looks can be multi-part); every part carries userData.object. */
  raycastTargets(): THREE.Object3D[] {
    return this.objects.filter((o) => o.collectible).map((o) => o.mesh);
  }

  /** Collectible objects of a type within `radius` (ground plane) of a point, nearest first. */
  nearby(x: number, z: number, radius: number, typeId?: ObjectTypeId): WorldObject[] {
    return this.objects
      .filter((o) => o.collectible && (!typeId || o.type.id === typeId) && Math.hypot(o.position.x - x, o.position.z - z) <= radius)
      .sort((a, b) => Math.hypot(a.position.x - x, a.position.z - z) - Math.hypot(b.position.x - x, b.position.z - z));
  }

  /** Blocking objects whose footprint overlaps an axis-aligned ground square. */
  overlapsSquare(cx: number, cz: number, half: number): WorldObject[] {
    return this.objects.filter(
      (o) => o.type.blocks && Math.abs(o.position.x - cx) < half + o.type.radius && Math.abs(o.position.z - cz) < half + o.type.radius
    );
  }

  /** Scatter what a felled tree leaves behind: one log along the fall, sticks and seeds around it. */
  scatterFelledTree(center: THREE.Vector3, fallDir: THREE.Vector3, groundY: number, seed: number): void {
    const rand = mulberry32(seed);
    const yaw = Math.atan2(fallDir.x, fallDir.z) + Math.PI / 2; // the log mesh lies along its local X
    // Designer (1.0b): a trunk gives a long log and a short one — the long lies where it fell, the short beyond it.
    this.spawn('log', center.x + fallDir.x * (LONG_LOG_LENGTH / 2 + 0.1), groundY, center.z + fallDir.z * (LONG_LOG_LENGTH / 2 + 0.1), yaw);
    this.spawn('log_short', center.x + fallDir.x * (LONG_LOG_LENGTH + SHORT_LOG_LENGTH / 2 + 0.25), groundY, center.z + fallDir.z * (LONG_LOG_LENGTH + SHORT_LOG_LENGTH / 2 + 0.25), yaw + (rand() - 0.5) * 0.4);
    for (let i = 0; i < 3; i++) {
      const a = rand() * Math.PI * 2;
      const r = 0.45 + rand() * 0.55;
      this.spawn('stick', center.x + Math.cos(a) * r, groundY, center.z + Math.sin(a) * r, rand() * Math.PI);
    }
    for (let i = 0; i < 12; i++) {
      const a = rand() * Math.PI * 2;
      const r = 0.2 + rand() * 0.75;
      this.spawn('seed', center.x + Math.cos(a) * r, groundY, center.z + Math.sin(a) * r, rand() * Math.PI);
    }
  }
}
