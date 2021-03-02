import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import frontMatter from 'front-matter';
import striptags from 'striptags';
import sass from 'node-sass';
import magicImporter from 'node-sass-magic-importer';
import csso from 'csso';
import readPkg from 'read-pkg';
import {formatDate} from './library/i18n.js';
import markdown from './library/markdown.js';

const {NODE_ENV = 'development'} = process.env;

const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

const pkg = await readPkg('../package.json');

import * as render from './build-svelte.js';

const publicPath = path.resolve(__dirname, `../public`);

const HTML = fs
  .readFileSync(path.resolve(__dirname, `./templates/index.html`))
  .toString();

// Render and minify CSS
let css = fs.readFileSync(path.resolve(__dirname, `./scss/main.scss`));
css = sass.renderSync({
  data: css.toString(),
  importer: magicImporter()
}).css;
if (NODE_ENV !== 'development') {
  css = csso.minify(css.toString()).css;
}
const cssHash = crypto.createHash('sha256').update(css).digest('base64');





/**
 * Return JSON data from YML front-matter for file.
 */
function getMatter(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err.toString());
      }
      if (!frontMatter.test(data)) {
        return resolve();
      }
      const matter = frontMatter(data);
      matter.__path = file;
      resolve(matter);
    });
  });
}

/**
 * Return JSON data from YML front-matter for directory recursively.
 */
async function getAllMatter(dir) {
  const promises = [];
  const readDir = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.resolve(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        return readDir(filePath);
      }
      if (path.extname(filePath) === '.md') {
        promises.push(getMatter(filePath));
      }
    });
  };
  readDir(dir);
  return Promise.all(promises);
}

/**
 * Process YML front-matter
 */
function propsFromMatter(matter) {
  const props = {};

  // Pass title through Marked for smartypants
  props.title = markdown(matter.attributes.title);
  props.title = striptags(props.title).trim();

  // Pass title through Marked for smartypants
  if (matter.attributes.description) {
    props.description = markdown(matter.attributes.description);
    props.description = striptags(props.description).trim();
  }

  // Pass body through Marked for full HTML
  props.body = markdown(matter.body);

  props.excerpt = props.body.replace(/<pre>.+?<\/pre>/gs, '');
  props.excerpt = striptags(props.excerpt);
  const words = props.excerpt.split(' ');
  if (words.length >= 55) {
    props.excerpt = `${words.slice(0, 55).join(' ')} […]`;
  }

  props.href = `/${matter.attributes.slug}/`;

  if ('date' in matter.attributes) {
    const date = new Date(matter.attributes.date);
    props.unix = date.valueOf();
    props.date = formatDate(date);
    props.href = path.join(
      '/',
      props.date.YYYY.toString(),
      props.date.MM.toString(),
      props.date.DD.toString(),
      matter.attributes.slug,
      '/'
    );
  }

  props.__path = matter.__path;

  return props;
}

/**
 * Write template to public directory
 */
function outputFile(file, props) {
  let title = `David Bushell – Freelance Web Design (UK)`;
  let description = title;
  if (props.title) {
    title = `${props.title}  – ${title}`;
  }
  if (props.description) {
    description = props.description;
  }
  let html = HTML;
  html = html.replace(/{{cssHash}}/, cssHash);
  html = html.replace(/{{css}}/, css);
  html = html.replace(/{{title}}/g, title);
  html = html.replace(/{{description}}/g, description);
  html = html.replace(/{{version}}/g, pkg.version);
  html = html.replace(/{{href}}/g, props.href);
  html = html.replace(/{{render}}/g, props.render);
  fs.outputFileSync(file, html);
}

/**
 * Build website
 */
const startTime = Date.now();
let articles = await getAllMatter(path.resolve(__dirname, './data/blog'));
articles = articles.map(propsFromMatter);
articles.sort((a, b) => (a.unix < b.unix ? 1 : -1));
const latest = articles.slice(0, 7);

const rssXML = render.renderRSS({
  lastBuildDate: formatDate().RSS,
  entries: articles.slice(0, 20).map((entry) => ({
    title: entry.title,
    description: entry.excerpt,
    link: entry.href,
    pubDate: entry.date.RSS
  }))
});
fs.outputFileSync(path.resolve(publicPath, 'rss.xml'), rssXML);
console.log(`Published RSS feed`);

const sitemap = [];

// Build blog articles
articles.forEach((props) => {
  props.render = render.renderArticle({...props, latest});
  const file = path.join(publicPath, `${props.href}index.html`);
  outputFile(file, props);
  sitemap.push({
    loc: props.href,
    changefreq: 'monthly',
    priority: '0.5',
    lastmod: fs.statSync(props.__path).mtime.toISOString()
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
  const file = path.join(publicPath, `${props.href}index.html`);
  outputFile(file, props);
}
console.log(`Published ${index} blog pages`);

// Build pages
let pages = await getAllMatter(path.resolve(__dirname, './data/pages'));
let portfolio = await getAllMatter(path.resolve(__dirname, './data/portfolio'));
pages = pages.concat(portfolio);
pages = pages.map(propsFromMatter);
pages.forEach((props) => {
  props.render = render.renderPage({...props, latest});
  const file = path.join(publicPath, `${props.href}index.html`);
  outputFile(file, props);
  if (props.href === '/404/') {
    return;
  }
  sitemap.unshift({
    loc: props.href,
    changefreq: `monthly`,
    priority: /\/showcase\//.test(props.href) ? `0.7` : `0.8`,
    lastmod: fs.statSync(props.__path).mtime.toISOString()
  });
});
console.log(`Published ${pages.length} pages`);

// Build contact page
const contact = path.join(publicPath, `contact/index.html`);
outputFile(contact, {
  href: `/contact/`,
  render: render.renderContact({latest})
});
console.log(`Published contact page`);

sitemap.unshift({
  loc: '/contact/',
  changefreq: `monthly`,
  priority: `0.8`,
  lastmod: new Date().toISOString()
});

// Build homepage
const home = path.join(publicPath, `index.html`);
outputFile(home, {
  href: `/`,
  render: render.renderHome({latest})
});
console.log(`Published homepage`);

sitemap.unshift({
  loc: '/',
  changefreq: `weekly`,
  priority: `1.0`,
  lastmod: new Date().toISOString()
});

const sitemapXML = render.renderSitemap({entries: sitemap});

fs.outputFileSync(path.resolve(publicPath, 'sitemap.xml'), sitemapXML);
console.log(`Published sitemap`);

// Get Service Worker template
let sw = fs.readFileSync(path.resolve(__dirname, `./templates/sw.js`));
sw = sw.toString().replace(/{{version}}/g, pkg.version);
sw = `// This file is automatically generated - edit the template!\n${sw}`;
fs.writeFileSync(path.join(publicPath, `sw.js`), sw);
console.log(`Updated service worker`);

// Copy 404 page
fs.copySync(
  path.resolve(publicPath, '404/index.html'),
  path.resolve(publicPath, '404.html'),
  {overwrite: true}
);
fs.removeSync(path.resolve(publicPath, '404'));

console.log(`Build time: ${Date.now() - startTime}`);
