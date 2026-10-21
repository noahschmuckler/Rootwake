// The vista's scene: terrain tiles that coarsen with distance, a far ring of unaroded mountains to
// the horizon, a lake, a field of wind-blown grass that wraps around the camera, instanced trees
// (full near, a blob far) and rocks, and a painted sky — all on the shaders in vistaShaders.ts,
// lit by one hour (HOURS). Tuning constants are flagged.
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { CircleCollider } from './player';
import { surfaceAt, normalAt, bakeSun, rng, type Land, type Tree, type Rock } from './vistaTerrain';
import { terrainVert, terrainFrag, grassVert, grassFrag, solidVert, solidFrag, cardVert, cardFrag, waterVert, waterFrag, skyVert, skyFrag } from './vistaShaders';
import { spriteTexture, standees, crownStandees, type Standee, type SpriteKind } from './sprites';
import { floorTexture, type FloorName } from './groundTextures';

// ── the hour ────────────────────────────────────────────────────────────
export interface Hour { name: string; elevation: number; azimuth: number; sun: string; sunI: number; zenith: string; horizon: string; ambSky: string; ambGround: string; ambI: number; haze: number; hazeFall: number; cloud: number; exposure: number; stars?: number }
/** Tuning: the four hours offered. Elevation and azimuth in degrees (azimuth 0 = from −z, 90 = from +x). */
export const HOURS: Hour[] = [
  { name: 'Morning', elevation: 14, azimuth: 70, sun: '#ffd9a8', sunI: 2.3, zenith: '#5d8fd0', horizon: '#d8dde0', ambSky: '#b4cbea', ambGround: '#7a7658', ambI: 0.85, haze: 0.0011, hazeFall: 1 / 90, cloud: 0.4, exposure: 1.0 },
  { name: 'Midday', elevation: 58, azimuth: 150, sun: '#fff4e0', sunI: 2.4, zenith: '#3f7fd8', horizon: '#c8def0', ambSky: '#b0cdf2', ambGround: '#7c8656', ambI: 0.9, haze: 0.00042, hazeFall: 1 / 260, cloud: 0.55, exposure: 0.95 },
  // The valley runs north–south: an evening sun from down the valley (south-south-west) keeps its floor lit.
  { name: 'Golden hour', elevation: 12, azimuth: 205, sun: '#ffb070', sunI: 2.7, zenith: '#5a7bbf', horizon: '#f2c9a0', ambSky: '#aab8de', ambGround: '#6e5c48', ambI: 0.88, haze: 0.0006, hazeFall: 1 / 200, cloud: 0.5, exposure: 1.05 },
  { name: 'Dusk', elevation: 2, azimuth: 200, sun: '#ff7a4a', sunI: 1.5, zenith: '#2c3a6e', horizon: '#e79a7c', ambSky: '#7680b0', ambGround: '#443a44', ambI: 0.8, haze: 0.0007, hazeFall: 1 / 200, cloud: 0.45, exposure: 1.2 },
];
export function sunDirection(h: Hour): THREE.Vector3 {
  const e = THREE.MathUtils.degToRad(h.elevation), a = THREE.MathUtils.degToRad(h.azimuth);
  return new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), -Math.cos(a) * Math.cos(e)).normalize();
}

// ── quality ─────────────────────────────────────────────────────────────
export interface Quality { name: string; grass: number; patch: number; shadow: number; shadowBox: number; nearTrees: number; bloom: boolean; dprMin: number; dprMax: number; lod: [number, number, number] }
/** Tuning: the three tiers. grass = tufts of TUFT blades; patch = side of the grass square (m); shadow = map size (0 = off); nearTrees = full-tree radius (m); lod = tile distances for LOD 1/2/3. */
export const QUALITIES: Quality[] = [
  { name: 'Low', grass: 9000, patch: 44, shadow: 0, shadowBox: 0, nearTrees: 110, bloom: false, dprMin: 0.6, dprMax: 1, lod: [200, 450, 900] },
  { name: 'Medium', grass: 22000, patch: 58, shadow: 1024, shadowBox: 38, nearTrees: 170, bloom: true, dprMin: 0.7, dprMax: 1.35, lod: [280, 600, 1100] },
  { name: 'High', grass: 42000, patch: 76, shadow: 2048, shadowBox: 60, nearTrees: 240, bloom: true, dprMin: 0.8, dprMax: 2, lod: [380, 800, 1500] },
];

const color = (hex: string, k = 1) => new THREE.Color(hex).multiplyScalar(k);
/** The layer the shadow-only tree copies live on; the entry enables it on the sun's shadow camera. */
export const CASTER_LAYER = 1;

export interface VistaOptions {
  /** The haze's base height (the lake for the vista; the meadow for the village). */
  hazeBase: number;
  /** The ground tint (rgb colour, a amount) per map sample, as bytes n×n×4: the village's woods and dark forest. */
  ground: Uint8Array;
  /** The exact surface near her, sampled into a fine window the grass stands on. */
  fine: (x: number, z: number) => number;
  /** Grass height (m). */
  bladeH: number;
  /** Trees: the full-tree radius as a share of the tier's, and the reach past which none is drawn (m). A dense wood wants less of both. */
  nearTreesScale: number; treeReach: number;
  /** A finer LOD 0 (half a cell) near her where the land has an exact surface. */
  fineLod: boolean;
  /** PINE BARRENS: the renderer, to draw the far pines' impostor once (without it, the far pine is a card of needles). */
  renderer: THREE.WebGLRenderer;
}
export interface VistaWorld {
  root: THREE.Group;
  /** The hour; `bake: false` rebakes the mountains' shadows over the next frames instead of at once (a moving sun). */
  setHour(h: Hour, bake?: boolean): void;
  setTrees(trees: Tree[]): void;
  setGround(bytes: Uint8Array): void;
  /** FOREST: the canopy over each cell of the land (n×n, 0..255): the grass thins beneath it. */
  setCanopy(bytes: Uint8Array): void;
  /** T4c: what lies on the floor per cell (n×n×4 bytes: needles, leaf mould, moss and peat, bare sand), drawn as tiling textures over the land's colour. */
  setFloor(bytes: Uint8Array): void;
  /** The view through soil while she is beneath it (groundVision's rule). */
  setSoil(amount: number, x: number, z: number): void;
  /** A dark fog over everything (the dark forest). */
  setGloom(colour: THREE.Color, amount: number, density: number): void;
  /** Mask i (0..2): where no grass grows, a texture laid on the square at (x0, z0) of the given side. */
  setClear(i: number, texture: THREE.Texture | null, x0: number, z0: number, side: number): void;
  setQuality(q: Quality): void;
  update(camera: THREE.Camera, timeS: number): void;
  colliders(): CircleCollider[];
  /** Sun visibility (0..1) at a point, from the baked map: dims the sun on Hulda in a mountain's shadow. */
  sunAt(x: number, z: number): number;
  stats(): { tiles: number; nearTrees: number };
  /** The shared uniforms (sun, haze, the maps): for water and other things drawn in the vista's light (the plateau's rivers). */
  uniforms: Record<string, THREE.IUniform>;
}

