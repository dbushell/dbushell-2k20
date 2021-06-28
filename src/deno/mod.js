import * as fs from 'fs';
import * as path from 'path';
import * as base64 from 'base64';

import * as css from './css.js';
import * as data from './data.js';
import * as meta from './meta.js';
import * as rss from './rss.js';
import * as sitemap from './sitemap.js';
import * as svelte from './svelte.js';

const pwd = path.dirname(new URL(import.meta.url).pathname);
const dest = path.resolve(`${pwd}/../../public`);

globalThis.dbushell = {version: meta.version};

console.log(`🖨️ ${meta.generator}`);

const bundler = new Worker(new URL('./bundle.js', import.meta.url).href, {
  type: 'module',
  deno: {
    namespace: true,
    permissions: 'inherit'
  }
});

const bundling = new Promise((resolve) => {
  bundler.onmessage = (ev) => resolve(ev.data);
});

const cache = await svelte.compile();
const [cssData, cssHash] = await css.process();
const [articles, latest] = await data.readArticles();
const pages = await data.readPages();
const template = await Deno.readTextFile(`${pwd}/../templates/index.html`);

// Retrieve <head> inline JavaScript
const headData = await Deno.readTextFile(
  path.resolve(`${pwd}/../templates/head.min.js`)
).then(
  (data) => `;window.dbushell={version: '${meta.version}'};${data.trim()}`
);

let headHash = new TextEncoder().encode(headData);
headHash = await crypto.subtle.digest('sha-256', headHash);
headHash = base64.encode(new Uint8Array(headHash));

const saving = [];
const locations = [];

// Write static page to public directory
const save = (path, props) => {
  const promise = new Promise(async (resolve) => {
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
    html = html.replace(/{{cssData}}/, cssData);
    html = html.replace(/{{headHash}}/, headHash);
    html = html.replace(/{{headData}}/, headData);
    html = html.replace(/{{title}}/g, title);
    html = html.replace(/{{description}}/g, description);
    html = html.replace(/{{version}}/g, meta.version);
    html = html.replace(/{{href}}/g, props.href);
    html = html.replace(/{{render}}/g, props.render);

    locations.push(props);

    await fs.ensureFile(path);
    await Deno.writeTextFile(path, html);

    resolve();
  });
  saving.push(promise);
  return promise;
};

// Generate static blog articles
const Article = await import(`${cache}/containers/article.svelte.js`);
const saveArticles = [];
articles.forEach((props) => {
  props.changefreq = 'monthly';
  props.priority = '0.6';
  props.render = Article.default.render({...props, latest}).html;
  const file = path.resolve(`${dest}/${props.href}index.html`);
  saveArticles.push(save(file, props));
});
Promise.all(saveArticles).then(() =>
  console.log(`★ Published ${articles.length} articles`)
);

// Generate static blog archives
const Archive = await import(`${cache}/containers/archive.svelte.js`);
const saveArchives = [];
const archive = [...articles];
let index = 0;
while (archive.length > 0) {
  const props = {
    href: ++index === 1 ? `/blog/` : `/blog/page/${index}/`,
    title: `Blog` + (index > 1 ? ` (page ${index})` : ``)
  };
  props.articles = archive.splice(0, 7);
  if (archive.length) {
    props.next = `/blog/page/${index + 1}/`;
  }
  if (index > 1) {
    props.prev = index === 2 ? '/blog/' : `/blog/page/${index - 1}/`;
  }
  props.changefreq = index === 1 ? 'weekly' : 'monthly';
  props.priority = index === 1 ? '0.9' : '0.5';
  props.render = Archive.default.render({...props, latest}).html;
  saveArchives.push(
    save(path.resolve(`${dest}/${props.href}/index.html`), props)
  );
}
Promise.all(saveArchives).then(() =>
  console.log(`★ Published ${index} archives`)
);

// Articles before archives in sitemap (for readability)
locations.reverse();

// Generate static pages
const Page = await import(`${cache}/containers/page.svelte.js`);
const savePages = [];
pages.forEach((props) => {
  props.changefreq = 'monthly';
  props.priority = /\/showcase\//.test(props.href) ? '0.7' : '0.8';
  props.render = Page.default.render({...props, latest}).html;
  savePages.push(save(path.resolve(`${dest}/${props.href}index.html`), props));
});
Promise.all(savePages).then(() =>
  console.log(`★ Published ${pages.length} pages`)
);

// Generate contact page
const Contact = await import(`${cache}/containers/contact.svelte.js`);
save(path.resolve(`${dest}/contact/index.html`), {
  render: Contact.default.render({latest}).html,
  href: '/contact/',
  changefreq: 'monthly',
  priority: '0.8'
}).then(() => console.log(`★ Published contact`));

// Generate home page
const Home = await import(`${cache}/containers/home.svelte.js`);
save(path.resolve(`${dest}/index.html`), {
  render: Home.default.render({latest}).html,
  href: '/',
  changefreq: 'weekly',
  priority: '1.0'
}).then(() => console.log(`★ Published home`));

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

console.log(await bundling);
bundler.terminate();

console.log(`✹ Built in ${Math.round(performance.now())}ms`);
