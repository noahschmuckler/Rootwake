export type SiteId = 'home'|'spring'|'village'|'grove'|'pass'|'daughter';
export const SITES = {
 home:{name:'The Listening Tree',x:0,z:0,kind:'An old friend',description:'Your true body rests here while you listen beneath the earth.'},
 spring:{name:'The Knotted Spring',x:-21,z:-15,kind:'A root in distress',description:'Roots press against a buried spring. You can feel where they are thirsty.'},
 village:{name:'The Quiet Clearing',x:28,z:-24,kind:'A silence in the forest',description:'Roots stop at a ring of foundations. Someone has cut the young trees for fuel.'},
 grove:{name:'The Moonseed Grove',x:-43,z:-47,kind:'A memory of another body',description:'A white grove is choking on bitter growth. A voice cannot untangle it. It needs hands.'},
 pass:{name:'The Stoneward Pass',x:52,z:-66,kind:'A road waiting to happen',description:'The village needs a safe way to the next karst. Your Mason can teach them to build it.'},
 daughter:{name:'The Far Silence',x:0,z:0,kind:'Beyond your reach',description:'On the other side of the world, the roots remember your daughter. Her answer has not yet been written.'},
} as const;
export const LEVELS=[
 {name:'Listen',range:32,cost:36,ability:'Sense a nearby root network.'},
 {name:'Speak',range:51,cost:30,ability:'Speak through the living trees.'},
 {name:'Embody',range:80,cost:24,ability:'Borrow a dryad body for 90 seconds.'},
 {name:'Cross',range:110,cost:18,ability:'Move your true body through a known tree.'},
] as const;
export interface Journey {version:1;energy:number;solved:SiteId[];body:SiteId;discovered:SiteId[];dryad:SiteId|null;dryadLeft:number;council:boolean;seed:number;moves:[number,number][];}
export function fresh():Journey{return{version:1,energy:0,solved:[],body:'home',discovered:['home'],dryad:null,dryadLeft:0,council:false,seed:9182026,moves:[]};}
export function level(s:Journey):number{return s.solved.includes('grove')?3:s.solved.includes('village')?2:s.solved.includes('spring')?1:0;}
export function distance(a:SiteId,b:SiteId):number {if(a==='daughter'||b==='daughter')return 565;return Math.hypot(SITES[a].x-SITES[b].x,SITES[a].z-SITES[b].z);}
export function reachable(s:Journey,id:SiteId):boolean{return distance(s.body,id)<=LEVELS[level(s)].range;}
export function cost(s:Journey,action:'listen'|'speak'|'dryad'|'cross'|'council',id:SiteId='home'):number {const d=distance(s.body,id);return action==='listen'?LEVELS[level(s)].cost:action==='speak'?12:action==='dryad'?36:action==='cross'?Math.ceil(45+d*.35):Math.ceil(85+d*.35);}
export function pay(s:Journey,n:number):string|null {if(s.energy<n)return `Gather ${n-s.energy} more energy at a living tree.`;s.energy-=n;return null;}
export function enter(s:Journey):string|null {if(s.dryad)return 'Return from your borrowed body first.';return pay(s,cost(s,'listen'));}
export function discover(s:Journey,id:SiteId):void {if(reachable(s,id)&&!s.discovered.includes(id))s.discovered.push(id);}
export function act(s:Journey,id:SiteId,action:'mend'|'speak'|'dryad'|'cleanse'|'cross'|'council'):string|null {
 const l=level(s);
 if(!s.discovered.includes(id))return 'Listen closely to discover this place first.';
 if(action!=='cleanse'&&!reachable(s,id))return 'That place lies beyond your living reach.';
 if(action==='mend') {if(id!=='spring'||s.solved.includes(id))return 'The spring is already flowing.';const e=pay(s,18);if(e)return e;s.solved.push(id);return null;}
 if(action==='speak'){if(l<1||id!=='village'||s.solved.includes(id))return 'First learn to speak through the roots.';const e=pay(s,cost(s,'speak'));if(e)return e;s.solved.push(id);return null;}
 if(action==='dryad'){if(l<2||id==='daughter')return 'Restore trust at the clearing to learn embodiment.';const e=pay(s,cost(s,'dryad'));if(e)return e;s.dryad=id;s.dryadLeft=90;return null;}
 if(action==='cleanse'){if(id!=='grove'||s.dryad!=='grove'||s.dryadLeft<=0||s.solved.includes(id))return 'A living dryad must stand in the grove.';s.solved.push(id);return null;}
 if(action==='cross'){if(l<3||s.dryad)return 'Restore the grove and return to your true body first.';const e=pay(s,cost(s,'cross',id));if(e)return e;s.body=id;return null;}
 if(action==='council'){if(l<3||id!=='pass'||s.council||s.dryad)return 'The road needs your true body’s invitation.';const e=pay(s,cost(s,'council',id));if(e)return e;s.council=true;s.solved.push('pass');return null;}
 return 'Unknown action.';
}
export function tick(s:Journey,dt:number):boolean {if(!s.dryad)return false;s.dryadLeft=Math.max(0,s.dryadLeft-Math.max(0,dt));if(s.dryadLeft===0){s.dryad=null;return true;}return false;}
export function restore(raw:unknown):Journey {const s=raw as Journey;const valid=(x:unknown):x is SiteId=>typeof x==='string'&&x in SITES&&x!=='daughter';if(!s||s.version!==1||!Number.isFinite(s.energy)||s.energy<0||s.energy>240||!valid(s.body)||!Array.isArray(s.solved)||s.solved.some(x=>!valid(x))||!Array.isArray(s.discovered)||s.discovered.some(x=>!valid(x))||!Array.isArray(s.moves)||s.moves.length>10000||s.moves.some(m=>!Array.isArray(m)||m.length!==2||m.some(n=>!Number.isInteger(n)||n<0||n>=36))||s.seed!==9182026||typeof s.council!=='boolean')return fresh();if(s.solved.includes('village')&&!s.solved.includes('spring')||s.solved.includes('grove')&&!s.solved.includes('village')||s.council&&!s.solved.includes('grove'))return fresh();return{...s,dryad:null,dryadLeft:0};}
