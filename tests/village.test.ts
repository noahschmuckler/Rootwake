import { test } from 'node:test'; import assert from 'node:assert/strict';
import { setLair, isSpoiled, spoil, mealFood, collect, landStock, DY_FLEE, HOLD_RANGE, HOLD_SAP, HOLD_MELT_S, DARK_PER_SITE, DARK_FED_DAYS, SPOIL_TICKS, YIELD_SITES, HOBBITS, HOUSES, housesOf, villageState, stateText, rumors, bearingWords, setDens, densInReach, wolves, WOLF_TICK, WOLF_HP, WOLF_BITE_MEALS, DEN_PEACE_DAYS, strike, housePlace, HUT_RING, BEDS, HUT_PRAYER, QUICKEN_COST, quicken, quickenable, askHut, deliverToSite, siteWants, crowded, bear, thought, SITES, NEWCOMERS, ALL_HOBBITS, INFANT_DAYS, CHILD_DAYS, BIRTH_DAYS, DEATH_MEALS, REST_MEALS, ROOM_PER_HOUSE, paceOf, houseWithRoom, living, DAY_TICKS, PHASES, TICKS_PER_SECOND, phaseAt, clockOf, daylightAt, freshVillage, advance, wants, everyone, inHouse, route, parseVillage, serializeVillage, hobbitById, houseOf, HOUSE_RADIUS, HOUSE_RING } from '../src/villageModel';
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
  assert.ok(grassCan(5, -14)); assert.ok(grassCan(0, STREAM_Z(0)), 'under the water too (R1: the stream bed is no wall under the soil)'); assert.ok(inWater(3, STREAM_Z(3))); assert.equal(grassCan(9 * Math.cos(0.3), 9 * Math.sin(0.3)), false, 'not under a house'); assert.ok(grassCan(MEADOW_RADIUS + 41, 0), 'the land goes on past the wood (the chunks)'); assert.equal(inWater(200, STREAM_Z(200)), false, 'the stream ends past the village');
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
  assert.ok(stationAt(STATIONS[0].x, STATIONS[0].z)?.kind === 'gather'); assert.equal(stationAt(0, 0), null, 'the fire is no station'); assert.equal(STATIONS.filter(s => s.kind === 'deliver').length, 5); assert.ok(!STATIONS.some(s => s.kind === 'shrine'), 'no ring before the stone: the miracles are asked from anywhere');
  assert.ok(inFlight(v, 'berries') >= (v.stack?.n ?? 0), 'what she carries counts as on its way');
  const w = freshV(1); assert.equal(summonSpirit(w, 'thicket'), null, 'no prayer, no spirit'); w.prayer = PRAYER_CAP; const c0 = spiritCost(w); const sp = summonSpirit(w, 'thicket'); assert.ok(sp && w.spirits.length === 1 && w.prayer === PRAYER_CAP - c0, 'a spirit for the thicket'); assert.ok(spiritCost(w) > c0, 'the next costs more'); assert.equal(summonSpirit(w, 'shrine'), null, 'the stone is no job');
  let carried = 0, delivered = 0; for (let t = 0; t < 600; t++) { const had = w.spirits[0].carry?.n ?? 0; step(w, 1); if (w.spirits[0].carry) carried++; if (had > 0 && !w.spirits[0].carry) delivered++; } assert.ok(carried > 20 && delivered >= 1, `the spirit gathers and carries (${carried}, ${delivered})`);
  step(w, DT); assert.ok(w.take.berries === 0 || w.lastTake.berries > 0); const stood = w.spirits[0]; assert.ok(Math.hypot(stood.x - STATIONS[0].x, stood.z - STATIONS[0].z) < 8, 'by night it stands at its place');
});
test('left alone the village holds: eight days on, three meals each every day, the thicket near full, the take under the regrowth, wood for the night; and it all survives a save', () => {
  const v = freshV(3); let maxHunger = 0, missed = 0; v.prayer = PRAYER_CAP; summonSpirit(v, 'stream');
  for (let d = 0; d < 8; d++) { const m0 = new Map(v.hobbits.map(s => [s.id, s.meals])); for (let t = 0; t < DT; t++) { step(v, 1); for (const s of v.hobbits) { if (d < BIRTH_DAYS + INFANT_DAYS) maxHunger = Math.max(maxHunger, s.hunger); if (s.bubble === 'nothing to eat' && s.bubbleUntil === v.tick + 7) missed++; } } const eaters = v.hobbits.filter(s => m0.has(s.id) && s.stage !== 'infant'); if (d < BIRTH_DAYS + INFANT_DAYS) assert.ok(eaters.every(s => s.meals - m0.get(s.id)! === 3), `day ${d + 1}: three meals each (${eaters.map(s => s.meals - m0.get(s.id)!)})`); }
  // D1: fed, the village grows, and its children eat: nine or ten mouths sit at the edge of what the land regrows (balance is a later pass), so after the first child goes out a missed meal or two is allowed.
  assert.ok(v.hobbits.length > 8, `fed for days, the village grows (${v.hobbits.length})`);
  assert.ok(missed <= 3, `no more than a meal or two missed as it grows (${missed})`); assert.ok(v.land.berries > BERRY_CAP * 0.6, `the thicket near full (${v.land.berries.toFixed(1)})`); assert.ok(balance(v) < 1, `take under regrowth (${balance(v).toFixed(2)})`);
  assert.ok(maxHunger < 0.9, `nobody goes hungry (${maxHunger.toFixed(2)})`); assert.ok(v.fireWood > 0 || v.stores.wood >= 1, 'wood about');
  assert.ok(count(v, 'praying') >= 0); const same = freshV(3); same.prayer = PRAYER_CAP; summonSpirit(same, 'stream'); step(same, 8 * DT); assert.equal(ser(same), ser(v), 'deterministic');
  v.stack = { kind: 'wood', n: 3 }; const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the stores, the land, the prayer, the spirits and her stack survive a save');
  assert.deepEqual(Object.keys(YIELD_OF).sort(), ['copse', 'field', 'pen', 'stream', 'thicket']); assert.equal(GRAIN_PER_STRIP, CARRY.grain);
});

