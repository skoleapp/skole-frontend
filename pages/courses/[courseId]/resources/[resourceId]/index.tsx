import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../../../../../components';
import { SkoleContext } from '../../../../../interfaces';
import { withApollo, withRedux } from '../../../../../lib';
import { useAuthSync } from '../../../../../utils';

const ResourceDetailPage: NextPage = () => (
  <Layout title="Resource Detail" backUrl>
    <StyledCard>
      <CardHeader title="Resource Detail" />
      <SlimCardContent>Here will be resource detail...</SlimCardContent>
    </StyledCard>
  </Layout>
);

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext) => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(ResourceDetailPage);
