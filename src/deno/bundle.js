import * as path from 'https://deno.land/std@0.100.0/path/mod.ts';
import * as svelte from 'https://cdn.skypack.dev/svelte/compiler.mjs';

console.log('✧ Working JavaScript bundle');

const now = performance.now();

const pwd = path.dirname(new URL(import.meta.url).pathname);
const dest = path.resolve(`${pwd}/../../public`);

const create = async () => {
  const terser = await import('https://cdn.skypack.dev/terser');

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

  const process = Deno.run({
    cmd: [
      'deno',
      'bundle',
      '--import-map',
      path.resolve(`${pwd}/imports.json`),
      bundle,
      bundle
    ]
  });
  const status = await process.status();
  process.close();

  app = await Deno.readTextFile(bundle);
  await Deno.remove(bundle);

  app = await terser.minify(app, {
    toplevel: true
  });

  return app.code;
};

try {
  const app = await create();
  await Deno.writeTextFile(`${dest}/assets/js/app.min.js`, app);
} catch (err) {
  console.log(err);
}

self.postMessage(`✹ Bundled in ${Math.round(performance.now() - now)}ms`);
