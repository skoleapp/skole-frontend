import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../containers';
import { withAuthSync } from '../../utils';

const CourseDetailPage: NextPage = () => (
  <Layout title="Course Detail">
    <Typography variant="h5">Course Detail</Typography>
  </Layout>
);

export default withAuthSync(CourseDetailPage);
