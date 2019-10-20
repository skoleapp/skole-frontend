import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../components';

const FacultyListPage: NextPage = () => (
  <MainLayout title="Faculty List">
    <H1>Faculty List</H1>
    <Text>Here will be list of all faculties.</Text>
  </MainLayout>
);

export default FacultyListPage;
