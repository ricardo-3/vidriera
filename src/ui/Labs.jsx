import React,{useState,useSyncExternalStore} from 'react';
import {COMPOSITIONS,createPalette,groupColors,hexToHsl} from '../domain/activities.js';
import {LEARNING} from '../domain/data/learning.js';
import {Button,Slider} from './components.jsx';

const bound=(value,min,max,fallback)=>typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
const hex=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value);
const initialColor={base:'#637a73',mode:'analogous',colors:createPalette('#637a73','analogous')};
export function normalizeColor(value){
 const base=hex(value?.base)?value.base:initialColor.base,mode=['monochrome','analogous','complementary'].includes(value?.mode)?value.mode:'analogous';
 const colors=Array.isArray(value?.colors)&&value.colors.length===6&&value.colors.every(hex)?[...value.colors]:createPalette(base,mode);
 return {base,mode,colors};
}
export function normalizeComposition(value){
 const mode=Object.hasOwn(COMPOSITIONS,value?.mode)?value.mode:'focal',edits={};
 for(const [name,preset] of Object.entries(COMPOSITIONS))edits[name]=preset.groups.map((base,index)=>{const edit=value?.edits?.[name]?.[index],scale=bound(edit?.scale,.7,1.3,1);return {scale,x:bound(edit?.x,0,100-base.w*scale,base.x),y:bound(edit?.y,0,100-base.h*scale,base.y)};});
 return {mode,edits};
}
export function createLocalModel(key,initial,normalize){
 let snapshot,loaded=false;const listeners=new Set();
 const emit=()=>listeners.forEach(listener=>listener());
 const get=()=>{if(!loaded){loaded=true;try{snapshot=normalize(JSON.parse(localStorage.getItem(key)));}catch{snapshot=normalize(initial);}}return snapshot;};
 const external=event=>{if(event.key===key){try{snapshot=normalize(JSON.parse(event.newValue));loaded=true;emit();}catch{}}};
 return {get,server:()=>initial,subscribe(listener){if(!listeners.size&&typeof window!=='undefined')window.addEventListener('storage',external);listeners.add(listener);return()=>{listeners.delete(listener);if(!listeners.size&&typeof window!=='undefined')window.removeEventListener('storage',external);};},set(update){snapshot=normalize(typeof update==='function'?update(get()):update);loaded=true;try{localStorage.setItem(key,JSON.stringify(snapshot));}catch{}emit();},reset(){this.set(initial);}};
}
const colorModel=createLocalModel('vitrina-color-lab-v1',initialColor,normalizeColor);
const initialComposition=normalizeComposition(null),compositionModel=createLocalModel('vitrina-composition-v1',initialComposition,normalizeComposition);
function useModel(model){return [useSyncExternalStore(model.subscribe,model.get,model.server),model.set];}

