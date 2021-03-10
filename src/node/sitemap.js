const sitemapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{entries}}
</urlset>
`;

const sitemapEntry = `<url>
  <loc>https://dbushell.com{{loc}}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>{{changefreq}}</changefreq>
  <priority>{{priority}}</priority>
</url>
`;

const render = (sitemap) => {
  const entries = sitemap.map((entry) => {
    let xml = sitemapEntry;
    for (let [key, value] of Object.entries(entry)) {
      xml = xml.replace(`{{${key}}}`, value);
    }
    return xml;
  });
  return sitemapTemplate.replace(`{{entries}}`, entries.join(''));
};

export default render;
