import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import renderRSS from './library/rss.js';
import renderSitemap from './library/sitemap.js';
import {css, cssHash} from './library/css.js';
import {getAllMatter, propsFromMatter} from './library/matter.js';
import {modifiedDate} from './library/datetime.js';
import * as render from './library/svelte.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const __public = path.resolve(__dirname, '../public');

let pkg = fs.readFileSync(path.resolve(__dirname, '../package.json'));
pkg = JSON.parse(pkg);

const generator = `${process.platform}/${process.arch} | node ${
  process.version
} | svelte ${pkg.dependencies.svelte} | ${
  new Date().toString().split(' GMT')[0]
}`;

console.log(`🖨️  ${generator}`);

let head = fs.readFileSync(path.resolve(__dirname, `./svelte/head.js`));
const headHash = crypto.createHash('sha256').update(head).digest('base64');

const HTML = fs
  .readFileSync(path.resolve(__dirname, `./templates/index.html`))
  .toString();

/**
 * Write file and directory path
 */
const writeFile = async (file, data) => {
  await fs.promises.mkdir(path.dirname(file), {recursive: true});
  return fs.promises.writeFile(file, data);
};

/**
 * Write template to public directory
 */
const writePage = async (file, props) => {
  let title = `David Bushell – Freelance Web Design (UK)`;
  let description = title;
  if (props.title) {
    title = `${props.title}  – ${title}`;
  }
  if (props.description) {
    description = props.description;
  }
  let html = HTML;
  html = html.replace(/{{generator}}/, generator);
  html = html.replace(/{{cssHash}}/, cssHash);
  html = html.replace(/{{css}}/, css);
  html = html.replace(/{{headHash}}/, headHash);
  html = html.replace(/{{head}}/, head);
  html = html.replace(/{{title}}/g, title);
  html = html.replace(/{{description}}/g, description);
  html = html.replace(/{{version}}/g, pkg.version);
  html = html.replace(/{{href}}/g, props.href);
  html = html.replace(/{{render}}/g, props.render);
  await writeFile(file, html);
};

/**
 * Build website
 */
const startTime = Date.now();
let articles = await getAllMatter(path.resolve(__dirname, './data/blog'));
articles = articles.map(propsFromMatter);
articles.sort((a, b) => (a.unix < b.unix ? 1 : -1));
const latest = articles.slice(0, 7);
const sitemap = [];

await writeFile(path.resolve(__public, 'rss.xml'), renderRSS(articles));
console.log(`⚡ RSS Feed`);

// Update Netlify CSP headers
const tomlPath = path.resolve(__dirname, `../netlify.toml`);
let toml = fs.readFileSync(tomlPath).toString();
toml = toml.replace(
  /style-src 'self' 'sha256-[^']+?'/g,
  `style-src 'self' 'sha256-${cssHash}'`
);
toml = toml.replace(
  /script-src 'self' 'sha256-[^']+?'/g,
  `script-src 'self' 'sha256-${headHash}'`
);
await writeFile(tomlPath, toml);
console.log(`🔑 Netlify CSP`);

// Build blog articles
articles.forEach((props) => {
  props.render = render.renderArticle({...props, latest});
  const file = path.join(__public, `${props.href}index.html`);
  writePage(file, props);
  sitemap.push({
    loc: props.href,
    changefreq: 'monthly',
    priority: '0.5',
    lastmod: modifiedDate(file)
  });
});
console.log(`Published ${articles.length} articles`);

// Build blog pagination
let index = 0;
while (articles.length > 0) {
  const props = {
    href: ++index === 1 ? `/blog/` : `/blog/page/${index}/`,
    title: `Blog` + (index > 1 ? ` (page ${index})` : ``)
  };
  props.articles = articles.splice(0, 7);
  if (articles.length) {
    props.next = `/blog/page/${index + 1}/`;
  }
  if (index > 1) {
    props.prev = index === 2 ? '/blog/' : `/blog/page/${index - 1}/`;
  }
  props.render = render.renderArchive({...props, latest});
  const file = path.join(__public, `${props.href}index.html`);
  writePage(file, props);
}
console.log(`Published ${index} blog pages`);

// Build pages
let pages = await getAllMatter(path.resolve(__dirname, './data/pages'));
let portfolio = await getAllMatter(path.resolve(__dirname, './data/portfolio'));
pages = pages.concat(portfolio);
pages = pages.map(propsFromMatter);
pages.forEach((props) => {
  props.render = render.renderPage({...props, latest});
  const file = path.join(__public, `${props.href}index.html`);
  writePage(file, props);
  if (props.href === '/404/') {
    return;
  }
  sitemap.unshift({
    loc: props.href,
    changefreq: `monthly`,
    priority: /\/showcase\//.test(props.href) ? `0.7` : `0.8`,
    lastmod: modifiedDate(file)
  });
});
console.log(`Published ${pages.length} pages`);

// Build contact page
const contact = path.join(__public, `contact/index.html`);
writePage(contact, {
  href: `/contact/`,
  render: render.renderContact({latest})
});
console.log(`Published contact page`);

sitemap.unshift({
  loc: '/contact/',
  changefreq: `monthly`,
  priority: `0.8`,
  lastmod: modifiedDate()
});

// Build homepage
const home = path.join(__public, `index.html`);
writePage(home, {
  href: `/`,
  render: render.renderHome({latest})
});
console.log(`Published homepage`);

sitemap.unshift({
  loc: '/',
  changefreq: `weekly`,
  priority: `1.0`,
  lastmod: modifiedDate()
});

const sitemapXML = renderSitemap(sitemap);
await writeFile(path.resolve(__public, 'sitemap.xml'), sitemapXML);
console.log(`⚓ Sitemap`);

// Get Service Worker template
let sw = fs.readFileSync(path.resolve(__dirname, `./templates/sw.js`));
sw = sw.toString().replace(/{{version}}/g, pkg.version);
sw = `// This file is automatically generated - edit the template!\n${sw}`;
await writeFile(path.join(__public, `sw.js`), sw);
console.log(`🤖 Service Worker`);

// Move 404 page
fs.copyFileSync(
  path.resolve(__public, '404/index.html'),
  path.resolve(__public, '404.html')
);
fs.rmdirSync(path.resolve(__public, '404'), {recursive: true});

console.log(`Build time: ${Date.now() - startTime}`);
