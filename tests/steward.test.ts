import { test } from 'node:test'; import assert from 'node:assert/strict';
import { freshVillage, advance, setDens, setWarrens, setHeroes, wolves, stepRaiders, traitsOf, traitWords, assignDuty, guards, guardPost, GUARDS_MAX, QUICK_PACE, WOLF_TICK, WOLF_HP, GUARD_DMG, STAFF_DMG, DEATH_MEALS, DAY_TICKS, hobbitById, thought, rumors, setMoot, setLair, parseVillage, serializeVillage, type Village } from '../src/villageModel';
import { moot, places, dens, ruins, warrens, villageSites, KARST_AT, MOOT_NEAR, MOOT_FAR, MOOT_CLEAR } from '../src/overworldModel';
import { freshSteward, routeBetween, wake, send, stepSteward, bite, lyingUp, leftToWalk, serializeSteward, parseSteward, PACE, LIE_UP_TICKS, MARGIN } from '../src/stewardModel';

const night = (v: Village): void => { advance(v, DAY_TICKS - (v.tick % DAY_TICKS) + 900); };
test('S2: every villager is bold or timid and quick or slow, the same each time; the steward gives a grown one the watch, GUARDS_MAX at most', () => {
  const v = freshVillage(1), grown = v.hobbits.filter(s => s.stage === 'grown');
  const ts = grown.map(s => traitsOf(s.id)); assert.ok(ts.some(t => t.bold) && ts.some(t => !t.bold), 'bold and timid among them'); assert.deepEqual(grown.map(s => traitsOf(s.id)), ts, 'the same each time');
  for (const s of grown) assert.equal(traitsOf(s.id).quick, hobbitById(s.id).pace >= QUICK_PACE, 'quick by their pace'); assert.match(traitWords(ts[0]), /^(bold|timid) · (quick|slow)$/);
  for (let i = 0; i < GUARDS_MAX; i++) assert.ok(assignDuty(v, grown[i].id, 'guard')); assert.ok(!assignDuty(v, grown[GUARDS_MAX].id, 'guard'), 'no more than GUARDS_MAX'); assert.equal(guards(v).length, GUARDS_MAX);
  assert.ok(assignDuty(v, grown[0].id, null)); assert.equal(guards(v).length, GUARDS_MAX - 1); assert.ok(v.events.some(e => e.text.endsWith('will keep watch by night')));
});
test('S2: a guard keeps the watch by night at a post facing the threat, after supper, while the others sleep; by day they are at their place as ever; saved', () => {
  setDens([{ id: 'den-1,1', x: 300, z: 300, pack: 3 }]); setWarrens([]);
  try {
    const v = freshVillage(1), g = v.hobbits.find(s => s.stage === 'grown')!; assignDuty(v, g.id, 'guard'); night(v);
    const post = guardPost(v, g); assert.ok(Math.hypot(post.x, post.z) > 14 && Math.atan2(post.z, post.x) > 0.5 && Math.atan2(post.z, post.x) < 1.1, 'out toward the den to the south-east');
    assert.ok(!g.inside && Math.hypot(g.x - post.x, g.z - post.z) < 1.2, `at the watch (${g.x.toFixed(1)}, ${g.z.toFixed(1)})`); assert.equal(g.activity, 'guarding'); assert.equal(thought(g, v.tick), 'keeping watch');
    assert.ok(v.hobbits.filter(s => s !== g && s.stage !== 'infant').every(s => s.inside), 'the others asleep'); assert.equal(g.missed, 0, 'supper eaten');
    advance(v, DAY_TICKS - (v.tick % DAY_TICKS) + 400); assert.notEqual(g.activity, 'guarding', 'by day at their place');
    const back = parseVillage(serializeVillage(v));
    assert.equal(back.hobbits.find((s: { id: string }) => s.id === g.id).duty, 'guard', 'saved');
  } finally { setDens([]); }
});
test('S2: a guard meets a wolf at the watch and strikes it, the kill not hers; bitten on the watch a guard can die; a timid guard runs, a bold one holds', () => {
  setDens([{ id: 'den-1,1', x: 300, z: 300, pack: 2 }]); setWarrens([]);
  try {
    const v = freshVillage(1), grown = v.hobbits.filter(s => s.stage === 'grown'), bold = grown.find(s => traitsOf(s.id).bold)!, timid = grown.find(s => !traitsOf(s.id).bold)!;
    assignDuty(v, bold.id, 'guard'); assignDuty(v, timid.id, 'guard'); v.land.goats = 0;
    advance(v, WOLF_TICK - (v.tick % DAY_TICKS) + 60); assert.equal(wolves(v).length, 2);
    const w = wolves(v)[0], xp0 = v.hero.xp, slain0 = v.slain; w.x = bold.x + 3; w.z = bold.z; w.prey = bold.id;
    for (let i = 0; i < 40 && w.hp === WOLF_HP; i++) stepRaiders(v, 0.25, null); assert.ok(w.hp <= WOLF_HP - GUARD_DMG, 'struck by the guard');
    assert.equal(v.hero.xp, xp0, 'not her kill'); assert.equal(v.slain, slain0);
    // Timid: wolves near, and they run home; bold holds.
    const w2 = wolves(v)[1]; w2.x = timid.x + 2; w2.z = timid.z; advance(v, 1); assert.equal(timid.errand, 'flee', 'the timid guard runs'); assert.notEqual(bold.errand, 'flee', 'the bold one holds');
    // Bitten to death on the watch.
    bold.missed = DEATH_MEALS - 2; w.hp = WOLF_HP; w.state = 'hunting'; w.prey = bold.id; w.ate = 0; w.biteClock = 0; w.x = bold.x + 0.5; w.z = bold.z;
    for (let i = 0; i < 20 && bold.missed < DEATH_MEALS; i++) stepRaiders(v, 0.2, null); assert.equal(bold.missed, DEATH_MEALS, 'the bite not spared');
    advance(v, 1); assert.ok(!v.hobbits.includes(bold) && v.dead.some(d => d.id === bold.id), 'dead'); assert.ok(v.events.some(e => e.text === `${hobbitById(bold.id).name} is killed by a wolf on the watch`));
  } finally { setDens([]); }
});
test('S2: a hero afoot nearer than anyone is bitten instead, strikes back, and is told of', () => {
  setDens([{ id: 'den-1,1', x: 300, z: 300, pack: 1 }]); setWarrens([]); let bitten = '';
  try {
    const v = freshVillage(1); v.land.goats = 0; advance(v, WOLF_TICK - (v.tick % DAY_TICKS) + 1); for (const s of v.hobbits) s.inside = true;
    const w = wolves(v)[0], at = { id: 'steward', x: w.x + 3, z: w.z }; setHeroes(() => [at], id => { bitten = id; });
    for (let i = 0; i < 20 && !bitten; i++) stepRaiders(v, 0.3, null); assert.equal(bitten, 'steward'); assert.equal(w.hp, WOLF_HP - STAFF_DMG, 'he strikes back'); assert.ok(w.ate >= 1);
  } finally { setDens([]); setHeroes(() => [], () => {}); }
});
test('S2: the old moot by the seed, clear of every place, told of by the first village\'s elder', () => {
  const m = moot(1); assert.deepEqual(moot(1), m); const d = Math.hypot(m.x, m.z); assert.ok(d >= MOOT_NEAR && d <= MOOT_FAR, `within the walk (${d.toFixed(0)})`);
  for (const p of [...dens(1), ...ruins(1), ...warrens(1), ...villageSites(1)]) assert.ok(Math.hypot(p.x - m.x, p.z - m.z) >= MOOT_CLEAR, `clear of ${p.id}`); assert.ok(Math.hypot(m.x - KARST_AT.x, m.z - KARST_AT.z) > 100 + MOOT_CLEAR);
  assert.ok(places(1).some(p => p.id === 'moot' && p.kind === 'moot'));
  setMoot(m); try { const v = freshVillage(1); assert.ok(rumors(v).some(r => r.about === 'moot' && r.who === 'elder' && r.text.includes('asleep in its chair'))); setMoot(m, false); assert.ok(!rumors(v).some(r => r.about === 'moot'), 'not once he is woken'); } finally { setMoot(null); }
});
test('S2: the steward sleeps until woken, walks where he is sent round what he must avoid, lies up a day when bitten, never killed; saved', () => {
  const s = freshSteward({ x: 0, z: 0 }); assert.ok(!send(s, 'village', { x: 100, z: 0 }, []), 'asleep, he goes nowhere'); assert.ok(wake(s)); assert.ok(!wake(s));
  const forest = { x: 50, z: 0, r: 20 }, r = routeBetween({ x: 0, z: 0 }, { x: 100, z: 0 }, [forest]); assert.ok(r.length >= 2, 'bends round');
  let p = { x: 0, z: 0 }; for (const w of r) { for (let t = 0; t <= 1; t += 0.05) { const x = p.x + (w.x - p.x) * t, z = p.z + (w.z - p.z) * t; assert.ok(Math.hypot(x - forest.x, z - forest.z) >= forest.r - 0.5, 'never through it'); } p = w; }
  assert.ok(send(s, 'village', { x: 100, z: 0 }, [forest])); assert.equal(s.at, null); const far = leftToWalk(s); assert.ok(far > 100 && far < 100 + 2 * (forest.r + MARGIN));
  bite(s, 10); assert.ok(lyingUp(s, 10 + LIE_UP_TICKS - 1)); const x0 = s.x; assert.equal(stepSteward(s, 10, 20), null); assert.equal(s.x, x0, 'lying up');
  const back = parseSteward(serializeSteward(s), { x: 0, z: 0 }); assert.deepEqual(back, JSON.parse(serializeSteward(s)), 'saved mid-walk');
  let arrived: string | null = null; for (let i = 0; i < 400 && !arrived; i++) arrived = stepSteward(s, 1, 10 + LIE_UP_TICKS); assert.equal(arrived, 'village'); assert.equal(s.at, 'village'); assert.ok(Math.hypot(s.x - 100, s.z) < 0.01);
  assert.ok(far / PACE < 400, 'at his pace'); assert.deepEqual(parseSteward('junk', { x: 5, z: 6 }), freshSteward({ x: 5, z: 6 }));
});
void setLair;
