// The Descent (DESCENT.md): the catwalks of the placid layers, as rules. Each deepening of the node is a
// catwalk she can step out onto: a ring along the wall of a round chamber round the beam's shaft, the
// drop hanging in the shaft with a gangway to the ring, alcoves in the wall, and (deeper) spokes across
// the shaft to an inner ring, after the painted cutaway's ring and X walkways. Depth 0 is the first,
// under the Cap. Each layer is a letter of R-E-V-I-L-E-D and a band of the rainbow. Pure: no Three.js,
// node-tested; the scene (descentWorld.ts) is built from this.

export const LETTERS = ['R', 'E', 'V', 'I', 'L', 'E', 'D'] as const;
/** The bands, red at the top: the beam in the shaft grows richer as it goes down (DiggyDwarves, the Karst Spine). Tuning (Noah to judge against the cel look). */
export const BANDS = ['#ff6a52', '#ff9e46', '#ffd85a', '#6ee07a', '#52b6ff', '#7a7cff', '#bb7aff'] as const;
export const LAYERS = LETTERS.length;

/** Sizes (m; she is 0.72 m tall). The wall's radius at depth 0 and its growth per layer; the walkway's width; the drop's radius; the gangway's half width; the chamber's height and its growth; an alcove's width, depth and height. Tuning. */
export const WALL_R = 7, WALL_GROW = 1.8, RING_W = 2.2, DROP_VIS_R = 1.3, GANGWAY_HALF = 0.55, ROOM_H = 5, ROOM_GROW = 0.6;
export const ALCOVE_W = 1.4, ALCOVE_D = 1.1, ALCOVE_H = 1.8, SPOKE_HALF = 0.6, INNER_W = 1.3;

export type StationKind = 'archive' | 'power' | 'machine';
export interface Station { kind: StationKind; keeper: 'snerk' | 'hollowed' | 'greeblin'; angle: number; alcove: number }
export interface Catwalk {
  depth: number; letter: string; band: string;
  /** The wall's radius; the walkway runs from ringIn to the wall. */ wallR: number; ringIn: number;
  height: number;
  /** Alcove angles (radians, 0 along +x), one gap of the wall each. */ alcoves: number[];
  /** The gangway from the drop to the ring, along this angle. */ gangway: number;
  /** Spokes across the shaft (angles) to an inner ring of radius innerR (none at depth 0). */ spokes: number[]; innerR: number;
  stations: Station[];
}

