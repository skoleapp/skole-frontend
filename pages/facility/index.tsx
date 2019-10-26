import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuth } from '../../lib';

const FacilityListPage: NextPage = () => (
  <Layout title="Facility List">
    <Typography variant="h5">Facility List</Typography>
    <Typography variant="body1">Here will be list of facilities.</Typography>
  </Layout>
);

export default withAuth(FacilityListPage);
