import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

const CourseDiscussion: NextPage = () => (
  <Layout heading="Course Discussion" title="Course Discussion" backUrl="/courses">
    <StyledCard>Course discussion will be here...</StyledCard>
  </Layout>
);

CourseDiscussion.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(CourseDiscussion);