export function buildVista(scene: THREE.Scene, land: Land, trees: Tree[], rocks: Rock[], quality: Quality, opts: Partial<VistaOptions> = {}): VistaWorld {
  const { n: N, cell: CELL, half: HALF, size: SIZE } = land;
  const root = new THREE.Group(); root.name = 'vista'; scene.add(root); scene = root as unknown as THREE.Scene;
  // ── shared uniforms and textures ──
  // The sun's visibility is baked at half the map's resolution on a big map (the village's): a moving sun rebakes it every few seconds.
  const STRIDE = N > 600 ? 2 : 1, SN = (N - 1) / STRIDE + 1;
  const mapBytes = new Uint8Array(N * N * 4), sun = new Uint8Array(SN * SN), sunBack = new Uint8Array(SN * SN);
  const sunLand: Land = STRIDE === 1 ? land : { ...land, n: SN, cell: CELL * STRIDE, h: (() => { const h = new Float32Array(SN * SN); for (let j = 0; j < SN; j++) for (let i = 0; i < SN; i++) h[j * SN + i] = land.h[j * STRIDE * N + i * STRIDE]; return h; })() };
  const sunTex = new THREE.DataTexture(sun, SN, SN, THREE.RedFormat, THREE.UnsignedByteType); sunTex.magFilter = sunTex.minFilter = THREE.LinearFilter; sunTex.wrapS = sunTex.wrapT = THREE.ClampToEdgeWrapping;
  const groundBytes = new Uint8Array(N * N * 4); if (opts.ground) groundBytes.set(opts.ground);
  const groundTex = new THREE.DataTexture(groundBytes, N, N, THREE.RGBAFormat, THREE.UnsignedByteType); groundTex.magFilter = groundTex.minFilter = THREE.LinearFilter; groundTex.needsUpdate = true;
  const blank = new THREE.DataTexture(new Uint8Array(4), 1, 1); blank.needsUpdate = true;
  /** Tuning: the fine window's side (m) and texels: blades stand on the walked surface within it. */
  const FINE_SIDE = 96, FINE_T = 97, fineData = new Float32Array(FINE_T * FINE_T), fineTex = new THREE.DataTexture(fineData, FINE_T, FINE_T, THREE.RedFormat, THREE.FloatType); fineTex.magFilter = fineTex.minFilter = THREE.NearestFilter;
  let fineAt = new THREE.Vector2(1e9, 1e9);
  for (let k = 0; k < N * N; k++) { mapBytes[k * 4 + 1] = Math.round(land.ao[k] * 255); mapBytes[k * 4 + 2] = Math.round(land.flow[k] * 255); mapBytes[k * 4 + 3] = Math.round(land.sediment[k] * 255); }
  const mapTex = new THREE.DataTexture(mapBytes, N, N, THREE.RGBAFormat, THREE.UnsignedByteType); mapTex.magFilter = mapTex.minFilter = THREE.LinearFilter; mapTex.wrapS = mapTex.wrapT = THREE.ClampToEdgeWrapping;
  const heightTex = new THREE.DataTexture(new Float32Array(land.h), N, N, THREE.RedFormat, THREE.FloatType); heightTex.magFilter = heightTex.minFilter = THREE.NearestFilter; heightTex.needsUpdate = true;
  const floorBytes = new Uint8Array(N * N * 4), floorTex = new THREE.DataTexture(floorBytes, N, N, THREE.RGBAFormat, THREE.UnsignedByteType); floorTex.magFilter = floorTex.minFilter = THREE.LinearFilter; floorTex.needsUpdate = true;
  const shared = {
    uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color() }, uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() },
    uAmbSky: { value: new THREE.Color() }, uAmbGround: { value: new THREE.Color() }, uHaze: { value: 0.0005 }, uHazeFall: { value: 1 / 200 }, uHazeBase: { value: opts.hazeBase ?? land.waterY }, uTime: { value: 0 },
    uMapData: { value: mapTex }, uSunTex: { value: sunTex }, uGround: { value: groundTex }, uFloor: { value: floorTex }, uHeight: { value: heightTex }, uMapHalf: { value: HALF }, uCell: { value: CELL }, uN: { value: N }, uSunN: { value: SN },
    uWaterY: { value: Number.isFinite(land.waterY) ? land.waterY : -1e4 }, uSnowY: { value: land.snowY },
    uGloom: { value: new THREE.Vector4(0, 0, 0, 0) }, uGloomD: { value: 0.03 }, uStars: { value: 0 },
  };
  const lit = (vertexShader: string, fragmentShader: string, own: Record<string, THREE.IUniform> = {}, defines: Record<string, string> = {}): THREE.ShaderMaterial => {
    const uniforms = { ...THREE.UniformsUtils.merge([THREE.UniformsLib.lights]), ...shared, ...own };
    return new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, lights: true, defines });
  };

  // ── terrain tiles ──
  /** Tuning: tile side (m); LOD steps in samples. */
  // 16×16 tiles whatever the map; where the land has an exact surface (the village's), a finer LOD 0 within FINE_NEAR draws it at half a cell.
  const TILES = 16, CELLS = (N - 1) / TILES, TILE = CELLS * CELL, FINE_NEAR = 110, STEPS = land.surface && opts.fineLod ? [0.5, 1, 2, 4, 8] : [1, 2, 4, 8];
  // The clearing masks, shared by the grass (none grows there) and the land (a trail is painted on it).
  const clearU = { uClear0: { value: blank as THREE.Texture }, uClear1: { value: blank as THREE.Texture }, uClear2: { value: blank as THREE.Texture }, uClearAt: { value: [new THREE.Vector3(0, 0, 1e-3), new THREE.Vector3(0, 0, 1e-3), new THREE.Vector3(0, 0, 1e-3)] } };
  const terrainMat = lit(terrainVert, terrainFrag, { uSoil: { value: new THREE.Vector4(0, 0, 0, 0) }, ...clearU, uTexSand: { value: floorTexture('sand') }, uTexNeedles: { value: floorTexture('needles') }, uTexLeaves: { value: floorTexture('leaves') }, uTexMoss: { value: floorTexture('moss') } }); terrainMat.side = THREE.DoubleSide;
  const at = (x: number, z: number) => surfaceAt(land, x, z);
  const tileGroup = new THREE.Group(); tileGroup.name = 'terrain'; scene.add(tileGroup);
  interface Tile { mesh: THREE.Mesh; lod: number; geos: (THREE.BufferGeometry | undefined)[]; cx: number; cz: number }
  const tiles: Tile[] = [];
  function tileGeometry(ti: number, tj: number, step: number): THREE.BufferGeometry {
    const n = CELLS / step, x0 = ti * TILE - HALF, z0 = tj * TILE - HALF, sp = step * CELL, skirt = 4 + step * 3;
    const verts = (n + 1) * (n + 1), pos = new Float32Array((verts + 4 * n) * 3), nor = new Float32Array((verts + 4 * n) * 3), idx: number[] = [];
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
      const x = x0 + i * sp, z = z0 + j * sp, k = (j * (n + 1) + i) * 3, nn = normalAt(land, x, z, Math.max(land.surface ? 1 : CELL, sp * 0.75), at);
      pos[k] = x; pos[k + 1] = at(x, z); pos[k + 2] = z; nor[k] = nn[0]; nor[k + 1] = nn[1]; nor[k + 2] = nn[2];
    }
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    // Skirts hang below every edge so a coarser neighbour never shows a crack.
    const ring: number[] = [];
    for (let i = 0; i < n; i++) ring.push(i); for (let j = 0; j < n; j++) ring.push(j * (n + 1) + n); for (let i = n; i > 0; i--) ring.push(n * (n + 1) + i); for (let j = n; j > 0; j--) ring.push(j * (n + 1));
    ring.forEach((v, r) => { const k = (verts + r) * 3; pos[k] = pos[v * 3]; pos[k + 1] = pos[v * 3 + 1] - skirt; pos[k + 2] = pos[v * 3 + 2]; nor[k] = nor[v * 3]; nor[k + 1] = nor[v * 3 + 1]; nor[k + 2] = nor[v * 3 + 2]; });
    for (let r = 0; r < ring.length; r++) { const a = ring[r], b = ring[(r + 1) % ring.length], sa = verts + r, sb = verts + (r + 1) % ring.length; idx.push(a, sa, b, b, sa, sb); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(idx); g.computeBoundingSphere(); return g;
  }
  for (let tj = 0; tj < TILES; tj++) for (let ti = 0; ti < TILES; ti++) {
    const t: Tile = { mesh: new THREE.Mesh(undefined, terrainMat), lod: -1, geos: [], cx: (ti + 0.5) * TILE - HALF, cz: (tj + 0.5) * TILE - HALF };
    t.mesh.receiveShadow = true; t.mesh.matrixAutoUpdate = false; t.mesh.userData = { ti, tj }; tileGroup.add(t.mesh); tiles.push(t);
  }
  function setTileLods(cam: THREE.Vector3): void {
    const [l1, l2, l3] = q.lod, fine = STEPS.length > 4 ? 1 : 0;
    for (const t of tiles) {
      const d = Math.max(0, Math.hypot(t.cx - cam.x, t.cz - cam.z) - TILE * 0.7), lod = (fine && d < FINE_NEAR ? -1 : d < l1 ? 0 : d < l2 ? 1 : d < l3 ? 2 : 3) + fine;
      if (lod === t.lod) continue;
      t.lod = lod; t.geos[lod] ??= tileGeometry(t.mesh.userData.ti, t.mesh.userData.tj, STEPS[lod]); t.mesh.geometry = t.geos[lod]!;
      // Drop the finest geometry once well away, to bound memory.
      for (let k = 0; k < lod - 1; k++) if (t.geos[k]) { t.geos[k]!.dispose(); t.geos[k] = undefined; }
    }
  }

  // ── the far ring: the unaroded shape out to the horizon ──
  {
    /** Tuning: reach and spacing of the ring (m). It overlaps the map's outer cells, sunk a little, so no seam opens. */
    const R = Math.max(7000, HALF + 4500), S = 80, n = Math.round(2 * R / S), pos: number[] = [], nor: number[] = [], idx: number[] = [], inner = HALF - S;
    const id = new Int32Array((n + 1) * (n + 1)).fill(-1);
    const need = (i: number, j: number) => { const x0 = -R + i * S, z0 = -R + j * S; return !(x0 >= -inner && x0 + S <= inner && z0 >= -inner && z0 + S <= inner); };
    const vert = (i: number, j: number): number => {
      const k = j * (n + 1) + i; if (id[k] >= 0) return id[k];
      const x = -R + i * S, z = -R + j * S, inside = Math.abs(x) <= HALF && Math.abs(z) <= HALF;
      const h = (x: number, z: number) => land.shape.base(x, z), y = h(x, z) - (inside ? 6 : 0), e = S;
      const nx = -(h(x + e, z) - h(x - e, z)), nz = -(h(x, z + e) - h(x, z - e)), l = Math.hypot(nx, 2 * e, nz);
      id[k] = pos.length / 3; pos.push(x, y, z); nor.push(nx / l, 2 * e / l, nz / l); return id[k];
    };
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (need(i, j)) { const a = vert(i, j), b = vert(i + 1, j), c = vert(i, j + 1), d = vert(i + 1, j + 1); idx.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx); g.computeBoundingSphere();
    const ring = new THREE.Mesh(g, terrainMat); ring.name = 'far-ring'; ring.frustumCulled = false; scene.add(ring);
  }

  // ── sky and water ──
  const skyMat = new THREE.ShaderMaterial({ uniforms: { ...shared, uCloud: { value: 0.5 } }, vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(8000, 48, 24), skyMat); sky.name = 'sky'; sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
  const waterMat = new THREE.ShaderMaterial({ uniforms: { ...shared }, vertexShader: waterVert, fragmentShader: waterFrag, transparent: true, depthWrite: false });
  const waterGeo = new THREE.PlaneGeometry(SIZE, SIZE, 8, 8); waterGeo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(waterGeo, waterMat); water.position.y = land.waterY; water.name = 'lake'; water.visible = Number.isFinite(land.waterY); scene.add(water);

  // ── grass ──
  const grassMat = lit(grassVert, grassFrag, { uCenter: { value: new THREE.Vector2() }, uPatch: { value: 60 }, uBladeH: { value: opts.bladeH ?? 0.34 }, uBladeW: { value: 0.045 }, uWind: { value: new THREE.Vector2(0.94, 0.34) },
    ...clearU,
    uFine: { value: fineTex }, uFineAt: { value: new THREE.Vector4(0, 0, 1, 0) } }); grassMat.side = THREE.DoubleSide;
  /** Tuning: blades per tuft (each instance is a tuft). */
  const TUFT = 3, bladeGeo = new THREE.BufferGeometry();
  { // A tuft of three blades, each three segments and a point: x across (−0.5..0.5), y up (0..1); aTuft = angle, offset x, offset z, height.
    const p: number[] = [], tuft: number[] = [], idx: number[] = [], r = rng(3);
    for (let b = 0; b < TUFT; b++) {
      const a = b / TUFT * Math.PI * 2 + r() * 0.6, ox = (r() - 0.5) * 0.12, oz = (r() - 0.5) * 0.12, hm = 0.65 + r() * 0.55, o = p.length / 3;
      for (const [x, y] of [[-0.5, 0], [0.5, 0], [-0.5, 0.35], [0.5, 0.35], [-0.5, 0.7], [0.5, 0.7], [0, 1]]) { p.push(x, y, 0); tuft.push(a, ox, oz, hm); }
      idx.push(o, o + 1, o + 2, o + 2, o + 1, o + 3, o + 2, o + 3, o + 4, o + 4, o + 3, o + 5, o + 4, o + 5, o + 6);
    }
    bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); bladeGeo.setAttribute('aTuft', new THREE.Float32BufferAttribute(tuft, 4)); bladeGeo.setIndex(idx);
  }
  let grass: THREE.Mesh | null = null, soilClear = true;
  /** Tuning: the camera's height above the ground past which no grass is drawn (m). */
  const GRASS_CEILING = 14;
  function buildGrass(count: number, patch: number): void {
    if (grass) { grass.geometry.dispose(); scene.remove(grass); grass = null; }
    if (!count) return;
    const g = new THREE.InstancedBufferGeometry(); g.index = bladeGeo.index; g.setAttribute('position', bladeGeo.getAttribute('position')); g.setAttribute('aTuft', bladeGeo.getAttribute('aTuft'));
    const r = rng(77), a = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) { a[i * 4] = r() * patch; a[i * 4 + 1] = r() * patch; a[i * 4 + 2] = r(); a[i * 4 + 3] = r() * Math.PI * 2; }
    g.setAttribute('aBlade', new THREE.InstancedBufferAttribute(a, 4)); g.instanceCount = count;
    grass = new THREE.Mesh(g, grassMat); grass.frustumCulled = false; grass.receiveShadow = true; grass.name = 'grass'; scene.add(grass);
    grassMat.uniforms.uPatch.value = patch;
  }

  // ── trees ──
  const solid = (hex: string | null, defines: Record<string, string>) => lit(solidVert, solidFrag, { uColor: { value: hex ? color(hex) : new THREE.Color() } }, defines);
  const rockMat = solid(null, { ROCK: '' });
  /** Per kind: the vista's three broadleaves and two conifers, then the village's tree (sized as flora.treeParts at size 1, so her climb meets its crown), dark and blighted. */
  /** 9 and 10 (MOTHER.md, the taint): the grey dead tree, brittle and twitching; the nursery's black vascular growth with its alveoli. */
  /** 11 (PINE BARRENS, Noah, 2026-10-21): the pitch pine, its needles yellow-green; T4c: 12 the blackjack oak, dark-leaved; 13 the Atlantic white cedar of the streamsides, blue-green. Their barks are textures (CARDS), tinted by BARK. */
  const LEAVES = ['#5c9a34', '#4f8a32', '#7aa83a', '#2f6a4a', '#3c7440', '#5f9a3a', '#3a2c4a', '#24162c', '#c97a3e', '#6e6a66', '#4a1446', '#5d8f36', '#4d7a2e', '#35603e'];
  const BARK = ['#8a7058', '#8a7058', '#8a7058', '#8a7058', '#8a7058', '#87705a', '#3a3040', '#1a1218', '#87705a', '#9d988f', '#0c060e', '#e4dcd0', '#e0dad2', '#e6e0d6'];
  /** A card material: the sprite's texture, alpha-tested, both faces. */
  const card = (hex: string, map: THREE.Texture, defines: Record<string, string>) => { const m = lit(cardVert, cardFrag, { uColor: { value: color(hex) }, uMap: { value: map } }, defines); m.side = THREE.DoubleSide; return m; };
  /** A trunk material wearing a bark texture. */
  const barkMat = (hex: string, cd: CardKind) => lit(solidVert, solidFrag, { uColor: { value: color(hex) }, uBark: { value: floorTexture(cd.bark) }, uBarkScale: { value: new THREE.Vector2(cd.barkScale[0], cd.barkScale[1]) } }, { BARK: '', UNDER: '' });
  /** The far card of each card kind: an impostor of the near tree, drawn once by the renderer; without one, the kind's own sprite. */
  const impostors: Record<number, THREE.Texture> = {}, depthCards: Record<number, THREE.MeshDepthMaterial> = {};
  for (const k of Object.keys(CARDS).map(Number)) {
    const sprite = spriteTexture(CARDS[k].sprite);
    impostors[k] = opts.renderer ? impostorOf(opts.renderer, k, sprite, LEAVES[k], BARK[k], floorTexture(CARDS[k].bark)) : sprite;
    // What the card crowns' shadows are cut from (the caster's depth pass reads the texture's alpha).
    depthCards[k] = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: sprite, alphaTest: 0.5, side: THREE.DoubleSide });
  }
  const varied = (k: number): Record<string, string> => (k >= 5 && k < 9 ? { VARIED: '' } : {});
  const motion = (k: number): Record<string, string> => (k === 9 ? { TWITCH: '' } : k === 10 ? { PULSE: '' } : {});
  const foliage = LEAVES.map((c, k) => CARDS[k] ? card(c, spriteTexture(CARDS[k].sprite), { USE_SWAY: '' }) : solid(c, k >= 9 ? motion(k) : { USE_SWAY: '', ...varied(k) })), farFoliage = LEAVES.map((c, k) => CARDS[k] ? card('#ffffff', impostors[k], {}) : solid(c, { ...varied(k), ...motion(k) })), barks = BARK.map((c, k) => CARDS[k] ? barkMat(c, CARDS[k]) : solid(c, { ...motion(k), UNDER: '' }));
  interface Kind { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number }
  const kinds: Kind[] = LEAVES.map((_, k) => treeKind(k));
  const mk = (geo: THREE.BufferGeometry, mat: THREE.Material, n: number, cast: boolean) => { const m = new THREE.InstancedMesh(geo, mat, Math.max(1, n)); m.count = 0; m.frustumCulled = false; m.castShadow = cast; m.receiveShadow = true; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); return m; };
  let byKind: Tree[][] = [], nearTrunk: THREE.InstancedMesh[] = [], nearCrown: THREE.InstancedMesh[] = [], casters: THREE.InstancedMesh[] = [], farCrown: THREE.InstancedMesh[] = [];
  function setTrees(list: Tree[]): void {
    for (const m of [...nearTrunk, ...nearCrown, ...casters, ...farCrown]) { scene.remove(m); m.dispose(); }
    byKind = kinds.map((_, k) => list.filter(t => t.kind === k));
    nearTrunk = kinds.map((k, i) => mk(k.trunk, barks[i], byKind[i].length, false));
    nearCrown = kinds.map((k, i) => mk(k.crown, foliage[i], byKind[i].length, false));
    // Only the trees inside the shadow box cast: copies on CASTER_LAYER, which the sun's shadow camera sees and the view does not.
    casters = kinds.flatMap((k, i) => [mk(k.trunk, barks[i], byKind[i].length, true), mk(k.crown, foliage[i], byKind[i].length, true)]);
    for (const c of casters) c.layers.set(CASTER_LAYER);
    for (const k of Object.keys(CARDS).map(Number)) casters[k * 2 + 1].customDepthMaterial = depthCards[k];
    farCrown = kinds.map((k, i) => mk(k.far, farFoliage[i], byKind[i].length, false));
    partitionAt.set(1e9, 0, 0);
  }
  /** Only the instances in use go to the GPU (the buffers hold every tree of the kind; the land's are thousands). */
  const upload = (x: THREE.InstancedMesh): void => { const a = x.instanceMatrix; a.clearUpdateRanges(); if (x.count > 0) a.addUpdateRange(0, x.count * 16); a.needsUpdate = true; };
  const matrixOf = (t: Tree, m: THREE.Matrix4) => t.frame ? m.fromArray(t.frame) : m.compose(new THREE.Vector3(t.x, t.y - 0.15, t.z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), t.rot), new THREE.Vector3(t.scale, t.scale, t.scale));
  let partitionAt = new THREE.Vector3(1e9, 0, 0), nearCount = 0, near: Tree[] = [];
  /** Tuning (FOREST): a tree smaller than YOUNG_FAR is not drawn past YOUNG_REACH m. */
  const YOUNG_FAR = 1.25, YOUNG_REACH = 260;
  /** Tuning: past this a tree is not drawn at all (the haze has it). */
  const TREE_REACH = opts.treeReach ?? 1400;
  function partitionTrees(cam: THREE.Vector3): void {
    const m = new THREE.Matrix4(), r2 = (q.nearTrees * (opts.nearTreesScale ?? 1)) ** 2, s2 = (q.shadow ? q.shadowBox * 1.25 + 8 : 0) ** 2, f2 = TREE_REACH ** 2; near = []; nearCount = 0;
    byKind.forEach((list, k) => {
      let a = 0, b = 0, c = 0;
      const [ct, cc] = [casters[k * 2], casters[k * 2 + 1]];
      for (const t of list) {
        const d2 = (t.x - cam.x) ** 2 + (t.z - cam.z) ** 2; if (d2 > f2) continue;
        matrixOf(t, m);
        if (d2 < r2) { nearTrunk[k].setMatrixAt(a, m); nearCrown[k].setMatrixAt(a, m); a++; near.push(t); }
        // FOREST: far off, a young tree's crown is lost among the older ones about it; not drawn.
        else if (t.scale >= YOUNG_FAR || d2 < YOUNG_REACH * YOUNG_REACH) farCrown[k].setMatrixAt(b++, m);
        if (d2 < s2) { ct.setMatrixAt(c, m); cc.setMatrixAt(c, m); c++; }
      }
      nearTrunk[k].count = nearCrown[k].count = a; farCrown[k].count = b; ct.count = cc.count = c; nearCount += a;
      for (const x of [nearTrunk[k], nearCrown[k], farCrown[k], ct, cc]) upload(x);
    });
    partitionAt.copy(cam);
  }
  setTrees(trees);

  // ── rocks: only those within ROCK_REACH are drawn, refreshed with the trees ──
  /** Tuning: past this a boulder is a few pixels under the haze. */
  const ROCK_REACH = 650;
  const rockMesh = new THREE.InstancedMesh(rockGeometry(), rockMat, Math.max(1, rocks.length)), rockMats = rocks.map(r => new THREE.Matrix4().compose(new THREE.Vector3(r.x, r.y - r.scale * 0.25, r.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(r.tilt, r.rot, r.tilt * 0.5)), new THREE.Vector3(r.scale, r.scale * 0.7, r.scale * 0.9)));
  rockMesh.castShadow = true; rockMesh.receiveShadow = true; rockMesh.frustumCulled = false; rockMesh.name = 'rocks'; rockMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); rockMesh.count = 0; scene.add(rockMesh);
  function partitionRocks(cam: THREE.Vector3): void { let n = 0; rocks.forEach((r, i) => { if ((r.x - cam.x) ** 2 + (r.z - cam.z) ** 2 < ROCK_REACH ** 2) rockMesh.setMatrixAt(n++, rockMats[i]); }); rockMesh.count = n; upload(rockMesh); }

  // ── quality and hour ──
  let q = quality;
  function setQuality(next: Quality): void { q = next; buildGrass(q.grass, q.patch); for (const t of tiles) t.lod = -1; partitionAt.set(1e9, 0, 0); }
  setQuality(quality);
  // The sun's shadows: baked at once, or a few rows a frame into a back buffer that swaps in when done.
  let bakeDir: [number, number, number] | null = null, bakeRow = 0, bakedDir = new THREE.Vector3(0, -1, 0);
  /** Tuning: rows of the sun bake per frame while the sun moves. */
  const BAKE_ROWS = Math.ceil(SN / 90);
  function setHour(h: Hour, bakeNow = true): void {
    const dir = sunDirection(h);
    shared.uStars.value = h.stars ?? 0;
    shared.uSunDir.value.copy(dir); shared.uSunCol.value.copy(color(h.sun).multiplyScalar(h.sunI)); shared.uZenith.value.copy(color(h.zenith)); shared.uHorizon.value.copy(color(h.horizon));
    shared.uAmbSky.value.copy(color(h.ambSky).multiplyScalar(h.ambI)); shared.uAmbGround.value.copy(color(h.ambGround).multiplyScalar(h.ambI)); shared.uHaze.value = h.haze; shared.uHazeFall.value = h.hazeFall;
    skyMat.uniforms.uCloud.value = h.cloud;
    if (bakeNow) { bakeSun(sunLand, [dir.x, dir.y, dir.z], sun); sunTex.needsUpdate = true; bakedDir.copy(dir); bakeDir = null; }
    else if (bakedDir.angleTo(dir) > THREE.MathUtils.degToRad(0.8) && !bakeDir) { bakeDir = [dir.x, dir.y, dir.z]; bakeRow = 0; }
  }
  function stepBake(): void {
    if (!bakeDir) return;
    const end = Math.min(SN, bakeRow + BAKE_ROWS); bakeSun(sunLand, bakeDir, sunBack, [bakeRow, end]); bakeRow = end;
    if (bakeRow >= SN) { sun.set(sunBack); sunTex.needsUpdate = true; bakedDir.set(...bakeDir); bakeDir = null; }
  }
  function refreshFine(x: number, z: number): void {
    if (!opts.fine) return;
    const x0 = Math.round(x - FINE_SIDE / 2), z0 = Math.round(z - FINE_SIDE / 2), st = FINE_SIDE / (FINE_T - 1);
    for (let j = 0; j < FINE_T; j++) for (let i = 0; i < FINE_T; i++) fineData[j * FINE_T + i] = opts.fine(x0 + i * st, z0 + j * st);
    fineTex.needsUpdate = true; fineAt.set(x, z); grassMat.uniforms.uFineAt.value.set(x0, z0, FINE_SIDE, FINE_T);
  }

  return {
    uniforms: shared,
    root, setHour, setQuality, setTrees,
    setGround(bytes) { groundBytes.set(bytes); groundTex.needsUpdate = true; },
    setCanopy(bytes) { for (let k = 0; k < N * N; k++) mapBytes[k * 4] = bytes[k]; mapTex.needsUpdate = true; },
    setFloor(bytes) { floorBytes.set(bytes); floorTex.needsUpdate = true; },
    setSoil(amount, x, z) {
      terrainMat.uniforms.uSoil.value.set(x, z, amount, 0);
      const glass = amount > 0.01; if (terrainMat.transparent !== glass) { terrainMat.transparent = glass; terrainMat.needsUpdate = true; }
      terrainMat.depthWrite = amount < 0.5; soilClear = amount < 0.05;
    },
    setGloom(colour, amount, density) { shared.uGloom.value.set(colour.r, colour.g, colour.b, amount); shared.uGloomD.value = density; },
    setClear(i, texture, x0, z0, side) { (clearU as Record<string, THREE.IUniform>)[`uClear${i}`].value = texture ?? blank; clearU.uClearAt.value[i].set(x0, z0, texture ? side : 1e-3); },
    update(camera, timeS) {
      const p = camera.position; shared.uTime.value = timeS;
      stepBake();
      if (opts.fine && Math.hypot(p.x - fineAt.x, p.z - fineAt.y) > FINE_SIDE * 0.22) refreshFine(p.x, p.z);
      sky.position.copy(p);
      setTileLods(p);
      grassMat.uniforms.uCenter.value.set(p.x, p.z);
      // Grass is drawn only near the ground: from a summit or a crown its blades are a few pixels and cost a full field of vertices.
      if (grass) grass.visible = soilClear && p.y - at(p.x, p.z) < GRASS_CEILING;
      if (Math.hypot(p.x - partitionAt.x, p.z - partitionAt.z) > 12) { partitionTrees(p); partitionRocks(p); }
    },
    colliders() {
      return near.map(t => ({ x: t.x, z: t.z, radius: kinds[t.kind].radius * t.scale, cameraClearance: kinds[t.kind].radius * t.scale + 0.3 }));
    },
    sunAt(x, z) { const c = CELL * STRIDE, i = Math.round((x + HALF) / c), j = Math.round((z + HALF) / c); return i < 0 || j < 0 || i >= SN || j >= SN ? 1 : sun[j * SN + i] / 255; },
    stats: () => ({ tiles: tiles.length, nearTrees: nearCount }),
  };
}

