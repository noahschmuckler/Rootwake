import{G as Tt,a5 as xe,aw as Ke,ax as Qe,ay as qe,az as Ft,ab as rt,aA as kt,aB as Dt,i as Je,am as et,C as oe,V as n,k as Pe,M as ve,z as tt,_ as Ie,ag as at,Z as fa,r as _t,l as It,aC as ha,aD as pa,I as Pt,w as st,Q as Ht,x as Rt,aj as Bt,e as it,ak as wa,al as xa,g as ga,aE as ya,aF as ba,S as za,ao as Wt,H as Aa,D as Ma,an as Sa,u as ot,n as K,d as Nt,a4 as lt,v as ct,j as Ut,J as Re,aG as Ca,aH as Ta,s as Fa}from"./BufferGeometryUtils-BgI0BArw.js";import{r as ne,e as Gt,n as ka,s as Da}from"./vistaTerrain-BQ6jDvM3.js";import{b as Pa,a as Ha}from"./sprites-CKbY9_xs.js";const te=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,fe=`
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
`,He=`
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
`,ut=`
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
`,Yt=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,Ue=`
#include <common>
#include <shadowmap_pars_vertex>
`,Ye=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,ye=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Ba=`
${Ue}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,Wa=`
${Ye}
${te}${fe}${He}${ut}${Yt}
varying vec3 vWorld; varying vec3 vNormal;
uniform vec4 uSoil; // x, z, amount: within reach of her the ground thins to glass while she is beneath it (groundVision)
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
  float vis = min(md.r * (1.0 - CANOPY_SHADE * canopyAt(p)), getShadowMask());
  vec3 col = toon(albedo, n, vis, mix(0.55, 1.0, md.g));
  float soil = 1.0 - 0.78 * uSoil.z * (1.0 - smoothstep(14.0, 28.0, distance(vWorld.xz, uSoil.xy)));
  gl_FragColor = vec4(applyHaze(col, vWorld), soil);
  ${ye}
}`,Na=`
${Ue}
${te}${fe}${He}${ut}${Yt}
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
}`,Ga=`
${Ye}
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
  ${ye}
}`,Ea=`
${Ue}
${te}
uniform float uTime;
attribute float aShade;
varying vec3 vWorld; varying vec3 vN; varying float vShade; varying vec2 vBase;
void main(){
  mat4 m = modelMatrix * instanceMatrix;
  vec4 worldPosition = m * vec4(position, 1.0);
  vBase = m[3].xz;
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
}`,_a=`
${Ye}
${te}${fe}${He}
#ifdef ROCK
${ut}
#endif
uniform vec3 uColor;
varying vec3 vWorld; varying vec3 vN; varying float vShade; varying vec2 vBase;
void main(){
  vec3 n = normalize(vN);
  float tint = hash12(floor(vBase * 0.37));
  vec4 md = mapData(vBase);
#ifdef ROCK
  vec3 albedo = rockColour(vWorld * vec3(1.0, 2.5, 1.0));
  float moss = smoothstep(0.55, 0.85, n.y + (vnoise(vWorld.xz * 1.3) - 0.5) * 0.4);
  albedo = mix(albedo, grassColour(vWorld.xz, md) * 0.8, moss);
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
}`,Ia=`
${Ue}
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
}`,Ra=`
${Ye}
${te}${fe}${He}
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
}`,Ua=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Ya=`
${te}${fe}${He}
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
}`,$a=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,Va=`
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
  ${ye}
}`,ao=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function La(a){const r=it.degToRad(a.elevation),d=it.degToRad(a.azimuth);return new n(Math.sin(d)*Math.cos(r),Math.sin(r),-Math.cos(d)*Math.cos(r)).normalize()}const oo=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],me=(a,r=1)=>new oe(a).multiplyScalar(r),Oa=1;function no(a,r,d,v,y,p={}){const{n:i,cell:f,half:w,size:h}=r,l=new Tt;l.name="vista",a.add(l),a=l;const A=i>600?2:1,c=(i-1)/A+1,z=new Uint8Array(i*i*4),F=new Uint8Array(c*c),x=new Uint8Array(c*c),W=A===1?r:{...r,n:c,cell:f*A,h:(()=>{const e=new Float32Array(c*c);for(let t=0;t<c;t++)for(let o=0;o<c;o++)e[t*c+o]=r.h[t*A*i+o*A];return e})()},P=new xe(F,c,c,Ke,Qe);P.magFilter=P.minFilter=qe,P.wrapS=P.wrapT=Ft;const k=new Uint8Array(i*i*4);p.ground&&k.set(p.ground);const G=new xe(k,i,i,rt,Qe);G.magFilter=G.minFilter=qe,G.needsUpdate=!0;const U=new xe(new Uint8Array(4),1,1);U.needsUpdate=!0;const L=96,E=97,m=new Float32Array(E*E),_=new xe(m,E,E,Ke,kt);_.magFilter=_.minFilter=Dt;let H=new Je(1e9,1e9);for(let e=0;e<i*i;e++)z[e*4+1]=Math.round(r.ao[e]*255),z[e*4+2]=Math.round(r.flow[e]*255),z[e*4+3]=Math.round(r.sediment[e]*255);const Y=new xe(z,i,i,rt,Qe);Y.magFilter=Y.minFilter=qe,Y.wrapS=Y.wrapT=Ft;const O=new xe(new Float32Array(r.h),i,i,Ke,kt);O.magFilter=O.minFilter=Dt,O.needsUpdate=!0;const I={uSunDir:{value:new n(0,1,0)},uSunCol:{value:new oe},uZenith:{value:new oe},uHorizon:{value:new oe},uAmbSky:{value:new oe},uAmbGround:{value:new oe},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:p.hazeBase??r.waterY},uTime:{value:0},uMapData:{value:Y},uSunTex:{value:P},uGround:{value:G},uHeight:{value:O},uMapHalf:{value:w},uCell:{value:f},uN:{value:i},uSunN:{value:c},uWaterY:{value:Number.isFinite(r.waterY)?r.waterY:-1e4},uSnowY:{value:r.snowY},uGloom:{value:new et(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},re=(e,t,o={},s={})=>{const g={...wa.merge([xa.lights]),...I,...o};return new at({uniforms:g,vertexShader:e,fragmentShader:t,lights:!0,defines:s})},se=16,be=(i-1)/se,q=be*f,Lt=110,dt=r.surface&&p.fineLod?[.5,1,2,4,8]:[1,2,4,8],Be={uClear0:{value:U},uClear1:{value:U},uClear2:{value:U},uClearAt:{value:[new n(0,0,.001),new n(0,0,.001),new n(0,0,.001)]}},ae=re(Ba,Wa,{uSoil:{value:new et(0,0,0,0)},...Be});ae.side=Pe;const $e=(e,t)=>Da(r,e,t),Ve=new Tt;Ve.name="terrain",a.add(Ve);const We=[];function Ot(e,t,o){const s=be/o,g=e*q-w,M=t*q-w,S=o*f,R=4+o*3,$=(s+1)*(s+1),b=new Float32Array(($+4*s)*3),N=new Float32Array(($+4*s)*3),Z=[];for(let u=0;u<=s;u++)for(let D=0;D<=s;D++){const T=g+D*S,X=M+u*S,V=(u*(s+1)+D)*3,de=ka(r,T,X,Math.max(r.surface?1:f,S*.75),$e);b[V]=T,b[V+1]=$e(T,X),b[V+2]=X,N[V]=de[0],N[V+1]=de[1],N[V+2]=de[2]}for(let u=0;u<s;u++)for(let D=0;D<s;D++){const T=u*(s+1)+D,X=T+1,V=T+s+1,de=V+1;Z.push(T,V,X,X,V,de)}const C=[];for(let u=0;u<s;u++)C.push(u);for(let u=0;u<s;u++)C.push(u*(s+1)+s);for(let u=s;u>0;u--)C.push(s*(s+1)+u);for(let u=s;u>0;u--)C.push(u*(s+1));C.forEach((u,D)=>{const T=($+D)*3;b[T]=b[u*3],b[T+1]=b[u*3+1]-R,b[T+2]=b[u*3+2],N[T]=N[u*3],N[T+1]=N[u*3+1],N[T+2]=N[u*3+2]});for(let u=0;u<C.length;u++){const D=C[u],T=C[(u+1)%C.length],X=$+u,V=$+(u+1)%C.length;Z.push(D,X,T,T,X,V)}const B=new tt;return B.setAttribute("position",new Re(b,3)),B.setAttribute("normal",new Re(N,3)),B.setIndex(Z),B.computeBoundingSphere(),B}for(let e=0;e<se;e++)for(let t=0;t<se;t++){const o={mesh:new ve(void 0,ae),lod:-1,geos:[],cx:(t+.5)*q-w,cz:(e+.5)*q-w};o.mesh.receiveShadow=!0,o.mesh.matrixAutoUpdate=!1,o.mesh.userData={ti:t,tj:e},Ve.add(o.mesh),We.push(o)}function jt(e){const[t,o,s]=ce.lod,g=dt.length>4?1:0;for(const M of We){const S=Math.max(0,Math.hypot(M.cx-e.x,M.cz-e.z)-q*.7),R=(g&&S<Lt?-1:S<t?0:S<o?1:S<s?2:3)+g;if(R!==M.lod){M.lod=R,M.geos[R]??=Ot(M.mesh.userData.ti,M.mesh.userData.tj,dt[R]),M.mesh.geometry=M.geos[R];for(let $=0;$<R-1;$++)M.geos[$]&&(M.geos[$].dispose(),M.geos[$]=void 0)}}}{const e=Math.max(7e3,w+4500),t=80,o=Math.round(2*e/t),s=[],g=[],M=[],S=w-t,R=new Int32Array((o+1)*(o+1)).fill(-1),$=(C,B)=>{const u=-e+C*t,D=-e+B*t;return!(u>=-S&&u+t<=S&&D>=-S&&D+t<=S)},b=(C,B)=>{const u=B*(o+1)+C;if(R[u]>=0)return R[u];const D=-e+C*t,T=-e+B*t,X=Math.abs(D)<=w&&Math.abs(T)<=w,V=(ma,va)=>r.shape.base(ma,va),de=V(D,T)-(X?6:0),we=t,St=-(V(D+we,T)-V(D-we,T)),Ct=-(V(D,T+we)-V(D,T-we)),Xe=Math.hypot(St,2*we,Ct);return R[u]=s.length/3,s.push(D,de,T),g.push(St/Xe,2*we/Xe,Ct/Xe),R[u]};for(let C=0;C<o;C++)for(let B=0;B<o;B++)if($(B,C)){const u=b(B,C),D=b(B+1,C),T=b(B,C+1),X=b(B+1,C+1);M.push(u,T,D,D,T,X)}const N=new tt;N.setAttribute("position",new Ie(s,3)),N.setAttribute("normal",new Ie(g,3)),N.setIndex(M),N.computeBoundingSphere();const Z=new ve(N,ae);Z.name="far-ring",Z.frustumCulled=!1,a.add(Z)}const mt=new at({uniforms:{...I,uCloud:{value:.5}},vertexShader:$a,fragmentShader:Va,side:fa,depthWrite:!1}),ze=new ve(new _t(8e3,48,24),mt);ze.name="sky",ze.frustumCulled=!1,ze.renderOrder=-10,a.add(ze);const Zt=new at({uniforms:{...I},vertexShader:Ua,fragmentShader:Ya,transparent:!0,depthWrite:!1}),vt=new It(h,h,8,8);vt.rotateX(-Math.PI/2);const Ne=new ve(vt,Zt);Ne.position.y=r.waterY,Ne.name="lake",Ne.visible=Number.isFinite(r.waterY),a.add(Ne);const Ae=re(Na,Ga,{uCenter:{value:new Je},uPatch:{value:60},uBladeH:{value:p.bladeH??.34},uBladeW:{value:.045},uWind:{value:new Je(.94,.34)},...Be,uFine:{value:_},uFineAt:{value:new et(0,0,1,0)}});Ae.side=Pe;const ft=3,he=new tt;{const e=[],t=[],o=[],s=ne(3);for(let g=0;g<ft;g++){const M=g/ft*Math.PI*2+s()*.6,S=(s()-.5)*.12,R=(s()-.5)*.12,$=.65+s()*.55,b=e.length/3;for(const[N,Z]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])e.push(N,Z,0),t.push(M,S,R,$);o.push(b,b+1,b+2,b+2,b+1,b+3,b+2,b+3,b+4,b+4,b+3,b+5,b+4,b+5,b+6)}he.setAttribute("position",new Ie(e,3)),he.setAttribute("aTuft",new Ie(t,4)),he.setIndex(o)}let Q=null,ht=!0;const Xt=14;function Kt(e,t){if(Q&&(Q.geometry.dispose(),a.remove(Q),Q=null),!e)return;const o=new Ca;o.index=he.index,o.setAttribute("position",he.getAttribute("position")),o.setAttribute("aTuft",he.getAttribute("aTuft"));const s=ne(77),g=new Float32Array(e*4);for(let M=0;M<e;M++)g[M*4]=s()*t,g[M*4+1]=s()*t,g[M*4+2]=s(),g[M*4+3]=s()*Math.PI*2;o.setAttribute("aBlade",new Ta(g,4)),o.instanceCount=e,Q=new ve(o,Ae),Q.frustumCulled=!1,Q.receiveShadow=!0,Q.name="grass",a.add(Q),Ae.uniforms.uPatch.value=t}const Ge=(e,t)=>re(Ea,_a,{uColor:{value:e?me(e):new oe}},t),Qt=Ge(null,{ROCK:""}),Ee=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446","#5d8f36"],pt=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e","#4e3c30"],Me=11,_e=Pa("pine"),wt=(e,t,o)=>{const s=re(Ia,Ra,{uColor:{value:me(e)},uMap:{value:t}},o);return s.side=Pe,s},qt=p.renderer?Qa(p.renderer,_e,Ee[Me],pt[Me]):_e,Jt=new ha({depthPacking:pa,map:_e,alphaTest:.5,side:Pe}),xt=e=>e>=5&&e<9?{VARIED:""}:{},Le=e=>e===9?{TWITCH:""}:e===10?{PULSE:""}:{},gt=Ee.map((e,t)=>t===Me?wt(e,_e,{USE_SWAY:""}):Ge(e,t>=9?Le(t):{USE_SWAY:"",...xt(t)})),ea=Ee.map((e,t)=>t===Me?wt("#ffffff",qt,{}):Ge(e,{...xt(t),...Le(t)})),yt=pt.map((e,t)=>Ge(e,{...Le(t),UNDER:""})),ie=Ee.map((e,t)=>ja(t)),Se=(e,t,o,s)=>{const g=new Pt(e,t,Math.max(1,o));return g.count=0,g.frustumCulled=!1,g.castShadow=s,g.receiveShadow=!0,g.instanceMatrix.setUsage(Bt),a.add(g),g};let le=[],Ce=[],Te=[],pe=[],Fe=[];function bt(e){for(const t of[...Ce,...Te,...pe,...Fe])a.remove(t),t.dispose();le=ie.map((t,o)=>e.filter(s=>s.kind===o)),Ce=ie.map((t,o)=>Se(t.trunk,yt[o],le[o].length,!1)),Te=ie.map((t,o)=>Se(t.crown,gt[o],le[o].length,!1)),pe=ie.flatMap((t,o)=>[Se(t.trunk,yt[o],le[o].length,!0),Se(t.crown,gt[o],le[o].length,!0)]);for(const t of pe)t.layers.set(Oa);pe[Me*2+1].customDepthMaterial=Jt,Fe=ie.map((t,o)=>Se(t.far,ea[o],le[o].length,!1)),ke.set(1e9,0,0)}const zt=e=>{const t=e.instanceMatrix;t.clearUpdateRanges(),e.count>0&&t.addUpdateRange(0,e.count*16),t.needsUpdate=!0},ta=(e,t)=>e.frame?t.fromArray(e.frame):t.compose(new n(e.x,e.y-.15,e.z),new Ht().setFromAxisAngle(new n(0,1,0),e.rot),new n(e.scale,e.scale,e.scale));let ke=new n(1e9,0,0),Oe=0,je=[];const aa=1.25,At=260,oa=p.treeReach??1400;function na(e){const t=new st,o=(ce.nearTrees*(p.nearTreesScale??1))**2,s=(ce.shadow?ce.shadowBox*1.25+8:0)**2,g=oa**2;je=[],Oe=0,le.forEach((M,S)=>{let R=0,$=0,b=0;const[N,Z]=[pe[S*2],pe[S*2+1]];for(const C of M){const B=(C.x-e.x)**2+(C.z-e.z)**2;B>g||(ta(C,t),B<o?(Ce[S].setMatrixAt(R,t),Te[S].setMatrixAt(R,t),R++,je.push(C)):(C.scale>=aa||B<At*At)&&Fe[S].setMatrixAt($++,t),B<s&&(N.setMatrixAt(b,t),Z.setMatrixAt(b,t),b++))}Ce[S].count=Te[S].count=R,Fe[S].count=$,N.count=Z.count=b,Oe+=R;for(const C of[Ce[S],Te[S],Fe[S],N,Z])zt(C)}),ke.copy(e)}bt(d);const ra=650,J=new Pt(qa(),Qt,Math.max(1,v.length)),sa=v.map(e=>new st().compose(new n(e.x,e.y-e.scale*.25,e.z),new Ht().setFromEuler(new Rt(e.tilt,e.rot,e.tilt*.5)),new n(e.scale,e.scale*.7,e.scale*.9)));J.castShadow=!0,J.receiveShadow=!0,J.frustumCulled=!1,J.name="rocks",J.instanceMatrix.setUsage(Bt),J.count=0,a.add(J);function ia(e){let t=0;v.forEach((o,s)=>{(o.x-e.x)**2+(o.z-e.z)**2<ra**2&&J.setMatrixAt(t++,sa[s])}),J.count=t,zt(J)}let ce=y;function Mt(e){ce=e,Kt(ce.grass,ce.patch);for(const t of We)t.lod=-1;ke.set(1e9,0,0)}Mt(y);let ue=null,De=0,Ze=new n(0,-1,0);const la=Math.ceil(c/90);function ca(e,t=!0){const o=La(e);I.uStars.value=e.stars??0,I.uSunDir.value.copy(o),I.uSunCol.value.copy(me(e.sun).multiplyScalar(e.sunI)),I.uZenith.value.copy(me(e.zenith)),I.uHorizon.value.copy(me(e.horizon)),I.uAmbSky.value.copy(me(e.ambSky).multiplyScalar(e.ambI)),I.uAmbGround.value.copy(me(e.ambGround).multiplyScalar(e.ambI)),I.uHaze.value=e.haze,I.uHazeFall.value=e.hazeFall,mt.uniforms.uCloud.value=e.cloud,t?(Gt(W,[o.x,o.y,o.z],F),P.needsUpdate=!0,Ze.copy(o),ue=null):Ze.angleTo(o)>it.degToRad(.8)&&!ue&&(ue=[o.x,o.y,o.z],De=0)}function ua(){if(!ue)return;const e=Math.min(c,De+la);Gt(W,ue,x,[De,e]),De=e,De>=c&&(F.set(x),P.needsUpdate=!0,Ze.set(...ue),ue=null)}function da(e,t){if(!p.fine)return;const o=Math.round(e-L/2),s=Math.round(t-L/2),g=L/(E-1);for(let M=0;M<E;M++)for(let S=0;S<E;S++)m[M*E+S]=p.fine(o+S*g,s+M*g);_.needsUpdate=!0,H.set(e,t),Ae.uniforms.uFineAt.value.set(o,s,L,E)}return{uniforms:I,root:l,setHour:ca,setQuality:Mt,setTrees:bt,setGround(e){k.set(e),G.needsUpdate=!0},setCanopy(e){for(let t=0;t<i*i;t++)z[t*4]=e[t];Y.needsUpdate=!0},setSoil(e,t,o){ae.uniforms.uSoil.value.set(t,o,e,0);const s=e>.01;ae.transparent!==s&&(ae.transparent=s,ae.needsUpdate=!0),ae.depthWrite=e<.5,ht=e<.05},setGloom(e,t,o){I.uGloom.value.set(e.r,e.g,e.b,t),I.uGloomD.value=o},setClear(e,t,o,s,g){Be[`uClear${e}`].value=t??U,Be.uClearAt.value[e].set(o,s,t?g:.001)},update(e,t){const o=e.position;I.uTime.value=t,ua(),p.fine&&Math.hypot(o.x-H.x,o.z-H.y)>L*.22&&da(o.x,o.z),ze.position.copy(o),jt(o),Ae.uniforms.uCenter.value.set(o.x,o.z),Q&&(Q.visible=ht&&o.y-$e(o.x,o.z)<Xt),Math.hypot(o.x-ke.x,o.z-ke.z)>12&&(na(o),ia(o))},colliders(){return je.map(e=>({x:e.x,z:e.z,radius:ie[e.kind].radius*e.scale,cameraClearance:ie[e.kind].radius*e.scale+.3}))},sunAt(e,t){const o=f*A,s=Math.round((e+w)/o),g=Math.round((t+w)/o);return s<0||g<0||s>=c||g>=c?1:F[g*c+s]/255},stats:()=>({tiles:We.length,nearTrees:Oe})}}function j(a,r){const d=a;for(const i of Object.keys(d.attributes))i!=="position"&&i!=="normal"&&d.deleteAttribute(i);const v=d.getAttribute("position"),y=new Float32Array(v.count),p=new n;for(let i=0;i<v.count;i++)y[i]=r(p.fromBufferAttribute(v,i));return d.setAttribute("aShade",new Re(y,1)),d}function nt(a,r,d,v,y=1,p=1){let i=new ct(a,y);i.deleteAttribute("uv"),i=lt(i);const f=i.getAttribute("position"),w=i.getAttribute("normal"),h=new n,l=ne(v),A=Array.from({length:5},()=>new n(l()-.5,l()-.5,l()-.5).normalize());for(let c=0;c<f.count;c++){h.fromBufferAttribute(f,c);const z=h.clone().normalize();let F=1;for(const W of A)F+=Math.max(0,z.dot(W))**4*.22;h.copy(z).multiplyScalar(a*F),h.y*=p,h.add(r),f.setXYZ(c,h.x,h.y,h.z);const x=h.clone().sub(d).normalize().multiplyScalar(.7).add(z.multiplyScalar(.3)).normalize();w.setXYZ(c,x.x,x.y,x.z)}return i}function ja(a){if(a===9)return Za();if(a===10)return Xa();if(a===11)return $t();const r=ne(a*101+9);if(new n(0,1,0),a<3||a>=5){const l=a>=5,A=l?4.85:[8.5,10.5,7.5][a],c=l?2.75:A*.66,z=l?1.25:[2.6,2.1,3.2][a],F=l?1.2:[1.7,2.4,1.3][a],x=l?.55:1,W=l?[.15,.42]:[.16,.3],P=new ot(W[0],W[1],c+(l?.45:0),8,3);P.translate(0,(c+(l?.45:0))/2,0);const k=[0,1,2].map(H=>{const Y=H/3*Math.PI*2+r(),O=new ot(.07,.13,z*1.1,6);return O.translate(0,z*.55,0),O.applyMatrix4(new st().makeRotationFromEuler(new Rt(Math.cos(Y)*.8,0,Math.sin(Y)*.8))),O.translate(0,c*.8,0),O}),G=j(K([P,...k].map(H=>(H.deleteAttribute("uv"),H))),H=>.55+.45*Math.min(1,H.y/c)),U=new n(0,c+F*.6,0),L=[],E=l?5:7+Math.floor(r()*3);for(let H=0;H<E;H++){const Y=H/E*Math.PI*2+r()*.5,O=(r()-.35)*F,I=z*(.55+r()*.35);L.push(nt((1.5+r()*.9)*x*(l?1.2:1),new n(Math.cos(Y)*I,U.y+O,Math.sin(Y)*I),U,a*31+H))}L.push(nt(2.2*x,new n(0,U.y+F*.75,0),U,a*31+99));const m=j(K(L),H=>{const Y=H.clone().sub(U);return Math.min(1,.5+.35*(Y.y/(F+2)+.6)+.25*Math.hypot(Y.x,Y.z)/(z+2))}),_=j(K([nt(z+1.3*x,U.clone(),U.clone().setY(U.y-1),a+500,0,(F+2*x)/(z+1.3*x))]),H=>.6+.4*Math.min(1,Math.max(0,(H.y-U.y+2)/4)));return{trunk:G,crown:m,far:_,radius:l?.32:.3}}const d=a===3?13:10,v=[],y=new ot(.1,.32,d*.9,7,2);y.translate(0,d*.45,0),y.deleteAttribute("uv");for(let l=0;l<5;l++){const A=l/5,c=(a===3?2.6:3)*(1-A*.78),z=d*.34*(1-A*.35),F=d*(.18+A*.62);let x=new Nt(c,z,11,2);x.deleteAttribute("uv"),x=lt(x);const W=x.getAttribute("position"),P=x.getAttribute("normal"),k=new n;for(let G=0;G<W.count;G++){k.fromBufferAttribute(W,G);const U=Math.hypot(k.x,k.z),L=1+.12*Math.sin(Math.atan2(k.z,k.x)*5+l*2);W.setXYZ(G,k.x*L,k.y+z/2+F-U/c*.5,k.z*L);const E=new n(k.x,c*.9,k.z).normalize();P.setXYZ(G,E.x,E.y,E.z)}v.push(x)}const p=j(K(v),l=>.5+.5*Math.min(1,Math.hypot(l.x,l.z)/2.2*.6+l.y/d*.5));let i=new Nt(a===3?2.6:3,d*.9,6,1);i.deleteAttribute("uv"),i.translate(0,d*.55,0);const f=i.getAttribute("position"),w=i.getAttribute("normal"),h=new n;for(let l=0;l<f.count;l++){h.fromBufferAttribute(f,l);const A=new n(h.x,1.6,h.z).normalize();w.setXYZ(l,A.x,A.y,A.z)}return i=j(i,l=>.55+.45*Math.min(1,l.y/d)),{trunk:j(y,l=>.5+.5*Math.min(1,l.y/d)),crown:p,far:i,radius:.3}}function ee(a,r,d,v=8,y=5){const p=new Ut(a),i=new Fa(p,v,1,y,!1),f=i.getAttribute("position"),w=new n,h=new n;for(let l=0;l<=v;l++){const A=l/v,c=r+(d-r)*A;p.getPointAt(A,h);for(let z=0;z<=y;z++){const F=l*(y+1)+z;w.fromBufferAttribute(f,F).sub(h).multiplyScalar(c).add(h),f.setXYZ(F,w.x,w.y,w.z)}}return i.deleteAttribute("uv"),i.computeVertexNormals(),i}function Za(){const a=ne(9091),r=[],d=[],v=4.6;r.push(ee([new n(0,-.2,0),new n(.05,v*.4,.03),new n(-.04,v*.75,.02),new n(.02,v,0)],.36,.08,8,7));for(let f=0;f<6;f++){const w=f/6*Math.PI*2+a()*.6,h=v*(.45+a()*.45),l=1.4+a()*1.4,A=new n(Math.cos(w),.55+a()*.5,Math.sin(w)).normalize(),c=new n(0,h,0),z=c.clone().addScaledVector(A,l*.5).add(new n((a()-.5)*.4,-.1,(a()-.5)*.4)),F=c.clone().addScaledVector(A,l);r.push(ee([c,z,F],.09,.03,5,4));for(let x=0;x<3;x++){const W=2*Math.PI*a(),P=z.clone().lerp(F,a()),k=P.clone().add(new n(Math.cos(W)*.6,.35+a()*.4,Math.sin(W)*.6)),G=k.clone().add(new n(Math.cos(W+.9)*.3,.25,Math.sin(W+.9)*.3));d.push(ee([P,k,G],.03,.008,3,3))}}const y=j(K(r),f=>.5+.5*Math.min(1,f.y/v)),p=j(K(d),()=>.85),i=j(K([ee([new n(0,0,0),new n(.1,v*.6,0),new n(0,v,0)],.32,.06,3,4),ee([new n(0,v*.55,0),new n(1.2,v*.85,.3),new n(2,v*1.05,.5)],.1,.03,2,3),ee([new n(0,v*.65,0),new n(-1,v*.9,-.5),new n(-1.6,v*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:y,crown:p,far:i,radius:.3}}function Xa(){const a=ne(1010),r=[],d=[],v=(f,w,h,l,A)=>{const c=new n(-w.z,0,w.x).normalize(),z=(a()-.5)*.8,F=f.clone().addScaledVector(w,h*.5).addScaledVector(c,z*h*.3),x=f.clone().addScaledVector(w,h).addScaledVector(c,z*h*.5);if(r.push(ee([f,F,x],l,l*.62,5,5)),A===0){for(let P=0;P<3;P++){const k=new ct(.22+a()*.16,0);k.translate(x.x+(a()-.5)*.5,x.y+(a()-.3)*.45,x.z+(a()-.5)*.5),d.push(k)}return}const W=2;for(let P=0;P<W;P++){const k=P/W*Math.PI*2+a(),G=w.clone().multiplyScalar(.7).add(new n(Math.cos(k)*.7,.15+a()*.3,Math.sin(k)*.7)).normalize();v(x,G,h*(.62+a()*.15),l*.6,A-1)}};v(new n(0,-.3,0),new n(0,1,0),3,.45,2);const y=j(K(r),f=>.45+.55*Math.min(1,f.y/6)),p=j(K(d),f=>.55+.45*Math.min(1,f.y/6)),i=K([ee([new n(0,-.3,0),new n(.3,2.5,0),new n(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(f=>{const w=f*2.1,h=new _t(1.1,7,5);return h.deleteAttribute("uv"),h.translate(Math.cos(w)*1.2,4.6+f*.4,Math.sin(w)*1.2),h})]);return{trunk:y,crown:p,far:j(i,f=>.45+.55*Math.min(1,f.y/6)),radius:.42}}const Ka=6.4,ge=3.4;function $t(){const a=ne(1111),r=Ka,d=[],v=[],y=new n(a()-.5,0,a()-.5).normalize().multiplyScalar(.28),p=[0,.3,.62,1].map(m=>new n(y.x*Math.sin(m*Math.PI)*1.4+y.z*m*.3,-.2+(r*.97+.2)*m,y.z*Math.sin(m*Math.PI)*1.4-y.x*m*.3));d.push(ee(p,.3,.05,7,6));const i=new Ut(p),f=m=>i.getPoint(Math.min(1,Math.max(0,(m+.2)/(r*.97+.2)))),w=new n(0,ge+(r-ge)*.55,0),h=(m,_,H=!0)=>v.push({position:m.clone().sub(new n(0,_*.45,0)),yaw:a()*Math.PI,width:_,height:_*(.85+a()*.3),flat:H}),l=5;for(let m=0;m<l;m++){const _=m/(l-1),H=ge-.1+_*(r-ge-.9),Y=m*2.4+a()*.8,O=(1.9-_*.8)*(.85+a()*.3),I=.35+_*.35+a()*.2,re=new n(Math.cos(Y),I,Math.sin(Y)).normalize(),se=f(H),be=se.clone().addScaledVector(re,O*.5).add(new n((a()-.5)*.4,(a()-.6)*.3,(a()-.5)*.4)),q=se.clone().addScaledVector(re,O).add(new n(0,.15+a()*.3,0));d.push(ee([se,be,q],.09-_*.03,.025,3,4)),h(be.clone().lerp(q,.35).add(new n(0,.25,0)),.95+a()*.3,!1),h(q.clone().add(new n(0,.3,0)),1.25+a()*.4),a()<.6&&h(q.clone().add(new n((a()-.5)*.9,.55+a()*.3,(a()-.5)*.9)),.9+a()*.3)}for(let m=0;m<3;m++){const _=f(r*.97-m*.55);h(_.clone().add(new n((a()-.5)*.7,.35,(a()-.5)*.7)),1+a()*.3,m===0)}const A=j(K(d),m=>.5+.5*Math.min(1,m.y/r)),c=Ha(v),z=c.getAttribute("position"),F=c.getAttribute("normal"),x=new n,W=new n(0,1,0);for(let m=0;m<z.count;m++)x.fromBufferAttribute(z,m).sub(w),x.y*=.7,x.normalize().lerp(W,.3).normalize(),F.setXYZ(m,x.x,x.y,x.z);const P=Et(c,m=>Math.min(1,.55+.3*(m.y-ge)/(r-ge)+.25*Math.hypot(m.x,m.z)/2.2)),[k,G]=Vt,U=[];for(const m of[0,Math.PI/2]){const _=new It(k,G);_.translate(0,G/2-.25,0),_.rotateY(m),U.push(_)}const L=K(U),E=L.getAttribute("normal");for(let m=0;m<E.count;m++)x.set(E.getX(m),0,E.getZ(m)).multiplyScalar(.5).add(W).normalize(),E.setXYZ(m,x.x,x.y,x.z);return{trunk:A,crown:P,far:Et(L,m=>.6+.4*Math.min(1,Math.max(0,m.y/G))),radius:.32}}const Vt=[5,7.2];function Et(a,r){for(const p of Object.keys(a.attributes))p!=="position"&&p!=="normal"&&p!=="uv"&&a.deleteAttribute(p);const d=a.getAttribute("position"),v=new Float32Array(d.count),y=new n;for(let p=0;p<d.count;p++)v[p]=r(y.fromBufferAttribute(d,p));return a.setAttribute("aShade",new Re(v,1)),a}function Qa(a,r,d,v){const[y,p]=Vt,i=256,f=new ga(Math.round(i*y/p),i,{format:rt,colorSpace:ya});f.texture.minFilter=ba,f.texture.generateMipmaps=!0;const w=new za,h=$t();w.add(new ve(h.trunk,new Wt({color:v,toneMapped:!1}))),w.add(new ve(h.crown,new Wt({color:d,map:r,alphaTest:.5,side:Pe,toneMapped:!1}))),w.add(new Aa("#ffffff","#8a8a80",1));const l=new Ma("#fff4e0",.35);l.position.set(.5,1,1),w.add(l);const A=new Sa(-y/2,y/2,p-.25,-.25,-20,20);A.position.set(0,0,10),A.lookAt(0,0,0);const c=a.getRenderTarget(),z=a.getClearColor(new oe),F=a.getClearAlpha();return a.setRenderTarget(f),a.setClearColor("#000000",0),a.clear(),a.render(w,A),a.setRenderTarget(c),a.setClearColor(z,F),h.trunk.dispose(),h.crown.dispose(),h.far.dispose(),f.texture}function qa(){let a=new ct(1,1);a.deleteAttribute("uv"),a=lt(a);const r=a.getAttribute("position"),d=new n,v=ne(5);for(let y=0;y<r.count;y++)d.fromBufferAttribute(r,y),d.multiplyScalar(.8+v()*.35),r.setXYZ(y,d.x,d.y,d.z);return a=a.toNonIndexed(),a.computeVertexNormals(),j(a,y=>.55+.45*Math.min(1,Math.max(0,y.y+.6)))}export{fe as A,Oa as C,ye as F,ao as H,He as M,te as N,oo as Q,Ia as a,Ea as b,Ra as c,no as d,La as e,_a as s};
