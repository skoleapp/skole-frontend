import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../components';

const FacilityListPage: NextPage = () => (
  <MainLayout title="Facility List">
    <H1>Facility List</H1>
    <Text>Here will be list of facilities.</Text>
  </MainLayout>
);

export default FacilityListPage;
