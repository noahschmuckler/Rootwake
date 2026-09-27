import { test } from 'node:test';
import assert from 'node:assert/strict';
import { denLayout, floorAt, insideDen, hallLines, MOUTH_OUT, HALL_RUNS, HALL_SLOPE, FLOOR_DROP, ROOF_RISE, CHAMBER_FLOOR } from '../src/denModel';
import { dens } from '../src/overworldModel';
import { createTerrain } from '../src/worldTerrain';
const flat = (): number => 10;
test('the den generator: from the mound\'s mouth a hall of a few runs slips down into a chamber, and as the dice fall on to a deeper one; the same den each time, every den its own', () => {
  const t = createTerrain(1), all = dens(1); assert.ok(all.length >= 3, 'dens to delve');
  const layouts = all.map(d => denLayout(d, 1, t.height));
  for (const [i, d] of layouts.entries()) {
    assert.deepEqual(denLayout(all[i], 1, t.height), d, 'the same den each time'); assert.ok(d.halls.length >= HALL_RUNS[0] && d.chambers.length >= 1, `${d.id}: halls and a chamber`);
    assert.ok(Math.abs(Math.hypot(d.mouth.x - d.x, d.mouth.z - d.z) - MOUTH_OUT) < 1e-9 && Math.abs(d.mouth.y - d.halls[0].r * FLOOR_DROP - t.height(d.mouth.x, d.mouth.z)) < 1e-9, 'the mouth at the mound\'s edge, its floor on the surface');
    for (const h of d.halls) { assert.ok(h.b.y < h.a.y, `${d.id}: every run slips down`); const len = Math.hypot(h.b.x - h.a.x, h.b.z - h.a.z); assert.ok((h.a.y - h.b.y) / len <= HALL_SLOPE[1] + 1e-9, 'no steeper than the slope'); }
    assert.equal(d.halls[0].a, d.mouth, 'the first run starts at the mouth'); { const a = Math.atan2(d.halls[0].b.z - d.halls[0].a.z, d.halls[0].b.x - d.halls[0].a.x); assert.ok(Math.abs(Math.atan2(Math.sin(a - d.dir), Math.cos(a - d.dir))) < 1e-9, 'and runs the way the mouth faces'); }
    assert.equal(d.chambers.filter(c => c.deepest).length, 1, 'one deepest chamber'); for (const c of d.chambers) assert.ok(c.c.y - c.h * CHAMBER_FLOOR < d.y - 2, `${d.id}: a chamber's floor well under the surface`);
    assert.ok(d.depth >= 2 && d.depth < 30 && d.reach > MOUTH_OUT && d.reach < 80, `bounded (${d.depth.toFixed(1)} m down, ${d.reach.toFixed(0)} m out)`);
    // The ground: the floor at the mouth is the surface; along the first run it drops; off the hall there is none; the roof rides above the floor.
    const m = floorAt(d, d.mouth.x, d.mouth.z)!; assert.ok(m && Math.abs(m.floor - t.height(d.mouth.x, d.mouth.z)) < 1e-9 && m.roof - m.floor > 1.2, 'the floor at the mouth is the land, a roof above it');
    const h0 = d.halls[0], mid = { x: (h0.a.x + h0.b.x) / 2, z: (h0.a.z + h0.b.z) / 2 }, f = floorAt(d, mid.x, mid.z)!; assert.ok(f && f.floor < m.floor, 'lower along the run'); assert.ok(Math.abs(f.roof - f.floor - h0.r * (FLOOR_DROP + ROOF_RISE)) < 1e-9);
    const side = { x: mid.x - (h0.b.z - h0.a.z) / Math.hypot(h0.b.x - h0.a.x, h0.b.z - h0.a.z) * 4, z: mid.z + (h0.b.x - h0.a.x) / Math.hypot(h0.b.x - h0.a.x, h0.b.z - h0.a.z) * 4 }; assert.equal(floorAt(d, side.x, side.z), null, 'nothing four metres off the hall'); assert.equal(floorAt(d, d.x + 500, d.z), null);
    const c = d.chambers[0]; assert.ok(floorAt(d, c.c.x, c.c.z)!.floor <= c.c.y - c.h * CHAMBER_FLOOR + 1e-9, 'the chamber\'s floor'); assert.ok(insideDen(d, c.c.x, c.c.y, c.c.z) && !insideDen(d, c.c.x, c.c.y + c.h * 2, c.c.z), 'inside the hollow, not above it');
    assert.ok(hallLines(d).length >= 1 && hallLines(d)[0][0] === d.mouth, 'the lines start at the mouth');
  }
  const shapes = layouts.map(d => `${d.halls.length}:${d.chambers.length}:${d.dir.toFixed(3)}:${d.depth.toFixed(2)}:${d.reach.toFixed(2)}`); assert.equal(new Set(shapes).size, shapes.length, `every den its own (${shapes.join(' ')})`);
  assert.notEqual(denLayout(all[0], 2, t.height).dir, layouts[0].dir, 'and by the seed');
  // A den of the second tier always goes on to a second chamber.
  const deep = denLayout({ id: 'den-x', x: 0, z: 0, tier: 2 }, 3, flat); assert.equal(deep.chambers.length, 2); assert.ok(deep.chambers[1].c.y < deep.chambers[0].c.y, 'the second deeper');
});
