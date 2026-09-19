import './ravine.css';
import * as THREE from 'three';
import { Player } from './player';
import { installMobilityControls } from './mobilityControls';
import { Board, type Cell } from './match3';
import { BoardView } from './board3d';
import { PALETTE } from './colors';
import { buildRavine } from './ravineWorld';
import { NODES, EDGES, SAP_CAP, MANIFEST_SECONDS, vec, parseProgress, freshProgress, makeSoil, onBank, groundHeight, spend, guide, type NodeId } from './ravineModel';
const KEY='rootwake-ravine-v1';
let progress=freshProgress();try{progress=parseProgress(localStorage.getItem(KEY));}catch{/* Storage is optional. */}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{/* Gameplay remains available. */}}
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const btn=(id:string)=>el<HTMLButtonElement>(id);
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(67,innerWidth/innerHeight,.04,140);scene.add(camera);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;document.body.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight('#eff5d9','#435657',2.6));const sun=new THREE.DirectionalLight('#ffdfa2',2.7);sun.position.set(-12,18,6);scene.add(sun);
const lantern=new THREE.PointLight('#d5eed1',0,10,1.4);camera.add(lantern);
const world=buildRavine(scene);
const player=new Player(renderer.domElement,scene,camera);player.position.y=0;player.standHeightAt=groundHeight;player.teleport(-9,5,-.95);player.pitch=.15;installMobilityControls(player);
const soil=makeSoil(()=>progress);
const board=new Board(6,6,290926),boardView=new BoardView(camera),ray=new THREE.Raycaster();
type Mode='surface'|'roots'|'dryad'|'cultivate';let mode:Mode='surface',returnMode:Mode='surface';
let time=0,last=performance.now(),manifestRemaining=0,noticeUntil=0,lastZone='';
let descent:{from:THREE.Vector3;to:THREE.Vector3;t:number;duration:number;end:Mode}|null=null;
let boardTween=0;const oldPos=new THREE.Vector3(),oldQuat=new THREE.Quaternion();
let lookTarget:{yaw:number;pitch:number;t:number}|null=null;
const intro=el<HTMLDialogElement>('intro');
const shots:{mesh:THREE.Mesh;from:THREE.Vector3;to:THREE.Vector3;born:number}[]=[];
const shotGeometry=new THREE.SphereGeometry(.06,7,5),shotMaterials=PALETTE.map(p=>new THREE.MeshBasicMaterial({color:p.hex,depthTest:false}));
const hintRing=new THREE.Mesh(new THREE.TorusGeometry(.46,.04,6,24),new THREE.MeshBasicMaterial({color:'#fff6bc',depthTest:false}));boardView.group.add(hintRing);hintRing.visible=false;let hints:Cell[]=[],hintUntil=0;
function near(id:NodeId,r=2){return player.feet().distanceTo(NODES[id])<r;}
function atOak(){return Math.hypot(player.position.x-NODES.oak.x,player.position.z-NODES.oak.z)<1.15;}
function objective():NodeId {return mode==='surface'?'oak':mode==='dryad'?'oak':progress.communion?'grove':!progress.shortcut&&!progress.spring?'spring':'fern';}
function message(text:string,seconds=7){el('story').textContent=text;noticeUntil=time+seconds*1000;}
function defaultMessage(){
 if(time<noticeUntil)return;
 if(mode==='cultivate')el('story').textContent='Tap neighbouring gems. Cultivation gathers sap into one reservoir. Cascades feed the living root.';
 else if(mode==='surface')el('story').textContent=progress.arrived?'The pale grove remembers your visit. Your learning and tended roots remain.':'Look across the ravine toward the pale grove. Enter the golden oak to find a living path beneath the river.';
 else if(mode==='dryad')el('story').textContent='You are standing in the pale grove. Look back: the golden oak is across the river. This body is borrowed; your communion remains.';
 else if(progress.communion)el('story').textContent=near('grove')?'The far tree can lend you a body. Emerge, and see where the roots have brought you.':'The fern admits you. Follow its finer roots down through the rock, beneath the river, and up into the far tree.';
 else if(near('fern',2.8))el('story').textContent=progress.heard?'The fern inhabits fissures the oak cannot enter. Commune for 24 sap to follow it.':'Here the oak yields to a fern. Listen before you try to inhabit its finer roots.';
 else if(near('fork',3))el('story').textContent=progress.shortcut?'The tended root lives again. Follow it directly to the fern, or visit the spring.':'Two branches: the living root bends toward a spring. The direct root is dormant; 12 sap restores it permanently.';
 else el('story').textContent=progress.spring?'The spring has given 12 sap. Follow the connected root onward to the fern.':'Follow the golden living root. The spring lies along the longer path; the fern waits beyond it.';
}
function refresh(){
 document.body.dataset.mode=mode;
 el('mode-name').textContent=mode==='cultivate'?'Cultivation':mode==='dryad'?`Dryad · ${Math.ceil(manifestRemaining)}s`:mode==='roots'?(progress.communion?'Fine-root communion':'Inside the oak’s roots'):'The golden oak';
 el('energy').textContent=`${progress.sap} / ${SAP_CAP} sap`;el('energy-fill').style.width=`${progress.sap/SAP_CAP*100}%`;
 el('actions').hidden=mode==='cultivate';el('board-tools').hidden=mode!=='cultivate';btn('walk').hidden=mode==='cultivate';
 btn('enter').hidden=mode==='roots';btn('enter').disabled=!!descent||(mode==='surface'&&!atOak());btn('enter').innerHTML=mode==='dryad'?'Return to the roots<small>Release your borrowed body</small>':'Enter the oak<small>Stand in the golden ring</small>';
 btn('cultivate').hidden=mode==='dryad';btn('cultivate').disabled=!!descent||(mode==='surface'&&!atOak());
 btn('tend').hidden=mode!=='roots'||progress.shortcut||!(near('fork',3)||near('fern',2.8));btn('tend').disabled=progress.sap<12||!!descent;
 btn('listen').hidden=mode!=='roots'||progress.heard||!near('fern',2.8);
 btn('commune').hidden=mode!=='roots'||!progress.heard||progress.communion||!near('fern',2.8);btn('commune').disabled=progress.sap<24;
 btn('manifest').hidden=mode!=='roots'||!progress.communion||!near('grove',2.5);btn('manifest').disabled=!!descent;
 btn('orient').innerHTML=mode==='surface'?'Face the oak<small>Turn toward its golden ring</small>':mode==='dryad'?'Look back at the oak<small>See the distance you crossed</small>':'Face the next root<small>Turn your gaze; use the stick to travel</small>';
 el('instruction').textContent=mode==='cultivate'?'Tap two neighbouring gems to swap.':'Drag to look. Stick to move; hold its centre for targets.';
 defaultMessage();
}
function transitionTo(end:Mode,to:THREE.Vector3,duration=2.3){
 player.cancelInput();lookTarget=null;player.enabled=true;player.canMove=false;
 if(end==='roots'){player.free=true;player.traversalWorld=soil;}
 descent={from:player.feet(),to,t:0,duration,end};refresh();
}
function enterRoots(){if(descent||boardView.isBusy)return;if(mode==='surface'&&atOak())transitionTo('roots',NODES.oak.clone());else if(mode==='dryad')transitionTo('roots',NODES.grove.clone(),1.8);}
function cultivate(){if(descent||boardView.isBusy||mode==='dryad'||(mode==='surface'&&!atOak()))return;returnMode=mode;oldPos.copy(camera.position);oldQuat.copy(camera.quaternion);boardTween=1;player.cancelInput();player.enabled=false;mode='cultivate';boardView.bind(board);boardView.show(time);noticeUntil=0;refresh();}
function leaveBoard(){if(boardView.isBusy)return;oldPos.copy(camera.position);oldQuat.copy(camera.quaternion);boardTween=1;boardView.hide();boardView.unbind();hints=[];hintRing.visible=false;mode=returnMode;player.enabled=true;player.cancelInput();noticeUntil=0;refresh();}
function listen(){if(mode!=='roots'||!near('fern',2.8))return;progress.heard=true;save();message('The fern is patient with the stone. You remember how to become small enough to follow. Commune for 24 sap.');refresh();}
function orient(){if(descent||mode==='cultivate')return;const feet=player.feet();let point:THREE.Vector3;
 if(mode==='surface')point=vec(NODES.oak.x,.2,NODES.oak.z);
 else if(mode==='dryad')point=vec(-9,4,3.7);
 else point=guide(feet,objective(),progress).add(vec(0,.25,0));
 const d=point.sub(player.eye());lookTarget={yaw:Math.atan2(-d.x,-d.z),pitch:Math.atan2(d.y,Math.hypot(d.x,d.z)),t:0};
}
player.onTap=(x,y)=>{if(descent||boardTween>0)return;ray.setFromCamera(new THREE.Vector2(x/innerWidth*2-1,-y/innerHeight*2+1),camera);if(mode==='cultivate'){hints=[];hintRing.visible=false;boardView.tap(ray);}else if(mode==='roots'&&near('fern',2.8)){const p=NODES.fern.clone().add(vec(0,.4,0)).project(camera);if(p.z<1&&Math.hypot(x-(p.x+1)*innerWidth/2,y-(1-p.y)*innerHeight/2)<45)listen();}};
// Looking by hand always wins over the optional direction cue.
renderer.domElement.addEventListener('pointerdown',()=>{lookTarget=null;});
boardView.onRun=(run,origin)=>{progress.sap=Math.min(SAP_CAP,progress.sap+run.cells.length);save();const mesh=new THREE.Mesh(shotGeometry,shotMaterials[run.type]);mesh.renderOrder=100;scene.add(mesh);shots.push({mesh,from:origin.clone(),to:player.feet().clone().add(vec(0,.1,-1)),born:time});message(progress.sap===SAP_CAP?'Your reservoir is full. Return to the roots to spend it.':`+${run.cells.length} sap. The living root takes up your cultivation.`,3);refresh();};
function possibleMove():Cell[]{for(let row=0;row<6;row++)for(let col=0;col<6;col++)for(const[dr,dc]of[[1,0],[0,1]]){const r=row+dr,c=col+dc;if(r>=6||c>=6)continue;const a=board.grid[row][col],b=board.grid[r][c];board.grid[row][col]=b;board.grid[r][c]=a;const ok=board.findRuns().length>0;board.grid[row][col]=a;board.grid[r][c]=b;if(ok)return[{row,col},{row:r,col:c}];}return[];}
btn('enter').onclick=enterRoots;btn('cultivate').onclick=cultivate;btn('done').onclick=leaveBoard;btn('listen').onclick=listen;btn('orient').onclick=orient;
btn('tend').onclick=()=>{if(mode==='roots'&&(near('fork',3)||near('fern',2.8))&&spend(progress,'shortcut')){save();message('The dormant root wakes. Your care has made a permanent, shorter passage.');refresh();}};
btn('commune').onclick=()=>{if(mode==='roots'&&near('fern',2.8)&&spend(progress,'communion')){save();message('You remember the fern. Fine roots brighten beneath the river; they can hold your awareness now.');refresh();}};
btn('manifest').onclick=()=>{if(mode==='roots'&&progress.communion&&near('grove',2.5)&&!descent){transitionTo('dryad',vec(NODES.grove.x,groundHeight(NODES.grove.x,NODES.grove.z),NODES.grove.z));}};
btn('hint').onclick=()=>{if(boardView.isBusy)return;hints=possibleMove();hintUntil=time+5500;message('The ring alternates between two neighbours. Tap one, then the other.',5);};
btn('help').onclick=()=>{player.cancelInput();intro.showModal();};btn('begin').onclick=()=>{intro.close();last=performance.now();};
btn('reset').onclick=()=>{if(boardView.isBusy||descent)return;if(!confirm('Restart this ravine study? Your first study is unaffected.'))return;progress=freshProgress();save();location.reload();};
document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('visibilitychange',()=>{last=performance.now();player.cancelInput();});
window.addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();boardView.layout();});
const surfaceColour=new THREE.Color('#a0b8ae'),soilColour=new THREE.Color('#102726'),colour=new THREE.Color();
let uiClock=0;
function frame(now:number){requestAnimationFrame(frame);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;if(document.hidden||intro.open)return;time+=dt*1000;
 if(descent){const d=descent;d.t=Math.min(1,d.t+dt/d.duration);const k=d.t*d.t*(3-2*d.t);const p=d.from.clone().lerp(d.to,k);player.teleport(p.x,p.z,player.yaw,p.y);if(d.t===1){mode=d.end;descent=null;player.canMove=true;player.free=mode==='roots';player.traversalWorld=mode==='roots'?soil:null;player.teleport(p.x,p.z,player.yaw,p.y);if(mode==='dryad'){manifestRemaining=MANIFEST_SECONDS;progress.arrived=true;save();message('You have crossed. The golden oak is behind you, on the other bank. This dryad body lasts 90 active seconds.',10);}noticeUntil=mode==='dryad'?noticeUntil:0;refresh();}}
 player.update(now,mode==='roots'||descent?[]:world.colliders,p=>onBank(p.x,p.z)&&(mode!=='dryad'||Math.hypot(p.x-NODES.grove.x,p.z-NODES.grove.z)<6));
 if(lookTarget){lookTarget.t+=dt;const dy=Math.atan2(Math.sin(lookTarget.yaw-player.yaw),Math.cos(lookTarget.yaw-player.yaw));player.yaw+=dy*Math.min(1,dt*9);player.pitch+=(lookTarget.pitch-player.pitch)*Math.min(1,dt*9);if(lookTarget.t>1)lookTarget=null;}
 if(mode==='dryad'&&!descent){manifestRemaining=Math.max(0,manifestRemaining-dt);if(manifestRemaining===0){message('The borrowed body becomes leaves. Your awareness returns to the far tree’s roots.');enterRoots();}}
 if(mode==='roots'&&!descent&&!progress.spring&&near('spring',1.8)){progress.spring=true;progress.sap=Math.min(SAP_CAP,progress.sap+12);save();message('A spring sheltered in the roots. Its moisture gives 12 sap, once. Follow the living branch onward to the fern.',9);refresh();}
 player.applyCamera(camera);
 if(mode==='cultivate'){const p=player.feet();camera.position.copy(p).add(vec(0,2.1,3.9));camera.lookAt(p.clone().add(vec(0,.6,0)));}
 if(boardTween>0){boardTween=Math.max(0,boardTween-dt*1.8);const k=boardTween*boardTween*(3-2*boardTween);camera.position.lerp(oldPos,k);camera.quaternion.slerp(oldQuat,k);}
 camera.updateMatrixWorld();
 const under=mode==='cultivate'?(returnMode==='roots'?1:0):THREE.MathUtils.clamp((groundHeight(player.position.x,player.position.z)-player.eye().y)/.8,0,1);
 world.update(progress,under,time);colour.copy(surfaceColour).lerp(soilColour,under);scene.background=colour;scene.fog=new THREE.FogExp2(colour,.018+under*.024);lantern.intensity=under*10;
 boardView.update(time);if(mode==='cultivate'){boardView.group.scale.multiplyScalar(innerHeight<520?.78:innerHeight<740?.82:.95);boardView.group.position.y=Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*2.2*2*(innerHeight<520?-.08:innerHeight<740?-.12:-.15);}
 btn('done').disabled=boardView.isBusy||boardTween>0;btn('hint').disabled=boardView.isBusy;
 if(hints.length&&time<hintUntil&&!boardView.isBusy){const c=hints[Math.floor(time/700)%2];hintRing.position.set(c.col-2.5,2.5-c.row,.15);hintRing.visible=true;}else hintRing.visible=false;
 for(let i=shots.length-1;i>=0;i--){const s=shots[i],k=Math.min(1,(time-s.born)/650);s.mesh.position.lerpVectors(s.from,s.to,k);s.mesh.position.y+=Math.sin(k*Math.PI)*.4;if(k===1){scene.remove(s.mesh);shots.splice(i,1);}}
 const zone=mode==='roots'?(near('fern',2.8)?'fern':near('fork',3)?'fork':near('grove',2.5)?'grove':'travel'):mode;uiClock+=dt;if(zone!==lastZone||uiClock>.3){refresh();uiClock=0;lastZone=zone;}
 const target=objective(),point=NODES[target].clone().add(vec(0,.4,0)),screen=point.clone().project(camera),distance=player.feet().distanceTo(NODES[target]);
 el('bearing').hidden=mode==='cultivate';el('bearing').textContent=mode==='dryad'?`Borrowed body · ${Math.ceil(manifestRemaining)}s · communion is permanent`:mode==='roots'?`${{oak:'Golden oak',fork:'Root fork',spring:'Sheltered spring',fern:'Fissure fern',under:'Beneath the river',grove:'Pale grove'}[target]} · ${distance.toFixed(0)} m${!progress.shortcut&&near('fork',3)?' · two routes':''}`:'The pale grove waits across the river';
 el('label').hidden=mode!=='roots'||screen.z>1||Math.abs(screen.x)>.85||Math.abs(screen.y)>.65;el('label').style.left=`${(screen.x+1)*innerWidth/2}px`;el('label').style.top=`${(1-screen.y)*innerHeight/2}px`;el('label').textContent=target==='fern'?'FISSURE FERN':target==='spring'?'SHELTERED SPRING':'PALE GROVE';
 renderer.render(scene,camera);
}
refresh();player.applyCamera(camera);world.update(progress,0,0);scene.background=surfaceColour;renderer.render(scene,camera);intro.showModal();requestAnimationFrame(frame);
Object.assign(window,{__ravine:{scene,camera,renderer,player,board,boardView,soil,nodes:NODES,edges:EDGES,possibleMove,get state(){return{...progress};},get mode(){return mode;},get transitioning(){return!!descent||boardTween>0;},get manifestRemaining(){return manifestRemaining;}}});
