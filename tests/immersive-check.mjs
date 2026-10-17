import assert from 'node:assert/strict';
import fs from 'node:fs';
import DATA from '../src/domain/data/course.js';
import {HOTSPOTS,imageRect} from '../src/domain/data/hotspots.js';
import {parseRoute,resolveRoute,lessonUrl} from '../src/domain/navigation.js';
const order=DATA.lessons.map(l=>l.id);
for(const lesson of DATA.lessons){
 const points=HOTSPOTS[lesson.primary];assert.equal(points.length,lesson.observe.length,lesson.id);
 for(const point of points){assert(point.x>0&&point.x<1);assert(point.y>0&&point.y<1);assert(point.label.length>3);}
 const file='dist/temas/'+lesson.id+'.html';assert(fs.existsSync(file));
 const html=fs.readFileSync(file,'utf8');assert(html.includes('<base href="../">'));assert(html.includes('data-initial-lesson="'+lesson.id+'"'));assert(html.includes('id="root"'));assert(html.includes('type="module"'));assert(html.includes(lesson.title));
 assert.deepEqual(parseRoute('/temas/'+lesson.id+'.html',order),{page:'lesson',id:lesson.id});
 assert.deepEqual(parseRoute('/subdirectory/temas/'+lesson.id+'.html',order),{page:'lesson',id:lesson.id});
 assert.deepEqual(parseRoute('#/tema/'+lesson.id,order),{page:'lesson',id:lesson.id});
 assert.deepEqual(parseRoute(lessonUrl(lesson.id),order),{page:'lesson',id:lesson.id});
}
for(const [w,h] of [[360,184],[916,531],[450,399],[0,0]]){
 const rect=imageRect(w,h);assert(rect.width<=w+1e-9);assert(rect.height<=h+1e-9);assert(rect.left>=-1e-9&&rect.top>=-1e-9);
 if(rect.height)assert(Math.abs(rect.width/rect.height-16/9)<1e-9);
 for(const points of Object.values(HOTSPOTS))for(const p of points){const x=rect.left+p.x*rect.width,y=rect.top+p.y*rect.height;assert(x>=0&&x<=w);assert(y>=0&&y<=h);}
}
assert.equal(resolveRoute(parseRoute('#course',order),{completed:[],lastLesson:null},order).id,'S01');
assert.equal(resolveRoute(parseRoute('#course',order),{completed:['S01','S02'],lastLesson:'S02'},order).id,'S02');
assert.equal(resolveRoute(parseRoute('#course',order),{completed:['S01'],lastLesson:'S11'},order).id,'S02');
assert.equal(resolveRoute(parseRoute('/temas/S11.html',order),{completed:[],lastLesson:null},order).id,'S01');
console.log('Passed: eleven physical chapter pages, course entry and legacy routes, guarded deep links and hotspot positions inside responsive uncropped images.');
