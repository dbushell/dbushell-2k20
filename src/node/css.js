import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sass from 'sass';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

let css = fs.readFileSync(path.resolve(__dirname, `../scss/main.scss`));

const components = fs.readdirSync(
  path.resolve(__dirname, `../scss/components`)
);

components.forEach((file) => {
  css += `@import 'src/scss/components/${file}';\n`;
});

css = sass.renderSync({
  data: css.toString(),
  outputStyle: 'compressed'
}).css;

css = css.toString().trim();

const cssHash = crypto.createHash('sha256').update(css).digest('base64');

export {css, cssHash};
