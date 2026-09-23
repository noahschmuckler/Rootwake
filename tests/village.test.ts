import { test } from 'node:test'; import assert from 'node:assert/strict';
import { HOBBITS, HOUSES, SITES, DAY_TICKS, PHASES, TICKS_PER_SECOND, phaseAt, clockOf, daylightAt, freshVillage, advance, wants, everyone, inHouse, route, parseVillage, serializeVillage, hobbitById, houseOf, HOUSE_RADIUS, HOUSE_RING } from '../src/villageModel';
test('eight hobbits in six houses on a ring round the green, each keeping to a place at a gap between the houses', () => {
  assert.equal(HOBBITS.length, 8); assert.equal(HOUSES.length, 6); assert.equal(new Set(HOBBITS.map(h => h.name)).size, 8, 'names are distinct');
  assert.ok(HOBBITS.every(h => h.home >= 0 && h.home < 6)); assert.equal(new Set(HOBBITS.map(h => h.home)).size, 6, 'every house is lived in');
  for (const h of HOUSES) { assert.ok(Math.abs(Math.hypot(h.x, h.z) - HOUSE_RING) < 1e-9); assert.ok(Math.hypot(h.door.x, h.door.z) < Math.hypot(h.x, h.z), 'doors face the green'); }
  for (const s of Object.values(SITES)) if (s.id !== 'fire') { assert.ok(Math.hypot(s.x, s.z) > HOUSE_RING + HOUSE_RADIUS + 3, `${s.id} lies beyond the houses`); for (const h of HOUSES) assert.ok(Math.hypot(s.x - h.x, s.z - h.z) > HOUSE_RADIUS + s.radius, `${s.id} is clear of the houses`); }
  assert.ok(HOBBITS.some(h => h.keeps === 'fire'), 'someone keeps the fire (the elder to be)');
});
test('the day: 1440 ticks in twenty real minutes, dawn at six, phases in order, the sun up by day and down by night', () => {
  assert.equal(DAY_TICKS, 1440); assert.ok(Math.abs(TICKS_PER_SECOND * 20 * 60 - DAY_TICKS) < 1e-9);
  assert.deepEqual(clockOf(0), { day: 1, hour: 6, minute: 0 }); assert.deepEqual(clockOf(DAY_TICKS + 90), { day: 2, hour: 7, minute: 30 });
  assert.equal(phaseAt(0), 'dawn'); assert.equal(phaseAt(360), 'noon'); assert.equal(phaseAt(900), 'night'); assert.equal(phaseAt(DAY_TICKS - 1), 'night'); assert.equal(phaseAt(DAY_TICKS), 'dawn');
  for (let i = 1; i < PHASES.length; i++) assert.ok(PHASES[i][1] > PHASES[i - 1][1]);
  assert.ok(daylightAt(360) > 0.9); assert.equal(daylightAt(900), 0); assert.ok(daylightAt(0) > 0 && daylightAt(0) < 0.2, 'a little light at six'); assert.ok(daylightAt(780) < 0.2 && daylightAt(780) > 0, 'dusk at seven');
});
test('the rhythm: out at dawn to their places, together on the green at noon, home by night, and never through a house', () => {
  const v = freshVillage(1); assert.equal(everyone(v, 'inside'), 8, 'they wake indoors');
  advance(v, 200); assert.equal(everyone(v, 'inside'), 0, 'all out by morning'); assert.ok(v.hobbits.every(s => ['working', 'walking', 'talking', 'praying', 'carrying', 'eating'].includes(s.activity)), 'all at the day');
  for (const s of v.hobbits) { const h = hobbitById(s.id), site = SITES[h.keeps]; assert.ok(s.errand !== null || s.path.length > 0 || s.activity === 'praying' || Math.hypot(s.x - site.x, s.z - site.z) <= site.radius + 0.3, `${h.name} is ${h.keeps === 'fire' ? 'at the fire' : site.verb} (or on an errand to a store and back, or at the stone)`); }
  advance(v, 420 - 200); assert.ok(everyone(v, 'green') >= 7, `${everyone(v, 'green')} on the green at one o'clock`); assert.ok(v.hobbits.filter(s => s.activity === 'talking' || s.activity === 'eating').length >= 4, 'most talking or eating at the fire');
  advance(v, 600 - 420); assert.equal(everyone(v, 'green'), 1, 'only the fire-keeper stays by the fire in the afternoon');
  advance(v, 900 - 600); assert.equal(everyone(v, 'inside'), 8, 'all home by night'); assert.ok(v.hobbits.every(s => s.activity === 'sleeping'));
  const w = freshVillage(1); let crossed = 0, moved = 0;
  for (let t = 0; t < DAY_TICKS * 2; t++) { const before = w.hobbits.map(s => [s.x, s.z]); advance(w, 1); for (let i = 0; i < 8; i++) { const s = w.hobbits[i]; if (!s.inside && inHouse(s)) crossed++; if (Math.hypot(s.x - before[i][0], s.z - before[i][1]) > 1.5) moved++; } }
  assert.equal(crossed, 0, 'nobody walks through a house'); assert.equal(moved, 0, 'nobody teleports');
  assert.equal(wants(HOBBITS[0], 0), 'home'); assert.equal(wants(HOBBITS[0], 60), 'place'); assert.equal(wants(HOBBITS[0], 360), 'green'); assert.equal(wants(HOBBITS[0], 1000), 'home');
  assert.ok(HOBBITS.map(h => wants(h, 12)).includes('home') && HOBBITS.map(h => wants(h, 12)).includes('place'), 'they rise at different times');
});
test('routes go by the green, not through the ring of houses', () => {
  const far = SITES.thicket, door = houseOf(HOBBITS[4]).door, path = route(far, door); assert.ok(path.length >= 2, 'in by the green first');
  const pts = [far, ...path]; for (let i = 1; i < pts.length; i++) for (let k = 0; k <= 40; k++) { const t = k / 40, p = { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, z: pts[i - 1].z + (pts[i].z - pts[i - 1].z) * t }; assert.equal(inHouse(p), null, `leg ${i} misses the houses`); }
  assert.equal(route(SITES.fire, { x: 1, z: 1 }).length, 1, 'across the green, straight');
});
test('the village is deterministic from its seed, pauses when not advanced, and survives a bad save', () => {
  const a = freshVillage(5), b = freshVillage(5); advance(a, 777); advance(b, 777); assert.equal(serializeVillage(a), serializeVillage(b));
  const c = freshVillage(6); advance(c, 777); assert.notEqual(serializeVillage(a), serializeVillage(c), 'a different seed, a different day');
  const before = serializeVillage(a); advance(a, 0); assert.equal(serializeVillage(a), before, 'no ticks, no change');
  const back = parseVillage(serializeVillage(a)); assert.equal(back.tick, a.tick); assert.equal(back.hobbits[3].activity, a.hobbits[3].activity); assert.ok(Math.abs(back.hobbits[3].x - a.hobbits[3].x) < 0.01);
  advance(back, 100); advance(a, 100); assert.equal(everyone(back, 'inside'), everyone(a, 'inside'));
  assert.deepEqual(parseVillage('junk'), freshVillage()); assert.deepEqual(parseVillage('{"hobbits":[]}'), freshVillage()); assert.equal(parseVillage('{"tick":-5,"hobbits":' + JSON.stringify(freshVillage().hobbits) + '}').tick, 0);
});

