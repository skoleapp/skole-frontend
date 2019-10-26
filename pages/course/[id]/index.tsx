import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';

const CourseDetailPage: NextPage = () => (
  <Layout title="Course Detail">
    <Typography variant="h5">Course Detail</Typography>
    <Typography variant="body1">Here will be course detail.</Typography>
  </Layout>
);

export default CourseDetailPage;
