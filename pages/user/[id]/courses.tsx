import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { MainLayout } from '../../../components';

export const CoursesPage: NextPage = () => (
  <MainLayout>
    <Typography variant="h5">Courses of a user</Typography>
  </MainLayout>
);