import { TREES, TREE_ROOTS, rootsAt, nearestRoot, alignedRoot, nextRoot, rootPoint, rootTangent, endTree, nearestTree, hopTargets, grassCan, inWater, thought, freshVillage as fresh, advance as run, GRASS_SPEED, ROOT_SPEED, STREAM_Z, MEADOW_RADIUS, SITES as S2, hobbitById as byId } from '../src/villageModel';
import { NORMAL_MOBILITY } from '../src/mobility';
test('her ways: grass everywhere she can walk, faster than running; tree roots joining the copse and the wood, faster still and held to their path', () => {
  assert.ok(GRASS_SPEED > NORMAL_MOBILITY.runSpeed, 'grass beats running'); assert.ok(ROOT_SPEED > GRASS_SPEED, 'tree roots beat grass');
  assert.ok(TREES.length > 100); assert.ok(TREE_ROOTS.length > 100); for (const r of TREE_ROOTS) { assert.ok(r.length > 2 && r.length < 16); for (let i = 1; i < 8; i++) assert.ok(r.curve.getPointAt(i / 8).y < -0.2, 'under the soil'); }
  const joined = TREES.filter(t => rootsAt(t.id).length > 0).length; assert.ok(joined > TREES.length * 0.9, `${joined} of ${TREES.length} trees have roots`);
  const copse = TREES.slice(0, 6); assert.ok(copse.every(t => rootsAt(t.id).length >= 1), 'the copse is joined'); assert.ok(rootsAt(copse[0].id).every(r => r.length < 9), 'and its roots are short');
  const r = TREE_ROOTS[0], from = TREES[r.a], to = TREES[r.b], want = { x: to.x - from.x, z: to.z - from.z }; const l = Math.hypot(want.x, want.z); want.x /= l; want.z /= l;
  const next = nextRoot(r.a, want); assert.ok(next && next.root.id === r.id && next.forward, 'the aligned root is taken'); assert.equal(endTree(r, true), r.b); assert.ok(Math.abs(rootTangent(r, 1).length() - 1) < 1e-6);
  const n = nearestRoot({ x: (from.x + to.x) / 2, z: (from.z + to.z) / 2 }); assert.ok(n.distance < 1.2); assert.ok(rootPoint(n.root, n.s).y < 0);
  assert.ok(grassCan(5, -14)); assert.equal(grassCan(0, STREAM_Z(0)), false, 'not under the water'); assert.ok(inWater(3, STREAM_Z(3))); assert.equal(grassCan(9 * Math.cos(0.3), 9 * Math.sin(0.3)), false, 'not under a house'); assert.ok(grassCan(MEADOW_RADIUS + 41, 0), 'the land goes on past the wood (the chunks)'); assert.equal(inWater(200, STREAM_Z(200)), false, 'the stream ends past the village');
  for (const t of TREES) assert.ok(!inWater(t.x, t.z), 'no tree in the stream');
  assert.ok(hopTargets(copse[0]).length >= 1, 'the copse has crowns to leap to'); assert.equal(nearestTree(copse[2].x + 0.5, copse[2].z).tree.id, copse[2].id);
});
test('thoughts are always there: what they are doing, where they are going, and the chatter while it lasts', () => {
  const v = fresh(1); run(v, 30); const pip = v.hobbits.find(s => s.id === 'pip')!; assert.ok(['walking to the stream', 'fetching water'].includes(thought(pip, v.tick)), thought(pip, v.tick));
  run(v, 170); for (const s of v.hobbits) { const h = byId(s.id), t = thought(s, v.tick); assert.ok(t === (h.keeps === 'fire' ? 'keeping the fire' : S2[h.keeps].verb) || t === 'praying' || t === 'to the stone' || t.startsWith('carrying') || t.startsWith('walking to'), `${h.name} at work or at the stone (${t})`); }
  run(v, 340 - 200); const going = v.hobbits.filter(s => ['walking to the fire', 'talking by the fire', 'keeping the fire'].includes(thought(s, v.tick)) || thought(s, v.tick).startsWith('carrying') || thought(s, v.tick).startsWith('eating')); assert.ok(going.length >= 7, `${going.length} bound for the fire`);
  run(v, 400 - 340); const talking = v.hobbits.filter(s => thought(s, v.tick) === 'talking by the fire').length; assert.ok(talking >= 5);
  run(v, 760 - 400); assert.ok(v.hobbits.some(s => ['going home', 'fetching supper', 'home with supper'].includes(thought(s, v.tick))), 'at dusk someone is going home, by way of supper');
  run(v, 900 - 760); assert.ok(v.hobbits.every(s => thought(s, v.tick) === ''), 'no thoughts indoors');
  const w = fresh(1); run(w, 200); let turned = 0, stepped = 0; const wren = () => w.hobbits.find(s => s.id === 'wren')!; let h0 = wren().heading, p0 = { x: wren().x, z: wren().z };
  for (let i = 0; i < 60; i++) { run(w, 1); const s = wren(); if (Math.abs(Math.atan2(Math.sin(s.heading - h0), Math.cos(s.heading - h0))) > 0.3) { turned++; h0 = s.heading; } if (Math.hypot(s.x - p0.x, s.z - p0.z) > 0.8) { stepped++; p0 = { x: s.x, z: s.z }; } }
  assert.ok(turned >= 3, `Wren turns to face things at the field (${turned})`); assert.ok(stepped >= 1, `and steps between spots (${stepped})`);
});
test('a root takes her when she runs along it: any root within reach that agrees with her run, not only the nearest, and never one she crosses square', () => {
  const r = TREE_ROOTS[0], a = TREES[r.a], b = TREES[r.b], d = { x: b.x - a.x, z: b.z - a.z }, len = Math.hypot(d.x, d.z); d.x /= len; d.z /= len;
  const on = { x: a.x + d.x * 1.2, z: a.z + d.z * 1.2 };
  const hit = alignedRoot(on, d, 0.7, 0.6); assert.ok(hit && hit.root === r && hit.forward, 'running along it from a toward b, forward');
  const back = alignedRoot(on, { x: -d.x, z: -d.z }, 0.7, 0.6); assert.ok(back && back.root === r && !back.forward, 'the other way, backward');
  assert.equal(alignedRoot(on, { x: -d.z, z: d.x }, 0.7, 0.6), null, 'square across it, not taken');
  assert.equal(alignedRoot({ x: a.x + d.x * 1.2 - d.z * 1.5, z: a.z + d.z * 1.2 + d.x * 1.5 }, d, 0.7, 0.6), null, 'out of reach, not taken');
  // Two roots leave the same tree: standing nearer one but running along the other, the aligned one is taken.
  const pair = TREES.map(t => rootsAt(t.id)).find(rs => rs.length >= 2)!; const [r1, r2] = pair; const t = TREES[r1.a === r2.a || r1.a === r2.b ? r1.a : r1.b];
  const far = (rr: typeof r1) => TREES[rr.a === t.id ? rr.b : rr.a], d2 = far(r2), u2 = { x: d2.x - t.x, z: d2.z - t.z }, l2 = Math.hypot(u2.x, u2.z); u2.x /= l2; u2.z /= l2;
  const d1 = far(r1), u1 = { x: d1.x - t.x, z: d1.z - t.z }, l1 = Math.hypot(u1.x, u1.z); u1.x /= l1; u1.z /= l1;
  if (Math.abs(u1.x * u2.x + u1.z * u2.z) < 0.6) { const p = { x: t.x + u1.x * 0.5 + u2.x * 0.4, z: t.z + u1.z * 0.5 + u2.z * 0.4 }; const h = alignedRoot(p, u2, 0.7, 0.6); assert.ok(h && h.root === r2, 'the aligned root wins over the nearer one'); }
});

