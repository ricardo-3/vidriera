import {NODE_TYPES,viewFor,toScreen} from './layout-model.js';
const NS='http://www.w3.org/2000/svg';
export function svgNode(tag,attrs={},text){
 const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;
}
export function renderPlan(svg,layout,{width=500,selected=null,interactive=true}={}){
 const v=viewFor(width,layout.room),s=v.scale,m=v.margin;svg.setAttribute('viewBox','0 0 '+v.width+' '+v.height);svg.setAttribute('width',v.width);svg.setAttribute('height',v.height);svg.replaceChildren();
 const put=(tag,attrs,text)=>{const n=svgNode(tag,attrs,text);svg.append(n);return n;};
 put('rect',{width:v.width,height:v.height,fill:'#f3f1ef'});
 put('text',{x:v.width/2,y:14,'text-anchor':'middle','font-family':'Arial,sans-serif','font-size':10,fill:'#6f6d6b'},'FONDO');
 put('rect',{x:m,y:m,width:layout.room.width*s,height:layout.room.depth*s,fill:'#fffdfb',stroke:'#272523','stroke-width':1.3});
 for(let x=1;x<layout.room.width;x++)put('line',{x1:m+x*s,y1:m,x2:m+x*s,y2:m+layout.room.depth*s,stroke:'#e6e4e2','stroke-width':.7});
 for(let y=1;y<layout.room.depth;y++)put('line',{x1:m,y1:m+y*s,x2:m+layout.room.width*s,y2:m+y*s,stroke:'#e6e4e2','stroke-width':.7});
 for(let x=0;x<=layout.room.width;x++)put('text',{x:m+x*s,y:m+layout.room.depth*s+16,'text-anchor':'middle','font-family':'Arial,sans-serif','font-size':10,fill:'#6f6d6b'},String(x));
 for(let y=1;y<=layout.room.depth;y++)put('text',{x:m-8,y:m+(layout.room.depth-y)*s+3,'text-anchor':'end','font-family':'Arial,sans-serif','font-size':10,fill:'#6f6d6b'},String(y));
 const nodes=[...layout.nodes.filter(n=>NODE_TYPES[n.type].kind==='zone'),...layout.nodes.filter(n=>NODE_TYPES[n.type].kind==='fixture')];
 for(const n of nodes){
  const t=NODE_TYPES[n.type],p=toScreen({x:n.x,y:n.y+n.h},v),w=n.w*s,h=n.h*s;
  const g=put('g',{'data-item':n.id});if(interactive){g.setAttribute('aria-label',t.label);g.classList.add('plan-element');}
  g.append(svgNode('rect',{x:p.x,y:p.y,width:w,height:h,rx:t.kind==='zone'?0:2,fill:t.kind==='zone'?'#e4e2e0':'#c7c5c3','fill-opacity':t.kind==='zone'?.7:1,stroke:selected===n.id?'#63615f':t.kind==='zone'?'#c4c2c0':'#6a6866','stroke-width':selected===n.id?2.8:1}));
  if(n.type==='rack'||n.type==='shoes'){
   const vertical=h>w;
   for(const ratio of [.28,.72])g.append(svgNode('line',vertical?{x1:p.x+w*ratio,y1:p.y+4,x2:p.x+w*ratio,y2:p.y+h-4,stroke:'#6f6d6b','stroke-width':1}:{x1:p.x+4,y1:p.y+h*ratio,x2:p.x+w-4,y2:p.y+h*ratio,stroke:'#6f6d6b','stroke-width':1}));
  }
  const label=w>70?t.label:t.short;
  g.append(svgNode('text',{x:p.x+w/2,y:p.y+h/2+4,'text-anchor':'middle','font-family':'Arial,sans-serif','font-size':t.kind==='zone'?13:12,fill:'#272523','pointer-events':'none'},label));
 }
 for(const stroke of layout.strokes){
  const d=stroke.map((p,i)=>{const q=toScreen(p,v);return (i?'L':'M')+q.x+' '+q.y;}).join(' ');
  put('path',{d,fill:'none',stroke:'#6f6d6b','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round','pointer-events':'none'});
 }
 if(layout.route.length){
  const pts=layout.route.map(p=>toScreen(p,v)),d=pts.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
  put('path',{d,fill:'none',stroke:'#63615f','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round','pointer-events':'none'});
  for(const i of [0,pts.length-1]){const p=pts[i];put('circle',{cx:p.x,cy:p.y,r:5,fill:i===0?'#fffdfb':'#63615f',stroke:'#63615f','stroke-width':2,'pointer-events':'none'});}
 }
 const entrance=toScreen({x:layout.room.width/2-1,y:0},v);
 put('line',{x1:entrance.x,y1:entrance.y,x2:entrance.x+2*s,y2:entrance.y,stroke:'#63615f','stroke-width':5});
 put('text',{x:v.width/2,y:v.height-6,'text-anchor':'middle','font-family':'Arial,sans-serif','font-size':10,fill:'#6f6d6b'},'FACHADA / ENTRADA');
 return v;
}

