import * as T from 'three';
import { type Campaign, done } from './state';
/** The canonical cube-vertex network from DiggyDwarves/worldGraph. */
const vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
export function createGlobe(canvas:HTMLCanvasElement):{draw:(s:Campaign)=>void;resize:()=>void} {
 const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,20);camera.position.set(0,0,5.2);
 scene.add(new T.AmbientLight('#a8dedc',1.7));const light=new T.DirectionalLight('#e7c386',3);light.position.set(-3,4,5);scene.add(light);
 const group=new T.Group();scene.add(group);group.rotation.set(.3,-.5,.2);
 group.add(new T.Mesh(new T.IcosahedronGeometry(1,3),new T.MeshStandardMaterial({color:'#18323e',roughness:.9,metalness:.25,flatShading:true})));
 const pos=vertices.map(p=>new T.Vector3(...p as [number,number,number]).normalize().multiplyScalar(1.035));
 const paths:T.Line[]=[];
 for(const [a,b] of edges){const pts=Array.from({length:32},(_,i)=>pos[a].clone().lerp(pos[b],i/31).normalize().multiplyScalar(1.045));const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:'#6e8d8c',transparent:true,opacity:.65}));group.add(line);paths.push(line);}
 pos.forEach((p,i)=>{const dot=new T.Mesh(new T.SphereGeometry(i===6?.06:.04,12,8),new T.MeshBasicMaterial({color:i===6?'#e77398':i===0?'#acde86':i===2?'#ffb974':'#9bdcd7'}));dot.position.copy(p);group.add(dot);});
 let held=false,last=0;canvas.addEventListener('pointerdown',e=>{held=true;last=e.clientX;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(held){group.rotation.y+=(e.clientX-last)*.012;last=e.clientX;}});canvas.addEventListener('pointerup',()=>held=false);canvas.addEventListener('pointercancel',()=>held=false);
 function resize():void {const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 return {resize,draw:(s)=>{if(!held)group.rotation.y+=.0015;const c=done(s,'ignite')?'#d4fff0':'#d19b55';(paths[0].material as T.LineBasicMaterial).color.set(c);(paths[1].material as T.LineBasicMaterial).color.set(c);renderer.render(scene,camera);}};
}
