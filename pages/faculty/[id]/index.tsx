import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../../components';

const FacultyDetailPage: NextPage = () => (
  <MainLayout title="Faculty Detail">
    <H1>Faculty Detail</H1>
    <Text>Here will be faculty detail with a list of facilities.</Text>
  </MainLayout>
);

export default FacultyDetailPage;
