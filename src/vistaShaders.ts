// The vista's GLSL, shared by every surface so the land, grass, trees, water and sky agree on one
// sun, one sky and one haze. The look is after Breath of the Wild: a soft cel terminator, blue
// sky-lit shade, painterly colour noise in place of textures, and aerial perspective that turns
// distance into the sky's own colour.

/** Hash and value noise; world coordinates run to several thousand, so everything is highp. */
export const NOISE = /* glsl */`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`;

/** The hour: sun, sky, ambient and haze. Shared uniform objects (see `atmosUniforms`). */
export const ATMOS = /* glsl */`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uZenith; uniform vec3 uHorizon;
uniform vec3 uAmbSky; uniform vec3 uAmbGround; uniform float uHaze; uniform float uHazeFall; uniform float uHazeBase; uniform float uTime;
uniform float uHazeBelow; // T6: the air's density below the haze's base, as a share of the density at the base (1: as thick as at the base; less, and the brink sees down to the lowland)
uniform vec4 uGloom; // a dark fog over everything (rgb, amount): the dark forest; its density is uGloomD
uniform float uGloomD; uniform float uStars;
uniform vec4 uUnder; // T8 (PLATEAU.md, the stratum): on a shallow ride under the soil, the soil's dark (rgb) and how far under she is (a, 0..1); uUnderD the density of the fog that closes in it
uniform float uUnderD;
vec3 skyColour(vec3 d){
  float y = max(d.y, 0.0);
  vec3 c = mix(uHorizon, uZenith, pow(y, 0.5));
  float s = max(dot(d, uSunDir), 0.0);
  c += uSunCol * (pow(s, 5.0) * 0.12 + pow(s, 48.0) * 0.35) * (1.0 - y * 0.5);
  return mix(c, uHorizon * 0.92, smoothstep(0.0, -0.25, d.y));
}
/** Aerial perspective: height fog integrated along the view ray, coloured by the sky toward the view. */
vec3 applyHaze(vec3 col, vec3 wp){
  vec3 v = wp - cameraPosition; float dist = length(v); vec3 d = v / max(dist, 1e-3);
  // Above the base the air thins with height (integrated along the ray); below it (T6) it is uHazeBelow of the base's, over the part of the ray that runs there.
  float y0 = cameraPosition.y - uHazeBase, y1 = wp.y - uHazeBase;
  float ya = max(y0, 0.0), yb = max(y1, 0.0), dy = yb - ya, e0 = exp(-ya * uHazeFall);
  float share = abs(y1 - y0) > 0.5 ? clamp((max(y0, 0.0) - max(y1, 0.0)) / (y0 - y1) * sign(y0 - y1) * sign(y0 - y1), 0.0, 1.0) : (y0 > 0.0 ? 1.0 : 0.0);
  float above = abs(dy) > 0.5 ? (e0 - exp(-yb * uHazeFall)) / (uHazeFall * dy) : e0;
  float integ = max(above, 0.0) * share + uHazeBelow * (1.0 - share);
  float amount = 1.0 - exp(-uHaze * dist * integ);
  vec3 hc = skyColour(normalize(vec3(d.x, clamp(d.y, 0.0, 1.0) * 0.35 + 0.03, d.z)));
  col = mix(col, hc, clamp(amount, 0.0, 1.0));
  col = mix(col, uGloom.rgb, uGloom.a * (1.0 - exp(-dist * uGloomD)));
  if (uUnder.a > 0.0) col = mix(col, uUnder.rgb, uUnder.a * (1.0 - exp(-dist * uUnderD)));
  return col;
}
/** The cel light: a soft terminator, sun only on the lit side, blue sky ambient everywhere. */
vec3 toon(vec3 albedo, vec3 n, float vis, float ao){
  float ndl = dot(n, uSunDir);
  float lit = smoothstep(-0.03, 0.22, ndl) * (0.72 + 0.28 * clamp(ndl, 0.0, 1.0)) * vis;
  vec3 amb = mix(uAmbGround, uAmbSky, n.y * 0.5 + 0.5) * ao;
  return albedo * (amb + uSunCol * lit);
}
`;

/** The map's data (G cavity AO, B water flow, A sediment; R is filled with the sun's visibility for the hour from uSunTex, baked at its own resolution),
 * the height texture, and the ground tint (rgb a colour laid over the land, a how much: the village's woods and dark forest). */
