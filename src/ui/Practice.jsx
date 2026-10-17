import React, {useEffect, useRef} from 'react';
import {mountPractice} from '../domain/lesson-activities.js';
import {ColorLab,CompositionLab} from './Labs.jsx';

// The learning models and their storage keys stay independent from course progress.
// A single mount also preserves drafts when browser storage is unavailable.
export function Practice({id}){
 if(id==='S04')return <CompositionLab practice/>;
 if(id==='S07')return <ColorLab practice/>;
 return <LegacyPractice id={id}/>;
}
function LegacyPractice({id}){
 const ref=useRef(null);
 useEffect(()=>{mountPractice(ref.current,id);return()=>{ref.current?.replaceChildren();};},[id]);
 return <div className="practice-mount" ref={ref}/>;
}
export function Activity({type}){
 return type==='color'?<ColorLab/>:<CompositionLab/>;
}

