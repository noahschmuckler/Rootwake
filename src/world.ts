// Pass 0.2: the smallest environment that can carry the confinement→vista
// contrast. Not art — a signal. Around the start: dark ground, a dark hedge
// wall, a dark canopy overhead, so the only light is what leaks between
// voxels. Through one opening in the wall: a bright, hazy plain with a few
// pale hills far off, and bright fog so distance reads as *open*, not far.

import * as THREE from 'three';

// ---- Tuning constants ---------------------------------------------------------
export const GROUND_Y = -1;
/** Radius of the dark pocket / hedge wall around the start. */
export const ENCLOSURE_RADIUS = 7.5;
export const WALL_HEIGHT = 4.5;
export const CANOPY_HEIGHT = 3.4;
/** The one way out: an opening in the wall centred on +X, this wide. */
export const OPENING_CENTER_ANGLE = 0; // radians, atan2(z, x) convention → +X
export const OPENING_HALF_ANGLE = Math.PI / 8; // ~45° total: from the pocket the outer pair covers all of it but the slit
export const VISTA_COLOR = 0xe6ecf2;
export const FOG_NEAR = 9;
export const FOG_FAR = 45;
// -------------------------------------------------------------------------------

/**
 * A disc built from a subdivided grid clamped to a radius, instead of
 * CircleGeometry's fan. The fan's centre vertex sits exactly under (or over)
 * the camera at the start point, which puts a vertex at w = 0 in clip space
 * and made software/mobile rasterisers draw the disc over everything.
 */
function discGeometry(radius: number, segments: number): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2, segments, segments);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.hypot(x, y);
    if (r > radius) {
      pos.setXY(i, (x / r) * radius, (y / r) * radius);
    }
  }
  pos.needsUpdate = true;
  return geo;
}

export interface World {
  group: THREE.Group;
  /** Keeps the player inside the hedge unless they're going through the opening. */
  collide: (p: THREE.Vector3) => void;
}

export function buildWorld(scene: THREE.Scene): World {
  const group = new THREE.Group();

  scene.background = new THREE.Color(VISTA_COLOR);
  scene.fog = new THREE.Fog(VISTA_COLOR, FOG_NEAR, FOG_FAR);

  // Lighting: a bright sky hemisphere so the plain is lit and pale, a low
  // warm sun from the opening side so the vista direction is the lit one.
  scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x2a3324, 1.1));
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.6);
  sun.position.set(30, 12, -8);
  scene.add(sun);

  // Bright open plain, everywhere.
  const plain = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0xd9d3bd, roughness: 1 })
  );
  plain.rotation.x = -Math.PI / 2;
  plain.position.y = GROUND_Y;
  group.add(plain);

  // Dark pocket floor under the thicket.
  const pocket = new THREE.Mesh(
    discGeometry(ENCLOSURE_RADIUS + 0.6, 24),
    new THREE.MeshStandardMaterial({ color: 0x151b12, roughness: 1 })
  );
  pocket.rotation.x = -Math.PI / 2;
  pocket.position.y = GROUND_Y + 0.005;
  group.add(pocket);

  // Hedge wall: an open cylinder with a gap centred on the opening. Three's
  // CylinderGeometry measures theta from +Z toward +X, so the opening at +X
  // (our angle 0) sits at theta = π/2.
  const gap = OPENING_HALF_ANGLE * 2;
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(ENCLOSURE_RADIUS, ENCLOSURE_RADIUS, WALL_HEIGHT, 72, 1, true, Math.PI / 2 + gap / 2, Math.PI * 2 - gap),
    new THREE.MeshStandardMaterial({ color: 0x18261a, roughness: 1, side: THREE.DoubleSide })
  );
  wall.position.y = GROUND_Y + WALL_HEIGHT / 2;
  group.add(wall);

  // Canopy: a dark lid over the pocket so looking up reads as enclosed too.
  const canopy = new THREE.Mesh(
    discGeometry(ENCLOSURE_RADIUS + 0.3, 24),
    new THREE.MeshStandardMaterial({ color: 0x10170f, roughness: 1, side: THREE.DoubleSide })
  );
  canopy.rotation.x = Math.PI / 2;
  canopy.position.y = GROUND_Y + CANOPY_HEIGHT;
  group.add(canopy);

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

  const collide = (p: THREE.Vector3): void => {
    const r = Math.hypot(p.x, p.z);
    const thickness = 0.45;
    if (Math.abs(r - ENCLOSURE_RADIUS) > thickness) return;
    let angle = Math.atan2(p.z, p.x) - OPENING_CENTER_ANGLE;
    angle = Math.atan2(Math.sin(angle), Math.cos(angle));
    if (Math.abs(angle) < OPENING_HALF_ANGLE) return;
    // Push back to whichever side of the wall they came from.
    const target = r < ENCLOSURE_RADIUS ? ENCLOSURE_RADIUS - thickness : ENCLOSURE_RADIUS + thickness;
    const k = target / r;
    p.x *= k;
    p.z *= k;
  };

  return { group, collide };
}
