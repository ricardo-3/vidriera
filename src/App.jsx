import React, {useCallback, useEffect, useRef, useState} from 'react';
import DATA from './domain/data/course.js';
import {LEARNING} from './domain/data/learning.js';
import {emptyState,normalizeState,completeLesson,rejectLesson,readProgress,writeProgress} from './domain/progress.js';
import {parseRoute,resolveRoute,lessonUrl} from './domain/navigation.js';
import {practiceNotes} from './domain/lesson-activities.js';
import {presetLayout} from './domain/layout-model.js';
import {renderPlan} from './domain/layout-render.js';
import {Button,Surface,Dialog,Toast,MotionSection,useReducedMotion} from './ui/components.jsx';
import GuidedCourse from './ui/GuidedCourse.jsx';
import {LessonCards} from './ui/CoursePreview.jsx';
import {mayConfirm} from './domain/reading.js';
export {LessonContent} from './ui/GuidedCourse.jsx';
export {LessonCards} from './ui/CoursePreview.jsx';
import {StoreImage,StoreImageBase} from './ui/Scene.jsx';
import {download} from './ui/download.js';
import {storeImageUrl} from './domain/store-image.js';
import Workshop from './Workshop.jsx';

export const ORDER=DATA.lessons.map(lesson=>lesson.id);
export const COURSE_KEY='vitrina-course-v1';
function initialProgress(){try{return readProgress(localStorage,COURSE_KEY,ORDER,DATA.version);}catch{return {state:emptyState(DATA.version),available:false};}}
function locationRoute(){if(/\/taller\.html$/.test(location.pathname))return {page:'workshop'};return parseRoute(location.hash||location.pathname,ORDER);}
const pad=value=>String(value).padStart(2,'0');

function MapContent({onTour,onWorkshop}){
 const svg=useRef(null);
 useEffect(()=>{renderPlan(svg.current,presetLayout(),{width:440,interactive:false});},[]);
 return <div className="map-content"><div className="map-board"><svg ref={svg} aria-label="Planta de Vidriera: Mujer izquierda, Kids al fondo izquierdo y Hombre derecha" role="img"/></div><div><p className="lesson-lead">Un mismo local, en todo el recorrido.</p><p>Desde la entrada, Mujer queda a la izquierda; Kids continúa al fondo izquierdo y Hombre ocupa la derecha. Cada departamento conserva su propio calzado.</p><ul className="map-key"><li><span/>Mujer · colección y coordinación</li><li><span/>Kids · escala y organización</li><li><span/>Hombre · producto e iluminación</li></ul><Button variant="primary" onClick={onTour}>Explorar las vistas ↗</Button><Button onClick={onWorkshop}>Probar mi distribución ↗</Button><p className="small-note">Planta didáctica de 8 × 12 m. Las medidas del local no están verificadas.</p></div></div>;
}

export function TourContent({index,setIndex}){
 const imageId=DATA.route[index];
 return <><div className="tour-stage"><StoreImage imageId={imageId}/></div><div className="tour-navigation"><Button disabled={index===0} onClick={()=>setIndex(value=>value-1)}>← Anterior</Button><span role="status">{pad(index+1)} / {DATA.route.length}</span><Button variant="primary" disabled={index===DATA.route.length-1} onClick={()=>setIndex(value=>value+1)}>Siguiente →</Button></div><div className="tour-dots" aria-label="Elegir una vista">{DATA.route.map((id,i)=><button type="button" key={i} aria-label={'Vista '+(i+1)+': '+DATA.images[id].title} aria-current={i===index?'step':undefined} onClick={()=>setIndex(i)}/>)}</div><p className="small-note">Explorá las conexiones entre las zonas. Mirar el local no completa temas.</p></>;
}

