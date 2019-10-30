import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../../../components';
import { withPrivate } from '../../../../lib';

export const OwnCourseDetailPage: NextPage = () => (
  <Layout>
    <Typography variant="h5">Own course detail page.</Typography>
  </Layout>
);

export default withPrivate(OwnCourseDetailPage);
