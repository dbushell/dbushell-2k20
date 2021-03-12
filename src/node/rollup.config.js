import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const {NODE_ENV = 'development'} = process.env;

const isDev = NODE_ENV === 'development';
const isProd = !isDev;

export default {
  input: 'src/svelte/app.js',
  output: {
    file: 'public/assets/js/app.min.js',
    format: 'module'
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: isDev
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    isProd && terser()
  ]
};
