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

export type ObjectTypeId = 'seed' | 'wheat_seed' | 'popcorn' | 'stick' | 'log' | 'log_short' | 'lichen' | 'rock' | 'hand_axe' | 'log_long_notched' | 'log_notched' | 'log_stub' | 'log_half' | 'timber' | 'timber_short' | 'chip' | 'ingot' | 'dagger' | 'haunch' | 'potato' | 'chestpiece' | 'helm';

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
  /** 1.1c: eating one also slows every drain for this long (SYSTEMS §3: better food). */
  nourishMs?: number;
  /** While nourished by this, every drain is multiplied by this (default: the stat's own factor). Lower = more potent. */
  nourishDrain?: number;
  /** U2: a piece of the suit — worn, not carried. The chest is the attachment point for the rest. */
  wear?: 'chest' | 'helm';
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
/** Underworld metal (U0): dull steel, and the same white-hot. */
const metal = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.85, roughness: 0.35, flatShading: true });
const metalHot = new THREE.MeshStandardMaterial({ color: 0xffb060, emissive: 0xff7a1a, emissiveIntensity: 1.8, metalness: 0.4, roughness: 0.5, flatShading: true });
const grip = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.95, flatShading: true });
/** The suit: darker plate than an ingot, and the light in it — the core, the helm's eyes. */
const plate = new THREE.MeshStandardMaterial({ color: 0x6e737a, metalness: 0.9, roughness: 0.4, flatShading: true });
const plateDark = new THREE.MeshStandardMaterial({ color: 0x3c4046, metalness: 0.9, roughness: 0.5, flatShading: true });
export const suitLight = new THREE.MeshStandardMaterial({ color: 0xbff4ff, emissive: 0x8fe6ff, emissiveIntensity: 3.2, roughness: 0.3, toneMapped: false });
const wheatMaterial = new THREE.MeshStandardMaterial({ color: 0xe0b437, roughness: 0.55 });
const popcornMaterial = new THREE.MeshStandardMaterial({ color: 0xfff3d6, roughness: 0.9, flatShading: true });
const meat = new THREE.MeshStandardMaterial({ color: 0x7a3524, roughness: 0.75, flatShading: true });
const bone = new THREE.MeshStandardMaterial({ color: 0xe6dcc4, roughness: 0.8, flatShading: true });
const potatoSkin = new THREE.MeshStandardMaterial({ color: 0x8a6a42, roughness: 1, flatShading: true });
const potatoFlesh = new THREE.MeshStandardMaterial({ color: 0xf2e6b8, roughness: 0.9, flatShading: true });

/**
 * The notch grid (structures.ts): notches a bay apart, log ends overhanging the
 * outer notch. A long log spans two bays (three notches), a short one one bay.
 */
