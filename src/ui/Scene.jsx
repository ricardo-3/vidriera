import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import DATA from '../domain/data/course.js';
import {LEARNING} from '../domain/data/learning.js';
import {HOTSPOTS} from '../domain/data/hotspots.js';
import {Button, FloatingDetail, IconButton, Slider, useReducedMotion} from './components.jsx';
import {prepareStoreImage,storeImageUrl} from '../domain/store-image.js';

export const StoreImageBase=createContext(null);

export function StoreImage({imageId,className='',priority=false,onReady}){
 const base=useContext(StoreImageBase),source=storeImageUrl(DATA.images[imageId].src,base);
 const reduced=useReducedMotion(),[layers,setLayers]=useState({current:null,previous:null}),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  setFailed(false);
  return prepareStoreImage(source,{
   createImage:()=>{const image=new Image();image.fetchPriority=priority?'high':'auto';return image;},
   onReady:src=>setLayers(old=>({current:{id:imageId,src},previous:!reduced&&old.current?.id!==imageId?old.current:null})),
   onError:()=>setFailed(true)
  });
 },[imageId,source,reduced,attempt,priority]);
 useEffect(()=>{if(!layers.previous)return;const timer=setTimeout(()=>setLayers(old=>({...old,previous:null})),700);return()=>clearTimeout(timer);},[layers.current,layers.previous]);
 useEffect(()=>{onReady?.(layers.current?.id||null);},[layers.current,onReady]);
 const loading=!failed&&layers.current?.id!==imageId;
 return <div className={'store-image '+className} data-image-id={imageId} data-loading={loading} aria-busy={loading}>
  {layers.previous&&<img className="store-image-previous" src={layers.previous.src} alt="" aria-hidden="true"/>}
  {layers.current&&<img className={layers.previous?'store-image-current is-arriving':'store-image-current'} key={layers.current.id} src={layers.current.src} alt={DATA.images[layers.current.id].alt} width="1600" height="900" fetchPriority={priority?'high':'auto'} onError={()=>{setLayers({current:null,previous:null});setFailed(true);}}/>}
  {loading&&<p className="image-loading" role="status">Cargando vista…</p>}
  {failed&&<div className="image-error" role="status"><p>No se pudo cargar esta vista.</p><Button onClick={()=>setAttempt(value=>value+1)}>Reintentar foto ↻</Button></div>}
 </div>;
}

