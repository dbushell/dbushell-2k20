const template = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{entries}}
</urlset>
`;

const entry = `<url>
  <loc>https://dbushell.com{{href}}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>{{changefreq}}</changefreq>
  <priority>{{priority}}</priority>
</url>
`;

const render = (locations) => {
  locations.reverse();
  const entries = locations.map((item) => {
    if (item.href === '/404/') {
      return '';
    }
    if (item.href === '/offline/') {
      return '';
    }
    let xml = entry;
    for (let [key, value] of Object.entries(item)) {
      xml = xml.replace(`{{${key}}}`, value);
    }
    return xml;
  });
  return template.replace(`{{entries}}`, entries.join(''));
};

export {render};
