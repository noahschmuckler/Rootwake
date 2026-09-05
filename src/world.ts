// Pass 0.4a: the trees do the confining; the ground is grey coarse rock.
// Pass 0.5: the plateau ends. A curving cliff line at +X, a near-vertical
// face dropping ~400 units through haze, and a landscape far below that is
// only ever seen, never walked — forest carpet, a river, layered mountain
// silhouettes to the horizon, exponential fog for aerial perspective, a
// gradient sky. Convincing from the lip; not built to survive a visit.

import * as THREE from 'three';
import { mulberry32 } from './colors';

// ---- Tuning constants ---------------------------------------------------------
export const GROUND_Y = -1;
/** Fog/horizon colour and the zenith it grades to. */
export const HAZE_COLOR = 0xdfe7ef;
export const ZENITH_COLOR = 0x8fb0d8;
export const HEMI_SKY_COLOR = 0xdfe8f0;
/** Exponential-squared fog: ~10% at 300, ~25% at 450 (the cliff foot), ~60% at 1000, gone by ~2000. Barely touches the thicket. */
export const FOG_DENSITY = 0.0011;
/** Coarse rock: colour, mesh density and bump height. */
export const ROCK_COLOR = 0x76756f;
export const CLIFF_COLOR = 0x6c6b64;
export const ROCK_SEGMENT = 0.5; // world units per grid cell
export const ROCK_BUMP = 0.05;
/** Walkable plateau: x from PLATEAU_MIN_X to the cliff line; |z| up to PLATEAU_HALF_Z. */
export const PLATEAU_MIN_X = -60;
export const PLATEAU_HALF_Z = 60;
/** The cliff line: x = CLIFF_X plus two slow waves so it isn't a ruler. */
export const CLIFF_X = 24;
/** How near the lip you may stand. The vertigo dip/FOV ramp starts ~1.5 out. */
export const EDGE_MARGIN = 0.4;
/** How far the ground is below the lip. At this scale ~1 unit ≈ 1.5 m, so ~600 m. */
export const DROP = 400;
// -------------------------------------------------------------------------------

export interface World {
  group: THREE.Group;
  /** Handles the day cycle repaints (Pass 0.7b). */
  sun: THREE.DirectionalLight;
  moon: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  skyMaterial: THREE.MeshBasicMaterial;
  fog: THREE.FogExp2;
  /** Can the player stand here? The waypoint fan filters candidates through this. */
  isWalkable: (p: THREE.Vector3) => boolean;
  /** Horizontal distance from a point to the cliff lip (negative = past it). */
  distanceToEdge: (p: THREE.Vector3) => number;
}

/** x of the cliff lip at a given z. */
export function cliffEdgeX(z: number): number {
  return CLIFF_X + 3 * Math.sin(z / 9) + 1.2 * Math.sin(z / 3.1 + 1);
}

