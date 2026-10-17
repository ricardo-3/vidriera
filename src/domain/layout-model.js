export const NODE_TYPES={
 women:{label:'Mujer',short:'Mujer',kind:'zone',w:2.7,h:4.5},
 kids:{label:'Kids',short:'Kids',kind:'zone',w:3,h:3},
 men:{label:'Hombre',short:'Hombre',kind:'zone',w:2.7,h:4.5},
 rack:{label:'Perchero',short:'P',kind:'fixture',w:1.8,h:.6},
 table:{label:'Mesa',short:'M',kind:'fixture',w:1.4,h:.8},
 island:{label:'Isla',short:'Isla',kind:'fixture',w:1.3,h:2.4},
 shoes:{label:'Calzado',short:'C',kind:'fixture',w:1.8,h:.5},
 checkout:{label:'Caja',short:'Caja',kind:'fixture',w:1.3,h:.8},
 fitting:{label:'Probador',short:'Pr',kind:'fixture',w:1.5,h:1.8}
};
export const clone=value=>JSON.parse(JSON.stringify(value));
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
export const snap=(value,step=.25)=>Math.round(value/step)*step;
const finite=(n,fallback)=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
export function blankLayout(){return {version:1,room:{width:8,depth:12},nodes:[],route:[],strokes:[],note:''};}
export function fitNode(node,room){
 const type=Object.hasOwn(NODE_TYPES,node.type)?node.type:'table',t=NODE_TYPES[type];
 const w=clamp(finite(node.w,t.w),.35,room.width),h=clamp(finite(node.h,t.h),.35,room.depth);
 return {id:String(node.id||'element').slice(0,60),type,x:clamp(finite(node.x,0),0,room.width-w),y:clamp(finite(node.y,0),0,room.depth-h),w,h};
}
export function pointInRoom(point,room){return {x:clamp(finite(point?.x,0),0,room.width),y:clamp(finite(point?.y,0),0,room.depth)};}
export function normalizeLayout(raw){
 if(!raw||raw.version!==1||!Array.isArray(raw.nodes))throw new Error('Este archivo no contiene un layout de Vidriera compatible.');
 const room={width:clamp(finite(raw.room?.width,8),4,16),depth:clamp(finite(raw.room?.depth,12),6,22)},ids=new Set();
 const nodes=raw.nodes.slice(0,100).filter(n=>n&&Object.hasOwn(NODE_TYPES,n.type)).map((n,i)=>{
  const node=fitNode({...n,id:String(n.id||'element-'+i)},room);
  if(ids.has(node.id))node.id+='-'+i;ids.add(node.id);return node;
 });
 const points=list=>Array.isArray(list)?list.slice(0,1200).filter(p=>p&&typeof p.x==='number'&&typeof p.y==='number'&&Number.isFinite(p.x)&&Number.isFinite(p.y)).map(p=>pointInRoom(p,room)):[];
 return {version:1,room,nodes,route:points(raw.route),strokes:Array.isArray(raw.strokes)?raw.strokes.slice(0,40).filter(Array.isArray).map(points).filter(p=>p.length>1):[],note:typeof raw.note==='string'?raw.note.slice(0,8000):''};
}
export function presetLayout(name='vitrina'){
 const state=blankLayout();if(name==='blank')return state;
 const n=(id,type,x,y,w,h)=>({id,type,x,y,w,h});
 state.nodes=[
 n('women','women',.25,2,2.75,5.7),n('kids','kids',.25,8,3.25,3.5),n('men','men',5,2,2.75,7),
 n('island','island',3.35,3.8,1.3,2.8),n('rack-w','rack',.45,2.8,.6,2.4),n('rack-m','rack',7,2.8,.6,2.4),
 n('shoes-w','shoes',.45,5.6,.6,1.7),n('shoes-m','shoes',7,6,.6,1.7),n('shoes-k','shoes',.6,11.1,2.6,.6),
 n('table-k','table',1.1,8.8,1.2,.8),n('checkout','checkout',4.8,10.5,1.2,.75),n('fitting','fitting',6.2,9.5,1.4,2.2)
 ];
 state.route=[{x:4,y:1},{x:2,y:2},{x:2,y:6},{x:2,y:8},{x:4,y:9.5},{x:6,y:8},{x:6,y:4},{x:4,y:1}];
 if(name==='islands'){
  state.nodes=state.nodes.filter(x=>x.id!=='island').concat([n('island-a','table',3.45,3.5,1.1,1.2),n('island-b','table',3.45,6.2,1.1,1.2),n('island-c','table',3.45,8.7,1.1,1.2)]);
  state.route=[{x:4,y:1},{x:2,y:2},{x:2,y:6},{x:2,y:8},{x:2,y:10},{x:5.9,y:10},{x:5.9,y:7.5},{x:6,y:4},{x:4,y:1}];
 }
 return normalizeLayout(state);
}
export function moveNode(layout,id,x,y,useSnap=true){
 const next=clone(layout);next.nodes=next.nodes.map(n=>n.id===id?fitNode({...n,x:useSnap?snap(x):x,y:useSnap?snap(y):y},next.room):n);return next;
}
export function rotateNode(layout,id){const next=clone(layout);next.nodes=next.nodes.map(n=>n.id===id?fitNode({...n,w:n.h,h:n.w},next.room):n);return next;}
export function rectsOverlap(a,b){return a.x<b.x+b.w-1e-6&&a.x+a.w>b.x+1e-6&&a.y<b.y+b.h-1e-6&&a.y+a.h>b.y+1e-6;}
export function segmentHitsRect(a,b,rect){
 const epsilon=1e-5,r={x:rect.x+epsilon,y:rect.y+epsilon,w:rect.w-epsilon*2,h:rect.h-epsilon*2};
 const dx=b.x-a.x,dy=b.y-a.y,p=[-dx,dx,-dy,dy],q=[a.x-r.x,r.x+r.w-a.x,a.y-r.y,r.y+r.h-a.y];
 let lo=0,hi=1;for(let i=0;i<4;i++){if(Math.abs(p[i])<1e-10){if(q[i]<0)return false;}else{const v=q[i]/p[i];if(p[i]<0)lo=Math.max(lo,v);else hi=Math.min(hi,v);if(lo>hi)return false;}}
 return true;
}
export function analyzeLayout(layout){
 const fixtures=layout.nodes.filter(n=>NODE_TYPES[n.type].kind==='fixture'),overlaps=[];
 for(let i=0;i<fixtures.length;i++)for(let j=i+1;j<fixtures.length;j++)if(rectsOverlap(fixtures[i],fixtures[j]))overlaps.push([fixtures[i].id,fixtures[j].id]);
 const routeHits=fixtures.filter(n=>layout.route.some((p,i)=>i>0&&segmentHitsRect(layout.route[i-1],p,n))).map(n=>n.id);
 const entrance={x:layout.room.width/2-1,y:0,w:2,h:2};
 const entranceHits=fixtures.filter(n=>rectsOverlap(n,entrance)).map(n=>n.id);
 return {overlaps,routeHits,entranceHits,hasRoute:layout.route.length>1};
}
export function viewFor(width,room){
 const margin=28,scale=Math.max(180,width-2*margin)/room.width;
 return {width:Math.max(width,236),height:room.depth*scale+2*margin+28,margin,scale,room};
}
export function toScreen(p,v){return {x:v.margin+p.x*v.scale,y:v.margin+(v.room.depth-p.y)*v.scale};}
export function toWorld(p,v){return pointInRoom({x:(p.x-v.margin)/v.scale,y:v.room.depth-(p.y-v.margin)/v.scale},v.room);}
export function addPoint(points,point,minimum=.09){
 const last=points.at(-1);if(!last||Math.hypot(point.x-last.x,point.y-last.y)>=minimum)return [...points.slice(-1198),point];return points;
}

