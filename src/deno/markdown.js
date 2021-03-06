import marked from 'https://cdn.skypack.dev/marked';
import * as format from './format.js';

await import('https://cdn.skypack.dev/prismjs');
await import(`https://cdn.skypack.dev/prismjs/components/prism-jsx.js`);
await import(`https://cdn.skypack.dev/prismjs/components/prism-bash.js`);
await import(`https://cdn.skypack.dev/prism-svelte`);

const languages = Object.keys(Prism.languages);

marked.setOptions({
  smartypants: true,
  langPrefix: 'language-',
  highlight: (code, lang) => {
    if (languages.includes(lang)) {
      code = Prism.highlight(code, Prism.languages[lang]);
    }
    return code;
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
  let out = `<a href="${format.escapeHTML(href)}"`;
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
