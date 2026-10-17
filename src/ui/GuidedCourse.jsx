import React,{useEffect,useRef,useState} from 'react';
import DATA from '../domain/data/course.js';
import {LEARNING} from '../domain/data/learning.js';
import {readingProgress} from '../domain/reading.js';
import {Button,Surface,useReducedMotion} from './components.jsx';
import {Practice} from './Practice.jsx';
import {Scene} from './Scene.jsx';

const pad=value=>String(value).padStart(2,'0');
export function LessonContent({lesson,active=false,reachedEnd=false,done=false,onReachedEnd,onComplete,onReview,onPreview,onReading}){
 const article=useRef(null),end=useRef(null),reduced=useReducedMotion(),extra=LEARNING[lesson.id];
 useEffect(()=>{
  if(!active||!article.current)return;
  let frame=0;const element=article.current;
  function measure(){
   frame=0;const r=element.getBoundingClientRect(),height=window.innerHeight;
   const sections=[...element.querySelectorAll('[data-reading-step]')];let step=0;
   for(const [index,node] of sections.entries())if(node.getBoundingClientRect().top<height*.6)step=index;
   let point=null;if(step===0)for(const node of element.querySelectorAll('[data-observation]')){const box=node.getBoundingClientRect();if(box.top<height*.72&&box.bottom>100)point=Number(node.dataset.observation);}
   onReading({id:lesson.id,percent:readingProgress(r.top,r.bottom,height),step,point});
   if(end.current.getBoundingClientRect().top<=height-28&&element.getClientRects().length&&document.visibilityState!=='hidden')onReachedEnd(lesson.id);
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const finish=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)&&element.getClientRects().length&&document.visibilityState!=='hidden')onReachedEnd(lesson.id);},{threshold:0,rootMargin:'0px 0px -28px 0px'});
  finish.observe(end.current);
  const entered=new WeakSet(),reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&!entered.has(entry.target)){entered.add(entry.target);if(!reduced&&entry.target.animate)entry.target.animate([{opacity:.1,transform:'translateY(22px)',filter:'blur(4px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:700,easing:'cubic-bezier(.16,1,.3,1)'});reveal.unobserve(entry.target);}},{threshold:.08});
  for(const node of element.querySelectorAll('[data-reading-step],[data-observation]'))reveal.observe(node);
  const size=new ResizeObserver(schedule);size.observe(element);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();
  return()=>{cancelAnimationFrame(frame);finish.disconnect();reveal.disconnect();size.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
 },[active,lesson.id,reduced,onReachedEnd,onReading]);
 function review(){onReview();article.current?.querySelector('[data-reading-step="idea"]')?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});}
 return <article className="lesson-journey" ref={article} aria-label={'Recorrido del tema: '+lesson.title}>
  <Surface className="journey-section journey-look" data-reading-step="look" aria-labelledby={lesson.id+'-look-title'}><div className="journey-step-label"><span>01</span><span>OBSERVÁ</span><span aria-hidden="true">↓</span></div><h2 id={lesson.id+'-look-title'}>{extra.lead}</h2><p className="lesson-objective">{lesson.objective}</p><ol className="journey-observations">{lesson.observe.map((text,i)=><li key={text} data-observation={i}><span className="observation-number">{pad(i+1)}</span><div><h3>{text}</h3><p>{extra.detail[i]}</p></div></li>)}</ol><div className="soft-callout"><span className="eyebrow">QUEDATE CON ESTA IDEA</span><p>{extra.takeaway}</p></div><p className="journey-scroll-cue">Seguí bajando para entender la idea <span aria-hidden="true">↓</span></p></Surface>
  <Surface className="journey-section journey-idea" data-reading-step="idea" aria-labelledby={lesson.id+'-idea-title'}><div className="journey-step-label"><span>02</span><span>ENTENDÉ</span><span aria-hidden="true">↓</span></div><h2 id={lesson.id+'-idea-title'}>La idea detrás<br/>de lo que ves.</h2><p className="lesson-body">{lesson.body}</p><div className="soft-callout"><span className="eyebrow">EN ESTA TIENDA</span><p>{extra.example}</p></div><div className="journey-mistake"><span className="eyebrow">UN ERROR PARA EVITAR</span><p>{extra.mistake}</p></div><details className="lesson-details"><summary>Fuente del tema <span aria-hidden="true">+</span></summary><div><p>{lesson.sources.join(' · ')}</p></div></details><p className="journey-scroll-cue">Ahora probá con el local <span aria-hidden="true">↓</span></p></Surface>
  <Surface className="journey-section journey-practice" data-reading-step="practice" aria-labelledby={lesson.id+'-practice-title'}><div className="journey-step-label"><span>03</span><span>PROBÁ</span><span aria-hidden="true">↓</span></div><h2 id={lesson.id+'-practice-title'}>Mirar también<br/>es experimentar.</h2><Practice id={lesson.id}/><div className="journey-review"><span className="eyebrow">PARA VOLVER A MIRAR</span><p>{extra.review}</p></div></Surface>
  <div ref={end} className="journey-end-sentinel" aria-hidden="true"/>
  <Surface className="journey-completion" aria-labelledby={lesson.id+'-check-title'}><span className="check-orbit" aria-hidden="true">{done?'✓':'↗'}</span><p className="eyebrow">EL FINAL DE ESTA MIRADA</p><h2 id={lesson.id+'-check-title'}>{lesson.question}</h2><p>Una pausa para revisar lo aprendido. Tu confirmación guía el recorrido, sin calificación.</p>{done&&<p className="completion-note">✓ Ya completaste este tema. Tu avance se conserva.</p>}<div className="journey-continue-slot">{reachedEnd||done?<div className="check-actions"><Button variant="primary" onClick={()=>onComplete(lesson,true)}>{done?'Continuar el recorrido':'Sí, entendí · continuar'} →</Button><Button variant="ghost" onClick={review}>Quiero volver a mirar ↶</Button></div>:<p className="journey-awaiting" role="status">Recorré el tema hasta aquí para continuar.</p>}</div><p className="journey-next-label">{DATA.lessons[lesson.order]?'SIGUE / '+DATA.lessons[lesson.order].title:'SIGUE / TU CIERRE DEL RECORRIDO'}</p>{(reachedEnd||done)&&<details className="course-preview-disclosure journey-preview"><summary>Ver miniaturas del recorrido <span aria-hidden="true">+</span></summary><p>Los temas futuros son una vista previa. Podés volver a los que ya completaste.</p><Button variant="ghost" onClick={onPreview}>Abrir vista previa ↗</Button></details>}</Surface>
 </article>;
}

