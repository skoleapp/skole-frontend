import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';
import { withPrivate } from '../../../utils';

export const OwnCoursesListPage: NextPage = () => (
  <Layout>
    <Typography variant="h5">Lists of own courses.</Typography>
  </Layout>
);

export default withPrivate(OwnCoursesListPage);
