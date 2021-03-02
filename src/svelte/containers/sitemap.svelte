<script>

export let entries;

const loc = 'https://dbushell.com';

</script>
{@html '<?xml version="1.0" encoding="UTF-8"?>'}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {#each entries as entry}
  <url>
    <loc>{loc}{entry.loc}</loc>
    <lastmod>{entry.lastmod}</lastmod>
    <changefreq>{entry.changefreq}</changefreq>
    <priority>{entry.priority}</priority>
  </url>
  {/each}
</urlset>
