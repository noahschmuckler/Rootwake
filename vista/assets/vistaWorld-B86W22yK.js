import{G as wt,a5 as ce,at as Ue,au as $e,av as Ve,aw as gt,ab as yt,ax as bt,ay as zt,i as Le,ai as je,C as ne,V as r,k as At,M as Ae,z as Oe,_ as He,ag as Ze,Z as Jt,r as kt,l as ea,I as Mt,w as Qe,Q as St,x as Ht,ak as Ct,e as qe,az as ta,aA as aa,u as Ke,n as X,d as Tt,a4 as et,v as tt,J as Je,aB as oa,aC as na,j as ra,s as sa}from"./BufferGeometryUtils-DZyYn7VG.js";import{r as re,e as Ft,n as la,s as ia}from"./vistaTerrain-BQ6jDvM3.js";const se=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,de=`
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
`,Be=`
uniform sampler2D uMapData; uniform sampler2D uSunTex; uniform sampler2D uGround; uniform highp sampler2D uHeight; uniform float uMapHalf; uniform float uCell; uniform float uN; uniform float uSunN; uniform float uWaterY; uniform float uSnowY;
vec2 mapUV(vec2 xz){ return ((xz + uMapHalf) / uCell + 0.5) / uN; }
bool onMap(vec2 xz){ vec2 f = (xz + uMapHalf) / uCell; return f.x >= 0.0 && f.y >= 0.0 && f.x <= uN - 1.0 && f.y <= uN - 1.0; }
vec4 mapData(vec2 xz){
  if (!onMap(xz)) return vec4(1.0, 1.0, 0.0, 0.0);
  vec4 m = texture2D(uMapData, mapUV(xz)); float sc = (uN - 1.0) / (uSunN - 1.0);
  m.r = texture2D(uSunTex, ((xz + uMapHalf) / (uCell * sc) + 0.5) / uSunN).r; return m;
}
vec4 groundTint(vec2 xz){ return onMap(xz) ? texture2D(uGround, mapUV(xz)) : vec4(0.0); }
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
`,at=`
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
`,Bt=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,ot=`
#include <common>
#include <shadowmap_pars_vertex>
`,nt=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Me=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,ua=`
${ot}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,ca=`
${nt}
${se}${de}${Be}${at}${Bt}
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
  float vis = min(md.r, getShadowMask());
  vec3 col = toon(albedo, n, vis, mix(0.55, 1.0, md.g));
  float soil = 1.0 - 0.78 * uSoil.z * (1.0 - smoothstep(14.0, 28.0, distance(vWorld.xz, uSoil.xy)));
  gl_FragColor = vec4(applyHaze(col, vWorld), soil);
  ${Me}
}`,ma=`
${ot}
${se}${de}${Be}${at}${Bt}
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
  float hgt = uBladeH * (0.45 + 0.55 * aBlade.z) * smoothstep(0.3, 0.7, g) * fade * (1.0 + md.b * 0.8) * (0.7 + 0.6 * vnoise(xz * 0.08)) * (1.0 - smoothstep(0.2, 0.5, max(clearAt(xz).x, clearAt(xz).y)));
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
  vWorld = worldPosition.xyz; vY = y; vGust = gust; vMd = md.rg;
  vN = normalize(mix(n, vec3(0.0, 1.0, 0.0), 0.35));
  vCol = base * (0.92 + 0.16 * aBlade.z);
  vec3 transformedNormal = normalMatrix * vN;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,da=`
${nt}
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
  ${Me}
}`,va=`
${ot}
${se}
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
}`,fa=`
${nt}
${se}${de}${Be}
#ifdef ROCK
${at}
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
  ${Me}
}`,ha=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,pa=`
${se}${de}${Be}
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
  ${Me}
}`,xa=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,wa=`
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
  ${Me}
}`,Ta=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function ga(o){const s=qe.degToRad(o.elevation),d=qe.degToRad(o.azimuth);return new r(Math.sin(d)*Math.cos(s),Math.sin(s),-Math.cos(d)*Math.cos(s)).normalize()}const Fa=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],me=(o,s=1)=>new ne(o).multiplyScalar(s),ya=1;function ka(o,s,d,f,S,F={}){const{n:l,cell:h,half:x,size:w}=s,i=new wt;i.name="vista",o.add(i),o=i;const M=l>600?2:1,c=(l-1)/M+1,b=new Uint8Array(l*l*4),k=new Uint8Array(c*c),z=new Uint8Array(c*c),W=M===1?s:{...s,n:c,cell:h*M,h:(()=>{const e=new Float32Array(c*c);for(let t=0;t<c;t++)for(let a=0;a<c;a++)e[t*c+a]=s.h[t*M*l+a*M];return e})()},H=new ce(k,c,c,Ue,$e);H.magFilter=H.minFilter=Ve,H.wrapS=H.wrapT=gt;const T=new Uint8Array(l*l*4);F.ground&&T.set(F.ground);const _=new ce(T,l,l,yt,$e);_.magFilter=_.minFilter=Ve,_.needsUpdate=!0;const R=new ce(new Uint8Array(4),1,1);R.needsUpdate=!0;const j=96,Y=97,Se=new Float32Array(Y*Y),le=new ce(Se,Y,Y,Ue,bt);le.magFilter=le.minFilter=zt;let P=new Le(1e9,1e9);for(let e=0;e<l*l;e++)b[e*4+1]=Math.round(s.ao[e]*255),b[e*4+2]=Math.round(s.flow[e]*255),b[e*4+3]=Math.round(s.sediment[e]*255);const U=new ce(b,l,l,yt,$e);U.magFilter=U.minFilter=Ve,U.wrapS=U.wrapT=gt;const O=new ce(new Float32Array(s.h),l,l,Ue,bt);O.magFilter=O.minFilter=zt,O.needsUpdate=!0;const I={uSunDir:{value:new r(0,1,0)},uSunCol:{value:new ne},uZenith:{value:new ne},uHorizon:{value:new ne},uAmbSky:{value:new ne},uAmbGround:{value:new ne},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:F.hazeBase??s.waterY},uTime:{value:0},uMapData:{value:U},uSunTex:{value:H},uGround:{value:_},uHeight:{value:O},uMapHalf:{value:x},uCell:{value:h},uN:{value:l},uSunN:{value:c},uWaterY:{value:Number.isFinite(s.waterY)?s.waterY:-1e4},uSnowY:{value:s.snowY},uGloom:{value:new je(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},De=(e,t,a={},n={})=>{const m={...ta.merge([aa.lights]),...I,...a};return new Ze({uniforms:m,vertexShader:e,fragmentShader:t,lights:!0,defines:n})},Ge=16,rt=(l-1)/Ge,ve=rt*h,Dt=110,st=s.surface&&F.fineLod?[.5,1,2,4,8]:[1,2,4,8],Ce={uClear0:{value:R},uClear1:{value:R},uClear2:{value:R},uClearAt:{value:[new r(0,0,.001),new r(0,0,.001),new r(0,0,.001)]}},Q=De(ua,ca,{uSoil:{value:new je(0,0,0,0)},...Ce});Q.side=At;const We=(e,t)=>ia(s,e,t),Pe=new wt;Pe.name="terrain",o.add(Pe);const Te=[];function Gt(e,t,a){const n=rt/a,m=e*ve-x,p=t*ve-x,g=a*h,G=4+a*3,N=(n+1)*(n+1),v=new Float32Array((N+4*n)*3),B=new Float32Array((N+4*n)*3),$=[];for(let u=0;u<=n;u++)for(let C=0;C<=n;C++){const A=m+C*g,V=p+u*g,E=(u*(n+1)+C)*3,oe=la(s,A,V,Math.max(s.surface?1:h,g*.75),We);v[E]=A,v[E+1]=We(A,V),v[E+2]=V,B[E]=oe[0],B[E+1]=oe[1],B[E+2]=oe[2]}for(let u=0;u<n;u++)for(let C=0;C<n;C++){const A=u*(n+1)+C,V=A+1,E=A+n+1,oe=E+1;$.push(A,E,V,V,E,oe)}const y=[];for(let u=0;u<n;u++)y.push(u);for(let u=0;u<n;u++)y.push(u*(n+1)+n);for(let u=n;u>0;u--)y.push(n*(n+1)+u);for(let u=n;u>0;u--)y.push(u*(n+1));y.forEach((u,C)=>{const A=(N+C)*3;v[A]=v[u*3],v[A+1]=v[u*3+1]-G,v[A+2]=v[u*3+2],B[A]=B[u*3],B[A+1]=B[u*3+1],B[A+2]=B[u*3+2]});for(let u=0;u<y.length;u++){const C=y[u],A=y[(u+1)%y.length],V=N+u,E=N+(u+1)%y.length;$.push(C,V,A,A,V,E)}const D=new Oe;return D.setAttribute("position",new Je(v,3)),D.setAttribute("normal",new Je(B,3)),D.setIndex($),D.computeBoundingSphere(),D}for(let e=0;e<Ge;e++)for(let t=0;t<Ge;t++){const a={mesh:new Ae(void 0,Q),lod:-1,geos:[],cx:(t+.5)*ve-x,cz:(e+.5)*ve-x};a.mesh.receiveShadow=!0,a.mesh.matrixAutoUpdate=!1,a.mesh.userData={ti:t,tj:e},Pe.add(a.mesh),Te.push(a)}function Wt(e){const[t,a,n]=te.lod,m=st.length>4?1:0;for(const p of Te){const g=Math.max(0,Math.hypot(p.cx-e.x,p.cz-e.z)-ve*.7),G=(m&&g<Dt?-1:g<t?0:g<a?1:g<n?2:3)+m;if(G!==p.lod){p.lod=G,p.geos[G]??=Gt(p.mesh.userData.ti,p.mesh.userData.tj,st[G]),p.mesh.geometry=p.geos[G];for(let N=0;N<G-1;N++)p.geos[N]&&(p.geos[N].dispose(),p.geos[N]=void 0)}}}{const e=Math.max(7e3,x+4500),t=80,a=Math.round(2*e/t),n=[],m=[],p=[],g=x-t,G=new Int32Array((a+1)*(a+1)).fill(-1),N=(y,D)=>{const u=-e+y*t,C=-e+D*t;return!(u>=-g&&u+t<=g&&C>=-g&&C+t<=g)},v=(y,D)=>{const u=D*(a+1)+y;if(G[u]>=0)return G[u];const C=-e+y*t,A=-e+D*t,V=Math.abs(C)<=x&&Math.abs(A)<=x,E=(Qt,qt)=>s.shape.base(Qt,qt),oe=E(C,A)-(V?6:0),ue=t,pt=-(E(C+ue,A)-E(C-ue,A)),xt=-(E(C,A+ue)-E(C,A-ue)),Ye=Math.hypot(pt,2*ue,xt);return G[u]=n.length/3,n.push(C,oe,A),m.push(pt/Ye,2*ue/Ye,xt/Ye),G[u]};for(let y=0;y<a;y++)for(let D=0;D<a;D++)if(N(D,y)){const u=v(D,y),C=v(D+1,y),A=v(D,y+1),V=v(D+1,y+1);p.push(u,A,C,C,A,V)}const B=new Oe;B.setAttribute("position",new He(n,3)),B.setAttribute("normal",new He(m,3)),B.setIndex(p),B.computeBoundingSphere();const $=new Ae(B,Q);$.name="far-ring",$.frustumCulled=!1,o.add($)}const lt=new Ze({uniforms:{...I,uCloud:{value:.5}},vertexShader:xa,fragmentShader:wa,side:Jt,depthWrite:!1}),fe=new Ae(new kt(8e3,48,24),lt);fe.name="sky",fe.frustumCulled=!1,fe.renderOrder=-10,o.add(fe);const Pt=new Ze({uniforms:{...I},vertexShader:ha,fragmentShader:pa,transparent:!0,depthWrite:!1}),it=new ea(w,w,8,8);it.rotateX(-Math.PI/2);const Fe=new Ae(it,Pt);Fe.position.y=s.waterY,Fe.name="lake",Fe.visible=Number.isFinite(s.waterY),o.add(Fe);const he=De(ma,da,{uCenter:{value:new Le},uPatch:{value:60},uBladeH:{value:F.bladeH??.34},uBladeW:{value:.045},uWind:{value:new Le(.94,.34)},...Ce,uFine:{value:le},uFineAt:{value:new je(0,0,1,0)}});he.side=At;const ut=3,ie=new Oe;{const e=[],t=[],a=[],n=re(3);for(let m=0;m<ut;m++){const p=m/ut*Math.PI*2+n()*.6,g=(n()-.5)*.12,G=(n()-.5)*.12,N=.65+n()*.55,v=e.length/3;for(const[B,$]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])e.push(B,$,0),t.push(p,g,G,N);a.push(v,v+1,v+2,v+2,v+1,v+3,v+2,v+3,v+4,v+4,v+3,v+5,v+4,v+5,v+6)}ie.setAttribute("position",new He(e,3)),ie.setAttribute("aTuft",new He(t,4)),ie.setIndex(a)}let Z=null,ct=!0;const It=14;function Nt(e,t){if(Z&&(Z.geometry.dispose(),o.remove(Z),Z=null),!e)return;const a=new oa;a.index=ie.index,a.setAttribute("position",ie.getAttribute("position")),a.setAttribute("aTuft",ie.getAttribute("aTuft"));const n=re(77),m=new Float32Array(e*4);for(let p=0;p<e;p++)m[p*4]=n()*t,m[p*4+1]=n()*t,m[p*4+2]=n(),m[p*4+3]=n()*Math.PI*2;a.setAttribute("aBlade",new na(m,4)),a.instanceCount=e,Z=new Ae(a,he),Z.frustumCulled=!1,Z.receiveShadow=!0,Z.name="grass",o.add(Z),he.uniforms.uPatch.value=t}const ke=(e,t)=>De(va,fa,{uColor:{value:e?me(e):new ne}},t),Et=ke(null,{ROCK:""}),Ie=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446"],_t=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e"],mt=e=>e>=5&&e<9?{VARIED:""}:{},Ne=e=>e===9?{TWITCH:""}:e===10?{PULSE:""}:{},dt=Ie.map((e,t)=>ke(e,t>=9?Ne(t):{USE_SWAY:"",...mt(t)})),Rt=Ie.map((e,t)=>ke(e,{...mt(t),...Ne(t)})),vt=_t.map((e,t)=>ke(e,Ne(t))),J=Ie.map((e,t)=>ba(t)),pe=(e,t,a,n)=>{const m=new Mt(e,t,Math.max(1,a));return m.count=0,m.frustumCulled=!1,m.castShadow=n,m.receiveShadow=!0,m.instanceMatrix.setUsage(Ct),o.add(m),m};let ee=[],xe=[],we=[],ge=[],ye=[];function ft(e){for(const t of[...xe,...we,...ge,...ye])o.remove(t),t.dispose();ee=J.map((t,a)=>e.filter(n=>n.kind===a)),xe=J.map((t,a)=>pe(t.trunk,vt[a],ee[a].length,!1)),we=J.map((t,a)=>pe(t.crown,dt[a],ee[a].length,!1)),ge=J.flatMap((t,a)=>[pe(t.trunk,vt[a],ee[a].length,!0),pe(t.crown,dt[a],ee[a].length,!0)]);for(const t of ge)t.layers.set(ya);ye=J.map((t,a)=>pe(t.far,Rt[a],ee[a].length,!1)),be.set(1e9,0,0)}const Yt=(e,t)=>e.frame?t.fromArray(e.frame):t.compose(new r(e.x,e.y-.15,e.z),new St().setFromAxisAngle(new r(0,1,0),e.rot),new r(e.scale,e.scale,e.scale));let be=new r(1e9,0,0),Ee=0,_e=[];const Ut=F.treeReach??1400;function $t(e){const t=new Qe,a=(te.nearTrees*(F.nearTreesScale??1))**2,n=(te.shadow?te.shadowBox*1.25+8:0)**2,m=Ut**2;_e=[],Ee=0,ee.forEach((p,g)=>{let G=0,N=0,v=0;const[B,$]=[ge[g*2],ge[g*2+1]];for(const y of p){const D=(y.x-e.x)**2+(y.z-e.z)**2;D>m||(Yt(y,t),D<a?(xe[g].setMatrixAt(G,t),we[g].setMatrixAt(G,t),G++,_e.push(y)):ye[g].setMatrixAt(N++,t),D<n&&(B.setMatrixAt(v,t),$.setMatrixAt(v,t),v++))}xe[g].count=we[g].count=G,ye[g].count=N,B.count=$.count=v,Ee+=G;for(const y of[xe[g],we[g],ye[g],B,$])y.instanceMatrix.needsUpdate=!0}),be.copy(e)}ft(d);const Vt=650,K=new Mt(Ma(),Et,Math.max(1,f.length)),Lt=f.map(e=>new Qe().compose(new r(e.x,e.y-e.scale*.25,e.z),new St().setFromEuler(new Ht(e.tilt,e.rot,e.tilt*.5)),new r(e.scale,e.scale*.7,e.scale*.9)));K.castShadow=!0,K.receiveShadow=!0,K.frustumCulled=!1,K.name="rocks",K.instanceMatrix.setUsage(Ct),K.count=0,o.add(K);function jt(e){let t=0;f.forEach((a,n)=>{(a.x-e.x)**2+(a.z-e.z)**2<Vt**2&&K.setMatrixAt(t++,Lt[n])}),K.count=t,K.instanceMatrix.needsUpdate=!0}let te=S;function ht(e){te=e,Nt(te.grass,te.patch);for(const t of Te)t.lod=-1;be.set(1e9,0,0)}ht(S);let ae=null,ze=0,Re=new r(0,-1,0);const Ot=Math.ceil(c/90);function Zt(e,t=!0){const a=ga(e);I.uStars.value=e.stars??0,I.uSunDir.value.copy(a),I.uSunCol.value.copy(me(e.sun).multiplyScalar(e.sunI)),I.uZenith.value.copy(me(e.zenith)),I.uHorizon.value.copy(me(e.horizon)),I.uAmbSky.value.copy(me(e.ambSky).multiplyScalar(e.ambI)),I.uAmbGround.value.copy(me(e.ambGround).multiplyScalar(e.ambI)),I.uHaze.value=e.haze,I.uHazeFall.value=e.hazeFall,lt.uniforms.uCloud.value=e.cloud,t?(Ft(W,[a.x,a.y,a.z],k),H.needsUpdate=!0,Re.copy(a),ae=null):Re.angleTo(a)>qe.degToRad(.8)&&!ae&&(ae=[a.x,a.y,a.z],ze=0)}function Kt(){if(!ae)return;const e=Math.min(c,ze+Ot);Ft(W,ae,z,[ze,e]),ze=e,ze>=c&&(k.set(z),H.needsUpdate=!0,Re.set(...ae),ae=null)}function Xt(e,t){if(!F.fine)return;const a=Math.round(e-j/2),n=Math.round(t-j/2),m=j/(Y-1);for(let p=0;p<Y;p++)for(let g=0;g<Y;g++)Se[p*Y+g]=F.fine(a+g*m,n+p*m);le.needsUpdate=!0,P.set(e,t),he.uniforms.uFineAt.value.set(a,n,j,Y)}return{uniforms:I,root:i,setHour:Zt,setQuality:ht,setTrees:ft,setGround(e){T.set(e),_.needsUpdate=!0},setSoil(e,t,a){Q.uniforms.uSoil.value.set(t,a,e,0);const n=e>.01;Q.transparent!==n&&(Q.transparent=n,Q.needsUpdate=!0),Q.depthWrite=e<.5,ct=e<.05},setGloom(e,t,a){I.uGloom.value.set(e.r,e.g,e.b,t),I.uGloomD.value=a},setClear(e,t,a,n,m){Ce[`uClear${e}`].value=t??R,Ce.uClearAt.value[e].set(a,n,t?m:.001)},update(e,t){const a=e.position;I.uTime.value=t,Kt(),F.fine&&Math.hypot(a.x-P.x,a.z-P.y)>j*.22&&Xt(a.x,a.z),fe.position.copy(a),Wt(a),he.uniforms.uCenter.value.set(a.x,a.z),Z&&(Z.visible=ct&&a.y-We(a.x,a.z)<It),Math.hypot(a.x-be.x,a.z-be.z)>12&&($t(a),jt(a))},colliders(){return _e.map(e=>({x:e.x,z:e.z,radius:J[e.kind].radius*e.scale,cameraClearance:J[e.kind].radius*e.scale+.3}))},sunAt(e,t){const a=h*M,n=Math.round((e+x)/a),m=Math.round((t+x)/a);return n<0||m<0||n>=c||m>=c?1:k[m*c+n]/255},stats:()=>({tiles:Te.length,nearTrees:Ee})}}function L(o,s){const d=o;for(const l of Object.keys(d.attributes))l!=="position"&&l!=="normal"&&d.deleteAttribute(l);const f=d.getAttribute("position"),S=new Float32Array(f.count),F=new r;for(let l=0;l<f.count;l++)S[l]=s(F.fromBufferAttribute(f,l));return d.setAttribute("aShade",new Je(S,1)),d}function Xe(o,s,d,f,S=1,F=1){let l=new tt(o,S);l.deleteAttribute("uv"),l=et(l);const h=l.getAttribute("position"),x=l.getAttribute("normal"),w=new r,i=re(f),M=Array.from({length:5},()=>new r(i()-.5,i()-.5,i()-.5).normalize());for(let c=0;c<h.count;c++){w.fromBufferAttribute(h,c);const b=w.clone().normalize();let k=1;for(const W of M)k+=Math.max(0,b.dot(W))**4*.22;w.copy(b).multiplyScalar(o*k),w.y*=F,w.add(s),h.setXYZ(c,w.x,w.y,w.z);const z=w.clone().sub(d).normalize().multiplyScalar(.7).add(b.multiplyScalar(.3)).normalize();x.setXYZ(c,z.x,z.y,z.z)}return l}function ba(o){if(o===9)return za();if(o===10)return Aa();const s=re(o*101+9);if(new r(0,1,0),o<3||o>=5){const i=o>=5,M=i?4.85:[8.5,10.5,7.5][o],c=i?2.75:M*.66,b=i?1.25:[2.6,2.1,3.2][o],k=i?1.2:[1.7,2.4,1.3][o],z=i?.55:1,W=i?[.15,.42]:[.16,.3],H=new Ke(W[0],W[1],c+(i?.45:0),8,3);H.translate(0,(c+(i?.45:0))/2,0);const T=[0,1,2].map(P=>{const U=P/3*Math.PI*2+s(),O=new Ke(.07,.13,b*1.1,6);return O.translate(0,b*.55,0),O.applyMatrix4(new Qe().makeRotationFromEuler(new Ht(Math.cos(U)*.8,0,Math.sin(U)*.8))),O.translate(0,c*.8,0),O}),_=L(X([H,...T].map(P=>(P.deleteAttribute("uv"),P))),P=>.55+.45*Math.min(1,P.y/c)),R=new r(0,c+k*.6,0),j=[],Y=i?5:7+Math.floor(s()*3);for(let P=0;P<Y;P++){const U=P/Y*Math.PI*2+s()*.5,O=(s()-.35)*k,I=b*(.55+s()*.35);j.push(Xe((1.5+s()*.9)*z*(i?1.2:1),new r(Math.cos(U)*I,R.y+O,Math.sin(U)*I),R,o*31+P))}j.push(Xe(2.2*z,new r(0,R.y+k*.75,0),R,o*31+99));const Se=L(X(j),P=>{const U=P.clone().sub(R);return Math.min(1,.5+.35*(U.y/(k+2)+.6)+.25*Math.hypot(U.x,U.z)/(b+2))}),le=L(X([Xe(b+1.3*z,R.clone(),R.clone().setY(R.y-1),o+500,0,(k+2*z)/(b+1.3*z))]),P=>.6+.4*Math.min(1,Math.max(0,(P.y-R.y+2)/4)));return{trunk:_,crown:Se,far:le,radius:i?.32:.3}}const d=o===3?13:10,f=[],S=new Ke(.1,.32,d*.9,7,2);S.translate(0,d*.45,0),S.deleteAttribute("uv");for(let i=0;i<5;i++){const M=i/5,c=(o===3?2.6:3)*(1-M*.78),b=d*.34*(1-M*.35),k=d*(.18+M*.62);let z=new Tt(c,b,11,2);z.deleteAttribute("uv"),z=et(z);const W=z.getAttribute("position"),H=z.getAttribute("normal"),T=new r;for(let _=0;_<W.count;_++){T.fromBufferAttribute(W,_);const R=Math.hypot(T.x,T.z),j=1+.12*Math.sin(Math.atan2(T.z,T.x)*5+i*2);W.setXYZ(_,T.x*j,T.y+b/2+k-R/c*.5,T.z*j);const Y=new r(T.x,c*.9,T.z).normalize();H.setXYZ(_,Y.x,Y.y,Y.z)}f.push(z)}const F=L(X(f),i=>.5+.5*Math.min(1,Math.hypot(i.x,i.z)/2.2*.6+i.y/d*.5));let l=new Tt(o===3?2.6:3,d*.9,6,1);l.deleteAttribute("uv"),l.translate(0,d*.55,0);const h=l.getAttribute("position"),x=l.getAttribute("normal"),w=new r;for(let i=0;i<h.count;i++){w.fromBufferAttribute(h,i);const M=new r(w.x,1.6,w.z).normalize();x.setXYZ(i,M.x,M.y,M.z)}return l=L(l,i=>.55+.45*Math.min(1,i.y/d)),{trunk:L(S,i=>.5+.5*Math.min(1,i.y/d)),crown:F,far:l,radius:.3}}function q(o,s,d,f=8,S=5){const F=new ra(o),l=new sa(F,f,1,S,!1),h=l.getAttribute("position"),x=new r,w=new r;for(let i=0;i<=f;i++){const M=i/f,c=s+(d-s)*M;F.getPointAt(M,w);for(let b=0;b<=S;b++){const k=i*(S+1)+b;x.fromBufferAttribute(h,k).sub(w).multiplyScalar(c).add(w),h.setXYZ(k,x.x,x.y,x.z)}}return l.deleteAttribute("uv"),l.computeVertexNormals(),l}function za(){const o=re(9091),s=[],d=[],f=4.6;s.push(q([new r(0,-.2,0),new r(.05,f*.4,.03),new r(-.04,f*.75,.02),new r(.02,f,0)],.36,.08,8,7));for(let h=0;h<6;h++){const x=h/6*Math.PI*2+o()*.6,w=f*(.45+o()*.45),i=1.4+o()*1.4,M=new r(Math.cos(x),.55+o()*.5,Math.sin(x)).normalize(),c=new r(0,w,0),b=c.clone().addScaledVector(M,i*.5).add(new r((o()-.5)*.4,-.1,(o()-.5)*.4)),k=c.clone().addScaledVector(M,i);s.push(q([c,b,k],.09,.03,5,4));for(let z=0;z<3;z++){const W=2*Math.PI*o(),H=b.clone().lerp(k,o()),T=H.clone().add(new r(Math.cos(W)*.6,.35+o()*.4,Math.sin(W)*.6)),_=T.clone().add(new r(Math.cos(W+.9)*.3,.25,Math.sin(W+.9)*.3));d.push(q([H,T,_],.03,.008,3,3))}}const S=L(X(s),h=>.5+.5*Math.min(1,h.y/f)),F=L(X(d),()=>.85),l=L(X([q([new r(0,0,0),new r(.1,f*.6,0),new r(0,f,0)],.32,.06,3,4),q([new r(0,f*.55,0),new r(1.2,f*.85,.3),new r(2,f*1.05,.5)],.1,.03,2,3),q([new r(0,f*.65,0),new r(-1,f*.9,-.5),new r(-1.6,f*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:S,crown:F,far:l,radius:.3}}function Aa(){const o=re(1010),s=[],d=[],f=(h,x,w,i,M)=>{const c=new r(-x.z,0,x.x).normalize(),b=(o()-.5)*.8,k=h.clone().addScaledVector(x,w*.5).addScaledVector(c,b*w*.3),z=h.clone().addScaledVector(x,w).addScaledVector(c,b*w*.5);if(s.push(q([h,k,z],i,i*.62,5,5)),M===0){for(let H=0;H<3;H++){const T=new tt(.22+o()*.16,0);T.translate(z.x+(o()-.5)*.5,z.y+(o()-.3)*.45,z.z+(o()-.5)*.5),d.push(T)}return}const W=2;for(let H=0;H<W;H++){const T=H/W*Math.PI*2+o(),_=x.clone().multiplyScalar(.7).add(new r(Math.cos(T)*.7,.15+o()*.3,Math.sin(T)*.7)).normalize();f(z,_,w*(.62+o()*.15),i*.6,M-1)}};f(new r(0,-.3,0),new r(0,1,0),3,.45,2);const S=L(X(s),h=>.45+.55*Math.min(1,h.y/6)),F=L(X(d),h=>.55+.45*Math.min(1,h.y/6)),l=X([q([new r(0,-.3,0),new r(.3,2.5,0),new r(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(h=>{const x=h*2.1,w=new kt(1.1,7,5);return w.deleteAttribute("uv"),w.translate(Math.cos(x)*1.2,4.6+h*.4,Math.sin(x)*1.2),w})]);return{trunk:S,crown:F,far:L(l,h=>.45+.55*Math.min(1,h.y/6)),radius:.42}}function Ma(){let o=new tt(1,1);o.deleteAttribute("uv"),o=et(o);const s=o.getAttribute("position"),d=new r,f=re(5);for(let S=0;S<s.count;S++)d.fromBufferAttribute(s,S),d.multiplyScalar(.8+f()*.35),s.setXYZ(S,d.x,d.y,d.z);return o=o.toNonIndexed(),o.computeVertexNormals(),L(o,S=>.55+.45*Math.min(1,Math.max(0,S.y+.6)))}export{de as A,ya as C,Me as F,Ta as H,Be as M,se as N,Fa as Q,ka as b,ga as s};
