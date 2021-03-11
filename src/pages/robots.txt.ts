import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // The weird indenting keeps the resulting formatting pretty.
  const robots = `User-agent: *
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
