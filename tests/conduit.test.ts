import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { Board } from '../src/match3';
import { fresh, restore, IDS, PROJECTS, PROJECT_IDS, done, near, blocked, cast, charge, protect, focus, travel, assign, advance, pickup, transfer, consume, ending, type Campaign, type HeroId, type ProjectId } from '../src/conduit/state';
import { buildCampaignWorld } from '../src/conduit/world';
function stand(s:Campaign,hero:HeroId,id:ProjectId):void {const h=s.heroes[hero],p=PROJECTS[id];h.region=p.region;h.x=p.at[0];h.z=p.at[1]+1;s.active=hero;}
function finish(s:Campaign,hero:HeroId,id:ProjectId):void {
 stand(s,hero,id);let attempts=0;
 while(!done(s,id)){assert.equal(blocked(s,id),null);charge(s,id,6);if(['cleanse','banish'].includes(id)&&s.threatTurns%3===2)protect(s,id);if(s.heroes[hero].charge>=12)assert.equal(cast(s,id),null);assert.ok(++attempts<80);}
}
test('living route is complete using real rules and a physically carried seedheart',()=>{
 const s=fresh();finish(s,'hulda','water');assert.equal(s.drops.length,1);
 const drop=s.drops.find(d=>d.id==='seedheart')!;s.heroes.hulda.x=drop.x;s.heroes.hulda.z=drop.z;assert.equal(pickup(s,'seedheart'),null);
 finish(s,'steward','accord');finish(s,'sage','memory');
 s.active='hulda';assert.equal(travel(s,['hulda'],'relay'),null);finish(s,'hulda','roots');
 assert.equal(s.heroes.hulda.items.includes('seedheart'),false);
 finish(s,'alchemist','cleanse');finish(s,'artificer','ignite');
 assert.ok(done(s,'ignite'));assert.ok(!done(s,'brace'));assert.ok(!done(s,'mount'));assert.match(ending(s),/local hands/);assert.match(ending(s),/survives as a keeper/);
 assert.deepEqual(restore(JSON.parse(JSON.stringify(s))),s);
});
test('forged route works without gardening or a covenant, and remembers a violent resolution',()=>{
 const s=fresh();finish(s,'smith','salvage');finish(s,'smith','forge');
 const d=s.drops.find(d=>d.id==='coupling')!;s.heroes.smith.x=d.x;s.heroes.smith.z=d.z;assert.equal(pickup(s,'coupling'),null);
 assert.equal(travel(s,['smith','mason'],'relay'),null);finish(s,'sage','memory');finish(s,'mason','brace');
 stand(s,'smith','mount');finish(s,'mason','mount');assert.equal(s.heroes.smith.items.includes('coupling'),false);
 finish(s,'smith','banish');finish(s,'artificer','ignite');assert.ok(done(s,'ignite'));assert.ok(!done(s,'roots'));assert.ok(!done(s,'water'));assert.match(ending(s),/scar/);assert.match(ending(s),/no covenant/);
});
test('attention never transports people, moves items, or advances strategic time',()=>{
 const s=fresh();s.heroes.smith.items=['coupling'];const before=structuredClone(s.heroes.smith);
 for(let i=0;i<20;i++){focus(s,'hulda');focus(s,'sage');}
 assert.equal(s.watch,0);assert.deepEqual(s.heroes.smith,before);
 s.active='hulda';assert.equal(travel(s,['smith'],'relay'),'Travelers must start in the same place.');assert.deepEqual(s.heroes.smith,before);
 assert.equal(travel(s,['hulda'],'relay'),null);assert.equal(s.heroes.steward.region,'garden');assert.equal(s.heroes.smith.region,'forge');
});
test('materials cannot be installed from a distant region or a distant carrier',()=>{
 const s=fresh();s.progress.memory=48;s.progress.brace=72;s.heroes.smith.items=['coupling'];stand(s,'mason','mount');
 assert.match(blocked(s,'mount')!,/carrier/);assert.ok(cast(s,'mount'));
 s.heroes.smith.region='relay';s.heroes.smith.x=11;s.heroes.smith.z=10;assert.match(blocked(s,'mount')!,/carrier/);
 stand(s,'smith','mount');stand(s,'mason','mount');assert.equal(blocked(s,'mount'),null);
 s.heroes.mason.charge=60;for(let i=0;i<3;i++)assert.equal(cast(s,'mount'),null);
 assert.equal(s.heroes.smith.items.length,0);assert.ok(cast(s,'mount'));assert.equal(s.drops.length,0);
});
test('a single swap is one threat beat even for a large cascade; ward absorbs one attack',()=>{
 const s=fresh();s.progress.memory=48;stand(s,'alchemist','cleanse');
 charge(s,'cleanse',50);assert.equal(s.threatTurns,1);assert.equal(protect(s,'cleanse'),true);
 charge(s,'cleanse',50);const vigor=s.heroes.alchemist.vigor;charge(s,'cleanse',50);assert.equal(s.heroes.alchemist.vigor,vigor-2);assert.equal(s.wards,0);
 for(let i=0;i<150;i++)charge(s,'cleanse',3);assert.equal(s.heroes.alchemist.vigor,20);
 const remote=s.heroes.smith.charge;charge(s,'cleanse',18);assert.equal(s.heroes.smith.charge,remote);
});
test('delegated jobs only finish on committed watches and travel cancels the departing worker',()=>{
 const s=fresh();s.progress.water=72;assert.equal(assign(s,'steward','provision'),null);
 focus(s,'sage');assert.equal(s.heroes.steward.task?.remaining,2);advance(s);assert.equal(s.heroes.steward.items.length,0);advance(s);assert.deepEqual(s.heroes.steward.items,['ration']);assert.equal(s.heroes.steward.task,null);
 s.active='hulda';assign(s,'steward','provision');travel(s,['hulda','steward'],'forge');assert.equal(s.heroes.steward.task,null);
});
test('inventory exchange needs proximity and consumption cannot create food',()=>{
 const s=fresh();s.heroes.hulda.items=['remedy'];s.heroes.hulda.vigor=30;
 assert.equal(transfer(s,'smith','remedy'),false);assert.equal(transfer(s,'steward','remedy'),true);assert.equal(consume(s),false);
 focus(s,'steward');s.heroes.steward.vigor=30;assert.equal(consume(s),true);assert.equal(s.heroes.steward.vigor,80);assert.equal(consume(s),false);
});
test('saved boards replay deterministically, preserving the next random refill',()=>{
 const b=new Board(6,6,815),moves:[number,number][]=[];
 for(let turn=0;turn<30;turn++){
  let found=false;for(let a=0;a<36&&!found;a++)for(const c of [a+1,a+6]){
   if(c>=36||Math.abs(Math.floor(a/6)-Math.floor(c/6))+Math.abs(a%6-c%6)!==1)continue;
   if(b.swap({row:Math.floor(a/6),col:a%6},{row:Math.floor(c/6),col:c%6}).valid){moves.push([a,c]);found=true;break;}
  }assert.ok(found);
 }
 const replay=new Board(6,6,815);for(const [a,c]of moves)assert.ok(replay.swap({row:Math.floor(a/6),col:a%6},{row:Math.floor(c/6),col:c%6}).valid);assert.deepEqual(b.grid,replay.grid);
});
test('save validation rejects broken actors, coordinates, boards, and tasks as a whole',()=>{
 for(const mutate of [(s:any)=>s.heroes.hulda.x=Infinity,(s:any)=>s.heroes.smith.region='void',(s:any)=>s.boards.water={seed:1,moves:[[0,77]]},(s:any)=>s.heroes.sage.task={kind:'exploit',remaining:1},(s:any)=>delete s.heroes.artificer]){
  const s=fresh();mutate(s);assert.deepEqual(restore(s),fresh());
 }assert.deepEqual(restore(null),fresh());assert.deepEqual(restore({version:99}),fresh());
});
test('all three spaces have reachable work sites, all seven avatars, and visible state changes',()=>{
 const scene=new T.Scene(),view=buildCampaignWorld(scene),s=fresh();
 for(const id of IDS)assert.ok(view.actors[id]);
 for(const id of PROJECT_IDS){const p=PROJECTS[id];assert.ok(view.regions[p.region].stations[id]);assert.ok(Math.abs(p.at[0])<11.8&&p.at[1]>-12.3&&p.at[1]<11.7);}
 s.progress.water=72;s.progress.roots=96;s.progress.cleanse=96;s.progress.ignite=96;view.setRegion('relay');view.update(s,1,null);
 assert.equal(view.regions.garden.water.visible,true);assert.equal(view.regions.relay.bridge.visible,true);assert.equal(view.regions.relay.scar.visible,false);assert.equal(view.regions.relay.beam.visible,true);
 assert.equal(view.regions.garden.group.visible,false);assert.equal(view.regions.relay.group.visible,true);
 // Everyone begins close enough to walk to a worksite; no forced travel needed.
 for(const id of IDS)assert.ok(PROJECT_IDS.some(p=>PROJECTS[p].region===s.heroes[id].region&&Math.hypot(s.heroes[id].x-PROJECTS[p].at[0],s.heroes[id].z-PROJECTS[p].at[1])<10));
});