export const MAP = /* glsl */`
uniform sampler2D uMapData; uniform sampler2D uSunTex; uniform sampler2D uGround; uniform highp sampler2D uHeight; uniform float uMapHalf; uniform float uCell; uniform float uN; uniform float uSunN; uniform float uWaterY; uniform float uSnowY;
vec2 mapUV(vec2 xz){ return ((xz + uMapHalf) / uCell + 0.5) / uN; }
bool onMap(vec2 xz){ vec2 f = (xz + uMapHalf) / uCell; return f.x >= 0.0 && f.y >= 0.0 && f.x <= uN - 1.0 && f.y <= uN - 1.0; }
vec4 mapData(vec2 xz){
  if (!onMap(xz)) return vec4(1.0, 1.0, 0.0, 0.0);
  vec4 m = texture2D(uMapData, mapUV(xz)); float sc = (uN - 1.0) / (uSunN - 1.0);
  m.r = texture2D(uSunTex, ((xz + uMapHalf) / (uCell * sc) + 0.5) / uSunN).r; return m;
}
vec4 groundTint(vec2 xz){ return onMap(xz) ? texture2D(uGround, mapUV(xz)) : vec4(0.0); }
/** FOREST: how closed the canopy is overhead (0..1; the map's own red, which mapData lends the sun): the grass thins under it to leaf mould. */
float canopyAt(vec2 xz){ return onMap(xz) ? texture2D(uMapData, mapUV(xz)).r : 0.0; }
/** How much of the sun a closed canopy takes from what stands beneath it (the ground, the grass, the understory, the trunks). Tuning. */
const float CANOPY_SHADE = 0.62;
/** T4c: what lies on the floor at a point (villageVista.floorMap): r needles, g leaf mould, b moss and peat, a bare sand; each 0..1, their sum how much covers the land's own colour. */
uniform sampler2D uFloor;
vec4 floorAt(vec2 xz){ return onMap(xz) ? texture2D(uFloor, mapUV(xz)) : vec4(0.0); }
/** The same bilinear the near mesh and the walking use (vistaTerrain heightAt). */
float heightAt(vec2 xz){
  vec2 f = clamp((xz + uMapHalf) / uCell, vec2(0.0), vec2(uN - 1.001)); ivec2 i = ivec2(floor(f)); vec2 t = f - vec2(i);
  float a = texelFetch(uHeight, i, 0).r, b = texelFetch(uHeight, i + ivec2(1, 0), 0).r, c = texelFetch(uHeight, i + ivec2(0, 1), 0).r, d = texelFetch(uHeight, i + ivec2(1, 1), 0).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}
/** Height and the normal of its cell from the same four samples: what a blade needs, at a quarter of the fetches. */
float heightNormalAt(vec2 xz, out vec3 n){
  vec2 f = clamp((xz + uMapHalf) / uCell, vec2(0.0), vec2(uN - 1.001)); ivec2 i = ivec2(floor(f)); vec2 t = f - vec2(i);
  float a = texelFetch(uHeight, i, 0).r, b = texelFetch(uHeight, i + ivec2(1, 0), 0).r, c = texelFetch(uHeight, i + ivec2(0, 1), 0).r, d = texelFetch(uHeight, i + ivec2(1, 1), 0).r;
  n = normalize(vec3(-mix(b - a, d - c, t.y), uCell, -mix(c - a, d - b, t.x)));
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}
vec3 normalAtMap(vec2 xz){ float e = uCell; float hx = heightAt(xz + vec2(e, 0.0)) - heightAt(xz - vec2(e, 0.0)), hz = heightAt(xz + vec2(0.0, e)) - heightAt(xz - vec2(0.0, e)); return normalize(vec3(-hx, 2.0 * e, -hz)); }
`;

/** The land's colour: grass by noise and wetness, rock with strata on steep ground, scree where sediment settled, sand at the shore, snow up high. `grass` is how much grass may grow here. */
export const TERRAIN_ALBEDO = /* glsl */`
vec3 grassColour(vec2 p, vec4 md){
  float n1 = fbm3(p * 0.006), n2 = fbm3(p * 0.04), n3 = vnoise(p * 0.35);
  vec3 g = mix(srgb(vec3(0.60, 0.74, 0.27)), srgb(vec3(0.30, 0.52, 0.17)), smoothstep(0.35, 0.72, n1));
  g = mix(g, srgb(vec3(0.76, 0.72, 0.38)), smoothstep(0.58, 0.82, n2 * 0.6 + n1 * 0.4) * 0.55);
  g = mix(g, srgb(vec3(0.26, 0.48, 0.18)), smoothstep(0.12, 0.55, md.b) * 0.55);
  return g * (0.92 + 0.16 * n3);
}
vec3 rockColour(vec3 wp){
  vec2 p = wp.xz; float n1 = fbm3(p * 0.006), n2 = fbm3(p * 0.04 + wp.y * 0.02), n3 = vnoise(p * 0.35 + wp.y * 0.3);
  float strata = sin(wp.y * 0.42 + n2 * 5.0 + n1 * 8.0);
  vec3 r = mix(srgb(vec3(0.56, 0.53, 0.48)), srgb(vec3(0.68, 0.60, 0.48)), smoothstep(-0.3, 0.6, strata));
  r = mix(r, srgb(vec3(0.46, 0.44, 0.42)), smoothstep(0.7, 0.98, abs(strata)) * 0.4);
  return r * (0.86 + 0.24 * n3);
}
/** T6: the lowland far under the brink, as country looks from kilometres up: dark woods and paler plains in great patches, lakes and a wide water in the lowest ground. */
uniform float uLowY;
vec3 lowlandColour(vec2 p){
  float n1 = fbm3(p * 0.00035 + 4.0), n2 = fbm3(p * 0.0011 - 2.0), water = fbm3(p * 0.00022 + 9.0);
  vec3 c = mix(srgb(vec3(0.09, 0.17, 0.07)), srgb(vec3(0.32, 0.38, 0.18)), smoothstep(0.42, 0.62, n1 * 0.7 + n2 * 0.3));
  c = mix(c, srgb(vec3(0.26, 0.21, 0.15)), smoothstep(0.66, 0.8, n2) * 0.5);
  return mix(c, srgb(vec3(0.12, 0.22, 0.3)), smoothstep(0.42, 0.37, water));
}
vec3 terrainAlbedo(vec3 wp, vec3 n, vec4 md, out float grass){
  vec2 p = wp.xz; float slope = 1.0 - n.y, n1 = fbm3(p * 0.006), n2 = fbm3(p * 0.04), n3 = vnoise(p * 0.35);
  float rockAmt = smoothstep(0.26, 0.38, slope + (n2 - 0.5) * 0.12);
  float screeAmt = smoothstep(0.3, 0.75, md.a) * (1.0 - rockAmt) * smoothstep(0.05, 0.18, slope);
  vec3 col = mix(grassColour(p, md), srgb(vec3(0.64, 0.60, 0.52)) * (0.9 + 0.2 * n3), screeAmt);
  float bed = smoothstep(0.6, 0.92, md.b) * (1.0 - rockAmt);
  col = mix(col, srgb(vec3(0.54, 0.45, 0.33)), bed * 0.65);
  col = mix(col, rockColour(wp), rockAmt);
  // T6: the shore is the lake's: land far below the water's level (the lowland under the cloud) is no beach.
  float shore = (1.0 - smoothstep(uWaterY + 0.25, uWaterY + 0.9 + n3 * 0.6, wp.y)) * (1.0 - smoothstep(uWaterY - 4.0, uWaterY - 14.0, wp.y));
  col = mix(col, srgb(vec3(0.74, 0.68, 0.52)) * (0.9 + 0.15 * n3), shore * (1.0 - rockAmt));
  float snow = smoothstep(uSnowY - 25.0, uSnowY + 25.0, wp.y + (n1 - 0.5) * 90.0) * (1.0 - smoothstep(0.32, 0.48, slope + (n3 - 0.5) * 0.1));
  col = mix(col, srgb(vec3(0.86, 0.89, 0.95)) * (0.9 + 0.1 * n2 + 0.05 * n3), snow);
  grass = (1.0 - rockAmt) * (1.0 - screeAmt) * (1.0 - shore) * (1.0 - snow) * (1.0 - bed * 0.8);
  float low = smoothstep(uLowY + 400.0, uLowY - 200.0, wp.y);
  if (low > 0.0) { col = mix(col, lowlandColour(p), low * (1.0 - rockAmt * 0.6)); grass *= 1.0 - low; }
  vec4 gt = groundTint(p);
  col = mix(col, gt.rgb * (0.85 + 0.3 * n3), gt.a * (1.0 - rockAmt));
  grass *= 1.0 - gt.a * 0.45;
  return col;
}
`;

