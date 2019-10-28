import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../../components';
import { withAuth } from '../../lib';

const UserListPage: NextPage = () => (
  <Layout title="User List">
    <Typography variant="h5">User List</Typography>
    <Typography variant="body1">
      Here will be a list of public user profiles, a leaderboard maybe?
    </Typography>
  </Layout>
);

export default withAuth(UserListPage);
