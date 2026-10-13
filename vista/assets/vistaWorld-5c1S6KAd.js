import{b as ke,aj as ba,s as st,K as De,ap as ue,aq as $e,$ as ee,ah as it,ai as nt,ar as wa,as as Ma,j as oe,V as D,r as ya,d as za,at as Sa,au as Ca,av as Ta,X as Aa,aw as _a,ax as Fa,A as ka,ay as Pa,az as Da,G as Ut,a1 as _e,aA as gt,aB as xt,aC as bt,aD as Ht,a9 as Gt,aE as Wt,aF as Nt,aG as wt,D as Lt,J as Ba,k as Ea,P as Ra,I as Ot,o as zt,Q as Yt,p as Zt,aH as Vt,q as St,aI as Ia,m as Mt,z as jt,n as qt,t as Ct,aJ as Ua,aK as Ha}from"./mobilityControls-rUQEh3jo.js";import{m as tt,a as Tt}from"./BufferGeometryUtils-DVoyXHP5.js";const Jt={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ee{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ga=new ba(-1,1,1,-1,0,1);class Wa extends st{constructor(){super(),this.setAttribute("position",new De([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new De([0,2,0,0,2,0],2))}}const Na=new Wa;class At{constructor(e){this._mesh=new ke(Na,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ga)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class La extends Ee{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ue?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=$e.clone(e.uniforms),this.material=new ue({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new At(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class $t extends Ee{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let o,u;this.inverse?(o=0,u=1):(o=1,u=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),a.buffers.stencil.setClear(u),a.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}class Oa extends Ee{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class go{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new ee);this._width=n.width,this._height=n.height,t=new it(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:nt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new La(Jt),this.copyPass.material.blending=wa,this.clock=new Ma}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,a=this.passes.length;s<a;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const u=this.renderer.getContext(),h=this.renderer.state.buffers.stencil;h.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),h.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}$t!==void 0&&(o instanceof $t?n=!0:o instanceof Oa&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class xo extends Ee{constructor(e,t,n=null,s=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new oe}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let a,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const Ya={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new oe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Qe extends Ee{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ee(e.x,e.y):new ee(256,256),this.clearColor=new oe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new it(a,o,{type:nt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const c=new it(a,o,{type:nt});c.texture.name="UnrealBloomPass.h"+f,c.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(c);const p=new it(a,o,{type:nt});p.texture.name="UnrealBloomPass.v"+f,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),a=Math.round(a/2),o=Math.round(o/2)}const u=Ya;this.highPassUniforms=$e.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ue({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];const h=[3,5,7,9,11];a=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(h[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new ee(1/a,1/o),a=Math.round(a/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const v=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=v,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const l=Jt;this.copyUniforms=$e.clone(l.uniforms),this.blendMaterial=new ue({uniforms:this.copyUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader,blending:ya,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new oe,this.oldClearAlpha=1,this.basic=new za,this.fsQuad=new At(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(n,s),this.renderTargetsVertical[a].setSize(n,s),this.separableBlurMaterials[a].uniforms.invSize.value=new ee(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,a){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let u=this.renderTargetBright;for(let h=0;h<this.nMips;h++)this.fsQuad.material=this.separableBlurMaterials[h],this.separableBlurMaterials[h].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[h].uniforms.direction.value=Qe.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[h]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[h].uniforms.colorTexture.value=this.renderTargetsHorizontal[h].texture,this.separableBlurMaterials[h].uniforms.direction.value=Qe.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[h]),e.clear(),this.fsQuad.render(e),u=this.renderTargetsVertical[h];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new ue({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ee(.5,.5)},direction:{value:new ee(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new ue({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Qe.BlurDirectionX=new ee(1,0);Qe.BlurDirectionY=new ee(0,1);const Va={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class bo extends Ee{constructor(){super();const e=Va;this.uniforms=$e.clone(e.uniforms),this.material=new Sa({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new At(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ca.getTransfer(this._outputColorSpace)===Ta&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Aa?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===_a?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Fa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ka?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Pa?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Da&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Ke=2048,ea=513,ta=Ke/(ea-1),te=Ke/2,ne=40,aa=300,ja=200;function he(r){let e=r>>>0||1;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function lt(r){const e=he(r),t=new Uint8Array(512),n=[...Array(256).keys()];for(let u=255;u>0;u--){const h=Math.floor(e()*(u+1));[n[u],n[h]]=[n[h],n[u]]}for(let u=0;u<512;u++)t[u]=n[u&255];const s=new Float32Array(256),a=new Float32Array(256);for(let u=0;u<256;u++){const h=e()*Math.PI*2;s[u]=Math.cos(h),a[u]=Math.sin(h)}const o=u=>u*u*u*(u*(u*6-15)+10);return(u,h)=>{const v=Math.floor(u),l=Math.floor(h),f=u-v,c=h-l,p=v&255,M=l&255,S=(I,K,O,_)=>{const B=t[I+t[K]];return s[B]*O+a[B]*_},k=S(p,M,f,c),T=S(p+1,M,f-1,c),b=S(p,M+1,f,c-1),g=S(p+1,M+1,f-1,c-1),y=o(f),R=o(c);return 1.41*((k+(T-k)*y)*(1-R)+(b+(g-b)*y)*R)}}function Pe(r,e,t,n,s=2,a=.5){let o=0,u=1,h=1,v=0;for(let l=0;l<n;l++)o+=r(e*h+l*17.3,t*h-l*9.1)*u,v+=u,u*=a,h*=s;return o/v}function $a(r,e,t,n){let s=0,a=.5,o=1,u=1,h=0;for(let v=0;v<n;v++){let l=1-Math.abs(r(e*o+v*31.7,t*o+v*11.3));l*=l,l*=u,u=Math.min(1,l*1.6),s+=l*a,h+=a,a*=.5,o*=2.05}return s/h}const Be=(r,e,t)=>{const n=Math.min(1,Math.max(0,(t-r)/(e-r)));return n*n*(3-2*n)},de={x:0,z:260,rx:230,rz:380};function ut(r){return 170*Math.sin(r*.0019+.6)+60*Math.sin(r*.0051)}function Qa(r){const e=lt(r*7+1),t=lt(r*7+2),n=lt(r*7+3);return{base:(a,o)=>{const u=a+140*Pe(t,a*.0011,o*.0011,3),h=o+140*Pe(t,a*.0011+40,o*.0011-30,3),v=Math.abs(u-ut(h)),l=Be(110,760,v+90*Pe(n,a*.002,o*.002,2)),f=$a(e,u*.0016,h*.0016,6),c=Pe(n,a*.004,o*.004,4)*16+Pe(n,a*.012,o*.012,3)*4,p=Math.exp(-(((a-ut(o)*.4-de.x)/de.rx)**2+((o-de.z)/de.rz)**2));return ne+7+Math.max(0,(Math.abs(o)-500)*.02)+c*(1-l)+l**1.25*(80+520*f)+l*c*3-p*26},seed:r}}const Ka={droplets:7e4,steps:64,radius:2,inertia:.06,capacity:6,minSlope:.01,erode:.35,deposit:.25,evaporate:.018,gravity:6,scale:20};function wo(r=1,e={},t={}){const n=t.size??Ke,s=t.n??ea,a=n/(s-1),o=n/2,u=at(),h=t.shape??Qa(r),v=new Float32Array(s*s);for(let g=0;g<s;g++)for(let y=0;y<s;y++)v[g*s+y]=h.base(y*a-o,g*a-o);const l=at(),f=new Float32Array(s*s),c=new Float32Array(s*s),p={...Ka,...e};p.scale*=a/ta,Xa(v,f,c,r,p,s,a,t.erodeMask?(g,y)=>t.erodeMask(g*a-o,y*a-o):null);let M=0;for(let g=0;g<f.length;g++)f[g]=Math.log1p(f[g]),f[g]>M&&(M=f[g]);for(let g=0;g<f.length;g++)f[g]/=M||1;Qt(f,1,s),Qt(c,1,s);let S=0;for(const g of c)S=Math.max(S,g);for(let g=0;g<c.length;g++)c[g]=Math.min(1,c[g]/(S*.25||1));const k=at(),T=Za(v,s,a,t.erodeMask?(g,y)=>t.erodeMask(g*a-o,y*a-o)>.005:null);let b=-1/0;for(const g of v)g>b&&(b=g);return{seed:r,shape:h,size:n,n:s,cell:a,half:o,ceiling:b+30,waterY:t.waterY??ne,snowY:t.snowY??aa,surface:t.surface,h:v,flow:f,sediment:c,ao:T,ms:{shape:l-u,erosion:k-l,ao:at()-k}}}function at(){return typeof performance<"u"?performance.now():Date.now()}function Xa(r,e,t,n,s,a,o,u){const h=he(n*131+7),v=s.scale,l=s.radius,f=[],c=[];let p=0;for(let T=-l;T<=l;T++)for(let b=-l;b<=l;b++){const g=Math.hypot(b,T);if(g<=l){f.push(b,T);const y=1-g/l;c.push(y),p+=y}}for(let T=0;T<c.length;T++)c[T]/=p;const M=ja/o,S=(T,b)=>Be(0,M,Math.min(T,b,a-1-T,a-1-b)-l)*(u?u(T,b):1),k=T=>r[T]/v;for(let T=0;T<s.droplets;T++){let b=h()*(a-3)+1,g=h()*(a-3)+1,y=0,R=0,I=1,K=1,O=0;for(let _=0;u&&_<12&&u(Math.floor(b),Math.floor(g))<.05;_++)b=h()*(a-3)+1,g=h()*(a-3)+1;for(let _=0;_<s.steps;_++){const B=Math.floor(b),V=Math.floor(g),F=b-B,$=g-V,Q=V*a+B,ze=k(Q),le=k(Q+1),Ie=k(Q+a),Se=k(Q+a+1),re=(le-ze)*(1-$)+(Se-Ie)*$,Ze=(Ie-ze)*(1-F)+(Se-le)*F,Ue=ze*(1-F)*(1-$)+le*F*(1-$)+Ie*(1-F)*$+Se*F*$;y=y*s.inertia-re*(1-s.inertia),R=R*s.inertia-Ze*(1-s.inertia);const fe=Math.hypot(y,R);if(fe<1e-9||(y/=fe,R/=fe,b+=y,g+=R,b<1||g<1||b>=a-2||g>=a-2))break;const qe=Math.floor(b),Je=Math.floor(g),ve=b-qe,se=g-Je,Ce=Je*a+qe,ae=k(Ce)*(1-ve)*(1-se)+k(Ce+1)*ve*(1-se)+k(Ce+a)*(1-ve)*se+k(Ce+a+1)*ve*se-Ue,X=S(B,V);e[Q]+=K*X;const Te=Math.max(-ae,s.minSlope)*I*K*s.capacity;if(O>Te||ae>0){const Z=ae>0?Math.min(ae,O):(O-Te)*s.deposit;O-=Z;const G=Z*v*X;r[Q]+=G*(1-F)*(1-$),r[Q+1]+=G*F*(1-$),r[Q+a]+=G*(1-F)*$,r[Q+a+1]+=G*F*$,t[Q]+=Z*X}else{const Z=Math.min((Te-O)*s.erode,-ae);for(let G=0;G<c.length;G++){const He=B+f[G*2],me=V+f[G*2+1];if(He<0||me<0||He>=a||me>=a)continue;const et=me*a+He,Ge=Math.min(Z*c[G],r[et]/v)*X;r[et]-=Ge*v}O+=Z*X}I=Math.sqrt(Math.max(0,I*I-ae*s.gravity)),K*=1-s.evaporate}}}function Qt(r,e,t){const n=new Float32Array(r.length);for(let s=0;s<e;s++){for(let a=0;a<t;a++)for(let o=0;o<t;o++){const u=a*t+o;n[u]=(r[u]*2+r[a*t+Math.max(0,o-1)]+r[a*t+Math.min(t-1,o+1)])/4}for(let a=0;a<t;a++)for(let o=0;o<t;o++){const u=a*t+o;r[u]=(n[u]*2+n[Math.max(0,a-1)*t+o]+n[Math.min(t-1,a+1)*t+o])/4}}}function Za(r,e,t,n){const s=new Float32Array(e*e),a=[2,6,16],o=8;for(let u=0;u<e;u++)for(let h=0;h<e;h++){const v=u*e+h;let l=0;if(n&&!n(h,u)){s[v]=1;continue}for(const f of a){let c=0;for(let p=0;p<o;p++){const M=p/o*Math.PI*2,S=Math.min(e-1,Math.max(0,Math.round(h+Math.cos(M)*f))),k=Math.min(e-1,Math.max(0,Math.round(u+Math.sin(M)*f)));c+=Math.max(0,r[k*e+S]-r[v])/(f*t)}l+=c/o}s[v]=Math.max(0,1-l*.9)}return s}function ce(r,e,t){const{n,cell:s,half:a}=r,o=(e+a)/s,u=(t+a)/s;if(o<0||u<0||o>=n-1||u>=n-1)return r.shape.base(e,t);const h=Math.floor(o),v=Math.floor(u),l=o-h,f=u-v,c=v*n+h,p=r.h;return p[c]*(1-l)*(1-f)+p[c+1]*l*(1-f)+p[c+n]*(1-l)*f+p[c+n+1]*l*f}function oa(r,e,t,n){const{n:s,cell:a,half:o}=r,u=Math.min(s-1,Math.max(0,Math.round((t+o)/a))),h=Math.min(s-1,Math.max(0,Math.round((n+o)/a)));return e[h*s+u]}function ra(r,e,t,n=r.cell,s=(a,o)=>ce(r,a,o)){const a=s(e+n,t)-s(e-n,t),o=s(e,t+n)-s(e,t-n),u=-a,h=2*n,v=-o,l=Math.hypot(u,h,v);return[u/l,h/l,v/l]}function qa(r,e,t){return r.surface?r.surface(e,t):ce(r,e,t)}function ct(r,e,t){return 1-ra(r,e,t)[1]}function Kt(r,e,t=new Uint8Array(r.n*r.n),n=[0,r.n]){const{n:s,cell:a}=r,[o,u,h]=e,v=Math.hypot(o,h)||1e-6,l=u/v,f=o/v,c=h/v,p=r.h;if(u<=0)return t.fill(0,n[0]*s,n[1]*s),t;for(let M=n[0];M<n[1];M++)for(let S=0;S<s;S++){const k=p[M*s+S]+.5;let T=1,b=a*.75;for(let g=0;g<120&&T>0;g++){const y=S+f*b/a,R=M+c*b/a;if(y<0||R<0||y>=s-1||R>=s-1)break;const I=y|0,K=R|0,O=y-I,_=R-K,B=K*s+I,V=p[B]*(1-O)*(1-_)+p[B+1]*O*(1-_)+p[B+s]*(1-O)*_+p[B+s+1]*O*_,F=k+b*l;if(T=Math.min(T,(F-V)/(1.5+b*.02)*.5+.5),F>r.ceiling)break;b+=Math.max(a*.75,b*.06)}t[M*s+S]=Math.round(Math.min(1,Math.max(0,T))*255)}return t}const ot=7,Xt=150;function Mo(r,e=9e3){const t=he(r.seed*977+3),n=lt(r.seed*13+5),s=[];for(let a=-te+20;a<te-20;a+=ot)for(let o=-te+20;o<te-20;o+=ot){const u=o+(t()-.5)*ot*.9,h=a+(t()-.5)*ot*.9,v=ce(r,u,h);if(v<ne+2.5||v>aa-30)continue;const l=ct(r,u,h);if(l>.22)continue;const f=Pe(n,u*.0045,h*.0045,4)+.2*oa(r,r.flow,u,h)-(v>Xt?0:.06),c=Be(.02,.32,f)*(1-Be(.12,.22,l));if(t()>c*.95+(t()<.004?1:0))continue;const p=v>Xt+(t()-.5)*60||f>.3&&t()<.25;if(s.push({x:u,z:h,y:v,kind:p?3+Math.floor(t()*2):Math.floor(t()*3),scale:.75+t()*.55,rot:t()*Math.PI*2}),s.length>=e)return s}return s}function yo(r,e=900){const t=he(r.seed*389+11),n=[];for(let s=0;s<e*30&&n.length<e;s++){const a=(t()-.5)*(Ke-60),o=(t()-.5)*(Ke-60),u=ce(r,a,o),h=ct(r,a,o);if(u<ne-1.5)continue;const v=oa(r,r.sediment,a,o),l=.02+.5*Be(.1,.35,h)*(1-Be(.5,.7,h))+.4*v;t()>l||n.push({x:a,z:o,y:u,scale:.4+t()**3*4.5,rot:t()*Math.PI*2,tilt:(t()-.5)*.5})}return n}function Ja(r,e,t,n,s,a,o){const u=Math.hypot(s-e,o-n),h=Math.ceil(u/(ta*2));for(let v=2;v<h-2;v++){const l=v/h;if(ce(r,e+(s-e)*l,n+(o-n)*l)>t+(a-t)*l)return!1}return!0}const rt=(r,e,t,n)=>Math.atan2(-(t-r),-(n-e));function zo(r){const e={x:de.x+ut(de.z)*.4,z:de.z},t=[];let n={x:0,z:0,y:-1/0};for(let l=-te+120;l<te-120;l+=16)for(let f=-te+120;f<te-120;f+=16){const c=ce(r,f,l);c>n.y&&(n={x:f,z:l,y:c})}const s=l=>{let f={x:0,z:0},c=-1/0;for(let p=-te+140;p<te-140;p+=12)for(let M=-te+140;M<te-140;M+=12){const S=l(M,p,ce(r,M,p));S>c&&(c=S,f={x:M,z:p})}return f},a=(l,f)=>{if(ct(r,l,f)>.12)return!1;const c=ce(r,l,f);return[[.3,0],[-.3,0],[0,.3],[0,-.3]].every(([p,M])=>Math.abs(ce(r,l+p,f+M)-c)<.15)},o=s((l,f,c)=>c<ne+.6||c>ne+3||!a(l,f)?-1/0:-Math.abs(Math.hypot(l-e.x,f-e.z)-260)+(Math.hypot(l-n.x,f-n.z)>Math.hypot(e.x-n.x,e.z-n.z)?120:0));t.push({name:"Lakeshore",...o,yaw:rt(o.x,o.z,e.x,e.z),pitch:.02});const u=s((l,f,c)=>!a(l,f)||c<ne+3||Math.abs(l-ut(f))>120?-1/0:-Math.abs(f-(de.z-900))-ct(r,l,f)*400);t.push({name:"Valley meadow",...u,yaw:rt(u.x,u.z,e.x,e.z),pitch:.04});const h=s((l,f,c)=>{if(c<ne+140||c>ne+280||!a(l,f))return-1/0;const p=Math.hypot(l-e.x,f-e.z);return p<450||p>900?-1/0:Ja(r,l,c+2,f,e.x,ne,e.z)?1e3-p:-1/0});t.push({name:"Ridge over the lake",...h,yaw:rt(h.x,h.z,e.x,e.z),pitch:-.12});const v=s((l,f,c)=>a(l,f)?c:-1/0);return t.push({name:"Summit",...v,yaw:rt(v.x,v.z,e.x,e.z),pitch:-.1}),t}const ye=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm3(vec2 p){ return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.3 + vnoise(p * 4.1 - 3.7) * 0.2; }
float fbm5(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.02 + vec2(5.3, -2.7); a *= 0.5; } return s / 0.97; }
vec3 srgb(vec3 c){ return pow(c, vec3(2.2)); }
`,Re=`
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
`,_t=`
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
`,Ft=`
#include <common>
#include <shadowmap_pars_vertex>
`,kt=`
#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
`,Xe=`
#include <tonemapping_fragment>
#include <colorspace_fragment>
`,eo=`
${Ft}
varying vec3 vWorld; varying vec3 vNormal;
void main(){
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec3 transformedNormal = normalMatrix * normal;
  vWorld = worldPosition.xyz; vNormal = normal;
  #include <shadowmap_vertex>
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,to=`
${kt}
${ye}${Re}${ht}${_t}
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
  float vis = min(md.r, getShadowMask());
  vec3 col = toon(albedo, n, vis, mix(0.55, 1.0, md.g));
  float soil = 1.0 - 0.78 * uSoil.z * (1.0 - smoothstep(14.0, 28.0, distance(vWorld.xz, uSoil.xy)));
  gl_FragColor = vec4(applyHaze(col, vWorld), soil);
  ${Xe}
}`,ao=`
${Ft}
${ye}${Re}${ht}${_t}
attribute vec4 aBlade; // x, z in the patch; size; rotation
attribute vec4 aTuft; // the blade within its tuft: angle, offset x, offset z, height
uniform vec2 uCenter; uniform float uPatch; uniform float uBladeH; uniform float uBladeW; uniform vec2 uWind;
// Where nothing grows (paths, floors, the green): up to three masks, each a square (x0, z0, side) drawn from above (north up, so v runs against z).
uniform sampler2D uClear0; uniform sampler2D uClear1; uniform sampler2D uClear2; uniform vec3 uClearAt[3];
// The ground near her at a finer step than the map (x0, z0, side, texels): blades stand on the walked surface.
uniform highp sampler2D uFine; uniform vec4 uFineAt;
float cleared(vec2 xz){
  float c = 0.0; vec2 u;
  u = (xz - uClearAt[0].xy) / uClearAt[0].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear0, u).r);
  u = (xz - uClearAt[1].xy) / uClearAt[1].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear1, u).r);
  u = (xz - uClearAt[2].xy) / uClearAt[2].z; u.y = 1.0 - u.y; if (all(greaterThan(u, vec2(0.0))) && all(lessThan(u, vec2(1.0)))) c = max(c, texture2D(uClear2, u).r);
  return c;
}
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
  float hgt = uBladeH * (0.45 + 0.55 * aBlade.z) * smoothstep(0.3, 0.7, g) * fade * (1.0 + md.b * 0.8) * (0.7 + 0.6 * vnoise(xz * 0.08)) * (1.0 - smoothstep(0.2, 0.5, cleared(xz)));
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
}`,oo=`
${kt}
${ye}${Re}
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
  ${Xe}
}`,ro=`
${Ft}
${ye}
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
}`,so=`
${kt}
${ye}${Re}${ht}
#ifdef ROCK
${_t}
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
  ${Xe}
}`,io=`
varying vec3 vWorld;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,no=`
${ye}${Re}${ht}
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
  ${Xe}
}`,lo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 w = modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.99999; }`,uo=`
${ye}${Re}
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
  ${Xe}
}`,So=[{name:"Morning",elevation:14,azimuth:70,sun:"#ffd9a8",sunI:2.3,zenith:"#5d8fd0",horizon:"#d8dde0",ambSky:"#b4cbea",ambGround:"#7a7658",ambI:.85,haze:.0011,hazeFall:1/90,cloud:.4,exposure:1},{name:"Midday",elevation:58,azimuth:150,sun:"#fff4e0",sunI:2.4,zenith:"#3f7fd8",horizon:"#c8def0",ambSky:"#b0cdf2",ambGround:"#7c8656",ambI:.9,haze:42e-5,hazeFall:1/260,cloud:.55,exposure:.95},{name:"Golden hour",elevation:12,azimuth:205,sun:"#ffb070",sunI:2.7,zenith:"#5a7bbf",horizon:"#f2c9a0",ambSky:"#aab8de",ambGround:"#6e5c48",ambI:.88,haze:6e-4,hazeFall:1/200,cloud:.5,exposure:1.05},{name:"Dusk",elevation:2,azimuth:200,sun:"#ff7a4a",sunI:1.5,zenith:"#2c3a6e",horizon:"#e79a7c",ambSky:"#7680b0",ambGround:"#443a44",ambI:.8,haze:7e-4,hazeFall:1/200,cloud:.45,exposure:1.2}];function co(r){const e=St.degToRad(r.elevation),t=St.degToRad(r.azimuth);return new D(Math.sin(t)*Math.cos(e),Math.sin(e),-Math.cos(t)*Math.cos(e)).normalize()}const Co=[{name:"Low",grass:9e3,patch:44,shadow:0,shadowBox:0,nearTrees:110,bloom:!1,dprMin:.6,dprMax:1,lod:[200,450,900]},{name:"Medium",grass:22e3,patch:58,shadow:1024,shadowBox:38,nearTrees:170,bloom:!0,dprMin:.7,dprMax:1.35,lod:[280,600,1100]},{name:"High",grass:42e3,patch:76,shadow:2048,shadowBox:60,nearTrees:240,bloom:!0,dprMin:.8,dprMax:2,lod:[380,800,1500]}],Fe=(r,e=1)=>new oe(r).multiplyScalar(e),ho=1;function To(r,e,t,n,s,a={}){const{n:o,cell:u,half:h,size:v}=e,l=new Ut;l.name="vista",r.add(l),r=l;const f=o>600?2:1,c=(o-1)/f+1,p=new Uint8Array(o*o*4),M=new Uint8Array(c*c),S=new Uint8Array(c*c),k=f===1?e:{...e,n:c,cell:u*f,h:(()=>{const i=new Float32Array(c*c);for(let d=0;d<c;d++)for(let m=0;m<c;m++)i[d*c+m]=e.h[d*f*o+m*f];return i})()},T=new _e(M,c,c,gt,xt);T.magFilter=T.minFilter=bt,T.wrapS=T.wrapT=Ht;const b=new Uint8Array(o*o*4);a.ground&&b.set(a.ground);const g=new _e(b,o,o,Gt,xt);g.magFilter=g.minFilter=bt,g.needsUpdate=!0;const y=new _e(new Uint8Array(4),1,1);y.needsUpdate=!0;const R=96,I=97,K=new Float32Array(I*I),O=new _e(K,I,I,gt,Wt);O.magFilter=O.minFilter=Nt;let _=new ee(1e9,1e9);for(let i=0;i<o*o;i++)p[i*4+1]=Math.round(e.ao[i]*255),p[i*4+2]=Math.round(e.flow[i]*255),p[i*4+3]=Math.round(e.sediment[i]*255);const B=new _e(p,o,o,Gt,xt);B.magFilter=B.minFilter=bt,B.wrapS=B.wrapT=Ht;const V=new _e(new Float32Array(e.h),o,o,gt,Wt);V.magFilter=V.minFilter=Nt,V.needsUpdate=!0;const F={uSunDir:{value:new D(0,1,0)},uSunCol:{value:new oe},uZenith:{value:new oe},uHorizon:{value:new oe},uAmbSky:{value:new oe},uAmbGround:{value:new oe},uHaze:{value:5e-4},uHazeFall:{value:1/200},uHazeBase:{value:a.hazeBase??e.waterY},uTime:{value:0},uMapData:{value:B},uSunTex:{value:T},uGround:{value:g},uHeight:{value:V},uMapHalf:{value:h},uCell:{value:u},uN:{value:o},uSunN:{value:c},uWaterY:{value:Number.isFinite(e.waterY)?e.waterY:-1e4},uSnowY:{value:e.snowY},uGloom:{value:new wt(0,0,0,0)},uGloomD:{value:.03},uStars:{value:0}},$=(i,d,m={},x={})=>{const A={...$e.merge([Ia.lights]),...F,...m};return new ue({uniforms:A,vertexShader:i,fragmentShader:d,lights:!0,defines:x})},Q=16,ze=(o-1)/Q,le=ze*u,Ie=110,Se=e.surface&&a.fineLod?[.5,1,2,4,8]:[1,2,4,8],re=$(eo,to,{uSoil:{value:new wt(0,0,0,0)}});re.side=Lt;const Ze=(i,d)=>qa(e,i,d),Ue=new Ut;Ue.name="terrain",r.add(Ue);const fe=[];function qe(i,d,m){const x=ze/m,A=i*le-h,H=d*le-h,C=m*u,Y=4+m*3,L=(x+1)*(x+1),z=new Float32Array((L+4*x)*3),W=new Float32Array((L+4*x)*3),q=[];for(let w=0;w<=x;w++)for(let U=0;U<=x;U++){const E=A+U*C,J=H+w*C,j=(w*(x+1)+U)*3,we=ra(e,E,J,Math.max(e.surface?1:u,C*.75),Ze);z[j]=E,z[j+1]=Ze(E,J),z[j+2]=J,W[j]=we[0],W[j+1]=we[1],W[j+2]=we[2]}for(let w=0;w<x;w++)for(let U=0;U<x;U++){const E=w*(x+1)+U,J=E+1,j=E+x+1,we=j+1;q.push(E,j,J,J,j,we)}const P=[];for(let w=0;w<x;w++)P.push(w);for(let w=0;w<x;w++)P.push(w*(x+1)+x);for(let w=x;w>0;w--)P.push(x*(x+1)+w);for(let w=x;w>0;w--)P.push(w*(x+1));P.forEach((w,U)=>{const E=(L+U)*3;z[E]=z[w*3],z[E+1]=z[w*3+1]-Y,z[E+2]=z[w*3+2],W[E]=W[w*3],W[E+1]=W[w*3+1],W[E+2]=W[w*3+2]});for(let w=0;w<P.length;w++){const U=P[w],E=P[(w+1)%P.length],J=L+w,j=L+(w+1)%P.length;q.push(U,J,E,E,J,j)}const N=new st;return N.setAttribute("position",new Ct(z,3)),N.setAttribute("normal",new Ct(W,3)),N.setIndex(q),N.computeBoundingSphere(),N}for(let i=0;i<Q;i++)for(let d=0;d<Q;d++){const m={mesh:new ke(void 0,re),lod:-1,geos:[],cx:(d+.5)*le-h,cz:(i+.5)*le-h};m.mesh.receiveShadow=!0,m.mesh.matrixAutoUpdate=!1,m.mesh.userData={ti:d,tj:i},Ue.add(m.mesh),fe.push(m)}function Je(i){var H;const[d,m,x]=xe.lod,A=Se.length>4?1:0;for(const C of fe){const Y=Math.max(0,Math.hypot(C.cx-i.x,C.cz-i.z)-le*.7),L=(A&&Y<Ie?-1:Y<d?0:Y<m?1:Y<x?2:3)+A;if(L!==C.lod){C.lod=L,(H=C.geos)[L]??(H[L]=qe(C.mesh.userData.ti,C.mesh.userData.tj,Se[L])),C.mesh.geometry=C.geos[L];for(let z=0;z<L-1;z++)C.geos[z]&&(C.geos[z].dispose(),C.geos[z]=void 0)}}}{const i=Math.max(7e3,h+4500),d=80,m=Math.round(2*i/d),x=[],A=[],H=[],C=h-d,Y=new Int32Array((m+1)*(m+1)).fill(-1),L=(P,N)=>{const w=-i+P*d,U=-i+N*d;return!(w>=-C&&w+d<=C&&U>=-C&&U+d<=C)},z=(P,N)=>{const w=N*(m+1)+P;if(Y[w]>=0)return Y[w];const U=-i+P*d,E=-i+N*d,J=Math.abs(U)<=h&&Math.abs(E)<=h,j=(ga,xa)=>e.shape.base(ga,xa),we=j(U,E)-(J?6:0),Ae=d,Rt=-(j(U+Ae,E)-j(U-Ae,E)),It=-(j(U,E+Ae)-j(U,E-Ae)),pt=Math.hypot(Rt,2*Ae,It);return Y[w]=x.length/3,x.push(U,we,E),A.push(Rt/pt,2*Ae/pt,It/pt),Y[w]};for(let P=0;P<m;P++)for(let N=0;N<m;N++)if(L(N,P)){const w=z(N,P),U=z(N+1,P),E=z(N,P+1),J=z(N+1,P+1);H.push(w,E,U,U,E,J)}const W=new st;W.setAttribute("position",new De(x,3)),W.setAttribute("normal",new De(A,3)),W.setIndex(H),W.computeBoundingSphere();const q=new ke(W,re);q.name="far-ring",q.frustumCulled=!1,r.add(q)}const ve=new ue({uniforms:{...F,uCloud:{value:.5}},vertexShader:lo,fragmentShader:uo,side:Ba,depthWrite:!1}),se=new ke(new Ea(8e3,48,24),ve);se.name="sky",se.frustumCulled=!1,se.renderOrder=-10,r.add(se);const Ce=new ue({uniforms:{...F},vertexShader:io,fragmentShader:no,transparent:!0,depthWrite:!1}),ft=new Ra(v,v,8,8);ft.rotateX(-Math.PI/2);const ae=new ke(ft,Ce);ae.position.y=e.waterY,ae.name="lake",ae.visible=Number.isFinite(e.waterY),r.add(ae);const X=$(ao,oo,{uCenter:{value:new ee},uPatch:{value:60},uBladeH:{value:a.bladeH??.34},uBladeW:{value:.045},uWind:{value:new ee(.94,.34)},uClear0:{value:y},uClear1:{value:y},uClear2:{value:y},uClearAt:{value:[new D(0,0,.001),new D(0,0,.001),new D(0,0,.001)]},uFine:{value:O},uFineAt:{value:new wt(0,0,1,0)}});X.side=Lt;const Te=3,Z=new st;{const i=[],d=[],m=[],x=he(3);for(let A=0;A<Te;A++){const H=A/Te*Math.PI*2+x()*.6,C=(x()-.5)*.12,Y=(x()-.5)*.12,L=.65+x()*.55,z=i.length/3;for(const[W,q]of[[-.5,0],[.5,0],[-.5,.35],[.5,.35],[-.5,.7],[.5,.7],[0,1]])i.push(W,q,0),d.push(H,C,Y,L);m.push(z,z+1,z+2,z+2,z+1,z+3,z+2,z+3,z+4,z+4,z+3,z+5,z+4,z+5,z+6)}Z.setAttribute("position",new De(i,3)),Z.setAttribute("aTuft",new De(d,4)),Z.setIndex(m)}let G=null;function He(i,d){if(G&&(G.geometry.dispose(),r.remove(G),G=null),!i)return;const m=new Ua;m.index=Z.index,m.setAttribute("position",Z.getAttribute("position")),m.setAttribute("aTuft",Z.getAttribute("aTuft"));const x=he(77),A=new Float32Array(i*4);for(let H=0;H<i;H++)A[H*4]=x()*d,A[H*4+1]=x()*d,A[H*4+2]=x(),A[H*4+3]=x()*Math.PI*2;m.setAttribute("aBlade",new Ha(A,4)),m.instanceCount=i,G=new ke(m,X),G.frustumCulled=!1,G.receiveShadow=!0,G.name="grass",r.add(G),X.uniforms.uPatch.value=d}const me=(i,d)=>$(ro,so,{uColor:{value:i?Fe(i):new oe}},d),et=me(null,{ROCK:""}),Ge=["#5c9a34","#4f8a32","#7aa83a","#2f6a4a","#3c7440","#5f9a3a","#3a2c4a","#24162c"],sa=["#8a7058","#8a7058","#8a7058","#8a7058","#8a7058","#87705a","#3a3040","#1a1218"],Pt=Ge.map(i=>me(i,{USE_SWAY:""})),ia=Ge.map(i=>me(i,{})),Dt=sa.map(i=>me(i,{})),pe=Ge.map((i,d)=>fo(d)),We=(i,d,m,x)=>{const A=new Ot(i,d,Math.max(1,m));return A.count=0,A.frustumCulled=!1,A.castShadow=x,A.receiveShadow=!0,A.instanceMatrix.setUsage(Vt),r.add(A),A};let ge=[],Ne=[],Le=[],Oe=[],Ye=[];function Bt(i){for(const d of[...Ne,...Le,...Oe,...Ye])r.remove(d),d.dispose();ge=pe.map((d,m)=>i.filter(x=>x.kind===m)),Ne=pe.map((d,m)=>We(d.trunk,Dt[m],ge[m].length,!1)),Le=pe.map((d,m)=>We(d.crown,Pt[m],ge[m].length,!1)),Oe=pe.flatMap((d,m)=>[We(d.trunk,Dt[m],ge[m].length,!0),We(d.crown,Pt[m],ge[m].length,!0)]);for(const d of Oe)d.layers.set(ho);Ye=pe.map((d,m)=>We(d.far,ia[m],ge[m].length,!1)),Ve.set(1e9,0,0)}const na=(i,d)=>d.compose(new D(i.x,i.y-.15,i.z),new Yt().setFromAxisAngle(new D(0,1,0),i.rot),new D(i.scale,i.scale,i.scale));let Ve=new D(1e9,0,0),mt=0,dt=[];const la=a.treeReach??1400;function ua(i){const d=new zt,m=(xe.nearTrees*(a.nearTreesScale??1))**2,x=(xe.shadow?xe.shadowBox*1.6+15:0)**2,A=la**2;dt=[],mt=0,ge.forEach((H,C)=>{let Y=0,L=0,z=0;const[W,q]=[Oe[C*2],Oe[C*2+1]];for(const P of H){const N=(P.x-i.x)**2+(P.z-i.z)**2;N>A||(na(P,d),N<m?(Ne[C].setMatrixAt(Y,d),Le[C].setMatrixAt(Y,d),Y++,dt.push(P)):Ye[C].setMatrixAt(L++,d),N<x&&(W.setMatrixAt(z,d),q.setMatrixAt(z,d),z++))}Ne[C].count=Le[C].count=Y,Ye[C].count=L,W.count=q.count=z,mt+=Y;for(const P of[Ne[C],Le[C],Ye[C],W,q])P.instanceMatrix.needsUpdate=!0}),Ve.copy(i)}Bt(t);const ca=650,ie=new Ot(mo(),et,Math.max(1,n.length)),ha=n.map(i=>new zt().compose(new D(i.x,i.y-i.scale*.25,i.z),new Yt().setFromEuler(new Zt(i.tilt,i.rot,i.tilt*.5)),new D(i.scale,i.scale*.7,i.scale*.9)));ie.castShadow=!0,ie.receiveShadow=!0,ie.frustumCulled=!1,ie.name="rocks",ie.instanceMatrix.setUsage(Vt),ie.count=0,r.add(ie);function fa(i){let d=0;n.forEach((m,x)=>{(m.x-i.x)**2+(m.z-i.z)**2<ca**2&&ie.setMatrixAt(d++,ha[x])}),ie.count=d,ie.instanceMatrix.needsUpdate=!0}let xe=s;function Et(i){xe=i,He(xe.grass,xe.patch);for(const d of fe)d.lod=-1;Ve.set(1e9,0,0)}Et(s);let be=null,je=0,vt=new D(0,-1,0);const ma=Math.ceil(c/90);function da(i,d=!0){const m=co(i);F.uStars.value=i.stars??0,F.uSunDir.value.copy(m),F.uSunCol.value.copy(Fe(i.sun).multiplyScalar(i.sunI)),F.uZenith.value.copy(Fe(i.zenith)),F.uHorizon.value.copy(Fe(i.horizon)),F.uAmbSky.value.copy(Fe(i.ambSky).multiplyScalar(i.ambI)),F.uAmbGround.value.copy(Fe(i.ambGround).multiplyScalar(i.ambI)),F.uHaze.value=i.haze,F.uHazeFall.value=i.hazeFall,ve.uniforms.uCloud.value=i.cloud,d?(Kt(k,[m.x,m.y,m.z],M),T.needsUpdate=!0,vt.copy(m),be=null):vt.angleTo(m)>St.degToRad(.8)&&!be&&(be=[m.x,m.y,m.z],je=0)}function va(){if(!be)return;const i=Math.min(c,je+ma);Kt(k,be,S,[je,i]),je=i,je>=c&&(M.set(S),T.needsUpdate=!0,vt.set(...be),be=null)}function pa(i,d){if(!a.fine)return;const m=Math.round(i-R/2),x=Math.round(d-R/2),A=R/(I-1);for(let H=0;H<I;H++)for(let C=0;C<I;C++)K[H*I+C]=a.fine(m+C*A,x+H*A);O.needsUpdate=!0,_.set(i,d),X.uniforms.uFineAt.value.set(m,x,R,I)}return{root:l,setHour:da,setQuality:Et,setTrees:Bt,setGround(i){b.set(i),g.needsUpdate=!0},setSoil(i,d,m){re.uniforms.uSoil.value.set(d,m,i,0);const x=i>.01;re.transparent!==x&&(re.transparent=x,re.needsUpdate=!0),re.depthWrite=i<.5,G&&(G.visible=i<.05)},setGloom(i,d,m){F.uGloom.value.set(i.r,i.g,i.b,d),F.uGloomD.value=m},setClear(i,d,m,x,A){X.uniforms[`uClear${i}`].value=d??y,X.uniforms.uClearAt.value[i].set(m,x,d?A:.001)},update(i,d){const m=i.position;F.uTime.value=d,va(),a.fine&&Math.hypot(m.x-_.x,m.z-_.y)>R*.22&&pa(m.x,m.z),se.position.copy(m),Je(m),X.uniforms.uCenter.value.set(m.x,m.z),Math.hypot(m.x-Ve.x,m.z-Ve.z)>12&&(ua(m),fa(m))},colliders(){return dt.map(i=>({x:i.x,z:i.z,radius:pe[i.kind].radius*i.scale,cameraClearance:pe[i.kind].radius*i.scale+.3}))},sunAt(i,d){const m=u*f,x=Math.round((i+h)/m),A=Math.round((d+h)/m);return x<0||A<0||x>=c||A>=c?1:M[A*c+x]/255},stats:()=>({tiles:fe.length,nearTrees:mt})}}function Me(r,e){const t=r;for(const o of Object.keys(t.attributes))o!=="position"&&o!=="normal"&&t.deleteAttribute(o);const n=t.getAttribute("position"),s=new Float32Array(n.count),a=new D;for(let o=0;o<n.count;o++)s[o]=e(a.fromBufferAttribute(n,o));return t.setAttribute("aShade",new Ct(s,1)),t}function yt(r,e,t,n,s=1,a=1){let o=new qt(r,s);o.deleteAttribute("uv"),o=Tt(o);const u=o.getAttribute("position"),h=o.getAttribute("normal"),v=new D,l=he(n),f=Array.from({length:5},()=>new D(l()-.5,l()-.5,l()-.5).normalize());for(let c=0;c<u.count;c++){v.fromBufferAttribute(u,c);const p=v.clone().normalize();let M=1;for(const k of f)M+=Math.max(0,p.dot(k))**4*.22;v.copy(p).multiplyScalar(r*M),v.y*=a,v.add(e),u.setXYZ(c,v.x,v.y,v.z);const S=v.clone().sub(t).normalize().multiplyScalar(.7).add(p.multiplyScalar(.3)).normalize();h.setXYZ(c,S.x,S.y,S.z)}return o}function fo(r){const e=he(r*101+9);if(new D(0,1,0),r<3||r>=5){const l=r>=5,f=l?4.85:[8.5,10.5,7.5][r],c=l?2.75:f*.66,p=l?1.25:[2.6,2.1,3.2][r],M=l?1.2:[1.7,2.4,1.3][r],S=l?.55:1,k=l?[.15,.42]:[.16,.3],T=new Mt(k[0],k[1],c+(l?.45:0),8,3);T.translate(0,(c+(l?.45:0))/2,0);const b=[0,1,2].map(_=>{const B=_/3*Math.PI*2+e(),V=new Mt(.07,.13,p*1.1,6);return V.translate(0,p*.55,0),V.applyMatrix4(new zt().makeRotationFromEuler(new Zt(Math.cos(B)*.8,0,Math.sin(B)*.8))),V.translate(0,c*.8,0),V}),g=Me(tt([T,...b].map(_=>(_.deleteAttribute("uv"),_))),_=>.55+.45*Math.min(1,_.y/c)),y=new D(0,c+M*.6,0),R=[],I=7+Math.floor(e()*3);for(let _=0;_<I;_++){const B=_/I*Math.PI*2+e()*.5,V=(e()-.35)*M,F=p*(.55+e()*.35);R.push(yt((1.5+e()*.9)*S,new D(Math.cos(B)*F,y.y+V,Math.sin(B)*F),y,r*31+_))}R.push(yt(2.2*S,new D(0,y.y+M*.75,0),y,r*31+99));const K=Me(tt(R),_=>{const B=_.clone().sub(y);return Math.min(1,.5+.35*(B.y/(M+2)+.6)+.25*Math.hypot(B.x,B.z)/(p+2))}),O=Me(tt([yt(p+1.3*S,y.clone(),y.clone().setY(y.y-1),r+500,0,(M+2*S)/(p+1.3*S))]),_=>.6+.4*Math.min(1,Math.max(0,(_.y-y.y+2)/4)));return{trunk:g,crown:K,far:O,radius:l?.32:.3}}const t=r===3?13:10,n=[],s=new Mt(.1,.32,t*.9,7,2);s.translate(0,t*.45,0),s.deleteAttribute("uv");for(let l=0;l<5;l++){const f=l/5,c=(r===3?2.6:3)*(1-f*.78),p=t*.34*(1-f*.35),M=t*(.18+f*.62);let S=new jt(c,p,11,2);S.deleteAttribute("uv"),S=Tt(S);const k=S.getAttribute("position"),T=S.getAttribute("normal"),b=new D;for(let g=0;g<k.count;g++){b.fromBufferAttribute(k,g);const y=Math.hypot(b.x,b.z),R=1+.12*Math.sin(Math.atan2(b.z,b.x)*5+l*2);k.setXYZ(g,b.x*R,b.y+p/2+M-y/c*.5,b.z*R);const I=new D(b.x,c*.9,b.z).normalize();T.setXYZ(g,I.x,I.y,I.z)}n.push(S)}const a=Me(tt(n),l=>.5+.5*Math.min(1,Math.hypot(l.x,l.z)/2.2*.6+l.y/t*.5));let o=new jt(r===3?2.6:3,t*.9,6,1);o.deleteAttribute("uv"),o.translate(0,t*.55,0);const u=o.getAttribute("position"),h=o.getAttribute("normal"),v=new D;for(let l=0;l<u.count;l++){v.fromBufferAttribute(u,l);const f=new D(v.x,1.6,v.z).normalize();h.setXYZ(l,f.x,f.y,f.z)}return o=Me(o,l=>.55+.45*Math.min(1,l.y/t)),{trunk:Me(s,l=>.5+.5*Math.min(1,l.y/t)),crown:a,far:o,radius:.3}}function mo(){let r=new qt(1,1);r.deleteAttribute("uv"),r=Tt(r);const e=r.getAttribute("position"),t=new D,n=he(5);for(let s=0;s<e.count;s++)t.fromBufferAttribute(e,s),t.multiplyScalar(.8+n()*.35),e.setXYZ(s,t.x,t.y,t.z);return r=r.toNonIndexed(),r.computeVertexNormals(),Me(r,s=>.55+.45*Math.min(1,Math.max(0,s.y+.6)))}export{ho as C,go as E,So as H,bo as O,Co as Q,xo as R,La as S,Qe as U,ne as W,wo as a,To as b,yo as c,zo as d,te as e,Pe as f,lt as g,ce as h,Mo as p,$a as r,co as s};
