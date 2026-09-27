// G5 (EXPANSION.md, "Cultivation and the gated tiers — Hulda's ascension"): the board played at the karst's
// pool as a cultivation session gathers growth toward the next tier of her power; at the threshold, for
// TIER_CLARITY of her clarity, the tier rises. The cap is the world's: the land allows a tier only while the
// villages near the karst thrive, the groves are sanctified and (from the top tier) a companion stands with
// her, and her actual power is the lesser of the cultivated tier and the land's. So a tier refused sends her
// outward with a reason, not a wall. Pure: no Three.js. Saved under its own key.
export interface Cultivation { grown: number; tier: number }
export interface WorldState { thriving: number; groves: number; companions: number }
/** TIER_CAP tiers; TIER_POINTS[n] gems of growth to reach tier n; TIER_CLARITY spent to raise. Each tier of power reaches the deep roots TIER_REACH m farther and widens her sight and the villagers' hints by TIER_VIEW. The land's needs for tier n: NEED[n] villages thriving near the karst, groves sanctified, companions with her (the companions are a chapter not yet built: their count is 0 until then, so the top tier waits on it). Tuning. */
export const TIER_CAP = 5, TIER_POINTS = [0, 0, 40, 60, 80, 100], TIER_CLARITY = 20, TIER_REACH = 200, TIER_VIEW = 0.25;
export const NEED: WorldState[] = [{ thriving: 0, groves: 0, companions: 0 }, { thriving: 0, groves: 0, companions: 0 }, { thriving: 1, groves: 0, companions: 0 }, { thriving: 2, groves: 1, companions: 0 }, { thriving: 3, groves: 1, companions: 0 }, { thriving: 3, groves: 2, companions: 1 }];
export const freshCultivation = (): Cultivation => ({ grown: 0, tier: 1 });
const meets = (w: WorldState, n: number): boolean => w.thriving >= NEED[n].thriving && w.groves >= NEED[n].groves && w.companions >= NEED[n].companions;
/** The tier the land allows: the highest whose needs the world meets. */
export function worldTier(w: WorldState): number { let t = 1; for (let n = 2; n <= TIER_CAP; n++) if (meets(w, n)) t = n; else break; return t; }
/** Her power now: the lesser of what she has cultivated and what the land allows. */
export const power = (c: Cultivation, w: WorldState): number => Math.max(1, Math.min(c.tier, worldTier(w)));
/** What the land still wants for tier n, in words (empty when it allows it). */
export function lacking(w: WorldState, n: number): string {
  if (n > TIER_CAP) return 'there is no higher tier'; const need = NEED[n], want: string[] = [];
  if (w.thriving < need.thriving) { const k = need.thriving - w.thriving; want.push(`${k === 1 ? 'one more village' : `${k} more villages`} must thrive`); }
  if (w.groves < need.groves) { const k = need.groves - w.groves; want.push(`${k === 1 ? 'a grove' : `${k} groves`} must be sanctified`); }
  if (w.companions < need.companions) { const k = need.companions - w.companions; want.push(`${k === 1 ? 'a companion' : `${k} companions`} must stand with her`); }
  return want.join(', ');
}
/** Growth toward the next tier, capped at its threshold. Returns what was gained. */
export function grow(c: Cultivation, gems: number): number { if (c.tier >= TIER_CAP) return 0; const before = c.grown; c.grown = Math.min(TIER_POINTS[c.tier + 1], c.grown + Math.max(0, gems)); return c.grown - before; }
export const grownEnough = (c: Cultivation): boolean => c.tier < TIER_CAP && c.grown >= TIER_POINTS[c.tier + 1];
/** The tier may rise: grown enough, the land allowing the next tier, and the clarity to pay. */
export const canRaise = (c: Cultivation, w: WorldState, clarity: number): boolean => grownEnough(c) && worldTier(w) > c.tier && clarity >= TIER_CLARITY;
/** Raise the tier, spending TIER_CLARITY from `d`; the growth starts over. */
export function raise(c: Cultivation, w: WorldState, d: { clarity: number }): boolean { if (!canRaise(c, w, d.clarity)) return false; d.clarity -= TIER_CLARITY; c.tier += 1; c.grown = 0; return true; }
/** How far the deep roots reach beyond the node's own, and how much wider she sees, at a power. */
export const reachBonus = (p: number): number => TIER_REACH * Math.max(0, p - 1);
export const viewScale = (p: number): number => 1 + TIER_VIEW * Math.max(0, p - 1);
export const serializeCultivation = (c: Cultivation): string => JSON.stringify({ grown: Math.round(c.grown * 100) / 100, tier: c.tier });
export function parseCultivation(raw: string | null): Cultivation {
  try { const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshCultivation(); const tier = Math.min(TIER_CAP, Math.max(1, Math.floor(Number.isFinite(p.tier) ? p.tier : 1))); const grown = Number.isFinite(p.grown) ? Math.min(TIER_POINTS[Math.min(TIER_CAP, tier + 1)] ?? 0, Math.max(0, p.grown)) : 0; return { grown: tier >= TIER_CAP ? 0 : grown, tier }; } catch { return freshCultivation(); }
}
