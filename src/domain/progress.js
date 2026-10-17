export function emptyState(version='1'){return {version,completed:[],lastLesson:null,reflection:''};}
export function normalizeState(raw,order,version='1'){
  const state=emptyState(version);
  if(!raw||raw.version!==version||!Array.isArray(raw.completed))return state;
  for(const id of order){if(raw.completed.includes(id))state.completed.push(id);else break;}
  state.reflection=typeof raw.reflection==='string'?raw.reflection.slice(0,12000):'';
  const currentIndex=order.indexOf(raw.lastLesson);
  state.lastLesson=currentIndex>=0&&currentIndex<=state.completed.length?raw.lastLesson:null;
  return state;
}
export function isUnlocked(state,id,order){const index=order.indexOf(id);return index>=0&&index<=state.completed.length;}
export function completeLesson(state,id,order){
  const next=normalizeState(state,order,state.version);
  if(!isUnlocked(next,id,order))return next;
  if(!next.completed.includes(id))next.completed.push(id);
  next.lastLesson=id;
  return next;
}
export function rejectLesson(state,id,order){
  const next=normalizeState(state,order,state.version);
  if(isUnlocked(next,id,order))next.lastLesson=id;
  return next;
}
export function readProgress(storage,key,order,version){
  try{return {state:normalizeState(JSON.parse(storage.getItem(key)),order,version),available:true};}
  catch{return {state:emptyState(version),available:false};}
}
export function writeProgress(storage,key,state){try{storage.setItem(key,JSON.stringify(state));return true;}catch{return false;}}