export default function App({siteBase}){
 const [loaded]=useState(initialProgress),[state,setState]=useState(loaded.state),[rawRoute,setRawRoute]=useState(locationRoute),[modal,setModal]=useState(null),[modalOpen,setModalOpen]=useState(false),[tourIndex,setTourIndex]=useState(0),[message,setMessage]=useState(''),[saved,setSaved]=useState(loaded.available);
 const stateRef=useRef(state),mainRef=useRef(null),firstRoute=useRef(true),reduced=useReducedMotion();stateRef.current=state;
 const route=resolveRoute(rawRoute,state,ORDER),lesson=DATA.lessons.find(item=>item.id===route.id)||DATA.lessons[0],routeKey=route.page+(route.id||'');
 const announce=useCallback(text=>setMessage(text),[]),closeToast=useCallback(()=>setMessage(''),[]);
 const hrefFor=useCallback(target=>new URL(target.page==='lesson'?lessonUrl(target.id):target.page==='workshop'?'./taller.html':target.page==='home'?'./index.html':target.page==='entry'?'./index.html#course':target.page==='finish'?'./index.html#/cierre':'./index.html#/indice',siteBase).href,[siteBase]);
 const closeModal=()=>setModalOpen(false);
 function openModal(value){setModal(value);setModalOpen(true);}
 function navigate(target,progress=stateRef.current,replace=false){const resolved=resolveRoute(target,progress,ORDER);history[replace?'replaceState':'pushState']({},'',hrefFor(resolved));setRawRoute(resolved);setModalOpen(false);if(resolved.redirected)announce('Primero completá el tema disponible para abrir el siguiente.');}
 function onNavigate(event,target){if(event&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button>0))return;event?.preventDefault();navigate(target);}
 function complete(lesson,reachedEnd=false){if(!mayConfirm({page:route.page,activeId:route.id,requestedId:lesson.id,reachedEnd,completed:stateRef.current.completed}))return;const next=completeLesson(stateRef.current,lesson.id,ORDER);setState(next);const index=ORDER.indexOf(lesson.id);navigate(index===ORDER.length-1?{page:'finish'}:{page:'lesson',id:ORDER[index+1]},next);announce('Tema '+(index+1)+' completado. '+(index===10?'Tu cierre está listo.':'Continuás con '+DATA.lessons[index+1].title+'.'));}
 function review(lesson){setState(old=>rejectLesson(old,lesson.id,ORDER));}
 useEffect(()=>{document.getElementById('boot-loader')?.remove();const change=()=>setRawRoute(locationRoute());window.addEventListener('popstate',change);window.addEventListener('hashchange',change);return()=>{window.removeEventListener('popstate',change);window.removeEventListener('hashchange',change);};},[]);
 useEffect(()=>{try{setSaved(writeProgress(localStorage,COURSE_KEY,state));}catch{setSaved(false);}},[state]);
 useEffect(()=>{const sync=event=>{if(event.key===COURSE_KEY){try{setState(normalizeState(JSON.parse(event.newValue),ORDER,DATA.version));}catch{}}};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>{
  document.title=(route.page==='lesson'?lesson.title:route.page==='workshop'?'El taller':route.page==='finish'?'Mi cierre':route.page==='overview'?'Los once temas':'Aprendé a mirar una tienda')+' · Vidriera';
  if(route.page==='lesson'){
   setState(old=>old.lastLesson===lesson.id?old:{...old,lastLesson:lesson.id});
   if(location.href!==hrefFor(route))history.replaceState({},'',hrefFor(route));
  }
  const anchor=route.page==='workshop'?({color:'workshop-color',composition:'workshop-composition',layout:'layout',recorrido:'layout'}[location.hash.slice(1)]):route.anchor==='about'?'about':null;
  if(anchor)requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView({behavior:reduced?'instant':'smooth'}));
  else if(!firstRoute.current)window.scrollTo({top:0,behavior:'instant'});
  if(!firstRoute.current)mainRef.current?.focus({preventScroll:true});firstRoute.current=false;
 },[routeKey,route.anchor]);
 const count=state.completed.length,atHome=route.page==='home',atOverview=route.page==='overview';
 return <StoreImageBase.Provider value={siteBase}>
  <div id="app-shell" className={'app-shell page-'+route.page}>
   <a className="skip-link" href="#main-content" onClick={event=>{event.preventDefault();mainRef.current?.focus();}}>Saltar al contenido</a>
   <header className="site-header">
    <a className="wordmark" href={hrefFor({page:'home'})} onClick={event=>onNavigate(event,{page:'home'})} aria-label="Vidriera, inicio"><strong>VIDRIERA</strong></a>
    <span className="header-subtitle">Una tienda. Muchas formas de mirar.</span>
    <nav aria-label="Navegación principal">
     <Button as="a" variant="ghost" href={hrefFor({page:'entry'})} onClick={event=>onNavigate(event,{page:'entry'})} aria-current={['lesson','overview','finish'].includes(route.page)?'page':undefined}>Curso VM</Button>
     <Button className="explore-nav" variant="ghost" aria-haspopup="dialog" aria-expanded={modalOpen&&modal?.kind==='tour'} onClick={()=>openModal({kind:'tour'})}>Explora el local</Button>
     <Button as="a" variant="ghost" href={hrefFor({page:'workshop'})} onClick={event=>onNavigate(event,{page:'workshop'})} aria-current={route.page==='workshop'?'page':undefined}>El taller <span aria-hidden="true">↗</span></Button>
     <span className="header-progress" aria-label={count+' de 11 temas completados'}>{pad(count)}<span> / 11</span></span>
    </nav>
   </header>
   <main id="main-content" tabIndex={-1} ref={mainRef}>
    <MotionSection motionKey={routeKey} motion="fade">
     {(atHome||atOverview)&&<div className="home-page">
      {atHome&&<section className="home-hero"><img className="hero-atmosphere" src={storeImageUrl(DATA.images['IMG-02'].src,siteBase)} alt="" aria-hidden="true"/><div className="hero-photo"><StoreImage imageId="IMG-02" priority/></div><Surface className="hero-card"><p className="eyebrow">VISUAL MERCHANDISING · CON RICARDO ROMERO MEDINA</p><h1>Aprendé a mirar<br/>una tienda.</h1><p>El espacio, el producto, el color y la luz. Descubrí cómo cada decisión construye una experiencia.</p><div className="hero-actions"><Button as="a" variant="primary" href={hrefFor({page:'lesson',id:ORDER[0]})} onClick={event=>onNavigate(event,{page:'lesson',id:ORDER[0]})}>Empezar el curso ↗</Button><Button onClick={()=>openModal({kind:'tour'})}>Explora el local</Button></div><div className="hero-metadata"><span>11 temas</span><span>Prácticas interactivas</span><span>A tu ritmo</span></div></Surface><div className="hero-bottom"><span>EL LOCAL VIDRIERA</span><Button variant="glass" onClick={()=>openModal({kind:'map'})}>Ver distribución ↗</Button></div></section>}
      <section className="overview-section"><div className="section-heading"><div><p className="eyebrow">OBSERVAR · ENTENDER · PROBAR</p><h1 hidden={!atOverview}>Tu recorrido.</h1><h2 hidden={atOverview}>Once miradas.<br/>Una misma tienda.</h2></div><div className="overview-progress"><p>{count} de 11 temas completados</p><div className="progress-track" role="progressbar" aria-label="Avance del curso" aria-valuemin="0" aria-valuemax="11" aria-valuenow={count}><span style={{width:count/11*100+'%'}}/></div><p className="small-note">Los temas se recorren en orden. Al llegar al final, confirmás para continuar.</p></div></div>{atOverview?<><LessonCards compact state={state} hrefFor={hrefFor} onNavigate={onNavigate}/><Button variant="primary" onClick={()=>navigate({page:'entry'})}>Continuar mi recorrido →</Button></>:<Button variant="ghost" className="preview-discreet-button" onClick={()=>openModal({kind:'index'})}>Vista previa · 11 temas <span aria-hidden="true">↗</span></Button>}{count===11&&<Button variant="primary" onClick={()=>navigate({page:'finish'})}>Ver mi cierre y descargar notas ↗</Button>}</section>
      <Surface className="workshop-teaser"><div><p className="eyebrow">DEL RECORRIDO A TUS IDEAS</p><h2>Ahora te toca<br/>diseñar.</h2><p>Mové el mobiliario, dibujá un recorrido y probá relaciones de color y composición.</p></div><div className="teaser-plan"><svg viewBox="0 0 300 230" aria-hidden="true"><rect x="25" y="15" width="250" height="195" rx="14"/><rect x="40" y="85" width="65" height="100" rx="10"/><rect x="40" y="30" width="80" height="45" rx="10"/><rect x="195" y="60" width="65" height="125" rx="10"/><rect x="136" y="100" width="32" height="60" rx="7"/><path d="M150 210L120 180L120 80L178 80L178 190L150 210"/></svg></div><Button as="a" variant="primary" href={hrefFor({page:'workshop'})} onClick={event=>onNavigate(event,{page:'workshop'})}>Abrir el taller ↗</Button></Surface>
      <section className="about-course" id="about"><p className="eyebrow">APRENDER CON EL LOCAL</p><h2>Una idea.<br/>Un lugar donde observarla.</h2><p>Vidriera conecta principios de Visual Merchandising con decisiones concretas dentro de una misma tienda. Las prácticas y las confirmaciones te ayudan a revisar tu comprensión, sin calificación.</p></section>
     </div>}
     <div className="chapter-page" hidden={route.page!=='lesson'}><GuidedCourse lesson={lesson} state={state} active={route.page==='lesson'} onComplete={complete} onReview={review} onExpand={id=>openModal({kind:'image',id})} onMap={()=>openModal({kind:'map'})} onPreview={()=>openModal({kind:'index'})}/></div>
     <div hidden={route.page!=='workshop'}><Workshop announce={announce}/></div>
     {route.page==='finish'&&<section className="finish-page"><Surface className="finish-card"><span className="check-orbit" aria-hidden="true">✓</span><p className="eyebrow">ONCE TEMAS. UNA NUEVA FORMA DE MIRAR.</p><h1>Tu mirada<br/>sigue creciendo.</h1><p>Elegí una decisión de esta tienda que mejorarías. ¿Qué cambiarías y por qué?</p><label className="sp-field"><span>Mi observación final</span><textarea maxLength="12000" rows="6" value={state.reflection} placeholder="Observo que… Propondría… porque…" onChange={event=>setState(old=>({...old,reflection:event.target.value}))}/></label><div className="finish-actions"><Button variant="primary" onClick={()=>{const lines=['MI RECORRIDO EN VIDRIERA','Curso de Ricardo Romero Medina','',...DATA.lessons.filter(l=>state.completed.includes(l.id)).map(l=>'✓ '+l.order+'. '+l.title),'','MI OBSERVACIÓN',state.reflection||'Sin observación escrita.',...practiceNotes()];download(lines.join('\n'),'text/plain;charset=utf-8','Mi_recorrido_Vidriera.txt');announce('Tu recorrido está preparado para descargar.');}}>Descargar mi recorrido ↓</Button><Button onClick={()=>navigate({page:'overview'})}>Volver a los temas ↗</Button></div><p className="small-note" role="status">{saved?'Tu avance y tu observación se guardan en este navegador.':'El navegador no permite guardar. Descargá tus notas para conservarlas.'}</p></Surface></section>}
    </MotionSection>
   </main>
   {!saved&&<p className="storage-notice" role="status">El guardado local no está disponible. Podés continuar durante esta sesión y descargar tus notas.</p>}
   <footer className="site-footer"><span className="wordmark"><strong>VIDRIERA</strong></span><p>Visual Merchandising · Ricardo Romero Medina</p><Button variant="ghost" onClick={()=>openModal({kind:'reset'})}>Reiniciar mi recorrido</Button></footer>
  </div>
  <Dialog open={modalOpen} onClose={closeModal} wide={!['reset','index'].includes(modal?.kind)} title={modal?.kind==='index'?'Una vista del recorrido':modal?.kind==='map'?'Cómo se organiza Vidriera':modal?.kind==='tour'?DATA.images[DATA.route[tourIndex]].title:modal?.kind==='image'?DATA.images[modal.id].title:'¿Empezar de nuevo?'} eyebrow={modal?.kind==='tour'?'EXPLORAR EL LOCAL':'VIDRIERA / VISUAL MERCHANDISING'}>
   {modal?.kind==='index'&&<><p>Una miniatura de cada mirada. Solo los temas completados se pueden volver a abrir.</p><LessonCards compact state={state} hrefFor={hrefFor} onNavigate={onNavigate}/><div className="dialog-actions"><Button onClick={()=>navigate({page:'entry'})}>Volver a mi recorrido →</Button><Button onClick={()=>navigate({page:'workshop'})}>Abrir el taller ↗</Button></div></>}
   {modal?.kind==='map'&&<MapContent onTour={()=>openModal({kind:'tour'})} onWorkshop={()=>navigate({page:'workshop'})}/>}
   {modal?.kind==='tour'&&<TourContent index={tourIndex} setIndex={setTourIndex}/>}
   {modal?.kind==='image'&&<><div className="lightbox-stage"><StoreImage imageId={modal.id}/></div><p className="small-note">{DATA.images[modal.id].alt}</p></>}
   {modal?.kind==='reset'&&<><p>Se borrarán el avance y la observación del curso guardados en este navegador. Tus prácticas y tu propuesta del taller se conservan.</p><div className="dialog-actions"><Button variant="danger" onClick={()=>{const next=emptyState(DATA.version);setState(next);navigate({page:'home'},next);announce('Tu recorrido comienza de nuevo.');}}>Sí, reiniciar curso</Button><Button onClick={closeModal}>Conservar mi avance</Button></div></>}
  </Dialog>
  <Toast message={message} onClose={closeToast}/>
 </StoreImageBase.Provider>;
}
