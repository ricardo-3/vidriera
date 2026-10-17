import assert from 'node:assert/strict';
import fs from 'node:fs';
import DATA from '../src/domain/data/course.js';
import {prepareStoreImage,storeImageUrl} from '../src/domain/store-image.js';

// The same photo URL must work from the landing, workshop and physical chapters,
// both at an origin root and when the Site is served in a subdirectory.
for(const root of ['https://vidriera.example/','https://vidriera.example/curso/']){
 for(const path of ['index.html','taller.html',...DATA.lessons.map(l=>'temas/'+l.id+'.html')]){
  const page=new URL(path,root),base=new URL(path.startsWith('temas/')?'../':'.',page).href;
  for(const asset of Object.values(DATA.images)){
   assert.equal(storeImageUrl(asset.src,base),new URL(asset.src,root).href);
   assert(fs.existsSync('public/'+asset.src));
   assert(fs.existsSync('dist/'+asset.src));
   assert(fs.readFileSync('public/'+asset.src).equals(fs.readFileSync('dist/'+asset.src)));
  }
 }
}
for(const id of DATA.route)assert(DATA.images[id]);

const images=[],ready=[],errors=[];
const createImage=()=>{const image={complete:false,decode:()=>Promise.resolve()};images.push(image);return image;};
const request=source=>prepareStoreImage(source,{createImage,onReady:url=>ready.push(url),onError:()=>errors.push(source)});

// First photo, not just transitions, is decoded before it can be displayed.
let cancel=request('first.webp');assert.equal(ready.length,0);
await images.at(-1).onload();assert.deepEqual(ready,['first.webp']);cancel();

// Going back while a selected view is still downloading cancels the old view.
cancel=request('slow.webp');const lateLoad=images.at(-1).onload;cancel();
const cancelLatest=request('latest.webp');await images.at(-1).onload();await lateLoad();
assert.deepEqual(ready,['first.webp','latest.webp']);cancelLatest();

// Cancellation also applies after download, while decode is still pending.
let decoded;cancel=request('decoding.webp');images.at(-1).decode=()=>new Promise(resolve=>decoded=resolve);
const pending=images.at(-1).onload();cancel();decoded();await pending;
assert(!ready.includes('decoding.webp'));

// A failed first photo can be requested again; it never becomes a broken layer.
cancel=request('retry.webp');images.at(-1).onerror();cancel();assert.deepEqual(errors,['retry.webp']);
cancel=request('retry.webp');await images.at(-1).onload();cancel();assert.equal(ready.at(-1),'retry.webp');
cancel=request('bad-decode.webp');images.at(-1).decode=()=>Promise.reject(Error('decode failed'));
await images.at(-1).onload();cancel();assert.equal(errors.at(-1),'bad-decode.webp');assert(!ready.includes('bad-decode.webp'));

// Cached images and duplicate events must notify readiness only once.
let cachedReady=0;
cancel=prepareStoreImage('cached.webp',{createImage:()=>({complete:true,naturalWidth:1600,decode:()=>Promise.resolve()}),onReady:()=>cachedReady++,onError:()=>assert.fail('Cached photo failed')});
await new Promise(resolve=>queueMicrotask(resolve));assert.equal(cachedReady,1);cancel();
console.log('Passed: photo URLs from 13 entry pages at two base paths, 17 identical packaged assets, initial loading, retry, decode failure, cache and cancelled/out-of-order photo requests.');
