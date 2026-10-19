// The parkour clips' own motion (MOBILITY.md, "Parkour clips"): for each of Noah's Mixamo clips, sampled every
// CLIP_STEP s from the FBX (the X Bot's skeleton, centimetres): the lowest foot's height and the hips' travel
// forward. The planner (parkour.ts) shapes each stage's path on them, so her body goes where the clip's does;
// the layer (huldaTraverse.ts) takes that travel back out of the clip, so the clip only poses her about her
// lowest foot. Regenerate when a clip is replaced: `node scripts/parkour-clips.mjs`. Pure data.

export const CLIP_STEP = 0.05;
/** The lowest foot's height (cm) when she stands: the foot bone sits this far over the ground. */
export const FOOT_REST = 9;
/** Centimetres of the X Bot to metres of Hulda (her 0.72 m to its 178 cm). */
export const CM = 0.72 / 178;
/** A clip whose obstacle doesn't lie ahead also has `yaw`: the degrees about +y that bring it ahead, eased in as she travels (the layer turns its hips by them; hipsZ is measured turned). */
export interface ClipMotion { duration: number; foot: number[]; hipsZ: number[]; yaw?: number[] }
export const CLIP_MOTION: Record<string, ClipMotion> = {
  // <clip-motion> (written by scripts/parkour-clips.mjs)
  'step-up': { duration: 1.367, foot: [9, 9, 9, 9, 9, 9, 10, 13, 17, 23, 31, 34, 34, 34, 33, 33, 33, 33, 33, 33, 34, 36, 39, 44, 53, 57, 57, 57], hipsZ: [2, 4, 7, 9, 11, 14, 16, 18, 20, 21, 23, 23, 25, 26, 27, 29, 31, 33, 35, 37, 40, 43, 45, 47, 49, 50, 52, 53] },
  'mount': { duration: 2.267, foot: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 11, 9, 9, 9, 9, 9, 10, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 11, 12, 13, 13, 13, 14, 14, 14, 14, 14], hipsZ: [1, 1, 1, 1, 1, 0, -1, -2, -2, -2, -1, 0, 0, -1, -1, 0, 2, 5, 10, 15, 21, 27, 32, 38, 43, 46, 49, 52, 54, 57, 59, 62, 66, 69, 72, 76, 78, 81, 83, 85, 87, 88, 89, 89, 90, 90], yaw: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, -3, -3, -4, -5, -6, -10, -14, -19, -24, -29, -33, -38, -42, -45, -48, -51, -54, -57, -61, -64, -69, -73, -78, -82, -85, -87, -88, -89, -90, -90, -90, -90, -90, -90] },
  'jump': { duration: 1.667, foot: [9, 9, 9, 9, 10, 9, 9, 9, 9, 10, 10, 11, 12, 21, 30, 41, 60, 63, 46, 31, 20, 12, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], hipsZ: [2, 1, 1, 0, -2, -5, -7, -8, -9, -8, -7, -4, -1, 3, 5, 2, -1, -3, -4, -3, -1, 0, 0, 0, -1, -1, -1, -1, 0, 1, 1, 1, 2, 2] },
  'jump-to-hang': { duration: 2.000, foot: [132, 137, 144, 152, 158, 158, 150, 135, 122, 113, 113, 118, 124, 130, 135, 139, 141, 140, 135, 126, 116, 104, 93, 81, 70, 62, 58, 56, 54, 54, 55, 54, 54, 54, 53, 52, 51, 50, 50, 50, 49], hipsZ: [0, 11, 21, 32, 43, 53, 63, 74, 87, 98, 107, 112, 116, 115, 112, 106, 99, 90, 82, 75, 68, 63, 61, 61, 63, 67, 72, 77, 83, 89, 96, 102, 108, 112, 114, 115, 114, 114, 113, 112, 110] },
  'hang': { duration: 2.333, foot: [77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 78, 78, 78, 77, 77, 77], hipsZ: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
  'climb-up': { duration: 1.133, foot: [29, 28, 17, 17, 29, 47, 64, 75, 84, 94, 102, 111, 120, 129, 141, 155, 170, 183, 191, 187, 182, 183, 182], hipsZ: [0, -5, -8, -2, 3, 8, 13, 15, 16, 17, 17, 18, 19, 21, 23, 27, 32, 37, 43, 48, 52, 55, 58] },
  'vault': { duration: 1.167, foot: [9, 21, 16, 9, 9, 10, 17, 37, 81, 106, 119, 123, 120, 104, 82, 60, 40, 19, 10, 9, 11, 27, 14, 9], hipsZ: [3, 28, 50, 72, 91, 109, 127, 144, 162, 181, 202, 225, 250, 275, 296, 318, 340, 362, 387, 410, 433, 462, 492, 509] },
  'hang-drop': { duration: 1.667, foot: [132, 131, 131, 131, 132, 134, 135, 133, 129, 121, 108, 93, 76, 60, 41, 21, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9], hipsZ: [-1, -2, -4, -7, -11, -16, -20, -21, -22, -24, -26, -28, -29, -30, -32, -33, -34, -35, -37, -38, -38, -38, -37, -37, -37, -37, -37, -37, -37, -37, -37, -37, -37, -37] },
  'running-jump': { duration: 1.000, foot: [10, 22, 48, 75, 101, 124, 142, 140, 131, 111, 87, 59, 30, 13, 11, 14, 11, 9, 9, 9, 10], hipsZ: [2, 23, 44, 65, 87, 108, 129, 150, 172, 194, 216, 238, 259, 279, 299, 320, 341, 363, 383, 401, 420] },
  'landing': { duration: 2.500, foot: [220, 226, 222, 211, 197, 178, 157, 132, 105, 78, 47, 20, 10, 11, 11, 10, 11, 12, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 13, 13, 12, 12, 11, 11, 11, 11, 11, 11, 12, 12, 14, 13, 9, 9, 9, 9, 9, 9, 9, 9, 9], hipsZ: [0, 6, 13, 22, 31, 40, 50, 60, 70, 80, 89, 96, 96, 93, 92, 95, 99, 104, 108, 112, 116, 119, 122, 124, 125, 125, 124, 122, 119, 114, 110, 106, 103, 102, 100, 100, 99, 99, 100, 100, 101, 102, 103, 104, 104, 104, 104, 104, 103, 103, 103] },
  // </clip-motion>
};
const at = (a: number[], t: number): number => { const x = Math.max(0, t / CLIP_STEP), i = Math.min(a.length - 1, Math.floor(x)), j = Math.min(a.length - 1, i + 1); return a[i] + (a[j] - a[i]) * (x - i); };
/** The lowest foot's height (cm) at clip time t; FOOT_REST when the clip isn't known. */
export const footAt = (clip: string, t: number): number => { const m = CLIP_MOTION[clip]; return m ? at(m.foot, t) : FOOT_REST; };
/** The hips' travel forward (cm) at clip time t. */
export const hipsZAt = (clip: string, t: number): number => { const m = CLIP_MOTION[clip]; return m ? at(m.hipsZ, t) : 0; };
/** The yaw (radians) a clip's hips are turned by at clip time t (`yaw` above); 0 for most. */
export const yawAt = (clip: string, t: number): number => { const m = CLIP_MOTION[clip]; return m?.yaw ? at(m.yaw, t) * Math.PI / 180 : 0; };
