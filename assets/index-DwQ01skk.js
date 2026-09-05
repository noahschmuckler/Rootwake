var Gh=Object.defineProperty;var Vh=(i,t,e)=>t in i?Gh(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var O=(i,t,e)=>Vh(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const _a="169",Wh=0,Ka=1,Xh=2,Cl=1,Yh=2,mn=3,Nn=0,Pe=1,qe=2,In=0,Li=1,os=2,ja=3,Ja=4,qh=5,Zn=100,$h=101,Kh=102,jh=103,Jh=104,Zh=200,Qh=201,tu=202,eu=203,Ao=204,Ro=205,nu=206,iu=207,su=208,ru=209,ou=210,au=211,cu=212,lu=213,hu=214,Co=0,Po=1,Lo=2,Oi=3,Io=4,Do=5,Uo=6,No=7,Pl=0,uu=1,du=2,Dn=0,Ll=1,fu=2,pu=3,mu=4,gu=5,_u=6,vu=7,Il=300,Fi=301,Bi=302,Oo=303,Fo=304,Ar=306,Bo=1e3,ti=1001,zo=1002,Ke=1003,xu=1004,xs=1005,en=1006,Fr=1007,ei=1008,vn=1009,Dl=1010,Ul=1011,as=1012,va=1013,ri=1014,gn=1015,ds=1016,xa=1017,Ma=1018,zi=1020,Nl=35902,Ol=1021,Fl=1022,sn=1023,Bl=1024,zl=1025,Ii=1026,ki=1027,kl=1028,Sa=1029,Hl=1030,ya=1031,Ea=1033,rr=33776,or=33777,ar=33778,cr=33779,ko=35840,Ho=35841,Go=35842,Vo=35843,Wo=36196,Xo=37492,Yo=37496,qo=37808,$o=37809,Ko=37810,jo=37811,Jo=37812,Zo=37813,Qo=37814,ta=37815,ea=37816,na=37817,ia=37818,sa=37819,ra=37820,oa=37821,lr=36492,aa=36494,ca=36495,Gl=36283,la=36284,ha=36285,ua=36286,Mu=3200,Su=3201,Vl=0,yu=1,Ln="",on="srgb",Bn="srgb-linear",Ta="display-p3",Rr="display-p3-linear",fr="linear",ie="srgb",pr="rec709",mr="p3",fi=7680,Za=519,Eu=512,Tu=513,wu=514,Wl=515,bu=516,Au=517,Ru=518,Cu=519,Qa=35044,tc="300 es",_n=2e3,gr=2001;class Gi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Te=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ec=1234567;const Di=Math.PI/180,cs=180/Math.PI;function Vi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Te[i&255]+Te[i>>8&255]+Te[i>>16&255]+Te[i>>24&255]+"-"+Te[t&255]+Te[t>>8&255]+"-"+Te[t>>16&15|64]+Te[t>>24&255]+"-"+Te[e&63|128]+Te[e>>8&255]+"-"+Te[e>>16&255]+Te[e>>24&255]+Te[n&255]+Te[n>>8&255]+Te[n>>16&255]+Te[n>>24&255]).toLowerCase()}function Se(i,t,e){return Math.max(t,Math.min(e,i))}function wa(i,t){return(i%t+t)%t}function Pu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Lu(i,t,e){return i!==t?(e-i)/(t-i):0}function ns(i,t,e){return(1-e)*i+e*t}function Iu(i,t,e,n){return ns(i,t,1-Math.exp(-e*n))}function Du(i,t=1){return t-Math.abs(wa(i,t*2)-t)}function Uu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Nu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ou(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Fu(i,t){return i+Math.random()*(t-i)}function Bu(i){return i*(.5-Math.random())}function zu(i){i!==void 0&&(ec=i);let t=ec+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ku(i){return i*Di}function Hu(i){return i*cs}function Gu(i){return(i&i-1)===0&&i!==0}function Vu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xu(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),m=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*m,a*l);break;case"YXY":i.set(c*m,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*m,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ri(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Re(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ye={DEG2RAD:Di,RAD2DEG:cs,generateUUID:Vi,clamp:Se,euclideanModulo:wa,mapLinear:Pu,inverseLerp:Lu,lerp:ns,damp:Iu,pingpong:Du,smoothstep:Uu,smootherstep:Nu,randInt:Ou,randFloat:Fu,randFloatSpread:Bu,seededRandom:zu,degToRad:ku,radToDeg:Hu,isPowerOfTwo:Gu,ceilPowerOfTwo:Vu,floorPowerOfTwo:Wu,setQuaternionFromProperEuler:Xu,normalize:Re,denormalize:Ri};class Mt{constructor(t=0,e=0){Mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ut{constructor(t,e,n,s,r,o,a,c,l){Ut.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],m=n[5],g=n[8],M=s[0],p=s[3],f=s[6],T=s[1],v=s[4],S=s[7],L=s[2],R=s[5],b=s[8];return r[0]=o*M+a*T+c*L,r[3]=o*p+a*v+c*R,r[6]=o*f+a*S+c*b,r[1]=l*M+h*T+u*L,r[4]=l*p+h*v+u*R,r[7]=l*f+h*S+u*b,r[2]=d*M+m*T+g*L,r[5]=d*p+m*v+g*R,r[8]=d*f+m*S+g*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,m=l*r-o*c,g=e*u+n*d+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return t[0]=u*M,t[1]=(s*l-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=d*M,t[4]=(h*e-s*c)*M,t[5]=(s*r-a*e)*M,t[6]=m*M,t[7]=(n*c-l*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Br.makeScale(t,e)),this}rotate(t){return this.premultiply(Br.makeRotation(-t)),this}translate(t,e){return this.premultiply(Br.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Br=new Ut;function Xl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function _r(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Yu(){const i=_r("canvas");return i.style.display="block",i}const nc={};function hr(i){i in nc||(nc[i]=!0,console.warn(i))}function qu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function $u(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ku(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ic=new Ut().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),sc=new Ut().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Yi={[Bn]:{transfer:fr,primaries:pr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[on]:{transfer:ie,primaries:pr,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Rr]:{transfer:fr,primaries:mr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(sc),fromReference:i=>i.applyMatrix3(ic)},[Ta]:{transfer:ie,primaries:mr,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(sc),fromReference:i=>i.applyMatrix3(ic).convertLinearToSRGB()}},ju=new Set([Bn,Rr]),Yt={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!ju.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Yi[t].toReference,s=Yi[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Yi[i].primaries},getTransfer:function(i){return i===Ln?fr:Yi[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(Yi[t].luminanceCoefficients)}};function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function zr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let pi;class Ju{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{pi===void 0&&(pi=_r("canvas")),pi.width=t.width,pi.height=t.height;const n=pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=_r("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ui(e[n]/255)*255):e[n]=Ui(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Zu=0;class Yl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=Vi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(kr(s[o].image)):r.push(kr(s[o]))}else r=kr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function kr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ju.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qu=0;class Ne extends Gi{constructor(t=Ne.DEFAULT_IMAGE,e=Ne.DEFAULT_MAPPING,n=ti,s=ti,r=en,o=ei,a=sn,c=vn,l=Ne.DEFAULT_ANISOTROPY,h=Ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=Vi(),this.name="",this.source=new Yl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Mt(0,0),this.repeat=new Mt(1,1),this.center=new Mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Il)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Bo:t.x=t.x-Math.floor(t.x);break;case ti:t.x=t.x<0?0:1;break;case zo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Bo:t.y=t.y-Math.floor(t.y);break;case ti:t.y=t.y<0?0:1;break;case zo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ne.DEFAULT_IMAGE=null;Ne.DEFAULT_MAPPING=Il;Ne.DEFAULT_ANISOTROPY=1;class Zt{constructor(t=0,e=0,n=0,s=1){Zt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],m=c[5],g=c[9],M=c[2],p=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-M)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+M)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,S=(m+1)/2,L=(f+1)/2,R=(h+d)/4,b=(u+M)/4,C=(g+p)/4;return v>S&&v>L?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=R/n,r=b/n):S>L?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=R/s,r=C/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=b/r,s=C/r),this.set(n,s,r,e),this}let T=Math.sqrt((p-g)*(p-g)+(u-M)*(u-M)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(p-g)/T,this.y=(u-M)/T,this.z=(d-h)/T,this.w=Math.acos((l+m+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class td extends Gi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Zt(0,0,t,e),this.scissorTest=!1,this.viewport=new Zt(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ne(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Yl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends td{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ql extends Ne{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ed extends Ne{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ke,this.minFilter=Ke,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],m=r[o+1],g=r[o+2],M=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=g,t[e+3]=M;return}if(u!==M||c!==d||l!==m||h!==g){let p=1-a;const f=c*d+l*m+h*g+u*M,T=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const L=Math.sqrt(v),R=Math.atan2(L,f*T);p=Math.sin(p*R)/L,a=Math.sin(a*R)/L}const S=a*T;if(c=c*p+d*S,l=l*p+m*S,h=h*p+g*S,u=u*p+M*S,p===1-a){const L=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=L,l*=L,h*=L,u*=L}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],m=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*m-l*d,t[e+1]=c*g+h*d+l*u-a*m,t[e+2]=l*g+h*m+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"YZX":this._x=d*h*u+l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u-d*m*g;break;case"XZY":this._x=d*h*u-l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-c)*m,this._y=(r-l)*m,this._z=(o-s)*m}else if(n>a&&n>u){const m=2*Math.sqrt(1+n-a-u);this._w=(h-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+l)/m}else if(a>u){const m=2*Math.sqrt(1+a-n-u);this._w=(r-l)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+u-n-a);this._w=(o-s)/m,this._x=(r+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Se(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class w{constructor(t=0,e=0,n=0){w.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Hr.copy(this).projectOnVector(t),this.sub(Hr)}reflect(t){return this.sub(Hr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Se(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hr=new w,rc=new zn;class fs{constructor(t=new w(1/0,1/0,1/0),e=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ze.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ze.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ze.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Ze):Ze.fromBufferAttribute(r,o),Ze.applyMatrix4(t.matrixWorld),this.expandByPoint(Ze);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ms.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ms.copy(n.boundingBox)),Ms.applyMatrix4(t.matrixWorld),this.union(Ms)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ze),Ze.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(qi),Ss.subVectors(this.max,qi),mi.subVectors(t.a,qi),gi.subVectors(t.b,qi),_i.subVectors(t.c,qi),Tn.subVectors(gi,mi),wn.subVectors(_i,gi),Gn.subVectors(mi,_i);let e=[0,-Tn.z,Tn.y,0,-wn.z,wn.y,0,-Gn.z,Gn.y,Tn.z,0,-Tn.x,wn.z,0,-wn.x,Gn.z,0,-Gn.x,-Tn.y,Tn.x,0,-wn.y,wn.x,0,-Gn.y,Gn.x,0];return!Gr(e,mi,gi,_i,Ss)||(e=[1,0,0,0,1,0,0,0,1],!Gr(e,mi,gi,_i,Ss))?!1:(ys.crossVectors(Tn,wn),e=[ys.x,ys.y,ys.z],Gr(e,mi,gi,_i,Ss))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ze).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ze).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const hn=[new w,new w,new w,new w,new w,new w,new w,new w],Ze=new w,Ms=new fs,mi=new w,gi=new w,_i=new w,Tn=new w,wn=new w,Gn=new w,qi=new w,Ss=new w,ys=new w,Vn=new w;function Gr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Vn.fromArray(i,r);const a=s.x*Math.abs(Vn.x)+s.y*Math.abs(Vn.y)+s.z*Math.abs(Vn.z),c=t.dot(Vn),l=e.dot(Vn),h=n.dot(Vn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const nd=new fs,$i=new w,Vr=new w;class ps{constructor(t=new w,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):nd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;$i.subVectors(t,this.center);const e=$i.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector($i,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint($i.copy(t.center).add(Vr)),this.expandByPoint($i.copy(t.center).sub(Vr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const un=new w,Wr=new w,Es=new w,bn=new w,Xr=new w,Ts=new w,Yr=new w;class Cr{constructor(t=new w,e=new w(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(un.copy(this.origin).addScaledVector(this.direction,e),un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Wr.copy(t).add(e).multiplyScalar(.5),Es.copy(e).sub(t).normalize(),bn.copy(this.origin).sub(Wr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Es),a=bn.dot(this.direction),c=-bn.dot(Es),l=bn.lengthSq(),h=Math.abs(1-o*o);let u,d,m,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const M=1/h;u*=M,d*=M,m=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),m=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wr).addScaledVector(Es,d),m}intersectSphere(t,e){un.subVectors(t.center,this.origin);const n=un.dot(this.direction),s=un.dot(un)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,un)!==null}intersectTriangle(t,e,n,s,r){Xr.subVectors(e,t),Ts.subVectors(n,t),Yr.crossVectors(Xr,Ts);let o=this.direction.dot(Yr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;bn.subVectors(this.origin,t);const c=a*this.direction.dot(Ts.crossVectors(bn,Ts));if(c<0)return null;const l=a*this.direction.dot(Xr.cross(bn));if(l<0||c+l>o)return null;const h=-a*bn.dot(Yr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class qt{constructor(t,e,n,s,r,o,a,c,l,h,u,d,m,g,M,p){qt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,d,m,g,M,p)}set(t,e,n,s,r,o,a,c,l,h,u,d,m,g,M,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=m,f[7]=g,f[11]=M,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),r=1/vi.setFromMatrixColumn(t,1).length(),o=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,m=o*u,g=a*h,M=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=m+g*l,e[5]=d-M*l,e[9]=-a*c,e[2]=M-d*l,e[6]=g+m*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,m=c*u,g=l*h,M=l*u;e[0]=d+M*a,e[4]=g*a-m,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=m*a-g,e[6]=M+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,m=c*u,g=l*h,M=l*u;e[0]=d-M*a,e[4]=-o*u,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*h,e[9]=M-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,m=o*u,g=a*h,M=a*u;e[0]=c*h,e[4]=g*l-m,e[8]=d*l+M,e[1]=c*u,e[5]=M*l+d,e[9]=m*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,m=o*l,g=a*c,M=a*l;e[0]=c*h,e[4]=M-d*u,e[8]=g*u+m,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=m*u+g,e[10]=d-M*u}else if(t.order==="XZY"){const d=o*c,m=o*l,g=a*c,M=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+M,e[5]=o*h,e[9]=m*u-g,e[2]=g*u-m,e[6]=a*h,e[10]=M*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(id,t,sd)}lookAt(t,e,n){const s=this.elements;return ke.subVectors(t,e),ke.lengthSq()===0&&(ke.z=1),ke.normalize(),An.crossVectors(n,ke),An.lengthSq()===0&&(Math.abs(n.z)===1?ke.x+=1e-4:ke.z+=1e-4,ke.normalize(),An.crossVectors(n,ke)),An.normalize(),ws.crossVectors(ke,An),s[0]=An.x,s[4]=ws.x,s[8]=ke.x,s[1]=An.y,s[5]=ws.y,s[9]=ke.y,s[2]=An.z,s[6]=ws.z,s[10]=ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],m=n[13],g=n[2],M=n[6],p=n[10],f=n[14],T=n[3],v=n[7],S=n[11],L=n[15],R=s[0],b=s[4],C=s[8],G=s[12],_=s[1],E=s[5],z=s[9],k=s[13],X=s[2],j=s[6],H=s[10],J=s[14],W=s[3],ct=s[7],lt=s[11],_t=s[15];return r[0]=o*R+a*_+c*X+l*W,r[4]=o*b+a*E+c*j+l*ct,r[8]=o*C+a*z+c*H+l*lt,r[12]=o*G+a*k+c*J+l*_t,r[1]=h*R+u*_+d*X+m*W,r[5]=h*b+u*E+d*j+m*ct,r[9]=h*C+u*z+d*H+m*lt,r[13]=h*G+u*k+d*J+m*_t,r[2]=g*R+M*_+p*X+f*W,r[6]=g*b+M*E+p*j+f*ct,r[10]=g*C+M*z+p*H+f*lt,r[14]=g*G+M*k+p*J+f*_t,r[3]=T*R+v*_+S*X+L*W,r[7]=T*b+v*E+S*j+L*ct,r[11]=T*C+v*z+S*H+L*lt,r[15]=T*G+v*k+S*J+L*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],m=t[14],g=t[3],M=t[7],p=t[11],f=t[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*m-n*c*m)+M*(+e*c*m-e*l*d+r*o*d-s*o*m+s*l*h-r*c*h)+p*(+e*l*u-e*a*m-r*o*u+n*o*m+r*a*h-n*l*h)+f*(-s*a*h-e*c*u+e*a*d+s*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],m=t[11],g=t[12],M=t[13],p=t[14],f=t[15],T=u*p*l-M*d*l+M*c*m-a*p*m-u*c*f+a*d*f,v=g*d*l-h*p*l-g*c*m+o*p*m+h*c*f-o*d*f,S=h*M*l-g*u*l+g*a*m-o*M*m-h*a*f+o*u*f,L=g*u*c-h*M*c-g*a*d+o*M*d+h*a*p-o*u*p,R=e*T+n*v+s*S+r*L;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/R;return t[0]=T*b,t[1]=(M*d*r-u*p*r-M*s*m+n*p*m+u*s*f-n*d*f)*b,t[2]=(a*p*r-M*c*r+M*s*l-n*p*l-a*s*f+n*c*f)*b,t[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*m-n*c*m)*b,t[4]=v*b,t[5]=(h*p*r-g*d*r+g*s*m-e*p*m-h*s*f+e*d*f)*b,t[6]=(g*c*r-o*p*r-g*s*l+e*p*l+o*s*f-e*c*f)*b,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*m+e*c*m)*b,t[8]=S*b,t[9]=(g*u*r-h*M*r-g*n*m+e*M*m+h*n*f-e*u*f)*b,t[10]=(o*M*r-g*a*r+g*n*l-e*M*l-o*n*f+e*a*f)*b,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*m-e*a*m)*b,t[12]=L*b,t[13]=(h*M*s-g*u*s+g*n*d-e*M*d-h*n*p+e*u*p)*b,t[14]=(g*a*s-o*M*s-g*n*c+e*M*c+o*n*p-e*a*p)*b,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*d+e*a*d)*b,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,m=r*h,g=r*u,M=o*h,p=o*u,f=a*u,T=c*l,v=c*h,S=c*u,L=n.x,R=n.y,b=n.z;return s[0]=(1-(M+f))*L,s[1]=(m+S)*L,s[2]=(g-v)*L,s[3]=0,s[4]=(m-S)*R,s[5]=(1-(d+f))*R,s[6]=(p+T)*R,s[7]=0,s[8]=(g+v)*b,s[9]=(p-T)*b,s[10]=(1-(d+M))*b,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=vi.set(s[0],s[1],s[2]).length();const o=vi.set(s[4],s[5],s[6]).length(),a=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Qe.copy(this);const l=1/r,h=1/o,u=1/a;return Qe.elements[0]*=l,Qe.elements[1]*=l,Qe.elements[2]*=l,Qe.elements[4]*=h,Qe.elements[5]*=h,Qe.elements[6]*=h,Qe.elements[8]*=u,Qe.elements[9]*=u,Qe.elements[10]*=u,e.setFromRotationMatrix(Qe),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=_n){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let m,g;if(a===_n)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===gr)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=_n){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*l,m=(n+s)*h;let g,M;if(a===_n)g=(o+r)*u,M=-2*u;else if(a===gr)g=r*u,M=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=M,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const vi=new w,Qe=new qt,id=new w(0,0,0),sd=new w(1,1,1),An=new w,ws=new w,ke=new w,oc=new qt,ac=new zn;class We{constructor(t=0,e=0,n=0,s=We.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Se(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Se(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Se(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return oc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(oc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ac.setFromEuler(this),this.setFromQuaternion(ac,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}We.DEFAULT_ORDER="XYZ";class ba{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rd=0;const cc=new w,xi=new zn,dn=new qt,bs=new w,Ki=new w,od=new w,ad=new zn,lc=new w(1,0,0),hc=new w(0,1,0),uc=new w(0,0,1),dc={type:"added"},cd={type:"removed"},Mi={type:"childadded",child:null},qr={type:"childremoved",child:null};class pe extends Gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pe.DEFAULT_UP.clone();const t=new w,e=new We,n=new zn,s=new w(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qt},normalMatrix:{value:new Ut}}),this.matrix=new qt,this.matrixWorld=new qt,this.matrixAutoUpdate=pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ba,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return xi.setFromAxisAngle(t,e),this.quaternion.multiply(xi),this}rotateOnWorldAxis(t,e){return xi.setFromAxisAngle(t,e),this.quaternion.premultiply(xi),this}rotateX(t){return this.rotateOnAxis(lc,t)}rotateY(t){return this.rotateOnAxis(hc,t)}rotateZ(t){return this.rotateOnAxis(uc,t)}translateOnAxis(t,e){return cc.copy(t).applyQuaternion(this.quaternion),this.position.add(cc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(lc,t)}translateY(t){return this.translateOnAxis(hc,t)}translateZ(t){return this.translateOnAxis(uc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?bs.copy(t):bs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ki.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(Ki,bs,this.up):dn.lookAt(bs,Ki,this.up),this.quaternion.setFromRotationMatrix(dn),s&&(dn.extractRotation(s.matrixWorld),xi.setFromRotationMatrix(dn),this.quaternion.premultiply(xi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(dc),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(cd),qr.child=t,this.dispatchEvent(qr),qr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(dn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(dc),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ki,t,od),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ki,ad,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}pe.DEFAULT_UP=new w(0,1,0);pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new w,fn=new w,$r=new w,pn=new w,Si=new w,yi=new w,fc=new w,Kr=new w,jr=new w,Jr=new w,Zr=new Zt,Qr=new Zt,to=new Zt;class $e{constructor(t=new w,e=new w,n=new w){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),tn.subVectors(t,e),s.cross(tn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){tn.subVectors(s,e),fn.subVectors(n,e),$r.subVectors(t,e);const o=tn.dot(tn),a=tn.dot(fn),c=tn.dot($r),l=fn.dot(fn),h=fn.dot($r),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,m=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-m-g,g,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,pn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pn.x),c.addScaledVector(o,pn.y),c.addScaledVector(a,pn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return Zr.setScalar(0),Qr.setScalar(0),to.setScalar(0),Zr.fromBufferAttribute(t,e),Qr.fromBufferAttribute(t,n),to.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Zr,r.x),o.addScaledVector(Qr,r.y),o.addScaledVector(to,r.z),o}static isFrontFacing(t,e,n,s){return tn.subVectors(n,e),fn.subVectors(t,e),tn.cross(fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return tn.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),tn.cross(fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return $e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return $e.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return $e.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return $e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return $e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Si.subVectors(s,n),yi.subVectors(r,n),Kr.subVectors(t,n);const c=Si.dot(Kr),l=yi.dot(Kr);if(c<=0&&l<=0)return e.copy(n);jr.subVectors(t,s);const h=Si.dot(jr),u=yi.dot(jr);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Si,o);Jr.subVectors(t,r);const m=Si.dot(Jr),g=yi.dot(Jr);if(g>=0&&m<=g)return e.copy(r);const M=m*l-c*g;if(M<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(yi,a);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return fc.subVectors(r,s),a=(u-h)/(u-h+(m-g)),e.copy(s).addScaledVector(fc,a);const f=1/(p+M+d);return o=M*f,a=d*f,e.copy(n).addScaledVector(Si,o).addScaledVector(yi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const $l={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},As={h:0,s:0,l:0};function eo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Et{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=on){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=wa(t,1),e=Se(e,0,1),n=Se(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=eo(o,r,t+1/3),this.g=eo(o,r,t),this.b=eo(o,r,t-1/3)}return Yt.toWorkingColorSpace(this,s),this}setStyle(t,e=on){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=on){const n=$l[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ui(t.r),this.g=Ui(t.g),this.b=Ui(t.b),this}copyLinearToSRGB(t){return this.r=zr(t.r),this.g=zr(t.g),this.b=zr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=on){return Yt.fromWorkingColorSpace(we.copy(this),t),Math.round(Se(we.r*255,0,255))*65536+Math.round(Se(we.g*255,0,255))*256+Math.round(Se(we.b*255,0,255))}getHexString(t=on){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(we.copy(this),e);const n=we.r,s=we.g,r=we.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(we.copy(this),e),t.r=we.r,t.g=we.g,t.b=we.b,t}getStyle(t=on){Yt.fromWorkingColorSpace(we.copy(this),t);const e=we.r,n=we.g,s=we.b;return t!==on?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Rn),this.setHSL(Rn.h+t,Rn.s+e,Rn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Rn),t.getHSL(As);const n=ns(Rn.h,As.h,e),s=ns(Rn.s,As.s,e),r=ns(Rn.l,As.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const we=new Et;Et.NAMES=$l;let ld=0;class hi extends Gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=Li,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ao,this.blendDst=Ro,this.blendEquation=Zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=Oi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Za,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ao&&(n.blendSrc=this.blendSrc),this.blendDst!==Ro&&(n.blendDst=this.blendDst),this.blendEquation!==Zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Oi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Za&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class cn extends hi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new We,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const he=new w,Rs=new Mt;class Oe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Qa,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Rs.fromBufferAttribute(this,e),Rs.applyMatrix3(t),this.setXY(e,Rs.x,Rs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyMatrix3(t),this.setXYZ(e,he.x,he.y,he.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyMatrix4(t),this.setXYZ(e,he.x,he.y,he.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.applyNormalMatrix(t),this.setXYZ(e,he.x,he.y,he.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)he.fromBufferAttribute(this,e),he.transformDirection(t),this.setXYZ(e,he.x,he.y,he.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ri(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Re(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ri(e,this.array)),e}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ri(e,this.array)),e}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ri(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ri(e,this.array)),e}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),n=Re(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),n=Re(n,this.array),s=Re(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),n=Re(n,this.array),s=Re(s,this.array),r=Re(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Qa&&(t.usage=this.usage),t}}class Kl extends Oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class jl extends Oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class te extends Oe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let hd=0;const Ye=new qt,no=new pe,Ei=new w,He=new fs,ji=new fs,ve=new w;class _e extends Gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Xl(t)?jl:Kl)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ut().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ye.makeRotationFromQuaternion(t),this.applyMatrix4(Ye),this}rotateX(t){return Ye.makeRotationX(t),this.applyMatrix4(Ye),this}rotateY(t){return Ye.makeRotationY(t),this.applyMatrix4(Ye),this}rotateZ(t){return Ye.makeRotationZ(t),this.applyMatrix4(Ye),this}translate(t,e,n){return Ye.makeTranslation(t,e,n),this.applyMatrix4(Ye),this}scale(t,e,n){return Ye.makeScale(t,e,n),this.applyMatrix4(Ye),this}lookAt(t){return no.lookAt(t),no.updateMatrix(),this.applyMatrix4(no.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new te(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];He.setFromBufferAttribute(r),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,He.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,He.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(He.min),this.boundingBox.expandByPoint(He.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ps);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(t){const n=this.boundingSphere.center;if(He.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ji.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(He.min,ji.min),He.expandByPoint(ve),ve.addVectors(He.max,ji.max),He.expandByPoint(ve)):(He.expandByPoint(ji.min),He.expandByPoint(ji.max))}He.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ve.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)ve.fromBufferAttribute(a,l),c&&(Ei.fromBufferAttribute(t,l),ve.add(Ei)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Oe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<n.count;C++)a[C]=new w,c[C]=new w;const l=new w,h=new w,u=new w,d=new Mt,m=new Mt,g=new Mt,M=new w,p=new w;function f(C,G,_){l.fromBufferAttribute(n,C),h.fromBufferAttribute(n,G),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,C),m.fromBufferAttribute(r,G),g.fromBufferAttribute(r,_),h.sub(l),u.sub(l),m.sub(d),g.sub(d);const E=1/(m.x*g.y-g.x*m.y);isFinite(E)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(E),p.copy(u).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(E),a[C].add(M),a[G].add(M),a[_].add(M),c[C].add(p),c[G].add(p),c[_].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let C=0,G=T.length;C<G;++C){const _=T[C],E=_.start,z=_.count;for(let k=E,X=E+z;k<X;k+=3)f(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const v=new w,S=new w,L=new w,R=new w;function b(C){L.fromBufferAttribute(s,C),R.copy(L);const G=a[C];v.copy(G),v.sub(L.multiplyScalar(L.dot(G))).normalize(),S.crossVectors(R,G);const E=S.dot(c[C])<0?-1:1;o.setXYZW(C,v.x,v.y,v.z,E)}for(let C=0,G=T.length;C<G;++C){const _=T[C],E=_.start,z=_.count;for(let k=E,X=E+z;k<X;k+=3)b(t.getX(k+0)),b(t.getX(k+1)),b(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const s=new w,r=new w,o=new w,a=new w,c=new w,l=new w,h=new w,u=new w;if(t)for(let d=0,m=t.count;d<m;d+=3){const g=t.getX(d+0),M=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,p),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(M,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=e.count;d<m;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let m=0,g=0;for(let M=0,p=c.length;M<p;M++){a.isInterleavedBufferAttribute?m=c[M]*a.data.stride+a.offset:m=c[M]*h;for(let f=0;f<h;f++)d[g++]=l[m++]}return new Oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new _e,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],m=t(d,n);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const m=l[u];h.push(m.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pc=new qt,Wn=new Cr,Cs=new ps,mc=new w,Ps=new w,Ls=new w,Is=new w,io=new w,Ds=new w,gc=new w,Us=new w;class It extends pe{constructor(t=new _e,e=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Ds.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(io.fromBufferAttribute(u,t),o?Ds.addScaledVector(io,h):Ds.addScaledVector(io.sub(e),h))}e.add(Ds)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(r),Wn.copy(t.ray).recast(t.near),!(Cs.containsPoint(Wn.origin)===!1&&(Wn.intersectSphere(Cs,mc)===null||Wn.origin.distanceToSquared(mc)>(t.far-t.near)**2))&&(pc.copy(r).invert(),Wn.copy(t.ray).applyMatrix4(pc),!(n.boundingBox!==null&&Wn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Wn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,M=d.length;g<M;g++){const p=d[g],f=o[p.materialIndex],T=Math.max(p.start,m.start),v=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let S=T,L=v;S<L;S+=3){const R=a.getX(S),b=a.getX(S+1),C=a.getX(S+2);s=Ns(this,f,t,n,l,h,u,R,b,C),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),M=Math.min(a.count,m.start+m.count);for(let p=g,f=M;p<f;p+=3){const T=a.getX(p),v=a.getX(p+1),S=a.getX(p+2);s=Ns(this,o,t,n,l,h,u,T,v,S),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,M=d.length;g<M;g++){const p=d[g],f=o[p.materialIndex],T=Math.max(p.start,m.start),v=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=T,L=v;S<L;S+=3){const R=S,b=S+1,C=S+2;s=Ns(this,f,t,n,l,h,u,R,b,C),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),M=Math.min(c.count,m.start+m.count);for(let p=g,f=M;p<f;p+=3){const T=p,v=p+1,S=p+2;s=Ns(this,o,t,n,l,h,u,T,v,S),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function ud(i,t,e,n,s,r,o,a){let c;if(t.side===Pe?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Nn,a),c===null)return null;Us.copy(a),Us.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Us);return l<e.near||l>e.far?null:{distance:l,point:Us.clone(),object:i}}function Ns(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Ps),i.getVertexPosition(c,Ls),i.getVertexPosition(l,Is);const h=ud(i,t,e,n,Ps,Ls,Is,gc);if(h){const u=new w;$e.getBarycoord(gc,Ps,Ls,Is,u),s&&(h.uv=$e.getInterpolatedAttribute(s,a,c,l,u,new Mt)),r&&(h.uv1=$e.getInterpolatedAttribute(r,a,c,l,u,new Mt)),o&&(h.normal=$e.getInterpolatedAttribute(o,a,c,l,u,new w),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new w,materialIndex:0};$e.getNormal(Ps,Ls,Is,d.normal),h.face=d,h.barycoord=u}return h}class Mn extends _e{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,m=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new te(l,3)),this.setAttribute("normal",new te(h,3)),this.setAttribute("uv",new te(u,2));function g(M,p,f,T,v,S,L,R,b,C,G){const _=S/b,E=L/C,z=S/2,k=L/2,X=R/2,j=b+1,H=C+1;let J=0,W=0;const ct=new w;for(let lt=0;lt<H;lt++){const _t=lt*E-k;for(let Gt=0;Gt<j;Gt++){const $t=Gt*_-z;ct[M]=$t*T,ct[p]=_t*v,ct[f]=X,l.push(ct.x,ct.y,ct.z),ct[M]=0,ct[p]=0,ct[f]=R>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(Gt/b),u.push(1-lt/C),J+=1}}for(let lt=0;lt<C;lt++)for(let _t=0;_t<b;_t++){const Gt=d+_t+j*lt,$t=d+_t+j*(lt+1),Y=d+(_t+1)+j*(lt+1),Q=d+(_t+1)+j*lt;c.push(Gt,$t,Q),c.push($t,Y,Q),W+=6}a.addGroup(m,W,G),m+=W,d+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ce(i){const t={};for(let e=0;e<i.length;e++){const n=Hi(i[e]);for(const s in n)t[s]=n[s]}return t}function dd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Jl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const fd={clone:Hi,merge:Ce};var pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,md=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class On extends hi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pd,this.fragmentShader=md,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hi(t.uniforms),this.uniformsGroups=dd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Zl extends pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qt,this.projectionMatrix=new qt,this.projectionMatrixInverse=new qt,this.coordinateSystem=_n}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Cn=new w,_c=new Mt,vc=new Mt;class Ge extends Zl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=cs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Di*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return cs*2*Math.atan(Math.tan(Di*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Cn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Cn.x,Cn.y).multiplyScalar(-t/Cn.z),Cn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Cn.x,Cn.y).multiplyScalar(-t/Cn.z)}getViewSize(t,e){return this.getViewBounds(t,_c,vc),e.subVectors(vc,_c)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Di*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ti=-90,wi=1;class gd extends pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ge(Ti,wi,t,e);s.layers=this.layers,this.add(s);const r=new Ge(Ti,wi,t,e);r.layers=this.layers,this.add(r);const o=new Ge(Ti,wi,t,e);o.layers=this.layers,this.add(o);const a=new Ge(Ti,wi,t,e);a.layers=this.layers,this.add(a);const c=new Ge(Ti,wi,t,e);c.layers=this.layers,this.add(c);const l=new Ge(Ti,wi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===_n)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===gr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ql extends Ne{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Fi,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class _d extends oi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ql(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:en}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Mn(5,5,5),r=new On({name:"CubemapFromEquirect",uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pe,blending:In});r.uniforms.tEquirect.value=e;const o=new It(s,r),a=e.minFilter;return e.minFilter===ei&&(e.minFilter=en),new gd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const so=new w,vd=new w,xd=new Ut;class Pn{constructor(t=new w(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=so.subVectors(n,e).cross(vd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(so),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||xd.getNormalMatrix(t),s=this.coplanarPoint(so).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xn=new ps,Os=new w;class Aa{constructor(t=new Pn,e=new Pn,n=new Pn,s=new Pn,r=new Pn,o=new Pn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=_n){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],m=s[8],g=s[9],M=s[10],p=s[11],f=s[12],T=s[13],v=s[14],S=s[15];if(n[0].setComponents(c-r,d-l,p-m,S-f).normalize(),n[1].setComponents(c+r,d+l,p+m,S+f).normalize(),n[2].setComponents(c+o,d+h,p+g,S+T).normalize(),n[3].setComponents(c-o,d-h,p-g,S-T).normalize(),n[4].setComponents(c-a,d-u,p-M,S-v).normalize(),e===_n)n[5].setComponents(c+a,d+u,p+M,S+v).normalize();else if(e===gr)n[5].setComponents(a,u,M,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xn)}intersectsSprite(t){return Xn.center.set(0,0,0),Xn.radius=.7071067811865476,Xn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Os.x=s.normal.x>0?t.max.x:t.min.x,Os.y=s.normal.y>0?t.max.y:t.min.y,Os.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Os)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function th(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Md(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<u.length;m++){const g=u[d],M=u[m];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++d,u[d]=M)}u.length=d+1;for(let m=0,g=u.length;m<g;m++){const M=u[m];i.bufferSubData(l,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class Fn extends _e{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,m=[],g=[],M=[],p=[];for(let f=0;f<h;f++){const T=f*d-o;for(let v=0;v<l;v++){const S=v*u-r;g.push(S,-T,0),M.push(0,0,1),p.push(v/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let T=0;T<a;T++){const v=T+l*f,S=T+l*(f+1),L=T+1+l*(f+1),R=T+1+l*f;m.push(v,S,R),m.push(S,L,R)}this.setIndex(m),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(M,3)),this.setAttribute("uv",new te(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Sd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yd=`#ifdef USE_ALPHAHASH
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
#endif`,Ed=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Td=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ad=`#ifdef USE_AOMAP
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
#endif`,Rd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cd=`#ifdef USE_BATCHING
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
#endif`,Pd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ld=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Id=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ud=`#ifdef USE_IRIDESCENCE
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
#endif`,Nd=`#ifdef USE_BUMPMAP
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
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Vd=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Wd=`#define PI 3.141592653589793
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
} // validated`,Xd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yd=`vec3 transformedNormal = objectNormal;
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
#endif`,qd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$d=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Kd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zd=`
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
}`,Qd=`#ifdef USE_ENVMAP
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
#endif`,tf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ef=`#ifdef USE_ENVMAP
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
#endif`,nf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sf=`#ifdef USE_ENVMAP
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
#endif`,rf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,of=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lf=`#ifdef USE_GRADIENTMAP
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
}`,hf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,uf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,df=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ff=`uniform bool receiveShadow;
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
#endif`,pf=`#ifdef USE_ENVMAP
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
#endif`,mf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_f=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xf=`PhysicalMaterial material;
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
#endif`,Mf=`struct PhysicalMaterial {
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
}`,Sf=`
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
#endif`,yf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ef=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Af=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Rf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Lf=`#if defined( USE_POINTS_UV )
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
#endif`,If=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Uf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Of=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ff=`#ifdef USE_MORPHTARGETS
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
#endif`,Bf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Wf=`#ifdef USE_NORMALMAP
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
#endif`,Xf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Yf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$f=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Kf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,np=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,op=`float getShadowMask() {
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
}`,ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,cp=`#ifdef USE_SKINNING
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
#endif`,lp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hp=`#ifdef USE_SKINNING
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
#endif`,up=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,mp=`#ifdef USE_TRANSMISSION
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
#endif`,gp=`#ifdef USE_TRANSMISSION
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
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yp=`uniform sampler2D t2D;
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
}`,Ep=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ap=`#include <common>
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
}`,Rp=`#if DEPTH_PACKING == 3200
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
}`,Cp=`#define DISTANCE
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
}`,Pp=`#define DISTANCE
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
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ip=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`uniform float scale;
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
}`,Up=`uniform vec3 diffuse;
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
}`,Np=`#include <common>
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
}`,Op=`uniform vec3 diffuse;
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
}`,Fp=`#define LAMBERT
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
}`,Bp=`#define LAMBERT
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
}`,zp=`#define MATCAP
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
}`,kp=`#define MATCAP
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
}`,Hp=`#define NORMAL
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
}`,Gp=`#define NORMAL
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
}`,Vp=`#define PHONG
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
}`,Wp=`#define PHONG
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
}`,Xp=`#define STANDARD
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
}`,Yp=`#define STANDARD
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
}`,qp=`#define TOON
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
}`,$p=`#define TOON
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
}`,Kp=`uniform float size;
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
}`,jp=`uniform vec3 diffuse;
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
}`,Jp=`#include <common>
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
}`,Zp=`uniform vec3 color;
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
}`,Qp=`uniform float rotation;
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
}`,tm=`uniform vec3 diffuse;
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
}`,Dt={alphahash_fragment:Sd,alphahash_pars_fragment:yd,alphamap_fragment:Ed,alphamap_pars_fragment:Td,alphatest_fragment:wd,alphatest_pars_fragment:bd,aomap_fragment:Ad,aomap_pars_fragment:Rd,batching_pars_vertex:Cd,batching_vertex:Pd,begin_vertex:Ld,beginnormal_vertex:Id,bsdfs:Dd,iridescence_fragment:Ud,bumpmap_pars_fragment:Nd,clipping_planes_fragment:Od,clipping_planes_pars_fragment:Fd,clipping_planes_pars_vertex:Bd,clipping_planes_vertex:zd,color_fragment:kd,color_pars_fragment:Hd,color_pars_vertex:Gd,color_vertex:Vd,common:Wd,cube_uv_reflection_fragment:Xd,defaultnormal_vertex:Yd,displacementmap_pars_vertex:qd,displacementmap_vertex:$d,emissivemap_fragment:Kd,emissivemap_pars_fragment:jd,colorspace_fragment:Jd,colorspace_pars_fragment:Zd,envmap_fragment:Qd,envmap_common_pars_fragment:tf,envmap_pars_fragment:ef,envmap_pars_vertex:nf,envmap_physical_pars_fragment:pf,envmap_vertex:sf,fog_vertex:rf,fog_pars_vertex:of,fog_fragment:af,fog_pars_fragment:cf,gradientmap_pars_fragment:lf,lightmap_pars_fragment:hf,lights_lambert_fragment:uf,lights_lambert_pars_fragment:df,lights_pars_begin:ff,lights_toon_fragment:mf,lights_toon_pars_fragment:gf,lights_phong_fragment:_f,lights_phong_pars_fragment:vf,lights_physical_fragment:xf,lights_physical_pars_fragment:Mf,lights_fragment_begin:Sf,lights_fragment_maps:yf,lights_fragment_end:Ef,logdepthbuf_fragment:Tf,logdepthbuf_pars_fragment:wf,logdepthbuf_pars_vertex:bf,logdepthbuf_vertex:Af,map_fragment:Rf,map_pars_fragment:Cf,map_particle_fragment:Pf,map_particle_pars_fragment:Lf,metalnessmap_fragment:If,metalnessmap_pars_fragment:Df,morphinstance_vertex:Uf,morphcolor_vertex:Nf,morphnormal_vertex:Of,morphtarget_pars_vertex:Ff,morphtarget_vertex:Bf,normal_fragment_begin:zf,normal_fragment_maps:kf,normal_pars_fragment:Hf,normal_pars_vertex:Gf,normal_vertex:Vf,normalmap_pars_fragment:Wf,clearcoat_normal_fragment_begin:Xf,clearcoat_normal_fragment_maps:Yf,clearcoat_pars_fragment:qf,iridescence_pars_fragment:$f,opaque_fragment:Kf,packing:jf,premultiplied_alpha_fragment:Jf,project_vertex:Zf,dithering_fragment:Qf,dithering_pars_fragment:tp,roughnessmap_fragment:ep,roughnessmap_pars_fragment:np,shadowmap_pars_fragment:ip,shadowmap_pars_vertex:sp,shadowmap_vertex:rp,shadowmask_pars_fragment:op,skinbase_vertex:ap,skinning_pars_vertex:cp,skinning_vertex:lp,skinnormal_vertex:hp,specularmap_fragment:up,specularmap_pars_fragment:dp,tonemapping_fragment:fp,tonemapping_pars_fragment:pp,transmission_fragment:mp,transmission_pars_fragment:gp,uv_pars_fragment:_p,uv_pars_vertex:vp,uv_vertex:xp,worldpos_vertex:Mp,background_vert:Sp,background_frag:yp,backgroundCube_vert:Ep,backgroundCube_frag:Tp,cube_vert:wp,cube_frag:bp,depth_vert:Ap,depth_frag:Rp,distanceRGBA_vert:Cp,distanceRGBA_frag:Pp,equirect_vert:Lp,equirect_frag:Ip,linedashed_vert:Dp,linedashed_frag:Up,meshbasic_vert:Np,meshbasic_frag:Op,meshlambert_vert:Fp,meshlambert_frag:Bp,meshmatcap_vert:zp,meshmatcap_frag:kp,meshnormal_vert:Hp,meshnormal_frag:Gp,meshphong_vert:Vp,meshphong_frag:Wp,meshphysical_vert:Xp,meshphysical_frag:Yp,meshtoon_vert:qp,meshtoon_frag:$p,points_vert:Kp,points_frag:jp,shadow_vert:Jp,shadow_frag:Zp,sprite_vert:Qp,sprite_frag:tm},nt={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new Mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new Mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},an={basic:{uniforms:Ce([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.fog]),vertexShader:Dt.meshbasic_vert,fragmentShader:Dt.meshbasic_frag},lambert:{uniforms:Ce([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Et(0)}}]),vertexShader:Dt.meshlambert_vert,fragmentShader:Dt.meshlambert_frag},phong:{uniforms:Ce([nt.common,nt.specularmap,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,nt.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30}}]),vertexShader:Dt.meshphong_vert,fragmentShader:Dt.meshphong_frag},standard:{uniforms:Ce([nt.common,nt.envmap,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.roughnessmap,nt.metalnessmap,nt.fog,nt.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag},toon:{uniforms:Ce([nt.common,nt.aomap,nt.lightmap,nt.emissivemap,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.gradientmap,nt.fog,nt.lights,{emissive:{value:new Et(0)}}]),vertexShader:Dt.meshtoon_vert,fragmentShader:Dt.meshtoon_frag},matcap:{uniforms:Ce([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,nt.fog,{matcap:{value:null}}]),vertexShader:Dt.meshmatcap_vert,fragmentShader:Dt.meshmatcap_frag},points:{uniforms:Ce([nt.points,nt.fog]),vertexShader:Dt.points_vert,fragmentShader:Dt.points_frag},dashed:{uniforms:Ce([nt.common,nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Dt.linedashed_vert,fragmentShader:Dt.linedashed_frag},depth:{uniforms:Ce([nt.common,nt.displacementmap]),vertexShader:Dt.depth_vert,fragmentShader:Dt.depth_frag},normal:{uniforms:Ce([nt.common,nt.bumpmap,nt.normalmap,nt.displacementmap,{opacity:{value:1}}]),vertexShader:Dt.meshnormal_vert,fragmentShader:Dt.meshnormal_frag},sprite:{uniforms:Ce([nt.sprite,nt.fog]),vertexShader:Dt.sprite_vert,fragmentShader:Dt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Dt.background_vert,fragmentShader:Dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Dt.backgroundCube_vert,fragmentShader:Dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Dt.cube_vert,fragmentShader:Dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Dt.equirect_vert,fragmentShader:Dt.equirect_frag},distanceRGBA:{uniforms:Ce([nt.common,nt.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Dt.distanceRGBA_vert,fragmentShader:Dt.distanceRGBA_frag},shadow:{uniforms:Ce([nt.lights,nt.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:Dt.shadow_vert,fragmentShader:Dt.shadow_frag}};an.physical={uniforms:Ce([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new Mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new Mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new Mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag};const Fs={r:0,b:0,g:0},Yn=new We,em=new qt;function nm(i,t,e,n,s,r,o){const a=new Et(0);let c=r===!0?0:1,l,h,u=null,d=0,m=null;function g(T){let v=T.isScene===!0?T.background:null;return v&&v.isTexture&&(v=(T.backgroundBlurriness>0?e:t).get(v)),v}function M(T){let v=!1;const S=g(T);S===null?f(a,c):S&&S.isColor&&(f(S,1),v=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(T,v){const S=g(v);S&&(S.isCubeTexture||S.mapping===Ar)?(h===void 0&&(h=new It(new Mn(1,1,1),new On({name:"BackgroundCubeMaterial",uniforms:Hi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Pe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,R,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Yn.copy(v.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(em.makeRotationFromEuler(Yn)),h.material.toneMapped=Yt.getTransfer(S.colorSpace)!==ie,(u!==S||d!==S.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=S,d=S.version,m=i.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new It(new Fn(2,2),new On({name:"BackgroundMaterial",uniforms:Hi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=Yt.getTransfer(S.colorSpace)!==ie,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,m=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function f(T,v){T.getRGB(Fs,Jl(i)),n.buffers.color.setClear(Fs.r,Fs.g,Fs.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(T,v=1){a.set(T),c=v,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,f(a,c)},render:M,addToRenderList:p}}function im(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(_,E,z,k,X){let j=!1;const H=u(k,z,E);r!==H&&(r=H,l(r.object)),j=m(_,k,z,X),j&&g(_,k,z,X),X!==null&&t.update(X,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,S(_,E,z,k),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,E,z){const k=z.wireframe===!0;let X=n[_.id];X===void 0&&(X={},n[_.id]=X);let j=X[E.id];j===void 0&&(j={},X[E.id]=j);let H=j[k];return H===void 0&&(H=d(c()),j[k]=H),H}function d(_){const E=[],z=[],k=[];for(let X=0;X<e;X++)E[X]=0,z[X]=0,k[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:z,attributeDivisors:k,object:_,attributes:{},index:null}}function m(_,E,z,k){const X=r.attributes,j=E.attributes;let H=0;const J=z.getAttributes();for(const W in J)if(J[W].location>=0){const lt=X[W];let _t=j[W];if(_t===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(_t=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(_t=_.instanceColor)),lt===void 0||lt.attribute!==_t||_t&&lt.data!==_t.data)return!0;H++}return r.attributesNum!==H||r.index!==k}function g(_,E,z,k){const X={},j=E.attributes;let H=0;const J=z.getAttributes();for(const W in J)if(J[W].location>=0){let lt=j[W];lt===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor));const _t={};_t.attribute=lt,lt&&lt.data&&(_t.data=lt.data),X[W]=_t,H++}r.attributes=X,r.attributesNum=H,r.index=k}function M(){const _=r.newAttributes;for(let E=0,z=_.length;E<z;E++)_[E]=0}function p(_){f(_,0)}function f(_,E){const z=r.newAttributes,k=r.enabledAttributes,X=r.attributeDivisors;z[_]=1,k[_]===0&&(i.enableVertexAttribArray(_),k[_]=1),X[_]!==E&&(i.vertexAttribDivisor(_,E),X[_]=E)}function T(){const _=r.newAttributes,E=r.enabledAttributes;for(let z=0,k=E.length;z<k;z++)E[z]!==_[z]&&(i.disableVertexAttribArray(z),E[z]=0)}function v(_,E,z,k,X,j,H){H===!0?i.vertexAttribIPointer(_,E,z,X,j):i.vertexAttribPointer(_,E,z,k,X,j)}function S(_,E,z,k){M();const X=k.attributes,j=z.getAttributes(),H=E.defaultAttributeValues;for(const J in j){const W=j[J];if(W.location>=0){let ct=X[J];if(ct===void 0&&(J==="instanceMatrix"&&_.instanceMatrix&&(ct=_.instanceMatrix),J==="instanceColor"&&_.instanceColor&&(ct=_.instanceColor)),ct!==void 0){const lt=ct.normalized,_t=ct.itemSize,Gt=t.get(ct);if(Gt===void 0)continue;const $t=Gt.buffer,Y=Gt.type,Q=Gt.bytesPerElement,mt=Y===i.INT||Y===i.UNSIGNED_INT||ct.gpuType===va;if(ct.isInterleavedBufferAttribute){const ht=ct.data,Pt=ht.stride,Tt=ct.offset;if(ht.isInstancedInterleavedBuffer){for(let Ft=0;Ft<W.locationSize;Ft++)f(W.location+Ft,ht.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Ft=0;Ft<W.locationSize;Ft++)p(W.location+Ft);i.bindBuffer(i.ARRAY_BUFFER,$t);for(let Ft=0;Ft<W.locationSize;Ft++)v(W.location+Ft,_t/W.locationSize,Y,lt,Pt*Q,(Tt+_t/W.locationSize*Ft)*Q,mt)}else{if(ct.isInstancedBufferAttribute){for(let ht=0;ht<W.locationSize;ht++)f(W.location+ht,ct.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let ht=0;ht<W.locationSize;ht++)p(W.location+ht);i.bindBuffer(i.ARRAY_BUFFER,$t);for(let ht=0;ht<W.locationSize;ht++)v(W.location+ht,_t/W.locationSize,Y,lt,_t*Q,_t/W.locationSize*ht*Q,mt)}}else if(H!==void 0){const lt=H[J];if(lt!==void 0)switch(lt.length){case 2:i.vertexAttrib2fv(W.location,lt);break;case 3:i.vertexAttrib3fv(W.location,lt);break;case 4:i.vertexAttrib4fv(W.location,lt);break;default:i.vertexAttrib1fv(W.location,lt)}}}}T()}function L(){C();for(const _ in n){const E=n[_];for(const z in E){const k=E[z];for(const X in k)h(k[X].object),delete k[X];delete E[z]}delete n[_]}}function R(_){if(n[_.id]===void 0)return;const E=n[_.id];for(const z in E){const k=E[z];for(const X in k)h(k[X].object),delete k[X];delete E[z]}delete n[_.id]}function b(_){for(const E in n){const z=n[E];if(z[_.id]===void 0)continue;const k=z[_.id];for(const X in k)h(k[X].object),delete k[X];delete z[_.id]}}function C(){G(),o=!0,r!==s&&(r=s,l(r.object))}function G(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:G,dispose:L,releaseStatesOfGeometry:R,releaseStatesOfProgram:b,initAttributes:M,enableAttribute:p,disableUnusedAttributes:T}}function sm(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let m=0;for(let g=0;g<u;g++)m+=h[g];e.update(m,n,1)}function c(l,h,u,d){if(u===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let M=0;M<u;M++)g+=h[M];for(let M=0;M<d.length;M++)e.update(g,n,d[M])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function rm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(b){return!(b!==sn&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(b){const C=b===ds&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==vn&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==gn&&!C)}function c(b){if(b==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){const b=t.get("EXT_clip_control");b.clipControlEXT(b.LOWER_LEFT_EXT,b.ZERO_TO_ONE_EXT)}const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:T,maxVaryings:v,maxFragmentUniforms:S,vertexTextures:L,maxSamples:R}}function om(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Pn,a=new Ut,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||n!==0||s;return s=d,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,m){const g=u.clippingPlanes,M=u.clipIntersection,p=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):l();else{const T=r?0:n,v=T*4;let S=f.clippingState||null;c.value=S,S=h(g,d,v,m);for(let L=0;L!==v;++L)S[L]=e[L];f.clippingState=S,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,m,g){const M=u!==null?u.length:0;let p=null;if(M!==0){if(p=c.value,g!==!0||p===null){const f=m+M*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(p===null||p.length<f)&&(p=new Float32Array(f));for(let v=0,S=m;v!==M;++v,S+=4)o.copy(u[v]).applyMatrix4(T,a),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,p}}function am(i){let t=new WeakMap;function e(o,a){return a===Oo?o.mapping=Fi:a===Fo&&(o.mapping=Bi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Oo||a===Fo)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new _d(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class eh extends Zl{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ci=4,xc=[.125,.215,.35,.446,.526,.582],Qn=20,ro=new eh,Mc=new Et;let oo=null,ao=0,co=0,lo=!1;const Jn=(1+Math.sqrt(5))/2,bi=1/Jn,Sc=[new w(-Jn,bi,0),new w(Jn,bi,0),new w(-bi,0,Jn),new w(bi,0,Jn),new w(0,Jn,-bi),new w(0,Jn,bi),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)];class yc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){oo=this._renderer.getRenderTarget(),ao=this._renderer.getActiveCubeFace(),co=this._renderer.getActiveMipmapLevel(),lo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(oo,ao,co),this._renderer.xr.enabled=lo,t.scissorTest=!1,Bs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fi||t.mapping===Bi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),oo=this._renderer.getRenderTarget(),ao=this._renderer.getActiveCubeFace(),co=this._renderer.getActiveMipmapLevel(),lo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:ds,format:sn,colorSpace:Bn,depthBuffer:!1},s=Ec(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ec(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=cm(r)),this._blurMaterial=lm(r,t,e)}return s}_compileMaterial(t){const e=new It(this._lodPlanes[0],t);this._renderer.compile(e,ro)}_sceneToCubeUV(t,e,n,s){const a=new Ge(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Mc),h.toneMapping=Dn,h.autoClear=!1;const m=new cn({name:"PMREM.Background",side:Pe,depthWrite:!1,depthTest:!1}),g=new It(new Mn,m);let M=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,M=!0):(m.color.copy(Mc),M=!0);for(let f=0;f<6;f++){const T=f%3;T===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):T===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const v=this._cubeSize;Bs(s,T*v,f>2?v:0,v,v),h.setRenderTarget(s),M&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Fi||t.mapping===Bi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new It(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Bs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ro)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Sc[(s-r-1)%Sc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new It(this._lodPlanes[s],l),d=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Qn-1),M=r/g,p=isFinite(r)?1+Math.floor(h*M):Qn;p>Qn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Qn}`);const f=[];let T=0;for(let b=0;b<Qn;++b){const C=b/M,G=Math.exp(-C*C/2);f.push(G),b===0?T+=G:b<p&&(T+=2*G)}for(let b=0;b<f.length;b++)f[b]=f[b]/T;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const S=this._sizeLods[s],L=3*S*(s>v-Ci?s-v+Ci:0),R=4*(this._cubeSize-S);Bs(e,L,R,3*S,2*S),c.setRenderTarget(e),c.render(u,ro)}}function cm(i){const t=[],e=[],n=[];let s=i;const r=i-Ci+1+xc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ci?c=xc[o-i+Ci-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,M=3,p=2,f=1,T=new Float32Array(M*g*m),v=new Float32Array(p*g*m),S=new Float32Array(f*g*m);for(let R=0;R<m;R++){const b=R%3*2/3-1,C=R>2?0:-1,G=[b,C,0,b+2/3,C,0,b+2/3,C+1,0,b,C,0,b+2/3,C+1,0,b,C+1,0];T.set(G,M*g*R),v.set(d,p*g*R);const _=[R,R,R,R,R,R];S.set(_,f*g*R)}const L=new _e;L.setAttribute("position",new Oe(T,M)),L.setAttribute("uv",new Oe(v,p)),L.setAttribute("faceIndex",new Oe(S,f)),t.push(L),s>Ci&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ec(i,t,e){const n=new oi(i,t,e);return n.texture.mapping=Ar,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Bs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function lm(i,t,e){const n=new Float32Array(Qn),s=new w(0,1,0);return new On({name:"SphericalGaussianBlur",defines:{n:Qn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function Tc(){return new On({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function wc(){return new On({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function Ra(){return`

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
	`}function hm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Oo||c===Fo,h=c===Fi||c===Bi;if(l||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new yc(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const m=a.image;return l&&m&&m.height>0||h&&m&&s(m)?(e===null&&(e=new yc(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function um(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&hr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function dm(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const M=d.morphAttributes[g];for(let p=0,f=M.length;p<f;p++)t.remove(M[p])}d.removeEventListener("dispose",o),delete s[d.id];const m=r.get(d);m&&(t.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const M=m[g];for(let p=0,f=M.length;p<f;p++)t.update(M[p],i.ARRAY_BUFFER)}}function l(u){const d=[],m=u.index,g=u.attributes.position;let M=0;if(m!==null){const T=m.array;M=m.version;for(let v=0,S=T.length;v<S;v+=3){const L=T[v+0],R=T[v+1],b=T[v+2];d.push(L,R,R,b,b,L)}}else if(g!==void 0){const T=g.array;M=g.version;for(let v=0,S=T.length/3-1;v<S;v+=3){const L=v+0,R=v+1,b=v+2;d.push(L,R,R,b,b,L)}}else return;const p=new(Xl(d)?jl:Kl)(d,1);p.version=M;const f=r.get(u);f&&t.remove(f),r.set(u,p)}function h(u){const d=r.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function fm(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,m){i.drawElements(n,m,r,d*o),e.update(m,n,1)}function l(d,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,d*o,g),e.update(m,n,g))}function h(d,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,d,0,g);let p=0;for(let f=0;f<g;f++)p+=m[f];e.update(p,n,1)}function u(d,m,g,M){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<d.length;f++)l(d[f]/o,m[f],M[f]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,d,0,M,0,g);let f=0;for(let T=0;T<g;T++)f+=m[T];for(let T=0;T<M.length;T++)e.update(f,n,M[T])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function pm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function mm(i,t,e){const n=new WeakMap,s=new Zt;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let _=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var m=_;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,M=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],T=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),M===!0&&(S=2),p===!0&&(S=3);let L=a.attributes.position.count*S,R=1;L>t.maxTextureSize&&(R=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const b=new Float32Array(L*R*4*u),C=new ql(b,L,R,u);C.type=gn,C.needsUpdate=!0;const G=S*4;for(let E=0;E<u;E++){const z=f[E],k=T[E],X=v[E],j=L*R*4*E;for(let H=0;H<z.count;H++){const J=H*G;g===!0&&(s.fromBufferAttribute(z,H),b[j+J+0]=s.x,b[j+J+1]=s.y,b[j+J+2]=s.z,b[j+J+3]=0),M===!0&&(s.fromBufferAttribute(k,H),b[j+J+4]=s.x,b[j+J+5]=s.y,b[j+J+6]=s.z,b[j+J+7]=0),p===!0&&(s.fromBufferAttribute(X,H),b[j+J+8]=s.x,b[j+J+9]=s.y,b[j+J+10]=s.z,b[j+J+11]=X.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new Mt(L,R)},n.set(a,d),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const M=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",M),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function gm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class nh extends Ne{constructor(t,e,n,s,r,o,a,c,l,h=Ii){if(h!==Ii&&h!==ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ii&&(n=ri),n===void 0&&h===ki&&(n=zi),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ke,this.minFilter=c!==void 0?c:Ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ih=new Ne,bc=new nh(1,1),sh=new ql,rh=new ed,oh=new Ql,Ac=[],Rc=[],Cc=new Float32Array(16),Pc=new Float32Array(9),Lc=new Float32Array(4);function Wi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ac[s];if(r===void 0&&(r=new Float32Array(s),Ac[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Pr(i,t){let e=Rc[t];e===void 0&&(e=new Int32Array(t),Rc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function _m(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2fv(this.addr,t),ge(e,t)}}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;i.uniform3fv(this.addr,t),ge(e,t)}}function Mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4fv(this.addr,t),ge(e,t)}}function Sm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Lc.set(n),i.uniformMatrix2fv(this.addr,!1,Lc),ge(e,n)}}function ym(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Pc.set(n),i.uniformMatrix3fv(this.addr,!1,Pc),ge(e,n)}}function Em(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Cc.set(n),i.uniformMatrix4fv(this.addr,!1,Cc),ge(e,n)}}function Tm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2iv(this.addr,t),ge(e,t)}}function bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3iv(this.addr,t),ge(e,t)}}function Am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4iv(this.addr,t),ge(e,t)}}function Rm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2uiv(this.addr,t),ge(e,t)}}function Pm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3uiv(this.addr,t),ge(e,t)}}function Lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4uiv(this.addr,t),ge(e,t)}}function Im(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(bc.compareFunction=Wl,r=bc):r=ih,e.setTexture2D(t||r,s)}function Dm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||rh,s)}function Um(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||oh,s)}function Nm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||sh,s)}function Om(i){switch(i){case 5126:return _m;case 35664:return vm;case 35665:return xm;case 35666:return Mm;case 35674:return Sm;case 35675:return ym;case 35676:return Em;case 5124:case 35670:return Tm;case 35667:case 35671:return wm;case 35668:case 35672:return bm;case 35669:case 35673:return Am;case 5125:return Rm;case 36294:return Cm;case 36295:return Pm;case 36296:return Lm;case 35678:case 36198:case 36298:case 36306:case 35682:return Im;case 35679:case 36299:case 36307:return Dm;case 35680:case 36300:case 36308:case 36293:return Um;case 36289:case 36303:case 36311:case 36292:return Nm}}function Fm(i,t){i.uniform1fv(this.addr,t)}function Bm(i,t){const e=Wi(t,this.size,2);i.uniform2fv(this.addr,e)}function zm(i,t){const e=Wi(t,this.size,3);i.uniform3fv(this.addr,e)}function km(i,t){const e=Wi(t,this.size,4);i.uniform4fv(this.addr,e)}function Hm(i,t){const e=Wi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Gm(i,t){const e=Wi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Vm(i,t){const e=Wi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Wm(i,t){i.uniform1iv(this.addr,t)}function Xm(i,t){i.uniform2iv(this.addr,t)}function Ym(i,t){i.uniform3iv(this.addr,t)}function qm(i,t){i.uniform4iv(this.addr,t)}function $m(i,t){i.uniform1uiv(this.addr,t)}function Km(i,t){i.uniform2uiv(this.addr,t)}function jm(i,t){i.uniform3uiv(this.addr,t)}function Jm(i,t){i.uniform4uiv(this.addr,t)}function Zm(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ih,r[o])}function Qm(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||rh,r[o])}function tg(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||oh,r[o])}function eg(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||sh,r[o])}function ng(i){switch(i){case 5126:return Fm;case 35664:return Bm;case 35665:return zm;case 35666:return km;case 35674:return Hm;case 35675:return Gm;case 35676:return Vm;case 5124:case 35670:return Wm;case 35667:case 35671:return Xm;case 35668:case 35672:return Ym;case 35669:case 35673:return qm;case 5125:return $m;case 36294:return Km;case 36295:return jm;case 36296:return Jm;case 35678:case 36198:case 36298:case 36306:case 35682:return Zm;case 35679:case 36299:case 36307:return Qm;case 35680:case 36300:case 36308:case 36293:return tg;case 36289:case 36303:case 36311:case 36292:return eg}}class ig{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Om(e.type)}}class sg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ng(e.type)}}class rg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const ho=/(\w+)(\])?(\[|\.)?/g;function Ic(i,t){i.seq.push(t),i.map[t.id]=t}function og(i,t,e){const n=i.name,s=n.length;for(ho.lastIndex=0;;){const r=ho.exec(n),o=ho.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Ic(e,l===void 0?new ig(a,i,t):new sg(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new rg(a),Ic(e,u)),e=u}}}class ur{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);og(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Dc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const ag=37297;let cg=0;function lg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function hg(i){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(i);let n;switch(t===e?n="":t===mr&&e===pr?n="LinearDisplayP3ToLinearSRGB":t===pr&&e===mr&&(n="LinearSRGBToLinearDisplayP3"),i){case Bn:case Rr:return[n,"LinearTransferOETF"];case on:case Ta:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Uc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+lg(i.getShaderSource(t),o)}else return s}function ug(i,t){const e=hg(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function dg(i,t){let e;switch(t){case Ll:e="Linear";break;case fu:e="Reinhard";break;case pu:e="Cineon";break;case mu:e="ACESFilmic";break;case _u:e="AgX";break;case vu:e="Neutral";break;case gu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const zs=new w;function fg(){Yt.getLuminanceCoefficients(zs);const i=zs.x.toFixed(4),t=zs.y.toFixed(4),e=zs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(es).join(`
`)}function mg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function gg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function es(i){return i!==""}function Nc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Oc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const _g=/^[ \t]*#include +<([\w\d./]+)>/gm;function da(i){return i.replace(_g,xg)}const vg=new Map;function xg(i,t){let e=Dt[t];if(e===void 0){const n=vg.get(t);if(n!==void 0)e=Dt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return da(e)}const Mg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fc(i){return i.replace(Mg,Sg)}function Sg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function yg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Cl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Yh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===mn&&(t="SHADOWMAP_TYPE_VSM"),t}function Eg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Fi:case Bi:t="ENVMAP_TYPE_CUBE";break;case Ar:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Tg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Bi:t="ENVMAP_MODE_REFRACTION";break}return t}function wg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Pl:t="ENVMAP_BLENDING_MULTIPLY";break;case uu:t="ENVMAP_BLENDING_MIX";break;case du:t="ENVMAP_BLENDING_ADD";break}return t}function bg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Ag(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=yg(e),l=Eg(e),h=Tg(e),u=wg(e),d=bg(e),m=pg(e),g=mg(r),M=s.createProgram();let p,f,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(es).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(es).join(`
`),f.length>0&&(f+=`
`)):(p=[Bc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(es).join(`
`),f=[Bc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?Dt.tonemapping_pars_fragment:"",e.toneMapping!==Dn?dg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Dt.colorspace_pars_fragment,ug("linearToOutputTexel",e.outputColorSpace),fg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(es).join(`
`)),o=da(o),o=Nc(o,e),o=Oc(o,e),a=da(a),a=Nc(a,e),a=Oc(a,e),o=Fc(o),a=Fc(a),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",e.glslVersion===tc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===tc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=T+p+o,S=T+f+a,L=Dc(s,s.VERTEX_SHADER,v),R=Dc(s,s.FRAGMENT_SHADER,S);s.attachShader(M,L),s.attachShader(M,R),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function b(E){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(M).trim(),k=s.getShaderInfoLog(L).trim(),X=s.getShaderInfoLog(R).trim();let j=!0,H=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,L,R);else{const J=Uc(s,L,"vertex"),W=Uc(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+z+`
`+J+`
`+W)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(k===""||X==="")&&(H=!1);H&&(E.diagnostics={runnable:j,programLog:z,vertexShader:{log:k,prefix:p},fragmentShader:{log:X,prefix:f}})}s.deleteShader(L),s.deleteShader(R),C=new ur(s,M),G=gg(s,M)}let C;this.getUniforms=function(){return C===void 0&&b(this),C};let G;this.getAttributes=function(){return G===void 0&&b(this),G};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(M,ag)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=cg++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=L,this.fragmentShader=R,this}let Rg=0;class Cg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Pg(t),e.set(t,n)),n}}class Pg{constructor(t){this.id=Rg++,this.code=t,this.usedTimes=0}}function Lg(i,t,e,n,s,r,o){const a=new ba,c=new Cg,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,m=s.vertexTextures;let g=s.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function f(_,E,z,k,X){const j=k.fog,H=X.geometry,J=_.isMeshStandardMaterial?k.environment:null,W=(_.isMeshStandardMaterial?e:t).get(_.envMap||J),ct=W&&W.mapping===Ar?W.image.height:null,lt=M[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const _t=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Gt=_t!==void 0?_t.length:0;let $t=0;H.morphAttributes.position!==void 0&&($t=1),H.morphAttributes.normal!==void 0&&($t=2),H.morphAttributes.color!==void 0&&($t=3);let Y,Q,mt,ht;if(lt){const Ue=an[lt];Y=Ue.vertexShader,Q=Ue.fragmentShader}else Y=_.vertexShader,Q=_.fragmentShader,c.update(_),mt=c.getVertexShaderID(_),ht=c.getFragmentShaderID(_);const Pt=i.getRenderTarget(),Tt=X.isInstancedMesh===!0,Ft=X.isBatchedMesh===!0,Jt=!!_.map,Bt=!!_.matcap,P=!!W,Fe=!!_.aoMap,Nt=!!_.lightMap,kt=!!_.bumpMap,bt=!!_.normalMap,ee=!!_.displacementMap,Ct=!!_.emissiveMap,A=!!_.metalnessMap,x=!!_.roughnessMap,N=_.anisotropy>0,$=_.clearcoat>0,Z=_.dispersion>0,q=_.iridescence>0,vt=_.sheen>0,it=_.transmission>0,ut=N&&!!_.anisotropyMap,Ht=$&&!!_.clearcoatMap,tt=$&&!!_.clearcoatNormalMap,dt=$&&!!_.clearcoatRoughnessMap,At=q&&!!_.iridescenceMap,Rt=q&&!!_.iridescenceThicknessMap,ft=vt&&!!_.sheenColorMap,Ot=vt&&!!_.sheenRoughnessMap,Lt=!!_.specularMap,Qt=!!_.specularColorMap,I=!!_.specularIntensityMap,ot=it&&!!_.transmissionMap,V=it&&!!_.thicknessMap,K=!!_.gradientMap,st=!!_.alphaMap,at=_.alphaTest>0,zt=!!_.alphaHash,le=!!_.extensions;let De=Dn;_.toneMapped&&(Pt===null||Pt.isXRRenderTarget===!0)&&(De=i.toneMapping);const Vt={shaderID:lt,shaderType:_.type,shaderName:_.name,vertexShader:Y,fragmentShader:Q,defines:_.defines,customVertexShaderID:mt,customFragmentShaderID:ht,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ft,batchingColor:Ft&&X._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&X.instanceColor!==null,instancingMorph:Tt&&X.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:Pt===null?i.outputColorSpace:Pt.isXRRenderTarget===!0?Pt.texture.colorSpace:Bn,alphaToCoverage:!!_.alphaToCoverage,map:Jt,matcap:Bt,envMap:P,envMapMode:P&&W.mapping,envMapCubeUVHeight:ct,aoMap:Fe,lightMap:Nt,bumpMap:kt,normalMap:bt,displacementMap:m&&ee,emissiveMap:Ct,normalMapObjectSpace:bt&&_.normalMapType===yu,normalMapTangentSpace:bt&&_.normalMapType===Vl,metalnessMap:A,roughnessMap:x,anisotropy:N,anisotropyMap:ut,clearcoat:$,clearcoatMap:Ht,clearcoatNormalMap:tt,clearcoatRoughnessMap:dt,dispersion:Z,iridescence:q,iridescenceMap:At,iridescenceThicknessMap:Rt,sheen:vt,sheenColorMap:ft,sheenRoughnessMap:Ot,specularMap:Lt,specularColorMap:Qt,specularIntensityMap:I,transmission:it,transmissionMap:ot,thicknessMap:V,gradientMap:K,opaque:_.transparent===!1&&_.blending===Li&&_.alphaToCoverage===!1,alphaMap:st,alphaTest:at,alphaHash:zt,combine:_.combine,mapUv:Jt&&p(_.map.channel),aoMapUv:Fe&&p(_.aoMap.channel),lightMapUv:Nt&&p(_.lightMap.channel),bumpMapUv:kt&&p(_.bumpMap.channel),normalMapUv:bt&&p(_.normalMap.channel),displacementMapUv:ee&&p(_.displacementMap.channel),emissiveMapUv:Ct&&p(_.emissiveMap.channel),metalnessMapUv:A&&p(_.metalnessMap.channel),roughnessMapUv:x&&p(_.roughnessMap.channel),anisotropyMapUv:ut&&p(_.anisotropyMap.channel),clearcoatMapUv:Ht&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:tt&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:dt&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:At&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:Rt&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&p(_.sheenRoughnessMap.channel),specularMapUv:Lt&&p(_.specularMap.channel),specularColorMapUv:Qt&&p(_.specularColorMap.channel),specularIntensityMapUv:I&&p(_.specularIntensityMap.channel),transmissionMapUv:ot&&p(_.transmissionMap.channel),thicknessMapUv:V&&p(_.thicknessMap.channel),alphaMapUv:st&&p(_.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(bt||N),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!H.attributes.uv&&(Jt||st),fog:!!j,useFog:_.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:d,skinning:X.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Gt,morphTextureStride:$t,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:Jt&&_.map.isVideoTexture===!0&&Yt.getTransfer(_.map.colorSpace)===ie,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===qe,flipSided:_.side===Pe,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:le&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&_.extensions.multiDraw===!0||Ft)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Vt.vertexUv1s=l.has(1),Vt.vertexUv2s=l.has(2),Vt.vertexUv3s=l.has(3),l.clear(),Vt}function T(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const z in _.defines)E.push(z),E.push(_.defines[z]);return _.isRawShaderMaterial===!1&&(v(E,_),S(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function v(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function S(_,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reverseDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.alphaToCoverage&&a.enable(20),_.push(a.mask)}function L(_){const E=M[_.type];let z;if(E){const k=an[E];z=fd.clone(k.uniforms)}else z=_.uniforms;return z}function R(_,E){let z;for(let k=0,X=h.length;k<X;k++){const j=h[k];if(j.cacheKey===E){z=j,++z.usedTimes;break}}return z===void 0&&(z=new Ag(i,E,_,r),h.push(z)),z}function b(_){if(--_.usedTimes===0){const E=h.indexOf(_);h[E]=h[h.length-1],h.pop(),_.destroy()}}function C(_){c.remove(_)}function G(){c.dispose()}return{getParameters:f,getProgramCacheKey:T,getUniforms:L,acquireProgram:R,releaseProgram:b,releaseShaderCache:C,programs:h,dispose:G}}function Ig(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Dg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function zc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function kc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,m,g,M,p){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:m,groupOrder:g,renderOrder:u.renderOrder,z:M,group:p},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=M,f.group=p),t++,f}function a(u,d,m,g,M,p){const f=o(u,d,m,g,M,p);m.transmission>0?n.push(f):m.transparent===!0?s.push(f):e.push(f)}function c(u,d,m,g,M,p){const f=o(u,d,m,g,M,p);m.transmission>0?n.unshift(f):m.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||Dg),n.length>1&&n.sort(d||zc),s.length>1&&s.sort(d||zc)}function h(){for(let u=t,d=i.length;u<d;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Ug(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new kc,i.set(n,[o])):s>=r.length?(o=new kc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ng(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new w,color:new Et};break;case"SpotLight":e={position:new w,direction:new w,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new w,color:new Et,distance:0,decay:0};break;case"HemisphereLight":e={direction:new w,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":e={color:new Et,position:new w,halfWidth:new w,halfHeight:new w};break}return i[t.id]=e,e}}}function Og(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Fg=0;function Bg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function zg(i){const t=new Ng,e=Og(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new w);const s=new w,r=new qt,o=new qt;function a(l){let h=0,u=0,d=0;for(let G=0;G<9;G++)n.probe[G].set(0,0,0);let m=0,g=0,M=0,p=0,f=0,T=0,v=0,S=0,L=0,R=0,b=0;l.sort(Bg);for(let G=0,_=l.length;G<_;G++){const E=l[G],z=E.color,k=E.intensity,X=E.distance,j=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)h+=z.r*k,u+=z.g*k,d+=z.b*k;else if(E.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(E.sh.coefficients[H],k);b++}else if(E.isDirectionalLight){const H=t.get(E);if(H.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const J=E.shadow,W=e.get(E);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.directionalShadow[m]=W,n.directionalShadowMap[m]=j,n.directionalShadowMatrix[m]=E.shadow.matrix,T++}n.directional[m]=H,m++}else if(E.isSpotLight){const H=t.get(E);H.position.setFromMatrixPosition(E.matrixWorld),H.color.copy(z).multiplyScalar(k),H.distance=X,H.coneCos=Math.cos(E.angle),H.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),H.decay=E.decay,n.spot[M]=H;const J=E.shadow;if(E.map&&(n.spotLightMap[L]=E.map,L++,J.updateMatrices(E),E.castShadow&&R++),n.spotLightMatrix[M]=J.matrix,E.castShadow){const W=e.get(E);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.spotShadow[M]=W,n.spotShadowMap[M]=j,S++}M++}else if(E.isRectAreaLight){const H=t.get(E);H.color.copy(z).multiplyScalar(k),H.halfWidth.set(E.width*.5,0,0),H.halfHeight.set(0,E.height*.5,0),n.rectArea[p]=H,p++}else if(E.isPointLight){const H=t.get(E);if(H.color.copy(E.color).multiplyScalar(E.intensity),H.distance=E.distance,H.decay=E.decay,E.castShadow){const J=E.shadow,W=e.get(E);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,W.shadowCameraNear=J.camera.near,W.shadowCameraFar=J.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=E.shadow.matrix,v++}n.point[g]=H,g++}else if(E.isHemisphereLight){const H=t.get(E);H.skyColor.copy(E.color).multiplyScalar(k),H.groundColor.copy(E.groundColor).multiplyScalar(k),n.hemi[f]=H,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=nt.LTC_FLOAT_1,n.rectAreaLTC2=nt.LTC_FLOAT_2):(n.rectAreaLTC1=nt.LTC_HALF_1,n.rectAreaLTC2=nt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==M||C.rectAreaLength!==p||C.hemiLength!==f||C.numDirectionalShadows!==T||C.numPointShadows!==v||C.numSpotShadows!==S||C.numSpotMaps!==L||C.numLightProbes!==b)&&(n.directional.length=m,n.spot.length=M,n.rectArea.length=p,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=S+L-R,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=b,C.directionalLength=m,C.pointLength=g,C.spotLength=M,C.rectAreaLength=p,C.hemiLength=f,C.numDirectionalShadows=T,C.numPointShadows=v,C.numSpotShadows=S,C.numSpotMaps=L,C.numLightProbes=b,n.version=Fg++)}function c(l,h){let u=0,d=0,m=0,g=0,M=0;const p=h.matrixWorldInverse;for(let f=0,T=l.length;f<T;f++){const v=l[f];if(v.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),u++}else if(v.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),m++}else if(v.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),o.identity(),r.copy(v.matrixWorld),r.premultiply(p),o.extractRotation(r),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){const S=n.hemi[M];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(p),M++}}}return{setup:a,setupView:c,state:n}}function Hc(i){const t=new zg(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function kg(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Hc(i),t.set(s,[a])):r>=o.length?(a=new Hc(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Hg extends hi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Gg extends hi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Vg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wg=`uniform sampler2D shadow_pass;
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
}`;function Xg(i,t,e){let n=new Aa;const s=new Mt,r=new Mt,o=new Zt,a=new Hg({depthPacking:Su}),c=new Gg,l={},h=e.maxTextureSize,u={[Nn]:Pe,[Pe]:Nn,[qe]:qe},d=new On({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Mt},radius:{value:4}},vertexShader:Vg,fragmentShader:Wg}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new _e;g.setAttribute("position",new Oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new It(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Cl;let f=this.type;this.render=function(R,b,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;const G=i.getRenderTarget(),_=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),z=i.state;z.setBlending(In),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const k=f!==mn&&this.type===mn,X=f===mn&&this.type!==mn;for(let j=0,H=R.length;j<H;j++){const J=R[j],W=J.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const ct=W.getFrameExtents();if(s.multiply(ct),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ct.x),s.x=r.x*ct.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ct.y),s.y=r.y*ct.y,W.mapSize.y=r.y)),W.map===null||k===!0||X===!0){const _t=this.type!==mn?{minFilter:Ke,magFilter:Ke}:{};W.map!==null&&W.map.dispose(),W.map=new oi(s.x,s.y,_t),W.map.texture.name=J.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const lt=W.getViewportCount();for(let _t=0;_t<lt;_t++){const Gt=W.getViewport(_t);o.set(r.x*Gt.x,r.y*Gt.y,r.x*Gt.z,r.y*Gt.w),z.viewport(o),W.updateMatrices(J,_t),n=W.getFrustum(),S(b,C,W.camera,J,this.type)}W.isPointLightShadow!==!0&&this.type===mn&&T(W,C),W.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(G,_,E)};function T(R,b){const C=t.update(M);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new oi(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(b,null,C,d,M,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(b,null,C,m,M,null)}function v(R,b,C,G){let _=null;const E=C.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(E!==void 0)_=E;else if(_=C.isPointLight===!0?c:a,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const z=_.uuid,k=b.uuid;let X=l[z];X===void 0&&(X={},l[z]=X);let j=X[k];j===void 0&&(j=_.clone(),X[k]=j,b.addEventListener("dispose",L)),_=j}if(_.visible=b.visible,_.wireframe=b.wireframe,G===mn?_.side=b.shadowSide!==null?b.shadowSide:b.side:_.side=b.shadowSide!==null?b.shadowSide:u[b.side],_.alphaMap=b.alphaMap,_.alphaTest=b.alphaTest,_.map=b.map,_.clipShadows=b.clipShadows,_.clippingPlanes=b.clippingPlanes,_.clipIntersection=b.clipIntersection,_.displacementMap=b.displacementMap,_.displacementScale=b.displacementScale,_.displacementBias=b.displacementBias,_.wireframeLinewidth=b.wireframeLinewidth,_.linewidth=b.linewidth,C.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const z=i.properties.get(_);z.light=C}return _}function S(R,b,C,G,_){if(R.visible===!1)return;if(R.layers.test(b.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&_===mn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,R.matrixWorld);const k=t.update(R),X=R.material;if(Array.isArray(X)){const j=k.groups;for(let H=0,J=j.length;H<J;H++){const W=j[H],ct=X[W.materialIndex];if(ct&&ct.visible){const lt=v(R,ct,G,_);R.onBeforeShadow(i,R,b,C,k,lt,W),i.renderBufferDirect(C,null,k,lt,R,W),R.onAfterShadow(i,R,b,C,k,lt,W)}}}else if(X.visible){const j=v(R,X,G,_);R.onBeforeShadow(i,R,b,C,k,j,null),i.renderBufferDirect(C,null,k,j,R,null),R.onAfterShadow(i,R,b,C,k,j,null)}}const z=R.children;for(let k=0,X=z.length;k<X;k++)S(z[k],b,C,G,_)}function L(R){R.target.removeEventListener("dispose",L);for(const C in l){const G=l[C],_=R.target.uuid;_ in G&&(G[_].dispose(),delete G[_])}}}const Yg={[Co]:Po,[Lo]:Uo,[Io]:No,[Oi]:Do,[Po]:Co,[Uo]:Lo,[No]:Io,[Do]:Oi};function qg(i){function t(){let I=!1;const ot=new Zt;let V=null;const K=new Zt(0,0,0,0);return{setMask:function(st){V!==st&&!I&&(i.colorMask(st,st,st,st),V=st)},setLocked:function(st){I=st},setClear:function(st,at,zt,le,De){De===!0&&(st*=le,at*=le,zt*=le),ot.set(st,at,zt,le),K.equals(ot)===!1&&(i.clearColor(st,at,zt,le),K.copy(ot))},reset:function(){I=!1,V=null,K.set(-1,0,0,0)}}}function e(){let I=!1,ot=!1,V=null,K=null,st=null;return{setReversed:function(at){ot=at},setTest:function(at){at?mt(i.DEPTH_TEST):ht(i.DEPTH_TEST)},setMask:function(at){V!==at&&!I&&(i.depthMask(at),V=at)},setFunc:function(at){if(ot&&(at=Yg[at]),K!==at){switch(at){case Co:i.depthFunc(i.NEVER);break;case Po:i.depthFunc(i.ALWAYS);break;case Lo:i.depthFunc(i.LESS);break;case Oi:i.depthFunc(i.LEQUAL);break;case Io:i.depthFunc(i.EQUAL);break;case Do:i.depthFunc(i.GEQUAL);break;case Uo:i.depthFunc(i.GREATER);break;case No:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=at}},setLocked:function(at){I=at},setClear:function(at){st!==at&&(i.clearDepth(at),st=at)},reset:function(){I=!1,V=null,K=null,st=null}}}function n(){let I=!1,ot=null,V=null,K=null,st=null,at=null,zt=null,le=null,De=null;return{setTest:function(Vt){I||(Vt?mt(i.STENCIL_TEST):ht(i.STENCIL_TEST))},setMask:function(Vt){ot!==Vt&&!I&&(i.stencilMask(Vt),ot=Vt)},setFunc:function(Vt,Ue,ln){(V!==Vt||K!==Ue||st!==ln)&&(i.stencilFunc(Vt,Ue,ln),V=Vt,K=Ue,st=ln)},setOp:function(Vt,Ue,ln){(at!==Vt||zt!==Ue||le!==ln)&&(i.stencilOp(Vt,Ue,ln),at=Vt,zt=Ue,le=ln)},setLocked:function(Vt){I=Vt},setClear:function(Vt){De!==Vt&&(i.clearStencil(Vt),De=Vt)},reset:function(){I=!1,ot=null,V=null,K=null,st=null,at=null,zt=null,le=null,De=null}}}const s=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap;let l={},h={},u=new WeakMap,d=[],m=null,g=!1,M=null,p=null,f=null,T=null,v=null,S=null,L=null,R=new Et(0,0,0),b=0,C=!1,G=null,_=null,E=null,z=null,k=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,H=0;const J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(J)[1]),j=H>=1):J.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),j=H>=2);let W=null,ct={};const lt=i.getParameter(i.SCISSOR_BOX),_t=i.getParameter(i.VIEWPORT),Gt=new Zt().fromArray(lt),$t=new Zt().fromArray(_t);function Y(I,ot,V,K){const st=new Uint8Array(4),at=i.createTexture();i.bindTexture(I,at),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<V;zt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(ot,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(ot+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return at}const Q={};Q[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),mt(i.DEPTH_TEST),r.setFunc(Oi),Nt(!1),kt(Ka),mt(i.CULL_FACE),P(In);function mt(I){l[I]!==!0&&(i.enable(I),l[I]=!0)}function ht(I){l[I]!==!1&&(i.disable(I),l[I]=!1)}function Pt(I,ot){return h[I]!==ot?(i.bindFramebuffer(I,ot),h[I]=ot,I===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ot),I===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ot),!0):!1}function Tt(I,ot){let V=d,K=!1;if(I){V=u.get(ot),V===void 0&&(V=[],u.set(ot,V));const st=I.textures;if(V.length!==st.length||V[0]!==i.COLOR_ATTACHMENT0){for(let at=0,zt=st.length;at<zt;at++)V[at]=i.COLOR_ATTACHMENT0+at;V.length=st.length,K=!0}}else V[0]!==i.BACK&&(V[0]=i.BACK,K=!0);K&&i.drawBuffers(V)}function Ft(I){return m!==I?(i.useProgram(I),m=I,!0):!1}const Jt={[Zn]:i.FUNC_ADD,[$h]:i.FUNC_SUBTRACT,[Kh]:i.FUNC_REVERSE_SUBTRACT};Jt[jh]=i.MIN,Jt[Jh]=i.MAX;const Bt={[Zh]:i.ZERO,[Qh]:i.ONE,[tu]:i.SRC_COLOR,[Ao]:i.SRC_ALPHA,[ou]:i.SRC_ALPHA_SATURATE,[su]:i.DST_COLOR,[nu]:i.DST_ALPHA,[eu]:i.ONE_MINUS_SRC_COLOR,[Ro]:i.ONE_MINUS_SRC_ALPHA,[ru]:i.ONE_MINUS_DST_COLOR,[iu]:i.ONE_MINUS_DST_ALPHA,[au]:i.CONSTANT_COLOR,[cu]:i.ONE_MINUS_CONSTANT_COLOR,[lu]:i.CONSTANT_ALPHA,[hu]:i.ONE_MINUS_CONSTANT_ALPHA};function P(I,ot,V,K,st,at,zt,le,De,Vt){if(I===In){g===!0&&(ht(i.BLEND),g=!1);return}if(g===!1&&(mt(i.BLEND),g=!0),I!==qh){if(I!==M||Vt!==C){if((p!==Zn||v!==Zn)&&(i.blendEquation(i.FUNC_ADD),p=Zn,v=Zn),Vt)switch(I){case Li:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case os:i.blendFunc(i.ONE,i.ONE);break;case ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ja:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Li:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case os:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ja:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ja:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}f=null,T=null,S=null,L=null,R.set(0,0,0),b=0,M=I,C=Vt}return}st=st||ot,at=at||V,zt=zt||K,(ot!==p||st!==v)&&(i.blendEquationSeparate(Jt[ot],Jt[st]),p=ot,v=st),(V!==f||K!==T||at!==S||zt!==L)&&(i.blendFuncSeparate(Bt[V],Bt[K],Bt[at],Bt[zt]),f=V,T=K,S=at,L=zt),(le.equals(R)===!1||De!==b)&&(i.blendColor(le.r,le.g,le.b,De),R.copy(le),b=De),M=I,C=!1}function Fe(I,ot){I.side===qe?ht(i.CULL_FACE):mt(i.CULL_FACE);let V=I.side===Pe;ot&&(V=!V),Nt(V),I.blending===Li&&I.transparent===!1?P(In):P(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),s.setMask(I.colorWrite);const K=I.stencilWrite;o.setTest(K),K&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ee(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?mt(i.SAMPLE_ALPHA_TO_COVERAGE):ht(i.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(I){G!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),G=I)}function kt(I){I!==Wh?(mt(i.CULL_FACE),I!==_&&(I===Ka?i.cullFace(i.BACK):I===Xh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ht(i.CULL_FACE),_=I}function bt(I){I!==E&&(j&&i.lineWidth(I),E=I)}function ee(I,ot,V){I?(mt(i.POLYGON_OFFSET_FILL),(z!==ot||k!==V)&&(i.polygonOffset(ot,V),z=ot,k=V)):ht(i.POLYGON_OFFSET_FILL)}function Ct(I){I?mt(i.SCISSOR_TEST):ht(i.SCISSOR_TEST)}function A(I){I===void 0&&(I=i.TEXTURE0+X-1),W!==I&&(i.activeTexture(I),W=I)}function x(I,ot,V){V===void 0&&(W===null?V=i.TEXTURE0+X-1:V=W);let K=ct[V];K===void 0&&(K={type:void 0,texture:void 0},ct[V]=K),(K.type!==I||K.texture!==ot)&&(W!==V&&(i.activeTexture(V),W=V),i.bindTexture(I,ot||Q[I]),K.type=I,K.texture=ot)}function N(){const I=ct[W];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function vt(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function it(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ut(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ht(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function dt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Rt(I){Gt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Gt.copy(I))}function ft(I){$t.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),$t.copy(I))}function Ot(I,ot){let V=c.get(ot);V===void 0&&(V=new WeakMap,c.set(ot,V));let K=V.get(I);K===void 0&&(K=i.getUniformBlockIndex(ot,I.name),V.set(I,K))}function Lt(I,ot){const K=c.get(ot).get(I);a.get(ot)!==K&&(i.uniformBlockBinding(ot,K,I.__bindingPointIndex),a.set(ot,K))}function Qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},W=null,ct={},h={},u=new WeakMap,d=[],m=null,g=!1,M=null,p=null,f=null,T=null,v=null,S=null,L=null,R=new Et(0,0,0),b=0,C=!1,G=null,_=null,E=null,z=null,k=null,Gt.set(0,0,i.canvas.width,i.canvas.height),$t.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:mt,disable:ht,bindFramebuffer:Pt,drawBuffers:Tt,useProgram:Ft,setBlending:P,setMaterial:Fe,setFlipSided:Nt,setCullFace:kt,setLineWidth:bt,setPolygonOffset:ee,setScissorTest:Ct,activeTexture:A,bindTexture:x,unbindTexture:N,compressedTexImage2D:$,compressedTexImage3D:Z,texImage2D:dt,texImage3D:At,updateUBOMapping:Ot,uniformBlockBinding:Lt,texStorage2D:Ht,texStorage3D:tt,texSubImage2D:q,texSubImage3D:vt,compressedTexSubImage2D:it,compressedTexSubImage3D:ut,scissor:Rt,viewport:ft,reset:Qt}}function Gc(i,t,e,n){const s=$g(n);switch(e){case Ol:return i*t;case Bl:return i*t;case zl:return i*t*2;case kl:return i*t/s.components*s.byteLength;case Sa:return i*t/s.components*s.byteLength;case Hl:return i*t*2/s.components*s.byteLength;case ya:return i*t*2/s.components*s.byteLength;case Fl:return i*t*3/s.components*s.byteLength;case sn:return i*t*4/s.components*s.byteLength;case Ea:return i*t*4/s.components*s.byteLength;case rr:case or:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ar:case cr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ho:case Vo:return Math.max(i,16)*Math.max(t,8)/4;case ko:case Go:return Math.max(i,8)*Math.max(t,8)/2;case Wo:case Xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Yo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case $o:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ko:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case jo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Jo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Zo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Qo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ta:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ea:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case na:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ia:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case sa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ra:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case oa:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case lr:case aa:case ca:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Gl:case la:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ha:case ua:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function $g(i){switch(i){case vn:case Dl:return{byteLength:1,components:1};case as:case Ul:case ds:return{byteLength:2,components:1};case xa:case Ma:return{byteLength:2,components:4};case ri:case va:case gn:return{byteLength:4,components:1};case Nl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Kg(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Mt,h=new WeakMap;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,x){return m?new OffscreenCanvas(A,x):_r("canvas")}function M(A,x,N){let $=1;const Z=Ct(A);if((Z.width>N||Z.height>N)&&($=N/Math.max(Z.width,Z.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const q=Math.floor($*Z.width),vt=Math.floor($*Z.height);u===void 0&&(u=g(q,vt));const it=x?g(q,vt):u;return it.width=q,it.height=vt,it.getContext("2d").drawImage(A,0,0,q,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+q+"x"+vt+")."),it}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),A;return A}function p(A){return A.generateMipmaps&&A.minFilter!==Ke&&A.minFilter!==en}function f(A){i.generateMipmap(A)}function T(A,x,N,$,Z=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let q=x;if(x===i.RED&&(N===i.FLOAT&&(q=i.R32F),N===i.HALF_FLOAT&&(q=i.R16F),N===i.UNSIGNED_BYTE&&(q=i.R8)),x===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.R8UI),N===i.UNSIGNED_SHORT&&(q=i.R16UI),N===i.UNSIGNED_INT&&(q=i.R32UI),N===i.BYTE&&(q=i.R8I),N===i.SHORT&&(q=i.R16I),N===i.INT&&(q=i.R32I)),x===i.RG&&(N===i.FLOAT&&(q=i.RG32F),N===i.HALF_FLOAT&&(q=i.RG16F),N===i.UNSIGNED_BYTE&&(q=i.RG8)),x===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.RG8UI),N===i.UNSIGNED_SHORT&&(q=i.RG16UI),N===i.UNSIGNED_INT&&(q=i.RG32UI),N===i.BYTE&&(q=i.RG8I),N===i.SHORT&&(q=i.RG16I),N===i.INT&&(q=i.RG32I)),x===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.RGB8UI),N===i.UNSIGNED_SHORT&&(q=i.RGB16UI),N===i.UNSIGNED_INT&&(q=i.RGB32UI),N===i.BYTE&&(q=i.RGB8I),N===i.SHORT&&(q=i.RGB16I),N===i.INT&&(q=i.RGB32I)),x===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),N===i.UNSIGNED_INT&&(q=i.RGBA32UI),N===i.BYTE&&(q=i.RGBA8I),N===i.SHORT&&(q=i.RGBA16I),N===i.INT&&(q=i.RGBA32I)),x===i.RGB&&N===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),x===i.RGBA){const vt=Z?fr:Yt.getTransfer($);N===i.FLOAT&&(q=i.RGBA32F),N===i.HALF_FLOAT&&(q=i.RGBA16F),N===i.UNSIGNED_BYTE&&(q=vt===ie?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function v(A,x){let N;return A?x===null||x===ri||x===zi?N=i.DEPTH24_STENCIL8:x===gn?N=i.DEPTH32F_STENCIL8:x===as&&(N=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ri||x===zi?N=i.DEPTH_COMPONENT24:x===gn?N=i.DEPTH_COMPONENT32F:x===as&&(N=i.DEPTH_COMPONENT16),N}function S(A,x){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ke&&A.minFilter!==en?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function L(A){const x=A.target;x.removeEventListener("dispose",L),b(x),x.isVideoTexture&&h.delete(x)}function R(A){const x=A.target;x.removeEventListener("dispose",R),G(x)}function b(A){const x=n.get(A);if(x.__webglInit===void 0)return;const N=A.source,$=d.get(N);if($){const Z=$[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&C(A),Object.keys($).length===0&&d.delete(N)}n.remove(A)}function C(A){const x=n.get(A);i.deleteTexture(x.__webglTexture);const N=A.source,$=d.get(N);delete $[x.__cacheKey],o.memory.textures--}function G(A){const x=n.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(x.__webglFramebuffer[$]))for(let Z=0;Z<x.__webglFramebuffer[$].length;Z++)i.deleteFramebuffer(x.__webglFramebuffer[$][Z]);else i.deleteFramebuffer(x.__webglFramebuffer[$]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[$])}else{if(Array.isArray(x.__webglFramebuffer))for(let $=0;$<x.__webglFramebuffer.length;$++)i.deleteFramebuffer(x.__webglFramebuffer[$]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let $=0;$<x.__webglColorRenderbuffer.length;$++)x.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[$]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const N=A.textures;for(let $=0,Z=N.length;$<Z;$++){const q=n.get(N[$]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(N[$])}n.remove(A)}let _=0;function E(){_=0}function z(){const A=_;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),_+=1,A}function k(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function X(A,x){const N=n.get(A);if(A.isVideoTexture&&bt(A),A.isRenderTargetTexture===!1&&A.version>0&&N.__version!==A.version){const $=A.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$t(N,A,x);return}}e.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+x)}function j(A,x){const N=n.get(A);if(A.version>0&&N.__version!==A.version){$t(N,A,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+x)}function H(A,x){const N=n.get(A);if(A.version>0&&N.__version!==A.version){$t(N,A,x);return}e.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+x)}function J(A,x){const N=n.get(A);if(A.version>0&&N.__version!==A.version){Y(N,A,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+x)}const W={[Bo]:i.REPEAT,[ti]:i.CLAMP_TO_EDGE,[zo]:i.MIRRORED_REPEAT},ct={[Ke]:i.NEAREST,[xu]:i.NEAREST_MIPMAP_NEAREST,[xs]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[Fr]:i.LINEAR_MIPMAP_NEAREST,[ei]:i.LINEAR_MIPMAP_LINEAR},lt={[Eu]:i.NEVER,[Cu]:i.ALWAYS,[Tu]:i.LESS,[Wl]:i.LEQUAL,[wu]:i.EQUAL,[Ru]:i.GEQUAL,[bu]:i.GREATER,[Au]:i.NOTEQUAL};function _t(A,x){if(x.type===gn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===en||x.magFilter===Fr||x.magFilter===xs||x.magFilter===ei||x.minFilter===en||x.minFilter===Fr||x.minFilter===xs||x.minFilter===ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,W[x.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,W[x.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,W[x.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ct[x.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ct[x.minFilter]),x.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,lt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ke||x.minFilter!==xs&&x.minFilter!==ei||x.type===gn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Gt(A,x){let N=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",L));const $=x.source;let Z=d.get($);Z===void 0&&(Z={},d.set($,Z));const q=k(x);if(q!==A.__cacheKey){Z[q]===void 0&&(Z[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,N=!0),Z[q].usedTimes++;const vt=Z[A.__cacheKey];vt!==void 0&&(Z[A.__cacheKey].usedTimes--,vt.usedTimes===0&&C(x)),A.__cacheKey=q,A.__webglTexture=Z[q].texture}return N}function $t(A,x,N){let $=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&($=i.TEXTURE_3D);const Z=Gt(A,x),q=x.source;e.bindTexture($,A.__webglTexture,i.TEXTURE0+N);const vt=n.get(q);if(q.version!==vt.__version||Z===!0){e.activeTexture(i.TEXTURE0+N);const it=Yt.getPrimaries(Yt.workingColorSpace),ut=x.colorSpace===Ln?null:Yt.getPrimaries(x.colorSpace),Ht=x.colorSpace===Ln||it===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);let tt=M(x.image,!1,s.maxTextureSize);tt=ee(x,tt);const dt=r.convert(x.format,x.colorSpace),At=r.convert(x.type);let Rt=T(x.internalFormat,dt,At,x.colorSpace,x.isVideoTexture);_t($,x);let ft;const Ot=x.mipmaps,Lt=x.isVideoTexture!==!0,Qt=vt.__version===void 0||Z===!0,I=q.dataReady,ot=S(x,tt);if(x.isDepthTexture)Rt=v(x.format===ki,x.type),Qt&&(Lt?e.texStorage2D(i.TEXTURE_2D,1,Rt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,Rt,tt.width,tt.height,0,dt,At,null));else if(x.isDataTexture)if(Ot.length>0){Lt&&Qt&&e.texStorage2D(i.TEXTURE_2D,ot,Rt,Ot[0].width,Ot[0].height);for(let V=0,K=Ot.length;V<K;V++)ft=Ot[V],Lt?I&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,ft.width,ft.height,dt,At,ft.data):e.texImage2D(i.TEXTURE_2D,V,Rt,ft.width,ft.height,0,dt,At,ft.data);x.generateMipmaps=!1}else Lt?(Qt&&e.texStorage2D(i.TEXTURE_2D,ot,Rt,tt.width,tt.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,tt.width,tt.height,dt,At,tt.data)):e.texImage2D(i.TEXTURE_2D,0,Rt,tt.width,tt.height,0,dt,At,tt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Lt&&Qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ot,Rt,Ot[0].width,Ot[0].height,tt.depth);for(let V=0,K=Ot.length;V<K;V++)if(ft=Ot[V],x.format!==sn)if(dt!==null)if(Lt){if(I)if(x.layerUpdates.size>0){const st=Gc(ft.width,ft.height,x.format,x.type);for(const at of x.layerUpdates){const zt=ft.data.subarray(at*st/ft.data.BYTES_PER_ELEMENT,(at+1)*st/ft.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,at,ft.width,ft.height,1,dt,zt,0,0)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,ft.width,ft.height,tt.depth,dt,ft.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,V,Rt,ft.width,ft.height,tt.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Lt?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,ft.width,ft.height,tt.depth,dt,At,ft.data):e.texImage3D(i.TEXTURE_2D_ARRAY,V,Rt,ft.width,ft.height,tt.depth,0,dt,At,ft.data)}else{Lt&&Qt&&e.texStorage2D(i.TEXTURE_2D,ot,Rt,Ot[0].width,Ot[0].height);for(let V=0,K=Ot.length;V<K;V++)ft=Ot[V],x.format!==sn?dt!==null?Lt?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,V,0,0,ft.width,ft.height,dt,ft.data):e.compressedTexImage2D(i.TEXTURE_2D,V,Rt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Lt?I&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,ft.width,ft.height,dt,At,ft.data):e.texImage2D(i.TEXTURE_2D,V,Rt,ft.width,ft.height,0,dt,At,ft.data)}else if(x.isDataArrayTexture)if(Lt){if(Qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ot,Rt,tt.width,tt.height,tt.depth),I)if(x.layerUpdates.size>0){const V=Gc(tt.width,tt.height,x.format,x.type);for(const K of x.layerUpdates){const st=tt.data.subarray(K*V/tt.data.BYTES_PER_ELEMENT,(K+1)*V/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,tt.width,tt.height,1,dt,At,st)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,dt,At,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,tt.width,tt.height,tt.depth,0,dt,At,tt.data);else if(x.isData3DTexture)Lt?(Qt&&e.texStorage3D(i.TEXTURE_3D,ot,Rt,tt.width,tt.height,tt.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,dt,At,tt.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,tt.width,tt.height,tt.depth,0,dt,At,tt.data);else if(x.isFramebufferTexture){if(Qt)if(Lt)e.texStorage2D(i.TEXTURE_2D,ot,Rt,tt.width,tt.height);else{let V=tt.width,K=tt.height;for(let st=0;st<ot;st++)e.texImage2D(i.TEXTURE_2D,st,Rt,V,K,0,dt,At,null),V>>=1,K>>=1}}else if(Ot.length>0){if(Lt&&Qt){const V=Ct(Ot[0]);e.texStorage2D(i.TEXTURE_2D,ot,Rt,V.width,V.height)}for(let V=0,K=Ot.length;V<K;V++)ft=Ot[V],Lt?I&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,dt,At,ft):e.texImage2D(i.TEXTURE_2D,V,Rt,dt,At,ft);x.generateMipmaps=!1}else if(Lt){if(Qt){const V=Ct(tt);e.texStorage2D(i.TEXTURE_2D,ot,Rt,V.width,V.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,dt,At,tt)}else e.texImage2D(i.TEXTURE_2D,0,Rt,dt,At,tt);p(x)&&f($),vt.__version=q.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Y(A,x,N){if(x.image.length!==6)return;const $=Gt(A,x),Z=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+N);const q=n.get(Z);if(Z.version!==q.__version||$===!0){e.activeTexture(i.TEXTURE0+N);const vt=Yt.getPrimaries(Yt.workingColorSpace),it=x.colorSpace===Ln?null:Yt.getPrimaries(x.colorSpace),ut=x.colorSpace===Ln||vt===it?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Ht=x.isCompressedTexture||x.image[0].isCompressedTexture,tt=x.image[0]&&x.image[0].isDataTexture,dt=[];for(let K=0;K<6;K++)!Ht&&!tt?dt[K]=M(x.image[K],!0,s.maxCubemapSize):dt[K]=tt?x.image[K].image:x.image[K],dt[K]=ee(x,dt[K]);const At=dt[0],Rt=r.convert(x.format,x.colorSpace),ft=r.convert(x.type),Ot=T(x.internalFormat,Rt,ft,x.colorSpace),Lt=x.isVideoTexture!==!0,Qt=q.__version===void 0||$===!0,I=Z.dataReady;let ot=S(x,At);_t(i.TEXTURE_CUBE_MAP,x);let V;if(Ht){Lt&&Qt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ot,Ot,At.width,At.height);for(let K=0;K<6;K++){V=dt[K].mipmaps;for(let st=0;st<V.length;st++){const at=V[st];x.format!==sn?Rt!==null?Lt?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st,0,0,at.width,at.height,Rt,at.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st,Ot,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Lt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st,0,0,at.width,at.height,Rt,ft,at.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st,Ot,at.width,at.height,0,Rt,ft,at.data)}}}else{if(V=x.mipmaps,Lt&&Qt){V.length>0&&ot++;const K=Ct(dt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ot,Ot,K.width,K.height)}for(let K=0;K<6;K++)if(tt){Lt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,dt[K].width,dt[K].height,Rt,ft,dt[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ot,dt[K].width,dt[K].height,0,Rt,ft,dt[K].data);for(let st=0;st<V.length;st++){const zt=V[st].image[K].image;Lt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st+1,0,0,zt.width,zt.height,Rt,ft,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st+1,Ot,zt.width,zt.height,0,Rt,ft,zt.data)}}else{Lt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Rt,ft,dt[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ot,Rt,ft,dt[K]);for(let st=0;st<V.length;st++){const at=V[st];Lt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st+1,0,0,Rt,ft,at.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,st+1,Ot,Rt,ft,at.image[K])}}}p(x)&&f(i.TEXTURE_CUBE_MAP),q.__version=Z.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Q(A,x,N,$,Z,q){const vt=r.convert(N.format,N.colorSpace),it=r.convert(N.type),ut=T(N.internalFormat,vt,it,N.colorSpace);if(!n.get(x).__hasExternalTextures){const tt=Math.max(1,x.width>>q),dt=Math.max(1,x.height>>q);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,q,ut,tt,dt,x.depth,0,vt,it,null):e.texImage2D(Z,q,ut,tt,dt,0,vt,it,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),kt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,n.get(N).__webglTexture,0,Nt(x)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,n.get(N).__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function mt(A,x,N){if(i.bindRenderbuffer(i.RENDERBUFFER,A),x.depthBuffer){const $=x.depthTexture,Z=$&&$.isDepthTexture?$.type:null,q=v(x.stencilBuffer,Z),vt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=Nt(x);kt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,q,x.width,x.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,q,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,q,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,vt,i.RENDERBUFFER,A)}else{const $=x.textures;for(let Z=0;Z<$.length;Z++){const q=$[Z],vt=r.convert(q.format,q.colorSpace),it=r.convert(q.type),ut=T(q.internalFormat,vt,it,q.colorSpace),Ht=Nt(x);N&&kt(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht,ut,x.width,x.height):kt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ht,ut,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ut,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ht(A,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X(x.depthTexture,0);const $=n.get(x.depthTexture).__webglTexture,Z=Nt(x);if(x.depthTexture.format===Ii)kt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(x.depthTexture.format===ki)kt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Pt(A){const x=n.get(A),N=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),$){const Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,$.removeEventListener("dispose",Z)};$.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=$}if(A.depthTexture&&!x.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");ht(x.__webglFramebuffer,A)}else if(N){x.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[$]),x.__webglDepthbuffer[$]===void 0)x.__webglDepthbuffer[$]=i.createRenderbuffer(),mt(x.__webglDepthbuffer[$],A,!1);else{const Z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),mt(x.__webglDepthbuffer,A,!1);else{const $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,Z)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Tt(A,x,N){const $=n.get(A);x!==void 0&&Q($.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&Pt(A)}function Ft(A){const x=A.texture,N=n.get(A),$=n.get(x);A.addEventListener("dispose",R);const Z=A.textures,q=A.isWebGLCubeRenderTarget===!0,vt=Z.length>1;if(vt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=x.version,o.memory.textures++),q){N.__webglFramebuffer=[];for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer[it]=[];for(let ut=0;ut<x.mipmaps.length;ut++)N.__webglFramebuffer[it][ut]=i.createFramebuffer()}else N.__webglFramebuffer[it]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer=[];for(let it=0;it<x.mipmaps.length;it++)N.__webglFramebuffer[it]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(vt)for(let it=0,ut=Z.length;it<ut;it++){const Ht=n.get(Z[it]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&kt(A)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let it=0;it<Z.length;it++){const ut=Z[it];N.__webglColorRenderbuffer[it]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[it]);const Ht=r.convert(ut.format,ut.colorSpace),tt=r.convert(ut.type),dt=T(ut.internalFormat,Ht,tt,ut.colorSpace,A.isXRRenderTarget===!0),At=Nt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,At,dt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+it,i.RENDERBUFFER,N.__webglColorRenderbuffer[it])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),mt(N.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),_t(i.TEXTURE_CUBE_MAP,x);for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0)for(let ut=0;ut<x.mipmaps.length;ut++)Q(N.__webglFramebuffer[it][ut],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,ut);else Q(N.__webglFramebuffer[it],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);p(x)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(vt){for(let it=0,ut=Z.length;it<ut;it++){const Ht=Z[it],tt=n.get(Ht);e.bindTexture(i.TEXTURE_2D,tt.__webglTexture),_t(i.TEXTURE_2D,Ht),Q(N.__webglFramebuffer,A,Ht,i.COLOR_ATTACHMENT0+it,i.TEXTURE_2D,0),p(Ht)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let it=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(it=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(it,$.__webglTexture),_t(it,x),x.mipmaps&&x.mipmaps.length>0)for(let ut=0;ut<x.mipmaps.length;ut++)Q(N.__webglFramebuffer[ut],A,x,i.COLOR_ATTACHMENT0,it,ut);else Q(N.__webglFramebuffer,A,x,i.COLOR_ATTACHMENT0,it,0);p(x)&&f(it),e.unbindTexture()}A.depthBuffer&&Pt(A)}function Jt(A){const x=A.textures;for(let N=0,$=x.length;N<$;N++){const Z=x[N];if(p(Z)){const q=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,vt=n.get(Z).__webglTexture;e.bindTexture(q,vt),f(q),e.unbindTexture()}}}const Bt=[],P=[];function Fe(A){if(A.samples>0){if(kt(A)===!1){const x=A.textures,N=A.width,$=A.height;let Z=i.COLOR_BUFFER_BIT;const q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,vt=n.get(A),it=x.length>1;if(it)for(let ut=0;ut<x.length;ut++)e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let ut=0;ut<x.length;ut++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),it){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,vt.__webglColorRenderbuffer[ut]);const Ht=n.get(x[ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ht,0)}i.blitFramebuffer(0,0,N,$,0,0,N,$,Z,i.NEAREST),c===!0&&(Bt.length=0,P.length=0,Bt.push(i.COLOR_ATTACHMENT0+ut),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Bt.push(q),P.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,P)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Bt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),it)for(let ut=0;ut<x.length;ut++){e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,vt.__webglColorRenderbuffer[ut]);const Ht=n.get(x[ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,Ht,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const x=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Nt(A){return Math.min(s.maxSamples,A.samples)}function kt(A){const x=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function bt(A){const x=o.render.frame;h.get(A)!==x&&(h.set(A,x),A.update())}function ee(A,x){const N=A.colorSpace,$=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||N!==Bn&&N!==Ln&&(Yt.getTransfer(N)===ie?($!==sn||Z!==vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),x}function Ct(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=E,this.setTexture2D=X,this.setTexture2DArray=j,this.setTexture3D=H,this.setTextureCube=J,this.rebindTextures=Tt,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=Jt,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=Pt,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=kt}function jg(i,t){function e(n,s=Ln){let r;const o=Yt.getTransfer(s);if(n===vn)return i.UNSIGNED_BYTE;if(n===xa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ma)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Nl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Dl)return i.BYTE;if(n===Ul)return i.SHORT;if(n===as)return i.UNSIGNED_SHORT;if(n===va)return i.INT;if(n===ri)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===ds)return i.HALF_FLOAT;if(n===Ol)return i.ALPHA;if(n===Fl)return i.RGB;if(n===sn)return i.RGBA;if(n===Bl)return i.LUMINANCE;if(n===zl)return i.LUMINANCE_ALPHA;if(n===Ii)return i.DEPTH_COMPONENT;if(n===ki)return i.DEPTH_STENCIL;if(n===kl)return i.RED;if(n===Sa)return i.RED_INTEGER;if(n===Hl)return i.RG;if(n===ya)return i.RG_INTEGER;if(n===Ea)return i.RGBA_INTEGER;if(n===rr||n===or||n===ar||n===cr)if(o===ie)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===rr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===rr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===or)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ar)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===cr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ko||n===Ho||n===Go||n===Vo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ko)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ho)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Go)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Vo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Wo||n===Xo||n===Yo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Wo||n===Xo)return o===ie?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Yo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===qo||n===$o||n===Ko||n===jo||n===Jo||n===Zo||n===Qo||n===ta||n===ea||n===na||n===ia||n===sa||n===ra||n===oa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===$o)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ko)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===jo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Jo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Zo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Qo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ta)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ea)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===na)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ia)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===sa)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ra)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===oa)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===lr||n===aa||n===ca)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===lr)return o===ie?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===aa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ca)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Gl||n===la||n===ha||n===ua)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===lr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===la)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ha)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ua)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Jg extends Ge{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class re extends pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zg={type:"move"};class uo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const M of t.hand.values()){const p=e.getJointPose(M,n),f=this._getHandJoint(l,M);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&d>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zg)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new re;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Qg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,t_=`
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

}`;class e_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ne,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new On({vertexShader:Qg,fragmentShader:t_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new It(new Fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class n_ extends Gi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,m=null,g=null;const M=new e_,p=e.getContextAttributes();let f=null,T=null;const v=[],S=[],L=new Mt;let R=null;const b=new Ge;b.layers.enable(1),b.viewport=new Zt;const C=new Ge;C.layers.enable(2),C.viewport=new Zt;const G=[b,C],_=new Jg;_.layers.enable(1),_.layers.enable(2);let E=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=v[Y];return Q===void 0&&(Q=new uo,v[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=v[Y];return Q===void 0&&(Q=new uo,v[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=v[Y];return Q===void 0&&(Q=new uo,v[Y]=Q),Q.getHandSpace()};function k(Y){const Q=S.indexOf(Y.inputSource);if(Q===-1)return;const mt=v[Q];mt!==void 0&&(mt.update(Y.inputSource,Y.frame,l||o),mt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",j);for(let Y=0;Y<v.length;Y++){const Q=S[Y];Q!==null&&(S[Y]=null,v[Y].disconnect(Q))}E=null,z=null,M.reset(),t.setRenderTarget(f),m=null,d=null,u=null,s=null,T=null,$t.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",X),s.addEventListener("inputsourceschange",j),p.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const Q={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),T=new oi(m.framebufferWidth,m.framebufferHeight,{format:sn,type:vn,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let Q=null,mt=null,ht=null;p.depth&&(ht=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=p.stencil?ki:Ii,mt=p.stencil?zi:ri);const Pt={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Pt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),T=new oi(d.textureWidth,d.textureHeight,{format:sn,type:vn,depthTexture:new nh(d.textureWidth,d.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),$t.setContext(s),$t.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function j(Y){for(let Q=0;Q<Y.removed.length;Q++){const mt=Y.removed[Q],ht=S.indexOf(mt);ht>=0&&(S[ht]=null,v[ht].disconnect(mt))}for(let Q=0;Q<Y.added.length;Q++){const mt=Y.added[Q];let ht=S.indexOf(mt);if(ht===-1){for(let Tt=0;Tt<v.length;Tt++)if(Tt>=S.length){S.push(mt),ht=Tt;break}else if(S[Tt]===null){S[Tt]=mt,ht=Tt;break}if(ht===-1)break}const Pt=v[ht];Pt&&Pt.connect(mt)}}const H=new w,J=new w;function W(Y,Q,mt){H.setFromMatrixPosition(Q.matrixWorld),J.setFromMatrixPosition(mt.matrixWorld);const ht=H.distanceTo(J),Pt=Q.projectionMatrix.elements,Tt=mt.projectionMatrix.elements,Ft=Pt[14]/(Pt[10]-1),Jt=Pt[14]/(Pt[10]+1),Bt=(Pt[9]+1)/Pt[5],P=(Pt[9]-1)/Pt[5],Fe=(Pt[8]-1)/Pt[0],Nt=(Tt[8]+1)/Tt[0],kt=Ft*Fe,bt=Ft*Nt,ee=ht/(-Fe+Nt),Ct=ee*-Fe;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ct),Y.translateZ(ee),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Pt[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const A=Ft+ee,x=Jt+ee,N=kt-Ct,$=bt+(ht-Ct),Z=Bt*Jt/x*A,q=P*Jt/x*A;Y.projectionMatrix.makePerspective(N,$,Z,q,A,x),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ct(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let Q=Y.near,mt=Y.far;M.texture!==null&&(M.depthNear>0&&(Q=M.depthNear),M.depthFar>0&&(mt=M.depthFar)),_.near=C.near=b.near=Q,_.far=C.far=b.far=mt,(E!==_.near||z!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),E=_.near,z=_.far);const ht=Y.parent,Pt=_.cameras;ct(_,ht);for(let Tt=0;Tt<Pt.length;Tt++)ct(Pt[Tt],ht);Pt.length===2?W(_,b,C):_.projectionMatrix.copy(b.projectionMatrix),lt(Y,_,ht)};function lt(Y,Q,mt){mt===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(mt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=cs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(_)};let _t=null;function Gt(Y,Q){if(h=Q.getViewerPose(l||o),g=Q,h!==null){const mt=h.views;m!==null&&(t.setRenderTargetFramebuffer(T,m.framebuffer),t.setRenderTarget(T));let ht=!1;mt.length!==_.cameras.length&&(_.cameras.length=0,ht=!0);for(let Tt=0;Tt<mt.length;Tt++){const Ft=mt[Tt];let Jt=null;if(m!==null)Jt=m.getViewport(Ft);else{const P=u.getViewSubImage(d,Ft);Jt=P.viewport,Tt===0&&(t.setRenderTargetTextures(T,P.colorTexture,d.ignoreDepthValues?void 0:P.depthStencilTexture),t.setRenderTarget(T))}let Bt=G[Tt];Bt===void 0&&(Bt=new Ge,Bt.layers.enable(Tt),Bt.viewport=new Zt,G[Tt]=Bt),Bt.matrix.fromArray(Ft.transform.matrix),Bt.matrix.decompose(Bt.position,Bt.quaternion,Bt.scale),Bt.projectionMatrix.fromArray(Ft.projectionMatrix),Bt.projectionMatrixInverse.copy(Bt.projectionMatrix).invert(),Bt.viewport.set(Jt.x,Jt.y,Jt.width,Jt.height),Tt===0&&(_.matrix.copy(Bt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ht===!0&&_.cameras.push(Bt)}const Pt=s.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const Tt=u.getDepthInformation(mt[0]);Tt&&Tt.isValid&&Tt.texture&&M.init(t,Tt,s.renderState)}}for(let mt=0;mt<v.length;mt++){const ht=S[mt],Pt=v[mt];ht!==null&&Pt!==void 0&&Pt.update(ht,Q,l||o)}_t&&_t(Y,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const $t=new th;$t.setAnimationLoop(Gt),this.setAnimationLoop=function(Y){_t=Y},this.dispose=function(){}}}const qn=new We,i_=new qt;function s_(i,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Jl(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,T,v,S){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,S)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),M(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,T,v):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Pe&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Pe&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const T=t.get(f),v=T.envMap,S=T.envMapRotation;v&&(p.envMap.value=v,qn.copy(S),qn.x*=-1,qn.y*=-1,qn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),p.envMapRotation.value.setFromMatrix4(i_.makeRotationFromEuler(qn)),p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,T,v){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*T,p.scale.value=v*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,T){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Pe&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function M(p,f){const T=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function r_(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,v){const S=v.program;n.uniformBlockBinding(T,S)}function l(T,v){let S=s[T.id];S===void 0&&(g(T),S=h(T),s[T.id]=S,T.addEventListener("dispose",p));const L=v.program;n.updateUBOMapping(T,L);const R=t.render.frame;r[T.id]!==R&&(d(T),r[T.id]=R)}function h(T){const v=u();T.__bindingPointIndex=v;const S=i.createBuffer(),L=T.__size,R=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,L,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,S),S}function u(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const v=s[T.id],S=T.uniforms,L=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let R=0,b=S.length;R<b;R++){const C=Array.isArray(S[R])?S[R]:[S[R]];for(let G=0,_=C.length;G<_;G++){const E=C[G];if(m(E,R,G,L)===!0){const z=E.__offset,k=Array.isArray(E.value)?E.value:[E.value];let X=0;for(let j=0;j<k.length;j++){const H=k[j],J=M(H);typeof H=="number"||typeof H=="boolean"?(E.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,z+X,E.__data)):H.isMatrix3?(E.__data[0]=H.elements[0],E.__data[1]=H.elements[1],E.__data[2]=H.elements[2],E.__data[3]=0,E.__data[4]=H.elements[3],E.__data[5]=H.elements[4],E.__data[6]=H.elements[5],E.__data[7]=0,E.__data[8]=H.elements[6],E.__data[9]=H.elements[7],E.__data[10]=H.elements[8],E.__data[11]=0):(H.toArray(E.__data,X),X+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(T,v,S,L){const R=T.value,b=v+"_"+S;if(L[b]===void 0)return typeof R=="number"||typeof R=="boolean"?L[b]=R:L[b]=R.clone(),!0;{const C=L[b];if(typeof R=="number"||typeof R=="boolean"){if(C!==R)return L[b]=R,!0}else if(C.equals(R)===!1)return C.copy(R),!0}return!1}function g(T){const v=T.uniforms;let S=0;const L=16;for(let b=0,C=v.length;b<C;b++){const G=Array.isArray(v[b])?v[b]:[v[b]];for(let _=0,E=G.length;_<E;_++){const z=G[_],k=Array.isArray(z.value)?z.value:[z.value];for(let X=0,j=k.length;X<j;X++){const H=k[X],J=M(H),W=S%L,ct=W%J.boundary,lt=W+ct;S+=ct,lt!==0&&L-lt<J.storage&&(S+=L-lt),z.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=S,S+=J.storage}}}const R=S%L;return R>0&&(S+=L-R),T.__size=S,T.__cache={},this}function M(T){const v={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(v.boundary=4,v.storage=4):T.isVector2?(v.boundary=8,v.storage=8):T.isVector3||T.isColor?(v.boundary=16,v.storage=12):T.isVector4?(v.boundary=16,v.storage=16):T.isMatrix3?(v.boundary=48,v.storage=48):T.isMatrix4?(v.boundary=64,v.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),v}function p(T){const v=T.target;v.removeEventListener("dispose",p);const S=o.indexOf(v.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const T in s)i.deleteBuffer(s[T]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}class o_{constructor(t={}){const{canvas:e=Yu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const m=new Uint32Array(4),g=new Int32Array(4);let M=null,p=null;const f=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=on,this.toneMapping=Dn,this.toneMappingExposure=1;const v=this;let S=!1,L=0,R=0,b=null,C=-1,G=null;const _=new Zt,E=new Zt;let z=null;const k=new Et(0);let X=0,j=e.width,H=e.height,J=1,W=null,ct=null;const lt=new Zt(0,0,j,H),_t=new Zt(0,0,j,H);let Gt=!1;const $t=new Aa;let Y=!1,Q=!1;const mt=new qt,ht=new qt,Pt=new w,Tt=new Zt,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Jt=!1;function Bt(){return b===null?J:1}let P=n;function Fe(y,D){return e.getContext(y,D)}try{const y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${_a}`),e.addEventListener("webglcontextlost",K,!1),e.addEventListener("webglcontextrestored",st,!1),e.addEventListener("webglcontextcreationerror",at,!1),P===null){const D="webgl2";if(P=Fe(D,y),P===null)throw Fe(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Nt,kt,bt,ee,Ct,A,x,N,$,Z,q,vt,it,ut,Ht,tt,dt,At,Rt,ft,Ot,Lt,Qt,I;function ot(){Nt=new um(P),Nt.init(),Lt=new jg(P,Nt),kt=new rm(P,Nt,t,Lt),bt=new qg(P),kt.reverseDepthBuffer&&bt.buffers.depth.setReversed(!0),ee=new pm(P),Ct=new Ig,A=new Kg(P,Nt,bt,Ct,kt,Lt,ee),x=new am(v),N=new hm(v),$=new Md(P),Qt=new im(P,$),Z=new dm(P,$,ee,Qt),q=new gm(P,Z,$,ee),Rt=new mm(P,kt,A),tt=new om(Ct),vt=new Lg(v,x,N,Nt,kt,Qt,tt),it=new s_(v,Ct),ut=new Ug,Ht=new kg(Nt),At=new nm(v,x,N,bt,q,d,c),dt=new Xg(v,q,kt),I=new r_(P,ee,kt,bt),ft=new sm(P,Nt,ee),Ot=new fm(P,Nt,ee),ee.programs=vt.programs,v.capabilities=kt,v.extensions=Nt,v.properties=Ct,v.renderLists=ut,v.shadowMap=dt,v.state=bt,v.info=ee}ot();const V=new n_(v,P);this.xr=V,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const y=Nt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Nt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(y){y!==void 0&&(J=y,this.setSize(j,H,!1))},this.getSize=function(y){return y.set(j,H)},this.setSize=function(y,D,F=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=y,H=D,e.width=Math.floor(y*J),e.height=Math.floor(D*J),F===!0&&(e.style.width=y+"px",e.style.height=D+"px"),this.setViewport(0,0,y,D)},this.getDrawingBufferSize=function(y){return y.set(j*J,H*J).floor()},this.setDrawingBufferSize=function(y,D,F){j=y,H=D,J=F,e.width=Math.floor(y*F),e.height=Math.floor(D*F),this.setViewport(0,0,y,D)},this.getCurrentViewport=function(y){return y.copy(_)},this.getViewport=function(y){return y.copy(lt)},this.setViewport=function(y,D,F,B){y.isVector4?lt.set(y.x,y.y,y.z,y.w):lt.set(y,D,F,B),bt.viewport(_.copy(lt).multiplyScalar(J).round())},this.getScissor=function(y){return y.copy(_t)},this.setScissor=function(y,D,F,B){y.isVector4?_t.set(y.x,y.y,y.z,y.w):_t.set(y,D,F,B),bt.scissor(E.copy(_t).multiplyScalar(J).round())},this.getScissorTest=function(){return Gt},this.setScissorTest=function(y){bt.setScissorTest(Gt=y)},this.setOpaqueSort=function(y){W=y},this.setTransparentSort=function(y){ct=y},this.getClearColor=function(y){return y.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor.apply(At,arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha.apply(At,arguments)},this.clear=function(y=!0,D=!0,F=!0){let B=0;if(y){let U=!1;if(b!==null){const et=b.texture.format;U=et===Ea||et===ya||et===Sa}if(U){const et=b.texture.type,rt=et===vn||et===ri||et===as||et===zi||et===xa||et===Ma,pt=At.getClearColor(),gt=At.getClearAlpha(),yt=pt.r,wt=pt.g,xt=pt.b;rt?(m[0]=yt,m[1]=wt,m[2]=xt,m[3]=gt,P.clearBufferuiv(P.COLOR,0,m)):(g[0]=yt,g[1]=wt,g[2]=xt,g[3]=gt,P.clearBufferiv(P.COLOR,0,g))}else B|=P.COLOR_BUFFER_BIT}D&&(B|=P.DEPTH_BUFFER_BIT,P.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),F&&(B|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",K,!1),e.removeEventListener("webglcontextrestored",st,!1),e.removeEventListener("webglcontextcreationerror",at,!1),ut.dispose(),Ht.dispose(),Ct.dispose(),x.dispose(),N.dispose(),q.dispose(),Qt.dispose(),I.dispose(),vt.dispose(),V.dispose(),V.removeEventListener("sessionstart",Ha),V.removeEventListener("sessionend",Ga),Hn.stop()};function K(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function st(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const y=ee.autoReset,D=dt.enabled,F=dt.autoUpdate,B=dt.needsUpdate,U=dt.type;ot(),ee.autoReset=y,dt.enabled=D,dt.autoUpdate=F,dt.needsUpdate=B,dt.type=U}function at(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function zt(y){const D=y.target;D.removeEventListener("dispose",zt),le(D)}function le(y){De(y),Ct.remove(y)}function De(y){const D=Ct.get(y).programs;D!==void 0&&(D.forEach(function(F){vt.releaseProgram(F)}),y.isShaderMaterial&&vt.releaseShaderCache(y))}this.renderBufferDirect=function(y,D,F,B,U,et){D===null&&(D=Ft);const rt=U.isMesh&&U.matrixWorld.determinant()<0,pt=Bh(y,D,F,B,U);bt.setMaterial(B,rt);let gt=F.index,yt=1;if(B.wireframe===!0){if(gt=Z.getWireframeAttribute(F),gt===void 0)return;yt=2}const wt=F.drawRange,xt=F.attributes.position;let Kt=wt.start*yt,ne=(wt.start+wt.count)*yt;et!==null&&(Kt=Math.max(Kt,et.start*yt),ne=Math.min(ne,(et.start+et.count)*yt)),gt!==null?(Kt=Math.max(Kt,0),ne=Math.min(ne,gt.count)):xt!=null&&(Kt=Math.max(Kt,0),ne=Math.min(ne,xt.count));const oe=ne-Kt;if(oe<0||oe===1/0)return;Qt.setup(U,B,pt,F,gt);let Be,Wt=ft;if(gt!==null&&(Be=$.get(gt),Wt=Ot,Wt.setIndex(Be)),U.isMesh)B.wireframe===!0?(bt.setLineWidth(B.wireframeLinewidth*Bt()),Wt.setMode(P.LINES)):Wt.setMode(P.TRIANGLES);else if(U.isLine){let St=B.linewidth;St===void 0&&(St=1),bt.setLineWidth(St*Bt()),U.isLineSegments?Wt.setMode(P.LINES):U.isLineLoop?Wt.setMode(P.LINE_LOOP):Wt.setMode(P.LINE_STRIP)}else U.isPoints?Wt.setMode(P.POINTS):U.isSprite&&Wt.setMode(P.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Wt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Nt.get("WEBGL_multi_draw"))Wt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const St=U._multiDrawStarts,Me=U._multiDrawCounts,Xt=U._multiDrawCount,Je=gt?$.get(gt).bytesPerElement:1,di=Ct.get(B).currentProgram.getUniforms();for(let ze=0;ze<Xt;ze++)di.setValue(P,"_gl_DrawID",ze),Wt.render(St[ze]/Je,Me[ze])}else if(U.isInstancedMesh)Wt.renderInstances(Kt,oe,U.count);else if(F.isInstancedBufferGeometry){const St=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,Me=Math.min(F.instanceCount,St);Wt.renderInstances(Kt,oe,Me)}else Wt.render(Kt,oe)};function Vt(y,D,F){y.transparent===!0&&y.side===qe&&y.forceSinglePass===!1?(y.side=Pe,y.needsUpdate=!0,vs(y,D,F),y.side=Nn,y.needsUpdate=!0,vs(y,D,F),y.side=qe):vs(y,D,F)}this.compile=function(y,D,F=null){F===null&&(F=y),p=Ht.get(F),p.init(D),T.push(p),F.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),y!==F&&y.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const B=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const et=U.material;if(et)if(Array.isArray(et))for(let rt=0;rt<et.length;rt++){const pt=et[rt];Vt(pt,F,U),B.add(pt)}else Vt(et,F,U),B.add(et)}),T.pop(),p=null,B},this.compileAsync=function(y,D,F=null){const B=this.compile(y,D,F);return new Promise(U=>{function et(){if(B.forEach(function(rt){Ct.get(rt).currentProgram.isReady()&&B.delete(rt)}),B.size===0){U(y);return}setTimeout(et,10)}Nt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Ue=null;function ln(y){Ue&&Ue(y)}function Ha(){Hn.stop()}function Ga(){Hn.start()}const Hn=new th;Hn.setAnimationLoop(ln),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(y){Ue=y,V.setAnimationLoop(y),y===null?Hn.stop():Hn.start()},V.addEventListener("sessionstart",Ha),V.addEventListener("sessionend",Ga),this.render=function(y,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(D),D=V.getCamera()),y.isScene===!0&&y.onBeforeRender(v,y,D,b),p=Ht.get(y,T.length),p.init(D),T.push(p),ht.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),$t.setFromProjectionMatrix(ht),Q=this.localClippingEnabled,Y=tt.init(this.clippingPlanes,Q),M=ut.get(y,f.length),M.init(),f.push(M),V.enabled===!0&&V.isPresenting===!0){const et=v.xr.getDepthSensingMesh();et!==null&&Dr(et,D,-1/0,v.sortObjects)}Dr(y,D,0,v.sortObjects),M.finish(),v.sortObjects===!0&&M.sort(W,ct),Jt=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,Jt&&At.addToRenderList(M,y),this.info.render.frame++,Y===!0&&tt.beginShadows();const F=p.state.shadowsArray;dt.render(F,y,D),Y===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=M.opaque,U=M.transmissive;if(p.setupLights(),D.isArrayCamera){const et=D.cameras;if(U.length>0)for(let rt=0,pt=et.length;rt<pt;rt++){const gt=et[rt];Wa(B,U,y,gt)}Jt&&At.render(y);for(let rt=0,pt=et.length;rt<pt;rt++){const gt=et[rt];Va(M,y,gt,gt.viewport)}}else U.length>0&&Wa(B,U,y,D),Jt&&At.render(y),Va(M,y,D);b!==null&&(A.updateMultisampleRenderTarget(b),A.updateRenderTargetMipmap(b)),y.isScene===!0&&y.onAfterRender(v,y,D),Qt.resetDefaultState(),C=-1,G=null,T.pop(),T.length>0?(p=T[T.length-1],Y===!0&&tt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,f.pop(),f.length>0?M=f[f.length-1]:M=null};function Dr(y,D,F,B){if(y.visible===!1)return;if(y.layers.test(D.layers)){if(y.isGroup)F=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(D);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||$t.intersectsSprite(y)){B&&Tt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ht);const rt=q.update(y),pt=y.material;pt.visible&&M.push(y,rt,pt,F,Tt.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||$t.intersectsObject(y))){const rt=q.update(y),pt=y.material;if(B&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Tt.copy(y.boundingSphere.center)):(rt.boundingSphere===null&&rt.computeBoundingSphere(),Tt.copy(rt.boundingSphere.center)),Tt.applyMatrix4(y.matrixWorld).applyMatrix4(ht)),Array.isArray(pt)){const gt=rt.groups;for(let yt=0,wt=gt.length;yt<wt;yt++){const xt=gt[yt],Kt=pt[xt.materialIndex];Kt&&Kt.visible&&M.push(y,rt,Kt,F,Tt.z,xt)}}else pt.visible&&M.push(y,rt,pt,F,Tt.z,null)}}const et=y.children;for(let rt=0,pt=et.length;rt<pt;rt++)Dr(et[rt],D,F,B)}function Va(y,D,F,B){const U=y.opaque,et=y.transmissive,rt=y.transparent;p.setupLightsView(F),Y===!0&&tt.setGlobalState(v.clippingPlanes,F),B&&bt.viewport(_.copy(B)),U.length>0&&_s(U,D,F),et.length>0&&_s(et,D,F),rt.length>0&&_s(rt,D,F),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function Wa(y,D,F,B){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new oi(1,1,{generateMipmaps:!0,type:Nt.has("EXT_color_buffer_half_float")||Nt.has("EXT_color_buffer_float")?ds:vn,minFilter:ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const et=p.state.transmissionRenderTarget[B.id],rt=B.viewport||_;et.setSize(rt.z,rt.w);const pt=v.getRenderTarget();v.setRenderTarget(et),v.getClearColor(k),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),Jt&&At.render(F);const gt=v.toneMapping;v.toneMapping=Dn;const yt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),Y===!0&&tt.setGlobalState(v.clippingPlanes,B),_s(y,F,B),A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et),Nt.has("WEBGL_multisampled_render_to_texture")===!1){let wt=!1;for(let xt=0,Kt=D.length;xt<Kt;xt++){const ne=D[xt],oe=ne.object,Be=ne.geometry,Wt=ne.material,St=ne.group;if(Wt.side===qe&&oe.layers.test(B.layers)){const Me=Wt.side;Wt.side=Pe,Wt.needsUpdate=!0,Xa(oe,F,B,Be,Wt,St),Wt.side=Me,Wt.needsUpdate=!0,wt=!0}}wt===!0&&(A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et))}v.setRenderTarget(pt),v.setClearColor(k,X),yt!==void 0&&(B.viewport=yt),v.toneMapping=gt}function _s(y,D,F){const B=D.isScene===!0?D.overrideMaterial:null;for(let U=0,et=y.length;U<et;U++){const rt=y[U],pt=rt.object,gt=rt.geometry,yt=B===null?rt.material:B,wt=rt.group;pt.layers.test(F.layers)&&Xa(pt,D,F,gt,yt,wt)}}function Xa(y,D,F,B,U,et){y.onBeforeRender(v,D,F,B,U,et),y.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(v,D,F,B,y,et),U.transparent===!0&&U.side===qe&&U.forceSinglePass===!1?(U.side=Pe,U.needsUpdate=!0,v.renderBufferDirect(F,D,B,U,y,et),U.side=Nn,U.needsUpdate=!0,v.renderBufferDirect(F,D,B,U,y,et),U.side=qe):v.renderBufferDirect(F,D,B,U,y,et),y.onAfterRender(v,D,F,B,U,et)}function vs(y,D,F){D.isScene!==!0&&(D=Ft);const B=Ct.get(y),U=p.state.lights,et=p.state.shadowsArray,rt=U.state.version,pt=vt.getParameters(y,U.state,et,D,F),gt=vt.getProgramCacheKey(pt);let yt=B.programs;B.environment=y.isMeshStandardMaterial?D.environment:null,B.fog=D.fog,B.envMap=(y.isMeshStandardMaterial?N:x).get(y.envMap||B.environment),B.envMapRotation=B.environment!==null&&y.envMap===null?D.environmentRotation:y.envMapRotation,yt===void 0&&(y.addEventListener("dispose",zt),yt=new Map,B.programs=yt);let wt=yt.get(gt);if(wt!==void 0){if(B.currentProgram===wt&&B.lightsStateVersion===rt)return qa(y,pt),wt}else pt.uniforms=vt.getUniforms(y),y.onBeforeCompile(pt,v),wt=vt.acquireProgram(pt,gt),yt.set(gt,wt),B.uniforms=pt.uniforms;const xt=B.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(xt.clippingPlanes=tt.uniform),qa(y,pt),B.needsLights=kh(y),B.lightsStateVersion=rt,B.needsLights&&(xt.ambientLightColor.value=U.state.ambient,xt.lightProbe.value=U.state.probe,xt.directionalLights.value=U.state.directional,xt.directionalLightShadows.value=U.state.directionalShadow,xt.spotLights.value=U.state.spot,xt.spotLightShadows.value=U.state.spotShadow,xt.rectAreaLights.value=U.state.rectArea,xt.ltc_1.value=U.state.rectAreaLTC1,xt.ltc_2.value=U.state.rectAreaLTC2,xt.pointLights.value=U.state.point,xt.pointLightShadows.value=U.state.pointShadow,xt.hemisphereLights.value=U.state.hemi,xt.directionalShadowMap.value=U.state.directionalShadowMap,xt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,xt.spotShadowMap.value=U.state.spotShadowMap,xt.spotLightMatrix.value=U.state.spotLightMatrix,xt.spotLightMap.value=U.state.spotLightMap,xt.pointShadowMap.value=U.state.pointShadowMap,xt.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=wt,B.uniformsList=null,wt}function Ya(y){if(y.uniformsList===null){const D=y.currentProgram.getUniforms();y.uniformsList=ur.seqWithValue(D.seq,y.uniforms)}return y.uniformsList}function qa(y,D){const F=Ct.get(y);F.outputColorSpace=D.outputColorSpace,F.batching=D.batching,F.batchingColor=D.batchingColor,F.instancing=D.instancing,F.instancingColor=D.instancingColor,F.instancingMorph=D.instancingMorph,F.skinning=D.skinning,F.morphTargets=D.morphTargets,F.morphNormals=D.morphNormals,F.morphColors=D.morphColors,F.morphTargetsCount=D.morphTargetsCount,F.numClippingPlanes=D.numClippingPlanes,F.numIntersection=D.numClipIntersection,F.vertexAlphas=D.vertexAlphas,F.vertexTangents=D.vertexTangents,F.toneMapping=D.toneMapping}function Bh(y,D,F,B,U){D.isScene!==!0&&(D=Ft),A.resetTextureUnits();const et=D.fog,rt=B.isMeshStandardMaterial?D.environment:null,pt=b===null?v.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Bn,gt=(B.isMeshStandardMaterial?N:x).get(B.envMap||rt),yt=B.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,wt=!!F.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),xt=!!F.morphAttributes.position,Kt=!!F.morphAttributes.normal,ne=!!F.morphAttributes.color;let oe=Dn;B.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(oe=v.toneMapping);const Be=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Wt=Be!==void 0?Be.length:0,St=Ct.get(B),Me=p.state.lights;if(Y===!0&&(Q===!0||y!==G)){const Xe=y===G&&B.id===C;tt.setState(B,y,Xe)}let Xt=!1;B.version===St.__version?(St.needsLights&&St.lightsStateVersion!==Me.state.version||St.outputColorSpace!==pt||U.isBatchedMesh&&St.batching===!1||!U.isBatchedMesh&&St.batching===!0||U.isBatchedMesh&&St.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&St.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&St.instancing===!1||!U.isInstancedMesh&&St.instancing===!0||U.isSkinnedMesh&&St.skinning===!1||!U.isSkinnedMesh&&St.skinning===!0||U.isInstancedMesh&&St.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&St.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&St.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&St.instancingMorph===!1&&U.morphTexture!==null||St.envMap!==gt||B.fog===!0&&St.fog!==et||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==tt.numPlanes||St.numIntersection!==tt.numIntersection)||St.vertexAlphas!==yt||St.vertexTangents!==wt||St.morphTargets!==xt||St.morphNormals!==Kt||St.morphColors!==ne||St.toneMapping!==oe||St.morphTargetsCount!==Wt)&&(Xt=!0):(Xt=!0,St.__version=B.version);let Je=St.currentProgram;Xt===!0&&(Je=vs(B,D,U));let di=!1,ze=!1,Ur=!1;const ce=Je.getUniforms(),En=St.uniforms;if(bt.useProgram(Je.program)&&(di=!0,ze=!0,Ur=!0),B.id!==C&&(C=B.id,ze=!0),di||G!==y){kt.reverseDepthBuffer?(mt.copy(y.projectionMatrix),$u(mt),Ku(mt),ce.setValue(P,"projectionMatrix",mt)):ce.setValue(P,"projectionMatrix",y.projectionMatrix),ce.setValue(P,"viewMatrix",y.matrixWorldInverse);const Xe=ce.map.cameraPosition;Xe!==void 0&&Xe.setValue(P,Pt.setFromMatrixPosition(y.matrixWorld)),kt.logarithmicDepthBuffer&&ce.setValue(P,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&ce.setValue(P,"isOrthographic",y.isOrthographicCamera===!0),G!==y&&(G=y,ze=!0,Ur=!0)}if(U.isSkinnedMesh){ce.setOptional(P,U,"bindMatrix"),ce.setOptional(P,U,"bindMatrixInverse");const Xe=U.skeleton;Xe&&(Xe.boneTexture===null&&Xe.computeBoneTexture(),ce.setValue(P,"boneTexture",Xe.boneTexture,A))}U.isBatchedMesh&&(ce.setOptional(P,U,"batchingTexture"),ce.setValue(P,"batchingTexture",U._matricesTexture,A),ce.setOptional(P,U,"batchingIdTexture"),ce.setValue(P,"batchingIdTexture",U._indirectTexture,A),ce.setOptional(P,U,"batchingColorTexture"),U._colorsTexture!==null&&ce.setValue(P,"batchingColorTexture",U._colorsTexture,A));const Nr=F.morphAttributes;if((Nr.position!==void 0||Nr.normal!==void 0||Nr.color!==void 0)&&Rt.update(U,F,Je),(ze||St.receiveShadow!==U.receiveShadow)&&(St.receiveShadow=U.receiveShadow,ce.setValue(P,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(En.envMap.value=gt,En.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&D.environment!==null&&(En.envMapIntensity.value=D.environmentIntensity),ze&&(ce.setValue(P,"toneMappingExposure",v.toneMappingExposure),St.needsLights&&zh(En,Ur),et&&B.fog===!0&&it.refreshFogUniforms(En,et),it.refreshMaterialUniforms(En,B,J,H,p.state.transmissionRenderTarget[y.id]),ur.upload(P,Ya(St),En,A)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(ur.upload(P,Ya(St),En,A),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&ce.setValue(P,"center",U.center),ce.setValue(P,"modelViewMatrix",U.modelViewMatrix),ce.setValue(P,"normalMatrix",U.normalMatrix),ce.setValue(P,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Xe=B.uniformsGroups;for(let Or=0,Hh=Xe.length;Or<Hh;Or++){const $a=Xe[Or];I.update($a,Je),I.bind($a,Je)}}return Je}function zh(y,D){y.ambientLightColor.needsUpdate=D,y.lightProbe.needsUpdate=D,y.directionalLights.needsUpdate=D,y.directionalLightShadows.needsUpdate=D,y.pointLights.needsUpdate=D,y.pointLightShadows.needsUpdate=D,y.spotLights.needsUpdate=D,y.spotLightShadows.needsUpdate=D,y.rectAreaLights.needsUpdate=D,y.hemisphereLights.needsUpdate=D}function kh(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(y,D,F){Ct.get(y.texture).__webglTexture=D,Ct.get(y.depthTexture).__webglTexture=F;const B=Ct.get(y);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=F===void 0,B.__autoAllocateDepthBuffer||Nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,D){const F=Ct.get(y);F.__webglFramebuffer=D,F.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(y,D=0,F=0){b=y,L=D,R=F;let B=!0,U=null,et=!1,rt=!1;if(y){const gt=Ct.get(y);if(gt.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(P.FRAMEBUFFER,null),B=!1;else if(gt.__webglFramebuffer===void 0)A.setupRenderTarget(y);else if(gt.__hasExternalTextures)A.rebindTextures(y,Ct.get(y.texture).__webglTexture,Ct.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const xt=y.depthTexture;if(gt.__boundDepthTexture!==xt){if(xt!==null&&Ct.has(xt)&&(y.width!==xt.image.width||y.height!==xt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(y)}}const yt=y.texture;(yt.isData3DTexture||yt.isDataArrayTexture||yt.isCompressedArrayTexture)&&(rt=!0);const wt=Ct.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(wt[D])?U=wt[D][F]:U=wt[D],et=!0):y.samples>0&&A.useMultisampledRTT(y)===!1?U=Ct.get(y).__webglMultisampledFramebuffer:Array.isArray(wt)?U=wt[F]:U=wt,_.copy(y.viewport),E.copy(y.scissor),z=y.scissorTest}else _.copy(lt).multiplyScalar(J).floor(),E.copy(_t).multiplyScalar(J).floor(),z=Gt;if(bt.bindFramebuffer(P.FRAMEBUFFER,U)&&B&&bt.drawBuffers(y,U),bt.viewport(_),bt.scissor(E),bt.setScissorTest(z),et){const gt=Ct.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+D,gt.__webglTexture,F)}else if(rt){const gt=Ct.get(y.texture),yt=D||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,gt.__webglTexture,F||0,yt)}C=-1},this.readRenderTargetPixels=function(y,D,F,B,U,et,rt){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=Ct.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&rt!==void 0&&(pt=pt[rt]),pt){bt.bindFramebuffer(P.FRAMEBUFFER,pt);try{const gt=y.texture,yt=gt.format,wt=gt.type;if(!kt.textureFormatReadable(yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!kt.textureTypeReadable(wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=y.width-B&&F>=0&&F<=y.height-U&&P.readPixels(D,F,B,U,Lt.convert(yt),Lt.convert(wt),et)}finally{const gt=b!==null?Ct.get(b).__webglFramebuffer:null;bt.bindFramebuffer(P.FRAMEBUFFER,gt)}}},this.readRenderTargetPixelsAsync=async function(y,D,F,B,U,et,rt){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=Ct.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&rt!==void 0&&(pt=pt[rt]),pt){const gt=y.texture,yt=gt.format,wt=gt.type;if(!kt.textureFormatReadable(yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!kt.textureTypeReadable(wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=y.width-B&&F>=0&&F<=y.height-U){bt.bindFramebuffer(P.FRAMEBUFFER,pt);const xt=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,xt),P.bufferData(P.PIXEL_PACK_BUFFER,et.byteLength,P.STREAM_READ),P.readPixels(D,F,B,U,Lt.convert(yt),Lt.convert(wt),0);const Kt=b!==null?Ct.get(b).__webglFramebuffer:null;bt.bindFramebuffer(P.FRAMEBUFFER,Kt);const ne=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await qu(P,ne,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,xt),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,et),P.deleteBuffer(xt),P.deleteSync(ne),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,D=null,F=0){y.isTexture!==!0&&(hr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,y=arguments[1]);const B=Math.pow(2,-F),U=Math.floor(y.image.width*B),et=Math.floor(y.image.height*B),rt=D!==null?D.x:0,pt=D!==null?D.y:0;A.setTexture2D(y,0),P.copyTexSubImage2D(P.TEXTURE_2D,F,0,0,rt,pt,U,et),bt.unbindTexture()},this.copyTextureToTexture=function(y,D,F=null,B=null,U=0){y.isTexture!==!0&&(hr("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,y=arguments[1],D=arguments[2],U=arguments[3]||0,F=null);let et,rt,pt,gt,yt,wt;F!==null?(et=F.max.x-F.min.x,rt=F.max.y-F.min.y,pt=F.min.x,gt=F.min.y):(et=y.image.width,rt=y.image.height,pt=0,gt=0),B!==null?(yt=B.x,wt=B.y):(yt=0,wt=0);const xt=Lt.convert(D.format),Kt=Lt.convert(D.type);A.setTexture2D(D,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);const ne=P.getParameter(P.UNPACK_ROW_LENGTH),oe=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Be=P.getParameter(P.UNPACK_SKIP_PIXELS),Wt=P.getParameter(P.UNPACK_SKIP_ROWS),St=P.getParameter(P.UNPACK_SKIP_IMAGES),Me=y.isCompressedTexture?y.mipmaps[U]:y.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Me.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Me.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,pt),P.pixelStorei(P.UNPACK_SKIP_ROWS,gt),y.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,U,yt,wt,et,rt,xt,Kt,Me.data):y.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,U,yt,wt,Me.width,Me.height,xt,Me.data):P.texSubImage2D(P.TEXTURE_2D,U,yt,wt,et,rt,xt,Kt,Me),P.pixelStorei(P.UNPACK_ROW_LENGTH,ne),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,oe),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Be),P.pixelStorei(P.UNPACK_SKIP_ROWS,Wt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,St),U===0&&D.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),bt.unbindTexture()},this.copyTextureToTexture3D=function(y,D,F=null,B=null,U=0){y.isTexture!==!0&&(hr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),F=arguments[0]||null,B=arguments[1]||null,y=arguments[2],D=arguments[3],U=arguments[4]||0);let et,rt,pt,gt,yt,wt,xt,Kt,ne;const oe=y.isCompressedTexture?y.mipmaps[U]:y.image;F!==null?(et=F.max.x-F.min.x,rt=F.max.y-F.min.y,pt=F.max.z-F.min.z,gt=F.min.x,yt=F.min.y,wt=F.min.z):(et=oe.width,rt=oe.height,pt=oe.depth,gt=0,yt=0,wt=0),B!==null?(xt=B.x,Kt=B.y,ne=B.z):(xt=0,Kt=0,ne=0);const Be=Lt.convert(D.format),Wt=Lt.convert(D.type);let St;if(D.isData3DTexture)A.setTexture3D(D,0),St=P.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)A.setTexture2DArray(D,0),St=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);const Me=P.getParameter(P.UNPACK_ROW_LENGTH),Xt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Je=P.getParameter(P.UNPACK_SKIP_PIXELS),di=P.getParameter(P.UNPACK_SKIP_ROWS),ze=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,oe.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,oe.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,gt),P.pixelStorei(P.UNPACK_SKIP_ROWS,yt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,wt),y.isDataTexture||y.isData3DTexture?P.texSubImage3D(St,U,xt,Kt,ne,et,rt,pt,Be,Wt,oe.data):D.isCompressedArrayTexture?P.compressedTexSubImage3D(St,U,xt,Kt,ne,et,rt,pt,Be,oe.data):P.texSubImage3D(St,U,xt,Kt,ne,et,rt,pt,Be,Wt,oe),P.pixelStorei(P.UNPACK_ROW_LENGTH,Me),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Xt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Je),P.pixelStorei(P.UNPACK_SKIP_ROWS,di),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ze),U===0&&D.generateMipmaps&&P.generateMipmap(St),bt.unbindTexture()},this.initRenderTarget=function(y){Ct.get(y).__webglFramebuffer===void 0&&A.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?A.setTextureCube(y,0):y.isData3DTexture?A.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?A.setTexture2DArray(y,0):A.setTexture2D(y,0),bt.unbindTexture()},this.resetState=function(){L=0,R=0,b=null,bt.reset(),Qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ta?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===Rr?"display-p3":"srgb"}}class Ca{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Et(t),this.density=e}clone(){return new Ca(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class a_ extends pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new We,this.environmentIntensity=1,this.environmentRotation=new We,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Pa extends hi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const vr=new w,xr=new w,Vc=new qt,Ji=new Cr,ks=new ps,fo=new w,Wc=new w;class c_ extends pe{constructor(t=new _e,e=new Pa){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)vr.fromBufferAttribute(e,s-1),xr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=vr.distanceTo(xr);t.setAttribute("lineDistance",new te(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(s),ks.radius+=r,t.ray.intersectsSphere(ks)===!1)return;Vc.copy(s).invert(),Ji.copy(t.ray).applyMatrix4(Vc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const m=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let M=m,p=g-1;M<p;M+=l){const f=h.getX(M),T=h.getX(M+1),v=Hs(this,t,Ji,c,f,T);v&&e.push(v)}if(this.isLineLoop){const M=h.getX(g-1),p=h.getX(m),f=Hs(this,t,Ji,c,M,p);f&&e.push(f)}}else{const m=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let M=m,p=g-1;M<p;M+=l){const f=Hs(this,t,Ji,c,M,M+1);f&&e.push(f)}if(this.isLineLoop){const M=Hs(this,t,Ji,c,g-1,m);M&&e.push(M)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Hs(i,t,e,n,s,r){const o=i.geometry.attributes.position;if(vr.fromBufferAttribute(o,s),xr.fromBufferAttribute(o,r),e.distanceSqToSegment(vr,xr,fo,Wc)>n)return;fo.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(fo);if(!(c<t.near||c>t.far))return{distance:c,point:Wc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Xc=new w,Yc=new w;class ah extends c_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Xc.fromBufferAttribute(e,s),Yc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Xc.distanceTo(Yc);t.setAttribute("lineDistance",new te(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class La extends hi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const qc=new qt,fa=new Cr,Gs=new ps,Vs=new w;class ch extends pe{constructor(t=new _e,e=new La){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Gs.copy(n.boundingSphere),Gs.applyMatrix4(s),Gs.radius+=r,t.ray.intersectsSphere(Gs)===!1)return;qc.copy(s).invert(),fa.copy(t.ray).applyMatrix4(qc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let g=d,M=m;g<M;g++){const p=l.getX(g);Vs.fromBufferAttribute(u,p),$c(Vs,p,c,s,t,e,this)}}else{const d=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let g=d,M=m;g<M;g++)Vs.fromBufferAttribute(u,g),$c(Vs,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function $c(i,t,e,n,s,r,o){const a=fa.distanceSqToPoint(i);if(a<e){const c=new w;fa.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Sn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,m=(o-h)/d;return(s+m)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new Mt:new w);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new w,s=[],r=[],o=[],a=new w,c=new qt;for(let m=0;m<=t;m++){const g=m/t;s[m]=this.getTangentAt(g,new w)}r[0]=new w,o[0]=new w;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=t;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(s[m-1],s[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Se(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(a,g))}o[m].crossVectors(s[m],r[m])}if(e===!0){let m=Math.acos(Se(r[0].dot(r[t]),-1,1));m/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(m=-m);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class lh extends Sn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new Mt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,m=l-this.aY;c=d*h-m*u+this.aX,l=d*u+m*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class l_ extends lh{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Ia(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,m=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,m*=h,s(o,a,d,m)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Ws=new w,po=new Ia,mo=new Ia,go=new Ia;class hh extends Sn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new w){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Ws.subVectors(s[0],s[1]).add(s[0]),l=Ws);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ws.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ws),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),M=Math.pow(u.distanceToSquared(d),m),p=Math.pow(d.distanceToSquared(h),m);M<1e-4&&(M=1),g<1e-4&&(g=M),p<1e-4&&(p=M),po.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,M,p),mo.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,M,p),go.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,M,p)}else this.curveType==="catmullrom"&&(po.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),mo.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),go.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(po.calc(c),mo.calc(c),go.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new w().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Kc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function h_(i,t){const e=1-i;return e*e*t}function u_(i,t){return 2*(1-i)*i*t}function d_(i,t){return i*i*t}function is(i,t,e,n){return h_(i,t)+u_(i,e)+d_(i,n)}function f_(i,t){const e=1-i;return e*e*e*t}function p_(i,t){const e=1-i;return 3*e*e*i*t}function m_(i,t){return 3*(1-i)*i*i*t}function g_(i,t){return i*i*i*t}function ss(i,t,e,n,s){return f_(i,t)+p_(i,e)+m_(i,n)+g_(i,s)}class __ extends Sn{constructor(t=new Mt,e=new Mt,n=new Mt,s=new Mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new Mt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ss(t,s.x,r.x,o.x,a.x),ss(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class v_ extends Sn{constructor(t=new w,e=new w,n=new w,s=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new w){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ss(t,s.x,r.x,o.x,a.x),ss(t,s.y,r.y,o.y,a.y),ss(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class x_ extends Sn{constructor(t=new Mt,e=new Mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class M_ extends Sn{constructor(t=new w,e=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new w){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new w){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class S_ extends Sn{constructor(t=new Mt,e=new Mt,n=new Mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Mt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(is(t,s.x,r.x,o.x),is(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class uh extends Sn{constructor(t=new w,e=new w,n=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new w){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(is(t,s.x,r.x,o.x),is(t,s.y,r.y,o.y),is(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class y_ extends Sn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Mt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Kc(a,c.x,l.x,h.x,u.x),Kc(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new Mt().fromArray(s))}return this}}var E_=Object.freeze({__proto__:null,ArcCurve:l_,CatmullRomCurve3:hh,CubicBezierCurve:__,CubicBezierCurve3:v_,EllipseCurve:lh,LineCurve:x_,LineCurve3:M_,QuadraticBezierCurve:S_,QuadraticBezierCurve3:uh,SplineCurve:y_});class ai extends _e{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],m=[];let g=0;const M=[],p=n/2;let f=0;T(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(d,3)),this.setAttribute("uv",new te(m,2));function T(){const S=new w,L=new w;let R=0;const b=(e-t)/n;for(let C=0;C<=r;C++){const G=[],_=C/r,E=_*(e-t)+t;for(let z=0;z<=s;z++){const k=z/s,X=k*c+a,j=Math.sin(X),H=Math.cos(X);L.x=E*j,L.y=-_*n+p,L.z=E*H,u.push(L.x,L.y,L.z),S.set(j,b,H).normalize(),d.push(S.x,S.y,S.z),m.push(k,1-_),G.push(g++)}M.push(G)}for(let C=0;C<s;C++)for(let G=0;G<r;G++){const _=M[G][C],E=M[G+1][C],z=M[G+1][C+1],k=M[G][C+1];t>0&&(h.push(_,E,k),R+=3),e>0&&(h.push(E,z,k),R+=3)}l.addGroup(f,R,0),f+=R}function v(S){const L=g,R=new Mt,b=new w;let C=0;const G=S===!0?t:e,_=S===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,p*_,0),d.push(0,_,0),m.push(.5,.5),g++;const E=g;for(let z=0;z<=s;z++){const X=z/s*c+a,j=Math.cos(X),H=Math.sin(X);b.x=G*H,b.y=p*_,b.z=G*j,u.push(b.x,b.y,b.z),d.push(0,_,0),R.x=j*.5+.5,R.y=H*.5*_+.5,m.push(R.x,R.y),g++}for(let z=0;z<s;z++){const k=L+z,X=E+z;S===!0?h.push(X,X+1,k):h.push(X+1,X,k),C+=3}l.addGroup(f,C,S===!0?1:2),f+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ai(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Lr extends ai{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Lr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xi extends _e{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new te(r,3)),this.setAttribute("normal",new te(r.slice(),3)),this.setAttribute("uv",new te(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(T){const v=new w,S=new w,L=new w;for(let R=0;R<e.length;R+=3)m(e[R+0],v),m(e[R+1],S),m(e[R+2],L),c(v,S,L,T)}function c(T,v,S,L){const R=L+1,b=[];for(let C=0;C<=R;C++){b[C]=[];const G=T.clone().lerp(S,C/R),_=v.clone().lerp(S,C/R),E=R-C;for(let z=0;z<=E;z++)z===0&&C===R?b[C][z]=G:b[C][z]=G.clone().lerp(_,z/E)}for(let C=0;C<R;C++)for(let G=0;G<2*(R-C)-1;G++){const _=Math.floor(G/2);G%2===0?(d(b[C][_+1]),d(b[C+1][_]),d(b[C][_])):(d(b[C][_+1]),d(b[C+1][_+1]),d(b[C+1][_]))}}function l(T){const v=new w;for(let S=0;S<r.length;S+=3)v.x=r[S+0],v.y=r[S+1],v.z=r[S+2],v.normalize().multiplyScalar(T),r[S+0]=v.x,r[S+1]=v.y,r[S+2]=v.z}function h(){const T=new w;for(let v=0;v<r.length;v+=3){T.x=r[v+0],T.y=r[v+1],T.z=r[v+2];const S=p(T)/2/Math.PI+.5,L=f(T)/Math.PI+.5;o.push(S,1-L)}g(),u()}function u(){for(let T=0;T<o.length;T+=6){const v=o[T+0],S=o[T+2],L=o[T+4],R=Math.max(v,S,L),b=Math.min(v,S,L);R>.9&&b<.1&&(v<.2&&(o[T+0]+=1),S<.2&&(o[T+2]+=1),L<.2&&(o[T+4]+=1))}}function d(T){r.push(T.x,T.y,T.z)}function m(T,v){const S=T*3;v.x=t[S+0],v.y=t[S+1],v.z=t[S+2]}function g(){const T=new w,v=new w,S=new w,L=new w,R=new Mt,b=new Mt,C=new Mt;for(let G=0,_=0;G<r.length;G+=9,_+=6){T.set(r[G+0],r[G+1],r[G+2]),v.set(r[G+3],r[G+4],r[G+5]),S.set(r[G+6],r[G+7],r[G+8]),R.set(o[_+0],o[_+1]),b.set(o[_+2],o[_+3]),C.set(o[_+4],o[_+5]),L.copy(T).add(v).add(S).divideScalar(3);const E=p(L);M(R,_+0,T,E),M(b,_+2,v,E),M(C,_+4,S,E)}}function M(T,v,S,L){L<0&&T.x===1&&(o[v]=T.x-1),S.x===0&&S.z===0&&(o[v]=L/2/Math.PI+.5)}function p(T){return Math.atan2(T.z,-T.x)}function f(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.vertices,t.indices,t.radius,t.details)}}class Da extends Xi{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Da(t.radius,t.detail)}}const Xs=new w,Ys=new w,_o=new w,qs=new $e;class dh extends _e{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(Di*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),d={},m=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:M,b:p,c:f}=qs;if(M.fromBufferAttribute(a,l[0]),p.fromBufferAttribute(a,l[1]),f.fromBufferAttribute(a,l[2]),qs.getNormal(_o),u[0]=`${Math.round(M.x*s)},${Math.round(M.y*s)},${Math.round(M.z*s)}`,u[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,u[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let T=0;T<3;T++){const v=(T+1)%3,S=u[T],L=u[v],R=qs[h[T]],b=qs[h[v]],C=`${S}_${L}`,G=`${L}_${S}`;G in d&&d[G]?(_o.dot(d[G].normal)<=r&&(m.push(R.x,R.y,R.z),m.push(b.x,b.y,b.z)),d[G]=null):C in d||(d[C]={index0:l[T],index1:l[v],normal:_o.clone()})}}for(const g in d)if(d[g]){const{index0:M,index1:p}=d[g];Xs.fromBufferAttribute(a,M),Ys.fromBufferAttribute(a,p),m.push(Xs.x,Xs.y,Xs.z),m.push(Ys.x,Ys.y,Ys.z)}this.setAttribute("position",new te(m,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class kn extends Xi{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new kn(t.radius,t.detail)}}class Ua extends Xi{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ua(t.radius,t.detail)}}class ms extends _e{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,m=new w,g=new Mt;for(let M=0;M<=s;M++){for(let p=0;p<=n;p++){const f=r+p/n*o;m.x=u*Math.cos(f),m.y=u*Math.sin(f),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/e+1)/2,g.y=(m.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let M=0;M<s;M++){const p=M*(n+1);for(let f=0;f<n;f++){const T=f+p,v=T,S=T+n+1,L=T+n+2,R=T+1;a.push(v,S,R),a.push(S,L,R)}}this.setIndex(a),this.setAttribute("position",new te(c,3)),this.setAttribute("normal",new te(l,3)),this.setAttribute("uv",new te(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ms(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class xn extends _e{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new w,d=new w,m=[],g=[],M=[],p=[];for(let f=0;f<=n;f++){const T=[],v=f/n;let S=0;f===0&&o===0?S=.5/e:f===n&&c===Math.PI&&(S=-.5/e);for(let L=0;L<=e;L++){const R=L/e;u.x=-t*Math.cos(s+R*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+R*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),M.push(d.x,d.y,d.z),p.push(R+S,1-v),T.push(l++)}h.push(T)}for(let f=0;f<n;f++)for(let T=0;T<e;T++){const v=h[f][T+1],S=h[f][T],L=h[f+1][T],R=h[f+1][T+1];(f!==0||o>0)&&m.push(v,S,R),(f!==n-1||c<Math.PI)&&m.push(S,L,R)}this.setIndex(m),this.setAttribute("position",new te(g,3)),this.setAttribute("normal",new te(M,3)),this.setAttribute("uv",new te(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Na extends Xi{constructor(t=1,e=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,s,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Na(t.radius,t.detail)}}class Oa extends _e{constructor(t=new uh(new w(-1,-1,0),new w(-1,1,0),new w(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new w,c=new w,l=new Mt;let h=new w;const u=[],d=[],m=[],g=[];M(),this.setIndex(g),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(d,3)),this.setAttribute("uv",new te(m,2));function M(){for(let v=0;v<e;v++)p(v);p(r===!1?e:0),T(),f()}function p(v){h=t.getPointAt(v/e,h);const S=o.normals[v],L=o.binormals[v];for(let R=0;R<=s;R++){const b=R/s*Math.PI*2,C=Math.sin(b),G=-Math.cos(b);c.x=G*S.x+C*L.x,c.y=G*S.y+C*L.y,c.z=G*S.z+C*L.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function f(){for(let v=1;v<=e;v++)for(let S=1;S<=s;S++){const L=(s+1)*(v-1)+(S-1),R=(s+1)*v+(S-1),b=(s+1)*v+S,C=(s+1)*(v-1)+S;g.push(L,R,C),g.push(R,b,C)}}function T(){for(let v=0;v<=e;v++)for(let S=0;S<=s;S++)l.x=v/e,l.y=S/s,m.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Oa(new E_[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class ae extends hi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vl,this.normalScale=new Mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new We,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Fa extends pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class T_ extends Fa{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Et(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const vo=new qt,jc=new w,Jc=new w;class fh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Mt(512,512),this.map=null,this.mapPass=null,this.matrix=new qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Aa,this._frameExtents=new Mt(1,1),this._viewportCount=1,this._viewports=[new Zt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;jc.setFromMatrixPosition(t.matrixWorld),e.position.copy(jc),Jc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Jc),e.updateMatrixWorld(),vo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Zc=new qt,Zi=new w,xo=new w;class w_ extends fh{constructor(){super(new Ge(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Mt(4,2),this._viewportCount=6,this._viewports=[new Zt(2,1,1,1),new Zt(0,1,1,1),new Zt(3,1,1,1),new Zt(1,1,1,1),new Zt(3,0,1,1),new Zt(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Zi.setFromMatrixPosition(t.matrixWorld),n.position.copy(Zi),xo.copy(n.position),xo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(xo),n.updateMatrixWorld(),s.makeTranslation(-Zi.x,-Zi.y,-Zi.z),Zc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zc)}}class b_ extends Fa{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new w_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class A_ extends fh{constructor(){super(new eh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Qc extends Fa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pe.DEFAULT_UP),this.updateMatrix(),this.target=new pe,this.shadow=new A_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const tl=new qt;class ph{constructor(t,e,n=0,s=1/0){this.ray=new Cr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ba,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return tl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tl),this}intersectObject(t,e=!0,n=[]){return pa(t,this,n,e),n.sort(el),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)pa(t[s],this,n,e);return n.sort(el),n}}function el(i,t){return i.distance-t.distance}function pa(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)pa(r[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_a}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_a);const R_=4.6;function mh(i,t){return{position:i.clone().addScaledVector(t,R_),target:i.clone()}}const C_=2.4,P_=1.1;function L_(i,t,e){const n=new w(t.x-i.x,0,t.z-i.z);return n.lengthSq()<.09&&n.set(-e.x,0,-e.z),n.lengthSq()<1e-6&&n.set(1,0,0),n.normalize(),{position:i.clone().addScaledVector(n,P_).add(new w(0,C_,0)),target:i.clone()}}const I_=650,D_=550;function U_(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}class N_{constructor(t){O(this,"mode","free");O(this,"onModeChange",()=>{});O(this,"tween",null);O(this,"scratchPos",new w);O(this,"scratchTarget",new w);O(this,"nowMs",0);this.camera=t}currentPose(){const t=new w;return this.camera.getWorldDirection(t),{position:this.camera.position.clone(),target:this.camera.position.clone().add(t)}}lockedness(){switch(this.mode){case"free":return 0;case"locked":return 1;default:{const t=this.tween?this.tweenProgress():1;return this.mode==="locking"?t:1-t}}}lock(t,e){this.mode==="free"&&this.startTween(this.currentPose(),e,t,I_,"locked")}unlock(t,e){this.mode==="locked"&&this.startTween(this.currentPose(),e,t,D_,"free")}startTween(t,e,n,s,r){this.tween={from:t,to:e,startMs:n,durationMs:s,endMode:r},this.setMode(r==="locked"?"locking":"unlocking")}setMode(t){this.mode!==t&&(this.mode=t,this.onModeChange(t))}tweenProgress(){const t=this.tween;return U_(Math.min(1,(this.nowMs-t.startMs)/t.durationMs))}update(t){if(this.nowMs=t,!this.tween)return;const e=this.tween,n=this.tweenProgress();this.camera.position.copy(this.scratchPos.lerpVectors(e.from.position,e.to.position,n)),this.camera.lookAt(this.scratchTarget.lerpVectors(e.from.target,e.to.target,n)),n>=1&&(this.camera.position.copy(e.to.position),this.camera.lookAt(e.to.target),this.tween=null,this.setMode(e.endMode))}}const O_=.55,nl=.25,F_=.42,il=.0042,sl=Math.PI*.42,B_=8,z_=450,k_=160,rl=[1,2.2,3.4],ol=[-.85,-.45,0,.45,.85],H_=110,G_=320,V_=170,W_=900;function X_(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}class Y_{constructor(t,e,n){O(this,"position",new w(0,-1,0));O(this,"yaw",0);O(this,"pitch",0);O(this,"enabled",!0);O(this,"onTap",()=>{});O(this,"fanScale",1);O(this,"moveSlowdown",1);O(this,"canMove",!0);O(this,"onHop",()=>{});O(this,"onRestHold",()=>{});O(this,"pointers",new Map);O(this,"colliders",[]);O(this,"isWalkable");O(this,"markers",new re);O(this,"candidates",[]);O(this,"fanOpen",!1);O(this,"picked",null);O(this,"markerMaterial",new cn({color:13625039,transparent:!0,opacity:.5,depthWrite:!1}));O(this,"pickedMaterial",new cn({color:16777215,transparent:!0,opacity:.95,depthWrite:!1}));O(this,"move",null);O(this,"onDown",t=>{const e=this.canvas.getBoundingClientRect(),n=[...this.pointers.values()].map(o=>o.role),r=t.clientX-e.left<e.width*F_&&!n.includes("move")?"move":"look";r==="look"&&n.includes("look")||(this.pointers.set(t.pointerId,{role:r,startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastY:t.clientY,downMs:performance.now(),moved:!1}),this.canvas.setPointerCapture(t.pointerId),r==="move"&&this.enabled&&!this.move&&window.setTimeout(()=>{var o;((o=this.pointers.get(t.pointerId))==null?void 0:o.role)==="move"&&(this.fanOpen=!0)},k_),r==="look"&&this.enabled&&window.setTimeout(()=>{const o=this.pointers.get(t.pointerId);o&&o.role==="look"&&!o.moved&&this.enabled&&(this.pointers.delete(t.pointerId),this.onRestHold())},W_))});O(this,"onMove",t=>{const e=this.pointers.get(t.pointerId);e&&(Math.hypot(t.clientX-e.startX,t.clientY-e.startY)>B_&&(e.moved=!0),e.role==="look"&&this.enabled&&(this.yaw-=(t.clientX-e.lastX)*il,this.pitch=ye.clamp(this.pitch-(t.clientY-e.lastY)*il,-sl,sl)),e.lastX=t.clientX,e.lastY=t.clientY,e.role==="move"&&this.fanOpen&&this.refreshPick())});O(this,"onUp",t=>{const e=this.pointers.get(t.pointerId);if(e){if(this.pointers.delete(t.pointerId),e.role==="move"){const n=this.fanOpen;if(this.fanOpen=!1,n&&this.markers.visible){this.picked&&this.enabled&&this.commitMove(this.picked.point),this.closeFan();return}}!e.moved&&performance.now()-e.downMs<z_&&this.onTap(t.clientX,t.clientY)}});this.canvas=t,this.camera=n,t.addEventListener("pointerdown",this.onDown),t.addEventListener("pointermove",this.onMove),t.addEventListener("pointerup",this.onUp),t.addEventListener("pointercancel",this.onUp);const s=new ms(.15,.22,24);for(let r=0;r<rl.length*ol.length;r++){const o=new It(s,this.markerMaterial);o.rotation.x=-Math.PI/2,o.visible=!1,this.markers.add(o),this.candidates.push({point:new w,marker:o})}e.add(this.markers)}get isMoving(){return this.move!==null}eye(){return new w(this.position.x,this.position.y+O_,this.position.z)}forward(){return new w(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}applyCamera(t){t.position.copy(this.eye()),t.lookAt(this.eye().add(this.forward()))}update(t,e,n){if(this.colliders=e,this.isWalkable=n,this.move){const s=this.move,r=Math.min(1,(t-s.startMs)/s.durationMs);this.position.lerpVectors(s.from,s.to,X_(r)),r>=1&&(this.move=null)}else for(const s of e){const r=this.position.x-s.x,o=this.position.z-s.z,a=Math.hypot(r,o),c=s.radius+nl;if(a<c){const l=a>1e-4?r/a:1,h=a>1e-4?o/a:0;this.position.x=s.x+l*c,this.position.z=s.z+h*c}}this.fanOpen&&this.enabled&&this.canMove&&!this.move?this.layoutFan():this.closeFan()}isFree(t){for(const e of this.colliders)if(Math.hypot(t.x-e.x,t.z-e.z)<e.radius+nl)return!1;return!(this.isWalkable&&!this.isWalkable(t))}pathClear(t,e){const s=new w;for(let r=1;r<=8;r++)if(s.lerpVectors(t,e,r/8),!this.isFree(s))return!1;return!0}halfHorizontalFov(){const t=this.camera;return Math.atan(Math.tan(ye.degToRad(t.fov)/2)*t.aspect)}layoutFan(){this.markers.visible=!0;const t=-Math.sin(this.yaw),e=-Math.cos(this.yaw),n=this.halfHorizontalFov();let s=0;for(const r of rl)for(const o of ol){const a=o*n,c=this.candidates[s++],l=Math.cos(a),h=Math.sin(a),u=r*this.fanScale;c.point.set(this.position.x+(t*l+e*h)*u,this.position.y,this.position.z+(-t*h+e*l)*u);const d=this.isFree(c.point)&&this.pathClear(this.position,c.point);c.marker.visible=d,c.marker.position.set(c.point.x,this.position.y+.02,c.point.z)}this.refreshPick()}closeFan(){this.markers.visible&&(this.markers.visible=!1,this.picked=null)}refreshPick(){const t=[...this.pointers.values()].find(o=>o.role==="move");if(!t)return;const e=this.canvas.getBoundingClientRect(),n=new w;let s=null,r=H_;for(const o of this.candidates){if(!o.marker.visible)continue;n.copy(o.marker.position).project(this.camera);const a=e.left+(n.x*.5+.5)*e.width,c=e.top+(-n.y*.5+.5)*e.height,l=Math.hypot(a-t.lastX,c-t.lastY);l<r&&(r=l,s=o)}s!==this.picked&&(this.picked&&(this.picked.marker.material=this.markerMaterial,this.picked.marker.scale.setScalar(1)),this.picked=s,s&&(s.marker.material=this.pickedMaterial,s.marker.scale.setScalar(1.45)))}commitMove(t){const e=this.position.clone(),n=e.distanceTo(t);this.move={from:e,to:t.clone(),startMs:performance.now(),durationMs:(G_+n*V_)*this.moveSlowdown},this.onHop(n)}}const ii=[{name:"rose",hex:15225471},{name:"gold",hex:15906106},{name:"sky",hex:6076656},{name:"leaf",hex:8313175},{name:"violet",hex:11765749}];function yn(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function q_(i,t){if(i!==ii.length)throw new Error(`assignDistinctColors: need exactly ${ii.length} tips for a 1:1 colour map, got ${i}`);const e=yn(t),n=ii.map((s,r)=>r);for(let s=n.length-1;s>0;s--){const r=Math.floor(e()*(s+1));[n[s],n[r]]=[n[r],n[s]]}return n}function ls(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new _e;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const m in u.attributes){if(!n.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+m+'" attribute exists among all geometries, or in none of them.'),null;r[m]===void 0&&(r[m]=[]),r[m].push(u.attributes[m]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const m in u.morphAttributes){if(!s.has(m))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[m]===void 0&&(o[m]=[]),o[m].push(u.morphAttributes[m])}if(t){let m;if(e)m=u.index.count;else if(u.attributes.position!==void 0)m=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,m,h),l+=m}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const m=i[d].index;for(let g=0;g<m.count;++g)u.push(m.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=al(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const m=[];for(let M=0;M<o[h].length;++M)m.push(o[h][M][d]);const g=al(m);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function al(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new Oe(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let d=0,m=h.count;d<m;d++)for(let g=0;g<e;g++){const M=h.getComponent(d,g);a.setComponent(d+u,g,M)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const Ve=1,ni=5,$_=[new w(0,.72,Ve),new w(-.72,.22,Ve),new w(.72,.22,Ve),new w(-.46,-.58,Ve),new w(.46,-.58,Ve)],K_=[[new w(.18,.2,-.45),new w(-.15,.55,.3)],[new w(-.3,-.15,.5),new w(-.62,.1,-.2)],[new w(.25,.35,.55),new w(.65,.4,-.1)],[new w(-.1,-.35,-.55),new w(-.5,-.25,.35)],[new w(.35,-.1,.25),new w(.55,-.55,-.35)]],gh=new w(0,0,0),cl=new w(0,-Ve,0),j_=30;function J_(i){const t=gh.y-cl.y,e=new ai(.15,.21,t,12),n=new It(e,i);n.position.set(0,t/2,0);const s=new re;return s.position.copy(cl),s.add(n),s}function Z_(i,t){const e=yn(i),n=new kn(1,1),s=[],r=new qt,o=new zn,a=new We;for(let c=0;c<j_;c++){const l=.28+e()*.24,h=new w((e()*2-1)*.6,(e()*2-1)*(Ve-l*.6),(e()*2-1)*.6),u=new w(l*(.8+e()*.5),l*(.7+e()*.5),l*(.8+e()*.5));o.setFromEuler(a.set(e()*Math.PI,e()*Math.PI,e()*Math.PI)),s.push(n.clone().applyMatrix4(r.compose(h,o,u)))}return new It(ls(s),t)}function Q_(i){const t=[gh.clone(),...K_[i].map(e=>e.clone()),$_[i].clone()];return new hh(t,!1,"centripetal",.5)}function t0(i,t){const e=new re,n=new ae({color:ii[i].hex,roughness:.55,emissive:ii[i].hex,emissiveIntensity:0}),s=new xn(1,14,10),r=6,o=.12,a=[],c=new qt;for(let h=0;h<r;h++){const u=h/r*Math.PI*2;c.compose(new w(Math.cos(u)*o,Math.sin(u)*o,0),new zn().setFromEuler(new We(0,0,u)),new w(.12,.065,.04)),a.push(s.clone().applyMatrix4(c))}e.add(new It(ls(a),n));const l=new It(new xn(.06,12,10),t);return l.position.z=.02,e.add(l),{group:e,petalMaterial:n}}function e0(i,t=7,e=1){if(i.length!==ni)throw new Error(`buildRig: expected ${ni} colours, got ${i.length}`);const n=new ae({color:5914410,roughness:.9}),s=new ae({color:5208634,roughness:.8}),r=new ae({color:16773544,roughness:.6}),o=new ae({color:2046498,roughness:1,flatShading:!0}),a=[n,s,r,o],c=new re,l=J_(n);c.add(l);const h=Z_(t,o);c.add(h);const u=[],d=[],m=[],g=new xn(.24,8,6),M=Array.from({length:ni},(v,S)=>Q_(S)),p=ls(M.map(v=>new Oa(v,48,.045,8,!1)));for(let v=0;v<e;v++){const S=new re;S.rotation.y=v*Math.PI/2,c.add(S),u.push(S);const L=new It(p,s);S.add(L);for(let R=0;R<ni;R++){const b=M[R],{group:C,petalMaterial:G}=t0(i[R],r);a.push(G),C.position.copy(b.getPointAt(1)),S.add(C);const _=new It(g);_.visible=!1,_.userData.tipIndex=R,C.add(_),m.push(_),d.push({index:d.length,tip:R,face:v,curve:b,tube:L,flower:C,colorIndex:i[R],petalMaterial:G})}}const f=new Pa({color:3820090,transparent:!0,opacity:.35}),T=new ah(new dh(new Mn(Ve*2,Ve*2,Ve*2)),f);return c.add(T),a.push(f),{root:c,branches:d,hitTargets:m,materials:a,trunkPivot:l,foliage:h,faceGroups:u,edges:T}}const n0=700,i0=90,Mo=90,ll=1.3,s0=.75;function r0(i){return i*i}function o0(i){return 1-(1-i)*(1-i)}class _h{constructor(){O(this,"active",[])}start(t,e,n){t.forEach((s,r)=>{this.active.push({branch:s,startMs:e+r*i0,fromScale:s.flower.scale.x,onDone:()=>n(s)})})}get isBusy(){return this.active.length>0}update(t){const e=[],n=[];for(const s of this.active){const r=t-s.startMs;if(r<0){e.push(s);continue}const{flower:o,curve:a}=s.branch;if(r<Mo){const h=o0(r/Mo),u=ye.lerp(s.fromScale,ll,h);o.scale.setScalar(u),e.push(s);continue}const c=Math.min(1,(r-Mo)/n0),l=r0(c);o.position.copy(a.getPointAt(1-l)),o.scale.setScalar(ll*(1-l)),o.rotation.z=l*s0*Math.PI*2,c>=1?(o.visible=!1,n.push(s)):e.push(s)}this.active=e;for(const s of n)s.onDone()}}const hl=220,a0=450,c0=1150,l0=.3,h0=.4,ul=1e3,u0=4.5,$s=80,dl=60;function d0(i){return i*i*i}function f0(i){return 1-Math.pow(1-i,3)}class p0{constructor(t,e,n){O(this,"stragglers");O(this,"animator",new _h);O(this,"stragglersStarted",!1);O(this,"burstStarted",!1);O(this,"finished",!1);O(this,"fx",new re);O(this,"ring");O(this,"ringMaterial");O(this,"sparks");O(this,"sparkMaterial");O(this,"sparkVelocities");O(this,"light");O(this,"lastBurstMs",0);this.rig=t,this.parent=e,this.startMs=n,this.stragglers=t.branches.filter(s=>s.flower.visible)}get isDone(){return this.finished}update(t){if(this.finished)return;const e=t-this.startMs;e>=hl&&!this.stragglersStarted&&(this.stragglersStarted=!0,this.animator.start(this.stragglers,t,()=>{})),this.animator.update(t);const n=e-hl-a0;if(n>=0){this.burstStarted||(this.burstStarted=!0,this.buildBurst(),this.lastBurstMs=t);const s=Math.min(1,n/c0),r=d0(s),o=this.rig.root;o.position.y=-2.6*r;const a=ye.lerp(1,l0,r);o.scale.set(a,1,a),o.rotation.y=h0*Math.PI*2*r,this.updateBurst(t,Math.min(1,n/ul)),s>=1&&n>=ul&&(o.visible=!1,this.parent.remove(this.fx),this.finished=!0)}}buildBurst(){this.ringMaterial=new cn({color:16773568,transparent:!0,opacity:.9,blending:os,depthWrite:!1,side:qe}),this.ring=new It(new ms(.75,1,64),this.ringMaterial),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=-.97,this.fx.add(this.ring);const t=new Float32Array($s*3);this.sparkVelocities=new Float32Array($s*3);for(let n=0;n<$s;n++){const s=Math.random()*Math.PI*2,r=Math.random()*.8;t[n*3]=Math.cos(s)*r,t[n*3+1]=-1+Math.random()*.4,t[n*3+2]=Math.sin(s)*r,this.sparkVelocities[n*3]=Math.cos(s)*(.4+Math.random()*1.2),this.sparkVelocities[n*3+1]=1.5+Math.random()*2.5,this.sparkVelocities[n*3+2]=Math.sin(s)*(.4+Math.random()*1.2)}const e=new _e;e.setAttribute("position",new Oe(t,3)),this.sparkMaterial=new La({color:16774344,size:.09,transparent:!0,opacity:1,blending:os,depthWrite:!1}),this.sparks=new ch(e,this.sparkMaterial),this.fx.add(this.sparks),this.light=new b_(16771504,dl,14,2),this.light.position.set(0,.2,0),this.fx.add(this.light),this.parent.add(this.fx)}updateBurst(t,e){const n=(t-this.lastBurstMs)/1e3;this.lastBurstMs=t;const s=f0(e);this.ring.scale.setScalar(ye.lerp(.3,u0,s)),this.ringMaterial.opacity=.9*(1-e);const r=this.sparks.geometry.getAttribute("position"),o=r.array;for(let a=0;a<$s;a++)o[a*3]+=this.sparkVelocities[a*3]*n,o[a*3+1]+=this.sparkVelocities[a*3+1]*n,o[a*3+2]+=this.sparkVelocities[a*3+2]*n,this.sparkVelocities[a*3+1]-=1.2*n;r.needsUpdate=!0,this.sparkMaterial.opacity=1-e*e,this.light.intensity=dl*(e<.15?e/.15:1-(e-.15)/.85)}}const m0=200,So=600,Ks=850,g0=260,_0=.07,js=70,fl=700,v0=2.2;function pl(i){return i*i*i}function x0(i){return 1-Math.pow(1-i,3)}class M0{constructor(t,e,n,s,r){O(this,"fx",new re);O(this,"leaves",null);O(this,"leafVel");O(this,"leafMaterial");O(this,"dust",null);O(this,"dustMaterial");O(this,"axis");O(this,"thudded",!1);O(this,"finished",!1);O(this,"lastMs");this.rig=t,this.parent=e,this.startMs=n,this.fallDir=s,this.onThud=r,this.axis=new w(0,1,0).cross(s).normalize(),this.lastMs=n,e.add(this.fx)}get isDone(){return this.finished}update(t){if(this.finished)return;const e=(t-this.lastMs)/1e3;this.lastMs=t;const n=t-this.startMs-m0;if(n<0)return;const s=Math.min(1,n/So);this.leaves||this.buildLeaves();const r=Math.max(.001,1-pl(s));this.rig.foliage.scale.setScalar(r);for(const l of this.rig.faceGroups)l.scale.setScalar(r);this.rig.edges.material.opacity=.35*(1-s),this.updateLeaves(e,Math.min(1,n/(So+400)));const o=n-So;if(o<0)return;const a=Math.min(1,o/Ks);let c=Math.PI/2*pl(a);if(a>=1){this.thudded||(this.thudded=!0,this.buildDust(),this.onThud());const l=Math.min(1,(o-Ks)/g0);c=Math.PI/2-_0*Math.sin(Math.PI*l),this.updateDust(Math.min(1,(o-Ks)/fl)),l>=1&&o-Ks>=fl&&(this.parent.remove(this.fx),this.finished=!0)}this.rig.trunkPivot.setRotationFromAxisAngle(this.axis,c)}buildLeaves(){const t=new Float32Array(js*3);this.leafVel=new Float32Array(js*3);for(let n=0;n<js;n++){const s=Math.random()*Math.PI*2,r=Math.random()*.7;t[n*3]=Math.cos(s)*r,t[n*3+1]=-.6+Math.random()*1.4,t[n*3+2]=Math.sin(s)*r,this.leafVel[n*3]=Math.cos(s)*(.6+Math.random()*1.4),this.leafVel[n*3+1]=.6+Math.random()*1.6,this.leafVel[n*3+2]=Math.sin(s)*(.6+Math.random()*1.4)}const e=new _e;e.setAttribute("position",new Oe(t,3)),this.leafMaterial=new La({color:9425002,size:.11,transparent:!0,opacity:.95,depthWrite:!1}),this.leaves=new ch(e,this.leafMaterial),this.fx.add(this.leaves)}updateLeaves(t,e){if(!this.leaves)return;const n=this.leaves.geometry.getAttribute("position"),s=n.array;for(let r=0;r<js;r++)s[r*3]+=this.leafVel[r*3]*t,s[r*3+1]+=this.leafVel[r*3+1]*t,s[r*3+2]+=this.leafVel[r*3+2]*t,this.leafVel[r*3+1]-=2.2*t;n.needsUpdate=!0,this.leafMaterial.opacity=.95*(1-e*e),e>=1&&(this.leaves.visible=!1)}buildDust(){this.dustMaterial=new cn({color:12170148,transparent:!0,opacity:.55,depthWrite:!1,side:qe}),this.dust=new It(new ms(.6,1,40),this.dustMaterial),this.dust.rotation.x=-Math.PI/2,this.dust.position.set(this.fallDir.x*.5,-.97,this.fallDir.z*.5),this.fx.add(this.dust)}updateDust(t){this.dust&&(this.dust.scale.setScalar(ye.lerp(.3,v0,x0(t))),this.dustMaterial.opacity=.55*(1-t))}}const Mr=5,vh=6,xh=6;class gs{constructor(t,e,n){O(this,"grid",[]);O(this,"nextId",1);O(this,"rand");this.rows=t,this.cols=e,this.rand=yn(n),this.deal()}gemAt(t){return this.grid[t.row][t.col]}locate(t){for(let e=0;e<this.rows;e++)for(let n=0;n<this.cols;n++)if(this.grid[e][n].id===t)return{row:e,col:n};return null}static adjacent(t,e){return Math.abs(t.row-e.row)+Math.abs(t.col-e.col)===1}swap(t,e){if(!gs.adjacent(t,e))return{valid:!1};if(this.exchange(t,e),this.findRuns().length===0)return this.exchange(t,e),{valid:!1};const n=[];for(;;){const r=this.findRuns();if(r.length===0)break;n.push(this.clearAndFall(r))}let s=!1;return this.hasValidMove()||(this.deal(),s=!0),{valid:!0,steps:n,reshuffled:s}}findRuns(){const t=[];for(let e=0;e<this.rows;e++){let n=0;for(let s=1;s<=this.cols;s++)(s===this.cols||this.grid[e][s].type!==this.grid[e][n].type)&&(s-n>=3&&t.push({type:this.grid[e][n].type,cells:ml(n,s).map(r=>({row:e,col:r}))}),n=s)}for(let e=0;e<this.cols;e++){let n=0;for(let s=1;s<=this.rows;s++)(s===this.rows||this.grid[s][e].type!==this.grid[n][e].type)&&(s-n>=3&&t.push({type:this.grid[n][e].type,cells:ml(n,s).map(r=>({row:r,col:e}))}),n=s)}return t}hasValidMove(){for(let t=0;t<this.rows;t++)for(let e=0;e<this.cols;e++)for(const[n,s]of[[0,1],[1,0]]){const r={row:t+n,col:e+s};if(r.row>=this.rows||r.col>=this.cols)continue;const o={row:t,col:e};this.exchange(o,r);const a=this.findRuns().length>0;if(this.exchange(o,r),a)return!0}return!1}exchange(t,e){const n=this.grid[t.row][t.col];this.grid[t.row][t.col]=this.grid[e.row][e.col],this.grid[e.row][e.col]=n}newGem(t){return{id:this.nextId++,type:t}}deal(){for(let t=0;t<100;t++){this.grid=[];for(let e=0;e<this.rows;e++){const n=[];for(let s=0;s<this.cols;s++){let r;do r=Math.floor(this.rand()*Mr);while(s>=2&&n[s-1].type===r&&n[s-2].type===r||e>=2&&this.grid[e-1][s].type===r&&this.grid[e-2][s].type===r);n.push(this.newGem(r))}this.grid.push(n)}if(this.hasValidMove())return}throw new Error("Board.deal: could not find a dealable grid")}clearAndFall(t){const e=new Set,n=[];for(const o of t)for(const a of o.cells){const c=`${a.row},${a.col}`;if(e.has(c))continue;e.add(c);const l=this.grid[a.row][a.col];n.push({...a,id:l.id,type:l.type})}const s=[],r=[];for(let o=0;o<this.cols;o++){let a=this.rows-1;for(let l=this.rows-1;l>=0;l--)e.has(`${l},${o}`)||(a!==l&&(s.push({id:this.grid[l][o].id,col:o,fromRow:l,toRow:a}),this.grid[a][o]=this.grid[l][o]),a--);const c=a+1;for(let l=a;l>=0;l--){const h=this.newGem(Math.floor(this.rand()*Mr));this.grid[l][o]=h,r.push({id:h.id,type:h.type,col:o,fromRow:l-c,toRow:l})}}return{runs:t,cleared:n,falls:s,spawns:r}}}function ml(i,t){return Array.from({length:t-i},(e,n)=>i+n)}const Mh={name:"single",target(i,t){return t.targetCount>0?0:null}},S0=1.2,y0=3.3,Js=40,gl=4,E0="fell",_l=.05,T0=.7,w0=.9,b0=3.5;function yo(i){return new w(Math.sin(i*Math.PI/2),0,Math.cos(i*Math.PI/2))}class Sh{constructor(t,e,n,s){O(this,"kind","voxel");O(this,"lockReach",y0);O(this,"hintLocked","Tap a gem, then a neighbour, to swap. Every match feeds the tree.");O(this,"group",new re);O(this,"rig");O(this,"colors");O(this,"board");O(this,"pool",0);O(this,"targeting",Mh);O(this,"hitBox");O(this,"status","growing");O(this,"onDone",()=>{});O(this,"onThud",()=>{});O(this,"ending",E0);O(this,"lockedFace",0);O(this,"receded");O(this,"flash",0);O(this,"animator",new _h);O(this,"beat",null);O(this,"lastNow",0);O(this,"baseOpacity");this.index=t,this.colors=q_(ni,s),this.board=new gs(vh,xh,s^20973),this.receded=this.colors.map(()=>!1),this.rig=e0(this.colors,s^40503,gl),this.baseOpacity=this.rig.materials.map(r=>r.opacity);for(const r of this.rig.branches)r.petalMaterial.emissiveIntensity=_l;this.group.position.copy(e),this.group.lookAt(n.x,e.y,n.z),this.group.add(this.rig.root),this.hitBox=new It(new Mn(Ve*2,Ve*2,Ve*2)),this.hitBox.visible=!1,this.hitBox.userData.interactable=this,this.group.add(this.hitBox);for(const r of this.rig.hitTargets)r.userData.interactable=this}get center(){return this.group.position.clone()}get normal(){return yo(this.lockedFace).applyQuaternion(this.group.quaternion)}lockPose(t){const e=t.position.clone().sub(this.group.position);e.y=0;let n=0,s=-1/0;for(let r=0;r<gl;r++){const o=yo(r).applyQuaternion(this.group.quaternion).dot(e);o>s&&(s=o,n=r)}return this.lockedFace=n,mh(this.center,this.normal)}get lockTargets(){return[this.hitBox,...this.rig.hitTargets]}collider(){return this.status==="resolved"?null:{x:this.group.position.x,z:this.group.position.z,radius:S0}}distanceTo(t){return Math.hypot(t.x-this.group.position.x,t.z-this.group.position.z)}get flowersLeft(){return this.receded.filter(t=>!t).length}poolText(){return`tree ${this.pool}/${Js} · flowers ${this.flowersLeft}`}targetFor(t){return this.status!=="growing"?null:this.targeting.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){const t=this.receded.indexOf(!1);if(t===-1)return this.center;const e=this.rig.branches.find(n=>n.face===this.lockedFace&&n.tip===t);return e?e.flower.getWorldPosition(new w):this.center}feed(t,e,n){if(this.status!=="growing")return;this.pool=Math.min(Js,this.pool+e),this.flash=w0;const s=Js/ni;for(let r=0;r<ni;r++)!this.receded[r]&&this.pool>=(r+1)*s-1e-6&&this.recedeTip(r,n)}recedeTip(t,e){this.receded[t]=!0;for(const n of this.rig.branches)n.tip===t&&this.animator.start([n],e,()=>{this.flowersLeft===0&&!this.animator.isBusy&&this.beginResolve(this.lastNow)})}beginResolve(t){this.status==="growing"&&(this.status="resolving",this.beat=this.ending==="fell"?new M0(this.rig,this.group,t,yo(this.lockedFace),()=>this.onThud(this)):new p0(this.rig,this.group,t))}setFade(t){const e=ye.clamp(t,0,1);this.rig.root.visible=e>0&&this.status!=="resolved",this.rig.materials.forEach((n,s)=>{n.opacity=this.baseOpacity[s]*e,n.transparent=e<1||this.baseOpacity[s]<1})}update(t){const e=Math.max(0,(t-this.lastNow)/1e3);this.lastNow=t,this.flash=Math.max(0,this.flash-b0*e);const n=ye.lerp(_l,T0,this.pool/Js)+this.flash;for(const s of this.rig.branches)this.receded[s.tip]||(s.petalMaterial.emissiveIntensity=n);this.animator.update(t),this.beat&&(this.beat.update(t),this.beat.isDone&&(this.beat=null,this.status="resolved",this.rig.root.visible=!1,this.onDone(this)))}}const A0=9e4,Sr=4,R0=new ae({color:5914410,roughness:.95}),C0=new ae({color:3103280,roughness:1,flatShading:!0});function Eo(i,t,e){const n=new re,s=new It(new ai(t*.7,t,i,7),R0);s.position.y=i/2,n.add(s);const r=new kn(1,0);for(const[o,a,c,l]of e){const h=new It(r,C0);h.position.set(o,a,c),h.scale.setScalar(l),n.add(h)}return n}class P0{constructor(){O(this,"group",new re);O(this,"stages");O(this,"current",-1);this.stages=[Eo(.35,.03,[[.06,.34,0,.08],[-.05,.28,.04,.07]]),Eo(.7,.05,[[0,.72,0,.24],[.14,.5,-.08,.12]]),Eo(1,.07,[[0,1.05,0,.42],[.3,.75,.1,.22],[-.28,.85,-.12,.2]])];for(const t of this.stages)t.visible=!1,this.group.add(t);this.setProgress(0)}setProgress(t){const e=Math.min(this.stages.length-1,Math.floor(t*this.stages.length));e!==this.current&&(this.current=e,this.stages.forEach((s,r)=>s.visible=r===e));const n=t*this.stages.length-e;this.stages[e].scale.setScalar(.85+.15*Math.min(1,n))}}const Ai=1.3,Zs=12,L0=2.8,Qs=[170,100,40,0],tr=[0,3,8,15],To=[.66,.33,1e-4],I0=[3095847,4012584,4864808,5390380];class yh{constructor(t,e,n,s=!1){O(this,"kind","patch");O(this,"group",new re);O(this,"board");O(this,"lockReach",L0);O(this,"hintLocked","Tap a gem, then a neighbour, to swap. Every match tills the ground.");O(this,"status","growing");O(this,"pool",0);O(this,"targeting",Mh);O(this,"onDone",()=>{});O(this,"onGrown",()=>{});O(this,"lockTargets");O(this,"sapling",null);O(this,"plantedAt",0);O(this,"stages",[]);O(this,"stage",-1);O(this,"blockedLook");O(this,"plantedLook");O(this,"unblockedStatus","growing");O(this,"lastNow",0);this.index=t,this.board=new gs(vh,xh,n^31249),this.group.position.copy(e),this.buildStages(n),this.setStage(0),s&&this.setBlocked(!0);const r=new It(new Mn(Ai,.4,Ai));r.position.y=.2,r.visible=!1,r.userData.interactable=this,this.group.add(r),this.lockTargets=[r]}get center(){return this.group.position.clone()}get footprintHalf(){return Ai/2}setBlocked(t){if(this.status!=="resolved"){if(t&&this.status!=="blocked")this.unblockedStatus=this.status,this.status="blocked";else if(!t&&this.status==="blocked")this.status=this.unblockedStatus;else return;this.blockedLook.visible=t,this.stages.forEach((e,n)=>e.visible=!t&&n===this.stage)}}lockPose(t){return L_(this.center,t.position,t.forward)}distanceTo(t){return Math.hypot(t.x-this.group.position.x,t.z-this.group.position.z)}targetFor(t){return this.status!=="growing"?null:this.targeting.target(t,{targetCount:1,boardCols:this.board.cols,colorOfTarget:()=>-1})}targetWorldPosition(){return this.center.add(new w(0,.15,0))}feed(t,e){this.status==="growing"&&(this.pool=Math.min(Zs,this.pool+e),this.setStage(this.stageFor(1-this.pool/Zs)),this.pool>=Zs&&(this.status="resolved",this.onDone(this)))}poolText(){return this.status==="planted"?"planted":this.status==="resolved"?"tilled":this.status==="blocked"?"blocked — clear the ground":`soil ${this.pool}/${Zs}`}get acceptsSeeds(){return this.status==="resolved"}plant(t,e){return!this.acceptsSeeds||t<Sr?0:(this.status="planted",this.plantedAt=e,this.stages.forEach(n=>n.visible=!1),this.plantedLook.visible=!0,this.sapling=new P0,this.sapling.group.position.y=.01,this.group.add(this.sapling.group),Sr)}get growth(){return this.status==="planted"?Math.min(1,(this.lastNow-this.plantedAt)/A0):0}update(t){if(this.lastNow=t,this.status!=="planted"||!this.sapling)return;const e=this.growth;this.sapling.setProgress(e),e>=1&&(this.group.remove(this.sapling.group),this.sapling=null,this.onGrown(this))}stageFor(t){for(let e=0;e<To.length;e++)if(t>To[e])return e;return To.length}setStage(t){t!==this.stage&&(this.stage=t,this.stages.forEach((e,n)=>e.visible=n===t))}buildStages(t){const e=yn(t),n=Ai/2,s=new Lr(.035,.24,5);s.translate(0,.12,0);const r=[],o=new qt,a=new zn,c=new We;for(let f=0;f<Qs[0];f++){const T=new w((e()*2-1)*(n-.05),0,(e()*2-1)*(n-.05));a.setFromEuler(c.set((e()-.5)*.7,e()*Math.PI*2,(e()-.5)*.7));const v=.7+e()*.7;r.push(s.clone().applyMatrix4(o.compose(T,a,new w(1,v,1))))}const l=new kn(1,0),h=[];for(let f=0;f<tr[tr.length-1];f++){const T=.11+e()*.1,v=new w((e()*2-1)*(n-T),T*.45,(e()*2-1)*(n-T));a.setFromEuler(c.set(e()*Math.PI,e()*Math.PI,e()*Math.PI)),h.push(l.clone().applyMatrix4(o.compose(v,a,new w(T,T*.65,T))))}const u=new ae({color:6270524,roughness:.9,flatShading:!0}),d=new ae({color:9085002,roughness:.9,flatShading:!0}),m=new ae({color:7031342,roughness:1,flatShading:!0}),g=new Fn(Ai,Ai);g.rotateX(-Math.PI/2),this.blockedLook=new re;const M=new It(g,new ae({color:3813672,roughness:1}));M.position.y=.012,this.blockedLook.add(M);const p=new ah(new dh(g),new Pa({color:10135706,transparent:!0,opacity:.35}));p.position.y=.02,this.blockedLook.add(p),this.blockedLook.visible=!1,this.group.add(this.blockedLook),this.plantedLook=new It(g,new ae({color:4863526,roughness:1})),this.plantedLook.position.y=.012,this.plantedLook.visible=!1,this.group.add(this.plantedLook);for(let f=0;f<Qs.length;f++){const T=new re,v=new It(g,new ae({color:I0[f],roughness:1}));v.position.y=.012,T.add(v),Qs[f]>0&&T.add(new It(ls(r.slice(0,Qs[f])),f===0?u:d)),tr[f]>0&&T.add(new It(ls(h.slice(0,tr[f])),m)),T.visible=!1,this.group.add(T),this.stages.push(T)}}}const rn=-1,yr=14673903,D0=9416920,Eh=14674160,U0=.0011,N0=7763311,O0=7105380,vl=.5,F0=.05,ma=-60,Ni=60,Er=24,Th=.4,wh=400;function rs(i){return Er+3*Math.sin(i/9)+1.2*Math.sin(i/3.1+1)}function B0(i){const t=Er+8-ma,e=Ni*2,n=new Fn(t,e,Math.round(t/vl),Math.round(e/vl));n.rotateX(-Math.PI/2),n.translate(ma+t/2,0,0);const s=yn(i),r=n.getAttribute("position");for(let o=0;o<r.count;o++){const a=r.getX(o),c=r.getZ(o),l=rs(c);a>l&&r.setX(o,l);const h=Math.sin(a*1.7+c*.9)*.35+Math.sin(a*.4-c*1.3)*.25;r.setY(o,(h+(s()-.5))*F0)}return n.computeVertexNormals(),n}function z0(i){const t=[0,.35,.9,1.8,3.2,5.5,9,15,25,40,65,100,160,250,wh],e=200,n=yn(i),s=[],r=[];for(let c=0;c<=e;c++){const l=-Ni+c/e*Ni*2,h=rs(l);for(let u=0;u<t.length;u++){const d=t[u],m=.22+d*.02,g=Math.sin(l*1.3+d*.7)*.5+Math.sin(l*.37-d*.21)*.5,M=u%2===0?.35+d*.01:0,p=d===0?0:(g+(n()-.5))*m+M,f=.03*d;s.push(h+f+p,rn-d,l)}}const o=t.length;for(let c=0;c<e;c++)for(let l=0;l<o-1;l++){const h=c*o+l,u=h+o;r.push(h,u,h+1,h+1,u,u+1)}const a=new _e;return a.setAttribute("position",new te(s,3)),a.setIndex(r),a.computeVertexNormals(),a}function k0(){const i=new xn(2800,32,16),t=i.getAttribute("position"),e=new Float32Array(t.count*3),n=new Et(yr),s=new Et(D0),r=new Et;for(let a=0;a<t.count;a++){const c=ye.clamp(t.getY(a)/2800,0,1);r.copy(n).lerp(s,Math.pow(c,.6)),e[a*3]=r.r,e[a*3+1]=r.g,e[a*3+2]=r.b}i.setAttribute("color",new Oe(e,3));const o=new It(i,new cn({vertexColors:!0,side:Pe,fog:!1,depthWrite:!1}));return o.renderOrder=-1,o}function H0(i){const t=new re,e=yn(19);i.background=new Et(yr);const n=new Ca(yr,U0);i.fog=n;const s=k0();t.add(s);const r=new T_(Eh,2765604,1.1);i.add(r);const o=new Qc(16773336,1.6);o.position.set(30,12,-8),i.add(o);const a=new Qc(12372192,0);a.position.set(-6,40,12),i.add(a);const c=new ae({color:N0,roughness:1,flatShading:!0}),l=new It(B0(11),c);l.position.y=rn,t.add(l);const h=new It(z0(13),new ae({color:O0,roughness:1,flatShading:!0,side:qe}));t.add(h);const u=new kn(1,0);for(let S=0;S<40;S++){const L=-Ni+e()*Ni*2,R=.1+e()*.3,b=new It(u,c);b.position.set(rs(L)-.2+e()*.5,rn+R*.4,L),b.scale.set(R,R*.7,R),b.rotation.set(e()*3,e()*3,e()*3),t.add(b)}const d=rn-wh,m=new It(new Fn(8e3,8e3),new ae({color:4155962,roughness:1}));m.rotation.x=-Math.PI/2,m.position.y=d,t.add(m);const g=new xn(1,10,6),M=new ae({color:2904624,roughness:1,flatShading:!0});for(let S=0;S<260;S++){const L=Er+25+Math.pow(e(),1.6)*1100,R=(e()*2-1)*(300+L*.9),b=10+e()*40+L*.02,C=new It(g,M);C.position.set(L,d,R),C.scale.set(b,b*(.35+e()*.3),b),t.add(C)}const p=new It(new Fn(2200,34),new cn({color:11847380}));p.rotation.x=-Math.PI/2,p.rotation.z=-.35,p.position.set(Er+700,d+.5,150),t.add(p);const f=[{minX:380,maxX:560,count:11,rMin:90,rMax:200,hMin:60,hMax:170,color:4873046},{minX:800,maxX:1150,count:14,rMin:160,rMax:340,hMin:150,hMax:330,color:6123641},{minX:1500,maxX:2100,count:16,rMin:260,rMax:520,hMin:300,hMax:560,color:8229283}];for(const S of f){const L=new cn({color:S.color});for(let R=0;R<S.count;R++){const b=S.minX+e()*(S.maxX-S.minX),C=(e()*2-1)*(b*1.15),G=S.rMin+e()*(S.rMax-S.rMin),_=S.hMin+e()*(S.hMax-S.hMin),E=new It(new Lr(G,_,5+Math.floor(e()*3)),L);E.position.set(b,d+_/2,C),E.rotation.y=e()*Math.PI,t.add(E)}}i.add(t);const T=S=>S.x<=rs(S.z)-Th&&S.x>=ma+1&&Math.abs(S.z)<=Ni-1,v=S=>rs(S.z)-S.x;return{group:t,sun:o,moon:a,hemi:r,skyMaterial:s.material,fog:n,isWalkable:T,distanceToEdge:v}}const G0={tiny:20,small:5,large:1},bh=1,$n=2;function V0(i,t=bh){return i<=0?1:Math.ceil(i/t)}function er(i,t=bh){return i<=0?1:Math.ceil(i/(2*t))}const W0=new ae({color:5914410,roughness:.95,flatShading:!0}),Ah=new ae({color:7302760,emissive:8384712,emissiveIntensity:0,roughness:1,flatShading:!0}),X0=new ae({color:7031342,roughness:.95}),Y0=new ae({color:15127439,roughness:.6}),q0={seed:{id:"seed",label:"seeds",size:"tiny",mass:0,color:15127439,radius:.06,blocks:!1,restHeight:.05,food:.04,build:()=>{const i=new It(new xn(.06,8,6),Y0);return i.scale.set(1,.7,1.3),i}},stick:{id:"stick",label:"sticks",size:"small",mass:0,color:7031342,radius:.28,blocks:!0,restHeight:.04,build:()=>{const i=new It(new ai(.03,.04,.55,6),X0);return i.rotation.z=Math.PI/2,i}},lichen:{id:"lichen",label:"lichen",size:"tiny",mass:0,color:8384712,radius:.25,blocks:!1,restHeight:.02,build:()=>{const i=new It(new kn(1,1),Ah);return i.scale.set(.32,.04,.24),i}},log:{id:"log",label:"log",size:"large",mass:4,color:5914410,radius:.62,blocks:!0,restHeight:.18,build:()=>{const i=new It(new ai(.17,.19,1.25,10),W0);return i.rotation.z=Math.PI/2,i}}};let $0=1;class K0{constructor(t){O(this,"id",$0++);O(this,"group",new re);O(this,"mesh");O(this,"collectible",!0);this.type=t,this.mesh=t.build(),this.mesh.userData.object=this,this.group.add(this.mesh)}get position(){return this.group.position}rest(t,e,n,s=0){this.group.position.set(t,e+this.type.restHeight,n),this.group.rotation.y=s}}class j0{constructor(t){O(this,"group",new re);O(this,"objects",[]);t.add(this.group)}spawn(t,e,n,s,r=0){const o=new K0(q0[t]);return o.rest(e,n,s,r),this.group.add(o.group),this.objects.push(o),o}remove(t){const e=this.objects.indexOf(t);e>=0&&this.objects.splice(e,1),this.group.remove(t.group)}raycastTargets(){return this.objects.filter(t=>t.collectible).map(t=>t.mesh)}nearby(t,e,n,s){return this.objects.filter(r=>r.collectible&&(!s||r.type.id===s)&&Math.hypot(r.position.x-t,r.position.z-e)<=n).sort((r,o)=>Math.hypot(r.position.x-t,r.position.z-e)-Math.hypot(o.position.x-t,o.position.z-e))}overlapsSquare(t,e,n){return this.objects.filter(s=>s.type.blocks&&Math.abs(s.position.x-t)<n+s.type.radius&&Math.abs(s.position.z-e)<n+s.type.radius)}scatterFelledTree(t,e,n,s){const r=yn(s),o=Math.atan2(e.x,e.z)+Math.PI/2;this.spawn("log",t.x+e.x*.62,n,t.z+e.z*.62,o);for(let a=0;a<3;a++){const c=r()*Math.PI*2,l=.45+r()*.55;this.spawn("stick",t.x+Math.cos(c)*l,n,t.z+Math.sin(c)*l,r()*Math.PI)}for(let a=0;a<12;a++){const c=r()*Math.PI*2,l=.2+r()*.75;this.spawn("seed",t.x+Math.cos(c)*l,n,t.z+Math.sin(c)*l,r()*Math.PI)}}}const J0=2.6,Z0=.9,Q0=70,tv=380,xl=1,ev=.55,nv=1.7,iv=8,sv=450,rv=260;class ov{constructor(t,e,n,s,r,o,a,c){O(this,"state",Array.from({length:$n},()=>({kind:"empty"})));O(this,"notice",null);O(this,"onChange",()=>{});O(this,"placeOnTarget",()=>null);O(this,"onEat",()=>!1);O(this,"condition",{strength:1,capScale:1,handsAvailable:$n});O(this,"eating",null);O(this,"gesture",null);O(this,"holdTimer",null);O(this,"flies",[]);O(this,"flyGroup",new re);O(this,"raycaster",new ph);O(this,"groundPlane");O(this,"lastMs",0);this.camera=t,this.player=e,this.objects=n,this.boxes=r,this.overlay=o,this.groundY=a,this.isWalkable=c,s.add(this.flyGroup),this.groundPlane=new Pn(new w(0,1,0),-a),r.forEach((l,h)=>{l.addEventListener("pointerdown",u=>this.onDown(u,h)),l.addEventListener("pointermove",u=>this.onMove(u)),l.addEventListener("pointerup",u=>this.onUp(u)),l.addEventListener("pointercancel",u=>this.onUp(u))}),this.render()}get dragging(){const t=this.linkedObject();return t&&this.linkedHands(t)>=er(t.type.mass,this.condition.strength)?t:null}get straining(){const t=this.linkedObject();return t!==null&&this.linkedHands(t)<er(t.type.mass,this.condition.strength)}linkedObject(){for(const t of this.state)if(t.kind==="linked")return t.obj;return null}linkedHands(t){return this.state.filter(e=>e.kind==="linked"&&e.obj===t).length}freeHands(){return this.state.filter(t=>t.kind==="empty").length}setCondition(t){const e=this.condition.handsAvailable;if(this.condition=t,t.handsAvailable<e){for(let n=t.handsAvailable;n<$n;n++){const s=this.state[n];s.kind==="linked"?this.unlink(s.obj):s.kind!=="empty"&&this.tapBox(n)}this.render(),this.onChange()}else t.handsAvailable!==e&&this.render()}update(t){const e=Math.min(.1,Math.max(0,(t-this.lastMs)/1e3));if(this.lastMs=t,this.eating&&t>=this.eating.nextMs){const r=this.state[this.eating.hand];r.kind==="stack"&&r.type.food&&this.onEat(r.type)?(r.count--,this.eating.ate=!0,this.eating.nextMs=t+rv,r.count<=0&&(this.state[this.eating.hand]={kind:"empty"},this.eating=null),this.render(),this.onChange()):this.eating=null}const n=[];for(const r of this.flies){const o=Math.min(1,(t-r.startMs)/tv),a=this.pointUnderBox(r.hand);r.mesh.position.lerpVectors(r.from,a,o*o),r.mesh.scale.setScalar(r.scale*(1-.85*o)),o>=1?this.flyGroup.remove(r.mesh):n.push(r)}this.flies=n;const s=this.dragging;if(s){const r=this.player.position.x-s.position.x,o=this.player.position.z-s.position.z,a=Math.hypot(r,o);if(a>xl){const c=(a-xl)/a;s.position.x+=r*c*Math.min(1,e*12),s.position.z+=o*c*Math.min(1,e*12),s.group.rotation.y=Math.atan2(r,o)+Math.PI/2}}this.drawLines()}onDown(t,e){if(this.gesture)return;if(t.preventDefault(),e>=this.condition.handsAvailable){this.say("Too tired."),this.onChange();return}this.gesture={pointerId:t.pointerId,hand:e,startX:t.clientX,startY:t.clientY,x:t.clientX,y:t.clientY,moved:!1,target:null},this.boxes[e].setPointerCapture(t.pointerId),this.boxes[e].classList.add("active");const n=this.state[e];n.kind==="stack"&&n.type.food&&(this.holdTimer=window.setTimeout(()=>{const s=this.gesture;s&&s.pointerId===t.pointerId&&!s.moved&&(this.eating={hand:e,nextMs:this.lastMs,ate:!1})},sv))}onMove(t){const e=this.gesture;!e||e.pointerId!==t.pointerId||(e.x=t.clientX,e.y=t.clientY,Math.hypot(e.x-e.startX,e.y-e.startY)>iv&&(e.moved=!0),e.target=e.moved?this.pickObject(e.x,e.y):null)}onUp(t){const e=this.gesture;if(!e||e.pointerId!==t.pointerId)return;this.gesture=null,this.holdTimer!==null&&(window.clearTimeout(this.holdTimer),this.holdTimer=null);const n=this.eating!==null&&this.eating.ate;this.eating=null,this.boxes[e.hand].classList.remove("active"),n||(e.moved?this.release(e):this.tapBox(e.hand)),this.render(),this.onChange()}tapBox(t){const e=this.state[t];if(e.kind==="empty")return;if(e.kind==="linked"){this.unlink(e.obj);return}const n=this.player.forward(),s=new w(this.player.position.x+n.x*.6,this.groundY,this.player.position.z+n.z*.6);this.placeHand(t,s)}release(t){const e=this.state[t.hand],n=t.target;if(e.kind==="empty"){if(!n)return;if(!this.inReach(n.position))return this.say("Out of reach.");this.take(t.hand,n);return}if(e.kind==="linked")return;if(e.kind==="stack"&&n&&n.type===e.type){if(!this.inReach(n.position))return this.say("Out of reach.");this.gather(t.hand,n);return}if(e.kind==="stack"){const r=this.placeOnTarget(t.x,t.y,e.type,e.count);if(r!==null){r>0&&(e.count-=r,e.count<=0&&(this.state[t.hand]={kind:"empty"}));return}}const s=this.pickGround(t.x,t.y);if(s){if(!this.inReach(s))return this.say("Out of reach.");if(!this.isWalkable(s))return this.say("Not there.");this.placeHand(t.hand,s)}}take(t,e){const n=e.type;if(n.size!=="large"){this.state[t]={kind:"stack",type:n,count:0},this.gather(t,e);return}const s=V0(n.mass,this.condition.strength);if(s<=this.freeHands()){this.fly(e,t),this.objects.remove(e);let r=s;for(let o=0;o<$n&&r>0;o++)(o===t||this.state[o].kind==="empty")&&(this.state[o]={kind:"held",type:n},r--);return}if(er(n.mass,this.condition.strength)<=this.condition.handsAvailable){this.state[t]={kind:"linked",obj:e},this.linkedHands(e)<er(n.mass,this.condition.strength)&&this.say("Too heavy for one hand.");return}this.say("Too heavy.")}gather(t,e){const n=this.state[t];if(n.kind!=="stack")return;const s=Math.max(1,Math.floor(G0[n.type.size]*this.condition.capScale)),r=this.objects.nearby(e.position.x,e.position.z,Z0,n.type.id);for(const o of r){if(n.count>=s)break;this.inReach(o.position)&&(this.fly(o,t),this.objects.remove(o),n.count++)}n.count===0&&(this.state[t]={kind:"empty"})}placeHand(t,e){const n=this.state[t];if(n.kind==="stack"){for(let s=0;s<n.count;s++){const r=s/n.count*Math.PI*2+.7,o=n.count===1?0:.12+.18*Math.sqrt(s/n.count);this.objects.spawn(n.type.id,e.x+Math.cos(r)*o,this.groundY,e.z+Math.sin(r)*o,r)}this.state[t]={kind:"empty"}}else if(n.kind==="held"){this.objects.spawn(n.type.id,e.x,this.groundY,e.z,this.player.yaw);for(let s=0;s<$n;s++){const r=this.state[s];r.kind==="held"&&r.type===n.type&&(this.state[s]={kind:"empty"})}}}unlink(t){for(let e=0;e<$n;e++){const n=this.state[e];n.kind==="linked"&&n.obj===t&&(this.state[e]={kind:"empty"})}}fly(t,e){const n=t.type.build(),s=t.group.getWorldPosition(new w);n.position.copy(s),n.rotation.copy(t.mesh.rotation),n.rotateY(t.group.rotation.y),this.flyGroup.add(n),this.flies.push({mesh:n,from:s,hand:e,startMs:this.lastMs,scale:1})}say(t){this.notice=t}inReach(t){return Math.hypot(t.x-this.player.position.x,t.z-this.player.position.z)<=J0}ndc(t,e){return new Mt(t/window.innerWidth*2-1,-(e/window.innerHeight)*2+1)}pickObject(t,e){this.raycaster.setFromCamera(this.ndc(t,e),this.camera);const n=this.raycaster.intersectObjects(this.objects.raycastTargets(),!1)[0];if(n)return n.object.userData.object;let s=null,r=Q0;const o=new w;for(const a of this.objects.objects){if(!a.collectible||(o.copy(a.position).project(this.camera),o.z>1||Math.abs(o.x)>1.2||Math.abs(o.y)>1.2))continue;const c=(o.x*.5+.5)*window.innerWidth,l=(-o.y*.5+.5)*window.innerHeight,h=Math.hypot(c-t,l-e);h<r&&(r=h,s=a)}return s}pickGround(t,e){this.raycaster.setFromCamera(this.ndc(t,e),this.camera);const n=new w;return this.raycaster.ray.intersectPlane(this.groundPlane,n)?n:null}pointUnderBox(t){const e=this.boxes[t].getBoundingClientRect(),n=this.ndc(e.left+e.width/2,e.top+e.height),r=new w(n.x,n.y,.5).unproject(this.camera).sub(this.camera.position).normalize();return this.camera.position.clone().addScaledVector(r,1.2)}boxCenter(t){const e=this.boxes[t].getBoundingClientRect();return[e.left+e.width/2,e.top+e.height]}screenOf(t){const e=t.clone().project(this.camera);return e.z>1?null:[(e.x*.5+.5)*window.innerWidth,(-e.y*.5+.5)*window.innerHeight]}drawLines(){const t=[],e=(r,o,a)=>t.push(`<line class="${a}" x1="${r[0].toFixed(1)}" y1="${r[1].toFixed(1)}" x2="${o[0].toFixed(1)}" y2="${o[1].toFixed(1)}"/>`),n=this.gesture;if(n&&n.moved){const r=n.target?this.screenOf(n.target.position)??[n.x,n.y]:[n.x,n.y];e(this.boxCenter(n.hand),r,n.target?"link glow snap":"link glow"),e(this.boxCenter(n.hand),r,n.target?"link core snap":"link core")}const s=this.straining;for(let r=0;r<$n;r++){const o=this.state[r];if(o.kind!=="linked")continue;const a=this.screenOf(this.nearestPointOn(o.obj));a&&(e(this.boxCenter(r),a,s?"link glow strain":"link glow"),e(this.boxCenter(r),a,s?"link core strain":"link core"))}this.overlay.innerHTML=t.join("")}nearestPointOn(t){if(t.type.id!=="log")return t.position.clone();const e=.55,n=t.group.rotation.y,s=new w(Math.cos(n),0,-Math.sin(n)).multiplyScalar(e),r=t.position.clone().add(s),o=t.position.clone().sub(s),a=this.player.position;return r.distanceToSquared(a)<o.distanceToSquared(a)?r:o}render(){const t=this.straining;this.state.forEach((e,n)=>{const s=this.boxes[n];switch(s.classList.toggle("disabled",n>=this.condition.handsAvailable),s.classList.toggle("full",e.kind!=="empty"),s.classList.toggle("linked",e.kind==="linked"),s.classList.toggle("strain",e.kind==="linked"&&t),e.kind){case"empty":s.innerHTML="";break;case"stack":s.innerHTML=`<i style="background:#${e.type.color.toString(16).padStart(6,"0")}"></i><b>${e.count}</b><small>${e.type.label}</small>`;break;case"held":s.innerHTML=`<i style="background:#${e.type.color.toString(16).padStart(6,"0")}"></i><small>${e.type.label}</small>`;break;case"linked":s.innerHTML=`<i style="background:#${e.obj.type.color.toString(16).padStart(6,"0")}"></i><small>${t?"strain":"dragging"}</small>`;break}})}}const Kn=1,av=.9,cv=.012,lv=.015,hv=.008,uv=.05,dv=.0015,fv=.35,pv=.7,wo=.05,mv=.35,gv=.6,nr=1400,ir=.85,bo=.45,_v=.2,Ml=.6;class vv{constructor(){O(this,"value",av);O(this,"sinceEating",0);O(this,"phase",{kind:"awake"});O(this,"lastMs",0);O(this,"onEvent",()=>{})}get band(){const t=this.value/Kn;return t<=wo?"floor":t<_v?"exhausted":t<bo?"tired":t>=ir?"wellfed":"normal"}get busy(){return this.phase.kind!=="awake"}drain(t){this.phase.kind==="awake"&&(this.value=Math.max(0,this.value-t))}eat(t){this.value=Math.min(Kn,this.value+t),this.sinceEating=0,this.onEvent("ate")}rest(t){this.phase.kind==="awake"&&(this.phase={kind:"fading",to:"rest",startMs:t})}update(t){const e=this.lastMs?Math.min(.25,(t-this.lastMs)/1e3):0;switch(this.lastMs=t,this.phase.kind){case"awake":this.value=Math.max(0,this.value-dv*e),this.value<=wo*Kn&&(this.phase={kind:"fading",to:"collapse",startMs:t},this.onEvent("collapse"));break;case"fading":if(t-this.phase.startMs>=nr){const n=Math.pow(gv,this.sinceEating);if(this.sinceEating++,this.phase.to==="collapse")this.value=Math.max(this.value,mv*n*Kn);else{const r=pv*Kn;this.value=Math.min(Math.max(this.value,r),this.value+fv*n),this.value=Math.max(this.value,wo*Kn+.02)}const s=this.phase.to;this.phase={kind:"waking",startMs:t},this.onEvent(s==="rest"?"rest":"wake")}break;case"waking":t-this.phase.startMs>=nr&&(this.phase={kind:"awake"});break}}effects(t){const e=this.value/Kn,n=this.band,s=Qi((Ml-e)/Ml),r=Math.pow(s,.8),o=Qi((e-ir)/(1-ir));let a=0;this.phase.kind==="fading"?a=Qi((t-this.phase.startMs)/nr):this.phase.kind==="waking"&&(a=1-Qi((t-this.phase.startMs)/nr));const c={wellfed:[1.25,1,2,1.1],normal:[1,1,2,1],tired:[.75,.5,2,.7],exhausted:[.5,.25,2,.45],floor:[.25,.25,2,.3]},[l,h,u,d]=c[n];return{band:n,strength:l,capScale:h,handsAvailable:u,fanScale:d,haloDark:r,haloLight:o,saturation:1-.8*Math.pow(s,1.3)+.15*o,exposure:1-.4*s+.08*o,blackout:a,vision:Qi((e-bo)/(ir-bo))}}}function Qi(i){return Math.max(0,Math.min(1,i))}const xv=24e4,ga=.15,Mv=922396,Sv=1712691,yv=2240584,Ev=.75,Tv=.5,wv=9413826,bv=.3,Av=.45,Rv=.5;class Cv{constructor(t,e=ga){O(this,"time",ga);O(this,"dayHaze",new Et);O(this,"nightHaze",new Et(Mv));O(this,"scratch",new Et);O(this,"hemiDay",new Et);O(this,"hemiNight",new Et(yv));O(this,"skyNight",new Et(Sv));O(this,"hemiVision",new Et(wv));this.rig=t,this.time=e,this.dayHaze.setHex(t.dayHaze),this.hemiDay.setHex(t.dayHemiSky)}get sunHeight(){return Math.sin(this.time*Math.PI*2)}get day(){return ye.smoothstep(this.sunHeight,-.25,.35)}advance(t){this.time=(this.time+t/xv)%1}apply(t=0){const e=this.day,n=1-e,s=this.rig,r=this.time*Math.PI*2;s.sun.position.set(Math.cos(r)*20+10,this.sunHeight*30+2,-Math.sin(r)*30),s.sun.intensity=1.6*e,s.moon.intensity=Tv*n*t,s.hemi.intensity=ye.lerp(.18,1.1,e)+Ev*n*t,s.hemi.color.copy(this.scratch.copy(this.hemiNight).lerp(this.hemiVision,n*t).lerp(this.hemiDay,e)),this.scratch.copy(this.nightHaze).lerp(this.dayHaze,e),s.fog.color.copy(this.scratch),s.background.copy(this.scratch),s.skyMaterial.color.copy(this.scratch.copy(this.skyNight).lerp(new Et(16777215),e))}vision(t){const e=1-this.day;return{exposure:ye.lerp(1,ye.lerp(bv,1,t),e),saturation:ye.lerp(1,ye.lerp(.95,Av,t),e),glow:e*(1-t)}}}const Sl=2.2,yl=.62,Pv=.88,Lv=.5,Iv=.82,Dv=-.17,jn=.36,Uv=170,El=150,Nv=200,Ov=70,Fv=160,Tl=220,Bv=1.3;function zv(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function wl(i){return i*i}function kv(i){return 1+2.70158*Math.pow(i-1,3)+1.70158*Math.pow(i-1,2)}function Hv(i){switch(i%Mr){case 0:return new Ua(jn,0);case 1:return new Mn(jn*1.35,jn*1.35,jn*1.35);case 2:return new kn(jn,0);case 3:return new Da(jn,0);default:return new Na(jn*1.25,0)}}class Gv{constructor(t){O(this,"group",new re);O(this,"onRun",()=>{});O(this,"model",null);O(this,"meshes",new Map);O(this,"geometries",Array.from({length:Mr},(t,e)=>Hv(e)));O(this,"materials",ii.map(t=>new ae({color:t.hex,emissive:t.hex,emissiveIntensity:.35,roughness:.35,metalness:.1,transparent:!0,opacity:Iv})));O(this,"selectedId",null);O(this,"queue",[]);O(this,"active",null);O(this,"shown",!1);O(this,"showStartMs",0);O(this,"fitScale",1);this.camera=t,t.add(this.group),this.group.visible=!1,this.layout()}layout(){var a,c;const t=Math.tan(ye.degToRad(this.camera.fov)/2)*Sl,e=t*this.camera.aspect,n=((a=this.model)==null?void 0:a.cols)??6,s=((c=this.model)==null?void 0:c.rows)??6,r=e*2*Pv/n,o=t*2*Lv/(s*Math.cos(yl));this.fitScale=Math.min(r,o),this.group.position.set(0,t*2*Dv,-Sl),this.group.rotation.set(-yl,0,0),this.shown&&!this.active&&this.group.scale.setScalar(this.fitScale)}get isBusy(){return this.active!==null||this.queue.length>0}bind(t){this.model=t,this.selectedId=null,this.queue=[],this.active=null,this.rebuildMeshes(),this.layout()}unbind(){this.model=null,this.clearMeshes(),this.group.visible=!1,this.shown=!1}show(t){this.model&&(this.shown=!0,this.showStartMs=t,this.group.visible=!0,this.group.scale.setScalar(.001))}hide(){this.shown=!1,this.group.visible=!1,this.selectedId=null}tap(t){if(!this.model||!this.shown||this.isBusy)return!1;const e=t.intersectObjects([...this.meshes.values()],!1)[0];if(!e)return!1;const n=e.object.userData.gemId,s=this.model.locate(n);if(!s)return!1;if(this.selectedId===null)return this.select(n),!0;if(this.selectedId===n)return this.select(null),!0;const r=this.model.locate(this.selectedId);if(!r||!gs.adjacent(r,s))return this.select(n),!0;const o=this.selectedId,a=this.model.swap(r,s);if(this.select(null),!a.valid)return this.queue.push({kind:"swap",a:o,b:n,durationMs:El}),this.queue.push({kind:"swap",a:o,b:n,durationMs:El}),!0;this.queue.push({kind:"swap",a:o,b:n,durationMs:Uv});for(const c of a.steps)this.queue.push({kind:"clear",step:c}),this.queue.push({kind:"fall",step:c});return a.reshuffled&&this.queue.push({kind:"rebuild"}),!0}update(t){if(!this.shown||!this.model)return;!this.active&&this.queue.length&&this.begin(this.queue.shift(),t);const e=Math.min(1,(t-this.showStartMs)/Tl);if(this.group.scale.setScalar(this.fitScale*kv(e)),!this.active)return;const n=this.active,s=Math.min(1,(t-n.startMs)/n.durationMs);switch(n.phase.kind){case"swap":{const r=zv(s);for(const o of n.moves)o.mesh.position.lerpVectors(o.from,o.to,r);break}case"clear":{const r=1-wl(s);for(const o of n.shrinking)o.scale.setScalar(Math.max(.001,r*(1+.35*Math.sin(s*Math.PI))));break}case"fall":{const r=wl(s);for(const o of n.moves)o.mesh.position.lerpVectors(o.from,o.to,r);break}}s>=1&&this.finish(n)}cellPosition(t,e=this.model.rows,n=this.model.cols){return new w(t.col-(n-1)/2,(e-1)/2-t.row,0)}select(t){var e,n;this.selectedId!==null&&((e=this.meshes.get(this.selectedId))==null||e.scale.setScalar(1)),this.selectedId=t,t!==null&&((n=this.meshes.get(t))==null||n.scale.setScalar(Bv))}makeMesh(t,e){const n=new It(this.geometries[e],this.materials[e]);return n.userData.gemId=t,n.rotation.set(.35,t%7*.9,.2),this.group.add(n),this.meshes.set(t,n),n}rebuildMeshes(){this.clearMeshes();const t=this.model;for(let e=0;e<t.rows;e++)for(let n=0;n<t.cols;n++){const s=t.grid[e][n];this.makeMesh(s.id,s.type).position.copy(this.cellPosition({row:e,col:n}))}}clearMeshes(){for(const t of this.meshes.values())this.group.remove(t);this.meshes.clear(),this.selectedId=null}begin(t,e){const n=[],s=[];let r=1;switch(t.kind){case"swap":{const o=this.meshes.get(t.a),a=this.meshes.get(t.b);n.push({mesh:o,from:o.position.clone(),to:a.position.clone()}),n.push({mesh:a,from:a.position.clone(),to:o.position.clone()}),r=t.durationMs;break}case"clear":{for(const o of t.step.cleared){const a=this.meshes.get(o.id);a&&s.push(a)}for(const o of t.step.runs){const a=new w;for(const c of o.cells)a.add(this.cellPosition(c));a.divideScalar(o.cells.length),this.onRun(o,this.group.localToWorld(a))}r=Nv;break}case"fall":{let o=1;for(const a of t.step.falls){const c=this.meshes.get(a.id);n.push({mesh:c,from:c.position.clone(),to:this.cellPosition({row:a.toRow,col:a.col})}),o=Math.max(o,a.toRow-a.fromRow)}for(const a of t.step.spawns){const c=this.makeMesh(a.id,a.type),l=this.cellPosition({row:a.fromRow,col:a.col});c.position.copy(l),n.push({mesh:c,from:l,to:this.cellPosition({row:a.toRow,col:a.col})}),o=Math.max(o,a.toRow-a.fromRow)}r=Fv+o*Ov;break}case"rebuild":this.rebuildMeshes(),r=Tl,this.showStartMs=e;break}this.active={phase:t,startMs:e,durationMs:r,moves:n,shrinking:s}}finish(t){for(const e of t.moves)e.mesh.position.copy(e.to);if(t.phase.kind==="clear")for(const e of t.phase.step.cleared){const n=this.meshes.get(e.id);n&&(this.group.remove(n),this.meshes.delete(e.id))}this.active=null}}const Vv=420,Wv=.35,Xv=.055;function Yv(i){return i*i}class qv{constructor(t){O(this,"group",new re);O(this,"shots",[]);O(this,"geometry",new xn(Xv,10,8));t.add(this.group)}fire(t,e,n,s,r){const o=new cn({color:n,transparent:!0,opacity:.95,blending:os,depthWrite:!1}),a=new It(this.geometry,o);a.position.copy(t),this.group.add(a),this.shots.push({mesh:a,from:t.clone(),to:e.clone(),startMs:s,onHit:r})}update(t){const e=[],n=[];for(const s of this.shots){const r=Math.min(1,(t-s.startMs)/Vv),o=Yv(r);s.mesh.position.lerpVectors(s.from,s.to,o),s.mesh.position.y+=Math.sin(r*Math.PI)*Wv,s.mesh.scale.setScalar(1+.6*Math.sin(r*Math.PI)),r>=1?n.push(s):e.push(s)}this.shots=e;for(const s of n)this.group.remove(s.mesh),s.mesh.material.dispose(),s.onHit()}}const Ir=new URLSearchParams(window.location.search),ci=Number.parseInt(Ir.get("seed")??"",10)||1,Tr=Math.max(1,Number.parseFloat(Ir.get("slowmo")??"")||1),$v=Ir.has("debug"),Kv=Number.parseFloat(Ir.get("time")??"")||ga,Ie=new a_,Ba=40,fe=new Ge(Ba,window.innerWidth/window.innerHeight,.05,4e3),Le=new o_({antialias:!0});Le.toneMapping=Ll;Le.toneMappingExposure=1;Le.setSize(window.innerWidth,window.innerHeight);Le.setPixelRatio(Math.min(window.devicePixelRatio,2));document.body.appendChild(Le.domElement);const nn=H0(Ie),de=new N_(fe);Ie.add(fe);const je=new Gv(fe),Rh=new qv(Ie),li=new j0(Ie),se=new Y_(Le.domElement,Ie,fe);se.position.set(0,rn,0);se.yaw=Math.PI/2;const be=new ov(fe,se,li,Ie,[...document.querySelectorAll("#hands .hand")],document.getElementById("links"),rn,i=>nn.isWalkable(i));be.placeOnTarget=(i,t,e,n)=>{if(e.id!=="seed")return null;Oh(i,t);const s=br.intersectObjects(xe.flatMap(a=>a.lockTargets),!1)[0];if(!s)return null;const r=s.object.userData.interactable;if(r.distanceTo(se.position)>r.lockReach)return be.notice="Out of reach.",0;if(!r.acceptsSeeds)return be.notice=r.status==="planted"?"Already planted.":"Till it first.",0;if(n<Sr)return be.notice=`Needs ${Sr} seeds.`,0;const o=r.plant(n,jt);return ui(),o};const Ee=new vv,jv=document.getElementById("halo"),Jv=document.getElementById("blackout");be.onEat=i=>i.food?(Ee.eat(i.food),!0):!1;se.onHop=()=>Ee.drain(be.dragging?uv:hv);se.onRestHold=()=>{de.mode==="free"&&!Ee.busy&&Ee.rest(jt)};Ee.onEvent=i=>{const t={collapse:"You collapse.",wake:"You wake, still tired.",rest:"You rest.",ate:""}[i];t&&(us.textContent=t,Pi=jt+1800)};let bl=Ee.band;function Zv(){const i=Ee.effects(jt);be.setCondition({strength:i.strength,capScale:i.capScale,handsAvailable:i.handsAvailable});const t=100-70*i.haloDark;jv.style.background=i.haloDark>.01?`radial-gradient(ellipse at center, rgba(0,0,0,0) ${Math.max(15,t-45)}%, rgba(0,0,0,${(.92*i.haloDark).toFixed(3)}) ${t}%)`:i.haloLight>.01?`radial-gradient(ellipse at center, rgba(255,240,200,0) 62%, rgba(255,236,190,${(.22*i.haloLight).toFixed(3)}) 100%)`:"none",Le.domElement.style.filter=i.saturation<.995?`saturate(${i.saturation.toFixed(3)})`:"",Le.toneMappingExposure=i.exposure,Jv.style.opacity=i.blackout.toFixed(3),i.band!==bl&&(bl=i.band,ui())}function Qv(){const i=Un.vision(Ee.effects(jt).vision);Le.toneMappingExposure*=i.exposure;const t=(Number.parseFloat(Le.domElement.style.filter.replace(/[^0-9.]/g,""))||1)*i.saturation;Le.domElement.style.filter=t<.995?`saturate(${t.toFixed(3)})`:"",Ah.emissiveIntensity=2.6*i.glow;const e=i.glow>Rv;for(const n of li.objects)n.type.id==="lichen"&&(n.collectible=e)}const hs=2.45,ts=3,tx=35*Math.PI/180,ex=new w(0,0,0),Ae=[],Ch=(i,t)=>Ae.push(new Sh(Ae.length,i,t,ci*131+Ae.length*17));for(let i=-ts;i<=ts;i++)for(let t=-ts;t<=ts;t++){const e=Math.max(Math.abs(i),Math.abs(t),Math.abs(i+t));if(e===0||e>ts)continue;const n=hs*(i+t/2),s=hs*t*(Math.sqrt(3)/2);e>=2&&Math.abs(Math.atan2(s,n))<tx||Ch(new w(n,0,s),ex)}const nx=new w(hs,0,0);for(const i of[-1.4,1.4])Ch(new w(hs*2,0,i),nx);for(const i of Ae)Ie.add(i.group);const xe=[],ix=[[0,0],[hs*3,0],[10.5,-2.5],[10.5,0],[10.5,2.5],[13,-2.5],[13,2.5],[15.5,0],[15.5,2.5]];for(const[i,t]of ix)xe.push(new yh(xe.length,new w(i,rn,t),ci*977+xe.length*23));for(const i of xe)Ie.add(i.group);const si=[...Ae,...xe],za=320,sx=.045;let wr=-1;const sr=new w;for(const i of Ae)i.onThud=()=>{wr=jt+za};function Ph(i){const t=new Sh(Ae.length,new w(i.center.x,0,i.center.z),se.position.clone(),ci*131+4e3+Ae.length*17);t.onDone=ka,t.onThud=()=>{wr=jt+za},Ae.push(t),si.push(t),Ie.add(t.group),Ie.remove(i.group),xe.splice(xe.indexOf(i),1),si.splice(si.indexOf(i),1),ui()}for(const i of xe)i.onGrown=Ph;function rx(i){const t=i.normal;li.scatterFelledTree(i.center,t,rn,ci*53+i.index);const e=new yh(xe.length,new w(i.center.x,rn,i.center.z),ci*977+500+i.index,!0);e.onDone=ka,e.onGrown=Ph,xe.push(e),si.push(e),Ie.add(e.group)}const Un=new Cv({sun:nn.sun,moon:nn.moon,hemi:nn.hemi,skyMaterial:nn.skyMaterial,fog:nn.fog,background:Ie.background,dayHaze:yr,dayHemiSky:Eh},Kv);Un.apply();{const i=yn(ci*7+3);let t=0;for(let e=0;e<400&&t<40;e++){const n=-12+i()*34,s=(i()*2-1)*20;nn.isWalkable(new w(n,rn,s))&&(Ae.some(r=>Math.hypot(r.center.x-n,r.center.z-s)<1.7)||xe.some(r=>Math.hypot(r.center.x-n,r.center.z-s)<1.1)||(li.spawn("lichen",n,rn,s,i()*Math.PI),t++))}}let ue=null;const ox=450;let dr=null;function ka(i){i===ue&&de.mode==="locked"&&(dr=jt+ox),i.kind==="voxel"&&i.ending==="fell"&&rx(i),ui()}for(const i of si)i.onDone=ka;const ax=2.4,cx=2.6,lx=2.3;function hx(i,t){if(t.kind==="patch")return i.distanceTo(t.center)<lx;const e=t,n=mh(e.center,e.normal),s=i.center;if(s.distanceTo(n.position)<ax)return!0;const r=e.normal;if(!(s.clone().sub(e.center).dot(r)>.5))return!1;const a=n.target.clone().sub(n.position).normalize(),c=s.clone().sub(n.position);return c.clone().sub(a.multiplyScalar(c.dot(a))).length()<cx}const ux=document.getElementById("hud"),us=document.getElementById("hint"),Lh=document.getElementById("back"),Ih={free:"Hold on the left to move, drag to look, tap growth or grass to lock in. Drag a hand box to a thing to take or place it.",locking:"",locked:"",unlocking:""};function Dh(i){us.textContent=i==="locked"&&ue?ue.hintLocked:Ih[i],se.enabled=i==="free",i!=="free"&&Nh(Ba),i==="locked"&&ue&&(je.bind(ue.board),je.show(jt)),i==="unlocking"&&je.hide(),i==="free"&&(je.unbind(),ue=null),ui()}je.onRun=(i,t)=>{const e=ue;if(!e)return;const n=e.targetFor(i);if(n===null)return;const s=i.cells.length;Rh.fire(t,e.targetWorldPosition(n),ii[i.type].hex,jt,()=>{e.feed(n,s,jt),Ee.drain(e.kind==="voxel"?cv:lv),ui()})};de.onModeChange=Dh;Lh.addEventListener("click",()=>{de.mode==="locked"&&de.unlock(jt,Uh())});function Uh(){const i=se.eye();return{position:i,target:i.clone().add(se.forward())}}function ui(){const i=Ae.filter(s=>s.status==="resolved").length,t=xe.filter(s=>s.status==="resolved").length,e=xe.filter(s=>s.status==="planted").length,n=[`seed ${ci}`,`cleared ${i}/${Ae.length}`,`tilled ${t}/${xe.length}`];e&&n.push(`planted ${e}`),Tr>1&&n.push(`slowmo ×${Tr}`),$v&&n.push(`vit ${Ee.value.toFixed(2)} ${Ee.band}`,`time ${Un.time.toFixed(2)} day ${Un.day.toFixed(2)}`),ue&&de.mode==="locked"&&ue.status==="growing"&&n.push(ue.poolText()),n.push("R: new arrangement"),ux.textContent=n.join(" · "),Lh.hidden=!(de.mode==="locked"&&(ue==null?void 0:ue.status)==="growing")}const dx=1.6,fx=9,px=.08;function Nh(i){Math.abs(fe.fov-i)<.001||(fe.fov=i,fe.updateProjectionMatrix(),je.layout())}function mx(){const i=nn.distanceToEdge(se.position)-Th;return ye.clamp(1-i/dx,0,1)}const br=new ph,Al=new Mt;function Oh(i,t){Al.set(i/window.innerWidth*2-1,-(t/window.innerHeight)*2+1),br.setFromCamera(Al,fe)}let Pi=0;se.onTap=(i,t)=>{if(Oh(i,t),de.mode==="free"){const e=si.filter(r=>r.status==="growing").flatMap(r=>r.lockTargets),n=br.intersectObjects(e,!1)[0];if(!n)return;const s=n.object.userData.interactable;if(s.distanceTo(se.position)>s.lockReach){us.textContent="Closer.",Pi=jt+900;return}ue=s,de.lock(jt,s.lockPose({position:se.position,forward:se.forward()}))}else de.mode==="locked"&&ue&&je.tap(br)&&ui()};window.addEventListener("keydown",i=>{if(i.key==="r"||i.key==="R"){const t=new URL(window.location.href);t.searchParams.set("seed",String(Math.floor(Math.random()*1e6))),window.location.href=t.toString()}});window.addEventListener("resize",()=>{fe.aspect=window.innerWidth/window.innerHeight,fe.updateProjectionMatrix(),Le.setSize(window.innerWidth,window.innerHeight),je.layout()});let jt=0,Rl=performance.now();Dh(de.mode);se.applyCamera(fe);function Fh(i){requestAnimationFrame(Fh),window.__rootwake={scene:Ie,camera:fe,renderer:Le,player:se,voxels:Ae,patches:xe,objects:li,hands:be,vitality:Ee,dayCycle:Un,world:nn,cameraRig:de,boardView:je};const t=Math.min(.1,(i-Rl)/1e3);if(jt+=t*1e3/Tr,Rl=i,de.mode==="free"){const s=Ae.flatMap(o=>o.collider()??[]);se.update(i,s,nn.isWalkable),se.applyCamera(fe);const r=mx();Nh(Ba+fx*r),fe.position.y-=px*r}Ee.update(jt),Zv(),Un.advance(t*1e3/Tr),Un.apply(Ee.effects(jt).vision),Qv();const e=Ee.effects(jt);if(se.fanScale=(be.dragging?ev:1)*e.fanScale,se.moveSlowdown=be.dragging?nv:1,se.canMove=!be.straining,se.enabled=de.mode==="free"&&!Ee.busy,be.update(jt),be.notice&&(us.textContent=be.notice,be.notice=null,Pi=jt+1200),de.update(jt),fe.position.sub(sr),sr.set(0,0,0),jt<wr){const s=(wr-jt)/za;sr.set((Math.random()-.5)*2,(Math.random()-.5)*2,0).multiplyScalar(sx*s*s),fe.position.add(sr)}for(const s of xe)s.status==="resolved"||s.status==="resolving"||s.status==="planted"||s.setBlocked(li.overlapsSquare(s.center.x,s.center.z,s.footprintHalf).length>0);dr!==null&&jt>=dr&&(dr=null,de.unlock(jt,Uh())),Pi&&jt>=Pi&&(Pi=0,us.textContent=Ih[de.mode]);const n=de.lockedness();for(const s of Ae){const r=ue&&s!==ue&&hx(s,ue)?1-n:1;s.setFade(r)}for(const s of si)s.update(jt);ue&&ue.status!=="growing"&&je.hide(),je.update(jt),Rh.update(jt),Le.render(Ie,fe)}requestAnimationFrame(Fh);window.__rootwake={scene:Ie,camera:fe,renderer:Le,player:se,voxels:Ae,patches:xe,objects:li,hands:be,vitality:Ee,dayCycle:Un,world:nn,cameraRig:de,boardView:je};
