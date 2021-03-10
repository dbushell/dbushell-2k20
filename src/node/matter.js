import fs from 'fs';
import path from 'path';
import striptags from 'striptags';
import markdown from './markdown.js';
import {dateProps} from './datetime.js';

/**
 * Return JSON data from YML front-matter for file.
 */
const getMatter = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, body) => {
      if (err) {
        return reject(err.toString());
      }
      const matter = {
        body: body.toString().trim(),
        attributes: {},
        front: []
      };
      const match = matter.body.match(
        /([\s\n]*-{3,}[\s\n]+)(?<front>.+?)([\s\n]+-{3,}[\s\n]+)(?<body>.*)/s
      );
      if (match) {
        matter.front = match.groups.front.trim().split('\n');
        matter.body = match.groups.body.trim();
      }
      if (!matter.front.length) {
        console.log(`⚠️ Missing front: ${file}`);
      }
      matter.front.forEach((attr) => {
        const i = attr.indexOf(':');
        const key = attr.slice(0, i).trim();
        const value = attr.slice(i + 1).trim();
        matter.attributes[key] = value.replace(/^['"]+|['"]+$/g, '');
      });
      if (!('slug' in matter.attributes)) {
        console.log(`⚠️ Missing slug: ${file}`);
      }
      if (!('title' in matter.attributes)) {
        console.log(`⚠️ Missing title: ${file}`);
      }
      resolve(matter);
    });
  });
};

/**
 * Return JSON data from YML front-matter for directory recursively.
 */
const getAllMatter = async (dir) => {
  const promises = [];
  const readDir = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.resolve(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        return readDir(filePath);
      }
      if (path.extname(filePath) === '.md') {
        promises.push(getMatter(filePath));
      }
    });
  };
  readDir(dir);
  return Promise.all(promises);
};

/**
 * Process YML front-matter
 */
const propsFromMatter = (matter) => {
  const props = {};

  // Pass title through Marked for smartypants
  props.title = markdown(matter.attributes.title);
  props.title = striptags(props.title).trim();

  // Pass title through Marked for smartypants
  if (matter.attributes.description) {
    props.description = markdown(matter.attributes.description);
    props.description = striptags(props.description).trim();
  }

  // Pass body through Marked for full HTML
  props.body = markdown(matter.body);

  props.excerpt = props.body.replace(/<pre>.+?<\/pre>/gs, '');
  props.excerpt = striptags(props.excerpt);
  const words = props.excerpt.split(' ');
  if (words.length >= 55) {
    props.excerpt = `${words.slice(0, 55).join(' ')} […]`;
  }
  props.excerpt = props.excerpt.trim();

  props.href = `/${matter.attributes.slug}/`;

  if ('date' in matter.attributes) {
    const date = new Date(matter.attributes.date);
    props.unix = date.valueOf();
    props.date = dateProps(date);
    props.href = path.join(
      '/',
      props.date.YYYY.toString(),
      props.date.MM.toString(),
      props.date.DD.toString(),
      matter.attributes.slug,
      '/'
    );
  }

  return props;
};

export {getMatter, getAllMatter, propsFromMatter};
