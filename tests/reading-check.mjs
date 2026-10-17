import assert from 'node:assert/strict';
import DATA from '../src/domain/data/course.js';
import {readingProgress,mayConfirm,previewIsSelectable} from '../src/domain/reading.js';
import {emptyState,completeLesson} from '../src/domain/progress.js';
const order=DATA.lessons.map(lesson=>lesson.id);
assert.equal(readingProgress(900,2800,800),0);
assert.equal(readingProgress(0,2000,1000),50);
assert.equal(readingProgress(-2000,500,800),100);
assert.equal(readingProgress(10,10,800),0);
assert.equal(readingProgress(NaN,1000,800),0);
let state=emptyState('1');
for(let count=0;count<=order.length;count++){
 for(const [index,id] of order.entries())assert.equal(previewIsSelectable(state,id),index<count,'Only completed thumbnails can navigate');
 const active=order[Math.min(count,order.length-1)];
 assert.equal(mayConfirm({page:'lesson',activeId:active,requestedId:active,reachedEnd:false,completed:state.completed}),count===11);
 assert(mayConfirm({page:'lesson',activeId:active,requestedId:active,reachedEnd:true,completed:state.completed}));
 for(const page of ['home','overview','workshop'])assert(!mayConfirm({page,activeId:active,requestedId:active,reachedEnd:true,completed:state.completed}));
 for(const id of order.filter(id=>id!==active))assert(!mayConfirm({page:'lesson',activeId:active,requestedId:id,reachedEnd:true,completed:state.completed}));
 const before=JSON.stringify(state);readingProgress(-4000,400,800);assert.equal(JSON.stringify(state),before,'Reading never completes a lesson');
 if(count<order.length)state=completeLesson(state,order[count],order);
}
console.log('Passed: reading position, completion allowed only for the active lesson after its end, no progress from scroll, completed-only thumbnail links and previous completions preserved.');
