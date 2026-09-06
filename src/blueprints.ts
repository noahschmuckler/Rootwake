// Pass 1.0c: blueprints (SYSTEMS.md §5, DESIGN.md). A blueprint is a known
// structure — or a module of one — as data: the pieces it is made of, each
// with a place in the site's frame, and how it is sited (on the ground, on
// top of a structure's walls, or inside on its floor). The ingredients are
// simply the pieces' types, counted. Building is a board session at the site
// (site.ts) that flies one ingredient into its place per match.
//
// This is DiggyDwarves' structure model with weight's two twists (SYSTEMS §5):
// the materials must be *here*, hauled in by hand, and the built thing is the
// very objects that went into it. Designer, after 1.0b: freeform notch-fitting
// on a phone is fiddling; modules a thumb can site are a building system.

import { LONG_LOG_LENGTH, NOTCH_PITCH, LOG_RADIUS, SHORT_LOG_LENGTH, STUB_LENGTH, OBJECT_TYPES, type ObjectTypeId } from './objects';

// ---- Tuning constants ---------------------------------------------------------
/** The bay and the log thickness (the notch grid, objects.ts). */
export const P = NOTCH_PITCH;
export const T = LOG_RADIUS * 2;
export const ROOF_SLATS = 8;
export const FLOOR_BOARDS = 7;
export const BED_STICKS = 5;
/** Room around a footprint for the ingredients to lie in, loosely piled. */
export const RING_PADDING = 1.2;
// -------------------------------------------------------------------------------

/** One piece of a blueprint: what, where in the site frame (along, across, up from the base), which way it lies. */
export interface PiecePlan {
  type: ObjectTypeId;
  along: number;
  across: number;
  /** Centre height above the siting base (ground, or the wall top, or the floor). */
  y: number;
  /** 0 lies along the frame's long axis; PI/2 across it. */
  yaw: number;
  /** What it is for: walls block, roofs keep rain off, beds are slept in. */
  tag: 'course' | 'door' | 'roof' | 'floor' | 'bed';
}

/** What a blueprint needs to know about a structure it might be sited on. */
export interface StructureLike {
  courses: number;
  doorCourses: number;
  roofSlats: number;
  floorBoards: number;
  bedPieces: number;
}

export interface Blueprint {
  id: string;
  label: string;
  blurb: string;
  pieces: PiecePlan[];
  /** 'ground': a new structure, sited from a loose material, its open front facing you.
   *  'top': on a structure's walls (base = wall top). 'inside': on its floor (base = ground or floor). */
  siting: 'ground' | 'top' | 'inside';
  /** Half-extents of the footprint (along, across), for the site ring. */
  half: [number, number];
  /** Why it cannot go on this structure, or null if it can. */
  fits: (s: StructureLike) => string | null;
  /** Height above ground the pieces' y is measured from, when not the siting's default (wall top / floor). */
  baseOf?: (s: StructureLike) => number;
}

const uCourse = (): PiecePlan[] => [
  { type: 'log_long_notched', along: 0, across: -P, y: T / 2, yaw: 0, tag: 'course' },
  { type: 'log_long_notched', along: 0, across: P, y: T / 2, yaw: 0, tag: 'course' },
  { type: 'log_long_notched', along: -P, across: 0, y: T, yaw: Math.PI / 2, tag: 'course' },
];

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'u-course',
    label: 'Cabin course',
    blurb: 'Three long notched logs in a U, two bays each way, open toward you. Each course raises the walls a log. Three make a wall you stand behind.',
    pieces: uCourse(),
    siting: 'ground',
    half: [P + 0.15, P + 0.15],
    fits: () => null,
  },
  {
    id: 'u-course-up',
    label: 'Another course',
    blurb: 'The next U of long logs, dropped into the notches of the one below.',
    pieces: uCourse(),
    siting: 'top',
    half: [P + 0.15, P + 0.15],
    fits: (s) => (s.roofSlats > 0 ? 'The roof is on.' : null),
  },
  {
    id: 'door-wall',
    label: 'Door wall course',
    blurb: 'Closes the open front from one side: a stub as a portable notch, a short notched log on it. The gap it leaves is the doorway. One per course.',
    pieces: [
      { type: 'log_stub', along: P, across: 0, y: T / 2, yaw: 0, tag: 'door' },
      { type: 'log_notched', along: P, across: -P + SHORT_LOG_LENGTH / 2 - 0.15, y: T, yaw: Math.PI / 2, tag: 'door' },
    ],
    siting: 'top',
    half: [0.4, P + 0.15],
    fits: (s) => (s.courses === 0 ? 'Needs a course to sit on.' : s.doorCourses >= s.courses ? 'Needs another course first.' : null),
    baseOf: (s) => T * s.doorCourses, // the front wall climbs course by course from the ground, not from the wall top
  },
  {
    id: 'roof',
    label: 'Slat roof',
    blurb: 'Long timbers across the side walls, edge to edge. Rain stops where a slat is; it comes through the gaps until the roof is whole.',
    pieces: Array.from({ length: ROOF_SLATS }, (_, k) => ({ type: 'timber' as ObjectTypeId, along: -0.75 + 0.24 * k, across: 0, y: 0.05, yaw: Math.PI / 2, tag: 'roof' as const })),
    siting: 'top',
    half: [P + 0.15, LONG_LOG_LENGTH / 2],
    fits: (s) => (s.courses === 0 ? 'Needs walls.' : s.roofSlats > 0 ? 'Already roofed.' : null),
  },
  {
    id: 'floor',
    label: 'Timber floor',
    blurb: 'Long timbers laid inside, wall to wall. A dry floor to sleep on.',
    pieces: Array.from({ length: FLOOR_BOARDS }, (_, k) => ({ type: 'timber' as ObjectTypeId, along: 0, across: -0.72 + 0.24 * k, y: 0.05, yaw: 0, tag: 'floor' as const })),
    siting: 'inside',
    half: [P - 0.2, P - 0.2],
    fits: (s) => (s.courses === 0 ? 'Needs walls around it.' : s.floorBoards > 0 ? 'Already floored.' : null),
  },
  {
    id: 'bed',
    label: 'Bed',
    blurb: 'Two short timbers as rails and a hand of sticks laid across. Furniture: inside, on the floor, under the roof.',
    pieces: [
      { type: 'timber_short', along: -0.3, across: -0.3, y: 0.05, yaw: 0, tag: 'bed' },
      { type: 'timber_short', along: -0.3, across: 0.3, y: 0.05, yaw: 0, tag: 'bed' },
      ...Array.from({ length: BED_STICKS }, (_, k) => ({ type: 'stick' as ObjectTypeId, along: -0.3 - 0.24 + 0.12 * k, across: 0, y: 0.13, yaw: Math.PI / 2, tag: 'bed' as const })),
    ],
    siting: 'inside',
    half: [0.8, 0.5],
    fits: (s) => (s.courses === 0 ? 'Needs walls around it.' : s.bedPieces > 0 ? 'There is a bed.' : null),
  },
];

