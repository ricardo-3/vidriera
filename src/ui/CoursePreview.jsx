import React,{useContext} from 'react';
import DATA from '../domain/data/course.js';
import {previewIsSelectable} from '../domain/reading.js';
import {storeImageUrl} from '../domain/store-image.js';
import {StoreImageBase} from './Scene.jsx';

export function LessonCards({state,hrefFor,onNavigate,compact=false,allowReview=true}){
 const base=useContext(StoreImageBase);
 return <ol className={'lesson-previews '+(compact?'lesson-previews--compact':'')} aria-label="Vista previa de los once temas">{DATA.lessons.map((lesson,index)=>{
  const done=previewIsSelectable(state,lesson.id),current=index===state.completed.length,status=done?'Completado · volver a mirar':current?'Tu próximo tema':'Más adelante';
  const content=<><img src={storeImageUrl(DATA.images[lesson.primary].src,base)} alt="" width="1600" height="900" loading="lazy"/><span className="preview-number">{String(index+1).padStart(2,'0')}</span><span className="preview-copy"><strong>{lesson.title}</strong><span>{status}</span></span><span className="preview-status" aria-hidden="true">{done?'✓':current?'·':'○'}</span></>;
  return <li key={lesson.id} className={'lesson-preview '+(done?'is-completed':current?'is-current':'is-pending')}>{done&&allowReview?<a href={hrefFor({page:'lesson',id:lesson.id})} onClick={event=>onNavigate(event,{page:'lesson',id:lesson.id})} aria-label={'Volver al tema '+(index+1)+': '+lesson.title}>{content}</a>:<div>{content}</div>}</li>;
 })}</ol>;
}
