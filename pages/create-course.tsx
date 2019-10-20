import React from 'react';
import { H1, MainLayout, Text } from '../components';
import { withAuthSync } from '../lib';

const CreateCoursePage: React.FC = () => (
  <MainLayout title="Create Course">
    <H1>Create Course</H1>
    <Text>Course creation form will be shown here.</Text>
  </MainLayout>
);

export default withAuthSync(CreateCoursePage);
