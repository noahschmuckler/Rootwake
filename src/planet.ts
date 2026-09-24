import * as THREE from 'three';
import { Player } from './player';
import { installMobilityControls } from './mobilityControls';
import { createHulda } from './huldaCharacter';
import { worldDescriptor, initialPose, travel, turn, surfacePoint, karstAnchors, scale, arc, type V3, type PlanetPose } from './planetModel';
import { createPlanetWorld } from './planetWorld';
import './planet.css';
const params=new URLSearchParams(location.search);
let descriptor;try{descriptor=worldDescriptor(Number(params.get('seed')??1),Number(params.get('radius')??800));}catch{descriptor=worldDescriptor();}
const world=descriptor,scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.05,world.radius*5);
scene.background=new THREE.Color('#a9bcae');const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);document.body.prepend(renderer.domElement);
const light=new THREE.DirectionalLight('#fff0d0',2.4);light.position.set(1,2,1);scene.add(light,new THREE.AmbientLight('#ceddcc',1.7));
const terrain=createPlanetWorld(scene,world),hulda=createHulda();scene.add(hulda.group);
const player=new Player(renderer.domElement,scene,camera);player.traversalWorld={surfacesAt:()=>[],canOccupy:()=>false};installMobilityControls(player);player.avatar.visible=false;
let pose:PlanetPose=initialPose(),last=performance.now(),yaw=0,overview=false,auto=false,pace=0,distance=0;
const speeds=[2.8,6.5,26,100],labels=['Run','Root pace','Wind pace','Survey'];
const anchors=karstAnchors();const rock=new THREE.MeshStandardMaterial({color:'#bbb8a2',roughness:1,flatShading:true});
const landmarks=anchors.map(a=>{const g=new THREE.Group();const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(a.direction.x,a.direction.y,a.direction.z));g.quaternion.copy(q);for(const [x,z,r,h] of [[0,0,13,64],[34,-22,8,42],[-30,20,7,34]]){const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.6,r,h,9),rock);m.position.set(x,h/2,z);g.add(m);}scene.add(g);return {anchor:a,group:g};});
const el=(id:string)=>document.getElementById(id)!;
el('overview').onclick=()=>{overview=!overview;el('overview').textContent=overview?'Return to Hulda':'See the world';player.cancelInput();};
el('pace').onclick=()=>{pace=(pace+1)%speeds.length;el('pace').textContent=`${labels[pace]} · ${speeds[pace]} m/s`;};
el('tour').onclick=()=>{auto=!auto;el('tour').textContent=auto?'Stop travelling':'Follow great circle';};
(document.querySelector('[name=seed]') as HTMLInputElement).value=String(world.seed);(document.querySelector('[name=radius]') as HTMLSelectElement).value=String(world.radius);
const vec=(p:V3)=>new THREE.Vector3(p.x,p.y,p.z);
function step(metres:number){pose=travel(pose,metres,world.radius);distance+=Math.abs(metres);}
function frame(now:number){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden)return;
 player.update(now,[]);const delta=player.yaw-yaw;yaw=player.yaw;pose=turn(pose,-delta);
 const g=player.gesture;let x=g.held?g.x:0,y=g.held?-g.y:0;if(player.keys.has('KeyW'))y=1;if(player.keys.has('KeyS'))y=-1;if(player.keys.has('KeyA'))x=-1;if(player.keys.has('KeyD'))x=1;
 const length=Math.min(1,Math.hypot(x,y));if(length>.15&&!overview){const a=Math.atan2(x,y);pose=turn(pose,a);step(speeds[pace]*dt*length);pose=turn(pose,-a);}else if(auto)step(speeds[pace]*dt);
 const origin=surfacePoint(world,pose.up);terrain.update(pose.up,origin);
 for(const {anchor,group} of landmarks)group.position.copy(vec(surfacePoint(world,anchor.direction))).sub(vec(origin));
 const up=vec(pose.up),forward=vec(pose.forward),right=forward.clone().cross(up).normalize();
 hulda.group.position.copy(up.clone().multiplyScalar(.06));hulda.group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,forward.clone().negate()));hulda.group.visible=!overview;
 if(overview){scene.fog=null;camera.position.copy(vec(scale(pose.up,world.radius*2.4))).sub(vec(origin));camera.up.copy(forward);camera.lookAt(vec(scale(origin,-1)));}
 else{scene.fog=new THREE.Fog('#a9bcae',130,300);camera.up.copy(up);camera.position.copy(up.clone().multiplyScalar(2.1)).addScaledVector(forward,-4.2);camera.lookAt(up.clone().multiplyScalar(1.0+Math.sin(player.pitch)*3).addScaledVector(forward,3));}
 const nearest=anchors.map(a=>({id:a.id,d:arc(pose.up,a.direction,world.radius)})).sort((a,b)=>a.d-b.d)[0];
 el('readout').textContent=`${(distance/1000).toFixed(2)} km travelled · ${nearest.id}: ${nearest.d.toFixed(0)} m · ${(2*Math.PI*world.radius/2.8/60).toFixed(0)} min around on foot`;
 renderer.render(scene,camera);
}
window.addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});document.addEventListener('visibilitychange',()=>{last=performance.now();player.cancelInput();});
Object.assign(window,{__planet:{world,terrain,renderer,scene,camera,get pose(){return pose;},get distance(){return distance;},step,turn:(a:number)=>{pose=turn(pose,a);},get stats(){return terrain.stats;},set auto(on:boolean){auto=on;},set pace(n:number){pace=Math.max(0,Math.min(speeds.length-1,n));}}});

requestAnimationFrame(frame);
