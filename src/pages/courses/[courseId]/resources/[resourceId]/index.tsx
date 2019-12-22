import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, SlimCardContent, StyledCard } from '../../../../../components';
import { SkoleContext } from '../../../../../interfaces';
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

export default ResourceDetailPage;
