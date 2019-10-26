import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../components';

const SubjectListPage: NextPage = () => (
  <MainLayout title="Subject List">
    <Typography variant="h3">Subject List</Typography>
    <Typography variant="body1">Here will be list of all subjects.</Typography>
  </MainLayout>
);

export default SubjectListPage;
