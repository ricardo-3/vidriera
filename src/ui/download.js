export function download(content,mime,name){
 const blob=content instanceof Blob?content:new Blob([content],{type:mime});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),5000);
}

