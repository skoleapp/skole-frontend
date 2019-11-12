import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const SearchPage: NextPage = () => (
  <Layout title="Search" backUrl="/">
    <Typography variant="h5">Search</Typography>
  </Layout>
);

export default withAuthSync(SearchPage);
