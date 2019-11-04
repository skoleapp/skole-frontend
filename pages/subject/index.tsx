import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuthSync } from '../../utils';

const SubjectListPage: NextPage = () => (
  <Layout title="Subject List">
    <Typography variant="h5">Subject List</Typography>
  </Layout>
);

export default withAuthSync(SubjectListPage);
