import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import striptags from 'striptags';

import markdown from './markdown.js';
import * as datetime from './datetime.js';

const pwd = path.dirname(new URL(import.meta.url).pathname);

const readProps = async (file) => {
  let front;
  let body = await Deno.readTextFile(file);

  const match = body.match(
    /([\s\n]*-{3,}[\s\n]+)(?<front>.+?)([\s\n]+-{3,}[\s\n]+)(?<body>.*)/s
  );
  if (match) {
    front = yaml.parse(match.groups.front);
    body = match.groups.body.trim();
  } else {
    console.log(`⚠ Missing front: ${file}`);
    return null;
  }

  const props = {body};

  // Pass title and description through Marked for smartypants
  props.title = markdown(front.title);
  props.title = striptags(props.title).trim();

  if (front.description) {
    props.description = markdown(front.description);
    props.description = striptags(props.description).trim();
  }

  // Pass body through Marked for full HTML
  props.body = markdown(props.body);

  props.excerpt = props.body.replace(/<pre>.+?<\/pre>/gs, '');
  props.excerpt = striptags(props.excerpt);
  const words = props.excerpt.split(' ');
  if (words.length >= 55) {
    props.excerpt = `${words.slice(0, 55).join(' ')} […]`;
  }
  props.excerpt = props.excerpt.trim();

  props.href = `/${front.slug}/`;

  if (front.date) {
    const date = new Date(front.date);
    props.unix = date.valueOf();
    props.date = datetime.dateProps(date);
    props.href =
      '/' +
      [
        props.date.YYYY.toString(),
        props.date.MM.toString(),
        props.date.DD.toString(),
        front.slug
      ].join('/') +
      '/';
  }

  return props;
};

const readGlob = async (glob) => {
  const arr = [];
  const promises = [];
  for await (const entry of fs.expandGlob(glob)) {
    if (entry.isFile && /.md$/.test(entry.name)) {
      promises.push(readProps(entry.path).then((props) => arr.push(props)));
    }
  }
  await Promise.all(promises);
  return arr;
};

const readArticles = async () => {
  console.log('✧ Reading articles');
  const arr = await readGlob(`${pwd}/../data/blog/**/*.md`);
  arr.sort((a, b) => (a.unix < b.unix ? 1 : -1));
  console.log(`✦ Read ${arr.length} articles`);
  return [arr, arr.slice(0, 10)];
};

const readPages = async () => {
  console.log('✧ Reading pages');
  const [a, b] = await Promise.all([
    readGlob(`${pwd}/../data/pages/*.md`),
    readGlob(`${pwd}/../data/portfolio/*.md`)
  ]);
  const arr = [...a, ...b];
  console.log(`✦ Read ${arr.length} pages`);
  return arr;
};

export {readArticles, readGlob, readPages, readProps};
