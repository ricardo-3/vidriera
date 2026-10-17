import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import DATA from '../src/domain/data/course.js';
import {emptyState,normalizeState,isUnlocked,completeLesson,rejectLesson,readProgress,writeProgress} from '../src/domain/progress.js';
const order=DATA.lessons.map(l=>l.id);
assert.deepEqual(order,['S01','S02','S03','S04','S05','S06','S07','S10','S08','S09','S11']);
let state=emptyState(DATA.version);
assert(isUnlocked(state,'S01',order));assert(!isUnlocked(state,'S02',order));
assert.deepEqual(completeLesson(state,'S03',order).completed,[]);
assert.deepEqual(rejectLesson(state,'S01',order).completed,[]);
state=completeLesson(state,'S01',order);
assert(isUnlocked(state,'S02',order));assert(!isUnlocked(state,'S03',order));
assert.deepEqual(rejectLesson(state,'S01',order).completed,['S01']);
assert.deepEqual(rejectLesson(state,'S02',order).completed,['S01']);
for(const id of order){state=completeLesson(state,id,order);}
assert.deepEqual(state.completed,order);
assert.deepEqual(rejectLesson(state,'S10',order).completed,order);
assert.deepEqual(completeLesson(state,'S11',order).completed,order);
assert.deepEqual(normalizeState({version:DATA.version,completed:['S01','S03']},order,DATA.version).completed,['S01']);
assert.deepEqual(normalizeState({version:'old',completed:order},order,DATA.version).completed,[]);
assert.equal(normalizeState({version:DATA.version,completed:[],lastLesson:'S11',reflection:'x'.repeat(15000)},order,DATA.version).lastLesson,null);
assert.equal(normalizeState({version:DATA.version,completed:[],reflection:'x'.repeat(15000)},order,DATA.version).reflection.length,12000);
const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
assert(writeProgress(storage,'test',state));assert.deepEqual(readProgress(storage,'test',order,DATA.version).state.completed,order);
assert.equal(writeProgress(null,'test',state),false);assert.equal(readProgress(null,'test',order,DATA.version).available,false);
values.set('bad','{');assert.equal(readProgress(storage,'bad',order,DATA.version).state.completed.length,0);
assert.equal(Object.keys(DATA.images).length,17);
for(const asset of Object.values(DATA.images)){const file=path.resolve('dist',asset.src);assert(fs.existsSync(file),file);const b=fs.readFileSync(file);assert(b.length>100);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert(asset.alt);}
for(const lesson of DATA.lessons){assert(lesson.body&&lesson.objective&&lesson.question);assert(DATA.images[lesson.primary]);for(const id of lesson.related)assert(DATA.images[id]);}
for(const comp of Object.values(DATA.comparisons)){assert(DATA.images[comp.before]);assert(DATA.images[comp.after]);}
assert.equal(DATA.comparisons.S10.before,'IMG-07');assert.equal(DATA.comparisons.S10.after,'IMG-12B');
assert.equal(DATA.route.length,14);assert.equal(DATA.transitions.length,13);
for(let i=0;i<DATA.transitions.length;i++){assert.equal(DATA.transitions[i].from,DATA.route[i]);assert.equal(DATA.transitions[i].to,DATA.route[i+1]);}
const html=fs.readFileSync('dist/index.html','utf8');
assert(html.includes('lang="es"'));assert(html.includes('id="root"'));assert(html.includes('type="module"'));
for(const m of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g))assert(fs.existsSync(path.resolve('dist',m[1].split(/[?#]/)[0])),m[1]);
assert(fs.readFileSync('src/styles/spatial.css','utf8').includes('prefers-reduced-motion'));
console.log('Passed: progression, No/revisit preservation, persistence, invalid storage, 17 assets, 11 lessons, 13 transition links and React build entry.');
