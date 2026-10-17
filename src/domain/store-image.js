// Resolve against the Site's fixed base, including inside portal dialogs after
// navigating to a physical chapter URL with the History API.
export function storeImageUrl(source,base){
 return base?new URL(source,base).href:source;
}

// A cancelled or slower request must never replace the latest selected view.
export function prepareStoreImage(source,{onReady,onError,createImage=()=>new Image(),timeout=15000}){
 const image=createImage();
 let cancelled=false,settled=false,decoding=false;
 const clear=()=>{clearTimeout(timer);image.onload=null;image.onerror=null;};
 const fail=()=>{if(cancelled||settled)return;settled=true;clear();onError();};
 const timer=setTimeout(fail,timeout);
 image.onload=async()=>{
  if(cancelled||settled||decoding)return;
  decoding=true;
  try{if(typeof image.decode==='function')await image.decode();}
  catch{fail();return;}
  if(cancelled||settled)return;
  settled=true;clear();onReady(source);
 };
 image.onerror=fail;
 image.src=source;
 if(image.complete&&image.naturalWidth>0)queueMicrotask(()=>image.onload?.());
 return()=>{cancelled=true;clear();};
}
