// T9 (PLATEAU.md): the overworld map's pure parts: the atlas's extent and the tiles a view needs, the zoom's bounds and clamp, the fog's cells from the revealed set, the contours and the colour ramp.
import { test } from 'node:test'; import assert from 'node:assert/strict';
import { mapExtent, tilesInView, zoomBounds, clampZoom, fogGrid, contourAt, contourBold, landRgb, MAP_MAX, WORLD_SPAN, TILE_M, TILE_PX, BASE_PX_PER_M, MAP_REACH, CONTOUR_M, CONTOUR_BOLD, PALETTE, type LandSample } from '../src/overworldMap';
import { plateau, PLATEAU_R, MOUNTAIN_RISE, CLOUD_Y } from '../src/plateauModel';
import { CELL, cellKey, cellOf, explore, freshOverworld } from '../src/overworldModel';

const sample = (over: Partial<LandSample> = {}): LandSample => ({ h: 20, slope: 0.05, shade: 0.7, ao: 1, needles: 0, leaves: 0, moss: 0, sand: 0, forest: 0, meadow: 0, wood: 0, dark: 0, shore: 0, into: -500, contour: 0, bold: false, ...over });
const rgb = (s: LandSample, waterY = -1.2, snowY = 470): number[] => Array.from(landRgb(s, waterY, snowY, new Float64Array(3)));
const lum = (c: number[]): number => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