// ── geometry ────────────────────────────────────────────────────────────
/** Strip a geometry to position + normal and give it a per-vertex occlusion `aShade`. */
function shaded(g: THREE.BufferGeometry, shade: (p: THREE.Vector3) => number): THREE.BufferGeometry {
  const out = g; for (const name of Object.keys(out.attributes)) if (name !== 'position' && name !== 'normal') out.deleteAttribute(name);
  const pos = out.getAttribute('position'), a = new Float32Array(pos.count), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) a[i] = shade(v.fromBufferAttribute(pos, i));
  out.setAttribute('aShade', new THREE.BufferAttribute(a, 1)); return out;
}
/** A lumpy blob of foliage whose normals lean out from `centre`, so a crown shades as one soft volume. */
function blob(r: number, at: THREE.Vector3, centre: THREE.Vector3, seed: number, detail = 1, squash = 1): THREE.BufferGeometry {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(r, detail); g.deleteAttribute('uv'); g = mergeVertices(g);
  const pos = g.getAttribute('position'), nor = g.getAttribute('normal'), v = new THREE.Vector3(), rr = rng(seed);
  const bumps = Array.from({ length: 5 }, () => new THREE.Vector3(rr() - 0.5, rr() - 0.5, rr() - 0.5).normalize());
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i); const d = v.clone().normalize(); let k = 1;
    for (const b of bumps) k += Math.max(0, d.dot(b)) ** 4 * 0.22;
    v.copy(d).multiplyScalar(r * k); v.y *= squash; v.add(at); pos.setXYZ(i, v.x, v.y, v.z);
    const n = v.clone().sub(centre).normalize().multiplyScalar(0.7).add(d.multiplyScalar(0.3)).normalize(); nor.setXYZ(i, n.x, n.y, n.z);
  }
  return g;
}
function treeKind(kind: number): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number } {
  if (kind === 9) return deadTree();
  if (kind === 10) return growth();
  if (kind === 11) return pitchPine();
  if (kind === 12) return blackjackOak();
  if (kind === 13) return whiteCedar();
  const r = rng(kind * 101 + 9), Y = new THREE.Vector3(0, 1, 0);
  if (kind < 3 || kind >= 5) {
    // Broadleaf: a trunk that forks into limbs under a crown of 7–9 lumps. The village's (5–7) is flora.treeParts' at size 1: trunk 3.2 m, 0.15–0.42 m thick, the crown about 3.5 m up, 1.7 m out and 1.2 m tall.
    const v = kind >= 5, H = v ? 4.85 : [8.5, 10.5, 7.5][kind], crownY = v ? 2.75 : H * 0.66, spread = v ? 1.25 : [2.6, 2.1, 3.2][kind], tall = v ? 1.2 : [1.7, 2.4, 1.3][kind];
    const lump = v ? 0.55 : 1, trunkR: [number, number] = v ? [0.15, 0.42] : [0.16, 0.3];
    const trunk = new THREE.CylinderGeometry(trunkR[0], trunkR[1], crownY + (v ? 0.45 : 0), 8, 3); trunk.translate(0, (crownY + (v ? 0.45 : 0)) / 2, 0);
    const limbs = [0, 1, 2].map(i => { const a = i / 3 * Math.PI * 2 + r(), l = new THREE.CylinderGeometry(0.07, 0.13, spread * 1.1, 6); l.translate(0, spread * 0.55, 0); l.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8))); l.translate(0, crownY * 0.8, 0); return l; });
    const trunkGeo = shaded(mergeGeometries([trunk, ...limbs].map(g => { g.deleteAttribute('uv'); return g; }))!, p => 0.55 + 0.45 * Math.min(1, p.y / crownY));
    const centre = new THREE.Vector3(0, crownY + tall * 0.6, 0), lumps: THREE.BufferGeometry[] = [];
    // The village's tree stands by the hundred in a wood: fewer, larger lumps (a third of the triangles) keep a dense wood affordable.
    const count = v ? 5 : 7 + Math.floor(r() * 3);
    for (let i = 0; i < count; i++) {
      const a = i / count * Math.PI * 2 + r() * 0.5, up = (r() - 0.35) * tall, out = spread * (0.55 + r() * 0.35);
      lumps.push(blob((1.5 + r() * 0.9) * lump * (v ? 1.2 : 1), new THREE.Vector3(Math.cos(a) * out, centre.y + up, Math.sin(a) * out), centre, kind * 31 + i));
    }
    lumps.push(blob(2.2 * lump, new THREE.Vector3(0, centre.y + tall * 0.75, 0), centre, kind * 31 + 99));
    const crown = shaded(mergeGeometries(lumps)!, p => { const d = p.clone().sub(centre); return Math.min(1, 0.5 + 0.35 * (d.y / (tall + 2) + 0.6) + 0.25 * Math.hypot(d.x, d.z) / (spread + 2)); });
    const farGeo = shaded(mergeGeometries([blob(spread + 1.3 * lump, centre.clone(), centre.clone().setY(centre.y - 1), kind + 500, 0, (tall + 2 * lump) / (spread + 1.3 * lump))])!, p => 0.6 + 0.4 * Math.min(1, Math.max(0, (p.y - centre.y + 2) / 4)));
    return { trunk: trunkGeo, crown, far: farGeo, radius: v ? 0.32 : 0.3 };
  }
  // Conifer: a straight trunk and five tiers, each a cone with normals that lean out and up.
  const H = kind === 3 ? 13 : 10, tiers: THREE.BufferGeometry[] = [];
  const trunk = new THREE.CylinderGeometry(0.1, 0.32, H * 0.9, 7, 2); trunk.translate(0, H * 0.45, 0); trunk.deleteAttribute('uv');
  for (let i = 0; i < 5; i++) {
    const t = i / 5, rad = (kind === 3 ? 2.6 : 3.0) * (1 - t * 0.78), h = H * 0.34 * (1 - t * 0.35), y = H * (0.18 + t * 0.62);
    let c: THREE.BufferGeometry = new THREE.ConeGeometry(rad, h, 11, 2); c.deleteAttribute('uv'); c = mergeVertices(c);
    const pos = c.getAttribute('position'), nor = c.getAttribute('normal'), v = new THREE.Vector3();
    for (let k = 0; k < pos.count; k++) { v.fromBufferAttribute(pos, k); const ring = Math.hypot(v.x, v.z); const wob = 1 + 0.12 * Math.sin(Math.atan2(v.z, v.x) * 5 + i * 2); pos.setXYZ(k, v.x * wob, v.y + h / 2 + y - (ring / rad) * 0.5, v.z * wob); const n = new THREE.Vector3(v.x, rad * 0.9, v.z).normalize(); nor.setXYZ(k, n.x, n.y, n.z); }
    tiers.push(c);
  }
  const crown = shaded(mergeGeometries(tiers)!, p => 0.5 + 0.5 * Math.min(1, Math.hypot(p.x, p.z) / 2.2 * 0.6 + p.y / H * 0.5));
  let far: THREE.BufferGeometry = new THREE.ConeGeometry(kind === 3 ? 2.6 : 3.0, H * 0.9, 6, 1); far.deleteAttribute('uv'); far.translate(0, H * 0.55, 0);
  const fp = far.getAttribute('position'), fn = far.getAttribute('normal'), fv = new THREE.Vector3();
  for (let k = 0; k < fp.count; k++) { fv.fromBufferAttribute(fp, k); const n = new THREE.Vector3(fv.x, 1.6, fv.z).normalize(); fn.setXYZ(k, n.x, n.y, n.z); }
  far = shaded(far, p => 0.55 + 0.45 * Math.min(1, p.y / H));
  void Y;
  return { trunk: shaded(trunk, p => 0.5 + 0.5 * Math.min(1, p.y / H)), crown, far, radius: 0.3 };
}
/** A tapered tube along points (no uv), for the taint's branches and vessels. */
function limb(points: THREE.Vector3[], r0: number, r1: number, segs = 8, sides = 5, bark = false): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points), g = new THREE.TubeGeometry(curve, segs, 1, sides, false), pos = g.getAttribute('position'), v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) { const u = i / segs, rad = r0 + (r1 - r0) * u; curve.getPointAt(u, c); for (let j = 0; j <= sides; j++) { const k = i * (sides + 1) + j; v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(rad).add(c); pos.setXYZ(k, v.x, v.y, v.z); } }
  // T4c: a barked limb keeps its uv, in metres: u along the limb, v round it (uBarkScale sets the repeats per metre).
  if (bark) { const uv = g.getAttribute('uv'), len = curve.getLength(), round = Math.PI * (r0 + r1); for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * len, uv.getY(k) * round); } else g.deleteAttribute('uv');
  g.computeVertexNormals(); return g;
}
/** MOTHER.md, the grey: a natural tree the taint has reached, stiff, grey and brittle: no leaves, a trunk forked into bare limbs that end in thin, crooked twigs (the crown slot holds the twigs). */
function deadTree(): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number } {
  const r = rng(9091), parts: THREE.BufferGeometry[] = [], twigs: THREE.BufferGeometry[] = [], H = 4.6;
  parts.push(limb([new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(0.05, H * 0.4, 0.03), new THREE.Vector3(-0.04, H * 0.75, 0.02), new THREE.Vector3(0.02, H, 0)], 0.36, 0.08, 8, 7));
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + r() * 0.6, y0 = H * (0.45 + r() * 0.45), len = 1.4 + r() * 1.4, out = new THREE.Vector3(Math.cos(a), 0.55 + r() * 0.5, Math.sin(a)).normalize();
    const p0 = new THREE.Vector3(0, y0, 0), p1 = p0.clone().addScaledVector(out, len * 0.5).add(new THREE.Vector3((r() - 0.5) * 0.4, -0.1, (r() - 0.5) * 0.4)), p2 = p0.clone().addScaledVector(out, len);
    parts.push(limb([p0, p1, p2], 0.09, 0.03, 5, 4));
    for (let k = 0; k < 3; k++) { const b = 2 * Math.PI * r(), t0 = p1.clone().lerp(p2, r()), t1 = t0.clone().add(new THREE.Vector3(Math.cos(b) * 0.6, 0.35 + r() * 0.4, Math.sin(b) * 0.6)), t2 = t1.clone().add(new THREE.Vector3(Math.cos(b + 0.9) * 0.3, 0.25, Math.sin(b + 0.9) * 0.3)); twigs.push(limb([t0, t1, t2], 0.03, 0.008, 3, 3)); }
  }
  const trunk = shaded(mergeGeometries(parts)!, p => 0.5 + 0.5 * Math.min(1, p.y / H)), crown = shaded(mergeGeometries(twigs)!, () => 0.85);
  const far = shaded(mergeGeometries([limb([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, H * 0.6, 0), new THREE.Vector3(0, H, 0)], 0.32, 0.06, 3, 4), limb([new THREE.Vector3(0, H * 0.55, 0), new THREE.Vector3(1.2, H * 0.85, 0.3), new THREE.Vector3(2, H * 1.05, 0.5)], 0.1, 0.03, 2, 3), limb([new THREE.Vector3(0, H * 0.65, 0), new THREE.Vector3(-1, H * 0.9, -0.5), new THREE.Vector3(-1.6, H * 1.15, -0.8)], 0.1, 0.03, 2, 3)])!, () => 0.55);
  return { trunk, crown, far, radius: 0.3 };
}
/** MOTHER.md, the nursery: what stands where the trees were: a black stem dividing and dividing again into curling vessels, a bronchial tree, each end swelling into a cluster of alveoli (the crown slot), the whole breathing (PULSE). */
function growth(): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number } {
  const r = rng(1010), vessels: THREE.BufferGeometry[] = [], sacs: THREE.BufferGeometry[] = [];
  const grow = (from: THREE.Vector3, dir: THREE.Vector3, len: number, rad: number, depth: number): void => {
    const side = new THREE.Vector3(-dir.z, 0, dir.x).normalize(), bend = (r() - 0.5) * 0.8;
    const mid = from.clone().addScaledVector(dir, len * 0.5).addScaledVector(side, bend * len * 0.3), end = from.clone().addScaledVector(dir, len).addScaledVector(side, bend * len * 0.5);
    vessels.push(limb([from, mid, end], rad, rad * 0.62, 5, 5));
    // Kept to a village tree's cost (a few hundred vertices): the nursery stands by the hundred.
    if (depth === 0) { for (let i = 0; i < 3; i++) { const s = new THREE.IcosahedronGeometry(0.22 + r() * 0.16, 0); s.translate(end.x + (r() - 0.5) * 0.5, end.y + (r() - 0.3) * 0.45, end.z + (r() - 0.5) * 0.5); sacs.push(s); } return; }
    const n = 2;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + r(), d = dir.clone().multiplyScalar(0.7).add(new THREE.Vector3(Math.cos(a) * 0.7, 0.15 + r() * 0.3, Math.sin(a) * 0.7)).normalize(); grow(end, d, len * (0.62 + r() * 0.15), rad * 0.6, depth - 1); }
  };
  grow(new THREE.Vector3(0, -0.3, 0), new THREE.Vector3(0, 1, 0), 3.0, 0.45, 2);
  const trunk = shaded(mergeGeometries(vessels)!, p => 0.45 + 0.55 * Math.min(1, p.y / 6));
  const crown = shaded(mergeGeometries(sacs)!, p => 0.55 + 0.45 * Math.min(1, p.y / 6));
  const farG = mergeGeometries([limb([new THREE.Vector3(0, -0.3, 0), new THREE.Vector3(0.3, 2.5, 0), new THREE.Vector3(0, 4.6, 0.2)], 0.45, 0.2, 3, 5), ...[0, 1, 2].map(i => { const a = i * 2.1, s = new THREE.SphereGeometry(1.1, 7, 5); s.deleteAttribute('uv'); s.translate(Math.cos(a) * 1.2, 4.6 + i * 0.4, Math.sin(a) * 1.2); return s; })])!;
  return { trunk, crown, far: shaded(farG, p => 0.45 + 0.55 * Math.min(1, p.y / 6)), radius: 0.42 };
}
/** PINE BARRENS (Noah, 2026-10-21; T4c the oak and the cedar): the land's trees after the New Jersey Pine Barrens, each a trunk of barked
 * geometry and a crown of crossed sprite cards (sky between them), its far self two cards of an impostor the renderer draws once. Each
 * at size 1 is bare to the crown's foot at 3.4 m (villageModel.crownHeight: her climb meets its lowest limbs there, 1.1 m out). */
