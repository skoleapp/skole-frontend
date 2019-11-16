import { NextPage } from 'next';
import React from 'react';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { withAuthSync } from '../../../utils';

const CourseDetailPage: NextPage = () => (
  <Layout heading="Course Detail" title="Course Detail" backUrl="/courses">
    <StyledCard>Here will be course detail...</StyledCard>
  </Layout>
);

export default withAuthSync(CourseDetailPage);
