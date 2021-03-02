import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import striptags from 'striptags';
import markdown from './markdown.js';
import {formatDate} from './i18n.js';

/**
 * Return JSON data from YML front-matter for file.
 */
const getMatter = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err.toString());
      }
      if (!frontMatter.test(data)) {
        return resolve();
      }
      const matter = frontMatter(data);
      matter.__path = file;
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

  props.href = `/${matter.attributes.slug}/`;

  if ('date' in matter.attributes) {
    const date = new Date(matter.attributes.date);
    props.unix = date.valueOf();
    props.date = formatDate(date);
    props.href = path.join(
      '/',
      props.date.YYYY.toString(),
      props.date.MM.toString(),
      props.date.DD.toString(),
      matter.attributes.slug,
      '/'
    );
  }

  props.__path = matter.__path;

  return props;
};

export {getMatter, getAllMatter, propsFromMatter};
