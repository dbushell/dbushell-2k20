import * as fs from 'https://deno.land/std/fs/mod.ts';
import * as hash from 'https://deno.land/std/hash/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';

import * as css from './css.js';
import * as data from './data.js';
import * as meta from './meta.js';
import * as rss from './rss.js';
import * as sitemap from './sitemap.js';
import * as svelte from './svelte.js';
import * as bundle from './bundle.js';

const start = new Date();

const pwd = path.dirname(new URL(import.meta.url).pathname);
const dest = path.resolve(`${pwd}/../../public`);

console.log(`🖨️ ${meta.generator}`);

// Run everything at once ...
const [
  cache,
  template,
  [cssData, cssHash],
  [articles, latest],
  pages
] = await Promise.all([
  svelte.compile(),
  Deno.readTextFile(`${pwd}/../templates/index.html`),
  css.process(`${pwd}/../scss/main.scss`),
  data.readArticles(),
  data.readPages()
]);

// Retrieve <head> inline JavaScript
const headData = await Deno.readTextFile(
  path.resolve(`${pwd}/../svelte/head.js`)
);
const headHash = hash.createHash('sha256').update(headData).toString('base64');

const saving = [];
const locations = [];

// Write static page to public directory
const save = (path, props) =>
  saving.push(
    new Promise(async (resolve) => {
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
      html = html.replace(/{{headHash}}/, headHash);
      html = html.replace(/{{head}}/, headData);
      html = html.replace(/{{title}}/g, title);
      html = html.replace(/{{description}}/g, description);
      html = html.replace(/{{version}}/g, meta.version);
      html = html.replace(/{{href}}/g, props.href);
      html = html.replace(/{{render}}/g, props.render);

      locations.push(props);

      await fs.ensureFile(path);
      await Deno.writeTextFile(path, html);

      resolve();
    })
  );

// Generate static blog articles
const Article = await import(`${cache}/containers/article.svelte.js`);
articles.forEach((props) => {
  props.changefreq = 'monthly';
  props.priority = '0.6';
  props.render = Article.default.render({...props, latest}).html;
  const file = path.resolve(`${dest}/${props.href}index.html`);
  save(file, props);
});
console.log(`★ Published ${articles.length} articles`);

// Generate static blog archives
const Archive = await import(`${cache}/containers/archive.svelte.js`);
const blog = [...articles];
let index = 0;
while (blog.length > 0) {
  const props = {
    href: ++index === 1 ? `/blog/` : `/blog/page/${index}/`,
    title: `Blog` + (index > 1 ? ` (page ${index})` : ``)
  };
  props.articles = blog.splice(0, 7);
  if (blog.length) {
    props.next = `/blog/page/${index + 1}/`;
  }
  if (index > 1) {
    props.prev = index === 2 ? '/blog/' : `/blog/page/${index - 1}/`;
  }
  props.changefreq = index === 1 ? 'weekly' : 'monthly';
  props.priority = index === 1 ? '0.9' : '0.5';
  props.render = Archive.default.render({...props, latest}).html;
  save(path.resolve(`${dest}/${props.href}/index.html`), props);
}
console.log(`★ Published ${index} archives`);

// Articles before archives in sitemap (for readability)
locations.reverse();

// Generate static pages
const Page = await import(`${cache}/containers/page.svelte.js`);
pages.forEach((props) => {
  props.changefreq = 'monthly';
  props.priority = /\/showcase\//.test(props.href) ? '0.7' : '0.8';
  props.render = Page.default.render({...props, latest}).html;
  save(path.resolve(`${dest}/${props.href}index.html`), props);
});
console.log(`★ Published ${pages.length} pages`);

// Generate contact page
const Contact = await import(`${cache}/containers/contact.svelte.js`);
save(path.resolve(`${dest}/contact/index.html`), {
  render: Contact.default.render({latest}).html,
  href: '/contact/',
  changefreq: 'monthly',
  priority: '0.8'
});
console.log(`★ Published contact`);

// Generate home page
const Home = await import(`${cache}/containers/home.svelte.js`);
save(path.resolve(`${dest}/index.html`), {
  render: Home.default.render({latest}).html,
  href: '/',
  changefreq: 'weekly',
  priority: '1.0'
});
console.log(`★ Published home`);

await Promise.all(saving);

// Move 404 template
await Deno.rename(
  path.resolve(`${dest}/404/index.html`),
  path.resolve(`${dest}/404.html`)
);
await Deno.remove(`${dest}/404`, {recursive: true});

// Generate RSS feed
await Deno.writeTextFile(path.resolve(`${dest}/rss.xml`), rss.render(articles));
console.log(`★ Published feed`);

// Generate Sitemap
await Deno.writeTextFile(
  path.resolve(`${dest}/sitemap.xml`),
  sitemap.render(locations)
);
console.log(`★ Published sitemap`);

// Copy server worker
let sw = await Deno.readTextFile(path.resolve(`${pwd}/../templates/sw.js`));
sw = sw.replace(/{{version}}/g, meta.version);
sw = `// This file is automatically generated - edit the template!\n${sw}`;
await Deno.writeTextFile(path.resolve(`${dest}/sw.js`), sw);
console.log(`★ Published service worker`);

// Netlify content security policy headers
const tomlPath = path.resolve(`${pwd}/../../netlify.toml`);
let toml = await Deno.readTextFile(tomlPath);
toml = toml.replace(
  /script-src 'self' 'sha256-[^']+?'/g,
  `script-src 'self' 'sha256-${headHash}'`
);
toml = toml.replace(
  /style-src 'self' 'sha256-[^']+?'/g,
  `style-src 'self' 'sha256-${cssHash}'`
);
await Deno.writeTextFile(tomlPath, toml);
console.log(`★ Updated headers`);

// Tidy up ...
await Deno.remove(cache, {recursive: true});

console.log(`✹ Built in ${new Date() - start}ms`);

// Bundle JavaScript
const start2 = new Date();
const app = await bundle.create();
await Deno.writeTextFile(`${dest}/assets/js/app.min.js`, app);
console.log(`✹ Bundled JavaScript in ${new Date() - start2}ms`);
