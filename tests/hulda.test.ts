import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Board } from '../src/match3';
import { FORMS, freshState, channelRun, cast, completed, restore, remembered } from '../src/hulda/state';
function match(board:Board){
  for(let row=0;row<6;row++)for(let col=0;col<6;col++)for(const [dr,dc] of [[0,1],[1,0]]){
    if(row+dr>=6||col+dc>=6)continue;
    const result=board.swap({row,col},{row:row+dr,col:col+dc});if(result.valid)return result;
  }
  throw Error('No legal move');
}
test('a real match-3 playthrough unlocks all six forms without food or shelter deadlock',()=>{
  const s=freshState();let swaps=0;
  FORMS.forEach((_,i)=>{const b=new Board(6,6,719+i*971);while(!completed(s,i)){
    const result=match(b);swaps++;assert.ok(swaps<250);
    for(const step of result.steps)for(const run of step.runs)channelRun(s,i,run.cells.length,'grow');
    if(i===5&&s.ward===0)cast(s,i,'ward');
    cast(s,i,'surge');
  }});
  assert.equal(remembered(s),6);assert.ok(s.vigor>=20);assert.ok(s.fruit>=10);assert.ok(s.remedies>=3);assert.equal(s.seeds,7);
});
test('locked forms reject matches and abilities without spending resources',()=>{
  const s=freshState();s.sap=60;const original=structuredClone(s);
  channelRun(s,4,5,'grow');assert.equal(cast(s,4,'surge'),false);assert.deepEqual(s,original);
});
test('reserving energy delays growth, long matches reward skill, and food is renewable',()=>{
  const s=freshState();channelRun(s,0,3,'reserve');assert.equal(s.sap,6);assert.equal(s.progress[0],0);
  channelRun(s,0,5,'grow');assert.equal(s.progress[0],9);assert.equal(s.sap,15);
  for(let i=0;i<20;i++)channelRun(s,0,3,'grow');assert.ok(s.fruit>3);
});
test('root ward blocks telegraphed attacks and mend heals the elder',()=>{
  const s=freshState();for(let i=0;i<5;i++)s.progress[i]=FORMS[i].need;s.sap=60;s.vigor=50;
  assert.equal(cast(s,5,'ward'),true);
  for(let i=0;i<3;i++)assert.equal(channelRun(s,5,3,'reserve').damage,0);
  assert.equal(s.ward,1);const vigor=s.vigor;assert.equal(cast(s,5,'mend'),true);assert.ok(s.vigor>vigor);assert.equal(s.progress[5],10);
});
test('save validation rejects corrupt or out-of-order progress',()=>{
  assert.deepEqual(restore({version:1}),freshState());const s=freshState();s.progress[3]=10;assert.deepEqual(restore(s),freshState());
  s.progress[3]=0;s.progress[0]=30;assert.deepEqual(restore(JSON.parse(JSON.stringify(s))),s);
});