import { stepRaiders, strike, thornBurst, rootBind, raidSize, fullestStore, RAID_TICK, RAID_END, DY_HP, DY_FILL, STRIKE_DMG, THORN_DMG, THORN_SAP, ROOT_SAP, ROOT_S, DY_BITE, VIGOR_MAX, SAP_MAX, FAINT_VIGOR, TICKS_PER_SECOND as TPS, storeSpot as spotOf, STORES as ST } from '../src/villageModel';
/** A village whose Dark Young exist (Noah: none without an infant inside): n infants stolen and bred at the lair. */
const freshR = (seed: number, n: number) => { const v = freshV(seed); for (let i = 0; i < n; i++) v.bred.push({ id: NEWCOMERS[NEWCOMERS.length - 1 - i].id, home: 0, born: 0 }); return v; };
test('the Dark Young come after nightfall while the village sleeps, go to the fullest store, eat their fill and leave before dawn; more of them as the days go on; a jump over a night leaves none behind', () => {
  const v = freshR(1, 1); step(v, RAID_TICK + 1); assert.equal(v.raiders.length, raidSize(0), 'the first night brings one'); assert.ok(v.hobbits.every(s => s.inside), 'everyone asleep');
  const r = v.raiders[0]; assert.ok(Math.hypot(r.x, r.z) > 60, 'from the wood\'s edge'); assert.equal(r.state, 'coming');
  const s0 = { ...v.stores }; let arrived = -1; for (let t = RAID_TICK + 1; t < DT; t++) { step(v, 1); stepRaiders(v, 1 / TPS, null); if (arrived < 0 && v.raiders[0]?.state === 'eating') arrived = t; }
  assert.ok(arrived > 0 && arrived < RAID_TICK + 200, `it reaches a store within the evening (${arrived})`); assert.equal(v.eaten, DY_FILL, 'it eats its fill'); assert.ok(STORE_LIST.some(k => v.stores[k] < s0[k]), 'from the stores'); assert.equal(v.stores.water, s0.water, 'never the trough');
  assert.equal(v.raiders.length, 0, 'gone by dawn'); assert.equal(fullestStore(freshV(1)), 'wood', 'the woodpile is the fullest by share on the first morning');
  assert.equal(raidSize(0), 1); assert.equal(raidSize(2), 2); assert.equal(raidSize(9), 3, 'never more than three');
  const w = freshR(1, 2); step(w, 3 * DT + RAID_TICK + 1); assert.equal(w.raiders.length, raidSize(3), 'nights jumped over leave nothing behind');
  const late = freshV(1); step(late, RAID_END + 5); stepRaiders(late, 1, null); assert.ok(late.raiders.every(r => r.state === 'leaving'), 'at the end of the night they all leave');
});
test('fighting: a cheap strike ahead of her, a thorn burst round her and a root bind that holds one, the specials on sap; struck, a Dark Young hunts and bites her vigor; at none she faints and wakes weakened, never dead', () => {
  const v = freshR(1, 2); step(v, 3 * DT + RAID_TICK + 1); for (let i = 0; i < 400 && !v.raiders.some(r => r.state === 'eating'); i++) stepRaiders(v, 0.25, null); assert.ok(v.raiders.length >= 2 && v.raiders.some(r => r.state === 'eating'), `two on the fourth night, one at a store (${v.raiders.map(r => r.state)})`);
  v.raiders.sort((a, b) => (a.state === 'eating' ? -1 : 0) - (b.state === 'eating' ? -1 : 0)); const r0 = v.raiders[0], her = spotOf(ST[r0.target!]); const face = () => { const d = Math.hypot(r0.x - her.x, r0.z - her.z); return { fx: (r0.x - her.x) / d, fz: (r0.z - her.z) / d }; };
  const away = strike(v, { x: her.x + 20, z: her.z + 20 }, 1, 0); assert.equal(away, null, 'out of reach strikes nothing');
  const hit = strike(v, her, face().fx, face().fz); assert.equal(hit, r0, 'the nearest ahead is struck'); assert.equal(r0.hp, DY_HP - STRIKE_DMG); assert.equal(r0.state, 'eating'); stepRaiders(v, 0.1, her); assert.equal(r0.state, 'hunting', 'and it turns on her');
  let bites = 0, vig = v.hero.vigor; for (let i = 0; i < 40 && r0.state !== 'retreating'; i++) { stepRaiders(v, 0.45, her); if (v.hero.vigor < vig) { bites++; vig = v.hero.vigor; } const f = face(); strike(v, her, f.fx, f.fz); }
  assert.equal(r0.state, 'retreating', 'six strikes beat it, and it retreats (D2: it does not die)'); assert.equal(r0.hp, 0); assert.ok(bites >= 1 && v.hero.vigor < VIGOR_MAX, `it bit her on the way (${bites})`); assert.equal(v.slain, 0, 'nothing slain by strikes alone'); assert.equal(strike(v, { x: r0.x, z: r0.z }, 1, 0), null, 'a strike cannot reach the beaten');
  const b = freshR(1, 1); step(b, 3 * DT + RAID_TICK + 1); for (let i = 0; i < 100; i++) stepRaiders(b, 0.25, null); const other = b.raiders[0], hp0 = other.hp, sap0 = b.hero.sap, hurtN = thornBurst(b, { x: other.x, z: other.z }); assert.ok(hurtN >= 1, 'the burst hurts all round her'); assert.equal(b.hero.sap, sap0 - THORN_SAP); assert.equal(other.hp, hp0 - THORN_DMG, 'the burst\'s damage');
  const bound = rootBind(b, { x: other.x + 2, z: other.z }); assert.equal(bound, other); assert.equal(other.rooted, ROOT_S); assert.equal(b.hero.sap, sap0 - THORN_SAP - ROOT_SAP); const px = other.x; stepRaiders(b, 1, { x: other.x + 2, z: other.z }); assert.equal(other.x, px, 'rooted, it cannot move');
  b.hero.sap = 0; assert.equal(thornBurst(b, her), -1, 'no sap, no burst'); assert.equal(rootBind(b, her), undefined, 'no sap, no bind'); stepRaiders(b, 5, null); assert.ok(b.hero.sap > 0, 'sap refills');
  // Bitten down: faint, then up again at FAINT_VIGOR; the dead fade.
  const u = freshR(1, 1); step(u, RAID_TICK + 1); for (let i = 0; i < 400; i++) stepRaiders(u, 0.25, null); const foe = u.raiders[0], at = { x: foe.x, z: foe.z }; strike(u, at, 1, 0); u.hero.vigor = DY_BITE; for (let i = 0; i < 20 && u.hero.faint === 0; i++) stepRaiders(u, 0.5, at);
  assert.ok(u.hero.faint > 0 && u.hero.vigor === 0, 'bitten to nothing she faints'); for (let i = 0; i < 10; i++) stepRaiders(u, 0.5, null); assert.equal(u.hero.faint, 0); assert.ok(u.hero.vigor >= FAINT_VIGOR && u.hero.vigor < FAINT_VIGOR + 8, `and wakes weakened, never dead (${u.hero.vigor})`);
  for (let i = 0; i < 40; i++) stepRaiders(v, 1, null); assert.ok(!v.raiders.some(r => r.state === 'retreating'), 'the beaten are gone, home to their mother'); assert.equal(v.slain, 0);
  const back = par(ser(v)); assert.equal(back.raiders.length, v.raiders.length); assert.equal(back.hero.vigor, Math.round(v.hero.vigor * 10) / 10, 'her vigor and the raid survive a save'); assert.ok(SAP_MAX > THORN_SAP + ROOT_SAP);
});

