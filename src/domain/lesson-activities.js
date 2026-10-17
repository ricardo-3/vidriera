import {mountColorLab, mountComposition} from './activities.js';
import {presetLayout, moveNode, analyzeLayout, toWorld, clamp} from './layout-model.js';
import {renderPlan} from './layout-render.js';
import {LEARNING} from './data/learning.js';

const KEY = 'vitrina-practice-v1';
const memory = Object.create(null);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = value => typeof value === 'string' ? value.slice(0, 1600) : '';
const number = (value, min, max, fallback) => Number.isFinite(Number(value)) ? clamp(Number(value), min, max) : fallback;

export function cleanDraft(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result = {};
  for (const [key, value] of Object.entries(raw).slice(0, 20)) {
    if (!/^[a-z][a-zA-Z0-9]{0,25}$/.test(key) || ['constructor','prototype'].includes(key)) continue;
    if (typeof value === 'string') result[key] = text(value);
    else if (typeof value === 'number' && Number.isFinite(value)) result[key] = value;
    else if (key === 'route' && Array.isArray(value)) result.route = value.slice(0, 80).filter(p => p && Number.isFinite(p.x) && Number.isFinite(p.y)).map(p => ({x:clamp(p.x,0,8), y:clamp(p.y,0,12)}));
  }
  return result;
}

export function getPractice(id) {
  if (Object.hasOwn(memory, id)) return memory[id];
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw && raw.length < 150000 ? JSON.parse(raw) : {};
    memory[id] = cleanDraft(all?.[id]);
  } catch { memory[id] = {}; }
  return memory[id];
}

function save(id, value) {
  memory[id] = cleanDraft(value);
  try {
    const raw = localStorage.getItem(KEY);
    const all = raw && raw.length < 150000 ? JSON.parse(raw) : {};
    const output = {};
    for (const key of Object.keys(LEARNING)) output[key] = key === id ? memory[id] : cleanDraft(all?.[key]);
    localStorage.setItem(KEY, JSON.stringify(output));
  } catch { /* The in-memory draft remains available in this session. */ }
}

export function supportFeedback(product, support) {
  const pairs = {dress:'rack', knit:'table', shoes:'shelf'};
  const reason = {
    dress:'La prenda colgada permite observar su largo y su caída.',
    knit:'La presentación plegada permite agrupar variantes y comparar la colección.',
    shoes:'La repisa permite reconocer la forma y el perfil del calzado.'
  };
  return {suitable:pairs[product] === support, message:pairs[product] === support ? reason[product] : 'Probá otro soporte: revisá si permite ver la forma del producto y acceder a él sin desordenar el conjunto.'};
}

export function mountPractice(container, id) {
  const lesson = LEARNING[id];
  container.innerHTML = `<section class="practice-card" aria-label="Práctica del tema"><div class="practice-heading"><span class="eyebrow">TU TURNO</span><span>Práctica libre</span></div><p class="practice-task">${esc(lesson.task)}</p><div class="practice-body"></div><div class="practice-footer"><span>Probá y volvé a mirar.</span><button type="button" data-reset-practice>Restablecer práctica ↶</button></div><p class="practice-storage" role="status"></p></section>`;
  const body = container.querySelector('.practice-body');
  function mount() {
    if (id === 'S04') mountComposition(body);
    else if (id === 'S07') mountColorLab(body);
    else if (id === 'S01') brand(body, id);
    else if (id === 'S02' || id === 'S03') plan(body, id);
    else if (id === 'S05') supports(body, id);
    else if (id === 'S06') shelf(body, id);
    else if (id === 'S10') light(body, id);
    else if (id === 'S08') windowBrief(body, id);
    else if (id === 'S09') concept(body, id);
    else audit(body, id);
  }
  container.querySelector('[data-reset-practice]').addEventListener('click', () => {
    save(id, {});
    try { if (id === 'S07') localStorage.removeItem('vitrina-color-lab-v1'); if (id === 'S04') localStorage.removeItem('vitrina-composition-v1'); } catch {}
    mount();
    container.querySelector('[data-reset-practice]').focus({preventScroll:true});
    container.querySelector('.practice-storage').textContent = 'Se restableció esta práctica. Tu avance del curso se conserva.';
  });
  mount();
}

