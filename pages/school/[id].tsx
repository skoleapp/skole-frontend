import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuthSync } from '../../utils';

const SchoolDetailPage: NextPage = () => (
  <Layout title="School Detail">
    <Typography variant="h5">School Detail</Typography>
  </Layout>
);

export default withAuthSync(SchoolDetailPage);
