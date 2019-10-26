import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';
import { withAuth } from '../../../lib';

const FacilityDetailPage: NextPage = () => (
  <Layout title="Facility Detail">
    <Typography variant="h5">Facility Detail</Typography>
    <Typography variant="body1">
      Here will be facility detail with a list of courses provided by that facility.
    </Typography>
  </Layout>
);

export default withAuth(FacilityDetailPage);
