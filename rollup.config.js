import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

const {NODE_ENV} = process.env;

const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';

export default {
  input: 'src/svelte/app.js',
  output: {
    file: 'public/assets/js/app.min.js',
    format: 'module'
  },
  plugins: [
    svelte({
      dev: !isDev
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    isProd && terser()
  ]
};