import { STORES, STORE_LIST, FOODS, YIELD_OF, BERRY_CAP, BERRY_REGROW, BRANCHES_PER_DAY, MILK_PER_DAY, CROP_DAYS, GRAIN_PER_STRIP, WOOD_PER_NIGHT, CARRY, STACK_CAP, STATIONS, PRAYER_CAP, OVERFILL, roomFor, storeFull, NEXT_MEAL_MARGIN, landStock, fullestFood, balance, inFlight, storeSpot, stationAt, supplied, collect, deliver, summonSpirit, spiritCost, mealSlot, everyone as count, DAY_TICKS as DT, freshVillage as freshV, advance as step, serializeVillage as ser, parseVillage as par } from '../src/villageModel';
test('the land gives by the day: berries regrow on the bushes, branches drop at dawn, the goats have their milk at dawn, the strips ripen over days', () => {
  const v = freshV(1); v.land.berries = 10; v.land.branches = 0; v.land.milk = 0;
  // Nobody picks in the night: run a night's worth and read the regrowth alone.
  v.tick = 900; step(v, 300); assert.ok(Math.abs(v.land.berries - (10 + BERRY_REGROW * 300 / DT)) < 0.01, `berries regrow at ${BERRY_REGROW} a day (${v.land.berries})`);
  step(v, DT - 1200 + 1); // through the next dawn's first tick
  assert.equal(v.land.branches, BRANCHES_PER_DAY, 'branches drop at dawn'); assert.equal(v.land.milk, MILK_PER_DAY, 'milk at dawn');
  const w = freshV(1); const c0 = w.land.crops[0]; w.tick = 900; step(w, 100); assert.ok(Math.abs(w.land.crops[0] - c0 - 100 / (CROP_DAYS * DT)) < 1e-9, `a strip ripens over ${CROP_DAYS} days`);
  assert.equal(landStock(freshV(1), 'water'), Infinity, 'the stream is endless');
});
test('gathering is seen: a unit at a time at the place into an armful, carried to the store on the green and handed over; the caps bound the take', () => {
  const v = freshV(1); v.stores.berries = 1; let carried = 0, delivered = 0, maxCarry = 0; const before = { ...v.stores };
  for (let t = 0; t < 330; t++) { const tansy = v.hobbits.find(s => s.id === 'tansy')!, had = tansy.carry?.n ?? 0; step(v, 1); if (tansy.carry) { carried++; maxCarry = Math.max(maxCarry, tansy.carry.n); assert.equal(tansy.carry.kind, 'berries'); } if (had > 0 && !tansy.carry && !tansy.inside) delivered++; }
  assert.ok(carried > 10, `Tansy carries berries for a while (${carried} ticks)`); assert.ok(maxCarry <= CARRY.berries, 'an armful at most'); assert.ok(delivered >= 1, 'and hands over at the baskets at least once');
  assert.ok(v.stores.berries >= before.berries, 'the baskets fill'); for (const k of STORE_LIST) assert.ok(v.stores[k] <= STORES[k].cap + 1e-9, `${k} never over its cap`);
  assert.ok(v.land.berries < BERRY_CAP, 'the bushes are picked'); assert.ok(v.take.berries > 0 && v.take.milk > 0 && v.take.wood > 0 && v.take.water > 0, `the day's take is counted ${JSON.stringify(v.take)}`);
  // Two gatherers do not both fill the last of the room: what is in flight counts.
  const w = freshV(1); w.stores.berries = STORES.berries.cap - 2; step(w, 300); assert.ok(w.stores.berries <= STORES.berries.cap, 'no overflow lost');
  assert.ok(inFlight(w, 'berries') <= STORES.berries.cap - w.stores.berries + 1e-9 || w.hobbits.every(s => s.carry?.kind !== 'berries'), 'in flight fits the room');
  const sp = storeSpot(STORES.berries); assert.ok(Math.hypot(sp.x, sp.z) < Math.hypot(STORES.berries.x, STORES.berries.z), 'one stands a step in from the store');
});

