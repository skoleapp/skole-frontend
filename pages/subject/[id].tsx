import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuthSync } from '../../utils';

const SubjectDetailPage: NextPage = () => (
  <Layout title="Subject Detail">
    <Typography variant="h5">Subject Detail</Typography>
  </Layout>
);

export default withAuthSync(SubjectDetailPage);
