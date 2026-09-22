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
  advance(v, 200); assert.equal(everyone(v, 'inside'), 0, 'all out by morning'); assert.ok(v.hobbits.every(s => s.activity === 'working' || s.activity === 'walking' || s.activity === 'talking'));
  for (const s of v.hobbits) { const h = hobbitById(s.id), site = SITES[h.keeps]; assert.ok(s.errand !== null || s.path.length > 0 || Math.hypot(s.x - site.x, s.z - site.z) <= site.radius + 0.3, `${h.name} is ${h.keeps === 'fire' ? 'at the fire' : site.verb} (or on an errand to a store and back)`); }
  advance(v, 420 - 200); assert.ok(everyone(v, 'green') >= 7, `${everyone(v, 'green')} on the green at one o'clock`); assert.ok(v.hobbits.filter(s => s.activity === 'talking').length >= 6);
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
  assert.ok(grassCan(5, -14)); assert.equal(grassCan(0, STREAM_Z(0)), false, 'not under the water'); assert.ok(inWater(3, STREAM_Z(3))); assert.equal(grassCan(9 * Math.cos(0.3), 9 * Math.sin(0.3)), false, 'not under a house'); assert.equal(grassCan(MEADOW_RADIUS + 40, 0), false);
  for (const t of TREES) assert.ok(!inWater(t.x, t.z), 'no tree in the stream');
  assert.ok(hopTargets(copse[0]).length >= 1, 'the copse has crowns to leap to'); assert.equal(nearestTree(copse[2].x + 0.5, copse[2].z).tree.id, copse[2].id);
});
test('thoughts are always there: what they are doing, where they are going, and the chatter while it lasts', () => {
  const v = fresh(1); run(v, 30); const pip = v.hobbits.find(s => s.id === 'pip')!; assert.ok(['walking to the stream', 'fetching water'].includes(thought(pip, v.tick)), thought(pip, v.tick));
  run(v, 170); for (const s of v.hobbits) { const h = byId(s.id); assert.equal(thought(s, v.tick), h.keeps === 'fire' ? 'keeping the fire' : S2[h.keeps].verb, `${h.name} at work`); }
  run(v, 340 - 200); const going = v.hobbits.filter(s => thought(s, v.tick) === 'walking to the fire' || thought(s, v.tick) === 'talking by the fire' || thought(s, v.tick) === 'keeping the fire'); assert.ok(going.length >= 7, `${going.length} bound for the fire`);
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

import { STORES, STORE_LIST, FOODS, YIELD_OF, BERRY_CAP, BERRY_REGROW, BRANCHES_PER_DAY, MILK_PER_DAY, CROP_DAYS, GRAIN_PER_STRIP, WOOD_PER_NIGHT, CARRY, landStock, fullestFood, balance, inFlight, storeSpot, DAY_TICKS as DT, freshVillage as freshV, advance as step, thought as think, hobbitById as who, serializeVillage as ser, parseVillage as par } from '../src/villageModel';
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
  assert.ok(carried > 20, `Tansy carries berries for a while (${carried} ticks)`); assert.ok(maxCarry <= CARRY.berries, 'an armful at most'); assert.ok(delivered >= 1, 'and hands over at the baskets at least once');
  assert.ok(v.stores.berries >= before.berries, 'the baskets fill'); for (const k of STORE_LIST) assert.ok(v.stores[k] <= STORES[k].cap + 1e-9, `${k} never over its cap`);
  assert.ok(v.land.berries < BERRY_CAP, 'the bushes are picked'); assert.ok(v.take.berries > 0 && v.take.milk > 0 && v.take.wood > 0 && v.take.water > 0, `the day's take is counted ${JSON.stringify(v.take)}`);
  // Two gatherers do not both fill the last of the room: what is in flight counts.
  const w = freshV(1); w.stores.berries = STORES.berries.cap - 2; step(w, 300); assert.ok(w.stores.berries <= STORES.berries.cap, 'no overflow lost');
  assert.ok(inFlight(w, 'berries') <= STORES.berries.cap - w.stores.berries + 1e-9 || w.hobbits.every(s => s.carry?.kind !== 'berries'), 'in flight fits the room');
  const sp = storeSpot(STORES.berries); assert.ok(Math.hypot(sp.x, sp.z) < Math.hypot(STORES.berries.x, STORES.berries.z), 'one stands a step in from the store');
});
test('two meals a day from the fullest store by share: noon at the fire with water, supper fetched on the way home; hunger falls at each; the fire burns the wood Odo lays', () => {
  const v = freshV(1); const food = () => FOODS.reduce((n, f) => n + v.stores[f], 0);
  step(v, 340); const f0 = food(), w0 = v.stores.water; let sawEating = 0; for (let t = 340; t < 430; t++) { step(v, 1); sawEating += v.hobbits.filter(s => s.activity === 'eating').length; }
  assert.ok(v.hobbits.every(s => s.ateDay === 0), 'everyone ate at noon'); assert.ok(f0 - food() + v.take.berries + v.take.milk + v.take.grain >= 8, 'eight units gone to the noon meal (before what was gathered)'); assert.ok(sawEating >= 8 * 10, `eating is an activity seen for a while (${sawEating} hobbit-ticks)`);
  assert.ok(v.stores.water < w0 + v.take.water, 'water drunk at noon');
  step(v, 700 - 430); assert.equal(v.fireWood, 0, 'no wood on the fire before Odo fetches it'); const odo = () => v.hobbits.find(s => s.id === 'odo')!;
  let fetched = false; for (let t = 700; t < 745; t++) { step(v, 1); if (odo().carry?.kind === 'wood') fetched = true; } assert.ok(fetched, 'Odo carries wood to the fire'); assert.ok(v.fireWood >= WOOD_PER_NIGHT - 1e-9, `the fire has its wood (${v.fireWood})`);
  let supper = 0; for (let t = 745; t < 830; t++) { step(v, 1); for (const s of v.hobbits) if (s.errand === 'supper' || (s.activity === 'returning' && s.carry?.n === 1)) supper++; } assert.ok(supper > 0, 'supper is fetched from the stores on the way home');
  assert.ok(v.hobbits.every(s => s.inside && s.hunger < 0.2), 'home, fed, hunger low'); step(v, DT - 830); assert.ok(v.fireWood < 0.05, 'the wood is burnt by dawn');
  const hungry = freshV(1); step(hungry, 330); for (const k of FOODS) hungry.stores[k] = 0; hungry.land.berries = 0; hungry.land.milk = 0; hungry.land.crops = hungry.land.crops.map(() => 0); for (const s of hungry.hobbits) { s.carry = null; s.errand = null; }
  let missed = false; for (let t = 0; t < 100; t++) { step(hungry, 1); if (hungry.hobbits.some(s => s.bubble === 'nothing to eat')) missed = true; }
  assert.ok(missed, 'with empty stores the noon meal is missed and says so'); assert.equal(fullestFood(hungry), null); assert.ok(hungry.hobbits.every(s => s.hunger > 0.3), 'no one was fed');
});
test('left alone the village holds: eight days on, the stores are never empty at a meal, the thicket stays near full, the take is under the regrowth, no one starves', () => {
  const v = freshV(3); let minFood = Infinity, maxHunger = 0;
  for (let d = 0; d < 8; d++) for (let t = 0; t < DT; t++) { step(v, 1); if (t === 400 || t === 760) minFood = Math.min(minFood, FOODS.reduce((n, f) => n + v.stores[f], 0)); for (const s of v.hobbits) maxHunger = Math.max(maxHunger, s.hunger); }
  assert.ok(minFood >= 8, `food in the stores at every meal (${minFood})`); assert.ok(v.land.berries > BERRY_CAP * 0.6, `the thicket near full (${v.land.berries.toFixed(1)})`); assert.ok(balance(v) < 1, `take under regrowth (${balance(v).toFixed(2)})`);
  assert.ok(maxHunger < 0.9, `nobody goes hungry (${maxHunger.toFixed(2)})`); assert.ok(v.stores.wood >= WOOD_PER_NIGHT, 'wood for the night in the pile');
  assert.ok(v.land.crops.some(c => c >= 0.9) || v.lastTake.grain > 0, 'the field yields in its turn');
  const same = freshV(3); step(same, 8 * DT); assert.equal(ser(same), ser(v), 'deterministic');
  const back = par(ser(v)); assert.equal(ser(back), ser(v), 'the stores, the land and the armfuls survive a save');
  assert.deepEqual(Object.keys(YIELD_OF).sort(), ['copse', 'field', 'pen', 'stream', 'thicket'], 'every working place feeds one store');
  assert.equal(GRAIN_PER_STRIP, CARRY.grain, 'a strip is one armful');
});