test('three meals a day at the fire, each once: breakfast on the way out, noon with a drink, supper on the way home; hunger falls at each; the fire burns the wood Odo lays', () => {
  const v = freshV(1); const food = () => FOODS.reduce((n, f) => n + v.stores[f], 0);
  let breakfastErrands = 0; for (let t = 0; t < 90; t++) { step(v, 1); breakfastErrands += v.hobbits.filter(s => s.errand === 'meal').length; } assert.ok(breakfastErrands > 0, 'breakfast is an errand to the fire at dawn');
  step(v, 240); assert.ok(v.hobbits.every(s => s.meals === 1), `everyone has had breakfast once (${v.hobbits.map(s => s.meals)})`);
  const f0 = food(), w0 = v.stores.water; let sawEating = 0; for (let t = 330; t < 420; t++) { step(v, 1); sawEating += v.hobbits.filter(s => s.activity === 'eating').length; }
  assert.ok(v.hobbits.every(s => s.meals === 2), 'everyone ate at noon, once'); assert.ok(sawEating >= 8 * 8, `eating is seen (${sawEating})`); assert.ok(f0 - food() + v.take.berries + v.take.milk + v.take.grain >= 8, 'eight units to the noon meal'); assert.ok(v.stores.water < w0 + v.take.water, 'a drink at noon');
  step(v, 700 - 420); assert.equal(v.fireWood, 0); const odo = () => v.hobbits.find(s => s.id === 'odo')!;
  let fetched = false; for (let t = 700; t < 745; t++) { step(v, 1); if (odo().carry?.kind === 'wood') fetched = true; } assert.ok(fetched, 'Odo carries wood to the fire'); assert.ok(v.fireWood >= WOOD_PER_NIGHT - 1e-9);
  step(v, 900 - 745); assert.ok(v.hobbits.every(s => s.inside && s.meals === 3 && s.hunger < 0.2), `home, three meals, fed (${v.hobbits.map(s => s.meals)})`); step(v, DT - 900); assert.ok(v.fireWood < 0.05, 'the wood is burnt by dawn');
  assert.equal(mealSlot(0), 0); assert.equal(mealSlot(340), 1); assert.equal(mealSlot(730), 2); assert.equal(mealSlot(DT + 5), 3);
  const hungry = freshV(1); step(hungry, 330); for (const k of FOODS) hungry.stores[k] = 0; hungry.land.berries = 0; hungry.land.milk = 0; hungry.land.crops = hungry.land.crops.map(() => 0); for (const s of hungry.hobbits) { s.carry = null; s.errand = null; }
  let missed = false; for (let t = 0; t < 100; t++) { step(hungry, 1); if (hungry.hobbits.some(s => s.bubble === 'nothing to eat')) missed = true; } assert.ok(missed, 'with empty stores the noon meal is missed and says so'); assert.equal(fullestFood(hungry), null);
});
test('gathering is paced to the next meal, and a gatherer whose store holds enough goes to the stone and prays; prayer pools up to its cap, doubled while Nell is there', () => {
  const v = freshV(1); assert.equal(supplied(v, 'berries'), false, 'the first morning is short'); v.stores.berries = 8; v.stores.milk = 8; v.stores.grain = 12; assert.ok(supplied(v, 'berries'), `food for ${NEXT_MEAL_MARGIN} meals is enough`);
  const w = freshV(1); let prayedTicks = 0, gatheredTicks = 0, toStone = 0; for (let t = 0; t < DT; t++) { step(w, 1); for (const s of w.hobbits) { if (s.activity === 'praying' && s.id !== 'nell') prayedTicks++; if (s.activity === 'working' && YIELD_OF[(s.id === 'tansy' ? 'thicket' : 'copse')]) gatheredTicks++; if (s.bubble === 'to the stone' && s.bubbleUntil === w.tick + 7) toStone++; } }
  assert.ok(prayedTicks > 200, `gatherers pray when supplied (${prayedTicks} hobbit-ticks)`); assert.ok(toStone >= 2, 'they say so'); assert.ok(w.prayer > 5, `prayer pools (${w.prayer.toFixed(1)})`); assert.ok(w.prayer <= PRAYER_CAP);
  const nell = w.hobbits.find(s => s.id === 'nell')!; assert.ok(nell.meals === 3, 'Nell eats too');
  // Take the stores away and they go back to work.
  for (const k of FOODS) w.stores[k] = 0; step(w, 200 + 90); const back = w.hobbits.filter(s => ['tansy', 'hazel'].includes(s.id)).every(s => s.job === 'gather'); assert.ok(back, 'short again, the pickers leave the stone');
});
test('her hands: standing in a place ring collects a meal for the village in a few seconds from the same land, a store ring takes it, one kind at a time; a spirit summoned for a job gathers and carries tirelessly and costs more each time', () => {
  const v = freshV(2); step(v, 100); const b0 = v.land.berries, t0 = v.take.berries; let n = 0; while (collect(v, 'thicket')) n++;
  assert.equal(n, STACK_CAP, 'a stack is a meal for eight'); assert.deepEqual(v.stack, { kind: 'berries', n: STACK_CAP }); assert.ok(Math.abs(b0 - v.land.berries - STACK_CAP) < 1e-9, 'off the same bushes'); assert.equal(v.take.berries - t0, STACK_CAP, 'in the same take');
  assert.equal(collect(v, 'stream'), false, 'one kind at a time'); assert.equal(deliver(v, 'milk'), false, 'only its own store');
  // A full store: she cannot collect what has nowhere to go; the store takes OVERFILL past its cap as a heap beside it, then no more.
  const full = freshV(2); step(full, 100); full.stores.berries = STORES.berries.cap; const room = roomFor(full, 'berries'); assert.ok(room <= OVERFILL && room >= 1, `the overfill less what the pickers carry (${room})`); let took = 0; while (collect(full, 'thicket')) took++; assert.equal(took, room, 'collecting is limited to the room'); assert.ok(storeFull(full, 'berries'), 'and then the baskets are full');
  let put = 0; while (deliver(full, 'berries')) put++; assert.equal(put, room); assert.equal(full.stores.berries, STORES.berries.cap + room); assert.equal(full.stack, null, 'nothing left in her hands'); assert.equal(collect(full, 'thicket'), false);
  const parsed = par(ser(full)); assert.equal(parsed.stores.berries, full.stores.berries, 'the heap survives a save');
  const s0 = v.stores.berries; let d = 0; while (deliver(v, 'berries')) d++; assert.equal(v.stores.berries, Math.min(STORES.berries.cap + OVERFILL, s0 + STACK_CAP), 'into the baskets, under the cap and its overfill'); assert.ok(d >= 1);
  assert.ok(stationAt(STATIONS[0].x, STATIONS[0].z)?.kind === 'gather'); assert.equal(stationAt(0, 0), null, 'the fire is no station'); assert.equal(STATIONS.filter(s => s.kind === 'deliver').length, 5); assert.ok(STATIONS.some(s => s.kind === 'shrine'));
  assert.ok(inFlight(v, 'berries') >= (v.stack?.n ?? 0), 'what she carries counts as on its way');
  const w = freshV(1); assert.equal(summonSpirit(w, 'thicket'), null, 'no prayer, no spirit'); w.prayer = PRAYER_CAP; const c0 = spiritCost(w); const sp = summonSpirit(w, 'thicket'); assert.ok(sp && w.spirits.length === 1 && w.prayer === PRAYER_CAP - c0, 'a spirit for the thicket'); assert.ok(spiritCost(w) > c0, 'the next costs more'); assert.equal(summonSpirit(w, 'shrine'), null, 'the stone is no job');
  let carried = 0, delivered = 0; for (let t = 0; t < 600; t++) { const had = w.spirits[0].carry?.n ?? 0; step(w, 1); if (w.spirits[0].carry) carried++; if (had > 0 && !w.spirits[0].carry) delivered++; } assert.ok(carried > 20 && delivered >= 1, `the spirit gathers and carries (${carried}, ${delivered})`);
  step(w, DT); assert.ok(w.take.berries === 0 || w.lastTake.berries > 0); const stood = w.spirits[0]; assert.ok(Math.hypot(stood.x - STATIONS[0].x, stood.z - STATIONS[0].z) < 8, 'by night it stands at its place');
});
test('left alone the village holds: eight days on, three meals each every day, the thicket near full, the take under the regrowth, wood for the night; and it all survives a save', () => {
  const v = freshV(3); let maxHunger = 0, missed = 0; v.prayer = PRAYER_CAP; summonSpirit(v, 'stream');
  for (let d = 0; d < 8; d++) { const m0 = v.hobbits.map(s => s.meals); for (let t = 0; t < DT; t++) { step(v, 1); for (const s of v.hobbits) { maxHunger = Math.max(maxHunger, s.hunger); if (s.bubble === 'nothing to eat' && s.bubbleUntil === v.tick + 7) missed++; } } assert.ok(v.hobbits.every((s, i) => s.meals - m0[i] === 3), `day ${d + 1}: three meals each (${v.hobbits.map((s, i) => s.meals - m0[i])})`); }
  assert.equal(missed, 0, 'no meal missed'); assert.ok(v.land.berries > BERRY_CAP * 0.6, `the thicket near full (${v.land.berries.toFixed(1)})`); assert.ok(balance(v) < 1, `take under regrowth (${balance(v).toFixed(2)})`);
  assert.ok(maxHunger < 0.9, `nobody goes hungry (${maxHunger.toFixed(2)})`); assert.ok(v.fireWood > 0 || v.stores.wood >= 1, 'wood about');
  assert.ok(count(v, 'praying') >= 0); const same = freshV(3); same.prayer = PRAYER_CAP; summonSpirit(same, 'stream'); step(same, 8 * DT); assert.equal(ser(same), ser(v), 'deterministic');
  v.stack = { kind: 'wood', n: 3 }; const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the stores, the land, the prayer, the spirits and her stack survive a save');
  assert.deepEqual(Object.keys(YIELD_OF).sort(), ['copse', 'field', 'pen', 'stream', 'thicket']); assert.equal(GRAIN_PER_STRIP, CARRY.grain);
});

