import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Archive from './react/containers/archive';
import Article from './react/containers/article';
import Contact from './react/containers/contact';
import Home from './react/containers/home';
import Page from './react/containers/page';

export const renderArchive = (props) => {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Archive, props, null)
  );
};

export const renderArticle = (props) => {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Article, props, null)
  );
};

export const renderContact = (props) => {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Contact, props, null)
  );
};

export const renderHome = (props) => {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Home, props, null)
  );
};

export const renderPage = (props) => {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Page, props, null)
  );
};
