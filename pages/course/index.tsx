import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';

const CourseListPage: NextPage = () => (
  <Layout title="Course List">
    <Typography variant="h5">Course List</Typography>
    <Typography variant="body1">Here will be list of all courses.</Typography>
  </Layout>
);

export default CourseListPage;
