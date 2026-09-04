var eh=Object.defineProperty;var nh=(i,t,e)=>t in i?eh(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var j=(i,t,e)=>nh(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yo="169",ih=0,Ta=1,rh=2,jc=1,sh=2,an=3,wn=0,Te=1,Ye=2,Tn=0,gi=1,Yi=2,Aa=3,wa=4,oh=5,Vn=100,ah=101,ch=102,lh=103,hh=104,uh=200,fh=201,dh=202,ph=203,Qs=204,to=205,mh=206,gh=207,_h=208,vh=209,xh=210,Mh=211,Sh=212,yh=213,Eh=214,eo=0,no=1,io=2,yi=3,ro=4,so=5,oo=6,ao=7,Qc=0,Th=1,Ah=2,An=0,wh=1,bh=2,Rh=3,Ch=4,Ph=5,Lh=6,Ih=7,tl=300,Ei=301,Ti=302,co=303,lo=304,is=306,ho=1e3,Xn=1001,uo=1002,Ge=1003,Dh=1004,rr=1005,Ke=1006,ms=1007,qn=1008,un=1009,el=1010,nl=1011,Ki=1012,Ko=1013,$n=1014,cn=1015,ji=1016,$o=1017,Jo=1018,Ai=1020,il=35902,rl=1021,sl=1022,$e=1023,ol=1024,al=1025,_i=1026,wi=1027,cl=1028,Zo=1029,ll=1030,jo=1031,Qo=1033,Br=33776,zr=33777,kr=33778,Gr=33779,fo=35840,po=35841,mo=35842,go=35843,_o=36196,vo=37492,xo=37496,Mo=37808,So=37809,yo=37810,Eo=37811,To=37812,Ao=37813,wo=37814,bo=37815,Ro=37816,Co=37817,Po=37818,Lo=37819,Io=37820,Do=37821,Hr=36492,Uo=36494,No=36495,hl=36283,Fo=36284,Oo=36285,Bo=36286,Uh=3200,Nh=3201,ul=0,Fh=1,En="",Ze="srgb",Ln="srgb-linear",ta="display-p3",rs="display-p3-linear",Yr="linear",ne="srgb",Kr="rec709",$r="p3",ti=7680,ba=519,Oh=512,Bh=513,zh=514,fl=515,kh=516,Gh=517,Hh=518,Vh=519,Ra=35044,Ca="300 es",ln=2e3,Jr=2001;class Ri{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pa=1234567;const vi=Math.PI/180,$i=180/Math.PI;function Ci(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ge[i&255]+ge[i>>8&255]+ge[i>>16&255]+ge[i>>24&255]+"-"+ge[t&255]+ge[t>>8&255]+"-"+ge[t>>16&15|64]+ge[t>>24&255]+"-"+ge[e&63|128]+ge[e>>8&255]+"-"+ge[e>>16&255]+ge[e>>24&255]+ge[n&255]+ge[n>>8&255]+ge[n>>16&255]+ge[n>>24&255]).toLowerCase()}function pe(i,t,e){return Math.max(t,Math.min(e,i))}function ea(i,t){return(i%t+t)%t}function Wh(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function Xh(i,t,e){return i!==t?(e-i)/(t-i):0}function Vi(i,t,e){return(1-e)*i+e*t}function qh(i,t,e,n){return Vi(i,t,1-Math.exp(-e*n))}function Yh(i,t=1){return t-Math.abs(ea(i,t*2)-t)}function Kh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function $h(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Jh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Zh(i,t){return i+Math.random()*(t-i)}function jh(i){return i*(.5-Math.random())}function Qh(i){i!==void 0&&(Pa=i);let t=Pa+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function tu(i){return i*vi}function eu(i){return i*$i}function nu(i){return(i&i-1)===0&&i!==0}function iu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ru(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function su(i,t,e,n,r){const s=Math.cos,o=Math.sin,a=s(e/2),c=o(e/2),l=s((t+n)/2),h=o((t+n)/2),f=s((t-n)/2),p=o((t-n)/2),m=s((n-t)/2),g=o((n-t)/2);switch(r){case"XYX":i.set(a*h,c*f,c*p,a*l);break;case"YZY":i.set(c*p,a*h,c*f,a*l);break;case"ZXZ":i.set(c*f,c*p,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*m,a*l);break;case"YXY":i.set(c*m,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*m,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function pi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function xe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Qe={DEG2RAD:vi,RAD2DEG:$i,generateUUID:Ci,clamp:pe,euclideanModulo:ea,mapLinear:Wh,inverseLerp:Xh,lerp:Vi,damp:qh,pingpong:Yh,smoothstep:Kh,smootherstep:$h,randInt:Jh,randFloat:Zh,randFloatSpread:jh,seededRandom:Qh,degToRad:tu,radToDeg:eu,isPowerOfTwo:nu,ceilPowerOfTwo:iu,floorPowerOfTwo:ru,setQuaternionFromProperEuler:su,normalize:xe,denormalize:pi};class St{constructor(t=0,e=0){St.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class It{constructor(t,e,n,r,s,o,a,c,l){It.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l)}set(t,e,n,r,s,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=a,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],f=n[7],p=n[2],m=n[5],g=n[8],v=r[0],u=r[3],d=r[6],E=r[1],x=r[4],T=r[7],I=r[2],R=r[5],b=r[8];return s[0]=o*v+a*E+c*I,s[3]=o*u+a*x+c*R,s[6]=o*d+a*T+c*b,s[1]=l*v+h*E+f*I,s[4]=l*u+h*x+f*R,s[7]=l*d+h*T+f*b,s[2]=p*v+m*E+g*I,s[5]=p*u+m*x+g*R,s[8]=p*d+m*T+g*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*s*h+n*a*c+r*s*l-r*o*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],f=h*o-a*l,p=a*c-h*s,m=l*s-o*c,g=e*f+n*p+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=f*v,t[1]=(r*l-h*n)*v,t[2]=(a*n-r*o)*v,t[3]=p*v,t[4]=(h*e-r*c)*v,t[5]=(r*s-a*e)*v,t[6]=m*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-r*l,r*c,-r*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(gs.makeScale(t,e)),this}rotate(t){return this.premultiply(gs.makeRotation(-t)),this}translate(t,e){return this.premultiply(gs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const gs=new It;function dl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Zr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ou(){const i=Zr("canvas");return i.style.display="block",i}const La={};function Vr(i){i in La||(La[i]=!0,console.warn(i))}function au(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function cu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function lu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ia=new It().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Da=new It().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Di={[Ln]:{transfer:Yr,primaries:Kr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[Ze]:{transfer:ne,primaries:Kr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[rs]:{transfer:Yr,primaries:$r,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(Da),fromReference:i=>i.applyMatrix3(Ia)},[ta]:{transfer:ne,primaries:$r,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(Da),fromReference:i=>i.applyMatrix3(Ia).convertLinearToSRGB()}},hu=new Set([Ln,rs]),qt={enabled:!0,_workingColorSpace:Ln,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!hu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Di[t].toReference,r=Di[e].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Di[i].primaries},getTransfer:function(i){return i===En?Yr:Di[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(Di[t].luminanceCoefficients)}};function xi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function _s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ei;class uu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ei===void 0&&(ei=Zr("canvas")),ei.width=t.width,ei.height=t.height;const n=ei.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ei}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Zr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=xi(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(xi(e[n]/255)*255):e[n]=xi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let fu=0;class pl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=Ci(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(vs(r[o].image)):s.push(vs(r[o]))}else s=vs(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function vs(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?uu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let du=0;class Re extends Ri{constructor(t=Re.DEFAULT_IMAGE,e=Re.DEFAULT_MAPPING,n=Xn,r=Xn,s=Ke,o=qn,a=$e,c=un,l=Re.DEFAULT_ANISOTROPY,h=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:du++}),this.uuid=Ci(),this.name="",this.source=new pl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new It,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==tl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ho:t.x=t.x-Math.floor(t.x);break;case Xn:t.x=t.x<0?0:1;break;case uo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ho:t.y=t.y-Math.floor(t.y);break;case Xn:t.y=t.y<0?0:1;break;case uo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Re.DEFAULT_IMAGE=null;Re.DEFAULT_MAPPING=tl;Re.DEFAULT_ANISOTROPY=1;class Zt{constructor(t=0,e=0,n=0,r=1){Zt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],f=c[8],p=c[1],m=c[5],g=c[9],v=c[2],u=c[6],d=c[10];if(Math.abs(h-p)<.01&&Math.abs(f-v)<.01&&Math.abs(g-u)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+v)<.1&&Math.abs(g+u)<.1&&Math.abs(l+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,T=(m+1)/2,I=(d+1)/2,R=(h+p)/4,b=(f+v)/4,P=(g+u)/4;return x>T&&x>I?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=R/n,s=b/n):T>I?T<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),n=R/r,s=P/r):I<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),n=b/s,r=P/s),this.set(n,r,s,e),this}let E=Math.sqrt((u-g)*(u-g)+(f-v)*(f-v)+(p-h)*(p-h));return Math.abs(E)<.001&&(E=1),this.x=(u-g)/E,this.y=(f-v)/E,this.z=(p-h)/E,this.w=Math.acos((l+m+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pu extends Ri{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Zt(0,0,t,e),this.scissorTest=!1,this.viewport=new Zt(0,0,t,e);const r={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ke,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Re(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,r=t.textures.length;n<r;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new pl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jn extends pu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ml extends Re{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=Xn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class mu extends Re{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=Xn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class In{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let c=n[r+0],l=n[r+1],h=n[r+2],f=n[r+3];const p=s[o+0],m=s[o+1],g=s[o+2],v=s[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=p,t[e+1]=m,t[e+2]=g,t[e+3]=v;return}if(f!==v||c!==p||l!==m||h!==g){let u=1-a;const d=c*p+l*m+h*g+f*v,E=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const I=Math.sqrt(x),R=Math.atan2(I,d*E);u=Math.sin(u*R)/I,a=Math.sin(a*R)/I}const T=a*E;if(c=c*u+p*T,l=l*u+m*T,h=h*u+g*T,f=f*u+v*T,u===1-a){const I=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=I,l*=I,h*=I,f*=I}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],c=n[r+1],l=n[r+2],h=n[r+3],f=s[o],p=s[o+1],m=s[o+2],g=s[o+3];return t[e]=a*g+h*f+c*m-l*p,t[e+1]=c*g+h*p+l*f-a*m,t[e+2]=l*g+h*m+a*p-c*f,t[e+3]=h*g-a*f-c*p-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(r/2),f=a(s/2),p=c(n/2),m=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=p*h*f+l*m*g,this._y=l*m*f-p*h*g,this._z=l*h*g+p*m*f,this._w=l*h*f-p*m*g;break;case"YXZ":this._x=p*h*f+l*m*g,this._y=l*m*f-p*h*g,this._z=l*h*g-p*m*f,this._w=l*h*f+p*m*g;break;case"ZXY":this._x=p*h*f-l*m*g,this._y=l*m*f+p*h*g,this._z=l*h*g+p*m*f,this._w=l*h*f-p*m*g;break;case"ZYX":this._x=p*h*f-l*m*g,this._y=l*m*f+p*h*g,this._z=l*h*g-p*m*f,this._w=l*h*f+p*m*g;break;case"YZX":this._x=p*h*f+l*m*g,this._y=l*m*f+p*h*g,this._z=l*h*g-p*m*f,this._w=l*h*f-p*m*g;break;case"XZY":this._x=p*h*f-l*m*g,this._y=l*m*f-p*h*g,this._z=l*h*g+p*m*f,this._w=l*h*f+p*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],f=e[10],p=n+a+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(h-c)*m,this._y=(s-l)*m,this._z=(o-r)*m}else if(n>a&&n>f){const m=2*Math.sqrt(1+n-a-f);this._w=(h-c)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+l)/m}else if(a>f){const m=2*Math.sqrt(1+a-n-f);this._w=(s-l)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+f-n-a);this._w=(o-r)/m,this._x=(s+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+r*l-s*c,this._y=r*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-r*a,this._w=o*h-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),f=Math.sin((1-e)*h)/l,p=Math.sin(e*h)/l;return this._w=o*f+this._w*p,this._x=n*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(t=0,e=0,n=0){w.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ua.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ua.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*r-a*n),h=2*(a*e-s*r),f=2*(s*n-o*e);return this.x=e+c*l+o*f-a*h,this.y=n+c*h+a*l-s*f,this.z=r+c*f+s*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return xs.copy(this).projectOnVector(t),this.sub(xs)}reflect(t){return this.sub(xs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xs=new w,Ua=new In;class Qi{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(We.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(We.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=We.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,We):We.fromBufferAttribute(s,o),We.applyMatrix4(t.matrixWorld),this.expandByPoint(We);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),sr.copy(n.boundingBox)),sr.applyMatrix4(t.matrixWorld),this.union(sr)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,We),We.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ui),or.subVectors(this.max,Ui),ni.subVectors(t.a,Ui),ii.subVectors(t.b,Ui),ri.subVectors(t.c,Ui),_n.subVectors(ii,ni),vn.subVectors(ri,ii),Un.subVectors(ni,ri);let e=[0,-_n.z,_n.y,0,-vn.z,vn.y,0,-Un.z,Un.y,_n.z,0,-_n.x,vn.z,0,-vn.x,Un.z,0,-Un.x,-_n.y,_n.x,0,-vn.y,vn.x,0,-Un.y,Un.x,0];return!Ms(e,ni,ii,ri,or)||(e=[1,0,0,0,1,0,0,0,1],!Ms(e,ni,ii,ri,or))?!1:(ar.crossVectors(_n,vn),e=[ar.x,ar.y,ar.z],Ms(e,ni,ii,ri,or))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,We).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(We).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(en[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),en[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),en[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),en[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),en[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),en[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),en[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),en[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(en),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const en=[new w,new w,new w,new w,new w,new w,new w,new w],We=new w,sr=new Qi,ni=new w,ii=new w,ri=new w,_n=new w,vn=new w,Un=new w,Ui=new w,or=new w,ar=new w,Nn=new w;function Ms(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Nn.fromArray(i,s);const a=r.x*Math.abs(Nn.x)+r.y*Math.abs(Nn.y)+r.z*Math.abs(Nn.z),c=t.dot(Nn),l=e.dot(Nn),h=n.dot(Nn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const gu=new Qi,Ni=new w,Ss=new w;class tr{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):gu.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ni.subVectors(t,this.center);const e=Ni.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Ni,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ss.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ni.copy(t.center).add(Ss)),this.expandByPoint(Ni.copy(t.center).sub(Ss))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const nn=new w,ys=new w,cr=new w,xn=new w,Es=new w,lr=new w,Ts=new w;class ss{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,nn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=nn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(nn.copy(this.origin).addScaledVector(this.direction,e),nn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){ys.copy(t).add(e).multiplyScalar(.5),cr.copy(e).sub(t).normalize(),xn.copy(this.origin).sub(ys);const s=t.distanceTo(e)*.5,o=-this.direction.dot(cr),a=xn.dot(this.direction),c=-xn.dot(cr),l=xn.lengthSq(),h=Math.abs(1-o*o);let f,p,m,g;if(h>0)if(f=o*c-a,p=o*a-c,g=s*h,f>=0)if(p>=-g)if(p<=g){const v=1/h;f*=v,p*=v,m=f*(f+o*p+2*a)+p*(o*f+p+2*c)+l}else p=s,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*c)+l;else p=-s,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*c)+l;else p<=-g?(f=Math.max(0,-(-o*s+a)),p=f>0?-s:Math.min(Math.max(-s,-c),s),m=-f*f+p*(p+2*c)+l):p<=g?(f=0,p=Math.min(Math.max(-s,-c),s),m=p*(p+2*c)+l):(f=Math.max(0,-(o*s+a)),p=f>0?s:Math.min(Math.max(-s,-c),s),m=-f*f+p*(p+2*c)+l);else p=o>0?-s:s,f=Math.max(0,-(o*p+a)),m=-f*f+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(ys).addScaledVector(cr,p),m}intersectSphere(t,e){nn.subVectors(t.center,this.origin);const n=nn.dot(this.direction),r=nn.dot(nn)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,r=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,r=(t.min.x-p.x)*l),h>=0?(s=(t.min.y-p.y)*h,o=(t.max.y-p.y)*h):(s=(t.max.y-p.y)*h,o=(t.min.y-p.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(t.min.z-p.z)*f,c=(t.max.z-p.z)*f):(a=(t.max.z-p.z)*f,c=(t.min.z-p.z)*f),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,nn)!==null}intersectTriangle(t,e,n,r,s){Es.subVectors(e,t),lr.subVectors(n,t),Ts.crossVectors(Es,lr);let o=this.direction.dot(Ts),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;xn.subVectors(this.origin,t);const c=a*this.direction.dot(lr.crossVectors(xn,lr));if(c<0)return null;const l=a*this.direction.dot(Es.cross(xn));if(l<0||c+l>o)return null;const h=-a*xn.dot(Ts);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Yt{constructor(t,e,n,r,s,o,a,c,l,h,f,p,m,g,v,u){Yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l,h,f,p,m,g,v,u)}set(t,e,n,r,s,o,a,c,l,h,f,p,m,g,v,u){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=h,d[10]=f,d[14]=p,d[3]=m,d[7]=g,d[11]=v,d[15]=u,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Yt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/si.setFromMatrixColumn(t,0).length(),s=1/si.setFromMatrixColumn(t,1).length(),o=1/si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const p=o*h,m=o*f,g=a*h,v=a*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=m+g*l,e[5]=p-v*l,e[9]=-a*c,e[2]=v-p*l,e[6]=g+m*l,e[10]=o*c}else if(t.order==="YXZ"){const p=c*h,m=c*f,g=l*h,v=l*f;e[0]=p+v*a,e[4]=g*a-m,e[8]=o*l,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=m*a-g,e[6]=v+p*a,e[10]=o*c}else if(t.order==="ZXY"){const p=c*h,m=c*f,g=l*h,v=l*f;e[0]=p-v*a,e[4]=-o*f,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*h,e[9]=v-p*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const p=o*h,m=o*f,g=a*h,v=a*f;e[0]=c*h,e[4]=g*l-m,e[8]=p*l+v,e[1]=c*f,e[5]=v*l+p,e[9]=m*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const p=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-p*f,e[8]=g*f+m,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=m*f+g,e[10]=p-v*f}else if(t.order==="XZY"){const p=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=p*f+v,e[5]=o*h,e[9]=m*f-g,e[2]=g*f-m,e[6]=a*h,e[10]=v*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_u,t,vu)}lookAt(t,e,n){const r=this.elements;return Ie.subVectors(t,e),Ie.lengthSq()===0&&(Ie.z=1),Ie.normalize(),Mn.crossVectors(n,Ie),Mn.lengthSq()===0&&(Math.abs(n.z)===1?Ie.x+=1e-4:Ie.z+=1e-4,Ie.normalize(),Mn.crossVectors(n,Ie)),Mn.normalize(),hr.crossVectors(Ie,Mn),r[0]=Mn.x,r[4]=hr.x,r[8]=Ie.x,r[1]=Mn.y,r[5]=hr.y,r[9]=Ie.y,r[2]=Mn.z,r[6]=hr.z,r[10]=Ie.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],f=n[5],p=n[9],m=n[13],g=n[2],v=n[6],u=n[10],d=n[14],E=n[3],x=n[7],T=n[11],I=n[15],R=r[0],b=r[4],P=r[8],V=r[12],_=r[1],y=r[5],B=r[9],z=r[13],W=r[2],$=r[6],k=r[10],J=r[14],H=r[3],ct=r[7],lt=r[11],_t=r[15];return s[0]=o*R+a*_+c*W+l*H,s[4]=o*b+a*y+c*$+l*ct,s[8]=o*P+a*B+c*k+l*lt,s[12]=o*V+a*z+c*J+l*_t,s[1]=h*R+f*_+p*W+m*H,s[5]=h*b+f*y+p*$+m*ct,s[9]=h*P+f*B+p*k+m*lt,s[13]=h*V+f*z+p*J+m*_t,s[2]=g*R+v*_+u*W+d*H,s[6]=g*b+v*y+u*$+d*ct,s[10]=g*P+v*B+u*k+d*lt,s[14]=g*V+v*z+u*J+d*_t,s[3]=E*R+x*_+T*W+I*H,s[7]=E*b+x*y+T*$+I*ct,s[11]=E*P+x*B+T*k+I*lt,s[15]=E*V+x*z+T*J+I*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],f=t[6],p=t[10],m=t[14],g=t[3],v=t[7],u=t[11],d=t[15];return g*(+s*c*f-r*l*f-s*a*p+n*l*p+r*a*m-n*c*m)+v*(+e*c*m-e*l*p+s*o*p-r*o*m+r*l*h-s*c*h)+u*(+e*l*f-e*a*m-s*o*f+n*o*m+s*a*h-n*l*h)+d*(-r*a*h-e*c*f+e*a*p+r*o*f-n*o*p+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],f=t[9],p=t[10],m=t[11],g=t[12],v=t[13],u=t[14],d=t[15],E=f*u*l-v*p*l+v*c*m-a*u*m-f*c*d+a*p*d,x=g*p*l-h*u*l-g*c*m+o*u*m+h*c*d-o*p*d,T=h*v*l-g*f*l+g*a*m-o*v*m-h*a*d+o*f*d,I=g*f*c-h*v*c-g*a*p+o*v*p+h*a*u-o*f*u,R=e*E+n*x+r*T+s*I;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/R;return t[0]=E*b,t[1]=(v*p*s-f*u*s-v*r*m+n*u*m+f*r*d-n*p*d)*b,t[2]=(a*u*s-v*c*s+v*r*l-n*u*l-a*r*d+n*c*d)*b,t[3]=(f*c*s-a*p*s-f*r*l+n*p*l+a*r*m-n*c*m)*b,t[4]=x*b,t[5]=(h*u*s-g*p*s+g*r*m-e*u*m-h*r*d+e*p*d)*b,t[6]=(g*c*s-o*u*s-g*r*l+e*u*l+o*r*d-e*c*d)*b,t[7]=(o*p*s-h*c*s+h*r*l-e*p*l-o*r*m+e*c*m)*b,t[8]=T*b,t[9]=(g*f*s-h*v*s-g*n*m+e*v*m+h*n*d-e*f*d)*b,t[10]=(o*v*s-g*a*s+g*n*l-e*v*l-o*n*d+e*a*d)*b,t[11]=(h*a*s-o*f*s-h*n*l+e*f*l+o*n*m-e*a*m)*b,t[12]=I*b,t[13]=(h*v*r-g*f*r+g*n*p-e*v*p-h*n*u+e*f*u)*b,t[14]=(g*a*r-o*v*r-g*n*c+e*v*c+o*n*u-e*a*u)*b,t[15]=(o*f*r-h*a*r+h*n*c-e*f*c-o*n*p+e*a*p)*b,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,c=t.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,h*a+n,h*c-r*o,0,l*c-r*a,h*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,h=o+o,f=a+a,p=s*l,m=s*h,g=s*f,v=o*h,u=o*f,d=a*f,E=c*l,x=c*h,T=c*f,I=n.x,R=n.y,b=n.z;return r[0]=(1-(v+d))*I,r[1]=(m+T)*I,r[2]=(g-x)*I,r[3]=0,r[4]=(m-T)*R,r[5]=(1-(p+d))*R,r[6]=(u+E)*R,r[7]=0,r[8]=(g+x)*b,r[9]=(u-E)*b,r[10]=(1-(p+v))*b,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=si.set(r[0],r[1],r[2]).length();const o=si.set(r[4],r[5],r[6]).length(),a=si.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],Xe.copy(this);const l=1/s,h=1/o,f=1/a;return Xe.elements[0]*=l,Xe.elements[1]*=l,Xe.elements[2]*=l,Xe.elements[4]*=h,Xe.elements[5]*=h,Xe.elements[6]*=h,Xe.elements[8]*=f,Xe.elements[9]*=f,Xe.elements[10]*=f,e.setFromRotationMatrix(Xe),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=ln){const c=this.elements,l=2*s/(e-t),h=2*s/(n-r),f=(e+t)/(e-t),p=(n+r)/(n-r);let m,g;if(a===ln)m=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Jr)m=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=ln){const c=this.elements,l=1/(e-t),h=1/(n-r),f=1/(o-s),p=(e+t)*l,m=(n+r)*h;let g,v;if(a===ln)g=(o+s)*f,v=-2*f;else if(a===Jr)g=s*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const si=new w,Xe=new Yt,_u=new w(0,0,0),vu=new w(1,1,1),Mn=new w,hr=new w,Ie=new w,Na=new Yt,Fa=new In;class Oe{constructor(t=0,e=0,n=0,r=Oe.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],h=r[9],f=r[2],p=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(pe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(pe(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-pe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(pe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-pe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Na.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Na,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Fa.setFromEuler(this),this.setFromQuaternion(Fa,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Oe.DEFAULT_ORDER="XYZ";class na{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let xu=0;const Oa=new w,oi=new In,rn=new Yt,ur=new w,Fi=new w,Mu=new w,Su=new In,Ba=new w(1,0,0),za=new w(0,1,0),ka=new w(0,0,1),Ga={type:"added"},yu={type:"removed"},ai={type:"childadded",child:null},As={type:"childremoved",child:null};class ce extends Ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xu++}),this.uuid=Ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ce.DEFAULT_UP.clone();const t=new w,e=new Oe,n=new In,r=new w(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Yt},normalMatrix:{value:new It}}),this.matrix=new Yt,this.matrixWorld=new Yt,this.matrixAutoUpdate=ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new na,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return oi.setFromAxisAngle(t,e),this.quaternion.multiply(oi),this}rotateOnWorldAxis(t,e){return oi.setFromAxisAngle(t,e),this.quaternion.premultiply(oi),this}rotateX(t){return this.rotateOnAxis(Ba,t)}rotateY(t){return this.rotateOnAxis(za,t)}rotateZ(t){return this.rotateOnAxis(ka,t)}translateOnAxis(t,e){return Oa.copy(t).applyQuaternion(this.quaternion),this.position.add(Oa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ba,t)}translateY(t){return this.translateOnAxis(za,t)}translateZ(t){return this.translateOnAxis(ka,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ur.copy(t):ur.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Fi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?rn.lookAt(Fi,ur,this.up):rn.lookAt(ur,Fi,this.up),this.quaternion.setFromRotationMatrix(rn),r&&(rn.extractRotation(r.matrixWorld),oi.setFromRotationMatrix(rn),this.quaternion.premultiply(oi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ga),ai.child=t,this.dispatchEvent(ai),ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(yu),As.child=t,this.dispatchEvent(As),As.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ga),ai.child=t,this.dispatchEvent(ai),ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,t,Mu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,Su,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];s(t.shapes,f)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),f=o(t.shapes),p=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}ce.DEFAULT_UP=new w(0,1,0);ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qe=new w,sn=new w,ws=new w,on=new w,ci=new w,li=new w,Ha=new w,bs=new w,Rs=new w,Cs=new w,Ps=new Zt,Ls=new Zt,Is=new Zt;class ke{constructor(t=new w,e=new w,n=new w){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),qe.subVectors(t,e),r.cross(qe);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){qe.subVectors(r,e),sn.subVectors(n,e),ws.subVectors(t,e);const o=qe.dot(qe),a=qe.dot(sn),c=qe.dot(ws),l=sn.dot(sn),h=sn.dot(ws),f=o*l-a*a;if(f===0)return s.set(0,0,0),null;const p=1/f,m=(l*c-a*h)*p,g=(o*h-a*c)*p;return s.set(1-m-g,g,m)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,on)===null?!1:on.x>=0&&on.y>=0&&on.x+on.y<=1}static getInterpolation(t,e,n,r,s,o,a,c){return this.getBarycoord(t,e,n,r,on)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,on.x),c.addScaledVector(o,on.y),c.addScaledVector(a,on.z),c)}static getInterpolatedAttribute(t,e,n,r,s,o){return Ps.setScalar(0),Ls.setScalar(0),Is.setScalar(0),Ps.fromBufferAttribute(t,e),Ls.fromBufferAttribute(t,n),Is.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(Ps,s.x),o.addScaledVector(Ls,s.y),o.addScaledVector(Is,s.z),o}static isFrontFacing(t,e,n,r){return qe.subVectors(n,e),sn.subVectors(t,e),qe.cross(sn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return qe.subVectors(this.c,this.b),sn.subVectors(this.a,this.b),qe.cross(sn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ke.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ke.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return ke.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return ke.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ke.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;ci.subVectors(r,n),li.subVectors(s,n),bs.subVectors(t,n);const c=ci.dot(bs),l=li.dot(bs);if(c<=0&&l<=0)return e.copy(n);Rs.subVectors(t,r);const h=ci.dot(Rs),f=li.dot(Rs);if(h>=0&&f<=h)return e.copy(r);const p=c*f-h*l;if(p<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(ci,o);Cs.subVectors(t,s);const m=ci.dot(Cs),g=li.dot(Cs);if(g>=0&&m<=g)return e.copy(s);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(li,a);const u=h*g-m*f;if(u<=0&&f-h>=0&&m-g>=0)return Ha.subVectors(s,r),a=(f-h)/(f-h+(m-g)),e.copy(r).addScaledVector(Ha,a);const d=1/(u+v+p);return o=v*d,a=p*d,e.copy(n).addScaledVector(ci,o).addScaledVector(li,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const gl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},fr={h:0,s:0,l:0};function Ds(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Dt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,qt.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=qt.workingColorSpace){if(t=ea(t,1),e=pe(e,0,1),n=pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Ds(o,s,t+1/3),this.g=Ds(o,s,t),this.b=Ds(o,s,t-1/3)}return qt.toWorkingColorSpace(this,r),this}setStyle(t,e=Ze){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){const n=gl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=xi(t.r),this.g=xi(t.g),this.b=xi(t.b),this}copyLinearToSRGB(t){return this.r=_s(t.r),this.g=_s(t.g),this.b=_s(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return qt.fromWorkingColorSpace(_e.copy(this),t),Math.round(pe(_e.r*255,0,255))*65536+Math.round(pe(_e.g*255,0,255))*256+Math.round(pe(_e.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qt.workingColorSpace){qt.fromWorkingColorSpace(_e.copy(this),e);const n=_e.r,r=_e.g,s=_e.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const f=o-a;switch(l=h<=.5?f/(o+a):f/(2-o-a),o){case n:c=(r-s)/f+(r<s?6:0);break;case r:c=(s-n)/f+2;break;case s:c=(n-r)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=qt.workingColorSpace){return qt.fromWorkingColorSpace(_e.copy(this),e),t.r=_e.r,t.g=_e.g,t.b=_e.b,t}getStyle(t=Ze){qt.fromWorkingColorSpace(_e.copy(this),t);const e=_e.r,n=_e.g,r=_e.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Sn),this.setHSL(Sn.h+t,Sn.s+e,Sn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Sn),t.getHSL(fr);const n=Vi(Sn.h,fr.h,e),r=Vi(Sn.s,fr.s,e),s=Vi(Sn.l,fr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _e=new Dt;Dt.NAMES=gl;let Eu=0;class Zn extends Ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=Ci(),this.name="",this.type="Material",this.blending=gi,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qs,this.blendDst=to,this.blendEquation=Vn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=yi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ba,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ti,this.stencilZFail=ti,this.stencilZPass=ti,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gi&&(n.blending=this.blending),this.side!==wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Qs&&(n.blendSrc=this.blendSrc),this.blendDst!==to&&(n.blendDst=this.blendDst),this.blendEquation!==Vn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==yi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ba&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ti&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ti&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ti&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class fn extends Zn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oe,this.combine=Qc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const oe=new w,dr=new St;class Fe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ra,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)dr.fromBufferAttribute(this,e),dr.applyMatrix3(t),this.setXY(e,dr.x,dr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.applyMatrix3(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.applyMatrix4(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.applyNormalMatrix(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)oe.fromBufferAttribute(this,e),oe.transformDirection(t),this.setXYZ(e,oe.x,oe.y,oe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=pi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=pi(e,this.array)),e}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=pi(e,this.array)),e}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=pi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=pi(e,this.array)),e}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),r=xe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),r=xe(r,this.array),s=xe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ra&&(t.usage=this.usage),t}}class _l extends Fe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class vl extends Fe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Qt extends Fe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Tu=0;const ze=new Yt,Us=new ce,hi=new w,De=new Qi,Oi=new Qi,ue=new w;class fe extends Ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=Ci(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(dl(t)?vl:_l)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new It().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ze.makeRotationFromQuaternion(t),this.applyMatrix4(ze),this}rotateX(t){return ze.makeRotationX(t),this.applyMatrix4(ze),this}rotateY(t){return ze.makeRotationY(t),this.applyMatrix4(ze),this}rotateZ(t){return ze.makeRotationZ(t),this.applyMatrix4(ze),this}translate(t,e,n){return ze.makeTranslation(t,e,n),this.applyMatrix4(ze),this}scale(t,e,n){return ze.makeScale(t,e,n),this.applyMatrix4(ze),this}lookAt(t){return Us.lookAt(t),Us.updateMatrix(),this.applyMatrix4(Us.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hi).negate(),this.translate(hi.x,hi.y,hi.z),this}setFromPoints(t){const e=[];for(let n=0,r=t.length;n<r;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Qt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];De.setFromBufferAttribute(s),this.morphTargetsRelative?(ue.addVectors(this.boundingBox.min,De.min),this.boundingBox.expandByPoint(ue),ue.addVectors(this.boundingBox.max,De.max),this.boundingBox.expandByPoint(ue)):(this.boundingBox.expandByPoint(De.min),this.boundingBox.expandByPoint(De.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){const n=this.boundingSphere.center;if(De.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Oi.setFromBufferAttribute(a),this.morphTargetsRelative?(ue.addVectors(De.min,Oi.min),De.expandByPoint(ue),ue.addVectors(De.max,Oi.max),De.expandByPoint(ue)):(De.expandByPoint(Oi.min),De.expandByPoint(Oi.max))}De.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)ue.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(ue));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)ue.fromBufferAttribute(a,l),c&&(hi.fromBufferAttribute(t,l),ue.add(hi)),r=Math.max(r,n.distanceToSquared(ue))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Fe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<n.count;P++)a[P]=new w,c[P]=new w;const l=new w,h=new w,f=new w,p=new St,m=new St,g=new St,v=new w,u=new w;function d(P,V,_){l.fromBufferAttribute(n,P),h.fromBufferAttribute(n,V),f.fromBufferAttribute(n,_),p.fromBufferAttribute(s,P),m.fromBufferAttribute(s,V),g.fromBufferAttribute(s,_),h.sub(l),f.sub(l),m.sub(p),g.sub(p);const y=1/(m.x*g.y-g.x*m.y);isFinite(y)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(y),u.copy(f).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(y),a[P].add(v),a[V].add(v),a[_].add(v),c[P].add(u),c[V].add(u),c[_].add(u))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let P=0,V=E.length;P<V;++P){const _=E[P],y=_.start,B=_.count;for(let z=y,W=y+B;z<W;z+=3)d(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const x=new w,T=new w,I=new w,R=new w;function b(P){I.fromBufferAttribute(r,P),R.copy(I);const V=a[P];x.copy(V),x.sub(I.multiplyScalar(I.dot(V))).normalize(),T.crossVectors(R,V);const y=T.dot(c[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,y)}for(let P=0,V=E.length;P<V;++P){const _=E[P],y=_.start,B=_.count;for(let z=y,W=y+B;z<W;z+=3)b(t.getX(z+0)),b(t.getX(z+1)),b(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Fe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const r=new w,s=new w,o=new w,a=new w,c=new w,l=new w,h=new w,f=new w;if(t)for(let p=0,m=t.count;p<m;p+=3){const g=t.getX(p+0),v=t.getX(p+1),u=t.getX(p+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,u),h.subVectors(o,s),f.subVectors(r,s),h.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,u),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(u,l.x,l.y,l.z)}else for(let p=0,m=e.count;p<m;p+=3)r.fromBufferAttribute(e,p+0),s.fromBufferAttribute(e,p+1),o.fromBufferAttribute(e,p+2),h.subVectors(o,s),f.subVectors(r,s),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ue.fromBufferAttribute(t,e),ue.normalize(),t.setXYZ(e,ue.x,ue.y,ue.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,f=a.normalized,p=new l.constructor(c.length*h);let m=0,g=0;for(let v=0,u=c.length;v<u;v++){a.isInterleavedBufferAttribute?m=c[v]*a.data.stride+a.offset:m=c[v]*h;for(let d=0;d<h;d++)p[g++]=l[m++]}return new Fe(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new fe,n=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=t(c,n);e.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let h=0,f=l.length;h<f;h++){const p=l[h],m=t(p,n);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,p=l.length;f<p;f++){const m=l[f];h.push(m.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],f=s[l];for(let p=0,m=f.length;p<m;p++)h.push(f[p].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Va=new Yt,Fn=new ss,pr=new tr,Wa=new w,mr=new w,gr=new w,_r=new w,Ns=new w,vr=new w,Xa=new w,xr=new w;class Gt extends ce{constructor(t=new fe,e=new fn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){vr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=a[c],f=s[c];h!==0&&(Ns.fromBufferAttribute(f,t),o?vr.addScaledVector(Ns,h):vr.addScaledVector(Ns.sub(e),h))}e.add(vr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(s),Fn.copy(t.ray).recast(t.near),!(pr.containsPoint(Fn.origin)===!1&&(Fn.intersectSphere(pr,Wa)===null||Fn.origin.distanceToSquared(Wa)>(t.far-t.near)**2))&&(Va.copy(s).invert(),Fn.copy(t.ray).applyMatrix4(Va),!(n.boundingBox!==null&&Fn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Fn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,p=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const u=p[g],d=o[u.materialIndex],E=Math.max(u.start,m.start),x=Math.min(a.count,Math.min(u.start+u.count,m.start+m.count));for(let T=E,I=x;T<I;T+=3){const R=a.getX(T),b=a.getX(T+1),P=a.getX(T+2);r=Mr(this,d,t,n,l,h,f,R,b,P),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=u.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let u=g,d=v;u<d;u+=3){const E=a.getX(u),x=a.getX(u+1),T=a.getX(u+2);r=Mr(this,o,t,n,l,h,f,E,x,T),r&&(r.faceIndex=Math.floor(u/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const u=p[g],d=o[u.materialIndex],E=Math.max(u.start,m.start),x=Math.min(c.count,Math.min(u.start+u.count,m.start+m.count));for(let T=E,I=x;T<I;T+=3){const R=T,b=T+1,P=T+2;r=Mr(this,d,t,n,l,h,f,R,b,P),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=u.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let u=g,d=v;u<d;u+=3){const E=u,x=u+1,T=u+2;r=Mr(this,o,t,n,l,h,f,E,x,T),r&&(r.faceIndex=Math.floor(u/3),e.push(r))}}}}function Au(i,t,e,n,r,s,o,a){let c;if(t.side===Te?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,t.side===wn,a),c===null)return null;xr.copy(a),xr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(xr);return l<e.near||l>e.far?null:{distance:l,point:xr.clone(),object:i}}function Mr(i,t,e,n,r,s,o,a,c,l){i.getVertexPosition(a,mr),i.getVertexPosition(c,gr),i.getVertexPosition(l,_r);const h=Au(i,t,e,n,mr,gr,_r,Xa);if(h){const f=new w;ke.getBarycoord(Xa,mr,gr,_r,f),r&&(h.uv=ke.getInterpolatedAttribute(r,a,c,l,f,new St)),s&&(h.uv1=ke.getInterpolatedAttribute(s,a,c,l,f,new St)),o&&(h.normal=ke.getInterpolatedAttribute(o,a,c,l,f,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a,b:c,c:l,normal:new w,materialIndex:0};ke.getNormal(mr,gr,_r,p.normal),h.face=p,h.barycoord=f}return h}class pn extends fe{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],h=[],f=[];let p=0,m=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(f,2));function g(v,u,d,E,x,T,I,R,b,P,V){const _=T/b,y=I/P,B=T/2,z=I/2,W=R/2,$=b+1,k=P+1;let J=0,H=0;const ct=new w;for(let lt=0;lt<k;lt++){const _t=lt*y-z;for(let Ht=0;Ht<$;Ht++){const Kt=Ht*_-B;ct[v]=Kt*E,ct[u]=_t*x,ct[d]=W,l.push(ct.x,ct.y,ct.z),ct[v]=0,ct[u]=0,ct[d]=R>0?1:-1,h.push(ct.x,ct.y,ct.z),f.push(Ht/b),f.push(1-lt/P),J+=1}}for(let lt=0;lt<P;lt++)for(let _t=0;_t<b;_t++){const Ht=p+_t+$*lt,Kt=p+_t+$*(lt+1),X=p+(_t+1)+$*(lt+1),Q=p+(_t+1)+$*lt;c.push(Ht,Kt,Q),c.push(Kt,X,Q),H+=6}a.addGroup(m,H,V),m+=H,p+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function bi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Me(i){const t={};for(let e=0;e<i.length;e++){const n=bi(i[e]);for(const r in n)t[r]=n[r]}return t}function wu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function xl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}const bu={clone:bi,merge:Me};var Ru=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bn extends Zn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ru,this.fragmentShader=Cu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=bi(t.uniforms),this.uniformsGroups=wu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ml extends ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Yt,this.projectionMatrix=new Yt,this.projectionMatrixInverse=new Yt,this.coordinateSystem=ln}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yn=new w,qa=new St,Ya=new St;class Ue extends Ml{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=$i*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(vi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return $i*2*Math.atan(Math.tan(vi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(yn.x,yn.y).multiplyScalar(-t/yn.z),yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yn.x,yn.y).multiplyScalar(-t/yn.z)}getViewSize(t,e){return this.getViewBounds(t,qa,Ya),e.subVectors(Ya,qa)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(vi*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,e-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ui=-90,fi=1;class Pu extends ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ue(ui,fi,t,e);r.layers=this.layers,this.add(r);const s=new Ue(ui,fi,t,e);s.layers=this.layers,this.add(s);const o=new Ue(ui,fi,t,e);o.layers=this.layers,this.add(o);const a=new Ue(ui,fi,t,e);a.layers=this.layers,this.add(a);const c=new Ue(ui,fi,t,e);c.layers=this.layers,this.add(c);const l=new Ue(ui,fi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,c]=e;for(const l of e)this.remove(l);if(t===ln)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(f,p,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Sl extends Re{constructor(t,e,n,r,s,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ei,super(t,e,n,r,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Lu extends Jn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Sl(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ke}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new pn(5,5,5),s=new bn({name:"CubemapFromEquirect",uniforms:bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Te,blending:Tn});s.uniforms.tEquirect.value=e;const o=new Gt(r,s),a=e.minFilter;return e.minFilter===qn&&(e.minFilter=Ke),new Pu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}const Fs=new w,Iu=new w,Du=new It;class Gn{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Fs.subVectors(n,e).cross(Iu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Fs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Du.getNormalMatrix(t),r=this.coplanarPoint(Fs).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const On=new tr,Sr=new w;class ia{constructor(t=new Gn,e=new Gn,n=new Gn,r=new Gn,s=new Gn,o=new Gn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ln){const n=this.planes,r=t.elements,s=r[0],o=r[1],a=r[2],c=r[3],l=r[4],h=r[5],f=r[6],p=r[7],m=r[8],g=r[9],v=r[10],u=r[11],d=r[12],E=r[13],x=r[14],T=r[15];if(n[0].setComponents(c-s,p-l,u-m,T-d).normalize(),n[1].setComponents(c+s,p+l,u+m,T+d).normalize(),n[2].setComponents(c+o,p+h,u+g,T+E).normalize(),n[3].setComponents(c-o,p-h,u-g,T-E).normalize(),n[4].setComponents(c-a,p-f,u-v,T-x).normalize(),e===ln)n[5].setComponents(c+a,p+f,u+v,T+x).normalize();else if(e===Jr)n[5].setComponents(a,f,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),On.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),On.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(On)}intersectsSprite(t){return On.center.set(0,0,0),On.radius=.7071067811865476,On.applyMatrix4(t.matrixWorld),this.intersectsSphere(On)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Sr.x=r.normal.x>0?t.max.x:t.min.x,Sr.y=r.normal.y>0?t.max.y:t.min.y,Sr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Sr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function yl(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Uu(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,f=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,h),a.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,h);else{f.sort((m,g)=>m.start-g.start);let p=0;for(let m=1;m<f.length;m++){const g=f[p],v=f[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++p,f[p]=v)}f.length=p+1;for(let m=0,g=f.length;m<g;m++){const v=f[m];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}class Rn extends fe{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),c=Math.floor(r),l=a+1,h=c+1,f=t/a,p=e/c,m=[],g=[],v=[],u=[];for(let d=0;d<h;d++){const E=d*p-o;for(let x=0;x<l;x++){const T=x*f-s;g.push(T,-E,0),v.push(0,0,1),u.push(x/a),u.push(1-d/c)}}for(let d=0;d<c;d++)for(let E=0;E<a;E++){const x=E+l*d,T=E+l*(d+1),I=E+1+l*(d+1),R=E+1+l*d;m.push(x,T,R),m.push(T,I,R)}this.setIndex(m),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Nu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fu=`#ifdef USE_ALPHAHASH
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
#endif`,Ou=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Bu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ku=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gu=`#ifdef USE_AOMAP
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
#endif`,Hu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vu=`#ifdef USE_BATCHING
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
#endif`,Wu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Xu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ku=`#ifdef USE_IRIDESCENCE
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
#endif`,$u=`#ifdef USE_BUMPMAP
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
#endif`,Ju=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ju=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ef=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,nf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sf=`#define PI 3.141592653589793
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
} // validated`,of=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,af=`vec3 transformedNormal = objectNormal;
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
#endif`,cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,uf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ff="gl_FragColor = linearToOutputTexel( gl_FragColor );",df=`
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
}`,pf=`#ifdef USE_ENVMAP
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
#endif`,mf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gf=`#ifdef USE_ENVMAP
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
#endif`,_f=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vf=`#ifdef USE_ENVMAP
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
#endif`,xf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Sf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ef=`#ifdef USE_GRADIENTMAP
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
}`,Tf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Af=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bf=`uniform bool receiveShadow;
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
#endif`,Rf=`#ifdef USE_ENVMAP
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
#endif`,Cf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Pf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,If=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Df=`PhysicalMaterial material;
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
#endif`,Uf=`struct PhysicalMaterial {
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
}`,Nf=`
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
#endif`,Ff=`#if defined( RE_IndirectDiffuse )
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
#endif`,Of=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Wf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Xf=`#if defined( USE_POINTS_UV )
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
#endif`,qf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Kf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$f=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Jf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zf=`#ifdef USE_MORPHTARGETS
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
#endif`,jf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,td=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,ed=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,id=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,rd=`#ifdef USE_NORMALMAP
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
#endif`,sd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,od=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ad=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ld=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ud=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,pd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,md=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_d=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Md=`float getShadowMask() {
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
}`,Sd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,yd=`#ifdef USE_SKINNING
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
#endif`,Ed=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Td=`#ifdef USE_SKINNING
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
#endif`,Ad=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Rd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Cd=`#ifdef USE_TRANSMISSION
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
#endif`,Pd=`#ifdef USE_TRANSMISSION
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
#endif`,Ld=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Id=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ud=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Nd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fd=`uniform sampler2D t2D;
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
}`,Od=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,zd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gd=`#include <common>
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
}`,Hd=`#if DEPTH_PACKING == 3200
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
}`,Vd=`#define DISTANCE
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
}`,Wd=`#define DISTANCE
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
}`,Xd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yd=`uniform float scale;
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
}`,Kd=`uniform vec3 diffuse;
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
}`,$d=`#include <common>
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
}`,Jd=`uniform vec3 diffuse;
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
}`,Zd=`#define LAMBERT
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
}`,jd=`#define LAMBERT
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
}`,Qd=`#define MATCAP
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
}`,tp=`#define MATCAP
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
}`,ep=`#define NORMAL
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
}`,np=`#define NORMAL
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
}`,ip=`#define PHONG
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
}`,rp=`#define PHONG
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
}`,sp=`#define STANDARD
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
}`,op=`#define STANDARD
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
}`,ap=`#define TOON
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
}`,cp=`#define TOON
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
}`,lp=`uniform float size;
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
}`,hp=`uniform vec3 diffuse;
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
}`,up=`#include <common>
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
}`,fp=`uniform vec3 color;
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
}`,dp=`uniform float rotation;
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
}`,pp=`uniform vec3 diffuse;
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
}`,Lt={alphahash_fragment:Nu,alphahash_pars_fragment:Fu,alphamap_fragment:Ou,alphamap_pars_fragment:Bu,alphatest_fragment:zu,alphatest_pars_fragment:ku,aomap_fragment:Gu,aomap_pars_fragment:Hu,batching_pars_vertex:Vu,batching_vertex:Wu,begin_vertex:Xu,beginnormal_vertex:qu,bsdfs:Yu,iridescence_fragment:Ku,bumpmap_pars_fragment:$u,clipping_planes_fragment:Ju,clipping_planes_pars_fragment:Zu,clipping_planes_pars_vertex:ju,clipping_planes_vertex:Qu,color_fragment:tf,color_pars_fragment:ef,color_pars_vertex:nf,color_vertex:rf,common:sf,cube_uv_reflection_fragment:of,defaultnormal_vertex:af,displacementmap_pars_vertex:cf,displacementmap_vertex:lf,emissivemap_fragment:hf,emissivemap_pars_fragment:uf,colorspace_fragment:ff,colorspace_pars_fragment:df,envmap_fragment:pf,envmap_common_pars_fragment:mf,envmap_pars_fragment:gf,envmap_pars_vertex:_f,envmap_physical_pars_fragment:Rf,envmap_vertex:vf,fog_vertex:xf,fog_pars_vertex:Mf,fog_fragment:Sf,fog_pars_fragment:yf,gradientmap_pars_fragment:Ef,lightmap_pars_fragment:Tf,lights_lambert_fragment:Af,lights_lambert_pars_fragment:wf,lights_pars_begin:bf,lights_toon_fragment:Cf,lights_toon_pars_fragment:Pf,lights_phong_fragment:Lf,lights_phong_pars_fragment:If,lights_physical_fragment:Df,lights_physical_pars_fragment:Uf,lights_fragment_begin:Nf,lights_fragment_maps:Ff,lights_fragment_end:Of,logdepthbuf_fragment:Bf,logdepthbuf_pars_fragment:zf,logdepthbuf_pars_vertex:kf,logdepthbuf_vertex:Gf,map_fragment:Hf,map_pars_fragment:Vf,map_particle_fragment:Wf,map_particle_pars_fragment:Xf,metalnessmap_fragment:qf,metalnessmap_pars_fragment:Yf,morphinstance_vertex:Kf,morphcolor_vertex:$f,morphnormal_vertex:Jf,morphtarget_pars_vertex:Zf,morphtarget_vertex:jf,normal_fragment_begin:Qf,normal_fragment_maps:td,normal_pars_fragment:ed,normal_pars_vertex:nd,normal_vertex:id,normalmap_pars_fragment:rd,clearcoat_normal_fragment_begin:sd,clearcoat_normal_fragment_maps:od,clearcoat_pars_fragment:ad,iridescence_pars_fragment:cd,opaque_fragment:ld,packing:hd,premultiplied_alpha_fragment:ud,project_vertex:fd,dithering_fragment:dd,dithering_pars_fragment:pd,roughnessmap_fragment:md,roughnessmap_pars_fragment:gd,shadowmap_pars_fragment:_d,shadowmap_pars_vertex:vd,shadowmap_vertex:xd,shadowmask_pars_fragment:Md,skinbase_vertex:Sd,skinning_pars_vertex:yd,skinning_vertex:Ed,skinnormal_vertex:Td,specularmap_fragment:Ad,specularmap_pars_fragment:wd,tonemapping_fragment:bd,tonemapping_pars_fragment:Rd,transmission_fragment:Cd,transmission_pars_fragment:Pd,uv_pars_fragment:Ld,uv_pars_vertex:Id,uv_vertex:Dd,worldpos_vertex:Ud,background_vert:Nd,background_frag:Fd,backgroundCube_vert:Od,backgroundCube_frag:Bd,cube_vert:zd,cube_frag:kd,depth_vert:Gd,depth_frag:Hd,distanceRGBA_vert:Vd,distanceRGBA_frag:Wd,equirect_vert:Xd,equirect_frag:qd,linedashed_vert:Yd,linedashed_frag:Kd,meshbasic_vert:$d,meshbasic_frag:Jd,meshlambert_vert:Zd,meshlambert_frag:jd,meshmatcap_vert:Qd,meshmatcap_frag:tp,meshnormal_vert:ep,meshnormal_frag:np,meshphong_vert:ip,meshphong_frag:rp,meshphysical_vert:sp,meshphysical_frag:op,meshtoon_vert:ap,meshtoon_frag:cp,points_vert:lp,points_frag:hp,shadow_vert:up,shadow_frag:fp,sprite_vert:dp,sprite_frag:pp},nt={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new It}},envmap:{envMap:{value:null},envMapRotation:{value:new It},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new It}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new It}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new It},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new It},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new It},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new It}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new It}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new It}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0},uvTransform:{value:new It}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new It},alphaMap:{value:null},alphaMapTransform:{value:new It},alphaTest:{value:0}}},je={basic:{uniforms:Me([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:Lt.meshbasic_vert,fragmentShader:Lt.meshbasic_frag},lambert:{uniforms:Me([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Lt.meshlambert_vert,fragmentShader:Lt.meshlambert_frag},phong:{uniforms:Me([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30}}]),vertexShader:Lt.meshphong_vert,fragmentShader:Lt.meshphong_frag},standard:{uniforms:Me([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag},toon:{uniforms:Me([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Lt.meshtoon_vert,fragmentShader:Lt.meshtoon_frag},matcap:{uniforms:Me([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:Lt.meshmatcap_vert,fragmentShader:Lt.meshmatcap_frag},points:{uniforms:Me([nt.points,nt.fog]),vertexShader:Lt.points_vert,fragmentShader:Lt.points_frag},dashed:{uniforms:Me([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Lt.linedashed_vert,fragmentShader:Lt.linedashed_frag},depth:{uniforms:Me([nt.common,nt.displacementmap]),vertexShader:Lt.depth_vert,fragmentShader:Lt.depth_frag},normal:{uniforms:Me([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:Lt.meshnormal_vert,fragmentShader:Lt.meshnormal_frag},sprite:{uniforms:Me([nt.sprite,nt.fog]),vertexShader:Lt.sprite_vert,fragmentShader:Lt.sprite_frag},background:{uniforms:{uvTransform:{value:new It},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Lt.background_vert,fragmentShader:Lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new It}},vertexShader:Lt.backgroundCube_vert,fragmentShader:Lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Lt.cube_vert,fragmentShader:Lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Lt.equirect_vert,fragmentShader:Lt.equirect_frag},distanceRGBA:{uniforms:Me([nt.common,nt.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Lt.distanceRGBA_vert,fragmentShader:Lt.distanceRGBA_frag},shadow:{uniforms:Me([nt.lights,nt.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:Lt.shadow_vert,fragmentShader:Lt.shadow_frag}};je.physical={uniforms:Me([je.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new It},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new It},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new It},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new It},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new It},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new It},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new It},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new It},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new It},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new It},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new It},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new It}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag};const yr={r:0,b:0,g:0},Bn=new Oe,mp=new Yt;function gp(i,t,e,n,r,s,o){const a=new Dt(0);let c=s===!0?0:1,l,h,f=null,p=0,m=null;function g(E){let x=E.isScene===!0?E.background:null;return x&&x.isTexture&&(x=(E.backgroundBlurriness>0?e:t).get(x)),x}function v(E){let x=!1;const T=g(E);T===null?d(a,c):T&&T.isColor&&(d(T,1),x=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function u(E,x){const T=g(x);T&&(T.isCubeTexture||T.mapping===is)?(h===void 0&&(h=new Gt(new pn(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:bi(je.backgroundCube.uniforms),vertexShader:je.backgroundCube.vertexShader,fragmentShader:je.backgroundCube.fragmentShader,side:Te,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,R,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Bn.copy(x.backgroundRotation),Bn.x*=-1,Bn.y*=-1,Bn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Bn.y*=-1,Bn.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(mp.makeRotationFromEuler(Bn)),h.material.toneMapped=qt.getTransfer(T.colorSpace)!==ne,(f!==T||p!==T.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,f=T,p=T.version,m=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new Gt(new Rn(2,2),new bn({name:"BackgroundMaterial",uniforms:bi(je.background.uniforms),vertexShader:je.background.vertexShader,fragmentShader:je.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=qt.getTransfer(T.colorSpace)!==ne,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(f!==T||p!==T.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,f=T,p=T.version,m=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function d(E,x){E.getRGB(yr,xl(i)),n.buffers.color.setClear(yr.r,yr.g,yr.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(E,x=1){a.set(E),c=x,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(E){c=E,d(a,c)},render:v,addToRenderList:u}}function _p(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=p(null);let s=r,o=!1;function a(_,y,B,z,W){let $=!1;const k=f(z,B,y);s!==k&&(s=k,l(s.object)),$=m(_,z,B,W),$&&g(_,z,B,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),($||o)&&(o=!1,T(_,y,B,z),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function f(_,y,B){const z=B.wireframe===!0;let W=n[_.id];W===void 0&&(W={},n[_.id]=W);let $=W[y.id];$===void 0&&($={},W[y.id]=$);let k=$[z];return k===void 0&&(k=p(c()),$[z]=k),k}function p(_){const y=[],B=[],z=[];for(let W=0;W<e;W++)y[W]=0,B[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:y,enabledAttributes:B,attributeDivisors:z,object:_,attributes:{},index:null}}function m(_,y,B,z){const W=s.attributes,$=y.attributes;let k=0;const J=B.getAttributes();for(const H in J)if(J[H].location>=0){const lt=W[H];let _t=$[H];if(_t===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(_t=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(_t=_.instanceColor)),lt===void 0||lt.attribute!==_t||_t&&lt.data!==_t.data)return!0;k++}return s.attributesNum!==k||s.index!==z}function g(_,y,B,z){const W={},$=y.attributes;let k=0;const J=B.getAttributes();for(const H in J)if(J[H].location>=0){let lt=$[H];lt===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor));const _t={};_t.attribute=lt,lt&&lt.data&&(_t.data=lt.data),W[H]=_t,k++}s.attributes=W,s.attributesNum=k,s.index=z}function v(){const _=s.newAttributes;for(let y=0,B=_.length;y<B;y++)_[y]=0}function u(_){d(_,0)}function d(_,y){const B=s.newAttributes,z=s.enabledAttributes,W=s.attributeDivisors;B[_]=1,z[_]===0&&(i.enableVertexAttribArray(_),z[_]=1),W[_]!==y&&(i.vertexAttribDivisor(_,y),W[_]=y)}function E(){const _=s.newAttributes,y=s.enabledAttributes;for(let B=0,z=y.length;B<z;B++)y[B]!==_[B]&&(i.disableVertexAttribArray(B),y[B]=0)}function x(_,y,B,z,W,$,k){k===!0?i.vertexAttribIPointer(_,y,B,W,$):i.vertexAttribPointer(_,y,B,z,W,$)}function T(_,y,B,z){v();const W=z.attributes,$=B.getAttributes(),k=y.defaultAttributeValues;for(const J in $){const H=$[J];if(H.location>=0){let ct=W[J];if(ct===void 0&&(J==="instanceMatrix"&&_.instanceMatrix&&(ct=_.instanceMatrix),J==="instanceColor"&&_.instanceColor&&(ct=_.instanceColor)),ct!==void 0){const lt=ct.normalized,_t=ct.itemSize,Ht=t.get(ct);if(Ht===void 0)continue;const Kt=Ht.buffer,X=Ht.type,Q=Ht.bytesPerElement,mt=X===i.INT||X===i.UNSIGNED_INT||ct.gpuType===Ko;if(ct.isInterleavedBufferAttribute){const ht=ct.data,Ct=ht.stride,Et=ct.offset;if(ht.isInstancedInterleavedBuffer){for(let Ft=0;Ft<H.locationSize;Ft++)d(H.location+Ft,ht.meshPerAttribute);_.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Ft=0;Ft<H.locationSize;Ft++)u(H.location+Ft);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let Ft=0;Ft<H.locationSize;Ft++)x(H.location+Ft,_t/H.locationSize,X,lt,Ct*Q,(Et+_t/H.locationSize*Ft)*Q,mt)}else{if(ct.isInstancedBufferAttribute){for(let ht=0;ht<H.locationSize;ht++)d(H.location+ht,ct.meshPerAttribute);_.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let ht=0;ht<H.locationSize;ht++)u(H.location+ht);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let ht=0;ht<H.locationSize;ht++)x(H.location+ht,_t/H.locationSize,X,lt,_t*Q,_t/H.locationSize*ht*Q,mt)}}else if(k!==void 0){const lt=k[J];if(lt!==void 0)switch(lt.length){case 2:i.vertexAttrib2fv(H.location,lt);break;case 3:i.vertexAttrib3fv(H.location,lt);break;case 4:i.vertexAttrib4fv(H.location,lt);break;default:i.vertexAttrib1fv(H.location,lt)}}}}E()}function I(){P();for(const _ in n){const y=n[_];for(const B in y){const z=y[B];for(const W in z)h(z[W].object),delete z[W];delete y[B]}delete n[_]}}function R(_){if(n[_.id]===void 0)return;const y=n[_.id];for(const B in y){const z=y[B];for(const W in z)h(z[W].object),delete z[W];delete y[B]}delete n[_.id]}function b(_){for(const y in n){const B=n[y];if(B[_.id]===void 0)continue;const z=B[_.id];for(const W in z)h(z[W].object),delete z[W];delete B[_.id]}}function P(){V(),o=!0,s!==r&&(s=r,l(s.object))}function V(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:V,dispose:I,releaseStatesOfGeometry:R,releaseStatesOfProgram:b,initAttributes:v,enableAttribute:u,disableUnusedAttributes:E}}function vp(i,t,e){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function a(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let m=0;for(let g=0;g<f;g++)m+=h[g];e.update(m,n,1)}function c(l,h,f,p){if(f===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)o(l[g],h[g],p[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,h,0,p,0,f);let g=0;for(let v=0;v<f;v++)g+=h[v];for(let v=0;v<p.length;v++)e.update(g,n,p[v])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function xp(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(b){return!(b!==$e&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(b){const P=b===ji&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==un&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==cn&&!P)}function c(b){if(b==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(p===!0){const b=t.get("EXT_clip_control");b.clipControlEXT(b.LOWER_LEFT_EXT,b.ZERO_TO_ONE_EXT)}const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),u=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),T=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:u,maxAttributes:d,maxVertexUniforms:E,maxVaryings:x,maxFragmentUniforms:T,vertexTextures:I,maxSamples:R}}function Mp(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new Gn,a=new It,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||n!==0||r;return r=p,n=f.length,m},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,m){const g=f.clippingPlanes,v=f.clipIntersection,u=f.clipShadows,d=i.get(f);if(!r||g===null||g.length===0||s&&!u)s?h(null):l();else{const E=s?0:n,x=E*4;let T=d.clippingState||null;c.value=T,T=h(g,p,x,m);for(let I=0;I!==x;++I)T[I]=e[I];d.clippingState=T,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,m,g){const v=f!==null?f.length:0;let u=null;if(v!==0){if(u=c.value,g!==!0||u===null){const d=m+v*4,E=p.matrixWorldInverse;a.getNormalMatrix(E),(u===null||u.length<d)&&(u=new Float32Array(d));for(let x=0,T=m;x!==v;++x,T+=4)o.copy(f[x]).applyMatrix4(E,a),o.normal.toArray(u,T),u[T+3]=o.constant}c.value=u,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,u}}function Sp(i){let t=new WeakMap;function e(o,a){return a===co?o.mapping=Ei:a===lo&&(o.mapping=Ti),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===co||a===lo)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Lu(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",r),e(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class El extends Ml{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const mi=4,Ka=[.125,.215,.35,.446,.526,.582],Wn=20,Os=new El,$a=new Dt;let Bs=null,zs=0,ks=0,Gs=!1;const Hn=(1+Math.sqrt(5))/2,di=1/Hn,Ja=[new w(-Hn,di,0),new w(Hn,di,0),new w(-di,0,Hn),new w(di,0,Hn),new w(0,Hn,-di),new w(0,Hn,di),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)];class Za{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){Bs=this._renderer.getRenderTarget(),zs=this._renderer.getActiveCubeFace(),ks=this._renderer.getActiveMipmapLevel(),Gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Bs,zs,ks),this._renderer.xr.enabled=Gs,t.scissorTest=!1,Er(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ei||t.mapping===Ti?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Bs=this._renderer.getRenderTarget(),zs=this._renderer.getActiveCubeFace(),ks=this._renderer.getActiveMipmapLevel(),Gs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ke,minFilter:Ke,generateMipmaps:!1,type:ji,format:$e,colorSpace:Ln,depthBuffer:!1},r=ja(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ja(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yp(s)),this._blurMaterial=Ep(s,t,e)}return r}_compileMaterial(t){const e=new Gt(this._lodPlanes[0],t);this._renderer.compile(e,Os)}_sceneToCubeUV(t,e,n,r){const a=new Ue(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor($a),h.toneMapping=An,h.autoClear=!1;const m=new fn({name:"PMREM.Background",side:Te,depthWrite:!1,depthTest:!1}),g=new Gt(new pn,m);let v=!1;const u=t.background;u?u.isColor&&(m.color.copy(u),t.background=null,v=!0):(m.color.copy($a),v=!0);for(let d=0;d<6;d++){const E=d%3;E===0?(a.up.set(0,c[d],0),a.lookAt(l[d],0,0)):E===1?(a.up.set(0,0,c[d]),a.lookAt(0,l[d],0)):(a.up.set(0,c[d],0),a.lookAt(0,0,l[d]));const x=this._cubeSize;Er(r,E*x,d>2?x:0,x,x),h.setRenderTarget(r),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=u}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Ei||t.mapping===Ti;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qa());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Gt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const c=this._cubeSize;Er(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Os)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ja[(r-s-1)%Ja.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new Gt(this._lodPlanes[r],l),p=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Wn-1),v=s/g,u=isFinite(s)?1+Math.floor(h*v):Wn;u>Wn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${u} samples when the maximum is set to ${Wn}`);const d=[];let E=0;for(let b=0;b<Wn;++b){const P=b/v,V=Math.exp(-P*P/2);d.push(V),b===0?E+=V:b<u&&(E+=2*V)}for(let b=0;b<d.length;b++)d[b]=d[b]/E;p.envMap.value=t.texture,p.samples.value=u,p.weights.value=d,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:x}=this;p.dTheta.value=g,p.mipInt.value=x-n;const T=this._sizeLods[r],I=3*T*(r>x-mi?r-x+mi:0),R=4*(this._cubeSize-T);Er(e,I,R,3*T,2*T),c.setRenderTarget(e),c.render(f,Os)}}function yp(i){const t=[],e=[],n=[];let r=i;const s=i-mi+1+Ka.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let c=1/a;o>i-mi?c=Ka[o-i+mi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,f=1+l,p=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,g=6,v=3,u=2,d=1,E=new Float32Array(v*g*m),x=new Float32Array(u*g*m),T=new Float32Array(d*g*m);for(let R=0;R<m;R++){const b=R%3*2/3-1,P=R>2?0:-1,V=[b,P,0,b+2/3,P,0,b+2/3,P+1,0,b,P,0,b+2/3,P+1,0,b,P+1,0];E.set(V,v*g*R),x.set(p,u*g*R);const _=[R,R,R,R,R,R];T.set(_,d*g*R)}const I=new fe;I.setAttribute("position",new Fe(E,v)),I.setAttribute("uv",new Fe(x,u)),I.setAttribute("faceIndex",new Fe(T,d)),t.push(I),r>mi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ja(i,t,e){const n=new Jn(i,t,e);return n.texture.mapping=is,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Er(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Ep(i,t,e){const n=new Float32Array(Wn),r=new w(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:Wn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ra(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Qa(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ra(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function tc(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function ra(){return`

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
	`}function Tp(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===co||c===lo,h=c===Ei||c===Ti;if(l||h){let f=t.get(a);const p=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return e===null&&(e=new Za(i)),f=l?e.fromEquirectangular(a,f):e.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),f.texture;if(f!==void 0)return f.texture;{const m=a.image;return l&&m&&m.height>0||h&&m&&r(m)?(e===null&&(e=new Za(i)),f=l?e.fromEquirectangular(a):e.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function r(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Ap(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&Vr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function wp(i,t,e,n){const r={},s=new WeakMap;function o(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const g in p.attributes)t.remove(p.attributes[g]);for(const g in p.morphAttributes){const v=p.morphAttributes[g];for(let u=0,d=v.length;u<d;u++)t.remove(v[u])}p.removeEventListener("dispose",o),delete r[p.id];const m=s.get(p);m&&(t.remove(m),s.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function a(f,p){return r[p.id]===!0||(p.addEventListener("dispose",o),r[p.id]=!0,e.memory.geometries++),p}function c(f){const p=f.attributes;for(const g in p)t.update(p[g],i.ARRAY_BUFFER);const m=f.morphAttributes;for(const g in m){const v=m[g];for(let u=0,d=v.length;u<d;u++)t.update(v[u],i.ARRAY_BUFFER)}}function l(f){const p=[],m=f.index,g=f.attributes.position;let v=0;if(m!==null){const E=m.array;v=m.version;for(let x=0,T=E.length;x<T;x+=3){const I=E[x+0],R=E[x+1],b=E[x+2];p.push(I,R,R,b,b,I)}}else if(g!==void 0){const E=g.array;v=g.version;for(let x=0,T=E.length/3-1;x<T;x+=3){const I=x+0,R=x+1,b=x+2;p.push(I,R,R,b,b,I)}}else return;const u=new(dl(p)?vl:_l)(p,1);u.version=v;const d=s.get(f);d&&t.remove(d),s.set(f,u)}function h(f){const p=s.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&l(f)}else l(f);return s.get(f)}return{get:a,update:c,getWireframeAttribute:h}}function bp(i,t,e){let n;function r(p){n=p}let s,o;function a(p){s=p.type,o=p.bytesPerElement}function c(p,m){i.drawElements(n,m,s,p*o),e.update(m,n,1)}function l(p,m,g){g!==0&&(i.drawElementsInstanced(n,m,s,p*o,g),e.update(m,n,g))}function h(p,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,s,p,0,g);let u=0;for(let d=0;d<g;d++)u+=m[d];e.update(u,n,1)}function f(p,m,g,v){if(g===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<p.length;d++)l(p[d]/o,m[d],v[d]);else{u.multiDrawElementsInstancedWEBGL(n,m,0,s,p,0,v,0,g);let d=0;for(let E=0;E<g;E++)d+=m[E];for(let E=0;E<v.length;E++)e.update(d,n,v[E])}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Rp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Cp(i,t,e){const n=new WeakMap,r=new Zt;function s(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(a);if(p===void 0||p.count!==f){let _=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var m=_;p!==void 0&&p.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,u=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],E=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let T=0;g===!0&&(T=1),v===!0&&(T=2),u===!0&&(T=3);let I=a.attributes.position.count*T,R=1;I>t.maxTextureSize&&(R=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const b=new Float32Array(I*R*4*f),P=new ml(b,I,R,f);P.type=cn,P.needsUpdate=!0;const V=T*4;for(let y=0;y<f;y++){const B=d[y],z=E[y],W=x[y],$=I*R*4*y;for(let k=0;k<B.count;k++){const J=k*V;g===!0&&(r.fromBufferAttribute(B,k),b[$+J+0]=r.x,b[$+J+1]=r.y,b[$+J+2]=r.z,b[$+J+3]=0),v===!0&&(r.fromBufferAttribute(z,k),b[$+J+4]=r.x,b[$+J+5]=r.y,b[$+J+6]=r.z,b[$+J+7]=0),u===!0&&(r.fromBufferAttribute(W,k),b[$+J+8]=r.x,b[$+J+9]=r.y,b[$+J+10]=r.z,b[$+J+11]=W.itemSize===4?r.w:1)}}p={count:f,texture:P,size:new St(I,R)},n.set(a,p),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let u=0;u<l.length;u++)g+=l[u];const v=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:s}}function Pp(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(r.get(f)!==l&&(t.update(f),r.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;r.get(p)!==l&&(p.update(),r.set(p,l))}return f}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class Tl extends Re{constructor(t,e,n,r,s,o,a,c,l,h=_i){if(h!==_i&&h!==wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===_i&&(n=$n),n===void 0&&h===wi&&(n=Ai),super(null,r,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ge,this.minFilter=c!==void 0?c:Ge,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Al=new Re,ec=new Tl(1,1),wl=new ml,bl=new mu,Rl=new Sl,nc=[],ic=[],rc=new Float32Array(16),sc=new Float32Array(9),oc=new Float32Array(4);function Pi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=nc[r];if(s===void 0&&(s=new Float32Array(r),nc[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function le(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function he(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function os(i,t){let e=ic[t];e===void 0&&(e=new Int32Array(t),ic[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Lp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ip(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(le(e,t))return;i.uniform2fv(this.addr,t),he(e,t)}}function Dp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(le(e,t))return;i.uniform3fv(this.addr,t),he(e,t)}}function Up(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(le(e,t))return;i.uniform4fv(this.addr,t),he(e,t)}}function Np(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(le(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),he(e,t)}else{if(le(e,n))return;oc.set(n),i.uniformMatrix2fv(this.addr,!1,oc),he(e,n)}}function Fp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(le(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),he(e,t)}else{if(le(e,n))return;sc.set(n),i.uniformMatrix3fv(this.addr,!1,sc),he(e,n)}}function Op(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(le(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),he(e,t)}else{if(le(e,n))return;rc.set(n),i.uniformMatrix4fv(this.addr,!1,rc),he(e,n)}}function Bp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function zp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(le(e,t))return;i.uniform2iv(this.addr,t),he(e,t)}}function kp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(le(e,t))return;i.uniform3iv(this.addr,t),he(e,t)}}function Gp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(le(e,t))return;i.uniform4iv(this.addr,t),he(e,t)}}function Hp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Vp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(le(e,t))return;i.uniform2uiv(this.addr,t),he(e,t)}}function Wp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(le(e,t))return;i.uniform3uiv(this.addr,t),he(e,t)}}function Xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(le(e,t))return;i.uniform4uiv(this.addr,t),he(e,t)}}function qp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(ec.compareFunction=fl,s=ec):s=Al,e.setTexture2D(t||s,r)}function Yp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||bl,r)}function Kp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Rl,r)}function $p(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||wl,r)}function Jp(i){switch(i){case 5126:return Lp;case 35664:return Ip;case 35665:return Dp;case 35666:return Up;case 35674:return Np;case 35675:return Fp;case 35676:return Op;case 5124:case 35670:return Bp;case 35667:case 35671:return zp;case 35668:case 35672:return kp;case 35669:case 35673:return Gp;case 5125:return Hp;case 36294:return Vp;case 36295:return Wp;case 36296:return Xp;case 35678:case 36198:case 36298:case 36306:case 35682:return qp;case 35679:case 36299:case 36307:return Yp;case 35680:case 36300:case 36308:case 36293:return Kp;case 36289:case 36303:case 36311:case 36292:return $p}}function Zp(i,t){i.uniform1fv(this.addr,t)}function jp(i,t){const e=Pi(t,this.size,2);i.uniform2fv(this.addr,e)}function Qp(i,t){const e=Pi(t,this.size,3);i.uniform3fv(this.addr,e)}function tm(i,t){const e=Pi(t,this.size,4);i.uniform4fv(this.addr,e)}function em(i,t){const e=Pi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function nm(i,t){const e=Pi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function im(i,t){const e=Pi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function rm(i,t){i.uniform1iv(this.addr,t)}function sm(i,t){i.uniform2iv(this.addr,t)}function om(i,t){i.uniform3iv(this.addr,t)}function am(i,t){i.uniform4iv(this.addr,t)}function cm(i,t){i.uniform1uiv(this.addr,t)}function lm(i,t){i.uniform2uiv(this.addr,t)}function hm(i,t){i.uniform3uiv(this.addr,t)}function um(i,t){i.uniform4uiv(this.addr,t)}function fm(i,t,e){const n=this.cache,r=t.length,s=os(e,r);le(n,s)||(i.uniform1iv(this.addr,s),he(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Al,s[o])}function dm(i,t,e){const n=this.cache,r=t.length,s=os(e,r);le(n,s)||(i.uniform1iv(this.addr,s),he(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||bl,s[o])}function pm(i,t,e){const n=this.cache,r=t.length,s=os(e,r);le(n,s)||(i.uniform1iv(this.addr,s),he(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Rl,s[o])}function mm(i,t,e){const n=this.cache,r=t.length,s=os(e,r);le(n,s)||(i.uniform1iv(this.addr,s),he(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||wl,s[o])}function gm(i){switch(i){case 5126:return Zp;case 35664:return jp;case 35665:return Qp;case 35666:return tm;case 35674:return em;case 35675:return nm;case 35676:return im;case 5124:case 35670:return rm;case 35667:case 35671:return sm;case 35668:case 35672:return om;case 35669:case 35673:return am;case 5125:return cm;case 36294:return lm;case 36295:return hm;case 36296:return um;case 35678:case 36198:case 36298:case 36306:case 35682:return fm;case 35679:case 36299:case 36307:return dm;case 35680:case 36300:case 36308:case 36293:return pm;case 36289:case 36303:case 36311:case 36292:return mm}}class _m{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Jp(e.type)}}class vm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=gm(e.type)}}class xm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const Hs=/(\w+)(\])?(\[|\.)?/g;function ac(i,t){i.seq.push(t),i.map[t.id]=t}function Mm(i,t,e){const n=i.name,r=n.length;for(Hs.lastIndex=0;;){const s=Hs.exec(n),o=Hs.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){ac(e,l===void 0?new _m(a,i,t):new vm(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new xm(a),ac(e,f)),e=f}}}class Wr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Mm(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function cc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Sm=37297;let ym=0;function Em(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Tm(i){const t=qt.getPrimaries(qt.workingColorSpace),e=qt.getPrimaries(i);let n;switch(t===e?n="":t===$r&&e===Kr?n="LinearDisplayP3ToLinearSRGB":t===Kr&&e===$r&&(n="LinearSRGBToLinearDisplayP3"),i){case Ln:case rs:return[n,"LinearTransferOETF"];case Ze:case ta:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function lc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+Em(i.getShaderSource(t),o)}else return r}function Am(i,t){const e=Tm(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function wm(i,t){let e;switch(t){case wh:e="Linear";break;case bh:e="Reinhard";break;case Rh:e="Cineon";break;case Ch:e="ACESFilmic";break;case Lh:e="AgX";break;case Ih:e="Neutral";break;case Ph:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Tr=new w;function bm(){qt.getLuminanceCoefficients(Tr);const i=Tr.x.toFixed(4),t=Tr.y.toFixed(4),e=Tr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hi).join(`
`)}function Cm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Pm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Hi(i){return i!==""}function hc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function uc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Lm=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(i){return i.replace(Lm,Dm)}const Im=new Map;function Dm(i,t){let e=Lt[t];if(e===void 0){const n=Im.get(t);if(n!==void 0)e=Lt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return zo(e)}const Um=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fc(i){return i.replace(Um,Nm)}function Nm(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function dc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Fm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===jc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===sh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===an&&(t="SHADOWMAP_TYPE_VSM"),t}function Om(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ei:case Ti:t="ENVMAP_TYPE_CUBE";break;case is:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Bm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ti:t="ENVMAP_MODE_REFRACTION";break}return t}function zm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Qc:t="ENVMAP_BLENDING_MULTIPLY";break;case Th:t="ENVMAP_BLENDING_MIX";break;case Ah:t="ENVMAP_BLENDING_ADD";break}return t}function km(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Gm(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Fm(e),l=Om(e),h=Bm(e),f=zm(e),p=km(e),m=Rm(e),g=Cm(s),v=r.createProgram();let u,d,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Hi).join(`
`),u.length>0&&(u+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Hi).join(`
`),d.length>0&&(d+=`
`)):(u=[dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hi).join(`
`),d=[dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==An?"#define TONE_MAPPING":"",e.toneMapping!==An?Lt.tonemapping_pars_fragment:"",e.toneMapping!==An?wm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Lt.colorspace_pars_fragment,Am("linearToOutputTexel",e.outputColorSpace),bm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hi).join(`
`)),o=zo(o),o=hc(o,e),o=uc(o,e),a=zo(a),a=hc(a,e),a=uc(a,e),o=fc(o),a=fc(a),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,u=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,d=["#define varying in",e.glslVersion===Ca?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ca?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const x=E+u+o,T=E+d+a,I=cc(r,r.VERTEX_SHADER,x),R=cc(r,r.FRAGMENT_SHADER,T);r.attachShader(v,I),r.attachShader(v,R),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function b(y){if(i.debug.checkShaderErrors){const B=r.getProgramInfoLog(v).trim(),z=r.getShaderInfoLog(I).trim(),W=r.getShaderInfoLog(R).trim();let $=!0,k=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,I,R);else{const J=lc(r,I,"vertex"),H=lc(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+y.name+`
Material Type: `+y.type+`

Program Info Log: `+B+`
`+J+`
`+H)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(z===""||W==="")&&(k=!1);k&&(y.diagnostics={runnable:$,programLog:B,vertexShader:{log:z,prefix:u},fragmentShader:{log:W,prefix:d}})}r.deleteShader(I),r.deleteShader(R),P=new Wr(r,v),V=Pm(r,v)}let P;this.getUniforms=function(){return P===void 0&&b(this),P};let V;this.getAttributes=function(){return V===void 0&&b(this),V};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(v,Sm)),_},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ym++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=R,this}let Hm=0;class Vm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Wm(t),e.set(t,n)),n}}class Wm{constructor(t){this.id=Hm++,this.code=t,this.usedTimes=0}}function Xm(i,t,e,n,r,s,o){const a=new na,c=new Vm,l=new Set,h=[],f=r.logarithmicDepthBuffer,p=r.reverseDepthBuffer,m=r.vertexTextures;let g=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function u(_){return l.add(_),_===0?"uv":`uv${_}`}function d(_,y,B,z,W){const $=z.fog,k=W.geometry,J=_.isMeshStandardMaterial?z.environment:null,H=(_.isMeshStandardMaterial?e:t).get(_.envMap||J),ct=H&&H.mapping===is?H.image.height:null,lt=v[_.type];_.precision!==null&&(g=r.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const _t=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Ht=_t!==void 0?_t.length:0;let Kt=0;k.morphAttributes.position!==void 0&&(Kt=1),k.morphAttributes.normal!==void 0&&(Kt=2),k.morphAttributes.color!==void 0&&(Kt=3);let X,Q,mt,ht;if(lt){const we=je[lt];X=we.vertexShader,Q=we.fragmentShader}else X=_.vertexShader,Q=_.fragmentShader,c.update(_),mt=c.getVertexShaderID(_),ht=c.getFragmentShaderID(_);const Ct=i.getRenderTarget(),Et=W.isInstancedMesh===!0,Ft=W.isBatchedMesh===!0,Jt=!!_.map,Ot=!!_.matcap,C=!!H,Ce=!!_.aoMap,Ut=!!_.lightMap,zt=!!_.bumpMap,At=!!_.normalMap,te=!!_.displacementMap,Rt=!!_.emissiveMap,A=!!_.metalnessMap,M=!!_.roughnessMap,N=_.anisotropy>0,Y=_.clearcoat>0,Z=_.dispersion>0,q=_.iridescence>0,vt=_.sheen>0,it=_.transmission>0,ut=N&&!!_.anisotropyMap,kt=Y&&!!_.clearcoatMap,tt=Y&&!!_.clearcoatNormalMap,ft=Y&&!!_.clearcoatRoughnessMap,wt=q&&!!_.iridescenceMap,bt=q&&!!_.iridescenceThicknessMap,dt=vt&&!!_.sheenColorMap,Nt=vt&&!!_.sheenRoughnessMap,Pt=!!_.specularMap,jt=!!_.specularColorMap,L=!!_.specularIntensityMap,ot=it&&!!_.transmissionMap,G=it&&!!_.thicknessMap,K=!!_.gradientMap,rt=!!_.alphaMap,at=_.alphaTest>0,Bt=!!_.alphaHash,se=!!_.extensions;let Ae=An;_.toneMapped&&(Ct===null||Ct.isXRRenderTarget===!0)&&(Ae=i.toneMapping);const Vt={shaderID:lt,shaderType:_.type,shaderName:_.name,vertexShader:X,fragmentShader:Q,defines:_.defines,customVertexShaderID:mt,customFragmentShaderID:ht,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ft,batchingColor:Ft&&W._colorsTexture!==null,instancing:Et,instancingColor:Et&&W.instanceColor!==null,instancingMorph:Et&&W.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:Ct===null?i.outputColorSpace:Ct.isXRRenderTarget===!0?Ct.texture.colorSpace:Ln,alphaToCoverage:!!_.alphaToCoverage,map:Jt,matcap:Ot,envMap:C,envMapMode:C&&H.mapping,envMapCubeUVHeight:ct,aoMap:Ce,lightMap:Ut,bumpMap:zt,normalMap:At,displacementMap:m&&te,emissiveMap:Rt,normalMapObjectSpace:At&&_.normalMapType===Fh,normalMapTangentSpace:At&&_.normalMapType===ul,metalnessMap:A,roughnessMap:M,anisotropy:N,anisotropyMap:ut,clearcoat:Y,clearcoatMap:kt,clearcoatNormalMap:tt,clearcoatRoughnessMap:ft,dispersion:Z,iridescence:q,iridescenceMap:wt,iridescenceThicknessMap:bt,sheen:vt,sheenColorMap:dt,sheenRoughnessMap:Nt,specularMap:Pt,specularColorMap:jt,specularIntensityMap:L,transmission:it,transmissionMap:ot,thicknessMap:G,gradientMap:K,opaque:_.transparent===!1&&_.blending===gi&&_.alphaToCoverage===!1,alphaMap:rt,alphaTest:at,alphaHash:Bt,combine:_.combine,mapUv:Jt&&u(_.map.channel),aoMapUv:Ce&&u(_.aoMap.channel),lightMapUv:Ut&&u(_.lightMap.channel),bumpMapUv:zt&&u(_.bumpMap.channel),normalMapUv:At&&u(_.normalMap.channel),displacementMapUv:te&&u(_.displacementMap.channel),emissiveMapUv:Rt&&u(_.emissiveMap.channel),metalnessMapUv:A&&u(_.metalnessMap.channel),roughnessMapUv:M&&u(_.roughnessMap.channel),anisotropyMapUv:ut&&u(_.anisotropyMap.channel),clearcoatMapUv:kt&&u(_.clearcoatMap.channel),clearcoatNormalMapUv:tt&&u(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ft&&u(_.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&u(_.iridescenceMap.channel),iridescenceThicknessMapUv:bt&&u(_.iridescenceThicknessMap.channel),sheenColorMapUv:dt&&u(_.sheenColorMap.channel),sheenRoughnessMapUv:Nt&&u(_.sheenRoughnessMap.channel),specularMapUv:Pt&&u(_.specularMap.channel),specularColorMapUv:jt&&u(_.specularColorMap.channel),specularIntensityMapUv:L&&u(_.specularIntensityMap.channel),transmissionMapUv:ot&&u(_.transmissionMap.channel),thicknessMapUv:G&&u(_.thicknessMap.channel),alphaMapUv:rt&&u(_.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(At||N),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!k.attributes.uv&&(Jt||rt),fog:!!$,useFog:_.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:p,skinning:W.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Ht,morphTextureStride:Kt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ae,decodeVideoTexture:Jt&&_.map.isVideoTexture===!0&&qt.getTransfer(_.map.colorSpace)===ne,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ye,flipSided:_.side===Te,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||Ft)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Vt.vertexUv1s=l.has(1),Vt.vertexUv2s=l.has(2),Vt.vertexUv3s=l.has(3),l.clear(),Vt}function E(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const B in _.defines)y.push(B),y.push(_.defines[B]);return _.isRawShaderMaterial===!1&&(x(y,_),T(y,_),y.push(i.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function x(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapCubeUVHeight),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.morphAttributeCount),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function T(_,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.alphaToCoverage&&a.enable(20),_.push(a.mask)}function I(_){const y=v[_.type];let B;if(y){const z=je[y];B=bu.clone(z.uniforms)}else B=_.uniforms;return B}function R(_,y){let B;for(let z=0,W=h.length;z<W;z++){const $=h[z];if($.cacheKey===y){B=$,++B.usedTimes;break}}return B===void 0&&(B=new Gm(i,y,_,s),h.push(B)),B}function b(_){if(--_.usedTimes===0){const y=h.indexOf(_);h[y]=h[h.length-1],h.pop(),_.destroy()}}function P(_){c.remove(_)}function V(){c.dispose()}return{getParameters:d,getProgramCacheKey:E,getUniforms:I,acquireProgram:R,releaseProgram:b,releaseShaderCache:P,programs:h,dispose:V}}function qm(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Ym(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function pc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function mc(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(f,p,m,g,v,u){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:p,material:m,groupOrder:g,renderOrder:f.renderOrder,z:v,group:u},i[t]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=m,d.groupOrder=g,d.renderOrder=f.renderOrder,d.z=v,d.group=u),t++,d}function a(f,p,m,g,v,u){const d=o(f,p,m,g,v,u);m.transmission>0?n.push(d):m.transparent===!0?r.push(d):e.push(d)}function c(f,p,m,g,v,u){const d=o(f,p,m,g,v,u);m.transmission>0?n.unshift(d):m.transparent===!0?r.unshift(d):e.unshift(d)}function l(f,p){e.length>1&&e.sort(f||Ym),n.length>1&&n.sort(p||pc),r.length>1&&r.sort(p||pc)}function h(){for(let f=t,p=i.length;f<p;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:h,sort:l}}function Km(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new mc,i.set(n,[o])):r>=s.length?(o=new mc,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function $m(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new w,color:new Dt};break;case"SpotLight":e={position:new w,direction:new w,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new w,halfWidth:new w,halfHeight:new w};break}return i[t.id]=e,e}}}function Jm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Zm=0;function jm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Qm(i){const t=new $m,e=Jm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new w);const r=new w,s=new Yt,o=new Yt;function a(l){let h=0,f=0,p=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let m=0,g=0,v=0,u=0,d=0,E=0,x=0,T=0,I=0,R=0,b=0;l.sort(jm);for(let V=0,_=l.length;V<_;V++){const y=l[V],B=y.color,z=y.intensity,W=y.distance,$=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)h+=B.r*z,f+=B.g*z,p+=B.b*z;else if(y.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(y.sh.coefficients[k],z);b++}else if(y.isDirectionalLight){const k=t.get(y);if(k.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){const J=y.shadow,H=e.get(y);H.shadowIntensity=J.intensity,H.shadowBias=J.bias,H.shadowNormalBias=J.normalBias,H.shadowRadius=J.radius,H.shadowMapSize=J.mapSize,n.directionalShadow[m]=H,n.directionalShadowMap[m]=$,n.directionalShadowMatrix[m]=y.shadow.matrix,E++}n.directional[m]=k,m++}else if(y.isSpotLight){const k=t.get(y);k.position.setFromMatrixPosition(y.matrixWorld),k.color.copy(B).multiplyScalar(z),k.distance=W,k.coneCos=Math.cos(y.angle),k.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),k.decay=y.decay,n.spot[v]=k;const J=y.shadow;if(y.map&&(n.spotLightMap[I]=y.map,I++,J.updateMatrices(y),y.castShadow&&R++),n.spotLightMatrix[v]=J.matrix,y.castShadow){const H=e.get(y);H.shadowIntensity=J.intensity,H.shadowBias=J.bias,H.shadowNormalBias=J.normalBias,H.shadowRadius=J.radius,H.shadowMapSize=J.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=$,T++}v++}else if(y.isRectAreaLight){const k=t.get(y);k.color.copy(B).multiplyScalar(z),k.halfWidth.set(y.width*.5,0,0),k.halfHeight.set(0,y.height*.5,0),n.rectArea[u]=k,u++}else if(y.isPointLight){const k=t.get(y);if(k.color.copy(y.color).multiplyScalar(y.intensity),k.distance=y.distance,k.decay=y.decay,y.castShadow){const J=y.shadow,H=e.get(y);H.shadowIntensity=J.intensity,H.shadowBias=J.bias,H.shadowNormalBias=J.normalBias,H.shadowRadius=J.radius,H.shadowMapSize=J.mapSize,H.shadowCameraNear=J.camera.near,H.shadowCameraFar=J.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=$,n.pointShadowMatrix[g]=y.shadow.matrix,x++}n.point[g]=k,g++}else if(y.isHemisphereLight){const k=t.get(y);k.skyColor.copy(y.color).multiplyScalar(z),k.groundColor.copy(y.groundColor).multiplyScalar(z),n.hemi[d]=k,d++}}u>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=nt.LTC_FLOAT_1,n.rectAreaLTC2=nt.LTC_FLOAT_2):(n.rectAreaLTC1=nt.LTC_HALF_1,n.rectAreaLTC2=nt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const P=n.hash;(P.directionalLength!==m||P.pointLength!==g||P.spotLength!==v||P.rectAreaLength!==u||P.hemiLength!==d||P.numDirectionalShadows!==E||P.numPointShadows!==x||P.numSpotShadows!==T||P.numSpotMaps!==I||P.numLightProbes!==b)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=u,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=T+I-R,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=b,P.directionalLength=m,P.pointLength=g,P.spotLength=v,P.rectAreaLength=u,P.hemiLength=d,P.numDirectionalShadows=E,P.numPointShadows=x,P.numSpotShadows=T,P.numSpotMaps=I,P.numLightProbes=b,n.version=Zm++)}function c(l,h){let f=0,p=0,m=0,g=0,v=0;const u=h.matrixWorldInverse;for(let d=0,E=l.length;d<E;d++){const x=l[d];if(x.isDirectionalLight){const T=n.directional[f];T.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(u),f++}else if(x.isSpotLight){const T=n.spot[m];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(u),T.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(u),m++}else if(x.isRectAreaLight){const T=n.rectArea[g];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(u),o.identity(),s.copy(x.matrixWorld),s.premultiply(u),o.extractRotation(s),T.halfWidth.set(x.width*.5,0,0),T.halfHeight.set(0,x.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const T=n.point[p];T.position.setFromMatrixPosition(x.matrixWorld),T.position.applyMatrix4(u),p++}else if(x.isHemisphereLight){const T=n.hemi[v];T.direction.setFromMatrixPosition(x.matrixWorld),T.direction.transformDirection(u),v++}}}return{setup:a,setupView:c,state:n}}function gc(i){const t=new Qm(i),e=[],n=[];function r(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function tg(i){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new gc(i),t.set(r,[a])):s>=o.length?(a=new gc(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class eg extends Zn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Uh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ng extends Zn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const ig=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rg=`uniform sampler2D shadow_pass;
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
}`;function sg(i,t,e){let n=new ia;const r=new St,s=new St,o=new Zt,a=new eg({depthPacking:Nh}),c=new ng,l={},h=e.maxTextureSize,f={[wn]:Te,[Te]:wn,[Ye]:Ye},p=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:ig,fragmentShader:rg}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new fe;g.setAttribute("position",new Fe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Gt(g,p),u=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=jc;let d=this.type;this.render=function(R,b,P){if(u.enabled===!1||u.autoUpdate===!1&&u.needsUpdate===!1||R.length===0)return;const V=i.getRenderTarget(),_=i.getActiveCubeFace(),y=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Tn),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const z=d!==an&&this.type===an,W=d===an&&this.type!==an;for(let $=0,k=R.length;$<k;$++){const J=R[$],H=J.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const ct=H.getFrameExtents();if(r.multiply(ct),s.copy(H.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/ct.x),r.x=s.x*ct.x,H.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/ct.y),r.y=s.y*ct.y,H.mapSize.y=s.y)),H.map===null||z===!0||W===!0){const _t=this.type!==an?{minFilter:Ge,magFilter:Ge}:{};H.map!==null&&H.map.dispose(),H.map=new Jn(r.x,r.y,_t),H.map.texture.name=J.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const lt=H.getViewportCount();for(let _t=0;_t<lt;_t++){const Ht=H.getViewport(_t);o.set(s.x*Ht.x,s.y*Ht.y,s.x*Ht.z,s.y*Ht.w),B.viewport(o),H.updateMatrices(J,_t),n=H.getFrustum(),T(b,P,H.camera,J,this.type)}H.isPointLightShadow!==!0&&this.type===an&&E(H,P),H.needsUpdate=!1}d=this.type,u.needsUpdate=!1,i.setRenderTarget(V,_,y)};function E(R,b){const P=t.update(v);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Jn(r.x,r.y)),p.uniforms.shadow_pass.value=R.map.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(b,null,P,p,v,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(b,null,P,m,v,null)}function x(R,b,P,V){let _=null;const y=P.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(y!==void 0)_=y;else if(_=P.isPointLight===!0?c:a,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const B=_.uuid,z=b.uuid;let W=l[B];W===void 0&&(W={},l[B]=W);let $=W[z];$===void 0&&($=_.clone(),W[z]=$,b.addEventListener("dispose",I)),_=$}if(_.visible=b.visible,_.wireframe=b.wireframe,V===an?_.side=b.shadowSide!==null?b.shadowSide:b.side:_.side=b.shadowSide!==null?b.shadowSide:f[b.side],_.alphaMap=b.alphaMap,_.alphaTest=b.alphaTest,_.map=b.map,_.clipShadows=b.clipShadows,_.clippingPlanes=b.clippingPlanes,_.clipIntersection=b.clipIntersection,_.displacementMap=b.displacementMap,_.displacementScale=b.displacementScale,_.displacementBias=b.displacementBias,_.wireframeLinewidth=b.wireframeLinewidth,_.linewidth=b.linewidth,P.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const B=i.properties.get(_);B.light=P}return _}function T(R,b,P,V,_){if(R.visible===!1)return;if(R.layers.test(b.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&_===an)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,R.matrixWorld);const z=t.update(R),W=R.material;if(Array.isArray(W)){const $=z.groups;for(let k=0,J=$.length;k<J;k++){const H=$[k],ct=W[H.materialIndex];if(ct&&ct.visible){const lt=x(R,ct,V,_);R.onBeforeShadow(i,R,b,P,z,lt,H),i.renderBufferDirect(P,null,z,lt,R,H),R.onAfterShadow(i,R,b,P,z,lt,H)}}}else if(W.visible){const $=x(R,W,V,_);R.onBeforeShadow(i,R,b,P,z,$,null),i.renderBufferDirect(P,null,z,$,R,null),R.onAfterShadow(i,R,b,P,z,$,null)}}const B=R.children;for(let z=0,W=B.length;z<W;z++)T(B[z],b,P,V,_)}function I(R){R.target.removeEventListener("dispose",I);for(const P in l){const V=l[P],_=R.target.uuid;_ in V&&(V[_].dispose(),delete V[_])}}}const og={[eo]:no,[io]:oo,[ro]:ao,[yi]:so,[no]:eo,[oo]:io,[ao]:ro,[so]:yi};function ag(i){function t(){let L=!1;const ot=new Zt;let G=null;const K=new Zt(0,0,0,0);return{setMask:function(rt){G!==rt&&!L&&(i.colorMask(rt,rt,rt,rt),G=rt)},setLocked:function(rt){L=rt},setClear:function(rt,at,Bt,se,Ae){Ae===!0&&(rt*=se,at*=se,Bt*=se),ot.set(rt,at,Bt,se),K.equals(ot)===!1&&(i.clearColor(rt,at,Bt,se),K.copy(ot))},reset:function(){L=!1,G=null,K.set(-1,0,0,0)}}}function e(){let L=!1,ot=!1,G=null,K=null,rt=null;return{setReversed:function(at){ot=at},setTest:function(at){at?mt(i.DEPTH_TEST):ht(i.DEPTH_TEST)},setMask:function(at){G!==at&&!L&&(i.depthMask(at),G=at)},setFunc:function(at){if(ot&&(at=og[at]),K!==at){switch(at){case eo:i.depthFunc(i.NEVER);break;case no:i.depthFunc(i.ALWAYS);break;case io:i.depthFunc(i.LESS);break;case yi:i.depthFunc(i.LEQUAL);break;case ro:i.depthFunc(i.EQUAL);break;case so:i.depthFunc(i.GEQUAL);break;case oo:i.depthFunc(i.GREATER);break;case ao:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=at}},setLocked:function(at){L=at},setClear:function(at){rt!==at&&(i.clearDepth(at),rt=at)},reset:function(){L=!1,G=null,K=null,rt=null}}}function n(){let L=!1,ot=null,G=null,K=null,rt=null,at=null,Bt=null,se=null,Ae=null;return{setTest:function(Vt){L||(Vt?mt(i.STENCIL_TEST):ht(i.STENCIL_TEST))},setMask:function(Vt){ot!==Vt&&!L&&(i.stencilMask(Vt),ot=Vt)},setFunc:function(Vt,we,tn){(G!==Vt||K!==we||rt!==tn)&&(i.stencilFunc(Vt,we,tn),G=Vt,K=we,rt=tn)},setOp:function(Vt,we,tn){(at!==Vt||Bt!==we||se!==tn)&&(i.stencilOp(Vt,we,tn),at=Vt,Bt=we,se=tn)},setLocked:function(Vt){L=Vt},setClear:function(Vt){Ae!==Vt&&(i.clearStencil(Vt),Ae=Vt)},reset:function(){L=!1,ot=null,G=null,K=null,rt=null,at=null,Bt=null,se=null,Ae=null}}}const r=new t,s=new e,o=new n,a=new WeakMap,c=new WeakMap;let l={},h={},f=new WeakMap,p=[],m=null,g=!1,v=null,u=null,d=null,E=null,x=null,T=null,I=null,R=new Dt(0,0,0),b=0,P=!1,V=null,_=null,y=null,B=null,z=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,k=0;const J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(J)[1]),$=k>=1):J.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),$=k>=2);let H=null,ct={};const lt=i.getParameter(i.SCISSOR_BOX),_t=i.getParameter(i.VIEWPORT),Ht=new Zt().fromArray(lt),Kt=new Zt().fromArray(_t);function X(L,ot,G,K){const rt=new Uint8Array(4),at=i.createTexture();i.bindTexture(L,at),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<G;Bt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ot,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,rt):i.texImage2D(ot+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,rt);return at}const Q={};Q[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),mt(i.DEPTH_TEST),s.setFunc(yi),Ut(!1),zt(Ta),mt(i.CULL_FACE),C(Tn);function mt(L){l[L]!==!0&&(i.enable(L),l[L]=!0)}function ht(L){l[L]!==!1&&(i.disable(L),l[L]=!1)}function Ct(L,ot){return h[L]!==ot?(i.bindFramebuffer(L,ot),h[L]=ot,L===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ot),L===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ot),!0):!1}function Et(L,ot){let G=p,K=!1;if(L){G=f.get(ot),G===void 0&&(G=[],f.set(ot,G));const rt=L.textures;if(G.length!==rt.length||G[0]!==i.COLOR_ATTACHMENT0){for(let at=0,Bt=rt.length;at<Bt;at++)G[at]=i.COLOR_ATTACHMENT0+at;G.length=rt.length,K=!0}}else G[0]!==i.BACK&&(G[0]=i.BACK,K=!0);K&&i.drawBuffers(G)}function Ft(L){return m!==L?(i.useProgram(L),m=L,!0):!1}const Jt={[Vn]:i.FUNC_ADD,[ah]:i.FUNC_SUBTRACT,[ch]:i.FUNC_REVERSE_SUBTRACT};Jt[lh]=i.MIN,Jt[hh]=i.MAX;const Ot={[uh]:i.ZERO,[fh]:i.ONE,[dh]:i.SRC_COLOR,[Qs]:i.SRC_ALPHA,[xh]:i.SRC_ALPHA_SATURATE,[_h]:i.DST_COLOR,[mh]:i.DST_ALPHA,[ph]:i.ONE_MINUS_SRC_COLOR,[to]:i.ONE_MINUS_SRC_ALPHA,[vh]:i.ONE_MINUS_DST_COLOR,[gh]:i.ONE_MINUS_DST_ALPHA,[Mh]:i.CONSTANT_COLOR,[Sh]:i.ONE_MINUS_CONSTANT_COLOR,[yh]:i.CONSTANT_ALPHA,[Eh]:i.ONE_MINUS_CONSTANT_ALPHA};function C(L,ot,G,K,rt,at,Bt,se,Ae,Vt){if(L===Tn){g===!0&&(ht(i.BLEND),g=!1);return}if(g===!1&&(mt(i.BLEND),g=!0),L!==oh){if(L!==v||Vt!==P){if((u!==Vn||x!==Vn)&&(i.blendEquation(i.FUNC_ADD),u=Vn,x=Vn),Vt)switch(L){case gi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Yi:i.blendFunc(i.ONE,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Yi:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}d=null,E=null,T=null,I=null,R.set(0,0,0),b=0,v=L,P=Vt}return}rt=rt||ot,at=at||G,Bt=Bt||K,(ot!==u||rt!==x)&&(i.blendEquationSeparate(Jt[ot],Jt[rt]),u=ot,x=rt),(G!==d||K!==E||at!==T||Bt!==I)&&(i.blendFuncSeparate(Ot[G],Ot[K],Ot[at],Ot[Bt]),d=G,E=K,T=at,I=Bt),(se.equals(R)===!1||Ae!==b)&&(i.blendColor(se.r,se.g,se.b,Ae),R.copy(se),b=Ae),v=L,P=!1}function Ce(L,ot){L.side===Ye?ht(i.CULL_FACE):mt(i.CULL_FACE);let G=L.side===Te;ot&&(G=!G),Ut(G),L.blending===gi&&L.transparent===!1?C(Tn):C(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),s.setFunc(L.depthFunc),s.setTest(L.depthTest),s.setMask(L.depthWrite),r.setMask(L.colorWrite);const K=L.stencilWrite;o.setTest(K),K&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),te(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?mt(i.SAMPLE_ALPHA_TO_COVERAGE):ht(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ut(L){V!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),V=L)}function zt(L){L!==ih?(mt(i.CULL_FACE),L!==_&&(L===Ta?i.cullFace(i.BACK):L===rh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ht(i.CULL_FACE),_=L}function At(L){L!==y&&($&&i.lineWidth(L),y=L)}function te(L,ot,G){L?(mt(i.POLYGON_OFFSET_FILL),(B!==ot||z!==G)&&(i.polygonOffset(ot,G),B=ot,z=G)):ht(i.POLYGON_OFFSET_FILL)}function Rt(L){L?mt(i.SCISSOR_TEST):ht(i.SCISSOR_TEST)}function A(L){L===void 0&&(L=i.TEXTURE0+W-1),H!==L&&(i.activeTexture(L),H=L)}function M(L,ot,G){G===void 0&&(H===null?G=i.TEXTURE0+W-1:G=H);let K=ct[G];K===void 0&&(K={type:void 0,texture:void 0},ct[G]=K),(K.type!==L||K.texture!==ot)&&(H!==G&&(i.activeTexture(G),H=G),i.bindTexture(L,ot||Q[L]),K.type=L,K.texture=ot)}function N(){const L=ct[H];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Y(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function vt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function it(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ut(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function kt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function tt(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ft(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function wt(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function bt(L){Ht.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),Ht.copy(L))}function dt(L){Kt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Kt.copy(L))}function Nt(L,ot){let G=c.get(ot);G===void 0&&(G=new WeakMap,c.set(ot,G));let K=G.get(L);K===void 0&&(K=i.getUniformBlockIndex(ot,L.name),G.set(L,K))}function Pt(L,ot){const K=c.get(ot).get(L);a.get(ot)!==K&&(i.uniformBlockBinding(ot,K,L.__bindingPointIndex),a.set(ot,K))}function jt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},H=null,ct={},h={},f=new WeakMap,p=[],m=null,g=!1,v=null,u=null,d=null,E=null,x=null,T=null,I=null,R=new Dt(0,0,0),b=0,P=!1,V=null,_=null,y=null,B=null,z=null,Ht.set(0,0,i.canvas.width,i.canvas.height),Kt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:mt,disable:ht,bindFramebuffer:Ct,drawBuffers:Et,useProgram:Ft,setBlending:C,setMaterial:Ce,setFlipSided:Ut,setCullFace:zt,setLineWidth:At,setPolygonOffset:te,setScissorTest:Rt,activeTexture:A,bindTexture:M,unbindTexture:N,compressedTexImage2D:Y,compressedTexImage3D:Z,texImage2D:ft,texImage3D:wt,updateUBOMapping:Nt,uniformBlockBinding:Pt,texStorage2D:kt,texStorage3D:tt,texSubImage2D:q,texSubImage3D:vt,compressedTexSubImage2D:it,compressedTexSubImage3D:ut,scissor:bt,viewport:dt,reset:jt}}function _c(i,t,e,n){const r=cg(n);switch(e){case rl:return i*t;case ol:return i*t;case al:return i*t*2;case cl:return i*t/r.components*r.byteLength;case Zo:return i*t/r.components*r.byteLength;case ll:return i*t*2/r.components*r.byteLength;case jo:return i*t*2/r.components*r.byteLength;case sl:return i*t*3/r.components*r.byteLength;case $e:return i*t*4/r.components*r.byteLength;case Qo:return i*t*4/r.components*r.byteLength;case Br:case zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case kr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case po:case go:return Math.max(i,16)*Math.max(t,8)/4;case fo:case mo:return Math.max(i,8)*Math.max(t,8)/2;case _o:case vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case So:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case yo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case To:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ao:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case wo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case bo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ro:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Co:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Po:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Lo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Io:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Do:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Hr:case Uo:case No:return Math.ceil(i/4)*Math.ceil(t/4)*16;case hl:case Fo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Oo:case Bo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cg(i){switch(i){case un:case el:return{byteLength:1,components:1};case Ki:case nl:case ji:return{byteLength:2,components:1};case $o:case Jo:return{byteLength:2,components:4};case $n:case Ko:case cn:return{byteLength:4,components:1};case il:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function lg(i,t,e,n,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new St,h=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,M){return m?new OffscreenCanvas(A,M):Zr("canvas")}function v(A,M,N){let Y=1;const Z=Rt(A);if((Z.width>N||Z.height>N)&&(Y=N/Math.max(Z.width,Z.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const q=Math.floor(Y*Z.width),vt=Math.floor(Y*Z.height);f===void 0&&(f=g(q,vt));const it=M?g(q,vt):f;return it.width=q,it.height=vt,it.getContext("2d").drawImage(A,0,0,q,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+q+"x"+vt+")."),it}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),A;return A}function u(A){return A.generateMipmaps&&A.minFilter!==Ge&&A.minFilter!==Ke}function d(A){i.generateMipmap(A)}function E(A,M,N,Y,Z=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let q=M;if(M===i.RED&&(N===i.FLOAT&&(q=i.R32F),N===i.HALF_FLOAT&&(q=i.R16F),N===i.UNSIGNED_BYTE&&(q=i.R8)),M===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.R8UI),N===i.UNSIGNED_SHORT&&(q=i.R16UI),N===i.UNSIGNED_INT&&(q=i.R32UI),N===i.BYTE&&(q=i.R8I),N===i.SHORT&&(q=i.R16I),N===i.INT&&(q=i.R32I)),M===i.RG&&(N===i.FLOAT&&(q=i.RG32F),N===i.HALF_FLOAT&&(q=i.RG16F),N===i.UNSIGNED_BYTE&&(q=i.RG8)),M===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.RG8UI),N===i.UNSIGNED_SHORT&&(q=i.RG16UI),N===i.UNSIGNED_INT&&(q=i.RG32UI),N===i.BYTE&&(q=i.RG8I),N===i.SHORT&&(q=i.RG16I),N===i.INT&&(q=i.RG32I)),M===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.RGB8UI),N===i.UNSIGNED_SHORT&&(q=i.RGB16UI),N===i.UNSIGNED_INT&&(q=i.RGB32UI),N===i.BYTE&&(q=i.RGB8I),N===i.SHORT&&(q=i.RGB16I),N===i.INT&&(q=i.RGB32I)),M===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),N===i.UNSIGNED_INT&&(q=i.RGBA32UI),N===i.BYTE&&(q=i.RGBA8I),N===i.SHORT&&(q=i.RGBA16I),N===i.INT&&(q=i.RGBA32I)),M===i.RGB&&N===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),M===i.RGBA){const vt=Z?Yr:qt.getTransfer(Y);N===i.FLOAT&&(q=i.RGBA32F),N===i.HALF_FLOAT&&(q=i.RGBA16F),N===i.UNSIGNED_BYTE&&(q=vt===ne?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function x(A,M){let N;return A?M===null||M===$n||M===Ai?N=i.DEPTH24_STENCIL8:M===cn?N=i.DEPTH32F_STENCIL8:M===Ki&&(N=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===$n||M===Ai?N=i.DEPTH_COMPONENT24:M===cn?N=i.DEPTH_COMPONENT32F:M===Ki&&(N=i.DEPTH_COMPONENT16),N}function T(A,M){return u(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ge&&A.minFilter!==Ke?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function I(A){const M=A.target;M.removeEventListener("dispose",I),b(M),M.isVideoTexture&&h.delete(M)}function R(A){const M=A.target;M.removeEventListener("dispose",R),V(M)}function b(A){const M=n.get(A);if(M.__webglInit===void 0)return;const N=A.source,Y=p.get(N);if(Y){const Z=Y[M.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&P(A),Object.keys(Y).length===0&&p.delete(N)}n.remove(A)}function P(A){const M=n.get(A);i.deleteTexture(M.__webglTexture);const N=A.source,Y=p.get(N);delete Y[M.__cacheKey],o.memory.textures--}function V(A){const M=n.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let Z=0;Z<M.__webglFramebuffer[Y].length;Z++)i.deleteFramebuffer(M.__webglFramebuffer[Y][Z]);else i.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)i.deleteFramebuffer(M.__webglFramebuffer[Y]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const N=A.textures;for(let Y=0,Z=N.length;Y<Z;Y++){const q=n.get(N[Y]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(N[Y])}n.remove(A)}let _=0;function y(){_=0}function B(){const A=_;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),_+=1,A}function z(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function W(A,M){const N=n.get(A);if(A.isVideoTexture&&At(A),A.isRenderTargetTexture===!1&&A.version>0&&N.__version!==A.version){const Y=A.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Kt(N,A,M);return}}e.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+M)}function $(A,M){const N=n.get(A);if(A.version>0&&N.__version!==A.version){Kt(N,A,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+M)}function k(A,M){const N=n.get(A);if(A.version>0&&N.__version!==A.version){Kt(N,A,M);return}e.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+M)}function J(A,M){const N=n.get(A);if(A.version>0&&N.__version!==A.version){X(N,A,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+M)}const H={[ho]:i.REPEAT,[Xn]:i.CLAMP_TO_EDGE,[uo]:i.MIRRORED_REPEAT},ct={[Ge]:i.NEAREST,[Dh]:i.NEAREST_MIPMAP_NEAREST,[rr]:i.NEAREST_MIPMAP_LINEAR,[Ke]:i.LINEAR,[ms]:i.LINEAR_MIPMAP_NEAREST,[qn]:i.LINEAR_MIPMAP_LINEAR},lt={[Oh]:i.NEVER,[Vh]:i.ALWAYS,[Bh]:i.LESS,[fl]:i.LEQUAL,[zh]:i.EQUAL,[Hh]:i.GEQUAL,[kh]:i.GREATER,[Gh]:i.NOTEQUAL};function _t(A,M){if(M.type===cn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Ke||M.magFilter===ms||M.magFilter===rr||M.magFilter===qn||M.minFilter===Ke||M.minFilter===ms||M.minFilter===rr||M.minFilter===qn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,H[M.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,H[M.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,H[M.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ct[M.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ct[M.minFilter]),M.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,lt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ge||M.minFilter!==rr&&M.minFilter!==qn||M.type===cn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Ht(A,M){let N=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",I));const Y=M.source;let Z=p.get(Y);Z===void 0&&(Z={},p.set(Y,Z));const q=z(M);if(q!==A.__cacheKey){Z[q]===void 0&&(Z[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,N=!0),Z[q].usedTimes++;const vt=Z[A.__cacheKey];vt!==void 0&&(Z[A.__cacheKey].usedTimes--,vt.usedTimes===0&&P(M)),A.__cacheKey=q,A.__webglTexture=Z[q].texture}return N}function Kt(A,M,N){let Y=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=i.TEXTURE_3D);const Z=Ht(A,M),q=M.source;e.bindTexture(Y,A.__webglTexture,i.TEXTURE0+N);const vt=n.get(q);if(q.version!==vt.__version||Z===!0){e.activeTexture(i.TEXTURE0+N);const it=qt.getPrimaries(qt.workingColorSpace),ut=M.colorSpace===En?null:qt.getPrimaries(M.colorSpace),kt=M.colorSpace===En||it===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);let tt=v(M.image,!1,r.maxTextureSize);tt=te(M,tt);const ft=s.convert(M.format,M.colorSpace),wt=s.convert(M.type);let bt=E(M.internalFormat,ft,wt,M.colorSpace,M.isVideoTexture);_t(Y,M);let dt;const Nt=M.mipmaps,Pt=M.isVideoTexture!==!0,jt=vt.__version===void 0||Z===!0,L=q.dataReady,ot=T(M,tt);if(M.isDepthTexture)bt=x(M.format===wi,M.type),jt&&(Pt?e.texStorage2D(i.TEXTURE_2D,1,bt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,bt,tt.width,tt.height,0,ft,wt,null));else if(M.isDataTexture)if(Nt.length>0){Pt&&jt&&e.texStorage2D(i.TEXTURE_2D,ot,bt,Nt[0].width,Nt[0].height);for(let G=0,K=Nt.length;G<K;G++)dt=Nt[G],Pt?L&&e.texSubImage2D(i.TEXTURE_2D,G,0,0,dt.width,dt.height,ft,wt,dt.data):e.texImage2D(i.TEXTURE_2D,G,bt,dt.width,dt.height,0,ft,wt,dt.data);M.generateMipmaps=!1}else Pt?(jt&&e.texStorage2D(i.TEXTURE_2D,ot,bt,tt.width,tt.height),L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,tt.width,tt.height,ft,wt,tt.data)):e.texImage2D(i.TEXTURE_2D,0,bt,tt.width,tt.height,0,ft,wt,tt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Pt&&jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ot,bt,Nt[0].width,Nt[0].height,tt.depth);for(let G=0,K=Nt.length;G<K;G++)if(dt=Nt[G],M.format!==$e)if(ft!==null)if(Pt){if(L)if(M.layerUpdates.size>0){const rt=_c(dt.width,dt.height,M.format,M.type);for(const at of M.layerUpdates){const Bt=dt.data.subarray(at*rt/dt.data.BYTES_PER_ELEMENT,(at+1)*rt/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,at,dt.width,dt.height,1,ft,Bt,0,0)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,dt.width,dt.height,tt.depth,ft,dt.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,G,bt,dt.width,dt.height,tt.depth,0,dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pt?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,dt.width,dt.height,tt.depth,ft,wt,dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,G,bt,dt.width,dt.height,tt.depth,0,ft,wt,dt.data)}else{Pt&&jt&&e.texStorage2D(i.TEXTURE_2D,ot,bt,Nt[0].width,Nt[0].height);for(let G=0,K=Nt.length;G<K;G++)dt=Nt[G],M.format!==$e?ft!==null?Pt?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,G,0,0,dt.width,dt.height,ft,dt.data):e.compressedTexImage2D(i.TEXTURE_2D,G,bt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pt?L&&e.texSubImage2D(i.TEXTURE_2D,G,0,0,dt.width,dt.height,ft,wt,dt.data):e.texImage2D(i.TEXTURE_2D,G,bt,dt.width,dt.height,0,ft,wt,dt.data)}else if(M.isDataArrayTexture)if(Pt){if(jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ot,bt,tt.width,tt.height,tt.depth),L)if(M.layerUpdates.size>0){const G=_c(tt.width,tt.height,M.format,M.type);for(const K of M.layerUpdates){const rt=tt.data.subarray(K*G/tt.data.BYTES_PER_ELEMENT,(K+1)*G/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,tt.width,tt.height,1,ft,wt,rt)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ft,wt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,bt,tt.width,tt.height,tt.depth,0,ft,wt,tt.data);else if(M.isData3DTexture)Pt?(jt&&e.texStorage3D(i.TEXTURE_3D,ot,bt,tt.width,tt.height,tt.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ft,wt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,bt,tt.width,tt.height,tt.depth,0,ft,wt,tt.data);else if(M.isFramebufferTexture){if(jt)if(Pt)e.texStorage2D(i.TEXTURE_2D,ot,bt,tt.width,tt.height);else{let G=tt.width,K=tt.height;for(let rt=0;rt<ot;rt++)e.texImage2D(i.TEXTURE_2D,rt,bt,G,K,0,ft,wt,null),G>>=1,K>>=1}}else if(Nt.length>0){if(Pt&&jt){const G=Rt(Nt[0]);e.texStorage2D(i.TEXTURE_2D,ot,bt,G.width,G.height)}for(let G=0,K=Nt.length;G<K;G++)dt=Nt[G],Pt?L&&e.texSubImage2D(i.TEXTURE_2D,G,0,0,ft,wt,dt):e.texImage2D(i.TEXTURE_2D,G,bt,ft,wt,dt);M.generateMipmaps=!1}else if(Pt){if(jt){const G=Rt(tt);e.texStorage2D(i.TEXTURE_2D,ot,bt,G.width,G.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft,wt,tt)}else e.texImage2D(i.TEXTURE_2D,0,bt,ft,wt,tt);u(M)&&d(Y),vt.__version=q.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function X(A,M,N){if(M.image.length!==6)return;const Y=Ht(A,M),Z=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+N);const q=n.get(Z);if(Z.version!==q.__version||Y===!0){e.activeTexture(i.TEXTURE0+N);const vt=qt.getPrimaries(qt.workingColorSpace),it=M.colorSpace===En?null:qt.getPrimaries(M.colorSpace),ut=M.colorSpace===En||vt===it?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const kt=M.isCompressedTexture||M.image[0].isCompressedTexture,tt=M.image[0]&&M.image[0].isDataTexture,ft=[];for(let K=0;K<6;K++)!kt&&!tt?ft[K]=v(M.image[K],!0,r.maxCubemapSize):ft[K]=tt?M.image[K].image:M.image[K],ft[K]=te(M,ft[K]);const wt=ft[0],bt=s.convert(M.format,M.colorSpace),dt=s.convert(M.type),Nt=E(M.internalFormat,bt,dt,M.colorSpace),Pt=M.isVideoTexture!==!0,jt=q.__version===void 0||Y===!0,L=Z.dataReady;let ot=T(M,wt);_t(i.TEXTURE_CUBE_MAP,M);let G;if(kt){Pt&&jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ot,Nt,wt.width,wt.height);for(let K=0;K<6;K++){G=ft[K].mipmaps;for(let rt=0;rt<G.length;rt++){const at=G[rt];M.format!==$e?bt!==null?Pt?L&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt,0,0,at.width,at.height,bt,at.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt,Nt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt,0,0,at.width,at.height,bt,dt,at.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt,Nt,at.width,at.height,0,bt,dt,at.data)}}}else{if(G=M.mipmaps,Pt&&jt){G.length>0&&ot++;const K=Rt(ft[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ot,Nt,K.width,K.height)}for(let K=0;K<6;K++)if(tt){Pt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ft[K].width,ft[K].height,bt,dt,ft[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Nt,ft[K].width,ft[K].height,0,bt,dt,ft[K].data);for(let rt=0;rt<G.length;rt++){const Bt=G[rt].image[K].image;Pt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt+1,0,0,Bt.width,Bt.height,bt,dt,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt+1,Nt,Bt.width,Bt.height,0,bt,dt,Bt.data)}}else{Pt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,bt,dt,ft[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Nt,bt,dt,ft[K]);for(let rt=0;rt<G.length;rt++){const at=G[rt];Pt?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt+1,0,0,bt,dt,at.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,rt+1,Nt,bt,dt,at.image[K])}}}u(M)&&d(i.TEXTURE_CUBE_MAP),q.__version=Z.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Q(A,M,N,Y,Z,q){const vt=s.convert(N.format,N.colorSpace),it=s.convert(N.type),ut=E(N.internalFormat,vt,it,N.colorSpace);if(!n.get(M).__hasExternalTextures){const tt=Math.max(1,M.width>>q),ft=Math.max(1,M.height>>q);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,q,ut,tt,ft,M.depth,0,vt,it,null):e.texImage2D(Z,q,ut,tt,ft,0,vt,it,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),zt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,Z,n.get(N).__webglTexture,0,Ut(M)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,Z,n.get(N).__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function mt(A,M,N){if(i.bindRenderbuffer(i.RENDERBUFFER,A),M.depthBuffer){const Y=M.depthTexture,Z=Y&&Y.isDepthTexture?Y.type:null,q=x(M.stencilBuffer,Z),vt=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=Ut(M);zt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,q,M.width,M.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,q,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,q,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,vt,i.RENDERBUFFER,A)}else{const Y=M.textures;for(let Z=0;Z<Y.length;Z++){const q=Y[Z],vt=s.convert(q.format,q.colorSpace),it=s.convert(q.type),ut=E(q.internalFormat,vt,it,q.colorSpace),kt=Ut(M);N&&zt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,ut,M.width,M.height):zt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,kt,ut,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ut,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ht(A,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W(M.depthTexture,0);const Y=n.get(M.depthTexture).__webglTexture,Z=Ut(M);if(M.depthTexture.format===_i)zt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Y,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Y,0);else if(M.depthTexture.format===wi)zt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Y,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function Ct(A){const M=n.get(A),N=A.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==A.depthTexture){const Y=A.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){const Z=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",Z)};Y.addEventListener("dispose",Z),M.__depthDisposeCallback=Z}M.__boundDepthTexture=Y}if(A.depthTexture&&!M.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");ht(M.__webglFramebuffer,A)}else if(N){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=i.createRenderbuffer(),mt(M.__webglDepthbuffer[Y],A,!1);else{const Z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=M.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),mt(M.__webglDepthbuffer,A,!1);else{const Y=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,Z)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(A,M,N){const Y=n.get(A);M!==void 0&&Q(Y.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&Ct(A)}function Ft(A){const M=A.texture,N=n.get(A),Y=n.get(M);A.addEventListener("dispose",R);const Z=A.textures,q=A.isWebGLCubeRenderTarget===!0,vt=Z.length>1;if(vt||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=M.version,o.memory.textures++),q){N.__webglFramebuffer=[];for(let it=0;it<6;it++)if(M.mipmaps&&M.mipmaps.length>0){N.__webglFramebuffer[it]=[];for(let ut=0;ut<M.mipmaps.length;ut++)N.__webglFramebuffer[it][ut]=i.createFramebuffer()}else N.__webglFramebuffer[it]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){N.__webglFramebuffer=[];for(let it=0;it<M.mipmaps.length;it++)N.__webglFramebuffer[it]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(vt)for(let it=0,ut=Z.length;it<ut;it++){const kt=n.get(Z[it]);kt.__webglTexture===void 0&&(kt.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&zt(A)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let it=0;it<Z.length;it++){const ut=Z[it];N.__webglColorRenderbuffer[it]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[it]);const kt=s.convert(ut.format,ut.colorSpace),tt=s.convert(ut.type),ft=E(ut.internalFormat,kt,tt,ut.colorSpace,A.isXRRenderTarget===!0),wt=Ut(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,wt,ft,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+it,i.RENDERBUFFER,N.__webglColorRenderbuffer[it])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),mt(N.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),_t(i.TEXTURE_CUBE_MAP,M);for(let it=0;it<6;it++)if(M.mipmaps&&M.mipmaps.length>0)for(let ut=0;ut<M.mipmaps.length;ut++)Q(N.__webglFramebuffer[it][ut],A,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,ut);else Q(N.__webglFramebuffer[it],A,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);u(M)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(vt){for(let it=0,ut=Z.length;it<ut;it++){const kt=Z[it],tt=n.get(kt);e.bindTexture(i.TEXTURE_2D,tt.__webglTexture),_t(i.TEXTURE_2D,kt),Q(N.__webglFramebuffer,A,kt,i.COLOR_ATTACHMENT0+it,i.TEXTURE_2D,0),u(kt)&&d(i.TEXTURE_2D)}e.unbindTexture()}else{let it=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(it=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(it,Y.__webglTexture),_t(it,M),M.mipmaps&&M.mipmaps.length>0)for(let ut=0;ut<M.mipmaps.length;ut++)Q(N.__webglFramebuffer[ut],A,M,i.COLOR_ATTACHMENT0,it,ut);else Q(N.__webglFramebuffer,A,M,i.COLOR_ATTACHMENT0,it,0);u(M)&&d(it),e.unbindTexture()}A.depthBuffer&&Ct(A)}function Jt(A){const M=A.textures;for(let N=0,Y=M.length;N<Y;N++){const Z=M[N];if(u(Z)){const q=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,vt=n.get(Z).__webglTexture;e.bindTexture(q,vt),d(q),e.unbindTexture()}}}const Ot=[],C=[];function Ce(A){if(A.samples>0){if(zt(A)===!1){const M=A.textures,N=A.width,Y=A.height;let Z=i.COLOR_BUFFER_BIT;const q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,vt=n.get(A),it=M.length>1;if(it)for(let ut=0;ut<M.length;ut++)e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let ut=0;ut<M.length;ut++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),it){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,vt.__webglColorRenderbuffer[ut]);const kt=n.get(M[ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,kt,0)}i.blitFramebuffer(0,0,N,Y,0,0,N,Y,Z,i.NEAREST),c===!0&&(Ot.length=0,C.length=0,Ot.push(i.COLOR_ATTACHMENT0+ut),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Ot.push(q),C.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,C)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ot))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),it)for(let ut=0;ut<M.length;ut++){e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,vt.__webglColorRenderbuffer[ut]);const kt=n.get(M[ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,kt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const M=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Ut(A){return Math.min(r.maxSamples,A.samples)}function zt(A){const M=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function At(A){const M=o.render.frame;h.get(A)!==M&&(h.set(A,M),A.update())}function te(A,M){const N=A.colorSpace,Y=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||N!==Ln&&N!==En&&(qt.getTransfer(N)===ne?(Y!==$e||Z!==un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),M}function Rt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=y,this.setTexture2D=W,this.setTexture2DArray=$,this.setTexture3D=k,this.setTextureCube=J,this.rebindTextures=Et,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=Jt,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=Ct,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=zt}function hg(i,t){function e(n,r=En){let s;const o=qt.getTransfer(r);if(n===un)return i.UNSIGNED_BYTE;if(n===$o)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Jo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===il)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===el)return i.BYTE;if(n===nl)return i.SHORT;if(n===Ki)return i.UNSIGNED_SHORT;if(n===Ko)return i.INT;if(n===$n)return i.UNSIGNED_INT;if(n===cn)return i.FLOAT;if(n===ji)return i.HALF_FLOAT;if(n===rl)return i.ALPHA;if(n===sl)return i.RGB;if(n===$e)return i.RGBA;if(n===ol)return i.LUMINANCE;if(n===al)return i.LUMINANCE_ALPHA;if(n===_i)return i.DEPTH_COMPONENT;if(n===wi)return i.DEPTH_STENCIL;if(n===cl)return i.RED;if(n===Zo)return i.RED_INTEGER;if(n===ll)return i.RG;if(n===jo)return i.RG_INTEGER;if(n===Qo)return i.RGBA_INTEGER;if(n===Br||n===zr||n===kr||n===Gr)if(o===ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Br)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===zr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===kr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Br)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===zr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===kr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===fo||n===po||n===mo||n===go)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===fo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===po)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===mo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===go)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===_o||n===vo||n===xo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===_o||n===vo)return o===ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===xo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Mo||n===So||n===yo||n===Eo||n===To||n===Ao||n===wo||n===bo||n===Ro||n===Co||n===Po||n===Lo||n===Io||n===Do)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Mo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===So)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===yo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Eo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===To)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ao)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===wo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ro)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Co)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Po)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Lo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Io)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Do)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Hr||n===Uo||n===No)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Hr)return o===ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Uo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===No)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===hl||n===Fo||n===Oo||n===Bo)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Hr)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Fo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Oo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Bo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ai?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class ug extends Ue{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ye extends ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const fg={type:"move"};class Vs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ye,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ye,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ye,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const u=e.getJointPose(v,n),d=this._getHandJoint(l,v);u!==null&&(d.matrix.fromArray(u.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=u.radius),d.visible=u!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],p=h.position.distanceTo(f.position),m=.02,g=.005;l.inputState.pinching&&p>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(fg)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ye;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const dg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,pg=`
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

}`;class mg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const r=new Re,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new bn({vertexShader:dg,fragmentShader:pg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Gt(new Rn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gg extends Ri{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,f=null,p=null,m=null,g=null;const v=new mg,u=e.getContextAttributes();let d=null,E=null;const x=[],T=[],I=new St;let R=null;const b=new Ue;b.layers.enable(1),b.viewport=new Zt;const P=new Ue;P.layers.enable(2),P.viewport=new Zt;const V=[b,P],_=new ug;_.layers.enable(1),_.layers.enable(2);let y=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Q=x[X];return Q===void 0&&(Q=new Vs,x[X]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(X){let Q=x[X];return Q===void 0&&(Q=new Vs,x[X]=Q),Q.getGripSpace()},this.getHand=function(X){let Q=x[X];return Q===void 0&&(Q=new Vs,x[X]=Q),Q.getHandSpace()};function z(X){const Q=T.indexOf(X.inputSource);if(Q===-1)return;const mt=x[Q];mt!==void 0&&(mt.update(X.inputSource,X.frame,l||o),mt.dispatchEvent({type:X.type,data:X.inputSource}))}function W(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",$);for(let X=0;X<x.length;X++){const Q=T[X];Q!==null&&(T[X]=null,x[X].disconnect(Q))}y=null,B=null,v.reset(),t.setRenderTarget(d),m=null,p=null,f=null,r=null,E=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(d=t.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",W),r.addEventListener("inputsourceschange",$),u.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(I),r.renderState.layers===void 0){const Q={antialias:u.antialias,alpha:!0,depth:u.depth,stencil:u.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,Q),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),E=new Jn(m.framebufferWidth,m.framebufferHeight,{format:$e,type:un,colorSpace:t.outputColorSpace,stencilBuffer:u.stencil})}else{let Q=null,mt=null,ht=null;u.depth&&(ht=u.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=u.stencil?wi:_i,mt=u.stencil?Ai:$n);const Ct={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:s};f=new XRWebGLBinding(r,e),p=f.createProjectionLayer(Ct),r.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),E=new Jn(p.textureWidth,p.textureHeight,{format:$e,type:un,depthTexture:new Tl(p.textureWidth,p.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:u.stencil,colorSpace:t.outputColorSpace,samples:u.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),Kt.setContext(r),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function $(X){for(let Q=0;Q<X.removed.length;Q++){const mt=X.removed[Q],ht=T.indexOf(mt);ht>=0&&(T[ht]=null,x[ht].disconnect(mt))}for(let Q=0;Q<X.added.length;Q++){const mt=X.added[Q];let ht=T.indexOf(mt);if(ht===-1){for(let Et=0;Et<x.length;Et++)if(Et>=T.length){T.push(mt),ht=Et;break}else if(T[Et]===null){T[Et]=mt,ht=Et;break}if(ht===-1)break}const Ct=x[ht];Ct&&Ct.connect(mt)}}const k=new w,J=new w;function H(X,Q,mt){k.setFromMatrixPosition(Q.matrixWorld),J.setFromMatrixPosition(mt.matrixWorld);const ht=k.distanceTo(J),Ct=Q.projectionMatrix.elements,Et=mt.projectionMatrix.elements,Ft=Ct[14]/(Ct[10]-1),Jt=Ct[14]/(Ct[10]+1),Ot=(Ct[9]+1)/Ct[5],C=(Ct[9]-1)/Ct[5],Ce=(Ct[8]-1)/Ct[0],Ut=(Et[8]+1)/Et[0],zt=Ft*Ce,At=Ft*Ut,te=ht/(-Ce+Ut),Rt=te*-Ce;if(Q.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Rt),X.translateZ(te),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ct[10]===-1)X.projectionMatrix.copy(Q.projectionMatrix),X.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const A=Ft+te,M=Jt+te,N=zt-Rt,Y=At+(ht-Rt),Z=Ot*Jt/M*A,q=C*Jt/M*A;X.projectionMatrix.makePerspective(N,Y,Z,q,A,M),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function ct(X,Q){Q===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Q.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let Q=X.near,mt=X.far;v.texture!==null&&(v.depthNear>0&&(Q=v.depthNear),v.depthFar>0&&(mt=v.depthFar)),_.near=P.near=b.near=Q,_.far=P.far=b.far=mt,(y!==_.near||B!==_.far)&&(r.updateRenderState({depthNear:_.near,depthFar:_.far}),y=_.near,B=_.far);const ht=X.parent,Ct=_.cameras;ct(_,ht);for(let Et=0;Et<Ct.length;Et++)ct(Ct[Et],ht);Ct.length===2?H(_,b,P):_.projectionMatrix.copy(b.projectionMatrix),lt(X,_,ht)};function lt(X,Q,mt){mt===null?X.matrix.copy(Q.matrixWorld):(X.matrix.copy(mt.matrixWorld),X.matrix.invert(),X.matrix.multiply(Q.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Q.projectionMatrix),X.projectionMatrixInverse.copy(Q.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=$i*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function(X){c=X,p!==null&&(p.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let _t=null;function Ht(X,Q){if(h=Q.getViewerPose(l||o),g=Q,h!==null){const mt=h.views;m!==null&&(t.setRenderTargetFramebuffer(E,m.framebuffer),t.setRenderTarget(E));let ht=!1;mt.length!==_.cameras.length&&(_.cameras.length=0,ht=!0);for(let Et=0;Et<mt.length;Et++){const Ft=mt[Et];let Jt=null;if(m!==null)Jt=m.getViewport(Ft);else{const C=f.getViewSubImage(p,Ft);Jt=C.viewport,Et===0&&(t.setRenderTargetTextures(E,C.colorTexture,p.ignoreDepthValues?void 0:C.depthStencilTexture),t.setRenderTarget(E))}let Ot=V[Et];Ot===void 0&&(Ot=new Ue,Ot.layers.enable(Et),Ot.viewport=new Zt,V[Et]=Ot),Ot.matrix.fromArray(Ft.transform.matrix),Ot.matrix.decompose(Ot.position,Ot.quaternion,Ot.scale),Ot.projectionMatrix.fromArray(Ft.projectionMatrix),Ot.projectionMatrixInverse.copy(Ot.projectionMatrix).invert(),Ot.viewport.set(Jt.x,Jt.y,Jt.width,Jt.height),Et===0&&(_.matrix.copy(Ot.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ht===!0&&_.cameras.push(Ot)}const Ct=r.enabledFeatures;if(Ct&&Ct.includes("depth-sensing")){const Et=f.getDepthInformation(mt[0]);Et&&Et.isValid&&Et.texture&&v.init(t,Et,r.renderState)}}for(let mt=0;mt<x.length;mt++){const ht=T[mt],Ct=x[mt];ht!==null&&Ct!==void 0&&Ct.update(ht,Q,l||o)}_t&&_t(X,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Kt=new yl;Kt.setAnimationLoop(Ht),this.setAnimationLoop=function(X){_t=X},this.dispose=function(){}}}const zn=new Oe,_g=new Yt;function vg(i,t){function e(u,d){u.matrixAutoUpdate===!0&&u.updateMatrix(),d.value.copy(u.matrix)}function n(u,d){d.color.getRGB(u.fogColor.value,xl(i)),d.isFog?(u.fogNear.value=d.near,u.fogFar.value=d.far):d.isFogExp2&&(u.fogDensity.value=d.density)}function r(u,d,E,x,T){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(u,d):d.isMeshToonMaterial?(s(u,d),f(u,d)):d.isMeshPhongMaterial?(s(u,d),h(u,d)):d.isMeshStandardMaterial?(s(u,d),p(u,d),d.isMeshPhysicalMaterial&&m(u,d,T)):d.isMeshMatcapMaterial?(s(u,d),g(u,d)):d.isMeshDepthMaterial?s(u,d):d.isMeshDistanceMaterial?(s(u,d),v(u,d)):d.isMeshNormalMaterial?s(u,d):d.isLineBasicMaterial?(o(u,d),d.isLineDashedMaterial&&a(u,d)):d.isPointsMaterial?c(u,d,E,x):d.isSpriteMaterial?l(u,d):d.isShadowMaterial?(u.color.value.copy(d.color),u.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(u,d){u.opacity.value=d.opacity,d.color&&u.diffuse.value.copy(d.color),d.emissive&&u.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(u.map.value=d.map,e(d.map,u.mapTransform)),d.alphaMap&&(u.alphaMap.value=d.alphaMap,e(d.alphaMap,u.alphaMapTransform)),d.bumpMap&&(u.bumpMap.value=d.bumpMap,e(d.bumpMap,u.bumpMapTransform),u.bumpScale.value=d.bumpScale,d.side===Te&&(u.bumpScale.value*=-1)),d.normalMap&&(u.normalMap.value=d.normalMap,e(d.normalMap,u.normalMapTransform),u.normalScale.value.copy(d.normalScale),d.side===Te&&u.normalScale.value.negate()),d.displacementMap&&(u.displacementMap.value=d.displacementMap,e(d.displacementMap,u.displacementMapTransform),u.displacementScale.value=d.displacementScale,u.displacementBias.value=d.displacementBias),d.emissiveMap&&(u.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,u.emissiveMapTransform)),d.specularMap&&(u.specularMap.value=d.specularMap,e(d.specularMap,u.specularMapTransform)),d.alphaTest>0&&(u.alphaTest.value=d.alphaTest);const E=t.get(d),x=E.envMap,T=E.envMapRotation;x&&(u.envMap.value=x,zn.copy(T),zn.x*=-1,zn.y*=-1,zn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(zn.y*=-1,zn.z*=-1),u.envMapRotation.value.setFromMatrix4(_g.makeRotationFromEuler(zn)),u.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.reflectivity.value=d.reflectivity,u.ior.value=d.ior,u.refractionRatio.value=d.refractionRatio),d.lightMap&&(u.lightMap.value=d.lightMap,u.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,u.lightMapTransform)),d.aoMap&&(u.aoMap.value=d.aoMap,u.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,u.aoMapTransform))}function o(u,d){u.diffuse.value.copy(d.color),u.opacity.value=d.opacity,d.map&&(u.map.value=d.map,e(d.map,u.mapTransform))}function a(u,d){u.dashSize.value=d.dashSize,u.totalSize.value=d.dashSize+d.gapSize,u.scale.value=d.scale}function c(u,d,E,x){u.diffuse.value.copy(d.color),u.opacity.value=d.opacity,u.size.value=d.size*E,u.scale.value=x*.5,d.map&&(u.map.value=d.map,e(d.map,u.uvTransform)),d.alphaMap&&(u.alphaMap.value=d.alphaMap,e(d.alphaMap,u.alphaMapTransform)),d.alphaTest>0&&(u.alphaTest.value=d.alphaTest)}function l(u,d){u.diffuse.value.copy(d.color),u.opacity.value=d.opacity,u.rotation.value=d.rotation,d.map&&(u.map.value=d.map,e(d.map,u.mapTransform)),d.alphaMap&&(u.alphaMap.value=d.alphaMap,e(d.alphaMap,u.alphaMapTransform)),d.alphaTest>0&&(u.alphaTest.value=d.alphaTest)}function h(u,d){u.specular.value.copy(d.specular),u.shininess.value=Math.max(d.shininess,1e-4)}function f(u,d){d.gradientMap&&(u.gradientMap.value=d.gradientMap)}function p(u,d){u.metalness.value=d.metalness,d.metalnessMap&&(u.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,u.metalnessMapTransform)),u.roughness.value=d.roughness,d.roughnessMap&&(u.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,u.roughnessMapTransform)),d.envMap&&(u.envMapIntensity.value=d.envMapIntensity)}function m(u,d,E){u.ior.value=d.ior,d.sheen>0&&(u.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),u.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(u.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,u.sheenColorMapTransform)),d.sheenRoughnessMap&&(u.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,u.sheenRoughnessMapTransform))),d.clearcoat>0&&(u.clearcoat.value=d.clearcoat,u.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(u.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,u.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(u.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,u.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(u.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,u.clearcoatNormalMapTransform),u.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Te&&u.clearcoatNormalScale.value.negate())),d.dispersion>0&&(u.dispersion.value=d.dispersion),d.iridescence>0&&(u.iridescence.value=d.iridescence,u.iridescenceIOR.value=d.iridescenceIOR,u.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],u.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(u.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,u.iridescenceMapTransform)),d.iridescenceThicknessMap&&(u.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,u.iridescenceThicknessMapTransform))),d.transmission>0&&(u.transmission.value=d.transmission,u.transmissionSamplerMap.value=E.texture,u.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(u.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,u.transmissionMapTransform)),u.thickness.value=d.thickness,d.thicknessMap&&(u.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,u.thicknessMapTransform)),u.attenuationDistance.value=d.attenuationDistance,u.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(u.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(u.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,u.anisotropyMapTransform))),u.specularIntensity.value=d.specularIntensity,u.specularColor.value.copy(d.specularColor),d.specularColorMap&&(u.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,u.specularColorMapTransform)),d.specularIntensityMap&&(u.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,u.specularIntensityMapTransform))}function g(u,d){d.matcap&&(u.matcap.value=d.matcap)}function v(u,d){const E=t.get(d).light;u.referencePosition.value.setFromMatrixPosition(E.matrixWorld),u.nearDistance.value=E.shadow.camera.near,u.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function xg(i,t,e,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,x){const T=x.program;n.uniformBlockBinding(E,T)}function l(E,x){let T=r[E.id];T===void 0&&(g(E),T=h(E),r[E.id]=T,E.addEventListener("dispose",u));const I=x.program;n.updateUBOMapping(E,I);const R=t.render.frame;s[E.id]!==R&&(p(E),s[E.id]=R)}function h(E){const x=f();E.__bindingPointIndex=x;const T=i.createBuffer(),I=E.__size,R=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,I,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,T),T}function f(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(E){const x=r[E.id],T=E.uniforms,I=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let R=0,b=T.length;R<b;R++){const P=Array.isArray(T[R])?T[R]:[T[R]];for(let V=0,_=P.length;V<_;V++){const y=P[V];if(m(y,R,V,I)===!0){const B=y.__offset,z=Array.isArray(y.value)?y.value:[y.value];let W=0;for(let $=0;$<z.length;$++){const k=z[$],J=v(k);typeof k=="number"||typeof k=="boolean"?(y.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,B+W,y.__data)):k.isMatrix3?(y.__data[0]=k.elements[0],y.__data[1]=k.elements[1],y.__data[2]=k.elements[2],y.__data[3]=0,y.__data[4]=k.elements[3],y.__data[5]=k.elements[4],y.__data[6]=k.elements[5],y.__data[7]=0,y.__data[8]=k.elements[6],y.__data[9]=k.elements[7],y.__data[10]=k.elements[8],y.__data[11]=0):(k.toArray(y.__data,W),W+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,y.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(E,x,T,I){const R=E.value,b=x+"_"+T;if(I[b]===void 0)return typeof R=="number"||typeof R=="boolean"?I[b]=R:I[b]=R.clone(),!0;{const P=I[b];if(typeof R=="number"||typeof R=="boolean"){if(P!==R)return I[b]=R,!0}else if(P.equals(R)===!1)return P.copy(R),!0}return!1}function g(E){const x=E.uniforms;let T=0;const I=16;for(let b=0,P=x.length;b<P;b++){const V=Array.isArray(x[b])?x[b]:[x[b]];for(let _=0,y=V.length;_<y;_++){const B=V[_],z=Array.isArray(B.value)?B.value:[B.value];for(let W=0,$=z.length;W<$;W++){const k=z[W],J=v(k),H=T%I,ct=H%J.boundary,lt=H+ct;T+=ct,lt!==0&&I-lt<J.storage&&(T+=I-lt),B.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=T,T+=J.storage}}}const R=T%I;return R>0&&(T+=I-R),E.__size=T,E.__cache={},this}function v(E){const x={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(x.boundary=4,x.storage=4):E.isVector2?(x.boundary=8,x.storage=8):E.isVector3||E.isColor?(x.boundary=16,x.storage=12):E.isVector4?(x.boundary=16,x.storage=16):E.isMatrix3?(x.boundary=48,x.storage=48):E.isMatrix4?(x.boundary=64,x.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),x}function u(E){const x=E.target;x.removeEventListener("dispose",u);const T=o.indexOf(x.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function d(){for(const E in r)i.deleteBuffer(r[E]);o=[],r={},s={}}return{bind:c,update:l,dispose:d}}class Mg{constructor(t={}){const{canvas:e=ou(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,u=null;const d=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ze,this.toneMapping=An,this.toneMappingExposure=1;const x=this;let T=!1,I=0,R=0,b=null,P=-1,V=null;const _=new Zt,y=new Zt;let B=null;const z=new Dt(0);let W=0,$=e.width,k=e.height,J=1,H=null,ct=null;const lt=new Zt(0,0,$,k),_t=new Zt(0,0,$,k);let Ht=!1;const Kt=new ia;let X=!1,Q=!1;const mt=new Yt,ht=new Yt,Ct=new w,Et=new Zt,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Jt=!1;function Ot(){return b===null?J:1}let C=n;function Ce(S,D){return e.getContext(S,D)}try{const S={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Yo}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",rt,!1),e.addEventListener("webglcontextcreationerror",at,!1),C===null){const D="webgl2";if(C=Ce(D,S),C===null)throw Ce(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ut,zt,At,te,Rt,A,M,N,Y,Z,q,vt,it,ut,kt,tt,ft,wt,bt,dt,Nt,Pt,jt,L;function ot(){Ut=new Ap(C),Ut.init(),Pt=new hg(C,Ut),zt=new xp(C,Ut,t,Pt),At=new ag(C),zt.reverseDepthBuffer&&At.buffers.depth.setReversed(!0),te=new Rp(C),Rt=new qm,A=new lg(C,Ut,At,Rt,zt,Pt,te),M=new Sp(x),N=new Tp(x),Y=new Uu(C),jt=new _p(C,Y),Z=new wp(C,Y,te,jt),q=new Pp(C,Z,Y,te),bt=new Cp(C,zt,A),tt=new Mp(Rt),vt=new Xm(x,M,N,Ut,zt,jt,tt),it=new vg(x,Rt),ut=new Km,kt=new tg(Ut),wt=new gp(x,M,N,At,q,p,c),ft=new sg(x,q,zt),L=new xg(C,te,zt,At),dt=new vp(C,Ut,te),Nt=new bp(C,Ut,te),te.programs=vt.programs,x.capabilities=zt,x.extensions=Ut,x.properties=Rt,x.renderLists=ut,x.shadowMap=ft,x.state=At,x.info=te}ot();const G=new gg(x,C);this.xr=G,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const S=Ut.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ut.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(S){S!==void 0&&(J=S,this.setSize($,k,!1))},this.getSize=function(S){return S.set($,k)},this.setSize=function(S,D,F=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=S,k=D,e.width=Math.floor(S*J),e.height=Math.floor(D*J),F===!0&&(e.style.width=S+"px",e.style.height=D+"px"),this.setViewport(0,0,S,D)},this.getDrawingBufferSize=function(S){return S.set($*J,k*J).floor()},this.setDrawingBufferSize=function(S,D,F){$=S,k=D,J=F,e.width=Math.floor(S*F),e.height=Math.floor(D*F),this.setViewport(0,0,S,D)},this.getCurrentViewport=function(S){return S.copy(_)},this.getViewport=function(S){return S.copy(lt)},this.setViewport=function(S,D,F,O){S.isVector4?lt.set(S.x,S.y,S.z,S.w):lt.set(S,D,F,O),At.viewport(_.copy(lt).multiplyScalar(J).round())},this.getScissor=function(S){return S.copy(_t)},this.setScissor=function(S,D,F,O){S.isVector4?_t.set(S.x,S.y,S.z,S.w):_t.set(S,D,F,O),At.scissor(y.copy(_t).multiplyScalar(J).round())},this.getScissorTest=function(){return Ht},this.setScissorTest=function(S){At.setScissorTest(Ht=S)},this.setOpaqueSort=function(S){H=S},this.setTransparentSort=function(S){ct=S},this.getClearColor=function(S){return S.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor.apply(wt,arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha.apply(wt,arguments)},this.clear=function(S=!0,D=!0,F=!0){let O=0;if(S){let U=!1;if(b!==null){const et=b.texture.format;U=et===Qo||et===jo||et===Zo}if(U){const et=b.texture.type,st=et===un||et===$n||et===Ki||et===Ai||et===$o||et===Jo,pt=wt.getClearColor(),gt=wt.getClearAlpha(),yt=pt.r,Tt=pt.g,xt=pt.b;st?(m[0]=yt,m[1]=Tt,m[2]=xt,m[3]=gt,C.clearBufferuiv(C.COLOR,0,m)):(g[0]=yt,g[1]=Tt,g[2]=xt,g[3]=gt,C.clearBufferiv(C.COLOR,0,g))}else O|=C.COLOR_BUFFER_BIT}D&&(O|=C.DEPTH_BUFFER_BIT,C.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),F&&(O|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",rt,!1),e.removeEventListener("webglcontextcreationerror",at,!1),ut.dispose(),kt.dispose(),Rt.dispose(),M.dispose(),N.dispose(),q.dispose(),jt.dispose(),L.dispose(),vt.dispose(),G.dispose(),G.removeEventListener("sessionstart",ga),G.removeEventListener("sessionend",_a),Dn.stop()};function K(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function rt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const S=te.autoReset,D=ft.enabled,F=ft.autoUpdate,O=ft.needsUpdate,U=ft.type;ot(),te.autoReset=S,ft.enabled=D,ft.autoUpdate=F,ft.needsUpdate=O,ft.type=U}function at(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Bt(S){const D=S.target;D.removeEventListener("dispose",Bt),se(D)}function se(S){Ae(S),Rt.remove(S)}function Ae(S){const D=Rt.get(S).programs;D!==void 0&&(D.forEach(function(F){vt.releaseProgram(F)}),S.isShaderMaterial&&vt.releaseShaderCache(S))}this.renderBufferDirect=function(S,D,F,O,U,et){D===null&&(D=Ft);const st=U.isMesh&&U.matrixWorld.determinant()<0,pt=Zl(S,D,F,O,U);At.setMaterial(O,st);let gt=F.index,yt=1;if(O.wireframe===!0){if(gt=Z.getWireframeAttribute(F),gt===void 0)return;yt=2}const Tt=F.drawRange,xt=F.attributes.position;let $t=Tt.start*yt,ee=(Tt.start+Tt.count)*yt;et!==null&&($t=Math.max($t,et.start*yt),ee=Math.min(ee,(et.start+et.count)*yt)),gt!==null?($t=Math.max($t,0),ee=Math.min(ee,gt.count)):xt!=null&&($t=Math.max($t,0),ee=Math.min(ee,xt.count));const ie=ee-$t;if(ie<0||ie===1/0)return;jt.setup(U,O,pt,F,gt);let Pe,Wt=dt;if(gt!==null&&(Pe=Y.get(gt),Wt=Nt,Wt.setIndex(Pe)),U.isMesh)O.wireframe===!0?(At.setLineWidth(O.wireframeLinewidth*Ot()),Wt.setMode(C.LINES)):Wt.setMode(C.TRIANGLES);else if(U.isLine){let Mt=O.linewidth;Mt===void 0&&(Mt=1),At.setLineWidth(Mt*Ot()),U.isLineSegments?Wt.setMode(C.LINES):U.isLineLoop?Wt.setMode(C.LINE_LOOP):Wt.setMode(C.LINE_STRIP)}else U.isPoints?Wt.setMode(C.POINTS):U.isSprite&&Wt.setMode(C.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Wt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ut.get("WEBGL_multi_draw"))Wt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Mt=U._multiDrawStarts,de=U._multiDrawCounts,Xt=U._multiDrawCount,Ve=gt?Y.get(gt).bytesPerElement:1,Qn=Rt.get(O).currentProgram.getUniforms();for(let Le=0;Le<Xt;Le++)Qn.setValue(C,"_gl_DrawID",Le),Wt.render(Mt[Le]/Ve,de[Le])}else if(U.isInstancedMesh)Wt.renderInstances($t,ie,U.count);else if(F.isInstancedBufferGeometry){const Mt=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,de=Math.min(F.instanceCount,Mt);Wt.renderInstances($t,ie,de)}else Wt.render($t,ie)};function Vt(S,D,F){S.transparent===!0&&S.side===Ye&&S.forceSinglePass===!1?(S.side=Te,S.needsUpdate=!0,ir(S,D,F),S.side=wn,S.needsUpdate=!0,ir(S,D,F),S.side=Ye):ir(S,D,F)}this.compile=function(S,D,F=null){F===null&&(F=S),u=kt.get(F),u.init(D),E.push(u),F.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(u.pushLight(U),U.castShadow&&u.pushShadow(U))}),S!==F&&S.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(u.pushLight(U),U.castShadow&&u.pushShadow(U))}),u.setupLights();const O=new Set;return S.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const et=U.material;if(et)if(Array.isArray(et))for(let st=0;st<et.length;st++){const pt=et[st];Vt(pt,F,U),O.add(pt)}else Vt(et,F,U),O.add(et)}),E.pop(),u=null,O},this.compileAsync=function(S,D,F=null){const O=this.compile(S,D,F);return new Promise(U=>{function et(){if(O.forEach(function(st){Rt.get(st).currentProgram.isReady()&&O.delete(st)}),O.size===0){U(S);return}setTimeout(et,10)}Ut.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let we=null;function tn(S){we&&we(S)}function ga(){Dn.stop()}function _a(){Dn.start()}const Dn=new yl;Dn.setAnimationLoop(tn),typeof self<"u"&&Dn.setContext(self),this.setAnimationLoop=function(S){we=S,G.setAnimationLoop(S),S===null?Dn.stop():Dn.start()},G.addEventListener("sessionstart",ga),G.addEventListener("sessionend",_a),this.render=function(S,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(D),D=G.getCamera()),S.isScene===!0&&S.onBeforeRender(x,S,D,b),u=kt.get(S,E.length),u.init(D),E.push(u),ht.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Kt.setFromProjectionMatrix(ht),Q=this.localClippingEnabled,X=tt.init(this.clippingPlanes,Q),v=ut.get(S,d.length),v.init(),d.push(v),G.enabled===!0&&G.isPresenting===!0){const et=x.xr.getDepthSensingMesh();et!==null&&us(et,D,-1/0,x.sortObjects)}us(S,D,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(H,ct),Jt=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Jt&&wt.addToRenderList(v,S),this.info.render.frame++,X===!0&&tt.beginShadows();const F=u.state.shadowsArray;ft.render(F,S,D),X===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const O=v.opaque,U=v.transmissive;if(u.setupLights(),D.isArrayCamera){const et=D.cameras;if(U.length>0)for(let st=0,pt=et.length;st<pt;st++){const gt=et[st];xa(O,U,S,gt)}Jt&&wt.render(S);for(let st=0,pt=et.length;st<pt;st++){const gt=et[st];va(v,S,gt,gt.viewport)}}else U.length>0&&xa(O,U,S,D),Jt&&wt.render(S),va(v,S,D);b!==null&&(A.updateMultisampleRenderTarget(b),A.updateRenderTargetMipmap(b)),S.isScene===!0&&S.onAfterRender(x,S,D),jt.resetDefaultState(),P=-1,V=null,E.pop(),E.length>0?(u=E[E.length-1],X===!0&&tt.setGlobalState(x.clippingPlanes,u.state.camera)):u=null,d.pop(),d.length>0?v=d[d.length-1]:v=null};function us(S,D,F,O){if(S.visible===!1)return;if(S.layers.test(D.layers)){if(S.isGroup)F=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(D);else if(S.isLight)u.pushLight(S),S.castShadow&&u.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Kt.intersectsSprite(S)){O&&Et.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ht);const st=q.update(S),pt=S.material;pt.visible&&v.push(S,st,pt,F,Et.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Kt.intersectsObject(S))){const st=q.update(S),pt=S.material;if(O&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Et.copy(S.boundingSphere.center)):(st.boundingSphere===null&&st.computeBoundingSphere(),Et.copy(st.boundingSphere.center)),Et.applyMatrix4(S.matrixWorld).applyMatrix4(ht)),Array.isArray(pt)){const gt=st.groups;for(let yt=0,Tt=gt.length;yt<Tt;yt++){const xt=gt[yt],$t=pt[xt.materialIndex];$t&&$t.visible&&v.push(S,st,$t,F,Et.z,xt)}}else pt.visible&&v.push(S,st,pt,F,Et.z,null)}}const et=S.children;for(let st=0,pt=et.length;st<pt;st++)us(et[st],D,F,O)}function va(S,D,F,O){const U=S.opaque,et=S.transmissive,st=S.transparent;u.setupLightsView(F),X===!0&&tt.setGlobalState(x.clippingPlanes,F),O&&At.viewport(_.copy(O)),U.length>0&&nr(U,D,F),et.length>0&&nr(et,D,F),st.length>0&&nr(st,D,F),At.buffers.depth.setTest(!0),At.buffers.depth.setMask(!0),At.buffers.color.setMask(!0),At.setPolygonOffset(!1)}function xa(S,D,F,O){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[O.id]===void 0&&(u.state.transmissionRenderTarget[O.id]=new Jn(1,1,{generateMipmaps:!0,type:Ut.has("EXT_color_buffer_half_float")||Ut.has("EXT_color_buffer_float")?ji:un,minFilter:qn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qt.workingColorSpace}));const et=u.state.transmissionRenderTarget[O.id],st=O.viewport||_;et.setSize(st.z,st.w);const pt=x.getRenderTarget();x.setRenderTarget(et),x.getClearColor(z),W=x.getClearAlpha(),W<1&&x.setClearColor(16777215,.5),x.clear(),Jt&&wt.render(F);const gt=x.toneMapping;x.toneMapping=An;const yt=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),u.setupLightsView(O),X===!0&&tt.setGlobalState(x.clippingPlanes,O),nr(S,F,O),A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et),Ut.has("WEBGL_multisampled_render_to_texture")===!1){let Tt=!1;for(let xt=0,$t=D.length;xt<$t;xt++){const ee=D[xt],ie=ee.object,Pe=ee.geometry,Wt=ee.material,Mt=ee.group;if(Wt.side===Ye&&ie.layers.test(O.layers)){const de=Wt.side;Wt.side=Te,Wt.needsUpdate=!0,Ma(ie,F,O,Pe,Wt,Mt),Wt.side=de,Wt.needsUpdate=!0,Tt=!0}}Tt===!0&&(A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et))}x.setRenderTarget(pt),x.setClearColor(z,W),yt!==void 0&&(O.viewport=yt),x.toneMapping=gt}function nr(S,D,F){const O=D.isScene===!0?D.overrideMaterial:null;for(let U=0,et=S.length;U<et;U++){const st=S[U],pt=st.object,gt=st.geometry,yt=O===null?st.material:O,Tt=st.group;pt.layers.test(F.layers)&&Ma(pt,D,F,gt,yt,Tt)}}function Ma(S,D,F,O,U,et){S.onBeforeRender(x,D,F,O,U,et),S.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),U.onBeforeRender(x,D,F,O,S,et),U.transparent===!0&&U.side===Ye&&U.forceSinglePass===!1?(U.side=Te,U.needsUpdate=!0,x.renderBufferDirect(F,D,O,U,S,et),U.side=wn,U.needsUpdate=!0,x.renderBufferDirect(F,D,O,U,S,et),U.side=Ye):x.renderBufferDirect(F,D,O,U,S,et),S.onAfterRender(x,D,F,O,U,et)}function ir(S,D,F){D.isScene!==!0&&(D=Ft);const O=Rt.get(S),U=u.state.lights,et=u.state.shadowsArray,st=U.state.version,pt=vt.getParameters(S,U.state,et,D,F),gt=vt.getProgramCacheKey(pt);let yt=O.programs;O.environment=S.isMeshStandardMaterial?D.environment:null,O.fog=D.fog,O.envMap=(S.isMeshStandardMaterial?N:M).get(S.envMap||O.environment),O.envMapRotation=O.environment!==null&&S.envMap===null?D.environmentRotation:S.envMapRotation,yt===void 0&&(S.addEventListener("dispose",Bt),yt=new Map,O.programs=yt);let Tt=yt.get(gt);if(Tt!==void 0){if(O.currentProgram===Tt&&O.lightsStateVersion===st)return ya(S,pt),Tt}else pt.uniforms=vt.getUniforms(S),S.onBeforeCompile(pt,x),Tt=vt.acquireProgram(pt,gt),yt.set(gt,Tt),O.uniforms=pt.uniforms;const xt=O.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(xt.clippingPlanes=tt.uniform),ya(S,pt),O.needsLights=Ql(S),O.lightsStateVersion=st,O.needsLights&&(xt.ambientLightColor.value=U.state.ambient,xt.lightProbe.value=U.state.probe,xt.directionalLights.value=U.state.directional,xt.directionalLightShadows.value=U.state.directionalShadow,xt.spotLights.value=U.state.spot,xt.spotLightShadows.value=U.state.spotShadow,xt.rectAreaLights.value=U.state.rectArea,xt.ltc_1.value=U.state.rectAreaLTC1,xt.ltc_2.value=U.state.rectAreaLTC2,xt.pointLights.value=U.state.point,xt.pointLightShadows.value=U.state.pointShadow,xt.hemisphereLights.value=U.state.hemi,xt.directionalShadowMap.value=U.state.directionalShadowMap,xt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,xt.spotShadowMap.value=U.state.spotShadowMap,xt.spotLightMatrix.value=U.state.spotLightMatrix,xt.spotLightMap.value=U.state.spotLightMap,xt.pointShadowMap.value=U.state.pointShadowMap,xt.pointShadowMatrix.value=U.state.pointShadowMatrix),O.currentProgram=Tt,O.uniformsList=null,Tt}function Sa(S){if(S.uniformsList===null){const D=S.currentProgram.getUniforms();S.uniformsList=Wr.seqWithValue(D.seq,S.uniforms)}return S.uniformsList}function ya(S,D){const F=Rt.get(S);F.outputColorSpace=D.outputColorSpace,F.batching=D.batching,F.batchingColor=D.batchingColor,F.instancing=D.instancing,F.instancingColor=D.instancingColor,F.instancingMorph=D.instancingMorph,F.skinning=D.skinning,F.morphTargets=D.morphTargets,F.morphNormals=D.morphNormals,F.morphColors=D.morphColors,F.morphTargetsCount=D.morphTargetsCount,F.numClippingPlanes=D.numClippingPlanes,F.numIntersection=D.numClipIntersection,F.vertexAlphas=D.vertexAlphas,F.vertexTangents=D.vertexTangents,F.toneMapping=D.toneMapping}function Zl(S,D,F,O,U){D.isScene!==!0&&(D=Ft),A.resetTextureUnits();const et=D.fog,st=O.isMeshStandardMaterial?D.environment:null,pt=b===null?x.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Ln,gt=(O.isMeshStandardMaterial?N:M).get(O.envMap||st),yt=O.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Tt=!!F.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),xt=!!F.morphAttributes.position,$t=!!F.morphAttributes.normal,ee=!!F.morphAttributes.color;let ie=An;O.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(ie=x.toneMapping);const Pe=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Wt=Pe!==void 0?Pe.length:0,Mt=Rt.get(O),de=u.state.lights;if(X===!0&&(Q===!0||S!==V)){const Be=S===V&&O.id===P;tt.setState(O,S,Be)}let Xt=!1;O.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==de.state.version||Mt.outputColorSpace!==pt||U.isBatchedMesh&&Mt.batching===!1||!U.isBatchedMesh&&Mt.batching===!0||U.isBatchedMesh&&Mt.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Mt.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Mt.instancing===!1||!U.isInstancedMesh&&Mt.instancing===!0||U.isSkinnedMesh&&Mt.skinning===!1||!U.isSkinnedMesh&&Mt.skinning===!0||U.isInstancedMesh&&Mt.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Mt.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Mt.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Mt.instancingMorph===!1&&U.morphTexture!==null||Mt.envMap!==gt||O.fog===!0&&Mt.fog!==et||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==tt.numPlanes||Mt.numIntersection!==tt.numIntersection)||Mt.vertexAlphas!==yt||Mt.vertexTangents!==Tt||Mt.morphTargets!==xt||Mt.morphNormals!==$t||Mt.morphColors!==ee||Mt.toneMapping!==ie||Mt.morphTargetsCount!==Wt)&&(Xt=!0):(Xt=!0,Mt.__version=O.version);let Ve=Mt.currentProgram;Xt===!0&&(Ve=ir(O,D,U));let Qn=!1,Le=!1,fs=!1;const re=Ve.getUniforms(),gn=Mt.uniforms;if(At.useProgram(Ve.program)&&(Qn=!0,Le=!0,fs=!0),O.id!==P&&(P=O.id,Le=!0),Qn||V!==S){zt.reverseDepthBuffer?(mt.copy(S.projectionMatrix),cu(mt),lu(mt),re.setValue(C,"projectionMatrix",mt)):re.setValue(C,"projectionMatrix",S.projectionMatrix),re.setValue(C,"viewMatrix",S.matrixWorldInverse);const Be=re.map.cameraPosition;Be!==void 0&&Be.setValue(C,Ct.setFromMatrixPosition(S.matrixWorld)),zt.logarithmicDepthBuffer&&re.setValue(C,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&re.setValue(C,"isOrthographic",S.isOrthographicCamera===!0),V!==S&&(V=S,Le=!0,fs=!0)}if(U.isSkinnedMesh){re.setOptional(C,U,"bindMatrix"),re.setOptional(C,U,"bindMatrixInverse");const Be=U.skeleton;Be&&(Be.boneTexture===null&&Be.computeBoneTexture(),re.setValue(C,"boneTexture",Be.boneTexture,A))}U.isBatchedMesh&&(re.setOptional(C,U,"batchingTexture"),re.setValue(C,"batchingTexture",U._matricesTexture,A),re.setOptional(C,U,"batchingIdTexture"),re.setValue(C,"batchingIdTexture",U._indirectTexture,A),re.setOptional(C,U,"batchingColorTexture"),U._colorsTexture!==null&&re.setValue(C,"batchingColorTexture",U._colorsTexture,A));const ds=F.morphAttributes;if((ds.position!==void 0||ds.normal!==void 0||ds.color!==void 0)&&bt.update(U,F,Ve),(Le||Mt.receiveShadow!==U.receiveShadow)&&(Mt.receiveShadow=U.receiveShadow,re.setValue(C,"receiveShadow",U.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(gn.envMap.value=gt,gn.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),O.isMeshStandardMaterial&&O.envMap===null&&D.environment!==null&&(gn.envMapIntensity.value=D.environmentIntensity),Le&&(re.setValue(C,"toneMappingExposure",x.toneMappingExposure),Mt.needsLights&&jl(gn,fs),et&&O.fog===!0&&it.refreshFogUniforms(gn,et),it.refreshMaterialUniforms(gn,O,J,k,u.state.transmissionRenderTarget[S.id]),Wr.upload(C,Sa(Mt),gn,A)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Wr.upload(C,Sa(Mt),gn,A),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&re.setValue(C,"center",U.center),re.setValue(C,"modelViewMatrix",U.modelViewMatrix),re.setValue(C,"normalMatrix",U.normalMatrix),re.setValue(C,"modelMatrix",U.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){const Be=O.uniformsGroups;for(let ps=0,th=Be.length;ps<th;ps++){const Ea=Be[ps];L.update(Ea,Ve),L.bind(Ea,Ve)}}return Ve}function jl(S,D){S.ambientLightColor.needsUpdate=D,S.lightProbe.needsUpdate=D,S.directionalLights.needsUpdate=D,S.directionalLightShadows.needsUpdate=D,S.pointLights.needsUpdate=D,S.pointLightShadows.needsUpdate=D,S.spotLights.needsUpdate=D,S.spotLightShadows.needsUpdate=D,S.rectAreaLights.needsUpdate=D,S.hemisphereLights.needsUpdate=D}function Ql(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(S,D,F){Rt.get(S.texture).__webglTexture=D,Rt.get(S.depthTexture).__webglTexture=F;const O=Rt.get(S);O.__hasExternalTextures=!0,O.__autoAllocateDepthBuffer=F===void 0,O.__autoAllocateDepthBuffer||Ut.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),O.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,D){const F=Rt.get(S);F.__webglFramebuffer=D,F.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(S,D=0,F=0){b=S,I=D,R=F;let O=!0,U=null,et=!1,st=!1;if(S){const gt=Rt.get(S);if(gt.__useDefaultFramebuffer!==void 0)At.bindFramebuffer(C.FRAMEBUFFER,null),O=!1;else if(gt.__webglFramebuffer===void 0)A.setupRenderTarget(S);else if(gt.__hasExternalTextures)A.rebindTextures(S,Rt.get(S.texture).__webglTexture,Rt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const xt=S.depthTexture;if(gt.__boundDepthTexture!==xt){if(xt!==null&&Rt.has(xt)&&(S.width!==xt.image.width||S.height!==xt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(S)}}const yt=S.texture;(yt.isData3DTexture||yt.isDataArrayTexture||yt.isCompressedArrayTexture)&&(st=!0);const Tt=Rt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Tt[D])?U=Tt[D][F]:U=Tt[D],et=!0):S.samples>0&&A.useMultisampledRTT(S)===!1?U=Rt.get(S).__webglMultisampledFramebuffer:Array.isArray(Tt)?U=Tt[F]:U=Tt,_.copy(S.viewport),y.copy(S.scissor),B=S.scissorTest}else _.copy(lt).multiplyScalar(J).floor(),y.copy(_t).multiplyScalar(J).floor(),B=Ht;if(At.bindFramebuffer(C.FRAMEBUFFER,U)&&O&&At.drawBuffers(S,U),At.viewport(_),At.scissor(y),At.setScissorTest(B),et){const gt=Rt.get(S.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+D,gt.__webglTexture,F)}else if(st){const gt=Rt.get(S.texture),yt=D||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,gt.__webglTexture,F||0,yt)}P=-1},this.readRenderTargetPixels=function(S,D,F,O,U,et,st){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=Rt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&st!==void 0&&(pt=pt[st]),pt){At.bindFramebuffer(C.FRAMEBUFFER,pt);try{const gt=S.texture,yt=gt.format,Tt=gt.type;if(!zt.textureFormatReadable(yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!zt.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=S.width-O&&F>=0&&F<=S.height-U&&C.readPixels(D,F,O,U,Pt.convert(yt),Pt.convert(Tt),et)}finally{const gt=b!==null?Rt.get(b).__webglFramebuffer:null;At.bindFramebuffer(C.FRAMEBUFFER,gt)}}},this.readRenderTargetPixelsAsync=async function(S,D,F,O,U,et,st){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=Rt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&st!==void 0&&(pt=pt[st]),pt){const gt=S.texture,yt=gt.format,Tt=gt.type;if(!zt.textureFormatReadable(yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!zt.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=S.width-O&&F>=0&&F<=S.height-U){At.bindFramebuffer(C.FRAMEBUFFER,pt);const xt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,xt),C.bufferData(C.PIXEL_PACK_BUFFER,et.byteLength,C.STREAM_READ),C.readPixels(D,F,O,U,Pt.convert(yt),Pt.convert(Tt),0);const $t=b!==null?Rt.get(b).__webglFramebuffer:null;At.bindFramebuffer(C.FRAMEBUFFER,$t);const ee=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await au(C,ee,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,xt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,et),C.deleteBuffer(xt),C.deleteSync(ee),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,D=null,F=0){S.isTexture!==!0&&(Vr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,S=arguments[1]);const O=Math.pow(2,-F),U=Math.floor(S.image.width*O),et=Math.floor(S.image.height*O),st=D!==null?D.x:0,pt=D!==null?D.y:0;A.setTexture2D(S,0),C.copyTexSubImage2D(C.TEXTURE_2D,F,0,0,st,pt,U,et),At.unbindTexture()},this.copyTextureToTexture=function(S,D,F=null,O=null,U=0){S.isTexture!==!0&&(Vr("WebGLRenderer: copyTextureToTexture function signature has changed."),O=arguments[0]||null,S=arguments[1],D=arguments[2],U=arguments[3]||0,F=null);let et,st,pt,gt,yt,Tt;F!==null?(et=F.max.x-F.min.x,st=F.max.y-F.min.y,pt=F.min.x,gt=F.min.y):(et=S.image.width,st=S.image.height,pt=0,gt=0),O!==null?(yt=O.x,Tt=O.y):(yt=0,Tt=0);const xt=Pt.convert(D.format),$t=Pt.convert(D.type);A.setTexture2D(D,0),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,D.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,D.unpackAlignment);const ee=C.getParameter(C.UNPACK_ROW_LENGTH),ie=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Pe=C.getParameter(C.UNPACK_SKIP_PIXELS),Wt=C.getParameter(C.UNPACK_SKIP_ROWS),Mt=C.getParameter(C.UNPACK_SKIP_IMAGES),de=S.isCompressedTexture?S.mipmaps[U]:S.image;C.pixelStorei(C.UNPACK_ROW_LENGTH,de.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,de.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,pt),C.pixelStorei(C.UNPACK_SKIP_ROWS,gt),S.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,U,yt,Tt,et,st,xt,$t,de.data):S.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,U,yt,Tt,de.width,de.height,xt,de.data):C.texSubImage2D(C.TEXTURE_2D,U,yt,Tt,et,st,xt,$t,de),C.pixelStorei(C.UNPACK_ROW_LENGTH,ee),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ie),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Pe),C.pixelStorei(C.UNPACK_SKIP_ROWS,Wt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Mt),U===0&&D.generateMipmaps&&C.generateMipmap(C.TEXTURE_2D),At.unbindTexture()},this.copyTextureToTexture3D=function(S,D,F=null,O=null,U=0){S.isTexture!==!0&&(Vr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),F=arguments[0]||null,O=arguments[1]||null,S=arguments[2],D=arguments[3],U=arguments[4]||0);let et,st,pt,gt,yt,Tt,xt,$t,ee;const ie=S.isCompressedTexture?S.mipmaps[U]:S.image;F!==null?(et=F.max.x-F.min.x,st=F.max.y-F.min.y,pt=F.max.z-F.min.z,gt=F.min.x,yt=F.min.y,Tt=F.min.z):(et=ie.width,st=ie.height,pt=ie.depth,gt=0,yt=0,Tt=0),O!==null?(xt=O.x,$t=O.y,ee=O.z):(xt=0,$t=0,ee=0);const Pe=Pt.convert(D.format),Wt=Pt.convert(D.type);let Mt;if(D.isData3DTexture)A.setTexture3D(D,0),Mt=C.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)A.setTexture2DArray(D,0),Mt=C.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,D.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,D.unpackAlignment);const de=C.getParameter(C.UNPACK_ROW_LENGTH),Xt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Ve=C.getParameter(C.UNPACK_SKIP_PIXELS),Qn=C.getParameter(C.UNPACK_SKIP_ROWS),Le=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,ie.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ie.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,gt),C.pixelStorei(C.UNPACK_SKIP_ROWS,yt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Tt),S.isDataTexture||S.isData3DTexture?C.texSubImage3D(Mt,U,xt,$t,ee,et,st,pt,Pe,Wt,ie.data):D.isCompressedArrayTexture?C.compressedTexSubImage3D(Mt,U,xt,$t,ee,et,st,pt,Pe,ie.data):C.texSubImage3D(Mt,U,xt,$t,ee,et,st,pt,Pe,Wt,ie),C.pixelStorei(C.UNPACK_ROW_LENGTH,de),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Xt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ve),C.pixelStorei(C.UNPACK_SKIP_ROWS,Qn),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Le),U===0&&D.generateMipmaps&&C.generateMipmap(Mt),At.unbindTexture()},this.initRenderTarget=function(S){Rt.get(S).__webglFramebuffer===void 0&&A.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?A.setTextureCube(S,0):S.isData3DTexture?A.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?A.setTexture2DArray(S,0):A.setTexture2D(S,0),At.unbindTexture()},this.resetState=function(){I=0,R=0,b=null,At.reset(),jt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===ta?"display-p3":"srgb",e.unpackColorSpace=qt.workingColorSpace===rs?"display-p3":"srgb"}}class sa{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Dt(t),this.density=e}clone(){return new sa(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Sg extends ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Oe,this.environmentIntensity=1,this.environmentRotation=new Oe,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Cl extends Zn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Dt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const jr=new w,Qr=new w,vc=new Yt,Bi=new ss,Ar=new tr,Ws=new w,xc=new w;class yg extends ce{constructor(t=new fe,e=new Cl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let r=1,s=e.count;r<s;r++)jr.fromBufferAttribute(e,r-1),Qr.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=jr.distanceTo(Qr);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(r),Ar.radius+=s,t.ray.intersectsSphere(Ar)===!1)return;vc.copy(r).invert(),Bi.copy(t.ray).applyMatrix4(vc);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){const m=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=m,u=g-1;v<u;v+=l){const d=h.getX(v),E=h.getX(v+1),x=wr(this,t,Bi,c,d,E);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(g-1),u=h.getX(m),d=wr(this,t,Bi,c,v,u);d&&e.push(d)}}else{const m=Math.max(0,o.start),g=Math.min(p.count,o.start+o.count);for(let v=m,u=g-1;v<u;v+=l){const d=wr(this,t,Bi,c,v,v+1);d&&e.push(d)}if(this.isLineLoop){const v=wr(this,t,Bi,c,g-1,m);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function wr(i,t,e,n,r,s){const o=i.geometry.attributes.position;if(jr.fromBufferAttribute(o,r),Qr.fromBufferAttribute(o,s),e.distanceSqToSegment(jr,Qr,Ws,xc)>n)return;Ws.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ws);if(!(c<t.near||c>t.far))return{distance:c,point:xc.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const Mc=new w,Sc=new w;class Eg extends yg{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let r=0,s=e.count;r<s;r+=2)Mc.fromBufferAttribute(e,r),Sc.fromBufferAttribute(e,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Mc.distanceTo(Sc);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Pl extends Zn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const yc=new Yt,ko=new ss,br=new tr,Rr=new w;class Tg extends ce{constructor(t=new fe,e=new Pl){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),br.copy(n.boundingSphere),br.applyMatrix4(r),br.radius+=s,t.ray.intersectsSphere(br)===!1)return;yc.copy(r).invert(),ko.copy(t.ray).applyMatrix4(yc);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){const p=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let g=p,v=m;g<v;g++){const u=l.getX(g);Rr.fromBufferAttribute(f,u),Ec(Rr,u,c,r,t,e,this)}}else{const p=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let g=p,v=m;g<v;g++)Rr.fromBufferAttribute(f,g),Ec(Rr,g,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ec(i,t,e,n,r,s,o){const a=ko.distanceSqToPoint(i);if(a<e){const c=new w;ko.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class mn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let r=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=n[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===o)return r/(s-1);const h=n[r],p=n[r+1]-h,m=(o-h)/p;return(r+m)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=e||(o.isVector2?new St:new w);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new w,r=[],s=[],o=[],a=new w,c=new Yt;for(let m=0;m<=t;m++){const g=m/t;r[m]=this.getTangentAt(g,new w)}s[0]=new w,o[0]=new w;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),f=Math.abs(r[0].y),p=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),f<=l&&(l=f,n.set(0,1,0)),p<=l&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let m=1;m<=t;m++){if(s[m]=s[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(r[m-1],r[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(pe(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(c.makeRotationAxis(a,g))}o[m].crossVectors(r[m],s[m])}if(e===!0){let m=Math.acos(pe(s[0].dot(s[t]),-1,1));m/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(m=-m);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],m*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ll extends mn{constructor(t=0,e=0,n=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new St){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),p=c-this.aX,m=l-this.aY;c=p*h-m*f+this.aX,l=p*f+m*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Ag extends Ll{constructor(t,e,n,r,s,o){super(t,e,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function oa(){let i=0,t=0,e=0,n=0;function r(s,o,a,c){i=s,t=a,e=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,h,f){let p=(o-s)/l-(a-s)/(l+h)+(a-o)/h,m=(a-o)/h-(c-o)/(h+f)+(c-a)/f;p*=h,m*=h,r(o,a,p,m)},calc:function(s){const o=s*s,a=o*s;return i+t*s+e*o+n*a}}}const Cr=new w,Xs=new oa,qs=new oa,Ys=new oa;class Il extends mn{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new w){const n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,h;this.closed||a>0?l=r[(a-1)%s]:(Cr.subVectors(r[0],r[1]).add(r[0]),l=Cr);const f=r[a%s],p=r[(a+1)%s];if(this.closed||a+2<s?h=r[(a+2)%s]:(Cr.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Cr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(f),m),v=Math.pow(f.distanceToSquared(p),m),u=Math.pow(p.distanceToSquared(h),m);v<1e-4&&(v=1),g<1e-4&&(g=v),u<1e-4&&(u=v),Xs.initNonuniformCatmullRom(l.x,f.x,p.x,h.x,g,v,u),qs.initNonuniformCatmullRom(l.y,f.y,p.y,h.y,g,v,u),Ys.initNonuniformCatmullRom(l.z,f.z,p.z,h.z,g,v,u)}else this.curveType==="catmullrom"&&(Xs.initCatmullRom(l.x,f.x,p.x,h.x,this.tension),qs.initCatmullRom(l.y,f.y,p.y,h.y,this.tension),Ys.initCatmullRom(l.z,f.z,p.z,h.z,this.tension));return n.set(Xs.calc(c),qs.calc(c),Ys.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new w().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Tc(i,t,e,n,r){const s=(n-t)*.5,o=(r-e)*.5,a=i*i,c=i*a;return(2*e-2*n+s+o)*c+(-3*e+3*n-2*s-o)*a+s*i+e}function wg(i,t){const e=1-i;return e*e*t}function bg(i,t){return 2*(1-i)*i*t}function Rg(i,t){return i*i*t}function Wi(i,t,e,n){return wg(i,t)+bg(i,e)+Rg(i,n)}function Cg(i,t){const e=1-i;return e*e*e*t}function Pg(i,t){const e=1-i;return 3*e*e*i*t}function Lg(i,t){return 3*(1-i)*i*i*t}function Ig(i,t){return i*i*i*t}function Xi(i,t,e,n,r){return Cg(i,t)+Pg(i,e)+Lg(i,n)+Ig(i,r)}class Dg extends mn{constructor(t=new St,e=new St,n=new St,r=new St){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new St){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Xi(t,r.x,s.x,o.x,a.x),Xi(t,r.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ug extends mn{constructor(t=new w,e=new w,n=new w,r=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new w){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Xi(t,r.x,s.x,o.x,a.x),Xi(t,r.y,s.y,o.y,a.y),Xi(t,r.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ng extends mn{constructor(t=new St,e=new St){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new St){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new St){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fg extends mn{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Og extends mn{constructor(t=new St,e=new St,n=new St){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new St){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(Wi(t,r.x,s.x,o.x),Wi(t,r.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dl extends mn{constructor(t=new w,e=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new w){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(Wi(t,r.x,s.x,o.x),Wi(t,r.y,s.y,o.y),Wi(t,r.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bg extends mn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new St){const n=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],h=r[o>r.length-2?r.length-1:o+1],f=r[o>r.length-3?r.length-1:o+2];return n.set(Tc(a,c.x,l.x,h.x,f.x),Tc(a,c.y,l.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new St().fromArray(r))}return this}}var zg=Object.freeze({__proto__:null,ArcCurve:Ag,CatmullRomCurve3:Il,CubicBezierCurve:Dg,CubicBezierCurve3:Ug,EllipseCurve:Ll,LineCurve:Ng,LineCurve3:Fg,QuadraticBezierCurve:Og,QuadraticBezierCurve3:Dl,SplineCurve:Bg});class as extends fe{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],f=[],p=[],m=[];let g=0;const v=[],u=n/2;let d=0;E(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Qt(f,3)),this.setAttribute("normal",new Qt(p,3)),this.setAttribute("uv",new Qt(m,2));function E(){const T=new w,I=new w;let R=0;const b=(e-t)/n;for(let P=0;P<=s;P++){const V=[],_=P/s,y=_*(e-t)+t;for(let B=0;B<=r;B++){const z=B/r,W=z*c+a,$=Math.sin(W),k=Math.cos(W);I.x=y*$,I.y=-_*n+u,I.z=y*k,f.push(I.x,I.y,I.z),T.set($,b,k).normalize(),p.push(T.x,T.y,T.z),m.push(z,1-_),V.push(g++)}v.push(V)}for(let P=0;P<r;P++)for(let V=0;V<s;V++){const _=v[V][P],y=v[V+1][P],B=v[V+1][P+1],z=v[V][P+1];t>0&&(h.push(_,y,z),R+=3),e>0&&(h.push(y,B,z),R+=3)}l.addGroup(d,R,0),d+=R}function x(T){const I=g,R=new St,b=new w;let P=0;const V=T===!0?t:e,_=T===!0?1:-1;for(let B=1;B<=r;B++)f.push(0,u*_,0),p.push(0,_,0),m.push(.5,.5),g++;const y=g;for(let B=0;B<=r;B++){const W=B/r*c+a,$=Math.cos(W),k=Math.sin(W);b.x=V*k,b.y=u*_,b.z=V*$,f.push(b.x,b.y,b.z),p.push(0,_,0),R.x=$*.5+.5,R.y=k*.5*_+.5,m.push(R.x,R.y),g++}for(let B=0;B<r;B++){const z=I+B,W=y+B;T===!0?h.push(W,W+1,z):h.push(W+1,W,z),P+=3}l.addGroup(d,P,T===!0?1:2),d+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new as(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class cs extends as{constructor(t=1,e=1,n=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new cs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Li extends fe{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],o=[];a(r),l(n),h(),this.setAttribute("position",new Qt(s,3)),this.setAttribute("normal",new Qt(s.slice(),3)),this.setAttribute("uv",new Qt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(E){const x=new w,T=new w,I=new w;for(let R=0;R<e.length;R+=3)m(e[R+0],x),m(e[R+1],T),m(e[R+2],I),c(x,T,I,E)}function c(E,x,T,I){const R=I+1,b=[];for(let P=0;P<=R;P++){b[P]=[];const V=E.clone().lerp(T,P/R),_=x.clone().lerp(T,P/R),y=R-P;for(let B=0;B<=y;B++)B===0&&P===R?b[P][B]=V:b[P][B]=V.clone().lerp(_,B/y)}for(let P=0;P<R;P++)for(let V=0;V<2*(R-P)-1;V++){const _=Math.floor(V/2);V%2===0?(p(b[P][_+1]),p(b[P+1][_]),p(b[P][_])):(p(b[P][_+1]),p(b[P+1][_+1]),p(b[P+1][_]))}}function l(E){const x=new w;for(let T=0;T<s.length;T+=3)x.x=s[T+0],x.y=s[T+1],x.z=s[T+2],x.normalize().multiplyScalar(E),s[T+0]=x.x,s[T+1]=x.y,s[T+2]=x.z}function h(){const E=new w;for(let x=0;x<s.length;x+=3){E.x=s[x+0],E.y=s[x+1],E.z=s[x+2];const T=u(E)/2/Math.PI+.5,I=d(E)/Math.PI+.5;o.push(T,1-I)}g(),f()}function f(){for(let E=0;E<o.length;E+=6){const x=o[E+0],T=o[E+2],I=o[E+4],R=Math.max(x,T,I),b=Math.min(x,T,I);R>.9&&b<.1&&(x<.2&&(o[E+0]+=1),T<.2&&(o[E+2]+=1),I<.2&&(o[E+4]+=1))}}function p(E){s.push(E.x,E.y,E.z)}function m(E,x){const T=E*3;x.x=t[T+0],x.y=t[T+1],x.z=t[T+2]}function g(){const E=new w,x=new w,T=new w,I=new w,R=new St,b=new St,P=new St;for(let V=0,_=0;V<s.length;V+=9,_+=6){E.set(s[V+0],s[V+1],s[V+2]),x.set(s[V+3],s[V+4],s[V+5]),T.set(s[V+6],s[V+7],s[V+8]),R.set(o[_+0],o[_+1]),b.set(o[_+2],o[_+3]),P.set(o[_+4],o[_+5]),I.copy(E).add(x).add(T).divideScalar(3);const y=u(I);v(R,_+0,E,y),v(b,_+2,x,y),v(P,_+4,T,y)}}function v(E,x,T,I){I<0&&E.x===1&&(o[x]=E.x-1),T.x===0&&T.z===0&&(o[x]=I/2/Math.PI+.5)}function u(E){return Math.atan2(E.z,-E.x)}function d(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Li(t.vertices,t.indices,t.radius,t.details)}}class aa extends Li{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new aa(t.radius,t.detail)}}const Pr=new w,Lr=new w,Ks=new w,Ir=new ke;class kg extends fe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const r=Math.pow(10,4),s=Math.cos(vi*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),p={},m=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:v,b:u,c:d}=Ir;if(v.fromBufferAttribute(a,l[0]),u.fromBufferAttribute(a,l[1]),d.fromBufferAttribute(a,l[2]),Ir.getNormal(Ks),f[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,f[1]=`${Math.round(u.x*r)},${Math.round(u.y*r)},${Math.round(u.z*r)}`,f[2]=`${Math.round(d.x*r)},${Math.round(d.y*r)},${Math.round(d.z*r)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let E=0;E<3;E++){const x=(E+1)%3,T=f[E],I=f[x],R=Ir[h[E]],b=Ir[h[x]],P=`${T}_${I}`,V=`${I}_${T}`;V in p&&p[V]?(Ks.dot(p[V].normal)<=s&&(m.push(R.x,R.y,R.z),m.push(b.x,b.y,b.z)),p[V]=null):P in p||(p[P]={index0:l[E],index1:l[x],normal:Ks.clone()})}}for(const g in p)if(p[g]){const{index0:v,index1:u}=p[g];Pr.fromBufferAttribute(a,v),Lr.fromBufferAttribute(a,u),m.push(Pr.x,Pr.y,Pr.z),m.push(Lr.x,Lr.y,Lr.z)}this.setAttribute("position",new Qt(m,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Ii extends Li{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ii(t.radius,t.detail)}}class ca extends Li{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,r,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ca(t.radius,t.detail)}}class ls extends fe{constructor(t=.5,e=1,n=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:o},n=Math.max(3,n),r=Math.max(1,r);const a=[],c=[],l=[],h=[];let f=t;const p=(e-t)/r,m=new w,g=new St;for(let v=0;v<=r;v++){for(let u=0;u<=n;u++){const d=s+u/n*o;m.x=f*Math.cos(d),m.y=f*Math.sin(d),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/e+1)/2,g.y=(m.y/e+1)/2,h.push(g.x,g.y)}f+=p}for(let v=0;v<r;v++){const u=v*(n+1);for(let d=0;d<n;d++){const E=d+u,x=E,T=E+n+1,I=E+n+2,R=E+1;a.push(x,T,R),a.push(T,I,R)}}this.setIndex(a),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(l,3)),this.setAttribute("uv",new Qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ls(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Cn extends fe{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],f=new w,p=new w,m=[],g=[],v=[],u=[];for(let d=0;d<=n;d++){const E=[],x=d/n;let T=0;d===0&&o===0?T=.5/e:d===n&&c===Math.PI&&(T=-.5/e);for(let I=0;I<=e;I++){const R=I/e;f.x=-t*Math.cos(r+R*s)*Math.sin(o+x*a),f.y=t*Math.cos(o+x*a),f.z=t*Math.sin(r+R*s)*Math.sin(o+x*a),g.push(f.x,f.y,f.z),p.copy(f).normalize(),v.push(p.x,p.y,p.z),u.push(R+T,1-x),E.push(l++)}h.push(E)}for(let d=0;d<n;d++)for(let E=0;E<e;E++){const x=h[d][E+1],T=h[d][E],I=h[d+1][E],R=h[d+1][E+1];(d!==0||o>0)&&m.push(x,T,R),(d!==n-1||c<Math.PI)&&m.push(T,I,R)}this.setIndex(m),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(v,3)),this.setAttribute("uv",new Qt(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class la extends Li{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],r=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,r,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new la(t.radius,t.detail)}}class ha extends fe{constructor(t=new Dl(new w(-1,-1,0),new w(-1,1,0),new w(1,1,0)),e=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:r,closed:s};const o=t.computeFrenetFrames(e,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new w,c=new w,l=new St;let h=new w;const f=[],p=[],m=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Qt(f,3)),this.setAttribute("normal",new Qt(p,3)),this.setAttribute("uv",new Qt(m,2));function v(){for(let x=0;x<e;x++)u(x);u(s===!1?e:0),E(),d()}function u(x){h=t.getPointAt(x/e,h);const T=o.normals[x],I=o.binormals[x];for(let R=0;R<=r;R++){const b=R/r*Math.PI*2,P=Math.sin(b),V=-Math.cos(b);c.x=V*T.x+P*I.x,c.y=V*T.y+P*I.y,c.z=V*T.z+P*I.z,c.normalize(),p.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,f.push(a.x,a.y,a.z)}}function d(){for(let x=1;x<=e;x++)for(let T=1;T<=r;T++){const I=(r+1)*(x-1)+(T-1),R=(r+1)*x+(T-1),b=(r+1)*x+T,P=(r+1)*(x-1)+T;g.push(I,R,P),g.push(R,b,P)}}function E(){for(let x=0;x<=e;x++)for(let T=0;T<=r;T++)l.x=x/e,l.y=T/r,m.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new ha(new zg[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class be extends Zn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ul,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Oe,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ua extends ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Dt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Gg extends ua{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Dt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const $s=new Yt,Ac=new w,wc=new w;class Ul{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.map=null,this.mapPass=null,this.matrix=new Yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ia,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new Zt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ac.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ac),wc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(wc),e.updateMatrixWorld(),$s.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix($s),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply($s)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const bc=new Yt,zi=new w,Js=new w;class Hg extends Ul{constructor(){super(new Ue(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new St(4,2),this._viewportCount=6,this._viewports=[new Zt(2,1,1,1),new Zt(0,1,1,1),new Zt(3,1,1,1),new Zt(1,1,1,1),new Zt(3,0,1,1),new Zt(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),zi.setFromMatrixPosition(t.matrixWorld),n.position.copy(zi),Js.copy(n.position),Js.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Js),n.updateMatrixWorld(),r.makeTranslation(-zi.x,-zi.y,-zi.z),bc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bc)}}class Vg extends ua{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new Hg}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Wg extends Ul{constructor(){super(new El(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xg extends ua{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.shadow=new Wg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Rc=new Yt;class qg{constructor(t,e,n=0,r=1/0){this.ray=new ss(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new na,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Rc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Rc),this}intersectObject(t,e=!0,n=[]){return Go(t,this,n,e),n.sort(Cc),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)Go(t[r],this,n,e);return n.sort(Cc),n}}function Cc(i,t){return i.distance-t.distance}function Go(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)Go(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yo);const Yg=4.6;function Nl(i,t){return{position:i.clone().addScaledVector(t,Yg),target:i.clone()}}const Kg=2.4,$g=1.1;function Jg(i,t,e){const n=new w(t.x-i.x,0,t.z-i.z);return n.lengthSq()<.09&&n.set(-e.x,0,-e.z),n.lengthSq()<1e-6&&n.set(1,0,0),n.normalize(),{position:i.clone().addScaledVector(n,$g).add(new w(0,Kg,0)),target:i.clone()}}const Zg=650,jg=550;function Qg(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}class t_{constructor(t){j(this,"mode","free");j(this,"onModeChange",()=>{});j(this,"tween",null);j(this,"scratchPos",new w);j(this,"scratchTarget",new w);j(this,"nowMs",0);this.camera=t}currentPose(){const t=new w;return this.camera.getWorldDirection(t),{position:this.camera.position.clone(),target:this.camera.position.clone().add(t)}}lockedness(){switch(this.mode){case"free":return 0;case"locked":return 1;default:{const t=this.tween?this.tweenProgress():1;return this.mode==="locking"?t:1-t}}}lock(t,e){this.mode==="free"&&this.startTween(this.currentPose(),e,t,Zg,"locked")}unlock(t,e){this.mode==="locked"&&this.startTween(this.currentPose(),e,t,jg,"free")}startTween(t,e,n,r,s){this.tween={from:t,to:e,startMs:n,durationMs:r,endMode:s},this.setMode(s==="locked"?"locking":"unlocking")}setMode(t){this.mode!==t&&(this.mode=t,this.onModeChange(t))}tweenProgress(){const t=this.tween;return Qg(Math.min(1,(this.nowMs-t.startMs)/t.durationMs))}update(t){if(this.nowMs=t,!this.tween)return;const e=this.tween,n=this.tweenProgress();this.camera.position.copy(this.scratchPos.lerpVectors(e.from.position,e.to.position,n)),this.camera.lookAt(this.scratchTarget.lerpVectors(e.from.target,e.to.target,n)),n>=1&&(this.camera.position.copy(e.to.position),this.camera.lookAt(e.to.target),this.tween=null,this.setMode(e.endMode))}}const e_=.55,n_=.25,i_=.42,Pc=.0042,Lc=Math.PI*.42,r_=8,s_=450,o_=160,Ic=[1,2.2,3.4],Dc=[-.85,-.45,0,.45,.85],a_=110,c_=320,l_=170;function h_(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}class u_{constructor(t,e,n){j(this,"position",new w(0,-1,0));j(this,"yaw",0);j(this,"pitch",0);j(this,"enabled",!0);j(this,"onTap",()=>{});j(this,"pointers",new Map);j(this,"colliders",[]);j(this,"isWalkable");j(this,"markers",new ye);j(this,"candidates",[]);j(this,"fanOpen",!1);j(this,"picked",null);j(this,"markerMaterial",new fn({color:13625039,transparent:!0,opacity:.5,depthWrite:!1}));j(this,"pickedMaterial",new fn({color:16777215,transparent:!0,opacity:.95,depthWrite:!1}));j(this,"move",null);j(this,"onDown",t=>{const e=this.canvas.getBoundingClientRect(),n=[...this.pointers.values()].map(o=>o.role),s=t.clientX-e.left<e.width*i_&&!n.includes("move")?"move":"look";s==="look"&&n.includes("look")||(this.pointers.set(t.pointerId,{role:s,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,downMs:performance.now(),moved:!1}),this.canvas.setPointerCapture(t.pointerId),s==="move"&&this.enabled&&!this.move&&window.setTimeout(()=>{var o;((o=this.pointers.get(t.pointerId))==null?void 0:o.role)==="move"&&(this.fanOpen=!0)},o_))});j(this,"onMove",t=>{const e=this.pointers.get(t.pointerId);e&&(Math.hypot(t.clientX-e.startX,t.clientY-e.startY)>r_&&(e.moved=!0),e.role==="look"&&this.enabled&&(this.yaw-=(t.clientX-e.lastX)*Pc,this.pitch=Qe.clamp(this.pitch-(t.clientY-e.lastY)*Pc,-Lc,Lc)),e.lastX=t.clientX,e.lastY=t.clientY,e.role==="move"&&this.fanOpen&&this.refreshPick())});j(this,"onUp",t=>{const e=this.pointers.get(t.pointerId);if(e){if(this.pointers.delete(t.pointerId),e.role==="move"){const n=this.fanOpen;if(this.fanOpen=!1,n&&this.markers.visible){this.picked&&this.enabled&&this.commitMove(this.picked.point),this.closeFan();return}}!e.moved&&performance.now()-e.downMs<s_&&this.onTap(t.clientX,t.clientY)}});this.canvas=t,this.camera=n,t.addEventListener("pointerdown",this.onDown),t.addEventListener("pointermove",this.onMove),t.addEventListener("pointerup",this.onUp),t.addEventListener("pointercancel",this.onUp);const r=new ls(.15,.22,24);for(let s=0;s<Ic.length*Dc.length;s++){const o=new Gt(r,this.markerMaterial);o.rotation.x=-Math.PI/2,o.visible=!1,this.markers.add(o),this.candidates.push({point:new w,marker:o})}e.add(this.markers)}get isMoving(){return this.move!==null}eye(){return new w(this.position.x,this.position.y+e_,this.position.z)}forward(){return new w(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}applyCamera(t){t.position.copy(this.eye()),t.lookAt(this.eye().add(this.forward()))}update(t,e,n){if(this.colliders=e,this.isWalkable=n,this.move){const r=this.move,s=Math.min(1,(t-r.startMs)/r.durationMs);this.position.lerpVectors(r.from,r.to,h_(s)),s>=1&&(this.move=null)}this.fanOpen&&this.enabled&&!this.move?this.layoutFan():this.closeFan()}isFree(t){for(const e of this.colliders)if(Math.hypot(t.x-e.x,t.z-e.z)<e.radius+n_)return!1;return!(this.isWalkable&&!this.isWalkable(t))}pathClear(t,e){const r=new w;for(let s=1;s<=8;s++)if(r.lerpVectors(t,e,s/8),!this.isFree(r))return!1;return!0}halfHorizontalFov(){const t=this.camera;return Math.atan(Math.tan(Qe.degToRad(t.fov)/2)*t.aspect)}layoutFan(){this.markers.visible=!0;const t=-Math.sin(this.yaw),e=-Math.cos(this.yaw),n=this.halfHorizontalFov();let r=0;for(const s of Ic)for(const o of Dc){const a=o*n,c=this.candidates[r++],l=Math.cos(a),h=Math.sin(a);c.point.set(this.position.x+(t*l+e*h)*s,this.position.y,this.position.z+(-t*h+e*l)*s);const f=this.isFree(c.point)&&this.pathClear(this.position,c.point);c.marker.visible=f,c.marker.position.set(c.point.x,this.position.y+.02,c.point.z)}this.refreshPick()}closeFan(){this.markers.visible&&(this.markers.visible=!1,this.picked=null)}refreshPick(){const t=[...this.pointers.values()].find(o=>o.role==="move");if(!t)return;const e=this.canvas.getBoundingClientRect(),n=new w;let r=null,s=a_;for(const o of this.candidates){if(!o.marker.visible)continue;n.copy(o.marker.position).project(this.camera);const a=e.left+(n.x*.5+.5)*e.width,c=e.top+(-n.y*.5+.5)*e.height,l=Math.hypot(a-t.lastX,c-t.lastY);l<s&&(s=l,r=o)}r!==this.picked&&(this.picked&&(this.picked.marker.material=this.markerMaterial,this.picked.marker.scale.setScalar(1)),this.picked=r,r&&(r.marker.material=this.pickedMaterial,r.marker.scale.setScalar(1.45)))}commitMove(t){const e=this.position.clone(),n=e.distanceTo(t);this.move={from:e,to:t.clone(),startMs:performance.now(),durationMs:c_+n*l_}}}const Kn=[{name:"rose",hex:15225471},{name:"gold",hex:15906106},{name:"sky",hex:6076656},{name:"leaf",hex:8313175},{name:"violet",hex:11765749}];function jn(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function f_(i,t){if(i!==Kn.length)throw new Error(`assignDistinctColors: need exactly ${Kn.length} tips for a 1:1 colour map, got ${i}`);const e=jn(t),n=Kn.map((r,s)=>s);for(let r=n.length-1;r>0;r--){const s=Math.floor(e()*(r+1));[n[r],n[s]]=[n[s],n[r]]}return n}function Ji(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},o={},a=i[0].morphTargetsRelative,c=new fe;let l=0;for(let h=0;h<i.length;++h){const f=i[h];let p=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in f.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;s[m]===void 0&&(s[m]=[]),s[m].push(f.attributes[m]),p++}if(p!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in f.morphAttributes){if(!r.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[m]===void 0&&(o[m]=[]),o[m].push(f.morphAttributes[m])}if(t){let m;if(e)m=f.index.count;else if(f.attributes.position!==void 0)m=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,m,h),l+=m}}if(e){let h=0;const f=[];for(let p=0;p<i.length;++p){const m=i[p].index;for(let g=0;g<m.count;++g)f.push(m.getX(g)+h);h+=i[p].attributes.position.count}c.setIndex(f)}for(const h in s){const f=Uc(s[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,f)}for(const h in o){const f=o[h][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let p=0;p<f;++p){const m=[];for(let v=0;v<o[h].length;++v)m.push(o[h][v][p]);const g=Uc(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Uc(i){let t,e,n,r=-1,s=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}const o=new t(s),a=new Fe(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const f=c/e;for(let p=0,m=h.count;p<m;p++)for(let g=0;g<e;g++){const v=h.getComponent(p,g);a.setComponent(p+f,g,v)}}else o.set(h.array,c);c+=h.count*e}return r!==void 0&&(a.gpuType=r),a}const Ne=1,Yn=5,d_=[new w(0,.72,Ne),new w(-.72,.22,Ne),new w(.72,.22,Ne),new w(-.46,-.58,Ne),new w(.46,-.58,Ne)],p_=[[new w(.18,.2,-.45),new w(-.15,.55,.3)],[new w(-.3,-.15,.5),new w(-.62,.1,-.2)],[new w(.25,.35,.55),new w(.65,.4,-.1)],[new w(-.1,-.35,-.55),new w(-.5,-.25,.35)],[new w(.35,-.1,.25),new w(.55,-.55,-.35)]],Ho=new w(0,0,0),Nc=new w(0,-Ne,0),m_=30;function g_(i){const t=Ho.y-Nc.y,e=new as(.1,.16,t,12),n=new Gt(e,i);return n.position.set(0,(Ho.y+Nc.y)/2,0),n}function __(i,t){const e=jn(i),n=new Ii(1,1),r=[],s=new Yt,o=new In,a=new Oe;for(let c=0;c<m_;c++){const l=.28+e()*.24,h=new w((e()*2-1)*.6,(e()*2-1)*(Ne-l*.6),(e()*2-1)*.6),f=new w(l*(.8+e()*.5),l*(.7+e()*.5),l*(.8+e()*.5));o.setFromEuler(a.set(e()*Math.PI,e()*Math.PI,e()*Math.PI)),r.push(n.clone().applyMatrix4(s.compose(h,o,f)))}return new Gt(Ji(r),t)}function v_(i){const t=[Ho.clone(),...p_[i].map(e=>e.clone()),d_[i].clone()];return new Il(t,!1,"centripetal",.5)}function x_(i,t){const e=new ye,n=new be({color:Kn[i].hex,roughness:.55,emissive:Kn[i].hex,emissiveIntensity:0}),r=new Cn(1,14,10),s=6,o=.12,a=[],c=new Yt;for(let h=0;h<s;h++){const f=h/s*Math.PI*2;c.compose(new w(Math.cos(f)*o,Math.sin(f)*o,0),new In().setFromEuler(new Oe(0,0,f)),new w(.12,.065,.04)),a.push(r.clone().applyMatrix4(c))}e.add(new Gt(Ji(a),n));const l=new Gt(new Cn(.06,12,10),t);return l.position.z=.02,e.add(l),{group:e,petalMaterial:n}}function M_(i,t=7,e=1){if(i.length!==Yn)throw new Error(`buildRig: expected ${Yn} colours, got ${i.length}`);const n=new be({color:5914410,roughness:.9}),r=new be({color:5208634,roughness:.8}),s=new be({color:16773544,roughness:.6}),o=new be({color:2046498,roughness:1,flatShading:!0}),a=[n,r,s,o],c=new ye;c.add(g_(n)),c.add(__(t,o));const l=[],h=[],f=new Cn(.24,8,6),p=Array.from({length:Yn},(u,d)=>v_(d)),m=Ji(p.map(u=>new ha(u,48,.045,8,!1)));for(let u=0;u<e;u++){const d=new ye;d.rotation.y=u*Math.PI/2,c.add(d);const E=new Gt(m,r);d.add(E);for(let x=0;x<Yn;x++){const T=p[x],{group:I,petalMaterial:R}=x_(i[x],s);a.push(R),I.position.copy(T.getPointAt(1)),d.add(I);const b=new Gt(f);b.visible=!1,b.userData.tipIndex=x,I.add(b),h.push(b),l.push({index:l.length,tip:x,face:u,curve:T,tube:E,flower:I,colorIndex:i[x],petalMaterial:R})}}const g=new Cl({color:3820090,transparent:!0,opacity:.35}),v=new Eg(new kg(new pn(Ne*2,Ne*2,Ne*2)),g);return c.add(v),a.push(g),{root:c,branches:l,hitTargets:h,materials:a}}const S_=700,y_=90,Zs=90,Fc=1.3,E_=.75;function T_(i){return i*i}function A_(i){return 1-(1-i)*(1-i)}class Fl{constructor(){j(this,"active",[])}start(t,e,n){t.forEach((r,s)=>{this.active.push({branch:r,startMs:e+s*y_,fromScale:r.flower.scale.x,onDone:()=>n(r)})})}get isBusy(){return this.active.length>0}update(t){const e=[],n=[];for(const r of this.active){const s=t-r.startMs;if(s<0){e.push(r);continue}const{flower:o,curve:a}=r.branch;if(s<Zs){const h=A_(s/Zs),f=Qe.lerp(r.fromScale,Fc,h);o.scale.setScalar(f),e.push(r);continue}const c=Math.min(1,(s-Zs)/S_),l=T_(c);o.position.copy(a.getPointAt(1-l)),o.scale.setScalar(Fc*(1-l)),o.rotation.z=l*E_*Math.PI*2,c>=1?(o.visible=!1,n.push(r)):e.push(r)}this.active=e;for(const r of n)r.onDone()}}const Oc=220,w_=450,b_=1150,R_=.3,C_=.4,Bc=1e3,P_=4.5,Dr=80,zc=60;function L_(i){return i*i*i}function I_(i){return 1-Math.pow(1-i,3)}class D_{constructor(t,e,n){j(this,"stragglers");j(this,"animator",new Fl);j(this,"stragglersStarted",!1);j(this,"burstStarted",!1);j(this,"finished",!1);j(this,"fx",new ye);j(this,"ring");j(this,"ringMaterial");j(this,"sparks");j(this,"sparkMaterial");j(this,"sparkVelocities");j(this,"light");j(this,"lastBurstMs",0);this.rig=t,this.parent=e,this.startMs=n,this.stragglers=t.branches.filter(r=>r.flower.visible)}get isDone(){return this.finished}update(t){if(this.finished)return;const e=t-this.startMs;e>=Oc&&!this.stragglersStarted&&(this.stragglersStarted=!0,this.animator.start(this.stragglers,t,()=>{})),this.animator.update(t);const n=e-Oc-w_;if(n>=0){this.burstStarted||(this.burstStarted=!0,this.buildBurst(),this.lastBurstMs=t);const r=Math.min(1,n/b_),s=L_(r),o=this.rig.root;o.position.y=-2.6*s;const a=Qe.lerp(1,R_,s);o.scale.set(a,1,a),o.rotation.y=C_*Math.PI*2*s,this.updateBurst(t,Math.min(1,n/Bc)),r>=1&&n>=Bc&&(o.visible=!1,this.parent.remove(this.fx),this.finished=!0)}}buildBurst(){this.ringMaterial=new fn({color:16773568,transparent:!0,opacity:.9,blending:Yi,depthWrite:!1,side:Ye}),this.ring=new Gt(new ls(.75,1,64),this.ringMaterial),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=-.97,this.fx.add(this.ring);const t=new Float32Array(Dr*3);this.sparkVelocities=new Float32Array(Dr*3);for(let n=0;n<Dr;n++){const r=Math.random()*Math.PI*2,s=Math.random()*.8;t[n*3]=Math.cos(r)*s,t[n*3+1]=-1+Math.random()*.4,t[n*3+2]=Math.sin(r)*s,this.sparkVelocities[n*3]=Math.cos(r)*(.4+Math.random()*1.2),this.sparkVelocities[n*3+1]=1.5+Math.random()*2.5,this.sparkVelocities[n*3+2]=Math.sin(r)*(.4+Math.random()*1.2)}const e=new fe;e.setAttribute("position",new Fe(t,3)),this.sparkMaterial=new Pl({color:16774344,size:.09,transparent:!0,opacity:1,blending:Yi,depthWrite:!1}),this.sparks=new Tg(e,this.sparkMaterial),this.fx.add(this.sparks),this.light=new Vg(16771504,zc,14,2),this.light.position.set(0,.2,0),this.fx.add(this.light),this.parent.add(this.fx)}updateBurst(t,e){const n=(t-this.lastBurstMs)/1e3;this.lastBurstMs=t;const r=I_(e);this.ring.scale.setScalar(Qe.lerp(.3,P_,r)),this.ringMaterial.opacity=.9*(1-e);const s=this.sparks.geometry.getAttribute("position"),o=s.array;for(let a=0;a<Dr;a++)o[a*3]+=this.sparkVelocities[a*3]*n,o[a*3+1]+=this.sparkVelocities[a*3+1]*n,o[a*3+2]+=this.sparkVelocities[a*3+2]*n,this.sparkVelocities[a*3+1]-=1.2*n;s.needsUpdate=!0,this.sparkMaterial.opacity=1-e*e,this.light.intensity=zc*(e<.15?e/.15:1-(e-.15)/.85)}}const ts=5,Ol=6,Bl=6;class er{constructor(t,e,n){j(this,"grid",[]);j(this,"nextId",1);j(this,"rand");this.rows=t,this.cols=e,this.rand=jn(n),this.deal()}gemAt(t){return this.grid[t.row][t.col]}locate(t){for(let e=0;e<this.rows;e++)for(let n=0;n<this.cols;n++)if(this.grid[e][n].id===t)return{row:e,col:n};return null}static adjacent(t,e){return Math.abs(t.row-e.row)+Math.abs(t.col-e.col)===1}swap(t,e){if(!er.adjacent(t,e))return{valid:!1};if(this.exchange(t,e),this.findRuns().length===0)return this.exchange(t,e),{valid:!1};const n=[];for(;;){const s=this.findRuns();if(s.length===0)break;n.push(this.clearAndFall(s))}let r=!1;return this.hasValidMove()||(this.deal(),r=!0),{valid:!0,steps:n,reshuffled:r}}findRuns(){const t=[];for(let e=0;e<this.rows;e++){let n=0;for(let r=1;r<=this.cols;r++)(r===this.cols||this.grid[e][r].type!==this.grid[e][n].type)&&(r-n>=3&&t.push({type:this.grid[e][n].type,cells:kc(n,r).map(s=>({row:e,col:s}))}),n=r)}for(let e=0;e<this.cols;e++){let n=0;for(let r=1;r<=this.rows;r++)(r===this.rows||this.grid[r][e].type!==this.grid[n][e].type)&&(r-n>=3&&t.push({type:this.grid[n][e].type,cells:kc(n,r).map(s=>({row:s,col:e}))}),n=r)}return t}hasValidMove(){for(let t=0;t<this.rows;t++)for(let e=0;e<this.cols;e++)for(const[n,r]of[[0,1],[1,0]]){const s={row:t+n,col:e+r};if(s.row>=this.rows||s.col>=this.cols)continue;const o={row:t,col:e};this.exchange(o,s);const a=this.findRuns().length>0;if(this.exchange(o,s),a)return!0}return!1}exchange(t,e){const n=this.grid[t.row][t.col];this.grid[t.row][t.col]=this.grid[e.row][e.col],this.grid[e.row][e.col]=n}newGem(t){return{id:this.nextId++,type:t}}deal(){for(let t=0;t<100;t++){this.grid=[];for(let e=0;e<this.rows;e++){const n=[];for(let r=0;r<this.cols;r++){let s;do s=Math.floor(this.rand()*ts);while(r>=2&&n[r-1].type===s&&n[r-2].type===s||e>=2&&this.grid[e-1][r].type===s&&this.grid[e-2][r].type===s);n.push(this.newGem(s))}this.grid.push(n)}if(this.hasValidMove())return}throw new Error("Board.deal: could not find a dealable grid")}clearAndFall(t){const e=new Set,n=[];for(const o of t)for(const a of o.cells){const c=`${a.row},${a.col}`;if(e.has(c))continue;e.add(c);const l=this.grid[a.row][a.col];n.push({...a,id:l.id,type:l.type})}const r=[],s=[];for(let o=0;o<this.cols;o++){let a=this.rows-1;for(let l=this.rows-1;l>=0;l--)e.has(`${l},${o}`)||(a!==l&&(r.push({id:this.grid[l][o].id,col:o,fromRow:l,toRow:a}),this.grid[a][o]=this.grid[l][o]),a--);const c=a+1;for(let l=a;l>=0;l--){const h=this.newGem(Math.floor(this.rand()*ts));this.grid[l][o]=h,s.push({id:h.id,type:h.type,col:o,fromRow:l-c,toRow:l})}}return{runs:t,cleared:n,falls:r,spawns:s}}}function kc(i,t){return Array.from({length:t-i},(e,n)=>i+n)}const zl={name:"single",target(i,t){return t.targetCount>0?0:null}},U_=1.2,N_=3.3,Ur=40,Gc=4,Hc=.05,F_=.7,O_=.9,B_=3.5;function Vc(i){return new w(Math.sin(i*Math.PI/2),0,Math.cos(i*Math.PI/2))}class z_{constructor(t,e,n,r){j(this,"kind","voxel");j(this,"lockReach",N_);j(this,"hintLocked","Tap a gem, then a neighbour, to swap. Every match feeds the tree.");j(this,"group",new ye);j(this,"rig");j(this,"colors");j(this,"board");j(this,"pool",0);j(this,"targeting",zl);j(this,"hitBox");j(this,"status","growing");j(this,"onDone",()=>{});j(this,"lockedFace",0);j(this,"receded");j(this,"flash",0);j(this,"animator",new Fl);j(this,"beat",null);j(this,"lastNow",0);j(this,"baseOpacity");this.index=t,this.colors=f_(Yn,r),this.board=new er(Ol,Bl,r^20973),this.receded=this.colors.map(()=>!1),this.rig=M_(this.colors,r^40503,Gc),this.baseOpacity=this.rig.materials.map(s=>s.opacity);for(const s of this.rig.branches)s.petalMaterial.emissiveIntensity=Hc;this.group.position.copy(e),this.group.lookAt(n.x,e.y,n.z),this.group.add(this.rig.root),this.hitBox=new Gt(new pn(Ne*2,Ne*2,Ne*2)),this.hitBox.visible=!1,this.hitBox.userData.interactable=this,this.group.add(this.hitBox);for(const s of this.rig.hitTargets)s.userData.interactable=this}get center(){return this.group.position.clone()}get normal(){return Vc(this.lockedFace).applyQuaternion(this.group.quaternion)}lockPose(t){const e=t.position.clone().sub(this.group.position);e.y=0;let n=0,r=-1/0;for(let s=0;s<Gc;s++){const o=Vc(s).applyQuaternion(this.group.quaternion).dot(e);o>r&&(r=o,n=s)}return this.lockedFace=n,Nl(this.center,this.normal)}get lockTargets(){return[this.hitBox,...this.rig.hitTargets]}collider(){return this.status==="resolved"?null:{x:this.group.position.x,z:this.group.position.z,radius:U_}}distanceTo(t){return Math.hypot(t.x-this.group.position.x,t.z-this.group.position.z)}get flowersLeft(){return this.receded.filter(t=>!t).length}poolText(){return`tree ${this.pool}/${Ur} · flowers ${this.flowersLeft}`}targetFor(t){return this.status!=="growing"?null:this.targeting.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){const t=this.receded.indexOf(!1);if(t===-1)return this.center;const e=this.rig.branches.find(n=>n.face===this.lockedFace&&n.tip===t);return e?e.flower.getWorldPosition(new w):this.center}feed(t,e,n){if(this.status!=="growing")return;this.pool=Math.min(Ur,this.pool+e),this.flash=O_;const r=Ur/Yn;for(let s=0;s<Yn;s++)!this.receded[s]&&this.pool>=(s+1)*r-1e-6&&this.recedeTip(s,n)}recedeTip(t,e){this.receded[t]=!0;for(const n of this.rig.branches)n.tip===t&&this.animator.start([n],e,()=>{this.flowersLeft===0&&!this.animator.isBusy&&this.beginResolve(this.lastNow)})}beginResolve(t){this.status==="growing"&&(this.status="resolving",this.beat=new D_(this.rig,this.group,t))}setFade(t){const e=Qe.clamp(t,0,1);this.rig.root.visible=e>0&&this.status!=="resolved",this.rig.materials.forEach((n,r)=>{n.opacity=this.baseOpacity[r]*e,n.transparent=e<1||this.baseOpacity[r]<1})}update(t){const e=Math.max(0,(t-this.lastNow)/1e3);this.lastNow=t,this.flash=Math.max(0,this.flash-B_*e);const n=Qe.lerp(Hc,F_,this.pool/Ur)+this.flash;for(const r of this.rig.branches)this.receded[r.tip]||(r.petalMaterial.emissiveIntensity=n);this.animator.update(t),this.beat&&(this.beat.update(t),this.beat.isDone&&(this.beat=null,this.status="resolved",this.onDone(this)))}}const ki=1.3,Nr=12,k_=2.8,Fr=[170,100,40,0],Or=[0,3,8,15],js=[.66,.33,1e-4],G_=[3095847,4012584,4864808,5390380];class H_{constructor(t,e,n){j(this,"kind","patch");j(this,"group",new ye);j(this,"board");j(this,"lockReach",k_);j(this,"hintLocked","Tap a gem, then a neighbour, to swap. Every match tills the ground.");j(this,"status","growing");j(this,"pool",0);j(this,"targeting",zl);j(this,"onDone",()=>{});j(this,"lockTargets");j(this,"stages",[]);j(this,"stage",-1);this.index=t,this.board=new er(Ol,Bl,n^31249),this.group.position.copy(e),this.buildStages(n),this.setStage(0);const r=new Gt(new pn(ki,.4,ki));r.position.y=.2,r.visible=!1,r.userData.interactable=this,this.group.add(r),this.lockTargets=[r]}get center(){return this.group.position.clone()}lockPose(t){return Jg(this.center,t.position,t.forward)}distanceTo(t){return Math.hypot(t.x-this.group.position.x,t.z-this.group.position.z)}targetFor(t){return this.status!=="growing"?null:this.targeting.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){return this.center.add(new w(0,.15,0))}feed(t,e){this.status==="growing"&&(this.pool=Math.min(Nr,this.pool+e),this.setStage(this.stageFor(1-this.pool/Nr)),this.pool>=Nr&&(this.status="resolved",this.onDone(this)))}poolText(){return this.status==="resolved"?"tilled":`soil ${this.pool}/${Nr}`}update(){}stageFor(t){for(let e=0;e<js.length;e++)if(t>js[e])return e;return js.length}setStage(t){t!==this.stage&&(this.stage=t,this.stages.forEach((e,n)=>e.visible=n===t))}buildStages(t){const e=jn(t),n=ki/2,r=new cs(.035,.24,5);r.translate(0,.12,0);const s=[],o=new Yt,a=new In,c=new Oe;for(let v=0;v<Fr[0];v++){const u=new w((e()*2-1)*(n-.05),0,(e()*2-1)*(n-.05));a.setFromEuler(c.set((e()-.5)*.7,e()*Math.PI*2,(e()-.5)*.7));const d=.7+e()*.7;s.push(r.clone().applyMatrix4(o.compose(u,a,new w(1,d,1))))}const l=new Ii(1,0),h=[];for(let v=0;v<Or[Or.length-1];v++){const u=.11+e()*.1,d=new w((e()*2-1)*(n-u),u*.45,(e()*2-1)*(n-u));a.setFromEuler(c.set(e()*Math.PI,e()*Math.PI,e()*Math.PI)),h.push(l.clone().applyMatrix4(o.compose(d,a,new w(u,u*.65,u))))}const f=new be({color:6270524,roughness:.9,flatShading:!0}),p=new be({color:9085002,roughness:.9,flatShading:!0}),m=new be({color:7031342,roughness:1,flatShading:!0}),g=new Rn(ki,ki);g.rotateX(-Math.PI/2);for(let v=0;v<Fr.length;v++){const u=new ye,d=new Gt(g,new be({color:G_[v],roughness:1}));d.position.y=.012,u.add(d),Fr[v]>0&&u.add(new Gt(Ji(s.slice(0,Fr[v])),v===0?f:p)),Or[v]>0&&u.add(new Gt(Ji(h.slice(0,Or[v])),m)),u.visible=!1,this.group.add(u),this.stages.push(u)}}}const Mi=-1,Vo=14673903,V_=9416920,W_=.0011,X_=7763311,q_=7105380,Wc=.5,Y_=.05,Wo=-60,Si=60,es=24,kl=.4,Gl=400;function qi(i){return es+3*Math.sin(i/9)+1.2*Math.sin(i/3.1+1)}function K_(i){const t=es+8-Wo,e=Si*2,n=new Rn(t,e,Math.round(t/Wc),Math.round(e/Wc));n.rotateX(-Math.PI/2),n.translate(Wo+t/2,0,0);const r=jn(i),s=n.getAttribute("position");for(let o=0;o<s.count;o++){const a=s.getX(o),c=s.getZ(o),l=qi(c);a>l&&s.setX(o,l);const h=Math.sin(a*1.7+c*.9)*.35+Math.sin(a*.4-c*1.3)*.25;s.setY(o,(h+(r()-.5))*Y_)}return n.computeVertexNormals(),n}function $_(i){const t=[0,.35,.9,1.8,3.2,5.5,9,15,25,40,65,100,160,250,Gl],e=200,n=jn(i),r=[],s=[];for(let c=0;c<=e;c++){const l=-Si+c/e*Si*2,h=qi(l);for(let f=0;f<t.length;f++){const p=t[f],m=.22+p*.02,g=Math.sin(l*1.3+p*.7)*.5+Math.sin(l*.37-p*.21)*.5,v=f%2===0?.35+p*.01:0,u=p===0?0:(g+(n()-.5))*m+v,d=.03*p;r.push(h+d+u,Mi-p,l)}}const o=t.length;for(let c=0;c<e;c++)for(let l=0;l<o-1;l++){const h=c*o+l,f=h+o;s.push(h,f,h+1,h+1,f,f+1)}const a=new fe;return a.setAttribute("position",new Qt(r,3)),a.setIndex(s),a.computeVertexNormals(),a}function J_(){const i=new Cn(2800,32,16),t=i.getAttribute("position"),e=new Float32Array(t.count*3),n=new Dt(Vo),r=new Dt(V_),s=new Dt;for(let a=0;a<t.count;a++){const c=Qe.clamp(t.getY(a)/2800,0,1);s.copy(n).lerp(r,Math.pow(c,.6)),e[a*3]=s.r,e[a*3+1]=s.g,e[a*3+2]=s.b}i.setAttribute("color",new Fe(e,3));const o=new Gt(i,new fn({vertexColors:!0,side:Te,fog:!1,depthWrite:!1}));return o.renderOrder=-1,o}function Z_(i){const t=new ye,e=jn(19);i.background=new Dt(Vo),i.fog=new sa(Vo,W_),t.add(J_()),i.add(new Gg(14674160,2765604,1.1));const n=new Xg(16773336,1.6);n.position.set(30,12,-8),i.add(n);const r=new be({color:X_,roughness:1,flatShading:!0}),s=new Gt(K_(11),r);s.position.y=Mi,t.add(s);const o=new Gt($_(13),new be({color:q_,roughness:1,flatShading:!0,side:Ye}));t.add(o);const a=new Ii(1,0);for(let u=0;u<40;u++){const d=-Si+e()*Si*2,E=.1+e()*.3,x=new Gt(a,r);x.position.set(qi(d)-.2+e()*.5,Mi+E*.4,d),x.scale.set(E,E*.7,E),x.rotation.set(e()*3,e()*3,e()*3),t.add(x)}const c=Mi-Gl,l=new Gt(new Rn(8e3,8e3),new be({color:4155962,roughness:1}));l.rotation.x=-Math.PI/2,l.position.y=c,t.add(l);const h=new Cn(1,10,6),f=new be({color:2904624,roughness:1,flatShading:!0});for(let u=0;u<260;u++){const d=es+25+Math.pow(e(),1.6)*1100,E=(e()*2-1)*(300+d*.9),x=10+e()*40+d*.02,T=new Gt(h,f);T.position.set(d,c,E),T.scale.set(x,x*(.35+e()*.3),x),t.add(T)}const p=new Gt(new Rn(2200,34),new fn({color:11847380}));p.rotation.x=-Math.PI/2,p.rotation.z=-.35,p.position.set(es+700,c+.5,150),t.add(p);const m=[{minX:380,maxX:560,count:11,rMin:90,rMax:200,hMin:60,hMax:170,color:4873046},{minX:800,maxX:1150,count:14,rMin:160,rMax:340,hMin:150,hMax:330,color:6123641},{minX:1500,maxX:2100,count:16,rMin:260,rMax:520,hMin:300,hMax:560,color:8229283}];for(const u of m){const d=new fn({color:u.color});for(let E=0;E<u.count;E++){const x=u.minX+e()*(u.maxX-u.minX),T=(e()*2-1)*(x*1.15),I=u.rMin+e()*(u.rMax-u.rMin),R=u.hMin+e()*(u.hMax-u.hMin),b=new Gt(new cs(I,R,5+Math.floor(e()*3)),d);b.position.set(x,c+R/2,T),b.rotation.y=e()*Math.PI,t.add(b)}}return i.add(t),{group:t,isWalkable:u=>u.x<=qi(u.z)-kl&&u.x>=Wo+1&&Math.abs(u.z)<=Si-1,distanceToEdge:u=>qi(u.z)-u.x}}const Xc=2.2,qc=.62,j_=.88,Q_=.5,t0=.82,e0=-.17,kn=.36,n0=170,Yc=150,i0=200,r0=70,s0=160,Kc=220,o0=1.3;function a0(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function $c(i){return i*i}function c0(i){return 1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2)}function l0(i){switch(i%ts){case 0:return new ca(kn,0);case 1:return new pn(kn*1.35,kn*1.35,kn*1.35);case 2:return new Ii(kn,0);case 3:return new aa(kn,0);default:return new la(kn*1.25,0)}}class h0{constructor(t){j(this,"group",new ye);j(this,"onRun",()=>{});j(this,"model",null);j(this,"meshes",new Map);j(this,"geometries",Array.from({length:ts},(t,e)=>l0(e)));j(this,"materials",Kn.map(t=>new be({color:t.hex,emissive:t.hex,emissiveIntensity:.35,roughness:.35,metalness:.1,transparent:!0,opacity:t0})));j(this,"selectedId",null);j(this,"queue",[]);j(this,"active",null);j(this,"shown",!1);j(this,"showStartMs",0);j(this,"fitScale",1);this.camera=t,t.add(this.group),this.group.visible=!1,this.layout()}layout(){var a,c;const t=Math.tan(Qe.degToRad(this.camera.fov)/2)*Xc,e=t*this.camera.aspect,n=((a=this.model)==null?void 0:a.cols)??6,r=((c=this.model)==null?void 0:c.rows)??6,s=e*2*j_/n,o=t*2*Q_/(r*Math.cos(qc));this.fitScale=Math.min(s,o),this.group.position.set(0,t*2*e0,-Xc),this.group.rotation.set(-qc,0,0),this.shown&&!this.active&&this.group.scale.setScalar(this.fitScale)}get isBusy(){return this.active!==null||this.queue.length>0}bind(t){this.model=t,this.selectedId=null,this.queue=[],this.active=null,this.rebuildMeshes(),this.layout()}unbind(){this.model=null,this.clearMeshes(),this.group.visible=!1,this.shown=!1}show(t){this.model&&(this.shown=!0,this.showStartMs=t,this.group.visible=!0,this.group.scale.setScalar(.001))}hide(){this.shown=!1,this.group.visible=!1,this.selectedId=null}tap(t){if(!this.model||!this.shown||this.isBusy)return!1;const e=t.intersectObjects([...this.meshes.values()],!1)[0];if(!e)return!1;const n=e.object.userData.gemId,r=this.model.locate(n);if(!r)return!1;if(this.selectedId===null)return this.select(n),!0;if(this.selectedId===n)return this.select(null),!0;const s=this.model.locate(this.selectedId);if(!s||!er.adjacent(s,r))return this.select(n),!0;const o=this.selectedId,a=this.model.swap(s,r);if(this.select(null),!a.valid)return this.queue.push({kind:"swap",a:o,b:n,durationMs:Yc}),this.queue.push({kind:"swap",a:o,b:n,durationMs:Yc}),!0;this.queue.push({kind:"swap",a:o,b:n,durationMs:n0});for(const c of a.steps)this.queue.push({kind:"clear",step:c}),this.queue.push({kind:"fall",step:c});return a.reshuffled&&this.queue.push({kind:"rebuild"}),!0}update(t){if(!this.shown||!this.model)return;!this.active&&this.queue.length&&this.begin(this.queue.shift(),t);const e=Math.min(1,(t-this.showStartMs)/Kc);if(this.group.scale.setScalar(this.fitScale*c0(e)),!this.active)return;const n=this.active,r=Math.min(1,(t-n.startMs)/n.durationMs);switch(n.phase.kind){case"swap":{const s=a0(r);for(const o of n.moves)o.mesh.position.lerpVectors(o.from,o.to,s);break}case"clear":{const s=1-$c(r);for(const o of n.shrinking)o.scale.setScalar(Math.max(.001,s*(1+.35*Math.sin(r*Math.PI))));break}case"fall":{const s=$c(r);for(const o of n.moves)o.mesh.position.lerpVectors(o.from,o.to,s);break}}r>=1&&this.finish(n)}cellPosition(t,e=this.model.rows,n=this.model.cols){return new w(t.col-(n-1)/2,(e-1)/2-t.row,0)}select(t){var e,n;this.selectedId!==null&&((e=this.meshes.get(this.selectedId))==null||e.scale.setScalar(1)),this.selectedId=t,t!==null&&((n=this.meshes.get(t))==null||n.scale.setScalar(o0))}makeMesh(t,e){const n=new Gt(this.geometries[e],this.materials[e]);return n.userData.gemId=t,n.rotation.set(.35,t%7*.9,.2),this.group.add(n),this.meshes.set(t,n),n}rebuildMeshes(){this.clearMeshes();const t=this.model;for(let e=0;e<t.rows;e++)for(let n=0;n<t.cols;n++){const r=t.grid[e][n];this.makeMesh(r.id,r.type).position.copy(this.cellPosition({row:e,col:n}))}}clearMeshes(){for(const t of this.meshes.values())this.group.remove(t);this.meshes.clear(),this.selectedId=null}begin(t,e){const n=[],r=[];let s=1;switch(t.kind){case"swap":{const o=this.meshes.get(t.a),a=this.meshes.get(t.b);n.push({mesh:o,from:o.position.clone(),to:a.position.clone()}),n.push({mesh:a,from:a.position.clone(),to:o.position.clone()}),s=t.durationMs;break}case"clear":{for(const o of t.step.cleared){const a=this.meshes.get(o.id);a&&r.push(a)}for(const o of t.step.runs){const a=new w;for(const c of o.cells)a.add(this.cellPosition(c));a.divideScalar(o.cells.length),this.onRun(o,this.group.localToWorld(a))}s=i0;break}case"fall":{let o=1;for(const a of t.step.falls){const c=this.meshes.get(a.id);n.push({mesh:c,from:c.position.clone(),to:this.cellPosition({row:a.toRow,col:a.col})}),o=Math.max(o,a.toRow-a.fromRow)}for(const a of t.step.spawns){const c=this.makeMesh(a.id,a.type),l=this.cellPosition({row:a.fromRow,col:a.col});c.position.copy(l),n.push({mesh:c,from:l,to:this.cellPosition({row:a.toRow,col:a.col})}),o=Math.max(o,a.toRow-a.fromRow)}s=s0+o*r0;break}case"rebuild":this.rebuildMeshes(),s=Kc,this.showStartMs=e;break}this.active={phase:t,startMs:e,durationMs:s,moves:n,shrinking:r}}finish(t){for(const e of t.moves)e.mesh.position.copy(e.to);if(t.phase.kind==="clear")for(const e of t.phase.step.cleared){const n=this.meshes.get(e.id);n&&(this.group.remove(n),this.meshes.delete(e.id))}this.active=null}}const u0=420,f0=.35,d0=.055;function p0(i){return i*i}class m0{constructor(t){j(this,"group",new ye);j(this,"shots",[]);j(this,"geometry",new Cn(d0,10,8));t.add(this.group)}fire(t,e,n,r,s){const o=new fn({color:n,transparent:!0,opacity:.95,blending:Yi,depthWrite:!1}),a=new Gt(this.geometry,o);a.position.copy(t),this.group.add(a),this.shots.push({mesh:a,from:t.clone(),to:e.clone(),startMs:r,onHit:s})}update(t){const e=[],n=[];for(const r of this.shots){const s=Math.min(1,(t-r.startMs)/u0),o=p0(s);r.mesh.position.lerpVectors(r.from,r.to,o),r.mesh.position.y+=Math.sin(s*Math.PI)*f0,r.mesh.scale.setScalar(1+.6*Math.sin(s*Math.PI)),s>=1?n.push(r):e.push(r)}this.shots=e;for(const r of n)this.group.remove(r.mesh),r.mesh.material.dispose(),r.onHit()}}const Hl=new URLSearchParams(window.location.search),fa=Number.parseInt(Hl.get("seed")??"",10)||1,Xo=Math.max(1,Number.parseFloat(Hl.get("slowmo")??"")||1),dn=new Sg,da=40,ve=new Ue(da,window.innerWidth/window.innerHeight,.05,4e3),Pn=new Mg({antialias:!0});Pn.setSize(window.innerWidth,window.innerHeight);Pn.setPixelRatio(Math.min(window.devicePixelRatio,2));document.body.appendChild(Pn.domElement);const ns=Z_(dn),me=new t_(ve);dn.add(ve);const He=new h0(ve),Vl=new m0(dn),Ee=new u_(Pn.domElement,dn,ve);Ee.position.set(0,Mi,0);Ee.yaw=Math.PI/2;const Zi=2.45,Gi=3,g0=35*Math.PI/180,_0=new w(0,0,0),Je=[],Wl=(i,t)=>Je.push(new z_(Je.length,i,t,fa*131+Je.length*17));for(let i=-Gi;i<=Gi;i++)for(let t=-Gi;t<=Gi;t++){const e=Math.max(Math.abs(i),Math.abs(t),Math.abs(i+t));if(e===0||e>Gi)continue;const n=Zi*(i+t/2),r=Zi*t*(Math.sqrt(3)/2);e>=2&&Math.abs(Math.atan2(r,n))<g0||Wl(new w(n,0,r),_0)}const v0=new w(Zi,0,0);for(const i of[-1.4,1.4])Wl(new w(Zi*2,0,i),v0);for(const i of Je)dn.add(i.group);const hn=[],x0=[[0,0],[Zi*3,0],[10.5,-2.5],[10.5,0],[10.5,2.5],[13,-2.5],[13,2.5],[15.5,0],[15.5,2.5]];for(const[i,t]of x0)hn.push(new H_(hn.length,new w(i,Mi,t),fa*977+hn.length*23));for(const i of hn)dn.add(i.group);const pa=[...Je,...hn];let ae=null;const M0=450;let Xr=null;for(const i of pa)i.onDone=t=>{t===ae&&me.mode==="locked"&&(Xr=Se+M0),hs()};const S0=2.4,y0=2.6,E0=2.3;function T0(i,t){if(t.kind==="patch")return i.distanceTo(t.center)<E0;const e=t,n=Nl(e.center,e.normal),r=i.center;if(r.distanceTo(n.position)<S0)return!0;const s=e.normal;if(!(r.clone().sub(e.center).dot(s)>.5))return!1;const a=n.target.clone().sub(n.position).normalize(),c=r.clone().sub(n.position);return c.clone().sub(a.multiplyScalar(c.dot(a))).length()<y0}const A0=document.getElementById("hud"),ma=document.getElementById("hint"),Xl=document.getElementById("back"),ql={free:"Hold on the left to pick a spot, release to move. Drag to look. Tap growth or grass to lock in.",locking:"",locked:"",unlocking:""};function Yl(i){ma.textContent=i==="locked"&&ae?ae.hintLocked:ql[i],Ee.enabled=i==="free",i!=="free"&&$l(da),i==="locked"&&ae&&(He.bind(ae.board),He.show(Se)),i==="unlocking"&&He.hide(),i==="free"&&(He.unbind(),ae=null),hs()}He.onRun=(i,t)=>{const e=ae;if(!e)return;const n=e.targetFor(i);if(n===null)return;const r=i.cells.length;Vl.fire(t,e.targetWorldPosition(n),Kn[i.type].hex,Se,()=>{e.feed(n,r,Se),hs()})};me.onModeChange=Yl;Xl.addEventListener("click",()=>{me.mode==="locked"&&me.unlock(Se,Kl())});function Kl(){const i=Ee.eye();return{position:i,target:i.clone().add(Ee.forward())}}function hs(){const i=Je.filter(n=>n.status==="resolved").length,t=hn.filter(n=>n.status==="resolved").length,e=[`seed ${fa}`,`cleared ${i}/${Je.length}`,`tilled ${t}/${hn.length}`];Xo>1&&e.push(`slowmo ×${Xo}`),ae&&me.mode==="locked"&&ae.status==="growing"&&e.push(ae.poolText()),e.push("R: new arrangement"),A0.textContent=e.join(" · "),Xl.hidden=!(me.mode==="locked"&&(ae==null?void 0:ae.status)==="growing")}const w0=1.6,b0=9,R0=.08;function $l(i){Math.abs(ve.fov-i)<.001||(ve.fov=i,ve.updateProjectionMatrix(),He.layout())}function C0(){const i=ns.distanceToEdge(Ee.position)-kl;return Qe.clamp(1-i/w0,0,1)}const qo=new qg,Jc=new St;function P0(i,t){Jc.set(i/window.innerWidth*2-1,-(t/window.innerHeight)*2+1),qo.setFromCamera(Jc,ve)}let qr=0;Ee.onTap=(i,t)=>{if(P0(i,t),me.mode==="free"){const e=pa.filter(s=>s.status==="growing").flatMap(s=>s.lockTargets),n=qo.intersectObjects(e,!1)[0];if(!n)return;const r=n.object.userData.interactable;if(r.distanceTo(Ee.position)>r.lockReach){ma.textContent="Closer.",qr=Se+900;return}ae=r,me.lock(Se,r.lockPose({position:Ee.position,forward:Ee.forward()}))}else me.mode==="locked"&&ae&&He.tap(qo)&&hs()};window.addEventListener("keydown",i=>{if(i.key==="r"||i.key==="R"){const t=new URL(window.location.href);t.searchParams.set("seed",String(Math.floor(Math.random()*1e6))),window.location.href=t.toString()}});window.addEventListener("resize",()=>{ve.aspect=window.innerWidth/window.innerHeight,ve.updateProjectionMatrix(),Pn.setSize(window.innerWidth,window.innerHeight),He.layout()});let Se=0,Zc=performance.now();Yl(me.mode);Ee.applyCamera(ve);function Jl(i){requestAnimationFrame(Jl),window.__rootwake={scene:dn,camera:ve,renderer:Pn,player:Ee,voxels:Je,patches:hn,world:ns,cameraRig:me,boardView:He};const t=Math.min(.1,(i-Zc)/1e3);if(Se+=t*1e3/Xo,Zc=i,me.mode==="free"){const n=Je.flatMap(s=>s.collider()??[]);Ee.update(i,n,ns.isWalkable),Ee.applyCamera(ve);const r=C0();$l(da+b0*r),ve.position.y-=R0*r}me.update(Se),Xr!==null&&Se>=Xr&&(Xr=null,me.unlock(Se,Kl())),qr&&Se>=qr&&(qr=0,ma.textContent=ql[me.mode]);const e=me.lockedness();for(const n of Je){const r=ae&&n!==ae&&T0(n,ae)?1-e:1;n.setFade(r)}for(const n of pa)n.update(Se);ae&&ae.status!=="growing"&&He.hide(),He.update(Se),Vl.update(Se),Pn.render(dn,ve)}requestAnimationFrame(Jl);window.__rootwake={scene:dn,camera:ve,renderer:Pn,player:Ee,voxels:Je,patches:hn,world:ns,cameraRig:me,boardView:He};
