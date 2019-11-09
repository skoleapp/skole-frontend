import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const SubjectPage: NextPage = () => (
  <Layout title="Subjects">
    <Typography variant="h5">Subjects</Typography>
  </Layout>
);

export default withAuthSync(SubjectPage);
