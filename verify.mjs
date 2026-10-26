import fs from 'node:fs';
import assert from 'node:assert/strict';
const expected={glucose:[113.8,99.4,108.6,110,102.5,21,20.4],sbp:[125.9,123.3,119.6,131.3,127.1,38,16.1],fev1:[2878.6,3217.9,1982.5,2003,1831.8,79,537.7]};
let count=0;
for(const [key,e] of Object.entries(expected)){
 const b=JSON.parse(fs.readFileSync(new URL(`outputs/${key}.json`,import.meta.url)));const p=b.people[0];
 const same=(a,v)=>assert.equal(Number(a.toFixed(1)),v);
 const f=b.forest.people[p.id],g=b.boosting.people[p.id];
 same(b.linear.baseline,e[0]);same(b.linear.people[p.id].prediction,e[1]);same(f.prediction,e[2]);same(f.tree_predictions[0],e[3]);same(g.staged[500],e[4]);assert.equal(b.boosting.best_validation_round,e[5]);same(b.boosting.best_validation_rmse,e[6]);
 for(const person of b.people){
  const l=b.linear.people[person.id];let pushes=Object.values(l.grouped_pushes).reduce((a,v)=>a+v,0);assert.ok(Math.abs(b.linear.baseline+pushes-l.prediction)<0.001);
  const trees=b.forest.people[person.id];assert.equal(trees.tree_predictions.length,100);assert.ok(Math.abs(trees.tree_predictions.reduce((a,v)=>a+v,0)/100-trees.prediction)<0.001);
  const gb=b.boosting.people[person.id];assert.equal(gb.staged.length,501);for(let j=1;j<=500;j++)assert.ok(Math.abs(gb.staged[j-1]+gb.corrections[j-1]-gb.staged[j])<0.001);
  count++;
 }
 const a=b.boosting.rmse.validation;assert.equal(a.indexOf(Math.min(...a)),e[5]);
}
console.log(`PASS: all instructor check values; ${count} people; baseline sums, 100-tree averages, 7,500 boosting additions and validation minima.`);
