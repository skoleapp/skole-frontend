import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text, ListingPage } from '../../components';

const SchoolListPage: NextPage = () => (
  <MainLayout title="School List">
    <H1>School List</H1>
    <Text>Here will be list of all schools.</Text>
    <ListingPage />
  </MainLayout>
);

export default SchoolListPage;
