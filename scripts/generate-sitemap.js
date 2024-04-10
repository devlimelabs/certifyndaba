const { convert } = require('xmlbuilder2');
const { promises: fs } = require('fs');

(async () => {
  const domain = process?.argv?.[2] ? process.argv[2] : process.env?.SITEMAP_DOMAIN;

  if (!domain) {
    console.error(`Please provide a domain name as the first argument to the script!`);
    process.exit(1);
  }

  const routes = (await fs.readFile(`${process.cwd()}/routes.txt`, 'utf8'))?.split('\n');

  if (!routes.length) {
    console.error('No routes found in routes.txt');
    process.exit(1);
  }

  console.info(`${routes.length} Routes Found!`);

  console.info('Generating sitemap...');

  const sitemapXMLObj = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: [
        {
          loc: `${domain}`,
          lastmod: '2024-04-09',
          changefreq: 'weekly',
          priority: '1.0'
        }
      ]
    }
  };

  for (const route of routes) {
    sitemapXMLObj.urlset.url.push({
      loc: `${domain}${route}`,
      lastmod: new Date().toISOString()?.split('T')?.[0]?.split(' ')?.[0]
    });
  }

  const xmlString = convert({ encoding: 'UTF-8' }, sitemapXMLObj, { prettyPrint: true });

  console.info('Sitemap generated successfully!');

  const savePath = `${process.cwd()}/src/sitemap.xml`;

  console.info('Saving sitemap to: ', savePath);

  await fs.writeFile(savePath, xmlString);

  console.info('Sitemap saved successfully!');
})();
