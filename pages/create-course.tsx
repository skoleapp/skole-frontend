import { Typography } from '@material-ui/core';
import React from 'react';
import { MainLayout, Text } from '../components';
import { withAuth } from '../lib';

const CreateCoursePage: React.FC = () => (
  <MainLayout title="Create Course">
    <Typography variant="h5">Create Course</Typography>
    <Text>Course creation form will be shown here.</Text>
  </MainLayout>
);

export default withAuth(CreateCoursePage);