import { stepRaiders, strike, thornBurst, rootBind, raidSize, fullestStore, RAID_TICK, RAID_END, DY_HP, DY_FILL, STRIKE_DMG, THORN_DMG, THORN_SAP, ROOT_SAP, ROOT_S, DY_BITE, VIGOR_MAX, SAP_MAX, FAINT_VIGOR, TICKS_PER_SECOND as TPS, storeSpot as spotOf, STORES as ST } from '../src/villageModel';
test('the Dark Young come after nightfall while the village sleeps, go to the fullest store, eat their fill and leave before dawn; more of them as the days go on; a jump over a night leaves none behind', () => {
  const v = freshV(1); step(v, RAID_TICK + 1); assert.equal(v.raiders.length, raidSize(0), 'the first night brings one'); assert.ok(v.hobbits.every(s => s.inside), 'everyone asleep');
  const r = v.raiders[0]; assert.ok(Math.hypot(r.x, r.z) > 60, 'from the wood\'s edge'); assert.equal(r.state, 'coming');
  const s0 = { ...v.stores }; let arrived = -1; for (let t = RAID_TICK + 1; t < DT; t++) { step(v, 1); stepRaiders(v, 1 / TPS, null); if (arrived < 0 && v.raiders[0]?.state === 'eating') arrived = t; }
  assert.ok(arrived > 0 && arrived < RAID_TICK + 200, `it reaches a store within the evening (${arrived})`); assert.equal(v.eaten, DY_FILL, 'it eats its fill'); assert.ok(STORE_LIST.some(k => v.stores[k] < s0[k]), 'from the stores'); assert.equal(v.stores.water, s0.water, 'never the trough');
  assert.equal(v.raiders.length, 0, 'gone by dawn'); assert.equal(fullestStore(freshV(1)), 'wood', 'the woodpile is the fullest by share on the first morning');
  assert.equal(raidSize(0), 1); assert.equal(raidSize(2), 2); assert.equal(raidSize(9), 3, 'never more than three');
  const w = freshV(1); step(w, 3 * DT + RAID_TICK + 1); assert.equal(w.raiders.length, raidSize(3), 'nights jumped over leave nothing behind');
  const late = freshV(1); step(late, RAID_END + 5); stepRaiders(late, 1, null); assert.ok(late.raiders.every(r => r.state === 'leaving'), 'at the end of the night they all leave');
});
test('fighting: a cheap strike ahead of her, a thorn burst round her and a root bind that holds one, the specials on sap; struck, a Dark Young hunts and bites her vigor; at none she faints and wakes weakened, never dead', () => {
  const v = freshV(1); step(v, 3 * DT + RAID_TICK + 1); for (let i = 0; i < 400 && !v.raiders.some(r => r.state === 'eating'); i++) stepRaiders(v, 0.25, null); assert.ok(v.raiders.length >= 2 && v.raiders.some(r => r.state === 'eating'), `two on the fourth night, one at a store (${v.raiders.map(r => r.state)})`);
  v.raiders.sort((a, b) => (a.state === 'eating' ? -1 : 0) - (b.state === 'eating' ? -1 : 0)); const r0 = v.raiders[0], her = spotOf(ST[r0.target!]); const face = () => { const d = Math.hypot(r0.x - her.x, r0.z - her.z); return { fx: (r0.x - her.x) / d, fz: (r0.z - her.z) / d }; };
  const away = strike(v, { x: her.x + 20, z: her.z + 20 }, 1, 0); assert.equal(away, null, 'out of reach strikes nothing');
  const hit = strike(v, her, face().fx, face().fz); assert.equal(hit, r0, 'the nearest ahead is struck'); assert.equal(r0.hp, DY_HP - STRIKE_DMG); assert.equal(r0.state, 'eating'); stepRaiders(v, 0.1, her); assert.equal(r0.state, 'hunting', 'and it turns on her');
  let bites = 0, vig = v.hero.vigor; for (let i = 0; i < 40 && r0.state !== 'dead'; i++) { stepRaiders(v, 0.45, her); if (v.hero.vigor < vig) { bites++; vig = v.hero.vigor; } const f = face(); strike(v, her, f.fx, f.fz); }
  assert.equal(r0.state, 'dead', 'six strikes kill it'); assert.ok(bites >= 1 && v.hero.vigor < VIGOR_MAX, `it bit her on the way (${bites})`); assert.ok(v.slain >= 1, 'slain is counted');
  const b = freshV(1); step(b, 3 * DT + RAID_TICK + 1); for (let i = 0; i < 100; i++) stepRaiders(b, 0.25, null); const other = b.raiders[0], hp0 = other.hp, sap0 = b.hero.sap, hurtN = thornBurst(b, { x: other.x, z: other.z }); assert.ok(hurtN >= 1, 'the burst hurts all round her'); assert.equal(b.hero.sap, sap0 - THORN_SAP); assert.equal(other.hp, hp0 - THORN_DMG, 'the burst\'s damage');
  const bound = rootBind(b, { x: other.x + 2, z: other.z }); assert.equal(bound, other); assert.equal(other.rooted, ROOT_S); assert.equal(b.hero.sap, sap0 - THORN_SAP - ROOT_SAP); const px = other.x; stepRaiders(b, 1, { x: other.x + 2, z: other.z }); assert.equal(other.x, px, 'rooted, it cannot move');
  b.hero.sap = 0; assert.equal(thornBurst(b, her), -1, 'no sap, no burst'); assert.equal(rootBind(b, her), undefined, 'no sap, no bind'); stepRaiders(b, 5, null); assert.ok(b.hero.sap > 0, 'sap refills');
  // Bitten down: faint, then up again at FAINT_VIGOR; the dead fade.
  const u = freshV(1); step(u, RAID_TICK + 1); for (let i = 0; i < 400; i++) stepRaiders(u, 0.25, null); const foe = u.raiders[0], at = { x: foe.x, z: foe.z }; strike(u, at, 1, 0); u.hero.vigor = DY_BITE; for (let i = 0; i < 20 && u.hero.faint === 0; i++) stepRaiders(u, 0.5, at);
  assert.ok(u.hero.faint > 0 && u.hero.vigor === 0, 'bitten to nothing she faints'); for (let i = 0; i < 10; i++) stepRaiders(u, 0.5, null); assert.equal(u.hero.faint, 0); assert.ok(u.hero.vigor >= FAINT_VIGOR && u.hero.vigor < FAINT_VIGOR + 8, `and wakes weakened, never dead (${u.hero.vigor})`);
  for (let i = 0; i < 30; i++) stepRaiders(v, 1, null); assert.ok(!v.raiders.some(r => r.state === 'dead'), 'the dead are gone'); assert.ok(v.slain >= 1);
  const back = par(ser(v)); assert.equal(back.raiders.length, v.raiders.length); assert.equal(back.hero.vigor, Math.round(v.hero.vigor * 10) / 10, 'her vigor and the raid survive a save'); assert.ok(SAP_MAX > THORN_SAP + ROOT_SAP);
});

