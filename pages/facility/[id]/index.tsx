import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../../components';

const FacilityDetailPage: NextPage = () => (
  <MainLayout title="Facility Detail">
    <H1>Facility Detail</H1>
    <Text>Here will be facility detail with a list of courses provided by that facility.</Text>
  </MainLayout>
);

export default FacilityDetailPage;
