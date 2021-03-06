import * as path from 'https://deno.land/std/path/mod.ts';
import * as svelte from 'svelte/compiler';
import * as terser from 'terser';

const pwd = path.dirname(new URL(import.meta.url).pathname);

const create = async () => {
  let app = await Deno.readTextFile(`${pwd}/../svelte/app.js`);

  const imports = /^import (.+?) from '(.*?)';$/gm;
  const matches = [...app.matchAll(imports)];

  app = app.replace(imports, '');

  matches.forEach((item) => {
    const component = item[1];
    let code = Deno.readTextFileSync(
      path.resolve(`${pwd}/../svelte/${item[2]}`)
    );
    code = svelte.compile(code, {
      name: `${component}2`
    }).js.code;
    code = code.replace(
      `export default ${component}2;`,
      `${component} = ${component}2;`
    );


    app = `\nlet ${component}; (() => { ${code} })();\n${app}`;
  });

  app = app.replace(/^import (.+?);$/gms, '');
  // app = `import "svelte";\n${app}`;
  // app = `import "svelte/internal";\n${app}`;

  app = `
import {
HtmlTag,
SvelteComponent,
append,
attr,
binding_callbacks,
detach,
element,
empty,
init,
insert,
listen,
noop,
safe_not_equal,
space,
text
} from "svelte/internal";

import { onMount } from "svelte";
${app}`;

  const bundle = `${pwd}/../svelte/app.bundle.js`;

  await Deno.writeTextFile(bundle, app);

  const {files} = await Deno.emit(bundle, {
    bundle: 'esm',
    importMapPath: `${pwd}/imports.json`
  });

  await Deno.remove(bundle);

  // return Object.values(files)[0];
  app = await terser.minify(Object.values(files)[0], {
    toplevel: true
  });
  return app.code;
};

export {create};
