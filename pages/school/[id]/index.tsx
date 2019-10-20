import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../../components';

const SchoolDetailPage: NextPage = () => (
  <MainLayout title="School Detail">
    <H1>School Detail</H1>
    <Text>Here will be school detail with a list of faculties of that school.</Text>
  </MainLayout>
);

export default SchoolDetailPage;
