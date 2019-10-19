import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../components';

const CourseListPage: NextPage = () => (
  <MainLayout title="Course List">
    <H1>Course List</H1>
    <Text>Here will be list of all courses.</Text>
  </MainLayout>
);

export default CourseListPage;