import { freshOverworld, explore, isRevealed, knownPlaces, places, parseOverworld, serializeOverworld, CELL, EXPLORE_RADIUS, LAIR_DISTANCE, KARST_AT, ZOOM_MIN, ZOOM_MAX, zoomElevation, ELEV_LOW, ELEV_HIGH } from '../src/overworldModel';
test('the overworld: the village at the origin, the karst north, the lair placed by the seed 400 m away from the karst\'s side; exploring reveals cells round her and the places she comes near; the pinch rises from the shoulder to overhead', () => {
  const ps = places(1); assert.deepEqual(ps.map(p => p.id), ['village', 'karst', 'lair']); assert.deepEqual({ x: ps[0].x, z: ps[0].z }, { x: 0, z: 0 }); assert.deepEqual({ x: ps[1].x, z: ps[1].z }, KARST_AT);
  const lair = ps[2]; assert.ok(Math.abs(Math.hypot(lair.x, lair.z) - LAIR_DISTANCE) < 2, 'the lair at its distance'); assert.ok(lair.z > 0, 'away from the karst'); assert.ok(Math.hypot(lair.x - KARST_AT.x, lair.z - KARST_AT.z) > 500, 'and far from it');
  assert.notDeepEqual(places(2)[2], lair, 'placed by the seed');
  const o = freshOverworld(1); assert.deepEqual(knownPlaces(o).map(p => p.id), ['village', 'karst'], 'the village and the karst known from the start');
  const n = explore(o, 0, 0); assert.ok(n > 20 && n < 60, `cells revealed round her (${n})`); assert.ok(isRevealed(o, 10, 10) && isRevealed(o, 0, EXPLORE_RADIUS - 5) && !isRevealed(o, 0, EXPLORE_RADIUS + CELL * 2), 'within the radius, not beyond');
  assert.equal(explore(o, 0, 0), 0, 'nothing new standing still'); assert.ok(explore(o, 30, 0) > 0, 'a step on reveals more');
  assert.ok(!o.known.has('lair')); explore(o, lair.x - lair.radius - 40, lair.z); assert.ok(o.known.has('lair'), 'the lair is known once she comes near its edge');
  const back = parseOverworld(serializeOverworld(o)); assert.equal(back.revealed.size, o.revealed.size); assert.deepEqual([...back.known], [...o.known]); assert.equal(parseOverworld('junk').revealed.size, 0);
  assert.equal(zoomElevation(ZOOM_MIN), ELEV_LOW); assert.equal(zoomElevation(ZOOM_MAX), ELEV_HIGH); assert.ok(zoomElevation(20) > ELEV_LOW && zoomElevation(20) < ELEV_HIGH);
});

