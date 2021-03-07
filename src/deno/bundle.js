import * as path from 'https://deno.land/std/path/mod.ts';
import * as svelte from 'https://cdn.skypack.dev/svelte/compiler.mjs';
import * as terser from 'https://cdn.skypack.dev/terser';

const start = new Date();

console.log('✧ Working JavaScript bundle');

const pwd = path.dirname(new URL(import.meta.url).pathname);
const dest = path.resolve(`${pwd}/../../public`);

const create = async () => {
  let app = await Deno.readTextFile(`${pwd}/../svelte/app.js`);

  // Extract component imports
  const imports = /^import (.+?) from '(.*?\.svelte)';$/gm;
  const components = [...app.matchAll(imports)];
  app = app.replace(imports, '');

  // Store non-unique sub imports within component
  const deps = {};

  components.forEach((item) => {
    // Read source
    const name = item[1];
    let code = Deno.readTextFileSync(
      path.resolve(`${pwd}/../svelte/${item[2]}`)
    );

    // Compile Svelte component
    code = svelte.compile(code, {
      name: `${name}Component`
    }).js.code;

    // Replace generic export with named component
    code = code.replace(
      `export default ${name}Component;`,
      `${name} = ${name}Component;`
    );

    // Extract component sub imports
    const imports = [
      ...code.matchAll(/^import.+?{(.+?)}.+?from "([^"]+?)";$/gms)
    ];
    imports.forEach((dep) => {
      const id = dep[2].trim();
      deps[id] = (deps[id] || []).concat(
        dep[1].split(',').map((d) => d.trim())
      );
    });
    code = code.replace(/^import (.+?);$/gms, '');

    // Wrap in scoped block and expose named class
    app = `\nlet ${name}; (() => { ${code} })();\n${app}`;
  });

  // Append unique imports to top of bundle
  for (const [id, arr] of Object.entries(deps)) {
    app = `import { ${[...new Set(arr)].join(', ')} } from "${id}";\n${app}`;
  }

  const bundle = path.resolve(`${pwd}/../svelte/app.bundle.js`);
  await Deno.writeTextFile(bundle, app);

  const {files} = await Deno.emit(bundle, {
    check: false,
    bundle: 'esm',
    importMapPath: `${pwd}/imports.json`
  });

  await Deno.remove(bundle);

  app = await terser.minify(Object.values(files)[0], {
    toplevel: true
  });

  return app.code;
};

const app = await create();
await Deno.writeTextFile(`${dest}/assets/js/app.min.js`, app);

self.postMessage(`✹ Bundled in ${new Date() - start}ms`);
