const NS='http://www.w3.org/2000/svg';let serial=0;
export function hexToHsl(hex){
 const [r,g,b]=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;
 let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;h*=60;}
 return {h:(h+360)%360,s:s*100,l:l*100};
}
export function hslToHex(h,s,l){
 h=((h%360)+360)%360;s=Math.max(0,Math.min(100,s))/100;l=Math.max(0,Math.min(100,l))/100;
 const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
 const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
 return '#'+rgb.map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');
}
export function createPalette(base,mode){
 if(!/^#[0-9a-f]{6}$/i.test(base))base='#637a73';const {h,s,l}=hexToHsl(base);
 if(mode==='analogous')return [-30,-30,0,0,30,30].map((offset,i)=>hslToHex(h+offset,s,[l-12,l+14,l,l+20,l-8,l+12][i]));
 if(mode==='complementary')return [0,0,0,180,180,180].map((offset,i)=>hslToHex(h+offset,s,[l-12,l,l+20,l-12,l,l+20][i]));
 return [20,32,44,56,70,83].map(light=>hslToHex(h,s,light));
}
export function groupColors(colors){return [...colors].sort((a,b)=>{const x=hexToHsl(a),y=hexToHsl(b);return Math.round(x.h/20)-Math.round(y.h/20)||x.l-y.l;});}
export const COMPOSITIONS={
 focal:{title:'Un grupo protagonista',detail:'Los libros forman el grupo principal; los demás objetos lo acompañan con espacio libre.',groups:[{label:'Libros',x:13,y:24,w:34,h:52},{label:'Perfumes',x:51,y:29,w:13,h:29},{label:'Bolso',x:71,y:19,w:16,h:33},{label:'Prendas',x:53,y:70,w:21,h:16},{label:'Calzado',x:79,y:67,w:13,h:16}]},
 balance:{title:'Equilibrio entre grupos',detail:'Dos grupos de tamaño parecido distribuyen el peso visual a ambos lados de la isla.',groups:[{label:'Libros',x:11,y:25,w:26,h:37},{label:'Perfumes',x:43,y:24,w:14,h:28},{label:'Bolso',x:66,y:23,w:23,h:39},{label:'Prendas',x:14,y:70,w:23,h:16},{label:'Calzado',x:65,y:71,w:24,h:14}]},
 repetition:{title:'Repetición y ritmo',detail:'La alineación y la repetición de tamaños hacen que la mirada siga una secuencia.',groups:[{label:'Libros',x:9,y:33,w:17,h:30},{label:'Perfumes',x:30,y:33,w:12,h:30},{label:'Bolso',x:46,y:33,w:15,h:30},{label:'Prendas',x:65,y:33,w:15,h:30},{label:'Calzado',x:84,y:33,w:12,h:30}]}
};
export function mountComposition(container){
 const id='composition-'+(++serial);let mode='focal',selected=0;const edits={};
 for(const name of Object.keys(COMPOSITIONS))edits[name]=COMPOSITIONS[name].groups.map(()=>({}));
 try{const raw=localStorage.getItem('vitrina-composition-v1'),saved=raw&&raw.length<20000?JSON.parse(raw):null;if(saved&&Object.hasOwn(COMPOSITIONS,saved.mode))mode=saved.mode;for(const name of Object.keys(edits))for(let i=0;i<edits[name].length;i++){const item=saved?.edits?.[name]?.[i];if(item)for(const key of ['x','y','scale'])if(typeof item[key]==='number'&&Number.isFinite(item[key]))edits[name][i][key]=item[key];}}catch{}
 container.innerHTML='<div class="interactive-activity"><p class="activity-eyebrow">ESQUEMA DE COMPOSICIÓN</p><div class="activity-options" role="group" aria-label="Criterio de composición"><button type="button" data-composition="focal">Protagonista</button><button type="button" data-composition="balance">Equilibrio</button><button type="button" data-composition="repetition">Repetición</button></div><div class="composition-board" role="group" aria-label="Seleccionar un grupo de productos sobre la isla"></div><div class="composition-controls"><p data-composition-selection></p><label for="'+id+'-x">Horizontal<input id="'+id+'-x" data-adjust="x" type="range" min="0" max="100" step="1"></label><label for="'+id+'-y">Vertical<input id="'+id+'-y" data-adjust="y" type="range" min="0" max="100" step="1"></label><label for="'+id+'-scale">Tamaño relativo<input id="'+id+'-scale" data-adjust="scale" type="range" min="0.7" max="1.3" step="0.05"></label></div><p class="activity-result" aria-live="polite"></p></div>';
 const board=container.querySelector('.composition-board'),result=container.querySelector('.activity-result');
 const limit=(value,min,max)=>Math.max(min,Math.min(max,value));
 function draw(){
  const preset=COMPOSITIONS[mode];board.replaceChildren();
  preset.groups.forEach((base,i)=>{const edit=edits[mode][i],scale=limit(edit.scale??1,.7,1.3),w=base.w*scale,h=base.h*scale,x=limit(edit.x??base.x,0,100-w),y=limit(edit.y??base.y,0,100-h);edits[mode][i]={x,y,scale};const item=document.createElement('button');item.type='button';item.className='composition-item';item.style.left=x+'%';item.style.top=y+'%';item.style.width=w+'%';item.style.height=h+'%';item.textContent=base.label==='Perfumes'?'3 perfumes':base.label;item.setAttribute('aria-pressed',String(i===selected));item.setAttribute('aria-label','Editar '+item.textContent);item.addEventListener('click',()=>{selected=i;draw();board.children[i].focus({preventScroll:true});});board.append(item);});
  const chosen=edits[mode][selected],base=preset.groups[selected];
  container.querySelector('[data-composition-selection]').textContent='Ajustá: '+base.label;
  for(const input of container.querySelectorAll('[data-adjust]')){const key=input.dataset.adjust;if(key==='x')input.max=String(100-base.w*chosen.scale);if(key==='y')input.max=String(100-base.h*chosen.scale);input.value=chosen[key];}
  result.textContent=preset.detail+' Seleccioná un grupo para cambiar su posición o su tamaño.';
  for(const b of container.querySelectorAll('[data-composition]'))b.setAttribute('aria-pressed',String(b.dataset.composition===mode));
  try{localStorage.setItem('vitrina-composition-v1',JSON.stringify({mode,edits}));}catch{}
 }
 for(const b of container.querySelectorAll('[data-composition]'))b.addEventListener('click',()=>{mode=b.dataset.composition;selected=0;draw();});
 for(const input of container.querySelectorAll('[data-adjust]'))input.addEventListener('input',()=>{edits[mode][selected][input.dataset.adjust]=Number(input.value);draw();});
 draw();
}
export function mountColorLab(container){
 const id='color-lab-'+(++serial);let base='#637a73',mode='analogous',colors=createPalette(base,mode),selected=0;
 try{const saved=JSON.parse(localStorage.getItem('vitrina-color-lab-v1'));if(saved&&/^#[0-9a-f]{6}$/i.test(saved.base)&&['monochrome','analogous','complementary'].includes(saved.mode)){base=saved.base;mode=saved.mode;if(Array.isArray(saved.colors)&&saved.colors.length===6&&saved.colors.every(c=>/^#[0-9a-f]{6}$/i.test(c)))colors=saved.colors;else colors=createPalette(base,mode);}}catch{}
 container.innerHTML='<div class="interactive-activity"><p class="activity-eyebrow">SIMULACIÓN DE EXHIBICIÓN</p><div class="color-base-control"><label for="'+id+'-base">Color base</label><input id="'+id+'-base" type="color" aria-label="Elegir el color base de la colección"></div><div class="activity-options" role="group" aria-label="Armonía de la paleta"><button type="button" data-harmony="monochrome">Monocromática</button><button type="button" data-harmony="analogous">Análoga</button><button type="button" data-harmony="complementary">Complementaria</button></div><div class="color-rack" role="group" aria-label="Seleccionar una prenda para cambiar su color"></div><div class="garment-controls"><label for="'+id+'-garment">Color de la prenda</label><input id="'+id+'-garment" type="color" aria-label="Cambiar el color de la prenda seleccionada"><button type="button" class="text-button" data-group-colors>Agrupar por color ↗</button></div><p class="activity-result" aria-live="polite"></p></div>';
 const rack=container.querySelector('.color-rack'),baseInput=container.querySelector('#'+id+'-base'),garment=container.querySelector('#'+id+'-garment'),result=container.querySelector('.activity-result');
 const descriptions={monochrome:'Un mismo matiz con cambios de claridad.',analogous:'Matices próximos en el círculo cromático.',complementary:'Dos familias de color opuestas en esta simulación.'};
 const description=()=>hexToHsl(base).s<2?'Los tonos neutros no muestran una relación de matices. Probá un color más saturado.':descriptions[mode];
 function save(){try{localStorage.setItem('vitrina-color-lab-v1',JSON.stringify({base,mode,colors}));}catch{}}
 function draw(){
  rack.replaceChildren();for(let i=0;i<colors.length;i++){const b=document.createElement('button');b.type='button';b.className='garment-button';b.setAttribute('aria-label','Seleccionar prenda '+(i+1));b.setAttribute('aria-pressed',String(i===selected));const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 70 90');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(NS,'path');path.setAttribute('d','M21 12L10 18L3 34L15 40L18 31L18 80L52 80L52 31L55 40L67 34L60 18L49 12Q35 25 21 12Z');path.setAttribute('fill',colors[i]);path.setAttribute('stroke','#62675c');path.setAttribute('stroke-width','1');svg.append(path);b.append(svg);b.addEventListener('click',()=>{selected=i;draw();rack.children[selected].focus({preventScroll:true});result.textContent='Prenda '+(i+1)+' seleccionada. Probá otro tono.';});rack.append(b);}
  baseInput.value=base;garment.value=colors[selected];for(const b of container.querySelectorAll('[data-harmony]'))b.setAttribute('aria-pressed',String(b.dataset.harmony===mode));
 }
 baseInput.addEventListener('input',()=>{base=baseInput.value;colors=createPalette(base,mode);draw();save();result.textContent=description();});
 garment.addEventListener('input',()=>{colors[selected]=garment.value;draw();save();result.textContent='Cambió el tono de la prenda '+(selected+1)+'. Observá cómo se relaciona con las demás.';});
 for(const b of container.querySelectorAll('[data-harmony]'))b.addEventListener('click',()=>{mode=b.dataset.harmony;colors=createPalette(base,mode);draw();save();result.textContent=description();});
 container.querySelector('[data-group-colors]').addEventListener('click',()=>{colors=groupColors(colors);selected=0;draw();save();result.textContent='La colección está agrupada por familias de color y claridad.';});
 draw();result.textContent=description()+' Seleccioná una prenda para cambiarla.';
}

