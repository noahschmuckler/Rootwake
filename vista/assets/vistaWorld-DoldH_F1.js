import{X as Wa,Y as Ra,a6 as Na,aw as Ia,ax as Ea,G as Ot,a5 as pe,ay as ut,az as Ve,aA as je,aB as Vt,ab as qe,aC as jt,aD as Zt,i as Ze,am as dt,C as ce,V as d,k as ke,M as ue,ag as Ke,Z as Ga,r as sa,b as _a,l as la,R as Ua,z as ft,_ as Xe,aE as Ya,aF as $a,I as Kt,w as pt,Q as Xt,x as ia,aj as qt,e as wt,ak as La,al as Oa,g as Va,aG as ja,aH as Za,S as Ka,ao as Qt,H as Xa,D as qa,an as Qa,u as mt,n as q,d as Jt,a4 as gt,v as bt,j as yt,J as Qe,aI as Ja,aJ as eo,s as to}from"./BufferGeometryUtils-BMCnC2iH.js";import{r as re,e as ea,n as ao,s as oo}from"./vistaTerrain-BQ6jDvM3.js";import{b as ta,a as xt,c as no}from"./sprites-B8NOVg88.js";import{m as ro}from"./colors-BKJfVazC.js";const se=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,de=`
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
`,Ge=`
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
`,ca=`
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
`,be=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,so=`
${Je}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,lo=`
${et}
${se}${de}${Ge}${zt}${ca}
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
  ${be}
}`,io=`
${Je}
${se}${de}${Ge}${zt}${ca}
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
}`,co=`
${et}
${se}${de}
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
  ${be}
}`,aa=`
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
}`,oa=`
${et}
${se}${de}${Ge}
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
  ${be}
}`,uo=`
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
}`,fo=`
${et}
${se}${de}${Ge}
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
  ${be}
}`,mo=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,ho=`
${se}${de}
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
  ${be}
}`,vo=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,po=`
${se}${de}${Ge}
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
  ${be}
}`,wo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,go=`
${se}${de}
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
  ${be}
}`,na=new Map,b=512;function Z(e,l){for(const a of[-b,0,b])for(const t of[-b,0,b])e.save(),e.translate(a,t),l(),e.restore()}const D=(e,l,a,t=1)=>`rgba(${Math.round(e)}, ${Math.round(l)}, ${Math.round(a)}, ${t})`;function we(e,l,a){const t=e.getImageData(0,0,b,b),n=t.data;for(let r=0;r<n.length;r+=4){const i=1+(l()-.5)*2*a;n[r]=Math.min(255,n[r]*i),n[r+1]=Math.min(255,n[r+1]*i),n[r+2]=Math.min(255,n[r+2]*i)}e.putImageData(t,0,0)}function Se(e,l,a,t,n,r,i){const u=l()*Math.PI*2,f=(l()-.5)*.25*n;e.strokeStyle=i,e.lineWidth=r,e.lineCap="round",e.beginPath(),e.moveTo(a,t),e.quadraticCurveTo(a+Math.cos(u)*n*.5-Math.sin(u)*f,t+Math.sin(u)*n*.5+Math.cos(u)*f,a+Math.cos(u)*n,t+Math.sin(u)*n),e.stroke()}function ra(e,l,a,t,n,r,i){const u=l()*Math.PI*2,f=n*(.5+l()*.25),h=5+Math.floor(l()*3);e.save(),e.translate(a,t),e.rotate(u),e.fillStyle=r,e.beginPath();for(let m=0;m<=24;m++){const p=m/24,v=p*Math.PI*2,w=1-.22*Math.abs(Math.sin(v*h*.5))*(.5+.5*Math.abs(Math.sin(v))),y=Math.cos(v)*n*.5*w,z=Math.sin(v)*f*.5*w;m===0?e.moveTo(y,z):e.lineTo(y,z)}e.closePath(),e.fill(),e.strokeStyle=i,e.lineWidth=1.2,e.beginPath(),e.moveTo(-n*.45,0),e.lineTo(n*.45,0),e.stroke(),e.restore()}function ht(e,l,a,t,n){const r=l()*Math.PI*2;e.strokeStyle=D(70+l()*30,52+l()*20,35),e.lineWidth=2+l()*2.5,e.lineCap="round",e.beginPath(),e.moveTo(a,t);const i=a+Math.cos(r)*n*.5+(l()-.5)*8,u=t+Math.sin(r)*n*.5+(l()-.5)*8;if(e.lineTo(i,u),e.lineTo(a+Math.cos(r)*n,t+Math.sin(r)*n),e.stroke(),l()<.5){const f=r+.5+l();e.lineWidth*=.6,e.beginPath(),e.moveTo(i,u),e.lineTo(i+Math.cos(f)*n*.35,u+Math.sin(f)*n*.35),e.stroke()}}function bo(e){const l=document.createElement("canvas");l.width=l.height=b;const a=l.getContext("2d"),t=ro({sand:101,needles:102,leaves:103,moss:104,"bark-pine":105,"bark-oak":106,"bark-cedar":107}[e]);return e==="sand"?(a.fillStyle=D(168,152,120),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<1400;n++)a.fillStyle=D(120+t()*70,105+t()*60,75+t()*45,.5),a.beginPath(),a.arc(t()*b,t()*b,.6+t()*1.8,0,7),a.fill()}),Z(a,()=>{for(let n=0;n<16;n++){const r=t()*b,i=t()*b,u=10+t()*26;a.fillStyle=D(150+t()*20,158+t()*20,132+t()*20,.5);for(let f=0;f<7;f++)a.beginPath(),a.arc(r+(t()-.5)*u,i+(t()-.5)*u,u*.3*(.6+t()),0,7),a.fill()}}),Z(a,()=>{for(let n=0;n<24;n++){const r=t();ra(a,t,t()*b,t()*b,22+t()*20,D(110+r*50,80+r*35,40+r*15),D(60,40,20,.5))}}),Z(a,()=>{for(let n=0;n<260;n++)Se(a,t,t()*b,t()*b,18+t()*24,1.5,D(130+t()*50,95+t()*35,50,.8));for(let n=0;n<9;n++)ht(a,t,t()*b,t()*b,30+t()*50)}),we(a,t,.07)):e==="needles"?(a.fillStyle=D(62,44,30),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<1700;n++){const r=t();Se(a,t,t()*b,t()*b,22+t()*34,1.3+t()*1.4,D(120+r*80,78+r*50,38+r*30,.85))}}),Z(a,()=>{for(let n=0;n<9;n++)ht(a,t,t()*b,t()*b,36+t()*60);for(let n=0;n<4;n++){const r=t()*b,i=t()*b;for(let u=0;u<14;u++)a.fillStyle=D(80+t()*40,58+t()*25,36,.95),a.beginPath(),a.ellipse(r+(t()-.5)*16,i+(t()-.5)*24,4,2.5,t()*3,0,7),a.fill()}}),Z(a,()=>{for(let n=0;n<500;n++){const r=t();Se(a,t,t()*b,t()*b,20+t()*30,1.2+t(),D(150+r*60,100+r*40,50+r*20,.8))}}),we(a,t,.06)):e==="leaves"?(a.fillStyle=D(48,34,22),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<140;n++){const r=t(),i=t()<.35,u=i?D(150+r*50,95+r*40,40+r*20):D(70+r*40,50+r*25,30+r*12);ra(a,t,t()*b,t()*b,34+t()*30,u,i?D(110,70,30,.6):D(40,28,16,.6))}}),Z(a,()=>{for(let n=0;n<260;n++){const r=t();Se(a,t,t()*b,t()*b,20+t()*28,1.4,D(130+r*60,90+r*40,45,.8))}for(let n=0;n<6;n++)ht(a,t,t()*b,t()*b,30+t()*50)}),we(a,t,.06)):e==="moss"?(a.fillStyle=D(40,34,24),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<70;n++){const r=t()*b,i=t()*b,u=14+t()*30,f=t();for(let h=0;h<40;h++){a.fillStyle=D(70+f*60+t()*30,95+f*60+t()*30,30+f*20,.7);const m=t()*7,p=Math.sqrt(t())*u;a.beginPath(),a.arc(r+Math.cos(m)*p,i+Math.sin(m)*p,2+t()*3,0,7),a.fill()}}}),Z(a,()=>{for(let n=0;n<160;n++){const r=t();Se(a,t,t()*b,t()*b,16+t()*26,1.2,D(110+r*50,80+r*30,40,.7))}for(let n=0;n<120;n++)Se(a,t,t()*b,t()*b,30+t()*40,1.6,D(90+t()*50,120+t()*50,40,.75))}),we(a,t,.06)):e==="bark-pine"?(a.fillStyle=D(70,42,30),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<160;n++){const r=t()*b,i=t()*b,u=22+t()*40,f=40+t()*90,h=t();a.fillStyle=D(78+h*40,66+h*32,54+h*26),a.beginPath();for(let m=0;m<=10;m++){const p=m/10*Math.PI*2,v=1+(t()-.5)*.3,w=r+Math.cos(p)*u*.5*v,y=i+Math.sin(p)*f*.5*v;m===0?a.moveTo(w,y):a.lineTo(w,y)}a.closePath(),a.fill(),a.strokeStyle=D(40,24,16,.8),a.lineWidth=2.5,a.stroke(),a.fillStyle=D(120+h*50,105+h*40,85+h*30,.35),a.beginPath(),a.ellipse(r-u*.1,i-f*.15,u*.22,f*.25,0,0,7),a.fill()}}),we(a,t,.09)):e==="bark-oak"?(a.fillStyle=D(52,42,34),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<220;n++){const r=t()*b,i=t()*b,u=7+t()*12,f=40+t()*90,h=t();a.fillStyle=D(72+h*30,64+h*26,54+h*22),a.beginPath(),a.moveTo(r-u/2,i-f/2),a.lineTo(r+u/2+(t()-.5)*5,i-f/2+4),a.lineTo(r+u/2,i+f/2),a.lineTo(r-u/2+(t()-.5)*5,i+f/2-4),a.closePath(),a.fill(),a.strokeStyle=D(32,24,18,.8),a.lineWidth=2.5,a.stroke(),a.strokeStyle=D(100+h*30,94+h*26,84+h*22,.4),a.lineWidth=1.5,a.beginPath(),a.moveTo(r-u*.15,i-f*.4),a.lineTo(r-u*.1,i+f*.4),a.stroke()}}),we(a,t,.08)):(a.fillStyle=D(92,78,64),a.fillRect(0,0,b,b),Z(a,()=>{for(let n=0;n<600;n++){const r=t()*b,i=t()*b,u=40+t()*160,f=t();a.strokeStyle=D(60+f*70,52+f*60,42+f*50,.7),a.lineWidth=1+t()*3,a.beginPath(),a.moveTo(r,i),a.lineTo(r+(t()-.5)*6,i+u),a.stroke()}}),we(a,t,.08)),l}function Ae(e){const l=na.get(e);if(l)return l;const a=new Wa(bo(e));return a.colorSpace=Ra,a.wrapS=a.wrapT=Na,a.anisotropy=4,na.set(e,a),xo().then(t=>{t.includes(e)&&new Ia().load(`/Rootwake/vista/textures/barrens/${e}.jpg`,n=>{a.dispose(),a.source=new Ea(n.image),a.needsUpdate=!0})}),a}let yo=null;const xo=()=>yo??=fetch("/Rootwake/vista/textures/barrens/index.json").then(e=>e.ok?e.json():[]).then(e=>Array.isArray(e)?e.filter(l=>typeof l=="string"):[]).catch(()=>[]),Eo=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function zo(e){const l=wt.degToRad(e.elevation),a=wt.degToRad(e.azimuth);return new d(Math.sin(a)*Math.cos(l),Math.sin(l),-Math.cos(a)*Math.cos(l)).normalize()}const Go=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],ie=(e,l=1)=>new ce(e).multiplyScalar(l),Mo=1;function _o(e,l,a,t,n,r={}){const{n:i,cell:u,half:f,size:h}=l,m=new Ot;m.name="vista",e.add(m),e=m;const p=i>600?2:1,v=(i-1)/p+1,w=new Uint8Array(i*i*4),y=new Uint8Array(v*v),z=new Uint8Array(v*v),P=p===1?l:{...l,n:v,cell:u*p,h:(()=>{const o=new Float32Array(v*v);for(let s=0;s<v;s++)for(let c=0;c<v;c++)o[s*v+c]=l.h[s*p*i+c*p];return o})()},F=new pe(y,v,v,ut,Ve);F.magFilter=F.minFilter=je,F.wrapS=F.wrapT=Vt;const k=new Uint8Array(i*i*4);r.ground&&k.set(r.ground);const B=new pe(k,i,i,qe,Ve);B.magFilter=B.minFilter=je,B.needsUpdate=!0;const H=new pe(new Uint8Array(4),1,1);H.needsUpdate=!0;const $=96,W=97,ye=new Float32Array(W*W),ae=new pe(ye,W,W,ut,jt);ae.magFilter=ae.minFilter=Zt;let U=new Ze(1e9,1e9);for(let o=0;o<i*i;o++)w[o*4+1]=Math.round(l.ao[o]*255),w[o*4+2]=Math.round(l.flow[o]*255),w[o*4+3]=Math.round(l.sediment[o]*255);const O=new pe(w,i,i,qe,Ve);O.magFilter=O.minFilter=je,O.wrapS=O.wrapT=Vt;const J=new pe(new Float32Array(l.h),i,i,ut,jt);J.magFilter=J.minFilter=Zt,J.needsUpdate=!0;const Ce=new Uint8Array(i*i*4),Te=new pe(Ce,i,i,qe,Ve);Te.magFilter=Te.minFilter=je,Te.needsUpdate=!0;const L={uSunDir:{value:new d(0,1,0)},uSunCol:{value:new ce},uZenith:{value:new ce},uHorizon:{value:new ce},uAmbSky:{value:new ce},uAmbGround:{value:new ce},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:r.hazeBase??l.waterY},uHazeBelow:{value:r.hazeBelow??1},uLowY:{value:r.lowY??-1e5},uTime:{value:0},uMapData:{value:O},uSunTex:{value:F},uGround:{value:B},uFloor:{value:Te},uHeight:{value:J},uMapHalf:{value:f},uCell:{value:u},uN:{value:i},uSunN:{value:v},uWaterY:{value:Number.isFinite(l.waterY)?l.waterY:-1e4},uSnowY:{value:l.snowY},uGloom:{value:new dt(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},De=(o,s,c={},g={})=>{const M={...La.merge([Oa.lights]),...L,...c};return new Ke({uniforms:M,vertexShader:o,fragmentShader:s,lights:!0,defines:g})},tt=16,At=(i-1)/tt,Fe=At*u,da=110,kt=l.surface&&r.fineLod?[.5,1,2,4,8]:[1,2,4,8],_e={uClear0:{value:H},uClear1:{value:H},uClear2:{value:H},uClearAt:{value:[new d(0,0,.001),new d(0,0,.001),new d(0,0,.001)]}},le=De(so,lo,{uSoil:{value:new dt(0,0,0,0)},..._e,uTexSand:{value:Ae("sand")},uTexNeedles:{value:Ae("needles")},uTexLeaves:{value:Ae("leaves")},uTexMoss:{value:Ae("moss")}});le.side=ke;const at=(o,s)=>oo(l,o,s),ot=new Ot;ot.name="terrain",e.add(ot);const Ue=[];function fa(o,s,c){const g=At/c,M=o*Fe-f,S=s*Fe-f,A=c*u,Y=4+c*3,E=(g+1)*(g+1),C=new Float32Array((E+4*g)*3),G=new Float32Array((E+4*g)*3),j=[];for(let x=0;x<=g;x++)for(let I=0;I<=g;I++){const T=M+I*A,_=S+x*A,V=(x*(g+1)+I)*3,te=ao(l,T,_,Math.max(l.surface?1:u,A*.75),at);C[V]=T,C[V+1]=at(T,_),C[V+2]=_,G[V]=te[0],G[V+1]=te[1],G[V+2]=te[2]}for(let x=0;x<g;x++)for(let I=0;I<g;I++){const T=x*(g+1)+I,_=T+1,V=T+g+1,te=V+1;j.push(T,V,_,_,V,te)}const N=[];for(let x=0;x<g;x++)N.push(x);for(let x=0;x<g;x++)N.push(x*(g+1)+g);for(let x=g;x>0;x--)N.push(g*(g+1)+x);for(let x=g;x>0;x--)N.push(x*(g+1));N.forEach((x,I)=>{const T=(E+I)*3;C[T]=C[x*3],C[T+1]=C[x*3+1]-Y,C[T+2]=C[x*3+2],G[T]=G[x*3],G[T+1]=G[x*3+1],G[T+2]=G[x*3+2]});for(let x=0;x<N.length;x++){const I=N[x],T=N[(x+1)%N.length],_=E+x,V=E+(x+1)%N.length;j.push(I,_,T,T,_,V)}const R=new ft;return R.setAttribute("position",new Qe(C,3)),R.setAttribute("normal",new Qe(G,3)),R.setIndex(j),R.computeBoundingSphere(),R}for(let o=0;o<tt;o++)for(let s=0;s<tt;s++){const c={mesh:new ue(void 0,le),lod:-1,geos:[],cx:(s+.5)*Fe-f,cz:(o+.5)*Fe-f};c.mesh.receiveShadow=!0,c.mesh.matrixAutoUpdate=!1,c.mesh.userData={ti:s,tj:o},ot.add(c.mesh),Ue.push(c)}function ma(o){const[s,c,g]=he.lod,M=kt.length>4?1:0;for(const S of Ue){const A=Math.max(0,Math.hypot(S.cx-o.x,S.cz-o.z)-Fe*.7),Y=(M&&A<da?-1:A<s?0:A<c?1:A<g?2:3)+M;if(Y!==S.lod){S.lod=Y,S.geos[Y]??=fa(S.mesh.userData.ti,S.mesh.userData.tj,kt[Y]),S.mesh.geometry=S.geos[Y];for(let E=0;E<Y-1;E++)S.geos[E]&&(S.geos[E].dispose(),S.geos[E]=void 0)}}}const Ct=(o,s,c,g)=>{const M=Math.round(2*s/c),S=[],A=[],Y=[],E=new Int32Array((M+1)*(M+1)).fill(-1),C=(R,x)=>{const I=-s+R*c,T=-s+x*c;return!(I>=-o&&I+c<=o&&T>=-o&&T+c<=o)},G=(R,x)=>{const I=x*(M+1)+R;if(E[I]>=0)return E[I];const T=-s+R*c,_=-s+x*c,V=Math.abs(T)<=f&&Math.abs(_)<=f,te=(Ba,Ha)=>l.shape.base(Ba,Ha),Pa=te(T,_)-(V?6:0),Me=c,$t=-(te(T+Me,_)-te(T-Me,_)),Lt=-(te(T,_+Me)-te(T,_-Me)),ct=Math.hypot($t,2*Me,Lt);return E[I]=S.length/3,S.push(T,Pa,_),A.push($t/ct,2*Me/ct,Lt/ct),E[I]};for(let R=0;R<M;R++)for(let x=0;x<M;x++)if(C(x,R)){const I=G(x,R),T=G(x+1,R),_=G(x,R+1),V=G(x+1,R+1);Y.push(I,_,T,T,_,V)}const j=new ft;j.setAttribute("position",new Xe(S,3)),j.setAttribute("normal",new Xe(A,3)),j.setIndex(Y),j.computeBoundingSphere();const N=new ue(j,le);N.name=g,N.frustumCulled=!1,e.add(N)},Ye=Math.max(7e3,f+4500),Tt=r.farReach??Ye;Ct(f-80,Ye,80,"far-ring"),Tt>Ye&&Ct(Ye-320,Tt,320,"far-ring-2");const Dt=new Ke({uniforms:{...L,uCloud:{value:.5}},vertexShader:wo,fragmentShader:go,side:Ga,depthWrite:!1}),Pe=new ue(new sa(Math.max(8e3,(r.farReach??0)*1.25),48,24),Dt);Pe.name="sky",Pe.frustumCulled=!1,Pe.renderOrder=-10,e.add(Pe);const ha=new Ke({uniforms:{...L},vertexShader:vo,fragmentShader:po,transparent:!0,depthWrite:!1}),nt=r.waterDisc?new _a(r.waterDisc.r,64):new la(h,h,8,8);nt.rotateX(-Math.PI/2),r.waterDisc&&nt.translate(r.waterDisc.x,0,r.waterDisc.z);const $e=new ue(nt,ha);if($e.position.y=l.waterY,$e.name="lake",$e.visible=Number.isFinite(l.waterY),e.add($e),r.cloudSea){const o=r.cloudSea;for(const[s,c,g]of[[0,0,o.cover],[-90,37,o.cover]]){const M=new Ke({uniforms:{...L,uCloudSea:{value:new d(o.x,o.z,o.inner)},uCloudCover:{value:g},uCloudDrift:{value:c}},vertexShader:mo,fragmentShader:ho,transparent:!0,depthWrite:!1,side:ke}),S=new Ua(Math.max(1,o.inner-500),o.outer,96,6);S.rotateX(-Math.PI/2),S.translate(o.x,0,o.z);const A=new ue(S,M);A.position.y=o.y+s,A.name="cloud-sea",A.frustumCulled=!1,A.renderOrder=2,e.add(A)}}const Be=De(io,co,{uCenter:{value:new Ze},uPatch:{value:60},uBladeH:{value:r.bladeH??.34},uBladeW:{value:.045},uWind:{value:new Ze(.94,.34)},..._e,uFine:{value:ae},uFineAt:{value:new dt(0,0,1,0)}});Be.side=ke;const Ft=3,xe=new ft;{const o=[],s=[],c=[],g=re(3);for(let M=0;M<Ft;M++){const S=M/Ft*Math.PI*2+g()*.6,A=(g()-.5)*.12,Y=(g()-.5)*.12,E=.65+g()*.55,C=o.length/3;for(const[G,j]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])o.push(G,j,0),s.push(S,A,Y,E);c.push(C,C+1,C+2,C+2,C+1,C+3,C+2,C+3,C+4,C+4,C+3,C+5,C+4,C+5,C+6)}xe.setAttribute("position",new Xe(o,3)),xe.setAttribute("aTuft",new Xe(s,4)),xe.setIndex(c)}let ee=null,Pt=!0;const va=14;function pa(o,s){if(ee&&(ee.geometry.dispose(),e.remove(ee),ee=null),!o)return;const c=new Ja;c.index=xe.index,c.setAttribute("position",xe.getAttribute("position")),c.setAttribute("aTuft",xe.getAttribute("aTuft"));const g=re(77),M=new Float32Array(o*4);for(let S=0;S<o;S++)M[S*4]=g()*s,M[S*4+1]=g()*s,M[S*4+2]=g(),M[S*4+3]=g()*Math.PI*2;c.setAttribute("aBlade",new eo(M,4)),c.instanceCount=o,ee=new ue(c,Be),ee.frustumCulled=!1,ee.receiveShadow=!0,ee.name="grass",e.add(ee),Be.uniforms.uPatch.value=s}const Le=(o,s)=>De(aa,oa,{uColor:{value:o?ie(o):new ce}},s),wa=Le(null,{ROCK:""}),Oe=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446","#5d8f36","#4d7a2e","#35603e"],Bt=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e","#e4dcd0","#e0dad2","#e6e0d6"],Ht=(o,s,c)=>{const g=De(uo,fo,{uColor:{value:ie(o)},uMap:{value:s}},c);return g.side=ke,g},ga=(o,s)=>De(aa,oa,{uColor:{value:ie(o)},uBark:{value:Ae(s.bark)},uBarkScale:{value:new Ze(s.barkScale[0],s.barkScale[1])}},{BARK:"",UNDER:""}),Wt={},Rt={};for(const o of Object.keys(Q).map(Number)){const s=ta(Q[o].sprite);Wt[o]=r.renderer?Bo(r.renderer,o,s,Oe[o],Bt[o],Ae(Q[o].bark)):s,Rt[o]=new Ya({depthPacking:$a,map:s,alphaTest:.5,side:ke})}const Nt=o=>o>=5&&o<9?{VARIED:""}:{},rt=o=>o===9?{TWITCH:""}:o===10?{PULSE:""}:{},It=Oe.map((o,s)=>Q[s]?Ht(o,ta(Q[s].sprite),{USE_SWAY:""}):Le(o,s>=9?rt(s):{USE_SWAY:"",...Nt(s)})),ba=Oe.map((o,s)=>Q[s]?Ht("#ffffff",Wt[s],{}):Le(o,{...Nt(s),...rt(s)})),Et=Bt.map((o,s)=>Q[s]?ga(o,Q[s]):Le(o,{...rt(s),UNDER:""})),fe=Oe.map((o,s)=>ua(s)),He=(o,s,c,g)=>{const M=new Kt(o,s,Math.max(1,c));return M.count=0,M.frustumCulled=!1,M.castShadow=g,M.receiveShadow=!0,M.instanceMatrix.setUsage(qt),e.add(M),M};let me=[],We=[],Re=[],ze=[],Ne=[];function Gt(o){for(const s of[...We,...Re,...ze,...Ne])e.remove(s),s.dispose();me=fe.map((s,c)=>o.filter(g=>g.kind===c)),We=fe.map((s,c)=>He(s.trunk,Et[c],me[c].length,!1)),Re=fe.map((s,c)=>He(s.crown,It[c],me[c].length,!1)),ze=fe.flatMap((s,c)=>[He(s.trunk,Et[c],me[c].length,!0),He(s.crown,It[c],me[c].length,!0)]);for(const s of ze)s.layers.set(Mo);for(const s of Object.keys(Q).map(Number))ze[s*2+1].customDepthMaterial=Rt[s];Ne=fe.map((s,c)=>He(s.far,ba[c],me[c].length,!1)),Ie.set(1e9,0,0)}const _t=o=>{const s=o.instanceMatrix;s.clearUpdateRanges(),o.count>0&&s.addUpdateRange(0,o.count*16),s.needsUpdate=!0},ya=(o,s)=>o.frame?s.fromArray(o.frame):s.compose(new d(o.x,o.y-.15,o.z),new Xt().setFromAxisAngle(new d(0,1,0),o.rot),new d(o.scale,o.scale,o.scale));let Ie=new d(1e9,0,0),st=0,lt=[];const xa=1.25,Ut=260,za=r.treeReach??1400;function Ma(o){const s=new pt,c=(he.nearTrees*(r.nearTreesScale??1))**2,g=(he.shadow?he.shadowBox*1.25+8:0)**2,M=za**2;lt=[],st=0,me.forEach((S,A)=>{let Y=0,E=0,C=0;const[G,j]=[ze[A*2],ze[A*2+1]];for(const N of S){const R=(N.x-o.x)**2+(N.z-o.z)**2;R>M||(ya(N,s),R<c?(We[A].setMatrixAt(Y,s),Re[A].setMatrixAt(Y,s),Y++,lt.push(N)):(N.scale>=xa||R<Ut*Ut)&&Ne[A].setMatrixAt(E++,s),R<g&&(G.setMatrixAt(C,s),j.setMatrixAt(C,s),C++))}We[A].count=Re[A].count=Y,Ne[A].count=E,G.count=j.count=C,st+=Y;for(const N of[We[A],Re[A],Ne[A],G,j])_t(N)}),Ie.copy(o)}Gt(a);const Sa=650,oe=new Kt(Ho(),wa,Math.max(1,t.length)),Aa=t.map(o=>new pt().compose(new d(o.x,o.y-o.scale*.25,o.z),new Xt().setFromEuler(new ia(o.tilt,o.rot,o.tilt*.5)),new d(o.scale,o.scale*.7,o.scale*.9)));oe.castShadow=!0,oe.receiveShadow=!0,oe.frustumCulled=!1,oe.name="rocks",oe.instanceMatrix.setUsage(qt),oe.count=0,e.add(oe);function ka(o){let s=0;t.forEach((c,g)=>{(c.x-o.x)**2+(c.z-o.z)**2<Sa**2&&oe.setMatrixAt(s++,Aa[g])}),oe.count=s,_t(oe)}let he=n;function Yt(o){he=o,pa(he.grass,he.patch);for(const s of Ue)s.lod=-1;Ie.set(1e9,0,0)}Yt(n);let ve=null,Ee=0,it=new d(0,-1,0);const Ca=Math.ceil(v/90);function Ta(o,s=!0){const c=zo(o);L.uStars.value=o.stars??0,L.uSunDir.value.copy(c),L.uSunCol.value.copy(ie(o.sun).multiplyScalar(o.sunI)),L.uZenith.value.copy(ie(o.zenith)),L.uHorizon.value.copy(ie(o.horizon)),L.uAmbSky.value.copy(ie(o.ambSky).multiplyScalar(o.ambI)),L.uAmbGround.value.copy(ie(o.ambGround).multiplyScalar(o.ambI)),L.uHaze.value=o.haze,L.uHazeFall.value=o.hazeFall,Dt.uniforms.uCloud.value=o.cloud,s?(ea(P,[c.x,c.y,c.z],y),F.needsUpdate=!0,it.copy(c),ve=null):it.angleTo(c)>wt.degToRad(.8)&&!ve&&(ve=[c.x,c.y,c.z],Ee=0)}function Da(){if(!ve)return;const o=Math.min(v,Ee+Ca);ea(P,ve,z,[Ee,o]),Ee=o,Ee>=v&&(y.set(z),F.needsUpdate=!0,it.set(...ve),ve=null)}function Fa(o,s){if(!r.fine)return;const c=Math.round(o-$/2),g=Math.round(s-$/2),M=$/(W-1);for(let S=0;S<W;S++)for(let A=0;A<W;A++)ye[S*W+A]=r.fine(c+A*M,g+S*M);ae.needsUpdate=!0,U.set(o,s),Be.uniforms.uFineAt.value.set(c,g,$,W)}return{uniforms:L,root:m,setHour:Ta,setQuality:Yt,setTrees:Gt,setGround(o){k.set(o),B.needsUpdate=!0},setCanopy(o){for(let s=0;s<i*i;s++)w[s*4]=o[s];O.needsUpdate=!0},setFloor(o){Ce.set(o),Te.needsUpdate=!0},setSoil(o,s,c){le.uniforms.uSoil.value.set(s,c,o,0);const g=o>.01;le.transparent!==g&&(le.transparent=g,le.needsUpdate=!0),le.depthWrite=o<.5,Pt=o<.05},setGloom(o,s,c){L.uGloom.value.set(o.r,o.g,o.b,s),L.uGloomD.value=c},setClear(o,s,c,g,M){_e[`uClear${o}`].value=s??H,_e.uClearAt.value[o].set(c,g,s?M:.001)},update(o,s){const c=o.position;L.uTime.value=s,Da(),r.fine&&Math.hypot(c.x-U.x,c.z-U.y)>$*.22&&Fa(c.x,c.z),Pe.position.copy(c),ma(c),Be.uniforms.uCenter.value.set(c.x,c.z),ee&&(ee.visible=Pt&&c.y-at(c.x,c.z)<va),Math.hypot(c.x-Ie.x,c.z-Ie.z)>12&&(Ma(c),ka(c))},colliders(){return lt.map(o=>({x:o.x,z:o.z,radius:fe[o.kind].radius*o.scale,cameraClearance:fe[o.kind].radius*o.scale+.3}))},sunAt(o,s){const c=u*p,g=Math.round((o+f)/c),M=Math.round((s+f)/c);return g<0||M<0||g>=v||M>=v?1:y[M*v+g]/255},stats:()=>({tiles:Ue.length,nearTrees:st})}}function X(e,l){const a=e;for(const i of Object.keys(a.attributes))i!=="position"&&i!=="normal"&&a.deleteAttribute(i);const t=a.getAttribute("position"),n=new Float32Array(t.count),r=new d;for(let i=0;i<t.count;i++)n[i]=l(r.fromBufferAttribute(t,i));return a.setAttribute("aShade",new Qe(n,1)),a}function vt(e,l,a,t,n=1,r=1){let i=new bt(e,n);i.deleteAttribute("uv"),i=gt(i);const u=i.getAttribute("position"),f=i.getAttribute("normal"),h=new d,m=re(t),p=Array.from({length:5},()=>new d(m()-.5,m()-.5,m()-.5).normalize());for(let v=0;v<u.count;v++){h.fromBufferAttribute(u,v);const w=h.clone().normalize();let y=1;for(const P of p)y+=Math.max(0,w.dot(P))**4*.22;h.copy(w).multiplyScalar(e*y),h.y*=r,h.add(l),u.setXYZ(v,h.x,h.y,h.z);const z=h.clone().sub(a).normalize().multiplyScalar(.7).add(w.multiplyScalar(.3)).normalize();f.setXYZ(v,z.x,z.y,z.z)}return i}function ua(e){if(e===9)return So();if(e===10)return Ao();if(e===11)return Co();if(e===12)return Do();if(e===13)return Po();const l=re(e*101+9);if(new d(0,1,0),e<3||e>=5){const m=e>=5,p=m?4.85:[8.5,10.5,7.5][e],v=m?2.75:p*.66,w=m?1.25:[2.6,2.1,3.2][e],y=m?1.2:[1.7,2.4,1.3][e],z=m?.55:1,P=m?[.15,.42]:[.16,.3],F=new mt(P[0],P[1],v+(m?.45:0),8,3);F.translate(0,(v+(m?.45:0))/2,0);const k=[0,1,2].map(U=>{const O=U/3*Math.PI*2+l(),J=new mt(.07,.13,w*1.1,6);return J.translate(0,w*.55,0),J.applyMatrix4(new pt().makeRotationFromEuler(new ia(Math.cos(O)*.8,0,Math.sin(O)*.8))),J.translate(0,v*.8,0),J}),B=X(q([F,...k].map(U=>(U.deleteAttribute("uv"),U))),U=>.55+.45*Math.min(1,U.y/v)),H=new d(0,v+y*.6,0),$=[],W=m?5:7+Math.floor(l()*3);for(let U=0;U<W;U++){const O=U/W*Math.PI*2+l()*.5,J=(l()-.35)*y,Ce=w*(.55+l()*.35);$.push(vt((1.5+l()*.9)*z*(m?1.2:1),new d(Math.cos(O)*Ce,H.y+J,Math.sin(O)*Ce),H,e*31+U))}$.push(vt(2.2*z,new d(0,H.y+y*.75,0),H,e*31+99));const ye=X(q($),U=>{const O=U.clone().sub(H);return Math.min(1,.5+.35*(O.y/(y+2)+.6)+.25*Math.hypot(O.x,O.z)/(w+2))}),ae=X(q([vt(w+1.3*z,H.clone(),H.clone().setY(H.y-1),e+500,0,(y+2*z)/(w+1.3*z))]),U=>.6+.4*Math.min(1,Math.max(0,(U.y-H.y+2)/4)));return{trunk:B,crown:ye,far:ae,radius:m?.32:.3}}const a=e===3?13:10,t=[],n=new mt(.1,.32,a*.9,7,2);n.translate(0,a*.45,0),n.deleteAttribute("uv");for(let m=0;m<5;m++){const p=m/5,v=(e===3?2.6:3)*(1-p*.78),w=a*.34*(1-p*.35),y=a*(.18+p*.62);let z=new Jt(v,w,11,2);z.deleteAttribute("uv"),z=gt(z);const P=z.getAttribute("position"),F=z.getAttribute("normal"),k=new d;for(let B=0;B<P.count;B++){k.fromBufferAttribute(P,B);const H=Math.hypot(k.x,k.z),$=1+.12*Math.sin(Math.atan2(k.z,k.x)*5+m*2);P.setXYZ(B,k.x*$,k.y+w/2+y-H/v*.5,k.z*$);const W=new d(k.x,v*.9,k.z).normalize();F.setXYZ(B,W.x,W.y,W.z)}t.push(z)}const r=X(q(t),m=>.5+.5*Math.min(1,Math.hypot(m.x,m.z)/2.2*.6+m.y/a*.5));let i=new Jt(e===3?2.6:3,a*.9,6,1);i.deleteAttribute("uv"),i.translate(0,a*.55,0);const u=i.getAttribute("position"),f=i.getAttribute("normal"),h=new d;for(let m=0;m<u.count;m++){h.fromBufferAttribute(u,m);const p=new d(h.x,1.6,h.z).normalize();f.setXYZ(m,p.x,p.y,p.z)}return i=X(i,m=>.55+.45*Math.min(1,m.y/a)),{trunk:X(n,m=>.5+.5*Math.min(1,m.y/a)),crown:r,far:i,radius:.3}}function K(e,l,a,t=8,n=5,r=!1){const i=new yt(e),u=new to(i,t,1,n,!1),f=u.getAttribute("position"),h=new d,m=new d;for(let p=0;p<=t;p++){const v=p/t,w=l+(a-l)*v;i.getPointAt(v,m);for(let y=0;y<=n;y++){const z=p*(n+1)+y;h.fromBufferAttribute(f,z).sub(m).multiplyScalar(w).add(m),f.setXYZ(z,h.x,h.y,h.z)}}if(r){const p=u.getAttribute("uv"),v=i.getLength(),w=Math.PI*(l+a);for(let y=0;y<p.count;y++)p.setXY(y,p.getX(y)*v,p.getY(y)*w)}else u.deleteAttribute("uv");return u.computeVertexNormals(),u}function So(){const e=re(9091),l=[],a=[],t=4.6;l.push(K([new d(0,-.2,0),new d(.05,t*.4,.03),new d(-.04,t*.75,.02),new d(.02,t,0)],.36,.08,8,7));for(let u=0;u<6;u++){const f=u/6*Math.PI*2+e()*.6,h=t*(.45+e()*.45),m=1.4+e()*1.4,p=new d(Math.cos(f),.55+e()*.5,Math.sin(f)).normalize(),v=new d(0,h,0),w=v.clone().addScaledVector(p,m*.5).add(new d((e()-.5)*.4,-.1,(e()-.5)*.4)),y=v.clone().addScaledVector(p,m);l.push(K([v,w,y],.09,.03,5,4));for(let z=0;z<3;z++){const P=2*Math.PI*e(),F=w.clone().lerp(y,e()),k=F.clone().add(new d(Math.cos(P)*.6,.35+e()*.4,Math.sin(P)*.6)),B=k.clone().add(new d(Math.cos(P+.9)*.3,.25,Math.sin(P+.9)*.3));a.push(K([F,k,B],.03,.008,3,3))}}const n=X(q(l),u=>.5+.5*Math.min(1,u.y/t)),r=X(q(a),()=>.85),i=X(q([K([new d(0,0,0),new d(.1,t*.6,0),new d(0,t,0)],.32,.06,3,4),K([new d(0,t*.55,0),new d(1.2,t*.85,.3),new d(2,t*1.05,.5)],.1,.03,2,3),K([new d(0,t*.65,0),new d(-1,t*.9,-.5),new d(-1.6,t*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:n,crown:r,far:i,radius:.3}}function Ao(){const e=re(1010),l=[],a=[],t=(u,f,h,m,p)=>{const v=new d(-f.z,0,f.x).normalize(),w=(e()-.5)*.8,y=u.clone().addScaledVector(f,h*.5).addScaledVector(v,w*h*.3),z=u.clone().addScaledVector(f,h).addScaledVector(v,w*h*.5);if(l.push(K([u,y,z],m,m*.62,5,5)),p===0){for(let F=0;F<3;F++){const k=new bt(.22+e()*.16,0);k.translate(z.x+(e()-.5)*.5,z.y+(e()-.3)*.45,z.z+(e()-.5)*.5),a.push(k)}return}const P=2;for(let F=0;F<P;F++){const k=F/P*Math.PI*2+e(),B=f.clone().multiplyScalar(.7).add(new d(Math.cos(k)*.7,.15+e()*.3,Math.sin(k)*.7)).normalize();t(z,B,h*(.62+e()*.15),m*.6,p-1)}};t(new d(0,-.3,0),new d(0,1,0),3,.45,2);const n=X(q(l),u=>.45+.55*Math.min(1,u.y/6)),r=X(q(a),u=>.55+.45*Math.min(1,u.y/6)),i=q([K([new d(0,-.3,0),new d(.3,2.5,0),new d(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(u=>{const f=u*2.1,h=new sa(1.1,7,5);return h.deleteAttribute("uv"),h.translate(Math.cos(f)*1.2,4.6+u*.4,Math.sin(f)*1.2),h})]);return{trunk:n,crown:r,far:X(i,u=>.45+.55*Math.min(1,u.y/6)),radius:.42}}const Q={11:{sprite:"pine",frame:[5,7.2],bark:"bark-pine",barkScale:[.8,1.2]},12:{sprite:"oak",frame:[6.4,6.8],bark:"bark-oak",barkScale:[1,1.6]},13:{sprite:"cedar",frame:[3.6,9.4],bark:"bark-cedar",barkScale:[.6,1.4]}},ne=3.4;function Mt(e){const[l,a]=Q[e].frame,t=[],n=new d,r=new d(0,1,0);for(const f of[0,Math.PI/2]){const h=new la(l,a);h.translate(0,a/2-.25,0),h.rotateY(f),t.push(h)}const i=q(t),u=i.getAttribute("normal");for(let f=0;f<u.count;f++)n.set(u.getX(f),0,u.getZ(f)).multiplyScalar(.5).add(r).normalize(),u.setXYZ(f,n.x,n.y,n.z);return ge(i,f=>.6+.4*Math.min(1,Math.max(0,f.y/a)))}function St(e,l,a=.7){const t=e.getAttribute("position"),n=e.getAttribute("normal"),r=new d,i=new d(0,1,0);for(let u=0;u<t.count;u++)r.fromBufferAttribute(t,u).sub(l),r.y*=a,r.normalize().lerp(i,.3).normalize(),n.setXYZ(u,r.x,r.y,r.z)}const ko=6.4;function Co(){const e=re(1111),l=ko,a=[],t=[],n=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.28),r=[0,.3,.62,1].map(w=>new d(n.x*Math.sin(w*Math.PI)*1.4+n.z*w*.3,-.2+(l*.97+.2)*w,n.z*Math.sin(w*Math.PI)*1.4-n.x*w*.3));a.push(K(r,.3,.05,7,6,!0));const i=new yt(r),u=w=>i.getPoint(Math.min(1,Math.max(0,(w+.2)/(l*.97+.2)))),f=new d(0,ne+(l-ne)*.55,0),h=(w,y,z=!0)=>t.push({position:w.clone().sub(new d(0,y*.45,0)),yaw:e()*Math.PI,width:y,height:y*(.85+e()*.3),flat:z}),m=5;for(let w=0;w<m;w++){const y=w/(m-1),z=ne-.1+y*(l-ne-.9),P=w*2.4+e()*.8,F=(1.9-y*.8)*(.85+e()*.3),k=.35+y*.35+e()*.2,B=new d(Math.cos(P),k,Math.sin(P)).normalize(),H=u(z),$=H.clone().addScaledVector(B,F*.5).add(new d((e()-.5)*.4,(e()-.6)*.3,(e()-.5)*.4)),W=H.clone().addScaledVector(B,F).add(new d(0,.15+e()*.3,0));a.push(K([H,$,W],.09-y*.03,.025,3,4,!0)),h($.clone().lerp(W,.35).add(new d(0,.25,0)),.95+e()*.3,!1),h(W.clone().add(new d(0,.3,0)),1.25+e()*.4),e()<.6&&h(W.clone().add(new d((e()-.5)*.9,.55+e()*.3,(e()-.5)*.9)),.9+e()*.3)}for(let w=0;w<3;w++){const y=u(l*.97-w*.55);h(y.clone().add(new d((e()-.5)*.7,.35,(e()-.5)*.7)),1+e()*.3,w===0)}const p=ge(q(a),w=>.5+.5*Math.min(1,w.y/l)),v=xt(t);return St(v,f),{trunk:p,crown:ge(v,w=>Math.min(1,.55+.3*(w.y-ne)/(l-ne)+.25*Math.hypot(w.x,w.z)/2.2)),far:Mt(11),radius:.32}}const To=6;function Do(){const e=re(1212),l=To,a=[],t=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.22),n=[0,.35,.7,1].map(p=>new d(t.x*Math.sin(p*Math.PI*1.3)*1.2,-.2+(l*.78+.2)*p,t.z*Math.sin(p*Math.PI*1.3)*1.2));a.push(K(n,.34,.12,6,7,!0));const r=new yt(n),i=p=>r.getPoint(Math.min(1,Math.max(0,(p+.2)/(l*.78+.2)))),u=new d(0,ne+(l-ne)*.6,0),f=[];for(let p=0;p<5;p++){const v=p/4,w=ne-.5+v*(l*.78-ne+.3),y=p*2.5+e()*.9,z=(2.4-v*.9)*(.85+e()*.3),P=.45+v*.4,F=new d(Math.cos(y),P,Math.sin(y)).normalize(),k=i(w),B=k.clone().addScaledVector(F,z*.55).add(new d((e()-.5)*.5,(e()-.4)*.3,(e()-.5)*.5)),H=k.clone().addScaledVector(F,z).add(new d(0,.2+e()*.3,0));a.push(K([k,B,H],.13-v*.04,.04,3,5,!0));const $=y+(e()-.5)*1.6,W=B.clone().add(new d(Math.cos($)*z*.45,.35+e()*.4,Math.sin($)*z*.45));a.push(K([B,B.clone().lerp(W,.5).add(new d(0,.1,0)),W],.07,.03,2,4,!0));for(const ye of[H,W,B.clone().lerp(H,.6)]){const ae=1.3+e()*.6;f.push({position:ye.clone().add(new d((e()-.5)*.5,.1-ae*.3,(e()-.5)*.5)),yaw:e()*Math.PI,width:ae,height:ae*(.85+e()*.3),flat:e()<.6})}}f.push(...no(e,u,2.3,1.2,2.3,9,1.5));const h=ge(q(a),p=>.5+.5*Math.min(1,p.y/l)),m=xt(f);return St(m,u,.6),{trunk:h,crown:ge(m,p=>{const v=p.clone().sub(u);return Math.min(1,.45+.35*(v.y/2.6+.6)+.25*Math.hypot(v.x,v.z)/3.2)}),far:Mt(12),radius:.34}}const Fo=9;function Po(){const e=re(1313),l=Fo,a=[],t=K([new d(0,-.2,0),new d(.04,l*.5,.02),new d(0,l*.96,0)],.2,.03,4,6,!0),n=7;for(let i=0;i<n;i++){const u=i/(n-1),f=1.3+u*(l-1.9),h=(2.4-u*1.5)*(.9+e()*.2),m=2.2-u*.6;for(const p of[0,1.05])a.push({position:new d((e()-.5)*.3,f-m*.45,(e()-.5)*.3),yaw:i*.9+p+e()*.3,width:h,height:m,flat:!1})}a.push({position:new d(0,l-.9,0),yaw:e()*3,width:.7,height:1.3,flat:!1});const r=xt(a);return St(r,new d(0,l*.5,0),.25),{trunk:ge(t,i=>.45+.55*Math.min(1,i.y/l)),crown:ge(r,i=>.5+.3*Math.min(1,i.y/l)+.2*Math.min(1,Math.hypot(i.x,i.z)/.9)),far:Mt(13),radius:.22}}function ge(e,l){for(const r of Object.keys(e.attributes))r!=="position"&&r!=="normal"&&r!=="uv"&&e.deleteAttribute(r);const a=e.getAttribute("position"),t=new Float32Array(a.count),n=new d;for(let r=0;r<a.count;r++)t[r]=l(n.fromBufferAttribute(a,r));return e.setAttribute("aShade",new Qe(t,1)),e}function Bo(e,l,a,t,n,r){const[i,u]=Q[l].frame,f=256,h=new Va(Math.round(f*i/u),f,{format:qe,colorSpace:ja});h.texture.minFilter=Za,h.texture.generateMipmaps=!0;const m=new Ka,p=ua(l),v=Q[l].barkScale,w=r.clone();w.repeat.set(v[0],v[1]),w.needsUpdate=!0,m.add(new ue(p.trunk,new Qt({color:n,map:w,toneMapped:!1}))),m.add(new ue(p.crown,new Qt({color:t,map:a,alphaTest:.5,side:ke,toneMapped:!1}))),m.add(new Xa("#ffffff","#8a8a80",1));const y=new qa("#fff4e0",.35);y.position.set(.5,1,1),m.add(y);const z=new Qa(-i/2,i/2,u-.25,-.25,-20,20);z.position.set(0,0,10),z.lookAt(0,0,0);const P=e.getRenderTarget(),F=e.getClearColor(new ce),k=e.getClearAlpha();return e.setRenderTarget(h),e.setClearColor("#000000",0),e.clear(),e.render(m,z),e.setRenderTarget(P),e.setClearColor(F,k),p.trunk.dispose(),p.crown.dispose(),p.far.dispose(),h.texture}function Ho(){let e=new bt(1,1);e.deleteAttribute("uv"),e=gt(e);const l=e.getAttribute("position"),a=new d,t=re(5);for(let n=0;n<l.count;n++)a.fromBufferAttribute(l,n),a.multiplyScalar(.8+t()*.35),l.setXYZ(n,a.x,a.y,a.z);return e=e.toNonIndexed(),e.computeVertexNormals(),X(e,n=>.55+.45*Math.min(1,Math.max(0,n.y+.6)))}export{de as A,Mo as C,be as F,Eo as H,Ge as M,se as N,Go as Q,uo as a,aa as b,fo as c,_o as d,zo as e,oa as s};