import { addHint, danger, dens, DANGER_SAFE, DANGER_FAR, DEN_CLEAR, PACK_BASE, FOREST_RADIUS, freshOverworld, explore, isRevealed, knownPlaces, places, parseOverworld, serializeOverworld, CELL, EXPLORE_RADIUS, LAIR_DISTANCE, KARST_AT, ZOOM_MIN, ZOOM_MAX, zoomElevation, ELEV_LOW, ELEV_HIGH, bearingOf, wrapDeg } from '../src/overworldModel';
test('the overworld: the village at the origin, the karst north, the lair placed by the seed 400 m away from the karst\'s side; exploring reveals cells round her and the places she comes near; the pinch rises from the shoulder to overhead', () => {
  const ps = places(1); assert.deepEqual(ps.slice(0, 3).map(p => p.id), ['village', 'karst', 'lair']); assert.ok(ps.slice(3).every(p => p.kind === 'den'), 'then the dens'); assert.deepEqual({ x: ps[0].x, z: ps[0].z }, { x: 0, z: 0 }); assert.deepEqual({ x: ps[1].x, z: ps[1].z }, KARST_AT);
  const lair = ps[2]; assert.ok(Math.abs(Math.hypot(lair.x, lair.z) - LAIR_DISTANCE) < 2, 'the lair at its distance'); assert.ok(lair.z > 0, 'away from the karst'); assert.ok(Math.hypot(lair.x - KARST_AT.x, lair.z - KARST_AT.z) > 500, 'and far from it');
  assert.notDeepEqual(places(2)[2], lair, 'placed by the seed');
  const o = freshOverworld(1); assert.deepEqual(knownPlaces(o).map(p => p.id), ['village', 'karst'], 'the village and the karst known from the start');
  const n = explore(o, 0, 0); assert.ok(n > 20 && n < 60, `cells revealed round her (${n})`); assert.ok(isRevealed(o, 10, 10) && isRevealed(o, 0, EXPLORE_RADIUS - 5) && !isRevealed(o, 0, EXPLORE_RADIUS + CELL * 2), 'within the radius, not beyond');
  assert.equal(explore(o, 0, 0), 0, 'nothing new standing still'); assert.ok(explore(o, 30, 0) > 0, 'a step on reveals more');
  assert.ok(!o.known.has('lair')); explore(o, lair.x - lair.radius - 40, lair.z); assert.ok(o.known.has('lair'), 'the lair is known once she comes near its edge');
  const back = parseOverworld(serializeOverworld(o)); assert.equal(back.revealed.size, o.revealed.size); assert.deepEqual([...back.known], [...o.known]); assert.equal(parseOverworld('junk').revealed.size, 0);
  assert.equal(bearingOf(0, -1), 0, 'north is the karst\'s way'); assert.equal(bearingOf(1, 0), 90); assert.equal(bearingOf(0, 1), 180); assert.equal(bearingOf(-1, 0), 270); assert.ok(Math.abs(bearingOf(KARST_AT.x, KARST_AT.z) - 350) < 1, 'the karst a little west of north'); assert.equal(wrapDeg(350 - 10), -20); assert.equal(wrapDeg(10 - 350), 20);
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
  assert.equal(hills(KARST_AT.x + 10, KARST_AT.z - 10), 0, 'the karst stands on flat ground'); assert.equal(hills(KARST_AT.x, KARST_AT.z + 90), 0);
  const far = chunkTrees(4, 4, 1); setTreeProvider((x, z, r) => far.filter(t => Math.hypot(t.x - x, t.z - z) <= r)); const t0 = far[0]; assert.equal(nearest(t0.x + 0.5, t0.z).tree.id, t0.id, 'the nearest tree can be a chunk tree'); assert.ok(treesNear(t0.x, t0.z, 3).some(t => t.id === t0.id)); const h = hops(t0); assert.ok(h.every(o => o.id !== t0.id)); setTreeProvider(() => []);
  assert.equal(nearest(t0.x, t0.z).tree.id < 100000, true, 'without the provider, the village\'s trees again');
});

import { setLair, forestDepth, gainXp, choosePerk, levelFor, vigorMax, sapMax, strikeDamage, raidsPaused, LEVEL_XP, LEVEL_CAP, XP_DY, XP_LAIR, PERK_VIGOR, PERK_STRIKE, PERK_SAP, FOREST_DRAIN, LAIR_HP, LAIR_WAKE, LAIR_SPAWN_S, LAIR_SWEEP, LAIR_SWEEP_S, LAIR_PEACE_DAYS, LAIR_HURT_RANGE, STRIKE_DMG as SD } from '../src/villageModel';
test('levelling: kills count, a level at each threshold up to five, a choice each level between vigor, strike and sap that grows her; the dark forest drains her by depth; the lair wakes near her, broods Dark Young, sweeps, and slain is gone with the raids for five days, then grows again', () => {
  assert.equal(levelFor(0), 1); assert.equal(levelFor(LEVEL_XP[1]), 2); assert.equal(levelFor(999), LEVEL_CAP);
  const v = freshV(1); gainXp(v, XP_DY); assert.equal(v.hero.level, 1); gainXp(v, XP_DY); assert.equal(v.hero.level, 2); assert.equal(v.hero.choices, 1, 'a choice owed');
  assert.equal(choosePerk(v, 'strike'), true); assert.equal(strikeDamage(v.hero), SD + PERK_STRIKE); assert.equal(choosePerk(v, 'strike'), false, 'no second choice'); gainXp(v, 3); assert.equal(v.hero.level, 3); choosePerk(v, 'vigor'); assert.equal(vigorMax(v.hero), 100 + PERK_VIGOR); gainXp(v, XP_LAIR); assert.equal(v.hero.level, LEVEL_CAP); assert.equal(v.hero.choices, 2); choosePerk(v, 'sap'); assert.equal(sapMax(v.hero), 100 + PERK_SAP);
  const back = par(ser(v)); assert.deepEqual(back.hero.perks, v.hero.perks); assert.equal(back.hero.level, v.hero.level); assert.equal(back.hero.choices, 1);
  // The forest and the lair, placed for the test.
  setLair(null); assert.equal(forestDepth(0, 0), 0, 'no lair, no forest'); setLair({ x: 300, z: 300, radius: 75 }); assert.equal(forestDepth(300, 300), 1); assert.ok(forestDepth(340, 300) > 0 && forestDepth(340, 300) < 1); assert.equal(forestDepth(400, 300), 0);
  const w = freshR(1, 3); const v0 = w.hero.vigor; stepRaiders(w, 2, { x: 300, z: 300 }); assert.ok(Math.abs(v0 - w.hero.vigor - FOREST_DRAIN * 2) < 1e-6, 'drained at the centre'); stepRaiders(w, 2, { x: 0, z: 0 }); assert.ok(w.hero.vigor <= v0 - FOREST_DRAIN * 2 + 1e-6, 'and not yet refilled (no calm)');
  assert.equal(w.lair.woke, false); const near = { x: 300 + LAIR_WAKE - 2, z: 300 }; stepRaiders(w, 0.1, near); assert.ok(w.lair.woke, 'it wakes near her'); const n0 = w.raiders.length; stepRaiders(w, LAIR_SPAWN_S + 0.1, near); assert.equal(w.raiders.length, n0 + 1, 'a Dark Young born'); assert.equal(w.raiders[w.raiders.length - 1].state, 'hunting');
  const close = { x: 302, z: 300 }; const vb = w.hero.vigor; for (let i = 0; i < 4; i++) stepRaiders(w, LAIR_SWEEP_S / 2, close); assert.ok(w.hero.vigor <= vb - LAIR_SWEEP + 1e-6, 'swept within reach');
  const u = freshV(1); u.hero.vigor = 1000; const hp0 = u.lair.hp; assert.equal(strike(u, { x: 300 + LAIR_HURT_RANGE - 1, z: 300 }, 1, 0), null, 'nothing else to strike'); assert.equal(u.lair.hp, hp0 - SD, 'the strike lands on the lair'); assert.ok(thornBurst(u, { x: 300, z: 300 }) >= 1); assert.equal(u.lair.hp, hp0 - SD - THORN_DMG);
  u.lair.hp = SD; strike(u, { x: 300, z: 300 }, 1, 0); assert.equal(u.lair.alive, false, 'slain'); assert.equal(u.hero.xp, XP_LAIR); assert.ok(raidsPaused(u), 'the raids stop'); step(u, RAID_TICK + 2); assert.equal(u.raiders.length, 0, 'no raid that night');
  step(u, DT * LAIR_PEACE_DAYS); stepRaiders(u, 0.1, null); assert.ok(u.lair.alive && u.lair.hp === LAIR_HP, 'grown again after the peace'); assert.ok(!raidsPaused(u));
  const again = par(ser(u)); assert.equal(again.lair.alive, u.lair.alive); setLair(null);
});

