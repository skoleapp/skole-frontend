import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuth } from '../../lib';

const SchoolListPage: NextPage = () => (
  <Layout title="School List">
    <Typography variant="h5">School List</Typography>
    <Typography variant="body1">Here will be list of all schools.</Typography>
  </Layout>
);

export default withAuth(SchoolListPage);
