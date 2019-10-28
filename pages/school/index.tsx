import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { withAuth } from '../../lib';
import { Layout } from '../../components/templates/Layout';
import { ListingPage } from '../../components';

const SchoolListPage: NextPage = () => (
  <Layout title="School List">
    <Typography variant="h5">School List</Typography>
    <Typography variant="body1">Here will be list of all schools.</Typography>
    <ListingPage />
  </Layout>
);

export default withAuth(SchoolListPage);
