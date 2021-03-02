import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import csso from 'csso';
import sass from 'node-sass';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

let css = fs.readFileSync(path.resolve(__dirname, `../scss/main.scss`));

const components = fs.readdirSync(path.resolve(__dirname, `../scss/components`));
components.forEach((file) => {
  css += `@import 'src/scss/components/${file}';\n`;
});

css = sass.renderSync({
  data: css.toString()
}).css;
css = csso.minify(css.toString()).css;
const cssHash = crypto.createHash('sha256').update(css).digest('base64');

export {css, cssHash};
