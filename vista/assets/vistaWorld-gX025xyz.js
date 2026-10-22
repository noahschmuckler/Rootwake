import{X as Ga,Y as _a,a6 as Ua,aw as Ya,ax as $a,G as jt,a5 as pe,ay as ut,az as Ve,aA as je,aB as Zt,ab as qe,aC as Kt,aD as Xt,i as Ze,am as dt,C as ue,V as d,k as Ae,M as de,ag as Ke,Z as La,r as ca,b as Oa,l as ua,R as Va,z as ft,_ as Xe,aE as ja,aF as Za,I as qt,w as pt,Q as Qt,x as da,aj as Jt,e as wt,ak as Ka,al as Xa,g as qa,aG as Qa,aH as Ja,S as eo,ao as ea,H as to,D as ao,an as oo,u as mt,n as q,d as ta,a4 as gt,v as yt,j as bt,J as Qe,aI as no,aJ as ro,s as so}from"./BufferGeometryUtils-BMCnC2iH.js";import{r as re,e as aa,n as lo,s as io}from"./vistaTerrain-BQ6jDvM3.js";import{b as oa,a as xt,c as co}from"./sprites-B8NOVg88.js";import{m as uo}from"./colors-BKJfVazC.js";const se=`
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
  return mix(col, uGloom.rgb, uGloom.a * (1.0 - exp(-dist * uGloomD)));
}
/** The cel light: a soft terminator, sun only on the lit side, blue sky ambient everywhere. */
vec3 toon(vec3 albedo, vec3 n, float vis, float ao){
  float ndl = dot(n, uSunDir);
  float lit = smoothstep(-0.03, 0.22, ndl) * (0.72 + 0.28 * clamp(ndl, 0.0, 1.0)) * vis;
  vec3 amb = mix(uAmbGround, uAmbSky, n.y * 0.5 + 0.5) * ao;
  return albedo * (amb + uSunCol * lit);
}
`,Ie=`
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
`,zt=`
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
`,fa=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,Je=`
#include <common>
#include <shadowmap_pars_vertex>
`,et=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,ye=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,fo=`
${Je}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,mo=`
${et}
${se}${fe}${Ie}${zt}${fa}
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
void main(){
  vec3 n = normalize(vNormal);
  // A painterly bump: the normal leans with two scales of noise, so flat ground is not flat-lit.
  vec2 p = vWorld.xz; float e = 0.6;
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
  float soil = 1.0 - 0.78 * uSoil.z * (1.0 - smoothstep(14.0, 28.0, distance(vWorld.xz, uSoil.xy)));
  gl_FragColor = vec4(applyHaze(col, vWorld), soil);
  ${ye}
}`,ho=`
${Je}
${se}${fe}${Ie}${zt}${fa}
attribute vec4 aBlade; // x, z in the patch; size; rotation
attribute vec4 aTuft; // the blade within its tuft: angle, offset x, offset z, height
uniform vec2 uCenter; uniform float uPatch; uniform float uBladeH; uniform float uBladeW; uniform vec2 uWind;
// The ground near her at a finer step than the map (x0, z0, side, texels): blades stand on the walked surface.
uniform highp sampler2D uFine; uniform vec4 uFineAt;
float fineHeight(vec2 xz, float coarse){
  vec2 f = (xz - uFineAt.xy) / uFineAt.z * (uFineAt.w - 1.0);
  if (uFineAt.w < 2.0 || any(lessThan(f, vec2(0.0))) || any(greaterThanEqual(f, vec2(uFineAt.w - 1.0)))) return coarse;
  ivec2 i = ivec2(floor(f)); vec2 t = f - vec2(i);
  float a = texelFetch(uFine, i, 0).r, b = texelFetch(uFine, i + ivec2(1, 0), 0).r, c = texelFetch(uFine, i + ivec2(0, 1), 0).r, d = texelFetch(uFine, i + ivec2(1, 1), 0).r;
  return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}
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
}`,vo=`
${et}
${se}${fe}
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
  ${ye}
}`,na=`
${Je}
${se}
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
}`,ra=`
${et}
${se}${fe}${Ie}
#ifdef ROCK
${zt}
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
  ${ye}
}`,po=`
${Je}
${se}
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
}`,wo=`
${et}
${se}${fe}${Ie}
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
  ${ye}
}`,go=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,yo=`
${se}${fe}
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
  ${ye}
}`,bo=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,xo=`
${se}${fe}${Ie}
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
  gl_FragColor = vec4(applyHaze(col, vWorld), alpha);
  ${ye}
}`,zo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,Mo=`
${se}${fe}
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
  gl_FragColor = vec4(col, 1.0);
  ${ye}
}`,sa=new Map,y=512;function Z(e,l){for(const a of[-y,0,y])for(const t of[-y,0,y])e.save(),e.translate(a,t),l(),e.restore()}const k=(e,l,a,t=1)=>`rgba(${Math.round(e)}, ${Math.round(l)}, ${Math.round(a)}, ${t})`;function we(e,l,a){const t=e.getImageData(0,0,y,y),n=t.data;for(let r=0;r<n.length;r+=4){const i=1+(l()-.5)*2*a;n[r]=Math.min(255,n[r]*i),n[r+1]=Math.min(255,n[r+1]*i),n[r+2]=Math.min(255,n[r+2]*i)}e.putImageData(t,0,0)}function Me(e,l,a,t,n,r,i){const u=l()*Math.PI*2,f=(l()-.5)*.25*n;e.strokeStyle=i,e.lineWidth=r,e.lineCap="round",e.beginPath(),e.moveTo(a,t),e.quadraticCurveTo(a+Math.cos(u)*n*.5-Math.sin(u)*f,t+Math.sin(u)*n*.5+Math.cos(u)*f,a+Math.cos(u)*n,t+Math.sin(u)*n),e.stroke()}function la(e,l,a,t,n,r,i){const u=l()*Math.PI*2,f=n*(.5+l()*.25),h=5+Math.floor(l()*3);e.save(),e.translate(a,t),e.rotate(u),e.fillStyle=r,e.beginPath();for(let m=0;m<=24;m++){const p=m/24,v=p*Math.PI*2,w=1-.22*Math.abs(Math.sin(v*h*.5))*(.5+.5*Math.abs(Math.sin(v))),x=Math.cos(v)*n*.5*w,z=Math.sin(v)*f*.5*w;m===0?e.moveTo(x,z):e.lineTo(x,z)}e.closePath(),e.fill(),e.strokeStyle=i,e.lineWidth=1.2,e.beginPath(),e.moveTo(-n*.45,0),e.lineTo(n*.45,0),e.stroke(),e.restore()}function ht(e,l,a,t,n){const r=l()*Math.PI*2;e.strokeStyle=k(70+l()*30,52+l()*20,35),e.lineWidth=2+l()*2.5,e.lineCap="round",e.beginPath(),e.moveTo(a,t);const i=a+Math.cos(r)*n*.5+(l()-.5)*8,u=t+Math.sin(r)*n*.5+(l()-.5)*8;if(e.lineTo(i,u),e.lineTo(a+Math.cos(r)*n,t+Math.sin(r)*n),e.stroke(),l()<.5){const f=r+.5+l();e.lineWidth*=.6,e.beginPath(),e.moveTo(i,u),e.lineTo(i+Math.cos(f)*n*.35,u+Math.sin(f)*n*.35),e.stroke()}}function So(e){const l=document.createElement("canvas");l.width=l.height=y;const a=l.getContext("2d"),t=uo({sand:101,needles:102,leaves:103,moss:104,"bark-pine":105,"bark-oak":106,"bark-cedar":107}[e]);return e==="sand"?(a.fillStyle=k(168,152,120),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<1400;n++)a.fillStyle=k(120+t()*70,105+t()*60,75+t()*45,.5),a.beginPath(),a.arc(t()*y,t()*y,.6+t()*1.8,0,7),a.fill()}),Z(a,()=>{for(let n=0;n<16;n++){const r=t()*y,i=t()*y,u=10+t()*26;a.fillStyle=k(150+t()*20,158+t()*20,132+t()*20,.5);for(let f=0;f<7;f++)a.beginPath(),a.arc(r+(t()-.5)*u,i+(t()-.5)*u,u*.3*(.6+t()),0,7),a.fill()}}),Z(a,()=>{for(let n=0;n<24;n++){const r=t();la(a,t,t()*y,t()*y,22+t()*20,k(110+r*50,80+r*35,40+r*15),k(60,40,20,.5))}}),Z(a,()=>{for(let n=0;n<260;n++)Me(a,t,t()*y,t()*y,18+t()*24,1.5,k(130+t()*50,95+t()*35,50,.8));for(let n=0;n<9;n++)ht(a,t,t()*y,t()*y,30+t()*50)}),we(a,t,.07)):e==="needles"?(a.fillStyle=k(62,44,30),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<1700;n++){const r=t();Me(a,t,t()*y,t()*y,22+t()*34,1.3+t()*1.4,k(120+r*80,78+r*50,38+r*30,.85))}}),Z(a,()=>{for(let n=0;n<9;n++)ht(a,t,t()*y,t()*y,36+t()*60);for(let n=0;n<4;n++){const r=t()*y,i=t()*y;for(let u=0;u<14;u++)a.fillStyle=k(80+t()*40,58+t()*25,36,.95),a.beginPath(),a.ellipse(r+(t()-.5)*16,i+(t()-.5)*24,4,2.5,t()*3,0,7),a.fill()}}),Z(a,()=>{for(let n=0;n<500;n++){const r=t();Me(a,t,t()*y,t()*y,20+t()*30,1.2+t(),k(150+r*60,100+r*40,50+r*20,.8))}}),we(a,t,.06)):e==="leaves"?(a.fillStyle=k(48,34,22),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<140;n++){const r=t(),i=t()<.35,u=i?k(150+r*50,95+r*40,40+r*20):k(70+r*40,50+r*25,30+r*12);la(a,t,t()*y,t()*y,34+t()*30,u,i?k(110,70,30,.6):k(40,28,16,.6))}}),Z(a,()=>{for(let n=0;n<260;n++){const r=t();Me(a,t,t()*y,t()*y,20+t()*28,1.4,k(130+r*60,90+r*40,45,.8))}for(let n=0;n<6;n++)ht(a,t,t()*y,t()*y,30+t()*50)}),we(a,t,.06)):e==="moss"?(a.fillStyle=k(40,34,24),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<70;n++){const r=t()*y,i=t()*y,u=14+t()*30,f=t();for(let h=0;h<40;h++){a.fillStyle=k(70+f*60+t()*30,95+f*60+t()*30,30+f*20,.7);const m=t()*7,p=Math.sqrt(t())*u;a.beginPath(),a.arc(r+Math.cos(m)*p,i+Math.sin(m)*p,2+t()*3,0,7),a.fill()}}}),Z(a,()=>{for(let n=0;n<160;n++){const r=t();Me(a,t,t()*y,t()*y,16+t()*26,1.2,k(110+r*50,80+r*30,40,.7))}for(let n=0;n<120;n++)Me(a,t,t()*y,t()*y,30+t()*40,1.6,k(90+t()*50,120+t()*50,40,.75))}),we(a,t,.06)):e==="bark-pine"?(a.fillStyle=k(70,42,30),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<160;n++){const r=t()*y,i=t()*y,u=22+t()*40,f=40+t()*90,h=t();a.fillStyle=k(78+h*40,66+h*32,54+h*26),a.beginPath();for(let m=0;m<=10;m++){const p=m/10*Math.PI*2,v=1+(t()-.5)*.3,w=r+Math.cos(p)*u*.5*v,x=i+Math.sin(p)*f*.5*v;m===0?a.moveTo(w,x):a.lineTo(w,x)}a.closePath(),a.fill(),a.strokeStyle=k(40,24,16,.8),a.lineWidth=2.5,a.stroke(),a.fillStyle=k(120+h*50,105+h*40,85+h*30,.35),a.beginPath(),a.ellipse(r-u*.1,i-f*.15,u*.22,f*.25,0,0,7),a.fill()}}),we(a,t,.09)):e==="bark-oak"?(a.fillStyle=k(52,42,34),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<220;n++){const r=t()*y,i=t()*y,u=7+t()*12,f=40+t()*90,h=t();a.fillStyle=k(72+h*30,64+h*26,54+h*22),a.beginPath(),a.moveTo(r-u/2,i-f/2),a.lineTo(r+u/2+(t()-.5)*5,i-f/2+4),a.lineTo(r+u/2,i+f/2),a.lineTo(r-u/2+(t()-.5)*5,i+f/2-4),a.closePath(),a.fill(),a.strokeStyle=k(32,24,18,.8),a.lineWidth=2.5,a.stroke(),a.strokeStyle=k(100+h*30,94+h*26,84+h*22,.4),a.lineWidth=1.5,a.beginPath(),a.moveTo(r-u*.15,i-f*.4),a.lineTo(r-u*.1,i+f*.4),a.stroke()}}),we(a,t,.08)):(a.fillStyle=k(92,78,64),a.fillRect(0,0,y,y),Z(a,()=>{for(let n=0;n<600;n++){const r=t()*y,i=t()*y,u=40+t()*160,f=t();a.strokeStyle=k(60+f*70,52+f*60,42+f*50,.7),a.lineWidth=1+t()*3,a.beginPath(),a.moveTo(r,i),a.lineTo(r+(t()-.5)*6,i+u),a.stroke()}}),we(a,t,.08)),l}function Se(e){const l=sa.get(e);if(l)return l;const a=new Ga(So(e));return a.colorSpace=_a,a.wrapS=a.wrapT=Ua,a.anisotropy=4,sa.set(e,a),Co().then(t=>{t.includes(e)&&new Ya().load(`/Rootwake/vista/textures/barrens/${e}.jpg`,n=>{a.dispose(),a.source=new $a(n.image),a.needsUpdate=!0})}),a}let Ao=null;const Co=()=>Ao??=fetch("/Rootwake/vista/textures/barrens/index.json").then(e=>e.ok?e.json():[]).then(e=>Array.isArray(e)?e.filter(l=>typeof l=="string"):[]).catch(()=>[]),Yo=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function To(e){const l=wt.degToRad(e.elevation),a=wt.degToRad(e.azimuth);return new d(Math.sin(a)*Math.cos(l),Math.sin(l),-Math.cos(a)*Math.cos(l)).normalize()}const $o=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],ce=(e,l=1)=>new ue(e).multiplyScalar(l),ia=1;function Lo(e,l,a,t,n,r={}){const{n:i,cell:u,half:f,size:h}=l,m=new jt;m.name="vista",e.add(m),e=m;const p=i>600?2:1,v=(i-1)/p+1,w=new Uint8Array(i*i*4),x=new Uint8Array(v*v),z=new Uint8Array(v*v),F=p===1?l:{...l,n:v,cell:u*p,h:(()=>{const o=new Float32Array(v*v);for(let c=0;c<v;c++)for(let s=0;s<v;s++)o[c*v+s]=l.h[c*p*i+s*p];return o})()},D=new pe(x,v,v,ut,Ve);D.magFilter=D.minFilter=je,D.wrapS=D.wrapT=Zt;const A=new Uint8Array(i*i*4);r.ground&&A.set(r.ground);const P=new pe(A,i,i,qe,Ve);P.magFilter=P.minFilter=je,P.needsUpdate=!0;const W=new pe(new Uint8Array(4),1,1);W.needsUpdate=!0;const Y=96,R=97,be=new Float32Array(R*R),ae=new pe(be,R,R,ut,Kt);ae.magFilter=ae.minFilter=Xt;let U=new Ze(1e9,1e9);for(let o=0;o<i*i;o++)w[o*4+1]=Math.round(l.ao[o]*255),w[o*4+2]=Math.round(l.flow[o]*255),w[o*4+3]=Math.round(l.sediment[o]*255);const O=new pe(w,i,i,qe,Ve);O.magFilter=O.minFilter=je,O.wrapS=O.wrapT=Zt;const J=new pe(new Float32Array(l.h),i,i,ut,Kt);J.magFilter=J.minFilter=Xt,J.needsUpdate=!0;const Ce=new Uint8Array(i*i*4),Te=new pe(Ce,i,i,qe,Ve);Te.magFilter=Te.minFilter=je,Te.needsUpdate=!0;const L={uSunDir:{value:new d(0,1,0)},uSunCol:{value:new ue},uZenith:{value:new ue},uHorizon:{value:new ue},uAmbSky:{value:new ue},uAmbGround:{value:new ue},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:r.hazeBase??l.waterY},uHazeBelow:{value:r.hazeBelow??1},uLowY:{value:r.lowY??-1e5},uTime:{value:0},uMapData:{value:O},uSunTex:{value:D},uGround:{value:P},uFloor:{value:Te},uHeight:{value:J},uMapHalf:{value:f},uCell:{value:u},uN:{value:i},uSunN:{value:v},uWaterY:{value:Number.isFinite(l.waterY)?l.waterY:-1e4},uSnowY:{value:l.snowY},uGloom:{value:new dt(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},ke=(o,c,s={},g={})=>{const M={...Ka.merge([Xa.lights]),...L,...s};return new Ke({uniforms:M,vertexShader:o,fragmentShader:c,lights:!0,defines:g})},tt=16,At=(i-1)/tt,De=At*u,ha=110,Ct=l.surface&&r.fineLod?[.5,1,2,4,8]:[1,2,4,8],Ge={uClear0:{value:W},uClear1:{value:W},uClear2:{value:W},uClearAt:{value:[new d(0,0,.001),new d(0,0,.001),new d(0,0,.001)]}},ie=ke(fo,mo,{uSoil:{value:new dt(0,0,0,0)},...Ge,uTexSand:{value:Se("sand")},uTexNeedles:{value:Se("needles")},uTexLeaves:{value:Se("leaves")},uTexMoss:{value:Se("moss")}});ie.side=Ae;const at=(o,c)=>io(l,o,c),ot=new jt;ot.name="terrain",e.add(ot);const _e=[];function va(o,c,s){const g=At/s,M=o*De-f,S=c*De-f,B=s*u,N=4+s*3,E=(g+1)*(g+1),C=new Float32Array((E+4*g)*3),I=new Float32Array((E+4*g)*3),j=[];for(let b=0;b<=g;b++)for(let G=0;G<=g;G++){const T=M+G*B,_=S+b*B,V=(b*(g+1)+G)*3,te=lo(l,T,_,Math.max(l.surface?1:u,B*.75),at);C[V]=T,C[V+1]=at(T,_),C[V+2]=_,I[V]=te[0],I[V+1]=te[1],I[V+2]=te[2]}for(let b=0;b<g;b++)for(let G=0;G<g;G++){const T=b*(g+1)+G,_=T+1,V=T+g+1,te=V+1;j.push(T,V,_,_,V,te)}const $=[];for(let b=0;b<g;b++)$.push(b);for(let b=0;b<g;b++)$.push(b*(g+1)+g);for(let b=g;b>0;b--)$.push(g*(g+1)+b);for(let b=g;b>0;b--)$.push(b*(g+1));$.forEach((b,G)=>{const T=(E+G)*3;C[T]=C[b*3],C[T+1]=C[b*3+1]-N,C[T+2]=C[b*3+2],I[T]=I[b*3],I[T+1]=I[b*3+1],I[T+2]=I[b*3+2]});for(let b=0;b<$.length;b++){const G=$[b],T=$[(b+1)%$.length],_=E+b,V=E+(b+1)%$.length;j.push(G,_,T,T,_,V)}const H=new ft;return H.setAttribute("position",new Qe(C,3)),H.setAttribute("normal",new Qe(I,3)),H.setIndex(j),H.computeBoundingSphere(),H}for(let o=0;o<tt;o++)for(let c=0;c<tt;c++){const s={mesh:new de(void 0,ie),lod:-1,geos:[],cx:(c+.5)*De-f,cz:(o+.5)*De-f};s.mesh.receiveShadow=!0,s.mesh.matrixAutoUpdate=!1,s.mesh.userData={ti:c,tj:o},ot.add(s.mesh),_e.push(s)}function pa(o){const[c,s,g]=he.lod,M=Ct.length>4?1:0;for(const S of _e){const B=Math.max(0,Math.hypot(S.cx-o.x,S.cz-o.z)-De*.7),N=(M&&B<ha?-1:B<c?0:B<s?1:B<g?2:3)+M;if(N!==S.lod){S.lod=N,S.geos[N]??=va(S.mesh.userData.ti,S.mesh.userData.tj,Ct[N]),S.mesh.geometry=S.geos[N];for(let E=0;E<N-1;E++)S.geos[E]&&(S.geos[E].dispose(),S.geos[E]=void 0)}}}const Tt=(o,c,s,g)=>{const M=Math.round(2*c/s),S=[],B=[],N=[],E=new Int32Array((M+1)*(M+1)).fill(-1),C=(H,b)=>{const G=-c+H*s,T=-c+b*s;return!(G>=-o&&G+s<=o&&T>=-o&&T+s<=o)},I=(H,b)=>{const G=b*(M+1)+H;if(E[G]>=0)return E[G];const T=-c+H*s,_=-c+b*s,V=Math.abs(T)<=f&&Math.abs(_)<=f,te=(Ea,Ia)=>l.shape.base(Ea,Ia),Na=te(T,_)-(V?6:0),ze=s,Ot=-(te(T+ze,_)-te(T-ze,_)),Vt=-(te(T,_+ze)-te(T,_-ze)),ct=Math.hypot(Ot,2*ze,Vt);return E[G]=S.length/3,S.push(T,Na,_),B.push(Ot/ct,2*ze/ct,Vt/ct),E[G]};for(let H=0;H<M;H++)for(let b=0;b<M;b++)if(C(b,H)){const G=I(b,H),T=I(b+1,H),_=I(b,H+1),V=I(b+1,H+1);N.push(G,_,T,T,_,V)}const j=new ft;j.setAttribute("position",new Xe(S,3)),j.setAttribute("normal",new Xe(B,3)),j.setIndex(N),j.computeBoundingSphere();const $=new de(j,ie);$.name=g,$.frustumCulled=!1,e.add($)},Ue=Math.max(7e3,f+4500),kt=r.farReach??Ue;Tt(f-80,Ue,80,"far-ring"),kt>Ue&&Tt(Ue-320,kt,320,"far-ring-2");const Dt=new Ke({uniforms:{...L,uCloud:{value:.5}},vertexShader:zo,fragmentShader:Mo,side:La,depthWrite:!1}),Fe=new de(new ca(Math.max(8e3,(r.farReach??0)*1.25),48,24),Dt);Fe.name="sky",Fe.frustumCulled=!1,Fe.renderOrder=-10,e.add(Fe);const wa=new Ke({uniforms:{...L},vertexShader:bo,fragmentShader:xo,transparent:!0,depthWrite:!1}),nt=r.waterDisc?new Oa(r.waterDisc.r,64):new ua(h,h,8,8);nt.rotateX(-Math.PI/2),r.waterDisc&&nt.translate(r.waterDisc.x,0,r.waterDisc.z);const Ye=new de(nt,wa);if(Ye.position.y=l.waterY,Ye.name="lake",Ye.visible=Number.isFinite(l.waterY),e.add(Ye),r.cloudSea){const o=r.cloudSea;for(const[c,s,g]of[[0,0,o.cover],[-90,37,o.cover]]){const M=new Ke({uniforms:{...L,uCloudSea:{value:new d(o.x,o.z,o.inner)},uCloudCover:{value:g},uCloudDrift:{value:s}},vertexShader:go,fragmentShader:yo,transparent:!0,depthWrite:!1,side:Ae}),S=new Va(Math.max(1,o.inner-500),o.outer,96,6);S.rotateX(-Math.PI/2),S.translate(o.x,0,o.z);const B=new de(S,M);B.position.y=o.y+c,B.name="cloud-sea",B.frustumCulled=!1,B.renderOrder=2,e.add(B)}}const Pe=ke(ho,vo,{uCenter:{value:new Ze},uPatch:{value:60},uBladeH:{value:r.bladeH??.34},uBladeW:{value:.045},uWind:{value:new Ze(.94,.34)},...Ge,uFine:{value:ae},uFineAt:{value:new dt(0,0,1,0)}});Pe.side=Ae;const Ft=3,xe=new ft;{const o=[],c=[],s=[],g=re(3);for(let M=0;M<Ft;M++){const S=M/Ft*Math.PI*2+g()*.6,B=(g()-.5)*.12,N=(g()-.5)*.12,E=.65+g()*.55,C=o.length/3;for(const[I,j]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])o.push(I,j,0),c.push(S,B,N,E);s.push(C,C+1,C+2,C+2,C+1,C+3,C+2,C+3,C+4,C+4,C+3,C+5,C+4,C+5,C+6)}xe.setAttribute("position",new Xe(o,3)),xe.setAttribute("aTuft",new Xe(c,4)),xe.setIndex(s)}let ee=null,Pt=!0;const ga=14;function ya(o,c){if(ee&&(ee.geometry.dispose(),e.remove(ee),ee=null),!o)return;const s=new no;s.index=xe.index,s.setAttribute("position",xe.getAttribute("position")),s.setAttribute("aTuft",xe.getAttribute("aTuft"));const g=re(77),M=new Float32Array(o*4);for(let S=0;S<o;S++)M[S*4]=g()*c,M[S*4+1]=g()*c,M[S*4+2]=g(),M[S*4+3]=g()*Math.PI*2;s.setAttribute("aBlade",new ro(M,4)),s.instanceCount=o,ee=new de(s,Pe),ee.frustumCulled=!1,ee.receiveShadow=!0,ee.name="grass",e.add(ee),Pe.uniforms.uPatch.value=c}const $e=(o,c)=>ke(na,ra,{uColor:{value:o?ce(o):new ue}},c),ba=$e(null,{ROCK:""}),Le=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446","#5d8f36","#4d7a2e","#35603e"],Bt=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e","#e4dcd0","#e0dad2","#e6e0d6"],Ht=(o,c,s)=>{const g=ke(po,wo,{uColor:{value:ce(o)},uMap:{value:c}},s);return g.side=Ae,g},xa=(o,c)=>ke(na,ra,{uColor:{value:ce(o)},uBark:{value:Se(c.bark)},uBarkScale:{value:new Ze(c.barkScale[0],c.barkScale[1])}},{BARK:"",UNDER:""}),Wt={},Rt={};for(const o of Object.keys(Q).map(Number)){const c=oa(Q[o].sprite);Wt[o]=r.renderer?No(r.renderer,o,c,Le[o],Bt[o],Se(Q[o].bark)):c,Rt[o]=new ja({depthPacking:Za,map:c,alphaTest:.5,side:Ae})}const Nt=o=>o>=5&&o<9?{VARIED:""}:{},rt=o=>o===9?{TWITCH:""}:o===10?{PULSE:""}:{},Et=Le.map((o,c)=>Q[c]?Ht(o,oa(Q[c].sprite),{USE_SWAY:""}):$e(o,c>=9?rt(c):{USE_SWAY:"",...Nt(c)})),za=Le.map((o,c)=>Q[c]?Ht("#ffffff",Wt[c],{}):$e(o,{...Nt(c),...rt(c)})),It=Bt.map((o,c)=>Q[c]?xa(o,Q[c]):$e(o,{...rt(c),UNDER:""})),Oe=Le.map((o,c)=>ma(c)),Be=(o,c,s,g)=>{const M=new qt(o,c,Math.max(1,s));return M.count=0,M.frustumCulled=!1,M.castShadow=g,M.receiveShadow=!0,M.instanceMatrix.setUsage(Jt),e.add(M),M};let He=[],me=[],We=[],le=[],Re=[],Gt=[];const Ma=1.25,Sa=64;function _t(o){He=Oe.map(()=>[]);for(const c of o)He[c.kind]?.push(c);Oe.forEach((c,s)=>{if(me[s]&&He[s].length<=Gt[s])return;if(me[s])for(const M of[me[s],We[s],le[s*2],le[s*2+1],Re[s]])e.remove(M),M.dispose();const g=Gt[s]=Math.max(1,Math.ceil(He[s].length*Ma)+Sa);me[s]=Be(c.trunk,It[s],g,!1),We[s]=Be(c.crown,Et[s],g,!1),le[s*2]=Be(c.trunk,It[s],g,!0),le[s*2+1]=Be(c.crown,Et[s],g,!0),le[s*2].layers.set(ia),le[s*2+1].layers.set(ia),Q[s]&&(le[s*2+1].customDepthMaterial=Rt[s]),Re[s]=Be(c.far,za[s],g,!1)}),Ne.set(1e9,0,0)}const Ut=o=>{const c=o.instanceMatrix;c.clearUpdateRanges(),o.count>0&&c.addUpdateRange(0,o.count*16),c.needsUpdate=!0},Aa=(o,c)=>o.frame?c.fromArray(o.frame):c.compose(new d(o.x,o.y-.15,o.z),new Qt().setFromAxisAngle(new d(0,1,0),o.rot),new d(o.scale,o.scale,o.scale));let Ne=new d(1e9,0,0),st=0,lt=[];const Ca=1.25,Yt=260,Ta=r.treeReach??1400;let $t=0;function ka(o){const c=performance.now(),s=new pt,g=(he.nearTrees*(r.nearTreesScale??1))**2,M=(he.shadow?he.shadowBox*1.25+8:0)**2,S=Ta**2;lt=[],st=0,He.forEach((B,N)=>{let E=0,C=0,I=0;const[j,$]=[le[N*2],le[N*2+1]];for(const H of B){const b=(H.x-o.x)**2+(H.z-o.z)**2;b>S||(Aa(H,s),b<g?(me[N].setMatrixAt(E,s),We[N].setMatrixAt(E,s),E++,lt.push(H)):(H.scale>=Ca||b<Yt*Yt)&&Re[N].setMatrixAt(C++,s),b<M&&(j.setMatrixAt(I,s),$.setMatrixAt(I,s),I++))}me[N].count=We[N].count=E,Re[N].count=C,j.count=$.count=I,st+=E;for(const H of[me[N],We[N],Re[N],j,$])Ut(H)}),Ne.copy(o),$t=performance.now()-c}_t(a);const Da=650,oe=new qt(Eo(),ba,Math.max(1,t.length)),Fa=t.map(o=>new pt().compose(new d(o.x,o.y-o.scale*.25,o.z),new Qt().setFromEuler(new da(o.tilt,o.rot,o.tilt*.5)),new d(o.scale,o.scale*.7,o.scale*.9)));oe.castShadow=!0,oe.receiveShadow=!0,oe.frustumCulled=!1,oe.name="rocks",oe.instanceMatrix.setUsage(Jt),oe.count=0,e.add(oe);function Pa(o){let c=0;t.forEach((s,g)=>{(s.x-o.x)**2+(s.z-o.z)**2<Da**2&&oe.setMatrixAt(c++,Fa[g])}),oe.count=c,Ut(oe)}let he=n;function Lt(o){he=o,ya(he.grass,he.patch);for(const c of _e)c.lod=-1;Ne.set(1e9,0,0)}Lt(n);let ve=null,Ee=0,it=new d(0,-1,0);const Ba=Math.ceil(v/90);function Ha(o,c=!0){const s=To(o);L.uStars.value=o.stars??0,L.uSunDir.value.copy(s),L.uSunCol.value.copy(ce(o.sun).multiplyScalar(o.sunI)),L.uZenith.value.copy(ce(o.zenith)),L.uHorizon.value.copy(ce(o.horizon)),L.uAmbSky.value.copy(ce(o.ambSky).multiplyScalar(o.ambI)),L.uAmbGround.value.copy(ce(o.ambGround).multiplyScalar(o.ambI)),L.uHaze.value=o.haze,L.uHazeFall.value=o.hazeFall,Dt.uniforms.uCloud.value=o.cloud,c?(aa(F,[s.x,s.y,s.z],x),D.needsUpdate=!0,it.copy(s),ve=null):it.angleTo(s)>wt.degToRad(.8)&&!ve&&(ve=[s.x,s.y,s.z],Ee=0)}function Wa(){if(!ve)return;const o=Math.min(v,Ee+Ba);aa(F,ve,z,[Ee,o]),Ee=o,Ee>=v&&(x.set(z),D.needsUpdate=!0,it.set(...ve),ve=null)}function Ra(o,c){if(!r.fine)return;const s=Math.round(o-Y/2),g=Math.round(c-Y/2),M=Y/(R-1);for(let S=0;S<R;S++)for(let B=0;B<R;B++)be[S*R+B]=r.fine(s+B*M,g+S*M);ae.needsUpdate=!0,U.set(o,c),Pe.uniforms.uFineAt.value.set(s,g,Y,R)}return{uniforms:L,root:m,setHour:Ha,setQuality:Lt,setTrees:_t,get partitionMs(){return $t},get groundBytes(){return A},setGround(o){o!==A&&A.set(o),P.needsUpdate=!0},setCanopy(o){for(let c=0;c<i*i;c++)w[c*4]=o[c];O.needsUpdate=!0},setFloor(o){Ce.set(o),Te.needsUpdate=!0},setSoil(o,c,s){ie.uniforms.uSoil.value.set(c,s,o,0);const g=o>.01;ie.transparent!==g&&(ie.transparent=g,ie.needsUpdate=!0),ie.depthWrite=o<.5,Pt=o<.05},setGloom(o,c,s){L.uGloom.value.set(o.r,o.g,o.b,c),L.uGloomD.value=s},setClear(o,c,s,g,M){Ge[`uClear${o}`].value=c??W,Ge.uClearAt.value[o].set(s,g,c?M:.001)},update(o,c){const s=o.position;L.uTime.value=c,Wa(),r.fine&&Math.hypot(s.x-U.x,s.z-U.y)>Y*.22&&Ra(s.x,s.z),Fe.position.copy(s),pa(s),Pe.uniforms.uCenter.value.set(s.x,s.z),ee&&(ee.visible=Pt&&s.y-at(s.x,s.z)<ga),Math.hypot(s.x-Ne.x,s.z-Ne.z)>12&&(ka(s),Pa(s))},colliders(){return lt.map(o=>({x:o.x,z:o.z,radius:Oe[o.kind].radius*o.scale,cameraClearance:Oe[o.kind].radius*o.scale+.3}))},sunAt(o,c){const s=u*p,g=Math.round((o+f)/s),M=Math.round((c+f)/s);return g<0||M<0||g>=v||M>=v?1:x[M*v+g]/255},stats:()=>({tiles:_e.length,nearTrees:st})}}function X(e,l){const a=e;for(const i of Object.keys(a.attributes))i!=="position"&&i!=="normal"&&a.deleteAttribute(i);const t=a.getAttribute("position"),n=new Float32Array(t.count),r=new d;for(let i=0;i<t.count;i++)n[i]=l(r.fromBufferAttribute(t,i));return a.setAttribute("aShade",new Qe(n,1)),a}function vt(e,l,a,t,n=1,r=1){let i=new yt(e,n);i.deleteAttribute("uv"),i=gt(i);const u=i.getAttribute("position"),f=i.getAttribute("normal"),h=new d,m=re(t),p=Array.from({length:5},()=>new d(m()-.5,m()-.5,m()-.5).normalize());for(let v=0;v<u.count;v++){h.fromBufferAttribute(u,v);const w=h.clone().normalize();let x=1;for(const F of p)x+=Math.max(0,w.dot(F))**4*.22;h.copy(w).multiplyScalar(e*x),h.y*=r,h.add(l),u.setXYZ(v,h.x,h.y,h.z);const z=h.clone().sub(a).normalize().multiplyScalar(.7).add(w.multiplyScalar(.3)).normalize();f.setXYZ(v,z.x,z.y,z.z)}return i}function ma(e){if(e===9)return ko();if(e===10)return Do();if(e===11)return Po();if(e===12)return Ho();if(e===13)return Ro();const l=re(e*101+9);if(new d(0,1,0),e<3||e>=5){const m=e>=5,p=m?4.85:[8.5,10.5,7.5][e],v=m?2.75:p*.66,w=m?1.25:[2.6,2.1,3.2][e],x=m?1.2:[1.7,2.4,1.3][e],z=m?.55:1,F=m?[.15,.42]:[.16,.3],D=new mt(F[0],F[1],v+(m?.45:0),8,3);D.translate(0,(v+(m?.45:0))/2,0);const A=[0,1,2].map(U=>{const O=U/3*Math.PI*2+l(),J=new mt(.07,.13,w*1.1,6);return J.translate(0,w*.55,0),J.applyMatrix4(new pt().makeRotationFromEuler(new da(Math.cos(O)*.8,0,Math.sin(O)*.8))),J.translate(0,v*.8,0),J}),P=X(q([D,...A].map(U=>(U.deleteAttribute("uv"),U))),U=>.55+.45*Math.min(1,U.y/v)),W=new d(0,v+x*.6,0),Y=[],R=m?5:7+Math.floor(l()*3);for(let U=0;U<R;U++){const O=U/R*Math.PI*2+l()*.5,J=(l()-.35)*x,Ce=w*(.55+l()*.35);Y.push(vt((1.5+l()*.9)*z*(m?1.2:1),new d(Math.cos(O)*Ce,W.y+J,Math.sin(O)*Ce),W,e*31+U))}Y.push(vt(2.2*z,new d(0,W.y+x*.75,0),W,e*31+99));const be=X(q(Y),U=>{const O=U.clone().sub(W);return Math.min(1,.5+.35*(O.y/(x+2)+.6)+.25*Math.hypot(O.x,O.z)/(w+2))}),ae=X(q([vt(w+1.3*z,W.clone(),W.clone().setY(W.y-1),e+500,0,(x+2*z)/(w+1.3*z))]),U=>.6+.4*Math.min(1,Math.max(0,(U.y-W.y+2)/4)));return{trunk:P,crown:be,far:ae,radius:m?.32:.3}}const a=e===3?13:10,t=[],n=new mt(.1,.32,a*.9,7,2);n.translate(0,a*.45,0),n.deleteAttribute("uv");for(let m=0;m<5;m++){const p=m/5,v=(e===3?2.6:3)*(1-p*.78),w=a*.34*(1-p*.35),x=a*(.18+p*.62);let z=new ta(v,w,11,2);z.deleteAttribute("uv"),z=gt(z);const F=z.getAttribute("position"),D=z.getAttribute("normal"),A=new d;for(let P=0;P<F.count;P++){A.fromBufferAttribute(F,P);const W=Math.hypot(A.x,A.z),Y=1+.12*Math.sin(Math.atan2(A.z,A.x)*5+m*2);F.setXYZ(P,A.x*Y,A.y+w/2+x-W/v*.5,A.z*Y);const R=new d(A.x,v*.9,A.z).normalize();D.setXYZ(P,R.x,R.y,R.z)}t.push(z)}const r=X(q(t),m=>.5+.5*Math.min(1,Math.hypot(m.x,m.z)/2.2*.6+m.y/a*.5));let i=new ta(e===3?2.6:3,a*.9,6,1);i.deleteAttribute("uv"),i.translate(0,a*.55,0);const u=i.getAttribute("position"),f=i.getAttribute("normal"),h=new d;for(let m=0;m<u.count;m++){h.fromBufferAttribute(u,m);const p=new d(h.x,1.6,h.z).normalize();f.setXYZ(m,p.x,p.y,p.z)}return i=X(i,m=>.55+.45*Math.min(1,m.y/a)),{trunk:X(n,m=>.5+.5*Math.min(1,m.y/a)),crown:r,far:i,radius:.3}}function K(e,l,a,t=8,n=5,r=!1){const i=new bt(e),u=new so(i,t,1,n,!1),f=u.getAttribute("position"),h=new d,m=new d;for(let p=0;p<=t;p++){const v=p/t,w=l+(a-l)*v;i.getPointAt(v,m);for(let x=0;x<=n;x++){const z=p*(n+1)+x;h.fromBufferAttribute(f,z).sub(m).multiplyScalar(w).add(m),f.setXYZ(z,h.x,h.y,h.z)}}if(r){const p=u.getAttribute("uv"),v=i.getLength(),w=Math.PI*(l+a);for(let x=0;x<p.count;x++)p.setXY(x,p.getX(x)*v,p.getY(x)*w)}else u.deleteAttribute("uv");return u.computeVertexNormals(),u}function ko(){const e=re(9091),l=[],a=[],t=4.6;l.push(K([new d(0,-.2,0),new d(.05,t*.4,.03),new d(-.04,t*.75,.02),new d(.02,t,0)],.36,.08,8,7));for(let u=0;u<6;u++){const f=u/6*Math.PI*2+e()*.6,h=t*(.45+e()*.45),m=1.4+e()*1.4,p=new d(Math.cos(f),.55+e()*.5,Math.sin(f)).normalize(),v=new d(0,h,0),w=v.clone().addScaledVector(p,m*.5).add(new d((e()-.5)*.4,-.1,(e()-.5)*.4)),x=v.clone().addScaledVector(p,m);l.push(K([v,w,x],.09,.03,5,4));for(let z=0;z<3;z++){const F=2*Math.PI*e(),D=w.clone().lerp(x,e()),A=D.clone().add(new d(Math.cos(F)*.6,.35+e()*.4,Math.sin(F)*.6)),P=A.clone().add(new d(Math.cos(F+.9)*.3,.25,Math.sin(F+.9)*.3));a.push(K([D,A,P],.03,.008,3,3))}}const n=X(q(l),u=>.5+.5*Math.min(1,u.y/t)),r=X(q(a),()=>.85),i=X(q([K([new d(0,0,0),new d(.1,t*.6,0),new d(0,t,0)],.32,.06,3,4),K([new d(0,t*.55,0),new d(1.2,t*.85,.3),new d(2,t*1.05,.5)],.1,.03,2,3),K([new d(0,t*.65,0),new d(-1,t*.9,-.5),new d(-1.6,t*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:n,crown:r,far:i,radius:.3}}function Do(){const e=re(1010),l=[],a=[],t=(u,f,h,m,p)=>{const v=new d(-f.z,0,f.x).normalize(),w=(e()-.5)*.8,x=u.clone().addScaledVector(f,h*.5).addScaledVector(v,w*h*.3),z=u.clone().addScaledVector(f,h).addScaledVector(v,w*h*.5);if(l.push(K([u,x,z],m,m*.62,5,5)),p===0){for(let D=0;D<3;D++){const A=new yt(.22+e()*.16,0);A.translate(z.x+(e()-.5)*.5,z.y+(e()-.3)*.45,z.z+(e()-.5)*.5),a.push(A)}return}const F=2;for(let D=0;D<F;D++){const A=D/F*Math.PI*2+e(),P=f.clone().multiplyScalar(.7).add(new d(Math.cos(A)*.7,.15+e()*.3,Math.sin(A)*.7)).normalize();t(z,P,h*(.62+e()*.15),m*.6,p-1)}};t(new d(0,-.3,0),new d(0,1,0),3,.45,2);const n=X(q(l),u=>.45+.55*Math.min(1,u.y/6)),r=X(q(a),u=>.55+.45*Math.min(1,u.y/6)),i=q([K([new d(0,-.3,0),new d(.3,2.5,0),new d(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(u=>{const f=u*2.1,h=new ca(1.1,7,5);return h.deleteAttribute("uv"),h.translate(Math.cos(f)*1.2,4.6+u*.4,Math.sin(f)*1.2),h})]);return{trunk:n,crown:r,far:X(i,u=>.45+.55*Math.min(1,u.y/6)),radius:.42}}const Q={11:{sprite:"pine",frame:[5,7.2],bark:"bark-pine",barkScale:[.8,1.2]},12:{sprite:"oak",frame:[6.4,6.8],bark:"bark-oak",barkScale:[1,1.6]},13:{sprite:"cedar",frame:[3.6,9.4],bark:"bark-cedar",barkScale:[.6,1.4]}},ne=3.4;function Mt(e){const[l,a]=Q[e].frame,t=[],n=new d,r=new d(0,1,0);for(const f of[0,Math.PI/2]){const h=new ua(l,a);h.translate(0,a/2-.25,0),h.rotateY(f),t.push(h)}const i=q(t),u=i.getAttribute("normal");for(let f=0;f<u.count;f++)n.set(u.getX(f),0,u.getZ(f)).multiplyScalar(.5).add(r).normalize(),u.setXYZ(f,n.x,n.y,n.z);return ge(i,f=>.6+.4*Math.min(1,Math.max(0,f.y/a)))}function St(e,l,a=.7){const t=e.getAttribute("position"),n=e.getAttribute("normal"),r=new d,i=new d(0,1,0);for(let u=0;u<t.count;u++)r.fromBufferAttribute(t,u).sub(l),r.y*=a,r.normalize().lerp(i,.3).normalize(),n.setXYZ(u,r.x,r.y,r.z)}const Fo=6.4;function Po(){const e=re(1111),l=Fo,a=[],t=[],n=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.28),r=[0,.3,.62,1].map(w=>new d(n.x*Math.sin(w*Math.PI)*1.4+n.z*w*.3,-.2+(l*.97+.2)*w,n.z*Math.sin(w*Math.PI)*1.4-n.x*w*.3));a.push(K(r,.3,.05,7,6,!0));const i=new bt(r),u=w=>i.getPoint(Math.min(1,Math.max(0,(w+.2)/(l*.97+.2)))),f=new d(0,ne+(l-ne)*.55,0),h=(w,x,z=!0)=>t.push({position:w.clone().sub(new d(0,x*.45,0)),yaw:e()*Math.PI,width:x,height:x*(.85+e()*.3),flat:z}),m=5;for(let w=0;w<m;w++){const x=w/(m-1),z=ne-.1+x*(l-ne-.9),F=w*2.4+e()*.8,D=(1.9-x*.8)*(.85+e()*.3),A=.35+x*.35+e()*.2,P=new d(Math.cos(F),A,Math.sin(F)).normalize(),W=u(z),Y=W.clone().addScaledVector(P,D*.5).add(new d((e()-.5)*.4,(e()-.6)*.3,(e()-.5)*.4)),R=W.clone().addScaledVector(P,D).add(new d(0,.15+e()*.3,0));a.push(K([W,Y,R],.09-x*.03,.025,3,4,!0)),h(Y.clone().lerp(R,.35).add(new d(0,.25,0)),.95+e()*.3,!1),h(R.clone().add(new d(0,.3,0)),1.25+e()*.4),e()<.6&&h(R.clone().add(new d((e()-.5)*.9,.55+e()*.3,(e()-.5)*.9)),.9+e()*.3)}for(let w=0;w<3;w++){const x=u(l*.97-w*.55);h(x.clone().add(new d((e()-.5)*.7,.35,(e()-.5)*.7)),1+e()*.3,w===0)}const p=ge(q(a),w=>.5+.5*Math.min(1,w.y/l)),v=xt(t);return St(v,f),{trunk:p,crown:ge(v,w=>Math.min(1,.55+.3*(w.y-ne)/(l-ne)+.25*Math.hypot(w.x,w.z)/2.2)),far:Mt(11),radius:.32}}const Bo=6;function Ho(){const e=re(1212),l=Bo,a=[],t=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.22),n=[0,.35,.7,1].map(p=>new d(t.x*Math.sin(p*Math.PI*1.3)*1.2,-.2+(l*.78+.2)*p,t.z*Math.sin(p*Math.PI*1.3)*1.2));a.push(K(n,.34,.12,6,7,!0));const r=new bt(n),i=p=>r.getPoint(Math.min(1,Math.max(0,(p+.2)/(l*.78+.2)))),u=new d(0,ne+(l-ne)*.6,0),f=[];for(let p=0;p<5;p++){const v=p/4,w=ne-.5+v*(l*.78-ne+.3),x=p*2.5+e()*.9,z=(2.4-v*.9)*(.85+e()*.3),F=.45+v*.4,D=new d(Math.cos(x),F,Math.sin(x)).normalize(),A=i(w),P=A.clone().addScaledVector(D,z*.55).add(new d((e()-.5)*.5,(e()-.4)*.3,(e()-.5)*.5)),W=A.clone().addScaledVector(D,z).add(new d(0,.2+e()*.3,0));a.push(K([A,P,W],.13-v*.04,.04,3,5,!0));const Y=x+(e()-.5)*1.6,R=P.clone().add(new d(Math.cos(Y)*z*.45,.35+e()*.4,Math.sin(Y)*z*.45));a.push(K([P,P.clone().lerp(R,.5).add(new d(0,.1,0)),R],.07,.03,2,4,!0));for(const be of[W,R,P.clone().lerp(W,.6)]){const ae=1.3+e()*.6;f.push({position:be.clone().add(new d((e()-.5)*.5,.1-ae*.3,(e()-.5)*.5)),yaw:e()*Math.PI,width:ae,height:ae*(.85+e()*.3),flat:e()<.6})}}f.push(...co(e,u,2.3,1.2,2.3,9,1.5));const h=ge(q(a),p=>.5+.5*Math.min(1,p.y/l)),m=xt(f);return St(m,u,.6),{trunk:h,crown:ge(m,p=>{const v=p.clone().sub(u);return Math.min(1,.45+.35*(v.y/2.6+.6)+.25*Math.hypot(v.x,v.z)/3.2)}),far:Mt(12),radius:.34}}const Wo=9;function Ro(){const e=re(1313),l=Wo,a=[],t=K([new d(0,-.2,0),new d(.04,l*.5,.02),new d(0,l*.96,0)],.2,.03,4,6,!0),n=7;for(let i=0;i<n;i++){const u=i/(n-1),f=1.3+u*(l-1.9),h=(2.4-u*1.5)*(.9+e()*.2),m=2.2-u*.6;for(const p of[0,1.05])a.push({position:new d((e()-.5)*.3,f-m*.45,(e()-.5)*.3),yaw:i*.9+p+e()*.3,width:h,height:m,flat:!1})}a.push({position:new d(0,l-.9,0),yaw:e()*3,width:.7,height:1.3,flat:!1});const r=xt(a);return St(r,new d(0,l*.5,0),.25),{trunk:ge(t,i=>.45+.55*Math.min(1,i.y/l)),crown:ge(r,i=>.5+.3*Math.min(1,i.y/l)+.2*Math.min(1,Math.hypot(i.x,i.z)/.9)),far:Mt(13),radius:.22}}function ge(e,l){for(const r of Object.keys(e.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&e.deleteAttribute(r);const a=e.getAttribute("position"),t=new Float32Array(a.count),n=new d;for(let r=0;r<a.count;r++)t[r]=l(n.fromBufferAttribute(a,r));return e.setAttribute("aShade",new Qe(t,1)),e}function No(e,l,a,t,n,r){const[i,u]=Q[l].frame,f=256,h=new qa(Math.round(f*i/u),f,{format:qe,colorSpace:Qa});h.texture.minFilter=Ja,h.texture.generateMipmaps=!0;const m=new eo,p=ma(l),v=Q[l].barkScale,w=r.clone();w.repeat.set(v[0],v[1]),w.needsUpdate=!0,m.add(new de(p.trunk,new ea({color:n,map:w,toneMapped:!1}))),m.add(new de(p.crown,new ea({color:t,map:a,alphaTest:.5,side:Ae,toneMapped:!1}))),m.add(new to("#ffffff","#8a8a80",1));const x=new ao("#fff4e0",.35);x.position.set(.5,1,1),m.add(x);const z=new oo(-i/2,i/2,u-.25,-.25,-20,20);z.position.set(0,0,10),z.lookAt(0,0,0);const F=e.getRenderTarget(),D=e.getClearColor(new ue),A=e.getClearAlpha();return e.setRenderTarget(h),e.setClearColor("#000000",0),e.clear(),e.render(m,z),e.setRenderTarget(F),e.setClearColor(D,A),p.trunk.dispose(),p.crown.dispose(),p.far.dispose(),h.texture}function Eo(){let e=new yt(1,1);e.deleteAttribute("uv"),e=gt(e);const l=e.getAttribute("position"),a=new d,t=re(5);for(let n=0;n<l.count;n++)a.fromBufferAttribute(l,n),a.multiplyScalar(.8+t()*.35),l.setXYZ(n,a.x,a.y,a.z);return e=e.toNonIndexed(),e.computeVertexNormals(),X(e,n=>.55+.45*Math.min(1,Math.max(0,n.y+.6)))}export{fe as A,ia as C,ye as F,Yo as H,Ie as M,se as N,$o as Q,po as a,na as b,wo as c,Lo as d,To as e,ra as s};
