import * as fs from 'https://deno.land/std/fs/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';

import * as css from './css.js';
import * as data from './data.js';
import * as meta from './meta.js';
import * as svelte from './svelte.js';

const start = new Date();

const pwd = path.dirname(new URL(import.meta.url).pathname);
const dest = path.resolve(`${pwd}/../../public`);

console.log(`🖨️ ${meta.generator}`);

// Run everything at once ...
const [cache, template, [cssData, cssHash], [articles, latest], pages] = await Promise.all([
  svelte.compile(),
  Deno.readTextFile(`${pwd}/../templates/index.html`),
  css.process(`${pwd}/../scss/main.scss`),
  data.readArticles(),
  data.readPages()
]);

console.log(cache, template.length, cssHash, articles.length, pages.length);

// Write static page to public directory
const writePage = async (file, props) => {
  let title = meta.title;
  let description = title;
  if (props.title) {
    title = `${props.title} – ${title}`;
  }
  if (props.description) {
    description = props.description;
  }
  let html = template;
  html = html.replace(/{{generator}}/, meta.generator);
  html = html.replace(/{{cssHash}}/, cssHash);
  html = html.replace(/{{css}}/, cssData);
  // html = html.replace(/{{headHash}}/, headHash);
  // html = html.replace(/{{head}}/, head);
  html = html.replace(/{{title}}/g, title);
  html = html.replace(/{{description}}/g, description);
  html = html.replace(/{{version}}/g, meta.version);
  html = html.replace(/{{href}}/g, props.href);
  html = html.replace(/{{render}}/g, props.render);
  // await ensureFile(file);
  // await Deno.writeTextFile(file, html);
  // console.log(html);
  // console.log(file);
};

// Generate static blog articles
const Article = await import(`${cache}/containers/article.svelte.js`);
articles.forEach((props) => {
  props.render = Article.default.render({...props, latest}).html;
  const file = path.resolve(`${dest}/${props.href}index.html`);
  writePage(file, props);
  // sitemap.push({
  //   loc: props.href,
  //   changefreq: 'monthly',
  //   priority: '0.5',
  //   lastmod: modifiedDate(file)
  // });
});

// Generate static pages
const Page = await import(`${cache}/containers/page.svelte.js`);
pages.forEach((props) => {
  props.render = Page.default.render({...props, latest}).html;
  const file = path.resolve(`${dest}/${props.href}index.html`);
  writePage(file, props);
  if (props.href === '/404/') {
    return;
  }
  // sitemap.push({
  //   loc: props.href,
  //   changefreq: 'monthly',
  //   priority: '0.5',
  //   lastmod: modifiedDate(file)
  // });
});

// console.log(`Published ${articles.length} articles`);

// // Test homepage render
// let Home = await import(`${svelteCache}/containers/home.svelte.js`);

// Home = Home.default.render({
//   latest: [
//     {
//       excerpt: 'Component is missing props.',
//       href: '/',
//       title: 'Placeholder'
//     }
//   ]
// }).html;

// writePage(`index.html`, {
//   href: `/`,
//   render: Home
// });

await Deno.remove(cache, {recursive: true});

// // const dynamic = async (modPath) =>
// //   await import(modPath).then((mod) => mod.default);
// // let Home = await dynamic(`${svelteCache}/containers/home.svelte.js`);

console.log(`★ Built in ${new Date() - start}ms`);
