import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout, Text } from '../../components';

const CourseListPage: NextPage = () => (
  <MainLayout title="Course List">
    <Typography variant="h3">Course List</Typography>
    <Text>Here will be list of all courses.</Text>
  </MainLayout>
);

export default CourseListPage;
