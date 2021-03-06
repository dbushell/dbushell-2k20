import * as fs from 'https://deno.land/std/fs/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts';
import * as svelte from 'https://cdn.skypack.dev/svelte/compiler.mjs';

const pwd = path.dirname(new URL(import.meta.url).pathname);

const cacheDir = `${pwd}/.svelte`;

const compileFile = async (path) => {
  let src = await Deno.readTextFile(path);
  src = svelte.compile(src, {generate: 'ssr'}).js.code;
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
          const src = await compileFile(srcIn);
          await fs.ensureFile(srcOut);
          await Deno.writeTextFile(srcOut, src);
          resolve();
        })
      );
    }
  }
  return Promise.all(promises).then(() => {
    console.log(`✦ Compiled ${promises.length} ${dirName}`);
  });
};

const compile = async () => {
  console.log('✧ Compiling Svelte');
  await Promise.all([
    compileDir(`${pwd}/../svelte/containers`),
    compileDir(`${pwd}/../svelte/components`)
  ]);
  return cacheDir;
};

export {VERSION as version} from 'https://cdn.skypack.dev/svelte/compiler.mjs';
export {compile};
