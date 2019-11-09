import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../containers';
import { withAuthSync } from '../../utils';

const CourseListPage: NextPage = () => (
  <Layout title="Course List">
    <Typography variant="h5">Course List</Typography>
  </Layout>
);

export default withAuthSync(CourseListPage);
