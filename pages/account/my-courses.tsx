import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../containers';
import { withPrivate } from '../../utils';

export const MyCoursesPage: NextPage = () => (
  <Layout title="My Courses" backUrl="/account">
    <Typography variant="h5">My Courses</Typography>
  </Layout>
);

export default withPrivate(MyCoursesPage);
