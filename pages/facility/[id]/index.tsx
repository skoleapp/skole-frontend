import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout, Text } from '../../../components';

const FacilityDetailPage: NextPage = () => (
  <MainLayout title="Facility Detail">
    <Typography variant="h3">Facility Detail</Typography>
    <Text>Here will be facility detail with a list of courses provided by that facility.</Text>
  </MainLayout>
);

export default FacilityDetailPage;
