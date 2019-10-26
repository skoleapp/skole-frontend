import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../../components';

const FacultyDetailPage: NextPage = () => (
  <MainLayout title="Faculty Detail">
    <Typography variant="h3">Faculty Detail</Typography>
    <Typography variant="body1">Here will be faculty detail with a list of facilities.</Typography>
  </MainLayout>
);

export default FacultyDetailPage;
