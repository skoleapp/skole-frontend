import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../components';
import { withAuth } from '../lib';

const SearchPage: NextPage = () => (
  <MainLayout title="Search">
    <Typography variant="h5">Search</Typography>
    <Typography variant="body1">Search results will be show here.</Typography>
  </MainLayout>
);

export default withAuth(SearchPage);
