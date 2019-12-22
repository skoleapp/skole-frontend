import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../../../../../../components';
import { SkoleContext } from '../../../../../../interfaces';
import { withApollo, withRedux } from '../../../../../../lib';
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

export default compose(withApollo, withRedux)(ExerciseDetailPage);