export function Scene({lesson,onExpand,onMap,readingPoint=null}){
 const base=useContext(StoreImageBase),sourceFor=id=>storeImageUrl(DATA.images[id].src,base);
 function pointDetail(index){const point=HOTSPOTS[lesson.primary][index];return {key:lesson.id+'-'+index,index:String(index+1).padStart(2,'0'),title:point.label,text:LEARNING[lesson.id].detail[index]};}
 const [scene,setScene]=useState(lesson.id),[view,setView]=useState(lesson.primary),[detail,setDetail]=useState(()=>pointDetail(0)),[compare,setCompare]=useState(false),[split,setSplit]=useState(50),[ready,setReady]=useState(null),frame=useRef(null),drag=useRef(null);
 const comparison=DATA.comparisons[lesson.id];
 const sameLesson=scene===lesson.id,activeView=sameLesson?view:lesson.primary,comparing=sameLesson&&compare&&Boolean(comparison);
 useEffect(()=>{setScene(lesson.id);setView(lesson.primary);setDetail(pointDetail(0));setCompare(false);setSplit(50);},[lesson.id,lesson.primary]);
 useEffect(()=>{
  if(readingPoint===null)return;
  const point=HOTSPOTS[lesson.primary][readingPoint];if(!point)return;
  setView(lesson.primary);setCompare(false);setDetail(pointDetail(readingPoint));
 },[lesson.id,readingPoint]);
 const imageId=comparing?comparison.before:activeView,asset=DATA.images[imageId];
 const isPrimary=activeView===lesson.primary;
 function chooseView(id){setView(id);setCompare(false);setDetail(id===lesson.primary?pointDetail(0):null);}
 function closeDetail(){const opener=frame.current?.querySelector('[aria-expanded="true"]');setDetail(null);opener?.focus({preventScroll:true});}
 function comparePointer(event){const bounds=frame.current.getBoundingClientRect();if(bounds.width)setSplit(Math.round(Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100))));}
 function compareKey(event){const steps={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1,PageDown:-10,PageUp:10};if(event.key==='Home'){event.preventDefault();setSplit(0);}else if(event.key==='End'){event.preventDefault();setSplit(100);}else if(steps[event.key]){event.preventDefault();setSplit(value=>Math.max(0,Math.min(100,value+steps[event.key]*(event.shiftKey?10:1))));}}
 return <div className="scene-column">
  <section className="scene-stage" aria-label={'Explorar '+lesson.zone}>
   <img className="scene-atmosphere" src={sourceFor(imageId)} alt="" aria-hidden="true"/>
   <div className="scene-topline"><span className="scene-location"><span className="status-dot"/>{lesson.zone}</span><div><IconButton label="Ver distribución del local" onClick={onMap} variant="glass">⌘</IconButton><IconButton label="Ampliar imagen completa" onClick={()=>onExpand(imageId)} variant="glass">↗</IconButton></div></div>
   <div className="scene-frame" ref={frame}>
    <div className="image-plane">
     <StoreImage imageId={imageId} priority onReady={setReady}/>
     {comparing&&<><div className="comparison-overlay" style={{clipPath:`inset(0 0 0 ${split}%)`}}><img src={sourceFor(comparison.after)} alt={DATA.images[comparison.after].alt}/></div><div className="comparison-line" style={{left:split+'%'}}><button type="button" className="comparison-handle" role="slider" aria-label="Comparar las dos vistas de la tienda" aria-valuemin={0} aria-valuemax={100} aria-valuenow={split} onKeyDown={compareKey} onPointerDown={event=>{drag.current=event.pointerId;event.currentTarget.setPointerCapture(event.pointerId);event.preventDefault();comparePointer(event);}} onPointerMove={event=>{if(drag.current===event.pointerId){event.preventDefault();comparePointer(event);}}} onPointerUp={event=>{if(drag.current===event.pointerId){drag.current=null;event.currentTarget.releasePointerCapture(event.pointerId);}}} onPointerCancel={()=>{drag.current=null;}}><span aria-hidden="true">↔</span></button></div></>}
     {!comparing&&isPrimary&&<div className="image-hotspots" hidden={ready!==imageId} aria-label="Puntos para observar">{HOTSPOTS[lesson.primary].map((point,i)=><button key={lesson.id+'-'+i} className="hotspot" style={{left:point.x*100+'%',top:point.y*100+'%'}} aria-label={'Observar '+point.label} aria-controls="scene-detail" aria-expanded={sameLesson&&detail?.key===lesson.id+'-'+i} onClick={()=>setDetail(pointDetail(i))}><span>{i+1}</span></button>)}</div>}
    </div>
   </div>
   <div className="scene-bottomline"><span>{asset.title}</span><span>VIDRIERA / {lesson.id}</span></div>
  </section>
  <div className="scene-tools">
   <div className="related-views" aria-label="Elegir vista de la tienda">{[lesson.primary,...lesson.related].map(id=><button key={id} type="button" aria-label={DATA.images[id].title} aria-pressed={!comparing&&activeView===id} onClick={()=>chooseView(id)}><img src={sourceFor(id)} alt=""/><span>{id===lesson.primary?'Vista principal':DATA.images[id].title}</span></button>)}</div>
   {comparison&&<Button variant={comparing?'primary':'secondary'} aria-pressed={comparing} onClick={()=>{setCompare(!comparing);setDetail(null);}}>↔ Comparar vistas</Button>}
  </div>
  <div className="scene-inspector"><div hidden={comparing}><FloatingDetail id="scene-detail" content={sameLesson?detail:pointDetail(0)} onClose={closeDetail}/></div><div hidden={!comparing}>{comparison&&<div className="comparison-controls sp-surface"><div className="comparison-labels"><span>{comparison.beforeLabel}</span><span>{comparison.afterLabel}</span></div><Slider label="Deslizá para comparar" value={split} onChange={setSplit}/><p>{comparison.caption}{lesson.id==='S07'&&' Es una comparación conceptual: también cambian algunas prendas y cantidades.'}</p></div>}</div></div>
 </div>;
}
