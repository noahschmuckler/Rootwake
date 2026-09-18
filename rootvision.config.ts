import { defineConfig } from 'vite';
import {copyFileSync} from 'node:fs';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:['terminal.local']},plugins:[{name:'rootvision-home',closeBundle(){copyFileSync('dist-rootvision/rootvision.html','dist-rootvision/index.html');}}],build:{outDir:'dist-rootvision',rollupOptions:{input:'rootvision.html'}}});
