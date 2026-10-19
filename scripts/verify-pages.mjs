import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdir, readFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

const address = process.argv[2];
assert(address, 'Uso: node scripts/verify-pages.mjs https://usuario.github.io/vidriera/');
const base = new URL(address.endsWith('/') ? address : address + '/');
assert(['https:', 'http:'].includes(base.protocol), 'Se necesita una URL HTTP.');
const directory = resolve('dist');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
async function walk(folder = '') {
  const entries = await readdir(join(directory, folder), {withFileTypes: true});
  const groups = await Promise.all(entries.map(entry => {
    const path = folder ? folder + '/' + entry.name : entry.name;
    assert(!entry.isSymbolicLink(), 'No se publican enlaces simbólicos.');
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return groups.flat();
}
const paths = (await walk()).sort();
assert(paths.includes('index.html') && paths.includes('taller.html'), 'Faltan las entradas compiladas.');
const expected = new Map(await Promise.all(paths.map(async path => [path, digest(await readFile(join(directory, path)))])));
const html = await readFile(join(directory, 'index.html'), 'utf8');
assert(!/\/src\/|\.jsx(?:["'?]|$)|\.tsx(?:["'?]|$)/.test(html), 'Se intenta publicar HTML de desarrollo.');
assert(/rel="stylesheet"/.test(html), 'Falta el CSS compilado.');
assert(/type="module"[^>]*src="[^"]+\.js"/.test(html), 'Falta el JavaScript compilado.');

async function check(path) {
  const url = new URL(path === 'index.html' ? './' : path, base);
  url.searchParams.set('verify', (process.env.GITHUB_SHA || 'vidriera') + '-' + Date.now());
  const response = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(15000)});
  assert.equal(response.status, 200, path + ': HTTP ' + response.status);
  assert.equal(digest(Buffer.from(await response.arrayBuffer())), expected.get(path), path + ': el archivo publicado no coincide con dist/.');
}

// Pages can take a short time to propagate the new deployment to its public URL.
let failure;
for (let attempt = 0; attempt < 20; attempt++) {
  try {
    await check('index.html');
    failure = null;
    break;
  } catch (error) {
    failure = error;
    if (attempt < 19) await delay(3000);
  }
}
if (failure) throw failure;
for (let offset = 0; offset < paths.length; offset += 5) {
  await Promise.all(paths.slice(offset, offset + 5).filter(path => path !== 'index.html').map(check));
}
console.log('Verified live deployment: ' + paths.length + ' files match dist/ byte for byte at ' + base.href);
console.log('HTML pages: ' + paths.filter(path => path.endsWith('.html')).length + '; original WebP photos: ' + paths.filter(path => path.endsWith('.webp')).length + '.');