test('the extent: a square of whole tiles about the plateau\'s centre, reaching past the belt\'s crest, TILE_PX px a tile at BASE_PX_PER_M', () => {
  const ext = mapExtent(1), C = plateau(1).centre;
  assert.equal(TILE_M, TILE_PX / BASE_PX_PER_M); assert.equal(ext.tiles, Math.ceil(2 * MAP_REACH / TILE_M)); assert.equal(ext.size, ext.tiles * TILE_M);
  assert.equal(ext.x0, C.x - MAP_REACH); assert.equal(ext.z0, C.z - MAP_REACH);
  assert.ok(MAP_REACH > PLATEAU_R + MOUNTAIN_RISE, 'the crest is inside the map'); assert.ok(ext.tiles * TILE_PX <= 2400, `the atlas stays a phone's size (${ext.tiles * TILE_PX} px)`);
});
test('the tiles a view touches: the one under a point, the block under a rectangle, none past the extent', () => {
  const ext = mapExtent(1), m = TILE_M;
  assert.deepEqual(tilesInView(ext, ext.x0 + 1, ext.z0 + 1, ext.x0 + 1, ext.z0 + 1), [{ i: 0, j: 0 }]);
  assert.deepEqual(tilesInView(ext, ext.x0 + m * 2.5, ext.z0 + m * 1.5, ext.x0 + m * 3.5, ext.z0 + m * 2.5), [{ i: 2, j: 1 }, { i: 3, j: 1 }, { i: 2, j: 2 }, { i: 3, j: 2 }]);
  assert.deepEqual(tilesInView(ext, ext.x0 - 5000, ext.z0 - 5000, ext.x0 - 4000, ext.z0 - 4000), []);
  const all = tilesInView(ext, -1e6, -1e6, 1e6, 1e6); assert.equal(all.length, ext.tiles * ext.tiles, 'a view over everything needs every tile');
});
test('the zoom: the floor fits the plateau and its belt into the shorter side, the ceiling is MAP_MAX, and the clamp holds both', () => {
  const b = zoomBounds(390, 844); assert.ok(Math.abs(b.min - 390 / WORLD_SPAN) < 1e-12); assert.equal(b.max, MAP_MAX);
  assert.equal(clampZoom(0.6, b), 0.6); assert.equal(clampZoom(0.001, b), b.min); assert.equal(clampZoom(50, b), MAP_MAX);
  assert.ok(0.6 > b.min && 0.6 < b.max, 'the opening scale lies within the bounds on a phone');
  assert.equal(zoomBounds(100000, 100000).min, MAP_MAX, 'a viewport that would fit the world above the ceiling is held at it');
});
test('the fog: a revealed cell is 255 at its place in the grid, its neighbours 0, and exploring adds cells in place', () => {
  const ext = mapExtent(1), o = freshOverworld(1), g0 = fogGrid(ext, o.revealed);
  assert.ok(g0.x0 <= ext.x0 && g0.z0 <= ext.z0 && g0.x0 % CELL === 0, 'the grid starts on a cell corner at or before the extent'); assert.ok(g0.cells * CELL >= ext.size, 'and covers it');
  assert.equal(g0.data.reduce((a, b) => a + b, 0), 0, 'nothing revealed, nothing in the grid');
  const at = (g: ReturnType<typeof fogGrid>, x: number, z: number): number => { const c = cellOf(x, z); return g.data[(c.cz - g.z0 / CELL) * g.cells + (c.cx - g.x0 / CELL)]; };
  o.revealed.add(cellKey(3, -2)); const g1 = fogGrid(ext, o.revealed);
  assert.equal(at(g1, 3 * CELL + 1, -2 * CELL + 1), 255); assert.equal(at(g1, 4 * CELL + 1, -2 * CELL + 1), 0); assert.equal(at(g1, 3 * CELL + 1, -1 * CELL + 1), 0);
  const n = explore(o, 100, 100, 70), g2 = fogGrid(ext, o.revealed); assert.ok(n > 20); assert.equal(g2.data.reduce((a, b) => a + (b ? 1 : 0), 0), o.revealed.size, 'every revealed cell within the extent is in the grid');
  assert.equal(at(g2, 100, 100), 255); assert.equal(at(g2, 100 + 200, 100), 0, 'past the explored radius');
  o.revealed.add(cellKey(100000, 100000)); assert.doesNotThrow(() => fogGrid(ext, o.revealed), 'a cell past the extent is ignored');
});
test('the contours: a line every CONTOUR_M, about a pixel wide, bold every CONTOUR_BOLD, faded where they would crowd', () => {
  assert.equal(contourAt(40, 0.5), 1, 'on a line'); assert.equal(contourAt(50, 0.5), 0, 'between lines');
  assert.ok(contourAt(40.2, 0.5) > 0.4 && contourAt(40.2, 0.5) < 1, 'the edge of a line is soft'); assert.equal(contourAt(42, 0.5), 0, 'and not wide: 2 m off at half a metre a pixel is 4 px away');
  assert.equal(contourAt(40, 10), 0, 'crowded lines (2 px apart) fade out'); assert.equal(contourAt(40, 0), 0, 'flat ground at a line\'s height draws none'); assert.equal(contourAt(0, 0.001), 0, 'nor nearly flat'); assert.ok(contourAt(40, 3) > 0 && contourAt(40, 3) < 1, 'and fade in between');
  assert.equal(contourBold(100), true); assert.equal(contourBold(120), false); assert.equal(contourBold(CONTOUR_BOLD * 3 + CONTOUR_M * 0.3), true, 'the nearest line decides');
});
test('the colour ramp: water blue under the surface, the meadow greener than the heath, the stand darker, the taint purple, rock grey on the belt and on steep ground, snow white above the line, the cloud pale over the lowland, the shade lighting it', () => {
  const water = rgb(sample({ h: -3, shore: 1 })); assert.ok(water[2] > water[0] + 40, 'blue'); assert.ok(lum(rgb(sample({ h: -12, shore: 1 }))) < lum(water), 'deeper is darker'); assert.ok(rgb(sample({ h: -3, shore: 0 }))[2] < rgb(sample({ h: -3, shore: 0 }))[1], 'low ground away from the lake is land, not water');
  const heath = rgb(sample()), meadow = rgb(sample({ meadow: 1 })), stand = rgb(sample({ wood: 1, forest: 1 }));
  assert.ok(meadow[1] > heath[1] && lum(meadow) > lum(heath), 'the meadow brighter and greener'); assert.ok(lum(stand) < lum(heath) && stand[1] > stand[0] && stand[1] > stand[2], 'a stand dark and green');
  const floor = rgb(sample({ wood: 1, forest: 0.8, needles: 0.9 })); assert.ok(floor[0] > stand[0], 'needles warm the floor');
  const dark = rgb(sample({ dark: 0.7 })), heart = rgb(sample({ dark: 1 })); assert.ok(dark[2] > dark[1] && lum(dark) < lum(heath), 'the taint purple and dark'); assert.ok(lum(heart) < lum(dark), 'darker at the breach');
  const rock = rgb(sample({ h: 300, into: 300 })); assert.ok(Math.abs(rock[0] - rock[1]) < 12 && Math.abs(rock[1] - rock[2]) < 20, 'rock is grey'); assert.ok(Math.abs(rgb(sample({ slope: 1.5 }))[0] - rgb(sample({ slope: 1.5 }))[1]) < 12, 'steep ground too');
  const snow = rgb(sample({ h: 520, into: 400 })); assert.ok(snow.every(c => c > 180), 'snow is white');
  const cloud = rgb(sample({ h: CLOUD_Y - 200, into: 1200, shade: 0 })); assert.ok(cloud.every(c => c > 170) && Math.abs(cloud[0] - cloud[2]) < 20, 'the cloud sea is pale and flat, whatever the shade');
  assert.ok(lum(rgb(sample({ shade: 1 }))) > lum(rgb(sample({ shade: 0 }))), 'lit slopes brighter'); assert.ok(lum(rgb(sample({ ao: 0.2 }))) < lum(heath), 'creases darker');
  assert.ok(lum(rgb(sample({ contour: 1 }))) < lum(heath) && lum(rgb(sample({ contour: 1, bold: true }))) < lum(rgb(sample({ contour: 1 }))), 'a contour darkens, a bold one more');
  assert.ok(rgb(sample({ h: 0.3, shore: 1 }))[0] > heath[0] + 20, 'the shore by the lake is sand'); assert.ok(rgb(sample({ h: 0.3, shore: 0 }))[0] < heath[0] + 8, 'and inland low ground is not');
  assert.ok(Object.values(PALETTE).every(c => c.length === 3 && c.every(v => v >= 0 && v <= 255)));
});
