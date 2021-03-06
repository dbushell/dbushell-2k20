import * as path from 'path';
import * as base64 from 'base64';

const pwd = path.dirname(new URL(import.meta.url).pathname);
const scssPath = `${pwd}/../scss/main.scss`;

const process = async () => {
  console.log('✧ Processing CSS');

  const scssDir = path.dirname(scssPath);
  let css = await Deno.readTextFile(scssPath);

  // Fix relative imports
  css = css.replaceAll(`@import 'src/scss`, `@import '${scssDir}`);

  // Expand component imports
  const components = `${scssDir}/components`;
  for await (const entry of Deno.readDir(components)) {
    if (entry.isFile && /^[^_].+\.scss$/.test(entry.name)) {
      css += `@import '${components}/${entry.name}';\n`;
    }
  }

  // Write temporary Sass
  await Deno.writeTextFile(`${scssDir}/tmp.scss`, css);

  // Compile CSS
  const sass = Deno.run({
    cmd: [
      `${pwd}/../../bin/${Deno.build.target}/sass`,
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

  css = await Deno.readTextFile(`${scssDir}/tmp.css`);
  css = css.trim();

  await Deno.remove(`${scssDir}/tmp.scss`);
  await Deno.remove(`${scssDir}/tmp.css`);

  let cssHash = new TextEncoder().encode(css);
  cssHash = await crypto.subtle.digest('sha-256', cssHash);
  cssHash = base64.encode(new Uint8Array(cssHash));

  console.log(`✦ Processed CSS`);

  return [css, cssHash];
};

export {process};
