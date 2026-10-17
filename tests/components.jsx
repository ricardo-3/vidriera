import React from 'react';
import {renderToStaticMarkup as render} from 'react-dom/server';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import App,{LessonCards,LessonContent,TourContent,ORDER,COURSE_KEY} from '../src/App.jsx';
import {Button,DialogFrame,Tabs,FloatingDetail,Slider} from '../src/ui/components.jsx';
import DATA from '../src/domain/data/course.js';
import {storeImageUrl} from '../src/domain/store-image.js';
import {Scene,StoreImage,StoreImageBase} from '../src/ui/Scene.jsx';
import {emptyState,completeLesson} from '../src/domain/progress.js';
import {createLocalModel,normalizeColor,normalizeComposition} from '../src/ui/Labs.jsx';

const noop=()=>{},hrefFor=target=>target.page==='lesson'?'./temas/'+target.id+'.html':'./index.html';
let html=render(<Button variant="primary" disabled>Continuar</Button>);
assert(html.includes('type="button"'));assert(html.includes('disabled=""'));assert(html.includes('sp-button--primary'));
html=render(<Button as="a" href="./taller.html">El taller</Button>);assert(html.includes('<a '));assert(!html.includes('type="button"'));
html=render(<Tabs value="look" onChange={noop} items={[{value:'look',label:'Observá',id:'look-tab',controls:'look-panel'},{value:'idea',label:'Entendé',id:'idea-tab',controls:'idea-panel'}]}/>);
assert.equal((html.match(/role="tab"/g)||[]).length,2);assert(html.includes('aria-selected="true" tabindex="0"'));assert(html.includes('aria-selected="false" tabindex="-1"'));assert(html.includes('aria-controls="look-panel"'));
html=render(<DialogFrame title="Tu recorrido" titleId="dialog-title" onClose={noop}><p>Contenido del diálogo</p></DialogFrame>);
assert(html.includes('role="dialog"'));assert(html.includes('aria-modal="true"'));assert(html.includes('aria-labelledby="dialog-title"'));assert(html.includes('id="dialog-title"'));assert(html.includes('aria-label="Cerrar ventana"'));
html=render(<FloatingDetail content={{title:'La isla',index:'01',key:'island',text:'Tres perfumes y libros.'}} onClose={noop}/>);
assert(html.includes('aria-label="Detalle de la escena"'));assert(html.includes('Tres perfumes y libros.'));assert(html.includes('class="scene-detail-copy"'));assert(!html.includes('data-visible='));
const emptyDetail=render(<FloatingDetail content={null} onClose={noop}/>);assert(emptyDetail.includes('sp-scene-detail'));assert(emptyDetail.includes('Una pista para mirar'));assert(emptyDetail.includes('scene-detail-copy'));assert(!emptyDetail.includes('hidden=')&&!emptyDetail.includes('inert='));
for(const index of [0,1,2]){const detail=render(<FloatingDetail content={{title:'Punto '+index,index:String(index+1),key:String(index),text:'Contenido '.repeat(index+1)}} onClose={noop}/>);assert.equal((detail.match(/class="scene-detail-heading"/g)||[]).length,1);assert.equal((detail.match(/class="scene-detail-copy"/g)||[]).length,1);}
for(const lesson of DATA.lessons){const scene=render(<Scene lesson={lesson} onMap={noop} onExpand={noop}/>);assert(scene.includes('<div class="image-plane">'));assert.equal((scene.match(/class="scene-inspector"/g)||[]).length,1);assert.equal((scene.match(/id="scene-detail"/g)||[]).length,1);assert(scene.includes('aria-controls="scene-detail"'));}
html=render(<StoreImageBase.Provider value="https://vidriera.example/"><StoreImage imageId="IMG-02"/></StoreImageBase.Provider>);assert(html.includes('aria-busy="true"'));assert(html.includes('Cargando vista…'));assert(!html.includes('<img '));
for(let index=0;index<DATA.route.length;index++){
 html=render(<TourContent index={index} setIndex={noop}/>);
 assert(html.includes('data-image-id="'+DATA.route[index]+'"'));
 assert.equal((html.match(/aria-current="step"/g)||[]).length,1);
 assert.equal((html.match(/aria-label="Vista /g)||[]).length,DATA.route.length);
 assert(html.includes('Mirar el local no completa temas.'));
}
html=render(<Slider label="Comparar vistas" value={35} onChange={noop}/>);assert(html.includes('type="range"'));assert(html.includes('value="35"'));

let state=emptyState(DATA.version);
for(let count=0;count<=ORDER.length;count++){
 html=render(<LessonCards state={state} hrefFor={hrefFor} onNavigate={noop}/>);
 assert.equal((html.match(/class="preview-number"/g)||[]).length,11);
 assert.equal((html.match(/<a /g)||[]).length,count);
 const readonly=render(<LessonCards state={state} hrefFor={hrefFor} onNavigate={noop} allowReview={false}/>);assert.equal((readonly.match(/<a /g)||[]).length,0);
 assert.equal((html.match(/class="lesson-preview is-pending"/g)||[]).length,Math.max(10-count,0));
 for(const base of ['https://vidriera.example/','https://vidriera.example/curso/']){
  const previews=render(<StoreImageBase.Provider value={base}><LessonCards state={state} hrefFor={hrefFor} onNavigate={noop}/></StoreImageBase.Provider>);
  const sources=[...previews.matchAll(/<img [^>]*src="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(sources,DATA.lessons.map(lesson=>storeImageUrl(DATA.images[lesson.primary].src,base)));
  // A thumbnail loaded after changing the History API URL must still request
  // the same file, without depending on the document's mutable base URL.
  for(const chapter of ['/temas/S01.html','/temas/S11.html','/index.html#/indice']){
   for(const source of sources)assert.equal(new URL(source,new URL(chapter,base)).href,source);
  }
 }
 if(count<ORDER.length)state=completeLesson(state,ORDER[count],ORDER);
}
for(const lesson of DATA.lessons){
 html=render(<LessonContent lesson={lesson} onComplete={noop} onReview={noop} onPreview={noop}/>);
 assert.equal((html.match(/data-reading-step=/g)||[]).length,3);
 assert(html.indexOf('data-reading-step="look"')<html.indexOf('data-reading-step="idea"'));
 assert(html.indexOf('data-reading-step="idea"')<html.indexOf('data-reading-step="practice"'));
 assert(!html.includes('role="tabpanel"'));assert(!html.includes('Sí, entendí · continuar'));assert(!html.includes('Ver miniaturas del recorrido'));
 html=render(<LessonContent lesson={lesson} reachedEnd onComplete={noop} onReview={noop} onPreview={noop}/>);
 assert(html.includes('Sí, entendí · continuar'));assert(html.includes('Ver miniaturas del recorrido'));
}
const values=new Map([[COURSE_KEY,JSON.stringify({version:'1',completed:ORDER,lastLesson:'S10',reflection:'Mi reflexión previa'})],['vitrina-layout-v1',JSON.stringify({version:1,room:{width:8,depth:12},nodes:[],route:[],strokes:[],note:'Mi planta previa'})]]);
globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
for(const [pathname,hash] of [['/index.html',''],['/temas/S10.html',''],['/index.html','#/indice'],['/index.html','#/cierre'],['/taller.html','']]){
 globalThis.location={pathname,hash};
 html=render(<App siteBase="https://vitrina.example/"/>);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate IDs on '+pathname+hash);
 assert(html.includes('<strong>VIDRIERA</strong>'));assert(!html.includes('VITRINA'));
 assert(!html.includes('Abrir índice del curso'));assert(!html.includes('class="chapter-rail"'));
 const nav=html.match(/<nav aria-label="Navegación principal">([\s\S]*?)<\/nav>/)[1];
 assert(nav.indexOf('Curso VM')<nav.indexOf('Explora el local'));assert(nav.indexOf('Explora el local')<nav.indexOf('El taller'));
 assert(nav.includes('href="https://vitrina.example/index.html#course"'));assert(nav.includes('aria-haspopup="dialog"'));assert(!nav.includes('Recorrido guiado'));
 assert(html.includes('id="main-content"'));assert(html.includes('id="app-shell"'));assert(html.includes('Planta editable del local'));
 const imageSources=[...html.matchAll(/<img [^>]*src="([^"]+)"/g)].map(match=>match[1]);
 assert(imageSources.length>0);
 assert(imageSources.every(source=>source.startsWith('https://vitrina.example/assets/store/')),'Relative photo path on '+pathname+hash);
 if(hash==='#/cierre')assert(html.includes('Mi reflexión previa'));
 if(pathname==='/taller.html')assert(!html.includes('<div hidden=""><div class="workshop-page"'));
}
assert.equal(JSON.parse(values.get(COURSE_KEY)).reflection,'Mi reflexión previa');assert.equal(JSON.parse(values.get('vitrina-layout-v1')).note,'Mi planta previa');
const palette=normalizeColor({base:'#ff0000',mode:'complementary'});assert.equal(palette.colors.length,6);assert.equal(palette.mode,'complementary');
assert.equal(normalizeColor({base:'bad',mode:'bad',colors:[]}).base,'#637a73');
const composition=normalizeComposition({mode:'repetition',edits:{repetition:[{x:1000,y:-40,scale:4}]}});
assert.equal(composition.edits.repetition[0].scale,1.3);assert.equal(composition.edits.repetition[0].y,0);assert(composition.edits.repetition[0].x<100);
const shared=createLocalModel('vitrina-color-lab-v1',palette,normalizeColor);let courseChanges=0,workshopChanges=0;
const unsubscribeCourse=shared.subscribe(()=>courseChanges++),unsubscribeWorkshop=shared.subscribe(()=>workshopChanges++);
shared.set(palette);assert.equal(courseChanges,1);assert.equal(workshopChanges,1);assert.equal(shared.get().base,'#ff0000');
const originalCourse=values.get(COURSE_KEY);globalThis.localStorage={getItem(){throw Error('unavailable');},setItem(){throw Error('unavailable');}};
shared.set(old=>({...old,base:'#00ff00'}));assert.equal(shared.get().base,'#00ff00');assert.equal(courseChanges,2);assert.equal(workshopChanges,2);assert.equal(values.get(COURSE_KEY),originalCourse);
unsubscribeCourse();unsubscribeWorkshop();
delete globalThis.location;delete globalThis.localStorage;
const css=fs.readFileSync('src/styles/spatial.css','utf8');
assert(css.includes('font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif'));
assert(!fs.readFileSync('src/styles/guided.css','utf8').includes('font-family:'));
assert(css.includes('@media(max-width:380px)'));assert(css.includes('@media(prefers-reduced-motion:reduce)'));assert(css.includes('object-fit:contain'));assert(css.includes('.sp-modal-layer[data-visible=true]'));const sceneCSS=fs.readFileSync('src/styles/scene.css','utf8');assert(sceneCSS.includes('aspect-ratio:16/9'));assert(sceneCSS.includes('overflow-anchor:none'));assert(sceneCSS.includes('--scene-detail-height:128px'));assert(sceneCSS.includes('font-weight:800'));
console.log('Passed: React components, dialog semantics, tab selection, lesson cards at every progress state, sequential reading with a final confirmation gate, unique IDs across five routes and prior saves. This is server rendering, not browser QA.');

