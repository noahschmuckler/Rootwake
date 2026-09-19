import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EDGES, NODES, groundHeight, onBank, isOpen, vec, type Progress, type NodeId } from './ravineModel';
import { mulberry32 } from './colors';
export function buildRavine(scene: THREE.Scene) {
  const rand=mulberry32(290926), surface=new THREE.Group(), roots=new THREE.Group();scene.add(surface,roots);
  const earth=new THREE.MeshStandardMaterial({color:'#637656',roughness:1,side:THREE.DoubleSide,transparent:true});
  const rock=new THREE.MeshStandardMaterial({color:'#697876',roughness:1,flatShading:true,transparent:true});
  const grain=new Uint8Array(64*64*4);for(let i=0;i<4096;i++){const n=130+Math.floor(rand()*125);grain.set([n,n,n,255],i*4);}const texture=new THREE.DataTexture(grain,64,64);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(12,12);texture.needsUpdate=true;earth.map=texture;
  for(const [x,w]of [[-11.5,17],[11.5,13]]){const geo=new THREE.PlaneGeometry(w,32,25,35);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){pos.setX(i,pos.getX(i)+x);pos.setY(i,groundHeight(pos.getX(i),pos.getZ(i)));}geo.computeVertexNormals();scene.add(new THREE.Mesh(geo,earth));}
  for(const x of [-2.95,4.95]){const cliff=new THREE.Mesh(new THREE.BoxGeometry(.45,5.9,32),rock);cliff.position.set(x,-3,0);scene.add(cliff);}
  const waterMat=new THREE.MeshStandardMaterial({color:'#6faebb',emissive:'#274c60',emissiveIntensity:.5,roughness:.22,metalness:.35,transparent:true,opacity:.9,side:THREE.DoubleSide});
  const river=new THREE.Mesh(new THREE.PlaneGeometry(7.5,38),waterMat);river.rotation.x=-Math.PI/2;river.position.set(1,-5.5,0);scene.add(river);
  const bark=new THREE.MeshStandardMaterial({color:'#756752',roughness:1});const leaves=new THREE.MeshStandardMaterial({color:'#6b8f62',flatShading:true});const gold=new THREE.MeshStandardMaterial({color:'#d8b96c',flatShading:true});const pink=new THREE.MeshStandardMaterial({color:'#d7b3bc',flatShading:true});
  const crowns=new THREE.IcosahedronGeometry(1,1);const colliders:{x:number;z:number;radius:number;minY:number;maxY:number}[]=[];
  function tree(x:number,z:number,size:number,mat:THREE.Material){const g=new THREE.Group();g.position.set(x,groundHeight(x,z),z);surface.add(g);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.2*size,.45*size,4*size,7),bark);trunk.position.y=2*size;g.add(trunk);for(let j=0;j<4;j++){const crown=new THREE.Mesh(crowns,mat);crown.position.set((rand()-.5)*1.5,(3.4+rand())*size,(rand()-.5)*1.5);crown.scale.set(1.6*size,1.1*size,1.5*size);g.add(crown);}colliders.push({x,z,radius:.45*size,minY:-.2,maxY:5*size});}
  tree(-9,3.7,1.45,gold);tree(10,-8.3,1.5,pink);
  for(let i=0;i<35;i++){const x=rand()*36-19,z=rand()*29-14;if(!onBank(x,z)||Math.hypot(x+9,z-4)<3||Math.hypot(x-10,z+7)<3||Math.hypot(x+9,z-8)<3)continue;tree(x,z,.6+rand()*.5,leaves);}
  const grass=new THREE.InstancedMesh(new THREE.ConeGeometry(.07,.35,3),leaves,600),o=new THREE.Object3D();for(let i=0;i<600;i++){let x,z;do{x=rand()*37-19;z=rand()*29-14;}while(!onBank(x,z));o.position.set(x,groundHeight(x,z)+.12,z);o.rotation.y=rand()*6.28;o.scale.setScalar(.6+rand());o.updateMatrix();grass.setMatrixAt(i,o.matrix);}surface.add(grass);
  const edgeMeshes=new Map<string,THREE.MeshStandardMaterial>();
  for(const e of EDGES){const mat=new THREE.MeshStandardMaterial({color:e.gate==='communion'?'#91c9ba':'#c6ac75',emissive:'#547352',emissiveIntensity:.45,roughness:.65,transparent:true});edgeMeshes.set(e.id,mat);const root=new THREE.Mesh(new THREE.TubeGeometry(e.curve,100,e.gate==='communion'?.09:.15,7,false),mat);root.position.y=-.32;roots.add(root);
    const fibres:THREE.BufferGeometry[]=[];for(let i=0;i<35;i++){const p=e.curve.getPointAt(i/35);p.y-=.32;const q=p.clone().add(vec((rand()-.5)*1.4,-rand()*.7,(rand()-.5)*1.4));fibres.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p,p.clone().lerp(q,.6).add(vec(.1,-.1,0)),q]),5,.018,3,false));}const merged=mergeGeometries(fibres);if(merged)roots.add(new THREE.Mesh(merged,mat));fibres.forEach(g=>g.dispose());
  }
  const markers=new Map<NodeId,THREE.Mesh>();
  for(const [id,p] of Object.entries(NODES)){const colour=id==='fern'?'#b5f4c9':id==='grove'?'#ffd3e0':'#f3d99e';const m=new THREE.Mesh(new THREE.IcosahedronGeometry(id==='fern'?.23:.13,1),new THREE.MeshBasicMaterial({color:colour}));m.position.copy(p).add(vec(0,.4,0));roots.add(m);markers.set(id as NodeId,m);}
  // A fern grows from the fissure; its small fronds continue in the deep network.
  const fern=new THREE.Group();fern.position.copy(NODES.fern).add(vec(0,.4,0));roots.add(fern);
  for(let i=0;i<8;i++){const frond=new THREE.Mesh(new THREE.ConeGeometry(.15,.9,4),leaves);frond.position.set(Math.sin(i)*.3,.3,Math.cos(i)*.3);frond.rotation.z=Math.sin(i)*.6;fern.add(frond);}
  const pool=new THREE.Mesh(new THREE.CircleGeometry(.85,30),waterMat);pool.rotation.x=-Math.PI/2;pool.position.copy(NODES.spring).add(vec(0,-.4,0));roots.add(pool);
  const haloMat=new THREE.MeshBasicMaterial({color:'#e5d7a2',transparent:true,opacity:.55,side:THREE.DoubleSide});
  for(const id of ['oak','grove'] as const){const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.7,36),haloMat);ring.rotation.x=-Math.PI/2;ring.position.set(NODES[id].x,groundHeight(NODES[id].x,NODES[id].z)+.04,NODES[id].z);surface.add(ring);}
  const motes: {mesh:THREE.Mesh;edge:typeof EDGES[number];offset:number}[]=[];
  for(const e of EDGES)for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.05,5,4),new THREE.MeshBasicMaterial({color:'#d8ffb7'}));roots.add(m);motes.push({mesh:m,edge:e,offset:i/8});}
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshBasicMaterial({color:'#0b2022',side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.y=-11;roots.add(floor);
  function update(p:Progress,under:number,t:number){roots.visible=under>.02;earth.opacity=1-under*.88;rock.opacity=1-under*.91;rock.depthWrite=under<.5;earth.depthWrite=under<.5;for(const e of EDGES){const m=edgeMeshes.get(e.id)!;m.opacity=isOpen(e,p)?1:.22;m.emissiveIntensity=isOpen(e,p)?.7:.05;}for(const m of motes){m.mesh.visible=isOpen(m.edge,p);m.mesh.position.copy(m.edge.curve.getPointAt((t*.00007+m.offset)%1)).add(vec(0,-.18,0));}for(const m of markers.values())m.scale.setScalar(1+Math.sin(t*.002)*.12);}
  return {surface,roots,markers,colliders,update};
}
