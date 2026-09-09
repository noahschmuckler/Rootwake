/** Hulda's first remembered forms. Numbers are playtest tuning, not final balance. */
export const FORMS = [
  { id: 'fruit', name: 'The hungry bramble', verb: 'Coax fruit', need: 30, at: [0, -2.5], memory: 'I do not need to take its life. I can ask it to bear fruit.', gift: 'Ripen', description: 'The berries are hard and green. Your hands remember what your mind has lost.' },
  { id: 'bower', name: 'The leaning willow', verb: 'Weave a bower', need: 54, at: [3.5, -5], memory: 'A branch can bend without breaking. A home can remain alive.', gift: 'Living shelter', description: 'Guide living stems into an arch, leaves into a roof, moss into a bed.' },
  { id: 'spring', name: 'The skywater pool', verb: 'Call the roots', need: 45, at: [7, -3], memory: 'The water falls from somewhere above the world. The roots know where it goes.', gift: 'Rootsong', description: 'Thread thirsty roots toward the pool. Water will nourish the entire garden.' },
  { id: 'herb', name: 'The silverleaf', verb: 'Awaken medicine', need: 54, at: [10, -6], memory: 'I knew these leaves before they had names. I carried healing into the dark.', gift: 'Mend', description: 'Wake a dormant medicinal form. Living remedies will sustain those beside you.' },
  { id: 'grove', name: 'The sleeping orchard', verb: 'Recall abundance', need: 66, at: [14, -3], memory: 'Not a meal. A harvest. Not one life. A people.', gift: 'Abundance', description: 'Call an orchard from primordial seed. Seven travellers will need more than berries.' },
  { id: 'blight', name: 'The wounded elder', verb: 'Cleanse the blight', need: 90, at: [18, -5], memory: 'Six others. A road beneath the mountain. I was the one who kept us alive.', gift: 'Keeper of the Seven', description: 'A blight coils around the elder. Heal its heart and bind the spreading corruption.' },
] as const;
export type FormId = typeof FORMS[number]['id'];
export type Channel = 'grow' | 'reserve';
export type Power = 'surge' | 'mend' | 'ward';
export interface HuldaState { version: 1; progress: number[]; vigor: number; sap: number; fruit: number; remedies: number; ward: number; pulses: number; seeds: number; }
export function freshState(): HuldaState { return { version: 1, progress: FORMS.map(() => 0), vigor: 70, sap: 0, fruit: 0, remedies: 0, ward: 0, pulses: 0, seeds: 0 }; }
export function completed(s: HuldaState, i: number): boolean { return s.progress[i] >= FORMS[i].need; }
export function unlocked(s: HuldaState, i: number): boolean { return i === 0 || completed(s, i - 1); }
export function remembered(s: HuldaState): number { return s.progress.filter((_, i) => completed(s, i)).length; }
export function grow(s: HuldaState, i: number, amount: number): boolean {
  if (!unlocked(s, i) || completed(s, i)) return false;
  s.progress[i] = Math.min(FORMS[i].need, s.progress[i] + amount);
  if (!completed(s, i)) return false;
  s.vigor = Math.min(100, s.vigor + 12);
  if (i === 0) s.fruit += 3;
  if (i === 3) s.remedies += 3;
  if (i === 4) { s.fruit += 7; s.seeds += 7; }
  return true;
}
/** Each cleared run channels growth or banks charge; long matches reward both. */
export function channelRun(s: HuldaState, i: number, count: number, channel: Channel): { finished: boolean; damage: number } {
  if (!unlocked(s, i)) return { finished: false, damage: 0 };
  const wasDone = completed(s, i);
  const bonus = Math.max(0, count - 3) * 2;
  s.sap = Math.min(60, s.sap + (channel === 'reserve' ? count * 2 : count) + bonus);
  s.vigor = Math.max(20, s.vigor - 1.4); // Immortal: never trap a player in an exhaustion loop.
  let finished = false;
  if (!wasDone && channel === 'grow') finished = grow(s, i, Math.max(2,Math.round((count + bonus) * (s.vigor < 40 ? .75 : 1))));
  // Completed food/medicine plants remain useful, renewable sources.
  if (wasDone && channel === 'grow') {
    s.progress[i] += count;
    if (s.progress[i] >= FORMS[i].need + 12) {
      s.progress[i] = FORMS[i].need;
      if (i === 0 || i === 4) s.fruit += i === 4 ? 3 : 1;
      if (i === 3) s.remedies++;
    }
  }
  let damage = 0;
  if (i === 5 && !completed(s, 5)) {
    s.pulses++;
    if (s.pulses % 3 === 0) {
      if (s.ward > 0) s.ward--;
      else { damage = 10; s.vigor = Math.max(20, s.vigor - damage); s.progress[5] = Math.max(0, s.progress[5] - 3); }
    }
  }
  return { finished, damage };
}
export function cast(s: HuldaState, i: number, power: Power): boolean {
  if (!unlocked(s, i)) return false;
  const cost = power === 'surge' ? 12 : power === 'mend' ? 15 : 9;
  if (s.sap < cost || (power === 'mend' && !completed(s, 3)) || (power === 'ward' && !completed(s, 2))) return false;
  if (power === 'surge' && completed(s, i)) return false;
  s.sap -= cost;
  if (power === 'surge') grow(s, i, 18);
  if (power === 'mend') { s.vigor = Math.min(100, s.vigor + 30); if (i === 5) grow(s, i, 10); }
  if (power === 'ward') s.ward = Math.min(3, s.ward + 2);
  return true;
}
export function restore(raw: unknown): HuldaState {
  const fresh = freshState();
  if (!raw || typeof raw !== 'object') return fresh;
  const s = raw as HuldaState;
  if (s.version !== 1 || !Array.isArray(s.progress) || s.progress.length !== FORMS.length) return fresh;
  for (const key of ['vigor', 'sap', 'fruit', 'remedies', 'ward', 'pulses', 'seeds'] as const) {
    if (typeof s[key] !== 'number' || !Number.isFinite(s[key]) || s[key] < 0) return fresh;
  }
  if (s.progress.some(p => !Number.isFinite(p) || p < 0)) return fresh;
  for (let i = 1; i < FORMS.length; i++) if (s.progress[i] > 0 && s.progress[i - 1] < FORMS[i - 1].need) return fresh;
  return { ...s, progress: [...s.progress], vigor: Math.max(20, Math.min(100, s.vigor)), sap: Math.min(60, s.sap), ward: Math.min(3, s.ward) };
}
