import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../components';
import { withPrivate } from '../../../lib';

export const CoursesPage: NextPage = () => (
  <Layout>
    <Typography variant="h5">Courses of a user</Typography>
  </Layout>
);

export default withPrivate(CoursesPage);
