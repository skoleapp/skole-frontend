import { NextPage } from 'next';
import React from 'react';
import { MainLayout, NotFound, UserInfoCard } from '../../../components';
import { getUser, getUserMe, withApollo } from '../../../lib';
import { SET_USER } from '../../../redux';

const UserPage: NextPage<any> = props => (
  <MainLayout title="User">
    {props.user ? <UserInfoCard {...props.user} /> : <NotFound />}
  </MainLayout>
);

// eslint-disable-next-line
UserPage.getInitialProps = async ({ query, apolloClient, store }: any): Promise<any> => {
  const { userMe } = await getUserMe(apolloClient);

  if (userMe) {
    store.dispatch({ type: SET_USER, payload: userMe });
    if (query.id === userMe.id) {
      return { user: userMe };
    }
  }

  const { user } = await getUser(query.id, apolloClient);
  return { user };
};

export default withApollo(UserPage);