function LabFrame({practice,id,children,onReset}){
 return <section className={practice?'practice-card':'interactive-activity'} aria-label={id==='S04'?'Práctica de composición':'Laboratorio de color'}>{practice?<><div className="practice-heading"><span className="eyebrow">TU TURNO</span><span>Práctica libre</span></div><p className="practice-task">{LEARNING[id].task}</p></>:<p className="activity-eyebrow">{id==='S04'?'ESQUEMA DE COMPOSICIÓN':'SIMULACIÓN DE EXHIBICIÓN'}</p>}{children}{practice&&<div className="practice-footer"><span>Probá y volvé a mirar.</span><Button variant="ghost" onClick={onReset}>Restablecer práctica ↶</Button></div>}</section>;
}
export function ColorLab({practice=false}){
 const [value,set]=useModel(colorModel),[selected,setSelected]=useState(0),[message,setMessage]=useState('');
 const descriptions={monochrome:'Un mismo matiz con cambios de claridad.',analogous:'Matices próximos en el círculo cromático.',complementary:'Dos familias de color opuestas en esta simulación.'};
 function harmony(mode){set(old=>({...old,mode,colors:createPalette(old.base,mode)}));setMessage('');}
 const description=hexToHsl(value.base).s<2?'Los tonos neutros no muestran una relación de matices. Probá un color más saturado.':descriptions[value.mode];
 return <LabFrame id="S07" practice={practice} onReset={()=>{colorModel.reset();setSelected(0);setMessage('Se restableció esta práctica. Tu avance se conserva.');}}><div className="color-base-control"><label>Color base <input type="color" aria-label="Elegir el color base de la colección" value={value.base} onChange={event=>{const base=event.target.value;set(old=>({...old,base,colors:createPalette(base,old.mode)}));setMessage('');}}/></label></div><div className="activity-options" role="group" aria-label="Armonía de la paleta">{[['monochrome','Monocromática'],['analogous','Análoga'],['complementary','Complementaria']].map(([mode,label])=><Button key={mode} aria-pressed={value.mode===mode} onClick={()=>harmony(mode)}>{label}</Button>)}</div><div className="color-rack" role="group" aria-label="Seleccionar una prenda para cambiar su color">{value.colors.map((color,index)=><button type="button" key={index} className="garment-button" aria-label={'Seleccionar prenda '+(index+1)} aria-pressed={selected===index} onClick={()=>{setSelected(index);setMessage('Prenda '+(index+1)+' seleccionada. Probá otro tono.');}}><svg viewBox="0 0 70 90" aria-hidden="true"><path d="M21 12L10 18L3 34L15 40L18 31L18 80L52 80L52 31L55 40L67 34L60 18L49 12Q35 25 21 12Z" fill={color} stroke="#62675c" strokeWidth="1"/></svg></button>)}</div><div className="garment-controls"><label>Color de la prenda {selected+1} <input type="color" aria-label="Cambiar el color de la prenda seleccionada" value={value.colors[selected]} onChange={event=>{const color=event.target.value;set(old=>({...old,colors:old.colors.map((item,index)=>index===selected?color:item)}));setMessage('Cambió el color de la prenda '+(selected+1)+'. Observá sus relaciones.');}}/></label><Button variant="ghost" onClick={()=>{set(old=>({...old,colors:groupColors(old.colors)}));setSelected(0);setMessage('La colección se agrupó por familias de color y claridad.');}}>Agrupar por color ↗</Button></div><p className="activity-result" aria-live="polite">{message||description+' Seleccioná una prenda para cambiarla.'}</p></LabFrame>;
}

export function CompositionLab({practice=false}){
 const [value,set]=useModel(compositionModel),[selected,setSelected]=useState(0),preset=COMPOSITIONS[value.mode],chosen=value.edits[value.mode][selected],base=preset.groups[selected];
 function edit(field,number){set(old=>({...old,edits:{...old.edits,[old.mode]:old.edits[old.mode].map((item,index)=>index===selected?{...item,[field]:number}:item)}}));}
 return <LabFrame id="S04" practice={practice} onReset={()=>{compositionModel.reset();setSelected(0);}}><div className="activity-options" role="group" aria-label="Criterio de composición">{[['focal','Protagonista'],['balance','Equilibrio'],['repetition','Repetición']].map(([mode,label])=><Button key={mode} aria-pressed={value.mode===mode} onClick={()=>{set(old=>({...old,mode}));setSelected(0);}}>{label}</Button>)}</div><div className="composition-board" role="group" aria-label="Seleccionar un grupo de productos sobre la isla">{preset.groups.map((group,index)=>{const edited=value.edits[value.mode][index];return <button className="composition-item" type="button" key={group.label} style={{left:edited.x+'%',top:edited.y+'%',width:group.w*edited.scale+'%',height:group.h*edited.scale+'%'}} aria-pressed={selected===index} aria-label={'Editar '+group.label} onClick={()=>setSelected(index)}>{group.label==='Perfumes'?'3 perfumes':group.label}</button>;})}</div><div className="composition-controls"><p>Ajustá: {base.label}</p><Slider label="Horizontal" value={chosen.x} max={100-base.w*chosen.scale} onChange={number=>edit('x',number)}/><Slider label="Vertical" value={chosen.y} max={100-base.h*chosen.scale} onChange={number=>edit('y',number)}/><Slider label="Tamaño relativo" value={chosen.scale} min={.7} max={1.3} step={.05} onChange={number=>edit('scale',number)}/></div><p className="activity-result" aria-live="polite">{preset.detail} Seleccioná un grupo para cambiar su posición o su tamaño.</p></LabFrame>;
}
