import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuth } from '../../lib';

const SubjectListPage: NextPage = () => (
  <Layout title="Subject List">
    <Typography variant="h5">Subject List</Typography>
    <Typography variant="body1">Here will be list of all subjects.</Typography>
  </Layout>
);

export default withAuth(SubjectListPage);
