import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import frontMatter from 'front-matter';
import striptags from 'striptags';
import moment from 'moment';
import marked from 'marked';
import * as helpers from 'marked/src/helpers';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index';
import 'prism-svelte';
import sass from 'node-sass';
import magicImporter from 'node-sass-magic-importer';
import csso from 'csso';

import pkg from '../package.json';
import * as renderReact from './build-react.js';
import * as renderSvelte from './build-svelte.js';

const {FRAMEWORK, NODE_ENV} = process.env;

let render;
if (FRAMEWORK === 'react') {
  render = renderReact;
  console.log(`Build framework: React`);
}
if (FRAMEWORK === 'svelte') {
  render = renderSvelte;
  console.log(`Build framework: Svelte`);
}

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

const rssDate = `ddd, DD MMM YYYY HH:mm:ss ZZ`;

const rssTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title><![CDATA[dbushell.com]]></title>
    <description><![CDATA[David Bushell’s Web Design & Front-end Development Blog]]></description>
    <link>https://dbushell.com</link>
    <generator>dbushell.com</generator>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="https://dbushell.com/rss.xml" rel="self" type="application/rss+xml"/>
    <author><![CDATA[David Bushell]]></author>
    <language><![CDATA[en]]></language>
    <webMaster><![CDATA[hi@dbushell.com (David Bushell)]]></webMaster>
{{entries}}</channel>
</rss>
`;

const rssEntry = `<item>
<title><![CDATA[{{title}}]]></title>
<description><![CDATA[<p>{{description}}</p>]]></description>
<link>https://dbushell.com{{link}}</link>
<guid isPermaLink="true">https://dbushell.com{{link}}</guid>
<dc:creator><![CDATA[David Bushell]]></dc:creator>
<pubDate>{{pubDate}}</pubDate>
</item>`;

const sitemapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{entries}}
</urlset>
`;

const sitemapEntry = `<url>
  <loc>https://dbushell.com{{loc}}</loc>
  <lastmod>{{lastmod}}</lastmod>
  <changefreq>{{changefreq}}</changefreq>
  <priority>{{priority}}</priority>
</url>`;

marked.setOptions({
  smartypants: true,
  langPrefix: 'language-',
  highlight: (code, lang) => {
    if (!lang) {
      return code;
    }
    try {
      if (!Object.hasOwnProperty.call(Prism.languages, lang)) {
        loadLanguages(lang);
      }
      return Prism.highlight(code, Prism.languages[lang]);
    } catch (err) {
      console.log(err);
      return code;
    }
  }
});

const renderer = new marked.Renderer();

renderer.paragraph = (text) => {
  if (text.startsWith('📢')) {
    return `<p class="Large">${text.replace(/^📢/, '').trim()}</p>\n`;
  }
  if (text.startsWith('💤')) {
    return `<p><small>${text.replace(/^💤/, '').trim()}</small></p>\n`;
  }
  return /^<p[ |>]/.test(text) ? text : `<p>${text}</p>\n`;
};

renderer.image = (href, title, text) => {
  text = typeof text === 'string' ? text : 'no description';
  return `<p class="Image"><img src="${href}" loading="lazy" alt="${text}"></p>\n`;
};

renderer.link = (href, title, text) => {
  let out = `<a href="${helpers.escape(href)}"`;
  if (title) {
    out += ` title="${title}"`;
  }
  if (!/^[\/|#]/.test(href) && !/dbushell\.com/.test(href)) {
    out += ` rel="noopener noreferrer" target="_blank"`;
  }
  out += `>${text}</a>`;
  return out;
};

/**
 * Convert Markdown to HTML
 */
function markdown(md) {
  let html = marked(md, {renderer});
  return html;
}

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
    const date = moment(matter.attributes.date);
    props.unix = date.valueOf();
    props.date = {
      D: date.format('D'),
      dddd: date.format('dddd'),
      MMM: date.format('MMM'),
      MMMM: date.format('MMMM'),
      Y: date.format('Y'),
      ISO: date.toISOString(),
      RSS: date.format(rssDate)
    };
    props.href = path.join(
      '/',
      date.format('Y'),
      date.format('MM'),
      date.format('DD'),
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
async function build() {
  const startTime = Date.now();
  let articles = await getAllMatter(path.resolve(__dirname, './data/blog'));
  articles = articles.map(propsFromMatter);
  articles.sort((a, b) => (a.unix < b.unix ? 1 : -1));
  const latest = articles.slice(0, 7);

  const rssXML = rssTemplate
    .replace(`{{lastBuildDate}}`, moment().format(rssDate))
    .replace(
      `{{entries}}`,
      articles
        .slice(0, 20)
        .map((entry) => {
          let entryXML = rssEntry;
          entryXML = entryXML.replace(`{{title}}`, entry.title);
          entryXML = entryXML.replace(`{{description}}`, entry.excerpt);
          entryXML = entryXML.replace(/{{link}}/g, entry.href);
          entryXML = entryXML.replace(`{{pubDate}}`, entry.date.RSS);

          return entryXML;
        })
        .join(`\n`)
    );

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
  let portfolio = await getAllMatter(
    path.resolve(__dirname, './data/portfolio')
  );
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

  const sitemapXML = sitemapTemplate.replace(
    `{{entries}}`,
    sitemap
      .map((entry) => {
        let entryXML = sitemapEntry;
        // Object.keys(entry)
        for (let [key, value] of Object.entries(entry)) {
          entryXML = entryXML.replace(`{{${key}}}`, value);
        }
        return entryXML;
      })
      .join(`\n`)
  );

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
}

build();