// D1: the village lives and dies.
test('D1: starved, they weaken, keep to the stone, and die one by one; the others mourn; the names are gone from the living', () => {
  const v = freshV(5); const starve = () => { for (const k of ['berries', 'milk', 'grain'] as const) v.stores[k] = 0; v.land.berries = 0; v.land.branches = 0; v.land.milk = 0; v.land.crops = v.land.crops.map(() => 0); for (const s of v.hobbits) if (s.carry && s.carry.kind !== 'water' && s.carry.kind !== 'wood') s.carry = null; };
  let weakened = false, prayedWeak = false;
  for (let t = 0; t < DT * 3 && v.hobbits.length === 8; t++) { starve(); step(v, 1); for (const s of v.hobbits) { if (s.missed >= 1 && paceOf(s) < HOBBITS.find(h => h.id === s.id)!.pace) weakened = true; if (s.missed >= REST_MEALS && s.job === 'pray') prayedWeak = true; } }
  assert.ok(weakened, 'a missed meal slows them'); assert.ok(prayedWeak, 'starving, they keep to the stone');
  assert.ok(v.hobbits.length < 8, `someone has died (${v.hobbits.length} left)`); assert.equal(v.dead.length, 8 - v.hobbits.length); assert.ok(v.events.some(e => e.text.endsWith('has died of hunger')), JSON.stringify(v.events));
  assert.ok(v.hobbits.some(s => s.bubble.startsWith('mourning ')), 'the others mourn'); assert.ok(v.mourningUntil > v.tick);
  assert.ok(v.hobbits.every(s => s.missed < DEATH_MEALS)); assert.ok(v.dead.every(d => !v.hobbits.some(s => s.id === d.id)), 'the dead are not among the living');
  const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the dead and the missed meals survive a save'); assert.equal(back.hobbits.length, v.hobbits.length);
});
test('D1: fed through every meal for days, a child is born into a house with room, stays in for INFANT_DAYS, goes out small, and is grown after CHILD_DAYS more; never more than a house holds; deterministic', () => {
  const v = freshV(6); const feed = () => { v.stores.berries = 8; v.stores.milk = 8; v.stores.grain = 12; v.stores.water = 10; v.stores.wood = 12; };
  let bornAt = -1, wentOut = -1; const before = v.hobbits.length;
  for (let t = 0; t < DT * (BIRTH_DAYS + INFANT_DAYS + CHILD_DAYS + 2); t++) { feed(); step(v, 1); const n = v.hobbits.find(s => NEWCOMERS.some(c => c.id === s.id)); if (n && bornAt < 0) bornAt = v.tick; if (n && n.stage !== 'infant' && wentOut < 0) wentOut = v.tick; }
  assert.ok(bornAt > 0 && bornAt <= DT * (BIRTH_DAYS + 1) + 1, `born by day ${BIRTH_DAYS + 1} (${bornAt})`); assert.ok(v.hobbits.length > before);
  const first = v.hobbits.find(s => s.id === NEWCOMERS[0].id)!; assert.ok(first, 'the pool in order'); assert.ok(first.home >= 0 && first.home < housesOf(v).length, 'in a house of the village (a hut, once grown and moved out)'); assert.ok(living(v, first.home).length <= ROOM_PER_HOUSE);
  assert.ok(wentOut - bornAt >= INFANT_DAYS * DT - 1 && wentOut - bornAt <= (INFANT_DAYS + 1) * DT, `out after INFANT_DAYS (${(wentOut - bornAt) / DT} days)`); assert.equal(first.stage, 'grown', 'grown after CHILD_DAYS more');
  assert.ok(v.events.some(e => e.text.includes('is born in house')) && v.events.some(e => e.text.includes('goes out with the others')), JSON.stringify(v.events));
  assert.ok(v.hobbits.every(s => ALL_HOBBITS.some(h => h.id === s.id))); assert.ok(housesOf(v).every(h => living(v, h.id).length <= ROOM_PER_HOUSE));
  const same = freshV(6); for (let t = 0; t < v.tick; t++) { same.stores.berries = 8; same.stores.milk = 8; same.stores.grain = 12; same.stores.water = 10; same.stores.wood = 12; step(same, 1); } assert.equal(ser(same), ser(v), 'deterministic');
  const back = par(ser(v)); assert.equal(ser(back), ser(v), 'a newcomer survives a save'); assert.ok(houseWithRoom(v) !== null || v.hobbits.length >= housesOf(v).length * ROOM_PER_HOUSE);
});

// D2: the spoiled land and the retreat.
test('D2: fed, a Dark Young devours a place: spoiled for a day, nothing to take, nothing grows, the leavings on the heap; clean again a day on', () => {
  const v = freshR(2, 2); step(v, RAID_TICK + 1); v.stores.berries = 2; v.stores.milk = 0; v.stores.grain = 0;
  let devoured: string | null = null; for (let i = 0; i < 1200 && !devoured; i++) { stepRaiders(v, 0.25, null); for (const k of YIELD_SITES) if (isSpoiled(v, k)) devoured = k; }
  assert.ok(devoured, `a place devoured (${v.raiders.map(r => r.state)})`); const site = devoured as 'thicket'; assert.ok(v.stores.dark >= DARK_PER_SITE, `their leavings on the heap (${v.stores.dark})`); assert.ok(v.events.some(e => e.text.endsWith('is spoiled')));
  const kind = ({ thicket: 'berries', copse: 'wood', field: 'grain', pen: 'milk' } as const)[site]; assert.equal(landStock(v, kind), 0, 'nothing to take'); assert.equal(collect(v, site), false, 'her collecting refused');
  const berries0 = v.land.berries, crops0 = [...v.land.crops]; step(v, DT / 2); if (site === 'thicket') assert.equal(v.land.berries, berries0, 'no regrowth while spoiled'); if (site === 'field') assert.deepEqual(v.land.crops, crops0, 'the strips halted');
  step(v, SPOIL_TICKS); assert.ok(!isSpoiled(v, site), 'clean again a day after'); assert.ok(v.events.some(e => e.text.endsWith('is clean again')));
  const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the spoiled places and the heap survive a save');
});
test('D2: the leavings are eaten only when nothing else is left, and breed; the raiders never eat them', () => {
  const v = freshV(2); v.stores.dark = 6; assert.notEqual(mealFood(v), 'dark', 'proper food first'); v.stores.berries = 0; v.stores.milk = 0; v.stores.grain = 0; assert.equal(mealFood(v), 'dark', 'the leavings last');
  v.land.berries = 0; v.land.branches = 0; v.land.milk = 0; v.land.crops = v.land.crops.map(() => 0); spoil(v, 'thicket'); spoil(v, 'field'); spoil(v, 'pen'); v.stores.dark = 12;
  step(v, 360); assert.ok(v.hobbits.some(s => s.bubble === 'eating their leavings' || s.meals > 0) && v.darkMealsToday > 0, `they eat the leavings (${v.darkMealsToday})`);
  const fed0 = v.wellFedDays, n0 = v.hobbits.length; for (let t = DT - (v.tick % DT) + DT + 1; t > 0; t--) { v.stores.dark = 12; step(v, 1); } // the rest of this day (its heap ran out before the top-up began) and one whole day of leavings assert.ok(v.wellFedDays >= fed0 + DARK_FED_DAYS || v.hobbits.length > n0, `a day of leavings counts for more, or bred already (${v.wellFedDays}, ${v.hobbits.length})`);
  step(v, RAID_TICK + 40 - (v.tick % DT)); v.stores.dark = 12; for (let i = 0; i < 200; i++) stepRaiders(v, 0.25, null); assert.equal(v.stores.dark, 12, 'the raiders leave their own heap alone');
});
test('D2: beaten it retreats flat and fast for the lair; rooted with her beside it, it is held for sap, withers at HOLD_MELT_S and melts, counted as slain; at daybreak a held one melts in the sun', () => {
  setLair({ x: 300, z: 0, radius: 75 });
  try {
    const v = freshR(1, 1); step(v, RAID_TICK + 1); for (let i = 0; i < 400; i++) stepRaiders(v, 0.25, null); const r = v.raiders[0]; r.hp = STRIKE_DMG; const her = { x: r.x - 1, z: r.z }; strike(v, her, 1, 0); assert.equal(r.state, 'retreating');
    const d0 = Math.hypot(r.x - 300, r.z); stepRaiders(v, 1, her); const d1 = Math.hypot(r.x - 300, r.z); assert.ok(d0 - d1 > DY_FLEE * 0.9, `it runs for the lair at DY_FLEE (${(d0 - d1).toFixed(1)} m in a second)`);
    const by = { x: r.x - 1, z: r.z }; v.hero.sap = 100; assert.equal(rootBind(v, by), r, 'the roots can hold the beaten'); const sap0 = v.hero.sap, x0 = r.x;
    stepRaiders(v, ROOT_S * 2, by); assert.ok(r.rooted > 0 && r.x === x0, 'held past the bind\'s time while she stands by it'); assert.ok(v.hero.sap < sap0, 'for sap');
    let t = 0; while (r.state === 'retreating' && t < HOLD_MELT_S + 5) { stepRaiders(v, 0.5, by); t += 0.5; } assert.equal(r.state, 'melting', 'held long enough it melts'); assert.equal(v.slain, 1); assert.equal(v.melted, 1); assert.equal(v.hero.xp, 1); assert.ok(v.events.some(e => e.text.includes('melts')));
    for (let i = 0; i < 20; i++) stepRaiders(v, 1, null); assert.ok(!v.raiders.includes(r), 'and is gone');
    const w = freshR(1, 1); step(w, RAID_TICK + 1); for (let i = 0; i < 400; i++) stepRaiders(w, 0.25, null); const q = w.raiders[0]; q.hp = 1; strike(w, { x: q.x - 1, z: q.z }, 1, 0); rootBind(w, { x: q.x - 1, z: q.z }); stepRaiders(w, 1, { x: q.x - 1, z: q.z }); assert.ok(q.rooted > 0);
    step(w, DT - (w.tick % DT) + 1); assert.equal(w.slain, 1, 'held at daybreak, it melts in the sun'); assert.ok(w.raiders.every(x => x.state === 'melting'));
    const u = freshR(1, 1); step(u, RAID_TICK + 1); for (let i = 0; i < 400; i++) stepRaiders(u, 0.25, null); const z = u.raiders[0]; z.hp = 1; strike(u, { x: z.x - 1, z: z.z }, 1, 0); rootBind(u, { x: z.x - 1, z: z.z }); stepRaiders(u, ROOT_S + 1, null); assert.equal(z.rooted, 0, 'away from her the bind runs down'); assert.equal(z.state, 'retreating');
    void HOLD_RANGE; void HOLD_SAP;
  } finally { setLair(null); }
});

