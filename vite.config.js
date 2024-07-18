import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        description:'更换编辑器样式',
        namespace: 'npm/vite-plugin-monkey',
        version:  '0.1',
        license: 'MIT',
        match: ['*://*/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
  server:{
    port:"7865",
    host:'0.0.0.0'
  },
  define: {
    'process.env.NODE_ENV': '"testing"'
  },
});
