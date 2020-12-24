import { NextApiResponse } from 'next';
import { SitemapDocument } from 'generated';
import { initApolloClient } from 'lib';

const { FRONTEND_URL } = process.env;
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString();

const toUrl = (path: string, modified: string): string => {
  // Slice just the date portion from the ISO datetime.
  const lastmod = modified ? `<lastmod>${modified.slice(0, 10)}</lastmod>` : '';

  return `
    <url>
      <loc>${FRONTEND_URL}${path}</loc>
      ${lastmod}
    </url>`;
};

const createSitemap = (routes: { path: string; modified: string }[]): string => {
  // This xmlns URL has to use http.
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes.map((route) => toUrl(route.path, route.modified)).join('')}
    </urlset>`;
};

const SitemapXml = (): void => {};

interface Props {
  props: Record<string, never>;
}

export const getServerSideProps = async ({ res }: { res: NextApiResponse }): Promise<Props> => {
  const staticPaths = [
    '', // Don't want the index page to have a slash.
    '/contact',
    '/get-started',
    '/login',
    '/privacy',
    '/register',
    '/search',
    '/terms',
  ];
  const paths = staticPaths.map((path) => ({ path, modified: BUILD_DATE }));

  const apolloClient = initApolloClient();
  try {
    const { data } = await apolloClient.query({
      query: SitemapDocument,
    });

    for (const page of ['courses', 'resources', 'schools', 'users']) {
      for (const entry of data.sitemap[page]) {
        paths.push({
          path: `/${page}/${entry.id}`,
          modified: entry.modified,
        });
      }
    }

    const translatedPaths = [];
    for (const lang of ['', '/fi', '/sv']) {
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

export default SitemapXml;
