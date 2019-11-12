import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../containers';
import { withPrivate } from '../../utils';

const ActivityPage: NextPage = () => (
  <Layout title="Activity" backUrl="/">
    <Typography variant="h5">Activity</Typography>
  </Layout>
);

export default withPrivate(ActivityPage);