export default function GuidedCourse({lesson,state,active,onComplete,onReview,onExpand,onMap,onPreview}){
 const [ends,setEnds]=useState({}),[reading,setReading]=useState({id:null,percent:0,step:0,point:null});
 const reached=React.useCallback(id=>setEnds(old=>old[id]?old:{...old,[id]:true}),[]),read=React.useCallback(value=>setReading(old=>JSON.stringify(old)===JSON.stringify(value)?old:value),[]);
 const current=reading.id===lesson.id?reading:{percent:0,step:0,point:null};
 return <>
  <div className="chapter-toolbar"><span className="eyebrow">RECORRIDO GUIADO / TEMA {pad(lesson.order)} DE 11</span><Button variant="ghost" onClick={onMap}>El plano ↗</Button></div>
  <div className="chapter-heading"><div><p className="eyebrow">{lesson.zone}</p><h1>{lesson.title}</h1></div><p className="guided-intro">Un tema. Tres momentos.<br/>Deslizá para observar, entender y probar.</p></div>
  <div className="guided-layout"><div className="guided-scene"><Scene lesson={lesson} onExpand={onExpand} onMap={onMap} readingPoint={current.point}/><Surface className="reading-tracker" aria-label="Lectura del tema"><div className="reading-stages">{['Observá','Entendé','Probá'].map((label,index)=><span key={label} className={current.step===index?'is-active':''} aria-current={current.step===index?'step':undefined}><i/>{label}</span>)}</div><div className="progress-track" role="progressbar" aria-label="Recorrido del tema activo" aria-valuemin={0} aria-valuemax={100} aria-valuenow={current.percent}><span style={{width:current.percent+'%'}}/></div><p>{current.percent<100?'Seguí bajando. El próximo tema aparece al terminar.':'Llegaste al final. Confirmá para continuar.'}</p></Surface></div><div className="guided-reading">{DATA.lessons.map(item=><div key={item.id} hidden={item.id!==lesson.id}><LessonContent lesson={item} active={active&&item.id===lesson.id} reachedEnd={Boolean(ends[item.id])} done={state.completed.includes(item.id)} onReachedEnd={reached} onReading={read} onComplete={(target,atEnd)=>{if(ends[target.id]||state.completed.includes(target.id))onComplete(target,atEnd);}} onReview={()=>onReview(item)} onPreview={onPreview}/></div>)}</div></div>
 </>;
}
