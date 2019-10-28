import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';

const FacultyDetailPage: NextPage = () => (
  <Layout title="Faculty Detail">
    <Typography variant="h5">Faculty Detail</Typography>
    <Typography variant="body1">Here will be faculty detail with a list of facilities.</Typography>
  </Layout>
);

export default FacultyDetailPage;
