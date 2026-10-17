import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
function walk(directory){return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.join(directory,entry.name)]);}
const modules=[...walk('dist'),...walk('src/domain'),...walk('scripts')].filter(file=>file.endsWith('.js'));
for(const file of modules)execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
console.log('Passed: JavaScript syntax in all '+modules.length+' application modules.');