// D3: the snatchers.
import { bear, carryInfant, takenIds, nextNewcomer, SNATCH_TICK, GESTATION_TICKS, SNATCH_PACE } from '../src/villageModel';
test('D3: no infant, no snatcher; with one, a snatcher comes out of the lair, takes it from its house (mourned, not dead), and runs back; at the lair it becomes a Dark Young that raids the next night', () => {
  setLair({ x: 300, z: 0, radius: 75 });
  try {
    const none = freshV(4); step(none, SNATCH_TICK + 2); assert.equal(none.snatchers.length, 0, 'no infant, no snatcher');
    const v = freshV(4); assert.ok(bear(v)); const baby = v.hobbits.find(s => s.stage === 'infant')!; step(v, SNATCH_TICK + 2); assert.equal(v.snatchers.length, 1, 'one snatcher when there is an infant');
    const n = v.snatchers[0]; assert.ok(Math.hypot(n.x - 300, n.z) < 5, 'out of the lair');
    let told = false; for (let i = 0; i < 400 && !n.infant; i++) { stepRaiders(v, 0.25, null); told ||= v.events.some(e => e.banner && e.text.includes('goats are bleating')); }
    assert.equal(n.infant?.id, baby.id, 'it has the infant'); assert.ok(told, 'the goats told of it'); assert.ok(!v.hobbits.some(s => s.id === baby.id), 'gone from its house'); assert.ok(!v.dead.some(d => d.id === baby.id), 'not dead'); assert.equal(v.taken, 1); assert.ok(v.events.some(e => e.text.endsWith('is taken in the night')));
    assert.ok(takenIds(v).includes(baby.id) && nextNewcomer(v)?.id !== baby.id, 'its name is not born again while it is out');
    for (let i = 0; i < 400 && v.snatchers.length; i++) stepRaiders(v, 0.25, null); assert.equal(v.brood.length, 1, 'kept at the lair'); assert.ok(SNATCH_PACE >= 9);
    step(v, GESTATION_TICKS + 1); assert.equal(v.bred.length, 1, 'a Dark Young is born of it'); assert.ok(v.events.some(e => e.text.toLowerCase().startsWith('a dark young is born of')));
    const raid0 = v.raiders.length; step(v, (DT - (v.tick % DT)) + RAID_TICK + 1); const withIt = v.raiders.filter(r => r.infant?.id === baby.id); assert.equal(withIt.length, 1, `it raids with the rest (${raid0} → ${v.raiders.length})`);
    const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the brood and the bred survive a save');
  } finally { setLair(null); }
});
test('D3: struck, a snatcher drops the infant and runs; she carries it home to its door; a melted Dark Young leaves its infant', () => {
  setLair({ x: 300, z: 0, radius: 75 });
  try {
    const v = freshV(4); bear(v); const baby = v.hobbits.find(s => s.stage === 'infant')!; step(v, SNATCH_TICK + 2); const n = v.snatchers[0];
    for (let i = 0; i < 400 && !n.infant; i++) stepRaiders(v, 0.25, null); stepRaiders(v, 0.5, null);
    strike(v, { x: n.x - 1, z: n.z }, 1, 0); assert.equal(n.infant, null, 'it drops the infant'); assert.equal(n.state, 'fleeing'); assert.equal(v.dropped.length, 1);
    const at = v.dropped[0]; assert.equal(carryInfant(v, { x: at.x + 5, z: at.z }), null, 'out of reach'); assert.equal(carryInfant(v, { x: at.x + 0.5, z: at.z }), 'picked'); assert.equal(v.carried?.id, baby.id);
    assert.equal(collect(v, 'thicket'), false, 'her hands are full'); const door = HOUSES[baby.home].door; assert.equal(carryInfant(v, { x: door.x + 1, z: door.z }), 'home');
    assert.ok(v.hobbits.some(s => s.id === baby.id && s.stage === 'infant' && s.inside), 'home in its house'); assert.equal(v.returned, 1); assert.equal(v.carried, null);
    const w = freshV(4); bear(w); const b2 = w.hobbits.find(s => s.stage === 'infant')!; w.hobbits.splice(w.hobbits.indexOf(b2), 1); w.bred.push({ id: b2.id, home: b2.home, born: b2.born });
    step(w, RAID_TICK + 1); const r = w.raiders.find(x => x.infant)!; assert.ok(r, 'the bred one raids'); r.hp = 1; strike(w, { x: r.x - 1, z: r.z }, 1, 0); rootBind(w, { x: r.x - 1, z: r.z }); w.hero.sap = 100;
    for (let t = 0; t < 70 && r.state !== 'melting'; t += 0.5) stepRaiders(w, 0.5, { x: r.x - 1, z: r.z });
    assert.equal(r.state, 'melting'); assert.equal(w.bred.length, 0); assert.equal(w.dropped[0]?.infant.id, b2.id, 'its infant lies where it melted');
  } finally { setLair(null); }
});

