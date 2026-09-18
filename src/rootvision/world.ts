import * as T from 'three';
import {SITES,LEVELS,level,type Journey,type SiteId} from './state';
import {mulberry32} from '../colors';
export const R=180;
const center=new T.Vector3(0,-R,0);
export function height(x:number,z:number):number {return Math.sqrt(Math.max(1,R*R-x*x-z*z))-R+.65*Math.sin(x*.07)*Math.cos(z*.075);}
export function point(x:number,z:number,offset=0):T.Vector3{return new T.Vector3(x,height(x,z)+offset,z);}
function normal(p:T.Vector3):T.Vector3{return p.clone().sub(center).normalize();}
export function makeWorld(scene:T.Scene){
 const surface=new T.Group(),roots=new T.Group(),markers=new T.Group();scene.add(surface,roots,markers);
 const terrain=new T.Mesh(new T.SphereGeometry(R,112,80),new T.MeshStandardMaterial({color:'#41675c',roughness:1,transparent:true,side:T.DoubleSide}));terrain.name='living-ground';terrain.position.copy(center);
 const positions=terrain.geometry.attributes.position;
 for(let i=0;i<positions.count;i++){const x=positions.getX(i),z=positions.getZ(i);positions.setY(i,positions.getY(i)+.65*Math.sin(x*.07)*Math.cos(z*.075));}
 terrain.geometry.computeVertexNormals();surface.add(terrain);
 const rand=mulberry32(81285),trees:{p:T.Vector3;size:number}[]=[];
 for(let i=0;i<1000;i++){const a=rand()*Math.PI*2,y=rand()*2-1,k=Math.sqrt(1-y*y),p=new T.Vector3(Math.cos(a)*k*R,y*R-R,Math.sin(a)*k*R);if(y>.5&&Object.entries(SITES).some(([id,s])=>id!=='daughter'&&Math.hypot(p.x-s.x,p.z-s.z)<(id==='village'?11:6)))continue;trees.push({p,size:1+rand()*2});}
 for(let i=0;i<320;i++){const x=(rand()-.5)*170,z=(rand()-.65)*140;if(Object.entries(SITES).some(([id,s])=>id!=='daughter'&&Math.hypot(x-s.x,z-s.z)<(id==='village'?11:6)))continue;trees.push({p:point(x,z),size:1.1+rand()*1.4});}
 const trunks=new T.InstancedMesh(new T.CylinderGeometry(.24,.48,4,6),new T.MeshStandardMaterial({color:'#54493a',roughness:1}),trees.length);
 const leaves=new T.InstancedMesh(new T.IcosahedronGeometry(2.6,1),new T.MeshStandardMaterial({color:'#41694a',roughness:1,transparent:true}),trees.length);
 surface.add(trunks,leaves);const temp=new T.Object3D();
 const rootPaths:{p:T.Vector3;vertices:number[]}[]=[];
 trees.forEach((tree,i)=>{
  const n=normal(tree.p);temp.position.copy(tree.p).addScaledVector(n,tree.size*2);temp.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);temp.scale.setScalar(tree.size);temp.updateMatrix();trunks.setMatrixAt(i,temp.matrix);
  temp.position.copy(tree.p).addScaledVector(n,tree.size*4.5);temp.scale.set(tree.size,tree.size*.8,tree.size);temp.updateMatrix();leaves.setMatrixAt(i,temp.matrix);leaves.setColorAt(i,new T.Color().setHSL(.23+rand()*.1,.22,.22+rand()*.14));
  const vertices:number[]=[];const tangent=new T.Vector3(1,0,0).cross(n).normalize();if(tangent.lengthSq()<.1)tangent.set(0,0,1);const bitangent=n.clone().cross(tangent);
  for(let b=0;b<4;b++){let prev=tree.p.clone();const a=rand()*Math.PI*2;for(let k=1;k<=6;k++){const next=tree.p.clone().addScaledVector(tangent,Math.cos(a+k*.16)*k*1.3).addScaledVector(bitangent,Math.sin(a+k*.16)*k*1.3).addScaledVector(n,-1-k*.65);vertices.push(...prev.toArray(),...next.toArray());prev=next;}}
  rootPaths.push({p:tree.p,vertices});
 });
 const rootGeometry=new T.BufferGeometry();const rootLines=new T.LineSegments(rootGeometry,new T.LineBasicMaterial({color:'#9cdbaf',transparent:true,opacity:.54,blending:T.AdditiveBlending,depthWrite:false}));roots.add(rootLines);
 const filaments=new T.Group();roots.add(filaments);
 const treesAt={} as Record<SiteId,T.Group>,beacons={} as Record<SiteId,T.Mesh>;
 const markerGeo=new T.IcosahedronGeometry(1.1,1);
 for(const [key,site]of Object.entries(SITES)){
  const id=key as SiteId;if(id==='daughter')continue;
  const base=new T.Group();base.position.copy(point(site.x,site.z));base.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),normal(base.position));surface.add(base);treesAt[id]=base;
  const trunk=new T.Mesh(new T.CylinderGeometry(.7,1.4,8,9),new T.MeshStandardMaterial({color:'#5c5642',roughness:1}));trunk.position.y=4;base.add(trunk);
  for(let j=0;j<5;j++){const crown=new T.Mesh(new T.IcosahedronGeometry(3.3,1),new T.MeshStandardMaterial({color:id==='grove'?'#c3d8ab':'#6c8954',roughness:1}));crown.position.set(Math.sin(j*2.4)*2,7+j*.5,Math.cos(j*2.4)*2);base.add(crown);}
  const beacon=new T.Mesh(markerGeo,new T.MeshBasicMaterial({color:id==='home'?'#f4c779':'#aee7ce',transparent:true,opacity:.85}));beacon.position.copy(point(site.x,site.z,-3));beacon.userData.site=id;markers.add(beacon);beacons[id]=beacon;
  for(let b=0;b<8;b++){const a=b*Math.PI/4,pts=[];for(let k=0;k<=12;k++){const x=site.x+Math.cos(a+k*.06)*k*.9,z=site.z+Math.sin(a+k*.06)*k*.9;pts.push(point(x,z,-.5-k*.35));}const curve=new T.CatmullRomCurve3(pts);const line=new T.Mesh(new T.TubeGeometry(curve,18,.09,4,false),new T.MeshBasicMaterial({color:'#e2c889',transparent:true,opacity:.68}));line.userData.site=id;filaments.add(line);}
 }
 const buildings=new T.Group();buildings.position.copy(point(28,-24));buildings.quaternion.copy(treesAt.village.quaternion);surface.add(buildings);
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2,x=Math.sin(a)*7,z=Math.cos(a)*7;const house=new T.Mesh(new T.BoxGeometry(3,3,3.6),new T.MeshStandardMaterial({color:'#c7ae87',roughness:1}));house.position.set(x,1.5,z);buildings.add(house);const roof=new T.Mesh(new T.ConeGeometry(2.8,1.8,4),new T.MeshStandardMaterial({color:'#785649'}));roof.position.set(x,3.8,z);roof.rotation.y=Math.PI/4;buildings.add(roof);const foundation=new T.Mesh(new T.BoxGeometry(3.3,2.5,3.9),new T.MeshStandardMaterial({color:'#817c79',roughness:1}));foundation.position.set(x,-1.2,z);buildings.add(foundation);}
 const spring=new T.Mesh(new T.CircleGeometry(4,40),new T.MeshStandardMaterial({color:'#609786',metalness:.4,roughness:.2,side:T.DoubleSide}));spring.rotation.x=-Math.PI/2;spring.position.copy(point(-17,-13,.08));surface.add(spring);
 const thorns=new T.Group();thorns.position.copy(point(-43,-47));surface.add(thorns);
 for(let i=0;i<9;i++){const a=i*.7;const thorn=new T.Mesh(new T.ConeGeometry(.7,4,5),new T.MeshStandardMaterial({color:'#704154',roughness:1}));thorn.position.set(Math.sin(a)*3,1.2,Math.cos(a)*3);thorn.rotation.z=Math.sin(a)*.5;thorns.add(thorn);}
 const road=new T.Group();surface.add(road);for(let i=0;i<18;i++){const x=28+i*1.3,z=-24-i*2.3;const slab=new T.Mesh(new T.BoxGeometry(2.2,.18,2.8),new T.MeshStandardMaterial({color:'#c8bc99'}));slab.position.copy(point(x,z,.18));slab.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),normal(slab.position));road.add(slab);}
 for(let i=0;i<8;i++){const a=i*Math.PI/4+.25;const p=new T.Vector3(Math.cos(a)*.75,.15+Math.sin(a)*.55,Math.sin(a)*.65).normalize();const karst=new T.Mesh(new T.CylinderGeometry(5,10,25+rand()*18,7),new T.MeshStandardMaterial({color:'#6b8074',roughness:1}));karst.position.copy(center).addScaledVector(p,R+10);karst.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),p);surface.add(karst);}
 const moths=new T.BufferGeometry();const stars=[];for(let i=0;i<160;i++)stars.push((rand()-.5)*130,-rand()*30,(rand()-.6)*120);moths.setAttribute('position',new T.Float32BufferAttribute(stars,3));roots.add(new T.Points(moths,new T.PointsMaterial({color:'#f2d8aa',size:.16,transparent:true,opacity:.6,depthWrite:false})));
 let lastKey='';
 function update(s:Journey,below:boolean,time:number,study=false){
  terrain.material.opacity=below?.045:1;terrain.material.depthWrite=!below;leaves.material.opacity=below?.24:1;leaves.material.depthWrite=!below;
  roots.visible=below;markers.visible=below;road.visible=s.council;thorns.visible=!s.solved.includes('grove');spring.material.color.set(s.solved.includes('spring')?'#74dfc4':'#54706e');
  const key=`${s.body}-${level(s)}-${study}`;if(key!==lastKey){lastKey=key;const anchor=point(SITES[s.body].x,SITES[s.body].z),range=LEVELS[level(s)].range;const vertices=rootPaths.filter(r=>study||r.p.distanceTo(anchor)<range).flatMap(r=>r.vertices);rootGeometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));rootGeometry.computeBoundingSphere();}
  Object.entries(beacons).forEach(([id,b])=>{const q=id as SiteId;b.visible=study||Math.hypot(SITES[q].x-SITES[s.body].x,SITES[q].z-SITES[s.body].z)<=LEVELS[level(s)].range;b.scale.setScalar(1+Math.sin(time*.0015)*.12);b.material instanceof T.MeshBasicMaterial&&b.material.color.set(s.solved.includes(q)?'#f3c988':'#aee7ce');});
  filaments.children.forEach(line=>{line.visible=!!beacons[line.userData.site as SiteId]?.visible;});
 }
 return{surface,roots,markers,beacons,treesAt,update};
}
