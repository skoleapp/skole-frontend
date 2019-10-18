import { NextPage } from 'next';
import React from 'react';
import { MainLayout, UserInfoCard } from '../../../components';
import { User } from '../../../interfaces';
import { getUser, getUserMe, withApollo } from '../../../lib';

const UserPage: NextPage<User> = props => (
  <MainLayout title="User">
    <UserInfoCard {...props} />
  </MainLayout>
);

// eslint-disable-next-line
UserPage.getInitialProps = async ({ query, apolloClient, store }: any): Promise<any> => {
  const { id } = store.getState().auth.user;

  // Fetch public user data if not own profile, otherwise fetch own profile.
  if (query.id !== 'me' || query.id !== id) {
    const { user } = await getUser(query.id, apolloClient);
    if (user) {
      return { ...user, private: false };
    }
  } else {
    const { userMe } = await getUserMe(apolloClient);
    if (userMe) {
      return { ...userMe, private: true };
    }
  }
};

export default withApollo(UserPage);
