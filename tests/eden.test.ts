import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshEden, stepEden, summary, serializeEden, parseEden, BAND, PACK, NEED_PER_DAY, FORAGE_R, FLOWER_SPOTS, ROCK_SPOTS, TRIP_TICKS, HUG_TICKS } from '../src/edenModel';
import { DAY_TICKS } from '../src/villageModel';
import { mulberry32 } from '../src/colors';

const names = ['marlo', 'tansy', 'pip', 'wren', 'bram', 'hazel', 'odo', 'nell', 'ivo', 'una'].map((id, i) => ({ id, name: id[0].toUpperCase() + id.slice(1), rises: i * 7 }));
/** A plain: standable everywhere but a pond; hosts scattered round the cave. */
function world(seed = 1, hosts = 44) {
  const rand = mulberry32(seed * 17 + 3), trees = Array.from({ length: hosts }, (_, i) => { const a = rand() * Math.PI * 2, r = 12 + Math.sqrt(rand()) * (FORAGE_R - 14); return { id: i + 1, x: Math.cos(a) * r, z: Math.sin(a) * r }; });
  const ctx = { canStand: (x: number, z: number) => Math.hypot(x - 60, z + 40) > 9 };
  return freshEden(seed, { x: 0, z: 0, dir: Math.PI / 2 }, trees, [{ x: 40, z: 30 }, { x: -35, z: 25 }], { x: 150, z: -90 }, names, ctx);
}
test('E1: a fresh Eden: a band asleep in the cave, a chicken on every reachable host (some free), the pack at its rest', () => {
  const e = world();
  assert.equal(e.hobbits.length, BAND); assert.ok(e.hobbits.every(h => h.inside && h.act === 'sleeping')); assert.equal(e.pack.length, PACK);
  assert.ok(e.hosts.length >= 30, `hosts in reach (${e.hosts.length})`); assert.ok(e.chickens.length >= e.hosts.length, 'a chicken on every host'); assert.ok(summary(e).free > 3, 'some already free');
  assert.ok(e.hosts.every(h => Math.hypot(h.x - e.hearth.x, h.z - e.hearth.z) <= FORAGE_R));
});
test('E1: a day: out after dawn, takes carried home to the hearth, the meal at dusk, all inside by night', () => {
  const e = world(), ctx = { canStand: () => true }; let out = 0, carrying = 0;
  for (let t = 0; t < 700; t += 10) { stepEden(e, 10, ctx); const s = summary(e); out = Math.max(out, s.out); carrying = Math.max(carrying, s.carrying); }
  assert.ok(out >= 4, `the band goes out (${out})`); assert.ok(carrying >= 1, 'something is carried home');
  stepEden(e, 60, ctx); assert.ok(e.store >= 1 || e.days[0].taken >= 1, `takes reached the hearth (${e.store}, ${e.days[0].taken})`);
  stepEden(e, 100, ctx); assert.ok(e.hobbits.some(h => h.act === 'eating') || e.eatenToday === 1, 'the meal at dusk');
  stepEden(e, DAY_TICKS - e.tick % DAY_TICKS - 1, ctx); assert.ok(e.hobbits.every(h => h.inside), 'all inside by the night\'s end');
  assert.ok(e.events.some(ev => ev.kind === 'hobbit-takes') && e.events.some(ev => ev.kind === 'band-eats'), 'the day is told as events');
});
test('E1: the balance over thirty days: the fungus neither dies out nor runs away, the band and the pack both eat, the pack keeps off the band', () => {
  const e = world(2, 48), ctx = { canStand: (x: number, z: number) => Math.hypot(x - 60, z + 40) > 9 }; let minFree = Infinity, maxChickens = 0, wolfNear = 0, wolfAte = 0, taken = 0, freeSum = 0, samples = 0;
  for (let d = 0; d < 30; d++) {
    for (let t = 0; t < DAY_TICKS; t += 12) { stepEden(e, 12, ctx); const s = summary(e); minFree = Math.min(minFree, s.free); maxChickens = Math.max(maxChickens, s.chickens); freeSum += s.free; samples++; for (const w of e.pack) for (const h of e.hobbits) if (!h.inside && Math.hypot(w.x - h.x, w.z - h.z) < 2) wolfNear++; }
    const day = e.days[e.days.length - 1]; wolfAte += day.wolfEaten; taken += day.taken;
  }
  assert.ok(freeSum / samples >= 2 && minFree >= 0, `free fungus is about (mean ${(freeSum / samples).toFixed(1)}, min ${minFree})`); assert.ok(maxChickens <= e.hosts.length * 2.5, `and it does not run away (max ${maxChickens} on ${e.hosts.length} hosts)`);
  assert.ok(taken >= 30 * NEED_PER_DAY * 0.5, `the band takes its share (${taken} in 30 days)`); assert.ok(wolfAte >= 30 * 1.5, `the pack eats (${wolfAte} in 30 days; it finds fewer when the band has been first)`);
  assert.ok(summary(e).hunger < 0.9, `the band is fed (hunger ${summary(e).hunger.toFixed(2)})`); assert.equal(wolfNear, 0, 'no wolf stands over a hobbit');
  const back = parseEden(serializeEden(e), () => world()); assert.equal(back.tick, e.tick); assert.equal(back.chickens.length, e.chickens.length); assert.equal(parseEden('junk', () => world()).tick, 0);
});

