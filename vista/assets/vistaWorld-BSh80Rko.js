import{X as Pa,Y as Da,a6 as Ba,aw as Ha,G as Yt,a5 as ve,ax as it,ay as Oe,az as Ve,aA as $t,ab as Ke,aB as Lt,aC as Ot,i as je,am as lt,C as le,V as d,k as Ee,M as pe,z as ct,_ as Ze,ag as ut,Z as Wa,r as oa,l as na,aD as Ra,aE as Na,I as Vt,w as vt,Q as jt,x as ra,aj as Zt,e as ht,ak as Ia,al as Ea,g as Ga,aF as _a,aG as Ua,S as Ya,ao as Kt,H as $a,D as La,an as Oa,u as dt,n as q,d as Xt,a4 as pt,v as wt,j as gt,J as Xe,aH as Va,aI as ja,s as Za}from"./BufferGeometryUtils-Cp8OcrqL.js";import{r as ne,e as qt,n as Ka,s as Xa}from"./vistaTerrain-BQ6jDvM3.js";import{b as Qt,a as xt,c as qa}from"./sprites-BLkbJnAZ.js";import{m as Qa}from"./colors-BKJfVazC.js";const re=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,ge=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uZenith; uniform vec3 uHorizon;
uniform vec3 uAmbSky; uniform vec3 uAmbGround; uniform float uHaze; uniform float uHazeFall; uniform float uHazeBase; uniform float uTime;
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
  float h0 = max(cameraPosition.y - uHazeBase, 0.0), dy = v.y, e0 = exp(-h0 * uHazeFall);
  float integ = abs(dy) > 0.5 ? (e0 - exp(-max(h0 + dy, 0.0) * uHazeFall)) / (uHazeFall * dy) : e0;
  float amount = 1.0 - exp(-uHaze * dist * max(integ, 0.0));
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
`,yt=`
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
vec3 terrainAlbedo(vec3 wp, vec3 n, vec4 md, out float grass){
  vec2 p = wp.xz; float slope = 1.0 - n.y, n1 = fbm3(p * 0.006), n2 = fbm3(p * 0.04), n3 = vnoise(p * 0.35);
  float rockAmt = smoothstep(0.26, 0.38, slope + (n2 - 0.5) * 0.12);
  float screeAmt = smoothstep(0.3, 0.75, md.a) * (1.0 - rockAmt) * smoothstep(0.05, 0.18, slope);
  vec3 col = mix(grassColour(p, md), srgb(vec3(0.64, 0.60, 0.52)) * (0.9 + 0.2 * n3), screeAmt);
  float bed = smoothstep(0.6, 0.92, md.b) * (1.0 - rockAmt);
  col = mix(col, srgb(vec3(0.54, 0.45, 0.33)), bed * 0.65);
  col = mix(col, rockColour(wp), rockAmt);
  float shore = 1.0 - smoothstep(uWaterY + 0.25, uWaterY + 0.9 + n3 * 0.6, wp.y);
  col = mix(col, srgb(vec3(0.74, 0.68, 0.52)) * (0.9 + 0.15 * n3), shore * (1.0 - rockAmt));
  float snow = smoothstep(uSnowY - 25.0, uSnowY + 25.0, wp.y + (n1 - 0.5) * 90.0) * (1.0 - smoothstep(0.32, 0.48, slope + (n3 - 0.5) * 0.1));
  col = mix(col, srgb(vec3(0.86, 0.89, 0.95)) * (0.9 + 0.1 * n2 + 0.05 * n3), snow);
  grass = (1.0 - rockAmt) * (1.0 - screeAmt) * (1.0 - shore) * (1.0 - snow) * (1.0 - bed * 0.8);
  vec4 gt = groundTint(p);
  col = mix(col, gt.rgb * (0.85 + 0.3 * n3), gt.a * (1.0 - rockAmt));
  grass *= 1.0 - gt.a * 0.45;
  return col;
}
`,sa=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,qe=`
#include <common>
#include <shadowmap_pars_vertex>
`,Qe=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Ae=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Ja=`
${qe}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,eo=`
${Qe}
${re}${ge}${Ge}${yt}${sa}
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
  ${Ae}
}`,to=`
${qe}
${re}${ge}${Ge}${yt}${sa}
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
}`,ao=`
${Qe}
${re}${ge}
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
  ${Ae}
}`,Jt=`
${qe}
${re}
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
}`,ea=`
${Qe}
${re}${ge}${Ge}
#ifdef ROCK
${yt}
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
  ${Ae}
}`,oo=`
${qe}
${re}
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
}`,no=`
${Qe}
${re}${ge}${Ge}
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
  ${Ae}
}`,ro=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,so=`
${re}${ge}${Ge}
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
  ${Ae}
}`,io=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,lo=`
${re}${ge}
uniform float uCloud;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  vec3 col = skyColour(d);
  float s = dot(d, uSunDir);
  col += uSunCol * smoothstep(0.99955, 0.99975, s) * 6.0;
  if (d.y > 0.0) {
    // Painted cumulus: an fbm layer on a plane, its lit side found by stepping toward the sun.
    vec2 cp = d.xz / (d.y + 0.1) * 1.4 + uTime * vec2(0.006, 0.002);
    float c = fbm5(cp), c2 = fbm5(cp + normalize(uSunDir.xz + 1e-4) * 0.09);
    float cov = smoothstep(0.62 - uCloud * 0.2, 0.85 - uCloud * 0.2, c) * smoothstep(0.0, 0.2, d.y);
    float lit = clamp(0.55 + (c - c2) * 5.0, 0.0, 1.0);
    vec3 cloud = mix(uAmbSky * 0.75 + uHorizon * 0.25, uHorizon * 0.55 + uSunCol * 0.38, lit);
    cloud += uSunCol * pow(max(s, 0.0), 8.0) * 0.4 * (1.0 - cov);
    col = mix(col, cloud, cov * 0.92);
  }
  // Stars at night: a hashed field on the dome, twinkling a little.
  if (uStars > 0.0 && d.y > 0.0) { vec2 sp = vec2(atan(d.z, d.x) * 120.0, d.y * 160.0); vec2 cell = floor(sp); float h = hash12(cell); float st = step(0.985, h) * smoothstep(0.35, 0.0, length(fract(sp) - 0.5)) * (0.6 + 0.4 * sin(uTime * 2.0 + h * 40.0)); col += vec3(st * 1.4 * uStars) * smoothstep(0.0, 0.25, d.y); }
  col = mix(col, uGloom.rgb, uGloom.a * 0.85 + uGloom.a * uGloom.a * 0.13);
  gl_FragColor = vec4(col, 1.0);
  ${Ae}
}`,ta=new Map,x=512;function V(e,i){for(const a of[-x,0,x])for(const t of[-x,0,x])e.save(),e.translate(a,t),i(),e.restore()}const F=(e,i,a,t=1)=>`rgba(${Math.round(e)}, ${Math.round(i)}, ${Math.round(a)}, ${t})`;function he(e,i,a){const t=e.getImageData(0,0,x,x),n=t.data;for(let s=0;s<n.length;s+=4){const l=1+(i()-.5)*2*a;n[s]=Math.min(255,n[s]*l),n[s+1]=Math.min(255,n[s+1]*l),n[s+2]=Math.min(255,n[s+2]*l)}e.putImageData(t,0,0)}function ze(e,i,a,t,n,s,l){const c=i()*Math.PI*2,f=(i()-.5)*.25*n;e.strokeStyle=l,e.lineWidth=s,e.lineCap="round",e.beginPath(),e.moveTo(a,t),e.quadraticCurveTo(a+Math.cos(c)*n*.5-Math.sin(c)*f,t+Math.sin(c)*n*.5+Math.cos(c)*f,a+Math.cos(c)*n,t+Math.sin(c)*n),e.stroke()}function aa(e,i,a,t,n,s,l){const c=i()*Math.PI*2,f=n*(.5+i()*.25),v=5+Math.floor(i()*3);e.save(),e.translate(a,t),e.rotate(c),e.fillStyle=s,e.beginPath();for(let m=0;m<=24;m++){const p=m/24,h=p*Math.PI*2,w=1-.22*Math.abs(Math.sin(h*v*.5))*(.5+.5*Math.abs(Math.sin(h))),y=Math.cos(h)*n*.5*w,M=Math.sin(h)*f*.5*w;m===0?e.moveTo(y,M):e.lineTo(y,M)}e.closePath(),e.fill(),e.strokeStyle=l,e.lineWidth=1.2,e.beginPath(),e.moveTo(-n*.45,0),e.lineTo(n*.45,0),e.stroke(),e.restore()}function ft(e,i,a,t,n){const s=i()*Math.PI*2;e.strokeStyle=F(70+i()*30,52+i()*20,35),e.lineWidth=2+i()*2.5,e.lineCap="round",e.beginPath(),e.moveTo(a,t);const l=a+Math.cos(s)*n*.5+(i()-.5)*8,c=t+Math.sin(s)*n*.5+(i()-.5)*8;if(e.lineTo(l,c),e.lineTo(a+Math.cos(s)*n,t+Math.sin(s)*n),e.stroke(),i()<.5){const f=s+.5+i();e.lineWidth*=.6,e.beginPath(),e.moveTo(l,c),e.lineTo(l+Math.cos(f)*n*.35,c+Math.sin(f)*n*.35),e.stroke()}}function co(e){const i=document.createElement("canvas");i.width=i.height=x;const a=i.getContext("2d"),t=Qa({sand:101,needles:102,leaves:103,moss:104,"bark-pine":105,"bark-oak":106,"bark-cedar":107}[e]);return e==="sand"?(a.fillStyle=F(168,152,120),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<1400;n++)a.fillStyle=F(120+t()*70,105+t()*60,75+t()*45,.5),a.beginPath(),a.arc(t()*x,t()*x,.6+t()*1.8,0,7),a.fill()}),V(a,()=>{for(let n=0;n<16;n++){const s=t()*x,l=t()*x,c=10+t()*26;a.fillStyle=F(150+t()*20,158+t()*20,132+t()*20,.5);for(let f=0;f<7;f++)a.beginPath(),a.arc(s+(t()-.5)*c,l+(t()-.5)*c,c*.3*(.6+t()),0,7),a.fill()}}),V(a,()=>{for(let n=0;n<24;n++){const s=t();aa(a,t,t()*x,t()*x,22+t()*20,F(110+s*50,80+s*35,40+s*15),F(60,40,20,.5))}}),V(a,()=>{for(let n=0;n<260;n++)ze(a,t,t()*x,t()*x,18+t()*24,1.5,F(130+t()*50,95+t()*35,50,.8));for(let n=0;n<9;n++)ft(a,t,t()*x,t()*x,30+t()*50)}),he(a,t,.07)):e==="needles"?(a.fillStyle=F(62,44,30),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<1700;n++){const s=t();ze(a,t,t()*x,t()*x,22+t()*34,1.3+t()*1.4,F(120+s*80,78+s*50,38+s*30,.85))}}),V(a,()=>{for(let n=0;n<9;n++)ft(a,t,t()*x,t()*x,36+t()*60);for(let n=0;n<4;n++){const s=t()*x,l=t()*x;for(let c=0;c<14;c++)a.fillStyle=F(80+t()*40,58+t()*25,36,.95),a.beginPath(),a.ellipse(s+(t()-.5)*16,l+(t()-.5)*24,4,2.5,t()*3,0,7),a.fill()}}),V(a,()=>{for(let n=0;n<500;n++){const s=t();ze(a,t,t()*x,t()*x,20+t()*30,1.2+t(),F(150+s*60,100+s*40,50+s*20,.8))}}),he(a,t,.06)):e==="leaves"?(a.fillStyle=F(48,34,22),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<140;n++){const s=t(),l=t()<.35,c=l?F(150+s*50,95+s*40,40+s*20):F(70+s*40,50+s*25,30+s*12);aa(a,t,t()*x,t()*x,34+t()*30,c,l?F(110,70,30,.6):F(40,28,16,.6))}}),V(a,()=>{for(let n=0;n<260;n++){const s=t();ze(a,t,t()*x,t()*x,20+t()*28,1.4,F(130+s*60,90+s*40,45,.8))}for(let n=0;n<6;n++)ft(a,t,t()*x,t()*x,30+t()*50)}),he(a,t,.06)):e==="moss"?(a.fillStyle=F(40,34,24),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<70;n++){const s=t()*x,l=t()*x,c=14+t()*30,f=t();for(let v=0;v<40;v++){a.fillStyle=F(70+f*60+t()*30,95+f*60+t()*30,30+f*20,.7);const m=t()*7,p=Math.sqrt(t())*c;a.beginPath(),a.arc(s+Math.cos(m)*p,l+Math.sin(m)*p,2+t()*3,0,7),a.fill()}}}),V(a,()=>{for(let n=0;n<160;n++){const s=t();ze(a,t,t()*x,t()*x,16+t()*26,1.2,F(110+s*50,80+s*30,40,.7))}for(let n=0;n<120;n++)ze(a,t,t()*x,t()*x,30+t()*40,1.6,F(90+t()*50,120+t()*50,40,.75))}),he(a,t,.06)):e==="bark-pine"?(a.fillStyle=F(70,42,30),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<160;n++){const s=t()*x,l=t()*x,c=22+t()*40,f=40+t()*90,v=t();a.fillStyle=F(78+v*40,66+v*32,54+v*26),a.beginPath();for(let m=0;m<=10;m++){const p=m/10*Math.PI*2,h=1+(t()-.5)*.3,w=s+Math.cos(p)*c*.5*h,y=l+Math.sin(p)*f*.5*h;m===0?a.moveTo(w,y):a.lineTo(w,y)}a.closePath(),a.fill(),a.strokeStyle=F(40,24,16,.8),a.lineWidth=2.5,a.stroke(),a.fillStyle=F(120+v*50,105+v*40,85+v*30,.35),a.beginPath(),a.ellipse(s-c*.1,l-f*.15,c*.22,f*.25,0,0,7),a.fill()}}),he(a,t,.09)):e==="bark-oak"?(a.fillStyle=F(52,42,34),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<220;n++){const s=t()*x,l=t()*x,c=7+t()*12,f=40+t()*90,v=t();a.fillStyle=F(72+v*30,64+v*26,54+v*22),a.beginPath(),a.moveTo(s-c/2,l-f/2),a.lineTo(s+c/2+(t()-.5)*5,l-f/2+4),a.lineTo(s+c/2,l+f/2),a.lineTo(s-c/2+(t()-.5)*5,l+f/2-4),a.closePath(),a.fill(),a.strokeStyle=F(32,24,18,.8),a.lineWidth=2.5,a.stroke(),a.strokeStyle=F(100+v*30,94+v*26,84+v*22,.4),a.lineWidth=1.5,a.beginPath(),a.moveTo(s-c*.15,l-f*.4),a.lineTo(s-c*.1,l+f*.4),a.stroke()}}),he(a,t,.08)):(a.fillStyle=F(92,78,64),a.fillRect(0,0,x,x),V(a,()=>{for(let n=0;n<600;n++){const s=t()*x,l=t()*x,c=40+t()*160,f=t();a.strokeStyle=F(60+f*70,52+f*60,42+f*50,.7),a.lineWidth=1+t()*3,a.beginPath(),a.moveTo(s,l),a.lineTo(s+(t()-.5)*6,l+c),a.stroke()}}),he(a,t,.08)),i}function Se(e){const i=ta.get(e);if(i)return i;const a=new Pa(co(e));return a.colorSpace=Da,a.wrapS=a.wrapT=Ba,a.anisotropy=4,ta.set(e,a),fo().then(t=>{t.includes(e)&&new Ha().load(`/Rootwake/vista/textures/barrens/${e}.jpg`,n=>{a.image=n.image,a.needsUpdate=!0})}),a}let uo=null;const fo=()=>uo??=fetch("/Rootwake/vista/textures/barrens/index.json").then(e=>e.ok?e.json():[]).then(e=>Array.isArray(e)?e.filter(i=>typeof i=="string"):[]).catch(()=>[]),Fo=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function mo(e){const i=ht.degToRad(e.elevation),a=ht.degToRad(e.azimuth);return new d(Math.sin(a)*Math.cos(i),Math.sin(i),-Math.cos(a)*Math.cos(i)).normalize()}const Po=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],ie=(e,i=1)=>new le(e).multiplyScalar(i),vo=1;function Do(e,i,a,t,n,s={}){const{n:l,cell:c,half:f,size:v}=i,m=new Yt;m.name="vista",e.add(m),e=m;const p=l>600?2:1,h=(l-1)/p+1,w=new Uint8Array(l*l*4),y=new Uint8Array(h*h),M=new Uint8Array(h*h),B=p===1?i:{...i,n:h,cell:c*p,h:(()=>{const o=new Float32Array(h*h);for(let r=0;r<h;r++)for(let u=0;u<h;u++)o[r*h+u]=i.h[r*p*l+u*p];return o})()},P=new ve(y,h,h,it,Oe);P.magFilter=P.minFilter=Ve,P.wrapS=P.wrapT=$t;const A=new Uint8Array(l*l*4);s.ground&&A.set(s.ground);const H=new ve(A,l,l,Ke,Oe);H.magFilter=H.minFilter=Ve,H.needsUpdate=!0;const R=new ve(new Uint8Array(4),1,1);R.needsUpdate=!0;const U=96,N=97,xe=new Float32Array(N*N),te=new ve(xe,N,N,it,Lt);te.magFilter=te.minFilter=Ot;let _=new je(1e9,1e9);for(let o=0;o<l*l;o++)w[o*4+1]=Math.round(i.ao[o]*255),w[o*4+2]=Math.round(i.flow[o]*255),w[o*4+3]=Math.round(i.sediment[o]*255);const L=new ve(w,l,l,Ke,Oe);L.magFilter=L.minFilter=Ve,L.wrapS=L.wrapT=$t;const J=new ve(new Float32Array(i.h),l,l,it,Lt);J.magFilter=J.minFilter=Ot,J.needsUpdate=!0;const Te=new Uint8Array(l*l*4),ke=new ve(Te,l,l,Ke,Oe);ke.magFilter=ke.minFilter=Ve,ke.needsUpdate=!0;const O={uSunDir:{value:new d(0,1,0)},uSunCol:{value:new le},uZenith:{value:new le},uHorizon:{value:new le},uAmbSky:{value:new le},uAmbGround:{value:new le},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:s.hazeBase??i.waterY},uTime:{value:0},uMapData:{value:L},uSunTex:{value:P},uGround:{value:H},uFloor:{value:ke},uHeight:{value:J},uMapHalf:{value:f},uCell:{value:c},uN:{value:l},uSunN:{value:h},uWaterY:{value:Number.isFinite(i.waterY)?i.waterY:-1e4},uSnowY:{value:i.snowY},uGloom:{value:new lt(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},Ce=(o,r,u={},g={})=>{const z={...Ia.merge([Ea.lights]),...O,...u};return new ut({uniforms:z,vertexShader:o,fragmentShader:r,lights:!0,defines:g})},Je=16,zt=(l-1)/Je,Fe=zt*c,la=110,St=i.surface&&s.fineLod?[.5,1,2,4,8]:[1,2,4,8],_e={uClear0:{value:R},uClear1:{value:R},uClear2:{value:R},uClearAt:{value:[new d(0,0,.001),new d(0,0,.001),new d(0,0,.001)]}},se=Ce(Ja,eo,{uSoil:{value:new lt(0,0,0,0)},..._e,uTexSand:{value:Se("sand")},uTexNeedles:{value:Se("needles")},uTexLeaves:{value:Se("leaves")},uTexMoss:{value:Se("moss")}});se.side=Ee;const et=(o,r)=>Xa(i,o,r),tt=new Yt;tt.name="terrain",e.add(tt);const Ue=[];function ca(o,r,u){const g=zt/u,z=o*Fe-f,T=r*Fe-f,k=u*c,G=4+u*3,Y=(g+1)*(g+1),S=new Float32Array((Y+4*g)*3),E=new Float32Array((Y+4*g)*3),Z=[];for(let b=0;b<=g;b++)for(let W=0;W<=g;W++){const D=z+W*k,K=T+b*k,$=(b*(g+1)+W)*3,me=Ka(i,D,K,Math.max(i.surface?1:c,k*.75),et);S[$]=D,S[$+1]=et(D,K),S[$+2]=K,E[$]=me[0],E[$+1]=me[1],E[$+2]=me[2]}for(let b=0;b<g;b++)for(let W=0;W<g;W++){const D=b*(g+1)+W,K=D+1,$=D+g+1,me=$+1;Z.push(D,$,K,K,$,me)}const C=[];for(let b=0;b<g;b++)C.push(b);for(let b=0;b<g;b++)C.push(b*(g+1)+g);for(let b=g;b>0;b--)C.push(g*(g+1)+b);for(let b=g;b>0;b--)C.push(b*(g+1));C.forEach((b,W)=>{const D=(Y+W)*3;S[D]=S[b*3],S[D+1]=S[b*3+1]-G,S[D+2]=S[b*3+2],E[D]=E[b*3],E[D+1]=E[b*3+1],E[D+2]=E[b*3+2]});for(let b=0;b<C.length;b++){const W=C[b],D=C[(b+1)%C.length],K=Y+b,$=Y+(b+1)%C.length;Z.push(W,K,D,D,K,$)}const I=new ct;return I.setAttribute("position",new Xe(S,3)),I.setAttribute("normal",new Xe(E,3)),I.setIndex(Z),I.computeBoundingSphere(),I}for(let o=0;o<Je;o++)for(let r=0;r<Je;r++){const u={mesh:new pe(void 0,se),lod:-1,geos:[],cx:(r+.5)*Fe-f,cz:(o+.5)*Fe-f};u.mesh.receiveShadow=!0,u.mesh.matrixAutoUpdate=!1,u.mesh.userData={ti:r,tj:o},tt.add(u.mesh),Ue.push(u)}function ua(o){const[r,u,g]=de.lod,z=St.length>4?1:0;for(const T of Ue){const k=Math.max(0,Math.hypot(T.cx-o.x,T.cz-o.z)-Fe*.7),G=(z&&k<la?-1:k<r?0:k<u?1:k<g?2:3)+z;if(G!==T.lod){T.lod=G,T.geos[G]??=ca(T.mesh.userData.ti,T.mesh.userData.tj,St[G]),T.mesh.geometry=T.geos[G];for(let Y=0;Y<G-1;Y++)T.geos[Y]&&(T.geos[Y].dispose(),T.geos[Y]=void 0)}}}{const o=Math.max(7e3,f+4500),r=80,u=Math.round(2*o/r),g=[],z=[],T=[],k=f-r,G=new Int32Array((u+1)*(u+1)).fill(-1),Y=(C,I)=>{const b=-o+C*r,W=-o+I*r;return!(b>=-k&&b+r<=k&&W>=-k&&W+r<=k)},S=(C,I)=>{const b=I*(u+1)+C;if(G[b]>=0)return G[b];const W=-o+C*r,D=-o+I*r,K=Math.abs(W)<=f&&Math.abs(D)<=f,$=(Ca,Fa)=>i.shape.base(Ca,Fa),me=$(W,D)-(K?6:0),Me=r,_t=-($(W+Me,D)-$(W-Me,D)),Ut=-($(W,D+Me)-$(W,D-Me)),st=Math.hypot(_t,2*Me,Ut);return G[b]=g.length/3,g.push(W,me,D),z.push(_t/st,2*Me/st,Ut/st),G[b]};for(let C=0;C<u;C++)for(let I=0;I<u;I++)if(Y(I,C)){const b=S(I,C),W=S(I+1,C),D=S(I,C+1),K=S(I+1,C+1);T.push(b,D,W,W,D,K)}const E=new ct;E.setAttribute("position",new Ze(g,3)),E.setAttribute("normal",new Ze(z,3)),E.setIndex(T),E.computeBoundingSphere();const Z=new pe(E,se);Z.name="far-ring",Z.frustumCulled=!1,e.add(Z)}const At=new ut({uniforms:{...O,uCloud:{value:.5}},vertexShader:io,fragmentShader:lo,side:Wa,depthWrite:!1}),Pe=new pe(new oa(8e3,48,24),At);Pe.name="sky",Pe.frustumCulled=!1,Pe.renderOrder=-10,e.add(Pe);const da=new ut({uniforms:{...O},vertexShader:ro,fragmentShader:so,transparent:!0,depthWrite:!1}),Tt=new na(v,v,8,8);Tt.rotateX(-Math.PI/2);const Ye=new pe(Tt,da);Ye.position.y=i.waterY,Ye.name="lake",Ye.visible=Number.isFinite(i.waterY),e.add(Ye);const De=Ce(to,ao,{uCenter:{value:new je},uPatch:{value:60},uBladeH:{value:s.bladeH??.34},uBladeW:{value:.045},uWind:{value:new je(.94,.34)},..._e,uFine:{value:te},uFineAt:{value:new lt(0,0,1,0)}});De.side=Ee;const kt=3,ye=new ct;{const o=[],r=[],u=[],g=ne(3);for(let z=0;z<kt;z++){const T=z/kt*Math.PI*2+g()*.6,k=(g()-.5)*.12,G=(g()-.5)*.12,Y=.65+g()*.55,S=o.length/3;for(const[E,Z]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])o.push(E,Z,0),r.push(T,k,G,Y);u.push(S,S+1,S+2,S+2,S+1,S+3,S+2,S+3,S+4,S+4,S+3,S+5,S+4,S+5,S+6)}ye.setAttribute("position",new Ze(o,3)),ye.setAttribute("aTuft",new Ze(r,4)),ye.setIndex(u)}let ee=null,Ct=!0;const fa=14;function ma(o,r){if(ee&&(ee.geometry.dispose(),e.remove(ee),ee=null),!o)return;const u=new Va;u.index=ye.index,u.setAttribute("position",ye.getAttribute("position")),u.setAttribute("aTuft",ye.getAttribute("aTuft"));const g=ne(77),z=new Float32Array(o*4);for(let T=0;T<o;T++)z[T*4]=g()*r,z[T*4+1]=g()*r,z[T*4+2]=g(),z[T*4+3]=g()*Math.PI*2;u.setAttribute("aBlade",new ja(z,4)),u.instanceCount=o,ee=new pe(u,De),ee.frustumCulled=!1,ee.receiveShadow=!0,ee.name="grass",e.add(ee),De.uniforms.uPatch.value=r}const $e=(o,r)=>Ce(Jt,ea,{uColor:{value:o?ie(o):new le}},r),va=$e(null,{ROCK:""}),Le=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446","#5d8f36","#4d7a2e","#35603e"],Ft=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e","#e4dcd0","#e0dad2","#e6e0d6"],Pt=(o,r,u)=>{const g=Ce(oo,no,{uColor:{value:ie(o)},uMap:{value:r}},u);return g.side=Ee,g},ha=(o,r)=>Ce(Jt,ea,{uColor:{value:ie(o)},uBark:{value:Se(r.bark)},uBarkScale:{value:new je(r.barkScale[0],r.barkScale[1])}},{BARK:"",UNDER:""}),Dt={},Bt={};for(const o of Object.keys(Q).map(Number)){const r=Qt(Q[o].sprite);Dt[o]=s.renderer?zo(s.renderer,o,r,Le[o],Ft[o],Se(Q[o].bark)):r,Bt[o]=new Ra({depthPacking:Na,map:r,alphaTest:.5,side:Ee})}const Ht=o=>o>=5&&o<9?{VARIED:""}:{},at=o=>o===9?{TWITCH:""}:o===10?{PULSE:""}:{},Wt=Le.map((o,r)=>Q[r]?Pt(o,Qt(Q[r].sprite),{USE_SWAY:""}):$e(o,r>=9?at(r):{USE_SWAY:"",...Ht(r)})),pa=Le.map((o,r)=>Q[r]?Pt("#ffffff",Dt[r],{}):$e(o,{...Ht(r),...at(r)})),Rt=Ft.map((o,r)=>Q[r]?ha(o,Q[r]):$e(o,{...at(r),UNDER:""})),ce=Le.map((o,r)=>ia(r)),Be=(o,r,u,g)=>{const z=new Vt(o,r,Math.max(1,u));return z.count=0,z.frustumCulled=!1,z.castShadow=g,z.receiveShadow=!0,z.instanceMatrix.setUsage(Zt),e.add(z),z};let ue=[],He=[],We=[],be=[],Re=[];function Nt(o){for(const r of[...He,...We,...be,...Re])e.remove(r),r.dispose();ue=ce.map((r,u)=>o.filter(g=>g.kind===u)),He=ce.map((r,u)=>Be(r.trunk,Rt[u],ue[u].length,!1)),We=ce.map((r,u)=>Be(r.crown,Wt[u],ue[u].length,!1)),be=ce.flatMap((r,u)=>[Be(r.trunk,Rt[u],ue[u].length,!0),Be(r.crown,Wt[u],ue[u].length,!0)]);for(const r of be)r.layers.set(vo);for(const r of Object.keys(Q).map(Number))be[r*2+1].customDepthMaterial=Bt[r];Re=ce.map((r,u)=>Be(r.far,pa[u],ue[u].length,!1)),Ne.set(1e9,0,0)}const It=o=>{const r=o.instanceMatrix;r.clearUpdateRanges(),o.count>0&&r.addUpdateRange(0,o.count*16),r.needsUpdate=!0},wa=(o,r)=>o.frame?r.fromArray(o.frame):r.compose(new d(o.x,o.y-.15,o.z),new jt().setFromAxisAngle(new d(0,1,0),o.rot),new d(o.scale,o.scale,o.scale));let Ne=new d(1e9,0,0),ot=0,nt=[];const ga=1.25,Et=260,xa=s.treeReach??1400;function ya(o){const r=new vt,u=(de.nearTrees*(s.nearTreesScale??1))**2,g=(de.shadow?de.shadowBox*1.25+8:0)**2,z=xa**2;nt=[],ot=0,ue.forEach((T,k)=>{let G=0,Y=0,S=0;const[E,Z]=[be[k*2],be[k*2+1]];for(const C of T){const I=(C.x-o.x)**2+(C.z-o.z)**2;I>z||(wa(C,r),I<u?(He[k].setMatrixAt(G,r),We[k].setMatrixAt(G,r),G++,nt.push(C)):(C.scale>=ga||I<Et*Et)&&Re[k].setMatrixAt(Y++,r),I<g&&(E.setMatrixAt(S,r),Z.setMatrixAt(S,r),S++))}He[k].count=We[k].count=G,Re[k].count=Y,E.count=Z.count=S,ot+=G;for(const C of[He[k],We[k],Re[k],E,Z])It(C)}),Ne.copy(o)}Nt(a);const ba=650,ae=new Vt(So(),va,Math.max(1,t.length)),Ma=t.map(o=>new vt().compose(new d(o.x,o.y-o.scale*.25,o.z),new jt().setFromEuler(new ra(o.tilt,o.rot,o.tilt*.5)),new d(o.scale,o.scale*.7,o.scale*.9)));ae.castShadow=!0,ae.receiveShadow=!0,ae.frustumCulled=!1,ae.name="rocks",ae.instanceMatrix.setUsage(Zt),ae.count=0,e.add(ae);function za(o){let r=0;t.forEach((u,g)=>{(u.x-o.x)**2+(u.z-o.z)**2<ba**2&&ae.setMatrixAt(r++,Ma[g])}),ae.count=r,It(ae)}let de=n;function Gt(o){de=o,ma(de.grass,de.patch);for(const r of Ue)r.lod=-1;Ne.set(1e9,0,0)}Gt(n);let fe=null,Ie=0,rt=new d(0,-1,0);const Sa=Math.ceil(h/90);function Aa(o,r=!0){const u=mo(o);O.uStars.value=o.stars??0,O.uSunDir.value.copy(u),O.uSunCol.value.copy(ie(o.sun).multiplyScalar(o.sunI)),O.uZenith.value.copy(ie(o.zenith)),O.uHorizon.value.copy(ie(o.horizon)),O.uAmbSky.value.copy(ie(o.ambSky).multiplyScalar(o.ambI)),O.uAmbGround.value.copy(ie(o.ambGround).multiplyScalar(o.ambI)),O.uHaze.value=o.haze,O.uHazeFall.value=o.hazeFall,At.uniforms.uCloud.value=o.cloud,r?(qt(B,[u.x,u.y,u.z],y),P.needsUpdate=!0,rt.copy(u),fe=null):rt.angleTo(u)>ht.degToRad(.8)&&!fe&&(fe=[u.x,u.y,u.z],Ie=0)}function Ta(){if(!fe)return;const o=Math.min(h,Ie+Sa);qt(B,fe,M,[Ie,o]),Ie=o,Ie>=h&&(y.set(M),P.needsUpdate=!0,rt.set(...fe),fe=null)}function ka(o,r){if(!s.fine)return;const u=Math.round(o-U/2),g=Math.round(r-U/2),z=U/(N-1);for(let T=0;T<N;T++)for(let k=0;k<N;k++)xe[T*N+k]=s.fine(u+k*z,g+T*z);te.needsUpdate=!0,_.set(o,r),De.uniforms.uFineAt.value.set(u,g,U,N)}return{uniforms:O,root:m,setHour:Aa,setQuality:Gt,setTrees:Nt,setGround(o){A.set(o),H.needsUpdate=!0},setCanopy(o){for(let r=0;r<l*l;r++)w[r*4]=o[r];L.needsUpdate=!0},setFloor(o){Te.set(o),ke.needsUpdate=!0},setSoil(o,r,u){se.uniforms.uSoil.value.set(r,u,o,0);const g=o>.01;se.transparent!==g&&(se.transparent=g,se.needsUpdate=!0),se.depthWrite=o<.5,Ct=o<.05},setGloom(o,r,u){O.uGloom.value.set(o.r,o.g,o.b,r),O.uGloomD.value=u},setClear(o,r,u,g,z){_e[`uClear${o}`].value=r??R,_e.uClearAt.value[o].set(u,g,r?z:.001)},update(o,r){const u=o.position;O.uTime.value=r,Ta(),s.fine&&Math.hypot(u.x-_.x,u.z-_.y)>U*.22&&ka(u.x,u.z),Pe.position.copy(u),ua(u),De.uniforms.uCenter.value.set(u.x,u.z),ee&&(ee.visible=Ct&&u.y-et(u.x,u.z)<fa),Math.hypot(u.x-Ne.x,u.z-Ne.z)>12&&(ya(u),za(u))},colliders(){return nt.map(o=>({x:o.x,z:o.z,radius:ce[o.kind].radius*o.scale,cameraClearance:ce[o.kind].radius*o.scale+.3}))},sunAt(o,r){const u=c*p,g=Math.round((o+f)/u),z=Math.round((r+f)/u);return g<0||z<0||g>=h||z>=h?1:y[z*h+g]/255},stats:()=>({tiles:Ue.length,nearTrees:ot})}}function X(e,i){const a=e;for(const l of Object.keys(a.attributes))l!=="position"&&l!=="normal"&&a.deleteAttribute(l);const t=a.getAttribute("position"),n=new Float32Array(t.count),s=new d;for(let l=0;l<t.count;l++)n[l]=i(s.fromBufferAttribute(t,l));return a.setAttribute("aShade",new Xe(n,1)),a}function mt(e,i,a,t,n=1,s=1){let l=new wt(e,n);l.deleteAttribute("uv"),l=pt(l);const c=l.getAttribute("position"),f=l.getAttribute("normal"),v=new d,m=ne(t),p=Array.from({length:5},()=>new d(m()-.5,m()-.5,m()-.5).normalize());for(let h=0;h<c.count;h++){v.fromBufferAttribute(c,h);const w=v.clone().normalize();let y=1;for(const B of p)y+=Math.max(0,w.dot(B))**4*.22;v.copy(w).multiplyScalar(e*y),v.y*=s,v.add(i),c.setXYZ(h,v.x,v.y,v.z);const M=v.clone().sub(a).normalize().multiplyScalar(.7).add(w.multiplyScalar(.3)).normalize();f.setXYZ(h,M.x,M.y,M.z)}return l}function ia(e){if(e===9)return ho();if(e===10)return po();if(e===11)return go();if(e===12)return yo();if(e===13)return Mo();const i=ne(e*101+9);if(new d(0,1,0),e<3||e>=5){const m=e>=5,p=m?4.85:[8.5,10.5,7.5][e],h=m?2.75:p*.66,w=m?1.25:[2.6,2.1,3.2][e],y=m?1.2:[1.7,2.4,1.3][e],M=m?.55:1,B=m?[.15,.42]:[.16,.3],P=new dt(B[0],B[1],h+(m?.45:0),8,3);P.translate(0,(h+(m?.45:0))/2,0);const A=[0,1,2].map(_=>{const L=_/3*Math.PI*2+i(),J=new dt(.07,.13,w*1.1,6);return J.translate(0,w*.55,0),J.applyMatrix4(new vt().makeRotationFromEuler(new ra(Math.cos(L)*.8,0,Math.sin(L)*.8))),J.translate(0,h*.8,0),J}),H=X(q([P,...A].map(_=>(_.deleteAttribute("uv"),_))),_=>.55+.45*Math.min(1,_.y/h)),R=new d(0,h+y*.6,0),U=[],N=m?5:7+Math.floor(i()*3);for(let _=0;_<N;_++){const L=_/N*Math.PI*2+i()*.5,J=(i()-.35)*y,Te=w*(.55+i()*.35);U.push(mt((1.5+i()*.9)*M*(m?1.2:1),new d(Math.cos(L)*Te,R.y+J,Math.sin(L)*Te),R,e*31+_))}U.push(mt(2.2*M,new d(0,R.y+y*.75,0),R,e*31+99));const xe=X(q(U),_=>{const L=_.clone().sub(R);return Math.min(1,.5+.35*(L.y/(y+2)+.6)+.25*Math.hypot(L.x,L.z)/(w+2))}),te=X(q([mt(w+1.3*M,R.clone(),R.clone().setY(R.y-1),e+500,0,(y+2*M)/(w+1.3*M))]),_=>.6+.4*Math.min(1,Math.max(0,(_.y-R.y+2)/4)));return{trunk:H,crown:xe,far:te,radius:m?.32:.3}}const a=e===3?13:10,t=[],n=new dt(.1,.32,a*.9,7,2);n.translate(0,a*.45,0),n.deleteAttribute("uv");for(let m=0;m<5;m++){const p=m/5,h=(e===3?2.6:3)*(1-p*.78),w=a*.34*(1-p*.35),y=a*(.18+p*.62);let M=new Xt(h,w,11,2);M.deleteAttribute("uv"),M=pt(M);const B=M.getAttribute("position"),P=M.getAttribute("normal"),A=new d;for(let H=0;H<B.count;H++){A.fromBufferAttribute(B,H);const R=Math.hypot(A.x,A.z),U=1+.12*Math.sin(Math.atan2(A.z,A.x)*5+m*2);B.setXYZ(H,A.x*U,A.y+w/2+y-R/h*.5,A.z*U);const N=new d(A.x,h*.9,A.z).normalize();P.setXYZ(H,N.x,N.y,N.z)}t.push(M)}const s=X(q(t),m=>.5+.5*Math.min(1,Math.hypot(m.x,m.z)/2.2*.6+m.y/a*.5));let l=new Xt(e===3?2.6:3,a*.9,6,1);l.deleteAttribute("uv"),l.translate(0,a*.55,0);const c=l.getAttribute("position"),f=l.getAttribute("normal"),v=new d;for(let m=0;m<c.count;m++){v.fromBufferAttribute(c,m);const p=new d(v.x,1.6,v.z).normalize();f.setXYZ(m,p.x,p.y,p.z)}return l=X(l,m=>.55+.45*Math.min(1,m.y/a)),{trunk:X(n,m=>.5+.5*Math.min(1,m.y/a)),crown:s,far:l,radius:.3}}function j(e,i,a,t=8,n=5,s=!1){const l=new gt(e),c=new Za(l,t,1,n,!1),f=c.getAttribute("position"),v=new d,m=new d;for(let p=0;p<=t;p++){const h=p/t,w=i+(a-i)*h;l.getPointAt(h,m);for(let y=0;y<=n;y++){const M=p*(n+1)+y;v.fromBufferAttribute(f,M).sub(m).multiplyScalar(w).add(m),f.setXYZ(M,v.x,v.y,v.z)}}if(s){const p=c.getAttribute("uv"),h=l.getLength(),w=Math.PI*(i+a);for(let y=0;y<p.count;y++)p.setXY(y,p.getX(y)*h,p.getY(y)*w)}else c.deleteAttribute("uv");return c.computeVertexNormals(),c}function ho(){const e=ne(9091),i=[],a=[],t=4.6;i.push(j([new d(0,-.2,0),new d(.05,t*.4,.03),new d(-.04,t*.75,.02),new d(.02,t,0)],.36,.08,8,7));for(let c=0;c<6;c++){const f=c/6*Math.PI*2+e()*.6,v=t*(.45+e()*.45),m=1.4+e()*1.4,p=new d(Math.cos(f),.55+e()*.5,Math.sin(f)).normalize(),h=new d(0,v,0),w=h.clone().addScaledVector(p,m*.5).add(new d((e()-.5)*.4,-.1,(e()-.5)*.4)),y=h.clone().addScaledVector(p,m);i.push(j([h,w,y],.09,.03,5,4));for(let M=0;M<3;M++){const B=2*Math.PI*e(),P=w.clone().lerp(y,e()),A=P.clone().add(new d(Math.cos(B)*.6,.35+e()*.4,Math.sin(B)*.6)),H=A.clone().add(new d(Math.cos(B+.9)*.3,.25,Math.sin(B+.9)*.3));a.push(j([P,A,H],.03,.008,3,3))}}const n=X(q(i),c=>.5+.5*Math.min(1,c.y/t)),s=X(q(a),()=>.85),l=X(q([j([new d(0,0,0),new d(.1,t*.6,0),new d(0,t,0)],.32,.06,3,4),j([new d(0,t*.55,0),new d(1.2,t*.85,.3),new d(2,t*1.05,.5)],.1,.03,2,3),j([new d(0,t*.65,0),new d(-1,t*.9,-.5),new d(-1.6,t*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:n,crown:s,far:l,radius:.3}}function po(){const e=ne(1010),i=[],a=[],t=(c,f,v,m,p)=>{const h=new d(-f.z,0,f.x).normalize(),w=(e()-.5)*.8,y=c.clone().addScaledVector(f,v*.5).addScaledVector(h,w*v*.3),M=c.clone().addScaledVector(f,v).addScaledVector(h,w*v*.5);if(i.push(j([c,y,M],m,m*.62,5,5)),p===0){for(let P=0;P<3;P++){const A=new wt(.22+e()*.16,0);A.translate(M.x+(e()-.5)*.5,M.y+(e()-.3)*.45,M.z+(e()-.5)*.5),a.push(A)}return}const B=2;for(let P=0;P<B;P++){const A=P/B*Math.PI*2+e(),H=f.clone().multiplyScalar(.7).add(new d(Math.cos(A)*.7,.15+e()*.3,Math.sin(A)*.7)).normalize();t(M,H,v*(.62+e()*.15),m*.6,p-1)}};t(new d(0,-.3,0),new d(0,1,0),3,.45,2);const n=X(q(i),c=>.45+.55*Math.min(1,c.y/6)),s=X(q(a),c=>.55+.45*Math.min(1,c.y/6)),l=q([j([new d(0,-.3,0),new d(.3,2.5,0),new d(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(c=>{const f=c*2.1,v=new oa(1.1,7,5);return v.deleteAttribute("uv"),v.translate(Math.cos(f)*1.2,4.6+c*.4,Math.sin(f)*1.2),v})]);return{trunk:n,crown:s,far:X(l,c=>.45+.55*Math.min(1,c.y/6)),radius:.42}}const Q={11:{sprite:"pine",frame:[5,7.2],bark:"bark-pine",barkScale:[.8,1.2]},12:{sprite:"oak",frame:[6.4,6.8],bark:"bark-oak",barkScale:[1,1.6]},13:{sprite:"cedar",frame:[3.6,9.4],bark:"bark-cedar",barkScale:[.6,1.4]}},oe=3.4;function bt(e){const[i,a]=Q[e].frame,t=[],n=new d,s=new d(0,1,0);for(const f of[0,Math.PI/2]){const v=new na(i,a);v.translate(0,a/2-.25,0),v.rotateY(f),t.push(v)}const l=q(t),c=l.getAttribute("normal");for(let f=0;f<c.count;f++)n.set(c.getX(f),0,c.getZ(f)).multiplyScalar(.5).add(s).normalize(),c.setXYZ(f,n.x,n.y,n.z);return we(l,f=>.6+.4*Math.min(1,Math.max(0,f.y/a)))}function Mt(e,i,a=.7){const t=e.getAttribute("position"),n=e.getAttribute("normal"),s=new d,l=new d(0,1,0);for(let c=0;c<t.count;c++)s.fromBufferAttribute(t,c).sub(i),s.y*=a,s.normalize().lerp(l,.3).normalize(),n.setXYZ(c,s.x,s.y,s.z)}const wo=6.4;function go(){const e=ne(1111),i=wo,a=[],t=[],n=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.28),s=[0,.3,.62,1].map(w=>new d(n.x*Math.sin(w*Math.PI)*1.4+n.z*w*.3,-.2+(i*.97+.2)*w,n.z*Math.sin(w*Math.PI)*1.4-n.x*w*.3));a.push(j(s,.3,.05,7,6,!0));const l=new gt(s),c=w=>l.getPoint(Math.min(1,Math.max(0,(w+.2)/(i*.97+.2)))),f=new d(0,oe+(i-oe)*.55,0),v=(w,y,M=!0)=>t.push({position:w.clone().sub(new d(0,y*.45,0)),yaw:e()*Math.PI,width:y,height:y*(.85+e()*.3),flat:M}),m=5;for(let w=0;w<m;w++){const y=w/(m-1),M=oe-.1+y*(i-oe-.9),B=w*2.4+e()*.8,P=(1.9-y*.8)*(.85+e()*.3),A=.35+y*.35+e()*.2,H=new d(Math.cos(B),A,Math.sin(B)).normalize(),R=c(M),U=R.clone().addScaledVector(H,P*.5).add(new d((e()-.5)*.4,(e()-.6)*.3,(e()-.5)*.4)),N=R.clone().addScaledVector(H,P).add(new d(0,.15+e()*.3,0));a.push(j([R,U,N],.09-y*.03,.025,3,4,!0)),v(U.clone().lerp(N,.35).add(new d(0,.25,0)),.95+e()*.3,!1),v(N.clone().add(new d(0,.3,0)),1.25+e()*.4),e()<.6&&v(N.clone().add(new d((e()-.5)*.9,.55+e()*.3,(e()-.5)*.9)),.9+e()*.3)}for(let w=0;w<3;w++){const y=c(i*.97-w*.55);v(y.clone().add(new d((e()-.5)*.7,.35,(e()-.5)*.7)),1+e()*.3,w===0)}const p=we(q(a),w=>.5+.5*Math.min(1,w.y/i)),h=xt(t);return Mt(h,f),{trunk:p,crown:we(h,w=>Math.min(1,.55+.3*(w.y-oe)/(i-oe)+.25*Math.hypot(w.x,w.z)/2.2)),far:bt(11),radius:.32}}const xo=6;function yo(){const e=ne(1212),i=xo,a=[],t=new d(e()-.5,0,e()-.5).normalize().multiplyScalar(.22),n=[0,.35,.7,1].map(p=>new d(t.x*Math.sin(p*Math.PI*1.3)*1.2,-.2+(i*.78+.2)*p,t.z*Math.sin(p*Math.PI*1.3)*1.2));a.push(j(n,.34,.12,6,7,!0));const s=new gt(n),l=p=>s.getPoint(Math.min(1,Math.max(0,(p+.2)/(i*.78+.2)))),c=new d(0,oe+(i-oe)*.6,0),f=[];for(let p=0;p<5;p++){const h=p/4,w=oe-.5+h*(i*.78-oe+.3),y=p*2.5+e()*.9,M=(2.4-h*.9)*(.85+e()*.3),B=.45+h*.4,P=new d(Math.cos(y),B,Math.sin(y)).normalize(),A=l(w),H=A.clone().addScaledVector(P,M*.55).add(new d((e()-.5)*.5,(e()-.4)*.3,(e()-.5)*.5)),R=A.clone().addScaledVector(P,M).add(new d(0,.2+e()*.3,0));a.push(j([A,H,R],.13-h*.04,.04,3,5,!0));const U=y+(e()-.5)*1.6,N=H.clone().add(new d(Math.cos(U)*M*.45,.35+e()*.4,Math.sin(U)*M*.45));a.push(j([H,H.clone().lerp(N,.5).add(new d(0,.1,0)),N],.07,.03,2,4,!0));for(const xe of[R,N,H.clone().lerp(R,.6)]){const te=1.3+e()*.6;f.push({position:xe.clone().add(new d((e()-.5)*.5,.1-te*.3,(e()-.5)*.5)),yaw:e()*Math.PI,width:te,height:te*(.85+e()*.3),flat:e()<.6})}}f.push(...qa(e,c,2.3,1.2,2.3,9,1.5));const v=we(q(a),p=>.5+.5*Math.min(1,p.y/i)),m=xt(f);return Mt(m,c,.6),{trunk:v,crown:we(m,p=>{const h=p.clone().sub(c);return Math.min(1,.45+.35*(h.y/2.6+.6)+.25*Math.hypot(h.x,h.z)/3.2)}),far:bt(12),radius:.34}}const bo=9;function Mo(){const e=ne(1313),i=bo,a=[],t=j([new d(0,-.2,0),new d(.04,i*.5,.02),new d(0,i*.96,0)],.2,.03,4,6,!0),n=7;for(let l=0;l<n;l++){const c=l/(n-1),f=1.3+c*(i-1.9),v=(2.4-c*1.5)*(.9+e()*.2),m=2.2-c*.6;for(const p of[0,1.05])a.push({position:new d((e()-.5)*.3,f-m*.45,(e()-.5)*.3),yaw:l*.9+p+e()*.3,width:v,height:m,flat:!1})}a.push({position:new d(0,i-.9,0),yaw:e()*3,width:.7,height:1.3,flat:!1});const s=xt(a);return Mt(s,new d(0,i*.5,0),.25),{trunk:we(t,l=>.45+.55*Math.min(1,l.y/i)),crown:we(s,l=>.5+.3*Math.min(1,l.y/i)+.2*Math.min(1,Math.hypot(l.x,l.z)/.9)),far:bt(13),radius:.22}}function we(e,i){for(const s of Object.keys(e.attributes))s!=="position"&&s!=="normal"&&s!=="uv"&&e.deleteAttribute(s);const a=e.getAttribute("position"),t=new Float32Array(a.count),n=new d;for(let s=0;s<a.count;s++)t[s]=i(n.fromBufferAttribute(a,s));return e.setAttribute("aShade",new Xe(t,1)),e}function zo(e,i,a,t,n,s){const[l,c]=Q[i].frame,f=256,v=new Ga(Math.round(f*l/c),f,{format:Ke,colorSpace:_a});v.texture.minFilter=Ua,v.texture.generateMipmaps=!0;const m=new Ya,p=ia(i),h=Q[i].barkScale,w=s.clone();w.repeat.set(h[0],h[1]),w.needsUpdate=!0,m.add(new pe(p.trunk,new Kt({color:n,map:w,toneMapped:!1}))),m.add(new pe(p.crown,new Kt({color:t,map:a,alphaTest:.5,side:Ee,toneMapped:!1}))),m.add(new $a("#ffffff","#8a8a80",1));const y=new La("#fff4e0",.35);y.position.set(.5,1,1),m.add(y);const M=new Oa(-l/2,l/2,c-.25,-.25,-20,20);M.position.set(0,0,10),M.lookAt(0,0,0);const B=e.getRenderTarget(),P=e.getClearColor(new le),A=e.getClearAlpha();return e.setRenderTarget(v),e.setClearColor("#000000",0),e.clear(),e.render(m,M),e.setRenderTarget(B),e.setClearColor(P,A),p.trunk.dispose(),p.crown.dispose(),p.far.dispose(),v.texture}function So(){let e=new wt(1,1);e.deleteAttribute("uv"),e=pt(e);const i=e.getAttribute("position"),a=new d,t=ne(5);for(let n=0;n<i.count;n++)a.fromBufferAttribute(i,n),a.multiplyScalar(.8+t()*.35),i.setXYZ(n,a.x,a.y,a.z);return e=e.toNonIndexed(),e.computeVertexNormals(),X(e,n=>.55+.45*Math.min(1,Math.max(0,n.y+.6)))}export{ge as A,vo as C,Ae as F,Fo as H,Ge as M,re as N,Po as Q,oo as a,Jt as b,no as c,Do as d,mo as e,ea as s};
