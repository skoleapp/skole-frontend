import React from 'react';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { withAuthSync } from '../../../utils';

const CourseDiscussion: React.FC = () => (
  <Layout heading="Course Discussion" title="Course Discussion" backUrl="/courses">
    <StyledCard>Course discussion will be here...</StyledCard>
  </Layout>
);

export default withAuthSync(CourseDiscussion);
