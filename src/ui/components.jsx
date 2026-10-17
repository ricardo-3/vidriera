import React, {forwardRef, useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

export function useReducedMotion(){
 const [reduced,setReduced]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduced(q.matches);q.addEventListener('change',change);return()=>q.removeEventListener('change',change);},[]);
 return reduced;
}

export function usePresence(open){
 const reduced=useReducedMotion(),[mounted,setMounted]=useState(open),[visible,setVisible]=useState(false);
 useEffect(()=>{
  let frame,second,timer;
  if(open){setMounted(true);frame=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>setVisible(true));});}
  else{setVisible(false);timer=setTimeout(()=>setMounted(false),reduced?0:280);}
  return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(second);clearTimeout(timer);};
 },[open,reduced]);
 return {mounted,visible};
}

export const Button=forwardRef(function Button({variant='secondary',className='',children,as:Tag='button',...props},ref){
 return <Tag ref={ref} type={Tag==='button'?'button':undefined} className={`sp-button sp-button--${variant} ${className}`} {...props}>{children}</Tag>;
});

export function Surface({as:Tag='section',tone='light',className='',children,...props}){
 return <Tag className={`sp-surface sp-surface--${tone} ${className}`} {...props}>{children}</Tag>;
}

export function Tooltip({label,children}){
 const [open,setOpen]=useState(false),timer=useRef(null),presence=usePresence(open),id=useId();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const show=()=>{clearTimeout(timer.current);timer.current=setTimeout(()=>setOpen(true),220);};
 const hide=()=>{clearTimeout(timer.current);setOpen(false);};
 return <span className="sp-tooltip-anchor" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} aria-describedby={open?id:undefined}>{children}{presence.mounted&&<span id={id} role="tooltip" data-visible={presence.visible} className="sp-tooltip">{label}</span>}</span>;
}

export function IconButton({label,children,className='',...props}){
 return <Tooltip label={label}><Button className={'sp-icon-button '+className} aria-label={label} {...props}>{children}</Button></Tooltip>;
}

export function Tabs({value,onChange,items,label='Elegir apartado',className=''}){
 const refs=useRef([]);
 function key(event,index){let next=index;if(event.key==='ArrowRight')next=(index+1)%items.length;else if(event.key==='ArrowLeft')next=(index+items.length-1)%items.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=items.length-1;else return;event.preventDefault();onChange(items[next].value);refs.current[next]?.focus();}
 return <div role="tablist" aria-label={label} className={'sp-tabs '+className}>{items.map((item,i)=><button type="button" role="tab" id={item.id} aria-controls={item.controls} aria-selected={value===item.value} tabIndex={value===item.value?0:-1} key={item.value} ref={node=>refs.current[i]=node} onKeyDown={event=>key(event,i)} onClick={()=>onChange(item.value)}>{item.label}</button>)}</div>;
}

export function Field({label,children,className='',...props}){
 return <label className={'sp-field '+className}><span>{label}</span>{children||<input {...props}/>}</label>;
}

export function Slider({label,value,onChange,min=0,max=100,step=1,output,...props}){
 return <label className="sp-slider"><span>{label}{output&&<output>{output}</output>}</span><input type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))} {...props}/></label>;
}

