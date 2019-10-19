import { NextPage } from 'next';
import React from 'react';
import { getUser, getUserMe } from '../../../actions';
import { MainLayout, NotFound, UserInfoCard } from '../../../components';

const UserPage: NextPage<any> = ({ user }) => (
  <MainLayout title="User">{user ? <UserInfoCard {...user} /> : <NotFound />}</MainLayout>
);

// eslint-disable-next-line
UserPage.getInitialProps = async ({ query, apolloClient, store }: any): Promise<any> => {
  const { userMe } = await store.dispatch(getUserMe(apolloClient));

  if (userMe) {
    if (query.id === userMe.id) {
      return { user: userMe };
    }
  }

  const { user } = await getUser(query.id, apolloClient);
  return { user };
};

export default UserPage;
