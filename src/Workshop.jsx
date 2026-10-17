import React, {useEffect, useRef, useState} from 'react';
import {NODE_TYPES,clone,normalizeLayout,presetLayout,fitNode,moveNode,rotateNode,analyzeLayout,toWorld,addPoint} from './domain/layout-model.js';
import {renderPlan} from './domain/layout-render.js';
import {Button,Surface,Field,Tabs,IconButton,useReducedMotion} from './ui/components.jsx';
import {Activity} from './ui/Practice.jsx';
import {download} from './ui/download.js';

export const LAYOUT_KEY='vitrina-layout-v1';
function initialLayout(){try{const value=localStorage.getItem(LAYOUT_KEY);if(value)return normalizeLayout(JSON.parse(value));}catch{}return presetLayout();}

function PropertyField({label,value,min,max,onCommit}){
 const [draft,setDraft]=useState(String(Number(value.toFixed(2))));
 useEffect(()=>setDraft(String(Number(value.toFixed(2)))),[value]);
 return <Field label={label}><input type="number" min={min} max={max} step="0.05" value={draft} onChange={event=>setDraft(event.target.value)} onBlur={()=>{const number=Number(draft);if(draft.trim()&&Number.isFinite(number))onCommit(number);else setDraft(String(Number(value.toFixed(2))));}} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();event.currentTarget.blur();}}}/></Field>;
}