/** Where the village stands: up to three masks, each a square (x0, z0, side) drawn from above (north up, so v runs against z).
 * R: anything built (no grass), G: a worn path or the green (painted as a trodden trail). */
export const CLEAR = /* glsl */`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`;

export const SHADOW_VERT = /* glsl */`
#include <common>
#include <shadowmap_pars_vertex>
`;
export const SHADOW_FRAG = /* glsl */`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`;
/** Every surface ends the same way: haze, then the renderer's tone mapping and colour space. */
export const FINISH = /* glsl */`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`;

// ── the land ─────────────────────────────────────────────────────────────
export const terrainVert = /* glsl */`
${SHADOW_VERT}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
export const terrainFrag = /* glsl */`
${SHADOW_FRAG}
${NOISE}${ATMOS}${MAP}${TERRAIN_ALBEDO}${CLEAR}
varying vec3 vWorld; varying vec3 vNormal;
uniform vec4 uSoil; // x, z, amount: within reach of her the ground thins to glass while she is beneath it (groundVision)
// T4c (PINE BARRENS): the floor's detail, tiling textures (groundTextures.ts) weighed by the floor map: sand where the canopy opens, needles under the pines, leaf mould under the oaks, moss and peat by the water.
uniform sampler2D uTexSand; uniform sampler2D uTexNeedles; uniform sampler2D uTexLeaves; uniform sampler2D uTexMoss;
const float FLOOR_TILE = 2.4;
vec3 floorDetail(vec2 p, vec4 fl){
  vec2 t = p / FLOOR_TILE, t2 = p / (FLOOR_TILE * 2.9) + 0.37;
  // Two scales of each, so the tiling never reads as a grid.
  vec3 sand = mix(texture2D(uTexSand, t).rgb, texture2D(uTexSand, t2).rgb, 0.4);
  vec3 nd = mix(texture2D(uTexNeedles, t).rgb, texture2D(uTexNeedles, t2).rgb, 0.4);
  vec3 lv = mix(texture2D(uTexLeaves, t * 1.15).rgb, texture2D(uTexLeaves, t2).rgb, 0.4);
  vec3 ms = mix(texture2D(uTexMoss, t).rgb, texture2D(uTexMoss, t2).rgb, 0.4);
  return (sand * fl.a + nd * fl.r + lv * fl.g + ms * fl.b) / max(fl.r + fl.g + fl.b + fl.a, 1e-3);
}
/** T8: the soil as seen from a shallow ride: dark earth with a grain of root threads and stones, no sun on it, lit by a glow about her (uSoil.xy) that is gone a few metres out. The land's underside is this; its top turns to it as she goes under (she is beneath the grass: no lit meadow). */
vec3 soilEarth(vec2 p){
  float g = fbm3(p * 0.6), f = vnoise(p * 2.3), thread = smoothstep(0.1, 0.0, abs(vnoise(p * 1.4 + 7.0) - 0.5)) * 0.45, stone = smoothstep(0.86, 0.92, vnoise(p * 6.1 + 3.0));
  vec3 earth = mix(srgb(vec3(0.24, 0.16, 0.10)), srgb(vec3(0.38, 0.28, 0.17)), g) * (0.8 + 0.4 * f) * (1.0 - thread);
  earth = mix(earth, srgb(vec3(0.46, 0.44, 0.40)) * (0.7 + 0.5 * f), stone);
  return earth * (0.3 + 1.1 * exp(-distance(p, uSoil.xy) / 14.0));
}
void main(){
  vec3 n = normalize(vNormal);
  vec2 p = vWorld.xz;
  float soil = 1.0 - 0.78 * uSoil.z * (1.0 - smoothstep(14.0, 28.0, distance(p, uSoil.xy)));
  // T8: the land seen from beneath (its normal turned away from the eye: the underside of a hillside on a ride, never a skirt seen from above) is soil, not the lit ground.
  if (dot(vWorld - cameraPosition, n) > 0.0) { gl_FragColor = vec4(applyHaze(soilEarth(p), vWorld), soil); ${FINISH} return; }
  // A painterly bump: the normal leans with two scales of noise, so flat ground is not flat-lit.
  float e = 0.6;
  float b0 = fbm3(p * 0.45), bx = fbm3((p + vec2(e, 0.0)) * 0.45), bz = fbm3((p + vec2(0.0, e)) * 0.45);
  n = normalize(n + vec3(b0 - bx, 0.0, b0 - bz) * 0.9);
  vec4 md = mapData(p);
  float g; vec3 albedo = terrainAlbedo(vWorld, n, md, g);
  // A trodden trail where the village walks: packed earth, lighter down its middle, its edge ragged with grass.
  float trail = clearAt(p).y;
  if (trail > 0.01) { float rag = vnoise(p * 1.7) * 0.35 + vnoise(p * 6.0) * 0.15; float k = smoothstep(0.25, 0.6, trail + rag - 0.25);
    vec3 earth = mix(srgb(vec3(0.55, 0.45, 0.31)), srgb(vec3(0.70, 0.61, 0.44)), smoothstep(0.6, 1.0, trail)) * (0.9 + 0.2 * vnoise(p * 3.1));
    albedo = mix(albedo, earth, k); }
  vec4 fl = floorAt(p); float cover = min(1.0, fl.r + fl.g + fl.b + fl.a);
  if (cover > 0.01) albedo = mix(albedo, floorDetail(p, fl) * (0.82 + 0.36 * fbm3(p * 0.07)), cover * (1.0 - smoothstep(0.2, 0.5, trail)));
  float vis = min(md.r * (1.0 - CANOPY_SHADE * canopyAt(p)), getShadowMask());
  vec3 col = toon(albedo, n, vis, mix(0.55, 1.0, md.g));
  // T8: under the grass the land's top is earth too, over the rock (seen through the glass about her), not the sunlit meadow.
  if (uUnder.a > 0.0) col = mix(col, soilEarth(p), uUnder.a);
  gl_FragColor = vec4(applyHaze(col, vWorld), soil);
  ${FINISH}
}`;

// ── the grass ────────────────────────────────────────────────────────────
/** One blade per instance in a square patch that wraps around the camera, so the blades stay put in the world. */
/** The ground near her at a finer step than the map (x0, z0, side, texels): blades stand on the walked surface, and the stratum (T8) runs under it. */
export const FINE = /* glsl */`
uniform highp sampler2D uFine; uniform vec4 uFineAt;
float fineHeight(vec2 xz, float coarse){
  vec2 f = (xz - uFineAt.xy) / uFineAt.z * (uFineAt.w - 1.0);
  if (uFineAt.w < 2.0 || any(lessThan(f, vec2(0.0))) || any(greaterThanEqual(f, vec2(uFineAt.w - 1.0)))) return coarse;
  ivec2 i = ivec2(floor(f)); vec2 t = f - vec2(i);
  float a = texelFetch(uFine, i, 0).r, b = texelFetch(uFine, i + ivec2(1, 0), 0).r, c = texelFetch(uFine, i + ivec2(0, 1), 0).r, d = texelFetch(uFine, i + ivec2(1, 1), 0).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}
