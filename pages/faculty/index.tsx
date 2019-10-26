import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../components';

const FacultyListPage: NextPage = () => (
  <MainLayout title="Faculty List">
    <Typography variant="h3">Faculty List</Typography>
    <Typography variant="body1">Here will be list of all faculties.</Typography>
  </MainLayout>
);

export default FacultyListPage;
