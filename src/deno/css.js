import * as path from 'https://deno.land/std/path/mod.ts';
import {createHash} from 'https://deno.land/std/hash/mod.ts';

const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder('utf-8');

const processCSS = async (scssPath) => {
  const scssDir = path.dirname(scssPath);
  let css = await Deno.readFile(scssPath);
  css = decoder.decode(css);

  // Fix relative imports
  css = css.replaceAll(`@import 'src/scss`, `@import '${scssDir}`);

  // Expand component imports
  const components = `${scssDir}/components`;
  for await (const entry of Deno.readDir(components)) {
    if (entry.isFile && /.scss$/.test(entry.name)) {
      css += `@import '${components}/${entry.name}';\n`;
    }
  }

  // Write temporary Sass
  await Deno.writeFile(`${scssDir}/tmp.scss`, encoder.encode(css));

  // Compile CSS
  const sass = Deno.run({
    cmd: [
      `${scssDir}/../bin/${Deno.build.target}/sass`,
      `--no-source-map`,
      `--style=compressed`,
      `${scssDir}/tmp.scss:${scssDir}/tmp.css`
    ]
  });
  const status = await sass.status();
  sass.close();

  if (!status.success) {
    throw new Error('Sass compilation error.');
  }

  css = await Deno.readFile(`${scssDir}/tmp.css`);
  css = decoder.decode(css).trim();

  await Deno.remove(`${scssDir}/tmp.scss`);
  await Deno.remove(`${scssDir}/tmp.css`);

  const cssHash = createHash('sha256').update(css).toString('base64');

  return [css, cssHash];
};

export {processCSS};