/** The plateau: a displaced, flat-shaded plane, cut along the cliff line. */
function plateauGeometry(seed: number): THREE.BufferGeometry {
  const width = CLIFF_X + 8 - PLATEAU_MIN_X;
  const depth = PLATEAU_HALF_Z * 2;
  const geo = new THREE.PlaneGeometry(width, depth, Math.round(width / ROCK_SEGMENT), Math.round(depth / ROCK_SEGMENT));
  geo.rotateX(-Math.PI / 2);
  geo.translate(PLATEAU_MIN_X + width / 2, 0, 0);
  const rand = mulberry32(seed);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    // Vertices past the lip collapse onto it, so the ground ends on the line exactly.
    const edge = cliffEdgeX(z);
    if (x > edge) pos.setX(i, edge);
    const ripple = Math.sin(x * 1.7 + z * 0.9) * 0.35 + Math.sin(x * 0.4 - z * 1.3) * 0.25;
    pos.setY(i, (ripple + (rand() - 0.5)) * ROCK_BUMP);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * The cliff face: a ribbon hung from the lip, rows at increasing depth. The
 * top rows are close together and lightly displaced (the detail you see
 * looking over), the lower rows spread out and lean outward into talus.
 */
function cliffGeometry(seed: number): THREE.BufferGeometry {
  const depths = [0, 0.35, 0.9, 1.8, 3.2, 5.5, 9, 15, 25, 40, 65, 100, 160, 250, DROP];
  const zSteps = 200;
  const rand = mulberry32(seed);
  const positions: number[] = [];
  const indices: number[] = [];
  for (let zi = 0; zi <= zSteps; zi++) {
    const z = -PLATEAU_HALF_Z + (zi / zSteps) * PLATEAU_HALF_Z * 2;
    const edge = cliffEdgeX(z);
    for (let di = 0; di < depths.length; di++) {
      const d = depths[di];
      // Facets grow with depth; strata are per-row ledges so the face reads
      // as layered rock rather than a smooth wall.
      const amp = 0.22 + d * 0.02;
      const coherent = Math.sin(z * 1.3 + d * 0.7) * 0.5 + Math.sin(z * 0.37 - d * 0.21) * 0.5;
      const ledge = di % 2 === 0 ? 0.35 + d * 0.01 : 0;
      const jitter = d === 0 ? 0 : (coherent + (rand() - 0.5)) * amp + ledge;
      const lean = 0.03 * d;
      positions.push(edge + lean + jitter, GROUND_Y - d, z);
    }
  }
  const cols = depths.length;
  for (let zi = 0; zi < zSteps; zi++) {
    for (let di = 0; di < cols - 1; di++) {
      const a = zi * cols + di;
      const b = a + cols;
      // Wound so the front face points outward (+X): the side you look down onto is the lit one.
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** A sky sphere graded from haze at the horizon to blue overhead. Unfogged. */
function skyDome(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(2800, 32, 16);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const haze = new THREE.Color(HAZE_COLOR);
  const zenith = new THREE.Color(ZENITH_COLOR);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(pos.getY(i) / 2800, 0, 1);
    c.copy(haze).lerp(zenith, Math.pow(t, 0.6));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  mesh.renderOrder = -1;
  return mesh;
}

export function buildWorld(scene: THREE.Scene): World {
  const group = new THREE.Group();
  const rand = mulberry32(19);

  scene.background = new THREE.Color(HAZE_COLOR);
  const fog = new THREE.FogExp2(HAZE_COLOR, FOG_DENSITY);
  scene.fog = fog;
  const sky = skyDome();
  group.add(sky);

  // Lighting: a bright sky hemisphere, a low warm sun from the cliff side so
  // the vista direction is the lit one. The day cycle repaints these.
  const hemi = new THREE.HemisphereLight(HEMI_SKY_COLOR, 0x2a3324, 1.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.6);
  sun.position.set(30, 12, -8);
  scene.add(sun);
  const moon = new THREE.DirectionalLight(0xbcc8e0, 0);
  moon.position.set(-6, 40, 12);
  scene.add(moon);

  // The plateau and its cliff face.
  const rockMaterial = new THREE.MeshStandardMaterial({ color: ROCK_COLOR, roughness: 1, flatShading: true });
  const plateau = new THREE.Mesh(plateauGeometry(11), rockMaterial);
  plateau.position.y = GROUND_Y;
  group.add(plateau);
  const cliff = new THREE.Mesh(cliffGeometry(13), new THREE.MeshStandardMaterial({ color: CLIFF_COLOR, roughness: 1, flatShading: true, side: THREE.DoubleSide }));
  group.add(cliff);

  // Loose stone along the lip — the near detail that gives the drop a scale reference.
  const boulder = new THREE.IcosahedronGeometry(1, 0);
  for (let i = 0; i < 40; i++) {
    const z = -PLATEAU_HALF_Z + rand() * PLATEAU_HALF_Z * 2;
    const r = 0.1 + rand() * 0.3;
    const m = new THREE.Mesh(boulder, rockMaterial);
    m.position.set(cliffEdgeX(z) - 0.2 + rand() * 0.5, GROUND_Y + r * 0.4, z);
    m.scale.set(r, r * 0.7, r);
    m.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    group.add(m);
  }

  // ---- The landscape below. Seen from ~400 up; never walked. ------------------
  const floorY = GROUND_Y - DROP;
  const forestFloor = new THREE.Mesh(new THREE.PlaneGeometry(8000, 8000), new THREE.MeshStandardMaterial({ color: 0x3f6a3a, roughness: 1 }));
  forestFloor.rotation.x = -Math.PI / 2;
  forestFloor.position.y = floorY;
  group.add(forestFloor);

  // Forest texture: a few hundred dark canopies, denser near the cliff foot, thinning out.
  const canopy = new THREE.SphereGeometry(1, 10, 6);
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0x2c5230, roughness: 1, flatShading: true });
  for (let i = 0; i < 260; i++) {
    const x = CLIFF_X + 25 + Math.pow(rand(), 1.6) * 1100;
    const z = (rand() * 2 - 1) * (300 + x * 0.9);
    const r = 10 + rand() * 40 + x * 0.02;
    const m = new THREE.Mesh(canopy, canopyMaterial);
    m.position.set(x, floorY, z);
    m.scale.set(r, r * (0.35 + rand() * 0.3), r);
    group.add(m);
  }

  // A river, because nothing says "far below" like water you cannot reach.
  const river = new THREE.Mesh(new THREE.PlaneGeometry(2200, 34), new THREE.MeshBasicMaterial({ color: 0xb4c6d4 }));
  river.rotation.x = -Math.PI / 2;
  river.rotation.z = -0.35;
  river.position.set(CLIFF_X + 700, floorY + 0.5, 150);
  group.add(river);

  // Mountain silhouettes in three layers, unlit so the fog alone grades them.
  // Nearer ridges are lower and darker; the far range is tall and pale.
  const layers: { minX: number; maxX: number; count: number; rMin: number; rMax: number; hMin: number; hMax: number; color: number }[] = [
    { minX: 380, maxX: 560, count: 11, rMin: 90, rMax: 200, hMin: 60, hMax: 170, color: 0x4a5b56 },
    { minX: 800, maxX: 1150, count: 14, rMin: 160, rMax: 340, hMin: 150, hMax: 330, color: 0x5d7079 },
    { minX: 1500, maxX: 2100, count: 16, rMin: 260, rMax: 520, hMin: 300, hMax: 560, color: 0x7d91a3 },
  ];
  for (const L of layers) {
    const material = new THREE.MeshBasicMaterial({ color: L.color });
    for (let i = 0; i < L.count; i++) {
      const x = L.minX + rand() * (L.maxX - L.minX);
      const z = (rand() * 2 - 1) * (x * 1.15);
      const r = L.rMin + rand() * (L.rMax - L.rMin);
      const h = L.hMin + rand() * (L.hMax - L.hMin);
      const peak = new THREE.Mesh(new THREE.ConeGeometry(r, h, 5 + Math.floor(rand() * 3)), material);
      peak.position.set(x, floorY + h / 2, z);
      peak.rotation.y = rand() * Math.PI;
      group.add(peak);
    }
  }

  scene.add(group);

  const isWalkable = (p: THREE.Vector3): boolean =>
    p.x <= cliffEdgeX(p.z) - EDGE_MARGIN && p.x >= PLATEAU_MIN_X + 1 && Math.abs(p.z) <= PLATEAU_HALF_Z - 1;
  const distanceToEdge = (p: THREE.Vector3): number => cliffEdgeX(p.z) - p.x;

  return { group, sun, moon, hemi, skyMaterial: sky.material as THREE.MeshBasicMaterial, fog, isWalkable, distanceToEdge };
}
