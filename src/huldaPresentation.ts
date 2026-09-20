import * as THREE from 'three';
import { createHulda } from './huldaCharacter';
import { createWoodForms } from './huldaForms';

export const FORMS = ['human','burl','knot','leaf','ivy'] as const;
export type HuldaForm = typeof FORMS[number];
export const MORPH_SECONDS = .48;
export const HUMAN_CENTRE = .32;
type Weights = Record<HuldaForm,number>;
const weights = (form: HuldaForm): Weights => Object.fromEntries(FORMS.map(f=>[f,Number(f===form)])) as Weights;
const smooth = (t: number) => t*t*(3-2*t);

/** Finite, interruptible world-pose blend. Has no dependency on traversal or input. */
export class FormBlend {
  readonly position = new THREE.Vector3();
  readonly rotation = new THREE.Quaternion();
  weights = weights('human');
  form: HuldaForm = 'human';
  private fromWeights = weights('human');
  private fromPosition = new THREE.Vector3();
  private fromRotation = new THREE.Quaternion();
  private elapsed = MORPH_SECONDS;
  private initialized = false;
  private key = ''; 
  get active() { return this.elapsed < MORPH_SECONDS; }
  update(dt: number, form: HuldaForm, position: THREE.Vector3, rotation: THREE.Quaternion, key: string = form) {
    const seconds = Number.isFinite(dt) ? Math.max(0,Math.min(.05,dt)) : 0;
    if(!this.initialized) {
      this.initialized=true; this.key=key; this.form=form; this.weights=weights(form); this.position.copy(position); this.rotation.copy(rotation); return;
    }
    if(form!==this.form || key!==this.key) {
      // Snapshot the actual display, including an unfinished earlier transformation.
      this.form=form; this.key=key; this.fromWeights={...this.weights}; this.fromPosition.copy(this.position); this.fromRotation.copy(this.rotation); this.elapsed=0;
    } else this.elapsed=Math.min(MORPH_SECONDS,this.elapsed+seconds);
    const k=smooth(this.elapsed/MORPH_SECONDS);
    for(const f of FORMS) this.weights[f]=THREE.MathUtils.lerp(this.fromWeights[f],Number(f===form),k);
    if(this.active) {
      this.position.lerpVectors(this.fromPosition,position,k);
      this.rotation.slerpQuaternions(this.fromRotation,rotation,k);
    } else {
      this.position.copy(position);
      // Root reversal and junction changes rotate the knot instead of snapping it.
      this.rotation.slerp(rotation,1-Math.exp(-seconds*18));
    }
  }
}

/** Sole owner of the visible character. All forms share one world-space anchor. */
export function createHuldaPresentation(scene: THREE.Scene, leaf: THREE.Group, ivy: THREE.Group) {
  const root=new THREE.Group(); root.name='HuldaPresentation'; scene.add(root);
  const hulda=createHulda(), wood=createWoodForms(), blend=new FormBlend();
  const human=new THREE.Group(); human.add(hulda.group); human.position.y=-HUMAN_CENTRE;
  // Existing canopy/ivy geometry is retained for sprint 3, but ownership is unified now.
  leaf.removeFromParent(); ivy.removeFromParent(); leaf.position.set(0,-HUMAN_CENTRE,0); ivy.position.set(0,-HUMAN_CENTRE,0);
  const forms={human,burl:wood.burl,knot:wood.knot,leaf,ivy};
  const materials=new Map<HuldaForm,THREE.Material[]>();
  const ownedMaterials: THREE.Material[]=[];
  for(const form of FORMS) {
    root.add(forms[form]); const used: THREE.Material[]=[];
    // Clone per form, once, so fading a character never fades the forest's shared materials.
    const clones=new Map<THREE.Material,THREE.Material>();
    forms[form].traverse(o=>{ if(!(o instanceof THREE.Mesh)) return;
      const copy=(m: THREE.Material)=>{ let c=clones.get(m); if(!c) { c=m.clone(); c.userData.huldaAlphaTest=m.alphaTest; clones.set(m,c); used.push(c); ownedMaterials.push(c); } return c; };
      o.material=Array.isArray(o.material)?o.material.map(copy):copy(o.material);
    }); materials.set(form,used);
  }
  function update(dt: number, form: HuldaForm, position: THREE.Vector3, rotation: THREE.Quaternion, speed: number, heading: number, grounded: boolean, visible = true, key: string = form) {
    blend.update(dt,form,position,rotation,key);
    root.position.copy(blend.position); root.quaternion.copy(blend.rotation); root.visible=visible;
    const folding=1-blend.weights.human;
    hulda.update(dt,speed,heading,grounded,folding);
    for(const f of FORMS) {
      const w=blend.weights[f]; forms[f].visible=w>0;
      // A single overlapping silhouette: shrink into the new shape while bark wraps around it.
      forms[f].scale.setScalar(f==='human'?1-.42*folding:.65+.35*w);
      for(const m of materials.get(f)!) { m.transparent=w<1; m.opacity=w; m.depthWrite=w===1; m.alphaTest=m.userData.huldaAlphaTest*w; }
    }
  }
  function dispose() { root.removeFromParent(); hulda.dispose(); wood.dispose(); for(const m of ownedMaterials) m.dispose(); }
  return {root,hulda,blend,forms,update,dispose};
}
