// 1.1c: runes — the transmutation marks (SYSTEMS §3, DESIGN). A rune is a
// tangram: a few flat triangles and parallelograms laid out as a stylised
// picture of what the seeds will become. The board charges it one piece at
// a time. The character starts knowing the wheat rune (designer's call).

import * as THREE from 'three';

export type RuneId = 'wheat';
/** Pieces in a rune, and so matches to charge it. */
export const RUNE_SEGMENTS = 8;

function tri(a: [number, number], b: [number, number], c: [number, number]): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], a[1], 0, b[0], b[1], 0, c[0], c[1], 0], 3));
  g.computeVertexNormals();
  return g;
}
function quad(a: [number, number], b: [number, number], c: [number, number], d: [number, number]): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], a[1], 0, b[0], b[1], 0, c[0], c[1], 0, a[0], a[1], 0, c[0], c[1], 0, d[0], d[1], 0], 3));
  g.computeVertexNormals();
  return g;
}

/** A wheat stalk, tangram style: a leaning stem of two parallelograms and six grain triangles up its head. */
export function runeGeometry(rune: RuneId): THREE.BufferGeometry[] {
  switch (rune) {
    case 'wheat':
    default: {
      const s = 0.42; // overall size in metres
      const pieces: THREE.BufferGeometry[] = [];
      // stem: two slanted parallelograms
      pieces.push(quad([-0.06 * s, -1.0 * s], [0.02 * s, -1.0 * s], [0.1 * s, -0.4 * s], [0.02 * s, -0.4 * s]));
      pieces.push(quad([0.02 * s, -0.4 * s], [0.1 * s, -0.4 * s], [0.18 * s, 0.2 * s], [0.1 * s, 0.2 * s]));
      // grains: alternating left/right triangles climbing the head
      for (let i = 0; i < 6; i++) {
        const y = (0.2 + i * 0.16) * s;
        const side = i % 2 === 0 ? -1 : 1;
        const x0 = (0.14 + i * 0.013) * s;
        pieces.push(tri([x0, y], [x0 + side * 0.32 * s, y + 0.1 * s], [x0 + 0.03 * s, y + 0.22 * s]));
      }
      return pieces;
    }
  }
}
