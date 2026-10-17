import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {unlinkSync} from 'node:fs';
const outfile=new URL('../.component-test.mjs',import.meta.url).pathname;
try{
 await build({entryPoints:['tests/components.jsx'],outfile,bundle:true,packages:'external',platform:'node',format:'esm',jsx:'automatic',logLevel:'warning'});
 execFileSync(process.execPath,[outfile],{stdio:'inherit'});
}finally{try{unlinkSync(outfile);}catch{}}

