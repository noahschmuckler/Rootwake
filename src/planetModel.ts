// Finite, versioned world topology. No renderer, no storage, no load-order state.
// All face seams sample the same 3D field. Feature identity never depends on LOD.
export interface V3 { x:number; y:number; z:number }
export interface WorldDescriptor { seed:number; radius:number; generatorVersion:1 }
export const WORLD_VERSION = 1;
export const DEFAULT_WORLD: WorldDescriptor = { seed:1, radius:800, generatorVersion:1 };
export function worldDescriptor(seed=1,radius=800):WorldDescriptor {
  if(!Number.isSafeInteger(seed)) throw Error('World seed must be a safe integer');
  if(!Number.isFinite(radius)||radius<400||radius>100000) throw Error('Planet radius must be between 400 and 100000 metres');
  return {seed,radius,generatorVersion:WORLD_VERSION};
}
export const add=(a:V3,b:V3):V3=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
export const scale=(a:V3,s:number):V3=>({x:a.x*s,y:a.y*s,z:a.z*s});
export const dot=(a:V3,b:V3):number=>a.x*b.x+a.y*b.y+a.z*b.z;
export const cross=(a:V3,b:V3):V3=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
export const unit=(a:V3):V3=>scale(a,1/(Math.hypot(a.x,a.y,a.z)||1));
const bases:[V3,V3,V3][]=[
 [{x:1,y:0,z:0},{x:0,y:0,z:-1},{x:0,y:1,z:0}],
 [{x:-1,y:0,z:0},{x:0,y:0,z:1},{x:0,y:1,z:0}],
 [{x:0,y:1,z:0},{x:1,y:0,z:0},{x:0,y:0,z:-1}],
 [{x:0,y:-1,z:0},{x:1,y:0,z:0},{x:0,y:0,z:1}],
 [{x:0,y:0,z:1},{x:1,y:0,z:0},{x:0,y:1,z:0}],
 [{x:0,y:0,z:-1},{x:-1,y:0,z:0},{x:0,y:1,z:0}],
];
export const cubeDirection=(face:number,u:number,v:number):V3=>{const [n,a,b]=bases[face];return unit(add(n,add(scale(a,u),scale(b,v))));};
export function faceOf(p:V3):{face:number;u:number;v:number} {
 const a=[Math.abs(p.x),Math.abs(p.y),Math.abs(p.z)];const face=a[0]>=a[1]&&a[0]>=a[2]?(p.x>=0?0:1):a[1]>=a[2]?(p.y>=0?2:3):(p.z>=0?4:5);
 const [n,u,v]=bases[face],d=dot(p,n);return {face,u:dot(p,u)/d,v:dot(p,v)/d};
}
export const arc=(a:V3,b:V3,radius:number):number=>Math.acos(Math.max(-1,Math.min(1,dot(unit(a),unit(b)))))*radius;
const smooth=(t:number)=>t*t*t*(t*(t*6-15)+10);
const hash=(x:number,y:number,z:number,seed:number):number=>{let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,2147483647)^Math.imul(seed,1442695041);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};
export function noise3(p:V3,seed:number):number {
 const x=Math.floor(p.x),y=Math.floor(p.y),z=Math.floor(p.z),u=smooth(p.x-x),v=smooth(p.y-y),w=smooth(p.z-z);let sum=0;
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)sum+=hash(x+i,y+j,z+k,seed)*(i?u:1-u)*(j?v:1-v)*(k?w:1-w);return sum;
}
export interface FeatureAnchor { id:string; direction:V3; core:number; blend:number; height:number }
export function karstAnchors():FeatureAnchor[] {
 const out:FeatureAnchor[]=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])out.push({id:`karst-${out.length+1}`,direction:unit({x,y,z}),core:100,blend:60,height:0});return out;
}
const anchors=karstAnchors();
export function planetHeight(world:WorldDescriptor,direction:V3):number {
 const p=scale(unit(direction),world.radius);
 let h=(noise3(scale(p,1/190),world.seed)-0.5)*26+(noise3(scale(p,1/53),world.seed+7)-0.5)*5;
 for(const a of anchors){const d=arc(direction,a.direction,world.radius);if(d<a.core+a.blend){const t=smooth(Math.max(0,Math.min(1,(d-a.core)/a.blend)));h=a.height*(1-t)+h*t;}}return h;
}
export function planetColour(world:WorldDescriptor,direction:V3):[number,number,number] {
 const n=noise3(scale(unit(direction),world.radius/170),world.seed+71);
 const k=smooth(Math.max(0,Math.min(1,(n-0.25)/0.5)));
 return [0.10+k*0.12,0.18+k*0.13,0.07+k*0.06];
}
export const surfacePoint=(world:WorldDescriptor,d:V3):V3=>scale(unit(d),world.radius+planetHeight(world,d));
export interface PlanetPose { up:V3; forward:V3 }
export function initialPose():PlanetPose {const up=unit({x:1,y:0.8,z:1}),forward=unit(cross({x:0,y:1,z:0},up));return {up,forward};}
/** Exact great-circle step and parallel transport; never wraps longitude or flips at a pole. */
export function travel(pose:PlanetPose,metres:number,radius:number):PlanetPose {
 const t=metres/radius,c=Math.cos(t),s=Math.sin(t);
 return {up:unit(add(scale(pose.up,c),scale(pose.forward,s))),forward:unit(add(scale(pose.forward,c),scale(pose.up,-s)))};
}
export function turn(pose:PlanetPose,radians:number):PlanetPose {
 const right=unit(cross(pose.forward,pose.up));return {up:pose.up,forward:unit(add(scale(pose.forward,Math.cos(radians)),scale(right,Math.sin(radians))))};
}
export interface PlanetTile { face:number; level:number; x:number; y:number; key:string }
export const tileKey=(face:number,level:number,x:number,y:number)=>`${face}/${level}/${x}/${y}`;
export const tileDirection=(t:PlanetTile,u:number,v:number):V3=>cubeDirection(t.face,-1+2*(t.x+u)/2**t.level,-1+2*(t.y+v)/2**t.level);
/** Quadtree: about 64 m tiles near her, progressively coarse toward the horizon.
 * Selection is pure. Rendering budgets generation; an old ancestor covers children until ready. */
export function selectTiles(world:WorldDescriptor,up:V3):PlanetTile[] {
 const maxLevel=Math.ceil(Math.log2(world.radius*2/64)),out:PlanetTile[]=[];
 function visit(face:number,level:number,x:number,y:number){
  const t={face,level,x,y,key:tileKey(face,level,x,y)},mid=tileDirection(t,.5,.5),span=world.radius*2/2**level,d=arc(up,mid,world.radius);
  if(level<maxLevel&&d<span*1.35+90){for(let i=0;i<2;i++)for(let j=0;j<2;j++)visit(face,level+1,x*2+i,y*2+j);}else out.push(t);
 }
 for(let face=0;face<6;face++)visit(face,0,0,0);return out;
}
