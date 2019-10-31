import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../components';
import { withAuth } from '../lib';

const SearchPage: NextPage = () => (
  <Layout title="Search">
    <Typography variant="h5">Search</Typography>
    <Typography variant="body1">Search results will be shown here.</Typography>
  </Layout>
);

export default withAuth(SearchPage);
