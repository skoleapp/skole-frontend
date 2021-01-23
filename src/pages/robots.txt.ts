import { GetServerSideProps } from 'next';
import { DISALLOWED_PATHS } from 'utils';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const disallowed = [];

  // Unlike in sitemap, here we want to explicitly disallow the (non-canonical) /en paths as well.
  for (const lang of ['', '/en', '/fi', '/sv']) {
    for (const path of DISALLOWED_PATHS) {
      disallowed.push(`Disallow: ${lang}${path}`);
    }
  }

  // The weird indenting keeps the resulting formatting pretty.
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

const RobotsTxt = (): void => {};

export default RobotsTxt;
