import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../components';
import { withAuth } from '../../lib';

const SchoolListPage: NextPage = () => (
  <MainLayout title="School List">
    <Typography variant="h3">School List</Typography>
    <Typography variant="body1">Here will be list of all schools.</Typography>
  </MainLayout>
);

export default withAuth(SchoolListPage);