function brand(root, id) {
  const options = [
    ['contemporary','Moda contemporánea','El vidrio, el grafito y una selección contenida sostienen esta lectura de la fachada. Revisá si los productos y el interior continúan ese lenguaje.'],
    ['playful','Una propuesta lúdica','Una intención lúdica necesitaría otras pistas en la exhibición y la comunicación. ¿Qué recurso sumarías conservando la arquitectura?'],
    ['volume','Gran variedad y volumen','Esta fachada selecciona pocas piezas. Para comunicar variedad convendría trabajar categorías y mensajes, manteniendo reconocible el acceso.']
  ];
  root.innerHTML = `<div class="choice-stack">${options.map(([value,label]) => `<button type="button" data-brand="${value}">${label}<span aria-hidden="true">↗</span></button>`).join('')}</div><p class="practice-result" aria-live="polite"></p>`;
  const choose = value => {
    const option = options.find(o => o[0] === value) || options[0];
    for (const b of root.querySelectorAll('[data-brand]')) b.setAttribute('aria-pressed', String(b.dataset.brand === option[0]));
    root.querySelector('.practice-result').textContent = option[2]; save(id,{choice:option[0]});
  };
  for (const b of root.querySelectorAll('[data-brand]')) b.addEventListener('click', () => choose(b.dataset.brand));
  choose(getPractice(id).choice);
}

function plan(root, id) {
  const drawing = id === 'S03', draft = getPractice(id);
  let layout = presetLayout();
  if (drawing) layout.route = Array.isArray(draft.route) ? draft.route : [{x:4,y:1}];
  else layout = moveNode(layout, 'island', number(draft.x,0,6.7,3.35), 3.8, false);
  root.innerHTML = `<div class="mini-plan-wrap"><svg class="mini-plan" role="img" aria-label="Planta de estudio: Mujer izquierda, Kids al fondo, Hombre derecha"></svg></div>${drawing ? '<div class="practice-fields"><label>Agregar un destino<select data-destination><option value="entrance">Entrada</option><option value="women">Mujer</option><option value="kids">Kids</option><option value="men">Hombre</option><option value="checkout">Caja</option></select></label><button type="button" class="button button-outline" data-add-point>Agregar punto +</button></div><div class="activity-options"><button type="button" data-undo-point>Quitar último punto</button><button type="button" data-clear-route>Borrar ruta</button></div>' : '<label class="practice-range">Posición horizontal de la isla<input type="range" min="0" max="6.7" step="0.05" data-island-x></label>'}<p class="practice-result" aria-live="polite"></p><a class="practice-workshop" href="./taller.html#${drawing?'recorrido':'layout'}">${drawing?'Seguí dibujando en el taller':'Diseñá tu layout completo'} <span aria-hidden="true">↗</span></a><p class="practice-note">Plano y medidas de estudio. Las observaciones comparan geometría, sin validar el local real.</p>`;
  const svg = root.querySelector('svg'); let view;
  function draw() {
    view = renderPlan(svg, layout, {width:320, interactive:false});
    const a = analyzeLayout(layout);
    root.querySelector('.practice-result').textContent = drawing ? (!a.hasRoute ? 'Elegí un destino o tocá el plano para empezar.' : a.routeHits.length ? `La ruta cruza ${a.routeHits.length} mueble(s). Probá rodearlos y compará la alternativa.` : 'Tu ruta conecta los puntos sin atravesar muebles del esquema. ¿Se reconocen los destinos?') : a.overlaps.length ? 'La isla se superpone con otro mueble. Probá una posición que permita reconocer el paso.' : 'La isla no se superpone con muebles. Compará el espacio que queda a cada lado.';
    if (drawing) save(id,{route:layout.route}); else save(id,{x:layout.nodes.find(n=>n.id==='island').x});
  }
  if (drawing) {
    const destinations = {entrance:{x:4,y:1},women:{x:2,y:4},kids:{x:2,y:10},men:{x:6,y:5},checkout:{x:4.4,y:10}};
    function add(p) { if (layout.route.length < 80) layout.route.push(p); draw(); }
    svg.addEventListener('click', e => { const r = svg.getBoundingClientRect(); if(r.width && r.height) add(toWorld({x:(e.clientX-r.left)*view.width/r.width,y:(e.clientY-r.top)*view.height/r.height},view)); });
    root.querySelector('[data-add-point]').addEventListener('click', () => add({...destinations[root.querySelector('select').value]}));
    root.querySelector('[data-undo-point]').addEventListener('click', () => {layout.route.pop();draw();});
    root.querySelector('[data-clear-route]').addEventListener('click', () => {layout.route=[];draw();});
  } else {
    const input = root.querySelector('input'); input.value = layout.nodes.find(n=>n.id==='island').x;
    input.addEventListener('input', () => {layout=moveNode(layout,'island',Number(input.value),3.8,false);draw();});
  }
  draw();
}

