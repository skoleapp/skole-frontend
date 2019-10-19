import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../components';

const SubjectListPage: NextPage = () => (
  <MainLayout title="Subject List">
    <H1>Subject List</H1>
    <Text>Here will be list of all subjects.</Text>
  </MainLayout>
);

export default SubjectListPage;
