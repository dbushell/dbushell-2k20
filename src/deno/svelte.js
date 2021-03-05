import * as path from 'https://deno.land/std/path/mod.ts';
import {ensureFile} from 'https://deno.land/std/fs/mod.ts';
import * as svelte from 'https://cdn.skypack.dev/svelte/compiler.mjs';

const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder('utf-8');

const pwd = path.dirname(new URL(import.meta.url).pathname);

const cacheDir = `${pwd}/.svelte`;

const dynamic = async (modPath) =>
  await import(modPath).then((mod) => mod.default);

const compileSvelte = async (path) => {
  let src = await Deno.readFile(path);
  src = decoder.decode(src);
  src = svelte.compile(src, {generate: 'ssr'}).js.code;
  src = src.replace(
    'from "svelte/internal";',
    `from 'https://cdn.skypack.dev/svelte/internal.mjs';`
  );
  src = src.replace(
    'from "svelte";',
    `from 'https://cdn.skypack.dev/svelte/';`
  );
  src = src.replace(/(import .+? from ".+?\.svelte)";$/gm, '$1.js";');
  return src;
};

const compileDir = async (dirPath, outDirPath = cacheDir) => {
  const dirName = path.basename(dirPath);
  const promises = [];
  for await (const entry of Deno.readDir(dirPath)) {
    if (entry.isFile && /.svelte$/.test(entry.name)) {
      promises.push(
        new Promise(async (resolve) => {
          let srcIn = `${dirPath}/${entry.name}`;
          let srcOut = `${outDirPath}/${dirName}/${entry.name}.js`;
          const src = await compileSvelte(srcIn);
          await ensureFile(srcOut);
          await Deno.writeFile(srcOut, encoder.encode(src));
          // console.log(`✨ ${dirName}/${entry.name}`);
          resolve();
        })
      );
    }
  }
  return Promise.all(promises).then(() => {
    console.log(`✨ Compiled: ${dirName}`);
  });
};

const compile = async () => {
  await Promise.all([
    compileDir(`${pwd}/../svelte/containers`),
    compileDir(`${pwd}/../svelte/components`)
  ]);
  return cacheDir;
}

export default compile;
