import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';

const SubjectDetailPage: NextPage = () => (
  <Layout title="Subject Detail">
    <Typography variant="h5">Subject Detail</Typography>
    <Typography variant="body1">
      Here will be subject detail with list of schools providing that subject.
    </Typography>
  </Layout>
);

export default SubjectDetailPage;