`;
export const grassVert = /* glsl */`
${SHADOW_VERT}
${NOISE}${ATMOS}${MAP}${TERRAIN_ALBEDO}${CLEAR}${FINE}
attribute vec4 aBlade; // x, z in the patch; size; rotation
attribute vec4 aTuft; // the blade within its tuft: angle, offset x, offset z, height
uniform vec2 uCenter; uniform float uPatch; uniform float uBladeH; uniform float uBladeW; uniform vec2 uWind;
varying vec3 vWorld; varying vec3 vCol; varying vec3 vN; varying float vY; varying float vGust; varying vec2 vMd;
void main(){
  vec2 rel = mod(aBlade.xy - uCenter + 0.5 * uPatch, uPatch) - 0.5 * uPatch, xz = uCenter + rel;
  float dist = length(rel);
  vec4 md = mapData(xz); vec3 n; float h = heightNormalAt(xz, n), g;
  vec3 base = terrainAlbedo(vec3(xz.x, h, xz.y), n, md, g);
  float fade = 1.0 - smoothstep(uPatch * 0.3, uPatch * 0.5, dist);
  h = fineHeight(xz, h);
  float hgt = uBladeH * (0.45 + 0.55 * aBlade.z) * smoothstep(0.3, 0.7, g) * fade * (1.0 + md.b * 0.8) * (0.7 + 0.6 * vnoise(xz * 0.08)) * (1.0 - smoothstep(0.2, 0.5, max(clearAt(xz).x, clearAt(xz).y))) * (1.0 - 0.94 * smoothstep(0.06, 0.55, canopyAt(xz)));
  if (hgt < 0.015 || h < uWaterY + 0.2) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float y = position.y, ang = aBlade.w + aTuft.x, c = cos(ang), s = sin(ang), cr = cos(aBlade.w), sr = sin(aBlade.w);
  hgt *= aTuft.w;
  float w = position.x * (1.0 - y * 0.88) * uBladeW * (0.7 + 0.6 * aBlade.z);
  vec3 local = vec3(w * c + aTuft.y * cr - aTuft.z * sr, y * hgt, w * s + aTuft.y * sr + aTuft.z * cr);
  // Wind: a steady lean, a flutter per blade, and gusts that sweep across the field as bright waves.
  float gust = smoothstep(0.42, 0.85, vnoise(xz * 0.035 - uWind * uTime * 0.12));
  float flutter = sin(uTime * 2.3 + dot(xz, vec2(0.9, 0.5)) + aBlade.z * 9.0) * 0.1;
  vec2 bend = uWind * (0.18 + gust * 0.75) + vec2(flutter, flutter * 0.6) + vec2(c, s) * 0.12 * (aBlade.z - 0.5);
  local.xz += bend * y * y * hgt; local.y -= dot(bend, bend) * y * y * hgt * 0.25;
  vec4 worldPosition = vec4(xz.x + local.x, h - 0.05 + local.y, xz.y + local.z, 1.0);
  vWorld = worldPosition.xyz; vY = y; vGust = gust; vMd = vec2(md.r * (1.0 - CANOPY_SHADE * canopyAt(xz)), md.g);
  vN = normalize(mix(n, vec3(0.0, 1.0, 0.0), 0.35));
  vCol = base * (0.92 + 0.16 * aBlade.z);
  vec3 transformedNormal = normalMatrix * vN;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
export const grassFrag = /* glsl */`
${SHADOW_FRAG}
${NOISE}${ATMOS}
varying vec3 vWorld; varying vec3 vCol; varying vec3 vN; varying float vY; varying float vGust; varying vec2 vMd;
void main(){
  vec3 tip = mix(vCol * 1.3, srgb(vec3(0.86, 0.86, 0.48)), 0.22);
  vec3 albedo = mix(vCol * 0.55, tip, smoothstep(0.0, 1.0, vY));
  float vis = min(vMd.r, getShadowMask());
  vec3 col = toon(albedo, vN, vis, mix(0.5, 1.0, vMd.g) * (0.55 + 0.45 * vY));
  vec3 v = normalize(vWorld - cameraPosition);
  // Backlit blades glow; a passing gust silvers the tips.
  col += uSunCol * albedo * pow(max(dot(v, uSunDir), 0.0), 3.0) * 0.6 * vY * vis;
  col += (uSunCol * 0.06 + uAmbSky * 0.25) * vGust * vY * vY;
  gl_FragColor = vec4(applyHaze(col, vWorld), 1.0);
  ${FINISH}
}`;

// ── trees, trunks and rocks ─────────────────────────────────────────────
/** Instanced solids. `aShade` is baked occlusion; foliage sways by height (USE_SWAY); ROCK colours by strata and moss. */
export const solidVert = /* glsl */`
${SHADOW_VERT}
${NOISE}
uniform float uTime;
attribute float aShade;
varying vec3 vWorld; varying vec3 vN; varying float vShade; varying vec2 vBase;
#ifdef BARK
varying vec2 vUv;
#endif
void main(){
  mat4 m = modelMatrix * instanceMatrix;
  vec4 worldPosition = m * vec4(position, 1.0);
  vBase = m[3].xz;
#ifdef BARK
  vUv = uv;
#endif
#ifdef USE_SWAY
  float k = max(position.y, 0.0) * 0.012;
  worldPosition.x += sin(uTime * 1.1 + vBase.x * 0.37 + position.y * 0.4) * k * (1.0 + sin(uTime * 0.3 + vBase.y) );
  worldPosition.z += cos(uTime * 0.9 + vBase.y * 0.31 + position.x * 0.5) * k;
#endif
#ifdef TWITCH
  // MOTHER.md: the tainted wood's dead trees twitch and reach: still, then a sudden jerk that relaxes slowly, each on its own beat, and a slow lean toward the breach's heart.
  float seedT = fract(sin(dot(vBase, vec2(12.9898, 78.233))) * 43758.5453);
  float beat = uTime * (0.18 + 0.12 * seedT) + seedT * 7.0, ph = fract(beat);
  float jerk = smoothstep(0.0, 0.025, ph) * (1.0 - smoothstep(0.025, 0.35, ph));
  float ang = (floor(beat) * 2.399 + seedT * 6.283);
  float kt = max(position.y, 0.0) / 4.5;
  worldPosition.xz += vec2(cos(ang), sin(ang)) * kt * kt * (0.35 * jerk) + vec2(sin(uTime * 0.31 + seedT * 9.0), cos(uTime * 0.27 + seedT * 5.0)) * kt * 0.06;
#endif
#ifdef PULSE
  // The nursery's growths breathe: they swell and fall, out of time with each other.
  float seedP = fract(sin(dot(vBase, vec2(39.346, 11.135))) * 24634.6345);
  float swell = sin(uTime * (0.9 + seedP * 0.5) + seedP * 6.283) * 0.06 * clamp(position.y / 3.0, 0.0, 1.0);
  worldPosition.xz += (worldPosition.xz - vBase) * swell;
  worldPosition.y += swell * 0.6;
#endif
  vec3 wn = normalize(mat3(m) * normal);
  vec3 transformedNormal = mat3(viewMatrix) * wn;
  vWorld = worldPosition.xyz; vN = wn; vShade = aShade;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
export const solidFrag = /* glsl */`
${SHADOW_FRAG}
${NOISE}${ATMOS}${MAP}
#ifdef ROCK
${TERRAIN_ALBEDO}
#endif
uniform vec3 uColor;
varying vec3 vWorld; varying vec3 vN; varying float vShade; varying vec2 vBase;
#ifdef BARK
// T4c: bark as a tiling texture (groundTextures.ts), uBarkScale repeats along and round the trunk; uColor tints it.
uniform sampler2D uBark; uniform vec2 uBarkScale;
varying vec2 vUv;
#endif
void main(){
  vec3 n = normalize(vN);
  float tint = hash12(floor(vBase * 0.37));
  vec4 md = mapData(vBase);
#ifdef ROCK
  vec3 albedo = rockColour(vWorld * vec3(1.0, 2.5, 1.0));
  float moss = smoothstep(0.55, 0.85, n.y + (vnoise(vWorld.xz * 1.3) - 0.5) * 0.4);
  albedo = mix(albedo, grassColour(vWorld.xz, md) * 0.8, moss);
#elif defined(BARK)
  vec3 albedo = uColor * texture2D(uBark, vUv * uBarkScale).rgb * (0.85 + 0.3 * tint);
#else
  vec3 albedo = uColor * (0.85 + 0.3 * tint);
#ifdef VARIED
  // Groves of a warmer or a cooler green, and the odd tree already turning: a wood seen from above is not one colour.
  float grove = fbm3(vBase * 0.006);
  albedo *= mix(vec3(1.12, 1.04, 0.78), vec3(0.82, 0.98, 1.12), smoothstep(0.3, 0.7, grove));
  albedo = mix(albedo, srgb(vec3(0.78, 0.62, 0.22)), step(0.94, hash12(floor(vBase * 0.5) + 7.0)) * 0.6);
#endif
  albedo *= 0.82 + 0.36 * fbm3(vWorld.xz * 1.7 + vWorld.y * 1.3);
#endif
  float vis = min(md.r, getShadowMask());
#ifdef UNDER
  vis *= 1.0 - CANOPY_SHADE * canopyAt(vBase);
#endif
#ifdef ROCK
  vec3 col = toon(albedo, n, vis, vShade);
#else
  // Leaves and bark take the sky from every side (BotW's trees are never black underneath): the normal leans up for the ambient.
  vec3 col = toon(albedo, n, vis, vShade) + albedo * uAmbSky * 0.35 * vShade;
#endif
#ifdef USE_SWAY
  vec3 v = normalize(vWorld - cameraPosition);
  col += uSunCol * albedo * pow(max(dot(v, uSunDir), 0.0), 4.0) * 0.45 * vis;
#endif
  gl_FragColor = vec4(applyHaze(col, vWorld), 1.0);
  ${FINISH}
}`;

// ── cards: textured, alpha-tested standees (PINE BARRENS, Noah, 2026-10-21) ──
/** The pitch pines' needle tufts, the far trees' impostors and the understory, drawn as crossed cards (sprites.ts' standees) through
 * the vista's own light: the texture gives the needle and leaf detail a lumpy mesh never had, at a few triangles a card; the per-pixel
 * noise the solid foliage pays is replaced by a per-instance tint (a wood is not one colour, but one tree is). `aShade` is baked
 * occlusion, `normal` the crown-volume normal the card was given (not the card's face), so a crown shades as one soft mass. */
export const cardVert = /* glsl */`
${SHADOW_VERT}
${NOISE}
uniform float uTime;
attribute float aShade;
varying vec3 vWorld; varying vec3 vN; varying float vShade; varying vec2 vBase; varying vec2 vUv;
void main(){
  mat4 m = modelMatrix * instanceMatrix;
  vec4 worldPosition = m * vec4(position, 1.0);
  vBase = m[3].xz;
#ifdef USE_SWAY
  float k = max(position.y, 0.0) * 0.012;
  worldPosition.x += sin(uTime * 1.1 + vBase.x * 0.37 + position.y * 0.4) * k * (1.0 + sin(uTime * 0.3 + vBase.y));
  worldPosition.z += cos(uTime * 0.9 + vBase.y * 0.31 + position.x * 0.5) * k;
#endif
  vec3 wn = normalize(mat3(m) * normal);
  vec3 transformedNormal = mat3(viewMatrix) * wn;
  vWorld = worldPosition.xyz; vN = wn; vShade = aShade; vUv = uv;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;
export const cardFrag = /* glsl */`
${SHADOW_FRAG}
${NOISE}${ATMOS}${MAP}
uniform vec3 uColor; uniform sampler2D uMap;
varying vec3 vWorld; varying vec3 vN; varying float vShade; varying vec2 vBase; varying vec2 vUv;
void main(){
  vec4 t = texture2D(uMap, vUv);
  if (t.a < 0.5) discard;
  // A card she is standing in (the understory is walked through) dissolves within arm's reach of the camera rather than filling the view.
  if (distance(vWorld.xz, cameraPosition.xz) < 0.9 + hash12(gl_FragCoord.xy) * 0.7) discard;
  vec3 n = normalize(vN);
  // Per tree: a little lighter or darker, warmer or cooler (the texture is drawn in pale neutral tones: the colour is the material's).
  float tint = hash12(floor(vBase * 0.37)), warm = hash12(floor(vBase * 0.37) + 5.0);
  vec3 albedo = uColor * t.rgb * (0.8 + 0.4 * tint) * mix(vec3(1.08, 1.02, 0.86), vec3(0.9, 1.0, 1.08), warm);
  vec4 md = mapData(vBase);
  float vis = min(md.r, getShadowMask());
#ifdef UNDER
  vis *= 1.0 - CANOPY_SHADE * canopyAt(vBase);
#endif
  vec3 col = toon(albedo, n, vis, vShade) + albedo * uAmbSky * 0.2 * vShade;
#ifdef USE_SWAY
  // Needles and leaves let the low sun through.
  vec3 v = normalize(vWorld - cameraPosition);
  col += uSunCol * albedo * pow(max(dot(v, uSunDir), 0.0), 4.0) * 0.45 * vis;
#endif
  gl_FragColor = vec4(applyHaze(col, vWorld), 1.0);
  ${FINISH}
}`;

// ── the cloud sea (T6, Noah 2026-10-21) ──
/** A sea of cloud far below the brink: two sheets (vistaWorld sets their heights) of slow fbm coverage, breaking here and there to the lowland
 * beneath, their tops lit toward the sun and shaded in the troughs, hazed like everything else; the inner edge fades in under the escarpment. */
export const cloudVert = /* glsl */`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
export const cloudFrag = /* glsl */`
${NOISE}${ATMOS}
uniform vec3 uCloudSea; // the sea's centre (x, z) and the radius where it begins (under the belt's foot)
uniform float uCloudCover; // 0..1: how much of the sky it hides (the breaks are the rest)
uniform float uCloudDrift;
varying vec3 vWorld;
void main(){
  // The sea's shape: great slow swells (the breaks are hundreds of metres wide; both sheets share them, so a break is a break) with smaller billows on them, each sheet's own.
  vec2 p = vWorld.xz * 0.0009 + uTime * vec2(0.0035, 0.0012), q = p + uCloudDrift;
  float big = fbm5(p * 0.3 + 3.0), mid = fbm5(p * 1.6 + 11.0), n = big * 0.78 + mid * 0.22;
  // The breaks: where the swell sinks the cover opens (both sheets together), ragged at the billows' scale (each sheet's own).
  float c0 = 0.70 - uCloudCover * 0.25; // the noise's own middle is near 0.61: cover 0.55 opens about a quarter of the sea
  float cov = smoothstep(c0, c0 + 0.05, n + (fbm3(q * 6.0 - 5.0) - 0.5) * 0.07);
  float edge = smoothstep(uCloudSea.z - 400.0, uCloudSea.z + 200.0, distance(vWorld.xz, uCloudSea.xy));
  float a = cov * edge;
  if (a < 0.01) discard;
  // Lit from the sun's side: the tops white, the hollows in the sea's own shade, blue with the sky.
  vec2 toSun = normalize(uSunDir.xz + 1e-4) * 0.09;
  float n2 = fbm5((p + toSun) * 0.3 + 3.0) * 0.5 + fbm5((q + toSun) * 1.6 + 11.0) * 0.5, n3 = big * 0.5 + fbm5(q * 1.6 + 11.0) * 0.5;
  float lit = clamp(0.5 + (n3 - n2) * 9.0, 0.0, 1.0) * clamp(uSunDir.y * 2.0 + 0.3, 0.15, 1.0);
  vec3 sunW = uSunCol / max(max(uSunCol.r, uSunCol.g), max(uSunCol.b, 1e-3));
  vec3 top = mix(vec3(0.9), sunW, 0.25) * (0.75 + 0.45 * clamp(uSunDir.y + 0.2, 0.0, 1.0)), hollow = uAmbSky * 0.55 + uHorizon * 0.12 + vec3(0.03);
  vec3 col = mix(hollow, top, lit) * (0.9 + 0.1 * fbm3(p * 13.0));
  gl_FragColor = vec4(applyHaze(col, vWorld), a * 0.985);
  ${FINISH}
}`;

// ── water ────────────────────────────────────────────────────────────────
export const waterVert = /* glsl */`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
export const waterFrag = /* glsl */`
${NOISE}${ATMOS}${MAP}
varying vec3 vWorld;
float waves(vec2 p){ return vnoise(p * 0.35 + uTime * vec2(0.05, 0.03)) * 0.6 + vnoise(p * 1.1 - uTime * vec2(0.04, -0.07)) * 0.3 + vnoise(p * 3.3 + uTime * vec2(-0.12, 0.1)) * 0.1; }
void main(){
  vec2 p = vWorld.xz; float depth = uWaterY - heightAt(p);
  // Ripples calm with distance, so far water reads as a smooth sheet rather than glitter.
  float e = 0.15, w0 = waves(p), calm = 1.0 / (1.0 + length(vWorld - cameraPosition) * 0.02);
  vec3 n = normalize(vec3((w0 - waves(p + vec2(e, 0.0))) * 1.2 * calm, e * 3.0, (w0 - waves(p + vec2(0.0, e))) * 1.2 * calm));
  vec3 v = normalize(cameraPosition - vWorld);
  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec3 refl = skyColour(reflect(-v, n));
  vec4 md = mapData(p);
  vec3 body = mix(srgb(vec3(0.32, 0.80, 0.74)), srgb(vec3(0.07, 0.36, 0.55)), 1.0 - exp(-max(depth, 0.0) * 0.3));
  body *= uAmbSky * 1.1 + uSunCol * 0.45 * md.r;
  vec3 col = mix(body, refl, clamp(fres * 0.8, 0.0, 0.7));
  col += uSunCol * pow(max(dot(reflect(-uSunDir, n), v), 0.0), 220.0) * 3.0 * md.r;
  float foam = 1.0 - smoothstep(0.0, 0.35 + 0.35 * vnoise(p * 2.0 + uTime * 0.3), depth);
  col = mix(col, (uAmbSky + uSunCol * md.r) * 0.85, foam * 0.75);
  float alpha = clamp(smoothstep(-0.05, 0.6, depth) * 0.82 + fres * 0.2, 0.0, 1.0);
  gl_FragColor = vec4(applyHaze(col, vWorld), alpha * (1.0 - uUnder.a)); // T8: the water plane lies under the land; from a shallow ride it would show through the glassy soil as a bright sheet
  ${FINISH}
}`;

// ── sky ──────────────────────────────────────────────────────────────────
// ── the stratum (T8, PLATEAU.md) ─────────────────────────────────────────
/** The rock under the soil: a sheet of cells about the camera (uStratumAt: x0, z0 of the sheet), each vertex lowered uSoilDepth under the walked surface (the fine window where it reaches, the map beyond). */
export const stratumVert = /* glsl */`
${MAP}${FINE}
uniform vec2 uStratumAt; uniform float uSoilDepth;
varying vec3 vWorld; varying vec3 vN;
void main(){
  vec2 xz = uStratumAt + position.xz; vec3 n; float h = heightNormalAt(xz, n); h = fineHeight(xz, h);
  vWorld = vec3(xz.x, h - uSoilDepth, xz.y); vN = n;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}`;
/** Dark wet rock: a grain of strata seams and mottling from the shared noise (no texture), the glint of wet stone, lit faintly from where she is and no further; the under fog has the rest. Both faces. */
export const stratumFrag = /* glsl */`
${NOISE}${ATMOS}
uniform vec4 uSoil;
varying vec3 vWorld; varying vec3 vN;
void main(){
  vec3 n = normalize(vN); vec2 p = vWorld.xz;
  float g = fbm3(p * 0.35), f = vnoise(p * 3.7), seam = smoothstep(0.12, 0.0, abs(vnoise(p * 0.9 + 11.0) - 0.5));
  vec3 rock = mix(srgb(vec3(0.20, 0.19, 0.18)), srgb(vec3(0.34, 0.32, 0.29)), g) * (0.85 + 0.3 * f) * (1.0 - 0.5 * seam);
  float lamp = 0.3 + 1.4 * exp(-distance(p, uSoil.xy) / 14.0);
  vec3 col = (rock * (0.6 + 0.4 * abs(n.y)) + pow(f, 6.0) * 0.12) * lamp;
  gl_FragColor = vec4(applyHaze(col, vWorld), 1.0);
  ${FINISH}
}`;

export const skyVert = /* glsl */`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`;
export const skyFrag = /* glsl */`
${NOISE}${ATMOS}
uniform float uCloud;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  vec3 col = skyColour(d);
  float s = dot(d, uSunDir);
  col += uSunCol * smoothstep(0.99955, 0.99975, s) * 6.0;
  if (d.y > 0.0) {
    // Painted cumulus: an fbm layer on a plane, its lit side found by stepping toward the sun.
    vec2 cp = d.xz / (max(d.y, 0.06) + 0.1) * 1.4 + uTime * vec2(0.006, 0.002);
    float c = fbm5(cp), c2 = fbm5(cp + normalize(uSunDir.xz + 1e-4) * 0.09);
    // T6: none at the horizon (seen from the brink the low sky is open, and the sheet smeared into bands there).
    float cov = smoothstep(0.62 - uCloud * 0.2, 0.85 - uCloud * 0.2, c) * smoothstep(0.08, 0.32, d.y);
    float lit = clamp(0.55 + (c - c2) * 5.0, 0.0, 1.0);
    vec3 cloud = mix(uAmbSky * 0.75 + uHorizon * 0.25, uHorizon * 0.55 + uSunCol * 0.38, lit);
    cloud += uSunCol * pow(max(s, 0.0), 8.0) * 0.4 * (1.0 - cov);
    col = mix(col, cloud, cov * 0.92);
  }
  // Stars at night: a hashed field on the dome, twinkling a little.
  if (uStars > 0.0 && d.y > 0.0) { vec2 sp = vec2(atan(d.z, d.x) * 120.0, d.y * 160.0); vec2 cell = floor(sp); float h = hash12(cell); float st = step(0.985, h) * smoothstep(0.35, 0.0, length(fract(sp) - 0.5)) * (0.6 + 0.4 * sin(uTime * 2.0 + h * 40.0)); col += vec3(st * 1.4 * uStars) * smoothstep(0.0, 0.25, d.y); }
  col = mix(col, uGloom.rgb, uGloom.a * 0.85 + uGloom.a * uGloom.a * 0.13);
  col = mix(col, uUnder.rgb, uUnder.a); // T8: no sky from under the soil
  gl_FragColor = vec4(col, 1.0);
  ${FINISH}
}`;
