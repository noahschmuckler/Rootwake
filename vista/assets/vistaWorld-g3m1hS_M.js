import{b as Ee,aj as Sa,s as st,K as Re,ap as he,aq as Qe,$ as J,ah as it,ai as nt,ar as Ca,as as Ta,j as te,V as D,r as Aa,d as _a,at as Fa,au as ka,av as Pa,X as Da,aw as Ea,ax as Ba,A as Ra,ay as Ia,az as Ua,G as Nt,a1 as Pe,aA as xt,aB as bt,aC as wt,aD as Wt,a9 as Lt,aE as Ot,aF as Yt,aG as Mt,D as Vt,J as Ha,k as Ga,P as Na,I as jt,o as St,Q as $t,p as ea,aH as Qt,q as Ct,aI as Wa,m as yt,z as Kt,n as ta,t as Tt,aJ as La,aK as Oa}from"./mobilityControls-rUQEh3jo.js";import{m as tt,a as At}from"./BufferGeometryUtils-DVoyXHP5.js";const aa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ue{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ya=new Sa(-1,1,1,-1,0,1);class Va extends st{constructor(){super(),this.setAttribute("position",new Re([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Re([0,2,0,0,2,0],2))}}const ja=new Va;class _t{constructor(e){this._mesh=new Ee(ja,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ya)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class $a extends Ue{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof he?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Qe.clone(e.uniforms),this.material=new he({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new _t(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Xt extends Ue{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let o,u;this.inverse?(o=0,u=1):(o=1,u=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),a.buffers.stencil.setClear(u),a.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class Qa extends Ue{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class yo{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new J);this._width=n.width,this._height=n.height,t=new it(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:nt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $a(aa),this.copyPass.material.blending=Ca,this.clock=new Ta}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,a=this.passes.length;s<a;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const u=this.renderer.getContext(),f=this.renderer.state.buffers.stencil;f.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),f.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}Xt!==void 0&&(o instanceof Xt?n=!0:o instanceof Qa&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new J);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class zo extends Ue{constructor(e,t,n=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new te}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let a,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const Ka={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new te(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ke extends Ue{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new J(e.x,e.y):new J(256,256),this.clearColor=new te(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new it(a,o,{type:nt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let m=0;m<this.nMips;m++){const h=new it(a,o,{type:nt});h.texture.name="UnrealBloomPass.h"+m,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const p=new it(a,o,{type:nt});p.texture.name="UnrealBloomPass.v"+m,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),a=Math.round(a/2),o=Math.round(o/2)}const u=Ka;this.highPassUniforms=Qe.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new he({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];const f=[3,5,7,9,11];a=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let m=0;m<this.nMips;m++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(f[m])),this.separableBlurMaterials[m].uniforms.invSize.value=new J(1/a,1/o),a=Math.round(a/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const v=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=v,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const l=aa;this.copyUniforms=Qe.clone(l.uniforms),this.blendMaterial=new he({uniforms:this.copyUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader,blending:Aa,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new te,this.oldClearAlpha=1,this.basic=new _a,this.fsQuad=new _t(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(n,s),this.renderTargetsVertical[a].setSize(n,s),this.separableBlurMaterials[a].uniforms.invSize.value=new J(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,a){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let u=this.renderTargetBright;for(let f=0;f<this.nMips;f++)this.fsQuad.material=this.separableBlurMaterials[f],this.separableBlurMaterials[f].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[f].uniforms.direction.value=Ke.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[f]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[f].uniforms.colorTexture.value=this.renderTargetsHorizontal[f].texture,this.separableBlurMaterials[f].uniforms.direction.value=Ke.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[f]),e.clear(),this.fsQuad.render(e),u=this.renderTargetsVertical[f];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new he({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new J(.5,.5)},direction:{value:new J(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new he({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ke.BlurDirectionX=new J(1,0);Ke.BlurDirectionY=new J(0,1);const Xa={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class So extends Ue{constructor(){super();const e=Xa;this.uniforms=Qe.clone(e.uniforms),this.material=new Fa({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new _t(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ka.getTransfer(this._outputColorSpace)===Pa&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Da?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ea?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ba?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ra?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ia?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ua&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Xe=2048,oa=513,ra=Xe/(oa-1),ee=Xe/2,ie=40,sa=300,Za=200;function me(r){let e=r>>>0||1;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function lt(r){const e=me(r),t=new Uint8Array(512),n=[...Array(256).keys()];for(let u=255;u>0;u--){const f=Math.floor(e()*(u+1));[n[u],n[f]]=[n[f],n[u]]}for(let u=0;u<512;u++)t[u]=n[u&255];const s=new Float32Array(256),a=new Float32Array(256);for(let u=0;u<256;u++){const f=e()*Math.PI*2;s[u]=Math.cos(f),a[u]=Math.sin(f)}const o=u=>u*u*u*(u*(u*6-15)+10);return(u,f)=>{const v=Math.floor(u),l=Math.floor(f),m=u-v,h=f-l,p=v&255,M=l&255,S=(I,X,L,_)=>{const E=t[I+t[X]];return s[E]*L+a[E]*_},k=S(p,M,m,h),T=S(p+1,M,m-1,h),b=S(p,M+1,m,h-1),g=S(p+1,M+1,m-1,h-1),y=o(m),R=o(h);return 1.41*((k+(T-k)*y)*(1-R)+(b+(g-b)*y)*R)}}function Be(r,e,t,n,s=2,a=.5){let o=0,u=1,f=1,v=0;for(let l=0;l<n;l++)o+=r(e*f+l*17.3,t*f-l*9.1)*u,v+=u,u*=a,f*=s;return o/v}function qa(r,e,t,n){let s=0,a=.5,o=1,u=1,f=0;for(let v=0;v<n;v++){let l=1-Math.abs(r(e*o+v*31.7,t*o+v*11.3));l*=l,l*=u,u=Math.min(1,l*1.6),s+=l*a,f+=a,a*=.5,o*=2.05}return s/f}const Ie=(r,e,t)=>{const n=Math.min(1,Math.max(0,(t-r)/(e-r)));return n*n*(3-2*n)},de={x:0,z:260,rx:230,rz:380};function ut(r){return 170*Math.sin(r*.0019+.6)+60*Math.sin(r*.0051)}function Ja(r){const e=lt(r*7+1),t=lt(r*7+2),n=lt(r*7+3);return{base:(a,o)=>{const u=a+140*Be(t,a*.0011,o*.0011,3),f=o+140*Be(t,a*.0011+40,o*.0011-30,3),v=Math.abs(u-ut(f)),l=Ie(110,760,v+90*Be(n,a*.002,o*.002,2)),m=qa(e,u*.0016,f*.0016,6),h=Be(n,a*.004,o*.004,4)*16+Be(n,a*.012,o*.012,3)*4,p=Math.exp(-(((a-ut(o)*.4-de.x)/de.rx)**2+((o-de.z)/de.rz)**2));return ie+7+Math.max(0,(Math.abs(o)-500)*.02)+h*(1-l)+l**1.25*(80+520*m)+l*h*3-p*26},seed:r}}const eo={droplets:7e4,steps:64,radius:2,inertia:.06,capacity:6,minSlope:.01,erode:.35,deposit:.25,evaporate:.018,gravity:6,scale:20};function Co(r=1,e={},t={}){const n=t.size??Xe,s=t.n??oa,a=n/(s-1),o=n/2,u=at(),f=t.shape??Ja(r),v=new Float32Array(s*s);for(let g=0;g<s;g++)for(let y=0;y<s;y++)v[g*s+y]=f.base(y*a-o,g*a-o);const l=at(),m=new Float32Array(s*s),h=new Float32Array(s*s),p={...eo,...e};p.scale*=a/ra,to(v,m,h,r,p,s,a,t.erodeMask?(g,y)=>t.erodeMask(g*a-o,y*a-o):null);let M=0;for(let g=0;g<m.length;g++)m[g]=Math.log1p(m[g]),m[g]>M&&(M=m[g]);for(let g=0;g<m.length;g++)m[g]/=M||1;Zt(m,1,s),Zt(h,1,s);let S=0;for(const g of h)S=Math.max(S,g);for(let g=0;g<h.length;g++)h[g]=Math.min(1,h[g]/(S*.25||1));const k=at(),T=ao(v,s,a,t.erodeMask?(g,y)=>t.erodeMask(g*a-o,y*a-o)>.005:null);let b=-1/0;for(const g of v)g>b&&(b=g);return{seed:r,shape:f,size:n,n:s,cell:a,half:o,ceiling:b+30,waterY:t.waterY??ie,snowY:t.snowY??sa,surface:t.surface,h:v,flow:m,sediment:h,ao:T,ms:{shape:l-u,erosion:k-l,ao:at()-k}}}function at(){return typeof performance<"u"?performance.now():Date.now()}function to(r,e,t,n,s,a,o,u){const f=me(n*131+7),v=s.scale,l=s.radius,m=[],h=[];let p=0;for(let T=-l;T<=l;T++)for(let b=-l;b<=l;b++){const g=Math.hypot(b,T);if(g<=l){m.push(b,T);const y=1-g/l;h.push(y),p+=y}}for(let T=0;T<h.length;T++)h[T]/=p;const M=Za/o,S=(T,b)=>Ie(0,M,Math.min(T,b,a-1-T,a-1-b)-l)*(u?u(T,b):1),k=T=>r[T]/v;for(let T=0;T<s.droplets;T++){let b=f()*(a-3)+1,g=f()*(a-3)+1,y=0,R=0,I=1,X=1,L=0;for(let _=0;u&&_<12&&u(Math.floor(b),Math.floor(g))<.05;_++)b=f()*(a-3)+1,g=f()*(a-3)+1;for(let _=0;_<s.steps;_++){const E=Math.floor(b),Y=Math.floor(g),F=b-E,Q=g-Y,K=Y*a+E,Ce=k(K),ne=k(K+1),Ge=k(K+a),Te=k(K+a+1),Ae=(ne-Ce)*(1-Q)+(Te-Ge)*Q,ae=(Ge-Ce)*(1-F)+(Te-ne)*F,Ne=Ce*(1-F)*(1-Q)+ne*F*(1-Q)+Ge*(1-F)*Q+Te*F*Q;y=y*s.inertia-Ae*(1-s.inertia),R=R*s.inertia-ae*(1-s.inertia);const ve=Math.hypot(y,R);if(ve<1e-9||(y/=ve,R/=ve,b+=y,g+=R,b<1||g<1||b>=a-2||g>=a-2))break;const pe=Math.floor(b),qe=Math.floor(g),_e=b-pe,ge=g-qe,oe=qe*a+pe,le=k(oe)*(1-_e)*(1-ge)+k(oe+1)*_e*(1-ge)+k(oe+a)*(1-_e)*ge+k(oe+a+1)*_e*ge-Ne,re=S(E,Y);e[K]+=X*re;const ue=Math.max(-le,s.minSlope)*I*X*s.capacity;if(L>ue||le>0){const ce=le>0?Math.min(le,L):(L-ue)*s.deposit;L-=ce;const j=ce*v*re;r[K]+=j*(1-F)*(1-Q),r[K+1]+=j*F*(1-Q),r[K+a]+=j*(1-F)*Q,r[K+a+1]+=j*F*Q,t[K]+=ce*re}else{const ce=Math.min((ue-L)*s.erode,-le);for(let j=0;j<h.length;j++){const $=E+m[j*2],Fe=Y+m[j*2+1];if($<0||Fe<0||$>=a||Fe>=a)continue;const Je=Fe*a+$,ft=Math.min(ce*h[j],r[Je]/v)*re;r[Je]-=ft*v}L+=ce*re}I=Math.sqrt(Math.max(0,I*I-le*s.gravity)),X*=1-s.evaporate}}}function Zt(r,e,t){const n=new Float32Array(r.length);for(let s=0;s<e;s++){for(let a=0;a<t;a++)for(let o=0;o<t;o++){const u=a*t+o;n[u]=(r[u]*2+r[a*t+Math.max(0,o-1)]+r[a*t+Math.min(t-1,o+1)])/4}for(let a=0;a<t;a++)for(let o=0;o<t;o++){const u=a*t+o;r[u]=(n[u]*2+n[Math.max(0,a-1)*t+o]+n[Math.min(t-1,a+1)*t+o])/4}}}function ao(r,e,t,n){const s=new Float32Array(e*e),a=[2,6,16],o=8;for(let u=0;u<e;u++)for(let f=0;f<e;f++){const v=u*e+f;let l=0;if(n&&!n(f,u)){s[v]=1;continue}for(const m of a){let h=0;for(let p=0;p<o;p++){const M=p/o*Math.PI*2,S=Math.min(e-1,Math.max(0,Math.round(f+Math.cos(M)*m))),k=Math.min(e-1,Math.max(0,Math.round(u+Math.sin(M)*m)));h+=Math.max(0,r[k*e+S]-r[v])/(m*t)}l+=h/o}s[v]=Math.max(0,1-l*.9)}return s}function fe(r,e,t){const{n,cell:s,half:a}=r,o=(e+a)/s,u=(t+a)/s;if(o<0||u<0||o>=n-1||u>=n-1)return r.shape.base(e,t);const f=Math.floor(o),v=Math.floor(u),l=o-f,m=u-v,h=v*n+f,p=r.h;return p[h]*(1-l)*(1-m)+p[h+1]*l*(1-m)+p[h+n]*(1-l)*m+p[h+n+1]*l*m}function ia(r,e,t,n){const{n:s,cell:a,half:o}=r,u=Math.min(s-1,Math.max(0,Math.round((t+o)/a))),f=Math.min(s-1,Math.max(0,Math.round((n+o)/a)));return e[f*s+u]}function na(r,e,t,n=r.cell,s=(a,o)=>fe(r,a,o)){const a=s(e+n,t)-s(e-n,t),o=s(e,t+n)-s(e,t-n),u=-a,f=2*n,v=-o,l=Math.hypot(u,f,v);return[u/l,f/l,v/l]}function oo(r,e,t){return r.surface?r.surface(e,t):fe(r,e,t)}function ct(r,e,t){return 1-na(r,e,t)[1]}function qt(r,e,t=new Uint8Array(r.n*r.n),n=[0,r.n]){const{n:s,cell:a}=r,[o,u,f]=e,v=Math.hypot(o,f)||1e-6,l=u/v,m=o/v,h=f/v,p=r.h;if(u<=0)return t.fill(0,n[0]*s,n[1]*s),t;for(let M=n[0];M<n[1];M++)for(let S=0;S<s;S++){const k=p[M*s+S]+.5;let T=1,b=a*.75;for(let g=0;g<120&&T>0;g++){const y=S+m*b/a,R=M+h*b/a;if(y<0||R<0||y>=s-1||R>=s-1)break;const I=y|0,X=R|0,L=y-I,_=R-X,E=X*s+I,Y=p[E]*(1-L)*(1-_)+p[E+1]*L*(1-_)+p[E+s]*(1-L)*_+p[E+s+1]*L*_,F=k+b*l;if(T=Math.min(T,(F-Y)/(1.5+b*.02)*.5+.5),F>r.ceiling)break;b+=Math.max(a*.75,b*.06)}t[M*s+S]=Math.round(Math.min(1,Math.max(0,T))*255)}return t}const ot=7,Jt=150;function To(r,e=9e3){const t=me(r.seed*977+3),n=lt(r.seed*13+5),s=[];for(let a=-ee+20;a<ee-20;a+=ot)for(let o=-ee+20;o<ee-20;o+=ot){const u=o+(t()-.5)*ot*.9,f=a+(t()-.5)*ot*.9,v=fe(r,u,f);if(v<ie+2.5||v>sa-30)continue;const l=ct(r,u,f);if(l>.22)continue;const m=Be(n,u*.0045,f*.0045,4)+.2*ia(r,r.flow,u,f)-(v>Jt?0:.06),h=Ie(.02,.32,m)*(1-Ie(.12,.22,l));if(t()>h*.95+(t()<.004?1:0))continue;const p=v>Jt+(t()-.5)*60||m>.3&&t()<.25;if(s.push({x:u,z:f,y:v,kind:p?3+Math.floor(t()*2):Math.floor(t()*3),scale:.75+t()*.55,rot:t()*Math.PI*2}),s.length>=e)return s}return s}function Ao(r,e=900){const t=me(r.seed*389+11),n=[];for(let s=0;s<e*30&&n.length<e;s++){const a=(t()-.5)*(Xe-60),o=(t()-.5)*(Xe-60),u=fe(r,a,o),f=ct(r,a,o);if(u<ie-1.5)continue;const v=ia(r,r.sediment,a,o),l=.02+.5*Ie(.1,.35,f)*(1-Ie(.5,.7,f))+.4*v;t()>l||n.push({x:a,z:o,y:u,scale:.4+t()**3*4.5,rot:t()*Math.PI*2,tilt:(t()-.5)*.5})}return n}function ro(r,e,t,n,s,a,o){const u=Math.hypot(s-e,o-n),f=Math.ceil(u/(ra*2));for(let v=2;v<f-2;v++){const l=v/f;if(fe(r,e+(s-e)*l,n+(o-n)*l)>t+(a-t)*l)return!1}return!0}const rt=(r,e,t,n)=>Math.atan2(-(t-r),-(n-e));function _o(r){const e={x:de.x+ut(de.z)*.4,z:de.z},t=[];let n={x:0,z:0,y:-1/0};for(let l=-ee+120;l<ee-120;l+=16)for(let m=-ee+120;m<ee-120;m+=16){const h=fe(r,m,l);h>n.y&&(n={x:m,z:l,y:h})}const s=l=>{let m={x:0,z:0},h=-1/0;for(let p=-ee+140;p<ee-140;p+=12)for(let M=-ee+140;M<ee-140;M+=12){const S=l(M,p,fe(r,M,p));S>h&&(h=S,m={x:M,z:p})}return m},a=(l,m)=>{if(ct(r,l,m)>.12)return!1;const h=fe(r,l,m);return[[.3,0],[-.3,0],[0,.3],[0,-.3]].every(([p,M])=>Math.abs(fe(r,l+p,m+M)-h)<.15)},o=s((l,m,h)=>h<ie+.6||h>ie+3||!a(l,m)?-1/0:-Math.abs(Math.hypot(l-e.x,m-e.z)-260)+(Math.hypot(l-n.x,m-n.z)>Math.hypot(e.x-n.x,e.z-n.z)?120:0));t.push({name:"Lakeshore",...o,yaw:rt(o.x,o.z,e.x,e.z),pitch:.02});const u=s((l,m,h)=>!a(l,m)||h<ie+3||Math.abs(l-ut(m))>120?-1/0:-Math.abs(m-(de.z-900))-ct(r,l,m)*400);t.push({name:"Valley meadow",...u,yaw:rt(u.x,u.z,e.x,e.z),pitch:.04});const f=s((l,m,h)=>{if(h<ie+140||h>ie+280||!a(l,m))return-1/0;const p=Math.hypot(l-e.x,m-e.z);return p<450||p>900?-1/0:ro(r,l,h+2,m,e.x,ie,e.z)?1e3-p:-1/0});t.push({name:"Ridge over the lake",...f,yaw:rt(f.x,f.z,e.x,e.z),pitch:-.12});const v=s((l,m,h)=>a(l,m)?h:-1/0);return t.push({name:"Summit",...v,yaw:rt(v.x,v.z,e.x,e.z),pitch:-.1}),t}const Se=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,He=`
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
`,ht=`
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
`,Ft=`
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
`,la=`
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
`,Pt=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Ze=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,so=`
${kt}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,io=`
${Pt}
${Se}${He}${ht}${Ft}${la}
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
  ${Ze}
}`,no=`
${kt}
${Se}${He}${ht}${Ft}${la}
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
}`,lo=`
${Pt}
${Se}${He}
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
  ${Ze}
}`,uo=`
${kt}
${Se}
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
}`,co=`
${Pt}
${Se}${He}${ht}
#ifdef ROCK
${Ft}
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
  ${Ze}
}`,ho=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fo=`
${Se}${He}${ht}
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
  ${Ze}
}`,mo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,vo=`
${Se}${He}
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
  ${Ze}
}`,Fo=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function po(r){const e=Ct.degToRad(r.elevation),t=Ct.degToRad(r.azimuth);return new D(Math.sin(t)*Math.cos(e),Math.sin(e),-Math.cos(t)*Math.cos(e)).normalize()}const ko=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],De=(r,e=1)=>new te(r).multiplyScalar(e),go=1;function Po(r,e,t,n,s,a={}){const{n:o,cell:u,half:f,size:v}=e,l=new Nt;l.name="vista",r.add(l),r=l;const m=o>600?2:1,h=(o-1)/m+1,p=new Uint8Array(o*o*4),M=new Uint8Array(h*h),S=new Uint8Array(h*h),k=m===1?e:{...e,n:h,cell:u*m,h:(()=>{const i=new Float32Array(h*h);for(let d=0;d<h;d++)for(let c=0;c<h;c++)i[d*h+c]=e.h[d*m*o+c*m];return i})()},T=new Pe(M,h,h,xt,bt);T.magFilter=T.minFilter=wt,T.wrapS=T.wrapT=Wt;const b=new Uint8Array(o*o*4);a.ground&&b.set(a.ground);const g=new Pe(b,o,o,Lt,bt);g.magFilter=g.minFilter=wt,g.needsUpdate=!0;const y=new Pe(new Uint8Array(4),1,1);y.needsUpdate=!0;const R=96,I=97,X=new Float32Array(I*I),L=new Pe(X,I,I,xt,Ot);L.magFilter=L.minFilter=Yt;let _=new J(1e9,1e9);for(let i=0;i<o*o;i++)p[i*4+1]=Math.round(e.ao[i]*255),p[i*4+2]=Math.round(e.flow[i]*255),p[i*4+3]=Math.round(e.sediment[i]*255);const E=new Pe(p,o,o,Lt,bt);E.magFilter=E.minFilter=wt,E.wrapS=E.wrapT=Wt;const Y=new Pe(new Float32Array(e.h),o,o,xt,Ot);Y.magFilter=Y.minFilter=Yt,Y.needsUpdate=!0;const F={uSunDir:{value:new D(0,1,0)},uSunCol:{value:new te},uZenith:{value:new te},uHorizon:{value:new te},uAmbSky:{value:new te},uAmbGround:{value:new te},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:a.hazeBase??e.waterY},uTime:{value:0},uMapData:{value:E},uSunTex:{value:T},uGround:{value:g},uHeight:{value:Y},uMapHalf:{value:f},uCell:{value:u},uN:{value:o},uSunN:{value:h},uWaterY:{value:Number.isFinite(e.waterY)?e.waterY:-1e4},uSnowY:{value:e.snowY},uGloom:{value:new Mt(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},Q=(i,d,c={},x={})=>{const A={...Qe.merge([Wa.lights]),...F,...c};return new he({uniforms:A,vertexShader:i,fragmentShader:d,lights:!0,defines:x})},K=16,Ce=(o-1)/K,ne=Ce*u,Ge=110,Te=e.surface&&a.fineLod?[.5,1,2,4,8]:[1,2,4,8],Ae={uClear0:{value:y},uClear1:{value:y},uClear2:{value:y},uClearAt:{value:[new D(0,0,.001),new D(0,0,.001),new D(0,0,.001)]}},ae=Q(so,io,{uSoil:{value:new Mt(0,0,0,0)},...Ae});ae.side=Vt;const Ne=(i,d)=>oo(e,i,d),ve=new Nt;ve.name="terrain",r.add(ve);const pe=[];function qe(i,d,c){const x=Ce/c,A=i*ne-f,H=d*ne-f,C=c*u,O=4+c*3,W=(x+1)*(x+1),z=new Float32Array((W+4*x)*3),G=new Float32Array((W+4*x)*3),Z=[];for(let w=0;w<=x;w++)for(let U=0;U<=x;U++){const B=A+U*C,q=H+w*C,V=(w*(x+1)+U)*3,ye=na(e,B,q,Math.max(e.surface?1:u,C*.75),Ne);z[V]=B,z[V+1]=Ne(B,q),z[V+2]=q,G[V]=ye[0],G[V+1]=ye[1],G[V+2]=ye[2]}for(let w=0;w<x;w++)for(let U=0;U<x;U++){const B=w*(x+1)+U,q=B+1,V=B+x+1,ye=V+1;Z.push(B,V,q,q,V,ye)}const P=[];for(let w=0;w<x;w++)P.push(w);for(let w=0;w<x;w++)P.push(w*(x+1)+x);for(let w=x;w>0;w--)P.push(x*(x+1)+w);for(let w=x;w>0;w--)P.push(w*(x+1));P.forEach((w,U)=>{const B=(W+U)*3;z[B]=z[w*3],z[B+1]=z[w*3+1]-O,z[B+2]=z[w*3+2],G[B]=G[w*3],G[B+1]=G[w*3+1],G[B+2]=G[w*3+2]});for(let w=0;w<P.length;w++){const U=P[w],B=P[(w+1)%P.length],q=W+w,V=W+(w+1)%P.length;Z.push(U,q,B,B,q,V)}const N=new st;return N.setAttribute("position",new Tt(z,3)),N.setAttribute("normal",new Tt(G,3)),N.setIndex(Z),N.computeBoundingSphere(),N}for(let i=0;i<K;i++)for(let d=0;d<K;d++){const c={mesh:new Ee(void 0,ae),lod:-1,geos:[],cx:(d+.5)*ne-f,cz:(i+.5)*ne-f};c.mesh.receiveShadow=!0,c.mesh.matrixAutoUpdate=!1,c.mesh.userData={ti:d,tj:i},ve.add(c.mesh),pe.push(c)}function _e(i){var H;const[d,c,x]=we.lod,A=Te.length>4?1:0;for(const C of pe){const O=Math.max(0,Math.hypot(C.cx-i.x,C.cz-i.z)-ne*.7),W=(A&&O<Ge?-1:O<d?0:O<c?1:O<x?2:3)+A;if(W!==C.lod){C.lod=W,(H=C.geos)[W]??(H[W]=qe(C.mesh.userData.ti,C.mesh.userData.tj,Te[W])),C.mesh.geometry=C.geos[W];for(let z=0;z<W-1;z++)C.geos[z]&&(C.geos[z].dispose(),C.geos[z]=void 0)}}}{const i=Math.max(7e3,f+4500),d=80,c=Math.round(2*i/d),x=[],A=[],H=[],C=f-d,O=new Int32Array((c+1)*(c+1)).fill(-1),W=(P,N)=>{const w=-i+P*d,U=-i+N*d;return!(w>=-C&&w+d<=C&&U>=-C&&U+d<=C)},z=(P,N)=>{const w=N*(c+1)+P;if(O[w]>=0)return O[w];const U=-i+P*d,B=-i+N*d,q=Math.abs(U)<=f&&Math.abs(B)<=f,V=(ya,za)=>e.shape.base(ya,za),ye=V(U,B)-(q?6:0),ke=d,Ht=-(V(U+ke,B)-V(U-ke,B)),Gt=-(V(U,B+ke)-V(U,B-ke)),gt=Math.hypot(Ht,2*ke,Gt);return O[w]=x.length/3,x.push(U,ye,B),A.push(Ht/gt,2*ke/gt,Gt/gt),O[w]};for(let P=0;P<c;P++)for(let N=0;N<c;N++)if(W(N,P)){const w=z(N,P),U=z(N+1,P),B=z(N,P+1),q=z(N+1,P+1);H.push(w,B,U,U,B,q)}const G=new st;G.setAttribute("position",new Re(x,3)),G.setAttribute("normal",new Re(A,3)),G.setIndex(H),G.computeBoundingSphere();const Z=new Ee(G,ae);Z.name="far-ring",Z.frustumCulled=!1,r.add(Z)}const ge=new he({uniforms:{...F,uCloud:{value:.5}},vertexShader:mo,fragmentShader:vo,side:Ha,depthWrite:!1}),oe=new Ee(new Ga(8e3,48,24),ge);oe.name="sky",oe.frustumCulled=!1,oe.renderOrder=-10,r.add(oe);const Dt=new he({uniforms:{...F},vertexShader:ho,fragmentShader:fo,transparent:!0,depthWrite:!1}),le=new Na(v,v,8,8);le.rotateX(-Math.PI/2);const re=new Ee(le,Dt);re.position.y=e.waterY,re.name="lake",re.visible=Number.isFinite(e.waterY),r.add(re);const ue=Q(no,lo,{uCenter:{value:new J},uPatch:{value:60},uBladeH:{value:a.bladeH??.34},uBladeW:{value:.045},uWind:{value:new J(.94,.34)},...Ae,uFine:{value:L},uFineAt:{value:new Mt(0,0,1,0)}});ue.side=Vt;const ce=3,j=new st;{const i=[],d=[],c=[],x=me(3);for(let A=0;A<ce;A++){const H=A/ce*Math.PI*2+x()*.6,C=(x()-.5)*.12,O=(x()-.5)*.12,W=.65+x()*.55,z=i.length/3;for(const[G,Z]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])i.push(G,Z,0),d.push(H,C,O,W);c.push(z,z+1,z+2,z+2,z+1,z+3,z+2,z+3,z+4,z+4,z+3,z+5,z+4,z+5,z+6)}j.setAttribute("position",new Re(i,3)),j.setAttribute("aTuft",new Re(d,4)),j.setIndex(c)}let $=null,Fe=!0;const Je=14;function ft(i,d){if($&&($.geometry.dispose(),r.remove($),$=null),!i)return;const c=new La;c.index=j.index,c.setAttribute("position",j.getAttribute("position")),c.setAttribute("aTuft",j.getAttribute("aTuft"));const x=me(77),A=new Float32Array(i*4);for(let H=0;H<i;H++)A[H*4]=x()*d,A[H*4+1]=x()*d,A[H*4+2]=x(),A[H*4+3]=x()*Math.PI*2;c.setAttribute("aBlade",new Oa(A,4)),c.instanceCount=i,$=new Ee(c,ue),$.frustumCulled=!1,$.receiveShadow=!0,$.name="grass",r.add($),ue.uniforms.uPatch.value=d}const et=(i,d)=>Q(uo,co,{uColor:{value:i?De(i):new te}},d),ua=et(null,{ROCK:""}),mt=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c","#c97a3e"],ca=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218","#87705a"],Et=i=>i>=5?{VARIED:""}:{},Bt=mt.map((i,d)=>et(i,{USE_SWAY:"",...Et(d)})),ha=mt.map((i,d)=>et(i,Et(d))),Rt=ca.map(i=>et(i,{})),xe=mt.map((i,d)=>xo(d)),We=(i,d,c,x)=>{const A=new jt(i,d,Math.max(1,c));return A.count=0,A.frustumCulled=!1,A.castShadow=x,A.receiveShadow=!0,A.instanceMatrix.setUsage(Qt),r.add(A),A};let be=[],Le=[],Oe=[],Ye=[],Ve=[];function It(i){for(const d of[...Le,...Oe,...Ye,...Ve])r.remove(d),d.dispose();be=xe.map((d,c)=>i.filter(x=>x.kind===c)),Le=xe.map((d,c)=>We(d.trunk,Rt[c],be[c].length,!1)),Oe=xe.map((d,c)=>We(d.crown,Bt[c],be[c].length,!1)),Ye=xe.flatMap((d,c)=>[We(d.trunk,Rt[c],be[c].length,!0),We(d.crown,Bt[c],be[c].length,!0)]);for(const d of Ye)d.layers.set(go);Ve=xe.map((d,c)=>We(d.far,ha[c],be[c].length,!1)),je.set(1e9,0,0)}const fa=(i,d)=>i.frame?d.fromArray(i.frame):d.compose(new D(i.x,i.y-.15,i.z),new $t().setFromAxisAngle(new D(0,1,0),i.rot),new D(i.scale,i.scale,i.scale));let je=new D(1e9,0,0),dt=0,vt=[];const ma=a.treeReach??1400;function da(i){const d=new St,c=(we.nearTrees*(a.nearTreesScale??1))**2,x=(we.shadow?we.shadowBox*1.25+8:0)**2,A=ma**2;vt=[],dt=0,be.forEach((H,C)=>{let O=0,W=0,z=0;const[G,Z]=[Ye[C*2],Ye[C*2+1]];for(const P of H){const N=(P.x-i.x)**2+(P.z-i.z)**2;N>A||(fa(P,d),N<c?(Le[C].setMatrixAt(O,d),Oe[C].setMatrixAt(O,d),O++,vt.push(P)):Ve[C].setMatrixAt(W++,d),N<x&&(G.setMatrixAt(z,d),Z.setMatrixAt(z,d),z++))}Le[C].count=Oe[C].count=O,Ve[C].count=W,G.count=Z.count=z,dt+=O;for(const P of[Le[C],Oe[C],Ve[C],G,Z])P.instanceMatrix.needsUpdate=!0}),je.copy(i)}It(t);const va=650,se=new jt(bo(),ua,Math.max(1,n.length)),pa=n.map(i=>new St().compose(new D(i.x,i.y-i.scale*.25,i.z),new $t().setFromEuler(new ea(i.tilt,i.rot,i.tilt*.5)),new D(i.scale,i.scale*.7,i.scale*.9)));se.castShadow=!0,se.receiveShadow=!0,se.frustumCulled=!1,se.name="rocks",se.instanceMatrix.setUsage(Qt),se.count=0,r.add(se);function ga(i){let d=0;n.forEach((c,x)=>{(c.x-i.x)**2+(c.z-i.z)**2<va**2&&se.setMatrixAt(d++,pa[x])}),se.count=d,se.instanceMatrix.needsUpdate=!0}let we=s;function Ut(i){we=i,ft(we.grass,we.patch);for(const d of pe)d.lod=-1;je.set(1e9,0,0)}Ut(s);let Me=null,$e=0,pt=new D(0,-1,0);const xa=Math.ceil(h/90);function ba(i,d=!0){const c=po(i);F.uStars.value=i.stars??0,F.uSunDir.value.copy(c),F.uSunCol.value.copy(De(i.sun).multiplyScalar(i.sunI)),F.uZenith.value.copy(De(i.zenith)),F.uHorizon.value.copy(De(i.horizon)),F.uAmbSky.value.copy(De(i.ambSky).multiplyScalar(i.ambI)),F.uAmbGround.value.copy(De(i.ambGround).multiplyScalar(i.ambI)),F.uHaze.value=i.haze,F.uHazeFall.value=i.hazeFall,ge.uniforms.uCloud.value=i.cloud,d?(qt(k,[c.x,c.y,c.z],M),T.needsUpdate=!0,pt.copy(c),Me=null):pt.angleTo(c)>Ct.degToRad(.8)&&!Me&&(Me=[c.x,c.y,c.z],$e=0)}function wa(){if(!Me)return;const i=Math.min(h,$e+xa);qt(k,Me,S,[$e,i]),$e=i,$e>=h&&(M.set(S),T.needsUpdate=!0,pt.set(...Me),Me=null)}function Ma(i,d){if(!a.fine)return;const c=Math.round(i-R/2),x=Math.round(d-R/2),A=R/(I-1);for(let H=0;H<I;H++)for(let C=0;C<I;C++)X[H*I+C]=a.fine(c+C*A,x+H*A);L.needsUpdate=!0,_.set(i,d),ue.uniforms.uFineAt.value.set(c,x,R,I)}return{root:l,setHour:ba,setQuality:Ut,setTrees:It,setGround(i){b.set(i),g.needsUpdate=!0},setSoil(i,d,c){ae.uniforms.uSoil.value.set(d,c,i,0);const x=i>.01;ae.transparent!==x&&(ae.transparent=x,ae.needsUpdate=!0),ae.depthWrite=i<.5,Fe=i<.05},setGloom(i,d,c){F.uGloom.value.set(i.r,i.g,i.b,d),F.uGloomD.value=c},setClear(i,d,c,x,A){Ae[`uClear${i}`].value=d??y,Ae.uClearAt.value[i].set(c,x,d?A:.001)},update(i,d){const c=i.position;F.uTime.value=d,wa(),a.fine&&Math.hypot(c.x-_.x,c.z-_.y)>R*.22&&Ma(c.x,c.z),oe.position.copy(c),_e(c),ue.uniforms.uCenter.value.set(c.x,c.z),$&&($.visible=Fe&&c.y-Ne(c.x,c.z)<Je),Math.hypot(c.x-je.x,c.z-je.z)>12&&(da(c),ga(c))},colliders(){return vt.map(i=>({x:i.x,z:i.z,radius:xe[i.kind].radius*i.scale,cameraClearance:xe[i.kind].radius*i.scale+.3}))},sunAt(i,d){const c=u*m,x=Math.round((i+f)/c),A=Math.round((d+f)/c);return x<0||A<0||x>=h||A>=h?1:M[A*h+x]/255},stats:()=>({tiles:pe.length,nearTrees:dt})}}function ze(r,e){const t=r;for(const o of Object.keys(t.attributes))o!=="position"&&o!=="normal"&&t.deleteAttribute(o);const n=t.getAttribute("position"),s=new Float32Array(n.count),a=new D;for(let o=0;o<n.count;o++)s[o]=e(a.fromBufferAttribute(n,o));return t.setAttribute("aShade",new Tt(s,1)),t}function zt(r,e,t,n,s=1,a=1){let o=new ta(r,s);o.deleteAttribute("uv"),o=At(o);const u=o.getAttribute("position"),f=o.getAttribute("normal"),v=new D,l=me(n),m=Array.from({length:5},()=>new D(l()-.5,l()-.5,l()-.5).normalize());for(let h=0;h<u.count;h++){v.fromBufferAttribute(u,h);const p=v.clone().normalize();let M=1;for(const k of m)M+=Math.max(0,p.dot(k))**4*.22;v.copy(p).multiplyScalar(r*M),v.y*=a,v.add(e),u.setXYZ(h,v.x,v.y,v.z);const S=v.clone().sub(t).normalize().multiplyScalar(.7).add(p.multiplyScalar(.3)).normalize();f.setXYZ(h,S.x,S.y,S.z)}return o}function xo(r){const e=me(r*101+9);if(new D(0,1,0),r<3||r>=5){const l=r>=5,m=l?4.85:[8.5,10.5,7.5][r],h=l?2.75:m*.66,p=l?1.25:[2.6,2.1,3.2][r],M=l?1.2:[1.7,2.4,1.3][r],S=l?.55:1,k=l?[.15,.42]:[.16,.3],T=new yt(k[0],k[1],h+(l?.45:0),8,3);T.translate(0,(h+(l?.45:0))/2,0);const b=[0,1,2].map(_=>{const E=_/3*Math.PI*2+e(),Y=new yt(.07,.13,p*1.1,6);return Y.translate(0,p*.55,0),Y.applyMatrix4(new St().makeRotationFromEuler(new ea(Math.cos(E)*.8,0,Math.sin(E)*.8))),Y.translate(0,h*.8,0),Y}),g=ze(tt([T,...b].map(_=>(_.deleteAttribute("uv"),_))),_=>.55+.45*Math.min(1,_.y/h)),y=new D(0,h+M*.6,0),R=[],I=l?5:7+Math.floor(e()*3);for(let _=0;_<I;_++){const E=_/I*Math.PI*2+e()*.5,Y=(e()-.35)*M,F=p*(.55+e()*.35);R.push(zt((1.5+e()*.9)*S*(l?1.2:1),new D(Math.cos(E)*F,y.y+Y,Math.sin(E)*F),y,r*31+_))}R.push(zt(2.2*S,new D(0,y.y+M*.75,0),y,r*31+99));const X=ze(tt(R),_=>{const E=_.clone().sub(y);return Math.min(1,.5+.35*(E.y/(M+2)+.6)+.25*Math.hypot(E.x,E.z)/(p+2))}),L=ze(tt([zt(p+1.3*S,y.clone(),y.clone().setY(y.y-1),r+500,0,(M+2*S)/(p+1.3*S))]),_=>.6+.4*Math.min(1,Math.max(0,(_.y-y.y+2)/4)));return{trunk:g,crown:X,far:L,radius:l?.32:.3}}const t=r===3?13:10,n=[],s=new yt(.1,.32,t*.9,7,2);s.translate(0,t*.45,0),s.deleteAttribute("uv");for(let l=0;l<5;l++){const m=l/5,h=(r===3?2.6:3)*(1-m*.78),p=t*.34*(1-m*.35),M=t*(.18+m*.62);let S=new Kt(h,p,11,2);S.deleteAttribute("uv"),S=At(S);const k=S.getAttribute("position"),T=S.getAttribute("normal"),b=new D;for(let g=0;g<k.count;g++){b.fromBufferAttribute(k,g);const y=Math.hypot(b.x,b.z),R=1+.12*Math.sin(Math.atan2(b.z,b.x)*5+l*2);k.setXYZ(g,b.x*R,b.y+p/2+M-y/h*.5,b.z*R);const I=new D(b.x,h*.9,b.z).normalize();T.setXYZ(g,I.x,I.y,I.z)}n.push(S)}const a=ze(tt(n),l=>.5+.5*Math.min(1,Math.hypot(l.x,l.z)/2.2*.6+l.y/t*.5));let o=new Kt(r===3?2.6:3,t*.9,6,1);o.deleteAttribute("uv"),o.translate(0,t*.55,0);const u=o.getAttribute("position"),f=o.getAttribute("normal"),v=new D;for(let l=0;l<u.count;l++){v.fromBufferAttribute(u,l);const m=new D(v.x,1.6,v.z).normalize();f.setXYZ(l,m.x,m.y,m.z)}return o=ze(o,l=>.55+.45*Math.min(1,l.y/t)),{trunk:ze(s,l=>.5+.5*Math.min(1,l.y/t)),crown:a,far:o,radius:.3}}function bo(){let r=new ta(1,1);r.deleteAttribute("uv"),r=At(r);const e=r.getAttribute("position"),t=new D,n=me(5);for(let s=0;s<e.count;s++)t.fromBufferAttribute(e,s),t.multiplyScalar(.8+n()*.35),e.setXYZ(s,t.x,t.y,t.z);return r=r.toNonIndexed(),r.computeVertexNormals(),ze(r,s=>.55+.45*Math.min(1,Math.max(0,s.y+.6)))}export{go as C,yo as E,Fo as H,So as O,ko as Q,zo as R,$a as S,Ke as U,ie as W,Co as a,Po as b,qa as c,Ao as d,_o as e,Be as f,lt as g,fe as h,ee as i,To as p,me as r,po as s};
