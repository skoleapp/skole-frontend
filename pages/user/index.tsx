import { NextPage } from 'next';
import React from 'react';
import { H1, MainLayout, Text } from '../../components';
import { withApollo } from '../../lib';

const UserListPage: NextPage = () => (
  <MainLayout title="User List">
    <H1>User List</H1>
    <Text>Here will be a list of public user profiles, a leaderboard maybe?</Text>
  </MainLayout>
);

export default withApollo(UserListPage);
