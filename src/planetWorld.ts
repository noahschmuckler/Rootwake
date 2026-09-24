import * as THREE from 'three';
import { selectTiles, tileDirection, surfacePoint, planetColour, type WorldDescriptor, type PlanetTile, type V3 } from './planetModel';
/** Budgeted, atomic LOD changes. Old coverage remains until its replacement is
 * ready; no holes during a fast crossing. Geometry removed from both scene and GPU. */
export function createPlanetWorld(scene:THREE.Scene, world:WorldDescriptor) {
 const group=new THREE.Group();scene.add(group);
 const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide});
 const meshes=new Map<string,THREE.Mesh>();let active=new Set<string>(),target:PlanetTile[]=[],queue:PlanetTile[]=[],last:V3|null=null;
 function build(t:PlanetTile):THREE.Mesh {
  const n=12,positions:number[]=[],colors:number[]=[],indices:number[]=[];
  for(let j=0;j<=n;j++)for(let i=0;i<=n;i++){const d=tileDirection(t,i/n,j/n),p=surfacePoint(world,d);positions.push(p.x,p.y,p.z);colors.push(...planetColour(world,d));}
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+1,c=a+n+1,d=c+1;indices.push(a,b,c,b,d,c);}
  // Downward skirts cover the geometric T junctions between unequal LODs.
  const edges=[Array.from({length:n+1},(_,i)=>i),Array.from({length:n+1},(_,i)=>i*(n+1)+n),Array.from({length:n+1},(_,i)=>n*(n+1)+n-i),Array.from({length:n+1},(_,i)=>(n-i)*(n+1))];
  const depth=Math.max(2,world.radius/2**t.level*.04);
  for(const edge of edges){const start=positions.length/3;for(const k of edge){const p=new THREE.Vector3(...positions.slice(k*3,k*3+3) as [number,number,number]);p.multiplyScalar((p.length()-depth)/p.length());positions.push(p.x,p.y,p.z);colors.push(...colors.slice(k*3,k*3+3));}for(let i=0;i<n;i++)indices.push(edge[i],start+i,edge[i+1],edge[i+1],start+i,start+i+1);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,material);mesh.name=`planet:${t.key}`;mesh.visible=false;group.add(mesh);meshes.set(t.key,mesh);return mesh;
 }
 // Six coarse faces ensure coverage on the very first rendered frame.
 for(let face=0;face<6;face++){const t={face,level:0,x:0,y:0,key:`${face}/0/0/0`};build(t).visible=true;active.add(t.key);}
 function request(up:V3){target=selectTiles(world,up);queue=target.filter(t=>!meshes.has(t.key));last={...up};}
 function update(up:V3,origin:V3,budgetMs=4){
  group.position.set(-origin.x,-origin.y,-origin.z);
  if(!queue.length&&(!last||Math.hypot(up.x-last.x,up.y-last.y,up.z-last.z)*world.radius>24))request(up);
  const start=performance.now();let built=0;
  while(queue.length&&performance.now()-start<budgetMs&&built<3){build(queue.shift()!);built++;}
  if(!queue.length&&target.length){const wanted=new Set(target.map(t=>t.key));for(const [key,mesh] of meshes){if(!wanted.has(key)){group.remove(mesh);mesh.geometry.dispose();meshes.delete(key);}else mesh.visible=true;}active=wanted;target=[];}
  return built;
 }
 return {update,get stats(){return {visible:active.size,resident:meshes.size,pending:queue.length};},dispose(){for(const m of meshes.values())m.geometry.dispose();material.dispose();scene.remove(group);}};
}
