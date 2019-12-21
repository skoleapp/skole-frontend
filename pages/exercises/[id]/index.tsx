import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../../../components';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

const ExerciseDiscussionPage: NextPage = () => (
  <Layout title="Exercises">
    <StyledCard>
      <CardHeader title="Exercise Discussion" />
      <SlimCardContent>Here will be exercises discussion...</SlimCardContent>
    </StyledCard>
  </Layout>
);

ExerciseDiscussionPage.getInitialProps = async (ctx: SkoleContext) => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ExerciseDiscussionPage);