export const NOTCH_PITCH = 1.0;
export const LOG_OVERHANG = 0.15;
export const LOG_RADIUS = 0.17;
export const LONG_LOG_LENGTH = NOTCH_PITCH * 2 + LOG_OVERHANG * 2;
export const SHORT_LOG_LENGTH = NOTCH_PITCH + LOG_OVERHANG * 2;
/** The knuckle: the middle of a log with its one notch — a portable notch to end a wall on, or a campfire's cross. */
export const STUB_LENGTH = 0.55;
/** A doorway cut from a long wall log: the gap, and the two half logs left either side (outer notch kept). */
export const DOOR_GAP = 0.9; // wide enough for the player's radius (0.25) against the half logs' (0.17)
export const HALF_LOG_LENGTH = (LONG_LOG_LENGTH - DOOR_GAP) / 2;
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
  // 1.1c: better food. Wheat seeds come from transmuting tree seeds (the wheat rune) and from harvesting wheat;
  // popcorn from wheat seeds on a fire. Both nourish: drains slow for a while after eating.
  wheat_seed: {
    id: 'wheat_seed',
    label: 'wheat seeds',
    size: 'tiny',
    mass: 0,
    color: 0xe0b437,
    radius: 0.06,
    blocks: false,
    restHeight: 0.05,
    food: 0.06,
    nourishMs: 90_000,
    build: () => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), wheatMaterial);
      m.scale.set(0.9, 0.7, 1.5);
      return m;
    },
  },
  popcorn: {
    id: 'popcorn',
    label: 'popcorn',
    size: 'tiny',
    mass: 0,
    color: 0xfff3d6,
    radius: 0.09,
    blocks: false,
    restHeight: 0.07,
    food: 0.12,
    nourishMs: 150_000,
    build: () => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 1), popcornMaterial);
      m.scale.set(1.15, 0.9, 1);
      return m;
    },
  },
  // U2: the suit. Both lift with one hand to carry to where they are put on; worn, they weigh nothing on the hands.
  chestpiece: {
    id: 'chestpiece',
    label: 'chestpiece',
    size: 'large',
    mass: 1,
    color: 0x6e737a,
    radius: 0.2,
    blocks: false,
    restHeight: 0.16,
    wear: 'chest',
    build: () => buildLook('chestpiece'),
  },
  helm: {
    id: 'helm',
    label: 'helm',
    size: 'large',
    mass: 1,
    color: 0x6e737a,
    radius: 0.14,
    blocks: false,
    restHeight: 0.13,
    wear: 'helm',
    build: () => buildLook('helm'),
  },
  // U1: the food on the tables in the second chamber. More potent than popcorn: a bigger boost and a
  // stronger, longer slowing of every drain. Tuning: food, nourishMs, nourishDrain.
  haunch: {
    id: 'haunch',
    label: 'haunches of meat',
    size: 'small',
    mass: 0.3,
    color: 0x7a3524,
    radius: 0.13,
    blocks: false,
    restHeight: 0.07,
    food: 0.4,
    nourishMs: 300_000,
    nourishDrain: 0.4,
    build: () => {
      const flesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 1), meat);
      flesh.scale.set(1.5, 0.8, 1);
      flesh.position.x = -0.04;
      const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.2, 6), bone);
      shank.rotation.z = Math.PI / 2;
      shank.position.set(0.19, 0.015, 0);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), bone);
      knob.position.set(0.29, 0.015, 0);
      return holder(meat, flesh, shank, knob);
    },
  },
  potato: {
    id: 'potato',
    label: 'baked potatoes',
    size: 'small',
    mass: 0.1,
    color: 0x8a6a42,
    radius: 0.085,
    blocks: false,
    restHeight: 0.05,
    food: 0.22,
    nourishMs: 240_000,
    nourishDrain: 0.5,
    build: () => {
      const skin = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), potatoSkin);
      skin.scale.set(1.35, 0.75, 1);
      // split open, the flesh showing
      const split = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.04), potatoFlesh);
      split.position.y = 0.052;
      return holder(potatoSkin, skin, split);
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
  // ---- Underworld (U0): what the metallurgist makes. ----
  ingot: {
    id: 'ingot',
    label: 'ingot',
    size: 'large',
    mass: 1, // a bar you lift one-handed
    color: 0x9aa0a8,
    radius: 0.2,
    blocks: true,
    restHeight: 0.07,
    build: () => buildLook('ingot'),
  },
  dagger: {
    id: 'dagger',
    label: 'dagger',
    size: 'large',
    mass: 1,
    color: 0x9aa0a8,
    radius: 0.22,
    blocks: true,
    restHeight: 0.04,
    build: () => buildLook('dagger'),
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
    label: 'knuckle',
    size: 'large',
    mass: 1, // the middle of a log with its one notch: a portable notch. Lifts one-handed.
    color: 0x5a3f2a,
    radius: 0.3,
    blocks: true,
    restHeight: 0.17,
    build: () => buildLook('log_stub'),
  },
  // What a long wall log becomes either side of a cut doorway: one end notch, the cut end bare.
  log_half: {
    id: 'log_half',
    halfLength: HALF_LOG_LENGTH / 2,
    label: 'half log',
    size: 'large',
    mass: 2,
    color: 0x5a3f2a,
    radius: 0.45,
    blocks: true,
    restHeight: 0.17,
    build: () => buildLook('log_half'),
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
    label: 'wood shavings',
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

/** Notch width (a cross log's diameter and a little) and how deep it is cut, top and bottom. */
export const NOTCH_WIDTH = 0.38;
export const NOTCH_DEPTH = LOG_RADIUS * 0.5;
/** Bark and freshly cut wood, as vertex colours on the notched-log mesh. */
const barkColor = new THREE.Color(0x5a3f2a);
const cutColor = new THREE.Color(0xb8925a);
const notchedWood = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true });

/**
 * A log with real notches (designer, after 1.0c: "subtract them, show physical
 * notches"). One swept mesh along X: the cross-section is the full circle
 * between notches and, across each notch, the circle clipped flat top and
 * bottom by NOTCH_DEPTH — so a cross log sits down into it. Rings are
 * doubled at each notch edge for a vertical cut face. Cut faces and end
 * grain are pale; bark is bark.
 */