test('E1b: the band\'s antics: idle with the need met they wander to flowers, rocks and trees to sniff, hum and doze, scuffle in pairs and hug, tumble and trip, and still come home to eat', () => {
  const e = world(3); assert.equal(e.flowers.length, FLOWER_SPOTS); assert.equal(e.rocks.length, ROCK_SPOTS);
  const ctx = { canStand: () => true }, kinds = new Set<string>(), pairs: string[] = [];
  for (let day = 0; day < 6; day++) { stepEden(e, DAY_TICKS, ctx); for (const ev of e.events) { kinds.add(ev.kind); } for (const ev of e.events) if (ev.kind === 'hobbit-hugs') pairs.push(ev.who ?? ''); }
  for (const k of ['hobbit-smells', 'hobbit-sits', 'hobbit-naps', 'hobbit-scuffles', 'hobbit-hugs', 'hobbit-tumbles', 'hobbit-trips']) assert.ok(kinds.has(k), `${k} happened in six days (${[...kinds].join(' ')})`);
  assert.ok(pairs.length >= 1, 'a scuffle ended in a hug');
  // A tripped hobbit lies TRIP_TICKS and goes on with its load; a hug lasts HUG_TICKS and both stand up idle after.
  const t = world(4); stepEden(t, 200, ctx); const h = t.hobbits[0]; h.act = 'home'; h.carry = 'chicken'; h.antic = { kind: 'trip', left: TRIP_TICKS }; h.x = t.hearth.x + 20; h.z = t.hearth.z;
  const sx = h.x; stepEden(t, TRIP_TICKS - 1, ctx); assert.equal(h.antic?.kind, 'trip'); assert.equal(h.x, sx, 'flat on its face it goes nowhere'); stepEden(t, 1, ctx); assert.equal(h.antic, null); stepEden(t, 5, ctx); assert.ok(h.x !== sx && h.carry === 'chicken', 'up and on, the load kept');
  const a = t.hobbits[1], b = t.hobbits[2]; a.act = b.act = 'idle'; a.x = b.x = t.hearth.x + 3; a.z = t.hearth.z; b.z = t.hearth.z + 0.9; a.antic = { kind: 'scuffle', left: 2, partner: b.id }; b.antic = { kind: 'scuffle', left: 2, partner: a.id };
  stepEden(t, 2, ctx); assert.equal(a.antic?.kind, 'hug'); assert.equal(b.antic?.kind, 'hug'); assert.ok(t.events.some(ev => ev.kind === 'hobbit-hugs' && ev.who === a.id)); stepEden(t, HUG_TICKS + 1, ctx); assert.equal(a.antic, null); assert.equal(b.antic, null);
  // Dusk drops a nap for the meal; the thirty-day balance holds with the antics (the suite's own test above).
  const n = world(5); stepEden(n, 700, ctx); const z = n.hobbits[3]; z.act = 'idle'; z.antic = { kind: 'nap', left: 500 }; stepEden(n, 30, ctx); assert.equal(z.antic, null, 'dusk ends the nap'); assert.equal(z.act === 'eating' || z.act === 'idle', true);
  // Saved and loaded, the antics and the spots ride along; an old save without them gets empty lists.
  const back = parseEden(serializeEden(e), () => world(9)); assert.equal(back.flowers.length, FLOWER_SPOTS); const old = JSON.parse(serializeEden(e)); delete old.flowers; delete old.rocks; const o = parseEden(JSON.stringify(old), () => world(9)); assert.deepEqual([o.flowers, o.rocks], [[], []]);
});
