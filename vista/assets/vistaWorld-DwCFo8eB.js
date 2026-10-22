import{X as Qa,Y as Ja,a6 as eo,aw as to,ax as ao,G as ia,a5 as Se,ay as yt,az as et,aA as tt,aB as la,ab as rt,aC as ua,aD as ca,i as $e,am as at,C as ue,V as d,k as Te,M as ce,ag as Le,Z as oo,r as Ma,b as ro,l as At,R as no,z as xt,_ as ot,aE as so,aF as io,I as da,w as Tt,Q as fa,x as Sa,aj as ma,e as Ct,ak as lo,al as uo,g as co,aG as fo,aH as mo,S as ho,ao as ha,H as vo,D as po,an as wo,u as zt,n as q,d as va,a4 as kt,v as Dt,j as Ft,J as nt,aI as go,aJ as bo,s as yo}from"./BufferGeometryUtils-BMCnC2iH.js";import{r as se,e as pa,n as xo,s as zo}from"./vistaTerrain-BQ6jDvM3.js";import{b as wa,a as Pt,c as Mo}from"./sprites-B8NOVg88.js";import{m as So}from"./colors-BKJfVazC.js";const te=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,fe=`
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
`,We=`
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
`,Bt=`
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
`,Aa=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,st=`
#include <common>
#include <shadowmap_pars_vertex>
`,it=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,de=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Ao=`
${st}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,To=`
${it}
${te}${fe}${We}${Bt}${Aa}
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
  if (dot(vWorld - cameraPosition, n) > 0.0) { gl_FragColor = vec4(applyHaze(soilEarth(p), vWorld), soil); ${de} return; }
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
  ${de}
}`,Ta=`
uniform highp sampler2D uFine; uniform vec4 uFineAt;
float fineHeight(vec2 xz, float coarse){
  vec2 f = (xz - uFineAt.xy) / uFineAt.z * (uFineAt.w - 1.0);
  if (uFineAt.w < 2.0 || any(lessThan(f, vec2(0.0))) || any(greaterThanEqual(f, vec2(uFineAt.w - 1.0)))) return coarse;
  ivec2 i = ivec2(floor(f)); vec2 t = f - vec2(i);
  float a = texelFetch(uFine, i, 0).r, b = texelFetch(uFine, i + ivec2(1, 0), 0).r, c = texelFetch(uFine, i + ivec2(0, 1), 0).r, d = texelFetch(uFine, i + ivec2(1, 1), 0).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}
`,Co=`
${st}
${te}${fe}${We}${Bt}${Aa}${Ta}
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
}`,ko=`
${it}
${te}${fe}
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
  ${de}
}`,ga=`
${st}
${te}
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
}`,ba=`
${it}
${te}${fe}${We}
#ifdef ROCK
${Bt}
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
  ${de}
}`,Do=`
${st}
${te}
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
}`,Fo=`
${it}
${te}${fe}${We}
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
  ${de}
}`,Po=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Bo=`
${te}${fe}
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
  ${de}
}`,Ho=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Wo=`
${te}${fe}${We}
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
  ${de}
}`,Uo=`
${We}${Ta}
uniform vec2 uStratumAt; uniform float uSoilDepth;
varying vec3 vWorld; varying vec3 vN;
void main(){
  vec2 xz = uStratumAt + position.xz; vec3 n; float h = heightNormalAt(xz, n); h = fineHeight(xz, h);
  vWorld = vec3(xz.x, h - uSoilDepth, xz.y); vN = n;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}`,Ro=`
