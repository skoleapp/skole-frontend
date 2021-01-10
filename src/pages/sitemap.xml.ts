import { GetServerSideProps } from 'next';
import { SitemapDocument } from 'generated';
import { initApolloClient } from 'lib';
import { DYNAMIC_PATHS, LOCALE_PATHS, urls } from 'utils';

export default (): void => {};

const toUrl = (path: string, modified: string): string => {
  // Slice just the date portion from the ISO datetime.
  const lastmod = modified ? `<lastmod>${modified.slice(0, 10)}</lastmod>` : '';

  return `
    <url>
      <loc>${process.env.FRONTEND_URL}${path}</loc>
      ${lastmod}
    </url>`;
};

const createSitemap = (routes: { path: string; modified: string }[]): string =>
  // This xmlns URL has to use http.
  `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    >
      ${routes.map((route) => toUrl(route.path, route.modified)).join('')}
    </urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const modified = process.env.BUILD_DATE || new Date().toISOString();

  const staticPaths = [
    '', // Don't want the index page to have a slash.
    urls.addCourse,
    urls.contact,
    urls.forTeachers,
    urls.guidelines,
    urls.home,
    urls.login,
    urls.privacy,
    urls.register,
    urls.score,
    urls.search,
    urls.terms,
    urls.uploadResource,
    urls.values,
  ];

  const paths = staticPaths.map((path) => ({ path, modified }));
  const apolloClient = initApolloClient();

  try {
    const { data } = await apolloClient.query({
      query: SitemapDocument,
    });

    for (const page of DYNAMIC_PATHS) {
      for (const entry of data.sitemap[page]) {
        paths.push({
          path: `/${page}/${entry.id}`,
          modified: entry.modified,
        });
      }
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
  } catch {
    res.statusCode = 500;
  }

  res.end();

  return {
    props: {},
  };
};
