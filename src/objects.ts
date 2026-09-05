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

export type ObjectTypeId = 'seed' | 'stick' | 'log' | 'lichen' | 'rock' | 'hand_axe';

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
  build: () => THREE.Mesh;
}

const wood = new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 0.95, flatShading: true });
const stone = new THREE.MeshStandardMaterial({ color: 0x7c7a74, roughness: 1, flatShading: true });
/** Lichen: rock-coloured and unlit by day; the day cycle raises its emissive for tired eyes at night. */
export const lichenMaterial = new THREE.MeshStandardMaterial({ color: 0x6f6e68, emissive: 0x7ff0c8, emissiveIntensity: 0, roughness: 1, flatShading: true });
const stickMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.95 });
const seedMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d38f, roughness: 0.6 });

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
  log: {
    id: 'log',
    label: 'log',
    size: 'large',
    mass: 4, // strength 1: cannot lift (4 hands), drags with 2
    color: 0x5a3f2a,
    radius: 0.62,
    blocks: true,
    restHeight: 0.18,
    build: () => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 1.25, 10), wood);
      m.rotation.z = Math.PI / 2;
      return m;
    },
  },
};

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
    this.mesh.userData.object = this;
    this.group.add(this.mesh);
  }

  get position(): THREE.Vector3 {
    return this.group.position;
  }

  /** Swap the visible mesh for an authored look (crafting stages). */
  setLook(look: string): void {
    this.group.remove(this.mesh);
    this.mesh = buildLook(look);
    this.mesh.userData.object = this;
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

  /** Meshes for raycasting; each carries userData.object. */
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
    this.spawn('log', center.x + fallDir.x * 0.62, groundY, center.z + fallDir.z * 0.62, yaw);
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
