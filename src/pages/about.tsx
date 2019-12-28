import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { withApollo, withRedux } from '../lib';
import { SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const AboutPage: NextPage = () => (
  <Layout heading="About" title="About" backUrl>
    <StyledCard>
      <CardHeader title="About" />
      <SlimCardContent>Here will wil about content...</SlimCardContent>
    </StyledCard>
  </Layout>
);

AboutPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(AboutPage);
