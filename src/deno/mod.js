import * as fs from 'https://deno.land/std/fs/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';

import CSS from './css.js';
import * as svelte from './svelte.js';
import * as data from './data.js';

const start = new Date();

const generator = `${Deno.build.os}/${Deno.build.arch} | deno ${
  Deno.version.deno
} | svelte ${svelte.version} | ${start.toString().split(' GMT')[0]}`;

console.log(`🖨️ ${generator}`);

const pwd = path.dirname(new URL(import.meta.url).pathname);

const [css, cssHash] = await CSS(`${pwd}/../scss/main.scss`);

let HTML = await Deno.readTextFile(`${pwd}/../templates/index.html`);

const [[articles, latest], cache] = await Promise.all([
  data.readArticles(),
  svelte.compileApp()
]);

// const articles = await data.readArticles();
// const latest = articles.slice(0, 7);

// const svelteCache = await svelte.compileApp();

// /**
//  * Write template to public directory
//  */
// const writePage = async (file, props) => {
//   let title = `David Bushell – Freelance Web Design (UK)`;
//   let description = title;
//   if (props.title) {
//     title = `${props.title} – ${title}`;
//   }
//   if (props.description) {
//     description = props.description;
//   }
//   let html = HTML;
//   // html = html.replace(/{{generator}}/, generator);
//   html = html.replace(/{{cssHash}}/, cssHash);
//   html = html.replace(/{{css}}/, css);
//   // html = html.replace(/{{headHash}}/, headHash);
//   // html = html.replace(/{{head}}/, head);
//   // html = html.replace(/{{title}}/g, title);
//   // html = html.replace(/{{description}}/g, description);
//   // html = html.replace(/{{version}}/g, pkg.version);
//   html = html.replace(/{{href}}/g, props.href);
//   html = html.replace(/{{render}}/g, props.render);
//   // await ensureFile(file);
//   // await Deno.writeTextFile(file, html);
//   // console.log(html);
// };

// const Article = await import(`${svelteCache}/containers/article.svelte.js`);

// // Write blog articles
// articles.forEach((props) => {
//   props.render = Article.default.render({...props, latest}).html;

//   // console.log(props);
//   // const file = path.join(__public, `${props.href}index.html`);
//   // writePage(file, props);
//   // sitemap.push({
//   //   loc: props.href,
//   //   changefreq: 'monthly',
//   //   priority: '0.5',
//   //   lastmod: modifiedDate(file)
//   // });
// });

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
