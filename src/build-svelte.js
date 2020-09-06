import svelte from 'svelte/register';

import Archive from './svelte/containers/archive.svelte';
import Article from './svelte/containers/article.svelte';
import Contact from './svelte/containers/contact.svelte';
import Home from './svelte/containers/home.svelte';
import Page from './svelte/containers/page.svelte';

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