export interface CardKind { sprite: SpriteKind; /** The far card's width and height (m), the impostor's view. */ frame: [number, number]; bark: FloorName; /** Bark repeats per metre along and round the trunk. */ barkScale: [number, number] }
export const CARDS: Record<number, CardKind> = {
  11: { sprite: 'pine', frame: [5.0, 7.2], bark: 'bark-pine', barkScale: [0.8, 1.2] },
  12: { sprite: 'oak', frame: [6.4, 6.8], bark: 'bark-oak', barkScale: [1.0, 1.6] },
  13: { sprite: 'cedar', frame: [3.6, 9.4], bark: 'bark-cedar', barkScale: [0.6, 1.4] },
};
const CROWN_FOOT = 3.4;
/** The far card: two crossed quads of the kind's frame, their normals leaning up. */
function farCard(kind: number): THREE.BufferGeometry {
  const [W, FH] = CARDS[kind].frame, cards: THREE.BufferGeometry[] = [], v = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  for (const turn of [0, Math.PI / 2]) { const q = new THREE.PlaneGeometry(W, FH); q.translate(0, FH / 2 - 0.25, 0); q.rotateY(turn); cards.push(q); }
  const far = mergeGeometries(cards)!, fn = far.getAttribute('normal'); for (let i = 0; i < fn.count; i++) { v.set(fn.getX(i), 0, fn.getZ(i)).multiplyScalar(0.5).add(up).normalize(); fn.setXYZ(i, v.x, v.y, v.z); }
  return shadedCard(far, p => 0.6 + 0.4 * Math.min(1, Math.max(0, p.y / FH)));
}
/** Crown cards' normals lean out from the crown's heart (squashed), so the crown shades as one mass. */
function crownNormals(g: THREE.BufferGeometry, centre: THREE.Vector3, squash = 0.7): void {
  const pos = g.getAttribute('position'), nor = g.getAttribute('normal'), v = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).sub(centre); v.y *= squash; v.normalize().lerp(up, 0.3).normalize(); nor.setXYZ(i, v.x, v.y, v.z); }
}
/** The pitch pine: PINE_H m at size 1, a crooked trunk, five twisted limbs out and up ending in needle tufts, a ragged top. Giants (2.4) 15 m, the young (0.55) scrubby 3.5 m. Tuning. */
const PINE_H = 6.4;
function pitchPine(): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number } {
  const r = rng(1111), H = PINE_H, parts: THREE.BufferGeometry[] = [], tufts: Standee[] = [];
  // The trunk: tapered, with a lean that turns back (pitch pines seldom grow straight).
  const lean = new THREE.Vector3(r() - 0.5, 0, r() - 0.5).normalize().multiplyScalar(0.28);
  const spine = [0, 0.3, 0.62, 1].map(u => new THREE.Vector3(lean.x * Math.sin(u * Math.PI) * 1.4 + lean.z * u * 0.3, -0.2 + (H * 0.97 + 0.2) * u, lean.z * Math.sin(u * Math.PI) * 1.4 - lean.x * u * 0.3));
  parts.push(limb(spine, 0.3, 0.05, 7, 6, true));
  const curve = new THREE.CatmullRomCurve3(spine), at = (y: number) => curve.getPoint(Math.min(1, Math.max(0, (y + 0.2) / (H * 0.97 + 0.2))));
  const centre = new THREE.Vector3(0, CROWN_FOOT + (H - CROWN_FOOT) * 0.55, 0);
  const tuft = (p: THREE.Vector3, k: number, flat = true) => tufts.push({ position: p.clone().sub(new THREE.Vector3(0, k * 0.45, 0)), yaw: r() * Math.PI, width: k, height: k * (0.85 + r() * 0.3), flat });
  // The limbs: the lowest the longest, each kinked once, out and up, a tuft midway and one or two at its end.
  const limbs = 5;
  for (let i = 0; i < limbs; i++) {
    const u = i / (limbs - 1), y0 = CROWN_FOOT - 0.1 + u * (H - CROWN_FOOT - 0.9), a = i * 2.4 + r() * 0.8, len = (1.9 - u * 0.8) * (0.85 + r() * 0.3), up = 0.35 + u * 0.35 + r() * 0.2;
    const d = new THREE.Vector3(Math.cos(a), up, Math.sin(a)).normalize(), p0 = at(y0), p1 = p0.clone().addScaledVector(d, len * 0.5).add(new THREE.Vector3((r() - 0.5) * 0.4, (r() - 0.6) * 0.3, (r() - 0.5) * 0.4)), p2 = p0.clone().addScaledVector(d, len).add(new THREE.Vector3(0, 0.15 + r() * 0.3, 0));
    parts.push(limb([p0, p1, p2], 0.09 - u * 0.03, 0.025, 3, 4, true));
    tuft(p1.clone().lerp(p2, 0.35).add(new THREE.Vector3(0, 0.25, 0)), 0.95 + r() * 0.3, false);
    tuft(p2.clone().add(new THREE.Vector3(0, 0.3, 0)), 1.25 + r() * 0.4);
    if (r() < 0.6) tuft(p2.clone().add(new THREE.Vector3((r() - 0.5) * 0.9, 0.55 + r() * 0.3, (r() - 0.5) * 0.9)), 0.9 + r() * 0.3);
  }
  // The top: a few tufts about the leader.
  for (let i = 0; i < 3; i++) { const p = at(H * 0.97 - i * 0.55); tuft(p.clone().add(new THREE.Vector3((r() - 0.5) * 0.7, 0.35, (r() - 0.5) * 0.7)), 1.0 + r() * 0.3, i === 0); }
  const trunk = shadedCard(mergeGeometries(parts)!, p => 0.5 + 0.5 * Math.min(1, p.y / H));
  const crown = standees(tufts); crownNormals(crown, centre);
  return { trunk, crown: shadedCard(crown, p => Math.min(1, 0.55 + 0.3 * (p.y - CROWN_FOOT) / (H - CROWN_FOOT) + 0.25 * Math.hypot(p.x, p.z) / 2.2)), far: farCard(11), radius: 0.32 };
}
/** T4c: the blackjack oak (post oak too), the barrens' other tree: OAK_H m at size 1, a stout crooked trunk, thick limbs out and up, a broad
 * ragged crown of big lobed leaves, dense enough to shade leaf mould under it. Tuning. */
