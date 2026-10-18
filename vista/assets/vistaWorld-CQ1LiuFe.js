import{G as Wt,a9 as Te,ar as ut,as as ft,at as mt,au as Et,ad as Gt,av as Pt,aw as _t,N as vt,ax as ht,C as we,V as P,n as Yt,M as Le,r as dt,a2 as Ke,q as pt,B as xo,l as go,o as yo,I as Rt,k as yt,Q as Ut,a0 as Nt,aj as $t,e as wt,ay as wo,az as bo,h as xt,E as Xe,d as Lt,a8 as zt,v as Zt,s as bt,aA as zo,aB as Mo}from"./BufferGeometryUtils-BnGIhdMB.js";const je=2048,Kt=513,Xt=je/(Kt-1),J=je/2,ne=40,Qt=300,Ao=200;function ue(e){let n=e>>>0||1;return()=>{n=n+1831565813>>>0;let o=n;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296}}function et(e){const n=ue(e),o=new Uint8Array(512),m=[...Array(256).keys()];for(let l=255;l>0;l--){const h=Math.floor(n()*(l+1));[m[l],m[h]]=[m[h],m[l]]}for(let l=0;l<512;l++)o[l]=m[l&255];const i=new Float32Array(256),s=new Float32Array(256);for(let l=0;l<256;l++){const h=n()*Math.PI*2;i[l]=Math.cos(h),s[l]=Math.sin(h)}const a=l=>l*l*l*(l*(l*6-15)+10);return(l,h)=>{const d=Math.floor(l),r=Math.floor(h),v=l-d,f=h-r,x=d&255,b=r&255,A=(E,X,$,F)=>{const I=o[E+o[X]];return i[I]*$+s[I]*F},H=A(x,b,v,f),C=A(x+1,b,v-1,f),y=A(x,b+1,v,f-1),p=A(x+1,b+1,v-1,f-1),z=a(v),W=a(f);return 1.41*((H+(C-H)*z)*(1-W)+(y+(p-y)*z)*W)}}function De(e,n,o,m,i=2,s=.5){let a=0,l=1,h=1,d=0;for(let r=0;r<m;r++)a+=e(n*h+r*17.3,o*h-r*9.1)*l,d+=l,l*=s,h*=i;return a/d}function So(e,n,o,m){let i=0,s=.5,a=1,l=1,h=0;for(let d=0;d<m;d++){let r=1-Math.abs(e(n*a+d*31.7,o*a+d*11.3));r*=r,r*=l,l=Math.min(1,r*1.6),i+=r*s,h+=s,s*=.5,a*=2.05}return i/h}const Ie=(e,n,o)=>{const m=Math.min(1,Math.max(0,(o-e)/(n-e)));return m*m*(3-2*m)},fe={x:0,z:260,rx:230,rz:380};function tt(e){return 170*Math.sin(e*.0019+.6)+60*Math.sin(e*.0051)}function Co(e){const n=et(e*7+1),o=et(e*7+2),m=et(e*7+3);return{base:(s,a)=>{const l=s+140*De(o,s*.0011,a*.0011,3),h=a+140*De(o,s*.0011+40,a*.0011-30,3),d=Math.abs(l-tt(h)),r=Ie(110,760,d+90*De(m,s*.002,a*.002,2)),v=So(n,l*.0016,h*.0016,6),f=De(m,s*.004,a*.004,4)*16+De(m,s*.012,a*.012,3)*4,x=Math.exp(-(((s-tt(a)*.4-fe.x)/fe.rx)**2+((a-fe.z)/fe.rz)**2));return ne+7+Math.max(0,(Math.abs(a)-500)*.02)+f*(1-r)+r**1.25*(80+520*v)+r*f*3-x*26},seed:e}}const ko={droplets:7e4,steps:64,radius:2,inertia:.06,capacity:6,minSlope:.01,erode:.35,deposit:.25,evaporate:.018,gravity:6,scale:20};function No(e=1,n={},o={}){const m=o.size??je,i=o.n??Kt,s=m/(i-1),a=m/2,l=Qe(),h=o.shape??Co(e),d=new Float32Array(i*i);for(let p=0;p<i;p++)for(let z=0;z<i;z++)d[p*i+z]=h.base(z*s-a,p*s-a);const r=Qe(),v=new Float32Array(i*i),f=new Float32Array(i*i),x={...ko,...n};x.scale*=s/Xt,Fo(d,v,f,e,x,i,s,o.erodeMask?(p,z)=>o.erodeMask(p*s-a,z*s-a):null);let b=0;for(let p=0;p<v.length;p++)v[p]=Math.log1p(v[p]),v[p]>b&&(b=v[p]);for(let p=0;p<v.length;p++)v[p]/=b||1;jt(v,1,i),jt(f,1,i);let A=0;for(const p of f)A=Math.max(A,p);for(let p=0;p<f.length;p++)f[p]=Math.min(1,f[p]/(A*.25||1));const H=Qe(),C=To(d,i,s,o.erodeMask?(p,z)=>o.erodeMask(p*s-a,z*s-a)>.005:null);let y=-1/0;for(const p of d)p>y&&(y=p);return{seed:e,shape:h,size:m,n:i,cell:s,half:a,ceiling:y+30,waterY:o.waterY??ne,snowY:o.snowY??Qt,surface:o.surface,h:d,flow:v,sediment:f,ao:C,ms:{shape:r-l,erosion:H-r,ao:Qe()-H}}}function Qe(){return typeof performance<"u"?performance.now():Date.now()}function Fo(e,n,o,m,i,s,a,l){const h=ue(m*131+7),d=i.scale,r=i.radius,v=[],f=[];let x=0;for(let C=-r;C<=r;C++)for(let y=-r;y<=r;y++){const p=Math.hypot(y,C);if(p<=r){v.push(y,C);const z=1-p/r;f.push(z),x+=z}}for(let C=0;C<f.length;C++)f[C]/=x;const b=Ao/a,A=(C,y)=>Ie(0,b,Math.min(C,y,s-1-C,s-1-y)-r)*(l?l(C,y):1),H=C=>e[C]/d;for(let C=0;C<i.droplets;C++){let y=h()*(s-3)+1,p=h()*(s-3)+1,z=0,W=0,E=1,X=1,$=0;for(let F=0;l&&F<12&&l(Math.floor(y),Math.floor(p))<.05;F++)y=h()*(s-3)+1,p=h()*(s-3)+1;for(let F=0;F<i.steps;F++){const I=Math.floor(y),j=Math.floor(p),T=y-I,Z=p-j,K=j*s+I,Me=H(K),re=H(K+1),We=H(K+s),Ae=H(K+s+1),Se=(re-Me)*(1-Z)+(Ae-We)*Z,ee=(We-Me)*(1-T)+(Ae-re)*T,Ee=Me*(1-T)*(1-Z)+re*T*(1-Z)+We*(1-T)*Z+Ae*T*Z;z=z*i.inertia-Se*(1-i.inertia),W=W*i.inertia-ee*(1-i.inertia);const me=Math.hypot(z,W);if(me<1e-9||(z/=me,W/=me,y+=z,p+=W,y<1||p<1||y>=s-2||p>=s-2))break;const ve=Math.floor(y),Ve=Math.floor(p),Ce=y-ve,he=p-Ve,te=Ve*s+ve,se=H(te)*(1-Ce)*(1-he)+H(te+1)*Ce*(1-he)+H(te+s)*(1-Ce)*he+H(te+s+1)*Ce*he-Ee,oe=A(I,j);n[K]+=X*oe;const ie=Math.max(-se,i.minSlope)*E*X*i.capacity;if($>ie||se>0){const le=se>0?Math.min(se,$):($-ie)*i.deposit;$-=le;const V=le*d*oe;e[K]+=V*(1-T)*(1-Z),e[K+1]+=V*T*(1-Z),e[K+s]+=V*(1-T)*Z,e[K+s+1]+=V*T*Z,o[K]+=le*oe}else{const le=Math.min((ie-$)*i.erode,-se);for(let V=0;V<f.length;V++){const N=I+v[V*2],ke=j+v[V*2+1];if(N<0||ke<0||N>=s||ke>=s)continue;const Ne=ke*s+N,nt=Math.min(le*f[V],e[Ne]/d)*oe;e[Ne]-=nt*d}$+=le*oe}E=Math.sqrt(Math.max(0,E*E-se*i.gravity)),X*=1-i.evaporate}}}function jt(e,n,o){const m=new Float32Array(e.length);for(let i=0;i<n;i++){for(let s=0;s<o;s++)for(let a=0;a<o;a++){const l=s*o+a;m[l]=(e[l]*2+e[s*o+Math.max(0,a-1)]+e[s*o+Math.min(o-1,a+1)])/4}for(let s=0;s<o;s++)for(let a=0;a<o;a++){const l=s*o+a;e[l]=(m[l]*2+m[Math.max(0,s-1)*o+a]+m[Math.min(o-1,s+1)*o+a])/4}}}function To(e,n,o,m){const i=new Float32Array(n*n),s=[2,6,16],a=8;for(let l=0;l<n;l++)for(let h=0;h<n;h++){const d=l*n+h;let r=0;if(m&&!m(h,l)){i[d]=1;continue}for(const v of s){let f=0;for(let x=0;x<a;x++){const b=x/a*Math.PI*2,A=Math.min(n-1,Math.max(0,Math.round(h+Math.cos(b)*v))),H=Math.min(n-1,Math.max(0,Math.round(l+Math.sin(b)*v)));f+=Math.max(0,e[H*n+A]-e[d])/(v*o)}r+=f/a}i[d]=Math.max(0,1-r*.9)}return i}function ce(e,n,o){const{n:m,cell:i,half:s}=e,a=(n+s)/i,l=(o+s)/i;if(a<0||l<0||a>=m-1||l>=m-1)return e.shape.base(n,o);const h=Math.floor(a),d=Math.floor(l),r=a-h,v=l-d,f=d*m+h,x=e.h;return x[f]*(1-r)*(1-v)+x[f+1]*r*(1-v)+x[f+m]*(1-r)*v+x[f+m+1]*r*v}function qt(e,n,o,m){const{n:i,cell:s,half:a}=e,l=Math.min(i-1,Math.max(0,Math.round((o+a)/s))),h=Math.min(i-1,Math.max(0,Math.round((m+a)/s)));return n[h*i+l]}function Jt(e,n,o,m=e.cell,i=(s,a)=>ce(e,s,a)){const s=i(n+m,o)-i(n-m,o),a=i(n,o+m)-i(n,o-m),l=-s,h=2*m,d=-a,r=Math.hypot(l,h,d);return[l/r,h/r,d/r]}function Ho(e,n,o){return e.surface?e.surface(n,o):ce(e,n,o)}function ot(e,n,o){return 1-Jt(e,n,o)[1]}function Ot(e,n,o=new Uint8Array(e.n*e.n),m=[0,e.n]){const{n:i,cell:s}=e,[a,l,h]=n,d=Math.hypot(a,h)||1e-6,r=l/d,v=a/d,f=h/d,x=e.h;if(l<=0)return o.fill(0,m[0]*i,m[1]*i),o;for(let b=m[0];b<m[1];b++)for(let A=0;A<i;A++){const H=x[b*i+A]+.5;let C=1,y=s*.75;for(let p=0;p<120&&C>0;p++){const z=A+v*y/s,W=b+f*y/s;if(z<0||W<0||z>=i-1||W>=i-1)break;const E=z|0,X=W|0,$=z-E,F=W-X,I=X*i+E,j=x[I]*(1-$)*(1-F)+x[I+1]*$*(1-F)+x[I+i]*(1-$)*F+x[I+i+1]*$*F,T=H+y*r;if(C=Math.min(C,(T-j)/(1.5+y*.02)*.5+.5),T>e.ceiling)break;y+=Math.max(s*.75,y*.06)}o[b*i+A]=Math.round(Math.min(1,Math.max(0,C))*255)}return o}const qe=7,Vt=150;function Zo(e,n=9e3){const o=ue(e.seed*977+3),m=et(e.seed*13+5),i=[];for(let s=-J+20;s<J-20;s+=qe)for(let a=-J+20;a<J-20;a+=qe){const l=a+(o()-.5)*qe*.9,h=s+(o()-.5)*qe*.9,d=ce(e,l,h);if(d<ne+2.5||d>Qt-30)continue;const r=ot(e,l,h);if(r>.22)continue;const v=De(m,l*.0045,h*.0045,4)+.2*qt(e,e.flow,l,h)-(d>Vt?0:.06),f=Ie(.02,.32,v)*(1-Ie(.12,.22,r));if(o()>f*.95+(o()<.004?1:0))continue;const x=d>Vt+(o()-.5)*60||v>.3&&o()<.25;if(i.push({x:l,z:h,y:d,kind:x?3+Math.floor(o()*2):Math.floor(o()*3),scale:.75+o()*.55,rot:o()*Math.PI*2}),i.length>=n)return i}return i}function Ko(e,n=900){const o=ue(e.seed*389+11),m=[];for(let i=0;i<n*30&&m.length<n;i++){const s=(o()-.5)*(je-60),a=(o()-.5)*(je-60),l=ce(e,s,a),h=ot(e,s,a);if(l<ne-1.5)continue;const d=qt(e,e.sediment,s,a),r=.02+.5*Ie(.1,.35,h)*(1-Ie(.5,.7,h))+.4*d;o()>r||m.push({x:s,z:a,y:l,scale:.4+o()**3*4.5,rot:o()*Math.PI*2,tilt:(o()-.5)*.5})}return m}function Do(e,n,o,m,i,s,a){const l=Math.hypot(i-n,a-m),h=Math.ceil(l/(Xt*2));for(let d=2;d<h-2;d++){const r=d/h;if(ce(e,n+(i-n)*r,m+(a-m)*r)>o+(s-o)*r)return!1}return!0}const Je=(e,n,o,m)=>Math.atan2(-(o-e),-(m-n));function Xo(e){const n={x:fe.x+tt(fe.z)*.4,z:fe.z},o=[];let m={x:0,z:0,y:-1/0};for(let r=-J+120;r<J-120;r+=16)for(let v=-J+120;v<J-120;v+=16){const f=ce(e,v,r);f>m.y&&(m={x:v,z:r,y:f})}const i=r=>{let v={x:0,z:0},f=-1/0;for(let x=-J+140;x<J-140;x+=12)for(let b=-J+140;b<J-140;b+=12){const A=r(b,x,ce(e,b,x));A>f&&(f=A,v={x:b,z:x})}return v},s=(r,v)=>{if(ot(e,r,v)>.12)return!1;const f=ce(e,r,v);return[[.3,0],[-.3,0],[0,.3],[0,-.3]].every(([x,b])=>Math.abs(ce(e,r+x,v+b)-f)<.15)},a=i((r,v,f)=>f<ne+.6||f>ne+3||!s(r,v)?-1/0:-Math.abs(Math.hypot(r-n.x,v-n.z)-260)+(Math.hypot(r-m.x,v-m.z)>Math.hypot(n.x-m.x,n.z-m.z)?120:0));o.push({name:"Lakeshore",...a,yaw:Je(a.x,a.z,n.x,n.z),pitch:.02});const l=i((r,v,f)=>!s(r,v)||f<ne+3||Math.abs(r-tt(v))>120?-1/0:-Math.abs(v-(fe.z-900))-ot(e,r,v)*400);o.push({name:"Valley meadow",...l,yaw:Je(l.x,l.z,n.x,n.z),pitch:.04});const h=i((r,v,f)=>{if(f<ne+140||f>ne+280||!s(r,v))return-1/0;const x=Math.hypot(r-n.x,v-n.z);return x<450||x>900?-1/0:Do(e,r,f+2,v,n.x,ne,n.z)?1e3-x:-1/0});o.push({name:"Ridge over the lake",...h,yaw:Je(h.x,h.z,n.x,n.z),pitch:-.12});const d=i((r,v,f)=>s(r,v)?f:-1/0);return o.push({name:"Summit",...d,yaw:Je(d.x,d.z,n.x,n.z),pitch:-.1}),o}const ze=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,Be=`
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
`,at=`
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
`,Mt=`
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
`,eo=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,At=`
#include <common>
#include <shadowmap_pars_vertex>
`,St=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Oe=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Io=`
${At}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,Bo=`
${St}
${ze}${Be}${at}${Mt}${eo}
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
  ${Oe}
}`,Wo=`
${At}
${ze}${Be}${at}${Mt}${eo}
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
}`,Eo=`
${St}
${ze}${Be}
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
  ${Oe}
}`,Go=`
${At}
${ze}
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
  vec3 wn = normalize(mat3(m) * normal);
  vec3 transformedNormal = mat3(viewMatrix) * wn;
  vWorld = worldPosition.xyz; vN = wn; vShade = aShade;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,Po=`
${St}
${ze}${Be}${at}
#ifdef ROCK
${Mt}
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
  ${Oe}
}`,_o=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Yo=`
${ze}${Be}${at}
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
  ${Oe}
}`,Ro=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,Uo=`
${ze}${Be}
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
  col = mix(col, uGloom.rgb, uGloom.a * 0.85);
  gl_FragColor = vec4(col, 1.0);
  ${Oe}
}`,Qo=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function $o(e){const n=wt.degToRad(e.elevation),o=wt.degToRad(e.azimuth);return new P(Math.sin(o)*Math.cos(n),Math.sin(n),-Math.cos(o)*Math.cos(n)).normalize()}const qo=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],He=(e,n=1)=>new we(e).multiplyScalar(n),Lo=1;function Jo(e,n,o,m,i,s={}){const{n:a,cell:l,half:h,size:d}=n,r=new Wt;r.name="vista",e.add(r),e=r;const v=a>600?2:1,f=(a-1)/v+1,x=new Uint8Array(a*a*4),b=new Uint8Array(f*f),A=new Uint8Array(f*f),H=v===1?n:{...n,n:f,cell:l*v,h:(()=>{const t=new Float32Array(f*f);for(let u=0;u<f;u++)for(let c=0;c<f;c++)t[u*f+c]=n.h[u*v*a+c*v];return t})()},C=new Te(b,f,f,ut,ft);C.magFilter=C.minFilter=mt,C.wrapS=C.wrapT=Et;const y=new Uint8Array(a*a*4);s.ground&&y.set(s.ground);const p=new Te(y,a,a,Gt,ft);p.magFilter=p.minFilter=mt,p.needsUpdate=!0;const z=new Te(new Uint8Array(4),1,1);z.needsUpdate=!0;const W=96,E=97,X=new Float32Array(E*E),$=new Te(X,E,E,ut,Pt);$.magFilter=$.minFilter=_t;let F=new vt(1e9,1e9);for(let t=0;t<a*a;t++)x[t*4+1]=Math.round(n.ao[t]*255),x[t*4+2]=Math.round(n.flow[t]*255),x[t*4+3]=Math.round(n.sediment[t]*255);const I=new Te(x,a,a,Gt,ft);I.magFilter=I.minFilter=mt,I.wrapS=I.wrapT=Et;const j=new Te(new Float32Array(n.h),a,a,ut,Pt);j.magFilter=j.minFilter=_t,j.needsUpdate=!0;const T={uSunDir:{value:new P(0,1,0)},uSunCol:{value:new we},uZenith:{value:new we},uHorizon:{value:new we},uAmbSky:{value:new we},uAmbGround:{value:new we},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:s.hazeBase??n.waterY},uTime:{value:0},uMapData:{value:I},uSunTex:{value:C},uGround:{value:p},uHeight:{value:j},uMapHalf:{value:h},uCell:{value:l},uN:{value:a},uSunN:{value:f},uWaterY:{value:Number.isFinite(n.waterY)?n.waterY:-1e4},uSnowY:{value:n.snowY},uGloom:{value:new ht(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},Z=(t,u,c={},g={})=>{const k={...wo.merge([bo.lights]),...T,...c};return new pt({uniforms:k,vertexShader:t,fragmentShader:u,lights:!0,defines:g})},K=16,Me=(a-1)/K,re=Me*l,We=110,Ae=n.surface&&s.fineLod?[.5,1,2,4,8]:[1,2,4,8],Se={uClear0:{value:z},uClear1:{value:z},uClear2:{value:z},uClearAt:{value:[new P(0,0,.001),new P(0,0,.001),new P(0,0,.001)]}},ee=Z(Io,Bo,{uSoil:{value:new ht(0,0,0,0)},...Se});ee.side=Yt;const Ee=(t,u)=>Ho(n,t,u),me=new Wt;me.name="terrain",e.add(me);const ve=[];function Ve(t,u,c){const g=Me/c,k=t*re-h,_=u*re-h,S=c*l,L=4+c*3,U=(g+1)*(g+1),M=new Float32Array((U+4*g)*3),Y=new Float32Array((U+4*g)*3),Q=[];for(let w=0;w<=g;w++)for(let G=0;G<=g;G++){const B=k+G*S,q=_+w*S,O=(w*(g+1)+G)*3,ye=Jt(n,B,q,Math.max(n.surface?1:l,S*.75),Ee);M[O]=B,M[O+1]=Ee(B,q),M[O+2]=q,Y[O]=ye[0],Y[O+1]=ye[1],Y[O+2]=ye[2]}for(let w=0;w<g;w++)for(let G=0;G<g;G++){const B=w*(g+1)+G,q=B+1,O=B+g+1,ye=O+1;Q.push(B,O,q,q,O,ye)}const D=[];for(let w=0;w<g;w++)D.push(w);for(let w=0;w<g;w++)D.push(w*(g+1)+g);for(let w=g;w>0;w--)D.push(g*(g+1)+w);for(let w=g;w>0;w--)D.push(w*(g+1));D.forEach((w,G)=>{const B=(U+G)*3;M[B]=M[w*3],M[B+1]=M[w*3+1]-L,M[B+2]=M[w*3+2],Y[B]=Y[w*3],Y[B+1]=Y[w*3+1],Y[B+2]=Y[w*3+2]});for(let w=0;w<D.length;w++){const G=D[w],B=D[(w+1)%D.length],q=U+w,O=U+(w+1)%D.length;Q.push(G,q,B,B,q,O)}const R=new dt;return R.setAttribute("position",new bt(M,3)),R.setAttribute("normal",new bt(Y,3)),R.setIndex(Q),R.computeBoundingSphere(),R}for(let t=0;t<K;t++)for(let u=0;u<K;u++){const c={mesh:new Le(void 0,ee),lod:-1,geos:[],cx:(u+.5)*re-h,cz:(t+.5)*re-h};c.mesh.receiveShadow=!0,c.mesh.matrixAutoUpdate=!1,c.mesh.userData={ti:u,tj:t},me.add(c.mesh),ve.push(c)}function Ce(t){var _;const[u,c,g]=xe.lod,k=Ae.length>4?1:0;for(const S of ve){const L=Math.max(0,Math.hypot(S.cx-t.x,S.cz-t.z)-re*.7),U=(k&&L<We?-1:L<u?0:L<c?1:L<g?2:3)+k;if(U!==S.lod){S.lod=U,(_=S.geos)[U]??(_[U]=Ve(S.mesh.userData.ti,S.mesh.userData.tj,Ae[U])),S.mesh.geometry=S.geos[U];for(let M=0;M<U-1;M++)S.geos[M]&&(S.geos[M].dispose(),S.geos[M]=void 0)}}}{const t=Math.max(7e3,h+4500),u=80,c=Math.round(2*t/u),g=[],k=[],_=[],S=h-u,L=new Int32Array((c+1)*(c+1)).fill(-1),U=(D,R)=>{const w=-t+D*u,G=-t+R*u;return!(w>=-S&&w+u<=S&&G>=-S&&G+u<=S)},M=(D,R)=>{const w=R*(c+1)+D;if(L[w]>=0)return L[w];const G=-t+D*u,B=-t+R*u,q=Math.abs(G)<=h&&Math.abs(B)<=h,O=(ho,po)=>n.shape.base(ho,po),ye=O(G,B)-(q?6:0),Fe=u,It=-(O(G+Fe,B)-O(G-Fe,B)),Bt=-(O(G,B+Fe)-O(G,B-Fe)),ct=Math.hypot(It,2*Fe,Bt);return L[w]=g.length/3,g.push(G,ye,B),k.push(It/ct,2*Fe/ct,Bt/ct),L[w]};for(let D=0;D<c;D++)for(let R=0;R<c;R++)if(U(R,D)){const w=M(R,D),G=M(R+1,D),B=M(R,D+1),q=M(R+1,D+1);_.push(w,B,G,G,B,q)}const Y=new dt;Y.setAttribute("position",new Ke(g,3)),Y.setAttribute("normal",new Ke(k,3)),Y.setIndex(_),Y.computeBoundingSphere();const Q=new Le(Y,ee);Q.name="far-ring",Q.frustumCulled=!1,e.add(Q)}const he=new pt({uniforms:{...T,uCloud:{value:.5}},vertexShader:Ro,fragmentShader:Uo,side:xo,depthWrite:!1}),te=new Le(new go(8e3,48,24),he);te.name="sky",te.frustumCulled=!1,te.renderOrder=-10,e.add(te);const Ct=new pt({uniforms:{...T},vertexShader:_o,fragmentShader:Yo,transparent:!0,depthWrite:!1}),se=new yo(d,d,8,8);se.rotateX(-Math.PI/2);const oe=new Le(se,Ct);oe.position.y=n.waterY,oe.name="lake",oe.visible=Number.isFinite(n.waterY),e.add(oe);const ie=Z(Wo,Eo,{uCenter:{value:new vt},uPatch:{value:60},uBladeH:{value:s.bladeH??.34},uBladeW:{value:.045},uWind:{value:new vt(.94,.34)},...Se,uFine:{value:$},uFineAt:{value:new ht(0,0,1,0)}});ie.side=Yt;const le=3,V=new dt;{const t=[],u=[],c=[],g=ue(3);for(let k=0;k<le;k++){const _=k/le*Math.PI*2+g()*.6,S=(g()-.5)*.12,L=(g()-.5)*.12,U=.65+g()*.55,M=t.length/3;for(const[Y,Q]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])t.push(Y,Q,0),u.push(_,S,L,U);c.push(M,M+1,M+2,M+2,M+1,M+3,M+2,M+3,M+4,M+4,M+3,M+5,M+4,M+5,M+6)}V.setAttribute("position",new Ke(t,3)),V.setAttribute("aTuft",new Ke(u,4)),V.setIndex(c)}let N=null,ke=!0;const Ne=14;function nt(t,u){if(N&&(N.geometry.dispose(),e.remove(N),N=null),!t)return;const c=new zo;c.index=V.index,c.setAttribute("position",V.getAttribute("position")),c.setAttribute("aTuft",V.getAttribute("aTuft"));const g=ue(77),k=new Float32Array(t*4);for(let _=0;_<t;_++)k[_*4]=g()*u,k[_*4+1]=g()*u,k[_*4+2]=g(),k[_*4+3]=g()*Math.PI*2;c.setAttribute("aBlade",new Mo(k,4)),c.instanceCount=t,N=new Le(c,ie),N.frustumCulled=!1,N.receiveShadow=!0,N.name="grass",e.add(N),ie.uniforms.uPatch.value=u}const Ze=(t,u)=>Z(Go,Po,{uColor:{value:t?He(t):new we}},u),to=Ze(null,{ROCK:""}),rt=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e"],oo=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a"],kt=t=>t>=5?{VARIED:""}:{},Ft=rt.map((t,u)=>Ze(t,{USE_SWAY:"",...kt(u)})),ao=rt.map((t,u)=>Ze(t,kt(u))),Tt=oo.map(t=>Ze(t,{})),de=rt.map((t,u)=>jo(u)),Ge=(t,u,c,g)=>{const k=new Rt(t,u,Math.max(1,c));return k.count=0,k.frustumCulled=!1,k.castShadow=g,k.receiveShadow=!0,k.instanceMatrix.setUsage($t),e.add(k),k};let pe=[],Pe=[],_e=[],Ye=[],Re=[];function Ht(t){for(const u of[...Pe,..._e,...Ye,...Re])e.remove(u),u.dispose();pe=de.map((u,c)=>t.filter(g=>g.kind===c)),Pe=de.map((u,c)=>Ge(u.trunk,Tt[c],pe[c].length,!1)),_e=de.map((u,c)=>Ge(u.crown,Ft[c],pe[c].length,!1)),Ye=de.flatMap((u,c)=>[Ge(u.trunk,Tt[c],pe[c].length,!0),Ge(u.crown,Ft[c],pe[c].length,!0)]);for(const u of Ye)u.layers.set(Lo);Re=de.map((u,c)=>Ge(u.far,ao[c],pe[c].length,!1)),Ue.set(1e9,0,0)}const no=(t,u)=>t.frame?u.fromArray(t.frame):u.compose(new P(t.x,t.y-.15,t.z),new Ut().setFromAxisAngle(new P(0,1,0),t.rot),new P(t.scale,t.scale,t.scale));let Ue=new P(1e9,0,0),st=0,it=[];const ro=s.treeReach??1400;function so(t){const u=new yt,c=(xe.nearTrees*(s.nearTreesScale??1))**2,g=(xe.shadow?xe.shadowBox*1.25+8:0)**2,k=ro**2;it=[],st=0,pe.forEach((_,S)=>{let L=0,U=0,M=0;const[Y,Q]=[Ye[S*2],Ye[S*2+1]];for(const D of _){const R=(D.x-t.x)**2+(D.z-t.z)**2;R>k||(no(D,u),R<c?(Pe[S].setMatrixAt(L,u),_e[S].setMatrixAt(L,u),L++,it.push(D)):Re[S].setMatrixAt(U++,u),R<g&&(Y.setMatrixAt(M,u),Q.setMatrixAt(M,u),M++))}Pe[S].count=_e[S].count=L,Re[S].count=U,Y.count=Q.count=M,st+=L;for(const D of[Pe[S],_e[S],Re[S],Y,Q])D.instanceMatrix.needsUpdate=!0}),Ue.copy(t)}Ht(o);const io=650,ae=new Rt(Oo(),to,Math.max(1,m.length)),lo=m.map(t=>new yt().compose(new P(t.x,t.y-t.scale*.25,t.z),new Ut().setFromEuler(new Nt(t.tilt,t.rot,t.tilt*.5)),new P(t.scale,t.scale*.7,t.scale*.9)));ae.castShadow=!0,ae.receiveShadow=!0,ae.frustumCulled=!1,ae.name="rocks",ae.instanceMatrix.setUsage($t),ae.count=0,e.add(ae);function co(t){let u=0;m.forEach((c,g)=>{(c.x-t.x)**2+(c.z-t.z)**2<io**2&&ae.setMatrixAt(u++,lo[g])}),ae.count=u,ae.instanceMatrix.needsUpdate=!0}let xe=i;function Dt(t){xe=t,nt(xe.grass,xe.patch);for(const u of ve)u.lod=-1;Ue.set(1e9,0,0)}Dt(i);let ge=null,$e=0,lt=new P(0,-1,0);const uo=Math.ceil(f/90);function fo(t,u=!0){const c=$o(t);T.uStars.value=t.stars??0,T.uSunDir.value.copy(c),T.uSunCol.value.copy(He(t.sun).multiplyScalar(t.sunI)),T.uZenith.value.copy(He(t.zenith)),T.uHorizon.value.copy(He(t.horizon)),T.uAmbSky.value.copy(He(t.ambSky).multiplyScalar(t.ambI)),T.uAmbGround.value.copy(He(t.ambGround).multiplyScalar(t.ambI)),T.uHaze.value=t.haze,T.uHazeFall.value=t.hazeFall,he.uniforms.uCloud.value=t.cloud,u?(Ot(H,[c.x,c.y,c.z],b),C.needsUpdate=!0,lt.copy(c),ge=null):lt.angleTo(c)>wt.degToRad(.8)&&!ge&&(ge=[c.x,c.y,c.z],$e=0)}function mo(){if(!ge)return;const t=Math.min(f,$e+uo);Ot(H,ge,A,[$e,t]),$e=t,$e>=f&&(b.set(A),C.needsUpdate=!0,lt.set(...ge),ge=null)}function vo(t,u){if(!s.fine)return;const c=Math.round(t-W/2),g=Math.round(u-W/2),k=W/(E-1);for(let _=0;_<E;_++)for(let S=0;S<E;S++)X[_*E+S]=s.fine(c+S*k,g+_*k);$.needsUpdate=!0,F.set(t,u),ie.uniforms.uFineAt.value.set(c,g,W,E)}return{root:r,setHour:fo,setQuality:Dt,setTrees:Ht,setGround(t){y.set(t),p.needsUpdate=!0},setSoil(t,u,c){ee.uniforms.uSoil.value.set(u,c,t,0);const g=t>.01;ee.transparent!==g&&(ee.transparent=g,ee.needsUpdate=!0),ee.depthWrite=t<.5,ke=t<.05},setGloom(t,u,c){T.uGloom.value.set(t.r,t.g,t.b,u),T.uGloomD.value=c},setClear(t,u,c,g,k){Se[`uClear${t}`].value=u??z,Se.uClearAt.value[t].set(c,g,u?k:.001)},update(t,u){const c=t.position;T.uTime.value=u,mo(),s.fine&&Math.hypot(c.x-F.x,c.z-F.y)>W*.22&&vo(c.x,c.z),te.position.copy(c),Ce(c),ie.uniforms.uCenter.value.set(c.x,c.z),N&&(N.visible=ke&&c.y-Ee(c.x,c.z)<Ne),Math.hypot(c.x-Ue.x,c.z-Ue.z)>12&&(so(c),co(c))},colliders(){return it.map(t=>({x:t.x,z:t.z,radius:de[t.kind].radius*t.scale,cameraClearance:de[t.kind].radius*t.scale+.3}))},sunAt(t,u){const c=l*v,g=Math.round((t+h)/c),k=Math.round((u+h)/c);return g<0||k<0||g>=f||k>=f?1:b[k*f+g]/255},stats:()=>({tiles:ve.length,nearTrees:st})}}function be(e,n){const o=e;for(const a of Object.keys(o.attributes))a!=="position"&&a!=="normal"&&o.deleteAttribute(a);const m=o.getAttribute("position"),i=new Float32Array(m.count),s=new P;for(let a=0;a<m.count;a++)i[a]=n(s.fromBufferAttribute(m,a));return o.setAttribute("aShade",new bt(i,1)),o}function gt(e,n,o,m,i=1,s=1){let a=new Zt(e,i);a.deleteAttribute("uv"),a=zt(a);const l=a.getAttribute("position"),h=a.getAttribute("normal"),d=new P,r=ue(m),v=Array.from({length:5},()=>new P(r()-.5,r()-.5,r()-.5).normalize());for(let f=0;f<l.count;f++){d.fromBufferAttribute(l,f);const x=d.clone().normalize();let b=1;for(const H of v)b+=Math.max(0,x.dot(H))**4*.22;d.copy(x).multiplyScalar(e*b),d.y*=s,d.add(n),l.setXYZ(f,d.x,d.y,d.z);const A=d.clone().sub(o).normalize().multiplyScalar(.7).add(x.multiplyScalar(.3)).normalize();h.setXYZ(f,A.x,A.y,A.z)}return a}function jo(e){const n=ue(e*101+9);if(new P(0,1,0),e<3||e>=5){const r=e>=5,v=r?4.85:[8.5,10.5,7.5][e],f=r?2.75:v*.66,x=r?1.25:[2.6,2.1,3.2][e],b=r?1.2:[1.7,2.4,1.3][e],A=r?.55:1,H=r?[.15,.42]:[.16,.3],C=new xt(H[0],H[1],f+(r?.45:0),8,3);C.translate(0,(f+(r?.45:0))/2,0);const y=[0,1,2].map(F=>{const I=F/3*Math.PI*2+n(),j=new xt(.07,.13,x*1.1,6);return j.translate(0,x*.55,0),j.applyMatrix4(new yt().makeRotationFromEuler(new Nt(Math.cos(I)*.8,0,Math.sin(I)*.8))),j.translate(0,f*.8,0),j}),p=be(Xe([C,...y].map(F=>(F.deleteAttribute("uv"),F))),F=>.55+.45*Math.min(1,F.y/f)),z=new P(0,f+b*.6,0),W=[],E=r?5:7+Math.floor(n()*3);for(let F=0;F<E;F++){const I=F/E*Math.PI*2+n()*.5,j=(n()-.35)*b,T=x*(.55+n()*.35);W.push(gt((1.5+n()*.9)*A*(r?1.2:1),new P(Math.cos(I)*T,z.y+j,Math.sin(I)*T),z,e*31+F))}W.push(gt(2.2*A,new P(0,z.y+b*.75,0),z,e*31+99));const X=be(Xe(W),F=>{const I=F.clone().sub(z);return Math.min(1,.5+.35*(I.y/(b+2)+.6)+.25*Math.hypot(I.x,I.z)/(x+2))}),$=be(Xe([gt(x+1.3*A,z.clone(),z.clone().setY(z.y-1),e+500,0,(b+2*A)/(x+1.3*A))]),F=>.6+.4*Math.min(1,Math.max(0,(F.y-z.y+2)/4)));return{trunk:p,crown:X,far:$,radius:r?.32:.3}}const o=e===3?13:10,m=[],i=new xt(.1,.32,o*.9,7,2);i.translate(0,o*.45,0),i.deleteAttribute("uv");for(let r=0;r<5;r++){const v=r/5,f=(e===3?2.6:3)*(1-v*.78),x=o*.34*(1-v*.35),b=o*(.18+v*.62);let A=new Lt(f,x,11,2);A.deleteAttribute("uv"),A=zt(A);const H=A.getAttribute("position"),C=A.getAttribute("normal"),y=new P;for(let p=0;p<H.count;p++){y.fromBufferAttribute(H,p);const z=Math.hypot(y.x,y.z),W=1+.12*Math.sin(Math.atan2(y.z,y.x)*5+r*2);H.setXYZ(p,y.x*W,y.y+x/2+b-z/f*.5,y.z*W);const E=new P(y.x,f*.9,y.z).normalize();C.setXYZ(p,E.x,E.y,E.z)}m.push(A)}const s=be(Xe(m),r=>.5+.5*Math.min(1,Math.hypot(r.x,r.z)/2.2*.6+r.y/o*.5));let a=new Lt(e===3?2.6:3,o*.9,6,1);a.deleteAttribute("uv"),a.translate(0,o*.55,0);const l=a.getAttribute("position"),h=a.getAttribute("normal"),d=new P;for(let r=0;r<l.count;r++){d.fromBufferAttribute(l,r);const v=new P(d.x,1.6,d.z).normalize();h.setXYZ(r,v.x,v.y,v.z)}return a=be(a,r=>.55+.45*Math.min(1,r.y/o)),{trunk:be(i,r=>.5+.5*Math.min(1,r.y/o)),crown:s,far:a,radius:.3}}function Oo(){let e=new Zt(1,1);e.deleteAttribute("uv"),e=zt(e);const n=e.getAttribute("position"),o=new P,m=ue(5);for(let i=0;i<n.count;i++)o.fromBufferAttribute(n,i),o.multiplyScalar(.8+m()*.35),n.setXYZ(i,o.x,o.y,o.z);return e=e.toNonIndexed(),e.computeVertexNormals(),be(e,i=>.55+.45*Math.min(1,Math.max(0,i.y+.6)))}export{Lo as C,Qo as H,qo as Q,ne as W,No as a,Jo as b,So as c,Ko as d,Xo as e,De as f,et as g,ce as h,J as i,Zo as p,ue as r,$o as s};
