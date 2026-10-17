import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import DATA from '../src/domain/data/course.js';
import {emptyState, completeLesson, readProgress} from '../src/domain/progress.js';
import {parseRoute, resolveRoute, lessonUrl} from '../src/domain/navigation.js';
import {LEARNING} from '../src/domain/data/learning.js';
import {cleanDraft, getPractice, supportFeedback} from '../src/domain/lesson-activities.js';

const order=DATA.lessons.map(l=>l.id);
assert.deepEqual(Object.keys(LEARNING),order);
assert.deepEqual(parseRoute('#course',order),{page:'entry'});
assert.deepEqual(parseRoute('#/curso',order),{page:'entry'});
assert.deepEqual(parseRoute('#/indice',order),{page:'overview'});
assert.deepEqual(parseRoute('#/cierre',order),{page:'finish'});
assert.deepEqual(parseRoute('#about',order),{page:'home',anchor:'about'});
for(const hash of ['','#/tema/S99','#/tema/../../bad','#lesson-undefined'])assert.equal(parseRoute(hash,order).page,'home');
let state=emptyState(DATA.version);
for(let done=0;done<=order.length;done++){
  for(const [index,id] of order.entries()){
    assert.deepEqual(parseRoute(lessonUrl(id),order),{page:'lesson',id});
    assert.deepEqual(parseRoute('#lesson-'+id,order),{page:'lesson',id});
    const result=resolveRoute(parseRoute(lessonUrl(id),order),state,order);
    assert.equal(result.id,index>done?order[Math.min(done,order.length-1)]:id);
    assert.equal(Boolean(result.redirected),index>done);
  }
  const finish=resolveRoute({page:'finish'},state,order);
  assert.equal(finish.page,done===11?'finish':'lesson');
  if(done<order.length)state=completeLesson(state,order[done],order);
}
assert.equal(order.indexOf('S10'),7);
for(const lesson of DATA.lessons){const extra=LEARNING[lesson.id];for(const field of ['lead','example','mistake','takeaway','review','task'])assert(extra[field]?.length>20);assert.equal(extra.detail.length,lesson.observe.length);}
const draft=cleanDraft(JSON.parse('{"idea":"ok","constructor":"bad","prototype":"bad","__proto__":{"polluted":true},"level":1.5,"invalid":null}'));
assert.equal(draft.idea,'ok');assert(!Object.hasOwn(draft,'constructor'));assert(!Object.hasOwn(draft,'__proto__'));assert.equal({}.polluted,undefined);
assert.equal(cleanDraft({idea:'x'.repeat(3000)}).idea.length,1600);
const route=cleanDraft({route:[{x:-5,y:50},{x:Infinity,y:3},{x:1,y:2},...Array.from({length:100},()=>({x:3,y:4}))]}).route;
assert(route.length<=80);assert.deepEqual(route[0],{x:0,y:12});assert(!route.some(p=>!Number.isFinite(p.x)));
assert(supportFeedback('dress','rack').suitable);assert(supportFeedback('knit','table').suitable);assert(supportFeedback('shoes','shelf').suitable);assert(!supportFeedback('dress','table').suitable);
const existing={version:'1',completed:['S01','S02'],lastLesson:'S02',reflection:'Mi reflexión anterior'};
const values=new Map([['vitrina-course-v1',JSON.stringify(existing)],['vitrina-practice-v1','{"S01":{"choice":"playful"}}']]);
globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(k,v)=>values.set(k,v)};
assert.equal(getPractice('S01').choice,'playful');
assert.deepEqual(readProgress(localStorage,'vitrina-course-v1',order,'1').state,existing);
assert.equal(values.get('vitrina-course-v1'),JSON.stringify(existing));
delete globalThis.localStorage;
const files=fs.readdirSync('src/domain').filter(f=>f.endsWith('.js')).map(f=>'src/domain/'+f).concat(['src/domain/data/course.js','src/domain/data/learning.js']);
for(const file of files){
 const source=fs.readFileSync(file,'utf8');
 for(const m of source.matchAll(/from ['"](\.\/[^'"]+)['"]/g))assert(fs.existsSync(path.resolve(path.dirname(file),m[1].split(/[?#]/)[0])),file+' -> '+m[1]);
}
assert(fs.existsSync('src/App.jsx'));assert(fs.existsSync('src/Workshop.jsx'));
console.log('Passed: all chapter URLs and legacy links, lock guards at every progress state, eleven learning activities, safe drafts, prior progress preservation and domain module references.');