const OAK_H = 6.0;
function blackjackOak(): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number } {
  const r = rng(1212), H = OAK_H, parts: THREE.BufferGeometry[] = [];
  const lean = new THREE.Vector3(r() - 0.5, 0, r() - 0.5).normalize().multiplyScalar(0.22);
  const spine = [0, 0.35, 0.7, 1].map(u => new THREE.Vector3(lean.x * Math.sin(u * Math.PI * 1.3) * 1.2, -0.2 + (H * 0.78 + 0.2) * u, lean.z * Math.sin(u * Math.PI * 1.3) * 1.2));
  parts.push(limb(spine, 0.34, 0.12, 6, 7, true));
  const curve = new THREE.CatmullRomCurve3(spine), at = (y: number) => curve.getPoint(Math.min(1, Math.max(0, (y + 0.2) / (H * 0.78 + 0.2))));
  const centre = new THREE.Vector3(0, CROWN_FOOT + (H - CROWN_FOOT) * 0.6, 0), cards: Standee[] = [];
  // Five thick limbs from the crown's foot up, each forking once; the lowest reach wide.
  for (let i = 0; i < 5; i++) {
    const u = i / 4, y0 = CROWN_FOOT - 0.5 + u * (H * 0.78 - CROWN_FOOT + 0.3), a = i * 2.5 + r() * 0.9, len = (2.4 - u * 0.9) * (0.85 + r() * 0.3), up = 0.45 + u * 0.4;
    const d = new THREE.Vector3(Math.cos(a), up, Math.sin(a)).normalize(), p0 = at(y0), p1 = p0.clone().addScaledVector(d, len * 0.55).add(new THREE.Vector3((r() - 0.5) * 0.5, (r() - 0.4) * 0.3, (r() - 0.5) * 0.5)), p2 = p0.clone().addScaledVector(d, len).add(new THREE.Vector3(0, 0.2 + r() * 0.3, 0));
    parts.push(limb([p0, p1, p2], 0.13 - u * 0.04, 0.04, 3, 5, true));
    const b = a + (r() - 0.5) * 1.6, p3 = p1.clone().add(new THREE.Vector3(Math.cos(b) * len * 0.45, 0.35 + r() * 0.4, Math.sin(b) * len * 0.45));
    parts.push(limb([p1, p1.clone().lerp(p3, 0.5).add(new THREE.Vector3(0, 0.1, 0)), p3], 0.07, 0.03, 2, 4, true));
    for (const q of [p2, p3, p1.clone().lerp(p2, 0.6)]) { const k = 1.3 + r() * 0.6; cards.push({ position: q.clone().add(new THREE.Vector3((r() - 0.5) * 0.5, 0.1 - k * 0.3, (r() - 0.5) * 0.5)), yaw: r() * Math.PI, width: k, height: k * (0.85 + r() * 0.3), flat: r() < 0.6 }); }
  }
  // The crown filled: cards through its ellipsoid, denser at the middle.
  cards.push(...crownStandees(r, centre, 2.3, 1.2, 2.3, 9, 1.5));
  const trunk = shadedCard(mergeGeometries(parts)!, p => 0.5 + 0.5 * Math.min(1, p.y / H));
  const crown = standees(cards); crownNormals(crown, centre, 0.6);
  return { trunk, crown: shadedCard(crown, p => { const d = p.clone().sub(centre); return Math.min(1, 0.45 + 0.35 * (d.y / 2.6 + 0.6) + 0.25 * Math.hypot(d.x, d.z) / 3.2); }), far: farCard(12), radius: 0.34 };
}
/** T4c: the Atlantic white cedar of the barrens' streamsides: CEDAR_H m at size 1 (grown 1.2–2.2: 11–20 m), a straight thin trunk and a narrow
 * column of flat sprays, dark blue-green, from knee height to the tip; they stand close in cedar swamps, so one is cheap. Tuning. */
