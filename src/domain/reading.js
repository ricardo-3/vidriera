// Reading position is transient. It never writes or completes course progress.
export function readingProgress(top,bottom,viewportHeight){
 if(![top,bottom,viewportHeight].every(Number.isFinite)||bottom<=top||viewportHeight<=0)return 0;
 return Math.round(Math.max(0,Math.min(1,(viewportHeight-top)/(bottom-top)))*100);
}
export function mayConfirm({page,activeId,requestedId,reachedEnd,completed=[]}){
 return page==='lesson'&&activeId===requestedId&&(reachedEnd===true||completed.includes(requestedId));
}
export function previewIsSelectable(state,id){return state.completed.includes(id);}