/** The blueprints that could be sited on this structure (with reasons for the ones that can't), in order. */
export function blueprintsFor(s: StructureLike | null): { bp: Blueprint; reason: string | null }[] {
  return BLUEPRINTS.filter((bp) => (s ? bp.siting !== 'ground' : bp.siting === 'ground')).map((bp) => ({ bp, reason: s ? bp.fits(s) : null }));
}

/** Ingredient counts by type. */
export function ingredientsOf(bp: Blueprint): { type: ObjectTypeId; count: number }[] {
  const counts = new Map<ObjectTypeId, number>();
  for (const p of bp.pieces) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
  return [...counts].map(([type, count]) => ({ type, count }));
}

export function ingredientsText(bp: Blueprint): string {
  return ingredientsOf(bp)
    .map(({ type, count }) => `${count} ${OBJECT_TYPES[type].label}${count > 1 && !OBJECT_TYPES[type].label.endsWith('s') ? 's' : ''}`)
    .join(', ');
}

/** Materials a long-press offers "Blueprints…" on. */
export const BUILD_MATERIALS: ObjectTypeId[] = ['log', 'log_short', 'log_long_notched', 'log_notched', 'log_stub', 'timber', 'timber_short', 'stick'];

/**
 * Draw the blueprint as a plan: an oblique view, along → right, across → down,
 * up → up. Pieces are their lengths and widths; higher pieces are drawn later
 * and lighter, so a course reads as a course.
 */
export function drawPlan(bp: Blueprint, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const scale = Math.min(W / (bp.half[0] * 2 + 1.2), H / (bp.half[1] * 2 + 1.6)) * 0.85;
  const ox = W / 2;
  const oy = H / 2 + 14;
  const toScreen = (along: number, across: number, y: number): [number, number] => [ox + along * scale, oy + across * scale * 0.55 - y * scale * 0.9];
  // the footprint
  ctx.strokeStyle = 'rgba(190, 255, 170, 0.35)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  const corners: [number, number][] = [
    [-bp.half[0], -bp.half[1]],
    [bp.half[0], -bp.half[1]],
    [bp.half[0], bp.half[1]],
    [-bp.half[0], bp.half[1]],
  ];
  corners.forEach(([a, c], i) => {
    const [x, y] = toScreen(a, c, 0);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  const pieces = [...bp.pieces].sort((a, b) => a.y - b.y || a.across - b.across);
  for (const p of pieces) {
    const len = lengthOf(p.type);
    const wide = p.type.startsWith('timber') ? 0.24 : p.type === 'stick' ? 0.08 : T;
    const alongLen = p.yaw === 0 ? len : wide;
    const acrossLen = p.yaw === 0 ? wide : len;
    const [x0, y0] = toScreen(p.along - alongLen / 2, p.across - acrossLen / 2, p.y);
    const [x1, y1] = toScreen(p.along + alongLen / 2, p.across + acrossLen / 2, p.y);
    const light = Math.min(1, 0.55 + p.y * 0.5);
    ctx.fillStyle = p.type.startsWith('timber') ? `rgba(184, 146, 90, ${light})` : p.type === 'stick' ? `rgba(120, 90, 60, ${light})` : `rgba(110, 78, 50, ${light})`;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x0, y1, x1 - x0, y0 - y1);
    ctx.strokeRect(x0, y1, x1 - x0, y0 - y1);
  }
  // an arrow for "you are here": the open side faces the viewer (+along)
  ctx.fillStyle = 'rgba(190, 255, 170, 0.8)';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('you ▸', W - 6, H - 6);
}

function lengthOf(type: ObjectTypeId): number {
  switch (type) {
    case 'log':
    case 'log_long_notched':
    case 'timber':
      return LONG_LOG_LENGTH;
    case 'log_short':
    case 'log_notched':
    case 'timber_short':
      return SHORT_LOG_LENGTH;
    case 'log_stub':
      return STUB_LENGTH;
    case 'stick':
      return 0.55;
    default:
      return 0.3;
  }
}
