/** The Broken Conduit: deterministic campaign rules, independent of rendering.
 * Region/character ownership is explicit. Attention changes never advance time.
 * Every irreversible command is checked here, including presence and materials. */
export const IDS = ['hulda','smith','mason','alchemist','steward','sage','artificer'] as const;
export type HeroId = typeof IDS[number];
export const REGIONS = ['garden','forge','relay'] as const;
export type RegionId = typeof REGIONS[number];
export const HEROES: Record<HeroId,{name:string;title:string;color:string;symbol:string;gift:string}> = {
  hulda:{name:'Hulda',title:'Cultivator',color:'#a9d97f',symbol:'❧',gift:'Ask living things to grow.'},
  smith:{name:'Smith',title:'Keeper of the forge',color:'#ffac70',symbol:'⚒',gift:'Heat metal into a remembered form.'},
  mason:{name:'Mason',title:'Shaper of stone',color:'#b6c9d3',symbol:'▰',gift:'Give weight a place to rest.'},
  alchemist:{name:'Alchemist',title:'Keeper of change',color:'#dba7ff',symbol:'◈',gift:'Separate poison from possibility.'},
  steward:{name:'Steward',title:'Voice of the people',color:'#f3d27e',symbol:'✦',gift:'Make a promise that outlasts you.'},
  sage:{name:'Sage',title:'Listener in the deep',color:'#9acdf2',symbol:'☽',gift:'Remember what the stone has forgotten.'},
  artificer:{name:'Artificer',title:'Weaver of light',color:'#79e4e6',symbol:'ϟ',gift:'Give scattered power a direction.'},
};
export const PLACES:Record<RegionId,{name:string;subtitle:string;description:string}> = {
  garden:{name:'Greencrown',subtitle:'THE LIVING TERRACES',description:'The water has stopped. Roots grip the empty channels as if remembering a river.'},
  forge:{name:'Anviltooth',subtitle:'THE FORGE SETTLEMENT',description:'Across the world, the furnaces still burn. Their keepers will trade with those who have earned their trust.'},
  relay:{name:'The Meridian',subtitle:'A WOUND BETWEEN KARSTS',description:'Deep below the mist, something breathes through the break in the conduit.'},
};
export type Item = 'seedheart'|'coupling'|'remedy'|'ration';
export const ITEMS:Record<Item,string> = {seedheart:'Living seedheart',coupling:'Forged coupling',remedy:'Silverleaf remedy',ration:'Journey fruit'};
export interface Hero {region:RegionId;x:number;z:number;yaw:number;vigor:number;charge:number;items:Item[];order:'follow'|'hold';task:null|{kind:'provision'|'meditate';remaining:number};}
export const PROJECT_IDS = ['water','accord','distill','salvage','forge','memory','brace','roots','mount','cleanse','banish','ignite'] as const;
export type ProjectId = typeof PROJECT_IDS[number];
export interface Project {region:RegionId;at:[number,number];name:string;verb:string;description:string;need:number;actors:Partial<Record<HeroId,number>>;ability:Partial<Record<HeroId,string>>;}
export const PROJECTS:Record<ProjectId,Project> = {
 water:{region:'garden',at:[-3,-2],name:'The thirsty roots',verb:'Wake the waterworks',description:'Water is trapped in the stone. Coax the old roots into opening its path.',need:72,actors:{hulda:24,alchemist:12},ability:{hulda:'Call the spring',alchemist:'Loosen the limestone'}},
 accord:{region:'garden',at:[3,-3],name:'The people’s table',verb:'Make a covenant',description:'Anviltooth needs food; Greencrown needs metal. Offer mutual aid, with local keepers entrusted to maintain the restored line.',need:48,actors:{steward:24},ability:{steward:'Bind a promise'}},
 distill:{region:'garden',at:[-5,3],name:'The silverleaf beds',verb:'Distill a remedy',description:'Living medicine for the road. A remedy restores its carrier’s vigor; the beds can be harvested again.',need:48,actors:{alchemist:24,hulda:12},ability:{alchemist:'Separate the poison',hulda:'Awaken silverleaf'}},
 salvage:{region:'forge',at:[-4,0],name:'The slag fall',verb:'Recover abandoned metal',description:'Without a covenant, reclaim enough metal from the abandoned slag. No one must be robbed.',need:72,actors:{smith:24,mason:18},ability:{smith:'Draw out the ore',mason:'Split the slag'}},
 forge:{region:'forge',at:[2,-3],name:'The answering forge',verb:'Forge a coupling',description:'Shape a physical replacement for the broken conduit. Someone must carry it to the Meridian.',need:72,actors:{smith:24},ability:{smith:'Remember the metal'}},
 memory:{region:'relay',at:[-4,0],name:'The memory prism',verb:'Read the buried pattern',description:'The fracture is visible. Its cause is not. Listen for the geometry beneath the damage.',need:48,actors:{sage:24,artificer:12},ability:{sage:'Hear the stone',artificer:'Trace the echoes'}},
 brace:{region:'relay',at:[4,0],name:'The broken supports',verb:'Raise a stone cradle',description:'A metal conduit needs a foundation. Living roots can instead support themselves.',need:72,actors:{mason:24,smith:12},ability:{mason:'Set the keystone',smith:'Weld the anchors'}},
 roots:{region:'relay',at:[0,-5],name:'The living crossing',verb:'Grow a living conduit',description:'Bring Greencrown’s seedheart. Living roots will span the break and make their own foundation.',need:96,actors:{hulda:24},ability:{hulda:'Weave the living bridge'}},
 mount:{region:'relay',at:[0,-5],name:'The forged crossing',verb:'Fit the new conduit',description:'Seat a forged coupling in a sound stone cradle. Its carrier must be here beside you.',need:72,actors:{mason:24,smith:24},ability:{mason:'Fit the stone and metal',smith:'Join the severed line'}},
 cleanse:{region:'relay',at:[0,-9],name:'The thing in the breach',verb:'Quiet the wound',description:'Separate the suffering from the creature it became. A patient restoration preserves the memories held within it.',need:96,actors:{alchemist:24,sage:18},ability:{alchemist:'Transmute the corruption',sage:'Remember its name'}},
 banish:{region:'relay',at:[0,-9],name:'The thing in the breach',verb:'Drive back the incursion',description:'Break its grip by force. This clears the line, but leaves a scar where its memories were.',need:120,actors:{smith:24,mason:18,hulda:18,artificer:24},ability:{smith:'Release the furnace',mason:'Raise a stone fist',hulda:'Bind and uproot',artificer:'Arc discharge'}},
 ignite:{region:'relay',at:[0,-5],name:'The white conduit',verb:'Return the light',description:'The crossing is restored and the wound is quiet. Guide the energy home.',need:96,actors:{artificer:24,sage:12},ability:{artificer:'Weave the current',sage:'Hold the pattern'}},
};
export interface BoardSave {seed:number;moves:[number,number][];}
export interface Campaign {
 version:1;active:HeroId;watch:number;heroes:Record<HeroId,Hero>;
 progress:Record<ProjectId,number>;boards:Partial<Record<ProjectId,BoardSave>>;
 drops: {id:string;item:Item;region:RegionId;x:number;z:number}[];
 threatTurns:number;wards:number;log:{watch:number;text:string}[];introduced:boolean;endingSeen:boolean;
}
export function fresh():Campaign {
 const regions:RegionId[]=['garden','forge','forge','garden','garden','relay','relay'];
 const heroes={} as Record<HeroId,Hero>;
 IDS.forEach((id,i)=>heroes[id]={region:regions[i],x:(i%3-1)*.8,z:4+i%2,yaw:0,vigor:100,charge:12,items:[],order:'follow',task:null});
 return {version:1,active:'hulda',watch:0,heroes,progress:Object.fromEntries(PROJECT_IDS.map(id=>[id,0])) as Record<ProjectId,number>,boards:{},drops:[],threatTurns:0,wards:0,log:[{watch:0,text:'Seven have awakened. The conduit between their homes is failing.'}],introduced:false,endingSeen:false};
}
export function done(s:Campaign,id:ProjectId):boolean{return s.progress[id]>=PROJECTS[id].need;}
export function addLog(s:Campaign,text:string):void {s.log.push({watch:s.watch,text});s.log=s.log.slice(-60);}
export function inhabitants(s:Campaign,region:RegionId):HeroId[]{return IDS.filter(id=>s.heroes[id].region===region);}
export function near(s:Campaign,hero:HeroId,id:ProjectId):boolean {const h=s.heroes[hero],p=PROJECTS[id];return h.region===p.region&&Math.hypot(h.x-p.at[0],h.z-p.at[1])<=4.2;}
export function quiet(s:Campaign):boolean{return done(s,'cleanse')||done(s,'banish');}
export function route(s:Campaign):'living'|'forged'|null {return done(s,'roots')?'living':done(s,'mount')?'forged':null;}
export function hasItem(s:Campaign,item:Item,project:ProjectId):boolean {return IDS.some(id=>near(s,id,project)&&s.heroes[id].items.includes(item));}
export function blocked(s:Campaign,id:ProjectId):string|null {
 if(done(s,id))return 'This work is complete.';
 if(done(s,'ignite'))return 'The conduit is restored.';
 switch(id){
 case 'accord':return done(s,'water')?null:'Restore Greencrown’s water before promising a harvest.';
 case 'forge':return done(s,'accord')||done(s,'salvage')?null:'Make a covenant at Greencrown, or recover the abandoned metal here.';
 case 'roots':return done(s,'mount')?'The forged crossing is already in place.':!done(s,'memory')?'Read the buried pattern first.':!hasItem(s,'seedheart',id)?'Bring the living seedheart from Greencrown. Its carrier must stand nearby.':null;
 case 'mount':return done(s,'roots')?'The living crossing is already in place.':!done(s,'memory')?'Read the buried pattern first.':!done(s,'brace')?'Raise a stone cradle first.':!hasItem(s,'coupling',id)?'Bring the forged coupling from Anviltooth. Its carrier must stand nearby.':null;
 case 'cleanse':case 'banish':return quiet(s)?'The wound is already quiet.':!done(s,'memory')?'Read the buried pattern first.':null;
 case 'ignite':return !route(s)?'Grow a living conduit, or fit a forged coupling in its stone cradle.':!quiet(s)?'Quiet the wound or drive back the incursion first.':null;
 default:return null;
 }
}
export function advance(s:Campaign):void {
 s.watch++;
 for(const id of IDS){const h=s.heroes[id];if(!h.task)continue;
  if(--h.task.remaining<=0){const kind=h.task.kind;h.task=null;
   if(kind==='provision')h.items.push('ration');else {h.charge=Math.min(60,h.charge+24);h.vigor=Math.min(100,h.vigor+24);}
   addLog(s,`${HEROES[id].name} ${kind==='provision'?'has gathered journey fruit.':'has finished tending the ward and recovered strength.'}`);
  }
 }
}
export function focus(s:Campaign,id:HeroId):void{s.active=id;s.heroes[id].task=null;}
export function travel(s:Campaign,ids:HeroId[],destination:RegionId):string|null {
 const from=s.heroes[s.active].region,unique=[...new Set(ids)];
 if(!unique.length)return 'Select at least one traveler.';
 if(destination===from)return 'You are already here.';
 if(unique.some(id=>s.heroes[id].region!==from))return 'Travelers must start in the same place.';
 unique.forEach((id,i)=>{const h=s.heroes[id];h.region=destination;h.x=(i%3-1)*.8;h.z=4+Math.floor(i/3);h.yaw=0;h.task=null;h.order='follow';});
 s.active=unique.includes(s.active)?s.active:unique[0];advance(s);
 addLog(s,`${unique.map(id=>HEROES[id].name).join(', ')} traveled to ${PLACES[destination].name}.`);return null;
}
export function assign(s:Campaign,id:HeroId,kind:'provision'|'meditate'):string|null {
 const h=s.heroes[id];if(id===s.active)return 'Switch to another champion before assigning work.';
 if(kind==='provision'&&(h.region!=='garden'||!done(s,'water')))return 'Provisioning needs the restored waterworks at Greencrown.';
 h.task={kind,remaining:2};h.order='hold';addLog(s,`${HEROES[id].name} will ${kind==='provision'?'gather fruit':'tend a ward'} while the others travel or complete work.`);return null;
}
/** One whole legal swap is one threat beat; cascades never multiply attacks. */
export function charge(s:Campaign,project:ProjectId,cleared:number):string {
 if(blocked(s,project))return '';
 if(!near(s,s.active,project))return '';
 for(const id of IDS)if(near(s,id,project)){
  const h=s.heroes[id];h.charge=Math.min(60,h.charge+Math.min(18,cleared*(id===s.active?3:1)));
 }
 const active=s.heroes[s.active];active.vigor=Math.max(20,active.vigor-2);
 if((project==='cleanse'||project==='banish')&&!quiet(s)){
  s.threatTurns++;
  if(s.threatTurns%3===0){
   if(s.wards>0){s.wards--;return 'The ward takes the lash. Everyone holds their ground.';}
   for(const id of IDS)if(near(s,id,project))s.heroes[id].vigor=Math.max(20,s.heroes[id].vigor-14);
   s.progress[project]=Math.max(0,s.progress[project]-6);return 'The breach lashes out: −14 vigor, −6 progress. A ward can absorb its next attack.';
  }
 }
 return `${cleared} gems answered. Nearby champions share the released energy.`;
}
export function protect(s:Campaign,id:ProjectId):boolean {const h=s.heroes[s.active];if(!near(s,s.active,id)||h.charge<9||s.wards>=2)return false;h.charge-=9;s.wards++;return true;}
export function cast(s:Campaign,id:ProjectId):string|null {
 const reason=blocked(s,id);if(reason)return reason;
 const h=s.heroes[s.active],p=PROJECTS[id],power=p.actors[s.active];
 if(!near(s,s.active,id))return 'Move closer to the work.';
 if(!power)return `${HEROES[s.active].name} cannot shape this work. Bring ${Object.keys(p.actors).map(x=>HEROES[x as HeroId].name).join(' or ')}.`;
 if(h.charge<12)return 'Match gems to gather 12 energy.';
 h.charge-=12;s.progress[id]+=Math.round(power*(h.vigor<40?.75:1));
 if(!done(s,id))return null;
 s.progress[id]=p.need;
 if(id==='roots'||id==='mount'){
  const item:Item=id==='roots'?'seedheart':'coupling';const carrier=IDS.find(who=>near(s,who,id)&&s.heroes[who].items.includes(item))!;
  s.heroes[carrier].items.splice(s.heroes[carrier].items.indexOf(item),1);
 }
 if(id==='water')s.drops.push({id:'seedheart',item:'seedheart',region:'garden',x:-2,z:0});
 if(id==='forge')s.drops.push({id:'coupling',item:'coupling',region:'forge',x:2,z:-1});
 if(id==='distill')s.drops.push({id:'remedy',item:'remedy',region:'garden',x:-4,z:3});
 advance(s);
 const messages:Record<ProjectId,string>={
 water:'Water runs through Greencrown again. A living seedheart waits beside the roots: take it to the Meridian.',
 accord:'The settlements promise food for metal, and keepers for the restored line. Anviltooth releases its finest stock.',
 distill:'Silverleaf has become medicine. A remedy waits beside the beds.',
 salvage:'The slag gives up its metal. The forge can now make a coupling without a trade covenant.',
 forge:'A coupling cools beside the forge. It must be carried to the Meridian.',
 memory:'The Sage’s pattern reveals two crossings: one living, one forged. Both can carry the light.',
 brace:'A stone cradle holds the broken span. It is ready for a forged coupling.',
 roots:'Roots cross the abyss and anchor themselves. The first living conductor remembers the spring.',
 mount:'The coupling settles into its cradle. The mountain holds its breath.',
 cleanse:'The creature remembers its own name. The wound closes without erasing what lived within it.',
 banish:'The incursion is driven back. A dark scar remains where its memories were.',
 ignite:'White light runs between the karsts. Two distant settlements become neighbors again.',
 };
 addLog(s,messages[id]);return null;
}
export function pickup(s:Campaign,dropId:string):string|null {
 const i=s.drops.findIndex(d=>d.id===dropId);if(i<0)return 'That object has already been taken.';
 const d=s.drops[i],h=s.heroes[s.active];
 if(d.region!==h.region||Math.hypot(d.x-h.x,d.z-h.z)>3.5)return 'Walk within reach to take it.';
 if(d.item==='coupling'&&h.items.includes('coupling'))return 'Your hands are already full.';
 h.items.push(d.item);s.drops.splice(i,1);addLog(s,`${HEROES[s.active].name} is carrying ${ITEMS[d.item].toLowerCase()}.`);return null;
}
export function transfer(s:Campaign,to:HeroId,item:Item):boolean {
 const a=s.heroes[s.active],b=s.heroes[to],i=a.items.indexOf(item);
 if(i<0||to===s.active||a.region!==b.region||Math.hypot(a.x-b.x,a.z-b.z)>4.2)return false;
 a.items.splice(i,1);b.items.push(item);return true;
}
export function consume(s:Campaign):boolean {const h=s.heroes[s.active];let i=h.items.indexOf('remedy');if(i<0)i=h.items.indexOf('ration');if(i<0)return false;h.vigor=Math.min(100,h.vigor+(h.items[i]==='remedy'?50:30));h.items.splice(i,1);return true;}
export function ending(s:Campaign):string {
 const bridge=route(s)==='living'?'A living bridge carries the current. Greencrown’s roots now have a purpose far beyond their first garden.':'Stone and metal carry the current. The armor-maker’s knowledge has become a road for other people.';
 const wound=done(s,'cleanse')?'The being in the breach survives as a keeper of the line.':'The incursion is gone, but the wound retains a scar. The keepers will remember the force that saved them.';
 const people=done(s,'accord')?'The covenant places its care in local hands. The seven can leave without becoming its permanent rulers.':'The line works, but no covenant binds its communities. Their next challenge is learning to maintain it together.';
 return `${bridge}\n\n${wound}\n\n${people}\n\nFar away, the Keystone remains dark. For the first time, it looks a little less inevitable.`;
}
function finite(x:unknown):x is number{return typeof x==='number'&&Number.isFinite(x);}
/** Invalid saves fail closed as a complete unit: never leave a half-restored party. */
export function restore(raw:unknown):Campaign {
 const f=fresh();try {
  const s=raw as Campaign;if(!s||s.version!==1||!IDS.includes(s.active)||!Number.isInteger(s.watch)||s.watch<0||s.watch>1e6)return f;
  for(const id of IDS){const h=s.heroes[id];if(!h||!REGIONS.includes(h.region)||![h.x,h.z,h.yaw,h.vigor,h.charge].every(finite)||Math.abs(h.x)>20||Math.abs(h.z)>20||h.vigor<20||h.vigor>100||h.charge<0||h.charge>60||!Array.isArray(h.items)||h.items.length>100||h.items.some(i=>!(i in ITEMS))||!['follow','hold'].includes(h.order))return f;
   if(h.task&&(!['provision','meditate'].includes(h.task.kind)||!Number.isInteger(h.task.remaining)||h.task.remaining<1||h.task.remaining>2))return f;
  }
  for(const id of PROJECT_IDS){if(!finite(s.progress[id])||s.progress[id]<0||s.progress[id]>PROJECTS[id].need)return f;const b=s.boards[id];if(b&&(!Number.isInteger(b.seed)||!Array.isArray(b.moves)||b.moves.length>10000||b.moves.some(m=>!Array.isArray(m)||m.length!==2||m.some(n=>!Number.isInteger(n)||n<0||n>=36))))return f;}
  if(!Array.isArray(s.drops)||s.drops.length>20||s.drops.some(d=>!['seedheart','coupling','remedy'].includes(d.id)||!(d.item in ITEMS)||!REGIONS.includes(d.region)||!finite(d.x)||!finite(d.z)))return f;
  if(!Array.isArray(s.log)||s.log.length>60||s.log.some(l=>typeof l.text!=='string'||!finite(l.watch))||!Number.isInteger(s.threatTurns)||s.threatTurns<0||!Number.isInteger(s.wards)||s.wards<0||s.wards>2)return f;
  return structuredClone(s);
 }catch{return f;}
}
