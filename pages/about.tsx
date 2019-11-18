import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const AboutPage: NextPage = () => (
  <Layout heading="About" title="About" backUrl="/">
    <StyledCard>Here will be about content...</StyledCard>
  </Layout>
);

AboutPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(AboutPage);
