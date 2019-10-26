import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout, Text } from '../../components';

const FacilityListPage: NextPage = () => (
  <MainLayout title="Facility List">
    <Typography variant="h5">Facility List</Typography>
    <Text>Here will be list of facilities.</Text>
  </MainLayout>
);

export default FacilityListPage;
