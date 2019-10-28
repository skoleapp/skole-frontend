import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';
import { withAuth } from '../../../lib';

const SchoolDetailPage: NextPage = () => (
  <Layout title="School Detail">
    <Typography variant="h5">School Detail</Typography>
    <Typography variant="body1">
      Here will be school detail with a list of faculties of that school.
    </Typography>
  </Layout>
);

export default withAuth(SchoolDetailPage);