export default function Workshop({announce}){
 const reduced=useReducedMotion();
 function jump(event,id){event.preventDefault();document.getElementById(id).scrollIntoView({behavior:reduced?'instant':'smooth'});}
 const [layout,setLayout]=useState(initialLayout),[selected,setSelected]=useState(null),[mode,setMode]=useState(()=>location.hash==='#recorrido'?'route':'move'),[preset,setPreset]=useState('vitrina'),[saved,setSaved]=useState(true),[historyState,setHistoryState]=useState({past:[],future:[]});
 const svg=useRef(null),board=useRef(null),fileRef=useRef(null),view=useRef(null),gesture=useRef(null),latest=useRef(layout),historyRef=useRef(historyState),serial=useRef(0);latest.current=layout;historyRef.current=historyState;
 const node=layout.nodes.find(item=>item.id===selected),feedback=analyzeLayout(layout);
 useEffect(()=>{const draw=()=>{view.current=renderPlan(svg.current,latest.current,{width:Math.min(570,board.current.clientWidth||500),selected});};draw();const observer=new ResizeObserver(draw);observer.observe(board.current);return()=>observer.disconnect();},[layout,selected]);
 useEffect(()=>{if(gesture.current)return;try{localStorage.setItem(LAYOUT_KEY,JSON.stringify(layout));setSaved(true);}catch{setSaved(false);}},[layout]);
 function commit(next,previous=latest.current){
  const normalized=normalizeLayout(next);
  if(JSON.stringify(normalized)!==JSON.stringify(previous)){const h=historyRef.current;const update={past:[...h.past,clone(previous)].slice(-45),future:[]};historyRef.current=update;setHistoryState(update);}
  latest.current=normalized;setLayout(normalized);if(selected&&!normalized.nodes.some(item=>item.id===selected))setSelected(null);
 }
 function changeHistory(direction){
  const h=historyRef.current,from=direction==='undo'?h.past:h.future;if(!from.length)return;
  const next=clone(from.at(-1));next.note=latest.current.note;
  const update=direction==='undo'?{past:h.past.slice(0,-1),future:[...h.future,clone(latest.current)]}:{past:[...h.past,clone(latest.current)].slice(-45),future:h.future.slice(0,-1)};
  historyRef.current=update;setHistoryState(update);latest.current=next;setLayout(next);setSelected(null);
 }
 function point(event){const r=svg.current.getBoundingClientRect(),v=view.current;return toWorld({x:(event.clientX-r.left)*v.width/r.width,y:(event.clientY-r.top)*v.height/r.height},v);}
 function begin(event){
  if(!view.current||(event.pointerType==='mouse'&&event.button!==0))return;
  const p=point(event),target=event.target.closest('[data-item]'),before=clone(latest.current);let next=clone(before);
  if(mode==='move'){
   if(!target){setSelected(null);return;}const id=target.dataset.item,n=next.nodes.find(item=>item.id===id);if(!n)return;
   setSelected(id);gesture.current={kind:'move',before,id,dx:p.x-n.x,dy:p.y-n.y,pointerId:event.pointerId};
  }else{
   gesture.current={kind:mode,before,pointerId:event.pointerId};
   if(mode==='route')next.route=addPoint(next.route,p,0);else next.strokes=[...next.strokes,[p]].slice(-40);
  }
  svg.current.setPointerCapture(event.pointerId);svg.current.focus({preventScroll:true});event.preventDefault();latest.current=next;setLayout(next);
 }
 function move(event){
  const g=gesture.current;if(!g||event.pointerId!==g.pointerId)return;const p=point(event);let next=clone(latest.current);
  if(g.kind==='move')next=moveNode(next,g.id,p.x-g.dx,p.y-g.dy,!event.shiftKey);
  else if(g.kind==='route')next.route=addPoint(next.route,p);
  else {const i=next.strokes.length-1;next.strokes[i]=addPoint(next.strokes[i],p,.045);}
  event.preventDefault();latest.current=next;setLayout(next);
 }
 function finish(event,cancel=false){const g=gesture.current;if(!g||g.pointerId!==event.pointerId)return;gesture.current=null;if(svg.current.hasPointerCapture(event.pointerId))svg.current.releasePointerCapture(event.pointerId);if(cancel){latest.current=g.before;setLayout(g.before);}else commit(latest.current,g.before);}
 function remove(){if(!node)return;commit({...clone(latest.current),nodes:latest.current.nodes.filter(item=>item.id!==selected)});setSelected(null);}
 function keyboard(event){
  if(!node)return;const delta=event.shiftKey?1:.25,changes={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,delta],ArrowDown:[0,-delta]};
  if(changes[event.key]){event.preventDefault();const [x,y]=changes[event.key];commit(moveNode(latest.current,selected,node.x+x,node.y+y));}
  else if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();remove();}
 }
 function add(type){const t=NODE_TYPES[type],next=clone(latest.current),id='n-'+Date.now().toString(36)+'-'+(++serial.current);next.nodes.push(fitNode({id,type,x:next.room.width/2-t.w/2,y:next.room.depth/2-t.h/2,w:t.w,h:t.h},next.room));setSelected(id);setMode('move');commit(next);}
 function property(field,value){if(!node||!Number.isFinite(value))return;const next=clone(latest.current);next.nodes=next.nodes.map(item=>item.id===selected?fitNode({...item,[field]:value},next.room):item);commit(next);}
 function exportedSvg(){const output=document.createElementNS('http://www.w3.org/2000/svg','svg');renderPlan(output,latest.current,{width:1000,interactive:false});const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent='Mi layout de Vidriera';output.prepend(title);return {text:new XMLSerializer().serializeToString(output),width:1000,height:Number(output.getAttribute('height'))};}
 function exportSvg(){download(exportedSvg().text,'image/svg+xml;charset=utf-8','Mi_layout_Vidriera.svg');announce('Tu planta está preparada en SVG.');}
 function exportPng(){
  const s=exportedSvg(),url=URL.createObjectURL(new Blob([s.text],{type:'image/svg+xml'})),image=new Image();
  image.onload=()=>{try{const canvas=document.createElement('canvas');canvas.width=s.width*2;canvas.height=s.height*2;const ctx=canvas.getContext('2d');if(!ctx)throw new Error();ctx.scale(2,2);ctx.drawImage(image,0,0,s.width,s.height);canvas.toBlob(blob=>{if(blob){download(blob,'image/png','Mi_layout_Vidriera.png');announce('Tu planta está preparada en PNG.');}else announce('No se pudo preparar el PNG. Podés guardar el SVG.');});}catch{announce('No se pudo preparar el PNG. Podés guardar el SVG.');}finally{URL.revokeObjectURL(url);}};
  image.onerror=()=>{URL.revokeObjectURL(url);announce('No se pudo preparar el PNG. Podés guardar el SVG.');};image.src=url;
 }
 async function importJson(event){
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>2000000)throw new Error('El archivo supera el tamaño admitido de 2 MB.');const next=normalizeLayout(JSON.parse(await file.text()));commit(next);setSelected(null);announce('Se abrió tu propuesta editable.');}
  catch(error){announce(error.message||'No se pudo abrir ese archivo. Tu propuesta se conserva.');}event.target.value='';
 }
 const messages=[{clear:!feedback.entranceHits.length,text:feedback.entranceHits.length?'Hay elementos sobre el acceso.':'El área de entrada queda despejada.'},{clear:!feedback.overlaps.length,text:feedback.overlaps.length?'Hay '+feedback.overlaps.length+' superposición(es) de muebles.':'Los muebles no se superponen.'},{clear:feedback.hasRoute&&!feedback.routeHits.length,text:!feedback.hasRoute?'Dibujá un recorrido para conectar las zonas.':feedback.routeHits.length?'El recorrido atraviesa '+feedback.routeHits.length+' mueble(s).':'El recorrido evita los muebles.'}];
 return <div className="workshop-page">
  <section className="workshop-heading"><div><p className="eyebrow">EL TALLER / APRENDER HACIENDO</p><h1>Probá tus ideas.<br/>Volvé a mirar.</h1></div><p>Organizá una planta, dibujá un recorrido y explorá el color y la composición. Acá podés cambiar de idea cuantas veces quieras.</p></section>
  <nav className="workshop-jumps" aria-label="Apartados del taller"><Button as="a" href="#layout" onClick={event=>jump(event,'layout')}>01 · La planta ↓</Button><Button as="a" href="#workshop-color" onClick={event=>jump(event,'workshop-color')}>02 · El color ↓</Button><Button as="a" href="#workshop-composition" onClick={event=>jump(event,'workshop-composition')}>03 · La composición ↓</Button></nav>
  <Surface className="sp-editor" id="layout"><div className="editor-heading"><div><p className="eyebrow">01 / DISEÑÁ TU LAYOUT</p><h2>Todo empieza en la planta.</h2></div><span className="small-note" role="status">{saved?'Propuesta guardada en este navegador.':'Guardá el archivo editable para conservar tu propuesta.'}</span></div>
   <div className="sp-editor-toolbar"><Tabs value={mode} onChange={setMode} label="Herramienta de diseño" items={[{value:'move',label:'Mover'},{value:'route',label:'Recorrido'},{value:'sketch',label:'Croquis'}]}/><div className="history-controls"><IconButton label="Deshacer cambio" disabled={!historyState.past.length} onClick={()=>changeHistory('undo')}>↶</IconButton><IconButton label="Rehacer cambio" disabled={!historyState.future.length} onClick={()=>changeHistory('redo')}>↷</IconButton><Button variant="ghost" onClick={()=>commit({...clone(latest.current),route:[],strokes:[]})}>Limpiar trazos</Button></div></div>
   <div className="sp-editor-grid"><aside className="sp-palette" aria-label="Agregar y elegir elementos"><div className="palette-section"><h3>Punto de partida</h3><Field label="Distribución"><select value={preset} onChange={event=>setPreset(event.target.value)}><option value="vitrina">El local Vidriera</option><option value="islands">Tres islas</option><option value="blank">Planta vacía</option></select></Field><Button onClick={()=>{const next=presetLayout(preset);next.note=latest.current.note;setSelected(null);setMode('move');commit(next);announce('Distribución aplicada. Podés deshacer este cambio.');}}>Aplicar distribución ↗</Button></div>{['zone','fixture'].map(kind=><div className="palette-section" key={kind}><h3>{kind==='zone'?'Departamentos':'Mobiliario'}</h3><div className="add-tools">{Object.entries(NODE_TYPES).filter(([,t])=>t.kind===kind).map(([type,t])=><Button key={type} variant="ghost" onClick={()=>add(type)}>+ {t.label}</Button>)}</div></div>)}<p className="small-note">Agregá elementos, elegilos y ajustá su posición. Podés deshacer los últimos 45 cambios.</p></aside>
    <div className="sp-board-column"><p className="board-instruction" id="tool-instruction">{mode==='move'?'Arrastrá un elemento. También podés seleccionarlo debajo y usar las flechas del teclado.':mode==='route'?'Tocá puntos o arrastrá para dibujar el recorrido.':'Dibujá libremente sobre la planta.'}</p><div className="sp-plan-board" ref={board}><svg ref={svg} tabIndex={0} role="group" aria-label="Planta editable del local" aria-describedby="tool-instruction" data-mode={mode} onPointerDown={begin} onPointerMove={move} onPointerUp={event=>finish(event)} onPointerCancel={event=>finish(event,true)} onKeyDown={keyboard}/></div><div className="board-caption"><span>{layout.room.width} × {layout.room.depth} m · Planta de estudio</span><span>Flechas: 0,25 m · Mayús: 1 m</span></div></div>
    <aside className="sp-inspector" aria-label="Propiedades y observaciones"><Field label="Elemento seleccionado"><select value={selected||''} onChange={event=>{setSelected(event.target.value||null);setMode('move');}}><option value="">Elegí un elemento</option>{layout.nodes.map((item,i)=><option value={item.id} key={item.id}>{NODE_TYPES[item.type].label} · {i+1}</option>)}</select></Field>
     {node?<div className="sp-selection"><p className="eyebrow">AJUSTÁ EL ELEMENTO</p><h3>{NODE_TYPES[node.type].label}</h3><div className="property-grid">{[['x','Horizontal'],['y','Desde entrada'],['w','Ancho'],['h','Profundidad']].map(([field,label])=><PropertyField key={node.id+'-'+field} label={label+' (m)'} min={field==='w'||field==='h'?.35:0} max={field==='x'?layout.room.width-node.w:field==='y'?layout.room.depth-node.h:field==='w'?layout.room.width:layout.room.depth} value={node[field]} onCommit={value=>property(field,value)}/>)}</div><div className="selected-actions"><Button onClick={()=>commit(rotateNode(latest.current,selected))}>Girar 90° ↻</Button><Button variant="ghost" onClick={remove}>Quitar ×</Button></div><Button variant="ghost" onClick={()=>svg.current.focus()}>Mover con teclado ↗</Button></div>:<p className="small-note">Elegí un mueble o departamento para moverlo, girarlo o cambiar su tamaño.</p>}
     <div className="sp-feedback"><p className="eyebrow">VOLVÉ A MIRAR</p><h3>¿Qué cambia?</h3><ul aria-live="polite">{messages.map((m,i)=><li className={m.clear?'feedback-clear':'feedback-observe'} key={i}><span aria-hidden="true">{m.clear?'✓':'↗'}</span>{m.text}</li>)}</ul><p className="small-note">Observaciones del esquema didáctico. La propuesta requiere medidas y revisión técnica para aplicarse a un local real.</p></div>
    </aside>
   </div>
   <div className="sp-editor-footer"><Field label="Mi decisión de diseño"><textarea rows="4" maxLength="8000" value={layout.note} placeholder="Moví… para que… Necesito comprobar…" onChange={event=>{const next={...latest.current,note:event.target.value};latest.current=next;setLayout(next);}}/></Field><div><h3>Llevate tu propuesta.</h3><div className="export-actions"><Button variant="primary" onClick={()=>{download(JSON.stringify(latest.current,null,2),'application/json','Mi_layout_Vidriera.json');announce('Guardá el archivo para continuar editándolo.');}}>Guardar editable ↓</Button><Button onClick={()=>fileRef.current.click()}>Abrir propuesta ↗</Button><Button onClick={exportPng}>PNG ↓</Button><Button onClick={exportSvg}>SVG ↓</Button></div><input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importJson}/><p className="small-note">El archivo editable conserva muebles, recorrido, croquis y observación. El taller se guarda por separado del curso.</p></div></div>
  </Surface>
  <section className="sp-workshop-lab" id="workshop-color"><div><p className="eyebrow">02 / EL COLOR ORGANIZA</p><h2>Una paleta.<br/>Muchas relaciones.</h2><p>Elegí una armonía, cambiá el color de cada prenda y reorganizá la colección. Observá cómo cambia su lectura.</p><span className="small-note">Simulación didáctica de color.</span></div><Surface className="lab-surface"><Activity type="color"/></Surface></section>
  <section className="sp-workshop-lab" id="workshop-composition"><div><p className="eyebrow">03 / EL PRODUCTO COMPONE</p><h2>Elegí dónde<br/>empieza la mirada.</h2><p>Compará criterios para la isla y ajustá la posición o el tamaño de cada grupo. Buscá una relación clara entre protagonista y apoyos.</p><span className="small-note">La isla conserva libros, tres perfumes y complementos.</span></div><Surface className="lab-surface"><Activity type="composition"/></Surface></section>
 </div>;
}
