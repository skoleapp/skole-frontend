import { Typography } from '@material-ui/core';
import React from 'react';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const CreateCoursePage: React.FC = () => (
  <Layout title="Create Course">
    <Typography variant="h5">Create Course</Typography>
  </Layout>
);

export default withAuthSync(CreateCoursePage);
