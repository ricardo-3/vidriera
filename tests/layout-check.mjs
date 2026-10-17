import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {blankLayout,presetLayout,normalizeLayout,moveNode,rotateNode,analyzeLayout,rectsOverlap,segmentHitsRect,viewFor,toScreen,toWorld,NODE_TYPES} from '../src/domain/layout-model.js';
import {hexToHsl,hslToHex,createPalette,groupColors,COMPOSITIONS} from '../src/domain/activities.js';
let state=presetLayout();
assert.equal(state.nodes.length,12);
assert.deepEqual(analyzeLayout(state).overlaps,[]);
assert.deepEqual(analyzeLayout(state).entranceHits,[]);
assert.deepEqual(analyzeLayout(state).routeHits,[]);
assert.equal(presetLayout('blank').nodes.length,0);
for(const preset of ['vitrina','islands']){
 const p=presetLayout(preset);for(const n of p.nodes){assert(n.x>=0&&n.y>=0);assert(n.x+n.w<=p.room.width+1e-8&&n.y+n.h<=p.room.depth+1e-8);}
 assert.deepEqual(normalizeLayout(JSON.parse(JSON.stringify(p))),p);
}
const moved=moveNode(state,'island',-100,100);
const island=moved.nodes.find(n=>n.id==='island');
assert.equal(island.x,0);assert.equal(island.y,state.room.depth-island.h);
const snapped=moveNode(state,'island',2.11,3.12).nodes.find(n=>n.id==='island');assert.equal(snapped.x,2);assert.equal(snapped.y,3);
const rotated=rotateNode(state,'rack-w').nodes.find(n=>n.id==='rack-w');
assert.equal(rotated.w,2.4);assert.equal(rotated.h,.6);
assert.equal(state.nodes.find(n=>n.id==='rack-w').w,.6);
const blocked=moveNode(state,'island',3.25,.25);
assert(analyzeLayout(blocked).entranceHits.includes('island'));
const routeBlocked=moveNode(state,'island',1.75,3);
assert(analyzeLayout(routeBlocked).routeHits.includes('island'));
assert(rectsOverlap({x:0,y:0,w:2,h:2},{x:1,y:1,w:2,h:2}));
assert(!rectsOverlap({x:0,y:0,w:2,h:2},{x:2,y:0,w:1,h:2}));
assert(segmentHitsRect({x:0,y:2},{x:4,y:2},{x:1,y:1,w:2,h:2}));
assert(!segmentHitsRect({x:0,y:0},{x:4,y:0},{x:1,y:1,w:2,h:2}));
assert(!segmentHitsRect({x:0,y:1},{x:4,y:1},{x:1,y:1,w:2,h:2}));
for(const width of [260,360,540,1000]){
 const v=viewFor(width,state.room);for(const p of [{x:0,y:0},{x:8,y:12},{x:3.25,y:7.5}]){
 const w=toWorld(toScreen(p,v),v);assert(Math.abs(w.x-p.x)<1e-8);assert(Math.abs(w.y-p.y)<1e-8);
 }
}
const imported=normalizeLayout({version:1,room:{width:8,depth:12},nodes:[{id:'bad',type:'__proto__'},{id:'good',type:'rack',x:900,y:-900,w:2,h:.6}],route:[{x:Infinity,y:1},{x:20,y:-3}],strokes:[],note:'x'.repeat(9000)});
assert.equal(imported.nodes.length,1);assert.equal(imported.nodes[0].x,6);assert.equal(imported.nodes[0].y,0);assert.equal(imported.route.length,1);assert.equal(imported.route[0].x,8);assert.equal(imported.note.length,8000);
assert.throws(()=>normalizeLayout({version:2,nodes:[]}));
assert.deepEqual(analyzeLayout(blankLayout()).routeHits,[]);assert.equal(analyzeLayout(blankLayout()).hasRoute,false);
for(const hex of ['#ff0000','#00ff00','#0000ff','#637a73','#000000','#ffffff']){
 const p=hexToHsl(hex);assert.equal(hslToHex(p.h,p.s,p.l),hex);
 for(const mode of ['monochrome','analogous','complementary']){const colors=createPalette(hex,mode);assert.equal(colors.length,6);assert(colors.every(c=>/^#[0-9a-f]{6}$/.test(c)));}
}
const complement=createPalette('#ff0000','complementary');
assert(Math.abs(hexToHsl(complement[1]).h-0)<1);assert(Math.abs(hexToHsl(complement[4]).h-180)<1);
const grouped=groupColors(['#cccccc','#333333','#777777']);assert.deepEqual(grouped,['#333333','#777777','#cccccc']);
for(const p of Object.values(COMPOSITIONS)){assert.equal(p.groups.length,5);for(const g of p.groups){assert(g.x>=0&&g.y>=0&&g.x+g.w<=100&&g.y+g.h<=100);}}
const html=fs.readFileSync('dist/taller.html','utf8');
assert(html.includes('id="root"'));assert(html.includes('type="module"'));
for(const m of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g))assert(fs.existsSync(path.resolve('dist',m[1].split(/[?#]/)[0])),m[1]);
console.log('Passed: layout bounds and rotation, save/import roundtrip, route and entrance collisions, responsive coordinate transforms, color harmonies, composition groups and workshop build entry.');
