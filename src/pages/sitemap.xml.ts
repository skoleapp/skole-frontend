import { readdirSync } from 'fs';
import { SitemapDocument } from 'generated';
import { initApolloClient } from 'lib';
import { GetServerSideProps } from 'next';
import { DYNAMIC_PATHS, LOCALE_PATHS, urls } from 'utils';

const toXhtmlLink = (path: string, langName: string, langPath: string): string => {
  // If the `path` is '/sv/foo' and `langPath` is '/fi', the `hrefPath` will become '/fi/foo'.
  // Demo: https://regex101.com/r/J1P2mj/1/
  const hrefPath = path.replace(/^(\/sv|\/fi)?(?=\/|$)/, langPath);

  return `
    <xhtml:link
      rel="alternate"
      hreflang="${langName}"
      href="${process.env.FRONTEND_URL}${hrefPath}"
    />`;
};

const toUrl = (path: string, modified: string): string => {
  const languages = {
    en: '',
    fi: '/fi',
    sv: '/sv',
    'x-default': '',
  };

  const xhtmlLinks = Object.entries(languages)
    .map(([langName, langPath]) => toXhtmlLink(path, langName, langPath))
    .join('');

  return `
    <url>
      <loc>${process.env.FRONTEND_URL}${path}</loc>
      <lastmod>${modified}</lastmod>
      ${xhtmlLinks}
    </url>`;
};

const createSitemap = (routes: { path: string; modified: string }[]): string =>
  // These xmlns URLs have to use http.
  `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      ${routes.map((route) => toUrl(route.path, route.modified)).join('')}
    </urlset>`;

const laterDate = (date: string | undefined, other: string): string => {
  return !date || other > date ? other : date;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const modified = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

  const staticPaths = [
    '', // Don't want the index page to have a slash.
    urls.addCourse,
    urls.blogs,
    urls.contact,
    urls.forTeachers,
    urls.guidelines,
    urls.home,
    urls.login,
    urls.privacy,
    urls.register,
    urls.resetPassword,
    urls.score,
    urls.search,
    urls.suggestions,
    urls.terms,
    urls.uploadResource,
    urls.values,
  ];

  const paths = staticPaths.map((path) => ({ path, modified }));

  const apolloClient = initApolloClient();
  const { data } = await apolloClient.query({
    query: SitemapDocument,
  });

  for (const page of DYNAMIC_PATHS) {
    for (const entry of data.sitemap[page]) {
      paths.push({
        path: `/${page}/${entry.slug}`,
        modified: laterDate(entry.modified, modified),
      });
    }
  }

  for (const fileName of readdirSync('markdown/en/blogs')) {
    paths.push({
      path: urls.blog(fileName.replace(/\.md$/, '')),
      modified,
    });
  }

  for (const fileName of readdirSync('markdown/en/updates')) {
    paths.push({
      path: urls.update(fileName.replace(/\.md$/, '')),
      modified,
    });
  }

  const translatedPaths = [];
  for (const lang of LOCALE_PATHS) {
    for (const path of paths) {
      translatedPaths.push({
        ...path,
        path: `${lang}${path.path}`,
      });
    }
  }

  const sitemap = createSitemap(translatedPaths);
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const SitemapXml = (): void => {};

export default SitemapXml;
