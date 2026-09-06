var Df=Object.defineProperty;var Uf=(i,t,e)=>t in i?Df(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var b=(i,t,e)=>Uf(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jc="169",Nf=0,Gl=1,Of=2,cd=1,Ff=2,Xn=3,xi=0,$e=1,Ue=2,gi=0,Ms=1,Zn=2,Vl=3,Wl=4,Bf=5,zi=100,zf=101,kf=102,Hf=103,Gf=104,Vf=200,Wf=201,Xf=202,Yf=203,Ka=204,Za=205,qf=206,$f=207,jf=208,Kf=209,Zf=210,Jf=211,Qf=212,tp=213,ep=214,Ja=0,Qa=1,tc=2,bs=3,ec=4,nc=5,ic=6,sc=7,ld=0,np=1,ip=2,_i=0,hd=1,sp=2,rp=3,op=4,ap=5,cp=6,lp=7,ud=300,Ts=301,As=302,rc=303,oc=304,Fo=306,ac=1e3,Gi=1001,cc=1002,_n=1003,hp=1004,Er=1005,An=1006,Zo=1007,Vi=1008,Jn=1009,dd=1010,fd=1011,hr=1012,Qc=1013,$i=1014,$n=1015,pr=1016,tl=1017,el=1018,Rs=1020,pd=35902,md=1021,gd=1022,Cn=1023,_d=1024,vd=1025,ys=1026,Cs=1027,xd=1028,nl=1029,Md=1030,il=1031,sl=1033,fo=33776,po=33777,mo=33778,go=33779,lc=35840,hc=35841,uc=35842,dc=35843,fc=36196,pc=37492,mc=37496,gc=37808,_c=37809,vc=37810,xc=37811,Mc=37812,yc=37813,Sc=37814,Ec=37815,wc=37816,bc=37817,Tc=37818,Ac=37819,Rc=37820,Cc=37821,_o=36492,Pc=36494,Lc=36495,yd=36283,Ic=36284,Dc=36285,Uc=36286,up=3200,dp=3201,Sd=0,fp=1,pi="",bn="srgb",yi="srgb-linear",rl="display-p3",Bo="display-p3-linear",Eo="linear",ge="srgb",wo="rec709",bo="p3",Ji=7680,Xl=519,pp=512,mp=513,gp=514,Ed=515,_p=516,vp=517,xp=518,Mp=519,Nc=35044,Yl="300 es",jn=2e3,To=2001;class Us{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ql=1234567;const Ss=Math.PI/180,ur=180/Math.PI;function Kn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function Re(i,t,e){return Math.max(t,Math.min(e,i))}function ol(i,t){return(i%t+t)%t}function yp(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Sp(i,t,e){return i!==t?(e-i)/(t-i):0}function ir(i,t,e){return(1-e)*i+e*t}function Ep(i,t,e,n){return ir(i,t,1-Math.exp(-e*n))}function wp(i,t=1){return t-Math.abs(ol(i,t*2)-t)}function bp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Tp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ap(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Rp(i,t){return i+Math.random()*(t-i)}function Cp(i){return i*(.5-Math.random())}function Pp(i){i!==void 0&&(ql=i);let t=ql+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lp(i){return i*Ss}function Ip(i){return i*ur}function Dp(i){return(i&i-1)===0&&i!==0}function Up(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Np(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Op(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*f,a*l);break;case"YXY":i.set(c*f,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function se(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ue={DEG2RAD:Ss,RAD2DEG:ur,generateUUID:Kn,clamp:Re,euclideanModulo:ol,mapLinear:yp,inverseLerp:Sp,lerp:ir,damp:Ep,pingpong:wp,smoothstep:bp,smootherstep:Tp,randInt:Ap,randFloat:Rp,randFloatSpread:Cp,seededRandom:Pp,degToRad:Lp,radToDeg:Ip,isPowerOfTwo:Dp,ceilPowerOfTwo:Up,floorPowerOfTwo:Np,setQuaternionFromProperEuler:Op,normalize:se,denormalize:Rn};class st{constructor(t=0,e=0){st.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ot{constructor(t,e,n,s,r,o,a,c,l){Ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],S=s[1],x=s[4],y=s[7],I=s[2],C=s[5],A=s[8];return r[0]=o*v+a*S+c*I,r[3]=o*m+a*x+c*C,r[6]=o*p+a*y+c*A,r[1]=l*v+h*S+u*I,r[4]=l*m+h*x+u*C,r[7]=l*p+h*y+u*A,r[2]=d*v+f*S+g*I,r[5]=d*m+f*x+g*C,r[8]=d*p+f*y+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Jo.makeScale(t,e)),this}rotate(t){return this.premultiply(Jo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Jo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Jo=new Ot;function wd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ao(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fp(){const i=Ao("canvas");return i.style.display="block",i}const $l={};function vo(i){i in $l||($l[i]=!0,console.warn(i))}function Bp(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function zp(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function kp(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const jl=new Ot().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Kl=new Ot().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),zs={[yi]:{transfer:Eo,primaries:wo,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[bn]:{transfer:ge,primaries:wo,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Bo]:{transfer:Eo,primaries:bo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Kl),fromReference:i=>i.applyMatrix3(jl)},[rl]:{transfer:ge,primaries:bo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Kl),fromReference:i=>i.applyMatrix3(jl).convertLinearToSRGB()}},Hp=new Set([yi,Bo]),te={enabled:!0,_workingColorSpace:yi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Hp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=zs[t].toReference,s=zs[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return zs[i].primaries},getTransfer:function(i){return i===pi?Eo:zs[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(zs[t].luminanceCoefficients)}};function Es(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Qi;class Gp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Qi===void 0&&(Qi=Ao("canvas")),Qi.width=t.width,Qi.height=t.height;const n=Qi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ao("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Es(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Es(e[n]/255)*255):e[n]=Es(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Vp=0;class bd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=Kn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ta(s[o].image)):r.push(ta(s[o]))}else r=ta(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wp=0;class je extends Us{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=Gi,s=Gi,r=An,o=Vi,a=Cn,c=Jn,l=je.DEFAULT_ANISOTROPY,h=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wp++}),this.uuid=Kn(),this.name="",this.source=new bd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ud)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ac:t.x=t.x-Math.floor(t.x);break;case Gi:t.x=t.x<0?0:1;break;case cc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ac:t.y=t.y-Math.floor(t.y);break;case Gi:t.y=t.y<0?0:1;break;case cc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=ud;je.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,I=(p+1)/2,C=(h+d)/4,A=(u+v)/4,P=(g+m)/4;return x>y&&x>I?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=C/n,r=A/n):y>I?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=C/s,r=P/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=A/r,s=P/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xp extends Us{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:An,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new je(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new bd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ji extends Xp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Td extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Yp extends je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=Gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Si{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-a;const p=c*d+l*f+h*g+u*v,S=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const I=Math.sqrt(x),C=Math.atan2(I,p*S);m=Math.sin(m*C)/I,a=Math.sin(a*C)/I}const y=a*S;if(c=c*m+d*y,l=l*m+f*y,h=h*m+g*y,u=u*m+v*y,m===1-a){const I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-a*f,t[e+2]=l*g+h*f+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Re(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class T{constructor(t=0,e=0,n=0){T.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ea.copy(this).projectOnVector(t),this.sub(ea)}reflect(t){return this.sub(ea.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ea=new T,Zl=new Si;class mr{constructor(t=new T(1/0,1/0,1/0),e=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Sn):Sn.fromBufferAttribute(r,o),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),wr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),wr.copy(n.boundingBox)),wr.applyMatrix4(t.matrixWorld),this.union(wr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ks),br.subVectors(this.max,ks),ts.subVectors(t.a,ks),es.subVectors(t.b,ks),ns.subVectors(t.c,ks),ii.subVectors(es,ts),si.subVectors(ns,es),Ri.subVectors(ts,ns);let e=[0,-ii.z,ii.y,0,-si.z,si.y,0,-Ri.z,Ri.y,ii.z,0,-ii.x,si.z,0,-si.x,Ri.z,0,-Ri.x,-ii.y,ii.x,0,-si.y,si.x,0,-Ri.y,Ri.x,0];return!na(e,ts,es,ns,br)||(e=[1,0,0,0,1,0,0,0,1],!na(e,ts,es,ns,br))?!1:(Tr.crossVectors(ii,si),e=[Tr.x,Tr.y,Tr.z],na(e,ts,es,ns,br))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(kn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const kn=[new T,new T,new T,new T,new T,new T,new T,new T],Sn=new T,wr=new mr,ts=new T,es=new T,ns=new T,ii=new T,si=new T,Ri=new T,ks=new T,br=new T,Tr=new T,Ci=new T;function na(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ci.fromArray(i,r);const a=s.x*Math.abs(Ci.x)+s.y*Math.abs(Ci.y)+s.z*Math.abs(Ci.z),c=t.dot(Ci),l=e.dot(Ci),h=n.dot(Ci);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const qp=new mr,Hs=new T,ia=new T;class gr{constructor(t=new T,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):qp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Hs.subVectors(t,this.center);const e=Hs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Hs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ia.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Hs.copy(t.center).add(ia)),this.expandByPoint(Hs.copy(t.center).sub(ia))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Hn=new T,sa=new T,Ar=new T,ri=new T,ra=new T,Rr=new T,oa=new T;class zo{constructor(t=new T,e=new T(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Hn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Hn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Hn.copy(this.origin).addScaledVector(this.direction,e),Hn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){sa.copy(t).add(e).multiplyScalar(.5),Ar.copy(e).sub(t).normalize(),ri.copy(this.origin).sub(sa);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ar),a=ri.dot(this.direction),c=-ri.dot(Ar),l=ri.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(sa).addScaledVector(Ar,d),f}intersectSphere(t,e){Hn.subVectors(t.center,this.origin);const n=Hn.dot(this.direction),s=Hn.dot(Hn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Hn)!==null}intersectTriangle(t,e,n,s,r){ra.subVectors(e,t),Rr.subVectors(n,t),oa.crossVectors(ra,Rr);let o=this.direction.dot(oa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ri.subVectors(this.origin,t);const c=a*this.direction.dot(Rr.crossVectors(ri,Rr));if(c<0)return null;const l=a*this.direction.dot(ra.cross(ri));if(l<0||c+l>o)return null;const h=-a*ri.dot(oa);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zt{constructor(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){Zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m)}set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/is.setFromMatrixColumn(t,0).length(),r=1/is.setFromMatrixColumn(t,1).length(),o=1/is.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-a*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*a,e[4]=g*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose($p,t,jp)}lookAt(t,e,n){const s=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),oi.crossVectors(n,an),oi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),oi.crossVectors(n,an)),oi.normalize(),Cr.crossVectors(an,oi),s[0]=oi.x,s[4]=Cr.x,s[8]=an.x,s[1]=oi.y,s[5]=Cr.y,s[9]=an.y,s[2]=oi.z,s[6]=Cr.z,s[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],S=n[3],x=n[7],y=n[11],I=n[15],C=s[0],A=s[4],P=s[8],H=s[12],_=s[1],w=s[5],z=s[9],k=s[13],X=s[2],K=s[6],G=s[10],Z=s[14],W=s[3],dt=s[7],ft=s[11],yt=s[15];return r[0]=o*C+a*_+c*X+l*W,r[4]=o*A+a*w+c*K+l*dt,r[8]=o*P+a*z+c*G+l*ft,r[12]=o*H+a*k+c*Z+l*yt,r[1]=h*C+u*_+d*X+f*W,r[5]=h*A+u*w+d*K+f*dt,r[9]=h*P+u*z+d*G+f*ft,r[13]=h*H+u*k+d*Z+f*yt,r[2]=g*C+v*_+m*X+p*W,r[6]=g*A+v*w+m*K+p*dt,r[10]=g*P+v*z+m*G+p*ft,r[14]=g*H+v*k+m*Z+p*yt,r[3]=S*C+x*_+y*X+I*W,r[7]=S*A+x*w+y*K+I*dt,r[11]=S*P+x*z+y*G+I*ft,r[15]=S*H+x*k+y*Z+I*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+v*(+e*c*f-e*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*d+s*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],S=u*m*l-v*d*l+v*c*f-a*m*f-u*c*p+a*d*p,x=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,y=h*v*l-g*u*l+g*a*f-o*v*f-h*a*p+o*u*p,I=g*u*c-h*v*c-g*a*d+o*v*d+h*a*m-o*u*m,C=e*S+n*x+s*y+r*I;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return t[0]=S*A,t[1]=(v*d*r-u*m*r-v*s*f+n*m*f+u*s*p-n*d*p)*A,t[2]=(a*m*r-v*c*r+v*s*l-n*m*l-a*s*p+n*c*p)*A,t[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*A,t[4]=x*A,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*A,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*A,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*f+e*c*f)*A,t[8]=y*A,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*A,t[10]=(o*v*r-g*a*r+g*n*l-e*v*l-o*n*p+e*a*p)*A,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*A,t[12]=I*A,t[13]=(h*v*s-g*u*s+g*n*d-e*v*d-h*n*m+e*u*m)*A,t[14]=(g*a*s-o*v*s-g*n*c+e*v*c+o*n*m-e*a*m)*A,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*d+e*a*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,S=c*l,x=c*h,y=c*u,I=n.x,C=n.y,A=n.z;return s[0]=(1-(v+p))*I,s[1]=(f+y)*I,s[2]=(g-x)*I,s[3]=0,s[4]=(f-y)*C,s[5]=(1-(d+p))*C,s[6]=(m+S)*C,s[7]=0,s[8]=(g+x)*A,s[9]=(m-S)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=is.set(s[0],s[1],s[2]).length();const o=is.set(s[4],s[5],s[6]).length(),a=is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],En.copy(this);const l=1/r,h=1/o,u=1/a;return En.elements[0]*=l,En.elements[1]*=l,En.elements[2]*=l,En.elements[4]*=h,En.elements[5]*=h,En.elements[6]*=h,En.elements[8]*=u,En.elements[9]*=u,En.elements[10]*=u,e.setFromRotationMatrix(En),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=jn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===jn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===To)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=jn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*l,f=(n+s)*h;let g,v;if(a===jn)g=(o+r)*u,v=-2*u;else if(a===To)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const is=new T,En=new Zt,$p=new T(0,0,0),jp=new T(1,1,1),oi=new T,Cr=new T,an=new T,Jl=new Zt,Ql=new Si;class nn{constructor(t=0,e=0,n=0,s=nn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Re(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Re(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Re(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ql.setFromEuler(this),this.setFromQuaternion(Ql,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}nn.DEFAULT_ORDER="XYZ";class al{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Kp=0;const th=new T,ss=new Si,Gn=new Zt,Pr=new T,Gs=new T,Zp=new T,Jp=new Si,eh=new T(1,0,0),nh=new T(0,1,0),ih=new T(0,0,1),sh={type:"added"},Qp={type:"removed"},rs={type:"childadded",child:null},aa={type:"childremoved",child:null};class we extends Us{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new T,e=new nn,n=new Si,s=new T(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Zt},normalMatrix:{value:new Ot}}),this.matrix=new Zt,this.matrixWorld=new Zt,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.multiply(ss),this}rotateOnWorldAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.premultiply(ss),this}rotateX(t){return this.rotateOnAxis(eh,t)}rotateY(t){return this.rotateOnAxis(nh,t)}rotateZ(t){return this.rotateOnAxis(ih,t)}translateOnAxis(t,e){return th.copy(t).applyQuaternion(this.quaternion),this.position.add(th.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(eh,t)}translateY(t){return this.translateOnAxis(nh,t)}translateZ(t){return this.translateOnAxis(ih,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Pr.copy(t):Pr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(Gs,Pr,this.up):Gn.lookAt(Pr,Gs,this.up),this.quaternion.setFromRotationMatrix(Gn),s&&(Gn.extractRotation(s.matrixWorld),ss.setFromRotationMatrix(Gn),this.quaternion.premultiply(ss.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(sh),rs.child=t,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Qp),aa.child=t,this.dispatchEvent(aa),aa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Gn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Gn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(sh),rs.child=t,this.dispatchEvent(rs),rs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,t,Zp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,Jp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}we.DEFAULT_UP=new T(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const wn=new T,Vn=new T,ca=new T,Wn=new T,os=new T,as=new T,rh=new T,la=new T,ha=new T,ua=new T,da=new le,fa=new le,pa=new le;class ln{constructor(t=new T,e=new T,n=new T){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),wn.subVectors(t,e),s.cross(wn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){wn.subVectors(s,e),Vn.subVectors(n,e),ca.subVectors(t,e);const o=wn.dot(wn),a=wn.dot(Vn),c=wn.dot(ca),l=Vn.dot(Vn),h=Vn.dot(ca),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Wn)===null?!1:Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Wn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Wn.x),c.addScaledVector(o,Wn.y),c.addScaledVector(a,Wn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return da.setScalar(0),fa.setScalar(0),pa.setScalar(0),da.fromBufferAttribute(t,e),fa.fromBufferAttribute(t,n),pa.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(da,r.x),o.addScaledVector(fa,r.y),o.addScaledVector(pa,r.z),o}static isFrontFacing(t,e,n,s){return wn.subVectors(n,e),Vn.subVectors(t,e),wn.cross(Vn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),wn.cross(Vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return ln.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;os.subVectors(s,n),as.subVectors(r,n),la.subVectors(t,n);const c=os.dot(la),l=as.dot(la);if(c<=0&&l<=0)return e.copy(n);ha.subVectors(t,s);const h=os.dot(ha),u=as.dot(ha);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(os,o);ua.subVectors(t,r);const f=os.dot(ua),g=as.dot(ua);if(g>=0&&f<=g)return e.copy(r);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(as,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return rh.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(rh,a);const p=1/(m+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(os,o).addScaledVector(as,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ad={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Lr={h:0,s:0,l:0};function ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=bn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=te.workingColorSpace){if(t=ol(t,1),e=Re(e,0,1),n=Re(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ma(o,r,t+1/3),this.g=ma(o,r,t),this.b=ma(o,r,t-1/3)}return te.toWorkingColorSpace(this,s),this}setStyle(t,e=bn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=bn){const n=Ad[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Es(t.r),this.g=Es(t.g),this.b=Es(t.b),this}copyLinearToSRGB(t){return this.r=Qo(t.r),this.g=Qo(t.g),this.b=Qo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=bn){return te.fromWorkingColorSpace(He.copy(this),t),Math.round(Re(He.r*255,0,255))*65536+Math.round(Re(He.g*255,0,255))*256+Math.round(Re(He.b*255,0,255))}getHexString(t=bn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.fromWorkingColorSpace(He.copy(this),e);const n=He.r,s=He.g,r=He.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=bn){te.fromWorkingColorSpace(He.copy(this),t);const e=He.r,n=He.g,s=He.b;return t!==bn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ai),this.setHSL(ai.h+t,ai.s+e,ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ai),t.getHSL(Lr);const n=ir(ai.h,Lr.h,e),s=ir(ai.s,Lr.s,e),r=ir(ai.l,Lr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const He=new bt;bt.NAMES=Ad;let tm=0;class Ei extends Us{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=Kn(),this.name="",this.type="Material",this.blending=Ms,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ka,this.blendDst=Za,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==xi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ka&&(n.blendSrc=this.blendSrc),this.blendDst!==Za&&(n.blendDst=this.blendDst),this.blendEquation!==zi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==bs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Xl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Pe extends Ei{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new nn,this.combine=ld,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new T,Ir=new st;class Ne{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Nc,this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ir.fromBufferAttribute(this,e),Ir.applyMatrix3(t),this.setXY(e,Ir.x,Ir.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array),r=se(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Nc&&(t.usage=this.usage),t}}class Rd extends Ne{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Cd extends Ne{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ft extends Ne{constructor(t,e,n){super(new Float32Array(t),e,n)}}let em=0;const pn=new Zt,ga=new we,cs=new T,cn=new mr,Vs=new mr,De=new T;class ee extends Us{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:em++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wd(t)?Cd:Rd)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return ga.lookAt(t),ga.updateMatrix(),this.applyMatrix4(ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ft(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];cn.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(t){const n=this.boundingSphere.center;if(cn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Vs.setFromBufferAttribute(a),this.morphTargetsRelative?(De.addVectors(cn.min,Vs.min),cn.expandByPoint(De),De.addVectors(cn.max,Vs.max),cn.expandByPoint(De)):(cn.expandByPoint(Vs.min),cn.expandByPoint(Vs.max))}cn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)De.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(De));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)De.fromBufferAttribute(a,l),c&&(cs.fromBufferAttribute(t,l),De.add(cs)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ne(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<n.count;P++)a[P]=new T,c[P]=new T;const l=new T,h=new T,u=new T,d=new st,f=new st,g=new st,v=new T,m=new T;function p(P,H,_){l.fromBufferAttribute(n,P),h.fromBufferAttribute(n,H),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,H),g.fromBufferAttribute(r,_),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const w=1/(f.x*g.y-g.x*f.y);isFinite(w)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(w),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(w),a[P].add(v),a[H].add(v),a[_].add(v),c[P].add(m),c[H].add(m),c[_].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let P=0,H=S.length;P<H;++P){const _=S[P],w=_.start,z=_.count;for(let k=w,X=w+z;k<X;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const x=new T,y=new T,I=new T,C=new T;function A(P){I.fromBufferAttribute(s,P),C.copy(I);const H=a[P];x.copy(H),x.sub(I.multiplyScalar(I.dot(H))).normalize(),y.crossVectors(C,H);const w=y.dot(c[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,w)}for(let P=0,H=S.length;P<H;++P){const _=S[P],w=_.start,z=_.count;for(let k=w,X=w+z;k<X;k+=3)A(t.getX(k+0)),A(t.getX(k+1)),A(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ne(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new T,r=new T,o=new T,a=new T,c=new T,l=new T,h=new T,u=new T;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new Ne(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ee,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const oh=new Zt,Pi=new zo,Dr=new gr,ah=new T,Ur=new T,Nr=new T,Or=new T,_a=new T,Fr=new T,ch=new T,Br=new T;class lt extends we{constructor(t=new ee,e=new Pe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Fr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(_a.fromBufferAttribute(u,t),o?Fr.addScaledVector(_a,h):Fr.addScaledVector(_a.sub(e),h))}e.add(Fr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Dr.copy(n.boundingSphere),Dr.applyMatrix4(r),Pi.copy(t.ray).recast(t.near),!(Dr.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Dr,ah)===null||Pi.origin.distanceToSquared(ah)>(t.far-t.near)**2))&&(oh.copy(r).invert(),Pi.copy(t.ray).applyMatrix4(oh),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Pi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,I=x;y<I;y+=3){const C=a.getX(y),A=a.getX(y+1),P=a.getX(y+2);s=zr(this,p,t,n,l,h,u,C,A,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);s=zr(this,o,t,n,l,h,u,S,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,I=x;y<I;y+=3){const C=y,A=y+1,P=y+2;s=zr(this,p,t,n,l,h,u,C,A,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=m,x=m+1,y=m+2;s=zr(this,o,t,n,l,h,u,S,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function nm(i,t,e,n,s,r,o,a){let c;if(t.side===$e?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===xi,a),c===null)return null;Br.copy(a),Br.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Br);return l<e.near||l>e.far?null:{distance:l,point:Br.clone(),object:i}}function zr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Ur),i.getVertexPosition(c,Nr),i.getVertexPosition(l,Or);const h=nm(i,t,e,n,Ur,Nr,Or,ch);if(h){const u=new T;ln.getBarycoord(ch,Ur,Nr,Or,u),s&&(h.uv=ln.getInterpolatedAttribute(s,a,c,l,u,new st)),r&&(h.uv1=ln.getInterpolatedAttribute(r,a,c,l,u,new st)),o&&(h.normal=ln.getInterpolatedAttribute(o,a,c,l,u,new T),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new T,materialIndex:0};ln.getNormal(Ur,Nr,Or,d.normal),h.face=d,h.barycoord=u}return h}class dn extends ee{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ft(l,3)),this.setAttribute("normal",new Ft(h,3)),this.setAttribute("uv",new Ft(u,2));function g(v,m,p,S,x,y,I,C,A,P,H){const _=y/A,w=I/P,z=y/2,k=I/2,X=C/2,K=A+1,G=P+1;let Z=0,W=0;const dt=new T;for(let ft=0;ft<G;ft++){const yt=ft*w-k;for(let $t=0;$t<K;$t++){const ne=$t*_-z;dt[v]=ne*S,dt[m]=yt*x,dt[p]=X,l.push(dt.x,dt.y,dt.z),dt[v]=0,dt[m]=0,dt[p]=C>0?1:-1,h.push(dt.x,dt.y,dt.z),u.push($t/A),u.push(1-ft/P),Z+=1}}for(let ft=0;ft<P;ft++)for(let yt=0;yt<A;yt++){const $t=d+yt+K*ft,ne=d+yt+K*(ft+1),Y=d+(yt+1)+K*(ft+1),Q=d+(yt+1)+K*ft;c.push($t,ne,Q),c.push(ne,Y,Q),W+=6}a.addGroup(f,W,H),f+=W,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ps(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function qe(i){const t={};for(let e=0;e<i.length;e++){const n=Ps(i[e]);for(const s in n)t[s]=n[s]}return t}function im(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Pd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}const sm={clone:Ps,merge:qe};var rm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,om=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Mi extends Ei{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rm,this.fragmentShader=om,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=im(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ld extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Zt,this.projectionMatrix=new Zt,this.projectionMatrixInverse=new Zt,this.coordinateSystem=jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ci=new T,lh=new st,hh=new st;class Qe extends Ld{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ur*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ss*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ur*2*Math.atan(Math.tan(Ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ci.x,ci.y).multiplyScalar(-t/ci.z),ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ci.x,ci.y).multiplyScalar(-t/ci.z)}getViewSize(t,e){return this.getViewBounds(t,lh,hh),e.subVectors(hh,lh)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ss*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ls=-90,hs=1;class am extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(ls,hs,t,e);s.layers=this.layers,this.add(s);const r=new Qe(ls,hs,t,e);r.layers=this.layers,this.add(r);const o=new Qe(ls,hs,t,e);o.layers=this.layers,this.add(o);const a=new Qe(ls,hs,t,e);a.layers=this.layers,this.add(a);const c=new Qe(ls,hs,t,e);c.layers=this.layers,this.add(c);const l=new Qe(ls,hs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===To)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Id extends je{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ts,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class cm extends ji{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Id(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:An}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new dn(5,5,5),r=new Mi({name:"CubemapFromEquirect",uniforms:Ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:gi});r.uniforms.tEquirect.value=e;const o=new lt(s,r),a=e.minFilter;return e.minFilter===Vi&&(e.minFilter=An),new am(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const va=new T,lm=new T,hm=new Ot;class di{constructor(t=new T(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=va.subVectors(n,e).cross(lm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(va),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||hm.getNormalMatrix(t),s=this.coplanarPoint(va).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new gr,kr=new T;class cl{constructor(t=new di,e=new di,n=new di,s=new di,r=new di,o=new di){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=jn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],v=s[10],m=s[11],p=s[12],S=s[13],x=s[14],y=s[15];if(n[0].setComponents(c-r,d-l,m-f,y-p).normalize(),n[1].setComponents(c+r,d+l,m+f,y+p).normalize(),n[2].setComponents(c+o,d+h,m+g,y+S).normalize(),n[3].setComponents(c-o,d-h,m-g,y-S).normalize(),n[4].setComponents(c-a,d-u,m-v,y-x).normalize(),e===jn)n[5].setComponents(c+a,d+u,m+v,y+x).normalize();else if(e===To)n[5].setComponents(a,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(t){return Li.center.set(0,0,0),Li.radius=.7071067811865476,Li.applyMatrix4(t.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(kr.x=s.normal.x>0?t.max.x:t.min.x,kr.y=s.normal.y>0?t.max.y:t.min.y,kr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(kr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Dd(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function um(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class Fn extends ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const S=p*d-o;for(let x=0;x<l;x++){const y=x*u-r;g.push(y,-S,0),v.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){const x=S+l*p,y=S+l*(p+1),I=S+1+l*(p+1),C=S+1+l*p;f.push(x,y,C),f.push(y,I,C)}this.setIndex(f),this.setAttribute("position",new Ft(g,3)),this.setAttribute("normal",new Ft(v,3)),this.setAttribute("uv",new Ft(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.width,t.height,t.widthSegments,t.heightSegments)}}var dm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,pm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_m=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ym=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Sm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Em=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Tm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Am=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Rm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Im=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Um=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Nm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Om=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Bm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,km=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vm=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Xm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ym=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,qm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$m=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,jm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Km=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,tg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,eg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ng=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ig=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,sg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,rg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,og=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ag=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,hg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ug=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,dg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,fg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_g=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Eg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ag=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Rg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Pg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Lg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ig=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ug=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ng=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Og=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Bg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,kg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Hg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,$g=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Kg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Zg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Jg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Qg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,t0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,e0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,n0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,i0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,s0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,r0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,o0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,a0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,c0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,l0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,h0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const u0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,d0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,p0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,g0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,v0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,x0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,M0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,y0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,S0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,b0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,T0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,C0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,P0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,L0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,I0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,D0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,U0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,O0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,B0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,k0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,H0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,G0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,V0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,W0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:dm,alphahash_pars_fragment:fm,alphamap_fragment:pm,alphamap_pars_fragment:mm,alphatest_fragment:gm,alphatest_pars_fragment:_m,aomap_fragment:vm,aomap_pars_fragment:xm,batching_pars_vertex:Mm,batching_vertex:ym,begin_vertex:Sm,beginnormal_vertex:Em,bsdfs:wm,iridescence_fragment:bm,bumpmap_pars_fragment:Tm,clipping_planes_fragment:Am,clipping_planes_pars_fragment:Rm,clipping_planes_pars_vertex:Cm,clipping_planes_vertex:Pm,color_fragment:Lm,color_pars_fragment:Im,color_pars_vertex:Dm,color_vertex:Um,common:Nm,cube_uv_reflection_fragment:Om,defaultnormal_vertex:Fm,displacementmap_pars_vertex:Bm,displacementmap_vertex:zm,emissivemap_fragment:km,emissivemap_pars_fragment:Hm,colorspace_fragment:Gm,colorspace_pars_fragment:Vm,envmap_fragment:Wm,envmap_common_pars_fragment:Xm,envmap_pars_fragment:Ym,envmap_pars_vertex:qm,envmap_physical_pars_fragment:sg,envmap_vertex:$m,fog_vertex:jm,fog_pars_vertex:Km,fog_fragment:Zm,fog_pars_fragment:Jm,gradientmap_pars_fragment:Qm,lightmap_pars_fragment:tg,lights_lambert_fragment:eg,lights_lambert_pars_fragment:ng,lights_pars_begin:ig,lights_toon_fragment:rg,lights_toon_pars_fragment:og,lights_phong_fragment:ag,lights_phong_pars_fragment:cg,lights_physical_fragment:lg,lights_physical_pars_fragment:hg,lights_fragment_begin:ug,lights_fragment_maps:dg,lights_fragment_end:fg,logdepthbuf_fragment:pg,logdepthbuf_pars_fragment:mg,logdepthbuf_pars_vertex:gg,logdepthbuf_vertex:_g,map_fragment:vg,map_pars_fragment:xg,map_particle_fragment:Mg,map_particle_pars_fragment:yg,metalnessmap_fragment:Sg,metalnessmap_pars_fragment:Eg,morphinstance_vertex:wg,morphcolor_vertex:bg,morphnormal_vertex:Tg,morphtarget_pars_vertex:Ag,morphtarget_vertex:Rg,normal_fragment_begin:Cg,normal_fragment_maps:Pg,normal_pars_fragment:Lg,normal_pars_vertex:Ig,normal_vertex:Dg,normalmap_pars_fragment:Ug,clearcoat_normal_fragment_begin:Ng,clearcoat_normal_fragment_maps:Og,clearcoat_pars_fragment:Fg,iridescence_pars_fragment:Bg,opaque_fragment:zg,packing:kg,premultiplied_alpha_fragment:Hg,project_vertex:Gg,dithering_fragment:Vg,dithering_pars_fragment:Wg,roughnessmap_fragment:Xg,roughnessmap_pars_fragment:Yg,shadowmap_pars_fragment:qg,shadowmap_pars_vertex:$g,shadowmap_vertex:jg,shadowmask_pars_fragment:Kg,skinbase_vertex:Zg,skinning_pars_vertex:Jg,skinning_vertex:Qg,skinnormal_vertex:t0,specularmap_fragment:e0,specularmap_pars_fragment:n0,tonemapping_fragment:i0,tonemapping_pars_fragment:s0,transmission_fragment:r0,transmission_pars_fragment:o0,uv_pars_fragment:a0,uv_pars_vertex:c0,uv_vertex:l0,worldpos_vertex:h0,background_vert:u0,background_frag:d0,backgroundCube_vert:f0,backgroundCube_frag:p0,cube_vert:m0,cube_frag:g0,depth_vert:_0,depth_frag:v0,distanceRGBA_vert:x0,distanceRGBA_frag:M0,equirect_vert:y0,equirect_frag:S0,linedashed_vert:E0,linedashed_frag:w0,meshbasic_vert:b0,meshbasic_frag:T0,meshlambert_vert:A0,meshlambert_frag:R0,meshmatcap_vert:C0,meshmatcap_frag:P0,meshnormal_vert:L0,meshnormal_frag:I0,meshphong_vert:D0,meshphong_frag:U0,meshphysical_vert:N0,meshphysical_frag:O0,meshtoon_vert:F0,meshtoon_frag:B0,points_vert:z0,points_frag:k0,shadow_vert:H0,shadow_frag:G0,sprite_vert:V0,sprite_frag:W0},it={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Nn={basic:{uniforms:qe([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:qe([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new bt(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:qe([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:qe([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:qe([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new bt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:qe([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:qe([it.points,it.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:qe([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:qe([it.common,it.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:qe([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:qe([it.sprite,it.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:qe([it.common,it.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:qe([it.lights,it.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};Nn.physical={uniforms:qe([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const Hr={r:0,b:0,g:0},Ii=new nn,X0=new Zt;function Y0(i,t,e,n,s,r,o){const a=new bt(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?e:t).get(x)),x}function v(S){let x=!1;const y=g(S);y===null?p(a,c):y&&y.isColor&&(p(y,1),x=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(S,x){const y=g(x);y&&(y.isCubeTexture||y.mapping===Fo)?(h===void 0&&(h=new lt(new dn(1,1,1),new Mi({name:"BackgroundCubeMaterial",uniforms:Ps(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ii.copy(x.backgroundRotation),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(X0.makeRotationFromEuler(Ii)),h.material.toneMapped=te.getTransfer(y.colorSpace)!==ge,(u!==y||d!==y.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new lt(new Fn(2,2),new Mi({name:"BackgroundMaterial",uniforms:Ps(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=te.getTransfer(y.colorSpace)!==ge,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,x){S.getRGB(Hr,Pd(i)),n.buffers.color.setClear(Hr.r,Hr.g,Hr.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,p(a,c)},render:v,addToRenderList:m}}function q0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(_,w,z,k,X){let K=!1;const G=u(k,z,w);r!==G&&(r=G,l(r.object)),K=f(_,k,z,X),K&&g(_,k,z,X),X!==null&&t.update(X,i.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,y(_,w,z,k),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,w,z){const k=z.wireframe===!0;let X=n[_.id];X===void 0&&(X={},n[_.id]=X);let K=X[w.id];K===void 0&&(K={},X[w.id]=K);let G=K[k];return G===void 0&&(G=d(c()),K[k]=G),G}function d(_){const w=[],z=[],k=[];for(let X=0;X<e;X++)w[X]=0,z[X]=0,k[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:z,attributeDivisors:k,object:_,attributes:{},index:null}}function f(_,w,z,k){const X=r.attributes,K=w.attributes;let G=0;const Z=z.getAttributes();for(const W in Z)if(Z[W].location>=0){const ft=X[W];let yt=K[W];if(yt===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(yt=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(yt=_.instanceColor)),ft===void 0||ft.attribute!==yt||yt&&ft.data!==yt.data)return!0;G++}return r.attributesNum!==G||r.index!==k}function g(_,w,z,k){const X={},K=w.attributes;let G=0;const Z=z.getAttributes();for(const W in Z)if(Z[W].location>=0){let ft=K[W];ft===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(ft=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(ft=_.instanceColor));const yt={};yt.attribute=ft,ft&&ft.data&&(yt.data=ft.data),X[W]=yt,G++}r.attributes=X,r.attributesNum=G,r.index=k}function v(){const _=r.newAttributes;for(let w=0,z=_.length;w<z;w++)_[w]=0}function m(_){p(_,0)}function p(_,w){const z=r.newAttributes,k=r.enabledAttributes,X=r.attributeDivisors;z[_]=1,k[_]===0&&(i.enableVertexAttribArray(_),k[_]=1),X[_]!==w&&(i.vertexAttribDivisor(_,w),X[_]=w)}function S(){const _=r.newAttributes,w=r.enabledAttributes;for(let z=0,k=w.length;z<k;z++)w[z]!==_[z]&&(i.disableVertexAttribArray(z),w[z]=0)}function x(_,w,z,k,X,K,G){G===!0?i.vertexAttribIPointer(_,w,z,X,K):i.vertexAttribPointer(_,w,z,k,X,K)}function y(_,w,z,k){v();const X=k.attributes,K=z.getAttributes(),G=w.defaultAttributeValues;for(const Z in K){const W=K[Z];if(W.location>=0){let dt=X[Z];if(dt===void 0&&(Z==="instanceMatrix"&&_.instanceMatrix&&(dt=_.instanceMatrix),Z==="instanceColor"&&_.instanceColor&&(dt=_.instanceColor)),dt!==void 0){const ft=dt.normalized,yt=dt.itemSize,$t=t.get(dt);if($t===void 0)continue;const ne=$t.buffer,Y=$t.type,Q=$t.bytesPerElement,xt=Y===i.INT||Y===i.UNSIGNED_INT||dt.gpuType===Qc;if(dt.isInterleavedBufferAttribute){const pt=dt.data,Dt=pt.stride,At=dt.offset;if(pt.isInstancedInterleavedBuffer){for(let Ht=0;Ht<W.locationSize;Ht++)p(W.location+Ht,pt.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let Ht=0;Ht<W.locationSize;Ht++)m(W.location+Ht);i.bindBuffer(i.ARRAY_BUFFER,ne);for(let Ht=0;Ht<W.locationSize;Ht++)x(W.location+Ht,yt/W.locationSize,Y,ft,Dt*Q,(At+yt/W.locationSize*Ht)*Q,xt)}else{if(dt.isInstancedBufferAttribute){for(let pt=0;pt<W.locationSize;pt++)p(W.location+pt,dt.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let pt=0;pt<W.locationSize;pt++)m(W.location+pt);i.bindBuffer(i.ARRAY_BUFFER,ne);for(let pt=0;pt<W.locationSize;pt++)x(W.location+pt,yt/W.locationSize,Y,ft,yt*Q,yt/W.locationSize*pt*Q,xt)}}else if(G!==void 0){const ft=G[Z];if(ft!==void 0)switch(ft.length){case 2:i.vertexAttrib2fv(W.location,ft);break;case 3:i.vertexAttrib3fv(W.location,ft);break;case 4:i.vertexAttrib4fv(W.location,ft);break;default:i.vertexAttrib1fv(W.location,ft)}}}}S()}function I(){P();for(const _ in n){const w=n[_];for(const z in w){const k=w[z];for(const X in k)h(k[X].object),delete k[X];delete w[z]}delete n[_]}}function C(_){if(n[_.id]===void 0)return;const w=n[_.id];for(const z in w){const k=w[z];for(const X in k)h(k[X].object),delete k[X];delete w[z]}delete n[_.id]}function A(_){for(const w in n){const z=n[w];if(z[_.id]===void 0)continue;const k=z[_.id];for(const X in k)h(k[X].object),delete k[X];delete z[_.id]}}function P(){H(),o=!0,r!==s&&(r=s,l(r.object))}function H(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:H,dispose:I,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function $0(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v];for(let v=0;v<d.length;v++)e.update(g,n,d[v])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function j0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Cn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const P=A===pr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Jn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==$n&&!P)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){const A=t.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:I,maxSamples:C}}function K0(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new di,a=new Ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const S=r?0:n,x=S*4;let y=p.clippingState||null;c.value=y,y=h(g,d,x,f);for(let I=0;I!==x;++I)y[I]=e[I];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(S,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Z0(i){let t=new WeakMap;function e(o,a){return a===rc?o.mapping=Ts:a===oc&&(o.mapping=As),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===rc||a===oc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new cm(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Ud extends Ld{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const xs=4,uh=[.125,.215,.35,.446,.526,.582],ki=20,xa=new Ud,dh=new bt;let Ma=null,ya=0,Sa=0,Ea=!1;const Fi=(1+Math.sqrt(5))/2,us=1/Fi,fh=[new T(-Fi,us,0),new T(Fi,us,0),new T(-us,0,Fi),new T(us,0,Fi),new T(0,Fi,-us),new T(0,Fi,us),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)];class ph{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ma=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),Ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_h(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ma,ya,Sa),this._renderer.xr.enabled=Ea,t.scissorTest=!1,Gr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ts||t.mapping===As?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ma=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),Ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:An,minFilter:An,generateMipmaps:!1,type:pr,format:Cn,colorSpace:yi,depthBuffer:!1},s=mh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=mh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=J0(r)),this._blurMaterial=Q0(r,t,e)}return s}_compileMaterial(t){const e=new lt(this._lodPlanes[0],t);this._renderer.compile(e,xa)}_sceneToCubeUV(t,e,n,s){const a=new Qe(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(dh),h.toneMapping=_i,h.autoClear=!1;const f=new Pe({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),g=new lt(new dn,f);let v=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,v=!0):(f.color.copy(dh),v=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):S===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const x=this._cubeSize;Gr(s,S*x,p>2?x:0,x,x),h.setRenderTarget(s),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ts||t.mapping===As;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_h()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new lt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Gr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,xa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=fh[(s-r-1)%fh.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new lt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ki-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):ki;m>ki&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ki}`);const p=[];let S=0;for(let A=0;A<ki;++A){const P=A/v,H=Math.exp(-P*P/2);p.push(H),A===0?S+=H:A<m&&(S+=2*H)}for(let A=0;A<p.length;A++)p[A]=p[A]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const y=this._sizeLods[s],I=3*y*(s>x-xs?s-x+xs:0),C=4*(this._cubeSize-y);Gr(e,I,C,3*y,2*y),c.setRenderTarget(e),c.render(u,xa)}}function J0(i){const t=[],e=[],n=[];let s=i;const r=i-xs+1+uh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-xs?c=uh[o-i+xs-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,S=new Float32Array(v*g*f),x=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let C=0;C<f;C++){const A=C%3*2/3-1,P=C>2?0:-1,H=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];S.set(H,v*g*C),x.set(d,m*g*C);const _=[C,C,C,C,C,C];y.set(_,p*g*C)}const I=new ee;I.setAttribute("position",new Ne(S,v)),I.setAttribute("uv",new Ne(x,m)),I.setAttribute("faceIndex",new Ne(y,p)),t.push(I),s>xs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function mh(i,t,e){const n=new ji(i,t,e);return n.texture.mapping=Fo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Gr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Q0(i,t,e){const n=new Float32Array(ki),s=new T(0,1,0);return new Mi({name:"SphericalGaussianBlur",defines:{n:ki,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function gh(){return new Mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function _h(){return new Mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function ll(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function t_(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===rc||c===oc,h=c===Ts||c===As;if(l||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new ph(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new ph(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function e_(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&vo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function n_(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const S=f.array;v=f.version;for(let x=0,y=S.length;x<y;x+=3){const I=S[x+0],C=S[x+1],A=S[x+2];d.push(I,C,C,A,A,I)}}else if(g!==void 0){const S=g.array;v=g.version;for(let x=0,y=S.length/3-1;x<y;x+=3){const I=x+0,C=x+1,A=x+2;d.push(I,C,C,A,A,I)}}else return;const m=new(wd(d)?Cd:Rd)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function i_(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S];for(let S=0;S<v.length;S++)e.update(p,n,v[S])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function s_(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function r_(i,t,e){const n=new WeakMap,s=new le;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let _=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var f=_;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let I=a.attributes.position.count*y,C=1;I>t.maxTextureSize&&(C=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const A=new Float32Array(I*C*4*u),P=new Td(A,I,C,u);P.type=$n,P.needsUpdate=!0;const H=y*4;for(let w=0;w<u;w++){const z=p[w],k=S[w],X=x[w],K=I*C*4*w;for(let G=0;G<z.count;G++){const Z=G*H;g===!0&&(s.fromBufferAttribute(z,G),A[K+Z+0]=s.x,A[K+Z+1]=s.y,A[K+Z+2]=s.z,A[K+Z+3]=0),v===!0&&(s.fromBufferAttribute(k,G),A[K+Z+4]=s.x,A[K+Z+5]=s.y,A[K+Z+6]=s.z,A[K+Z+7]=0),m===!0&&(s.fromBufferAttribute(X,G),A[K+Z+8]=s.x,A[K+Z+9]=s.y,A[K+Z+10]=s.z,A[K+Z+11]=X.itemSize===4?s.w:1)}}d={count:u,texture:P,size:new st(I,C)},n.set(a,d),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function o_(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class Nd extends je{constructor(t,e,n,s,r,o,a,c,l,h=ys){if(h!==ys&&h!==Cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ys&&(n=$i),n===void 0&&h===Cs&&(n=Rs),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:_n,this.minFilter=c!==void 0?c:_n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Od=new je,vh=new Nd(1,1),Fd=new Td,Bd=new Yp,zd=new Id,xh=[],Mh=[],yh=new Float32Array(16),Sh=new Float32Array(9),Eh=new Float32Array(4);function Ns(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=xh[s];if(r===void 0&&(r=new Float32Array(s),xh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ie(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ko(i,t){let e=Mh[t];e===void 0&&(e=new Int32Array(t),Mh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function a_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function c_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2fv(this.addr,t),Ie(e,t)}}function l_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;i.uniform3fv(this.addr,t),Ie(e,t)}}function h_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4fv(this.addr,t),Ie(e,t)}}function u_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Le(e,n))return;Eh.set(n),i.uniformMatrix2fv(this.addr,!1,Eh),Ie(e,n)}}function d_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Le(e,n))return;Sh.set(n),i.uniformMatrix3fv(this.addr,!1,Sh),Ie(e,n)}}function f_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Le(e,n))return;yh.set(n),i.uniformMatrix4fv(this.addr,!1,yh),Ie(e,n)}}function p_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function m_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2iv(this.addr,t),Ie(e,t)}}function g_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3iv(this.addr,t),Ie(e,t)}}function __(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4iv(this.addr,t),Ie(e,t)}}function v_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function x_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;i.uniform2uiv(this.addr,t),Ie(e,t)}}function M_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;i.uniform3uiv(this.addr,t),Ie(e,t)}}function y_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;i.uniform4uiv(this.addr,t),Ie(e,t)}}function S_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(vh.compareFunction=Ed,r=vh):r=Od,e.setTexture2D(t||r,s)}function E_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Bd,s)}function w_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||zd,s)}function b_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Fd,s)}function T_(i){switch(i){case 5126:return a_;case 35664:return c_;case 35665:return l_;case 35666:return h_;case 35674:return u_;case 35675:return d_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return __;case 5125:return v_;case 36294:return x_;case 36295:return M_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return S_;case 35679:case 36299:case 36307:return E_;case 35680:case 36300:case 36308:case 36293:return w_;case 36289:case 36303:case 36311:case 36292:return b_}}function A_(i,t){i.uniform1fv(this.addr,t)}function R_(i,t){const e=Ns(t,this.size,2);i.uniform2fv(this.addr,e)}function C_(i,t){const e=Ns(t,this.size,3);i.uniform3fv(this.addr,e)}function P_(i,t){const e=Ns(t,this.size,4);i.uniform4fv(this.addr,e)}function L_(i,t){const e=Ns(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function I_(i,t){const e=Ns(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function D_(i,t){const e=Ns(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function U_(i,t){i.uniform1iv(this.addr,t)}function N_(i,t){i.uniform2iv(this.addr,t)}function O_(i,t){i.uniform3iv(this.addr,t)}function F_(i,t){i.uniform4iv(this.addr,t)}function B_(i,t){i.uniform1uiv(this.addr,t)}function z_(i,t){i.uniform2uiv(this.addr,t)}function k_(i,t){i.uniform3uiv(this.addr,t)}function H_(i,t){i.uniform4uiv(this.addr,t)}function G_(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Od,r[o])}function V_(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Bd,r[o])}function W_(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||zd,r[o])}function X_(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Le(n,r)||(i.uniform1iv(this.addr,r),Ie(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Fd,r[o])}function Y_(i){switch(i){case 5126:return A_;case 35664:return R_;case 35665:return C_;case 35666:return P_;case 35674:return L_;case 35675:return I_;case 35676:return D_;case 5124:case 35670:return U_;case 35667:case 35671:return N_;case 35668:case 35672:return O_;case 35669:case 35673:return F_;case 5125:return B_;case 36294:return z_;case 36295:return k_;case 36296:return H_;case 35678:case 36198:case 36298:case 36306:case 35682:return G_;case 35679:case 36299:case 36307:return V_;case 35680:case 36300:case 36308:case 36293:return W_;case 36289:case 36303:case 36311:case 36292:return X_}}class q_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=T_(e.type)}}class $_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Y_(e.type)}}class j_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const wa=/(\w+)(\])?(\[|\.)?/g;function wh(i,t){i.seq.push(t),i.map[t.id]=t}function K_(i,t,e){const n=i.name,s=n.length;for(wa.lastIndex=0;;){const r=wa.exec(n),o=wa.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){wh(e,l===void 0?new q_(a,i,t):new $_(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new j_(a),wh(e,u)),e=u}}}class xo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);K_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function bh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Z_=37297;let J_=0;function Q_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function tv(i){const t=te.getPrimaries(te.workingColorSpace),e=te.getPrimaries(i);let n;switch(t===e?n="":t===bo&&e===wo?n="LinearDisplayP3ToLinearSRGB":t===wo&&e===bo&&(n="LinearSRGBToLinearDisplayP3"),i){case yi:case Bo:return[n,"LinearTransferOETF"];case bn:case rl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Th(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Q_(i.getShaderSource(t),o)}else return s}function ev(i,t){const e=tv(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function nv(i,t){let e;switch(t){case hd:e="Linear";break;case sp:e="Reinhard";break;case rp:e="Cineon";break;case op:e="ACESFilmic";break;case cp:e="AgX";break;case lp:e="Neutral";break;case ap:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Vr=new T;function iv(){te.getLuminanceCoefficients(Vr);const i=Vr.x.toFixed(4),t=Vr.y.toFixed(4),e=Vr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function rv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ov(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function tr(i){return i!==""}function Ah(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Rh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const av=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oc(i){return i.replace(av,lv)}const cv=new Map;function lv(i,t){let e=Nt[t];if(e===void 0){const n=cv.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Oc(e)}const hv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ch(i){return i.replace(hv,uv)}function uv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ph(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function dv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===cd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ff?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Xn&&(t="SHADOWMAP_TYPE_VSM"),t}function fv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ts:case As:t="ENVMAP_TYPE_CUBE";break;case Fo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function pv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case As:t="ENVMAP_MODE_REFRACTION";break}return t}function mv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ld:t="ENVMAP_BLENDING_MULTIPLY";break;case np:t="ENVMAP_BLENDING_MIX";break;case ip:t="ENVMAP_BLENDING_ADD";break}return t}function gv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function _v(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=dv(e),l=fv(e),h=pv(e),u=mv(e),d=gv(e),f=sv(e),g=rv(r),v=s.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(tr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(tr).join(`
`),p.length>0&&(p+=`
`)):(m=[Ph(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),p=[Ph(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?Nt.tonemapping_pars_fragment:"",e.toneMapping!==_i?nv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,ev("linearToOutputTexel",e.outputColorSpace),iv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(tr).join(`
`)),o=Oc(o),o=Ah(o,e),o=Rh(o,e),a=Oc(a),a=Ah(a,e),a=Rh(a,e),o=Ch(o),a=Ch(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Yl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Yl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=S+m+o,y=S+p+a,I=bh(s,s.VERTEX_SHADER,x),C=bh(s,s.FRAGMENT_SHADER,y);s.attachShader(v,I),s.attachShader(v,C),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(w){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(v).trim(),k=s.getShaderInfoLog(I).trim(),X=s.getShaderInfoLog(C).trim();let K=!0,G=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,I,C);else{const Z=Th(s,I,"vertex"),W=Th(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+z+`
`+Z+`
`+W)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(k===""||X==="")&&(G=!1);G&&(w.diagnostics={runnable:K,programLog:z,vertexShader:{log:k,prefix:m},fragmentShader:{log:X,prefix:p}})}s.deleteShader(I),s.deleteShader(C),P=new xo(s,v),H=ov(s,v)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let H;this.getAttributes=function(){return H===void 0&&A(this),H};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(v,Z_)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=J_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=C,this}let vv=0;class xv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Mv(t),e.set(t,n)),n}}class Mv{constructor(t){this.id=vv++,this.code=t,this.usedTimes=0}}function yv(i,t,e,n,s,r,o){const a=new al,c=new xv,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,f=s.vertexTextures;let g=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function p(_,w,z,k,X){const K=k.fog,G=X.geometry,Z=_.isMeshStandardMaterial?k.environment:null,W=(_.isMeshStandardMaterial?e:t).get(_.envMap||Z),dt=W&&W.mapping===Fo?W.image.height:null,ft=v[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const yt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,$t=yt!==void 0?yt.length:0;let ne=0;G.morphAttributes.position!==void 0&&(ne=1),G.morphAttributes.normal!==void 0&&(ne=2),G.morphAttributes.color!==void 0&&(ne=3);let Y,Q,xt,pt;if(ft){const Ze=Nn[ft];Y=Ze.vertexShader,Q=Ze.fragmentShader}else Y=_.vertexShader,Q=_.fragmentShader,c.update(_),xt=c.getVertexShaderID(_),pt=c.getFragmentShaderID(_);const Dt=i.getRenderTarget(),At=X.isInstancedMesh===!0,Ht=X.isBatchedMesh===!0,ae=!!_.map,Gt=!!_.matcap,L=!!W,sn=!!_.aoMap,Bt=!!_.lightMap,Wt=!!_.bumpMap,Ct=!!_.normalMap,pe=!!_.displacementMap,It=!!_.emissiveMap,R=!!_.metalnessMap,M=!!_.roughnessMap,O=_.anisotropy>0,$=_.clearcoat>0,J=_.dispersion>0,q=_.iridescence>0,St=_.sheen>0,rt=_.transmission>0,mt=O&&!!_.anisotropyMap,Xt=$&&!!_.clearcoatMap,tt=$&&!!_.clearcoatNormalMap,gt=$&&!!_.clearcoatRoughnessMap,Pt=q&&!!_.iridescenceMap,Lt=q&&!!_.iridescenceThicknessMap,_t=St&&!!_.sheenColorMap,zt=St&&!!_.sheenRoughnessMap,Ut=!!_.specularMap,fe=!!_.specularColorMap,D=!!_.specularIntensityMap,ht=rt&&!!_.transmissionMap,V=rt&&!!_.thicknessMap,j=!!_.gradientMap,at=!!_.alphaMap,ut=_.alphaTest>0,Vt=!!_.alphaHash,Se=!!_.extensions;let Ke=_i;_.toneMapped&&(Dt===null||Dt.isXRRenderTarget===!0)&&(Ke=i.toneMapping);const jt={shaderID:ft,shaderType:_.type,shaderName:_.name,vertexShader:Y,fragmentShader:Q,defines:_.defines,customVertexShaderID:xt,customFragmentShaderID:pt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ht,batchingColor:Ht&&X._colorsTexture!==null,instancing:At,instancingColor:At&&X.instanceColor!==null,instancingMorph:At&&X.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Dt===null?i.outputColorSpace:Dt.isXRRenderTarget===!0?Dt.texture.colorSpace:yi,alphaToCoverage:!!_.alphaToCoverage,map:ae,matcap:Gt,envMap:L,envMapMode:L&&W.mapping,envMapCubeUVHeight:dt,aoMap:sn,lightMap:Bt,bumpMap:Wt,normalMap:Ct,displacementMap:f&&pe,emissiveMap:It,normalMapObjectSpace:Ct&&_.normalMapType===fp,normalMapTangentSpace:Ct&&_.normalMapType===Sd,metalnessMap:R,roughnessMap:M,anisotropy:O,anisotropyMap:mt,clearcoat:$,clearcoatMap:Xt,clearcoatNormalMap:tt,clearcoatRoughnessMap:gt,dispersion:J,iridescence:q,iridescenceMap:Pt,iridescenceThicknessMap:Lt,sheen:St,sheenColorMap:_t,sheenRoughnessMap:zt,specularMap:Ut,specularColorMap:fe,specularIntensityMap:D,transmission:rt,transmissionMap:ht,thicknessMap:V,gradientMap:j,opaque:_.transparent===!1&&_.blending===Ms&&_.alphaToCoverage===!1,alphaMap:at,alphaTest:ut,alphaHash:Vt,combine:_.combine,mapUv:ae&&m(_.map.channel),aoMapUv:sn&&m(_.aoMap.channel),lightMapUv:Bt&&m(_.lightMap.channel),bumpMapUv:Wt&&m(_.bumpMap.channel),normalMapUv:Ct&&m(_.normalMap.channel),displacementMapUv:pe&&m(_.displacementMap.channel),emissiveMapUv:It&&m(_.emissiveMap.channel),metalnessMapUv:R&&m(_.metalnessMap.channel),roughnessMapUv:M&&m(_.roughnessMap.channel),anisotropyMapUv:mt&&m(_.anisotropyMap.channel),clearcoatMapUv:Xt&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:tt&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:gt&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Pt&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:Lt&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:zt&&m(_.sheenRoughnessMap.channel),specularMapUv:Ut&&m(_.specularMap.channel),specularColorMapUv:fe&&m(_.specularColorMap.channel),specularIntensityMapUv:D&&m(_.specularIntensityMap.channel),transmissionMapUv:ht&&m(_.transmissionMap.channel),thicknessMapUv:V&&m(_.thicknessMap.channel),alphaMapUv:at&&m(_.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ct||O),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!G.attributes.uv&&(ae||at),fog:!!K,useFog:_.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:X.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:$t,morphTextureStride:ne,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ke,decodeVideoTexture:ae&&_.map.isVideoTexture===!0&&te.getTransfer(_.map.colorSpace)===ge,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ue,flipSided:_.side===$e,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Se&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&_.extensions.multiDraw===!0||Ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return jt.vertexUv1s=l.has(1),jt.vertexUv2s=l.has(2),jt.vertexUv3s=l.has(3),l.clear(),jt}function S(_){const w=[];if(_.shaderID?w.push(_.shaderID):(w.push(_.customVertexShaderID),w.push(_.customFragmentShaderID)),_.defines!==void 0)for(const z in _.defines)w.push(z),w.push(_.defines[z]);return _.isRawShaderMaterial===!1&&(x(w,_),y(w,_),w.push(i.outputColorSpace)),w.push(_.customProgramCacheKey),w.join()}function x(_,w){_.push(w.precision),_.push(w.outputColorSpace),_.push(w.envMapMode),_.push(w.envMapCubeUVHeight),_.push(w.mapUv),_.push(w.alphaMapUv),_.push(w.lightMapUv),_.push(w.aoMapUv),_.push(w.bumpMapUv),_.push(w.normalMapUv),_.push(w.displacementMapUv),_.push(w.emissiveMapUv),_.push(w.metalnessMapUv),_.push(w.roughnessMapUv),_.push(w.anisotropyMapUv),_.push(w.clearcoatMapUv),_.push(w.clearcoatNormalMapUv),_.push(w.clearcoatRoughnessMapUv),_.push(w.iridescenceMapUv),_.push(w.iridescenceThicknessMapUv),_.push(w.sheenColorMapUv),_.push(w.sheenRoughnessMapUv),_.push(w.specularMapUv),_.push(w.specularColorMapUv),_.push(w.specularIntensityMapUv),_.push(w.transmissionMapUv),_.push(w.thicknessMapUv),_.push(w.combine),_.push(w.fogExp2),_.push(w.sizeAttenuation),_.push(w.morphTargetsCount),_.push(w.morphAttributeCount),_.push(w.numDirLights),_.push(w.numPointLights),_.push(w.numSpotLights),_.push(w.numSpotLightMaps),_.push(w.numHemiLights),_.push(w.numRectAreaLights),_.push(w.numDirLightShadows),_.push(w.numPointLightShadows),_.push(w.numSpotLightShadows),_.push(w.numSpotLightShadowsWithMaps),_.push(w.numLightProbes),_.push(w.shadowMapType),_.push(w.toneMapping),_.push(w.numClippingPlanes),_.push(w.numClipIntersection),_.push(w.depthPacking)}function y(_,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reverseDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.alphaToCoverage&&a.enable(20),_.push(a.mask)}function I(_){const w=v[_.type];let z;if(w){const k=Nn[w];z=sm.clone(k.uniforms)}else z=_.uniforms;return z}function C(_,w){let z;for(let k=0,X=h.length;k<X;k++){const K=h[k];if(K.cacheKey===w){z=K,++z.usedTimes;break}}return z===void 0&&(z=new _v(i,w,_,r),h.push(z)),z}function A(_){if(--_.usedTimes===0){const w=h.indexOf(_);h[w]=h[h.length-1],h.pop(),_.destroy()}}function P(_){c.remove(_)}function H(){c.dispose()}return{getParameters:p,getProgramCacheKey:S,getUniforms:I,acquireProgram:C,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:H}}function Sv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Ev(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Lh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ih(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Ev),n.length>1&&n.sort(d||Lh),s.length>1&&s.sort(d||Lh)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function wv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Ih,i.set(n,[o])):s>=r.length?(o=new Ih,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function bv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new T,color:new bt};break;case"SpotLight":e={position:new T,direction:new T,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new T,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new T,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new T,halfWidth:new T,halfHeight:new T};break}return i[t.id]=e,e}}}function Tv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Av=0;function Rv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Cv(i){const t=new bv,e=Tv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new T);const s=new T,r=new Zt,o=new Zt;function a(l){let h=0,u=0,d=0;for(let H=0;H<9;H++)n.probe[H].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,S=0,x=0,y=0,I=0,C=0,A=0;l.sort(Rv);for(let H=0,_=l.length;H<_;H++){const w=l[H],z=w.color,k=w.intensity,X=w.distance,K=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=z.r*k,u+=z.g*k,d+=z.b*k;else if(w.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(w.sh.coefficients[G],k);A++}else if(w.isDirectionalLight){const G=t.get(w);if(G.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const Z=w.shadow,W=e.get(w);W.shadowIntensity=Z.intensity,W.shadowBias=Z.bias,W.shadowNormalBias=Z.normalBias,W.shadowRadius=Z.radius,W.shadowMapSize=Z.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=K,n.directionalShadowMatrix[f]=w.shadow.matrix,S++}n.directional[f]=G,f++}else if(w.isSpotLight){const G=t.get(w);G.position.setFromMatrixPosition(w.matrixWorld),G.color.copy(z).multiplyScalar(k),G.distance=X,G.coneCos=Math.cos(w.angle),G.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),G.decay=w.decay,n.spot[v]=G;const Z=w.shadow;if(w.map&&(n.spotLightMap[I]=w.map,I++,Z.updateMatrices(w),w.castShadow&&C++),n.spotLightMatrix[v]=Z.matrix,w.castShadow){const W=e.get(w);W.shadowIntensity=Z.intensity,W.shadowBias=Z.bias,W.shadowNormalBias=Z.normalBias,W.shadowRadius=Z.radius,W.shadowMapSize=Z.mapSize,n.spotShadow[v]=W,n.spotShadowMap[v]=K,y++}v++}else if(w.isRectAreaLight){const G=t.get(w);G.color.copy(z).multiplyScalar(k),G.halfWidth.set(w.width*.5,0,0),G.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=G,m++}else if(w.isPointLight){const G=t.get(w);if(G.color.copy(w.color).multiplyScalar(w.intensity),G.distance=w.distance,G.decay=w.decay,w.castShadow){const Z=w.shadow,W=e.get(w);W.shadowIntensity=Z.intensity,W.shadowBias=Z.bias,W.shadowNormalBias=Z.normalBias,W.shadowRadius=Z.radius,W.shadowMapSize=Z.mapSize,W.shadowCameraNear=Z.camera.near,W.shadowCameraFar=Z.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=w.shadow.matrix,x++}n.point[g]=G,g++}else if(w.isHemisphereLight){const G=t.get(w);G.skyColor.copy(w.color).multiplyScalar(k),G.groundColor.copy(w.groundColor).multiplyScalar(k),n.hemi[p]=G,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const P=n.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==v||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==S||P.numPointShadows!==x||P.numSpotShadows!==y||P.numSpotMaps!==I||P.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=y+I-C,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=A,P.directionalLength=f,P.pointLength=g,P.spotLength=v,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=S,P.numPointShadows=x,P.numSpotShadows=y,P.numSpotMaps=I,P.numLightProbes=A,n.version=Av++)}function c(l,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const x=l[p];if(x.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(x.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:n}}function Dh(i){const t=new Cv(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Pv(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Dh(i),t.set(s,[a])):r>=o.length?(a=new Dh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Lv extends Ei{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=up,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Iv extends Ei{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Dv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Uv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Nv(i,t,e){let n=new cl;const s=new st,r=new st,o=new le,a=new Lv({depthPacking:dp}),c=new Iv,l={},h=e.maxTextureSize,u={[xi]:$e,[$e]:xi,[Ue]:Ue},d=new Mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:Dv,fragmentShader:Uv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new ee;g.setAttribute("position",new Ne(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new lt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cd;let p=this.type;this.render=function(C,A,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const H=i.getRenderTarget(),_=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),z=i.state;z.setBlending(gi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const k=p!==Xn&&this.type===Xn,X=p===Xn&&this.type!==Xn;for(let K=0,G=C.length;K<G;K++){const Z=C[K],W=Z.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const dt=W.getFrameExtents();if(s.multiply(dt),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/dt.x),s.x=r.x*dt.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/dt.y),s.y=r.y*dt.y,W.mapSize.y=r.y)),W.map===null||k===!0||X===!0){const yt=this.type!==Xn?{minFilter:_n,magFilter:_n}:{};W.map!==null&&W.map.dispose(),W.map=new ji(s.x,s.y,yt),W.map.texture.name=Z.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const ft=W.getViewportCount();for(let yt=0;yt<ft;yt++){const $t=W.getViewport(yt);o.set(r.x*$t.x,r.y*$t.y,r.x*$t.z,r.y*$t.w),z.viewport(o),W.updateMatrices(Z,yt),n=W.getFrustum(),y(A,P,W.camera,Z,this.type)}W.isPointLightShadow!==!0&&this.type===Xn&&S(W,P),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(H,_,w)};function S(C,A){const P=t.update(v);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ji(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(A,null,P,d,v,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(A,null,P,f,v,null)}function x(C,A,P,H){let _=null;const w=P.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(w!==void 0)_=w;else if(_=P.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=_.uuid,k=A.uuid;let X=l[z];X===void 0&&(X={},l[z]=X);let K=X[k];K===void 0&&(K=_.clone(),X[k]=K,A.addEventListener("dispose",I)),_=K}if(_.visible=A.visible,_.wireframe=A.wireframe,H===Xn?_.side=A.shadowSide!==null?A.shadowSide:A.side:_.side=A.shadowSide!==null?A.shadowSide:u[A.side],_.alphaMap=A.alphaMap,_.alphaTest=A.alphaTest,_.map=A.map,_.clipShadows=A.clipShadows,_.clippingPlanes=A.clippingPlanes,_.clipIntersection=A.clipIntersection,_.displacementMap=A.displacementMap,_.displacementScale=A.displacementScale,_.displacementBias=A.displacementBias,_.wireframeLinewidth=A.wireframeLinewidth,_.linewidth=A.linewidth,P.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const z=i.properties.get(_);z.light=P}return _}function y(C,A,P,H,_){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&_===Xn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,C.matrixWorld);const k=t.update(C),X=C.material;if(Array.isArray(X)){const K=k.groups;for(let G=0,Z=K.length;G<Z;G++){const W=K[G],dt=X[W.materialIndex];if(dt&&dt.visible){const ft=x(C,dt,H,_);C.onBeforeShadow(i,C,A,P,k,ft,W),i.renderBufferDirect(P,null,k,ft,C,W),C.onAfterShadow(i,C,A,P,k,ft,W)}}}else if(X.visible){const K=x(C,X,H,_);C.onBeforeShadow(i,C,A,P,k,K,null),i.renderBufferDirect(P,null,k,K,C,null),C.onAfterShadow(i,C,A,P,k,K,null)}}const z=C.children;for(let k=0,X=z.length;k<X;k++)y(z[k],A,P,H,_)}function I(C){C.target.removeEventListener("dispose",I);for(const P in l){const H=l[P],_=C.target.uuid;_ in H&&(H[_].dispose(),delete H[_])}}}const Ov={[Ja]:Qa,[tc]:ic,[ec]:sc,[bs]:nc,[Qa]:Ja,[ic]:tc,[sc]:ec,[nc]:bs};function Fv(i){function t(){let D=!1;const ht=new le;let V=null;const j=new le(0,0,0,0);return{setMask:function(at){V!==at&&!D&&(i.colorMask(at,at,at,at),V=at)},setLocked:function(at){D=at},setClear:function(at,ut,Vt,Se,Ke){Ke===!0&&(at*=Se,ut*=Se,Vt*=Se),ht.set(at,ut,Vt,Se),j.equals(ht)===!1&&(i.clearColor(at,ut,Vt,Se),j.copy(ht))},reset:function(){D=!1,V=null,j.set(-1,0,0,0)}}}function e(){let D=!1,ht=!1,V=null,j=null,at=null;return{setReversed:function(ut){ht=ut},setTest:function(ut){ut?xt(i.DEPTH_TEST):pt(i.DEPTH_TEST)},setMask:function(ut){V!==ut&&!D&&(i.depthMask(ut),V=ut)},setFunc:function(ut){if(ht&&(ut=Ov[ut]),j!==ut){switch(ut){case Ja:i.depthFunc(i.NEVER);break;case Qa:i.depthFunc(i.ALWAYS);break;case tc:i.depthFunc(i.LESS);break;case bs:i.depthFunc(i.LEQUAL);break;case ec:i.depthFunc(i.EQUAL);break;case nc:i.depthFunc(i.GEQUAL);break;case ic:i.depthFunc(i.GREATER);break;case sc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}j=ut}},setLocked:function(ut){D=ut},setClear:function(ut){at!==ut&&(i.clearDepth(ut),at=ut)},reset:function(){D=!1,V=null,j=null,at=null}}}function n(){let D=!1,ht=null,V=null,j=null,at=null,ut=null,Vt=null,Se=null,Ke=null;return{setTest:function(jt){D||(jt?xt(i.STENCIL_TEST):pt(i.STENCIL_TEST))},setMask:function(jt){ht!==jt&&!D&&(i.stencilMask(jt),ht=jt)},setFunc:function(jt,Ze,zn){(V!==jt||j!==Ze||at!==zn)&&(i.stencilFunc(jt,Ze,zn),V=jt,j=Ze,at=zn)},setOp:function(jt,Ze,zn){(ut!==jt||Vt!==Ze||Se!==zn)&&(i.stencilOp(jt,Ze,zn),ut=jt,Vt=Ze,Se=zn)},setLocked:function(jt){D=jt},setClear:function(jt){Ke!==jt&&(i.clearStencil(jt),Ke=jt)},reset:function(){D=!1,ht=null,V=null,j=null,at=null,ut=null,Vt=null,Se=null,Ke=null}}}const s=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap;let l={},h={},u=new WeakMap,d=[],f=null,g=!1,v=null,m=null,p=null,S=null,x=null,y=null,I=null,C=new bt(0,0,0),A=0,P=!1,H=null,_=null,w=null,z=null,k=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,G=0;const Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(Z)[1]),K=G>=1):Z.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),K=G>=2);let W=null,dt={};const ft=i.getParameter(i.SCISSOR_BOX),yt=i.getParameter(i.VIEWPORT),$t=new le().fromArray(ft),ne=new le().fromArray(yt);function Y(D,ht,V,j){const at=new Uint8Array(4),ut=i.createTexture();i.bindTexture(D,ut),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<V;Vt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(ht,0,i.RGBA,1,1,j,0,i.RGBA,i.UNSIGNED_BYTE,at):i.texImage2D(ht+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,at);return ut}const Q={};Q[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),xt(i.DEPTH_TEST),r.setFunc(bs),Bt(!1),Wt(Gl),xt(i.CULL_FACE),L(gi);function xt(D){l[D]!==!0&&(i.enable(D),l[D]=!0)}function pt(D){l[D]!==!1&&(i.disable(D),l[D]=!1)}function Dt(D,ht){return h[D]!==ht?(i.bindFramebuffer(D,ht),h[D]=ht,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ht),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ht),!0):!1}function At(D,ht){let V=d,j=!1;if(D){V=u.get(ht),V===void 0&&(V=[],u.set(ht,V));const at=D.textures;if(V.length!==at.length||V[0]!==i.COLOR_ATTACHMENT0){for(let ut=0,Vt=at.length;ut<Vt;ut++)V[ut]=i.COLOR_ATTACHMENT0+ut;V.length=at.length,j=!0}}else V[0]!==i.BACK&&(V[0]=i.BACK,j=!0);j&&i.drawBuffers(V)}function Ht(D){return f!==D?(i.useProgram(D),f=D,!0):!1}const ae={[zi]:i.FUNC_ADD,[zf]:i.FUNC_SUBTRACT,[kf]:i.FUNC_REVERSE_SUBTRACT};ae[Hf]=i.MIN,ae[Gf]=i.MAX;const Gt={[Vf]:i.ZERO,[Wf]:i.ONE,[Xf]:i.SRC_COLOR,[Ka]:i.SRC_ALPHA,[Zf]:i.SRC_ALPHA_SATURATE,[jf]:i.DST_COLOR,[qf]:i.DST_ALPHA,[Yf]:i.ONE_MINUS_SRC_COLOR,[Za]:i.ONE_MINUS_SRC_ALPHA,[Kf]:i.ONE_MINUS_DST_COLOR,[$f]:i.ONE_MINUS_DST_ALPHA,[Jf]:i.CONSTANT_COLOR,[Qf]:i.ONE_MINUS_CONSTANT_COLOR,[tp]:i.CONSTANT_ALPHA,[ep]:i.ONE_MINUS_CONSTANT_ALPHA};function L(D,ht,V,j,at,ut,Vt,Se,Ke,jt){if(D===gi){g===!0&&(pt(i.BLEND),g=!1);return}if(g===!1&&(xt(i.BLEND),g=!0),D!==Bf){if(D!==v||jt!==P){if((m!==zi||x!==zi)&&(i.blendEquation(i.FUNC_ADD),m=zi,x=zi),jt)switch(D){case Ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Zn:i.blendFunc(i.ONE,i.ONE);break;case Vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Wl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Zn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Wl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}p=null,S=null,y=null,I=null,C.set(0,0,0),A=0,v=D,P=jt}return}at=at||ht,ut=ut||V,Vt=Vt||j,(ht!==m||at!==x)&&(i.blendEquationSeparate(ae[ht],ae[at]),m=ht,x=at),(V!==p||j!==S||ut!==y||Vt!==I)&&(i.blendFuncSeparate(Gt[V],Gt[j],Gt[ut],Gt[Vt]),p=V,S=j,y=ut,I=Vt),(Se.equals(C)===!1||Ke!==A)&&(i.blendColor(Se.r,Se.g,Se.b,Ke),C.copy(Se),A=Ke),v=D,P=!1}function sn(D,ht){D.side===Ue?pt(i.CULL_FACE):xt(i.CULL_FACE);let V=D.side===$e;ht&&(V=!V),Bt(V),D.blending===Ms&&D.transparent===!1?L(gi):L(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),r.setFunc(D.depthFunc),r.setTest(D.depthTest),r.setMask(D.depthWrite),s.setMask(D.colorWrite);const j=D.stencilWrite;o.setTest(j),j&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),pe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?xt(i.SAMPLE_ALPHA_TO_COVERAGE):pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(D){H!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),H=D)}function Wt(D){D!==Nf?(xt(i.CULL_FACE),D!==_&&(D===Gl?i.cullFace(i.BACK):D===Of?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pt(i.CULL_FACE),_=D}function Ct(D){D!==w&&(K&&i.lineWidth(D),w=D)}function pe(D,ht,V){D?(xt(i.POLYGON_OFFSET_FILL),(z!==ht||k!==V)&&(i.polygonOffset(ht,V),z=ht,k=V)):pt(i.POLYGON_OFFSET_FILL)}function It(D){D?xt(i.SCISSOR_TEST):pt(i.SCISSOR_TEST)}function R(D){D===void 0&&(D=i.TEXTURE0+X-1),W!==D&&(i.activeTexture(D),W=D)}function M(D,ht,V){V===void 0&&(W===null?V=i.TEXTURE0+X-1:V=W);let j=dt[V];j===void 0&&(j={type:void 0,texture:void 0},dt[V]=j),(j.type!==D||j.texture!==ht)&&(W!==V&&(i.activeTexture(V),W=V),i.bindTexture(D,ht||Q[D]),j.type=D,j.texture=ht)}function O(){const D=dt[W];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function St(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function rt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function mt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Xt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function tt(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Lt(D){$t.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),$t.copy(D))}function _t(D){ne.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),ne.copy(D))}function zt(D,ht){let V=c.get(ht);V===void 0&&(V=new WeakMap,c.set(ht,V));let j=V.get(D);j===void 0&&(j=i.getUniformBlockIndex(ht,D.name),V.set(D,j))}function Ut(D,ht){const j=c.get(ht).get(D);a.get(ht)!==j&&(i.uniformBlockBinding(ht,j,D.__bindingPointIndex),a.set(ht,j))}function fe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},W=null,dt={},h={},u=new WeakMap,d=[],f=null,g=!1,v=null,m=null,p=null,S=null,x=null,y=null,I=null,C=new bt(0,0,0),A=0,P=!1,H=null,_=null,w=null,z=null,k=null,$t.set(0,0,i.canvas.width,i.canvas.height),ne.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:xt,disable:pt,bindFramebuffer:Dt,drawBuffers:At,useProgram:Ht,setBlending:L,setMaterial:sn,setFlipSided:Bt,setCullFace:Wt,setLineWidth:Ct,setPolygonOffset:pe,setScissorTest:It,activeTexture:R,bindTexture:M,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:J,texImage2D:gt,texImage3D:Pt,updateUBOMapping:zt,uniformBlockBinding:Ut,texStorage2D:Xt,texStorage3D:tt,texSubImage2D:q,texSubImage3D:St,compressedTexSubImage2D:rt,compressedTexSubImage3D:mt,scissor:Lt,viewport:_t,reset:fe}}function Uh(i,t,e,n){const s=Bv(n);switch(e){case md:return i*t;case _d:return i*t;case vd:return i*t*2;case xd:return i*t/s.components*s.byteLength;case nl:return i*t/s.components*s.byteLength;case Md:return i*t*2/s.components*s.byteLength;case il:return i*t*2/s.components*s.byteLength;case gd:return i*t*3/s.components*s.byteLength;case Cn:return i*t*4/s.components*s.byteLength;case sl:return i*t*4/s.components*s.byteLength;case fo:case po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case mo:case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case hc:case dc:return Math.max(i,16)*Math.max(t,8)/4;case lc:case uc:return Math.max(i,8)*Math.max(t,8)/2;case fc:case pc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case mc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case gc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _c:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case vc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case xc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Mc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case yc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Sc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ec:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case wc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case bc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Tc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ac:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Rc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Cc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case _o:case Pc:case Lc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case yd:case Ic:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Dc:case Uc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Bv(i){switch(i){case Jn:case dd:return{byteLength:1,components:1};case hr:case fd:case pr:return{byteLength:2,components:1};case tl:case el:return{byteLength:2,components:4};case $i:case Qc:case $n:return{byteLength:4,components:1};case pd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function zv(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new st,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,M){return f?new OffscreenCanvas(R,M):Ao("canvas")}function v(R,M,O){let $=1;const J=It(R);if((J.width>O||J.height>O)&&($=O/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const q=Math.floor($*J.width),St=Math.floor($*J.height);u===void 0&&(u=g(q,St));const rt=M?g(q,St):u;return rt.width=q,rt.height=St,rt.getContext("2d").drawImage(R,0,0,q,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+St+")."),rt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),R;return R}function m(R){return R.generateMipmaps&&R.minFilter!==_n&&R.minFilter!==An}function p(R){i.generateMipmap(R)}function S(R,M,O,$,J=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let q=M;if(M===i.RED&&(O===i.FLOAT&&(q=i.R32F),O===i.HALF_FLOAT&&(q=i.R16F),O===i.UNSIGNED_BYTE&&(q=i.R8)),M===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.R8UI),O===i.UNSIGNED_SHORT&&(q=i.R16UI),O===i.UNSIGNED_INT&&(q=i.R32UI),O===i.BYTE&&(q=i.R8I),O===i.SHORT&&(q=i.R16I),O===i.INT&&(q=i.R32I)),M===i.RG&&(O===i.FLOAT&&(q=i.RG32F),O===i.HALF_FLOAT&&(q=i.RG16F),O===i.UNSIGNED_BYTE&&(q=i.RG8)),M===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RG8UI),O===i.UNSIGNED_SHORT&&(q=i.RG16UI),O===i.UNSIGNED_INT&&(q=i.RG32UI),O===i.BYTE&&(q=i.RG8I),O===i.SHORT&&(q=i.RG16I),O===i.INT&&(q=i.RG32I)),M===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGB8UI),O===i.UNSIGNED_SHORT&&(q=i.RGB16UI),O===i.UNSIGNED_INT&&(q=i.RGB32UI),O===i.BYTE&&(q=i.RGB8I),O===i.SHORT&&(q=i.RGB16I),O===i.INT&&(q=i.RGB32I)),M===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),O===i.UNSIGNED_INT&&(q=i.RGBA32UI),O===i.BYTE&&(q=i.RGBA8I),O===i.SHORT&&(q=i.RGBA16I),O===i.INT&&(q=i.RGBA32I)),M===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),M===i.RGBA){const St=J?Eo:te.getTransfer($);O===i.FLOAT&&(q=i.RGBA32F),O===i.HALF_FLOAT&&(q=i.RGBA16F),O===i.UNSIGNED_BYTE&&(q=St===ge?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function x(R,M){let O;return R?M===null||M===$i||M===Rs?O=i.DEPTH24_STENCIL8:M===$n?O=i.DEPTH32F_STENCIL8:M===hr&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===$i||M===Rs?O=i.DEPTH_COMPONENT24:M===$n?O=i.DEPTH_COMPONENT32F:M===hr&&(O=i.DEPTH_COMPONENT16),O}function y(R,M){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==_n&&R.minFilter!==An?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function I(R){const M=R.target;M.removeEventListener("dispose",I),A(M),M.isVideoTexture&&h.delete(M)}function C(R){const M=R.target;M.removeEventListener("dispose",C),H(M)}function A(R){const M=n.get(R);if(M.__webglInit===void 0)return;const O=R.source,$=d.get(O);if($){const J=$[M.__cacheKey];J.usedTimes--,J.usedTimes===0&&P(R),Object.keys($).length===0&&d.delete(O)}n.remove(R)}function P(R){const M=n.get(R);i.deleteTexture(M.__webglTexture);const O=R.source,$=d.get(O);delete $[M.__cacheKey],o.memory.textures--}function H(R){const M=n.get(R);if(R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(M.__webglFramebuffer[$]))for(let J=0;J<M.__webglFramebuffer[$].length;J++)i.deleteFramebuffer(M.__webglFramebuffer[$][J]);else i.deleteFramebuffer(M.__webglFramebuffer[$]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[$])}else{if(Array.isArray(M.__webglFramebuffer))for(let $=0;$<M.__webglFramebuffer.length;$++)i.deleteFramebuffer(M.__webglFramebuffer[$]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let $=0;$<M.__webglColorRenderbuffer.length;$++)M.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[$]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const O=R.textures;for(let $=0,J=O.length;$<J;$++){const q=n.get(O[$]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(O[$])}n.remove(R)}let _=0;function w(){_=0}function z(){const R=_;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),_+=1,R}function k(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function X(R,M){const O=n.get(R);if(R.isVideoTexture&&Ct(R),R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){const $=R.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(O,R,M);return}}e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+M)}function K(R,M){const O=n.get(R);if(R.version>0&&O.__version!==R.version){ne(O,R,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+M)}function G(R,M){const O=n.get(R);if(R.version>0&&O.__version!==R.version){ne(O,R,M);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+M)}function Z(R,M){const O=n.get(R);if(R.version>0&&O.__version!==R.version){Y(O,R,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+M)}const W={[ac]:i.REPEAT,[Gi]:i.CLAMP_TO_EDGE,[cc]:i.MIRRORED_REPEAT},dt={[_n]:i.NEAREST,[hp]:i.NEAREST_MIPMAP_NEAREST,[Er]:i.NEAREST_MIPMAP_LINEAR,[An]:i.LINEAR,[Zo]:i.LINEAR_MIPMAP_NEAREST,[Vi]:i.LINEAR_MIPMAP_LINEAR},ft={[pp]:i.NEVER,[Mp]:i.ALWAYS,[mp]:i.LESS,[Ed]:i.LEQUAL,[gp]:i.EQUAL,[xp]:i.GEQUAL,[_p]:i.GREATER,[vp]:i.NOTEQUAL};function yt(R,M){if(M.type===$n&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===An||M.magFilter===Zo||M.magFilter===Er||M.magFilter===Vi||M.minFilter===An||M.minFilter===Zo||M.minFilter===Er||M.minFilter===Vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,W[M.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,W[M.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,W[M.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,dt[M.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,dt[M.minFilter]),M.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ft[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===_n||M.minFilter!==Er&&M.minFilter!==Vi||M.type===$n&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function $t(R,M){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",I));const $=M.source;let J=d.get($);J===void 0&&(J={},d.set($,J));const q=k(M);if(q!==R.__cacheKey){J[q]===void 0&&(J[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),J[q].usedTimes++;const St=J[R.__cacheKey];St!==void 0&&(J[R.__cacheKey].usedTimes--,St.usedTimes===0&&P(M)),R.__cacheKey=q,R.__webglTexture=J[q].texture}return O}function ne(R,M,O){let $=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&($=i.TEXTURE_3D);const J=$t(R,M),q=M.source;e.bindTexture($,R.__webglTexture,i.TEXTURE0+O);const St=n.get(q);if(q.version!==St.__version||J===!0){e.activeTexture(i.TEXTURE0+O);const rt=te.getPrimaries(te.workingColorSpace),mt=M.colorSpace===pi?null:te.getPrimaries(M.colorSpace),Xt=M.colorSpace===pi||rt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let tt=v(M.image,!1,s.maxTextureSize);tt=pe(M,tt);const gt=r.convert(M.format,M.colorSpace),Pt=r.convert(M.type);let Lt=S(M.internalFormat,gt,Pt,M.colorSpace,M.isVideoTexture);yt($,M);let _t;const zt=M.mipmaps,Ut=M.isVideoTexture!==!0,fe=St.__version===void 0||J===!0,D=q.dataReady,ht=y(M,tt);if(M.isDepthTexture)Lt=x(M.format===Cs,M.type),fe&&(Ut?e.texStorage2D(i.TEXTURE_2D,1,Lt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,Lt,tt.width,tt.height,0,gt,Pt,null));else if(M.isDataTexture)if(zt.length>0){Ut&&fe&&e.texStorage2D(i.TEXTURE_2D,ht,Lt,zt[0].width,zt[0].height);for(let V=0,j=zt.length;V<j;V++)_t=zt[V],Ut?D&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,_t.width,_t.height,gt,Pt,_t.data):e.texImage2D(i.TEXTURE_2D,V,Lt,_t.width,_t.height,0,gt,Pt,_t.data);M.generateMipmaps=!1}else Ut?(fe&&e.texStorage2D(i.TEXTURE_2D,ht,Lt,tt.width,tt.height),D&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,tt.width,tt.height,gt,Pt,tt.data)):e.texImage2D(i.TEXTURE_2D,0,Lt,tt.width,tt.height,0,gt,Pt,tt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ut&&fe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,Lt,zt[0].width,zt[0].height,tt.depth);for(let V=0,j=zt.length;V<j;V++)if(_t=zt[V],M.format!==Cn)if(gt!==null)if(Ut){if(D)if(M.layerUpdates.size>0){const at=Uh(_t.width,_t.height,M.format,M.type);for(const ut of M.layerUpdates){const Vt=_t.data.subarray(ut*at/_t.data.BYTES_PER_ELEMENT,(ut+1)*at/_t.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,ut,_t.width,_t.height,1,gt,Vt,0,0)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,_t.width,_t.height,tt.depth,gt,_t.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,V,Lt,_t.width,_t.height,tt.depth,0,_t.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?D&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,_t.width,_t.height,tt.depth,gt,Pt,_t.data):e.texImage3D(i.TEXTURE_2D_ARRAY,V,Lt,_t.width,_t.height,tt.depth,0,gt,Pt,_t.data)}else{Ut&&fe&&e.texStorage2D(i.TEXTURE_2D,ht,Lt,zt[0].width,zt[0].height);for(let V=0,j=zt.length;V<j;V++)_t=zt[V],M.format!==Cn?gt!==null?Ut?D&&e.compressedTexSubImage2D(i.TEXTURE_2D,V,0,0,_t.width,_t.height,gt,_t.data):e.compressedTexImage2D(i.TEXTURE_2D,V,Lt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?D&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,_t.width,_t.height,gt,Pt,_t.data):e.texImage2D(i.TEXTURE_2D,V,Lt,_t.width,_t.height,0,gt,Pt,_t.data)}else if(M.isDataArrayTexture)if(Ut){if(fe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,Lt,tt.width,tt.height,tt.depth),D)if(M.layerUpdates.size>0){const V=Uh(tt.width,tt.height,M.format,M.type);for(const j of M.layerUpdates){const at=tt.data.subarray(j*V/tt.data.BYTES_PER_ELEMENT,(j+1)*V/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,tt.width,tt.height,1,gt,Pt,at)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,gt,Pt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Lt,tt.width,tt.height,tt.depth,0,gt,Pt,tt.data);else if(M.isData3DTexture)Ut?(fe&&e.texStorage3D(i.TEXTURE_3D,ht,Lt,tt.width,tt.height,tt.depth),D&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,gt,Pt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,Lt,tt.width,tt.height,tt.depth,0,gt,Pt,tt.data);else if(M.isFramebufferTexture){if(fe)if(Ut)e.texStorage2D(i.TEXTURE_2D,ht,Lt,tt.width,tt.height);else{let V=tt.width,j=tt.height;for(let at=0;at<ht;at++)e.texImage2D(i.TEXTURE_2D,at,Lt,V,j,0,gt,Pt,null),V>>=1,j>>=1}}else if(zt.length>0){if(Ut&&fe){const V=It(zt[0]);e.texStorage2D(i.TEXTURE_2D,ht,Lt,V.width,V.height)}for(let V=0,j=zt.length;V<j;V++)_t=zt[V],Ut?D&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,gt,Pt,_t):e.texImage2D(i.TEXTURE_2D,V,Lt,gt,Pt,_t);M.generateMipmaps=!1}else if(Ut){if(fe){const V=It(tt);e.texStorage2D(i.TEXTURE_2D,ht,Lt,V.width,V.height)}D&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt,Pt,tt)}else e.texImage2D(i.TEXTURE_2D,0,Lt,gt,Pt,tt);m(M)&&p($),St.__version=q.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Y(R,M,O){if(M.image.length!==6)return;const $=$t(R,M),J=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+O);const q=n.get(J);if(J.version!==q.__version||$===!0){e.activeTexture(i.TEXTURE0+O);const St=te.getPrimaries(te.workingColorSpace),rt=M.colorSpace===pi?null:te.getPrimaries(M.colorSpace),mt=M.colorSpace===pi||St===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt);const Xt=M.isCompressedTexture||M.image[0].isCompressedTexture,tt=M.image[0]&&M.image[0].isDataTexture,gt=[];for(let j=0;j<6;j++)!Xt&&!tt?gt[j]=v(M.image[j],!0,s.maxCubemapSize):gt[j]=tt?M.image[j].image:M.image[j],gt[j]=pe(M,gt[j]);const Pt=gt[0],Lt=r.convert(M.format,M.colorSpace),_t=r.convert(M.type),zt=S(M.internalFormat,Lt,_t,M.colorSpace),Ut=M.isVideoTexture!==!0,fe=q.__version===void 0||$===!0,D=J.dataReady;let ht=y(M,Pt);yt(i.TEXTURE_CUBE_MAP,M);let V;if(Xt){Ut&&fe&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,zt,Pt.width,Pt.height);for(let j=0;j<6;j++){V=gt[j].mipmaps;for(let at=0;at<V.length;at++){const ut=V[at];M.format!==Cn?Lt!==null?Ut?D&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at,0,0,ut.width,ut.height,Lt,ut.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at,zt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at,0,0,ut.width,ut.height,Lt,_t,ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at,zt,ut.width,ut.height,0,Lt,_t,ut.data)}}}else{if(V=M.mipmaps,Ut&&fe){V.length>0&&ht++;const j=It(gt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,zt,j.width,j.height)}for(let j=0;j<6;j++)if(tt){Ut?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,gt[j].width,gt[j].height,Lt,_t,gt[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,zt,gt[j].width,gt[j].height,0,Lt,_t,gt[j].data);for(let at=0;at<V.length;at++){const Vt=V[at].image[j].image;Ut?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at+1,0,0,Vt.width,Vt.height,Lt,_t,Vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at+1,zt,Vt.width,Vt.height,0,Lt,_t,Vt.data)}}else{Ut?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Lt,_t,gt[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,zt,Lt,_t,gt[j]);for(let at=0;at<V.length;at++){const ut=V[at];Ut?D&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at+1,0,0,Lt,_t,ut.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,at+1,zt,Lt,_t,ut.image[j])}}}m(M)&&p(i.TEXTURE_CUBE_MAP),q.__version=J.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Q(R,M,O,$,J,q){const St=r.convert(O.format,O.colorSpace),rt=r.convert(O.type),mt=S(O.internalFormat,St,rt,O.colorSpace);if(!n.get(M).__hasExternalTextures){const tt=Math.max(1,M.width>>q),gt=Math.max(1,M.height>>q);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,q,mt,tt,gt,M.depth,0,St,rt,null):e.texImage2D(J,q,mt,tt,gt,0,St,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),Wt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,J,n.get(O).__webglTexture,0,Bt(M)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,J,n.get(O).__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function xt(R,M,O){if(i.bindRenderbuffer(i.RENDERBUFFER,R),M.depthBuffer){const $=M.depthTexture,J=$&&$.isDepthTexture?$.type:null,q=x(M.stencilBuffer,J),St=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=Bt(M);Wt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,q,M.width,M.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,q,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,q,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,St,i.RENDERBUFFER,R)}else{const $=M.textures;for(let J=0;J<$.length;J++){const q=$[J],St=r.convert(q.format,q.colorSpace),rt=r.convert(q.type),mt=S(q.internalFormat,St,rt,q.colorSpace),Xt=Bt(M);O&&Wt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xt,mt,M.width,M.height):Wt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xt,mt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,mt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function pt(R,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X(M.depthTexture,0);const $=n.get(M.depthTexture).__webglTexture,J=Bt(M);if(M.depthTexture.format===ys)Wt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(M.depthTexture.format===Cs)Wt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Dt(R){const M=n.get(R),O=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const $=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),$){const J=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),M.__depthDisposeCallback=J}M.__boundDepthTexture=$}if(R.depthTexture&&!M.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");pt(M.__webglFramebuffer,R)}else if(O){M.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[$]),M.__webglDepthbuffer[$]===void 0)M.__webglDepthbuffer[$]=i.createRenderbuffer(),xt(M.__webglDepthbuffer[$],R,!1);else{const J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=M.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),xt(M.__webglDepthbuffer,R,!1);else{const $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,J)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function At(R,M,O){const $=n.get(R);M!==void 0&&Q($.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Dt(R)}function Ht(R){const M=R.texture,O=n.get(R),$=n.get(M);R.addEventListener("dispose",C);const J=R.textures,q=R.isWebGLCubeRenderTarget===!0,St=J.length>1;if(St||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=M.version,o.memory.textures++),q){O.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer[rt]=[];for(let mt=0;mt<M.mipmaps.length;mt++)O.__webglFramebuffer[rt][mt]=i.createFramebuffer()}else O.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer=[];for(let rt=0;rt<M.mipmaps.length;rt++)O.__webglFramebuffer[rt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(St)for(let rt=0,mt=J.length;rt<mt;rt++){const Xt=n.get(J[rt]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Wt(R)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let rt=0;rt<J.length;rt++){const mt=J[rt];O.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[rt]);const Xt=r.convert(mt.format,mt.colorSpace),tt=r.convert(mt.type),gt=S(mt.internalFormat,Xt,tt,mt.colorSpace,R.isXRRenderTarget===!0),Pt=Bt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,gt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,O.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),xt(O.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),yt(i.TEXTURE_CUBE_MAP,M);for(let rt=0;rt<6;rt++)if(M.mipmaps&&M.mipmaps.length>0)for(let mt=0;mt<M.mipmaps.length;mt++)Q(O.__webglFramebuffer[rt][mt],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt);else Q(O.__webglFramebuffer[rt],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);m(M)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let rt=0,mt=J.length;rt<mt;rt++){const Xt=J[rt],tt=n.get(Xt);e.bindTexture(i.TEXTURE_2D,tt.__webglTexture),yt(i.TEXTURE_2D,Xt),Q(O.__webglFramebuffer,R,Xt,i.COLOR_ATTACHMENT0+rt,i.TEXTURE_2D,0),m(Xt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(rt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,$.__webglTexture),yt(rt,M),M.mipmaps&&M.mipmaps.length>0)for(let mt=0;mt<M.mipmaps.length;mt++)Q(O.__webglFramebuffer[mt],R,M,i.COLOR_ATTACHMENT0,rt,mt);else Q(O.__webglFramebuffer,R,M,i.COLOR_ATTACHMENT0,rt,0);m(M)&&p(rt),e.unbindTexture()}R.depthBuffer&&Dt(R)}function ae(R){const M=R.textures;for(let O=0,$=M.length;O<$;O++){const J=M[O];if(m(J)){const q=R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,St=n.get(J).__webglTexture;e.bindTexture(q,St),p(q),e.unbindTexture()}}}const Gt=[],L=[];function sn(R){if(R.samples>0){if(Wt(R)===!1){const M=R.textures,O=R.width,$=R.height;let J=i.COLOR_BUFFER_BIT;const q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(R),rt=M.length>1;if(rt)for(let mt=0;mt<M.length;mt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let mt=0;mt<M.length;mt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[mt]);const Xt=n.get(M[mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Xt,0)}i.blitFramebuffer(0,0,O,$,0,0,O,$,J,i.NEAREST),c===!0&&(Gt.length=0,L.length=0,Gt.push(i.COLOR_ATTACHMENT0+mt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Gt.push(q),L.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Gt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let mt=0;mt<M.length;mt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,St.__webglColorRenderbuffer[mt]);const Xt=n.get(M[mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,Xt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const M=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Bt(R){return Math.min(s.maxSamples,R.samples)}function Wt(R){const M=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ct(R){const M=o.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function pe(R,M){const O=R.colorSpace,$=R.format,J=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==yi&&O!==pi&&(te.getTransfer(O)===ge?($!==Cn||J!==Jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),M}function It(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=w,this.setTexture2D=X,this.setTexture2DArray=K,this.setTexture3D=G,this.setTextureCube=Z,this.rebindTextures=At,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=sn,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=Wt}function kv(i,t){function e(n,s=pi){let r;const o=te.getTransfer(s);if(n===Jn)return i.UNSIGNED_BYTE;if(n===tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===el)return i.UNSIGNED_SHORT_5_5_5_1;if(n===pd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===dd)return i.BYTE;if(n===fd)return i.SHORT;if(n===hr)return i.UNSIGNED_SHORT;if(n===Qc)return i.INT;if(n===$i)return i.UNSIGNED_INT;if(n===$n)return i.FLOAT;if(n===pr)return i.HALF_FLOAT;if(n===md)return i.ALPHA;if(n===gd)return i.RGB;if(n===Cn)return i.RGBA;if(n===_d)return i.LUMINANCE;if(n===vd)return i.LUMINANCE_ALPHA;if(n===ys)return i.DEPTH_COMPONENT;if(n===Cs)return i.DEPTH_STENCIL;if(n===xd)return i.RED;if(n===nl)return i.RED_INTEGER;if(n===Md)return i.RG;if(n===il)return i.RG_INTEGER;if(n===sl)return i.RGBA_INTEGER;if(n===fo||n===po||n===mo||n===go)if(o===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===fo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===go)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===fo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===po)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===mo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===go)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===lc||n===hc||n===uc||n===dc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===lc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===hc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===uc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===dc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fc||n===pc||n===mc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fc||n===pc)return o===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===mc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===gc||n===_c||n===vc||n===xc||n===Mc||n===yc||n===Sc||n===Ec||n===wc||n===bc||n===Tc||n===Ac||n===Rc||n===Cc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===gc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===_c)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===vc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===xc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Mc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===yc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Sc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ec)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===wc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Tc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ac)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Rc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Cc)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_o||n===Pc||n===Lc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===_o)return o===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Pc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Lc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===yd||n===Ic||n===Dc||n===Uc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===_o)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Dc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Uc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Hv extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class oe extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Gv={type:"move"};class ba{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Gv)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new oe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Vv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Wv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Xv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new je,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Mi({vertexShader:Vv,fragmentShader:Wv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new lt(new Fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Yv extends Us{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=new Xv,m=e.getContextAttributes();let p=null,S=null;const x=[],y=[],I=new st;let C=null;const A=new Qe;A.layers.enable(1),A.viewport=new le;const P=new Qe;P.layers.enable(2),P.viewport=new le;const H=[A,P],_=new Hv;_.layers.enable(1),_.layers.enable(2);let w=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=x[Y];return Q===void 0&&(Q=new ba,x[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=x[Y];return Q===void 0&&(Q=new ba,x[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=x[Y];return Q===void 0&&(Q=new ba,x[Y]=Q),Q.getHandSpace()};function k(Y){const Q=y.indexOf(Y.inputSource);if(Q===-1)return;const xt=x[Q];xt!==void 0&&(xt.update(Y.inputSource,Y.frame,l||o),xt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",K);for(let Y=0;Y<x.length;Y++){const Q=y[Y];Q!==null&&(y[Y]=null,x[Y].disconnect(Q))}w=null,z=null,v.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,S=null,ne.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",X),s.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(I),s.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new ji(f.framebufferWidth,f.framebufferHeight,{format:Cn,type:Jn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,xt=null,pt=null;m.depth&&(pt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=m.stencil?Cs:ys,xt=m.stencil?Rs:$i);const Dt={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Dt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),S=new ji(d.textureWidth,d.textureHeight,{format:Cn,type:Jn,depthTexture:new Nd(d.textureWidth,d.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),ne.setContext(s),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function K(Y){for(let Q=0;Q<Y.removed.length;Q++){const xt=Y.removed[Q],pt=y.indexOf(xt);pt>=0&&(y[pt]=null,x[pt].disconnect(xt))}for(let Q=0;Q<Y.added.length;Q++){const xt=Y.added[Q];let pt=y.indexOf(xt);if(pt===-1){for(let At=0;At<x.length;At++)if(At>=y.length){y.push(xt),pt=At;break}else if(y[At]===null){y[At]=xt,pt=At;break}if(pt===-1)break}const Dt=x[pt];Dt&&Dt.connect(xt)}}const G=new T,Z=new T;function W(Y,Q,xt){G.setFromMatrixPosition(Q.matrixWorld),Z.setFromMatrixPosition(xt.matrixWorld);const pt=G.distanceTo(Z),Dt=Q.projectionMatrix.elements,At=xt.projectionMatrix.elements,Ht=Dt[14]/(Dt[10]-1),ae=Dt[14]/(Dt[10]+1),Gt=(Dt[9]+1)/Dt[5],L=(Dt[9]-1)/Dt[5],sn=(Dt[8]-1)/Dt[0],Bt=(At[8]+1)/At[0],Wt=Ht*sn,Ct=Ht*Bt,pe=pt/(-sn+Bt),It=pe*-sn;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(It),Y.translateZ(pe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Dt[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const R=Ht+pe,M=ae+pe,O=Wt-It,$=Ct+(pt-It),J=Gt*ae/M*R,q=L*ae/M*R;Y.projectionMatrix.makePerspective(O,$,J,q,R,M),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function dt(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let Q=Y.near,xt=Y.far;v.texture!==null&&(v.depthNear>0&&(Q=v.depthNear),v.depthFar>0&&(xt=v.depthFar)),_.near=P.near=A.near=Q,_.far=P.far=A.far=xt,(w!==_.near||z!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),w=_.near,z=_.far);const pt=Y.parent,Dt=_.cameras;dt(_,pt);for(let At=0;At<Dt.length;At++)dt(Dt[At],pt);Dt.length===2?W(_,A,P):_.projectionMatrix.copy(A.projectionMatrix),ft(Y,_,pt)};function ft(Y,Q,xt){xt===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(xt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ur*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let yt=null;function $t(Y,Q){if(h=Q.getViewerPose(l||o),g=Q,h!==null){const xt=h.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let pt=!1;xt.length!==_.cameras.length&&(_.cameras.length=0,pt=!0);for(let At=0;At<xt.length;At++){const Ht=xt[At];let ae=null;if(f!==null)ae=f.getViewport(Ht);else{const L=u.getViewSubImage(d,Ht);ae=L.viewport,At===0&&(t.setRenderTargetTextures(S,L.colorTexture,d.ignoreDepthValues?void 0:L.depthStencilTexture),t.setRenderTarget(S))}let Gt=H[At];Gt===void 0&&(Gt=new Qe,Gt.layers.enable(At),Gt.viewport=new le,H[At]=Gt),Gt.matrix.fromArray(Ht.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(Ht.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(ae.x,ae.y,ae.width,ae.height),At===0&&(_.matrix.copy(Gt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),pt===!0&&_.cameras.push(Gt)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")){const At=u.getDepthInformation(xt[0]);At&&At.isValid&&At.texture&&v.init(t,At,s.renderState)}}for(let xt=0;xt<x.length;xt++){const pt=y[xt],Dt=x[xt];pt!==null&&Dt!==void 0&&Dt.update(pt,Q,l||o)}yt&&yt(Y,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const ne=new Dd;ne.setAnimationLoop($t),this.setAnimationLoop=function(Y){yt=Y},this.dispose=function(){}}}const Di=new nn,qv=new Zt;function $v(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Pd(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,S,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===$e&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===$e&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),x=S.envMap,y=S.envMapRotation;x&&(m.envMap.value=x,Di.copy(y),Di.x*=-1,Di.y*=-1,Di.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),m.envMapRotation.value.setFromMatrix4(qv.makeRotationFromEuler(Di)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$e&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function jv(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,x){const y=x.program;n.uniformBlockBinding(S,y)}function l(S,x){let y=s[S.id];y===void 0&&(g(S),y=h(S),s[S.id]=y,S.addEventListener("dispose",m));const I=x.program;n.updateUBOMapping(S,I);const C=t.render.frame;r[S.id]!==C&&(d(S),r[S.id]=C)}function h(S){const x=u();S.__bindingPointIndex=x;const y=i.createBuffer(),I=S.__size,C=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,I,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,y),y}function u(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const x=s[S.id],y=S.uniforms,I=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let C=0,A=y.length;C<A;C++){const P=Array.isArray(y[C])?y[C]:[y[C]];for(let H=0,_=P.length;H<_;H++){const w=P[H];if(f(w,C,H,I)===!0){const z=w.__offset,k=Array.isArray(w.value)?w.value:[w.value];let X=0;for(let K=0;K<k.length;K++){const G=k[K],Z=v(G);typeof G=="number"||typeof G=="boolean"?(w.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,z+X,w.__data)):G.isMatrix3?(w.__data[0]=G.elements[0],w.__data[1]=G.elements[1],w.__data[2]=G.elements[2],w.__data[3]=0,w.__data[4]=G.elements[3],w.__data[5]=G.elements[4],w.__data[6]=G.elements[5],w.__data[7]=0,w.__data[8]=G.elements[6],w.__data[9]=G.elements[7],w.__data[10]=G.elements[8],w.__data[11]=0):(G.toArray(w.__data,X),X+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,x,y,I){const C=S.value,A=x+"_"+y;if(I[A]===void 0)return typeof C=="number"||typeof C=="boolean"?I[A]=C:I[A]=C.clone(),!0;{const P=I[A];if(typeof C=="number"||typeof C=="boolean"){if(P!==C)return I[A]=C,!0}else if(P.equals(C)===!1)return P.copy(C),!0}return!1}function g(S){const x=S.uniforms;let y=0;const I=16;for(let A=0,P=x.length;A<P;A++){const H=Array.isArray(x[A])?x[A]:[x[A]];for(let _=0,w=H.length;_<w;_++){const z=H[_],k=Array.isArray(z.value)?z.value:[z.value];for(let X=0,K=k.length;X<K;X++){const G=k[X],Z=v(G),W=y%I,dt=W%Z.boundary,ft=W+dt;y+=dt,ft!==0&&I-ft<Z.storage&&(y+=I-ft),z.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=y,y+=Z.storage}}}const C=y%I;return C>0&&(y+=I-C),S.__size=y,S.__cache={},this}function v(S){const x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function m(S){const x=S.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class Kv{constructor(t={}){const{canvas:e=Fp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=bn,this.toneMapping=_i,this.toneMappingExposure=1;const x=this;let y=!1,I=0,C=0,A=null,P=-1,H=null;const _=new le,w=new le;let z=null;const k=new bt(0);let X=0,K=e.width,G=e.height,Z=1,W=null,dt=null;const ft=new le(0,0,K,G),yt=new le(0,0,K,G);let $t=!1;const ne=new cl;let Y=!1,Q=!1;const xt=new Zt,pt=new Zt,Dt=new T,At=new le,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ae=!1;function Gt(){return A===null?Z:1}let L=n;function sn(E,U){return e.getContext(E,U)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jc}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",at,!1),e.addEventListener("webglcontextcreationerror",ut,!1),L===null){const U="webgl2";if(L=sn(U,E),L===null)throw sn(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Bt,Wt,Ct,pe,It,R,M,O,$,J,q,St,rt,mt,Xt,tt,gt,Pt,Lt,_t,zt,Ut,fe,D;function ht(){Bt=new e_(L),Bt.init(),Ut=new kv(L,Bt),Wt=new j0(L,Bt,t,Ut),Ct=new Fv(L),Wt.reverseDepthBuffer&&Ct.buffers.depth.setReversed(!0),pe=new s_(L),It=new Sv,R=new zv(L,Bt,Ct,It,Wt,Ut,pe),M=new Z0(x),O=new t_(x),$=new um(L),fe=new q0(L,$),J=new n_(L,$,pe,fe),q=new o_(L,J,$,pe),Lt=new r_(L,Wt,R),tt=new K0(It),St=new yv(x,M,O,Bt,Wt,fe,tt),rt=new $v(x,It),mt=new wv,Xt=new Pv(Bt),Pt=new Y0(x,M,O,Ct,q,d,c),gt=new Nv(x,q,Wt),D=new jv(L,pe,Wt,Ct),_t=new $0(L,Bt,pe),zt=new i_(L,Bt,pe),pe.programs=St.programs,x.capabilities=Wt,x.extensions=Bt,x.properties=It,x.renderLists=mt,x.shadowMap=gt,x.state=Ct,x.info=pe}ht();const V=new Yv(x,L);this.xr=V,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=Bt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Bt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(E){E!==void 0&&(Z=E,this.setSize(K,G,!1))},this.getSize=function(E){return E.set(K,G)},this.setSize=function(E,U,F=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=E,G=U,e.width=Math.floor(E*Z),e.height=Math.floor(U*Z),F===!0&&(e.style.width=E+"px",e.style.height=U+"px"),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(K*Z,G*Z).floor()},this.setDrawingBufferSize=function(E,U,F){K=E,G=U,Z=F,e.width=Math.floor(E*F),e.height=Math.floor(U*F),this.setViewport(0,0,E,U)},this.getCurrentViewport=function(E){return E.copy(_)},this.getViewport=function(E){return E.copy(ft)},this.setViewport=function(E,U,F,B){E.isVector4?ft.set(E.x,E.y,E.z,E.w):ft.set(E,U,F,B),Ct.viewport(_.copy(ft).multiplyScalar(Z).round())},this.getScissor=function(E){return E.copy(yt)},this.setScissor=function(E,U,F,B){E.isVector4?yt.set(E.x,E.y,E.z,E.w):yt.set(E,U,F,B),Ct.scissor(w.copy(yt).multiplyScalar(Z).round())},this.getScissorTest=function(){return $t},this.setScissorTest=function(E){Ct.setScissorTest($t=E)},this.setOpaqueSort=function(E){W=E},this.setTransparentSort=function(E){dt=E},this.getClearColor=function(E){return E.copy(Pt.getClearColor())},this.setClearColor=function(){Pt.setClearColor.apply(Pt,arguments)},this.getClearAlpha=function(){return Pt.getClearAlpha()},this.setClearAlpha=function(){Pt.setClearAlpha.apply(Pt,arguments)},this.clear=function(E=!0,U=!0,F=!0){let B=0;if(E){let N=!1;if(A!==null){const et=A.texture.format;N=et===sl||et===il||et===nl}if(N){const et=A.texture.type,ct=et===Jn||et===$i||et===hr||et===Rs||et===tl||et===el,vt=Pt.getClearColor(),Mt=Pt.getClearAlpha(),Tt=vt.r,Rt=vt.g,Et=vt.b;ct?(f[0]=Tt,f[1]=Rt,f[2]=Et,f[3]=Mt,L.clearBufferuiv(L.COLOR,0,f)):(g[0]=Tt,g[1]=Rt,g[2]=Et,g[3]=Mt,L.clearBufferiv(L.COLOR,0,g))}else B|=L.COLOR_BUFFER_BIT}U&&(B|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),F&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",at,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),mt.dispose(),Xt.dispose(),It.dispose(),M.dispose(),O.dispose(),q.dispose(),fe.dispose(),D.dispose(),St.dispose(),V.dispose(),V.removeEventListener("sessionstart",Ul),V.removeEventListener("sessionend",Nl),Ai.stop()};function j(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function at(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const E=pe.autoReset,U=gt.enabled,F=gt.autoUpdate,B=gt.needsUpdate,N=gt.type;ht(),pe.autoReset=E,gt.enabled=U,gt.autoUpdate=F,gt.needsUpdate=B,gt.type=N}function ut(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Vt(E){const U=E.target;U.removeEventListener("dispose",Vt),Se(U)}function Se(E){Ke(E),It.remove(E)}function Ke(E){const U=It.get(E).programs;U!==void 0&&(U.forEach(function(F){St.releaseProgram(F)}),E.isShaderMaterial&&St.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,F,B,N,et){U===null&&(U=Ht);const ct=N.isMesh&&N.matrixWorld.determinant()<0,vt=Cf(E,U,F,B,N);Ct.setMaterial(B,ct);let Mt=F.index,Tt=1;if(B.wireframe===!0){if(Mt=J.getWireframeAttribute(F),Mt===void 0)return;Tt=2}const Rt=F.drawRange,Et=F.attributes.position;let ie=Rt.start*Tt,me=(Rt.start+Rt.count)*Tt;et!==null&&(ie=Math.max(ie,et.start*Tt),me=Math.min(me,(et.start+et.count)*Tt)),Mt!==null?(ie=Math.max(ie,0),me=Math.min(me,Mt.count)):Et!=null&&(ie=Math.max(ie,0),me=Math.min(me,Et.count));const ve=me-ie;if(ve<0||ve===1/0)return;fe.setup(N,B,vt,F,Mt);let rn,Jt=_t;if(Mt!==null&&(rn=$.get(Mt),Jt=zt,Jt.setIndex(rn)),N.isMesh)B.wireframe===!0?(Ct.setLineWidth(B.wireframeLinewidth*Gt()),Jt.setMode(L.LINES)):Jt.setMode(L.TRIANGLES);else if(N.isLine){let wt=B.linewidth;wt===void 0&&(wt=1),Ct.setLineWidth(wt*Gt()),N.isLineSegments?Jt.setMode(L.LINES):N.isLineLoop?Jt.setMode(L.LINE_LOOP):Jt.setMode(L.LINE_STRIP)}else N.isPoints?Jt.setMode(L.POINTS):N.isSprite&&Jt.setMode(L.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Jt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Bt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const wt=N._multiDrawStarts,Oe=N._multiDrawCounts,Qt=N._multiDrawCount,yn=Mt?$.get(Mt).bytesPerElement:1,Zi=It.get(B).currentProgram.getUniforms();for(let on=0;on<Qt;on++)Zi.setValue(L,"_gl_DrawID",on),Jt.render(wt[on]/yn,Oe[on])}else if(N.isInstancedMesh)Jt.renderInstances(ie,ve,N.count);else if(F.isInstancedBufferGeometry){const wt=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,Oe=Math.min(F.instanceCount,wt);Jt.renderInstances(ie,ve,Oe)}else Jt.render(ie,ve)};function jt(E,U,F){E.transparent===!0&&E.side===Ue&&E.forceSinglePass===!1?(E.side=$e,E.needsUpdate=!0,Sr(E,U,F),E.side=xi,E.needsUpdate=!0,Sr(E,U,F),E.side=Ue):Sr(E,U,F)}this.compile=function(E,U,F=null){F===null&&(F=E),m=Xt.get(F),m.init(U),S.push(m),F.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),E!==F&&E.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),m.setupLights();const B=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const et=N.material;if(et)if(Array.isArray(et))for(let ct=0;ct<et.length;ct++){const vt=et[ct];jt(vt,F,N),B.add(vt)}else jt(et,F,N),B.add(et)}),S.pop(),m=null,B},this.compileAsync=function(E,U,F=null){const B=this.compile(E,U,F);return new Promise(N=>{function et(){if(B.forEach(function(ct){It.get(ct).currentProgram.isReady()&&B.delete(ct)}),B.size===0){N(E);return}setTimeout(et,10)}Bt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Ze=null;function zn(E){Ze&&Ze(E)}function Ul(){Ai.stop()}function Nl(){Ai.start()}const Ai=new Dd;Ai.setAnimationLoop(zn),typeof self<"u"&&Ai.setContext(self),this.setAnimationLoop=function(E){Ze=E,V.setAnimationLoop(E),E===null?Ai.stop():Ai.start()},V.addEventListener("sessionstart",Ul),V.addEventListener("sessionend",Nl),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(U),U=V.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,U,A),m=Xt.get(E,S.length),m.init(U),S.push(m),pt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ne.setFromProjectionMatrix(pt),Q=this.localClippingEnabled,Y=tt.init(this.clippingPlanes,Q),v=mt.get(E,p.length),v.init(),p.push(v),V.enabled===!0&&V.isPresenting===!0){const et=x.xr.getDepthSensingMesh();et!==null&&qo(et,U,-1/0,x.sortObjects)}qo(E,U,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(W,dt),ae=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,ae&&Pt.addToRenderList(v,E),this.info.render.frame++,Y===!0&&tt.beginShadows();const F=m.state.shadowsArray;gt.render(F,E,U),Y===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=v.opaque,N=v.transmissive;if(m.setupLights(),U.isArrayCamera){const et=U.cameras;if(N.length>0)for(let ct=0,vt=et.length;ct<vt;ct++){const Mt=et[ct];Fl(B,N,E,Mt)}ae&&Pt.render(E);for(let ct=0,vt=et.length;ct<vt;ct++){const Mt=et[ct];Ol(v,E,Mt,Mt.viewport)}}else N.length>0&&Fl(B,N,E,U),ae&&Pt.render(E),Ol(v,E,U);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(x,E,U),fe.resetDefaultState(),P=-1,H=null,S.pop(),S.length>0?(m=S[S.length-1],Y===!0&&tt.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function qo(E,U,F,B){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)F=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ne.intersectsSprite(E)){B&&At.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pt);const ct=q.update(E),vt=E.material;vt.visible&&v.push(E,ct,vt,F,At.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ne.intersectsObject(E))){const ct=q.update(E),vt=E.material;if(B&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),At.copy(E.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),At.copy(ct.boundingSphere.center)),At.applyMatrix4(E.matrixWorld).applyMatrix4(pt)),Array.isArray(vt)){const Mt=ct.groups;for(let Tt=0,Rt=Mt.length;Tt<Rt;Tt++){const Et=Mt[Tt],ie=vt[Et.materialIndex];ie&&ie.visible&&v.push(E,ct,ie,F,At.z,Et)}}else vt.visible&&v.push(E,ct,vt,F,At.z,null)}}const et=E.children;for(let ct=0,vt=et.length;ct<vt;ct++)qo(et[ct],U,F,B)}function Ol(E,U,F,B){const N=E.opaque,et=E.transmissive,ct=E.transparent;m.setupLightsView(F),Y===!0&&tt.setGlobalState(x.clippingPlanes,F),B&&Ct.viewport(_.copy(B)),N.length>0&&yr(N,U,F),et.length>0&&yr(et,U,F),ct.length>0&&yr(ct,U,F),Ct.buffers.depth.setTest(!0),Ct.buffers.depth.setMask(!0),Ct.buffers.color.setMask(!0),Ct.setPolygonOffset(!1)}function Fl(E,U,F,B){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[B.id]===void 0&&(m.state.transmissionRenderTarget[B.id]=new ji(1,1,{generateMipmaps:!0,type:Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float")?pr:Jn,minFilter:Vi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace}));const et=m.state.transmissionRenderTarget[B.id],ct=B.viewport||_;et.setSize(ct.z,ct.w);const vt=x.getRenderTarget();x.setRenderTarget(et),x.getClearColor(k),X=x.getClearAlpha(),X<1&&x.setClearColor(16777215,.5),x.clear(),ae&&Pt.render(F);const Mt=x.toneMapping;x.toneMapping=_i;const Tt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),m.setupLightsView(B),Y===!0&&tt.setGlobalState(x.clippingPlanes,B),yr(E,F,B),R.updateMultisampleRenderTarget(et),R.updateRenderTargetMipmap(et),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let Et=0,ie=U.length;Et<ie;Et++){const me=U[Et],ve=me.object,rn=me.geometry,Jt=me.material,wt=me.group;if(Jt.side===Ue&&ve.layers.test(B.layers)){const Oe=Jt.side;Jt.side=$e,Jt.needsUpdate=!0,Bl(ve,F,B,rn,Jt,wt),Jt.side=Oe,Jt.needsUpdate=!0,Rt=!0}}Rt===!0&&(R.updateMultisampleRenderTarget(et),R.updateRenderTargetMipmap(et))}x.setRenderTarget(vt),x.setClearColor(k,X),Tt!==void 0&&(B.viewport=Tt),x.toneMapping=Mt}function yr(E,U,F){const B=U.isScene===!0?U.overrideMaterial:null;for(let N=0,et=E.length;N<et;N++){const ct=E[N],vt=ct.object,Mt=ct.geometry,Tt=B===null?ct.material:B,Rt=ct.group;vt.layers.test(F.layers)&&Bl(vt,U,F,Mt,Tt,Rt)}}function Bl(E,U,F,B,N,et){E.onBeforeRender(x,U,F,B,N,et),E.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(x,U,F,B,E,et),N.transparent===!0&&N.side===Ue&&N.forceSinglePass===!1?(N.side=$e,N.needsUpdate=!0,x.renderBufferDirect(F,U,B,N,E,et),N.side=xi,N.needsUpdate=!0,x.renderBufferDirect(F,U,B,N,E,et),N.side=Ue):x.renderBufferDirect(F,U,B,N,E,et),E.onAfterRender(x,U,F,B,N,et)}function Sr(E,U,F){U.isScene!==!0&&(U=Ht);const B=It.get(E),N=m.state.lights,et=m.state.shadowsArray,ct=N.state.version,vt=St.getParameters(E,N.state,et,U,F),Mt=St.getProgramCacheKey(vt);let Tt=B.programs;B.environment=E.isMeshStandardMaterial?U.environment:null,B.fog=U.fog,B.envMap=(E.isMeshStandardMaterial?O:M).get(E.envMap||B.environment),B.envMapRotation=B.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Tt===void 0&&(E.addEventListener("dispose",Vt),Tt=new Map,B.programs=Tt);let Rt=Tt.get(Mt);if(Rt!==void 0){if(B.currentProgram===Rt&&B.lightsStateVersion===ct)return kl(E,vt),Rt}else vt.uniforms=St.getUniforms(E),E.onBeforeCompile(vt,x),Rt=St.acquireProgram(vt,Mt),Tt.set(Mt,Rt),B.uniforms=vt.uniforms;const Et=B.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Et.clippingPlanes=tt.uniform),kl(E,vt),B.needsLights=Lf(E),B.lightsStateVersion=ct,B.needsLights&&(Et.ambientLightColor.value=N.state.ambient,Et.lightProbe.value=N.state.probe,Et.directionalLights.value=N.state.directional,Et.directionalLightShadows.value=N.state.directionalShadow,Et.spotLights.value=N.state.spot,Et.spotLightShadows.value=N.state.spotShadow,Et.rectAreaLights.value=N.state.rectArea,Et.ltc_1.value=N.state.rectAreaLTC1,Et.ltc_2.value=N.state.rectAreaLTC2,Et.pointLights.value=N.state.point,Et.pointLightShadows.value=N.state.pointShadow,Et.hemisphereLights.value=N.state.hemi,Et.directionalShadowMap.value=N.state.directionalShadowMap,Et.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Et.spotShadowMap.value=N.state.spotShadowMap,Et.spotLightMatrix.value=N.state.spotLightMatrix,Et.spotLightMap.value=N.state.spotLightMap,Et.pointShadowMap.value=N.state.pointShadowMap,Et.pointShadowMatrix.value=N.state.pointShadowMatrix),B.currentProgram=Rt,B.uniformsList=null,Rt}function zl(E){if(E.uniformsList===null){const U=E.currentProgram.getUniforms();E.uniformsList=xo.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function kl(E,U){const F=It.get(E);F.outputColorSpace=U.outputColorSpace,F.batching=U.batching,F.batchingColor=U.batchingColor,F.instancing=U.instancing,F.instancingColor=U.instancingColor,F.instancingMorph=U.instancingMorph,F.skinning=U.skinning,F.morphTargets=U.morphTargets,F.morphNormals=U.morphNormals,F.morphColors=U.morphColors,F.morphTargetsCount=U.morphTargetsCount,F.numClippingPlanes=U.numClippingPlanes,F.numIntersection=U.numClipIntersection,F.vertexAlphas=U.vertexAlphas,F.vertexTangents=U.vertexTangents,F.toneMapping=U.toneMapping}function Cf(E,U,F,B,N){U.isScene!==!0&&(U=Ht),R.resetTextureUnits();const et=U.fog,ct=B.isMeshStandardMaterial?U.environment:null,vt=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:yi,Mt=(B.isMeshStandardMaterial?O:M).get(B.envMap||ct),Tt=B.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Rt=!!F.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Et=!!F.morphAttributes.position,ie=!!F.morphAttributes.normal,me=!!F.morphAttributes.color;let ve=_i;B.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ve=x.toneMapping);const rn=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Jt=rn!==void 0?rn.length:0,wt=It.get(B),Oe=m.state.lights;if(Y===!0&&(Q===!0||E!==H)){const fn=E===H&&B.id===P;tt.setState(B,E,fn)}let Qt=!1;B.version===wt.__version?(wt.needsLights&&wt.lightsStateVersion!==Oe.state.version||wt.outputColorSpace!==vt||N.isBatchedMesh&&wt.batching===!1||!N.isBatchedMesh&&wt.batching===!0||N.isBatchedMesh&&wt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&wt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&wt.instancing===!1||!N.isInstancedMesh&&wt.instancing===!0||N.isSkinnedMesh&&wt.skinning===!1||!N.isSkinnedMesh&&wt.skinning===!0||N.isInstancedMesh&&wt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&wt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&wt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&wt.instancingMorph===!1&&N.morphTexture!==null||wt.envMap!==Mt||B.fog===!0&&wt.fog!==et||wt.numClippingPlanes!==void 0&&(wt.numClippingPlanes!==tt.numPlanes||wt.numIntersection!==tt.numIntersection)||wt.vertexAlphas!==Tt||wt.vertexTangents!==Rt||wt.morphTargets!==Et||wt.morphNormals!==ie||wt.morphColors!==me||wt.toneMapping!==ve||wt.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,wt.__version=B.version);let yn=wt.currentProgram;Qt===!0&&(yn=Sr(B,U,N));let Zi=!1,on=!1,$o=!1;const xe=yn.getUniforms(),ni=wt.uniforms;if(Ct.useProgram(yn.program)&&(Zi=!0,on=!0,$o=!0),B.id!==P&&(P=B.id,on=!0),Zi||H!==E){Wt.reverseDepthBuffer?(xt.copy(E.projectionMatrix),zp(xt),kp(xt),xe.setValue(L,"projectionMatrix",xt)):xe.setValue(L,"projectionMatrix",E.projectionMatrix),xe.setValue(L,"viewMatrix",E.matrixWorldInverse);const fn=xe.map.cameraPosition;fn!==void 0&&fn.setValue(L,Dt.setFromMatrixPosition(E.matrixWorld)),Wt.logarithmicDepthBuffer&&xe.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&xe.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),H!==E&&(H=E,on=!0,$o=!0)}if(N.isSkinnedMesh){xe.setOptional(L,N,"bindMatrix"),xe.setOptional(L,N,"bindMatrixInverse");const fn=N.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),xe.setValue(L,"boneTexture",fn.boneTexture,R))}N.isBatchedMesh&&(xe.setOptional(L,N,"batchingTexture"),xe.setValue(L,"batchingTexture",N._matricesTexture,R),xe.setOptional(L,N,"batchingIdTexture"),xe.setValue(L,"batchingIdTexture",N._indirectTexture,R),xe.setOptional(L,N,"batchingColorTexture"),N._colorsTexture!==null&&xe.setValue(L,"batchingColorTexture",N._colorsTexture,R));const jo=F.morphAttributes;if((jo.position!==void 0||jo.normal!==void 0||jo.color!==void 0)&&Lt.update(N,F,yn),(on||wt.receiveShadow!==N.receiveShadow)&&(wt.receiveShadow=N.receiveShadow,xe.setValue(L,"receiveShadow",N.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(ni.envMap.value=Mt,ni.flipEnvMap.value=Mt.isCubeTexture&&Mt.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&U.environment!==null&&(ni.envMapIntensity.value=U.environmentIntensity),on&&(xe.setValue(L,"toneMappingExposure",x.toneMappingExposure),wt.needsLights&&Pf(ni,$o),et&&B.fog===!0&&rt.refreshFogUniforms(ni,et),rt.refreshMaterialUniforms(ni,B,Z,G,m.state.transmissionRenderTarget[E.id]),xo.upload(L,zl(wt),ni,R)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(xo.upload(L,zl(wt),ni,R),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&xe.setValue(L,"center",N.center),xe.setValue(L,"modelViewMatrix",N.modelViewMatrix),xe.setValue(L,"normalMatrix",N.normalMatrix),xe.setValue(L,"modelMatrix",N.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const fn=B.uniformsGroups;for(let Ko=0,If=fn.length;Ko<If;Ko++){const Hl=fn[Ko];D.update(Hl,yn),D.bind(Hl,yn)}}return yn}function Pf(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Lf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,U,F){It.get(E.texture).__webglTexture=U,It.get(E.depthTexture).__webglTexture=F;const B=It.get(E);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=F===void 0,B.__autoAllocateDepthBuffer||Bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,U){const F=It.get(E);F.__webglFramebuffer=U,F.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(E,U=0,F=0){A=E,I=U,C=F;let B=!0,N=null,et=!1,ct=!1;if(E){const Mt=It.get(E);if(Mt.__useDefaultFramebuffer!==void 0)Ct.bindFramebuffer(L.FRAMEBUFFER,null),B=!1;else if(Mt.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(Mt.__hasExternalTextures)R.rebindTextures(E,It.get(E.texture).__webglTexture,It.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Et=E.depthTexture;if(Mt.__boundDepthTexture!==Et){if(Et!==null&&It.has(Et)&&(E.width!==Et.image.width||E.height!==Et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}const Tt=E.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(ct=!0);const Rt=It.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Rt[U])?N=Rt[U][F]:N=Rt[U],et=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?N=It.get(E).__webglMultisampledFramebuffer:Array.isArray(Rt)?N=Rt[F]:N=Rt,_.copy(E.viewport),w.copy(E.scissor),z=E.scissorTest}else _.copy(ft).multiplyScalar(Z).floor(),w.copy(yt).multiplyScalar(Z).floor(),z=$t;if(Ct.bindFramebuffer(L.FRAMEBUFFER,N)&&B&&Ct.drawBuffers(E,N),Ct.viewport(_),Ct.scissor(w),Ct.setScissorTest(z),et){const Mt=It.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+U,Mt.__webglTexture,F)}else if(ct){const Mt=It.get(E.texture),Tt=U||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Mt.__webglTexture,F||0,Tt)}P=-1},this.readRenderTargetPixels=function(E,U,F,B,N,et,ct){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=It.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ct!==void 0&&(vt=vt[ct]),vt){Ct.bindFramebuffer(L.FRAMEBUFFER,vt);try{const Mt=E.texture,Tt=Mt.format,Rt=Mt.type;if(!Wt.textureFormatReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Wt.textureTypeReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-B&&F>=0&&F<=E.height-N&&L.readPixels(U,F,B,N,Ut.convert(Tt),Ut.convert(Rt),et)}finally{const Mt=A!==null?It.get(A).__webglFramebuffer:null;Ct.bindFramebuffer(L.FRAMEBUFFER,Mt)}}},this.readRenderTargetPixelsAsync=async function(E,U,F,B,N,et,ct){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=It.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ct!==void 0&&(vt=vt[ct]),vt){const Mt=E.texture,Tt=Mt.format,Rt=Mt.type;if(!Wt.textureFormatReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Wt.textureTypeReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=E.width-B&&F>=0&&F<=E.height-N){Ct.bindFramebuffer(L.FRAMEBUFFER,vt);const Et=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Et),L.bufferData(L.PIXEL_PACK_BUFFER,et.byteLength,L.STREAM_READ),L.readPixels(U,F,B,N,Ut.convert(Tt),Ut.convert(Rt),0);const ie=A!==null?It.get(A).__webglFramebuffer:null;Ct.bindFramebuffer(L.FRAMEBUFFER,ie);const me=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Bp(L,me,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Et),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,et),L.deleteBuffer(Et),L.deleteSync(me),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,U=null,F=0){E.isTexture!==!0&&(vo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,E=arguments[1]);const B=Math.pow(2,-F),N=Math.floor(E.image.width*B),et=Math.floor(E.image.height*B),ct=U!==null?U.x:0,vt=U!==null?U.y:0;R.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,F,0,0,ct,vt,N,et),Ct.unbindTexture()},this.copyTextureToTexture=function(E,U,F=null,B=null,N=0){E.isTexture!==!0&&(vo("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1],U=arguments[2],N=arguments[3]||0,F=null);let et,ct,vt,Mt,Tt,Rt;F!==null?(et=F.max.x-F.min.x,ct=F.max.y-F.min.y,vt=F.min.x,Mt=F.min.y):(et=E.image.width,ct=E.image.height,vt=0,Mt=0),B!==null?(Tt=B.x,Rt=B.y):(Tt=0,Rt=0);const Et=Ut.convert(U.format),ie=Ut.convert(U.type);R.setTexture2D(U,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);const me=L.getParameter(L.UNPACK_ROW_LENGTH),ve=L.getParameter(L.UNPACK_IMAGE_HEIGHT),rn=L.getParameter(L.UNPACK_SKIP_PIXELS),Jt=L.getParameter(L.UNPACK_SKIP_ROWS),wt=L.getParameter(L.UNPACK_SKIP_IMAGES),Oe=E.isCompressedTexture?E.mipmaps[N]:E.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,Oe.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Oe.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,vt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Mt),E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,N,Tt,Rt,et,ct,Et,ie,Oe.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,N,Tt,Rt,Oe.width,Oe.height,Et,Oe.data):L.texSubImage2D(L.TEXTURE_2D,N,Tt,Rt,et,ct,Et,ie,Oe),L.pixelStorei(L.UNPACK_ROW_LENGTH,me),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ve),L.pixelStorei(L.UNPACK_SKIP_PIXELS,rn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Jt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,wt),N===0&&U.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Ct.unbindTexture()},this.copyTextureToTexture3D=function(E,U,F=null,B=null,N=0){E.isTexture!==!0&&(vo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),F=arguments[0]||null,B=arguments[1]||null,E=arguments[2],U=arguments[3],N=arguments[4]||0);let et,ct,vt,Mt,Tt,Rt,Et,ie,me;const ve=E.isCompressedTexture?E.mipmaps[N]:E.image;F!==null?(et=F.max.x-F.min.x,ct=F.max.y-F.min.y,vt=F.max.z-F.min.z,Mt=F.min.x,Tt=F.min.y,Rt=F.min.z):(et=ve.width,ct=ve.height,vt=ve.depth,Mt=0,Tt=0,Rt=0),B!==null?(Et=B.x,ie=B.y,me=B.z):(Et=0,ie=0,me=0);const rn=Ut.convert(U.format),Jt=Ut.convert(U.type);let wt;if(U.isData3DTexture)R.setTexture3D(U,0),wt=L.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)R.setTexture2DArray(U,0),wt=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);const Oe=L.getParameter(L.UNPACK_ROW_LENGTH),Qt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),yn=L.getParameter(L.UNPACK_SKIP_PIXELS),Zi=L.getParameter(L.UNPACK_SKIP_ROWS),on=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,ve.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ve.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Mt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Tt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Rt),E.isDataTexture||E.isData3DTexture?L.texSubImage3D(wt,N,Et,ie,me,et,ct,vt,rn,Jt,ve.data):U.isCompressedArrayTexture?L.compressedTexSubImage3D(wt,N,Et,ie,me,et,ct,vt,rn,ve.data):L.texSubImage3D(wt,N,Et,ie,me,et,ct,vt,rn,Jt,ve),L.pixelStorei(L.UNPACK_ROW_LENGTH,Oe),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Qt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,yn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Zi),L.pixelStorei(L.UNPACK_SKIP_IMAGES,on),N===0&&U.generateMipmaps&&L.generateMipmap(wt),Ct.unbindTexture()},this.initRenderTarget=function(E){It.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),Ct.unbindTexture()},this.resetState=function(){I=0,C=0,A=null,Ct.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===rl?"display-p3":"srgb",e.unpackColorSpace=te.workingColorSpace===Bo?"display-p3":"srgb"}}class hl{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new bt(t),this.density=e}clone(){return new hl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Zv extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new nn,this.environmentIntensity=1,this.environmentRotation=new nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Jv{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Nc,this.updateRanges=[],this.version=0,this.uuid=Kn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ye=new T;class Ro{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ye.fromBufferAttribute(this,e),Ye.applyMatrix4(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ye.fromBufferAttribute(this,e),Ye.applyNormalMatrix(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ye.fromBufferAttribute(this,e),Ye.transformDirection(t),this.setXYZ(e,Ye.x,Ye.y,Ye.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Rn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array),r=se(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Ne(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ro(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Mo extends Ei{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ds;const Ws=new T,fs=new T,ps=new T,ms=new st,Xs=new st,kd=new Zt,Wr=new T,Ys=new T,Xr=new T,Nh=new st,Ta=new st,Oh=new st;class Aa extends we{constructor(t=new Mo){if(super(),this.isSprite=!0,this.type="Sprite",ds===void 0){ds=new ee;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Jv(e,5);ds.setIndex([0,1,2,0,2,3]),ds.setAttribute("position",new Ro(n,3,0,!1)),ds.setAttribute("uv",new Ro(n,2,3,!1))}this.geometry=ds,this.material=t,this.center=new st(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fs.setFromMatrixScale(this.matrixWorld),kd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ps.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fs.multiplyScalar(-ps.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Yr(Wr.set(-.5,-.5,0),ps,o,fs,s,r),Yr(Ys.set(.5,-.5,0),ps,o,fs,s,r),Yr(Xr.set(.5,.5,0),ps,o,fs,s,r),Nh.set(0,0),Ta.set(1,0),Oh.set(1,1);let a=t.ray.intersectTriangle(Wr,Ys,Xr,!1,Ws);if(a===null&&(Yr(Ys.set(-.5,.5,0),ps,o,fs,s,r),Ta.set(0,1),a=t.ray.intersectTriangle(Wr,Xr,Ys,!1,Ws),a===null))return;const c=t.ray.origin.distanceTo(Ws);c<t.near||c>t.far||e.push({distance:c,point:Ws.clone(),uv:ln.getInterpolation(Ws,Wr,Ys,Xr,Nh,Ta,Oh,new st),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Yr(i,t,e,n,s,r){ms.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Xs.x=r*ms.x-s*ms.y,Xs.y=s*ms.x+r*ms.y):Xs.copy(ms),i.copy(t),i.x+=Xs.x,i.y+=Xs.y,i.applyMatrix4(kd)}class ul extends Ei{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Co=new T,Po=new T,Fh=new Zt,qs=new zo,qr=new gr,Ra=new T,Bh=new T;class Qv extends we{constructor(t=new ee,e=new ul){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Co.fromBufferAttribute(e,s-1),Po.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Co.distanceTo(Po);t.setAttribute("lineDistance",new Ft(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qr.copy(n.boundingSphere),qr.applyMatrix4(s),qr.radius+=r,t.ray.intersectsSphere(qr)===!1)return;Fh.copy(s).invert(),qs.copy(t.ray).applyMatrix4(Fh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=h.getX(v),S=h.getX(v+1),x=$r(this,t,qs,c,p,S);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=$r(this,t,qs,c,v,m);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=$r(this,t,qs,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=$r(this,t,qs,c,g-1,f);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function $r(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(Co.fromBufferAttribute(o,s),Po.fromBufferAttribute(o,r),e.distanceSqToSegment(Co,Po,Ra,Bh)>n)return;Ra.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ra);if(!(c<t.near||c>t.far))return{distance:c,point:Bh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const zh=new T,kh=new T;class Hd extends Qv{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)zh.fromBufferAttribute(e,s),kh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+zh.distanceTo(kh);t.setAttribute("lineDistance",new Ft(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ho extends Ei{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Hh=new Zt,Fc=new zo,jr=new gr,Kr=new T;class dl extends we{constructor(t=new ee,e=new Ho){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(s),jr.radius+=r,t.ray.intersectsSphere(jr)===!1)return;Hh.copy(s).invert(),Fc.copy(t.ray).applyMatrix4(Hh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let g=d,v=f;g<v;g++){const m=l.getX(g);Kr.fromBufferAttribute(u,m),Gh(Kr,m,c,s,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,v=f;g<v;g++)Kr.fromBufferAttribute(u,g),Gh(Kr,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Gh(i,t,e,n,s,r,o){const a=Fc.distanceSqToPoint(i);if(a<e){const c=new T;Fc.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class fl extends je{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new st:new T);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new T,s=[],r=[],o=[],a=new T,c=new Zt;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new T)}r[0]=new T,o[0]=new T;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Re(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Re(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class pl extends Bn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new st){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class tx extends pl{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ml(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Zr=new T,Ca=new ml,Pa=new ml,La=new ml;class Gd extends Bn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new T){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Zr.subVectors(s[0],s[1]).add(s[0]),l=Zr);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Zr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Zr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ca.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Pa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),La.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Ca.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Pa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),La.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ca.calc(c),Pa.calc(c),La.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new T().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Vh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function ex(i,t){const e=1-i;return e*e*t}function nx(i,t){return 2*(1-i)*i*t}function ix(i,t){return i*i*t}function sr(i,t,e,n){return ex(i,t)+nx(i,e)+ix(i,n)}function sx(i,t){const e=1-i;return e*e*e*t}function rx(i,t){const e=1-i;return 3*e*e*i*t}function ox(i,t){return 3*(1-i)*i*i*t}function ax(i,t){return i*i*i*t}function rr(i,t,e,n,s){return sx(i,t)+rx(i,e)+ox(i,n)+ax(i,s)}class Vd extends Bn{constructor(t=new st,e=new st,n=new st,s=new st){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new st){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(rr(t,s.x,r.x,o.x,a.x),rr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class cx extends Bn{constructor(t=new T,e=new T,n=new T,s=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new T){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(rr(t,s.x,r.x,o.x,a.x),rr(t,s.y,r.y,o.y,a.y),rr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wd extends Bn{constructor(t=new st,e=new st){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new st){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new st){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lx extends Bn{constructor(t=new T,e=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new T){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new T){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xd extends Bn{constructor(t=new st,e=new st,n=new st){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new st){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(sr(t,s.x,r.x,o.x),sr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yd extends Bn{constructor(t=new T,e=new T,n=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new T){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(sr(t,s.x,r.x,o.x),sr(t,s.y,r.y,o.y),sr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qd extends Bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new st){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Vh(a,c.x,l.x,h.x,u.x),Vh(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new st().fromArray(s))}return this}}var Bc=Object.freeze({__proto__:null,ArcCurve:tx,CatmullRomCurve3:Gd,CubicBezierCurve:Vd,CubicBezierCurve3:cx,EllipseCurve:pl,LineCurve:Wd,LineCurve3:lx,QuadraticBezierCurve:Xd,QuadraticBezierCurve3:Yd,SplineCurve:qd});class hx extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Bc[s.type]().fromJSON(s))}return this}}class ux extends hx{constructor(t){super(),this.type="Path",this.currentPoint=new st,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Wd(this.currentPoint.clone(),new st(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Xd(this.currentPoint.clone(),new st(t,e),new st(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Vd(this.currentPoint.clone(),new st(t,e),new st(n,s),new st(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new qd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new pl(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class gl extends ee{constructor(t=[new st(0,-.5),new st(.5,0),new st(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Re(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/e,u=new T,d=new st,f=new T,g=new T,v=new T;let m=0,p=0;for(let S=0;S<=t.length-1;S++)switch(S){case 0:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[S+1].x-t[S].x,p=t[S+1].y-t[S].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let S=0;S<=e;S++){const x=n+S*h*s,y=Math.sin(x),I=Math.cos(x);for(let C=0;C<=t.length-1;C++){u.x=t[C].x*y,u.y=t[C].y,u.z=t[C].x*I,o.push(u.x,u.y,u.z),d.x=S/e,d.y=C/(t.length-1),a.push(d.x,d.y);const A=c[3*C+0]*y,P=c[3*C+1],H=c[3*C+0]*I;l.push(A,P,H)}}for(let S=0;S<e;S++)for(let x=0;x<t.length-1;x++){const y=x+S*t.length,I=y,C=y+t.length,A=y+t.length+1,P=y+1;r.push(I,C,P),r.push(A,P,C)}this.setIndex(r),this.setAttribute("position",new Ft(o,3)),this.setAttribute("uv",new Ft(a,2)),this.setAttribute("normal",new Ft(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gl(t.points,t.segments,t.phiStart,t.phiLength)}}class _l extends gl{constructor(t=1,e=1,n=4,s=8){const r=new ux;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new _l(t.radius,t.length,t.capSegments,t.radialSegments)}}class Go extends ee{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new T,h=new st;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ft(o,3)),this.setAttribute("normal",new Ft(a,3)),this.setAttribute("uv",new Ft(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Go(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class vn extends ee{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;S(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Ft(u,3)),this.setAttribute("normal",new Ft(d,3)),this.setAttribute("uv",new Ft(f,2));function S(){const y=new T,I=new T;let C=0;const A=(e-t)/n;for(let P=0;P<=r;P++){const H=[],_=P/r,w=_*(e-t)+t;for(let z=0;z<=s;z++){const k=z/s,X=k*c+a,K=Math.sin(X),G=Math.cos(X);I.x=w*K,I.y=-_*n+m,I.z=w*G,u.push(I.x,I.y,I.z),y.set(K,A,G).normalize(),d.push(y.x,y.y,y.z),f.push(k,1-_),H.push(g++)}v.push(H)}for(let P=0;P<s;P++)for(let H=0;H<r;H++){const _=v[H][P],w=v[H+1][P],z=v[H+1][P+1],k=v[H][P+1];t>0&&(h.push(_,w,k),C+=3),e>0&&(h.push(w,z,k),C+=3)}l.addGroup(p,C,0),p+=C}function x(y){const I=g,C=new st,A=new T;let P=0;const H=y===!0?t:e,_=y===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,m*_,0),d.push(0,_,0),f.push(.5,.5),g++;const w=g;for(let z=0;z<=s;z++){const X=z/s*c+a,K=Math.cos(X),G=Math.sin(X);A.x=H*G,A.y=m*_,A.z=H*K,u.push(A.x,A.y,A.z),d.push(0,_,0),C.x=K*.5+.5,C.y=G*.5*_+.5,f.push(C.x,C.y),g++}for(let z=0;z<s;z++){const k=I+z,X=w+z;y===!0?h.push(X,X+1,k):h.push(X+1,X,k),P+=3}l.addGroup(p,P,y===!0?1:2),p+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ls extends vn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ls(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Os extends ee{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new Ft(r,3)),this.setAttribute("normal",new Ft(r.slice(),3)),this.setAttribute("uv",new Ft(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(S){const x=new T,y=new T,I=new T;for(let C=0;C<e.length;C+=3)f(e[C+0],x),f(e[C+1],y),f(e[C+2],I),c(x,y,I,S)}function c(S,x,y,I){const C=I+1,A=[];for(let P=0;P<=C;P++){A[P]=[];const H=S.clone().lerp(y,P/C),_=x.clone().lerp(y,P/C),w=C-P;for(let z=0;z<=w;z++)z===0&&P===C?A[P][z]=H:A[P][z]=H.clone().lerp(_,z/w)}for(let P=0;P<C;P++)for(let H=0;H<2*(C-P)-1;H++){const _=Math.floor(H/2);H%2===0?(d(A[P][_+1]),d(A[P+1][_]),d(A[P][_])):(d(A[P][_+1]),d(A[P+1][_+1]),d(A[P+1][_]))}}function l(S){const x=new T;for(let y=0;y<r.length;y+=3)x.x=r[y+0],x.y=r[y+1],x.z=r[y+2],x.normalize().multiplyScalar(S),r[y+0]=x.x,r[y+1]=x.y,r[y+2]=x.z}function h(){const S=new T;for(let x=0;x<r.length;x+=3){S.x=r[x+0],S.y=r[x+1],S.z=r[x+2];const y=m(S)/2/Math.PI+.5,I=p(S)/Math.PI+.5;o.push(y,1-I)}g(),u()}function u(){for(let S=0;S<o.length;S+=6){const x=o[S+0],y=o[S+2],I=o[S+4],C=Math.max(x,y,I),A=Math.min(x,y,I);C>.9&&A<.1&&(x<.2&&(o[S+0]+=1),y<.2&&(o[S+2]+=1),I<.2&&(o[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function f(S,x){const y=S*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function g(){const S=new T,x=new T,y=new T,I=new T,C=new st,A=new st,P=new st;for(let H=0,_=0;H<r.length;H+=9,_+=6){S.set(r[H+0],r[H+1],r[H+2]),x.set(r[H+3],r[H+4],r[H+5]),y.set(r[H+6],r[H+7],r[H+8]),C.set(o[_+0],o[_+1]),A.set(o[_+2],o[_+3]),P.set(o[_+4],o[_+5]),I.copy(S).add(x).add(y).divideScalar(3);const w=m(I);v(C,_+0,S,w),v(A,_+2,x,w),v(P,_+4,y,w)}}function v(S,x,y,I){I<0&&S.x===1&&(o[x]=S.x-1),y.x===0&&y.z===0&&(o[x]=I/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Os(t.vertices,t.indices,t.radius,t.details)}}class vl extends Os{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new vl(t.radius,t.detail)}}const Jr=new T,Qr=new T,Ia=new T,to=new ln;class dx extends ee{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(Ss*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:v,b:m,c:p}=to;if(v.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),to.getNormal(Ia),u[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let S=0;S<3;S++){const x=(S+1)%3,y=u[S],I=u[x],C=to[h[S]],A=to[h[x]],P=`${y}_${I}`,H=`${I}_${y}`;H in d&&d[H]?(Ia.dot(d[H].normal)<=r&&(f.push(C.x,C.y,C.z),f.push(A.x,A.y,A.z)),d[H]=null):P in d||(d[P]={index0:l[S],index1:l[x],normal:Ia.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Jr.fromBufferAttribute(a,v),Qr.fromBufferAttribute(a,m),f.push(Jr.x,Jr.y,Jr.z),f.push(Qr.x,Qr.y,Qr.z)}this.setAttribute("position",new Ft(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class xn extends Os{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new xn(t.radius,t.detail)}}class xl extends Os{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new xl(t.radius,t.detail)}}class Fs extends ee{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,f=new T,g=new st;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const S=p+m,x=S,y=S+n+1,I=S+n+2,C=S+1;a.push(x,y,C),a.push(y,I,C)}}this.setIndex(a),this.setAttribute("position",new Ft(c,3)),this.setAttribute("normal",new Ft(l,3)),this.setAttribute("uv",new Ft(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ln extends ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new T,d=new T,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const S=[],x=p/n;let y=0;p===0&&o===0?y=.5/e:p===n&&c===Math.PI&&(y=-.5/e);for(let I=0;I<=e;I++){const C=I/e;u.x=-t*Math.cos(s+C*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+C*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(C+y,1-x),S.push(l++)}h.push(S)}for(let p=0;p<n;p++)for(let S=0;S<e;S++){const x=h[p][S+1],y=h[p][S],I=h[p+1][S],C=h[p+1][S+1];(p!==0||o>0)&&f.push(x,y,C),(p!==n-1||c<Math.PI)&&f.push(y,I,C)}this.setIndex(f),this.setAttribute("position",new Ft(g,3)),this.setAttribute("normal",new Ft(v,3)),this.setAttribute("uv",new Ft(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Vo extends Os{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Vo(t.radius,t.detail)}}class Ml extends ee{constructor(t=new Yd(new T(-1,-1,0),new T(-1,1,0),new T(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new T,c=new T,l=new st;let h=new T;const u=[],d=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Ft(u,3)),this.setAttribute("normal",new Ft(d,3)),this.setAttribute("uv",new Ft(f,2));function v(){for(let x=0;x<e;x++)m(x);m(r===!1?e:0),S(),p()}function m(x){h=t.getPointAt(x/e,h);const y=o.normals[x],I=o.binormals[x];for(let C=0;C<=s;C++){const A=C/s*Math.PI*2,P=Math.sin(A),H=-Math.cos(A);c.x=H*y.x+P*I.x,c.y=H*y.y+P*I.y,c.z=H*y.z+P*I.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function p(){for(let x=1;x<=e;x++)for(let y=1;y<=s;y++){const I=(s+1)*(x-1)+(y-1),C=(s+1)*x+(y-1),A=(s+1)*x+y,P=(s+1)*(x-1)+y;g.push(I,C,P),g.push(C,A,P)}}function S(){for(let x=0;x<=e;x++)for(let y=0;y<=s;y++)l.x=x/e,l.y=y/s,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Ml(new Bc[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class qt extends Ei{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sd,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class yl extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class fx extends yl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Da=new Zt,Wh=new T,Xh=new T;class $d{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.map=null,this.mapPass=null,this.matrix=new Zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cl,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Wh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wh),Xh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Xh),e.updateMatrixWorld(),Da.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Da),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Da)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Yh=new Zt,$s=new T,Ua=new T;class px extends $d{constructor(){super(new Qe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new st(4,2),this._viewportCount=6,this._viewports=[new le(2,1,1,1),new le(0,1,1,1),new le(3,1,1,1),new le(1,1,1,1),new le(3,0,1,1),new le(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),$s.setFromMatrixPosition(t.matrixWorld),n.position.copy($s),Ua.copy(n.position),Ua.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ua),n.updateMatrixWorld(),s.makeTranslation(-$s.x,-$s.y,-$s.z),Yh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yh)}}class jd extends yl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new px}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class mx extends $d{constructor(){super(new Ud(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qh extends yl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new mx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const $h=new Zt;class Kd{constructor(t,e,n=0,s=1/0){this.ray=new zo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new al,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return $h.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($h),this}intersectObject(t,e=!0,n=[]){return zc(t,this,n,e),n.sort(jh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)zc(t[s],this,n,e);return n.sort(jh),n}}function jh(i,t){return i.distance-t.distance}function zc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)zc(r[o],t,e,!0)}}class gx{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Re(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jc);const _x=4.6;function Zd(i,t){return{position:i.clone().addScaledVector(t,_x),target:i.clone()}}const vx=2.4,xx=1.1;function Ki(i,t,e){const n=new T(t.x-i.x,0,t.z-i.z);return n.lengthSq()<.09&&n.set(-e.x,0,-e.z),n.lengthSq()<1e-6&&n.set(1,0,0),n.normalize(),{position:i.clone().addScaledVector(n,xx).add(new T(0,vx,0)),target:i.clone()}}const Mx=.55,yx=.3;function Sx(i,t,e){const n=new T(-e.x,0,-e.z).normalize();return{position:t.clone().addScaledVector(n,Mx).add(new T(0,yx,0)),target:i.clone().add(new T(0,-.27,0))}}const Ex=650,wx=550;function bx(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}class Tx{constructor(t){b(this,"mode","free");b(this,"onModeChange",()=>{});b(this,"tween",null);b(this,"scratchPos",new T);b(this,"scratchTarget",new T);b(this,"nowMs",0);this.camera=t}currentPose(){const t=new T;return this.camera.getWorldDirection(t),{position:this.camera.position.clone(),target:this.camera.position.clone().add(t)}}lockedness(){switch(this.mode){case"free":return 0;case"locked":return 1;default:{const t=this.tween?this.tweenProgress():1;return this.mode==="locking"?t:1-t}}}lock(t,e){this.mode==="free"&&this.startTween(this.currentPose(),e,t,Ex,"locked")}unlock(t,e){this.mode==="locked"&&this.startTween(this.currentPose(),e,t,wx,"free")}startTween(t,e,n,s,r){this.tween={from:t,to:e,startMs:n,durationMs:s,endMode:r},this.setMode(r==="locked"?"locking":"unlocking")}setMode(t){this.mode!==t&&(this.mode=t,this.onModeChange(t))}tweenProgress(){const t=this.tween;return bx(Math.min(1,(this.nowMs-t.startMs)/t.durationMs))}update(t){if(this.nowMs=t,!this.tween)return;const e=this.tween,n=this.tweenProgress();this.camera.position.copy(this.scratchPos.lerpVectors(e.from.position,e.to.position,n)),this.camera.lookAt(this.scratchTarget.lerpVectors(e.from.target,e.to.target,n)),n>=1&&(this.camera.position.copy(e.to.position),this.camera.lookAt(e.to.target),this.tween=null,this.setMode(e.endMode))}}const Na=.55,Kh=.25,Ax=0,Zh=.0042,Jh=Math.PI*.42,Rx=8,Cx=450,Qh=160,tu=[1,2.2,3.4],eu=[-.85,-.45,0,.45,.85],Px=110,Lx=320,Ix=170,Dx=900,Ux=2.6,Nx=1.2,Ox=2,Fx=.45,nu=.006,iu=.7,Bx=.55,zx=2.2,kx=450;function su(i,t,e){if(!("x1"in i))return{x:i.x,z:i.z};const n=i.x2-i.x1,s=i.z2-i.z1,r=n*n+s*s,o=r<1e-9?0:Math.max(0,Math.min(1,((t-i.x1)*n+(e-i.z1)*s)/r));return{x:i.x1+n*o,z:i.z1+s*o}}function Hx(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}class Gx{constructor(t,e,n){b(this,"position",new T(0,-1,0));b(this,"yaw",0);b(this,"pitch",0);b(this,"enabled",!0);b(this,"onTap",()=>{});b(this,"fanScale",1);b(this,"moveSlowdown",1);b(this,"canMove",!0);b(this,"onHop",()=>{});b(this,"onRestHold",()=>{});b(this,"onOrbit",()=>{});b(this,"view","first");b(this,"thirdBackScale",1);b(this,"thirdZoom",1);b(this,"standHeightAt",()=>0);b(this,"avatar",new oe);b(this,"objectAt",()=>!1);b(this,"onLongPress",()=>{});b(this,"pointers",new Map);b(this,"colliders",[]);b(this,"isWalkable");b(this,"markers",new oe);b(this,"candidates",[]);b(this,"fanOpen",!1);b(this,"picked",null);b(this,"markerMaterial",new Pe({color:13625039,transparent:!0,opacity:.5,depthWrite:!1}));b(this,"pickedMaterial",new Pe({color:16777215,transparent:!0,opacity:.95,depthWrite:!1}));b(this,"move",null);b(this,"onDown",t=>{const e=this.canvas.getBoundingClientRect(),n=[...this.pointers.values()].map(a=>a.role),s=this.enabled&&n.length===0&&this.objectAt(t.clientX,t.clientY),r=!s&&t.clientX-e.left<e.width*Ax&&!n.includes("move"),o=s?"press":r?"move":"look";o==="look"&&n.includes("look")||(this.pointers.set(t.pointerId,{role:o,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,downMs:performance.now(),moved:!1}),this.canvas.setPointerCapture(t.pointerId),o==="move"&&this.enabled&&!this.move&&window.setTimeout(()=>{var a;((a=this.pointers.get(t.pointerId))==null?void 0:a.role)==="move"&&(this.fanOpen=!0)},Qh),o==="look"&&this.enabled&&window.setTimeout(()=>{const a=this.pointers.get(t.pointerId);a&&a.role==="look"&&!a.moved&&this.enabled&&(this.pointers.delete(t.pointerId),this.onRestHold())},Dx),o==="press"&&window.setTimeout(()=>{const a=this.pointers.get(t.pointerId);a&&a.role==="press"&&!a.moved&&this.enabled&&(this.pointers.delete(t.pointerId),this.onLongPress(t.clientX,t.clientY))},kx))});b(this,"onMove",t=>{const e=this.pointers.get(t.pointerId);e&&(Math.hypot(t.clientX-e.startX,t.clientY-e.startY)>Rx&&(e.moved=!0,e.role==="press"&&(e.role="look")),e.role==="look"&&this.enabled?(this.yaw-=(t.clientX-e.lastX)*Zh,this.pitch=ue.clamp(this.pitch-(t.clientY-e.lastY)*Zh,-Jh,Jh)):!this.enabled&&e.moved&&this.onOrbit((t.clientX-e.lastX)*nu,(t.clientY-e.lastY)*nu),e.lastX=t.clientX,e.lastY=t.clientY,e.role==="move"&&this.fanOpen&&this.refreshPick())});b(this,"onUp",t=>{const e=this.pointers.get(t.pointerId);if(e){if(this.pointers.delete(t.pointerId),e.role==="move"){const n=this.fanOpen;if(this.fanOpen=!1,n&&this.markers.visible){this.picked&&this.enabled&&this.commitMove(this.picked.point),this.closeFan();return}}!e.moved&&performance.now()-e.downMs<Cx&&this.onTap(t.clientX,t.clientY)}});this.canvas=t,this.camera=n,t.addEventListener("pointerdown",this.onDown),t.addEventListener("pointermove",this.onMove),t.addEventListener("pointerup",this.onUp),t.addEventListener("pointercancel",this.onUp);const s=new qt({color:9071178,roughness:.9,flatShading:!0}),r=new qt({color:4872762,roughness:.95,flatShading:!0}),o=new lt(new vn(.14,.17,.42,8),r);o.position.y=.26;const a=new lt(new Ln(.12,8,6),s);a.position.y=Na;const c=new lt(new Ls(.035,.08,5),s);c.rotation.x=-Math.PI/2,c.position.set(0,Na-.01,-.12),this.avatar.add(o,a,c),this.avatar.visible=!1;const l=new Fs(.15,.22,24);for(let h=0;h<tu.length*eu.length;h++){const u=new lt(l,this.markerMaterial);u.rotation.x=-Math.PI/2,u.visible=!1,this.markers.add(u),this.candidates.push({point:new T,marker:u})}e.add(this.markers)}get isMoving(){return this.move!==null}eye(){return new T(this.position.x,this.position.y+this.standHeightAt(this.position.x,this.position.z)+Na,this.position.z)}knock(){const t=Math.random()*Math.PI*2,e=new T(this.position.x+Math.cos(t)*iu,this.position.y,this.position.z+Math.sin(t)*iu);this.isWalkable&&!this.isWalkable(e)||(this.move=null,this.position.copy(e))}forward(){return new T(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}applyCamera(t){const e=this.eye();if(this.avatar.position.set(this.position.x,this.position.y,this.position.z),this.avatar.rotation.y=this.yaw,this.avatar.visible=this.view==="third",this.view==="first"){t.position.copy(e),t.lookAt(e.add(this.forward()));return}const n=-Math.sin(this.yaw),s=-Math.cos(this.yaw),r=Ux*this.thirdBackScale*this.thirdZoom,o=Nx*this.thirdBackScale*this.thirdZoom,a=new T(e.x-n*r,e.y+o,e.z-s*r);let c=1;for(let l=0;l<8;l++){const h=e.x+(a.x-e.x)*c,u=e.z+(a.z-e.z)*c;if(!this.colliders.some(f=>!("x1"in f)&&Math.hypot(h-f.x,u-f.z)<Fx)||c<=.35)break;c-=.1}t.position.set(e.x+(a.x-e.x)*c,e.y+(a.y-e.y)*c,e.z+(a.z-e.z)*c),t.lookAt(e.add(this.forward().multiplyScalar(Ox)))}startMove(t){this.pointers.has(t.pointerId)||(this.pointers.set(t.pointerId,{role:"move",startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,downMs:performance.now(),moved:!1}),this.enabled&&!this.move&&window.setTimeout(()=>{var e;((e=this.pointers.get(t.pointerId))==null?void 0:e.role)==="move"&&(this.fanOpen=!0)},Qh))}pointerMove(t){this.onMove(t)}pointerUp(t){this.onUp(t)}update(t,e,n){if(this.colliders=e,this.isWalkable=n,this.move){const s=this.move,r=Math.min(1,(t-s.startMs)/s.durationMs);this.position.lerpVectors(s.from,s.to,Hx(r)),r>=1&&(this.move=null)}else for(const s of e){const r=su(s,this.position.x,this.position.z),o=this.position.x-r.x,a=this.position.z-r.z,c=Math.hypot(o,a),l=s.radius+Kh;if(c<l){const h=c>1e-4?o/c:1,u=c>1e-4?a/c:0;this.position.x=r.x+h*l,this.position.z=r.z+u*l}}this.fanOpen&&this.enabled&&this.canMove&&!this.move?this.layoutFan():this.closeFan()}isFree(t){for(const e of this.colliders){const n=su(e,t.x,t.z);if(Math.hypot(t.x-n.x,t.z-n.z)<e.radius+Kh)return!1}return!(this.isWalkable&&!this.isWalkable(t))}pathClear(t,e){const s=new T;for(let r=1;r<=8;r++)if(s.lerpVectors(t,e,r/8),!this.isFree(s))return!1;return!0}halfHorizontalFov(){const t=this.camera;return Math.atan(Math.tan(ue.degToRad(t.fov)/2)*t.aspect)}layoutFan(){this.markers.visible=!0;const t=-Math.sin(this.yaw),e=-Math.cos(this.yaw),n=this.halfHorizontalFov();let s=0;for(const r of tu)for(const o of eu){const a=o*n,c=this.candidates[s++],l=Math.cos(a),h=Math.sin(a),u=r*this.fanScale;c.point.set(this.position.x+(t*l+e*h)*u,this.position.y,this.position.z+(-t*h+e*l)*u);const d=this.isFree(c.point)&&this.pathClear(this.position,c.point);c.marker.visible=d,c.marker.position.set(c.point.x,this.position.y+this.standHeightAt(c.point.x,c.point.z)+.02,c.point.z)}this.refreshPick()}closeFan(){this.markers.visible&&(this.markers.visible=!1,this.picked=null)}refreshPick(){const t=[...this.pointers.values()].find(o=>o.role==="move");if(!t)return;const e=this.canvas.getBoundingClientRect(),n=new T;let s=null,r=Px;for(const o of this.candidates){if(!o.marker.visible)continue;n.copy(o.marker.position).project(this.camera);const a=e.left+(n.x*.5+.5)*e.width,c=e.top+(-n.y*.5+.5)*e.height,l=Math.hypot(a-t.lastX,c-t.lastY);l<r&&(r=l,s=o)}s!==this.picked&&(this.picked&&(this.picked.marker.material=this.markerMaterial,this.picked.marker.scale.setScalar(1)),this.picked=s,s&&(s.marker.material=this.pickedMaterial,s.marker.scale.setScalar(1.45)))}commitMove(t){const e=this.position.clone(),n=e.distanceTo(t);this.move={from:e,to:t.clone(),startMs:performance.now(),durationMs:(Lx+n*Ix)*this.moveSlowdown},this.onHop(n)}}const Yi=[{name:"rose",hex:15225471},{name:"gold",hex:15906106},{name:"sky",hex:6076656},{name:"leaf",hex:8313175},{name:"violet",hex:11765749}];function Xe(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Vx(i,t){if(i!==Yi.length)throw new Error(`assignDistinctColors: need exactly ${Yi.length} tips for a 1:1 colour map, got ${i}`);const e=Xe(t),n=Yi.map((s,r)=>r);for(let s=n.length-1;s>0;s--){const r=Math.floor(e()*(s+1));[n[s],n[r]]=[n[r],n[s]]}return n}function dr(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new ee;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=ru(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);const g=ru(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function ru(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Ne(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const v=h.getComponent(d,g);a.setComponent(d+u,g,v)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const hn=1,Wi=5,Wx=[new T(0,.72,hn),new T(-.72,.22,hn),new T(.72,.22,hn),new T(-.46,-.58,hn),new T(.46,-.58,hn)],Xx=[[new T(.18,.2,-.45),new T(-.15,.55,.3)],[new T(-.3,-.15,.5),new T(-.62,.1,-.2)],[new T(.25,.35,.55),new T(.65,.4,-.1)],[new T(-.1,-.35,-.55),new T(-.5,-.25,.35)],[new T(.35,-.1,.25),new T(.55,-.55,-.35)]],Jd=new T(0,0,0),ou=new T(0,-hn,0),Yx=30;function qx(i){const t=Jd.y-ou.y,e=new vn(.15,.21,t,12),n=new lt(e,i);n.position.set(0,t/2,0);const s=new oe;return s.position.copy(ou),s.add(n),s}function $x(i,t){const e=Xe(i),n=new xn(1,1),s=[],r=new Zt,o=new Si,a=new nn;for(let c=0;c<Yx;c++){const l=.28+e()*.24,h=new T((e()*2-1)*.6,(e()*2-1)*(hn-l*.6),(e()*2-1)*.6),u=new T(l*(.8+e()*.5),l*(.7+e()*.5),l*(.8+e()*.5));o.setFromEuler(a.set(e()*Math.PI,e()*Math.PI,e()*Math.PI)),s.push(n.clone().applyMatrix4(r.compose(h,o,u)))}return new lt(dr(s),t)}function jx(i){const t=[Jd.clone(),...Xx[i].map(e=>e.clone()),Wx[i].clone()];return new Gd(t,!1,"centripetal",.5)}function Kx(i,t){const e=new oe,n=new qt({color:Yi[i].hex,roughness:.55,emissive:Yi[i].hex,emissiveIntensity:0}),s=new Ln(1,14,10),r=6,o=.12,a=[],c=new Zt;for(let h=0;h<r;h++){const u=h/r*Math.PI*2;c.compose(new T(Math.cos(u)*o,Math.sin(u)*o,0),new Si().setFromEuler(new nn(0,0,u)),new T(.12,.065,.04)),a.push(s.clone().applyMatrix4(c))}e.add(new lt(dr(a),n));const l=new lt(new Ln(.06,12,10),t);return l.position.z=.02,e.add(l),{group:e,petalMaterial:n}}function Zx(i,t=7,e=1){if(i.length!==Wi)throw new Error(`buildRig: expected ${Wi} colours, got ${i.length}`);const n=new qt({color:5914410,roughness:.9}),s=new qt({color:5208634,roughness:.8}),r=new qt({color:16773544,roughness:.6}),o=new qt({color:2046498,roughness:1,flatShading:!0}),a=[n,s,r,o],c=new oe,l=qx(n);c.add(l);const h=$x(t,o);c.add(h);const u=[],d=[],f=[],g=new Ln(.24,8,6),v=Array.from({length:Wi},(x,y)=>jx(y)),m=dr(v.map(x=>new Ml(x,48,.045,8,!1)));for(let x=0;x<e;x++){const y=new oe;y.rotation.y=x*Math.PI/2,c.add(y),u.push(y);const I=new lt(m,s);y.add(I);for(let C=0;C<Wi;C++){const A=v[C],{group:P,petalMaterial:H}=Kx(i[C],r);a.push(H),P.position.copy(A.getPointAt(1)),y.add(P);const _=new lt(g);_.visible=!1,_.userData.tipIndex=C,P.add(_),f.push(_),d.push({index:d.length,tip:C,face:x,curve:A,tube:I,flower:P,colorIndex:i[C],petalMaterial:H})}}const p=new ul({color:3820090,transparent:!0,opacity:.35}),S=new Hd(new dx(new dn(hn*2,hn*2,hn*2)),p);return c.add(S),a.push(p),{root:c,branches:d,hitTargets:f,materials:a,trunkPivot:l,foliage:h,faceGroups:u,edges:S}}const Jx=700,Qx=90,Oa=90,au=1.3,tM=.75;function eM(i){return i*i}function nM(i){return 1-(1-i)*(1-i)}class Qd{constructor(){b(this,"active",[])}start(t,e,n){t.forEach((s,r)=>{this.active.push({branch:s,startMs:e+r*Qx,fromScale:s.flower.scale.x,onDone:()=>n(s)})})}get isBusy(){return this.active.length>0}update(t){const e=[],n=[];for(const s of this.active){const r=t-s.startMs;if(r<0){e.push(s);continue}const{flower:o,curve:a}=s.branch;if(r<Oa){const h=nM(r/Oa),u=ue.lerp(s.fromScale,au,h);o.scale.setScalar(u),e.push(s);continue}const c=Math.min(1,(r-Oa)/Jx),l=eM(c);o.position.copy(a.getPointAt(1-l)),o.scale.setScalar(au*(1-l)),o.rotation.z=l*tM*Math.PI*2,c>=1?(o.visible=!1,n.push(s)):e.push(s)}this.active=e;for(const s of n)s.onDone()}}const cu=220,iM=450,sM=1150,rM=.3,oM=.4,lu=1e3,aM=4.5,eo=80,hu=60;function cM(i){return i*i*i}function lM(i){return 1-Math.pow(1-i,3)}class hM{constructor(t,e,n){b(this,"stragglers");b(this,"animator",new Qd);b(this,"stragglersStarted",!1);b(this,"burstStarted",!1);b(this,"finished",!1);b(this,"fx",new oe);b(this,"ring");b(this,"ringMaterial");b(this,"sparks");b(this,"sparkMaterial");b(this,"sparkVelocities");b(this,"light");b(this,"lastBurstMs",0);this.rig=t,this.parent=e,this.startMs=n,this.stragglers=t.branches.filter(s=>s.flower.visible)}get isDone(){return this.finished}update(t){if(this.finished)return;const e=t-this.startMs;e>=cu&&!this.stragglersStarted&&(this.stragglersStarted=!0,this.animator.start(this.stragglers,t,()=>{})),this.animator.update(t);const n=e-cu-iM;if(n>=0){this.burstStarted||(this.burstStarted=!0,this.buildBurst(),this.lastBurstMs=t);const s=Math.min(1,n/sM),r=cM(s),o=this.rig.root;o.position.y=-2.6*r;const a=ue.lerp(1,rM,r);o.scale.set(a,1,a),o.rotation.y=oM*Math.PI*2*r,this.updateBurst(t,Math.min(1,n/lu)),s>=1&&n>=lu&&(o.visible=!1,this.parent.remove(this.fx),this.finished=!0)}}buildBurst(){this.ringMaterial=new Pe({color:16773568,transparent:!0,opacity:.9,blending:Zn,depthWrite:!1,side:Ue}),this.ring=new lt(new Fs(.75,1,64),this.ringMaterial),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=-.97,this.fx.add(this.ring);const t=new Float32Array(eo*3);this.sparkVelocities=new Float32Array(eo*3);for(let n=0;n<eo;n++){const s=Math.random()*Math.PI*2,r=Math.random()*.8;t[n*3]=Math.cos(s)*r,t[n*3+1]=-1+Math.random()*.4,t[n*3+2]=Math.sin(s)*r,this.sparkVelocities[n*3]=Math.cos(s)*(.4+Math.random()*1.2),this.sparkVelocities[n*3+1]=1.5+Math.random()*2.5,this.sparkVelocities[n*3+2]=Math.sin(s)*(.4+Math.random()*1.2)}const e=new ee;e.setAttribute("position",new Ne(t,3)),this.sparkMaterial=new Ho({color:16774344,size:.09,transparent:!0,opacity:1,blending:Zn,depthWrite:!1}),this.sparks=new dl(e,this.sparkMaterial),this.fx.add(this.sparks),this.light=new jd(16771504,hu,14,2),this.light.position.set(0,.2,0),this.fx.add(this.light),this.parent.add(this.fx)}updateBurst(t,e){const n=(t-this.lastBurstMs)/1e3;this.lastBurstMs=t;const s=lM(e);this.ring.scale.setScalar(ue.lerp(.3,aM,s)),this.ringMaterial.opacity=.9*(1-e);const r=this.sparks.geometry.getAttribute("position"),o=r.array;for(let a=0;a<eo;a++)o[a*3]+=this.sparkVelocities[a*3]*n,o[a*3+1]+=this.sparkVelocities[a*3+1]*n,o[a*3+2]+=this.sparkVelocities[a*3+2]*n,this.sparkVelocities[a*3+1]-=1.2*n;r.needsUpdate=!0,this.sparkMaterial.opacity=1-e*e,this.light.intensity=hu*(e<.15?e/.15:1-(e-.15)/.85)}}const uM=200,Fa=600,no=850,dM=260,fM=.07,io=70,uu=700,pM=2.2;function du(i){return i*i*i}function mM(i){return 1-Math.pow(1-i,3)}class gM{constructor(t,e,n,s,r){b(this,"fx",new oe);b(this,"leaves",null);b(this,"leafVel");b(this,"leafMaterial");b(this,"dust",null);b(this,"dustMaterial");b(this,"axis");b(this,"thudded",!1);b(this,"finished",!1);b(this,"lastMs");this.rig=t,this.parent=e,this.startMs=n,this.fallDir=s,this.onThud=r,this.axis=new T(0,1,0).cross(s).normalize(),this.lastMs=n,e.add(this.fx)}get isDone(){return this.finished}update(t){if(this.finished)return;const e=(t-this.lastMs)/1e3;this.lastMs=t;const n=t-this.startMs-uM;if(n<0)return;const s=Math.min(1,n/Fa);this.leaves||this.buildLeaves();const r=Math.max(.001,1-du(s));this.rig.foliage.scale.setScalar(r);for(const l of this.rig.faceGroups)l.scale.setScalar(r);this.rig.edges.material.opacity=.35*(1-s),this.updateLeaves(e,Math.min(1,n/(Fa+400)));const o=n-Fa;if(o<0)return;const a=Math.min(1,o/no);let c=Math.PI/2*du(a);if(a>=1){this.thudded||(this.thudded=!0,this.buildDust(),this.onThud());const l=Math.min(1,(o-no)/dM);c=Math.PI/2-fM*Math.sin(Math.PI*l),this.updateDust(Math.min(1,(o-no)/uu)),l>=1&&o-no>=uu&&(this.parent.remove(this.fx),this.finished=!0)}this.rig.trunkPivot.setRotationFromAxisAngle(this.axis,c)}buildLeaves(){const t=new Float32Array(io*3);this.leafVel=new Float32Array(io*3);for(let n=0;n<io;n++){const s=Math.random()*Math.PI*2,r=Math.random()*.7;t[n*3]=Math.cos(s)*r,t[n*3+1]=-.6+Math.random()*1.4,t[n*3+2]=Math.sin(s)*r,this.leafVel[n*3]=Math.cos(s)*(.6+Math.random()*1.4),this.leafVel[n*3+1]=.6+Math.random()*1.6,this.leafVel[n*3+2]=Math.sin(s)*(.6+Math.random()*1.4)}const e=new ee;e.setAttribute("position",new Ne(t,3)),this.leafMaterial=new Ho({color:9425002,size:.11,transparent:!0,opacity:.95,depthWrite:!1}),this.leaves=new dl(e,this.leafMaterial),this.fx.add(this.leaves)}updateLeaves(t,e){if(!this.leaves)return;const n=this.leaves.geometry.getAttribute("position"),s=n.array;for(let r=0;r<io;r++)s[r*3]+=this.leafVel[r*3]*t,s[r*3+1]+=this.leafVel[r*3+1]*t,s[r*3+2]+=this.leafVel[r*3+2]*t,this.leafVel[r*3+1]-=2.2*t;n.needsUpdate=!0,this.leafMaterial.opacity=.95*(1-e*e),e>=1&&(this.leaves.visible=!1)}buildDust(){this.dustMaterial=new Pe({color:12170148,transparent:!0,opacity:.55,depthWrite:!1,side:Ue}),this.dust=new lt(new Fs(.6,1,40),this.dustMaterial),this.dust.rotation.x=-Math.PI/2,this.dust.position.set(this.fallDir.x*.5,-.97,this.fallDir.z*.5),this.fx.add(this.dust)}updateDust(t){this.dust&&(this.dust.scale.setScalar(ue.lerp(.3,pM,mM(t))),this.dustMaterial.opacity=.55*(1-t))}}const Lo=5,wi=6,bi=6;class Dn{constructor(t,e,n){b(this,"grid",[]);b(this,"nextId",1);b(this,"rand");this.rows=t,this.cols=e,this.rand=Xe(n),this.deal()}gemAt(t){return this.grid[t.row][t.col]}locate(t){for(let e=0;e<this.rows;e++)for(let n=0;n<this.cols;n++)if(this.grid[e][n].id===t)return{row:e,col:n};return null}static adjacent(t,e){return Math.abs(t.row-e.row)+Math.abs(t.col-e.col)===1}swap(t,e){if(!Dn.adjacent(t,e))return{valid:!1};if(this.exchange(t,e),this.findRuns().length===0)return this.exchange(t,e),{valid:!1};const n=[];for(;;){const r=this.findRuns();if(r.length===0)break;n.push(this.clearAndFall(r))}let s=!1;return this.hasValidMove()||(this.deal(),s=!0),{valid:!0,steps:n,reshuffled:s}}findRuns(){const t=[];for(let e=0;e<this.rows;e++){let n=0;for(let s=1;s<=this.cols;s++)(s===this.cols||this.grid[e][s].type!==this.grid[e][n].type)&&(s-n>=3&&t.push({type:this.grid[e][n].type,cells:fu(n,s).map(r=>({row:e,col:r}))}),n=s)}for(let e=0;e<this.cols;e++){let n=0;for(let s=1;s<=this.rows;s++)(s===this.rows||this.grid[s][e].type!==this.grid[n][e].type)&&(s-n>=3&&t.push({type:this.grid[n][e].type,cells:fu(n,s).map(r=>({row:r,col:e}))}),n=s)}return t}hasValidMove(){for(let t=0;t<this.rows;t++)for(let e=0;e<this.cols;e++)for(const[n,s]of[[0,1],[1,0]]){const r={row:t+n,col:e+s};if(r.row>=this.rows||r.col>=this.cols)continue;const o={row:t,col:e};this.exchange(o,r);const a=this.findRuns().length>0;if(this.exchange(o,r),a)return!0}return!1}exchange(t,e){const n=this.grid[t.row][t.col];this.grid[t.row][t.col]=this.grid[e.row][e.col],this.grid[e.row][e.col]=n}newGem(t){return{id:this.nextId++,type:t}}deal(){for(let t=0;t<100;t++){this.grid=[];for(let e=0;e<this.rows;e++){const n=[];for(let s=0;s<this.cols;s++){let r;do r=Math.floor(this.rand()*Lo);while(s>=2&&n[s-1].type===r&&n[s-2].type===r||e>=2&&this.grid[e-1][s].type===r&&this.grid[e-2][s].type===r);n.push(this.newGem(r))}this.grid.push(n)}if(this.hasValidMove())return}throw new Error("Board.deal: could not find a dealable grid")}clearAndFall(t){const e=new Set,n=[];for(const o of t)for(const a of o.cells){const c=`${a.row},${a.col}`;if(e.has(c))continue;e.add(c);const l=this.grid[a.row][a.col];n.push({...a,id:l.id,type:l.type})}const s=[],r=[];for(let o=0;o<this.cols;o++){let a=this.rows-1;for(let l=this.rows-1;l>=0;l--)e.has(`${l},${o}`)||(a!==l&&(s.push({id:this.grid[l][o].id,col:o,fromRow:l,toRow:a}),this.grid[a][o]=this.grid[l][o]),a--);const c=a+1;for(let l=a;l>=0;l--){const h=this.newGem(Math.floor(this.rand()*Lo));this.grid[l][o]=h,r.push({id:h.id,type:h.type,col:o,fromRow:l-c,toRow:l})}}return{runs:t,cleared:n,falls:s,spawns:r}}}function fu(i,t){return Array.from({length:t-i},(e,n)=>i+n)}const Ti={name:"single",target(i,t){return t.targetCount>0?0:null}},_M=1.2,vM=3.3,so=40,pu=4,xM="fell",mu=.05,MM=.7,yM=.9,SM=3.5;function Ba(i){return new T(Math.sin(i*Math.PI/2),0,Math.cos(i*Math.PI/2))}class tf{constructor(t,e,n,s){b(this,"kind","voxel");b(this,"lockReach",vM);b(this,"hintLocked","Tap a gem, then a neighbour, to swap. Every match feeds the tree.");b(this,"group",new oe);b(this,"rig");b(this,"colors");b(this,"board");b(this,"pool",0);b(this,"targeting",Ti);b(this,"hitBox");b(this,"status","growing");b(this,"onDone",()=>{});b(this,"onThud",()=>{});b(this,"ending",xM);b(this,"lockedFace",0);b(this,"receded");b(this,"flash",0);b(this,"animator",new Qd);b(this,"beat",null);b(this,"lastNow",0);b(this,"baseOpacity");b(this,"lastFade",1);this.index=t,this.colors=Vx(Wi,s),this.board=new Dn(wi,bi,s^20973),this.receded=this.colors.map(()=>!1),this.rig=Zx(this.colors,s^40503,pu),this.baseOpacity=this.rig.materials.map(r=>r.opacity);for(const r of this.rig.branches)r.petalMaterial.emissiveIntensity=mu;this.group.position.copy(e),this.group.lookAt(n.x,e.y,n.z),this.group.add(this.rig.root),this.hitBox=new lt(new dn(hn*2,hn*2,hn*2)),this.hitBox.visible=!1,this.hitBox.userData.interactable=this,this.group.add(this.hitBox);for(const r of this.rig.hitTargets)r.userData.interactable=this}get center(){return this.group.position.clone()}get normal(){return Ba(this.lockedFace).applyQuaternion(this.group.quaternion)}lockPose(t){const e=t.position.clone().sub(this.group.position);e.y=0;let n=0,s=-1/0;for(let r=0;r<pu;r++){const o=Ba(r).applyQuaternion(this.group.quaternion).dot(e);o>s&&(s=o,n=r)}return this.lockedFace=n,Zd(this.center,this.normal)}get lockTargets(){return[this.hitBox,...this.rig.hitTargets]}collider(){return this.status==="resolved"?null:{x:this.group.position.x,z:this.group.position.z,radius:_M}}distanceTo(t){return Math.hypot(t.x-this.group.position.x,t.z-this.group.position.z)}get flowersLeft(){return this.receded.filter(t=>!t).length}poolText(){return`tree ${this.pool}/${so} · flowers ${this.flowersLeft}`}targetFor(t){return this.status!=="growing"?null:this.targeting.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){const t=this.receded.indexOf(!1);if(t===-1)return this.center;const e=this.rig.branches.find(n=>n.face===this.lockedFace&&n.tip===t);return e?e.flower.getWorldPosition(new T):this.center}feed(t,e,n){if(this.status!=="growing")return;this.pool=Math.min(so,this.pool+e),this.flash=yM;const s=so/Wi;for(let r=0;r<Wi;r++)!this.receded[r]&&this.pool>=(r+1)*s-1e-6&&this.recedeTip(r,n)}recedeTip(t,e){this.receded[t]=!0;for(const n of this.rig.branches)n.tip===t&&this.animator.start([n],e,()=>{this.flowersLeft===0&&!this.animator.isBusy&&this.beginResolve(this.lastNow)})}beginResolve(t){this.status==="growing"&&(this.status="resolving",this.beat=this.ending==="fell"?new gM(this.rig,this.group,t,Ba(this.lockedFace),()=>this.onThud(this)):new hM(this.rig,this.group,t))}setFade(t){this.lastFade=t;const e=ue.clamp(t,0,1);this.rig.root.visible=e>0&&this.status!=="resolved",this.rig.materials.forEach((n,s)=>{n.opacity=this.baseOpacity[s]*e,n.transparent=e<1||this.baseOpacity[s]<1})}update(t){const e=Math.max(0,(t-this.lastNow)/1e3);this.lastNow=t,this.flash=Math.max(0,this.flash-SM*e);const n=ue.lerp(mu,MM,this.pool/so)+this.flash;for(const s of this.rig.branches)this.receded[s.tip]||(s.petalMaterial.emissiveIntensity=n);this.animator.update(t),this.beat&&(this.beat.update(t),this.beat.isDone&&(this.beat=null,this.status="resolved",this.rig.root.visible=!1,this.onDone(this)))}}const EM=9e4,Io=4,wM=new qt({color:5914410,roughness:.95}),bM=new qt({color:3103280,roughness:1,flatShading:!0});function za(i,t,e){const n=new oe,s=new lt(new vn(t*.7,t,i,7),wM);s.position.y=i/2,n.add(s);const r=new xn(1,0);for(const[o,a,c,l]of e){const h=new lt(r,bM);h.position.set(o,a,c),h.scale.setScalar(l),n.add(h)}return n}class TM{constructor(){b(this,"group",new oe);b(this,"stages");b(this,"current",-1);this.stages=[za(.35,.03,[[.06,.34,0,.08],[-.05,.28,.04,.07]]),za(.7,.05,[[0,.72,0,.24],[.14,.5,-.08,.12]]),za(1,.07,[[0,1.05,0,.42],[.3,.75,.1,.22],[-.28,.85,-.12,.2]])];for(const t of this.stages)t.visible=!1,this.group.add(t);this.setProgress(0)}setProgress(t){const e=Math.min(this.stages.length-1,Math.floor(t*this.stages.length));e!==this.current&&(this.current=e,this.stages.forEach((s,r)=>s.visible=r===e));const n=t*this.stages.length-e;this.stages[e].scale.setScalar(.85+.15*Math.min(1,n))}}const AM=6e4,RM=10,ka=18,gu=new qt({color:9416778,roughness:.9,flatShading:!0}),CM=new qt({color:14266938,roughness:.8,flatShading:!0}),PM=new qt({color:14726199,roughness:.7,flatShading:!0});class LM{constructor(){b(this,"group",new oe);b(this,"stems",[]);b(this,"heads",[]);for(let t=0;t<4;t++){const e=t/4*Math.PI*2+.4,n=Math.cos(e)*.28,s=Math.sin(e)*.28,r=new lt(new vn(.012,.02,1,5),gu);r.position.set(n,.5,s),r.rotation.z=.08*Math.sin(t*2.3);const o=new lt(new _l(.035,.16,2,6),PM);o.position.set(n,1.05,s),o.rotation.z=.25*Math.sin(t*1.7),this.stems.push(r),this.heads.push(o),this.group.add(r,o)}this.setProgress(0)}setProgress(t){const e=.15+.85*Math.min(1,t/.8),n=Math.max(0,(t-.6)/.4);this.stems.forEach((s,r)=>{s.scale.set(1,e,1),s.position.y=e/2,s.material=t>=1?CM:gu;const o=this.heads[r];o.visible=t>.5,o.scale.setScalar(.3+.7*n),o.position.y=e+.08})}}const gs=1.3,li=12,IM=2.8,ro=[16,9,4,0],oo=[0,3,8,15],DM=[16777215,14208920,12101752,16777215],Ha=.42,Ga=[.66,.33,1e-4],UM=[3095847,4012584,4864808,5390380];let js=null;function NM(){if(js)return js;const i=128,t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d");e.clearRect(0,0,i,i);const n=Xe(42),s=13;for(let r=0;r<s;r++){const a=((r+.5)/s-.5)*1.7,c=.55+n()*.45,l=i*(.42+n()*.16),h=l+a*i*.32,u=i*(1-c),d=5+n()*4,f=120+Math.floor(n()*70);e.fillStyle=`rgb(${40+Math.floor(n()*40)}, ${f}, ${40+Math.floor(n()*30)})`,e.beginPath(),e.moveTo(l-d/2,i),e.quadraticCurveTo(l+a*i*.1,i*.6,h,u),e.quadraticCurveTo(l+a*i*.12+d*.3,i*.62,l+d/2,i),e.closePath(),e.fill()}return js=new fl(t),js.colorSpace=bn,js}class ef{constructor(t,e,n,s=!1,r=0){b(this,"kind","patch");b(this,"group",new oe);b(this,"board");b(this,"lockReach",IM);b(this,"status","growing");b(this,"pool",0);b(this,"targeting",Ti);b(this,"onDone",()=>{});b(this,"onGrown",()=>{});b(this,"onRock",()=>{});b(this,"lockTargets");b(this,"sapling",null);b(this,"plantedAt",0);b(this,"wheat",null);b(this,"crop","none");b(this,"onHarvest",()=>{});b(this,"stages",[]);b(this,"stage",-1);b(this,"plantedLook");b(this,"unblockedStatus","growing");b(this,"lastNow",0);if(this.index=t,this.board=new Dn(wi,bi,n^31249),this.group.position.copy(e),this.buildStages(n),r>0){const a=r===1?.5:r===2?.2:0;this.pool=Math.min(li,Math.round(li*(1-a))),r>=3&&(this.status="resolved")}this.setStage(this.stageFor(1-this.pool/li)),s&&this.setBlocked(!0);const o=new lt(new dn(gs,.4,gs));o.position.y=.2,o.visible=!1,o.userData.interactable=this,this.group.add(o),this.lockTargets=[o]}get hintLocked(){return this.crop==="wheat_ripe"?"Tap a gem, then a neighbour, to swap. Every match harvests the wheat.":"Tap a gem, then a neighbour, to swap. Every match tills the ground."}get center(){return this.group.position.clone()}get footprintHalf(){return gs/2}setBlocked(t){this.status!=="resolved"&&(t&&this.status!=="blocked"?(this.unblockedStatus=this.status,this.status="blocked"):!t&&this.status==="blocked"&&(this.status=this.unblockedStatus))}lockPose(t){return Ki(this.center,t.position,t.forward)}distanceTo(t){return Math.hypot(t.x-this.group.position.x,t.z-this.group.position.z)}targetFor(t){return this.status!=="growing"?null:this.targeting.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){return this.center.add(new T(0,.15,0))}feed(t,e){if(this.status!=="growing")return;if(this.crop==="wheat_ripe"){this.pool=Math.min(ka,this.pool+e),this.pool>=ka&&(this.wheat&&this.group.remove(this.wheat.group),this.wheat=null,this.crop="none",this.pool=li,this.status="resolved",this.onHarvest(this,RM),this.onDone(this));return}this.pool=Math.min(li,this.pool+e);const n=this.stage;this.setStage(this.stageFor(1-this.pool/li)),this.stage!==n&&this.onRock(this),this.pool>=li&&(this.status="resolved",this.onDone(this))}poolText(){return this.crop==="wheat_ripe"?`wheat ${this.pool}/${ka}`:this.status==="planted"?this.crop==="wheat"?"wheat growing":"planted":this.status==="resolved"?"tilled":this.status==="blocked"?"blocked — clear the ground":`soil ${this.pool}/${li}`}get acceptsSeeds(){return this.status==="resolved"}plant(t,e,n="tree"){return!this.acceptsSeeds||t<Io?0:(this.status="planted",this.plantedAt=e,this.stages.forEach(s=>s.visible=!1),this.plantedLook.visible=!0,n==="wheat"?(this.crop="wheat",this.wheat=new LM,this.wheat.group.position.y=.01,this.group.add(this.wheat.group)):(this.sapling=new TM,this.sapling.group.position.y=.01,this.group.add(this.sapling.group)),Io)}get growth(){return this.status!=="planted"?0:Math.min(1,(this.lastNow-this.plantedAt)/(this.crop==="wheat"?AM:EM))}update(t){if(this.lastNow=t,this.status!=="planted")return;const e=this.growth;if(this.wheat){this.wheat.setProgress(e),e>=1&&(this.crop="wheat_ripe",this.pool=0,this.status="growing",this.unblockedStatus="growing");return}this.sapling&&(this.sapling.setProgress(e),e>=1&&(this.group.remove(this.sapling.group),this.sapling=null,this.onGrown(this)))}stageFor(t){for(let e=0;e<Ga.length;e++)if(t>Ga[e])return e;return Ga.length}setStage(t){t!==this.stage&&(this.stage=t,this.stages.forEach((e,n)=>e.visible=n===t))}buildStages(t){const e=Xe(t),n=gs/2,s=new Fn(Ha,Ha);s.translate(0,Ha/2,0);const r=[],o=new Zt,a=new Si,c=new nn;for(let g=0;g<ro[0];g++){const v=new T((e()*2-1)*(n-.12),0,(e()*2-1)*(n-.12)),m=e()*Math.PI,p=.75+e()*.5,S=new T(p,p*(.8+e()*.4),p);a.setFromEuler(c.set(0,m,0)),r.push(s.clone().applyMatrix4(o.compose(v,a,S))),a.setFromEuler(c.set(0,m+Math.PI/2,0)),r.push(s.clone().applyMatrix4(o.compose(v,a,S)))}const l=new xn(1,0),h=[];for(let g=0;g<oo[oo.length-1];g++){const v=.11+e()*.1,m=new T((e()*2-1)*(n-v),v*.45,(e()*2-1)*(n-v));a.setFromEuler(c.set(e()*Math.PI,e()*Math.PI,e()*Math.PI)),h.push(l.clone().applyMatrix4(o.compose(m,a,new T(v,v*.65,v))))}const u=NM(),d=new qt({color:7031342,roughness:1,flatShading:!0}),f=new Fn(gs,gs);f.rotateX(-Math.PI/2),this.plantedLook=new lt(f,new qt({color:4863526,roughness:1})),this.plantedLook.position.y=.012,this.plantedLook.visible=!1,this.group.add(this.plantedLook);for(let g=0;g<ro.length;g++){const v=new oe,m=new lt(f,new qt({color:UM[g],roughness:1}));if(m.position.y=.012,v.add(m),ro[g]>0){const p=new qt({map:u,color:DM[g],alphaTest:.5,side:Ue,roughness:1});v.add(new lt(dr(r.slice(0,ro[g]*2)),p))}oo[g]>0&&v.add(new lt(dr(h.slice(0,oo[g])),d)),v.visible=!1,this.group.add(v),this.stages.push(v)}}}const de=-1,Do=14673903,OM=9416920,nf=14674160,FM=.0011,BM=7763311,zM=7105380,_u=.5,kM=.05,kc=-60,ws=60,Uo=24,sf=.4,rf=400;function or(i){return Uo+3*Math.sin(i/9)+1.2*Math.sin(i/3.1+1)}function HM(i){const t=Uo+8-kc,e=ws*2,n=new Fn(t,e,Math.round(t/_u),Math.round(e/_u));n.rotateX(-Math.PI/2),n.translate(kc+t/2,0,0);const s=Xe(i),r=n.getAttribute("position");for(let o=0;o<r.count;o++){const a=r.getX(o),c=r.getZ(o),l=or(c);a>l&&r.setX(o,l);const h=Math.sin(a*1.7+c*.9)*.35+Math.sin(a*.4-c*1.3)*.25;r.setY(o,(h+(s()-.5))*kM)}return n.computeVertexNormals(),n}function GM(i){const t=[0,.35,.9,1.8,3.2,5.5,9,15,25,40,65,100,160,250,rf],e=200,n=Xe(i),s=[],r=[];for(let c=0;c<=e;c++){const l=-ws+c/e*ws*2,h=or(l);for(let u=0;u<t.length;u++){const d=t[u],f=.22+d*.02,g=Math.sin(l*1.3+d*.7)*.5+Math.sin(l*.37-d*.21)*.5,v=u%2===0?.35+d*.01:0,m=d===0?0:(g+(n()-.5))*f+v,p=.03*d;s.push(h+p+m,de-d,l)}}const o=t.length;for(let c=0;c<e;c++)for(let l=0;l<o-1;l++){const h=c*o+l,u=h+o;r.push(h,u,h+1,h+1,u,u+1)}const a=new ee;return a.setAttribute("position",new Ft(s,3)),a.setIndex(r),a.computeVertexNormals(),a}function VM(){const i=new Ln(2800,32,16),t=i.getAttribute("position"),e=new Float32Array(t.count*3),n=new bt(Do),s=new bt(OM),r=new bt;for(let a=0;a<t.count;a++){const c=ue.clamp(t.getY(a)/2800,0,1);r.copy(n).lerp(s,Math.pow(c,.6)),e[a*3]=r.r,e[a*3+1]=r.g,e[a*3+2]=r.b}i.setAttribute("color",new Ne(e,3));const o=new lt(i,new Pe({vertexColors:!0,side:$e,fog:!1,depthWrite:!1}));return o.renderOrder=-1,o}function WM(i){const t=new oe,e=Xe(19);i.background=new bt(Do);const n=new hl(Do,FM);i.fog=n;const s=VM();t.add(s);const r=new fx(nf,2765604,1.1);i.add(r);const o=new qh(16773336,1.6);o.position.set(30,12,-8),i.add(o);const a=new qh(12372192,0);a.position.set(-6,40,12),i.add(a);const c=new qt({color:BM,roughness:1,flatShading:!0}),l=new lt(HM(11),c);l.position.y=de,t.add(l);const h=new lt(GM(13),new qt({color:zM,roughness:1,flatShading:!0,side:Ue}));t.add(h);const u=new xn(1,0);for(let y=0;y<40;y++){const I=-ws+e()*ws*2,C=.1+e()*.3,A=new lt(u,c);A.position.set(or(I)-.2+e()*.5,de+C*.4,I),A.scale.set(C,C*.7,C),A.rotation.set(e()*3,e()*3,e()*3),t.add(A)}const d=de-rf,f=new lt(new Fn(8e3,8e3),new qt({color:4155962,roughness:1}));f.rotation.x=-Math.PI/2,f.position.y=d,t.add(f);const g=new Ln(1,10,6),v=new qt({color:2904624,roughness:1,flatShading:!0});for(let y=0;y<260;y++){const I=Uo+25+Math.pow(e(),1.6)*1100,C=(e()*2-1)*(300+I*.9),A=10+e()*40+I*.02,P=new lt(g,v);P.position.set(I,d,C),P.scale.set(A,A*(.35+e()*.3),A),t.add(P)}const m=new lt(new Fn(2200,34),new Pe({color:11847380}));m.rotation.x=-Math.PI/2,m.rotation.z=-.35,m.position.set(Uo+700,d+.5,150),t.add(m);const p=[{minX:380,maxX:560,count:11,rMin:90,rMax:200,hMin:60,hMax:170,color:4873046},{minX:800,maxX:1150,count:14,rMin:160,rMax:340,hMin:150,hMax:330,color:6123641},{minX:1500,maxX:2100,count:16,rMin:260,rMax:520,hMin:300,hMax:560,color:8229283}];for(const y of p){const I=new Pe({color:y.color});for(let C=0;C<y.count;C++){const A=y.minX+e()*(y.maxX-y.minX),P=(e()*2-1)*(A*1.15),H=y.rMin+e()*(y.rMax-y.rMin),_=y.hMin+e()*(y.hMax-y.hMin),w=new lt(new Ls(H,_,5+Math.floor(e()*3)),I);w.position.set(A,d+_/2,P),w.rotation.y=e()*Math.PI,t.add(w)}}i.add(t);const S=y=>y.x<=or(y.z)-sf&&y.x>=kc+1&&Math.abs(y.z)<=ws-1,x=y=>or(y.z)-y.x;return{group:t,sun:o,moon:a,hemi:r,skyMaterial:s.material,fog:n,isWalkable:S,distanceToEdge:x}}const XM={tiny:20,small:5,large:1},of=1,Yn=2,vu=650,YM=.09;function Hc(i,t=of){return i<=0?1:Math.ceil(i/t)}function ao(i,t=of){return i<=0?1:Math.ceil(i/(2*t))}const _s=new qt({color:5914410,roughness:.95,flatShading:!0}),er=new qt({color:8157812,roughness:1,flatShading:!0}),af=new qt({color:7302760,emissive:8384712,emissiveIntensity:0,roughness:1,flatShading:!0}),qM=new qt({color:7031342,roughness:.95}),fi=new qt({color:12096090,roughness:.9,flatShading:!0}),$M=new qt({color:15127439,roughness:.6}),jM=new qt({color:14726199,roughness:.55}),KM=new qt({color:16774102,roughness:.9,flatShading:!0}),Xi=1,Sl=.15,Is=.17,Ge=Xi*2+Sl*2,Fe=Xi+Sl*2,Hi=.55,cf=.9,No=(Ge-cf)/2,xu=.1,Mu=.24,Mn={seed:{id:"seed",label:"seeds",size:"tiny",mass:0,color:15127439,radius:.06,blocks:!1,restHeight:.05,food:.04,build:()=>{const i=new lt(new Ln(.06,8,6),$M);return i.scale.set(1,.7,1.3),i}},wheat_seed:{id:"wheat_seed",label:"wheat seeds",size:"tiny",mass:0,color:14726199,radius:.06,blocks:!1,restHeight:.05,food:.06,nourishMs:9e4,build:()=>{const i=new lt(new Ln(.06,8,6),jM);return i.scale.set(.9,.7,1.5),i}},popcorn:{id:"popcorn",label:"popcorn",size:"tiny",mass:0,color:16774102,radius:.09,blocks:!1,restHeight:.07,food:.12,nourishMs:15e4,build:()=>{const i=new lt(new xn(.09,1),KM);return i.scale.set(1.15,.9,1),i}},stick:{id:"stick",label:"sticks",size:"small",mass:0,color:7031342,radius:.28,blocks:!0,restHeight:.04,build:()=>{const i=new lt(new vn(.03,.04,.55,6),qM);return i.rotation.z=Math.PI/2,i}},lichen:{id:"lichen",label:"lichen",size:"tiny",mass:0,color:8384712,radius:.25,blocks:!1,restHeight:.02,build:()=>{const i=new lt(new xn(1,1),af);return i.scale.set(.32,.04,.24),i}},rock:{id:"rock",label:"rock",size:"large",mass:1,color:8157812,radius:.2,blocks:!0,restHeight:.13,build:()=>{const i=new lt(new xn(.17,0),er);return i.scale.set(1.15,.8,1),i}},hand_axe:{id:"hand_axe",label:"hand axe",size:"large",mass:1,color:9078912,radius:.18,blocks:!0,restHeight:.08,build:()=>ui("hand_axe")},log:{id:"log",halfLength:Ge/2,label:"long log",size:"large",mass:4,color:5914410,radius:1.15,blocks:!0,restHeight:.17,build:()=>qn(Ge)},log_short:{id:"log_short",halfLength:Fe/2,label:"short log",size:"large",mass:2,color:5914410,radius:.65,blocks:!0,restHeight:.17,build:()=>qn(Fe)},log_long_notched:{id:"log_long_notched",halfLength:Ge/2,label:"long notched log",size:"large",mass:4,color:5914410,radius:1.15,blocks:!0,restHeight:.17,build:()=>ui("log_long_notched")},log_notched:{id:"log_notched",halfLength:Fe/2,label:"notched log",size:"large",mass:2,color:5914410,radius:.65,blocks:!0,restHeight:.17,build:()=>ui("log_notched")},log_stub:{id:"log_stub",halfLength:Hi/2,label:"knuckle",size:"large",mass:1,color:5914410,radius:.3,blocks:!0,restHeight:.17,build:()=>ui("log_stub")},log_half:{id:"log_half",halfLength:No/2,label:"half log",size:"large",mass:2,color:5914410,radius:.45,blocks:!0,restHeight:.17,build:()=>ui("log_half")},timber:{id:"timber",halfLength:Ge/2,label:"long timber",size:"large",mass:2,color:12096090,radius:1.15,blocks:!0,restHeight:.05,build:()=>ui("timber")},timber_short:{id:"timber_short",halfLength:Fe/2,label:"short timber",size:"large",mass:1,color:12096090,radius:.65,blocks:!0,restHeight:.05,build:()=>ui("timber_short")},chip:{id:"chip",label:"wood shavings",size:"tiny",mass:0,color:12096090,radius:.05,blocks:!1,restHeight:.02,build:()=>{const i=new lt(new Vo(.06,0),fi);return i.scale.set(1.3,.4,1),i}}};function qn(i){const t=new lt(new vn(Is,Is+.015,i,10),_s);return t.rotation.z=Math.PI/2,t}const yu=.38,ZM=Is*.5,JM=new bt(5914410),Un=new bt(12096090),QM=new qt({vertexColors:!0,roughness:.95,flatShading:!0});function ty(i,t,e=Is){const s=e-ZM,r=[],o=[],a=[],c=[{x:-i/2,clipped:!1,pale:!1}];for(const u of[...t].sort((d,f)=>d-f)){const d=u-yu/2,f=u+yu/2;c.push({x:d,clipped:!1,pale:!1},{x:d,clipped:!1,pale:!0},{x:d,clipped:!0,pale:!0},{x:f,clipped:!0,pale:!0},{x:f,clipped:!1,pale:!0},{x:f,clipped:!1,pale:!1})}c.push({x:i/2,clipped:!1,pale:!1});const l=[];for(const u of c){l.push(r.length/3);for(let d=0;d<14;d++){const f=d/14*Math.PI*2;let g=e*Math.sin(f);const v=e*Math.cos(f),m=Math.abs(g)>s;u.clipped&&m&&(g=Math.sign(g)*s),r.push(u.x,g,v);const p=u.pale&&m?Un:JM;o.push(p.r,p.g,p.b)}}for(let u=0;u<c.length-1;u++){const d=l[u],f=l[u+1];for(let g=0;g<14;g++){const v=(g+1)%14;a.push(d+g,f+v,f+g,d+g,d+v,f+v)}}for(const[u,d]of[[0,-1],[c.length-1,1]]){const f=r.length/3;r.push(c[u].x,0,0),o.push(Un.r,Un.g,Un.b);const g=l[u];for(let v=0;v<14;v++){const m=(v+1)%14,p=r.length/3;r.push(r[(g+v)*3],r[(g+v)*3+1],r[(g+v)*3+2]),r.push(r[(g+m)*3],r[(g+m)*3+1],r[(g+m)*3+2]),o.push(Un.r,Un.g,Un.b,Un.r,Un.g,Un.b),d<0?a.push(f,p,p+1):a.push(f,p+1,p)}}const h=new ee;return h.setAttribute("position",new Ft(r,3)),h.setAttribute("color",new Ft(o,3)),h.setIndex(a),h.computeVertexNormals(),h}function co(i,t){return new lt(ty(i,t),QM)}function Va(i,t,e){for(let n=0;n<i;n++){const s=new lt(new dn(.05,.015,.24),fi),r=(n/Math.max(1,i-1)-.5)*(e-.4);s.position.set(r,.165,0),s.rotation.y=.35*Math.sin(n*1.7),t.add(s)}}function Ui(i,...t){const e=new lt(new ee,i);return e.add(...t),e}function ui(i){switch(i){case"rock_chipped":{const t=new lt(new xn(.17,0),er);return t.scale.set(1.1,.7,.85),t}case"rock_wedge":{const t=new lt(new vn(.02,.16,.3,5),er);return t.rotation.z=Math.PI/2,t}case"log_scored":{const t=Ui(_s,qn(Ge));return Va(8,t,Ge),t}case"log_scored_short":{const t=Ui(_s,qn(Fe));return Va(5,t,Fe),t}case"log_split":case"log_split_short":{const t=i==="log_split"?Ge:Fe,e=new lt(new dn(t-.1,.08,.06),fi);e.position.y=.15;const n=Ui(_s,qn(t),e);return Va(3,n,t),n}case"log_halved":{const t=qn(Fe);t.position.x=-Fe/2-.03;const e=qn(Fe);e.position.x=Fe/2+.03;const n=new lt(new Go(Is,10),fi);n.rotation.y=Math.PI/2,n.position.x=-.02;const s=n.clone();return s.rotation.y=-Math.PI/2,s.position.x=.02,Ui(_s,t,e,n,s)}case"log_long_notched":return co(Ge,[-Xi,0,Xi]);case"log_notched":return co(Fe,[-Xi/2,Xi/2]);case"timber":{const t=new lt(new dn(Ge,xu,Mu),fi);return Ui(fi,t)}case"timber_short":{const t=new lt(new dn(Fe,xu,Mu),fi);return Ui(fi,t)}case"log_stub":return co(Hi,[0]);case"log_half":return co(No,[-No/2+Sl]);case"log_stubbed":{const t=qn(Hi);t.position.x=-Hi/2-.03;const e=qn(Hi);return e.position.x=Hi/2+.03,Ui(_s,t,e)}case"hand_axe":default:{const t=new lt(new vn(.012,.15,.32,6),er);t.rotation.z=Math.PI/2;const e=new lt(new vn(.012,.045,.07,6),new qt({color:12105390,roughness:.5,flatShading:!0}));e.rotation.z=Math.PI/2,e.position.x=.19;const n=new lt(new ee,er);return n.add(t,e),n}}}let ey=1;class ny{constructor(t){b(this,"id",ey++);b(this,"group",new oe);b(this,"mesh");b(this,"collectible",!0);b(this,"craft",null);b(this,"waggleUntil",0);b(this,"waggleStart",0);this.type=t,this.mesh=t.build(),this.own(this.mesh),this.group.add(this.mesh)}waggle(t){this.waggleStart=t,this.waggleUntil=t+vu}updateWaggle(t){if(t>=this.waggleUntil){this.waggleUntil!==0&&(this.group.rotation.x=0,this.group.rotation.z=0,this.waggleUntil=0);return}const e=(t-this.waggleStart)/vu,n=Math.sin(e*Math.PI*6)*YM*(1-e);this.group.rotation.z=n,this.group.rotation.x=n*.5}own(t){t.traverse(e=>e.userData.object=this)}get position(){return this.group.position}setLook(t){this.group.remove(this.mesh),this.mesh=ui(t),this.own(this.mesh),this.group.add(this.mesh)}rest(t,e,n,s=0){this.group.position.set(t,e+this.type.restHeight,n),this.group.rotation.y=s}}class iy{constructor(t){b(this,"group",new oe);b(this,"objects",[]);t.add(this.group)}spawn(t,e,n,s,r=0){const o=new ny(Mn[t]);return o.rest(e,n,s,r),this.group.add(o.group),this.objects.push(o),o}remove(t){const e=this.objects.indexOf(t);e>=0&&this.objects.splice(e,1),this.group.remove(t.group)}update(t){for(const e of this.objects)e.updateWaggle(t)}raycastTargets(){return this.objects.filter(t=>t.collectible).map(t=>t.mesh)}nearby(t,e,n,s){return this.objects.filter(r=>r.collectible&&(!s||r.type.id===s)&&Math.hypot(r.position.x-t,r.position.z-e)<=n).sort((r,o)=>Math.hypot(r.position.x-t,r.position.z-e)-Math.hypot(o.position.x-t,o.position.z-e))}overlapsSquare(t,e,n){return this.objects.filter(s=>s.type.blocks&&Math.abs(s.position.x-t)<n+s.type.radius&&Math.abs(s.position.z-e)<n+s.type.radius)}scatterFelledTree(t,e,n,s){const r=Xe(s),o=Math.atan2(e.x,e.z)+Math.PI/2;this.spawn("log",t.x+e.x*(Ge/2+.1),n,t.z+e.z*(Ge/2+.1),o),this.spawn("log_short",t.x+e.x*(Ge+Fe/2+.25),n,t.z+e.z*(Ge+Fe/2+.25),o+(r()-.5)*.4);for(let a=0;a<3;a++){const c=r()*Math.PI*2,l=.45+r()*.55;this.spawn("stick",t.x+Math.cos(c)*l,n,t.z+Math.sin(c)*l,r()*Math.PI)}for(let a=0;a<12;a++){const c=r()*Math.PI*2,l=.2+r()*.75;this.spawn("seed",t.x+Math.cos(c)*l,n,t.z+Math.sin(c)*l,r()*Math.PI)}}}const sy=2.6,ry=.9,oy=70,ay=380,Su=1,cy=.55,ly=1.7,hy=8,uy=450,dy=260;class fy{constructor(t,e,n,s,r,o,a,c){b(this,"state",Array.from({length:Yn},()=>({kind:"empty"})));b(this,"notice",null);b(this,"onChange",()=>{});b(this,"placeOnTarget",()=>null);b(this,"onRelease",()=>{});b(this,"placeHeldOnTarget",()=>!1);b(this,"dragLead",{obj:null,sign:1});b(this,"onEat",()=>!1);b(this,"condition",{strength:1,capScale:1,handsAvailable:Yn});b(this,"eating",null);b(this,"gesture",null);b(this,"holdTimer",null);b(this,"flies",[]);b(this,"flyGroup",new oe);b(this,"raycaster",new Kd);b(this,"groundPlane");b(this,"lastMs",0);this.camera=t,this.player=e,this.objects=n,this.boxes=r,this.overlay=o,this.groundY=a,this.isWalkable=c,s.add(this.flyGroup),this.groundPlane=new di(new T(0,1,0),-a),r.forEach((l,h)=>{l.addEventListener("pointerdown",u=>this.onDown(u,h)),l.addEventListener("pointermove",u=>this.onMove(u)),l.addEventListener("pointerup",u=>this.onUp(u)),l.addEventListener("pointercancel",u=>this.onUp(u))}),this.render()}get dragging(){const t=this.linkedObject();return t&&this.linkedHands(t)>=ao(t.type.mass,this.condition.strength)?t:null}get straining(){const t=this.linkedObject();return t!==null&&this.linkedHands(t)<ao(t.type.mass,this.condition.strength)}linkedObject(){for(const t of this.state)if(t.kind==="linked")return t.obj;return null}linkedHands(t){return this.state.filter(e=>e.kind==="linked"&&e.obj===t).length}freeHands(){return this.state.filter(t=>t.kind==="empty").length}setCondition(t){const e=this.condition.handsAvailable;if(this.condition=t,t.handsAvailable<e){for(let n=t.handsAvailable;n<Yn;n++){const s=this.state[n];s.kind==="linked"?this.unlink(s.obj):s.kind!=="empty"&&this.tapBox(n)}this.render(),this.onChange()}else t.handsAvailable!==e&&this.render()}update(t){const e=Math.min(.1,Math.max(0,(t-this.lastMs)/1e3));if(this.lastMs=t,this.eating&&t>=this.eating.nextMs){const r=this.state[this.eating.hand];r.kind==="stack"&&r.type.food&&this.onEat(r.type)?(r.count--,this.eating.ate=!0,this.eating.nextMs=t+dy,r.count<=0&&(this.state[this.eating.hand]={kind:"empty"},this.eating=null),this.render(),this.onChange()):this.eating=null}const n=[];for(const r of this.flies){const o=Math.min(1,(t-r.startMs)/ay),a=this.pointUnderBox(r.hand);r.mesh.position.lerpVectors(r.from,a,o*o),r.mesh.scale.setScalar(r.scale*(1-.85*o)),o>=1?this.flyGroup.remove(r.mesh):n.push(r)}this.flies=n;const s=this.dragging;if(s){if(this.dragLead.obj!==s){const c=Math.cos(s.group.rotation.y),l=-Math.sin(s.group.rotation.y),h=(this.player.position.x-s.position.x)*c+(this.player.position.z-s.position.z)*l;this.dragLead={obj:s,sign:h>=0?1:-1}}const r=this.player.position.x-s.position.x,o=this.player.position.z-s.position.z,a=Math.hypot(r,o);if(a>Su){const c=(a-Su)/a;s.position.x+=r*c*Math.min(1,e*12),s.position.z+=o*c*Math.min(1,e*12),s.group.rotation.y=Math.atan2(r,o)+Math.PI/2+(this.dragLead.sign>0?Math.PI:0)}}this.drawLines()}onDown(t,e){if(this.gesture)return;if(t.preventDefault(),e>=this.condition.handsAvailable){this.say("Too tired."),this.onChange();return}this.gesture={pointerId:t.pointerId,hand:e,startX:t.clientX,startY:t.clientY,x:t.clientX,y:t.clientY,moved:!1,target:null},this.boxes[e].setPointerCapture(t.pointerId),this.boxes[e].classList.add("active");const n=this.state[e];n.kind==="stack"&&n.type.food&&(this.holdTimer=window.setTimeout(()=>{const s=this.gesture;s&&s.pointerId===t.pointerId&&!s.moved&&(this.eating={hand:e,nextMs:this.lastMs,ate:!1})},uy))}onMove(t){const e=this.gesture;!e||e.pointerId!==t.pointerId||(e.x=t.clientX,e.y=t.clientY,Math.hypot(e.x-e.startX,e.y-e.startY)>hy&&(e.moved=!0),e.target=e.moved?this.pickObject(e.x,e.y):null)}onUp(t){const e=this.gesture;if(!e||e.pointerId!==t.pointerId)return;this.gesture=null,this.holdTimer!==null&&(window.clearTimeout(this.holdTimer),this.holdTimer=null);const n=this.eating!==null&&this.eating.ate;this.eating=null,this.boxes[e.hand].classList.remove("active"),n||(e.moved?this.release(e):this.tapBox(e.hand)),this.render(),this.onChange()}tapBox(t){const e=this.state[t];if(e.kind==="empty")return;if(e.kind==="linked"){this.unlink(e.obj);return}const n=this.player.forward(),s=new T(this.player.position.x+n.x*.6,this.groundY,this.player.position.z+n.z*.6);this.placeHand(t,s)}release(t){const e=this.state[t.hand],n=t.target;if(e.kind==="empty"){if(!n)return;if(!this.inReach(n.position))return this.say("Out of reach.");this.take(t.hand,n);return}if(e.kind==="linked")return;if(e.kind==="stack"&&n&&n.type===e.type){if(!this.inReach(n.position))return this.say("Out of reach.");this.gather(t.hand,n);return}if(e.kind==="stack"){const r=this.placeOnTarget(t.x,t.y,e.type,e.count);if(r!==null){r>0&&(e.count-=r,e.count<=0&&(this.state[t.hand]={kind:"empty"}));return}}if(e.kind==="held"&&this.placeHeldOnTarget(t.x,t.y,e.type)){for(let r=0;r<Yn;r++){const o=this.state[r];o.kind==="held"&&o.type===e.type&&(this.state[r]={kind:"empty"})}return}const s=this.pickGround(t.x,t.y);if(s){if(!this.inReach(s))return this.say("Out of reach.");if(!this.isWalkable(s))return this.say("Not there.");this.placeHand(t.hand,s)}}take(t,e){const n=e.type;if(n.size!=="large"){this.state[t]={kind:"stack",type:n,count:0},this.gather(t,e);return}const s=Hc(n.mass,this.condition.strength);if(s<=this.freeHands()){this.fly(e,t),this.objects.remove(e);let r=s;for(let o=0;o<Yn&&r>0;o++)(o===t||this.state[o].kind==="empty")&&(this.state[o]={kind:"held",type:n},r--);return}if(ao(n.mass,this.condition.strength)<=this.condition.handsAvailable){this.state[t]={kind:"linked",obj:e},this.linkedHands(e)<ao(n.mass,this.condition.strength)&&this.say("Too heavy for one hand.");return}this.say("Too heavy.")}gather(t,e){const n=this.state[t];if(n.kind!=="stack")return;const s=Math.max(1,Math.floor(XM[n.type.size]*this.condition.capScale)),r=this.objects.nearby(e.position.x,e.position.z,ry,n.type.id);for(const o of r){if(n.count>=s)break;this.inReach(o.position)&&(this.fly(o,t),this.objects.remove(o),n.count++)}n.count===0&&(this.state[t]={kind:"empty"})}placeHand(t,e){const n=this.state[t];if(n.kind==="stack"){for(let s=0;s<n.count;s++){const r=s/n.count*Math.PI*2+.7,o=n.count===1?0:.12+.18*Math.sqrt(s/n.count);this.objects.spawn(n.type.id,e.x+Math.cos(r)*o,this.groundY,e.z+Math.sin(r)*o,r)}this.state[t]={kind:"empty"}}else if(n.kind==="held"){const s=this.objects.spawn(n.type.id,e.x,this.groundY,e.z,this.player.yaw);for(let r=0;r<Yn;r++){const o=this.state[r];o.kind==="held"&&o.type===n.type&&(this.state[r]={kind:"empty"})}this.onRelease(s)}}unlink(t){for(let e=0;e<Yn;e++){const n=this.state[e];n.kind==="linked"&&n.obj===t&&(this.state[e]={kind:"empty"})}this.onRelease(t)}fly(t,e){const n=t.type.build(),s=t.group.getWorldPosition(new T);n.position.copy(s),n.rotation.copy(t.mesh.rotation),n.rotateY(t.group.rotation.y),this.flyGroup.add(n),this.flies.push({mesh:n,from:s,hand:e,startMs:this.lastMs,scale:1})}say(t){this.notice=t}inReach(t){return Math.hypot(t.x-this.player.position.x,t.z-this.player.position.z)<=sy}ndc(t,e){return new st(t/window.innerWidth*2-1,-(e/window.innerHeight)*2+1)}pickObject(t,e){this.raycaster.setFromCamera(this.ndc(t,e),this.camera);const n=this.raycaster.intersectObjects(this.objects.raycastTargets(),!0)[0];if(n)return n.object.userData.object;let s=null,r=oy;const o=new T;for(const a of this.objects.objects){if(!a.collectible||(o.copy(a.position).project(this.camera),o.z>1||Math.abs(o.x)>1.2||Math.abs(o.y)>1.2))continue;const c=(o.x*.5+.5)*window.innerWidth,l=(-o.y*.5+.5)*window.innerHeight,h=Math.hypot(c-t,l-e);h<r&&(r=h,s=a)}return s}pickGround(t,e){this.raycaster.setFromCamera(this.ndc(t,e),this.camera);const n=new T;return this.raycaster.ray.intersectPlane(this.groundPlane,n)?n:null}heldTypes(){const t=[];for(const e of this.state)e.kind==="held"&&t.push(e.type.id);return t}handHolding(t){return this.state.findIndex(e=>e.kind==="held"&&e.type.id===t)}freeHand(){for(let t=0;t<this.condition.handsAvailable;t++)if(this.state[t].kind==="empty")return t;return-1}give(t,e){this.state[t]={kind:"held",type:e},this.render(),this.onChange()}pointUnderBox(t){const e=this.boxes[t].getBoundingClientRect(),n=this.ndc(e.left+e.width/2,e.top+e.height),r=new T(n.x,n.y,.5).unproject(this.camera).sub(this.camera.position).normalize();return this.camera.position.clone().addScaledVector(r,1.2)}boxCenter(t){const e=this.boxes[t].getBoundingClientRect();return[e.left+e.width/2,e.top+e.height]}screenOf(t){const e=t.clone().project(this.camera);return e.z>1?null:[(e.x*.5+.5)*window.innerWidth,(-e.y*.5+.5)*window.innerHeight]}drawLines(){const t=[],e=(r,o,a)=>t.push(`<line class="${a}" x1="${r[0].toFixed(1)}" y1="${r[1].toFixed(1)}" x2="${o[0].toFixed(1)}" y2="${o[1].toFixed(1)}"/>`),n=this.gesture;if(n&&n.moved){const r=n.target?this.screenOf(n.target.position)??[n.x,n.y]:[n.x,n.y];e(this.boxCenter(n.hand),r,n.target?"link glow snap":"link glow"),e(this.boxCenter(n.hand),r,n.target?"link core snap":"link core")}const s=this.straining;for(let r=0;r<Yn;r++){const o=this.state[r];if(o.kind!=="linked")continue;const a=this.screenOf(this.nearestPointOn(o.obj));a&&(e(this.boxCenter(r),a,s?"link glow strain":"link glow"),e(this.boxCenter(r),a,s?"link core strain":"link core"))}this.overlay.innerHTML=t.join("")}nearestPointOn(t){if(!t.type.halfLength)return t.position.clone();const e=t.type.halfLength-.1,n=t.group.rotation.y,s=new T(Math.cos(n),0,-Math.sin(n)).multiplyScalar(e),r=t.position.clone().add(s),o=t.position.clone().sub(s),a=this.player.position;return r.distanceToSquared(a)<o.distanceToSquared(a)?r:o}render(){const t=this.straining;this.state.forEach((e,n)=>{const s=this.boxes[n];switch(s.classList.toggle("disabled",n>=this.condition.handsAvailable),s.classList.toggle("full",e.kind!=="empty"),s.classList.toggle("linked",e.kind==="linked"),s.classList.toggle("strain",e.kind==="linked"&&t),e.kind){case"empty":s.innerHTML="";break;case"stack":s.innerHTML=`<i style="background:#${e.type.color.toString(16).padStart(6,"0")}"></i><b>${e.count}</b><small>${e.type.label}</small>`;break;case"held":s.innerHTML=`<i style="background:#${e.type.color.toString(16).padStart(6,"0")}"></i><small>${e.type.label}</small>`;break;case"linked":s.innerHTML=`<i style="background:#${e.obj.type.color.toString(16).padStart(6,"0")}"></i><small>${t?"strain":"dragging"}</small>`;break}})}}const hi=1,py=.9,my=.012,gy=.015,_y=.008,vy=.05,xy=.0015,My={ground:{restore:.35,ceiling:.7},bed:{restore:.5,ceiling:.9}},yy=.1,Sy=.4,Gc={bed:!1,shelter:0},Eu=.05,Ey=.35,wu=.14,wy=.6,lo=1400,ho=.85,Wa=.45,by=.2,bu=.6,Ty=.6,Ay=1100;class Ry{constructor(){b(this,"value",py);b(this,"sinceEating",0);b(this,"phase",{kind:"awake"});b(this,"lastMs",0);b(this,"onEvent",()=>{});b(this,"nourishedUntil",-1)}get band(){const t=this.value/hi;return t<=Eu?"floor":t<by?"exhausted":t<Wa?"tired":t>=ho?"wellfed":"normal"}get busy(){return this.phase.kind!=="awake"}nourished(t){return t<this.nourishedUntil}drainScale(){return this.lastMs<this.nourishedUntil?Ty:1}drain(t){this.phase.kind==="awake"&&(this.value=Math.max(0,this.value-t*this.drainScale()))}sap(t,e){this.phase.kind==="awake"&&(this.value=Math.min(this.value,t*hi),e!==void 0&&(this.phase={kind:"struck",startMs:e}))}eat(t,e=0){this.value=Math.min(hi,this.value+t),this.sinceEating=0,e>0&&(this.nourishedUntil=Math.max(this.nourishedUntil,this.lastMs)+e),this.onEvent("ate")}rest(t,e=Gc){this.phase.kind==="awake"&&(this.phase={kind:"fading",to:"rest",quality:e,startMs:t})}update(t){const e=this.lastMs?Math.min(.25,(t-this.lastMs)/1e3):0;switch(this.lastMs=t,this.phase.kind){case"awake":this.value=Math.max(0,this.value-xy*e*this.drainScale()),this.value<=Eu*hi&&(this.phase={kind:"fading",to:"collapse",quality:Gc,startMs:t},this.onEvent("collapse"));break;case"fading":if(t-this.phase.startMs>=lo){const n=Math.pow(wy,this.sinceEating);if(this.sinceEating++,this.phase.to==="collapse")this.value=Math.max(this.value,Math.max(wu,Ey*n)*hi);else{const r=this.phase.quality,o=My[r.bed?"bed":"ground"],a=Math.min(1,o.ceiling+yy*r.shelter)*hi;this.value=Math.min(Math.max(this.value,a),this.value+o.restore*(1+Sy*r.shelter)*n),this.value=Math.max(this.value,wu*hi)}const s=this.phase.to;this.phase={kind:"waking",startMs:t},this.onEvent(s==="rest"?"rest":"wake")}break;case"struck":t-this.phase.startMs>=Ay&&(this.phase={kind:"waking",startMs:t});break;case"waking":t-this.phase.startMs>=lo&&(this.phase={kind:"awake"});break}}effects(t){const e=this.value/hi,n=this.band,s=Ks((bu-e)/bu),r=Math.pow(s,.8),o=Ks((e-ho)/(1-ho));let a=0;this.phase.kind==="fading"?a=Ks((t-this.phase.startMs)/lo):this.phase.kind==="struck"?a=1:this.phase.kind==="waking"&&(a=1-Ks((t-this.phase.startMs)/lo));const c={wellfed:[1.25,1,2,1.1],normal:[1,1,2,1],tired:[.75,.5,2,.7],exhausted:[.5,.25,2,.45],floor:[.25,.25,2,.3]},[l,h,u,d]=c[n];return{band:n,strength:l,capScale:h,handsAvailable:u,fanScale:d,haloDark:r,haloLight:o,saturation:1-.8*Math.pow(s,1.3)+.15*o,exposure:1-.4*s+.08*o,blackout:a,vision:Ks((e-Wa)/(ho-Wa))}}}function Ks(i){return Math.max(0,Math.min(1,i))}const Cy=24e4,Vc=.15,Py=922396,Ly=1712691,Iy=2240584,Dy=.75,Uy=.5,Ny=9413826,Oy=.3,Fy=.45,By=.5,zy=.35,ky=.72,Hy=1.8,Gy=7304832,Vy=2.5;class Wy{constructor(t,e=Vc){b(this,"time",Vc);b(this,"dayHaze",new bt);b(this,"nightHaze",new bt(Py));b(this,"scratch",new bt);b(this,"hemiDay",new bt);b(this,"hemiNight",new bt(Iy));b(this,"skyNight",new bt(Ly));b(this,"hemiVision",new bt(Ny));b(this,"baseFogDensity");b(this,"overcastHaze",new bt(Gy));b(this,"white",new bt(16777215));this.rig=t,this.time=e,this.dayHaze.setHex(t.dayHaze),this.hemiDay.setHex(t.dayHemiSky),this.baseFogDensity=t.fog.density}get sunHeight(){return Math.sin(this.time*Math.PI*2)}get sunDirection(){const t=this.time*Math.PI*2;return new T(Math.cos(t)*.6+.3,this.sunHeight,-Math.sin(t)*.9).normalize()}get day(){return ue.smoothstep(this.sunHeight,-.25,.35)}advance(t){this.time=(this.time+t/Cy)%1}apply(t=0,e=0,n=0){const s=this.day,r=1-s,o=this.rig;o.sun.position.copy(this.sunDirection).multiplyScalar(40),o.sun.intensity=1.6*s*(1-e*(1-zy)),o.moon.intensity=Uy*r*t*(1-.7*e),o.hemi.intensity=(ue.lerp(.18,1.1,s)+Dy*r*t)*(1-e*(1-ky))+Vy*n,o.hemi.color.copy(this.scratch.copy(this.hemiNight).lerp(this.hemiVision,r*t).lerp(this.hemiDay,s)).lerp(this.white,n),this.scratch.copy(this.nightHaze).lerp(this.dayHaze,s).lerp(this.overcastHaze,e*.7*(.35+.65*s)).lerp(this.white,n*.8),o.fog.color.copy(this.scratch),o.background.copy(this.scratch),o.fog.density=this.baseFogDensity*(1+e*(Hy-1)),o.skyMaterial.color.copy(this.scratch.copy(this.skyNight).lerp(this.white,s)).lerp(this.overcastHaze,e*.6*s).lerp(this.white,n)}vision(t){const e=1-this.day;return{exposure:ue.lerp(1,ue.lerp(Oy,1,t),e),saturation:ue.lerp(1,ue.lerp(.95,Fy,t),e),glow:e*(1-t)}}}const Zs=2500,Xy=180,Yy=720,qy=120,Xa=900,$y=16,jy=700,Ky=6;function Tu(i,t){const n=document.createElement("canvas");n.width=128,n.height=128;const s=n.getContext("2d"),r=s.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);return r.addColorStop(0,"rgba(255,255,255,1)"),r.addColorStop(i,"rgba(255,255,255,1)"),r.addColorStop(Math.min(1,i+t),"rgba(255,255,255,0)"),r.addColorStop(1,"rgba(255,255,255,0)"),s.fillStyle=r,s.fillRect(0,0,128,128),new fl(n)}function Zy(i){const n=document.createElement("canvas");n.width=256,n.height=128;const s=n.getContext("2d"),r=Xe(i);for(let o=0;o<9;o++){const a=256*(.2+r()*.6),c=128*(.45+r()*.25),l=128*(.22+r()*.22),h=s.createRadialGradient(a,c,0,a,c,l);h.addColorStop(0,"rgba(255,255,255,0.95)"),h.addColorStop(.55,"rgba(255,255,255,0.75)"),h.addColorStop(1,"rgba(255,255,255,0)"),s.fillStyle=h,s.fillRect(0,0,256,128)}return s.globalCompositeOperation="destination-out",s.fillStyle="rgba(0,0,0,1)",s.fillRect(0,128*.86,256,128*.14),new fl(n)}class Jy{constructor(t){b(this,"group",new oe);b(this,"sun");b(this,"sunGlow");b(this,"moon");b(this,"stars");b(this,"starMaterial");b(this,"clouds",[]);b(this,"cloudMaterials",[]);b(this,"sunColor",new bt);const e=Tu(.82,.12),n=Tu(0,1);this.sun=new Aa(new Mo({map:e,color:16774096,fog:!1,depthWrite:!1,transparent:!0})),this.sun.scale.setScalar(Xy),this.sunGlow=new Aa(new Mo({map:n,color:16769704,fog:!1,depthWrite:!1,transparent:!0,opacity:.55,blending:Zn})),this.sunGlow.scale.setScalar(Yy),this.moon=new Aa(new Mo({map:e,color:14673650,fog:!1,depthWrite:!1,transparent:!0})),this.moon.scale.setScalar(qy),this.group.add(this.sunGlow,this.sun,this.moon);const s=Xe(77),r=new Float32Array(Xa*3),o=new Float32Array(Xa*3);for(let c=0;c<Xa;c++){const l=s()*2-1,h=s()*Math.PI*2,u=Math.sqrt(1-l*l);r[c*3]=u*Math.cos(h)*Zs*.98,r[c*3+1]=l*Zs*.98,r[c*3+2]=u*Math.sin(h)*Zs*.98;const d=.5+Math.pow(s(),3)*.5,f=s()<.2;o[c*3]=d,o[c*3+1]=d*(f?.92:.97),o[c*3+2]=d*(f?.8:1)}const a=new ee;a.setAttribute("position",new Ne(r,3)),a.setAttribute("color",new Ne(o,3)),this.starMaterial=new Ho({size:3.2,sizeAttenuation:!1,vertexColors:!0,transparent:!0,opacity:0,fog:!1,depthWrite:!1}),this.stars=new dl(a,this.starMaterial),this.group.add(this.stars);for(let c=0;c<$y;c++){const l=Zy(100+c),h=new Pe({map:l,transparent:!0,opacity:.9,fog:!1,depthWrite:!1,side:Ue}),u=260+s()*340,d=new lt(new Fn(u,u*.5),h);d.rotation.x=-Math.PI/2,d.position.set((s()*2-1)*1600,jy+s()*250,(s()*2-1)*1600),this.clouds.push(d),this.cloudMaterials.push(h),this.group.add(d)}t.add(this.group)}update(t,e,n,s,r,o=0){const a=1-o;this.group.position.copy(t),this.sun.position.copy(e).multiplyScalar(Zs*.96),this.sunGlow.position.copy(this.sun.position);const c=ue.clamp(e.y,-.2,1);this.sunColor.setHex(16774096).lerp(new bt(16742954),1-ue.smoothstep(c,0,.5)),this.sun.material.color.copy(this.sunColor),this.sunGlow.material.color.copy(this.sunColor);const l=ue.smoothstep(e.y,-.08,.02);this.sun.material.opacity=l*a,this.sunGlow.material.opacity=l*(.3+.5*(1-ue.smoothstep(c,0,.5)))*a,this.moon.position.copy(e).multiplyScalar(-Zs*.96),this.moon.material.opacity=ue.smoothstep(-e.y,-.08,.05)*(1-.6*n)*a,this.starMaterial.opacity=(1-n)*.95*a,this.stars.rotation.z=s*Math.PI*2;const h=(.25+.75*n)*(1-.5*o),u=1+.9*o;for(let d=0;d<this.clouds.length;d++){const f=this.clouds[d];f.position.z+=Ky*r*(1+o),f.position.z>1700&&(f.position.z=-1700),f.scale.set(u,u,1),this.cloudMaterials[d].color.setRGB(h,h,h*1.02),this.cloudMaterials[d].opacity=Math.min(1,.55+.35*n+.4*o)}}}const Au=1.25,Qy=.05,tS=.02,eS=.3,nS=.15,Ru=.35,iS=.8;class sS{constructor(t,e,n,s,r,o,a){b(this,"kind","craft");b(this,"index");b(this,"board");b(this,"lockReach",3);b(this,"hintLocked");b(this,"lockTargets",[]);b(this,"status","growing");b(this,"onDone",()=>{});b(this,"result",null);b(this,"hover",new T);b(this,"strikePoint",new T);b(this,"restPosition",new T);b(this,"restYaw");b(this,"restRotation",new nn);b(this,"hp");b(this,"stage");b(this,"chipsSpawned",0);b(this,"rand");if(this.target=t,this.recipe=e,this.objects=n,this.lifts=o,this.groundY=a,this.index=t.id,this.hintLocked=`${e.label}: tap a gem, then a neighbour. Each match strikes the ${t.type.label}.`,this.rand=Xe(r^40503),(!t.craft||t.craft.recipeId!==e.id)&&(t.craft={recipeId:e.id,hp:e.hp,stage:0,board:new Dn(wi,bi,r^50343)}),this.board=t.craft.board,this.hp=t.craft.hp,this.stage=t.craft.stage,this.restPosition.copy(t.position),this.restYaw=t.group.rotation.y,this.restRotation.copy(t.group.rotation),o){const c=s.forward;this.hover.set(s.position.x+c.x*Au,s.position.y+.55-Qy,s.position.z+c.z*Au),this.strikePoint.copy(this.hover),t.group.position.copy(this.hover),t.group.rotation.set(0,Math.atan2(c.x,c.z)+Math.PI/2,.15)}else this.hover.copy(t.position),this.strikePoint.copy(t.position).add(new T(0,nS,0));t.collectible=!1}get center(){return this.hover.clone()}lockPose(t){if(!this.lifts){const n=Ki(this.target.position,t.position,t.forward);return n.target.y-=eS,n}const e=t.position.clone();return e.y+=.55,Sx(this.hover,e,t.forward)}distanceTo(t){return Math.hypot(t.x-this.hover.x,t.z-this.hover.z)}targetFor(t){return this.status!=="growing"?null:Ti.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){return this.strikePoint.clone()}onPoseLifted(t){this.lifts&&(this.hover.y+=t,this.strikePoint.y+=t,this.target.group.position.y=this.hover.y)}scatterChips(t){const e=this.recipe.chips??0,n=Math.round(e*t);for(;this.chipsSpawned<n;){const s=this.rand()*Math.PI*2,r=Ru+this.rand()*(iS-Ru);this.objects.spawn("chip",this.restPosition.x+Math.cos(s)*r,this.groundY,this.restPosition.z+Math.sin(s)*r,this.rand()*Math.PI),this.chipsSpawned++}}feed(t,e){if(this.status!=="growing")return;this.hp=Math.max(0,this.hp-e);const n=this.hp/this.recipe.hp,s=this.recipe.stages.length;let r=0;for(let o=1;o<=s;o++)n<=(s+1-o)/(s+1)&&(r=o);r!==this.stage&&(this.stage=r,this.target.setLook(this.recipe.stages[r-1]),this.scatterChips(r/(s+1))),this.target.craft={...this.target.craft,hp:this.hp,stage:this.stage},this.hp<=0&&(this.status="resolved",this.result=this.recipe.result,this.scatterChips(1),this.objects.remove(this.target),this.onDone(this))}cancel(){this.status==="growing"&&(this.lifts&&(this.target.group.position.copy(this.restPosition),this.target.group.rotation.copy(this.restRotation)),this.target.collectible=!0,this.status="resolved")}poolText(){return`${this.recipe.label.toLowerCase()} ${this.recipe.hp-this.hp}/${this.recipe.hp}`}update(t){this.status!=="growing"||!this.lifts||(this.target.group.position.y=this.hover.y+Math.sin(t/400)*tS)}}const rS=[{id:"hand-axe",label:"Knap a hand axe",target:"rock",requiresHeld:"rock",result:"hand_axe",hp:12,stages:["rock_chipped","rock_wedge"],drain:.012},{id:"notch-long",label:"Notch it (three notches)",target:"log",requiresHeld:"hand_axe",result:"log_long_notched",chips:8,hp:16,stages:["log_scored"],drain:.014},{id:"halve",label:"Cut in half",target:"log",requiresHeld:"hand_axe",result:"log_short",resultCount:2,chips:6,hp:12,stages:["log_halved"],drain:.014},{id:"timber-long",label:"Cut into long timber",target:"log",requiresHeld:"hand_axe",result:"timber",resultCount:4,chips:10,hp:22,stages:["log_scored","log_split"],drain:.014},{id:"notch-short",label:"Notch it (two notches)",target:"log_short",requiresHeld:"hand_axe",result:"log_notched",chips:5,hp:10,stages:["log_scored_short"],drain:.014},{id:"timber-short",label:"Cut into short timber",target:"log_short",requiresHeld:"hand_axe",result:"timber_short",resultCount:2,chips:6,hp:14,stages:["log_scored_short","log_split_short"],drain:.014},{id:"stubs",label:"Cut into knuckles",target:"log_notched",requiresHeld:"hand_axe",result:"log_stub",resultCount:2,chips:3,hp:8,stages:["log_stubbed"],drain:.014}];function oS(i,t){return rS.filter(e=>e.target===i).map(e=>e.requiresHeld&&!t.includes(e.requiresHeld)?{recipe:e,available:!1,reason:`needs a ${e.requiresHeld.replace("_"," ")} in hand`}:{recipe:e,available:!0})}const Te=Xi,un=Is*2,Wc=8,aS=7,cS=5,lS=1.2,Cu=()=>[{type:"log_long_notched",along:0,across:-Te,y:un/2,yaw:0,tag:"course"},{type:"log_long_notched",along:0,across:Te,y:un/2,yaw:0,tag:"course"},{type:"log_long_notched",along:-Te,across:0,y:un,yaw:Math.PI/2,tag:"course"}],El=[{id:"campfire",label:"Campfire",blurb:"Two knuckles crossed, four sticks stood against each other over them, a handful of shavings in the middle. Light it, and feed it.",pieces:[{type:"log_stub",along:0,across:0,y:un/2,yaw:0,tag:"fire"},{type:"log_stub",along:0,across:0,y:un/2+.12,yaw:Math.PI/2,tag:"fire"},...[0,1,2,3].map(i=>({type:"stick",along:Math.cos(i*Math.PI/2)*.16,across:Math.sin(i*Math.PI/2)*.16,y:.52,yaw:i*Math.PI/2,tilt:1.15,tag:"fire"})),...[0,1,2,3,4].map(i=>({type:"chip",along:Math.cos(i*1.26)*.06,across:Math.sin(i*1.26)*.06,y:.42,yaw:i,tag:"fire"}))],siting:"ground",half:[.6,.6],fits:()=>null},{id:"u-course",label:"Cabin course",blurb:"Three long notched logs in a U, two bays each way, open toward you. Each course raises the walls a log. Three make a wall you stand behind.",pieces:Cu(),siting:"ground",half:[Te+.15,Te+.15],fits:()=>null},{id:"u-course-up",label:"Another course",blurb:"The next U of long logs, dropped into the notches of the one below.",pieces:Cu(),siting:"top",half:[Te+.15,Te+.15],fits:i=>i.roofSlats>0?"The roof is on.":null},{id:"door-wall",label:"Door wall course",blurb:"Closes the open front from one side: a knuckle as a portable notch, a short notched log on it. The gap it leaves is the doorway. One per course.",pieces:[{type:"log_stub",along:Te,across:0,y:un/2,yaw:0,tag:"door"},{type:"log_notched",along:Te,across:-Te+Fe/2-.15,y:un,yaw:Math.PI/2,tag:"door"}],siting:"top",half:[.4,Te+.15],fits:i=>i.courses===0?"Needs a course to sit on.":i.doorCourses>=i.courses?"Needs another course first.":null,baseOf:i=>un*i.doorCourses},{id:"roof",label:"Slat roof",blurb:"Long timbers across the side walls, edge to edge. Rain stops where a slat is; it comes through the gaps until the roof is whole.",pieces:Array.from({length:Wc},(i,t)=>({type:"timber",along:-.75+.24*t,across:0,y:.05,yaw:Math.PI/2,tag:"roof"})),siting:"top",half:[Te+.15,Ge/2],fits:i=>i.courses===0?"Needs walls.":i.roofSlats>0?"Already roofed.":null},{id:"floor",label:"Timber floor",blurb:"Long timbers laid inside, wall to wall. A dry floor to sleep on.",pieces:Array.from({length:aS},(i,t)=>({type:"timber",along:0,across:-.72+.24*t,y:.05,yaw:0,tag:"floor"})),siting:"inside",half:[Te-.2,Te-.2],fits:i=>i.courses===0?"Needs walls around it.":i.floorBoards>0?"Already floored.":null},{id:"bed",label:"Bed",blurb:"Two short timbers as rails and a hand of sticks laid across. Furniture: inside, on the floor, under the roof.",pieces:[{type:"timber_short",along:-.3,across:-.3,y:.05,yaw:0,tag:"bed"},{type:"timber_short",along:-.3,across:.3,y:.05,yaw:0,tag:"bed"},...Array.from({length:cS},(i,t)=>({type:"stick",along:-.3-.24+.12*t,across:0,y:.13,yaw:Math.PI/2,tag:"bed"}))],siting:"inside",half:[.8,.5],fits:i=>i.courses===0?"Needs walls around it.":i.bedPieces>0?"There is a bed.":null}];function hS(i){return El.filter(t=>i?t.siting!=="ground":t.siting==="ground").map(t=>({bp:t,reason:i?t.fits(i):null}))}function uS(i){const t=new Map;for(const e of i.pieces)t.set(e.type,(t.get(e.type)??0)+1);return[...t].map(([e,n])=>({type:e,count:n}))}function wl(i){return uS(i).map(({type:t,count:e})=>`${e} ${Mn[t].label}${e>1&&!Mn[t].label.endsWith("s")?"s":""}`).join(", ")}const dS=["log","log_short","log_long_notched","log_notched","log_stub","timber","timber_short","stick"];function fS(i,t){const e=t.getContext("2d");if(!e)return;const n=t.width,s=t.height;e.clearRect(0,0,n,s);const r=Math.min(n/(i.half[0]*2+1.2),s/(i.half[1]*2+1.6))*.85,o=n/2,a=s/2+14,c=(u,d,f)=>[o+u*r,a+d*r*.55-f*r*.9];e.strokeStyle="rgba(190, 255, 170, 0.35)",e.setLineDash([4,4]),e.beginPath(),[[-i.half[0],-i.half[1]],[i.half[0],-i.half[1]],[i.half[0],i.half[1]],[-i.half[0],i.half[1]]].forEach(([u,d],f)=>{const[g,v]=c(u,d,0);f===0?e.moveTo(g,v):e.lineTo(g,v)}),e.closePath(),e.stroke(),e.setLineDash([]);const h=[...i.pieces].sort((u,d)=>u.y-d.y||u.across-d.across);for(const u of h){const d=pS(u.type),f=u.type.startsWith("timber")?.24:u.type==="stick"?.08:un,g=u.yaw===0?d:f,v=u.yaw===0?f:d,[m,p]=c(u.along-g/2,u.across-v/2,u.y),[S,x]=c(u.along+g/2,u.across+v/2,u.y),y=Math.min(1,.55+u.y*.5);e.fillStyle=u.type.startsWith("timber")?`rgba(184, 146, 90, ${y})`:u.type==="stick"?`rgba(120, 90, 60, ${y})`:`rgba(110, 78, 50, ${y})`,e.strokeStyle="rgba(0,0,0,0.5)",e.fillRect(m,x,S-m,p-x),e.strokeRect(m,x,S-m,p-x)}e.fillStyle="rgba(190, 255, 170, 0.8)",e.font="11px system-ui, sans-serif",e.textAlign="right",e.fillText("you ▸",n-6,s-6)}function pS(i){switch(i){case"log":case"log_long_notched":case"timber":return Ge;case"log_short":case"log_notched":case"timber_short":return Fe;case"log_stub":return Hi;case"stick":return .55;default:return .3}}const mS=.9,Pu=1.15,gS=.12,Lu=.17;class bl{constructor(t,e){b(this,"pieces",[]);b(this,"fire",null);this.center=t,this.yaw=e}get isCampfire(){return this.pieces.some(t=>t.plan.tag==="fire")}get courses(){return Math.floor(this.pieces.filter(t=>t.plan.tag==="course").length/3)}get doorCourses(){return Math.floor(this.pieces.filter(t=>t.plan.tag==="door").length/2)}get roofSlats(){return this.pieces.filter(t=>t.plan.tag==="roof").length}get floorBoards(){return this.pieces.filter(t=>t.plan.tag==="floor").length}get bedPieces(){return this.pieces.filter(t=>t.plan.tag==="bed").length}get bed(){return this.bedPieces>=7}get wallTop(){return un*this.courses}get shelter(){return Math.min(1,this.roofSlats/Wc)}baseFor(t){return t.baseOf?t.baseOf(this):t.siting==="top"?this.wallTop:t.siting==="inside"&&this.floorBoards>0?.1:0}local(t,e){const n=t-this.center.x,s=e-this.center.z;return{along:n*Math.cos(this.yaw)-s*Math.sin(this.yaw),across:n*Math.sin(this.yaw)+s*Math.cos(this.yaw)}}world(t,e){return new T(this.center.x+t*Math.cos(this.yaw)+e*Math.sin(this.yaw),0,this.center.z-t*Math.sin(this.yaw)+e*Math.cos(this.yaw))}inside(t,e){if(this.courses===0)return!1;const n=this.local(t,e);return Math.abs(n.along)<=Te-un/2&&Math.abs(n.across)<=Te-un/2}covers(t,e){if(this.roofSlats===0)return!1;const n=this.local(t,e);return Math.abs(n.along)<=Te+.15&&Math.abs(n.across)<=Te+.15}dryStrips(t){const e=this.pieces.filter(n=>n.plan.tag==="roof");return e.length===0?[]:e.length>=Wc?[{x:this.center.x,z:this.center.z,yaw:this.yaw,halfAlong:Te+.15,halfAcross:Pu,y:t+e[0].y}]:e.map(n=>({x:n.obj.position.x,z:n.obj.position.z,yaw:this.yaw,halfAlong:gS,halfAcross:Pu,y:t+n.y}))}colliders(){const t=[];for(const e of this.pieces){if(e.plan.tag!=="course"&&e.plan.tag!=="door"&&e.plan.tag!=="cut"||e.y>mS)continue;const n=(e.obj.type.halfLength??.3)-.1,s=e.obj.group.rotation.y,r=Math.cos(s)*n,o=-Math.sin(s)*n;t.push({x1:e.obj.position.x-r,z1:e.obj.position.z-o,x2:e.obj.position.x+r,z2:e.obj.position.z+o,radius:un/2})}return t}wallOf(t){return t.plan.tag!=="course"?null:t.plan.yaw!==0?"back":t.plan.across<0?"A":"B"}uncutLogs(t){return this.pieces.filter(e=>this.wallOf(e)===t&&e.obj.type.id==="log_long_notched").sort((e,n)=>e.y-n.y)}cutCourse(t,e,n){const s=this.uncutLogs(t)[0];if(!s)return null;const r=s.obj.group.rotation.y,o=Math.cos(r),a=-Math.sin(r),c=cf/2+No/2,l=s.obj.position,h=n+s.y;e.remove(s.obj);const u=e.spawn("log_half",l.x-o*c,h-Lu,l.z-a*c,r),d=e.spawn("log_half",l.x+o*c,h-Lu,l.z+a*c,r+Math.PI),f=this.pieces.indexOf(s);this.pieces.splice(f,1,{obj:u,plan:s.plan,y:s.y},{obj:d,plan:{...s.plan,tag:"cut"},y:s.y});for(const v of[u,d])v.collectible=!1,v.mesh.traverse(m=>m.userData.structure=this);const g=this.wallOf(s)==="back"?this.world(-1,0).sub(this.center).normalize():this.world(0,s.plan.across).sub(this.center).normalize();return e.spawn("log_stub",l.x+g.x*.7,n,l.z+g.z*.7,r+Math.PI/2)}place(t,e,n){t.collectible=!1,t.mesh.traverse(s=>s.userData.structure=this),this.pieces.push({obj:t,plan:e,y:n})}removeLast(){const t=this.pieces.pop();return t&&(t.obj.collectible=!0,t.obj.mesh.traverse(e=>delete e.userData.structure)),t}}class _S{constructor(t){b(this,"list",[]);this.groundY=t}add(t){this.list.includes(t)||this.list.push(t)}remove(t){const e=this.list.indexOf(t);e>=0&&this.list.splice(e,1)}raycastTargets(){return this.list.flatMap(t=>t.pieces.map(e=>e.obj.mesh))}dryStrips(){return this.list.flatMap(t=>t.dryStrips(this.groundY))}colliders(){return this.list.flatMap(t=>t.colliders())}shelterAt(t,e){let n=0;for(const s of this.list)s.covers(t,e)&&(n=Math.max(n,s.shelter));return n}bedNear(t,e){return this.list.find(n=>n.bed&&n.inside(t,e))??null}}const vS=8;function xS(i,t,e){const n=new ee;return n.setAttribute("position",new Ft([i[0],i[1],0,t[0],t[1],0,e[0],e[1],0],3)),n.computeVertexNormals(),n}function Iu(i,t,e,n){const s=new ee;return s.setAttribute("position",new Ft([i[0],i[1],0,t[0],t[1],0,e[0],e[1],0,i[0],i[1],0,e[0],e[1],0,n[0],n[1],0],3)),s.computeVertexNormals(),s}function MS(i){switch(i){case"wheat":default:{const e=[];e.push(Iu([-.06*.42,-1*.42],[.02*.42,-1*.42],[.1*.42,-.4*.42],[.02*.42,-.4*.42])),e.push(Iu([.02*.42,-.4*.42],[.1*.42,-.4*.42],[.18*.42,.2*.42],[.1*.42,.2*.42]));for(let n=0;n<6;n++){const s=(.2+n*.16)*.42,r=n%2===0?-1:1,o=(.14+n*.013)*.42;e.push(xS([o,s],[o+r*.32*.42,s+.1*.42],[o+.03*.42,s+.22*.42]))}return e}}}const Tl=520,yS=.014,SS=.008,ES=.12,lf=14263361,wS=8380538,bS=10475775,TS=.28,Wo=.2,Xo=.25,AS=()=>new Pe({color:lf,transparent:!0,opacity:.85,depthWrite:!1,toneMapped:!1,side:Ue}),RS=new Pe({color:bS,transparent:!0,opacity:TS,depthWrite:!1,toneMapped:!1});class Ds{constructor(t,e,n,s,r){b(this,"kind","site");b(this,"index");b(this,"board");b(this,"lockReach",4.5);b(this,"hintLocked");b(this,"lockTargets",[]);b(this,"status","growing");b(this,"onDone",()=>{});b(this,"onMissing",()=>{});b(this,"onPlaced",()=>{});b(this,"group",new oe);b(this,"center");b(this,"ringRadius");b(this,"floorY");b(this,"ring");b(this,"ghosts",[]);b(this,"base");b(this,"placed",0);b(this,"flights",[]);b(this,"lastCheckMs",-1);b(this,"ready",!1);this.blueprint=t,this.structure=e,this.objects=n,this.groundY=s,this.index=9e3+Math.floor(Math.random()*1e5),this.center=e.center.clone(),this.center.y=s,this.base=e.baseFor(t),this.floorY=s+this.base+Math.max(...t.pieces.map(a=>a.y))+Xo,this.board=new Dn(wi,bi,r^20967),this.hintLocked=`${t.label}: tap a gem, then a neighbour. Each match sets a piece in place.`,this.ringRadius=Math.hypot(t.half[0],t.half[1])+lS,this.ring=new lt(new Fs(this.ringRadius-ES,this.ringRadius,48),AS()),this.ring.rotation.x=-Math.PI/2,this.ring.position.set(this.center.x,s+.02,this.center.z),this.ring.userData.interactable=this,this.group.add(this.ring);const o=new lt(new Go(this.ringRadius,32),new Pe({visible:!1}));o.rotation.x=-Math.PI/2,o.position.copy(this.ring.position),o.userData.interactable=this,this.group.add(o),this.lockTargets.push(this.ring,o);for(const a of t.pieces){const c=Mn[a.type].build();c.traverse(u=>{u.isMesh&&(u.material=RS)});const l=new oe;l.add(c);const h=this.placeOf(a);l.position.copy(h.position),l.rotation.y=h.yaw,a.tilt&&(l.rotation.z=a.tilt),this.group.add(l),this.ghosts.push(l)}}placeOf(t){const e=this.structure.world(t.along,t.across);return e.y=this.groundY+this.base+t.y,{position:e,yaw:this.structure.yaw+t.yaw}}get total(){return this.blueprint.pieces.length}get done(){return this.placed}missing(){const t=new Map;for(const e of this.blueprint.pieces.slice(this.placed))t.set(e.type,(t.get(e.type)??0)+1);for(const e of this.inRing())t.has(e.type.id)&&t.set(e.type.id,t.get(e.type.id)-1);return[...t].filter(([,e])=>e>0).map(([e,n])=>({type:e,count:n}))}inRing(){return this.objects.objects.filter(t=>t.collectible&&Math.hypot(t.position.x-this.center.x,t.position.z-this.center.z)<=this.ringRadius)}get isReady(){return this.ready}lockPose(t){const e=Ki(this.center,t.position,t.forward);return e.target.y+=Wo,e}distanceTo(t){return Math.hypot(t.x-this.center.x,t.z-this.center.z)}targetFor(t){return this.status!=="growing"?null:Ti.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){const t=this.blueprint.pieces[this.placed];return t?this.placeOf(t).position:this.center.clone()}feed(t,e,n){if(this.status!=="growing")return;const s=this.blueprint.pieces[this.placed];if(!s)return;const r=this.placeOf(s),o=this.inRing().filter(c=>c.type.id===s.type);if(o.length===0){this.onMissing(s.type);return}o.sort((c,l)=>c.position.distanceToSquared(r.position)-l.position.distanceToSquared(r.position));const a=o[0];a.collectible=!1,this.placed++,this.ghosts[this.placed-1].visible=!1,this.flights.push({obj:a,from:a.group.position.clone(),to:r.position,fromYaw:a.group.rotation.y,toYaw:r.yaw,startMs:n,onLand:()=>{s.tilt&&(a.group.rotation.z=s.tilt),this.structure.place(a,s,this.base+s.y),this.onPlaced(this.placed,this.total),this.placed>=this.total&&this.flights.length===0&&(this.status="resolved",this.onDone(this))}})}cancel(){}dispose(){this.group.removeFromParent()}poolText(){return`${this.blueprint.label.toLowerCase()} ${this.placed}/${this.total}`}update(t){for(let e=this.flights.length-1;e>=0;e--){const n=this.flights[e],s=Math.min(1,(t-n.startMs)/Tl),r=s*s*(3-2*s);n.obj.group.position.lerpVectors(n.from,n.to,r),n.obj.group.position.y+=Math.sin(s*Math.PI)*.6,n.obj.group.rotation.y=n.fromYaw+(n.toYaw-n.fromYaw)*r,n.obj.group.rotation.z=0,s>=1&&(n.obj.group.position.copy(n.to),n.obj.group.rotation.y=n.toYaw,this.flights.splice(e,1),n.onLand())}this.status==="growing"&&(t-this.lastCheckMs>300&&(this.lastCheckMs=t,this.ready=this.missing().length===0,this.ring.material.color.setHex(this.ready?wS:lf)),this.ring.material.opacity=.7+.25*Math.sin(t/500))}}class CS{constructor(t,e,n,s,r){b(this,"kind","site");b(this,"index");b(this,"board");b(this,"lockReach",4.5);b(this,"hintLocked","Cutting a doorway: tap a gem, then a neighbour. Each match cuts a log through.");b(this,"lockTargets",[]);b(this,"status","growing");b(this,"onDone",()=>{});b(this,"onCut",()=>{});b(this,"center");b(this,"floorY");b(this,"flights",[]);this.structure=t,this.wall=e,this.objects=n,this.groundY=s,this.index=9700+Math.floor(Math.random()*1e5);const o=t.uncutLogs(e)[0];this.center=o?o.obj.position.clone():t.center.clone(),this.center.y=s,this.floorY=s+t.wallTop+Xo,this.board=new Dn(wi,bi,r^27919),o||(this.status="resolved")}lockPose(t){const e=Ki(this.center,t.position,t.forward);return e.target.y+=Wo,e}distanceTo(t){return Math.hypot(t.x-this.center.x,t.z-this.center.z)}targetFor(t){return this.status!=="growing"?null:Ti.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){const t=this.structure.uncutLogs(this.wall)[0];return t?t.obj.group.position.clone():this.center.clone()}feed(t,e,n){if(this.status!=="growing")return;const s=this.structure.cutCourse(this.wall,this.objects,this.groundY);if(!s)return;const r=s.group.position.clone();s.collectible=!1,this.flights.push({obj:s,from:this.targetWorldPosition().clone().add(new T(0,.2,0)),to:r,fromYaw:s.group.rotation.y,toYaw:s.group.rotation.y,startMs:n,onLand:()=>{s.collectible=!0}});const o=this.structure.uncutLogs(this.wall).length;this.onCut(o),o===0&&(this.status="resolved",this.onDone(this))}cancel(){}poolText(){return`doorway, ${this.structure.uncutLogs(this.wall).length} logs to cut`}update(t){PS(this.flights,t)}}function PS(i,t){for(let e=i.length-1;e>=0;e--){const n=i[e],s=Math.min(1,(t-n.startMs)/Tl),r=s*s*(3-2*s);n.obj.group.position.lerpVectors(n.from,n.to,r),n.obj.group.position.y+=Math.sin(s*Math.PI)*.6,n.obj.group.rotation.y=n.fromYaw+(n.toYaw-n.fromYaw)*r,s>=1&&(n.obj.group.position.copy(n.to),n.obj.group.rotation.y=n.toYaw,i.splice(e,1),n.onLand())}}const Du=5;class LS{constructor(t,e,n){b(this,"kind","site");b(this,"index");b(this,"board");b(this,"lockReach",4);b(this,"hintLocked","Lighting the fire: tap a gem, then a neighbour. Every match is a spark.");b(this,"lockTargets",[]);b(this,"status","growing");b(this,"onDone",()=>{});b(this,"onSpark",()=>{});b(this,"center");b(this,"floorY");b(this,"sparks",0);this.structure=t,this.index=9800+Math.floor(Math.random()*1e5),this.center=t.center.clone(),this.center.y=e,this.floorY=e+.7+Xo,this.board=new Dn(wi,bi,n^16154)}lockPose(t){const e=Ki(this.center,t.position,t.forward);return e.target.y+=Wo,e}distanceTo(t){return Math.hypot(t.x-this.center.x,t.z-this.center.z)}targetFor(t){return this.status!=="growing"?null:Ti.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){return this.center.clone().add(new T(0,.45,0))}feed(){var t;this.status==="growing"&&(this.sparks++,this.onSpark(this.sparks),this.sparks>=Du&&((t=this.structure.fire)==null||t.ignite(),this.status="resolved",this.onDone(this)))}cancel(){}poolText(){return`sparks ${this.sparks}/${Du}`}update(){}}class hf{constructor(t,e,n,s){b(this,"kind","site");b(this,"index");b(this,"board");b(this,"lockReach",4.5);b(this,"hintLocked","Taking it apart: tap a gem, then a neighbour. Each match lifts a piece off.");b(this,"lockTargets",[]);b(this,"status","growing");b(this,"onDone",()=>{});b(this,"onRemoved",()=>{});b(this,"center");b(this,"floorY");b(this,"flights",[]);b(this,"taken",0);this.structure=t,this.structures=e,this.groundY=n,this.index=9500+Math.floor(Math.random()*1e5),this.center=t.center.clone(),this.center.y=n,this.floorY=n+Math.max(0,...t.pieces.map(r=>r.y))+Xo,this.board=new Dn(wi,bi,s^11133)}lockPose(t){const e=Ki(this.center,t.position,t.forward);return e.target.y+=Wo,e}distanceTo(t){return Math.hypot(t.x-this.center.x,t.z-this.center.z)}targetFor(t){return this.status!=="growing"?null:Ti.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){const t=this.structure.pieces[this.structure.pieces.length-1];return t?t.obj.group.position.clone():this.center.clone()}feed(t,e,n){if(this.status!=="growing")return;const s=this.structure.removeLast();if(!s)return;this.taken++;const r=this.taken,o=this.structure.world(2.4+.35*(r%3),-.8+.4*(r*7%5));o.y=this.groundY+s.obj.type.restHeight,s.obj.collectible=!1,this.flights.push({obj:s.obj,from:s.obj.group.position.clone(),to:o,fromYaw:s.obj.group.rotation.y,toYaw:this.structure.yaw+.3*(r%4-1.5),startMs:n,onLand:()=>{s.obj.collectible=!0,this.onRemoved(this.structure.pieces.length),this.structure.pieces.length===0&&this.flights.length===0&&(this.structures.remove(this.structure),this.status="resolved",this.onDone(this))}})}cancel(){}poolText(){return`taking apart, ${this.structure.pieces.length} left`}update(t){for(let e=this.flights.length-1;e>=0;e--){const n=this.flights[e],s=Math.min(1,(t-n.startMs)/Tl),r=s*s*(3-2*s);n.obj.group.position.lerpVectors(n.from,n.to,r),n.obj.group.position.y+=Math.sin(s*Math.PI)*.6,n.obj.group.rotation.y=n.fromYaw+(n.toYaw-n.fromYaw)*r,s>=1&&(n.obj.group.position.copy(n.to),n.obj.group.rotation.y=n.toYaw,this.flights.splice(e,1),n.onLand())}}}const IS=.7,Ya=.55,DS=.012,Uu=new Pe({color:3820122,transparent:!0,opacity:.55,depthWrite:!1,toneMapped:!1,side:Ue}),US=new Pe({color:16769146,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1,side:Ue}),uo=new Pe({color:16777215,transparent:!0,opacity:1,depthWrite:!1,toneMapped:!1,side:Ue,blending:Zn}),NS=1100,Nu=14,OS=(()=>{const i=new ee;return i.setAttribute("position",new Ft([0,0,0,.09,.02,0,.03,.08,0],3)),i.computeVertexNormals(),i})();class Yo{constructor(t,e,n,s,r,o){b(this,"kind","site");b(this,"index");b(this,"board");b(this,"lockReach",3.5);b(this,"hintLocked");b(this,"lockTargets",[]);b(this,"status","growing");b(this,"onDone",()=>{});b(this,"onCharged",()=>{});b(this,"center");b(this,"group",new oe);b(this,"segments",[]);b(this,"charged",0);b(this,"seeds");b(this,"doneAt",-1);b(this,"shards",[]);b(this,"finished",!1);this.rune=t,this.result=e,this.objects=s,this.groundY=r,this.index=9900+Math.floor(Math.random()*1e5),this.center=n.position.clone(),this.center.y=r,this.seeds=s.objects.filter(a=>a.collectible&&a.type.id===n.type.id&&Math.hypot(a.position.x-this.center.x,a.position.z-this.center.z)<=IS);for(const a of this.seeds)a.collectible=!1;this.board=new Dn(wi,bi,o^32273),this.hintLocked=`The ${t} rune: tap a gem, then a neighbour. Each match charges an angle.`;for(const a of MS(t)){const c=new lt(a,Uu);this.segments.push(c),this.group.add(c)}this.group.position.set(this.center.x,r+Ya,this.center.z),this.group.rotation.x=-Math.PI/2}get total(){return vS}lockPose(t){const e=Ki(this.center,t.position,t.forward);return e.target.y+=Ya,e}distanceTo(t){return Math.hypot(t.x-this.center.x,t.z-this.center.z)}targetFor(t){return this.status!=="growing"?null:Ti.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){return this.group.position.clone()}feed(t,e,n){if(this.status==="growing"&&(this.charged<this.segments.length&&(this.segments[this.charged].material=US),this.charged++,this.onCharged(this.charged,this.total),this.charged>=this.total)){for(const s of this.seeds){const r=s.position.clone(),o=s.group.rotation.y;this.objects.remove(s),this.objects.spawn(this.result,r.x,this.groundY,r.z,o).waggle(n)}this.doneAt=n;for(const s of this.segments)s.material=uo;for(let s=0;s<Nu;s++){const r=s/Nu*Math.PI*2+Math.random()*.4,o=new lt(OS,uo);o.position.set(Math.cos(r)*.1,Math.sin(r)*.1,0),this.group.add(o);const a=1.6+Math.random()*1.4;this.shards.push({mesh:o,vx:Math.cos(r)*a,vy:Math.sin(r)*a,vz:1.2+Math.random()*1.5,spin:(Math.random()-.5)*12})}this.status="resolved",this.onDone(this)}}cancel(){for(const t of this.seeds)t.collectible=!0}dispose(){this.group.removeFromParent()}poolText(){return`${this.rune} rune ${this.charged}/${this.total}`}update(t){if(!this.finished){if(this.doneAt>=0){const e=(t-this.doneAt)/1e3,n=Math.min(1,e/(NS/1e3));this.group.rotation.z+=.02+.08*(1-n);const s=1+2.2*Math.sin(n*Math.PI*.5);this.group.position.y=this.groundY+Ya+.7*n,this.segments.forEach((r,o)=>{const a=o/this.segments.length*Math.PI*2;r.scale.setScalar(s),r.position.set(Math.cos(a)*.9*n,Math.sin(a)*.9*n,0)});for(const r of this.shards)r.mesh.position.x+=r.vx*(1/60),r.mesh.position.y+=r.vy*(1/60),r.mesh.position.z+=r.vz*(1/60),r.vz-=4*(1/60),r.mesh.rotation.z+=r.spin*(1/60);uo.opacity=n<.15?1:Math.max(0,1-(n-.15)/.85),uo.color.setHex(n<.25?16777215:16769146),n>=1&&(this.dispose(),this.finished=!0);return}this.group.rotation.z=t/4e3,Uu.opacity=.55+.1*Math.sin(t/300)}}}const qa=15e4,Al={chip:8e3,stick:35e3,log_stub:11e4},FS=48e4,BS=2.6,zS=9,kS=.25,HS=new Pe({color:16752688,transparent:!0,opacity:.85,depthWrite:!1,toneMapped:!1,blending:Zn}),GS=new Pe({color:16773280,transparent:!0,opacity:.9,depthWrite:!1,toneMapped:!1,blending:Zn}),VS=new qt({color:3807754,emissive:16732176,emissiveIntensity:0,roughness:1,flatShading:!0});class WS{constructor(t,e){b(this,"group",new oe);b(this,"light");b(this,"flames",[]);b(this,"core");b(this,"embers");b(this,"fuelMs",0);b(this,"lit",!1);b(this,"lastMs",-1);b(this,"phase",Math.random()*100);this.group.position.set(t.x,e,t.z),this.light=new jd(16752704,0,zS,2),this.light.position.y=.6,this.group.add(this.light);for(let n=0;n<3;n++){const s=new lt(new Ls(.16-n*.03,.55-n*.1,6),HS);s.position.set(Math.cos(n*2.1)*.08,.45,Math.sin(n*2.1)*.08),this.flames.push(s),this.group.add(s)}this.core=new lt(new Ls(.08,.3,5),GS),this.core.position.y=.4,this.group.add(this.core),this.embers=new lt(new xn(.16,0),VS.clone()),this.embers.scale.set(1.2,.35,1.2),this.embers.position.y=.36,this.group.add(this.embers),this.show(0)}get level(){return this.fuelMs/qa}ignite(){this.lit=!0,this.fuelMs<qa&&(this.fuelMs=qa)}feed(t){const e=Al[t];return e?(this.fuelMs=Math.min(FS,this.fuelMs+e),!0):!1}show(t){const e=.85+.15*Math.sin(this.phase*7.3)*Math.sin(this.phase*3.1),n=Math.min(1,t)*e;this.flames.forEach((s,r)=>{s.visible=n>.02,s.scale.set(1,.4+n*(1+.15*Math.sin(this.phase*9+r)),1),s.position.y=.36+.22*s.scale.y}),this.core.visible=n>.05,this.core.scale.setScalar(.6+n*.6),this.light.intensity=BS*n,this.embers.material.emissiveIntensity=this.lit?.6+.6*n:Math.max(0,.35-t*.3)}update(t){const e=this.lastMs<0?0:Math.min(.25,Math.max(0,(t-this.lastMs)/1e3));this.lastMs=t,this.phase+=e,this.lit&&(this.fuelMs=Math.max(0,this.fuelMs-e*1e3),this.fuelMs<=0&&(this.lit=!1)),this.show(this.lit?Math.max(kS*.6,this.level):0)}}const Ou=15e4,XS=3e5,Fu=3e4,YS=55e3,qS=11e4,Bu=8e3,$S=.0015,jS=4e4,KS=.12,ZS=.16,zu=160,JS=420,QS=600,$a=1400,Ni=14,ku=9,tE=9,Hu=.45,Gu=.12,eE=.6;class Rl{constructor(t,e,n,s=!1){b(this,"rain",0);b(this,"flash",0);b(this,"onRain",()=>{});b(this,"onLightning",()=>{});b(this,"phase");b(this,"rainStart",-1);b(this,"rand");b(this,"lines");b(this,"positions");b(this,"material");b(this,"lastMs",-1);b(this,"thunderAt",-1);b(this,"thunderNear",!1);b(this,"flashMs",zu);this.rand=Xe(e^31262),this.phase={kind:"dry",until:n+(s?0:qS)},this.positions=new Float32Array($a*2*3);for(let o=0;o<$a;o++)this.positions[o*6]=(this.rand()-.5)*Ni,this.positions[o*6+1]=this.rand()*ku-3,this.positions[o*6+2]=(this.rand()-.5)*Ni;const r=new ee;r.setAttribute("position",new Ne(this.positions,3)),this.material=new ul({color:14542578,transparent:!0,opacity:0,depthWrite:!1,fog:!1,toneMapped:!1}),this.lines=new Hd(r,this.material),this.lines.frustumCulled=!1,this.lines.visible=!1,this.lines.renderOrder=5,t.add(this.lines)}get overcast(){return this.rain}get raining(){return this.phase.kind==="rain"}static dry(t,e,n,s){for(const r of s){if(e>=r.y)continue;const o=t-r.x,a=n-r.z,c=o*Math.cos(r.yaw)-a*Math.sin(r.yaw);if(Math.abs(c)>r.halfAlong)continue;const l=o*Math.sin(r.yaw)+a*Math.cos(r.yaw);if(Math.abs(l)<=r.halfAcross)return!0}return!1}update(t,e,n=[]){const s=this.lastMs<0?0:Math.min(.1,Math.max(0,(t-this.lastMs)/1e3));if(this.lastMs=t,t>=this.phase.until&&(this.phase.kind==="dry"?(this.phase={kind:"rain",until:t+Fu+this.rand()*(YS-Fu)},this.rainStart=t,this.onRain(!0)):(this.phase={kind:"dry",until:t+Ou+this.rand()*(XS-Ou)},this.onRain(!1))),this.phase.kind==="rain"){const r=t-this.rainStart,o=this.phase.until-t;this.rain=ue.clamp(Math.min(r,o)/Bu,0,1)}else this.rain=Math.max(0,this.rain-s/(Bu/1e3));if(this.flash=Math.max(0,this.flash-s*1e3/this.flashMs),this.rain>.6&&this.rand()<s*1e3/jS&&(this.flash=1,this.thunderNear=this.rand()<KS,this.flashMs=this.thunderNear?JS:zu,this.thunderAt=t+(this.thunderNear?120:QS)),this.thunderAt>=0&&t>=this.thunderAt&&(this.thunderAt=-1,this.onLightning(this.thunderNear)),this.lines.visible=this.rain>.005,this.material.opacity=eE*this.rain,this.lines.visible){const r=this.positions,o=tE*s,a=Ni/2;for(let c=0;c<$a;c++){let l=r[c*6]-Gu*o,h=r[c*6+1]-o,u=r[c*6+2];h<e.y-3&&(h+=ku),l<e.x-a?l+=Ni:l>e.x+a&&(l-=Ni),u<e.z-a?u+=Ni:u>e.z+a&&(u-=Ni),r[c*6]=l,r[c*6+1]=h,r[c*6+2]=u,n.length&&Rl.dry(l,h,u,n)?(r[c*6+3]=l,r[c*6+4]=h,r[c*6+5]=u):(r[c*6+3]=l+Gu*Hu,r[c*6+4]=h+Hu,r[c*6+5]=u)}this.lines.geometry.attributes.position.needsUpdate=!0}}}const nr=2.2,Js=.62,Vu=.88,Wu=.5,nE=.82,Xu=-.17,Oi=.36,iE=170,Yu=150,sE=200,rE=70,oE=160,qu=220,aE=1.3;function cE(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function $u(i){return i*i}function lE(i){return 1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2)}function hE(i){switch(i%Lo){case 0:return new xl(Oi,0);case 1:return new dn(Oi*1.35,Oi*1.35,Oi*1.35);case 2:return new xn(Oi,0);case 3:return new vl(Oi,0);default:return new Vo(Oi*1.25,0)}}class uE{constructor(t){b(this,"group",new oe);b(this,"onRun",()=>{});b(this,"model",null);b(this,"meshes",new Map);b(this,"geometries",Array.from({length:Lo},(t,e)=>hE(e)));b(this,"materials",Yi.map(t=>new qt({color:t.hex,emissive:t.hex,emissiveIntensity:.35,roughness:.35,metalness:.1,transparent:!0,opacity:nE})));b(this,"selectedId",null);b(this,"queue",[]);b(this,"active",null);b(this,"shown",!1);b(this,"showStartMs",0);b(this,"fitScale",1);this.camera=t,t.add(this.group),this.group.visible=!1,this.layout()}layout(){var a,c;const t=Math.tan(ue.degToRad(this.camera.fov)/2)*nr,e=t*this.camera.aspect,n=((a=this.model)==null?void 0:a.cols)??6,s=((c=this.model)==null?void 0:c.rows)??6,r=e*2*Vu/n,o=t*2*Wu/(s*Math.cos(Js));this.fitScale=Math.min(r,o),this.group.position.set(0,t*2*Xu,-nr),this.group.rotation.set(-Js,0,0),this.shown&&!this.active&&this.group.scale.setScalar(this.fitScale)}get isBusy(){return this.active!==null||this.queue.length>0}lowestWorldY(t,e,n=(r=>(r=this.model)==null?void 0:r.cols)()??6,s=(o=>(o=this.model)==null?void 0:o.rows)()??6){const a=new Qe(this.camera.fov,this.camera.aspect,.05,10);a.position.copy(t),a.lookAt(e),a.updateMatrixWorld();const c=Math.tan(ue.degToRad(this.camera.fov)/2)*nr,l=c*this.camera.aspect,h=Math.min(l*2*Vu/n,c*2*Wu/(s*Math.cos(Js))),u=c*2*Xu;let d=1/0;for(const f of[-1,1])for(const g of[-1,1]){const v=f*(n-1)/2+f*.5,m=g*(s-1)/2+g*.5,p=new T(v*h,m*h*Math.cos(-Js),m*h*Math.sin(-Js));p.y+=u,p.z-=nr,p.applyMatrix4(a.matrixWorld),d=Math.min(d,p.y)}return d}bind(t){this.model=t,this.selectedId=null,this.queue=[],this.active=null,this.rebuildMeshes(),this.layout()}unbind(){this.model=null,this.clearMeshes(),this.group.visible=!1,this.shown=!1}show(t){this.model&&(this.shown=!0,this.showStartMs=t,this.group.visible=!0,this.group.scale.setScalar(.001))}hide(){this.shown=!1,this.group.visible=!1,this.selectedId=null}tap(t){if(!this.model||!this.shown||this.isBusy)return!1;const e=t.intersectObjects([...this.meshes.values()],!1)[0];if(!e)return!1;const n=e.object.userData.gemId,s=this.model.locate(n);if(!s)return!1;if(this.selectedId===null)return this.select(n),!0;if(this.selectedId===n)return this.select(null),!0;const r=this.model.locate(this.selectedId);if(!r||!Dn.adjacent(r,s))return this.select(n),!0;const o=this.selectedId,a=this.model.swap(r,s);if(this.select(null),!a.valid)return this.queue.push({kind:"swap",a:o,b:n,durationMs:Yu}),this.queue.push({kind:"swap",a:o,b:n,durationMs:Yu}),!0;this.queue.push({kind:"swap",a:o,b:n,durationMs:iE});for(const c of a.steps)this.queue.push({kind:"clear",step:c}),this.queue.push({kind:"fall",step:c});return a.reshuffled&&this.queue.push({kind:"rebuild"}),!0}update(t){if(!this.shown||!this.model)return;!this.active&&this.queue.length&&this.begin(this.queue.shift(),t);const e=Math.min(1,(t-this.showStartMs)/qu);if(this.group.scale.setScalar(this.fitScale*lE(e)),!this.active)return;const n=this.active,s=Math.min(1,(t-n.startMs)/n.durationMs);switch(n.phase.kind){case"swap":{const r=cE(s);for(const o of n.moves)o.mesh.position.lerpVectors(o.from,o.to,r);break}case"clear":{const r=1-$u(s);for(const o of n.shrinking)o.scale.setScalar(Math.max(.001,r*(1+.35*Math.sin(s*Math.PI))));break}case"fall":{const r=$u(s);for(const o of n.moves)o.mesh.position.lerpVectors(o.from,o.to,r);break}}s>=1&&this.finish(n)}cellPosition(t,e=this.model.rows,n=this.model.cols){return new T(t.col-(n-1)/2,(e-1)/2-t.row,0)}select(t){var e,n;this.selectedId!==null&&((e=this.meshes.get(this.selectedId))==null||e.scale.setScalar(1)),this.selectedId=t,t!==null&&((n=this.meshes.get(t))==null||n.scale.setScalar(aE))}makeMesh(t,e){const n=new lt(this.geometries[e],this.materials[e]);return n.userData.gemId=t,n.rotation.set(.35,t%7*.9,.2),this.group.add(n),this.meshes.set(t,n),n}rebuildMeshes(){this.clearMeshes();const t=this.model;for(let e=0;e<t.rows;e++)for(let n=0;n<t.cols;n++){const s=t.grid[e][n];this.makeMesh(s.id,s.type).position.copy(this.cellPosition({row:e,col:n}))}}clearMeshes(){for(const t of this.meshes.values())this.group.remove(t);this.meshes.clear(),this.selectedId=null}begin(t,e){const n=[],s=[];let r=1;switch(t.kind){case"swap":{const o=this.meshes.get(t.a),a=this.meshes.get(t.b);n.push({mesh:o,from:o.position.clone(),to:a.position.clone()}),n.push({mesh:a,from:a.position.clone(),to:o.position.clone()}),r=t.durationMs;break}case"clear":{for(const o of t.step.cleared){const a=this.meshes.get(o.id);a&&s.push(a)}for(const o of t.step.runs){const a=new T;for(const c of o.cells)a.add(this.cellPosition(c));a.divideScalar(o.cells.length),this.onRun(o,this.group.localToWorld(a))}r=sE;break}case"fall":{let o=1;for(const a of t.step.falls){const c=this.meshes.get(a.id);n.push({mesh:c,from:c.position.clone(),to:this.cellPosition({row:a.toRow,col:a.col})}),o=Math.max(o,a.toRow-a.fromRow)}for(const a of t.step.spawns){const c=this.makeMesh(a.id,a.type),l=this.cellPosition({row:a.fromRow,col:a.col});c.position.copy(l),n.push({mesh:c,from:l,to:this.cellPosition({row:a.toRow,col:a.col})}),o=Math.max(o,a.toRow-a.fromRow)}r=oE+o*rE;break}case"rebuild":this.rebuildMeshes(),r=qu,this.showStartMs=e;break}this.active={phase:t,startMs:e,durationMs:r,moves:n,shrinking:s}}finish(t){for(const e of t.moves)e.mesh.position.copy(e.to);if(t.phase.kind==="clear")for(const e of t.phase.step.cleared){const n=this.meshes.get(e.id);n&&(this.group.remove(n),this.meshes.delete(e.id))}this.active=null}}const dE=420,fE=.35,pE=.055,mE=240,gE=220;function ju(i){return i*i}class _E{constructor(t){b(this,"group",new oe);b(this,"shots",[]);b(this,"geometry",new Ln(pE,10,8));t.add(this.group)}fire(t,e,n,s,r){const o=new Pe({color:n,transparent:!0,opacity:.95,blending:Zn,depthWrite:!1}),a=new lt(this.geometry,o);a.position.copy(t),this.group.add(a),this.shots.push({mesh:a,from:t.clone(),to:e.clone(),startMs:s,onHit:r,returns:!1,hit:!1,durationMs:dE})}strike(t,e,n,s,r){t.position.copy(e),this.group.add(t),this.shots.push({mesh:t,from:e.clone(),to:n.clone(),startMs:s,onHit:r,returns:!0,hit:!1,durationMs:mE})}update(t){const e=[],n=[];for(const s of this.shots){const r=Math.min(1,(t-s.startMs)/s.durationMs);if(s.returns){s.hit?(s.mesh.position.lerpVectors(s.to,s.from,1-Math.pow(1-r,2)),r>=1?n.push(s):e.push(s)):(s.mesh.position.lerpVectors(s.from,s.to,ju(r)),s.mesh.rotation.x+=.25,r>=1&&(s.hit=!0,s.onHit(),s.startMs=t,s.durationMs=gE),e.push(s));continue}const o=ju(r);s.mesh.position.lerpVectors(s.from,s.to,o),s.mesh.position.y+=Math.sin(r*Math.PI)*fE,s.mesh.scale.setScalar(1+.6*Math.sin(r*Math.PI)),r>=1?n.push(s):e.push(s)}this.shots=e;for(const s of n)this.group.remove(s.mesh),s.returns||(s.mesh.material.dispose(),s.onHit())}}const _r=new URLSearchParams(window.location.search),We=Number.parseInt(_r.get("seed")??"",10)||1,Oo=Math.max(1,Number.parseFloat(_r.get("slowmo")??"")||1),uf=_r.has("debug"),vE=Number.parseFloat(_r.get("time")??"")||Vc,xE=_r.has("rain"),ye=new Zv,Cl=40,re=new Qe(Cl,window.innerWidth/window.innerHeight,.05,4e3),Ve=new Kv({antialias:!0});Ve.toneMapping=hd;Ve.toneMappingExposure=1;Ve.setSize(window.innerWidth,window.innerHeight);Ve.setPixelRatio(Math.min(window.devicePixelRatio,2));document.body.appendChild(Ve.domElement);const gn=WM(ye),ce=new Tx(re);ye.add(re);const tn=new uE(re),Xc=new _E(ye),Ce=new iy(ye),ot=new Gx(Ve.domElement,ye,re);ot.position.set(0,de,0);ot.yaw=Math.PI/2;const he=new fy(re,ot,Ce,ye,[...document.querySelectorAll("#hands .hand")],document.getElementById("links"),de,i=>gn.isWalkable(i));he.placeOnTarget=(i,t,e,n)=>{if(e.id!=="seed"&&e.id!=="wheat_seed")return null;Mr(i,t);const s=On.intersectObjects(Me.flatMap(a=>a.lockTargets),!1)[0];if(!s)return null;const r=s.object.userData.interactable;if(r.distanceTo(ot.position)>r.lockReach)return he.notice="Out of reach.",0;if(!r.acceptsSeeds)return he.notice=r.status==="planted"?"Already planted.":"Till it first.",0;if(n<Io)return he.notice=`Needs ${Io} seeds.`,0;const o=r.plant(n,nt,e.id==="wheat_seed"?"wheat":"tree");return o>0&&e.id==="wheat_seed"&&(Kt.textContent="Wheat, planted. Four stalks in a minute; harvest them with the board.",Yt=nt+3e3),be(),o};const Ae=new _S(de),ze=[];let yo=[];const ME=[{rune:"wheat",from:"seed",to:"wheat_seed",label:"Wheat rune"}];let ar=null;function Yc(i,t){Mr(i,t);const e=On.intersectObjects(Ae.raycastTargets(),!0)[0];if(!e)return null;const n=e.object.userData.structure;return n.fire?Math.hypot(n.center.x-ot.position.x,n.center.z-ot.position.z)>2.6?(he.notice="Out of reach.",null):n.fire:null}const yE=he.placeOnTarget,So=[],Ku=2600;he.placeOnTarget=(i,t,e,n)=>{if(e.id==="wheat_seed"){const s=Yc(i,t);if(s){if(!s.lit)return he.notice="The fire is out.",0;const r=Math.min(n,5);return So.push({fire:s,at:nt+Ku,count:r}),Kt.textContent="The seeds go on the coals…",Yt=nt+Ku+600,r}}if(Al[e.id]){const s=Yc(i,t);if(s){let r=0;for(let o=0;o<n;o++)s.feed(e.id)&&r++;return Kt.textContent=`The fire takes it: ${Math.ceil(s.fuelMs/1e3)} s of burn.`,Yt=nt+2e3,r}}return yE(i,t,e,n)};he.placeHeldOnTarget=(i,t,e)=>{if(!Al[e.id])return!1;const n=Yc(i,t);return n?(n.feed(e.id),Kt.textContent=`The fire takes the ${e.label}: ${Math.ceil(n.fuelMs/1e3)} s of burn.`,Yt=nt+2e3,!0):!1};const df=.12,SE=1.35;function Bs(i){var s;const t=i.lockPose(gf());for(let r=0;r<6&&Be.find(a=>a.status!=="resolved"&&Math.hypot(a.center.x-t.position.x,a.center.z-t.position.z)<SE&&t.position.y<1);r++)t.position.lerp(t.target,.25);const e=tn.lowestWorldY(t.position,t.target,i.board.cols,i.board.rows),n=(i.floorY??de)+df-e;n>0&&(t.position.y+=n,t.target.y+=n,(s=i.onPoseLifted)==null||s.call(i,n)),kt=i,mn=t,ce.lock(nt,t)}const EE=.12,wE=1.5,bE=1.1,TE=7;function ff(i){if(ce.mode!=="locked"||!kt||!mn)return;const t=new gx().setFromVector3(mn.position.clone().sub(mn.target));i(t),t.phi=ue.clamp(t.phi,EE,wE),t.radius=ue.clamp(t.radius,bE,TE);const e=mn.target.clone().add(new T().setFromSpherical(t)),n=mn.target.clone(),s=tn.lowestWorldY(e,n,kt.board.cols,kt.board.rows),r=(kt.floorY??de)+df-s;r>0&&(e.y+=r,n.y+=r),mn={position:e,target:n},re.position.copy(e),re.lookAt(n)}ot.onOrbit=(i,t)=>ff(e=>{e.theta-=i,e.phi-=t});const pf=document.getElementById("zoom-in"),mf=document.getElementById("zoom-out");for(const[i,t]of[[pf,.8],[mf,1.25]])i.addEventListener("pointerdown",e=>e.stopPropagation()),i.addEventListener("click",()=>{ce.mode==="free"?ot.thirdZoom=ue.clamp(ot.thirdZoom*t,Bx,zx):ff(e=>e.radius*=t)});ye.add(ot.avatar);ot.standHeightAt=(i,t)=>Ae.list.some(e=>e.floorBoards>0&&e.inside(i,t))?.1:0;const cr=document.getElementById("view");cr.addEventListener("pointerdown",i=>i.stopPropagation());cr.addEventListener("click",()=>{ot.view=ot.view==="first"?"third":"first",cr.innerHTML=ot.view==="third"?"<b>◉</b>1st":"<b>◎</b>3rd",cr.classList.toggle("active",ot.view==="third"),be()});const qi=document.getElementById("walk");qi.addEventListener("pointerdown",i=>{i.stopPropagation(),i.preventDefault(),qi.setPointerCapture(i.pointerId),qi.classList.add("active"),ot.startMove(i)});qi.addEventListener("pointermove",i=>ot.pointerMove(i));for(const i of["pointerup","pointercancel"])qi.addEventListener(i,t=>{qi.classList.remove("active"),ot.pointerUp(t)});const Bi=document.getElementById("menu");let Pn=null;function gf(){return{position:ot.position.clone(),forward:ot.forward()}}function _f(){return Ae.list.filter(i=>!i.inside(ot.position.x,ot.position.z)).flatMap(i=>i.pieces.map(t=>t.obj.mesh))}ot.objectAt=(i,t)=>{if(ce.mode!=="free")return!1;Mr(i,t);const e=On.intersectObjects([...Ce.raycastTargets(),..._f()],!0)[0];if(!e)return!1;const n=e.object.userData.object;return Math.hypot(n.position.x-ot.position.x,n.position.z-ot.position.z)<=3.5};function Zu(i,t,e){Bi.innerHTML=e.map((n,s)=>`<button type="button" data-i="${s}" ${n.disabled?"disabled":""}>${n.label}${n.small?`<small>${n.small}</small>`:""}</button>`).join(""),Bi.style.left=`${Math.min(window.innerWidth-230,Math.max(10,i-100))}px`,Bi.style.top=`${Math.min(window.innerHeight-40-e.length*52,Math.max(90,t-30))}px`,Bi.hidden=!1,Bi.querySelectorAll("button").forEach(n=>{n.addEventListener("pointerdown",s=>s.stopPropagation()),n.addEventListener("click",()=>{Bi.hidden=!0,e[Number(n.dataset.i)].onPick()})})}ot.onLongPress=(i,t)=>{Mr(i,t);const e=On.intersectObjects(_f(),!0)[0];if(e){const o=e.object.userData.structure,a=ze.find(l=>"structure"in l&&l.structure===o&&l.status==="growing"),c=[];if(a)c.push({label:a instanceof Ds?`Building: ${a.blueprint.label}`:"Taking apart",small:"tap inside the ring to continue",disabled:!0,onPick:()=>{}}),c.push({label:"Abandon that",onPick:()=>Qu(a)});else if(o.isCampfire){const l=o.fire;l&&!l.lit?c.push({label:"Light it",small:l.fuelMs>0?"a few matches":"a few matches; then feed it",onPick:()=>IE(o)}):c.push({label:"Burning",small:`${Math.ceil(((l==null?void 0:l.fuelMs)??0)/1e3)} s of fuel — drag shavings, sticks or a knuckle onto it`,disabled:!0,onPick:()=>{}}),c.push({label:"Take apart",small:`${o.pieces.length} pieces`,onPick:()=>td(o)})}else{c.push({label:"Blueprints…",small:"add to this",onPick:()=>Ju(o,null)});const l=o.pieces.find(u=>u.obj===e.object.userData.object),h=l?o.wallOf(l):null;if(h&&o.uncutLogs(h).length>0){const u=he.heldTypes().includes("hand_axe");c.push({label:"Cut a doorway here",small:u?`${o.uncutLogs(h).length} logs; the middles come out as knuckles`:"needs a hand axe in hand",disabled:!u,onPick:()=>DE(o,h)})}c.push({label:"Take apart",small:`${o.pieces.length} pieces`,onPick:()=>td(o)})}Zu(i,t,c);return}const n=On.intersectObjects(Ce.raycastTargets(),!0)[0];if(!n)return;const s=n.object.userData.object,r=oS(s.type.id,he.heldTypes()).map(o=>({label:o.recipe.label,small:o.available?void 0:o.reason,disabled:!o.available,onPick:()=>Dl(s,o.recipe)}));for(const o of ME)o.from===s.type.id&&r.push({label:"Transmute…",small:`${o.label}: seeds within reach become ${Mn[o.to].label}`,onPick:()=>LE(s,o.rune,o.to)});if(dS.includes(s.type.id)){const o=ze.find(a=>a instanceof Ds&&a.status==="growing"&&a.distanceTo(s.position)<=a.ringRadius);o?r.push({label:`Abandon: ${o.blueprint.label}`,small:"the site here",onPick:()=>Qu(o)}):r.push({label:"Blueprints…",small:"build here, from this",onPick:()=>Ju(null,s)})}if(r.length===0){Kt.textContent=`Nothing to make from ${s.type.label} yet.`,Yt=nt+1400;return}Zu(i,t,r)};Ve.domElement.addEventListener("pointerdown",()=>{Bi.hidden=!0,vr.hidden=!0});const vr=document.getElementById("blueprints"),AE=document.getElementById("bp-plan"),RE=document.getElementById("bp-name"),CE=document.getElementById("bp-blurb"),PE=document.getElementById("bp-needs"),qc=document.getElementById("bp-track"),$c=document.getElementById("bp-build");let Qn=[],ti=0,Pl=null,jc=null;function Ju(i,t){Qn=hS(i),Qn.length!==0&&(Pl=i,jc=t,ti=0,Ll(),vr.hidden=!1)}function Ll(){const i=Qn[ti];fS(i.bp,AE),RE.textContent=`${i.bp.label}  (${ti+1}/${Qn.length})`,CE.textContent=i.bp.blurb,PE.textContent=`Needs: ${wl(i.bp)}`,qc.checked=ar===i.bp,$c.disabled=!!i.reason,$c.textContent=i.reason??(Pl?"Add it here":"Build here")}for(const i of[vr])i.addEventListener("pointerdown",t=>t.stopPropagation());document.getElementById("bp-prev").addEventListener("click",()=>{ti=(ti+Qn.length-1)%Qn.length,Ll()});document.getElementById("bp-next").addEventListener("click",()=>{ti=(ti+1)%Qn.length,Ll()});document.getElementById("bp-close").addEventListener("click",()=>vr.hidden=!0);qc.addEventListener("change",()=>{ar=qc.checked?Qn[ti].bp:null,be()});$c.addEventListener("click",()=>{vr.hidden=!0;const i=Qn[ti].bp;let t=Pl;if(!t){const e=jc?jc.position.clone():ot.position.clone(),n=ot.position.x-e.x,s=ot.position.z-e.z,r=Math.hypot(n,s)>.001?Math.atan2(-s,n):0;t=new bl(new T(e.x,de,e.z),r),Ae.add(t)}Il(i,t)});function Il(i,t){const e=new Ds(i,t,Ce,de,We*977+ze.length*31);ye.add(e.group),ze.push(e),en.push(e),e.onMissing=n=>{Kt.textContent=`Needs ${Mn[n].label} inside the ring.`,Yt=nt+1600},e.onPlaced=()=>be(),e.onDone=n=>{In(e),i.id==="campfire"&&!t.fire&&(t.fire=new WS(t.center,de),ye.add(t.fire.group)),Kt.textContent=i.id==="campfire"?"A campfire, unlit. Long-press it to light it.":`${i.label}: built.`,Yt=nt+2200,ei(n)},Kt.textContent=`A site. Bring ${wl(i)} inside the ring; it turns green. Tap inside to build.`,Yt=nt+4500,be()}function In(i){i instanceof Ds&&i.dispose(),i instanceof Yo&&(i.status!=="resolved"?i.dispose():yo.push(i)),ze.splice(ze.indexOf(i),1);const t=en.indexOf(i);t>=0&&en.splice(t,1)}function Qu(i){i.status="resolved",In(i),i instanceof Ds&&i.structure.pieces.length===0&&Ae.remove(i.structure),Kt.textContent="Site abandoned. What was placed stays.",Yt=nt+2e3,be()}function LE(i,t,e){const n=new Yo(t,e,i,Ce,de,We*271+ze.length*5);if(ye.add(n.group),ze.push(n),en.push(n),n.onCharged=()=>be(),n.onDone=s=>{In(n),vi=nt+xr*.7,Kt.textContent=`${Mn[e].label[0].toUpperCase()}${Mn[e].label.slice(1)}. Eat them, plant four on tilled ground, or pop them on a fire.`,Yt=nt+3600,ei(s)},n.distanceTo(ot.position)>n.lockReach){Kt.textContent="Closer.",Yt=nt+900,n.cancel(),In(n);return}Bs(n)}function IE(i){const t=new LS(i,de,We*389+ze.length*7);if(ze.push(t),en.push(t),t.onSpark=()=>be(),t.onDone=e=>{In(t),Kt.textContent="It catches. Feed it shavings, sticks or a knuckle to keep it going.",Yt=nt+3e3,ei(e)},t.distanceTo(ot.position)>t.lockReach){Kt.textContent="Closer.",Yt=nt+900,In(t);return}Bs(t)}function DE(i,t){const e=new CS(i,t,Ce,de,We*743+ze.length*13);if(ze.push(e),en.push(e),e.onCut=()=>be(),e.onDone=n=>{In(e),Kt.textContent="A doorway. The knuckles lie outside it.",Yt=nt+2400,ei(n)},e.distanceTo(ot.position)>e.lockReach){Kt.textContent="Closer.",Yt=nt+900,In(e);return}Bs(e)}function td(i){const t=new hf(i,Ae,de,We*611+ze.length*17);if(ze.push(t),en.push(t),t.onRemoved=()=>be(),t.onDone=e=>{In(t),i.fire&&(i.fire.group.removeFromParent(),i.fire=null),Kt.textContent="Taken apart. The pieces lie out the front.",Yt=nt+2200,ei(e)},t.distanceTo(ot.position)>t.lockReach){Kt.textContent="Closer.",Yt=nt+900,In(t);return}Bs(t)}function Dl(i,t){const e=_e.effects(nt).strength,n=Hc(i.type.mass,e)<=Yn;Pn=new sS(i,t,Ce,gf(),We*17+i.id,n,de),Pn.onDone=s=>{const r=s,o=Mn[r.result],a=r.recipe.resultCount??1,c=new T(Math.cos(r.restYaw),0,-Math.sin(r.restYaw)),l=new T(Math.sin(r.restYaw),0,Math.cos(r.restYaw));for(let h=0;h<a;h++){const u=he.freeHand();if(u>=0&&Hc(o.mass,e)===1){he.give(u,o);continue}const d=r.restPosition.clone();o.halfLength&&o.halfLength>.6?d.addScaledVector(c,(h-(a-1)/2)*(o.halfLength*2+.1)):d.addScaledVector(c,h%2*1.3-.65*Math.min(1,a-1)).addScaledVector(l,(Math.floor(h/2)-(Math.ceil(a/2)-1)/2)*.32),Ce.spawn(o.id,d.x,de,d.z,r.restYaw)}Kt.textContent=a>1?`${a} ${o.label}.`:`A ${o.label}.`,Yt=nt+1800,ei(s)},Bs(Pn)}const _e=new Ry,UE=document.getElementById("halo"),NE=document.getElementById("blackout");he.onEat=i=>i.food?(_e.eat(i.food,i.nourishMs??0),!0):!1;ot.onHop=()=>_e.drain(he.dragging?vy:_y);let lr=Gc;ot.onRestHold=()=>{ce.mode!=="free"||_e.busy||(lr={bed:!!Ae.bedNear(ot.position.x,ot.position.z),shelter:Ae.shelterAt(ot.position.x,ot.position.z)},_e.rest(nt,lr))};_e.onEvent=i=>{i==="ate"&&be();const e={collapse:"You collapse.",wake:"You wake, still tired.",rest:lr.bed?lr.shelter>=1?"You sleep in your bed, in your cabin, and wake whole.":"You sleep in your bed under a patchy roof, and wake rested.":lr.shelter>0?"You rest on the cabin floor.":"You rest.",ate:""}[i];e&&(Kt.textContent=e,Yt=nt+1800)};let ed=_e.band;function OE(){const i=_e.effects(nt);he.setCondition({strength:i.strength,capScale:i.capScale,handsAvailable:i.handsAvailable});const t=100-70*i.haloDark;UE.style.background=i.haloDark>.01?`radial-gradient(ellipse at center, rgba(0,0,0,0) ${Math.max(15,t-45)}%, rgba(0,0,0,${(.92*i.haloDark).toFixed(3)}) ${t}%)`:i.haloLight>.01?`radial-gradient(ellipse at center, rgba(255,240,200,0) 62%, rgba(255,236,190,${(.22*i.haloLight).toFixed(3)}) 100%)`:"none",Ve.domElement.style.filter=i.saturation<.995?`saturate(${i.saturation.toFixed(3)})`:"",Ve.toneMappingExposure=i.exposure,NE.style.opacity=i.blackout.toFixed(3),i.band!==ed&&(ed=i.band,be())}function FE(){const i=Tn.vision(_e.effects(nt).vision);Ve.toneMappingExposure*=i.exposure;const t=(Number.parseFloat(Ve.domElement.style.filter.replace(/[^0-9.]/g,""))||1)*i.saturation;Ve.domElement.style.filter=t<.995?`saturate(${t.toFixed(3)})`:"",af.emissiveIntensity=2.6*i.glow;const e=i.glow>By;for(const n of Ce.objects)n.type.id==="lichen"&&(n.collectible=e)}const fr=2.45,Qs=3,BE=35*Math.PI/180,zE=new T(0,0,0),Be=[],vf=(i,t)=>Be.push(new tf(Be.length,i,t,We*131+Be.length*17));for(let i=-Qs;i<=Qs;i++)for(let t=-Qs;t<=Qs;t++){const e=Math.max(Math.abs(i),Math.abs(t),Math.abs(i+t));if(e===0||e>Qs)continue;const n=fr*(i+t/2),s=fr*t*(Math.sqrt(3)/2);e>=2&&Math.abs(Math.atan2(s,n))<BE||vf(new T(n,0,s),zE)}const kE=new T(fr,0,0);for(const i of[-1.4,1.4])vf(new T(fr*2,0,i),kE);for(const i of Be)ye.add(i.group);const Me=[],HE=[[0,0],[fr*3,0],[10.5,-2.5],[10.5,0],[10.5,2.5],[13,-2.5],[13,2.5],[15.5,0],[15.5,2.5]];for(const[i,t]of HE)Me.push(new ef(Me.length,new T(i,de,t),We*977+Me.length*23));for(const i of Me)ye.add(i.group);const en=[...Be,...Me],xr=320,GE=.045;let vi=-1;const vs=new T;for(const i of Be)i.onThud=()=>{vi=nt+xr};function xf(i){const t=new tf(Be.length,new T(i.center.x,0,i.center.z),ot.position.clone(),We*131+4e3+Be.length*17);t.onDone=ei,t.onThud=()=>{vi=nt+xr},Be.push(t),en.push(t),ye.add(t.group),ye.remove(i.group),Me.splice(Me.indexOf(i),1),en.splice(en.indexOf(i),1),be()}for(const i of Me)i.onGrown=xf;function Mf(i,t){const e=Xe(We*7+i.index*31+Math.floor(nt));for(let n=0;n<t;n++){const s=e()*Math.PI*2,r=.15+e()*.45;Ce.spawn("wheat_seed",i.center.x+Math.cos(s)*r,de,i.center.z+Math.sin(s)*r,e()*Math.PI)}Kt.textContent=`Wheat: ${t} seeds. Eat them, plant them, or pop them on a fire.`,Yt=nt+3200}for(const i of Me)i.onHarvest=Mf;const ja=Xe(We*3+11);function yf(i){const t=Mn.rock.radius,e=i.footprintHalf+t+.3;for(let n=0;n<8;n++){const s=ja()*Math.PI*2,r=e*Math.SQRT2*(1+ja()*.25),o=i.center.x+Math.cos(s)*r,a=i.center.z+Math.sin(s)*r;if(!(Math.abs(o-i.center.x)<e&&Math.abs(a-i.center.z)<e)&&gn.isWalkable(new T(o,de,a))){Ce.spawn("rock",o,de,a,ja()*Math.PI);return}}}for(const i of Me)i.onRock=yf;function VE(i){const t=i.normal;Ce.scatterFelledTree(i.center,t,de,We*53+i.index);const e=new ef(Me.length,new T(i.center.x,de,i.center.z),We*977+500+i.index,!0,2);e.onDone=ei,e.onGrown=xf,e.onHarvest=Mf,e.onRock=yf,Me.push(e),en.push(e),ye.add(e.group)}const Tn=new Wy({sun:gn.sun,moon:gn.moon,hemi:gn.hemi,skyMaterial:gn.skyMaterial,fog:gn.fog,background:ye.background,dayHaze:Do,dayHemiSky:nf},vE);Tn.apply();const WE=new Jy(ye),Je=new Rl(ye,We,0,xE),XE=document.getElementById("rain");let nd=!1;const YE=.55;Je.onRain=i=>{const t=Ae.shelterAt(ot.position.x,ot.position.z)>0;Kt.textContent=i?t?"Rain on the roof.":"Rain. It wears at you out here.":"The rain passes.",Yt=nt+3200,be()};const qE=document.getElementById("flash");let Kc=-1;const Zc=380;Je.onLightning=i=>{vi=nt+xr,i&&(Ae.shelterAt(ot.position.x,ot.position.z)>0?Kt.textContent="Lightning, close. The roof holds.":(Kc=nt+Zc,ot.knock(),_e.sap(ZS,nt+Zc*.5),Kt.textContent="Struck. You come to on the ground, shaking."),Yt=nt+4200)};{const i=Xe(We*7+3);let t=0;for(let e=0;e<400&&t<40;e++){const n=-12+i()*34,s=(i()*2-1)*20;gn.isWalkable(new T(n,de,s))&&(Be.some(r=>Math.hypot(r.center.x-n,r.center.z-s)<1.7)||Me.some(r=>Math.hypot(r.center.x-n,r.center.z-s)<1.1)||(Ce.spawn("lichen",n,de,s,i()*Math.PI),t++))}}let kt=null,mn=null;const Sf=450;let mi=null;function ei(i){i===kt&&ce.mode==="locked"&&(mi=nt+Sf),i.kind==="voxel"&&i.ending==="fell"&&VE(i),be()}for(const i of en)i.onDone=ei;const id=2.4,sd=2.6,$E=2.3,jE=.22,KE=1.5,ZE=1.1;function JE(i){if(i.status==="resolved")return!1;const t=i.center,e=ot.eye();if(Math.hypot(t.x-re.position.x,t.z-re.position.z)<KE)return!0;const n=e.x-re.position.x,s=e.z-re.position.z,r=Math.hypot(n,s);if(r<.001)return!1;const o=t.x-re.position.x,a=t.z-re.position.z,c=(o*n+a*s)/r;return c<0||c>r+.3?!1:Math.abs(o*s-a*n)/r<ZE}function QE(i,t){if(t.kind==="craft"||t.kind==="site"){if(!mn)return!1;const h=i.center;if(h.distanceTo(mn.position)<id)return!0;const u=mn.target.clone().sub(mn.position).normalize(),d=h.clone().sub(mn.position),f=d.dot(u);return f<0||f>nr+1?!1:d.clone().sub(u.multiplyScalar(f)).length()<sd}if(t.kind==="patch")return i.distanceTo(t.center)<$E;const e=t,n=Zd(e.center,e.normal),s=i.center;if(s.distanceTo(n.position)<id)return!0;const r=e.normal;if(!(s.clone().sub(e.center).dot(r)>.5))return!1;const a=n.target.clone().sub(n.position).normalize(),c=s.clone().sub(n.position);return c.clone().sub(a.multiplyScalar(c.dot(a))).length()<sd}const t1=document.getElementById("hud"),Kt=document.getElementById("hint"),Ef=document.getElementById("back"),wf={free:"Hold walk to move, drag to look, tap growth or grass to lock in, long-press a thing for what it can become. Drag a hand box to a thing to take or place it.",locking:"",locked:"",unlocking:""};function bf(i){Kt.textContent=i==="locked"&&kt?kt.hintLocked:wf[i],ot.enabled=i==="free",i!=="free"&&Af(Cl),i==="locked"&&kt&&(tn.bind(kt.board),tn.show(nt),kt.status!=="growing"&&mi===null&&(mi=nt+Sf)),i==="unlocking"&&(tn.hide(),Pn&&Pn.status==="growing"&&Pn.cancel(),kt instanceof Yo&&kt.status==="growing"&&(kt.cancel(),In(kt))),i==="free"&&(tn.unbind(),kt=null,Pn=null),be()}tn.onRun=(i,t)=>{const e=kt;if(!e)return;const n=e.targetFor(i);if(n===null)return;const s=i.cells.length;if(e.kind==="craft"){const r=e,o=he.handHolding(r.recipe.requiresHeld??"rock"),a=o>=0?he.pointUnderBox(o):t;Xc.strike(Mn[r.recipe.requiresHeld??"rock"].build(),a,e.targetWorldPosition(n),nt,()=>{e.feed(n,s,nt),_e.drain(r.recipe.drain),be()});return}Xc.fire(t,e.targetWorldPosition(n),Yi[i.type].hex,nt,()=>{e.feed(n,s,nt),_e.drain(e.kind==="voxel"?my:e.kind==="patch"?gy:e instanceof hf?SS:e instanceof Yo?DS:yS),be()})};ce.onModeChange=bf;Ef.addEventListener("click",()=>{ce.mode==="locked"&&ce.unlock(nt,Tf())});function Tf(){const i=ot.eye();return{position:i,target:i.clone().add(ot.forward())}}function be(){const i=Be.filter(o=>o.status==="resolved").length,t=Me.filter(o=>o.status==="resolved").length,e=Me.filter(o=>o.status==="planted").length,n=[`seed ${We}`,`cleared ${i}/${Be.length}`,`tilled ${t}/${Me.length}`];e&&n.push(`planted ${e}`),Je.raining&&n.push("rain"),_e.nourished(nt)&&n.push("nourished"),ar&&n.push(`${ar.label}: ${wl(ar)}`),Oo>1&&n.push(`slowmo ×${Oo}`),uf&&n.push(`vit ${_e.value.toFixed(2)} ${_e.band}`,`time ${Tn.time.toFixed(2)} day ${Tn.day.toFixed(2)}`,`rain ${Je.rain.toFixed(2)} roof ${Ae.shelterAt(ot.position.x,ot.position.z).toFixed(2)}`),kt&&ce.mode==="locked"&&kt.status==="growing"&&n.push(kt.poolText()),n.push("R: new arrangement"),t1.textContent=n.join(" · "),Ef.hidden=!(ce.mode==="locked"&&(kt==null?void 0:kt.status)==="growing");const s=ce.mode==="locked"&&(kt==null?void 0:kt.status)==="growing",r=s||ce.mode==="free"&&ot.view==="third";pf.hidden=!r,mf.hidden=!r,document.getElementById("tools").classList.toggle("locked",s),qi.hidden=ce.mode!=="free",cr.hidden=ce.mode!=="free"}const e1=1.6,n1=9,i1=.08;function Af(i){Math.abs(re.fov-i)<.001||(re.fov=i,re.updateProjectionMatrix(),tn.layout())}function s1(){const i=gn.distanceToEdge(ot.position)-sf;return ue.clamp(1-i/e1,0,1)}const On=new Kd,rd=new st;function Mr(i,t){rd.set(i/window.innerWidth*2-1,-(t/window.innerHeight)*2+1),On.setFromCamera(rd,re)}let Yt=0,od=-1;ot.onTap=(i,t)=>{if(Mr(i,t),ce.mode==="free"){const e=ze.filter(o=>o.status==="growing").flatMap(o=>o.lockTargets),n=en.filter(o=>o.status==="growing"&&o.kind!=="site").flatMap(o=>o.lockTargets),s=On.intersectObjects(e,!1)[0]??On.intersectObjects(n,!1)[0];if(!s){const o=On.intersectObjects(Me.filter(a=>a.status==="blocked").flatMap(a=>a.lockTargets),!1)[0];if(o){const a=o.object.userData.interactable;for(const c of Ce.overlapsSquare(a.center.x,a.center.z,a.footprintHalf))c.waggle(nt);Kt.textContent="Something is in the way.",Yt=nt+1200}return}const r=s.object.userData.interactable;if(r.distanceTo(ot.position)>r.lockReach){Kt.textContent="Closer.",Yt=nt+900;return}if(r instanceof Ds&&!r.isReady){const o=r.missing();Kt.textContent=`Not yet: bring ${o.map(a=>`${a.count} ${Mn[a.type].label}`).join(", ")} inside the ring.`,Yt=nt+2600;return}Bs(r)}else ce.mode==="locked"&&kt&&tn.tap(On)&&be()};window.addEventListener("keydown",i=>{if(i.key==="r"||i.key==="R"){const t=new URL(window.location.href);t.searchParams.set("seed",String(Math.floor(Math.random()*1e6))),window.location.href=t.toString()}});window.addEventListener("resize",()=>{re.aspect=window.innerWidth/window.innerHeight,re.updateProjectionMatrix(),Ve.setSize(window.innerWidth,window.innerHeight),tn.layout()});let nt=0,ad=performance.now();bf(ce.mode);ot.applyCamera(re);function Rf(i){var o;requestAnimationFrame(Rf),window.__rootwake={scene:ye,camera:re,renderer:Ve,player:ot,voxels:Be,patches:Me,objects:Ce,hands:he,vitality:_e,dayCycle:Tn,world:gn,cameraRig:ce,boardView:tn,structures:Ae,sites:ze,weather:Je,startSite:Il,blueprints:El,Structure:bl,get craft(){return Pn},startCraft:Dl,get shake(){return{shakeUntil:vi,animClock:nt,offset:vs.clone()}}};const t=Math.min(.1,Math.max(0,(i-ad)/1e3));if(nt+=t*1e3/Oo,ad=i,ce.mode==="free"){const a=[...Be.flatMap(l=>l.collider()??[]),...Ae.colliders()];ot.update(i,a,gn.isWalkable),ot.thirdBackScale=Ae.list.some(l=>l.inside(ot.position.x,ot.position.z))?.45:1,ot.applyCamera(re);const c=s1();Af(Cl+n1*c),re.position.y-=i1*c}_e.update(nt),OE(),Tn.advance(t*1e3/Oo),Je.update(nt,re.position,Ae.dryStrips());const e=Ae.shelterAt(ot.position.x,ot.position.z)>0;XE.style.opacity=(e?0:Je.rain*YE).toFixed(3),qE.style.opacity=Kc>nt?Math.min(1,(Kc-nt)/(Zc*.6)).toFixed(3):"0",Je.rain>.3&&e!==nd&&nt>Yt&&(Kt.textContent=e?"Under your roof. The rain falls outside.":"Out in the rain again.",Yt=nt+2600),nd=e,uf&&nt-od>500&&(od=nt,be()),Je.rain>0&&!_e.busy&&Ae.shelterAt(ot.position.x,ot.position.z)<=0&&_e.drain($S*Je.rain*t),Tn.apply(_e.effects(nt).vision,Je.overcast,Je.flash),WE.update(re.position,Tn.sunDirection,Tn.day,Tn.time,t,Je.overcast),FE();const n=_e.effects(nt);if(ot.fanScale=(he.dragging?cy:1)*n.fanScale,ot.moveSlowdown=he.dragging?ly:1,ot.canMove=!he.straining,ot.enabled=ce.mode==="free"&&!_e.busy,he.update(nt),he.notice&&(Kt.textContent=he.notice,he.notice=null,Yt=nt+1200),ce.update(nt),re.position.sub(vs),vs.set(0,0,0),nt<vi){const a=(vi-nt)/xr;vs.set((Math.random()-.5)*2,(Math.random()-.5)*2,0).multiplyScalar(GE*a*a),re.position.add(vs)}for(const a of Me)a.status==="resolved"||a.status==="resolving"||a.status==="planted"||a.setBlocked(Ce.overlapsSquare(a.center.x,a.center.z,a.footprintHalf).length>0);kt&&ce.mode==="locked"&&kt.status==="blocked"&&mi===null&&(mi=nt+300),mi!==null&&nt>=mi&&(mi=null,ce.unlock(nt,Tf())),Yt&&nt>=Yt&&(Yt=0,Kt.textContent=wf[ce.mode]);const s=ce.lockedness(),r=ot.view==="third"&&ce.mode==="free";for(const a of Be){let c=kt&&a!==kt&&QE(a,kt)?1-s:1;r&&c===1&&JE(a)&&(c=jE),a.setFade(c)}for(const a of en)a.update(nt);for(const a of Ae.list)(o=a.fire)==null||o.update(nt);for(const a of yo)a.update(nt);yo=yo.filter(a=>!a.finished);for(let a=So.length-1;a>=0;a--){const c=So[a];if(nt<c.at)continue;So.splice(a,1);const l=c.fire.group.position;for(let h=0;h<c.count;h++){const u=Math.random()*Math.PI*2,d=.55+Math.random()*.45;Ce.spawn("popcorn",l.x+Math.cos(u)*d,de,l.z+Math.sin(u)*d,u).waggle(nt)}Kt.textContent="Pop! Popcorn, out of the fire.",Yt=nt+2600}Pn&&Pn.update(nt),Ce.update(nt),kt&&kt.status!=="growing"&&tn.hide(),tn.update(nt),Xc.update(nt),Ve.render(ye,re)}requestAnimationFrame(Rf);window.__rootwake={scene:ye,camera:re,renderer:Ve,player:ot,voxels:Be,patches:Me,objects:Ce,hands:he,vitality:_e,dayCycle:Tn,world:gn,cameraRig:ce,boardView:tn,structures:Ae,sites:ze,weather:Je,startSite:Il,blueprints:El,Structure:bl,get craft(){return Pn},startCraft:Dl,get shake(){return{shakeUntil:vi,animClock:nt,offset:vs.clone()}}};