const CEDAR_H = 9.0;
function whiteCedar(): { trunk: THREE.BufferGeometry; crown: THREE.BufferGeometry; far: THREE.BufferGeometry; radius: number } {
  const r = rng(1313), H = CEDAR_H, cards: Standee[] = [];
  const trunk = limb([new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(0.04, H * 0.5, 0.02), new THREE.Vector3(0, H * 0.96, 0)], 0.2, 0.03, 4, 6, true);
  // Sprays stacked up the trunk, wide below, narrowing to the tip, each pair turned from the last.
  const levels = 7;
  for (let i = 0; i < levels; i++) { const u = i / (levels - 1), y = 1.3 + u * (H - 1.9), w = (2.4 - u * 1.5) * (0.9 + r() * 0.2), h = 2.2 - u * 0.6; for (const turn of [0, 1.05]) cards.push({ position: new THREE.Vector3((r() - 0.5) * 0.3, y - h * 0.45, (r() - 0.5) * 0.3), yaw: i * 0.9 + turn + r() * 0.3, width: w, height: h, flat: false }); }
  cards.push({ position: new THREE.Vector3(0, H - 0.9, 0), yaw: r() * 3, width: 0.7, height: 1.3, flat: false });
  const crown = standees(cards); crownNormals(crown, new THREE.Vector3(0, H * 0.5, 0), 0.25);
  return { trunk: shadedCard(trunk, p => 0.45 + 0.55 * Math.min(1, p.y / H)), crown: shadedCard(crown, p => 0.5 + 0.3 * Math.min(1, p.y / H) + 0.2 * Math.min(1, Math.hypot(p.x, p.z) / 0.9)), far: farCard(13), radius: 0.22 };
}
/** Strip a card geometry to position, normal and uv, with the baked occlusion `aShade`. */
function shadedCard(g: THREE.BufferGeometry, shade: (p: THREE.Vector3) => number): THREE.BufferGeometry {
  for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
  const pos = g.getAttribute('position'), a = new Float32Array(pos.count), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) a[i] = shade(v.fromBufferAttribute(pos, i));
  g.setAttribute('aShade', new THREE.BufferAttribute(a, 1)); return g;
}
/** The far tree as the near one seen from the side: drawn once into a texture, lit as its albedo (the card shader lights it as it lights the near tree), over nothing (the card's alpha). */
function impostorOf(renderer: THREE.WebGLRenderer, kind: number, sprite: THREE.Texture, leaf: string, barkTint: string, bark: THREE.Texture): THREE.Texture {
  const [W, FH] = CARDS[kind].frame, size = 256, rt = new THREE.WebGLRenderTarget(Math.round(size * W / FH), size, { format: THREE.RGBAFormat, colorSpace: THREE.LinearSRGBColorSpace });
  rt.texture.minFilter = THREE.LinearMipmapLinearFilter; rt.texture.generateMipmaps = true;
  const scene = new THREE.Scene(), k = treeKind(kind), sc = CARDS[kind].barkScale;
  const barkT = bark.clone(); barkT.repeat.set(sc[0], sc[1]); barkT.needsUpdate = true;
  scene.add(new THREE.Mesh(k.trunk, new THREE.MeshLambertMaterial({ color: barkTint, map: barkT, toneMapped: false })));
  scene.add(new THREE.Mesh(k.crown, new THREE.MeshLambertMaterial({ color: leaf, map: sprite, alphaTest: 0.5, side: THREE.DoubleSide, toneMapped: false })));
  scene.add(new THREE.HemisphereLight('#ffffff', '#8a8a80', 1.0)); const sun = new THREE.DirectionalLight('#fff4e0', 0.35); sun.position.set(0.5, 1, 1); scene.add(sun);
  const cam = new THREE.OrthographicCamera(-W / 2, W / 2, FH - 0.25, -0.25, -20, 20); cam.position.set(0, 0, 10); cam.lookAt(0, 0, 0);
  const target = renderer.getRenderTarget(), clear = renderer.getClearColor(new THREE.Color()), alpha = renderer.getClearAlpha();
  renderer.setRenderTarget(rt); renderer.setClearColor('#000000', 0); renderer.clear(); renderer.render(scene, cam);
  renderer.setRenderTarget(target); renderer.setClearColor(clear, alpha);
  k.trunk.dispose(); k.crown.dispose(); k.far.dispose();
  return rt.texture;
}
/** A boulder: a lumpy icosahedron, flat-shaded for the chunky facets of a painted rock. */
function rockGeometry(): THREE.BufferGeometry {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, 1); g.deleteAttribute('uv'); g = mergeVertices(g);
  const pos = g.getAttribute('position'), v = new THREE.Vector3(), r = rng(5);
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); v.multiplyScalar(0.8 + r() * 0.35); pos.setXYZ(i, v.x, v.y, v.z); }
  g = g.toNonIndexed(); g.computeVertexNormals();
  return shaded(g, p => 0.55 + 0.45 * Math.min(1, Math.max(0, p.y + 0.6)));
}