function notchedLogGeometry(length: number, notchXs: number[], radius = LOG_RADIUS): THREE.BufferGeometry {
  const SEG = 14;
  const clip = radius - NOTCH_DEPTH;
  const positions: number[] = [];
  const colors: number[] = [];
  const index: number[] = [];
  // Ring stations along X. Each notch edge has three coincident rings: the bark
  // ring (so bark stays bark up to the cut), a pale full ring and the pale
  // clipped ring (so the vertical cut face and the flat are all cut wood).
  const stations: { x: number; clipped: boolean; pale: boolean }[] = [{ x: -length / 2, clipped: false, pale: false }];
  for (const nx of [...notchXs].sort((a, b) => a - b)) {
    const a = nx - NOTCH_WIDTH / 2;
    const b = nx + NOTCH_WIDTH / 2;
    stations.push(
      { x: a, clipped: false, pale: false },
      { x: a, clipped: false, pale: true },
      { x: a, clipped: true, pale: true },
      { x: b, clipped: true, pale: true },
      { x: b, clipped: false, pale: true },
      { x: b, clipped: false, pale: false }
    );
  }
  stations.push({ x: length / 2, clipped: false, pale: false });
  const ringStart: number[] = [];
  for (const st of stations) {
    ringStart.push(positions.length / 3);
    for (let i = 0; i < SEG; i++) {
      const th = (i / SEG) * Math.PI * 2;
      let y = radius * Math.sin(th);
      const z = radius * Math.cos(th);
      const inCut = Math.abs(y) > clip;
      if (st.clipped && inCut) y = Math.sign(y) * clip;
      positions.push(st.x, y, z);
      const c = st.pale && inCut ? cutColor : barkColor;
      colors.push(c.r, c.g, c.b);
    }
  }
  // Side quads between consecutive rings.
  for (let r = 0; r < stations.length - 1; r++) {
    const a = ringStart[r];
    const b = ringStart[r + 1];
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG;
      index.push(a + i, b + j, b + i, a + i, a + j, b + j); // outward-facing along +X
    }
  }
  // End caps: pale end grain, fanned from a centre vertex.
  for (const [r, sign] of [
    [0, -1],
    [stations.length - 1, 1],
  ] as const) {
    const centre = positions.length / 3;
    positions.push(stations[r].x, 0, 0);
    colors.push(cutColor.r, cutColor.g, cutColor.b);
    const ring = ringStart[r];
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG;
      // Duplicate the ring vertices so the cap can be pale and flat-shaded on its own.
      const vi = positions.length / 3;
      positions.push(positions[(ring + i) * 3], positions[(ring + i) * 3 + 1], positions[(ring + i) * 3 + 2]);
      positions.push(positions[(ring + j) * 3], positions[(ring + j) * 3 + 1], positions[(ring + j) * 3 + 2]);
      colors.push(cutColor.r, cutColor.g, cutColor.b, cutColor.r, cutColor.g, cutColor.b);
      if (sign < 0) index.push(centre, vi, vi + 1);
      else index.push(centre, vi + 1, vi);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  return geo;
}

/** Notches top and bottom at each grid point along a log: one solid mesh, lying along local X. */
function notched(length: number, points: number[]): THREE.Mesh {
  return new THREE.Mesh(notchedLogGeometry(length, points), notchedWood);
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
    case 'log_half':
      // The outer end is local -X: its notch sits LOG_OVERHANG in from that end.
      return notched(HALF_LOG_LENGTH, [-HALF_LOG_LENGTH / 2 + LOG_OVERHANG]);
    case 'log_stubbed': {
      // A short log cut through the middle: two stubs' worth, still lying end to end.
      const a = logMesh(STUB_LENGTH);
      a.position.x = -STUB_LENGTH / 2 - 0.03;
      const b = logMesh(STUB_LENGTH);
      b.position.x = STUB_LENGTH / 2 + 0.03;
      return holder(wood, a, b);
    }
    case 'ingot':
    case 'ingot_hot': {
      // A bar, slightly tapered: wider at the base.
      const g = new THREE.BoxGeometry(0.36, 0.13, 0.15);
      const pos = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) if (pos.getY(i) > 0) pos.setZ(i, pos.getZ(i) * 0.8), pos.setX(i, pos.getX(i) * 0.9);
      g.computeVertexNormals();
      return new THREE.Mesh(g, look === 'ingot_hot' ? metalHot : metal);
    }
    case 'dagger':
    case 'dagger_hot': {
      const m = look === 'dagger_hot' ? metalHot : metal;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.07), m);
      const pos = blade.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) if (pos.getX(i) > 0) pos.setZ(i, pos.getZ(i) * 0.15), pos.setY(i, pos.getY(i) * 0.4); // to a point
      blade.geometry.computeVertexNormals();
      blade.position.x = 0.1;
      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.14), m);
      guard.position.x = -0.07;
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.14, 6), grip);
      handle.rotation.z = Math.PI / 2;
      handle.position.x = -0.15;
      const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 5), m);
      pommel.position.x = -0.23;
      return holder(m, blade, guard, handle, pommel);
    }
    case 'chestpiece': {
      // A torso shell, open top and bottom, with the core set in its front (−Z, the way the avatar faces).
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.2, 0.32, 8, 1, true), plate);
      shell.material = plate.clone();
      (shell.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 6, 10), plateDark);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.16;
      const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 12), plateDark);
      socket.rotation.x = Math.PI / 2;
      socket.position.set(0, 0.04, -0.17);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 12), suitLight);
      core.rotation.x = Math.PI / 2;
      core.position.set(0, 0.04, -0.18);
      // The core gives light: on the floor ahead of him, on whatever it lies beside.
      const glow = new THREE.PointLight(0x8fe6ff, 5, 3.5, 2);
      glow.position.set(0, 0.04, -0.24);
      return holder(plate, shell, collar, socket, core, glow);
    }
    case 'helm': {
      // A head shell with a faceplate and two slit eyes that give their own light.
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), plate);
      const face = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.15, 0.05), plateDark);
      face.position.set(0, -0.02, -0.11);
      const chin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.2), plateDark);
      chin.position.y = -0.09;
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.014, 0.012), suitLight);
      eyeL.position.set(-0.04, 0.015, -0.14);
      const eyeR = eyeL.clone();
      eyeR.position.x = 0.04;
      return holder(plate, dome, face, chin, eyeL, eyeR);
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
