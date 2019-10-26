import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../../components';

const SubjectDetailPage: NextPage = () => (
  <MainLayout title="Subject Detail">
    <Typography variant="h3">Subject Detail</Typography>
    <Typography variant="body1">
      Here will be subject detail with list of schools providing that subject.
    </Typography>
  </MainLayout>
);

export default SubjectDetailPage;
