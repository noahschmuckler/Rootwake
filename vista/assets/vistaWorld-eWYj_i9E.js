import{G as Et,a5 as Ie,ar as mt,as as ht,at as dt,au as _t,ab as Rt,av as Yt,aw as Ut,i as vt,ax as pt,C as ze,V as b,k as Lt,M as Ve,z as xt,_ as Qe,ai as wt,Z as yo,r as Xt,l as bo,I as jt,w as bt,Q as $t,x as Qt,ah as Vt,e as Mt,ay as Mo,az as zo,u as gt,n as ie,d as Ot,a4 as At,v as St,J as zt,aA as Ao,aB as So,j as Co,s as ko}from"./BufferGeometryUtils-DLVVVjgH.js";const Oe=2048,qt=513,Jt=Oe/(qt-1),ee=Oe/2,se=40,eo=300,To=200;function te(e){let r=e>>>0||1;return()=>{r=r+1831565813>>>0;let t=r;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function tt(e){const r=te(e),t=new Uint8Array(512),c=[...Array(256).keys()];for(let s=255;s>0;s--){const h=Math.floor(r()*(s+1));[c[s],c[h]]=[c[h],c[s]]}for(let s=0;s<512;s++)t[s]=c[s&255];const l=new Float32Array(256),i=new Float32Array(256);for(let s=0;s<256;s++){const h=r()*Math.PI*2;l[s]=Math.cos(h),i[s]=Math.sin(h)}const a=s=>s*s*s*(s*(s*6-15)+10);return(s,h)=>{const v=Math.floor(s),n=Math.floor(h),d=s-v,u=h-n,p=v&255,y=n&255,M=(W,X,L,H)=>{const D=t[W+t[X]];return l[D]*L+i[D]*H},T=M(p,y,d,u),z=M(p+1,y,d-1,u),w=M(p,y+1,d,u-1),x=M(p+1,y+1,d-1,u-1),S=a(d),P=a(u);return 1.41*((T+(z-T)*S)*(1-P)+(w+(x-w)*S)*P)}}function De(e,r,t,c,l=2,i=.5){let a=0,s=1,h=1,v=0;for(let n=0;n<c;n++)a+=e(r*h+n*17.3,t*h-n*9.1)*s,v+=s,s*=i,h*=l;return a/v}function Fo(e,r,t,c){let l=0,i=.5,a=1,s=1,h=0;for(let v=0;v<c;v++){let n=1-Math.abs(e(r*a+v*31.7,t*a+v*11.3));n*=n,n*=s,s=Math.min(1,n*1.6),l+=n*i,h+=i,i*=.5,a*=2.05}return l/h}const Ge=(e,r,t)=>{const c=Math.min(1,Math.max(0,(t-e)/(r-e)));return c*c*(3-2*c)},de={x:0,z:260,rx:230,rz:380};function ot(e){return 170*Math.sin(e*.0019+.6)+60*Math.sin(e*.0051)}function Ho(e){const r=tt(e*7+1),t=tt(e*7+2),c=tt(e*7+3);return{base:(i,a)=>{const s=i+140*De(t,i*.0011,a*.0011,3),h=a+140*De(t,i*.0011+40,a*.0011-30,3),v=Math.abs(s-ot(h)),n=Ge(110,760,v+90*De(c,i*.002,a*.002,2)),d=Fo(r,s*.0016,h*.0016,6),u=De(c,i*.004,a*.004,4)*16+De(c,i*.012,a*.012,3)*4,p=Math.exp(-(((i-ot(a)*.4-de.x)/de.rx)**2+((a-de.z)/de.rz)**2));return se+7+Math.max(0,(Math.abs(a)-500)*.02)+u*(1-n)+n**1.25*(80+520*d)+n*u*3-p*26},seed:e}}const Io={droplets:7e4,steps:64,radius:2,inertia:.06,capacity:6,minSlope:.01,erode:.35,deposit:.25,evaporate:.018,gravity:6,scale:20};function Jo(e=1,r={},t={}){const c=t.size??Oe,l=t.n??qt,i=c/(l-1),a=c/2,s=qe(),h=t.shape??Ho(e),v=new Float32Array(l*l);for(let x=0;x<l;x++)for(let S=0;S<l;S++)v[x*l+S]=h.base(S*i-a,x*i-a);const n=qe(),d=new Float32Array(l*l),u=new Float32Array(l*l),p={...Io,...r};p.scale*=i/Jt,Bo(v,d,u,e,p,l,i,t.erodeMask?(x,S)=>t.erodeMask(x*i-a,S*i-a):null);let y=0;for(let x=0;x<d.length;x++)d[x]=Math.log1p(d[x]),d[x]>y&&(y=d[x]);for(let x=0;x<d.length;x++)d[x]/=y||1;Nt(d,1,l),Nt(u,1,l);let M=0;for(const x of u)M=Math.max(M,x);for(let x=0;x<u.length;x++)u[x]=Math.min(1,u[x]/(M*.25||1));const T=qe(),z=Do(v,l,i,t.erodeMask?(x,S)=>t.erodeMask(x*i-a,S*i-a)>.005:null);let w=-1/0;for(const x of v)x>w&&(w=x);return{seed:e,shape:h,size:c,n:l,cell:i,half:a,ceiling:w+30,waterY:t.waterY??se,snowY:t.snowY??eo,surface:t.surface,h:v,flow:d,sediment:u,ao:z,ms:{shape:n-s,erosion:T-n,ao:qe()-T}}}function qe(){return typeof performance<"u"?performance.now():Date.now()}function Bo(e,r,t,c,l,i,a,s){const h=te(c*131+7),v=l.scale,n=l.radius,d=[],u=[];let p=0;for(let z=-n;z<=n;z++)for(let w=-n;w<=n;w++){const x=Math.hypot(w,z);if(x<=n){d.push(w,z);const S=1-x/n;u.push(S),p+=S}}for(let z=0;z<u.length;z++)u[z]/=p;const y=To/a,M=(z,w)=>Ge(0,y,Math.min(z,w,i-1-z,i-1-w)-n)*(s?s(z,w):1),T=z=>e[z]/v;for(let z=0;z<l.droplets;z++){let w=h()*(i-3)+1,x=h()*(i-3)+1,S=0,P=0,W=1,X=1,L=0;for(let H=0;s&&H<12&&s(Math.floor(w),Math.floor(x))<.05;H++)w=h()*(i-3)+1,x=h()*(i-3)+1;for(let H=0;H<l.steps;H++){const D=Math.floor(w),$=Math.floor(x),I=w-D,Z=x-$,K=$*i+D,Se=T(K),le=T(K+1),We=T(K+i),Ce=T(K+i+1),ke=(le-Se)*(1-Z)+(Ce-We)*Z,oe=(We-Se)*(1-I)+(Ce-le)*I,Ee=Se*(1-I)*(1-Z)+le*I*(1-Z)+We*(1-I)*Z+Ce*I*Z;S=S*l.inertia-ke*(1-l.inertia),P=P*l.inertia-oe*(1-l.inertia);const ve=Math.hypot(S,P);if(ve<1e-9||(S/=ve,P/=ve,w+=S,x+=P,w<1||x<1||w>=i-2||x>=i-2))break;const pe=Math.floor(w),Ze=Math.floor(x),Te=w-pe,xe=x-Ze,ae=Ze*i+pe,ce=T(ae)*(1-Te)*(1-xe)+T(ae+1)*Te*(1-xe)+T(ae+i)*(1-Te)*xe+T(ae+i+1)*Te*xe-Ee,ne=M(D,$);r[K]+=X*ne;const ue=Math.max(-ce,l.minSlope)*W*X*l.capacity;if(L>ue||ce>0){const fe=ce>0?Math.min(ce,L):(L-ue)*l.deposit;L-=fe;const O=fe*v*ne;e[K]+=O*(1-I)*(1-Z),e[K+1]+=O*I*(1-Z),e[K+i]+=O*(1-I)*Z,e[K+i+1]+=O*I*Z,t[K]+=fe*ne}else{const fe=Math.min((ue-L)*l.erode,-ce);for(let O=0;O<u.length;O++){const N=D+d[O*2],Fe=$+d[O*2+1];if(N<0||Fe<0||N>=i||Fe>=i)continue;const Ke=Fe*i+N,rt=Math.min(fe*u[O],e[Ke]/v)*ne;e[Ke]-=rt*v}L+=fe*ne}W=Math.sqrt(Math.max(0,W*W-ce*l.gravity)),X*=1-l.evaporate}}}function Nt(e,r,t){const c=new Float32Array(e.length);for(let l=0;l<r;l++){for(let i=0;i<t;i++)for(let a=0;a<t;a++){const s=i*t+a;c[s]=(e[s]*2+e[i*t+Math.max(0,a-1)]+e[i*t+Math.min(t-1,a+1)])/4}for(let i=0;i<t;i++)for(let a=0;a<t;a++){const s=i*t+a;e[s]=(c[s]*2+c[Math.max(0,i-1)*t+a]+c[Math.min(t-1,i+1)*t+a])/4}}}function Do(e,r,t,c){const l=new Float32Array(r*r),i=[2,6,16],a=8;for(let s=0;s<r;s++)for(let h=0;h<r;h++){const v=s*r+h;let n=0;if(c&&!c(h,s)){l[v]=1;continue}for(const d of i){let u=0;for(let p=0;p<a;p++){const y=p/a*Math.PI*2,M=Math.min(r-1,Math.max(0,Math.round(h+Math.cos(y)*d))),T=Math.min(r-1,Math.max(0,Math.round(s+Math.sin(y)*d)));u+=Math.max(0,e[T*r+M]-e[v])/(d*t)}n+=u/a}l[v]=Math.max(0,1-n*.9)}return l}function me(e,r,t){const{n:c,cell:l,half:i}=e,a=(r+i)/l,s=(t+i)/l;if(a<0||s<0||a>=c-1||s>=c-1)return e.shape.base(r,t);const h=Math.floor(a),v=Math.floor(s),n=a-h,d=s-v,u=v*c+h,p=e.h;return p[u]*(1-n)*(1-d)+p[u+1]*n*(1-d)+p[u+c]*(1-n)*d+p[u+c+1]*n*d}function to(e,r,t,c){const{n:l,cell:i,half:a}=e,s=Math.min(l-1,Math.max(0,Math.round((t+a)/i))),h=Math.min(l-1,Math.max(0,Math.round((c+a)/i)));return r[h*l+s]}function oo(e,r,t,c=e.cell,l=(i,a)=>me(e,i,a)){const i=l(r+c,t)-l(r-c,t),a=l(r,t+c)-l(r,t-c),s=-i,h=2*c,v=-a,n=Math.hypot(s,h,v);return[s/n,h/n,v/n]}function Go(e,r,t){return e.surface?e.surface(r,t):me(e,r,t)}function at(e,r,t){return 1-oo(e,r,t)[1]}function Zt(e,r,t=new Uint8Array(e.n*e.n),c=[0,e.n]){const{n:l,cell:i}=e,[a,s,h]=r,v=Math.hypot(a,h)||1e-6,n=s/v,d=a/v,u=h/v,p=e.h;if(s<=0)return t.fill(0,c[0]*l,c[1]*l),t;for(let y=c[0];y<c[1];y++)for(let M=0;M<l;M++){const T=p[y*l+M]+.5;let z=1,w=i*.75;for(let x=0;x<120&&z>0;x++){const S=M+d*w/i,P=y+u*w/i;if(S<0||P<0||S>=l-1||P>=l-1)break;const W=S|0,X=P|0,L=S-W,H=P-X,D=X*l+W,$=p[D]*(1-L)*(1-H)+p[D+1]*L*(1-H)+p[D+l]*(1-L)*H+p[D+l+1]*L*H,I=T+w*n;if(z=Math.min(z,(I-$)/(1.5+w*.02)*.5+.5),I>e.ceiling)break;w+=Math.max(i*.75,w*.06)}t[y*l+M]=Math.round(Math.min(1,Math.max(0,z))*255)}return t}const Je=7,Kt=150;function ea(e,r=9e3){const t=te(e.seed*977+3),c=tt(e.seed*13+5),l=[];for(let i=-ee+20;i<ee-20;i+=Je)for(let a=-ee+20;a<ee-20;a+=Je){const s=a+(t()-.5)*Je*.9,h=i+(t()-.5)*Je*.9,v=me(e,s,h);if(v<se+2.5||v>eo-30)continue;const n=at(e,s,h);if(n>.22)continue;const d=De(c,s*.0045,h*.0045,4)+.2*to(e,e.flow,s,h)-(v>Kt?0:.06),u=Ge(.02,.32,d)*(1-Ge(.12,.22,n));if(t()>u*.95+(t()<.004?1:0))continue;const p=v>Kt+(t()-.5)*60||d>.3&&t()<.25;if(l.push({x:s,z:h,y:v,kind:p?3+Math.floor(t()*2):Math.floor(t()*3),scale:.75+t()*.55,rot:t()*Math.PI*2}),l.length>=r)return l}return l}function ta(e,r=900){const t=te(e.seed*389+11),c=[];for(let l=0;l<r*30&&c.length<r;l++){const i=(t()-.5)*(Oe-60),a=(t()-.5)*(Oe-60),s=me(e,i,a),h=at(e,i,a);if(s<se-1.5)continue;const v=to(e,e.sediment,i,a),n=.02+.5*Ge(.1,.35,h)*(1-Ge(.5,.7,h))+.4*v;t()>n||c.push({x:i,z:a,y:s,scale:.4+t()**3*4.5,rot:t()*Math.PI*2,tilt:(t()-.5)*.5})}return c}function Po(e,r,t,c,l,i,a){const s=Math.hypot(l-r,a-c),h=Math.ceil(s/(Jt*2));for(let v=2;v<h-2;v++){const n=v/h;if(me(e,r+(l-r)*n,c+(a-c)*n)>t+(i-t)*n)return!1}return!0}const et=(e,r,t,c)=>Math.atan2(-(t-e),-(c-r));function oa(e){const r={x:de.x+ot(de.z)*.4,z:de.z},t=[];let c={x:0,z:0,y:-1/0};for(let n=-ee+120;n<ee-120;n+=16)for(let d=-ee+120;d<ee-120;d+=16){const u=me(e,d,n);u>c.y&&(c={x:d,z:n,y:u})}const l=n=>{let d={x:0,z:0},u=-1/0;for(let p=-ee+140;p<ee-140;p+=12)for(let y=-ee+140;y<ee-140;y+=12){const M=n(y,p,me(e,y,p));M>u&&(u=M,d={x:y,z:p})}return d},i=(n,d)=>{if(at(e,n,d)>.12)return!1;const u=me(e,n,d);return[[.3,0],[-.3,0],[0,.3],[0,-.3]].every(([p,y])=>Math.abs(me(e,n+p,d+y)-u)<.15)},a=l((n,d,u)=>u<se+.6||u>se+3||!i(n,d)?-1/0:-Math.abs(Math.hypot(n-r.x,d-r.z)-260)+(Math.hypot(n-c.x,d-c.z)>Math.hypot(r.x-c.x,r.z-c.z)?120:0));t.push({name:"Lakeshore",...a,yaw:et(a.x,a.z,r.x,r.z),pitch:.02});const s=l((n,d,u)=>!i(n,d)||u<se+3||Math.abs(n-ot(d))>120?-1/0:-Math.abs(d-(de.z-900))-at(e,n,d)*400);t.push({name:"Valley meadow",...s,yaw:et(s.x,s.z,r.x,r.z),pitch:.04});const h=l((n,d,u)=>{if(u<se+140||u>se+280||!i(n,d))return-1/0;const p=Math.hypot(n-r.x,d-r.z);return p<450||p>900?-1/0:Po(e,n,u+2,d,r.x,se,r.z)?1e3-p:-1/0});t.push({name:"Ridge over the lake",...h,yaw:et(h.x,h.z,r.x,r.z),pitch:-.12});const v=l((n,d,u)=>i(n,d)?u:-1/0);return t.push({name:"Summit",...v,yaw:et(v.x,v.z,r.x,r.z),pitch:-.1}),t}const Ae=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,Pe=`
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
`,nt=`
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
`,Ct=`
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
`,ao=`
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
vec2 clearAt(vec2 xz){
  vec2 c = vec2(0.0), u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).rg);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).rg);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).rg);
  return c;
}
`,kt=`
#include <common>
#include <shadowmap_pars_vertex>
`,Tt=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Ne=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Wo=`
${kt}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,Eo=`
${Tt}
${Ae}${Pe}${nt}${Ct}${ao}
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
  ${Ne}
}`,_o=`
${kt}
${Ae}${Pe}${nt}${Ct}${ao}
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
}`,Ro=`
${Tt}
${Ae}${Pe}
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
  ${Ne}
}`,Yo=`
${kt}
${Ae}
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
}`,Uo=`
${Tt}
${Ae}${Pe}${nt}
#ifdef ROCK
${Ct}
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
  ${Ne}
}`,Lo=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,jo=`
${Ae}${Pe}${nt}
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
  ${Ne}
}`,$o=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,Vo=`
${Ae}${Pe}
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
  ${Ne}
}`,aa=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function Oo(e){const r=Mt.degToRad(e.elevation),t=Mt.degToRad(e.azimuth);return new b(Math.sin(t)*Math.cos(r),Math.sin(r),-Math.cos(t)*Math.cos(r)).normalize()}const na=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],Be=(e,r=1)=>new ze(e).multiplyScalar(r),No=1;function ra(e,r,t,c,l,i={}){const{n:a,cell:s,half:h,size:v}=r,n=new Et;n.name="vista",e.add(n),e=n;const d=a>600?2:1,u=(a-1)/d+1,p=new Uint8Array(a*a*4),y=new Uint8Array(u*u),M=new Uint8Array(u*u),T=d===1?r:{...r,n:u,cell:s*d,h:(()=>{const o=new Float32Array(u*u);for(let f=0;f<u;f++)for(let m=0;m<u;m++)o[f*u+m]=r.h[f*d*a+m*d];return o})()},z=new Ie(y,u,u,mt,ht);z.magFilter=z.minFilter=dt,z.wrapS=z.wrapT=_t;const w=new Uint8Array(a*a*4);i.ground&&w.set(i.ground);const x=new Ie(w,a,a,Rt,ht);x.magFilter=x.minFilter=dt,x.needsUpdate=!0;const S=new Ie(new Uint8Array(4),1,1);S.needsUpdate=!0;const P=96,W=97,X=new Float32Array(W*W),L=new Ie(X,W,W,mt,Yt);L.magFilter=L.minFilter=Ut;let H=new vt(1e9,1e9);for(let o=0;o<a*a;o++)p[o*4+1]=Math.round(r.ao[o]*255),p[o*4+2]=Math.round(r.flow[o]*255),p[o*4+3]=Math.round(r.sediment[o]*255);const D=new Ie(p,a,a,Rt,ht);D.magFilter=D.minFilter=dt,D.wrapS=D.wrapT=_t;const $=new Ie(new Float32Array(r.h),a,a,mt,Yt);$.magFilter=$.minFilter=Ut,$.needsUpdate=!0;const I={uSunDir:{value:new b(0,1,0)},uSunCol:{value:new ze},uZenith:{value:new ze},uHorizon:{value:new ze},uAmbSky:{value:new ze},uAmbGround:{value:new ze},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:i.hazeBase??r.waterY},uTime:{value:0},uMapData:{value:D},uSunTex:{value:z},uGround:{value:x},uHeight:{value:$},uMapHalf:{value:h},uCell:{value:s},uN:{value:a},uSunN:{value:u},uWaterY:{value:Number.isFinite(r.waterY)?r.waterY:-1e4},uSnowY:{value:r.snowY},uGloom:{value:new pt(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},Z=(o,f,m={},g={})=>{const F={...Mo.merge([zo.lights]),...I,...m};return new wt({uniforms:F,vertexShader:o,fragmentShader:f,lights:!0,defines:g})},K=16,Se=(a-1)/K,le=Se*s,We=110,Ce=r.surface&&i.fineLod?[.5,1,2,4,8]:[1,2,4,8],ke={uClear0:{value:S},uClear1:{value:S},uClear2:{value:S},uClearAt:{value:[new b(0,0,.001),new b(0,0,.001),new b(0,0,.001)]}},oe=Z(Wo,Eo,{uSoil:{value:new pt(0,0,0,0)},...ke});oe.side=Lt;const Ee=(o,f)=>Go(r,o,f),ve=new Et;ve.name="terrain",e.add(ve);const pe=[];function Ze(o,f,m){const g=Se/m,F=o*le-h,_=f*le-h,k=m*s,j=4+m*3,U=(g+1)*(g+1),C=new Float32Array((U+4*g)*3),R=new Float32Array((U+4*g)*3),Q=[];for(let A=0;A<=g;A++)for(let E=0;E<=g;E++){const G=F+E*k,q=_+A*k,V=(A*(g+1)+E)*3,Me=oo(r,G,q,Math.max(r.surface?1:s,k*.75),Ee);C[V]=G,C[V+1]=Ee(G,q),C[V+2]=q,R[V]=Me[0],R[V+1]=Me[1],R[V+2]=Me[2]}for(let A=0;A<g;A++)for(let E=0;E<g;E++){const G=A*(g+1)+E,q=G+1,V=G+g+1,Me=V+1;Q.push(G,V,q,q,V,Me)}const B=[];for(let A=0;A<g;A++)B.push(A);for(let A=0;A<g;A++)B.push(A*(g+1)+g);for(let A=g;A>0;A--)B.push(g*(g+1)+A);for(let A=g;A>0;A--)B.push(A*(g+1));B.forEach((A,E)=>{const G=(U+E)*3;C[G]=C[A*3],C[G+1]=C[A*3+1]-j,C[G+2]=C[A*3+2],R[G]=R[A*3],R[G+1]=R[A*3+1],R[G+2]=R[A*3+2]});for(let A=0;A<B.length;A++){const E=B[A],G=B[(A+1)%B.length],q=U+A,V=U+(A+1)%B.length;Q.push(E,q,G,G,q,V)}const Y=new xt;return Y.setAttribute("position",new zt(C,3)),Y.setAttribute("normal",new zt(R,3)),Y.setIndex(Q),Y.computeBoundingSphere(),Y}for(let o=0;o<K;o++)for(let f=0;f<K;f++){const m={mesh:new Ve(void 0,oe),lod:-1,geos:[],cx:(f+.5)*le-h,cz:(o+.5)*le-h};m.mesh.receiveShadow=!0,m.mesh.matrixAutoUpdate=!1,m.mesh.userData={ti:f,tj:o},ve.add(m.mesh),pe.push(m)}function Te(o){var _;const[f,m,g]=ye.lod,F=Ce.length>4?1:0;for(const k of pe){const j=Math.max(0,Math.hypot(k.cx-o.x,k.cz-o.z)-le*.7),U=(F&&j<We?-1:j<f?0:j<m?1:j<g?2:3)+F;if(U!==k.lod){k.lod=U,(_=k.geos)[U]??(_[U]=Ze(k.mesh.userData.ti,k.mesh.userData.tj,Ce[U])),k.mesh.geometry=k.geos[U];for(let C=0;C<U-1;C++)k.geos[C]&&(k.geos[C].dispose(),k.geos[C]=void 0)}}}{const o=Math.max(7e3,h+4500),f=80,m=Math.round(2*o/f),g=[],F=[],_=[],k=h-f,j=new Int32Array((m+1)*(m+1)).fill(-1),U=(B,Y)=>{const A=-o+B*f,E=-o+Y*f;return!(A>=-k&&A+f<=k&&E>=-k&&E+f<=k)},C=(B,Y)=>{const A=Y*(m+1)+B;if(j[A]>=0)return j[A];const E=-o+B*f,G=-o+Y*f,q=Math.abs(E)<=h&&Math.abs(G)<=h,V=(wo,go)=>r.shape.base(wo,go),Me=V(E,G)-(q?6:0),He=f,Pt=-(V(E+He,G)-V(E-He,G)),Wt=-(V(E,G+He)-V(E,G-He)),ft=Math.hypot(Pt,2*He,Wt);return j[A]=g.length/3,g.push(E,Me,G),F.push(Pt/ft,2*He/ft,Wt/ft),j[A]};for(let B=0;B<m;B++)for(let Y=0;Y<m;Y++)if(U(Y,B)){const A=C(Y,B),E=C(Y+1,B),G=C(Y,B+1),q=C(Y+1,B+1);_.push(A,G,E,E,G,q)}const R=new xt;R.setAttribute("position",new Qe(g,3)),R.setAttribute("normal",new Qe(F,3)),R.setIndex(_),R.computeBoundingSphere();const Q=new Ve(R,oe);Q.name="far-ring",Q.frustumCulled=!1,e.add(Q)}const xe=new wt({uniforms:{...I,uCloud:{value:.5}},vertexShader:$o,fragmentShader:Vo,side:yo,depthWrite:!1}),ae=new Ve(new Xt(8e3,48,24),xe);ae.name="sky",ae.frustumCulled=!1,ae.renderOrder=-10,e.add(ae);const Ft=new wt({uniforms:{...I},vertexShader:Lo,fragmentShader:jo,transparent:!0,depthWrite:!1}),ce=new bo(v,v,8,8);ce.rotateX(-Math.PI/2);const ne=new Ve(ce,Ft);ne.position.y=r.waterY,ne.name="lake",ne.visible=Number.isFinite(r.waterY),e.add(ne);const ue=Z(_o,Ro,{uCenter:{value:new vt},uPatch:{value:60},uBladeH:{value:i.bladeH??.34},uBladeW:{value:.045},uWind:{value:new vt(.94,.34)},...ke,uFine:{value:L},uFineAt:{value:new pt(0,0,1,0)}});ue.side=Lt;const fe=3,O=new xt;{const o=[],f=[],m=[],g=te(3);for(let F=0;F<fe;F++){const _=F/fe*Math.PI*2+g()*.6,k=(g()-.5)*.12,j=(g()-.5)*.12,U=.65+g()*.55,C=o.length/3;for(const[R,Q]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])o.push(R,Q,0),f.push(_,k,j,U);m.push(C,C+1,C+2,C+2,C+1,C+3,C+2,C+3,C+4,C+4,C+3,C+5,C+4,C+5,C+6)}O.setAttribute("position",new Qe(o,3)),O.setAttribute("aTuft",new Qe(f,4)),O.setIndex(m)}let N=null,Fe=!0;const Ke=14;function rt(o,f){if(N&&(N.geometry.dispose(),e.remove(N),N=null),!o)return;const m=new Ao;m.index=O.index,m.setAttribute("position",O.getAttribute("position")),m.setAttribute("aTuft",O.getAttribute("aTuft"));const g=te(77),F=new Float32Array(o*4);for(let _=0;_<o;_++)F[_*4]=g()*f,F[_*4+1]=g()*f,F[_*4+2]=g(),F[_*4+3]=g()*Math.PI*2;m.setAttribute("aBlade",new So(F,4)),m.instanceCount=o,N=new Ve(m,ue),N.frustumCulled=!1,N.receiveShadow=!0,N.name="grass",e.add(N),ue.uniforms.uPatch.value=f}const Xe=(o,f)=>Z(Yo,Uo,{uColor:{value:o?Be(o):new ze}},f),no=Xe(null,{ROCK:""}),st=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e","#6e6a66","#4a1446"],ro=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a","#9d988f","#0c060e"],Ht=o=>o>=5&&o<9?{VARIED:""}:{},it=o=>o===9?{TWITCH:""}:o===10?{PULSE:""}:{},It=st.map((o,f)=>Xe(o,f>=9?it(f):{USE_SWAY:"",...Ht(f)})),so=st.map((o,f)=>Xe(o,{...Ht(f),...it(f)})),Bt=ro.map((o,f)=>Xe(o,it(f))),we=st.map((o,f)=>Zo(f)),_e=(o,f,m,g)=>{const F=new jt(o,f,Math.max(1,m));return F.count=0,F.frustumCulled=!1,F.castShadow=g,F.receiveShadow=!0,F.instanceMatrix.setUsage(Vt),e.add(F),F};let ge=[],Re=[],Ye=[],Ue=[],Le=[];function Dt(o){for(const f of[...Re,...Ye,...Ue,...Le])e.remove(f),f.dispose();ge=we.map((f,m)=>o.filter(g=>g.kind===m)),Re=we.map((f,m)=>_e(f.trunk,Bt[m],ge[m].length,!1)),Ye=we.map((f,m)=>_e(f.crown,It[m],ge[m].length,!1)),Ue=we.flatMap((f,m)=>[_e(f.trunk,Bt[m],ge[m].length,!0),_e(f.crown,It[m],ge[m].length,!0)]);for(const f of Ue)f.layers.set(No);Le=we.map((f,m)=>_e(f.far,so[m],ge[m].length,!1)),je.set(1e9,0,0)}const io=(o,f)=>o.frame?f.fromArray(o.frame):f.compose(new b(o.x,o.y-.15,o.z),new $t().setFromAxisAngle(new b(0,1,0),o.rot),new b(o.scale,o.scale,o.scale));let je=new b(1e9,0,0),lt=0,ct=[];const lo=i.treeReach??1400;function co(o){const f=new bt,m=(ye.nearTrees*(i.nearTreesScale??1))**2,g=(ye.shadow?ye.shadowBox*1.25+8:0)**2,F=lo**2;ct=[],lt=0,ge.forEach((_,k)=>{let j=0,U=0,C=0;const[R,Q]=[Ue[k*2],Ue[k*2+1]];for(const B of _){const Y=(B.x-o.x)**2+(B.z-o.z)**2;Y>F||(io(B,f),Y<m?(Re[k].setMatrixAt(j,f),Ye[k].setMatrixAt(j,f),j++,ct.push(B)):Le[k].setMatrixAt(U++,f),Y<g&&(R.setMatrixAt(C,f),Q.setMatrixAt(C,f),C++))}Re[k].count=Ye[k].count=j,Le[k].count=U,R.count=Q.count=C,lt+=j;for(const B of[Re[k],Ye[k],Le[k],R,Q])B.instanceMatrix.needsUpdate=!0}),je.copy(o)}Dt(t);const uo=650,re=new jt(Qo(),no,Math.max(1,c.length)),fo=c.map(o=>new bt().compose(new b(o.x,o.y-o.scale*.25,o.z),new $t().setFromEuler(new Qt(o.tilt,o.rot,o.tilt*.5)),new b(o.scale,o.scale*.7,o.scale*.9)));re.castShadow=!0,re.receiveShadow=!0,re.frustumCulled=!1,re.name="rocks",re.instanceMatrix.setUsage(Vt),re.count=0,e.add(re);function mo(o){let f=0;c.forEach((m,g)=>{(m.x-o.x)**2+(m.z-o.z)**2<uo**2&&re.setMatrixAt(f++,fo[g])}),re.count=f,re.instanceMatrix.needsUpdate=!0}let ye=l;function Gt(o){ye=o,rt(ye.grass,ye.patch);for(const f of pe)f.lod=-1;je.set(1e9,0,0)}Gt(l);let be=null,$e=0,ut=new b(0,-1,0);const ho=Math.ceil(u/90);function vo(o,f=!0){const m=Oo(o);I.uStars.value=o.stars??0,I.uSunDir.value.copy(m),I.uSunCol.value.copy(Be(o.sun).multiplyScalar(o.sunI)),I.uZenith.value.copy(Be(o.zenith)),I.uHorizon.value.copy(Be(o.horizon)),I.uAmbSky.value.copy(Be(o.ambSky).multiplyScalar(o.ambI)),I.uAmbGround.value.copy(Be(o.ambGround).multiplyScalar(o.ambI)),I.uHaze.value=o.haze,I.uHazeFall.value=o.hazeFall,xe.uniforms.uCloud.value=o.cloud,f?(Zt(T,[m.x,m.y,m.z],y),z.needsUpdate=!0,ut.copy(m),be=null):ut.angleTo(m)>Mt.degToRad(.8)&&!be&&(be=[m.x,m.y,m.z],$e=0)}function po(){if(!be)return;const o=Math.min(u,$e+ho);Zt(T,be,M,[$e,o]),$e=o,$e>=u&&(y.set(M),z.needsUpdate=!0,ut.set(...be),be=null)}function xo(o,f){if(!i.fine)return;const m=Math.round(o-P/2),g=Math.round(f-P/2),F=P/(W-1);for(let _=0;_<W;_++)for(let k=0;k<W;k++)X[_*W+k]=i.fine(m+k*F,g+_*F);L.needsUpdate=!0,H.set(o,f),ue.uniforms.uFineAt.value.set(m,g,P,W)}return{root:n,setHour:vo,setQuality:Gt,setTrees:Dt,setGround(o){w.set(o),x.needsUpdate=!0},setSoil(o,f,m){oe.uniforms.uSoil.value.set(f,m,o,0);const g=o>.01;oe.transparent!==g&&(oe.transparent=g,oe.needsUpdate=!0),oe.depthWrite=o<.5,Fe=o<.05},setGloom(o,f,m){I.uGloom.value.set(o.r,o.g,o.b,f),I.uGloomD.value=m},setClear(o,f,m,g,F){ke[`uClear${o}`].value=f??S,ke.uClearAt.value[o].set(m,g,f?F:.001)},update(o,f){const m=o.position;I.uTime.value=f,po(),i.fine&&Math.hypot(m.x-H.x,m.z-H.y)>P*.22&&xo(m.x,m.z),ae.position.copy(m),Te(m),ue.uniforms.uCenter.value.set(m.x,m.z),N&&(N.visible=Fe&&m.y-Ee(m.x,m.z)<Ke),Math.hypot(m.x-je.x,m.z-je.z)>12&&(co(m),mo(m))},colliders(){return ct.map(o=>({x:o.x,z:o.z,radius:we[o.kind].radius*o.scale,cameraClearance:we[o.kind].radius*o.scale+.3}))},sunAt(o,f){const m=s*d,g=Math.round((o+h)/m),F=Math.round((f+h)/m);return g<0||F<0||g>=u||F>=u?1:y[F*u+g]/255},stats:()=>({tiles:pe.length,nearTrees:lt})}}function J(e,r){const t=e;for(const a of Object.keys(t.attributes))a!=="position"&&a!=="normal"&&t.deleteAttribute(a);const c=t.getAttribute("position"),l=new Float32Array(c.count),i=new b;for(let a=0;a<c.count;a++)l[a]=r(i.fromBufferAttribute(c,a));return t.setAttribute("aShade",new zt(l,1)),t}function yt(e,r,t,c,l=1,i=1){let a=new St(e,l);a.deleteAttribute("uv"),a=At(a);const s=a.getAttribute("position"),h=a.getAttribute("normal"),v=new b,n=te(c),d=Array.from({length:5},()=>new b(n()-.5,n()-.5,n()-.5).normalize());for(let u=0;u<s.count;u++){v.fromBufferAttribute(s,u);const p=v.clone().normalize();let y=1;for(const T of d)y+=Math.max(0,p.dot(T))**4*.22;v.copy(p).multiplyScalar(e*y),v.y*=i,v.add(r),s.setXYZ(u,v.x,v.y,v.z);const M=v.clone().sub(t).normalize().multiplyScalar(.7).add(p.multiplyScalar(.3)).normalize();h.setXYZ(u,M.x,M.y,M.z)}return a}function Zo(e){if(e===9)return Ko();if(e===10)return Xo();const r=te(e*101+9);if(new b(0,1,0),e<3||e>=5){const n=e>=5,d=n?4.85:[8.5,10.5,7.5][e],u=n?2.75:d*.66,p=n?1.25:[2.6,2.1,3.2][e],y=n?1.2:[1.7,2.4,1.3][e],M=n?.55:1,T=n?[.15,.42]:[.16,.3],z=new gt(T[0],T[1],u+(n?.45:0),8,3);z.translate(0,(u+(n?.45:0))/2,0);const w=[0,1,2].map(H=>{const D=H/3*Math.PI*2+r(),$=new gt(.07,.13,p*1.1,6);return $.translate(0,p*.55,0),$.applyMatrix4(new bt().makeRotationFromEuler(new Qt(Math.cos(D)*.8,0,Math.sin(D)*.8))),$.translate(0,u*.8,0),$}),x=J(ie([z,...w].map(H=>(H.deleteAttribute("uv"),H))),H=>.55+.45*Math.min(1,H.y/u)),S=new b(0,u+y*.6,0),P=[],W=n?5:7+Math.floor(r()*3);for(let H=0;H<W;H++){const D=H/W*Math.PI*2+r()*.5,$=(r()-.35)*y,I=p*(.55+r()*.35);P.push(yt((1.5+r()*.9)*M*(n?1.2:1),new b(Math.cos(D)*I,S.y+$,Math.sin(D)*I),S,e*31+H))}P.push(yt(2.2*M,new b(0,S.y+y*.75,0),S,e*31+99));const X=J(ie(P),H=>{const D=H.clone().sub(S);return Math.min(1,.5+.35*(D.y/(y+2)+.6)+.25*Math.hypot(D.x,D.z)/(p+2))}),L=J(ie([yt(p+1.3*M,S.clone(),S.clone().setY(S.y-1),e+500,0,(y+2*M)/(p+1.3*M))]),H=>.6+.4*Math.min(1,Math.max(0,(H.y-S.y+2)/4)));return{trunk:x,crown:X,far:L,radius:n?.32:.3}}const t=e===3?13:10,c=[],l=new gt(.1,.32,t*.9,7,2);l.translate(0,t*.45,0),l.deleteAttribute("uv");for(let n=0;n<5;n++){const d=n/5,u=(e===3?2.6:3)*(1-d*.78),p=t*.34*(1-d*.35),y=t*(.18+d*.62);let M=new Ot(u,p,11,2);M.deleteAttribute("uv"),M=At(M);const T=M.getAttribute("position"),z=M.getAttribute("normal"),w=new b;for(let x=0;x<T.count;x++){w.fromBufferAttribute(T,x);const S=Math.hypot(w.x,w.z),P=1+.12*Math.sin(Math.atan2(w.z,w.x)*5+n*2);T.setXYZ(x,w.x*P,w.y+p/2+y-S/u*.5,w.z*P);const W=new b(w.x,u*.9,w.z).normalize();z.setXYZ(x,W.x,W.y,W.z)}c.push(M)}const i=J(ie(c),n=>.5+.5*Math.min(1,Math.hypot(n.x,n.z)/2.2*.6+n.y/t*.5));let a=new Ot(e===3?2.6:3,t*.9,6,1);a.deleteAttribute("uv"),a.translate(0,t*.55,0);const s=a.getAttribute("position"),h=a.getAttribute("normal"),v=new b;for(let n=0;n<s.count;n++){v.fromBufferAttribute(s,n);const d=new b(v.x,1.6,v.z).normalize();h.setXYZ(n,d.x,d.y,d.z)}return a=J(a,n=>.55+.45*Math.min(1,n.y/t)),{trunk:J(l,n=>.5+.5*Math.min(1,n.y/t)),crown:i,far:a,radius:.3}}function he(e,r,t,c=8,l=5){const i=new Co(e),a=new ko(i,c,1,l,!1),s=a.getAttribute("position"),h=new b,v=new b;for(let n=0;n<=c;n++){const d=n/c,u=r+(t-r)*d;i.getPointAt(d,v);for(let p=0;p<=l;p++){const y=n*(l+1)+p;h.fromBufferAttribute(s,y).sub(v).multiplyScalar(u).add(v),s.setXYZ(y,h.x,h.y,h.z)}}return a.deleteAttribute("uv"),a.computeVertexNormals(),a}function Ko(){const e=te(9091),r=[],t=[],c=4.6;r.push(he([new b(0,-.2,0),new b(.05,c*.4,.03),new b(-.04,c*.75,.02),new b(.02,c,0)],.36,.08,8,7));for(let s=0;s<6;s++){const h=s/6*Math.PI*2+e()*.6,v=c*(.45+e()*.45),n=1.4+e()*1.4,d=new b(Math.cos(h),.55+e()*.5,Math.sin(h)).normalize(),u=new b(0,v,0),p=u.clone().addScaledVector(d,n*.5).add(new b((e()-.5)*.4,-.1,(e()-.5)*.4)),y=u.clone().addScaledVector(d,n);r.push(he([u,p,y],.09,.03,5,4));for(let M=0;M<3;M++){const T=2*Math.PI*e(),z=p.clone().lerp(y,e()),w=z.clone().add(new b(Math.cos(T)*.6,.35+e()*.4,Math.sin(T)*.6)),x=w.clone().add(new b(Math.cos(T+.9)*.3,.25,Math.sin(T+.9)*.3));t.push(he([z,w,x],.03,.008,3,3))}}const l=J(ie(r),s=>.5+.5*Math.min(1,s.y/c)),i=J(ie(t),()=>.85),a=J(ie([he([new b(0,0,0),new b(.1,c*.6,0),new b(0,c,0)],.32,.06,3,4),he([new b(0,c*.55,0),new b(1.2,c*.85,.3),new b(2,c*1.05,.5)],.1,.03,2,3),he([new b(0,c*.65,0),new b(-1,c*.9,-.5),new b(-1.6,c*1.15,-.8)],.1,.03,2,3)]),()=>.55);return{trunk:l,crown:i,far:a,radius:.3}}function Xo(){const e=te(1010),r=[],t=[],c=(s,h,v,n,d)=>{const u=new b(-h.z,0,h.x).normalize(),p=(e()-.5)*.8,y=s.clone().addScaledVector(h,v*.5).addScaledVector(u,p*v*.3),M=s.clone().addScaledVector(h,v).addScaledVector(u,p*v*.5);if(r.push(he([s,y,M],n,n*.62,5,5)),d===0){for(let z=0;z<3;z++){const w=new St(.22+e()*.16,0);w.translate(M.x+(e()-.5)*.5,M.y+(e()-.3)*.45,M.z+(e()-.5)*.5),t.push(w)}return}const T=2;for(let z=0;z<T;z++){const w=z/T*Math.PI*2+e(),x=h.clone().multiplyScalar(.7).add(new b(Math.cos(w)*.7,.15+e()*.3,Math.sin(w)*.7)).normalize();c(M,x,v*(.62+e()*.15),n*.6,d-1)}};c(new b(0,-.3,0),new b(0,1,0),3,.45,2);const l=J(ie(r),s=>.45+.55*Math.min(1,s.y/6)),i=J(ie(t),s=>.55+.45*Math.min(1,s.y/6)),a=ie([he([new b(0,-.3,0),new b(.3,2.5,0),new b(0,4.6,.2)],.45,.2,3,5),...[0,1,2].map(s=>{const h=s*2.1,v=new Xt(1.1,7,5);return v.deleteAttribute("uv"),v.translate(Math.cos(h)*1.2,4.6+s*.4,Math.sin(h)*1.2),v})]);return{trunk:l,crown:i,far:J(a,s=>.45+.55*Math.min(1,s.y/6)),radius:.42}}function Qo(){let e=new St(1,1);e.deleteAttribute("uv"),e=At(e);const r=e.getAttribute("position"),t=new b,c=te(5);for(let l=0;l<r.count;l++)t.fromBufferAttribute(r,l),t.multiplyScalar(.8+c()*.35),r.setXYZ(l,t.x,t.y,t.z);return e=e.toNonIndexed(),e.computeVertexNormals(),J(e,l=>.55+.45*Math.min(1,Math.max(0,l.y+.6)))}export{No as C,aa as H,na as Q,se as W,Jo as a,ra as b,Fo as c,ta as d,oa as e,De as f,tt as g,me as h,ee as i,ea as p,te as r,Oo as s};
