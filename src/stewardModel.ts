// S2 (SETTLEMENTS.md, COMPANIONS.md Parts 4 and 5): the steward, the first of the heroes. He sleeps in the fallen
// chair of the old moot until Hulda wakes him with a channelling of clarity there; then he walks, on foot, where she
// sends him (only she travels by grass, root and the karst's node), and the village he stands in has his board: he
// gives its people their duties. He can be bitten on the road and is never killed: bitten, he lies up LIE_UP_TICKS
// where he is, then walks on. Pure: no Three.js. Saved under its own key.
export interface Vec2 { x: number; z: number }
export interface Circle { x: number; z: number; r: number }
export interface Steward { woken: boolean; x: number; z: number; route: Vec2[]; to: string | null; at: string | null; hurtUntil: number; bitten: number }
/** He walks PACE m a real second; within ARRIVE m of a place he is at it; bitten, he lies up LIE_UP_TICKS (a village day); a route bends round a circle to avoid (the dark forest, the karst's pillar) by MARGIN. WAKE_GEMS: the clarity channelled into the chair to wake him. Tuning. */
export const PACE = 1.6, ARRIVE = 6, LIE_UP_TICKS = 1440, MARGIN = 25, WAKE_GEMS = 20;
export const freshSteward = (at: Vec2): Steward => ({ woken: false, x: at.x, z: at.z, route: [], to: null, at: 'moot', hurtUntil: 0, bitten: 0 });
/** A way from `a` to `b` on foot, bending round every circle the straight line would cross. */
export function routeBetween(a: Vec2, b: Vec2, avoid: Circle[], depth = 0): Vec2[] {
  if (depth > 4) return [b];
  const dx = b.x - a.x, dz = b.z - a.z, len2 = dx * dx + dz * dz || 1;
  for (const c of avoid) {
    const t = Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.z - a.z) * dz) / len2)), px = a.x + dx * t, pz = a.z + dz * t, d = Math.hypot(px - c.x, pz - c.z);
    if (d >= c.r || t <= 0 || t >= 1) continue;
    // Round the side the line already leans to, MARGIN clear of the circle.
    let nx = px - c.x, nz = pz - c.z; const n = Math.hypot(nx, nz); if (n < 1e-6) { nx = -dz; nz = dx; } const k = Math.hypot(nx, nz); nx /= k; nz /= k;
    const w = { x: c.x + nx * (c.r + MARGIN), z: c.z + nz * (c.r + MARGIN) };
    return [...routeBetween(a, w, avoid, depth + 1), ...routeBetween(w, b, avoid, depth + 1)];
  }
  return [b];
}
/** Wake him (the channelling is the entry's). */
export function wake(s: Steward): boolean { if (s.woken) return false; s.woken = true; return true; }
/** Send him to a place by id: the way there is his route. Refused asleep, or already there. */
export function send(s: Steward, id: string, to: Vec2, avoid: Circle[]): boolean {
  if (!s.woken || (s.at === id && !s.to)) return false; s.to = id; s.at = null; s.route = routeBetween({ x: s.x, z: s.z }, to, avoid); return true;
}
/** Whether he lies up now (the village clock's tick). */
export const lyingUp = (s: Steward, tick: number): boolean => tick < s.hurtUntil;
/** Bitten: he lies up where he is for LIE_UP_TICKS; never killed. */
export function bite(s: Steward, tick: number): void { s.bitten += 1; s.hurtUntil = Math.max(s.hurtUntil, tick + LIE_UP_TICKS); }
/** Walk `dt` real seconds along the route. Returns the place's id when he arrives. */
export function stepSteward(s: Steward, dt: number, tick: number): string | null {
  if (!s.woken || !s.to || lyingUp(s, tick)) return null;
  let m = PACE * dt;
  while (m > 0 && s.route.length) { const w = s.route[0], d = Math.hypot(w.x - s.x, w.z - s.z); if (d <= m) { s.x = w.x; s.z = w.z; m -= d; s.route.shift(); } else { s.x += (w.x - s.x) / d * m; s.z += (w.z - s.z) / d * m; m = 0; } }
  if (!s.route.length) { const id = s.to; s.at = id; s.to = null; return id; }
  return null;
}
/** How far he has still to walk. */
export const leftToWalk = (s: Steward): number => { let d = 0, p: Vec2 = s; for (const w of s.route) { d += Math.hypot(w.x - p.x, w.z - p.z); p = w; } return d; };
export const serializeSteward = (s: Steward): string => JSON.stringify({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, route: s.route.map(w => ({ x: Math.round(w.x * 100) / 100, z: Math.round(w.z * 100) / 100 })) });
export function parseSteward(raw: string | null, at: Vec2): Steward {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshSteward(at);
    const num = (x: unknown, d: number): number => (typeof x === 'number' && Number.isFinite(x) ? x : d);
    const route = Array.isArray(p.route) ? p.route.filter((w: unknown) => w && Number.isFinite((w as Vec2).x) && Number.isFinite((w as Vec2).z)).slice(0, 16).map((w: Vec2) => ({ x: w.x, z: w.z })) : [];
    const to = typeof p.to === 'string' && p.to.length <= 40 && route.length ? p.to : null;
    return { woken: p.woken === true, x: num(p.x, at.x), z: num(p.z, at.z), route: to ? route : [], to, at: to ? null : typeof p.at === 'string' && p.at.length <= 40 ? p.at : 'moot', hurtUntil: Math.max(0, num(p.hurtUntil, 0)), bitten: Math.max(0, Math.floor(num(p.bitten, 0))) };
  } catch { return freshSteward(at); }
}
