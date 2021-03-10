import marked from 'marked';
import * as helpers from 'marked/src/helpers.js';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import 'prism-svelte';

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

const markdown = (md) => marked(md, {renderer});

export default markdown;
