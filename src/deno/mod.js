import * as path from 'https://deno.land/std/path/mod.ts';
import CSS from './css.js';
import Svelte from './svelte.js';

const pwd = path.dirname(new URL(import.meta.url).pathname);

const start = new Date();

const [css, cssHash] = await CSS(`${pwd}/../scss/main.scss`);

const svelteCache = await Svelte();

console.log(cssHash, svelteCache);

await Deno.remove(svelteCache, {recursive: true});

console.log(`Compiled in ${new Date() - start}ms`);

/*
const Home = await dynamic('./.cache/containers/home.svelte.js');
console.log(
  Home.render({
    latest: [
      {
        excerpt: 'Component is missing props.',
        href: '/',
        title: 'Placeholder'
      }
    ]
  }).html
);
*/
