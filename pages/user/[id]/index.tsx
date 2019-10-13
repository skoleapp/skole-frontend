import { NextPage } from 'next';
import React from 'react';
import { MainLayout, UserInfoCard } from '../../../components';
import { User } from '../../../interfaces';
import { withApollo } from '../../../lib';

const UserPage: NextPage<User> = props => (
  <MainLayout title="User">
    <UserInfoCard {...props} />
  </MainLayout>
);

// eslint-disable-next-line
UserPage.getInitialProps = async ({ store, query }: any): Promise<any> => {
  const { authenticated, user } = await store.getState().auth;

  console.log(user);

  if (query.id === user.id) {
    console.log('ebin');
  }

  return {};
};

export default withApollo(UserPage);