function supports(root, id) {
  const d = getPractice(id);
  root.innerHTML = '<div class="practice-fields"><label>Producto<select data-product><option value="dress">Vestido</option><option value="knit">Prenda plegada</option><option value="shoes">Calzado</option></select></label><label>Soporte<select data-support><option value="rack">Perchero</option><option value="table">Mesa</option><option value="shelf">Repisa</option></select></label></div><div class="support-diagram" aria-hidden="true"><span class="support-product"></span><span class="support-base"></span></div><p class="practice-result" aria-live="polite"></p>';
  const product=root.querySelector('[data-product]'),support=root.querySelector('[data-support]');
  if(['dress','knit','shoes'].includes(d.product))product.value=d.product;
  if(['rack','table','shelf'].includes(d.support))support.value=d.support;
  function draw(){const f=supportFeedback(product.value,support.value);root.querySelector('.practice-result').textContent=f.message;const diagram=root.querySelector('.support-diagram');diagram.dataset.support=support.value;diagram.dataset.product=product.value;root.querySelector('.support-product').textContent=product.selectedOptions[0].textContent;save(id,{product:product.value,support:support.value});}
  product.addEventListener('change',draw);support.addEventListener('change',draw);draw();
}

function shelf(root,id){
  const d=getPractice(id);
  root.innerHTML='<div class="practice-fields"><label>Nivel de exhibición<select data-level><option value="0">Superior</option><option value="1">Intermedio</option><option value="2">Inferior</option></select></label><label>Frentes visibles<input type="range" min="1" max="4" step="1" data-facings><output data-count></output></label></div><div class="shelf-diagram" role="img" aria-label="Estantería didáctica de tres niveles"></div><p class="practice-result" aria-live="polite"></p><p class="practice-note">Los niveles son relativos; no representan alturas ni accesibilidad verificadas.</p>';
  const level=root.querySelector('select'),faces=root.querySelector('input');level.value=String(Math.round(number(d.level,0,2,1)));faces.value=Math.round(number(d.faces,1,4,2));
  function draw(){const row=Number(level.value),n=Number(faces.value);root.querySelector('[data-count]').textContent=n+' frentes';root.querySelector('.shelf-diagram').innerHTML=[0,1,2].map(i=>`<div class="shelf-row">${i===row?Array.from({length:n},()=>'<span class="shoe-unit" aria-hidden="true"></span>').join(''):''}<small>${['Superior','Intermedio','Inferior'][i]}</small></div>`).join('');root.querySelector('.shelf-diagram').setAttribute('aria-label',`${n} frentes en el nivel ${level.selectedOptions[0].textContent.toLowerCase()}`);root.querySelector('.practice-result').textContent=['El nivel superior hace visible el producto desde otra altura. Alcanzarlo podría requerir asistencia.','El nivel intermedio permite comparar los frentes. Visibilidad y alcance necesitan comprobarse para cada público.','El nivel inferior cambia la dirección de la mirada. Alcanzar el producto puede requerir agacharse.'][row];save(id,{level:row,faces:n});}
  level.addEventListener('change',draw);faces.addEventListener('input',draw);draw();
}

