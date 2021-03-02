import {createRequire} from 'module';
const require = createRequire(import.meta.url);

require('svelte/register');

const Archive = require('../svelte/containers/archive.svelte');
const Article = require('../svelte/containers/article.svelte');
const Contact = require('../svelte/containers/contact.svelte');
const Home = require('../svelte/containers/home.svelte');
const Page = require('../svelte/containers/page.svelte');
const RSS = require('../svelte/containers/rss.svelte');
const Sitemap = require('../svelte/containers/sitemap.svelte');

export const renderArchive = (props) => {
  return Archive.default.render(props).html;
};

export const renderArticle = (props) => {
  return Article.default.render(props).html;
};

export const renderContact = (props) => {
  return Contact.default.render(props).html;
};

export const renderHome = (props) => {
  return Home.default.render(props).html;
};

export const renderPage = (props) => {
  return Page.default.render(props).html;
};

export const renderRSS = (props) => {
  return RSS.default.render(props).html;
};

export const renderSitemap = (props) => {
  return Sitemap.default.render(props).html;
};
