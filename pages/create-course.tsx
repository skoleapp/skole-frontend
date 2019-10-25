import React from 'react';
import { H1, MainLayout, Text } from '../components';
import { withApollo } from '../lib';

const CreateCoursePage: React.FC = () => (
  <MainLayout title="Create Course">
    <H1>Create Course</H1>
    <Text>Course creation form will be shown here.</Text>
  </MainLayout>
);

export default withApollo(CreateCoursePage);