${te}${fe}
uniform vec4 uSoil;
varying vec3 vWorld; varying vec3 vN;
void main(){
  vec3 n = normalize(vN); vec2 p = vWorld.xz;
  float g = fbm3(p * 0.35), f = vnoise(p * 3.7), seam = smoothstep(0.12, 0.0, abs(vnoise(p * 0.9 + 11.0) - 0.5));
  vec3 rock = mix(srgb(vec3(0.20, 0.19, 0.18)), srgb(vec3(0.34, 0.32, 0.29)), g) * (0.85 + 0.3 * f) * (1.0 - 0.5 * seam);
  float lamp = 0.3 + 1.4 * exp(-distance(p, uSoil.xy) / 14.0);
  vec3 col = (rock * (0.6 + 0.4 * abs(n.y)) + pow(f, 6.0) * 0.12) * lamp;
  gl_FragColor = vec4(applyHaze(col, vWorld), 1.0);
  ${de}
}`,Eo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,No=`
${te}${fe}
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
  ${de}
}`,ya=new Map,b=512;function j(e,i){for(const a of[-b,0,b])for(const t of[-b,0,b])e.save(),e.translate(a,t),i(),e.restore()}const k=(e,i,a,t=1)=>`rgba(${Math.round(e)}, ${Math.round(i)}, ${Math.round(a)}, ${t})`;function Ae(e,i,a){const t=e.getImageData(0,0,b,b),r=t.data;for(let n=0;n<r.length;n+=4){const l=1+(i()-.5)*2*a;r[n]=Math.min(255,r[n]*l),r[n+1]=Math.min(255,r[n+1]*l),r[n+2]=Math.min(255,r[n+2]*l)}e.putImageData(t,0,0)}function Be(e,i,a,t,r,n,l){const c=i()*Math.PI*2,f=(i()-.5)*.25*r;e.strokeStyle=l,e.lineWidth=n,e.lineCap="round",e.beginPath(),e.moveTo(a,t),e.quadraticCurveTo(a+Math.cos(c)*r*.5-Math.sin(c)*f,t+Math.sin(c)*r*.5+Math.cos(c)*f,a+Math.cos(c)*r,t+Math.sin(c)*r),e.stroke()}function xa(e,i,a,t,r,n,l){const c=i()*Math.PI*2,f=r*(.5+i()*.25),h=5+Math.floor(i()*3);e.save(),e.translate(a,t),e.rotate(c),e.fillStyle=n,e.beginPath();for(let m=0;m<=24;m++){const p=m/24,v=p*Math.PI*2,w=1-.22*Math.abs(Math.sin(v*h*.5))*(.5+.5*Math.abs(Math.sin(v))),x=Math.cos(v)*r*.5*w,z=Math.sin(v)*f*.5*w;m===0?e.moveTo(x,z):e.lineTo(x,z)}e.closePath(),e.fill(),e.strokeStyle=l,e.lineWidth=1.2,e.beginPath(),e.moveTo(-r*.45,0),e.lineTo(r*.45,0),e.stroke(),e.restore()}function Mt(e,i,a,t,r){const n=i()*Math.PI*2;e.strokeStyle=k(70+i()*30,52+i()*20,35),e.lineWidth=2+i()*2.5,e.lineCap="round",e.beginPath(),e.moveTo(a,t);const l=a+Math.cos(n)*r*.5+(i()-.5)*8,c=t+Math.sin(n)*r*.5+(i()-.5)*8;if(e.lineTo(l,c),e.lineTo(a+Math.cos(n)*r,t+Math.sin(n)*r),e.stroke(),i()<.5){const f=n+.5+i();e.lineWidth*=.6,e.beginPath(),e.moveTo(l,c),e.lineTo(l+Math.cos(f)*r*.35,c+Math.sin(f)*r*.35),e.stroke()}}function _o(e){const i=document.createElement("canvas");i.width=i.height=b;const a=i.getContext("2d"),t=So({sand:101,needles:102,leaves:103,moss:104,"bark-pine":105,"bark-oak":106,"bark-cedar":107}[e]);return e==="sand"?(a.fillStyle=k(168,152,120),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<1400;r++)a.fillStyle=k(120+t()*70,105+t()*60,75+t()*45,.5),a.beginPath(),a.arc(t()*b,t()*b,.6+t()*1.8,0,7),a.fill()}),j(a,()=>{for(let r=0;r<16;r++){const n=t()*b,l=t()*b,c=10+t()*26;a.fillStyle=k(150+t()*20,158+t()*20,132+t()*20,.5);for(let f=0;f<7;f++)a.beginPath(),a.arc(n+(t()-.5)*c,l+(t()-.5)*c,c*.3*(.6+t()),0,7),a.fill()}}),j(a,()=>{for(let r=0;r<24;r++){const n=t();xa(a,t,t()*b,t()*b,22+t()*20,k(110+n*50,80+n*35,40+n*15),k(60,40,20,.5))}}),j(a,()=>{for(let r=0;r<260;r++)Be(a,t,t()*b,t()*b,18+t()*24,1.5,k(130+t()*50,95+t()*35,50,.8));for(let r=0;r<9;r++)Mt(a,t,t()*b,t()*b,30+t()*50)}),Ae(a,t,.07)):e==="needles"?(a.fillStyle=k(62,44,30),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<1700;r++){const n=t();Be(a,t,t()*b,t()*b,22+t()*34,1.3+t()*1.4,k(120+n*80,78+n*50,38+n*30,.85))}}),j(a,()=>{for(let r=0;r<9;r++)Mt(a,t,t()*b,t()*b,36+t()*60);for(let r=0;r<4;r++){const n=t()*b,l=t()*b;for(let c=0;c<14;c++)a.fillStyle=k(80+t()*40,58+t()*25,36,.95),a.beginPath(),a.ellipse(n+(t()-.5)*16,l+(t()-.5)*24,4,2.5,t()*3,0,7),a.fill()}}),j(a,()=>{for(let r=0;r<500;r++){const n=t();Be(a,t,t()*b,t()*b,20+t()*30,1.2+t(),k(150+n*60,100+n*40,50+n*20,.8))}}),Ae(a,t,.06)):e==="leaves"?(a.fillStyle=k(48,34,22),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<140;r++){const n=t(),l=t()<.35,c=l?k(150+n*50,95+n*40,40+n*20):k(70+n*40,50+n*25,30+n*12);xa(a,t,t()*b,t()*b,34+t()*30,c,l?k(110,70,30,.6):k(40,28,16,.6))}}),j(a,()=>{for(let r=0;r<260;r++){const n=t();Be(a,t,t()*b,t()*b,20+t()*28,1.4,k(130+n*60,90+n*40,45,.8))}for(let r=0;r<6;r++)Mt(a,t,t()*b,t()*b,30+t()*50)}),Ae(a,t,.06)):e==="moss"?(a.fillStyle=k(40,34,24),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<70;r++){const n=t()*b,l=t()*b,c=14+t()*30,f=t();for(let h=0;h<40;h++){a.fillStyle=k(70+f*60+t()*30,95+f*60+t()*30,30+f*20,.7);const m=t()*7,p=Math.sqrt(t())*c;a.beginPath(),a.arc(n+Math.cos(m)*p,l+Math.sin(m)*p,2+t()*3,0,7),a.fill()}}}),j(a,()=>{for(let r=0;r<160;r++){const n=t();Be(a,t,t()*b,t()*b,16+t()*26,1.2,k(110+n*50,80+n*30,40,.7))}for(let r=0;r<120;r++)Be(a,t,t()*b,t()*b,30+t()*40,1.6,k(90+t()*50,120+t()*50,40,.75))}),Ae(a,t,.06)):e==="bark-pine"?(a.fillStyle=k(70,42,30),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<160;r++){const n=t()*b,l=t()*b,c=22+t()*40,f=40+t()*90,h=t();a.fillStyle=k(78+h*40,66+h*32,54+h*26),a.beginPath();for(let m=0;m<=10;m++){const p=m/10*Math.PI*2,v=1+(t()-.5)*.3,w=n+Math.cos(p)*c*.5*v,x=l+Math.sin(p)*f*.5*v;m===0?a.moveTo(w,x):a.lineTo(w,x)}a.closePath(),a.fill(),a.strokeStyle=k(40,24,16,.8),a.lineWidth=2.5,a.stroke(),a.fillStyle=k(120+h*50,105+h*40,85+h*30,.35),a.beginPath(),a.ellipse(n-c*.1,l-f*.15,c*.22,f*.25,0,0,7),a.fill()}}),Ae(a,t,.09)):e==="bark-oak"?(a.fillStyle=k(52,42,34),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<220;r++){const n=t()*b,l=t()*b,c=7+t()*12,f=40+t()*90,h=t();a.fillStyle=k(72+h*30,64+h*26,54+h*22),a.beginPath(),a.moveTo(n-c/2,l-f/2),a.lineTo(n+c/2+(t()-.5)*5,l-f/2+4),a.lineTo(n+c/2,l+f/2),a.lineTo(n-c/2+(t()-.5)*5,l+f/2-4),a.closePath(),a.fill(),a.strokeStyle=k(32,24,18,.8),a.lineWidth=2.5,a.stroke(),a.strokeStyle=k(100+h*30,94+h*26,84+h*22,.4),a.lineWidth=1.5,a.beginPath(),a.moveTo(n-c*.15,l-f*.4),a.lineTo(n-c*.1,l+f*.4),a.stroke()}}),Ae(a,t,.08)):(a.fillStyle=k(92,78,64),a.fillRect(0,0,b,b),j(a,()=>{for(let r=0;r<600;r++){const n=t()*b,l=t()*b,c=40+t()*160,f=t();a.strokeStyle=k(60+f*70,52+f*60,42+f*50,.7),a.lineWidth=1+t()*3,a.beginPath(),a.moveTo(n,l),a.lineTo(n+(t()-.5)*6,l+c),a.stroke()}}),Ae(a,t,.08)),i}function He(e){const i=ya.get(e);if(i)return i;const a=new Qa(_o(e));return a.colorSpace=Ja,a.wrapS=a.wrapT=eo,a.anisotropy=4,ya.set(e,a),Go().then(t=>{t.includes(e)&&new to().load(`/Rootwake/vista/textures/barrens/${e}.jpg`,r=>{a.dispose(),a.source=new ao(r.image),a.needsUpdate=!0})}),a}let Io=null;const Go=()=>Io??=fetch("/Rootwake/vista/textures/barrens/index.json").then(e=>e.ok?e.json():[]).then(e=>Array.isArray(e)?e.filter(i=>typeof i=="string"):[]).catch(()=>[]),ir=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function Yo(e){const i=Ct.degToRad(e.elevation),a=Ct.degToRad(e.azimuth);return new d(Math.sin(a)*Math.cos(i),Math.sin(i),-Math.cos(a)*Math.cos(i)).normalize()}const lr=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],ve=(e,i=1)=>new ue(e).multiplyScalar(i),za=1,$o=2.6,Lo=24,Oo="#15100a",pe=56,we=1.5,Vo=70;function ur(e,i,a,t,r,n={}){const{n:l,cell:c,half:f,size:h}=i,m=new ia;m.name="vista",e.add(m),e=m;const p=l>600?2:1,v=(l-1)/p+1,w=new Uint8Array(l*l*4),x=new Uint8Array(v*v),z=new Uint8Array(v*v),P=p===1?i:{...i,n:v,cell:c*p,h:(()=>{const o=new Float32Array(v*v);for(let u=0;u<v;u++)for(let s=0;s<v;s++)o[u*v+s]=i.h[u*p*l+s*p];return o})()},D=new Se(x,v,v,yt,et);D.magFilter=D.minFilter=tt,D.wrapS=D.wrapT=la;const A=new Uint8Array(l*l*4);n.ground&&A.set(n.ground);const B=new Se(A,l,l,rt,et);B.magFilter=B.minFilter=tt,B.needsUpdate=!0;const W=new Se(new Uint8Array(4),1,1);W.needsUpdate=!0;const L=96,U=97,ke=new Float32Array(U*U),ae=new Se(ke,U,U,yt,ua);ae.magFilter=ae.minFilter=ca;let G=new $e(1e9,1e9);const X={value:new at(0,0,0,0)},oe={uFine:{value:ae},uFineAt:{value:new at(0,0,1,0)}};for(let o=0;o<l*l;o++)w[o*4+1]=Math.round(i.ao[o]*255),w[o*4+2]=Math.round(i.flow[o]*255),w[o*4+3]=Math.round(i.sediment[o]*255);const ie=new Se(w,l,l,rt,et);ie.magFilter=ie.minFilter=tt,ie.wrapS=ie.wrapT=la;const Oe=new Se(new Float32Array(i.h),l,l,yt,ua);Oe.magFilter=Oe.minFilter=ca,Oe.needsUpdate=!0;const Ut=new Uint8Array(l*l*4),Ue=new Se(Ut,l,l,rt,et);Ue.magFilter=Ue.minFilter=tt,Ue.needsUpdate=!0;const Y={uSunDir:{value:new d(0,1,0)},uSunCol:{value:new ue},uZenith:{value:new ue},uHorizon:{value:new ue},uAmbSky:{value:new ue},uAmbGround:{value:new ue},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:n.hazeBase??i.waterY},uHazeBelow:{value:n.hazeBelow??1},uLowY:{value:n.lowY??-1e5},uTime:{value:0},uMapData:{value:ie},uSunTex:{value:D},uGround:{value:B},uFloor:{value:Ue},uHeight:{value:Oe},uMapHalf:{value:f},uCell:{value:c},uN:{value:l},uSunN:{value:v},uWaterY:{value:Number.isFinite(i.waterY)?i.waterY:-1e4},uSnowY:{value:i.snowY},uGloom:{value:new at(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0},uUnder:{value:new at(...new ue(Oo).toArray(),0)},uUnderD:{value:3/Lo}},Re=(o,u,s={},g={})=>{const M={...lo.merge([uo.lights]),...Y,...s};return new Le({uniforms:M,vertexShader:o,fragmentShader:u,lights:!0,defines:g})},lt=16,Rt=(l-1)/lt,Ee=Rt*c,ka=110,Et=i.surface&&n.fineLod?[.5,1,2,4,8]:[1,2,4,8],Ve={uClear0:{value:W},uClear1:{value:W},uClear2:{value:W},uClearAt:{value:[new d(0,0,.001),new d(0,0,.001),new d(0,0,.001)]}},ge=Re(Ao,To,{uSoil:X,...Ve,uTexSand:{value:He("sand")},uTexNeedles:{value:He("needles")},uTexLeaves:{value:He("leaves")},uTexMoss:{value:He("moss")}});ge.side=Te;const ut=(o,u)=>zo(i,o,u),ct=new ia;ct.name="terrain",e.add(ct);const je=[];function Da(o,u,s){const g=Rt/s,M=o*Ee-f,S=u*Ee-f,F=s*c,R=4+s*3,E=(g+1)*(g+1),T=new Float32Array((E+4*g)*3),N=new Float32Array((E+4*g)*3),V=[];for(let y=0;y<=g;y++)for(let _=0;_<=g;_++){const C=M+_*F,I=S+y*F,O=(y*(g+1)+_)*3,ee=xo(i,C,I,Math.max(i.surface?1:c,F*.75),ut);T[O]=C,T[O+1]=ut(C,I),T[O+2]=I,N[O]=ee[0],N[O+1]=ee[1],N[O+2]=ee[2]}for(let y=0;y<g;y++)for(let _=0;_<g;_++){const C=y*(g+1)+_,I=C+1,O=C+g+1,ee=O+1;V.push(C,O,I,I,O,ee)}const $=[];for(let y=0;y<g;y++)$.push(y);for(let y=0;y<g;y++)$.push(y*(g+1)+g);for(let y=g;y>0;y--)$.push(g*(g+1)+y);for(let y=g;y>0;y--)$.push(y*(g+1));$.forEach((y,_)=>{const C=(E+_)*3;T[C]=T[y*3],T[C+1]=T[y*3+1]-R,T[C+2]=T[y*3+2],N[C]=N[y*3],N[C+1]=N[y*3+1],N[C+2]=N[y*3+2]});for(let y=0;y<$.length;y++){const _=$[y],C=$[(y+1)%$.length],I=E+y,O=E+(y+1)%$.length;V.push(_,I,C,C,I,O)}const H=new xt;return H.setAttribute("position",new nt(T,3)),H.setAttribute("normal",new nt(N,3)),H.setIndex(V),H.computeBoundingSphere(),H}for(let o=0;o<lt;o++)for(let u=0;u<lt;u++){const s={mesh:new ce(void 0,ge),lod:-1,geos:[],cx:(u+.5)*Ee-f,cz:(o+.5)*Ee-f};s.mesh.receiveShadow=!0,s.mesh.matrixAutoUpdate=!1,s.mesh.userData={ti:u,tj:o},ct.add(s.mesh),je.push(s)}let De=0,dt=0;function Nt(o){const[u,s,g]=ze.lod,M=Et.length>4?1:0;dt=0;for(const S of je){const F=Math.max(0,Math.hypot(S.cx-o.x,S.cz-o.z)-Ee*.7),R=(M&&F<ka?-1:F<u?0:F<s?1:F<g?2:3)+M;if(S.mesh.visible=!(De>.5&&F>Vo),S.mesh.visible&&dt++,R!==S.lod){S.lod=R,S.geos[R]??=Da(S.mesh.userData.ti,S.mesh.userData.tj,Et[R]),S.mesh.geometry=S.geos[R];for(let E=0;E<R-1;E++)S.geos[E]&&(S.geos[E].dispose(),S.geos[E]=void 0)}}}const _t=(o,u,s,g)=>{const M=Math.round(2*u/s),S=[],F=[],R=[],E=new Int32Array((M+1)*(M+1)).fill(-1),T=(H,y)=>{const _=-u+H*s,C=-u+y*s;return!(_>=-o&&_+s<=o&&C>=-o&&C+s<=o)},N=(H,y)=>{const _=y*(M+1)+H;if(E[_]>=0)return E[_];const C=-u+H*s,I=-u+y*s,O=Math.abs(C)<=f&&Math.abs(I)<=f,ee=(Ka,qa)=>i.shape.base(Ka,qa),Xa=ee(C,I)-(O?6:0),Pe=s,na=-(ee(C+Pe,I)-ee(C-Pe,I)),sa=-(ee(C,I+Pe)-ee(C,I-Pe)),bt=Math.hypot(na,2*Pe,sa);return E[_]=S.length/3,S.push(C,Xa,I),F.push(na/bt,2*Pe/bt,sa/bt),E[_]};for(let H=0;H<M;H++)for(let y=0;y<M;y++)if(T(y,H)){const _=N(y,H),C=N(y+1,H),I=N(y,H+1),O=N(y+1,H+1);R.push(_,I,C,C,I,O)}const V=new xt;V.setAttribute("position",new ot(S,3)),V.setAttribute("normal",new ot(F,3)),V.setIndex(R),V.computeBoundingSphere();const $=new ce(V,ge);$.name=g,$.frustumCulled=!1,e.add($),ft.push($)},ft=[],mt=[],It=new d,Ze=Math.max(7e3,f+4500),Gt=n.farReach??Ze;_t(f-80,Ze,80,"far-ring"),Gt>Ze&&_t(Ze-320,Gt,320,"far-ring-2");const Yt=new Le({uniforms:{...Y,uCloud:{value:.5}},vertexShader:Eo,fragmentShader:No,side:oo,depthWrite:!1}),be=new ce(new Ma(Math.max(8e3,(n.farReach??0)*1.25),48,24),Yt);be.name="sky",be.frustumCulled=!1,be.renderOrder=-10,e.add(be);const Fa=new Le({uniforms:{...Y},vertexShader:Ho,fragmentShader:Wo,transparent:!0,depthWrite:!1}),ht=n.waterDisc?new ro(n.waterDisc.r,64):new At(h,h,8,8);ht.rotateX(-Math.PI/2),n.waterDisc&&ht.translate(n.waterDisc.x,0,n.waterDisc.z);const ye=new ce(ht,Fa);if(ye.position.y=i.waterY,ye.name="lake",ye.visible=Number.isFinite(i.waterY),e.add(ye),n.cloudSea){const o=n.cloudSea;for(const[u,s,g]of[[0,0,o.cover],[-90,37,o.cover]]){const M=new Le({uniforms:{...Y,uCloudSea:{value:new d(o.x,o.z,o.inner)},uCloudCover:{value:g},uCloudDrift:{value:s}},vertexShader:Po,fragmentShader:Bo,transparent:!0,depthWrite:!1,side:Te}),S=new no(Math.max(1,o.inner-500),o.outer,96,6);S.rotateX(-Math.PI/2),S.translate(o.x,0,o.z);const F=new ce(S,M);F.position.y=o.y+u,F.name="cloud-sea",F.frustumCulled=!1,F.renderOrder=2,e.add(F),mt.push(F)}}const Xe=new At(pe*we,pe*we,pe,pe);Xe.rotateX(-Math.PI/2),Xe.deleteAttribute("uv"),Xe.deleteAttribute("normal");const $t=new Le({uniforms:{...Y,...oe,uSoil:X,uStratumAt:{value:new $e},uSoilDepth:{value:$o}},vertexShader:Uo,fragmentShader:Ro,side:Te}),me=new ce(Xe,$t);me.name="stratum",me.frustumCulled=!1,me.visible=!1,e.add(me);const Ke=Re(Co,ko,{uCenter:{value:new $e},uPatch:{value:60},uBladeH:{value:n.bladeH??.34},uBladeW:{value:.045},uWind:{value:new $e(.94,.34)},...Ve,...oe});Ke.side=Te;const Lt=3,Fe=new xt;{const o=[],u=[],s=[],g=se(3);for(let M=0;M<Lt;M++){const S=M/Lt*Math.PI*2+g()*.6,F=(g()-.5)*.12,R=(g()-.5)*.12,E=.65+g()*.55,T=o.length/3;for(const[N,V]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])o.push(N,V,0),u.push(S,F,R,E);s.push(T,T+1,T+2,T+2,T+1,T+3,T+2,T+3,T+4,T+4,T+3,T+5,T+4,T+5,T+6)}Fe.setAttribute("position",new ot(o,3)),Fe.setAttribute("aTuft",new ot(u,4)),Fe.setIndex(s)}let J=null,Ot=!0;const Pa=14;function Ba(o,u){if(J&&(J.geometry.dispose(),e.remove(J),J=null),!o)return;const s=new go;s.index=Fe.index,s.setAttribute("position",Fe.getAttribute("position")),s.setAttribute("aTuft",Fe.getAttribute("aTuft"));const g=se(77),M=new Float32Array(o*4);for(let S=0;S<o;S++)M[S*4]=g()*u,M[S*4+1]=g()*u,M[S*4+2]=g(),M[S*4+3]=g()*Math.PI*2;s.setAttribute("aBlade",new bo(M,4)),s.instanceCount=o,J=new ce(s,Ke),J.frustumCulled=!1,J.receiveShadow=!0,J.name="grass",e.add(J),Ke.uniforms.uPatch.value=u}const qe=(o,u)=>Re(ga,ba,{uColor:{value:o?ve(o):new ue}},u),Ha=qe(null,{ROCK:""}),Qe=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446","#5d8f36","#4d7a2e","#35603e"],Vt=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e","#e4dcd0","#e0dad2","#e6e0d6"],jt=(o,u,s)=>{const g=Re(Do,Fo,{uColor:{value:ve(o)},uMap:{value:u}},s);return g.side=Te,g},Wa=(o,u)=>Re(ga,ba,{uColor:{value:ve(o)},uBark:{value:He(u.bark)},uBarkScale:{value:new $e(u.barkScale[0],u.barkScale[1])}},{BARK:"",UNDER:""}),Zt={},Xt={};for(const o of Object.keys(Q).map(Number)){const u=wa(Q[o].sprite);Zt[o]=n.renderer?tr(n.renderer,o,u,Qe[o],Vt[o],He(Q[o].bark)):u,Xt[o]=new so({depthPacking:io,map:u,alphaTest:.5,side:Te})}const Kt=o=>o>=5&&o<9?{VARIED:""}:{},vt=o=>o===9?{TWITCH:""}:o===10?{PULSE:""}:{},qt=Qe.map((o,u)=>Q[u]?jt(o,wa(Q[u].sprite),{USE_SWAY:""}):qe(o,u>=9?vt(u):{USE_SWAY:"",...Kt(u)})),Ua=Qe.map((o,u)=>Q[u]?jt("#ffffff",Zt[u],{}):qe(o,{...Kt(u),...vt(u)})),Qt=Vt.map((o,u)=>Q[u]?Wa(o,Q[u]):qe(o,{...vt(u),UNDER:""})),Je=Qe.map((o,u)=>Ca(u)),Ne=(o,u,s,g)=>{const M=new da(o,u,Math.max(1,s));return M.count=0,M.frustumCulled=!1,M.castShadow=g,M.receiveShadow=!0,M.instanceMatrix.setUsage(ma),e.add(M),M};let _e=[],xe=[],Ie=[],le=[],he=[],Jt=[];const Ra=1.25,Ea=64;function ea(o){_e=Je.map(()=>[]);for(const u of o)_e[u.kind]?.push(u);Je.forEach((u,s)=>{if(xe[s]&&_e[s].length<=Jt[s])return;if(xe[s])for(const M of[xe[s],Ie[s],le[s*2],le[s*2+1],he[s]])e.remove(M),M.dispose();const g=Jt[s]=Math.max(1,Math.ceil(_e[s].length*Ra)+Ea);xe[s]=Ne(u.trunk,Qt[s],g,!1),Ie[s]=Ne(u.crown,qt[s],g,!1),le[s*2]=Ne(u.trunk,Qt[s],g,!0),le[s*2+1]=Ne(u.crown,qt[s],g,!0),le[s*2].layers.set(za),le[s*2+1].layers.set(za),Q[s]&&(le[s*2+1].customDepthMaterial=Xt[s]),he[s]=Ne(u.far,Ua[s],g,!1),he[s].visible=De<=.5}),Ge.set(1e9,0,0)}const ta=o=>{const u=o.instanceMatrix;u.clearUpdateRanges(),o.count>0&&u.addUpdateRange(0,o.count*16),u.needsUpdate=!0},Na=(o,u)=>o.frame?u.fromArray(o.frame):u.compose(new d(o.x,o.y-.15,o.z),new fa().setFromAxisAngle(new d(0,1,0),o.rot),new d(o.scale,o.scale,o.scale));let Ge=new d(1e9,0,0),pt=0,wt=[];const _a=1.25,aa=260,Ia=n.treeReach??1400;let oa=0;function Ga(o){const u=performance.now(),s=new Tt,g=(ze.nearTrees*(n.nearTreesScale??1))**2,M=(ze.shadow?ze.shadowBox*1.25+8:0)**2,S=Ia**2;wt=[],pt=0,_e.forEach((F,R)=>{let E=0,T=0,N=0;const[V,$]=[le[R*2],le[R*2+1]];for(const H of F){const y=(H.x-o.x)**2+(H.z-o.z)**2;y>S||(Na(H,s),y<g?(xe[R].setMatrixAt(E,s),Ie[R].setMatrixAt(E,s),E++,wt.push(H)):(H.scale>=_a||y<aa*aa)&&he[R].setMatrixAt(T++,s),y<M&&(V.setMatrixAt(N,s),$.setMatrixAt(N,s),N++))}xe[R].count=Ie[R].count=E,he[R].count=T,V.count=$.count=N,pt+=E;for(const H of[xe[R],Ie[R],he[R],V,$])ta(H)}),Ge.copy(o),oa=performance.now()-u}ea(a);const Ya=650,re=new da(ar(),Ha,Math.max(1,t.length)),$a=t.map(o=>new Tt().compose(new d(o.x,o.y-o.scale*.25,o.z),new fa().setFromEuler(new Sa(o.tilt,o.rot,o.tilt*.5)),new d(o.scale,o.scale*.7,o.scale*.9)));re.castShadow=!0,re.receiveShadow=!0,re.frustumCulled=!1,re.name="rocks",re.instanceMatrix.setUsage(ma),re.count=0,e.add(re);function La(o){let u=0;t.forEach((s,g)=>{(s.x-o.x)**2+(s.z-o.z)**2<Ya**2&&re.setMatrixAt(u++,$a[g])}),re.count=u,ta(re)}let ze=r;function ra(o){ze=o,Ba(ze.grass,ze.patch);for(const u of je)u.lod=-1;Ge.set(1e9,0,0)}ra(r);let Me=null,Ye=0,gt=new d(0,-1,0);const Oa=Math.ceil(v/90);function Va(o,u=!0){const s=Yo(o);Y.uStars.value=o.stars??0,Y.uSunDir.value.copy(s),Y.uSunCol.value.copy(ve(o.sun).multiplyScalar(o.sunI)),Y.uZenith.value.copy(ve(o.zenith)),Y.uHorizon.value.copy(ve(o.horizon)),Y.uAmbSky.value.copy(ve(o.ambSky).multiplyScalar(o.ambI)),Y.uAmbGround.value.copy(ve(o.ambGround).multiplyScalar(o.ambI)),Y.uHaze.value=o.haze,Y.uHazeFall.value=o.hazeFall,Yt.uniforms.uCloud.value=o.cloud,u?(pa(P,[s.x,s.y,s.z],x),D.needsUpdate=!0,gt.copy(s),Me=null):gt.angleTo(s)>Ct.degToRad(.8)&&!Me&&(Me=[s.x,s.y,s.z],Ye=0)}function ja(){if(!Me)return;const o=Math.min(v,Ye+Oa);pa(P,Me,z,[Ye,o]),Ye=o,Ye>=v&&(x.set(z),D.needsUpdate=!0,gt.set(...Me),Me=null)}function Za(o,u){if(!n.fine)return;const s=Math.round(o-L/2),g=Math.round(u-L/2),M=L/(U-1);for(let S=0;S<U;S++)for(let F=0;F<U;F++)ke[S*U+F]=n.fine(s+F*M,g+S*M);ae.needsUpdate=!0,G.set(o,u),oe.uFineAt.value.set(s,g,L,U)}return{uniforms:Y,root:m,setHour:Va,setQuality:ra,setTrees:ea,get partitionMs(){return oa},get groundBytes(){return A},setGround(o){o!==A&&A.set(o),B.needsUpdate=!0},setCanopy(o){for(let u=0;u<l*l;u++)w[u*4]=o[u];ie.needsUpdate=!0},setFloor(o){Ut.set(o),Ue.needsUpdate=!0},setUnder(o){if(o===De)return;const u=De;De=o,Y.uUnder.value.w=o,me.visible=o>.01;const s=o>.5;if(s!==u>.5){for(const g of[be,ye,...mt,...ft,...he])g.visible=!s;s||(ye.visible=Number.isFinite(i.waterY)),Nt(It)}},stratum:()=>({amount:De,rock:me.visible,rockTris:me.visible?pe*pe*2:0,tiles:dt,hidden:[be,ye,...mt,...ft,...he].filter(o=>!o.visible).map(o=>o.name)}),setSoil(o,u,s){X.value.set(u,s,o,0);const g=o>.01;ge.transparent!==g&&(ge.transparent=g,ge.needsUpdate=!0),ge.depthWrite=o<.5,Ot=o<.05},setGloom(o,u,s){Y.uGloom.value.set(o.r,o.g,o.b,u),Y.uGloomD.value=s},setClear(o,u,s,g,M){Ve[`uClear${o}`].value=u??W,Ve.uClearAt.value[o].set(s,g,u?M:.001)},update(o,u){const s=o.position;Y.uTime.value=u,It.copy(s),ja(),me.visible&&$t.uniforms.uStratumAt.value.set(Math.round(s.x/we)*we-pe*we/2,Math.round(s.z/we)*we-pe*we/2),n.fine&&Math.hypot(s.x-G.x,s.z-G.y)>L*.22&&Za(s.x,s.z),be.position.copy(s),Nt(s),Ke.uniforms.uCenter.value.set(s.x,s.z),J&&(J.visible=Ot&&s.y-ut(s.x,s.z)<Pa),Math.hypot(s.x-Ge.x,s.z-Ge.z)>12&&(Ga(s),La(s))},colliders(){return wt.map(o=>({x:o.x,z:o.z,radius:Je[o.kind].radius*o.scale,cameraClearance:Je[o.kind].radius*o.scale+.3}))},sunAt(o,u){const s=c*p,g=Math.round((o+f)/s),M=Math.round((u+f)/s);return g<0||M<0||g>=v||M>=v?1:x[M*v+g]/255},stats:()=>({tiles:je.length,nearTrees:pt})}}function K(e,i){const a=e;for(const l of Object.keys(a.attributes))l!=="position"&&l!=="normal"&&a.deleteAttribute(l);const t=a.getAttribute("position"),r=new Float32Array(t.count),n=new d;for(let l=0;l<t.count;l++)r[l]=i(n.fromBufferAttribute(t,l));return a.setAttribute("aShade",new nt(r,1)),a}function St(e,i,a,t,r=1,n=1){let l=new Dt(e,r);l.deleteAttribute("uv"),l=kt(l);const c=l.getAttribute("position"),f=l.getAttribute("normal"),h=new d,m=se(t),p=Array.from({length:5},()=>new d(m()-.5,m()-.5,m()-.5).normalize());for(let v=0;v<c.count;v++){h.fromBufferAttribute(c,v);const w=h.clone().normalize();let x=1;for(const P of p)x+=Math.max(0,w.dot(P))**4*.22;h.copy(w).multiplyScalar(e*x),h.y*=n,h.add(i),c.setXYZ(v,h.x,h.y,h.z);const z=h.clone().sub(a).normalize().multiplyScalar(.7).add(w.multiplyScalar(.3)).normalize();f.setXYZ(v,z.x,z.y,z.z)}return l}function Ca(e){if(e===9)return jo();if(e===10)return Zo();if(e===11)return Ko();if(e===12)return Qo();if(e===13)return er();const i=se(e*101+9);if(new d(0,1,0),e<3||e>=5){const m=e>=5,p=m?4.85:[8.5,10.5,7.5][e],v=m?2.75:p*.66,w=m?1.25:[2.6,2.1,3.2][e],x=m?1.2:[1.7,2.4,1.3][e],z=m?.55:1,P=m?[.15,.42]:[.16,.3],D=new zt(P[0],P[1],v+(m?.45:0),8,3);D.translate(0,(v+(m?.45:0))/2,0);const A=[0,1,2].map(G=>{const X=G/3*Math.PI*2+i(),oe=new zt(.07,.13,w*1.1,6);return oe.translate(0,w*.55,0),oe.applyMatrix4(new Tt().makeRotationFromEuler(new Sa(Math.cos(X)*.8,0,Math.sin(X)*.8))),oe.translate(0,v*.8,0),oe}),B=K(q([D,...A].map(G=>(G.deleteAttribute("uv"),G))),G=>.55+.45*Math.min(1,G.y/v)),W=new d(0,v+x*.6,0),L=[],U=m?5:7+Math.floor(i()*3);for(let G=0;G<U;G++){const X=G/U*Math.PI*2+i()*.5,oe=(i()-.35)*x,ie=w*(.55+i()*.35);L.push(St((1.5+i()*.9)*z*(m?1.2:1),new d(Math.cos(X)*ie,W.y+oe,Math.sin(X)*ie),W,e*31+G))}L.push(St(2.2*z,new d(0,W.y+x*.75,0),W,e*31+99));const ke=K(q(L),G=>{const X=G.clone().sub(W);return Math.min(1,.5+.35*(X.y/(x+2)+.6)+.25*Math.hypot(X.x,X.z)/(w+2))}),ae=K(q([St(w+1.3*z,W.clone(),W.clone().setY(W.y-1),e+500,0,(x+2*z)/(w+1.3*z))]),G=>.6+.4*Math.min(1,Math.max(0,(G.y-W.y+2)/4)));return{trunk:B,crown:ke,far:ae,radius:m?.32:.3}}const a=e===3?13:10,t=[],r=new zt(.1,.32,a*.9,7,2);r.translate(0,a*.45,0),r.deleteAttribute("uv");for(let m=0;m<5;m++){const p=m/5,v=(e===3?2.6:3)*(1-p*.78),w=a*.34*(1-p*.35),x=a*(.18+p*.62);let z=new va(v,w,11,2);z.deleteAttribute("uv"),z=kt(z);const P=z.getAttribute("position"),D=z.getAttribute("normal"),A=new d;for(let B=0;B<P.count;B++){A.fromBufferAttribute(P,B);const W=Math.hypot(A.x,A.z),L=1+.12*Math.sin(Math.atan2(A.z,A.x)*5+m*2);P.setXYZ(B,A.x*L,A.y+w/2+x-W/v*.5,A.z*L);const U=new d(A.x,v*.9,A.z).normalize();D.setXYZ(B,U.x,U.y,U.z)}t.push(z)}const n=K(q(t),m=>.5+.5*Math.min(1,Math.hypot(m.x,m.z)/2.2*.6+m.y/a*.5));let l=new va(e===3?2.6:3,a*.9,6,1);l.deleteAttribute("uv"),l.translate(0,a*.55,0);const c=l.getAttribute("position"),f=l.getAttribute("normal"),h=new d;for(let m=0;m<c.count;m++){h.fromBufferAttribute(c,m);const p=new d(h.x,1.6,h.z).normalize();f.setXYZ(m,p.x,p.y,p.z)}return l=K(l,m=>.55+.45*Math.min(1,m.y/a)),{trunk:K(r,m=>.5+.5*Math.min(1,m.y/a)),crown:n,far:l,radius:.3}}function Z(e,i,a,t=8,r=5,n=!1){const l=new Ft(e),c=new yo(l,t,1,r,!1),f=c.getAttribute("position"),h=new d,m=new d;for(let p=0;p<=t;p++){const v=p/t,w=i+(a-i)*v;l.getPointAt(v,m);for(let x=0;x<=r;x++){const z=p*(r+1)+x;h.fromBufferAttribute(f,z).sub(m).multiplyScalar(w).add(m),f.setXYZ(z,h.x,h.y,h.z)}}if(n){const p=c.getAttribute("uv"),v=l.getLength(),w=Math.PI*(i+a);for(let x=0;x<p.count;x++)p.setXY(x,p.getX(x)*v,p.getY(x)*w)}else c.deleteAttribute("uv");return c.computeVertexNormals(),c}function jo(){const e=se(9091),i=[],a=[],t=4.6;i.push(Z([new d(0,-.2,0),new d(.05,t*.4,.03),new d(-.04,t*.75,.02),new d(.02,t,0)],.36,.08,8,7));for(let c=0;c<6;c++){const f=c/6*Math.PI*2+e()*.6,h=t*(.45+e()*.45),m=1.4+e()*1.4,p=new d(Math.cos(f),.55+e()*.5,Math.sin(f)).normalize(),v=new d(0,h,0),w=v.clone().addScaledVector(p,m*.5).add(new d((e()-.5)*.4,-.1,(e()-.5)*.4)),x=v.clone().addScaledVector(p,m);i.push(Z([v,w,x],.09,.03,5,4));for(let z=0;z<3;z++){const P=2*Math.PI*e(),D=w.clone().lerp(x,e()),A=D.clone().add(new d(Math.cos(P)*.6,.35+e()*.4,Math.sin(P)*.6)),B=A.clone().add(new d(Math.cos(P+.9)*.3,.25,Math.sin(P+.9)*.3));a.push(Z([D,A,B],.03,.008,3,3))}}const r=K(q(i),c=>.5+.5*Math.min(1,c.y/t)),n=K(q(a),()=>.85),l=K(q([Z([new d(0,0,0),new d(.1,t*.6,0),new d(0,t,0)],.32,.06,3,4),Z([new d(0,t*.55,0),new d(1.2,t*.85,.3),new d(2,t*1.05,.5)],.1,.03,2,3),Z([new d(0,t*.65,0),new d(-1,t*.9,-.5),new d(-1.6,t*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:r,crown:n,far:l,radius:.3}}function Zo(){const e=se(1010),i=[],a=[],t=(c,f,h,m,p)=>{const v=new d(-f.z,0,f.x).normalize(),w=(e()-.5)*.8,x=c.clone().addScaledVector(f,h*.5).addScaledVector(v,w*h*.3),z=c.clone().addScaledVector(f,h).addScaledVector(v,w*h*.5);if(i.push(Z([c,x,z],m,m*.62,5,5)),p===0){for(let D=0;D<3;D++){const A=new Dt(.22+e()*.16,0);A.translate(z.x+(e()-.5)*.5,z.y+(e()-.3)*.45,z.z+(e()-.5)*.5),a.push(A)}return}const P=2;for(let D=0;D<P;D++){const A=D/P*Math.PI*2+e(),B=f.clone().multiplyScalar(.7).add(new d(Math.cos(A)*.7,.15+e()*.3,Math.sin(A)*.7)).normalize();t(z,B,h*(.62+e()*.15),m*.6,p-1)}};t(new d(0,-.3,0),new d(0,1,0),3,.45,2);const r=K(q(i),c=>.45+.55*Math.min(1,c.y/6)),n=K(q(a),c=>.55+.45*Math.min(1,c.y/6)),l=q([Z([new d(0,-.3,0),new d(.3,2.5,0),new d(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(c=>{const f=c*2.1,h=new Ma(1.1,7,5);return h.deleteAttribute("uv"),h.translate(Math.cos(f)*1.2,4.6+c*.4,Math.sin(f)*1.2),h})]);return{trunk:r,crown:n,far:K(l,c=>.45+.55*Math.min(1,c.y/6)),radius:.42}}const Q={11:{sprite:"pine",frame:[5,7.2],bark:"bark-pine",barkScale:[.8,1.2]},12:{sprite:"oak",frame:[6.4,6.8],bark:"bark-oak",barkScale:[1,1.6]},13:{sprite:"cedar",frame:[3.6,9.4],bark:"bark-cedar",barkScale:[.6,1.4]}},ne=3.4;function Ht(e){const[i,a]=Q[e].frame,t=[],r=new d,n=new d(0,1,0);for(const f of[0,Math.PI/2]){const h=new At(i,a);h.translate(0,a/2-.25,0),h.rotateY(f),t.push(h)}const l=q(t),c=l.getAttribute("normal");for(let f=0;f<c.count;f++)r.set(c.getX(f),0,c.getZ(f)).multiplyScalar(.5).add(n).normalize(),c.setXYZ(f,r.x,r.y,r.z);return Ce(l,f=>.6+.4*Math.min(1,Math.max(0,f.y/a)))}function Wt(e,i,a=.7){const t=e.getAttribute("position"),r=e.getAttribute("normal"),n=new d,l=new d(0,1,0);for(let c=0;c<t.count;c++)n.fromBufferAttribute(t,c).sub(i),n.y*=a,n.normalize().lerp(l,.3).normalize(),r.setXYZ(c,n.x,n.y,n.z)}const Xo=6.4;function Ko(){const e=se(1111),i=Xo,a=[],t=[],r=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.28),n=[0,.3,.62,1].map(w=>new d(r.x*Math.sin(w*Math.PI)*1.4+r.z*w*.3,-.2+(i*.97+.2)*w,r.z*Math.sin(w*Math.PI)*1.4-r.x*w*.3));a.push(Z(n,.3,.05,7,6,!0));const l=new Ft(n),c=w=>l.getPoint(Math.min(1,Math.max(0,(w+.2)/(i*.97+.2)))),f=new d(0,ne+(i-ne)*.55,0),h=(w,x,z=!0)=>t.push({position:w.clone().sub(new d(0,x*.45,0)),yaw:e()*Math.PI,width:x,height:x*(.85+e()*.3),flat:z}),m=5;for(let w=0;w<m;w++){const x=w/(m-1),z=ne-.1+x*(i-ne-.9),P=w*2.4+e()*.8,D=(1.9-x*.8)*(.85+e()*.3),A=.35+x*.35+e()*.2,B=new d(Math.cos(P),A,Math.sin(P)).normalize(),W=c(z),L=W.clone().addScaledVector(B,D*.5).add(new d((e()-.5)*.4,(e()-.6)*.3,(e()-.5)*.4)),U=W.clone().addScaledVector(B,D).add(new d(0,.15+e()*.3,0));a.push(Z([W,L,U],.09-x*.03,.025,3,4,!0)),h(L.clone().lerp(U,.35).add(new d(0,.25,0)),.95+e()*.3,!1),h(U.clone().add(new d(0,.3,0)),1.25+e()*.4),e()<.6&&h(U.clone().add(new d((e()-.5)*.9,.55+e()*.3,(e()-.5)*.9)),.9+e()*.3)}for(let w=0;w<3;w++){const x=c(i*.97-w*.55);h(x.clone().add(new d((e()-.5)*.7,.35,(e()-.5)*.7)),1+e()*.3,w===0)}const p=Ce(q(a),w=>.5+.5*Math.min(1,w.y/i)),v=Pt(t);return Wt(v,f),{trunk:p,crown:Ce(v,w=>Math.min(1,.55+.3*(w.y-ne)/(i-ne)+.25*Math.hypot(w.x,w.z)/2.2)),far:Ht(11),radius:.32}}const qo=6;function Qo(){const e=se(1212),i=qo,a=[],t=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.22),r=[0,.35,.7,1].map(p=>new d(t.x*Math.sin(p*Math.PI*1.3)*1.2,-.2+(i*.78+.2)*p,t.z*Math.sin(p*Math.PI*1.3)*1.2));a.push(Z(r,.34,.12,6,7,!0));const n=new Ft(r),l=p=>n.getPoint(Math.min(1,Math.max(0,(p+.2)/(i*.78+.2)))),c=new d(0,ne+(i-ne)*.6,0),f=[];for(let p=0;p<5;p++){const v=p/4,w=ne-.5+v*(i*.78-ne+.3),x=p*2.5+e()*.9,z=(2.4-v*.9)*(.85+e()*.3),P=.45+v*.4,D=new d(Math.cos(x),P,Math.sin(x)).normalize(),A=l(w),B=A.clone().addScaledVector(D,z*.55).add(new d((e()-.5)*.5,(e()-.4)*.3,(e()-.5)*.5)),W=A.clone().addScaledVector(D,z).add(new d(0,.2+e()*.3,0));a.push(Z([A,B,W],.13-v*.04,.04,3,5,!0));const L=x+(e()-.5)*1.6,U=B.clone().add(new d(Math.cos(L)*z*.45,.35+e()*.4,Math.sin(L)*z*.45));a.push(Z([B,B.clone().lerp(U,.5).add(new d(0,.1,0)),U],.07,.03,2,4,!0));for(const ke of[W,U,B.clone().lerp(W,.6)]){const ae=1.3+e()*.6;f.push({position:ke.clone().add(new d((e()-.5)*.5,.1-ae*.3,(e()-.5)*.5)),yaw:e()*Math.PI,width:ae,height:ae*(.85+e()*.3),flat:e()<.6})}}f.push(...Mo(e,c,2.3,1.2,2.3,9,1.5));const h=Ce(q(a),p=>.5+.5*Math.min(1,p.y/i)),m=Pt(f);return Wt(m,c,.6),{trunk:h,crown:Ce(m,p=>{const v=p.clone().sub(c);return Math.min(1,.45+.35*(v.y/2.6+.6)+.25*Math.hypot(v.x,v.z)/3.2)}),far:Ht(12),radius:.34}}const Jo=9;function er(){const e=se(1313),i=Jo,a=[],t=Z([new d(0,-.2,0),new d(.04,i*.5,.02),new d(0,i*.96,0)],.2,.03,4,6,!0),r=7;for(let l=0;l<r;l++){const c=l/(r-1),f=1.3+c*(i-1.9),h=(2.4-c*1.5)*(.9+e()*.2),m=2.2-c*.6;for(const p of[0,1.05])a.push({position:new d((e()-.5)*.3,f-m*.45,(e()-.5)*.3),yaw:l*.9+p+e()*.3,width:h,height:m,flat:!1})}a.push({position:new d(0,i-.9,0),yaw:e()*3,width:.7,height:1.3,flat:!1});const n=Pt(a);return Wt(n,new d(0,i*.5,0),.25),{trunk:Ce(t,l=>.45+.55*Math.min(1,l.y/i)),crown:Ce(n,l=>.5+.3*Math.min(1,l.y/i)+.2*Math.min(1,Math.hypot(l.x,l.z)/.9)),far:Ht(13),radius:.22}}function Ce(e,i){for(const n of Object.keys(e.attributes))n!=="position"&&n!=="normal"&&n!=="uv"&&e.deleteAttribute(n);const a=e.getAttribute("position"),t=new Float32Array(a.count),r=new d;for(let n=0;n<a.count;n++)t[n]=i(r.fromBufferAttribute(a,n));return e.setAttribute("aShade",new nt(t,1)),e}function tr(e,i,a,t,r,n){const[l,c]=Q[i].frame,f=256,h=new co(Math.round(f*l/c),f,{format:rt,colorSpace:fo});h.texture.minFilter=mo,h.texture.generateMipmaps=!0;const m=new ho,p=Ca(i),v=Q[i].barkScale,w=n.clone();w.repeat.set(v[0],v[1]),w.needsUpdate=!0,m.add(new ce(p.trunk,new ha({color:r,map:w,toneMapped:!1}))),m.add(new ce(p.crown,new ha({color:t,map:a,alphaTest:.5,side:Te,toneMapped:!1}))),m.add(new vo("#ffffff","#8a8a80",1));const x=new po("#fff4e0",.35);x.position.set(.5,1,1),m.add(x);const z=new wo(-l/2,l/2,c-.25,-.25,-20,20);z.position.set(0,0,10),z.lookAt(0,0,0);const P=e.getRenderTarget(),D=e.getClearColor(new ue),A=e.getClearAlpha();return e.setRenderTarget(h),e.setClearColor("#000000",0),e.clear(),e.render(m,z),e.setRenderTarget(P),e.setClearColor(D,A),p.trunk.dispose(),p.crown.dispose(),p.far.dispose(),h.texture}function ar(){let e=new Dt(1,1);e.deleteAttribute("uv"),e=kt(e);const i=e.getAttribute("position"),a=new d,t=se(5);for(let r=0;r<i.count;r++)a.fromBufferAttribute(i,r),a.multiplyScalar(.8+t()*.35),i.setXYZ(r,a.x,a.y,a.z);return e=e.toNonIndexed(),e.computeVertexNormals(),K(e,r=>.55+.45*Math.min(1,Math.max(0,r.y+.6)))}export{fe as A,za as C,de as F,ir as H,We as M,te as N,lr as Q,Oo as U,Do as a,ga as b,Fo as c,ur as d,Yo as e,He as f,Lo as g,ba as s};
