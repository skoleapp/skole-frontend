import { NextPage } from 'next';
import React from 'react';
import { getUser } from '../../../actions';
import { MainLayout, NotFoundCard, UserInfoCard } from '../../../components';
import { SkoleContext, UserPageInitialProps } from '../../../interfaces';
import { redirect, withAuthSync } from '../../../lib';

const userNotFoundText = 'The user you were looking for was not found...';

const UserPage: NextPage<any> = ({ user }) => (
  <MainLayout title="User">
    {user ? <UserInfoCard {...user} /> : <NotFoundCard text={userNotFoundText} />}
  </MainLayout>
);

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<UserPageInitialProps> => {
  const { store, query, apolloClient } = ctx;
  const { authenticated, user } = store.getState().auth;

  // Use public or private profile based on query.
  if (query.id !== user.id) {
    const { user } = await getUser(query.id as any, apolloClient);
    return { user };
  } else {
    if (!authenticated) {
      redirect(ctx, '/');
    } else {
      return { user };
    }
  }

  return {};
};

export default withAuthSync(UserPage);
