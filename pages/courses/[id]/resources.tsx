import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

const ResourcesPage: NextPage = () => (
  <Layout heading="Resources" title="Resources" backUrl="/courses">
    <StyledCard>Course resources will be here...</StyledCard>
  </Layout>
);

ResourcesPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ResourcesPage);
