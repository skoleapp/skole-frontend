import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuthSync } from '../../utils';

const SchoolListPage: NextPage = () => (
  <Layout title="School List">
    <Typography variant="h5">School List</Typography>
  </Layout>
);

export default withAuthSync(SchoolListPage);
