import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout, Text } from '../../../components';

const CourseDetailPage: NextPage = () => (
  <MainLayout title="Course Detail">
    <Typography variant="h5">Course Detail</Typography>
    <Text>Here will be course detail.</Text>
  </MainLayout>
);

export default CourseDetailPage;