export function MotionSection({children,motionKey,motion='lift',className='',...props}){
 const ref=useRef(null),reduced=useReducedMotion();
 useEffect(()=>{if(!reduced&&ref.current?.animate){const frames=motion==='fade'?[{opacity:.15},{opacity:1}]:[{opacity:.15,transform:'translateY(12px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}];const animation=ref.current.animate(frames,{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});return()=>animation.cancel();}},[motionKey,reduced,motion]);
 return <div ref={ref} className={className} {...props}>{children}</div>;
}

export function FloatingDetail({content,onClose,id}){
 const textRef=useRef(null),reduced=useReducedMotion();
 const current=content||{key:'empty',index:'—',title:'Una pista para mirar',text:'Los puntos de la imagen acompañan la lectura. Podés seleccionarlos para volver a mirar un detalle.'};
 useEffect(()=>{
  if(reduced||!textRef.current?.animate)return;
  const animation=textRef.current.animate([{opacity:.2},{opacity:1}],{duration:260,easing:'ease-out'});
  return()=>animation.cancel();
 },[current.key,reduced]);
 // This panel never mounts/unmounts or changes height while the reader scrolls.
 return <Surface as="aside" tone="light" id={id} className="sp-scene-detail" data-filled={Boolean(content)} role="region" aria-label="Detalle de la escena" onKeyDown={event=>{if(event.key==='Escape'&&content){event.preventDefault();onClose();}}}><div className="scene-detail-heading"><span className="scene-detail-number">{current.index}<small> / 03</small></span><h3>{current.title}</h3><IconButton label="Cerrar detalle" variant="ghost" disabled={!content} onClick={onClose}>×</IconButton></div><div className="scene-detail-copy" ref={textRef}><p>{current.text}</p></div></Surface>;
}

export function DialogFrame({title,eyebrow='VIDRIERA',onClose,children,wide=false,dialogRef,visible=true,titleId}){
 return <div className="sp-modal-layer" data-visible={visible} onPointerDown={event=>{if(event.target===event.currentTarget)onClose();}}><Surface as="section" className={'sp-dialog '+(wide?'sp-dialog--wide':'')} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><div ref={dialogRef} className="sp-dialog-inner" tabIndex={-1}><header className="sp-dialog-header"><div><p className="eyebrow">{eyebrow}</p><h2 id={titleId}>{title}</h2></div><IconButton label="Cerrar ventana" variant="ghost" onClick={onClose}>×</IconButton></header><div className="sp-dialog-body">{children}</div></div></Surface></div>;
}

export function Dialog({open,onClose,title,eyebrow,wide=false,children}){
 const presence=usePresence(open),ref=useRef(null),closeRef=useRef(onClose),titleId=useId();closeRef.current=onClose;
 useEffect(()=>{
  if(!presence.mounted||!ref.current)return;
  const previous=document.activeElement,shell=document.getElementById('app-shell'),wasInert=shell?.inert,overflow=document.body.style.overflow;
  if(shell)shell.inert=true;document.body.style.overflow='hidden';
  const timer=setTimeout(()=>ref.current?.querySelector('button,a[href],input,select,textarea')?.focus({preventScroll:true}),30);
  function key(event){
   if(event.key==='Escape'){event.preventDefault();closeRef.current();return;}
   if(event.key!=='Tab'||!ref.current)return;
   const nodes=[...ref.current.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(node=>!node.disabled&&node.getClientRects().length);
   if(!nodes.length){event.preventDefault();ref.current.focus();return;}
   if(event.shiftKey&&(!ref.current.contains(document.activeElement)||document.activeElement===nodes[0])){event.preventDefault();nodes.at(-1).focus();}
   else if(!event.shiftKey&&(!ref.current.contains(document.activeElement)||document.activeElement===nodes.at(-1))){event.preventDefault();nodes[0].focus();}
  }
  document.addEventListener('keydown',key);
  return()=>{clearTimeout(timer);document.removeEventListener('keydown',key);if(shell)shell.inert=wasInert;document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[presence.mounted]);
 if(!presence.mounted)return null;
 const frame=<DialogFrame title={title} eyebrow={eyebrow} onClose={onClose} wide={wide} dialogRef={ref} visible={presence.visible} titleId={titleId}>{children}</DialogFrame>;
 return typeof document==='undefined'?frame:createPortal(frame,document.body);
}

export function Toast({message,onClose}){
 const retained=useRef(message);if(message)retained.current=message;
 const p=usePresence(Boolean(message));
 useEffect(()=>{if(!message)return;const timer=setTimeout(onClose,4500);return()=>clearTimeout(timer);},[message,onClose]);
 return p.mounted?<div className="sp-toast" role="status" data-visible={p.visible}>{retained.current}</div>:null;
}
