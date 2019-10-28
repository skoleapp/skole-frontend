import { Typography } from '@material-ui/core';
import React from 'react';
import { Layout } from '../components';
import { withAuth } from '../lib';

const CreateCoursePage: React.FC = () => (
  <Layout title="Create Course">
    <Typography variant="h5">Create Course</Typography>
    <Typography variant="body1">Course creation form will be shown here.</Typography>
  </Layout>
);

export default withAuth(CreateCoursePage);
