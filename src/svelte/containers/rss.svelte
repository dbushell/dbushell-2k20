<script>

export let lastBuildDate;
export let entries;

const title = 'dbushell.com';
const description = 'David Bushell’s Web Design & Front-end Development Blog';
const author = 'hi@dbushell.com (David Bushell)';
const link = 'https://dbushell.com';
const generator = 'dbushell.com';
const language = 'en-GB';

const cdata = (str)=> (`<![CDATA[${str}]]>`)

</script>
{@html '<?xml version="1.0" encoding="UTF-8"?>'}
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{@html cdata(title)}</title>
    <description>{@html cdata(description)}</description>
    {@html `<link>${link}</link>`}
    <author>{@html cdata(author)}</author>
    <generator>{generator}</generator>
    <lastBuildDate>{lastBuildDate}</lastBuildDate>
    {@html `<atom:link href="${link}/rss.xml" rel="self" type="application/rss+xml"/>`}
    <language>{@html cdata(language)}</language>
    <webMaster>{@html cdata(author)}</webMaster>
    {#each entries as entry}
    <item>
      <title>{@html cdata(entry.title)}</title>
      <description>{@html cdata(`<p>${entry.description.trim()}</p>`)}</description>
      {@html `<link>${link}${entry.link}</link>`}
      <guid isPermaLink="true">{link}{entry.link}</guid>
      <dc:creator>{@html cdata(author)}</dc:creator>
      <pubDate>{entry.pubDate}</pubDate>
    </item>
    {/each}
  </channel>
</rss>