/** The catwalk at a depth (0 .. LAYERS-1): each a little larger than the last, the deeper ones built out with spokes and an inner ring, and more keepers. */
export function catwalk(depth: number): Catwalk {
  const d = Math.max(0, Math.min(LAYERS - 1, Math.floor(depth)));
  const wallR = WALL_R + WALL_GROW * d, ringIn = wallR - RING_W, n = 8 + 2 * d;
  const alcoves = Array.from({ length: n }, (_, i) => (i + 0.5) / n * Math.PI * 2);
  const gangway = 0;
  // The sigils (after the cutaway): a plain ring first, then spokes in an X, then more.
  const spokeN = d === 0 ? 0 : d % 2 === 1 ? 4 : 2 + d;
  const spokes = Array.from({ length: spokeN }, (_, i) => Math.PI / 4 + i / spokeN * Math.PI * 2);
  const innerR = spokeN ? Math.max(DROP_VIS_R + 1.4, ringIn * 0.45) : 0;
  // The keepers: the snerk's archive across from the gangway at every depth; a hollowed's power node from the second; a greeblin's machine from the fourth.
  const across = nearestAlcove(alcoves, Math.PI);
  const stations: Station[] = [{ kind: 'archive', keeper: 'snerk', angle: alcoves[across], alcove: across }];
  if (d >= 1) { const i = nearestAlcove(alcoves, Math.PI / 2); stations.push({ kind: 'power', keeper: 'hollowed', angle: alcoves[i], alcove: i }); }
  if (d >= 3) { const i = nearestAlcove(alcoves, -Math.PI / 2); stations.push({ kind: 'machine', keeper: 'greeblin', angle: alcoves[i], alcove: i }); }
  return { depth: d, letter: LETTERS[d], band: BANDS[d], wallR, ringIn, height: ROOM_H + ROOM_GROW * d, alcoves, gangway, spokes, innerR, stations };
}
function nearestAlcove(alcoves: number[], angle: number): number {
  let best = 0, bd = Infinity; for (let i = 0; i < alcoves.length; i++) { const d = Math.abs(Math.atan2(Math.sin(alcoves[i] - angle), Math.cos(alcoves[i] - angle))); if (d < bd) { bd = d; best = i; } } return best;
}
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
/** Whether (x, z) is somewhere she can stand on catwalk c (the floor is at y = 0): the ring, an alcove's floor, the gangway, a spoke, the inner ring. */
export function walkable(c: Catwalk, x: number, z: number): boolean {
  const r = Math.hypot(x, z), a = Math.atan2(z, x);
  if (r >= c.ringIn && r <= c.wallR - 0.05) return true;
  // Into an alcove: within its width, out to its depth.
  if (r > c.wallR - 0.05 && r <= c.wallR + ALCOVE_D) for (const al of c.alcoves) if (Math.abs(wrap(a - al)) * c.wallR < ALCOVE_W / 2 - 0.05) return true;
  // Along the gangway from the drop's skin to the ring.
  if (onBeam(x, z, c.gangway, GANGWAY_HALF) && r >= DROP_VIS_R * 0.8 && r <= c.ringIn + 0.1) return true;
  for (const s of c.spokes) if (onBeam(x, z, s, SPOKE_HALF) && r >= c.innerR - 0.1 && r <= c.ringIn + 0.1) return true;
  if (c.innerR > 0 && r >= c.innerR - INNER_W && r <= c.innerR) return true;
  return false;
}
/** Within `half` of the ray from the centre along angle a (and ahead of the centre). */
function onBeam(x: number, z: number, a: number, half: number): boolean {
  const ux = Math.cos(a), uz = Math.sin(a), along = x * ux + z * uz, across = -x * uz + z * ux;
  return along > 0 && Math.abs(across) <= half;
}
/** Where she steps out: on the gangway, just off the drop, facing the ring. */
export function stepOut(c: Catwalk): { x: number; z: number; yaw: number } {
  const r = DROP_VIS_R + 0.45, a = c.gangway; return { x: Math.cos(a) * r, z: Math.sin(a) * r, yaw: Math.atan2(-Math.cos(a), -Math.sin(a)) };
}
/** A station's standing spot: in front of its alcove on the ring. */
export function stationSpot(c: Catwalk, s: Station): { x: number; z: number } { const r = c.wallR - 0.6; return { x: Math.cos(s.angle) * r, z: Math.sin(s.angle) * r }; }

/** What the keepers say (D3 will give them more to do); `{L}` is the layer's letter. The snerks' memories are millennia old and frayed. */
export const KEEPER_LINES: Record<Station['keeper'], string[]> = {
  snerk: [
    'Shift log, entry ten thousand and… some. Still no new work order.',
    'You came out of the drop. Nobody comes out of the drop. Are you the inspection?',
    'This is layer {L}. A letter of the word. Read them going down and they curse you; going up, they ask a favour.',
    'The Cap above us heals itself. Grass on top, stone below, nothing through. Except the beam. Except you.',
    'Archive says the beam should be whiter by now. Archive says a lot of things. Half of it is about soup.',
    'If you are the inspection: the pipes are fine. The crust is load-bearing now. Do not touch the crust.',
  ],
  hollowed: [
    'The node hums. While it hums, we are.',
    'Crystal grows where the light pools. We tend it. We become it, in the end.',
    'Bring nothing that remembers. Or bring it to us.',
  ],
  greeblin: [
    'Furnace wants feeding. Always wants feeding.',
    'Who built it? Don\'t know. Who runs it? Me.',
    'Don\'t lean on that. Or do. It\'s been leaning for a thousand years.',
  ],
};
