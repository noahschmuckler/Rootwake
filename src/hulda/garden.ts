import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from '../colors';
import { FORMS } from './state';
const leafGeo=new T.IcosahedronGeometry(1,0), woodGeo=new T.CylinderGeometry(1,1,1,7);
const materials = [0x536d31,0x79974b,0x334e32,0x68503b,0xbc814e,0xb2b985,0x755371].map(color=>new T.MeshStandardMaterial({color,roughness:.9,flatShading:true}));
/** Bake authored foliage into a few meshes, not hundreds of draw calls per plant. */
class Shapes {
  parts: T.BufferGeometry[][] = materials.map(()=>[]);
  add(geo:T.BufferGeometry,color:number,p:T.Vector3,s:T.Vector3,rotation=new T.Euler()):void {
    this.parts[color].push(geo.clone().applyMatrix4(new T.Matrix4().compose(p,new T.Quaternion().setFromEuler(rotation),s)));
  }
  leaf(x:number,y:number,z:number,r:number,color=0):void {this.add(leafGeo,color,new T.Vector3(x,y,z),new T.Vector3(r,r*.4,r*.6),new T.Euler(.3,x*7,z));}
  branch(a:T.Vector3,b:T.Vector3,r:number):void {
    const direction=b.clone().sub(a),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),direction.clone().normalize());
    this.parts[3].push(woodGeo.clone().applyMatrix4(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),q,new T.Vector3(r,direction.length(),r*.8))));
  }
  build():T.Group { const group=new T.Group();this.parts.forEach((geos,i)=>{if(!geos.length)return;const combined=mergeGeometries(geos);group.add(new T.Mesh(combined,materials[i]));geos.forEach(g=>g.dispose());});return group; }
}
function tree(seed:number,height:number):T.Group {
  const shape=new Shapes(),rand=mulberry32(seed);
  shape.branch(new T.Vector3(),new T.Vector3(.13,height,0),.10);
  for(let i=0;i<15;i++) {
    const a=rand()*Math.PI*2,y=height*(.4+rand()*.55),r=.4+rand()*.55;
    const end=new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);
    shape.branch(new T.Vector3(0,y*.7,0),end,.025);
    for(let j=0;j<9;j++)shape.leaf(end.x+(rand()-.5)*.8,end.y+(rand()-.5)*.45,end.z+(rand()-.5)*.8,.24+rand()*.18,j%3);
  }
  return shape.build();
}
export interface GardenNode { group:T.Group; growth:T.Group; fruit:T.Group; ring:T.Mesh; blight:T.Group; current:number; }
export function buildGarden(scene:T.Scene):{ nodes:GardenNode[]; forest:T.Group; pond:T.Mesh; colliders: {x:number;z:number;radius:number;cameraClearance:number;maxY:number}[]; } {
  const forest=new T.Group(),rand=mulberry32(719);
  const colliders: {x:number;z:number;radius:number;cameraClearance:number;maxY:number}[] = [];
  // Thick woodland wraps the small waking glade; the eastward path opens onto the original cliff.
  for(let i=0;i<76;i++) {
    const x=-19+rand()*42,z=-19+rand()*36;
    if(FORMS.some(f=>Math.hypot(x-f.at[0],z-f.at[1])<2.5) || (x>-2&&x<22&&z>-7&&z<1) || Math.hypot(x,z)<3)continue;
    const t=tree(i+91,2.4+rand()*2.8);t.position.set(x,-1,z);forest.add(t);colliders.push({x,z,radius:.15,cameraClearance:.4,maxY:4});
  }
  scene.add(forest);
  const ground=new Shapes();
  for(let i=0;i<1800;i++) {
    const x=-9+rand()*31,z=-11+rand()*17;
    if(Math.sin(x*.7)+Math.cos(z*.6)<-.9)continue;
    ground.leaf(x,-.93,z,.06+rand()*.12,i%3);
  }
  scene.add(ground.build());
  const nodes=FORMS.map((form,i)=>{
    const group=new T.Group();group.position.set(form.at[0],-0.94,form.at[1]);scene.add(group);
    const growth=new T.Group(),fruit=new T.Group(),blight=new T.Group();group.add(growth,fruit,blight);
    const ring=new T.Mesh(new T.RingGeometry(.85,.89,48),new T.MeshBasicMaterial({color:0xd7c58a,transparent:true,opacity:.6,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;group.add(ring);
    const bed=new T.Mesh(new T.CircleGeometry(i===1?1.45:1.1,32),new T.MeshStandardMaterial({color:0x47573a,roughness:1}));bed.rotation.x=-Math.PI/2;bed.position.y=.015;group.add(bed);
    const shapes=new Shapes(),berries=new Shapes();
    if(i===1) {
      for(let k=0;k<9;k++) {
        const a=k/9*Math.PI*2;
        const pts=Array.from({length:15},(_,j)=>{const t=j/14,r=1.35*Math.cos(t*1.35);return new T.Vector3(Math.cos(a)*r,Math.sin(t*1.35)*1.85,Math.sin(a)*r);});
        for(let j=1;j<pts.length;j++)shapes.branch(pts[j-1],pts[j],.034);
        for(let j=4;j<pts.length;j++){const p=pts[j];shapes.leaf(p.x,p.y,p.z,.39,1);}
      }
      for(let j=0;j<60;j++){const a=rand()*Math.PI*2,r=rand();shapes.leaf(Math.sin(a)*r,.09,Math.cos(a)*r,.24,2);}
    } else if(i===4) {
      for(const x of [-.65,.65]) {const t=tree(180+x*10,2.5);t.position.x=x;growth.add(t);}
      for(let j=0;j<18;j++){const a=j*2.4;berries.leaf(Math.sin(a)*.8,1.2+j*.065,Math.cos(a)*.7,.16,4);}
    } else if(i===5) {
      growth.add(tree(300,3.1));
      for(let k=0;k<7;k++){
        const pts=Array.from({length:24},(_,j)=>new T.Vector3(Math.sin(j*.5+k)*(.25+j*.018),j*.12,Math.cos(j*.5+k)*(.25+j*.018)));
        blight.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),36,.05,5,false),new T.MeshStandardMaterial({color:0x493044,emissive:0x4a153c,emissiveIntensity:.4})));
      }
    } else {
      for(let k=0;k<(i===2?12:20);k++){
        const a=k*2.4,r=.15+rand()*.65,x=Math.sin(a)*r,z=Math.cos(a)*r,h=i===3?.45+rand()*.5:.5+rand()*.45;
        shapes.branch(new T.Vector3(x,0,z),new T.Vector3(x*.8,h,z*.8),.016);
        for(let j=1;j<6;j++)shapes.leaf(x+Math.sin(j*2)*.12,h*j/6,z+Math.cos(j*2)*.12,i===3?.14:.20,i===3?5:j%3);
        berries.leaf(x*.8,h,z*.8,.095,i===3?5:4);
      }
    }
    growth.add(shapes.build());fruit.add(berries.build());
    // Generous invisible hit shape remains stationary while foliage grows.
    const hit=new T.Mesh(new T.CylinderGeometry(.9,1.15,i===1?1.9:1.4,12),new T.MeshBasicMaterial({visible:false}));hit.position.y=.6;hit.userData.nodeIndex=i;group.add(hit);
    group.traverse(o=>{o.userData.nodeIndex=i;});
    return {group,growth,fruit,ring,blight,current:0};
  });
  const pond=new T.Mesh(new T.CircleGeometry(1.5,40),new T.MeshStandardMaterial({color:0x7daca5,metalness:.45,roughness:.16,transparent:true,opacity:.85}));pond.rotation.x=-Math.PI/2;pond.position.set(7,-.91,-1);scene.add(pond);
  const water=new T.Mesh(new T.CylinderGeometry(.026,.075,15,7),new T.MeshBasicMaterial({color:0xc9ebda,transparent:true,opacity:.25}));water.position.set(7,6.5,-1);scene.add(water);
  // Seven standing stones, one warm. The other domains are intentionally unnamed.
  for(let i=0;i<7;i++) {
    const a=i/7*Math.PI*2;
    const stone=new T.Mesh(new T.DodecahedronGeometry(.27,0),new T.MeshStandardMaterial({color:i?0x757a76:0x92ab72,emissive:i?0:0x29471c,roughness:1}));stone.scale.set(.65,1.8,.7);stone.position.set(20+Math.sin(a)*1.6,-.55,Math.cos(a)*1.6);scene.add(stone);
  }
  return {nodes,forest,pond,colliders};
}
export function updatePlant(node:GardenNode,index:number,progress:number,now:number,active:boolean,available:boolean):void {
  node.current+=(Math.min(1,progress/FORMS[index].need)-node.current)*.045;
  const p=node.current;
  node.growth.scale.setScalar(index===5?.7+p*.3:.25+p*.75);
  node.fruit.scale.setScalar(Math.max(.01,(p-.45)/.55));
  node.growth.rotation.z=Math.sin(now*.0013+index)*.012;
  node.blight.scale.setScalar(Math.max(.001,1-p));node.blight.visible=p<.998;
  node.ring.visible=available;
  (node.ring.material as T.MeshBasicMaterial).opacity=active?.85:.28+Math.sin(now*.002+index)*.12;
}
