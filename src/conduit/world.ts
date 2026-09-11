import * as T from 'three';
import { mulberry32 } from '../colors';
import { type Collider } from '../player';
import { HEROES, IDS, PROJECTS, PROJECT_IDS, type HeroId, type RegionId, type ProjectId, type Campaign, done } from './state';
const mat=(color:T.ColorRepresentation,glow=0)=>new T.MeshStandardMaterial({color,roughness:.8,metalness:.15,emissive:color,emissiveIntensity:glow,flatShading:true});
const stone=mat('#32464e'),edge=mat('#15262d'),gold=mat('#ba9a62'),bark=mat('#65503d'),leaf=mat('#52856a');
export function mesh(parent:T.Object3D,g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0):T.Mesh {const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
function box(parent:T.Object3D,m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number):T.Mesh{return mesh(parent,new T.BoxGeometry(w,h,d),m,x,y,z);}
function rod(parent:T.Object3D,a:T.Vector3,b:T.Vector3,r:number,m:T.Material):T.Mesh {
 const o=mesh(parent,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return o;
}
export interface RegionView {group:T.Group;colliders:Collider[];stations:Partial<Record<ProjectId,T.Group>>;water:T.Group;bridge:T.Group;metal:T.Group;scar:T.Group;beam:T.Group;}
export interface WorldView {regions:Record<RegionId,RegionView>;actors:Record<HeroId,T.Group>;targets:T.Object3D[];update:(s:Campaign,time:number,activeProject:ProjectId|null)=>void;setRegion:(r:RegionId)=>void;}
function tree(g:T.Object3D,x:number,z:number,scale:number,m=leaf):void {
 const t=new T.Group();t.position.set(x,0,z);t.scale.setScalar(scale);g.add(t);
 rod(t,new T.Vector3(),new T.Vector3(.08,1.7,0),.13,bark);
 for(let j=0;j<3;j++){const a=j*2.1;rod(t,new T.Vector3(0,.8,0),new T.Vector3(Math.cos(a)*.7,1.8,Math.sin(a)*.7),.065,bark);mesh(t,new T.IcosahedronGeometry(.78,0),m,Math.cos(a)*.4,1.8+j*.18,Math.sin(a)*.4).scale.set(1,.8,1);}
}
export function character(id:HeroId):T.Group {
 const g=new T.Group(),cloth=mat(HEROES[id].color),dark=mat(id==='smith'?'#263945':'#353137'),skin=mat(id==='hulda'?'#a76c4d':'#97775e'),hair=mat('#25242a');
 const skirt=mesh(g,new T.CylinderGeometry(.14,.24,.42,10),id==='smith'?dark:cloth,0,.27,0);
 if(id==='mason')skirt.scale.set(1.2,1,1.2);
 mesh(g,new T.CylinderGeometry(.16,.12,.2,10),dark,0,.48,0);
 mesh(g,new T.SphereGeometry(.105,12,8),skin,0,.65,-.014);
 mesh(g,new T.SphereGeometry(.113,12,8),hair,0,.685,.035).scale.set(1,1,.8);
 mesh(g,new T.SphereGeometry(.085,12,8),skin,0,.652,-.063).scale.set(1,1,.6);
 for(const x of [-.032,.032])mesh(g,new T.SphereGeometry(.01,6,5),hair,x,.668,-.113);
 mesh(g,new T.SphereGeometry(.025,8,6),skin,0,.64,-.11);
 for(const side of [-1,1]){
  const arm=mesh(g,new T.CapsuleGeometry(.05,.2,3,7),cloth,side*.18,.4,0);arm.name='arm';
  mesh(g,new T.SphereGeometry(.04,8,6),skin,side*.18,.25,-.015);
  mesh(g,new T.BoxGeometry(.1,.07,.15),dark,side*.08,.06,-.03);
 }
 mesh(g,new T.TorusGeometry(.17,.014,4,16),gold,0,.4,0).rotation.x=Math.PI/2;
 if(id==='smith'){
  box(g,cloth,0,.47,-.13,.24,.2,.1);mesh(g,new T.OctahedronGeometry(.055),mat('#ffcd82',1),0,.48,-.2);
  for(const side of [-1,1])mesh(g,new T.SphereGeometry(.115,8,6),dark,side*.19,.53,0);
 } else if(id==='sage'||id==='artificer'){
  rod(g,new T.Vector3(-.27,.04,0),new T.Vector3(-.27,1.05,0),.024,gold);
  mesh(g,new T.OctahedronGeometry(.1),mat(HEROES[id].color,.7),-.27,1.04,0);
 } else if(id==='hulda'){
  for(const side of [-1,1])for(let j=0;j<8;j++)mesh(g,new T.SphereGeometry(.037,6,5),hair,side*.084,.72-j*.035,.055);
  mesh(g,new T.TorusGeometry(.11,.013,5,18),gold,0,.725,0).rotation.x=Math.PI/2;
 }else if(id==='mason')box(g,stone,-.25,.37,-.05,.17,.28,.12);
 else if(id==='alchemist')mesh(g,new T.SphereGeometry(.085,10,7),cloth,-.25,.35,-.05);
 else box(g,gold,-.23,.37,-.07,.17,.21,.05);
 const shadow=mesh(g,new T.CircleGeometry(.32,16),new T.MeshBasicMaterial({color:'#02090c',transparent:true,opacity:.3,depthWrite:false}),0,.008,0);shadow.rotation.x=-Math.PI/2;
 const halo=mesh(g,new T.RingGeometry(.32,.36,32),new T.MeshBasicMaterial({color:HEROES[id].color,transparent:true,opacity:.8,side:T.DoubleSide}),0,.025,0);halo.rotation.x=-Math.PI/2;halo.name='selection';
 const cargo=mesh(g,new T.TorusGeometry(.19,.06,6,12),gold,0,.36,-.3);cargo.name='cargo';cargo.visible=false;
 g.traverse(o=>o.userData.hero=id);return g;
}
function buildRegion(id:RegionId,scene:T.Scene):RegionView {
 const g=new T.Group();scene.add(g);const rng=mulberry32(id==='garden'?49:id==='forge'?72:19),colliders:Collider[]=[],stations:RegionView['stations']={};
 const floor=mat(id==='garden'?'#49665b':id==='forge'?'#444149':'#243c49');
 box(g,edge,0,-2,0,25,4,27);
 const tiles=new T.InstancedMesh(new T.BoxGeometry(1,.2,1),floor,25*27),dummy=new T.Object3D();let k=0;
 for(let x=-12;x<=12;x++)for(let z=-13;z<=13;z++){dummy.position.set(x,-.11-rng()*.045,z);dummy.scale.set(.99,1,.99);dummy.updateMatrix();tiles.setMatrixAt(k,dummy.matrix);tiles.setColorAt(k++,new T.Color(floor.color).multiplyScalar(.84+rng()*.25));}g.add(tiles);
 // Vast silhouettes beyond the bounded playable island.
 for(let i=0;i<22;i++){const a=rng()*Math.PI*2,r=32+rng()*90,h=15+rng()*50;
  mesh(g,new T.CylinderGeometry(2+rng()*6,5+rng()*7,h,6),mat(id==='relay'?'#132b39':'#26414b'),Math.sin(a)*r,-h*.32,Math.cos(a)*r);
 }
 const coll=(x:number,z:number,r:number)=>colliders.push({x,z,radius:r,maxY:2.3});
 if(id==='garden'){
  for(let i=0;i<24;i++){const x=(rng()-.5)*23,z=(rng()-.5)*24;if(Math.abs(x)<7&&z<7&&z>-7)continue;tree(g,x,z,.7+rng());coll(x,z,.3);}
  for(const [x,z] of [[-8,-4],[7,4],[7,-7]]){
   box(g,bark,x,.7,z,2.3,1.4,2);mesh(g,new T.ConeGeometry(1.85,1,4),mat('#929774'),x,1.85,z).rotation.y=Math.PI/4;coll(x,z,1.2);
   for(let i=0;i<4;i++)box(g,mat('#4c8872'),x-1.5+i*.6,.2,z+2.1,.4,.4,1.5);
  }
  box(g,stone,0,.04,-1,.7,.07,20);box(g,stone,-2,.04,-2,4,.07,.7);
 }else if(id==='forge'){
  for(const x of [-9,8])for(const z of [-8,5]){
   box(g,stone,x,1.4,z,3,2.8,3);box(g,edge,x,3.1,z,3.6,.5,3.6);box(g,edge,x+.8,4.3,z,.6,2,.6);
   box(g,mat('#ef8f42',1),x,1,z+1.51,.85,1,.03);coll(x,z,1.7);
  }
  for(let i=0;i<14;i++){const x=(rng()-.5)*23,z=8+rng()*3;mesh(g,new T.DodecahedronGeometry(.4+rng()*.5),stone,x,.2,z);}
  box(g,mat('#f59348',.75),0,-.03,-7,23,.04,.3);
 }else{
  for(const x of [-10,10])for(const z of [-10,-3,4,10]){
   mesh(g,new T.CylinderGeometry(.5,.7,9,8),stone,x,4.5,z);box(g,gold,x,2,z,.98,.15,.98);
   mesh(g,new T.OctahedronGeometry(.22),mat('#69d3e4',.8),x*.94,2.4,z);coll(x,z,.75);
  }
  const arch=mesh(g,new T.TorusGeometry(8.5,.45,6,24,Math.PI),stone,0,3,-11);arch.rotation.z=0;
  box(g,edge,0,0,-5,4,.015,2.2);
  for(const x of [-2.6,2.6])box(g,gold,x,.09,-4,1,.08,11);
 }
 const water=new T.Group();g.add(water);
 box(water,mat('#61d1c1',.35),0,.07,-1,.45,.06,20);box(water,mat('#61d1c1',.35),-2,.07,-2,4,.06,.45);water.visible=false;
 const bridge=new T.Group();g.add(bridge);
 for(let i=0;i<9;i++){const pts=Array.from({length:22},(_,j)=>new T.Vector3((i-4)*.14+Math.sin(j*.5+i)*.08,.18+Math.sin(j/21*Math.PI)*.35,-3.7-j/21*3.2));
  mesh(bridge,new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.07,5,false),mat(i%2?'#6d9d72':'#a5b57c',.15));}
 bridge.visible=false;
 const metal=new T.Group();g.add(metal);const coupling=mesh(metal,new T.CylinderGeometry(.42,.42,3.1,12),gold,0,.25,-5);coupling.rotation.x=Math.PI/2;metal.visible=false;
 const scar=new T.Group();g.add(scar);
 const thorn=mat('#573852',.15);for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const o=mesh(scar,new T.ConeGeometry(.17,1.7,5),thorn,Math.cos(a)*.8,.7,-9+Math.sin(a)*.8);o.rotation.z=Math.sin(a)*.7;}
 mesh(scar,new T.IcosahedronGeometry(.68,1),mat('#995881',.3),0,1.1,-9);scar.visible=id==='relay';
 const beam=new T.Group();g.add(beam);const beamMat=new T.MeshBasicMaterial({color:'#b9ffed',transparent:true,opacity:.8});
 mesh(beam,new T.CylinderGeometry(.07,.07,75,10),beamMat,0,35,-5);
 for(let i=0;i<3;i++){const o=mesh(beam,new T.TorusGeometry(1+i*.4,.025,5,48),beamMat,0,2+i*1.3,-5);o.rotation.x=Math.PI/2;}beam.visible=false;
 for(const projectId of PROJECT_IDS){const p=PROJECTS[projectId];if(p.region!==id)continue;
  const station=new T.Group();station.position.set(p.at[0],0,p.at[1]);g.add(station);stations[projectId]=station;
  const ring=mesh(station,new T.RingGeometry(.72,.77,32),new T.MeshBasicMaterial({color:'#d7bd81',side:T.DoubleSide,transparent:true,opacity:.6}),0,.045,0);ring.rotation.x=-Math.PI/2;
  const sigil=mesh(station,new T.OctahedronGeometry(.16),mat('#e1c389',.6),0,1.85,0);sigil.name='sigil';
  if(['roots','mount','ignite','banish'].includes(projectId))continue;
  if(projectId==='water'){tree(station,0,0,1.2);mesh(station,new T.TorusGeometry(.6,.1,6,16),stone,0,.2,0).rotation.x=Math.PI/2;}
  else if(projectId==='accord'){box(station,bark,0,.7,0,1.5,.13,1.1);for(const x of [-.5,.5])box(station,bark,x,.35,0,.15,.7,.15);}
  else if(projectId==='distill'){for(let n=0;n<6;n++)mesh(station,new T.ConeGeometry(.18,.6,5),mat('#bbafd4'),(n%3-.9)*.4,.3,Math.floor(n/3)*.4);}
  else if(projectId==='forge'){box(station,stone,0,.35,0,1.3,.7,1);box(station,gold,0,.8,0,.95,.2,.6);mesh(station,new T.TorusGeometry(.55,.055,6,20),mat('#ffc585',.8),0,1.5,0);}
  else if(projectId==='memory'){mesh(station,new T.CylinderGeometry(.6,.8,.35,8),stone,0,.175,0);mesh(station,new T.OctahedronGeometry(.5),mat('#86c9e4',.65),0,.8,0);}
  else if(projectId==='salvage'){for(let j=0;j<7;j++)mesh(station,new T.DodecahedronGeometry(.3),stone,Math.sin(j*2)*.5,.2+j*.04,Math.cos(j*2)*.5);}
  else if(projectId==='brace'){for(let j=0;j<3;j++)box(station,stone,(j-1)*.38,.25+j*.15,0,.35,.5+j*.3,.55);}
 }
 return {group:g,colliders,stations,water,bridge,metal,scar,beam};
}
export function buildCampaignWorld(scene:T.Scene):WorldView {
 const regions={garden:buildRegion('garden',scene),forge:buildRegion('forge',scene),relay:buildRegion('relay',scene)};
 const actors={} as Record<HeroId,T.Group>;
 for(const id of IDS){actors[id]=character(id);scene.add(actors[id]);}
 const loot=new Map<string,T.Group>();
 const targets=Object.values(regions).flatMap(r=>Object.values(r.stations).filter(Boolean) as T.Group[]);
 for(const r of Object.values(regions))for(const [id,o] of Object.entries(r.stations))o?.traverse(c=>c.userData.project=id);
 const skies={garden:'#244451',forge:'#342e40',relay:'#101f30'};
 function setRegion(r:RegionId):void {for(const id of ['garden','forge','relay'] as RegionId[])regions[id].group.visible=id===r;scene.background=new T.Color(skies[r]);scene.fog=new T.Fog(skies[r],20,r==='relay'?85:180);}
 function update(s:Campaign,time:number,activeProject:ProjectId|null):void {
  const region=s.heroes[s.active].region;
  for(const id of IDS){const h=s.heroes[id],a=actors[id];a.visible=h.region===region;a.position.set(h.x,0,h.z);a.rotation.y=h.yaw;
   const halo=a.getObjectByName('selection');if(halo)halo.visible=id===s.active;
   const cargo=a.getObjectByName('cargo');if(cargo)cargo.visible=h.items.includes('coupling');
   a.children.filter(c=>c.name==='arm').forEach((o,i)=>o.rotation.x=Math.sin(time*2+i*Math.PI)*.06);
  }
  regions.garden.water.visible=done(s,'water');regions.relay.bridge.visible=s.progress.roots>0;regions.relay.bridge.scale.y=Math.max(.05,s.progress.roots/PROJECTS.roots.need);
  regions.relay.metal.visible=s.progress.mount>0;regions.relay.metal.scale.z=Math.max(.1,s.progress.mount/PROJECTS.mount.need);
  regions.relay.scar.visible=!done(s,'cleanse');regions.relay.scar.scale.setScalar(done(s,'banish')?.35:1+Math.sin(time*1.5)*.04);regions.relay.scar.rotation.y=Math.sin(time*.4)*.08;
  for(const r of Object.values(regions)){r.beam.visible=done(s,'ignite');for(const [id,g] of Object.entries(r.stations)){
   const project=id as ProjectId,ob=g!;ob.visible=!(project==='roots'&&done(s,'mount')||project==='mount'&&done(s,'roots')||project==='banish'&&done(s,'cleanse')||project==='cleanse'&&done(s,'banish'));
   const sigil=ob.getObjectByName('sigil') as T.Mesh;sigil.position.y=1.65+Math.sin(time*1.8)*.09;sigil.rotation.y=time*.5;
   (sigil.material as T.MeshStandardMaterial).color.set(done(s,project)?'#76dabb':activeProject===project?'#fff1c7':'#bfac7d');
  }}
  for(const [id,g] of loot)if(!s.drops.some(d=>d.id===id)){g.removeFromParent();loot.delete(id);}
  for(const drop of s.drops){let g=loot.get(drop.id);if(!g){g=new T.Group();mesh(g,drop.item==='coupling'?new T.TorusGeometry(.3,.1,6,12):new T.IcosahedronGeometry(.23,1),mat(drop.item==='coupling'?'#e9ba78':'#9ae5b1',.6));g.userData.drop=drop.id;g.traverse(o=>o.userData.drop=drop.id);scene.add(g);loot.set(drop.id,g);targets.push(g);}
   g.visible=drop.region===region;g.position.set(drop.x,.5+Math.sin(time*2)*.07,drop.z);g.rotation.y=time*.6;
  }
 }
 return {regions,actors,targets,update,setRegion};
}
