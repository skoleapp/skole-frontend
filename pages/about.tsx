import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';
import { withTranslation } from '../i18n';

const AboutPage: NextPage = () => (
  <Layout heading="About" title="About" backUrl="/">
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

export default compose(withRedux, withApollo, withTranslation('common'))(AboutPage);
