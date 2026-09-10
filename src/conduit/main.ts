import * as T from 'three';
import { Player } from '../player';
import { installMobilityControls } from '../mobilityControls';
import { Board, type Cell } from '../match3';
import { PALETTE } from '../colors';
import { buildCampaignWorld } from './world';
import { createGlobe } from './globe';
import { IDS, HEROES, ITEMS, PLACES, PROJECTS, PROJECT_IDS, REGIONS, fresh, restore, done, quiet, route, near, blocked, charge, cast, protect, focus, travel, assign, consume, pickup, transfer, inhabitants, ending, type HeroId, type RegionId, type ProjectId, type Item } from './state';
import './style.css';

const $=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
document.body.id='conduit';
document.body.innerHTML=`
<canvas id="world" aria-label="The Broken Conduit. Drag the world to look; use the thumbstick or WASD to walk."></canvas>
<div id="vignette"></div>
<header><div class="wordmark"><span class="kicker">ROOTWAKE <span class="small-sep">/</span> THE SEVEN</span><h1>The Broken Conduit</h1></div><nav><button id="world-button">World</button><button id="party-button">The seven</button><button id="journal-button" aria-label="Open chronicle">Chronicle</button></nav></header>
<section id="location"><span class="kicker" id="region-subtitle"></span><h2 id="region-name"></h2><div id="watch"></div></section>
<button id="objective-toggle" aria-expanded="false">The work ahead <span>＋</span></button>
<section id="objectives" hidden><div class="kicker">RESTORE A RELIABLE CONNECTION</div><div id="objective-content"></div></section>
<div id="notice" role="status" aria-live="polite"></div>
<div id="scene-caption"></div>
<section id="nearby"><div class="kicker">WITHIN THIS PLACE</div><div id="stations"></div></section>
<div id="tools"><button id="rest" title="Rest to recover vigor">Rest</button><button id="walk"></button></div>
<section id="encounter" hidden aria-label="Cooperative match-three encounter"><div class="encounter-head"><div><span class="kicker" id="encounter-place"></span><h2 id="encounter-title"></h2></div><button id="leave" aria-label="Leave encounter">×</button></div><p id="encounter-copy"></p><div class="progress-track"><i id="progress"></i></div><div id="progress-label"></div><div id="encounter-crew"></div><div class="power-row"><button class="primary" id="cast"></button><button id="ward" title="Spend 9 energy to absorb a breach attack">Ward · 9</button></div><div id="board" role="group" aria-label="Match three. Select a gem, then an adjacent gem. Arrow keys move focus; Enter selects."></div><div class="board-foot"><span id="board-help">Swap adjacent gems to gather energy.</span><button id="hint">Hint</button></div></section>
<footer id="roster" aria-label="Switch controlled champion"></footer>
<dialog id="world-dialog"><button class="close" data-close="world-dialog" aria-label="Close world map">×</button><span class="kicker">EIGHT KARSTS · ONE LIVING WORLD</span><h2>The spaces between us</h2><canvas id="globe" aria-label="Drag to rotate the eight-karst planetary network"></canvas><p class="map-note">Gold: the damaged route · Rose: the Keystone<br>Transport still works. Full containment does not.</p><div id="world-locations"></div><div id="travel-form"><h3>Travel with…</h3><div id="travelers"></div><label class="destination">Destination <select id="destination"></select></label><button id="travel" class="primary">Take the conduit · 1 watch</button><p class="muted">Only selected champions move. Everyone keeps what they carry. Switching attention is free.</p></div></dialog>
<dialog id="party-dialog"><button class="close" data-close="party-dialog" aria-label="Close party">×</button><span class="kicker">SEVEN WAYS OF SEEING</span><h2>Leave someone you trust</h2><p>Followers walk with the champion you control. Hold position to keep someone at a particular place. Assigned work finishes after two travel or project-completion watches.</p><div id="party-list"></div></dialog>
<dialog id="journal-dialog"><button class="close" data-close="journal-dialog" aria-label="Close chronicle">×</button><span class="kicker">THE WORLD REMEMBERS</span><h2>Chronicle</h2><div id="journal-content"></div><details><summary>How to play</summary><p>Drag the world to look; use MOVE or WASD to walk. Q/E turn on keyboard. Hold the stick’s center for landing targets. Select a nearby worksite to match gems, then spend energy on the selected champion’s gift. Nearby allies gather energy too.</p><p>At the Meridian, bring the right champions close to the site. Either grow a living crossing with the seedheart, or carry a forged coupling and build its stone cradle. The wound can be quieted or fought. The Artificer guides the final light.</p><p>The breach attacks after every three successful swaps, never while you think. Wards absorb attacks. Rest restores vigor for free outside encounters. There is no idle drain or offline simulation.</p></details><p id="save-status" class="muted"></p><div class="save-controls"><button id="export">Export journey</button><label class="file-button">Import journey<input type="file" id="import" accept="application/json,.json" hidden></label></div><button id="reset" class="danger">Begin another possibility</button></dialog>
<dialog id="story-dialog"><span class="kicker" id="story-kicker">AFTER THE SEVEN AWAKENED</span><h2 id="story-title">A light has gone out.</h2><div id="story-copy"></div><button class="primary" id="story-continue">Stand with Hulda</button></dialog>`;
const SAVE='rootwake.broken-conduit.v1';let s=fresh(),saving=true;
try{const raw=localStorage.getItem(SAVE);if(raw)s=restore(JSON.parse(raw));}catch{saving=false;}
let project:ProjectId|null=null,board:Board|null=null,selected:number|null=null,busy=false,now=0,noticeUntil=0,nearest:ProjectId|null='water';
const canvas=$<HTMLCanvasElement>('world');
let renderer:T.WebGLRenderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch{document.body.innerHTML='<main style="padding:2rem;color:white;background:#10232d">This journey needs WebGL. Please open it in a browser with 3D graphics enabled.</main>';throw new Error('WebGL unavailable');}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.05,350);
scene.add(new T.HemisphereLight('#badcd9','#27313f',2.5));const sun=new T.DirectionalLight('#ffe0b4',3.2);sun.position.set(-10,20,10);scene.add(sun);
const world=buildCampaignWorld(scene),player=new Player(canvas,scene,camera);player.position.y=0;player.view='third';player.thirdBackScale=2.7;player.thirdZoom=1.15;
installMobilityControls(player);
let region=s.heroes[s.active].region;
const walkable=(p:T.Vector3)=>Math.abs(p.x)<11.8&&p.z>-12.3&&p.z<11.7;
player.standHeightAt=()=>0;
function loadActor():void {const h=s.heroes[s.active];region=h.region;world.setRegion(region);player.teleport(h.x,h.z,h.yaw,0);player.position.y=0;player.pitch=0;player.moveSlowdown=h.items.includes('coupling')?.78:1;player.poweredLegs=false;player.applyCamera(camera);}
loadActor();
document.addEventListener('contextmenu',e=>e.preventDefault());
function syncActor():void {const h=s.heroes[s.active];h.x=player.position.x;h.z=player.position.z;h.yaw=player.yaw;}
function persist():void {syncActor();try{localStorage.setItem(SAVE,JSON.stringify(s));saving=true;}catch{saving=false;}}
function notify(message:string,ms=6000):void {
 $('notice').textContent=message;noticeUntil=now+ms;
 const dialog=document.querySelector<HTMLDialogElement>('dialog[open]');
 if(dialog){let status=dialog.querySelector<HTMLElement>('.dialog-notice');if(!status){status=document.createElement('p');status.className='dialog-notice';status.setAttribute('role','status');dialog.prepend(status);}status.textContent=message;}
}
function modalOpen():boolean{return !!document.querySelector('dialog[open]');}
function openDialog(id:string):void {if(busy)return;persist();player.cancelInput();player.enabled=false;const dialog=$<HTMLDialogElement>(id);dialog.querySelector('.dialog-notice')?.remove();dialog.showModal();}
function closeDialog(id:string):void {$<HTMLDialogElement>(id).close();player.enabled=!project;refresh();}
for(const el of document.querySelectorAll<HTMLButtonElement>('[data-close]'))el.onclick=()=>closeDialog(el.dataset.close!);
for(const el of document.querySelectorAll<HTMLDialogElement>('dialog'))el.addEventListener('cancel',()=>{player.enabled=!project;});
function html(id:string,text:string):void {if($(id).innerHTML!==text)$(id).innerHTML=text;}
function switchHero(id:HeroId):void {
 if(busy)return;syncActor();
 const keep=project!==null&&near(s,id,project);
 if(!keep){project=null;board=null;selected=null;}
 focus(s,id);loadActor();persist();refresh();
 if(!keep)notify(`${HEROES[id].name} · ${PLACES[region].name}. ${HEROES[id].gift}`,3500);
}
function faceProject(id:ProjectId):void {const at=PROJECTS[id].at;player.yaw=Math.atan2(player.position.x-at[0],player.position.z-at[1]);player.pitch=0;nearest=id;notify(`Walk toward the golden marker: ${PROJECTS[id].name}.`,4000);}
function boardFor(id:ProjectId):Board {
 if(!s.boards[id])s.boards[id]={seed:7103+PROJECT_IDS.indexOf(id)*7919,moves:[]};
 const saved=s.boards[id]!,b=new Board(6,6,saved.seed);
 for(const [a,c] of saved.moves){const result=b.swap(cell(a),cell(c));if(!result.valid){s.boards[id]={seed:saved.seed,moves:[]};return new Board(6,6,saved.seed);}}
 return b;
}
function enter(id:ProjectId):void {
 if(busy||modalOpen())return;syncActor();
 if(!near(s,s.active,id)){faceProject(id);return;}
 const reason=blocked(s,id);if(reason){notify(reason);return;}
 project=id;board=boardFor(id);selected=null;player.cancelInput();player.enabled=false;
 drawBoard();refresh();persist();
 notify('Match to gather energy. Choose a nearby champion, then release their gift.',4500);
}
function leave():void {if(busy)return;project=null;board=null;selected=null;player.enabled=!modalOpen();refresh();persist();}
$('leave').onclick=leave;
const ray=new T.Raycaster();
player.onTap=(x,y)=>{
 if(project||modalOpen())return;
 ray.setFromCamera(new T.Vector2(x/innerWidth*2-1,-y/innerHeight*2+1),camera);
 const targets=[...Object.values(world.regions[region].stations),...IDS.filter(id=>s.heroes[id].region===region).map(id=>world.actors[id]),...world.targets.filter(o=>o.userData.drop&&o.visible)].filter(Boolean) as T.Object3D[];
 const hit=ray.intersectObjects(targets,true)[0];if(!hit)return;
 const d=hit.object.userData;
 if(d.drop){const error=pickup(s,d.drop);notify(error??'Taken. This object travels with its carrier.');persist();refresh();}
 else if(d.hero&&d.hero!==s.active)switchHero(d.hero);
 else if(d.project)enter(d.project);
};
function cell(n:number):Cell{return {row:Math.floor(n/6),col:n%6};}
const symbols=['◆','●','▲','■','⬟'];
const shortNames:Partial<Record<HeroId,string>>={alchemist:'Alch.',artificer:'Artif.',steward:'Steward'};
function drawBoard():void {
 if(!board)return;
 const focused=(document.activeElement as HTMLElement|null)?.dataset.cell;
 $('board').innerHTML=board.grid.flat().map((g,i)=>`<button type="button" class="gem gem-${g.type}${selected===i?' picked':''}" data-cell="${i}" aria-label="${PALETTE[g.type].name} ${['diamond','circle','triangle','square','pentagon'][g.type]}, row ${Math.floor(i/6)+1}, column ${i%6+1}" aria-pressed="${selected===i}"><span aria-hidden="true">${symbols[g.type]}</span></button>`).join('');
 if(focused!==undefined)$('board').querySelector<HTMLButtonElement>(`[data-cell="${focused}"]`)?.focus({preventScroll:true});
}
function choose(n:number):void {
 if(busy||!board||!project)return;
 if(selected===null){selected=n;drawBoard();return;}
 if(selected===n){selected=null;drawBoard();return;}
 const a=selected;if(Math.abs(cell(a).row-cell(n).row)+Math.abs(cell(a).col-cell(n).col)!==1){selected=n;drawBoard();return;}
 doSwap(a,n);
}
function doSwap(a:number,b:number):void {
 if(!board||!project||busy)return;
 const id=project,result=board.swap(cell(a),cell(b));selected=null;
 if(!result.valid){drawBoard();$('board').classList.add('invalid');setTimeout(()=>$('board').classList.remove('invalid'),250);$('board-help').textContent='That swap needs to make a match.';return;}
 busy=true;refresh();
 const cleared=result.steps.reduce((sum,step)=>sum+step.cleared.length,0);
 // Logical transaction commits atomically before any animation: a backgrounded
 // phone can never save spent gems without their energy and consequences.
 s.boards[id]!.moves.push([a,b]);const message=charge(s,id,cleared);persist();
 const clearCells=new Set(result.steps[0].cleared.map(c=>c.row*6+c.col));
 for(const el of $('board').querySelectorAll<HTMLElement>('[data-cell]'))if(clearCells.has(Number(el.dataset.cell)))el.classList.add('matched');
 $('board-help').textContent=`${result.steps.length>1?`${result.steps.length} cascades · `:''}${cleared} gems released`;
 setTimeout(()=>{busy=false;drawBoard();refresh();notify(message,4000);if(result.reshuffled)notify('The board has renewed itself. Every new board has a possible match.');},Math.min(1100,360+result.steps.length*120));
}
let dragStart:{index:number;x:number;y:number}|null=null,suppressClick=false;
$('board').addEventListener('pointerdown',e=>{const el=(e.target as HTMLElement).closest<HTMLElement>('[data-cell]');if(!el||busy)return;dragStart={index:Number(el.dataset.cell),x:e.clientX,y:e.clientY};try{$('board').setPointerCapture(e.pointerId);}catch{/* detached synthetic input */}});
$('board').addEventListener('pointerup',e=>{
 if(!dragStart)return;const d=dragStart;dragStart=null;const dx=e.clientX-d.x,dy=e.clientY-d.y;
 if(Math.hypot(dx,dy)>20){const step=Math.abs(dx)>Math.abs(dy)?Math.sign(dx):Math.sign(dy)*6,n=d.index+step;
  if(n>=0&&n<36&&Math.abs(cell(n).row-cell(d.index).row)+Math.abs(cell(n).col-cell(d.index).col)===1)doSwap(d.index,n);
 }else choose(d.index);
 suppressClick=true;setTimeout(()=>suppressClick=false,50);
});
$('board').addEventListener('pointercancel',()=>dragStart=null);
$('board').addEventListener('click',e=>{if(e.detail!==0||suppressClick)return;const el=(e.target as HTMLElement).closest<HTMLElement>('[data-cell]');if(el)choose(Number(el.dataset.cell));});
$('board').addEventListener('keydown',e=>{
 const el=(e.target as HTMLElement).closest<HTMLElement>('[data-cell]');if(!el||busy)return;
 const delta:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-6,ArrowDown:6};if(!(e.key in delta))return;e.preventDefault();
 const n=Number(el.dataset.cell),next=n+delta[e.key];if(next>=0&&next<36)$('board').querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus();
});
$('hint').onclick=()=>{
 if(!board||!project||busy)return;
 for(let a=0;a<36;a++)for(const b of [a+1,a+6]){
  if(b>=36||Math.abs(cell(a).row-cell(b).row)+Math.abs(cell(a).col-cell(b).col)!==1)continue;
  const clone=boardFor(project);if(clone.swap(cell(a),cell(b)).valid){selected=a;drawBoard();$('board').querySelector(`[data-cell="${b}"]`)?.classList.add('suggested');$('board-help').textContent='Swap the two outlined gems.';return;}
 }
};
$('cast').onclick=()=>{
 if(!project||busy)return;const id=project,before=done(s,id),error=cast(s,id);
 if(error){notify(error);return;}
 const g=world.regions[region].stations[id];if(g){const flash=new T.PointLight(HEROES[s.active].color,14,9);flash.position.copy(g.position).add(new T.Vector3(0,2,0));scene.add(flash);setTimeout(()=>scene.remove(flash),550);}
 if(!before&&done(s,id)){
  notify(s.log[s.log.length-1].text,10000);leave();
  if(id==='ignite')showEnding();
 }else {notify(`${PROJECTS[id].ability[s.active]} · ${Math.round(s.progress[id])} / ${PROJECTS[id].need}`,2400);persist();refresh();}
};
$('ward').onclick=()=>{if(project&&!busy&&protect(s,project)){notify('A ward waits between you and the next lash.');persist();refresh();}};
function showEnding():void {s.endingSeen=true;persist();$('story-kicker').textContent='ONE CONNECTION RESTORED';$('story-title').textContent='The world is less alone.';$('story-copy').textContent=ending(s);$('story-continue').textContent='Return to the changed world';openDialog('story-dialog');}
$('story-continue').onclick=()=>{s.introduced=true;persist();closeDialog('story-dialog');};
$('rest').onclick=()=>{if(project||busy)return;s.heroes[s.active].vigor=100;notify('You rest. No time passes elsewhere; the others are safe.');persist();refresh();};
$('objective-toggle').onclick=()=>{const open=$('objectives').hidden;$('objectives').hidden=!open;$('objective-toggle').setAttribute('aria-expanded',String(open));};
function objectiveMarkup():string {
 const checklist=[['memory','Read the buried pattern'],['roots','Grow a living conduit'],['mount','Or fit a forged coupling'],['cleanse','Quiet or drive back the wound'],['ignite','Return the light']] as [ProjectId,string][];
 return checklist.map(([id,label])=>`<div class="check ${done(s,id)||(id==='cleanse'&&quiet(s))?'complete':''}">${done(s,id)||(id==='cleanse'&&quiet(s))?'✓':'○'} ${label}</div>`).join('')+'<p class="muted">Living route: seedheart + Hulda.<br>Forged route: coupling + stone cradle.<br>Both need the Artificer’s light.</p>';
}
function refresh():void {
 const h=s.heroes[s.active];
 $('region-name').textContent=PLACES[h.region].name;$('region-subtitle').textContent=PLACES[h.region].subtitle;
 $('watch').textContent=`Watch ${s.watch+1} · ${inhabitants(s,h.region).length} of seven here`;
 $('scene-caption').textContent=done(s,'ignite')?'The line holds. Somewhere beyond the mist, another light answers.':PLACES[region].description;
 $('encounter').hidden=project===null;document.body.classList.toggle('in-encounter',!!project);
 $('tools').hidden=!!project;$('mobility-status').hidden=!!project||modalOpen();$('nearby').hidden=!!project;$('location').hidden=!!project;
 html('roster',IDS.map(id=>{const c=s.heroes[id],def=HEROES[id];return `<button data-hero="${id}" class="hero ${id===s.active?'active':''} ${c.region!==region?'distant':''}" style="--hero:${def.color}" title="${def.name} at ${PLACES[c.region].name}" aria-pressed="${id===s.active}"><span class="hero-symbol">${def.symbol}</span><span class="hero-name">${shortNames[id]??def.name}</span><span class="hero-place">${c.region===region?`${Math.round(c.charge)} ⚡`:"Away"}</span></button>`;}).join(''));
 for(const el of $('roster').querySelectorAll<HTMLButtonElement>('button'))el.disabled=busy;
 html('objective-content',objectiveMarkup());
 if(project){
  const p=PROJECTS[project],canCast=!!p.actors[s.active],reason=blocked(s,project);
  $('encounter-place').textContent=PLACES[region].name;$('encounter-title').textContent=p.name;$('encounter-copy').textContent=p.description+(!canCast?' Gifts needed: '+Object.keys(p.actors).map(id=>HEROES[id as HeroId].name).join(' / ')+'.':'');
  $('progress').style.width=`${s.progress[project]/p.need*100}%`;
  $('progress-label').textContent=`${Math.round(s.progress[project])} / ${p.need} · ${HEROES[s.active].name}: ${Math.round(h.charge)} energy · ${Math.round(h.vigor)} vigor${['cleanse','banish'].includes(project)?` · Lash in ${3-s.threatTurns%3} swaps · ${s.wards} wards`:''}`;
  html('encounter-crew',IDS.filter(id=>near(s,id,project!)).map(id=>`<button style="--hero:${HEROES[id].color}" data-hero="${id}" class="crew ${id===s.active?'chosen':''}">${HEROES[id].name}<strong>${s.heroes[id].charge}</strong></button>`).join(''));
  $('cast').textContent=canCast?`${p.ability[s.active]} · 12`:'Choose a specialist above';
  $<HTMLButtonElement>('cast').disabled=busy||!canCast||h.charge<12||!!reason;
  $('ward').hidden=!['cleanse','banish'].includes(project);
  $<HTMLButtonElement>('ward').disabled=busy||h.charge<9||s.wards>=2;
  for(const id of ['leave','hint','world-button','party-button','journal-button'])$<HTMLButtonElement>(id).disabled=busy;
  $('board').setAttribute('aria-busy',String(busy));
 }
 $('vignette').style.opacity=String(Math.max(0,(60-h.vigor)/80));
 if(!project)updateNearby();
}
function updateNearby():void {
 const h=s.heroes[s.active];const list=PROJECT_IDS.filter(id=>PROJECTS[id].region===region&&!done(s,id));
 list.sort((a,b)=>Math.hypot(h.x-PROJECTS[a].at[0],h.z-PROJECTS[a].at[1])-Math.hypot(h.x-PROJECTS[b].at[0],h.z-PROJECTS[b].at[1]));
 if(!list.includes(nearest!))nearest=list[0]??null;
 const drops=s.drops.filter(d=>d.region===region).map(d=>`<button data-drop="${d.id}" class="pickup">Take ${ITEMS[d.item]} <span>${Math.round(Math.hypot(h.x-d.x,h.z-d.z))} m</span></button>`).join('');
 html('stations',drops+list.map(id=>{const p=PROJECTS[id],distance=Math.hypot(h.x-p.at[0],h.z-p.at[1]),reason=blocked(s,id);return `<button data-project="${id}" class="station ${nearest===id?'aimed':''}"><span>${p.verb}</span><small>${distance>4.2?`Face it · ${Math.round(distance)} m`:reason?'Requirements':'Begin'}</small></button>`;}).join('')+(done(s,'ignite')?'<p>The conduit holds.<br>Explore, gather your companions, or begin another possibility in the Chronicle.</p>':''));
}
$('roster').addEventListener('click',e=>{const el=(e.target as HTMLElement).closest<HTMLElement>('[data-hero]');if(el)switchHero(el.dataset.hero as HeroId);});
$('encounter-crew').addEventListener('click',e=>{const el=(e.target as HTMLElement).closest<HTMLElement>('[data-hero]');if(el)switchHero(el.dataset.hero as HeroId);});
$('stations').addEventListener('click',e=>{
 const el=(e.target as HTMLElement).closest<HTMLElement>('button');if(!el)return;
 if(el.dataset.project)enter(el.dataset.project as ProjectId);
 if(el.dataset.drop){const d=s.drops.find(x=>x.id===el.dataset.drop)!;const error=pickup(s,d.id);if(error){player.yaw=Math.atan2(player.position.x-d.x,player.position.z-d.z);notify(error);}else {notify(`${ITEMS[d.item]} taken. It will travel with ${HEROES[s.active].name}.`);player.moveSlowdown=s.heroes[s.active].items.includes('coupling')?.78:1;}persist();refresh();}
});
let globe:ReturnType<typeof createGlobe>|null=null;
function refreshMap():void {
 html('world-locations',REGIONS.map(r=>`<article><div><span class="kicker">${r===region?'YOUR VIEWPOINT':'DISTANT GROUP'}</span><h3>${PLACES[r].name}</h3><p>${inhabitants(s,r).map(id=>HEROES[id].name).join(' · ')||'No champions here'}</p></div>${inhabitants(s,r).length?`<button data-observe="${inhabitants(s,r)[0]}">Observe</button>`:''}</article>`).join(''));
 html('travelers',inhabitants(s,region).map(id=>`<label class="traveler"><input type="checkbox" value="${id}" ${id===s.active||s.heroes[id].order==='follow'?'checked':''}><span>${HEROES[id].name}</span><small>${s.heroes[id].items.map(i=>ITEMS[i]).join(', ')||'Hands free'}</small></label>`).join(''));
 $('destination').innerHTML=REGIONS.filter(r=>r!==region).map(r=>`<option value="${r}">${PLACES[r].name}</option>`).join('');
}
$('world-button').onclick=()=>{if(busy)return;refreshMap();openDialog('world-dialog');try{globe??=createGlobe($<HTMLCanvasElement>('globe'));globe.resize();}catch{$('globe').hidden=true;}};
$('world-locations').addEventListener('click',e=>{const el=(e.target as HTMLElement).closest<HTMLElement>('[data-observe]');if(el){closeDialog('world-dialog');switchHero(el.dataset.observe as HeroId);}});
$('travel').onclick=()=>{
 syncActor();const ids=Array.from($('travelers').querySelectorAll<HTMLInputElement>('input:checked')).map(x=>x.value as HeroId),to=$<HTMLSelectElement>('destination').value as RegionId;
 const error=travel(s,ids,to);if(error){notify(error);return;}
 project=null;board=null;closeDialog('world-dialog');loadActor();persist();refresh();notify(s.log[s.log.length-1].text,6500);
};
function refreshParty():void {
 html('party-list',IDS.map(id=>{const h=s.heroes[id],local=h.region===region;return `<article class="party-card" style="--hero:${HEROES[id].color}"><div class="party-card-title"><span class="hero-symbol">${HEROES[id].symbol}</span><div><h3>${HEROES[id].name}</h3><span>${PLACES[h.region].name} · ${h.vigor} vigor · ${h.charge} energy</span></div></div><p>${h.items.map(i=>ITEMS[i]).join(' · ')||'Hands free'}${h.task?`<br>Working: ${h.task.kind==='provision'?'journey fruit':'tending a ward'} · ${h.task.remaining} watches left`:''}</p><div class="party-actions"><button data-focus="${id}">${id===s.active?'Your viewpoint':'Take control'}</button>${id!==s.active?`<button data-order="${id}">${h.order==='follow'?'Hold position':'Follow when together'}</button><button data-task="${id}" data-kind="${h.region==='garden'&&done(s,'water')?'provision':'meditate'}">${h.task?'Restart work':h.region==='garden'&&done(s,'water')?'Gather fruit':'Tend a ward'}</button>`:''}${local&&id!==s.active&&s.heroes[s.active].items.length?`<button data-give="${id}">Pass ${ITEMS[s.heroes[s.active].items[0]]}</button>`:''}${id===s.active?'<button data-eat="yes">Eat / use remedy</button>':''}</div></article>`;}).join(''));
}
$('party-button').onclick=()=>{refreshParty();openDialog('party-dialog');};
$('party-list').addEventListener('click',e=>{
 const el=(e.target as HTMLElement).closest<HTMLElement>('button');if(!el)return;
 if(el.dataset.focus){closeDialog('party-dialog');switchHero(el.dataset.focus as HeroId);return;}
 if(el.dataset.order){const h=s.heroes[el.dataset.order as HeroId];h.task=null;h.order=h.order==='follow'?'hold':'follow';}
 if(el.dataset.task){const error=assign(s,el.dataset.task as HeroId,el.dataset.kind as 'provision'|'meditate');if(error)notify(error);}
 if(el.dataset.give){const item=s.heroes[s.active].items[0] as Item;if(!transfer(s,el.dataset.give as HeroId,item))notify('Bring the two champions within reach before passing the object.');}
 if(el.dataset.eat&&!consume(s))notify('No fruit or remedy in your hands. Assign someone at the restored garden to gather fruit.');
 player.moveSlowdown=s.heroes[s.active].items.includes('coupling')?.78:1;persist();refreshParty();refresh();
});
function refreshJournal():void {
 html('journal-content',`<div class="outcome"><span class="kicker">${done(s,'ignite')?'RESTORED':'THE CONNECTION WAITS'}</span><p>${route(s)?`A ${route(s)} crossing ${done(s,'ignite')?'carries':'awaits'} the light.`:'Two possible crossings. One shared future.'}</p>${objectiveMarkup()}</div>`+s.log.slice().reverse().map(l=>`<article class="log-entry"><span class="kicker">WATCH ${l.watch+1}</span><p>${esc(l.text)}</p></article>`).join(''));
 $('save-status').textContent=saving?'Your journey saves in this browser. Export it to move it to another device.':'Browser saving is unavailable. Export your journey to keep it.';
}
$('journal-button').onclick=()=>{refreshJournal();openDialog('journal-dialog');};
$('export').onclick=()=>{persist();const url=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='broken-conduit-journey.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$<HTMLInputElement>('import').onchange=async()=>{
 const file=$<HTMLInputElement>('import').files?.[0];if(!file)return;
 try{if(file.size>2e6)throw new Error();const raw=JSON.parse(await file.text()),restored=restore(raw);if(JSON.stringify(restored)!==JSON.stringify(raw))throw new Error();
  s=restored;project=null;board=null;loadActor();persist();closeDialog('journal-dialog');refresh();notify('Your exported journey is restored.');
 }catch{notify('That file is not a valid Broken Conduit journey. Your current progress is unchanged.');}
 $<HTMLInputElement>('import').value='';
};
let resetUntil=0;
$('reset').onclick=()=>{if(now>resetUntil){resetUntil=now+8000;$('reset').textContent='Erase this journey? Tap again within 8 seconds.';return;}s=fresh();project=null;board=null;loadActor();persist();location.reload();};
const pointer=new T.Group(),marker=new T.Mesh(new T.OctahedronGeometry(.1),new T.MeshBasicMaterial({color:'#f4d792'}));pointer.add(marker);scene.add(pointer);
function resize():void {renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();if($<HTMLDialogElement>('world-dialog').open)globe?.resize();}addEventListener('resize',resize);
addEventListener('pagehide',persist);document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
let previous=0,lastHud=0,lastSave=0;
function frame(time:number):void {
 requestAnimationFrame(frame);const dt=Math.min(.05,(time-previous)/1000||.016);previous=time;if(document.hidden)return;now=time;
 const modal=modalOpen();player.enabled=!project&&!modal;
 if(!project&&!modal){
  player.update(time,world.regions[region].colliders,walkable);player.applyCamera(camera);syncActor();
  // Followers move physically, with bounded collision checks, and retain position.
  let slot=0;for(const id of inhabitants(s,region)){if(id===s.active)continue;const h=s.heroes[id];if(h.order!=='follow'||h.task)continue;
   const angle=slot++*2.4,tx=player.position.x+Math.sin(angle)*1.15,tz=player.position.z+Math.cos(angle)*1.15,dx=tx-h.x,dz=tz-h.z,d=Math.hypot(dx,dz);
   if(d>.15){const step=Math.min(d,dt*2.6),nx=h.x+dx/d*step,nz=h.z+dz/d*step;
    if(walkable(new T.Vector3(nx,0,nz))&&!world.regions[region].colliders.some(c=>'x'in c&&Math.hypot(nx-c.x,nz-c.z)<c.radius+.2)){h.x=nx;h.z=nz;h.yaw=Math.atan2(-dx,-dz);}
   }
  }
 }else if(project){
  const p=PROJECTS[project],target=new T.Vector3(p.at[0]+(innerWidth<700?0:3.6),innerWidth<700?-1.6:.6,p.at[1]);
  const desired=new T.Vector3(p.at[0]+(innerWidth<700?0:2.5),4.8,p.at[1]+8.5);camera.position.lerp(desired,Math.min(1,dt*5));camera.lookAt(target);
 }
 world.update(s,time*.001,project);
 pointer.visible=!project&&!modal&&nearest!==null&&!done(s,'ignite');
 if(pointer.visible&&nearest){const at=PROJECTS[nearest].at;pointer.position.set(at[0],2.2+Math.sin(time*.003)*.15,at[1]);marker.rotation.y=time*.001;}
 if(now>noticeUntil)$('notice').textContent='';
 if(!modal&&now-lastHud>350){lastHud=now;if(!project)updateNearby();}
 if(!busy&&!modal&&now-lastSave>3000){persist();lastSave=now;}
 renderer.render(scene,camera);
 if($<HTMLDialogElement>('world-dialog').open)globe?.draw(s);
}
refresh();world.update(s,0,null);requestAnimationFrame(frame);
if(!s.introduced){$('story-copy').innerHTML='<p>Seven champions have awakened. Their homes are far apart, but the ancient conduits make distance a smaller thing.</p><p>Now one connection is failing. Greencrown thirsts. Anviltooth guards its metal. Something stirs inside the Meridian.</p><p><strong>Start with the thirsty roots beside Hulda.</strong> Restore the spring, then decide: a living crossing, or a forged one?</p><p class="muted">Drag to look. Use MOVE to walk. Tap a nearby worksite. Match gems, then release a champion’s gift. The other six are already waiting for you.</p>';openDialog('story-dialog');}
else if(done(s,'ignite')&&!s.endingSeen)showEnding();
