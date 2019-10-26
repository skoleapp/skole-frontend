import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../../components';

const SchoolDetailPage: NextPage = () => (
  <MainLayout title="School Detail">
    <Typography variant="h3">School Detail</Typography>
    <Typography variant="body1">
      Here will be school detail with a list of faculties of that school.
    </Typography>
  </MainLayout>
);

export default SchoolDetailPage;