import { CHUNK, LOAD_RING, MEADOW_ISLAND, KARST_CLEARING, noise, hills, beyond, biomeAt, chunkTrees, chunksAround, chunkOf } from '../src/chunkModel';
import { treesNear, setTreeProvider, nearestTree as nearest, hopTargets as hops } from '../src/villageModel';
test('the land beyond the meadow: noise in range and seeded, no hills on the island, the dark forest about the lair, a chunk\'s trees the same each time and never on the island or in the karst\'s clearing; the model sees chunk trees through the provider', () => {
  for (let i = 0; i < 50; i++) { const v = noise(i * 13.7, i * 7.1, 100, 1); assert.ok(v >= 0 && v <= 1); } assert.notEqual(noise(50, 50, 100, 1), noise(50, 50, 100, 2), 'seeded');
  assert.equal(hills(10, 10), 0, 'the village is flat'); assert.equal(beyond(0, MEADOW_ISLAND - 1), 0); assert.equal(beyond(0, MEADOW_ISLAND + 200), 1); assert.ok(Math.abs(hills(300, 300)) <= 7.1, 'hills within their height');
  const lair = places(1)[2]; assert.equal(biomeAt(lair.x, lair.z, 1), 'dark'); assert.notEqual(biomeAt(0, 0, 1), 'dark'); assert.ok(['meadow', 'wood'].includes(biomeAt(400, -400, 1)));
  const a = chunkTrees(3, 3, 1), b = chunkTrees(3, 3, 1); assert.deepEqual(a, b, 'the same whenever loaded'); assert.ok(a.length > 0 && a.length <= 16); assert.ok(a.every(t => t.x >= 3 * CHUNK && t.x < 4 * CHUNK && t.z >= 3 * CHUNK && t.z < 4 * CHUNK), 'within the chunk'); assert.ok(a.every(t => t.id >= 100000), 'ids apart from the village\'s');
  for (let i = 0; i < a.length; i++) for (let k = i + 1; k < a.length; k++) assert.ok(Math.hypot(a[i].x - a[k].x, a[i].z - a[k].z) >= 4.5, 'spaced');
  assert.equal(chunkTrees(0, 0, 1).length, 0, 'none on the island'); const kc = chunkOf(KARST_AT.x, KARST_AT.z); assert.ok(chunkTrees(kc.cx, kc.cz, 1).every(t => Math.hypot(t.x - KARST_AT.x, t.z - KARST_AT.z) >= KARST_CLEARING), 'the karst\'s clearing kept');
  assert.equal(chunksAround(0, 0).length, (2 * LOAD_RING + 1) ** 2);
  const far = chunkTrees(4, 4, 1); setTreeProvider((x, z, r) => far.filter(t => Math.hypot(t.x - x, t.z - z) <= r)); const t0 = far[0]; assert.equal(nearest(t0.x + 0.5, t0.z).tree.id, t0.id, 'the nearest tree can be a chunk tree'); assert.ok(treesNear(t0.x, t0.z, 3).some(t => t.id === t0.id)); const h = hops(t0); assert.ok(h.every(o => o.id !== t0.id)); setTreeProvider(() => []);
  assert.equal(nearest(t0.x, t0.z).tree.id < 100000, true, 'without the provider, the village\'s trees again');
});
