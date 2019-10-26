import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';

const FacultyListPage: NextPage = () => (
  <Layout title="Faculty List">
    <Typography variant="h5">Faculty List</Typography>
    <Typography variant="body1">Here will be list of all faculties.</Typography>
  </Layout>
);

export default FacultyListPage;
