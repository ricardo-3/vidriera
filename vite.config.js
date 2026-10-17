import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({base:'./',build:{outDir:'dist',emptyOutDir:true,rollupOptions:{input:{index:fileURLToPath(new URL('./index.html',import.meta.url)),taller:fileURLToPath(new URL('./taller.html',import.meta.url))}}},esbuild:{jsx:'automatic'}});