// D3.1 (Noah's notes): no Dark Young without a stolen infant; one hold at a time; the lair delved.
import { atHome, broodSpot, BROOD_RING, LAIR_REACH as REACH } from '../src/villageModel';
test('D3.1: no infant stolen, no raid and no brood at the lair; every Dark Young carries an infant', () => {
  setLair({ x: 300, z: 0, radius: 75 });
  try {
    const v = freshV(1); step(v, 5 * DT + RAID_TICK + 1); for (let i = 0; i < 40; i++) stepRaiders(v, 0.25, { x: 300 + 5, z: 0 }); assert.equal(v.raiders.length, 0, 'no Dark Young at all');
    const w = freshR(1, 2); step(w, RAID_TICK + 1); assert.equal(w.raiders.length, 2); assert.ok(w.raiders.every(r => r.infant), 'each carries its infant'); assert.equal(atHome(w).length, 0, 'none left at home');
    const u = freshR(1, 1); u.hero.vigor = 1e4; for (let i = 0; i < 200; i++) stepRaiders(u, 0.25, { x: 305, z: 0 }); assert.equal(u.raiders.length, 1, 'the lair wakes only what it has bred'); assert.ok(u.raiders[0].infant);
  } finally { setLair(null); }
});
test('D3.1: one hold at a time: binding another lets the first go; sap spent, the hold breaks and it tears free (told)', () => {
  const v = freshR(1, 2); step(v, RAID_TICK + 1); const [a, b] = v.raiders; a.x = 0; a.z = 0; b.x = 2; b.z = 0; a.state = b.state = 'retreating'; a.hp = b.hp = 0;
  const her = { x: 1, z: 0 }; v.hero.sap = 100; rootBind(v, { x: -0.5, z: 0 }); assert.equal(v.hero.holding, a.id); rootBind(v, { x: 2.5, z: 0 }); assert.equal(v.hero.holding, b.id, 'the second bind takes the hold');
  stepRaiders(v, ROOT_S + 1, her); assert.ok(b.rooted > 0, 'the held one stays'); assert.equal(a.rooted, 0, 'the other ran down and is free');
  v.hero.sap = 1; stepRaiders(v, 1, her); stepRaiders(v, 0.1, her); assert.equal(v.hero.holding, -1, 'sap spent, the hold breaks'); assert.ok(v.events.some(e => e.banner && e.text.includes('tears free')));
});
test('D3.1: an infant kept at the lair can be taken back by delving (inside the mother\'s reach), or lies free when she falls', () => {
  setLair({ x: 300, z: 0, radius: 75 });
  try {
    const v = freshV(1); v.brood.push({ infant: { id: NEWCOMERS[3].id, home: 1, born: 0 }, due: 1e9 }, { infant: { id: NEWCOMERS[4].id, home: 2, born: 0 }, due: 1e9 });
    const p = broodSpot(0)!; assert.ok(Math.abs(Math.hypot(p.x - 300, p.z) - BROOD_RING) < 1e-9 && BROOD_RING < REACH, 'within the mother\'s reach');
    assert.equal(carryInfant(v, { x: p.x + 0.3, z: p.z }), 'picked'); assert.equal(v.carried?.id, NEWCOMERS[3].id); assert.equal(v.brood.length, 1); assert.ok(v.events.some(e => e.banner && e.text.includes('back from the mother')));
    v.lair.hp = 1; strike(v, { x: 300, z: 0 }, 1, 0); assert.equal(v.lair.alive, false); assert.equal(v.brood.length, 0); assert.equal(v.dropped.length, 1, 'the rest lie free'); assert.ok(v.events.some(e => e.text.includes('lie free')));
  } finally { setLair(null); }
});

// D4: the blight.
import { blightTarget, isBlighted, BLIGHT_BASE, BLIGHT_PER_DY, BLIGHT_STEP } from '../src/villageModel';
test('D4: no Dark Young bred, no blight; each bred one widens its reach; each dawn it spreads by at most a step toward it, and draws back as they melt; saved', () => {
  setLair({ x: 300, z: 0, radius: 75 });
  try {
    const v = freshV(1); step(v, 2 * DT + 1); assert.equal(v.blight, 0, 'none bred, none');
    const w = freshR(1, 3); assert.equal(blightTarget(w), BLIGHT_BASE + 3 * BLIGHT_PER_DY); step(w, 1); assert.equal(w.blight, BLIGHT_STEP, 'a step a dawn');
    step(w, 6 * DT); assert.equal(w.blight, blightTarget(w), 'up to its reach'); assert.ok(isBlighted(w, 300 + w.blight - 1, 0) && !isBlighted(w, 300 + w.blight + 1, 0)); assert.ok(w.events.some(e => e.banner && e.text.startsWith('The blight spreads')));
    const full = w.blight; w.bred = []; step(w, DT); assert.equal(w.blight, full - BLIGHT_STEP, 'a step back a dawn once none are bred');
    const before = w.blight; step(w, DT); assert.ok(w.blight < before || w.blight === 0, 'draws back as they are gone'); step(w, 10 * DT); assert.equal(w.blight, 0, 'gone');
    const back = par(ser(w)); assert.equal(back.blight, w.blight);
  } finally { setLair(null); }
});

