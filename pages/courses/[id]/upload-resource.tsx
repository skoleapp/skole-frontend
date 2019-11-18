import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

const UploadResourcePage: NextPage = () => (
  <Layout title="Upload Resource">
    <StyledCard>Here will be upload resource...</StyledCard>
  </Layout>
);

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(UploadResourcePage);
