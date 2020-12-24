import { NextApiResponse } from 'next';

const RobotsTxt = (): void => {};

interface Props {
  props: Record<string, never>;
}

export const getServerSideProps = ({ res }: { res: NextApiResponse }): Props => {
  // The trailing slash in /account/ means to disallow all subpages.
  const paths = ['/404', '/logout', '/account/', '/add-course', '/upload-resource'];

  const disallowed = [];

  // Unlike in sitemap, here we want to explicitly disallow the (non-canonical) /en paths as well.
  for (const lang of ['', '/en', '/fi', '/sv']) {
    for (const path of paths) {
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

export default RobotsTxt;