// G1: quickening and the huts (EXPANSION.md).
test('G1: a quickening at the stone fills a place at once for prayer; refused when short, full or spoiled; the huts and the site survive a save', () => {
  const v = freshV(1); v.land.berries = 10; v.prayer = 0; assert.equal(quicken(v, 'thicket'), false, 'no prayer, no quickening'); assert.equal(v.land.berries, 10);
  v.prayer = PRAYER_CAP; assert.ok(quicken(v, 'thicket'), 'the thicket quickened'); assert.equal(v.land.berries, BERRY_CAP, 'the bushes hang full'); assert.equal(v.prayer, PRAYER_CAP - QUICKEN_COST); assert.ok(v.events.some(e => e.text.startsWith('The thicket is quickened')));
  assert.equal(quicken(v, 'thicket'), false, 'already full'); assert.equal(quickenable(v, 'thicket'), false);
  v.land.crops = v.land.crops.map(() => 0.2); assert.ok(quickenable(v, 'field')); assert.ok(quicken(v, 'field')); assert.ok(v.land.crops.every(c => c === 1), 'every strip ripe');
  spoil(v, 'copse'); v.land.branches = 0; assert.equal(quickenable(v, 'copse'), false, 'a spoiled place cannot be quickened'); assert.equal(quicken(v, 'copse'), false);
  v.land.milk = 0; assert.ok(quicken(v, 'pen')); assert.equal(v.land.milk, MILK_PER_DAY);
  const back = par(ser(v)); assert.equal(back.huts, 0); assert.equal(back.site, null); assert.equal(ser(back), ser(v));
});
test('G1: she asks a hut of the stone; the freed gatherers fetch wood and water to the stakes (the woodpile keeps the night back), build it, and a hut stands; her stack goes straight in; the next house is on the second ring', () => {
  const v = freshV(4); assert.equal(askHut(v), false, 'no prayer, no hut'); v.prayer = PRAYER_CAP; assert.ok(askHut(v), 'a hut asked'); assert.equal(v.prayer, PRAYER_CAP - HUT_PRAYER); assert.ok(v.site && v.site.id === 6 && v.site.asked, JSON.stringify(v.site)); assert.equal(askHut(v), false, 'one at a time');
  assert.ok(v.events.some(e => e.text.startsWith('A hut is asked')));
  const h = housePlace(6); assert.ok(Math.abs(Math.hypot(h.x, h.z) - HUT_RING) < 1e-9, 'on the second ring'); assert.ok(Math.hypot(h.door.x, h.door.z) < Math.hypot(h.x, h.z), 'its door to the green'); for (const f of HOUSES) assert.ok(Math.hypot(h.x - f.x, h.z - f.z) > HOUSE_RADIUS * 2 + 0.5, 'clear of the founders\' houses'); for (const s of Object.values(SITES)) if (s.id !== 'fire') assert.ok(Math.hypot(h.x - s.x, h.z - s.z) > HOUSE_RADIUS + s.radius, `clear of ${s.id}`);
  // Her hands: wood from her stack into the hut.
  v.stack = { kind: 'wood', n: 2 }; assert.ok(deliverToSite(v) && deliverToSite(v)); assert.equal(v.site!.wood, 2); assert.equal(v.stack, null); v.stack = { kind: 'berries', n: 1 }; assert.equal(deliverToSite(v), false, 'berries build nothing'); v.stack = null;
  // The woodpile keeps the night's wood: at WOOD_PER_NIGHT nothing can be spared.
  v.stores.wood = WOOD_PER_NIGHT; v.stores.water = 0; assert.equal(siteWants(v), null, 'nothing to spare yet'); v.stores.water = 10; assert.equal(siteWants(v), 'water');
  v.stores.wood = 12; assert.equal(siteWants(v), 'wood');
  let fetched = false, carriedToHut = false, built = false; const feed = () => { v.stores.berries = 8; v.stores.milk = 8; v.stores.grain = 12; v.stores.water = Math.max(v.stores.water, 6); v.stores.wood = Math.max(v.stores.wood, 10); };
  for (let t = 0; t < DT * 3 && v.huts === 0; t++) { feed(); step(v, 1); for (const s of v.hobbits) { if (s.job === 'build' && s.errand === 'fetch') fetched = true; if (s.errand === 'hut' && s.carry) carriedToHut = true; if (s.job === 'build' && s.activity === 'working' && thought(s, v.tick) === 'building the new hut') built = true; } }
  assert.ok(fetched && carriedToHut && built, `fetched ${fetched}, carried ${carriedToHut}, built ${built}`); assert.equal(v.huts, 1, 'a hut stands within days'); assert.equal(v.site, null); assert.ok(v.events.some(e => e.text.startsWith('A new hut stands: house 7')), JSON.stringify(v.events.map(e => e.text)));
  assert.equal(housesOf(v).length, 7); assert.ok(v.hobbits.every(s => s.job !== 'build'), 'the builders freed');
  const back = par(ser(v)); assert.equal(back.huts, 1); assert.equal(ser(back), ser(v), 'the hut survives a save');
});
test('G1: more people than beds and the village sets its own stakes at dawn; a grown newcomer moves out of a crowded house to one with a bed free; deterministic', () => {
  const v = freshV(2); while (v.hobbits.length <= housesOf(v).length * BEDS) assert.ok(bear(v)); assert.ok(crowded(v));
  step(v, DT - (v.tick % DT)); assert.ok(v.site && !v.site.asked, 'the stakes set at dawn'); assert.ok(v.events.some(e => e.text.includes('is crowded')), JSON.stringify(v.events.map(e => e.text)));
  const w = freshV(2); while (w.hobbits.length <= housesOf(w).length * BEDS) bear(w); step(w, DT - (w.tick % DT)); assert.equal(ser(w), ser(v), 'deterministic');
  // Grown, a newcomer in a house past its beds leaves for a house with a bed free.
  const full = freshV(3); const kid = NEWCOMERS[0]; full.hobbits.push({ ...full.hobbits[0], id: kid.id, home: 0, stage: 'grown', born: -10 * DT }); assert.equal(living(full, 0).length, 3); const emptiest = housesOf(full).filter(h => h.id !== 0).sort((a, b) => living(full, a.id).length - living(full, b.id).length || a.id - b.id)[0];
  step(full, DT); const moved = full.hobbits.find(s => s.id === kid.id)!; assert.equal(moved.home, emptiest.id, 'moved out to the emptiest house'); assert.ok(full.events.some(e => e.text.includes('moves out to house')));
});

// G2: the village as a hub (EXPANSION.md).
test('G2: the village\'s state is a read-off: steady at first, thriving after fed days, pressured by a spoiled place or a short woodpile, besieged by infants at the lair or the blight near, lost with nobody; told as a banner when it changes', () => {
  const v = freshV(1); assert.equal(villageState(v).kind, 'steady', 'the first morning');
  step(v, DT * 3); assert.equal(villageState(v).kind, 'thriving', `three fed days (${JSON.stringify(villageState(v))})`); assert.ok(v.events.some(e => e.text === 'The village is thriving' && e.banner), 'told as a banner');
  spoil(v, 'thicket'); const st = villageState(v); assert.equal(st.kind, 'pressured'); assert.ok(st.needs.includes('the thicket spoiled'), st.needs.join(', ')); assert.equal(stateText(st), 'The village is pressured: the thicket spoiled');
  v.land.spoiled.thicket = 0; v.stores.wood = 2; assert.ok(villageState(v).needs.includes('wood for the fire')); v.stores.wood = 12;
  v.bred.push({ id: NEWCOMERS[0].id, home: 0, born: 0 }); assert.equal(villageState(v).kind, 'besieged'); assert.ok(villageState(v).needs.includes('1 infant at the lair')); v.bred = [];
  v.lastRaidEaten = 8; assert.equal(villageState(v).kind, 'besieged'); assert.ok(villageState(v).needs.includes('the Dark Young ate a meal')); v.lastRaidEaten = 0;
  setLair({ x: 300, z: 300, radius: 75 }); try { v.blight = 300; assert.equal(villageState(v).kind, 'besieged', 'the blight near'); v.blight = 0; } finally { setLair(null); }
  spoil(v, 'thicket'); step(v, 40); assert.ok(v.events.some(e => e.text.startsWith('The village is pressured') && e.banner), JSON.stringify(v.events.map(e => e.text)));
  const w = freshV(1); w.hobbits = []; assert.equal(villageState(w).kind, 'lost');
});
test('G2: rumor at the fire: the elder tells the condition, the keeper the omens with a bearing from the green; what is said is kept, with the bearing, and survives a save; deterministic', () => {
  setLair({ x: 283, z: 283, radius: 75 });
  try {
    const v = freshV(2); const r = rumors(v); const lair = r.find(x => x.about === 'lair')!; assert.ok(lair && lair.who === 'keeper' && Math.abs(lair.bearing! - 135) < 1 && lair.text.endsWith('south-east'), JSON.stringify(lair));
    const karst = r.find(x => x.about === 'karst')!; assert.ok(karst && karst.text.includes('north'), JSON.stringify(karst)); assert.ok(!r.some(x => x.about === 'blight'), 'no blight, no black trees');
    v.blight = 80; assert.ok(rumors(v).some(x => x.about === 'blight' && x.text.includes('south-east'))); v.blight = 0;
    spoil(v, 'thicket'); assert.ok(rumors(v).some(x => x.who === 'elder' && x.text === 'the thicket has gone bad')); v.land.spoiled.thicket = 0;
    assert.equal(bearingWords(0), 'north'); assert.equal(bearingWords(44), 'north-east'); assert.equal(bearingWords(270), 'west'); assert.equal(bearingWords(359), 'north');
    const u = freshV(2); step(u, PHASES[3][1] + 5); assert.ok(u.voiced.length >= 1, 'said at noon'); assert.ok(u.voiced.every(x => typeof x.by === 'string' && x.tick > 0));
    const said = u.voiced.filter(x => x.bearing !== undefined); for (const x of said) assert.ok(x.about && x.who === 'keeper', JSON.stringify(x));
    const odo = u.voiced.filter(x => x.by === 'odo'); for (const x of odo) assert.ok(x.who === 'elder' || !x.who, `the elder tells the condition (${JSON.stringify(x)})`);
    const back = par(ser(u)); assert.equal(ser(back), ser(u), 'what was said survives a save'); assert.deepEqual(back.voiced, u.voiced);
    const same = freshV(2); step(same, u.tick); assert.equal(ser(same), ser(u), 'deterministic');
  } finally { setLair(null); }
});
test('G2: a hint on the map from talk: one per subject, none for a place already known, gone when she finds it; saved', () => {
  const o = freshOverworld(1); assert.equal(addHint(o, { about: 'karst', bearing: 350, text: 'the pillar stands to the north' }), false, 'the karst is known from the start');
  assert.ok(addHint(o, { about: 'lair', bearing: 135, text: 'something walks in the wood to the south-east' })); assert.equal(addHint(o, { about: 'lair', bearing: 140, text: 'the trees to the south-east have gone black' }), false, 'one per subject, the newer words kept'); assert.equal(o.hints.length, 1); assert.equal(o.hints[0].bearing, 140);
  const back = parseOverworld(serializeOverworld(o)); assert.deepEqual(back.hints, o.hints, 'saved');
  const lair = places(1).find(p => p.id === 'lair')!; explore(o, lair.x, lair.z); assert.ok(o.known.has('lair')); assert.equal(o.hints.length, 0, 'found, the hint is gone'); assert.equal(addHint(o, { about: 'lair', bearing: 135, text: 'x' }), false);
});

