import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, SlimCardContent, StyledCard } from '../../../components';
import { SkoleContext } from '../../../interfaces';
import { useAuthSync } from '../../../utils';

const CourseDiscussion: NextPage = () => (
  <Layout heading="Course Discussion" title="Course Discussion" backUrl>
    <StyledCard>
      <CardHeader title="Course Discussion" />
      <SlimCardContent>Course discussion will be here...</SlimCardContent>
    </StyledCard>
  </Layout>
);

CourseDiscussion.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default CourseDiscussion;
