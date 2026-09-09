import * as THREE from 'three';
import { buildWorld } from './world';
import { Player } from './player';
import { installMobilityControls } from './mobilityControls';
import { Board } from './match3';
import { BoardView } from './board3d';
import { CameraRig, type CameraPose } from './cameraLock';
import { Projectiles } from './projectiles';
import { dressHulda } from './hulda/avatar';
import { buildGarden, updatePlant } from './hulda/garden';
import { FORMS, freshState, restore, completed, unlocked, remembered, channelRun, cast, type Channel, type Power } from './hulda/state';
import './hulda/style.css';

const $ = <T extends HTMLElement = HTMLElement>(id:string)=>document.getElementById(id) as T;
document.body.innerHTML=`
<canvas id="world" aria-label="Hulda's mountain garden. Drag to look; use the movement stick to walk."></canvas>
<header><div class="eyebrow">ROOTWAKE · HULDA</div><div class="title">The Remembering Garden</div><div id="stats"></div></header>
<button id="journal" class="quiet">Memories <span id="memory-count">0 / 6</span></button>
<section id="objective"><span id="chapter" class="eyebrow"></span><div id="goal"></div><button id="orient" class="text-button">Turn toward it ↗</button></section>
<div id="notice" role="status" aria-live="polite"></div>
<section id="focus" hidden><div class="eyebrow" id="focus-name"></div><div id="intent"></div><div class="meter"><i id="progress"></i></div><div id="progress-text"></div></section>
<div id="channels" hidden><button id="grow" class="selected">Channel growth</button><button id="reserve">Store energy</button></div>
<div id="powers" hidden><button id="surge">Quickening · 12</button><button id="mend">Mend · 15</button><button id="ward">Root ward · 9</button></div>
<div id="tools"><button id="view" class="quiet">View</button><button id="walk"></button></div>
<div id="actions"><button id="attune" class="primary">Touch the bramble</button><button id="rest">Rest</button><button id="eat">Eat fruit</button><button id="remedy">Remedy</button></div>
<button id="back" hidden>Return to the garden</button>
<dialog id="story"><div class="eyebrow">ONE OF SEVEN</div><h1 id="story-title"></h1><div id="story-copy"></div><button id="continue" class="primary">Awaken</button></dialog>
<dialog id="memories"><div class="eyebrow">HULDA · KEEPER OF LIVING THINGS</div><h1>What the hands remember</h1><div id="memory-list"></div><button id="close-journal">Return</button><button id="reset" class="text-button">Begin a new awakening</button></dialog>`;
const canvas=$<HTMLCanvasElement>('world');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.04,5000);scene.add(camera);
const world=buildWorld(scene),garden=buildGarden(scene);
world.sun.color.setHex(0xffdfac);world.hemi.intensity=1.7;
const player=new Player(canvas,scene,camera);scene.add(player.avatar);player.view='third';player.thirdZoom=1.15;
const animateHulda=dressHulda(player.avatar);
installMobilityControls(player);
$('walk').setAttribute('aria-label','Drag to walk. Hold still for visible landing targets.');
const boardView=new BoardView(camera),cameraRig=new CameraRig(camera),shots=new Projectiles(scene);
const seed=Number(new URLSearchParams(location.search).get('seed')) || 719;
const boards=FORMS.map((_,i)=>new Board(6,6,seed+i*971));
const SAVE='rootwake.hulda.awakening.v1';
let state=freshState(),storageOK=true;
try {const raw=localStorage.getItem(SAVE);if(raw)state=restore(JSON.parse(raw));}catch{storageOK=false;}
let selected:number|null=null,channel:Channel='grow',now=0,pending=0,returnPose:CameraPose|null=null,nearest=0,noticeUntil=0,restUntil=0,shownMemory=-1;
function persist():void {try{localStorage.setItem(SAVE,JSON.stringify(state));}catch{storageOK=false;}}
function notify(text:string,duration=5500):void {$('notice').textContent=text;noticeUntil=now+duration;}
function showStory(title:string,copy:string,label='Continue'):void {
  $('story-title').textContent=title;$('story-copy').textContent=copy;$('continue').textContent=label;
  player.cancelInput();player.enabled=false;$<HTMLDialogElement>('story').showModal();
}
function modalOpen():boolean {return $<HTMLDialogElement>('story').open||$<HTMLDialogElement>('memories').open;}
$('continue').onclick=()=>{$<HTMLDialogElement>('story').close();player.enabled=selected===null;};
$<HTMLDialogElement>('story').addEventListener('cancel',()=>{player.enabled=selected===null;});
function changed(before:number):void {
  persist();if(remembered(state)>before){shownMemory=Math.max(0,remembered(state)-1);notify(FORMS[shownMemory].memory,9500);}
  refresh();
}
function openNode(index:number):void {
  if(selected!==null||cameraRig.mode!=='free'||modalOpen())return;
  if(!unlocked(state,index)){notify('A form you cannot quite remember. Follow the answering plants first.');return;}
  const center=garden.nodes[index].group.position.clone();
  if(player.position.distanceTo(new THREE.Vector3(center.x,-1,center.z))>3.7){notify('Walk closer. The plant must be within your reach.');return;}
  selected=index;channel='grow';returnPose=cameraRig.currentPose();player.cancelInput();player.enabled=false;
  const back=player.position.clone().sub(center);back.y=0;if(back.length()<.2)back.set(0,0,1);back.normalize();
  const target=center.clone().add(new THREE.Vector3(0,index===1||index===5?1:.6,0));
  const pose={position:center.clone().addScaledVector(back,4.4).add(new THREE.Vector3(0,2.2,0)),target};
  const lowest=boardView.lowestWorldY(pose.position,pose.target);
  if(lowest<-.7){pose.position.y+=-.7-lowest;pose.target.y+=-.7-lowest;}
  cameraRig.lock(now,pose);boardView.bind(boards[index]);layoutBoard();refresh();
}
function closeNode():void {
  if(cameraRig.mode!=='locked'||boardView.isBusy||pending||!returnPose)return;
  boardView.hide();cameraRig.unlock(now,returnPose);
}
cameraRig.onModeChange=mode=>{
  if(mode==='locked'){boardView.show(now);refresh();}
  if(mode==='free'){
    selected=null;boardView.unbind();player.enabled=!modalOpen();refresh();
    if(shownMemory>=0){const i=shownMemory;shownMemory=-1;showStory(FORMS[i].gift,FORMS[i].memory+(i===5?' You have restored the plateau. Bring fruit, remedies and living wards to the journey below. This playtest ends here; the party and its journey are still to come.':''),'Return to the garden');}
  }
};
const ray=new THREE.Raycaster();
player.onTap=(x,y)=>{
  if(modalOpen())return;
  ray.setFromCamera(new THREE.Vector2(x/innerWidth*2-1,-y/innerHeight*2+1),camera);
  if(selected!==null){if(cameraRig.mode==='locked')boardView.tap(ray);return;}
  const hits=ray.intersectObjects(garden.nodes.map(n=>n.group),true);
  if(hits[0])openNode(hits[0].object.userData.nodeIndex);
};
boardView.onRun=(run,origin)=>{
  if(selected===null)return;
  const index=selected,chosenChannel=channel;pending++;
  shots.fire(origin,garden.nodes[index].group.position.clone().add(new THREE.Vector3(0,.6,0)),channel==='grow'?0xc5ea86:0xffd688,now,()=>{
    pending--;const before=remembered(state),result=channelRun(state,index,run.cells.length,chosenChannel);
    changed(before);
    if(result.damage)notify('The blight lashes out. Root ward can absorb its next attacks.');
    else if(!result.finished)notify(`${run.cells.length} notes answered · ${channel==='grow'?'life flows into the plant':'energy held for a stronger form'}${run.cells.length>3?' · long-match bonus':''}`,2300);
  });
};
function usePower(power:Power):void {
  if(selected===null||boardView.isBusy||pending)return;
  const before=remembered(state);
  if(cast(state,selected,power)){
    shots.fire(player.eye(),garden.nodes[selected].group.position.clone().add(new THREE.Vector3(0,.8,0)),0xd5fba4,now,()=>{});
    notify(power==='surge'?'Quickening: a season passes through your hands.':power==='mend'?'Silverleaf warmth steadies the living heart.':'Roots rise to absorb the next two blight lashes.');changed(before);
  }
}
$('surge').onclick=()=>usePower('surge');$('mend').onclick=()=>usePower('mend');$('ward').onclick=()=>usePower('ward');
$('grow').onclick=()=>{channel='grow';refresh();};$('reserve').onclick=()=>{channel='reserve';refresh();};$('back').onclick=closeNode;
$('view').onclick=()=>{player.view=player.view==='third'?'first':'third';};
$('attune').onclick=()=>openNode(nearest);
$('orient').onclick=()=>{const i=Math.min(remembered(state),5),at=FORMS[i].at;player.yaw=Math.atan2(player.position.x-at[0],player.position.z-at[1]);player.pitch=0;notify('Follow the golden pollen toward the answering plant.');};
$('eat').onclick=()=>{if(state.fruit){state.fruit--;state.vigor=Math.min(100,state.vigor+24);persist();refresh();notify('Sweet fruit, freely given. +24 vigor.');}};
$('remedy').onclick=()=>{if(state.remedies){state.remedies--;state.vigor=Math.min(100,state.vigor+40);persist();refresh();notify('Silverleaf restores you. +40 vigor.');}};
$('rest').onclick=()=>{
  if(selected!==null||restUntil>now)return;
  const sheltered=completed(state,1)&&Math.hypot(player.position.x-3.5,player.position.z+5)<2.6;
  state.vigor=Math.max(state.vigor,sheltered?100:70);restUntil=now+1700;player.cancelInput();player.enabled=false;document.body.classList.add('resting');
  notify(sheltered?'Leaves cradle you. A living roof, a moss bed. Fully restored.':'You breathe with the mountain. Rest restores 70 vigor; your bower restores 100.');persist();refresh();
};
$('journal').onclick=()=>{
  if(boardView.isBusy||pending)return;
  $('memory-list').innerHTML=FORMS.map((f,i)=>`<article><span class="eyebrow">${String(i+1).padStart(2,'0')} · ${completed(state,i)?'REMEMBERED':'DORMANT'}</span><h3>${completed(state,i)?f.gift:'An unremembered form'}</h3><p>${completed(state,i)?f.memory:'A shape waits beyond the edge of memory.'}</p></article>`).join('')+`<p class="footnote">Journey supplies: ${state.fruit} fruit · ${state.remedies} remedies · ${state.seeds} primordial seeds.<br>${storageOK?'Progress saves on this device.':'Saving is unavailable in this browser session.'}</p>`;
  player.cancelInput();player.enabled=false;$<HTMLDialogElement>('memories').showModal();
};
$('close-journal').onclick=()=>{$<HTMLDialogElement>('memories').close();player.enabled=selected===null;};
$<HTMLDialogElement>('memories').addEventListener('cancel',()=>{player.enabled=selected===null;});
let resetArmed=false;
$('reset').onclick=()=>{if(!resetArmed){resetArmed=true;$('reset').textContent='Erase this awakening? Tap again to restart.';return;}state=freshState();persist();location.reload();};
function refresh():void {
  const count=remembered(state),locked=selected!==null;
  $('stats').textContent=`Vigor ${Math.round(state.vigor)} · Living energy ${state.sap} / 60`;
  $('memory-count').textContent=`${count} / 6`;
  $('chapter').textContent=count===6?'A GARDEN FOR SEVEN':`MEMORY ${count+1} OF 6`;
  $('goal').textContent=count===6?'The plateau lives. Gather supplies for the road below.':FORMS[count].description;
  $('objective').hidden=locked;$('tools').hidden=locked;$('actions').hidden=locked;
  for(const id of ['focus','channels','powers','back'])$(id).hidden=!locked;
  $('eat').textContent=`Fruit · ${state.fruit}`;$<HTMLButtonElement>('eat').disabled=!state.fruit;
  $('remedy').textContent=`Remedy · ${state.remedies}`;$<HTMLButtonElement>('remedy').disabled=!state.remedies;
  $('remedy').hidden=!completed(state,3);
  if(selected===null)return;
  const f=FORMS[selected],done=completed(state,selected);
  $('focus-name').textContent=f.name;
  $('intent').textContent=done?(selected===0||selected===3||selected===4?'Keep matching to gather its gifts.':'This form is remembered. Bank energy, or return to explore.'):f.verb;
  $('progress').style.width=`${Math.min(100,state.progress[selected]/f.need*100)}%`;
  $('progress-text').textContent=`${Math.min(f.need,state.progress[selected])} / ${f.need}${selected===5&&!done?` · Blight lashes in ${3-state.pulses%3} matches · ${state.ward} wards`:done?' · Remembered':''}`;
  $('grow').classList.toggle('selected',channel==='grow');$('reserve').classList.toggle('selected',channel==='reserve');
  const busy=boardView.isBusy||pending>0||cameraRig.mode!=='locked';
  $<HTMLButtonElement>('surge').disabled=busy||state.sap<12||done;
  $<HTMLButtonElement>('mend').disabled=busy||state.sap<15||!completed(state,3);
  $<HTMLButtonElement>('ward').disabled=busy||state.sap<9||!completed(state,2);
  $('mend').textContent=completed(state,3)?'Mend · 15':'Mend · dormant';$('ward').textContent=completed(state,2)?'Root ward · 9':'Ward · dormant';
  for(const id of ['back','grow','reserve','journal'])$<HTMLButtonElement>(id).disabled=busy;
}
const trailGeometry=new THREE.BufferGeometry(),trailPositions=new Float32Array(45*3);trailGeometry.setAttribute('position',new THREE.BufferAttribute(trailPositions,3));
const trail=new THREE.Points(trailGeometry,new THREE.PointsMaterial({color:0xeed99a,size:.055,transparent:true,opacity:.65,depthWrite:false}));scene.add(trail);
function layoutBoard():void {
  boardView.layout();
  // Leave a clear touch zone below the gems for channel and ability buttons.
  boardView.group.position.y += 2*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*2.2*.07;
}
function resize():void {renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();layoutBoard();}addEventListener('resize',resize);
const rootWard=new THREE.Group();
for(let i=0;i<8;i++){
  const a=i*Math.PI/4,points=Array.from({length:12},(_,j)=>new THREE.Vector3(Math.sin(a+j*.04)*.5,j*.075,Math.cos(a+j*.04)*.5));
  rootWard.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),14,.014,4,false),new THREE.MeshStandardMaterial({color:0x8fbd71,emissive:0x446127,emissiveIntensity:.45})));
}
scene.add(rootWard);
const rootLines=new THREE.Group();
for(const form of FORMS){
  const points=Array.from({length:25},(_,j)=>{const t=j/24;return new THREE.Vector3(7+(form.at[0]-7)*t,-.91, -1+(form.at[1]+1)*t+Math.sin(t*15)*.14);});
  rootLines.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.023,5,false),new THREE.MeshStandardMaterial({color:0x85975c,roughness:.9})));
}
scene.add(rootLines);
player.applyCamera(camera);refresh();
showStory('The mountain knows your name.',remembered(state)?'Your garden remembers. Return to the forms you awakened, or follow the next answering plant.':'Hulda wakes beneath the trees with no memory of how she came here. Yet the bramble leans toward her hand. Perhaps hunger is the first thing she can answer. Drag the world to look. Move with the thumbstick. Touch a nearby plant, then swap neighbouring gems to match three.','Enter the garden');
let previous=0,hudClock=0;
function frame(time:number):void {
  requestAnimationFrame(frame);const dt=Math.min(50,time-previous||16);previous=time;
  if(document.hidden)return;
  now+=dt;
  if(restUntil&&now>=restUntil){restUntil=0;document.body.classList.remove('resting');player.enabled=selected===null&&!modalOpen();}
  if(cameraRig.mode==='free'){
    player.enabled=!modalOpen()&&!restUntil;player.update(now,garden.colliders,world.isWalkable);player.applyCamera(camera);
  } else player.avatar.visible=false;
  if(!modalOpen()){cameraRig.update(now);boardView.update(now);shots.update(now);}
  animateHulda(now*.001,player.isMoving);
  garden.nodes.forEach((node,i)=>updatePlant(node,i,state.progress[i],now,selected===i,unlocked(state,i)));
  const next=Math.min(remembered(state),5),dest=FORMS[next].at;
  rootWard.visible=state.ward>0;rootWard.position.copy(player.position);rootWard.rotation.y=now*.0001;
  rootLines.visible=completed(state,2);
  if(!completed(state,5))garden.nodes[5].blight.rotation.y=Math.sin(now*.002)*.07;
  for(let i=0;i<45;i++){const t=((i/45+now*.00004)%1);trailPositions[i*3]=player.position.x+(dest[0]-player.position.x)*t;trailPositions[i*3+1]=-.75+Math.sin(t*12+now*.001)*.08;trailPositions[i*3+2]=player.position.z+(dest[1]-player.position.z)*t;}
  trail.geometry.attributes.position.needsUpdate=true;trail.visible=selected===null&&remembered(state)<6;
  if(now>noticeUntil)$('notice').textContent='';
  if(now-hudClock>120){
    hudClock=now;refresh();
    if(selected===null){let distance=Infinity;garden.nodes.forEach((n,i)=>{const d=Math.hypot(player.position.x-n.group.position.x,player.position.z-n.group.position.z);if(unlocked(state,i)&&d<distance){nearest=i;distance=d;}});$('attune').textContent=distance<=3.7?FORMS[nearest].verb:'Follow the pollen';$<HTMLButtonElement>('attune').disabled=distance>3.7;}
  }
  renderer.render(scene,camera);
}
requestAnimationFrame(frame);
// Readable handles for browser verification; no debug grants in the player UI.
if(new URLSearchParams(location.search).has('debug'))Object.assign(window,{__hulda:{scene,camera,player,boards,boardView,garden,get state(){return state;},openNode,closeNode,cast:usePower,renderer}});