// G3a: the danger field, the dens and their wolves (EXPANSION.md).
test('G3a: danger is distance from the nearest karst; dens fall by the seed where it is high, never in the safe ground, the village, the karst or the forest; deterministic; known when seen; saved', () => {
  assert.equal(danger(KARST_AT.x, KARST_AT.z), 0); assert.equal(danger(KARST_AT.x + DANGER_SAFE - 1, KARST_AT.z), 0, 'none within the safe ground'); assert.equal(danger(KARST_AT.x, KARST_AT.z + DANGER_FAR + 10), 1, 'full far out');
  let last = 0; for (let d = 0; d <= 1400; d += 100) { const g = danger(KARST_AT.x + d, KARST_AT.z); assert.ok(g >= last, 'rises with distance'); last = g; }
  assert.ok(danger(0, 0) < 0.15, `the village is mildly exposed (${danger(0, 0).toFixed(2)})`);
  const ds = dens(1); assert.ok(ds.length > 5, `dens on the land (${ds.length})`); assert.deepEqual(dens(1), ds, 'deterministic'); assert.notDeepEqual(dens(2).map(d => d.id), ds.map(d => d.id), 'by the seed');
  const lair = places(1).find(p => p.id === 'lair')!;
  for (const d of ds) { assert.ok(Math.hypot(d.x, d.z) >= 44 + DEN_CLEAR, 'clear of the village'); assert.ok(Math.hypot(d.x - KARST_AT.x, d.z - KARST_AT.z) >= 100 + DEN_CLEAR, 'clear of the karst'); assert.ok(Math.hypot(d.x - lair.x, d.z - lair.z) >= FOREST_RADIUS + DEN_CLEAR, 'clear of the forest'); assert.ok(d.tier >= 1 && d.tier <= 3 && d.pack === PACK_BASE + d.tier); assert.ok(danger(d.x, d.z) > 0, 'never in the safe ground'); }
  const near = ds.filter(d => danger(d.x, d.z) < 0.35).length, far = ds.filter(d => danger(d.x, d.z) > 0.65).length; assert.ok(far > near, `more dens where the danger is high (${near} near, ${far} far)`);
  const o = freshOverworld(1); const d0 = ds[0]; explore(o, d0.x, d0.z); assert.ok(o.known.has(d0.id), 'a den seen is known'); const back = parseOverworld(serializeOverworld(o)); assert.ok(back.known.has(d0.id), 'saved'); assert.ok(knownPlaces(back).some(p => p.id === d0.id && p.kind === 'den'));
});
test('G3a: a den in reach sends its pack down at dusk; villagers out of doors run home, one caught is bitten and weakened, never killed; her strike kills a wolf; the pack slain, the den lies quiet, then comes back a wolf a day; no den in reach, no wolves; saved', () => {
  setDens([{ id: 'den-1,1', x: 300, z: 300, pack: 3 }]);
  try {
    const v = freshV(1); assert.equal(densInReach().length, 1); assert.ok(rumors(v).some(r => r.about === 'den-1,1' && r.text === 'wolves howl to the south-east' && r.who === 'keeper'), 'the keeper says where the wolves are'); setDens([{ id: 'den-2,2', x: 700, z: 700, pack: 3 }]); assert.ok(rumors(v).some(r => r.about === 'den-2,2' && r.text === 'wolves howl far to the south-east'), 'and names the nearest den beyond reach'); setDens([{ id: 'den-1,1', x: 300, z: 300, pack: 3 }]); assert.ok(villageState(v).needs.includes('wolves at dusk')); assert.equal(villageState(v).kind, 'pressured');
    step(v, WOLF_TICK + 1); assert.equal(wolves(v).length, 3, 'the pack at dusk'); assert.ok(v.events.some(e => e.text === 'Wolves come down from the south-east at dusk' && e.banner), JSON.stringify(v.events.map(e => e.text))); assert.ok(wolves(v).every(w => w.kind === 'wolf' && w.den === 'den-1,1' && w.hp === WOLF_HP));
    const out = v.hobbits.find(s => !s.inside && s.stage !== 'infant')!; assert.ok(out, 'someone still out at dusk'); const w0 = wolves(v)[0]; w0.x = out.x + 0.5; w0.z = out.z;
    stepRaiders(v, 0.25, null); step(v, 1); assert.equal(out.errand, 'flee', 'they run for the door'); assert.equal(thought(out, v.tick), 'wolves!');
    const missed0 = out.missed; let bit = false; for (let i = 0; i < 20 && !bit; i++) { w0.x = out.x + 0.3; w0.z = out.z; stepRaiders(v, 0.3, null); if (out.missed > missed0) bit = true; } assert.ok(bit, 'bitten'); assert.equal(out.missed, Math.min(DEATH_MEALS - 1, missed0 + WOLF_BITE_MEALS)); assert.ok(v.bitten >= 1); assert.ok(v.events.some(e => e.text.endsWith('is bitten by a wolf')));
    for (let i = 0; i < 40 && !out.inside; i++) step(v, 1); assert.ok(out.inside, 'home and in'); assert.ok(out.missed < DEATH_MEALS, 'the bite never kills');
    // Her strike: a wolf dies; the pack slain, the den lies quiet.
    const slain0 = v.slain, xp0 = v.hero.xp; for (const w of wolves(v)) { let n = 0; while (w.state !== 'dead' && n++ < 20) strike(v, { x: w.x, z: w.z }, 1, 0); assert.equal(w.state, 'dead', 'a wolf dies'); }
    assert.equal(v.slain, slain0 + 3); assert.ok(v.hero.xp > xp0); const st = v.dens['den-1,1']; assert.equal(st.alive, 0); assert.equal(st.quietDay, Math.floor(v.tick / DT) + DEN_PEACE_DAYS); assert.ok(v.events.some(e => e.text === 'The pack is slain: the den lies quiet' && e.banner));
    assert.ok(!villageState(v).needs.includes('wolves at dusk'), 'quiet');
    const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the dens and the wolves survive a save'); assert.deepEqual(back.dens, v.dens);
    step(v, DT - (v.tick % DT) + 1); assert.ok(v.lastBitten >= 1, 'the night\'s bites kept at dawn'); assert.equal(villageState(v).kind, 'besieged'); step(v, WOLF_TICK); assert.equal(wolves(v).length, 0, 'no wolves while the den is quiet');
    for (let d = 0; d < DEN_PEACE_DAYS + 1; d++) step(v, DT); assert.ok(v.dens['den-1,1'].alive >= 1, 'a wolf a day comes back after the peace');
  } finally { setDens([]); }
  const q = freshV(1); step(q, WOLF_TICK + 1); assert.equal(wolves(q).length, 0, 'no den in reach, no wolves'); assert.ok(!villageState(q).needs.includes('wolves at dusk'));
});
