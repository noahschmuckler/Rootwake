// Pass 0.2 built the enclosure as a dark hedge wall and canopy — scaffolding
// to get a confined pocket fast. Pass 0.4a retires it (DESIGN.md): the trees
// themselves are dense enough to do the confining now, and the ground is
// grey coarse rock, which the tillable grass patches (0.4b) interrupt. What
// is left here is the floor, the light, the haze and a few pale hills for
// the vista to land on.

import * as THREE from 'three';
import { mulberry32 } from './colors';

// ---- Tuning constants ---------------------------------------------------------
export const GROUND_Y = -1;
export const VISTA_COLOR = 0xe6ecf2;
export const FOG_NEAR = 9;
export const FOG_FAR = 45;
/** Coarse rock: colour, the size of the bumpy near field, its mesh density and bump height. */
export const ROCK_COLOR = 0x76756f;
export const ROCK_FIELD = 90;
export const ROCK_SEGMENTS = 150;
export const ROCK_BUMP = 0.05;
// -------------------------------------------------------------------------------

export interface World {
  group: THREE.Group;
}

/** A displaced, flat-shaded plane: reads as broken rock without a texture. */
function rockGeometry(seed: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(ROCK_FIELD, ROCK_FIELD, ROCK_SEGMENTS, ROCK_SEGMENTS);
  const rand = mulberry32(seed);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Two scales of ripple plus per-vertex jitter; flat shading turns it into facets.
    const ripple = Math.sin(x * 1.7 + y * 0.9) * 0.35 + Math.sin(x * 0.4 - y * 1.3) * 0.25;
    pos.setZ(i, (ripple + (rand() - 0.5)) * ROCK_BUMP);
  }
  geo.computeVertexNormals();
  return geo;
}

export function buildWorld(scene: THREE.Scene): World {
  const group = new THREE.Group();

  scene.background = new THREE.Color(VISTA_COLOR);
  scene.fog = new THREE.Fog(VISTA_COLOR, FOG_NEAR, FOG_FAR);

  // Lighting: a bright sky hemisphere, a low warm sun from the opening side
  // so the vista direction is the lit one.
  scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x2a3324, 1.1));
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.6);
  sun.position.set(30, 12, -8);
  scene.add(sun);

  // Near field: bumpy, faceted rock. Far field: the same colour, flat, to the horizon.
  const rockMaterial = new THREE.MeshStandardMaterial({ color: ROCK_COLOR, roughness: 1, flatShading: true });
  const rock = new THREE.Mesh(rockGeometry(11), rockMaterial);
  rock.rotation.x = -Math.PI / 2;
  rock.position.y = GROUND_Y;
  group.add(rock);
  const plain = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: ROCK_COLOR, roughness: 1 }));
  plain.rotation.x = -Math.PI / 2;
  plain.position.y = GROUND_Y - 0.06;
  group.add(plain);

  // A few pale hills out past the opening so the vista has depth to land on.
  const hillMaterial = new THREE.MeshStandardMaterial({ color: 0xcfd6d2, roughness: 1 });
  const hills: [number, number, number, number][] = [
    // x, z, radius, height
    [34, -6, 9, 4],
    [46, 10, 14, 6],
    [62, -18, 20, 9],
    [40, 26, 8, 3.5],
  ];
  for (const [x, z, r, h] of hills) {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), hillMaterial);
    hill.scale.set(r, h, r);
    hill.position.set(x, GROUND_Y, z);
    group.add(hill);
  }

  scene.add(group);
  return { group };
}