function light(root,id){
  const d=getPractice(id);let target=Math.round(number(d.target,0,2,1)),mode=d.mode==='uniform'?'uniform':'accent';
  root.innerHTML='<div class="activity-options" role="group" aria-label="Tipo de iluminación"><button type="button" data-light-mode="uniform">General</button><button type="button" data-light-mode="accent">General + acento</button></div><div class="light-diagram" role="img"><div class="light-products"><span>Prendas</span><span>Outfit</span><span>Calzado</span></div><span class="light-beam"></span></div><div class="activity-options" role="group" aria-label="Dirigir el acento"><button type="button" data-target="0">Prendas</button><button type="button" data-target="1">Outfit</button><button type="button" data-target="2">Calzado</button></div><p class="practice-result" aria-live="polite"></p><p class="practice-note">Esquema de jerarquía visual. La fotografía se conserva sin alteraciones.</p>';
  function draw(){const on=mode==='accent',name=['prendas','outfit','calzado'][target];const diagram=root.querySelector('.light-diagram');diagram.dataset.light=mode;diagram.style.setProperty('--beam-x',(target*33.333+16.667)+'%');diagram.setAttribute('aria-label',on?'Luz general con acento sobre '+name:'Luz general uniforme');for(const b of root.querySelectorAll('[data-light-mode]'))b.setAttribute('aria-pressed',String(b.dataset.lightMode===mode));for(const b of root.querySelectorAll('[data-target]'))b.setAttribute('aria-pressed',String(on&&Number(b.dataset.target)===target));root.querySelector('.practice-result').textContent=on?'El acento dirige la atención hacia '+name+'. Compará su protagonismo con el de los demás productos.':'La base general hace legible el conjunto de manera más uniforme. Probá sumar un acento.';save(id,{target,mode});}
  for(const b of root.querySelectorAll('[data-light-mode]'))b.addEventListener('click',()=>{mode=b.dataset.lightMode;draw();});
  for(const b of root.querySelectorAll('[data-target]'))b.addEventListener('click',()=>{target=Number(b.dataset.target);mode='accent';draw();});draw();
}

function windowBrief(root,id){
  const d=getPractice(id);
  root.innerHTML=`<div class="practice-fields"><label>Público<input data-draft="audience" maxlength="180" placeholder="¿Para quién?" value="${esc(d.audience)}"></label><label>Objetivo<select data-draft="goal"><option>Presentar una colección</option><option>Destacar un producto</option><option>Comunicar una campaña</option></select></label><label>Producto protagonista<input data-draft="product" maxlength="180" placeholder="Por ejemplo, un outfit" value="${esc(d.product)}"></label><label>Mensaje principal<input data-draft="message" maxlength="120" placeholder="Una sola idea" value="${esc(d.message)}"></label></div><label class="practice-label">Composición<select data-draft="composition"><option value="hero">Un protagonista</option><option value="balanced">Equilibrio</option><option value="rhythm">Repetición</option></select></label><div class="window-diagram"><span class="window-message"></span><div class="window-figures" aria-hidden="true"><i></i><i></i><i></i></div><span class="window-product"></span></div><p class="practice-result" aria-live="polite"></p>`;
  const goal=root.querySelector('[data-draft="goal"]'),composition=root.querySelector('[data-draft="composition"]');
  if([...goal.options].some(o=>o.value===d.goal))goal.value=d.goal;
  if(['hero','balanced','rhythm'].includes(d.composition))composition.value=d.composition;
  function draw(){const value={};for(const field of root.querySelectorAll('[data-draft]'))value[field.dataset.draft]=field.value;root.querySelector('.window-diagram').dataset.composition=value.composition;root.querySelector('.window-message').textContent=value.message||'Tu mensaje principal';root.querySelector('.window-product').textContent=value.product||'Producto protagonista';root.querySelector('.practice-result').textContent=value.audience&&value.product?`${value.goal}: ${value.product}, para ${value.audience}. Revisá si la composición acompaña ese objetivo.`:'Definí público y producto para empezar a relacionar tus decisiones.';save(id,value);}
  for(const field of root.querySelectorAll('[data-draft]'))field.addEventListener('input',draw);draw();
}

