const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/huldaModel-CGEW33qo.js","assets/huldaPresentation-D5nzOwQm.js","assets/mobilityControls-shg0xTkk.js","assets/huldaCharacter-BVQmYY9t.js","assets/BufferGeometryUtils-CGxKLXh6.js"])))=>i.map(i=>d[i]);
import{b as Ue,ak as $t,s as at,K as Le,al as ze,am as Xe,$ as ue,an as Ye,ao as Qe,ap as jt,aq as Yt,j as me,V as H,r as Qt,d as Xt,ar as Kt,as as Zt,at as qt,X as Jt,au as ea,av as ta,A as Rt,aw as aa,ax as oa,a1 as St,a9 as sa,ay as ia,az as ra,aA as na,aB as la,aC as ua,aD as ca,D as zt,G as ft,J as ha,k as fa,P as da,I as Ct,o as dt,Q as mt,p as Bt,aE as Tt,aF as ma,m as lt,z as At,n as Dt,q as _t,t as pt,aG as pa,aH as va,S as ga,e as xa,W as wa,aI as ba,H as Ma,f as ya,h as Sa,i as za,ad as Ca,aJ as Ta}from"./mobilityControls-shg0xTkk.js";import{c as Aa,_ as _a,H as Pa}from"./huldaPresentation-D5nzOwQm.js";import{m as qe,a as vt}from"./BufferGeometryUtils-CGxKLXh6.js";import"./huldaCharacter-BVQmYY9t.js";const Ht={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Ve{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ka=new $t(-1,1,1,-1,0,1);class Fa extends at{constructor(){super(),this.setAttribute("position",new Le([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Le([0,2,0,0,2,0],2))}}const Ea=new Fa;class gt{constructor(e){this._mesh=new Ue(Ea,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ka)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class It extends Ve{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ze?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Xe.clone(e.uniforms),this.material=new ze({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new gt(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Pt extends Ve{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){const o=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let i,l;this.inverse?(i=0,l=1):(i=1,l=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),s.buffers.stencil.setFunc(o.ALWAYS,i,4294967295),s.buffers.stencil.setClear(l),s.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(o.EQUAL,1,4294967295),s.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),s.buffers.stencil.setLocked(!0)}}class Ra extends Ve{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ba{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const r=e.getSize(new ue);this._width=r.width,this._height=r.height,t=new Ye(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qe}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new It(Ht),this.copyPass.material.blending=jt,this.clock=new Yt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let r=!1;for(let o=0,s=this.passes.length;o<s;o++){const i=this.passes[o];if(i.enabled!==!1){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),i.needsSwap){if(r){const l=this.renderer.getContext(),d=this.renderer.state.buffers.stencil;d.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),d.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}Pt!==void 0&&(i instanceof Pt?r=!0:i instanceof Ra&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const r=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(r,o),this.renderTarget2.setSize(r,o);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(r,o)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Da extends Ve{constructor(e,t,r=null,o=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=o,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new me}render(e,t,r){const o=e.autoClear;e.autoClear=!1;let s,i;this.overrideMaterial!==null&&(i=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=i),e.autoClear=o}}const Ha={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new me(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ge extends Ve{constructor(e,t,r,o){super(),this.strength=t!==void 0?t:1,this.radius=r,this.threshold=o,this.resolution=e!==void 0?new ue(e.x,e.y):new ue(256,256),this.clearColor=new me(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),i=Math.round(this.resolution.y/2);this.renderTargetBright=new Ye(s,i,{type:Qe}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const c=new Ye(s,i,{type:Qe});c.texture.name="UnrealBloomPass.h"+f,c.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(c);const g=new Ye(s,i,{type:Qe});g.texture.name="UnrealBloomPass.v"+f,g.texture.generateMipmaps=!1,this.renderTargetsVertical.push(g),s=Math.round(s/2),i=Math.round(i/2)}const l=Ha;this.highPassUniforms=Xe.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ze({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const d=[3,5,7,9,11];s=Math.round(this.resolution.x/2),i=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(d[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new ue(1/s,1/i),s=Math.round(s/2),i=Math.round(i/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=Ht;this.copyUniforms=Xe.clone(u.uniforms),this.blendMaterial=new ze({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Qt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new me,this.oldClearAlpha=1,this.basic=new Xt,this.fsQuad=new gt(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let r=Math.round(e/2),o=Math.round(t/2);this.renderTargetBright.setSize(r,o);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(r,o),this.renderTargetsVertical[s].setSize(r,o),this.separableBlurMaterials[s].uniforms.invSize.value=new ue(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2)}render(e,t,r,o,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const i=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=r.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let l=this.renderTargetBright;for(let d=0;d<this.nMips;d++)this.fsQuad.material=this.separableBlurMaterials[d],this.separableBlurMaterials[d].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[d].uniforms.direction.value=Ge.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[d]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[d].uniforms.colorTexture.value=this.renderTargetsHorizontal[d].texture,this.separableBlurMaterials[d].uniforms.direction.value=Ge.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[d]),e.clear(),this.fsQuad.render(e),l=this.renderTargetsVertical[d];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(r),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=i}getSeperableBlurMaterial(e){const t=[];for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(e*e))/e);return new ze({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ue(.5,.5)},direction:{value:new ue(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new ze({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Ge.BlurDirectionX=new ue(1,0);Ge.BlurDirectionY=new ue(0,1);const Ia={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Na extends Ve{constructor(){super();const e=Ia;this.uniforms=Xe.clone(e.uniforms),this.material=new Kt({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new gt(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,r){this.uniforms.tDiffuse.value=r.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Zt.getTransfer(this._outputColorSpace)===qt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Jt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ea?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ta?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Rt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===aa?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===oa&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Re=2048,p=513,V=Re/(p-1),F=Re/2,ce=40,Nt=300,Ua=200;function Ce(a){let e=a>>>0||1;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function ot(a){const e=Ce(a),t=new Uint8Array(512),r=[...Array(256).keys()];for(let l=255;l>0;l--){const d=Math.floor(e()*(l+1));[r[l],r[d]]=[r[d],r[l]]}for(let l=0;l<512;l++)t[l]=r[l&255];const o=new Float32Array(256),s=new Float32Array(256);for(let l=0;l<256;l++){const d=e()*Math.PI*2;o[l]=Math.cos(d),s[l]=Math.sin(d)}const i=l=>l*l*l*(l*(l*6-15)+10);return(l,d)=>{const h=Math.floor(l),u=Math.floor(d),f=l-h,c=d-u,g=h&255,w=u&255,M=(A,D,S,I)=>{const j=t[A+t[D]];return o[j]*S+s[j]*I},C=M(g,w,f,c),T=M(g+1,w,f-1,c),k=M(g,w+1,f,c-1),R=M(g+1,w+1,f-1,c-1),$=i(f),E=i(c);return 1.41*((C+(T-C)*$)*(1-E)+(k+(R-k)*$)*E)}}function We(a,e,t,r,o=2,s=.5){let i=0,l=1,d=1,h=0;for(let u=0;u<r;u++)i+=a(e*d+u*17.3,t*d-u*9.1)*l,h+=l,l*=s,d*=o;return i/h}function Wa(a,e,t,r){let o=0,s=.5,i=1,l=1,d=0;for(let h=0;h<r;h++){let u=1-Math.abs(a(e*i+h*31.7,t*i+h*11.3));u*=u,u*=l,l=Math.min(1,u*1.6),o+=u*s,d+=s,s*=.5,i*=2.05}return o/d}const Oe=(a,e,t)=>{const r=Math.min(1,Math.max(0,(t-a)/(e-a)));return r*r*(3-2*r)},_e={x:0,z:260,rx:230,rz:380};function st(a){return 170*Math.sin(a*.0019+.6)+60*Math.sin(a*.0051)}function La(a){const e=ot(a*7+1),t=ot(a*7+2),r=ot(a*7+3);return{base:(s,i)=>{const l=s+140*We(t,s*.0011,i*.0011,3),d=i+140*We(t,s*.0011+40,i*.0011-30,3),h=Math.abs(l-st(d)),u=Oe(110,760,h+90*We(r,s*.002,i*.002,2)),f=Wa(e,l*.0016,d*.0016,6),c=We(r,s*.004,i*.004,4)*16+We(r,s*.012,i*.012,3)*4,g=Math.exp(-(((s-st(i)*.4-_e.x)/_e.rx)**2+((i-_e.z)/_e.rz)**2));return ce+7+Math.max(0,(Math.abs(i)-500)*.02)+c*(1-u)+u**1.25*(80+520*f)+u*c*3-g*26},seed:a}}const Ga={droplets:7e4,steps:64,radius:2,inertia:.06,capacity:6,minSlope:.01,erode:.35,deposit:.25,evaporate:.018,gravity:6,scale:20};function Oa(a=1,e={}){const t=Je(),r=La(a),o=new Float32Array(p*p);for(let c=0;c<p;c++)for(let g=0;g<p;g++)o[c*p+g]=r.base(g*V-F,c*V-F);const s=Je(),i=new Float32Array(p*p),l=new Float32Array(p*p);Va(o,i,l,a,{...Ga,...e});let d=0;for(let c=0;c<i.length;c++)i[c]=Math.log1p(i[c]),i[c]>d&&(d=i[c]);for(let c=0;c<i.length;c++)i[c]/=d||1;kt(i,1),kt(l,1);let h=0;for(const c of l)h=Math.max(h,c);for(let c=0;c<l.length;c++)l[c]=Math.min(1,l[c]/(h*.25||1));const u=Je(),f=$a(o);return{seed:a,shape:r,h:o,flow:i,sediment:l,ao:f,ms:{shape:s-t,erosion:u-s,ao:Je()-u}}}function Je(){return typeof performance<"u"?performance.now():Date.now()}function Va(a,e,t,r,o){const s=Ce(r*131+7),i=o.scale,l=o.radius,d=[],h=[];let u=0;for(let w=-l;w<=l;w++)for(let M=-l;M<=l;M++){const C=Math.hypot(M,w);if(C<=l){d.push(M,w);const T=1-C/l;h.push(T),u+=T}}for(let w=0;w<h.length;w++)h[w]/=u;const f=Ua/V,c=(w,M)=>Oe(0,f,Math.min(w,M,p-1-w,p-1-M)-l),g=w=>a[w]/i;for(let w=0;w<o.droplets;w++){let M=s()*(p-3)+1,C=s()*(p-3)+1,T=0,k=0,R=1,$=1,E=0;for(let A=0;A<o.steps;A++){const D=Math.floor(M),S=Math.floor(C),I=M-D,j=C-S,Y=S*p+D,Z=g(Y),Te=g(Y+1),he=g(Y+p),pe=g(Y+p+1),Pe=(Te-Z)*(1-j)+(pe-he)*j,Ae=(he-Z)*(1-I)+(pe-Te)*I,ve=Z*(1-I)*(1-j)+Te*I*(1-j)+he*(1-I)*j+pe*I*j;T=T*o.inertia-Pe*(1-o.inertia),k=k*o.inertia-Ae*(1-o.inertia);const be=Math.hypot(T,k);if(be<1e-9||(T/=be,k/=be,M+=T,C+=k,M<1||C<1||M>=p-2||C>=p-2))break;const ee=Math.floor(M),re=Math.floor(C),ae=M-ee,de=C-re,ge=re*p+ee,te=g(ge)*(1-ae)*(1-de)+g(ge+1)*ae*(1-de)+g(ge+p)*(1-ae)*de+g(ge+p+1)*ae*de-ve,xe=c(D,S);e[Y]+=$;const fe=Math.max(-te,o.minSlope)*R*$*o.capacity;if(E>fe||te>0){const oe=te>0?Math.min(te,E):(E-fe)*o.deposit;E-=oe;const Q=oe*i*xe;a[Y]+=Q*(1-I)*(1-j),a[Y+1]+=Q*I*(1-j),a[Y+p]+=Q*(1-I)*j,a[Y+p+1]+=Q*I*j,t[Y]+=oe*xe}else{const oe=Math.min((fe-E)*o.erode,-te);for(let Q=0;Q<h.length;Q++){const Me=D+d[Q*2],ye=S+d[Q*2+1];if(Me<0||ye<0||Me>=p||ye>=p)continue;const q=ye*p+Me,ke=Math.min(oe*h[Q],a[q]/i)*xe;a[q]-=ke*i}E+=oe*xe}R=Math.sqrt(Math.max(0,R*R-te*o.gravity)),$*=1-o.evaporate}}}function kt(a,e){const t=new Float32Array(a.length);for(let r=0;r<e;r++){for(let o=0;o<p;o++)for(let s=0;s<p;s++){const i=o*p+s;t[i]=(a[i]*2+a[o*p+Math.max(0,s-1)]+a[o*p+Math.min(p-1,s+1)])/4}for(let o=0;o<p;o++)for(let s=0;s<p;s++){const i=o*p+s;a[i]=(t[i]*2+t[Math.max(0,o-1)*p+s]+t[Math.min(p-1,o+1)*p+s])/4}}}function $a(a){const e=new Float32Array(p*p),t=[2,6,16],r=8;for(let o=0;o<p;o++)for(let s=0;s<p;s++){const i=o*p+s;let l=0;for(const d of t){let h=0;for(let u=0;u<r;u++){const f=u/r*Math.PI*2,c=Math.min(p-1,Math.max(0,Math.round(s+Math.cos(f)*d))),g=Math.min(p-1,Math.max(0,Math.round(o+Math.sin(f)*d)));h+=Math.max(0,a[g*p+c]-a[i])/(d*V)}l+=h/r}e[i]=Math.max(0,1-l*.9)}return e}function ie(a,e,t){const r=(e+F)/V,o=(t+F)/V;if(r<0||o<0||r>=p-1||o>=p-1)return a.shape.base(e,t);const s=Math.floor(r),i=Math.floor(o),l=r-s,d=o-i,h=i*p+s,u=a.h;return u[h]*(1-l)*(1-d)+u[h+1]*l*(1-d)+u[h+p]*(1-l)*d+u[h+p+1]*l*d}function Ut(a,e,t,r){const o=Math.min(p-1,Math.max(0,Math.round((t+F)/V))),s=Math.min(p-1,Math.max(0,Math.round((r+F)/V)));return e[s*p+o]}function Wt(a,e,t,r=V){const o=ie(a,e+r,t)-ie(a,e-r,t),s=ie(a,e,t+r)-ie(a,e,t-r),i=-o,l=2*r,d=-s,h=Math.hypot(i,l,d);return[i/h,l/h,d/h]}function it(a,e,t){return 1-Wt(a,e,t)[1]}function ja(a,e,t=new Uint8Array(p*p)){const[r,o,s]=e,i=Math.hypot(r,s)||1e-6,l=o/i,d=r/i,h=s/i,u=a.h;if(o<=0)return t.fill(0),t;for(let f=0;f<p;f++)for(let c=0;c<p;c++){const g=u[f*p+c]+.5;let w=1,M=V*.75;for(let C=0;C<120&&w>0;C++){const T=c+d*M/V,k=f+h*M/V;if(T<0||k<0||T>=p-1||k>=p-1)break;const R=T|0,$=k|0,E=T-R,A=k-$,D=$*p+R,S=u[D]*(1-E)*(1-A)+u[D+1]*E*(1-A)+u[D+p]*(1-E)*A+u[D+p+1]*E*A,I=g+M*l;if(w=Math.min(w,(I-S)/(1.5+M*.02)*.5+.5),I>700)break;M+=Math.max(V*.75,M*.06)}t[f*p+c]=Math.round(Math.min(1,Math.max(0,w))*255)}return t}const et=7,Ft=150;function Ya(a,e=9e3){const t=Ce(a.seed*977+3),r=ot(a.seed*13+5),o=[];for(let s=-F+20;s<F-20;s+=et)for(let i=-F+20;i<F-20;i+=et){const l=i+(t()-.5)*et*.9,d=s+(t()-.5)*et*.9,h=ie(a,l,d);if(h<ce+2.5||h>Nt-30)continue;const u=it(a,l,d);if(u>.22)continue;const f=We(r,l*.0045,d*.0045,4)+.2*Ut(a,a.flow,l,d)-(h>Ft?0:.06),c=Oe(.02,.32,f)*(1-Oe(.12,.22,u));if(t()>c*.95+(t()<.004?1:0))continue;const g=h>Ft+(t()-.5)*60||f>.3&&t()<.25;if(o.push({x:l,z:d,y:h,kind:g?3+Math.floor(t()*2):Math.floor(t()*3),scale:.75+t()*.55,rot:t()*Math.PI*2}),o.length>=e)return o}return o}function Qa(a,e=900){const t=Ce(a.seed*389+11),r=[];for(let o=0;o<e*30&&r.length<e;o++){const s=(t()-.5)*(Re-60),i=(t()-.5)*(Re-60),l=ie(a,s,i),d=it(a,s,i);if(l<ce-1.5)continue;const h=Ut(a,a.sediment,s,i),u=.02+.5*Oe(.1,.35,d)*(1-Oe(.5,.7,d))+.4*h;t()>u||r.push({x:s,z:i,y:l,scale:.4+t()**3*4.5,rot:t()*Math.PI*2,tilt:(t()-.5)*.5})}return r}function Xa(a,e,t,r,o,s,i){const l=Math.hypot(o-e,i-r),d=Math.ceil(l/(V*2));for(let h=2;h<d-2;h++){const u=h/d;if(ie(a,e+(o-e)*u,r+(i-r)*u)>t+(s-t)*u)return!1}return!0}const tt=(a,e,t,r)=>Math.atan2(-(t-a),-(r-e));function Ka(a){const e={x:_e.x+st(_e.z)*.4,z:_e.z},t=[];let r={x:0,z:0,y:-1/0};for(let u=-F+120;u<F-120;u+=16)for(let f=-F+120;f<F-120;f+=16){const c=ie(a,f,u);c>r.y&&(r={x:f,z:u,y:c})}const o=u=>{let f={x:0,z:0},c=-1/0;for(let g=-F+140;g<F-140;g+=12)for(let w=-F+140;w<F-140;w+=12){const M=u(w,g,ie(a,w,g));M>c&&(c=M,f={x:w,z:g})}return f},s=(u,f)=>{if(it(a,u,f)>.12)return!1;const c=ie(a,u,f);return[[.3,0],[-.3,0],[0,.3],[0,-.3]].every(([g,w])=>Math.abs(ie(a,u+g,f+w)-c)<.15)},i=o((u,f,c)=>c<ce+.6||c>ce+3||!s(u,f)?-1/0:-Math.abs(Math.hypot(u-e.x,f-e.z)-260)+(Math.hypot(u-r.x,f-r.z)>Math.hypot(e.x-r.x,e.z-r.z)?120:0));t.push({name:"Lakeshore",...i,yaw:tt(i.x,i.z,e.x,e.z),pitch:.02});const l=o((u,f,c)=>!s(u,f)||c<ce+3||Math.abs(u-st(f))>120?-1/0:-Math.abs(f-(_e.z-900))-it(a,u,f)*400);t.push({name:"Valley meadow",...l,yaw:tt(l.x,l.z,e.x,e.z),pitch:.04});const d=o((u,f,c)=>{if(c<ce+140||c>ce+280||!s(u,f))return-1/0;const g=Math.hypot(u-e.x,f-e.z);return g<450||g>900?-1/0:Xa(a,u,c+2,f,e.x,ce,e.z)?1e3-g:-1/0});t.push({name:"Ridge over the lake",...d,yaw:tt(d.x,d.z,e.x,e.z),pitch:-.12});const h=o((u,f,c)=>s(u,f)?c:-1/0);return t.push({name:"Summit",...h,yaw:tt(h.x,h.z,e.x,e.z),pitch:-.1}),t}const Be=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,$e=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uZenith; uniform vec3 uHorizon;
uniform vec3 uAmbSky; uniform vec3 uAmbGround; uniform float uHaze; uniform float uHazeFall; uniform float uHazeBase; uniform float uTime;
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
  return mix(col, hc, clamp(amount, 0.0, 1.0));
}
/** The cel light: a soft terminator, sun only on the lit side, blue sky ambient everywhere. */
vec3 toon(vec3 albedo, vec3 n, float vis, float ao){
  float ndl = dot(n, uSunDir);
  float lit = smoothstep(-0.03, 0.22, ndl) * (0.72 + 0.28 * clamp(ndl, 0.0, 1.0)) * vis;
  vec3 amb = mix(uAmbGround, uAmbSky, n.y * 0.5 + 0.5) * ao;
  return albedo * (amb + uSunCol * lit);
}
`,rt=`
uniform sampler2D uMapData; uniform highp sampler2D uHeight; uniform float uMapHalf; uniform float uCell; uniform float uN; uniform float uWaterY; uniform float uSnowY;
vec2 mapUV(vec2 xz){ return ((xz + uMapHalf) / uCell + 0.5) / uN; }
bool onMap(vec2 xz){ vec2 f = (xz + uMapHalf) / uCell; return f.x >= 0.0 && f.y >= 0.0 && f.x <= uN - 1.0 && f.y <= uN - 1.0; }
vec4 mapData(vec2 xz){ return onMap(xz) ? texture2D(uMapData, mapUV(xz)) : vec4(1.0, 1.0, 0.0, 0.0); }
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
`,xt=`
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
  return col;
}
`,wt=`
#include <common>
#include <shadowmap_pars_vertex>
`,bt=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Ke=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,Za=`
${wt}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,qa=`
${bt}
${Be}${$e}${rt}${xt}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec3 n = normalize(vNormal);
  // A painterly bump: the normal leans with two scales of noise, so flat ground is not flat-lit.
  vec2 p = vWorld.xz; float e = 0.6;
  float b0 = fbm3(p * 0.45), bx = fbm3((p + vec2(e, 0.0)) * 0.45), bz = fbm3((p + vec2(0.0, e)) * 0.45);
  n = normalize(n + vec3(b0 - bx, 0.0, b0 - bz) * 0.9);
  vec4 md = mapData(p);
  float g; vec3 albedo = terrainAlbedo(vWorld, n, md, g);
  float vis = min(md.r, getShadowMask());
  vec3 col = toon(albedo, n, vis, mix(0.55, 1.0, md.g));
  gl_FragColor = vec4(applyHaze(col, vWorld), 1.0);
  ${Ke}
}`,Ja=`
${wt}
${Be}${$e}${rt}${xt}
attribute vec4 aBlade; // x, z in the patch; size; rotation
attribute vec4 aTuft; // the blade within its tuft: angle, offset x, offset z, height
uniform vec2 uCenter; uniform float uPatch; uniform float uBladeH; uniform float uBladeW; uniform vec2 uWind;
varying vec3 vWorld; varying vec3 vCol; varying vec3 vN; varying float vY; varying float vGust; varying vec2 vMd;
void main(){
  vec2 rel = mod(aBlade.xy - uCenter + 0.5 * uPatch, uPatch) - 0.5 * uPatch, xz = uCenter + rel;
  float dist = length(rel);
  vec4 md = mapData(xz); vec3 n; float h = heightNormalAt(xz, n), g;
  vec3 base = terrainAlbedo(vec3(xz.x, h, xz.y), n, md, g);
  float fade = 1.0 - smoothstep(uPatch * 0.3, uPatch * 0.5, dist);
  float hgt = uBladeH * (0.45 + 0.55 * aBlade.z) * smoothstep(0.3, 0.7, g) * fade * (1.0 + md.b * 0.8) * (0.7 + 0.6 * vnoise(xz * 0.08));
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
}`,eo=`
${bt}
${Be}${$e}
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
  ${Ke}
}`,to=`
${wt}
${Be}
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
}`,ao=`
${bt}
${Be}${$e}${rt}
#ifdef ROCK
${xt}
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
  ${Ke}
}`,oo=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,so=`
${Be}${$e}${rt}
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
  ${Ke}
}`,io=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,ro=`
${Be}${$e}
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
  gl_FragColor = vec4(col, 1.0);
  ${Ke}
}`,je=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function Lt(a){const e=_t.degToRad(a.elevation),t=_t.degToRad(a.azimuth);return new H(Math.sin(t)*Math.cos(e),Math.sin(e),-Math.cos(t)*Math.cos(e)).normalize()}const Ie=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],Ne=(a,e=1)=>new me(a).multiplyScalar(e),Gt=1;function no(a,e,t,r,o){const s=new Uint8Array(p*p*4),i=new Uint8Array(p*p);for(let n=0;n<p*p;n++)s[n*4+1]=Math.round(e.ao[n]*255),s[n*4+2]=Math.round(e.flow[n]*255),s[n*4+3]=Math.round(e.sediment[n]*255);const l=new St(s,p,p,sa,ia);l.magFilter=l.minFilter=ra,l.wrapS=l.wrapT=na;const d=new St(new Float32Array(e.h),p,p,la,ua);d.magFilter=d.minFilter=ca,d.needsUpdate=!0;const h={uSunDir:{value:new H(0,1,0)},uSunCol:{value:new me},uZenith:{value:new me},uHorizon:{value:new me},uAmbSky:{value:new me},uAmbGround:{value:new me},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:ce},uTime:{value:0},uMapData:{value:l},uHeight:{value:d},uMapHalf:{value:F},uCell:{value:V},uN:{value:p},uWaterY:{value:ce},uSnowY:{value:Nt}},u=(n,m,v={},b={})=>{const _={...Xe.merge([ma.lights]),...h,...v};return new ze({uniforms:_,vertexShader:n,fragmentShader:m,lights:!0,defines:b})},f=128,c=f/V,g=Re/f,w=[1,2,4,8],M=u(Za,qa);M.side=zt;const C=new ft;C.name="terrain",a.add(C);const T=[];function k(n,m,v){const b=c/v,_=n*f-F,z=m*f-F,W=v*V,L=4+v*3,se=(b+1)*(b+1),P=new Float32Array((se+4*b)*3),G=new Float32Array((se+4*b)*3),J=[];for(let y=0;y<=b;y++)for(let U=0;U<=b;U++){const B=_+U*W,ne=z+y*W,K=(y*(b+1)+U)*3,Fe=Wt(e,B,ne,Math.max(V,W*.75));P[K]=B,P[K+1]=ie(e,B,ne),P[K+2]=ne,G[K]=Fe[0],G[K+1]=Fe[1],G[K+2]=Fe[2]}for(let y=0;y<b;y++)for(let U=0;U<b;U++){const B=y*(b+1)+U,ne=B+1,K=B+b+1,Fe=K+1;J.push(B,K,ne,ne,K,Fe)}const N=[];for(let y=0;y<b;y++)N.push(y);for(let y=0;y<b;y++)N.push(y*(b+1)+b);for(let y=b;y>0;y--)N.push(b*(b+1)+y);for(let y=b;y>0;y--)N.push(y*(b+1));N.forEach((y,U)=>{const B=(se+U)*3;P[B]=P[y*3],P[B+1]=P[y*3+1]-L,P[B+2]=P[y*3+2],G[B]=G[y*3],G[B+1]=G[y*3+1],G[B+2]=G[y*3+2]});for(let y=0;y<N.length;y++){const U=N[y],B=N[(y+1)%N.length],ne=se+y,K=se+(y+1)%N.length;J.push(U,ne,B,B,ne,K)}const X=new at;return X.setAttribute("position",new pt(P,3)),X.setAttribute("normal",new pt(G,3)),X.setIndex(J),X.computeBoundingSphere(),X}for(let n=0;n<g;n++)for(let m=0;m<g;m++){const v={mesh:new Ue(void 0,M),lod:-1,geos:[],cx:(m+.5)*f-F,cz:(n+.5)*f-F};v.mesh.receiveShadow=!0,v.mesh.matrixAutoUpdate=!1,v.mesh.userData={ti:m,tj:n},C.add(v.mesh),T.push(v)}function R(n){var _;const[m,v,b]=we.lod;for(const z of T){const W=Math.max(0,Math.hypot(z.cx-n.x,z.cz-n.z)-f*.7),L=W<m?0:W<v?1:W<b?2:3;L!==z.lod&&(z.lod=L,(_=z.geos)[L]??(_[L]=k(z.mesh.userData.ti,z.mesh.userData.tj,w[L])),z.mesh.geometry=z.geos[L],L>=2&&z.geos[0]&&(z.geos[0].dispose(),z.geos[0]=void 0))}}{const v=Math.round(175),b=[],_=[],z=[],W=F-80,L=new Int32Array((v+1)*(v+1)).fill(-1),se=(N,X)=>{const y=-7e3+N*80,U=-7e3+X*80;return!(y>=-W&&y+80<=W&&U>=-W&&U+80<=W)},P=(N,X)=>{const y=X*(v+1)+N;if(L[y]>=0)return L[y];const U=-7e3+N*80,B=-7e3+X*80,ne=Math.abs(U)<=F&&Math.abs(B)<=F,K=(Ot,Vt)=>e.shape.base(Ot,Vt),Fe=K(U,B)-(ne?6:0),He=80,Mt=-(K(U+He,B)-K(U-He,B)),yt=-(K(U,B+He)-K(U,B-He)),nt=Math.hypot(Mt,2*He,yt);return L[y]=b.length/3,b.push(U,Fe,B),_.push(Mt/nt,2*He/nt,yt/nt),L[y]};for(let N=0;N<v;N++)for(let X=0;X<v;X++)if(se(X,N)){const y=P(X,N),U=P(X+1,N),B=P(X,N+1),ne=P(X+1,N+1);z.push(y,B,U,U,B,ne)}const G=new at;G.setAttribute("position",new Le(b,3)),G.setAttribute("normal",new Le(_,3)),G.setIndex(z),G.computeBoundingSphere();const J=new Ue(G,M);J.name="far-ring",J.frustumCulled=!1,a.add(J)}const $=new ze({uniforms:{...h,uCloud:{value:.5}},vertexShader:io,fragmentShader:ro,side:ha,depthWrite:!1}),E=new Ue(new fa(8e3,48,24),$);E.name="sky",E.frustumCulled=!1,E.renderOrder=-10,a.add(E);const A=new ze({uniforms:{...h},vertexShader:oo,fragmentShader:so,transparent:!0,depthWrite:!1}),D=new da(Re,Re,8,8);D.rotateX(-Math.PI/2);const S=new Ue(D,A);S.position.y=ce,S.name="lake",a.add(S);const I=u(Ja,eo,{uCenter:{value:new ue},uPatch:{value:60},uBladeH:{value:.34},uBladeW:{value:.045},uWind:{value:new ue(.94,.34)}});I.side=zt;const j=3,Y=new at;{const n=[],m=[],v=[],b=Ce(3);for(let _=0;_<j;_++){const z=_/j*Math.PI*2+b()*.6,W=(b()-.5)*.12,L=(b()-.5)*.12,se=.65+b()*.55,P=n.length/3;for(const[G,J]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])n.push(G,J,0),m.push(z,W,L,se);v.push(P,P+1,P+2,P+2,P+1,P+3,P+2,P+3,P+4,P+4,P+3,P+5,P+4,P+5,P+6)}Y.setAttribute("position",new Le(n,3)),Y.setAttribute("aTuft",new Le(m,4)),Y.setIndex(v)}let Z=null;function Te(n,m){if(Z&&(Z.geometry.dispose(),a.remove(Z),Z=null),!n)return;const v=new pa;v.index=Y.index,v.setAttribute("position",Y.getAttribute("position")),v.setAttribute("aTuft",Y.getAttribute("aTuft"));const b=Ce(77),_=new Float32Array(n*4);for(let z=0;z<n;z++)_[z*4]=b()*m,_[z*4+1]=b()*m,_[z*4+2]=b(),_[z*4+3]=b()*Math.PI*2;v.setAttribute("aBlade",new va(_,4)),v.instanceCount=n,Z=new Ue(v,I),Z.frustumCulled=!1,Z.receiveShadow=!0,Z.name="grass",a.add(Z),I.uniforms.uPatch.value=m}const he=(n,m)=>u(to,ao,{uColor:{value:n?Ne(n):new me}},m),pe=he("#8a7058",{}),Pe=he(null,{ROCK:""}),Ae=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440"],ve=Ae.map(n=>he(n,{USE_SWAY:""})),be=Ae.map(n=>he(n,{})),ee=[0,1,2,3,4].map(n=>lo(n)),re=ee.map((n,m)=>t.filter(v=>v.kind===m)),ae=(n,m,v,b)=>{const _=new Ct(n,m,Math.max(1,v));return _.count=0,_.frustumCulled=!1,_.castShadow=b,_.receiveShadow=!0,_.instanceMatrix.setUsage(Tt),a.add(_),_},de=ee.map((n,m)=>ae(n.trunk,pe,re[m].length,!1)),ge=ee.map((n,m)=>ae(n.crown,ve[m],re[m].length,!1)),De=ee.flatMap((n,m)=>[ae(n.trunk,pe,re[m].length,!0),ae(n.crown,ve[m],re[m].length,!0)]);for(const n of De)n.layers.set(Gt);const te=ee.map((n,m)=>ae(n.far,be[m],re[m].length,!1)),xe=(n,m)=>m.compose(new H(n.x,n.y-.15,n.z),new mt().setFromAxisAngle(new H(0,1,0),n.rot),new H(n.scale,n.scale,n.scale));let fe=new H(1e9,0,0),oe=0,Q=[];function Me(n){const m=new dt,v=we.nearTrees**2,b=(we.shadow?we.shadowBox*1.6+15:0)**2;Q=[],oe=0,re.forEach((_,z)=>{let W=0,L=0,se=0;const[P,G]=[De[z*2],De[z*2+1]];for(const J of _){xe(J,m);const N=(J.x-n.x)**2+(J.z-n.z)**2;N<v?(de[z].setMatrixAt(W,m),ge[z].setMatrixAt(W,m),W++,Q.push(J)):te[z].setMatrixAt(L++,m),N<b&&(P.setMatrixAt(se,m),G.setMatrixAt(se,m),se++)}de[z].count=ge[z].count=W,te[z].count=L,P.count=G.count=se,oe+=W;for(const J of[de[z],ge[z],te[z],P,G])J.instanceMatrix.needsUpdate=!0}),fe.copy(n)}const ye=650,q=new Ct(uo(),Pe,r.length),ke=r.map(n=>new dt().compose(new H(n.x,n.y-n.scale*.25,n.z),new mt().setFromEuler(new Bt(n.tilt,n.rot,n.tilt*.5)),new H(n.scale,n.scale*.7,n.scale*.9)));q.castShadow=!0,q.receiveShadow=!0,q.frustumCulled=!1,q.name="rocks",q.instanceMatrix.setUsage(Tt),a.add(q);function Ze(n){let m=0;r.forEach((v,b)=>{(v.x-n.x)**2+(v.z-n.z)**2<ye**2&&q.setMatrixAt(m++,ke[b])}),q.count=m,q.instanceMatrix.needsUpdate=!0}let we=o;function x(n){we=n,Te(we.grass,we.patch);for(const m of T)m.lod=-1;fe.set(1e9,0,0)}x(o);function O(n){const m=Lt(n);h.uSunDir.value.copy(m),h.uSunCol.value.copy(Ne(n.sun).multiplyScalar(n.sunI)),h.uZenith.value.copy(Ne(n.zenith)),h.uHorizon.value.copy(Ne(n.horizon)),h.uAmbSky.value.copy(Ne(n.ambSky).multiplyScalar(n.ambI)),h.uAmbGround.value.copy(Ne(n.ambGround).multiplyScalar(n.ambI)),h.uHaze.value=n.haze,h.uHazeFall.value=n.hazeFall,$.uniforms.uCloud.value=n.cloud,ja(e,[m.x,m.y,m.z],i);for(let v=0;v<p*p;v++)s[v*4]=i[v];l.needsUpdate=!0}return{setHour:O,setQuality:x,update(n,m){const v=n.position;h.uTime.value=m,E.position.copy(v),R(v),I.uniforms.uCenter.value.set(v.x,v.z),Math.hypot(v.x-fe.x,v.z-fe.z)>12&&(Me(v),Ze(v))},colliders(){return Q.map(n=>({x:n.x,z:n.z,radius:ee[n.kind].radius*n.scale,cameraClearance:ee[n.kind].radius*n.scale+.3}))},sunAt(n,m){const v=Math.round((n+F)/V),b=Math.round((m+F)/V);return v<0||b<0||v>=p||b>=p?1:i[b*p+v]/255},stats:()=>({tiles:T.length,nearTrees:oe})}}function Ee(a,e){const t=a;for(const i of Object.keys(t.attributes))i!=="position"&&i!=="normal"&&t.deleteAttribute(i);const r=t.getAttribute("position"),o=new Float32Array(r.count),s=new H;for(let i=0;i<r.count;i++)o[i]=e(s.fromBufferAttribute(r,i));return t.setAttribute("aShade",new pt(o,1)),t}function ut(a,e,t,r,o=1,s=1){let i=new Dt(a,o);i.deleteAttribute("uv"),i=vt(i);const l=i.getAttribute("position"),d=i.getAttribute("normal"),h=new H,u=Ce(r),f=Array.from({length:5},()=>new H(u()-.5,u()-.5,u()-.5).normalize());for(let c=0;c<l.count;c++){h.fromBufferAttribute(l,c);const g=h.clone().normalize();let w=1;for(const C of f)w+=Math.max(0,g.dot(C))**4*.22;h.copy(g).multiplyScalar(a*w),h.y*=s,h.add(e),l.setXYZ(c,h.x,h.y,h.z);const M=h.clone().sub(t).normalize().multiplyScalar(.7).add(g.multiplyScalar(.3)).normalize();d.setXYZ(c,M.x,M.y,M.z)}return i}function lo(a){const e=Ce(a*101+9);if(new H(0,1,0),a<3){const u=[8.5,10.5,7.5][a],f=u*.66,c=[2.6,2.1,3.2][a],g=[1.7,2.4,1.3][a],w=new lt(.16,.3,f,8,3);w.translate(0,f/2,0);const M=[0,1,2].map(A=>{const D=A/3*Math.PI*2+e(),S=new lt(.07,.13,c*1.1,6);return S.translate(0,c*.55,0),S.applyMatrix4(new dt().makeRotationFromEuler(new Bt(Math.cos(D)*.8,0,Math.sin(D)*.8))),S.translate(0,f*.8,0),S}),C=Ee(qe([w,...M].map(A=>(A.deleteAttribute("uv"),A))),A=>.55+.45*Math.min(1,A.y/f)),T=new H(0,f+g*.6,0),k=[],R=7+Math.floor(e()*3);for(let A=0;A<R;A++){const D=A/R*Math.PI*2+e()*.5,S=(e()-.35)*g,I=c*(.55+e()*.35);k.push(ut(1.5+e()*.9,new H(Math.cos(D)*I,T.y+S,Math.sin(D)*I),T,a*31+A))}k.push(ut(2.2,new H(0,T.y+g*.75,0),T,a*31+99));const $=Ee(qe(k),A=>{const D=A.clone().sub(T);return Math.min(1,.5+.35*(D.y/(g+2)+.6)+.25*Math.hypot(D.x,D.z)/(c+2))}),E=Ee(qe([ut(c+1.3,T.clone(),T.clone().setY(T.y-1),a+500,0,(g+2)/(c+1.3))]),A=>.6+.4*Math.min(1,Math.max(0,(A.y-T.y+2)/4)));return{trunk:C,crown:$,far:E,radius:.3}}const t=a===3?13:10,r=[],o=new lt(.1,.32,t*.9,7,2);o.translate(0,t*.45,0),o.deleteAttribute("uv");for(let u=0;u<5;u++){const f=u/5,c=(a===3?2.6:3)*(1-f*.78),g=t*.34*(1-f*.35),w=t*(.18+f*.62);let M=new At(c,g,11,2);M.deleteAttribute("uv"),M=vt(M);const C=M.getAttribute("position"),T=M.getAttribute("normal"),k=new H;for(let R=0;R<C.count;R++){k.fromBufferAttribute(C,R);const $=Math.hypot(k.x,k.z),E=1+.12*Math.sin(Math.atan2(k.z,k.x)*5+u*2);C.setXYZ(R,k.x*E,k.y+g/2+w-$/c*.5,k.z*E);const A=new H(k.x,c*.9,k.z).normalize();T.setXYZ(R,A.x,A.y,A.z)}r.push(M)}const s=Ee(qe(r),u=>.5+.5*Math.min(1,Math.hypot(u.x,u.z)/2.2*.6+u.y/t*.5));let i=new At(a===3?2.6:3,t*.9,6,1);i.deleteAttribute("uv"),i.translate(0,t*.55,0);const l=i.getAttribute("position"),d=i.getAttribute("normal"),h=new H;for(let u=0;u<l.count;u++){h.fromBufferAttribute(l,u);const f=new H(h.x,1.6,h.z).normalize();d.setXYZ(u,f.x,f.y,f.z)}return i=Ee(i,u=>.55+.45*Math.min(1,u.y/t)),{trunk:Ee(o,u=>.5+.5*Math.min(1,u.y/t)),crown:s,far:i,radius:.3}}function uo(){let a=new Dt(1,1);a.deleteAttribute("uv"),a=vt(a);const e=a.getAttribute("position"),t=new H,r=Ce(5);for(let o=0;o<e.count;o++)t.fromBufferAttribute(e,o),t.multiplyScalar(.8+r()*.35),e.setXYZ(o,t.x,t.y,t.z);return a=a.toNonIndexed(),a.computeVertexNormals(),Ee(a,o=>.55+.45*Math.min(1,Math.max(0,o.y+.6)))}var co=["models/clips/idle.fbx","models/clips/running.fbx","models/clips/walking.fbx"];const Se=new URLSearchParams(location.search),le=a=>document.getElementById(a),ho=()=>new Promise(a=>requestAnimationFrame(()=>setTimeout(a,0)));async function ct(a){le("load-step").textContent=a,await ho()}const Et={saturation:1.12,vignette:.55},ht={strength:.4,radius:.5,threshold:2.4},fo=1e3/28,mo=1e3/50,po=1.5;async function vo(){var we;const a=Number(Se.get("seed")??1)||1;await ct("Raising the land and letting the rain run over it…");const e=Oa(a);await ct("Seeding the forest…");const t=Ya(e),r=Qa(e),o=Ka(e);await ct("Lighting the valley…");const s=matchMedia("(pointer: coarse)").matches,i=(Se.get("q")??"").toLowerCase();let l=Ie.find(x=>x.name.toLowerCase()===i)??Ie[s?1:2],d=Math.min(je.length-1,Math.max(0,Number(Se.get("hour")??2)||0)),h=je[d];const u=new ga,f=new xa(60,innerWidth/innerHeight,.15,9e3);u.add(f);const c=new wa({antialias:!0,powerPreference:"high-performance"});c.setSize(innerWidth,innerHeight),c.toneMapping=Rt,c.shadowMap.type=ba,c.info.autoReset=!1,document.body.prepend(c.domElement);const g=Se.has("dpr")?Number(Se.get("dpr")):null;let w=g??Math.min(devicePixelRatio,(l.dprMin+l.dprMax)/2);const M=new Ma("#bcd4f0","#6a6a4a",1);u.add(M);const C=new ya("#ffffff",2);u.add(C,C.target),C.shadow.bias=-4e-4,C.shadow.normalBias=.05,C.shadow.camera.near=1,C.shadow.camera.far=900,C.shadow.camera.layers.enable(Gt);const T=no(u,e,t,r,l),k=new Ye(innerWidth,innerHeight,{type:Qe,samples:4}),R=new Ba(c,k);R.addPass(new Da(u,f));const $=new Ge(new ue(innerWidth/2,innerHeight/2),ht.strength,ht.radius,ht.threshold);R.addPass($),R.addPass(new Na),R.addPass(new It({uniforms:{tDiffuse:{value:null},uSat:{value:Et.saturation},uVig:{value:Et.vignette}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform sampler2D tDiffuse; uniform float uSat; uniform float uVig; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float l = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = mix(vec3(l), c.rgb, uSat); vec2 d = vUv - 0.5; c.rgb *= 1.0 - dot(d, d) * uVig; gl_FragColor = c; }"}));function E(){c.setPixelRatio(w),c.setSize(innerWidth,innerHeight),R.setPixelRatio(w),R.setSize(innerWidth,innerHeight),f.aspect=innerWidth/innerHeight,f.updateProjectionMatrix()}addEventListener("resize",E);let A=T.colliders();const D={surfacesAt:(x,O)=>[ie(e,x,O)],canOccupy:(x,O)=>{const n=ie(e,x.x,x.z);return x.y>=n-.05&&n>ce-.3&&Math.abs(x.x)<F-40&&Math.abs(x.z)<F-40&&!A.some(m=>"x"in m&&Math.hypot(x.x-m.x,x.z-m.z)<m.radius+O)}},S=new Sa(c.domElement,u,f);u.add(S.avatar),S.view="third",S.traversalWorld=D,S.poweredLegs=!0;for(const x of[...S.avatar.children])S.avatar.remove(x);za(S);const I=Aa(u,new ft,new ft),j=((we=Se.get("clips"))==null?void 0:we.split(",").filter(Boolean))??co,Y=x=>"/Rootwake/vista/"+x;j.length&&_a(async()=>{const{loadHuldaClips:x}=await import("./huldaModel-CGEW33qo.js");return{loadHuldaClips:x}},__vite__mapDeps([0,1,2,3,4])).then(({loadHuldaClips:x})=>x(j.map(Y))).then(x=>I.setClips(x),x=>console.warn("Hulda clips",x));const Z=le("toast");let Te=0;function he(x){Z.textContent=x,Z.classList.add("on"),clearTimeout(Te),Te=window.setTimeout(()=>Z.classList.remove("on"),1800)}function pe(x){d=(x+je.length)%je.length,h=je[d],T.setHour(h),c.toneMappingExposure=h.exposure,M.color.set(h.ambSky),M.groundColor.set(h.ambGround),M.intensity=h.ambI*2.2,C.color.set(h.sun)}function Pe(x){var n;l=x,T.setQuality(x),A=T.colliders();const O=x.shadow>0;if(c.shadowMap.enabled!==O&&(c.shadowMap.enabled=O,u.traverse(m=>{const v=m.material;v&&(Array.isArray(v)?v:[v]).forEach(b=>b.needsUpdate=!0)})),C.castShadow=O,O){C.shadow.mapSize.set(x.shadow,x.shadow),(n=C.shadow.map)==null||n.dispose(),C.shadow.map=null;const m=C.shadow.camera;m.left=m.bottom=-x.shadowBox,m.right=m.top=x.shadowBox,m.updateProjectionMatrix()}$.enabled=x.bloom,g===null&&(w=Math.min(devicePixelRatio,Math.max(x.dprMin,Math.min(x.dprMax,w)))),E()}function Ae(x){const O=o[(x+o.length)%o.length];ve=(x+o.length)%o.length;let n=O.x,m=O.z;for(let v=0;v<400;v++){const b=v*2.4,_=Math.sqrt(v)*.8;if(n=O.x+Math.cos(b)*_,m=O.z+Math.sin(b)*_,Ta(D,n,m)!==null)break}S.teleport(n,m,O.yaw),S.pitch=O.pitch,T.update(f,be),A=T.colliders()}let ve=Math.max(0,Math.min(o.length-1,Number(Se.get("card")??0)||0)),be=0;le("hour").onclick=()=>{pe(d+1),he(h.name)},le("card").onclick=()=>{Ae(ve+1),he(o[ve].name)},le("quality").onclick=()=>{Pe(Ie[(Ie.indexOf(l)+1)%Ie.length]),he(`${l.name} quality`)},le("view").onclick=()=>{S.view=S.view==="third"?"first":"third",le("view").textContent=S.view==="third"?"3rd":"1st"},le("photo").onclick=()=>{document.body.classList.add("photo"),S.cancelInput()};let ee={x:0,y:0,t:0};c.domElement.addEventListener("pointerdown",x=>{ee={x:x.clientX,y:x.clientY,t:performance.now()}}),c.domElement.addEventListener("pointerup",x=>{document.body.classList.contains("photo")&&performance.now()-ee.t<300&&Math.hypot(x.clientX-ee.x,x.clientY-ee.y)<10&&document.body.classList.remove("photo")}),Se.get("photo")==="1"&&document.body.classList.add("photo");const re=le("intro");le("help").onclick=()=>{S.cancelInput(),re.showModal()},le("begin").onclick=()=>{re.close(),te=performance.now()},document.addEventListener("contextmenu",x=>x.preventDefault()),document.addEventListener("visibilitychange",()=>{te=performance.now(),S.cancelInput()}),pe(d),Pe(l),Ae(ve),le("loading").remove(),Se.get("intro")!=="0"&&re.showModal();const ae=new H,de=new mt,ge=new H(0,1,0),De=le("hud");let te=performance.now(),xe=0,fe=0,oe=0,Q=0,Me=0,ye=0,q=1,ke=0;const Ze=x=>{var _;requestAnimationFrame(Ze);const O=x-te,n=Math.min(.05,Math.max(0,O/1e3));if(te=x,document.hidden)return;be+=n,c.info.reset(),S.update(x,A,void 0),S.applyCamera(f),T.update(f,be),ke<=0&&(A=T.colliders(),ke=.5,(_=u.getObjectByName("HuldaPresentation"))==null||_.traverse(z=>{z.castShadow=!0})),ke-=n;const m=S.feet();ae.copy(m),ae.y+=Pa;let v=S.yaw;S.motor.speed>.08&&(v=Math.atan2(-S.motor.velocity.x,-S.motor.velocity.z)),de.setFromAxisAngle(ge,v),I.update(n,"human",ae,de,S.motor.speed,v,S.motor.mode==="grounded",S.view==="third"),S.avatar.visible=!1;const b=Lt(h);if(q+=(T.sunAt(m.x,m.z)-q)*Math.min(1,n*3),C.intensity=h.sunI*.9*q,C.target.position.copy(m),C.position.copy(m).addScaledVector(b,400),R.render(),xe++,fe+=O,oe+=n,Me+=O,ye++,Q+=n,oe>.5){const z=c.info.render,W=fe/xe;De.textContent=`${(1e3/W).toFixed(0)} fps  ${W.toFixed(1)} ms
${l.name} · scale ${w.toFixed(2)}${g!==null?" (fixed)":""}
${(z.triangles/1e3).toFixed(0)}k tris · ${z.calls} calls
${h.name} · ${o[ve].name}`,xe=0,fe=0,oe=0}if(Q>po&&g===null){const z=Me/ye,W=Math.min(devicePixelRatio,l.dprMax),L=z>fo?Math.max(l.dprMin,w-.1):z<mo?Math.min(W,w+.05):w;Math.abs(L-w)>.001&&(w=L,E()),Q=0,Me=0,ye=0}};window.__rootwake={THREE:Ca,scene:u,camera:f,renderer:c,player:S,land:e,world:T,cards:o,trees:t,rocks:r,setHour:pe,setQuality:x=>Pe(Ie[x]),goCard:Ae,get hour(){return h},get quality(){return l},get dpr(){return w}},requestAnimationFrame(Ze)}vo().catch(a=>{console.error(a);const e=document.getElementById("load-step");e&&(e.textContent=`Could not build the vista: ${a}`)});
