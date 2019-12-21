import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, SlimCardContent, StyledCard } from '../../../../../../components';
import { SkoleContext } from '../../../../../../interfaces';
import { useAuthSync } from '../../../../../../utils';

const ExerciseDetailPage: NextPage = () => (
  <Layout title="Exercise Detail">
    <StyledCard>
      <CardHeader title="Exercise Detail" />
      <SlimCardContent>Here will be exercise detail...</SlimCardContent>
    </StyledCard>
  </Layout>
);

ExerciseDetailPage.getInitialProps = async (ctx: SkoleContext) => {
  await useAuthSync(ctx);
  return {};
};

export default ExerciseDetailPage;
