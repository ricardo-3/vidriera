import fs from 'node:fs';
import DATA from '../src/domain/data/course.js';
const source=fs.readFileSync('dist/index.html','utf8');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fs.mkdirSync('dist/temas',{recursive:true});
for(const lesson of DATA.lessons){
 const html=source.replace('<head>','<head>\n  <base href="../">').replace(/<title>.*?<\/title>/,'<title>'+esc(lesson.title)+' · Vidriera</title>').replace('<body>','<body data-initial-lesson="'+lesson.id+'">');
 fs.writeFileSync('dist/temas/'+lesson.id+'.html',html);
}
console.log('Generated eleven standalone chapter pages with shared navigation.');
