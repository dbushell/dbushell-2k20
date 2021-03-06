import * as path from 'https://deno.land/std/path/mod.ts';
import * as hash from 'https://deno.land/std/hash/mod.ts';

const compile = async (scssPath) => {
  const scssDir = path.dirname(scssPath);
  let css = await Deno.readTextFile(scssPath);

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
  await Deno.writeTextFile(`${scssDir}/tmp.scss`, css);

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

  css = await Deno.readTextFile(`${scssDir}/tmp.css`);
  css = css.trim();

  await Deno.remove(`${scssDir}/tmp.scss`);
  await Deno.remove(`${scssDir}/tmp.css`);

  const cssHash = hash.createHash('sha256').update(css).toString('base64');

  return [css, cssHash];
};

export default compile;
