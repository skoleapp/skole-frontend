import { GetServerSideProps } from 'next';
import { DISALLOWED_PATHS } from 'utils';

export default (): void => {};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const disallowed = [];

  // Unlike in sitemap, here we want to explicitly disallow the (non-canonical) /en paths as well.
  for (const lang of ['', '/en', '/fi', '/sv']) {
    for (const path of DISALLOWED_PATHS) {
      disallowed.push(`Disallow: ${lang}${path}`);
    }
  }

  const robots = `User-agent: *
${disallowed.join('\n')}
Sitemap: ${process.env.FRONTEND_URL}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();

  return {
    props: {},
  };
};
