import * as path from 'https://deno.land/std/path/mod.ts';
import CSS from './css.js';
import Svelte from './svelte.js';

const start = new Date();

const decoder = new TextDecoder('utf-8');
// const encoder = new TextEncoder('utf-8');

const pwd = path.dirname(new URL(import.meta.url).pathname);

const [css, cssHash] = await CSS(`${pwd}/../scss/main.scss`);

let HTML = await Deno.readFile(`${pwd}/../templates/index.html`);
HTML = decoder.decode(HTML);

/**
 * Write template to public directory
 */
const writePage = async (file, props) => {
  let title = `David Bushell – Freelance Web Design (UK)`;
  let description = title;
  if (props.title) {
    title = `${props.title} – ${title}`;
  }
  if (props.description) {
    description = props.description;
  }
  let html = HTML;
  // html = html.replace(/{{generator}}/, generator);
  html = html.replace(/{{cssHash}}/, cssHash);
  html = html.replace(/{{css}}/, css);
  // html = html.replace(/{{headHash}}/, headHash);
  // html = html.replace(/{{head}}/, head);
  // html = html.replace(/{{title}}/g, title);
  // html = html.replace(/{{description}}/g, description);
  // html = html.replace(/{{version}}/g, pkg.version);
  html = html.replace(/{{href}}/g, props.href);
  html = html.replace(/{{render}}/g, props.render);
  // await ensureFile(file);
  // await Deno.writeFile(file, encoder.encode(html));
  console.log(html);
};

const svelteCache = await Svelte();

// Test homepage render
let Home = await import(`${svelteCache}/containers/home.svelte.js`);

Home = Home.default.render({
  latest: [
    {
      excerpt: 'Component is missing props.',
      href: '/',
      title: 'Placeholder'
    }
  ]
}).html;

writePage(`index.html`, {
  href: `/`,
  render: Home
});

await Deno.remove(svelteCache, {recursive: true});

// const dynamic = async (modPath) =>
//   await import(modPath).then((mod) => mod.default);
// let Home = await dynamic(`${svelteCache}/containers/home.svelte.js`);

console.log(`Built in ${new Date() - start}ms`);
