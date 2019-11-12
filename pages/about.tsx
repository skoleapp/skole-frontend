import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout } from '../containers';
import { withApollo } from '../lib/apollo';
import { withRedux } from '../lib/redux';

const AboutPage: NextPage = () => (
  <Layout title="About" backUrl="/">
    <Typography variant="h5">About</Typography>
  </Layout>
);

export default compose(withRedux, withApollo)(AboutPage);