function concept(root,id){
  const d=getPractice(id);
  const fields=[['idea','Mi concepto','Una idea que conecte toda la propuesta'],['material','Material','Qué tomo de la referencia y dónde lo aplico'],['palette','Paleta','Qué relación de colores necesito'],['composition','Composición','Cómo organizo protagonista y apoyos']];
  root.innerHTML=fields.map(([key,label,placeholder])=>`<label class="practice-label">${label}<textarea data-draft="${key}" rows="2" maxlength="1600" placeholder="${placeholder}">${esc(d[key])}</textarea></label>`).join('')+'<div class="concept-summary"><span class="eyebrow">TU DIRECCIÓN DE DISEÑO</span><p class="practice-result" aria-live="polite"></p></div>';
  function draw(){const value={};for(const input of root.querySelectorAll('[data-draft]'))value[input.dataset.draft]=input.value;const decisions=['material','palette','composition'].filter(k=>value[k].trim()).length;root.querySelector('.practice-result').textContent=(value.idea||'Escribí una idea central')+` · ${decisions} de 3 decisiones vinculadas. La coherencia se revisa argumentando la relación entre ellas.`;save(id,value);}
  for(const f of root.querySelectorAll('textarea'))f.addEventListener('input',draw);draw();
}

function audit(root,id){
  const d=getPractice(id);
  const fields=[['observation','¿Qué observás?','Describí algo visible en la imagen'],['proposal','¿Qué mejorarías?','Proponé una decisión concreta'],['reason','¿Por qué?','Explicá qué resolvería'],['verify','¿Qué falta comprobar?','Una medida, un dato o una consulta']];
  root.innerHTML=fields.map(([key,label,placeholder])=>`<label class="practice-label">${label}<textarea data-draft="${key}" rows="2" maxlength="1600" placeholder="${placeholder}">${esc(d[key])}</textarea></label>`).join('')+'<p class="practice-result" aria-live="polite"></p>';
  function draw(){const value={};for(const f of root.querySelectorAll('textarea'))value[f.dataset.draft]=f.value;save(id,value);root.querySelector('.practice-result').textContent=value.observation&&value.proposal&&value.reason?'Tu propuesta distingue observación, decisión y motivo. Podés recuperarla en la descarga del cierre.':'Empezá por lo que ves; después proponé y justificá la mejora.';}
  for(const f of root.querySelectorAll('textarea'))f.addEventListener('input',draw);draw();
}

export function practiceNotes(){
  const labels={S08:'MI BRIEF DE VIDRIERA',S09:'MI CONCEPTO',S11:'MI PROPUESTA DE MEJORA'};
  const fields={audience:'Público',goal:'Objetivo',product:'Producto',message:'Mensaje',composition:'Composición',idea:'Concepto',material:'Material',palette:'Paleta',observation:'Observación',proposal:'Propuesta',reason:'Motivo',verify:'Por comprobar'};
  const lines=[];
  for(const id of Object.keys(labels)){
    const d=getPractice(id),entries=Object.entries(d).filter(([k,v])=>fields[k]&&typeof v==='string'&&v.trim());
    const authored={S08:['audience','product','message'],S09:['idea','material','palette','composition'],S11:['observation','proposal','reason','verify']}[id];
    if(!authored.some(key=>typeof d[key]==='string'&&d[key].trim()))continue;
    if(entries.length)lines.push('',labels[id],...entries.map(([k,v])=>fields[k]+': '+v));
  }
  return lines;
}
