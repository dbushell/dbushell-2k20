import {formatDate} from './datetime.js';

const url = 'https://dbushell.com';

const rssTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[dbushell.com]]></title>
    <description><![CDATA[David Bushell’s Web Design & Front-end Development Blog]]></description>
    <link>${url}</link>
    <generator>dbushell.com</generator>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="${url}/rss.xml" rel="self" type="application/rss+xml"/>
    <author><![CDATA[David Bushell]]></author>
    <language><![CDATA[en-GB]]></language>
    <webMaster><![CDATA[hi@dbushell.com (David Bushell)]]></webMaster>
{{entries}}</channel>
</rss>
`;

const rssEntry = `<item>
<title><![CDATA[{{title}}]]></title>
<description><![CDATA[<p>{{description}}</p>]]></description>
<link>${url}{{link}}</link>
<guid isPermaLink="true">${url}{{link}}</guid>
<dc:creator><![CDATA[David Bushell]]></dc:creator>
<pubDate>{{pubDate}}</pubDate>
</item>
`;

const render = (articles) => {
  const entries = articles.slice(0, 20).map((entry) => {
    let xml = rssEntry;
    xml = xml.replace(`{{title}}`, entry.title);
    xml = xml.replace(`{{description}}`, entry.excerpt);
    xml = xml.replace(/{{link}}/g, entry.href);
    xml = xml.replace(`{{pubDate}}`, entry.date.RSS);
    return xml;
  });
  let xml = rssTemplate;
  xml = xml.replace(`{{lastBuildDate}}`, formatDate().RSS);
  xml = xml.replace(`{{entries}}`, entries.join(''));
  return xml;
};

export default render;
