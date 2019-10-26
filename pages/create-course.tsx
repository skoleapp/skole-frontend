import { Typography } from '@material-ui/core';
import React from 'react';
import { Layout, Text } from '../components';
import { withAuth } from '../lib';

const CreateCoursePage: React.FC = () => (
  <Layout title="Create Course">
    <Typography variant="h5">Create Course</Typography>
    <Text>Course creation form will be shown here.</Text>
  </Layout>
);

export default withAuth(CreateCoursePage);
